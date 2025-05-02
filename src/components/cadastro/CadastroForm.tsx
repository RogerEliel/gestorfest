
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { CardContent } from "@/components/ui/card";
import { ButtonPrimary } from "@/components/ui/buttons";
import { cadastroSchema } from "./cadastroSchema";
import UserInfoFields from "./UserInfoFields";
import PasswordFields from "./PasswordFields";
import TermsConsentFields from "./TermsConsentFields";
import { useSignUp } from "@/hooks/useSignUp";

type CadastroFormValues = z.infer<typeof cadastroSchema>;

interface CadastroFormProps {
  setShowTermsModal: (show: boolean) => void;
  setShowLGPDModal: (show: boolean) => void;
}

const CadastroForm = ({ setShowTermsModal, setShowLGPDModal }: CadastroFormProps) => {
  const { handleSignUp, loading } = useSignUp();
  
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
    await handleSignUp(values);
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
