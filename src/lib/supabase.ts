import { createClient } from "@supabase/supabase-js";

/**
 * Projeto Supabase do Dr. Santiago Vecina.
 * Os valores podem ser sobrescritos por variáveis de ambiente na Vercel.
 * A anon key é pública por design — a proteção real vem das políticas de RLS
 * definidas em supabase/schema.sql (o anônimo só pode inserir, nunca ler).
 */
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? "https://zfmjeheozxmkibhoarlb.supabase.co";
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmbWplaGVvenhta2liaG9hcmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MDY0OTQsImV4cCI6MjA5MDE4MjQ5NH0.UeUDEnJdWI6W6BGuyKCeGg9_fuabb7R2RzGsjAU3Q6g";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});
