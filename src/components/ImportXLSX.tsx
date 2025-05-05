
import { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";

interface ImportXLSXProps {
  onUpload: (parsedData: any[]) => void;
}

export default function ImportXLSX({ onUpload }: ImportXLSXProps) {
  const [error, setError] = useState<string|null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.match(/\.(xlsx)$/)) {
      setError("Envie apenas arquivos .xlsx");
      return;
    }

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
      
      console.log("XLSX parsed data:", rows); // Debug log
      onUpload(rows);
    } catch (err: any) {
      setError("Erro ao processar o arquivo: " + (err.message || "Erro desconhecido"));
      console.error("XLSX parsing error:", err);
    }
  };

  return (
    <div className="mb-6">
      <label className="block mb-2 font-medium">Importar convidados (.xlsx)</label>
      <input 
        type="file" 
        accept=".xlsx" 
        onChange={handleFile} 
        className="block w-full text-sm text-gray-500
                 file:mr-4 file:py-2 file:px-4
                 file:rounded-md file:border-0
                 file:text-sm file:font-medium
                 file:bg-primary file:text-white
                 hover:file:bg-primary/90"
      />
      {error && <p className="text-red-600 mt-1">{error}</p>}
    </div>
  );
}
