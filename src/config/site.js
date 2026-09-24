// ---------------------------------------------------------------------------
// Conteúdo central do site — TODA a informação factual vem da pasta /Regras
// (Informações.txt, Avaliações.txt, Paleta de Cores.jpeg, Fontes.jpeg, Logo*.png).
// Campos marcados com "pending: true" NÃO existem nas regras e não podem ser
// inventados — ficam como pendência visível até o cliente fornecer o dado real.
// ---------------------------------------------------------------------------

export const doctor = {
  fullName: "Dra. Karen Viegas Albuquerque",
  shortName: "Dra. Karen Viegas",
  crm: "CRM MG 62187",
  rqe: "RQE 41596",
  specialty: "Ginecologia e Obstetrícia",
  tagline: "Do pré-natal ao parto, estou com você",
  heroDescription:
    "Acompanhamento ginecológico e obstétrico com atenção, acolhimento e segurança em cada etapa.",
  city: "Ipatinga/MG",
};

// Biografia completa — texto fornecido pelo cliente (29/08/2026), usado no
// modal "Biografia" da seção Sobre.
export const bio = [
  "Sou a Dra. Karen, médica formada pela Universidade Federal de São João Del-Rei (2013), com residência em Ginecologia e Obstetrícia pelo Hospital Márcio Cunha (2018) e formação em Gestação de Alto Risco.",
  "Sou esposa do Guilherme e mãe da Maria Clara e da Maria Cecília, papéis que exercem grande influência na forma humana e cuidadosa com que pratico a medicina. Minha trajetória é marcada pelo compromisso com a saúde da mulher, pela busca constante por atualização e pelo acolhimento em cada fase da vida feminina.",
];

export const address = {
  street: "Avenida Castelo Branco, 896, sala 506",
  neighborhood: "Horto",
  city: "Ipatinga",
  state: "MG",
  zip: "35160-294",
  full: "Avenida Castelo Branco, 896, sala 506 - Horto, Ipatinga/MG, 35160-294",
  mapsQuery: "Avenida Castelo Branco, 896, sala 506, Horto, Ipatinga - MG, 35160-294",
};

export const amenities = {
  accessibility: [
    "Assento com acessibilidade para pessoas em cadeira de rodas",
    "Banheiro com acessibilidade para pessoas em cadeira de rodas",
  ],
  facilities: ["Banheiro"],
  planning: ["É recomendado marcar hora"],
  payments: [
    "Cartão de crédito",
    "Cartão de débito",
    "Pagamento por aproximação (NFC)",
  ],
};

// Número de WhatsApp fornecido pelo cliente (+55 31 99664-8080). Usamos o
// formato padrão wa.me. Por privacidade, o site usa somente a mensagem fixa
// abaixo: nenhum dado digitado pela paciente é coletado ou colocado na URL.
// Todos os CTAs do site leem deste único ponto.
export const contact = {
  whatsappNumber: "5531996648080",
  whatsappLink: "https://wa.me/5531996648080",
  whatsappMessage:
    "Olá! Gostaria de obter informações sobre uma consulta com a Dra. Karen Viegas.",
  email: "disporpartoipatinga@gmail.com",
  emailPending: false,
  instagramUrl: "https://www.instagram.com/drakarenviegas/",
};

// Áreas de atuação citadas explicitamente em /Regras (título do perfil +
// headline). Não há lista detalhada de tratamentos/exames — não inventada.
export const careAreas = [
  {
    title: "Pré-natal",
    description:
      "Acompanhamento da gestação do início ao fim, com atenção e escuta em cada etapa.",
  },
  {
    title: "Parto",
    description: "Suporte no momento do parto, com segurança e cuidado humanizado.",
  },
  {
    title: "Ginecologia",
    description: "Cuidado com a saúde da mulher em todas as fases da vida.",
  },
  {
    title: "Obstetrícia",
    description: "Atendimento obstétrico completo, da concepção ao pós-parto.",
  },
];

// Diferenciais — padrões recorrentes observados nas avaliações reais de
// pacientes (Regras/Avaliações.txt), reescritos como texto próprio do site.
export const differentials = [
  {
    title: "Atendimento humanizado",
    description:
      "Escuta calma e atenção a cada detalhe, do primeiro contato à consulta.",
  },
  {
    title: "Segurança na gestação",
    description:
      "Pacientes relatam tranquilidade e confiança durante todo o pré-natal.",
  },
  {
    title: "Equipe atenciosa",
    description:
      "Recepção e secretaria reconhecidas pelas pacientes pela agilidade e cuidado.",
  },
  {
    title: "Ambiente acolhedor",
    description: "Consultório organizado, confortável e pensado para a paciente.",
  },
];

