
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import ProtectedRoute from "@/components/ProtectedRoute";
import GerenciarConvidados from "@/pages/GerenciarConvidados";
import ImportarConvidados from "@/pages/ImportarConvidados";

// Importação do ConvidadosPage
import ConvidadosPage from "@/pages/ConvidadosPage";

const routes = [
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
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
        <ImportarConvidados />
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
];

const router = createBrowserRouter(routes);

export default router;
