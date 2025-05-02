
import { useState } from 'react';
import { Check, X, MailForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RSVPButtonGroupProps {
  conviteId: string;
  eventoId: string;
  status: "pendente" | "confirmado" | "recusado" | "conversar";
  onStatusUpdate?: (newStatus: "pendente" | "confirmado" | "recusado" | "conversar") => void;
}

const RSVPButtonGroup = ({ conviteId, eventoId, status, onStatusUpdate }: RSVPButtonGroupProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<"confirmar" | "recusar" | "reenviar" | null>(null);

  const confirmarPresenca = async () => {
    if (status === "confirmado") {
      toast({
        description: "Presença já confirmada anteriormente.",
        variant: "default",
      });
      return;
    }
    
    setLoading("confirmar");
    try {
      const { data, error } = await supabase.functions.invoke(`convites/eventos/${eventoId}/convites/${conviteId}/resposta`, {
        method: "POST",
        body: {
          status: "confirmado",
        }
      });

      if (error) throw error;
      
      toast({
        title: "Sucesso!",
        description: "Presença confirmada com sucesso.",
        variant: "default",
      });
      
      if (onStatusUpdate) onStatusUpdate("confirmado");
    } catch (error: any) {
      console.error("Erro ao confirmar presença:", error);
      
      // Verifica se é um erro de conflito (status já igual)
      if (error.message && error.status === 409) {
        toast({
          title: "Atenção",
          description: "Presença já confirmada anteriormente.",
          variant: "default",
        });
        return;
      }
      
      toast({
        title: "Erro",
        description: "Não foi possível confirmar a presença. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const recusarPresenca = async () => {
    if (status === "recusado") {
      toast({
        description: "Presença já recusada anteriormente.",
        variant: "default",
      });
      return;
    }
    
    setLoading("recusar");
    try {
      const { data, error } = await supabase.functions.invoke(`convites/eventos/${eventoId}/convites/${conviteId}/resposta`, {
        method: "POST",
        body: {
          status: "recusado",
        }
      });

      if (error) throw error;
      
      toast({
        title: "Sucesso!",
        description: "Presença recusada com sucesso.",
        variant: "default",
      });
      
      if (onStatusUpdate) onStatusUpdate("recusado");
    } catch (error: any) {
      console.error("Erro ao recusar presença:", error);
      
      // Verifica se é um erro de conflito (status já igual)
      if (error.message && error.status === 409) {
        toast({
          title: "Atenção",
          description: "Presença já recusada anteriormente.",
          variant: "default",
        });
        return;
      }
      
      toast({
        title: "Erro",
        description: "Não foi possível recusar a presença. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const reenviarConvite = async () => {
    setLoading("reenviar");
    try {
      const { data, error } = await supabase.functions.invoke(`convites/eventos/${eventoId}/convites/${conviteId}/reenviar`, {
        method: "POST"
      });

      if (error) throw error;
      
      toast({
        title: "Sucesso!",
        description: "Convite reenviado com sucesso.",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Erro ao reenviar convite:", error);
      toast({
        title: "Erro",
        description: "Não foi possível reenviar o convite. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex space-x-2">
      <Button 
        onClick={confirmarPresenca} 
        disabled={loading !== null}
        variant={status === "confirmado" ? "default" : "outline"}
        className={status === "confirmado" ? "bg-green-600 hover:bg-green-700" : ""}
      >
        {loading === "confirmar" ? (
          <span className="animate-spin mr-1">⏳</span>
        ) : (
          <Check className="mr-1 h-4 w-4" />
        )}
        Confirmar
      </Button>
      
      <Button 
        onClick={recusarPresenca} 
        disabled={loading !== null}
        variant={status === "recusado" ? "default" : "outline"}
        className={status === "recusado" ? "bg-red-600 hover:bg-red-700" : ""}
      >
        {loading === "recusar" ? (
          <span className="animate-spin mr-1">⏳</span>
        ) : (
          <X className="mr-1 h-4 w-4" />
        )}
        Recusar
      </Button>
      
      <Button 
        onClick={reenviarConvite}
        disabled={loading !== null}
        variant="outline"
      >
        {loading === "reenviar" ? (
          <span className="animate-spin mr-1">⏳</span>
        ) : (
          <MailForward className="mr-1 h-4 w-4" />
        )}
        Reenviar
      </Button>
    </div>
  );
};

export default RSVPButtonGroup;
