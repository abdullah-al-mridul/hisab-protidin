import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase credentials. Please check your .env file.");
}

// Prevent crash if keys are missing by using a dummy URL if needed,
// but ideally we should handle this in the UI.
// We use a fallback to prevent the "supabaseUrl is required" error during module load.
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder"
);
