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
    seriousGameTallentto: "https://www.cordalgpt.ai/renovate/register.php?pilot=calibration-pilot&lang=pt",
    simulatorVirmedex: "https://simulator.renovateproject.eu/auth/login",
    googleFormPreSession: "https://docs.google.com/forms/d/e/1FAIpQLScAwHNGoYqikgsHwTOgKWC80l0F9b3S-kgXEbyCjxxjv_fTUQ/viewform",
    googleFormGameTallentto: "https://docs.google.com/forms/d/e/1FAIpQLScAwHNGoYqikgsHwTOgKWC80l0F9b3S-kgXEbyCjxxjv_fTUQ/viewform",
    googleFormSimVirmedex: "https://docs.google.com/forms/d/e/1FAIpQLSeyF3Ty9bzdw1oexKLsX2dC3StkoeUW7AyeFBPDVY6sU6OPmQ/viewform",
    googleFormGlobal: "https://docs.google.com/forms/d/e/1FAIpQLSc1tR_sfcQMqXjd26UGfwyjLInt1fJw2IMM2ERXJAyjfdT1LA/viewform",
    googleSlidesUrl: "https://docs.google.com/presentation/d/e/2PACX-1vRHnC6-5ki_78jMjLvzzpQA-8jX_uso_NRWE63z0xf5Lf2bXjU51iaXKthzZTdWjhk9iPA9WxsiivGU/embed?start=false&loop=false",
    googleSlidesFullscreen: "https://docs.google.com/presentation/d/e/2PACX-1vRHnC6-5ki_78jMjLvzzpQA-8jX_uso_NRWE63z0xf5Lf2bXjU51iaXKthzZTdWjhk9iPA9WxsiivGU/pub?start=false&loop=false",
    googleSlidesUrlEn: "https://docs.google.com/presentation/d/e/2PACX-1vSMWz8Ip1gb_PoKR1GAg6Eitn2kaFEhOuhd31KO6WVQrwnD51p0BjnznXkiMhewdZpX3THoeIh-HcR8/embed?start=false&loop=false",
    googleSlidesFullscreenEn: "https://docs.google.com/presentation/d/e/2PACX-1vSMWz8Ip1gb_PoKR1GAg6Eitn2kaFEhOuhd31KO6WVQrwnD51p0BjnznXkiMhewdZpX3THoeIh-HcR8/pub?start=true&loop=false&delayms=60000",
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
      speaker: "Parceiro RENOVATE",
      speakerEn: "RENOVATE Partner",
      speakerLabel: "Orador",
      speakerLabelEn: "Speaker",
      speakerIcon: "user",
      badge: "Boas-Vindas",
      badgeEn: "Welcome",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      icon: "landmark",
      description: "Intervenção de boas-vindas pelo parceiro RENOVATE, acolhimento institucional dos participantes e enquadramento dos trabalhos.",
      descriptionEn: "Welcome address by the RENOVATE partner, institutional greeting of participants, and framework of proceedings.",
      type: "opening"
    },
    {
      id: "slot-2",
      step: 2,
      time: "10:10 - 10:20",
      title: '"Disseram, e nós fizemos"',
      titleEn: '"You said, and we delivered"',
      speaker: "Parceiro RENOVATE",
      speakerEn: "RENOVATE Partner",
      speakerLabel: "Orador",
      speakerLabelEn: "Speaker",
      speakerIcon: "user",
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
      speaker: "Tallentto",
      speakerEn: "Tallentto",
      speakerLabel: "Suporte Técnico",
      speakerLabelEn: "Technical Support",
      speakerIcon: "wrench",
      badge: "Smartphone / Tablet",
      badgeEn: "Smartphone / Tablet",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
      icon: "gamepad-2",
      url: "https://www.cordalgpt.ai/renovate/register.php?pilot=calibration-pilot&lang=pt",
      description: "Teste prático individual do Serious Game para telemóvel. Uma missão interativa baseada em desafios cronometrados e decisões práticas sobre calibração, diagnóstico e boas práticas de proteção fitossanitária.",
      descriptionEn: "Individual practical test of the Serious Game for mobile phones. An interactive mission based on timed challenges and practical decisions regarding calibration, diagnosis, and plant protection best practices.",
      type: "game"
    },
    {
      id: "slot-4",
      step: 3,
      time: "11:35 - 11:45",
      title: "Avaliação 1: Serious Game",
      titleEn: "Evaluation 1: Serious Game",
      speaker: "RENOVATE Tarefa 1.4",
      speakerEn: "RENOVATE Task 1.4",
      speakerLabel: "Coordenação",
      speakerLabelEn: "Coordination",
      speakerIcon: "clipboard-check",
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
      speaker: "",
      speakerEn: "",
      speakerLabel: "Local",
      speakerLabelEn: "Location",
      speakerIcon: "map-pin",
      badge: "Coffee Break",
      badgeEn: "Coffee Break",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
      icon: "coffee",
      description: "",
      descriptionEn: "",
      type: "break"
    },
    {
      id: "slot-6",
      step: 4,
      time: "12:00 - 13:10",
      title: "Teste Prático 2: Simulador",
      titleEn: "Practical Test 2: 3D Simulator",
      speaker: "Virmedex",
      speakerEn: "Virmedex",
      speakerLabel: "Suporte Técnico",
      speakerLabelEn: "Technical Support",
      speakerIcon: "wrench",
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
      speaker: "RENOVATE Tarefa 1.4",
      speakerEn: "RENOVATE Task 1.4",
      speakerLabel: "Coordenação",
      speakerLabelEn: "Coordination",
      speakerIcon: "clipboard-check",
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
      title: "Almoço",
      titleEn: "Lunch",
      speaker: "",
      speakerEn: "",
      speakerLabel: "Local",
      speakerLabelEn: "Location",
      speakerIcon: "map-pin",
      badge: "Almoço & Convívio",
      badgeEn: "Lunch & Networking",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      icon: "utensils",
      description: "Pausa alargada para networking e discussão informal sobre a experiência da manhã.",
      descriptionEn: "Extended pause for networking and informal discussion about the morning session.",
      type: "lunch"
    },
    {
      id: "slot-9",
      step: 5,
      time: "14:40 - 14:50",
      title: "Avaliação Global",
      titleEn: "Overall Evaluation",
      speaker: "RENOVATE Tarefa 1.4",
      speakerEn: "RENOVATE Task 1.4",
      speakerLabel: "Coordenação",
      speakerLabelEn: "Coordination",
      speakerIcon: "clipboard-check",
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
      speaker: "Parceiro RENOVATE",
      speakerEn: "RENOVATE Partner",
      speakerLabel: "Orador",
      speakerLabelEn: "Speaker",
      speakerIcon: "user",
      badge: "Debate Plenário",
      badgeEn: "Plenary Debate",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-300",
      icon: "messages-square",
      description: "Debate aberto baseado na projeção dos resultados obtidos. Análise crítica das mais-valias e falhas detetadas, focando as vantagens das ferramentas digitais no ensino e na transição digital agrícola.",
      descriptionEn: "Open discussion based on the projection of the results obtained. Critical analysis of strengths and flaws identified, focusing on the advantages of interactive digital tools in teaching and agricultural digital transition.",
      type: "discussion"
    },
    {
      id: "slot-11",
      step: 5,
      time: "15:40 - 15:50",
      title: "Sessão de Encerramento",
      titleEn: "Closing Session",
      speaker: "Parceiro RENOVATE",
      speakerEn: "RENOVATE Partner",
      speakerLabel: "Orador",
      speakerLabelEn: "Speaker",
      speakerIcon: "user",
      badge: "Conclusão",
      badgeEn: "Conclusion",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      icon: "flag",
      description: "Considerações finais, próximos passos e encerramento da sessão. Espaço dedicado aos agradecimentos institucionais e às orientações para consulta dos relatórios do projeto.",
      descriptionEn: "Closing remarks, next steps, and official session closure. Space dedicated to institutional acknowledgements and guidelines for accessing project reports.",
      type: "closing"
    }
  ],

  // Grupo Focal 1 (Lisboa, 22 de outubro de 2024)
  gf1: {
    date: "22 de outubro de 2024",
    location: "Lisboa, Portugal",
    title: "1ª Sessão do Grupo Focal RENOVATE - Diagnóstico de Necessidades",
    summary: "O primeiro Grupo Focal em Portugal reuniu peritos do setor agrário, formadores e consultores para mapear as principais necessidades de formação em proteção sustentável das culturas e avaliar a recetividade do setor a soluções digitais.",
    summaryEn: "The first Focus Group in Portugal brought together agricultural sector experts, trainers, and consultants to map the main training needs in sustainable crop protection and assess the sector's receptivity to digital solutions.",
    video: {
      url: "https://youtu.be/1_jQYkNluhY?si=BJvw2ftMW5WyCqki",
      embedUrl: "https://www.youtube-nocookie.com/embed/1_jQYkNluhY",
      thumbnail: "assets/images/gf1/gf1-2.jpg",
      title: "Vídeo Oficial: 1ª Sessão do Grupo Focal RENOVATE (Lisboa)",
      description: "Reportagem audiovisual da sessão inaugural.",
      descriptionEn: "Audiovisual coverage of the inaugural session."
    },
    newsArticle: {
      title: "Grupo Focal RENOVATE: Primeira Sessão em Lisboa Reúne Agricultores e Especialistas",
      source: "Página de Notícias da DATERRA",
      url: "https://daterra.com.pt/grupo-focal-renovate-primeira-sessao-em-lisboa-reune-agricultores-e-especialistas/",
      description: "Consulte o artigo DATERRA com o resumo das perspectivas recolhidas na primeira sessão em Lisboa.",
      descriptionEn: "Read the DATERRA article summarizing the perspectives gathered during the first session in Lisbon."
    },
    resultsDocument: {
      title: "Conclusões do 1º Grupo Focal RENOVATE",
      format: "Documento Oficial (PDF)",
      url: "https://daterra.com.pt/wp-content/uploads/2025/03/10_ConclusoesGrupoFocalRENOVATE_pt.pdf",
      description: "Aceda ao relatório com a síntese dos resultados, o mapeamento de necessidades e as recomendações prioritárias apuradas na 1ª Sessão do Grupo Focal RENOVATE em Portugal.",
      descriptionEn: "Access the report containing the summary of results, needs mapping, and priority recommendations gathered during the 1st RENOVATE Focus Group Session in Portugal."
    },
    metrics: [
      { label: "Participantes Especialistas", labelEn: "Specialist Participants", value: "153" },
      { label: "Entidades Representadas", labelEn: "Represented Entities", value: "85+" },
      { label: "Necessidades Mapeadas", labelEn: "Mapped Training Needs", value: "24+" },
      { label: "Áreas Temáticas Prioritárias", labelEn: "Priority Thematic Areas", value: "8" }
    ],
    highlights: [
      "Necessidade de formação prática com recurso a demonstrações no campo e simuladores interativos.",
      "Adaptação dos conteúdos formativos aos contextos locais, utilizando linguagem simples e direta.",
      "Integração de simuladores para avaliação de cenários práticos e análise de custo-benefício.",
      "Desenvolvimento de uma plataforma intuitiva com conteúdos audiovisuais e elementos de gamificação."
    ],
    highlightsEn: [
      "Need for practical training using field demonstrations and interactive simulators.",
      "Adaptation of training content to local contexts, using simple and direct language.",
      "Integration of simulators for practical scenario evaluation and cost-benefit analysis.",
      "Development of an intuitive platform with audiovisual content and gamification elements."
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
      code: "Entregável 1.3",
      codeEn: "Deliverable 1.3",
      status: "Relatório Oficial • Horizonte Europa",
      statusEn: "Official Report • Horizon Europe",
      url: "https://renovateproject.eu/shared-files/2751/?D1.3_Reports_on_analysis_of_expectation_for_training_and_Focus_Group_meetings_RENOVATE.pdf",
      title: "Relatório de Análise de Expectativas de Formação e Resultados das Reuniões dos Grupos Focais",
      titleEn: "Reports on analysis of expectation for training and results of Focus Group meetings",
      abstract: "Relatório oficial que consolida as expectativas de 153 intervenientes do setor agrícola em 6 países europeus (PT, ES, FR, IT, BE, PL), estabelecendo as diretrizes técnicas e pedagógicas da plataforma RENOVATE, Serious Games e simuladores 3D.",
      abstractEn: "Official report consolidating expectations from 153 agricultural stakeholders across 6 European countries (PT, ES, FR, IT, BE, PL), establishing the technical and pedagogical guidelines for the RENOVATE platform, Serious Games, and 3D simulators.",
      highlights: [
        "Necessidade de formação prática com recurso a demonstrações no campo e simuladores interativos.",
        "Adaptação dos conteúdos formativos aos contextos locais, utilizando linguagem simples e direta.",
        "Integração de simuladores para avaliação de cenários práticos e análise de custo-benefício.",
        "Desenvolvimento de uma plataforma intuitiva com conteúdos audiovisuais e elementos de gamificação."
      ],
      highlightsEn: [
        "Need for practical training using field demonstrations and interactive simulators.",
        "Adaptation of training content to local contexts, using simple and direct language.",
        "Integration of simulators for practical scenario evaluation and cost-benefit analysis.",
        "Development of an intuitive platform with audiovisual content and gamification elements."
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

  // Configuração do Dashboard de Resultados (Firebase Realtime Database & Google Apps Script)
  resultsDashboard: {
    // URL da Firebase Realtime Database (WebSockets Push em Tempo Real)
    firebaseUrl: "https://renovate-fg2-default-rtdb.europe-west1.firebasedatabase.app",
    loginApiUrl: "https://script.google.com/macros/s/AKfycbzeV5PPgK8MNn0y1MIYAcf8VWzgAA-Dd80WtF2EASy5FPpRs-BZni-TKNGC_Vafx8VU/exec",
    // Configuração de compatibilidade retroativa
    spreadsheetId: "2PACX-1vQKvZtpO0WW7vqeOMvJpmFbDoh8K2F0h0SSI5t3S1LiI7Ag1nQpGJi3CkDkeGxrULkk4UxSLjrhTd1e", 
    tabGids: {
      game: "1971530026", // Separador 1: Serious Game (Tallentto) + Dados Demográficos
      sim: "1882859537",   // Separador 2: Simulador RENOVATE (Virmedex)
      global: "914346842"  // Separador 3: Avaliação Global (NPS + Síntese)
    },

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

// Estrutura multilingue do Questionário (Q1 a Q30)
const enQuestionnaireData = [
  // SECTION A: Profile & Digital Literacy
  { id: "Q1", section: "A", sectionTitle: "Section A: Profile & Digital Literacy", type: "Single Choice",
    question: "What is your main professional profile?",
    options: ["Farmer / Grower", "Agricultural Advisor / Technician", "Trainer / Agricultural Education Professional", "Industry Representative (Machinery / Agrochemicals)", "Regulator / Public Administration", "Student", "Researcher", "Other"] },
  { id: "Q2", section: "A", sectionTitle: "Section A: Profile & Digital Literacy", type: "Open Question",
    question: "What is your age?", options: ["Open numerical input (Age in years)"] },
  { id: "Q3", section: "A", sectionTitle: "Section A: Profile & Digital Literacy", type: "Single Choice",
    question: "What is your gender?", options: ["Female", "Male", "Prefer not to say"] },
  { id: "Q4", section: "A", sectionTitle: "Section A: Profile & Digital Literacy", type: "Single Choice",
    question: "In which country are you participating in this Focus Group?",
    options: ["Portugal", "Spain", "France", "Italy", "Belgium", "Poland"] },
  { id: "Q5", section: "A", sectionTitle: "Section A: Profile & Digital Literacy", type: "Multiple Choice",
    question: "Which crops are you most involved with in your professional activity? (select all that apply)",
    options: ["Vineyards", "Orchards (Pome / Stone fruit)", "Olive groves", "Citrus", "Cereals / Arable crops", "Vegetables / Horticulture"] },
  { id: "Q6", section: "A", sectionTitle: "Section A: Profile & Digital Literacy", type: "Likert Scale (1 to 5)",
    question: "How comfortable do you currently feel using digital tools and precision agriculture software in your daily activities?",
    options: ["(1) - Very uncomfortable", "(2) - Uncomfortable", "(3) - Neither comfortable nor uncomfortable", "(4) - Comfortable", "(5) - Very comfortable"] },

  // SECTION B: Serious Game - Sprayer Calibration
  { id: "Q7", section: "B", sectionTitle: "Section B: Serious Game (Sprayer Calibration)", type: "Likert Scale (1 to 5)",
    question: "How clear were the explanations provided after each answer (both correct and incorrect)?",
    options: ["(1) - Not clear at all", "(2) - Slightly clear", "(3) - Moderately clear", "(4) - Clear", "(5) - Very clear"] },
  { id: "Q8", section: "B", sectionTitle: "Section B: Serious Game (Sprayer Calibration)", type: "Likert Scale (1 to 5)",
    question: "How would you rate the difficulty level of the questions for someone with your experience level?",
    options: ["(1) - Too easy", "(2) - Somewhat easy", "(3) - Adequate", "(4) - Somewhat difficult", "(5) - Too difficult"] },
  { id: "Q9", section: "B", sectionTitle: "Section B: Serious Game (Sprayer Calibration)", type: "Likert Scale (1 to 5)",
    question: "Did the scenarios feel realistic and representative of real field situations?",
    options: ["(1) - Not realistic at all", "(2) - Slightly realistic", "(3) - Moderately realistic", "(4) - Realistic", "(5) - Very realistic"] },
  { id: "Q10", section: "B", sectionTitle: "Section B: Serious Game (Sprayer Calibration)", type: "Likert Scale (1 to 5)",
    question: "How useful was this module for reinforcing the key calibration steps it covers (nozzle selection, working width, forward speed, flow rate, verification)?",
    options: ["(1) - Not useful at all", "(2) - Slightly useful", "(3) - Moderately useful", "(4) - Useful", "(5) - Very useful"] },
  { id: "Q11", section: "B", sectionTitle: "Section B: Serious Game (Sprayer Calibration)", type: "Likert Scale (1 to 5)",
    question: "How engaging did you find the quiz-style format of this module?",
    options: ["(1) - Not engaging at all", "(2) - Slightly engaging", "(3) - Moderately engaging", "(4) - Engaging", "(5) - Very engaging"] },
  { id: "Q12", section: "B", sectionTitle: "Section B: Serious Game (Sprayer Calibration)", type: "Likert Scale (1 to 5)",
    question: "Overall, did the Serious Game meet your expectations as a fast-paced learning tool?",
    options: ["(1) - Falls entirely short of expectations", "(2) - Falls slightly short of expectations", "(3) - Meets expectations", "(4) - Exceeds expectations", "(5) - Greatly exceeds expectations"] },
  { id: "Q13", section: "B", sectionTitle: "Section B: Serious Game (Sprayer Calibration)", type: "SUS Scale (10 Statements)",
    question: "System Usability Scale (SUS) - Serious Game (Rate agreement on scale 1 to 5: Strongly Disagree to Strongly Agree)",
    options: [
      "1. I think that I would like to use this tool frequently.",
      "2. I found this tool unnecessarily complex.",
      "3. I thought this tool was easy to use.",
      "4. I think that I would need the support of a technical person to be able to use this tool.",
      "5. I found the various functions in this tool were well integrated.",
      "6. I thought there was too much inconsistency in this tool.",
      "7. I would imagine that most people would learn to use this tool very quickly.",
      "8. I found this tool very cumbersome to use.",
      "9. I felt very confident using this tool.",
      "10. I needed to learn a lot of things before I could get going with this tool."
    ] },
  { id: "Q14", section: "B", sectionTitle: "Section B: Serious Game (Sprayer Calibration)", type: "Open Question",
    question: "What, if anything, was confusing, missing, or did not reflect real practice in this module?",
    options: ["Open textual feedback (Suggestions, missing elements, realism issues)"] },

  // SECTION C: The RENOVATE Simulator
  { id: "Q15", section: "C", sectionTitle: "Section C: RENOVATE Simulator", type: "Likert Scale (1 to 5)",
    question: "How easy was it to learn the basic controls and navigate the simulator environment?",
    options: ["(1) - Very difficult", "(2) - Difficult", "(3) - Neither easy nor difficult", "(4) - Easy", "(5) - Very easy"] },
  { id: "Q16", section: "C", sectionTitle: "Section C: RENOVATE Simulator", type: "Likert Scale (1 to 5)",
    question: "Were the on-screen instructions, tutorials and menus clear and well contextualised?",
    options: ["(1) - Not clear at all", "(2) - Slightly clear", "(3) - Moderately clear", "(4) - Clear", "(5) - Very clear"] },
  { id: "Q17", section: "C", sectionTitle: "Section C: RENOVATE Simulator", type: "Likert Scale (1 to 5)",
    question: "How pedagogically effective was the way practical tasks were presented?",
    options: ["(1) - Not effective at all", "(2) - Slightly effective", "(3) - Moderately effective", "(4) - Effective", "(5) - Very effective"] },
  { id: "Q18", section: "C", sectionTitle: "Section C: RENOVATE Simulator", type: "Likert Scale (1 to 5)",
    question: "Did the simulator clearly reflect the correct decision-making sequence for sprayer calibration?",
    options: ["(1) - Very confusing", "(2) - Confusing", "(3) - Neither confusing nor clear", "(4) - Clear", "(5) - Very clear"] },
  { id: "Q19", section: "C", sectionTitle: "Section C: RENOVATE Simulator", type: "Likert Scale (1 to 5)",
    question: "How clear was the calculation task (e.g. flow rate, working width) when you had to input values using mathematical formulas?",
    options: ["(1) - Very confusing", "(2) - Confusing", "(3) - Neither confusing nor clear", "(4) - Clear", "(5) - Very clear"] },
  { id: "Q20", section: "C", sectionTitle: "Section C: RENOVATE Simulator", type: "Likert Scale (1 to 5)",
    question: "Did the nozzle configuration and spray volume-setting exercises accurately reflect real-world calibration challenges?",
    options: ["(1) - Not accurate at all", "(2) - Slightly accurate", "(3) - Moderately accurate", "(4) - Accurate", "(5) - Very accurate"] },
  { id: "Q21", section: "C", sectionTitle: "Section C: RENOVATE Simulator", type: "Likert Scale (1 to 5)",
    question: "How realistic was the product-selection and label-reading step before application?",
    options: ["(1) - Not realistic at all", "(2) - Slightly realistic", "(3) - Moderately realistic", "(4) - Realistic", "(5) - Very realistic"] },
  { id: "Q22", section: "C", sectionTitle: "Section C: RENOVATE Simulator", type: "Likert Scale (1 to 5)",
    question: "Do the variables and parameters used (environmental factors, field conditions, equipment settings) reflect realistic field scenarios?",
    options: ["(1) - Not realistic at all", "(2) - Slightly realistic", "(3) - Moderately realistic", "(4) - Realistic", "(5) - Very realistic"] },
  { id: "Q23", section: "C", sectionTitle: "Section C: RENOVATE Simulator", type: "Likert Scale (1 to 5)",
    question: "Overall, did the RENOVATE Simulator meet your expectations as a digital training tool for crop protection?",
    options: ["(1) - Falls entirely short of expectations", "(2) - Falls slightly short of expectations", "(3) - Meets expectations", "(4) - Exceeds expectations", "(5) - Greatly exceeds expectations"] },
  { id: "Q24", section: "C", sectionTitle: "Section C: RENOVATE Simulator", type: "SUS Scale (10 Statements)",
    question: "System Usability Scale (SUS) - RENOVATE Simulator (Rate agreement on scale 1 to 5: Strongly Disagree to Strongly Agree)",
    options: [
      "1. I think that I would like to use this tool frequently.",
      "2. I found this tool unnecessarily complex.",
      "3. I thought this tool was easy to use.",
      "4. I think that I would need the support of a technical person to be able to use this tool.",
      "5. I found the various functions in this tool were well integrated.",
      "6. I thought there was too much inconsistency in this tool.",
      "7. I would imagine that most people would learn to use this tool very quickly.",
      "8. I found this tool very cumbersome to use.",
      "9. I felt very confident using this tool.",
      "10. I needed to learn a lot of things before I could get going with this tool."
    ] },
  { id: "Q25", section: "C", sectionTitle: "Section C: RENOVATE Simulator", type: "Open Question",
    question: "What, if anything, was confusing, missing, or did not reflect real practice in the simulator?",
    options: ["Open textual feedback (Controls, 3D physics, realism issues)"] },

  // SECTION D: Global Evaluation
  { id: "Q26", section: "D", sectionTitle: "Section D: Global Evaluation", type: "Open Question",
    question: "In your own words, how effective was the RENOVATE platform in helping you learn and understand the topics covered today?",
    options: ["Open textual feedback"] },
  { id: "Q27", section: "D", sectionTitle: "Section D: Global Evaluation", type: "Open Question",
    question: "Did completing the tasks feel efficient that is, without unnecessary effort or time?",
    options: ["Open textual feedback"] },
  { id: "Q28", section: "D", sectionTitle: "Section D: Global Evaluation", type: "Open Question",
    question: "Overall, how satisfied are you with your learning experience today? Please explain why.",
    options: ["Open textual feedback"] },
  { id: "Q29", section: "D", sectionTitle: "Section D: Global Evaluation", type: "Likert Scale (1 to 5)",
    question: "Based on your experience today, how likely are you to recommend the RENOVATE digital training platform to a colleague or fellow agricultural professional?",
    options: ["(1) - Not at all likely", "(2) - Slightly likely", "(3) - Moderately likely", "(4) - Very likely", "(5) - Extremely likely"] },
  { id: "Q30", section: "D", sectionTitle: "Section D: Global Evaluation", type: "Open Question",
    question: "Please share the main errors, bugs, or blockages you encountered, and what improvements you would strongly suggest for the final version.",
    options: ["Open textual feedback (Bugs, navigation errors, suggested enhancements)"] }
];

RENOVATE_CONFIG.questionnaireData = {
  "en-GB": enQuestionnaireData,
  "pt-PT": [
    // SECÇÃO A: Perfil e Literacia Digital
    { id: "Q1", section: "A", sectionTitle: "Secção A: Perfil e Literacia Digital", type: "Escolha Única",
      question: "Qual é o seu perfil profissional principal?",
      options: ["Agricultor / Produtor", "Técnico / Consultor Agrícola", "Formador / Profissional de Educação Agrícola", "Representante da Indústria (Máquinas / Produtos Fitofarmacêuticos)", "Regulador / Administração Pública", "Estudante", "Investigador", "Outro"] },
    { id: "Q2", section: "A", sectionTitle: "Secção A: Perfil e Literacia Digital", type: "Resposta Aberta",
      question: "Qual é a sua idade?",
      options: ["Introdução numérica aberta (Idade em anos)"] },
    { id: "Q3", section: "A", sectionTitle: "Secção A: Perfil e Literacia Digital", type: "Escolha Única",
      question: "Qual é o seu género?",
      options: ["Feminino", "Masculino", "Prefiro não dizer"] },
    { id: "Q4", section: "A", sectionTitle: "Secção A: Perfil e Literacia Digital", type: "Escolha Única",
      question: "Em que país está a participar neste Grupo Focal?",
      options: ["Portugal", "Espanha", "França", "Itália", "Bélgica", "Polónia"] },
    { id: "Q5", section: "A", sectionTitle: "Secção A: Perfil e Literacia Digital", type: "Escolha Múltipla",
      question: "Com que culturas está mais envolvido na sua atividade profissional? (selecione todas as aplicáveis)",
      options: ["Vinhas", "Pomares (Frutos de caroço / pevides)", "Olival", "Citrinos", "Cereais / Culturas arvenses", "Hortícolas / Horticultura"] },
    { id: "Q6", section: "A", sectionTitle: "Secção A: Perfil e Literacia Digital", type: "Escala Likert (1 a 5)",
      question: "Quão confortável se sente atualmente a utilizar ferramentas digitais e software de agricultura de precisão nas suas atividades diárias?",
      options: ["(1) - Muito desconfortável", "(2) - Desconfortável", "(3) - Nem confortável nem desconfortável", "(4) - Confortável", "(5) - Muito confortável"] },

    // SECÇÃO B: Serious Game (Calibração do Pulverizador)
    { id: "Q7", section: "B", sectionTitle: "Secção B: Serious Game (Calibração do Pulverizador)", type: "Escala Likert (1 a 5)",
      question: "Quão claras foram as explicações fornecidas após cada resposta (tanto corretas como incorretas)?",
      options: ["(1) - Nada claras", "(2) - Pouco claras", "(3) - Moderadamente claras", "(4) - Claras", "(5) - Muito claras"] },
    { id: "Q8", section: "B", sectionTitle: "Secção B: Serious Game (Calibração do Pulverizador)", type: "Escala Likert (1 a 5)",
      question: "Como classificaria o nível de dificuldade das perguntas para alguém com o seu nível de experiência?",
      options: ["(1) - Muito fácil", "(2) - Um pouco fácil", "(3) - Adequado", "(4) - Um pouco difícil", "(5) - Muito difícil"] },
    { id: "Q9", section: "B", sectionTitle: "Secção B: Serious Game (Calibração do Pulverizador)", type: "Escala Likert (1 a 5)",
      question: "Os cenários pareceram realistas e representativos de situações reais de campo?",
      options: ["(1) - Nada realistas", "(2) - Pouco realistas", "(3) - Moderadamente realistas", "(4) - Realistas", "(5) - Muito realistas"] },
    { id: "Q10", section: "B", sectionTitle: "Secção B: Serious Game (Calibração do Pulverizador)", type: "Escala Likert (1 a 5)",
      question: "Quão útil foi este módulo para reforçar as etapas-chave de calibração que abrange (seleção de bicos, largura de trabalho, velocidade de avanço, débito, verificação)?",
      options: ["(1) - Nada útil", "(2) - Pouco útil", "(3) - Moderadamente útil", "(4) - Útil", "(5) - Muito útil"] },
    { id: "Q11", section: "B", sectionTitle: "Secção B: Serious Game (Calibração do Pulverizador)", type: "Escala Likert (1 a 5)",
      question: "Quão envolvente considerou o formato estilo quiz deste módulo?",
      options: ["(1) - Nada envolvente", "(2) - Pouco envolvente", "(3) - Moderadamente envolvente", "(4) - Envolvente", "(5) - Muito envolvente"] },
    { id: "Q12", section: "B", sectionTitle: "Secção B: Serious Game (Calibração do Pulverizador)", type: "Escala Likert (1 a 5)",
      question: "No geral, o Serious Game correspondeu às suas expectativas como uma ferramenta de aprendizagem rápida?",
      options: ["(1) - Ficou totalmente abaixo das expectativas", "(2) - Ficou ligeiramente abaixo das expectativas", "(3) - Correspondeu às expectativas", "(4) - Superou as expectativas", "(5) - Superou largamente as expectativas"] },
    { id: "Q13", section: "B", sectionTitle: "Secção B: Serious Game (Calibração do Pulverizador)", type: "Escala SUS (10 Afirmações)",
      question: "Escala de Usabilidade do Sistema (SUS) - Serious Game (Classifique a concordância numa escala de 1 a 5: Discordo Totalmente a Concordo Totalmente)",
      options: [
        "1. Penso que gostaria de utilizar esta ferramenta com frequência.",
        "2. Achei esta ferramenta desnecessariamente complexa.",
        "3. Achei esta ferramenta fácil de utilizar.",
        "4. Acho que precisaria do apoio de uma pessoa técnica para conseguir utilizar esta ferramenta.",
        "5. Achei que as várias funções desta ferramenta estavam bem integradas.",
        "6. Achei que havia demasiada inconsistência nesta ferramenta.",
        "7. Imagino que a maioria das pessoas aprenderia a utilizar esta ferramenta muito rapidamente.",
        "8. Achei esta ferramenta muito incómoda/pesada de utilizar.",
        "9. Senti-me muito confiante ao utilizar esta ferramenta.",
        "10. Precisei de aprender muitas coisas antes de conseguir começar a trabalhar com esta ferramenta."
      ] },
    { id: "Q14", section: "B", sectionTitle: "Secção B: Serious Game (Calibração do Pulverizador)", type: "Resposta Aberta",
      question: "O que, se houve algo, foi confuso, ficou em falta ou não refletiu a prática real neste módulo?",
      options: ["Feedback textual aberto (Sugestões, elementos em falta, aspetos de realismo)"] },

    // SECÇÃO C: Simulador RENOVATE
    { id: "Q15", section: "C", sectionTitle: "Secção C: Simulador RENOVATE", type: "Escala Likert (1 a 5)",
      question: "Quão fácil foi aprender os comandos básicos e navegar no ambiente do simulador?",
      options: ["(1) - Muito difícil", "(2) - Difícil", "(3) - Nem fácil nem difícil", "(4) - Fácil", "(5) - Muito fácil"] },
    { id: "Q16", section: "C", sectionTitle: "Secção C: Simulador RENOVATE", type: "Escala Likert (1 a 5)",
      question: "As instruções no ecrã, tutoriais e menus foram claros e bem contextualizados?",
      options: ["(1) - Nada claros", "(2) - Pouco claros", "(3) - Moderadamente claros", "(4) - Claros", "(5) - Muito claros"] },
    { id: "Q17", section: "C", sectionTitle: "Secção C: Simulador RENOVATE", type: "Escala Likert (1 a 5)",
      question: "Quão eficaz pedagogicamente foi a forma como as tarefas práticas foram apresentadas?",
      options: ["(1) - Nada eficaz", "(2) - Pouco eficaz", "(3) - Moderadamente eficaz", "(4) - Eficaz", "(5) - Muito eficaz"] },
    { id: "Q18", section: "C", sectionTitle: "Secção C: Simulador RENOVATE", type: "Escala Likert (1 a 5)",
      question: "O simulador refletiu claramente a sequência correta de tomada de decisão para a calibração do pulverizador?",
      options: ["(1) - Muito confuso", "(2) - Confuso", "(3) - Nem confuso nem claro", "(4) - Claro", "(5) - Muito claro"] },
    { id: "Q19", section: "C", sectionTitle: "Secção C: Simulador RENOVATE", type: "Escala Likert (1 a 5)",
      question: "Quão clara foi a tarefa de cálculo (ex.: débito, largura de trabalho) quando teve de introduzir valores utilizando fórmulas matemáticas?",
      options: ["(1) - Muito confuso", "(2) - Confuso", "(3) - Nem confuso nem claro", "(4) - Claro", "(5) - Muito claro"] },
    { id: "Q20", section: "C", sectionTitle: "Secção C: Simulador RENOVATE", type: "Escala Likert (1 a 5)",
      question: "Os exercícios de configuração de bicos e definição do volume de calda refletiram com precisão os desafios reais de calibração?",
      options: ["(1) - Nada precisos", "(2) - Pouco precisos", "(3) - Moderadamente precisos", "(4) - Precisos", "(5) - Muito precisos"] },
    { id: "Q21", section: "C", sectionTitle: "Secção C: Simulador RENOVATE", type: "Escala Likert (1 a 5)",
      question: "Quão realista foi a etapa de seleção de produtos e leitura de rótulos antes da aplicação?",
      options: ["(1) - Nada realista", "(2) - Pouco realista", "(3) - Moderadamente realista", "(4) - Realista", "(5) - Muito realista"] },
    { id: "Q22", section: "C", sectionTitle: "Secção C: Simulador RENOVATE", type: "Escala Likert (1 a 5)",
      question: "As variáveis e parâmetros utilizados (fatores ambientais, condições de campo, regulações do equipamento) refletem cenários reais de campo?",
      options: ["(1) - Nada realistas", "(2) - Pouco realistas", "(3) - Moderadamente realistas", "(4) - Realistas", "(5) - Muito realistas"] },
    { id: "Q23", section: "C", sectionTitle: "Secção C: Simulador RENOVATE", type: "Escala Likert (1 a 5)",
      question: "No geral, o Simulador RENOVATE correspondeu às suas expectativas como ferramenta de formação digital para a proteção das culturas?",
      options: ["(1) - Ficou totalmente abaixo das expectativas", "(2) - Ficou ligeiramente abaixo das expectativas", "(3) - Correspondeu às expectativas", "(4) - Superou as expectativas", "(5) - Superou largamente as expectativas"] },
    { id: "Q24", section: "C", sectionTitle: "Secção C: Simulador RENOVATE", type: "Escala SUS (10 Afirmações)",
      question: "Escala de Usabilidade do Sistema (SUS) - Simulador RENOVATE (Classifique a concordância numa escala de 1 a 5: Discordo Totalmente a Concordo Totalmente)",
      options: [
        "1. Penso que gostaria de utilizar esta ferramenta com frequência.",
        "2. Achei esta ferramenta desnecessariamente complexa.",
        "3. Achei esta ferramenta fácil de utilizar.",
        "4. Acho que precisaria do apoio de uma pessoa técnica para conseguir utilizar esta ferramenta.",
        "5. Achei que as várias funções desta ferramenta estavam bem integradas.",
        "6. Achei que havia demasiada inconsistência nesta ferramenta.",
        "7. Imagino que a maioria das pessoas aprenderia a utilizar esta ferramenta muito rapidamente.",
        "8. Achei esta ferramenta muito incómoda/pesada de utilizar.",
        "9. Senti-me muito confiante ao utilizar esta ferramenta.",
        "10. Precisei de aprender muitas coisas antes de conseguir começar a trabalhar com esta ferramenta."
      ] },
    { id: "Q25", section: "C", sectionTitle: "Secção C: Simulador RENOVATE", type: "Resposta Aberta",
      question: "O que, se houve algo, foi confuso, ficou em falta ou não refletiu a prática real no simulador?",
      options: ["Feedback textual aberto (Controlos, física 3D, questões de realismo)"] },

    // SECÇÃO D: Avaliação Global
    { id: "Q26", section: "D", sectionTitle: "Secção D: Avaliação Global", type: "Resposta Aberta",
      question: "Nas suas próprias palavras, quão eficaz foi a plataforma RENOVATE a ajudá-lo a aprender e compreender os tópicos abordados hoje?",
      options: ["Feedback textual aberto"] },
    { id: "Q27", section: "D", sectionTitle: "Secção D: Avaliação Global", type: "Resposta Aberta",
      question: "A conclusão das tarefas pareceu eficiente — isto é, sem esforço ou tempo desnecessários?",
      options: ["Feedback textual aberto"] },
    { id: "Q28", section: "D", sectionTitle: "Secção D: Avaliação Global", type: "Resposta Aberta",
      question: "No geral, quão satisfeito está com a sua experiência de aprendizagem de hoje? Por favor, explique porquê.",
      options: ["Feedback textual aberto"] },
    { id: "Q29", section: "D", sectionTitle: "Secção D: Avaliação Global", type: "Escala Likert (1 a 5)",
      question: "Com base na sua experiência de hoje, qual a probabilidade de recomendar a plataforma de formação digital RENOVATE a um colega ou profissional do setor agrícola?",
      options: ["(1) - Nada provável", "(2) - Pouco provável", "(3) - Moderadamente provável", "(4) - Muito provável", "(5) - Extremamente provável"] },
    { id: "Q30", section: "D", sectionTitle: "Secção D: Avaliação Global", type: "Resposta Aberta",
      question: "Por favor, partilhe os principais erros, anomalias ou bloqueios que encontrou e que melhorias sugeriria fortemente para a versão final.",
      options: ["Feedback textual aberto (Erros, anomalias de navegação, melhorias sugeridas)"] }
  ]
};

RENOVATE_CONFIG.questionnaireData["it-IT"] = [
  // SEZIONE A: Profilo e Competenze Digitali
  { id: "Q1", section: "A", sectionTitle: "Sezione A: Profilo e Competenze Digitali", type: "Scelta Singola",
    question: "Qual è il tuo profilo professionale principale?",
    options: ["Agricoltore / Produttore", "Tecnico / Consulente agricolo", "Formatore / Professionista dell'istruzione agraria", "Rappresentante dell'industria (Macchine / Prodotti fitosanitari)", "Autorità di regolamentazione / Pubblica amministrazione", "Studente", "Ricercatore", "Altro"] },
  { id: "Q2", section: "A", sectionTitle: "Sezione A: Profilo e Competenze Digitali", type: "Risposta Aperta",
    question: "Qual è la tua età?",
    options: ["Inserimento numerico aperto (Età in anni)"] },
  { id: "Q3", section: "A", sectionTitle: "Sezione A: Profilo e Competenze Digitali", type: "Scelta Singola",
    question: "Qual è il tuo genere?",
    options: ["Femminile", "Maschile", "Preferisco non specificare"] },
  { id: "Q4", section: "A", sectionTitle: "Sezione A: Profilo e Competenze Digitali", type: "Scelta Singola",
    question: "In quale paese partecipi a questo Focus Group?",
    options: ["Portogallo", "Spagna", "Francia", "Italia", "Belgio", "Polonia"] },
  { id: "Q5", section: "A", sectionTitle: "Sezione A: Profilo e Competenze Digitali", type: "Scelta Multipla",
    question: "Di quali colture ti occupi maggiormente nella tua attività professionale? (seleziona tutte le opzioni applicabili)",
    options: ["Vigneti", "Frutteti (Frutti a granella / a nocciolo)", "Oliveti", "Agrumeti", "Cereali / Seminativi", "Orticole / Orticoltura"] },
  { id: "Q6", section: "A", sectionTitle: "Sezione A: Profilo e Competenze Digitali", type: "Scala Likert (da 1 a 5)",
    question: "Quanto ti senti a tuo agio nell'utilizzare strumenti digitali e software per l'agricoltura di precisione nelle tue attività quotidiane?",
    options: ["(1) - Molto a disagio", "(2) - A disagio", "(3) - Né a mio agio né a disagio", "(4) - A mio agio", "(5) - Molto a mio agio"] },

  // SEZIONE B: Serious Game (Taratura dell'Irroratrice)
  { id: "Q7", section: "B", sectionTitle: "Sezione B: Serious Game (Taratura dell'Irroratrice)", type: "Scala Likert (da 1 a 5)",
    question: "Quanto sono state chiare le spiegazioni fornite dopo ciascuna risposta (sia corretta che errata)?",
    options: ["(1) - Per nulla chiare", "(2) - Poco chiare", "(3) - Moderatamente chiare", "(4) - Chiare", "(5) - Molto chiare"] },
  { id: "Q8", section: "B", sectionTitle: "Sezione B: Serious Game (Taratura dell'Irroratrice)", type: "Scala Likert (da 1 a 5)",
    question: "Come valuteresti il livello di difficoltà delle domande per una persona con il tuo livello di esperienza?",
    options: ["(1) - Troppo facile", "(2) - Abbastanza facile", "(3) - Adeguato", "(4) - Abbastanza difficile", "(5) - Troppo difficile"] },
  { id: "Q9", section: "B", sectionTitle: "Sezione B: Serious Game (Taratura dell'Irroratrice)", type: "Scala Likert (da 1 a 5)",
    question: "Gli scenari sono sembrati realistici e rappresentativi delle reali situazioni di campo?",
    options: ["(1) - Per nulla realistici", "(2) - Poco realistici", "(3) - Moderatamente realistici", "(4) - Realistici", "(5) - Molto realistici"] },
  { id: "Q10", section: "B", sectionTitle: "Sezione B: Serious Game (Taratura dell'Irroratrice)", type: "Scala Likert (da 1 a 5)",
    question: "Quanto è stato utile questo modulo per rafforzare le fasi chiave di taratura trattate (scelta degli ugelli, larghezza di lavoro, velocità di avanzamento, portata, verifica)?",
    options: ["(1) - Per nulla utile", "(2) - Poco utile", "(3) - Moderatamente utile", "(4) - Utile", "(5) - Molto utile"] },
  { id: "Q11", section: "B", sectionTitle: "Sezione B: Serious Game (Taratura dell'Irroratrice)", type: "Scala Likert (da 1 a 5)",
    question: "Quanto hai trovato coinvolgente il formato in stile quiz di questo modulo?",
    options: ["(1) - Per nulla coinvolgente", "(2) - Poco coinvolgente", "(3) - Moderatamente coinvolgente", "(4) - Coinvolgente", "(5) - Molto coinvolgente"] },
  { id: "Q12", section: "B", sectionTitle: "Sezione B: Serious Game (Taratura dell'Irroratrice)", type: "Scala Likert (da 1 a 5)",
    question: "Nel complesso, il Serious Game ha soddisfatto le tue aspettative come strumento di apprendimento rapido?",
    options: ["(1) - Completamente al di sotto delle aspettative", "(2) - Leggermente al di sotto delle aspettative", "(3) - Ha soddisfatto le aspettative", "(4) - Ha superato le aspettative", "(5) - Ha ampiamente superato le aspettative"] },
  { id: "Q13", section: "B", sectionTitle: "Sezione B: Serious Game (Taratura dell'Irroratrice)", type: "Scala SUS (10 Affermazioni)",
    question: "System Usability Scale (SUS) - Serious Game (Valuta il grado di accordo su scala da 1 a 5: Fortemente in disaccordo a Fortemente d'accordo)",
    options: [
      "1. Penso che mi piacerebbe usare frequentemente questo strumento.",
      "2. Ho trovato questo strumento inutilmente complesso.",
      "3. Ho pensato che questo strumento fosse facile da usare.",
      "4. Penso che avrei bisogno del supporto di una persona tecnica per poter usare questo strumento.",
      "5. Ho trovato che le varie funzioni di questo strumento fossero ben integrate.",
      "6. Ho riscontrato troppa incoerenza in questo strumento.",
      "7. Immagino che la maggior parte delle persone imparerebbe a usare questo strumento molto rapidamente.",
      "8. Ho trovato questo strumento molto ingombrante/scomodo da usare.",
      "9. Mi sono sentito molto sicuro nell'usare questo strumento.",
      "10. Ho dovuto imparare molte cose prima di poter iniziare a utilizzare questo strumento."
    ] },
  { id: "Q14", section: "B", sectionTitle: "Sezione B: Serious Game (Taratura dell'Irroratrice)", type: "Risposta Aperta",
    question: "Cosa, se c'è stato qualcosa, è risultato confuso, mancante o non rispecchiava la reale pratica in questo modulo?",
    options: ["Feedback testuale aperto (Suggerimenti, elementi mancanti, aspetti di realismo)"] },

  // SEZIONE C: Simulatore RENOVATE
  { id: "Q15", section: "C", sectionTitle: "Sezione C: Simulatore RENOVATE", type: "Scala Likert (da 1 a 5)",
    question: "Quanto è stato facile apprendere i comandi di base e navigare nell'ambiente del simulatore?",
    options: ["(1) - Molto difficile", "(2) - Difficile", "(3) - Né facile né difficile", "(4) - Facile", "(5) - Molto facile"] },
  { id: "Q16", section: "C", sectionTitle: "Sezione C: Simulatore RENOVATE", type: "Scala Likert (da 1 a 5)",
    question: "Le istruzioni sullo schermo, i tutorial e i menu erano chiari e ben contestualizzati?",
    options: ["(1) - Per nulla chiari", "(2) - Poco chiari", "(3) - Moderatamente chiari", "(4) - Chiari", "(5) - Molto chiari"] },
  { id: "Q17", section: "C", sectionTitle: "Sezione C: Simulatore RENOVATE", type: "Scala Likert (da 1 a 5)",
    question: "Quanto è stato pedagogicamente efficace il modo in cui sono state presentate le attività pratiche?",
    options: ["(1) - Per nulla efficace", "(2) - Poco efficace", "(3) - Moderatamente efficace", "(4) - Efficace", "(5) - Molto efficace"] },
  { id: "Q18", section: "C", sectionTitle: "Sezione C: Simulatore RENOVATE", type: "Scala Likert (da 1 a 5)",
    question: "Il simulatore ha rispecchiato chiaramente la corretta sequenza decisionale per la taratura dell'irroratrice?",
    options: ["(1) - Molto confuso", "(2) - Confuso", "(3) - Né confuso né chiaro", "(4) - Chiaro", "(5) - Molto chiaro"] },
  { id: "Q19", section: "C", sectionTitle: "Sezione C: Simulatore RENOVATE", type: "Scala Likert (da 1 a 5)",
    question: "Quanto è stato chiaro il compito di calcolo (es. portata, larghezza di lavoro) quando hai dovuto inserire valori utilizzando formule matematiche?",
    options: ["(1) - Molto confuso", "(2) - Confuso", "(3) - Né confuso né chiaro", "(4) - Chiaro", "(5) - Molto chiaro"] },
  { id: "Q20", section: "C", sectionTitle: "Sezione C: Simulatore RENOVATE", type: "Scala Likert (da 1 a 5)",
    question: "Gli esercizi di configurazione degli ugelli e di impostazione del volume di miscela hanno rispecchiato accuratamente le sfide reali della taratura?",
    options: ["(1) - Per nulla accurati", "(2) - Poco accurati", "(3) - Moderatamente accurati", "(4) - Accurati", "(5) - Molto accurati"] },
  { id: "Q21", section: "C", sectionTitle: "Sezione C: Simulatore RENOVATE", type: "Scala Likert (da 1 a 5)",
    question: "Quanto è stata realistica la fase di selezione del prodotto e di lettura dell'etichetta prima dell'applicazione?",
    options: ["(1) - Per nulla realistica", "(2) - Poco realistica", "(3) - Moderatamente realistica", "(4) - Realistica", "(5) - Molto realistica"] },
  { id: "Q22", section: "C", sectionTitle: "Sezione C: Simulatore RENOVATE", type: "Scala Likert (da 1 a 5)",
    question: "Le variabili e i parametri utilizzati (fattori ambientali, condizioni di campo, impostazioni dell'attrezzatura) rispecchiano scenari reali di campo?",
    options: ["(1) - Per nulla realistici", "(2) - Poco realistici", "(3) - Moderatamente realistici", "(4) - Realistici", "(5) - Molto realistici"] },
  { id: "Q23", section: "C", sectionTitle: "Sezione C: Simulatore RENOVATE", type: "Scala Likert (da 1 a 5)",
    question: "Nel complesso, il Simulatore RENOVATE ha soddisfatto le tue aspettative come strumento di formazione digitale per la difesa delle colture?",
    options: ["(1) - Completamente al di sotto delle aspettative", "(2) - Leggermente al di sotto delle aspettative", "(3) - Ha soddisfatto le aspettative", "(4) - Ha superato le aspettative", "(5) - Ha ampiamente superato le aspettative"] },
  { id: "Q24", section: "C", sectionTitle: "Sezione C: Simulatore RENOVATE", type: "Scala SUS (10 Affermazioni)",
    question: "System Usability Scale (SUS) - Simulatore RENOVATE (Valuta il grado di accordo su scala da 1 a 5: Fortemente in disaccordo a Fortemente d'accordo)",
    options: [
      "1. Penso che mi piacerebbe usare frequentemente questo strumento.",
      "2. Ho trovato questo strumento inutilmente complesso.",
      "3. Ho pensato che questo strumento fosse facile da usare.",
      "4. Penso che avrei bisogno del supporto di una persona tecnica per poter usare questo strumento.",
      "5. Ho trovato che le varie funzioni di questo strumento fossero ben integrate.",
      "6. Ho riscontrato troppa incoerenza in questo strumento.",
      "7. Immagino che la maggior parte delle persone imparerebbe a usare questo strumento molto rapidamente.",
      "8. Ho trovato questo strumento molto ingombrante/scomodo da usare.",
      "9. Mi sono sentito molto sicuro nell'usare questo strumento.",
      "10. Ho dovuto imparare molte cose prima di poter iniziare a utilizzare questo strumento."
    ] },
  { id: "Q25", section: "C", sectionTitle: "Sezione C: Simulatore RENOVATE", type: "Risposta Aperta",
    question: "Cosa, se c'è stato qualcosa, è risultato confuso, mancante o non rispecchiava la reale pratica nel simulatore?",
    options: ["Feedback testuale aperto (Comandi, fisica 3D, aspetti di realismo)"] },

  // SEZIONE D: Valutazione Globale
  { id: "Q26", section: "D", sectionTitle: "Sezione D: Valutazione Globale", type: "Risposta Aperta",
    question: "Con parole tue, quanto è stata efficace la piattaforma RENOVATE nell'aiutarti ad apprendere e comprendere gli argomenti trattati oggi?",
    options: ["Feedback testuale aperto"] },
  { id: "Q27", section: "D", sectionTitle: "Sezione D: Valutazione Globale", type: "Risposta Aperta",
    question: "Lo svolgimento dei compiti è sembrato efficiente, vale a dire senza sforzi o tempi inutili?",
    options: ["Feedback testuale aperto"] },
  { id: "Q28", section: "D", sectionTitle: "Sezione D: Valutazione Globale", type: "Risposta Aperta",
    question: "Nel complesso, quanto sei soddisfatto della tua esperienza di apprendimento oggi? Si prega di spiegare il motivo.",
    options: ["Feedback testuale aperto"] },
  { id: "Q29", section: "D", sectionTitle: "Sezione D: Valutazione Globale", type: "Scala Likert (da 1 a 5)",
    question: "In base alla tua esperienza odierna, con quale probabilità raccomanderesti la piattaforma di formazione digitale RENOVATE a un collega o a un professionista del settore agricolo?",
    options: ["(1) - Per nulla probabile", "(2) - Poco probabile", "(3) - Moderatamente probabile", "(4) - Molto probabile", "(5) - Estremamente probabile"] },
  { id: "Q30", section: "D", sectionTitle: "Sezione D: Valutazione Globale", type: "Risposta Aperta",
    question: "Condividi i principali errori, bug o blocchi riscontrati e quali miglioramenti suggeriresti vivamente per la versione finale.",
    options: ["Feedback testuale aperto (Bug, errori di navigazione, miglioramenti suggeriti)"] }
];

RENOVATE_CONFIG.questionnaireData["es-ES"] = [
  // SECCIÓN A: Perfil y Competencia Digital
  { id: "Q1", section: "A", sectionTitle: "Sección A: Perfil y Competencia Digital", type: "Selección Única",
    question: "¿Cuál es su perfil profesional principal?",
    options: ["Agricultor / Productor", "Asesor / Técnico agrícola", "Formador / Profesional de la educación agraria", "Representante de la industria (Maquinaria / Fitosanitarios)", "Regulador / Administración pública", "Estudiante", "Investigador", "Otro"] },
  { id: "Q2", section: "A", sectionTitle: "Sección A: Perfil y Competencia Digital", type: "Pregunta Abierta",
    question: "¿Cuál es su edad?",
    options: ["Entrada numérica abierta (Edad en años)"] },
  { id: "Q3", section: "A", sectionTitle: "Sección A: Perfil y Competencia Digital", type: "Selección Única",
    question: "¿Cuál es su género?",
    options: ["Femenino", "Masculino", "Prefiero no decirlo"] },
  { id: "Q4", section: "A", sectionTitle: "Sección A: Perfil y Competencia Digital", type: "Selección Única",
    question: "¿En qué país participa en este Grupo Focal?",
    options: ["Portugal", "España", "Francia", "Italia", "Bélgica", "Polonia"] },
  { id: "Q5", section: "A", sectionTitle: "Sección A: Perfil y Competencia Digital", type: "Selección Múltiple",
    question: "¿Con qué cultivos está más involucrado en su actividad profesional? (seleccione todos los que correspondan)",
    options: ["Viñedos", "Frutales (Fruta de pepita / hueso)", "Olivares", "Cítricos", "Cereales / Cultivos extensivos", "Hortícolas / Horticultura"] },
  { id: "Q6", section: "A", sectionTitle: "Sección A: Perfil y Competencia Digital", type: "Escala Likert (1 a 5)",
    question: "¿Cómo de cómodo se siente actualmente utilizando herramientas digitales y software de agricultura de precisión en sus actividades diarias?",
    options: ["(1) - Muy incómodo", "(2) - Incómodo", "(3) - Ni cómodo ni incómodo", "(4) - Cómodo", "(5) - Muy cómodo"] },

  // SECCIÓN B: Serious Game (Calibración del Pulverizador)
  { id: "Q7", section: "B", sectionTitle: "Sección B: Serious Game (Calibración del Pulverizador)", type: "Escala Likert (1 a 5)",
    question: "¿Cómo de claras fueron las explicaciones proporcionadas después de cada respuesta (tanto correctas como incorrectas)?",
    options: ["(1) - Nada claras", "(2) - Poco claras", "(3) - Moderadamente claras", "(4) - Claras", "(5) - Muy claras"] },
  { id: "Q8", section: "B", sectionTitle: "Sección B: Serious Game (Calibración del Pulverizador)", type: "Escala Likert (1 a 5)",
    question: "¿Cómo calificaría el nivel de dificultad de las preguntas para alguien con su nivel de experiencia?",
    options: ["(1) - Demasiado fácil", "(2) - Algo fácil", "(3) - Adecuado", "(4) - Algo difícil", "(5) - Demasiado difícil"] },
  { id: "Q9", section: "B", sectionTitle: "Sección B: Serious Game (Calibración del Pulverizador)", type: "Escala Likert (1 a 5)",
    question: "¿Los escenarios le parecieron realistas y representativos de situaciones reales de campo?",
    options: ["(1) - Nada realistas", "(2) - Poco realistas", "(3) - Moderadamente realistas", "(4) - Realistas", "(5) - Muy realistas"] },
  { id: "Q10", section: "B", sectionTitle: "Sección B: Serious Game (Calibración del Pulverizador)", type: "Escala Likert (1 a 5)",
    question: "¿Cómo de útil fue este módulo para reforzar los pasos clave de calibración que cubre (selección de boquillas, anchura de trabajo, velocidad de avance, caudal, verificación)?",
    options: ["(1) - Nada útil", "(2) - Poco útil", "(3) - Moderadamente útil", "(4) - Útil", "(5) - Muy útil"] },
  { id: "Q11", section: "B", sectionTitle: "Sección B: Serious Game (Calibración del Pulverizador)", type: "Escala Likert (1 a 5)",
    question: "¿Cómo de atractivo le pareció el formato estilo cuestionario (quiz) de este módulo?",
    options: ["(1) - Nada atractivo", "(2) - Poco atractivo", "(3) - Moderadamente atractivo", "(4) - Atractivo", "(5) - Muy atractivo"] },
  { id: "Q12", section: "B", sectionTitle: "Sección B: Serious Game (Calibración del Pulverizador)", type: "Escala Likert (1 a 5)",
    question: "En general, ¿el Serious Game cumplió con sus expectativas como herramienta de aprendizaje rápido?",
    options: ["(1) - Totalmente por debajo de las expectativas", "(2) - Ligeramente por debajo de las expectativas", "(3) - Cumplió con las expectativas", "(4) - Superó las expectativas", "(5) - Superó ampliamente las expectativas"] },
  { id: "Q13", section: "B", sectionTitle: "Sección B: Serious Game (Calibración del Pulverizador)", type: "Escala SUS (10 Afirmaciones)",
    question: "Escala de Usabilidad del Sistema (SUS) - Serious Game (Valore su grado de acuerdo en una escala de 1 a 5: Totalmente en desacuerdo a Totalmente de acuerdo)",
    options: [
      "1. Creo que me gustaría utilizar esta herramienta con frecuencia.",
      "2. Encontré esta herramienta innecesariamente compleja.",
      "3. Pensé que esta herramienta era fácil de usar.",
      "4. Creo que necesitaría el apoyo de un técnico para poder utilizar esta herramienta.",
      "5. Encontré que las diversas funciones de esta herramienta estaban bien integradas.",
      "6. Pensé que había demasiada inconsistencia en esta herramienta.",
      "7. Imagino que la mayoría de las personas aprenderían a utilizar esta herramienta muy rápidamente.",
      "8. Encontré esta herramienta muy engorrosa/pesada de usar.",
      "9. Me sentí muy seguro utilizando esta herramienta.",
      "10. Necesité aprender muchas cosas antes de poder empezar a utilizar esta herramienta."
    ] },
  { id: "Q14", section: "B", sectionTitle: "Sección B: Serious Game (Calibración del Pulverizador)", type: "Pregunta Abierta",
    question: "¿Qué aspectos, si hubo alguno, resultaron confusos, faltaron o no reflejaron la práctica real en este módulo?",
    options: ["Comentarios abiertos (Sugerencias, elementos faltantes, aspectos de realismo)"] },

  // SECCIÓN C: Simulador RENOVATE
  { id: "Q15", section: "C", sectionTitle: "Sección C: Simulador RENOVATE", type: "Escala Likert (1 a 5)",
    question: "¿Cómo de fácil fue aprender los controles básicos y navegar por el entorno del simulador?",
    options: ["(1) - Muy difícil", "(2) - Difícil", "(3) - Ni fácil ni difícil", "(4) - Fácil", "(5) - Muy fácil"] },
  { id: "Q16", section: "C", sectionTitle: "Sección C: Simulador RENOVATE", type: "Escala Likert (1 a 5)",
    question: "¿Las instrucciones en pantalla, tutoriales y menús fueron claros y estuvieron bien contextualizados?",
    options: ["(1) - Nada claros", "(2) - Poco claros", "(3) - Moderadamente claros", "(4) - Claros", "(5) - Muy claros"] },
  { id: "Q17", section: "C", sectionTitle: "Sección C: Simulador RENOVATE", type: "Escala Likert (1 a 5)",
    question: "¿Cómo de eficaz pedagógicamente fue la forma en que se presentaron las tareas prácticas?",
    options: ["(1) - Nada eficaz", "(2) - Poco eficaz", "(3) - Moderadamente eficaz", "(4) - Eficaz", "(5) - Muy eficaz"] },
  { id: "Q18", section: "C", sectionTitle: "Sección C: Simulador RENOVATE", type: "Escala Likert (1 a 5)",
    question: "¿El simulador reflejó claramente la secuencia correcta de toma de decisiones para la calibración del pulverizador?",
    options: ["(1) - Muy confuso", "(2) - Confuso", "(3) - Ni confuso ni claro", "(4) - Claro", "(5) - Muy claro"] },
  { id: "Q19", section: "C", sectionTitle: "Sección C: Simulador RENOVATE", type: "Escala Likert (1 a 5)",
    question: "¿Cómo de clara fue la tarea de cálculo (p. ej. caudal, anchura de trabajo) al tener que introducir valores utilizando fórmulas matemáticas?",
    options: ["(1) - Muy confuso", "(2) - Confuso", "(3) - Ni confuso ni claro", "(4) - Claro", "(5) - Muy claro"] },
  { id: "Q20", section: "C", sectionTitle: "Sección C: Simulador RENOVATE", type: "Escala Likert (1 a 5)",
    question: "¿Los ejercicios de configuración de boquillas y ajuste del volumen de caldo reflejaron con precisión los desafíos reales de calibración?",
    options: ["(1) - Nada precisos", "(2) - Poco precisos", "(3) - Moderadamente precisos", "(4) - Precisos", "(5) - Muy precisos"] },
  { id: "Q21", section: "C", sectionTitle: "Sección C: Simulador RENOVATE", type: "Escala Likert (1 a 5)",
    question: "¿Cómo de realista fue el paso de selección de producto y lectura de la etiqueta antes de la aplicación?",
    options: ["(1) - Nada realista", "(2) - Poco realista", "(3) - Moderadamente realista", "(4) - Realista", "(5) - Muy realista"] },
  { id: "Q22", section: "C", sectionTitle: "Sección C: Simulador RENOVATE", type: "Escala Likert (1 a 5)",
    question: "¿Las variables y parámetros utilizados (factores ambientales, condiciones de campo, ajustes del equipo) reflejan escenarios reales de campo?",
    options: ["(1) - Nada realistas", "(2) - Poco realistas", "(3) - Moderadamente realistas", "(4) - Realistas", "(5) - Muy realistas"] },
  { id: "Q23", section: "C", sectionTitle: "Sección C: Simulador RENOVATE", type: "Escala Likert (1 a 5)",
    question: "En general, ¿el Simulador RENOVATE cumplió con sus expectativas como herramienta de formación digital para la protección de cultivos?",
    options: ["(1) - Totalmente por debajo de las expectativas", "(2) - Ligeramente por debajo de las expectativas", "(3) - Cumplió con las expectativas", "(4) - Superó las expectativas", "(5) - Superó ampliamente las expectativas"] },
  { id: "Q24", section: "C", sectionTitle: "Sección C: Simulador RENOVATE", type: "Escala SUS (10 Afirmaciones)",
    question: "Escala de Usabilidad del Sistema (SUS) - Simulador RENOVATE (Valore su grado de acuerdo en una escala de 1 a 5: Totalmente en desacuerdo a Totalmente de acuerdo)",
    options: [
      "1. Creo que me gustaría utilizar esta herramienta con frecuencia.",
      "2. Encontré esta herramienta innecesariamente compleja.",
      "3. Pensé que esta herramienta era fácil de usar.",
      "4. Creo que necesitaría el apoyo de un técnico para poder utilizar esta herramienta.",
      "5. Encontré que las diversas funciones de esta herramienta estaban bien integradas.",
      "6. Pensé que había demasiada inconsistencia en esta herramienta.",
      "7. Imagino que la mayoría de las personas aprenderían a utilizar esta herramienta muy rápidamente.",
      "8. Encontré esta herramienta muy engorrosa/pesada de usar.",
      "9. Me sentí muy seguro utilizando esta herramienta.",
      "10. Necesité aprender muchas cosas antes de poder empezar a utilizar esta herramienta."
    ] },
  { id: "Q25", section: "C", sectionTitle: "Sección C: Simulador RENOVATE", type: "Pregunta Abierta",
    question: "¿Qué aspectos, si hubo alguno, resultaron confusos, faltaron o no reflejaron la práctica real en el simulador?",
    options: ["Comentarios abiertos (Controles, física 3D, aspectos de realismo)"] },

  // SECCIÓN D: Evaluación Global
  { id: "Q26", section: "D", sectionTitle: "Sección D: Evaluación Global", type: "Pregunta Abierta",
    question: "En sus propias palabras, ¿cómo de eficaz fue la plataforma RENOVATE para ayudarle a aprender y comprender los temas tratados hoy?",
    options: ["Comentarios abiertos"] },
  { id: "Q27", section: "D", sectionTitle: "Sección D: Evaluación Global", type: "Pregunta Abierta",
    question: "¿Completar las tareas le pareció eficiente, es decir, sin esfuerzo ni tiempo innecesarios?",
    options: ["Comentarios abiertos"] },
  { id: "Q28", section: "D", sectionTitle: "Sección D: Evaluación Global", type: "Pregunta Abierta",
    question: "En general, ¿cómo de satisfecho está con su experiencia de aprendizaje de hoy? Por favor, explique por qué.",
    options: ["Comentarios abiertos"] },
  { id: "Q29", section: "D", sectionTitle: "Sección D: Evaluación Global", type: "Escala Likert (1 a 5)",
    question: "Teniendo en cuenta su experiencia de hoy, ¿con qué probabilidad recomendaría la plataforma de formación digital RENOVATE a un colega o profesional del sector agrícola?",
    options: ["(1) - Nada probable", "(2) - Poco probable", "(3) - Moderadamente probable", "(4) - Muy probable", "(5) - Totalmente probable"] },
  { id: "Q30", section: "D", sectionTitle: "Sección D: Evaluación Global", type: "Pregunta Abierta",
    question: "Por favor, comparta los principales errores, fallos o bloqueos que encontró y qué mejoras sugeriría firmemente para la versión final.",
    options: ["Comentarios abiertos (Errores, fallos de navegación, mejoras sugeridas)"] }
];

RENOVATE_CONFIG.questionnaireData["fr-FR"] = [
  // SECTION A: Profil et Compétences Numériques
  { id: "Q1", section: "A", sectionTitle: "Section A : Profil et Compétences Numériques", type: "Choix Unique",
    question: "Quel est votre profil professionnel principal ?",
    options: ["Agriculteur / Producteur", "Conseiller / Technicien agricole", "Formateur / Professionnel de l'enseignement agricole", "Représentant de l'industrie (Machinisme / Produits phytopharmaceutiques)", "Régulateur / Administration publique", "Étudiant", "Chercheur", "Autre"] },
  { id: "Q2", section: "A", sectionTitle: "Section A : Profil et Compétences Numériques", type: "Question Ouverte",
    question: "Quel est votre âge ?",
    options: ["Saisie numérique ouverte (Âge en années)"] },
  { id: "Q3", section: "A", sectionTitle: "Section A : Profil et Compétences Numériques", type: "Choix Unique",
    question: "Quel est votre genre ?",
    options: ["Femme", "Homme", "Préfère ne pas préciser"] },
  { id: "Q4", section: "A", sectionTitle: "Section A : Profil et Compétences Numériques", type: "Choix Unique",
    question: "Dans quel pays participez-vous à ce Focus Group ?",
    options: ["Portugal", "Espagne", "France", "Italie", "Belgique", "Pologne"] },
  { id: "Q5", section: "A", sectionTitle: "Section A : Profil et Compétences Numériques", type: "Choix Multiple",
    question: "Quelles sont les cultures avec lesquelles vous travaillez le plus dans votre activité professionnelle ? (sélectionnez toutes les options applicables)",
    options: ["Vignobles", "Vergers (Arbres fruitiers à pépins / à noyau)", "Oliveraies", "Agrumes", "Grandes cultures / Céréales", "Légumes / Horticulture"] },
  { id: "Q6", section: "A", sectionTitle: "Section A : Profil et Compétences Numériques", type: "Échelle de Likert (1 à 5)",
    question: "Dans quelle mesure vous sentez-vous à l'aise avec l'utilisation des outils numériques et des logiciels d'agriculture de précision dans vos activités quotidiennes ?",
    options: ["(1) - Très mal à l'aise", "(2) - Mal à l'aise", "(3) - Ni à l'aise ni mal à l'aise", "(4) - À l'aise", "(5) - Très à l'aise"] },

  // SECTION B: Serious Game (Calibrage du Pulvérisateur)
  { id: "Q7", section: "B", sectionTitle: "Section B : Serious Game (Calibrage du Pulvérisateur)", type: "Échelle de Likert (1 à 5)",
    question: "Dans quelle mesure les explications fournies après chaque réponse (correcte ou incorrecte) étaient-elles claires ?",
    options: ["(1) - Pas claires du tout", "(2) - Peu claires", "(3) - Moyennement claires", "(4) - Claires", "(5) - Très claires"] },
  { id: "Q8", section: "B", sectionTitle: "Section B : Serious Game (Calibrage du Pulvérisateur)", type: "Échelle de Likert (1 à 5)",
    question: "Comment évaluez-vous le niveau de difficulté des questions pour quelqu'un ayant votre niveau d'expérience ?",
    options: ["(1) - Trop facile", "(2) - Assez facile", "(3) - Adéquat", "(4) - Assez difficile", "(5) - Trop difficile"] },
  { id: "Q9", section: "B", sectionTitle: "Section B : Serious Game (Calibrage du Pulvérisateur)", type: "Échelle de Likert (1 à 5)",
    question: "Les scénarios vous ont-ils semblé réalistes et représentatifs de situations réelles au champ ?",
    options: ["(1) - Pas réalistes du tout", "(2) - Peu réalistes", "(3) - Moyennement réalistes", "(4) - Réalistes", "(5) - Très réalistes"] },
  { id: "Q10", section: "B", sectionTitle: "Section B : Serious Game (Calibrage du Pulvérisateur)", type: "Échelle de Likert (1 à 5)",
    question: "Dans quelle mesure ce module a-t-il été utile pour consolider les étapes clés du calibrage abordées (choix des buses, largeur de travail, vitesse d'avancement, débit, vérification) ?",
    options: ["(1) - Pas utile du tout", "(2) - Peu utile", "(3) - Moyennement utile", "(4) - Utile", "(5) - Très utile"] },
  { id: "Q11", section: "B", sectionTitle: "Section B : Serious Game (Calibrage du Pulvérisateur)", type: "Échelle de Likert (1 à 5)",
    question: "Dans quelle mesure avez-vous trouvé le format style quiz de ce module stimulant et engageant ?",
    options: ["(1) - Pas stimulant du tout", "(2) - Peu stimulant", "(3) - Moyennement stimulant", "(4) - Stimulant", "(5) - Très stimulant"] },
  { id: "Q12", section: "B", sectionTitle: "Section B : Serious Game (Calibrage du Pulvérisateur)", type: "Échelle de Likert (1 à 5)",
    question: "Dans l'ensemble, le Serious Game a-t-il répondu à vos attentes en tant qu'outil d'apprentissage rapide ?",
    options: ["(1) - Tout à fait en deçà des attentes", "(2) - Légèrement en deçà des attentes", "(3) - A répondu aux attentes", "(4) - A dépassé les attentes", "(5) - A largement dépassé les attentes"] },
  { id: "Q13", section: "B", sectionTitle: "Section B : Serious Game (Calibrage du Pulvérisateur)", type: "Échelle SUS (10 Affirmations)",
    question: "System Usability Scale (SUS) - Serious Game (Évaluez votre degré d'accord sur une échelle de 1 à 5 : Pas du tout d'accord à Tout à fait d'accord)",
    options: [
      "1. Je pense que j'aimerais utiliser cet outil fréquemment.",
      "2. J'ai trouvé cet outil inutilement complexe.",
      "3. J'ai pensé que cet outil était facile à utiliser.",
      "4. Je pense que j'aurais besoin du soutien d'une personne technique pour être capable d'utiliser cet outil.",
      "5. J'ai trouvé que les diverses fonctionnalités de cet outil étaient bien intégrées.",
      "6. J'ai pensé qu'il y avait trop d'incohérences dans cet outil.",
      "7. J'imagine que la plupart des gens apprendraient à utiliser cet outil très rapidement.",
      "8. J'ai trouvé cet outil très lourd / fastidieux à utiliser.",
      "9. Je me suis senti très en confiance en utilisant cet outil.",
      "10. J'ai dû apprendre beaucoup de choses avant de pouvoir commencer à utiliser cet outil."
    ] },
  { id: "Q14", section: "B", sectionTitle: "Section B : Serious Game (Calibrage du Pulvérisateur)", type: "Question Ouverte",
    question: "Qu'est-ce qui, le cas échéant, était confus, manquait ou ne reflétait pas la pratique réelle dans ce module ?",
    options: ["Commentaires ouverts (Suggestions, éléments manquants, aspects de réalisme)"] },

  // SECTION C: Simulateur RENOVATE
  { id: "Q15", section: "C", sectionTitle: "Section C : Simulateur RENOVATE", type: "Échelle de Likert (1 à 5)",
    question: "Dans quelle mesure a-t-il été facile d'apprendre les commandes de base et de naviguer dans l'environnement du simulateur ?",
    options: ["(1) - Très difficile", "(2) - Difficile", "(3) - Ni facile ni difficile", "(4) - Facile", "(5) - Très facile"] },
  { id: "Q16", section: "C", sectionTitle: "Section C : Simulateur RENOVATE", type: "Échelle de Likert (1 à 5)",
    question: "Les instructions à l'écran, les tutoriels et les menus étaient-ils clairs et bien contextualisés ?",
    options: ["(1) - Pas clairs du tout", "(2) - Peu clairs", "(3) - Moyennement clairs", "(4) - Clairs", "(5) - Très clairs"] },
  { id: "Q17", section: "C", sectionTitle: "Section C : Simulateur RENOVATE", type: "Échelle de Likert (1 à 5)",
    question: "Dans quelle mesure la façon dont les tâches pratiques ont été présentées était-elle pédagogiquement efficace ?",
    options: ["(1) - Pas efficace du tout", "(2) - Peu efficace", "(3) - Moyennement efficace", "(4) - Efficace", "(5) - Très efficace"] },
  { id: "Q18", section: "C", sectionTitle: "Section C : Simulateur RENOVATE", type: "Échelle de Likert (1 à 5)",
    question: "Le simulateur a-t-il clairement reflété la séquence décisionnelle correcte pour le calibrage du pulvérisateur ?",
    options: ["(1) - Très confus", "(2) - Confus", "(3) - Ni confus ni clair", "(4) - Clair", "(5) - Très clair"] },
  { id: "Q19", section: "C", sectionTitle: "Section C : Simulateur RENOVATE", type: "Échelle de Likert (1 à 5)",
    question: "Dans quelle mesure la tâche de calcul (ex. débit, largeur de travail) était-elle claire lorsque vous deviez saisir des valeurs à l'aide de formules mathématiques ?",
    options: ["(1) - Très confus", "(2) - Confus", "(3) - Ni confus ni clair", "(4) - Clair", "(5) - Très clair"] },
  { id: "Q20", section: "C", sectionTitle: "Section C : Simulateur RENOVATE", type: "Échelle de Likert (1 à 5)",
    question: "Les exercices de configuration des buses et de réglage du volume de bouillie reflétaient-ils fidèlement les défis réels du calibrage ?",
    options: ["(1) - Pas précis du tout", "(2) - Peu précis", "(3) - Moyennement précis", "(4) - Précis", "(5) - Très précis"] },
  { id: "Q21", section: "C", sectionTitle: "Section C : Simulateur RENOVATE", type: "Échelle de Likert (1 à 5)",
    question: "Dans quelle mesure l'étape de sélection du produit et de lecture de l'étiquette avant l'application était-elle réaliste ?",
    options: ["(1) - Pas réaliste du tout", "(2) - Peu réaliste", "(3) - Moyennement réaliste", "(4) - Réaliste", "(5) - Très réaliste"] },
  { id: "Q22", section: "C", sectionTitle: "Section C : Simulateur RENOVATE", type: "Échelle de Likert (1 à 5)",
    question: "Les variables et paramètres utilisés (facteurs environnementaux, conditions de terrain, réglages du matériel) reflètent-ils des scénarios réels de terrain ?",
    options: ["(1) - Pas réalistes du tout", "(2) - Peu réalistes", "(3) - Moyennement réalistes", "(4) - Réalistes", "(5) - Très réalistes"] },
  { id: "Q23", section: "C", sectionTitle: "Section C : Simulateur RENOVATE", type: "Échelle de Likert (1 à 5)",
    question: "Dans l'ensemble, le Simulateur RENOVATE a-t-il répondu à vos attentes en tant qu'outil de formation numérique pour la protection des cultures ?",
    options: ["(1) - Tout à fait en deçà des attentes", "(2) - Légèrement en deçà des attentes", "(3) - A répondu aux attentes", "(4) - A dépassé les attentes", "(5) - A largement dépassé les attentes"] },
  { id: "Q24", section: "C", sectionTitle: "Section C : Simulateur RENOVATE", type: "Échelle SUS (10 Affirmations)",
    question: "System Usability Scale (SUS) - Simulateur RENOVATE (Évaluez votre degré d'accord sur une échelle de 1 à 5 : Pas du tout d'accord à Tout à fait d'accord)",
    options: [
      "1. Je pense que j'aimerais utiliser cet outil fréquemment.",
      "2. J'ai trouvé cet outil inutilement complexe.",
      "3. J'ai pensé que cet outil était facile à utiliser.",
      "4. Je pense que j'aurais besoin du soutien d'une personne technique pour être capable d'utiliser cet outil.",
      "5. J'ai trouvé que les diverses fonctionnalités de cet outil étaient bien intégrées.",
      "6. J'ai pensé qu'il y avait trop d'incohérences dans cet outil.",
      "7. J'imagine que la plupart des gens apprendraient à utiliser cet outil très rapidement.",
      "8. J'ai trouvé cet outil très lourd / fastidieux à utiliser.",
      "9. Je me suis senti très en confiance en utilisant cet outil.",
      "10. J'ai dû apprendre beaucoup de choses avant de pouvoir commencer à utiliser cet outil."
    ] },
  { id: "Q25", section: "C", sectionTitle: "Section C : Simulateur RENOVATE", type: "Question Ouverte",
    question: "Qu'est-ce qui, le cas échéant, était confus, manquait ou ne reflétait pas la pratique réelle dans le simulateur ?",
    options: ["Commentaires ouverts (Commandes, physique 3D, aspects de réalisme)"] },

  // SECTION D: Évaluation Globale
  { id: "Q26", section: "D", sectionTitle: "Section D : Évaluation Globale", type: "Question Ouverte",
    question: "Avec vos propres mots, dans quelle mesure la plateforme RENOVATE a-t-elle été efficace pour vous aider à apprendre et à comprendre les sujets abordés aujourd'hui ?",
    options: ["Commentaires ouverts"] },
  { id: "Q27", section: "D", sectionTitle: "Section D : Évaluation Globale", type: "Question Ouverte",
    question: "L'accomplissement des tâches a-t-il semblé efficace — c'est-à-dire sans effort ni temps inutiles ?",
    options: ["Commentaires ouverts"] },
  { id: "Q28", section: "D", sectionTitle: "Section D : Évaluation Globale", type: "Question Ouverte",
    question: "Dans l'ensemble, dans quelle mesure êtes-vous satisfait de votre expérience d'apprentissage aujourd'hui ? Veuillez expliquer pourquoi.",
    options: ["Commentaires ouverts"] },
  { id: "Q29", section: "D", sectionTitle: "Section D : Évaluation Globale", type: "Échelle de Likert (1 à 5)",
    question: "Compte tenu de votre expérience d'aujourd'hui, quelle est la probabilité que vous recommandiez la plateforme de formation numérique RENOVATE à un collègue ou à un professionnel du secteur agricole ?",
    options: ["(1) - Pas du tout probable", "(2) - Peu probable", "(3) - Moyennement probable", "(4) - Très probable", "(5) - Tout à fait probable"] },
  { id: "Q30", section: "D", sectionTitle: "Section D : Évaluation Globale", type: "Question Ouverte",
    question: "Veuillez partager les principales erreurs, anomalies ou blocages rencontrés, ainsi que les améliorations que vous suggéreriez vivement pour la version finale.",
    options: ["Commentaires ouverts (Bugs, erreurs de navigation, suggestions d'amélioration)"] }
];

RENOVATE_CONFIG.questionnaireData["pl-PL"] = [
  // SEKCJA A: Profil i Kompetencje Cyfrowe
  { id: "Q1", section: "A", sectionTitle: "Sekcja A: Profil i Kompetencje Cyfrowe", type: "Pojedynczy Wybór",
    question: "Jaki jest Twój główny profil zawodowy?",
    options: ["Rolnik / Sadownik", "Doradca / Technik rolniczy", "Szkoleniowiec / Nauczyciel zawodu rolniczego", "Przedstawiciel branży (Maszyny / Środki ochrony roślin)", "Przedstawiciel organów regulacyjnych / Administracja publiczna", "Student", "Naukowiec / Badacz", "Inny"] },
  { id: "Q2", section: "A", sectionTitle: "Sekcja A: Profil i Kompetencje Cyfrowe", type: "Pytanie Otwarte",
    question: "Ile masz lat?",
    options: ["Wpis numeryczny otwarty (Wiek w latach)"] },
  { id: "Q3", section: "A", sectionTitle: "Sekcja A: Profil i Kompetencje Cyfrowe", type: "Pojedynczy Wybór",
    question: "Jaka jest Twoja płeć?",
    options: ["Kobieta", "Mężczyzna", "Wolę nie podawać"] },
  { id: "Q4", section: "A", sectionTitle: "Sekcja A: Profil i Kompetencje Cyfrowe", type: "Pojedynczy Wybór",
    question: "W jakim kraju uczestniczysz w tej Grupie Fokusowej?",
    options: ["Portugalia", "Hiszpania", "Francja", "Włochy", "Belgia", "Polska"] },
  { id: "Q5", section: "A", sectionTitle: "Sekcja A: Profil i Kompetencje Cyfrowe", type: "Wielokrotny Wybór",
    question: "Jakimi uprawami zajmujesz się najczęściej w swojej działalności zawodowej? (zaznacz wszystkie pasujące)",
    options: ["Winnice", "Sady (Drzewa ziarnkowe / pestkowe)", "Gaje oliwne", "Cytrusy", "Zboża / Uprawy polowe", "Warzywa / Ogrodnictwo"] },
  { id: "Q6", section: "A", sectionTitle: "Sekcja A: Profil i Kompetencje Cyfrowe", type: "Skala Likerta (od 1 do 5)",
    question: "Jak swobodnie czujesz się obecnie, korzystając z narzędzi cyfrowych i oprogramowania rolnictwa precyzyjnego w codziennych zadaniach?",
    options: ["(1) - Bardzo nieswobodnie", "(2) - Nieswobodnie", "(3) - Ani swobodnie, ani nieswobodnie", "(4) - Swobodnie", "(5) - Bardzo swobodnie"] },

  // SEKCJA B: Gra Poważna (Kalibracja Opryskiwacza)
  { id: "Q7", section: "B", sectionTitle: "Sekcja B: Gra Poważna (Kalibracja Opryskiwacza)", type: "Skala Likerta (od 1 do 5)",
    question: "Jak jasne i zrozumiałe były wyjaśnienia udzielane po każdej odpowiedzi (zarówno poprawnej, jak i błędnej)?",
    options: ["(1) - Zupełnie niejasne", "(2) - Mało jasne", "(3) - Umiarkowanie jasne", "(4) - Jasne", "(5) - Bardzo jasne"] },
  { id: "Q8", section: "B", sectionTitle: "Sekcja B: Gra Poważna (Kalibracja Opryskiwacza)", type: "Skala Likerta (od 1 do 5)",
    question: "Jak oceniasz poziom trudności pytań dla osoby o Twoim poziomie doświadczenia?",
    options: ["(1) - Zdecydowanie za łatwe", "(2) - Dość łatwe", "(3) - Odpowiednie", "(4) - Dość trudne", "(5) - Zdecydowanie za trudne"] },
  { id: "Q9", section: "B", sectionTitle: "Sekcja B: Gra Poważna (Kalibracja Opryskiwacza)", type: "Skala Likerta (od 1 do 5)",
    question: "Czy przedstawione scenariusze wydawały się realistyczne i reprezentatywne dla rzeczywistych sytuacji polowych?",
    options: ["(1) - Zupełnie nierealistyczne", "(2) - Mało realistyczne", "(3) - Umiarkowanie realistyczne", "(4) - Realistyczne", "(5) - Bardzo realistyczne"] },
  { id: "Q10", section: "B", sectionTitle: "Sekcja B: Gra Poważna (Kalibracja Opryskiwacza)", type: "Skala Likerta (od 1 do 5)",
    question: "Jak przydatny był ten moduł w utrwaleniu kluczowych etapów kalibracji (dobór rozpylaczy, szerokość robocza, prędkość robocza, wydatek cieczy, weryfikacja)?",
    options: ["(1) - Zupełnie nieprzydatny", "(2) - Mało przydatny", "(3) - Umiarkowanie przydatny", "(4) - Przydatny", "(5) - Bardzo przydatny"] },
  { id: "Q11", section: "B", sectionTitle: "Sekcja B: Gra Poważna (Kalibracja Opryskiwacza)", type: "Skala Likerta (od 1 do 5)",
    question: "Jak angażujący był dla Ciebie format quizu w tym module?",
    options: ["(1) - Zupełnie nieangażujący", "(2) - Mało angażujący", "(3) - Umiarkowanie angażujący", "(4) - Angażujący", "(5) - Bardzo angażujący"] },
  { id: "Q12", section: "B", sectionTitle: "Sekcja B: Gra Poważna (Kalibracja Opryskiwacza)", type: "Skala Likerta (od 1 do 5)",
    question: "Ogólnie rzecz biorąc, czy Gra Poważna spełniła Twoje oczekiwania jako narzędzie do szybkiej i efektywnej nauki?",
    options: ["(1) - Całkowicie poniżej oczekiwań", "(2) - Nieco poniżej oczekiwań", "(3) - Zgodnie z oczekiwaniami", "(4) - Powyżej oczekiwań", "(5) - Znacznie powyżej oczekiwań"] },
  { id: "Q13", section: "B", sectionTitle: "Sekcja B: Gra Poważna (Kalibracja Opryskiwacza)", type: "Skala SUS (10 Stwierdzeń)",
    question: "Skala Użyteczności Systemu (SUS) - Gra Poważna (Oceń stopień zgody w skali od 1 do 5: Zdecydowanie się nie zgadzam do Zdecydowanie się zgadzam)",
    options: [
      "1. Myślę, że chętnie korzystał(a)bym z tego narzędzia często.",
      "2. Uznałem/am to narzędzie za niepotrzebnie skomplikowane.",
      "3. Uważam, że to narzędzie było łatwe w użyciu.",
      "4. Myślę, że potrzebował(a)bym wsparcia osoby technicznej, aby móc korzystać z tego narzędzia.",
      "5. Uznałem/am, że różne funkcje tego narzędzia były dobrze zintegrowane.",
      "6. Uważam, że w tym narzędziu było zbyt wiele niespójności.",
      "7. Wyobrażam sobie, że większość ludzi nauczyłaby się obsługi tego narzędzia bardzo szybko.",
      "8. Uznałem/am to narzędzie za bardzo uciążliwe w użyciu.",
      "9. Czułem/am się bardzo pewnie, korzystając z tego narzędzia.",
      "10. Musiałem/am nauczyć się wielu rzeczy, zanim mogłem/am zacząć pracować z tym narzędziem."
    ] },
  { id: "Q14", section: "B", sectionTitle: "Sekcja B: Gra Poważna (Kalibracja Opryskiwacza)", type: "Pytanie Otwarte",
    question: "Co ewentualnie było mylące, czego brakowało lub co nie odzwierciedlało rzeczywistej praktyki w tym module?",
    options: ["Otwarty komentarz tekstowy (Sugestie, brakujące elementy, kwestie realizmu)"] },

  // SEKCJA C: Symulator RENOVATE
  { id: "Q15", section: "C", sectionTitle: "Sekcja C: Symulator RENOVATE", type: "Skala Likerta (od 1 do 5)",
    question: "Jak łatwe było opanowanie podstawowego sterowania i nawigacji w środowisku symulatora?",
    options: ["(1) - Bardzo trudne", "(2) - Trudne", "(3) - Ani łatwe, ani trudne", "(4) - Łatwe", "(5) - Bardzo łatwe"] },
  { id: "Q16", section: "C", sectionTitle: "Sekcja C: Symulator RENOVATE", type: "Skala Likerta (od 1 do 5)",
    question: "Czy instrukcje na ekranie, samouczki i menu były jasne i dobrze osadzone w kontekście?",
    options: ["(1) - Zupełnie niejasne", "(2) - Mało jasne", "(3) - Umiarkowanie jasne", "(4) - Jasne", "(5) - Bardzo jasne"] },
  { id: "Q17", section: "C", sectionTitle: "Sekcja C: Symulator RENOVATE", type: "Skala Likerta (od 1 do 5)",
    question: "Jak skuteczny pedagogicznie był sposób prezentacji zadań praktycznych?",
    options: ["(1) - Zupełnie nieskuteczny", "(2) - Mało skuteczny", "(3) - Umiarkowanie skuteczny", "(4) - Skuteczny", "(5) - Bardzo skuteczny"] },
  { id: "Q18", section: "C", sectionTitle: "Sekcja C: Symulator RENOVATE", type: "Skala Likerta (od 1 do 5)",
    question: "Czy symulator jasno odzwierciedlał prawidłową sekwencję podejmowania decyzji przy kalibracji opryskiwacza?",
    options: ["(1) - Bardzo mylące", "(2) - Mylące", "(3) - Ani mylące, ani jasne", "(4) - Jasne", "(5) - Bardzo jasne"] },
  { id: "Q19", section: "C", sectionTitle: "Sekcja C: Symulator RENOVATE", type: "Skala Likerta (od 1 do 5)",
    question: "Jak jasne było zadanie obliczeniowe (np. wydatek cieczy, szerokość robocza), gdy należało wprowadzić wartości za pomocą wzorów matematycznych?",
    options: ["(1) - Bardzo mylące", "(2) - Mylące", "(3) - Ani mylące, ani jasne", "(4) - Jasne", "(5) - Bardzo jasne"] },
  { id: "Q20", section: "C", sectionTitle: "Sekcja C: Symulator RENOVATE", type: "Skala Likerta (od 1 do 5)",
    question: "Czy ćwiczenia dotyczące konfiguracji rozpylaczy i ustawiania objętości cieczy opryskowej wiernie odzwierciedlały rzeczywiste wyzwania kalibracji?",
    options: ["(1) - Zupełnie niedokładne", "(2) - Mało dokładne", "(3) - Umiarkowanie dokładne", "(4) - Dokładne", "(5) - Bardzo dokładne"] },
  { id: "Q21", section: "C", sectionTitle: "Sekcja C: Symulator RENOVATE", type: "Skala Likerta (od 1 do 5)",
    question: "Jak realistyczny był etap doboru produktu i czytania etykiety przed wykonaniem zabiegu?",
    options: ["(1) - Zupełnie nierealistyczny", "(2) - Mało realistyczny", "(3) - Umiarkowanie realistyczny", "(4) - Realistyczny", "(5) - Bardzo realistyczny"] },
  { id: "Q22", section: "C", sectionTitle: "Sekcja C: Symulator RENOVATE", type: "Skala Likerta (od 1 do 5)",
    question: "Czy zastosowane zmienne i parametry (czynniki środowiskowe, warunki polowe, ustawienia sprzętu) odzwierciedlają realistyczne scenariusze polowe?",
    options: ["(1) - Zupełnie nierealistyczne", "(2) - Mało realistyczne", "(3) - Umiarkowanie realistyczne", "(4) - Realistyczne", "(5) - Bardzo realistyczne"] },
  { id: "Q23", section: "C", sectionTitle: "Sekcja C: Symulator RENOVATE", type: "Skala Likerta (od 1 do 5)",
    question: "Ogólnie rzecz biorąc, czy Symulator RENOVATE spełnił Twoje oczekiwania jako cyfrowe narzędzie szkoleniowe w zakresie ochrony roślin?",
    options: ["(1) - Całkowicie poniżej oczekiwań", "(2) - Nieco poniżej oczekiwań", "(3) - Zgodnie z oczekiwaniami", "(4) - Powyżej oczekiwań", "(5) - Znacznie powyżej oczekiwań"] },
  { id: "Q24", section: "C", sectionTitle: "Sekcja C: Symulator RENOVATE", type: "Skala SUS (10 Stwierdzeń)",
    question: "Skala Użyteczności Systemu (SUS) - Symulator RENOVATE (Oceń stopień zgody w skali od 1 do 5: Zdecydowanie się nie zgadzam do Zdecydowanie się zgadzam)",
    options: [
      "1. Myślę, że chętnie korzystał(a)bym z tego narzędzia często.",
      "2. Uznałem/am to narzędzie za niepotrzebnie skomplikowane.",
      "3. Uważam, że to narzędzie było łatwe w użyciu.",
      "4. Myślę, że potrzebował(a)bym wsparcia osoby technicznej, aby móc korzystać z tego narzędzia.",
      "5. Uznałem/am, że różne funkcje tego narzędzia były dobrze zintegrowane.",
      "6. Uważam, że w tym narzędziu było zbyt wiele niespójności.",
      "7. Wyobrażam sobie, że większość ludzi nauczyłaby się obsługi tego narzędzia bardzo szybko.",
      "8. Uznałem/am to narzędzie za bardzo uciążliwe w użyciu.",
      "9. Czułem/am się bardzo pewnie, korzystając z tego narzędzia.",
      "10. Musiałem/am nauczyć się wielu rzeczy, zanim mogłem/am zacząć pracować z tym narzędziem."
    ] },
  { id: "Q25", section: "C", sectionTitle: "Sekcja C: Symulator RENOVATE", type: "Pytanie Otwarte",
    question: "Co ewentualnie było mylące, czego brakowało lub co nie odzwierciedlało rzeczywistej praktyki w symulatorze?",
    options: ["Otwarty komentarz tekstowy (Sterowanie, fizyka 3D, kwestie realizmu)"] },

  // SEKCJA D: Ocena Ogólna
  { id: "Q26", section: "D", sectionTitle: "Sekcja D: Ocena Ogólna", type: "Pytanie Otwarte",
    question: "Własnymi słowami: na ile platforma RENOVATE pomogła Ci w nauce i zrozumieniu tematów poruszanych podczas dzisiejszej sesji?",
    options: ["Otwarty komentarz tekstowy"] },
  { id: "Q27", section: "D", sectionTitle: "Sekcja D: Ocena Ogólna", type: "Pytanie Otwarte",
    question: "Czy wykonywanie zadań przebiegało sprawnie — to znaczy bez zbędnego wysiłku i straty czasu?",
    options: ["Otwarty komentarz tekstowy"] },
  { id: "Q28", section: "D", sectionTitle: "Sekcja D: Ocena Ogólna", type: "Pytanie Otwarte",
    question: "Ogólnie rzecz biorąc, na ile jesteś zadowolony/a z dzisiejszego doświadczenia edukacyjnego? Prosimy krótko wyjaśnić dlaczego.",
    options: ["Otwarty komentarz tekstowy"] },
  { id: "Q29", section: "D", sectionTitle: "Sekcja D: Ocena Ogólna", type: "Skala Likerta (od 1 do 5)",
    question: "Biorąc pod uwagę dzisiejsze doświadczenie, na ile prawdopodobne jest, że polecisz cyfrową platformę szkoleniową RENOVATE koledze lub innemu specjaliście z branży rolniczej?",
    options: ["(1) - Zupełnie nieprawdopodobne", "(2) - Mało prawdopodobne", "(3) - Umiarkowanie prawdopodobne", "(4) - Bardzo prawdopodobne", "(5) - Niezwykle prawdopodobne"] },
  { id: "Q30", section: "D", sectionTitle: "Sekcja D: Ocena Ogólna", type: "Pytanie Otwarte",
    question: "Podziel się głównymi błędami, usterkami lub blokadami, na które natrafiłeś/aś, oraz jakie usprawnienia zdecydowanie sugerujesz wprowadzić w wersji ostatecznej.",
    options: ["Otwarty komentarz tekstowy (Błędy, problemy z nawigacją, sugerowane ulepszenia)"] }
];

RENOVATE_CONFIG.questionnaireData["nl-BE"] = [
  // SECTIE A: Profiel en Digitale Geletterdheid
  { id: "Q1", section: "A", sectionTitle: "Sectie A: Profiel en Digitale Geletterdheid", type: "Enkele Keuze",
    question: "Wat is uw belangrijkste beroepsprofiel?",
    options: ["Landbouwer / Teler", "Landbouwconsulent / Adviseur", "Opleider / Professional in landbouwonderwijs", "Vertegenwoordiger toeleverende industrie (Machines / Gewasbescherming)", "Beleidsmaker / Overheidsinstantie", "Student", "Onderzoeker", "Andere"] },
  { id: "Q2", section: "A", sectionTitle: "Sectie A: Profiel en Digitale Geletterdheid", type: "Open Vraag",
    question: "Wat is uw leeftijd?",
    options: ["Open numerieke invoer (Leeftijd in jaren)"] },
  { id: "Q3", section: "A", sectionTitle: "Sectie A: Profiel en Digitale Geletterdheid", type: "Enkele Keuze",
    question: "Wat is uw geslacht?",
    options: ["Vrouw", "Man", "Zeg ik liever niet"] },
  { id: "Q4", section: "A", sectionTitle: "Sectie A: Profiel en Digitale Geletterdheid", type: "Enkele Keuze",
    question: "In welk land neemt u deel aan deze Focusgroep?",
    options: ["Portugal", "Spanje", "Frankrijk", "Italië", "België", "Polen"] },
  { id: "Q5", section: "A", sectionTitle: "Sectie A: Profiel en Digitale Geletterdheid", type: "Meerdere Keuzes",
    question: "Bij welke teelten bent u het meest betrokken in uw beroepsactiviteit? (selecteer alle van toepassing zijnde)",
    options: ["Wijnbouw", "Fruitteelt (Pitfruit / Steenfruit)", "Olijfgaarden", "Citrus", "Akkerbouw / Graangewassen", "Groenteteelt / Tuinbouw"] },
  { id: "Q6", section: "A", sectionTitle: "Sectie A: Profiel en Digitale Geletterdheid", type: "Likert-schaal (1 tot 5)",
    question: "Hoe comfortabel voelt u zich momenteel bij het gebruik van digitale tools en precisielandbouwsoftware in uw dagelijkse werkzaamheden?",
    options: ["(1) - Zeer ongemakkelijk", "(2) - Ongemakkelijk", "(3) - Niet comfortabel, niet ongemakkelijk", "(4) - Comfortabel", "(5) - Zeer comfortabel"] },

  // SECTIE B: Serious Game (Kalibratie van het Spuittoestel)
  { id: "Q7", section: "B", sectionTitle: "Sectie B: Serious Game (Kalibratie van het Spuittoestel)", type: "Likert-schaal (1 tot 5)",
    question: "Hoe duidelijk waren de toelichtingen na elk antwoord (zowel bij juiste als onjuiste antwoorden)?",
    options: ["(1) - Helemaal niet duidelijk", "(2) - Enigszins duidelijk", "(3) - Matig duidelijk", "(4) - Duidelijk", "(5) - Zeer duidelijk"] },
  { id: "Q8", section: "B", sectionTitle: "Sectie B: Serious Game (Kalibratie van het Spuittoestel)", type: "Likert-schaal (1 tot 5)",
    question: "Hoe beoordeelt u de moeilijkheidsgraad van de vragen voor iemand met uw ervaringsniveau?",
    options: ["(1) - Veel te gemakkelijk", "(2) - Vrij gemakkelijk", "(3) - Passend", "(4) - Vrij moeilijk", "(5) - Veel te moeilijk"] },
  { id: "Q9", section: "B", sectionTitle: "Sectie B: Serious Game (Kalibratie van het Spuittoestel)", type: "Likert-schaal (1 tot 5)",
    question: "Voelden de scenario's realistisch en representatief voor reële veldsituaties aan?",
    options: ["(1) - Helemaal niet realistisch", "(2) - Enigszins realistisch", "(3) - Matig realistisch", "(4) - Realistisch", "(5) - Zeer realistisch"] },
  { id: "Q10", section: "B", sectionTitle: "Sectie B: Serious Game (Kalibratie van het Spuittoestel)", type: "Likert-schaal (1 tot 5)",
    question: "Hoe nuttig was deze module om de belangrijkste kalibratiestappen op te frissen (dopkeuze, werkbreedte, rijsnelheid, debiet, verificatie)?",
    options: ["(1) - Helemaal niet nuttig", "(2) - Enigszins nuttig", "(3) - Matig nuttig", "(4) - Nuttig", "(5) - Zeer nuttig"] },
  { id: "Q11", section: "B", sectionTitle: "Sectie B: Serious Game (Kalibratie van het Spuittoestel)", type: "Likert-schaal (1 tot 5)",
    question: "Hoe boeiend vond u het quiz-achtige formaat van deze module?",
    options: ["(1) - Helemaal niet boeiend", "(2) - Weinig boeiend", "(3) - Matig boeiend", "(4) - Boeiend", "(5) - Zeer boeiend"] },
  { id: "Q12", section: "B", sectionTitle: "Sectie B: Serious Game (Kalibratie van het Spuittoestel)", type: "Likert-schaal (1 tot 5)",
    question: "Heeft de Serious Game over het algemeen aan uw verwachtingen voldaan als tool voor snel en interactief leren?",
    options: ["(1) - Bleef volledig onder de verwachtingen", "(2) - Bleef enigszins onder de verwachtingen", "(3) - Voldeed aan de verwachtingen", "(4) - Overtrof de verwachtingen", "(5) - Overtrof ruimschoots de verwachtingen"] },
  { id: "Q13", section: "B", sectionTitle: "Sectie B: Serious Game (Kalibratie van het Spuittoestel)", type: "SUS-schaal (10 Stellingen)",
    question: "System Usability Scale (SUS) - Serious Game (Beoordeel uw instemming op een schaal van 1 tot 5: Helemaal mee oneens tot Helemaal mee eens)",
    options: [
      "1. Ik denk dat ik deze tool regelmatig zou willen gebruiken.",
      "2. Ik vond deze tool onnodig complex.",
      "3. Ik vond deze tool gemakkelijk te gebruiken.",
      "4. Ik denk dat ik ondersteuning van een technisch persoon nodig zou hebben om deze tool te kunnen gebruiken.",
      "5. Ik vond dat de verschillende functies in deze tool goed geïntegreerd waren.",
      "6. Ik vond dat er te veel tegenstrijdigheden in deze tool zaten.",
      "7. Ik kan me voorstellen dat de meeste mensen deze tool heel snel leren gebruiken.",
      "8. Ik vond deze tool erg omslachtig in gebruik.",
      "9. Ik voelde me heel zeker bij het gebruik van deze tool.",
      "10. Ik moest veel dingen leren voordat ik met deze tool aan de slag kon."
    ] },
  { id: "Q14", section: "B", sectionTitle: "Sectie B: Serious Game (Kalibratie van het Spuittoestel)", type: "Open Vraag",
    question: "Wat was er eventueel verwarrend, ontbrak er of weerspiegelde niet de werkelijke praktijk in deze module?",
    options: ["Open tekstuele feedback (Suggesties, ontbrekende elementen, kwesties over realisme)"] },

  // SECTIE C: RENOVATE Simulator
  { id: "Q15", section: "C", sectionTitle: "Sectie C: RENOVATE Simulator", type: "Likert-schaal (1 tot 5)",
    question: "Hoe gemakkelijk was het om de basisbediening onder de knie te krijgen en door de simulatoromgeving te navigeren?",
    options: ["(1) - Zeer moeilijk", "(2) - Moeilijk", "(3) - Niet gemakkelijk, niet moeilijk", "(4) - Gemakkelijk", "(5) - Zeer gemakkelijk"] },
  { id: "Q16", section: "C", sectionTitle: "Sectie C: RENOVATE Simulator", type: "Likert-schaal (1 tot 5)",
    question: "Waren de instructies op het scherm, handleidingen en menu's duidelijk en goed gecontextualiseerd?",
    options: ["(1) - Helemaal niet duidelijk", "(2) - Enigszins duidelijk", "(3) - Matig duidelijk", "(4) - Duidelijk", "(5) - Zeer duidelijk"] },
  { id: "Q17", section: "C", sectionTitle: "Sectie C: RENOVATE Simulator", type: "Likert-schaal (1 tot 5)",
    question: "Hoe pedagogisch effectief was de manier waarop de praktische opdrachten werden gepresenteerd?",
    options: ["(1) - Helemaal niet effectief", "(2) - Enigszins effectief", "(3) - Matig effectief", "(4) - Effectief", "(5) - Zeer effectief"] },
  { id: "Q18", section: "C", sectionTitle: "Sectie C: RENOVATE Simulator", type: "Likert-schaal (1 tot 5)",
    question: "Weerspiegelde de simulator duidelijk de juiste besluitvormingsvolgorde voor de kalibratie van het spuittoestel?",
    options: ["(1) - Zeer verwarrend", "(2) - Verwarrend", "(3) - Niet verwarrend, niet duidelijk", "(4) - Duidelijk", "(5) - Zeer duidelijk"] },
  { id: "Q19", section: "C", sectionTitle: "Sectie C: RENOVATE Simulator", type: "Likert-schaal (1 tot 5)",
    question: "Hoe duidelijk was de berekeningstaak (bijv. debiet, werkbreedte) wanneer u waarden moest invoeren met wiskundige formules?",
    options: ["(1) - Zeer verwarrend", "(2) - Verwarrend", "(3) - Niet verwarrend, niet duidelijk", "(4) - Duidelijk", "(5) - Zeer duidelijk"] },
  { id: "Q20", section: "C", sectionTitle: "Sectie C: RENOVATE Simulator", type: "Likert-schaal (1 tot 5)",
    question: "Weerspiegelden de oefeningen voor dopconfiguratie en het instellen van het spuitvolume de reële kalibratie-uitdagingen nauwkeurig?",
    options: ["(1) - Helemaal niet nauwkeurig", "(2) - Enigszins nauwkeurig", "(3) - Matig nauwkeurig", "(4) - Nauwkeurig", "(5) - Zeer nauwkeurig"] },
  { id: "Q21", section: "C", sectionTitle: "Sectie C: RENOVATE Simulator", type: "Likert-schaal (1 tot 5)",
    question: "Hoe realistisch was de stap voor productselectie en het lezen van het etiket vóór de toepassing?",
    options: ["(1) - Helemaal niet realistisch", "(2) - Enigszins realistisch", "(3) - Matig realistisch", "(4) - Realistisch", "(5) - Zeer realistisch"] },
  { id: "Q22", section: "C", sectionTitle: "Sectie C: RENOVATE Simulator", type: "Likert-schaal (1 tot 5)",
    question: "Weerspiegelen de gebruikte variabelen en parameters (omgevingsfactoren, veldomstandigheden, machine-instellingen) realistische praktijksituaties?",
    options: ["(1) - Helemaal niet realistisch", "(2) - Enigszins realistisch", "(3) - Matig realistisch", "(4) - Realistisch", "(5) - Zeer realistisch"] },
  { id: "Q23", section: "C", sectionTitle: "Sectie C: RENOVATE Simulator", type: "Likert-schaal (1 tot 5)",
    question: "Heeft de RENOVATE Simulator over het algemeen aan uw verwachtingen voldaan als digitale opleidingstool voor gewasbescherming?",
    options: ["(1) - Bleef volledig onder de verwachtingen", "(2) - Bleef enigszins onder de verwachtingen", "(3) - Voldeed aan de verwachtingen", "(4) - Overtrof de verwachtingen", "(5) - Overtrof ruimschoots de verwachtingen"] },
  { id: "Q24", section: "C", sectionTitle: "Sectie C: RENOVATE Simulator", type: "SUS-schaal (10 Stellingen)",
    question: "System Usability Scale (SUS) - RENOVATE Simulator (Beoordeel uw instemming op een schaal van 1 tot 5: Helemaal mee oneens tot Helemaal mee eens)",
    options: [
      "1. Ik denk dat ik deze tool regelmatig zou willen gebruiken.",
      "2. Ik vond deze tool onnodig complex.",
      "3. Ik vond deze tool gemakkelijk te gebruiken.",
      "4. Ik denk dat ik ondersteuning van een technisch persoon nodig zou hebben om deze tool te kunnen gebruiken.",
      "5. Ik vond dat de verschillende functies in deze tool goed geïntegreerd waren.",
      "6. Ik vond dat er te veel tegenstrijdigheden in deze tool zaten.",
      "7. Ik kan me voorstellen dat de meeste mensen deze tool heel snel leren gebruiken.",
      "8. Ik vond deze tool erg omslachtig in gebruik.",
      "9. Ik voelde me heel zeker bij het gebruik van deze tool.",
      "10. Ik moest veel dingen leren voordat ik met deze tool aan de slag kon."
    ] },
  { id: "Q25", section: "C", sectionTitle: "Sectie C: RENOVATE Simulator", type: "Open Vraag",
    question: "Wat was er eventueel verwarrend, ontbrak er of weerspiegelde niet de werkelijke praktijk in de simulator?",
    options: ["Open tekstuele feedback (Besturing, 3D-fysica, kwesties over realisme)"] },

  // SECTIE D: Globale Evaluatie
  { id: "Q26", section: "D", sectionTitle: "Sectie D: Globale Evaluatie", type: "Open Vraag",
    question: "In uw eigen woorden: hoe effectief was het RENOVATE-platform om u te helpen de vandaag behandelde onderwerpen te leren en te begrijpen?",
    options: ["Open tekstuele feedback"] },
  { id: "Q27", section: "D", sectionTitle: "Sectie D: Globale Evaluatie", type: "Open Vraag",
    question: "Voelde het voltooien van de taken efficiënt aan — dat wil zeggen, zonder onnodige inspanning of tijdverlies?",
    options: ["Open tekstuele feedback"] },
  { id: "Q28", section: "D", sectionTitle: "Sectie D: Globale Evaluatie", type: "Open Vraag",
    question: "Hoe tevreden bent u over het algemeen met uw leerervaring van vandaag? Gelieve kort toe te lichten waarom.",
    options: ["Open tekstuele feedback"] },
  { id: "Q29", section: "D", sectionTitle: "Sectie D: Globale Evaluatie", type: "Likert-schaal (1 tot 5)",
    question: "Op basis van uw ervaring vandaag, hoe waarschijnlijk is het dat u het digitale RENOVATE-opleidingsplatform zou aanbevelen aan een collega of professional uit de landbouwsector?",
    options: ["(1) - Helemaal niet waarschijnlijk", "(2) - Weinig waarschijnlijk", "(3) - Matig waarschijnlijk", "(4) - Zeer waarschijnlijk", "(5) - Uiterst waarschijnlijk"] },
  { id: "Q30", section: "D", sectionTitle: "Sectie D: Globale Evaluatie", type: "Open Vraag",
    question: "Deel alstublieft de belangrijkste fouten, bugs of blokkades die u bent tegengekomen, en welke verbeteringen u met klem zou aanbevelen voor de definitieve versie.",
    options: ["Open tekstuele feedback (Bugs, navigatiefouten, aanbevolen verbeteringen)"] }
];

if (!RENOVATE_CONFIG.scheduleTranslations) {
  RENOVATE_CONFIG.scheduleTranslations = {};
}

RENOVATE_CONFIG.scheduleTranslations["it-IT"] = {
  "slot-1": {
    badge: "Benvenuto",
    title: "Sessione di Apertura",
    speakerLabel: "Relatore",
    speaker: "Partner RENOVATE",
    description: "Intervento di benvenuto del partner RENOVATE, accoglienza istituzionale dei partecipanti e inquadramento dei lavori.",
    embeddedText: "Accoglienza dei partecipanti, verifica delle credenziali e panoramica dell'agenda di lavoro."
  },
  "slot-2": {
    badge: "Presentazione Ufficiale",
    title: "\"Avete detto, e noi abbiamo fatto\"",
    speakerLabel: "Relatore",
    speaker: "Partner RENOVATE",
    description: "Presentazione dei risultati del Focus Group 1 e dimostrazione di come le raccomandazioni dei partecipanti siano state integrate negli strumenti digitali.",
    btnSlides: "Visualizza Presentazione Ufficiale"
  },
  "slot-3": {
    badge: "Test Pratico 1",
    title: "Test Pratico 1: Serious Game",
    speakerLabel: "Supporto Tecnico",
    speaker: "Tallentto",
    description: "Sessione pratica con il Serious Game per la taratura dell'irroratrice. I partecipanti giocano individualmente ed esplorano i 5 livelli tecnici.",
    btnAction: "Gioca a Tallentto"
  },
  "slot-4": {
    badge: "Valutazione 1",
    title: "Valutazione 1: Serious Game",
    speakerLabel: "Coordinamento",
    speaker: "Partner RENOVATE",
    description: "Compilazione del questionario di valutazione pedagogica e di usabilità SUS relativo al Serious Game.",
    btnAction: "Valuta Gioco (Modulo 1)"
  },
  "slot-5": {
    badge: "Pausa",
    title: "Pausa breve (coffee break)",
    speakerLabel: "",
    speaker: "",
    description: "Breve pausa caffè e ristoro."
  },
  "slot-6": {
    badge: "Test Pratico 2",
    title: "Test Pratico 2: Simulatore 3D",
    speakerLabel: "Supporto Tecnico",
    speaker: "Virmedex",
    description: "Sperimentazione pratica del simulatore virtuale 3D per la taratura e regolazione dell'irroratrice in un ambiente immersivo.",
    btnAction: "Gioca al Simulatore RENOVATE"
  },
  "slot-7": {
    badge: "Valutazione 2",
    title: "Valutazione 2: Simulatore 3D",
    speakerLabel: "Coordinamento",
    speaker: "Partner RENOVATE",
    description: "Compilazione del questionario di valutazione pedagogica e di usabilità SUS relativo al Simulatore RENOVATE.",
    btnAction: "Valuta Simulatore (Modulo 2)"
  },
  "slot-8": {
    badge: "Pranzo",
    title: "Pranzo",
    speakerLabel: "",
    speaker: "",
    description: "Pausa prolungata per il networking e la discussione informale sull'esperienza della mattinata."
  },
  "slot-9": {
    badge: "Valutazione Globale",
    title: "Valutazione Globale",
    speakerLabel: "Coordinamento",
    speaker: "Partner RENOVATE",
    description: "Compilazione del questionario di valutazione globale dell'esperienza, punti di forza, ostacoli e raccomandazione della piattaforma.",
    btnAction: "Invia Valutazione Globale e Concludi"
  },
  "slot-10": {
    badge: "Discussione",
    title: "Discussione Plenaria",
    speakerLabel: "Moderazione",
    speaker: "Partner RENOVATE",
    description: "Dibattito aperto e condivisione collettiva di impressioni, suggerimenti di miglioramento e discussione dei risultati preliminari."
  },
  "slot-11": {
    badge: "Chiusura",
    title: "Sessione di Chiusura",
    speakerLabel: "Relatore",
    speaker: "Partner RENOVATE",
    description: "Ringraziamenti finali, prossimi passi nel progetto RENOVATE e chiusura ufficiale dei lavori."
  }
};

RENOVATE_CONFIG.scheduleTranslations["es-ES"] = {
  "slot-1": {
    badge: "Bienvenida",
    title: "Sesión de Apertura",
    speakerLabel: "Ponente",
    speaker: "Socio RENOVATE",
    description: "Intervención de bienvenida por parte del socio de RENOVATE, acogida institucional de los participantes y contextualización de los trabajos.",
    embeddedText: "Acogida de los participantes, verificación de credenciales y presentación de la agenda de trabajo."
  },
  "slot-2": {
    badge: "Presentación Oficial",
    title: "\"Dijisteis, y lo hicimos\"",
    speakerLabel: "Ponente",
    speaker: "Socio RENOVATE",
    description: "Presentación de los resultados del Grupo Focal 1 y demostración de cómo se han integrado las recomendaciones de los participantes en las herramientas digitales.",
    btnSlides: "Ver Presentación Oficial"
  },
  "slot-3": {
    badge: "Prueba Práctica 1",
    title: "Prueba Práctica 1: Serious Game",
    speakerLabel: "Soporte Técnico",
    speaker: "Tallentto",
    description: "Sesión práctica con el Serious Game para la calibración del pulverizador. Los participantes juegan individualmente y exploran las 5 etapas técnicas.",
    btnAction: "Jugar Tallentto"
  },
  "slot-4": {
    badge: "Evaluación 1",
    title: "Evaluación 1: Serious Game",
    speakerLabel: "Coordinación",
    speaker: "Socio RENOVATE",
    description: "Cumplimentación del cuestionario de evaluación pedagógica y usabilidad SUS relativo al Serious Game.",
    btnAction: "Evaluar Juego (Formulario 1)"
  },
  "slot-5": {
    badge: "Pausa",
    title: "Pausa corta (coffee break)",
    speakerLabel: "",
    speaker: "",
    description: "Pausa breve para café y descanso."
  },
  "slot-6": {
    badge: "Prueba Práctica 2",
    title: "Prueba Práctica 2: Simulador 3D",
    speakerLabel: "Soporte Técnico",
    speaker: "Virmedex",
    description: "Experimentación práctica con el simulador virtual 3D para la calibración y ajuste de parámetros del pulverizador en un entorno inmersivo.",
    btnAction: "Jugar Simulador RENOVATE"
  },
  "slot-7": {
    badge: "Evaluación 2",
    title: "Evaluación 2: Simulador 3D",
    speakerLabel: "Coordinación",
    speaker: "Socio RENOVATE",
    description: "Cumplimentación del cuestionario de evaluación pedagógica y usabilidad SUS relativo al Simulador RENOVATE.",
    btnAction: "Evaluar Simulador (Formulario 2)"
  },
  "slot-8": {
    badge: "Almuerzo",
    title: "Almuerzo",
    speakerLabel: "",
    speaker: "",
    description: "Pausa ampliada para networking y debate informal sobre la experiencia de la mañana."
  },
  "slot-9": {
    badge: "Evaluación Global",
    title: "Evaluación Global",
    speakerLabel: "Coordinación",
    speaker: "Socio RENOVATE",
    description: "Cumplimentación del cuestionario de evaluación global de la experiencia, puntos fuertes, barreras y recomendación de la plataforma.",
    btnAction: "Enviar Evaluación Global y Finalizar"
  },
  "slot-10": {
    badge: "Debate",
    title: "Discusión Plenaria",
    speakerLabel: "Moderación",
    speaker: "Socio RENOVATE",
    description: "Debate abierto e intercambio colectivo de impresiones, sugerencias de mejora y discusión de los resultados preliminares."
  },
  "slot-11": {
    badge: "Clausura",
    title: "Sesión de Clausura",
    speakerLabel: "Ponente",
    speaker: "Socio RENOVATE",
    description: "Agradecimientos finales, próximos pasos en el proyecto RENOVATE y cierre oficial de la jornada."
  }
};

RENOVATE_CONFIG.scheduleTranslations["fr-FR"] = {
  "slot-1": {
    badge: "Accueil",
    title: "Session d'Ouverture",
    speakerLabel: "Intervenant",
    speaker: "Partenaire RENOVATE",
    description: "Intervention de bienvenue par le partenaire RENOVATE, accueil institutionnel des participants et cadrage des travaux.",
    embeddedText: "Accueil des participants, vérification des badges et présentation de l'ordre du jour."
  },
  "slot-2": {
    badge: "Présentation Officielle",
    title: "\"Vous avez dit, nous avons fait\"",
    speakerLabel: "Intervenant",
    speaker: "Partenaire RENOVATE",
    description: "Présentation des résultats du Focus Group 1 et démonstration de l'intégration des recommandations des participants dans les outils numériques.",
    btnSlides: "Voir la Présentation Officielle"
  },
  "slot-3": {
    badge: "Test Pratique 1",
    title: "Test Pratique 1 : Serious Game",
    speakerLabel: "Support Technique",
    speaker: "Tallentto",
    description: "Session pratique avec le Serious Game pour le calibrage du pulvérisateur. Les participants jouent individuellement et explorent les 5 étapes techniques.",
    btnAction: "Jouer à Tallentto"
  },
  "slot-4": {
    badge: "Évaluation 1",
    title: "Évaluation 1 : Serious Game",
    speakerLabel: "Coordination",
    speaker: "Partenaire RENOVATE",
    description: "Remplissage du questionnaire d'évaluation pédagogique et d'utilisabilité SUS concernant le Serious Game.",
    btnAction: "Évaluer le Jeu (Formulaire 1)"
  },
  "slot-5": {
    badge: "Pause",
    title: "Pause courte (pause café)",
    speakerLabel: "",
    speaker: "",
    description: "Courte pause café et rafraîchissements."
  },
  "slot-6": {
    badge: "Test Pratique 2",
    title: "Test Pratique 2 : Simulateur 3D",
    speakerLabel: "Support Technique",
    speaker: "Virmedex",
    description: "Expérimentation pratique du simulateur virtuel 3D pour le calibrage et l'ajustement des paramètres du pulvérisateur dans un environnement immersif.",
    btnAction: "Jouer au Simulateur RENOVATE"
  },
  "slot-7": {
    badge: "Évaluation 2",
    title: "Évaluation 2 : Simulateur 3D",
    speakerLabel: "Coordination",
    speaker: "Partenaire RENOVATE",
    description: "Remplissage du questionnaire d'évaluation pédagogique et d'utilisabilité SUS concernant le Simulateur RENOVATE.",
    btnAction: "Évaluer le Simulateur (Formulaire 2)"
  },
  "slot-8": {
    badge: "Déjeuner",
    title: "Déjeuner",
    speakerLabel: "",
    speaker: "",
    description: "Pause prolongée pour le réseautage et les échanges informels sur l'expérience de la matinée."
  },
  "slot-9": {
    badge: "Évaluation Globale",
    title: "Évaluation Globale",
    speakerLabel: "Coordination",
    speaker: "Partenaire RENOVATE",
    description: "Remplissage du questionnaire d'évaluation globale de l'expérience, points forts, freins et recommandation de la plateforme.",
    btnAction: "Soumettre l'Évaluation Globale et Terminer"
  },
  "slot-10": {
    badge: "Débat",
    title: "Discussion Plénière",
    speakerLabel: "Modération",
    speaker: "Partenaire RENOVATE",
    description: "Débat ouvert et partage collectif des impressions, suggestions d'amélioration et discussion des résultats préliminaires."
  },
  "slot-11": {
    badge: "Clôture",
    title: "Session de Clôture",
    speakerLabel: "Intervenant",
    speaker: "Partenaire RENOVATE",
    description: "Remerciements finaux, prochaines étapes du projet RENOVATE et clôture officielle des travaux."
  }
};

RENOVATE_CONFIG.scheduleTranslations["pl-PL"] = {
  "slot-1": {
    badge: "Powitanie",
    title: "Sesja Otwarcia",
    speakerLabel: "Prelegent",
    speaker: "Partner RENOVATE",
    description: "Wystąpienie powitalne partnera RENOVATE, oficjalne powitanie uczestników oraz nakreślenie ram prac.",
    embeddedText: "Powitanie uczestników, weryfikacja identyfikatorów i omówienie harmonogramu pracy."
  },
  "slot-2": {
    badge: "Oficjalna Prezentacja",
    title: "\"Powiedzieliście, więc zrobiliśmy\"",
    speakerLabel: "Prelegent",
    speaker: "Partner RENOVATE",
    description: "Prezentacja wyników Grupy Fokusowej 1 oraz pokaz, w jaki sposób rekomendacje uczestników zostały zintegrowane w narzędziach cyfrowych.",
    btnSlides: "Zobacz Oficjalną Prezentację"
  },
  "slot-3": {
    badge: "Test Praktyczny 1",
    title: "Test Praktyczny 1: Gra Poważna",
    speakerLabel: "Wsparcie Techniczne",
    speaker: "Tallentto",
    description: "Praktyczna sesja z Grą Poważną (Serious Game) do kalibracji opryskiwacza. Uczestnicy grają indywidualnie i poznają 5 poziomów technicznych.",
    btnAction: "Zagraj w Tallentto"
  },
  "slot-4": {
    badge: "Ewaluacja 1",
    title: "Ewaluacja 1: Gra Poważna",
    speakerLabel: "Koordynacja",
    speaker: "Partner RENOVATE",
    description: "Wypełnienie kwestionariusza oceny pedagogicznej i użyteczności SUS dla Gry Poważnej.",
    btnAction: "Oceń Grę (Formularz 1)"
  },
  "slot-5": {
    badge: "Przerwa",
    title: "Krótka przerwa (przerwa na kawę)",
    speakerLabel: "",
    speaker: "",
    description: "Krótka przerwa na kawę i poczęstunek."
  },
  "slot-6": {
    badge: "Test Praktyczny 2",
    title: "Test Praktyczny 2: Symulator 3D",
    speakerLabel: "Wsparcie Techniczne",
    speaker: "Virmedex",
    description: "Praktyczne doświadczenie z wirtualnym symulatorem 3D w zakresie kalibracji i ustawiania parametrów opryskiwacza w immersyjnym środowisku.",
    btnAction: "Uruchom Symulator RENOVATE"
  },
  "slot-7": {
    badge: "Ewaluacja 2",
    title: "Ewaluacja 2: Symulator 3D",
    speakerLabel: "Koordynacja",
    speaker: "Partner RENOVATE",
    description: "Wypełnienie kwestionariusza oceny pedagogicznej i użyteczności SUS dla Symulatora RENOVATE.",
    btnAction: "Oceń Symulator (Formularz 2)"
  },
  "slot-8": {
    badge: "Obiad",
    title: "Obiad",
    speakerLabel: "",
    speaker: "",
    description: "Dłuższa przerwa na nawiązywanie kontaktów i nieformalne dyskusje na temat porannych doświadczeń."
  },
  "slot-9": {
    badge: "Ocena Ogólna",
    title: "Ocena Ogólna",
    speakerLabel: "Koordynacja",
    speaker: "Partner RENOVATE",
    description: "Wypełnienie kwestionariusza ogólnej oceny doświadczeń, mocnych stron, napotkanych barier oraz rekomendacji platformy.",
    btnAction: "Prześlij Ogólną Ocenę i Zakończ"
  },
  "slot-10": {
    badge: "Dyskusja",
    title: "Dyskusja Plenarna",
    speakerLabel: "Moderacja",
    speaker: "Partner RENOVATE",
    description: "Otwarta debata, zbiorowa wymiana wrażeń, sugestie ulepszeń oraz dyskusja nad wstępnymi wynikami."
  },
  "slot-11": {
    badge: "Zakończenie",
    title: "Sesja Zamykająca",
    speakerLabel: "Prelegent",
    speaker: "Partner RENOVATE",
    description: "Słowa podziękowania, kolejne kroki w projekcie RENOVATE oraz oficjalne zakończenie spotkania."
  }
};

RENOVATE_CONFIG.scheduleTranslations["nl-BE"] = {
  "slot-1": {
    badge: "Welkom",
    title: "Openingssessie",
    speakerLabel: "Spreker",
    speaker: "RENOVATE-partner",
    description: "Welkomstwoord door de RENOVATE-partner, institutionele verwelkoming van de deelnemers en toelichting op de werkzaamheden.",
    embeddedText: "Ontvangst van de deelnemers, badgecontrole en toelichting op de werkagenda."
  },
  "slot-2": {
    badge: "Officiële Presentatie",
    title: "\"U vroeg, wij leverden\"",
    speakerLabel: "Spreker",
    speaker: "RENOVATE-partner",
    description: "Presentatie van de resultaten van Focusgroep 1 en toelichting op de wijze waarop de aanbevelingen van de deelnemers zijn geïntegreerd in de digitale tools.",
    btnSlides: "Bekijk Officiële Presentatie"
  },
  "slot-3": {
    badge: "Praktijktest 1",
    title: "Praktijktest 1: Serious Game",
    speakerLabel: "Technische Ondersteuning",
    speaker: "Tallentto",
    description: "Praktische sessie met de Serious Game voor kalibratie van het spuittoestel. Deelnemers spelen individueel en verkennen de 5 technische niveaus.",
    btnAction: "Speel Tallentto"
  },
  "slot-4": {
    badge: "Evaluatie 1",
    title: "Evaluatie 1: Serious Game",
    speakerLabel: "Coördinatie",
    speaker: "RENOVATE-partner",
    description: "Invullen van de vragenlijst voor pedagogische evaluatie en SUS-gebruiksvriendelijkheid met betrekking tot de Serious Game.",
    btnAction: "Evalueer Spel (Formulier 1)"
  },
  "slot-5": {
    badge: "Pauze",
    title: "Korte pauze (koffiepauze)",
    speakerLabel: "",
    speaker: "",
    description: "Korte pauze voor koffie en versnaperingen."
  },
  "slot-6": {
    badge: "Praktijktest 2",
    title: "Praktijktest 2: 3D-Simulator",
    speakerLabel: "Technische Ondersteuning",
    speaker: "Virmedex",
    description: "Praktische ervaring met de virtuele 3D-simulator voor kalibratie en afstelling van spuitparameters in een immersieve omgeving.",
    btnAction: "Speel RENOVATE Simulator"
  },
  "slot-7": {
    badge: "Evaluatie 2",
    title: "Evaluatie 2: 3D-Simulator",
    speakerLabel: "Coördinatie",
    speaker: "RENOVATE-partner",
    description: "Invullen van de vragenlijst voor pedagogische evaluatie en SUS-gebruiksvriendelijkheid met betrekking tot de RENOVATE Simulator.",
    btnAction: "Evalueer Simulator (Formulier 2)"
  },
  "slot-8": {
    badge: "Lunch",
    title: "Lunch",
    speakerLabel: "",
    speaker: "",
    description: "Verlengde pauze voor netwerken en informele uitwisseling over de ervaringen van de ochtendsessie."
  },
  "slot-9": {
    badge: "Globale Evaluatie",
    title: "Globale Evaluatie",
    speakerLabel: "Coördinatie",
    speaker: "RENOVATE-partner",
    description: "Invullen van de algemene evaluatievragenlijst over de ervaring, sterke punten, knelpunten en aanbeveling van het platform.",
    btnAction: "Globale Evaluatie Indienen & Afronden"
  },
  "slot-10": {
    badge: "Discussie",
    title: "Plenaire Discussie",
    speakerLabel: "Moderatie",
    speaker: "RENOVATE-partner",
    description: "Open debat en gezamenlijke uitwisseling van indrukken, verbetervoorstellen en bespreking van de voorlopige resultaten."
  },
  "slot-11": {
    badge: "Afsluiting",
    title: "Afsluitende Sessie",
    speakerLabel: "Spreker",
    speaker: "RENOVATE-partner",
    description: "Dankwoord, volgende stappen binnen het RENOVATE-project en officiële afsluiting van de werkzaamheden."
  }
};

// Exposição no window
window.RENOVATE_CONFIG = RENOVATE_CONFIG;

// Fallback global de inicialização da Firebase Realtime Database
window.RENOVATE_FIREBASE_URL = "https://renovate-fg2-default-rtdb.europe-west1.firebasedatabase.app";
