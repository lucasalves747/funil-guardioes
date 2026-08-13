/**
 * PÁGINA DE CAPTURA — ISCAS DIGITAIS GRATUITAS
 * Design: Dark Manifesto — Quiet Luxury
 * Paleta: #0A0A0A (fundo) | #C9A84C (dourado) | #F5F0E8 (creme)
 * Tipografia: Cormorant Garamond (títulos) + DM Sans (corpo)
 * Público: Médicos brasileiros — Brasil, EUA, Europa
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, BookOpen, Brain, Video, ChevronRight, Check, ArrowRight, Star } from "lucide-react";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029042428/CkXWqekrf35rtrHkYVC25q/captura_hero_guardioes-UEMjhAEMEGZS5ctSJyFNez.webp";
const QUIZ_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029042428/CkXWqekrf35rtrHkYVC25q/captura_quiz_mockup-Tce3WFKyRHctDPLAoAoi53.webp";
const EBOOK_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029042428/CkXWqekrf35rtrHkYVC25q/captura_ebook_mockup-YsdPMwsvs9Jy46gKDjztoJ.webp";
const MASTERCLASS_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029042428/CkXWqekrf35rtrHkYVC25q/captura_masterclass_mockup-oFnhWVK48RTk775jC9PpSs.webp";

const iscas = [
  {
    id: 1,
    icon: Brain,
    tag: "DIAGNÓSTICO GRATUITO",
    title: "O Teste do Médico Esgotado",
    subtitle: "18 perguntas. 5 minutos. Um diagnóstico que nenhum colega vai te dar.",
    description: "Descubra em qual dos 4 perfis você está: Colapso, Alerta, Transição ou Guardião Ativo. Você recebe um diagnóstico personalizado dos 6 territórios da sua vida — incluindo estresse crônico, nível de energia e libido — com 5 ações específicas para o seu perfil.",
    cta: "FAZER O TESTE AGORA",
    badge: "Mais acessado",
    img: QUIZ_IMG,
    color: "#C9A84C",
    items: [
      "Avaliação dos 6 Territórios: Tempo, Corpo, Família, Negócio, Propósito e Saúde Fisiológica",
      "Diagnóstico de estresse crônico, energia e libido com base clínica",
      "5 ações personalizadas para o seu perfil de resultado",
      "Resultado imediato + plano de ação enviado por email"
    ]
  },
  {
    id: 2,
    icon: BookOpen,
    tag: "EBOOK GRATUITO",
    title: "As 10 Horas Escondidas",
    subtitle: "O guia que revela onde o seu tempo está sendo roubado — e como recuperá-lo.",
    description: "Um guia prático de 4 capítulos que mapeia as horas invisíveis que você perde toda semana em tarefas que não exigem o seu CRM. Médicos que aplicaram este método recuperaram em média 12 horas semanais sem reduzir atendimentos.",
    cta: "BAIXAR O EBOOK",
    badge: "Mais baixado",
    img: EBOOK_IMG,
    color: "#C9A84C",
    items: [
      "Capítulo 1: A Auditoria das 168 Horas — o método clínico para mapear o seu tempo real",
      "Capítulo 2: Os 4 Ladrões de Tempo do Médico — e como eliminá-los esta semana",
      "Capítulo 3: O Sistema de Delegação Médica — o que só você pode fazer",
      "Capítulo 4: O Protocolo de Recuperação de 30 Dias — hora a hora"
    ]
  },
  {
    id: 3,
    icon: Shield,
    tag: "CALCULADORA GRATUITA",
    title: "A Calculadora da Hora Real",
    subtitle: "Descubra quanto você realmente ganha por hora — e o número vai te surpreender.",
    description: "A maioria dos médicos superestima o valor da sua hora em até 300%. Esta calculadora revela o valor real da sua hora médica depois de descontar plantões, burocracia, deslocamento e tempo de recuperação — e mostra o caminho para dobrar esse número.",
    cta: "CALCULAR AGORA",
    badge: "Mais impactante",
    img: QUIZ_IMG,
    color: "#C9A84C",
    items: [
      "Cálculo do valor real da hora médica (não o valor de tabela)",
      "Comparativo com médicos de alta performance no mesmo nível de experiência",
      "Identificação das 3 principais perdas financeiras invisíveis",
      "Plano de otimização personalizado com projeção de 12 meses"
    ]
  },
  {
    id: 4,
    icon: Video,
    tag: "MASTERCLASS GRATUITA",
    title: "O Paradoxo do Guardião",
    subtitle: "A aula de 90 minutos que nenhuma faculdade de medicina vai te dar.",
    description: "Por que o médico que mais cuida dos outros é o que menos cuida de si mesmo? Nesta masterclass ao vivo gravada, o Dr. Santiago Vecina revela o mecanismo psicológico e fisiológico por trás do Paradoxo do Guardião — e o caminho de saída.",
    cta: "ASSISTIR AGORA",
    badge: "Mais transformador",
    img: MASTERCLASS_IMG,
    color: "#C9A84C",
    items: [
      "O mecanismo neurológico do burnout médico — por que o seu cérebro normaliza o colapso",
      "Os 5 Territórios da Performance Integral — o framework que 500+ médicos já aplicaram",
      "A história real: 2 burnouts, casamento restaurado e Williams Island",
      "O próximo passo: como entrar para a Comunidade Guardiões"
    ]
  }
];

const testimonials = [
  {
    name: "Dra. Fernanda Alves",
    specialty: "Cardiologista",
    city: "São Paulo, SP",
    text: "Fiz o teste e recebi um diagnóstico mais honesto do que qualquer conversa que tive com colegas nos últimos 5 anos. As 5 ações do meu perfil mudaram minha rotina em 7 dias.",
    score: 5
  },
  {
    name: "Dr. Ricardo Mendes",
    specialty: "Ortopedista",
    city: "Miami, FL",
    text: "A Calculadora da Hora Real foi um choque de realidade. Descobri que estava ganhando R$47/hora real depois de todos os descontos. Hoje ganho R$340. O método funciona.",
    score: 5
  },
  {
    name: "Dra. Camila Torres",
    specialty: "Pediatra",
    city: "Lisboa, Portugal",
    text: "O ebook das 10 Horas Escondidas me devolveu as tardes de quinta-feira. Parece simples, mas recuperar esse tempo foi o que salvou meu casamento.",
    score: 5
  }
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-[#C9A84C] text-[#C9A84C]" />
      ))}
    </div>
  );
}

function CaptureForm({ iscaTitle }: { iscaTitle: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [crm, setCrm] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="w-16 h-16 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-[#C9A84C]" />
        </div>
        <h3 className="font-cormorant text-2xl text-[#F5F0E8] mb-2">Acesso Enviado</h3>
        <p className="text-[#F5F0E8]/60 text-sm">Verifique o seu email. O acesso chega em até 2 minutos.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <input
          type="text"
          placeholder="Seu nome completo"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-[#F5F0E8] placeholder-[#F5F0E8]/30 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
        />
      </div>
      <div>
        <input
          type="email"
          placeholder="Seu melhor email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-[#F5F0E8] placeholder-[#F5F0E8]/30 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="CRM (opcional)"
          value={crm}
          onChange={e => setCrm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-[#F5F0E8] placeholder-[#F5F0E8]/30 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-[#C9A84C] hover:bg-[#B8963E] text-[#0A0A0A] font-bold py-4 rounded text-sm tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 group"
      >
        QUERO ACESSO GRATUITO
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
      <p className="text-[#F5F0E8]/30 text-xs text-center">
        Sem spam. Seus dados são protegidos. Cancele quando quiser.
      </p>
    </form>
  );
}

export default function Iscas() {
  const [activeIsca, setActiveIsca] = useState(0);
  const [showForm, setShowForm] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8]">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-[#C9A84C]" />
            <span className="font-cormorant text-lg tracking-widest text-[#F5F0E8]">GUARDIÕES</span>
          </a>
          <a
            href="https://www.drsantiagovecina.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#F5F0E8]/50 hover:text-[#C9A84C] text-xs tracking-widest uppercase transition-colors"
          >
            drsantiagovecina.com
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${HERO_IMG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/85 to-[#0A0A0A]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-12 bg-[#C9A84C]" />
              <span className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase font-medium">
                Comunidade Guardiões — Acesso Gratuito
              </span>
            </div>

            <h1 className="font-cormorant text-5xl md:text-7xl font-light leading-[1.05] mb-6">
              Você cuida de todos.
              <br />
              <em className="text-[#C9A84C]">Quem cuida de você?</em>
            </h1>

            <p className="text-[#F5F0E8]/70 text-lg leading-relaxed mb-10 max-w-xl">
              4 recursos gratuitos criados por um médico que viveu 2 burnouts, restaurou o casamento e hoje mora em Williams Island — para médicos que ainda não pararam para cuidar de si mesmos.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              {iscas.map((isca, i) => (
                <button
                  key={isca.id}
                  onClick={() => {
                    setActiveIsca(i);
                    document.getElementById("iscas")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded border text-xs tracking-widest uppercase transition-all duration-300 ${
                    activeIsca === i
                      ? "border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C]"
                      : "border-white/20 text-[#F5F0E8]/60 hover:border-[#C9A84C]/50 hover:text-[#F5F0E8]"
                  }`}
                >
                  <isca.icon className="w-3.5 h-3.5" />
                  {isca.tag.split(" ")[0]}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="font-cormorant text-3xl text-[#C9A84C]">500+</div>
                <div className="text-[#F5F0E8]/40 text-xs tracking-wider">Médicos</div>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="text-center">
                <div className="font-cormorant text-3xl text-[#C9A84C]">3</div>
                <div className="text-[#F5F0E8]/40 text-xs tracking-wider">Países</div>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="text-center">
                <div className="font-cormorant text-3xl text-[#C9A84C]">5</div>
                <div className="text-[#F5F0E8]/40 text-xs tracking-wider">Livros</div>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="text-center">
                <div className="font-cormorant text-3xl text-[#C9A84C]">100%</div>
                <div className="text-[#F5F0E8]/40 text-xs tracking-wider">Gratuito</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PARADOXO */}
      <section className="py-20 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-cormorant text-2xl md:text-3xl text-[#F5F0E8]/80 leading-relaxed italic mb-8">
              "O médico estudou 12 anos para cuidar dos outros. Ninguém ensinou ele a cuidar de si mesmo. Essa é a ferida que nenhum colega vai nomear — e que eu passei 20 anos fingindo que não existia."
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-16 bg-[#C9A84C]/40" />
              <div>
                <p className="text-[#C9A84C] text-sm font-medium tracking-wider">Dr. Santiago Vecina</p>
                <p className="text-[#F5F0E8]/40 text-xs tracking-wider">Médico | Autor | Williams Island, Miami</p>
              </div>
              <div className="h-px w-16 bg-[#C9A84C]/40" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ISCAS */}
      <section id="iscas" className="py-24">
        <div className="max-w-6xl mx-auto px-6">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-[#C9A84C]/40" />
              <span className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase">4 Recursos Gratuitos</span>
              <div className="h-px w-12 bg-[#C9A84C]/40" />
            </div>
            <h2 className="font-cormorant text-4xl md:text-5xl font-light mb-4">
              Escolha por onde começar
            </h2>
            <p className="text-[#F5F0E8]/50 max-w-xl mx-auto">
              Cada recurso foi criado para um momento específico da sua jornada. Você pode acessar todos — são completamente gratuitos.
            </p>
          </motion.div>

          {/* TABS */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {iscas.map((isca, i) => (
              <button
                key={isca.id}
                onClick={() => setActiveIsca(i)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs tracking-widest uppercase transition-all duration-300 ${
                  activeIsca === i
                    ? "border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C]"
                    : "border-white/10 text-[#F5F0E8]/40 hover:border-white/20 hover:text-[#F5F0E8]/70"
                }`}
              >
                <isca.icon className="w-3.5 h-3.5" />
                {isca.tag}
              </button>
            ))}
          </div>

          {/* ACTIVE ISCA */}
          {iscas.map((isca, i) => (
            <motion.div
              key={isca.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: activeIsca === i ? 1 : 0, y: activeIsca === i ? 0 : 20 }}
              className={activeIsca === i ? "block" : "hidden"}
            >
              <div className="grid lg:grid-cols-2 gap-12 items-center">

                {/* LEFT — CONTENT */}
                <div>
                  <div className="inline-flex items-center gap-2 bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-full px-4 py-1.5 mb-6">
                    <isca.icon className="w-3.5 h-3.5 text-[#C9A84C]" />
                    <span className="text-[#C9A84C] text-xs tracking-widest uppercase">{isca.badge}</span>
                  </div>

                  <h3 className="font-cormorant text-4xl md:text-5xl font-light mb-3 leading-tight">
                    {isca.title}
                  </h3>
                  <p className="text-[#C9A84C] text-base mb-6 leading-relaxed">
                    {isca.subtitle}
                  </p>
                  <p className="text-[#F5F0E8]/60 leading-relaxed mb-8">
                    {isca.description}
                  </p>

                  <div className="space-y-3 mb-10">
                    {isca.items.map((item, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full border border-[#C9A84C]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-[#C9A84C]" />
                        </div>
                        <span className="text-[#F5F0E8]/70 text-sm leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowForm(showForm === i ? null : i)}
                    className="flex items-center gap-3 bg-[#C9A84C] hover:bg-[#B8963E] text-[#0A0A0A] font-bold px-8 py-4 rounded text-sm tracking-widest uppercase transition-all duration-300 group"
                  >
                    {isca.cta}
                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${showForm === i ? "rotate-90" : "group-hover:translate-x-1"}`} />
                  </button>
                </div>

                {/* RIGHT — IMAGE + FORM */}
                <div className="space-y-6">
                  <div className="relative rounded-lg overflow-hidden border border-white/5">
                    <img
                      src={isca.img}
                      alt={isca.title}
                      className="w-full object-cover"
                      style={{ maxHeight: "380px", objectPosition: "center top" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/60 to-transparent" />
                  </div>

                  {showForm === i && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/3 border border-white/8 rounded-lg p-6"
                    >
                      <h4 className="font-cormorant text-xl text-[#F5F0E8] mb-1">
                        Acesso Imediato e Gratuito
                      </h4>
                      <p className="text-[#F5F0E8]/40 text-xs mb-5">
                        Preencha abaixo para receber o acesso em até 2 minutos.
                      </p>
                      <CaptureForm iscaTitle={isca.title} />
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SOBRE O DR. SANTIAGO */}
      <section className="py-20 bg-white/2 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-[#C9A84C]/40" />
                <span className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase">Quem é o Dr. Santiago</span>
              </div>
              <h2 className="font-cormorant text-4xl font-light mb-6 leading-tight">
                Médico que viveu o problema
                <br />
                <em className="text-[#C9A84C]">antes de criar a solução</em>
              </h2>
              <div className="space-y-4 text-[#F5F0E8]/60 leading-relaxed">
                <p>
                  O Dr. Santiago Vecina não criou a Comunidade Guardiões a partir de uma teoria. Criou a partir de 2 burnouts, um casamento que quase não sobreviveu à medicina, e 20 anos de uma carreira brilhante por fora e vazia por dentro.
                </p>
                <p>
                  Hoje mora em Williams Island, Miami. Completou o Ultraman — uma das provas de resistência mais exigentes do mundo. Escreveu 5 livros. E ajuda médicos em 3 países a construir uma vida que não precisa ser abandonada para que a carreira funcione.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                {[
                  { label: "Livros Publicados", value: "5" },
                  { label: "Ultraman Finisher", value: "✓" },
                  { label: "Médicos Impactados", value: "500+" },
                  { label: "Williams Island, Miami", value: "📍" }
                ].map((stat, i) => (
                  <div key={i} className="border border-white/8 rounded p-4">
                    <div className="font-cormorant text-2xl text-[#C9A84C] mb-1">{stat.value}</div>
                    <div className="text-[#F5F0E8]/40 text-xs tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white/3 border border-white/8 rounded-lg p-8">
                <Shield className="w-12 h-12 text-[#C9A84C] mb-6" />
                <h3 className="font-cormorant text-2xl text-[#F5F0E8] mb-4">
                  A Comunidade Guardiões
                </h3>
                <p className="text-[#F5F0E8]/60 leading-relaxed mb-6">
                  Uma comunidade fechada para médicos que decidiram parar de cuidar de todos menos de si mesmos. Os 5 Territórios. O método. A transformação.
                </p>
                <div className="space-y-3">
                  {[
                    "Aulas semanais ao vivo com o Dr. Santiago",
                    "Comunidade de médicos de alto nível",
                    "Acesso ao Sistema Guardião 90 Dias",
                    "Evento METAMORFOSE em Miami"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-[#C9A84C] flex-shrink-0" />
                      <span className="text-[#F5F0E8]/70 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <a
                  href="#iscas"
                  className="mt-6 flex items-center gap-2 text-[#C9A84C] text-sm tracking-wider uppercase hover:gap-3 transition-all duration-300"
                >
                  Começar pelo gratuito
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-[#C9A84C]/40" />
              <span className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase">Depoimentos Reais</span>
              <div className="h-px w-12 bg-[#C9A84C]/40" />
            </div>
            <h2 className="font-cormorant text-4xl font-light">
              O que médicos dizem depois de acessar
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/3 border border-white/8 rounded-lg p-6 hover:border-[#C9A84C]/20 transition-colors duration-300"
              >
                <StarRating count={t.score} />
                <p className="text-[#F5F0E8]/70 text-sm leading-relaxed my-4 italic">
                  "{t.text}"
                </p>
                <div className="border-t border-white/8 pt-4">
                  <p className="text-[#F5F0E8] text-sm font-medium">{t.name}</p>
                  <p className="text-[#C9A84C] text-xs tracking-wider">{t.specialty}</p>
                  <p className="text-[#F5F0E8]/30 text-xs">{t.city}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Shield className="w-12 h-12 text-[#C9A84C] mx-auto mb-6" />
            <h2 className="font-cormorant text-4xl md:text-5xl font-light mb-4">
              O primeiro passo é gratuito.
              <br />
              <em className="text-[#C9A84C]">A transformação é sua.</em>
            </h2>
            <p className="text-[#F5F0E8]/50 mb-10 leading-relaxed">
              Escolha o recurso que mais faz sentido para o seu momento agora. Você pode acessar todos os quatro — são completamente gratuitos e entregues imediatamente.
            </p>
            <button
              onClick={() => {
                setActiveIsca(0);
                document.getElementById("iscas")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-3 bg-[#C9A84C] hover:bg-[#B8963E] text-[#0A0A0A] font-bold px-10 py-4 rounded text-sm tracking-widest uppercase transition-all duration-300 group"
            >
              ESCOLHER MEU RECURSO GRATUITO
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#C9A84C]" />
            <span className="font-cormorant text-sm tracking-widest text-[#F5F0E8]/60">GUARDIÕES — Dr. Santiago Vecina</span>
          </div>
          <p className="text-[#F5F0E8]/30 text-xs">
            © 2025 Dr. Santiago Vecina. Williams Island, Miami, FL.
          </p>
          <a
            href="https://www.drsantiagovecina.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#F5F0E8]/30 hover:text-[#C9A84C] text-xs tracking-wider transition-colors"
          >
            drsantiagovecina.com
          </a>
        </div>
      </footer>
    </div>
  );
}
