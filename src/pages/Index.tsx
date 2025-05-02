
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ButtonPrimary, ButtonSecondary } from "@/components/ui/buttons";
import { Calendar, Users, Ticket } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            GestorFest
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl">
            Plataforma completa para gerenciamento de eventos e convites
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <ButtonPrimary size="lg" asChild>
                <Link to="/dashboard">Meu Dashboard</Link>
              </ButtonPrimary>
            ) : (
              <>
                <ButtonPrimary size="lg" asChild>
                  <Link to="/cadastro">Criar conta</Link>
                </ButtonPrimary>
                <ButtonSecondary size="lg" asChild>
                  <Link to="/login">Entrar</Link>
                </ButtonSecondary>
              </>
            )}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Crie e gerencie seus eventos com facilidade
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 flex flex-col items-center text-center">
              <div className="bg-primary-lighter/10 p-4 rounded-full mb-4">
                <Calendar className="h-8 w-8 text-primary-lighter" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Organize eventos</h3>
              <p className="text-gray-600">
                Crie eventos, gerencie datas e locais em uma interface simples e intuitiva.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 flex flex-col items-center text-center">
              <div className="bg-primary-lighter/10 p-4 rounded-full mb-4">
                <Ticket className="h-8 w-8 text-primary-lighter" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Envie convites</h3>
              <p className="text-gray-600">
                Importe sua lista de convidados e compartilhe links de confirmação de presença.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 flex flex-col items-center text-center">
              <div className="bg-primary-lighter/10 p-4 rounded-full mb-4">
                <Users className="h-8 w-8 text-primary-lighter" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Acompanhe respostas</h3>
              <p className="text-gray-600">
                Visualize estatísticas e acompanhe quem confirmou presença em tempo real.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Crie sua conta gratuitamente e comece a organizar seus eventos hoje mesmo.
          </p>
          
          {!user && (
            <ButtonPrimary size="lg" asChild>
              <Link to="/cadastro">Criar minha conta</Link>
            </ButtonPrimary>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
