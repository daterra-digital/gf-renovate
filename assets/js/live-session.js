/**
 * RENOVATE FG2 - Lógica da Sessão ao Vivo
 * Gestão de Participantes, Controlo de Fases, Desbloqueio por PIN (2026) e Prefill de Forms
 */

const LiveSession = (function () {
  const STORAGE_KEYS = {
    PARTICIPANT_CODE: "renovate_participant_code",
    UNLOCKED_STEPS: "renovate_unlocked_steps",
    COMPLETED_STEPS: "renovate_completed_steps",
    ALL_UNLOCKED_MIGRATION: "renovate_all_unlocked_v2",
    CLICKED_SLIDES: "renovate_step_clicked_slides",
    CLICKED_GAME: "renovate_step_clicked_game",
    CLICKED_SIM: "renovate_step_clicked_sim",
    JUMP_ALERT_STEPS: "renovate_jump_alert_steps"
  };

  const MODERATOR_PIN = "2026";
  const TOTAL_STEPS = 5;
  const PT_WEEKDAYS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

  // Estado interno da máquina de estados dos 5 passos
  let state = {
    participantCode: "",
    unlockedSteps: [1, 2, 3, 4, 5],
    completedSteps: [],
    clickedSlides: false, // Passo 2
    clickedGame: false,   // Passo 3
    clickedSim: false,    // Passo 4
    jumpAlertSteps: []    // Passos com alerta vermelho de salto (ex: 3 se tentou aceder ao Form 2 sem Form 1)
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
    updateLiveCalendar();
    evaluateStepConditions();
    bindAutomaticStepTriggers();

    // Sincronização em tempo real entre separadores do browser
    window.addEventListener("storage", (e) => {
      if (e.key === STORAGE_KEYS.UNLOCKED_STEPS || e.key === STORAGE_KEYS.COMPLETED_STEPS ||
          e.key.startsWith("renovate_step_") || e.key.startsWith("renovate_jump_")) {
        loadStorageState();
        evaluateStepConditions();
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
        state.participantCode = savedCode.trim().toUpperCase();
      }

      // Desbloqueio total predefinido para todos os participantes (passos 1 a 5)
      if (localStorage.getItem(STORAGE_KEYS.ALL_UNLOCKED_MIGRATION) !== "true") {
        state.unlockedSteps = [1, 2, 3, 4, 5];
        localStorage.setItem(STORAGE_KEYS.UNLOCKED_STEPS, JSON.stringify([1, 2, 3, 4, 5]));
        localStorage.setItem(STORAGE_KEYS.ALL_UNLOCKED_MIGRATION, "true");
      } else {
        const savedUnlocked = localStorage.getItem(STORAGE_KEYS.UNLOCKED_STEPS);
        if (savedUnlocked) {
          const parsed = JSON.parse(savedUnlocked);
          if (Array.isArray(parsed) && parsed.length > 0) {
            state.unlockedSteps = parsed;
          } else {
            state.unlockedSteps = [1, 2, 3, 4, 5];
          }
        } else {
          state.unlockedSteps = [1, 2, 3, 4, 5];
        }
      }

      const savedCompleted = localStorage.getItem(STORAGE_KEYS.COMPLETED_STEPS);
      if (savedCompleted) {
        state.completedSteps = JSON.parse(savedCompleted) || [];
      }

      const codeKey = state.participantCode || "anon";
      state.clickedSlides = localStorage.getItem(`${STORAGE_KEYS.CLICKED_SLIDES}_${codeKey}`) === "true";
      state.clickedGame = localStorage.getItem(`${STORAGE_KEYS.CLICKED_GAME}_${codeKey}`) === "true";
      state.clickedSim = localStorage.getItem(`${STORAGE_KEYS.CLICKED_SIM}_${codeKey}`) === "true";

      const savedAlerts = localStorage.getItem(`${STORAGE_KEYS.JUMP_ALERT_STEPS}_${codeKey}`);
      if (savedAlerts) {
        try {
          state.jumpAlertSteps = JSON.parse(savedAlerts) || [];
        } catch (e) {
          state.jumpAlertSteps = [];
        }
      } else {
        state.jumpAlertSteps = [];
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

      const codeKey = state.participantCode || "anon";
      localStorage.setItem(`${STORAGE_KEYS.CLICKED_SLIDES}_${codeKey}`, String(state.clickedSlides));
      localStorage.setItem(`${STORAGE_KEYS.CLICKED_GAME}_${codeKey}`, String(state.clickedGame));
      localStorage.setItem(`${STORAGE_KEYS.CLICKED_SIM}_${codeKey}`, String(state.clickedSim));
      localStorage.setItem(`${STORAGE_KEYS.JUMP_ALERT_STEPS}_${codeKey}`, JSON.stringify(state.jumpAlertSteps));
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
      state.completedSteps = [];
      state.clickedSlides = false;
      state.clickedGame = false;
      state.clickedSim = false;
      state.jumpAlertSteps = [];
      saveStorageState();
      renderLiveSessionUI();
      return true;
    }
    if (!newCode.trim()) {
      alert("Por favor introduza um Código de Participante válido (ex: FG2-PT01, NS-PT01).");
      return false;
    }
    state.participantCode = newCode.trim().toUpperCase();
    loadStorageState(); // recarregar flags associadas a este código
    evaluateStepConditions();
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
   * Avalia as condições estritas de conclusão de cada um dos 5 passos (Sinalização a VERDE):
   * Passo 1: Ativado automaticamente ao efetuar login / entrar na sessão.
   * Passo 2: Ativado após o participante clicar no botão 'Ver Slides no Programa (10:10)'.
   * Passo 3: Ativado APENAS quando o botão 'Jogar Tallentto' tiver sido clicado E as respostas do Formulário 1 estiverem registadas no Firebase.
   * Passo 4: Ativado APENAS quando o botão 'Abrir Simulador' tiver sido clicado E as respostas do Formulário 2 estiverem registadas no Firebase.
   * Passo 5: Ativado após a submissão e registo do Formulário 3 no Firebase.
   */
  function evaluateStepConditions() {
    const code = state.participantCode;
    const tracker = window.SubmissionsTracker;

    const isForm1Done = Boolean(tracker && typeof tracker.hasParticipantSubmitted === "function" && tracker.hasParticipantSubmitted(1, code));
    const isForm2Done = Boolean(tracker && typeof tracker.hasParticipantSubmitted === "function" && tracker.hasParticipantSubmitted(2, code));
    const isForm3Done = Boolean(tracker && typeof tracker.hasParticipantSubmitted === "function" && tracker.hasParticipantSubmitted(3, code));

    // Se o formulário correspondente foi submetido, remove o alerta vermelho de salto
    if (isForm1Done && state.jumpAlertSteps.includes(3)) {
      state.jumpAlertSteps = state.jumpAlertSteps.filter(s => s !== 3);
    }
    if (isForm2Done && state.jumpAlertSteps.includes(4)) {
      state.jumpAlertSteps = state.jumpAlertSteps.filter(s => s !== 4);
    }

    const calculatedCompleted = [];
    if (code) calculatedCompleted.push(1);
    if (state.clickedSlides) calculatedCompleted.push(2);
    if (state.clickedGame && isForm1Done) calculatedCompleted.push(3);
    if (state.clickedSim && isForm2Done) calculatedCompleted.push(4);
    if (isForm3Done) calculatedCompleted.push(5);

    state.completedSteps = calculatedCompleted;
    saveStorageState();
    renderLiveSessionUI();

    if (tracker && typeof tracker.renderProgramStatusBadges === "function") {
      tracker.renderProgramStatusBadges();
    }
  }

  /**
   * Gestão de Alertas de Salto (Validação Sequencial Obrigatória)
   */
  function triggerJumpAlert(stepNumber) {
    if (!state.jumpAlertSteps.includes(stepNumber)) {
      state.jumpAlertSteps.push(stepNumber);
      saveStorageState();
      renderLiveSessionUI();
      if (window.SubmissionsTracker && typeof window.SubmissionsTracker.renderProgramStatusBadges === "function") {
        window.SubmissionsTracker.renderProgramStatusBadges();
      }
    }
  }

  function clearJumpAlert(stepNumber) {
    if (state.jumpAlertSteps.includes(stepNumber)) {
      state.jumpAlertSteps = state.jumpAlertSteps.filter(s => s !== stepNumber);
      saveStorageState();
      renderLiveSessionUI();
      if (window.SubmissionsTracker && typeof window.SubmissionsTracker.renderProgramStatusBadges === "function") {
        window.SubmissionsTracker.renderProgramStatusBadges();
      }
    }
  }

  function isStepInJumpAlert(stepNumber) {
    return state.jumpAlertSteps.includes(stepNumber);
  }

  /**
   * Regra de Validação Sequencial e Alerta Vermelho (Bloqueio / Erro de Salto):
   * Se o participante tentar aceder a um questionário avançado (ex.: Form 2 ou Form 3)
   * sem ter submetido o formulário anterior obrigatório:
   * A checkbox do passo não concluído ("Passo X Concluído") passa a VERMELHO (bg-red-500 / text-red-600 / border-red-600).
   */
  function validateAdvanceToStep(targetStep) {
    const code = state.participantCode;
    const isEn = window.I18nManager && window.I18nManager.isEnglish();
    const tracker = window.SubmissionsTracker;

    if (targetStep === 4) {
      const form1Done = Boolean(tracker && typeof tracker.hasParticipantSubmitted === "function" && tracker.hasParticipantSubmitted(1, code));
      if (!form1Done) {
        triggerJumpAlert(3);
        const msg = isEn
          ? "Please submit Assessment 1 (Serious Game) before proceeding to Assessment 2."
          : "Por favor, conclua e submeta a Avaliação 1 (Serious Game) antes de avançar para a Avaliação 2.";
        if (window.showToast) window.showToast(msg, "warning");
        else alert(msg);
        return false;
      } else {
        clearJumpAlert(3);
      }
    } else if (targetStep === 5) {
      const form1Done = Boolean(tracker && typeof tracker.hasParticipantSubmitted === "function" && tracker.hasParticipantSubmitted(1, code));
      const form2Done = Boolean(tracker && typeof tracker.hasParticipantSubmitted === "function" && tracker.hasParticipantSubmitted(2, code));

      if (!form1Done) {
        triggerJumpAlert(3);
        const msg = isEn
          ? "Please submit Assessment 1 (Serious Game) before proceeding to the Final Evaluation."
          : "Por favor, conclua e submeta a Avaliação 1 (Serious Game) antes de avançar para a Avaliação Global.";
        if (window.showToast) window.showToast(msg, "warning");
        else alert(msg);
        return false;
      } else if (!form2Done) {
        triggerJumpAlert(4);
        const msg = isEn
          ? "Please submit Assessment 2 (Simulator) before proceeding to the Final Evaluation."
          : "Por favor, conclua e submeta a Avaliação 2 (Simulador) antes de avançar para a Avaliação Global.";
        if (window.showToast) window.showToast(msg, "warning");
        else alert(msg);
        return false;
      } else {
        clearJumpAlert(3);
        clearJumpAlert(4);
      }
    }
    return true;
  }

  /**
   * Gere a interação direta pelo participante na checkbox da Sessão ao Vivo
   */
  function handleCheckboxInteraction(stepNumber) {
    const code = state.participantCode;
    const isEn = window.I18nManager && window.I18nManager.isEnglish();
    const tracker = window.SubmissionsTracker;

    if (stepNumber === 1) {
      if (code) {
        const msg = isEn ? `Participant code active: ${code}` : `Código de participante ativo: ${code}`;
        if (window.showToast) window.showToast(msg);
      } else {
        const input = document.getElementById("participant-code-input");
        if (input) input.focus();
        const msg = isEn ? "Please enter your participant code at the top." : "Por favor introduza o seu código de participante no topo.";
        if (window.showToast) window.showToast(msg, "warning");
      }
      evaluateStepConditions();
      return;
    }

    if (stepNumber === 2) {
      if (!state.clickedSlides) {
        state.clickedSlides = true;
        saveStorageState();
        evaluateStepConditions();
        const msg = isEn ? "Step 2 marked as completed!" : "Passo 2 marcado como concluído!";
        if (window.showToast) window.showToast(msg);
      } else {
        evaluateStepConditions();
      }
      return;
    }

    if (stepNumber === 3) {
      const isForm1Done = Boolean(tracker && typeof tracker.hasParticipantSubmitted === "function" && tracker.hasParticipantSubmitted(1, code));
      if (!state.clickedGame) {
        const msg = isEn ? "Please click 'Play Tallentto' to start the Serious Game." : "Por favor clique em 'Jogar Tallentto' para iniciar o Serious Game.";
        if (window.showToast) window.showToast(msg, "warning");
      } else if (!isForm1Done) {
        const msg = isEn 
          ? "Awaiting Question 1 (Serious Game) submission in Firebase to complete Step 3." 
          : "Aguardando submissão do Questionário 1 (Serious Game) no Firebase para concluir o Passo 3.";
        if (window.showToast) window.showToast(msg, "warning");
      } else {
        const msg = isEn ? "Step 3 completed with success!" : "Passo 3 concluído com sucesso!";
        if (window.showToast) window.showToast(msg);
      }
      evaluateStepConditions();
      return;
    }

    if (stepNumber === 4) {
      const isForm1Done = Boolean(tracker && typeof tracker.hasParticipantSubmitted === "function" && tracker.hasParticipantSubmitted(1, code));
      if (!isForm1Done) {
        triggerJumpAlert(3);
        const msg = isEn
          ? "Please submit Assessment 1 (Serious Game) before completing Step 4."
          : "Por favor conclua e submeta a Avaliação 1 (Serious Game) antes de concluir o Passo 4.";
        if (window.showToast) window.showToast(msg, "warning");
        evaluateStepConditions();
        return;
      }
      const isForm2Done = Boolean(tracker && typeof tracker.hasParticipantSubmitted === "function" && tracker.hasParticipantSubmitted(2, code));
      if (!state.clickedSim) {
        const msg = isEn ? "Please click 'Open Simulator' to test the 3D Simulator." : "Por favor clique em 'Abrir Simulador' para testar o simulador 3D.";
        if (window.showToast) window.showToast(msg, "warning");
      } else if (!isForm2Done) {
        const msg = isEn 
          ? "Awaiting Question 2 (Simulator) submission in Firebase to complete Step 4." 
          : "Aguardando submissão do Questionário 2 (Simulador) no Firebase para concluir o Passo 4.";
        if (window.showToast) window.showToast(msg, "warning");
      } else {
        const msg = isEn ? "Step 4 completed with success!" : "Passo 4 concluído com sucesso!";
        if (window.showToast) window.showToast(msg);
      }
      evaluateStepConditions();
      return;
    }

    if (stepNumber === 5) {
      if (!validateAdvanceToStep(5)) {
        evaluateStepConditions();
        return;
      }
      const isForm3Done = Boolean(tracker && typeof tracker.hasParticipantSubmitted === "function" && tracker.hasParticipantSubmitted(3, code));
      if (!isForm3Done) {
        const msg = isEn 
          ? "Awaiting Final Global Evaluation submission in Firebase to complete Step 5." 
          : "Aguardando submissão da Avaliação Global no Firebase para concluir o Passo 5.";
        if (window.showToast) window.showToast(msg, "warning");
      } else {
        const msg = isEn ? "Session fully completed!" : "Sessão totalmente concluída!";
        if (window.showToast) window.showToast(msg);
      }
      evaluateStepConditions();
      return;
    }
  }

  /**
   * Marca um passo como concluído (ou não concluído) de forma programática ou automática
   */
  function markStepCompleted(stepNumber, completed = true, showToastNotice = false) {
    if (stepNumber === 2 && completed) state.clickedSlides = true;
    if (stepNumber === 3 && completed) state.clickedGame = true;
    if (stepNumber === 4 && completed) state.clickedSim = true;
    saveStorageState();
    evaluateStepConditions();
    return true;
  }

  /**
   * Liga os gatilhos automáticos aos botões de ação e fluxo de trabalho de cada fase
   */
  function bindAutomaticStepTriggers() {
    if (window._renovateAutoTriggersBound) return;
    window._renovateAutoTriggersBound = true;

    // Usar capture phase (true) para intercetar antes da navegação do link e bloquear saltos
    document.addEventListener("click", (e) => {
      // 1. Passo 2: Diapositivos ("Ver Slides no Programa")
      const slidesBtn = e.target.closest("#btn-goto-slides");
      if (slidesBtn) {
        state.clickedSlides = true;
        saveStorageState();
        evaluateStepConditions();
      }

      // 2. Passo 3: Serious Game Tallentto
      const gameBtn = e.target.closest("#btn-game-tallentto, .game-link-tallentto, #btn-schedule-tallentto");
      if (gameBtn) {
        state.clickedGame = true;
        saveStorageState();
        evaluateStepConditions();
      }

      // 3. Passo 4: Simulador PC Virmedex ou Avaliação Form 2 (Bloqueia salto se Form 1 não tiver sido submetido)
      const simBtn = e.target.closest("#btn-simulator-virmedex, .simulator-link-virmedex, #btn-schedule-simulator");
      const form2Btn = e.target.closest("#btn-form-3, .form-link-sim");
      if (simBtn || form2Btn) {
        if (!validateAdvanceToStep(4)) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        if (simBtn) {
          state.clickedSim = true;
          saveStorageState();
          evaluateStepConditions();
        }
      }

      // 4. Passo 5: Avaliação Global & Encerramento (Bloqueia salto se Form 1 ou Form 2 não tiverem sido submetidos)
      const formGlobalBtn = e.target.closest("#btn-form-global, .form-link-global");
      if (formGlobalBtn) {
        if (!validateAdvanceToStep(5)) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
      }
    }, true);
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
      const isAlert = state.jumpAlertSteps.includes(step) && !isCompleted;

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
          card.classList.remove("alert-jump", "border-red-500");
        } else if (isAlert) {
          card.classList.remove("completed", "border-emerald-500");
          card.classList.add("alert-jump", "border-red-500");
        } else {
          card.classList.remove("completed", "border-emerald-500", "alert-jump", "border-red-500");
        }
      }

      if (lockBadge) {
        lockBadge.innerHTML = "";
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
        completeCheckbox.disabled = false;
      }

      // Atualizar visual da barra de checkbox personalizada
      const chkLabel = document.getElementById(`step-checkbox-label-${step}`);
      const customBox = document.getElementById(`step-custom-box-${step}`);
      const customCheck = document.getElementById(`step-custom-check-${step}`);
      const chkText = document.getElementById(`step-checkbox-text-${step}`);
      const autoBadge = document.getElementById(`step-auto-badge-${step}`);

      if (chkLabel && customBox && customCheck && chkText && autoBadge) {
        chkLabel.classList.remove("opacity-50", "pointer-events-none", "cursor-not-allowed");
        chkLabel.classList.add("cursor-pointer");

        if (!chkLabel._hasClickBinding) {
          chkLabel._hasClickBinding = true;
          chkLabel.addEventListener("click", (e) => {
            e.preventDefault();
            handleCheckboxInteraction(step);
          });
        }

        // Texto Standard das Checkboxes: "Passo X Concluído" (ou "Step X Completed")
        const standardLabel = isEn ? `Step ${step} Completed` : `Passo ${step} Concluído`;
        chkText.textContent = standardLabel;

        if (isCompleted) {
          // ESTADO 1: VERDE (Concluído)
          chkLabel.className = "group flex items-center justify-between p-2.5 sm:p-3 rounded-xl border border-emerald-300 bg-emerald-50/90 hover:bg-emerald-100/70 hover:border-emerald-400 cursor-pointer transition-all select-none shadow-2xs";

          customBox.className = "w-5 h-5 rounded-lg border-2 border-emerald-600 bg-emerald-600 flex items-center justify-center transition-all shrink-0";
          customCheck.className = "w-3.5 h-3.5 text-white stroke-[3]";
          customCheck.setAttribute("data-lucide", "check");

          chkText.className = "text-xs font-bold text-emerald-950 transition-colors";

          autoBadge.className = "text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 inline-block";
          autoBadge.textContent = (window.I18nManager && window.I18nManager.t("live.badge.completed")) || (isEn ? "Completed" : "Concluído");

        } else if (isAlert) {
          // ESTADO 2: VERMELHO (Alerta de Pendência / Salto)
          chkLabel.className = "group flex items-center justify-between p-2.5 sm:p-3 rounded-xl border-2 border-red-600 bg-red-50/90 hover:bg-red-100/80 hover:border-red-700 cursor-pointer transition-all select-none shadow-2xs animate-pulse";

          customBox.className = "w-5 h-5 rounded-lg border-2 border-red-600 bg-red-500 flex items-center justify-center transition-all shrink-0";
          customCheck.className = "w-3.5 h-3.5 text-white stroke-[3]";
          customCheck.setAttribute("data-lucide", "alert-circle");

          chkText.className = "text-xs font-bold text-red-600 transition-colors";

          autoBadge.className = "text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full border border-red-300 inline-block animate-pulse";
          autoBadge.textContent = (window.I18nManager && window.I18nManager.t("live.badge.pending")) || (isEn ? "Pending" : "Pendente");

        } else {
          // ESTADO 3: NEUTRO / NÃO CONCLUÍDO
          chkLabel.className = "group flex items-center justify-between p-2.5 sm:p-3 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-[#FFFDF5] hover:border-[#FFCC66] cursor-pointer transition-all select-none shadow-2xs";

          customBox.className = "w-5 h-5 rounded-lg border-2 border-slate-300 bg-white flex items-center justify-center transition-all group-hover:border-[#FFCC66] shrink-0";
          customCheck.className = "w-3.5 h-3.5 text-white hidden stroke-[3]";

          chkText.className = "text-xs font-bold text-slate-700 group-hover:text-slate-900 transition-colors";

          autoBadge.className = "hidden text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300";
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
    getParticipantCode: () => state.participantCode,
    updateFormLinks,
    verifyModeratorPin,
    unlockStep,
    unlockAllSteps,
    unlockUpToStep,
    lockStep,
    isStepUnlocked: (stepNumber) => state.unlockedSteps.includes(parseInt(stepNumber, 10)),
    getUnlockedSteps: () => [...state.unlockedSteps],
    evaluateStepConditions,
    validateAdvanceToStep,
    triggerJumpAlert,
    clearJumpAlert,
    isStepInJumpAlert,
    handleCheckboxInteraction,
    toggleStepCompleted: handleCheckboxInteraction,
    markStepCompleted,
    updateLiveCalendar,
    render: renderLiveSessionUI,
    renderSteps: renderLiveSessionUI
  };

  window.LiveSession = publicApi;
  return publicApi;
})();
