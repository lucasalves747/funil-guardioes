import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// ─── Countdown Timer ──────────────────────────────────────────────────────────
function useCountdown(hours: number) {
  const [time, setTime] = useState(hours * 3600);
  useEffect(() => {
    const t = setInterval(() => setTime(p => Math.max(0, p - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(time / 3600);
  const m = Math.floor((time % 3600) / 60);
  const s = time % 60;
  return { h, m, s, expired: time === 0 };
}

function CountdownBlock({ value, label }: { value: number; label: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "6px", padding: "12px 16px", minWidth: "60px" }}>
        <div style={{ color: "#C9A84C", fontSize: "28px", fontWeight: 700, lineHeight: 1, fontFamily: "monospace" }}>
          {String(value).padStart(2, "0")}
        </div>
      </div>
      <div style={{ color: "rgba(245,240,232,0.4)", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: "6px" }}>{label}</div>
    </div>
  );
}

// ─── Formulário de Inscrição ──────────────────────────────────────────────────
function FormInscricao({ preco }: { preco: string }) {
  const [form, setForm] = useState({ nome: "", email: "", telefone: "" });
  const [inscrito, setInscrito] = useState(false);

  const submitMutation = trpc.diagnostico.submitResultado.useMutation({
    onSuccess: () => {
      setInscrito(true);
      toast.success("Inscrição confirmada! Verifique seu email.");
    },
    onError: () => toast.error("Erro ao processar. Tente novamente."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.email || !form.telefone) {
      toast.error("Preencha todos os campos.");
      return;
    }
    // Usar o endpoint de diagnóstico para capturar o lead da masterclass
    submitMutation.mutate({
      nome: form.nome,
      email: form.email,
      telefone: form.telefone,
      especialidade: "Masterclass",
      escore: 50,
      respostas: { masterclass: 1 },
      evento: "masterclass",
    });
  };

  if (inscrito) {
    return (
      <div style={{ textAlign: "center", padding: "32px" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
        <h3 style={{ color: "#10B981", fontSize: "22px", fontWeight: 300, marginBottom: "12px" }}>Inscrição confirmada!</h3>
        <p style={{ color: "rgba(245,240,232,0.7)", fontSize: "15px", lineHeight: 1.6 }}>
          Enviamos os detalhes de acesso para o seu email. Fique atento — a masterclass começa em breve.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      {[
        { key: "nome", label: "Nome completo", placeholder: "Dr(a). Seu Nome", type: "text" },
        { key: "email", label: "Email", placeholder: "seu@email.com", type: "email" },
        { key: "telefone", label: "WhatsApp", placeholder: "+55 (11) 99999-9999", type: "tel" },
      ].map(({ key, label, placeholder, type }) => (
        <div key={key}>
          <label style={{ display: "block", color: "rgba(245,240,232,0.5)", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "6px" }}>{label} *</label>
          <input
            type={type}
            placeholder={placeholder}
            value={form[key as keyof typeof form]}
            onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
            required
            style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "4px", padding: "12px 14px", color: "#F5F0E8", fontSize: "15px", outline: "none", boxSizing: "border-box" }}
          />
        </div>
      ))}

      {/* Preço */}
      <div style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "8px", padding: "16px", textAlign: "center" }}>
        <div style={{ color: "rgba(245,240,232,0.4)", fontSize: "12px", textDecoration: "line-through", marginBottom: "4px" }}>De R$20,00</div>
        <div style={{ color: "#C9A84C", fontSize: "32px", fontWeight: 700, lineHeight: 1 }}>{preco}</div>
        <div style={{ color: "rgba(245,240,232,0.5)", fontSize: "12px", marginTop: "4px" }}>pagamento único · acesso imediato</div>
      </div>

      <button
        type="submit"
        disabled={submitMutation.isPending}
        style={{ background: submitMutation.isPending ? "rgba(201,168,76,0.5)" : "#C9A84C", color: "#0A0A0A", border: "none", padding: "18px", borderRadius: "4px", fontSize: "13px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", cursor: submitMutation.isPending ? "not-allowed" : "pointer" }}
      >
        {submitMutation.isPending ? "PROCESSANDO..." : `GARANTIR MINHA VAGA POR ${preco} →`}
      </button>

      <p style={{ color: "rgba(245,240,232,0.3)", fontSize: "11px", textAlign: "center" }}>
        🔒 Pagamento seguro · Seus dados são confidenciais · Garantia de 7 dias
      </p>
    </form>
  );
}

// ─── Landing Page Principal ───────────────────────────────────────────────────
export default function LandingMasterclass() {
  const { h, m, s, expired } = useCountdown(4); // 4 horas de urgência
  const preco = expired ? "R$20,00" : "R$1,99";

  return (
    <div style={{ background: "#0A0A0A", color: "#F5F0E8", fontFamily: "'Georgia', serif", minHeight: "100vh" }}>

      {/* Barra de Urgência */}
      {!expired && (
        <div style={{ background: "linear-gradient(90deg, #7C2D12, #C9A84C, #7C2D12)", padding: "10px 24px", textAlign: "center" }}>
          <p style={{ color: "#0A0A0A", fontSize: "13px", fontWeight: 700, margin: 0, letterSpacing: "0.05em" }}>
            ⚠️ OFERTA ESPECIAL: R$1,99 expira em &nbsp;
            <span style={{ fontFamily: "monospace" }}>{String(h).padStart(2,"0")}:{String(m).padStart(2,"0")}:{String(s).padStart(2,"0")}</span>
          </p>
        </div>
      )}

      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(201,168,76,0.15)", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div style={{ width: "30px", height: "30px", border: "1.5px solid #C9A84C", borderRadius: "3px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#C9A84C", fontSize: "14px" }}>⬡</span>
          </div>
          <span style={{ color: "#F5F0E8", fontSize: "13px" }}>Dr. Santiago Vecina</span>
        </a>
        <div style={{ color: "rgba(245,240,232,0.4)", fontSize: "11px", letterSpacing: "0.2em" }}>MASTERCLASS AO VIVO</div>
      </div>

      {/* HERO */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "60px 24px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "60px", alignItems: "start" }} className="masterclass-grid">

          {/* Coluna Esquerda */}
          <div>
            <div style={{ display: "inline-block", padding: "5px 14px", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "20px", background: "rgba(201,168,76,0.08)", marginBottom: "20px" }}>
              <span style={{ color: "#C9A84C", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase" }}>MASTERCLASS AO VIVO · 90 MINUTOS</span>
            </div>

            <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 300, lineHeight: 1.15, marginBottom: "16px" }}>
              O Paradoxo do Guardião:
            </h1>
            <h2 style={{ fontSize: "clamp(20px, 3vw, 32px)", fontWeight: 300, color: "#C9A84C", fontStyle: "italic", lineHeight: 1.3, marginBottom: "24px" }}>
              Como Médicos de Alta Performance Reconstroem Tudo Sem Parar de Crescer
            </h2>

            <p style={{ color: "rgba(245,240,232,0.7)", fontSize: "16px", lineHeight: 1.7, marginBottom: "32px" }}>
              Em 90 minutos ao vivo, o Dr. Santiago Vecina vai mostrar o método que ele usou para superar dois burnouts, restaurar o casamento, completar dois Ultraman e construir um negócio que funciona sem ele — sem abrir mão da excelência clínica.
            </p>

            {/* O que você vai aprender */}
            <div style={{ marginBottom: "32px" }}>
              <p style={{ color: "rgba(245,240,232,0.4)", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "16px" }}>O QUE VOCÊ VAI APRENDER</p>
              {[
                "Por que os 6 territórios do seu diagnóstico estão interligados — e por que resolver um sem os outros não funciona",
                "O Protocolo da Armadura Física para médicos que trabalham 60h+ por semana (sem precisar de academia cara)",
                "Como construir uma clínica que funciona sem você — sem demitir ninguém e sem perder receita",
                "O método para restaurar relacionamentos depois que o trabalho destruiu tudo",
                "A estratégia de conteúdo que transforma autoridade médica em renda recorrente",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                  <span style={{ color: "#C9A84C", flexShrink: 0, paddingTop: "2px" }}>✓</span>
                  <p style={{ color: "rgba(245,240,232,0.75)", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>{item}</p>
                </div>
              ))}
            </div>

            {/* Bônus */}
            <div style={{ background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "8px", padding: "20px", marginBottom: "32px" }}>
              <p style={{ color: "#C9A84C", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "12px" }}>BÔNUS INCLUSOS</p>
              {[
                "Guardian Journal Digital (valor: R$47)",
                "Biblioteca de Templates — Agenda, Checklist e Script (valor: R$37)",
                "Gravação da masterclass por 7 dias (valor: R$27)",
                "Acesso ao grupo exclusivo de Q&A no WhatsApp",
              ].map((bonus, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
                  <span style={{ color: "#C9A84C", fontSize: "12px" }}>🎁</span>
                  <span style={{ color: "rgba(245,240,232,0.7)", fontSize: "13px" }}>{bonus}</span>
                </div>
              ))}
              <div style={{ borderTop: "1px solid rgba(201,168,76,0.15)", marginTop: "12px", paddingTop: "12px" }}>
                <p style={{ color: "rgba(245,240,232,0.5)", fontSize: "12px", margin: 0 }}>
                  Valor total dos bônus: <span style={{ textDecoration: "line-through" }}>R$111</span> · Inclusos na inscrição
                </p>
              </div>
            </div>

            {/* Countdown */}
            {!expired && (
              <div style={{ marginBottom: "32px" }}>
                <p style={{ color: "rgba(245,240,232,0.4)", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "16px" }}>OFERTA ESPECIAL EXPIRA EM</p>
                <div style={{ display: "flex", gap: "12px" }}>
                  <CountdownBlock value={h} label="Horas" />
                  <div style={{ color: "#C9A84C", fontSize: "28px", fontWeight: 700, paddingTop: "12px" }}>:</div>
                  <CountdownBlock value={m} label="Minutos" />
                  <div style={{ color: "#C9A84C", fontSize: "28px", fontWeight: 700, paddingTop: "12px" }}>:</div>
                  <CountdownBlock value={s} label="Segundos" />
                </div>
              </div>
            )}

            {/* Autoridade */}
            <div style={{ display: "flex", gap: "16px", alignItems: "center", padding: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px" }}>
              <div style={{ width: "56px", height: "56px", border: "1.5px solid rgba(201,168,76,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>🩺</div>
              <div>
                <div style={{ color: "#F5F0E8", fontSize: "14px", fontWeight: 600 }}>Dr. Santiago Vecina</div>
                <div style={{ color: "rgba(245,240,232,0.5)", fontSize: "12px" }}>Médico · Autor de 5 livros · 2× Ultraman Finisher · Williams Island, Miami</div>
              </div>
            </div>
          </div>

          {/* Coluna Direita — Formulário */}
          <div style={{ position: "sticky", top: "20px" }}>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "12px", padding: "28px" }}>
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <p style={{ color: "#C9A84C", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "8px" }}>GARANTA SUA VAGA</p>
                <h3 style={{ color: "#F5F0E8", fontSize: "18px", fontWeight: 300, margin: 0 }}>
                  {expired ? "Inscrição — R$20,00" : "Oferta especial — R$1,99"}
                </h3>
                {!expired && (
                  <p style={{ color: "rgba(245,240,232,0.4)", fontSize: "12px", marginTop: "4px" }}>
                    Economize R$18,01 · Oferta por tempo limitado
                  </p>
                )}
              </div>
              <FormInscricao preco={preco} />
            </div>

            {/* Garantia */}
            <div style={{ textAlign: "center", marginTop: "16px", padding: "16px", background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: "8px" }}>
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>🛡️</div>
              <p style={{ color: "#10B981", fontSize: "13px", fontWeight: 600, margin: "0 0 4px" }}>Garantia de 7 dias</p>
              <p style={{ color: "rgba(245,240,232,0.5)", fontSize: "12px", margin: 0 }}>Se não agregar valor, devolvemos 100% sem perguntas.</p>
            </div>
          </div>

        </div>
      </div>

      {/* DEPOIMENTOS */}
      <div style={{ background: "rgba(255,255,255,0.01)", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "60px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <p style={{ color: "rgba(245,240,232,0.4)", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", textAlign: "center", marginBottom: "32px" }}>O QUE MÉDICOS DIZEM SOBRE O DR. SANTIAGO</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
            {[
              { texto: "A masterclass mudou a forma como eu vejo o meu tempo. Em 3 semanas, recuperei 10 horas por semana.", nome: "Dr. Rafael M.", esp: "Cardiologista", cidade: "São Paulo" },
              { texto: "Pela primeira vez, um médico falou sobre burnout sem romantizar o sacrifício. Foi libertador.", nome: "Dra. Camila F.", esp: "Pediatra", cidade: "Belo Horizonte" },
              { texto: "O Dr. Santiago fala como colega. Não como coach motivacional. Isso faz toda a diferença.", nome: "Dr. André L.", esp: "Ortopedista", cidade: "Miami, FL" },
              { texto: "Apliquei o protocolo de delegação no dia seguinte. Em 30 dias, minha clínica funcionou sem mim por uma semana inteira.", nome: "Dra. Fernanda R.", esp: "Ginecologista", cidade: "Rio de Janeiro" },
            ].map((d, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", padding: "20px" }}>
                <div style={{ color: "#C9A84C", marginBottom: "12px", fontSize: "14px" }}>⭐⭐⭐⭐⭐</div>
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
          { p: "Por que custa R$1,99?", r: "Porque quero que o preço nunca seja o motivo pelo qual você não transforma a sua vida. R$1,99 é uma decisão estratégica — não um desconto. Quem paga, aparece. Quem aparece, transforma." },
          { p: "Precisa ser médico para participar?", r: "A masterclass foi criada especificamente para médicos brasileiros. O conteúdo usa linguagem clínica e aborda dores específicas da categoria." },
          { p: "E se eu não puder assistir ao vivo?", r: "A gravação fica disponível por 7 dias após a masterclass. Você assiste no seu tempo." },
          { p: "O que acontece depois da masterclass?", r: "Você vai receber uma oferta para o Desafio Guardião 21 Dias — o próximo passo para quem quer implementar o que aprendeu. Sem pressão." },
          { p: "Como funciona a garantia?", r: "Se em 7 dias você sentir que a masterclass não agregou valor, devolvemos 100% do valor pago. Sem perguntas, sem burocracia." },
        ].map((faq, i) => (
          <div key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "20px 0" }}>
            <p style={{ color: "#F5F0E8", fontSize: "15px", fontWeight: 600, margin: "0 0 8px" }}>{faq.p}</p>
            <p style={{ color: "rgba(245,240,232,0.6)", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>{faq.r}</p>
          </div>
        ))}
      </div>

      {/* CTA Final */}
      <div style={{ background: "rgba(201,168,76,0.04)", borderTop: "1px solid rgba(201,168,76,0.15)", padding: "60px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 300, marginBottom: "16px" }}>
          Você já sabe que algo precisa mudar.<br />
          <em style={{ color: "#C9A84C" }}>A única pergunta é: quando?</em>
        </h2>
        <p style={{ color: "rgba(245,240,232,0.6)", fontSize: "15px", marginBottom: "32px" }}>
          {expired ? "Garanta sua vaga por R$20,00." : "Garanta sua vaga por R$1,99. A oferta expira em breve."}
        </p>
        <a
          href="#formulario"
          style={{ display: "inline-block", background: "#C9A84C", color: "#0A0A0A", textDecoration: "none", padding: "18px 48px", borderRadius: "4px", fontSize: "13px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          GARANTIR MINHA VAGA POR {preco} →
        </a>
        <p style={{ color: "rgba(245,240,232,0.3)", fontSize: "12px", marginTop: "12px" }}>🔒 Pagamento seguro · Garantia de 7 dias · Sem spam</p>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .masterclass-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  );
}
