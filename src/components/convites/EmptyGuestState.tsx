
import React from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, UploadCloud } from "lucide-react";
import { Link } from "react-router-dom";

interface EmptyGuestStateProps {
  eventoId: string;
  onAddGuestClick: () => void;
}

const EmptyGuestState: React.FC<EmptyGuestStateProps> = ({ eventoId, onAddGuestClick }) => {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground mb-4">Você ainda não tem convidados neste evento.</p>
      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <Button onClick={onAddGuestClick}>
          <UserPlus className="mr-2 h-4 w-4" />
          Adicionar Convidado
        </Button>
        <Button asChild>
          <Link to={`/eventos/${eventoId}/convidados/importar`}>
            <UploadCloud className="mr-2 h-4 w-4" />
            Importar Convidados
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default EmptyGuestState;
