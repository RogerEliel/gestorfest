
// Utility functions for eventos edge function

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
};

// Function to handle OPTIONS requests (CORS preflight)
export function handleOptions() {
  return new Response(null, { headers: corsHeaders });
}

// Function to authenticate user
export async function authenticateUser(supabase, authHeader) {
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

// Function to ensure user has a profile
export async function ensureUserProfile(supabase, user) {
  // Fetch user profile
  let { data: profileData } = await supabase
    .from("profiles")
    .select("usuario_id")
    .eq("id", user.id)
    .single();

  // If no profile exists, check if the user exists
  if (!profileData?.usuario_id) {
    console.log("Profile not found, attempting to create one");

    // Check if a user with this email exists
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
      // Create a new user
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

    // Create or update the profile
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

    // Set the profile for later use
    profileData = { usuario_id };
  }

  console.log("Using usuario_id:", profileData.usuario_id);
  return { profile: profileData };
}
