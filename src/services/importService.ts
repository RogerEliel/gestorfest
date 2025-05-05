
import { supabase } from "@/integrations/supabase/client";
import { ImportError, ImportResponse } from "@/types/import.types";

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
      throw error;
    }
    
    return { data: data as ImportResponse, error: null };
  } catch (error: any) {
    console.error("Error importing contacts:", error);
    return { data: null, error };
  }
}
