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
    roleEn: "Host Entity of the 2nd Focus Group Session",
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
      role: "Coordenação Geral",
      roleEn: "General Coordination"
    },
    {
      name: "Università di Torino",
      shortName: "UNITO",
      country: "Italy",
      countryPt: "Itália",
      logo: "assets/images/logos/unito.png",
      url: "https://www.unito.it",
      role: "Investigação Agronómica",
      roleEn: "Agronomic Research"
    },
    {
      name: "INRAE",
      shortName: "INRAE",
      country: "France",
      countryPt: "França",
      logo: "assets/images/logos/inrae.png",
      url: "https://www.inrae.fr",
      role: "Investigação & Inovação",
      roleEn: "Research & Innovation"
    },
    {
      name: "da TERRA - Lógica de Terra",
      shortName: "da TERRA",
      country: "Portugal",
      countryPt: "Portugal",
      logo: "assets/images/logos/daterra.png",
      url: "https://daterra.com.pt",
      role: "Consultoria Agrária & Organização",
      roleEn: "Agricultural Consultancy & Organisation"
    },
    {
      name: "pcfruit",
      shortName: "pcfruit",
      country: "Belgium",
      countryPt: "Bélgica",
      logo: "assets/images/logos/pcfruit.png",
      url: "https://www.pcfruit.be",
      role: "Investigação em Fruticultura",
      roleEn: "Fruit Growing Research"
    },
    {
      name: "InHort - Instytut Ogrodnictwa",
      shortName: "InHort",
      country: "Poland",
      countryPt: "Polónia",
      logo: "assets/images/logos/inhort.png",
      url: "https://www.inhort.pl",
      role: "Investigação Hortícola",
      roleEn: "Horticultural Research"
    },
    {
      name: "Department of Agriculture",
      shortName: "Dept. Agriculture Cyprus",
      country: "Cyprus",
      countryPt: "Chipre",
      logo: "assets/images/logos/dep-agri-cyprus.png",
      url: "http://www.moa.gov.cy/da",
      role: "Entidade Governamental",
      roleEn: "Governmental Entity"
    },
    {
      name: "Laore Sardegna",
      shortName: "Laore",
      country: "Italy",
      countryPt: "Itália",
      logo: "assets/images/logos/laore.png",
      url: "https://www.sardegnaagricoltura.it/",
      role: "Desenvolvimento Agrário",
      roleEn: "Agricultural Development"
    },
    {
      name: "Česká společnost rostlinolékařská (ČSR)",
      shortName: "ČSR",
      country: "Czech Republic",
      countryPt: "República Checa",
      logo: "assets/images/logos/csr.png",
      url: "https://www.rostlinolekari.cz",
      role: "Proteção Fitossanitária",
      roleEn: "Plant Health Protection"
    },
    {
      name: "PEK - Panagrotikos Farmers Union",
      shortName: "Π.Ε.Κ.",
      country: "Cyprus",
      countryPt: "Chipre",
      logo: "assets/images/logos/pek.png",
      url: "https://www.facebook.com/people/%CE%A0%CE%B1%CE%BD%CE%B1%CE%B3%CF%81%CE%BF%CF%84%CE%B9%CE%BA%CE%AE-%CE%88%CE%BD%CF%89%CF%83%CE%B7-%CE%9A%CF%8D%CF%80%CF%81%CE%BF%CF%85-%CE%A0%CE%95%CE%9A-Pancyprian-Farmers-Union/100064453069332/",
      role: "Associação de Agricultores",
      roleEn: "Farmers' Union"
    },
    {
      name: "Cooperatives Agro-alimentàries Comunitat Valenciana",
      shortName: "Coop. Valenciana",
      country: "Spain",
      countryPt: "Espanha",
      logo: "assets/images/logos/coop-valenciana.png",
      url: "https://cooperativesagroalimentariescv.com/",
      role: "Cooperativismo Agrário",
      roleEn: "Agricultural Cooperativism"
    },
    {
      name: "HORT@",
      shortName: "HORT@",
      country: "Italy",
      countryPt: "Itália",
      logo: "assets/images/logos/horta.png",
      url: "https://www.horta-srl.it",
      role: "Sistemas de Suporte à Decisão",
      roleEn: "Decision Support Systems"
    },
    {
      name: "tallentto",
      shortName: "Tallentto",
      country: "Spain",
      countryPt: "Espanha",
      logo: "assets/images/logos/tallentto.png",
      url: "https://tallentto.com",
      role: "Serious Games & Gamificação",
      roleEn: "Serious Games & Gamification"
    },
    {
      name: "ARTICAi",
      shortName: "ARTICAi",
      country: "Spain",
      countryPt: "Espanha",
      logo: "assets/images/logos/artica.png",
      url: "https://www.articai.es/",
      role: "Engenharia & Inovação",
      roleEn: "Engineering & Innovation"
    },
    {
      name: "virmedex Virtual Experiences",
      shortName: "Virmedex",
      country: "Spain",
      countryPt: "Espanha",
      logo: "assets/images/logos/virmedex.png",
      url: "https://virmedex.com",
      role: "Simulação Virtual 3D",
      roleEn: "Virtual 3D Simulation"
    },
    {
      name: "Consiglio Nazionale delle Ricerche - STEMS",
      shortName: "CNR-STEMS",
      country: "Italy",
      countryPt: "Itália",
      logo: "assets/images/logos/cnr-stems.png",
      url: "https://www.stems.cnr.it",
      role: "Investigação Científica",
      roleEn: "Scientific Research"
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
      titleEn: "Opening Session",
      speaker: "Diretor da ESAS (Universidade Politécnica de Santarém) & DATERRA",
      speakerEn: "Director of ESAS (Polytechnic University of Santarém) & DATERRA",
      badge: "Boas-Vindas",
      badgeEn: "Welcome",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      icon: "landmark",
      description: "Intervenção de boas-vindas pelo Diretor da Escola Superior Agrária (ESAS - Universidade Politécnica de Santarém), acolhimento institucional dos participantes e enquadramento dos trabalhos.",
      descriptionEn: "Welcome address by the Director of the School of Agriculture (ESAS - Polytechnic University of Santarém), institutional greeting of participants, and framework of proceedings.",
      type: "opening"
    },
    {
      id: "slot-2",
      step: 2,
      time: "10:10 - 10:20",
      title: '"Disseram, e nós fizemos"',
      titleEn: '"You said, and we delivered"',
      speaker: "DATERRA & Consórcio RENOVATE",
      speakerEn: "DATERRA & RENOVATE Consortium",
      badge: "Apresentação Oficial",
      badgeEn: "Official Presentation",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      icon: "presentation",
      description: "Breve recapitulação dos resultados do GF1. Apresentação mostrando como o feedback dos participantes foi integrado no desenvolvimento das ferramentas digitais e pedagógicas.",
      descriptionEn: "Brief recap of FG1 findings. Presentation showing how participant feedback was integrated into the development of digital and pedagogical tools.",
      type: "slides"
    },
    {
      id: "slot-3",
      step: 3,
      time: "10:20 - 11:35",
      title: "Teste Prático 1: Serious Game",
      titleEn: "Practical Test 1: Serious Game",
      speaker: "Facilitação Tallentto & DATERRA",
      speakerEn: "Tallentto Facilitation & DATERRA",
      badge: "Smartphone / Tablet",
      badgeEn: "Smartphone / Tablet",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
      icon: "gamepad-2",
      url: "https://www.cordalgpt.ai/renovate/pruebas.php?pilot=calibration-pilot&lang=pt",
      description: "Teste prático individual do Serious Game. Dinâmica lúdica interativa focada em calibração, diagnóstico e boas práticas de proteção fitossanitária.",
      descriptionEn: "Individual hands-on testing of the Serious Game. Interactive gamified dynamics focusing on sprayer calibration, diagnosis, and crop protection best practices.",
      type: "game"
    },
    {
      id: "slot-4",
      step: 3,
      time: "11:35 - 11:45",
      title: "Avaliação 1: Serious Game",
      titleEn: "Evaluation 1: Serious Game",
      speaker: "Participantes & Equipa de Investigação",
      speakerEn: "Participants & Research Team",
      badge: "Formulário Online",
      badgeEn: "Online Questionnaire",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
      icon: "clipboard-list",
      description: "Preenchimento de um questionário sobre a experiência com o Serious Game. Avaliação de usabilidade, aplicabilidade pedagógica e clareza instrucional.",
      descriptionEn: "Completion of questionnaire evaluating the Serious Game experience, focusing on usability, pedagogical applicability, and instructional clarity.",
      type: "form-game"
    },
    {
      id: "slot-5",
      step: null,
      time: "11:45 - 12:00",
      title: "Pausa curta (coffee break)",
      titleEn: "Short Break (Coffee Break)",
      speaker: "Espaço de Convívio ESAS",
      speakerEn: "ESAS Social Area",
      badge: "Coffee Break",
      badgeEn: "Coffee Break",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
      icon: "coffee",
      description: "Pausa para café, descanso e networking informal entre os participantes, técnicos agrários e a equipa do consórcio.",
      descriptionEn: "Coffee break, rest, and informal networking between participants, agricultural advisors, and the consortium team.",
      type: "break"
    },
    {
      id: "slot-6",
      step: 4,
      time: "12:00 - 13:10",
      title: "Teste Prático 2: Simulador",
      titleEn: "Practical Test 2: 3D Simulator",
      speaker: "Facilitação Virmedex & DATERRA",
      speakerEn: "Virmedex Facilitation & DATERRA",
      badge: "Computador PC / Portátil",
      badgeEn: "PC / Laptop",
      badgeColor: "bg-sky-100 text-sky-800 border-sky-300",
      icon: "monitor",
      url: "https://simulator.renovateproject.eu/auth/login",
      description: "Teste prático individual do Simulador do RENOVATE no PC. Ambiente 3D interativo para otimização de parâmetros de pulverização, mitigação de deriva e análise de eficácia de campo.",
      descriptionEn: "Individual hands-on testing of the RENOVATE Simulator on PC. Interactive 3D environment for spray parameter optimisation, drift reduction, and field efficacy analysis.",
      type: "simulator"
    },
    {
      id: "slot-7",
      step: 4,
      time: "13:10 - 13:20",
      title: "Avaliação 2: Simulador",
      titleEn: "Evaluation 2: 3D Simulator",
      speaker: "Participantes & Equipa de Investigação",
      speakerEn: "Participants & Research Team",
      badge: "Formulário Online",
      badgeEn: "Online Questionnaire",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
      icon: "clipboard-list",
      description: "Preenchimento de um questionário sobre o teste prático com o Simulador. Recolha de opiniões sobre fidelidade agronómica, interface e potencial de integração no terreno.",
      descriptionEn: "Completion of questionnaire regarding the simulator hands-on trial, collecting insights on agronomic fidelity, user interface, and field adoption potential.",
      type: "form-simulator"
    },
    {
      id: "slot-8",
      step: null,
      time: "13:20 - 14:40",
      title: "Almoço (oferecido pela DATERRA)",
      titleEn: "Lunch (Hosted by DATERRA)",
      speaker: "Organização RENOVATE / DATERRA & ESAS",
      speakerEn: "RENOVATE Organisation / DATERRA & ESAS",
      badge: "Almoço & Convívio",
      badgeEn: "Lunch & Networking",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      icon: "utensils",
      description: "Pausa alargada para networking e discussão informal sobre a experiência da manhã. Almoço volante oferecido pela DATERRA a todos os participantes convidados.",
      descriptionEn: "Extended networking lunch and informal discussion on morning sessions, hosted by DATERRA for all invited participants.",
      type: "lunch"
    },
    {
      id: "slot-9",
      step: 5,
      time: "14:40 - 14:50",
      title: "Avaliação Global",
      titleEn: "Overall Evaluation",
      speaker: "Participantes & DATERRA",
      speakerEn: "Participants & DATERRA",
      badge: "Formulário Final",
      badgeEn: "Final Questionnaire",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      icon: "check-circle-2",
      description: "Preenchimento de um questionário sobre a perceção geral da plataforma RENOVATE, impacto conjunto das ferramentas e recomendações para formação profissional agrícola.",
      descriptionEn: "Completion of final questionnaire assessing overall perception of the RENOVATE platform, joint impact of tools, and recommendations for agricultural vocational training.",
      type: "form-global"
    },
    {
      id: "slot-10",
      step: 5,
      time: "14:50 - 15:40",
      title: "Discussão Plenária",
      titleEn: "Plenary Discussion",
      speaker: "Moderação DATERRA & Painel de Peritos",
      speakerEn: "DATERRA Moderation & Expert Panel",
      badge: "Debate Plenário",
      badgeEn: "Plenary Debate",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-300",
      icon: "messages-square",
      description: "Debate aberto projetando os resultados dos questionários. Foco no que funcionou, o que falhou e possíveis melhorias para a transição digital na agricultura.",
      descriptionEn: "Open plenary debate projecting questionnaire results, examining what worked well, key roadblocks, and actionable improvements for digital agricultural transition.",
      type: "discussion"
    },
    {
      id: "slot-11",
      step: 5,
      time: "15:40 - 15:50",
      title: "Sessão de Encerramento",
      titleEn: "Closing Session",
      speaker: "Direção ESAS & DATERRA",
      speakerEn: "ESAS Directorate & DATERRA",
      badge: "Conclusão",
      badgeEn: "Conclusion",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      icon: "flag",
      description: "Próximos passos e conclusão da sessão. Agradecimentos institucionais, partilha das vias de acesso aos relatórios do projeto e encerramento oficial dos trabalhos.",
      descriptionEn: "Next steps and session wrap-up, institutional acknowledgements, project report access details, and formal conclusion of proceedings.",
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
      thumbnail: "assets/images/gf1/gf1-2.jpg",
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
      { label: "Participantes Especialistas", labelEn: "Specialist Participants", value: "24" },
      { label: "Organizações Representadas", labelEn: "Represented Organisations", value: "15" },
      { label: "Necessidades Mapeadas", labelEn: "Mapped Training Needs", value: "38" },
      { label: "Índice de Interesse em Ferramentas Digitais", labelEn: "Digital Tool Interest Index", value: "92%" }
    ],
    highlights: [
      "Priorização da simplicidade de interface em ferramentas para operadores no terreno.",
      "Identificação do elevado potencial dos Serious Games para formação contínua certificada.",
      "Necessidade de ligação direta entre simulações e cálculos de custos/poupança real.",
      "Consenso sobre a relevância de criar recursos acessíveis em dispositivos móveis."
    ],
    highlightsEn: [
      "Prioritisation of interface simplicity in tools for field operators.",
      "Identification of high potential for Serious Games in accredited vocational training.",
      "Need for direct linkages between simulations and real-world cost and savings calculations.",
      "Consensus on the importance of creating mobile-accessible resources."
    ],
    galleryAlbums: [
      {
        id: "abertura",
        title: "Abertura & Apresentação",
        titleEn: "Opening & Presentation",
        badge: "6 Fotografias",
        badgeEn: "6 Photographs",
        icon: "presentation",
        description: "Acolhimento institucional, enquadramento dos trabalhos e diagnóstico inicial dos peritos agrários.",
        descriptionEn: "Institutional welcome, framework of proceedings, and initial diagnostics with agricultural experts.",
        images: [
          { filename: "gf1-1.jpg", src: "assets/images/gf1/gf1-1.jpg", alt: "Abertura & Apresentação - Foto 1", title: "Abertura dos Trabalhos", titleEn: "Opening of Proceedings" },
          { filename: "gf1-2.jpg", src: "assets/images/gf1/gf1-2.jpg", alt: "Abertura & Apresentação - Foto 2", title: "Apresentação e Enquadramento", titleEn: "Presentation & Framework" },
          { filename: "gf1-3.jpg", src: "assets/images/gf1/gf1-3.jpg", alt: "Abertura & Apresentação - Foto 3", title: "Auditório com Peritos", titleEn: "Auditorium with Experts" },
          { filename: "gf1-4.jpg", src: "assets/images/gf1/gf1-4.jpg", alt: "Abertura & Apresentação - Foto 4", title: "Sessão Plenária Inicial", titleEn: "Initial Plenary Session" },
          { filename: "gf1-5.jpg", src: "assets/images/gf1/gf1-5.jpg", alt: "Abertura & Apresentação - Foto 5", title: "Intervenção Institucional", titleEn: "Institutional Address" },
          { filename: "gf1-6.jpg", src: "assets/images/gf1/gf1-6.jpg", alt: "Abertura & Apresentação - Foto 6", title: "Apresentação do Consórcio", titleEn: "Consortium Presentation" }
        ]
      },
      {
        id: "cocriacao",
        title: "Dinâmica de Co-criação",
        titleEn: "Co-Creation Dynamics",
        badge: "6 Fotografias",
        badgeEn: "6 Photographs",
        icon: "users",
        description: "Mesas redondas participativas, identificação de necessidades formativas e debate prático em grupo.",
        descriptionEn: "Participatory roundtables, training needs identification, and practical group debates.",
        images: [
          { filename: "gf1-7.jpg", src: "assets/images/gf1/gf1-7.jpg", alt: "Dinâmica de Co-criação - Foto 1", title: "Mesa Redonda Participativa", titleEn: "Participatory Roundtable" },
          { filename: "gf1-8.jpg", src: "assets/images/gf1/gf1-8.jpg", alt: "Dinâmica de Co-criação - Foto 2", title: "Trabalho em Grupo e Co-criação", titleEn: "Group Work & Co-Creation" },
          { filename: "gf1-9.jpg", src: "assets/images/gf1/gf1-9.jpg", alt: "Dinâmica de Co-criação - Foto 3", title: "Debate sobre Formação Prática", titleEn: "Practical Training Debate" },
          { filename: "gf1-10.jpg", src: "assets/images/gf1/gf1-10.jpg", alt: "Dinâmica de Co-criação - Foto 4", title: "Discussão de Barreiras no Campo", titleEn: "Discussion of Field Barriers" },
          { filename: "gf1-11.jpg", src: "assets/images/gf1/gf1-11.jpg", alt: "Dinâmica de Co-criação - Foto 5", title: "Mapeamento de Competências", titleEn: "Competence Mapping" },
          { filename: "gf1-12.jpg", src: "assets/images/gf1/gf1-12.jpg", alt: "Dinâmica de Co-criação - Foto 6", title: "Interação e Partilha Ativa", titleEn: "Active Interaction & Sharing" }
        ]
      },
      {
        id: "sintese",
        title: "Síntese dos Resultados",
        titleEn: "Synthesis of Results",
        badge: "8 Fotografias",
        badgeEn: "8 Photographs",
        icon: "clipboard-check",
        description: "Partilha em plenário, consolidação das conclusões e registo das diretrizes pedagógicas para as ferramentas.",
        descriptionEn: "Plenary sharing, consolidation of group findings, and recording pedagogical guidelines for the digital tools.",
        images: [
          { filename: "gf1-13.jpg", src: "assets/images/gf1/gf1-13.jpg", alt: "Síntese dos Resultados - Foto 1", title: "Apresentação dos Resultados", titleEn: "Results Presentation" },
          { filename: "gf1-14.jpg", src: "assets/images/gf1/gf1-14.jpg", alt: "Síntese dos Resultados - Foto 2", title: "Registo dos Pontos-Chave", titleEn: "Key Points Recording" },
          { filename: "gf1-15.jpg", src: "assets/images/gf1/gf1-15.jpg", alt: "Síntese dos Resultados - Foto 3", title: "Debate Final em Auditório", titleEn: "Final Auditorium Debate" },
          { filename: "gf1-16.jpg", src: "assets/images/gf1/gf1-16.jpg", alt: "Síntese dos Resultados - Foto 4", title: "Sistematização de Conclusões", titleEn: "Systematisation of Conclusions" },
          { filename: "gf1-17.jpg", src: "assets/images/gf1/gf1-17.jpg", alt: "Síntese dos Resultados - Foto 5", title: "Recomendações para Ferramentas", titleEn: "Recommendations for Tools" },
          { filename: "gf1-18.jpg", src: "assets/images/gf1/gf1-18.jpg", alt: "Síntese dos Resultados - Foto 6", title: "Alinhamento das Diretrizes", titleEn: "Guidelines Alignment" },
          { filename: "gf1-19.jpg", src: "assets/images/gf1/gf1-19.jpg", alt: "Síntese dos Resultados - Foto 7", title: "Sessão Plenária de Encerramento", titleEn: "Closing Plenary Session" },
          { filename: "gf1-20.jpg", src: "assets/images/gf1/gf1-20.jpg", alt: "Síntese dos Resultados - Foto 8", title: "Conclusão do Grupo Focal 1", titleEn: "Conclusion of Focus Group 1" }
        ]
      }
    ],
    // Fallback de retrocompatibilidade com fotos reais
    gallery: [
      { filename: "gf1-1.jpg", src: "assets/images/gf1/gf1-1.jpg", alt: "Abertura & Apresentação", title: "Abertura & Apresentação", titleEn: "Opening & Presentation", caption: "Auditório com peritos agrários e investigadores no Grupo Focal 1 em Lisboa.", captionEn: "Auditorium with agricultural experts and researchers at Focus Group 1 in Lisbon." },
      { filename: "gf1-7.jpg", src: "assets/images/gf1/gf1-7.jpg", alt: "Dinâmica de Co-criação", title: "Dinâmica de Co-criação", titleEn: "Co-Creation Dynamics", caption: "Trabalho participativo e mapeamento de competências agrárias.", captionEn: "Participatory work and agricultural skills mapping." },
      { filename: "gf1-13.jpg", src: "assets/images/gf1/gf1-13.jpg", alt: "Síntese dos Resultados", title: "Síntese dos Resultados", titleEn: "Synthesis of Results", caption: "Partilha em plenário e consolidação das conclusões dos grupos.", captionEn: "Plenary sharing and consolidation of group conclusions." }
    ]
  },

  // Resultados & Media
  resultsMedia: {
    deliverable: {
      code: "Entregável 1.4",
      codeEn: "Deliverable 1.4",
      status: "Relatório Oficial • Horizonte Europa",
      statusEn: "Official Report • Horizon Europe",
      url: "https://renovateproject.eu/shared-files/2751/?D1.3_Reports_on_analysis_of_expectation_for_training_and_Focus_Group_meetings_RENOVATE.pdf",
      title: "Relatório de Análise de Expectativas de Formação e Resultados das Reuniões dos Grupos Focais",
      titleEn: "Reports on analysis of expectation for training and results of Focus Group meetings",
      abstract: "Relatório oficial que consolida as expectativas de 153 intervenientes do setor agrícola em 6 países europeus (PT, ES, FR, IT, BE, PL), estabelecendo as diretrizes técnicas e pedagógicas da plataforma RENOVATE, Serious Games e simuladores 3D.",
      abstractEn: "Official report consolidating expectations from 153 agricultural stakeholders across 6 European countries (PT, ES, FR, IT, BE, PL), establishing the technical and pedagogical guidelines for the RENOVATE platform, Serious Games, and 3D simulators.",
      highlights: [
        "Priorização da simplicidade de interface em ferramentas para operadores no terreno.",
        "Identificação do elevado potencial dos Serious Games para formação contínua certificada.",
        "Necessidade de ligação direta entre simulações e cálculos de custos/poupança real.",
        "Consenso sobre a relevância de criar recursos acessíveis em dispositivos móveis."
      ],
      highlightsEn: [
        "Prioritisation of interface simplicity in tools for operators in the field.",
        "Identification of the high potential of Serious Games for certified ongoing training.",
        "Need for a direct link between simulations and real cost/savings calculations.",
        "Consensus on the relevance of creating resources accessible on mobile devices."
      ]
    },
    gf2Video: {
      status: "Em Produção",
      sessionDate: "06 Outubro 2026",
      location: "ESAS - Santarém",
      title: "Vídeo Oficial: 2ª Sessão do Grupo Focal RENOVATE (Santarém)",
      titleEn: "Official Video: 2nd RENOVATE Focus Group Session (Santarém)",
      description: "Reportagem audiovisual com a dinâmica prática dos participantes, ensaios no Serious Game, testes no Simulador 3D e entrevistas.",
      descriptionEn: "Audiovisual coverage featuring hands-on dynamics, Serious Game trials, 3D Simulator evaluations, and participant interviews."
    },
    gallery: [
      {
        id: "gf2-opening",
        title: "Sessão de Abertura",
        titleEn: "Opening Session",
        time: "10:00 - 10:10",
        phase: "Fase 1",
        phaseEn: "Phase 1",
        tag: "Acolhimento & Enquadramento",
        tagEn: "Welcome & Framework",
        icon: "landmark",
        caption: "Acolhimento institucional pelo Diretor da ESAS (Politécnico de Santarém) e enquadramento dos trabalhos pelo consórcio RENOVATE.",
        captionEn: "Institutional welcome by the Director of ESAS (Polytechnic University of Santarém) and framework of proceedings by the RENOVATE consortium."
      },
      {
        id: "gf2-delivered",
        title: '"Disseram, e nós fizemos"',
        titleEn: '"You said, and we delivered"',
        time: "10:10 - 10:20",
        phase: "Fase 2",
        phaseEn: "Phase 2",
        tag: "Evolução das Ferramentas",
        tagEn: "Tools Evolution",
        icon: "presentation",
        caption: "Apresentação oficial da evolução das ferramentas digitais integrando as recomendações e melhorias sugeridas no GF1 de Lisboa.",
        captionEn: "Official presentation of digital tool developments integrating the feedback and recommendations collected during FG1 in Lisbon."
      },
      {
        id: "gf2-serious-game",
        title: "Teste Prático: Serious Game",
        titleEn: "Practical Test: Serious Game",
        time: "10:20 - 11:35",
        phase: "Fase 3",
        phaseEn: "Phase 3",
        tag: "Experimentação Mobile",
        tagEn: "Mobile Hands-on",
        icon: "gamepad-2",
        caption: "Registo fotográfico dos participantes a testar o Serious Game de calibração em smartphones e tablets em ambiente de formação.",
        captionEn: "Photographic record of participants testing the calibration Serious Game on smartphones and tablets in a training environment."
      },
      {
        id: "gf2-simulator",
        title: "Teste Prático: Simulador",
        titleEn: "Practical Test: 3D Simulator",
        time: "12:00 - 13:10",
        phase: "Fase 4",
        phaseEn: "Phase 4",
        tag: "Postos Informáticos PC",
        tagEn: "PC Workstations",
        icon: "monitor",
        caption: "Captação da interação dos peritos e técnicos com o simulador 3D nos computadores: definição de velocidade, bicos e deriva.",
        captionEn: "Capturing experts and advisors interacting with the 3D simulator on PCs: setting speed, nozzles, and drift mitigation."
      },
      {
        id: "gf2-evaluations",
        title: "Avaliação Questionários",
        titleEn: "Questionnaires Evaluation",
        time: "11:35 • 13:10 • 14:40",
        phase: "Fase 5",
        phaseEn: "Phase 5",
        tag: "Métricas & Escala SUS",
        tagEn: "Metrics & SUS Scale",
        icon: "clipboard-check",
        caption: "Preenchimento dos questionários de avaliação da usabilidade (SUS), eficácia agronómica e satisfação global da plataforma.",
        captionEn: "Completion of evaluation questionnaires assessing usability (SUS), agronomic efficacy, and overall platform satisfaction."
      },
      {
        id: "gf2-plenary",
        title: "Discussão Plenária",
        titleEn: "Plenary Discussion",
        time: "14:50 - 15:40",
        phase: "Fase 6",
        phaseEn: "Phase 6",
        tag: "Debate & Conclusões",
        tagEn: "Debate & Conclusions",
        icon: "messages-square",
        caption: "Debate coletivo com projeção das respostas dos participantes, desafios práticos da digitalização agrícola e encerramento.",
        captionEn: "Collective debate projecting live participant responses, practical agricultural digitalisation challenges, and closing session."
      }
    ]
  },

  // Configuração do Dashboard de Resultados (Google Sheets com Múltiplos Separadores)
  resultsDashboard: {
    // ID da Folha de Cálculo Google Sheets partilhada (ex: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms)
    spreadsheetId: "2PACX-1vQKvZtpO0WW7vqeOMvJpmFbDoh8K2F0h0SSI5t3S1LiI7Ag1nQpGJi3CkDkeGxrULkk4UxSLjrhTd1e", 
    // GID de cada separador (extraído da URL: #gid=...)
    tabGids: {
      game: "1971530026", // Separador 1: Serious Game (Tallentto) + Dados Demográficos
      sim: "1882859537",   // Separador 2: Simulador RENOVATE (Virmedex)
      global: "914346842"  // Separador 3: Avaliação Global (NPS + Síntese)
    },
    autoRefreshSeconds: 30,

    // Conjunto de dados de demonstração representativo de 18 peritos agrícolas na ESAS
    // Exibido automaticamente antes de serem inseridos os IDs ou quando a folha tem 0 respostas
    demoData: {
      isDemo: true,
      participantCount: 18,
      lastUpdated: "Hoje, 15:30",
      gameResponses: [
        { code: "P01", profile: "Técnico(a) / Consultor(a)", age: "30-45 anos", gender: "Masculino", crops: ["Vinha", "Olival"], digitalComfort: 4, q7: 5, q8: 4, q9: 5, q10: 5, q11: 4, q12: 5, sus: [4, 2, 5, 1, 4, 2, 5, 1, 4, 2], words: "Prático, Intuitivo, Rápido" },
        { code: "P02", profile: "Formador(a) / Profissional de Ensino Agrícola", age: "30-45 anos", gender: "Feminino", crops: ["Pomóideas / Prunóideas", "Hortícolas"], digitalComfort: 5, q7: 4, q8: 4, q9: 4, q10: 5, q11: 5, q12: 4, sus: [5, 1, 4, 2, 5, 1, 4, 1, 5, 2], words: "Inovador, Educativo, Dinâmico" },
        { code: "P03", profile: "Agricultor(a) / Produtor(a)", age: "46-60 anos", gender: "Masculino", crops: ["Olival", "Cereais / Culturas arvenses"], digitalComfort: 3, q7: 4, q8: 3, q9: 5, q10: 4, q11: 4, q12: 4, sus: [4, 2, 4, 2, 4, 2, 4, 2, 4, 2], words: "Desafiante, Útil, Claro" },
        { code: "P04", profile: "Técnico(a) / Consultor(a)", age: "30-45 anos", gender: "Masculino", crops: ["Vinha", "Pomóideas / Prunóideas"], digitalComfort: 4, q7: 5, q8: 4, q9: 4, q10: 5, q11: 5, q12: 5, sus: [4, 1, 5, 2, 5, 1, 5, 2, 4, 1], words: "Interessante, Visual, Prático" },
        { code: "P05", profile: "Investigador(a)", age: "46-60 anos", gender: "Feminino", crops: ["Hortícolas", "Vinha"], digitalComfort: 5, q7: 5, q8: 4, q9: 5, q10: 5, q11: 4, q12: 5, sus: [5, 2, 5, 1, 4, 1, 5, 1, 5, 2], words: "Didático, Eficaz, Intuitivo" },
        { code: "P06", profile: "Representante da Indústria (Maquinaria / Agroquímicos)", age: "<30 anos", gender: "Masculino", crops: ["Cereais / Culturas arvenses"], digitalComfort: 5, q7: 4, q8: 4, q9: 4, q10: 4, q11: 5, q12: 4, sus: [4, 2, 4, 2, 5, 1, 4, 2, 4, 2], words: "Rápido, Esclarecedor, Motivador" },
        { code: "P07", profile: "Agricultor(a) / Produtor(a)", age: "46-60 anos", gender: "Masculino", crops: ["Olival", "Vinha"], digitalComfort: 3, q7: 4, q8: 3, q9: 4, q10: 5, q11: 4, q12: 4, sus: [4, 2, 4, 3, 3, 2, 4, 2, 4, 2], words: "Estimulante, Realista, Prático" },
        { code: "P08", profile: "Técnico(a) / Consultor(a)", age: "<30 anos", gender: "Feminino", crops: ["Pomóideas / Prunóideas", "Hortícolas"], digitalComfort: 4, q7: 5, q8: 4, q9: 5, q10: 5, q11: 5, q12: 5, sus: [5, 1, 5, 1, 4, 2, 5, 1, 5, 1], words: "Dinâmico, Acessível, Interativo" },
        { code: "P09", profile: "Técnico(a) / Consultor(a)", age: "30-45 anos", gender: "Masculino", crops: ["Vinha", "Olival"], digitalComfort: 4, q7: 4, q8: 4, q9: 4, q10: 4, q11: 4, q12: 4, sus: [4, 2, 4, 2, 4, 2, 4, 2, 4, 2], words: "Útil, Rigoroso, Envolvente" },
        { code: "P10", profile: "Representante da Indústria (Maquinaria / Agroquímicos)", age: "30-45 anos", gender: "Masculino", crops: ["Pomóideas / Prunóideas"], digitalComfort: 4, q7: 5, q8: 4, q9: 5, q10: 5, q11: 5, q12: 4, sus: [4, 1, 5, 2, 5, 1, 4, 2, 4, 1], words: "Moderno, Aplicável, Simples" },
        { code: "P11", profile: "Investigador(a)", age: "30-45 anos", gender: "Feminino", crops: ["Olival", "Pomóideas / Prunóideas"], digitalComfort: 4, q7: 5, q8: 5, q9: 5, q10: 5, q11: 4, q12: 5, sus: [5, 2, 5, 1, 4, 1, 5, 1, 5, 2], words: "Inovador, Pedagógico, Claro" },
        { code: "P12", profile: "Agricultor(a) / Produtor(a)", age: ">60 anos", gender: "Masculino", crops: ["Vinha", "Cereais / Culturas arvenses"], digitalComfort: 2, q7: 4, q8: 3, q9: 4, q10: 4, q11: 3, q12: 4, sus: [3, 3, 4, 3, 3, 2, 3, 2, 4, 3], words: "Prático, Formativo, Interessante" },
        { code: "P13", profile: "Entidade Reguladora / Administração Pública", age: "<30 anos", gender: "Feminino", crops: ["Hortícolas", "Pomóideas / Prunóideas"], digitalComfort: 5, q7: 5, q8: 4, q9: 4, q10: 5, q11: 5, q12: 5, sus: [5, 1, 5, 1, 5, 1, 5, 1, 4, 1], words: "Desafiante, Intuitivo, Essencial" },
        { code: "P14", profile: "Técnico(a) / Consultor(a)", age: "30-45 anos", gender: "Masculino", crops: ["Vinha", "Olival"], digitalComfort: 4, q7: 4, q8: 4, q9: 5, q10: 5, q11: 4, q12: 4, sus: [4, 2, 4, 1, 4, 2, 4, 1, 4, 2], words: "Rápido, Lúdico, Completo" },
        { code: "P15", profile: "Estudante", age: "<30 anos", gender: "Masculino", crops: ["Hortícolas", "Cereais / Culturas arvenses"], digitalComfort: 5, q7: 5, q8: 4, q9: 4, q10: 4, q11: 5, q12: 5, sus: [4, 1, 5, 1, 4, 2, 5, 1, 5, 1], words: "Esclarecedor, Eficiente, Positivo" },
        { code: "P16", profile: "Formador(a) / Profissional de Ensino Agrícola", age: "46-60 anos", gender: "Masculino", crops: ["Olival", "Pomóideas / Prunóideas"], digitalComfort: 3, q7: 4, q8: 4, q9: 4, q10: 4, q11: 4, q12: 4, sus: [4, 2, 4, 2, 4, 2, 4, 2, 4, 2], words: "Visual, Direto, Relevante" },
        { code: "P17", profile: "Técnico(a) / Consultor(a)", age: "30-45 anos", gender: "Feminino", crops: ["Vinha", "Pomóideas / Prunóideas"], digitalComfort: 4, q7: 5, q8: 4, q9: 5, q10: 5, q11: 5, q12: 5, sus: [5, 1, 5, 1, 4, 1, 5, 2, 4, 1], words: "Muito prático, Educativo, Inovador" },
        { code: "P18", profile: "Outra", age: "30-45 anos", gender: "Masculino", crops: ["Olival", "Hortícolas"], digitalComfort: 4, q7: 4, q8: 4, q9: 4, q10: 5, q11: 4, q12: 4, sus: [4, 2, 4, 2, 4, 1, 4, 1, 4, 2], words: "Dinâmico, Fácil, Envolvente" }
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
        { code: "P14", q15: 4, q16: 4, q17: 4, q18: 5, q19: 4, q20: 4, q21: 4, q22: 4, q23: 4, sus: [4, 2, 4, 1, 4, 2, 4, 1, 4, 2], q25: "Ajuda a fixar a fórmula de cálculo de débito.", words: "Excelente, Intuitivo, Real" },
        { code: "P15", q15: 5, q16: 4, q17: 4, q18: 4, q19: 4, q20: 4, q21: 4, q22: 4, q23: 5, sus: [5, 1, 4, 2, 4, 1, 4, 2, 4, 1], q25: "Ambiente muito apelativo.", words: "Imersivo, Prático, Relevante" },
        { code: "P16", q15: 4, q16: 4, q17: 4, q18: 4, q19: 4, q20: 4, q21: 4, q22: 4, q23: 4, sus: [4, 2, 4, 2, 4, 2, 4, 2, 4, 2], q25: "Muito representativo do pulverizador real.", words: "Formativo, Detalhado, Positivo" },
        { code: "P17", q15: 5, q16: 4, q17: 5, q18: 5, q19: 5, q20: 5, q21: 5, q22: 5, q23: 5, sus: [5, 1, 5, 1, 5, 1, 4, 1, 5, 1], q25: "Permite errar sem estragar produto nem gastar água.", words: "Inovador, Exigente, Completo" },
        { code: "P18", q15: 4, q16: 4, q17: 4, q18: 5, q19: 4, q20: 4, q21: 4, q22: 4, q23: 4, sus: [4, 2, 4, 2, 4, 1, 4, 2, 4, 1], q25: "Ótima ferramenta de treino para operadores.", words: "Realista, Interativo, Valioso" }
      ],
      globalResponses: [
        { code: "P01", q26: 5, q27: 4, q28: 5, q29: "Extremamente provável", nps: 5, q30: "Excelente iniciativa de ligar a tecnologia à prática de campo." },
        { code: "P02", q26: 5, q27: 5, q28: 5, q29: "Extremamente provável", nps: 5, q30: "A integração dos dois ambientes (jogo e simulador) é muito complementar." },
        { code: "P03", q26: 4, q27: 3, q28: 4, q29: "Muito provável", nps: 4, q30: "Mais tempo para explorar cada exercício nas sessões práticas." },
        { code: "P04", q26: 5, q27: 4, q28: 5, q29: "Extremamente provável", nps: 5, q30: "Disponibilizar versão para telemóvel do simulador seria excelente." },
        { code: "P05", q26: 5, q27: 5, q28: 5, q29: "Extremamente provável", nps: 5, q30: "Recomendo vivamente a integração em módulos curriculares agrários." },
        { code: "P06", q26: 4, q27: 4, q28: 4, q29: "Muito provável", nps: 4, q30: "Parabéns pela qualidade gráfica do simulador e dinamismo do jogo." },
        { code: "P07", q26: 4, q27: 4, q28: 4, q29: "Moderavelmente provável", nps: 3, q30: "Facilitar ainda mais os menus para agricultores mais velhos." },
        { code: "P08", q26: 5, q27: 5, q28: 5, q29: "Extremamente provável", nps: 5, q30: "Plataforma muito intuitiva e envolvente." },
        { code: "P09", q26: 4, q27: 4, q28: 4, q29: "Muito provável", nps: 4, q30: "Boa dinâmica de grupo e organização." },
        { code: "P10", q26: 5, q27: 4, q28: 5, q29: "Extremamente provável", nps: 5, q30: "A calibração do pulverizador fica muito mais fácil de memorizar." },
        { code: "P11", q26: 5, q27: 5, q28: 5, q29: "Extremamente provável", nps: 5, q30: "O consórcio RENOVATE está a fazer um trabalho fundamental para o setor." },
        { code: "P12", q26: 4, q27: 3, q28: 4, q29: "Moderavelmente provável", nps: 3, q30: "Manual de apoio em papel ou PDF impresso para levar para a exploração." },
        { code: "P13", q26: 5, q27: 5, q28: 5, q29: "Extremamente provável", nps: 5, q30: "Simulação realista e feedback imediato são os pontos fortes." },
        { code: "P14", q26: 4, q27: 4, q28: 4, q29: "Muito provável", nps: 4, q30: "Muito útil para formação de novos funcionários agrícolas." },
        { code: "P15", q26: 5, q27: 4, q28: 5, q29: "Extremamente provável", nps: 5, q30: "Didático, moderno e estimulante." },
        { code: "P16", q26: 4, q27: 4, q28: 4, q29: "Muito provável", nps: 4, q30: "Representa bem a realidade de quem calibra no terreno." },
        { code: "P17", q26: 5, q27: 5, q28: 5, q29: "Extremamente provável", nps: 5, q30: "Parabéns à DATERRA e à ESAS pelo excelente acolhimento e organização." },
        { code: "P18", q26: 4, q27: 4, q28: 4, q29: "Muito provável", nps: 4, q30: "Desejo sucesso na versão final do projeto RENOVATE." }
      ]
    }
  }
};

