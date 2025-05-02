
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const eventoSchema = z.object({
  nome: z.string().min(3, "Nome do evento deve ter pelo menos 3 caracteres"),
  data_evento: z.date({
    required_error: "Por favor, selecione uma data para o evento",
  }),
  local: z.string().min(3, "Local do evento deve ter pelo menos 3 caracteres"),
});

export type EventoFormValues = z.infer<typeof eventoSchema>;

export const useEventoForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useAuth();
  
  const form = useForm<EventoFormValues>({
    resolver: zodResolver(eventoSchema),
    defaultValues: {
      nome: "",
      local: "",
    },
  });

  const onSubmit = async (values: EventoFormValues) => {
    try {
      setLoading(true);
      
      if (!session) {
        throw new Error("Você precisa estar autenticado para criar um evento");
      }

      console.log("Creating event with values:", {
        nome: values.nome,
        data_evento: values.data_evento.toISOString(),
        local: values.local,
      });
      
      const { data, error } = await supabase.functions.invoke("eventos", {
        method: "POST",
        body: {
          nome: values.nome,
          data_evento: values.data_evento.toISOString(),
          local: values.local,
        },
      });

      if (error) {
        console.error("Error from API:", error);
        throw new Error(error.message || "Erro ao criar evento");
      }

      if (!data) {
        throw new Error("Não foi possível criar o evento");
      }

      console.log("Event created successfully:", data);
      
      toast({
        title: "Evento criado com sucesso!",
        description: "Agora você pode adicionar convidados ao seu evento.",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error creating event:", error);
      
      toast({
        title: "Erro ao criar evento",
        description: error.message || "Não foi possível criar o evento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    onSubmit
  };
};
