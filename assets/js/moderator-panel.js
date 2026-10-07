/**
 * RENOVATE FG2 - Painel de Moderação e Gestão de Sala
 * Módulo Central de Controlo, Fases, Monitores de Submissão, Delay Tracker & Projeção QR Code
 * 2ª Sessão do Grupo Focal RENOVATE | ESAS Santarém
 */

window.ModeratorPanel = (function () {
  // Constantes de Autenticação e Armazenamento
  const MODERATOR_PASSWORDS = ["renovate26", "2026", "focusgroup2renovate"];
  const SESSION_AUTH_KEY = "renovate_mod_authenticated";
  const STORAGE_KEYS = {
    TOTAL_TARGET: "total_target"
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
    activeTab: "access",
    totalTarget: 22,
    submissions: {
      game: { count: 0, loading: false, error: null, lastUpdated: null },
      sim: { count: 0, loading: false, error: null, lastUpdated: null },
      global: { count: 0, loading: false, error: null, lastUpdated: null }
    },
    pollingIntervalId: null,
    pollingSeconds: 10,
    pollingCountdown: 10,
    countdownIntervalId: null
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

    const pane = document.getElementById("mod-tab-content-access");
    if (pane) {
      pane.classList.remove("hidden");
      pane.classList.add("animate-fadeIn");
    }

    renderSubmissionsGrid();
    updateSubmissionsGrid();

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

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  /* ==========================================================================
     MÓDULO 2.5: QUADRO DE MONITORIZAÇÃO VISUAL DE SUBMISSÕES (TEMPO REAL)
     ========================================================================== */

  /**
   * Renderiza a estrutura da grelha de participantes para Grupo Focal (50) e Remoto (50)
   */
  function renderSubmissionsGrid() {
    const fgContainer = document.getElementById("grid-submissions-fg");
    const nsContainer = document.getElementById("grid-submissions-ns");

    if (fgContainer && fgContainer.children.length === 0) {
      const fgCards = [];
      for (let i = 1; i <= 50; i++) {
        const num = String(i).padStart(2, "0");
        const code = `FG2-PT${num}`;
        fgCards.push(`
          <div class="mod-participant-card bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-2xs hover:border-slate-300 transition" data-code="${code}">
            <span class="font-mono text-xs font-bold text-slate-800 tracking-tight">${code}</span>
            <div class="flex items-center gap-1 shrink-0">
              <span class="mod-ind-1 w-5 h-5 text-[10px] flex items-center justify-center rounded font-bold bg-red-500 text-white shadow-2xs transition-colors" title="Form 1: Serious Game">1</span>
              <span class="mod-ind-2 w-5 h-5 text-[10px] flex items-center justify-center rounded font-bold bg-red-500 text-white shadow-2xs transition-colors" title="Form 2: Simulador">2</span>
              <span class="mod-ind-3 w-5 h-5 text-[10px] flex items-center justify-center rounded font-bold bg-red-500 text-white shadow-2xs transition-colors" title="Form 3: Avaliação Global">3</span>
            </div>
          </div>
        `);
      }
      fgContainer.innerHTML = fgCards.join("");
    }

    if (nsContainer && nsContainer.children.length === 0) {
      const nsCards = [];
      for (let i = 1; i <= 50; i++) {
        const num = String(i).padStart(2, "0");
        const code = `NS-PT${num}`;
        nsCards.push(`
          <div class="mod-participant-card bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-2xs hover:border-slate-300 transition" data-code="${code}">
            <span class="font-mono text-xs font-bold text-slate-800 tracking-tight">${code}</span>
            <div class="flex items-center gap-1 shrink-0">
              <span class="mod-ind-1 w-5 h-5 text-[10px] flex items-center justify-center rounded font-bold bg-red-500 text-white shadow-2xs transition-colors" title="Form 1: Serious Game">1</span>
              <span class="mod-ind-2 w-5 h-5 text-[10px] flex items-center justify-center rounded font-bold bg-red-500 text-white shadow-2xs transition-colors" title="Form 2: Simulador">2</span>
              <span class="mod-ind-3 w-5 h-5 text-[10px] flex items-center justify-center rounded font-bold bg-red-500 text-white shadow-2xs transition-colors" title="Form 3: Avaliação Global">3</span>
            </div>
          </div>
        `);
      }
      nsContainer.innerHTML = nsCards.join("");
    }
  }

  /**
   * Atualiza as luzes verdes/vermelhas de submissão para todos os participantes em tempo real
   */
  function updateSubmissionsGrid() {
    const fgContainer = document.getElementById("grid-submissions-fg");
    const nsContainer = document.getElementById("grid-submissions-ns");
    if (!fgContainer || !nsContainer) return;

    if (fgContainer.children.length === 0 || nsContainer.children.length === 0) {
      renderSubmissionsGrid();
    }

    const isEn = window.I18nManager && typeof window.I18nManager.isEnglish === "function" && window.I18nManager.isEnglish();
    const tracker = window.SubmissionsTracker;

    function applyIndicatorState(el, isDone) {
      if (!el) return;
      if (isDone) {
        el.classList.remove("bg-red-500");
        el.classList.add("bg-emerald-500");
      } else {
        el.classList.remove("bg-emerald-500");
        el.classList.add("bg-red-500");
      }
    }

    // Processar Grupo Focal (FG)
    let fgCompleted = 0;
    const fgCards = fgContainer.querySelectorAll(".mod-participant-card");
    fgCards.forEach(card => {
      const code = card.getAttribute("data-code");
      if (!code) return;

      const f1 = tracker && typeof tracker.hasParticipantSubmitted === "function" ? tracker.hasParticipantSubmitted(1, code) : false;
      const f2 = tracker && typeof tracker.hasParticipantSubmitted === "function" ? tracker.hasParticipantSubmitted(2, code) : false;
      const f3 = tracker && typeof tracker.hasParticipantSubmitted === "function" ? tracker.hasParticipantSubmitted(3, code) : false;

      applyIndicatorState(card.querySelector(".mod-ind-1"), f1);
      applyIndicatorState(card.querySelector(".mod-ind-2"), f2);
      applyIndicatorState(card.querySelector(".mod-ind-3"), f3);

      if (f1 && f2 && f3) {
        fgCompleted++;
        card.classList.add("bg-emerald-50/50", "border-emerald-300");
        card.classList.remove("bg-slate-50", "border-slate-200");
      } else {
        card.classList.remove("bg-emerald-50/50", "border-emerald-300");
        card.classList.add("bg-slate-50", "border-slate-200");
      }
    });

    // Processar Remoto (NS)
    let nsCompleted = 0;
    const nsCards = nsContainer.querySelectorAll(".mod-participant-card");
    nsCards.forEach(card => {
      const code = card.getAttribute("data-code");
      if (!code) return;

      const f1 = tracker && typeof tracker.hasParticipantSubmitted === "function" ? tracker.hasParticipantSubmitted(1, code) : false;
      const f2 = tracker && typeof tracker.hasParticipantSubmitted === "function" ? tracker.hasParticipantSubmitted(2, code) : false;
      const f3 = tracker && typeof tracker.hasParticipantSubmitted === "function" ? tracker.hasParticipantSubmitted(3, code) : false;

      applyIndicatorState(card.querySelector(".mod-ind-1"), f1);
      applyIndicatorState(card.querySelector(".mod-ind-2"), f2);
      applyIndicatorState(card.querySelector(".mod-ind-3"), f3);

      if (f1 && f2 && f3) {
        nsCompleted++;
        card.classList.add("bg-emerald-50/50", "border-emerald-300");
        card.classList.remove("bg-slate-50", "border-slate-200");
      } else {
        card.classList.remove("bg-emerald-50/50", "border-emerald-300");
        card.classList.add("bg-slate-50", "border-slate-200");
      }
    });

    // Atualizar badges de progresso nos summaries dos acordeões
    const fgBadge = document.getElementById("mod-fg-progress-badge");
    if (fgBadge) {
      fgBadge.textContent = `${fgCompleted}/50 ${isEn ? "completed" : "completos"}`;
      if (fgCompleted > 0) {
        fgBadge.className = "text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-2xs";
      } else {
        fgBadge.className = "text-[11px] font-bold text-slate-600";
      }
    }

    const nsBadge = document.getElementById("mod-ns-progress-badge");
    if (nsBadge) {
      nsBadge.textContent = `${nsCompleted}/50 ${isEn ? "completed" : "completos"}`;
      if (nsCompleted > 0) {
        nsBadge.className = "text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-2xs";
      } else {
        nsBadge.className = "text-[11px] font-bold text-slate-600";
      }
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
   * Sincroniza em tempo real as contagens de submissão a partir do SubmissionsTracker (In-Memory State)
   */
  function fetchSubmissionsCount() {
    const refreshBtn = document.getElementById("btn-mod-refresh-submissions");
    if (refreshBtn) {
      refreshBtn.classList.add("animate-spin");
    }

    try {
      const counts = (window.SubmissionsTracker && typeof window.SubmissionsTracker.getCounts === "function")
        ? window.SubmissionsTracker.getCounts()
        : { game: 0, sim: 0, global: 0 };

      const totalTarget = (window.SubmissionsTracker && typeof window.SubmissionsTracker.getTotalParticipants === "function")
        ? window.SubmissionsTracker.getTotalParticipants()
        : state.totalTarget;

      if (totalTarget > 0) {
        state.totalTarget = totalTarget;
      }

      const now = new Date();
      FORMS_CONFIG.forEach((form) => {
        state.submissions[form.id] = {
          count: counts[form.id] || 0,
          loading: false,
          error: null,
          lastUpdated: now
        };
      });

      state.pollingCountdown = state.pollingSeconds;
      renderSubmissionsUI();
    } catch (err) {
      console.warn("Aviso em fetchSubmissionsCount:", err);
    } finally {
      if (refreshBtn) {
        setTimeout(() => refreshBtn.classList.remove("animate-spin"), 200);
      }
    }
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
    renderSubmissionsGrid();
    updateSubmissionsGrid();
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

    // 6. Kill-Switch: Alternância do Estado da Plataforma (Exclusivo Localhost com Git Push Automático)
    const statusToggleBtn = document.getElementById("mod-status-toggle-btn");
    if (statusToggleBtn) {
      statusToggleBtn.addEventListener("click", async () => {
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
            ? (isEn ? "Platform closed locally! Syncing with GitHub Pages..." : "Plataforma fechada localmente! A sincronizar com o GitHub Pages...")
            : (isEn ? "Platform opened locally! Syncing with GitHub Pages..." : "Plataforma reaberta localmente! A sincronizar com o GitHub Pages..."));
        }

        // Chamar API local do Node.js para gravar ficheiros e fazer Git Push para o GitHub Pages
        try {
          statusToggleBtn.disabled = true;
          statusToggleBtn.classList.add("opacity-50", "pointer-events-none");

          const response = await fetch("/api/system-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: next, auto_push: true })
          });

          if (response.ok) {
            const data = await response.json();
            if (data && data.success) {
              if (data.pushed) {
                if (window.showToast) {
                  window.showToast(next === "closed"
                    ? (isEn ? "✅ GitHub Pages locked successfully in maintenance mode!" : "✅ GitHub Pages bloqueado em manutenção com sucesso!")
                    : (isEn ? "✅ GitHub Pages opened successfully for participants!" : "✅ GitHub Pages reaberto para participantes com sucesso!"));
                }
              } else if (data.warning) {
                if (window.showToast) {
                  window.showToast(`⚠️ ${data.warning}`);
                }
              }
            }
          }
        } catch (fetchErr) {
          console.warn("Aviso ao sincronizar via API local:", fetchErr);
        } finally {
          statusToggleBtn.disabled = false;
          statusToggleBtn.classList.remove("opacity-50", "pointer-events-none");
          renderAccessControls();
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
    isModeratorAuthenticated,
    renderSubmissionsGrid,
    updateSubmissionsGrid
  };
})();
