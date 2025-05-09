
import { supabase } from "@/integrations/supabase/client";
import { SingleGuestFormValues } from "@/schemas/convite";
import { ImportResponse } from "@/types/import.types";

/**
 * Send validated contacts data to the import API
 */
export async function importContacts(
  eventoId: string | undefined,
  payload: any[]
): Promise<{ data: ImportResponse | null; error: Error | null }> {
  try {
    if (!eventoId) {
      throw new Error("ID do evento não encontrado.");
    }
    
    // Get auth token to ensure it's included in the request
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    
    if (!token) {
      throw new Error("Usuário não autenticado. Faça login novamente.");
    }
    
    const requestPayload = { convites: payload };
    
    console.log("Sending payload to edge function:", requestPayload);
    
    // Call the API with JSON payload
    const { data, error } = await supabase.functions.invoke(`convites/importar/${eventoId}`, {
      method: "POST",
      body: requestPayload,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    
    if (error) {
      console.error("Import error:", error);
      throw new Error(error.message || "Erro na chamada à API de importação");
    }
    
    if (!data) {
      throw new Error("Resposta vazia do servidor");
    }
    
    return { data: data as ImportResponse, error: null };
  } catch (error: any) {
    console.error("Error importing contacts:", error);
    return { 
      data: null, 
      error: new Error(error.message || "Erro desconhecido na importação")
    };
  }
}

/**
 * Add a single guest to an event
 */
export async function addSingleGuest(
  eventoId: string | undefined,
  guestData: SingleGuestFormValues
): Promise<{ data: any; error: Error | null }> {
  try {
    if (!eventoId) {
      throw new Error("ID do evento não encontrado.");
    }
    
    // Get auth token to ensure it's included in the request
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    
    if (!token) {
      throw new Error("Usuário não autenticado. Faça login novamente.");
    }
    
    console.log("Sending single guest to edge function:", guestData);
    
    // Call the API with JSON payload
    const { data, error } = await supabase.functions.invoke(`convites/eventos/${eventoId}/criar-lote`, {
      method: "POST",
      body: { convites: [guestData] },
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    
    if (error) {
      console.error("Add guest error:", error);
      throw new Error(error.message || "Erro na chamada à API de adição de convidado");
    }
    
    if (!data) {
      throw new Error("Resposta vazia do servidor");
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error("Error adding guest:", error);
    return { 
      data: null, 
      error: new Error(error.message || "Erro desconhecido ao adicionar convidado")
    };
  }
}
