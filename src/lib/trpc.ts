import { useCallback, useRef, useState } from "react";
import { dispararEmail, type Evento } from "./webhooks";
import { ACOES_EMAIL, DESCRICOES_EMAIL, getPerfil } from "./copy-diagnostico";
import { enviarContato, type ContatoInput } from "./contatos";

/**
 * Camada de captura de leads.
 *
 * As páginas do funil foram escritas contra o backend tRPC da plataforma Manus.
 * Aqui esse contrato é mantido intacto (`trpc.ebook.capturarLead.useMutation()`),
 * mas sem servidor próprio: o funil inteiro é um site estático na Vercel.
 *
 * Destino único do lead: o CRM de Contatos (lib/contatos.ts). O material
 * original gravava num projeto Supabase de terceiros, sem acesso e sem as
 * tabelas criadas — todo formulário falhava em silêncio. Esse caminho foi
 * removido; quem guarda o lead agora é o CRM.
 */

interface MutationOptions<TInput, TData> {
  onSuccess?: (data: TData, input: TInput) => void;
  onError?: (error: Error, input: TInput) => void;
  onSettled?: (data: TData | null, error: Error | null, input: TInput) => void;
}

function createMutationHook<TInput, TData>(execute: (input: TInput) => Promise<TData>) {
  return function useMutation(options: MutationOptions<TInput, TData> = {}) {
    const [isPending, setIsPending] = useState(false);
    const [data, setData] = useState<TData | null>(null);
    const [error, setError] = useState<Error | null>(null);

    // Mantém os callbacks sempre atualizados sem recriar mutate a cada render.
    const optionsRef = useRef(options);
    optionsRef.current = options;

    const mutateAsync = useCallback(async (input: TInput) => {
      setIsPending(true);
      setError(null);
      try {
        const result = await execute(input);
        setData(result);
        optionsRef.current.onSuccess?.(result, input);
        optionsRef.current.onSettled?.(result, null, input);
        return result;
      } catch (cause) {
        const failure = cause instanceof Error ? cause : new Error(String(cause));
        setError(failure);
        optionsRef.current.onError?.(failure, input);
        optionsRef.current.onSettled?.(null, failure, input);
        throw failure;
      } finally {
        setIsPending(false);
      }
    }, []);

    const mutate = useCallback(
      (input: TInput) => {
        // mutate não propaga rejeição — o estado de erro já é exposto no retorno.
        void mutateAsync(input).catch(() => undefined);
      },
      [mutateAsync],
    );

    const reset = useCallback(() => {
      setData(null);
      setError(null);
    }, []);

    return { mutate, mutateAsync, isPending, isLoading: isPending, data, error, reset };
  };
}

export { getPerfil };

export const EBOOK_PDF_URL = "/As_10_Horas_Escondidas.pdf";

interface DiagnosticoInput {
  nome: string;
  email: string;
  telefone: string;
  regiao?: string;
  profissao?: string;
  especialidade?: string;
  escore: number;
  respostas: Record<string, number>;
  /**
   * As páginas da Masterclass e do Desafio reaproveitam este endpoint. Sem esta
   * marcação, quem se inscreve na Masterclass receberia o e-mail do diagnóstico
   * — que foi o que aconteceu no material original.
   */
  evento?: Evento;
  /** O que a página perguntou além dos cinco campos padrão. Vira o comentário no CRM. */
  extras?: Record<string, unknown>;
}

interface CalculadoraInput {
  nome: string;
  email: string;
  telefone: string;
  regiao?: string;
  profissao?: string;
  horasSemanais: number;
  valorConsulta: number;
  horaReal: string;
  /** O que a página perguntou além dos cinco campos padrão. Vira o comentário no CRM. */
  extras?: Record<string, unknown>;
}

