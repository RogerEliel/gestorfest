
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SingleGuestFormValues, singleGuestSchema } from "@/schemas/convite";
import { formatPhoneNumber } from "@/lib/validation";

interface ManualGuestFormProps {
  onSubmit: (data: SingleGuestFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const ManualGuestForm: React.FC<ManualGuestFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const form = useForm<SingleGuestFormValues>({
    resolver: zodResolver(singleGuestSchema),
    defaultValues: {
      nome_convidado: "",
      telefone: "",
      mensagem_personalizada: "",
    },
  });

  const handleSubmit = async (data: SingleGuestFormValues) => {
    // Format phone number before submission
    const formattedData = {
      ...data,
      telefone: formatPhoneNumber(data.telefone),
    };
    
    try {
      await onSubmit(formattedData);
      form.reset();
    } catch (error) {
      // Error is handled by the parent component
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome_convidado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do convidado*</FormLabel>
              <FormControl>
                <Input placeholder="Nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="telefone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone*</FormLabel>
              <FormControl>
                <Input placeholder="+5511999999999" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mensagem_personalizada"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observação</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Mensagem personalizada ou observação (opcional)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar Convidado"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ManualGuestForm;
