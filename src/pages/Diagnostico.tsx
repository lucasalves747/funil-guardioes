import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// ─── Perguntas do Quiz ────────────────────────────────────────────────────────
const PERGUNTAS = [
  // TERRITÓRIO 1: TEMPO
  { id: "T1", territorio: "TEMPO", pergunta: "Você consegue encerrar o seu dia de trabalho no horário planejado?", opcoes: ["Nunca — sempre fico além do previsto", "Raramente — 1 ou 2 vezes por semana", "Às vezes — cerca de metade das vezes", "Frequentemente — na maioria dos dias", "Sempre — tenho controle total do meu tempo"] },
  { id: "T2", territorio: "TEMPO", pergunta: "Você tem pelo menos 1 hora por dia de tempo não agendado para pensar estrategicamente?", opcoes: ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"] },
  { id: "T3", territorio: "TEMPO", pergunta: "Você consegue tirar férias de 7+ dias sem checar o trabalho?", opcoes: ["Nunca consigo me desconectar", "Raramente", "Às vezes", "Frequentemente", "Sempre — tenho um sistema que funciona sem mim"] },

  // TERRITÓRIO 2: CORPO
  { id: "C1", territorio: "CORPO", pergunta: "Você treina com regularidade (3+ vezes por semana)?", opcoes: ["Nunca", "Raramente (1x/semana ou menos)", "Às vezes (2x/semana)", "Frequentemente (3x/semana)", "Sempre (4+ vezes/semana)"] },
  { id: "C2", territorio: "CORPO", pergunta: "Você dorme 7 a 8 horas por noite com qualidade?", opcoes: ["Nunca — durmo menos de 5h com frequência", "Raramente — 5 a 6h irregulares", "Às vezes — 6 a 7h na maioria das noites", "Frequentemente — 7h na maioria das noites", "Sempre — 7 a 8h com qualidade consistente"] },

  // TERRITÓRIO 2B: SAÚDE FISIOLÓGICA
  { id: "S1", territorio: "SAÚDE FISIOLÓGICA", pergunta: "Como você descreveria seu nível de estresse crônico nas últimas 4 semanas?", opcoes: ["Extremo — sintomas físicos constantes (insônia, taquicardia, cefaleia frequente)", "Alto — irritabilidade, dificuldade de concentração, sensação de sobrecarga", "Moderado — estressado mas funcional, com episódios de recuperação", "Baixo — estresse pontual, recuperação rápida", "Mínimo — sistema nervoso calibrado, resiliência alta"] },
  { id: "S2", territorio: "SAÚDE FISIOLÓGICA", pergunta: "Qual é o seu nível de energia ao longo de um dia de trabalho de 10 a 12 horas?", opcoes: ["Colapso — esgotado antes do meio-dia, dependente de cafeína para funcionar", "Baixo — queda acentuada de energia após o almoço, dificuldade de manter foco", "Oscilante — bons momentos e momentos de fadiga intensa no mesmo dia", "Estável — energia consistente com queda leve no final do dia", "Alto — energia sustentada ao longo de todo o dia, recuperação rápida"] },
  { id: "S3", territorio: "SAÚDE FISIOLÓGICA", pergunta: "Como está sua libido e vitalidade geral nos últimos 3 meses? (Seja honesto — você pede esse dado nos seus pacientes)", opcoes: ["Ausente — libido praticamente inexistente, vitalidade muito baixa", "Muito baixa — interesse raro, cansaço crônico dominante", "Reduzida — abaixo do que era há 2 a 3 anos, mas presente", "Adequada — dentro do esperado para a faixa etária e nível de estresse", "Alta — libido e vitalidade preservadas, sem queixas significativas"] },

  // TERRITÓRIO 3: FAMÍLIA
  { id: "F1", territorio: "FAMÍLIA", pergunta: "Você está presente de verdade (sem celular, sem trabalho mental) com sua família?", opcoes: ["Nunca — sempre distraído ou ausente fisicamente", "Raramente", "Às vezes", "Frequentemente", "Sempre — tenho rituais de presença real com a família"] },
  { id: "F2", territorio: "FAMÍLIA", pergunta: "Sua família se queixa da sua ausência ou do seu estado emocional?", opcoes: ["Constantemente — é fonte de conflito frequente", "Com frequência", "Às vezes", "Raramente", "Nunca — minha família se sente priorizada"] },

  // TERRITÓRIO 4: NEGÓCIO
  { id: "N1", territorio: "NEGÓCIO", pergunta: "Sua clínica ou consultório funciona sem a sua presença por 1 semana?", opcoes: ["Não — tudo para sem mim", "Parcialmente — muitas coisas dependem de mim", "Às vezes — funciona com dificuldades", "Frequentemente — funciona bem com supervisão remota", "Sempre — tenho um sistema e equipe autônomos"] },
  { id: "N2", territorio: "NEGÓCIO", pergunta: "Você tem clareza sobre quanto vale cada hora do seu trabalho (valor real, não o cobrado)?", opcoes: ["Nenhuma clareza — nunca calculei", "Pouca clareza — tenho uma ideia vaga", "Alguma clareza — já calculei mas não uso como critério", "Boa clareza — uso para tomar decisões de delegação", "Total clareza — meu tempo é gerenciado como ativo estratégico"] },
  { id: "N3", territorio: "NEGÓCIO", pergunta: "Você tem uma estratégia de crescimento definida para os próximos 12 meses?", opcoes: ["Não — vivo apagando incêndios", "Tenho ideias mas nada estruturado", "Tenho um esboço mas sem execução consistente", "Tenho um plano e executo parcialmente", "Tenho um plano claro com metas, KPIs e execução semanal"] },

  // TERRITÓRIO 5: PROPÓSITO
  { id: "P1", territorio: "PROPÓSITO", pergunta: "Você sente que a sua vida profissional está alinhada com o que você realmente quer construir?", opcoes: ["Não — me sinto completamente desalinhado", "Raramente — há momentos de sentido mas são exceção", "Às vezes — alinhamento parcial e instável", "Frequentemente — na maioria das vezes me sinto no caminho certo", "Sempre — cada decisão está conectada ao meu propósito maior"] },
  { id: "P2", territorio: "PROPÓSITO", pergunta: "Você tem clareza sobre o legado que quer deixar — para sua família, seus pacientes e sua profissão?", opcoes: ["Nenhuma clareza — nunca parei para pensar nisso", "Pouca clareza — tenho sentimentos vagos mas nada definido", "Alguma clareza — já refleti mas não está articulado", "Boa clareza — consigo descrever meu legado com precisão", "Total clareza — meu legado está documentado e guia minhas decisões diárias"] },
  { id: "P3", territorio: "PROPÓSITO", pergunta: "Se você parasse de trabalhar amanhã, sua vida teria sentido pleno além da medicina?", opcoes: ["Não — minha identidade é inteiramente a medicina", "Raramente — tenho poucos outros pilares de sentido", "Às vezes — há outros pilares mas frágeis", "Frequentemente — tenho outros pilares sólidos", "Sempre — minha vida tem sentido pleno independente da medicina"] },
];

const PERFIS: Record<string, { titulo: string; cor: string; bg: string; descricao: string }> = {
  colapso: {
    titulo: "Colapso do Guardião",
    cor: "#EF4444",
    bg: "rgba(239,68,68,0.1)",
    descricao: "Seu diagnóstico indica um estado de esgotamento avançado. Você está operando no limite — e o seu corpo, a sua família e o seu negócio estão pagando o preço. Isso não é fraqueza. É o resultado de anos de um sistema que ensinou médicos a se anular. A boa notícia: você reconheceu o problema. E reconhecer é o primeiro passo para mudar.",
  },
  alerta: {
    titulo: "Guardião em Alerta",
    cor: "#F59E0B",
    bg: "rgba(245,158,11,0.1)",
    descricao: "Você está em alerta amarelo. Ainda não chegou ao colapso, mas os sinais estão claros: sono comprometido, energia oscilante, presença fragmentada. Você sabe que algo precisa mudar — e esse diagnóstico confirma isso. A janela de ação está aberta.",
  },
  transicao: {
    titulo: "Guardião em Transição",
    cor: "#3B82F6",
    bg: "rgba(59,130,246,0.1)",
    descricao: "Você está em transição consciente. Já percebeu o problema e está tomando ações. Mas ainda há inconsistências — dias bons e dias ruins. O próximo passo é criar um sistema, não depender de força de vontade.",
  },
  ativo: {
    titulo: "Guardião Ativo",
    cor: "#10B981",
    bg: "rgba(16,185,129,0.1)",
    descricao: "Você é um Guardião Ativo. Está acima da média dos médicos brasileiros em todos os territórios. Mas você sabe que o próximo nível não é sobre mais disciplina — é sobre construir um legado que funcione sem a sua presença constante.",
  },
};

const ACOES: Record<string, string[]> = {
  colapso: [
    "Agende uma consulta de urgência com um médico de confiança para avaliação do seu estado físico e emocional.",
    "Implemente imediatamente os 3 Blocos Inegociáveis: Armadura (treino), Silêncio (deep work) e Legado (família).",
    "Delegue pelo menos 3 tarefas recorrentes para a sua equipe ainda esta semana.",
    "Agende o Painel do Guardião (bateria de exames completa) para os próximos 7 dias.",
    "BÔNUS: Acesse o Desafio Guardião 21 Dias — foi criado exatamente para médicos no seu nível de alerta.",
  ],
  alerta: [
    "Implemente o Protocolo de Sono Plantão-Compatível: âncora de sono fixa, ritual de desligamento 60 min antes de dormir.",
    "Inicie o Treino Mínimo Eficaz: 3 sessões de 40 min/semana com foco em força.",
    "Tenha a conversa com a sua equipe sobre delegação usando o Script de Conversa do Guardião.",
    "Agende o Painel do Guardião para os próximos 30 dias — especialmente testosterona, cortisol e vitamina D.",
    "BÔNUS: Baixe o Guardian Journal Digital e comece a rastrear suas métricas diárias.",
  ],
  transicao: [
    "Consolide os 3 Blocos Inegociáveis — eles precisam ser invioláveis, não apenas frequentes.",
    "Crie o seu Manifesto de Legado: 300 palavras sobre quem você quer ser.",
    "Implemente o Dia Sagrado da Família: um dia por semana com presença real, sem celular.",
    "Mapeie os 3 processos da sua clínica que dependem exclusivamente de você.",
    "BÔNUS: Você está pronto para a Comunidade Guardiões.",
  ],
  ativo: [
    "O próximo nível exige um sistema, não apenas disciplina individual.",
    "Documente os seus protocolos de saúde, negócio e família.",
    "Considere se tornar um Guardião Mentor — médicos no seu nível têm muito a ensinar.",
    "Revise o seu Plano de 90 Dias: você está caminhando para o legado que quer construir?",
    "BÔNUS: Conheça o Evento METAMORFOSE em Miami.",
  ],
};

type Fase = "intro" | "quiz" | "captura" | "resultado";

export default function Diagnostico() {
  const [fase, setFase] = useState<Fase>("intro");
  const [respostas, setRespostas] = useState<Record<string, number>>({});
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", especialidade: "" });
  const [resultado, setResultado] = useState<{ escore: number; perfil: string; titulo: string } | null>(null);

  const submitMutation = trpc.diagnostico.submitResultado.useMutation({
    onSuccess: (data) => {
      setResultado({ escore: calcularEscore(), perfil: data.perfil, titulo: data.titulo });
      setFase("resultado");
      toast.success("Resultado enviado para o seu email!");
    },
    onError: () => toast.error("Erro ao enviar. Tente novamente."),
  });

  const calcularEscore = () => {
    const total = Object.values(respostas).reduce((sum, v) => sum + v, 0);
    const max = PERGUNTAS.length * 4;
    return Math.round((total / max) * 100);
  };

  const responderPergunta = (valor: number) => {
    const p = PERGUNTAS[perguntaAtual];
    setRespostas(prev => ({ ...prev, [p.id]: valor }));
    if (perguntaAtual < PERGUNTAS.length - 1) {
      setPerguntaAtual(prev => prev + 1);
    } else {
      setFase("captura");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.email || !form.telefone) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    submitMutation.mutate({
      nome: form.nome,
      email: form.email,
      telefone: form.telefone,
      especialidade: form.especialidade || undefined,
      escore: calcularEscore(),
      respostas,
    });
  };

  const progresso = Math.round(((perguntaAtual) / PERGUNTAS.length) * 100);
  const p = PERGUNTAS[perguntaAtual];
  const perfilAtual = resultado ? PERFIS[resultado.perfil] : null;
  const acoesAtuais = resultado ? ACOES[resultado.perfil] : [];

  return (
    <div className="min-h-screen" style={{ background: "#0A0A0A", color: "#F5F0E8", fontFamily: "'Georgia', serif" }}>

      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(201,168,76,0.15)", padding: "20px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div style={{ width: "32px", height: "32px", border: "1.5px solid #C9A84C", borderRadius: "3px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#C9A84C", fontSize: "16px" }}>⬡</span>
          </div>
          <div>
            <div style={{ color: "#C9A84C", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase" }}>Comunidade</div>
            <div style={{ color: "#F5F0E8", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Guardiões</div>
          </div>
        </a>
      </div>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 24px" }}>

        {/* ─── INTRO ─────────────────────────────────────────────────────────── */}
        {fase === "intro" && (
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#C9A84C", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "16px" }}>Diagnóstico Gratuito</p>
            <h1 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 300, lineHeight: 1.2, marginBottom: "24px" }}>
              O Teste do<br /><em style={{ color: "#C9A84C" }}>Médico Esgotado</em>
            </h1>
            <p style={{ color: "rgba(245,240,232,0.6)", fontSize: "16px", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto 32px" }}>
              18 perguntas. 5 minutos. Um diagnóstico honesto sobre os 6 territórios que determinam se você está construindo um legado — ou sobrevivendo.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
              {["TEMPO", "CORPO", "SAÚDE", "FAMÍLIA", "NEGÓCIO", "PROPÓSITO"].map(t => (
                <div key={t} style={{ textAlign: "center" }}>
                  <div style={{ width: "40px", height: "40px", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "50%", margin: "0 auto 8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: "8px", height: "8px", background: "#C9A84C", borderRadius: "50%" }} />
                  </div>
                  <div style={{ fontSize: "9px", letterSpacing: "0.2em", color: "rgba(245,240,232,0.4)" }}>{t}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setFase("quiz")}
              style={{ background: "#C9A84C", color: "#0A0A0A", border: "none", padding: "16px 40px", borderRadius: "4px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}
            >
              INICIAR DIAGNÓSTICO →
            </button>
            <p style={{ color: "rgba(245,240,232,0.3)", fontSize: "12px", marginTop: "16px" }}>Gratuito · Resultado enviado por email · Sem spam</p>
          </div>
        )}

        {/* ─── QUIZ ──────────────────────────────────────────────────────────── */}
        {fase === "quiz" && p && (
          <div>
            {/* Progresso */}
            <div style={{ marginBottom: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "rgba(245,240,232,0.4)", fontSize: "11px", letterSpacing: "0.2em" }}>
                  PERGUNTA {perguntaAtual + 1} DE {PERGUNTAS.length}
                </span>
                <span style={{ color: "#C9A84C", fontSize: "11px", letterSpacing: "0.2em" }}>
                  TERRITÓRIO: {p.territorio}
                </span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "4px", height: "3px" }}>
                <div style={{ background: "#C9A84C", height: "100%", width: `${progresso}%`, borderRadius: "4px", transition: "width 0.3s ease" }} />
              </div>
            </div>

            {/* Pergunta */}
            <h2 style={{ fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 300, lineHeight: 1.4, marginBottom: "32px" }}>
              {p.pergunta}
            </h2>

            {/* Opções */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {p.opcoes.map((opcao, i) => (
                <button
                  key={i}
                  onClick={() => responderPergunta(i)}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(201,168,76,0.15)",
                    borderRadius: "6px",
                    padding: "16px 20px",
                    color: "#F5F0E8",
                    fontSize: "14px",
                    lineHeight: 1.5,
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,168,76,0.08)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,168,76,0.4)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,168,76,0.15)";
                  }}
                >
                  <span style={{ flexShrink: 0, width: "24px", height: "24px", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "#C9A84C" }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opcao}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─── CAPTURA ───────────────────────────────────────────────────────── */}
        {fase === "captura" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div style={{ width: "60px", height: "60px", border: "1.5px solid #C9A84C", borderRadius: "50%", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#C9A84C", fontSize: "24px" }}>✓</span>
              </div>
              <h2 style={{ fontSize: "28px", fontWeight: 300, marginBottom: "12px" }}>
                Diagnóstico <em style={{ color: "#C9A84C" }}>concluído.</em>
              </h2>
              <p style={{ color: "rgba(245,240,232,0.6)", fontSize: "15px", lineHeight: 1.6 }}>
                Preencha os dados abaixo para receber o seu resultado completo por email — com as 5 ações prioritárias personalizadas para o seu perfil.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { key: "nome", label: "Nome completo *", placeholder: "Dr(a). Seu Nome", type: "text" },
                { key: "email", label: "Email *", placeholder: "seu@email.com", type: "email" },
                { key: "telefone", label: "WhatsApp / Telefone *", placeholder: "+55 (11) 99999-9999", type: "tel" },
                { key: "especialidade", label: "Especialidade médica", placeholder: "Ex: Cardiologia, Clínica Geral...", type: "text" },
              ].map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label style={{ display: "block", color: "rgba(245,240,232,0.5)", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "8px" }}>{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                    required={key !== "especialidade"}
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(201,168,76,0.2)",
                      borderRadius: "4px",
                      padding: "14px 16px",
                      color: "#F5F0E8",
                      fontSize: "15px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={submitMutation.isPending}
                style={{
                  background: submitMutation.isPending ? "rgba(201,168,76,0.5)" : "#C9A84C",
                  color: "#0A0A0A",
                  border: "none",
                  padding: "16px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  cursor: submitMutation.isPending ? "not-allowed" : "pointer",
                  marginTop: "8px",
                }}
              >
                {submitMutation.isPending ? "ENVIANDO..." : "VER MEU RESULTADO →"}
              </button>
              <p style={{ color: "rgba(245,240,232,0.3)", fontSize: "11px", textAlign: "center" }}>
                Seus dados são confidenciais. Sem spam. Resultado enviado por email em segundos.
              </p>
            </form>
          </div>
        )}

        {/* ─── RESULTADO ─────────────────────────────────────────────────────── */}
        {fase === "resultado" && resultado && perfilAtual && (
          <div>
            {/* Score */}
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <p style={{ color: "#C9A84C", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "16px" }}>Seu Diagnóstico</p>
              <div style={{ fontSize: "80px", fontWeight: 700, color: perfilAtual.cor, lineHeight: 1 }}>{resultado.escore}</div>
              <div style={{ color: "rgba(245,240,232,0.4)", fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "16px" }}>pontos de 100</div>
              <div style={{ display: "inline-block", padding: "8px 24px", border: `1px solid ${perfilAtual.cor}40`, borderRadius: "4px", background: perfilAtual.bg }}>
                <span style={{ color: perfilAtual.cor, fontSize: "14px", fontWeight: 600, letterSpacing: "0.1em" }}>{resultado.titulo.toUpperCase()}</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "4px", height: "6px", overflow: "hidden", marginTop: "24px" }}>
                <div style={{ background: perfilAtual.cor, height: "100%", width: `${resultado.escore}%`, borderRadius: "4px" }} />
              </div>
            </div>

            {/* O que significa */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", padding: "24px", marginBottom: "24px" }}>
              <h3 style={{ color: "#C9A84C", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "16px" }}>O QUE ISSO SIGNIFICA</h3>
              <p style={{ color: "rgba(245,240,232,0.8)", fontSize: "15px", lineHeight: 1.7, margin: 0 }}>{perfilAtual.descricao}</p>
            </div>

            {/* 5 Ações */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", padding: "24px", marginBottom: "32px" }}>
              <h3 style={{ color: "#C9A84C", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "20px" }}>SUAS 5 AÇÕES PRIORITÁRIAS</h3>
              {acoesAtuais.map((acao, i) => (
                <div key={i} style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                  <div style={{ flexShrink: 0, width: "28px", height: "28px", border: "1px solid rgba(201,168,76,0.4)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#C9A84C", fontSize: "12px", fontWeight: 700 }}>{i + 1}</span>
                  </div>
                  <p style={{ color: "rgba(245,240,232,0.8)", fontSize: "14px", lineHeight: 1.6, margin: 0, paddingTop: "4px" }}>{acao}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "rgba(245,240,232,0.5)", fontSize: "13px", marginBottom: "20px" }}>O próximo passo começa aqui:</p>
              <a
                href="/desafio"
                style={{ display: "inline-block", background: "#C9A84C", color: "#0A0A0A", textDecoration: "none", padding: "16px 40px", borderRadius: "4px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}
              >
                ACESSAR O DESAFIO GUARDIÃO 21 DIAS →
              </a>
              <p style={{ color: "rgba(245,240,232,0.3)", fontSize: "12px", marginTop: "16px" }}>
                Resultado completo enviado para o seu email ✓
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
