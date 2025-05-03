// Import required dependencies
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../../eventos/utils.ts";
import * as XLSX from "npm:xlsx@0.18.5";
import { Buffer } from "https://deno.land/std@0.177.0/node/buffer.ts";

// Function to validate a phone number
function isValidPhoneNumber(phone: string): boolean {
  // Remove all non-digit characters except for the + at the beginning
  const cleanedPhone = phone.replace(/[^\d+]/g, '');
  
  // Check if the phone starts with + and has at least 8 digits
  if (/^\+\d{8,15}$/.test(cleanedPhone)) {
    return true;
  }
  
  // Check if the phone is just digits and has at least 8 digits
  if (/^\d{8,15}$/.test(cleanedPhone)) {
    return true;
  }
  
  return false;
}

// Function to format a phone number to international format with + if needed
function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // If the phone already starts with +, return it as is
  if (phone.startsWith('+')) {
    return phone;
  }
  
  // For Brazilian numbers
  if (digits.length === 11 || digits.length === 10) {
    return `+55${digits}`;
  }
  
  // If not recognized as Brazilian, just add + at the beginning
  return `+${digits}`;
}

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

    if (!file || !(file instanceof File)) {
      return new Response(
        JSON.stringify({ error: "Arquivo não encontrado ou inválido" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check file type
    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      return new Response(
        JSON.stringify({ error: "Formato de arquivo inválido. Use .xlsx" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Read the Excel file
    const fileBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(fileBuffer, { type: "array" });

    // Check if the workbook has sheets
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      return new Response(
        JSON.stringify({ error: "Planilha vazia ou inválida" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Try to find the sheet named "Convidados" or use the first sheet
    const sheetName = workbook.SheetNames.find(name => name.toLowerCase() === "convidados") || workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
      return new Response(
        JSON.stringify({ error: "Aba 'Convidados' não encontrada" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    if (!Array.isArray(jsonData) || jsonData.length === 0) {
      return new Response(
        JSON.stringify({ error: "Nenhum dado encontrado na planilha" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate the structure - check if required columns exist
    const firstRow = jsonData[0] as Record<string, any>;
    const requiredColumns = ['nome_convidado', 'telefone'];
    const missingColumns = requiredColumns.filter(col => !(col in firstRow));

    if (missingColumns.length > 0) {
      return new Response(
        JSON.stringify({ error: `Colunas obrigatórias faltando: ${missingColumns.join(", ")}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate rows and prepare data for insertion
    const toInsert = [];
    const failures = [];

    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i] as Record<string, any>;
      const rowNumber = i + 2; // +2 because Excel is 1-indexed and we skip the header row

      // Basic validation
      if (!row.nome_convidado || row.nome_convidado.trim() === '') {
        failures.push({
          row: rowNumber,
          error: "Nome do convidado é obrigatório"
        });
        continue;
      }

      if (!row.telefone || row.telefone.toString().trim() === '') {
        failures.push({
          row: rowNumber,
          error: "Telefone do convidado é obrigatório"
        });
        continue;
      }

      // Phone validation
      const phone = row.telefone.toString();
      if (!isValidPhoneNumber(phone)) {
        failures.push({
          row: rowNumber,
          error: "Formato de telefone inválido. Use formato internacional: +5511999999999"
        });
        continue;
      }

      // Sanitize data
      const convite = {
        nome_convidado: String(row.nome_convidado).trim().slice(0, 255),
        telefone: formatPhoneNumber(phone),
        mensagem_personalizada: row.observacao ? String(row.observacao).trim().slice(0, 500) : null,
        evento_id: eventoId,
        status: "pendente"
      };

      toInsert.push(convite);
    }

    // If nothing to insert, return early with failures
    if (toInsert.length === 0) {
      return new Response(
        JSON.stringify({ 
          inserted_count: 0,
          failures
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Begin transaction to insert the data
    let insertedCount = 0;
    const { data: insertData, error: insertError } = await supabase
      .from("convites")
      .insert(toInsert)
      .select();

    if (insertError) {
      console.error("Error inserting invitations:", insertError);
      return new Response(
        JSON.stringify({ error: "Erro ao importar convidados", details: insertError.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    insertedCount = insertData ? insertData.length : 0;

    // Log the import in the audit table
    await supabase
      .from("auditoria_importacoes")
      .insert({
        evento_id: eventoId,
        usuario_id: profile.usuario_id,
        total_registros: toInsert.length + failures.length,
        registros_importados: insertedCount,
        registros_falha: failures.length,
        detalhes_falhas: failures.length > 0 ? failures : null
      });

    return new Response(
      JSON.stringify({ 
        inserted_count: insertedCount,
        failures 
      }),
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
