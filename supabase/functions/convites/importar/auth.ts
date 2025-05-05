
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { corsHeaders } from "./utils.ts";

// Environment variables
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

export async function authenticateAndVerifyEventOwnership(req: Request, eventoId: string) {
  try {
    // Create Supabase admin client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Extract the token from the Authorization header
    const authHeader = req.headers.get("Authorization");
    console.log("Auth header:", authHeader ? "Present" : "Missing");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        success: false,
        response: new Response(
          JSON.stringify({ error: "Autorização ausente ou inválida" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      };
    }
    
    const token = authHeader.replace("Bearer ", "");
    
    // Verify the token and get the user
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error("User authentication error:", userError);
      return {
        success: false,
        response: new Response(
          JSON.stringify({ error: "Usuário não autenticado", details: userError?.message }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      };
    }
    
    console.log("User authenticated:", user.id);
    
    // Get the user profile
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, usuario_id")
      .eq("id", user.id)
      .single();
    
    if (profileError || !profileData) {
      console.error("Profile fetch error:", profileError);
      return {
        success: false,
        response: new Response(
          JSON.stringify({ error: "Perfil de usuário não encontrado", details: profileError?.message }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      };
    }
    
    console.log("Profile found:", profileData);
    
    // Check if user can access the event
    const { data: evento, error: eventoError } = await supabase
      .from("eventos")
      .select("id, usuario_id")
      .eq("id", eventoId)
      .single();
    
    if (eventoError || !evento) {
      console.error("Event fetch error:", eventoError);
      return {
        success: false,
        response: new Response(
          JSON.stringify({ error: "Evento não encontrado", details: eventoError?.message }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      };
    }
    
    console.log("Event found:", evento);
    console.log("Comparing user IDs:", profileData.usuario_id, "vs", evento.usuario_id);
    
    // Verify event ownership - check if the user owns the event
    if (profileData.usuario_id !== evento.usuario_id) {
      return {
        success: false,
        response: new Response(
          JSON.stringify({ error: "Usuário não tem permissão para acessar este evento" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      };
    }
    
    // User is authenticated and owns the event
    return {
      success: true,
      supabase,
      profile: profileData
    };
    
  } catch (error) {
    console.error("Authentication error:", error);
    return {
      success: false,
      response: new Response(
        JSON.stringify({ error: "Erro de autenticação", details: error instanceof Error ? error.message : "Erro desconhecido" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    };
  }
}
