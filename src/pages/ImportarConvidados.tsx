
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Check, Upload } from "lucide-react";
import UploadAreaXLSX from "@/components/UploadAreaXLSX";
import ExcelTemplateDownload from "@/components/CSVTemplateDownload";
import Footer from "@/components/Footer";
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

const ImportarConvidados = () => {
  const { id: eventoId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [importing, setImporting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [failures, setFailures] = useState<ImportError[]>([]);
  const [evento, setEvento] = useState<any>(null);

  useEffect(() => {
    fetchEvento();
  }, [eventoId]);

  const fetchEvento = async () => {
    if (!eventoId) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke(`eventos/${eventoId}`, {
        method: "GET"
      });

      if (error) throw error;
      
      setEvento(data);
    } catch (error: any) {
      console.error("Error fetching event:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os detalhes do evento.",
        variant: "destructive",
      });
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelected = async (selectedFile: File) => {
    setFile(selectedFile);
    setValidating(false);
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
      
      // Call the API to import contacts
      const { data, error } = await supabase.functions.invoke(`convites/importar/${eventoId}`, {
        method: "POST",
        body: formData,
        headers: {
          // Do not set Content-Type, it will be set automatically with the correct boundary for FormData
        }
      });

      if (error) throw error;
      
      const response = data as ImportResponse;
      
      if (response.failures && response.failures.length > 0) {
        setFailures(response.failures);
        
        toast({
          title: "Importação parcial",
          description: `${response.inserted_count} convidados importados com ${response.failures.length} falhas.`,
          variant: "warning",
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

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto p-4 space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Importar Convidados</h1>
            {evento && (
              <p className="text-gray-600">
                Evento: {evento.nome} - {new Date(evento.data_evento).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/eventos/${eventoId}/convidados`)}>
              Voltar
            </Button>
            <ExcelTemplateDownload />
          </div>
        </div>

        <Card className="bg-white shadow">
          <CardHeader>
            <CardTitle>Upload de Excel</CardTitle>
            <CardDescription>
              Faça upload de um arquivo Excel (.xlsx) contendo a lista de convidados.
              Os campos obrigatórios são nome_convidado e telefone. Campo opcional: observacao.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UploadAreaXLSX
              onFileSelected={handleFileSelected}
              isLoading={validating}
              accept=".xlsx"
            />
            
            {failures.length > 0 && (
              <Alert variant="destructive" className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erros na importação</AlertTitle>
                <AlertDescription>
                  <div className="mt-2 space-y-1 max-h-60 overflow-y-auto">
                    {failures.map((error, index) => (
                      <div key={index} className="text-sm">
                        Linha {error.row}: {error.error}
                      </div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            {file && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="h-5 w-5" />
                  <span className="font-medium">
                    Arquivo selecionado: {file.name}
                  </span>
                </div>
                <Button 
                  onClick={handleImportContacts}
                  disabled={importing || !file}
                  className="w-full md:w-auto"
                >
                  {importing ? (
                    <span className="flex items-center">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Importando...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Upload className="h-4 w-4 mr-2" />
                      Importar Convidados
                    </span>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ImportarConvidados;
