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

  // Estado interno
  let state = {
    participantCode: "",
    unlockedSteps: [1], // Passo 1 sempre desbloqueado por defeito
    completedSteps: []
  };

  /**
   * Inicializa o estado a partir do localStorage e parâmetros de URL
   */
  function init() {
    loadStorageState();
    checkUrlOverrides();
    renderLiveSessionUI();
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

  /**
   * Define e valida o código do participante
   */
  function setParticipantCode(newCode) {
    if (!newCode || newCode.trim().length === 0) {
      alert("Por favor introduza um Código de Participante válido (ex: P01, EXP-04).");
      return false;
    }
    state.participantCode = newCode.trim().toUpperCase();
    saveStorageState();
    renderLiveSessionUI();
    return true;
  }

  /**
   * Gera URL de Google Form com prefill do código de participante
   */
  function getPrefilledFormUrl(baseUrl) {
    if (!baseUrl) return "#";
    if (!state.participantCode) return baseUrl;
    const separator = baseUrl.includes("?") ? "&" : "?";
    // Parâmetro genérico para formulários Google. Pode ser personalizado com o entry ID real.
    return `${baseUrl}${separator}usp=pp_url&entry.1000000=${encodeURIComponent(state.participantCode)}`;
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
   * Alterna estado de conclusão de uma fase pelo participante
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
   * Renderiza a interface da Sessão ao Vivo
   */
  function renderLiveSessionUI() {
    // 1. Atualizar display do Código do Participante
    const codeDisplay = document.getElementById("current-participant-code");
    const codeInput = document.getElementById("participant-code-input");
    const codeNotice = document.getElementById("participant-code-notice");

    if (codeDisplay) {
      codeDisplay.textContent = state.participantCode || "Não definido";
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

    // 2. Atualizar estado dos cartões de fases
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
          lockBadge.innerHTML = `<span class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300"><i data-lucide="unlock" class="w-3.5 h-3.5"></i> Desbloqueado</span>`;
        } else {
          lockBadge.innerHTML = `<span class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 border border-slate-300"><i data-lucide="lock" class="w-3.5 h-3.5"></i> Aguarda Moderador</span>`;
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
    }

    // 3. Atualizar botões com link para Google Forms (injetando prefill)
    const formBtn1 = document.getElementById("btn-form-1");
    if (formBtn1) formBtn1.href = getPrefilledFormUrl(RENOVATE_CONFIG.externalLinks.googleFormPreSession);

    const formBtn2 = document.getElementById("btn-form-2");
    if (formBtn2) formBtn2.href = getPrefilledFormUrl(RENOVATE_CONFIG.externalLinks.googleFormGameTallentto);

    const formBtn3 = document.getElementById("btn-form-3");
    if (formBtn3) formBtn3.href = getPrefilledFormUrl(RENOVATE_CONFIG.externalLinks.googleFormSimVirmedex);

    // 4. Re-inicializar ícones Lucide nos badges alterados
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // API pública
  return {
    init,
    getState: () => ({ ...state }),
    setParticipantCode,
    getPrefilledFormUrl,
    verifyModeratorPin,
    unlockStep,
    unlockAllSteps,
    lockStep,
    toggleStepCompleted,
    render: renderLiveSessionUI
  };
})();
