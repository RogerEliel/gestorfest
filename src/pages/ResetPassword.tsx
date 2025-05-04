
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/Footer";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 8) {
      toast({
        title: "Senha fraca",
        description: "A senha deve ter pelo menos 8 caracteres",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== passwordConfirmation) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Senha redefinida",
        description: "Sua senha foi atualizada com sucesso",
      });
      
      // Redirect to login page after successful password reset
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível redefinir sua senha. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isValidPassword = (password: string) => {
    return password.length >= 8 && /[!@#$%^&*(),.?":{}|<>]/.test(password);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-md">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Redefinir senha</h1>
            <p className="text-gray-500">Crie uma nova senha para sua conta</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="password" className="block text-gray-700 font-medium">
                Nova senha
              </label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="text-xs text-gray-500">
                A senha deve ter pelo menos 8 caracteres e incluir um caractere especial.
              </div>
              {password && (
                <div className={`text-xs ${isValidPassword(password) ? 'text-green-600' : 'text-amber-600'}`}>
                  {isValidPassword(password) 
                    ? '✓ Senha válida' 
                    : '✗ A senha não atende aos requisitos mínimos'}
                </div>
              )}
            </div>
            
            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-medium">
                Confirme a senha
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="********"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
              />
              {passwordConfirmation && (
                <div className={`text-xs ${password === passwordConfirmation ? 'text-green-600' : 'text-red-600'}`}>
                  {password === passwordConfirmation 
                    ? '✓ Senhas coincidem' 
                    : '✗ Senhas não coincidem'}
                </div>
              )}
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Redefinindo..." : "Redefinir senha"}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPassword;
