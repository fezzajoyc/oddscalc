import type { Dictionary } from "../i18n";

const pt: Dictionary = {
  brand: "Oddscalc",
  tagline: "Toda probabilidade exata, no seu navegador.",
  metaDesc:
    "Calculadoras de probabilidade exatas: somas de dados, lançamentos de moeda, chances de loteria e o paradoxo do aniversário — com a fórmula à vista e frações exatas. Grátis, no navegador, sem enviar nada.",

  nav: {
    tools: "Todas as ferramentas",
    categories: "Categorias",
    about: "Sobre",
    menu: "Menu",
    language: "Idioma",
  },

  home: {
    heroTitle: "Chances exatas, sem achismo — dados, moedas, loteria",
    heroSub:
      "Oddscalc é um conjunto de calculadoras de probabilidade que mostram o cálculo: somas de dados por contagem combinatória, moedas pela binomial, loteria pela hipergeométrica e o paradoxo do aniversário por produto iterativo. Cada número vem com a fração exata — sem simulação, sem arredondamento, nada enviado.",
    browseAll: "Ver todas as ferramentas",
    categoriesTitle: "Categorias",
    featuredTitle: "Ferramentas populares",
    trustLocal: "Seus arquivos ficam no seu dispositivo",
    trustFree: "Grátis, sem conta",
    trustFast: "Instantâneo, funciona offline",
    rotating: [
      "Com 2d6, o 7 sai de 6 em 36 maneiras — e a tabela prova",
      "3 lançamentos, 2 caras: exatamente 3/8, não «quase»",
      "6 de 49? Prêmio máximo 1 em 13.983.816, acertar 3: 1 em 57",
      "Com 23 pessoas já passa de 50% um aniversário compartilhado",
    ],
    statsLabels: { tools: "ferramentas", languages: "idiomas", uploads: "envios", accounts: "contas" },
    eyebrow: "Grátis sempre",
    heroCtaSecondary: "Como funciona",
    statsTools: "{n} ferramentas",
    statsLanguages: "{n} idiomas",
    statsUploads: "0 envios",
    statsAccounts: "0 contas",
    categoriesSub: "Uma família de calculadoras de probabilidade, exatas e no seu aparelho.",
    popularSub: "As ferramentas mais usadas.",
    privacyTitle: "Seus números nunca saem do seu aparelho.",
    privacySub: "Não existe a etapa de envio: as ferramentas são JavaScript rodando no seu navegador. Não é promessa de política, é como elas são feitas.",
    privacyPoint1T: "Processamento local",
    privacyPoint1D: "Os arquivos são lidos pela File API do navegador e processados na memória. Nada é transmitido.",
    privacyPoint2T: "Sem contas",
    privacyPoint2D: "Sem cadastro, sem e-mail, sem histórico. Abra e use.",
    privacyPoint3T: "Honestos por design",
    privacyPoint3D: "Se algo não dá para fazer no navegador, dizemos em vez de fingir.",
    privacyLink: "Ler a nota de privacidade",
    endTitle: "Escolha uma ferramenta. Ela funciona.",
    endSub: "Quatro calculadoras, quinze idiomas, zero envios.",
  },

  tools: {
    title: "Todas as ferramentas",
    subtitle: "Pesquise entre {count} ferramentas gratuitas. Sem uploads, sem cadastro.",
    filterPlaceholder: "Pesquisar ferramentas…",
    count: "{count} ferramentas",
    empty: "Nenhuma ferramenta corresponde a “{query}”.",
  },

  categories: {
    pdf: { name: "PDF", desc: "Junte, divida, converta e edite PDFs sem enviar nada para servidores." },
    image: { name: "Imagem", desc: "Comprima, redimensione, recorte e converta imagens no navegador." },
    text: { name: "Texto", desc: "Conte, limpe, ordene e transforme texto na hora, enquanto digita." },
    developer: { name: "Desenvolvedor", desc: "Formatadores, codificadores, decodificadores e geradores para o dia a dia." },
    seo: { name: "SEO", desc: "Meta tags, dados estruturados, prévia de SERP e outros auxiliares de SEO." },
    security: { name: "Segurança", desc: "Senhas, hashes e consultas — gerados e verificados no seu dispositivo." },
    utility: { name: "Utilidades", desc: "Dados, moedas, loteria e aniversários — probabilidade com a fórmula à vista." },
  },

  tool: {
    howTo: "Como usar",
    faq: "Perguntas frequentes",
    related: "Ferramentas relacionadas",
    privacyNote:
      "Esta ferramenta roda inteiramente no seu navegador. Seus dados nunca saem do seu dispositivo e não são enviados a nenhum servidor.",
    inCategory: "Mais em {category}",
    backToCategory: "Todas as ferramentas de {category}",
  },

  common: {
    openTool: "Abrir ferramenta",
    copy: "Copiar",
    copied: "Copiado",
    download: "Baixar",
    reset: "Redefinir",
    swap: "Inverter",
    clear: "Limpar",
    error: "Algo deu errado. Verifique os dados e tente novamente.",
    input: "Entrada",
    output: "Resultado",
    settings: "Opções",
    dropFiles: "Arraste arquivos aqui ou clique para escolher",
    dropFile: "Arraste um arquivo aqui ou clique para escolher",
    processing: "Processando…",
    fileSize: "Tamanho",
    sample: "Testar um exemplo",
    uppercase: "MAIÚSCULAS",
  },

  unit: {
    from: "De",
    to: "Para",
    amount: "Quantidade",
    result: "Resultado",
    common: "Conversões comuns",
    formula: "Fórmula",
    allUnits: "Todas as unidades",
  },

  text: {
    stats: {
      words: "Palavras",
      characters: "Caracteres",
      charsNoSpaces: "Sem espaços",
      sentences: "Frases",
      paragraphs: "Parágrafos",
      lines: "Linhas",
      readingTime: "Tempo de leitura",
      readingMinutes: "{n} min de leitura",
    },
  },

  footer: {
    line: "Calculadoras de probabilidade exatas. Tudo roda no seu navegador.",
    privacy: "Privacidade",
    terms: "Termos",
    about: "Sobre",
    badges: "Selos",
    language: "Idioma",
  },

  badge: {
    title: "Selos do Oddscalc",
    desc: "Coloque um selo do Oddscalc no seu site, README ou documentação. Ele linka para cá e conta que as chances são calculadas com exatidão, no navegador.",
    voluntary: "Incorporar é totalmente voluntário — escolha um selo se gostar do projeto. Não precisa de permissão.",
    md: "Markdown (README)",
    html: "HTML (site)",
    thanks: "Obrigado por divulgar — cada incorporação ajuda mais pessoas a descobrir ferramentas que respeitam seus arquivos.",
  },

    embed: {
    title: "Incorporar esta ferramenta",
    desc: "Coloque esta ferramenta no seu site com uma linha — ela roda no navegador do visitante.",
  },

    mcp: {
    title: "Servidor MCP — ferramentas acessíveis para IA",
    desc1: "O Oddscalc inclui um servidor MCP (Model Context Protocol): assistentes de IA como Claude ou Cursor podem executar as mesmas calculadoras de probabilidade deste site — mesma lógica testada, sem reimplementação.",
    desc2: "As ferramentas executam as funções puras do próprio site: distribuições de dados, estatísticas binomiais de moeda, chances hipergeométricas de loteria e o produto do aniversário. A execução acontece na máquina do cliente de IA via npx — nada é enviado aos nossos servidores.",
    toolsTitle: "Ferramentas executáveis ({n})",
    requiresNode: "Requer Node.js 18+. O servidor roda localmente via stdio; apenas as chamadas que você fizer são calculadas na sua máquina.",
    privacy: "Requer Node.js 18+. O servidor roda localmente via stdio; apenas as chamadas que você fizer são calculadas na sua máquina.",
  },

    notFound: {
    title: "Página não encontrada",
    body: "A ferramenta que você procura não existe. Explore todas as ferramentas.",
    home: "Ir para a página inicial",
  },
};

export default pt;
