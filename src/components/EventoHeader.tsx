
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserPlus, UploadCloud, Users } from "lucide-react";

interface EventoHeaderProps {
  onAddGuestClick: () => void;
  eventoId: string;
}

const EventoHeader: React.FC<EventoHeaderProps> = ({ onAddGuestClick, eventoId }) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Gestão de Convidados</h1>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => window.location.href = "/dashboard"}>
          Voltar
        </Button>
        <Button variant="outline" onClick={onAddGuestClick}>
          <UserPlus className="mr-2 h-4 w-4" />
          Adicionar Convidado
        </Button>
        <Button variant="outline" asChild>
          <Link to={`/eventos/${eventoId}/convidados`}>
            <Users className="mr-2 h-4 w-4" />
            Ver Convidados
          </Link>
        </Button>
        <Button asChild>
          <Link to={`/eventos/${eventoId}/convidados/importar`}>
            <UploadCloud className="mr-2 h-4 w-4" />
            Importar CSV
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default EventoHeader;
