import { supabase, supabaseConfigurado } from "./supabase";

/**
 * Conta e progresso da área de membros do Desafio 21 Dias.
 *
 * Login sem senha: o participante informa o e-mail, recebe um código de 6
 * dígitos e digita de volta. Isso encaixa no fluxo que a página já prometia
 * ("código de acesso recebido por email") e evita senha para esquecer.
 *
 * O progresso vive no servidor (tabela desafio_progresso), com uma cópia no
 * localStorage funcionando como cache: a tela abre instantânea com o que já se
 * sabe e o servidor corrige em seguida. Se a rede cair no meio do diário, o
 * participante não perde o que escreveu.
 */

const CACHE_KEY = "guardioes_desafio_v1";

export interface ProgressoRemoto<TDados> {
  nome: string;
  profissao: string;
  dataInicio: string;
  dados: TDados;
}

/** Erro com mensagem já pronta para mostrar na tela, em português. */
export class ErroDeConta extends Error {}

function exigirCliente() {
  if (!supabase) {
    throw new ErroDeConta(
      "A área de membros ainda não foi configurada. Avise o suporte: faltam as variáveis do Supabase.",
    );
  }
  return supabase;
}

export { supabaseConfigurado };

// ─── Cache local ────────────────────────────────────────────────────────────

export function lerCache<TDados>(): TDados | null {
  try {
    const bruto = localStorage.getItem(CACHE_KEY);
    return bruto ? (JSON.parse(bruto) as TDados) : null;
  } catch {
    return null;
  }
}

export function gravarCache(dados: unknown) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(dados));
  } catch {
    // Aba anônima ou armazenamento cheio: o servidor continua sendo a verdade.
  }
}

export function limparCache() {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    /* nada a fazer */
  }
}

// ─── Login ──────────────────────────────────────────────────────────────────

/**
 * Dispara o código de 6 dígitos para o e-mail informado.
 *
 * `shouldCreateUser: true` é necessário porque o participante nunca criou
 * conta — ele comprou o desafio. Quem não estiver na lista de liberados até
 * recebe o código, mas o RLS recusa a criação do progresso na hora de entrar.
 */
export async function enviarCodigo(email: string) {
  const cliente = exigirCliente();
  const { error } = await cliente.auth.signInWithOtp({
    email: email.trim(),
    options: { shouldCreateUser: true },
  });

  if (error) {
    if (/rate|limit|seconds/i.test(error.message)) {
      throw new ErroDeConta("Aguarde alguns segundos antes de pedir um novo código.");
    }
    throw new ErroDeConta("Não foi possível enviar o código. Confira o e-mail digitado.");
  }
}

/** Confirma o código e abre a sessão. */
export async function confirmarCodigo(email: string, codigo: string) {
  const cliente = exigirCliente();
  const { data, error } = await cliente.auth.verifyOtp({
    email: email.trim(),
    token: codigo.trim(),
    type: "email",
  });

  if (error || !data.user) {
    throw new ErroDeConta("Código inválido ou expirado. Peça um novo e tente de novo.");
  }

  return data.user;
}

export async function sair() {
  if (!supabase) return;
  await supabase.auth.signOut();
  limparCache();
}

/** Sessão que sobreviveu ao fechar do navegador, se houver. */
export async function usuarioAtual() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

// ─── Progresso ──────────────────────────────────────────────────────────────

/** Busca o progresso do participante logado. `null` = ainda não começou. */
export async function carregarProgresso<TDados>(): Promise<ProgressoRemoto<TDados> | null> {
  const cliente = exigirCliente();
  const { data: sessao } = await cliente.auth.getUser();
  if (!sessao.user) throw new ErroDeConta("Sua sessão expirou. Entre novamente.");

  const { data, error } = await cliente
    .from("desafio_progresso")
    .select("nome, profissao, data_inicio, dados")
    .eq("user_id", sessao.user.id)
    .maybeSingle();

  if (error) {
    throw new ErroDeConta("Não foi possível carregar o seu progresso. Tente recarregar a página.");
  }
  if (!data) return null;

  return {
    nome: data.nome ?? "",
    profissao: data.profissao ?? "",
    dataInicio: data.data_inicio,
    dados: (data.dados ?? {}) as TDados,
  };
}

/**
 * Cria a linha de progresso na primeira entrada.
 *
 * É aqui que a lista de liberados morde: se o e-mail não estiver em
 * desafio_liberados, o RLS recusa o insert e a pessoa não entra.
 */
export async function iniciarProgresso<TDados>(entrada: {
  nome: string;
  profissao: string;
  dados: TDados;
}): Promise<ProgressoRemoto<TDados>> {
  const cliente = exigirCliente();
  const { data: sessao } = await cliente.auth.getUser();
  if (!sessao.user) throw new ErroDeConta("Sua sessão expirou. Entre novamente.");

  const linha = {
    user_id: sessao.user.id,
    email: sessao.user.email ?? "",
    nome: entrada.nome,
    profissao: entrada.profissao,
    dados: entrada.dados as unknown as Record<string, unknown>,
  };

  const { data, error } = await cliente
    .from("desafio_progresso")
    .insert(linha)
    .select("nome, profissao, data_inicio, dados")
    .single();

  if (error) {
    // 42501 = violação de RLS: o e-mail não está na lista de liberados.
    if (error.code === "42501" || /row-level security/i.test(error.message)) {
      throw new ErroDeConta(
        "Este e-mail não consta na lista do Desafio. Use o e-mail da sua compra ou fale com o suporte.",
      );
    }
    throw new ErroDeConta("Não foi possível iniciar o seu desafio. Tente novamente.");
  }

  return {
    nome: data.nome ?? "",
    profissao: data.profissao ?? "",
    dataInicio: data.data_inicio,
    dados: (data.dados ?? {}) as TDados,
  };
}

/**
 * Grava o diário. Nunca lança: é chamada a cada digitação do participante e
 * uma falha de rede não pode virar um alerta no meio da escrita. O cache local
 * já guardou o conteúdo; a próxima gravação bem-sucedida sincroniza tudo.
 */
export async function salvarProgresso(dados: unknown): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { data: sessao } = await supabase.auth.getUser();
    if (!sessao.user) return false;

    const { error } = await supabase
      .from("desafio_progresso")
      .update({ dados: dados as Record<string, unknown> })
      .eq("user_id", sessao.user.id);

    if (error) {
      console.warn("[desafio] não foi possível salvar o progresso agora:", error.message);
      return false;
    }
    return true;
  } catch (erro) {
    console.warn("[desafio] falha ao salvar o progresso:", erro);
    return false;
  }
}
