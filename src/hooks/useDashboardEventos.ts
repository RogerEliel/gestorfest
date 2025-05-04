// src/hooks/useDashboardEventos.ts
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface Evento {
  id: string;
  nome: string;
  data_evento: string;
  local: string;
  slug: string;
  total_convidados?: number;
  total_confirmados?: number;
}

export function useDashboardEventos() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchEventos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await supabase.functions.invoke("eventos", { method: "GET" });

      if (res.error) {
        throw new Error(res.error.message || "Erro desconhecido ao buscar eventos");
      }

      setEventos(res.data ?? []);
    } catch (err: any) {
      console.error("Error fetching eventos:", err);
      setError(err);
      toast({
        title: "Erro ao carregar eventos",
        description: err.message || "Não foi possível carregar seus eventos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    // Busca inicial
    fetchEventos();

    // Inscreve em mudanças em tempo real na tabela 'eventos'
    const channel = supabase
      .channel("public:eventos")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "eventos" },
        () => {
          fetchEventos();
        }
      )
      .subscribe();

    // Cleanup ao desmontar
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchEventos]);

  return { eventos, loading, error, refetch: fetchEventos };
}
