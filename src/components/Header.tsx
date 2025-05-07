
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ButtonPrimary } from "@/components/ui/buttons";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { LogOut, User as UserIcon, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { LinkHighlight } from "./ui/link-highlight";

const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
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

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  
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

  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center" aria-label="GestorFest Home">
          <span className="text-2xl font-bold bg-gradient-primary text-transparent bg-clip-text">
            GestorFest
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <LinkHighlight href="/" active={isActive('/')}>Início</LinkHighlight>
          <LinkHighlight href="/build-in-public" active={isActive('/build-in-public')}>Build in Public</LinkHighlight>
          <LinkHighlight href="/api-docs" active={isActive('/api-docs')}>API Docs</LinkHighlight>
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            className="p-1"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
        
        {/* Auth Actions */}
        <div className="hidden md:flex gap-4 items-center">
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4">
          <nav className="flex flex-col space-y-3">
            <Link to="/" className="text-gray-700 hover:text-primary-lighter py-2">Início</Link>
            <Link to="/build-in-public" className="text-gray-700 hover:text-primary-lighter py-2">Build in Public</Link>
            <Link to="/api-docs" className="text-gray-700 hover:text-primary-lighter py-2">API Docs</Link>
            
            <div className="border-t border-gray-100 my-2"></div>
            
            {user ? (
              <>
                <Link to="/eventos/novo" className="text-primary-lighter font-medium py-2">Gerar Convite</Link>
                <Link to="/dashboard" className="text-gray-700 py-2">Minha Conta</Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout} 
                  className="text-gray-700 justify-start px-0 py-2"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  <span>Sair</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/cadastro" className="text-primary-lighter font-medium py-2" onClick={trackSignupClick}>Criar conta</Link>
                <Link to="/login" className="text-gray-700 py-2">Entrar</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
