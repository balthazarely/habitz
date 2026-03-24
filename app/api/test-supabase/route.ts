import { supabase } from "../../../lib/supabaseClient";

export async function GET() {
  try {
    const { data, error } = await supabase.from("test").select(`
        id, 
        created_at
    `);
    if (error) throw error;
    return new Response(
      JSON.stringify({ message: "Supabase connected!", data }),
      { status: 200 },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ message: "Supabase connection failed", error: err }),
      { status: 500 },
    );
  }
}
