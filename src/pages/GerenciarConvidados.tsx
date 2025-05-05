
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { UploadCloud, CheckCircle, XCircle, HelpCircle, MessageCircle, Share2, PieChart, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/Footer";
import DashboardStats from "@/components/DashboardStats";
import RSVPButtonGroup from "@/components/RSVPButtonGroup";
import AddGuestModal from "@/components/convites/AddGuestModal";
import { useConvites } from "@/hooks/useConvites";
import { SingleGuestFormValues } from "@/schemas/convite";

interface Convite {
  id: string;
  nome_convidado: string;
  telefone: string;
  status: "pendente" | "confirmado" | "recusado" | "conversar";
  mensagem_personalizada?: string;
  resposta?: string;
  enviado_em?: string;
  respondido_em?: string;
}

interface Evento {
  id: string;
  nome: string;
  data_evento: string;
  local: string;
}

const GerenciarConvidados = () => {
  const { id: eventoId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [shareUrl, setShareUrl] = useState("");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedConviteId, setSelectedConviteId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("convites");
  const [addGuestModalOpen, setAddGuestModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use our new hook for managing convites
  const { convites, loading, fetchConvites, addConvite } = useConvites(eventoId || "");

  useEffect(() => {
    if (!eventoId) return;
    checkAuth();
    fetchEvento();
    fetchConvites();
  }, [eventoId]);

  const checkAuth = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      navigate("/login");
      return;
    }
  };

  const fetchEvento = async () => {
    if (!eventoId) return;
    try {
      const { data, error } = await supabase.functions.invoke(`eventos/${eventoId}`, {
        method: "GET"
      });
      if (error) throw error;
      setEvento(data);
    } catch (error: any) {
      console.error("Error fetching event:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os detalhes do evento.",
        variant: "destructive"
      });
    }
  };

  const getShareUrl = async (conviteId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke(`convites/${conviteId}/url`, {
        method: "GET"
      });
      if (error) throw error;
      setShareUrl(data.url);
      setSelectedConviteId(conviteId);
      setShareDialogOpen(true);
    } catch (error: any) {
      console.error("Error getting share URL:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o link de compartilhamento.",
        variant: "destructive"
      });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copiado!",
      description: "O link foi copiado para a área de transferência."
    });
  };

  const handleStatusUpdate = (conviteId: string, newStatus: "pendente" | "confirmado" | "recusado" | "conversar") => {
    const updatedConvites = convites.map(convite => 
      convite.id === conviteId ? {
        ...convite,
        status: newStatus,
        respondido_em: new Date().toISOString()
      } : convite
    );
  };

  const handleAddGuest = async (data: SingleGuestFormValues) => {
    setIsSubmitting(true);
    try {
      await addConvite(data);
      toast({
        title: "Convidado adicionado",
        description: `${data.nome_convidado} foi adicionado com sucesso.`
      });
      return Promise.resolve();
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar convidado",
        description: error.message || "Não foi possível adicionar o convidado.",
        variant: "destructive"
      });
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmado":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Confirmado</Badge>;
      case "recusado":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Recusado</Badge>;
      case "conversar":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Conversar</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Pendente</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmado":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "recusado":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "conversar":
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <HelpCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm");
    } catch (error) {
      return dateString;
    }
  };

  // Calculate statistics
  const totalConvites = convites.length;
  const confirmados = convites.filter(c => c.status === "confirmado").length;
  const recusados = convites.filter(c => c.status === "recusado").length;
  const pendentes = convites.filter(c => c.status === "pendente").length;
  const conversas = convites.filter(c => c.status === "conversar").length;
  
  return <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Gestão de Convidados</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/dashboard`)}>
              Voltar
            </Button>
            <Button variant="outline" onClick={() => setAddGuestModalOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Adicionar Convidado
            </Button>
            <Button asChild>
              <Link to={`/eventos/${eventoId}/convidados/importar`} className="Excluir esse botão">
                <UploadCloud className="mr-2 h-4 w-4" />
                Importar CSV
              </Link>
            </Button>
          </div>
        </div>

        {evento && <Card>
            <CardHeader>
              <CardTitle>{evento.nome}</CardTitle>
              <CardDescription>
                {formatDate(evento.data_evento)} - {evento.local}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                  <TabsTrigger value="convites">Lista de Convidados</TabsTrigger>
                  <TabsTrigger value="dashboard">
                    <PieChart className="h-4 w-4 mr-2" />
                    Dashboard
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="convites" className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <Card className="bg-green-50">
                      <CardHeader className="py-2">
                        <CardTitle className="text-sm font-medium">Confirmados</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2 pt-0">
                        <p className="text-2xl font-bold">{confirmados}</p>
                        <p className="text-xs text-muted-foreground">
                          {totalConvites > 0 ? Math.round(confirmados / totalConvites * 100) : 0}% do total
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-red-50">
                      <CardHeader className="py-2">
                        <CardTitle className="text-sm font-medium">Recusados</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2 pt-0">
                        <p className="text-2xl font-bold">{recusados}</p>
                        <p className="text-xs text-muted-foreground">
                          {totalConvites > 0 ? Math.round(recusados / totalConvites * 100) : 0}% do total
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-50">
                      <CardHeader className="py-2">
                        <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2 pt-0">
                        <p className="text-2xl font-bold">{pendentes}</p>
                        <p className="text-xs text-muted-foreground">
                          {totalConvites > 0 ? Math.round(pendentes / totalConvites * 100) : 0}% do total
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-blue-50">
                      <CardHeader className="py-2">
                        <CardTitle className="text-sm font-medium">Conversas</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2 pt-0">
                        <p className="text-2xl font-bold">{conversas}</p>
                        <p className="text-xs text-muted-foreground">
                          {totalConvites > 0 ? Math.round(conversas / totalConvites * 100) : 0}% do total
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {loading ? <div className="flex justify-center p-4">
                      <p>Carregando lista de convidados...</p>
                    </div> : convites.length === 0 ? <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">Você ainda não tem convidados neste evento.</p>
                      <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        <Button onClick={() => setAddGuestModalOpen(true)}>
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
                    </div> : <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Status</TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Telefone</TableHead>
                            <TableHead>Respondido</TableHead>
                            <TableHead>Ações</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {convites.map(convite => <TableRow key={convite.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(convite.status)}
                                  {getStatusBadge(convite.status)}
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">{convite.nome_convidado}</TableCell>
                              <TableCell>{convite.telefone}</TableCell>
                              <TableCell>{convite.respondido_em ? formatDate(convite.respondido_em) : "Não respondido"}</TableCell>
                              <TableCell>
                                <RSVPButtonGroup conviteId={convite.id} eventoId={eventoId || ""} status={convite.status} onStatusUpdate={newStatus => handleStatusUpdate(convite.id, newStatus)} />
                              </TableCell>
                              <TableCell className="text-right">
                                <Button size="icon" variant="outline" onClick={() => getShareUrl(convite.id)} title="Compartilhar">
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>)}
                        </TableBody>
                      </Table>
                    </div>}
                </TabsContent>
                
                <TabsContent value="dashboard">
                  {eventoId && <DashboardStats eventoId={eventoId} />}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>}
      </main>
      <Footer />

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Compartilhar convite</DialogTitle>
            <DialogDescription>
              Compartilhe este link com o convidado para que ele possa confirmar sua presença.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Input readOnly value={shareUrl} onClick={e => (e.target as HTMLInputElement).select()} />
            <Button onClick={handleCopyLink}>Copiar</Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button type="button" variant="secondary" onClick={() => {
            if (selectedConviteId) {
              window.open(shareUrl, '_blank');
            }
          }}>
              Abrir link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddGuestModal
        open={addGuestModalOpen}
        onOpenChange={setAddGuestModalOpen}
        onSubmit={handleAddGuest}
        isSubmitting={isSubmitting}
      />
    </div>;
};

export default GerenciarConvidados;
