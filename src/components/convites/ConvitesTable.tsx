
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, HelpCircle, MessageCircle, Share2 } from "lucide-react";
import { format } from "date-fns";
import RSVPButtonGroup from "@/components/RSVPButtonGroup";

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

interface ConvitesTableProps {
  convites: Convite[];
  eventoId: string;
  onStatusUpdate: (conviteId: string, newStatus: "pendente" | "confirmado" | "recusado" | "conversar") => void;
  onShareClick: (conviteId: string) => void;
  loading: boolean;
}

const ConvitesTable: React.FC<ConvitesTableProps> = ({
  convites,
  eventoId,
  onStatusUpdate,
  onShareClick,
  loading,
}) => {
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

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <p>Carregando lista de convidados...</p>
      </div>
    );
  }

  if (convites.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">Você ainda não tem convidados neste evento.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
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
          {convites.map(convite => (
            <TableRow key={convite.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusIcon(convite.status)}
                  {getStatusBadge(convite.status)}
                </div>
              </TableCell>
              <TableCell className="font-medium">{convite.nome_convidado}</TableCell>
              <TableCell>{convite.telefone}</TableCell>
              <TableCell>
                {convite.respondido_em ? formatDate(convite.respondido_em) : "Não respondido"}
              </TableCell>
              <TableCell>
                <RSVPButtonGroup 
                  conviteId={convite.id} 
                  eventoId={eventoId} 
                  status={convite.status} 
                  onStatusUpdate={newStatus => onStatusUpdate(convite.id, newStatus)} 
                />
              </TableCell>
              <TableCell className="text-right">
                <Button size="icon" variant="outline" onClick={() => onShareClick(convite.id)} title="Compartilhar">
                  <Share2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ConvitesTable;
