
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Evento {
  id: string;
  nome: string;
  data_evento: string;
  local: string;
  slug: string;
  total_convidados?: number;
  total_confirmados?: number;
}

export const useDashboardEventos = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEventos = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke("eventos", {
        method: "GET",
      });

      if (error) throw error;

      setEventos(data || []);
    } catch (error: any) {
      console.error("Error fetching eventos:", error);
      toast({
        title: "Erro ao carregar eventos",
        description: error.message || "Não foi possível carregar seus eventos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
    
    // Set up realtime subscription for eventos table
    const channel = supabase
      .channel('public:eventos')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'eventos' 
        },
        (payload) => {
          console.log('Realtime change received:', payload);
          fetchEventos();
        }
      )
      .subscribe();
      
    // Clean up subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { eventos, loading, fetchEventos };
};
