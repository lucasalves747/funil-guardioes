/**
 * Copy do e-mail do Diagnóstico, por perfil.
 *
 * Extraída do backend original (backend/routers.ts do pacote de entrega), onde
 * era usada para montar o e-mail enviado ao lead. Note que ela é ligeiramente
 * diferente da copy exibida na tela de resultado em pages/Diagnostico.tsx —
 * essa diferença é intencional e já existia no material original: o e-mail cita
 * ferramentas e códigos que a tela não cita.
 *
 * Vai no payload do webhook para que o sistema de e-mail não precise manter
 * quatro variações de template — basta percorrer `acoes`.
 */

export interface PerfilDiagnostico {
  perfil: string;
  titulo: string;
  cor: string;
}

export function getPerfil(escore: number): PerfilDiagnostico {
  if (escore <= 30) return { perfil: "colapso", titulo: "Colapso do Guardião", cor: "#EF4444" };
  if (escore <= 55) return { perfil: "alerta", titulo: "Guardião em Alerta", cor: "#F59E0B" };
  if (escore <= 75) return { perfil: "transicao", titulo: "Guardião em Transição", cor: "#3B82F6" };
  return { perfil: "ativo", titulo: "Guardião Ativo", cor: "#10B981" };
}

export const DESCRICOES_EMAIL: Record<string, string> = {
  colapso:
    "Seu diagnóstico indica um estado de esgotamento avançado. Você está operando no limite — e o seu corpo, a sua família e o seu negócio estão pagando o preço. Isso não é fraqueza. É o resultado de anos de um sistema que ensinou médicos a se anular. A boa notícia: você reconheceu o problema. E reconhecer é o primeiro passo para mudar.",
  alerta:
    "Você está em alerta amarelo. Ainda não chegou ao colapso, mas os sinais estão claros: sono comprometido, energia oscilante, presença fragmentada. A janela de ação está aberta.",
  transicao:
    "Você está em transição consciente. Já percebeu o problema e está tomando ações. Mas ainda há inconsistências. O próximo passo é criar um sistema, não depender de força de vontade.",
  ativo:
    "Você é um Guardião Ativo. Está acima da média dos médicos brasileiros em todos os territórios. O próximo nível é construir um legado que funcione sem a sua presença constante.",
};

export const ACOES_EMAIL: Record<string, string[]> = {
  colapso: [
    "Agende uma consulta de urgência com um médico de confiança para avaliação do seu estado físico e emocional.",
    "Implemente imediatamente os 3 Blocos Inegociáveis na sua agenda: Armadura (treino), Silêncio (deep work) e Legado (família).",
    "Delegue pelo menos 3 tarefas recorrentes para a sua equipe ainda esta semana usando o Checklist de Delegação.",
    "Agende o Painel do Guardião (bateria de exames completa) para os próximos 7 dias.",
    "BÔNUS: Acesse o Desafio Guardião 21 Dias — foi criado exatamente para médicos no seu nível de alerta. Use o código GUARDIAO2025.",
  ],
  alerta: [
    "Implemente o Protocolo de Sono Plantão-Compatível: âncora de sono fixa, ritual de desligamento 60 min antes de dormir.",
    "Inicie o Treino Mínimo Eficaz: 3 sessões de 40 min/semana com foco em força.",
    "Tenha a conversa com a sua equipe sobre delegação usando o Script de Conversa do Guardião.",
    "Agende o Painel do Guardião para os próximos 30 dias — especialmente testosterona, cortisol e vitamina D.",
    "BÔNUS: Baixe o Guardian Journal Digital e comece a rastrear suas métricas diárias de sono, energia e presença.",
  ],
  transicao: [
    "Consolide os 3 Blocos Inegociáveis — eles precisam ser invioláveis, não apenas frequentes.",
    "Crie o seu Manifesto de Legado: 300 palavras sobre quem você quer ser — não o médico, o ser humano.",
    "Implemente o Dia Sagrado da Família: um dia por semana com presença real, sem celular.",
    "Mapeie os 3 processos da sua clínica que dependem exclusivamente de você e crie um plano para torná-los independentes.",
    "BÔNUS: Você está pronto para a Comunidade Guardiões — um grupo de médicos que já passaram pelo mesmo caminho.",
  ],
  ativo: [
    "Você está acima da média — o próximo nível exige um sistema, não apenas disciplina individual.",
    "Documente os seus protocolos de saúde, negócio e família para que funcionem sem a sua presença constante.",
    "Considere se tornar um Guardião Mentor — médicos no seu nível têm muito a ensinar para colegas em colapso.",
    "Revise o seu Plano de 90 Dias: você está caminhando para o legado que quer construir?",
    "BÔNUS: Conheça o Evento METAMORFOSE em Miami — para Guardiões que já chegaram ao próximo nível.",
  ],
};
