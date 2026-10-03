/**
 * RENOVATE FG2 - Internationalisation (i18n) Module
 * Suporte bilingue para pt-PT (predefinido) e en-GB (British English)
 * 2ª Sessão do Grupo Focal RENOVATE | ESAS Santarém
 */

window.I18nManager = (function () {
  const STORAGE_KEY = "renovate_lang";
  const DEFAULT_LANG = "pt-PT";
  const SUPPORTED_LANGS = ["pt-PT", "en-GB"];

  let currentLang = DEFAULT_LANG;

  // Dicionário Completo de Traduções (pt-PT e en-GB)
  const translations = {
    "pt-PT": {
      // Document Title
      "meta.title": "RENOVATE - 2ª Sessão do Grupo Focal | ESAS Santarém",

      // Header & Navigation
      "header.title": "2ª Sessão do Grupo Focal",
      "header.subtitle": "06 Outubro 2026 • ESAS - Santarém",
      "nav.live": "Sessão ao Vivo",
      "nav.program": "Programa & Slides",
      "nav.fg1": "Grupo Focal 1 (Lisboa)",
      "nav.results": "Resultados & Media",
      "nav.moderation": "🔒 Moderação",
      "nav.mobile.live": "Ao Vivo",
      "nav.mobile.program": "Programa",
      "nav.mobile.fg1": "GF1",
      "nav.mobile.results": "Resultados",
      "nav.mobile.moderation": "Moderação",
      "mod.badgeRole": "Perfil Moderador Ativo",
      "mod.viewTitle": "Painel de Moderação e Gestão de Sala",
      "mod.viewSubtitle": "Controlo em tempo real da sessão do Grupo Focal RENOVATE • ESAS Santarém",

      // Live Session (Tab 1)
      "live.guidedFlow": "Fluxo Guiado Interativo",
      "live.mainTitle": "Sessão Prática de Validação Digital",
      "live.mainDesc": "Siga cada fase da sessão técnica. Os passos práticos são desbloqueados em sintonia com a moderação da sala. O seu código é injetado automaticamente nos formulários.",
      "live.banner.title": "Código de Participante",
      "live.banner.placeholder": "Ex: P01 a P50",
      "live.banner.saveBtn": "Guardar",
      "live.banner.notice": "Introduza o seu código para associar as respostas.",
      "live.notSet": "Não definido",

      "live.step1.badge": "Credenciação",
      "live.step1.title": "Passo 1: Identificação de Participante",
      "live.step1.desc": "Atribuição do código individual gravado no dispositivo. Este código garante o anonimato e unifica os resultados nos questionários do estudo.",
      "live.step1.activeCodeLabel": "Código Ativo:",
      "live.step1.configuredTop": "Configurado no Topo",
      "live.step1.checkbox": "Marcar Passo 1 como Concluído",
      "live.step1.completed": "Passo 1 Concluído",

      "live.step2.badge": "Apresentação Oficial",
      "live.step2.title": 'Passo 2: "Disseram, e nós fizemos"',
      "live.step2.desc": "Breve recapitulação do GF1 e apresentação oficial dos diapositivos integrando o feedback dos participantes nas novas ferramentas.",
      "live.step2.schedule": "Ver Slides no Programa (10:10)",
      "live.step2.checkbox": "Marcar Passo 2 como Concluído",
      "live.step2.completed": "Passo 2 Concluído",

      "live.step3.badge": "Smartphone / Tablet",
      "live.step3.title": "Passo 3: Serious Game (Tallentto)",
      "live.step3.desc": "Dinâmica de formação lúdica focada em calibração e boas práticas fitossanitárias, seguida de questionário de avaliação.",
      "live.step3.btnGame": "Jogar Tallentto",
      "live.step3.btnForm": "Avaliar Jogo (Form 1)",
      "live.step3.checkbox": "Marcar Passo 3 como Concluído",
      "live.step3.completed": "Passo 3 Concluído",

      "live.step4.badge": "Computador PC / Portátil",
      "live.step4.title": "Passo 4: Simulador Virtual (Virmedex)",
      "live.step4.desc": "Ambiente de simulação 3D para otimização de parâmetros de pulverização, mitigação de deriva e análise de eficácia de campo.",
      "live.step4.btnSim": "Abrir Simulador",
      "live.step4.btnForm": "Avaliar Simulador (Form 2)",
      "live.step4.checkbox": "Marcar Passo 4 como Concluído",
      "live.step4.completed": "Passo 4 Concluído",

      "live.step5.badge": "Formulário Final",
      "live.step5.title": "Passo 5: Síntese & Encerramento",
      "live.step5.desc": "Questionário de satisfação global, recomendações para o consórcio e acesso aos materiais técnicos da DATERRA.",
      "live.step5.btnForm": "Submeter Avaliação Global & Concluir",
      "live.step5.checkbox": "Marcar Sessão como Totalmente Concluída",
      "live.step5.completed": "Sessão Totalmente Concluída",
      "live.badge.completed": "Concluído",

      "live.unlocked": "Desbloqueado",
      "live.badge.unlocked": "Desbloqueado",
      "live.waitingModerator": "Aguarda Moderador",
      "live.badge.waiting": "Aguarda Moderador",

      // Programme & Slides (Tab 2)
      "program.badge": "Cronograma Oficial da Sessão",
      "program.title": "Programa Oficial dos Trabalhos",
      "program.subtitle": "06 de outubro de 2026 • Auditório ESAS - Santarém • Clique em cada fase para expandir",
      "program.expand": "Expandir Todos",
      "program.collapse": "Recolher",
      "program.print": "Imprimir",
      "program.speakers": "Intervenientes:",

      // Focus Group 1 (Tab 3)
      "fg1.badge": "Lisboa • 22 de outubro de 2024",
      "fg1.title": "1ª Sessão do Grupo Focal RENOVATE",
      "fg1.desc": "O primeiro Grupo Focal em Portugal reuniu peritos agrários, formadores e consultores para mapear as principais necessidades de formação em proteção sustentável das culturas e analisar a permeabilidade do setor a soluções digitais.",
      "fg1.videoTitle": "Vídeo Oficial do Grupo Focal 1 (Lisboa)",
      "fg1.videoDesc": "Reportagem audiovisual e testemunhos dos participantes da sessão inaugural.",
      "fg1.videoBtn": "Ver no YouTube",
      "fg1.videoPlay": "Clique para reproduzir em alta resolução",
      "fg1.videoCaption": "O primeiro Grupo Focal em Portugal juntou especialistas, consultores e produtores para definir os requisitos das ferramentas pedagógicas digitais.",
      "fg1.newsBadge": "Página de Notícias da DATERRA",
      "fg1.newsTitle": "Grupo Focal RENOVATE: Primeira Sessão em Lisboa Reúne Agricultores e Especialistas",
      "fg1.newsDesc": "Consulte a cobertura jornalística completa, os testemunhos dos intervenientes e o resumo das perspetivas recolhidas na primeira sessão em Lisboa.",
      "fg1.newsBtn": "Ler Notícia na DATERRA",
      "fg1.docBadge": "Documento Oficial (PDF)",
      "fg1.docTitle": "Conclusões da 1ª Sessão do Grupo Focal RENOVATE",
      "fg1.docDesc": "Aceda ao relatório executivo com a síntese de resultados, mapeamento de competências e as recomendações técnicas prioritárias apuradas pelo consórcio.",
      "fg1.docBtn": "Abrir Documento de Conclusões (PDF)",
      "fg1.highlightsTitle": "Principais Conclusões & Diretrizes Extraídas",
      "fg1.galleryTitle": "Galeria Fotográfica do Grupo Focal 1",
      "fg1.galleryDesc": "Registo fotográfico das dinâmicas e grupos de trabalho em Lisboa.",
      "lightbox.close": "Fechar",

      // Results & Media (Tab 4)
      "results.loading": "A carregar resultados...",
      "results.waiting": "Aguardando dados...",
      "results.badge.connected": "Google Sheets Conectado (Em Tempo Real)",
      "results.badge.waiting": "Google Sheets Conectado (Aguardando Respostas)",
      "results.badge.demo": "Modo Demonstração (Dados de Pré-Visualização)",
      "results.title": "Dashboard de Resultados & Validação",
      "results.subtitle": "Análise em tempo real das respostas recolhidas nos 3 questionários da 2ª Sessão do Grupo Focal (ESAS Santarém).",
      "results.refreshBtn": "Atualizar Dados",
      "results.configBtn": "Conexão Sheets",
      "results.sheetsMenuTitle": "Conexão Automática Ativa",
      "results.sheetsAutoSync": "Auto-Sync",
      "results.sheetsMenuDesc": "O dashboard sincroniza automaticamente em tempo real com as respostas submetidas nas folhas Google Sheets:",
      "results.sheetQ1Title": "Questionário 1: Serious Game",
      "results.sheetQ1Sub": "Demografia, Usabilidade SUS & Feedback Game",
      "results.sheetQ2Title": "Questionário 2: Simulador",
      "results.sheetQ2Sub": "Calibração, Usabilidade SUS & Simulação",
      "results.sheetQ3Title": "Questionário 3: Global / NPS",
      "results.sheetQ3Sub": "Recomendação RENOVATE & Síntese Final",
      "results.sheetAllTitle": "Abrir Folha Completa (3 Separadores)",
      "results.sheetAllSub": "Visualizar todas as respostas no Google Docs",
      "results.syncNow": "Sincronizar Agora",
      
      // KPI Strip
      "results.kpi.sample": "Amostra Total",
      "results.kpi.participants": "participantes",
      "results.kpi.venue": "Sessão Prática na ESAS Santarém",
      "results.kpi.susGame": "SUS Serious Game",
      "results.kpi.susGameBench": "Bom / Acima da Média",
      "results.kpi.susSim": "SUS Simulador 3D",
      "results.kpi.susSimBench": "Excelente",
      "results.kpi.nps": "Recomendação RENOVATE (Q29)",
      "results.kpi.npsZone": "Elevada Intenção de Recomendação",

      // Filters
      "results.filter.all": "Visão Global",
      "results.filter.demographics": "Demografia",
      "results.filter.sus": "Usabilidade SUS",
      "results.filter.pedagogical": "Avaliação Pedagógica",
      "results.filter.feedback": "Sugestões & Melhorias",
      "results.filter.wordcloud": "Nuvem de Palavras",

      // Word Cloud
      "results.wc.title": "Nuvem de Palavras: A Experiência em 3 Palavras",
      "results.wc.desc": "Frequência de termos e adjetivos espontâneos indicados pelos participantes no final de cada ferramenta.",
      "results.wc.game": "Serious Game",
      "results.wc.sim": "Simulador RENOVATE",
      "results.wc.topCited": "Mais Citadas",
      "results.wc.note": "Stopwords filtradas automaticamente.",

      // SUS
      "results.sus.title": "System Usability Scale (SUS) - Análise Comparativa",
      "results.sus.desc": "Comparação das 10 dimensões estandardizadas (Brooke, 1996) entre o Serious Game (Q13) e o Simulador (Q24).",
      "results.sus.benchmark": "Benchmark Indústria = 68.0 pts",
      "results.sus.unacceptable": "0 (Inaceitável)",
      "results.sus.marginal": "50 (Marginal)",
      "results.sus.globalAvg": "68 (Média Mundial)",
      "results.sus.excellent": "80 (Excelente)",
      "results.sus.gradeA": "100 (Classe A)",
      "results.sus.risk": "Zona de Risco (<50)",
      "results.sus.acceptable": "Zona de Aceitação Média (68-80)",
      "results.sus.excellence": "Zona de Excelência (>80)",

      // Pedagogical
      "results.ped.title": "Eficácia Pedagógica & Módulos Técnicos de Calibração",
      "results.ped.desc": "Avaliação detalhada da clareza, realismo dos cenários, cálculo de débito e correspondência às práticas de campo.",
      "results.ped.gameTitle": "Serious Game (Q7 a Q12)",
      "results.ped.gameBadge": "Radar Pedagógico",
      "results.ped.simTitle": "Módulos do Simulador (Q15 a Q23)",
      "results.ped.simBadge": "Média (1 a 5)",

      // Demographics
      "results.demo.title": "Caracterização da Amostra & Literacia Digital",
      "results.demo.desc": "Distribuição dos participantes por perfil profissional (Q1), culturas agrícolas acompanhadas (Q5) e literacia agronómica digital (Q6).",
      "results.demo.profileTitle": "Perfil Profissional (Q1)",
      "results.demo.cropsTitle": "Culturas com Maior Representatividade (Q5)",
      "results.demo.digitalTitle": "Literacia Digital Agrícola (Q6)",
      "results.demo.digitalDesc": "Quão confortáveis se sentem os participantes na utilização diária de software de agricultura de precisão antes da formação.",
      "results.demo.digitalLevel": "Nível de Literacia Digital Intermédio-Alto",
      "results.demo.conclusionTitle": "Conclusão Metodológica:",
      "results.demo.conclusionText": "A amostra valida que os simuladores têm adesão intuitiva mesmo entre operadores com conforto digital moderado.",

      // NPS & Feedback
      "results.nps.title": "Recomendação RENOVATE (Q29)",
      "results.nps.scale": "5 Níveis de Probabilidade",
      "results.nps.scoreLabel": "Score Médio:",
      "results.nps.zoneText": "(Muito ou Extremamente provável)",
      "results.feedback.title": "Voz dos Participantes: Sugestões & Bloqueios Identificados",

      // Deliverable 1.3 & Media (Entregável 1.3)
      "results.deliv.code": "Entregável 1.3",
      "results.deliv.status": "Relatório Oficial • Horizonte Europa",
      "results.deliv.link": "Descarregar Relatório Oficial PDF (2.0 MB) →",
      "results.deliv.title": "Relatório de Análise de Expectativas de Formação e Resultados das Reuniões dos Grupos Focais",
      "results.deliv.abstract": "Relatório oficial que consolida as expectativas de 153 intervenientes do setor agrícola em 6 países europeus (PT, ES, FR, IT, BE, PL), estabelecendo as diretrizes técnicas e pedagógicas da plataforma RENOVATE, Serious Games e simuladores 3D.",
      "results.deliv.highlightsTitle": "Principais Conclusões & Diretrizes Extraídas",
      // Vídeo Oficial do Grupo Focal 2 (Santarém)
      "results.gf2video.title": "Vídeo Oficial do Grupo Focal 2 (Santarém)",
      "results.gf2video.desc": "Reportagem audiovisual, dinâmicas de formação e testemunhos dos participantes na ESAS.",
      "results.gf2video.badge": "Em Produção • Brevemente",
      "results.gf2video.boxTitle": "Vídeo do Grupo Focal 2 em Fase de Captação e Edição",
      "results.gf2video.boxText": "A reportagem audiovisual oficial com as demonstrações do Serious Game, Simulador 3D e entrevistas aos participantes será publicada aqui após a conclusão dos trabalhos.",
      "results.gf2video.boxBadge": "Disponível após 06 de Outubro de 2026",
      "results.gf2video.footer": "Reportagem Audiovisual DATERRA & RENOVATE",
      "results.gf2video.caption": "A cobertura audiovisual integra o Entregável 1.4 do projeto RENOVATE e servirá de suporte à disseminação das ferramentas digitais a nível europeu.",

      // Galeria Fotográfica do Grupo Focal 2 (Etapas do Programa)
      "results.gallery.title": "Galeria Fotográfica do Grupo Focal 2 (Santarém)",
      "results.gallery.desc": "Registo fotográfico organizado pelas etapas do programa oficial da sessão na ESAS.",

      // Consortium & Partners
      "consortium.partnersCount": "16 parceiros",
      "consortium.countriesCount": "8 países",
      "consortium.desc": "Consórcio de investigação aplicada para a transição digital e sustentabilidade agrária.",
      "consortium.portalLink": "Visitar Portal Oficial RENOVATE",
      "host.badge": "Entidade Anfitriã da 2ª Sessão do Grupo Focal",
      "host.visit": "Website ESAS",

      // Footer
      "footer.projectCoord": "Projeto & Coordenação",
      "footer.initiativesHost": "Iniciativas & Anfitrião",
      "footer.projectLabel": "Projeto",
      "footer.orgInitiatives": "Organização & Iniciativas",
      "footer.hostLabel": "Anfitrião",
      "footer.project": "Projeto RENOVATE",
      "footer.daterra": "DATERRA",
      "footer.eurotech": "EuroTech Day",
      "footer.esas": "Escola Superior Agrária de Santarém",

      // Moderator Modal
      "mod.title": "Painel do Moderador",
      "mod.subtitle": "Controlo de Desbloqueio das Fases",
      "mod.pinDesc": "Introduza o PIN de segurança para aceder aos comandos de gestão da sessão.",
      "mod.pinPlaceholder": "Introduzir PIN",
      "mod.authBtn": "Autenticar Moderador",
      "mod.pinError": "PIN incorreto. Tente novamente.",
      "mod.statusHeader": "Estado das Fases",
      "mod.unlockUpto": "Desbloquear até ao Passo:",
      "mod.upto1": "Até 1",
      "mod.upto2": "Até 2",
      "mod.upto3": "Até 3",
      "mod.upto4": "Até 4",
      "mod.upto5": "Até 5",
      "mod.unlockAll": "Desbloquear Tudo",
      "mod.reset": "Repor Padrão",
      "mod.gotoResults": "Ver Dashboard de Resultados",
      "mod.qrShortcut": "Atalho de Desbloqueio via URL:",
      "mod.qrDesc": "Pode projetar ou partilhar com os participantes um QR code com o parâmetro:",

      // Módulo de Autenticação & Área Reservada
      "auth.modalTitle": "RENOVATE — Plataforma de Avaliação de Ferramentas Digitais",
      "auth.modalSubtitle": "Área Reservada de Testes & Avaliação",
      "auth.euBadge": "Horizonte Europa | Projeto RENOVATE",
      "auth.phase1Badge": "Fase 1: Sessão Presencial",
      "auth.phase2Badge": "Fase 2: Testes Remotos",
      "auth.codePlaceholder": "Escreva ou selecione o seu código",
      "auth.selectCode": "Selecione o seu Código de Participante...",
      "auth.codeHelpPresential": "Selecione o código individual do seu crachá (FG2-PT).",
      "auth.codeHelpRemote": "Selecione o código individual atribuído por e-mail (NS-PT).",
      "auth.phase2Notice": "A sessão presencial do Grupo Focal está concluída. Se solicitou acesso para teste remoto via e-mail, selecione o seu código atribuído.",
      "auth.keyLabel": "Chave de Acesso ao Evento / Chave Convidado",
      "auth.keyPlaceholder": "Fornecida pela Organização.",
      "auth.keyToggle": "Mostrar ou ocultar chave",
      "auth.rgpdConsent": "Declaro que li o Consentimento Informado e aceito a participação na avaliação destas ferramentas digitais, bem como o tratamento estritamente anónimo dos dados recolhidos para efeitos do projeto europeu RENOVATE, em conformidade com o RGPD (Regulamento (UE) 2016/679).",
      "auth.rgpdReadTerms": "Consultar Termos & RGPD",
      "auth.enterBtn": "Entrar na Área Reservada",
      "auth.exitBtn": "Sair",
      "auth.maintenanceTitle": "Plataforma em Manutenção Técnica",
      "auth.maintenanceNotice": "A plataforma RENOVATE encontra-se temporariamente fechada para atualização de conteúdos e implementação técnica. O acesso será reaberto na próxima janela de testes.",
      "auth.errorSelectCode": "Por favor selecione o seu Código de Participante.",
      "auth.errorInvalidKey": "Chave de acesso incorreta. Por favor verifique e tente novamente.",
      "auth.errorRgpd": "É obrigatório aceitar os termos de consentimento RGPD para aceder.",
      "auth.errorMaintenance": "A plataforma encontra-se temporariamente fechada para atualização de conteúdos e implementação técnica.",
      "auth.successWelcome": "Bem-vindo à Área Reservada RENOVATE!",
      "auth.logout": "Sair",
      "auth.logoutConfirm": "Deseja realmente terminar a sessão e bloquear o acesso?",
      "auth.badgePresential": "Presencial (FG2)",
      "auth.rgpdModalTitle": "Consentimento Informado & Proteção de Dados (RGPD)",
      "auth.rgpdModalSubtitle": "Projeto Europeu RENOVATE • Horizonte Europa",
      "auth.rgpdSec1Title": "1. Enquadramento e Objetivos",
      "auth.rgpdSec1Text": "O projeto europeu RENOVATE visa capacitar e modernizar a formação agrícola através de ferramentas digitais inovadoras, designadamente simuladores virtuais 3D e Serious Games pedagógicos focados na proteção sustentável das culturas e aplicação responsável de produtos fitossanitários.",
      "auth.rgpdSec2Title": "2. Anonimização Total e Tratamento de Dados",
      "auth.rgpdSec2TextPrefix": "Todas as respostas aos questionários e interações na plataforma são <strong>estritamente anónimas</strong>. A identificação é efetuada única e exclusivamente ",
      "auth.rgpdSec2TextSuffix": ". Não é recolhido nem armazenado nenhum nome, morada, endereço de correio eletrónico pessoal ou dado biométrico nos relatórios científicos.",
      "auth.rgpdSec3Title": "3. Conformidade com o RGPD (Regulamento UE 2016/679)",
      "auth.rgpdSec3Text": "Os dados recolhidos destinam-se exclusivamente à avaliação estatística, científica e pedagógica no âmbito dos entregáveis oficiais do consórcio RENOVATE financiado pelo programa Horizonte Europa da Comissão Europeia. Os resultados agregados serão publicados em relatórios técnicos de livre acesso.",
      "auth.rgpdSec4Title": "4. Caráter Voluntário",
      "auth.rgpdSec4Text": "A sua participação é inteiramente voluntária, podendo interromper a qualquer momento o preenchimento dos formulários ou teste das ferramentas sem qualquer prejuízo.",
      "auth.rgpdModalClose": "Compreendi e Fechar",
      "auth.activeSession": "Sessão Ativa",
      "auth.lockedBanner": "Acesso Restrito",

      // Painel do Moderador - Controlo de Acessos
      "mod.accessControlTitle": "Controlo de Acessos & Plataforma",
      "mod.systemStatusLabel": "Estado do Sistema (system_status):",
      "mod.statusOpen": "Aberto para Testes",
      "mod.statusMaintenance": "Fechado para Manutenção",
      "mod.phaseModeLabel": "Modo de Fase de Acesso:",
      "mod.phaseAuto": "Automático por Calendário (06/10 presencial, 07/10+ remoto)",
      "mod.phase1Manual": "Forçar Fase 1: Presencial (FG2-PT01 a PT50)",
      "mod.phase2Manual": "Forçar Fase 2: Pós-Evento / Remoto (NS-PT01 a PT50)",
      "mod.activeKeyLabel": "Chave de Acesso Personalizada:",
      "mod.activeSessionLabel": "Sessão Ativa no Navegador:",
      "mod.forceLogoutBtn": "Terminar Sessão Atual (Logout)",
      "mod.saveSettings": "Aplicar Configurações",

      // Painel de Moderação e Gestão de Sala (5 Pilares)
      "mod.panelTitle": "Painel de Moderação e Gestão de Sala",
      "mod.panelSubtitle": "Controlo em Tempo Real • 2ª Sessão do Grupo Focal RENOVATE",
      "mod.tabAccess": "Controlo de Acesso & Fases",
      "mod.tabParticipants": "Participantes & Submissões",
      "mod.tabTiming": "Gestão de Tempo & Desvios",
      "mod.projectQrBtn": "Projetar QR Code do Site",
      "mod.lockPanelBtn": "Bloquear Painel",
      "mod.authModalTitle": "Autenticação de Moderação",
      "mod.authModalSubtitle": "Acesso Restrito à Gestão de Sala",
      "mod.authPasswordLabel": "Palavra-passe do Moderador",
      "mod.authPasswordPlaceholder": "Introduza a palavra-passe...",
      "mod.authEnterBtn": "Entrar no Painel",
      "mod.targetParticipantsLabel": "Total de Participantes em Sala:",
      "mod.targetParticipantsDesc": "Número de pessoas presentes para cálculo automático da taxa de conclusão.",
      "mod.submissionsHeader": "Monitores de Submissão nos Formulários Google",
      "mod.submissionsDesc": "Contagem em tempo real (fetch a cada 10s aos CSVs dos Google Sheets).",
      "mod.refreshNow": "Atualizar Agora",
      "mod.stopwatchTitle": "Cronómetro de Etapa Ativa",
      "mod.stopwatchStart": "Iniciar",
      "mod.stopwatchPause": "Pausar",
      "mod.stopwatchReset": "Repor",
      "mod.delayStageLabel": "Etapa Selecionada no Programa Oficial:",
      "mod.schedStartLabel": "Início Agendado:",
      "mod.schedEndLabel": "Fim Agendado:",
      "mod.schedDurationLabel": "Duração Prevista:",
      "mod.realStartLabel": "Hora Real de Início:",
      "mod.realStartNowBtn": "Usar Hora Atual",
      "mod.driftTitle": "Selo de Desvio da Agenda:",
      "mod.newEstEndLabel": "Nova Previsão de Conclusão:",
      "mod.qrModalTitle": "Acesso à Plataforma RENOVATE — Grupo Focal 2",
      "mod.qrModalSubtitle": "Área Reservada de Testes & Avaliação • Sessão ao Vivo",
      "mod.qrInstructions": "Aponte a câmara do telemóvel para aceder diretamente à aplicação web.",
      "mod.qrReconnectNotice": "Se fechou o browser no smartphone/PC ou perdeu a ligação, leia este código ou aceda ao link para regressar à Sessão ao Vivo.",
      "mod.qrCopyLink": "Copiar Link",
      "mod.qrFullscreen": "Ecrã Inteiro",
      "mod.qrClose": "Fechar Projeção"
    },

    "en-GB": {
      // Document Title
      "meta.title": "RENOVATE - 2nd Focus Group Session | ESAS Santarém",

      // Header & Navigation
      "header.title": "2nd Focus Group Session",
      "header.subtitle": "06 October 2026 • ESAS - Santarém",
      "nav.live": "Live Session",
      "nav.program": "Programme & Slides",
      "nav.fg1": "Focus Group 1 (Lisbon)",
      "nav.results": "Results & Media",
      "nav.moderation": "🔒 Moderation",
      "nav.mobile.live": "Live",
      "nav.mobile.program": "Programme",
      "nav.mobile.fg1": "FG1",
      "nav.mobile.results": "Results",
      "nav.mobile.moderation": "Moderation",
      "mod.badgeRole": "Moderator Role Active",
      "mod.viewTitle": "Moderation & Room Management Panel",
      "mod.viewSubtitle": "Real-time session controls for RENOVATE Focus Group • ESAS Santarém",

      // Live Session (Tab 1)
      "live.guidedFlow": "Interactive Guided Flow",
      "live.mainTitle": "Hands-on Digital Validation Session",
      "live.mainDesc": "Follow each stage of the technical session. Hands-on steps are unlocked in coordination with room moderation. Your participant code is automatically attached to questionnaires.",
      "live.banner.title": "Participant Code",
      "live.banner.placeholder": "e.g. P01 to P50",
      "live.banner.saveBtn": "Save",
      "live.banner.notice": "Enter your participant code to attach your responses.",
      "live.notSet": "Not set",

      "live.step1.badge": "Registration",
      "live.step1.title": "Step 1: Participant Identification",
      "live.step1.desc": "Assignment of individual participant code saved on this device. This code ensures anonymity while linking your responses across the study questionnaires.",
      "live.step1.activeCodeLabel": "Active Code:",
      "live.step1.configuredTop": "Configured at Top",
      "live.step1.checkbox": "Mark Step 1 as Completed",
      "live.step1.completed": "Step 1 Completed",

      "live.step2.badge": "Official Presentation",
      "live.step2.title": 'Step 2: "You said, and we delivered"',
      "live.step2.desc": "Brief recap of FG1 and official presentation slides showing how participant feedback was integrated into the new tools.",
      "live.step2.schedule": "View Slides in Programme (10:10)",
      "live.step2.checkbox": "Mark Step 2 as Completed",
      "live.step2.completed": "Step 2 Completed",

      "live.step3.badge": "Smartphone / Tablet",
      "live.step3.title": "Step 3: Serious Game (Tallentto)",
      "live.step3.desc": "Gamified interactive training dynamic focused on sprayer calibration and crop protection best practices, followed by evaluation questionnaire.",
      "live.step3.btnGame": "Play Tallentto",
      "live.step3.btnForm": "Evaluate Game (Form 1)",
      "live.step3.checkbox": "Mark Step 3 as Completed",
      "live.step3.completed": "Step 3 Completed",

      "live.step4.badge": "PC / Laptop",
      "live.step4.title": "Step 4: Virtual Simulator (Virmedex)",
      "live.step4.desc": "3D simulation environment for sprayer parameter optimisation, drift reduction, and field efficacy analysis.",
      "live.step4.btnSim": "Open Simulator",
      "live.step4.btnForm": "Evaluate Simulator (Form 2)",
      "live.step4.checkbox": "Mark Step 4 as Completed",
      "live.step4.completed": "Step 4 Completed",

      "live.step5.badge": "Final Questionnaire",
      "live.step5.title": "Step 5: Synthesis & Wrap-up",
      "live.step5.desc": "Overall satisfaction questionnaire, recommendations for the consortium, and access to DATERRA technical resources.",
      "live.step5.btnForm": "Submit Global Evaluation & Finish",
      "live.step5.checkbox": "Mark Session as Fully Completed",
      "live.step5.completed": "Session Fully Completed",
      "live.badge.completed": "Completed",

      "live.unlocked": "Unlocked",
      "live.badge.unlocked": "Unlocked",
      "live.waitingModerator": "Awaiting Moderator",
      "live.badge.waiting": "Awaiting Moderator",

      // Programme & Slides (Tab 2)
      "program.badge": "Official Session Timetable",
      "program.title": "Official Programme of Proceedings",
      "program.subtitle": "06 October 2026 • ESAS Auditorium - Santarém • Click each slot to expand",
      "program.expand": "Expand All",
      "program.collapse": "Collapse",
      "program.print": "Print",
      "program.speakers": "Speakers:",

      // Focus Group 1 (Tab 3)
      "fg1.badge": "Lisbon • 22 October 2024",
      "fg1.title": "1st RENOVATE Focus Group Session",
      "fg1.desc": "The first Focus Group in Portugal brought together agricultural advisors, researchers, and trainers to map priority training needs in sustainable crop protection and assess digital adoption in the primary sector.",
      "fg1.videoTitle": "Official Video: Focus Group 1 (Lisbon)",
      "fg1.videoDesc": "Audiovisual report and participant testimonials from the inaugural session.",
      "fg1.videoBtn": "Watch on YouTube",
      "fg1.videoPlay": "Click to play in high resolution",
      "fg1.videoCaption": "The first Focus Group in Portugal brought together specialists, advisors, and growers to define requirements for digital training tools.",
      "fg1.newsBadge": "DATERRA News Page",
      "fg1.newsTitle": "RENOVATE Focus Group: First Session in Lisbon Brings Together Farmers and Specialists",
      "fg1.newsDesc": "View full media coverage, participant testimonials, and insights gathered during the first session in Lisbon.",
      "fg1.newsBtn": "Read News on DATERRA",
      "fg1.docBadge": "Official Document (PDF)",
      "fg1.docTitle": "Conclusions from 1st RENOVATE Focus Group Session",
      "fg1.docDesc": "Access the executive summary with findings, skills mapping, and priority technical recommendations identified by the consortium.",
      "fg1.docBtn": "Open Conclusions Document (PDF)",
      "fg1.highlightsTitle": "Key Conclusions & Extracted Guidelines",
      "fg1.galleryTitle": "Photo Gallery - Focus Group 1",
      "fg1.galleryDesc": "Photographic record of teamwork and workshops in Lisbon.",
      "lightbox.close": "Close",

      // Results & Media (Tab 4)
      "results.loading": "Loading results...",
      "results.waiting": "Awaiting data...",
      "results.badge.connected": "Google Sheets Connected (Real-Time)",
      "results.badge.waiting": "Google Sheets Connected (Awaiting Responses)",
      "results.badge.demo": "Demo Mode (Preview Data)",
      "results.title": "Results & Validation Dashboard",
      "results.subtitle": "Real-time analysis of responses collected across the 3 questionnaires of the 2nd Focus Group Session (ESAS Santarém).",
      "results.refreshBtn": "Refresh Data",
      "results.configBtn": "Sheets Connection",
      "results.sheetsMenuTitle": "Automatic Connection Active",
      "results.sheetsAutoSync": "Auto-Sync",
      "results.sheetsMenuDesc": "The dashboard automatically syncs in real-time with responses submitted to the Google Sheets spreadsheets:",
      "results.sheetQ1Title": "Questionnaire 1: Serious Game",
      "results.sheetQ1Sub": "Demographics, SUS Usability & Game Feedback",
      "results.sheetQ2Title": "Questionnaire 2: Simulator",
      "results.sheetQ2Sub": "Calibration, SUS Usability & Simulation",
      "results.sheetQ3Title": "Questionnaire 3: Global / NPS",
      "results.sheetQ3Sub": "RENOVATE Recommendation & Final Synthesis",
      "results.sheetAllTitle": "Open Full Spreadsheet (3 Tabs)",
      "results.sheetAllSub": "View all responses in Google Docs",
      "results.syncNow": "Sync Now",
      
      // KPI Strip
      "results.kpi.sample": "Total Sample",
      "results.kpi.participants": "participants",
      "results.kpi.venue": "Hands-on Session at ESAS Santarém",
      "results.kpi.susGame": "SUS Serious Game",
      "results.kpi.susGameBench": "Good / Above Average",
      "results.kpi.susSim": "SUS 3D Simulator",
      "results.kpi.susSimBench": "Excellent",
      "results.kpi.nps": "RENOVATE Recommendation (Q29)",
      "results.kpi.npsZone": "High Recommendation Intent",

      // Filters
      "results.filter.all": "Overview",
      "results.filter.demographics": "Demographics",
      "results.filter.sus": "SUS Usability",
      "results.filter.pedagogical": "Pedagogical Evaluation",
      "results.filter.feedback": "Suggestions & Improvements",
      "results.filter.wordcloud": "Word Cloud",

      // Word Cloud
      "results.wc.title": "Word Cloud: The Experience in 3 Words",
      "results.wc.desc": "Frequency of spontaneous terms and adjectives provided by participants at the end of each tool.",
      "results.wc.game": "Serious Game",
      "results.wc.sim": "RENOVATE Simulator",
      "results.wc.topCited": "Most Cited",
      "results.wc.note": "Stopwords filtered automatically.",

      // SUS
      "results.sus.title": "System Usability Scale (SUS) - Comparative Analysis",
      "results.sus.desc": "Comparison of the 10 standardised dimensions (Brooke, 1996) between Serious Game (Q13) and Simulator (Q24).",
      "results.sus.benchmark": "Industry Benchmark = 68.0 pts",
      "results.sus.unacceptable": "0 (Unacceptable)",
      "results.sus.marginal": "50 (Marginal)",
      "results.sus.globalAvg": "68 (Global Average)",
      "results.sus.excellent": "80 (Excellent)",
      "results.sus.gradeA": "100 (Grade A)",
      "results.sus.risk": "Risk Zone (<50)",
      "results.sus.acceptable": "Average Acceptance Zone (68-80)",
      "results.sus.excellence": "Excellence Zone (>80)",

      // Pedagogical
      "results.ped.title": "Pedagogical Effectiveness & Calibration Technical Modules",
      "results.ped.desc": "Detailed assessment of clarity, scenario realism, flow rate calculations and alignment with field practices.",
      "results.ped.gameTitle": "Serious Game (Q7 to Q12)",
      "results.ped.gameBadge": "Pedagogical Radar",
      "results.ped.simTitle": "Simulator Modules (Q15 to Q23)",
      "results.ped.simBadge": "Average (1 to 5)",

      // Demographics
      "results.demo.title": "Sample Demographics & Digital Literacy",
      "results.demo.desc": "Distribution of participants by professional profile (Q1), agricultural crops involved (Q5) and digital agronomic literacy (Q6).",
      "results.demo.profileTitle": "Professional Profile (Q1)",
      "results.demo.cropsTitle": "Crops with Highest Representation (Q5)",
      "results.demo.digitalTitle": "Agricultural Digital Literacy (Q6)",
      "results.demo.digitalDesc": "Self-reported comfort level in the daily use of precision farming software prior to training.",
      "results.demo.digitalLevel": "Intermediate-High Digital Literacy Level",
      "results.demo.conclusionTitle": "Methodological Conclusion:",
      "results.demo.conclusionText": "The sample confirms that digital training tools achieve intuitive adoption even among operators with moderate digital experience.",

      // NPS & Feedback
      "results.nps.title": "RENOVATE Recommendation (Q29)",
      "results.nps.scale": "5 Probability Levels",
      "results.nps.scoreLabel": "Mean Score:",
      "results.nps.zoneText": "(Very or Extremely likely)",
      "results.feedback.title": "Participants' Voice: Suggestions & Roadblocks Identified",

      // Deliverable 1.4 & Media
      "results.deliv.code": "Deliverable 1.3",
      "results.deliv.status": "Official Report • Horizon Europe",
      "results.deliv.link": "Download Official Report PDF (2.0 MB) →",
      "results.deliv.title": "Reports on analysis of expectation for training and results of Focus Group meetings",
      "results.deliv.abstract": "Official report consolidating expectations from 153 agricultural stakeholders across 6 European countries (PT, ES, FR, IT, BE, PL), establishing the technical and pedagogical guidelines for the RENOVATE platform, Serious Games, and 3D simulators.",
      "results.deliv.highlightsTitle": "Key Conclusions & Extracted Guidelines",
      // Official Focus Group 2 Video (Santarém)
      "results.gf2video.title": "Official Video: Focus Group 2 (Santarém)",
      "results.gf2video.desc": "Audiovisual coverage, hands-on training dynamics and participant testimonials at ESAS.",
      "results.gf2video.badge": "In Production • Coming Soon",
      "results.gf2video.boxTitle": "Focus Group 2 Video in Recording & Editing Phase",
      "results.gf2video.boxText": "The official audiovisual report featuring Serious Game trials, 3D Simulator demonstrations, and participant interviews will be published here after the session concludes.",
      "results.gf2video.boxBadge": "Available after 06 October 2026",
      "results.gf2video.footer": "Audiovisual Coverage DATERRA & RENOVATE",
      "results.gf2video.caption": "The audiovisual coverage is part of Deliverable 1.4 of the RENOVATE project and supports the European dissemination of digital tools.",

      // Photo Gallery Focus Group 2
      "results.gallery.title": "Photo Gallery: Focus Group 2 (Santarém)",
      "results.gallery.desc": "Photographic record organised by the official agenda phases of the ESAS session.",

      // Consortium & Partners
      "consortium.partnersCount": "16 partners",
      "consortium.countriesCount": "8 countries",
      "consortium.desc": "Applied research consortium for digital transition and sustainable crop protection.",
      "consortium.portalLink": "Visit Official RENOVATE Portal",
      "host.badge": "Host Entity of the 2nd Focus Group Session",
      "host.visit": "Visit ESAS Website",

      // Footer
      "footer.projectCoord": "Project & Coordination",
      "footer.initiativesHost": "Initiatives & Host",
      "footer.projectLabel": "Project",
      "footer.orgInitiatives": "Organisation & Initiatives",
      "footer.hostLabel": "Host",
      "footer.project": "RENOVATE Project",
      "footer.daterra": "DATERRA",
      "footer.eurotech": "EuroTech Day",
      "footer.esas": "Santarém School of Agriculture",

      // Moderator Modal
      "mod.title": "Moderator Panel",
      "mod.subtitle": "Stage Unlock Control",
      "mod.pinDesc": "Enter security PIN to access session management controls.",
      "mod.pinPlaceholder": "Enter PIN",
      "mod.authBtn": "Authenticate Moderator",
      "mod.pinError": "Incorrect PIN. Please try again.",
      "mod.statusHeader": "Stage Status",
      "mod.unlockUpto": "Unlock up to Step:",
      "mod.upto1": "Up to 1",
      "mod.upto2": "Up to 2",
      "mod.upto3": "Up to 3",
      "mod.upto4": "Up to 4",
      "mod.upto5": "Up to 5",
      "mod.unlockAll": "Unlock All",
      "mod.reset": "Reset to Default",
      "mod.gotoResults": "View Results Dashboard",
      "mod.qrShortcut": "URL Unlock Shortcut:",
      "mod.qrDesc": "You can project or share with participants a QR code with parameter:",

      // Authentication & Reserved Area Module
      "auth.modalTitle": "RENOVATE — Digital Tools Evaluation Platform",
      "auth.modalSubtitle": "Restricted Area for Testing & Evaluation",
      "auth.euBadge": "Horizon Europe | RENOVATE Project",
      "auth.phase1Badge": "Phase 1: In-Person Session",
      "auth.phase2Badge": "Phase 2: Remote Testing",
      "auth.selectCode": "Select your Participant Code...",
      "auth.codeHelpPresential": "Select the individual code from your physical badge (FG2-PT).",
      "auth.codeHelpRemote": "Select your assigned code received via email (NS-PT).",
      "auth.phase2Notice": "The in-person Focus Group session is completed. If you requested access for remote testing via email, please select your assigned code.",
      "auth.codePlaceholder": "Type or select your code",
      "auth.keyLabel": "Event Access Key / Guest Key",
      "auth.keyPlaceholder": "Provided by the Organisation.",
      "auth.keyToggle": "Show or hide key",
      "auth.rgpdConsent": "I declare that I have read the Informed Consent and agree to participate in the evaluation of these digital tools, as well as the strictly anonymous processing of data collected for the European project RENOVATE, in compliance with the GDPR (Regulation (EU) 2016/679).",
      "auth.rgpdReadTerms": "Read Terms & GDPR",
      "auth.enterBtn": "Enter Restricted Area",
      "auth.exitBtn": "Exit",
      "auth.maintenanceTitle": "Platform Under Technical Maintenance",
      "auth.maintenanceNotice": "The RENOVATE platform is temporarily closed for content updates and technical implementation. Access will reopen during the next testing window.",
      "auth.errorSelectCode": "Please select your Participant Code.",
      "auth.errorInvalidKey": "Incorrect access key. Please verify and try again.",
      "auth.errorRgpd": "You must accept the GDPR informed consent terms to access.",
      "auth.errorMaintenance": "The platform is temporarily closed for content updates and technical implementation.",
      "auth.successWelcome": "Welcome to the RENOVATE Restricted Area!",
      "auth.logout": "Log Out",
      "auth.logoutConfirm": "Do you really want to log out and lock access?",
      "auth.badgePresential": "In-Person (FG2)",
      "auth.rgpdModalTitle": "Informed Consent & Data Protection (GDPR)",
      "auth.rgpdModalSubtitle": "European Project RENOVATE • Horizon Europe",
      "auth.rgpdSec1Title": "1. Background and Objectives",
      "auth.rgpdSec1Text": "The European RENOVATE project aims to empower and modernise agricultural training through innovative digital tools, namely 3D virtual simulators and educational Serious Games focused on sustainable crop protection and responsible pesticide application.",
      "auth.rgpdSec2Title": "2. Total Anonymisation and Data Processing",
      "auth.rgpdSec2TextPrefix": "All responses to questionnaires and platform interactions are <strong>strictly anonymous</strong>. Identification is carried out solely and exclusively ",
      "auth.rgpdSec2TextSuffix": ". No names, physical addresses, personal email addresses, or biometric data are collected or stored in scientific reports.",
      "auth.rgpdSec3Title": "3. GDPR Compliance (Regulation EU 2016/679)",
      "auth.rgpdSec3Text": "The data collected is intended solely for statistical, scientific, and educational evaluation within the official deliverables of the RENOVATE consortium funded by the European Commission's Horizon Europe programme. Aggregated results will be published in open-access technical reports.",
      "auth.rgpdSec4Title": "4. Voluntary Participation",
      "auth.rgpdSec4Text": "Your participation is entirely voluntary, and you may discontinue questionnaire completion or tool testing at any time without any disadvantage.",
      "auth.rgpdModalClose": "Understood & Close",
      "auth.activeSession": "Active Session",
      "auth.lockedBanner": "Restricted Access",

      // Moderator Panel - Access Control
      "mod.accessControlTitle": "Access Control & Platform Status",
      "mod.systemStatusLabel": "System Status (system_status):",
      "mod.statusOpen": "Open for Testing",
      "mod.statusMaintenance": "Closed for Maintenance",
      "mod.phaseModeLabel": "Access Phase Mode:",
      "mod.phaseAuto": "Automatic by Calendar (06/10 in-person, 07/10+ remote)",
      "mod.phase1Manual": "Force Phase 1: In-Person (FG2-PT01 to PT50)",
      "mod.phase2Manual": "Force Phase 2: Post-Event / Remote (NS-PT01 to PT50)",
      "mod.activeKeyLabel": "Custom Access Key:",
      "mod.activeSessionLabel": "Active Browser Session:",
      "mod.forceLogoutBtn": "End Current Session (Log Out)",
      "mod.saveSettings": "Apply Settings",

      // Moderator Panel & Room Management (5 Pillars)
      "mod.panelTitle": "Moderator & Room Management Panel",
      "mod.panelSubtitle": "Real-Time Control • 2nd RENOVATE Focus Group Session",
      "mod.tabAccess": "Access Control & Phases",
      "mod.tabParticipants": "Participants & Submissions",
      "mod.tabTiming": "Time Management & Delays",
      "mod.projectQrBtn": "Project Site QR Code",
      "mod.lockPanelBtn": "Lock Panel",
      "mod.authModalTitle": "Moderation Authentication",
      "mod.authModalSubtitle": "Restricted Access to Room Management",
      "mod.authPasswordLabel": "Moderator Password",
      "mod.authPasswordPlaceholder": "Enter password...",
      "mod.authEnterBtn": "Enter Panel",
      "mod.targetParticipantsLabel": "Total In-Room Participants:",
      "mod.targetParticipantsDesc": "Number of present attendees for automated completion rate calculation.",
      "mod.submissionsHeader": "Google Forms Submission Monitors",
      "mod.submissionsDesc": "Real-time count (fetch every 10s from Google Sheets CSVs).",
      "mod.refreshNow": "Refresh Now",
      "mod.stopwatchTitle": "Active Stage Stopwatch",
      "mod.stopwatchStart": "Start",
      "mod.stopwatchPause": "Pause",
      "mod.stopwatchReset": "Reset",
      "mod.delayStageLabel": "Selected Official Programme Stage:",
      "mod.schedStartLabel": "Scheduled Start:",
      "mod.schedEndLabel": "Scheduled End:",
      "mod.schedDurationLabel": "Expected Duration:",
      "mod.realStartLabel": "Actual Start Time:",
      "mod.realStartNowBtn": "Use Current Time",
      "mod.driftTitle": "Schedule Drift Badge:",
      "mod.newEstEndLabel": "Estimated Completion Time:",
      "mod.qrModalTitle": "Access the RENOVATE Platform — Focus Group 2",
      "mod.qrModalSubtitle": "Restricted Testing & Evaluation Area • Live Session",
      "mod.qrInstructions": "Scan with your phone camera to directly access the web application.",
      "mod.qrReconnectNotice": "If your phone or PC browser closed or you lost connection, scan this code or access the link to return to the Live Session.",
      "mod.qrCopyLink": "Copy Link",
      "mod.qrFullscreen": "Fullscreen",
      "mod.qrClose": "Close Projection"
    }
  };

  /**
   * Obtém a tradução para uma chave dada
   */
  function t(key, fallback = "") {
    const langDict = translations[currentLang] || translations[DEFAULT_LANG];
    if (langDict && langDict[key] !== undefined) {
      return langDict[key];
    }
    const defaultDict = translations[DEFAULT_LANG];
    if (defaultDict && defaultDict[key] !== undefined) {
      return defaultDict[key];
    }
    return fallback || key;
  }

  /**
   * Inicializa o gestor de idioma
   */
  function init() {
    loadSavedLanguage();
    setupDropdown();
    applyTranslations();
  }

  /**
   * Determina o idioma inicial (URL param > localStorage > Default pt-PT)
   */
  function loadSavedLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get("lang") || urlParams.get("locale");

    if (langParam) {
      const normalized = normalizeLang(langParam);
      if (normalized) {
        currentLang = normalized;
        saveLanguage(currentLang);
        return;
      }
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED_LANGS.includes(saved)) {
        currentLang = saved;
      } else {
        currentLang = DEFAULT_LANG;
      }
    } catch (e) {
      currentLang = DEFAULT_LANG;
    }
  }

  function normalizeLang(langStr) {
    const lower = (langStr || "").toLowerCase().trim();
    if (lower === "en" || lower === "en-gb" || lower === "en-us" || lower === "english") {
      return "en-GB";
    }
    if (lower === "pt" || lower === "pt-pt" || lower === "pt-br" || lower === "portuguese") {
      return "pt-PT";
    }
    return null;
  }

  function saveLanguage(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
  }

  /**
   * Configura os elementos de seleção de idioma (<select id="lang-select"> e <select id="auth-lang-select">)
   */
  function setupDropdown() {
    const headerSelect = document.getElementById("lang-select");
    if (headerSelect) {
      headerSelect.value = currentLang;
      headerSelect.addEventListener("change", (e) => {
        setLanguage(e.target.value);
      });
    }

    const authSelect = document.getElementById("auth-lang-select");
    if (authSelect) {
      authSelect.value = currentLang;
      authSelect.addEventListener("change", (e) => {
        setLanguage(e.target.value);
      });
    }
  }

  /**
   * Muda o idioma ativo e atualiza toda a aplicação
   */
  function setLanguage(newLang) {
    if (!SUPPORTED_LANGS.includes(newLang)) return;
    currentLang = newLang;
    saveLanguage(newLang);

    const headerSelect = document.getElementById("lang-select");
    if (headerSelect && headerSelect.value !== newLang) {
      headerSelect.value = newLang;
    }

    const authSelect = document.getElementById("auth-lang-select");
    if (authSelect && authSelect.value !== newLang) {
      authSelect.value = newLang;
    }

    // Atualizar atributo html lang
    document.documentElement.lang = newLang === "en-GB" ? "en" : "pt";

    // Atualizar título do documento
    document.title = t("meta.title");

    // Aplicar textos estáticos
    applyTranslations();

    // Notificar os restantes módulos dinâmicos
    if (window.renderSchedule) window.renderSchedule();
    if (window.renderGF1) window.renderGF1();
    if (window.renderResultsAndMedia) window.renderResultsAndMedia();
    if (window.renderPartners) window.renderPartners();
    if (window.LiveSession && typeof window.LiveSession.render === "function") {
      window.LiveSession.render();
    }
    if (window.ResultsDashboard && typeof window.ResultsDashboard.fetchData === "function") {
      window.ResultsDashboard.fetchData(false);
    }
    if (window.AuthModule) {
      if (typeof window.AuthModule.renderCodesDropdown === "function") window.AuthModule.renderCodesDropdown();
      if (typeof window.AuthModule.syncUIWithPhase === "function") window.AuthModule.syncUIWithPhase();
      if (typeof window.AuthModule.syncUIWithStatus === "function") window.AuthModule.syncUIWithStatus();
      if (typeof window.AuthModule.renderHeaderUserBadge === "function") window.AuthModule.renderHeaderUserBadge();
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }

    console.info(`🌐 Idioma alterado para: ${newLang}`);
  }

  /**
   * Itera pelos elementos com data-i18n e substitui os textos
   */
  function applyTranslations() {
    // 1. Textos e HTML
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      const translation = t(key);
      if (translation && translation !== key) {
        el.innerHTML = translation;
      }
    });

    // 2. Placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      const translation = t(key);
      if (translation && translation !== key) {
        el.placeholder = translation;
      }
    });

    // 3. Titles e Tooltips
    document.querySelectorAll("[data-i18n-title]").forEach(el => {
      const key = el.getAttribute("data-i18n-title");
      const translation = t(key);
      if (translation && translation !== key) {
        el.title = translation;
      }
    });
  }

  return {
    init,
    t,
    getLanguage: () => currentLang,
    isEnglish: () => currentLang === "en-GB",
    setLanguage
  };
})();
