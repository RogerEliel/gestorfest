
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from "xlsx";

interface ExcelTemplateDownloadProps {
  className?: string;
}

const ExcelTemplateDownload = ({ className }: ExcelTemplateDownloadProps) => {
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();

  const generateExcel = (): Uint8Array => {
    // Create data structure
    const data = [
      ["nome_convidado", "telefone", "observacao"], // Header row
      ["João da Silva", "+5511998765432", "Parente próximo"],
      ["Maria Oliveira", "+5511987654321", "Levar presente"],
      ["Pedro Santos", "+5511976543210", "Vegetariano"],
      ["Ana Pereira", "+5511965432109", "Traje esporte fino"]
    ];
    
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Convidados");
    
    // Generate buffer
    return XLSX.write(wb, { type: "array", bookType: "xlsx" });
  };

  const downloadTemplate = () => {
    try {
      setDownloading(true);
      
      // Generate Excel content
      const excelContent = generateExcel();
      
      // Create a Blob with the Excel content
      const blob = new Blob([excelContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Create a temporary URL for the Blob
      const url = URL.createObjectURL(blob);
      
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `modelo_convidados.xlsx`);
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
      {downloading ? "Baixado" : "Baixar modelo Excel"}
    </Button>
  );
};

export default ExcelTemplateDownload;
