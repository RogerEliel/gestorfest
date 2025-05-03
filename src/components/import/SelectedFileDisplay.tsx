
import { Check, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SelectedFileDisplayProps {
  file: File;
  importing: boolean;
  onRemoveFile: () => void;
  onImport: () => void;
}

const SelectedFileDisplay = ({
  file,
  importing,
  onRemoveFile,
  onImport,
}: SelectedFileDisplayProps) => {
  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center gap-2 text-green-600">
        <Check className="h-5 w-5" />
        <span className="font-medium">
          Arquivo selecionado: {file.name}
        </span>
      </div>
      <Button 
        onClick={onImport}
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
      {!importing && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRemoveFile}
          className="ml-2"
        >
          <X className="h-4 w-4 mr-1" /> Remover arquivo
        </Button>
      )}
    </div>
  );
};

export default SelectedFileDisplay;
