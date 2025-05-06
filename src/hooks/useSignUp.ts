
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";
import { cadastroSchema } from "@/components/cadastro/cadastroSchema";

type CadastroFormValues = z.infer<typeof cadastroSchema>;

export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp } = useAuth();

  const handleSignUp = async (values: CadastroFormValues) => {
    try {
      setLoading(true);
      
      const { error } = await signUp({
        nome: values.nome,
        email: values.email,
        password: values.password,
        telefone: values.telefone || undefined,
        cpf: values.cpf
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Você já pode fazer login no sistema.",
      });
      
      // Redirect to login page
      navigate("/login");
      
      return { success: true };
    } catch (error: any) {
      console.error("Registration error:", error);
      
      let errorMessage = "Erro ao criar conta. Tente novamente.";
      
      if (error.message?.includes("already exists")) {
        errorMessage = "Este email já está cadastrado.";
      }
      
      toast({
        title: "Erro no cadastro",
        description: errorMessage,
        variant: "destructive",
      });
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSignUp,
    loading
  };
};
