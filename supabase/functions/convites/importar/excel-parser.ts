
import { read, utils } from "xlsx";

export interface ImportError {
  row: number;
  error: string;
}

export interface ConviteData {
  nome_convidado: string;
  telefone: string;
  mensagem_personalizada?: string | null;
}

/**
 * Parse Excel file and extract guest data
 */
export function parseExcelFile(fileData: ArrayBuffer): ConviteData[] {
  try {
    const workbook = read(fileData);
    
    if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
      throw new Error("Arquivo Excel inválido ou vazio");
    }
    
    // Get the first sheet
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Convert sheet to JSON with header row
    const jsonData = utils.sheet_to_json(worksheet, { defval: "" });
    
    if (!Array.isArray(jsonData) || jsonData.length === 0) {
      throw new Error("Nenhum dado encontrado na planilha");
    }
    
    console.log("Excel data parsed:", jsonData.length, "records");
    
    return jsonData.map((row: any) => ({
      nome_convidado: String(row.nome_convidado || ""),
      telefone: String(row.telefone || "").replace(/\D/g, ''),
      mensagem_personalizada: row.mensagem_personalizada || row.observacao || null
    }));
  } catch (error: any) {
    console.error("Error parsing Excel file:", error);
    throw error;
  }
}

/**
 * Validate imported data
 */
export function validateConviteData(data: ConviteData[]): ImportError[] {
  const errors: ImportError[] = [];
  
  data.forEach((item, index) => {
    if (!item.nome_convidado) {
      errors.push({
        row: index + 1,
        error: "Nome do convidado é obrigatório"
      });
    }
    
    if (!item.telefone) {
      errors.push({
        row: index + 1,
        error: "Telefone é obrigatório"
      });
    } else if (!isValidPhoneNumber(item.telefone)) {
      errors.push({
        row: index + 1,
        error: "Formato de telefone inválido"
      });
    }
  });
  
  return errors;
}

/**
 * Basic phone number validation
 */
function isValidPhoneNumber(phone: string): boolean {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Check if it's a valid length (minimum 8 digits)
  return digits.length >= 8 && digits.length <= 15;
}
