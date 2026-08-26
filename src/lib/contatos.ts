/**
 * Destino dos leads: o CRM de Contatos.
 *
 * Todo formulário do funil termina aqui. O site é estático — não existe
 * servidor próprio, então a página fala direto com a API pública do CRM.
 *
 * A chave faz parte da URL e é pública por desenho (a rota é /api/public/).
 * Ela vai no bundle do site, como qualquer chave de formulário público: serve
 * para gravar contato, não dá acesso de leitura ao CRM. Trocar a chave é só
 * publicar a nova em VITE_CONTATOS_URL na Vercel.
 */

const PADRAO_URL =
  "https://contact-blossom-39.lovable.app/api/public/contatos/ck_a46f28fd_a46f28fd84747f204872c015bac089e664e862f897cc65c2fd84e30e39d72187";

function definida(valor: unknown) {
  return typeof valor === "string" && valor.trim() !== "" ? valor.trim() : undefined;
}

const CONTATOS_URL = definida(import.meta.env.VITE_CONTATOS_URL) ?? PADRAO_URL;

/** Os campos que o CRM aceita. Os que o funil não coleta vão vazios. */
interface Payload {
  nome: string;
  email: string;
  telefone: string;
  regiao: string;
  profissao: string;
  tags: string[];
  redes_sociais: string[];
  comentario: string;
  link_origem: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
}

export interface ContatoInput {
  nome: string;
  email: string;
  telefone: string;
  regiao?: string;
  profissao?: string;
  /** Além de "lead" e "site", que entram sempre — normalmente o nome do funil. */
  tags?: string[];
  /**
   * O que o formulário perguntou e o CRM não tem campo próprio para guardar:
   * escore do diagnóstico, mensagem do contato, contas da calculadora. Vira
   * o comentário do contato, uma linha por item, na ordem em que foi passado.
   */
  extras?: Record<string, unknown>;
}

/** "Escore: 62" — valores vazios são descartados para não sujar o comentário. */
function formatarExtras(extras: Record<string, unknown> | undefined) {
  if (!extras) return "";
  return Object.entries(extras)
    .filter(([, valor]) => valor !== undefined && valor !== null && valor !== "")
    .map(([rotulo, valor]) => `${rotulo}: ${typeof valor === "object" ? JSON.stringify(valor) : String(valor)}`)
    .join("\n");
}

/**
 * UTMs e página de origem saem da URL da própria visita — o lead não digita
 * isso. Sem UTM na URL (acesso direto), os campos vão vazios.
 */
function origemDaVisita() {
  if (typeof window === "undefined") {
    return { link_origem: "", utm_source: "", utm_medium: "", utm_campaign: "", utm_term: "", utm_content: "" };
  }
  const busca = new URLSearchParams(window.location.search);
  return {
    link_origem: window.location.href,
    utm_source: busca.get("utm_source") ?? "",
    utm_medium: busca.get("utm_medium") ?? "",
    utm_campaign: busca.get("utm_campaign") ?? "",
    utm_term: busca.get("utm_term") ?? "",
    utm_content: busca.get("utm_content") ?? "",
  };
}

export function montarPayload(input: ContatoInput): Payload {
  return {
    nome: input.nome,
    email: input.email,
    telefone: input.telefone,
    regiao: input.regiao ?? "",
    profissao: input.profissao ?? "",
    tags: ["lead", "site", ...(input.tags ?? [])],
    // O funil não pergunta redes sociais — o campo vai vazio.
    redes_sociais: [],
    comentario: formatarExtras(input.extras),
    ...origemDaVisita(),
  };
}

/**
 * Grava o contato no CRM. Lança em caso de falha: este é o destino final do
 * lead, então um erro aqui precisa chegar ao formulário para o visitante poder
 * tentar de novo — engolir a falha seria perder o lead em silêncio.
 */
export async function enviarContato(input: ContatoInput) {
  const resposta = await fetch(CONTATOS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(montarPayload(input)),
  });

  if (!resposta.ok) {
    throw new Error(`CRM respondeu ${resposta.status} ao gravar o contato.`);
  }

  return (await resposta.json().catch(() => ({ ok: true }))) as { ok?: boolean; ids?: string[] };
}