interface EbookInput {
  nome: string;
  email: string;
  telefone: string;
  regiao?: string;
  profissao?: string;
  especialidade?: string;
  origem?: string;
  /** O que a página perguntou além dos cinco campos padrão. Vira o comentário no CRM. */
  extras?: Record<string, unknown>;
}

export const trpc = {
  diagnostico: {
    submitResultado: {
      useMutation: createMutationHook(async (input: DiagnosticoInput) => {
        const p = getPerfil(input.escore);
        const evento = input.evento ?? "diagnostico";

        await enviarContato({
          nome: input.nome,
          email: input.email,
          telefone: input.telefone,
          regiao: input.regiao,
          profissao: input.profissao,
          tags: [evento],
          extras: {
            // Escore e perfil só dizem alguma coisa no diagnóstico de verdade.
            ...(evento === "diagnostico"
              ? { Escore: input.escore, Perfil: p.titulo, Respostas: input.respostas }
              : {}),
            ...input.extras,
          },
        });

        await dispararEmail(evento, {
          nome: input.nome,
          email: input.email,
          telefone: input.telefone,
          regiao: input.regiao ?? null,
          profissao: input.profissao ?? null,
          especialidade: input.especialidade ?? null,
          // Só faz sentido falar em escore/perfil no diagnóstico de verdade.
          ...(evento === "diagnostico"
            ? {
                escore: input.escore,
                perfil: p.perfil,
                titulo: p.titulo,
                cor: p.cor,
                descricao: DESCRICOES_EMAIL[p.perfil],
                acoes: ACOES_EMAIL[p.perfil],
                respostas: input.respostas,
              }
            : {}),
        });

        return { success: true as const, perfil: p.perfil, titulo: p.titulo };
      }),
    },
  },
  calculadora: {
    submitResultado: {
      useMutation: createMutationHook(async (input: CalculadoraInput) => {
        await enviarContato({
          nome: input.nome,
          email: input.email,
          telefone: input.telefone,
          regiao: input.regiao,
          profissao: input.profissao,
          tags: ["calculadora"],
          extras: {
            "Horas por semana": input.horasSemanais,
            "Valor por consulta": input.valorConsulta,
            "Hora real calculada": input.horaReal,
            ...input.extras,
          },
        });

        await dispararEmail("calculadora", {
          nome: input.nome,
          email: input.email,
          telefone: input.telefone,
          regiao: input.regiao ?? null,
          profissao: input.profissao ?? null,
          horasSemanais: input.horasSemanais,
          valorConsulta: input.valorConsulta,
          horaReal: input.horaReal,
        });

        return { success: true as const };
      }),
    },
  },
  ebook: {
    capturarLead: {
      useMutation: createMutationHook(async (input: EbookInput) => {
        await enviarContato({
          nome: input.nome,
          email: input.email,
          telefone: input.telefone,
          regiao: input.regiao,
          profissao: input.profissao,
          tags: ["ebook"],
          extras: {
            "Origem do link": input.origem ?? "ebook_10_horas",
            "Aceitou receber contato": "sim",
            ...input.extras,
          },
        });

        await dispararEmail("ebook", {
          nome: input.nome,
          email: input.email,
          telefone: input.telefone,
          regiao: input.regiao ?? null,
          profissao: input.profissao ?? null,
          especialidade: input.especialidade ?? null,
          origem: input.origem ?? "ebook_10_horas",
          // URL absoluta: o e-mail é lido fora do site.
          pdfUrl: new URL(EBOOK_PDF_URL, window.location.origin).toString(),
        });

        return { success: true as const, pdfUrl: EBOOK_PDF_URL };
      }),
    },
  },
  /**
   * Captura simples, sem tabela própria no Supabase: os formulários de contato
   * da home e das iscas, que antes só marcavam "enviado" na tela sem mandar o
   * lead a lugar nenhum.
   */
  contato: {
    enviar: {
      useMutation: createMutationHook(async (input: ContatoInput) => {
        await enviarContato(input);
        return { success: true as const };
      }),
    },
  },
};
