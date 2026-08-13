// Página dedicada de cada livro — Dark Manifesto / Quiet Luxury
import { useEffect } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, ArrowRight, BookOpen, Check, Shield } from "lucide-react";
import NotFound from "@/pages/NotFound";
import { LIVROS, acharLivro, type Livro } from "@/lib/livros";

const OURO = "#C9A84C";
const CREME = "#F5F0E8";
const FUNDO = "#0A0A0A";

/**
 * Nem todo livro tem capa. Em vez de deixar um buraco na página, o livro sem
 * imagem ganha uma capa tipográfica com o seu algarismo romano — o mesmo
 * elemento que já identifica cada obra na home.
 */
function Capa({ livro, className = "" }: { livro: Livro; className?: string }) {
  if (livro.capa) {
    return (
      <img
        src={livro.capa}
        alt={`Capa do livro ${livro.title}`}
        className={className}
        style={{ width: "100%", display: "block", border: "1px solid rgba(201,168,76,0.2)" }}
      />
    );
  }
  return (
    <div
      className={className}
      style={{
        aspectRatio: "2 / 3",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.25rem",
        padding: "2rem",
        textAlign: "center",
        background: "linear-gradient(160deg, #16130d 0%, #0A0A0A 100%)",
        border: "1px solid rgba(201,168,76,0.25)",
      }}
    >
      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "3.5rem", color: OURO, opacity: 0.55, lineHeight: 1 }}>
        {livro.roman}
      </span>
      <div style={{ width: "2.5rem", height: "1px", background: "rgba(201,168,76,0.4)" }} />
      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.35rem", fontWeight: 600, color: CREME, lineHeight: 1.25 }}>
        {livro.title}
      </span>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(245,240,232,0.35)" }}>
        Santiago Vecina
      </span>
    </div>
  );
}

export default function LivroDetalhe() {
  const [, params] = useRoute("/livros/:slug");
  const slug = params?.slug;
  const livro = acharLivro(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!livro) return;
    document.title = `${livro.title} — Dr. Santiago Vecina`;
    return () => {
      document.title = "Dr. Santiago Vecina — Comunidade Guardiões";
    };
  }, [livro]);

  if (!livro) return <NotFound />;

  const outros = LIVROS.filter((item) => item.slug !== livro.slug);

  return (
    <div style={{ minHeight: "100vh", background: FUNDO, color: CREME }}>
      {/* ─── Topo ─────────────────────────────────────────────────────────── */}
      <header style={{ borderBottom: "1px solid rgba(201,168,76,0.15)", padding: "20px 0" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <Shield size={18} style={{ color: OURO }} />
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", color: CREME }}>Dr. Santiago Vecina</span>
          </a>
          <a
            href="/#livros"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none",
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em",
              textTransform: "uppercase", color: "rgba(245,240,232,0.45)",
            }}
          >
            <ArrowLeft size={14} /> Todos os livros
          </a>
        </div>
      </header>

      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{ padding: "4.5rem 0 4rem" }}>
        <div className="container">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-4">
              <div style={{ maxWidth: "320px", margin: "0 auto" }}>
                <Capa livro={livro} />
              </div>
            </div>

            <div className="lg:col-span-8">
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <span className="roman-badge" style={{ fontSize: "0.9rem", opacity: 0.6 }}>{livro.roman}</span>
                <div className="gold-line" />
                <span className="section-label">
                  {livro.soon ? "Em breve" : "Livro publicado"}
                </span>
              </div>

              <h1 className="display-heading" style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", color: CREME, marginBottom: "1rem" }}>
                {livro.title}
              </h1>

              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(1.05rem, 2.2vw, 1.4rem)", color: "rgba(245,240,232,0.7)", lineHeight: 1.5, marginBottom: "1.75rem" }}>
                {livro.subtitle}
              </p>

              {livro.descricao && (
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", color: "rgba(245,240,232,0.6)", lineHeight: 1.75, marginBottom: "1.5rem", maxWidth: "620px" }}>
                  {livro.descricao}
                </p>
              )}

              {livro.intro && (
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "rgba(245,240,232,0.45)", lineHeight: 1.75, borderLeft: `2px solid rgba(201,168,76,0.3)`, paddingLeft: "1.25rem", marginBottom: "1.5rem", maxWidth: "620px" }}>
                  {livro.intro}
                </p>
              )}

              <div className="flex flex-wrap gap-2" style={{ marginBottom: "2.25rem" }}>
                {livro.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", letterSpacing: "0.1em",
                      textTransform: "uppercase", color: "rgba(201,168,76,0.6)",
                      border: "1px solid rgba(201,168,76,0.15)", padding: "0.25rem 0.6rem",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                {livro.link && !livro.soon && (
                  <a href={livro.link} target="_blank" rel="noopener noreferrer" className="btn-gold" style={{ textDecoration: "none" }}>
                    <BookOpen size={15} /> Quero este livro <ArrowRight size={15} />
                  </a>
                )}
                {livro.soon && (
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: OURO, background: "rgba(201,168,76,0.1)", padding: "0.6rem 1rem" }}>
                    Lançamento em breve
                  </span>
                )}
                <a
                  href="/iscas"
                  style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", letterSpacing: "0.15em",
                    textTransform: "uppercase", color: "rgba(245,240,232,0.55)", textDecoration: "none",
                    borderBottom: "1px solid rgba(201,168,76,0.35)", paddingBottom: "0.2rem",
                  }}
                >
                  Materiais gratuitos
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── O que você vai encontrar ─────────────────────────────────────── */}
      {livro.topicos && livro.topicos.length > 0 && (
        <section style={{ padding: "4rem 0", borderTop: "1px solid rgba(201,168,76,0.1)" }}>
          <div className="container">
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2.5rem" }}>
              <div className="gold-line" />
              <span className="section-label">O que você vai encontrar</span>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {livro.topicos.map((topico, i) => (
                <div key={topico} className="card-dark" style={{ display: "flex", gap: "1rem", padding: "1.5rem" }}>
                  <div style={{ flexShrink: 0, width: "2.25rem", height: "2.25rem", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}>
                    <Check size={15} style={{ color: OURO }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <span style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", marginBottom: "0.35rem" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "rgba(245,240,232,0.75)", lineHeight: 1.7 }}>{topico}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Outros livros ────────────────────────────────────────────────── */}
      <section style={{ padding: "4rem 0", borderTop: "1px solid rgba(201,168,76,0.1)" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2.5rem" }}>
            <div className="gold-line" />
            <span className="section-label">Outros livros do Dr. Santiago</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-8">
            {outros.map((item) => (
              <Link key={item.slug} href={`/livros/${item.slug}`} style={{ textDecoration: "none", display: "block" }}>
                <div style={{ marginBottom: "0.85rem" }}>
                  <Capa livro={item} />
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem", fontWeight: 600, color: CREME, lineHeight: 1.3 }}>
                  {item.title}
                </h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", color: "rgba(245,240,232,0.35)", marginTop: "0.25rem" }}>
                  {item.soon ? "Em breve" : item.tags[0]}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Rodapé ───────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid rgba(201,168,76,0.15)", padding: "2.5rem 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", letterSpacing: "0.1em", color: "rgba(245,240,232,0.3)" }}>
            Dr. Santiago Vecina · Comunidade Guardiões
          </p>
        </div>
      </footer>
    </div>
  );
}
