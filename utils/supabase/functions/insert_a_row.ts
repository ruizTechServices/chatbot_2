//utils/supabase/functions/insert_a_row.ts
import { createClient } from "../client"; // Adjust path as needed

const supabase = createClient();

/**
 * Inserts a new row into the 'messages' table.
 * @param newRow An object containing the fields for the new row.
 */
export const insertRow = async (newRow: any) => {
  const { data, error } = await supabase
    .from("messages") // Make sure this matches your table name
    .insert([newRow])
    .select(); // Return inserted row(s)

  return { data, error };
};