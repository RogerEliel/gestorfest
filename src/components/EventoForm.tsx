import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { CustomPopoverTrigger } from "@/components/ui/custom-popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { EventoFormValues, eventoSchema } from "@/hooks/useEventoForm";
import { UseFormReturn } from "react-hook-form";
import { CustomLabel } from "./ui/custom-label";

interface EventoFormProps {
  form: UseFormReturn<EventoFormValues>;
  loading: boolean;
  onSubmit: (values: EventoFormValues) => Promise<void>;
  onCancel: () => void;
}

const EventoForm = ({ form, loading, onSubmit, onCancel }: EventoFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <CustomLabel>Nome do evento</CustomLabel>
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
              <CustomLabel>Data do evento</CustomLabel>
              <Popover>
                <CustomPopoverTrigger asChild>
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
                </CustomPopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    locale={ptBR}
                    className="pointer-events-auto"
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
              <CustomLabel>Local do evento</CustomLabel>
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
  );
};

export default EventoForm;
