
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

export const useImportHistory = (eventoId: string) => {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<ImportHistoryRecord[]>([]);
  const { toast } = useToast();

  const fetchImportHistory = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("auditoria_importacoes")
        .select("*")
        .eq("evento_id", eventoId)
        .order("data_importacao", { ascending: false });

      if (error) throw error;
      
      setHistory(data || []);
    } catch (error: any) {
      console.error("Error fetching import history:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o histórico de importações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventoId) {
      fetchImportHistory();
    }
  }, [eventoId]);

  return { history, loading, refreshHistory: fetchImportHistory };
};
