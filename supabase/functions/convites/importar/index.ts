
// Import required dependencies
import { corsHeaders } from "./utils.ts";
import { authenticateAndVerifyEventOwnership } from "./auth.ts";
import { parseExcelFile } from "./excel-parser.ts";
import { insertGuestData } from "./db-operations.ts";

// Main function to handle requests
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: {
        ...corsHeaders,
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
      } 
    });
  }

  try {
    console.log("Import handler started");
    
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
      return authResult.response!;
    }

    const { supabase, profile } = authResult;

    // Get the Excel file from request
    if (!req.body) {
      return new Response(
        JSON.stringify({ error: "Arquivo não encontrado na requisição" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Read the form data
    const formData = await req.formData();
    const file = formData.get("file");

    console.log("File received:", file ? "yes" : "no");

    if (!file || !(file instanceof File)) {
      return new Response(
        JSON.stringify({ error: "Arquivo não encontrado ou inválido" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse and validate the Excel file
    const parseResult = await parseExcelFile(file);
    if (!parseResult.success) {
      return parseResult.response!;
    }

    const { toInsert, failures } = parseResult;

    // Insert data into the database
    const insertResult = await insertGuestData(
      supabase, 
      eventoId, 
      profile!.usuario_id, 
      toInsert!, 
      failures!
    );
    
    return insertResult.response!;

  } catch (error) {
    console.error("Error processing import:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
