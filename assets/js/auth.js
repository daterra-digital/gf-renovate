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
    SESSION_PHASE: "renovate_session_phase",
    ACTIVE_CODES: "renovate_active_codes"
  };

  /**
   * Obtém o conjunto de códigos de participante atualmente em uso por utilizadores com sessão ativa.
   * Quando o utilizador sai (logout), o código volta a ficar disponível.
   */
  function getInUseCodes() {
    const inUse = new Set();
    try {
      // 1. Sessão ativa no browser/dispositivo local
      const isSessionActive = localStorage.getItem(STORAGE_KEYS.SESSION_ACTIVE) === "true";
      const currentCode = localStorage.getItem(STORAGE_KEYS.PARTICIPANT_CODE);
      if (isSessionActive && currentCode) {
        const clean = currentCode.trim().toUpperCase();
        const base = clean.replace(/-MD$/, "");
        inUse.add(clean);
        inUse.add(base);
      }
      // 2. Lista de códigos com sessão ativa em uso
      const activeList = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVE_CODES) || "[]");
      if (Array.isArray(activeList)) {
        activeList.forEach(c => {
          if (c) {
            const raw = String(c).trim().toUpperCase();
            inUse.add(raw);
            inUse.add(raw.replace(/-MD$/, ""));
          }
        });
      }
    } catch (e) {}
    return inUse;
  }

  function addActiveCode(code) {
    if (!code) return;
    try {
      const clean = String(code).trim().toUpperCase();
      const base = clean.replace(/-MD$/, "");
      const activeList = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVE_CODES) || "[]");
      const list = Array.isArray(activeList) ? activeList : [];
      if (!list.includes(clean)) list.push(clean);
      if (!list.includes(base)) list.push(base);
      localStorage.setItem(STORAGE_KEYS.ACTIVE_CODES, JSON.stringify(list));
    } catch (e) {}
  }

  function removeActiveCode(code) {
    if (!code) return;
    try {
      const clean = String(code).trim().toUpperCase();
      const base = clean.replace(/-MD$/, "");
      const activeList = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVE_CODES) || "[]");
      if (Array.isArray(activeList)) {
        const updated = activeList.filter(c => {
          const upper = String(c).trim().toUpperCase();
          return upper !== clean && upper !== base;
        });
        localStorage.setItem(STORAGE_KEYS.ACTIVE_CODES, JSON.stringify(updated));
      }
    } catch (e) {}
  }

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
   * Determina se a aplicação está a correr em ambiente de desenvolvimento local (localhost)
   */
  function isLocalhost() {
    try {
      const host = window.location.hostname;
      return (
        host === "localhost" ||
        host === "127.0.0.1" ||
        host === "[::1]" ||
        host === "" ||
        window.location.protocol === "file:"
      );
    } catch (e) {
      return false;
    }
  }

  /**
   * Obtém o estado do sistema (system_status)
   * Em produção (GitHub Pages), a plataforma está permanentemente aberta para o Grupo Focal.
   * Retorna: 'open' | 'closed'
   */
  function getSystemStatus() {
    // 1. Objeto Global injetado por system-status.js ou poller em segundo plano
    if (window.RENOVATE_SYSTEM_STATUS && typeof window.RENOVATE_SYSTEM_STATUS.status === "string") {
      const globalVal = window.RENOVATE_SYSTEM_STATUS.status.trim().toLowerCase();
      if (globalVal === "closed" || globalVal === "maintenance" || globalVal === "fechado") {
        return "closed";
      }
    }

    // 2. Em localhost, suportar também override ou leitura em localStorage
    if (isLocalhost()) {
      try {
        const status1 = localStorage.getItem(STORAGE_KEYS.SYSTEM_STATUS);
        const status2 = localStorage.getItem(STORAGE_KEYS.SYSTEM_STATUS_ALT);
        const val = (status1 || status2 || "").trim().toLowerCase();
        if (val === "closed" || val === "maintenance" || val === "fechado") {
          return "closed";
        }
      } catch (e) {}
    }

    return "open";
  }

  /**
   * Altera o estado do sistema (Aberto para Testes / Fechado para Manutenção)
   * Reservado exclusivamente ao ambiente de localhost.
   */
  function setSystemStatus(status) {
    if (!isLocalhost()) {
      console.warn("🔒 Controlo de manutenção e kill-switch desativados em produção (GitHub Pages).");
      return;
    }
    const val = status === "closed" || status === "maintenance" ? "closed" : "open";
    try {
      localStorage.setItem(STORAGE_KEYS.SYSTEM_STATUS, val);
      localStorage.setItem(STORAGE_KEYS.SYSTEM_STATUS_ALT, val);
    } catch (e) {
      console.error("Erro ao guardar system_status:", e);
    }
    if (!window.RENOVATE_SYSTEM_STATUS) {
      window.RENOVATE_SYSTEM_STATUS = {};
    }
    window.RENOVATE_SYSTEM_STATUS.status = val;
    window.RENOVATE_SYSTEM_STATUS.updated_at = new Date().toISOString();
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
    if (c.includes("-MD") || c.includes("ADMIN") || getUserRole() === "moderator") return "MOD";
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

    // Identificar códigos de moderação especiais
    const isAdminCode = cleanCode === "ADMIN-FG2" || cleanCode === "ADMIN" || cleanCode === "ADMINFG2" || cleanCode === "MOD-PT01" || cleanCode.startsWith("MOD-");

    // Validação específica para códigos de moderação com palavra-passe incorreta
    if (isAdminCode && !isModKey) {
      return {
        success: false,
        error: isEn
          ? "The moderation code requires the Master Moderator Password (e.g. renovate2026-admin)."
          : "O código de moderação requer a introdução da Palavra-passe Mestra de Moderador (ex.: renovate2026-admin)."
      };
    }

    // 1. Verificar se a plataforma está aberta ou em manutenção
    // Bloqueio estrito em produção (GitHub Pages): sem qualquer possibilidade de acesso com credenciais de participantes.
    // Em localhost: apenas moderador com chave mestra pode aceder para retirar a plataforma de manutenção.
    if (getSystemStatus() === "closed") {
      if (!isLocalhost()) {
        return {
          success: false,
          error: isEn
            ? "The RENOVATE platform is currently closed for technical maintenance. Participant access is strictly suspended on the official website. Maintenance can only be lifted via the local environment."
            : "A plataforma RENOVATE encontra-se atualmente em manutenção técnica. O acesso está estritamente suspenso para todos os participantes no website oficial. O desbloqueio de manutenção só pode ser realizado pela moderação em ambiente local."
        };
      }
      if (!isModKey) {
        return {
          success: false,
          error: isEn
            ? "The platform is closed for technical maintenance. Only the session moderator (admin-fg2) can log in locally to manage the system."
            : "A plataforma encontra-se fechada para manutenção técnica. Apenas o moderador da sessão (admin-fg2) pode aceder em localhost para gerir o sistema."
        };
      }
    }

    // 2. Validação do código de participante
    if (!cleanCode) {
      return {
        success: false,
        error: isEn
          ? "Please type or select your Participant Code from the list."
          : "Por favor escreva ou selecione o seu Código de Participante da lista."
      };
    }

    // Validar se o código pertence à fase ativa ou se é código de moderação
    const phase = getEffectivePhase();
    const validCodes = phase === "phase2" ? REMOTE_CODES : PRESENTIAL_CODES;

    let userRole = "participant";
    let finalCode = cleanCode;

    if (isAdminCode) {
      if (!isModKey) {
        return {
          success: false,
          error: isEn
            ? "The moderation code requires the Master Moderator Password (e.g. renovate2026-admin)."
            : "O código de moderação requer a introdução da Palavra-passe Mestra de Moderador (ex.: renovate2026-admin)."
        };
      }
      userRole = "moderator";
      finalCode = (cleanCode === "ADMIN" || cleanCode === "ADMINFG2" || cleanCode === "ADMIN-FG2")
        ? "ADMIN-FG2"
        : (cleanCode.endsWith("-MD") ? cleanCode : `${cleanCode}-MD`);
    } else {
      if (!validCodes.includes(cleanCode)) {
        return {
          success: false,
          error: phase === "phase2"
            ? (isEn 
                ? "In-person codes (FG2-PT) are closed for new logins. Please enter an assigned remote code (NS-PT) or admin-fg2." 
                : "Os códigos presenciais (FG2-PT) estão encerrados para novos registos. Introduza o seu código remoto (NS-PT) ou admin-fg2.")
            : (isEn 
                ? "Please enter a valid in-person code (FG2-PT01 to FG2-PT50) or admin-fg2." 
                : "Por favor introduza um código presencial válido (FG2-PT01 a FG2-PT50) ou admin-fg2.")
        };
      }

      if (isModKey) {
        // Se utilizou código de participante normal mas introduziu a palavra-passe mestra
        userRole = "moderator";
        finalCode = cleanCode.endsWith("-MD") ? cleanCode : `${cleanCode}-MD`;
      } else {
        if (!validateAccessKey(key)) {
          return {
            success: false,
            error: isEn
              ? "Incorrect Access Key. Please check the session key and try again."
              : "Chave de Acesso incorreta. Por favor verifique a chave do evento e tente novamente."
          };
        }
      }
    }

    // 3.1 Verificação de código atualmente em uso por utilizador com sessão ativa
    const inUseCodes = getInUseCodes();
    if (!isModKey && !isAdminCode && (inUseCodes.has(cleanCode) || inUseCodes.has(`${cleanCode}-MD`))) {
      return {
        success: false,
        error: isEn
          ? `Code ${cleanCode} is currently in use. When the user logs out, it will become available again.`
          : `O código ${cleanCode} já se encontra em uso. Quando o utilizador sair, o código voltará a ficar disponível.`
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

    // Registo oficial de sessão via POST na API Google Apps Script (Alimenta separador Logins e Amostra Total)
    try {
      const loginEndpoint = (window.RENOVATE_CONFIG && window.RENOVATE_CONFIG.resultsDashboard && window.RENOVATE_CONFIG.resultsDashboard.loginApiUrl)
        || "https://script.google.com/macros/s/AKfycbzeV5PPgK8MNn0y1MIYAcf8VWzgAA-Dd80WtF2EASy5FPpRs-BZni-TKNGC_Vafx8VU/exec";
      const loginPayload = JSON.stringify({ code: finalCode });

      // Disparo em background com tolerância a CORS / 302 redirects do Google Apps Script
      fetch(loginEndpoint, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: loginPayload
      }).catch(() => {
        fetch(loginEndpoint, {
          method: "POST",
          mode: "no-cors",
          body: loginPayload
        }).catch(err => console.warn("Aviso ao registar login no Google Apps Script:", err));
      });
    } catch (gasErr) {
      console.warn("Aviso ao disparar registo de login:", gasErr);
    }

    // Marcar código como ativo em uso
    addActiveCode(finalCode);

    // 3. Injeção nos formulários de avaliação com o código final (incluindo sufixo -MD se moderador)
    injectParticipantCodeToForms(finalCode);
    if (window.LiveSession && typeof window.LiveSession.setParticipantCode === "function") {
      window.LiveSession.setParticipantCode(finalCode);
    }

    // Registo do código no rastreador automático de participantes (não contabiliza códigos de moderação genéricos como admin-fg2)
    if (!isAdminCode && window.SubmissionsTracker && typeof window.SubmissionsTracker.registerParticipantCode === "function") {
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

  let isLoggingOut = false;

  /**
   * Encerra a sessão do utilizador e bloqueia o website
   */
  function logout(skipConfirm = false) {
    if (isLoggingOut) return;
    isLoggingOut = true;

    try {
      const isEn = window.I18nManager && window.I18nManager.isEnglish();
      if (!skipConfirm) {
        const confirmMsg = isEn
          ? "Do you really want to log out and lock access to the RENOVATE Restricted Area?"
          : "Deseja realmente terminar a sua sessão e bloquear o acesso à Área Reservada RENOVATE?";
        let proceed = true;
        try {
          proceed = confirm(confirmMsg);
        } catch (e) {
          proceed = true;
        }
        if (!proceed) {
          isLoggingOut = false;
          return;
        }
      }

      // Libertar código de participante para voltar a ficar disponível
      const currentCode = getParticipantCode();
      if (currentCode) {
        removeActiveCode(currentCode);
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

      // Limpar prefill dos formulários e sincronizar LiveSession
      injectParticipantCodeToForms("");
      if (window.LiveSession && typeof window.LiveSession.setParticipantCode === "function") {
        window.LiveSession.setParticipantCode("");
      }

      // Bloquear website e reabrir tela de login
      lockWebsite();
      renderCodesDropdown();
      renderHeaderUserBadge();
      if (window.updateNavVisibility) {
        window.updateNavVisibility();
      }

      if (window.showToast) {
        window.showToast(isEn ? "Session ended. Access locked." : "Sessão terminada. Acesso reservado bloqueado.");
      }
    } finally {
      isLoggingOut = false;
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

    // 2. Injeção direta em todos os seletores e links do website com parâmetros oficiais (?usp=pp_url&entry.FIELD_ID=CODE)
    const url1 = (window.LiveSession && typeof window.LiveSession.getPrefilledFormUrl === "function")
      ? window.LiveSession.getPrefilledFormUrl(1, activeCode)
      : (activeCode 
          ? `https://docs.google.com/forms/d/e/1FAIpQLScAwHNGoYqikgsHwTOgKWC80l0F9b3S-kgXEbyCjxxjv_fTUQ/viewform?usp=pp_url&entry.1909349741=${encodeURIComponent(activeCode)}`
          : "https://docs.google.com/forms/d/e/1FAIpQLScAwHNGoYqikgsHwTOgKWC80l0F9b3S-kgXEbyCjxxjv_fTUQ/viewform");

    const url2 = (window.LiveSession && typeof window.LiveSession.getPrefilledFormUrl === "function")
      ? window.LiveSession.getPrefilledFormUrl(2, activeCode)
      : (activeCode 
          ? `https://docs.google.com/forms/d/e/1FAIpQLSeyF3Ty9bzdw1oexKLsX2dC3StkoeUW7AyeFBPDVY6sU6OPmQ/viewform?usp=pp_url&entry.576387166=${encodeURIComponent(activeCode)}`
          : "https://docs.google.com/forms/d/e/1FAIpQLSeyF3Ty9bzdw1oexKLsX2dC3StkoeUW7AyeFBPDVY6sU6OPmQ/viewform");

    const url3 = (window.LiveSession && typeof window.LiveSession.getPrefilledFormUrl === "function")
      ? window.LiveSession.getPrefilledFormUrl(3, activeCode)
      : (activeCode 
          ? `https://docs.google.com/forms/d/e/1FAIpQLSc1tR_sfcQMqXjd26UGfwyjLInt1fJw2IMM2ERXJAyjfdT1LA/viewform?usp=pp_url&entry.208145689=${encodeURIComponent(activeCode)}`
          : "https://docs.google.com/forms/d/e/1FAIpQLSc1tR_sfcQMqXjd26UGfwyjLInt1fJw2IMM2ERXJAyjfdT1LA/viewform");

    document.querySelectorAll("#btn-form-2, .form-link-game").forEach(el => { el.href = url1; });
    document.querySelectorAll("#btn-form-3, .form-link-sim").forEach(el => { el.href = url2; });
    document.querySelectorAll("#btn-form-global, .form-link-global").forEach(el => { el.href = url3; });

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
      if (typeof homeLogo.removeAttribute === "function") {
        homeLogo.removeAttribute("target");
        homeLogo.removeAttribute("rel");
      }
      homeLogo.title = "Página Inicial - Sessão ao Vivo";
    }
  }

  /**
   * Renderiza a lista de opções do painel dropdown do combobox de códigos
   */
  function renderCodesDropdown(filterText = "") {
    const input = document.getElementById("auth-participant-code");
    const panel = document.getElementById("auth-codes-dropdown-panel");
    if (!panel) return;

    const phase = getEffectivePhase();
    const codes = phase === "phase2" ? REMOTE_CODES : PRESENTIAL_CODES;
    const isEn = window.I18nManager && window.I18nManager.isEnglish();
    const filter = (filterText || "").trim().toUpperCase();

    // Obter códigos atualmente em uso por utilizadores com sessão ativa
    const inUseCodes = getInUseCodes();

    const inUseLabel = isEn ? "In use" : "Em uso";
    const availableLabel = isEn ? "Available" : "Disponível";
    const modTitle = isEn ? "Moderation & Coordination" : "Moderação & Coordenação";
    const phaseTitle = phase === "phase2"
      ? (isEn ? "External / Remote Stakeholders (NS-PT)" : "Participantes Remotos / Stakeholders (NS-PT)")
      : (isEn ? "In-Person Badges (FG2-PT)" : "Crachás Presenciais (FG2-PT)");

    let html = "";

    // 1. Grupo Moderação & Coordenação
    // Em localhost: sempre disponível na lista para testes de desenvolvimento.
    // Em produção (GitHub Pages): apenas surge se o utilizador pesquisar explicitamente "admin" ou "mod",
    // para garantir que participantes comuns vejam exclusivamente crachás de participantes ao abrir a lista.
    const isLocal = isLocalhost();
    const shouldShowModGroup = isLocal || filter.includes("ADMIN") || filter.includes("MOD");

    const modCodes = [
      { code: "admin-fg2", label: isEn ? "admin-fg2 (Moderator Access)" : "admin-fg2 (Acesso de Moderador)" },
      { code: "MOD-PT01", label: isEn ? "MOD-PT01 (Coordination)" : "MOD-PT01 (Coordenação)" }
    ];
    const filteredModCodes = shouldShowModGroup
      ? modCodes.filter(m => !filter || m.code.toUpperCase().includes(filter) || "ADMIN".includes(filter) || "MOD".includes(filter))
      : [];

    if (filteredModCodes.length > 0) {
      html += `<div class="px-3 py-1.5 bg-amber-50 text-[10px] font-black uppercase tracking-wider text-amber-900 flex items-center justify-between border-b border-amber-100">`;
      html += `  <span class="flex items-center gap-1.5"><i data-lucide="shield" class="w-3 h-3 text-amber-700"></i> ${modTitle}</span>`;
      html += `  <span class="text-[9px] font-mono font-bold text-amber-800">Master Pass</span>`;
      html += `</div>`;
      html += `<div class="py-1">`;
      filteredModCodes.forEach(m => {
        html += `
          <div class="code-dropdown-item px-3 py-2 hover:bg-amber-100/70 cursor-pointer flex items-center justify-between transition text-xs font-mono font-bold text-amber-950" data-code="${m.code}">
            <span class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-amber-500"></span>
              ${m.label}
            </span>
            <span class="text-[10px] font-sans font-extrabold px-2 py-0.5 rounded bg-amber-200 text-amber-900 border border-amber-300">Moderação</span>
          </div>
        `;
      });
      html += `</div>`;
    }

    // 2. Grupo Participantes Ativos
    const filteredCodes = codes.filter(c => !filter || c.toUpperCase().includes(filter));
    html += `<div class="px-3 py-1.5 bg-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-700 flex items-center justify-between border-t border-b border-slate-200">`;
    html += `  <span>${phaseTitle}</span>`;
    html += `  <span class="text-[9px] font-mono text-slate-500">${filteredCodes.length} ${isEn ? "items" : "códigos"}</span>`;
    html += `</div>`;
    html += `<div class="py-1">`;

    if (filteredCodes.length === 0 && filteredModCodes.length === 0) {
      html += `
        <div class="px-4 py-4 text-center text-slate-500 font-sans text-xs space-y-1">
          <p class="font-bold">${isEn ? `No codes match "${filterText}"` : `Nenhum código corresponde a "${filterText}"`}</p>
          <p class="text-[11px] text-slate-400">${isEn ? 'You can keep typing your code or choose another.' : 'Pode continuar a escrever o código livremente.'}</p>
        </div>
      `;
    } else {
      filteredCodes.forEach(code => {
        const isInUse = inUseCodes.has(code) || inUseCodes.has(`${code}-MD`);
        if (isInUse) {
          // Desativado e estilizado a cinzento, não selecionável enquanto em uso por utilizador ativo
          html += `
            <div class="code-dropdown-item px-3 py-2 bg-slate-50/80 text-slate-400 cursor-not-allowed flex items-center justify-between select-none border-b border-slate-50 opacity-60" data-disabled="true" data-code="${code}">
              <span class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-slate-300"></span>
                <span class="line-through">${code}</span>
              </span>
              <span class="text-[10px] font-sans font-semibold text-slate-400">(${inUseLabel})</span>
            </div>
          `;
        } else {
          html += `
            <div class="code-dropdown-item px-3 py-2 hover:bg-slate-100 cursor-pointer flex items-center justify-between text-slate-900 transition border-b border-slate-50 text-xs font-mono font-bold" data-code="${code}">
              <span class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                ${code}
              </span>
              <span class="text-[10px] font-sans font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">${availableLabel}</span>
            </div>
          `;
        }
      });
    }
    html += `</div>`;

    panel.innerHTML = html;

    // Vincular clique aos itens selecionáveis
    panel.querySelectorAll(".code-dropdown-item").forEach(item => {
      if (item.getAttribute("data-disabled") === "true") return;
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        const codeVal = item.getAttribute("data-code");
        if (input && codeVal) {
          input.value = codeVal;
        }
        hideCodesDropdown();
        // Focar no campo de senha/chave
        const keyInput = document.getElementById("auth-access-key");
        if (keyInput) keyInput.focus();
      });
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function showCodesDropdown() {
    const panel = document.getElementById("auth-codes-dropdown-panel");
    const chevron = document.getElementById("auth-code-chevron");
    const input = document.getElementById("auth-participant-code");
    if (!panel) return;
    renderCodesDropdown(input ? input.value : "");
    panel.classList.remove("hidden");
    if (chevron) {
      chevron.classList.add("rotate-180");
    }
  }

  function hideCodesDropdown() {
    const panel = document.getElementById("auth-codes-dropdown-panel");
    const chevron = document.getElementById("auth-code-chevron");
    if (panel) {
      panel.classList.add("hidden");
    }
    if (chevron) {
      chevron.classList.remove("rotate-180");
    }
  }

  function toggleCodesDropdown() {
    const panel = document.getElementById("auth-codes-dropdown-panel");
    if (panel && panel.classList.contains("hidden")) {
      showCodesDropdown();
    } else {
      hideCodesDropdown();
    }
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
    const maintNotice = document.getElementById("auth-maintenance-notice");
    const formContainer = document.getElementById("auth-form-fields");
    const submitBtn = document.getElementById("btn-auth-submit");
    const codeInput = document.getElementById("auth-participant-code");
    const keyInput = document.getElementById("auth-access-key");
    const rgpdInput = document.getElementById("auth-consent-rgpd");
    const phaseBadge = document.getElementById("auth-phase-badge");
    const phase2Notice = document.getElementById("auth-phase2-notice");
    const isLocal = isLocalhost();
    const isEn = window.I18nManager && window.I18nManager.isEnglish();

    // O botão de atalho "Entrar como Moderador (admin-fg2)" só deve estar disponível em localhost
    const bypassContainer = document.getElementById("auth-maint-mod-bypass-container");
    if (bypassContainer) {
      if (isLocal && status === "closed") {
        bypassContainer.classList.remove("hidden");
        bypassContainer.style.display = "";
      } else {
        bypassContainer.classList.add("hidden");
        bypassContainer.style.display = "none";
      }
    }

    if (status === "closed") {
      if (maintNotice) maintNotice.classList.remove("hidden");

      // Em produção (GitHub Pages):
      // Quando em manutenção, não deve mostrar "Código de Participante", "Chave de Acesso" e a checkbox do RGPD.
      // O botão "Entrar na Área Reservada" deverá ser "Sair".
      if (!isLocal) {
        if (formContainer) {
          formContainer.classList.add("hidden");
          formContainer.style.display = "none";
        }
        if (phaseBadge) phaseBadge.classList.add("hidden");
        if (phase2Notice) phase2Notice.classList.add("hidden");

        // Remover obrigatoriedade dos campos para permitir clique no botão Sair
        if (codeInput) codeInput.removeAttribute("required");
        if (keyInput) keyInput.removeAttribute("required");
        if (rgpdInput) rgpdInput.removeAttribute("required");

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.className = "w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white text-sm font-extrabold border border-slate-800 transition flex items-center justify-center gap-2 shadow-md cursor-pointer";
          submitBtn.innerHTML = `
            <i data-lucide="log-out" class="w-4 h-4"></i>
            <span data-i18n="auth.exitBtn">${isEn ? "Exit" : "Sair"}</span>
          `;
        }
      } else {
        // Em Localhost: moderador precisa de poder introduzir as credenciais para gerir e reabrir
        if (formContainer) {
          formContainer.classList.remove("hidden");
          formContainer.style.display = "";
          formContainer.classList.remove("opacity-50", "pointer-events-none");
        }
        if (codeInput) codeInput.setAttribute("required", "required");
        if (keyInput) keyInput.setAttribute("required", "required");
        if (rgpdInput) rgpdInput.setAttribute("required", "required");

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.className = "w-full py-3 px-4 rounded-xl bg-[#FFCC66] hover:bg-[#FBBF24] active:scale-[0.99] text-[#0F172A] text-sm font-extrabold border border-slate-900 transition flex items-center justify-center gap-2 shadow-md cursor-pointer";
          submitBtn.innerHTML = `
            <i data-lucide="log-in" class="w-4 h-4"></i>
            <span data-i18n="auth.enterBtn">${isEn ? "Enter Restricted Area" : "Entrar na Área Reservada"}</span>
          `;
        }
      }

      // Se a plataforma estiver fechada:
      // Em produção (GitHub Pages): bloqueio de 100% de acessos sem exceções
      // Em localhost: moderador com sessão ativa não é bloqueado
      if (!isLocal || !isModerator()) {
        const modal = document.getElementById("auth-login-modal");
        if (modal && modal.classList.contains("hidden")) {
          modal.classList.remove("hidden");
          document.body.classList.add("auth-locked");
          document.documentElement.classList.add("auth-locked");
        }
      }
    } else {
      // Plataforma Aberta
      if (maintNotice) maintNotice.classList.add("hidden");
      if (formContainer) {
        formContainer.classList.remove("hidden");
        formContainer.style.display = "";
        formContainer.classList.remove("opacity-50", "pointer-events-none");
      }
      if (phaseBadge) phaseBadge.classList.remove("hidden");
      if (codeInput) codeInput.setAttribute("required", "required");
      if (keyInput) keyInput.setAttribute("required", "required");
      if (rgpdInput) rgpdInput.setAttribute("required", "required");

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.className = "w-full py-3 px-4 rounded-xl bg-[#FFCC66] hover:bg-[#FBBF24] active:scale-[0.99] text-[#0F172A] text-sm font-extrabold border border-slate-900 transition flex items-center justify-center gap-2 shadow-md cursor-pointer";
        submitBtn.innerHTML = `
          <i data-lucide="log-in" class="w-4 h-4"></i>
          <span data-i18n="auth.enterBtn">${isEn ? "Enter Restricted Area" : "Entrar na Área Reservada"}</span>
        `;
      }
    }

    if (window.lucide) {
      window.lucide.createIcons();
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
    let avatarBg = "bg-amber-400 text-slate-900";
    if (isMOD) {
      typeLabel = isEn ? "Moderator" : "Moderador";
    }

    const groupTag = isMOD ? "MOD" : (isFG2 ? "FG2" : type);

    container.className = "flex items-center pl-1 sm:pl-2 shrink-0 animate-fadeIn";
    container.innerHTML = `
      <!-- Novo Componente Integrado: Cartão do Utilizador + Botão 'Sair' -->
      <div id="header-user-card" data-action="logout"
           class="flex flex-col bg-slate-900 rounded-xl overflow-hidden shadow-xs border border-slate-800 shrink-0 cursor-pointer select-none transition hover:border-slate-700 hover:shadow-md group"
           title="${isEn ? 'Click card or button to Log Out' : 'Clique no cartão ou no botão para Terminar Sessão'}">
        
        <!-- Linha Superior: Dados do Perfil -->
        <div class="flex items-center gap-1.5 px-2.5 py-1.5 pointer-events-none">
          <!-- Círculo/Avatar amarelo com a sigla do grupo (ex: FG2) -->
          <div class="w-6 h-6 rounded-full ${avatarBg} font-bold text-[10px] tracking-tight flex items-center justify-center shrink-0 shadow-xs ring-1 ring-slate-800">
            ${groupTag}
          </div>
          <!-- Código do participante em destaque e Sub-etiqueta -->
          <div class="flex flex-col text-left leading-tight pr-0.5">
            <span class="font-mono font-extrabold text-xs text-amber-300 tracking-wide leading-none">${code}</span>
            <span class="text-[9px] text-slate-300 font-medium leading-none mt-0.5">${typeLabel}</span>
          </div>
        </div>

        <!-- Aba Inferior Integrada (Botão Sair: proporção estrita 25-30%, h-5, flex-none) -->
        <button type="button" id="btn-header-logout" data-action="logout"
                class="w-full flex-none shrink-0 h-5 bg-red-600 hover:bg-red-700 group-hover:bg-red-700 text-white font-bold text-[10px] leading-none px-2 flex items-center justify-center gap-1 transition cursor-pointer border-t border-red-700/50">
          <i data-lucide="log-out" class="w-2.5 h-2.5 text-white pointer-events-none"></i>
          <span class="pointer-events-none">${isEn ? 'Log Out' : 'Sair'}</span>
        </button>
      </div>
    `;

    // Comportamento de Clique/Toque Tátil Seguro e Imediato (Desktop + Mobile)
    let lastLogoutTrigger = 0;
    function triggerLogoutSafe(e) {
      if (Date.now() - lastLogoutTrigger < 600) return;
      lastLogoutTrigger = Date.now();
      if (e) {
        if (typeof e.preventDefault === "function") e.preventDefault();
        if (typeof e.stopPropagation === "function") e.stopPropagation();
      }
      logout();
    }

    const card = document.getElementById("header-user-card");
    const logoutBtn = document.getElementById("btn-header-logout");

    if (logoutBtn) {
      logoutBtn.addEventListener("touchend", triggerLogoutSafe, { passive: false });
      logoutBtn.addEventListener("click", triggerLogoutSafe);
    }
    if (card) {
      card.addEventListener("touchend", triggerLogoutSafe, { passive: false });
      card.addEventListener("click", triggerLogoutSafe);
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
    const submitBtnEl = document.getElementById("btn-auth-submit");

    if (submitBtnEl) {
      submitBtnEl.addEventListener("click", (e) => {
        if (getSystemStatus() === "closed" && !isLocalhost()) {
          e.preventDefault();
          window.location.href = "https://renovateproject.eu/";
        }
      });
    }

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Em produção (GitHub Pages) durante manutenção, o botão é "Sair" e redireciona para o site oficial
        if (getSystemStatus() === "closed" && !isLocalhost()) {
          window.location.href = "https://renovateproject.eu/";
          return;
        }
        const codeInput = document.getElementById("auth-participant-code");
        const keyInput = document.getElementById("auth-access-key");
        const rgpdChk = document.getElementById("auth-consent-rgpd");
        const errBox = document.getElementById("auth-error-box");

        const code = codeInput ? codeInput.value : "";
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

    // 1.0 Scroll Suave Automático no Foco (Prevenção de sobreposição pelo teclado virtual em mobile)
    const loginInputs = document.querySelectorAll('#auth-login-form input');
    loginInputs.forEach(input => {
      input.addEventListener('focus', (e) => {
        setTimeout(() => {
          if (e.target && typeof e.target.scrollIntoView === 'function') {
            e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 300); // Aguarda a animação de subida do teclado virtual
      });
    });

    // 1.1 Combobox do Código de Participante (Input Pesquisável + Dropdown)
    const codeInput = document.getElementById("auth-participant-code");
    const toggleDropdownBtn = document.getElementById("btn-toggle-codes-dropdown");
    const comboboxWrapper = document.getElementById("auth-code-combobox-wrapper");

    if (codeInput) {
      codeInput.addEventListener("focus", () => {
        showCodesDropdown();
      });
      codeInput.addEventListener("input", (e) => {
        showCodesDropdown();
        renderCodesDropdown(e.target.value);
      });
      codeInput.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          hideCodesDropdown();
        }
      });
    }

    if (toggleDropdownBtn) {
      toggleDropdownBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleCodesDropdown();
        if (codeInput) codeInput.focus();
      });
    }

    // Fechar dropdown ao clicar fora do combobox
    document.addEventListener("click", (e) => {
      if (comboboxWrapper && !comboboxWrapper.contains(e.target)) {
        hideCodesDropdown();
      }
    });

    // 1.2 Botão Fast-Track de Moderador no Aviso de Manutenção
    const modBypassBtn = document.getElementById("btn-auth-maint-mod-bypass");
    if (modBypassBtn) {
      modBypassBtn.addEventListener("click", () => {
        if (codeInput) {
          codeInput.value = "admin-fg2";
        }
        const rgpdChk = document.getElementById("auth-consent-rgpd");
        if (rgpdChk) rgpdChk.checked = true;
        const keyInput = document.getElementById("auth-access-key");
        if (keyInput) {
          keyInput.focus();
          keyInput.classList.add("ring-2", "ring-[#FFCC66]");
          setTimeout(() => keyInput.classList.remove("ring-2", "ring-[#FFCC66]"), 1200);
        }
        hideCodesDropdown();
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

    // 5. Delegação global de cliques para botões de Logout (Cabeçalho e Passo 1) - registada uma única vez
    bindGlobalLogoutListener();
  }

  let hasBoundLogoutListener = false;
  let lastGlobalLogoutTrigger = 0;

  /**
   * Regista a delegação global de eventos de Logout uma única vez durante o ciclo de vida da aplicação
   */
  function bindGlobalLogoutListener() {
    if (hasBoundLogoutListener) return;
    hasBoundLogoutListener = true;

    function handleGlobalLogout(e) {
      const btn = e.target && e.target.closest && e.target.closest("#header-user-card, #btn-header-logout, #btn-step1-logout, [data-action='logout']");
      if (btn) {
        if (Date.now() - lastGlobalLogoutTrigger < 600) return;
        lastGlobalLogoutTrigger = Date.now();
        if (typeof e.preventDefault === "function") e.preventDefault();
        if (typeof e.stopPropagation === "function") e.stopPropagation();
        logout();
      }
    }

    document.addEventListener("touchend", handleGlobalLogout, { passive: false });
    document.addEventListener("click", handleGlobalLogout);
  }

  /**
   * Monitorização periódica em segundo plano do estado do sistema via system-status.json
   */
  function startStatusPoller() {
    let lastKnownStatus = getSystemStatus();

    const fetchStatus = async () => {
      try {
        const res = await fetch(`system-status.json?_t=${Date.now()}`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.status) {
          const fetchedStatus = (data.status === "closed" || data.status === "maintenance") ? "closed" : "open";
          
          if (!window.RENOVATE_SYSTEM_STATUS) {
            window.RENOVATE_SYSTEM_STATUS = {};
          }
          window.RENOVATE_SYSTEM_STATUS.status = fetchedStatus;
          window.RENOVATE_SYSTEM_STATUS.updated_at = data.updated_at;

          const changed = fetchedStatus !== lastKnownStatus;
          lastKnownStatus = fetchedStatus;

          syncUIWithStatus();
          if (window.ModeratorPanel && typeof window.ModeratorPanel.renderAccessControls === "function") {
            window.ModeratorPanel.renderAccessControls();
          }

          if (fetchedStatus === "closed") {
            // Em GitHub Pages bloqueia imediatamente sem exceção
            // Em localhost bloqueia participantes mas mantém moderadores
            if (!isLocalhost() || !isModerator()) {
              lockWebsite();
              if (changed) {
                const isEn = window.I18nManager && window.I18nManager.isEnglish();
                if (window.showToast) {
                  window.showToast(isEn 
                    ? "The platform has entered technical maintenance mode." 
                    : "A plataforma entrou em modo de manutenção técnica.");
                }
              }
            }
          } else if (changed) {
            const isEn = window.I18nManager && window.I18nManager.isEnglish();
            if (window.showToast) {
              window.showToast(isEn ? "The platform is now open for testing!" : "A plataforma está aberta para testes!");
            }
          }
        }
      } catch (e) {
        // Silencioso em caso de indisponibilidade momentânea de rede
      }
    };

    // Verificação instantânea logo no arranque sem atraso
    fetchStatus();
    setInterval(fetchStatus, 8000);
  }

  /**
   * Inicialização do Módulo de Autenticação
   */
  function init() {
    // Limpar listas legadas de bloqueio permanente para garantir que códigos não fiquem retidos
    try {
      localStorage.removeItem(STORAGE_KEYS.REGISTERED_PARTICIPANTS);
    } catch (e) {}

    renderCodesDropdown();
    syncUIWithPhase();
    syncUIWithStatus();

    // Verificação de Acesso:
    // Se o utilizador não tem sessão ativa OU se o sistema está fechado (e não é moderador em localhost), bloqueia
    if (!isAuthenticated() || (getSystemStatus() === "closed" && (!isLocalhost() || !isModerator()))) {
      lockWebsite();
    } else {
      unlockWebsite();
      renderHeaderUserBadge();
      const code = getParticipantCode();
      injectParticipantCodeToForms(code);
    }

    initEvents();
    startStatusPoller();

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
    isLocalhost,
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
