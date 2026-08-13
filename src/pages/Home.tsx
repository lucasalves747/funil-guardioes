import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { LIVROS } from "@/lib/livros";
import { Instagram, Youtube, Linkedin, MessageCircle, Menu, X, ArrowRight, ChevronDown, Shield, BookOpen, Users, Star, MapPin, Award, Zap, Heart, Briefcase, Compass } from "lucide-react";

// ─── Image URLs ───────────────────────────────────────────────────────────────
const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029042428/CkXWqekrf35rtrHkYVC25q/hero_williams_island-SQ5EpVpWBzZRWsviwoXnFm.png";
const GUARDIOES_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029042428/CkXWqekrf35rtrHkYVC25q/guardioes_banner-VjAmqcWTsg2GkUFAP7RQaX.png";
const PORTRAIT_IMG = "https://assets.cdn.filesafe.space/dkM0aNpySiIFf3uusFTa/media/69c192d4ad14000bb821045e.jpg";
const ULTRAMAN_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029042428/CkXWqekrf35rtrHkYVC25q/ultraman_performance-KuUfe3LdsowAFSQR58iwZt.png";
const BOOKS_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029042428/CkXWqekrf35rtrHkYVC25q/books_collection-8WPXaVAWc2VMrcZMsXPcPb.png";

// ─── Data ─────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Início", href: "#hero" },
  { label: "Sobre", href: "#sobre" },
  { label: "Os 5 Pilares", href: "#pilares" },
  { label: "Livros", href: "#livros" },
  { label: "Guardiões", href: "#guardioes" },
  { label: "Contato", href: "#contato" },
];

const CREDENTIALS = [
  { value: "5", label: "Livros Publicados" },
  { value: "2×", label: "Ultraman Finisher" },
  { value: "15+", label: "Anos de Clínica" },
  { value: "Miami", label: "Williams Island" },
];

const PILLARS = [
  {
    roman: "I",
    icon: Zap,
    tag: "Ativo de Negócio",
    title: "Saúde Estratégica",
    desc: "Fisiologia, metabolismo e energia como base para a alta performance. Um líder sem saúde não constrói nada.",
    items: ["Otimização hormonal", "Biohacking para executivos", "Sono e recuperação", "Nutrição de performance"],
  },
  {
    roman: "II",
    icon: Compass,
    tag: "Clareza Total",
    title: "Mente e Clareza",
    desc: "Inteligência emocional e foco para decisões críticas sob pressão. Uma mente fraca não sustenta um negócio forte.",
    items: ["Superação de crenças limitantes", "Disciplina e foco", "Tomada de decisão", "Resiliência mental"],
  },
  {
    roman: "III",
    icon: Users,
    tag: "Cultura Forte",
    title: "Liderança com Propósito",
    desc: "Formação de líderes e influência que transcende o ambiente de trabalho.",
    items: ["Liderança servidora", "Formação de equipes", "Cultura organizacional", "Liderança familiar"],
  },
  {
    roman: "IV",
    icon: Briefcase,
    tag: "Escala nos EUA",
    title: "Negócios Sustentáveis",
    desc: "Estrutura, processos e mentalidade para crescer no mercado americano.",
    items: ["Sistemas e processos", "Internacionalização EUA", "Networking de elite", "Negócio autônomo"],
  },
  {
    roman: "V",
    icon: Heart,
    tag: "Impacto Eterno",
    title: "Legado e Família",
    desc: "Família estruturada e valores que permanecem por gerações. O sucesso sem legado é apenas um número.",
    items: ["Herança de valores", "Casamento alinhado", "Paternidade ativa", "Legado geracional"],
  },
];

// Os livros vivem em @/lib/livros — mesma fonte usada pelas páginas /livros/:slug.

const TERRITORIES = [
  { icon: "⏳", label: "Tempo" },
  { icon: "🔥", label: "Corpo" },
  { icon: "🏠", label: "Família" },
  { icon: "📈", label: "Negócio" },
  { icon: "🧭", label: "Propósito" },
];

