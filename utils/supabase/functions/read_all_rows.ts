import { createClient } from "../client";

const supabase = createClient();

/**
 * Fetches all rows from the 'messages' table.
 * @returns {Promise<{ data: any[] | null, error: Error | null }>} The data and error from the query.
 */
export async function readAllRows(): Promise<{ data: any[] | null; error: Error | null; }> {
  const { data: messages, error } = await supabase
    .from('messages')
    .select('*');
  
  return { data: messages, error };
}