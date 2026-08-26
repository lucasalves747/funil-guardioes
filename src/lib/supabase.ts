import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase da área de membros do Desafio 21 Dias.
 *
 * Diferente da versão que veio no material original, aqui NÃO existe projeto
 * chumbado no código. Aquele apontava para um projeto de terceiros, sem tabela
 * nenhuma, e todo formulário falhava em silêncio porque o código fingia estar
 * configurado. Sem as variáveis de ambiente, este módulo assume que não está
 * configurado e diz isso em voz alta.
 *
 * Configure na Vercel (e num .env.local para rodar na sua máquina):
 *
 *   VITE_SUPABASE_URL=https://SEUPROJETO.supabase.co
 *   VITE_SUPABASE_ANON_KEY=eyJ...
 *
 * A anon key é pública por desenho — quem protege os dados são as policies de
 * RLS definidas em supabase/desafio-schema.sql.
 */

function definida(valor: unknown) {
  return typeof valor === "string" && valor.trim() !== "" ? valor.trim() : undefined;
}

const URL_PROJETO = definida(import.meta.env.VITE_SUPABASE_URL);
const ANON_KEY = definida(import.meta.env.VITE_SUPABASE_ANON_KEY);

let cliente: SupabaseClient | null = null;

if (URL_PROJETO && ANON_KEY) {
  try {
    cliente = createClient(URL_PROJETO, ANON_KEY, {
      auth: {
        // A sessão precisa sobreviver ao fechar do navegador: o participante
        // volta todo dia por 21 dias e não deveria logar de novo a cada visita.
        persistSession: true,
        autoRefreshToken: true,
        storageKey: "guardioes_sessao",
      },
    });
  } catch (erro) {
    console.error("[supabase] configuração inválida — a área de membros ficará indisponível:", erro);
  }
} else if (import.meta.env.DEV) {
  console.info(
    "[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY não definidas. " +
      "A área de membros vai pedir configuração; o resto do funil segue normal.",
  );
}

export const supabase = cliente;

/** A área de membros usa isto para mostrar um aviso claro em vez de quebrar. */
export const supabaseConfigurado = cliente !== null;
