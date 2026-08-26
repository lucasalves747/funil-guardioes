/**
 * Campos comuns a todos os formulários de captura do funil.
 *
 * Cada página desenha o formulário com o seu próprio sistema visual (umas com
 * Tailwind, outras com style inline), mas as perguntas e a lista de profissões
 * são as mesmas em todo lugar. Centralizar aqui evita que uma página fique com
 * uma lista defasada depois da próxima revisão de copy.
 */

export const PROFISSOES = [
  "Limpeza residencial e comercial",
  "Construção civil",
  "Pintura",
  "Flooring / pisos",
  "Roofing / telhados",
  "Landscaping / jardinagem",
  "Moving / mudanças",
  "Delivery e transporte",
  "Restaurantes e alimentação",
  "Salões de beleza e estética",
  "Real Estate",
  "Property management",
  "Airbnb / vacation rental",
  "Serviços automotivos",
  "Contabilidade e tax services",
  "Seguros",
  "Consultoria migratória e documental",
  "Marketing digital",
  "Eventos e entretenimento",
  "E-commerce",
] as const;

export type Profissao = (typeof PROFISSOES)[number];

/** Rótulos e placeholders, para que as cinco perguntas fiquem idênticas em todas as páginas. */
export const LABELS = {
  nome: "Seu nome",
  email: "Seu melhor e-mail",
  telefone: "Seu telefone",
  regiao: "Sua região",
  profissao: "Sua profissão",
} as const;

export const PLACEHOLDERS = {
  nome: "Ex: Maria Silva",
  email: "seu@email.com",
  telefone: "+55 11 99999-0000",
  regiao: "Ex: São Paulo - SP",
  profissao: "Selecione uma opção",
} as const;
