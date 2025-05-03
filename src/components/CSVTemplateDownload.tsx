
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CSVTemplateDownloadProps {
  templateType?: 'basic' | 'full';
  className?: string;
}

const CSVTemplateDownload = ({ templateType = 'basic', className }: CSVTemplateDownloadProps) => {
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();

  const generateCSV = (type: 'basic' | 'full'): string => {
    // Header row always includes required fields
    let csv = "nome_convidado,telefone";
    
    // For full template, include optional fields
    if (type === 'full') {
      csv += ",email,observacao";
    }
    
    // Add a few example rows
    csv += "\nNome do Convidado 1,+5511999999999";
    if (type === 'full') {
      csv += ",email1@exemplo.com,Observação sobre o convidado 1";
    }
    
    csv += "\nNome do Convidado 2,+5511988888888";
    if (type === 'full') {
      csv += ",email2@exemplo.com,Observação sobre o convidado 2";
    }
    
    return csv;
  };

  const downloadTemplate = () => {
    try {
      setDownloading(true);
      
      // Generate CSV content based on template type
      const csvContent = generateCSV(templateType);
      
      // Create a Blob with the CSV content
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // Create a temporary URL for the Blob
      const url = URL.createObjectURL(blob);
      
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `modelo_convidados_${templateType}.csv`);
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
