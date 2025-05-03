import { createServer } from "npm:http";
// Fix the non-relative import by using the npm: prefix
import { createClient } from "npm:@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AuditLogBatchRequest {
  logs: Array<{
    action: string;
    details?: Record<string, any>;
    entity_id?: string;
    entity_type?: string;
    timestamp: string;
  }>;
}

// Function to log multiple audit events in one batch
async function logAuditEventBatch(supabase, user_id, logs) {
  try {
    // Transform logs into the format for database insertion
    const auditRecords = logs.map(log => ({
      user_id,
      action: log.action,
      details: log.details || {},
      entity_id: log.entity_id || null,
      entity_type: log.entity_type || null,
      created_at: log.timestamp || new Date().toISOString(),
      ip_address: "recorded-by-middleware", // This would be populated by middleware in a real app
      user_agent: "recorded-by-middleware", // This would be populated by middleware in a real app
    }));

    const { data, error } = await supabase
      .from("audit_logs")
      .insert(auditRecords);

    if (error) {
      throw error;
    }

    return { success: true, count: auditRecords.length };
  } catch (err) {
    console.error("Error logging audit events batch:", err);
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
    const reqData: AuditLogBatchRequest = await req.json();
    
    if (!reqData.logs || !Array.isArray(reqData.logs) || reqData.logs.length === 0) {
      return new Response(
        JSON.stringify({ error: "No logs provided or invalid format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    // Log the audit events in batch
    const result = await logAuditEventBatch(supabase, user.id, reqData.logs);
    
    if (result.error) {
      return new Response(
        JSON.stringify({ error: result.error }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Return success response
    return new Response(
      JSON.stringify({ success: true, count: result.count }),
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
createServer(handler).listen(3001, () => {
  console.log("HTTP server running on http://localhost:3001");
});
