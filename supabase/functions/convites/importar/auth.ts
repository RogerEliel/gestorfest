
import { corsHeaders } from "./utils.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

/**
 * Authenticates the request and verifies that the user owns the evento
 */
export async function authenticateAndVerifyEventOwnership(req: Request, eventoId: string) {
  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      return {
        success: false,
        response: new Response(
          JSON.stringify({ error: "Não autorizado" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      };
    }
    
    // Extract token from header
    const token = authHeader.replace('Bearer ', '');
    
    // Initialize Supabase client with service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        }
      }
    );
    
    // Verify the token and get user information
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error("Authentication error:", authError);
      return {
        success: false,
        response: new Response(
          JSON.stringify({ error: "Token inválido" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      };
    }
    
    // Verify that the user owns the event
    const { data: evento, error: eventoError } = await supabase
      .from('eventos')
      .select('id')
      .eq('id', eventoId)
      .eq('usuario_id', user.id)
      .single();
    
    if (eventoError || !evento) {
      console.error("Event ownership verification error:", eventoError);
      return {
        success: false,
        response: new Response(
          JSON.stringify({ error: "Você não tem permissão para acessar este evento" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      };
    }
    
    return {
      success: true,
      supabase,
      user
    };
  } catch (error) {
    console.error("Auth error:", error);
    return {
      success: false,
      response: new Response(
        JSON.stringify({ error: "Erro de autenticação" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    };
  }
}
