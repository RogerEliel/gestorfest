
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SignupRequest {
  email: string;
  password: string;
  nome: string;
  telefone?: string;
  tipo?: "admin" | "cliente";
}

interface LoginRequest {
  email: string;
  password: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const url = new URL(req.url);
    const path = url.pathname.split("/").pop();

    // Handle signup
    if (path === "signup" && req.method === "POST") {
      const { email, password, nome, telefone, tipo } = await req.json() as SignupRequest;

      // Create new user with metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome,
            telefone,
            tipo: tipo || "cliente"
          }
        }
      });

      if (authError) {
        return new Response(
          JSON.stringify({ error: authError.message }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      return new Response(
        JSON.stringify({ 
          message: "Usuário criado com sucesso", 
          user: authData.user 
        }),
        { status: 201, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Handle login
    if (path === "login" && req.method === "POST") {
      const { email, password } = await req.json() as LoginRequest;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      return new Response(
        JSON.stringify({ 
          message: "Login realizado com sucesso", 
          session: data.session,
          user: data.user 
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Endpoint não encontrado" }),
      { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