// Depoimentos reais extraídos de Regras/Avaliações.txt (Google Reviews).
// Sobrenome reduzido a inicial por discrição no texto do site; o link em
// `reviewUrl` (fornecido pelo cliente, copiado manualmente do botão
// "Compartilhar" de cada avaliação no Google Maps) aponta pra avaliação
// pública original — qualquer visitante pode conferir que é real.
// Textos com "…" no fim são avaliações que o próprio Google trunca atrás
// de um "Leia mais" — mantidos truncados por fidelidade, não é corte nosso.
// `category` classifica cada citação pelo que ELA MESMA já menciona
// (pré-natal/gravidez, parto/obstetra, ou elogio geral de atendimento) —
// não é dado inventado, é organização do texto real pra permitir filtro.
export const testimonials = [
  {
    name: "Bruna S.",
    text: "Dra. Karen é uma excelente profissional. Já passei por algumas consultas com ela e sempre fui atendida com muita atenção, cuidado e profissionalismo. Ela transmite segurança, escuta com calma e demonstra verdadeiro cuidado com o paciente.",
    category: "atendimento",
    reviewUrl: "https://maps.app.goo.gl/QTMx1uGxoKPjHeUR7",
  },
  {
    name: "Lorrayne S.",
    text: "Ter a Dra. Karen ao nosso lado fez toda a diferença, desde o primeiro atendimento até a chegada da nossa filha. Além de ser uma profissional maravilhosa, extremamente competente e dedicada, ela tem um coração enorme e um cuidado genuíno que…",
    category: "parto",
    reviewUrl: "https://maps.app.goo.gl/SVpwwjPT52i3DMVh7",
  },
  {
    name: "Caroline M.",
    text: "Dra Karen é maravilhosa!! Tive oportunidade de consultar algumas vezes com ela na gravidez, e fui muito bem recebida e cuidada. O atendimento começa nota 10, pela Carol, sua secretária, e a Dra Karen nem se fala, nota 10/10.",
    category: "pre-natal",
    reviewUrl: "https://maps.app.goo.gl/N1RRpmWhjvJNeVLu7",
  },
  {
    name: "Guiomar F.",
    text: "Uma experiência maravilhosa, encantada com a gentileza e delicadeza de todos os profissionais — isso faz toda diferença no cuidado humano com nós, gestantes, que ficamos sensíveis com tudo. Estou amando consultar com a Dra. Karen, e ser atendida com carinho pela recepção.",
    category: "pre-natal",
    reviewUrl: "https://maps.app.goo.gl/UXDJ14W27R7NEGt89",
  },
  {
    name: "Maria L.",
    text: "Dra Karen é maravilhosa, lugar excelente, aconchegante e uma recepcionista excelente, muito educada, carinhosa e simpática. Estou realizando pré-natal com ela e cada dia me encanto mais com o profissionalismo dela.",
    category: "pre-natal",
    reviewUrl: "https://maps.app.goo.gl/mTbQiaGgvWQE4caU6",
  },
  {
    name: "Gabrielle S.",
    text: "Melhor experiência impossível! Maravilhosas no atendimento, desde a recepção até o pós-consulta. Super atenciosas e disponíveis — serei eternamente grata à Dra. Karen e a toda equipe por todo o acolhimento e cuidado comigo.",
    category: "atendimento",
    reviewUrl: "https://maps.app.goo.gl/MNjpivYQUAYkVZ3V6",
  },
  {
    name: "Giovanna L.",
    text: "Dra. Karen Viegas conseguiu ir muito além do que esperávamos, cuidou de mim no melhor momento da minha vida, e sem sombra de dúvidas será minha obstetra nas próximas gestações.",
    category: "parto",
    reviewUrl: "https://maps.app.goo.gl/hv4uBwscBEp5498d7",
  },
  {
    name: "Daiana P.",
    text: "Ótimo atendimento! Desde as recepcionistas até a Dra. Karen, todas muito atenciosas e nos tratam da melhor forma possível. Recomendo de olhos fechados!",
    category: "atendimento",
    reviewUrl: "https://maps.app.goo.gl/MTJFPAGGmJGovFuH6",
  },
  {
    name: "Vera F.",
    text: "Dra Karen é maravilhosa como pessoa e como profissional, super atualizada! Me acompanha no pré-natal do meu primeiro filho. Acolheu a mim e ao meu marido com todas as dúvidas, sem pressa, sempre dando muita atenção.",
    category: "pre-natal",
    reviewUrl: "https://maps.app.goo.gl/Z1pWG2Eu7B9nMmDR9",
  },
  {
    name: "Isabella W.",
    text: "A Dra. Karen é excelente, me passou segurança e muita tranquilidade durante todo o meu pré-natal. Super competente, profissional qualificada e atenciosa. As recepcionistas, um amor. Uma experiência de qualidade!",
    category: "pre-natal",
    reviewUrl: "https://maps.app.goo.gl/xwUx1Z7qYsXoxmDC6",
  },
  {
    name: "Bruna R.",
    text: "Atendimento acolhedor e humanizado. As meninas da recepção são muito atenciosas. A Dra. Karen, um doce de pessoa e muito competente!",
    category: "atendimento",
    reviewUrl: "https://maps.app.goo.gl/FQAuyGnM5ywicRKDA",
  },
  {
    name: "Kaliane Q.",
    text: "Excelente profissional, muito satisfeita com o atendimento desde a recepção até a consulta com a Dra. Karen. Super indico.",
    category: "atendimento",
    reviewUrl: "https://maps.app.goo.gl/3QPdefAKxqQ3ucVf8",
  },
  {
    name: "Gabriela L.",
    text: "Dra. Karen é uma excelente profissional que acompanha minha filha desde que chegamos em Ipatinga. Ela é atenciosa, simpática, disponível, e muito, muito competente. Confio e indico de olhos fechados.",
    category: "atendimento",
    reviewUrl: "https://maps.app.goo.gl/7AhpHvUDkZeDXpKP6",
  },
  {
    name: "Gabi M.",
    text: "Dra. Karen é simplesmente maravilhosa! Sempre muito atenciosa, acolhedora e cuidadosa em cada detalhe da gestação. Explica tudo com muita calma e transmite muita segurança…",
    category: "pre-natal",
    reviewUrl: "https://maps.app.goo.gl/oo2SF51Xgd973DzK9",
  },
  {
    name: "Gisselle G.",
    text: "Fui bem recebida pela secretária, extremamente atenciosa. A Dra. Karen é uma profissional excelente, sempre explicando tudo de forma super clara e acolhedora. O consultório é aconchegante e lindo.",
    category: "atendimento",
    reviewUrl: "https://maps.app.goo.gl/ujSEXePexKhHWiH4A",
  },
  {
    name: "Dorcas C.",
    text: "Foi muito bom, gostei bastante da consulta. Bem calma e tranquila para nos ouvir.",
    category: "atendimento",
    reviewUrl: "https://maps.app.goo.gl/FAuNgNvHffuWVEno7",
  },
  {
    name: "Esther O.",
    text: "Sem palavras para o atendimento da Dra. Karen! Atenciosa, educada, passa segurança e tranquilidade, e é riquíssima de conhecimento.",
    category: "atendimento",
    reviewUrl: "https://maps.app.goo.gl/wDQv2DB9SGEjaKqp6",
  },
  {
    name: "Mislene F.",
    text: "Fui extremamente bem acolhida na clínica! O atendimento é extraordinário e, acima de tudo, humanizado…",
    category: "atendimento",
    reviewUrl: "https://maps.app.goo.gl/uvuJxfWUB16cotUKA",
  },
  {
    name: "Jayne S.",
    text: "A experiência com a Dra Karen é maravilhosa desde a marcação ao atendimento com ela. Super recomendo, uma médica que se preocupa de fato com a paciente e não negligencia nada.",
    category: "atendimento",
    reviewUrl: "https://maps.app.goo.gl/cGsvyKiBQQFVqEeC9",
  },
  {
    name: "Márcia M.",
    text: "Ambiente moderno e acolhedor. Dra Karen impecável no tratamento com suas pacientes, super respeitosa quanto às nossas questões e desejos pessoais, além de atualizada sobre a saúde da mulher, da gestante e do feto.",
    category: "pre-natal",
    reviewUrl: "https://maps.app.goo.gl/iG3sgRe6m8pvUkvF7",
  },
  {
    name: "Luana M.",
    text: "Gostei muito, são todos simpáticos e carinhosos, além de prestativos. A Dra. Karen é excelente profissional e tem empatia com a paciente — sou agradecida!",
    category: "atendimento",
    reviewUrl: "https://maps.app.goo.gl/bbCekTbvBGdot2Rz5",
  },
  {
    name: "Sandi E.",
    text: "Secretárias excelentes, ótimo atendimento! A Dra. Karen, sem dúvidas, é a melhor médica da região — indico muito!",
    category: "atendimento",
    reviewUrl: "https://maps.app.goo.gl/bCJfMi5qVAQmqzj78",
  },
  {
    name: "Alice R.",
    text: "Atendimento maravilhoso, super atenciosa e carinhosa desde a primeira consulta, consultório sempre organizado. Só tenho a agradecer por cuidar tão bem de mim e da minha princesa.",
    category: "parto",
    reviewUrl: "https://maps.app.goo.gl/b5AiznFUBQuS1wXW6",
  },
  {
    name: "Camila E.",
    text: "Sem dúvidas a melhor do Vale do Aço. Muito carinhosa, simpática e excelente profissional — fez meu pré-natal e parto do primeiro filho, e está comigo na segunda gestação.",
    category: "parto",
    reviewUrl: "https://maps.app.goo.gl/AAwypL5G1QLWCv8H9",
  },
  {
    name: "Adriana D.",
    text: "Experiência maravilhosa, a secretaria é muito educada e resolutiva, a Dra. Karen muito atenciosa e profissional. Só tenho elogios, super indico o consultório.",
    category: "atendimento",
    reviewUrl: "https://maps.app.goo.gl/EvKctqPAG8P7Mp23A",
  },
  {
    name: "Gabriela M.",
    text: "Serviço impecável. Desde a secretária no atendimento pelo WhatsApp até a consulta com a Dra. Karen. Me sinto muito tranquila e segura em ser cuidada por ela.",
    category: "atendimento",
    reviewUrl: "https://maps.app.goo.gl/LcgxChZN5egMBuKD7",
  },
  {
    name: "Marcelly M.",
    text: "Dra. Karen é muito atenciosa, gentil e uma excelente profissional.",
    category: "atendimento",
    reviewUrl: "https://maps.app.goo.gl/YiwquFV8bHvMHVUq7",
  },
];

