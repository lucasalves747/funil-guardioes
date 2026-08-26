# E-mails do funil — contrato do webhook

O site é estático e **não envia e-mail**. A cada conversão ele faz um `POST` no
webhook daquele evento com os dados já estruturados; quem monta e dispara o
e-mail é o sistema do outro lado.

## Configuração

Uma URL por evento, cadastradas como variáveis de ambiente na Vercel
(Settings → Environment Variables). Evento sem URL é ignorado em silêncio — o
lead continua sendo gravado no CRM de Contatos normalmente, só não entra na
sequência de e-mail.

| Variável | Evento | Dispara quando |
|---|---|---|
| `VITE_WEBHOOK_EBOOK` | `ebook` | Alguém baixa o ebook em `/ebook-10-horas` |
| `VITE_WEBHOOK_DIAGNOSTICO` | `diagnostico` | Alguém conclui o quiz em `/diagnostico` |
| `VITE_WEBHOOK_CALCULADORA` | `calculadora` | Alguém calcula a hora real em `/calculadora` |
| `VITE_WEBHOOK_MASTERCLASS` | `masterclass` | Inscrição na Masterclass |
| `VITE_WEBHOOK_DESAFIO` | `desafio` | Inscrição no Desafio 21 Dias |

## Formato

`POST` com `Content-Type: application/json`. Todo payload traz sempre:

```json
{
  "evento": "diagnostico",
  "enviadoEm": "2026-08-26T20:31:00.000Z",
  "origemPagina": "/diagnostico",
  "nome": "Maria Silva",
  "email": "maria@exemplo.com",
  "telefone": "+55 11 99999-0000",
  "regiao": "São Paulo - SP",
  "profissao": "Construção civil"
}
```

`regiao` e `profissao` são as duas perguntas novas dos formulários. `profissao`
vem da lista fechada de `src/lib/lead-fields.ts` — o texto chega exatamente
como está lá, o que permite segmentar por ela no GHL sem normalizar nada.

E mais, conforme o evento:

| Evento | Campos adicionais |
|---|---|
| `ebook` | `origem` (parâmetro `?src=` do Reel), `pdfUrl`, `especialidade` (sempre `null`) |
| `diagnostico` | `escore`, `perfil`, `titulo`, `cor`, `descricao`, `acoes` (5 itens), `respostas`, `especialidade` (sempre `null`) |
| `calculadora` | `horasSemanais`, `valorConsulta`, `horaReal` |
| `masterclass` | `especialidade` (sempre `"Masterclass"`) |
| `desafio` | `especialidade` (sempre `"Desafio 21 Dias"`) |

> `especialidade` é herança do material original, quando o formulário perguntava
> a especialidade médica. Continua no payload para não quebrar quem já mapeou o
> campo, mas o dado útil agora é `profissao`.

### Sobre o diagnóstico

É o único e-mail personalizado. O perfil do lead sai do escore
(0–30 Colapso · 31–55 Alerta · 56–75 Transição · 76–100 Ativo), e o webhook já
manda `descricao` e `acoes` **prontos para aquele perfil**. Ou seja: você monta
**um template só**, não quatro — basta percorrer `acoes`.

## Templates

| Arquivo | E-mail | Assunto sugerido |
|---|---|---|
| `ebook-lead.html` | Entrega do ebook | `Seu ebook: As 10 Horas Escondidas` |
| `diagnostico-lead.html` | Resultado do diagnóstico | `Seu Diagnóstico Guardião — {{titulo}} ({{escore}}/100)` |

A copy é a original do backend da plataforma Manus, preservada integralmente.
As merge tags seguem o padrão `{{campo}}`, com os mesmos nomes do payload.

## Montando no GoHighLevel

São 5 workflows, um por evento. Para cada um:

1. **Automation → Workflows → Create Workflow**, começando em branco.
2. Gatilho: **Inbound Webhook**. O GHL gera a URL — é ela que eu preciso.
3. Ensine o formato dos campos ao GHL: cole o JSON daquele evento
   (`payloads-exemplo.json`) no campo de amostra do gatilho, ou faça um POST
   com ele na URL gerada:

   ```bash
   curl -X POST "URL_GERADA_PELO_GHL" \
     -H "Content-Type: application/json" \
     -d @payload-do-evento.json
   ```

   Sem esse passo os campos não aparecem para referência nas ações seguintes.
4. Ações do workflow — normalmente três:
   - **Create/Update Contact** com `nome`, `email`, `telefone`
   - **Send Email** com o template correspondente (`ebook-lead.html` ou
     `diagnostico-lead.html`), trocando as merge tags `{{campo}}` pela
     referência do webhook no GHL
   - **Internal Notification** para `contato@drsantiagovecina.com`, se quiser
     manter o aviso em tempo real que existia no material original
5. Publique o workflow e me mande a URL. Eu cadastro na variável de ambiente
   correspondente na Vercel.

> A sintaxe exata para referenciar um campo do webhook varia com a versão do
> builder do GHL (algo como `{{inboundWebhookRequest.nome}}`). Confirme no seu
> painel ao montar o primeiro e o resto segue o mesmo padrão.

O e-mail do diagnóstico tem uma lista, `acoes`, com 5 itens. Se o seu builder
não iterar array com facilidade, o caminho mais simples é referenciar os itens
por índice (`acoes.0` … `acoes.4`) — me avise se preferir que eu mande as 5
ações como 5 campos separados (`acao1` … `acao5`), que é um ajuste de uma linha
aqui.

## Sequências no GHL

As sequências foram escritas direto no GoHighLevel, uma por isca. O site
dispara **apenas o d0**; o restante do drip é o workflow do GHL:

| Evento do site | Sequência no GHL |
|---|---|
| `diagnostico` | `isca1-quiz` — d0, d1, d2, d4, d7 |
| `calculadora` | `isca2-calculadora` — d0, d1, d2, d4, d7 |
| `ebook` | `isca3-ebook` — d0, d1, d3 |
| `masterclass` | `isca4-masterclass` — d0, d2 |
| `desafio` | confirmação da inscrição |

## Formulários que ainda não disparam webhook

Dois formulários gravam o lead no CRM mas **não entram em nenhuma sequência**,
porque não existe evento definido para eles:

- **Contato da home** (`/`) — o formulário "Agendar Conversa Estratégica",
  que traz também um campo de mensagem livre.
- **Iscas** (`/iscas`) — o formulário de acesso ao material, que sabe qual
  isca foi pedida (vai no comentário do contato como "Material solicitado").

Ligar qualquer um dos dois é acrescentar um evento em `src/lib/webhooks.ts` e
a variável correspondente na Vercel.

## E-mail do código de acesso

O `auth-codigo-acesso.html` **não é webhook**. Quem envia é o Supabase Auth,
porque o código de login não pode passar pelo navegador. Ele é colado nos
templates *Magic Link* e *Confirm signup* do painel do Supabase, e sai pelo
SMTP do Resend configurado em `Authentication → Emails`.
