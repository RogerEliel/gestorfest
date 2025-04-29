
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(segment => segment);
    const isRootPath = pathSegments.length === 1;
    const hasEventId = pathSegments.length > 1;
    const eventId = hasEventId ? pathSegments[1] : null;
    
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

    // Listar eventos do usuário
    if (isRootPath && req.method === "GET") {
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .eq('usuario_id', usuario_id);

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      return new Response(
        JSON.stringify(data),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Criar evento
    if (isRootPath && req.method === "POST") {
      const eventoData = await req.json() as EventoRequest;
      
      // Gerar slug único
      const { data: slugData } = await supabase.rpc(
        'generate_unique_slug', 
        { event_name: eventoData.nome }
      );
      
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

      return new Response(
        JSON.stringify(data[0]),
        { status: 201, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Obter evento específico
    if (hasEventId && req.method === "GET") {
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .eq('id', eventId)
        .eq('usuario_id', usuario_id)
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      return new Response(
        JSON.stringify(data),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Atualizar evento
    if (hasEventId && req.method === "PUT") {
      const eventoData = await req.json() as Partial<EventoRequest>;
      
      const { data, error } = await supabase
        .from('eventos')
        .update(eventoData)
        .eq('id', eventId)
        .eq('usuario_id', usuario_id)
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

    // Excluir evento
    if (hasEventId && req.method === "DELETE") {
      const { error } = await supabase
        .from('eventos')
        .delete()
        .eq('id', eventId)
        .eq('usuario_id', usuario_id);

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      return new Response(null, { status: 204, headers: corsHeaders });
    }

    return new Response(
      JSON.stringify({ error: "Endpoint não encontrado" }),
      { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
