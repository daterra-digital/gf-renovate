/**
 * RENOVATE FG2 - Gestor de Submissões e Contadores em Tempo Real
 * Controlo Automático de Participantes (TT) e Monitores de Questionários (nn/TT com Círculo de Percentagem)
 * Sincronizado em: Programa & Slides (dropdowns), Sessão ao Vivo (cartões 3, 4, 5) e Resultados & Media (Amostra Total)
 * 2ª Sessão do Grupo Focal RENOVATE | ESAS Santarém
 */

window.SubmissionsTracker = (function () {
  const STORAGE_KEYS = {
    REGISTERED_PARTICIPANTS: "renovate_registered_participants",
    CACHED_COUNTS: "renovate_cached_submissions_counts"
  };

  const SHEETS_BASE = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQKvZtpO0WW7vqeOMvJpmFbDoh8K2F0h0SSI5t3S1LiI7Ag1nQpGJi3CkDkeGxrULkk4UxSLjrhTd1e/pub";
  
  const FORMS = {
    game: { gid: "1971530026", name: "Serious Game" },
    sim: { gid: "1882859537", name: "Simulador" },
    global: { gid: "914346842", name: "Avaliação Global" }
  };

  // Estado Interno do Rastreador de Submissões
  let state = {
    counts: {
      game: 0,
      sim: 0,
      global: 0
    },
    registeredCodes: new Set(),
    totalParticipants: 0,
    isLive: false,
    pollingIntervalId: null,
    pollingSeconds: 10
  };

  /**
   * Carrega os códigos de participante previamente registados no localStorage
   */
  function loadRegisteredCodes() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REGISTERED_PARTICIPANTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          parsed.forEach(code => {
            if (code && typeof code === "string") {
              const clean = code.trim().toUpperCase();
              if (!clean.endsWith("-MD") && /^FG2-PT(0[1-9]|[1-4]\d|50)$/.test(clean)) {
                state.registeredCodes.add(clean);
              }
            }
          });
        }
      }

      // Adicionar código da sessão ativa se for participante padrão (não-moderador)
      if (window.AuthModule && typeof window.AuthModule.getParticipantCode === "function") {
        const currentCode = window.AuthModule.getParticipantCode();
        if (currentCode) {
          const clean = currentCode.trim().toUpperCase();
          if (!clean.endsWith("-MD") && /^FG2-PT(0[1-9]|[1-4]\d|50)$/.test(clean)) {
            state.registeredCodes.add(clean);
          }
        }
      }
    } catch (e) {
      console.warn("Aviso ao carregar participantes registados:", e);
    }

    recalculateTotalParticipants();
  }

  /**
   * Guarda os códigos conhecidos no localStorage
   */
  function saveRegisteredCodes() {
    try {
      const arr = Array.from(state.registeredCodes);
      localStorage.setItem(STORAGE_KEYS.REGISTERED_PARTICIPANTS, JSON.stringify(arr));
    } catch (e) {}
  }

  /**
   * Regista um código de participante selecionado na Área Reservada (ex: FG2-PT01 a FG2-PT50)
   */
  function registerParticipantCode(rawCode) {
    if (!rawCode || typeof rawCode !== "string") return;
    const cleanCode = rawCode.trim().toUpperCase();
    if (!cleanCode || cleanCode.endsWith("-MD") || !/^FG2-PT(0[1-9]|[1-4]\d|50)$/.test(cleanCode)) return;

    state.registeredCodes.add(cleanCode);
    saveRegisteredCodes();
    recalculateTotalParticipants();
    updateAllCounters();
  }

  /**
   * Recalcula o número total de participantes (TT)
   * TT é baseado nos códigos selecionados/registados e nas submissões recebidas
   */
  function recalculateTotalParticipants() {
    const { game, sim, global } = state.counts;
    const maxResponses = Math.max(game, sim, global);
    
    // Contar apenas códigos válidos registados (exclui -MD e fora de FG2-PT01..FG2-PT50)
    let validCodesCount = 0;
    state.registeredCodes.forEach(code => {
      if (code && !code.endsWith("-MD") && /^FG2-PT(0[1-9]|[1-4]\d|50)$/.test(code)) {
        validCodesCount++;
      }
    });

    state.totalParticipants = Math.max(validCodesCount, maxResponses, 0);
  }

  /**
   * Analisa o CSV e extrai os códigos de participantes e a contagem de respostas
   */
  function parseSheetData(csvText) {
    if (!csvText || typeof csvText !== "string") {
      return { count: 0, codes: [] };
    }

    const lines = csvText.trim().split(/\r\n|\n|\r/).filter(l => l.trim().length > 0);
    if (lines.length <= 1) {
      return { count: 0, codes: [] };
    }

    // Cabeçalho: descobrir a coluna "Código do Participante"
    const headerLine = lines[0];
    const headerParts = headerLine.split(",").map(p => p.replace(/^"|"$/g, "").trim().toLowerCase());
    let codeColIndex = headerParts.findIndex(p => p.includes("código") || p.includes("codigo") || p.includes("participant"));
    if (codeColIndex === -1) {
      codeColIndex = 1; // Coluna 1 por padrão
    }

    const codes = [];
    let count = 0;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Extração simples respeitando aspas
      const cols = line.split(",").map(c => c.replace(/^"|"$/g, "").trim());
      if (cols.length > codeColIndex) {
        const potentialCode = cols[codeColIndex].toUpperCase();
        // Filtro Global: excluir códigos com sufixo -MD e códigos inválidos
        if (potentialCode && !potentialCode.endsWith("-MD") && /^FG2-PT(0[1-9]|[1-4]\d|50)$/.test(potentialCode)) {
          codes.push(potentialCode);
          count++;
        }
      }
    }

    return { count, codes };
  }

  /**
   * Consulta os 3 CSVs públicos do Google Sheets em segundo plano
   */
  async function fetchSubmissions() {
    try {
      const fetchPromises = [
        fetch(`${SHEETS_BASE}?gid=${FORMS.game.gid}&single=true&output=csv&_t=${Date.now()}`, { cache: "no-store" }),
        fetch(`${SHEETS_BASE}?gid=${FORMS.sim.gid}&single=true&output=csv&_t=${Date.now()}`, { cache: "no-store" }),
        fetch(`${SHEETS_BASE}?gid=${FORMS.global.gid}&single=true&output=csv&_t=${Date.now()}`, { cache: "no-store" })
      ];

      const responses = await Promise.allSettled(fetchPromises);

      let anyLive = false;
      let newCodesFound = false;

      // Form 1: Game
      if (responses[0].status === "fulfilled" && responses[0].value.ok) {
        const text = await responses[0].value.text();
        const parsed = parseSheetData(text);
        if (parsed.count > 0) {
          state.counts.game = parsed.count;
          anyLive = true;
          parsed.codes.forEach(c => {
            if (!state.registeredCodes.has(c)) {
              state.registeredCodes.add(c);
              newCodesFound = true;
            }
          });
        }
      }

      // Form 2: Sim
      if (responses[1].status === "fulfilled" && responses[1].value.ok) {
        const text = await responses[1].value.text();
        const parsed = parseSheetData(text);
        if (parsed.count > 0) {
          state.counts.sim = parsed.count;
          anyLive = true;
          parsed.codes.forEach(c => {
            if (!state.registeredCodes.has(c)) {
              state.registeredCodes.add(c);
              newCodesFound = true;
            }
          });
        }
      }

      // Form 3: Global
      if (responses[2].status === "fulfilled" && responses[2].value.ok) {
        const text = await responses[2].value.text();
        const parsed = parseSheetData(text);
        if (parsed.count > 0) {
          state.counts.global = parsed.count;
          anyLive = true;
          parsed.codes.forEach(c => {
            if (!state.registeredCodes.has(c)) {
              state.registeredCodes.add(c);
              newCodesFound = true;
            }
          });
        }
      }

      if (anyLive) {
        state.isLive = true;
      }

      if (newCodesFound) {
        saveRegisteredCodes();
      }

      recalculateTotalParticipants();
      updateAllCounters();

      // Atualizar dropdown de login com os códigos em uso em tempo real
      if (window.AuthModule && typeof window.AuthModule.renderCodesDropdown === "function") {
        window.AuthModule.renderCodesDropdown();
      }

      // Notificar Dashboard de Resultados se disponível
      if (state.isLive && window.ResultsDashboard && typeof window.ResultsDashboard.setLiveParticipantCount === "function") {
        window.ResultsDashboard.setLiveParticipantCount(state.totalParticipants);
      }
    } catch (err) {
      console.warn("Aviso ao sincronizar submissões dos formulários:", err);
    }
  }

  /**
   * Gera o componente visual com o círculo e a percentagem no interior + ratio simples nn/TT
   * @param {number} nn - Número de questionários submetidos
   * @param {number} TT - Número total de participantes
   * @param {boolean} isGlobal - Se é o rácio global dos 3 formulários
   */
  function generateBadgeHTML(nn, TT, isGlobal = false) {
    const validNn = Math.max(0, parseInt(nn, 10) || 0);
    const validTT = Math.max(0, parseInt(TT, 10) || 0);
    const percent = validTT > 0 ? Math.min(100, Math.round((validNn / validTT) * 100)) : 0;
    const isCompleted = validTT > 0 && validNn >= validTT;

    const isEn = window.I18nManager && typeof window.I18nManager.isEnglish === "function" && window.I18nManager.isEnglish();

    const strokeColor = isCompleted ? "#059669" : (percent > 0 ? "#D97706" : "#94A3B8");
    const strokeClass = isCompleted ? "text-emerald-500" : (percent > 0 ? "text-amber-500" : "text-slate-300");
    const containerBg = isCompleted 
      ? "bg-emerald-50/90 text-emerald-950 border-emerald-300" 
      : (percent > 0 ? "bg-amber-50/80 text-slate-900 border-amber-200" : "bg-slate-50 text-slate-700 border-slate-200");

    let labelText = "";
    if (isGlobal) {
      labelText = isCompleted ? (isEn ? "complete" : "concluído") : (isEn ? "global total" : "total global");
    } else {
      labelText = isCompleted ? (isEn ? "complete" : "concluído") : (isEn ? "submitted" : "submetidos");
    }

    const titleText = isEn
      ? `${validNn} of ${validTT} submissions registered (${percent}%)`
      : `${validNn} de ${validTT} submissões registadas (${percent}%)`;

    return `
      <div class="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xl border ${containerBg} shadow-2xs transition-all duration-300 select-none shrink-0" 
           title="${titleText}">
        <!-- Círculo com a percentagem de questionários no interior -->
        <div class="relative w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center shrink-0">
          <svg class="w-6 h-6 sm:w-7 sm:h-7 -rotate-90 transform" viewBox="0 0 36 36">
            <!-- Pista circular cinzenta -->
            <path class="text-slate-200/80" stroke-width="3.5" stroke="currentColor" fill="none" 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <!-- Arco de progresso dinâmico (perímetro = 100) -->
            <path class="${strokeClass} transition-all duration-700 ease-out" 
                  stroke-dasharray="${percent}, 100" stroke-width="3.5" stroke-linecap="round" stroke="currentColor" fill="none" 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <span class="absolute text-[8px] sm:text-[9px] font-mono font-black ${isCompleted ? 'text-emerald-700' : 'text-slate-800'} leading-none">
            ${percent}%
          </span>
        </div>
        <!-- Contador simples nn/TT -->
        <div class="flex flex-col text-left leading-none pr-0.5">
          <span class="font-mono font-black text-xs ${isCompleted ? 'text-emerald-700' : 'text-slate-900'} leading-none tracking-tight">
            ${validNn}/${validTT}
          </span>
          <span class="text-[8px] text-slate-400 font-bold uppercase tracking-tight leading-none mt-0.5">
            ${labelText}
          </span>
        </div>
      </div>
    `;
  }

  /**
   * Atualiza todos os contadores da interface em tempo real:
   * 1. Menu "Programa & Slides" (dropdowns dos acordeões de avaliação: slots 4, 7 e 9)
   * 2. Menu "Sessão ao Vivo" (cartões 3, 4 e 5)
   * 3. Menu "Resultados & Media" (cartão "Amostra Total")
   */
  function updateAllCounters() {
    const TT = state.totalParticipants;
    const n1 = state.counts.game;
    const n2 = state.counts.sim;
    const n3 = state.counts.global;

    // 1. Menu "Programa & Slides": Dropdowns das 3 avaliações
    const slot4Container = document.getElementById("submission-counter-slot-4");
    if (slot4Container) {
      slot4Container.innerHTML = generateBadgeHTML(n1, TT);
    }
    const slot7Container = document.getElementById("submission-counter-slot-7");
    if (slot7Container) {
      slot7Container.innerHTML = generateBadgeHTML(n2, TT);
    }
    const slot9Container = document.getElementById("submission-counter-slot-9");
    if (slot9Container) {
      slot9Container.innerHTML = generateBadgeHTML(n3, TT);
    }

    // 2. Menu "Sessão ao Vivo": Cartões 3, 4 e 5
    const step3Container = document.getElementById("submission-counter-step-3");
    if (step3Container) {
      step3Container.innerHTML = generateBadgeHTML(n1, TT);
    }
    const step4Container = document.getElementById("submission-counter-step-4");
    if (step4Container) {
      step4Container.innerHTML = generateBadgeHTML(n2, TT);
    }
    const step5Container = document.getElementById("submission-counter-step-5");
    if (step5Container) {
      step5Container.innerHTML = generateBadgeHTML(n3, TT);
    }

    // 3. Menu "Resultados & Media": Cartão "Amostra Total"
    // Gerido por ResultsDashboard.renderKpiCards (Regra Global de Filtragem -MD e alvo N × 32 respostas)
    if (window.ResultsDashboard && typeof window.ResultsDashboard.renderKpiCards === "function") {
      window.ResultsDashboard.renderKpiCards();
    }
  }

  /**
   * Inicia o polling automático a cada 10 segundos
   */
  function startPolling() {
    stopPolling();
    fetchSubmissions();
    state.pollingIntervalId = setInterval(() => {
      fetchSubmissions();
    }, state.pollingSeconds * 1000);
  }

  function stopPolling() {
    if (state.pollingIntervalId) {
      clearInterval(state.pollingIntervalId);
      state.pollingIntervalId = null;
    }
  }

  /**
   * Inicialização do Rastreador de Submissões
   */
  function init() {
    loadRegisteredCodes();
    updateAllCounters();
    startPolling();
  }

  return {
    init,
    registerParticipantCode,
    fetchSubmissions,
    updateAllCounters,
    generateBadgeHTML,
    getCounts: () => ({ ...state.counts }),
    getTotalParticipants: () => state.totalParticipants,
    getRegisteredCodes: () => Array.from(state.registeredCodes)
  };
})();
