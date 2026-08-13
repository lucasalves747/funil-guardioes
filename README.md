# Funil Guardiões — site

Site do funil do Dr. Santiago Vecina (Comunidade Guardiões). Vite + React + Tailwind v4, publicado como site estático na Vercel.

## Rodar local

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # gera dist/
npm run preview  # serve o dist/
```

## Rotas

| Rota | Página |
|---|---|
| `/` | Home |
| `/ebook-10-horas`, `/10-horas-escondidas` | Captura do ebook As 10 Horas Escondidas |
| `/diagnostico` | Diagnóstico do Médico Esgotado |
| `/calculadora` | Calculadora da Hora Real |
| `/iscas`, `/guardioes` | Hub das iscas |
| `/isca/:isca` | Landing de cada isca (`diagnostico`, `calculadora`, `ebook`, `masterclass`) |
| `/masterclass` | Landing da Masterclass |
| `/desafio-21-dias` | Página de vendas do Desafio |
| `/desafio`, `/desafio/:section` | Plataforma do Desafio (Journal + Templates, salvos em localStorage) |
| `/obrigado` | Agradecimento pós-conversão |

## Captura de leads

As páginas foram escritas contra o backend tRPC da plataforma Manus, que não existe fora dela.
O arquivo [src/lib/trpc.ts](src/lib/trpc.ts) mantém o mesmo contrato (`trpc.ebook.capturarLead.useMutation()`)
mas grava direto no Supabase — por isso o funil roda sem servidor próprio.

**Antes do primeiro deploy**, rode [supabase/schema.sql](supabase/schema.sql) no SQL Editor do Supabase.
Ele cria `ebook_leads`, `diagnostico_leads` e `calculadora_leads` com RLS liberando apenas INSERT
para o anônimo — ninguém consegue listar a base de leads pelo navegador.

Para ver os leads: painel do Supabase → Table Editor.

### Variáveis de ambiente (opcionais)

Sem elas, o site usa o projeto Supabase atual (valores em `src/lib/supabase.ts`).

| Variável | Uso |
|---|---|
| `VITE_SUPABASE_URL` | Apontar para outro projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Anon key do projeto acima |

## Pendências conhecidas

- **E-mail transacional não está ativo.** O backend original disparava e-mail pela API Forge da Manus.
  Hoje o lead é gravado e o PDF é liberado na tela, mas nenhum e-mail sai. Vários textos das páginas
  ainda prometem "enviamos para o seu e-mail" — decidir entre ligar um serviço de e-mail (Resend via
  Supabase Edge Function) ou ajustar esses textos.
- **PDF da Esteira Completa.** A página `/obrigado` aponta para `/Esteira_Guardioes.pdf`; o arquivo
  precisa ser colocado em `public/`. O link antigo da Manus está fora do ar (404).
