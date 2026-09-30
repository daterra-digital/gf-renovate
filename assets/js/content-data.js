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
    esasWebsite: "http://www.esa.ipsantarem.pt",
    sideNote: {
      title: "EuroTech Day",
      description: "Esta sessão integra a iniciativa temática de disseminação colaborativa EuroTech Day, ligando a inovação tecnológica agrária à formação especializada.",
      link: "https://daterra.com.pt"
    }
  },

  // Parceiros do Consórcio RENOVATE & Ligações Oficiais
  partners: [
    {
      name: "Universitat Politècnica de Catalunya (UPC)",
      role: "Coordenação do Projeto (Espanha)",
      url: "https://www.upc.edu"
    },
    {
      name: "DATERRA - Lógica de Terra",
      role: "Organização & Consultoria Agrária (Portugal)",
      url: "https://daterra.com.pt"
    },
    {
      name: "Tallentto",
      role: "Desenvolvimento de Serious Games & Gamificação (Espanha)",
      url: "https://tallentto.com"
    },
    {
      name: "Virmedex",
      role: "Simulações Virtuais & Realidade Interativa (Espanha)",
      url: "https://virmedex.com"
    },
    {
      name: "ESAS - Santarém",
      role: "Escola Superior Agrária de Santarém - Universidade Politécnica de Santarém",
      url: "http://www.esa.ipsantarem.pt"
    },
    {
      name: "Università degli Studi di Torino (UNITO)",
      role: "Investigação Agronómica & Tecnológica (Itália)",
      url: "https://www.unito.it"
    },
    {
      name: "INRAE",
      role: "Institut National de Recherche pour l'Agriculture (França)",
      url: "https://www.inrae.fr"
    },
    {
      name: "pcfruit",
      role: "Investigação Aplicada em Fruticultura (Bélgica)",
      url: "https://www.pcfruit.be"
    },
    {
      name: "Horta s.r.l.",
      role: "Sistemas de Suporte à Decisão (Itália)",
      url: "https://www.horta-srl.it"
    }
  ],

  // Links Externos e Formulários da Sessão ao Vivo
  externalLinks: {
    seriousGameTallentto: "https://tallentto.com", // Substituível pelo link direto da instância do jogo
    simulatorVirmedex: "https://virmedex.com",     // Substituível pelo link direto do simulador
    // Modelos de Google Forms com campo configurável para prefill do código de participante
    googleFormPreSession: "https://docs.google.com/forms/d/e/1FAIpQLSc-PLACEHOLDER-FORM1/viewform",
    googleFormGameTallentto: "https://docs.google.com/forms/d/e/1FAIpQLSc-PLACEHOLDER-FORM2/viewform",
    googleFormSimVirmedex: "https://docs.google.com/forms/d/e/1FAIpQLSc-PLACEHOLDER-FORM3/viewform",
    googleSlidesUrl: "https://docs.google.com/presentation/d/e/2PACX-1vT-PLACEHOLDER/embed?start=false&loop=false&delayms=3000",
    gf1DaterraArticle: "https://daterra.com.pt"
  },

  // Programa Oficial da 2ª Sessão do Grupo Focal
  schedule: [
    {
      time: "09:00 - 09:30",
      title: "Boas-Vindas & Registo de Participantes",
      speaker: "Equipa DATERRA & Direção ESAS",
      description: "Receção, verificação de credenciais e configuração do Código de Participante na aplicação.",
      icon: "user-check",
      badge: "Credenciação"
    },
    {
      time: "09:30 - 10:00",
      title: "Abertura Oficial & Apresentação do Projeto RENOVATE",
      speaker: "DATERRA & Parceiros do Consórcio",
      description: "Contextualização dos objetivos europeus, apresentação das metas de sustentabilidade e resumo das aprendizagens do GF1 Lisboa.",
      icon: "presentation",
      badge: "Plenário"
    },
    {
      time: "10:00 - 10:15",
      title: "Inquérito Inicial (Baseline)",
      speaker: "Dinâmica Individual",
      description: "Preenchimento do Questionário 1 (diagnóstico de práticas e perceção de ferramentas digitais).",
      icon: "clipboard-list",
      badge: "Formulário 1"
    },
    {
      time: "10:15 - 11:15",
      title: "Workstation 1: Serious Game (Tallentto)",
      speaker: "Facilitação Tallentto & DATERRA",
      description: "Sessão prática imersiva de formação interativa através de gamificação focada em boas práticas de proteção fitossanitária.",
      icon: "gamepad-2",
      badge: "Hands-on"
    },
    {
      time: "11:15 - 11:45",
      title: "Pausa para Café & Networking Técnico",
      speaker: "Área de Convívio ESAS",
      description: "Momento de partilha informal e troca de experiências entre técnicos, formadores e agricultores.",
      icon: "coffee",
      badge: "Pausa"
    },
    {
      time: "11:45 - 12:45",
      title: "Workstation 2: Simulador Virtual (Virmedex)",
      speaker: "Facilitação Virmedex & DATERRA",
      description: "Teste do ambiente simulado de tomada de decisão para redução de impacto ambiental e otimização de dosagens.",
      icon: "laptop",
      badge: "Hands-on"
    },
    {
      time: "12:45 - 13:15",
      title: "Mesa Redonda: Validação de Usabilidade & Barreiras de Adoção",
      speaker: "Moderação DATERRA",
      description: "Discussão plenária aberta sobre adequação pedagógica, viabilidade de campo e necessidades de ajuste.",
      icon: "users",
      badge: "Debate"
    },
    {
      time: "13:15 - 13:30",
      title: "Avaliação Final, Agradecimentos & Próximos Passos",
      speaker: "DATERRA & ESAS",
      description: "Preenchimento do inquérito de avaliação global e partilha dos canais de acompanhamento dos resultados.",
      icon: "check-circle",
      badge: "Encerramento"
    }
  ],

  // Grupo Focal 1 (Lisboa, 22 de outubro de 2024)
  gf1: {
    date: "22 de outubro de 2024",
    location: "Lisboa, Portugal",
    title: "1ª Sessão do Grupo Focal RENOVATE - Diagnóstico de Necessidades",
    summary: "O primeiro Grupo Focal reuniu peritos agrários, formadores e consultores agrícolas para mapear as principais lacunas na formação sobre proteção de culturas sustentável e identificar as barreiras tecnológicas no setor primário português.",
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
        youtubeId: "dQw4w9WgXcQ", // ID demonstrativo substituível
        description: "Apresentação da estratégia europeia para formação avançada e digitalização agrícola."
      },
      {
        id: "video-2",
        title: "Demonstração do Serious Game (Tallentto)",
        youtubeId: "dQw4w9WgXcQ", // ID demonstrativo substituível
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
  }
};
