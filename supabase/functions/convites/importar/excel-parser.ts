
import * as XLSX from "npm:xlsx@0.18.5";
import { isValidPhoneNumber, formatPhoneNumber } from "./utils.ts";
import { corsHeaders } from "./utils.ts";

export interface ImportError {
  row: number;
  error: string;
}

/**
 * Parses and validates Excel file data
 */
export async function parseExcelFile(file: File) {
  // Check file type
  if (!file.name.toLowerCase().endsWith('.xlsx')) {
    return {
      success: false,
      response: new Response(
        JSON.stringify({ error: "Formato de arquivo inválido. Use .xlsx" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      ),
      data: null,
      toInsert: null,
      failures: null
    };
  }

  try {
    // Read the Excel file
    const fileBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(fileBuffer, { type: "array" });

    // Check if the workbook has sheets
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      return {
        success: false,
        response: new Response(
          JSON.stringify({ error: "Planilha vazia ou inválida" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        ),
        data: null,
        toInsert: null,
        failures: null
      };
    }

    // Try to find the sheet named "Convidados" or use the first sheet
    const sheetName = workbook.SheetNames.find(name => name.toLowerCase() === "convidados") || workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
      return {
        success: false,
        response: new Response(
          JSON.stringify({ error: "Aba 'Convidados' não encontrada" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        ),
        data: null,
        toInsert: null,
        failures: null
      };
    }

    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    if (!Array.isArray(jsonData) || jsonData.length === 0) {
      return {
        success: false,
        response: new Response(
          JSON.stringify({ error: "Nenhum dado encontrado na planilha" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        ),
        data: null,
        toInsert: null,
        failures: null
      };
    }

    console.log("Excel data parsed, rows:", jsonData.length);

    // Validate the structure - check if required columns exist
    const firstRow = jsonData[0] as Record<string, any>;
    const requiredColumns = ['nome_convidado', 'telefone'];
    const missingColumns = requiredColumns.filter(col => !(col in firstRow));

    if (missingColumns.length > 0) {
      return {
        success: false,
        response: new Response(
          JSON.stringify({ error: `Colunas obrigatórias faltando: ${missingColumns.join(", ")}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        ),
        data: null,
        toInsert: null,
        failures: null
      };
    }

    // Validate rows and prepare data for insertion
    const toInsert: Array<{
      nome_convidado: string;
      telefone: string;
      mensagem_personalizada: string | null;
      evento_id: string;
      status: string;
    }> = [];
    
    const failures: ImportError[] = [];

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
        evento_id: "", // Will be filled in with eventoId
        status: "pendente"
      };

      toInsert.push(convite);
    }

    return {
      success: true,
      response: null,
      data: jsonData,
      toInsert,
      failures
    };
  } catch (error) {
    console.error("Error parsing Excel file:", error);
    
    return {
      success: false,
      response: new Response(
        JSON.stringify({ error: "Erro ao processar arquivo Excel: " + (error instanceof Error ? error.message : "erro desconhecido") }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      ),
      data: null,
      toInsert: null,
      failures: null
    };
  }
}
