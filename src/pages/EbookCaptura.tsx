import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Download,
  LockKeyhole,
  Shield,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { LABELS, PLACEHOLDERS, PROFISSOES } from "@/lib/lead-fields";

const EBOOK_URL = "/As_10_Horas_Escondidas.pdf";

const chapters = [
  {
    number: "01",
    title: "A Auditoria da Agenda",
    description:
      "Um exercício prático para localizar os vazamentos que roubam horas relevantes da sua semana.",
  },
  {
    number: "02",
    title: "Os 3 Blocos Inegociáveis",
    description:
      "Uma estrutura para proteger corpo, clareza mental e presença em família antes que a agenda tome conta do dia.",
  },
  {
    number: "03",
    title: "A Delegação Mínima",
    description:
      "Um filtro simples para identificar o que exige o seu CRM e o que precisa sair das suas mãos.",
  },
  {
    number: "04",
    title: "Os Rituais de Transição",
    description:
      "Protocolos curtos para encerrar o dia clínico e recuperar a qualidade do descanso e da presença.",
  },
];

const faqs = [
  {
    question: "O ebook é realmente gratuito?",
    answer:
      "Sim. O acesso ao PDF é gratuito. Ao se cadastrar, você também autoriza o recebimento de conteúdos relacionados ao método Guardiões; pode cancelar a qualquer momento.",
  },
  {
    question: "Funciona para quem faz plantão?",
    answer:
      "O material foi construído para a rotina médica real, incluindo plantões, agenda instável e múltiplos vínculos. A proposta é começar pelo mínimo viável e estruturar o progresso.",
  },
  {
    question: "Quanto tempo preciso reservar?",
    answer:
      "A Auditoria da Agenda leva cerca de 30 minutos. Os demais sistemas foram desenhados para serem implementados progressivamente, dentro da agenda que você já possui.",
  },
  {
    question: "Preciso ter equipe para aplicar o conteúdo?",
    answer:
      "Não. O ebook tem aplicações para o médico solo e para clínicas com equipe. A lógica é descobrir primeiro o que deve continuar sob sua responsabilidade.",
  },
];

