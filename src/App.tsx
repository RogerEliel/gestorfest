
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TermosDeUso from "./pages/TermosDeUso";
import PoliticaDePrivacidade from "./pages/PoliticaDePrivacidade";
import PoliticaDeCookies from "./pages/PoliticaDeCookies";
import TermoDeConsentimento from "./pages/TermoDeConsentimento";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import NovoEvento from "./pages/NovoEvento";
import ImportarConvidados from "./pages/ImportarConvidados";
import GerenciarConvidados from "./pages/GerenciarConvidados";
import ConvitePage from "./pages/ConvitePage";
import ApiDocs from "./pages/ApiDocs";
import BuildInPublic from "./pages/BuildInPublic";
import Layout from "./components/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";
import { initSentry } from "./integrations/sentry";

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

// Criar router com a nova sintaxe do React Router v6+
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><Index /></Layout>
  },
  {
    path: "/termos-de-uso",
    element: <Layout><TermosDeUso /></Layout>
  },
  {
    path: "/politica-de-privacidade",
    element: <Layout><PoliticaDePrivacidade /></Layout>
  },
  {
    path: "/politica-de-cookies",
    element: <Layout><PoliticaDeCookies /></Layout>
  },
  {
    path: "/termo-de-consentimento",
    element: <Layout><TermoDeConsentimento /></Layout>
  },
  {
    path: "/cadastro",
    element: <Layout><Cadastro /></Layout>
  },
  {
    path: "/login",
    element: <Layout><Login /></Layout>
  },
  {
    path: "/redefinir-senha",
    element: <Layout><ResetPassword /></Layout>
  },
  {
    path: "/api-docs",
    element: <Layout><ApiDocs /></Layout>
  },
  {
    path: "/build-in-public",
    element: <Layout><BuildInPublic /></Layout>
  },
  {
    path: "/dashboard",
    element: <Layout><ProtectedRoute><Dashboard /></ProtectedRoute></Layout>
  },
  {
    path: "/eventos/novo",
    element: <Layout><ProtectedRoute><NovoEvento /></ProtectedRoute></Layout>
  },
  {
    path: "/eventos/:id/convidados",
    element: <Layout><ProtectedRoute><GerenciarConvidados /></ProtectedRoute></Layout>
  },
  {
    path: "/eventos/:id/convidados/importar",
    element: <Layout><ProtectedRoute><ImportarConvidados /></ProtectedRoute></Layout>
  },
  {
    path: "/convite/:slug/:id",
    element: <ConvitePage />
  },
  {
    path: "*",
    element: <Layout><NotFound /></Layout>
  }
]);

const App = () => (
  <AuthProvider>
    <TooltipProvider>
      <GoogleAnalytics />
      <Toaster />
      <Sonner />
      <RouterProvider router={router} />
    </TooltipProvider>
  </AuthProvider>
);

export default App;
