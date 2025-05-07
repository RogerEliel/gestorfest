
import * as z from "zod";

export const cadastroSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Digite um email válido"),
  cpf: z
    .string()
    .min(11, "CPF deve ter 11 dígitos")
    .max(14, "CPF inválido"),
  telefone: z.string().optional(),
  password: z.string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "A senha precisa de pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "A senha precisa de pelo menos uma letra minúscula")
    .regex(/\d/, "A senha precisa de pelo menos um número")
    .regex(/[^A-Za-z0-9]/, "A senha precisa de pelo menos um caractere especial"),
  confirmPassword: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  termos: z.boolean().refine(val => val === true, {
    message: "Você deve aceitar os termos de uso"
  }),
  lgpd: z.boolean().refine(val => val === true, {
    message: "Você deve consentir com o tratamento de dados pessoais"
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
});
