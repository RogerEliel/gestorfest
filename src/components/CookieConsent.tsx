
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookiesAccepted = localStorage.getItem("cookies-accepted");
    if (!cookiesAccepted) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookies-accepted", "true");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-700 text-sm md:text-base">
          Este site utiliza cookies para melhorar sua experiência. Ao continuar navegando, 
          você concorda com nossa{" "}
          <Link to="/politica-de-cookies" className="text-blue-600 hover:underline">
            Política de Cookies
          </Link>.
        </p>
        
        <div className="flex gap-3">
          <Button 
            variant="outline"
            size="sm" 
            asChild
          >
            <Link to="/politica-de-cookies">Configurar Cookies</Link>
          </Button>
          
          <Button 
            size="sm"
            onClick={acceptCookies}
          >
            Aceitar e Continuar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
