
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Convite {
  id: string;
  nome_convidado: string;
  telefone: string;
  status: "pendente" | "confirmado" | "recusado" | "conversar";
  mensagem_personalizada?: string;
  resposta?: string;
  enviado_em?: string;
  respondido_em?: string;
}

export const useConvitesRealtime = (eventoId: string) => {
  const [convites, setConvites] = useState<Convite[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    confirmados: 0,
    recusados: 0,
    pendentes: 0,
    conversas: 0,
  });
  const { toast } = useToast();

  const fetchConvites = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke(`convites/eventos/${eventoId}`, {
        method: "GET"
      });

      if (error) throw error;
      
      setConvites(data || []);
      
      // Update stats
      const total = data?.length || 0;
      const confirmados = data?.filter((c: Convite) => c.status === "confirmado").length || 0;
      const recusados = data?.filter((c: Convite) => c.status === "recusado").length || 0;
      const pendentes = data?.filter((c: Convite) => c.status === "pendente").length || 0;
      const conversas = data?.filter((c: Convite) => c.status === "conversar").length || 0;
      
      setStats({ total, confirmados, recusados, pendentes, conversas });
    } catch (error: any) {
      console.error("Error fetching convites:", error);
      toast({
        title: "Erro ao carregar convidados",
        description: error.message || "Não foi possível carregar a lista de convidados.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConvites();
    
    // Set up realtime subscription for convites table
    const channel = supabase
      .channel('public:convites')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'convites',
          filter: `evento_id=eq.${eventoId}`,
        },
        (payload) => {
          console.log('Convite realtime change received:', payload);
          fetchConvites();
        }
      )
      .subscribe();
      
    // Clean up subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventoId]);

  return { convites, loading, stats, refreshConvites: fetchConvites };
};
