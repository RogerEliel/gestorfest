
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuditAction, logUserAction } from "@/lib/auditLogger";
import { isValidPhoneNumber } from "@/lib/validation";

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

  const handleFileSelected = async (parsedData: any[]) => {
    console.log("Received parsed data:", parsedData);
    if (!parsedData || !Array.isArray(parsedData) || parsedData.length === 0) {
      toast({
        title: "Erro",
        description: "Nenhum dado válido encontrado no arquivo Excel.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setValidating(true);
      setPreviewData([]);
      
      // Validate and format data
      const previewItems: ImportPreviewItem[] = [];
      
      parsedData.forEach((row: any, index: number) => {
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
      
      setPreviewData(previewItems);
      setShowPreview(true);
    } catch (error: any) {
      console.error("Error processing file data:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível processar o arquivo Excel.",
        variant: "destructive",
      });
    } finally {
      setValidating(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setFailures([]);
    setPreviewData([]);
    setShowPreview(false);
  };

  const validateFile = async () => {
    // This is now handled during handleFileSelected
    if (previewData.length === 0) {
      toast({
        title: "Erro",
        description: "Dados não encontrados para validação.",
        variant: "destructive",
      });
      return;
    }
    
    setShowPreview(true);
  };

  const cancelImport = () => {
    setShowPreview(false);
  };

  const handleImportContacts = async () => {
    if (!eventoId) {
      toast({
        title: "Erro",
        description: "ID do evento não encontrado.",
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
      
      // Get auth token to ensure it's included in the request
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      
      if (!token) {
        throw new Error("Usuário não autenticado. Faça login novamente.");
      }
      
      // Format data as required by the API
      const payload = {
        convites: validRecords.map(item => ({
          nome_convidado: item.nome_convidado,
          telefone: item.telefone,
          mensagem_personalizada: item.mensagem_personalizada
        }))
      };
      
      console.log("Sending payload to edge function:", payload);
      
      // Call the API with JSON payload instead of FormData
      const { data, error } = await supabase.functions.invoke(`convites/importar/${eventoId}`, {
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (error) {
        console.error("Import error:", error);
        throw error;
      }
      
      const response = data as ImportResponse;
      console.log("Import response:", response);
      
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
