
import { ImportPreviewItem } from "@/types/import.types";

/**
 * Validate if a phone number meets basic requirements
 */
export function isValidPhoneNumber(phone: string): boolean {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Check if it has at least 8 digits and not more than 15
  return digits.length >= 8 && digits.length <= 15;
}

/**
 * Format phone number to international format if needed
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Already formatted as international
  if (phone.startsWith('+')) {
    return phone;
  }
  
  // For Brazilian numbers
  if (digits.length === 10 || digits.length === 11) {
    if (!digits.startsWith('55')) {
      return `+55${digits}`;
    }
    return `+${digits}`;
  }
  
  // Default case
  return `+${digits}`;
}

/**
 * Validate parsed data from an Excel file and format it for preview
 */
export function validateImportData(parsedData: any[]): ImportPreviewItem[] {
  if (!parsedData || !Array.isArray(parsedData) || parsedData.length === 0) {
    return [];
  }
  
  const previewItems: ImportPreviewItem[] = [];
  const phoneNumbers = new Set<string>();
  
  parsedData.forEach((row: any) => {
    const phone = String(row.telefone || "").replace(/\D/g, '');
    
    const item: ImportPreviewItem = {
      nome_convidado: String(row.nome_convidado || ""),
      telefone: phone,
      mensagem_personalizada: row.mensagem_personalizada || row.observacao || null,
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
    } else if (phoneNumbers.has(item.telefone)) {
      item.isValid = false;
      item.error = "Número de telefone duplicado na planilha";
    } else {
      phoneNumbers.add(item.telefone);
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
      telefone: formatPhoneNumber(item.telefone),
      mensagem_personalizada: item.mensagem_personalizada
    }));
}
