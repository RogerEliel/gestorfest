
import { Eye, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SelectedFileDisplayProps {
  file: File;
  validating: boolean;
  onRemoveFile: () => void;
  onValidate: () => void;
}

const SelectedFileDisplay = ({
  file,
  validating,
  onRemoveFile,
  onValidate,
}: SelectedFileDisplayProps) => {
  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center gap-2 text-green-600">
        <Upload className="h-5 w-5" />
        <span className="font-medium">
          Arquivo selecionado: {file.name}
        </span>
      </div>
      <Button 
        onClick={onValidate}
        disabled={validating || !file}
        className="w-full md:w-auto"
      >
        {validating ? (
          <span className="flex items-center">
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
            Validando...
          </span>
        ) : (
          <span className="flex items-center">
            <Eye className="h-4 w-4 mr-2" />
            Pré-visualizar dados
          </span>
        )}
      </Button>
      {!validating && (
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
