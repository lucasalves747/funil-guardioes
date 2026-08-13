import { useEffect, useState } from "react";

// Coloque o PDF da Esteira Completa em site/public/ com este nome.
const PDF_URL = "/Esteira_Guardioes.pdf";

export default function Obrigado() {
  const [nome, setNome] = useState("Doutor(a)");
  const [confettiDone, setConfettiDone] = useState(false);

  useEffect(() => {
    // Pegar nome da URL
    const params = new URLSearchParams(window.location.search);
    const n = params.get("nome");
    if (n) setNome(n.split(" ")[0]);
    // Simular confetti com animação CSS
    setTimeout(() => setConfettiDone(true), 3000);
  }, []);

  return (
    <div style={{ background: "#0A0A0A", color: "#F5F0E8", fontFamily: "'Georgia', serif", minHeight: "100vh" }}>

      {/* Animação de celebração */}
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        .fade-in { animation: fadeInUp 0.6s ease forwards; }
        .fade-in-1 { animation: fadeInUp 0.6s ease 0.1s both; }
        .fade-in-2 { animation: fadeInUp 0.6s ease 0.3s both; }
        .fade-in-3 { animation: fadeInUp 0.6s ease 0.5s both; }
        .fade-in-4 { animation: fadeInUp 0.6s ease 0.7s both; }
        .pulse-btn { animation: pulse 2s ease-in-out infinite; }
        .shimmer-text {
          background: linear-gradient(90deg, #C9A84C 0%, #F5E6A3 50%, #C9A84C 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 2s linear infinite;
        }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(201,168,76,0.15)", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div style={{ width: "30px", height: "30px", border: "1.5px solid #C9A84C", borderRadius: "3px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#C9A84C", fontSize: "14px" }}>⬡</span>
          </div>
          <span style={{ color: "#F5F0E8", fontSize: "13px" }}>Dr. Santiago Vecina</span>
        </a>
      </div>

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "60px 24px" }}>

        {/* ─── CONFIRMAÇÃO ─────────────────────────────────────────────── */}
        <div className="fade-in" style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ fontSize: "72px", marginBottom: "16px" }}>🎉</div>
          <p style={{ color: "#C9A84C", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "12px" }}>INSCRIÇÃO CONFIRMADA</p>
          <h1 style={{ fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 300, lineHeight: 1.2, marginBottom: "16px" }}>
            Bem-vindo(a) ao Desafio,<br />
            <span className="shimmer-text">{nome}.</span>
          </h1>
          <p style={{ color: "rgba(245,240,232,0.7)", fontSize: "16px", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto" }}>
            Você acabou de tomar a decisão mais importante dos últimos meses. Agora é hora de agir.
          </p>
        </div>

        {/* ─── DOWNLOAD DO PDF ─────────────────────────────────────────── */}
        <div className="fade-in-1" style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: "12px", padding: "32px", marginBottom: "32px", textAlign: "center" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>📄</div>
          <h3 style={{ color: "#F5F0E8", fontSize: "20px", fontWeight: 300, marginBottom: "8px" }}>Seu material está pronto</h3>
          <p style={{ color: "rgba(245,240,232,0.6)", fontSize: "14px", marginBottom: "24px" }}>
            Clique abaixo para baixar a Esteira Completa da Comunidade Guardiões — o guia que vai orientar toda a sua jornada.
          </p>
          <a
            href={PDF_URL}
            download="Esteira_Guardioes_Dr_Santiago.pdf"
            className="pulse-btn"
            style={{ display: "inline-block", background: "#C9A84C", color: "#0A0A0A", textDecoration: "none", padding: "16px 40px", borderRadius: "4px", fontSize: "13px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}
          >
            ⬇ BAIXAR MEU MATERIAL AGORA
          </a>
          <p style={{ color: "rgba(245,240,232,0.3)", fontSize: "11px", marginTop: "12px" }}>
            PDF · 14 páginas · Acesso imediato
          </p>
        </div>

        {/* ─── PRÓXIMOS PASSOS ─────────────────────────────────────────── */}
        <div className="fade-in-2" style={{ marginBottom: "32px" }}>
          <p style={{ color: "rgba(245,240,232,0.4)", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "20px" }}>SEUS PRÓXIMOS 3 PASSOS</p>

          {[
            {
              numero: "01",
              titulo: "Verifique seu email",
              desc: "Enviamos um email de confirmação com todos os detalhes de acesso ao Desafio, link do grupo de WhatsApp e cronograma das 3 lives ao vivo com o Dr. Santiago.",
              cor: "#C9A84C",
            },
            {
              numero: "02",
              titulo: "Entre no grupo do WhatsApp",
              desc: "O link está no email. O grupo é onde acontece a comunidade — accountability, dúvidas, celebrações e conexão com médicos na mesma jornada.",
              cor: "#3B82F6",
            },
            {
              numero: "03",
              titulo: "Assista a Aula 1 hoje",
              desc: "Não espere amanhã. A Aula 1 — A Auditoria da Agenda — leva 12 minutos e vai revelar exatamente onde as suas horas estão indo. É o primeiro passo real.",
              cor: "#10B981",
            },
          ].map((step, i) => (
            <div key={i} style={{ display: "flex", gap: "20px", marginBottom: "20px", padding: "20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px" }}>
              <div style={{ flexShrink: 0, width: "40px", height: "40px", border: `1.5px solid ${step.cor}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: step.cor, fontSize: "13px", fontWeight: 700 }}>{step.numero}</span>
              </div>
              <div>
                <div style={{ color: "#F5F0E8", fontSize: "15px", fontWeight: 600, marginBottom: "6px" }}>{step.titulo}</div>
                <div style={{ color: "rgba(245,240,232,0.65)", fontSize: "14px", lineHeight: 1.6 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ─── MENSAGEM PESSOAL DO DR. SANTIAGO ────────────────────────── */}
        <div className="fade-in-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "28px", marginBottom: "32px" }}>
          <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <div style={{ width: "48px", height: "48px", border: "1.5px solid rgba(201,168,76,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>🩺</div>
            <div>
              <div style={{ color: "#C9A84C", fontSize: "12px", letterSpacing: "0.1em", marginBottom: "8px" }}>UMA MENSAGEM DO DR. SANTIAGO</div>
              <p style={{ color: "rgba(245,240,232,0.8)", fontSize: "15px", lineHeight: 1.7, margin: "0 0 12px", fontStyle: "italic" }}>
                "Você acabou de fazer o que a maioria dos médicos adia por meses: decidiu. Não amanhã. Não depois do plantão. Agora.
              </p>
              <p style={{ color: "rgba(245,240,232,0.8)", fontSize: "15px", lineHeight: 1.7, margin: "0 0 12px", fontStyle: "italic" }}>
                Nos próximos 21 dias, vou estar com você. Não como coach. Como colega que passou pelo mesmo caminho e encontrou a saída.
              </p>
              <p style={{ color: "rgba(245,240,232,0.8)", fontSize: "15px", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>
                A única coisa que peço: faça. Não apenas assista. Faça."
              </p>
              <div style={{ marginTop: "16px" }}>
                <div style={{ color: "#F5F0E8", fontSize: "14px", fontWeight: 600 }}>Dr. Santiago Vecina</div>
                <div style={{ color: "rgba(245,240,232,0.4)", fontSize: "12px" }}>Williams Island, Miami</div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── UPSELL — COMUNIDADE GUARDIÕES ───────────────────────────── */}
        <div className="fade-in-4" style={{ background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "12px", padding: "28px", marginBottom: "32px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <span style={{ fontSize: "28px", flexShrink: 0 }}>⬡</span>
            <div>
              <p style={{ color: "#8B5CF6", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "8px" }}>OFERTA EXCLUSIVA PARA NOVOS MEMBROS</p>
              <h3 style={{ color: "#F5F0E8", fontSize: "18px", fontWeight: 300, marginBottom: "8px" }}>
                Após completar o Desafio, você recebe o 1º mês na <em style={{ color: "#8B5CF6" }}>Comunidade Guardiões</em> gratuitamente.
              </h3>
              <p style={{ color: "rgba(245,240,232,0.65)", fontSize: "14px", lineHeight: 1.6, marginBottom: "16px" }}>
                Aulas mensais ao vivo, grupo privado de médicos de alta performance, acesso ao evento METAMORFOSE em Miami e muito mais. Valor normal: R$197/mês.
              </p>
              <a href="/masterclass" style={{ color: "#8B5CF6", fontSize: "13px", textDecoration: "none", borderBottom: "1px solid rgba(139,92,246,0.4)" }}>
                Saiba mais sobre a Comunidade Guardiões →
              </a>
            </div>
          </div>
        </div>

        {/* ─── REDES SOCIAIS ────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", padding: "32px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p style={{ color: "rgba(245,240,232,0.4)", fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "16px" }}>SIGA O DR. SANTIAGO</p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { nome: "Instagram", link: "https://www.instagram.com/drsantiagovecina/", icone: "📸" },
              { nome: "YouTube", link: "https://www.youtube.com/@drsantiagovecina", icone: "▶️" },
              { nome: "Site", link: "https://www.drsantiagovecina.com", icone: "🌐" },
            ].map(r => (
              <a key={r.nome} href={r.link} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", textDecoration: "none", color: "rgba(245,240,232,0.7)", fontSize: "13px" }}>
                <span>{r.icone}</span> {r.nome}
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
