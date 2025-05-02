
import { serve } from "https://deno.land/std@0.200.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EventoRequest {
  nome: string;
  data_evento: string;
  local: string;
}

// Função para lidar com requisições OPTIONS (CORS preflight)
function handleOptions() {
  return new Response(null, { headers: corsHeaders });
}

// Função para autenticar usuário
async function authenticateUser(supabase, authHeader) {
  if (!authHeader) {
    return { error: "Autenticação necessária", status: 401 };
  }

  const jwt = authHeader.replace("Bearer ", "");
  const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);

  if (authError || !user) {
    return { error: "Usuário não autenticado", status: 401 };
  }

  return { user };
}

// Função para garantir que o usuário tenha um perfil
async function ensureUserProfile(supabase, user) {
  // Buscar o perfil do usuário
  let { data: profileData } = await supabase
    .from("profiles")
    .select("usuario_id")
    .eq("id", user.id)
    .single();

  // Se não houver perfil, vamos verificar se o usuário existe
  if (!profileData?.usuario_id) {
    console.log("Profile not found, attempting to create one");
    
    // Verificar se existe um usuário com este email
    const { data: usuarioExistente } = await supabase
      .from("usuarios")
      .select("id")
      .eq("email", user.email)
      .single();
      
    let usuario_id;
    
    if (usuarioExistente) {
      console.log("Found existing usuario with this email");
      usuario_id = usuarioExistente.id;
    } else {
      // Criar um novo usuário
      console.log("Creating new usuario");
      const { data: newUsuario, error: usuarioError } = await supabase
        .from("usuarios")
        .insert([{
          nome: user.user_metadata.nome || user.email,
          email: user.email,
          tipo: 'cliente'
        }])
        .select();
        
      if (usuarioError || !newUsuario?.length) {
        console.error("Error creating usuario:", usuarioError);
        return { 
          error: "Erro ao criar usuário", 
          details: usuarioError?.message, 
          status: 500 
        };
      }
      
      usuario_id = newUsuario[0].id;
    }
    
    // Criar ou atualizar o perfil
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert([{
        id: user.id,
        usuario_id: usuario_id
      }]);
      
    if (profileError) {
      console.error("Error creating profile:", profileError);
      return { 
        error: "Erro ao criar perfil", 
        details: profileError.message, 
        status: 500 
      };
    }
    
    // Definir o perfil para uso posterior
    profileData = { usuario_id };
  }

  console.log("Using usuario_id:", profileData.usuario_id);
  return { profile: profileData };
}

// Função para buscar eventos
async function getEventos(supabase, usuario_id) {
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

// Função para criar novo evento
async function createEvento(supabase, eventoData, usuario_id) {
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

// Função para buscar um evento específico
async function getEventoById(supabase, eventParam, usuario_id) {
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

// Função para atualizar um evento
async function updateEvento(supabase, eventParam, eventoData, usuario_id) {
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

// Função para excluir um evento
async function deleteEvento(supabase, eventParam, usuario_id) {
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

// Função principal que processa as requisições
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return handleOptions();
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Autenticar usuário
    const authHeader = req.headers.get("Authorization");
    const authResult = await authenticateUser(supabase, authHeader);
    
    if (authResult.error) {
      return new Response(
        JSON.stringify({ error: authResult.error }),
        { status: authResult.status, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    const user = authResult.user;

    // Obter informações de rota
    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/").filter(segment => segment);

    const isRootPath = pathSegments.length === 1;
    const hasEventParam = pathSegments.length > 1;
    const eventParam = hasEventParam ? pathSegments[1] : null;

    // Garantir perfil de usuário
    const profileResult = await ensureUserProfile(supabase, user);
    
    if (profileResult.error) {
      return new Response(
        JSON.stringify({ error: profileResult.error, details: profileResult.details }),
        { status: profileResult.status, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    const usuario_id = profileResult.profile.usuario_id;

    // Rotear a requisição para a função apropriada
    let result;

    if (isRootPath && req.method === "GET") {
      result = await getEventos(supabase, usuario_id);
    } else if (isRootPath && req.method === "POST") {
      const eventoData = await req.json() as EventoRequest;
      result = await createEvento(supabase, eventoData, usuario_id);
    } else if (hasEventParam && req.method === "GET") {
      result = await getEventoById(supabase, eventParam, usuario_id);
    } else if (hasEventParam && req.method === "PUT") {
      const eventoData = await req.json() as Partial<EventoRequest>;
      result = await updateEvento(supabase, eventParam, eventoData, usuario_id);
    } else if (hasEventParam && req.method === "DELETE") {
      result = await deleteEvento(supabase, eventParam, usuario_id);
    } else {
      result = { error: "Endpoint não encontrado", status: 404 };
    }

    // Preparar resposta
    if (result.error) {
      return new Response(
        JSON.stringify({ error: result.error, details: result.details }),
        { status: result.status || 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (result.status === 204) {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    return new Response(
      JSON.stringify(result.data),
      { status: result.status || 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (err) {
    console.error("Function error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Erro desconhecido" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
