
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import Footer from "@/components/Footer";

interface FormData {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  aceitarTermos: boolean;
}

const Cadastro = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    // Aqui seria implementada a lógica de cadastro com o Supabase
    console.log("Dados de cadastro:", data);
    
    try {
      // Simular o cadastro com um timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Cadastro realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      toast.error("Erro ao realizar cadastro. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Cadastro | GestorFest</title>
        <meta name="description" content="Faça seu cadastro na plataforma GestorFest para gerenciar seus eventos." />
      </Helmet>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">Crie sua conta</h1>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                type="text"
                {...register("nome", { required: "Nome é obrigatório" })}
                placeholder="Seu nome completo"
              />
              {errors.nome && (
                <p className="text-sm text-red-500 mt-1">{errors.nome.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                {...register("email", { 
                  required: "E-mail é obrigatório",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Endereço de e-mail inválido"
                  }
                })}
                placeholder="seu.email@exemplo.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                {...register("senha", { 
                  required: "Senha é obrigatória",
                  minLength: {
                    value: 6,
                    message: "A senha deve ter pelo menos 6 caracteres"
                  }
                })}
                placeholder="Sua senha"
              />
              {errors.senha && (
                <p className="text-sm text-red-500 mt-1">{errors.senha.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="confirmarSenha">Confirme sua senha</Label>
              <Input
                id="confirmarSenha"
                type="password"
                {...register("confirmarSenha", { 
                  required: "Confirmação de senha é obrigatória",
                  validate: value => value === watch('senha') || "As senhas não correspondem"
                })}
                placeholder="Confirme sua senha"
              />
              {errors.confirmarSenha && (
                <p className="text-sm text-red-500 mt-1">{errors.confirmarSenha.message}</p>
              )}
            </div>
            
            <div className="flex items-start space-x-2 pt-2">
              <Checkbox
                id="aceitarTermos"
                {...register("aceitarTermos", { 
                  required: "Você precisa aceitar os termos para continuar" 
                })}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="aceitarTermos"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Li e concordo com os{" "}
                  <Link to="/termos-de-uso" className="text-blue-600 hover:underline">
                    Termos de Uso
                  </Link>{" "}
                  e a{" "}
                  <Link to="/politica-de-privacidade" className="text-blue-600 hover:underline">
                    Política de Privacidade
                  </Link>.
                </label>
                {errors.aceitarTermos && (
                  <p className="text-sm text-red-500">{errors.aceitarTermos.message}</p>
                )}
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cadastro;
