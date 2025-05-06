
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import ConsentCheckbox from "./ConsentCheckbox";
import { supabase } from "@/integrations/supabase/client";
import CustomLabel from "./ui/custom-label";

interface RSVPFormProps {
  eventSlug: string;
  conviteId: string;
  onSuccess?: () => void;
}

const formSchema = z.object({
  nome: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  resposta: z.string().optional(),
  consentimentoDado: z.boolean().refine(val => val === true, {
    message: "Por favor, aceite o Termo de Consentimento para prosseguir."
  })
});

type FormValues = z.infer<typeof formSchema>;

const RSVPForm = ({ eventSlug, conviteId, onSuccess }: RSVPFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      resposta: "",
      consentimentoDado: false
    }
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Call the Supabase Edge Function for public RSVP response
      const { data, error } = await supabase.functions.invoke(
        `convites/resposta-publica/${eventSlug}/${conviteId}`, 
        {
          method: 'POST',
          body: JSON.stringify({
            status: "confirmado", // You might want to make this dynamic based on a selection
            resposta: values.resposta,
            consentimentoDado: values.consentimentoDado
          })
        }
      );

      if (error) {
        throw new Error(error.message || "Erro ao processar RSVP");
      }

      if (!data) {
        throw new Error("Não foi possível criar o evento");
      }

      toast({
        title: "Presença confirmada!",
        description: "Sua resposta foi registrada com sucesso.",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("RSVP error:", error);
      
      let errorMessage = "Erro ao confirmar presença. Tente novamente.";
      
      if (error.message?.includes("consentimento_negado")) {
        errorMessage = "Por favor, aceite o Termo de Consentimento para prosseguir.";
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <CustomLabel>Nome</CustomLabel>
              <FormControl>
                <Input placeholder="Seu nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="resposta"
          render={({ field }) => (
            <FormItem>
              <CustomLabel>Mensagem (opcional)</CustomLabel>
              <FormControl>
                <Textarea 
                  placeholder="Alguma observação para o organizador do evento?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <ConsentCheckbox control={form.control} name="consentimentoDado" />
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Confirmar Presença"}
        </Button>
      </form>
    </Form>
  );
};

export default RSVPForm;
