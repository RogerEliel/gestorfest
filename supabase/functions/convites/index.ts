
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./utils.ts";
import { autenticarUsuario, createSupabaseClient } from "./auth.ts";
import { listarConvitesPorEvento, criarConvitesEmLote, atualizarStatusConvite } from "./convites-handlers.ts";
import { processarRespostaPublica, obterUrlConvite } from "./public-handlers.ts";
import { obterDetalhesConvite, reenviarConvite, obterDashboardEvento } from "./dashboard-handlers.ts";

// Main handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createSupabaseClient();

    // Parse the URL and extract path segments
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(segment => segment);
    
    // Check if this is a public response endpoint
    const isPublicResponse = pathSegments.includes('resposta-publica');
    
    // Authenticate user based on endpoint type
    const authResult = await autenticarUsuario(req, isPublicResponse);
    
    // For non-public endpoints, require authentication
    if (!isPublicResponse && !authResult.autenticado) {
      return new Response(
        JSON.stringify({ error: authResult.error }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    // For authenticated routes, ensure usuario_id is available
    const usuario_id = isPublicResponse ? null : authResult.usuario_id!;
    
    // Special case for importar endpoint - redirect to the dedicated import handler
    if (pathSegments.length >= 2 && pathSegments[0] === 'importar') {
      console.log("Redirecting to importar handler:", pathSegments);
      return await fetch(req);
    }
    
    // Improved routing with clear path segment extraction
    if (pathSegments.length >= 1) {
      // GET /convites/:id - Get invitation details
      if (pathSegments.length === 1 && req.method === "GET" && !isPublicResponse) {
        const conviteId = pathSegments[0];
        return await obterDetalhesConvite(supabase, conviteId, usuario_id!);
      }
      
      // Route: /eventos/:eventId/convites
      if (pathSegments[0] === 'eventos' && pathSegments.length >= 2) {
        const eventId = pathSegments[1];
        
        // GET /eventos/:eventId/dashboard - Get dashboard stats
        if (pathSegments.length === 3 && pathSegments[2] === 'dashboard' && req.method === "GET") {
          return await obterDashboardEvento(supabase, eventId, usuario_id!);
        }
        
        // GET /eventos/:eventId/convites - List all invitations for an event
        if ((pathSegments.length === 3 && pathSegments[2] === 'convites' && req.method === "GET") ||
            (pathSegments.length === 2 && req.method === "GET")) {
          return await listarConvitesPorEvento(supabase, eventId, usuario_id!);
        }
        
        // POST /eventos/:eventId/criar-lote - Create batch invitations
        if (pathSegments.length === 3 && pathSegments[2] === 'criar-lote' && req.method === "POST") {
          const convitesData = await req.json();
          return await criarConvitesEmLote(supabase, eventId, usuario_id!, convitesData);
        }
        
        // POST /eventos/:eventId/convites/:conviteId/reenviar - Resend invitation
        if (pathSegments.length === 5 && pathSegments[2] === 'convites' && pathSegments[4] === 'reenviar' && req.method === "POST") {
          const conviteId = pathSegments[3];
          return await reenviarConvite(supabase, eventId, conviteId, usuario_id!);
        }
        
        // POST /eventos/:eventId/convites/:conviteId/resposta - Update invitation response (RSVP)
        if (pathSegments.length === 5 && pathSegments[2] === 'convites' && pathSegments[4] === 'resposta' && req.method === "POST") {
          const conviteId = pathSegments[3];
          const updateData = await req.json();
          
          // Check if status is already the same
          const { data: conviteAtual } = await supabase
            .from('convites')
            .select('status')
            .eq('id', conviteId)
            .single();
          
          if (conviteAtual && conviteAtual.status === updateData.status) {
            return new Response(
              JSON.stringify({ 
                error: 'O convite já está com esse status',
                status_atual: conviteAtual.status
              }),
              { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } }
            );
          }
          
          return await atualizarStatusConvite(supabase, conviteId, usuario_id!, updateData);
        }
      }
      
      // PUT /:conviteId/status - Update invitation status (admin)
      if (pathSegments.length === 2 && pathSegments[1] === 'status' && req.method === "PUT" && !isPublicResponse) {
        const conviteId = pathSegments[0];
        const updateData = await req.json();
        return await atualizarStatusConvite(supabase, conviteId, usuario_id!, updateData);
      }
      
      // GET /:conviteId/url - Get friendly URL for invitation
      if (pathSegments.length === 2 && pathSegments[1] === 'url' && req.method === "GET" && !isPublicResponse) {
        const conviteId = pathSegments[0];
        return await obterUrlConvite(supabase, conviteId, usuario_id!);
      }
      
      // POST /resposta-publica/:slug/:conviteId - Process public response
      if (pathSegments[0] === 'resposta-publica' && pathSegments.length === 3 && req.method === "POST") {
        const slug = pathSegments[1];
        const conviteId = pathSegments[2];
        const updateData = await req.json();
        return await processarRespostaPublica(supabase, slug, conviteId, updateData);
      }
    }

    // If no route matched, return 404
    return new Response(
      JSON.stringify({ error: "Endpoint não encontrado" }),
      { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
