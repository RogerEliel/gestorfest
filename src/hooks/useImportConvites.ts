
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuditAction, logUserAction } from "@/lib/auditLogger";
import { isValidPhoneNumber } from "@/lib/validation";
import * as XLSX from 'xlsx';

interface ImportError {
  row: number;
  error: string;
}

interface ImportPreviewItem {
  nome_convidado: string;
  telefone: string;
  mensagem_personalizada?: string | null;
  isValid: boolean;
  error?: string;
}

interface ImportResponse {
  inserted_count: number;
  failures: ImportError[];
}

export const useImportConvites = (eventoId: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [importing, setImporting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [failures, setFailures] = useState<ImportError[]>([]);
  const [previewData, setPreviewData] = useState<ImportPreviewItem[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileSelected = async (selectedFile: File | null) => {
    console.log("Selected file:", selectedFile);
    if (selectedFile) {
      setFile(selectedFile);
      setValidating(false);
      setFailures([]);
      setPreviewData([]);
      setShowPreview(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setFailures([]);
    setPreviewData([]);
    setShowPreview(false);
  };

  const validateFile = async () => {
    if (!file) {
      toast({
        title: "Erro",
        description: "Selecione um arquivo Excel para validar.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setValidating(true);
      setPreviewData([]);
      
      // Parse Excel file
      const data = await parseExcelFile(file);
      console.log("Parsed data for validation:", data);
      setPreviewData(data);
      setShowPreview(true);
    } catch (error: any) {
      console.error("Error validating file:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível validar o arquivo.",
        variant: "destructive",
      });
    } finally {
      setValidating(false);
    }
  };
  
  const parseExcelFile = async (file: File): Promise<ImportPreviewItem[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          if (!e.target?.result) {
            reject(new Error("Falha ao ler o arquivo"));
            return;
          }
          
          const data = new Uint8Array(e.target.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get first sheet
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          console.log("Excel JSON data:", jsonData);
          
          if (!Array.isArray(jsonData) || jsonData.length === 0) {
            reject(new Error("Formato de arquivo inválido ou vazio"));
            return;
          }
          
          // Validate and format data
          const previewItems: ImportPreviewItem[] = [];
          
          jsonData.forEach((row: any, index: number) => {
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
          
          resolve(previewItems);
        } catch (error) {
          console.error("Error parsing Excel file:", error);
          reject(new Error("Erro ao processar o arquivo Excel"));
        }
      };
      
      reader.onerror = () => {
        reject(new Error("Erro ao ler o arquivo"));
      };
      
      reader.readAsArrayBuffer(file);
    });
  };

  const cancelImport = () => {
    setShowPreview(false);
  };

  const handleImportContacts = async () => {
    if (!eventoId || !file) {
      toast({
        title: "Erro",
        description: "Selecione um arquivo Excel para importar.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setImporting(true);
      
      // Filter valid records only for import
      const validRecords = previewData.filter(item => item.isValid);
      
      if (validRecords.length === 0) {
        toast({
          title: "Erro",
          description: "Não há registros válidos para importar.",
          variant: "destructive",
        });
        setImporting(false);
        return;
      }
      
      console.log("Sending valid records for import:", validRecords);
      
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      
      // Get auth token to ensure it's included in the request
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      
      if (!token) {
        throw new Error("Usuário não autenticado. Faça login novamente.");
      }
      
      // Call the API to import contacts using the dedicated import endpoint with explicit auth header
      const { data, error } = await supabase.functions.invoke(`convites/importar/${eventoId}`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (error) {
        console.error("Import error:", error);
        throw error;
      }
      
      const response = data as ImportResponse;
      
      if (response.failures && response.failures.length > 0) {
        setFailures(response.failures);
        
        toast({
          title: "Importação parcial",
          description: `${response.inserted_count} convidados importados com ${response.failures.length} falhas.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sucesso",
          description: `${response.inserted_count} convidados importados com sucesso.`,
        });
        
        // Navigate back to the guest management page after a successful import
        setTimeout(() => {
          navigate(`/eventos/${eventoId}/convidados`);
        }, 2000);
      }
      
      // Log the import action
      logUserAction(
        AuditAction.IMPORT_CONTACTS,
        { 
          totalImported: response.inserted_count,
          totalFailures: response.failures?.length || 0
        },
        eventoId,
        'evento'
      );
      
      // Reset preview state
      setShowPreview(false);
      
    } catch (error: any) {
      console.error("Error importing contacts:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível importar os convidados.",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  return {
    loading,
    validating,
    importing,
    file,
    failures,
    previewData,
    showPreview,
    handleFileSelected,
    validateFile,
    handleImportContacts,
    cancelImport,
    removeFile
  };
};
