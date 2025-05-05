
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEventoDetails } from "@/hooks/useEventoDetails";
import { useConvidados } from "@/hooks/useConvidados";
import ConvidadoForm from "@/components/ConvidadoForm";
import ConvidadosTable from "@/components/ConvidadosTable";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

export default function ConvidadosPage() {
  const { id: eventoId } = useParams<{ id: string }>();
  const { evento, loading: loadingEvento } = useEventoDetails(eventoId || "");
  const { lista, loading: loadingConvidados, adicionar } = useConvidados(eventoId || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddConvidado = async (nome: string, telefone: string, observacao?: string) => {
    setIsSubmitting(true);
    try {
      await adicionar(nome, telefone, observacao);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Gerenciar Convidados</h1>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>

        {loadingEvento ? (
          <p>Carregando detalhes do evento...</p>
        ) : evento && (
          <Card>
            <CardHeader>
              <CardTitle>{evento.nome}</CardTitle>
              <CardDescription>
                {new Date(evento.data_evento).toLocaleDateString()} - {evento.local}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Adicionar Novo Convidado</h2>
                <ConvidadoForm onAdd={handleAddConvidado} isSubmitting={isSubmitting} />
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Lista de Convidados</h2>
                <ConvidadosTable dados={lista} loading={loadingConvidados} />
              </div>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}
