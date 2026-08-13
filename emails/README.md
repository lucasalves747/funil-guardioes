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

## Ainda sem copy

Estes eventos disparam o webhook com os dados corretos, mas **nunca tiveram
texto de e-mail escrito** — precisam de copy antes de serem ligados:

- **`calculadora`** — a tela diz "Resultado enviado para o seu email ✓", mas o
  backend original só notificava a equipe; o lead nunca recebeu nada.
- **`masterclass`** — a página promete "Enviamos os detalhes de acesso para o
  seu email".
- **`desafio`** — a página `/obrigado` promete e-mail de confirmação com link do
  grupo de WhatsApp e cronograma das lives.
