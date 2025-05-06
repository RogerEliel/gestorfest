
import { createClient } from "npm:@supabase/supabase-js";
import { corsHeaders, handleOptions, authenticateUser, ensureUserProfile } from "./utils.ts";
import { 
  getEventos, 
  createEvento, 
  getEventoById, 
  updateEvento, 
  deleteEvento,
  type EventoRequest 
} from "./event-operations.ts";
import { adicionarConvidado, listarConvidados } from "./convidados-handlers.ts";

// Main function to process requests
async function handler(req) {
  if (req.method === "OPTIONS") {
    return handleOptions();
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get route information
    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/").filter(segment => segment);

    // Rotas para gerenciamento de convidados
    if (
      pathSegments.length >= 3 && 
      pathSegments[0] === "eventos" && 
      pathSegments[2] === "convidados"
    ) {
      const eventoId = pathSegments[1];
      
      // POST /eventos/{eventoId}/convidados - Adicionar convidado
      if (req.method === "POST") {
        return await adicionarConvidado(req, supabase, eventoId);
      }
      
      // GET /eventos/{eventoId}/convidados - Listar convidados
      if (req.method === "GET") {
        return await listarConvidados(req, supabase, eventoId);
      }
    }

    // Roteamento original para operações de eventos
    // Authenticate user
    const authHeader = req.headers.get("authorization");
    const authResult = await authenticateUser(supabase, authHeader);

    if (authResult.error) {
      return new Response(
        JSON.stringify({ error: authResult.error }),
        { status: authResult.status, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const user = authResult.user;

    const isRootPath = pathSegments.length === 1;
    const hasEventParam = pathSegments.length > 1;
    const eventParam = hasEventParam ? pathSegments[1] : null;

    // Ensure user profile
    const profileResult = await ensureUserProfile(supabase, user);

    if (profileResult.error) {
      return new Response(
        JSON.stringify({ error: profileResult.error, details: profileResult.details }),
        { status: profileResult.status, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const usuario_id = profileResult.profile.usuario_id;

    // Route the request to the appropriate function
    let result;

    if (isRootPath && req.method === "GET") {
      result = await getEventos(supabase, usuario_id);
    } else if (isRootPath && req.method === "POST") {
      const eventoData = await req.json() as EventoRequest;
      result = await createEvento(supabase, eventoData, usuario_id);
    } else if (hasEventParam && req.method === "GET") {
      result = await getEventoById(supabase, eventParam, usuario_id);
    } else if (hasEventParam && req.method === "PUT") {
      const eventoData = await req.json() as Partial<EventoRequest>;
      result = await updateEvento(supabase, eventParam, eventoData, usuario_id);
    } else if (hasEventParam && req.method === "DELETE") {
      result = await deleteEvento(supabase, eventParam, usuario_id);
    } else {
      result = { error: "Endpoint não encontrado", status: 404 };
    }

    // Prepare response
    if (result.error) {
      return new Response(
        JSON.stringify({ error: result.error, details: result.details }),
        { status: result.status || 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (result.status === 204) {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    return new Response(
      JSON.stringify(result.data),
      { status: result.status || 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (err) {
    console.error("Function error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Erro desconhecido" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
}

// Start the server using Deno.serve
Deno.serve(handler);
