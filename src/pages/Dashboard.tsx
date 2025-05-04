// src/pages/Dashboard.tsx
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import EventosList from "@/components/dashboard/EventosList";
import LoadingState from "@/components/dashboard/LoadingState";
import EmptyState from "@/components/dashboard/EmptyState";
import ErrorState from "@/components/dashboard/ErrorState";
import { useDashboardEventos } from "@/hooks/useDashboardEventos";

const Dashboard = () => {
  // Agora expomos o refetch como fetchEventos
  const { eventos = [], loading, error, refetch: fetchEventos } = useDashboardEventos();

  // Log de erro para debugging, se necessário
  if (error) console.error("Erro ao buscar eventos:", error);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <DashboardHeader />

      {loading && <LoadingState />}

      {!loading && error && (
        <ErrorState
          message="Não foi possível carregar seus eventos. Tente recarregar a página."
          onRetry={fetchEventos}
        />
      )}

      {!loading && !error && eventos.length === 0 && <EmptyState />}

      {!loading && !error && eventos.length > 0 && (
        <EventosList eventos={eventos} />
      )}
    </div>
  );
};

export default Dashboard;
