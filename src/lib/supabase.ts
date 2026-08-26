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
 *   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
 *
 * A chave publicável é pública por desenho — quem protege os dados são as
 * policies de RLS definidas em supabase/desafio-schema.sql.
 *
 * NUNCA use aqui a chave `sb_secret_...` (nem a `service_role` antiga): elas
 * ignoram o RLS por completo, o que faria a lista de liberados deixar de valer
 * — qualquer pessoa entraria na área de membros.
 *
 * O Supabase trocou o formato das chaves: `sb_publishable_...` substitui a
 * `anon`, que será descontinuada no fim de 2026. Os dois nomes de variável são
 * aceitos aqui para não quebrar quem já configurou com o nome antigo.
 */

function definida(valor: unknown) {
  return typeof valor === "string" && valor.trim() !== "" ? valor.trim() : undefined;
}

const URL_PROJETO = definida(import.meta.env.VITE_SUPABASE_URL);
const ANON_KEY =
  definida(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) ??
  definida(import.meta.env.VITE_SUPABASE_ANON_KEY);

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
    "[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY não definidas. " +
      "A área de membros vai pedir configuração; o resto do funil segue normal.",
  );
}

export const supabase = cliente;

/** A área de membros usa isto para mostrar um aviso claro em vez de quebrar. */
export const supabaseConfigurado = cliente !== null;
