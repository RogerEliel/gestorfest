
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Check, Upload } from "lucide-react";
import UploadAreaXLSX from "@/components/UploadAreaXLSX";
import ExcelTemplateDownload from "@/components/CSVTemplateDownload";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { isValidPhoneNumber, formatPhoneNumber } from "@/lib/validation";
import * as XLSX from "xlsx";

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

  const parseExcel = useCallback(async (file: File) => {
    return new Promise<{ data: ConviteData[], errors: ImportError[] }>((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data: ConviteData[] = [];
          const errors: ImportError[] = [];
          
          const binaryString = e.target?.result;
          const workbook = XLSX.read(binaryString, { type: 'binary' });
          
          // Get first sheet
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { header: 1 });
          
          if (jsonData.length < 2) {
            reject(new Error("Arquivo vazio ou sem dados"));
            return;
          }
          
          // Get headers (first row)
          const headers = jsonData[0].map((h: any) => String(h).trim().toLowerCase());
          
          // Validate required headers
          const requiredHeaders = ['nome_convidado', 'telefone'];
          const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
          
          if (missingHeaders.length > 0) {
            reject(new Error(`Colunas obrigatórias faltando: ${missingHeaders.join(', ')}`));
            return;
          }
          
          // Process rows (skip header)
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (!row || row.length === 0) continue; // Skip empty rows
            
            const rowObj: Record<string, any> = {};
            headers.forEach((header, index) => {
              rowObj[header] = row[index] !== undefined ? String(row[index]).trim() : '';
            });
            
            // Validate required fields
            if (!rowObj.nome_convidado) {
              errors.push({
                row: i + 1, // Excel rows are 1-indexed
                field: 'nome_convidado',
                message: 'Nome do convidado é obrigatório'
              });
            }
            
            if (!rowObj.telefone) {
              errors.push({
                row: i + 1,
                field: 'telefone',
                message: 'Telefone é obrigatório'
              });
            } else if (!isValidPhoneNumber(rowObj.telefone)) {
              errors.push({
                row: i + 1,
                field: 'telefone',
                message: 'Formato de telefone inválido. Use formato internacional: +5511999999999'
              });
            }
            
            // If no errors for this row, add to data
            if (!errors.some(e => e.row === i + 1)) {
              const convite: ConviteData = {
                nome_convidado: rowObj.nome_convidado,
                telefone: formatPhoneNumber(rowObj.telefone)
              };
              
              // Map observacao to mensagem_personalizada
              if (rowObj.observacao) {
                convite.mensagem_personalizada = rowObj.observacao;
              }
              
              data.push(convite);
            }
          }
          
          resolve({ data, errors });
        } catch (error) {
          console.error("Error parsing Excel:", error);
          reject(new Error("Erro ao processar o arquivo Excel"));
        }
      };
      
      reader.onerror = () => {
        reject(new Error("Erro ao ler o arquivo"));
      };
      
      reader.readAsBinaryString(file);
    });
  }, []);

  const handleFileSelected = async (selectedFile: File) => {
    setFile(selectedFile);
    setValidating(true);
    setErrors([]);
    setConvites([]);
    
    try {
      const { data, errors } = await parseExcel(selectedFile);
      
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
    } catch (error: any) {
      console.error("Error processing Excel:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível ler o arquivo Excel. Verifique o formato.",
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
