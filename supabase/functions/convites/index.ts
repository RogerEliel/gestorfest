
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
  consentimentoDado?: boolean;
}

// Criação do cliente Supabase
function createSupabaseClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );
}

// Verificação de autenticação
async function autenticarUsuario(req: Request, isPublicResponse: boolean) {
  if (isPublicResponse) {
    return { autenticado: true, usuario_id: null };
  }

  const supabase = createSupabaseClient();
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader) {
    return { autenticado: false, error: 'Autenticação necessária' };
  }

  const jwt = authHeader.replace('Bearer ', '');
  const { data: userData, error: authError } = await supabase.auth.getUser(jwt);

  if (authError || !userData.user) {
    return { autenticado: false, error: 'Usuário não autenticado' };
  }
  
  const { data: profileData } = await supabase
    .from('profiles')
    .select('usuario_id')
    .eq('id', userData.user.id)
    .single();
  
  if (!profileData?.usuario_id) {
    return { autenticado: false, error: 'Perfil de usuário não encontrado' };
  }
  
  return { autenticado: true, usuario: userData.user, usuario_id: profileData.usuario_id };
}

// Verificação de acesso ao evento
async function verificarAcessoAoEvento(supabase: any, eventId: string, usuario_id: string) {
  const { data: eventoData, error: eventoError } = await supabase
    .from('eventos')
    .select('*')
    .eq('id', eventId)
    .eq('usuario_id', usuario_id)
    .single();
  
  if (eventoError || !eventoData) {
    return { autorizado: false };
  }
  
  return { autorizado: true, evento: eventoData };
}

// Verificação de acesso ao convite
async function verificarAcessoAoConvite(supabase: any, conviteId: string, usuario_id: string) {
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
    return { autorizado: false };
  }
  
  return { autorizado: true, convite: conviteData };
}

