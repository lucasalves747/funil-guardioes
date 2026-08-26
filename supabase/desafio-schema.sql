-- ============================================================================
-- ÁREA DE MEMBROS DO DESAFIO GUARDIÃO 21 DIAS
--
-- Rode este arquivo inteiro no SQL Editor do SEU projeto Supabase, uma vez.
-- Ele cria duas tabelas:
--
--   desafio_liberados  → quem pagou e pode entrar (você preenche)
--   desafio_progresso  → o diário de cada participante (o site preenche)
--
-- O login é por código de 6 dígitos enviado ao e-mail. Não existe senha.
-- Quem não estiver em desafio_liberados até consegue receber o código, mas o
-- banco recusa a criação do progresso — ou seja, não entra na plataforma.
-- ============================================================================


-- ─── 1. Quem pode entrar ────────────────────────────────────────────────────
create table if not exists public.desafio_liberados (
  email       text primary key,
  nome        text,
  turma       text,
  liberado_em timestamptz not null default now(),
  observacao  text
);

comment on table public.desafio_liberados is
  'Lista de acesso do Desafio 21 Dias. Uma linha por participante que pagou.';

-- E-mail é comparado sem diferenciar maiúsculas: Joao@X.com == joao@x.com.
create unique index if not exists desafio_liberados_email_minusculo
  on public.desafio_liberados (lower(email));


-- ─── 2. O progresso de cada participante ────────────────────────────────────
create table if not exists public.desafio_progresso (
  user_id       uuid primary key references auth.users (id) on delete cascade,
  email         text not null,
  nome          text,
  profissao     text,
  data_inicio   date not null default current_date,
  -- O diário inteiro (journal, templates, diagnóstico) como JSON, no mesmo
  -- formato que a página já usava no localStorage. Guardar como blob evita ter
  -- de migrar o banco toda vez que um campo novo aparece no diário.
  dados         jsonb not null default '{}'::jsonb,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

comment on table public.desafio_progresso is
  'Diário do Desafio 21 Dias. Uma linha por participante, dados em jsonb.';

create index if not exists desafio_progresso_email_idx on public.desafio_progresso (email);

-- atualizado_em sempre reflete a última gravação, sem o site precisar mandar.
create or replace function public.tocar_atualizado_em()
returns trigger language plpgsql as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

drop trigger if exists desafio_progresso_atualizado_em on public.desafio_progresso;
create trigger desafio_progresso_atualizado_em
  before update on public.desafio_progresso
  for each row execute function public.tocar_atualizado_em();


-- ─── 3. A checagem da lista de acesso ───────────────────────────────────────
-- security definer: a função enxerga desafio_liberados mesmo com a tabela
-- fechada para o público. É o que permite validar sem expor a lista inteira.
create or replace function public.desafio_email_liberado(e text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.desafio_liberados
    where lower(email) = lower(trim(e))
  );
$$;

revoke all on function public.desafio_email_liberado(text) from public;
grant execute on function public.desafio_email_liberado(text) to authenticated;


-- ─── 4. Travas de acesso (RLS) ──────────────────────────────────────────────
alter table public.desafio_liberados enable row level security;
alter table public.desafio_progresso enable row level security;

-- desafio_liberados fica sem nenhuma policy de propósito: ninguém lê ou
-- escreve pela anon key. Você gerencia a lista pelo painel do Supabase.

drop policy if exists "le o proprio progresso"       on public.desafio_progresso;
drop policy if exists "cria o proprio progresso"     on public.desafio_progresso;
drop policy if exists "atualiza o proprio progresso" on public.desafio_progresso;

create policy "le o proprio progresso"
  on public.desafio_progresso for select
  to authenticated
  using (auth.uid() = user_id);

-- A trava real do produto: só quem está na lista consegue criar o progresso.
create policy "cria o proprio progresso"
  on public.desafio_progresso for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and public.desafio_email_liberado(auth.jwt() ->> 'email')
  );

create policy "atualiza o proprio progresso"
  on public.desafio_progresso for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ============================================================================
-- COMO USAR NO DIA A DIA
--
-- Liberar um participante que acabou de comprar:
--
--   insert into public.desafio_liberados (email, nome, turma)
--   values ('participante@exemplo.com', 'Nome da Pessoa', 'Turma 1');
--
-- Ver quem está em qual dia do desafio:
--
--   select nome, email, data_inicio,
--          jsonb_object_keys_count(dados -> 'journal') as dias_preenchidos,
--          atualizado_em
--   from public.desafio_progresso
--   order by atualizado_em desc;
--
-- (se preferir sem função extra, use:
--   select nome, email, data_inicio,
--          (select count(*) from jsonb_object_keys(coalesce(dados->'journal','{}'::jsonb))) as dias_preenchidos,
--          atualizado_em
--   from public.desafio_progresso order by atualizado_em desc;)
--
-- Tirar o acesso de alguém:
--
--   delete from public.desafio_liberados where lower(email) = lower('pessoa@exemplo.com');
--   -- (o progresso continua salvo; só o acesso a novos cadastros é bloqueado)
-- ============================================================================
