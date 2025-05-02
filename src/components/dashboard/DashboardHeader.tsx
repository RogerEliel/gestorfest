
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { ButtonPrimary } from "@/components/ui/buttons";

const DashboardHeader = () => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
        Meus Eventos
      </h1>
      <ButtonPrimary asChild>
        <Link to="/eventos/novo">
          <PlusCircle className="mr-2 h-5 w-5" /> Novo Evento
        </Link>
      </ButtonPrimary>
    </div>
  );
};

export default DashboardHeader;
