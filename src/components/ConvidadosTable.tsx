
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Convidado } from "@/hooks/useConvidados";

interface ConvidadosTableProps {
  dados: Convidado[];
  loading: boolean;
}

export default function ConvidadosTable({ dados, loading }: ConvidadosTableProps) {
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

  if (dados.length === 0) {
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
            <TableHead>Nome</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Observação</TableHead>
            <TableHead>Data de Cadastro</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dados.map(convidado => (
            <TableRow key={convidado.id}>
              <TableCell className="font-medium">{convidado.nome}</TableCell>
              <TableCell>{convidado.telefone}</TableCell>
              <TableCell>{convidado.observacao || "-"}</TableCell>
              <TableCell>{formatDate(convidado.criado_em)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