const TESTIMONIALS = [
  {
    quote: "O Dr. Santiago me ajudou a enxergar que meu maior ativo não era minha empresa — era minha saúde. Hoje faturamos 3x mais e eu trabalho menos.",
    name: "Dr. Rodrigo M.",
    role: "Cirurgião · São Paulo, SP",
    stars: 5,
  },
  {
    quote: "Eu cheguei no limite. Dois burnouts, casamento destruído, empresa crescendo. O método dos 5 Pilares me devolveu o que o sucesso tinha tirado.",
    name: "Carlos A.",
    role: "CEO · Miami, FL",
    stars: 5,
  },
  {
    quote: "Pela primeira vez na minha vida como médico, alguém me perguntou: 'Mas quem cuida de você?' Essa pergunta mudou tudo.",
    name: "Dra. Fernanda L.",
    role: "Clínica Geral · Lisboa, Portugal",
    stars: 5,
  },
];

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useIntersectionObserver(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, isVisible };
}

// ─── Components ───────────────────────────────────────────────────────────────
function GoldDivider() {
  return <div className="w-12 h-px" style={{ background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }} />;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="section-label">{children}</span>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(8,8,8,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(201,168,76,0.1)" : "none",
      }}
    >
      <div className="container flex items-center justify-between py-5">
        {/* Logo */}
        <button onClick={() => handleNav("#hero")} className="flex flex-col items-start gap-0">
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem", fontWeight: 600, color: "#F5F0E8", letterSpacing: "0.02em" }}>
            Dr. Santiago Vecina
          </span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", fontWeight: 400, letterSpacing: "0.3em", color: "#C9A84C", textTransform: "uppercase" }}>
            Performance Integral
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", fontWeight: 400, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(245,240,232,0.7)", transition: "color 0.3s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,240,232,0.7)")}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden lg:block">
          <button className="btn-gold" onClick={() => handleNav("#contato")}>
            Agendar Conversa
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button className="lg:hidden text-cream" onClick={() => setMobileOpen(!mobileOpen)} style={{ color: "#F5F0E8" }}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ background: "rgba(8,8,8,0.98)", borderTop: "1px solid rgba(201,168,76,0.1)" }}>
          <div className="container py-6 flex flex-col gap-5">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", fontWeight: 400, letterSpacing: "0.15em", textTransform: "uppercase", color: "#F5F0E8", textAlign: "left" }}
              >
                {link.label}
              </button>
            ))}
            <button className="btn-gold mt-2" onClick={() => handleNav("#contato")}>
              Agendar Conversa
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={HERO_BG} alt="Williams Island Marina" className="w-full h-full object-cover" style={{ objectPosition: "center 40%" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(105deg, rgba(8,8,8,0.88) 0%, rgba(8,8,8,0.65) 50%, rgba(8,8,8,0.3) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,8,8,0.9) 0%, transparent 40%)" }} />
      </div>

      <div className="container relative z-10 pt-32 pb-24">
        <div className="max-w-3xl">
          {/* Location badge */}
          <div className="flex items-center gap-2 mb-8 animate-fade-in-up">
            <MapPin size={12} style={{ color: "#C9A84C" }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", fontWeight: 400, letterSpacing: "0.25em", textTransform: "uppercase", color: "#C9A84C" }}>
              Williams Island · Aventura, Miami
            </span>
          </div>

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6 animate-fade-in-up animate-delay-100">
            <div className="w-8 h-px" style={{ background: "#C9A84C" }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", fontWeight: 400, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(245,240,232,0.6)" }}>
              Médico · Empresário · Mentor
            </span>
          </div>

          {/* Main heading */}
          <h1 className="display-heading animate-fade-in-up animate-delay-200" style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)", color: "#F5F0E8", marginBottom: "1.5rem" }}>
            Dr. Santiago<br />
            <span style={{ color: "#C9A84C" }}>Vecina</span>
          </h1>

          {/* Subheading */}
          <p className="animate-fade-in-up animate-delay-300" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", fontWeight: 300, fontStyle: "italic", color: "rgba(245,240,232,0.75)", marginBottom: "2rem", lineHeight: 1.5 }}>
            Performance Integral — Saúde, Negócios & Legado
          </p>

          {/* Quote */}
          <blockquote className="animate-fade-in-up animate-delay-400" style={{ borderLeft: "2px solid #C9A84C", paddingLeft: "1.25rem", marginBottom: "3rem", maxWidth: "560px" }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", fontWeight: 300, fontStyle: "italic", color: "rgba(245,240,232,0.65)", lineHeight: 1.7 }}>
              "Pessoas alinhadas constroem empresas fortes. Empresas fortes sustentam famílias estruturadas. Famílias estruturadas constroem legado."
            </p>
          </blockquote>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 animate-fade-in-up animate-delay-500">
            <a href="https://link.salee.ai/widget/survey/Mufrh87YeRqFqFe3OS4m" target="_blank" rel="noopener noreferrer" className="btn-gold">
              Quero a Performance Integral
              <ArrowRight size={14} />
            </a>
            <button className="btn-ghost" onClick={() => document.querySelector("#sobre")?.scrollIntoView({ behavior: "smooth" })}>
              Conhecer o Dr. Santiago
            </button>
          </div>

          {/* Credentials */}
          <div className="flex flex-wrap gap-8 mt-14 animate-fade-in-up animate-delay-600">
            {CREDENTIALS.map((c) => (
              <div key={c.label} className="flex flex-col gap-1">
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.75rem", fontWeight: 600, color: "#C9A84C", lineHeight: 1 }}>{c.value}</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", fontWeight: 400, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(245,240,232,0.45)" }}>{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce" style={{ opacity: 0.4 }}>
        <ChevronDown size={18} style={{ color: "#C9A84C" }} />
      </div>
    </section>
  );
}

// ─── Sobre ────────────────────────────────────────────────────────────────────
function SobreSection() {
  const { ref, isVisible } = useIntersectionObserver();
  return (
    <section id="sobre" ref={ref} className="py-32 overflow-hidden" style={{ background: "oklch(0.08 0.005 285)" }}>
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className={`relative transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}>
            <div className="relative">
              <img src={PORTRAIT_IMG} alt="Dr. Santiago Vecina" className="w-full max-w-md mx-auto lg:mx-0" style={{ filter: "brightness(0.95) contrast(1.05)" }} />
              {/* Gold frame accent */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-yellow-600/20" style={{ borderColor: "rgba(201,168,76,0.2)" }} />
              <div className="absolute -top-4 -left-4 w-20 h-20 border border-yellow-600/20" style={{ borderColor: "rgba(201,168,76,0.2)" }} />
            </div>
            {/* Ultraman badge */}
            <div className="absolute bottom-8 -right-4 lg:-right-8 card-dark p-4 max-w-xs" style={{ background: "rgba(8,8,8,0.95)", border: "1px solid rgba(201,168,76,0.2)" }}>
              <img src={ULTRAMAN_IMG} alt="Ultraman Finisher" className="w-full h-24 object-cover mb-3" style={{ opacity: 0.85 }} />
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9A84C" }}>
                2× Ultraman Finisher
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.85rem", color: "rgba(245,240,232,0.6)" }}>
                Disciplina que transcende o esporte
              </p>
            </div>
          </div>

          {/* Content */}
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}>
            <SectionLabel>Quem é</SectionLabel>
            <div className="mt-4 mb-6">
              <GoldDivider />
            </div>
            <h2 className="display-heading mb-6" style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)", color: "#F5F0E8" }}>
              O Médico que<br />
              <span style={{ color: "#C9A84C" }}>Transforma Líderes</span>
            </h2>

            <div className="space-y-5" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", lineHeight: 1.8, color: "rgba(245,240,232,0.65)" }}>
              <p>
                Dr. Santiago Vecina é médico, nutrólogo, empresário e mentor de alta performance. Sua trajetória única combina a <strong style={{ color: "#F5F0E8", fontWeight: 500 }}>precisão da ciência médica</strong> com a visão estratégica de quem construiu e reconstruiu negócios — e a sabedoria de quem passou pelo fundo do poço e emergiu transformado.
              </p>
              <p>
                Dois burnouts. Um casamento reconstruído. Cinco livros escritos. Dois Ultraman completados. Tudo isso de dentro de <strong style={{ color: "#F5F0E8", fontWeight: 500 }}>Williams Island, Aventura, Miami</strong> — onde o padrão de vida não é aspiração, é consequência do método.
              </p>
              <p>
                Hoje, ele é o único profissional que pode pedir o seu exame de sangue e o balanço da sua empresa <em>na mesma consulta</em>.
              </p>
            </div>

            <blockquote className="mt-8 mb-8" style={{ borderLeft: "2px solid #C9A84C", paddingLeft: "1.25rem" }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", fontWeight: 400, fontStyle: "italic", color: "rgba(245,240,232,0.75)", lineHeight: 1.6 }}>
                "Arquiteto da Performance Integral para líderes que se recusam a viver abaixo do seu potencial."
              </p>
            </blockquote>

            <div className="flex flex-wrap gap-3">
              <a href="https://www.instagram.com/drsantiagovecina/" target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ padding: "0.6rem 1.25rem", fontSize: "0.7rem" }}>
                <Instagram size={14} /> Instagram
              </a>
              <a href="https://www.youtube.com/@drsantiagovecina" target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ padding: "0.6rem 1.25rem", fontSize: "0.7rem" }}>
                <Youtube size={14} /> YouTube
              </a>
              <a href="https://www.linkedin.com/in/drsantiagovecina/" target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ padding: "0.6rem 1.25rem", fontSize: "0.7rem" }}>
                <Linkedin size={14} /> LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Pilares ──────────────────────────────────────────────────────────────────
function PilaresSection() {
  const { ref, isVisible } = useIntersectionObserver();
  return (
    <section id="pilares" ref={ref} style={{ background: "oklch(0.06 0.004 285)", padding: "7rem 0" }}>
      <div className="container">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <SectionLabel>A Estrutura da Transformação</SectionLabel>
          <div className="flex justify-center mt-4 mb-6"><GoldDivider /></div>
          <h2 className="display-heading" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#F5F0E8" }}>
            Os 5 Pilares da<br />
            <span style={{ color: "#C9A84C" }}>Performance Integral</span>
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", color: "rgba(245,240,232,0.5)", marginTop: "1rem", maxWidth: "520px", margin: "1rem auto 0" }}>
            Um sistema integrado onde cada pilar fortalece o outro, criando uma vida de crescimento exponencial e alinhamento verdadeiro.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={p.roman}
                className={`card-dark p-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${i * 100}ms`, ...(i === 4 ? { gridColumn: "span 1" } : {}) }}
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="roman-badge" style={{ fontSize: "0.7rem", letterSpacing: "0.2em" }}>{p.roman}</span>
                  <Icon size={18} style={{ color: "#C9A84C", opacity: 0.7 }} />
                </div>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9A84C", opacity: 0.8 }}>
                  {p.tag}
                </span>
                <h3 className="display-heading mt-2 mb-3" style={{ fontSize: "1.4rem", color: "#F5F0E8" }}>{p.title}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "rgba(245,240,232,0.5)", lineHeight: 1.7, marginBottom: "1.25rem" }}>{p.desc}</p>
                <ul className="space-y-2">
                  {p.items.map((item) => (
                    <li key={item} className="flex items-center gap-2" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "rgba(245,240,232,0.45)" }}>
                      <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#C9A84C", flexShrink: 0, opacity: 0.7 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          {/* CTA Card */}
          <div
            className={`card-dark p-8 flex flex-col justify-center items-center text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ transitionDelay: "500ms", background: "linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.03))", borderColor: "rgba(201,168,76,0.2)" }}
          >
            <Shield size={32} style={{ color: "#C9A84C", marginBottom: "1rem", opacity: 0.8 }} />
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontStyle: "italic", color: "rgba(245,240,232,0.7)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              "Qual pilar você mais precisa fortalecer hoje?"
            </p>
            <a href="https://link.salee.ai/widget/survey/Mufrh87YeRqFqFe3OS4m" target="_blank" rel="noopener noreferrer" className="btn-gold" style={{ fontSize: "0.7rem", padding: "0.75rem 1.5rem" }}>
              Fazer Diagnóstico Gratuito
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Livros ───────────────────────────────────────────────────────────────────
function LivrosSection() {
  const { ref, isVisible } = useIntersectionObserver();
  return (
    <section id="livros" ref={ref} style={{ background: "oklch(0.08 0.005 285)", padding: "7rem 0" }}>
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Image */}
          <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}>
            <img src={BOOKS_IMG} alt="Livros do Dr. Santiago Vecina" className="w-full rounded-sm" style={{ filter: "brightness(0.9)" }} />
          </div>

          {/* Right: Books list */}
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}>
            <SectionLabel>Conhecimento que Transforma</SectionLabel>
            <div className="mt-4 mb-6"><GoldDivider /></div>
            <h2 className="display-heading mb-10" style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", color: "#F5F0E8" }}>
              Os Livros do<br />
              <span style={{ color: "#C9A84C" }}>Dr. Santiago</span>
            </h2>

            <div className="space-y-5">
              {LIVROS.map((book, i) => (
                <Link
                  key={book.slug}
                  href={`/livros/${book.slug}`}
                  className={`flex gap-5 p-5 card-dark transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                  style={{ transitionDelay: `${i * 80}ms`, textDecoration: "none", cursor: "pointer" }}
                >
                  <span className="roman-badge flex-shrink-0 mt-1" style={{ fontSize: "1rem", opacity: 0.5 }}>{book.roman}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 600, color: "#F5F0E8", lineHeight: 1.3 }}>{book.title}</h3>
                      {book.soon && (
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C9A84C", background: "rgba(201,168,76,0.1)", padding: "0.2rem 0.5rem", flexShrink: 0 }}>
                          Em breve
                        </span>
                      )}
                    </div>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "rgba(245,240,232,0.4)", marginTop: "0.25rem", marginBottom: "0.75rem" }}>{book.subtitle}</p>
                    <div className="flex flex-wrap gap-2">
                      {book.tags.map((tag) => (
                        <span key={tag} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", fontWeight: 400, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(201,168,76,0.6)", border: "1px solid rgba(201,168,76,0.15)", padding: "0.15rem 0.5rem" }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span style={{ flexShrink: 0, color: "#C9A84C", opacity: 0.6, alignSelf: "center" }}>
                    <ArrowRight size={16} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Guardiões ────────────────────────────────────────────────────────────────
function GuardioesSection() {
  const { ref, isVisible } = useIntersectionObserver();
  return (
    <section id="guardioes" ref={ref} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={GUARDIOES_BG} alt="Comunidade Guardiões" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "rgba(6,6,6,0.88)" }} />
      </div>

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {/* Shield icon */}
            <div className="flex justify-center mb-8">
              <div style={{ width: "64px", height: "64px", border: "1px solid rgba(201,168,76,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Shield size={28} style={{ color: "#C9A84C" }} />
              </div>
            </div>

            <SectionLabel>Comunidade Exclusiva</SectionLabel>
            <div className="flex justify-center mt-4 mb-6"><GoldDivider /></div>

            <h2 className="display-heading mb-6" style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", color: "#F5F0E8" }}>
              Comunidade<br />
              <span style={{ color: "#C9A84C" }}>Guardiões</span>
            </h2>

            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontStyle: "italic", color: "rgba(245,240,232,0.65)", lineHeight: 1.7, maxWidth: "600px", margin: "0 auto 2rem" }}>
              "Você passou anos cuidando de todos. Agora é hora de cuidar de você."
            </p>

            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "rgba(245,240,232,0.5)", lineHeight: 1.8, maxWidth: "560px", margin: "0 auto 3rem" }}>
              Uma comunidade exclusiva para médicos brasileiros que se recusam a continuar sendo os piores pacientes de si mesmos. Cinco territórios. Um método. Uma transformação real.
            </p>

            {/* Territories */}
            <div className="flex flex-wrap justify-center gap-6 mb-10">
              {TERRITORIES.map((t) => (
                <div key={t.label} className="flex flex-col items-center gap-2">
                  <span style={{ fontSize: "1.5rem" }}>{t.icon}</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(201,168,76,0.7)" }}>{t.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <button className="btn-gold">
                Entrar na Comunidade
                <ArrowRight size={14} />
              </button>
              <button className="btn-ghost">
                Saber Mais
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Depoimentos ─────────────────────────────────────────────────────────────
function DepoimentosSection() {
  const { ref, isVisible } = useIntersectionObserver();
  return (
    <section ref={ref} style={{ background: "oklch(0.06 0.004 285)", padding: "7rem 0" }}>
      <div className="container">
        <div className={`text-center mb-14 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <SectionLabel>Resultados Reais</SectionLabel>
          <div className="flex justify-center mt-4 mb-6"><GoldDivider /></div>
          <h2 className="display-heading" style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", color: "#F5F0E8" }}>
            O que dizem os<br />
            <span style={{ color: "#C9A84C" }}>Líderes Transformados</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className={`card-dark p-8 flex flex-col transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.stars }).map((_, s) => (
                  <Star key={s} size={12} fill="#C9A84C" style={{ color: "#C9A84C" }} />
                ))}
              </div>
              {/* Quote */}
              <blockquote className="flex-1 mb-6">
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", fontStyle: "italic", color: "rgba(245,240,232,0.7)", lineHeight: 1.7 }}>
                  "{t.quote}"
                </p>
              </blockquote>
              {/* Author */}
              <div style={{ borderTop: "1px solid rgba(201,168,76,0.1)", paddingTop: "1rem" }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", fontWeight: 500, color: "#F5F0E8" }}>{t.name}</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "rgba(201,168,76,0.6)", marginTop: "0.2rem" }}>{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contato ──────────────────────────────────────────────────────────────────
function ContatoSection() {
  const { ref, isVisible } = useIntersectionObserver();
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", mensagem: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contato" ref={ref} style={{ background: "oklch(0.08 0.005 285)", padding: "7rem 0" }}>
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left */}
          <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <SectionLabel>Próximo Passo</SectionLabel>
            <div className="mt-4 mb-6"><GoldDivider /></div>
            <h2 className="display-heading mb-6" style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", color: "#F5F0E8" }}>
              Começar a Construir<br />
              <span style={{ color: "#C9A84C" }}>Seu Legado</span>
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "rgba(245,240,232,0.5)", lineHeight: 1.8, marginBottom: "2.5rem" }}>
              Agende uma conversa estratégica com o Dr. Santiago. Seja você um CEO buscando performance integral ou um médico pronto para transformar sua vida — o primeiro passo começa aqui.
            </p>

            {/* Contact info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin size={14} style={{ color: "#C9A84C", flexShrink: 0 }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "rgba(245,240,232,0.5)" }}>Williams Island, Aventura — Miami, FL</span>
              </div>
              <div className="flex items-center gap-3">
                <Instagram size={14} style={{ color: "#C9A84C", flexShrink: 0 }} />
                <a href="https://www.instagram.com/drsantiagovecina/" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "rgba(245,240,232,0.5)", textDecoration: "none", transition: "color 0.3s" }} onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,240,232,0.5)")}>
                  @drsantiagovecina
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Youtube size={14} style={{ color: "#C9A84C", flexShrink: 0 }} />
                <a href="https://www.youtube.com/@drsantiagovecina" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "rgba(245,240,232,0.5)", textDecoration: "none", transition: "color 0.3s" }} onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,240,232,0.5)")}>
                  @drsantiagovecina
                </a>
              </div>
            </div>

            {/* Social links */}
            <div className="flex gap-3 mt-8">
              {[
                { icon: Instagram, href: "https://www.instagram.com/drsantiagovecina/" },
                { icon: Youtube, href: "https://www.youtube.com/@drsantiagovecina" },
                { icon: Linkedin, href: "https://www.linkedin.com/in/drsantiagovecina/" },
                { icon: MessageCircle, href: "https://wa.me/1" },
              ].map(({ icon: Icon, href }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                  style={{ width: "40px", height: "40px", border: "1px solid rgba(201,168,76,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(245,240,232,0.4)", transition: "all 0.3s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#C9A84C"; e.currentTarget.style.color = "#C9A84C"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)"; e.currentTarget.style.color = "rgba(245,240,232,0.4)"; }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className={`transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {sent ? (
              <div className="card-dark p-10 text-center h-full flex flex-col items-center justify-center gap-4">
                <Award size={40} style={{ color: "#C9A84C" }} />
                <h3 className="display-heading" style={{ fontSize: "1.8rem", color: "#F5F0E8" }}>Mensagem Recebida</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "rgba(245,240,232,0.5)" }}>
                  O Dr. Santiago entrará em contato em breve. Obrigado pela confiança.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card-dark p-8 space-y-5">
                <div>
                  <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(201,168,76,0.7)", display: "block", marginBottom: "0.5rem" }}>
                    Seu Nome
                  </label>
                  <input
                    type="text"
                    className="input-dark"
                    placeholder="Como posso te chamar?"
                    value={form.nome}
                    onChange={e => setForm({ ...form, nome: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(201,168,76,0.7)", display: "block", marginBottom: "0.5rem" }}>
                    Seu Melhor E-mail
                  </label>
                  <input
                    type="email"
                    className="input-dark"
                    placeholder="seu@email.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(201,168,76,0.7)", display: "block", marginBottom: "0.5rem" }}>
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    className="input-dark"
                    placeholder="+1 (305) 000-0000"
                    value={form.telefone}
                    onChange={e => setForm({ ...form, telefone: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(201,168,76,0.7)", display: "block", marginBottom: "0.5rem" }}>
                    Como Posso Ajudar?
                  </label>
                  <textarea
                    className="input-dark"
                    rows={4}
                    placeholder="Conte-me sobre você e o que você está buscando..."
                    value={form.mensagem}
                    onChange={e => setForm({ ...form, mensagem: e.target.value })}
                    style={{ resize: "none" }}
                  />
                </div>
                <button type="submit" className="btn-gold w-full justify-center">
                  Agendar Conversa Estratégica
                  <ArrowRight size={14} />
                </button>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", color: "rgba(245,240,232,0.25)", textAlign: "center" }}>
                  Seus dados estão seguros. Sem spam, apenas conteúdo de alto valor.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: "oklch(0.05 0.003 285)", borderTop: "1px solid rgba(201,168,76,0.08)", padding: "3rem 0" }}>
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 600, color: "#F5F0E8" }}>Dr. Santiago Vecina</p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", fontWeight: 400, letterSpacing: "0.25em", textTransform: "uppercase", color: "#C9A84C", marginTop: "0.2rem" }}>Performance Integral</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" })}
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", fontWeight: 400, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(245,240,232,0.35)", transition: "color 0.3s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,240,232,0.35)")}
              >
                {link.label}
              </button>
            ))}
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", color: "rgba(245,240,232,0.2)" }}>
            © {new Date().getFullYear()} Dr. Santiago Vecina
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "oklch(0.08 0.005 285)" }}>
      <Navbar />
      <HeroSection />
      <SobreSection />
      <PilaresSection />
      <LivrosSection />
      <GuardioesSection />
      <DepoimentosSection />
      <ContatoSection />
      <Footer />
    </div>
  );
}
