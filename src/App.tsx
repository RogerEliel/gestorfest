
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppRoutes from "./routes";
import { AuthProvider } from "./contexts/AuthContext";
import { useEffect } from "react";
import { initSentry } from "./integrations/sentry";
import { Helmet } from "react-helmet";

// Initialize Sentry
initSentry();

// Google Analytics Script
const GoogleAnalytics = () => {
  useEffect(() => {
    // Skip if no measurement ID or if in development
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID || import.meta.env.MODE === 'development') {
      return;
    }

    // Add Google Analytics script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID);

    // Cleanup
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
};

const App = () => (
  <AuthProvider>
    <TooltipProvider>
      <Helmet>
        <title>GestorFest - Gerencie Eventos com Simplicidade</title>
        <meta name="description" content="Plataforma completa para gerenciamento de eventos e convites. Organize, envie e acompanhe tudo em um só lugar." />
        <meta property="og:title" content="GestorFest - Gerencie Eventos com Simplicidade" />
        <meta property="og:description" content="Plataforma completa para gerenciamento de eventos e convites. Organize, envie e acompanhe tudo em um só lugar." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="GestorFest - Gerencie Eventos com Simplicidade" />
        <meta name="twitter:description" content="Plataforma completa para gerenciamento de eventos e convites. Organize, envie e acompanhe tudo em um só lugar." />
        <meta name="twitter:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
      </Helmet>
      <GoogleAnalytics />
      <Toaster />
      <Sonner />
      <AppRoutes />
    </TooltipProvider>
  </AuthProvider>
);

export default App;
