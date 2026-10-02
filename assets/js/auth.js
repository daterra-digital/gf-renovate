/**
 * RENOVATE FG2 - Módulo de Autenticação, Tela de Login e Controlo de Acessos
 * Área Reservada de Testes & Avaliação
 * Projeto Europeu RENOVATE
 */

window.AuthModule = (function () {
  const STORAGE_KEYS = {
    SESSION_ACTIVE: "renovate_session_active",
    PARTICIPANT_CODE: "renovate_participant_code",
    USER_ROLE: "renovate_user_role",
    REGISTERED_PARTICIPANTS: "renovate_registered_participants",
    SYSTEM_STATUS: "system_status",
    SYSTEM_STATUS_ALT: "renovate_system_status",
    ACCESS_PHASE: "renovate_access_phase",
    CUSTOM_KEY: "renovate_custom_key",
    CONSENT_TIMESTAMP: "renovate_consent_timestamp",
    SESSION_PHASE: "renovate_session_phase"
  };

  // Palavras-passe Mestras de Moderador (insensíveis a maiúsculas)
  const MODERATOR_MASTER_KEYS = [
    "renovate2026-admin",
    "renovate26",
    "renovate-admin",
    "admin2026",
    "2026"
  ];

  // Datas de Referência do Grupo Focal 2
  const DATES = {
    EVENT: "2026-10-06",
    POST_EVENT: "2026-10-07"
  };

  // Chaves de Acesso Predefinidas (insensíveis a maiúsculas)
  const DEFAULT_KEYS = [
    "renovate2026",
    "remoto2026",
    "stakeholder2026",
    "fg2esas2026"
  ];

  // Geração de Códigos Oficiais
  // Fase 1: Presencial FG2-PT01 a FG2-PT50
  const PRESENTIAL_CODES = Array.from({ length: 50 }, (_, i) => {
    return `FG2-PT${String(i + 1).padStart(2, "0")}`;
  });

  // Fase 2: Pós-Grupo Focal / Remoto NS-PT01 a NS-PT50 (National Stakeholders)
  const REMOTE_CODES = Array.from({ length: 50 }, (_, i) => {
    return `NS-PT${String(i + 1).padStart(2, "0")}`;
  });

  /**
   * Obtém a data atual em formato ISO YYYY-MM-DD
   */
  function getCurrentDateStr() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  /**
   * Determina a fase ativa com base em configuração manual ou automática por calendário
   * Retorna: 'phase1' | 'phase2'
   */
  function getEffectivePhase() {
    try {
      const manualPhase = localStorage.getItem(STORAGE_KEYS.ACCESS_PHASE);
      if (manualPhase === "phase1" || manualPhase === "phase2") {
        return manualPhase;
      }
    } catch (e) {
      console.warn("Aviso ao ler fase de acesso:", e);
    }

    // Modo Automático por Data:
    // A partir de 07/10/2026 passa a Fase 2 (Remoto/Stakeholders)
    const today = getCurrentDateStr();
    if (today >= DATES.POST_EVENT) {
      return "phase2";
    }
    return "phase1";
  }

  /**
   * Obtém o estado do sistema (system_status)
   * Retorna: 'open' | 'closed'
   */
  function getSystemStatus() {
    try {
      const status1 = localStorage.getItem(STORAGE_KEYS.SYSTEM_STATUS);
      const status2 = localStorage.getItem(STORAGE_KEYS.SYSTEM_STATUS_ALT);
      const val = (status1 || status2 || "open").trim().toLowerCase();
      if (val === "closed" || val === "maintenance" || val === "fechado") {
        return "closed";
      }
      return "open";
    } catch (e) {
      return "open";
    }
  }

  /**
   * Altera o estado do sistema (Aberto para Testes / Fechado para Manutenção)
   */
  function setSystemStatus(status) {
    const val = status === "closed" || status === "maintenance" ? "closed" : "open";
    try {
      localStorage.setItem(STORAGE_KEYS.SYSTEM_STATUS, val);
      localStorage.setItem(STORAGE_KEYS.SYSTEM_STATUS_ALT, val);
    } catch (e) {
      console.error("Erro ao guardar system_status:", e);
    }
    syncUIWithStatus();
  }

  /**
   * Define o modo de fase ('auto', 'phase1', 'phase2')
   */
  function setAccessPhase(mode) {
    try {
      if (mode === "auto") {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_PHASE);
      } else {
        localStorage.setItem(STORAGE_KEYS.ACCESS_PHASE, mode);
      }
    } catch (e) {
      console.error("Erro ao guardar fase de acesso:", e);
    }
    renderCodesDropdown();
    syncUIWithPhase();
  }

  /**
   * Verifica se o utilizador possui uma sessão ativa válida
   */
  function isAuthenticated() {
    try {
      const active = localStorage.getItem(STORAGE_KEYS.SESSION_ACTIVE) === "true";
      const code = (localStorage.getItem(STORAGE_KEYS.PARTICIPANT_CODE) || "").trim();
      return active && code.length > 0;
    } catch (e) {
      return false;
    }
  }

  /**
   * Obtém o código do participante com sessão ativa
   */
  function getParticipantCode() {
    try {
      return (localStorage.getItem(STORAGE_KEYS.PARTICIPANT_CODE) || "").trim();
    } catch (e) {
      return "";
    }
  }

  /**
   * Obtém o perfil de utilizador guardado ('moderator' | 'participant')
   */
  function getUserRole() {
    try {
      return localStorage.getItem(STORAGE_KEYS.USER_ROLE) || "participant";
    } catch (e) {
      return "participant";
    }
  }

  /**
   * Verifica se o utilizador autenticado tem perfil de moderador
   */
  function isModerator() {
    return isAuthenticated() && getUserRole() === "moderator";
  }

  /**
   * Verifica se a chave fornecida é a Palavra-passe Mestra de Moderador
   */
  function isModeratorMasterKey(inputKey) {
    if (!inputKey) return false;
    const cleanKey = inputKey.trim().toLowerCase();
    return MODERATOR_MASTER_KEYS.includes(cleanKey);
  }

  /**
   * Obtém o tipo de participante ('MOD' | 'FG2' | 'NS' | 'PARTICIPANT')
   */
  function getParticipantType(code) {
    const c = (code || getParticipantCode()).toUpperCase();
    if (c.includes("-MD") || getUserRole() === "moderator") return "MOD";
    if (c.startsWith("FG2")) return "FG2";
    if (c.startsWith("NS")) return "NS";
    return "PARTICIPANT";
  }

  /**
   * Valida as chaves de acesso aceites
   */
  function validateAccessKey(inputKey) {
    if (!inputKey) return false;
    const cleanKey = inputKey.trim().toLowerCase();

    // 1. Chaves padrão do consórcio
    if (DEFAULT_KEYS.includes(cleanKey)) return true;

    // 2. Chave configurada pelo moderador
    try {
      const customKey = (localStorage.getItem(STORAGE_KEYS.CUSTOM_KEY) || "").trim().toLowerCase();
      if (customKey && cleanKey === customKey) return true;
    } catch (e) {
      // Ignorar erro
    }

    return false;
  }

  /**
   * Executa a autenticação e login na Área Reservada
   */
  function login(code, key, consent) {
    const isEn = window.I18nManager && window.I18nManager.isEnglish();
    const cleanCode = (code || "").trim().toUpperCase();
    const isModKey = isModeratorMasterKey(key);

    // 1. Verificar se a plataforma está aberta ou em manutenção
    // Moderador com Chave Mestra pode aceder mesmo se o sistema estiver em manutenção
    if (getSystemStatus() === "closed" && !isModKey) {
      return {
        success: false,
        error: isEn
          ? "The RENOVATE platform is temporarily closed for technical maintenance."
          : "A plataforma RENOVATE encontra-se temporariamente fechada para atualização de conteúdos e implementação técnica."
      };
    }

    // 2. Validação do código de participante
    if (!cleanCode) {
      return {
        success: false,
        error: isEn
          ? "Please select your Participant Code from the list."
          : "Por favor selecione o seu Código de Participante da lista."
      };
    }

    // Validar se o código pertence à fase ativa ou se é código de moderação
    const phase = getEffectivePhase();
    const validCodes = phase === "phase2" ? REMOTE_CODES : PRESENTIAL_CODES;
    const isModOption = cleanCode === "MOD-PT01" || cleanCode.startsWith("MOD-");

    if (!validCodes.includes(cleanCode) && !isModOption) {
      return {
        success: false,
        error: phase === "phase2"
          ? (isEn 
              ? "In-person codes (FG2-PT) are closed for new logins. Please select an assigned remote code (NS-PT)." 
              : "Os códigos presenciais (FG2-PT) estão encerrados para novos registos. Selecione o seu código remoto (NS-PT).")
          : (isEn 
              ? "Please select a valid in-person code (FG2-PT01 to FG2-PT50)." 
              : "Por favor selecione um código presencial válido (FG2-PT01 a FG2-PT50).")
      };
    }

    // 3. Validação da Chave de Acesso e Atribuição do Perfil e Sufixo -MD
    let userRole = "participant";
    let finalCode = cleanCode;

    if (isModKey) {
      // 1. Atribuição de privilégios de moderador
      userRole = "moderator";
      // 2. Adição automática do sufixo "-MD" ao código selecionado (exemplo: "FG2-PT03-MD")
      finalCode = cleanCode.endsWith("-MD") ? cleanCode : `${cleanCode}-MD`;
    } else {
      if (isModOption) {
        return {
          success: false,
          error: isEn
            ? "The MOD option requires the Master Moderator Password (e.g. renovate2026-admin)."
            : "A opção de moderação requer a introdução da Palavra-passe Mestra de Moderador (ex.: renovate2026-admin)."
        };
      }
      if (!validateAccessKey(key)) {
        return {
          success: false,
          error: isEn
            ? "Incorrect Access Key. Please check the session key and try again."
            : "Chave de Acesso incorreta. Por favor verifique a chave do evento e tente novamente."
        };
      }
    }

    // 3.1 Verificação estrita de código em uso (para utilizadores sem chave mestra)
    const registeredCodes = new Set();
    if (window.SubmissionsTracker && typeof window.SubmissionsTracker.getRegisteredCodes === "function") {
      window.SubmissionsTracker.getRegisteredCodes().forEach(c => {
        if (c) registeredCodes.add(String(c).trim().toUpperCase());
      });
    }
    try {
      const savedList = JSON.parse(localStorage.getItem(STORAGE_KEYS.REGISTERED_PARTICIPANTS) || "[]");
      if (Array.isArray(savedList)) {
        savedList.forEach(c => {
          if (c) registeredCodes.add(String(c).trim().toUpperCase());
        });
      }
    } catch (e) {}

    if (!isModKey && (registeredCodes.has(cleanCode) || registeredCodes.has(`${cleanCode}-MD`))) {
      return {
        success: false,
        error: isEn
          ? `Code ${cleanCode} is already registered. Please select an available code.`
          : `O código ${cleanCode} já se encontra em uso. Por favor selecione outro código disponível.`
      };
    }

    // 4. Validação do Consentimento RGPD
    if (!consent) {
      return {
        success: false,
        error: isEn
          ? "You must accept the informed consent and GDPR terms to proceed."
          : "É obrigatório aceitar o Consentimento Informado e os termos do RGPD para aceder."
      };
    }

    // Gravação segura no localStorage
    try {
      localStorage.setItem(STORAGE_KEYS.SESSION_ACTIVE, "true");
      localStorage.setItem(STORAGE_KEYS.PARTICIPANT_CODE, finalCode);
      localStorage.setItem(STORAGE_KEYS.USER_ROLE, userRole);
      localStorage.setItem(STORAGE_KEYS.SESSION_PHASE, phase);
      localStorage.setItem(STORAGE_KEYS.CONSENT_TIMESTAMP, new Date().toISOString());
      if (userRole === "moderator") {
        sessionStorage.setItem("renovate_mod_authenticated", "true");
      }
    } catch (e) {
      console.error("Erro ao gravar sessão no localStorage:", e);
    }

    // 3. Injeção nos formulários de avaliação com o código final (incluindo sufixo -MD se moderador)
    injectParticipantCodeToForms(finalCode);
    if (window.LiveSession && typeof window.LiveSession.setParticipantCode === "function") {
      window.LiveSession.setParticipantCode(finalCode);
    }

    // Registo do código no rastreador automático de participantes e contadores
    if (window.SubmissionsTracker && typeof window.SubmissionsTracker.registerParticipantCode === "function") {
      window.SubmissionsTracker.registerParticipantCode(finalCode);
    }

    // Atualização da UI
    unlockWebsite();
    renderHeaderUserBadge();
    if (window.updateNavVisibility) {
      window.updateNavVisibility();
    }

    return {
      success: true,
      code: finalCode,
      role: userRole
    };
  }

  /**
   * Encerra a sessão do utilizador e bloqueia o website
   */
  function logout(skipConfirm = false) {
    const isEn = window.I18nManager && window.I18nManager.isEnglish();
    if (!skipConfirm) {
      const confirmMsg = isEn
        ? "Do you really want to log out and lock access to the RENOVATE Restricted Area?"
        : "Deseja realmente terminar a sua sessão e bloquear o acesso à Área Reservada RENOVATE?";
      if (!confirm(confirmMsg)) {
        return;
      }
    }

    try {
      localStorage.removeItem(STORAGE_KEYS.SESSION_ACTIVE);
      localStorage.removeItem(STORAGE_KEYS.PARTICIPANT_CODE);
      localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
      localStorage.removeItem(STORAGE_KEYS.SESSION_PHASE);
      localStorage.removeItem(STORAGE_KEYS.CONSENT_TIMESTAMP);
      try {
        sessionStorage.removeItem("renovate_mod_authenticated");
      } catch (e) {}
    } catch (e) {
      console.error("Erro ao limpar sessão:", e);
    }

    // Limpar prefill dos formulários
    injectParticipantCodeToForms("");

    // Bloquear website e reabrir tela de login
    lockWebsite();
    renderHeaderUserBadge();
    if (window.updateNavVisibility) {
      window.updateNavVisibility();
    }

    if (window.showToast) {
      window.showToast(isEn ? "Session ended. Access locked." : "Sessão terminada. Acesso reservado bloqueado.");
    }
  }

  /**
   * Injeta o código do participante em todos os links para formulários Google Forms
   */
  function injectParticipantCodeToForms(code) {
    const activeCode = (code || getParticipantCode() || "").trim();

    // 1. Recorrer ao LiveSession caso disponível
    if (window.LiveSession && typeof window.LiveSession.updateFormLinks === "function") {
      window.LiveSession.updateFormLinks(activeCode);
    }

    // 2. Injeção direta em todos os seletores e links do website
    const formConfigs = [
      {
        selector: "#btn-form-2, .form-link-game",
        url: (window.RENOVATE_CONFIG && RENOVATE_CONFIG.externalLinks && RENOVATE_CONFIG.externalLinks.googleFormGameTallentto)
          || "https://docs.google.com/forms/d/e/1FAIpQLScAwHNGoYqikgsHwTOgKWC80l0F9b3S-kgXEbyCjxxjv_fTUQ/viewform",
        params: activeCode ? `entry.1909349741=${encodeURIComponent(activeCode)}&entry.178320833=${encodeURIComponent(activeCode)}` : ""
      },
      {
        selector: "#btn-form-3, .form-link-sim",
        url: (window.RENOVATE_CONFIG && RENOVATE_CONFIG.externalLinks && RENOVATE_CONFIG.externalLinks.googleFormSimVirmedex)
          || "https://docs.google.com/forms/d/e/1FAIpQLSeyF3Ty9bzdw1oexKLsX2dC3StkoeUW7AyeFBPDVY6sU6OPmQ/viewform",
        params: activeCode ? `entry.576387166=${encodeURIComponent(activeCode)}` : ""
      },
      {
        selector: "#btn-form-global, .form-link-global",
        url: (window.RENOVATE_CONFIG && RENOVATE_CONFIG.externalLinks && RENOVATE_CONFIG.externalLinks.googleFormGlobal)
          || "https://docs.google.com/forms/d/e/1FAIpQLSc1tR_sfcQMqXjd26UGfwyjLInt1fJw2IMM2ERXJAyjfdT1LA/viewform",
        params: activeCode ? `entry.208145689=${encodeURIComponent(activeCode)}` : ""
      }
    ];

    formConfigs.forEach(item => {
      let finalUrl = item.url;
      if (item.params) {
        finalUrl += `${finalUrl.includes("?") ? "&" : "?"}${item.params}`;
      }
      document.querySelectorAll(item.selector).forEach(el => {
        el.href = finalUrl;
      });
    });

    console.info(`🔐 AuthModule: Injeção de código [${activeCode || 'VAZIO'}] atualizada nos Google Forms.`);
  }

  /**
   * Bloqueia o website exibindo a Tela de Login e travando a rolagem
   */
  function lockWebsite() {
    const modal = document.getElementById("auth-login-modal");
    if (modal) {
      modal.classList.remove("hidden");
    }
    document.body.classList.add("auth-locked");
    document.documentElement.classList.add("auth-locked");

    // Ocultar menus de navegação ("Sessão ao Vivo", "Programa & Slides", "Grupo Focal 1", "Resultados & Media"), botão "Moderação", conteúdo principal e rodapé
    const desktopNav = document.querySelector("header nav");
    const mobileNav = document.querySelector(".mobile-bottom-nav");
    const modBtns = document.querySelectorAll(".btn-open-moderator-modal");
    const mainContent = document.querySelector("main");
    const footerContent = document.querySelector("footer");

    if (desktopNav) desktopNav.style.display = "none";
    if (mobileNav) mobileNav.style.display = "none";
    modBtns.forEach(btn => btn.style.display = "none");
    if (mainContent) mainContent.style.display = "none";
    if (footerContent) footerContent.style.display = "none";

    // Configurar o logótipo RENOVATE para abrir o site oficial antes do login
    const homeLogo = document.getElementById("nav-logo-home");
    if (homeLogo) {
      homeLogo.href = "https://renovateproject.eu/";
      homeLogo.target = "_blank";
      homeLogo.rel = "noopener noreferrer";
      homeLogo.title = "Website Oficial do Projeto RENOVATE (renovateproject.eu)";
    }

    // Limpar campos de formulário na tela de login
    const keyInput = document.getElementById("auth-access-key");
    const rgpdChk = document.getElementById("auth-consent-rgpd");
    const errBox = document.getElementById("auth-error-box");
    if (keyInput) keyInput.value = "";
    if (rgpdChk) rgpdChk.checked = false;
    if (errBox) {
      errBox.classList.add("hidden");
      errBox.textContent = "";
    }

    renderCodesDropdown();
    syncUIWithStatus();
    syncUIWithPhase();
  }

  /**
   * Desbloqueia o website e esconde a Tela de Login
   */
  function unlockWebsite() {
    const modal = document.getElementById("auth-login-modal");
    if (modal) {
      modal.classList.add("hidden");
    }
    document.body.classList.remove("auth-locked");
    document.documentElement.classList.remove("auth-locked");

    // Reexibir menus de navegação, botão "Moderação", conteúdo principal e rodapé
    const desktopNav = document.querySelector("header nav");
    const mobileNav = document.querySelector(".mobile-bottom-nav");
    const modBtns = document.querySelectorAll(".btn-open-moderator-modal");
    const mainContent = document.querySelector("main");
    const footerContent = document.querySelector("footer");

    if (desktopNav) desktopNav.style.display = "";
    if (mobileNav) mobileNav.style.display = "";
    modBtns.forEach(btn => btn.style.display = "");
    if (mainContent) mainContent.style.display = "";
    if (footerContent) footerContent.style.display = "";

    // Configurar o logótipo RENOVATE para levar à Home do website pós-login
    const homeLogo = document.getElementById("nav-logo-home");
    if (homeLogo) {
      homeLogo.href = "#live";
      homeLogo.removeAttribute("target");
      homeLogo.removeAttribute("rel");
      homeLogo.title = "Página Inicial - Sessão ao Vivo";
    }
  }

  /**
   * Renderiza a lista de opções do dropdown dinâmico de códigos
   */
  function renderCodesDropdown() {
    const select = document.getElementById("auth-participant-code");
    if (!select) return;

    const phase = getEffectivePhase();
    const codes = phase === "phase2" ? REMOTE_CODES : PRESENTIAL_CODES;
    const isEn = window.I18nManager && window.I18nManager.isEnglish();

    const placeholderText = isEn ? "Select your Participant Code..." : "Selecione o seu Código de Participante...";
    const groupLabel = phase === "phase2"
      ? (isEn ? "External / Remote Stakeholders (NS-PT)" : "Participantes Remotos / Stakeholders (NS-PT)")
      : (isEn ? "In-Person Focus Group Badges (FG2-PT)" : "Crachás Presenciais Grupo Focal (FG2-PT)");

    let currentSaved = getParticipantCode();
    if (!currentSaved && typeof window !== "undefined" && window.location && window.location.search) {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const urlCode = (urlParams.get("code") || urlParams.get("id") || "").trim().toUpperCase();
        if (codes.includes(urlCode)) {
          currentSaved = urlCode;
        }
      } catch (e) {}
    }

    // Obter códigos registados via Google Sheets e localStorage
    const registeredCodes = new Set();
    if (window.SubmissionsTracker && typeof window.SubmissionsTracker.getRegisteredCodes === "function") {
      window.SubmissionsTracker.getRegisteredCodes().forEach(c => {
        if (c) {
          const raw = String(c).trim().toUpperCase();
          registeredCodes.add(raw);
          const base = raw.replace(/-MD$/, "");
          registeredCodes.add(base);
        }
      });
    }
    try {
      const savedList = JSON.parse(localStorage.getItem(STORAGE_KEYS.REGISTERED_PARTICIPANTS) || "[]");
      if (Array.isArray(savedList)) {
        savedList.forEach(c => {
          if (c) {
            const raw = String(c).trim().toUpperCase();
            registeredCodes.add(raw);
            const base = raw.replace(/-MD$/, "");
            registeredCodes.add(base);
          }
        });
      }
    } catch (e) {}

    const inUseLabel = isEn ? "In use" : "Em uso";

    let html = `<option value="" disabled ${!currentSaved ? 'selected' : ''}>${placeholderText}</option>`;
    html += `<optgroup label="${groupLabel}">`;
    codes.forEach(code => {
      const isRegistered = registeredCodes.has(code) || registeredCodes.has(`${code}-MD`);
      const isSelected = code === currentSaved && !isRegistered;
      if (isRegistered) {
        // ESTRITAMENTE DESATIVADO: atributo HTML disabled impede seleção; texto a cinzento com "(Em uso)"
        html += `<option value="${code}" disabled class="text-slate-400 bg-slate-100 cursor-not-allowed" style="color: #94a3b8;">${code} (${inUseLabel})</option>`;
      } else {
        html += `<option value="${code}" ${isSelected ? 'selected' : ''}>${code}</option>`;
      }
    });
    html += `</optgroup>`;

    // Opção de Moderação & Coordenação
    const modLabel = isEn ? "MOD-PT01 (Moderator Access)" : "MOD-PT01 (Acesso de Moderador)";
    const modGroup = isEn ? "Moderação & Coordenação" : "Moderação & Coordenação";
    html += `<optgroup label="${modGroup}">`;
    html += `<option value="MOD-PT01">${modLabel}</option>`;
    html += `</optgroup>`;

    select.innerHTML = html;
  }

  /**
   * Sincroniza os avisos e bloqueios da Tela de Login consoante a Fase (Fase 1 vs Fase 2)
   */
  function syncUIWithPhase() {
    const phase = getEffectivePhase();
    const noticePhase2 = document.getElementById("auth-phase2-notice");
    const phaseBadge = document.getElementById("auth-phase-badge");
    const isEn = window.I18nManager && window.I18nManager.isEnglish();

    if (noticePhase2) {
      if (phase === "phase2") {
        noticePhase2.classList.remove("hidden");
      } else {
        noticePhase2.classList.add("hidden");
      }
    }

    if (phaseBadge) {
      if (phase === "phase2") {
        phaseBadge.textContent = isEn ? "Phase 2: Remote Stakeholders" : "Fase 2: Stakeholders Remotos";
        phaseBadge.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-900/60 text-cyan-200 border border-cyan-500/40 shadow-xs";
      } else {
        phaseBadge.textContent = isEn ? "Phase 1: In-Person Session" : "Fase 1: Sessão Presencial";
        phaseBadge.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-900/60 text-amber-200 border border-amber-500/40 shadow-xs";
      }
    }

    // Texto de apoio ao código de participante (estritamente condicionado à fase definida pelo moderador)
    const authCodeHelper = document.getElementById("auth-code-helper");
    if (authCodeHelper) {
      if (phase === "phase2") {
        authCodeHelper.textContent = isEn
          ? "Select your assigned code received via email (NS-PT)."
          : "Selecione o código individual atribuído por e-mail (NS-PT).";
      } else {
        authCodeHelper.textContent = isEn
          ? "Select the individual code from your physical badge (FG2-PT)."
          : "Selecione o código individual do seu crachá (FG2-PT).";
      }
    }

    // Menção do tipo de código no Modal RGPD
    const rgpdCodeMention = document.getElementById("rgpd-code-mention");
    if (rgpdCodeMention) {
      if (phase === "phase2") {
        rgpdCodeMention.textContent = isEn
          ? "through the individual Participant Code assigned to you via email (NS-PTxx)"
          : "através do Código de Participante individual atribuído por e-mail (NS-PTxx)";
      } else {
        rgpdCodeMention.textContent = isEn
          ? "through the individual Participant Code assigned on your physical badge (FG2-PTxx)"
          : "através do Código de Participante individual atribuído no seu crachá (FG2-PTxx)";
      }
    }
  }

  /**
   * Sincroniza a Tela de Login e o site consoante o system_status ('open' | 'closed')
   */
  function syncUIWithStatus() {
    const status = getSystemStatus();
    const isEn = window.I18nManager && window.I18nManager.isEnglish();
    const maintNotice = document.getElementById("auth-maintenance-notice");
    const formContainer = document.getElementById("auth-form-fields");
    const submitBtn = document.getElementById("btn-auth-submit");

    if (status === "closed") {
      if (maintNotice) maintNotice.classList.remove("hidden");
      if (formContainer) {
        formContainer.classList.add("opacity-50", "pointer-events-none");
      }
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add("cursor-not-allowed", "opacity-50");
      }
      // Se a plataforma está em manutenção e o modal não está aberto, bloquear
      const modal = document.getElementById("auth-login-modal");
      if (modal && modal.classList.contains("hidden")) {
        modal.classList.remove("hidden");
        document.body.classList.add("auth-locked");
        document.documentElement.classList.add("auth-locked");
      }
    } else {
      if (maintNotice) maintNotice.classList.add("hidden");
      if (formContainer) {
        formContainer.classList.remove("opacity-50", "pointer-events-none");
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove("cursor-not-allowed", "opacity-50");
      }
    }
  }

  /**
   * Renderiza a Área Reservada no Cabeçalho (Avatar circular, Identificador e Botão Sair)
   */
  function renderHeaderUserBadge() {
    const container = document.getElementById("header-user-badge");
    if (!container) return;

    if (!isAuthenticated()) {
      container.classList.add("hidden");
      container.innerHTML = "";
      return;
    }

    const code = getParticipantCode();
    const type = getParticipantType(code);
    const isEn = window.I18nManager && window.I18nManager.isEnglish();

    const isMOD = type === "MOD" || getUserRole() === "moderator";
    const isFG2 = type === "FG2";
    let typeLabel = isFG2 ? (isEn ? "In-Person" : "Presencial") : (isEn ? "Remote" : "Remoto");
    let avatarBg = isFG2 ? "bg-[#FFCC66] text-[#0F172A]" : "bg-emerald-400 text-slate-950";
    if (isMOD) {
      typeLabel = isEn ? "Moderator" : "Moderador";
      avatarBg = "bg-amber-500 text-slate-950 ring-2 ring-amber-400";
    }

    container.className = "flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200 animate-fadeIn";
    container.innerHTML = `
      <div class="flex items-center gap-2 bg-slate-900 text-white pl-1.5 pr-2.5 py-1 rounded-xl shadow-xs border border-slate-800" title="${isMOD ? (isEn ? 'Authenticated Moderator' : 'Moderador Autenticado') : (isEn ? 'Authenticated Participant' : 'Participante Autenticado')}">
        <!-- Avatar Circular com Tag de Tipo (FG2, NS ou MOD) -->
        <div class="w-7 h-7 rounded-full ${avatarBg} font-black text-[10px] tracking-tight flex items-center justify-center shadow-xs ring-2 ring-slate-800 shrink-0">
          ${isMOD ? 'MOD' : type}
        </div>
        <!-- Identificador do Participante -->
        <div class="flex flex-col text-left leading-tight">
          <span class="font-mono font-extrabold text-xs text-[#FFCC66] tracking-wide leading-none">${code}</span>
          <span class="text-[9px] text-slate-300 font-medium leading-none mt-0.5">${typeLabel}</span>
        </div>
      </div>
      <!-- Botão Sair (Logout) -->
      <button type="button" id="btn-header-logout" 
              class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-900 border border-rose-200 text-xs font-bold transition shadow-2xs" 
              title="${isEn ? 'Log out of Restricted Area' : 'Terminar Sessão na Área Reservada'}">
        <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
        <span class="hidden sm:inline">${isEn ? 'Sair' : 'Sair'}</span>
      </button>
    `;

    // Vincular evento de Logout
    const logoutBtn = document.getElementById("btn-header-logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => logout());
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  /**
   * Inicializa os event listeners da Tela de Login e Modais
   */
  function initEvents() {
    // 1. Submissão do Formulário de Login
    const form = document.getElementById("auth-login-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const codeSelect = document.getElementById("auth-participant-code");
        const keyInput = document.getElementById("auth-access-key");
        const rgpdChk = document.getElementById("auth-consent-rgpd");
        const errBox = document.getElementById("auth-error-box");

        const code = codeSelect ? codeSelect.value : "";
        const key = keyInput ? keyInput.value : "";
        const consent = rgpdChk ? rgpdChk.checked : false;

        const result = login(code, key, consent);
        if (result.success) {
          if (errBox) {
            errBox.classList.add("hidden");
            errBox.textContent = "";
          }
          const isEn = window.I18nManager && window.I18nManager.isEnglish();
          if (window.showToast) {
            window.showToast(`${isEn ? 'Authenticated as' : 'Sessão iniciada com o código'} ${result.code}!`);
          }
        } else {
          if (errBox) {
            errBox.textContent = result.error;
            errBox.classList.remove("hidden");
          } else {
            alert(result.error);
          }
        }
      });
    }

    // 2. Alternância de visibilidade da Chave de Acesso (Password Show/Hide)
    const toggleKeyBtn = document.getElementById("btn-toggle-key-visibility");
    const keyInput = document.getElementById("auth-access-key");
    if (toggleKeyBtn && keyInput) {
      toggleKeyBtn.addEventListener("click", () => {
        const isPassword = keyInput.type === "password";
        keyInput.type = isPassword ? "text" : "password";
        const icon = toggleKeyBtn.querySelector("i");
        if (icon) {
          icon.setAttribute("data-lucide", isPassword ? "eye-off" : "eye");
          if (window.lucide) window.lucide.createIcons();
        }
      });
    }

    // 3. Modal de Termos de Consentimento RGPD Completo
    const openRgpdBtn = document.getElementById("btn-open-rgpd-modal");
    const closeRgpdBtn = document.getElementById("btn-close-rgpd-modal");
    const rgpdModal = document.getElementById("rgpd-info-modal");

    if (openRgpdBtn && rgpdModal) {
      openRgpdBtn.addEventListener("click", (e) => {
        e.preventDefault();
        rgpdModal.classList.remove("hidden");
      });
    }
    const confirmRgpdBtn = document.getElementById("btn-close-rgpd-confirm");
    if (closeRgpdBtn && rgpdModal) {
      closeRgpdBtn.addEventListener("click", () => {
        rgpdModal.classList.add("hidden");
      });
    }
    if (confirmRgpdBtn && rgpdModal) {
      confirmRgpdBtn.addEventListener("click", () => {
        rgpdModal.classList.add("hidden");
      });
    }
    if (rgpdModal) {
      rgpdModal.addEventListener("click", (e) => {
        if (e.target === rgpdModal) rgpdModal.classList.add("hidden");
      });
    }

    // 4. Seletor de Idioma no Modal de Login
    const authLangSelect = document.getElementById("auth-lang-select");
    if (authLangSelect) {
      if (window.I18nManager) {
        authLangSelect.value = window.I18nManager.getLanguage() || "pt-PT";
      }
      authLangSelect.addEventListener("change", (e) => {
        const selectedLang = e.target.value;
        if (window.I18nManager && typeof window.I18nManager.setLanguage === "function") {
          window.I18nManager.setLanguage(selectedLang);
        }
      });
    }
  }

  /**
   * Inicialização do Módulo de Autenticação
   */
  function init() {
    renderCodesDropdown();
    syncUIWithPhase();
    syncUIWithStatus();

    // Verificação de Acesso:
    // Se o utilizador não tem sessão ativa ou o sistema está em manutenção, bloqueia imediatamente
    if (!isAuthenticated() || getSystemStatus() === "closed") {
      lockWebsite();
    } else {
      unlockWebsite();
      renderHeaderUserBadge();
      const code = getParticipantCode();
      injectParticipantCodeToForms(code);
    }

    initEvents();

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  return {
    init,
    login,
    logout,
    isAuthenticated,
    getUserRole,
    isModerator,
    isModeratorMasterKey,
    getParticipantCode,
    getParticipantType,
    getEffectivePhase,
    setAccessPhase,
    getSystemStatus,
    setSystemStatus,
    validateAccessKey,
    injectParticipantCodeToForms,
    lockWebsite,
    unlockWebsite,
    renderCodesDropdown,
    syncUIWithPhase,
    syncUIWithStatus,
    renderHeaderUserBadge,
    PRESENTIAL_CODES,
    REMOTE_CODES,
    DEFAULT_KEYS,
    STORAGE_KEYS
  };
})();
