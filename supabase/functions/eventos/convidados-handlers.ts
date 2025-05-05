
import { corsHeaders } from "./utils.ts";
import { authenticateUser, ensureUserProfile } from "./utils.ts";

export async function adicionarConvidado(req: Request, supabase: any, eventoId: string) {
  try {
    // Autenticar usuário
    const authHeader = req.headers.get("authorization");
    const authResult = await authenticateUser(supabase, authHeader);

    if (authResult.error) {
      return new Response(
        JSON.stringify({ error: authResult.error }),
        { status: authResult.status || 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Verificar perfil do usuário
    const profileResult = await ensureUserProfile(supabase, authResult.user);
    if (profileResult.error) {
      return new Response(
        JSON.stringify({ error: profileResult.error, details: profileResult.details }),
        { status: profileResult.status || 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const usuario_id = profileResult.profile.usuario_id;

    // Verificar acesso ao evento
    const { data: evento, error: eventoError } = await supabase
      .from('eventos')
      .select('*')
      .eq('id', eventoId)
      .eq('usuario_id', usuario_id)
      .single();

    if (eventoError || !evento) {
      return new Response(
        JSON.stringify({ error: "Evento não encontrado ou sem permissão" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Processar body do request
    const body = await req.json() as {
      nome: string;
      telefone: string;
      observacao?: string;
    };

    // Validações
    if (!body.nome || !body.telefone) {
      return new Response(
        JSON.stringify({ error: "Nome e telefone são obrigatórios" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Inserir o convidado
    const { data, error } = await supabase
      .from("convidados")
      .insert([{
        evento_id: eventoId,
        nome: body.nome,
        telefone: body.telefone,
        observacao: body.observacao ?? null
      }])
      .select()
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify(data),
      { status: 201, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    console.error("Erro ao processar adição de convidado:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro interno" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
}

export async function listarConvidados(req: Request, supabase: any, eventoId: string) {
  try {
    // Autenticar usuário
    const authHeader = req.headers.get("authorization");
    const authResult = await authenticateUser(supabase, authHeader);

    if (authResult.error) {
      return new Response(
        JSON.stringify({ error: authResult.error }),
        { status: authResult.status || 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Verificar perfil do usuário
    const profileResult = await ensureUserProfile(supabase, authResult.user);
    if (profileResult.error) {
      return new Response(
        JSON.stringify({ error: profileResult.error, details: profileResult.details }),
        { status: profileResult.status || 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Listar convidados (RLS já vai filtrar pelo acesso do usuário)
    const { data, error } = await supabase
      .from("convidados")
      .select("*")
      .eq("evento_id", eventoId)
      .order("criado_em", { ascending: false });

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify(data),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    console.error("Erro ao listar convidados:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro interno" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
}
