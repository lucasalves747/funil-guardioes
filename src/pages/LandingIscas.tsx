import { useState } from "react";
import { useLocation } from "wouter";

// ─── Dados das Iscas ──────────────────────────────────────────────────────────
const ISCAS = {
  diagnostico: {
    slug: "diagnostico",
    tag: "DIAGNÓSTICO GRATUITO",
    headline: "Você cuida de centenas de pacientes por ano.",
    headlineDestaque: "Quem cuida de você?",
    subheadline: "18 perguntas. 5 minutos. Um diagnóstico honesto sobre os 6 territórios que determinam se você está construindo um legado — ou apenas sobrevivendo.",
    dor1: "Você dorme, mas acorda cansado. Não é insônia — é o seu sistema nervoso que nunca desliga.",
    dor2: "Você está presente, mas ausente. Sua família sente que você está em outro lugar mesmo quando está ao lado deles.",
    dor3: "Você perdeu o prazer pela medicina. Não odeio o que faço. Só não sinto mais aquela centelha.",
    gatilho: "Mais de 2.300 médicos já fizeram esse diagnóstico. O resultado mais comum? Guardião em Alerta — e a maioria não sabia.",
    entrega: "Resultado personalizado por email com diagnóstico dos 6 territórios e 5 ações prioritárias para o seu perfil.",
    cta: "FAZER O DIAGNÓSTICO GRATUITO →",
    link: "/diagnostico",
    cor: "#C9A84C",
    icone: "🩺",
  },
  calculadora: {
    slug: "calculadora",
    tag: "CALCULADORA GRATUITA",
    headline: "Você cobra R$300 por consulta.",
    headlineDestaque: "Mas quanto você realmente ganha por hora?",
    subheadline: "A maioria dos médicos descobre que ganha 40 a 60% menos do que acredita — quando inclui as horas de administração, plantão não remunerado e reuniões.",
    dor1: "Você trabalha 60 horas por semana e sente que o esforço não se reflete no resultado financeiro.",
    dor2: "Você delega pouco porque acha que ninguém faz tão bem quanto você — e isso está te custando caro.",
    dor3: "Você nunca parou para calcular o custo real do seu tempo. Até hoje.",
    gatilho: "O Dr. Rodrigo descobriu que sua hora real valia R$87 — enquanto cobrava R$350 por consulta. Em 6 meses, dobrou a receita trabalhando menos.",
    entrega: "Cálculo personalizado da sua hora real com análise do gap e 5 ações para otimizar o seu modelo de negócio.",
    cta: "CALCULAR MINHA HORA REAL →",
    link: "/calculadora",
    cor: "#3B82F6",
    icone: "📊",
  },
  ebook: {
    slug: "ebook",
    tag: "EBOOK GRATUITO",
    headline: "Você não tem falta de tempo.",
    headlineDestaque: "Você tem falta de sistema.",
    subheadline: "As 10 horas que você 'não tem' existem na sua semana. Estão escondidas em micro-tarefas que parecem urgentes mas não são importantes. Este ebook te mostra onde estão.",
    dor1: "Você cancela treinos, jantares em família e momentos de descanso porque 'não tem tempo'.",
    dor2: "Você trabalha nos fins de semana e ainda sente que está atrasado.",
    dor3: "Você sabe que precisa mudar — mas não sabe por onde começar.",
    gatilho: "4 capítulos. 47 páginas. O método que médicos de alta performance usam para recuperar 8 a 12 horas semanais sem reduzir receita.",
    entrega: "Ebook completo em PDF com 4 capítulos, exercícios práticos e o Protocolo das 10 Horas.",
    cta: "BAIXAR O EBOOK GRATUITO →",
    link: "/ebook",
    cor: "#10B981",
    icone: "📚",
  },
  masterclass: {
    slug: "masterclass",
    tag: "MASTERCLASS GRATUITA",
    headline: "90 minutos que podem mudar",
    headlineDestaque: "a sua relação com o trabalho, a família e o seu próprio corpo.",
    subheadline: "O Paradoxo do Guardião: Como Médicos de Alta Performance Reconstroem Tudo Sem Parar de Crescer.",
    dor1: "Você chegou ao topo e descobriu que o topo não é o que imaginava.",
    dor2: "Você tem sucesso profissional e vazio pessoal — e não sabe como equilibrar os dois.",
    dor3: "Você quer crescer, mas não quer pagar o preço que pagou até aqui.",
    gatilho: "Ao vivo. Com perguntas e respostas. Dr. Santiago Vecina — médico, autor de 5 livros, Ultraman Finisher, morador de Williams Island, Miami.",
    entrega: "Acesso ao vivo + gravação por 7 dias + Guardian Journal Digital + Biblioteca de Templates.",
    cta: "GARANTIR MINHA VAGA GRATUITA →",
    link: "/masterclass",
    cor: "#8B5CF6",
    icone: "🎯",
  },
};

