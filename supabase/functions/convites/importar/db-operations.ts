
import { corsHeaders } from "./utils.ts";
import { ImportError } from "./excel-parser.ts";

/**
 * Inserts guests data into the database and logs the import operation
 */
export async function insertConviteLote(
  supabase: any,
  eventoId: string,
  conviteData: Array<{
    nome_convidado: string;
    telefone: string;
    mensagem_personalizada?: string | null;
  }>
) {
  // Prepare records with evento_id
  const recordsToInsert = conviteData.map(guest => ({
    ...guest,
    evento_id: eventoId,
    status: "pendente"
  }));
  
  console.log(`Prepared ${recordsToInsert.length} records for insertion`);
  
  const errors: ImportError[] = [];
  let rowsInserted = 0;
  let data = null;
  
  // Insert records
  if (recordsToInsert.length > 0) {
    const { data: insertedRecords, error } = await supabase
      .from("convites")
      .insert(recordsToInsert)
      .select();
    
    if (error) {
      console.error("Error inserting records:", error);
      
      // Add generic error for all rows
      recordsToInsert.forEach((_, index) => {
        errors.push({
          row: index + 1,
          error: error.message || "Erro ao inserir registro"
        });
      });
    } else {
      data = insertedRecords;
      rowsInserted = insertedRecords.length;
      console.log(`Successfully inserted ${rowsInserted} records`);
    }
  }
  
  return { data, errors, rowsInserted };
}
