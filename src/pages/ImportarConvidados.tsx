import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Check, Upload } from "lucide-react";
import UploadAreaCSV from "@/components/UploadAreaCSV";
import CSVTemplateDownload from "@/components/CSVTemplateDownload";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { isValidPhoneNumber, formatPhoneNumber } from "@/lib/validation";

interface ConviteData {
  nome_convidado: string;
  telefone: string;
  mensagem_personalizada?: string;
}

interface ImportError {
  row: number;
  field: string;
  message: string;
}

const ImportarConvidados = () => {
  const { id: eventoId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [importing, setImporting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [convites, setConvites] = useState<ConviteData[]>([]);
  const [errors, setErrors] = useState<ImportError[]>([]);
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

  const parseCSV = useCallback((csvText: string) => {
    const lines = csvText.split(/\r\n|\n/);
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    // Validate required headers
    const requiredHeaders = ['nome_convidado', 'telefone'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
      toast({
        title: "Arquivo inválido",
        description: `Colunas obrigatórias faltando: ${missingHeaders.join(', ')}`,
        variant: "destructive",
      });
      return { data: [], errors: [] };
    }
    
    const data: ConviteData[] = [];
    const errors: ImportError[] = [];
    
    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue; // Skip empty lines
      
      const values = lines[i].split(',').map(v => v.trim());
      const row: Record<string, string> = {};
      
      // Map values to headers
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      // Validate required fields
      if (!row.nome_convidado) {
        errors.push({
          row: i,
          field: 'nome_convidado',
          message: 'Nome do convidado é obrigatório'
        });
      }
      
      if (!row.telefone) {
        errors.push({
          row: i,
          field: 'telefone',
          message: 'Telefone é obrigatório'
        });
      } else if (!isValidPhoneNumber(row.telefone)) {
        errors.push({
          row: i,
          field: 'telefone',
          message: 'Formato de telefone inválido. Use formato internacional: +5511999999999'
        });
      }
      
      // If no errors for this row, add to data
      if (!errors.some(e => e.row === i)) {
        const convite: ConviteData = {
          nome_convidado: row.nome_convidado,
          telefone: formatPhoneNumber(row.telefone)
        };
        
        // Map observacao to mensagem_personalizada
        if (row.observacao) {
          convite.mensagem_personalizada = row.observacao;
        }
        
        data.push(convite);
      }
    }
    
    return { data, errors };
  }, [toast]);

  const handleFileSelected = async (selectedFile: File) => {
    setFile(selectedFile);
    setValidating(true);
    setErrors([]);
    setConvites([]);
    
    try {
      const text = await selectedFile.text();
      const { data, errors } = parseCSV(text);
      
      setConvites(data);
      setErrors(errors);
      
      if (errors.length > 0) {
        toast({
          title: "Validação",
          description: `Encontrados ${errors.length} erros no arquivo.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Validação",
          description: `${data.length} convidados validados com sucesso.`,
        });
      }
    } catch (error) {
      console.error("Error parsing CSV:", error);
      toast({
        title: "Erro",
        description: "Não foi possível ler o arquivo CSV. Verifique o formato.",
        variant: "destructive",
      });
    } finally {
      setValidating(false);
    }
  };

  const handleImportConvites = async () => {
    if (!eventoId || convites.length === 0) return;
    
    try {
      setImporting(true);
      
      // Call the API to import contacts
      const { data, error } = await supabase.functions.invoke(`convites/importar/${eventoId}`, {
        method: "POST",
        body: { convites }
      });

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: `${convites.length} convidados importados com sucesso.`,
      });
      
      // Navigate back to the guest management page
      navigate(`/eventos/${eventoId}/convidados`);
    } catch (error: any) {
      console.error("Error importing guests:", error);
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
            <CSVTemplateDownload />
          </div>
        </div>

        <Card className="bg-white shadow">
          <CardHeader>
            <CardTitle>Upload de CSV</CardTitle>
            <CardDescription>
              Faça upload de um arquivo CSV contendo a lista de convidados.
              Os campos obrigatórios são nome_convidado e telefone. Campo opcional: observacao.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UploadAreaCSV
              onFileSelected={handleFileSelected}
              isLoading={validating}
              accept=".csv"
            />
            
            {errors.length > 0 && (
              <Alert variant="destructive" className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erros na validação do arquivo</AlertTitle>
                <AlertDescription>
                  <div className="mt-2 space-y-1 max-h-60 overflow-y-auto">
                    {errors.map((error, index) => (
                      <div key={index} className="text-sm">
                        Linha {error.row}: {error.message} (campo: {error.field})
                      </div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            {convites.length > 0 && errors.length === 0 && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="h-5 w-5" />
                  <span className="font-medium">
                    {convites.length} convidados validados com sucesso
                  </span>
                </div>
                <Button 
                  onClick={handleImportConvites}
                  disabled={importing}
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
                      Importar {convites.length} Convidados
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
