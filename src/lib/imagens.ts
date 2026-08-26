/**
 * Todas as imagens do funil, num lugar só.
 *
 * O material original apontava para o CDN da plataforma Manus
 * (d2xsxph8kpxj0f.cloudfront.net). Esse CDN responde 403 em todas as URLs — o
 * funil estava publicando nove imagens quebradas. As que existem hoje vêm do
 * site drsantiagovecina.com, da conta de mídia do próprio Dr. Santiago.
 *
 * Para trocar qualquer imagem, basta publicar a nova no site e colar a URL
 * aqui — nenhuma página precisa ser alterada.
 */

/** Dr. Santiago no escritório, skyline ao pôr do sol. Horizontal, 2752x1536. */
export const RETRATO_ESCRITORIO =
  "https://assets.cdn.filesafe.space/PMW6fmu3oCfXFYueuN2D/media/69bcb2ef3147fd2d716e8688.png";

/** Dr. Santiago de terno, fundo cinza. Vertical, 2317x3217. */
export const RETRATO_TERNO =
  "https://assets.cdn.filesafe.space/PMW6fmu3oCfXFYueuN2D/media/69bcb3d77e33efa90585354a.jpg";

/** Família do Dr. Santiago. Horizontal, 2172x1448. */
export const FAMILIA =
  "https://assets.cdn.filesafe.space/PMW6fmu3oCfXFYueuN2D/media/69bcb7322f5f659fea58ce9c.jpeg";

/** Dr. Santiago recebendo a medalha na Mammoth Endurance. Vertical, 1152x2048. */
export const ULTRAMAN =
  "https://assets.cdn.filesafe.space/PMW6fmu3oCfXFYueuN2D/media/6a8f154a1a899e42643cad44.jpeg";

/** Capa de "O Despertar de um Pai Órfão". Vertical. */
export const CAPA_PAI_ORFAO =
  "https://assets.cdn.filesafe.space/PMW6fmu3oCfXFYueuN2D/media/6936f2f72ec4f51caf93860e.png";

/** Imagem da seção de livros da home. */
export const LIVROS_COLECAO = CAPA_PAI_ORFAO;

/**
 * Mockups de produto, gerados na identidade do funil (preto, dourado, serifada)
 * e servidos do próprio site — nada de CDN de terceiros. Ficam em public/mockups.
 */

/** Tablet com uma pergunta real do diagnóstico na tela. */
export const MOCKUP_QUIZ = "/mockups/quiz.jpg";

/** Capa do ebook "As 10 Horas Escondidas" em volume impresso. */
export const MOCKUP_EBOOK = "/mockups/ebook.jpg";

/** Notebook com o player da masterclass. */
export const MOCKUP_MASTERCLASS = "/mockups/masterclass.jpg";
