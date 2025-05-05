
// Import required dependencies
import { corsHeaders } from "./utils.ts";
import { authenticateAndVerifyEventOwnership } from "./auth.ts";
import { insertGuestData } from "./db-operations.ts";

export interface ImportError {
  row: number;
  error: string;
}

// Main function to handle requests
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: {
        ...corsHeaders,
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      } 
    });
  }

  try {
    console.log("Import handler started");
    console.log("Request method:", req.method);
    console.log("Request headers:", [...req.headers.entries()].map(([k, v]) => `${k}: ${v.substring(0, 15)}...`).join(', '));
    
    // Parse request details
    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/").filter(segment => segment);
    
    // Extract the evento ID from the path
    // Path should be: /convites/importar/:eventoId
    const eventoId = pathSegments[2]; // Get evento ID from URL

    console.log("Extracted event ID:", eventoId);

    if (!eventoId) {
      return new Response(
        JSON.stringify({ error: "ID do evento ausente" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Authenticate user and verify event ownership
    const authResult = await authenticateAndVerifyEventOwnership(req, eventoId);
    if (!authResult.success) {
      console.log("Authentication failed:", authResult);
      return authResult.response!;
    }

    const { supabase, profile } = authResult;
    console.log("User authenticated, profile:", profile?.usuario_id);

    // Parse the JSON body
    if (!req.body) {
      return new Response(
        JSON.stringify({ error: "Dados não encontrados na requisição" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    try {
      // Read the JSON data
      const body = await req.json();
      const convites = body.convites as Array<{
        nome_convidado: string;
        telefone: string;
        mensagem_personalizada?: string | null;
      }>;

      console.log("Received convites data:", convites?.length, "records");
      
      if (!convites || !Array.isArray(convites) || convites.length === 0) {
        return new Response(
          JSON.stringify({ error: "Nenhum convidado para importar" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Process and validate the data
      const toInsert: Array<{
        nome_convidado: string;
        telefone: string;
        mensagem_personalizada: string | null;
        evento_id: string;
        status: string;
      }> = [];
      
      const failures: ImportError[] = [];
      
      // Validate each contact entry
      convites.forEach((convite, index) => {
        if (!convite.nome_convidado) {
          failures.push({
            row: index + 1,
            error: "Nome do convidado é obrigatório"
          });
          return;
        }
        
        if (!convite.telefone) {
          failures.push({
            row: index + 1,
            error: "Telefone é obrigatório"
          });
          return;
        }
        
        // Add validated record
        toInsert.push({
          nome_convidado: convite.nome_convidado,
          telefone: convite.telefone,
          mensagem_personalizada: convite.mensagem_personalizada || null,
          evento_id: eventoId,
          status: "pendente"
        });
      });

      console.log("Validation complete. Valid:", toInsert.length, "Failed:", failures.length);

      // Insert data into the database
      const insertResult = await insertGuestData(
        supabase, 
        eventoId, 
        profile!.usuario_id, 
        toInsert, 
        failures
      );
      
      return insertResult.response!;
    } catch (parseError) {
      console.error("Error parsing request data:", parseError);
      return new Response(
        JSON.stringify({ 
          error: "Erro ao processar dados da requisição", 
          details: parseError instanceof Error ? parseError.message : "Erro desconhecido" 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error processing import:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
