/**
 * PLATAFORMA DESAFIO GUARDIÃO 21 DIAS
 * Design: Dark Manifesto — Quiet Luxury
 * Paleta: #0A0A0A | #C9A84C (dourado) | #F5F0E8 (creme)
 * Tipografia: Cormorant Garamond + DM Sans
 * Funcionalidade: Guardian Journal Digital + Biblioteca de Templates
 * Persistência: localStorage (dados salvos no navegador do participante)
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, BookOpen, Calendar, BarChart3, Download, ChevronRight,
  ChevronLeft, Check, Clock, Dumbbell, Moon, Heart, Target,
  FileText, Users, Mic, Star, Lock, LogIn, LogOut, X, Menu, ChevronDown
} from "lucide-react";
import { LABELS, PLACEHOLDERS, PROFISSOES } from "@/lib/lead-fields";
import * as IMG from "@/lib/imagens";
import * as conta from "@/lib/desafio-conta";

// A URL mora em lib/imagens.ts — trocar imagem é mexer só lá.
const HERO_BG = IMG.RETRATO_ESCRITORIO;

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface DayEntry {
  slept: string;
  sleepQuality: number;
  trained: boolean;
  journal5min: boolean;
  ritualDesligamento: boolean;
  notaTempo: number;
  notaEnergia: number;
  notaPresenca: number;
  desafioCompleto: "sim" | "nao" | "parcial" | "";
  aulaAssistida: boolean;
  notes: string;
  customFields: Record<string, string>;
}

interface JournalData {
  [day: number]: DayEntry;
}

interface UserData {
  name: string;
  specialty: string;
  startDate: string;
  diagnosticoInicial: Record<string, number>;
  journal: JournalData;
  templates: Record<string, string>;
}

const defaultDayEntry = (): DayEntry => ({
  slept: "",
  sleepQuality: 0,
  trained: false,
  journal5min: false,
  ritualDesligamento: false,
  notaTempo: 0,
  notaEnergia: 0,
  notaPresenca: 0,
  desafioCompleto: "",
  aulaAssistida: false,
  notes: "",
  customFields: {},
});

// ─── WEEK / DAY DATA ─────────────────────────────────────────────────────────

const weeks = [
  {
    id: 1,
    title: "SEMANA 1",
    subtitle: "TEMPO",
    theme: "A Soberania da Agenda",
    goal: "Recuperar 5–8 horas semanais e inserir os 3 Blocos Inegociáveis na agenda.",
    color: "#C9A84C",
    days: [
      { day: 1, title: "A Auditoria da Agenda", duration: "12 min | Desafio: 20 min", desafio: "Preencher a auditoria de 3 dias e identificar os 3 maiores ladrões de tempo.", icon: Clock },
      { day: 2, title: "Os Ladrões de Tempo do Médico", duration: "10 min | Desafio: 15 min", desafio: "Identificar os 3 ladrões de tempo e calcular quantas horas por semana custam.", icon: Clock },
      { day: 3, title: "Os 3 Blocos Inegociáveis", duration: "12 min | Desafio: 30 min", desafio: "Inserir os 3 Blocos na agenda e compartilhar no grupo do WhatsApp.", icon: Calendar },
      { day: 4, title: "A Arte da Delegação Mínima", duration: "11 min | Desafio: 25 min", desafio: "Criar um protocolo de 1 página para a primeira delegação e entregar para a equipe.", icon: Users },
      { day: 5, title: "O Não Estratégico", duration: "10 min | Desafio: 15 min", desafio: "Escrever os 3 critérios do Filtro de Decisão e aplicar a pelo menos um pedido.", icon: Target },
      { day: 6, title: "O Sistema de Prontuários em Lote", duration: "9 min | Desafio: 20 min", desafio: "Criar o template de 5 campos e usar em todos os atendimentos de amanhã.", icon: FileText },
      { day: 7, title: "Revisão da Semana 1 + Live", duration: "Live ao vivo — 60 min", desafio: "Participar da live e responder: quantas horas recuperei esta semana?", icon: Mic, isLive: true },
    ]
  },
  {
    id: 2,
    title: "SEMANA 2",
    subtitle: "CORPO",
    theme: "A Armadura Física",
    goal: "Implementar o sistema de sono plantão-compatível, o Treino Mínimo Eficaz e o Painel do Guardião.",
    color: "#A0845C",
    days: [
      { day: 8, title: "O Corpo como Instrumento de Trabalho", duration: "13 min | Desafio: 10 min", desafio: "Preencher o Diagnóstico do Corpo e identificar o território mais crítico.", icon: Heart },
      { day: 9, title: "O Sistema de Sono para Quem Dá Plantão", duration: "14 min | Desafio: 15 min", desafio: "Implementar a Âncora de Sono e o Ritual de Desligamento por 7 dias.", icon: Moon },
      { day: 10, title: "O Treino Mínimo Eficaz", duration: "11 min | Desafio: 45 min (treino)", desafio: "Fazer o primeiro treino do protocolo e registrar no Guardian Journal.", icon: Dumbbell },
      { day: 11, title: "Alimentação Prática para Rotina Hospitalar", duration: "10 min | Desafio: 20 min", desafio: "Montar o kit de emergência alimentar e planejar as refeições dos próximos 3 dias.", icon: Heart },
      { day: 12, title: "O Exame que Todo Médico Deveria Fazer", duration: "12 min | Desafio: 30 min", desafio: "Marcar o Painel do Guardião para si mesmo até o final do dia.", icon: Target },
      { day: 13, title: "A Mente Blindada: Regulação Emocional", duration: "13 min | Desafio: 15 min", desafio: "Fazer o Diário de 5 Minutos por 7 dias consecutivos.", icon: Heart },
      { day: 14, title: "Revisão da Semana 2", duration: "10 min | Desafio: 20 min", desafio: "Medir mudanças percebidas no corpo e na energia. Preparar a Semana 3.", icon: BarChart3 },
    ]
  },
  {
    id: 3,
    title: "SEMANA 3",
    subtitle: "PRESENÇA",
    theme: "O Legado Começa em Casa",
    goal: "Implementar o Dia Sagrado da Família, o Ritual de Descompressão e o Plano dos Próximos 90 Dias.",
    color: "#8B7355",
    days: [
      { day: 15, title: "O Dia Sagrado da Família", duration: "12 min | Desafio: 60 min", desafio: "Ter a conversa com a família e definir o Dia Sagrado.", icon: Heart },
      { day: 16, title: "A Conversa que Você Está Adiando", duration: "11 min | Desafio: 30 min", desafio: "Ter a conversa difícil que você sabe que precisa ter.", icon: Users },
      { day: 17, title: "O Ritual de Descompressão Emocional", duration: "10 min | Desafio: 20 min", desafio: "Implementar o ritual de transição entre o trabalho e a família.", icon: Moon },
      { day: 18, title: "O Propósito que Você Adiou", duration: "14 min | Desafio: 45 min", desafio: "Escrever o Manifesto de Legado — 300 palavras sobre quem você quer ser.", icon: Star },
      { day: 19, title: "A Clínica que Funciona Sem Você", duration: "12 min | Desafio: 30 min", desafio: "Mapear os 3 processos que dependem exclusivamente de você.", icon: Target },
      { day: 20, title: "O Plano dos Próximos 90 Dias", duration: "11 min | Desafio: 30 min", desafio: "Criar o plano de 90 dias com 3 metas — uma por mês.", icon: Calendar },
      { day: 21, title: "Revisão Final + Live de Encerramento", duration: "Live ao vivo — 90 min", desafio: "Participar da live final e comparar o diagnóstico inicial com o final.", icon: Mic, isLive: true },
    ]
  }
];

const templates = [
  {
    id: "agenda",
    icon: Calendar,
    title: "Agenda-Modelo do Guardião",
    subtitle: "Dia 3 — Os 3 Blocos Inegociáveis",
    description: "Grade semanal completa com os 3 Blocos Inegociáveis posicionados e regras de proteção para comunicar à equipe.",
    fields: [
      { key: "bloco_armadura_horario", label: "Bloco Armadura — Horário", placeholder: "Ex: 06h00 às 07h00" },
      { key: "bloco_armadura_dias", label: "Bloco Armadura — Dias da semana", placeholder: "Ex: Segunda, Quarta, Sexta" },
      { key: "bloco_silencio_horario", label: "Bloco Silêncio — Horário", placeholder: "Ex: 12h00 às 12h45" },
      { key: "bloco_silencio_dias", label: "Bloco Silêncio — Dias da semana", placeholder: "Ex: Segunda a Sexta" },
      { key: "bloco_legado_horario", label: "Bloco Legado — Horário", placeholder: "Ex: 19h30 às 21h00" },
      { key: "bloco_legado_dias", label: "Bloco Legado — Dias da semana", placeholder: "Ex: Todos os dias" },
      { key: "regra_equipe", label: "Regra comunicada à equipe", placeholder: "Ex: Esses horários não existem para agendamentos." },
    ]
  },
  {
    id: "delegacao",
    icon: Users,
    title: "Checklist de Delegação Mínima",
    subtitle: "Dia 4 — A Arte da Delegação Mínima",
    description: "Auditoria de tarefas recorrentes e protocolo de delegação de 1 página para entregar para a secretária hoje.",
    fields: [
      { key: "tarefa1", label: "Tarefa delegada #1", placeholder: "Ex: Confirmação de consultas" },
      { key: "delegado1", label: "Para quem foi delegada", placeholder: "Ex: Secretária Ana" },
      { key: "horas1", label: "Horas/semana recuperadas", placeholder: "Ex: 2 horas" },
      { key: "tarefa2", label: "Tarefa delegada #2", placeholder: "Ex: Retorno de exames normais" },
      { key: "delegado2", label: "Para quem foi delegada", placeholder: "Ex: Secretária Ana" },
      { key: "horas2", label: "Horas/semana recuperadas", placeholder: "Ex: 1,5 horas" },
      { key: "total_horas", label: "Total de horas recuperadas por semana", placeholder: "Ex: 7 horas" },
      { key: "protocolo_delegacao", label: "Protocolo da primeira delegação (resumo)", placeholder: "Descreva em 3 linhas como a tarefa deve ser feita..." },
    ]
  },
  {
    id: "script",
    icon: Mic,
    title: "Script de Conversa com a Equipe",
    subtitle: "Dia 4 e 5 — Delegação e o Não Estratégico",
    description: "Roteiro completo de 15–20 minutos para a conversa mais importante da Semana 1, com falas prontas e Filtro de Decisão.",
    fields: [
      { key: "data_conversa", label: "Data da conversa com a equipe", placeholder: "Ex: 15/01/2025" },
      { key: "participantes", label: "Quem participou", placeholder: "Ex: Secretária Ana, Enfermeira Carla" },
      { key: "mudanca1", label: "Mudança #1 comunicada", placeholder: "Ex: Delegação da confirmação de consultas" },
      { key: "mudanca2", label: "Mudança #2 comunicada", placeholder: "Ex: Blocos fixos na agenda" },
      { key: "mudanca3", label: "Mudança #3 comunicada", placeholder: "Ex: Filtro de novos compromissos" },
      { key: "filtro1", label: "Critério 1 do Filtro de Decisão", placeholder: "Ex: Contribui para um dos 5 Territórios?" },
      { key: "filtro2", label: "Critério 2 do Filtro de Decisão", placeholder: "Ex: Só eu posso fazer isso?" },
      { key: "filtro3", label: "Critério 3 do Filtro de Decisão", placeholder: "Ex: O que precisarei cancelar se aceitar?" },
      { key: "resultado_conversa", label: "Como foi a conversa (resumo)", placeholder: "Descreva em 3 linhas o resultado da conversa..." },
    ]
  }
];

// ─── STORAGE ─────────────────────────────────────────────────────────────────
// O progresso agora vive no Supabase (lib/desafio-conta.ts), com o localStorage
// servindo só de cache offline. Antes ficava apenas no navegador: trocar de
// aparelho ou limpar o histórico apagava os 21 dias do participante.

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function ScoreSlider({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-[#F5F0E8]/60 text-xs">{label}</span>
        <span className="text-[#C9A84C] text-sm font-bold">{value}/10</span>
      </div>
      <input
        type="range" min={0} max={10} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1 bg-white/10 rounded appearance-none cursor-pointer accent-[#C9A84C]"
      />
    </div>
  );
}

function ProgressRing({ value, max, size = 60, label }: { value: number; max: number; size?: number; label: string }) {
  const pct = max > 0 ? value / max : 0;
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={4} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#C9A84C" strokeWidth={4}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`} />
        <text x="50%" y="50%" textAnchor="middle" dy="0.35em" fill="#F5F0E8" fontSize={size * 0.22} fontWeight="bold">
          {value}/{max}
        </text>
      </svg>
      <span className="text-[#F5F0E8]/50 text-xs text-center leading-tight">{label}</span>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function Desafio() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [section, setSection] = useState<"login" | "dashboard" | "journal" | "templates" | "progresso">("login");
  const [activeDay, setActiveDay] = useState(1);
  const [activeTemplate, setActiveTemplate] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ name: "", specialty: "", email: "", code: "" });
  const [loginError, setLoginError] = useState("");
  /** "dados" = pedindo nome/profissão/e-mail; "codigo" = esperando os 6 dígitos. */
  const [etapaLogin, setEtapaLogin] = useState<"dados" | "codigo">("dados");
  const [ocupado, setOcupado] = useState(false);
  const [aviso, setAviso] = useState("");
  /** Enquanto true, a tela não decidiu ainda se existe sessão salva. */
  const [verificandoSessao, setVerificandoSessao] = useState(true);

  // Sessão salva? Entra direto, sem pedir código de novo.
  useEffect(() => {
    let cancelado = false;

    (async () => {
      // O cache pinta a tela na hora; o servidor corrige logo em seguida.
      const cache = conta.lerCache<UserData>();
      if (cache && !cancelado) setUserData(cache);

      try {
        const usuario = await conta.usuarioAtual();
        if (!usuario || cancelado) return;

        const remoto = await conta.carregarProgresso<UserData>();
        if (cancelado) return;

        if (remoto) {
          const dados: UserData = {
            ...remoto.dados,
            name: remoto.nome,
            specialty: remoto.profissao,
            startDate: remoto.dataInicio,
          };
          setUserData(dados);
          conta.gravarCache(dados);
          setSection("dashboard");
        }
      } catch {
        // Sem rede ou sem configuração: fica no login, com o cache na mão.
      } finally {
        if (!cancelado) setVerificandoSessao(false);
      }
    })();

    return () => { cancelado = true; };
  }, []);

  // Cada mudança no diário vai para o cache na hora e para o servidor em seguida.
  useEffect(() => {
    if (!userData || section === "login") return;
    conta.gravarCache(userData);
    void conta.salvarProgresso(userData);
  }, [userData, section]);

  const pedirCodigo = async () => {
    if (!loginForm.name.trim()) { setLoginError("Por favor, informe o seu nome."); return; }
    if (!loginForm.specialty.trim()) { setLoginError("Por favor, informe a sua profissão."); return; }
    if (!loginForm.email.trim()) { setLoginError("Por favor, informe o e-mail da sua compra."); return; }

    setLoginError("");
    setOcupado(true);
    try {
      await conta.enviarCodigo(loginForm.email);
      setEtapaLogin("codigo");
      setAviso(`Enviamos um código de 6 dígitos para ${loginForm.email.trim()}.`);
    } catch (erro) {
      setLoginError(erro instanceof Error ? erro.message : "Não foi possível enviar o código.");
    } finally {
      setOcupado(false);
    }
  };

  const confirmarCodigo = async () => {
    if (!loginForm.code.trim()) { setLoginError("Digite o código que chegou no seu e-mail."); return; }

    setLoginError("");
    setOcupado(true);
    try {
      await conta.confirmarCodigo(loginForm.email, loginForm.code);

      // Já participava? Recupera o diário. É a primeira vez? Cria a linha —
      // e é neste ponto que a lista de liberados barra quem não comprou.
      let remoto = await conta.carregarProgresso<UserData>();
      if (!remoto) {
        remoto = await conta.iniciarProgresso<UserData>({
          nome: loginForm.name,
          profissao: loginForm.specialty,
          dados: { diagnosticoInicial: {}, journal: {}, templates: {} } as unknown as UserData,
        });
      }

      const dados: UserData = {
        ...remoto.dados,
        name: remoto.nome || loginForm.name,
        specialty: remoto.profissao || loginForm.specialty,
        startDate: remoto.dataInicio,
        diagnosticoInicial: remoto.dados?.diagnosticoInicial ?? {},
        journal: remoto.dados?.journal ?? {},
        templates: remoto.dados?.templates ?? {},
      };

      setUserData(dados);
      conta.gravarCache(dados);
      setSection("dashboard");
      setAviso("");
    } catch (erro) {
      setLoginError(erro instanceof Error ? erro.message : "Não foi possível entrar.");
    } finally {
      setOcupado(false);
    }
  };

  const sair = async () => {
    await conta.sair();
    setUserData(null);
    setLoginForm({ name: "", specialty: "", email: "", code: "" });
    setEtapaLogin("dados");
    setAviso("");
    setSection("login");
  };

  const updateDayEntry = (day: number, field: keyof DayEntry, value: any) => {
    setUserData(prev => {
      if (!prev) return prev;
      const existing = prev.journal[day] || defaultDayEntry();
      return { ...prev, journal: { ...prev.journal, [day]: { ...existing, [field]: value } } };
    });
  };

  const updateCustomField = (day: number, key: string, value: string) => {
    setUserData(prev => {
      if (!prev) return prev;
      const existing = prev.journal[day] || defaultDayEntry();
      return { ...prev, journal: { ...prev.journal, [day]: { ...existing, customFields: { ...existing.customFields, [key]: value } } } };
    });
  };

  const updateTemplate = (templateId: string, fieldKey: string, value: string) => {
    setUserData(prev => {
      if (!prev) return prev;
      return { ...prev, templates: { ...prev.templates, [`${templateId}_${fieldKey}`]: value } };
    });
  };

  const completedDays = userData ? Object.values(userData.journal).filter(d => d.desafioCompleto === "sim" || d.desafioCompleto === "parcial").length : 0;
  const currentWeek = Math.ceil(activeDay / 7);
  const weekData = weeks[currentWeek - 1];

  // ─── LOGIN ───────────────────────────────────────────────────────────────

  // Sem isto, quem já tem sessão vê a tela de login piscar antes do dashboard.
  if (verificandoSessao && section === "login") {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <Shield className="w-10 h-10 text-[#C9A84C]/40 animate-pulse" />
      </div>
    );
  }

  if (section === "login") {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4"
        style={{ backgroundImage: `url(${HERO_BG})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-[#0A0A0A]/85" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md">
          <div className="text-center mb-8">
            <Shield className="w-12 h-12 text-[#C9A84C] mx-auto mb-4" />
            <h1 className="font-cormorant text-4xl text-[#F5F0E8] mb-2">Desafio Guardião</h1>
            <p className="text-[#C9A84C] text-sm tracking-widest uppercase">21 Dias — Plataforma do Participante</p>
          </div>
          <div className="bg-white/3 border border-white/8 rounded-lg p-8 space-y-4">
            {!conta.supabaseConfigurado && (
              <p className="rounded border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs leading-relaxed text-amber-200">
                A área de membros ainda não foi configurada. Defina <code>VITE_SUPABASE_URL</code> e{" "}
                <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> e rode <code>supabase/desafio-schema.sql</code>.
              </p>
            )}

            {etapaLogin === "dados" ? (
              <>
                <div>
                  <label className="text-[#F5F0E8]/60 text-xs tracking-wider uppercase block mb-2">Seu Nome Completo</label>
                  <input type="text" value={loginForm.name} onChange={e => setLoginForm(p => ({ ...p, name: e.target.value }))}
                    placeholder={PLACEHOLDERS.nome}
                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-[#F5F0E8] placeholder-[#F5F0E8]/30 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors" />
                </div>
                <div>
                  <label className="text-[#F5F0E8]/60 text-xs tracking-wider uppercase block mb-2">{LABELS.profissao}</label>
                  <div className="relative">
                    <select value={loginForm.specialty} onChange={e => setLoginForm(p => ({ ...p, specialty: e.target.value }))}
                      className={`w-full appearance-none cursor-pointer bg-white/5 border border-white/10 rounded px-4 py-3 pr-10 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors ${loginForm.specialty ? "text-[#F5F0E8]" : "text-[#F5F0E8]/30"}`}>
                      <option value="" disabled>{PLACEHOLDERS.profissao}</option>
                      {PROFISSOES.map(profissao => (
                        <option key={profissao} value={profissao} className="bg-[#111] text-[#F5F0E8]">{profissao}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 w-4 h-4 -translate-y-1/2 text-[#C9A84C]" />
                  </div>
                </div>
                <div>
                  <label className="text-[#F5F0E8]/60 text-xs tracking-wider uppercase block mb-2">E-mail da sua compra</label>
                  <input type="email" value={loginForm.email} onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
                    placeholder={PLACEHOLDERS.email}
                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-[#F5F0E8] placeholder-[#F5F0E8]/30 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors" />
                </div>
                {loginError && <p className="text-red-400 text-xs">{loginError}</p>}
                <button onClick={pedirCodigo} disabled={ocupado || !conta.supabaseConfigurado}
                  className="w-full bg-[#C9A84C] hover:bg-[#B8963E] disabled:opacity-50 disabled:cursor-not-allowed text-[#0A0A0A] font-bold py-4 rounded text-sm tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2">
                  <LogIn className="w-4 h-4" /> {ocupado ? "ENVIANDO..." : "RECEBER CÓDIGO POR E-MAIL"}
                </button>
                <p className="text-[#F5F0E8]/30 text-xs text-center">
                  Use o mesmo e-mail da compra do Desafio. Enviamos um código de 6 dígitos — sem senha.
                </p>
              </>
            ) : (
              <>
                {aviso && <p className="text-[#C9A84C] text-xs leading-relaxed">{aviso}</p>}
                <div>
                  <label className="text-[#F5F0E8]/60 text-xs tracking-wider uppercase block mb-2">Código de Acesso</label>
                  <input type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={8}
                    value={loginForm.code} onChange={e => setLoginForm(p => ({ ...p, code: e.target.value }))}
                    onKeyDown={e => { if (e.key === "Enter") void confirmarCodigo(); }}
                    placeholder="000000"
                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-center text-2xl tracking-[0.4em] text-[#F5F0E8] placeholder-[#F5F0E8]/20 focus:outline-none focus:border-[#C9A84C]/60 transition-colors" />
                </div>
                {loginError && <p className="text-red-400 text-xs">{loginError}</p>}
                <button onClick={confirmarCodigo} disabled={ocupado}
                  className="w-full bg-[#C9A84C] hover:bg-[#B8963E] disabled:opacity-50 disabled:cursor-not-allowed text-[#0A0A0A] font-bold py-4 rounded text-sm tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2">
                  <LogIn className="w-4 h-4" /> {ocupado ? "ENTRANDO..." : "ACESSAR A PLATAFORMA"}
                </button>
                <button onClick={() => { setEtapaLogin("dados"); setLoginError(""); setAviso(""); }}
                  className="w-full text-[#F5F0E8]/40 hover:text-[#C9A84C] text-xs transition-colors">
                  Usar outro e-mail
                </button>
              </>
            )}
          </div>
          <p className="text-center text-[#F5F0E8]/30 text-xs mt-6">
            Dr. Santiago Vecina — Williams Island, Miami, FL
          </p>
        </motion.div>
      </div>
    );
  }

  // ─── MAIN PLATFORM ───────────────────────────────────────────────────────

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "journal", label: "Guardian Journal", icon: BookOpen },
    { id: "templates", label: "Templates", icon: FileText },
    { id: "progresso", label: "Meu Progresso", icon: Star },
  ] as const;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] flex flex-col">

      {/* TOP NAV */}
      <nav className="sticky top-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-[#C9A84C]" />
            <div>
              <span className="font-cormorant text-base text-[#F5F0E8] tracking-widest">GUARDIÕES</span>
              <span className="text-[#F5F0E8]/30 text-xs ml-2 hidden sm:inline">Desafio 21 Dias</span>
            </div>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button key={item.id} onClick={() => setSection(item.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded text-xs tracking-wider uppercase transition-all duration-200 ${
                  section === item.id ? "bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/30" : "text-[#F5F0E8]/50 hover:text-[#F5F0E8]/80"
                }`}>
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-[#F5F0E8] text-xs font-medium">{userData?.name}</p>
              <p className="text-[#F5F0E8]/40 text-xs">{userData?.specialty}</p>
            </div>
            <button onClick={sair} title="Sair da plataforma"
              className="hidden sm:flex items-center gap-1.5 text-[#F5F0E8]/40 hover:text-[#C9A84C] text-xs transition-colors">
              <LogOut className="w-3.5 h-3.5" /> Sair
            </button>
            <button className="md:hidden text-[#F5F0E8]/60 hover:text-[#F5F0E8]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
              className="overflow-hidden border-t border-white/5 md:hidden">
              <div className="px-4 py-2 space-y-1">
                {navItems.map(item => (
                  <button key={item.id} onClick={() => { setSection(item.id as any); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm transition-all ${
                      section === item.id ? "bg-[#C9A84C]/10 text-[#C9A84C]" : "text-[#F5F0E8]/60"
                    }`}>
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* CONTENT */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <AnimatePresence mode="wait">

          {/* ── DASHBOARD ── */}
          {section === "dashboard" && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="mb-8">
                <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-1">Bem-vindo de volta</p>
                <h1 className="font-cormorant text-4xl md:text-5xl font-light">
                  {userData?.name?.split(" ")[0]}, <em className="text-[#C9A84C]">você está no caminho.</em>
                </h1>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Dias Completos", value: completedDays, max: 21, icon: Check },
                  { label: "Dias Restantes", value: 21 - completedDays, max: 21, icon: Calendar },
                  { label: "Semana Atual", value: Math.min(Math.ceil((completedDays + 1) / 7), 3), max: 3, icon: Target },
                  { label: "Templates Preenchidos", value: Object.keys(userData?.templates || {}).filter(k => userData?.templates[k]).length > 0 ? templates.filter(t => t.fields.some(f => userData?.templates[`${t.id}_${f.key}`])).length : 0, max: 3, icon: FileText },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/3 border border-white/8 rounded-lg p-4 flex items-center gap-4">
                    <ProgressRing value={stat.value} max={stat.max} size={56} label="" />
                    <div>
                      <div className="font-cormorant text-2xl text-[#C9A84C]">{stat.value}</div>
                      <div className="text-[#F5F0E8]/40 text-xs leading-tight">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 21-day grid */}
              <div className="bg-white/2 border border-white/5 rounded-lg p-6 mb-8">
                <h2 className="font-cormorant text-2xl mb-4">Os 21 Dias</h2>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 21 }, (_, i) => i + 1).map(day => {
                    const entry = userData?.journal[day];
                    const isDone = entry?.desafioCompleto === "sim";
                    const isPartial = entry?.desafioCompleto === "parcial";
                    const isToday = day === completedDays + 1;
                    const weekNum = Math.ceil(day / 7);
                    const weekColors = ["#C9A84C", "#A0845C", "#8B7355"];
                    return (
                      <button key={day} onClick={() => { setActiveDay(day); setSection("journal"); }}
                        className={`aspect-square rounded flex flex-col items-center justify-center text-xs font-bold transition-all duration-200 border ${
                          isDone ? "bg-[#C9A84C]/20 border-[#C9A84C]/50 text-[#C9A84C]" :
                          isPartial ? "bg-[#C9A84C]/10 border-[#C9A84C]/30 text-[#C9A84C]/70" :
                          isToday ? "border-[#C9A84C] text-[#F5F0E8] bg-[#C9A84C]/5 ring-1 ring-[#C9A84C]/30" :
                          "border-white/8 text-[#F5F0E8]/30 hover:border-white/20"
                        }`}>
                        <span>{day}</span>
                        {isDone && <Check className="w-2.5 h-2.5 mt-0.5" />}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-4 mt-4 text-xs text-[#F5F0E8]/40">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#C9A84C]/20 border border-[#C9A84C]/50 inline-block" /> Completo</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#C9A84C]/10 border border-[#C9A84C]/30 inline-block" /> Parcial</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border border-[#C9A84C] inline-block" /> Hoje</span>
                </div>
              </div>

              {/* Quick actions */}
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { title: "Abrir Dia de Hoje", subtitle: `Dia ${completedDays + 1 <= 21 ? completedDays + 1 : 21}`, icon: BookOpen, action: () => { setActiveDay(Math.min(completedDays + 1, 21)); setSection("journal"); } },
                  { title: "Biblioteca de Templates", subtitle: "Agenda, Delegação e Script", icon: FileText, action: () => setSection("templates") },
                  { title: "Ver Meu Progresso", subtitle: "Notas e evolução dos territórios", icon: BarChart3, action: () => setSection("progresso") },
                ].map((item, i) => (
                  <button key={i} onClick={item.action}
                    className="bg-white/3 border border-white/8 hover:border-[#C9A84C]/30 rounded-lg p-5 text-left transition-all duration-300 group flex items-center gap-4">
                    <div className="w-10 h-10 rounded border border-[#C9A84C]/30 flex items-center justify-center flex-shrink-0 group-hover:bg-[#C9A84C]/10 transition-colors">
                      <item.icon className="w-5 h-5 text-[#C9A84C]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#F5F0E8] text-sm font-medium">{item.title}</p>
                      <p className="text-[#F5F0E8]/40 text-xs">{item.subtitle}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#F5F0E8]/20 group-hover:text-[#C9A84C] transition-colors flex-shrink-0" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── GUARDIAN JOURNAL ── */}
          {section === "journal" && (
            <motion.div key="journal" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-1">Guardian Journal Digital</p>
                  <h1 className="font-cormorant text-3xl md:text-4xl font-light">Rastreador dos 21 Dias</h1>
                </div>
              </div>

              {/* Day selector */}
              <div className="flex gap-1 overflow-x-auto pb-2 mb-6 scrollbar-hide">
                {Array.from({ length: 21 }, (_, i) => i + 1).map(day => {
                  const entry = userData?.journal[day];
                  const isDone = entry?.desafioCompleto === "sim" || entry?.desafioCompleto === "parcial";
                  const wk = Math.ceil(day / 7);
                  return (
                    <button key={day} onClick={() => setActiveDay(day)}
                      className={`flex-shrink-0 w-10 h-10 rounded text-xs font-bold transition-all border ${
                        activeDay === day ? "bg-[#C9A84C] text-[#0A0A0A] border-[#C9A84C]" :
                        isDone ? "bg-[#C9A84C]/15 border-[#C9A84C]/40 text-[#C9A84C]" :
                        "border-white/10 text-[#F5F0E8]/40 hover:border-white/20"
                      }`}>
                      {day}
                    </button>
                  );
                })}
              </div>

              {/* Active day */}
              {(() => {
                const wkIdx = Math.ceil(activeDay / 7) - 1;
                const wk = weeks[wkIdx];
                const dayInfo = wk.days.find(d => d.day === activeDay);
                const entry = userData?.journal[activeDay] || defaultDayEntry();
                if (!dayInfo) return null;
                const DayIcon = dayInfo.icon;

                return (
                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left — day info */}
                    <div className="lg:col-span-1 space-y-4">
                      <div className="bg-white/3 border border-white/8 rounded-lg p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded border border-[#C9A84C]/30 flex items-center justify-center">
                            <DayIcon className="w-4 h-4 text-[#C9A84C]" />
                          </div>
                          <div>
                            <p className="text-[#C9A84C] text-xs tracking-wider">{wk.subtitle} — {wk.theme}</p>
                            <p className="text-[#F5F0E8]/40 text-xs">Semana {wk.id}</p>
                          </div>
                        </div>
                        <h2 className="font-cormorant text-xl text-[#F5F0E8] mb-2">
                          Dia {activeDay} — {dayInfo.title}
                        </h2>
                        <p className="text-[#F5F0E8]/40 text-xs mb-3">{dayInfo.duration}</p>
                        {(dayInfo as any).isLive && (
                          <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded px-3 py-2 mb-3">
                            <p className="text-[#C9A84C] text-xs font-medium">🔴 Live ao vivo com Dr. Santiago</p>
                          </div>
                        )}
                        <div className="bg-white/3 rounded p-3">
                          <p className="text-[#F5F0E8]/50 text-xs font-medium uppercase tracking-wider mb-1">Desafio do Dia</p>
                          <p className="text-[#F5F0E8]/80 text-sm leading-relaxed">{dayInfo.desafio}</p>
                        </div>
                      </div>

                      {/* Nav between days */}
                      <div className="flex gap-2">
                        <button onClick={() => setActiveDay(d => Math.max(1, d - 1))} disabled={activeDay === 1}
                          className="flex-1 flex items-center justify-center gap-2 border border-white/10 rounded py-2 text-xs text-[#F5F0E8]/50 hover:border-white/20 disabled:opacity-30 transition-all">
                          <ChevronLeft className="w-3.5 h-3.5" /> Anterior
                        </button>
                        <button onClick={() => setActiveDay(d => Math.min(21, d + 1))} disabled={activeDay === 21}
                          className="flex-1 flex items-center justify-center gap-2 border border-white/10 rounded py-2 text-xs text-[#F5F0E8]/50 hover:border-white/20 disabled:opacity-30 transition-all">
                          Próximo <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Right — journal entry */}
                    <div className="lg:col-span-2 space-y-4">
                      {/* Basic metrics */}
                      <div className="bg-white/3 border border-white/8 rounded-lg p-5">
                        <h3 className="text-[#F5F0E8]/60 text-xs tracking-widest uppercase mb-4">Métricas do Dia</h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="text-[#F5F0E8]/50 text-xs block mb-1">Horas de sono</label>
                            <input type="text" value={entry.slept} onChange={e => updateDayEntry(activeDay, "slept", e.target.value)}
                              placeholder="Ex: 7h30"
                              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-[#F5F0E8] text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors" />
                          </div>
                          <div>
                            <ScoreSlider value={entry.sleepQuality} onChange={v => updateDayEntry(activeDay, "sleepQuality", v)} label="Qualidade do sono" />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          {[
                            { key: "trained", label: "Treino feito", icon: Dumbbell },
                            { key: "journal5min", label: "Diário 5 min", icon: BookOpen },
                            { key: "ritualDesligamento", label: "Ritual desligamento", icon: Moon },
                          ].map(item => (
                            <button key={item.key} onClick={() => updateDayEntry(activeDay, item.key as keyof DayEntry, !(entry as any)[item.key])}
                              className={`flex flex-col items-center gap-1.5 p-3 rounded border transition-all ${
                                (entry as any)[item.key] ? "bg-[#C9A84C]/15 border-[#C9A84C]/40 text-[#C9A84C]" : "border-white/8 text-[#F5F0E8]/30 hover:border-white/15"
                              }`}>
                              <item.icon className="w-4 h-4" />
                              <span className="text-xs text-center leading-tight">{item.label}</span>
                            </button>
                          ))}
                        </div>
                        <div className="space-y-3">
                          <ScoreSlider value={entry.notaTempo} onChange={v => updateDayEntry(activeDay, "notaTempo", v)} label="Nota — Tempo (controle da agenda)" />
                          <ScoreSlider value={entry.notaEnergia} onChange={v => updateDayEntry(activeDay, "notaEnergia", v)} label="Nota — Energia (corpo e vitalidade)" />
                          <ScoreSlider value={entry.notaPresenca} onChange={v => updateDayEntry(activeDay, "notaPresenca", v)} label="Nota — Presença (família e propósito)" />
                        </div>
                      </div>

                      {/* Desafio status */}
                      <div className="bg-white/3 border border-white/8 rounded-lg p-5">
                        <h3 className="text-[#F5F0E8]/60 text-xs tracking-widest uppercase mb-3">Status do Desafio</h3>
                        <div className="flex gap-2 mb-4">
                          {(["sim", "parcial", "nao"] as const).map(opt => (
                            <button key={opt} onClick={() => updateDayEntry(activeDay, "desafioCompleto", opt)}
                              className={`flex-1 py-2.5 rounded border text-xs font-medium uppercase tracking-wider transition-all ${
                                entry.desafioCompleto === opt
                                  ? opt === "sim" ? "bg-green-500/20 border-green-500/50 text-green-400"
                                    : opt === "parcial" ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-400"
                                    : "bg-red-500/20 border-red-500/50 text-red-400"
                                  : "border-white/10 text-[#F5F0E8]/30 hover:border-white/20"
                              }`}>
                              {opt === "sim" ? "✓ Completo" : opt === "parcial" ? "~ Parcial" : "✗ Não fiz"}
                            </button>
                          ))}
                        </div>
                        <div>
                          <label className="text-[#F5F0E8]/50 text-xs block mb-2">Anotações do dia (opcional)</label>
                          <textarea value={entry.notes} onChange={e => updateDayEntry(activeDay, "notes", e.target.value)}
                            rows={3} placeholder="O que foi bom hoje? O que foi difícil? O que quero registrar?"
                            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-[#F5F0E8] text-sm resize-none focus:outline-none focus:border-[#C9A84C]/50 transition-colors placeholder-[#F5F0E8]/20" />
                        </div>
                      </div>

                      {/* Aula assistida */}
                      <button onClick={() => updateDayEntry(activeDay, "aulaAssistida", !entry.aulaAssistida)}
                        className={`w-full flex items-center gap-3 p-4 rounded border transition-all ${
                          entry.aulaAssistida ? "bg-[#C9A84C]/10 border-[#C9A84C]/30 text-[#C9A84C]" : "border-white/8 text-[#F5F0E8]/40 hover:border-white/15"
                        }`}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${entry.aulaAssistida ? "bg-[#C9A84C] border-[#C9A84C]" : "border-white/20"}`}>
                          {entry.aulaAssistida && <Check className="w-3 h-3 text-[#0A0A0A]" />}
                        </div>
                        <span className="text-sm">Assisti à aula do Dia {activeDay}</span>
                      </button>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}

          {/* ── TEMPLATES ── */}
          {section === "templates" && (
            <motion.div key="templates" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="mb-6">
                <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-1">Bônus 2</p>
                <h1 className="font-cormorant text-3xl md:text-4xl font-light">Biblioteca de Templates</h1>
                <p className="text-[#F5F0E8]/50 mt-2">Preencha os campos abaixo. Seus dados são salvos automaticamente.</p>
              </div>

              {/* Template tabs */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                {templates.map((t, i) => (
                  <button key={t.id} onClick={() => setActiveTemplate(i)}
                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded border text-xs tracking-wider uppercase transition-all ${
                      activeTemplate === i ? "bg-[#C9A84C]/10 border-[#C9A84C]/40 text-[#C9A84C]" : "border-white/10 text-[#F5F0E8]/40 hover:border-white/20"
                    }`}>
                    <t.icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t.title.split(" ").slice(0, 2).join(" ")}</span>
                    <span className="sm:hidden">T{i + 1}</span>
                  </button>
                ))}
              </div>

              {(() => {
                const tmpl = templates[activeTemplate];
                return (
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                      <div className="bg-white/3 border border-white/8 rounded-lg p-5 sticky top-24">
                        <div className="w-10 h-10 rounded border border-[#C9A84C]/30 flex items-center justify-center mb-4">
                          <tmpl.icon className="w-5 h-5 text-[#C9A84C]" />
                        </div>
                        <h2 className="font-cormorant text-xl text-[#F5F0E8] mb-1">{tmpl.title}</h2>
                        <p className="text-[#C9A84C] text-xs tracking-wider mb-3">{tmpl.subtitle}</p>
                        <p className="text-[#F5F0E8]/50 text-sm leading-relaxed">{tmpl.description}</p>
                        <div className="mt-4 pt-4 border-t border-white/5">
                          <p className="text-[#F5F0E8]/30 text-xs">
                            {tmpl.fields.filter(f => userData?.templates[`${tmpl.id}_${f.key}`]).length} de {tmpl.fields.length} campos preenchidos
                          </p>
                          <div className="mt-2 h-1 bg-white/5 rounded overflow-hidden">
                            <div className="h-full bg-[#C9A84C] rounded transition-all duration-500"
                              style={{ width: `${(tmpl.fields.filter(f => userData?.templates[`${tmpl.id}_${f.key}`]).length / tmpl.fields.length) * 100}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="lg:col-span-2">
                      <div className="bg-white/3 border border-white/8 rounded-lg p-6 space-y-4">
                        {tmpl.fields.map(field => (
                          <div key={field.key}>
                            <label className="text-[#F5F0E8]/60 text-xs tracking-wider uppercase block mb-2">{field.label}</label>
                            {field.key.includes("protocolo") || field.key.includes("resultado") || field.key.includes("script") ? (
                              <textarea
                                value={userData?.templates[`${tmpl.id}_${field.key}`] || ""}
                                onChange={e => updateTemplate(tmpl.id, field.key, e.target.value)}
                                placeholder={field.placeholder} rows={3}
                                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-[#F5F0E8] text-sm resize-none focus:outline-none focus:border-[#C9A84C]/50 transition-colors placeholder-[#F5F0E8]/20" />
                            ) : (
                              <input type="text"
                                value={userData?.templates[`${tmpl.id}_${field.key}`] || ""}
                                onChange={e => updateTemplate(tmpl.id, field.key, e.target.value)}
                                placeholder={field.placeholder}
                                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-[#F5F0E8] text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors placeholder-[#F5F0E8]/20" />
                            )}
                          </div>
                        ))}
                        <div className="pt-2 border-t border-white/5">
                          <p className="text-[#F5F0E8]/30 text-xs flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-green-400" />
                            Dados salvos automaticamente no seu navegador
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}

          {/* ── PROGRESSO ── */}
          {section === "progresso" && (
            <motion.div key="progresso" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="mb-6">
                <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-1">Evolução</p>
                <h1 className="font-cormorant text-3xl md:text-4xl font-light">Meu Progresso</h1>
              </div>

              {/* Summary cards */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Território TEMPO", key: "notaTempo", color: "#C9A84C", icon: Clock },
                  { label: "Território CORPO", key: "notaEnergia", color: "#A0845C", icon: Dumbbell },
                  { label: "Território PRESENÇA", key: "notaPresenca", color: "#8B7355", icon: Heart },
                ].map(territory => {
                  const entries = Object.values(userData?.journal || {}).filter(e => (e as any)[territory.key] > 0);
                  const avg = entries.length > 0 ? (entries.reduce((sum, e) => sum + (e as any)[territory.key], 0) / entries.length).toFixed(1) : "—";
                  const TIcon = territory.icon;
                  return (
                    <div key={territory.key} className="bg-white/3 border border-white/8 rounded-lg p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded border flex items-center justify-center" style={{ borderColor: territory.color + "50" }}>
                          <TIcon className="w-4 h-4" style={{ color: territory.color }} />
                        </div>
                        <span className="text-[#F5F0E8]/60 text-xs tracking-wider uppercase">{territory.label}</span>
                      </div>
                      <div className="font-cormorant text-4xl mb-1" style={{ color: territory.color }}>{avg}</div>
                      <div className="text-[#F5F0E8]/30 text-xs">Média dos {entries.length} dias registrados</div>
                    </div>
                  );
                })}
              </div>

              {/* Day-by-day table */}
              <div className="bg-white/2 border border-white/5 rounded-lg overflow-hidden">
                <div className="px-5 py-4 border-b border-white/5">
                  <h2 className="font-cormorant text-xl">Rastreador Consolidado — 21 Dias</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-white/5">
                        {["Dia", "Sono", "Qualidade", "Treino", "Diário 5min", "Ritual", "Tempo", "Energia", "Presença", "Desafio"].map(h => (
                          <th key={h} className="px-3 py-3 text-left text-[#F5F0E8]/40 font-normal tracking-wider uppercase whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 21 }, (_, i) => i + 1).map(day => {
                        const e = userData?.journal[day];
                        const wk = Math.ceil(day / 7);
                        const wkColors = ["#C9A84C", "#A0845C", "#8B7355"];
                        return (
                          <tr key={day} className="border-b border-white/3 hover:bg-white/2 transition-colors cursor-pointer"
                            onClick={() => { setActiveDay(day); setSection("journal"); }}>
                            <td className="px-3 py-2.5">
                              <span className="font-bold" style={{ color: wkColors[wk - 1] }}>{day}</span>
                            </td>
                            <td className="px-3 py-2.5 text-[#F5F0E8]/60">{e?.slept || "—"}</td>
                            <td className="px-3 py-2.5 text-[#F5F0E8]/60">{e?.sleepQuality ? `${e.sleepQuality}/10` : "—"}</td>
                            <td className="px-3 py-2.5">{e?.trained ? <Check className="w-3.5 h-3.5 text-green-400" /> : <span className="text-[#F5F0E8]/20">—</span>}</td>
                            <td className="px-3 py-2.5">{e?.journal5min ? <Check className="w-3.5 h-3.5 text-green-400" /> : <span className="text-[#F5F0E8]/20">—</span>}</td>
                            <td className="px-3 py-2.5">{e?.ritualDesligamento ? <Check className="w-3.5 h-3.5 text-green-400" /> : <span className="text-[#F5F0E8]/20">—</span>}</td>
                            <td className="px-3 py-2.5 text-[#C9A84C]">{e?.notaTempo ? `${e.notaTempo}/10` : "—"}</td>
                            <td className="px-3 py-2.5 text-[#A0845C]">{e?.notaEnergia ? `${e.notaEnergia}/10` : "—"}</td>
                            <td className="px-3 py-2.5 text-[#8B7355]">{e?.notaPresenca ? `${e.notaPresenca}/10` : "—"}</td>
                            <td className="px-3 py-2.5">
                              {e?.desafioCompleto === "sim" ? <span className="text-green-400">✓</span> :
                               e?.desafioCompleto === "parcial" ? <span className="text-yellow-400">~</span> :
                               e?.desafioCompleto === "nao" ? <span className="text-red-400">✗</span> :
                               <span className="text-[#F5F0E8]/20">—</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#C9A84C]" />
            <span className="text-[#F5F0E8]/30 text-xs">Comunidade Guardiões — Dr. Santiago Vecina</span>
          </div>
          <a href="https://www.drsantiagovecina.com" target="_blank" rel="noopener noreferrer"
            className="text-[#F5F0E8]/20 hover:text-[#C9A84C] text-xs transition-colors">
            drsantiagovecina.com
          </a>
        </div>
      </footer>
    </div>
  );
}
