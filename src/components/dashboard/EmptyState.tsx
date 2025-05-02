
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { ButtonPrimary } from "@/components/ui/buttons";

const EmptyState = () => {
  return (
    <div className="text-center py-16 px-4 bg-gray-50 rounded-lg border border-gray-200">
      <h2 className="text-2xl font-semibold mb-2">Nenhum evento cadastrado</h2>
      <p className="text-muted-foreground mb-8">
        Crie seu primeiro evento para começar a gerenciar seus convidados.
      </p>
      <ButtonPrimary asChild>
        <Link to="/eventos/novo">
          <PlusCircle className="mr-2 h-5 w-5" /> Criar meu primeiro evento
        </Link>
      </ButtonPrimary>
    </div>
  );
};

export default EmptyState;
