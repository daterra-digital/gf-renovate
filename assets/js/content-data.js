/**
 * RENOVATE - 2ª Sessão do Grupo Focal
 * Dados e Configurações de Conteúdo
 * Data do Evento: 06 de outubro de 2026 | Local: ESAS - Santarém
 */

const RENOVATE_CONFIG = {
  project: {
    title: "RENOVATE - Grupo Focal 2",
    subtitle: "Inovação e Digitalização na Proteção Sustentável das Culturas",
    date: "06 de outubro de 2026",
    venue: "Escola Superior Agrária de Santarém - Universidade Politécnica de Santarém",
    venueShort: "ESAS - Santarém",
    host: "DATERRA - Lógica de Terra, Lda.",
    website: "https://renovateproject.eu",
    daterraWebsite: "https://daterra.com.pt",
    esasWebsite: "https://www.ipsantarem.pt/escola-superior-agraria-de-santarem/",
    sideNote: {
      title: "EuroTech Day",
      description: "Esta sessão integra a iniciativa temática de disseminação colaborativa EuroTech Day, ligando a inovação tecnológica agrária à formação especializada.",
      link: "https://eurotech.daterra.com.pt/pt/euro-tech-day_pt/"
    }
  },

  // Parceiro Anfitrião em Destaque
  hostPartner: {
    name: "Escola Superior Agrária de Santarém - Universidade Politécnica de Santarém",
    shortName: "ESAS - Santarém",
    country: "Portugal",
    role: "Entidade Anfitriã da 2ª Sessão do Grupo Focal",
    logo: "assets/images/logos/esas.png",
    url: "https://www.ipsantarem.pt/escola-superior-agraria-de-santarem/"
  },

  // Estatísticas do Consórcio (conforme infografia oficial)
  consortiumStats: {
    partnersCount: 16,
    countriesCount: 8
  },

  // Os 16 Parceiros Oficiais do Consórcio RENOVATE (8 Países)
  partners: [
    {
      name: "Universitat Politècnica de Catalunya (UPC)",
      shortName: "UPC",
      country: "Spain",
      countryPt: "Espanha",
      logo: "assets/images/logos/upc.png",
      url: "https://uma.deab.upc.edu/en",
      role: "Coordenação Geral"
    },
    {
      name: "Università di Torino",
      shortName: "UNITO",
      country: "Italy",
      countryPt: "Itália",
      logo: "assets/images/logos/unito.png",
      url: "https://www.unito.it",
      role: "Investigação Agronómica"
    },
    {
      name: "INRAE",
      shortName: "INRAE",
      country: "France",
      countryPt: "França",
      logo: "assets/images/logos/inrae.png",
      url: "https://www.inrae.fr",
      role: "Investigação & Inovação"
    },
    {
      name: "da TERRA - Lógica de Terra",
      shortName: "da TERRA",
      country: "Portugal",
      countryPt: "Portugal",
      logo: "assets/images/logos/daterra.png",
      url: "https://daterra.com.pt",
      role: "Consultoria Agrária & Organização"
    },
    {
      name: "pcfruit",
      shortName: "pcfruit",
      country: "Belgium",
      countryPt: "Bélgica",
      logo: "assets/images/logos/pcfruit.png",
      url: "https://www.pcfruit.be",
      role: "Investigação em Fruticultura"
    },
    {
      name: "InHort - Instytut Ogrodnictwa",
      shortName: "InHort",
      country: "Poland",
      countryPt: "Polónia",
      logo: "assets/images/logos/inhort.png",
      url: "https://www.inhort.pl",
      role: "Investigação Hortícola"
    },
    {
      name: "Department of Agriculture",
      shortName: "Dept. Agriculture Cyprus",
      country: "Cyprus",
      countryPt: "Chipre",
      logo: "assets/images/logos/dep-agri-cyprus.png",
      url: "http://www.moa.gov.cy/da",
      role: "Entidade Governamental"
    },
    {
      name: "Laore Sardegna",
      shortName: "Laore",
      country: "Italy",
      countryPt: "Itália",
      logo: "assets/images/logos/laore.png",
      url: "https://www.sardegnaagricoltura.it/",
      role: "Desenvolvimento Agrário"
    },
    {
      name: "Česká společnost rostlinolékařská (ČSR)",
      shortName: "ČSR",
      country: "Czech Republic",
      countryPt: "República Checa",
      logo: "assets/images/logos/csr.png",
      url: "https://www.rostlinolekari.cz",
      role: "Proteção Fitossanitária"
    },
    {
      name: "PEK - Panagrotikos Farmers Union",
      shortName: "Π.Ε.Κ.",
      country: "Cyprus",
      countryPt: "Chipre",
      logo: "assets/images/logos/pek.png",
      url: "https://www.facebook.com/people/%CE%A0%CE%B1%CE%BD%CE%B1%CE%B3%CF%81%CE%BF%CF%84%CE%B9%CE%BA%CE%AE-%CE%88%CE%BD%CF%89%CF%83%CE%B7-%CE%9A%CF%8D%CF%80%CF%81%CE%BF%CF%85-%CE%A0%CE%95%CE%9A-Pancyprian-Farmers-Union/100064453069332/",
      role: "Associação de Agricultores"
    },
    {
      name: "Cooperatives Agro-alimentàries Comunitat Valenciana",
      shortName: "Coop. Valenciana",
      country: "Spain",
      countryPt: "Espanha",
      logo: "assets/images/logos/coop-valenciana.png",
      url: "https://cooperativesagroalimentariescv.com/",
      role: "Cooperativismo Agrário"
    },
    {
      name: "HORT@",
      shortName: "HORT@",
      country: "Italy",
      countryPt: "Itália",
      logo: "assets/images/logos/horta.png",
      url: "https://www.horta-srl.it",
      role: "Sistemas de Suporte à Decisão"
    },
    {
      name: "tallentto",
      shortName: "Tallentto",
      country: "Spain",
      countryPt: "Espanha",
      logo: "assets/images/logos/tallentto.png",
      url: "https://tallentto.com",
      role: "Serious Games & Gamificação"
    },
    {
      name: "ARTICAi",
      shortName: "ARTICAi",
      country: "Spain",
      countryPt: "Espanha",
      logo: "assets/images/logos/artica.png",
      url: "https://www.articai.es/",
      role: "Engenharia & Inovação"
    },
    {
      name: "virmedex Virtual Experiences",
      shortName: "Virmedex",
      country: "Spain",
      countryPt: "Espanha",
      logo: "assets/images/logos/virmedex.png",
      url: "https://virmedex.com",
      role: "Simulação Virtual 3D"
    },
    {
      name: "Consiglio Nazionale delle Ricerche - STEMS",
      shortName: "CNR-STEMS",
      country: "Italy",
      countryPt: "Itália",
      logo: "assets/images/logos/cnr-stems.png",
      url: "https://www.stems.cnr.it",
      role: "Investigação Científica"
    }
  ],

  // Links Externos e Formulários da Sessão ao Vivo
  // Links Externos e Formulários da Sessão ao Vivo
  externalLinks: {
    seriousGameTallentto: "https://www.cordalgpt.ai/renovate/pruebas.php?pilot=calibration-pilot&lang=pt",
    simulatorVirmedex: "https://simulator.renovateproject.eu/auth/login",
    googleFormPreSession: "https://docs.google.com/forms/d/e/1FAIpQLScAwHNGoYqikgsHwTOgKWC80l0F9b3S-kgXEbyCjxxjv_fTUQ/viewform",
    googleFormGameTallentto: "https://docs.google.com/forms/d/e/1FAIpQLScAwHNGoYqikgsHwTOgKWC80l0F9b3S-kgXEbyCjxxjv_fTUQ/viewform",
    googleFormSimVirmedex: "https://docs.google.com/forms/d/e/1FAIpQLSeyF3Ty9bzdw1oexKLsX2dC3StkoeUW7AyeFBPDVY6sU6OPmQ/viewform",
    googleFormGlobal: "https://docs.google.com/forms/d/e/1FAIpQLSc1tR_sfcQMqXjd26UGfwyjLInt1fJw2IMM2ERXJAyjfdT1LA/viewform",
    googleSlidesUrl: "https://docs.google.com/presentation/d/e/2PACX-1vRHnC6-5ki_78jMjLvzzpQA-8jX_uso_NRWE63z0xf5Lf2bXjU51iaXKthzZTdWjhk9iPA9WxsiivGU/embed?start=false&loop=false",
    googleSlidesFullscreen: "https://docs.google.com/presentation/d/e/2PACX-1vRHnC6-5ki_78jMjLvzzpQA-8jX_uso_NRWE63z0xf5Lf2bXjU51iaXKthzZTdWjhk9iPA9WxsiivGU/pub?start=false&loop=false",
    gf1DaterraArticle: "https://daterra.com.pt"
  },

  // Programa Oficial da 2ª Sessão do Grupo Focal (11 Etapas com Accordion e Embeds)
  schedule: [
    {
      id: "slot-1",
      step: 1,
      time: "10:00 - 10:10",
      title: "Sessão de Abertura",
      speaker: "Diretor da ESAS (Universidade Politécnica de Santarém) & DATERRA",
      badge: "Boas-Vindas",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      icon: "landmark",
      description: "Intervenção de boas-vindas pelo Diretor da Escola Superior Agrária (ESAS - Universidade Politécnica de Santarém), acolhimento institucional dos participantes e enquadramento dos trabalhos.",
      type: "opening"
    },
    {
      id: "slot-2",
      step: 2,
      time: "10:10 - 10:20",
      title: '"Disseram, e nós fizemos"',
      speaker: "DATERRA & Consórcio RENOVATE",
      badge: "Apresentação Oficial",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      icon: "presentation",
      description: "Breve recapitulação dos resultados do GF1. Apresentação mostrando como o feedback dos participantes foi integrado no desenvolvimento das ferramentas digitais e pedagógicas.",
      type: "slides"
    },
    {
      id: "slot-3",
      step: 3,
      time: "10:20 - 11:35",
      title: "Teste Prático 1: Serious Game",
      speaker: "Facilitação Tallentto & DATERRA",
      badge: "Smartphone / Tablet",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
      icon: "gamepad-2",
      url: "https://www.cordalgpt.ai/renovate/pruebas.php?pilot=calibration-pilot&lang=pt",
      description: "Teste prático individual do Serious Game. Dinâmica lúdica interativa focada em calibração, diagnóstico e boas práticas de proteção fitossanitária.",
      type: "game"
    },
    {
      id: "slot-4",
      step: 3,
      time: "11:35 - 11:45",
      title: "Avaliação 1: Serious Game",
      speaker: "Participantes & Equipa de Investigação",
      badge: "Formulário Online",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
      icon: "clipboard-list",
      description: "Preenchimento de um questionário sobre a experiência com o Serious Game. Avaliação de usabilidade, aplicabilidade pedagógica e clareza instrucional.",
      type: "form-game"
    },
    {
      id: "slot-5",
      step: null,
      time: "11:45 - 12:00",
      title: "Pausa curta (coffee break)",
      speaker: "Espaço de Convívio ESAS",
      badge: "Coffee Break",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
      icon: "coffee",
      description: "Pausa para café, descanso e networking informal entre os participantes, técnicos agrários e a equipa do consórcio.",
      type: "break"
    },
    {
      id: "slot-6",
      step: 4,
      time: "12:00 - 13:10",
      title: "Teste Prático 2: Simulador",
      speaker: "Facilitação Virmedex & DATERRA",
      badge: "Computador PC / Portátil",
      badgeColor: "bg-sky-100 text-sky-800 border-sky-300",
      icon: "monitor",
      url: "https://simulator.renovateproject.eu/auth/login",
      description: "Teste prático individual do Simulador do RENOVATE no PC. Ambiente 3D interativo para otimização de parâmetros de pulverização, mitigação de deriva e análise de eficácia de campo.",
      type: "simulator"
    },
    {
      id: "slot-7",
      step: 4,
      time: "13:10 - 13:20",
      title: "Avaliação 2: Simulador",
      speaker: "Participantes & Equipa de Investigação",
      badge: "Formulário Online",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
      icon: "clipboard-list",
      description: "Preenchimento de um questionário sobre o teste prático com o Simulador. Recolha de opiniões sobre fidelidade agronómica, interface e potencial de integração no terreno.",
      type: "form-simulator"
    },
    {
      id: "slot-8",
      step: null,
      time: "13:20 - 14:40",
      title: "Almoço (oferecido pela organização)",
      speaker: "Organização RENOVATE / DATERRA & ESAS",
      badge: "Almoço & Convívio",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      icon: "utensils",
      description: "Pausa alargada para networking e discussão informal sobre a experiência da manhã. Almoço volante oferecido pelo projeto a todos os participantes convidados.",
      type: "lunch"
    },
    {
      id: "slot-9",
      step: 5,
      time: "14:40 - 14:50",
      title: "Avaliação Global",
      speaker: "Participantes & DATERRA",
      badge: "Formulário Final",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      icon: "check-circle-2",
      description: "Preenchimento de um questionário sobre a perceção geral da plataforma RENOVATE, impacto conjunto das ferramentas e recomendações para formação profissional agrícola.",
      type: "form-global"
    },
    {
      id: "slot-10",
      step: 5,
      time: "14:50 - 15:40",
      title: "Discussão Plenária",
      speaker: "Moderação DATERRA & Painel de Peritos",
      badge: "Debate Plenário",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-300",
      icon: "messages-square",
      description: "Debate aberto projetando os resultados dos questionários. Foco no que funcionou, o que falhou e possíveis melhorias para a transição digital na agricultura.",
      type: "discussion"
    },
    {
      id: "slot-11",
      step: 5,
      time: "15:40 - 15:50",
      title: "Sessão de Encerramento",
      speaker: "Direção ESAS & DATERRA",
      badge: "Conclusão",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      icon: "flag",
      description: "Próximos passos e conclusão da sessão. Agradecimentos institucionais, partilha das vias de acesso aos relatórios do projeto e encerramento oficial dos trabalhos.",
      type: "closing"
    }
  ],

  // Grupo Focal 1 (Lisboa, 22 de outubro de 2024)
  gf1: {
    date: "22 de outubro de 2024",
    location: "Lisboa, Portugal",
    title: "1ª Sessão do Grupo Focal RENOVATE - Diagnóstico de Necessidades",
    summary: "O primeiro Grupo Focal reuniu peritos agrários, formadores e consultores agrícolas para mapear as principais lacunas na formação sobre proteção de culturas sustentável e identificar as barreiras tecnológicas no setor primário português.",
    video: {
      url: "https://youtu.be/1_jQYkNluhY?si=BJvw2ftMW5WyCqki",
      embedUrl: "https://www.youtube-nocookie.com/embed/1_jQYkNluhY",
      title: "Vídeo Oficial: 1ª Sessão do Grupo Focal RENOVATE (Lisboa)",
      description: "Reportagem em vídeo da sessão realizada em Lisboa, reunindo testemunhos de formadores, agricultores e especialistas do consórcio."
    },
    newsArticle: {
      title: "Grupo Focal RENOVATE: Primeira Sessão em Lisboa Reúne Agricultores e Especialistas",
      source: "Página de Notícias da DATERRA",
      url: "https://daterra.com.pt/grupo-focal-renovate-primeira-sessao-em-lisboa-reune-agricultores-e-especialistas/",
      description: "Cobertura completa dos debates, perfil dos participantes e diagnóstico de competências recolhido na primeira sessão."
    },
    resultsDocument: {
      title: "Conclusões do 1º Grupo Focal RENOVATE",
      format: "Documento Oficial (PDF)",
      url: "https://daterra.com.pt/wp-content/uploads/2025/03/10_ConclusoesGrupoFocalRENOVATE_pt.pdf",
      description: "Relatório executivo contendo a análise sistematizada dos inquéritos aos especialistas e as diretrizes pedagógicas prioritárias."
    },
    metrics: [
      { label: "Participantes Especialistas", value: "24" },
      { label: "Organizações Representadas", value: "15" },
      { label: "Necessidades Mapeadas", value: "38" },
      { label: "Índice de Interesse em Ferramentas Digitais", value: "92%" }
    ],
    highlights: [
      "Priorização da simplicidade de interface em ferramentas para operadores no terreno.",
      "Identificação do elevado potencial dos Serious Games para formação contínua certificada.",
      "Necessidade de ligação direta entre simulações e cálculos de custos/poupança real.",
      "Consenso sobre a relevância de criar recursos acessíveis em dispositivos móveis."
    ],
    gallery: [
      {
        filename: "gf1-foto-1.jpg",
        src: "assets/images/gf1/gf1-foto-1.jpg",
        alt: "Abertura e Enquadramento - GF1 Lisboa",
        title: "Abertura & Apresentação",
        caption: "Auditório com peritos agrários e investigadores no Grupo Focal 1 em Lisboa."
      },
      {
        filename: "gf1-foto-2.jpg",
        src: "assets/images/gf1/gf1-foto-2.jpg",
        alt: "Debate Participativo - GF1 Lisboa",
        title: "Mesa Redonda & Debate",
        caption: "Discussão participativa sobre barreiras na adoção de tecnologias agrícolas sustentáveis."
      },
      {
        filename: "gf1-foto-3.jpg",
        src: "assets/images/gf1/gf1-foto-3.jpg",
        alt: "Dinâmica de Co-Criação - GF1 Lisboa",
        title: "Dinâmica de Co-Criação",
        caption: "Mapeamento das necessidades de formação contínua em proteção fitossanitária."
      },
      {
        filename: "gf1-foto-4.jpg",
        src: "assets/images/gf1/gf1-foto-4.jpg",
        alt: "Síntese dos Trabalhos - GF1 Lisboa",
        title: "Síntese dos Resultados",
        caption: "Registo e consolidação das diretrizes que alimentaram as ferramentas digitais."
      }
    ]
  },

  // Resultados & Media
  resultsMedia: {
    deliverable: {
      code: "Deliverable 1.4",
      title: "Relatório de Requisitos e Validação de Ferramentas Digitais para Formação em Proteção de Culturas",
      status: "Documento Técnico Consolidado",
      abstract: "Este entregável sintetiza a metodologia de validação de ferramentas pedagógicas digitais (Serious Games e Simuladores 3D), incorporando o feedback direto recolhido nos grupos focais de Portugal, Espanha, França e Itália. O relatório fundamenta as diretrizes de design instrucional adotadas pelo consórcio.",
      highlights: [
        "Matriz comparativa de eficácia pedagógica entre métodos expositivos e gamificados.",
        "Critérios de acessibilidade e adaptação à literacia digital dos operadores agrários.",
        "Recomendações técnicas para a integração de telemetria nos simuladores."
      ]
    },
    videos: [
      {
        id: "video-1",
        title: "Visão Geral do Projeto RENOVATE",
        youtubeId: "dQw4w9WgXcQ",
        description: "Apresentação da estratégia europeia para formação avançada e digitalização agrícola."
      },
      {
        id: "video-2",
        title: "Demonstração do Serious Game (Tallentto)",
        youtubeId: "dQw4w9WgXcQ",
        description: "Vislumbre da dinâmica de jogo aplicada à calibração e segurança no campo."
      }
    ],
    gallery: [
      {
        title: "Grupo Focal 1 - Lisboa",
        caption: "Discussão plenária com técnicos e consultores agrícolas.",
        tag: "GF1 Lisboa",
        placeholderColor: "from-amber-200 to-amber-400"
      },
      {
        title: "Dinâmica de Co-Criação",
        caption: "Mapeamento de desafios na adoção de tecnologias de pulverização.",
        tag: "Metodologia",
        placeholderColor: "from-slate-200 to-slate-400"
      },
      {
        title: "Auditório da ESAS - Santarém",
        caption: "Local anfitrião da 2ª Sessão do Grupo Focal RENOVATE.",
        tag: "ESAS 2026",
        placeholderColor: "from-amber-100 to-amber-300"
      },
      {
        title: "Testes de Usabilidade",
        caption: "Validação da interação homem-máquina em ambiente simulado.",
        tag: "Simulação",
        placeholderColor: "from-blue-200 to-blue-400"
      }
    ]
  },

  // Configuração do Dashboard de Resultados (Google Sheets com Múltiplos Separadores)
  resultsDashboard: {
    // ID da Folha de Cálculo Google Sheets partilhada (ex: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms)
    spreadsheetId: "", 
    // GID de cada separador (extraído da URL: #gid=...)
    tabGids: {
      game: "0",        // Separador 1: Serious Game (Tallentto) + Dados Demográficos
      sim: "",          // Separador 2: Simulador RENOVATE (Virmedex)
      global: ""        // Separador 3: Avaliação Global (NPS + Síntese)
    },
    autoRefreshSeconds: 45,

    // Conjunto de dados de demonstração representativo de 18 peritos agrícolas na ESAS
    // Exibido automaticamente antes de serem inseridos os IDs ou quando a folha tem 0 respostas
    demoData: {
      isDemo: true,
      participantCount: 18,
      lastUpdated: "Hoje, 15:30",
      gameResponses: [
        { code: "P01", profile: "Técnico / Consultor Agrícola", age: "30-45 anos", gender: "Masculino", crops: ["Vinhedo", "Olivicultura"], digitalComfort: 4, q7: 5, q8: 4, q9: 5, q10: 5, q11: 4, q12: 5, sus: [4, 2, 5, 1, 4, 2, 5, 1, 4, 2], words: "Prático, Intuitivo, Rápido" },
        { code: "P02", profile: "Engenheiro Agrónomo", age: "30-45 anos", gender: "Feminino", crops: ["Fruticultura / Pomóideas", "Hortícolas"], digitalComfort: 5, q7: 4, q8: 4, q9: 4, q10: 5, q11: 5, q12: 4, sus: [5, 1, 4, 2, 5, 1, 4, 1, 5, 2], words: "Inovador, Educativo, Dinâmico" },
        { code: "P03", profile: "Produtor Agrícola", age: "46-60 anos", gender: "Masculino", crops: ["Olivicultura", "Milho / Grandes Culturas"], digitalComfort: 3, q7: 4, q8: 3, q9: 5, q10: 4, q11: 4, q12: 4, sus: [4, 2, 4, 2, 4, 2, 4, 2, 4, 2], words: "Desafiante, Útil, Claro" },
        { code: "P04", profile: "Técnico / Consultor Agrícola", age: "30-45 anos", gender: "Masculino", crops: ["Vinhedo", "Fruticultura / Pomóideas"], digitalComfort: 4, q7: 5, q8: 4, q9: 4, q10: 5, q11: 5, q12: 5, sus: [4, 1, 5, 2, 5, 1, 5, 2, 4, 1], words: "Interessante, Visual, Prático" },
        { code: "P05", profile: "Investigador / Docente", age: "46-60 anos", gender: "Feminino", crops: ["Hortícolas", "Vinhedo"], digitalComfort: 5, q7: 5, q8: 4, q9: 5, q10: 5, q11: 4, q12: 5, sus: [5, 2, 5, 1, 4, 1, 5, 1, 5, 2], words: "Didático, Eficaz, Intuitivo" },
        { code: "P06", profile: "Engenheiro Agrónomo", age: "<30 anos", gender: "Masculino", crops: ["Milho / Grandes Culturas", "Arroz"], digitalComfort: 5, q7: 4, q8: 4, q9: 4, q10: 4, q11: 5, q12: 4, sus: [4, 2, 4, 2, 5, 1, 4, 2, 4, 2], words: "Rápido, Esclarecedor, Motivador" },
        { code: "P07", profile: "Produtor Agrícola", age: "46-60 anos", gender: "Masculino", crops: ["Olivicultura", "Vinhedo"], digitalComfort: 3, q7: 4, q8: 3, q9: 4, q10: 5, q11: 4, q12: 4, sus: [4, 2, 4, 3, 3, 2, 4, 2, 4, 2], words: "Estimulante, Realista, Prático" },
        { code: "P08", profile: "Técnico / Consultor Agrícola", age: "<30 anos", gender: "Feminino", crops: ["Fruticultura / Pomóideas", "Hortícolas"], digitalComfort: 4, q7: 5, q8: 4, q9: 5, q10: 5, q11: 5, q12: 5, sus: [5, 1, 5, 1, 4, 2, 5, 1, 5, 1], words: "Dinâmico, Acessível, Interativo" },
        { code: "P09", profile: "Engenheiro Agrónomo", age: "30-45 anos", gender: "Masculino", crops: ["Vinhedo", "Olivicultura"], digitalComfort: 4, q7: 4, q8: 4, q9: 4, q10: 4, q11: 4, q12: 4, sus: [4, 2, 4, 2, 4, 2, 4, 2, 4, 2], words: "Útil, Rigoroso, Envolvente" },
        { code: "P10", profile: "Técnico / Consultor Agrícola", age: "30-45 anos", gender: "Masculino", crops: ["Fruticultura / Pomóideas"], digitalComfort: 4, q7: 5, q8: 4, q9: 5, q10: 5, q11: 5, q12: 4, sus: [4, 1, 5, 2, 5, 1, 4, 2, 4, 1], words: "Moderno, Aplicável, Simples" },
        { code: "P11", profile: "Investigador / Docente", age: "30-45 anos", gender: "Feminino", crops: ["Olivicultura", "Fruticultura / Pomóideas"], digitalComfort: 4, q7: 5, q8: 5, q9: 5, q10: 5, q11: 4, q12: 5, sus: [5, 2, 5, 1, 4, 1, 5, 1, 5, 2], words: "Inovador, Pedagógico, Claro" },
        { code: "P12", profile: "Produtor Agrícola", age: ">60 anos", gender: "Masculino", crops: ["Vinhedo", "Milho / Grandes Culturas"], digitalComfort: 2, q7: 4, q8: 3, q9: 4, q10: 4, q11: 3, q12: 4, sus: [3, 3, 4, 3, 3, 2, 3, 2, 4, 3], words: "Prático, Formativo, Interessante" },
        { code: "P13", profile: "Engenheiro Agrónomo", age: "<30 anos", gender: "Feminino", crops: ["Hortícolas", "Fruticultura / Pomóideas"], digitalComfort: 5, q7: 5, q8: 4, q9: 4, q10: 5, q11: 5, q12: 5, sus: [5, 1, 5, 1, 5, 1, 5, 1, 4, 1], words: "Desafiante, Intuitivo, Essencial" },
        { code: "P14", profile: "Técnico / Consultor Agrícola", age: "30-45 anos", gender: "Masculino", crops: ["Vinhedo", "Olivicultura"], digitalComfort: 4, q7: 4, q8: 4, q9: 5, q10: 5, q11: 4, q12: 4, sus: [4, 2, 4, 1, 4, 2, 4, 1, 4, 2], words: "Rápido, Lúdico, Completo" },
        { code: "P15", profile: "Estudante / Futuro Técnico", age: "<30 anos", gender: "Masculino", crops: ["Hortícolas", "Grandes Culturas"], digitalComfort: 5, q7: 5, q8: 4, q9: 4, q10: 4, q11: 5, q12: 5, sus: [4, 1, 5, 1, 4, 2, 5, 1, 5, 1], words: "Esclarecedor, Eficiente, Positivo" },
        { code: "P16", profile: "Técnico / Consultor Agrícola", age: "46-60 anos", gender: "Masculino", crops: ["Olivicultura", "Fruticultura / Pomóideas"], digitalComfort: 3, q7: 4, q8: 4, q9: 4, q10: 4, q11: 4, q12: 4, sus: [4, 2, 4, 2, 4, 2, 4, 2, 4, 2], words: "Visual, Direto, Relevante" },
        { code: "P17", profile: "Engenheiro Agrónomo", age: "30-45 anos", gender: "Feminino", crops: ["Vinhedo", "Fruticultura / Pomóideas"], digitalComfort: 4, q7: 5, q8: 4, q9: 5, q10: 5, q11: 5, q12: 5, sus: [5, 1, 5, 1, 4, 1, 5, 2, 4, 1], words: "Muito prático, Educativo, Inovador" },
        { code: "P18", profile: "Técnico / Consultor Agrícola", age: "30-45 anos", gender: "Masculino", crops: ["Olivicultura", "Hortícolas"], digitalComfort: 4, q7: 4, q8: 4, q9: 4, q10: 5, q11: 4, q12: 4, sus: [4, 2, 4, 2, 4, 1, 4, 1, 4, 2], words: "Dinâmico, Fácil, Envolvente" }
      ],
      simulatorResponses: [
        { code: "P01", q15: 4, q16: 4, q17: 5, q18: 5, q19: 4, q20: 5, q21: 4, q22: 5, q23: 5, sus: [5, 2, 5, 1, 4, 1, 4, 2, 5, 2], q25: "Excelente realismo nos parâmetros ambientais.", words: "Imersivo, Realista, Preciso" },
        { code: "P02", q15: 5, q16: 5, q17: 5, q18: 5, q19: 4, q20: 5, q21: 5, q22: 4, q23: 5, sus: [5, 1, 5, 1, 5, 1, 5, 1, 4, 1], q25: "Adicionar mais variedade de bicos antideriva.", words: "Inovador, Formativo, Detalhado" },
        { code: "P03", q15: 3, q16: 4, q17: 4, q18: 5, q19: 3, q20: 4, q21: 4, q22: 4, q23: 4, sus: [4, 2, 4, 3, 4, 2, 4, 2, 4, 2], q25: "Ajustar sensibilidade do rato ao rodar a máquina.", words: "Interativo, Técnico, Exigente" },
        { code: "P04", q15: 4, q16: 4, q17: 5, q18: 5, q19: 4, q20: 5, q21: 4, q22: 5, q23: 5, sus: [4, 2, 5, 1, 5, 1, 4, 2, 4, 1], q25: "A sequência de calibração está impecável.", words: "Prático, Visual, Completo" },
        { code: "P05", q15: 4, q16: 5, q17: 5, q18: 5, q19: 5, q20: 5, q21: 5, q22: 5, q23: 5, sus: [5, 1, 5, 1, 4, 1, 5, 1, 5, 1], q25: "Fantástica correspondência aos procedimentos de laboratório.", words: "Realista, Abrangente, Rigoroso" },
        { code: "P06", q15: 5, q16: 4, q17: 4, q18: 4, q19: 4, q20: 4, q21: 4, q22: 4, q23: 4, sus: [4, 2, 4, 2, 4, 1, 5, 1, 4, 2], q25: "Fluidez gráfica muito boa em PC.", words: "Imersivo, Excelente, Intuitivo" },
        { code: "P07", q15: 3, q16: 4, q17: 4, q18: 4, q19: 3, q20: 4, q21: 4, q22: 4, q23: 4, sus: [4, 3, 3, 3, 4, 2, 3, 2, 4, 2], q25: "Mais ajudas visuais para quem tem menos prática com computadores.", words: "Muito realista, Detalhado, Útil" },
        { code: "P08", q15: 5, q16: 5, q17: 5, q18: 5, q19: 4, q20: 5, q21: 5, q22: 5, q23: 5, sus: [5, 1, 5, 1, 5, 1, 5, 1, 5, 1], q25: "Passo a passo muito claro.", words: "Formativo, Moderno, Completo" },
        { code: "P09", q15: 4, q16: 4, q17: 4, q18: 4, q19: 4, q20: 4, q21: 4, q22: 4, q23: 4, sus: [4, 2, 4, 2, 4, 2, 4, 2, 4, 2], q25: "Cálculos matemáticos bem explicados.", words: "Inovador, Preciso, Desafiante" },
        { code: "P10", q15: 4, q16: 4, q17: 5, q18: 5, q19: 4, q20: 4, q21: 4, q22: 5, q23: 4, sus: [4, 1, 4, 2, 4, 1, 4, 2, 4, 1], q25: "Gostei da leitura do rótulo.", words: "Interativo, Esclarecedor, Prático" },
        { code: "P11", q15: 4, q16: 5, q17: 5, q18: 5, q19: 5, q20: 5, q21: 5, q22: 5, q23: 5, sus: [5, 1, 5, 1, 5, 1, 5, 1, 5, 1], q25: "Potencial pedagógico altíssimo para aulas e formações.", words: "Realista, Eficaz, Imersivo" },
        { code: "P12", q15: 3, q16: 3, q17: 4, q18: 4, q19: 3, q20: 4, q21: 3, q22: 4, q23: 4, sus: [3, 3, 4, 3, 3, 2, 3, 2, 4, 3], q25: "Requer acompanhamento inicial mas depois torna-se lógico.", words: "Técnico, Visual, Aplicável" },
        { code: "P13", q15: 5, q16: 5, q17: 5, q18: 5, q19: 4, q20: 5, q21: 5, q22: 5, q23: 5, sus: [5, 1, 5, 1, 4, 1, 5, 1, 5, 1], q25: "Gráficos de alta qualidade.", words: "Completo, Rigoroso, Avançado" },
        { code: "P14", q15: 4, q16: 4, q17: 4, q18: 5, q19: 4, q20: 4, q21: 4, q22: 4, q23: 4, sus: [4, 2, 4, 2, 4, 1, 4, 1, 4, 2], q25: "Ajuda a fixar a fórmula de cálculo de débito.", words: "Excelente, Intuitivo, Real" },
        { code: "P15", q15: 5, q16: 4, q17: 4, q18: 4, q19: 4, q20: 4, q21: 4, q22: 4, q23: 5, sus: [5, 1, 4, 2, 4, 1, 4, 2, 4, 1], q25: "Ambiente muito apelativo.", words: "Imersivo, Prático, Relevante" },
        { code: "P16", q15: 4, q16: 4, q17: 4, q18: 4, q19: 4, q20: 4, q21: 4, q22: 4, q23: 4, sus: [4, 2, 4, 2, 4, 2, 4, 2, 4, 2], q25: "Muito representativo do pulverizador real.", words: "Formativo, Detalhado, Positivo" },
        { code: "P17", q15: 5, q16: 4, q17: 5, q18: 5, q19: 5, q20: 5, q21: 5, q22: 5, q23: 5, sus: [5, 1, 5, 1, 5, 1, 4, 1, 5, 1], q25: "Permite errar sem estragar produto nem gastar água.", words: "Inovador, Exigente, Completo" },
        { code: "P18", q15: 4, q16: 4, q17: 4, q18: 5, q19: 4, q20: 4, q21: 4, q22: 4, q23: 4, sus: [4, 2, 4, 2, 4, 1, 4, 2, 4, 1], q25: "Ótima ferramenta de treino para operadores.", words: "Realista, Interativo, Valioso" }
      ],
      globalResponses: [
        { code: "P01", q26: 5, q27: 4, q28: 5, nps: 10, q30: "Excelente iniciativa de ligar a tecnologia à prática de campo." },
        { code: "P02", q26: 5, q27: 5, q28: 5, nps: 10, q30: "A integração dos dois ambientes (jogo e simulador) é muito complementar." },
        { code: "P03", q26: 4, q27: 3, q28: 4, nps: 8, q30: "Mais tempo para explorar cada exercício nas sessões práticas." },
        { code: "P04", q26: 5, q27: 4, q28: 5, nps: 9, q30: "Disponibilizar versão para telemóvel do simulador seria excelente." },
        { code: "P05", q26: 5, q27: 5, q28: 5, nps: 10, q30: "Recomendo vivamente a integração em módulos curriculares agrários." },
        { code: "P06", q26: 4, q27: 4, q28: 4, nps: 9, q30: "Parabéns pela qualidade gráfica do simulador e dinamismo do jogo." },
        { code: "P07", q26: 4, q27: 4, q28: 4, nps: 8, q30: "Facilitar ainda mais os menus para agricultores mais velhos." },
        { code: "P08", q26: 5, q27: 5, q28: 5, nps: 10, q30: "Plataforma muito intuitiva e envolvente." },
        { code: "P09", q26: 4, q27: 4, q28: 4, nps: 8, q30: "Boa dinâmica de grupo e organização." },
        { code: "P10", q26: 5, q27: 4, q28: 5, nps: 9, q30: "A calibração do pulverizador fica muito mais fácil de memorizar." },
        { code: "P11", q26: 5, q27: 5, q28: 5, nps: 10, q30: "O consórcio RENOVATE está a fazer um trabalho fundamental para o setor." },
        { code: "P12", q26: 4, q27: 3, q28: 4, nps: 7, q30: "Manual de apoio em papel ou PDF impresso para levar para a exploração." },
        { code: "P13", q26: 5, q27: 5, q28: 5, nps: 10, q30: "Simulação realista e feedback imediato são os pontos fortes." },
        { code: "P14", q26: 4, q27: 4, q28: 4, nps: 9, q30: "Muito útil para formação de novos funcionários agrícolas." },
        { code: "P15", q26: 5, q27: 4, q28: 5, nps: 9, q30: "Didático, moderno e estimulante." },
        { code: "P16", q26: 4, q27: 4, q28: 4, nps: 8, q30: "Representa bem a realidade de quem calibra no terreno." },
        { code: "P17", q26: 5, q27: 5, q28: 5, nps: 10, q30: "Parabéns à DATERRA e à ESAS pelo excelente acolhimento e organização." },
        { code: "P18", q26: 4, q27: 4, q28: 4, nps: 9, q30: "Desejo sucesso na versão final do projeto RENOVATE." }
      ]
    }
  }
};

