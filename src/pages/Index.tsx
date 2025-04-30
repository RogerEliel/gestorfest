
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold mb-4">Bem-vindo ao GestorFest</h1>
          <p className="text-xl text-gray-600 mb-8">Plataforma para gerenciamento de eventos e convites</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to="/cadastro">Criar conta</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/login">Entrar</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
