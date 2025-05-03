
// Event operations for eventos edge function
import { corsHeaders } from "./utils.ts";

export interface EventoRequest {
  nome: string;
  data_evento: string;
  local: string;
}

// Function to fetch events
export async function getEventos(supabase, usuario_id) {
  const { data: eventos, error } = await supabase
    .from("eventos")
    .select("*, convites(count)")
    .eq("usuario_id", usuario_id)
    .order("data_evento", { ascending: true });

  if (error) {
    return {
      error: error instanceof Error ? error.message : "Erro desconhecido",
      status: 400
    };
  }

  const eventosComTotais = eventos.map(evento => ({
    ...evento,
    total_convidados: evento.convites?.[0]?.count || 0,
    convites: undefined
  }));

  return { data: eventosComTotais };
}

// Function to create a new event
export async function createEvento(supabase, eventoData, usuario_id) {
  console.log("Received event data:", eventoData);

  if (!eventoData.nome || !eventoData.data_evento || !eventoData.local) {
    return {
      error: "Nome, data e local são campos obrigatórios",
      status: 400
    };
  }

  const dataEvento = new Date(eventoData.data_evento);
  if (isNaN(dataEvento.getTime())) {
    return {
      error: "Formato de data inválido",
      status: 400
    };
  }

  const { data: slugData, error: slugError } = await supabase.rpc(
    "generate_unique_slug",
    { event_name: eventoData.nome }
  );

  if (slugError) {
    console.error("Slug generation error:", slugError);
    return {
      error: "Erro ao gerar slug único",
      details: slugError.message,
      status: 409
    };
  }

  const { data, error } = await supabase
    .from("eventos")
    .insert([
      {
        nome: eventoData.nome,
        data_evento: eventoData.data_evento,
        local: eventoData.local,
        usuario_id: usuario_id,
        slug: slugData
      }
    ])
    .select();

  if (error) {
    console.error("Event creation error:", error);
    return {
      error: error.message,
      status: 400
    };
  }

  console.log("Event created successfully:", data);
  return { data: data[0] };
}

// Function to fetch a specific event
export async function getEventoById(supabase, eventParam, usuario_id) {
  const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(eventParam);
  let query = supabase.from("eventos").select("*");

  query = isUUID ? query.eq("id", eventParam) : query.eq("slug", eventParam);
  query = query.eq("usuario_id", usuario_id);

  const { data, error } = await query.single();

  if (error) {
    return {
      error: "Evento não encontrado ou você não tem permissão para acessá-lo",
      status: 404
    };
  }

  return { data };
}

// Function to update an event
export async function updateEvento(supabase, eventParam, eventoData, usuario_id) {
  const updatedData = { ...eventoData };

  if (eventoData.nome) {
    const { data: slugData, error: slugError } = await supabase.rpc(
      "generate_unique_slug",
      { event_name: eventoData.nome }
    );

    if (slugError) {
      return {
        error: "Erro ao gerar slug único",
        details: slugError.message,
        status: 409
      };
    }

    updatedData.slug = slugData;
  }

  const { data, error } = await supabase
    .from("eventos")
    .update(updatedData)
    .eq("id", eventParam)
    .eq("usuario_id", usuario_id)
    .select();

  if (error) {
    return {
      error: error.message,
      status: 400
    };
  }

  return { data: data[0] };
}

// Function to delete an event
export async function deleteEvento(supabase, eventParam, usuario_id) {
  const { error } = await supabase
    .from("eventos")
    .delete()
    .eq("id", eventParam)
    .eq("usuario_id", usuario_id);

  if (error) {
    return {
      error: error.message,
      status: 400
    };
  }

  return { status: 204 };
}
