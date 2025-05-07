
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ButtonPrimary, ButtonSecondary } from "@/components/ui/buttons";
import { Calendar, Users, Ticket, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col">
      {/* Hero Section with improved visual hierarchy */}
      <section className="bg-gradient-primary text-white py-20 md:py-28 relative overflow-hidden">
        {/* Background pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOFYwYzkuOTQgMCAxOCA4LjA2IDE4IDE4aDkuOTRjMC05Ljk0LTguMDYtMTgtMTgtMThWMGM5Ljk0IDAgMTggOC4wNiAxOCAxOGgxOHYxOEgwVjBNMCA2MGg2MFY0MkgwIiBvcGFjaXR5PSIuMDUiIGZpbGw9IiNGRkYiLz48cGF0aCBkPSJNMzAgMzBjMC05Ljk0LTguMDYtMTgtMTgtMThWMTJjOS45NCAwIDE4IDguMDYgMTggMThoMTJ2MTJIMFYwIiBvcGFjaXR5PSIuMDUiIGZpbGw9IiNGRkYiLz48cGF0aCBkPSJNMTggNDJjMC05Ljk0IDguMDYtMTggMTgtMThzMTggOC4wNiAxOCAxOGgtNmMwLTYuNjMtNS4zNy0xMi0xMi0xMnMtMTIgNS4zNy0xMiAxMnoiIG9wYWNpdHk9Ii4xIiBmaWxsPSIjRkZGIi8+PC9nPjwvc3ZnPg==')]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-6/12 text-center lg:text-left mb-10 lg:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Gerencie Eventos com Facilidade
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl mx-auto lg:mx-0">
                Plataforma completa para gerenciamento de eventos e convites. Organize, envie e acompanhe em um só lugar.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {user ? (
                  <ButtonPrimary size="lg" asChild className="group transition-all duration-300 transform hover:scale-105">
                    <Link to="/dashboard">
                      Meu Dashboard
                      <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                    </Link>
                  </ButtonPrimary>
                ) : (
                  <>
                    <ButtonPrimary size="lg" asChild className="group transition-all duration-300 transform hover:scale-105">
                      <Link to="/cadastro">
                        Começar Grátis
                        <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                      </Link>
                    </ButtonPrimary>
                    <ButtonSecondary size="lg" asChild className="border-white text-white hover:bg-white/20">
                      <Link to="/login">Entrar</Link>
                    </ButtonSecondary>
                  </>
                )}
              </div>
              
              {/* Social proof */}
              <div className="mt-10 hidden md:block">
                <p className="text-white/70 font-medium mb-3">Confiado por organizadores de eventos</p>
                <div className="flex items-center gap-6 justify-center lg:justify-start">
                  <div className="bg-white/10 px-4 py-2 rounded-md">
                    <span className="text-white font-medium">2,500+</span>
                    <span className="text-white/70 text-sm ml-2">Eventos</span>
                  </div>
                  <div className="bg-white/10 px-4 py-2 rounded-md">
                    <span className="text-white font-medium">15,000+</span>
                    <span className="text-white/70 text-sm ml-2">Convites</span>
                  </div>
                  <div className="bg-white/10 px-4 py-2 rounded-md">
                    <span className="text-white font-medium">98%</span>
                    <span className="text-white/70 text-sm ml-2">Satisfação</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Hero image */}
            <div className="lg:w-6/12 px-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 shadow-xl">
                <AspectRatio ratio={16/9} className="overflow-hidden rounded-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=1600" 
                    alt="Dashboard de gerenciamento de eventos" 
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </AspectRatio>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section with improved visual design */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Crie e gerencie seus eventos com facilidade
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Nossa plataforma intuitiva torna simples o gerenciamento completo de eventos, do planejamento ao acompanhamento de confirmações.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center text-center group hover:border-primary-lighter transition-colors">
              <div className="bg-primary-lighter/10 p-6 rounded-full mb-6 group-hover:bg-primary-lighter/20 transition-colors">
                <Calendar className="h-10 w-10 text-primary-lighter" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Organize eventos</h3>
              <p className="text-gray-600">
                Crie eventos, gerencie datas e locais em uma interface simples e intuitiva.
              </p>
              <ul className="mt-4 space-y-2 text-left">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary-lighter mr-2" aria-hidden="true" />
                  <span className="text-sm text-gray-600">Agendamento simples</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary-lighter mr-2" aria-hidden="true" />
                  <span className="text-sm text-gray-600">Gestão de locais</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary-lighter mr-2" aria-hidden="true" />
                  <span className="text-sm text-gray-600">Personalização completa</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center text-center group hover:border-primary-lighter transition-colors">
              <div className="bg-primary-lighter/10 p-6 rounded-full mb-6 group-hover:bg-primary-lighter/20 transition-colors">
                <Ticket className="h-10 w-10 text-primary-lighter" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Envie convites</h3>
              <p className="text-gray-600">
                Importe sua lista de convidados e compartilhe links de confirmação de presença.
              </p>
              <ul className="mt-4 space-y-2 text-left">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary-lighter mr-2" aria-hidden="true" />
                  <span className="text-sm text-gray-600">Importação de listas</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary-lighter mr-2" aria-hidden="true" />
                  <span className="text-sm text-gray-600">Convites personalizados</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary-lighter mr-2" aria-hidden="true" />
                  <span className="text-sm text-gray-600">Links individuais seguros</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center text-center group hover:border-primary-lighter transition-colors">
              <div className="bg-primary-lighter/10 p-6 rounded-full mb-6 group-hover:bg-primary-lighter/20 transition-colors">
                <Users className="h-10 w-10 text-primary-lighter" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Acompanhe respostas</h3>
              <p className="text-gray-600">
                Visualize estatísticas e acompanhe quem confirmou presença em tempo real.
              </p>
              <ul className="mt-4 space-y-2 text-left">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary-lighter mr-2" aria-hidden="true" />
                  <span className="text-sm text-gray-600">Estatísticas em tempo real</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary-lighter mr-2" aria-hidden="true" />
                  <span className="text-sm text-gray-600">Relatórios detalhados</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary-lighter mr-2" aria-hidden="true" />
                  <span className="text-sm text-gray-600">Exportação de dados</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section - New */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            O que nossos clientes dizem
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "GestorFest tornou a organização do meu casamento muito mais simples. O sistema de convites e acompanhamento de confirmações economizou horas do meu tempo."
              </p>
              <div className="flex items-center">
                <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center text-gray-700 font-semibold mr-3">
                  AR
                </div>
                <div>
                  <p className="font-semibold">Ana Rodrigues</p>
                  <p className="text-sm text-gray-500">Casamento, SP</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Como organizador de eventos corporativos, a plataforma foi essencial para gerenciar múltiplos eventos simultaneamente. O suporte é excelente."
              </p>
              <div className="flex items-center">
                <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center text-gray-700 font-semibold mr-3">
                  MS
                </div>
                <div>
                  <p className="font-semibold">Marcos Silva</p>
                  <p className="text-sm text-gray-500">Eventos Corporativos, RJ</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "A facilidade de importar convidados e acompanhar confirmações em tempo real foi um diferencial para nossa festa de formatura."
              </p>
              <div className="flex items-center">
                <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center text-gray-700 font-semibold mr-3">
                  JC
                </div>
                <div>
                  <p className="font-semibold">Julia Costa</p>
                  <p className="text-sm text-gray-500">Formatura, MG</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section with improved design */}
      <section className="py-16 md:py-24 bg-primary-lighter/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto para simplificar sua gestão de eventos?
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Crie sua conta gratuitamente e comece a organizar seus eventos hoje mesmo. Sem custos para começar.
            </p>
            
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <ButtonPrimary size="lg" asChild className="group transition-all duration-300 transform hover:scale-105">
                  <Link to="/cadastro">
                    Criar minha conta grátis
                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                  </Link>
                </ButtonPrimary>
                <ButtonSecondary size="lg" asChild>
                  <Link to="/login">Já tenho uma conta</Link>
                </ButtonSecondary>
              </div>
            )}
            
            <div className="mt-10 pt-8 border-t border-gray-200 flex justify-center">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg className="h-5 w-5 text-primary-lighter" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Seguro e confiável</span>
                <span className="mx-2">•</span>
                <svg className="h-5 w-5 text-primary-lighter" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                <span>Sempre atualizado</span>
                <span className="mx-2">•</span>
                <svg className="h-5 w-5 text-primary-lighter" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Suporte rápido</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