export default function EbookCaptura() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("");
  const [profession, setProfession] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [source, setSource] = useState("ebook_10_horas");

  const captureLead = trpc.ebook.capturarLead.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  });

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    setSource(search.get("src") || "ebook_10_horas");
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!consent || captureLead.isPending) return;
    captureLead.mutate({
      nome: name,
      email,
      telefone: phone,
      regiao: region,
      profissao: profession,
      origem: source,
    });
  };

  const scrollToForm = () => document.getElementById("form-ebook")?.scrollIntoView({ behavior: "smooth", block: "center" });

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] px-5 py-16 text-[#F5F0E8]">
        <section className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/10">
            <CheckCircle2 className="h-10 w-10 text-[#C9A84C]" />
          </div>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.32em] text-[#C9A84C]">Acesso liberado</p>
          <h1 className="font-['Cormorant_Garamond'] text-4xl leading-tight md:text-6xl">
            O seu mapa está pronto,<br />Dr(a). {name.split(" ")[0]}.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#F5F0E8]/65">
            O PDF premium foi enviado para <strong className="font-medium text-[#F5F0E8]">{email}</strong>. Você também pode baixá-lo agora.
          </p>
          <a
            href={EBOOK_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-flex items-center gap-3 bg-[#C9A84C] px-8 py-4 text-sm font-bold tracking-[0.12em] text-[#0A0A0A] transition hover:bg-[#dfbd65]"
          >
            <Download className="h-4 w-4" /> BAIXAR O EBOOK EM PDF
          </a>
          <div className="mt-12 border border-[#C9A84C]/25 bg-[#111111] p-8 text-left md:p-10">
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#C9A84C]">Próximo passo</p>
            <h2 className="font-['Cormorant_Garamond'] text-3xl">Transforme o mapa em prática durante 21 dias.</h2>
            <p className="mt-4 leading-relaxed text-[#F5F0E8]/60">
              O Desafio Guardião 21 Dias reúne aulas curtas, desafios rastreáveis e encontros ao vivo para implementar os sistemas deste ebook na sua rotina real.
            </p>
            <a href="/desafio-21-dias" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#C9A84C] transition hover:gap-4">
              CONHECER O DESAFIO GUARDIÃO <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0A0A0A] font-['DM_Sans'] text-[#F5F0E8]">
      <section className="relative isolate overflow-hidden px-6 pb-16 pt-12 md:min-h-screen md:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_rgba(201,168,76,.14),_transparent_53%),linear-gradient(135deg,_#0A0A0A_0%,_#111008_50%,_#0A0A0A_100%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-14 md:grid-cols-[1.06fr_.94fr]">
          <div className="max-w-2xl">
            <div className="mb-8 flex items-center gap-3">
              <span className="h-px w-9 bg-[#C9A84C]" />
              <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#C9A84C]">Ebook gratuito · Comunidade Guardiões</span>
            </div>
            <h1 className="font-['Cormorant_Garamond'] text-5xl leading-[.95] md:text-7xl">As 10 Horas<br /><span className="text-[#C9A84C]">Escondidas</span></h1>
            <p className="mt-7 max-w-xl text-xl leading-relaxed text-[#F5F0E8]/70">
              Um sistema para recuperar horas relevantes da sua rotina médica — sem reduzir a qualidade do cuidado e sem transformar a sua vida em uma nova lista de tarefas.
            </p>
            <div className="mt-9 grid gap-3">
              {[
                "Identifique os 7 Ladrões de Tempo específicos da rotina médica.",
                "Proteja saúde, clareza mental e família com 3 blocos inegociáveis.",
                "Use um protocolo simples para delegar sem perder o padrão de qualidade.",
              ].map((item) => (
                <div className="flex gap-3 text-sm leading-relaxed text-[#F5F0E8]/70" key={item}>
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A84C]" /> {item}
                </div>
              ))}
            </div>
            <button onClick={scrollToForm} className="mt-10 inline-flex items-center gap-3 bg-[#C9A84C] px-7 py-4 text-sm font-bold tracking-[0.12em] text-[#0A0A0A] transition hover:bg-[#dfbd65]">
              QUERO O EBOOK GRATUITO <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-10 -z-10 rounded-full bg-[#C9A84C]/10 blur-3xl" />
            <div className="border border-[#C9A84C]/30 bg-[linear-gradient(145deg,_#1A170B,_#0A0A0A_78%)] p-10 text-center shadow-[0_30px_90px_rgba(0,0,0,.55)] md:p-14">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#C9A84C]/35 bg-[#C9A84C]/10">
                <Shield className="h-8 w-8 text-[#C9A84C]" />
              </div>
              <p className="mt-8 text-[10px] uppercase tracking-[0.34em] text-[#C9A84C]">Dr. Santiago Vecina</p>
              <p className="mt-8 font-['Cormorant_Garamond'] text-4xl leading-tight">As 10 Horas<br /><span className="text-[#C9A84C]">Escondidas</span></p>
              <div className="mx-auto mt-8 h-px w-20 bg-[#C9A84C]/45" />
              <p className="mt-5 text-xs uppercase tracking-[0.2em] text-[#F5F0E8]/40">Performance Integral para Médicos</p>
            </div>
          </div>
        </div>
      </section>

      <section id="form-ebook" className="border-y border-[#C9A84C]/15 bg-[#0D0D0D] px-6 py-20">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[.9fr_1.1fr] md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#C9A84C]">Acesso imediato</p>
            <h2 className="mt-4 font-['Cormorant_Garamond'] text-4xl leading-tight md:text-5xl">Receba o seu PDF premium agora.</h2>
            <p className="mt-5 max-w-md leading-relaxed text-[#F5F0E8]/60">Cadastre-se para acessar o ebook e receber, por e-mail, o seu caminho de implementação.</p>
            <div className="mt-8 border-l-2 border-[#C9A84C] pl-5 text-sm leading-relaxed text-[#F5F0E8]/55">Se você chegou por um Reel, o link já registra a origem do conteúdo para que possamos aprimorar os próximos materiais.</div>
          </div>
          <form onSubmit={handleSubmit} className="border border-[#C9A84C]/25 bg-[#111111] p-7 md:p-9">
            <div className="grid gap-4">
              <label className="text-xs uppercase tracking-[0.16em] text-[#F5F0E8]/60">{LABELS.nome} *
                <input value={name} onChange={(event) => setName(event.target.value)} required placeholder={PLACEHOLDERS.nome} className="mt-2 w-full border border-[#C9A84C]/20 bg-[#0A0A0A] px-4 py-3 text-sm normal-case tracking-normal text-[#F5F0E8] outline-none transition focus:border-[#C9A84C]/70" />
              </label>
              <label className="text-xs uppercase tracking-[0.16em] text-[#F5F0E8]/60">{LABELS.email} *
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder={PLACEHOLDERS.email} className="mt-2 w-full border border-[#C9A84C]/20 bg-[#0A0A0A] px-4 py-3 text-sm normal-case tracking-normal text-[#F5F0E8] outline-none transition focus:border-[#C9A84C]/70" />
              </label>
              <label className="text-xs uppercase tracking-[0.16em] text-[#F5F0E8]/60">{LABELS.telefone} *
                <input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} required placeholder={PLACEHOLDERS.telefone} className="mt-2 w-full border border-[#C9A84C]/20 bg-[#0A0A0A] px-4 py-3 text-sm normal-case tracking-normal text-[#F5F0E8] outline-none transition focus:border-[#C9A84C]/70" />
              </label>
              <label className="text-xs uppercase tracking-[0.16em] text-[#F5F0E8]/60">{LABELS.regiao} *
                <input value={region} onChange={(event) => setRegion(event.target.value)} required placeholder={PLACEHOLDERS.regiao} className="mt-2 w-full border border-[#C9A84C]/20 bg-[#0A0A0A] px-4 py-3 text-sm normal-case tracking-normal text-[#F5F0E8] outline-none transition focus:border-[#C9A84C]/70" />
              </label>
              <label className="text-xs uppercase tracking-[0.16em] text-[#F5F0E8]/60">{LABELS.profissao} *
                <span className="relative mt-2 block">
                  <select value={profession} onChange={(event) => setProfession(event.target.value)} required className="w-full appearance-none border border-[#C9A84C]/20 bg-[#0A0A0A] px-4 py-3 pr-10 text-sm normal-case tracking-normal text-[#F5F0E8] outline-none transition focus:border-[#C9A84C]/70">
                    <option value="" disabled>{PLACEHOLDERS.profissao}</option>
                    {PROFISSOES.map((profissao) => (
                      <option key={profissao} value={profissao} className="bg-[#111111] text-[#F5F0E8]">{profissao}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#C9A84C]" />
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 pt-2 text-xs leading-relaxed text-[#F5F0E8]/50">
                <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-0.5 accent-[#C9A84C]" />
                <span>Concordo em receber este ebook e conteúdos da Comunidade Guardiões por e-mail e WhatsApp. Posso cancelar quando quiser.</span>
              </label>
              {captureLead.error && <p className="text-sm text-red-300">Não foi possível liberar o material agora. Revise seus dados e tente novamente.</p>}
              <button type="submit" disabled={!consent || captureLead.isPending} className="mt-2 inline-flex items-center justify-center gap-3 bg-[#C9A84C] px-6 py-4 text-sm font-bold tracking-[0.12em] text-[#0A0A0A] transition hover:bg-[#dfbd65] disabled:cursor-not-allowed disabled:opacity-45">
                {captureLead.isPending ? "LIBERANDO ACESSO..." : "QUERO AS 10 HORAS ESCONDIDAS"} <ArrowRight className="h-4 w-4" />
              </button>
              <p className="flex items-center justify-center gap-2 text-center text-[11px] text-[#F5F0E8]/30"><LockKeyhole className="h-3 w-3" /> Seus dados são usados apenas para a entrega e a comunicação do método.</p>
            </div>
          </form>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-xs uppercase tracking-[0.3em] text-[#C9A84C]">Dentro do ebook</p>
          <h2 className="mt-4 text-center font-['Cormorant_Garamond'] text-4xl md:text-5xl">Quatro sistemas para reorganizar a sua semana.</h2>
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {chapters.map((chapter) => (
              <article key={chapter.number} className="border border-[#C9A84C]/20 p-7 transition hover:border-[#C9A84C]/45">
                <div className="flex gap-5"><span className="font-['Cormorant_Garamond'] text-5xl leading-none text-[#C9A84C]/25">{chapter.number}</span><div><h3 className="font-['Cormorant_Garamond'] text-2xl">{chapter.title}</h3><p className="mt-3 text-sm leading-relaxed text-[#F5F0E8]/55">{chapter.description}</p></div></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#C9A84C]/15 bg-[#0D0D0D] px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-center text-xs uppercase tracking-[0.3em] text-[#C9A84C]">Dúvidas frequentes</p>
          <h2 className="mt-4 text-center font-['Cormorant_Garamond'] text-4xl">Antes de baixar</h2>
          <div className="mt-12 space-y-3">
            {faqs.map((faq, index) => (
              <article key={faq.question} className="border border-[#C9A84C]/20">
                <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="flex w-full items-center justify-between gap-6 p-5 text-left text-sm font-medium">
                  {faq.question}<ChevronDown className={`h-4 w-4 shrink-0 text-[#C9A84C] transition ${openFaq === index ? "rotate-180" : ""}`} />
                </button>
                {openFaq === index && <p className="px-5 pb-5 text-sm leading-relaxed text-[#F5F0E8]/60">{faq.answer}</p>}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 text-center">
        <Clock3 className="mx-auto h-8 w-8 text-[#C9A84C]" />
        <p className="mt-6 text-xs uppercase tracking-[0.3em] text-[#C9A84C]">Comece em 30 minutos</p>
        <h2 className="mx-auto mt-4 max-w-3xl font-['Cormorant_Garamond'] text-4xl leading-tight md:text-5xl">Você não precisa de mais uma rotina. Precisa ver o que está roubando a atual.</h2>
        <button onClick={scrollToForm} className="mt-10 inline-flex items-center gap-3 bg-[#C9A84C] px-7 py-4 text-sm font-bold tracking-[0.12em] text-[#0A0A0A] transition hover:bg-[#dfbd65]">BAIXAR O EBOOK GRATUITO <BookOpen className="h-4 w-4" /></button>
      </section>

      <footer className="border-t border-[#C9A84C]/10 px-6 py-8 text-center text-xs text-[#F5F0E8]/30">© 2026 Dr. Santiago Vecina · Williams Island, Miami, FL</footer>
    </main>
  );
}
