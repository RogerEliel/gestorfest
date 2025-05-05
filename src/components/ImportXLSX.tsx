
import { useState } from "react";
import * as XLSX from "xlsx";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ImportXLSXProps {
  onUpload: (parsedData: any[]) => void;
}

export default function ImportXLSX({ onUpload }: ImportXLSXProps) {
  const [error, setError] = useState<string|null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.match(/\.(xlsx)$/)) {
      setError("Envie apenas arquivos .xlsx");
      e.target.value = ''; // Reset file input
      return;
    }

    try {
      setIsProcessing(true);
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      
      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error("Arquivo Excel sem planilhas");
      }
      
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
      
      console.log("XLSX parsed data:", rows); // Debug log
      
      if (!Array.isArray(rows) || rows.length === 0) {
        throw new Error("Nenhum dado encontrado na planilha");
      }
      
      // Process data and call the callback
      onUpload(rows);
    } catch (err: any) {
      console.error("XLSX parsing error:", err);
      setError("Erro ao processar o arquivo: " + (err.message || "Erro desconhecido"));
      e.target.value = ''; // Reset file input
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mb-6">
      <label className="block mb-2 font-medium">Importar convidados (.xlsx)</label>
      <input 
        type="file" 
        accept=".xlsx" 
        onChange={handleFile} 
        disabled={isProcessing}
        className="block w-full text-sm text-gray-500
                 file:mr-4 file:py-2 file:px-4
                 file:rounded-md file:border-0
                 file:text-sm file:font-medium
                 file:bg-primary file:text-white
                 hover:file:bg-primary/90
                 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      {isProcessing && (
        <div className="mt-2 text-sm text-blue-600 flex items-center">
          <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processando arquivo...
        </div>
      )}
      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
