
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuditAction, logUserAction } from "@/lib/auditLogger";

interface ImportError {
  row: number;
  error: string;
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

  const handleFileSelected = async (selectedFile: File) => {
    setFile(selectedFile);
    setValidating(false);
    setFailures([]);
  };

  const removeFile = () => {
    setFile(null);
    setFailures([]);
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
      setFailures([]);
      
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      
      // Call the API to import contacts using the dedicated import endpoint
      const { data, error } = await supabase.functions.invoke(`convites/importar/${eventoId}`, {
        method: "POST",
        body: formData,
        // FormData sets the correct Content-Type automatically with boundary
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
    handleFileSelected,
    handleImportContacts,
    removeFile
  };
};
