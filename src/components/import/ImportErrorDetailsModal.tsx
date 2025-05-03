
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ImportError {
  row: number;
  error: string;
}

interface ImportErrorDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  errors: ImportError[];
  date?: string;
}

const ImportErrorDetailsModal = ({
  isOpen,
  onClose,
  errors,
  date
}: ImportErrorDetailsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes das falhas</DialogTitle>
          {date && (
            <DialogDescription>
              Importação realizada em {new Date(date).toLocaleDateString()} às {new Date(date).toLocaleTimeString()}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="max-h-96 overflow-y-auto">
          <div className="space-y-2">
            {errors.map((error, index) => (
              <div
                key={index}
                className="p-3 border rounded-lg text-sm bg-red-50"
              >
                <div className="font-medium">Linha {error.row}</div>
                <div className="text-red-600">{error.error}</div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportErrorDetailsModal;
