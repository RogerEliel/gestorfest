
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import ImportErrorDetailsModal from "./ImportErrorDetailsModal";

interface ImportError {
  row: number;
  error: string;
}

interface ImportHistoryRecord {
  id: string;
  data_importacao: string;
  total_registros: number;
  registros_importados: number;
  registros_falha: number;
  detalhes_falhas?: ImportError[];
  usuario_id: string;
  evento_id: string;
}

interface ImportHistoryTableProps {
  history: ImportHistoryRecord[];
  isLoading: boolean;
}

const ImportHistoryTable = ({ history, isLoading }: ImportHistoryTableProps) => {
  const [selectedRecord, setSelectedRecord] = useState<ImportHistoryRecord | null>(null);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg">
        <p className="text-muted-foreground">Nenhum histórico de importação encontrado.</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableCaption>Histórico de importações</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Sucesso</TableHead>
            <TableHead>Falhas</TableHead>
            <TableHead>Taxa de Sucesso</TableHead>
            <TableHead className="text-right">Detalhes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((record) => {
            const successRate = record.total_registros > 0
              ? Math.round((record.registros_importados / record.total_registros) * 100)
              : 0;
              
            return (
              <TableRow key={record.id}>
                <TableCell>
                  {new Date(record.data_importacao).toLocaleDateString()}{" "}
                  <span className="text-xs text-muted-foreground block">
                    {formatDistanceToNow(new Date(record.data_importacao), { 
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </span>
                </TableCell>
                <TableCell>{record.total_registros}</TableCell>
                <TableCell>{record.registros_importados}</TableCell>
                <TableCell>
                  {record.registros_falha > 0 ? (
                    <Badge variant="destructive">{record.registros_falha}</Badge>
                  ) : (
                    record.registros_falha
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          successRate > 80 ? "bg-green-600" : 
                          successRate > 50 ? "bg-amber-500" : 
                          "bg-red-600"
                        }`} 
                        style={{ width: `${successRate}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium">{successRate}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {record.detalhes_falhas && record.detalhes_falhas.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedRecord(record)}
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <ImportErrorDetailsModal
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        errors={selectedRecord?.detalhes_falhas || []}
        date={selectedRecord?.data_importacao}
      />
    </>
  );
};

export default ImportHistoryTable;