// Handler para listar convites por evento
async function listarConvitesPorEvento(supabase: any, eventId: string, usuario_id: string) {
  const verificacao = await verificarAcessoAoEvento(supabase, eventId, usuario_id);
  
  if (!verificacao.autorizado) {
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

// Verificação de telefones duplicados
function verificarTelefonesDuplicados(convitesData: ConviteRequest[]) {
  const telefones = convitesData.map(c => c.telefone);
  const telefonesUnicos = [...new Set(telefones)];
  
  if (telefones.length !== telefonesUnicos.length) {
    return {
      hasDuplicados: true,
      response: new Response(
        JSON.stringify({ 
          error: 'Existem números de telefone duplicados na lista de convites',
          tipo: 'duplicidade_na_requisicao' 
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      )
    };
  }
  
  return { hasDuplicados: false };
}

// Verificação de telefones existentes
async function verificarTelefonesExistentes(supabase: any, eventId: string, telefones: string[]) {
  const { data: telefonesExistentes } = await supabase
    .from('convites')
    .select('telefone')
    .eq('evento_id', eventId)
    .in('telefone', telefones);
  
  if (telefonesExistentes && telefonesExistentes.length > 0) {
    const duplicados = telefonesExistentes.map(item => item.telefone);
    return {
      hasExistentes: true,
      response: new Response(
        JSON.stringify({ 
          error: 'Alguns telefones já estão registrados para este evento', 
          telefones_duplicados: duplicados,
          tipo: 'duplicidade_no_banco' 
        }),
        { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } }
      )
    };
  }
  
  return { hasExistentes: false };
}

// Handler para criar convites em lote
async function criarConvitesEmLote(supabase: any, eventId: string, usuario_id: string, convitesData: ConviteRequest[]) {
  const verificacao = await verificarAcessoAoEvento(supabase, eventId, usuario_id);
  
  if (!verificacao.autorizado) {
    return new Response(
      JSON.stringify({ error: 'Evento não encontrado ou sem permissão' }),
      { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
  
  if (!Array.isArray(convitesData) || convitesData.length === 0) {
    return new Response(
      JSON.stringify({ error: 'Dados de convites inválidos. Deve ser um array não vazio.' }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
  
  // Verificação de telefones duplicados na requisição
  const duplicadosCheck = verificarTelefonesDuplicados(convitesData);
  if (duplicadosCheck.hasDuplicados) {
    return duplicadosCheck.response;
  }
  
  // Verificação de telefones já existentes no banco
  const telefones = convitesData.map(c => c.telefone);
  const existentesCheck = await verificarTelefonesExistentes(supabase, eventId, telefones);
  if (existentesCheck.hasExistentes) {
    return existentesCheck.response;
  }
  
  const convitesFormatados = convitesData.map(convite => ({
    evento_id: eventId,
    nome_convidado: convite.nome_convidado,
    telefone: convite.telefone,
    mensagem_personalizada: convite.mensagem_personalizada,
    responsavel_id: usuario_id
  }));
  
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

// Handler para atualizar status de um convite
async function atualizarStatusConvite(supabase: any, conviteId: string, usuario_id: string, updateData: ConviteUpdateRequest) {
  const verificacao = await verificarAcessoAoConvite(supabase, conviteId, usuario_id);
  
  if (!verificacao.autorizado) {
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

// Handler para resposta pública de convidados
async function processarRespostaPublica(supabase: any, slug: string, conviteId: string, updateData: ConviteUpdateRequest) {
  // Verify that consent was given
  if (!updateData.consentimentoDado) {
    return new Response(
      JSON.stringify({ 
        error: 'Por favor, aceite o Termo de Consentimento para prosseguir.',
        tipo: 'consentimento_negado' 
      }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
  
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
      respondido_em: now,
      consentimento_dado: updateData.consentimentoDado
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

// Handler para obter URL amigável do convite
async function obterUrlConvite(supabase: any, conviteId: string, usuario_id: string) {
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

// Handler para obter detalhes de um convite
async function obterDetalhesConvite(supabase: any, conviteId: string, usuario_id: string) {
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

// Novo: Handler para reenviar convite
async function reenviarConvite(supabase: any, eventId: string, conviteId: string, usuario_id: string) {
  const verificacao = await verificarAcessoAoConvite(supabase, conviteId, usuario_id);
  
  if (!verificacao.autorizado) {
    return new Response(
      JSON.stringify({ error: 'Convite não encontrado ou sem permissão' }),
      { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
  
  // Verifica se o convite pertence ao evento especificado
  const { data: conviteCheck, error: conviteCheckError } = await supabase
    .from('convites')
    .select('evento_id')
    .eq('id', conviteId)
    .single();
  
  if (conviteCheckError || !conviteCheck || conviteCheck.evento_id !== eventId) {
    return new Response(
      JSON.stringify({ error: 'Convite não pertence ao evento especificado' }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
  
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('convites')
    .update({
      enviado_em: now
    })
    .eq('id', conviteId)
    .select();

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  // Aqui seria implementada a lógica de enfileiramento para envio via WhatsApp
  // Por enquanto, apenas simulamos que o envio foi realizado com sucesso

  return new Response(
    JSON.stringify({ 
      message: "Convite reenviado com sucesso",
      enviado_em: now,
      data: data[0]
    }),
    { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
  );
}

// Novo: Handler para obter estatísticas do dashboard
async function obterDashboardEvento(supabase: any, eventId: string, usuario_id: string) {
  const verificacao = await verificarAcessoAoEvento(supabase, eventId, usuario_id);
  
  if (!verificacao.autorizado) {
    return new Response(
      JSON.stringify({ error: 'Evento não encontrado ou sem permissão' }),
      { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
  
  // Consulta para contar todos os convites do evento
  const { count: totalConvites, error: errorTotal } = await supabase
    .from('convites')
    .select('*', { count: 'exact', head: true })
    .eq('evento_id', eventId);
  
  if (errorTotal) {
    return new Response(
      JSON.stringify({ error: errorTotal.message }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
  
  // Consulta para contar convites confirmados
  const { count: totalConfirmados, error: errorConfirmados } = await supabase
    .from('convites')
    .select('*', { count: 'exact', head: true })
    .eq('evento_id', eventId)
    .eq('status', 'confirmado');
  
  if (errorConfirmados) {
    return new Response(
      JSON.stringify({ error: errorConfirmados.message }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
  
  // Consulta para contar convites recusados
  const { count: totalRecusados, error: errorRecusados } = await supabase
    .from('convites')
    .select('*', { count: 'exact', head: true })
    .eq('evento_id', eventId)
    .eq('status', 'recusado');
  
  if (errorRecusados) {
    return new Response(
      JSON.stringify({ error: errorRecusados.message }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
  
  // Consulta para contar convites que querem conversar
  const { count: totalConversar, error: errorConversar } = await supabase
    .from('convites')
    .select('*', { count: 'exact', head: true })
    .eq('evento_id', eventId)
    .eq('status', 'conversar');
  
  if (errorConversar) {
    return new Response(
      JSON.stringify({ error: errorConversar.message }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
  
  // Calcular pendentes e porcentagens
  const totalPendentes = totalConvites - totalConfirmados - totalRecusados - totalConversar;
  
  const porcentagemConfirmados = totalConvites > 0 ? (totalConfirmados / totalConvites) * 100 : 0;
  const porcentagemRecusados = totalConvites > 0 ? (totalRecusados / totalConvites) * 100 : 0;
  const porcentagemPendentes = totalConvites > 0 ? (totalPendentes / totalConvites) * 100 : 0;
  const porcentagemConversar = totalConvites > 0 ? (totalConversar / totalConvites) * 100 : 0;
  
  const dashboardData = {
    total_convites: totalConvites,
    confirmados: {
      quantidade: totalConfirmados,
      porcentagem: porcentagemConfirmados
    },
    recusados: {
      quantidade: totalRecusados,
      porcentagem: porcentagemRecusados
    },
    pendentes: {
      quantidade: totalPendentes,
      porcentagem: porcentagemPendentes
    },
    conversar: {
      quantidade: totalConversar,
      porcentagem: porcentagemConversar
    },
    dados_grafico: [
      { nome: "Confirmados", valor: totalConfirmados, cor: "#4ade80" },
      { nome: "Recusados", valor: totalRecusados, cor: "#f87171" },
      { nome: "Pendentes", valor: totalPendentes, cor: "#94a3b8" },
      { nome: "Conversar", valor: totalConversar, cor: "#60a5fa" }
    ]
  };

  return new Response(
    JSON.stringify(dashboardData),
    { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
  );
}

// Handler principal
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createSupabaseClient();

    // Verificar autenticação (exceto para resposta pública de convidado)
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(segment => segment);
    const isPublicResponse = pathSegments.includes('resposta-publica');
    
    const authResult = await autenticarUsuario(req, isPublicResponse);
    
    if (!authResult.autenticado) {
      return new Response(
        JSON.stringify({ error: authResult.error }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    const usuario_id = authResult.usuario_id;
    
    // Listar convites por evento (event_id from URL)
    if (pathSegments.includes('eventos') && req.method === "GET") {
      const eventId = pathSegments[pathSegments.indexOf('eventos') + 1];
      
      // Verificar se é uma solicitação de dashboard
      if (pathSegments.includes('dashboard')) {
        return await obterDashboardEvento(supabase, eventId, usuario_id!);
      }
      
      return await listarConvitesPorEvento(supabase, eventId, usuario_id!);
    }
    
    // Criar convites em lote para um evento
    if (pathSegments.includes('eventos') && pathSegments.includes('criar-lote') && req.method === "POST") {
      const eventId = pathSegments[pathSegments.indexOf('eventos') + 1];
      const convitesData = await req.json() as ConviteRequest[];
      return await criarConvitesEmLote(supabase, eventId, usuario_id!, convitesData);
    }
    
    // Atualizar status de um convite específico (interno, por admin)
    if (pathSegments.includes('status') && req.method === "PUT") {
      const conviteId = pathSegments[0];
      const updateData = await req.json() as ConviteUpdateRequest;
      return await atualizarStatusConvite(supabase, conviteId, usuario_id!, updateData);
    }
    
    // Resposta pública para convidados (via link)
    if (pathSegments.includes('resposta-publica') && req.method === "POST") {
      const slug = pathSegments[pathSegments.indexOf('resposta-publica') + 1];
      const conviteId = pathSegments[pathSegments.indexOf('resposta-publica') + 2];
      const updateData = await req.json() as ConviteUpdateRequest;
      return await processarRespostaPublica(supabase, slug, conviteId, updateData);
    }
    
    // Novo: Reenvio de convite
    if (pathSegments.includes('eventos') && pathSegments.includes('convites') && 
        pathSegments.includes('reenviar') && req.method === "POST") {
      const eventId = pathSegments[pathSegments.indexOf('eventos') + 1];
      const conviteId = pathSegments[pathSegments.indexOf('convites') + 1];
      return await reenviarConvite(supabase, eventId, conviteId, usuario_id!);
    }
    
    // Novo: Atualizar resposta de um convite (RSVP)
    if (pathSegments.includes('eventos') && pathSegments.includes('convites') && 
        pathSegments.includes('resposta') && req.method === "POST") {
      const conviteId = pathSegments[pathSegments.indexOf('convites') + 1];
      const updateData = await req.json() as ConviteUpdateRequest;
      
      // Verificar se o status já é o mesmo
      const { data: conviteAtual } = await supabase
        .from('convites')
        .select('status')
        .eq('id', conviteId)
        .single();
      
      if (conviteAtual && conviteAtual.status === updateData.status) {
        return new Response(
          JSON.stringify({ 
            error: 'O convite já está com esse status',
            status_atual: conviteAtual.status
          }),
          { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      
      return await atualizarStatusConvite(supabase, conviteId, usuario_id!, updateData);
    }
    
    // Obter URL amigável do convite
    if (pathSegments.includes('url') && req.method === "GET") {
      const conviteId = pathSegments[pathSegments.indexOf('url') + 1];
      return await obterUrlConvite(supabase, conviteId, usuario_id!);
    }
    
    // Obter detalhes de um convite específico
    if (!pathSegments.includes('eventos') && !pathSegments.includes('status') && 
        !pathSegments.includes('resposta-publica') && !pathSegments.includes('url') && 
        req.method === "GET") {
      const conviteId = pathSegments[0];
      return await obterDetalhesConvite(supabase, conviteId, usuario_id!);
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

/*
 * Próximo passo - Passo 5: Testes End-to-End & Otimizações
 * Implementação de testes end-to-end do fluxo completo:
 * signup → evento → import → RSVP → dashboard
 * Otimizações de UX e performance
 */
