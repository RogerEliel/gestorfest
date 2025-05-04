
import { corsHeaders } from "./utils.ts";
import { ImportError } from "./excel-parser.ts";

/**
 * Inserts guests data into the database and logs the import operation
 */
export async function insertGuestData(
  supabase: any,
  eventoId: string,
  usuario_id: string,
  toInsert: Array<{
    nome_convidado: string;
    telefone: string;
    mensagem_personalizada: string | null;
    evento_id: string;
    status: string;
  }>, 
  failures: ImportError[]
) {
  // If nothing to insert, return early with failures
  if (toInsert.length === 0) {
    // Log the import operation with zero inserts
    await supabase
      .from("auditoria_importacoes")
      .insert({
        evento_id: eventoId,
        usuario_id: usuario_id,
        total_registros: failures.length,
        registros_importados: 0,
        registros_falha: failures.length,
        detalhes_falhas: failures.length > 0 ? failures : null
      });
      
    return {
      success: true,
      response: new Response(
        JSON.stringify({ 
          inserted_count: 0,
          failures
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      ),
      insertedCount: 0
    };
  }

  console.log("Ready to insert:", toInsert.length, "records");
  
  // Set the evento_id for all records
  const recordsToInsert = toInsert.map(record => ({
    ...record,
    evento_id: eventoId
  }));

  try {
    // Begin transaction to insert the data
    const { data: insertData, error: insertError } = await supabase
      .from("convites")
      .insert(recordsToInsert)
      .select();

    if (insertError) {
      console.error("Error inserting invitations:", insertError);
      return {
        success: false,
        response: new Response(
          JSON.stringify({ error: "Erro ao importar convidados", details: insertError.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        ),
        insertedCount: 0
      };
    }

    const insertedCount = insertData ? insertData.length : 0;
    console.log("Successfully inserted:", insertedCount, "records");

    // Log the import in the audit table
    await supabase
      .from("auditoria_importacoes")
      .insert({
        evento_id: eventoId,
        usuario_id: usuario_id,
        total_registros: toInsert.length + failures.length,
        registros_importados: insertedCount,
        registros_falha: failures.length,
        detalhes_falhas: failures.length > 0 ? failures : null
      });

    return {
      success: true,
      response: new Response(
        JSON.stringify({ 
          inserted_count: insertedCount,
          failures 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      ),
      insertedCount
    };
  } catch (error) {
    console.error("Database operation error:", error);
    return {
      success: false,
      response: new Response(
        JSON.stringify({ error: "Erro ao processar operação no banco de dados" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      ),
      insertedCount: 0
    };
  }
}
