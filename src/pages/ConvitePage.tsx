
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import RSVPForm from "@/components/RSVPForm";
import { supabase } from "@/integrations/supabase/client";

interface EventData {
  id: string;
  nome: string;
  data_evento: string;
  local: string;
}

interface ConviteData {
  id: string;
  nome_convidado: string;
  status: "pendente" | "confirmado" | "recusado" | "conversar";
}

const ConvitePage = () => {
  const { slug, id: conviteId } = useParams<{ slug: string; id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [evento, setEvento] = useState<EventData | null>(null);
  const [convite, setConvite] = useState<ConviteData | null>(null);
  const [rsvpCompleted, setRsvpCompleted] = useState(false);

  useEffect(() => {
    const fetchEventoEConvite = async () => {
      if (!slug || !conviteId) {
        setError("URL inválida");
        setLoading(false);
        return;
      }

      try {
        // Este é apenas um exemplo de como obteríamos os dados
        // Na implementação real, você usaria a função Edge para obter esses dados
        const { data: conviteData, error: conviteError } = await supabase
          .from('convites')
          .select(`
            id,
            nome_convidado,
            status,
            eventos(
              id,
              nome,
              data_evento,
              local
            )
          `)
          .eq('id', conviteId)
          .eq('eventos.slug', slug)
          .single();

        if (conviteError) {
          throw new Error(conviteError.message);
        }

        if (!conviteData) {
          throw new Error("Convite não encontrado");
        }
        
        setConvite({
          id: conviteData.id,
          nome_convidado: conviteData.nome_convidado,
          status: conviteData.status
        });
        
        setEvento({
          id: conviteData.eventos.id,
          nome: conviteData.eventos.nome,
          data_evento: conviteData.eventos.data_evento,
          local: conviteData.eventos.local
        });

        // Se o convite já foi respondido, mostrar a tela de confirmação
        if (conviteData.status !== "pendente") {
          setRsvpCompleted(true);
        }
      } catch (err: any) {
        console.error("Erro ao buscar dados:", err);
        setError(err.message || "Erro ao carregar informações do convite");
      } finally {
        setLoading(false);
      }
    };

    fetchEventoEConvite();
  }, [slug, conviteId]);

  const handleRsvpSuccess = () => {
    setRsvpCompleted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Carregando convite...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erro</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{evento?.nome || "Convite"} | GestorFest</title>
        <meta name="description" content={`Convite para ${evento?.nome}`} />
      </Helmet>

      <div className="max-w-3xl mx-auto p-6 mt-10">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-primary/10 p-6 text-center border-b">
            <h1 className="text-3xl font-bold mb-2">{evento?.nome}</h1>
            {evento?.data_evento && (
              <p className="text-lg">
                {new Date(evento.data_evento).toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            )}
            <p className="mt-1">{evento?.local}</p>
          </div>

          <div className="p-6">
            {!rsvpCompleted ? (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Olá, {convite?.nome_convidado || "Convidado"}, por favor confirme sua presença
                </h2>
                {slug && conviteId && (
                  <RSVPForm 
                    eventSlug={slug} 
                    conviteId={conviteId} 
                    onSuccess={handleRsvpSuccess} 
                  />
                )}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-green-700">Presença Confirmada!</h2>
                <p className="mt-2">Obrigado por responder ao convite.</p>
                <p className="text-gray-600 mt-6">
                  Se precisar alterar sua resposta, entre em contato com o organizador do evento.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConvitePage;
