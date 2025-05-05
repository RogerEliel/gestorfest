
import { z } from "zod";
import { isValidPhoneNumber } from "@/lib/validation";

// Schema for a single guest
export const singleGuestSchema = z.object({
  nome_convidado: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  telefone: z.string()
    .min(8, "O telefone deve ter pelo menos 8 dígitos")
    .refine(val => isValidPhoneNumber(val), {
      message: "Telefone inválido. Formato esperado: +5511999999999"
    }),
  mensagem_personalizada: z.string().optional(),
});

export type SingleGuestFormValues = z.infer<typeof singleGuestSchema>;

// Schema for batch import
export const batchGuestSchema = z.array(singleGuestSchema);

export type BatchGuestImportValues = z.infer<typeof batchGuestSchema>;
