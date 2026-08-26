import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { LABELS, PLACEHOLDERS, PROFISSOES } from "@/lib/lead-fields";

// Estilo compartilhado pelos campos do checkout.
const campoStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(201,168,76,0.2)",
  borderRadius: "4px",
  padding: "12px 14px",
  color: "#F5F0E8",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};

const rotuloStyle: React.CSSProperties = {
  display: "block",
  color: "rgba(245,240,232,0.5)",
  fontSize: "10px",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  marginBottom: "6px",
};

/** Seta dourada do select, desenhada em CSS para não depender de ícone. */
const setaSelect: React.CSSProperties = {
  appearance: "none",
  cursor: "pointer",
  backgroundImage: "linear-gradient(45deg, transparent 50%, #C9A84C 50%), linear-gradient(135deg, #C9A84C 50%, transparent 50%)",
  backgroundPosition: "calc(100% - 20px) center, calc(100% - 14px) center",
  backgroundSize: "6px 6px, 6px 6px",
  backgroundRepeat: "no-repeat",
};

// ─── Countdown ────────────────────────────────────────────────────────────────
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

// ─── Checkout Modal ───────────────────────────────────────────────────────────
function CheckoutModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (nome: string) => void }) {
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", regiao: "", profissao: "" });

  const submitMutation = trpc.diagnostico.submitResultado.useMutation({
    onSuccess: () => {
      toast.success("Inscrição confirmada!");
      onSuccess(form.nome);
    },
    onError: () => toast.error("Erro ao processar. Tente novamente."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.email || !form.telefone || !form.regiao || !form.profissao) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    submitMutation.mutate({
      nome: form.nome,
      email: form.email,
      telefone: form.telefone,
      regiao: form.regiao,
      profissao: form.profissao,
      especialidade: "Desafio 21 Dias",
      escore: 50,
      respostas: { produto: 1, desafio21dias: 1 },
      evento: "desafio",
      extras: { "Pedido": "Desafio Guardião 21 Dias", "Valor": "R$997" },
    });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={onClose}>
      <div style={{ background: "#111", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "12px", padding: "32px", maxWidth: "480px", width: "100%", maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h3 style={{ color: "#F5F0E8", fontSize: "20px", fontWeight: 300, margin: 0 }}>Garantir minha vaga</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(245,240,232,0.4)", fontSize: "20px", cursor: "pointer" }}>✕</button>
        </div>

        {/* Resumo do pedido */}
        <div style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "8px", padding: "16px", marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ color: "#F5F0E8", fontSize: "14px", fontWeight: 600 }}>Desafio Guardião 21 Dias</div>
              <div style={{ color: "rgba(245,240,232,0.5)", fontSize: "12px" }}>+ 3 Bônus inclusos</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "rgba(245,240,232,0.3)", fontSize: "12px", textDecoration: "line-through" }}>R$1.497</div>
              <div style={{ color: "#C9A84C", fontSize: "22px", fontWeight: 700 }}>R$997</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {[
            { key: "nome", label: LABELS.nome, placeholder: PLACEHOLDERS.nome, type: "text" },
            { key: "email", label: LABELS.email, placeholder: PLACEHOLDERS.email, type: "email" },
            { key: "telefone", label: LABELS.telefone, placeholder: PLACEHOLDERS.telefone, type: "tel" },
            { key: "regiao", label: LABELS.regiao, placeholder: PLACEHOLDERS.regiao, type: "text" },
          ].map(({ key, label, placeholder, type }) => (
            <div key={key}>
              <label style={rotuloStyle}>{label} *</label>
              <input
                type={type}
                placeholder={placeholder}
                value={form[key as keyof typeof form]}
                onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                required
                style={campoStyle}
              />
            </div>
          ))}

          <div>
            <label style={rotuloStyle}>{LABELS.profissao} *</label>
            <select
              value={form.profissao}
              onChange={e => setForm(prev => ({ ...prev, profissao: e.target.value }))}
              required
              style={{ ...campoStyle, ...setaSelect, color: form.profissao ? "#F5F0E8" : "rgba(245,240,232,0.4)" }}
            >
              <option value="" disabled>{PLACEHOLDERS.profissao}</option>
              {PROFISSOES.map(profissao => (
                <option key={profissao} value={profissao} style={{ background: "#111", color: "#F5F0E8" }}>{profissao}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={submitMutation.isPending}
            style={{ background: submitMutation.isPending ? "rgba(201,168,76,0.5)" : "#C9A84C", color: "#0A0A0A", border: "none", padding: "16px", borderRadius: "4px", fontSize: "13px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", cursor: submitMutation.isPending ? "not-allowed" : "pointer" }}
          >
            {submitMutation.isPending ? "PROCESSANDO..." : "GARANTIR MINHA VAGA POR R$997 →"}
          </button>
          <p style={{ color: "rgba(245,240,232,0.3)", fontSize: "11px", textAlign: "center" }}>
            🔒 Pagamento seguro · Garantia de 7 dias · Parcelamento disponível
          </p>
        </form>
      </div>
    </div>
  );
}

// ─── Página Principal ─────────────────────────────────────────────────────────
export default function VendasDesafio() {
  const [showCheckout, setShowCheckout] = useState(false);
  const [, navigate] = useLocation();
  const { h, m, s } = useCountdown(6);

  const handleSuccess = (nome: string) => {
    setShowCheckout(false);
    navigate(`/obrigado?nome=${encodeURIComponent(nome)}`);
  };

  const openCheckout = () => setShowCheckout(true);

  return (
    <div style={{ background: "#0A0A0A", color: "#F5F0E8", fontFamily: "'Georgia', serif", minHeight: "100vh" }}>

      {/* Barra de Urgência */}
      <div style={{ background: "linear-gradient(90deg, #7C2D12 0%, #C9A84C 50%, #7C2D12 100%)", padding: "10px 24px", textAlign: "center" }}>
        <p style={{ color: "#0A0A0A", fontSize: "13px", fontWeight: 700, margin: 0 }}>
          ⚠️ VAGAS LIMITADAS — Oferta de lançamento expira em &nbsp;
          <span style={{ fontFamily: "monospace" }}>{String(h).padStart(2,"0")}:{String(m).padStart(2,"0")}:{String(s).padStart(2,"0")}</span>
        </p>
      </div>

      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(201,168,76,0.15)", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div style={{ width: "30px", height: "30px", border: "1.5px solid #C9A84C", borderRadius: "3px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#C9A84C", fontSize: "14px" }}>⬡</span>
          </div>
          <span style={{ color: "#F5F0E8", fontSize: "13px" }}>Dr. Santiago Vecina</span>
        </a>
        <button onClick={openCheckout} style={{ background: "#C9A84C", color: "#0A0A0A", border: "none", padding: "8px 20px", borderRadius: "4px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
          GARANTIR VAGA
        </button>
      </div>

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "60px 24px 40px", textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "5px 16px", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "20px", background: "rgba(201,168,76,0.08)", marginBottom: "24px" }}>
          <span style={{ color: "#C9A84C", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase" }}>DESAFIO GUARDIÃO · 21 DIAS · AO VIVO</span>
        </div>

        <h1 style={{ fontSize: "clamp(30px, 5vw, 56px)", fontWeight: 300, lineHeight: 1.1, marginBottom: "20px" }}>
          21 Dias para Recuperar o Controle<br />
          <em style={{ color: "#C9A84C" }}>da Sua Vida — Sem Abrir Mão da Medicina</em>
        </h1>

        <p style={{ fontSize: "clamp(15px, 2.5vw, 19px)", color: "rgba(245,240,232,0.7)", lineHeight: 1.7, maxWidth: "640px", margin: "0 auto 40px" }}>
          O único desafio criado por um médico, para médicos, que trata a rotina do plantão como o problema central de design — não como desculpa.
        </p>

        {/* VSL Placeholder */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "12px", aspectRatio: "16/9", maxWidth: "640px", margin: "0 auto 32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: "64px", height: "64px", border: "2px solid #C9A84C", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <span style={{ color: "#C9A84C", fontSize: "24px", marginLeft: "4px" }}>▶</span>
            </div>
            <p style={{ color: "rgba(245,240,232,0.5)", fontSize: "13px" }}>Assista ao vídeo do Dr. Santiago (3 min)</p>
          </div>
        </div>

        <button onClick={openCheckout} style={{ background: "#C9A84C", color: "#0A0A0A", border: "none", padding: "20px 56px", borderRadius: "4px", fontSize: "14px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", marginBottom: "12px", display: "block", width: "100%", maxWidth: "520px", margin: "0 auto 12px" }}>
          QUERO PARTICIPAR DO DESAFIO →
        </button>
        <p style={{ color: "rgba(245,240,232,0.3)", fontSize: "12px" }}>🔒 Pagamento seguro · Garantia de 7 dias · Parcelamento disponível</p>
      </div>

      {/* ─── DOR ──────────────────────────────────────────────────────────── */}
      <div style={{ background: "rgba(239,68,68,0.04)", borderTop: "1px solid rgba(239,68,68,0.1)", borderBottom: "1px solid rgba(239,68,68,0.1)", padding: "60px 24px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <p style={{ color: "rgba(245,240,232,0.4)", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", textAlign: "center", marginBottom: "40px" }}>VOCÊ SE RECONHECE NISSO?</p>
          {[
            { titulo: "\"Você trabalha 60 horas por semana e ainda sente que não dá conta de tudo\"", texto: "Não é falta de esforço. É falta de arquitetura. Você foi treinado para trabalhar mais, não para trabalhar melhor. E ninguém te ensinou a diferença." },
            { titulo: "\"Você chega em casa e não tem mais nada para dar — nem para a sua família, nem para você mesmo\"", texto: "O modo médico não desliga quando você atravessa a porta de casa. Você está fisicamente presente mas mentalmente ainda no consultório. E sua família sente isso antes de você." },
            { titulo: "\"Você sabe o que precisa mudar — mas toda vez que tenta, volta para os velhos padrões em semanas\"", texto: "Motivação sem estrutura é temporária. Você já tentou acordar mais cedo, treinar mais, estar mais presente. E funcionou por um tempo. O problema não é a sua vontade. É a ausência de um sistema que funcione dentro da sua rotina real." },
          ].map((d, i) => (
            <div key={i} style={{ display: "flex", gap: "20px", marginBottom: "24px", padding: "24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: "8px" }}>
              <div style={{ flexShrink: 0, width: "32px", height: "32px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#EF4444", fontSize: "14px" }}>✗</span>
              </div>
              <div>
                <p style={{ color: "#F5F0E8", fontSize: "16px", fontWeight: 600, lineHeight: 1.4, margin: "0 0 8px" }}>{d.titulo}</p>
                <p style={{ color: "rgba(245,240,232,0.6)", fontSize: "14px", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>{d.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── AUTORIDADE ───────────────────────────────────────────────────── */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "60px 24px" }}>
        <p style={{ color: "rgba(245,240,232,0.4)", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", textAlign: "center", marginBottom: "32px" }}>QUEM CRIOU ESSE DESAFIO</p>
        <div style={{ display: "flex", gap: "32px", alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ flex: "0 0 auto", textAlign: "center" }}>
            <div style={{ width: "120px", height: "120px", border: "2px solid rgba(201,168,76,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px", margin: "0 auto 12px" }}>🩺</div>
            <div style={{ color: "#C9A84C", fontSize: "11px", letterSpacing: "0.2em" }}>DR. SANTIAGO VECINA</div>
          </div>
          <div style={{ flex: 1, minWidth: "240px" }}>
            <p style={{ color: "rgba(245,240,232,0.8)", fontSize: "15px", lineHeight: 1.7, marginBottom: "16px" }}>
              Dr. Santiago Vecina é médico, estrategista de performance e fundador da Comunidade Guardiões. Após dois burnouts, 5 livros publicados e a conclusão de dois Ultraman, ele criou o método que o sistema médico nunca ofereceu: estrutura para que o Guardião cuide de si mesmo.
            </p>
            <p style={{ color: "rgba(245,240,232,0.7)", fontSize: "15px", lineHeight: 1.7, marginBottom: "16px" }}>
              Atualmente baseado em Williams Island, Miami, ele trabalha com médicos no Brasil, EUA e Europa — ajudando-os a reconstruir os 5 territórios da vida sem abandonar a medicina que amam.
            </p>
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
              {[["5", "Livros"], ["2×", "Ultraman"], ["15+", "Anos"], ["3", "Países"]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ color: "#C9A84C", fontSize: "20px", fontWeight: 700 }}>{n}</div>
                  <div style={{ color: "rgba(245,240,232,0.4)", fontSize: "11px", letterSpacing: "0.1em" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── MÉTODO ───────────────────────────────────────────────────────── */}
      <div style={{ background: "rgba(255,255,255,0.01)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "60px 24px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <p style={{ color: "rgba(245,240,232,0.4)", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", textAlign: "center", marginBottom: "12px" }}>O MÉTODO</p>
          <h2 style={{ fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 300, textAlign: "center", marginBottom: "40px" }}>
            3 semanas. 3 territórios. <em style={{ color: "#C9A84C" }}>1 vida transformada.</em>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
            {[
              { semana: "SEMANA 1", territorio: "TEMPO", subtitulo: "A Soberania da Agenda", descricao: "Auditoria completa da agenda, os 3 Blocos Inegociáveis e o sistema de delegação mínima.", resultado: "5–8 horas recuperadas por semana", cor: "#C9A84C" },
              { semana: "SEMANA 2", territorio: "CORPO", subtitulo: "A Armadura Física", descricao: "Sistema de sono plantão-compatível, alimentação prática para rotina hospitalar e treino mínimo eficaz.", resultado: "Energia consistente e sono melhorado", cor: "#3B82F6" },
              { semana: "SEMANA 3", territorio: "PRESENÇA", subtitulo: "O Legado que Começa em Casa", descricao: "Dia sagrado da família, ritual de descompressão emocional e o plano dos próximos 90 dias.", resultado: "Presença real em casa e clareza total", cor: "#10B981" },
            ].map((s, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${s.cor}20`, borderRadius: "10px", padding: "24px" }}>
                <div style={{ color: s.cor, fontSize: "10px", letterSpacing: "0.3em", marginBottom: "4px" }}>{s.semana}</div>
                <div style={{ color: "#F5F0E8", fontSize: "18px", fontWeight: 600, marginBottom: "4px" }}>{s.territorio}</div>
                <div style={{ color: s.cor, fontSize: "13px", fontStyle: "italic", marginBottom: "12px" }}>"{s.subtitulo}"</div>
                <p style={{ color: "rgba(245,240,232,0.65)", fontSize: "13px", lineHeight: 1.6, marginBottom: "16px" }}>{s.descricao}</p>
                <div style={{ background: `${s.cor}10`, border: `1px solid ${s.cor}20`, borderRadius: "4px", padding: "8px 12px" }}>
                  <div style={{ color: s.cor, fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "2px" }}>RESULTADO ESPERADO</div>
                  <div style={{ color: "#F5F0E8", fontSize: "13px" }}>{s.resultado}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── O QUE VOCÊ RECEBE ────────────────────────────────────────────── */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "60px 24px" }}>
        <p style={{ color: "rgba(245,240,232,0.4)", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", textAlign: "center", marginBottom: "32px" }}>O QUE VOCÊ RECEBE</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
          {[
            { icone: "🎬", titulo: "21 Aulas Gravadas", desc: "10–15 min cada, plantão-compatíveis, assistidas no seu tempo. Disponíveis por 12 meses.", valor: "R$497" },
            { icone: "📓", titulo: "Guardian Journal Digital", desc: "Rastreador diário dos desafios com métricas dos 3 territórios. Preenchível online ou imprimível.", valor: "R$97" },
            { icone: "💬", titulo: "Grupo de WhatsApp da Turma", desc: "Comunidade de médicos na mesma jornada. Suporte, accountability e conexão real.", valor: "R$197" },
            { icone: "🎥", titulo: "3 Lives ao Vivo com Dr. Santiago", desc: "Abertura (Dia 1), Meio (Dia 11) e Encerramento (Dia 21). Com perguntas e respostas.", valor: "R$297" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "16px", padding: "20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "24px", flexShrink: 0 }}>{item.icone}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#F5F0E8", fontSize: "15px", fontWeight: 600, marginBottom: "4px" }}>{item.titulo}</div>
                <div style={{ color: "rgba(245,240,232,0.6)", fontSize: "13px", lineHeight: 1.5 }}>{item.desc}</div>
              </div>
              <div style={{ color: "rgba(245,240,232,0.3)", fontSize: "13px", flexShrink: 0 }}>{item.valor}</div>
            </div>
          ))}
        </div>

        {/* Bônus */}
        <div style={{ background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "10px", padding: "24px", marginBottom: "32px" }}>
          <p style={{ color: "#C9A84C", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "16px" }}>🎁 BÔNUS EXCLUSIVOS</p>
          {[
            { titulo: "Bônus 1: Calculadora da Hora Real", desc: "Ferramenta para calcular o valor real do seu tempo e identificar onde você está perdendo dinheiro.", valor: "R$97" },
            { titulo: "Bônus 2: Biblioteca de Templates", desc: "Agenda-modelo, checklist de delegação e script de conversa com equipe — prontos para usar.", valor: "R$147" },
            { titulo: "Bônus 3: 1º Mês na Comunidade Guardiões", desc: "Acesso gratuito à comunidade após completar o desafio. Condição de membro-fundador para o evento METAMORFOSE.", valor: "R$197" },
          ].map((b, i) => (
            <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "12px", paddingBottom: "12px", borderBottom: i < 2 ? "1px solid rgba(201,168,76,0.1)" : "none" }}>
              <span style={{ color: "#C9A84C", fontWeight: 700, flexShrink: 0 }}>✓</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#F5F0E8", fontSize: "14px", fontWeight: 600 }}>{b.titulo}</div>
                <div style={{ color: "rgba(245,240,232,0.6)", fontSize: "13px" }}>{b.desc}</div>
              </div>
              <div style={{ color: "rgba(245,240,232,0.3)", fontSize: "13px", flexShrink: 0 }}>{b.valor}</div>
            </div>
          ))}
        </div>

        {/* Resumo de valor */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "24px", marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ color: "rgba(245,240,232,0.6)", fontSize: "14px" }}>Valor total do pacote</span>
            <span style={{ color: "rgba(245,240,232,0.4)", fontSize: "14px", textDecoration: "line-through" }}>R$1.529</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <span style={{ color: "#F5F0E8", fontSize: "18px", fontWeight: 600 }}>Investimento hoje</span>
            <span style={{ color: "#C9A84C", fontSize: "28px", fontWeight: 700 }}>R$997</span>
          </div>
          <p style={{ color: "rgba(245,240,232,0.4)", fontSize: "12px", margin: "8px 0 0", textAlign: "right" }}>ou 12× de R$97 · Parcelamento disponível</p>
        </div>

        {/* CTA Principal */}
        <div style={{ textAlign: "center" }}>
          <button onClick={openCheckout} style={{ background: "#C9A84C", color: "#0A0A0A", border: "none", padding: "20px 56px", borderRadius: "4px", fontSize: "14px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", marginBottom: "12px", display: "block", width: "100%", maxWidth: "520px", margin: "0 auto 12px" }}>
            QUERO PARTICIPAR DO DESAFIO →
          </button>
          <p style={{ color: "rgba(245,240,232,0.3)", fontSize: "12px" }}>🔒 Pagamento seguro · Garantia de 7 dias · Parcelamento disponível</p>
        </div>
      </div>

      {/* ─── DEPOIMENTOS ──────────────────────────────────────────────────── */}
      <div style={{ background: "rgba(255,255,255,0.01)", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "60px 24px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <p style={{ color: "rgba(245,240,232,0.4)", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", textAlign: "center", marginBottom: "32px" }}>O QUE MÉDICOS ESTÃO DIZENDO</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
            {[
              { texto: "Na primeira semana, recuperei 8 horas. Não acreditei até ver no Journal. Agora treino 4 vezes por semana e janto com minha família toda noite.", nome: "Dr. Rafael M.", esp: "Cardiologista", cidade: "São Paulo, SP" },
              { texto: "Fiz o desafio no meio de uma semana de plantão. Funcionou. O Dr. Santiago não cria desculpas — ele cria sistemas.", nome: "Dra. Camila F.", esp: "Pediatra", cidade: "Belo Horizonte, MG" },
              { texto: "O Dia 12 — o Painel do Guardião — me fez pedir exames que eu nunca tinha pedido para mim mesmo. Testosterona estava no chão. Agora entendo por que eu estava tão apagado.", nome: "Dr. André L.", esp: "Ortopedista", cidade: "Miami, FL" },
              { texto: "Minha esposa notou a diferença antes de mim. Isso diz tudo.", nome: "Dr. Marcos R.", esp: "Neurocirurgião", cidade: "Rio de Janeiro, RJ" },
            ].map((d, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", padding: "20px" }}>
                <div style={{ color: "#C9A84C", marginBottom: "12px" }}>⭐⭐⭐⭐⭐</div>
                <p style={{ color: "rgba(245,240,232,0.8)", fontSize: "14px", lineHeight: 1.6, margin: "0 0 16px", fontStyle: "italic" }}>"{d.texto}"</p>
                <div>
                  <div style={{ color: "#C9A84C", fontSize: "13px", fontWeight: 600 }}>{d.nome}</div>
                  <div style={{ color: "rgba(245,240,232,0.4)", fontSize: "11px" }}>{d.esp} · {d.cidade}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── GARANTIA ─────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "12px", padding: "32px", textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🛡️</div>
          <h3 style={{ color: "#10B981", fontSize: "22px", fontWeight: 300, marginBottom: "16px" }}>Garantia Incondicional de 7 Dias</h3>
          <p style={{ color: "rgba(245,240,232,0.75)", fontSize: "15px", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto" }}>
            Se você fizer os 21 dias e não sentir que valeu cada centavo, eu devolvo 100% do seu investimento sem perguntas. A única condição é que você faça. Não apenas assista. Faça.
          </p>
        </div>
      </div>

      {/* ─── FAQ ──────────────────────────────────────────────────────────── */}
      <div style={{ background: "rgba(255,255,255,0.01)", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "60px 24px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <p style={{ color: "rgba(245,240,232,0.4)", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", textAlign: "center", marginBottom: "32px" }}>PERGUNTAS FREQUENTES</p>
          {[
            { p: "Funciona para quem faz plantão?", r: "Foi desenhado especificamente para isso. Os sistemas do Desafio são plantão-compatíveis — eles funcionam dentro da imprevisibilidade da rotina médica, não apesar dela." },
            { p: "Quanto tempo por dia eu preciso dedicar?", r: "15 minutos de aula + 5–10 minutos de desafio prático. Total: 20–25 minutos por dia. Menos do que você gasta no WhatsApp de pacientes." },
            { p: "Funciona para médicos em qualquer especialidade?", r: "Sim. O Desafio trabalha com os 5 Territórios da vida — não com a especialidade médica. Clínicos, cirurgiões, pediatras, psiquiatras — todos passam pelo mesmo Paradoxo do Guardião." },
            { p: "E se eu não conseguir acompanhar no ritmo?", r: "As aulas ficam disponíveis por 12 meses. Você pode fazer no seu ritmo. O grupo de WhatsApp e as lives são o único componente em tempo real." },
            { p: "Qual a diferença para outros cursos de produtividade?", r: "Nenhum outro programa foi criado por um médico, para médicos, com a linguagem de colega — não de coach. Os sistemas foram desenhados para a rotina médica real: plantões, imprevisibilidade, carga emocional." },
            { p: "Posso parcelar?", r: "Sim. O parcelamento está disponível na página de checkout em até 12× sem juros." },
            { p: "O que acontece depois dos 21 dias?", r: "Você recebe o convite para a Comunidade Guardiões com o primeiro mês incluído — e a condição de membro-fundador para o evento METAMORFOSE em Miami." },
            { p: "Vou precisar de algum material adicional?", r: "Não. Tudo que você precisa está incluído — incluindo o Guardian Journal digital e os templates. Você só precisa de 20 minutos por dia e disposição para fazer, não apenas assistir." },
          ].map((faq, i) => (
            <div key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "20px 0" }}>
              <p style={{ color: "#F5F0E8", fontSize: "15px", fontWeight: 600, margin: "0 0 8px" }}>{faq.p}</p>
              <p style={{ color: "rgba(245,240,232,0.6)", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>{faq.r}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── CTA FINAL ────────────────────────────────────────────────────── */}
      <div style={{ background: "rgba(201,168,76,0.04)", borderTop: "1px solid rgba(201,168,76,0.15)", padding: "60px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 300, marginBottom: "16px" }}>
          Você já sabe que algo precisa mudar.<br />
          <em style={{ color: "#C9A84C" }}>A única pergunta é: quando?</em>
        </h2>
        <p style={{ color: "rgba(245,240,232,0.6)", fontSize: "15px", marginBottom: "32px" }}>
          Em 21 dias, você vai ter sistemas que funcionam — não motivação que dura uma semana.
        </p>
        <button onClick={openCheckout} style={{ background: "#C9A84C", color: "#0A0A0A", border: "none", padding: "20px 56px", borderRadius: "4px", fontSize: "14px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", marginBottom: "12px", display: "block", maxWidth: "520px", margin: "0 auto 12px" }}>
          QUERO PARTICIPAR DO DESAFIO →
        </button>
        <p style={{ color: "rgba(245,240,232,0.3)", fontSize: "12px" }}>🔒 Pagamento seguro · Garantia de 7 dias · Parcelamento em até 12×</p>
      </div>

      {/* Checkout Modal */}
      {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} onSuccess={handleSuccess} />}

    </div>
  );
}
