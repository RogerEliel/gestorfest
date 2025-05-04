
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "./utils.ts";

// Authenticate user and verify if the request is public or needs authentication
export async function autenticarUsuario(req: Request, isPublicResponse: boolean) {
  if (isPublicResponse) {
    return { autenticado: true, usuario_id: null };
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );
  
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

// Create Supabase client
export function createSupabaseClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );
}

// Verify event ownership and access rights
export async function verificarAcessoAoEvento(supabase: any, eventId: string, usuario_id: string) {
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

// Verify access to a specific invitation
export async function verificarAcessoAoConvite(supabase: any, conviteId: string, usuario_id: string) {
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

// Verify existing phone numbers to avoid duplicates
export async function verificarTelefonesExistentes(supabase: any, eventId: string, telefones: string[]) {
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
