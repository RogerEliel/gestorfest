import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ImportError {
  row: number;
  error: string;
}

export interface ImportHistoryRecord {
  id: string;
  data_importacao: string;
  evento_id: string;
  total_registros: number;
  registros_importados: number;
  registros_falha: number;
  detalhes_falhas: ImportError[] | null;
  created_at: string;
  updated_at: string;
  usuario_id: string;
}

export function useImportHistory(eventoId: string | undefined) {
  const [history, setHistory] = useState<ImportHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    if (!eventoId) {
      setHistory([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Garantir que temos o token de autenticação
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error("Usuário não autenticado");
      }

      const { data, error } = await supabase
        .from('auditoria_importacoes')
        .select('*')
        .eq('evento_id', eventoId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Ensure proper conversion of detalhes_falhas to ImportError[]
      const processedData: ImportHistoryRecord[] = data.map((record: any) => {
        let processedDetailsFalhas: ImportError[] | null = null;
        
        if (record.detalhes_falhas) {
          try {
            // If it's a string, try to parse it as JSON
            if (typeof record.detalhes_falhas === 'string') {
              processedDetailsFalhas = JSON.parse(record.detalhes_falhas) as ImportError[];
            } 
            // If it's already an array, ensure it has the right shape
            else if (Array.isArray(record.detalhes_falhas)) {
              processedDetailsFalhas = record.detalhes_falhas.map((item: any) => ({
                row: typeof item.row === 'number' ? item.row : 0,
                error: typeof item.error === 'string' ? item.error : String(item.error || '')
              }));
            } 
            // Otherwise set to null
            else {
              processedDetailsFalhas = null;
            }
          } catch (e) {
            console.error("Error parsing detalhes_falhas:", e);
            processedDetailsFalhas = null;
          }
        }
        
        return {
          ...record,
          detalhes_falhas: processedDetailsFalhas
        };
      });

      setHistory(processedData);
    } catch (error) {
      console.error('Error fetching import history:', error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [eventoId]);

  // Fetch history on mount and when eventoId changes
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { 
    history, 
    loading, 
    refreshHistory: fetchHistory
  };
}
