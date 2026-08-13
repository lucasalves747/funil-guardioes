import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type Fase = "form" | "resultado";

export default function Calculadora() {
  const [fase, setFase] = useState<Fase>("form");
  const [dados, setDados] = useState({
    nome: "", email: "", telefone: "",
    horasSemanais: "", valorConsulta: "",
    horasAdmin: "", horasPlantao: "", horasCursos: "",
  });
  const [resultado, setResultado] = useState<{
    horaReal: string; horaRealNum: number; diferenca: number; valorConsulta: number;
  } | null>(null);

  const submitMutation = trpc.calculadora.submitResultado.useMutation({
    onSuccess: () => toast.success("Resultado enviado para o seu email!"),
    onError: () => toast.error("Erro ao enviar. Tente novamente."),
  });

  const calcular = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dados.nome || !dados.email || !dados.telefone || !dados.horasSemanais || !dados.valorConsulta) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    const horasTotal = parseFloat(dados.horasSemanais) || 0;
    const valorConsulta = parseFloat(dados.valorConsulta) || 0;
    const horasAdmin = parseFloat(dados.horasAdmin) || 0;
    const horasPlantao = parseFloat(dados.horasPlantao) || 0;
    const horasCursos = parseFloat(dados.horasCursos) || 0;

    // Horas produtivas reais = total - admin - plantão não remunerado - cursos
    const horasNaoRemuneradas = horasAdmin + horasPlantao + horasCursos;
    const horasReais = Math.max(horasTotal - horasNaoRemuneradas, 1);

    // Receita semanal estimada (assumindo 6 consultas/hora como média)
    const consultasPorHora = 3;
    const receitaSemanal = horasReais * consultasPorHora * valorConsulta;

    // Custo real por hora (incluindo horas não remuneradas)
    const horaRealNum = receitaSemanal / horasTotal;
    const horaRealFormatada = `R$ ${horaRealNum.toFixed(2).replace(".", ",")}`;
    const diferenca = Math.round(((valorConsulta - horaRealNum) / valorConsulta) * 100);

    setResultado({ horaReal: horaRealFormatada, horaRealNum, diferenca, valorConsulta });
    setFase("resultado");

    submitMutation.mutate({
      nome: dados.nome,
      email: dados.email,
      telefone: dados.telefone,
      horasSemanais: horasTotal,
      valorConsulta,
      horaReal: horaRealFormatada,
    });
  };

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

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "40px 24px" }}>

        {fase === "form" && (
          <>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <p style={{ color: "#C9A84C", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "16px" }}>Calculadora Gratuita</p>
              <h1 style={{ fontSize: "clamp(26px, 5vw, 40px)", fontWeight: 300, lineHeight: 1.2, marginBottom: "16px" }}>
                Quanto vale<br /><em style={{ color: "#C9A84C" }}>a sua hora real?</em>
              </h1>
              <p style={{ color: "rgba(245,240,232,0.6)", fontSize: "15px", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto" }}>
                A maioria dos médicos cobra R$ 300 por consulta e acha que essa é a sua hora. Não é. Descubra quanto você realmente ganha por hora — incluindo tudo que você não cobra.
              </p>
            </div>

            <form onSubmit={calcular} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Dados pessoais */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,168,76,0.1)", borderRadius: "8px", padding: "24px" }}>
                <h3 style={{ color: "#C9A84C", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "20px" }}>SEUS DADOS</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {[
                    { key: "nome", label: "Nome completo *", placeholder: "Dr(a). Seu Nome", type: "text" },
                    { key: "email", label: "Email *", placeholder: "seu@email.com", type: "email" },
                    { key: "telefone", label: "WhatsApp *", placeholder: "+55 (11) 99999-9999", type: "tel" },
                  ].map(({ key, label, placeholder, type }) => (
                    <div key={key}>
                      <label style={{ display: "block", color: "rgba(245,240,232,0.4)", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "6px" }}>{label}</label>
                      <input
                        type={type}
                        placeholder={placeholder}
                        value={dados[key as keyof typeof dados]}
                        onChange={e => setDados(prev => ({ ...prev, [key]: e.target.value }))}
                        required
                        style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "4px", padding: "12px 14px", color: "#F5F0E8", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Dados financeiros */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,168,76,0.1)", borderRadius: "8px", padding: "24px" }}>
                <h3 style={{ color: "#C9A84C", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "20px" }}>SUA SEMANA DE TRABALHO</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {[
                    { key: "horasSemanais", label: "Total de horas trabalhadas por semana *", placeholder: "Ex: 60", type: "number" },
                    { key: "valorConsulta", label: "Valor médio por consulta (R$) *", placeholder: "Ex: 300", type: "number" },
                    { key: "horasAdmin", label: "Horas semanais em tarefas administrativas (não remuneradas)", placeholder: "Ex: 10", type: "number" },
                    { key: "horasPlantao", label: "Horas de plantão não remunerado ou abaixo do valor", placeholder: "Ex: 8", type: "number" },
                    { key: "horasCursos", label: "Horas em cursos, congressos e atualização", placeholder: "Ex: 4", type: "number" },
                  ].map(({ key, label, placeholder, type }) => (
                    <div key={key}>
                      <label style={{ display: "block", color: "rgba(245,240,232,0.4)", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "6px" }}>{label}</label>
                      <input
                        type={type}
                        min="0"
                        placeholder={placeholder}
                        value={dados[key as keyof typeof dados]}
                        onChange={e => setDados(prev => ({ ...prev, [key]: e.target.value }))}
                        required={key === "horasSemanais" || key === "valorConsulta"}
                        style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "4px", padding: "12px 14px", color: "#F5F0E8", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                style={{ background: "#C9A84C", color: "#0A0A0A", border: "none", padding: "16px", borderRadius: "4px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}
              >
                CALCULAR MINHA HORA REAL →
              </button>
            </form>
          </>
        )}

        {fase === "resultado" && resultado && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <p style={{ color: "#C9A84C", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "16px" }}>Resultado</p>
              <h2 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 300, marginBottom: "32px" }}>
                Sua hora real vale:
              </h2>
              <div style={{ fontSize: "clamp(40px, 8vw, 72px)", fontWeight: 700, color: "#C9A84C", lineHeight: 1, marginBottom: "8px" }}>
                {resultado.horaReal}
              </div>
              <div style={{ color: "rgba(245,240,232,0.4)", fontSize: "13px", marginBottom: "32px" }}>
                enquanto você cobra R$ {resultado.valorConsulta.toFixed(0)} por consulta
              </div>

              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", padding: "20px", marginBottom: "32px" }}>
                <p style={{ color: "#EF4444", fontSize: "16px", fontWeight: 600, margin: "0 0 8px" }}>
                  Você está perdendo {resultado.diferenca}% do valor que acredita ganhar.
                </p>
                <p style={{ color: "rgba(245,240,232,0.6)", fontSize: "14px", margin: 0, lineHeight: 1.6 }}>
                  Cada hora não remunerada — administrativa, de plantão, de atualização — está sendo subsidiada pelo seu tempo de vida. Isso não é dedicação. É um modelo de negócio quebrado.
                </p>
              </div>

              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", padding: "24px", marginBottom: "32px", textAlign: "left" }}>
                <h3 style={{ color: "#C9A84C", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "16px" }}>O QUE FAZER AGORA</h3>
                {[
                  "Calcule o custo real de cada tarefa que você faz e que poderia delegar.",
                  "Implemente o Filtro de Decisão: qualquer tarefa abaixo da sua hora real deve ser delegada.",
                  "Revise sua tabela de honorários — você provavelmente está cobrando abaixo do mercado.",
                  "Construa um sistema que gere receita mesmo quando você não está atendendo.",
                  "BÔNUS: O Desafio Guardião 21 Dias tem um módulo completo sobre Arquitetura de Negócio.",
                ].map((acao, i) => (
                  <div key={i} style={{ display: "flex", gap: "14px", marginBottom: "14px" }}>
                    <span style={{ flexShrink: 0, color: "#C9A84C", fontWeight: 700, fontSize: "13px", paddingTop: "2px" }}>{i + 1}.</span>
                    <p style={{ color: "rgba(245,240,232,0.75)", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>{acao}</p>
                  </div>
                ))}
              </div>

              <a
                href="/desafio"
                style={{ display: "inline-block", background: "#C9A84C", color: "#0A0A0A", textDecoration: "none", padding: "16px 40px", borderRadius: "4px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}
              >
                ACESSAR O DESAFIO GUARDIÃO 21 DIAS →
              </a>
              <p style={{ color: "rgba(245,240,232,0.3)", fontSize: "12px", marginTop: "16px" }}>
                Resultado enviado para o seu email ✓
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
