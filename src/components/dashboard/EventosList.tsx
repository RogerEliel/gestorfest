
import CardEvento from "@/components/CardEvento";

interface Evento {
  id: string;
  nome: string;
  data_evento: string;
  local: string;
  slug: string;
  total_convidados?: number;
  total_confirmados?: number;
}

interface EventosListProps {
  eventos: Evento[];
}

const EventosList = ({ eventos }: EventosListProps) => {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {eventos.map((evento) => (
        <CardEvento
          key={evento.id}
          id={evento.id}
          nome={evento.nome}
          data={evento.data_evento}
          local={evento.local}
          totalConvidados={evento.total_convidados}
          totalConfirmados={evento.total_confirmados}
          slug={evento.slug}
        />
      ))}
    </div>
  );
};

export default EventosList;
