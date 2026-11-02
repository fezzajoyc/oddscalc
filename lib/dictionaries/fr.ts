import type { Dictionary } from "../i18n";

// Français (fr) — vouvoiement constant, sans anglicismes évitables.
// Contrat : forme des clés identique à en (tests/seo.test.ts), valeurs en français.
const fr: Dictionary = {
  brand: "Oddscalc",
  tagline: "Chaque probabilité, exacte et dans votre navigateur.",
  metaDesc:
    "Calculatrices de probabilité exactes : sommes de dés, lancers de pièce, chances de loterie et paradoxe des anniversaires — formules affichées et fractions exactes. Gratuit, dans votre navigateur, sans aucun envoi.",

  nav: {
    tools: "Tous les outils",
    categories: "Catégories",
    about: "À propos",
    menu: "Menu",
    language: "Langue",
  },

  home: {
    heroTitle: "Des probabilités exactes, pas des intuitions — dés, pièces, loterie",
    heroSub:
      "Oddscalc est un ensemble de calculatrices de probabilité qui montrent leur raisonnement : sommes de dés par dénombrement combinatoire, pièces par la loi binomiale, loterie par la loi hypergéométrique et paradoxe des anniversaires par produit itératif. Chaque nombre arrive avec sa fraction exacte — aucune simulation, aucun arrondi, aucun envoi.",
    browseAll: "Voir tous les outils",
    categoriesTitle: "Catégories",
    featuredTitle: "Outils populaires",
    trustLocal: "Vos fichiers restent sur votre appareil",
    trustFree: "Gratuit, sans compte",
    trustFast: "Instantané, fonctionne hors ligne",
    rotating: [
      "Avec 2d6, le 7 sort de 6 façons sur 36 — le tableau le prouve",
      "3 lancers, 2 piles : exactement 3/8, pas « à peu près »",
      "6 parmi 49 ? Jackpot 1 sur 13 983 816, trois bons numéros 1 sur 57",
      "Dès 23 personnes, un anniversaire partagé dépasse 50 %",
    ],
    statsLabels: { tools: "outils", languages: "langues", uploads: "envois", accounts: "comptes" },
    eyebrow: "Gratuit, pour toujours",
    heroCtaSecondary: "Comment ça marche",
    statsTools: "{n} outils",
    statsLanguages: "{n} langues",
    statsUploads: "0 envoi",
    statsAccounts: "0 compte",
    categoriesSub: "Une famille de calculatrices de probabilité, exactes et sur votre appareil.",
    popularSub: "Les outils que l'on ouvre le plus.",
    privacyTitle: "Vos nombres ne quittent jamais votre appareil.",
    privacySub:
      "Il n'y a aucune étape d'envoi. Les outils sont du JavaScript exécuté dans votre navigateur — ce n'est pas une promesse de politique de confidentialité, c'est ainsi qu'ils sont conçus.",
    privacyPoint1T: "Traitement local",
    privacyPoint1D:
      "Les fichiers sont lus avec la File API du navigateur et traités en mémoire. Rien n'est transmis, nulle part.",
    privacyPoint2T: "Aucun compte",
    privacyPoint2D: "Pas d'inscription, pas d'e-mail, pas d'historique conservé. Ouvrez un outil et utilisez-le.",
    privacyPoint3T: "Honnête par conception",
    privacyPoint3D:
      "Si quelque chose ne peut réellement pas être fait dans le navigateur, nous le disons au lieu de le faire semblant.",
    privacyLink: "Lire la note de confidentialité complète",
    endTitle: "Choisissez un outil. Il fonctionne, tout simplement.",
    endSub: "Quatre calculatrices, quinze langues, zéro envoi.",
  },

  tools: {
    title: "Tous les outils",
    subtitle: "Cherchez parmi {count} outils gratuits dans le navigateur. Sans envoi, sans inscription.",
    filterPlaceholder: "Rechercher un outil…",
    count: "{count} outils",
    empty: "Aucun outil ne correspond à « {query} ».",
  },

  categories: {
    pdf: { name: "PDF", desc: "Fusionnez, divisez, convertissez et modifiez des fichiers PDF sans les envoyer nulle part." },
    image: { name: "Image", desc: "Compressez, redimensionnez, recadrez et convertissez des images directement dans votre navigateur." },
    text: { name: "Texte", desc: "Comptez, nettoyez, triez et transformez du texte instantanément, pendant la saisie." },
    developer: { name: "Développement", desc: "Formateurs, encodeurs, décodeurs et générateurs pour le quotidien du développeur." },
    seo: { name: "SEO", desc: "Balises meta, données structurées, aperçu SERP et autres assistants de référencement." },
    security: { name: "Sécurité", desc: "Mots de passe, empreintes et vérifications — générés et contrôlés sur votre appareil." },
    utility: { name: "Utilitaires", desc: "Dés, pièces, loterie et anniversaires — la probabilité avec sa formule affichée." },
  },

  tool: {
    howTo: "Mode d'emploi",
    faq: "Questions fréquentes",
    related: "Outils associés",
    privacyNote:
      "Cet outil s'exécute entièrement dans votre navigateur. Vos données ne quittent jamais votre appareil — elles ne sont envoyées à aucun serveur.",
    inCategory: "Plus d'outils dans {category}",
    backToCategory: "Tous les outils {category}",
  },

  common: {
    copy: "Copier",
    copied: "Copié",
    download: "Télécharger",
    reset: "Réinitialiser",
    swap: "Inverser",
    clear: "Effacer",
    error: "Une erreur est survenue. Vérifiez votre saisie et réessayez.",
    input: "Entrée",
    output: "Résultat",
    settings: "Options",
    dropFiles: "Déposez des fichiers ici ou cliquez pour choisir",
    dropFile: "Déposez un fichier ici ou cliquez pour choisir",
    processing: "Traitement…",
    fileSize: "Taille",
    sample: "Essayer un exemple",
    uppercase: "MAJUSCULES",
  },

  unit: {
    from: "De",
    to: "Vers",
    amount: "Quantité",
    result: "Résultat",
    common: "Conversions courantes",
    formula: "Formule",
    allUnits: "Toutes les unités",
  },

  text: {
    stats: {
      words: "Mots",
      characters: "Caractères",
      charsNoSpaces: "Sans espaces",
      sentences: "Phrases",
      paragraphs: "Paragraphes",
      lines: "Lignes",
      readingTime: "Temps de lecture",
      readingMinutes: "{n} min de lecture",
    },
  },

  footer: {
    line: "Calculatrices de probabilité exactes. Tout tourne dans votre navigateur.",
    privacy: "Confidentialité",
    terms: "Conditions",
    about: "À propos",
    badges: "Badges",
    language: "Langue",
  },

  badge: {
    title: "Badges Oddscalc",
    desc: "Affichez un badge Oddscalc sur votre site, votre README ou votre documentation. Il renvoie ici et signale que les probabilités sont calculées exactement, dans le navigateur.",
    voluntary: "L'intégration est entièrement volontaire — prenez un badge si le projet vous plaît. Aucune autorisation nécessaire.",
    md: "Markdown (README)",
    html: "HTML (site web)",
    thanks: "Merci de faire passer le mot — chaque intégration aide plus de personnes à découvrir des outils qui respectent leurs fichiers.",
  },

  embed: {
    title: "Intégrer cet outil",
    desc: "Ajoutez cet outil à votre site en une ligne — il s'exécute dans le navigateur du visiteur.",
  },

    mcp: {
    title: "Serveur MCP — outils accessibles aux IA",
    desc1: "Oddscalc embarque un serveur MCP (Model Context Protocol) : les assistants IA comme Claude ou Cursor peuvent exécuter les mêmes calculatrices de probabilité que ce site — même logique testée, aucune réimplémentation.",
    desc2: "Les outils exécutent les fonctions pures du site : distributions de dés, statistiques binomiales de pièce, cotes hypergéométriques de loterie et produit des anniversaires. L'exécution a lieu sur la machine du client IA via npx — rien n'est envoyé à nos serveurs.",
    toolsTitle: "Outils exécutables ({n})",
    requiresNode: "Nécessite Node.js 18+. Le serveur tourne localement en stdio ; seuls les appels que vous lancez sont calculés sur votre machine.",
    privacy: "Nécessite Node.js 18+. Le serveur tourne localement en stdio ; seuls les appels que vous lancez sont calculés sur votre machine.",
  },

    notFound: {
    title: "Page introuvable",
    body: "L'outil que vous cherchez n'existe pas. Parcourez plutôt tous les outils.",
    home: "Retour à l'accueil",
  },
};

export default fr;
