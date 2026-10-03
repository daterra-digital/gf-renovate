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
    submittedCodes: {
      game: new Set(),
      sim: new Set(),
      global: new Set()
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
   * Desembrulha recursivamente qualquer árvore ou invólucro exportado pelo Google Apps Script
   * ou pelo Firebase Realtime Database (Array, Objeto com propriedade única/array, Push-IDs, etc.)
   */
  function unwrapFirebasePayload(rawVal) {
    if (rawVal === null || rawVal === undefined) return [];
    let current = rawVal;

    for (let depth = 0; depth < 6; depth++) {
      if (!current || typeof current !== "object") break;

      if (Array.isArray(current)) {
        if (current.length === 1 && Array.isArray(current[0])) {
          current = current[0];
          continue;
        }
        if (current.length > 0 && Array.isArray(current[0]) && current[0].length > 0 && typeof current[0][0] === "object" && !Array.isArray(current[0][0])) {
          current = current[0];
          continue;
        }
        break;
      }

      const keys = Object.keys(current);
      if (keys.length === 0) return [];

      const arrayKey = keys.find(k => Array.isArray(current[k]));
      if (arrayKey) {
        current = current[arrayKey];
        continue;
      }

      if (keys.length === 1 && current[keys[0]] && typeof current[keys[0]] === "object") {
        current = current[keys[0]];
        continue;
      }

      const allNumeric = keys.every(k => /^\d+$/.test(k));
      if (allNumeric) {
        current = Object.values(current);
        continue;
      }

      const allObjects = keys.every(k => current[k] && typeof current[k] === "object");
      if (allObjects) {
        current = keys.map(k => {
          const v = current[k];
          if (v && typeof v === "object" && !Array.isArray(v)) {
            if (/^(FG2-PT|NS-PT)\d+/i.test(k) && !v.code && !v._participantCode) {
              return Object.assign({ _participantCode: k, code: k }, v);
            }
          }
          return v;
        });
        continue;
      }

      break;
    }

    return current;
  }

  /**
   * Extrai a lista de códigos de participante únicos do nó /Logins
   * Filtra duplicados e exclui códigos com o sufixo -MD
   */
  function extractValidLoginCodes(rawLogins) {
    if (!rawLogins) return [];
    const unwrapped = unwrapFirebasePayload(rawLogins);
    const uniqueCodes = new Set();
    const entries = Array.isArray(unwrapped) ? unwrapped : (typeof unwrapped === "object" ? Object.values(unwrapped) : [unwrapped]);

    entries.forEach(entry => {
      if (!entry) return;
      let code = null;

      if (typeof entry === "string") {
        code = entry;
      } else if (typeof entry === "object") {
        const directKeys = [
          "_participantCode", "code", "userCode", "user_code", "participantCode",
          "participant_code", "participant", "id", "ID",
          "Código de Participante", "Código do Participante", "Código", "Codigo",
          "Codigo de Participante", "Código de participante", "Código de Participante:",
          "Código:"
        ];
        for (let i = 0; i < directKeys.length; i++) {
          const dk = directKeys[i];
          if (entry[dk] !== undefined && entry[dk] !== null) {
            const c = String(entry[dk]).trim().toUpperCase();
            if (/^(FG2-PT|NS-PT)\d+$/i.test(c)) { code = c; break; }
          }
        }

        if (!code && Array.isArray(entry)) {
          for (let i = 0; i < entry.length; i++) {
            const s = String(entry[i] || "").trim().toUpperCase();
            if (/^(FG2-PT|NS-PT)\d+$/i.test(s)) { code = s; break; }
          }
        } else if (!code) {
          for (const k of Object.keys(entry)) {
            if (/c[oó]digo|participant|usercode/i.test(k)) {
              const s = String(entry[k] || "").trim().toUpperCase();
              if (/^(FG2-PT|NS-PT)\d+$/i.test(s)) { code = s; break; }
            }
          }
          if (!code) {
            for (const k of Object.keys(entry)) {
              const s = String(entry[k] || "").trim().toUpperCase();
              if (/^(FG2-PT|NS-PT)\d+$/i.test(s)) { code = s; break; }
            }
          }
        }
      }

      if (code && typeof code === "string") {
        const clean = code.trim().toUpperCase();
        if (!clean.endsWith("-MD") && clean.length >= 3 && clean !== "ADMIN" && clean !== "ADMIN-FG2" && (/^FG2-PT\d+$/i.test(clean) || /^NS-PT\d+$/i.test(clean))) {
          uniqueCodes.add(clean);
        }
      }
    });

    const result = Array.from(uniqueCodes);
    console.log("[SubmissionsTracker] /Logins payload parsed codes:", result);
    return result;
  }

  /**
  /**
   * Avalia se uma linha contém respostas reais substanciais do formulário
   */
  function hasSubstantialAnswers(row) {
    if (!row || typeof row !== "object") return false;
    let count = 0;
    const keys = Object.keys(row);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (/carimbo|timestamp|c[oó]digo|participant/i.test(k)) continue;
      const v = row[k];
      if (v !== undefined && v !== null && String(v).trim() !== "") {
        count++;
        if (count >= 2) return true;
      }
    }
    return count >= 1;
  }

  /**
   * Conta as submissões válidas num nó de respostas de formulário do Firebase
   */
  function countValidFormSubmissions(rawNode) {
    if (!rawNode) return { count: 0, codes: [] };

    const unwrapped = unwrapFirebasePayload(rawNode);
    let rows = [];
    if (Array.isArray(unwrapped)) {
      rows = unwrapped.filter(item => item !== null && item !== undefined);
    } else if (typeof unwrapped === "object") {
      rows = Object.values(unwrapped).filter(item => item !== null && item !== undefined);
    }

    if (!rows.length) return { count: 0, codes: [] };

    if (Array.isArray(rows[0]) && rows[0].length > 0 && typeof rows[0][0] === "object") {
      rows = rows.flat();
    }

    // Se a primeira linha for cabeçalho de matriz 2D
    if (Array.isArray(rows[0]) && rows[0].every(c => c === null || c === undefined || typeof c !== "object")) {
      rows = rows.slice(1);
    }

    const seenCodes = new Set();
    const codes = [];

    rows.forEach((r, idx) => {
      if (!r) return;
      let code = null;
      if (typeof r === "string") {
        code = r;
      } else if (typeof r === "object") {
        const directKeys = [
          "_participantCode", "code", "userCode", "user_code", "participantCode",
          "participant_code", "participant", "id", "ID",
          "Código de Participante", "Código do Participante", "Código", "Codigo",
          "Codigo de Participante", "Código de participante", "Código de Participante:",
          "Código:"
        ];
        for (let i = 0; i < directKeys.length; i++) {
          const dk = directKeys[i];
          if (r[dk] !== undefined && r[dk] !== null) {
            const c = String(r[dk]).trim().toUpperCase();
            if (/^(FG2-PT|NS-PT)\d+$/i.test(c)) { code = c; break; }
          }
        }

        if (!code && Array.isArray(r)) {
          for (let i = 0; i < r.length; i++) {
            const s = String(r[i] || "").trim().toUpperCase();
            if (/^(FG2-PT|NS-PT)\d+$/i.test(s)) { code = s; break; }
          }
        } else if (!code) {
          for (const k of Object.keys(r)) {
            if (/c[oó]digo|participant|usercode/i.test(k)) {
              const s = String(r[k] || "").trim().toUpperCase();
              if (/^(FG2-PT|NS-PT)\d+$/i.test(s)) { code = s; break; }
            }
          }
          if (!code) {
            for (const k of Object.keys(r)) {
              const s = String(r[k] || "").trim().toUpperCase();
              if (/^(FG2-PT|NS-PT)\d+$/i.test(s)) { code = s; break; }
            }
          }
        }
      }

      if (code) {
        const clean = String(code).trim().toUpperCase();
        if (!clean.endsWith("-MD") && clean !== "ADMIN" && clean !== "ADMIN-FG2" && (/^FG2-PT\d+$/i.test(clean) || /^NS-PT\d+$/i.test(clean))) {
          if (!seenCodes.has(clean)) {
            seenCodes.add(clean);
            codes.push(clean);
          }
        }
      } else if (hasSubstantialAnswers(r)) {
        const fallbackCode = `RESP-${String(idx + 1).padStart(2, "0")}`;
        if (!seenCodes.has(fallbackCode)) {
          seenCodes.add(fallbackCode);
          codes.push(fallbackCode);
        }
      }
    });

    const totalCount = seenCodes.size > 0 ? seenCodes.size : rows.filter(Boolean).length;
    return { count: totalCount, codes };
  }

  /**
   * Conecta à Realtime Database do Firebase via WebSockets (onValue)
   * Subscreve: Raiz / (descoberta automática de nós) e nós diretos
   * /Logins, /RespostasdoFormulário1, /RespostasdoFormulário2, /RespostasdoFormulário3
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

      // Monitor de Ligação WebSockets (.info/connected)
      db.ref(".info/connected").on("value", snap => {
        if (snap.val() === true) {
          state.firebaseConnected = true;
          state.isLive = true;
        }
      });

      // 0. Listener na Raiz "/" para mapear dinamicamente as tabelas exportadas pelo Apps Script
      db.ref("/").on("value", rootSnap => {
        try {
          const rootVal = rootSnap.val();
          if (!rootVal || typeof rootVal !== "object") return;
          console.log("[SubmissionsTracker] Root keys in RTDB:", Object.keys(rootVal));

          for (const k of Object.keys(rootVal)) {
            const val = rootVal[k];
            if (!val) continue;
            const normKey = k.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "");
            if (normKey.includes("login")) {
              const validLogins = extractValidLoginCodes(val);
              if (validLogins.length > 0) {
                state.totalParticipants = validLogins.length;
                validLogins.forEach(c => state.registeredCodes.add(c));
                saveRegisteredCodes();
              }
            } else if (normKey.includes("1") || normKey.includes("game") || normKey.includes("tallentto")) {
              const parsed = countValidFormSubmissions(val);
              state.counts.game = parsed.count;
              state.submittedCodes.game = new Set(parsed.codes);
              parsed.codes.forEach(c => state.registeredCodes.add(c));
            } else if (normKey.includes("2") || normKey.includes("sim") || normKey.includes("virmedex")) {
              const parsed = countValidFormSubmissions(val);
              state.counts.sim = parsed.count;
              state.submittedCodes.sim = new Set(parsed.codes);
              parsed.codes.forEach(c => state.registeredCodes.add(c));
            } else if (normKey.includes("3") || normKey.includes("global") || normKey.includes("nps")) {
              const parsed = countValidFormSubmissions(val);
              state.counts.global = parsed.count;
              state.submittedCodes.global = new Set(parsed.codes);
              parsed.codes.forEach(c => state.registeredCodes.add(c));
            }
          }
          state.isLive = true;
          updateAllCounters();
        } catch (rootErr) {
          console.warn("Aviso ao processar nó raiz / no SubmissionsTracker:", rootErr);
        }
      });

      const safeListen = (paths, handler) => {
        paths.forEach(p => {
          try {
            db.ref(p).on("value", handler);
          } catch (e) {}
        });
      };

      // 1. /Logins (Amostra Total TT)
      const handleLoginsSnapshot = snapshot => {
        try {
          const validLogins = extractValidLoginCodes(snapshot.val());
          if (validLogins.length > 0) {
            state.totalParticipants = validLogins.length;
            validLogins.forEach(c => state.registeredCodes.add(c));
            saveRegisteredCodes();
          } else if (state.registeredCodes.size > 0 && state.totalParticipants === 0) {
            state.totalParticipants = state.registeredCodes.size;
          }
          state.isLive = true;
          updateAllCounters();

          if (window.AuthModule && typeof window.AuthModule.renderCodesDropdown === "function") {
            window.AuthModule.renderCodesDropdown();
          }
          if (window.ResultsDashboard && typeof window.ResultsDashboard.setLiveParticipantCount === "function") {
            window.ResultsDashboard.setLiveParticipantCount(state.totalParticipants);
          }
        } catch (err) {
          console.warn("Aviso ao processar /Logins no SubmissionsTracker:", err);
        }
      };
      safeListen(["/Logins", "/logins", "/Login"], handleLoginsSnapshot);

      // 2. /RespostasdoFormulário1 (Game)
      const handleGameSnapshot = snapshot => {
        try {
          if (snapshot.val() !== null) {
            const parsed = countValidFormSubmissions(snapshot.val());
            state.counts.game = parsed.count;
            state.submittedCodes.game = new Set(parsed.codes);
            state.isLive = true;
            parsed.codes.forEach(c => state.registeredCodes.add(c));
            updateAllCounters();
          }
        } catch (err) {
          console.warn("Aviso ao processar /RespostasdoFormulário1 no SubmissionsTracker:", err);
        }
      };
      safeListen(["/RespostasdoFormulário1", "/RespostasdoFormulario1", "/Respostas do Formulário 1", "/Respostas do Formulario 1", "/Formulário1", "/Formulario1"], handleGameSnapshot);

      // 3. /RespostasdoFormulário2 (Simulador)
      const handleSimSnapshot = snapshot => {
        try {
          if (snapshot.val() !== null) {
            const parsed = countValidFormSubmissions(snapshot.val());
            state.counts.sim = parsed.count;
            state.submittedCodes.sim = new Set(parsed.codes);
            state.isLive = true;
            parsed.codes.forEach(c => state.registeredCodes.add(c));
            updateAllCounters();
          }
        } catch (err) {
          console.warn("Aviso ao processar /RespostasdoFormulário2 no SubmissionsTracker:", err);
        }
      };
      safeListen(["/RespostasdoFormulário2", "/RespostasdoFormulario2", "/Respostas do Formulário 2", "/Respostas do Formulario 2", "/Formulário2", "/Formulario2"], handleSimSnapshot);

      // 4. /RespostasdoFormulário3 (Global)
      const handleGlobalSnapshot = snapshot => {
        try {
          if (snapshot.val() !== null) {
            const parsed = countValidFormSubmissions(snapshot.val());
            state.counts.global = parsed.count;
            state.submittedCodes.global = new Set(parsed.codes);
            state.isLive = true;
            parsed.codes.forEach(c => state.registeredCodes.add(c));
            updateAllCounters();
          }
        } catch (err) {
          console.warn("Aviso ao processar /RespostasdoFormulário3 no SubmissionsTracker:", err);
        }
      };
      safeListen(["/RespostasdoFormulário3", "/RespostasdoFormulario3", "/Respostas do Formulário 3", "/Respostas do Formulario 3", "/Formulário3", "/Formulario3"], handleGlobalSnapshot);

      state.firebaseConnected = true;
    } catch (e) {
      console.error("Erro ao inicializar subscrições Firebase no SubmissionsTracker:", e);
    }
  }

  // Keep-Alive & Reconnect ao alternar separadores no browser
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      try {
        if (typeof firebase !== "undefined" && firebase.database) {
          firebase.database().goOnline();
        }
      } catch (e) {
        console.warn("Aviso ao ativar goOnline() no SubmissionsTracker:", e);
      }
    }
  });

  let isRefreshingFromFirebase = false;

  /**
   * Releitura manual explícita via once() nos 4 nós do Firebase
   */
  async function refreshFromFirebase() {
    if (isRefreshingFromFirebase) return;
    if (typeof firebase === "undefined" || !firebase.database) return;
    isRefreshingFromFirebase = true;
    try {
      const db = firebase.database();
      db.goOnline();

        const fetchCandidateNode = async (candidates) => {
          for (const path of candidates) {
            try {
              const snap = await db.ref(path).once("value");
              if (snap && snap.exists() && snap.val() !== null) {
                return snap.val();
              }
            } catch (e) {}
          }
          return null;
        };

        // 1. Tentar ler raiz "/"
        try {
          const rootSnap = await db.ref("/").once("value");
          if (rootSnap && rootSnap.val()) {
            const rootVal = rootSnap.val();
            for (const k of Object.keys(rootVal)) {
              const val = rootVal[k];
              if (!val) continue;
              const normKey = k.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "");
              if (normKey.includes("login")) {
                const validLogins = extractValidLoginCodes(val);
                if (validLogins.length > 0) {
                  state.totalParticipants = validLogins.length;
                  validLogins.forEach(c => state.registeredCodes.add(c));
                  saveRegisteredCodes();
                }
              } else if (normKey.includes("1") || normKey.includes("game") || normKey.includes("tallentto")) {
                const parsed = countValidFormSubmissions(val);
                state.counts.game = parsed.count;
                parsed.codes.forEach(c => state.registeredCodes.add(c));
              } else if (normKey.includes("2") || normKey.includes("sim") || normKey.includes("virmedex")) {
                const parsed = countValidFormSubmissions(val);
                state.counts.sim = parsed.count;
                parsed.codes.forEach(c => state.registeredCodes.add(c));
              } else if (normKey.includes("3") || normKey.includes("global") || normKey.includes("nps")) {
                const parsed = countValidFormSubmissions(val);
                state.counts.global = parsed.count;
                parsed.codes.forEach(c => state.registeredCodes.add(c));
              }
            }
          }
        } catch (rootErr) {
          console.warn("Aviso na leitura da raiz no refreshFromFirebase:", rootErr);
        }

        // 2. Leituras pontuais diretas como redundância
        const [snapLogins, snapGame, snapSim, snapGlobal] = await Promise.all([
          fetchCandidateNode(["/Logins", "/logins", "/Login"]),
          fetchCandidateNode(["/RespostasdoFormulário1", "/RespostasdoFormulario1", "/Respostas do Formulário 1", "/Respostas do Formulario 1", "/Formulário1", "/Formulario1"]),
          fetchCandidateNode(["/RespostasdoFormulário2", "/RespostasdoFormulario2", "/Respostas do Formulário 2", "/Respostas do Formulario 2", "/Formulário2", "/Formulario2"]),
          fetchCandidateNode(["/RespostasdoFormulário3", "/RespostasdoFormulario3", "/Respostas do Formulário 3", "/Respostas do Formulario 3", "/Formulário3", "/Formulario3"])
        ]);

        if (snapLogins !== null) {
          const validLogins = extractValidLoginCodes(snapLogins);
          if (validLogins.length > 0) {
            state.totalParticipants = validLogins.length;
            validLogins.forEach(c => state.registeredCodes.add(c));
            saveRegisteredCodes();
          } else if (state.registeredCodes.size > 0 && state.totalParticipants === 0) {
            state.totalParticipants = state.registeredCodes.size;
          }
        }
        if (snapGame !== null) {
          const parsed = countValidFormSubmissions(snapGame);
          state.counts.game = parsed.count;
          parsed.codes.forEach(c => state.registeredCodes.add(c));
        }
        if (snapSim !== null) {
          const parsed = countValidFormSubmissions(snapSim);
          state.counts.sim = parsed.count;
          parsed.codes.forEach(c => state.registeredCodes.add(c));
        }
        if (snapGlobal !== null) {
          const parsed = countValidFormSubmissions(snapGlobal);
          state.counts.global = parsed.count;
          parsed.codes.forEach(c => state.registeredCodes.add(c));
        }
      state.isLive = true;
      updateAllCounters();
    } catch (e) {
      console.warn("Aviso ao atualizar SubmissionsTracker via once():", e);
    } finally {
      isRefreshingFromFirebase = false;
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
   * Verifica se um participante específico tem respostas registadas no Firebase para um formulário
   * formTypeOrNum: 1 | 2 | 3 | "game" | "sim" | "global"
   */
  function hasParticipantSubmitted(formTypeOrNum, rawCode) {
    if (!rawCode) return false;
    const clean = String(rawCode).trim().toUpperCase();
    let set = null;
    if (formTypeOrNum === 1 || formTypeOrNum === "1" || formTypeOrNum === "game") {
      set = state.submittedCodes.game;
    } else if (formTypeOrNum === 2 || formTypeOrNum === "2" || formTypeOrNum === "sim") {
      set = state.submittedCodes.sim;
    } else if (formTypeOrNum === 3 || formTypeOrNum === "3" || formTypeOrNum === "global") {
      set = state.submittedCodes.global;
    }
    if (set && set.has(clean)) return true;
    return false;
  }

  /**
   * Renderiza os indicadores visuais de estado nos acordeões do Menu 'Programa & Slides' (slots 4, 7 e 9):
   * - Verde (Concluído): Exibido quando as respostas do respetivo formulário derem entrada no Firebase.
   * - Vermelho (Alerta de Pendência): Exibido se o participante tentar avançar sem ter entregue o formulário desse acordeão.
   * - Vazio: Sem contadores numéricos secundários (UI Cleanup).
   */
  function renderProgramStatusBadges() {
    const isEn = window.I18nManager && window.I18nManager.isEnglish();
    const doneText = (window.I18nManager && window.I18nManager.t("live.badge.completed")) || (isEn ? "Completed" : "Concluído");
    const pendingText = (window.I18nManager && window.I18nManager.t("live.badge.pending")) || (isEn ? "Pending" : "Pendente");

    const currentCode = (window.AuthModule && typeof window.AuthModule.getParticipantCode === "function" ? window.AuthModule.getParticipantCode() : "") || (window.LiveSession ? window.LiveSession.getParticipantCode() : "");

    const isForm1Done = hasParticipantSubmitted(1, currentCode);
    const isForm2Done = hasParticipantSubmitted(2, currentCode);
    const isForm3Done = hasParticipantSubmitted(3, currentCode);

    const isStep3Alert = window.LiveSession && typeof window.LiveSession.isStepInJumpAlert === "function" && window.LiveSession.isStepInJumpAlert(3);
    const isStep4Alert = window.LiveSession && typeof window.LiveSession.isStepInJumpAlert === "function" && window.LiveSession.isStepInJumpAlert(4);

    const greenBadge = `
      <span class="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
        <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-600"></i>
        <span>${doneText}</span>
      </span>
    `;

    const redBadge = `
      <span class="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-300 shadow-2xs animate-pulse">
        <i data-lucide="alert-circle" class="w-3.5 h-3.5 text-red-600"></i>
        <span>${pendingText}</span>
      </span>
    `;

    const slot4Container = document.getElementById("submission-counter-slot-4");
    if (slot4Container) {
      if (isForm1Done) slot4Container.innerHTML = greenBadge;
      else if (isStep3Alert) slot4Container.innerHTML = redBadge;
      else slot4Container.innerHTML = "";
    }

    const slot7Container = document.getElementById("submission-counter-slot-7");
    if (slot7Container) {
      if (isForm2Done) slot7Container.innerHTML = greenBadge;
      else if (isStep4Alert) slot7Container.innerHTML = redBadge;
      else slot7Container.innerHTML = "";
    }

    const slot9Container = document.getElementById("submission-counter-slot-9");
    if (slot9Container) {
      if (isForm3Done) slot9Container.innerHTML = greenBadge;
      else slot9Container.innerHTML = "";
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  let isUpdatingCounters = false;

  /**
   * Atualiza todos os contadores da interface em tempo real:
   * 1. Menu "Programa & Slides": Indicadores visuais de estado (Verde / Vermelho / Vazio)
   * 2. Menu "Sessão ao Vivo": Limpeza de contadores secundários nos cartões 3, 4 e 5
   * 3. Menu "Resultados & Media" (cartão "Amostra Total")
   * 4. Menu "Painel de Moderação" (monitores de submissão 1, 2 e 3)
   */
  function updateAllCounters() {
    if (isUpdatingCounters) return;
    isUpdatingCounters = true;
    try {
      // 1. Menu "Programa & Slides": Indicadores visuais de estado nos acordeões (slots 4, 7 e 9)
      renderProgramStatusBadges();

      // 2. Menu "Sessão ao Vivo": Limpeza de contadores secundários (cartões 3, 4 e 5)
      const step3Container = document.getElementById("submission-counter-step-3");
      if (step3Container) step3Container.innerHTML = "";
      const step4Container = document.getElementById("submission-counter-step-4");
      if (step4Container) step4Container.innerHTML = "";
      const step5Container = document.getElementById("submission-counter-step-5");
      if (step5Container) step5Container.innerHTML = "";

      // 3. Menu "Resultados & Media": Cartão "Amostra Total"
      if (window.ResultsDashboard && typeof window.ResultsDashboard.renderKpiCards === "function") {
        window.ResultsDashboard.renderKpiCards();
      }

      // 4. Menu "Painel de Moderação": Sincronização em tempo real das contagens
      if (window.ModeratorPanel && typeof window.ModeratorPanel.fetchSubmissionsCount === "function") {
        try {
          window.ModeratorPanel.fetchSubmissionsCount();
        } catch (modErr) {
          console.warn("Aviso ao sincronizar contagens com ModeratorPanel:", modErr);
        }
      }

      // 5. Notificar a Sessão ao Vivo para reavaliar as condições dos passos em tempo real
      if (window.LiveSession && typeof window.LiveSession.evaluateStepConditions === "function") {
        window.LiveSession.evaluateStepConditions();
      }
    } finally {
      isUpdatingCounters = false;
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
    hasParticipantSubmitted,
    getSubmittedCodes: (type) => Array.from((state.submittedCodes && state.submittedCodes[type]) || []),
    renderProgramStatusBadges,
    getCounts: () => ({ ...state.counts }),
    getTotalParticipants: () => state.totalParticipants,
    setTotalParticipants: (tt, codes) => {
      let changed = false;
      if (typeof tt === "number" && state.totalParticipants !== tt) {
        state.totalParticipants = tt;
        changed = true;
      }
      if (Array.isArray(codes)) {
        codes.forEach(c => {
          if (c && typeof c === "string") {
            const clean = c.trim().toUpperCase();
            if (!clean.endsWith("-MD") && clean !== "ADMIN" && !state.registeredCodes.has(clean)) {
              state.registeredCodes.add(clean);
              changed = true;
            }
          }
        });
      }
      if (changed) {
        updateAllCounters();
      }
    },
    getRegisteredCodes: () => Array.from(state.registeredCodes),
    refreshFromFirebase
  };
})();
