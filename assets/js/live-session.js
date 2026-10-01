/**
 * RENOVATE FG2 - Lógica da Sessão ao Vivo
 * Gestão de Participantes, Controlo de Fases, Desbloqueio por PIN (2026) e Prefill de Forms
 */

const LiveSession = (function () {
  const STORAGE_KEYS = {
    PARTICIPANT_CODE: "renovate_participant_code",
    UNLOCKED_STEPS: "renovate_unlocked_steps",
    COMPLETED_STEPS: "renovate_completed_steps",
    SERIOUS_GAME_CODE: "renovate_serious_game_code",
    SIM_SELECTED_STATION: "renovate_sim_selected_station"
  };

  const MODERATOR_PIN = "2026";
  const TOTAL_STEPS = 5;

  // Estado interno
  let state = {
    participantCode: "",
    unlockedSteps: [1], // Passo 1 sempre desbloqueado por defeito
    completedSteps: [],
    seriousGamePersonalCode: "",
    selectedSimStation: "P01",
    isSimPassVisible: false
  };

  /**
   * Inicializa o estado a partir do localStorage e parâmetros de URL
   */
  function init() {
    loadStorageState();
    checkUrlOverrides();
    // Se o código de participante estiver definido, o Passo 1 é marcado automaticamente como concluído
    if (state.participantCode && !state.completedSteps.includes(1)) {
      state.completedSteps.push(1);
      saveStorageState();
    }
    renderLiveSessionUI();
    bindAutomaticStepTriggers();
    bindCredentialEvents();
  }

  /**
   * Carrega dados do localStorage
   */
  function loadStorageState() {
    try {
      const savedCode = localStorage.getItem(STORAGE_KEYS.PARTICIPANT_CODE);
      if (savedCode) {
        state.participantCode = savedCode.trim();
      }

      const savedUnlocked = localStorage.getItem(STORAGE_KEYS.UNLOCKED_STEPS);
      if (savedUnlocked) {
        const parsed = JSON.parse(savedUnlocked);
        if (Array.isArray(parsed) && parsed.length > 0) {
          state.unlockedSteps = Array.from(new Set([...state.unlockedSteps, ...parsed]));
        }
      }

      const savedCompleted = localStorage.getItem(STORAGE_KEYS.COMPLETED_STEPS);
      if (savedCompleted) {
        state.completedSteps = JSON.parse(savedCompleted) || [];
      }

      const savedGameCode = localStorage.getItem(STORAGE_KEYS.SERIOUS_GAME_CODE);
      if (savedGameCode) {
        state.seriousGamePersonalCode = savedGameCode.trim();
      }

      const savedSimStation = localStorage.getItem(STORAGE_KEYS.SIM_SELECTED_STATION);
      if (savedSimStation) {
        state.selectedSimStation = savedSimStation.trim();
      }
    } catch (e) {
      console.warn("Aviso ao carregar localStorage:", e);
    }
  }

  /**
   * Guarda o estado no localStorage
   */
  function saveStorageState() {
    try {
      localStorage.setItem(STORAGE_KEYS.PARTICIPANT_CODE, state.participantCode);
      localStorage.setItem(STORAGE_KEYS.UNLOCKED_STEPS, JSON.stringify(state.unlockedSteps));
      localStorage.setItem(STORAGE_KEYS.COMPLETED_STEPS, JSON.stringify(state.completedSteps));
      localStorage.setItem(STORAGE_KEYS.SERIOUS_GAME_CODE, state.seriousGamePersonalCode || "");
      localStorage.setItem(STORAGE_KEYS.SIM_SELECTED_STATION, state.selectedSimStation || "P01");
    } catch (e) {
      console.error("Erro ao gravar no localStorage:", e);
    }
  }

  /**
   * Suporte a overrides via URL:
   * ?unlock=all -> Desbloqueia todos os passos
   * ?step=3 ou ?fase=3 -> Desbloqueia até ao passo indicado
   * ?code=P05 -> Define código de participante
   */
  function checkUrlOverrides() {
    const urlParams = new URLSearchParams(window.location.search);

    // Override de Código de Participante
    const codeParam = urlParams.get("code") || urlParams.get("id");
    if (codeParam) {
      state.participantCode = codeParam.trim().toUpperCase();
      const simUsers = (window.RENOVATE_CONFIG && RENOVATE_CONFIG.accessCredentials && RENOVATE_CONFIG.accessCredentials.simulatorUsers) || {};
      if (simUsers[state.participantCode]) {
        state.selectedSimStation = state.participantCode;
      }
      saveStorageState();
    }

    // Override de Desbloqueio Total (?unlock=all)
    if (urlParams.get("unlock") === "all") {
      state.unlockedSteps = [1, 2, 3, 4, 5];
      saveStorageState();
      console.info("⚡ Sessão ao Vivo: Todos os passos desbloqueados via parâmetro URL (?unlock=all)");
    }

    // Override por passo específico (?step=X ou ?fase=X)
    const stepParam = parseInt(urlParams.get("step") || urlParams.get("fase"), 10);
    if (!isNaN(stepParam) && stepParam >= 1 && stepParam <= TOTAL_STEPS) {
      for (let i = 1; i <= stepParam; i++) {
        if (!state.unlockedSteps.includes(i)) state.unlockedSteps.push(i);
      }
      saveStorageState();
    }
  }

  /**
   * Define e valida o código do participante
   */
  function setParticipantCode(newCode) {
    if (!newCode || newCode.trim().length === 0) {
      alert("Por favor introduza um Código de Participante válido (ex: P01, EXP-04).");
      return false;
    }
    state.participantCode = newCode.trim().toUpperCase();
    const simUsers = (window.RENOVATE_CONFIG && RENOVATE_CONFIG.accessCredentials && RENOVATE_CONFIG.accessCredentials.simulatorUsers) || {};
    if (simUsers[state.participantCode]) {
      state.selectedSimStation = state.participantCode;
    }
    if (!state.completedSteps.includes(1)) {
      state.completedSteps.push(1);
    }
    saveStorageState();
    renderLiveSessionUI();
    return true;
  }

  /**
   * Atualiza as URLs dos Google Forms anexando o código de participante aos campos oficiais (pre-fill)
   */
  function updateFormLinks(code) {
    const activeCode = (code !== undefined ? code : state.participantCode) || "";
    const formConfig = [
      { 
        id: "btn-form-2", 
        url: RENOVATE_CONFIG.externalLinks.googleFormGameTallentto, 
        selector: ".form-link-game",
        entryParams: activeCode ? `entry.1909349741=${encodeURIComponent(activeCode)}&entry.178320833=${encodeURIComponent(activeCode)}` : ""
      },
      { 
        id: "btn-form-3", 
        url: RENOVATE_CONFIG.externalLinks.googleFormSimVirmedex, 
        selector: ".form-link-sim",
        entryParams: activeCode ? `entry.576387166=${encodeURIComponent(activeCode)}` : ""
      },
      { 
        id: "btn-form-global", 
        url: RENOVATE_CONFIG.externalLinks.googleFormGlobal, 
        selector: ".form-link-global",
        entryParams: activeCode ? `entry.208145689=${encodeURIComponent(activeCode)}` : ""
      }
    ];

    formConfig.forEach(item => {
      if (!item.url) return;
      let fullUrl = item.url;
      if (item.entryParams) {
        fullUrl += `${fullUrl.includes("?") ? "&" : "?"}${item.entryParams}`;
      }

      const btn = document.getElementById(item.id);
      if (btn) btn.href = fullUrl;

      if (item.selector) {
        document.querySelectorAll(item.selector).forEach(el => {
          el.href = fullUrl;
        });
      }
    });

    // Garantir que todos os botões do Serious Game apontam para o link oficial da Tallentto
    const gameUrl = (window.RENOVATE_CONFIG && RENOVATE_CONFIG.externalLinks && RENOVATE_CONFIG.externalLinks.seriousGameTallentto) 
      || "https://www.cordalgpt.ai/renovate/pruebas.php?pilot=calibration-pilot&lang=pt";
    document.querySelectorAll(".game-link-tallentto, #btn-game-tallentto, #btn-schedule-tallentto").forEach(el => {
      el.href = gameUrl;
    });

    // Garantir que todos os botões do Simulador apontam para o link oficial do Simulador RENOVATE
    const simUrl = (window.RENOVATE_CONFIG && RENOVATE_CONFIG.externalLinks && RENOVATE_CONFIG.externalLinks.simulatorVirmedex) 
      || "https://simulator.renovateproject.eu/auth/login";
    document.querySelectorAll(".simulator-link-virmedex, #btn-simulator-virmedex, #btn-schedule-simulator").forEach(el => {
      el.href = simUrl;
    });
  }

  /**
   * Validação de PIN do Moderador (Opção C)
   */
  function verifyModeratorPin(pin) {
    return pin === MODERATOR_PIN;
  }

  /**
   * Desbloqueia um passo individual
   */
  function unlockStep(stepNumber) {
    if (stepNumber >= 1 && stepNumber <= TOTAL_STEPS && !state.unlockedSteps.includes(stepNumber)) {
      state.unlockedSteps.push(stepNumber);
      saveStorageState();
      renderLiveSessionUI();
      return true;
    }
    return false;
  }

  /**
   * Desbloqueia até ao passo X indicado (Ação do Moderador)
   */
  function unlockUpToStep(stepNumber) {
    const target = Math.min(Math.max(parseInt(stepNumber, 10) || 1, 1), TOTAL_STEPS);
    state.unlockedSteps = [];
    for (let i = 1; i <= target; i++) {
      state.unlockedSteps.push(i);
    }
    saveStorageState();
    renderLiveSessionUI();
  }

  /**
   * Desbloqueia todos os passos em bloco
   */
  function unlockAllSteps() {
    state.unlockedSteps = [1, 2, 3, 4, 5];
    saveStorageState();
    renderLiveSessionUI();
  }

  /**
   * Bloqueia um passo
   */
  function lockStep(stepNumber) {
    if (stepNumber > 1) { // Passo 1 nunca é bloqueado
      state.unlockedSteps = state.unlockedSteps.filter(s => s !== stepNumber);
      saveStorageState();
      renderLiveSessionUI();
    }
  }

  /**
   * Alterna estado de conclusão de uma fase pelo participante (manual)
   */
  function toggleStepCompleted(stepNumber) {
    if (state.completedSteps.includes(stepNumber)) {
      state.completedSteps = state.completedSteps.filter(s => s !== stepNumber);
    } else {
      state.completedSteps.push(stepNumber);
    }
    saveStorageState();
    renderLiveSessionUI();
  }

  /**
   * Marca um passo como concluído (ou não concluído) de forma programática ou automática
   */
  function markStepCompleted(stepNumber, completed = true, showToastNotice = false) {
    const wasCompleted = state.completedSteps.includes(stepNumber);
    if (completed && !wasCompleted) {
      state.completedSteps.push(stepNumber);
      saveStorageState();
      renderLiveSessionUI();
      if (showToastNotice && (window.showToast || typeof showToast === "function")) {
        const isEn = window.I18nManager && window.I18nManager.isEnglish();
        const stepTitles = {
          1: isEn ? "Step 1 (Participant Code)" : "Passo 1 (Código de Participante)",
          2: isEn ? "Step 2 (Presentation)" : "Passo 2 (Apresentação)",
          3: isEn ? "Step 3 (Serious Game)" : "Passo 3 (Serious Game)",
          4: isEn ? "Step 4 (Virtual Simulator)" : "Passo 4 (Simulador Virtual)",
          5: isEn ? "Step 5 (Final Evaluation)" : "Passo 5 (Avaliação Final)"
        };
        const title = stepTitles[stepNumber] || (isEn ? `Step ${stepNumber}` : `Passo ${stepNumber}`);
        const msg = isEn ? `${title} marked as completed!` : `${title} marcado automaticamente como concluído!`;
        const toastFn = window.showToast || showToast;
        toastFn(msg);
      }
      return true;
    } else if (!completed && wasCompleted) {
      state.completedSteps = state.completedSteps.filter(s => s !== stepNumber);
      saveStorageState();
      renderLiveSessionUI();
      return true;
    }
    return false;
  }

  /**
   * Liga os gatilhos automáticos aos botões de ação e fluxo de trabalho de cada fase
   */
  function bindAutomaticStepTriggers() {
    if (window._renovateAutoTriggersBound) return;
    window._renovateAutoTriggersBound = true;

    document.addEventListener("click", (e) => {
      // Passo 2: Diapositivos ("Ver Slides no Programa")
      if (e.target.closest("#btn-goto-slides")) {
        markStepCompleted(2, true, true);
      }

      // Passo 3: Serious Game Tallentto ou Avaliação Form 1
      if (e.target.closest("#btn-game-tallentto, .game-link-tallentto, #btn-form-2, .form-link-game, #btn-schedule-tallentto")) {
        markStepCompleted(3, true, true);
      }

      // Passo 4: Simulador PC Virmedex ou Avaliação Form 2
      if (e.target.closest("#btn-simulator-virmedex, .simulator-link-virmedex, #btn-form-3, .form-link-sim, #btn-schedule-simulator")) {
        markStepCompleted(4, true, true);
      }

      // Passo 5: Avaliação Global & Encerramento
      if (e.target.closest("#btn-form-global, .form-link-global")) {
        markStepCompleted(5, true, true);
      }
    });
  }

  /**
   * Renderiza a interface da Sessão ao Vivo
   */
  function renderLiveSessionUI() {
    const isEn = window.I18nManager && window.I18nManager.isEnglish();
    const notSetText = window.I18nManager ? window.I18nManager.t("live.notSet") : (isEn ? "Not set" : "Não definido");
    let unlockedText = isEn ? "Unlocked" : "Desbloqueado";
    if (window.I18nManager) {
      const tVal = window.I18nManager.t("live.unlocked");
      if (tVal && tVal !== "live.unlocked") {
        unlockedText = tVal;
      } else {
        const altVal = window.I18nManager.t("live.badge.unlocked");
        if (altVal && altVal !== "live.badge.unlocked") unlockedText = altVal;
      }
    }

    let waitingText = isEn ? "Awaiting Moderator" : "Aguarda Moderador";
    if (window.I18nManager) {
      const tVal = window.I18nManager.t("live.waitingModerator");
      if (tVal && tVal !== "live.waitingModerator") {
        waitingText = tVal;
      } else {
        const altVal = window.I18nManager.t("live.badge.waiting");
        if (altVal && altVal !== "live.badge.waiting") waitingText = altVal;
      }
    }

    // 1. Atualizar display do Código do Participante
    const codeDisplay = document.getElementById("current-participant-code");
    const codeInput = document.getElementById("participant-code-input");
    const codeNotice = document.getElementById("participant-code-notice");

    if (codeDisplay) {
      codeDisplay.textContent = state.participantCode || notSetText;
      if (state.participantCode) {
        codeDisplay.classList.remove("text-slate-400", "italic");
        codeDisplay.classList.add("text-slate-900", "font-mono", "font-bold");
      } else {
        codeDisplay.classList.add("text-slate-400", "italic");
        codeDisplay.classList.remove("text-slate-900", "font-mono");
      }
    }

    if (codeInput && !state.participantCode) {
      codeInput.value = "";
    } else if (codeInput && state.participantCode && !codeInput.matches(':focus')) {
      codeInput.value = state.participantCode;
    }

    if (codeNotice) {
      if (state.participantCode) {
        codeNotice.classList.add("hidden");
      } else {
        codeNotice.classList.remove("hidden");
      }
    }

    // Atualizar preview do Código Ativo no Passo 1
    const step1CodePreview = document.getElementById("step1-code-preview");
    if (step1CodePreview) {
      if (state.participantCode) {
        step1CodePreview.textContent = state.participantCode;
        step1CodePreview.classList.add("text-emerald-800", "bg-emerald-100", "px-2", "py-0.5", "rounded-md");
        step1CodePreview.classList.remove("text-slate-900");
      } else {
        step1CodePreview.textContent = window.I18nManager ? window.I18nManager.t("live.step1.configuredTop") : (isEn ? "Configured at Top" : "Configurado no Topo");
        step1CodePreview.classList.remove("text-emerald-800", "bg-emerald-100", "px-2", "py-0.5", "rounded-md");
        step1CodePreview.classList.add("text-slate-900");
      }
    }

    // 2. Atualizar estado dos cartões de fases e checkboxes estilizadas
    for (let step = 1; step <= TOTAL_STEPS; step++) {
      const card = document.getElementById(`step-card-${step}`);
      const lockBadge = document.getElementById(`step-lock-badge-${step}`);
      const actionContainer = document.getElementById(`step-actions-${step}`);
      const completeCheckbox = document.getElementById(`step-checkbox-${step}`);

      const isUnlocked = state.unlockedSteps.includes(step);
      const isCompleted = state.completedSteps.includes(step);

      if (card) {
        if (isUnlocked) {
          card.classList.remove("locked", "locked-section", "opacity-60", "grayscale");
          card.classList.add("active");
        } else {
          card.classList.add("locked", "locked-section");
          card.classList.remove("active");
        }

        if (isCompleted) {
          card.classList.add("completed", "border-emerald-500");
        } else {
          card.classList.remove("completed", "border-emerald-500");
        }
      }

      if (lockBadge) {
        if (isUnlocked) {
          lockBadge.innerHTML = `<span class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300"><i data-lucide="unlock" class="w-3.5 h-3.5"></i> ${unlockedText}</span>`;
        } else {
          lockBadge.innerHTML = `<span class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 border border-slate-300"><i data-lucide="lock" class="w-3.5 h-3.5"></i> ${waitingText}</span>`;
        }
      }

      if (actionContainer) {
        const interactiveElements = actionContainer.querySelectorAll("a, button:not(.btn-unlock-trigger)");
        interactiveElements.forEach(el => {
          if (isUnlocked) {
            el.removeAttribute("disabled");
            el.classList.remove("pointer-events-none", "opacity-50");
          } else {
            el.setAttribute("disabled", "true");
            el.classList.add("pointer-events-none", "opacity-50");
          }
        });
      }

      if (completeCheckbox) {
        completeCheckbox.checked = isCompleted;
        completeCheckbox.disabled = !isUnlocked;
      }

      // Atualizar visual da barra de checkbox personalizada
      const chkLabel = document.getElementById(`step-checkbox-label-${step}`);
      const customBox = document.getElementById(`step-custom-box-${step}`);
      const customCheck = document.getElementById(`step-custom-check-${step}`);
      const chkText = document.getElementById(`step-checkbox-text-${step}`);
      const autoBadge = document.getElementById(`step-auto-badge-${step}`);

      if (chkLabel && customBox && customCheck && chkText && autoBadge) {
        if (!isUnlocked) {
          chkLabel.classList.add("opacity-50", "pointer-events-none", "cursor-not-allowed");
          chkLabel.classList.remove("cursor-pointer");
        } else {
          chkLabel.classList.remove("opacity-50", "pointer-events-none", "cursor-not-allowed");
          chkLabel.classList.add("cursor-pointer");
        }

        if (isCompleted) {
          // Estado Concluído
          chkLabel.classList.remove("border-slate-200", "bg-slate-50/80", "hover:bg-[#FFFDF5]", "hover:border-[#FFCC66]");
          chkLabel.classList.add("border-emerald-300", "bg-emerald-50/90", "hover:bg-emerald-100/70", "hover:border-emerald-400");
          
          customBox.classList.remove("border-slate-300", "bg-white", "group-hover:border-[#FFCC66]");
          customBox.classList.add("border-emerald-600", "bg-emerald-600");
          
          customCheck.classList.remove("hidden");
          
          chkText.classList.remove("text-slate-700", "group-hover:text-slate-900");
          chkText.classList.add("text-emerald-950");
          
          const completedKey = `live.step${step}.completed`;
          const completedDefault = step === 5 ? (isEn ? "Session Fully Completed" : "Sessão Totalmente Concluída") : (isEn ? `Step ${step} Completed` : `Passo ${step} Concluído`);
          chkText.textContent = (window.I18nManager && window.I18nManager.t(completedKey)) || completedDefault;
          
          autoBadge.classList.remove("hidden");
          autoBadge.textContent = (window.I18nManager && window.I18nManager.t("live.badge.completed")) || (isEn ? "Completed" : "Concluído");
        } else {
          // Estado Não Concluído
          chkLabel.classList.add("border-slate-200", "bg-slate-50/80", "hover:bg-[#FFFDF5]", "hover:border-[#FFCC66]");
          chkLabel.classList.remove("border-emerald-300", "bg-emerald-50/90", "hover:bg-emerald-100/70", "hover:border-emerald-400");
          
          customBox.classList.add("border-slate-300", "bg-white", "group-hover:border-[#FFCC66]");
          customBox.classList.remove("border-emerald-600", "bg-emerald-600");
          
          customCheck.classList.add("hidden");
          
          chkText.classList.add("text-slate-700", "group-hover:text-slate-900");
          chkText.classList.remove("text-emerald-950");
          
          const checkboxKey = `live.step${step}.checkbox`;
          const checkboxDefault = step === 5 ? (isEn ? "Mark Session as Fully Completed" : "Marcar Sessão como Totalmente Concluída") : (isEn ? `Mark Step ${step} as Completed` : `Marcar Passo ${step} como Concluído`);
          chkText.textContent = (window.I18nManager && window.I18nManager.t(checkboxKey)) || checkboxDefault;
          
          autoBadge.classList.add("hidden");
        }
      }

      // Sincronizar também com os acordeões do Programa (Tab 2)
      document.querySelectorAll(`.accordion-step-${step}`).forEach(acc => {
        if (isUnlocked) {
          acc.classList.remove("opacity-60", "grayscale");
        } else {
          acc.classList.add("opacity-60");
        }
      });

      document.querySelectorAll(`.accordion-lock-badge-${step}`).forEach(badge => {
        if (isUnlocked) {
          badge.innerHTML = `<span class="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300"><i data-lucide="unlock" class="w-3 h-3"></i> ${unlockedText}</span>`;
        } else {
          badge.innerHTML = `<span class="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 border border-slate-300"><i data-lucide="lock" class="w-3 h-3"></i> ${waitingText}</span>`;
        }
      });

      document.querySelectorAll(`.accordion-actions-${step}`).forEach(container => {
        const links = container.querySelectorAll("a, button:not(.btn-unlock-trigger)");
        links.forEach(el => {
          // No Programa & Slides, manter os links sempre clicáveis para permitir teste das ferramentas
          el.removeAttribute("disabled");
          el.classList.remove("pointer-events-none");
          if (isUnlocked) {
            el.classList.remove("opacity-60");
          }
        });
      });
    }

    // 3. Atualizar botões com link para Google Forms (injetando ?entry.code=${code})
    updateFormLinks(state.participantCode);

    // 4. Renderizar Acesso ao Serious Game e Credenciais do Simulador
    renderSeriousGameUI();
    renderSimulatorUI();
    renderModeratorCredentialsUI();

    // 5. Re-inicializar ícones Lucide nos badges e caixas alteradas
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  /**
   * Cópia para a área de transferência universal (com suporte a fallback e feedback visual)
   */
  async function copyToClipboard(text, btnElement, labelElement, defaultText, successText) {
    if (!text) return;
    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        copied = true;
      }
    } catch (err) {
      console.warn("Clipboard API falhou, a tentar fallback:", err);
    }

    if (!copied) {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        copied = document.execCommand("copy");
        document.body.removeChild(textArea);
      } catch (e) {
        console.error("Fallback execCommand falhou:", e);
      }
    }

    if (btnElement) {
      const isEn = window.I18nManager && window.I18nManager.isEnglish();
      const confirmedText = successText || (window.I18nManager ? window.I18nManager.t("live.copied") : (isEn ? "Copied!" : "✓ Copiado!"));
      const targetLabel = labelElement || btnElement.querySelector("span");
      const prevText = targetLabel ? targetLabel.textContent : "";
      
      const prevClasses = btnElement.className;
      btnElement.classList.remove("bg-purple-700", "bg-sky-700", "bg-slate-800", "hover:bg-purple-800", "hover:bg-sky-800", "hover:bg-slate-900");
      btnElement.classList.add("bg-emerald-600", "text-white", "hover:bg-emerald-700");
      if (targetLabel) targetLabel.textContent = confirmedText;

      setTimeout(() => {
        btnElement.className = prevClasses;
        if (targetLabel) targetLabel.textContent = defaultText || prevText;
      }, 2200);
    }

    if (window.showToast || typeof showToast === "function") {
      const isEn = window.I18nManager && window.I18nManager.isEnglish();
      const toastFn = window.showToast || showToast;
      toastFn(isEn ? `Copied to clipboard: "${text}"` : `Copiado para a área de transferência: "${text}"`);
    }
  }

  /**
   * Renderiza os dados do Serious Game (Chave do Piloto e Código Pessoal)
   */
  function renderSeriousGameUI() {
    const creds = window.RENOVATE_CONFIG && RENOVATE_CONFIG.accessCredentials && RENOVATE_CONFIG.accessCredentials.seriousGame;
    const pilotKey = (creds && creds.pilotKey) || "calibration-pilot";
    
    const keyDisplay = document.getElementById("serious-game-pilot-key-display");
    if (keyDisplay) keyDisplay.textContent = pilotKey;

    const inputPersonal = document.getElementById("input-personal-game-code");
    if (inputPersonal && !inputPersonal.matches(':focus')) {
      inputPersonal.value = state.seriousGamePersonalCode || "";
    }
  }

  /**
   * Renderiza os dados do Simulador (Estação Ativa, Email e Palavra-passe)
   */
  function renderSimulatorUI() {
    const simUsers = (window.RENOVATE_CONFIG && RENOVATE_CONFIG.accessCredentials && RENOVATE_CONFIG.accessCredentials.simulatorUsers) || {};
    const stationSelect = document.getElementById("sim-station-select");
    
    if (stationSelect && stationSelect.options.length === 0) {
      const keys = Object.keys(simUsers);
      const isEn = window.I18nManager && window.I18nManager.isEnglish();
      const stationPrefix = isEn ? "Station" : "Estação";
      keys.forEach(k => {
        const opt = document.createElement("option");
        opt.value = k;
        opt.textContent = `${k} (${stationPrefix} ${k.replace('P', '')})`;
        stationSelect.appendChild(opt);
      });
    }

    // Definir estação ativa: preferir o código do participante se existir na lista
    let activeStation = "P01";
    if (state.participantCode && simUsers[state.participantCode]) {
      activeStation = state.participantCode;
    } else if (state.selectedSimStation && simUsers[state.selectedSimStation]) {
      activeStation = state.selectedSimStation;
    }

    if (stationSelect && stationSelect.value !== activeStation) {
      stationSelect.value = activeStation;
    }

    const currentCred = simUsers[activeStation] || { email: "participante01@renovate.eu", pass: "Renovate2026!P01" };
    const emailDisplay = document.getElementById("sim-email-display");
    const passDisplay = document.getElementById("sim-pass-display");
    const passIcon = document.getElementById("icon-sim-pass-toggle");

    if (emailDisplay) emailDisplay.textContent = currentCred.email;
    if (passDisplay) {
      passDisplay.textContent = state.isSimPassVisible ? currentCred.pass : "••••••••";
    }
    if (passIcon) {
      passIcon.setAttribute("data-lucide", state.isSimPassVisible ? "eye-off" : "eye");
    }
  }

  /**
   * Renderiza a lista de apoio para o Moderador
   */
  function renderModeratorCredentialsUI() {
    const creds = window.RENOVATE_CONFIG && RENOVATE_CONFIG.accessCredentials;
    if (!creds) return;

    const gameKeyVal = document.getElementById("mod-game-key-val");
    if (gameKeyVal && creds.seriousGame) {
      gameKeyVal.textContent = creds.seriousGame.pilotKey || "calibration-pilot";
    }

    const listContainer = document.getElementById("mod-simulator-accounts-list");
    if (listContainer && listContainer.children.length === 0 && creds.simulatorUsers) {
      listContainer.innerHTML = Object.entries(creds.simulatorUsers).map(([code, user]) => `
        <div class="mod-account-item p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between gap-2 shadow-2xs transition-all" data-filter-text="${code.toLowerCase()} ${user.email.toLowerCase()}">
          <div class="flex items-center gap-2 min-w-0 flex-1">
            <span class="inline-flex items-center justify-center w-8 h-6 rounded bg-sky-100 text-sky-800 font-bold text-xs shrink-0">${code}</span>
            <div class="truncate text-[11px] leading-tight">
              <span class="font-bold text-slate-800 block truncate">${user.email}</span>
              <span class="text-slate-500 font-mono text-[10px]">${user.pass}</span>
            </div>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <button type="button" class="btn-mod-copy-user-email px-2 py-1 rounded bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-800 text-[10px] font-bold transition flex items-center gap-0.5 active:scale-95" data-email="${user.email}" title="Copiar E-mail">
              <i data-lucide="copy" class="w-3 h-3"></i> Email
            </button>
            <button type="button" class="btn-mod-copy-user-pass px-2 py-1 rounded bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 text-[10px] font-bold transition flex items-center gap-0.5 active:scale-95" data-pass="${user.pass}" title="Copiar Senha">
              <i data-lucide="key" class="w-3 h-3"></i> Senha
            </button>
          </div>
        </div>
      `).join("");
    }
  }

  /**
   * Liga os eventos de cópia e interação de credenciais
   */
  function bindCredentialEvents() {
    if (window._renovateCredentialEventsBound) return;
    window._renovateCredentialEventsBound = true;

    // 1. Passo 3 - Copiar Chave do Piloto Serious Game
    const btnCopyGameKey = document.getElementById("btn-copy-game-key");
    if (btnCopyGameKey) {
      btnCopyGameKey.addEventListener("click", () => {
        const creds = window.RENOVATE_CONFIG && RENOVATE_CONFIG.accessCredentials && RENOVATE_CONFIG.accessCredentials.seriousGame;
        const pilotKey = (creds && creds.pilotKey) || "calibration-pilot";
        const label = document.getElementById("btn-copy-game-key-text");
        const isEn = window.I18nManager && window.I18nManager.isEnglish();
        copyToClipboard(pilotKey, btnCopyGameKey, label, isEn ? "Copy Key" : "Copiar Chave", isEn ? "Copied!" : "✓ Copiado!");
      });
    }

    // 2. Passo 3 - Guardar Código Pessoal de 6 letras
    const btnSaveGameCode = document.getElementById("btn-save-personal-game-code");
    const inputGameCode = document.getElementById("input-personal-game-code");
    if (btnSaveGameCode && inputGameCode) {
      btnSaveGameCode.addEventListener("click", () => {
        const val = inputGameCode.value.trim().toUpperCase();
        if (val) {
          state.seriousGamePersonalCode = val;
          saveStorageState();
          const isEn = window.I18nManager && window.I18nManager.isEnglish();
          const label = document.getElementById("btn-save-personal-game-code-text");
          if (label) label.textContent = isEn ? "Saved!" : "✓ Guardado!";
          setTimeout(() => {
            if (label) label.textContent = isEn ? "Save" : "Guardar";
          }, 2000);
          if (window.showToast || typeof showToast === "function") {
            const toastFn = window.showToast || showToast;
            toastFn(isEn ? `Personal code ${val} saved on device!` : `Código pessoal ${val} gravado no dispositivo!`);
          }
        }
      });
    }

    // 3. Passo 4 - Mudar Estação no select
    const stationSelect = document.getElementById("sim-station-select");
    if (stationSelect) {
      stationSelect.addEventListener("change", (e) => {
        state.selectedSimStation = e.target.value;
        saveStorageState();
        renderSimulatorUI();
        if (window.lucide) window.lucide.createIcons();
      });
    }

    // 4. Passo 4 - Copiar E-mail do Simulador
    const btnCopySimEmail = document.getElementById("btn-copy-sim-email");
    if (btnCopySimEmail) {
      btnCopySimEmail.addEventListener("click", () => {
        const simUsers = (window.RENOVATE_CONFIG && RENOVATE_CONFIG.accessCredentials && RENOVATE_CONFIG.accessCredentials.simulatorUsers) || {};
        const activeStation = (stationSelect && stationSelect.value) || state.selectedSimStation || "P01";
        const email = (simUsers[activeStation] && simUsers[activeStation].email) || "participante01@renovate.eu";
        const label = document.getElementById("btn-copy-sim-email-text");
        const isEn = window.I18nManager && window.I18nManager.isEnglish();
        copyToClipboard(email, btnCopySimEmail, label, isEn ? "Copy Email" : "Copiar E-mail", isEn ? "Copied!" : "✓ Copiado!");
      });
    }

    // 5. Passo 4 - Copiar Senha do Simulador
    const btnCopySimPass = document.getElementById("btn-copy-sim-pass");
    if (btnCopySimPass) {
      btnCopySimPass.addEventListener("click", () => {
        const simUsers = (window.RENOVATE_CONFIG && RENOVATE_CONFIG.accessCredentials && RENOVATE_CONFIG.accessCredentials.simulatorUsers) || {};
        const activeStation = (stationSelect && stationSelect.value) || state.selectedSimStation || "P01";
        const pass = (simUsers[activeStation] && simUsers[activeStation].pass) || "Renovate2026!P01";
        const label = document.getElementById("btn-copy-sim-pass-text");
        const isEn = window.I18nManager && window.I18nManager.isEnglish();
        copyToClipboard(pass, btnCopySimPass, label, isEn ? "Copy Password" : "Copiar Senha", isEn ? "Copied!" : "✓ Copiado!");
      });
    }

    // 6. Passo 4 - Alternar visibilidade da senha (olho)
    const btnToggleSimPass = document.getElementById("btn-toggle-sim-pass");
    if (btnToggleSimPass) {
      btnToggleSimPass.addEventListener("click", () => {
        state.isSimPassVisible = !state.isSimPassVisible;
        renderSimulatorUI();
        if (window.lucide) window.lucide.createIcons();
      });
    }

    // 7. Moderação - Copiar Chave do Jogo
    const btnModCopyKey = document.getElementById("btn-mod-copy-game-key");
    if (btnModCopyKey) {
      btnModCopyKey.addEventListener("click", () => {
        const creds = window.RENOVATE_CONFIG && RENOVATE_CONFIG.accessCredentials && RENOVATE_CONFIG.accessCredentials.seriousGame;
        const pilotKey = (creds && creds.pilotKey) || "calibration-pilot";
        const label = document.getElementById("btn-mod-copy-game-key-text");
        const isEn = window.I18nManager && window.I18nManager.isEnglish();
        copyToClipboard(pilotKey, btnModCopyKey, label, isEn ? "Copy" : "Copiar", isEn ? "Copied!" : "✓ Copiado!");
      });
    }

    // 8. Moderação - Toggle Secção Credenciais
    const btnToggleModCred = document.getElementById("btn-toggle-mod-credentials");
    const containerModCred = document.getElementById("mod-credentials-container");
    const chevronModCred = document.getElementById("icon-mod-cred-chevron");
    if (btnToggleModCred && containerModCred) {
      btnToggleModCred.addEventListener("click", () => {
        const isHidden = containerModCred.classList.contains("hidden");
        if (isHidden) {
          containerModCred.classList.remove("hidden");
          if (chevronModCred) chevronModCred.classList.add("rotate-180");
          renderModeratorCredentialsUI();
          if (window.lucide) window.lucide.createIcons();
        } else {
          containerModCred.classList.add("hidden");
          if (chevronModCred) chevronModCred.classList.remove("rotate-180");
        }
      });
    }

    // 8.1. Moderação - Filtro em tempo real para as 50 contas
    const filterInput = document.getElementById("mod-cred-filter-input");
    if (filterInput) {
      filterInput.addEventListener("input", (e) => {
        const query = e.target.value.trim().toLowerCase();
        const items = document.querySelectorAll(".mod-account-item");
        items.forEach(el => {
          const text = el.getAttribute("data-filter-text") || "";
          if (!query || text.includes(query)) {
            el.classList.remove("hidden");
          } else {
            el.classList.add("hidden");
          }
        });
      });
    }

    // 9. Moderação - Copiar E-mails ou Senhas individuais na lista de contas
    document.addEventListener("click", (e) => {
      const btnEmail = e.target.closest(".btn-mod-copy-user-email");
      if (btnEmail) {
        const email = btnEmail.getAttribute("data-email");
        copyToClipboard(email, btnEmail, null, "Email", "✓ Copiado!");
      }
      const btnPass = e.target.closest(".btn-mod-copy-user-pass");
      if (btnPass) {
        const pass = btnPass.getAttribute("data-pass");
        copyToClipboard(pass, btnPass, null, "Senha", "✓ Copiado!");
      }

      // 10. Programa - Copiar Chave no Acordeão do Serious Game
      const btnScheduleCopy = e.target.closest(".btn-copy-game-key-schedule");
      if (btnScheduleCopy) {
        const key = btnScheduleCopy.getAttribute("data-key") || "calibration-pilot";
        copyToClipboard(key, btnScheduleCopy, null, "Copiar Chave", "✓ Copiado!");
      }

      // 11. Programa - Ir para as Credenciais do Passo 4 na Sessão ao Vivo
      const btnGotoStep4 = e.target.closest(".btn-goto-live-step4");
      if (btnGotoStep4) {
        if (window.switchTab) window.switchTab("live");
        const stepCard4 = document.getElementById("step-card-4");
        if (stepCard4) {
          stepCard4.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    });
  }

  // API pública
  const publicApi = {
    init,
    getState: () => ({ ...state }),
    setParticipantCode,
    updateFormLinks,
    verifyModeratorPin,
    unlockStep,
    unlockAllSteps,
    unlockUpToStep,
    lockStep,
    toggleStepCompleted,
    markStepCompleted,
    render: renderLiveSessionUI,
    renderSteps: renderLiveSessionUI
  };

  window.LiveSession = publicApi;
  return publicApi;
})();
