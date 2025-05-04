
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
    console.error("Authorization header missing");
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

  console.log("Auth header present:", authHeader.substring(0, 15) + "...");
  
  const jwt = authHeader.replace("Bearer ", "");
  const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);

  if (authError || !user) {
    console.error("Auth error or no user:", authError);
    return {
      success: false,
      response: new Response(
        JSON.stringify({ error: "Usuário não autenticado", details: authError?.message }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      ),
      supabase: null,
      profile: null
    };
  }

  console.log("User authenticated:", user.id);

  // Validate event ownership
  const { data: evento, error: eventoError } = await supabase
    .from("eventos")
    .select("usuario_id")
    .eq("id", eventoId)
    .single();

  if (eventoError || !evento) {
    console.error("Event not found:", eventoError);
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
    console.error("Profile not found:", profileError);
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

  console.log("User profile:", profile.usuario_id, "Event owner:", evento.usuario_id);

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
