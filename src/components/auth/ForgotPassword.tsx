
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ForgotPassword = ({ onBack }: { onBack: () => void }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Erro",
        description: "Por favor, informe seu e-mail",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      });
      
      if (error) throw error;
      
      setIsSent(true);
      toast({
        title: "E-mail enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha",
      });
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível enviar o e-mail de redefinição de senha",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {!isSent ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-center">Esqueceu sua senha?</h2>
            <p className="text-gray-500 text-center">
              Digite seu e-mail e enviaremos um link para redefinir sua senha.
            </p>
          </div>
          
          <div>
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Enviando..." : "Enviar link de redefinição"}
          </Button>
          
          <div className="text-center">
            <Button type="button" variant="link" onClick={onBack}>
              Voltar para o login
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-md">
            <h3 className="text-green-800 font-medium">E-mail enviado!</h3>
            <p className="text-green-700 text-sm">
              Verifique sua caixa de entrada para o link de redefinição de senha.
            </p>
          </div>
          
          <Button onClick={onBack} className="w-full">
            Voltar para o login
          </Button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
