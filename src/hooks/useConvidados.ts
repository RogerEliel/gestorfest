
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface Convidado {
  id: string;
  nome: string;
  telefone: string;
  observacao: string | null;
  criado_em: string;
}

export function useConvidados(eventoId: string) {
  const [lista, setLista] = useState<Convidado[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const fetch = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke(`eventos/${eventoId}/convidados`, {
        method: "GET"
      });

      if (error) {
        throw error;
      }
      
      setLista(data || []);
    } catch (error: any) {
      console.error("Erro ao carregar convidados:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de convidados.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const adicionar = async (
    nome: string,
    telefone: string,
    observacao?: string
  ) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke(`eventos/${eventoId}/convidados`, {
        method: "POST",
        body: { nome, telefone, observacao },
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (error) {
        throw error;
      }
      
      toast({
        title: "Convidado adicionado",
        description: `${nome} foi adicionado com sucesso.`,
      });
      
      // Recarrega a lista após a adição
      await fetch();
      
      return data;
    } catch (error: any) {
      console.error("Erro ao adicionar convidado:", error);
      toast({
        title: "Erro ao adicionar convidado",
        description: error.message || "Não foi possível adicionar o convidado.",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  // Carrega a lista quando o componente é montado ou o eventoId muda
  useEffect(() => {
    if (eventoId) {
      fetch();
    }
  }, [eventoId]);

  // Configura escuta em tempo real para atualizações na tabela convidados
  useEffect(() => {
    if (!eventoId) return;
    
    const channel = supabase
      .channel('convidados-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'convidados',
          filter: `evento_id=eq.${eventoId}`
        },
        () => {
          // Recarrega quando há mudanças
          fetch();
        }
      )
      .subscribe();
    
    // Limpa a assinatura quando o componente é desmontado
    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventoId]);

  return { lista, loading, fetch, adicionar };
}
