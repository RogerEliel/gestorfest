
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import GraphPie from "./GraphPie";

interface DashboardData {
  total_convites: number;
  confirmados: {
    quantidade: number;
    porcentagem: number;
  };
  recusados: {
    quantidade: number;
    porcentagem: number;
  };
  pendentes: {
    quantidade: number;
    porcentagem: number;
  };
  conversar: {
    quantidade: number;
    porcentagem: number;
  };
  dados_grafico: {
    nome: string;
    valor: number;
    cor: string;
  }[];
}

interface DashboardStatsProps {
  eventoId: string;
}

const DashboardStats = ({ eventoId }: DashboardStatsProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dados, setDados] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase.functions.invoke(`convites/eventos/${eventoId}/dashboard`, {
          method: "GET"
        });

        if (error) throw new Error(error.message);
        
        setDados(data);
      } catch (err: any) {
        console.error("Erro ao buscar dados do dashboard:", err);
        setError(err.message || "Erro ao carregar dados do dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (eventoId) {
      fetchDashboardData();
    }
  }, [eventoId]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse bg-gray-100">
            <CardHeader className="py-2">
              <div className="h-5 bg-gray-200 rounded w-20"></div>
            </CardHeader>
            <CardContent className="pb-2 pt-0">
              <div className="h-8 bg-gray-200 rounded w-10 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 text-red-800 rounded-md">
        <p>Erro ao carregar estatísticas: {error}</p>
      </div>
    );
  }

  if (!dados) {
    return null;
  }

  const graphData = dados.dados_grafico.map(item => ({
    name: item.nome,
    value: item.valor,
    color: item.cor
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-green-50">
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-medium">Confirmados</CardTitle>
          </CardHeader>
          <CardContent className="pb-2 pt-0">
            <p className="text-2xl font-bold">{dados.confirmados.quantidade}</p>
            <p className="text-xs text-muted-foreground">
              {dados.confirmados.porcentagem.toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50">
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-medium">Recusados</CardTitle>
          </CardHeader>
          <CardContent className="pb-2 pt-0">
            <p className="text-2xl font-bold">{dados.recusados.quantidade}</p>
            <p className="text-xs text-muted-foreground">
              {dados.recusados.porcentagem.toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-50">
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          </CardHeader>
          <CardContent className="pb-2 pt-0">
            <p className="text-2xl font-bold">{dados.pendentes.quantidade}</p>
            <p className="text-xs text-muted-foreground">
              {dados.pendentes.porcentagem.toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50">
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-medium">Conversas</CardTitle>
          </CardHeader>
          <CardContent className="pb-2 pt-0">
            <p className="text-2xl font-bold">{dados.conversar.quantidade}</p>
            <p className="text-xs text-muted-foreground">
              {dados.conversar.porcentagem.toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Status</CardTitle>
          <CardDescription>Visão geral das respostas dos convidados</CardDescription>
        </CardHeader>
        <CardContent>
          <GraphPie data={graphData} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
