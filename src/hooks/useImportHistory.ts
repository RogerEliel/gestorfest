
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
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!eventoId) {
      setHistory([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Ensure we have authentication
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error("Usuário não autenticado");
      }

      console.log("Fetching import history for evento:", eventoId);
      
      const { data, error } = await supabase
        .from('auditoria_importacao') // Corrigido de "auditoria_importacoes" para "auditoria_importacao"
        .select('*')
        .eq('evento_id', eventoId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching import history:", error);
        throw error;
      }
      
      console.log("Import history raw data:", data);
      
      // Process the data to ensure proper types
      const processedData: ImportHistoryRecord[] = data.map((record: any) => {
        // Ensure proper conversion of detalhes_falhas to ImportError[]
        let processedDetailsFalhas: ImportError[] | null = null;
        
        if (record.detalhes_falhas) {
          try {
            if (typeof record.detalhes_falhas === 'string') {
              // If it's a string, parse it as JSON
              processedDetailsFalhas = JSON.parse(record.detalhes_falhas) as ImportError[];
            } 
            else if (Array.isArray(record.detalhes_falhas)) {
              // If it's already an array, ensure it has the right shape
              processedDetailsFalhas = record.detalhes_falhas.map((item: any) => ({
                row: typeof item.row === 'number' ? item.row : 0,
                error: typeof item.error === 'string' ? item.error : String(item.error || '')
              }));
            } 
            else if (record.detalhes_falhas && typeof record.detalhes_falhas === 'object') {
              // If it's an object but not an array, convert properly
              processedDetailsFalhas = Object.entries(record.detalhes_falhas).map(([key, value]: [string, any]) => ({
                row: parseInt(key) || 0,
                error: typeof value === 'string' ? value : String(value || '')
              }));
            }
            else {
              // Otherwise set to null
              processedDetailsFalhas = null;
            }
          } catch (e) {
            console.error("Error parsing detalhes_falhas:", e, record.detalhes_falhas);
            processedDetailsFalhas = null;
          }
        }
        
        return {
          ...record,
          // Ensure numeric fields are numbers
          total_registros: Number(record.total_registros),
          registros_importados: Number(record.registros_importados),
          registros_falha: Number(record.registros_falha),
          detalhes_falhas: processedDetailsFalhas
        };
      });

      console.log("Processed import history data:", processedData);
      setHistory(processedData);
    } catch (err) {
      console.error('Error fetching import history:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao carregar histórico');
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
    error, 
    refreshHistory: fetchHistory
  };
}
