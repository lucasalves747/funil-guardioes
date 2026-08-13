import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Projeto Supabase do Dr. Santiago Vecina.
 * Os valores podem ser sobrescritos por variáveis de ambiente na Vercel.
 * A anon key é pública por design — a proteção real vem das políticas de RLS
 * definidas em supabase/schema.sql (o anônimo só pode inserir, nunca ler).
 */
const PADRAO_URL = "https://zfmjeheozxmkibhoarlb.supabase.co";
const PADRAO_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmbWplaGVvenhta2liaG9hcmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MDY0OTQsImV4cCI6MjA5MDE4MjQ5NH0.UeUDEnJdWI6W6BGuyKCeGg9_fuabb7R2RzGsjAU3Q6g";

/**
 * Uma variável de ambiente declarada mas vazia é tão inútil quanto uma ausente —
 * e `??` deixaria a string vazia passar, derrubando o createClient na importação
 * do módulo e apagando o site inteiro. Por isso só valor com conteúdo vale.
 */
function definida(valor: unknown) {
  return typeof valor === "string" && valor.trim() !== "" ? valor.trim() : undefined;
}

const SUPABASE_URL = definida(import.meta.env.VITE_SUPABASE_URL) ?? PADRAO_URL;
const SUPABASE_ANON_KEY = definida(import.meta.env.VITE_SUPABASE_ANON_KEY) ?? PADRAO_ANON_KEY;

/**
 * Se a configuração ainda assim for inválida, o funil continua de pé: as páginas
 * renderizam e só o envio de formulário falha, com mensagem clara no console.
 * Nenhuma falha de configuração pode derrubar a página inteira de novo.
 */
let cliente: SupabaseClient | null = null;
try {
  cliente = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
} catch (erro) {
  console.error("[supabase] configuração inválida — a captura de leads ficará indisponível:", erro);
}

export const supabase = cliente;
