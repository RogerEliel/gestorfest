
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsLoggedIn(true);
      }
    };

    checkSession();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold mb-4">Bem-vindo ao GestorFest</h1>
          <p className="text-xl text-gray-600 mb-8">Plataforma para gerenciamento de eventos e convites</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isLoggedIn ? (
              <Button asChild>
                <Link to="/dashboard">Meu Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild>
                  <Link to="/cadastro">Criar conta</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/login">Entrar</Link>
                </Button>
              </>
            )}
          </div>
          
          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-4">Crie e gerencie seus eventos com facilidade</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-medium mb-2">Organize eventos</h3>
                <p className="text-gray-600">Crie eventos, gerencie datas e locais em uma interface simples e intuitiva.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-medium mb-2">Envie convites</h3>
                <p className="text-gray-600">Importe sua lista de convidados e compartilhe links de confirmação de presença.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-medium mb-2">Acompanhe respostas</h3>
                <p className="text-gray-600">Visualize estatísticas e acompanhe quem confirmou presença em tempo real.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
