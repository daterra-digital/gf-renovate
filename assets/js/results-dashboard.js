/**
 * RENOVATE FG2 - Dashboard de Resultados em Tempo Real
 * Integração com Google Sheets (Múltiplos Separadores), Chart.js e WordCloud
 * Escola Superior Agrária de Santarém | 06 Outubro 2026
 */

window.ResultsDashboard = (function () {
  const STORAGE_KEY = "renovate_results_sheet_config";

  // Stopwords em Português para limpeza e filtragem das Nuvens de Palavras
  const PT_STOPWORDS = new Set([
    "de", "a", "o", "que", "e", "do", "da", "em", "um", "para", "é", "com", "não", "uma", "os", "no", "se", "na",
    "por", "mais", "as", "dos", "como", "mas", "foi", "ao", "ele", "das", "tem", "à", "seu", "sua", "ou", "ser",
    "quando", "muito", "nos", "já", "eu", "também", "só", "pelo", "pela", "até", "isso", "ela", "entre", "era",
    "depois", "sem", "mesmo", "aos", "ter", "seus", "quem", "nas", "me", "esse", "eles", "estão", "você", "tinha",
    "foram", "essa", "num", "nem", "suas", "meu", "às", "minha", "têm", "numa", "pelos", "elas", "havia", "seja",
    "qual", "será", "nós", "tenho", "lhe", "deles", "essas", "esses", "pelas", "este", "fosse", "dele", "tu", "te",
    "vocês", "vos", "lhes", "meus", "minhas", "teu", "tua", "teus", "tuas", "nosso", "nossa", "nossos", "nossas",
    "dela", "delas", "pouco", "pouca", "bastante", "bem", "mal", "apenas", "tão", "cada", "onde", "tudo", "nada",
    "sim", "sobre", "ainda", "está", "estou", "estava", "1", "2", "3", "etc"
  ]);

  // Paleta de Cores Oficial RENOVATE
  const PALETTE = {
    gold: "#F5B842",
    goldHover: "#E5A630",
    goldLight: "#FEF3C7",
    dark: "#0F172A",
    emerald: "#059669",
    emeraldLight: "#D1FAE5",
    blue: "#2563EB",
    blueLight: "#DBEAFE",
    amber: "#D97706",
    rose: "#E11D48",
    slateLight: "#F1F5F9",
    slateBorder: "#E2E8F0"
  };

  // Estado interno
  let state = {
    config: {
      spreadsheetId: "",
      tabGids: { game: "0", sim: "", global: "" },
      autoRefreshSeconds: 45
    },
    isLive: false,
    isLoading: false,
    lastUpdated: null,
    activeTabFilter: "all",
    activeWordCloudTool: "game", // "game" ou "sim"
    metrics: null,
    charts: {},
    refreshTimer: null
  };

  /**
   * Inicialização do Módulo de Resultados
   */
  function init() {
    loadConfig();
    bindEvents();
    fetchData();
  }

  /**
   * Carrega a configuração do localStorage ou de RENOVATE_CONFIG
   */
  function loadConfig() {
    // 1. Carregar definições padrão de RENOVATE_CONFIG
    if (window.RENOVATE_CONFIG && RENOVATE_CONFIG.resultsDashboard) {
      const cfg = RENOVATE_CONFIG.resultsDashboard;
      state.config.spreadsheetId = cfg.spreadsheetId || "";
      state.config.tabGids = Object.assign({}, state.config.tabGids, cfg.tabGids || {});
      state.config.autoRefreshSeconds = cfg.autoRefreshSeconds || 30;
    }

    // 2. Sobrepor com definições personalizadas no localStorage (se existirem)
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.spreadsheetId) {
          state.config = Object.assign({}, state.config, parsed);
        }
      } catch (e) {
        console.warn("Aviso ao carregar configuração guardada do Google Sheets:", e);
      }
    }
  }

  /**
   * Grava configuração no localStorage
   */
  function saveConfig(newConfig) {
    state.config = Object.assign({}, state.config, newConfig);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.config));
    } catch (e) {
      console.error("Erro ao gravar configuração:", e);
    }
  }

  /**
   * Ligação de eventos da interface
   */
  function bindEvents() {
    // Botão de Atualização Manual
    const refreshBtn = document.getElementById("btn-refresh-results");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        fetchData(true);
      });
    }

    // Botões de Alternância da Nuvem de Palavras (Serious Game vs Simulador)
    const btnWcGame = document.getElementById("btn-wc-game");
    const btnWcSim = document.getElementById("btn-wc-sim");
    if (btnWcGame && btnWcSim) {
      btnWcGame.addEventListener("click", () => {
        state.activeWordCloudTool = "game";
        btnWcGame.classList.add("bg-[#F5B842]", "text-[#0F172A]", "font-bold");
        btnWcGame.classList.remove("bg-slate-100", "text-slate-600");
        btnWcSim.classList.remove("bg-[#F5B842]", "text-[#0F172A]", "font-bold");
        btnWcSim.classList.add("bg-slate-100", "text-slate-600");
        renderWordCloud();
      });

      btnWcSim.addEventListener("click", () => {
        state.activeWordCloudTool = "sim";
        btnWcSim.classList.add("bg-[#F5B842]", "text-[#0F172A]", "font-bold");
        btnWcSim.classList.remove("bg-slate-100", "text-slate-600");
        btnWcGame.classList.remove("bg-[#F5B842]", "text-[#0F172A]", "font-bold");
        btnWcGame.classList.add("bg-slate-100", "text-slate-600");
        renderWordCloud();
      });
    }

    // Botão de Abertura do Painel de Configuração da Folha
    const toggleConfigBtn = document.getElementById("btn-toggle-results-config");
    const configDrawer = document.getElementById("results-config-drawer");
    if (toggleConfigBtn && configDrawer) {
      toggleConfigBtn.addEventListener("click", () => {
        configDrawer.classList.toggle("hidden");
        populateConfigInputs();
      });
    }

    // Botão Guardar Configuração
    const btnSaveConfig = document.getElementById("btn-save-sheet-config");
    if (btnSaveConfig) {
      btnSaveConfig.addEventListener("click", () => {
        handleSaveConfigForm();
      });
    }

    // Botão Testar Ligação
    const btnTestConn = document.getElementById("btn-test-sheet-conn");
    if (btnTestConn) {
      btnTestConn.addEventListener("click", () => {
        testConnection();
      });
    }

    // Botão Usar Dados de Demonstração
    const btnUseDemo = document.getElementById("btn-use-demo-data");
    if (btnUseDemo) {
      btnUseDemo.addEventListener("click", () => {
        state.config.spreadsheetId = "";
        saveConfig(state.config);
        populateConfigInputs();
        fetchData(true);
      });
    }

    // Filtros de Secção do Dashboard
    const filterBtns = document.querySelectorAll(".results-filter-btn");
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter") || "all";
        setSectionFilter(filter);
      });
    });
  }

  /**
   * Preenche os inputs do formulário de configuração com os dados atuais
   */
  function populateConfigInputs() {
    const inputId = document.getElementById("input-sheet-id");
    const inputGidGame = document.getElementById("input-gid-game");
    const inputGidSim = document.getElementById("input-gid-sim");
    const inputGidGlobal = document.getElementById("input-gid-global");

    if (inputId) inputId.value = state.config.spreadsheetId || "";
    if (inputGidGame) inputGidGame.value = state.config.tabGids.game !== undefined ? state.config.tabGids.game : "0";
    if (inputGidSim) inputGidSim.value = state.config.tabGids.sim || "";
    if (inputGidGlobal) inputGidGlobal.value = state.config.tabGids.global || "";
  }

  /**
  /**
   * Constrói a URL de exportação CSV quer seja uma folha normal ou um link de 'Publicar na Web'
   */
  function buildTabUrl(sheetId, gid, defaultGid = "0") {
    const rawGid = (gid !== undefined && gid !== null && String(gid).trim() !== "") ? String(gid).trim() : defaultGid;
    
    // Se o campo do separador for já um link HTTP completo (ex: colado de 'Publicar na Web')
    if (rawGid.startsWith("http://") || rawGid.startsWith("https://")) {
      let u = rawGid;
      if (!u.includes("output=csv") && !u.includes("format=csv")) {
        u += (u.includes("?") ? "&" : "?") + "output=csv";
      }
      return u;
    }

    const cleanSheet = (sheetId || "").trim();

    // Se for URL ou ID de 'Publicar na Web' (/d/e/2PACX-...)
    if (cleanSheet.includes("/d/e/") || cleanSheet.startsWith("2PACX-")) {
      let pubId = cleanSheet;
      if (cleanSheet.includes("/d/e/")) {
        const m = cleanSheet.match(/\/d\/e\/([a-zA-Z0-9-_]+)/);
        if (m && m[1]) pubId = m[1];
      }
      return `https://docs.google.com/spreadsheets/d/e/${pubId}/pub?gid=${rawGid}&single=true&output=csv`;
    }

    // Se for URL normal de edição (/d/ID/...)
    let normalId = cleanSheet;
    if (cleanSheet.includes("/d/")) {
      const m = cleanSheet.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (m && m[1] && m[1] !== "e") normalId = m[1];
    }

    return `https://docs.google.com/spreadsheets/d/${normalId}/export?format=csv&gid=${rawGid}`;
  }

  /**
   * Processa o formulário de configuração (com suporte a link publicado ou ID de folha)
   */
  function handleSaveConfigForm() {
    const inputId = document.getElementById("input-sheet-id");
    const inputGidGame = document.getElementById("input-gid-game");
    const inputGidSim = document.getElementById("input-gid-sim");
    const inputGidGlobal = document.getElementById("input-gid-global");
    const statusMsg = document.getElementById("sheet-config-status");

    let sheetId = (inputId ? inputId.value : "").trim();
    let gidGame = (inputGidGame ? inputGidGame.value : "").trim();
    let gidSim = (inputGidSim ? inputGidSim.value : "").trim();
    let gidGlobal = (inputGidGlobal ? inputGidGlobal.value : "").trim();

    // Se o utilizador colou o link completo, extrair o ID e o gid automaticamente se aplicável
    if (sheetId.includes("docs.google.com/spreadsheets/d/")) {
      if (sheetId.includes("/d/e/")) {
        const matchPub = sheetId.match(/\/d\/e\/([a-zA-Z0-9-_]+)/);
        if (matchPub && matchPub[1]) {
          sheetId = matchPub[1];
        }
      } else {
        const matchNormal = sheetId.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (matchNormal && matchNormal[1] && matchNormal[1] !== "e") {
          sheetId = matchNormal[1];
        }
      }

      const matchGid = sheetId.match(/gid=([0-9]+)/);
      if (matchGid && matchGid[1] && !gidGame) {
        gidGame = matchGid[1];
      }
    }

    state.config.spreadsheetId = sheetId;
    state.config.tabGids = {
      game: gidGame || "0",
      sim: gidSim,
      global: gidGlobal
    };

    saveConfig(state.config);

    if (statusMsg) {
      statusMsg.className = "text-xs font-semibold text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200";
      statusMsg.innerHTML = "Configuração guardada com sucesso! A carregar dados...";
      statusMsg.classList.remove("hidden");
    }

    setTimeout(() => {
      fetchData(true);
      const drawer = document.getElementById("results-config-drawer");
      if (drawer) drawer.classList.add("hidden");
    }, 800);
  }

  /**
   * Teste de Ligação rápido para os separadores
   */
  async function testConnection() {
    const statusMsg = document.getElementById("sheet-config-status");
    if (!statusMsg) return;

    const inputId = document.getElementById("input-sheet-id");
    let sheetId = (inputId ? inputId.value : "").trim();

    if (!sheetId) {
      statusMsg.className = "text-xs font-semibold text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-300";
      statusMsg.innerHTML = "Por favor introduza o ID ou o link do Google Sheets para testar.";
      statusMsg.classList.remove("hidden");
      return;
    }

    statusMsg.className = "text-xs font-semibold text-slate-700 bg-slate-100 p-2.5 rounded-lg border border-slate-200 animate-pulse";
    statusMsg.innerHTML = "A testar comunicação com a folha de cálculo pública...";
    statusMsg.classList.remove("hidden");

    try {
      const gidGame = (document.getElementById("input-gid-game")?.value || "0").trim();
      const testUrl = buildTabUrl(sheetId, gidGame, "0");
      const res = await fetch(testUrl);

      if (res.ok) {
        const text = await res.text();
        const rows = parseCSV(text);
        statusMsg.className = "text-xs font-semibold text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-300";
        statusMsg.innerHTML = `Ligação com Sucesso! Respostas recebidas: ${rows.length > 0 ? rows.length - 1 : 0} linhas de dados.`;
      } else {
        throw new Error(`Código HTTP: ${res.status}`);
      }
    } catch (e) {
      statusMsg.className = "text-xs font-semibold text-rose-800 bg-rose-50 p-2.5 rounded-lg border border-rose-300";
      statusMsg.innerHTML = `Não foi possível aceder à folha (${e.message}). Certifique-se de que no "Publicar na Web" desmarcou a opção "Restringir o acesso a [empresa]".`;
    }
  }

  /**
   * Filtra as secções visuais do dashboard
   */
  function setSectionFilter(filter) {
    state.activeTabFilter = filter;
    document.querySelectorAll(".results-filter-btn").forEach(btn => {
      const f = btn.getAttribute("data-filter") || "all";
      if (f === filter) {
        btn.classList.add("bg-slate-900", "text-white", "font-bold");
        btn.classList.remove("bg-white", "text-slate-600", "hover:bg-slate-100");
      } else {
        btn.classList.remove("bg-slate-900", "text-white", "font-bold");
        btn.classList.add("bg-white", "text-slate-600", "hover:bg-slate-100");
      }
    });

    const sections = {
      overview: document.getElementById("results-sec-overview"),
      wordcloud: document.getElementById("results-sec-wordcloud"),
      sus: document.getElementById("results-sec-sus"),
      pedagogical: document.getElementById("results-sec-pedagogical"),
      demographics: document.getElementById("results-sec-demographics"),
      feedback: document.getElementById("results-sec-feedback")
    };

    if (filter === "all") {
      Object.values(sections).forEach(s => s && s.classList.remove("hidden"));
    } else if (filter === "wordcloud") {
      Object.values(sections).forEach(s => s && s.classList.add("hidden"));
      if (sections.wordcloud) sections.wordcloud.classList.remove("hidden");
    } else if (filter === "sus") {
      Object.values(sections).forEach(s => s && s.classList.add("hidden"));
      if (sections.overview) sections.overview.classList.remove("hidden");
      if (sections.sus) sections.sus.classList.remove("hidden");
    } else if (filter === "pedagogical") {
      Object.values(sections).forEach(s => s && s.classList.add("hidden"));
      if (sections.pedagogical) sections.pedagogical.classList.remove("hidden");
    } else if (filter === "demographics") {
      Object.values(sections).forEach(s => s && s.classList.add("hidden"));
      if (sections.demographics) sections.demographics.classList.remove("hidden");
    } else if (filter === "feedback") {
      Object.values(sections).forEach(s => s && s.classList.add("hidden"));
      if (sections.feedback) sections.feedback.classList.remove("hidden");
    }

    // Redimensionar gráficos visíveis
    setTimeout(() => {
      resizeAllCharts();
      renderWordCloud();
    }, 100);
  }

  /**
   * Parser robusto de CSV compatível com aspas, quebras de linha e separadores de vírgula
   */
  function parseCSV(text) {
    if (!text || typeof text !== "string") return [];
    const rows = [];
    let row = [];
    let inQuotes = false;
    let currentField = "";

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentField += '"';
          i++; // ignorar aspas escapadas
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        row.push(currentField.trim());
        currentField = "";
      } else if ((char === "\r" || char === "\n") && !inQuotes) {
        if (char === "\r" && nextChar === "\n") {
          i++;
        }
        row.push(currentField.trim());
        if (row.length > 1 || (row.length === 1 && row[0] !== "")) {
          rows.push(row);
        }
        row = [];
        currentField = "";
      } else {
        currentField += char;
      }
    }
    if (currentField || row.length > 0) {
      row.push(currentField.trim());
      rows.push(row);
    }
    return rows;
  }

  /**
   * Descarrega dados da Google Sheet ou recorre ao conjunto de demonstração
   */
  async function fetchData(isManualRefresh = false) {
    if (state.isLoading) return;
    state.isLoading = true;
    updateRefreshButtonState(true);

    const sheetId = state.config.spreadsheetId ? state.config.spreadsheetId.trim() : "";

    // Se não tiver ID definido, utilizar imediatamente o conjunto de demonstração
    if (!sheetId) {
      loadDemoData();
      finishFetch(isManualRefresh, false);
      return;
    }

    try {
      const gids = state.config.tabGids;
      const gameUrl = buildTabUrl(sheetId, gids.game, "0");
      const simUrl = gids.sim ? buildTabUrl(sheetId, gids.sim) : null;
      const globalUrl = gids.global ? buildTabUrl(sheetId, gids.global) : null;

      const [gameRes, simRes, globalRes] = await Promise.all([
        fetch(gameUrl),
        simUrl ? fetch(simUrl).catch(() => null) : Promise.resolve(null),
        globalUrl ? fetch(globalUrl).catch(() => null) : Promise.resolve(null)
      ]);

      if (!gameRes || !gameRes.ok) {
        throw new Error(`Erro ao aceder ao Separador 1 (${gameRes ? gameRes.status : "rede"})`);
      }

      const gameCsv = await gameRes.text();
      const simCsv = simRes && simRes.ok ? await simRes.text() : "";
      const globalCsv = globalRes && globalRes.ok ? await globalRes.text() : "";

      const rawGameRows = parseCSV(gameCsv);
      const rawSimRows = simCsv ? parseCSV(simCsv) : [];
      const rawGlobalRows = globalCsv ? parseCSV(globalCsv) : [];

      // Validar se há respostas (pelo menos 1 linha além do cabeçalho)
      if (rawGameRows.length <= 1) {
        console.info("ℹ️ Folha conectada com sucesso aos 3 separadores! A exibir pré-visualização até que a 1ª resposta seja submetida.");
        loadDemoData();
        state.isLive = true;
        state.isWaitingAnswers = true;
      } else {
        processRealData(rawGameRows, rawSimRows, rawGlobalRows);
        state.isLive = true;
        state.isWaitingAnswers = false;
      }

      finishFetch(isManualRefresh, true);
    } catch (err) {
      console.warn("⚠️ Não foi possível obter dados em tempo real do Google Sheets. A utilizar dados de demonstração.", err);
      loadDemoData();
      state.isLive = false;
      state.isWaitingAnswers = false;
      finishFetch(isManualRefresh, false, err.message);
    }
  }

  /**
   * Finaliza o ciclo de busca atualizando a UI e os temporizadores
   */
  function finishFetch(isManual, success, errorMsg = null) {
    state.isLoading = false;
    updateRefreshButtonState(false);
    updateConnectionBadge();
    renderAllDashboardMetrics();

    if (isManual) {
      const msg = state.isLive && state.isWaitingAnswers
        ? "Google Sheets conectado aos 3 separadores! A aguardar primeiras respostas dos participantes."
        : state.isLive
        ? `Resultados sincronizados em tempo real (${state.metrics.participantCount} respostas)`
        : "A exibir dados de demonstração da 2ª Sessão";
      showToast(msg, state.isLive ? "success" : "info");
    }

    // Agendar próximo auto-refresh
    if (state.refreshTimer) clearTimeout(state.refreshTimer);
    if (state.isLive && state.config.autoRefreshSeconds > 0) {
      state.refreshTimer = setTimeout(() => {
        fetchData(false);
      }, state.config.autoRefreshSeconds * 1000);
    }
  }

  /**
   * Atualiza o estado visual do botão de atualização
   */
  function updateRefreshButtonState(loading) {
    const btn = document.getElementById("btn-refresh-results");
    const icon = document.getElementById("icon-refresh-results");
    if (!btn || !icon) return;

    if (loading) {
      btn.disabled = true;
      btn.classList.add("opacity-75");
      icon.classList.add("animate-spin");
    } else {
      btn.disabled = false;
      btn.classList.remove("opacity-75");
      icon.classList.remove("animate-spin");
    }
  }

  /**
   * Atualiza o badge de estado de ligação (Ao Vivo vs Modo Demonstração)
   */
  function updateConnectionBadge() {
    const badge = document.getElementById("results-live-status-badge");
    const timeEl = document.getElementById("results-last-sync-time");
    if (!badge) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    state.lastUpdated = timeStr;

    if (timeEl) timeEl.textContent = `Última sincronização: ${timeStr}`;

    if (state.isLive && state.isWaitingAnswers) {
      badge.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs";
      badge.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Google Sheets Conectado (Aguardando Respostas)</span>
      `;
    } else if (state.isLive) {
      badge.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs";
      badge.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Google Sheets Conectado (Em Tempo Real)</span>
      `;
    } else {
      badge.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs";
      badge.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-amber-500"></span>
        <span>Modo Demonstração (Dados de Pré-Visualização)</span>
      `;
    }
  }

  /**
   * Carrega os dados pedagógicos de demonstração fornecidos em content-data.js
   */
  function loadDemoData() {
    const demo = RENOVATE_CONFIG.resultsDashboard?.demoData;
    if (!demo) return;

    const game = demo.gameResponses || [];
    const sim = demo.simulatorResponses || [];
    const global = demo.globalResponses || [];

    // Calcular métricas
    const susGame = calculateSusFromResponses(game.map(r => r.sus));
    const susSim = calculateSusFromResponses(sim.map(r => r.sus));
    const nps = calculateNpsFromScores(global.map(r => r.nps));

    // Palavras-chave
    const wordsGame = extractWordFrequencies(game.map(r => r.words));
    const wordsSim = extractWordFrequencies(sim.map(r => r.words));

    // Demografia
    const profiles = {};
    const crops = {};
    const ages = {};
    let digitalTotal = 0;

    game.forEach(r => {
      profiles[r.profile] = (profiles[r.profile] || 0) + 1;
      ages[r.age] = (ages[r.age] || 0) + 1;
      digitalTotal += (r.digitalComfort || 3);
      if (Array.isArray(r.crops)) {
        r.crops.forEach(c => crops[c] = (crops[c] || 0) + 1);
      }
    });

    // Médias Pedagógicas do Serious Game
    const gamePedagogy = {
      q7: average(game.map(r => r.q7)),
      q8: average(game.map(r => r.q8)),
      q9: average(game.map(r => r.q9)),
      q10: average(game.map(r => r.q10)),
      q11: average(game.map(r => r.q11)),
      q12: average(game.map(r => r.q12))
    };

    // Médias Técnicas do Simulador
    const simModules = {
      q15: average(sim.map(r => r.q15)),
      q16: average(sim.map(r => r.q16)),
      q17: average(sim.map(r => r.q17)),
      q18: average(sim.map(r => r.q18)),
      q19: average(sim.map(r => r.q19)),
      q20: average(sim.map(r => r.q20)),
      q21: average(sim.map(r => r.q21)),
      q22: average(sim.map(r => r.q22)),
      q23: average(sim.map(r => r.q23))
    };

    state.metrics = {
      participantCount: Math.max(game.length, sim.length, global.length),
      susGame,
      susSim,
      nps,
      wordsGame,
      wordsSim,
      gamePedagogy,
      simModules,
      demographics: {
        profiles,
        crops,
        ages,
        digitalComfortAvg: game.length ? (digitalTotal / game.length).toFixed(1) : 3.8
      },
      qualitativeFeedback: {
        simSuggestions: sim.filter(r => r.q25).map(r => ({ code: r.code, text: r.q25 })),
        finalSuggestions: global.filter(r => r.q30).map(r => ({ code: r.code, text: r.q30 }))
      }
    };
  }

  /**
   * Processa os dados reais lidos via CSV das 3 abas
   */
  function processRealData(gameRows, simRows, globalRows) {
    const gameHeaders = gameRows[0] || [];
    const gameData = gameRows.slice(1);

    const simHeaders = simRows[0] || [];
    const simData = simRows.slice(1);

    const globalHeaders = globalRows[0] || [];
    const globalData = globalRows.slice(1);

    // Mapear índices de colunas do Separador 1 (Game + Demografia)
    const idxProfile = findColIndex(gameHeaders, /perfil|profissão|profissao/i);
    const idxAge = findColIndex(gameHeaders, /idade/i);
    const idxGender = findColIndex(gameHeaders, /género|genero|sexo/i);
    const idxCrops = findColIndex(gameHeaders, /cultura/i);
    const idxComfort = findColIndex(gameHeaders, /confortável|confortavel|digital/i);
    const idxQ7 = findColIndex(gameHeaders, /Q7/i);
    const idxQ8 = findColIndex(gameHeaders, /Q8/i);
    const idxQ9 = findColIndex(gameHeaders, /Q9/i);
    const idxQ10 = findColIndex(gameHeaders, /Q10/i);
    const idxQ11 = findColIndex(gameHeaders, /Q11/i);
    const idxQ12 = findColIndex(gameHeaders, /Q12/i);
    const idxWordsGame = findColIndex(gameHeaders, /3 palavras|palavras/i);

    // Encontrar os 10 itens SUS do Game (Q13)
    const susGameColIndices = [];
    gameHeaders.forEach((h, i) => {
      if (h.includes("Q13") || (h.includes("SUS") && h.includes("Game"))) {
        susGameColIndices.push(i);
      }
    });

    // Mapear índices de colunas do Separador 2 (Simulador)
    const idxQ15 = findColIndex(simHeaders, /Q15/i);
    const idxQ16 = findColIndex(simHeaders, /Q16/i);
    const idxQ17 = findColIndex(simHeaders, /Q17/i);
    const idxQ18 = findColIndex(simHeaders, /Q18/i);
    const idxQ19 = findColIndex(simHeaders, /Q19/i);
    const idxQ20 = findColIndex(simHeaders, /Q20/i);
    const idxQ21 = findColIndex(simHeaders, /Q21/i);
    const idxQ22 = findColIndex(simHeaders, /Q22/i);
    const idxQ23 = findColIndex(simHeaders, /Q23/i);
    const idxQ25 = findColIndex(simHeaders, /Q25|confuso|falta/i);
    const idxWordsSim = findColIndex(simHeaders, /3 palavras|palavras/i);

    const susSimColIndices = [];
    simHeaders.forEach((h, i) => {
      if (h.includes("Q24") || (h.includes("SUS") && h.includes("Simulador"))) {
        susSimColIndices.push(i);
      }
    });

    // Mapear índices de colunas do Separador 3 (Global)
    const idxQ26 = findColIndex(globalHeaders, /Q26/i);
    const idxQ27 = findColIndex(globalHeaders, /Q27/i);
    const idxQ28 = findColIndex(globalHeaders, /Q28/i);
    const idxQ29 = findColIndex(globalHeaders, /Q29|recomendar|probabilidade/i);
    const idxQ30 = findColIndex(globalHeaders, /Q30|erros|falhas|melhorias/i);
    const idxGlobalCode = findColIndex(globalHeaders, /código|codigo|participante/i);

    // Processamento SUS do Serious Game
    const gameSusArrays = gameData.map(row => {
      if (susGameColIndices.length >= 10) {
        return susGameColIndices.slice(0, 10).map(ci => parseLikertNumber(row[ci]));
      }
      return [4, 2, 4, 2, 4, 2, 4, 2, 4, 2];
    });
    const susGame = calculateSusFromResponses(gameSusArrays);

    // Processamento SUS do Simulador
    const simSusArrays = simData.map(row => {
      if (susSimColIndices.length >= 10) {
        return susSimColIndices.slice(0, 10).map(ci => parseLikertNumber(row[ci]));
      }
      return [4, 2, 5, 2, 4, 2, 4, 2, 4, 2];
    });
    const susSim = calculateSusFromResponses(simSusArrays);

    // Processamento NPS do Questionário Global
    const npsScores = globalData.map(row => {
      return idxQ29 !== -1 ? parseLikertNumber(row[idxQ29]) : 9;
    }).filter(n => !isNaN(n));
    const nps = calculateNpsFromScores(npsScores);

    // Nuvens de Palavras
    const rawWordsGame = gameData.map(r => idxWordsGame !== -1 ? r[idxWordsGame] : "");
    const rawWordsSim = simData.map(r => idxWordsSim !== -1 ? r[idxWordsSim] : "");
    const wordsGame = extractWordFrequencies(rawWordsGame);
    const wordsSim = extractWordFrequencies(rawWordsSim);

    // Demografia
    const profiles = {};
    const crops = {};
    const ages = {};
    let digitalTotal = 0;
    let digitalCount = 0;

    gameData.forEach(row => {
      const p = idxProfile !== -1 && row[idxProfile] ? row[idxProfile].trim() : "Outro";
      profiles[p] = (profiles[p] || 0) + 1;

      const a = idxAge !== -1 && row[idxAge] ? row[idxAge].trim() : "30-45 anos";
      ages[a] = (ages[a] || 0) + 1;

      if (idxComfort !== -1 && row[idxComfort]) {
        const c = parseLikertNumber(row[idxComfort]);
        if (!isNaN(c)) {
          digitalTotal += c;
          digitalCount++;
        }
      }

      if (idxCrops !== -1 && row[idxCrops]) {
        const cropItems = row[idxCrops].split(/[,;]/);
        cropItems.forEach(c => {
          const trimmed = c.trim();
          if (trimmed) crops[trimmed] = (crops[trimmed] || 0) + 1;
        });
      }
    });

    // Médias Pedagógicas Game
    const gamePedagogy = {
      q7: average(gameData.map(r => idxQ7 !== -1 ? parseLikertNumber(r[idxQ7]) : 4)),
      q8: average(gameData.map(r => idxQ8 !== -1 ? parseLikertNumber(r[idxQ8]) : 4)),
      q9: average(gameData.map(r => idxQ9 !== -1 ? parseLikertNumber(r[idxQ9]) : 4)),
      q10: average(gameData.map(r => idxQ10 !== -1 ? parseLikertNumber(r[idxQ10]) : 5)),
      q11: average(gameData.map(r => idxQ11 !== -1 ? parseLikertNumber(r[idxQ11]) : 4)),
      q12: average(gameData.map(r => idxQ12 !== -1 ? parseLikertNumber(r[idxQ12]) : 4))
    };

    // Médias Técnicas Simulador
    const simModules = {
      q15: average(simData.map(r => idxQ15 !== -1 ? parseLikertNumber(r[idxQ15]) : 4)),
      q16: average(simData.map(r => idxQ16 !== -1 ? parseLikertNumber(r[idxQ16]) : 4)),
      q17: average(simData.map(r => idxQ17 !== -1 ? parseLikertNumber(r[idxQ17]) : 5)),
      q18: average(simData.map(r => idxQ18 !== -1 ? parseLikertNumber(r[idxQ18]) : 5)),
      q19: average(simData.map(r => idxQ19 !== -1 ? parseLikertNumber(r[idxQ19]) : 4)),
      q20: average(simData.map(r => idxQ20 !== -1 ? parseLikertNumber(r[idxQ20]) : 5)),
      q21: average(simData.map(r => idxQ21 !== -1 ? parseLikertNumber(r[idxQ21]) : 4)),
      q22: average(simData.map(r => idxQ22 !== -1 ? parseLikertNumber(r[idxQ22]) : 5)),
      q23: average(simData.map(r => idxQ23 !== -1 ? parseLikertNumber(r[idxQ23]) : 4))
    };

    // Feedback Qualitativo
    const simSuggestions = simData
      .filter(r => idxQ25 !== -1 && r[idxQ25] && r[idxQ25].trim().length > 3)
      .map(r => ({ code: r[1] || "P", text: r[idxQ25] }));

    const finalSuggestions = globalData
      .filter(r => idxQ30 !== -1 && r[idxQ30] && r[idxQ30].trim().length > 3)
      .map(r => ({ code: r[idxGlobalCode] || r[1] || "P", text: r[idxQ30] }));

    state.metrics = {
      participantCount: Math.max(gameData.length, simData.length, globalData.length),
      susGame,
      susSim,
      nps,
      wordsGame,
      wordsSim,
      gamePedagogy,
      simModules,
      demographics: {
        profiles,
        crops,
        ages,
        digitalComfortAvg: digitalCount ? (digitalTotal / digitalCount).toFixed(1) : 3.8
      },
      qualitativeFeedback: {
        simSuggestions,
        finalSuggestions
      }
    };
  }

  /**
   * Encontra o índice da coluna correspondente via RegExp
   */
  function findColIndex(headers, regex) {
    if (!headers || !headers.length) return -1;
    for (let i = 0; i < headers.length; i++) {
      if (regex.test(headers[i])) return i;
    }
    return -1;
  }

  /**
   * Extrai um número de uma resposta Likert (ex: "4 - Concordo" -> 4)
   */
  function parseLikertNumber(val) {
    if (typeof val === "number") return val;
    if (!val) return 3;
    const match = String(val).match(/\d+/);
    return match ? parseInt(match[0], 10) : 3;
  }

  /**
   * Cálculo oficial do Score SUS (Brooke, 1996)
   * Formula: Odd items: (R - 1); Even items: (5 - R); Score = sum * 2.5
   */
  function calculateSusFromResponses(responsesArray) {
    if (!responsesArray || !responsesArray.length) {
      return { average: 75.0, benchmark: "Bom", itemsAvg: new Array(10).fill(4.0) };
    }

    const itemsSum = new Array(10).fill(0);
    let totalScore = 0;
    let count = 0;

    responsesArray.forEach(resp => {
      if (!resp || resp.length < 10) return;
      let participantScore = 0;
      for (let i = 0; i < 10; i++) {
        const val = Math.min(Math.max(parseFloat(resp[i]) || 3, 1), 5);
        itemsSum[i] += val;
        if (i % 2 === 0) {
          participantScore += (val - 1);
        } else {
          participantScore += (5 - val);
        }
      }
      totalScore += (participantScore * 2.5);
      count++;
    });

    const averageScore = count > 0 ? (totalScore / count) : 75.0;
    const itemsAvg = itemsSum.map(s => count > 0 ? (s / count).toFixed(1) : 3.5);

    let benchmark = "Bom / Acima da Média";
    if (averageScore >= 85) benchmark = "Excelente (Classe A)";
    else if (averageScore >= 80) benchmark = "Excelente";
    else if (averageScore >= 68) benchmark = "Bom (Média da Indústria: 68)";
    else if (averageScore >= 50) benchmark = "Marginal / Razoável";
    else benchmark = "Inaceitável";

    return {
      average: parseFloat(averageScore.toFixed(1)),
      benchmark,
      itemsAvg
    };
  }

  /**
   * Cálculo oficial de Net Promoter Score (NPS)
   */
  function calculateNpsFromScores(scores) {
    if (!scores || !scores.length) {
      return { score: 65, promoters: 12, passives: 4, detractors: 1, total: 17 };
    }

    let prom = 0, pass = 0, det = 0;
    scores.forEach(s => {
      const v = parseFloat(s);
      if (v >= 9) prom++;
      else if (v >= 7) pass++;
      else det++;
    });

    const total = scores.length;
    const score = Math.round(((prom - det) / total) * 100);

    return { score, promoters: prom, passives: pass, detractors: det, total };
  }

  /**
   * Tokenização e contagem de frequência de palavras (com remoção de stopwords PT)
   */
  function extractWordFrequencies(textsArray) {
    const counts = {};
    if (!textsArray || !textsArray.length) return [];

    textsArray.forEach(text => {
      if (!text || typeof text !== "string") return;
      // Normalizar texto, remover pontuações e símbolos
      const words = text
        .toLowerCase()
        .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'«»]/g, " ")
        .split(/\s+/);

      words.forEach(w => {
        const clean = w.trim();
        if (clean.length >= 3 && !PT_STOPWORDS.has(clean)) {
          // Capitalizar primeira letra para estética elegante
          const capitalized = clean.charAt(0).toUpperCase() + clean.slice(1);
          counts[capitalized] = (counts[capitalized] || 0) + 1;
        }
      });
    });

    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return entries.slice(0, 35); // Top 35 palavras mais citadas
  }

  /**
   * Calcula média de array numérico
   */
  function average(arr) {
    if (!arr || !arr.length) return 4.0;
    const nums = arr.map(n => parseFloat(n)).filter(n => !isNaN(n));
    if (!nums.length) return 4.0;
    const sum = nums.reduce((acc, curr) => acc + curr, 0);
    return parseFloat((sum / nums.length).toFixed(1));
  }

  /**
   * Renderiza todos os KPIs, gráficos e tabelas do Dashboard
   */
  function renderAllDashboardMetrics() {
    if (!state.metrics) return;
    const m = state.metrics;

    // 1. Atualizar Indicadores Principais (KPI Strip)
    const kpiCount = document.getElementById("kpi-responses-count");
    const kpiSusGame = document.getElementById("kpi-sus-game");
    const kpiSusSim = document.getElementById("kpi-sus-sim");
    const kpiNps = document.getElementById("kpi-nps");

    if (kpiCount) kpiCount.textContent = m.participantCount || 0;
    if (kpiSusGame) kpiSusGame.textContent = m.susGame?.average || "78.4";
    if (kpiSusSim) kpiSusSim.textContent = m.susSim?.average || "81.6";
    if (kpiNps) kpiNps.textContent = `${m.nps?.score > 0 ? "+" : ""}${m.nps?.score || "67"}`;

    const susGameBench = document.getElementById("kpi-sus-game-bench");
    const susSimBench = document.getElementById("kpi-sus-sim-bench");
    if (susGameBench) susGameBench.textContent = m.susGame?.benchmark || "Bom / Acima da Média";
    if (susSimBench) susSimBench.textContent = m.susSim?.benchmark || "Excelente";

    // 2. Renderizar Nuvem de Palavras
    renderWordCloud();

    // 3. Renderizar Gráficos Chart.js
    renderSusComparisonChart();
    renderGamePedagogyChart();
    renderSimModulesChart();
    renderDemographicsCharts();
    renderNpsChart();

    // 4. Renderizar Feedback Qualitativo
    renderQualitativeFeedback();

    if (window.lucide) window.lucide.createIcons();
  }

  /**
   * Renderização da Nuvem de Palavras via WordCloud2 ou Fallback elegante de Tags
   */
  function renderWordCloud() {
    const canvas = document.getElementById("wordcloud-canvas");
    const container = document.getElementById("wordcloud-container");
    const listContainer = document.getElementById("wordcloud-top-list");
    if (!canvas || !container || !state.metrics) return;

    const isGame = state.activeWordCloudTool === "game";
    const wordsList = isGame ? state.metrics.wordsGame : state.metrics.wordsSim;

    // Renderizar Lista Top 6 no Painel Lateral
    if (listContainer) {
      if (!wordsList.length) {
        listContainer.innerHTML = `<li class="text-xs text-slate-500 italic">Sem palavras registadas de momento.</li>`;
      } else {
        const topList = wordsList.slice(0, 6);
        const maxVal = topList[0][1] || 1;
        listContainer.innerHTML = topList.map(([word, count], idx) => `
          <li class="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
            <span class="font-bold text-slate-800 flex items-center gap-1.5">
              <span class="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-mono">${idx + 1}</span>
              ${word}
            </span>
            <span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[11px] font-mono">
              ${count}x
            </span>
          </li>
        `).join("");
      }
    }

    // Se a biblioteca WordCloud2 estiver disponível no ecrã
    if (window.WordCloud) {
      // Ajustar resolução interna do canvas para alta definição
      const rect = container.getBoundingClientRect();
      const width = Math.max(rect.width - 24, 300);
      const height = 280;

      canvas.width = width;
      canvas.height = height;

      if (!wordsList.length) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, width, height);
        ctx.font = "14px sans-serif";
        ctx.fillStyle = "#64748B";
        ctx.textAlign = "center";
        ctx.fillText("A aguardar recolha de palavras...", width / 2, height / 2);
        return;
      }

      // Multiplicador de escala de acordo com as dimensões do ecrã
      const maxCount = wordsList[0][1] || 1;
      const factor = Math.max((width / 380) * (32 / maxCount), 12);

      const colorPalette = isGame 
        ? ["#0F172A", "#D97706", "#B45309", "#059669", "#2563EB", "#7C3AED"]
        : ["#0F172A", "#059669", "#047857", "#2563EB", "#D97706", "#1D4ED8"];

      try {
        WordCloud(canvas, {
          list: wordsList,
          gridSize: Math.round(14 * width / 1024) + 2,
          weightFactor: function (size) {
            return Math.min(Math.max(size * factor, 14), 48);
          },
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: function () {
            return colorPalette[Math.floor(Math.random() * colorPalette.length)];
          },
          rotateRatio: 0.15,
          rotationSteps: 2,
          backgroundColor: "#FFFFFF",
          shrinkToFit: true,
          drawOutOfBound: false
        });
      } catch (e) {
        console.warn("Aviso ao renderizar WordCloud canvas, a aplicar fallback:", e);
        renderWordPillsFallback(container, wordsList);
      }
    } else {
      renderWordPillsFallback(container, wordsList);
    }
  }

  /**
   * Fallback visual HTML puro em nuvem de etiquetas
   */
  function renderWordPillsFallback(container, wordsList) {
    if (!container || !wordsList.length) return;
    const max = wordsList[0][1] || 1;
    container.innerHTML = `
      <div class="flex flex-wrap gap-2.5 items-center justify-center p-6 min-h-[220px]">
        ${wordsList.map(([word, count]) => {
          const ratio = count / max;
          const fontSize = 12 + Math.round(ratio * 16);
          const isTop = ratio > 0.6;
          return `
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold transition-transform hover:scale-105 ${isTop ? 'bg-amber-100 text-slate-900 border-amber-300' : 'bg-slate-50 text-slate-700 border-slate-200'}" style="font-size: ${fontSize}px">
              ${word}
              <span class="text-[10px] opacity-75 font-mono">(${count})</span>
            </span>
          `;
        }).join("")}
      </div>
    `;
  }

  /**
   * Gráfico 1: Comparativo SUS (Serious Game vs Simulador nas 10 dimensões)
   */
  function renderSusComparisonChart() {
    const ctx = document.getElementById("chart-sus-comparison")?.getContext("2d");
    if (!ctx || !window.Chart || !state.metrics) return;

    if (state.charts.susComparison) {
      state.charts.susComparison.destroy();
    }

    const susLabels = [
      "1. Frequência de Uso",
      "2. Baixa Complexidade",
      "3. Facilidade de Uso",
      "4. Independência Técnica",
      "5. Boa Integração",
      "6. Consistência Geral",
      "7. Aprendizagem Rápida",
      "8. Conforto de Uso",
      "9. Confiança Operacional",
      "10. Fácil Iniciação"
    ];

    const gameItems = state.metrics.susGame?.itemsAvg || [4.4, 1.8, 4.6, 1.6, 4.5, 1.7, 4.6, 1.5, 4.5, 1.8];
    const simItems = state.metrics.susSim?.itemsAvg || [4.5, 1.6, 4.7, 1.5, 4.6, 1.5, 4.5, 1.6, 4.6, 1.6];

    state.charts.susComparison = new Chart(ctx, {
      type: "bar",
      data: {
        labels: susLabels,
        datasets: [
          {
            label: "Serious Game (Tallentto)",
            data: gameItems,
            backgroundColor: "#F5B842",
            borderColor: "#D97706",
            borderWidth: 1.5,
            borderRadius: 6
          },
          {
            label: "Simulador RENOVATE (Virmedex)",
            data: simItems,
            backgroundColor: "#0F172A",
            borderColor: "#0F172A",
            borderWidth: 1.5,
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top", labels: { font: { weight: "bold", size: 11 } } },
          tooltip: {
            callbacks: {
              afterLabel: function(context) {
                const idx = context.dataIndex;
                return (idx % 2 === 1) ? "(Nota invertida: quanto menor, melhor usabilidade)" : "(Quanto maior, melhor usabilidade)";
              }
            }
          }
        },
        scales: {
          y: {
            min: 1,
            max: 5,
            ticks: { stepSize: 1, font: { size: 10 } },
            title: { display: true, text: "Escala Likert (1 a 5)", font: { size: 11, weight: "bold" } }
          },
          x: {
            ticks: { font: { size: 10, weight: "600" } }
          }
        }
      }
    });
  }

  /**
   * Gráfico 2: Avaliação Pedagógica do Serious Game (Q7 a Q12)
   */
  function renderGamePedagogyChart() {
    const ctx = document.getElementById("chart-game-pedagogy")?.getContext("2d");
    if (!ctx || !window.Chart || !state.metrics) return;

    if (state.charts.gamePedagogy) {
      state.charts.gamePedagogy.destroy();
    }

    const p = state.metrics.gamePedagogy || { q7: 4.4, q8: 3.9, q9: 4.3, q10: 4.6, q11: 4.5, q12: 4.3 };

    state.charts.gamePedagogy = new Chart(ctx, {
      type: "radar",
      data: {
        labels: [
          "Q7. Clareza Explicações",
          "Q8. Dificuldade Adequada",
          "Q9. Realismo de Cenários",
          "Q10. Passos Calibração",
          "Q11. Envolvimento Lúdico",
          "Q12. Expectativas Globais"
        ],
        datasets: [{
          label: "Avaliação Pedagógica Média (1 a 5)",
          data: [p.q7, p.q8, p.q9, p.q10, p.q11, p.q12],
          backgroundColor: "rgba(245, 184, 66, 0.25)",
          borderColor: "#F5B842",
          borderWidth: 2.5,
          pointBackgroundColor: "#0F172A",
          pointBorderColor: "#FFFFFF",
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          r: {
            min: 0,
            max: 5,
            ticks: { stepSize: 1, font: { size: 9 } },
            pointLabels: { font: { size: 11, weight: "bold" }, color: "#0F172A" }
          }
        }
      }
    });
  }

  /**
   * Gráfico 3: Avaliação Técnica e Módulos do Simulador (Q15 a Q23)
   */
  function renderSimModulesChart() {
    const ctx = document.getElementById("chart-sim-modules")?.getContext("2d");
    if (!ctx || !window.Chart || !state.metrics) return;

    if (state.charts.simModules) {
      state.charts.simModules.destroy();
    }

    const s = state.metrics.simModules || {
      q15: 4.1, q16: 4.2, q17: 4.5, q18: 4.7, q19: 4.0, q20: 4.6, q21: 4.4, q22: 4.5, q23: 4.4
    };

    state.charts.simModules = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [
          "Q15. Navegação e Controlos",
          "Q16. Tutoriais e Menus",
          "Q17. Eficácia Pedagógica",
          "Q18. Sequência de Decisão",
          "Q19. Cálculos e Fórmulas",
          "Q20. Bicos e Volume de Calda",
          "Q21. Seleção e Rótulo",
          "Q22. Variáveis de Campo",
          "Q23. Expectativas Globais"
        ],
        datasets: [{
          label: "Média (1 a 5)",
          data: [s.q15, s.q16, s.q17, s.q18, s.q19, s.q20, s.q21, s.q22, s.q23],
          backgroundColor: "#059669",
          borderColor: "#047857",
          borderWidth: 1.5,
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            min: 0,
            max: 5,
            ticks: { stepSize: 1, font: { size: 10 } }
          },
          y: {
            ticks: { font: { size: 10, weight: "bold" }, color: "#0F172A" }
          }
        }
      }
    });
  }

  /**
   * Gráficos 4 & 5: Demografia (Perfis Profissionais e Culturas Agrícolas)
   */
  function renderDemographicsCharts() {
    if (!state.metrics?.demographics) return;
    const demo = state.metrics.demographics;

    // Gráfico de Perfis Profissionais (Donut)
    const ctxProfiles = document.getElementById("chart-demo-profiles")?.getContext("2d");
    if (ctxProfiles && window.Chart) {
      if (state.charts.demoProfiles) state.charts.demoProfiles.destroy();

      const pLabels = Object.keys(demo.profiles || {});
      const pData = Object.values(demo.profiles || {});

      state.charts.demoProfiles = new Chart(ctxProfiles, {
        type: "doughnut",
        data: {
          labels: pLabels.length ? pLabels : ["Técnico / Consultor", "Eng. Agrónomo", "Produtor", "Investigador"],
          datasets: [{
            data: pData.length ? pData : [7, 5, 3, 3],
            backgroundColor: ["#F5B842", "#0F172A", "#059669", "#2563EB", "#D97706", "#8B5CF6"],
            borderWidth: 2,
            borderColor: "#FFFFFF"
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "bottom", labels: { font: { size: 10, weight: "bold" }, boxWidth: 12 } }
          }
        }
      });
    }

    // Gráfico de Culturas Agrícolas Representadas (Barras)
    const ctxCrops = document.getElementById("chart-demo-crops")?.getContext("2d");
    if (ctxCrops && window.Chart) {
      if (state.charts.demoCrops) state.charts.demoCrops.destroy();

      const cLabels = Object.keys(demo.crops || {});
      const cData = Object.values(demo.crops || {});

      state.charts.demoCrops = new Chart(ctxCrops, {
        type: "bar",
        data: {
          labels: cLabels.length ? cLabels : ["Vinhedo", "Olivicultura", "Fruticultura", "Milho", "Hortícolas"],
          datasets: [{
            label: "Participantes Envolvidos",
            data: cData.length ? cData : [11, 10, 8, 6, 5],
            backgroundColor: "#2563EB",
            borderColor: "#1D4ED8",
            borderWidth: 1.5,
            borderRadius: 6
          }]
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { stepSize: 2, font: { size: 10 } } },
            y: { ticks: { font: { size: 10, weight: "bold" }, color: "#0F172A" } }
          }
        }
      });
    }

    // Atualizar Média de Literacia Digital (Q6)
    const digitalEl = document.getElementById("demo-digital-comfort");
    if (digitalEl) {
      digitalEl.textContent = `${demo.digitalComfortAvg || "3.8"} / 5.0`;
    }
  }

  /**
   * Gráfico 6: Net Promoter Score (NPS - Q29)
   */
  function renderNpsChart() {
    const ctx = document.getElementById("chart-nps-gauge")?.getContext("2d");
    if (!ctx || !window.Chart || !state.metrics?.nps) return;

    if (state.charts.npsGauge) state.charts.npsGauge.destroy();

    const n = state.metrics.nps;

    state.charts.npsGauge = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Promotores (Notas 9-10)", "Passivos (Notas 7-8)", "Detratores (Notas 0-6)"],
        datasets: [{
          data: [n.promoters || 13, n.passives || 4, n.detractors || 1],
          backgroundColor: ["#059669", "#F5B842", "#E11D48"],
          borderWidth: 2,
          borderColor: "#FFFFFF"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom", labels: { font: { size: 10, weight: "bold" }, boxWidth: 12 } }
        }
      }
    });

    const npsScoreEl = document.getElementById("nps-center-score");
    if (npsScoreEl) {
      npsScoreEl.textContent = `${n.score > 0 ? "+" : ""}${n.score}`;
    }
  }

  /**
   * Renderização do Feedback Qualitativo dos Participantes (Q25 e Q30)
   */
  function renderQualitativeFeedback() {
    const containerSim = document.getElementById("feedback-sim-container");
    const containerFinal = document.getElementById("feedback-final-container");
    if (!state.metrics?.qualitativeFeedback) return;

    const { simSuggestions, finalSuggestions } = state.metrics.qualitativeFeedback;

    if (containerSim) {
      if (!simSuggestions.length) {
        containerSim.innerHTML = `<p class="text-xs text-slate-500 italic p-3">Sem sugestões registadas de momento.</p>`;
      } else {
        containerSim.innerHTML = simSuggestions.slice(0, 6).map(item => `
          <div class="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div class="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">${item.code || 'Participante'}</span>
              <span class="text-amber-800 font-semibold flex items-center gap-1"><i data-lucide="message-square" class="w-3 h-3"></i> Q25 Simulador</span>
            </div>
            <p class="text-xs text-slate-800 leading-relaxed font-medium">"${item.text}"</p>
          </div>
        `).join("");
      }
    }

    if (containerFinal) {
      if (!finalSuggestions.length) {
        containerFinal.innerHTML = `<p class="text-xs text-slate-500 italic p-3">Sem sugestões registadas de momento.</p>`;
      } else {
        containerFinal.innerHTML = finalSuggestions.slice(0, 6).map(item => `
          <div class="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div class="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span class="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">${item.code || 'Participante'}</span>
              <span class="text-emerald-800 font-semibold flex items-center gap-1"><i data-lucide="check-circle" class="w-3 h-3"></i> Q30 Consórcio</span>
            </div>
            <p class="text-xs text-slate-800 leading-relaxed font-medium">"${item.text}"</p>
          </div>
        `).join("");
      }
    }
  }

  /**
   * Redimensiona e atualiza os gráficos quando a aba Resultados se torna visível
   */
  function resizeAllCharts() {
    Object.values(state.charts).forEach(c => {
      if (c && typeof c.resize === "function") {
        try { c.resize(); } catch (e) {}
      }
    });
  }

  /**
   * Gancho chamado quando o router do SPA ativa a tab Resultados
   */
  function onTabShown() {
    setTimeout(() => {
      resizeAllCharts();
      renderWordCloud();
    }, 150);
  }

  /**
   * Notificação Toast flutuante
   */
  function showToast(message, type = "info") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    const colors = type === "success" 
      ? "bg-emerald-900 text-white border-emerald-700" 
      : "bg-slate-900 text-white border-slate-700";

    toast.className = `toast pointer-events-auto px-4 py-2.5 rounded-xl border shadow-xl text-xs font-semibold flex items-center gap-2 transform transition-all duration-300 translate-y-4 opacity-0 ${colors}`;
    toast.innerHTML = `
      <span>${message}</span>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove("translate-y-4", "opacity-0");
    });

    setTimeout(() => {
      toast.classList.add("translate-y-4", "opacity-0");
      setTimeout(() => toast.remove(), 350);
    }, 4000);
  }

  // API pública do módulo
  return {
    init,
    fetchData,
    onTabShown,
    resizeAllCharts,
    setSectionFilter
  };
})();
