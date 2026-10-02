/**
 * RENOVATE FG2 - Lógica da Sessão ao Vivo
 * Gestão de Participantes, Controlo de Fases, Desbloqueio por PIN (2026) e Prefill de Forms
 */

const LiveSession = (function () {
  const STORAGE_KEYS = {
    PARTICIPANT_CODE: "renovate_participant_code",
    UNLOCKED_STEPS: "renovate_unlocked_steps",
    COMPLETED_STEPS: "renovate_completed_steps"
  };

  const MODERATOR_PIN = "2026";
  const TOTAL_STEPS = 5;
  const PT_WEEKDAYS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

  // Estado interno
  let state = {
    participantCode: "",
    unlockedSteps: [1], // Passo 1 sempre desbloqueado por defeito
    completedSteps: []
  };

  /**
   * Atualiza o ícone de calendário em tempo real com iniciais em pt-PT
   */
  function updateLiveCalendar() {
    const weekdayEl = document.getElementById("live-calendar-weekday");
    const dayEl = document.getElementById("live-calendar-day");
    if (!weekdayEl && !dayEl) return;

    const now = new Date();
    const dayOfWeek = PT_WEEKDAYS[now.getDay()] || "SEX";
    const dayOfMonth = String(now.getDate()).padStart(2, "0");

    if (weekdayEl) weekdayEl.textContent = dayOfWeek;
    if (dayEl) dayEl.textContent = dayOfMonth;
  }

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
    updateLiveCalendar();
    renderLiveSessionUI();
    bindAutomaticStepTriggers();

    // Sincronização em tempo real entre separadores do browser
    window.addEventListener("storage", (e) => {
      if (e.key === STORAGE_KEYS.UNLOCKED_STEPS || e.key === STORAGE_KEYS.COMPLETED_STEPS) {
        loadStorageState();
        renderLiveSessionUI();
      }
    });
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

  function setParticipantCode(newCode) {
    if (newCode === "" || newCode === null || newCode === undefined) {
      state.participantCode = "";
      state.completedSteps = state.completedSteps.filter(s => s !== 1);
      saveStorageState();
      renderLiveSessionUI();
      return true;
    }
    if (!newCode.trim()) {
      alert("Por favor introduza um Código de Participante válido (ex: FG2-PT01, NS-PT01).");
      return false;
    }
    state.participantCode = newCode.trim().toUpperCase();
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
      || "https://www.cordalgpt.ai/renovate/register.php?pilot=calibration-pilot&lang=pt";
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
   * Validação de PIN/Palavra-passe do Moderador (renovate26 ou fallback 2026)
   */
  function verifyModeratorPin(pin) {
    if (!pin) return false;
    const clean = pin.trim().toLowerCase();
    return clean === MODERATOR_PIN || clean === "renovate26";
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

    // 1. Atualizar ícone de calendário em tempo real (pt-PT)
    updateLiveCalendar();

    // 2. Atualizar display do Código do Participante
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
        const summary = acc.querySelector("summary");
        if (isUnlocked) {
          acc.classList.remove("accordion-locked", "opacity-60", "grayscale-[30%]");
          acc.classList.add("hover:border-[#F5B842]");
          acc.removeAttribute("data-locked");
          if (summary) {
            summary.classList.remove("cursor-not-allowed", "opacity-75");
            summary.classList.add("cursor-pointer", "hover:bg-slate-50");
            summary.removeAttribute("title");
          }
        } else {
          // Bloqueio estrito: fechar imediatamente o acordeão e marcar como bloqueado
          acc.open = false;
          acc.classList.add("accordion-locked", "opacity-60", "grayscale-[30%]");
          acc.classList.remove("hover:border-[#F5B842]");
          acc.setAttribute("data-locked", "true");
          if (summary) {
            summary.classList.add("cursor-not-allowed", "opacity-75");
            summary.classList.remove("cursor-pointer", "hover:bg-slate-50");
            summary.setAttribute("title", isEn ? "Activity locked by moderator" : "Atividade bloqueada pelo moderador");
          }
        }
      });

      // Indicadores visuais de cadeado no cabeçalho do acordeão
      document.querySelectorAll(`.accordion-header-lock-${step}`).forEach(ind => {
        if (isUnlocked) {
          ind.classList.add("hidden");
        } else {
          ind.classList.remove("hidden");
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
        const interactiveElements = container.querySelectorAll("a, button:not(.btn-unlock-trigger)");
        interactiveElements.forEach(el => {
          if (isUnlocked) {
            el.removeAttribute("disabled");
            el.removeAttribute("tabindex");
            el.classList.remove("pointer-events-none", "opacity-40", "cursor-not-allowed");
            if (el.dataset.origHref) {
              el.href = el.dataset.origHref;
              delete el.dataset.origHref;
            }
          } else {
            // Bloqueio estrito: desativar botões e links dos testes práticos e questionários
            el.setAttribute("disabled", "true");
            el.setAttribute("tabindex", "-1");
            el.classList.add("pointer-events-none", "opacity-40", "cursor-not-allowed");
            if (el.tagName === "A" && el.href && !el.dataset.origHref) {
              el.dataset.origHref = el.href;
            }
          }
        });
      });
    }

    // 3. Atualizar botões com link para Google Forms (injetando ?entry.code=${code})
    updateFormLinks(state.participantCode);

    // 4. Re-inicializar ícones Lucide nos badges e caixas alteradas
    if (window.lucide) {
      window.lucide.createIcons();
    }
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
    isStepUnlocked: (stepNumber) => state.unlockedSteps.includes(parseInt(stepNumber, 10)),
    getUnlockedSteps: () => [...state.unlockedSteps],
    toggleStepCompleted,
    markStepCompleted,
    updateLiveCalendar,
    render: renderLiveSessionUI,
    renderSteps: renderLiveSessionUI
  };

  window.LiveSession = publicApi;
  return publicApi;
})();
