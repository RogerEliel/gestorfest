import { serve } from "https://deno.land/std@0.200.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";


const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EventoRequest {
  nome: string;
  data_evento: string;
  local: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Verificar autenticação
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Autenticação necessária' }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Usuário não autenticado' }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    // Processar a URL e extrair segmentos do caminho
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(segment => segment);
    
    // Verifica se estamos na rota raiz /eventos ou em uma subrota /eventos/{id}
    const isRootPath = pathSegments.length === 1;
    const hasEventParam = pathSegments.length > 1;
    
    // O parâmetro pode ser um ID ou um slug
    const eventParam = hasEventParam ? pathSegments[1] : null;
    
    // Obter perfil do usuário
    const { data: profileData } = await supabase
      .from('profiles')
      .select('usuario_id')
      .eq('id', user.id)
      .single();
    
    if (!profileData?.usuario_id) {
      return new Response(
        JSON.stringify({ error: 'Perfil de usuário não encontrado' }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const usuario_id = profileData.usuario_id;

    // Listar eventos do usuário - GET /eventos
    if (isRootPath && req.method === "GET") {
      const { data, error } = await supabase
        .from('eventos')
        .select('*, convites:convites(count)')
        .eq('usuario_id', usuario_id)
        .order('data_evento', { ascending: true })
        .then(res => {
          if (res.data) {
            // Processar os dados para incluir contagens de convidados
            return {
              ...res,
              data: res.data.map(evento => ({
                ...evento,
                total_convidados: evento.convites?.length || 0,
                convites: undefined // Remover os dados brutos dos convites
              }))
            };
          }
          return res;
        });

      if (error) {
        return new Response(
          JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      return new Response(
        JSON.stringify(data),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Criar evento - POST /eventos
    if (isRootPath && req.method === "POST") {
      const eventoData = await req.json() as EventoRequest;
      
      // Validar campos obrigatórios
      if (!eventoData.nome || !eventoData.data_evento || !eventoData.local) {
        return new Response(
          JSON.stringify({ error: 'Nome, data e local são campos obrigatórios' }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      
      // Validar formato da data
      const dataEvento = new Date(eventoData.data_evento);
      if (isNaN(dataEvento.getTime())) {
        return new Response(
          JSON.stringify({ error: 'Formato de data inválido' }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      
      // Gerar slug único usando a função da database
      const { data: slugData, error: slugError } = await supabase.rpc(
        'generate_unique_slug', 
        { event_name: eventoData.nome }
      );
      
      if (slugError) {
        return new Response(
          JSON.stringify({ error: 'Erro ao gerar slug único', details: slugError.message }),
          { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      
      const { data, error } = await supabase
        .from('eventos')
        .insert([
          { 
            nome: eventoData.nome, 
            data_evento: eventoData.data_evento, 
            local: eventoData.local,
            usuario_id: usuario_id,
            slug: slugData
          }
        ])
        .select();

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Retorna 201 Created com o objeto evento
      return new Response(
        JSON.stringify(data[0]),
        { status: 201, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Obter evento específico por ID ou slug - GET /eventos/{id} ou GET /eventos/{slug}
    if (hasEventParam && req.method === "GET") {
      // Verificar se o parâmetro é um UUID (id) ou uma string (slug)
      const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(eventParam);
      
      let query = supabase.from('eventos').select('*');
      
      if (isUUID) {
        query = query.eq('id', eventParam);
      } else {
        query = query.eq('slug', eventParam);
      }
      
      // Garantir que o usuário só acesse seus próprios eventos
      query = query.eq('usuario_id', usuario_id);
      
      const { data, error } = await query.single();

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Evento não encontrado ou você não tem permissão para acessá-lo' }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      return new Response(
        JSON.stringify(data),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Atualizar evento - PUT /eventos/{id}
    if (hasEventParam && req.method === "PUT") {
      const eventoData = await req.json() as Partial<EventoRequest>;
      
      // Se o nome for alterado, gerar novo slug
      if (eventoData.nome) {
        const { data: slugData, error: slugError } = await supabase.rpc(
          'generate_unique_slug', 
          { event_name: eventoData.nome }
        );
        
        if (slugError) {
          return new Response(
            JSON.stringify({ error: 'Erro ao gerar slug único', details: slugError.message }),
            { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
        
        eventoData['slug'] = slugData;
      }
      
      const { data, error } = await supabase
        .from('eventos')
        .update(eventoData)
        .eq('id', eventParam)
        .eq('usuario_id', usuario_id)  // Garantir que o usuário só atualize seus próprios eventos
        .select();

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      return new Response(
        JSON.stringify(data[0]),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Excluir evento - DELETE /eventos/{id}
    if (hasEventParam && req.method === "DELETE") {
      const { error } = await supabase
        .from('eventos')
        .delete()
        .eq('id', eventParam)
        .eq('usuario_id', usuario_id);  // Garantir que o usuário só exclua seus próprios eventos

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Endpoint não encontrado
    return new Response(
      JSON.stringify({ error: "Endpoint não encontrado" }),
      { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
    
    /*
     * Próximo passo - Passo 3: Importação de Convidados
     * Endpoint: POST /eventos/{id}/convites/import
     * Este endpoint permitirá a importação de convidados em lote para um evento.
     * Será implementado no próximo módulo.
     */
  } catch (error) {
    console.error("Erro na função de eventos:", error);
  
    const errorMessage = error instanceof Error ? error.message : String(error);
  
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
} 
)