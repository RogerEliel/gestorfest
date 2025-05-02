
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, ChevronRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ButtonPrimary, ButtonSecondary } from "@/components/ui/buttons";

interface CardEventoProps {
  id: string;
  nome: string;
  data: string;
  local: string;
  totalConvidados?: number;
  totalConfirmados?: number;
  slug?: string;
}

const CardEvento = ({
  id,
  nome,
  data,
  local,
  totalConvidados = 0,
  totalConfirmados = 0,
  slug,
}: CardEventoProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };
  
  const percentageConfirmed = totalConvidados > 0 
    ? Math.round((totalConfirmados / totalConvidados) * 100) 
    : 0;

  return (
    <Card className="overflow-hidden border-primary-lighter/20 h-full flex flex-col transition-all hover:shadow-lg">
      <div className="p-1 bg-gradient-primary" />
      
      <CardContent className="pt-6 flex-grow">
        <h3 className="text-xl font-semibold mb-4 line-clamp-1">{nome}</h3>
        
        <div className="space-y-3 text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary-lighter" />
            <span>{formatDate(data)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary-lighter" />
            <span className="line-clamp-1">{local}</span>
          </div>
          
          {totalConvidados > 0 && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary-lighter" />
              <span>
                {totalConfirmados} / {totalConvidados} confirmados ({percentageConfirmed}%)
              </span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between gap-4 border-t p-4 bg-gray-50">
        <ButtonSecondary size="sm" asChild>
          <Link to={`/eventos/${id}/convidados`}>
            Convidados
          </Link>
        </ButtonSecondary>
        
        <ButtonPrimary size="sm" className="ml-auto" asChild>
          <Link to={`/eventos/${id}`}>
            Gerenciar <ChevronRight className="h-4 w-4" />
          </Link>
        </ButtonPrimary>
      </CardFooter>
    </Card>
  );
};

export default CardEvento;
