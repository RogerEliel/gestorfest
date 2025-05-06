
import { corsHeaders } from "./utils.ts";
import { ImportError, ConviteData } from "./excel-parser.ts";

/**
 * Inserts guests data into the database and logs the import operation
 */
export async function insertConviteLote(
  supabase: any,
  eventoId: string,
  usuario_id: string,
  conviteData: ConviteData[]
) {
  // Prepare records with evento_id
  const recordsToInsert = conviteData.map(guest => ({
    ...guest,
    evento_id: eventoId,
    status: "pendente",
    responsavel_id: usuario_id
  }));
  
  console.log(`Prepared ${recordsToInsert.length} records for insertion`);
  
  const errors: ImportError[] = [];
  let rowsInserted = 0;
  let data = null;
  
  // Insert records
  if (recordsToInsert.length > 0) {
    try {
      const { data: insertedRecords, error } = await supabase
        .from("convites")
        .insert(recordsToInsert)
        .select();
      
      if (error) {
        console.error("Error inserting records:", error);
        
        // Check for unique constraint violation
        if (error.code === '23505') {
          // Extract phone number from error message if possible
          const phoneMatch = error.message.match(/\(telefone\)=\(([^)]+)\)/);
          const phone = phoneMatch ? phoneMatch[1] : null;
          
          // Add specific error for duplicate phone
          errors.push({
            row: 0, // We don't know which row specifically
            error: phone 
              ? `Telefone ${phone} já está registrado para este evento` 
              : "Um ou mais telefones já estão cadastrados para este evento"
          });
        } else {
          // Add generic error for all rows
          recordsToInsert.forEach((_, index) => {
            errors.push({
              row: index + 1,
              error: error.message || "Erro ao inserir registro"
            });
          });
        }
      } else {
        data = insertedRecords;
        rowsInserted = insertedRecords.length;
        console.log(`Successfully inserted ${rowsInserted} records`);
        
        // Log the import operation in the audit table
        await logImportOperation(
          supabase,
          eventoId,
          usuario_id,
          recordsToInsert.length,
          rowsInserted,
          errors.length,
          errors
        );
      }
    } catch (e) {
      console.error("Exception during insert:", e);
      errors.push({
        row: 0,
        error: e instanceof Error ? e.message : "Erro desconhecido durante a inserção"
      });
    }
  }
  
  return { data, errors, rowsInserted };
}

/**
 * Logs the import operation to the audit table
 */
async function logImportOperation(
  supabase: any,
  eventoId: string,
  usuarioId: string,
  totalRegistros: number,
  registrosImportados: number,
  registrosFalha: number,
  detalhes: ImportError[]
) {
  try {
    const { error } = await supabase
      .from("auditoria_importacao") // Corrigido de "auditoria_importacoes" para "auditoria_importacao"
      .insert({
        evento_id: eventoId,
        usuario_id: usuarioId,
        total_registros: totalRegistros,
        registros_importados: registrosImportados,
        registros_falha: registrosFalha,
        detalhes_falhas: detalhes.length > 0 ? detalhes : null
      });
    
    if (error) {
      console.error("Failed to log import operation:", error);
    } else {
      console.log("Successfully logged import operation");
    }
  } catch (e) {
    console.error("Exception logging import:", e);
  }
}
