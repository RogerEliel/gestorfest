
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ButtonPrimary } from "@/components/ui/buttons";
import { useAuth } from "@/contexts/AuthContext";
import { cadastroSchema } from "./cadastroSchema";
import UserInfoFields from "./UserInfoFields";
import PasswordFields from "./PasswordFields";
import TermsConsentFields from "./TermsConsentFields";

type CadastroFormValues = z.infer<typeof cadastroSchema>;

interface CadastroFormProps {
  setShowTermsModal: (show: boolean) => void;
  setShowLGPDModal: (show: boolean) => void;
}

const CadastroForm = ({ setShowTermsModal, setShowLGPDModal }: CadastroFormProps) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp } = useAuth();
  
  const form = useForm<CadastroFormValues>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      nome: "",
      email: "",
      cpf: "",
      telefone: "",
      password: "",
      confirmPassword: "",
      termos: false,
      lgpd: false,
    },
  });

  const onSubmit = async (values: CadastroFormValues) => {
    try {
      setLoading(true);
      
      const { error, data } = await signUp(values.email, values.password, {
        nome: values.nome,
        telefone: values.telefone || undefined,
        cpf: values.cpf,
        tipo: "cliente"
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardContent className="pt-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <UserInfoFields control={form.control} />
          <PasswordFields control={form.control} />
          <TermsConsentFields 
            control={form.control} 
            setShowTermsModal={setShowTermsModal}
            setShowLGPDModal={setShowLGPDModal}
          />
          
          <ButtonPrimary type="submit" className="w-full mt-6" disabled={loading}>
            {loading ? "Cadastrando..." : "Criar conta"}
          </ButtonPrimary>
        </form>
      </Form>
    </CardContent>
  );
};

export default CadastroForm;
