
import { Routes, Route } from "react-router-dom";
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
import ProtectedRoute from "./components/ProtectedRoute";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Layout><Index /></Layout>} />
    <Route path="/termos-de-uso" element={<Layout><TermosDeUso /></Layout>} />
    <Route path="/politica-de-privacidade" element={<Layout><PoliticaDePrivacidade /></Layout>} />
    <Route path="/politica-de-cookies" element={<Layout><PoliticaDeCookies /></Layout>} />
    <Route path="/termo-de-consentimento" element={<Layout><TermoDeConsentimento /></Layout>} />
    <Route path="/cadastro" element={<Layout><Cadastro /></Layout>} />
    <Route path="/login" element={<Layout><Login /></Layout>} />
    <Route path="/redefinir-senha" element={<Layout><ResetPassword /></Layout>} />
    <Route path="/api-docs" element={<Layout><ApiDocs /></Layout>} />
    <Route path="/build-in-public" element={<Layout><BuildInPublic /></Layout>} />
    <Route path="/dashboard" element={<Layout><ProtectedRoute><Dashboard /></ProtectedRoute></Layout>} />
    <Route path="/eventos/novo" element={<Layout><ProtectedRoute><NovoEvento /></ProtectedRoute></Layout>} />
    <Route path="/eventos/:id/convidados" element={<Layout><ProtectedRoute><GerenciarConvidados /></ProtectedRoute></Layout>} />
    <Route path="/eventos/:id/convidados/importar" element={<Layout><ProtectedRoute><ImportarConvidados /></ProtectedRoute></Layout>} />
    <Route path="/convite/:slug/:id" element={<ConvitePage />} />
    <Route path="*" element={<Layout><NotFound /></Layout>} />
  </Routes>
);

export default AppRoutes;
