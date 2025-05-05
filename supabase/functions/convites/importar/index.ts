
import { corsHeaders } from "./utils.ts";
import { authenticateAndVerifyEventOwnership } from "./auth.ts";
import { insertConviteLote } from "./db-operations.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract evento ID from path
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const eventoId = pathParts[pathParts.length - 1];
    
    console.log("Processing import request for evento:", eventoId);

    // Authenticate request and verify event ownership
    const authResult = await authenticateAndVerifyEventOwnership(req, eventoId);
    
    if (!authResult.success) {
      return authResult.response;
    }
    
    // Parse JSON body
    const body = await req.json();
    const convites = body.convites;
    
    if (!convites || !Array.isArray(convites) || convites.length === 0) {
      return new Response(
        JSON.stringify({ error: "Dados de convites inválidos ou vazios" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Preparing to import ${convites.length} contacts`);

    // Insert contacts in batch
    const { data, errors, rowsInserted } = await insertConviteLote(
      authResult.supabase,
      eventoId,
      convites
    );

    console.log(`Import completed: ${rowsInserted} inserted, ${errors.length} failures`);

    // Return success response with details
    return new Response(
      JSON.stringify({
        inserted_count: rowsInserted,
        failures: errors,
      }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );

  } catch (error) {
    console.error("Error processing import request:", error);
    
    return new Response(
      JSON.stringify({
        error: "Erro ao processar solicitação de importação",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  }
});
