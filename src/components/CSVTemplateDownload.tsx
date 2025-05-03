
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CSVTemplateDownloadProps {
  className?: string;
}

const CSVTemplateDownload = ({ className }: CSVTemplateDownloadProps) => {
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();

  const generateCSV = (): string => {
    // Header row with required fields
    const csv = "nome_convidado,telefone,observacao";
    
    // Add example rows
    const exampleData = [
      ["João da Silva", "+5511998765432", "Parente próximo"],
      ["Maria Oliveira", "+5511987654321", "Levar presente"],
      ["Pedro Santos", "+5511976543210", "Vegetariano"],
      ["Ana Pereira", "+5511965432109", "Traje esporte fino"]
    ];
    
    const rows = exampleData.map(row => row.join(",")).join("\n");
    
    return `${csv}\n${rows}`;
  };

  const downloadTemplate = () => {
    try {
      setDownloading(true);
      
      // Generate CSV content
      const csvContent = generateCSV();
      
      // Create a Blob with the CSV content
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // Create a temporary URL for the Blob
      const url = URL.createObjectURL(blob);
      
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `modelo_convidados.csv`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      toast({
        title: "Modelo baixado",
        description: "O modelo de planilha foi baixado com sucesso.",
      });
    } catch (error) {
      console.error("Error downloading template:", error);
      
      toast({
        title: "Erro",
        description: "Não foi possível baixar o modelo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={downloadTemplate}
      disabled={downloading}
      className={className}
    >
      {downloading ? (
        <Check className="h-4 w-4 mr-2" />
      ) : (
        <Download className="h-4 w-4 mr-2" />
      )}
      {downloading ? "Baixado" : "Baixar modelo CSV"}
    </Button>
  );
};

export default CSVTemplateDownload;
