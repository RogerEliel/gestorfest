
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ImportError {
  row: number;
  error: string;
}

interface ImportErrorDisplayProps {
  failures: ImportError[];
}

const ImportErrorDisplay = ({ failures }: ImportErrorDisplayProps) => {
  if (failures.length === 0) return null;
  
  return (
    <Alert variant="destructive" className="mt-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erros na importação</AlertTitle>
      <AlertDescription>
        <div className="mt-2 space-y-1 max-h-60 overflow-y-auto">
          {failures.map((error, index) => (
            <div key={index} className="text-sm">
              Linha {error.row}: {error.error}
            </div>
          ))}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ImportErrorDisplay;
