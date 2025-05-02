
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { InputEmail, InputPassword } from "@/components/ui/inputs";
import { ButtonPrimary } from "@/components/ui/buttons";
import { useAuth } from "@/contexts/AuthContext";

const loginSchema = z.object({
  email: z.string().email("Digite um email válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { signIn, user } = useAuth();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // If the user is already logged in, redirect them
  useEffect(() => {
    if (user) {
      const redirectPath = sessionStorage.getItem("redirectAfterLogin") || "/dashboard";
      sessionStorage.removeItem("redirectAfterLogin");
      navigate(redirectPath);
    }
  }, [user, navigate]);

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setLoading(true);
      
      const { error, data } = await signIn(values.email, values.password);

      if (error) {
        throw error;
      }

      if (data) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Você será redirecionado para o dashboard.",
        });
        
        // Redirect to dashboard or the original intended destination
        const redirectPath = sessionStorage.getItem("redirectAfterLogin") || "/dashboard";
        sessionStorage.removeItem("redirectAfterLogin");
        navigate(redirectPath);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      let errorMessage = "Erro ao fazer login. Verifique suas credenciais.";
      
      if (error.message?.includes("Invalid login")) {
        errorMessage = "Email ou senha incorretos.";
      }
      
      toast({
        title: "Erro ao fazer login",
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
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription className="text-white/80">
              Entre na sua conta do GestorFest
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <ButtonPrimary type="submit" className="w-full mt-6" disabled={loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </ButtonPrimary>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 bg-gray-50 rounded-b-lg">
            <div className="text-sm text-center text-gray-500">
              Ainda não tem uma conta?{" "}
              <Link to="/cadastro" className="text-primary-lighter hover:underline font-medium">
                Cadastre-se
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
