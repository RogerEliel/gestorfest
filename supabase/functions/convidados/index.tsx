// supabase/functions/convites-importar/index.ts
import { serve } from "https://deno.land/std@0.200.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!   // use a service role key para bypass de RLS na importação
);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" } });
  }
  try {
    const url = new URL(req.url);
    const path = url.pathname.split("/").pop();        // o último segmento é o eventId
    if (!path) throw new Error("Evento não informado");
    const eventId = path;

    // parse Multipart/FormData e XLSX aqui, ou aceitar JSON de linhas já validadas
    const formData = await req.formData();
    const file = formData.get("file") as File;
    // ... lida com XLSX e converte em array de convites

    // insere no supabase
    const { data, error } = await supabase
      .from("convites")
      .insert(/* array de convites com event_id = eventId */)
      .select();

    if (error) throw error;
    return new Response(JSON.stringify({ inserted: data.length }), { status: 201 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
});
