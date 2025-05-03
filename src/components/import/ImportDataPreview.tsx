
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Check } from "lucide-react";

interface ImportPreviewItem {
  nome_convidado: string;
  telefone: string;
  mensagem_personalizada?: string | null;
  isValid: boolean;
  error?: string;
}

interface ImportDataPreviewProps {
  data: ImportPreviewItem[];
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ImportDataPreview = ({ data, isLoading, onConfirm, onCancel }: ImportDataPreviewProps) => {
  // Calculate statistics
  const validCount = data.filter(item => item.isValid).length;
  const invalidCount = data.length - validCount;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Pré-visualização dos dados</h3>
          <p className="text-sm text-gray-500">
            Revise os dados antes de confirmar a importação
          </p>
        </div>
        
        <div className="flex gap-2 items-center">
          <Badge variant="default" className="bg-green-500">
            <Check size={14} className="mr-1" /> {validCount} válidos
          </Badge>
          {invalidCount > 0 && (
            <Badge variant="destructive">
              <AlertCircle size={14} className="mr-1" /> {invalidCount} inválidos
            </Badge>
          )}
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <div className="max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Observação</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index} className={item.isValid ? "" : "bg-red-50"}>
                  <TableCell>{item.nome_convidado}</TableCell>
                  <TableCell>{item.telefone}</TableCell>
                  <TableCell>{item.mensagem_personalizada || "-"}</TableCell>
                  <TableCell>
                    {item.isValid ? (
                      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                        <Check size={14} className="mr-1" /> Válido
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                        <AlertCircle size={14} className="mr-1" /> {item.error}
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <Button 
          variant="outline" 
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button 
          onClick={onConfirm} 
          disabled={isLoading || invalidCount === data.length}
        >
          {isLoading ? "Importando..." : `Importar ${validCount} convidados`}
        </Button>
      </div>
    </div>
  );
};

export default ImportDataPreview;
