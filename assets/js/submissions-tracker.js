/**
 * RENOVATE FG2 - Gestor de Submissões e Contadores em Tempo Real
 * Arquitetura Serverless Push via Firebase Realtime Database (WebSockets onValue)
 * Controlo Automático de Participantes (TT) e Monitores de Questionários (nn/TT com Círculo de Percentagem)
 * Sincronizado em: Programa & Slides (dropdowns), Sessão ao Vivo (cartões 3, 4, 5) e Resultados & Media (Amostra Total)
 * 2ª Sessão do Grupo Focal RENOVATE | ESAS Santarém
 */

window.SubmissionsTracker = (function () {
  const STORAGE_KEYS = {
    REGISTERED_PARTICIPANTS: "renovate_registered_participants",
    CACHED_COUNTS: "renovate_cached_submissions_counts"
  };

  const DEFAULT_FIREBASE_URL = "https://renovate-fg2-default-rtdb.europe-west1.firebasedatabase.app";

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
    firebaseConnected: false
  };

  /**
   * Obtém a URL da base de dados Firebase
   */
  function getFirebaseUrl() {
    return (window.RENOVATE_CONFIG && window.RENOVATE_CONFIG.resultsDashboard && window.RENOVATE_CONFIG.resultsDashboard.firebaseUrl) ||
           localStorage.getItem("renovate_firebase_url") ||
           window.RENOVATE_FIREBASE_URL ||
           DEFAULT_FIREBASE_URL;
  }

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
              if (!clean.endsWith("-MD") && (/^FG2-PT(0[1-9]|[1-4]\d|50)$/.test(clean) || /^NS-PT/.test(clean))) {
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
          if (!clean.endsWith("-MD") && (/^FG2-PT(0[1-9]|[1-4]\d|50)$/.test(clean) || /^NS-PT/.test(clean))) {
            state.registeredCodes.add(clean);
          }
        }
      }
    } catch (e) {
      console.warn("Aviso ao carregar participantes registados:", e);
    }

    if (state.totalParticipants === 0 && state.registeredCodes.size > 0) {
      state.totalParticipants = state.registeredCodes.size;
    }
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
    if (!cleanCode || cleanCode.endsWith("-MD")) return;

    state.registeredCodes.add(cleanCode);
    saveRegisteredCodes();
    if (state.totalParticipants < state.registeredCodes.size) {
      state.totalParticipants = state.registeredCodes.size;
    }
    updateAllCounters();
  }

  /**
   * Extrai a lista de códigos de participante únicos do nó /Logins
   * Filtra duplicados e exclui códigos com o sufixo -MD
   */
  function extractValidLoginCodes(rawLogins) {
    if (!rawLogins) return [];
    const uniqueCodes = new Set();
    const entries = Array.isArray(rawLogins) ? rawLogins : (typeof rawLogins === "object" ? Object.values(rawLogins) : [rawLogins]);

    entries.forEach(entry => {
      if (!entry) return;
      let code = null;

      if (typeof entry === "string") {
        code = entry;
      } else if (typeof entry === "object") {
        if (entry.code) {
          code = entry.code;
        } else if (entry.userCode) {
          code = entry.userCode;
        } else if (Array.isArray(entry)) {
          for (const cell of entry) {
            const s = String(cell || "").trim().toUpperCase();
            if (/^(FG2-PT|NS-PT)\d+$/i.test(s)) {
              code = s;
              break;
            }
          }
        } else {
          for (const k of Object.keys(entry)) {
            const v = String(entry[k] || "").trim().toUpperCase();
            if (/^(FG2-PT|NS-PT)\d+$/i.test(v)) {
              code = v;
              break;
            }
          }
        }
      }

      if (code && typeof code === "string") {
        const clean = code.trim().toUpperCase();
        if (!clean.endsWith("-MD") && clean.length >= 3 && clean !== "ADMIN" && clean !== "ADMIN-FG2") {
          uniqueCodes.add(clean);
        }
      }
    });

    return Array.from(uniqueCodes);
  }

  /**
   * Conta as submissões válidas num nó de respostas de formulário do Firebase
   */
  function countValidFormSubmissions(rawNode) {
    if (!rawNode) return { count: 0, codes: [] };
    const list = Array.isArray(rawNode) ? rawNode : (typeof rawNode === "object" ? Object.values(rawNode) : []);
    if (!list.length) return { count: 0, codes: [] };

    let rows = list;
    // Se a primeira linha for cabeçalho
    if (Array.isArray(rows[0]) && rows[0].some(c => /c[oó]digo|carimbo/i.test(String(c)))) {
      rows = rows.slice(1);
    }

    const seenCodes = new Set();
    const codes = [];

    rows.forEach(r => {
      if (!r) return;
      let code = null;
      if (typeof r === "object") {
        if (r["Código de Participante"] || r["Código do Participante"] || r.code) {
          code = r["Código de Participante"] || r["Código do Participante"] || r.code;
        } else if (Array.isArray(r)) {
          for (let i = 0; i < r.length; i++) {
            const s = String(r[i] || "").trim().toUpperCase();
            if (/^(FG2-PT|NS-PT)\d+$/i.test(s)) { code = s; break; }
          }
        } else {
          for (const k of Object.keys(r)) {
            if (/c[oó]digo/i.test(k)) { code = String(r[k] || ""); break; }
          }
        }
      }

      if (code) {
        const clean = String(code).trim().toUpperCase();
        if (!clean.endsWith("-MD") && (clean.startsWith("FG2-PT") || clean.startsWith("NS-PT"))) {
          if (!seenCodes.has(clean)) {
            seenCodes.add(clean);
            codes.push(clean);
          }
        }
      }
    });

    const totalCount = seenCodes.size > 0 ? seenCodes.size : rows.length;
    return { count: totalCount, codes };
  }

  /**
   * Conecta à Realtime Database do Firebase via WebSockets (onValue)
   * Subscreve: /Logins, /RespostasdoFormulário1, /RespostasdoFormulário2, /RespostasdoFormulário3
   */
  function connectFirebase() {
    if (typeof firebase === "undefined" || !firebase.database) {
      console.warn("⚠️ Firebase SDK ainda não disponível para o SubmissionsTracker.");
      return;
    }

    try {
      const url = getFirebaseUrl();
      if (!firebase.apps.length) {
        firebase.initializeApp({ databaseURL: url });
      }
      const db = firebase.database();

      // 1. /Logins (Amostra Total TT)
      db.ref("/Logins").on("value", snapshot => {
        const validLogins = extractValidLoginCodes(snapshot.val());
        state.totalParticipants = validLogins.length;
        validLogins.forEach(c => state.registeredCodes.add(c));
        saveRegisteredCodes();
        state.isLive = true;
        updateAllCounters();

        if (window.AuthModule && typeof window.AuthModule.renderCodesDropdown === "function") {
          window.AuthModule.renderCodesDropdown();
        }
        if (window.ResultsDashboard && typeof window.ResultsDashboard.setLiveParticipantCount === "function") {
          window.ResultsDashboard.setLiveParticipantCount(state.totalParticipants);
        }
      }, err => {
        console.warn("Aviso Firebase /Logins no SubmissionsTracker:", err);
      });

      // 2. /RespostasdoFormulário1 (Game)
      db.ref("/RespostasdoFormulário1").on("value", snapshot => {
        const parsed = countValidFormSubmissions(snapshot.val());
        state.counts.game = parsed.count;
        state.isLive = true;
        parsed.codes.forEach(c => state.registeredCodes.add(c));
        updateAllCounters();
      }, err => {
        console.warn("Aviso Firebase /RespostasdoFormulário1 no SubmissionsTracker:", err);
      });

      // 3. /RespostasdoFormulário2 (Simulador)
      db.ref("/RespostasdoFormulário2").on("value", snapshot => {
        const parsed = countValidFormSubmissions(snapshot.val());
        state.counts.sim = parsed.count;
        state.isLive = true;
        parsed.codes.forEach(c => state.registeredCodes.add(c));
        updateAllCounters();
      }, err => {
        console.warn("Aviso Firebase /RespostasdoFormulário2 no SubmissionsTracker:", err);
      });

      // 4. /RespostasdoFormulário3 (Global)
      db.ref("/RespostasdoFormulário3").on("value", snapshot => {
        const parsed = countValidFormSubmissions(snapshot.val());
        state.counts.global = parsed.count;
        state.isLive = true;
        parsed.codes.forEach(c => state.registeredCodes.add(c));
        updateAllCounters();
      }, err => {
        console.warn("Aviso Firebase /RespostasdoFormulário3 no SubmissionsTracker:", err);
      });

      state.firebaseConnected = true;
    } catch (e) {
      console.error("Erro ao inicializar subscrições Firebase no SubmissionsTracker:", e);
    }
  }

  /**
   * Gera o componente visual com o círculo e a percentagem no interior + ratio simples nn/TT
   * @param {number} nn - Número de questionários submetidos
   * @param {number} TT - Número total de participantes (Amostra Total do /Logins)
   * @param {boolean} isGlobal - Se é o rácio global dos 3 formulários
   */
  function generateBadgeHTML(nn, TT, isGlobal = false) {
    const validNn = Math.max(0, parseInt(nn, 10) || 0);
    const validTT = Math.max(0, parseInt(TT, 10) || 0);
    const percent = validTT > 0 ? Math.min(100, Math.round((validNn / validTT) * 100)) : 0;
    const isCompleted = validTT > 0 && validNn >= validTT;

    const isEn = window.I18nManager && typeof window.I18nManager.isEnglish === "function" && window.I18nManager.isEnglish();

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
    if (window.ResultsDashboard && typeof window.ResultsDashboard.renderKpiCards === "function") {
      window.ResultsDashboard.renderKpiCards();
    }
  }

  /**
   * Inicialização do Rastreador de Submissões
   */
  function init() {
    loadRegisteredCodes();
    updateAllCounters();
    connectFirebase();
  }

  return {
    init,
    registerParticipantCode,
    fetchSubmissions: () => { updateAllCounters(); },
    updateAllCounters,
    generateBadgeHTML,
    getCounts: () => ({ ...state.counts }),
    getTotalParticipants: () => state.totalParticipants,
    setTotalParticipants: (tt, codes) => {
      if (typeof tt === "number") state.totalParticipants = tt;
      if (Array.isArray(codes)) codes.forEach(c => state.registeredCodes.add(c));
      updateAllCounters();
    },
    getRegisteredCodes: () => Array.from(state.registeredCodes)
  };
})();