export const testimonialFilters = [
  { value: "todos", label: "Todos" },
  { value: "pre-natal", label: "Pré-natal" },
  { value: "parto", label: "Parto" },
  { value: "atendimento", label: "Atendimento" },
];

// Resumo da ficha no momento em que Avaliações.txt foi fornecido: o arquivo
// contém 42 avaliações, todas com cinco estrelas. Manter este dado sincronizado
// com a ficha pública quando novas avaliações forem incorporadas ao projeto.
export const googleReviewSummary = {
  rating: "5,0",
  count: 42,
};

export const faq = [
  {
    q: "Como faço para agendar uma consulta?",
    a: "O agendamento é feito diretamente pelo WhatsApp — clique em qualquer botão \"Agendar consulta\" do site para iniciar a conversa.",
  },
  {
    q: "A Dra. Karen atende por convênio ou apenas particular?",
    a: "Consulte disponibilidade de convênio e valores diretamente pelo WhatsApp antes de agendar.",
  },
  {
    q: "Preciso marcar horário com antecedência?",
    a: "Sim, é recomendado marcar hora antes de comparecer ao consultório.",
  },
  {
    q: "O consultório tem acessibilidade?",
    a: "Sim. O espaço conta com assento e banheiro com acessibilidade para pessoas em cadeira de rodas.",
  },
  {
    q: "Quais formas de pagamento são aceitas?",
    a: "Cartão de crédito, cartão de débito e pagamento por aproximação (NFC).",
  },
  {
    q: "Quando devo iniciar o pré-natal?",
    a: "O ideal é iniciar assim que a gravidez for confirmada, para acompanhar cada etapa da gestação desde o começo.",
  },
];

export const nav = [
  { label: "Início", href: "#inicio" },
  { label: "Atuação", href: "#atuacao" },
  { label: "Localização", href: "#localizacao" },
  { label: "Sobre", href: "#sobre" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "FAQ", href: "#faq" },
  { label: "Contato", href: "#contato" },
];
