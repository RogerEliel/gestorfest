
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { InputText, InputEmail, InputPassword, InputCPF } from "@/components/ui/inputs";
import { ButtonPrimary } from "@/components/ui/buttons";
import CheckboxLGPD from "@/components/CheckboxLGPD";
import ModalTerms from "@/components/ModalTerms";
import { useAuth } from "@/contexts/AuthContext";

// CPF validation function is now in InputCPF component

const cadastroSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Digite um email válido"),
  cpf: z
    .string()
    .min(11, "CPF deve ter 11 dígitos")
    .max(14, "CPF inválido"),
  telefone: z.string().optional(),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
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

type CadastroFormValues = z.infer<typeof cadastroSchema>;

const Cadastro = () => {
  const [loading, setLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showLGPDModal, setShowLGPDModal] = useState(false);
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
    <div className="py-10 px-4">
      <div className="max-w-md mx-auto">
        <Card className="border-primary-lighter/20 shadow-lg">
          <CardHeader className="text-center bg-gradient-primary text-white rounded-t-lg">
            <CardTitle className="text-2xl">Criar Conta</CardTitle>
            <CardDescription className="text-white/80">
              Cadastre-se no GestorFest para começar
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo</FormLabel>
                      <FormControl>
                        <InputText placeholder="Seu nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <InputEmail placeholder="seu@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <InputCPF
                          placeholder="000.000.000-00"
                          {...field}
                        />
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
                      <FormLabel>Telefone (opcional)</FormLabel>
                      <FormControl>
                        <InputText placeholder="(00) 00000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <InputPassword placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirme a senha</FormLabel>
                      <FormControl>
                        <InputPassword placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-2 pt-2">
                  <CheckboxLGPD
                    control={form.control}
                    name="termos"
                    label={
                      <>
                        Li e aceito os{" "}
                        <button
                          type="button"
                          className="text-primary-lighter hover:underline font-medium"
                          onClick={() => setShowTermsModal(true)}
                        >
                          termos de uso
                        </button>
                        {" "}e{" "}
                        <Link to="/politica-de-privacidade" className="text-primary-lighter hover:underline font-medium" target="_blank">
                          política de privacidade
                        </Link>
                      </>
                    }
                  />
                  
                  <CheckboxLGPD
                    control={form.control}
                    name="lgpd"
                    label={
                      <>
                        Consinto com o{" "}
                        <button 
                          type="button"
                          className="text-primary-lighter hover:underline font-medium"
                          onClick={() => setShowLGPDModal(true)}
                        >
                          tratamento dos meus dados pessoais
                        </button>
                        {" "}de acordo com a LGPD
                      </>
                    }
                  />
                </div>
                
                <ButtonPrimary type="submit" className="w-full mt-6" disabled={loading}>
                  {loading ? "Cadastrando..." : "Criar conta"}
                </ButtonPrimary>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 bg-gray-50 rounded-b-lg">
            <div className="text-sm text-center text-gray-500">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-primary-lighter hover:underline font-medium">
                Faça login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      <ModalTerms
        open={showTermsModal}
        onOpenChange={setShowTermsModal}
        title="Termos de Uso"
        content={
          <div className="prose max-w-none">
            <p>Leia os termos de uso completos em nossa página de <Link to="/termos-de-uso" target="_blank" className="text-primary-lighter">Termos de Uso</Link>.</p>
            <p>Ao criar uma conta no GestorFest, você concorda com nossos termos e condições de uso.</p>
          </div>
        }
      />
      
      <ModalTerms
        open={showLGPDModal}
        onOpenChange={setShowLGPDModal}
        title="Tratamento de Dados Pessoais"
        content={
          <div className="prose max-w-none">
            <p>Leia o termo de consentimento completo em nossa página de <Link to="/termo-de-consentimento" target="_blank" className="text-primary-lighter">Termo de Consentimento</Link>.</p>
            <p>Em conformidade com a Lei Geral de Proteção de Dados (LGPD), seus dados pessoais serão tratados apenas para os fins especificados em nossa política de privacidade.</p>
          </div>
        }
      />
    </div>
  );
};

export default Cadastro;
