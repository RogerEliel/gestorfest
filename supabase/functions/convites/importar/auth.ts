
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "./utils.ts";

/**
 * Authenticates the request and verifies event ownership
 */
export async function authenticateAndVerifyEventOwnership(req: Request, eventoId: string) {
  // Create Supabase client
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  // Authenticate user
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return {
      success: false,
      response: new Response(
        JSON.stringify({ error: "Autenticação necessária" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      ),
      supabase: null,
      profile: null
    };
  }

  const jwt = authHeader.replace("Bearer ", "");
  const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);

  if (authError || !user) {
    return {
      success: false,
      response: new Response(
        JSON.stringify({ error: "Usuário não autenticado" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      ),
      supabase: null,
      profile: null
    };
  }

  // Validate event ownership
  const { data: evento, error: eventoError } = await supabase
    .from("eventos")
    .select("usuario_id")
    .eq("id", eventoId)
    .single();

  if (eventoError || !evento) {
    return {
      success: false,
      response: new Response(
        JSON.stringify({ error: "Evento não encontrado" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      ),
      supabase,
      profile: null
    };
  }

  // Check if user owns the event
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("usuario_id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return {
      success: false,
      response: new Response(
        JSON.stringify({ error: "Perfil não encontrado" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      ),
      supabase,
      profile: null
    };
  }

  if (evento.usuario_id !== profile.usuario_id) {
    return {
      success: false,
      response: new Response(
        JSON.stringify({ error: "Acesso não autorizado a este evento" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      ),
      supabase,
      profile: null
    };
  }

  return {
    success: true,
    response: null,
    supabase,
    profile
  };
}
