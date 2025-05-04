
// Common utility functions and constants

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
};

export interface ImportError {
  row: number;
  error: string;
}

export interface ConviteRequest {
  nome_convidado: string;
  telefone: string;
  mensagem_personalizada?: string;
}

export type StatusConvite = "pendente" | "confirmado" | "recusado" | "conversar";

export interface ConviteUpdateRequest {
  status: StatusConvite;
  resposta?: string;
  consentimentoDado?: boolean;
}

// Utility function to verify duplicate phone numbers in a request
export function verificarTelefonesDuplicados(convitesData: ConviteRequest[]) {
  const telefones = convitesData.map(c => c.telefone);
  const telefonesUnicos = [...new Set(telefones)];
  
  if (telefones.length !== telefonesUnicos.length) {
    return {
      hasDuplicados: true,
      response: new Response(
        JSON.stringify({ 
          error: 'Existem números de telefone duplicados na lista de convites',
          tipo: 'duplicidade_na_requisicao' 
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      )
    };
  }
  
  return { hasDuplicados: false };
}
