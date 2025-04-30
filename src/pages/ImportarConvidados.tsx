
import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/Footer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, UploadCloud } from "lucide-react";

// Define o schema para validação dos dados
const convidadoSchema = z.object({
  nome_convidado: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  telefone: z.string().min(10, "Telefone inválido"),
  mensagem_personalizada: z.string().optional(),
});

type Convidado = z.infer<typeof convidadoSchema>;

const ImportarConvidados = () => {
  const { id: eventoId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [parsedData, setParsedData] = useState<Array<Convidado & { valid: boolean; errors?: string[] }>>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"upload" | "review" | "importing">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    resolver: zodResolver(z.object({})),
    defaultValues: {},
  });

  const processCSV = (text: string) => {
    const lines = text.split("\n");
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
    
    const nameIndex = headers.findIndex(h => h === "nome" || h === "nome_convidado");
    const phoneIndex = headers.findIndex(h => h === "telefone" || h === "phone" || h === "celular");
    const messageIndex = headers.findIndex(h => h === "mensagem" || h === "mensagem_personalizada" || h === "message");
    
    if (nameIndex === -1 || phoneIndex === -1) {
      toast({
        title: "Formato inválido",
        description: "O arquivo CSV deve conter pelo menos as colunas 'nome' e 'telefone'.",
        variant: "destructive",
      });
      return;
    }

    const results: Array<Convidado & { valid: boolean; errors?: string[] }> = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(",").map(v => v.trim());
      
      const convidado = {
        nome_convidado: values[nameIndex] || "",
        telefone: values[phoneIndex] || "",
        mensagem_personalizada: messageIndex !== -1 ? values[messageIndex] : undefined,
      };
      
      try {
        convidadoSchema.parse(convidado);
        results.push({ ...convidado, valid: true });
      } catch (error: any) {
        if (error.errors) {
          const errorMessages = error.errors.map((e: any) => e.message);
          results.push({ ...convidado, valid: false, errors: errorMessages });
        } else {
          results.push({ ...convidado, valid: false, errors: ["Erro de validação desconhecido"] });
        }
      }
    }
    
    setParsedData(results);
    setStep("review");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      toast({
        title: "Formato inválido",
        description: "Por favor, envie um arquivo CSV.",
        variant: "destructive",
      });
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target?.result as string;
      processCSV(text);
    };
    
    reader.readAsText(file);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    
    const file = event.dataTransfer.files[0];
    
    if (!file) return;
    
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      toast({
        title: "Formato inválido",
        description: "Por favor, envie um arquivo CSV.",
        variant: "destructive",
      });
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target?.result as string;
      processCSV(text);
    };
    
    reader.readAsText(file);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleImport = async () => {
    if (!eventoId) return;
    
    try {
      setLoading(true);
      setStep("importing");
      
      const validData = parsedData.filter(item => item.valid);
      
      if (validData.length === 0) {
        toast({
          title: "Nenhum dado válido",
          description: "Não há dados válidos para importar.",
          variant: "destructive",
        });
        return;
      }
      
      // Format data for API
      const convidados = validData.map(({ nome_convidado, telefone, mensagem_personalizada }) => ({
        nome_convidado,
        telefone,
        mensagem_personalizada: mensagem_personalizada || undefined,
      }));
      
      // Call the API to import guests
      const { data, error } = await supabase.functions.invoke(`convites/eventos/${eventoId}/criar-lote`, {
        method: "POST",
        body: convidados,
      });

      if (error) {
        // Handle specific error types
        if (error.message.includes("duplicidade")) {
          throw new Error("Alguns telefones já estão cadastrados para este evento.");
        }
        
        throw new Error(error.message);
      }
      
      toast({
        title: "Convidados importados com sucesso!",
        description: `${validData.length} convidados foram adicionados ao evento.`,
      });
      
      // Redirect to event page
      navigate(`/eventos/${eventoId}/convidados`);
    } catch (error: any) {
      console.error("Error importing guests:", error);
      
      toast({
        title: "Erro ao importar convidados",
        description: error.message || "Não foi possível importar os convidados. Tente novamente.",
        variant: "destructive",
      });
      
      setStep("review");
    } finally {
      setLoading(false);
    }
  };

  const handleTryAnother = () => {
    setParsedData([]);
    setStep("upload");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const invalidCount = parsedData.filter(item => !item.valid).length;
  const validCount = parsedData.filter(item => item.valid).length;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Importar Convidados</h1>
          <Button variant="outline" onClick={() => navigate(`/eventos/${eventoId}/convidados`)}>
            Voltar
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === "upload" ? "Enviar CSV de Convidados" : 
               step === "review" ? "Revisar Dados dos Convidados" :
               "Importando Convidados..."}
            </CardTitle>
            <CardDescription>
              {step === "upload" ? "Faça upload de um arquivo CSV com a lista de convidados" :
               step === "review" ? "Verifique os dados antes de importar" :
               "Processando seus dados..."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form>
                {step === "upload" && (
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".csv"
                      className="hidden"
                      id="csv-upload"
                    />
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Arraste e solte seu arquivo CSV aqui, ou{" "}
                      <label 
                        htmlFor="csv-upload"
                        className="text-primary hover:underline cursor-pointer"
                      >
                        clique para selecionar
                      </label>
                    </p>
                    
                    <div className="mt-8 text-left">
                      <h3 className="font-medium mb-2">Formato esperado do CSV:</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        O arquivo CSV deve ter cabeçalhos e pelo menos as colunas "nome" e "telefone".
                        Opcionalmente, pode incluir "mensagem_personalizada".
                      </p>
                      <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto">
                        nome,telefone,mensagem_personalizada<br />
                        João Silva,(11) 98765-4321,Olá João!<br />
                        Maria Santos,(11) 91234-5678,Espero você lá!
                      </pre>
                    </div>
                  </div>
                )}
                
                {step === "review" && (
                  <div className="space-y-4">
                    {parsedData.length > 0 && (
                      <>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full">
                            Válidos: {validCount}
                          </div>
                          {invalidCount > 0 && (
                            <div className="bg-red-50 text-red-700 px-3 py-1 rounded-full">
                              Inválidos: {invalidCount}
                            </div>
                          )}
                          <div className="bg-gray-100 px-3 py-1 rounded-full">
                            Total: {parsedData.length}
                          </div>
                        </div>
                        
                        {invalidCount > 0 && (
                          <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Atenção</AlertTitle>
                            <AlertDescription>
                              Existem {invalidCount} registros com problemas que não serão importados.
                              Apenas os registros válidos serão adicionados.
                            </AlertDescription>
                          </Alert>
                        )}
                        
                        <div className="max-h-96 overflow-y-auto border rounded">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Status</TableHead>
                                <TableHead>Nome</TableHead>
                                <TableHead>Telefone</TableHead>
                                <TableHead>Mensagem</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {parsedData.map((item, index) => (
                                <TableRow key={index} className={!item.valid ? "bg-red-50" : ""}>
                                  <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      item.valid 
                                        ? "bg-green-100 text-green-800" 
                                        : "bg-red-100 text-red-800"
                                    }`}>
                                      {item.valid ? "Válido" : "Inválido"}
                                    </span>
                                  </TableCell>
                                  <TableCell>{item.nome_convidado}</TableCell>
                                  <TableCell>{item.telefone}</TableCell>
                                  <TableCell>{item.mensagem_personalizada || "-"}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </>
                    )}
                  </div>
                )}
                
                {step === "importing" && (
                  <div className="text-center py-8">
                    <p>Importando convidados, aguarde...</p>
                  </div>
                )}
                
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            {step === "review" && (
              <>
                <Button variant="outline" onClick={handleTryAnother} disabled={loading}>
                  Tentar outro arquivo
                </Button>
                <Button 
                  onClick={handleImport} 
                  disabled={loading || validCount === 0}
                >
                  {loading ? "Importando..." : `Importar ${validCount} convidados`}
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ImportarConvidados;
