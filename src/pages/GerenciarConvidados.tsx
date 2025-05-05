
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { PieChart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/Footer";
import DashboardStats from "@/components/DashboardStats";
import AddGuestModal from "@/components/convites/AddGuestModal";
import { useConvites } from "@/hooks/useConvites";
import { SingleGuestFormValues } from "@/schemas/convite";
import ConvitesStats from "@/components/convites/ConvitesStats";
import ConvitesTable from "@/components/convites/ConvitesTable";
import ShareLinkDialog from "@/components/convites/ShareLinkDialog";
import EmptyGuestState from "@/components/convites/EmptyGuestState";
import EventoHeader from "@/components/convites/EventoHeader";

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
  
  // Use our hook for managing convites
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

  const handleOpenLink = () => {
    if (selectedConviteId) {
      window.open(shareUrl, '_blank');
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto p-4 space-y-6">
        <EventoHeader 
          onAddGuestClick={() => setAddGuestModalOpen(true)} 
          eventoId={eventoId || ""}
        />

        {evento && (
          <Card>
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
                  <ConvitesStats 
                    confirmados={confirmados}
                    recusados={recusados}
                    pendentes={pendentes}
                    conversas={conversas}
                    totalConvites={totalConvites}
                  />
                  
                  {loading ? (
                    <div className="flex justify-center p-4">
                      <p>Carregando lista de convidados...</p>
                    </div>
                  ) : convites.length === 0 ? (
                    <EmptyGuestState 
                      eventoId={eventoId || ""} 
                      onAddGuestClick={() => setAddGuestModalOpen(true)}
                    />
                  ) : (
                    <ConvitesTable 
                      convites={convites}
                      eventoId={eventoId || ""}
                      onStatusUpdate={handleStatusUpdate}
                      onShareClick={getShareUrl}
                      loading={loading}
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="dashboard">
                  {eventoId && <DashboardStats eventoId={eventoId} />}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />

      <ShareLinkDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        shareUrl={shareUrl}
        onCopyLink={handleCopyLink}
        onOpenLink={handleOpenLink}
      />

      <AddGuestModal
        open={addGuestModalOpen}
        onOpenChange={setAddGuestModalOpen}
        onSubmit={handleAddGuest}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default GerenciarConvidados;
