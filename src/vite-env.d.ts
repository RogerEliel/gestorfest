
/// <reference types="vite/client" />

// Define types for our API endpoints
interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  tipo: "admin" | "cliente";
  created_at: string;
}

interface Evento {
  id: string;
  usuario_id: string;
  nome: string;
  data_evento: string;
  local: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

interface Convite {
  id: string;
  evento_id: string;
  nome_convidado: string;
  telefone: string;
  mensagem_personalizada?: string;
  status: "pendente" | "confirmado" | "recusado" | "conversar";
  resposta?: string;
  enviado_em?: string;
  respondido_em?: string;
  responsavel_id?: string;
  created_at: string;
  updated_at: string;
}
