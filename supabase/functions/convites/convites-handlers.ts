
import { corsHeaders, ConviteRequest, ConviteUpdateRequest, verificarTelefonesDuplicados } from "./utils.ts";
import { verificarAcessoAoEvento, verificarAcessoAoConvite, verificarTelefonesExistentes } from "./auth.ts";

// Handler for listing invitations by event
export async function listarConvitesPorEvento(supabase: any, eventId: string, usuario_id: string) {
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

// Handler for creating batch invitations
export async function criarConvitesEmLote(supabase: any, eventId: string, usuario_id: string, convitesData: ConviteRequest[]) {
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
  
  // Check for duplicate phone numbers in the request
  const duplicadosCheck = verificarTelefonesDuplicados(convitesData);
  if (duplicadosCheck.hasDuplicados) {
    return duplicadosCheck.response;
  }
  
  // Check for existing phone numbers in the database
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
    // Check if the error is a unique constraint violation
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

// Handler for updating invitation status
export async function atualizarStatusConvite(supabase: any, conviteId: string, usuario_id: string, updateData: ConviteUpdateRequest) {
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
