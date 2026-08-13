# E-mails do funil — contrato do webhook

O site é estático e **não envia e-mail**. A cada conversão ele faz um `POST` no
webhook daquele evento com os dados já estruturados; quem monta e dispara o
e-mail é o sistema do outro lado.

## Configuração

Uma URL por evento, cadastradas como variáveis de ambiente na Vercel
(Settings → Environment Variables). Evento sem URL é ignorado em silêncio — o
lead continua sendo gravado no Supabase normalmente.

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
  "enviadoEm": "2026-08-13T20:31:00.000Z",
  "origemPagina": "/diagnostico",
  "nome": "Carlos Almeida",
  "email": "carlos@exemplo.com",
  "telefone": "+5511999998888"
}
```

E mais, conforme o evento:

| Evento | Campos adicionais |
|---|---|
| `ebook` | `especialidade`, `origem` (parâmetro `?src=` do Reel), `pdfUrl` |
| `diagnostico` | `especialidade`, `escore`, `perfil`, `titulo`, `cor`, `descricao`, `acoes` (5 itens), `respostas` |
| `calculadora` | `horasSemanais`, `valorConsulta`, `horaReal` |
| `masterclass` | `especialidade` |
| `desafio` | `especialidade` |

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

## Ainda sem copy

Estes eventos disparam o webhook com os dados corretos, mas **nunca tiveram
texto de e-mail escrito** — precisam de copy antes de serem ligados:

- **`calculadora`** — a tela diz "Resultado enviado para o seu email ✓", mas o
  backend original só notificava a equipe; o lead nunca recebeu nada.
- **`masterclass`** — a página promete "Enviamos os detalhes de acesso para o
  seu email".
- **`desafio`** — a página `/obrigado` promete e-mail de confirmação com link do
  grupo de WhatsApp e cronograma das lives.
