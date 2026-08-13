/**
 * Os livros do Dr. Santiago Vecina.
 *
 * Fonte única: alimenta tanto a seção "Livros" da home quanto a página
 * dedicada de cada livro em /livros/:slug.
 *
 * Todo campo abaixo de `tags` é opcional e a página se adapta ao que existe —
 * um livro sem `descricao` não mostra bloco vazio, sem `capa` ganha uma capa
 * tipográfica, sem `link` não mostra botão de compra. Para enriquecer um livro,
 * basta preencher o campo aqui: nenhum componente precisa ser tocado.
 */

export interface Livro {
  slug: string;
  roman: string;
  title: string;
  subtitle: string;
  tags: string[];
  /** Parágrafo de apresentação exibido no topo da página do livro. */
  descricao?: string;
  /** Texto de abertura, em tom mais editorial, exibido como citação. */
  intro?: string;
  /** Vira a seção "O que você vai encontrar". */
  topicos?: string[];
  /** Caminho da capa em public/. Sem ela, a página gera uma capa tipográfica. */
  capa?: string;
  /** Link de compra/leitura. Sem ele, o botão não aparece. */
  link?: string;
  /** Livro ainda não lançado. */
  soon?: boolean;
}

export const LIVROS: Livro[] = [
  {
    slug: "o-lider-integral",
    roman: "I",
    title: "O Líder Integral",
    subtitle: "Como Liderar a Si Mesmo Antes de Liderar Qualquer Empresa",
    tags: ["Liderança", "Mentalidade", "Legado"],
    descricao:
      "Uma obra sobre a jornada interior da liderança. Dr. Santiago revela os princípios que transformam profissionais de sucesso em líderes de legado, capazes de influenciar gerações.",
  },
  {
    slug: "medico-do-corpo-e-da-alma",
    roman: "II",
    title: "Médico do Corpo e da Alma",
    subtitle: "Descubra Como Viver com Mais Saúde, Dignidade e Propósito",
    tags: ["Saúde", "Método", "Propósito"],
  },
  {
    slug: "o-despertar-de-um-pai-orfao",
    roman: "III",
    title: "O Despertar de um Pai Órfão",
    subtitle: "Reconstruindo Vidas, Reconectando Corações",
    tags: ["Família", "Paternidade", "Recomeço"],
  },
  {
    slug: "ceo-antifragil",
    roman: "IV",
    title: "CEO Antifrágil",
    subtitle: "Transformando Adversidade em Vantagem Competitiva",
    tags: ["Liderança", "Performance", "Resiliência"],
    capa: "/livros/ceo-antifragil.jpg",
  },
  {
    slug: "vida-alinhada",
    roman: "V",
    title: "Vida Alinhada",
    subtitle: "O Método para Prosperar Sem Destruir Sua Saúde e Família",
    tags: ["Performance", "Saúde", "Propósito"],
    descricao:
      "O livro que apresenta a tese central da Performance Integral. Um guia prático e profundo para líderes que querem construir sucesso real — com saúde, família e propósito alinhados.",
    soon: true,
  },
];

export function acharLivro(slug?: string) {
  return LIVROS.find((livro) => livro.slug === slug);
}
