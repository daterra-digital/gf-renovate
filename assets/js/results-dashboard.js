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

  // Stopwords in English for word clouds
  const EN_STOPWORDS = new Set([
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with",
    "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
    "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if",
    "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just",
    "him", "know", "take", "people", "into", "year", "your", "good", "some", "could", "them", "see",
    "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", "back",
    "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because",
    "any", "these", "give", "day", "most", "us", "very", "much", "1", "2", "3", "etc"
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

  // Opções Oficiais do Questionário de Validação
  const OFFICIAL_PROFILES = [
    "Agricultor(a) / Produtor(a)",
    "Técnico(a) / Consultor(a)",
    "Formador(a) / Profissional de Ensino Agrícola",
    "Representante da Indústria (Maquinaria / Agroquímicos)",
    "Entidade Reguladora / Administração Pública",
    "Estudante",
    "Investigador(a)",
    "Outra"
  ];

  const PROFILE_TRANSLATIONS = {
    "Agricultor(a) / Produtor(a)": "Farmer / Producer",
    "Técnico(a) / Consultor(a)": "Technical Advisor / Consultant",
    "Formador(a) / Profissional de Ensino Agrícola": "Trainer / Agricultural Educator",
    "Representante da Indústria (Maquinaria / Agroquímicos)": "Industry Representative (Machinery / Agrochemicals)",
    "Entidade Reguladora / Administração Pública": "Regulatory Entity / Public Administration",
    "Estudante": "Student",
    "Investigador(a)": "Researcher",
    "Outra": "Other"
  };

  const OFFICIAL_CROPS = [
    "Vinha",
    "Pomóideas / Prunóideas",
    "Olival",
    "Cereais / Culturas arvenses",
    "Hortícolas"
  ];

  const CROP_TRANSLATIONS = {
    "Vinha": "Vineyard / Grapevine",
    "Pomóideas / Prunóideas": "Pome / Stone Fruit",
    "Olival": "Olive Grove",
    "Cereais / Culturas arvenses": "Cereals / Arable Crops",
    "Hortícolas": "Vegetables / Horticulture"
  };

  const OFFICIAL_Q29_OPTIONS = [
    "Extremamente provável",
    "Muito provável",
    "Moderavelmente provável",
    "Pouco Provável",
    "Nada provável"
  ];

  const Q29_TRANSLATIONS = {
    "Extremamente provável": "Extremely likely",
    "Muito provável": "Very likely",
    "Moderavelmente provável": "Moderately likely",
    "Pouco Provável": "Unlikely",
    "Nada provável": "Not likely at all"
  };

  function normalizeProfile(val) {
    if (!val) return "Outra";
    const s = String(val).trim().toLowerCase();
    if (s.includes("agricultor") || s.includes("produtor")) return "Agricultor(a) / Produtor(a)";
    if (s.includes("técnico") || s.includes("tecnico") || s.includes("consultor")) return "Técnico(a) / Consultor(a)";
    if (s.includes("formador") || s.includes("ensino") || s.includes("professor") || s.includes("docente")) return "Formador(a) / Profissional de Ensino Agrícola";
    if (s.includes("indústria") || s.includes("industria") || s.includes("maquinaria") || s.includes("agroquímico") || s.includes("agroquimico")) return "Representante da Indústria (Maquinaria / Agroquímicos)";
    if (s.includes("reguladora") || s.includes("administração") || s.includes("administracao") || s.includes("pública") || s.includes("publica") || s.includes("governo")) return "Entidade Reguladora / Administração Pública";
    if (s.includes("estudante") || s.includes("aluno")) return "Estudante";
    if (s.includes("investigador") || s.includes("pesquisador") || s.includes("cientista")) return "Investigador(a)";
    return "Outra";
  }

  function normalizeCrop(val) {
    if (!val) return null;
    const s = String(val).trim().toLowerCase();
    if (s.includes("vinha") || s.includes("vinhedo") || s.includes("viticultura") || s.includes("uva")) return "Vinha";
    if (s.includes("pomóidea") || s.includes("pomoidea") || s.includes("prunóidea") || s.includes("prunoidea") || s.includes("pomar") || s.includes("fruti") || s.includes("maçã") || s.includes("maca") || s.includes("pera") || s.includes("pessego")) return "Pomóideas / Prunóideas";
    if (s.includes("olival") || s.includes("oliva") || s.includes("azeite") || s.includes("oliveira")) return "Olival";
    if (s.includes("cereal") || s.includes("cereais") || s.includes("arvense") || s.includes("milho") || s.includes("trigo") || s.includes("cevada") || s.includes("arroz") || s.includes("grandes")) return "Cereais / Culturas arvenses";
    if (s.includes("hortícola") || s.includes("horticola") || s.includes("hortaliça") || s.includes("hortalica") || s.includes("legume") || s.includes("tomate")) return "Hortícolas";
    return null;
  }

  function parseDigitalComfort(val) {
    if (typeof val === "number" && val >= 1 && val <= 5) return val;
    if (!val) return 3;
    const s = String(val).trim().toLowerCase();
    if (s.includes("muito desconfortável") || s.includes("muito desconfortavel")) return 1;
    if (s.includes("muito confortável") || s.includes("muito confortavel")) return 5;
    if (s.includes("nem") || s.includes("neutro")) return 3;
    if (s.includes("desconfortável") || s.includes("desconfortavel")) return 2;
    if (s.includes("confortável") || s.includes("confortavel")) return 4;
    const m = s.match(/[1-5]/);
    return m ? parseInt(m[0], 10) : 3;
  }

  function getComfortLevelLabel(avg, isEn) {
    const num = parseFloat(avg);
    if (num >= 4.5) return isEn ? "Very comfortable (Level 5/5)" : "Muito confortável (Nível 5/5)";
    if (num >= 3.5) return isEn ? "Comfortable (Level 4/5)" : "Confortável (Nível 4/5)";
    if (num >= 2.5) return isEn ? "Neither comfortable nor uncomfortable (Level 3/5)" : "Nem confortável nem desconfortável (Nível 3/5)";
    if (num >= 1.5) return isEn ? "Uncomfortable (Level 2/5)" : "Desconfortável (Nível 2/5)";
    return isEn ? "Very uncomfortable (Level 1/5)" : "Muito desconfortável (Nível 1/5)";
  }

  function parseQ29Recommendation(val) {
    if (!val) return "Muito provável";
    const s = String(val).trim().toLowerCase();
    if (s.includes("extremamente")) return "Extremamente provável";
    if (s.includes("pouco")) return "Pouco Provável";
    if (s.includes("nada")) return "Nada provável";
    if (s.includes("moderada") || s.includes("moderavelmente")) return "Moderavelmente provável";
    if (s.includes("muito")) return "Muito provável";

    const m = s.match(/\d+/);
    if (m) {
      const n = parseInt(m[0], 10);
      if (n >= 9 || n === 5) return "Extremamente provável";
      if (n >= 7 || n === 4) return "Muito provável";
      if (n >= 5 || n === 3) return "Moderavelmente provável";
      if (n >= 3 || n === 2) return "Pouco Provável";
      return "Nada provável";
    }
    return "Muito provável";
  }

  function getQ29Weight(label) {
    switch (label) {
      case "Extremamente provável": return 5;
      case "Muito provável": return 4;
      case "Moderavelmente provável": return 3;
      case "Pouco Provável": return 2;
      case "Nada provável": return 1;
      default: return 4;
    }
  }

  function calculateQ29Recommendation(rawList) {
    const counts = {
      "Extremamente provável": 0,
      "Muito provável": 0,
      "Moderavelmente provável": 0,
      "Pouco Provável": 0,
      "Nada provável": 0
    };

    if (!rawList || !rawList.length) {
      return {
        average: 4.7,
        positivePercent: 94,
        counts: { "Extremamente provável": 10, "Muito provável": 6, "Moderavelmente provável": 2, "Pouco Provável": 0, "Nada provável": 0 },
        total: 18
      };
    }

    let sum = 0;
    let total = 0;

    rawList.forEach(item => {
      const opt = parseQ29Recommendation(item);
      if (counts[opt] !== undefined) {
        counts[opt]++;
        sum += getQ29Weight(opt);
        total++;
      }
    });

    const average = total > 0 ? parseFloat((sum / total).toFixed(1)) : 4.7;
    const positive = counts["Extremamente provável"] + counts["Muito provável"];
    const positivePercent = total > 0 ? Math.round((positive / total) * 100) : 94;

    return {
      average,
      positivePercent,
      counts,
      total
    };
  }

  // Configuração Oficial e Permanente das Folhas Google Sheets (Focus Group 2)
  const OFFICIAL_SHEET_CONFIG = {
    spreadsheetId: "2PACX-1vQKvZtpO0WW7vqeOMvJpmFbDoh8K2F0h0SSI5t3S1LiI7Ag1nQpGJi3CkDkeGxrULkk4UxSLjrhTd1e",
    tabGids: {
      game: "1971530026",  // Questionário 1: Serious Game (Tallentto) + Demografia
      sim: "1882859537",    // Questionário 2: Simulador 3D (Virmedex)
      global: "914346842"   // Questionário 3: Avaliação Global (NPS + Síntese)
    },
    autoRefreshSeconds: 30
  };

  // Estado interno
  let state = {
    config: Object.assign({}, OFFICIAL_SHEET_CONFIG),
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
   * Carrega a configuração oficial dos Google Sheets
   */
  function loadConfig() {
    state.config = Object.assign({}, OFFICIAL_SHEET_CONFIG);

    // Se houver personalização válida no localStorage com ID não-vazio
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.spreadsheetId && parsed.spreadsheetId.trim()) {
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

    // Dropdown de Conexão Sheets e Links Diretos Oficiais
    const btnSheetsMenu = document.getElementById("btn-sheets-menu");
    const dropdownSheetsMenu = document.getElementById("dropdown-sheets-menu");
    const dropdownSheetsContainer = document.getElementById("dropdown-sheets-container");

    if (btnSheetsMenu && dropdownSheetsMenu) {
      btnSheetsMenu.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdownSheetsMenu.classList.toggle("hidden");
      });

      // Fechar dropdown ao clicar fora
      document.addEventListener("click", (e) => {
        if (dropdownSheetsContainer && !dropdownSheetsContainer.contains(e.target)) {
          dropdownSheetsMenu.classList.add("hidden");
        }
      });
    }

    // Botão Sincronizar Agora no Dropdown
    const btnSyncNowDropdown = document.getElementById("btn-sync-now-dropdown");
    if (btnSyncNowDropdown) {
      btnSyncNowDropdown.addEventListener("click", (e) => {
        e.stopPropagation();
        if (dropdownSheetsMenu) dropdownSheetsMenu.classList.add("hidden");
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
      demographics: document.getElementById("results-sec-demographics"),
      sus: document.getElementById("results-sec-sus"),
      pedagogical: document.getElementById("results-sec-pedagogical"),
      feedback: document.getElementById("results-sec-feedback"),
      wordcloud: document.getElementById("results-sec-wordcloud")
    };

    if (filter === "all") {
      Object.values(sections).forEach(s => s && s.classList.remove("hidden"));
    } else {
      Object.entries(sections).forEach(([key, sec]) => {
        if (!sec) return;
        if (key === filter) {
          sec.classList.remove("hidden");
        } else {
          sec.classList.add("hidden");
        }
      });
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

    const isEn = window.I18nManager && window.I18nManager.isEnglish();
    const now = new Date();
    const timeStr = now.toLocaleTimeString(isEn ? "en-GB" : "pt-PT", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    state.lastUpdated = timeStr;

    if (timeEl) {
      timeEl.textContent = isEn ? `Last sync: ${timeStr}` : `Última sincronização: ${timeStr}`;
    }

    if (state.isLive && state.isWaitingAnswers) {
      badge.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs";
      badge.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>${isEn ? "Google Sheets Connected (Awaiting Responses)" : "Google Sheets Conectado (Aguardando Respostas)"}</span>
      `;
    } else if (state.isLive) {
      badge.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs";
      badge.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>${isEn ? "Google Sheets Connected (Real-Time)" : "Google Sheets Conectado (Em Tempo Real)"}</span>
      `;
    } else {
      badge.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs";
      badge.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-amber-500"></span>
        <span>${isEn ? "Demo Mode (Preview Data)" : "Modo Demonstração (Dados de Pré-Visualização)"}</span>
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
    const q29List = global.map(r => r.q29 || r.nps);
    const nps = calculateQ29Recommendation(q29List);

    // Palavras-chave
    const wordsGame = extractWordFrequencies(game.map(r => r.words));
    const wordsSim = extractWordFrequencies(sim.map(r => r.words));

    // Demografia
    const profiles = {};
    const crops = {};
    const ages = {};
    let digitalTotal = 0;

    game.forEach(r => {
      const p = normalizeProfile(r.profile);
      profiles[p] = (profiles[p] || 0) + 1;
      ages[r.age] = (ages[r.age] || 0) + 1;
      const c = parseDigitalComfort(r.digitalComfort);
      digitalTotal += c;
      if (Array.isArray(r.crops)) {
        r.crops.forEach(cItem => {
          const normCrop = normalizeCrop(cItem);
          if (normCrop) crops[normCrop] = (crops[normCrop] || 0) + 1;
        });
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

    // Processamento Q29 Recomendação do Questionário Global
    const q29Responses = globalData.map(row => {
      return idxQ29 !== -1 && row[idxQ29] ? row[idxQ29] : "Extremamente provável";
    });
    const nps = calculateQ29Recommendation(q29Responses);

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
      const rawP = idxProfile !== -1 && row[idxProfile] ? row[idxProfile].trim() : "Outra";
      const p = normalizeProfile(rawP);
      profiles[p] = (profiles[p] || 0) + 1;

      const a = idxAge !== -1 && row[idxAge] ? row[idxAge].trim() : "30-45 anos";
      ages[a] = (ages[a] || 0) + 1;

      if (idxComfort !== -1 && row[idxComfort]) {
        const c = parseDigitalComfort(row[idxComfort]);
        digitalTotal += c;
        digitalCount++;
      }

      if (idxCrops !== -1 && row[idxCrops]) {
        const cropItems = row[idxCrops].split(/[,;]/);
        cropItems.forEach(c => {
          const normCrop = normalizeCrop(c);
          if (normCrop) crops[normCrop] = (crops[normCrop] || 0) + 1;
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

    const isEn = window.I18nManager && window.I18nManager.isEnglish();
    let benchmark = isEn ? "Good / Above Average" : "Bom / Acima da Média";
    if (averageScore >= 85) benchmark = isEn ? "Excellent (Grade A)" : "Excelente (Classe A)";
    else if (averageScore >= 80) benchmark = isEn ? "Excellent" : "Excelente";
    else if (averageScore >= 68) benchmark = isEn ? "Good (Industry Average: 68)" : "Bom (Média da Indústria: 68)";
    else if (averageScore >= 50) benchmark = isEn ? "Marginal / OK" : "Marginal / Razoável";
    else benchmark = isEn ? "Unacceptable" : "Inaceitável";

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
        if (clean.length >= 3 && !PT_STOPWORDS.has(clean) && !EN_STOPWORDS.has(clean)) {
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
    const kpiNpsUnit = document.getElementById("kpi-nps-unit");

    if (kpiCount) kpiCount.textContent = m.participantCount || 0;
    if (kpiSusGame) kpiSusGame.textContent = m.susGame?.average || "78.4";
    if (kpiSusSim) kpiSusSim.textContent = m.susSim?.average || "81.6";
    if (kpiNps) kpiNps.textContent = `${m.nps?.average || "4.7"}`;
    if (kpiNpsUnit) kpiNpsUnit.textContent = `/ 5.0 (${m.nps?.positivePercent || 94}%)`;

    const susGameBench = document.getElementById("kpi-sus-game-bench");
    const susSimBench = document.getElementById("kpi-sus-sim-bench");
    if (susGameBench) susGameBench.textContent = m.susGame?.benchmark || "Bom / Acima da Média";
    if (susSimBench) susSimBench.textContent = m.susSim?.benchmark || "Excelente";

    // 2. Renderizar Nuvem de Palavras
    renderWordCloud();

    // 3. Renderizar Régua e Gráficos de Usabilidade SUS
    renderSusBenchmarkGauge();
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

    const isEn = window.I18nManager && window.I18nManager.isEnglish();
    const isGame = state.activeWordCloudTool === "game";
    const wordsList = isGame ? state.metrics.wordsGame : state.metrics.wordsSim;

    // Renderizar Lista Top 6 no Painel Lateral
    if (listContainer) {
      if (!wordsList.length) {
        listContainer.innerHTML = `<li class="text-xs text-slate-500 italic">${isEn ? "No words recorded yet." : "Sem palavras registadas de momento."}</li>`;
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
        ctx.fillText(isEn ? "Awaiting word submissions..." : "A aguardar recolha de palavras...", width / 2, height / 2);
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
   * Renderização da Régua Visual SUS com Posicionamento dos Resultados Finais
   */
  function renderSusBenchmarkGauge() {
    if (!state.metrics) return;
    const m = state.metrics;
    const isEn = window.I18nManager && window.I18nManager.isEnglish();

    const gameScore = m.susGame?.average ? parseFloat(m.susGame.average) : 78.4;
    const simScore = m.susSim?.average ? parseFloat(m.susSim.average) : 81.6;

    // 1. Atualizar Cartões de Resultado Final
    const cardGameScore = document.getElementById("sus-card-game-score");
    const cardGameBench = document.getElementById("sus-card-game-bench");
    const cardGameDiff = document.getElementById("sus-card-game-diff");

    const cardSimScore = document.getElementById("sus-card-sim-score");
    const cardSimBench = document.getElementById("sus-card-sim-bench");
    const cardSimDiff = document.getElementById("sus-card-sim-diff");

    if (cardGameScore) cardGameScore.textContent = gameScore.toFixed(1);
    if (cardGameBench) cardGameBench.textContent = m.susGame?.benchmark || (isEn ? "Good / Above Average" : "Bom / Acima da Média");
    if (cardGameDiff) {
      const diffGame = (gameScore - 68.0).toFixed(1);
      const sign = diffGame >= 0 ? "+" : "";
      cardGameDiff.textContent = `${sign}${diffGame} ${isEn ? "vs Global Avg (68.0)" : "vs Média Mundial"}`;
    }

    if (cardSimScore) cardSimScore.textContent = simScore.toFixed(1);
    if (cardSimBench) cardSimBench.textContent = m.susSim?.benchmark || (isEn ? "Excellent (Grade A)" : "Excelente (Classe A)");
    if (cardSimDiff) {
      const diffSim = (simScore - 68.0).toFixed(1);
      const sign = diffSim >= 0 ? "+" : "";
      cardSimDiff.textContent = `${sign}${diffSim} ${isEn ? "vs Global Avg (68.0)" : "vs Média Mundial"}`;
    }

    // 2. Atualizar Pinos Indicadores na Régua
    const pinGame = document.getElementById("sus-pin-game");
    const pinSim = document.getElementById("sus-pin-sim");
    const pinGameText = document.getElementById("sus-pin-game-text");
    const pinSimText = document.getElementById("sus-pin-sim-text");

    const gamePos = Math.min(Math.max(gameScore, 4), 96);
    const simPos = Math.min(Math.max(simScore, 4), 96);

    if (pinGame) {
      pinGame.style.left = `${gamePos}%`;
    }
    if (pinGameText) {
      pinGameText.textContent = `Game: ${gameScore.toFixed(1)}`;
    }

    if (pinSim) {
      pinSim.style.left = `${simPos}%`;
    }
    if (pinSimText) {
      pinSimText.textContent = `Simulador: ${simScore.toFixed(1)}`;
    }
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

    const isEn = window.I18nManager && window.I18nManager.isEnglish();

    const susLabels = isEn ? [
      "1. Frequency of Use",
      "2. Low Complexity",
      "3. Ease of Use",
      "4. Tech Independence",
      "5. Well Integrated",
      "6. Overall Consistency",
      "7. Quick Learning",
      "8. Usability Comfort",
      "9. Confidence in Use",
      "10. Easy Onboarding"
    ] : [
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
            label: isEn ? "RENOVATE Simulator (Virmedex)" : "Simulador RENOVATE (Virmedex)",
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
                if (isEn) {
                  return (idx % 2 === 1) ? "(Inverted item: lower score means better usability)" : "(Higher score means better usability)";
                }
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
            title: { display: true, text: isEn ? "Likert Scale (1 to 5)" : "Escala Likert (1 a 5)", font: { size: 11, weight: "bold" } }
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

    const isEn = window.I18nManager && window.I18nManager.isEnglish();
    const p = state.metrics.gamePedagogy || { q7: 4.4, q8: 3.9, q9: 4.3, q10: 4.6, q11: 4.5, q12: 4.3 };

    state.charts.gamePedagogy = new Chart(ctx, {
      type: "radar",
      data: {
        labels: isEn ? [
          "Q7. Explanation Clarity",
          "Q8. Suitable Difficulty",
          "Q9. Scenario Realism",
          "Q10. Calibration Steps",
          "Q11. Gamified Engagement",
          "Q12. Global Expectations"
        ] : [
          "Q7. Clareza Explicações",
          "Q8. Dificuldade Adequada",
          "Q9. Realismo de Cenários",
          "Q10. Passos Calibração",
          "Q11. Envolvimento Lúdico",
          "Q12. Expectativas Globais"
        ],
        datasets: [{
          label: isEn ? "Average Pedagogical Rating (1 to 5)" : "Avaliação Pedagógica Média (1 a 5)",
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

    const isEn = window.I18nManager && window.I18nManager.isEnglish();
    const s = state.metrics.simModules || {
      q15: 4.1, q16: 4.2, q17: 4.5, q18: 4.7, q19: 4.0, q20: 4.6, q21: 4.4, q22: 4.5, q23: 4.4
    };

    state.charts.simModules = new Chart(ctx, {
      type: "bar",
      data: {
        labels: isEn ? [
          "Q15. Navigation & Controls",
          "Q16. Tutorials & Menus",
          "Q17. Pedagogical Efficacy",
          "Q18. Decision Sequence",
          "Q19. Calculations & Formulas",
          "Q20. Nozzles & Spray Volume",
          "Q21. Product Selection & Label",
          "Q22. Field Variables",
          "Q23. Global Expectations"
        ] : [
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
          label: isEn ? "Mean Score (1 to 5)" : "Média (1 a 5)",
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
    const isEn = window.I18nManager && window.I18nManager.isEnglish();

    // Gráfico de Perfis Profissionais (Q1 - Donut)
    const ctxProfiles = document.getElementById("chart-demo-profiles")?.getContext("2d");
    if (ctxProfiles && window.Chart) {
      if (state.charts.demoProfiles) state.charts.demoProfiles.destroy();

      const pEntries = OFFICIAL_PROFILES
        .map(p => ({
          label: isEn ? (PROFILE_TRANSLATIONS[p] || p) : p,
          count: demo.profiles[p] || 0
        }))
        .filter(item => item.count > 0);

      const pLabels = pEntries.length ? pEntries.map(e => e.label) : [isEn ? "Farmer / Producer" : "Agricultor(a) / Produtor(a)"];
      const pData = pEntries.length ? pEntries.map(e => e.count) : [1];

      state.charts.demoProfiles = new Chart(ctxProfiles, {
        type: "doughnut",
        data: {
          labels: pLabels,
          datasets: [{
            data: pData,
            backgroundColor: ["#F5B842", "#0F172A", "#059669", "#2563EB", "#D97706", "#8B5CF6", "#06B6D4", "#64748B"],
            borderWidth: 2,
            borderColor: "#FFFFFF"
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: { font: { size: 9, weight: "bold" }, boxWidth: 10, padding: 6 }
            }
          }
        }
      });
    }

    // Gráfico de Culturas com Maior Representatividade (Q5 - Barras Horizontais)
    const ctxCrops = document.getElementById("chart-demo-crops")?.getContext("2d");
    if (ctxCrops && window.Chart) {
      if (state.charts.demoCrops) state.charts.demoCrops.destroy();

      const cEntries = OFFICIAL_CROPS.map(c => ({
        label: isEn ? (CROP_TRANSLATIONS[c] || c) : c,
        count: demo.crops[c] || 0
      })).sort((a, b) => b.count - a.count);

      state.charts.demoCrops = new Chart(ctxCrops, {
        type: "bar",
        data: {
          labels: cEntries.map(e => e.label),
          datasets: [{
            label: isEn ? "Involved Participants" : "Participantes Envolvidos",
            data: cEntries.map(e => e.count),
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
            x: {
              beginAtZero: true,
              ticks: { stepSize: 2, font: { size: 10 } }
            },
            y: {
              ticks: { font: { size: 10, weight: "bold" }, color: "#0F172A" }
            }
          }
        }
      });
    }

    // Atualizar Média de Literacia Digital (Q6)
    const digitalEl = document.getElementById("demo-digital-comfort");
    const digitalLabelEl = document.getElementById("demo-digital-comfort-label");
    if (digitalEl) {
      digitalEl.textContent = `${demo.digitalComfortAvg || "3.8"} / 5.0`;
    }
    if (digitalLabelEl) {
      digitalLabelEl.textContent = getComfortLevelLabel(demo.digitalComfortAvg || 3.8, isEn);
    }
  }

  /**
   * Gráfico 6: Recomendação RENOVATE (Q29)
   */
  function renderNpsChart() {
    const ctx = document.getElementById("chart-nps-gauge")?.getContext("2d");
    if (!ctx || !window.Chart || !state.metrics?.nps) return;

    if (state.charts.npsGauge) state.charts.npsGauge.destroy();

    const isEn = window.I18nManager && window.I18nManager.isEnglish();
    const n = state.metrics.nps;
    const counts = n.counts || {};

    const labels = OFFICIAL_Q29_OPTIONS.map(opt => isEn ? (Q29_TRANSLATIONS[opt] || opt) : opt);
    const data = OFFICIAL_Q29_OPTIONS.map(opt => counts[opt] || 0);

    state.charts.npsGauge = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ["#059669", "#2563EB", "#F5B842", "#EA580C", "#DC2626"],
          borderWidth: 2,
          borderColor: "#FFFFFF"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: { font: { size: 9, weight: "bold" }, boxWidth: 10, padding: 6 }
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const val = context.raw || 0;
                const total = n.total || 1;
                const pct = Math.round((val / total) * 100);
                return ` ${context.label}: ${val} (${pct}%)`;
              }
            }
          }
        }
      }
    });

    const npsScoreEl = document.getElementById("nps-center-score");
    if (npsScoreEl) {
      npsScoreEl.textContent = `${n.average} / 5.0 (${n.positivePercent}%)`;
    }
  }

  /**
   * Renderização do Feedback Qualitativo dos Participantes (Q25 e Q30)
   */
  function renderQualitativeFeedback() {
    const containerSim = document.getElementById("feedback-sim-container");
    const containerFinal = document.getElementById("feedback-final-container");
    if (!state.metrics?.qualitativeFeedback) return;

    const isEn = window.I18nManager && window.I18nManager.isEnglish();
    const { simSuggestions, finalSuggestions } = state.metrics.qualitativeFeedback;

    const noSuggestionsText = isEn ? "No suggestions recorded yet." : "Sem sugestões registadas de momento.";
    const participantLabel = isEn ? "Participant" : "Participante";
    const simTag = isEn ? "Q25 Simulator" : "Q25 Simulador";
    const finalTag = isEn ? "Q30 Consortium" : "Q30 Consórcio";

    if (containerSim) {
      if (!simSuggestions.length) {
        containerSim.innerHTML = `<p class="text-xs text-slate-500 italic p-3">${noSuggestionsText}</p>`;
      } else {
        containerSim.innerHTML = simSuggestions.slice(0, 6).map(item => `
          <div class="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5 hover:border-slate-300 transition-all">
            <div class="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px] font-bold border border-slate-200 shadow-2xs">
                <i data-lucide="user" class="w-3.5 h-3.5 text-slate-500 shrink-0"></i>
                <span>${item.code || participantLabel}</span>
              </span>
              <span class="text-amber-800 font-semibold flex items-center gap-1"><i data-lucide="message-square" class="w-3 h-3"></i> ${simTag}</span>
            </div>
            <p class="text-xs text-slate-800 leading-relaxed font-medium">"${item.text}"</p>
          </div>
        `).join("");
      }
    }

    if (containerFinal) {
      if (!finalSuggestions.length) {
        containerFinal.innerHTML = `<p class="text-xs text-slate-500 italic p-3">${noSuggestionsText}</p>`;
      } else {
        containerFinal.innerHTML = finalSuggestions.slice(0, 6).map(item => `
          <div class="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5 hover:border-slate-300 transition-all">
            <div class="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-mono text-[11px] font-bold border border-emerald-200 shadow-2xs">
                <i data-lucide="user" class="w-3.5 h-3.5 text-emerald-600 shrink-0"></i>
                <span>${item.code || participantLabel}</span>
              </span>
              <span class="text-emerald-800 font-semibold flex items-center gap-1"><i data-lucide="check-circle" class="w-3 h-3"></i> ${finalTag}</span>
            </div>
            <p class="text-xs text-slate-800 leading-relaxed font-medium">"${item.text}"</p>
          </div>
        `).join("");
      }
    }

    if (window.lucide) {
      window.lucide.createIcons();
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
