/**
 * Disparo de e-mail via webhook externo.
 *
 * O site é estático: ele não envia e-mail, apenas avisa um webhook a cada
 * conversão, com os dados já estruturados. Quem monta e dispara o e-mail é o
 * sistema do outro lado.
 *
 * Uma URL por evento, cada uma numa variável de ambiente. Evento sem URL
 * configurada é simplesmente ignorado — o funil continua funcionando e o lead
 * continua sendo gravado no Supabase.
 */

export type Evento = "ebook" | "diagnostico" | "calculadora" | "masterclass" | "desafio";

const URLS: Record<Evento, string | undefined> = {
  ebook: import.meta.env.VITE_WEBHOOK_EBOOK,
  diagnostico: import.meta.env.VITE_WEBHOOK_DIAGNOSTICO,
  calculadora: import.meta.env.VITE_WEBHOOK_CALCULADORA,
  masterclass: import.meta.env.VITE_WEBHOOK_MASTERCLASS,
  desafio: import.meta.env.VITE_WEBHOOK_DESAFIO,
};

function urlDoEvento(evento: Evento) {
  const url = URLS[evento];
  return typeof url === "string" && url.trim() !== "" ? url.trim() : undefined;
}

/**
 * Avisa o webhook do evento. Nunca lança:
 *
 * o lead já foi gravado no Supabase quando esta função roda, então uma falha
 * aqui não pode derrubar o formulário na cara do usuário. O erro vai para o
 * console e a página segue o fluxo normal.
 */
export async function dispararEmail(evento: Evento, dados: Record<string, unknown>) {
  const url = urlDoEvento(evento);
  if (!url) {
    if (import.meta.env.DEV) console.info(`[webhook] ${evento}: sem URL configurada, nada enviado.`);
    return false;
  }

  try {
    const resposta = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        evento,
        enviadoEm: new Date().toISOString(),
        origemPagina: window.location.pathname,
        ...dados,
      }),
    });
    if (!resposta.ok) {
      console.error(`[webhook] ${evento} respondeu ${resposta.status}`);
      return false;
    }
    return true;
  } catch (erro) {
    console.error(`[webhook] falha ao chamar ${evento}:`, erro);
    return false;
  }
}
