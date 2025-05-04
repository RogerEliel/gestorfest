
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ExcelTemplateDownload from "@/components/CSVTemplateDownload";

interface ImportHeaderProps {
  eventoId: string | undefined;
  eventoNome?: string;
  eventoData?: string;
}

const ImportHeader = ({ eventoId, eventoNome, eventoData }: ImportHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold">Importar Convidados</h1>
        {eventoNome && eventoData && (
          <p className="text-gray-600">
            Evento: {eventoNome} - {new Date(eventoData).toLocaleDateString()}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => navigate(`/eventos/${eventoId}/convidados`)}>
          Voltar
        </Button>
        <ExcelTemplateDownload />
      </div>
    </div>
  );
};

export default ImportHeader;
