
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { AuditAction, logUserAction } from "@/lib/auditLogger";
import { ImportError, ImportPreviewItem } from "@/types/import.types";
import { validateImportData, formatImportPayload } from "@/utils/importUtils";
import { importContacts } from "@/services/importService";

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
      const previewItems = validateImportData(parsedData);
      
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
    try {
      setImporting(true);
      
      // Filter valid records only for import
      const validRecords = formatImportPayload(previewData);
      
      if (validRecords.length === 0) {
        toast({
          title: "Erro",
          description: "Não há registros válidos para importar.",
          variant: "destructive",
        });
        return;
      }
      
      console.log("Sending valid records for import:", validRecords);
      
      const { data, error } = await importContacts(eventoId, validRecords);
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        throw new Error("Resposta vazia do servidor");
      }
      
      console.log("Import response:", data);
      
      if (data.failures && data.failures.length > 0) {
        setFailures(data.failures);
        
        toast({
          title: "Importação parcial",
          description: `${data.inserted_count} convidados importados com ${data.failures.length} falhas.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sucesso",
          description: `${data.inserted_count} convidados importados com sucesso.`,
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
          totalImported: data.inserted_count,
          totalFailures: data.failures?.length || 0
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
