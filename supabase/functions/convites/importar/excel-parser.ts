
// Import required dependencies
import * as XLSX from 'npm:xlsx';
import { corsHeaders } from "./utils.ts";

// Define interface for import errors
export interface ImportError {
  row: number;
  error: string;
}

// Interface for successful parse result
interface ParseResult {
  success: boolean;
  response?: Response;
  toInsert?: Array<{
    nome_convidado: string;
    telefone: string;
    mensagem_personalizada: string | null;
    status: string;
  }>;
  failures?: ImportError[];
}

// Main function to parse Excel file
export async function parseExcelFile(file: File): Promise<ParseResult> {
  try {
    console.log("Starting Excel parsing...");
    
    // Read the file as array buffer
    const buffer = await file.arrayBuffer();
    
    // Parse the Excel file
    const workbook = XLSX.read(buffer, { type: 'array' });
    
    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    // Validate data format
    if (!Array.isArray(data) || data.length === 0) {
      return {
        success: false,
        response: new Response(
          JSON.stringify({ error: "Formato de arquivo inválido. Não há dados para importar." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      };
    }
    
    console.log(`Found ${data.length} rows of data`);
    
    // Extract and validate data
    const recordsToInsert: Array<{
      nome_convidado: string;
      telefone: string;
      mensagem_personalizada: string | null;
      status: string;
    }> = [];
    
    const failures: ImportError[] = [];
    
    // Process each row
    data.forEach((row: any, index: number) => {
      const rowNumber = index + 2; // +2 because index starts at 0 and row 1 is headers
      
      // Check for required fields
      if (!row.nome_convidado) {
        failures.push({
          row: rowNumber,
          error: "Campo 'nome_convidado' obrigatório não fornecido"
        });
        return;
      }
      
      if (!row.telefone) {
        failures.push({
          row: rowNumber,
          error: "Campo 'telefone' obrigatório não fornecido"
        });
        return;
      }
      
      // Validate phone number format (simple validation)
      const phone = String(row.telefone).replace(/\D/g, '');
      if (phone.length < 10 || phone.length > 15) {
        failures.push({
          row: rowNumber,
          error: "Número de telefone inválido"
        });
        return;
      }
      
      // Add validated record
      recordsToInsert.push({
        nome_convidado: String(row.nome_convidado).trim(),
        telefone: phone,
        mensagem_personalizada: row.observacao ? String(row.observacao) : null,
        status: "pendente"
      });
    });
    
    console.log(`Validation complete. Valid: ${recordsToInsert.length}, Failed: ${failures.length}`);
    
    // Return results
    return {
      success: true,
      toInsert: recordsToInsert,
      failures: failures
    };
    
  } catch (error) {
    console.error("Excel parsing error:", error);
    return {
      success: false,
      response: new Response(
        JSON.stringify({ error: "Erro ao processar o arquivo Excel" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    };
  }
}
