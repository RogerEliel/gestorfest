
import { createServer } from "http";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AuditLogRequest {
  action: string;
  details?: Record<string, any>;
  entity_id?: string;
  entity_type?: string;
}

// Function to log an audit event
async function logAuditEvent(supabase, user_id, req_data) {
  try {
    const { action, details, entity_id, entity_type } = req_data;

    const { data, error } = await supabase.from("audit_logs").insert([
      {
        user_id,
        action,
        details,
        entity_id,
        entity_type,
        created_at: new Date().toISOString(),
        ip_address: "recorded-by-middleware", // This would be populated by middleware in a real app
        user_agent: "recorded-by-middleware", // This would be populated by middleware in a real app
      },
    ]);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (err) {
    console.error("Error logging audit event:", err);
    return { error: err.message };
  }
}

// Main handler function
const handler = async (req) => {
  try {
    // Connect to Supabase
    const supabase = createClient(
      process.env.SUPABASE_URL ?? "",
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
    );

    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Get the authorization header
    const authHeader = req.headers["authorization"];
    
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Extract the JWT token
    const jwt = authHeader.replace("Bearer ", "");
    
    // Verify the user with the token
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Parse the request data
    const reqData: AuditLogRequest = await req.json();
    
    // Log the audit event
    const result = await logAuditEvent(supabase, user.id, reqData);
    
    if (result.error) {
      return new Response(
        JSON.stringify({ error: result.error }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Return success response
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (err) {
    console.error("Function error:", err);
    
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

// Start the server
createServer(handler).listen(3000, () => {
  console.log("HTTP server running on http://localhost:3000");
});
