/**
 * RENOVATE FG2 - Painel de Moderação e Gestão de Sala
 * Módulo Central de Controlo, Fases, Monitores de Submissão, Delay Tracker & Projeção QR Code
 * 2ª Sessão do Grupo Focal RENOVATE | ESAS Santarém
 */

window.ModeratorPanel = (function () {
  // Constantes de Autenticação e Armazenamento
  const MODERATOR_PASSWORDS = ["renovate26", "2026"];
  const SESSION_AUTH_KEY = "renovate_mod_authenticated";
  const STORAGE_KEYS = {
    TOTAL_TARGET: "total_target",
    DELAY_STAGE_ID: "renovate_delay_stage_id",
    DELAY_REAL_START: "renovate_delay_real_start",
    STOPWATCH_ELAPSED: "renovate_stopwatch_elapsed",
    STOPWATCH_RUNNING: "renovate_stopwatch_running"
  };

  // Endpoints Oficiais Google Sheets (Separadores Públicos em CSV)
  const SHEETS_BASE = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQKvZtpO0WW7vqeOMvJpmFbDoh8K2F0h0SSI5t3S1LiI7Ag1nQpGJi3CkDkeGxrULkk4UxSLjrhTd1e/pub";
  const FORMS_CONFIG = [
    {
      id: "game",
      gid: "1971530026",
      name: "Form 1: Serious Game (Tallentto)",
      nameEn: "Form 1: Serious Game (Tallentto)",
      icon: "smartphone",
      color: "purple",
      desc: "Avaliação da ferramenta pedagógica gamificada",
      descEn: "Evaluation of the gamified pedagogical tool"
    },
    {
      id: "sim",
      gid: "1882859537",
      name: "Form 2: Simulador PC (Virmedex)",
      nameEn: "Form 2: PC Simulator (Virmedex)",
      icon: "monitor",
      color: "sky",
      desc: "Avaliação do simulador virtual 3D de pulverização",
      descEn: "Evaluation of the 3D virtual spray simulator"
    },
    {
      id: "global",
      gid: "914346842",
      name: "Form 3: Avaliação Global & NPS",
      nameEn: "Form 3: Global Evaluation & NPS",
      icon: "award",
      color: "emerald",
      desc: "Questionário de síntese, satisfação e encerramento",
      descEn: "Synthesis, satisfaction and closing questionnaire"
    }
  ];

  // Estado Interno do Painel de Moderação
  let state = {
    activeTab: "access", // 'access' | 'participants' | 'timing'
    totalTarget: 22,
    submissions: {
      game: { count: 0, loading: false, error: null, lastUpdated: null },
      sim: { count: 0, loading: false, error: null, lastUpdated: null },
      global: { count: 0, loading: false, error: null, lastUpdated: null }
    },
    pollingIntervalId: null,
    pollingSeconds: 10,
    pollingCountdown: 10,
    countdownIntervalId: null,
    // Gestão de Tempo / Cronómetro
    stopwatch: {
      seconds: 0,
      intervalId: null,
      isRunning: false
    },
    // Delay Tracker
    delayTracker: {
      selectedStageId: "slot-4", // Pré-seleção: Prática Serious Game
      scheduledStart: "10:30",
      scheduledEnd: "11:10",
      durationMinutes: 40,
      realStartTime: ""
    }
  };

  /**
   * Verifica se o utilizador está autenticado como moderador na sessão ativa do browser
   */
  function isModeratorAuthenticated() {
    try {
      return sessionStorage.getItem(SESSION_AUTH_KEY) === "true";
    } catch (e) {
      return false;
    }
  }

  /**
   * Define o estado de autenticação de moderador
   */
  function setModeratorAuthenticated(authenticated) {
    try {
      if (authenticated) {
        sessionStorage.setItem(SESSION_AUTH_KEY, "true");
      } else {
        sessionStorage.removeItem(SESSION_AUTH_KEY);
      }
    } catch (e) {
      console.error("Erro ao gerir sessão de moderador:", e);
    }
  }

  /**
   * Valida a palavra-passe introduzida (renovate26 ou fallback 2026)
   */
  function verifyPassword(inputPassword) {
    if (!inputPassword) return false;
    const clean = inputPassword.trim().toLowerCase();
    return MODERATOR_PASSWORDS.includes(clean);
  }

  /**
   * Abre a Modal de Moderação (exibe popup de senha se não autenticado, ou painel completo se autenticado)
   */
  function openModal() {
    if (typeof window.switchTab === "function") {
      window.switchTab("moderation");
      return;
    }
    const modal = document.getElementById("moderator-modal");
    if (!modal) return;

    modal.classList.remove("hidden");

    if (isModeratorAuthenticated()) {
      showPanelCard();
    } else {
      showAuthCard();
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  /**
   * Fecha a Modal de Moderação
   */
  function closeModal() {
    const modal = document.getElementById("moderator-modal");
    if (modal) {
      modal.classList.add("hidden");
    }
  }

  /**
   * Mostra o Card de Autenticação (Senha do Moderador)
   */
  function showAuthCard() {
    const authCard = document.getElementById("moderator-auth-card");
    const panelCard = document.getElementById("moderator-panel-card");
    const passInput = document.getElementById("mod-password-input");
    const errBox = document.getElementById("mod-password-error");

    if (panelCard) panelCard.classList.add("hidden");
    if (authCard) {
      authCard.classList.remove("hidden");
      if (passInput) {
        passInput.value = "";
        setTimeout(() => passInput.focus(), 100);
      }
      if (errBox) {
        errBox.classList.add("hidden");
        errBox.textContent = "";
      }
    }
  }

  /**
   * Mostra o Card Central de Moderação Expandido (Com abas de controlo)
   */
  function showPanelCard() {
    const authCard = document.getElementById("moderator-auth-card");
    const panelCard = document.getElementById("moderator-panel-card");

    if (authCard) authCard.classList.add("hidden");
    if (panelCard) {
      panelCard.classList.remove("hidden");
      switchTab(state.activeTab === "timing" ? "timing" : "access");
      renderAllModeratorControls();
    }
  }

  /**
   * Bloqueia o painel (Lock) exigindo novamente a palavra-passe
   */
  function lockPanel() {
    setModeratorAuthenticated(false);
    stopSubmissionsPolling();
    showAuthCard();
    if (window.showToast) {
      const isEn = window.I18nManager && window.I18nManager.isEnglish();
      window.showToast(isEn ? "Moderator Panel locked." : "Painel do Moderador bloqueado.");
    }
  }

  /**
   * Alterna entre as abas do Painel de Moderação
   */
  function switchTab(tabId) {
    state.activeTab = tabId || "access";

    const tabButtons = document.querySelectorAll(".mod-tab-btn");
    tabButtons.forEach(btn => {
      const t = btn.getAttribute("data-mod-tab");
      if (t === state.activeTab) {
        btn.className = "mod-tab-btn flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs shadow-sm transition";
      } else {
        btn.className = "mod-tab-btn flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition";
      }
    });

    const panes = {
      access: document.getElementById("mod-tab-content-access"),
      timing: document.getElementById("mod-tab-content-timing")
    };

    Object.entries(panes).forEach(([k, pane]) => {
      if (!pane) return;
      if (k === state.activeTab) {
        pane.classList.remove("hidden");
        pane.classList.add("animate-fadeIn");
      } else {
        pane.classList.add("hidden");
        pane.classList.remove("animate-fadeIn");
      }
    });

    if (state.activeTab === "timing") {
      updateDelayCalculation();
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  /* ==========================================================================
     MÓDULO 2: CONTROLO DO ESTADO DO SISTEMA E FASES (KILL-SWITCH & PHASE OVERRIDE)
     ========================================================================== */

  /**
   * Renderiza todos os controlos da Tab 1 (Acessos, Kill-Switch, Fases e Passos)
   */
  function renderAccessControls() {
    if (!window.AuthModule) return;
    const AuthModule = window.AuthModule;

    // 1. Kill-Switch: Estado da Plataforma (system_status) — Exclusivo Localhost
    const killswitchCard = document.getElementById("mod-killswitch-card");
    const isLocal = window.AuthModule && typeof window.AuthModule.isLocalhost === "function"
      ? window.AuthModule.isLocalhost()
      : (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "[::1]" || window.location.protocol === "file:");

    if (killswitchCard) {
      if (!isLocal) {
        // Em produção / GitHub Pages, a opção de comutador de estado é estritamente ocultada
        killswitchCard.style.display = "none";
        killswitchCard.classList.add("hidden");
      } else {
        killswitchCard.style.display = "";
        killswitchCard.classList.remove("hidden");
      }
    }

    const isClosed = AuthModule.getSystemStatus() === "closed";
    const statusToggleBtn = document.getElementById("mod-status-toggle-btn");
    const statusBadge = document.getElementById("mod-status-badge");
    const statusDesc = document.getElementById("mod-status-desc");
    const isEn = window.I18nManager && window.I18nManager.isEnglish();

    if (statusToggleBtn && statusBadge && statusDesc) {
      if (isClosed) {
        statusToggleBtn.innerHTML = `
          <div class="w-12 h-6 rounded-full bg-rose-600 p-0.5 transition flex items-center justify-end">
            <div class="w-5 h-5 rounded-full bg-white shadow-md"></div>
          </div>
          <span class="text-xs font-black text-rose-800">${isEn ? "Maintenance / Closed" : "Fechada para Manutenção"}</span>
        `;
        statusBadge.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300";
        statusBadge.innerHTML = `<i data-lucide="alert-triangle" class="w-3.5 h-3.5"></i> ${isEn ? "Platform Closed (Lockdown)" : "Plataforma Fechada (Bloqueio Total)"}`;
        statusDesc.textContent = isEn
          ? "New participant logins are completely blocked. Maintenance banner is shown on the login screen."
          : "Novos logins de participantes estão 100% bloqueados. O aviso de manutenção está ativo na tela de entrada.";
      } else {
        statusToggleBtn.innerHTML = `
          <div class="w-12 h-6 rounded-full bg-emerald-500 p-0.5 transition flex items-center justify-start">
            <div class="w-5 h-5 rounded-full bg-white shadow-md"></div>
          </div>
          <span class="text-xs font-black text-emerald-800">${isEn ? "Open for Testing" : "Plataforma Aberta"}</span>
        `;
        statusBadge.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300";
        statusBadge.innerHTML = `<i data-lucide="check-circle" class="w-3.5 h-3.5"></i> ${isEn ? "Platform Open for Testing" : "Plataforma Aberta para Testes"}`;
        statusDesc.textContent = isEn
          ? "The platform is fully accessible to participants with valid code and access key."
          : "A plataforma está totalmente operacional para acesso aos testes com crachá e chave ativa.";
      }
    }

    // 2. Comutador de Fase de Acesso (Override Manual)
    let currentSavedPhase = "auto";
    try {
      currentSavedPhase = localStorage.getItem(AuthModule.STORAGE_KEYS.ACCESS_PHASE) || "auto";
    } catch (e) {}

    const phaseRadios = document.querySelectorAll('input[name="mod_phase_option"]');
    phaseRadios.forEach(radio => {
      radio.checked = radio.value === currentSavedPhase;
      const card = radio.closest(".mod-phase-card");
      if (card) {
        if (radio.checked) {
          card.classList.add("border-slate-900", "bg-amber-50/80", "ring-2", "ring-[#FFCC66]");
          card.classList.remove("border-slate-200", "bg-white");
        } else {
          card.classList.remove("border-slate-900", "bg-amber-50/80", "ring-2", "ring-[#FFCC66]");
          card.classList.add("border-slate-200", "bg-white");
        }
      }
    });

    // 3. Chave de Acesso Personalizada
    const keyInput = document.getElementById("mod-custom-key-input");
    if (keyInput) {
      keyInput.value = localStorage.getItem(AuthModule.STORAGE_KEYS.CUSTOM_KEY) || "";
    }

    // 4. Sessão Ativa & Terminar Sessão
    const sessionLabel = document.getElementById("mod-active-session-code");
    if (sessionLabel) {
      const code = AuthModule.getParticipantCode();
      if (code) {
        const type = AuthModule.getParticipantType(code);
        sessionLabel.textContent = `${code} (${type})`;
        sessionLabel.className = "font-mono font-extrabold text-slate-900 text-xs bg-white px-2 py-0.5 rounded border border-slate-200";
      } else {
        sessionLabel.textContent = isEn ? "None" : "Nenhuma";
        sessionLabel.className = "font-mono font-medium text-slate-400 text-xs italic";
      }
    }

    // 5. Renderizar Toggles dos Passos 1 a 5 da Sessão ao Vivo
    renderStepToggles();

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  /**
   * Renderiza os toggles individuais dos passos da Sessão ao Vivo
   */
  function renderStepToggles() {
    const container = document.getElementById("mod-step-toggles-container");
    if (!container || !window.LiveSession) return;

    const stateLS = window.LiveSession.getState();
    const isEn = window.I18nManager && window.I18nManager.isEnglish();

    const stepNames = {
      1: isEn ? "Step 1: Welcome & Participant Code" : "Passo 1: Abertura & Identificação de Participante",
      2: isEn ? "Step 2: Presentation & Slides" : "Passo 2: Apresentação Oficial (Slides)",
      3: isEn ? "Step 3: Serious Game & Form 1" : "Passo 3: Serious Game & Form 1 (Tallentto)",
      4: isEn ? "Step 4: Virtual Simulator & Form 2" : "Passo 4: Simulador PC & Form 2 (Virmedex)",
      5: isEn ? "Step 5: Global Evaluation & NPS" : "Passo 5: Avaliação Global & Encerramento"
    };

    container.innerHTML = [1, 2, 3, 4, 5].map(step => {
      const isUnlocked = stateLS && stateLS.unlockedSteps && stateLS.unlockedSteps.includes(step);
      return `
        <div class="flex items-center justify-between p-3 rounded-xl border ${isUnlocked ? 'border-emerald-300 bg-emerald-50/40' : 'border-slate-200 bg-slate-50'} transition">
          <div class="flex items-center gap-2.5">
            <span class="w-6 h-6 rounded-full ${isUnlocked ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-200'} text-xs font-black flex items-center justify-center shrink-0">
              ${step}
            </span>
            <span class="text-xs font-bold text-slate-800">${stepNames[step]}</span>
          </div>
          <button type="button" 
                  data-step="${step}" 
                  class="btn-mod-toggle-step px-3 py-1.5 rounded-lg text-xs font-extrabold transition flex items-center gap-1.5 shadow-2xs
                         ${isUnlocked ? 'bg-rose-100 text-rose-800 hover:bg-rose-200 border border-rose-300' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'}">
            <i data-lucide="${isUnlocked ? 'lock' : 'unlock'}" class="w-3.5 h-3.5"></i>
            ${isUnlocked ? (isEn ? 'Lock' : 'Bloquear') : (isEn ? 'Unlock' : 'Desbloquear')}
          </button>
        </div>
      `;
    }).join("");

    container.querySelectorAll(".btn-mod-toggle-step").forEach(btn => {
      btn.addEventListener("click", () => {
        const step = parseInt(btn.getAttribute("data-step"), 10);
        if (stateLS && stateLS.unlockedSteps && stateLS.unlockedSteps.includes(step)) {
          window.LiveSession.lockStep(step);
        } else {
          window.LiveSession.unlockStep(step);
        }
        renderStepToggles();
      });
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  /* ==========================================================================
     MÓDULO 3: GESTÃO DE PARTICIPANTES E CONTADORES EM TEMPO REAL (GOOGLE SHEETS)
     ========================================================================== */

  /**
   * Carrega o valor do Total de Participantes guardado em localStorage
   */
  function loadTotalTarget() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TOTAL_TARGET);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed > 0) {
          state.totalTarget = parsed;
        }
      }
    } catch (e) {}

    const targetInput = document.getElementById("mod-total-target-input");
    if (targetInput) {
      targetInput.value = state.totalTarget;
    }
  }

  /**
   * Guarda o Total de Participantes em localStorage
   */
  function setTotalTarget(val) {
    const num = Math.max(1, parseInt(val, 10) || 1);
    state.totalTarget = num;
    try {
      localStorage.setItem(STORAGE_KEYS.TOTAL_TARGET, String(num));
    } catch (e) {}

    const targetInput = document.getElementById("mod-total-target-input");
    if (targetInput && targetInput.value !== String(num)) {
      targetInput.value = num;
    }

    renderSubmissionsUI();
  }

  /**
   * Faz o fetch em segundo plano aos 3 CSVs públicos dos Google Sheets
   */
  async function fetchSubmissionsCount() {
    const refreshBtn = document.getElementById("btn-mod-refresh-submissions");
    if (refreshBtn) {
      refreshBtn.classList.add("animate-spin");
    }

    const promises = FORMS_CONFIG.map(async (form) => {
      const url = `${SHEETS_BASE}?gid=${form.gid}&single=true&output=csv&_t=${Date.now()}`;
      state.submissions[form.id].loading = true;

      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const text = await res.text();
        const rowCount = countValidCsvResponses(text);

        state.submissions[form.id] = {
          count: rowCount,
          loading: false,
          error: null,
          lastUpdated: new Date()
        };
      } catch (err) {
        console.warn(`Aviso ao consultar submissões de ${form.id}:`, err);
        state.submissions[form.id].loading = false;
        state.submissions[form.id].error = err.message;
      }
    });

    await Promise.allSettled(promises);

    if (refreshBtn) {
      refreshBtn.classList.remove("animate-spin");
    }

    state.pollingCountdown = state.pollingSeconds;
    renderSubmissionsUI();
  }

  /**
   * Conta as respostas válidas no CSV excluindo linha de cabeçalho e linhas em branco
   */
  function countValidCsvResponses(csvText) {
    if (!csvText || typeof csvText !== "string") return 0;
    const lines = csvText.trim().split(/\r\n|\n|\r/).filter(l => l.trim().length > 0);
    // Subtrair 1 pelo cabeçalho
    return Math.max(0, lines.length - 1);
  }

  /**
   * Renderiza os 3 cartões de monitorização de submissões
   */
  function renderSubmissionsUI() {
    const container = document.getElementById("mod-submissions-monitor-grid");
    if (!container) return;

    const target = state.totalTarget;
    const isEn = window.I18nManager && window.I18nManager.isEnglish();

    container.innerHTML = FORMS_CONFIG.map(form => {
      const data = state.submissions[form.id] || { count: 0, lastUpdated: null };
      const count = data.count;
      const isCompleted = target > 0 && count >= target;
      const percent = target > 0 ? Math.min(100, Math.round((count / target) * 100)) : 0;

      // Estilo dinâmico: Muda para VERDE se count >= target
      const cardBorder = isCompleted
        ? "border-emerald-400 bg-emerald-50/70 shadow-emerald-100"
        : "border-slate-200 bg-white";

      const badgeHtml = isCompleted
        ? `
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 animate-pulse">
            <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-700"></i>
            ${isEn ? 'Room Completed!' : 'Concluído pela Sala!'}
          </span>
        `
        : `
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
            <span class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            ${isEn ? 'In Progress...' : 'Em preenchimento...'}
          </span>
        `;

      const barBg = isCompleted ? "bg-emerald-500" : "bg-[#FFCC66]";

      return `
        <div class="rounded-2xl border-2 ${cardBorder} p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-sm transition-all duration-300">
          <!-- Cabeçalho do Cartão -->
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-xl ${isCompleted ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-800'} flex items-center justify-center shrink-0 shadow-2xs">
                <i data-lucide="${form.icon}" class="w-5 h-5"></i>
              </div>
              <div>
                <h4 class="font-black text-slate-900 text-sm leading-snug">${(isEn && form.nameEn) ? form.nameEn : form.name}</h4>
                <p class="text-[11px] text-slate-500 leading-tight">${(isEn && form.descEn) ? form.descEn : form.desc}</p>
              </div>
            </div>
            ${badgeHtml}
          </div>

          <!-- Contador Central Destacado -->
          <div class="flex items-baseline justify-between pt-1">
            <div class="flex items-baseline gap-1.5">
              <span class="font-mono font-black text-3xl sm:text-4xl ${isCompleted ? 'text-emerald-700' : 'text-slate-900'}">${count}</span>
              <span class="text-xs sm:text-sm font-extrabold text-slate-500">/ ${target} ${isEn ? 'submitted' : 'submetidas'}</span>
            </div>
            <span class="text-sm font-mono font-black ${isCompleted ? 'text-emerald-700' : 'text-slate-700'}">${percent}%</span>
          </div>

          <!-- Barra de Progresso com Indicador -->
          <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
            <div class="${barBg} h-full rounded-full transition-all duration-500" style="width: ${percent}%;"></div>
          </div>

          <!-- Rodapé do Cartão com Timestamp -->
          <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span class="flex items-center gap-1">
              <i data-lucide="sheet" class="w-3.5 h-3.5 text-slate-400"></i>
              Google Sheets (gid: ${form.gid})
            </span>
            <span>
              ${data.lastUpdated ? `${isEn ? 'Updated' : 'Atualizado'}: ${data.lastUpdated.toLocaleTimeString()}` : (isEn ? 'Awaiting fetch' : 'Aguardando')}
            </span>
          </div>
        </div>
      `;
    }).join("");

    // Atualizar badge de resumo geral no topo da aba
    const allCounts = FORMS_CONFIG.map(f => state.submissions[f.id].count);
    const sumCount = allCounts.reduce((a, b) => a + b, 0);
    const maxTarget = target * 3;
    const globalPercent = maxTarget > 0 ? Math.min(100, Math.round((sumCount / maxTarget) * 100)) : 0;

    const summaryBadge = document.getElementById("mod-submissions-global-summary");
    if (summaryBadge) {
      summaryBadge.textContent = `${sumCount} / ${maxTarget} (${globalPercent}%)`;
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  /**
   * Inicia o polling automático a cada 10 segundos
   */
  function startSubmissionsPolling() {
    stopSubmissionsPolling();
    fetchSubmissionsCount();

    // Loop de polling a cada 10s
    state.pollingIntervalId = setInterval(() => {
      fetchSubmissionsCount();
    }, state.pollingSeconds * 1000);

    // Countdown a cada 1s para feedback visual
    state.pollingCountdown = state.pollingSeconds;
    state.countdownIntervalId = setInterval(() => {
      state.pollingCountdown = Math.max(0, state.pollingCountdown - 1);
      const countdownEl = document.getElementById("mod-polling-countdown");
      if (countdownEl) {
        countdownEl.textContent = `${state.pollingCountdown}s`;
      }
    }, 1000);
  }

  /**
   * Pára o polling automático
   */
  function stopSubmissionsPolling() {
    if (state.pollingIntervalId) {
      clearInterval(state.pollingIntervalId);
      state.pollingIntervalId = null;
    }
    if (state.countdownIntervalId) {
      clearInterval(state.countdownIntervalId);
      state.countdownIntervalId = null;
    }
  }

  /* ==========================================================================
     MÓDULO 4: GESTÃO DE TEMPO E DESVIOS DE AGENDA (DELAY TRACKER)
     ========================================================================== */

  /**
   * Povoa o select com as 11 etapas do programa oficial a partir de RENOVATE_CONFIG.schedule
   */
  function populateStageSelect() {
    const select = document.getElementById("mod-delay-stage-select");
    if (!select || !window.RENOVATE_CONFIG || !RENOVATE_CONFIG.schedule) return;

    const isEn = window.I18nManager && window.I18nManager.isEnglish();
    const schedule = RENOVATE_CONFIG.schedule;

    let savedStageId = state.delayTracker.selectedStageId;
    try {
      const s = localStorage.getItem(STORAGE_KEYS.DELAY_STAGE_ID);
      if (s) savedStageId = s;
    } catch (e) {}

    select.innerHTML = schedule.map(slot => {
      const title = (isEn && slot.titleEn) ? slot.titleEn : slot.title;
      const isSelected = slot.id === savedStageId;
      return `<option value="${slot.id}" ${isSelected ? 'selected' : ''}>${slot.time} • ${title}</option>`;
    }).join("");

    onStageSelected(select.value);
  }

  /**
   * Trata a seleção de uma etapa no dropdown
   */
  function onStageSelected(stageId) {
    if (!window.RENOVATE_CONFIG || !RENOVATE_CONFIG.schedule) return;
    const slot = RENOVATE_CONFIG.schedule.find(s => s.id === stageId) || RENOVATE_CONFIG.schedule[0];
    if (!slot) return;

    state.delayTracker.selectedStageId = slot.id;
    try {
      localStorage.setItem(STORAGE_KEYS.DELAY_STAGE_ID, slot.id);
    } catch (e) {}

    // Extrair horário agendado de início e fim a partir de "10:20 - 11:00"
    const timeParts = slot.time.split("-").map(p => p.trim());
    const schedStart = timeParts[0] || "10:00";
    const schedEnd = timeParts[1] || "10:10";

    state.delayTracker.scheduledStart = schedStart;
    state.delayTracker.scheduledEnd = schedEnd;

    // Calcular duração agendada em minutos
    const startMin = timeToMinutes(schedStart);
    const endMin = timeToMinutes(schedEnd);
    state.delayTracker.durationMinutes = Math.max(5, endMin - startMin);

    // Carregar hora real guardada ou manter atual
    let savedReal = "";
    try {
      savedReal = localStorage.getItem(`${STORAGE_KEYS.DELAY_REAL_START}_${slot.id}`) || "";
    } catch (e) {}

    const realInput = document.getElementById("mod-real-start-input");
    if (realInput) {
      realInput.value = savedReal || schedStart;
      state.delayTracker.realStartTime = realInput.value;
    }

    updateDelayCalculation();
  }

  /**
   * Converte string HH:MM em minutos a partir da meia-noite
   */
  function timeToMinutes(timeStr) {
    if (!timeStr || !timeStr.includes(":")) return 0;
    const [h, m] = timeStr.split(":").map(n => parseInt(n, 10) || 0);
    return h * 60 + m;
  }

  /**
   * Converte minutos a partir da meia-noite para formato HH:MM
   */
  function minutesToTime(minutes) {
    const normalized = (minutes % 1440 + 1440) % 1440;
    const h = String(Math.floor(normalized / 60)).padStart(2, "0");
    const m = String(normalized % 60).padStart(2, "0");
    return `${h}:${m}`;
  }

  /**
   * Calcula o desvio entre a Hora Agendada e a Hora Real de Início
   */
  function updateDelayCalculation() {
    const realInput = document.getElementById("mod-real-start-input");
    if (realInput) {
      state.delayTracker.realStartTime = realInput.value;
    }

    const schedStart = state.delayTracker.scheduledStart;
    const realStart = state.delayTracker.realStartTime || schedStart;
    const duration = state.delayTracker.durationMinutes;

    const schedStartMin = timeToMinutes(schedStart);
    const realStartMin = timeToMinutes(realStart);
    const driftMinutes = realStartMin - schedStartMin;

    // Calcular Nova Estimativa de Conclusão: Hora Real de Início + Duração Prevista
    const newEstimatedEndMin = realStartMin + duration;
    const newEstimatedEnd = minutesToTime(newEstimatedEndMin);

    // Atualizar Elementos na UI
    const schedStartDisplay = document.getElementById("mod-sched-start-display");
    const schedEndDisplay = document.getElementById("mod-sched-end-display");
    const durationDisplay = document.getElementById("mod-sched-duration-display");
    const estimatedEndDisplay = document.getElementById("mod-estimated-end-display");
    const driftBadge = document.getElementById("mod-drift-badge");
    const driftAdvice = document.getElementById("mod-drift-advice");
    const isEn = window.I18nManager && window.I18nManager.isEnglish();

    if (schedStartDisplay) schedStartDisplay.textContent = schedStart;
    if (schedEndDisplay) schedEndDisplay.textContent = state.delayTracker.scheduledEnd;
    if (durationDisplay) durationDisplay.textContent = `${duration} min`;
    if (estimatedEndDisplay) estimatedEndDisplay.textContent = newEstimatedEnd;

    // Selo de Desvio (Verde: 0-2min, Laranja: 3-10min, Vermelho: >10min)
    if (driftBadge && driftAdvice) {
      if (driftMinutes <= 2) {
        // VERDE: Dentro do previsto
        const label = driftMinutes <= 0 
          ? (isEn ? "On Schedule (0 min)" : "Dentro do previsto (No horário)")
          : (isEn ? `On Schedule (+${driftMinutes} min)` : `Dentro do previsto (+${driftMinutes} min)`);
        driftBadge.className = "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs";
        driftBadge.innerHTML = `<i data-lucide="check-circle" class="w-4 h-4 text-emerald-700"></i> <span>${label}</span>`;
        driftAdvice.className = "p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium space-y-1";
        driftAdvice.innerHTML = `
          <div class="font-black flex items-center gap-1.5 text-emerald-800">
            <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
            ${isEn ? "Excellent Pace" : "Excelente Ritmo de Gestão"}
          </div>
          <p>${isEn ? "The session is running strictly as planned. Proceed normally without adjustments." : "A sessão decorre estritamente dentro da tolerância normal. Manter o guião previsto."}</p>
        `;
      } else if (driftMinutes <= 10) {
        // LARANJA: 3 a 10 min de atraso
        driftBadge.className = "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs";
        driftBadge.innerHTML = `<i data-lucide="clock" class="w-4 h-4 text-amber-700"></i> <span>${isEn ? `Moderate Delay (+${driftMinutes} min)` : `Atraso Moderado (+${driftMinutes} min)`}</span>`;
        driftAdvice.className = "p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium space-y-1";
        driftAdvice.innerHTML = `
          <div class="font-black flex items-center gap-1.5 text-amber-800">
            <i data-lucide="alert-circle" class="w-3.5 h-3.5"></i>
            ${isEn ? "Suggested Time Compensation" : "Compensação de Tempo Recomendada"}
          </div>
          <p>${isEn ? `A slight drift of +${driftMinutes} min detected. Recommend shortening the coffee break or rounding the discussion to keep the 13:00 lunch.` : `Desvio moderado de +${driftMinutes} min. Sugerir compensação encurtando o intervalo de café ou acelerando a introdução teórica para salvaguardar o almoço das 13:00.`}</p>
        `;
      } else {
        // VERMELHO: > 10 min de atraso
        driftBadge.className = "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-rose-100 text-rose-900 border border-rose-300 shadow-2xs animate-pulse";
        driftBadge.innerHTML = `<i data-lucide="alert-triangle" class="w-4 h-4 text-rose-700"></i> <span>${isEn ? `Critical Delay (+${driftMinutes} min)` : `Aviso de Gestão de Tempo (+${driftMinutes} min)`}</span>`;
        driftAdvice.className = "p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-medium space-y-1";
        driftAdvice.innerHTML = `
          <div class="font-black flex items-center gap-1.5 text-rose-800">
            <i data-lucide="alert-octagon" class="w-3.5 h-3.5"></i>
            ${isEn ? "Critical Time Management Alert" : "Aviso Crítico de Gestão de Tempo"}
          </div>
          <p>${isEn ? `Significant delay (+${driftMinutes} min). Active intervention recommended: shorten non-critical steps or merge feedback discussions.` : `Atraso substancial acumulado (+${driftMinutes} min). Recomenda-se avançar objetivamente para os formulários de teste e encurtar as intervenções livres da sala.`}</p>
        `;
      }
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  /**
   * Lógica do Cronómetro Progressivo (Stopwatch 00:00:00)
   */
  function startStopwatch() {
    if (state.stopwatch.isRunning) return;

    // Se a hora real de início ainda não estiver definida, captura automaticamente a hora atual
    const now = new Date();
    const currentH = String(now.getHours()).padStart(2, "0");
    const currentM = String(now.getMinutes()).padStart(2, "0");
    const realInput = document.getElementById("mod-real-start-input");

    if (realInput && (!realInput.value || realInput.value === state.delayTracker.scheduledStart)) {
      realInput.value = `${currentH}:${currentM}`;
      state.delayTracker.realStartTime = realInput.value;
      try {
        localStorage.setItem(`${STORAGE_KEYS.DELAY_REAL_START}_${state.delayTracker.selectedStageId}`, realInput.value);
      } catch (e) {}
      updateDelayCalculation();
    }

    state.stopwatch.isRunning = true;
    state.stopwatch.intervalId = setInterval(() => {
      state.stopwatch.seconds++;
      renderStopwatchDisplay();
    }, 1000);

    updateStopwatchButtons();
  }

  function pauseStopwatch() {
    if (!state.stopwatch.isRunning) return;
    state.stopwatch.isRunning = false;
    if (state.stopwatch.intervalId) {
      clearInterval(state.stopwatch.intervalId);
      state.stopwatch.intervalId = null;
    }
    updateStopwatchButtons();
  }

  function resetStopwatch() {
    pauseStopwatch();
    state.stopwatch.seconds = 0;
    renderStopwatchDisplay();
    updateStopwatchButtons();
  }

  function renderStopwatchDisplay() {
    const display = document.getElementById("mod-stopwatch-display");
    if (!display) return;

    const s = state.stopwatch.seconds;
    const hours = String(Math.floor(s / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const seconds = String(s % 60).padStart(2, "0");

    display.textContent = `${hours}:${minutes}:${seconds}`;
  }

  function updateStopwatchButtons() {
    const startBtn = document.getElementById("btn-mod-timer-start");
    const pauseBtn = document.getElementById("btn-mod-timer-pause");
    if (startBtn && pauseBtn) {
      if (state.stopwatch.isRunning) {
        startBtn.classList.add("hidden");
        pauseBtn.classList.remove("hidden");
      } else {
        startBtn.classList.remove("hidden");
        pauseBtn.classList.add("hidden");
      }
    }
  }

  /* ==========================================================================
     MÓDULO 5: BOTÃO DE PROJEÇÃO RÁPIDA DE QR CODE (MODAL EM ECRÃ INTEIRO)
     ========================================================================== */

  const QR_PROJECTION_URL = "https://daterra-digital.github.io/gf-renovate/#live";

  function openQrProjection() {
    const qrModal = document.getElementById("mod-qrcode-modal");
    if (!qrModal) return;

    qrModal.classList.remove("hidden");

    // Garantir renderização da imagem
    const qrImg = document.getElementById("mod-projector-qr-img");
    if (qrImg) {
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=450x450&data=${encodeURIComponent(QR_PROJECTION_URL)}&color=0F172A&bgcolor=FFFFFF&qzone=2`;
      qrImg.src = qrApiUrl;
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function closeQrProjection() {
    const qrModal = document.getElementById("mod-qrcode-modal");
    if (qrModal) {
      qrModal.classList.add("hidden");
    }
    // Sair de ecrã inteiro se estiver ativo
    if (document.fullscreenElement) {
      try {
        document.exitFullscreen();
      } catch (e) {}
    }
  }

  function toggleFullscreenProjection() {
    const qrModal = document.getElementById("mod-qrcode-modal");
    if (!qrModal) return;

    if (!document.fullscreenElement) {
      if (qrModal.requestFullscreen) {
        qrModal.requestFullscreen();
      } else if (qrModal.webkitRequestFullscreen) {
        qrModal.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  /* ==========================================================================
     INICIALIZAÇÃO E BINDING DE EVENTOS
     ========================================================================== */

  function renderAllModeratorControls() {
    renderAccessControls();
    loadTotalTarget();
    populateStageSelect();
    renderStopwatchDisplay();
    updateStopwatchButtons();
  }

  function initEvents() {
    // 1. Abrir Modal via botões com classe .btn-open-moderator-modal
    document.querySelectorAll(".btn-open-moderator-modal").forEach(btn => {
      btn.addEventListener("click", () => openModal());
    });

    // 2. Fechar Modal
    const closeBtn = document.getElementById("btn-close-moderator-modal");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => closeModal());
    }

    const modal = document.getElementById("moderator-modal");
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
      });
    }

    // 3. Autenticação por Palavra-Passe
    const verifyBtn = document.getElementById("btn-verify-mod-password");
    const passInput = document.getElementById("mod-password-input");
    const passError = document.getElementById("mod-password-error");
    const togglePassBtn = document.getElementById("btn-toggle-mod-pass-visibility");

    const handleAuth = () => {
      const pass = passInput ? passInput.value : "";
      if (verifyPassword(pass)) {
        setModeratorAuthenticated(true);
        showPanelCard();
        const isEn = window.I18nManager && window.I18nManager.isEnglish();
        if (window.showToast) {
          window.showToast(isEn ? "Moderator access authenticated!" : "Sessão de Moderador autenticada!");
        }
      } else {
        if (passError) {
          const isEn = window.I18nManager && window.I18nManager.isEnglish();
          passError.textContent = isEn ? "Incorrect moderator password. Please try again." : "Palavra-passe de moderador incorreta. Tente novamente.";
          passError.classList.remove("hidden");
        }
      }
    };

    if (verifyBtn) verifyBtn.addEventListener("click", handleAuth);
    if (passInput) {
      passInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleAuth();
      });
    }

    if (togglePassBtn && passInput) {
      togglePassBtn.addEventListener("click", () => {
        const isPass = passInput.type === "password";
        passInput.type = isPass ? "text" : "password";
        const icon = togglePassBtn.querySelector("i");
        if (icon) {
          icon.setAttribute("data-lucide", isPass ? "eye-off" : "eye");
          if (window.lucide) window.lucide.createIcons();
        }
      });
    }

    // 4. Botão Bloquear Painel
    const lockBtn = document.getElementById("btn-mod-lock-panel");
    if (lockBtn) {
      lockBtn.addEventListener("click", () => lockPanel());
    }

    // 5. Tabs do Painel de Moderação
    document.querySelectorAll(".mod-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const tab = btn.getAttribute("data-mod-tab");
        switchTab(tab);
      });
    });

    // 6. Kill-Switch: Alternância do Estado da Plataforma (Exclusivo Localhost)
    const statusToggleBtn = document.getElementById("mod-status-toggle-btn");
    if (statusToggleBtn) {
      statusToggleBtn.addEventListener("click", () => {
        if (!window.AuthModule) return;
        const AuthModule = window.AuthModule;
        if (typeof AuthModule.isLocalhost === "function" && !AuthModule.isLocalhost()) {
          console.warn("Comutador de Estado do Sistema desativado em produção.");
          return;
        }
        const current = AuthModule.getSystemStatus();
        const next = current === "closed" ? "open" : "closed";
        AuthModule.setSystemStatus(next);
        renderAccessControls();
        const isEn = window.I18nManager && window.I18nManager.isEnglish();
        if (window.showToast) {
          window.showToast(next === "closed" 
            ? (isEn ? "Platform closed (Maintenance mode active)!" : "Plataforma fechada para manutenção!")
            : (isEn ? "Platform opened for testing!" : "Plataforma reaberta para testes!"));
        }
      });
    }

    // 7. Comutador de Fase de Acesso
    document.querySelectorAll('input[name="mod_phase_option"]').forEach(radio => {
      radio.addEventListener("change", (e) => {
        if (!window.AuthModule) return;
        const AuthModule = window.AuthModule;
        const phaseMode = e.target.value;
        AuthModule.setAccessPhase(phaseMode);
        renderAccessControls();
        const isEn = window.I18nManager && window.I18nManager.isEnglish();
        if (window.showToast) {
          window.showToast(isEn ? "Access phase override applied!" : "Modo de fase atualizado com sucesso!");
        }
      });
    });

    // 8. Chave de Acesso Personalizada
    const saveKeyBtn = document.getElementById("btn-mod-save-key");
    const customKeyInput = document.getElementById("mod-custom-key-input");
    if (saveKeyBtn && customKeyInput) {
      saveKeyBtn.addEventListener("click", () => {
        if (!window.AuthModule) return;
        const AuthModule = window.AuthModule;
        const val = customKeyInput.value.trim();
        if (val) {
          localStorage.setItem(AuthModule.STORAGE_KEYS.CUSTOM_KEY, val);
          if (window.showToast) window.showToast(`Chave personalizada guardada: ${val}`);
        } else {
          localStorage.removeItem(AuthModule.STORAGE_KEYS.CUSTOM_KEY);
          if (window.showToast) window.showToast("Chave personalizada removida (padrão ativa).");
        }
      });
    }

    // 9. Forçar Terminar Sessão no Navegador
    const forceLogoutBtn = document.getElementById("btn-mod-force-logout");
    if (forceLogoutBtn) {
      forceLogoutBtn.addEventListener("click", () => {
        if (window.AuthModule && window.AuthModule.isAuthenticated()) {
          window.AuthModule.logout(true);
          renderAccessControls();
          if (window.showToast) window.showToast("Sessão terminada pelo moderador.");
        } else {
          if (window.showToast) window.showToast("Não existe nenhuma sessão ativa no momento.");
        }
      });
    }

    // 10. Desbloquear Passos em Bloco
    const unlockAllBtn = document.getElementById("btn-mod-unlock-all");
    const resetStepsBtn = document.getElementById("btn-mod-reset-steps");
    if (unlockAllBtn && window.LiveSession) {
      unlockAllBtn.addEventListener("click", () => {
        LiveSession.unlockAllSteps();
        renderStepToggles();
        if (window.showToast) window.showToast("Todos os 5 passos foram desbloqueados!");
      });
    }
    if (resetStepsBtn && window.LiveSession) {
      resetStepsBtn.addEventListener("click", () => {
        LiveSession.lockStep(2);
        LiveSession.lockStep(3);
        LiveSession.lockStep(4);
        LiveSession.lockStep(5);
        renderStepToggles();
        if (window.showToast) window.showToast("Passos repostos ao padrão inicial.");
      });
    }

    document.querySelectorAll(".btn-mod-unlock-upto").forEach(btn => {
      btn.addEventListener("click", () => {
        const targetStep = parseInt(btn.getAttribute("data-target-step"), 10);
        if (window.LiveSession) {
          LiveSession.unlockUpToStep(targetStep);
          renderStepToggles();
          if (window.showToast) window.showToast(`Passos desbloqueados até ao Passo ${targetStep}!`);
        }
      });
    });

    // 11. Gestão de Participantes: Input Total Target e Presets
    const targetInput = document.getElementById("mod-total-target-input");
    if (targetInput) {
      targetInput.addEventListener("change", (e) => {
        setTotalTarget(e.target.value);
      });
      targetInput.addEventListener("input", (e) => {
        setTotalTarget(e.target.value);
      });
    }

    document.querySelectorAll(".btn-mod-target-preset").forEach(btn => {
      btn.addEventListener("click", () => {
        const val = btn.getAttribute("data-target");
        setTotalTarget(val);
      });
    });

    // Botão de Refresh Manual de Submissões
    const refreshSubmissionsBtn = document.getElementById("btn-mod-refresh-submissions");
    if (refreshSubmissionsBtn) {
      refreshSubmissionsBtn.addEventListener("click", () => {
        fetchSubmissionsCount();
      });
    }

    // 12. Gestão de Tempo: Dropdown de Etapas
    const stageSelect = document.getElementById("mod-delay-stage-select");
    if (stageSelect) {
      stageSelect.addEventListener("change", (e) => {
        onStageSelected(e.target.value);
      });
    }

    const realStartInput = document.getElementById("mod-real-start-input");
    if (realStartInput) {
      realStartInput.addEventListener("input", () => {
        state.delayTracker.realStartTime = realStartInput.value;
        try {
          localStorage.setItem(`${STORAGE_KEYS.DELAY_REAL_START}_${state.delayTracker.selectedStageId}`, realStartInput.value);
        } catch (e) {}
        updateDelayCalculation();
      });
    }

    const setNowBtn = document.getElementById("btn-mod-set-real-now");
    if (setNowBtn && realStartInput) {
      setNowBtn.addEventListener("click", () => {
        const now = new Date();
        const currentH = String(now.getHours()).padStart(2, "0");
        const currentM = String(now.getMinutes()).padStart(2, "0");
        realStartInput.value = `${currentH}:${currentM}`;
        state.delayTracker.realStartTime = realStartInput.value;
        try {
          localStorage.setItem(`${STORAGE_KEYS.DELAY_REAL_START}_${state.delayTracker.selectedStageId}`, realStartInput.value);
        } catch (e) {}
        updateDelayCalculation();
      });
    }

    // Cronómetro: Iniciar, Pausar e Reset
    const timerStartBtn = document.getElementById("btn-mod-timer-start");
    const timerPauseBtn = document.getElementById("btn-mod-timer-pause");
    const timerResetBtn = document.getElementById("btn-mod-timer-reset");

    if (timerStartBtn) timerStartBtn.addEventListener("click", startStopwatch);
    if (timerPauseBtn) timerPauseBtn.addEventListener("click", pauseStopwatch);
    if (timerResetBtn) timerResetBtn.addEventListener("click", resetStopwatch);

    // 13. Projeção de QR Code
    document.querySelectorAll(".btn-open-mod-qrcode").forEach(btn => {
      btn.addEventListener("click", openQrProjection);
    });

    const closeQrBtn = document.getElementById("btn-close-mod-qrcode");
    if (closeQrBtn) closeQrBtn.addEventListener("click", closeQrProjection);

    const qrModal = document.getElementById("mod-qrcode-modal");
    if (qrModal) {
      qrModal.addEventListener("click", (e) => {
        if (e.target === qrModal) closeQrProjection();
      });
    }

    const toggleFsBtn = document.getElementById("btn-toggle-mod-fs");
    if (toggleFsBtn) toggleFsBtn.addEventListener("click", toggleFullscreenProjection);

    const copyQrLinkBtn = document.getElementById("btn-copy-mod-qrlink");
    if (copyQrLinkBtn) {
      copyQrLinkBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(QR_PROJECTION_URL).then(() => {
          if (window.showToast) window.showToast("Link copiado para a área de transferência!");
        });
      });
    }

    // Tecla Esc fecha modais
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (qrModal && !qrModal.classList.contains("hidden")) {
          closeQrProjection();
        } else if (modal && !modal.classList.contains("hidden")) {
          closeModal();
        }
      }
    });
  }

  /**
   * Inicialização do Módulo de Moderação
   */
  function init() {
    initEvents();
    renderAllModeratorControls();
  }

  return {
    init,
    openModal,
    closeModal,
    lockPanel,
    switchTab,
    renderAllModeratorControls,
    openQrProjection,
    closeQrProjection,
    fetchSubmissionsCount,
    setTotalTarget,
    isModeratorAuthenticated
  };
})();
