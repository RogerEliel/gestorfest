import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import ImportGuests from "@/pages/ImportGuests";
import GerenciarConvidados from "@/pages/GerenciarConvidados";

// Adicione a importação do ConvidadosPage
import ConvidadosPage from "@/pages/ConvidadosPage";

const routes = [
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/eventos/:id/convidados/importar",
    element: (
      <ProtectedRoute>
        <ImportGuests />
      </ProtectedRoute>
    ),
  },
  {
    path: "/eventos/:id/convidados",
    element: (
      <ProtectedRoute>
        <GerenciarConvidados />
      </ProtectedRoute>
    ),
  },
  // Adicione a rota para a página de convidados
  {
    path: "/eventos/:id/convidados",
    element: (
      <ProtectedRoute>
        <ConvidadosPage />
      </ProtectedRoute>
    ),
  },
];

const router = createBrowserRouter(routes);

export default router;