type IscaKey = keyof typeof ISCAS;

// ─── Componente de Landing Page Individual ────────────────────────────────────
function LandingPage({ isca }: { isca: typeof ISCAS[IscaKey] }) {
  const [, navigate] = useLocation();

  return (
    <div style={{ background: "#0A0A0A", color: "#F5F0E8", fontFamily: "'Georgia', serif", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(201,168,76,0.15)", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div style={{ width: "30px", height: "30px", border: "1.5px solid #C9A84C", borderRadius: "3px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#C9A84C", fontSize: "14px" }}>⬡</span>
          </div>
          <span style={{ color: "#F5F0E8", fontSize: "13px", letterSpacing: "0.05em" }}>Dr. Santiago Vecina</span>
        </a>
        <div style={{ color: "rgba(245,240,232,0.4)", fontSize: "11px", letterSpacing: "0.2em" }}>GUARDIÕES</div>
      </div>

      {/* HERO */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "60px 24px 40px", textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "6px 16px", border: `1px solid ${isca.cor}40`, borderRadius: "20px", background: `${isca.cor}10`, marginBottom: "24px" }}>
          <span style={{ color: isca.cor, fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase" }}>{isca.tag}</span>
        </div>

        <h1 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 300, lineHeight: 1.15, marginBottom: "8px" }}>
          {isca.headline}
        </h1>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 300, lineHeight: 1.15, color: isca.cor, fontStyle: "italic", marginBottom: "24px" }}>
          {isca.headlineDestaque}
        </h1>

        <p style={{ fontSize: "clamp(15px, 2.5vw, 18px)", color: "rgba(245,240,232,0.7)", lineHeight: 1.7, maxWidth: "600px", margin: "0 auto 40px" }}>
          {isca.subheadline}
        </p>

        <button
          onClick={() => navigate(isca.link)}
          style={{ background: isca.cor, color: "#0A0A0A", border: "none", padding: "18px 48px", borderRadius: "4px", fontSize: "13px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", marginBottom: "12px", display: "block", width: "100%", maxWidth: "480px", margin: "0 auto 12px" }}
        >
          {isca.cta}
        </button>
        <p style={{ color: "rgba(245,240,232,0.3)", fontSize: "12px" }}>100% gratuito · Sem cartão · Resultado imediato</p>
      </div>

      {/* PROVA SOCIAL */}
      <div style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "20px 24px", textAlign: "center" }}>
        <p style={{ color: "rgba(245,240,232,0.5)", fontSize: "13px", margin: 0 }}>
          <span style={{ color: isca.cor, fontWeight: 600 }}>⭐⭐⭐⭐⭐</span> &nbsp;
          Utilizado por mais de 2.300 médicos no Brasil, EUA e Europa
        </p>
      </div>

      {/* DOR */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "60px 24px" }}>
        <p style={{ color: "rgba(245,240,232,0.4)", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", textAlign: "center", marginBottom: "40px" }}>VOCÊ SE RECONHECE NISSO?</p>

        {[isca.dor1, isca.dor2, isca.dor3].map((dor, i) => (
          <div key={i} style={{ display: "flex", gap: "20px", marginBottom: "24px", padding: "20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px" }}>
            <div style={{ flexShrink: 0, width: "32px", height: "32px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#EF4444", fontSize: "14px" }}>✗</span>
            </div>
            <p style={{ color: "rgba(245,240,232,0.75)", fontSize: "15px", lineHeight: 1.6, margin: 0, paddingTop: "4px" }}>{dor}</p>
          </div>
        ))}

        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <p style={{ color: "rgba(245,240,232,0.5)", fontSize: "15px", fontStyle: "italic" }}>
            Se você se reconheceu em pelo menos um desses pontos — o que vem a seguir foi feito para você.
          </p>
        </div>
      </div>

      {/* AUTORIDADE */}
      <div style={{ background: "rgba(201,168,76,0.03)", borderTop: "1px solid rgba(201,168,76,0.1)", borderBottom: "1px solid rgba(201,168,76,0.1)", padding: "60px 24px" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", display: "flex", gap: "40px", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: "0 0 auto", textAlign: "center" }}>
            <div style={{ width: "100px", height: "100px", border: "2px solid rgba(201,168,76,0.3)", borderRadius: "50%", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" }}>
              🩺
            </div>
            <div style={{ color: "#C9A84C", fontSize: "11px", letterSpacing: "0.2em" }}>DR. SANTIAGO VECINA</div>
          </div>
          <div style={{ flex: 1, minWidth: "240px" }}>
            <h3 style={{ color: "#F5F0E8", fontSize: "20px", fontWeight: 300, marginBottom: "12px" }}>
              Médico. Autor de 5 livros. <em style={{ color: "#C9A84C" }}>Ultraman Finisher.</em>
            </h3>
            <p style={{ color: "rgba(245,240,232,0.65)", fontSize: "14px", lineHeight: 1.7, margin: 0 }}>
              Dois burnouts superados. Casamento restaurado. Williams Island, Miami. Mais de 15 anos de clínica. Mentor de médicos no Brasil, EUA e Europa. Criador da Comunidade Guardiões.
            </p>
            <div style={{ display: "flex", gap: "20px", marginTop: "16px", flexWrap: "wrap" }}>
              {["5 Livros", "2× Ultraman", "15+ Anos", "Miami"].map(c => (
                <div key={c} style={{ textAlign: "center" }}>
                  <div style={{ color: "#C9A84C", fontSize: "16px", fontWeight: 700 }}>{c.split(" ")[0]}</div>
                  <div style={{ color: "rgba(245,240,232,0.4)", fontSize: "10px", letterSpacing: "0.1em" }}>{c.split(" ").slice(1).join(" ")}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* O QUE VOCÊ RECEBE */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "60px 24px" }}>
        <p style={{ color: "rgba(245,240,232,0.4)", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", textAlign: "center", marginBottom: "32px" }}>O QUE VOCÊ RECEBE</p>

        <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${isca.cor}30`, borderRadius: "12px", padding: "32px", textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>{isca.icone}</div>
          <p style={{ color: "rgba(245,240,232,0.8)", fontSize: "16px", lineHeight: 1.7, margin: "0 0 24px" }}>{isca.entrega}</p>
          <div style={{ display: "inline-block", padding: "6px 20px", background: `${isca.cor}15`, border: `1px solid ${isca.cor}30`, borderRadius: "4px" }}>
            <span style={{ color: isca.cor, fontSize: "13px", fontWeight: 600 }}>GRATUITO — SEM CARTÃO DE CRÉDITO</span>
          </div>
        </div>

        {/* Gatilho de prova social */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", padding: "20px", marginBottom: "32px" }}>
          <p style={{ color: "rgba(245,240,232,0.6)", fontSize: "14px", lineHeight: 1.6, margin: 0, fontStyle: "italic", textAlign: "center" }}>
            "{isca.gatilho}"
          </p>
        </div>

        {/* CTA Final */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => navigate(isca.link)}
            style={{ background: isca.cor, color: "#0A0A0A", border: "none", padding: "18px 48px", borderRadius: "4px", fontSize: "13px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", marginBottom: "12px", display: "block", width: "100%", maxWidth: "480px", margin: "0 auto 12px" }}
          >
            {isca.cta}
          </button>
          <p style={{ color: "rgba(245,240,232,0.3)", fontSize: "12px" }}>100% gratuito · Seus dados são confidenciais · Sem spam</p>
        </div>
      </div>

      {/* DEPOIMENTOS */}
      <div style={{ background: "rgba(255,255,255,0.01)", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "60px 24px" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <p style={{ color: "rgba(245,240,232,0.4)", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", textAlign: "center", marginBottom: "32px" }}>O QUE MÉDICOS ESTÃO DIZENDO</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            {[
              { texto: "Nunca tinha parado para calcular isso. O diagnóstico me mostrou exatamente onde eu estava errando.", nome: "Dr. Rafael M.", cidade: "São Paulo, SP", esp: "Cardiologista" },
              { texto: "Em 3 semanas depois do diagnóstico, já tinha delegado 4 tarefas e recuperado 10 horas por semana.", nome: "Dra. Camila F.", cidade: "Belo Horizonte, MG", esp: "Pediatra" },
              { texto: "O Dr. Santiago fala como colega, não como coach. Isso faz toda a diferença.", nome: "Dr. André L.", cidade: "Miami, FL", esp: "Ortopedista" },
            ].map((d, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", padding: "20px" }}>
                <p style={{ color: "rgba(245,240,232,0.75)", fontSize: "14px", lineHeight: 1.6, margin: "0 0 16px", fontStyle: "italic" }}>"{d.texto}"</p>
                <div>
                  <div style={{ color: "#C9A84C", fontSize: "13px", fontWeight: 600 }}>{d.nome}</div>
                  <div style={{ color: "rgba(245,240,232,0.4)", fontSize: "11px" }}>{d.esp} · {d.cidade}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "60px 24px" }}>
        <p style={{ color: "rgba(245,240,232,0.4)", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", textAlign: "center", marginBottom: "32px" }}>PERGUNTAS FREQUENTES</p>
        {[
          { p: "É realmente gratuito?", r: "Sim. Sem cartão de crédito, sem trial, sem pegadinha. O resultado chega no seu email em segundos." },
          { p: "Quanto tempo leva?", r: "5 minutos para o diagnóstico. O resultado é entregue imediatamente por email." },
          { p: "Meus dados são seguros?", r: "Seus dados são confidenciais e nunca serão compartilhados com terceiros. Você pode solicitar a exclusão a qualquer momento." },
          { p: "Para quem é isso?", r: "Para médicos brasileiros que trabalham 40h+ por semana e sentem que o esforço não se reflete na qualidade de vida." },
        ].map((faq, i) => (
          <div key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "20px 0" }}>
            <p style={{ color: "#F5F0E8", fontSize: "15px", fontWeight: 600, margin: "0 0 8px" }}>{faq.p}</p>
            <p style={{ color: "rgba(245,240,232,0.6)", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>{faq.r}</p>
          </div>
        ))}
      </div>

      {/* CTA Final Fixo */}
      <div style={{ position: "sticky", bottom: 0, background: "rgba(10,10,10,0.95)", backdropFilter: "blur(10px)", borderTop: "1px solid rgba(201,168,76,0.2)", padding: "16px 24px", textAlign: "center" }}>
        <button
          onClick={() => navigate(isca.link)}
          style={{ background: isca.cor, color: "#0A0A0A", border: "none", padding: "14px 40px", borderRadius: "4px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}
        >
          {isca.cta}
        </button>
      </div>

    </div>
  );
}

// ─── Hub de Iscas (página /iscas) ─────────────────────────────────────────────
export function IscasHub() {
  const [, navigate] = useLocation();

  return (
    <div style={{ background: "#0A0A0A", color: "#F5F0E8", fontFamily: "'Georgia', serif", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(201,168,76,0.15)", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div style={{ width: "30px", height: "30px", border: "1.5px solid #C9A84C", borderRadius: "3px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#C9A84C", fontSize: "14px" }}>⬡</span>
          </div>
          <span style={{ color: "#F5F0E8", fontSize: "13px", letterSpacing: "0.05em" }}>Dr. Santiago Vecina</span>
        </a>
      </div>

      {/* Hero */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "60px 24px 40px", textAlign: "center" }}>
        <p style={{ color: "#C9A84C", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "16px" }}>RECURSOS GRATUITOS</p>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 300, lineHeight: 1.2, marginBottom: "16px" }}>
          Escolha por onde<br /><em style={{ color: "#C9A84C" }}>começar a sua transformação.</em>
        </h1>
        <p style={{ color: "rgba(245,240,232,0.6)", fontSize: "16px", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto" }}>
          4 recursos gratuitos criados especificamente para médicos que trabalham 40h+ por semana e querem construir uma vida alinhada com o que realmente importa.
        </p>
      </div>

      {/* Cards das Iscas */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px 80px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "24px" }}>
        {Object.values(ISCAS).map(isca => (
          <div
            key={isca.slug}
            style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${isca.cor}20`, borderRadius: "12px", padding: "32px", cursor: "pointer", transition: "all 0.2s ease" }}
            onClick={() => navigate(`/isca/${isca.slug}`)}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${isca.cor}50`; (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${isca.cor}20`; (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.02)"; }}
          >
            <div style={{ display: "inline-block", padding: "4px 12px", border: `1px solid ${isca.cor}30`, borderRadius: "20px", background: `${isca.cor}10`, marginBottom: "16px" }}>
              <span style={{ color: isca.cor, fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase" }}>{isca.tag}</span>
            </div>
            <h3 style={{ color: "#F5F0E8", fontSize: "20px", fontWeight: 300, lineHeight: 1.3, marginBottom: "12px" }}>
              {isca.headline}<br />
              <em style={{ color: isca.cor }}>{isca.headlineDestaque}</em>
            </h3>
            <p style={{ color: "rgba(245,240,232,0.55)", fontSize: "14px", lineHeight: 1.6, marginBottom: "24px" }}>
              {isca.subheadline}
            </p>
            <button
              style={{ background: "transparent", color: isca.cor, border: `1px solid ${isca.cor}`, padding: "10px 24px", borderRadius: "4px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", width: "100%" }}
            >
              {isca.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Roteador de Landing Pages ────────────────────────────────────────────────
export default function LandingIscas({ params }: { params?: { isca?: string } }) {
  const iscaKey = (params?.isca || "") as IscaKey;
  const isca = ISCAS[iscaKey];

  if (!isca) return <IscasHub />;
  return <LandingPage isca={isca} />;
}
