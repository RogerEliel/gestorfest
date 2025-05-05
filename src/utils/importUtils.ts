
import { ImportPreviewItem } from "@/types/import.types";
import { isValidPhoneNumber } from "@/lib/validation";

/**
 * Validate parsed data from an Excel file and format it for preview
 */
export function validateImportData(parsedData: any[]): ImportPreviewItem[] {
  if (!parsedData || !Array.isArray(parsedData) || parsedData.length === 0) {
    return [];
  }
  
  const previewItems: ImportPreviewItem[] = [];
  
  parsedData.forEach((row: any) => {
    const item: ImportPreviewItem = {
      nome_convidado: String(row.nome_convidado || ""),
      telefone: String(row.telefone || "").replace(/\D/g, ''),
      mensagem_personalizada: row.observacao ? String(row.observacao) : null,
      isValid: true
    };
    
    // Validate required fields
    if (!item.nome_convidado) {
      item.isValid = false;
      item.error = "Nome do convidado é obrigatório";
    } else if (!item.telefone) {
      item.isValid = false;
      item.error = "Telefone é obrigatório";
    } else if (!isValidPhoneNumber(item.telefone)) {
      item.isValid = false;
      item.error = "Número de telefone inválido";
    }
    
    previewItems.push(item);
  });
  
  return previewItems;
}

/**
 * Format data for sending to the API
 */
export function formatImportPayload(previewData: ImportPreviewItem[]): any[] {
  return previewData
    .filter(item => item.isValid)
    .map(item => ({
      nome_convidado: item.nome_convidado,
      telefone: item.telefone,
      mensagem_personalizada: item.mensagem_personalizada
    }));
}
