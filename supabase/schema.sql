-- ============================================================================
-- Funil Guardiões — tabelas de captura de leads
-- Rode este arquivo uma única vez no SQL Editor do Supabase.
-- ============================================================================

create table if not exists public.ebook_leads (
  id bigint generated always as identity primary key,
  nome text not null,
  email text not null,
  telefone text not null,
  especialidade text,
  origem text not null default 'ebook_10_horas',
  consentimento boolean not null default true,
  email_enviado boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.diagnostico_leads (
  id bigint generated always as identity primary key,
  nome text not null,
  email text not null,
  telefone text not null,
  especialidade text,
  escore integer not null,
  perfil text not null,
  respostas jsonb,
  email_enviado boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.calculadora_leads (
  id bigint generated always as identity primary key,
  nome text not null,
  email text not null,
  telefone text not null,
  horas_semanais integer,
  valor_consulta numeric,
  hora_real text,
  email_enviado boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists ebook_leads_created_at_idx on public.ebook_leads (created_at desc);
create index if not exists ebook_leads_origem_idx on public.ebook_leads (origem);
create index if not exists diagnostico_leads_created_at_idx on public.diagnostico_leads (created_at desc);
create index if not exists calculadora_leads_created_at_idx on public.calculadora_leads (created_at desc);

-- ─── RLS ────────────────────────────────────────────────────────────────────
-- O site é estático e usa a anon key, que é pública. Por isso o anônimo pode
-- APENAS inserir: ninguém consegue listar a base de leads pelo navegador.
-- Para ler os leads, use o painel do Supabase ou a service_role key.

alter table public.ebook_leads enable row level security;
alter table public.diagnostico_leads enable row level security;
alter table public.calculadora_leads enable row level security;

drop policy if exists "anon insere leads do ebook" on public.ebook_leads;
create policy "anon insere leads do ebook"
  on public.ebook_leads for insert to anon with check (true);

drop policy if exists "anon insere leads do diagnostico" on public.diagnostico_leads;
create policy "anon insere leads do diagnostico"
  on public.diagnostico_leads for insert to anon with check (true);

drop policy if exists "anon insere leads da calculadora" on public.calculadora_leads;
create policy "anon insere leads da calculadora"
  on public.calculadora_leads for insert to anon with check (true);
