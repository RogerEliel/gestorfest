
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Copy, Check, X, Clock, Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export type ConviteStatus = "confirmado" | "recusado" | "pendente";

export interface Convidado {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  status: ConviteStatus;
  data_resposta?: string;
}

interface TableConvitesProps {
  convidados: Convidado[];
  onReenviarConvite?: (id: string) => Promise<void>;
  conviteBaseUrl?: string;
}

const TableConvites = ({ convidados, onReenviarConvite, conviteBaseUrl }: TableConvitesProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sending, setSending] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredConvidados = convidados.filter(
    (convidado) =>
      convidado.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      convidado.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (convidado.telefone &&
        convidado.telefone.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCopyLink = (id: string) => {
    if (!conviteBaseUrl) return;
    
    const link = `${conviteBaseUrl}/${id}`;
    navigator.clipboard.writeText(link);
    
    toast({
      title: "Link copiado!",
      description: "O link do convite foi copiado para a área de transferência."
    });
  };
  
  const handleReenviarConvite = async (id: string) => {
    if (!onReenviarConvite) return;
    
    try {
      setSending(id);
      await onReenviarConvite(id);
      
      toast({
        title: "Convite reenviado!",
        description: "O convite foi reenviado com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro ao reenviar convite",
        description: "Não foi possível reenviar o convite. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setSending(null);
    }
  };
  
  const getStatusIcon = (status: ConviteStatus) => {
    switch (status) {
      case "confirmado":
        return <Check className="h-5 w-5 text-green-500" />;
      case "recusado":
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-amber-500" />;
    }
  };
  
  const getStatusText = (status: ConviteStatus) => {
    switch (status) {
      case "confirmado":
        return "Confirmado";
      case "recusado":
        return "Recusado";
      default:
        return "Pendente";
    }
  };
  
  const getStatusClass = (status: ConviteStatus) => {
    switch (status) {
      case "confirmado":
        return "text-green-700 bg-green-100";
      case "recusado":
        return "text-red-700 bg-red-100";
      default:
        return "text-amber-700 bg-amber-100";
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por nome, email ou telefone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Nome</TableHead>
              <TableHead>Email/Telefone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredConvidados.length > 0 ? (
              filteredConvidados.map((convidado) => (
                <TableRow key={convidado.id}>
                  <TableCell className="font-medium">{convidado.nome}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{convidado.email}</span>
                      {convidado.telefone && (
                        <span className="text-gray-500 text-sm">{convidado.telefone}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClass(
                          convidado.status
                        )}`}
                      >
                        {getStatusIcon(convidado.status)}
                        <span className="ml-1">{getStatusText(convidado.status)}</span>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {conviteBaseUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyLink(convidado.id)}
                          title="Copiar link do convite"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {onReenviarConvite && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReenviarConvite(convidado.id)}
                          disabled={sending === convidado.id}
                          title="Reenviar convite"
                        >
                          <Mail className="h-4 w-4" />
                          <span className="sr-only">Reenviar convite</span>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  {searchTerm ? "Nenhum convidado encontrado com essa busca." : "Nenhum convidado cadastrado."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="text-sm text-gray-500 text-right">
        Total: {filteredConvidados.length} convidado(s)
      </div>
    </div>
  );
};

export default TableConvites;
