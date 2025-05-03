
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import ForgotPassword from "@/components/auth/ForgotPassword";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      setSession(data.session);
      
      toast({
        title: "Login realizado",
        description: "Você foi conectado com sucesso!",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error logging in:", error);
      
      let errorMessage = "E-mail ou senha inválidos";
      
      if (error.message.includes("Email not confirmed")) {
        errorMessage = "Por favor, confirme seu e-mail antes de fazer login";
      }
      
      toast({
        title: "Erro de autenticação",
        description: errorMessage,
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
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Entrar</CardTitle>
            <CardDescription className="text-center">
              Entre com sua conta para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showForgotPassword ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-gray-700 font-medium">
                    E-mail
                  </label>
                  <Input
                    id="email"
                    placeholder="seu@email.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-gray-700 font-medium">
                      Senha
                    </label>
                    <Button
                      type="button"
                      variant="link"
                      className="px-0 text-sm font-medium"
                      onClick={() => setShowForgotPassword(true)}
                    >
                      Esqueceu a senha?
                    </Button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            ) : (
              <ForgotPassword onBack={() => setShowForgotPassword(false)} />
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-gray-700 text-center">
              Não tem uma conta?{" "}
              <Link to="/cadastro" className="text-blue-600 hover:underline">
                Criar conta
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
