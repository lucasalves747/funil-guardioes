import { useCallback, useRef, useState } from "react";
import { supabase } from "./supabase";
import { dispararEmail, type Evento } from "./webhooks";
import { ACOES_EMAIL, DESCRICOES_EMAIL, getPerfil } from "./copy-diagnostico";

/**
 * Camada de captura de leads.
 *
 * As páginas do funil foram escritas contra o backend tRPC da plataforma Manus.
 * Aqui esse contrato é mantido intacto (`trpc.ebook.capturarLead.useMutation()`),
 * mas a persistência acontece direto no Supabase — sem servidor próprio, o que
 * permite hospedar o funil inteiro como site estático na Vercel.
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

async function insert(table: string, row: Record<string, unknown>) {
  if (!supabase) throw new Error("Supabase não configurado — verifique as variáveis de ambiente.");
  const { error } = await supabase.from(table).insert(row);
  if (error) throw new Error(error.message);
}

export { getPerfil };

export const EBOOK_PDF_URL = "/As_10_Horas_Escondidas.pdf";

interface DiagnosticoInput {
  nome: string;
  email: string;
  telefone: string;
  especialidade?: string;
  escore: number;
  respostas: Record<string, number>;
  /**
   * As páginas da Masterclass e do Desafio reaproveitam este endpoint. Sem esta
   * marcação, quem se inscreve na Masterclass receberia o e-mail do diagnóstico
   * — que foi o que aconteceu no material original.
   */
  evento?: Evento;
}

interface CalculadoraInput {
  nome: string;
  email: string;
  telefone: string;
  horasSemanais: number;
  valorConsulta: number;
  horaReal: string;
}

interface EbookInput {
  nome: string;
  email: string;
  telefone: string;
  especialidade?: string;
  origem?: string;
}

export const trpc = {
  diagnostico: {
    submitResultado: {
      useMutation: createMutationHook(async (input: DiagnosticoInput) => {
        const p = getPerfil(input.escore);
        await insert("diagnostico_leads", {
          nome: input.nome,
          email: input.email,
          telefone: input.telefone,
          especialidade: input.especialidade ?? null,
          escore: input.escore,
          perfil: p.perfil,
          respostas: input.respostas,
        });

        const evento = input.evento ?? "diagnostico";
        await dispararEmail(evento, {
          nome: input.nome,
          email: input.email,
          telefone: input.telefone,
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
        await insert("calculadora_leads", {
          nome: input.nome,
          email: input.email,
          telefone: input.telefone,
          horas_semanais: input.horasSemanais,
          valor_consulta: input.valorConsulta,
          hora_real: input.horaReal,
        });

        await dispararEmail("calculadora", {
          nome: input.nome,
          email: input.email,
          telefone: input.telefone,
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
        await insert("ebook_leads", {
          nome: input.nome,
          email: input.email,
          telefone: input.telefone,
          especialidade: input.especialidade ?? null,
          origem: input.origem ?? "ebook_10_horas",
          consentimento: true,
        });

        await dispararEmail("ebook", {
          nome: input.nome,
          email: input.email,
          telefone: input.telefone,
          especialidade: input.especialidade ?? null,
          origem: input.origem ?? "ebook_10_horas",
          // URL absoluta: o e-mail é lido fora do site.
          pdfUrl: new URL(EBOOK_PDF_URL, window.location.origin).toString(),
        });

        return { success: true as const, pdfUrl: EBOOK_PDF_URL };
      }),
    },
  },
};
