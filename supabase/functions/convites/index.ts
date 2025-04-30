
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ConviteRequest {
  nome_convidado: string;
  telefone: string;
  mensagem_personalizada?: string;
}

type StatusConvite = "pendente" | "confirmado" | "recusado" | "conversar";

interface ConviteUpdateRequest {
  status: StatusConvite;
  resposta?: string;
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

    // Verificar autenticação (exceto para resposta pública de convidado)
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(segment => segment);
    const isPublicResponse = pathSegments.includes('resposta-publica');
    
    let user = null;
    let usuario_id = null;
    
    if (!isPublicResponse) {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: 'Autenticação necessária' }),
          { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const jwt = authHeader.replace('Bearer ', '');
      const { data: userData, error: authError } = await supabase.auth.getUser(jwt);

      if (authError || !userData.user) {
        return new Response(
          JSON.stringify({ error: 'Usuário não autenticado' }),
          { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      
      user = userData.user;
      
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
      
      usuario_id = profileData.usuario_id;
    }
    
    // Listar convites por evento (event_id from URL)
    if (pathSegments.includes('eventos') && req.method === "GET") {
      const eventId = pathSegments[pathSegments.indexOf('eventos') + 1];
      
      // Verificar se o evento pertence ao usuário
      const { data: eventoData, error: eventoError } = await supabase
        .from('eventos')
        .select('*')
        .eq('id', eventId)
        .eq('usuario_id', usuario_id)
        .single();
      
      if (eventoError || !eventoData) {
        return new Response(
          JSON.stringify({ error: 'Evento não encontrado ou sem permissão' }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      
      const { data, error } = await supabase
        .from('convites')
        .select('*')
        .eq('evento_id', eventId);

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
    
    // Criar convites em lote para um evento
    if (pathSegments.includes('eventos') && pathSegments.includes('criar-lote') && req.method === "POST") {
      const eventId = pathSegments[pathSegments.indexOf('eventos') + 1];
      
      // Verificar se o evento pertence ao usuário
      const { data: eventoData, error: eventoError } = await supabase
        .from('eventos')
        .select('*')
        .eq('id', eventId)
        .eq('usuario_id', usuario_id)
        .single();
      
      if (eventoError || !eventoData) {
        return new Response(
          JSON.stringify({ error: 'Evento não encontrado ou sem permissão' }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      
      const convitesData = await req.json() as ConviteRequest[];
      
      if (!Array.isArray(convitesData) || convitesData.length === 0) {
        return new Response(
          JSON.stringify({ error: 'Dados de convites inválidos. Deve ser um array não vazio.' }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      
      const convitesFormatados = convitesData.map(convite => ({
        evento_id: eventId,
        nome_convidado: convite.nome_convidado,
        telefone: convite.telefone,
        mensagem_personalizada: convite.mensagem_personalizada,
        responsavel_id: usuario_id
      }));
      
      // Verificar telefones duplicados antes de tentar inserir
      const telefones = convitesData.map(c => c.telefone);
      const telefonesUnicos = [...new Set(telefones)];
      
      if (telefones.length !== telefonesUnicos.length) {
        return new Response(
          JSON.stringify({ 
            error: 'Existem números de telefone duplicados na lista de convites',
            tipo: 'duplicidade_na_requisicao' 
          }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      
      // Verificar se algum telefone já existe para este evento
      const { data: telefonesExistentes } = await supabase
        .from('convites')
        .select('telefone')
        .eq('evento_id', eventId)
        .in('telefone', telefones);
      
      if (telefonesExistentes && telefonesExistentes.length > 0) {
        const duplicados = telefonesExistentes.map(item => item.telefone);
        return new Response(
          JSON.stringify({ 
            error: 'Alguns telefones já estão registrados para este evento', 
            telefones_duplicados: duplicados,
            tipo: 'duplicidade_no_banco' 
          }),
          { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      
      const { data, error } = await supabase
        .from('convites')
        .insert(convitesFormatados)
        .select();

      if (error) {
        // Verificar se o erro é de violação da constraint de unicidade
        if (error.code === '23505' && error.message.includes('unique_telefone_evento')) {
          return new Response(
            JSON.stringify({ 
              error: 'Um ou mais telefones já estão registrados para este evento',
              tipo: 'duplicidade_no_banco'
            }),
            { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
        
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      return new Response(
        JSON.stringify(data),
        { status: 201, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    // Atualizar status de um convite específico
    if (pathSegments.includes('status') && req.method === "PUT") {
      const conviteId = pathSegments[0];
      const updateData = await req.json() as ConviteUpdateRequest;
      
      // Verificar se o convite está associado a um evento do usuário
      const { data: conviteData, error: conviteError } = await supabase
        .from('convites')
        .select(`
          id,
          evento_id,
          eventos!inner(
            usuario_id
          )
        `)
        .eq('id', conviteId)
        .eq('eventos.usuario_id', usuario_id)
        .single();
      
      if (conviteError || !conviteData) {
        return new Response(
          JSON.stringify({ error: 'Convite não encontrado ou sem permissão' }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('convites')
        .update({
          status: updateData.status,
          resposta: updateData.resposta,
          respondido_em: now
        })
        .eq('id', conviteId)
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
    
    // Resposta pública para convidados (via link)
    if (pathSegments.includes('resposta-publica') && req.method === "POST") {
      const slug = pathSegments[pathSegments.indexOf('resposta-publica') + 1];
      const conviteId = pathSegments[pathSegments.indexOf('resposta-publica') + 2];
      const updateData = await req.json() as ConviteUpdateRequest;
      
      // Verificar se o convite existe e está associado ao evento com o slug fornecido
      const { data: conviteData, error: conviteError } = await supabase
        .from('convites')
        .select(`
          id,
          evento_id,
          eventos!inner(
            slug
          )
        `)
        .eq('id', conviteId)
        .eq('eventos.slug', slug)
        .single();
      
      if (conviteError || !conviteData) {
        return new Response(
          JSON.stringify({ error: 'Convite não encontrado ou inválido' }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('convites')
        .update({
          status: updateData.status,
          resposta: updateData.resposta,
          respondido_em: now
        })
        .eq('id', conviteId)
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
    
    // Obter URL amigável do convite
    if (pathSegments.includes('url') && req.method === "GET") {
      const conviteId = pathSegments[pathSegments.indexOf('url') + 1];
      
      // Verificar se o convite está associado a um evento do usuário
      const { data: conviteData, error: conviteError } = await supabase
        .from('convites')
        .select(`
          id,
          evento_id,
          eventos!inner(
            slug,
            usuario_id
          )
        `)
        .eq('id', conviteId)
        .eq('eventos.usuario_id', usuario_id)
        .single();
      
      if (conviteError || !conviteData) {
        return new Response(
          JSON.stringify({ error: 'Convite não encontrado ou sem permissão' }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      
      const baseUrl = Deno.env.get("PUBLIC_URL") || "https://seuapp.com";
      const responseUrl = `${baseUrl}/convite/${conviteData.eventos.slug}/${conviteData.id}`;
      
      return new Response(
        JSON.stringify({ url: responseUrl }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    // Obter detalhes de um convite específico
    if (!pathSegments.includes('eventos') && !pathSegments.includes('status') && 
        !pathSegments.includes('resposta-publica') && !pathSegments.includes('url') && 
        req.method === "GET") {
      const conviteId = pathSegments[0];
      
      // Verificar se o convite está associado a um evento do usuário
      const { data, error } = await supabase
        .from('convites')
        .select(`
          *,
          eventos!inner(
            nome,
            data_evento,
            local,
            slug,
            usuario_id
          )
        `)
        .eq('id', conviteId)
        .eq('eventos.usuario_id', usuario_id)
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

    return new Response(
      JSON.stringify({ error: "Endpoint não encontrado" }),
      { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
