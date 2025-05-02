
import { Link, useNavigate } from "react-router-dom";
import { ButtonPrimary } from "@/components/ui/buttons";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { LogOut, User as UserIcon, FileText, BarChart } from "lucide-react";
import { Button } from "./ui/button";

const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    
    getUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // Track signup button click
  const trackSignupClick = () => {
    if (window.trackEvent) {
      window.trackEvent('conversion', 'signup_click', 'header_button');
    }
  };
  
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold bg-gradient-primary text-transparent bg-clip-text">
            GestorFest
          </span>
        </Link>
        
        <div className="hidden md:flex space-x-4">
          <Link to="/build-in-public" className="text-gray-600 hover:text-primary-lighter">
            Build in Public
          </Link>
          <Link to="/api-docs" className="text-gray-600 hover:text-primary-lighter">
            API Docs
          </Link>
        </div>
        
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <ButtonPrimary asChild>
                <Link to="/eventos/novo">Gerar Convite</Link>
              </ButtonPrimary>
              
              <div className="flex items-center gap-2">
                <Link to="/dashboard" className="flex items-center gap-1 text-gray-700 hover:text-primary-lighter">
                  <UserIcon className="h-5 w-5" />
                  <span className="hidden md:inline">Minha Conta</span>
                </Link>
                
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-700">
                  <LogOut className="h-5 w-5" />
                  <span className="hidden md:inline ml-1">Sair</span>
                </Button>
              </div>
            </>
          ) : (
            <>
              <ButtonPrimary asChild onClick={trackSignupClick}>
                <Link to="/cadastro">Criar conta</Link>
              </ButtonPrimary>
              <Button variant="ghost" asChild>
                <Link to="/login">Entrar</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
