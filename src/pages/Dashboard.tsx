
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { ButtonPrimary } from "@/components/ui/buttons";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
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

const Dashboard = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke("eventos", {
        method: "GET",
      });

      if (error) throw error;

      setEventos(data || []);
    } catch (error: any) {
      console.error("Error fetching eventos:", error);
      toast({
        title: "Erro ao carregar eventos",
        description: error.message || "Não foi possível carregar seus eventos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
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

      {loading ? (
        <div className="flex justify-center p-12">
          <p>Carregando eventos...</p>
        </div>
      ) : eventos.length === 0 ? (
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
      ) : (
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
      )}
    </div>
  );
};

export default Dashboard;
