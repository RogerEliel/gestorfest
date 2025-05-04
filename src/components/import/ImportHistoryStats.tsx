
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface ImportHistoryRecord {
  id: string;
  data_importacao: string;
  total_registros: number;
  registros_importados: number;
  registros_falha: number;
  detalhes_falhas?: Array<{ row: number; error: string }>;
  usuario_id: string;
  evento_id: string;
}

interface ImportHistoryStatsProps {
  history: ImportHistoryRecord[];
}

const ImportHistoryStats = ({ history }: ImportHistoryStatsProps) => {
  // Only show last 10 imports
  const limitedHistory = history.slice(0, 10).reverse();
  
  const chartData = limitedHistory.map((record) => ({
    date: new Date(record.data_importacao).toLocaleDateString(),
    Sucesso: record.registros_importados,
    Falhas: record.registros_falha,
  }));

  const totalRecords = history.reduce(
    (acc, record) => acc + record.total_registros, 
    0
  );
  
  const totalSuccess = history.reduce(
    (acc, record) => acc + record.registros_importados, 
    0
  );
  
  const totalFailures = history.reduce(
    (acc, record) => acc + record.registros_falha, 
    0
  );
  
  const averageSuccessRate = totalRecords > 0 
    ? Math.round((totalSuccess / totalRecords) * 100) 
    : 0;
  
  const chartConfig = {
    "Sucesso": {
      label: "Importações com sucesso",
      theme: { light: "#10b981", dark: "#10b981" }
    },
    "Falhas": {
      label: "Importações com falha",
      theme: { light: "#ef4444", dark: "#ef4444" }
    },
  };
  
  return (
    <div className="space-y-4 mb-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalRecords}</div>
            <CardTitle className="text-muted-foreground text-xs mt-1">
              Total de Registros
            </CardTitle>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{totalSuccess}</div>
            <CardTitle className="text-muted-foreground text-xs mt-1">
              Importados com Sucesso
            </CardTitle>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              <span className={totalFailures > 0 ? "text-red-600" : "text-gray-600"}>
                {totalFailures}
              </span>
            </div>
            <CardTitle className="text-muted-foreground text-xs mt-1">
              Falhas de Importação
            </CardTitle>
          </CardContent>
        </Card>
      </div>

      {chartData.length > 1 && (
        <Card>
          <CardContent className="pt-6">
            <CardTitle className="mb-4">Taxa de Sucesso: {averageSuccessRate}%</CardTitle>
            <div className="h-[200px]">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      fontSize={12}
                      tickFormatter={(value) => value.split('/').slice(0, 2).join('/')}
                    />
                    <YAxis fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Area 
                      type="monotone" 
                      dataKey="Sucesso" 
                      stackId="1" 
                      stroke="var(--color-Sucesso)" 
                      fill="var(--color-Sucesso)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="Falhas" 
                      stackId="1" 
                      stroke="var(--color-Falhas)" 
                      fill="var(--color-Falhas)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImportHistoryStats;
