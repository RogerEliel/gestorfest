
import { corsHeaders } from "./utils.ts";
import { verificarAcessoAoEvento, verificarAcessoAoConvite } from "./auth.ts";

// Handler for getting invitation details
export async function obterDetalhesConvite(supabase: any, conviteId: string, usuario_id: string) {
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

// Handler for resending invitation
export async function reenviarConvite(supabase: any, eventId: string, conviteId: string, usuario_id: string) {
  const verificacao = await verificarAcessoAoConvite(supabase, conviteId, usuario_id);
  
  if (!verificacao.autorizado) {
    return new Response(
      JSON.stringify({ error: 'Convite não encontrado ou sem permissão' }),
      { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
  
  // Check if the invitation belongs to the specified event
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

  // Here, you would implement the queuing logic for sending via WhatsApp
  // For now, we just simulate that the sending was successfully completed

  return new Response(
    JSON.stringify({ 
      message: "Convite reenviado com sucesso",
      enviado_em: now,
      data: data[0]
    }),
    { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
  );
}

// Handler for getting dashboard statistics
export async function obterDashboardEvento(supabase: any, eventId: string, usuario_id: string) {
  const verificacao = await verificarAcessoAoEvento(supabase, eventId, usuario_id);
  
  if (!verificacao.autorizado) {
    return new Response(
      JSON.stringify({ error: 'Evento não encontrado ou sem permissão' }),
      { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
  
  // Query to count all invitations for the event
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
  
  // Query to count confirmed invitations
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
  
  // Query to count declined invitations
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
  
  // Query to count invitations that want to talk
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
  
  // Calculate pending and percentages
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
