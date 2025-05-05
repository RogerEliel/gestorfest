
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SingleGuestFormValues } from "@/schemas/convite";

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

export const useConvites = (eventoId: string) => {
  const [convites, setConvites] = useState<Convite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchConvites = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.functions.invoke(`convites/eventos/${eventoId}`, {
        method: "GET"
      });

      if (error) throw error;
      
      setConvites(data || []);
    } catch (error: any) {
      console.error("Error fetching convites:", error);
      setError(error);
      toast({
        title: "Erro ao carregar convidados",
        description: error.message || "Não foi possível carregar a lista de convidados.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addConvite = async (data: SingleGuestFormValues) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: newConvite, error } = await supabase.functions.invoke(`convites/eventos/${eventoId}/criar-lote`, {
        method: "POST",
        body: { convites: [data] },
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (error) throw error;
      
      // Refresh the list after adding
      await fetchConvites();
      
      toast({
        title: "Convidado adicionado",
        description: `${data.nome_convidado} foi adicionado com sucesso.`,
      });
      
      return newConvite;
    } catch (error: any) {
      console.error("Error adding convite:", error);
      setError(error);
      
      // Check for duplicate phone error
      if (error.message && error.message.includes("telefone já está registrado")) {
        toast({
          title: "Erro ao adicionar convidado",
          description: "Este telefone já está registrado para este evento.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro ao adicionar convidado",
          description: error.message || "Não foi possível adicionar o convidado.",
          variant: "destructive",
        });
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { 
    convites, 
    loading, 
    error, 
    fetchConvites, 
    addConvite 
  };
};
