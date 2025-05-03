
import { corsHeaders, ConviteUpdateRequest } from "./utils.ts";

// Handler for public guest responses
export async function processarRespostaPublica(supabase: any, slug: string, conviteId: string, updateData: ConviteUpdateRequest) {
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

// Handler for getting friendly URL for invitation
export async function obterUrlConvite(supabase: any, conviteId: string, usuario_id: string) {
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
