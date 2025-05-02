
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import EventosList from "@/components/dashboard/EventosList";
import LoadingState from "@/components/dashboard/LoadingState";
import EmptyState from "@/components/dashboard/EmptyState";
import { useDashboardEventos } from "@/hooks/useDashboardEventos";

const Dashboard = () => {
  const { eventos, loading } = useDashboardEventos();

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <DashboardHeader />

      {loading ? (
        <LoadingState />
      ) : eventos.length === 0 ? (
        <EmptyState />
      ) : (
        <EventosList eventos={eventos} />
      )}
    </div>
  );
};

export default Dashboard;
