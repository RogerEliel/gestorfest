
// Import required dependencies
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../../eventos/utils.ts";

// Main function to handle requests
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Parse request details
    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/").filter(segment => segment);
    const eventoId = pathSegments[2]; // Get evento ID from URL

    if (!eventoId) {
      return new Response(
        JSON.stringify({ error: "ID do evento ausente" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Authenticate user
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Autenticação necessária" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const jwt = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Usuário não autenticado" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate event ownership
    const { data: evento, error: eventoError } = await supabase
      .from("eventos")
      .select("usuario_id")
      .eq("id", eventoId)
      .single();

    if (eventoError || !evento) {
      return new Response(
        JSON.stringify({ error: "Evento não encontrado" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user owns the event
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("usuario_id")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: "Perfil não encontrado" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (evento.usuario_id !== profile.usuario_id) {
      return new Response(
        JSON.stringify({ error: "Acesso não autorizado a este evento" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get convites data from request
    const { convites } = await req.json();

    if (!convites || !Array.isArray(convites) || convites.length === 0) {
      return new Response(
        JSON.stringify({ error: "Dados de convites inválidos" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert convites
    const convitesWithEventId = convites.map(convite => ({
      ...convite,
      evento_id: eventoId,
      status: "pendente"
    }));

    const { data: insertedConvites, error: insertError } = await supabase
      .from("convites")
      .insert(convitesWithEventId)
      .select();

    if (insertError) {
      console.error("Error inserting invitations:", insertError);
      return new Response(
        JSON.stringify({ error: "Erro ao importar convidados", details: insertError.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: insertedConvites }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error processing import:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
