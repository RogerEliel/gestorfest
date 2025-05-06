
import { Routes, Route } from "react-router-dom";
import App from "./App";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import ProtectedRoute from "@/components/ProtectedRoute";
import GerenciarConvidados from "@/pages/GerenciarConvidados";
import ImportarConvidados from "@/pages/ImportarConvidados";
import Layout from "@/components/Layout";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={
      <Layout>
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Layout>
    } />
    <Route path="/eventos/:id/convidados/importar" element={
      <Layout>
        <ProtectedRoute>
          <ImportarConvidados />
        </ProtectedRoute>
      </Layout>
    } />
    <Route path="/eventos/:id/convidados" element={
      <Layout>
        <ProtectedRoute>
          <GerenciarConvidados />
        </ProtectedRoute>
      </Layout>
    } />
  </Routes>
);

export default AppRoutes;
