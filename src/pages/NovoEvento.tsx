
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/Footer";

const eventoSchema = z.object({
  nome: z.string().min(3, "Nome do evento deve ter pelo menos 3 caracteres"),
  data_evento: z.date({
    required_error: "Por favor, selecione uma data para o evento",
  }),
  local: z.string().min(3, "Local do evento deve ter pelo menos 3 caracteres"),
});

type EventoFormValues = z.infer<typeof eventoSchema>;

const NovoEvento = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
      
      const { data, error } = await supabase.functions.invoke("eventos", {
        method: "POST",
        body: {
          nome: values.nome,
          data_evento: values.data_evento.toISOString(),
          local: values.local,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Evento criado com sucesso!",
        description: "Agora você pode adicionar convidados ao seu evento.",
      });
      
      // Redirect to event page or dashboard
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

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Novo Evento</CardTitle>
            <CardDescription className="text-center">
              Crie um novo evento para começar a enviar convites
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do evento</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Aniversário de 15 anos da Maria" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="data_evento"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data do evento</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                              ) : (
                                <span>Escolha uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="local"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Local do evento</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Salão de Festas ABC" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Criando..." : "Criar Evento"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Cancelar
            </Button>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default NovoEvento;
