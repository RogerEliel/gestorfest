
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useImportHistory } from "@/hooks/useImportHistory";
import ImportHistoryTable from "./ImportHistoryTable";
import ImportHistoryStats from "./ImportHistoryStats";

interface ImportHistoryDashboardProps {
  eventoId: string;
}

const ImportHistoryDashboard = ({ eventoId }: ImportHistoryDashboardProps) => {
  const { history, loading, refreshHistory } = useImportHistory(eventoId);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshHistory();
    setIsRefreshing(false);
  };

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Histórico de Importações</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw 
            className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} 
          />
          Atualizar
        </Button>
      </CardHeader>
      <CardContent>
        {history.length > 0 && <ImportHistoryStats history={history} />}
        <ImportHistoryTable history={history} isLoading={loading} />
      </CardContent>
    </Card>
  );
};

export default ImportHistoryDashboard;
