
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/Footer";

interface Evento {
  id: string;
  nome: string;
  data_evento: string;
  local: string;
  slug: string;
}

const Dashboard = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        navigate("/login");
        return;
      }
      
      setUser(sessionData.session.user);
      fetchEventos();
    };

    checkAuth();
  }, [navigate]);

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

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Meus Eventos</h1>
          <Button asChild>
            <Link to="/eventos/novo">
              <PlusCircle className="mr-2 h-4 w-4" /> Novo Evento
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Eventos</CardTitle>
            <CardDescription>
              Gerencie seus eventos e envie convites para seus convidados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-4">
                <p>Carregando eventos...</p>
              </div>
            ) : eventos.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Você ainda não tem eventos cadastrados.</p>
                <Button asChild>
                  <Link to="/eventos/novo">Criar meu primeiro evento</Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventos.map((evento) => (
                    <TableRow key={evento.id}>
                      <TableCell className="font-medium">{evento.nome}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                          {formatDate(evento.data_evento)}
                        </div>
                      </TableCell>
                      <TableCell>{evento.local}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/eventos/${evento.id}/convidados`}>
                              Convidados
                            </Link>
                          </Button>
                          <Button size="sm" asChild>
                            <Link to={`/eventos/${evento.id}`}>
                              Gerenciar
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Total de eventos: {eventos.length}
            </p>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
