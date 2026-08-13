import { useCallback, useRef, useState } from "react";
import { supabase } from "./supabase";

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

// ─── Perfis do Diagnóstico (mesma régua do backend original) ──────────────────
export function getPerfil(escore: number) {
  if (escore <= 30) return { perfil: "colapso", titulo: "Colapso do Guardião", cor: "#EF4444" };
  if (escore <= 55) return { perfil: "alerta", titulo: "Guardião em Alerta", cor: "#F59E0B" };
  if (escore <= 75) return { perfil: "transicao", titulo: "Guardião em Transição", cor: "#3B82F6" };
  return { perfil: "ativo", titulo: "Guardião Ativo", cor: "#10B981" };
}

export const EBOOK_PDF_URL = "/As_10_Horas_Escondidas.pdf";

interface DiagnosticoInput {
  nome: string;
  email: string;
  telefone: string;
  especialidade?: string;
  escore: number;
  respostas: Record<string, number>;
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
        return { success: true as const, pdfUrl: EBOOK_PDF_URL };
      }),
    },
  },
};
