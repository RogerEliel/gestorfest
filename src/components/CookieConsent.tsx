
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CookiePreferences, { getCookiePreferences } from "./CookiePreferences";
import { Cookie } from "lucide-react";

type CookieCategories = {
  necessary: boolean;
  performance: boolean;
  functionality: boolean;
  marketing: boolean;
};

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice about cookies
    const cookiesAccepted = localStorage.getItem("cookies-accepted");
    const cookiePreferences = localStorage.getItem("cookie-preferences");
    
    if (!cookiesAccepted && !cookiePreferences) {
      setShowBanner(true);
    }
  }, []);

  const acceptAllCookies = () => {
    const preferences: CookieCategories = {
      necessary: true,
      performance: true,
      functionality: true,
      marketing: true
    };
    
    localStorage.setItem("cookies-accepted", "true");
    localStorage.setItem("cookie-preferences", JSON.stringify(preferences));
    setShowBanner(false);
  };
  
  const rejectNonEssentialCookies = () => {
    const preferences: CookieCategories = {
      necessary: true,
      performance: false,
      functionality: false,
      marketing: false
    };
    
    localStorage.setItem("cookies-accepted", "false");
    localStorage.setItem("cookie-preferences", JSON.stringify(preferences));
    setShowBanner(false);
  };

  const saveCookiePreferences = (preferences: CookieCategories) => {
    localStorage.setItem("cookies-accepted", "custom");
    localStorage.setItem("cookie-preferences", JSON.stringify(preferences));
    setShowBanner(false);
  };

  const openPreferences = () => {
    setShowPreferences(true);
  };

  if (!showBanner) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-start gap-3">
            <Cookie className="h-5 w-5 mt-1 text-blue-600" />
            <p className="text-gray-700 text-sm md:text-base">
              Este site utiliza cookies para melhorar sua experiência. Você pode escolher quais tipos de cookies deseja aceitar.
              Consulte nossa{" "}
              <Link to="/politica-de-cookies" className="text-blue-600 hover:underline">
                Política de Cookies
              </Link>{" "}
              para mais informações.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center md:justify-end">
            <Button 
              variant="outline"
              size="sm" 
              onClick={rejectNonEssentialCookies}
            >
              Recusar Não Essenciais
            </Button>
            
            <Button 
              variant="outline"
              size="sm" 
              onClick={openPreferences}
            >
              Configurar Cookies
            </Button>
            
            <Button 
              size="sm"
              onClick={acceptAllCookies}
            >
              Aceitar Todos
            </Button>
          </div>
        </div>
      </div>
      
      <CookiePreferences
        open={showPreferences}
        onClose={() => setShowPreferences(false)}
        onSave={saveCookiePreferences}
      />
    </>
  );
};

export default CookieConsent;
