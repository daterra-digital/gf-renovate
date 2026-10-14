/**
 * RENOVATE FG2 - Aplicação Principal (SPA Router & UI Handler)
 */

document.addEventListener("DOMContentLoaded", () => {
  // 0. Inicializar Gestor de Idioma (i18n)
  if (window.I18nManager) {
    window.I18nManager.init();
  }

  // 0.1 Inicializar Módulo de Autenticação & Controlo de Acessos
  if (window.AuthModule) {
    window.AuthModule.init();
  }

  // 1. Inicializar LiveSession
  LiveSession.init();

  // 2. Inicializar Router de Tabs
  initTabNavigation();

  // 3. Renderizar Componentes Dinâmicos (Programa, GF1, Resultados, Parceiros)
  renderSchedule();
  renderGF1();
  renderSessionGallery();
  initSessionGalleryFilters();
  renderQuestionnaireGuide();
  renderResultsAndMedia();
  renderPartners();
  initVideoSlider();

  // Injetar código nos links dinâmicos do programa
  if (window.AuthModule) {
    window.AuthModule.injectParticipantCodeToForms();
  }

  // 4. Inicializar Dashboard de Resultados (Google Sheets, Chart.js & WordCloud)
  if (window.ResultsDashboard && typeof window.ResultsDashboard.init === "function") {
    window.ResultsDashboard.init();
  }

  // 4.1 Inicializar Rastreador de Submissões e Contadores Automáticos em Tempo Real
  if (window.SubmissionsTracker) {
    window.SubmissionsTracker.init();
  }

  // 5. Inicializar Modais e Event Listeners
  initModeratorModal();
  initParticipantCodeEvents();
  initGF1LightboxEvents();

  // 6. Inicializar Ícones Lucide
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 7. Aplicar modo de apresentação dinâmico se ativo
  if (typeof applyPresentationModeUI === "function") {
    applyPresentationModeUI();
  }
});

// Keep-Alive & Reconnect ao alternar separadores no browser
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    try {
      if (typeof firebase !== "undefined" && firebase.database) {
        firebase.database().goOnline();
      }
    } catch (e) {
      console.warn("Aviso ao reconectar Firebase via visibilitychange no app.js:", e);
    }
  }
});

/**
 * Gestão de Tabs da SPA com suporte a Hash na URL (#live, #program, #fg1, #results)
 */
function initTabNavigation() {
  const tabs = ["live", "program", "fg1", "results", "moderation"];
  const navButtons = document.querySelectorAll(".nav-tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  function switchTab(rawTab) {
    let targetTab = (rawTab || "").trim().toLowerCase();
    // Normalizar aliases (ex: gf1 -> fg1)
    if (targetTab === "gf1") targetTab = "fg1";

    // Se o utilizador tentar aceder à aba de moderação sem perfil de moderador, redirecionar para live
    if (targetTab === "moderation") {
      const isMod = window.AuthModule && typeof window.AuthModule.isModerator === "function" && window.AuthModule.isModerator();
      if (!isMod) {
        targetTab = "live";
      }
    }

    if (!tabs.includes(targetTab)) targetTab = "live";

    // Atualizar Botões de Navegação
    navButtons.forEach(btn => {
      let btnTab = (btn.getAttribute("data-tab") || "").trim().toLowerCase();
      if (btnTab === "gf1") btnTab = "fg1";

      if (btnTab === targetTab) {
        btn.classList.add("bg-[#F5B842]", "text-[#0F172A]", "border-slate-900", "font-extrabold", "shadow-sm");
        btn.classList.remove("text-slate-600", "hover:bg-slate-100", "border-transparent", "font-semibold");
      } else {
        btn.classList.remove("bg-[#F5B842]", "text-[#0F172A]", "border-slate-900", "font-extrabold", "shadow-sm");
        btn.classList.add("text-slate-600", "hover:bg-slate-100", "border-transparent", "font-semibold");
      }
    });

    // Atualizar Conteúdo dos Painéis (#content-live, #content-program, #content-fg1, #content-results)
    tabPanes.forEach(pane => {
      const paneId = pane.id;
      const isTarget = paneId === `content-${targetTab}` || 
                       paneId === `tab-${targetTab}` || 
                       (targetTab === "fg1" && (paneId === "content-fg1" || paneId === "tab-gf1" || paneId === "content-gf1"));

      if (isTarget) {
        pane.classList.remove("hidden");
        pane.classList.add("animate-fadeIn");
      } else {
        pane.classList.add("hidden");
        pane.classList.remove("animate-fadeIn");
      }
    });

    // Redimensionar e atualizar gráficos se a tab selecionada for 'results'
    if (targetTab === "results") {
      if (window.ResultsDashboard && typeof window.ResultsDashboard.onTabShown === "function") {
        window.ResultsDashboard.onTabShown();
      }
      initVideoSlider();
    }

    // Garantir renderização imediata do GF1 ao abrir a aba
    if (targetTab === "fg1") {
      renderGF1();
      renderSessionGallery();
      const mainPlayer = document.getElementById("main-video-player");
      if (mainPlayer) {
        const targetSrc = mainPlayer.getAttribute("data-src") || "https://www.youtube.com/embed/nWiqYTdcrzk";
        if (!mainPlayer.dataset.loadedVisible || !mainPlayer.src || mainPlayer.src === "" || mainPlayer.src === window.location.href) {
          mainPlayer.dataset.loadedVisible = "true";
          mainPlayer.src = targetSrc;
        }
      }
    }

    // Garantir renderização e sincronização imediata dos controlos de moderação
    if (targetTab === "moderation" && window.ModeratorPanel && typeof window.ModeratorPanel.renderAllModeratorControls === "function") {
      window.ModeratorPanel.renderAllModeratorControls();
    }

    // Atualizar Hash sem scroll forçado
    if (window.location.hash !== `#${targetTab}`) {
      history.replaceState(null, null, `#${targetTab}`);
    }

    // Atualizar contadores em tempo real nos painéis e dropdowns
    if (window.SubmissionsTracker && typeof window.SubmissionsTracker.updateAllCounters === "function") {
      window.SubmissionsTracker.updateAllCounters();
    }

    // Scroll para o topo suave
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Atualizar ícones
    if (window.lucide) window.lucide.createIcons();
  }

  // Event Listeners nos botões de navegação
  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab");
      switchTab(target);
    });
  });

  // Botão Home no logótipo RENOVATE do Header
  const homeLogo = document.getElementById("nav-logo-home");
  if (homeLogo) {
    homeLogo.addEventListener("click", (e) => {
      const isAuth = window.AuthModule && window.AuthModule.isAuthenticated();
      if (!isAuth) {
        // Antes do utilizador fazer login, o clique no logótipo abre o website oficial https://renovateproject.eu/
        return; // Permite a navegação normal externa (target="_blank")
      }
      // Depois do utilizador fazer login, leva o utilizador para a home do website
      e.preventDefault();
      switchTab("live");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Botão "Ver Slides no Programa" no Cartão do Passo 2 (Tab 1)
  const gotoSlidesBtn = document.getElementById("btn-goto-slides");
  if (gotoSlidesBtn) {
    gotoSlidesBtn.addEventListener("click", () => {
      switchTab("program");
      const slot2Details = document.getElementById("slot-2-details");
      if (slot2Details) {
        document.querySelectorAll(".schedule-accordion").forEach(d => {
          if (d !== slot2Details) d.open = false;
        });
        slot2Details.open = true;
        localStorage.setItem("renovate_last_open_slot", "slot-2");
        setTimeout(() => {
          slot2Details.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 150);
      }
    });
  }

  // Botão "Projetar QR Code" na Aba de Moderação
  const modProjectorBtn = document.getElementById("btn-mod-tab-projector");
  if (modProjectorBtn) {
    modProjectorBtn.addEventListener("click", () => {
      if (window.ModeratorPanel && typeof window.ModeratorPanel.openQrProjection === "function") {
        window.ModeratorPanel.openQrProjection();
      }
    });
  }

  // Sincronizar visibilidade do separador de Moderação consoante o perfil
  updateNavVisibility();

  // Ler hash inicial ou usar ?tab=X
  const urlParams = new URLSearchParams(window.location.search);
  const tabParam = urlParams.get("tab");
  const initialHash = window.location.hash.replace("#", "");

  if (tabParam) {
    switchTab(tabParam);
  } else if (initialHash) {
    switchTab(initialHash);
  } else {
    switchTab("live");
  }

  // Exposicao de switchTab para navegacao programatica
  window.switchTab = switchTab;

  window.addEventListener("hashchange", () => {
    const newHash = window.location.hash.replace("#", "");
    if (newHash) {
      switchTab(newHash);
    }
  });
}

/**
 * Atualiza a visibilidade dos separadores e menus de Moderação consoante o perfil do utilizador
 */
function updateNavVisibility() {
  const isMod = window.AuthModule && typeof window.AuthModule.isModerator === "function" && window.AuthModule.isModerator();
  const desktopModTab = document.getElementById("nav-tab-moderation");
  const mobileModTab = document.getElementById("mobile-nav-tab-moderation");
  const mobileNavGrid = document.getElementById("mobile-nav-grid");

  if (desktopModTab) {
    if (isMod) {
      desktopModTab.classList.remove("hidden");
      desktopModTab.classList.add("inline-flex");
    } else {
      desktopModTab.classList.add("hidden");
      desktopModTab.classList.remove("inline-flex");
    }
  }

  if (mobileModTab) {
    if (isMod) {
      mobileModTab.classList.remove("hidden");
      mobileModTab.classList.add("flex");
    } else {
      mobileModTab.classList.add("hidden");
      mobileModTab.classList.remove("flex");
    }
  }

  if (mobileNavGrid) {
    if (isMod) {
      mobileNavGrid.classList.remove("grid-cols-4");
      mobileNavGrid.classList.add("grid-cols-5");
    } else {
      mobileNavGrid.classList.remove("grid-cols-5");
      mobileNavGrid.classList.add("grid-cols-4");
    }
  }

  const currentHash = (window.location && typeof window.location.hash === "string") ? window.location.hash.toLowerCase() : "";
  if (!isMod && currentHash === "#moderation") {
    if (typeof window.switchTab === "function") {
      window.switchTab("live");
    }
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}
window.updateNavVisibility = updateNavVisibility;

/**
 * Renderização da Tabela do Programa Oficial em Acordeões Interativos (11 Etapas)
 */
function renderSchedule() {
  const container = document.getElementById("schedule-container");
  if (!container || !RENOVATE_CONFIG.schedule) return;

  const currentLang = (window.I18nManager && typeof window.I18nManager.getLanguage === "function")
    ? window.I18nManager.getLanguage()
    : "pt-PT";
  const isEn = window.I18nManager && window.I18nManager.isEnglish();
  const scheduleTrans = (RENOVATE_CONFIG.scheduleTranslations && RENOVATE_CONFIG.scheduleTranslations[currentLang])
    ? RENOVATE_CONFIG.scheduleTranslations[currentLang]
    : null;

  // Recuperar o último acordeão aberto (por defeito: slot-1 "Sessão de Abertura")
  const savedOpenSlot = localStorage.getItem("renovate_last_open_slot") || "slot-1";

  container.innerHTML = RENOVATE_CONFIG.schedule.map((item, index) => {
    const slotTrans = (scheduleTrans && scheduleTrans[item.id]) ? scheduleTrans[item.id] : null;

    const rawTitle = (slotTrans && slotTrans.title) 
      ? slotTrans.title 
      : ((isEn && item.titleEn) ? item.titleEn : item.title);

    let itemTitle = rawTitle;
    if (rawTitle.includes("(oferecido pela DATERRA)")) {
      itemTitle = rawTitle.replace(
        "(oferecido pela DATERRA)",
        `<span class="text-xs sm:text-sm font-medium text-slate-500 ml-1">(oferecido pela DATERRA)</span>`
      );
    } else if (rawTitle.includes("(Hosted by DATERRA)")) {
      itemTitle = rawTitle.replace(
        "(Hosted by DATERRA)",
        `<span class="text-xs sm:text-sm font-medium text-slate-500 ml-1">(Hosted by DATERRA)</span>`
      );
    } else if (rawTitle.includes("(coffee break)")) {
      itemTitle = rawTitle.replace(
        "(coffee break)",
        `<span class="text-xs sm:text-sm font-medium text-slate-500 ml-1">(coffee break)</span>`
      );
    }
    const itemSpeaker = (slotTrans && slotTrans.speaker !== undefined) 
      ? slotTrans.speaker 
      : ((isEn && item.speakerEn) ? item.speakerEn : item.speaker);

    const itemBadge = (slotTrans && slotTrans.badge) 
      ? slotTrans.badge 
      : ((isEn && item.badgeEn) ? item.badgeEn : item.badge);

    const itemDesc = (slotTrans && slotTrans.description) 
      ? slotTrans.description 
      : ((isEn && item.descriptionEn) ? item.descriptionEn : item.description);

    // Conteúdo embutido de acordo com o tipo da fase
    let embeddedContent = "";

    if (item.type === "slides") {
      const slidesUrl = (isEn && RENOVATE_CONFIG.externalLinks && RENOVATE_CONFIG.externalLinks.googleSlidesUrlEn) 
        ? RENOVATE_CONFIG.externalLinks.googleSlidesUrlEn 
        : (RENOVATE_CONFIG.externalLinks ? RENOVATE_CONFIG.externalLinks.googleSlidesUrl : '');
        
      const slidesFullscreen = (isEn && RENOVATE_CONFIG.externalLinks && RENOVATE_CONFIG.externalLinks.googleSlidesFullscreenEn) 
        ? RENOVATE_CONFIG.externalLinks.googleSlidesFullscreenEn 
        : ((RENOVATE_CONFIG.externalLinks && RENOVATE_CONFIG.externalLinks.googleSlidesFullscreen) || 'https://docs.google.com/presentation');

      const btnSlidesLabel = (slotTrans && slotTrans.btnSlides)
        ? slotTrans.btnSlides
        : (isEn ? "Official Session Presentation" : "Apresentação Oficial da Sessão");

      embeddedContent = `
        <div class="space-y-3 pt-2">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <span class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <i data-lucide="presentation" class="w-4 h-4 text-amber-600"></i>
              ${btnSlidesLabel}
            </span>
            <a href="${slidesFullscreen}" 
               target="_blank" rel="noopener noreferrer" 
               class="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition">
              <i data-lucide="maximize-2" class="w-3.5 h-3.5"></i>
              <span>${(slotTrans && slotTrans.btnSlides) || (isEn ? "Fullscreen / Open Slides" : "Ecrã Inteiro / Abrir Slides")}</span>
            </a>
          </div>

          <div class="aspect-16-9 bg-slate-900 rounded-xl overflow-hidden shadow-inner">
            <iframe 
              src="${slidesUrl}" 
              title="Apresentação Google Slides - RENOVATE FG2"
              allowfullscreen="true" 
              mozallowfullscreen="true" 
              webkitallowfullscreen="true">
            </iframe>
          </div>
          <p class="text-[11px] text-slate-500 italic">
            ${isEn ? "Slides accompany the FG1 summary and practical framework of the digital tools." : (currentLang === "it-IT" ? "Le diapositive accompagnano il riassunto del FG1 e l'inquadramento pratico degli strumenti digitali." : (currentLang === "es-ES" ? "Las diapositivas acompañan el resumen del GF1 y el marco práctico de las herramientas digitales." : (currentLang === "fr-FR" ? "Les diapositives accompagnent la synthèse du FG1 et le cadrage pratique des outils numériques." : (currentLang === "pl-PL" ? "Slajdy towarzyszą podsumowaniu GF1 i praktycznemu wprowadzeniu do narzędzi cyfrowych." : (currentLang === "nl-BE" ? "De presentaties sluiten aan bij het overzicht van FG1 en de praktische toelichting op de digitale tools." : "Os diapositivos acompanham a recapitulação do GF1 e o enquadramento prático das ferramentas digitais.")))))}
          </p>
        </div>
      `;
    } else if (item.type === "game") {
      const btnActionText = (slotTrans && slotTrans.btnAction)
        ? slotTrans.btnAction
        : (isEn ? "Play Tallentto" : "Jogar Tallentto");

      embeddedContent = `
        <div class="accordion-actions-3 p-4 bg-purple-50/60 rounded-xl border border-purple-200 space-y-3">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center gap-1.5 text-xs font-bold text-purple-900">
              <i data-lucide="smartphone" class="w-4 h-4"></i>
              <span>${currentLang === "it-IT" ? "Dispositivo Consigliato: Smartphone o Tablet" : (currentLang === "es-ES" ? "Dispositivo Recomendado: Smartphone o Tablet" : (currentLang === "fr-FR" ? "Appareil Recommandé : Smartphone ou Tablette" : (currentLang === "pl-PL" ? "Zalecane Urządzenie: Smartfon lub Tablet" : (currentLang === "nl-BE" ? "Aanbevolen Apparaat: Smartphone of Tablet" : (isEn ? "Recommended Device: Smartphone or Tablet" : "Dispositivo Recomendado: Smartphone ou Tablet")))))}</span>
            </div>
            <div class="accordion-lock-badge-3"></div>
          </div>
          <p class="text-xs text-slate-600">
            ${currentLang === "it-IT" ? "Accedi alla piattaforma di gioco e completa i moduli interattivi di taratura dell'irroratrice al tuo ritmo." : (currentLang === "es-ES" ? "Accede a la plataforma de juego y completa los módulos interactivos de calibración del pulverizador a tu propio ritmo." : (currentLang === "fr-FR" ? "Accédez à la plateforme de jeu et complétez les modules interactifs de calibrage du pulvérisateur à votre propre rythme." : (currentLang === "pl-PL" ? "Przejdź do platformy gry i realizuj interaktywne moduły kalibracji opryskiwacza we własnym tempie." : (currentLang === "nl-BE" ? "Ga naar het spelplatform en voltooi de interactieve modules voor de kalibratie van het spuittoestel in uw eigen tempo." : (isEn ? "Access the game platform and complete the interactive sprayer calibration modules at your own pace." : "Aceda à plataforma de jogo e conclua os módulos interativos de calibração fitossanitária no seu próprio ritmo.")))))}
          </p>

          <div class="flex flex-wrap gap-2 pt-1">
            <a id="btn-schedule-tallentto" href="${item.url || (RENOVATE_CONFIG.externalLinks && RENOVATE_CONFIG.externalLinks.seriousGameTallentto) || 'https://www.cordalgpt.ai/renovate/register.php?pilot=calibration-pilot&lang=pt'}" target="_blank" rel="noopener noreferrer" 
               class="game-link-tallentto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FFCC66] hover:bg-[#FBBF24] text-[#0F172A] text-xs font-bold border border-slate-900 transition shadow-sm">
              <i data-lucide="gamepad-2" class="w-4 h-4"></i>
              <span>${btnActionText}</span>
            </a>
          </div>
        </div>
      `;
    } else if (item.type === "form-game") {
      const btnActionText = (slotTrans && slotTrans.btnAction)
        ? slotTrans.btnAction
        : (isEn ? "Open Serious Game Evaluation (Form 1)" : "Abrir Avaliação Serious Game (Form 1)");

      embeddedContent = `
        <div class="accordion-actions-3 p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-3">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center gap-1.5 text-xs font-bold text-blue-900">
              <i data-lucide="clipboard-check" class="w-4 h-4"></i>
              <span>${currentLang === "it-IT" ? "Questionario di Valutazione Pedagogica" : (currentLang === "es-ES" ? "Cuestionario de Evaluación Pedagógica" : (currentLang === "fr-FR" ? "Questionnaire d'Évaluation Pédagogique" : (currentLang === "pl-PL" ? "Kwestionariusz Oceny Pedagogicznej" : (currentLang === "nl-BE" ? "Vragenlijst Pedagogische Evaluatie" : (isEn ? "Pedagogical Evaluation Questionnaire" : "Questionário de Avaliação Pedagógica")))))}</span>
            </div>
            <div class="accordion-lock-badge-3"></div>
          </div>
          <p class="text-xs text-slate-600">
            ${currentLang === "it-IT" ? "Compila le tue risposte su giocabilità, chiarezza e utilità formativa. Il tuo codice partecipante sarà associato automaticamente." : (currentLang === "es-ES" ? "Registra tus respuestas sobre jugabilidad, claridad y utilidad formativa. Tu código de participante se asociará automáticamente." : (currentLang === "fr-FR" ? "Enregistrez vos réponses sur la jouabilité, la clarté et l'utilité formative. Votre code participant sera automatiquement associé." : (currentLang === "pl-PL" ? "Zapisz swoje odpowiedzi dotyczące grywalności, przejrzystości i wartości szkoleniowej. Twój kod uczestnika zostanie powiązany automatycznie." : (currentLang === "nl-BE" ? "Geef uw feedback over speelbaarheid, duidelijkheid en trainingswaarde. Uw deelnemerscode wordt automatisch gekoppeld." : (isEn ? "Submit your feedback on gameplay, clarity, and training utility. Your participant code is automatically attached." : "Registe as suas respostas sobre a jogabilidade, clareza e utilidade formativa. O seu código de participante será associado automaticamente.")))))}
          </p>
          <div class="pt-1">
            <a id="btn-schedule-form-1" data-form="1" href="${(window.LiveSession && typeof window.LiveSession.getPrefilledFormUrl === 'function') ? window.LiveSession.getPrefilledFormUrl(1) : (RENOVATE_CONFIG.externalLinks && RENOVATE_CONFIG.externalLinks.googleFormGameTallentto)}" target="_blank" rel="noopener noreferrer" 
               class="form-link-game inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm">
              <i data-lucide="clipboard-list" class="w-4 h-4 text-[#FFCC66]"></i>
              <span>${btnActionText}</span>
            </a>
          </div>
        </div>
      `;
    } else if (item.type === "simulator") {
      const btnActionText = (slotTrans && slotTrans.btnAction)
        ? slotTrans.btnAction
        : (isEn ? "Play RENOVATE Simulator" : "Jogar Simulador RENOVATE");

      embeddedContent = `
        <div class="accordion-actions-4 p-4 bg-sky-50/60 rounded-xl border border-sky-200 space-y-3">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center gap-1.5 text-xs font-bold text-sky-900">
              <i data-lucide="monitor" class="w-4 h-4"></i>
              <span>${currentLang === "it-IT" ? "Dispositivo Consigliato: Computer PC o Portatile" : (currentLang === "es-ES" ? "Dispositivo Recomendado: Ordenador PC o Portátil" : (currentLang === "fr-FR" ? "Appareil Recommandé : Ordinateur PC ou Portable" : (currentLang === "pl-PL" ? "Zalecane Urządzenie: Komputer PC lub Laptop" : (currentLang === "nl-BE" ? "Aanbevolen Apparaat: PC of Laptop" : (isEn ? "Recommended Device: PC or Laptop" : "Dispositivo Recomendado: Computador PC ou Portátil")))))}</span>
            </div>
            <div class="accordion-lock-badge-4"></div>
          </div>
          <p class="text-xs text-slate-600">
            ${currentLang === "it-IT" ? "Esplora l'ambiente di simulazione virtuale 3D per testare le regolazioni dell'irroratrice, velocità e condizioni meteo." : (currentLang === "es-ES" ? "Explora el entorno de simulación 3D para probar ajustes del pulverizador, velocidad y condiciones meteorológicas." : (currentLang === "fr-FR" ? "Explorez l'environnement de simulation 3D pour tester les buses de pulvérisation, la vitesse et les conditions météorologiques." : (currentLang === "pl-PL" ? "Poznaj środowisko symulacji 3D, aby przetestować dobór rozpylaczy, prędkość roboczą i warunki pogodowe." : (currentLang === "nl-BE" ? "Verken de virtuele 3D-simulatieomgeving om spuitdoppen, rijsnelheid en weersomstandigheden te testen." : (isEn ? "Explore the 3D simulation environment to test spray nozzle variations, speed, and weather conditions." : "Explore o ambiente de simulação 3D para testar variações de bicos de pulverização, velocidade e condições meteorológicas.")))))}
          </p>

          <div class="flex flex-wrap gap-2 pt-1">
            <a id="btn-schedule-simulator" href="${item.url || (RENOVATE_CONFIG.externalLinks && RENOVATE_CONFIG.externalLinks.simulatorVirmedex) || 'https://simulator.renovateproject.eu/auth/login'}" target="_blank" rel="noopener noreferrer" 
               class="simulator-link-virmedex inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FFCC66] hover:bg-[#FBBF24] text-[#0F172A] text-xs font-bold border border-slate-900 transition shadow-sm">
              <i data-lucide="laptop" class="w-4 h-4"></i>
              <span>${btnActionText}</span>
            </a>
          </div>
        </div>
      `;
    } else if (item.type === "form-simulator") {
      const btnActionText = (slotTrans && slotTrans.btnAction)
        ? slotTrans.btnAction
        : (isEn ? "Open Simulator Evaluation (Form 2)" : "Abrir Avaliação Simulador (Form 2)");

      embeddedContent = `
        <div class="accordion-actions-4 p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-3">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center gap-1.5 text-xs font-bold text-blue-900">
              <i data-lucide="clipboard-check" class="w-4 h-4"></i>
              <span>${currentLang === "it-IT" ? "Questionario di Valutazione Tecnica" : (currentLang === "es-ES" ? "Cuestionario de Evaluación Técnica" : (currentLang === "fr-FR" ? "Questionnaire d'Évaluation Technique" : (currentLang === "pl-PL" ? "Kwestionariusz Oceny Technicznej" : (currentLang === "nl-BE" ? "Vragenlijst Technische Evaluatie" : (isEn ? "Technical Evaluation Questionnaire" : "Questionário de Avaliação Técnica")))))}</span>
            </div>
            <div class="accordion-lock-badge-4"></div>
          </div>
          <p class="text-xs text-slate-600">
            ${currentLang === "it-IT" ? "Validazione della fedeltà agronomica, curva di apprendimento e applicabilità nel supporto alle decisioni in campo." : (currentLang === "es-ES" ? "Validación de la fidelidad agronómica, curva de aprendizaje y aplicabilidad en el apoyo a la toma de decisiones en campo." : (currentLang === "fr-FR" ? "Validation de la fidélité agronomique, courbe d'apprentissage et applicabilité dans l'aide à la décision sur le terrain." : (currentLang === "pl-PL" ? "Walidacja wierności agronomicznej, krzywej uczenia się oraz przydatności we wspomaganiu decyzji polowych." : (currentLang === "nl-BE" ? "Validatie van agronomische getrouwheid, leercurve en toepasbaarheid bij beslissingsondersteuning in het veld." : (isEn ? "Validation of agronomic fidelity, learning curve, and field decision-support applicability." : "Validação da fidelidade agronómica, curva de aprendizagem e aplicabilidade no apoio à decisão no campo.")))))}
          </p>
          <div class="pt-1">
            <a id="btn-schedule-form-2" data-form="2" href="${(window.LiveSession && typeof window.LiveSession.getPrefilledFormUrl === 'function') ? window.LiveSession.getPrefilledFormUrl(2) : (RENOVATE_CONFIG.externalLinks && RENOVATE_CONFIG.externalLinks.googleFormSimVirmedex)}" target="_blank" rel="noopener noreferrer" 
               class="form-link-sim inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm">
              <i data-lucide="clipboard-list" class="w-4 h-4 text-[#FFCC66]"></i>
              <span>${btnActionText}</span>
            </a>
          </div>
        </div>
      `;
    } else if (item.type === "form-global") {
      const btnActionText = (slotTrans && slotTrans.btnAction)
        ? slotTrans.btnAction
        : (isEn ? "Submit Overall Evaluation" : "Submeter Avaliação Global");

      embeddedContent = `
        <div class="accordion-actions-5 p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-3">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
              <i data-lucide="check-check" class="w-4 h-4"></i>
              <span>${currentLang === "it-IT" ? "Questionario di Sintesi & Soddisfazione Globale" : (currentLang === "es-ES" ? "Cuestionario de Síntesis y Satisfacción Global" : (currentLang === "fr-FR" ? "Enquête de Synthèse et Satisfaction Globale" : (currentLang === "pl-PL" ? "Kwestionariusz Podsumowania i Ogólnej Satysfakcji" : (currentLang === "nl-BE" ? "Vragenlijst Synthese & Algemene Tevredenheid" : (isEn ? "Synthesis & Overall Satisfaction Survey" : "Inquérito de Síntese & Satisfação Geral")))))}</span>
            </div>
            <div class="accordion-lock-badge-5"></div>
          </div>
          <p class="text-xs text-slate-600">
            ${currentLang === "it-IT" ? "Valutazione complessiva dell'impatto formativo, fattibilità della certificazione e priorità per il projeto RENOVATE." : (currentLang === "es-ES" ? "Evaluación global del impacto formativo, viabilidad de certificación de operadores agrarios y prioridades para el proyecto RENOVATE." : (currentLang === "fr-FR" ? "Évaluation globale de l'impact pédagogique, faisabilité de la certification des opérateurs agricoles et priorités pour le projet RENOVATE." : (currentLang === "pl-PL" ? "Ogólna ocena wpływu szkoleniowego, wykonalności certyfikacji operatorów rolniczych i priorytetów projektu RENOVATE." : (currentLang === "nl-BE" ? "Algemene beoordeling van de opleidingsimpact, haalbaarheid van certificering voor landbouwers en prioriteiten voor het RENOVATE-project." : (isEn ? "Overall rating of training impact, agricultural operator certification feasibility, and priorities for the RENOVATE project." : "Classificação global do impacto pedagógico, viabilidade de certificação de operadores agrários e prioridades para o projeto RENOVATE.")))))}
          </p>
          <div class="pt-1">
            <a id="btn-schedule-form-3" data-form="3" href="${(window.LiveSession && typeof window.LiveSession.getPrefilledFormUrl === 'function') ? window.LiveSession.getPrefilledFormUrl(3) : (RENOVATE_CONFIG.externalLinks && RENOVATE_CONFIG.externalLinks.googleFormGlobal)}" target="_blank" rel="noopener noreferrer" 
               class="form-link-global inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm">
              <i data-lucide="check-check" class="w-4 h-4 text-[#FFCC66]"></i>
              <span>${btnActionText}</span>
            </a>
          </div>
        </div>
      `;
    } else if (item.type === "opening") {
      const openingText = (slotTrans && slotTrans.embeddedText)
        ? slotTrans.embeddedText
        : (isEn ? "Welcome of participants, credential check, and overview of the agenda." : "Acolhimento dos participantes, verificação das credenciais e introdução da agenda de trabalho.");

      embeddedContent = `
        <div class="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div class="space-y-1">
            <p class="text-xs text-slate-600">${openingText}</p>
          </div>
        </div>
      `;
    } else if (item.type === "break") {
      embeddedContent = "";
    } else if (item.type === "lunch") {
      embeddedContent = "";
    } else if (item.type === "discussion") {
      embeddedContent = `
        <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <div class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <i data-lucide="line-chart" class="w-4 h-4 text-amber-600"></i>
            ${currentLang === "it-IT" ? "Temi di Discussione" : (currentLang === "es-ES" ? "Temas de Discusión" : (currentLang === "fr-FR" ? "Thèmes de Discussion" : (currentLang === "pl-PL" ? "Tematy Dyskusji" : (currentLang === "nl-BE" ? "Discussiepunten" : (isEn ? "Discussion Topics" : "Tópicos de Debate")))))}
          </div>
          <ul class="text-xs text-slate-600 space-y-1 list-disc list-inside">
            ${currentLang === "it-IT" ? `
              <li>Proiezione e riflessione congiunta sulle risposte inviate nei questionari.</li>
              <li>Vantaggi dell'apprendimento interattivo rispetto alle barriere nell'utilizzo degli strumenti in condizioni reali di campo.</li>
            ` : currentLang === "es-ES" ? `
              <li>Proyección y reflexión conjunta sobre las respuestas enviadas en los cuestionarios.</li>
              <li>Ventajas del aprendizaje interactivo frente a las barreras de uso de las herramientas en condiciones reales de campo.</li>
            ` : currentLang === "fr-FR" ? `
              <li>Projection et réflexion conjointe sur les réponses soumises dans les questionnaires.</li>
              <li>Avantages de l'apprentissage interactif face aux freins d'utilisation des outils en conditions réelles de terrain.</li>
            ` : currentLang === "pl-PL" ? `
              <li>Wspólna prezentacja i refleksja nad odpowiedziami przesłanymi w kwestionariuszach.</li>
              <li>Zalety interaktywnej nauki w zestawieniu z barierami wdrożenia narzędzi w rzeczywistych warunkach polowych.</li>
            ` : currentLang === "nl-BE" ? `
              <li>Gezamenlijke projectie en reflectie op de ingediende antwoorden in de vragenlijsten.</li>
              <li>Voordelen van interactief leren versus drempels voor het gebruik van de tools in reële veldomstandigheden.</li>
            ` : isEn ? `
              <li>Joint projection and reflection on the responses submitted in the questionnaires.</li>
              <li>Advantages of interactive learning versus barriers to using the tools in real farming conditions.</li>
            ` : `
              <li>Projeção e reflexão conjunta sobre as respostas submetidas nos questionários.</li>
              <li>Vantagens da aprendizagem interativa face às barreiras de utilização das ferramentas em condições reais.</li>
            `}
          </ul>
        </div>
      `;
    } else if (item.type === "closing") {
      embeddedContent = `
        <div class="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
          <div class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <i data-lucide="award" class="w-4 h-4 text-amber-700"></i>
            ${currentLang === "it-IT" ? "Chiusura dei Lavori & Accesso ai Report" : (currentLang === "es-ES" ? "Clausura de la Jornada y Acceso a Informes" : (currentLang === "fr-FR" ? "Clôture des Travaux et Accès aux Rapports" : (currentLang === "pl-PL" ? "Zakończenie Prac i Dostęp do Raportów" : (currentLang === "nl-BE" ? "Afsluiting van de Werkzaamheden & Toegang tot Rapporten" : (isEn ? "Closing of Proceedings & Access to Reports" : "Encerramento dos Trabalhos & Acesso a Relatórios")))))}
          </div>
          <p class="text-xs text-slate-600">
            ${currentLang === "it-IT"
              ? "Un ringraziamento a tutti i partecipanti per il loro contributo attivo. I risultati consolidati saranno integrati nel Deliverable 1.3 del projeto."
              : (currentLang === "es-ES" ? "Agradecimiento a todos los participantes por su contribución activa. Los resultados consolidados se integrarán en el Entregable 1.3 del proyecto." : (currentLang === "fr-FR" ? "Merci à tous les participants pour leur contribution active. Les résultats consolidés seront intégrés dans le Livrable 1.3 du projet." : (currentLang === "pl-PL" ? "Serdeczne podziękowania dla wszystkich uczestników za aktywny wkład. Skonsolidowane wyniki zostaną włączone do Produktu 1.3 projektu." : (currentLang === "nl-BE" ? "Hartelijk dank aan alle deelnemers voor hun actieve bijdrage. De geconsolideerde resultaten worden opgenomen in Deliverable 1.3 van het project." : (isEn ? "Thank you to all participants for their active contribution. Consolidated results will be integrated into Project Deliverable 1.3." : "Agradecimento a todos os participantes pela contribuição ativa. Os resultados consolidados serão integrados no Entregável 1.3 do projeto.")))))}
          </p>
        </div>
      `;
    }

    const isOpen = (item.id === savedOpenSlot) ? "open" : "";
    const lockedClasses = "hover:border-[#F5B842]";
    const lockedSummaryClasses = "hover:bg-slate-50 cursor-pointer";
    const defaultSpeakerLabel = isEn ? "Speakers" : (currentLang === "it-IT" ? "Relatore" : (currentLang === "es-ES" ? "Ponente" : (currentLang === "fr-FR" ? "Intervenant" : (currentLang === "pl-PL" ? "Prelegent" : (currentLang === "nl-BE" ? "Spreker" : "Intervenientes")))));
    const speakerLabelText = (slotTrans && slotTrans.speakerLabel !== undefined && slotTrans.speakerLabel !== "")
      ? slotTrans.speakerLabel
      : (isEn
          ? (item.speakerLabelEn || defaultSpeakerLabel)
          : (item.speakerLabel || defaultSpeakerLabel));
    const speakerIcon = item.speakerIcon || "user";

    return `
      <details id="${item.id}-details" class="schedule-accordion accordion-step-${item.step || ''} group bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm transition-all ${lockedClasses}" ${isOpen}>
        <summary class="flex items-center justify-between gap-3 p-4 sm:p-5 select-none bg-white transition-colors ${lockedSummaryClasses}">
          <div class="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <span class="inline-flex items-center gap-1 text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 shrink-0">
              <i data-lucide="clock" class="w-3.5 h-3.5 text-slate-500"></i>
              ${item.time}
            </span>
            <span class="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-amber-900 transition-colors">
              ${itemTitle}
            </span>
          </div>

          <div class="flex items-center gap-2 sm:gap-3 shrink-0">
            ${
              item.id === "slot-4" 
                ? '<div id="submission-counter-slot-4"></div>' 
                : item.id === "slot-7" 
                ? '<div id="submission-counter-slot-7"></div>' 
                : item.id === "slot-9" 
                ? '<div id="submission-counter-slot-9"></div>' 
                : ''
            }
            <span class="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${item.badgeColor || 'bg-amber-100 text-amber-900 border-amber-300'} border">
              <i data-lucide="${item.icon || 'circle'}" class="w-3 h-3"></i>
              ${itemBadge}
            </span>
            <i data-lucide="chevron-down" class="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform duration-200 shrink-0"></i>
          </div>
        </summary>

        <div class="px-4 sm:px-6 pb-5 pt-3 border-t border-slate-100 space-y-3">
          ${itemSpeaker ? `
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
            <span class="font-medium text-amber-800 flex items-center gap-1.5">
              <i data-lucide="${speakerIcon}" class="w-3.5 h-3.5"></i>
              <strong>${speakerLabelText}:</strong> ${itemSpeaker}
            </span>
          </div>` : ''}
          ${itemDesc ? `<p class="text-xs sm:text-sm text-slate-600 leading-relaxed">${itemDesc}</p>` : ''}
          ${embeddedContent}
        </div>
      </details>
    `;
  }).join("");

  // Botões de controlo global de expansão
  let isBulkToggle = false;
  const expandBtn = document.getElementById("btn-expand-all-schedule");
  const collapseBtn = document.getElementById("btn-collapse-all-schedule");

  if (expandBtn) {
    expandBtn.onclick = () => {
      isBulkToggle = true;
      document.querySelectorAll(".schedule-accordion").forEach(d => {
        d.open = true;
      });
      setTimeout(() => { isBulkToggle = false; }, 100);
    };
  }

  if (collapseBtn) {
    collapseBtn.onclick = () => {
      isBulkToggle = true;
      document.querySelectorAll(".schedule-accordion").forEach(d => d.open = false);
      setTimeout(() => { isBulkToggle = false; }, 100);
    };
  }

  // Gestão e memorização do último acordeão aberto (comportamento de foco único)
  const accordions = document.querySelectorAll(".schedule-accordion");
  accordions.forEach(detailsEl => {
    const summary = detailsEl.querySelector("summary");
    if (summary) {
      summary.addEventListener("click", () => {
        // NÃO-BLOQUEANTE: se o participante abrir slot-7, slot-9, slot-10 ou slot-11, atualiza alertas visuais de passos saltados
        if (!detailsEl.open && window.LiveSession && typeof window.LiveSession.validateAdvanceToStep === "function") {
          if (detailsEl.id === "slot-7-details") {
            window.LiveSession.validateAdvanceToStep(4);
          } else if (detailsEl.id === "slot-9-details") {
            window.LiveSession.validateAdvanceToStep(5);
          } else if (detailsEl.id === "slot-10-details" || detailsEl.id === "slot-11-details") {
            window.LiveSession.validateAdvanceToStep(6);
          }
        }
      });
    }

    detailsEl.addEventListener("toggle", () => {
      if (isBulkToggle) return;
      if (detailsEl.open) {
        const slotId = detailsEl.id.replace("-details", "");
        // Memorizar no localStorage para que os utilizadores reencontrem onde estavam
        localStorage.setItem("renovate_last_open_slot", slotId);

        // Fechar os restantes acordeões para manter o foco limpo na etapa atual
        accordions.forEach(other => {
          if (other !== detailsEl && other.open) {
            other.open = false;
          }
        });
      }
    });
  });

  // Atualizar ícones e sincronizar com o estado da sessão ao vivo
  if (window.lucide) window.lucide.createIcons();
  if (window.LiveSession) {
    if (typeof window.LiveSession.updateFormLinks === "function") {
      window.LiveSession.updateFormLinks();
    }
    if (typeof window.LiveSession.render === "function") {
      window.LiveSession.render();
    }
  }

  // Atualizar contadores e bordas em tempo real nos dropdowns do programa
  if (window.SubmissionsTracker && typeof window.SubmissionsTracker.updateAllCounters === "function") {
    window.SubmissionsTracker.updateAllCounters();
  }
}

/**
 * Renderização dos Dados Históricos do Grupo Focal 1 (Lisboa)
 */
function renderGF1() {
  const metricsContainer = document.getElementById("gf1-metrics-container");
  const highlightsContainer = document.getElementById("gf1-highlights-container");
  const galleryContainer = document.getElementById("gf1-gallery-container");
  if (!RENOVATE_CONFIG.gf1) return;

  const gf1 = RENOVATE_CONFIG.gf1;
  const isEn = window.I18nManager && window.I18nManager.isEnglish();

  if (metricsContainer && gf1.metrics) {
    metricsContainer.innerHTML = gf1.metrics.map(m => `
      <div class="bg-white p-5 rounded-xl border border-slate-200 text-center shadow-sm">
        <div class="text-3xl font-extrabold text-slate-900 mb-1">${m.value}</div>
        <div class="text-xs font-semibold text-slate-600 uppercase tracking-wider">${(isEn && m.labelEn) ? m.labelEn : m.label}</div>
      </div>
    `).join("");
  }

  if (highlightsContainer && gf1.highlights) {
    const highlightsList = (isEn && gf1.highlightsEn) ? gf1.highlightsEn : gf1.highlights;
    highlightsContainer.innerHTML = highlightsList.map(h => `
      <li class="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div class="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 font-bold">
          <i data-lucide="check" class="w-3.5 h-3.5"></i>
        </div>
        <span class="text-xs sm:text-sm text-slate-700 font-medium">${h}</span>
      </li>
    `).join("");
  }

  if (galleryContainer && (gf1.galleryAlbums || gf1.gallery)) {
    const albums = gf1.galleryAlbums || [];
    galleryContainer.className = "grid grid-cols-1 lg:grid-cols-3 gap-6";

    galleryContainer.innerHTML = albums.map((album) => {
      const albumTitle = (isEn && album.titleEn) ? album.titleEn : album.title;
      const albumBadge = (isEn && album.badgeEn) ? album.badgeEn : album.badge;
      const albumDesc = (isEn && album.descriptionEn) ? album.descriptionEn : album.description;
      const firstImg = album.images && album.images.length > 0 ? album.images[0] : {};
      const firstTitle = (isEn && firstImg.titleEn) ? firstImg.titleEn : (firstImg.title || "");

      return `
        <div class="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm hover:border-[#F5B842] hover:shadow-md transition-all flex flex-col justify-between p-4 sm:p-5 space-y-4">
          <!-- Cabeçalho do Cartão da Fase -->
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 shadow-xs">
                <i data-lucide="${album.icon || 'camera'}" class="w-5 h-5"></i>
              </div>
              <div>
                <h4 class="font-extrabold text-slate-900 text-base leading-snug">${albumTitle}</h4>
                <p class="text-xs text-slate-500 mt-0.5 leading-relaxed">${albumDesc}</p>
              </div>
            </div>
            <span class="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
              <i data-lucide="image" class="w-3 h-3 text-amber-600"></i>
              ${albumBadge}
            </span>
          </div>

          <!-- Imagem de Destaque Interativa do Cartão (Clique para Abrir Lightbox) -->
          <div id="featured-container-${album.id}"
               class="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-200 group/img cursor-pointer aspect-16-9"
               onclick="window.openGf1Lightbox('${album.id}', 0)">
            <img id="featured-img-${album.id}" src="${firstImg.src}" alt="${firstImg.alt}" 
                 class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105" loading="eager">
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end justify-between p-3.5">
              <span id="featured-title-${album.id}" class="text-white text-xs font-bold drop-shadow-md truncate pr-2">
                ${firstTitle}
              </span>
              <span class="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-white/95 text-slate-900 shadow-md backdrop-blur-xs shrink-0">
                <i data-lucide="maximize-2" class="w-3.5 h-3.5"></i>
                ${isEn ? "Expand" : "Ampliar"}
              </span>
            </div>
          </div>

          <!-- Grelha de Miniaturas da Fase -->
          <div class="space-y-2 pt-1 border-t border-slate-100">
            <div class="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>${isEn ? "Photographs" : "Fotografias"}:</span>
              <span class="text-amber-800 font-medium text-[11px]">${isEn ? "Select to preview or expand" : "Selecione para ver ou ampliar"}</span>
            </div>
            <div class="grid grid-cols-6 sm:grid-cols-6 gap-1.5 sm:gap-2">
              ${album.images.map((img, i) => `
                <button type="button" 
                        class="thumb-btn-${album.id} rounded-lg overflow-hidden border-2 transition-all aspect-square relative group/thumb ${i === 0 ? 'border-[#F5B842] ring-2 ring-amber-300' : 'border-slate-200 hover:border-amber-400 opacity-80 hover:opacity-100'}"
                        onclick="window.selectFeaturedImage('${album.id}', ${i})"
                        title="${(isEn && img.titleEn) ? img.titleEn : img.title}">
                  <img src="${img.src}" alt="${img.alt}" class="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-200" loading="eager">
                </button>
              `).join("")}
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  // Inicialização do Player de Vídeo HD do GF1 (elimina pixelização do embed padrão)
  const gf1PlayerContainer = document.getElementById("gf1-video-player-container");
  if (gf1PlayerContainer && !gf1PlayerContainer.dataset.initialized) {
    gf1PlayerContainer.dataset.initialized = "true";
    gf1PlayerContainer.addEventListener("click", () => {
      gf1PlayerContainer.style.backgroundImage = "none";
      gf1PlayerContainer.innerHTML = `
        <iframe 
          src="https://www.youtube-nocookie.com/embed/1_jQYkNluhY?autoplay=1&rel=0&modestbranding=1" 
          title="Vídeo Oficial: 1ª Sessão do Grupo Focal RENOVATE (Lisboa)"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen
          class="w-full h-full border-0">
        </iframe>
      `;
      gf1PlayerContainer.classList.remove("cursor-pointer", "group");
    });
  }

  if (window.lucide) window.lucide.createIcons();
}

/**
 * Comutador de Vídeo Oficial do Consórcio RENOVATE
 */
window.switchVideo = function(url, btnElement) {
  const player = document.getElementById('main-video-player');
  if (player) {
    player.dataset.loadedVisible = "true";
    player.src = url;
  }
  document.querySelectorAll('.video-thumb').forEach(btn => {
    btn.classList.remove('ring-2', 'ring-[#F5B842]', 'active', 'opacity-100');
    btn.classList.add('opacity-70');
  });
  if (btnElement) {
    btnElement.classList.remove('opacity-70');
    btnElement.classList.add('ring-2', 'ring-[#F5B842]', 'active', 'opacity-100');
  }
};

/**
 * Galeria de Fotografias por Sessões de Grupos Focais
 */
const fgSessionsGallery = [
  // 1st Focus Group (Consórcio Europeu - Ciclo 1)
  { id: 'fg1-1', session: 'fg1', label: '1st Focus Group', src: 'assets/images/gf1/gf1-1.jpg', alt: 'Focus Group Sessions Gallery - 1st Focus Group', title: 'Focus Group Sessions Gallery - 1st Focus Group', titleEn: 'Focus Group Sessions Gallery - 1st Focus Group' },
  { id: 'fg1-2', session: 'fg1', label: '1st Focus Group', src: 'assets/images/gf1/gf1-2.jpg', alt: 'Focus Group Sessions Gallery - 1st Focus Group', title: 'Focus Group Sessions Gallery - 1st Focus Group', titleEn: 'Focus Group Sessions Gallery - 1st Focus Group' },
  { id: 'fg1-3', session: 'fg1', label: '1st Focus Group', src: 'assets/images/gf1/gf1-3.jpg', alt: 'Focus Group Sessions Gallery - 1st Focus Group', title: 'Focus Group Sessions Gallery - 1st Focus Group', titleEn: 'Focus Group Sessions Gallery - 1st Focus Group' },
  { id: 'fg1-4', session: 'fg1', label: '1st Focus Group', src: 'assets/images/gf1/gf1-4.jpg', alt: 'Focus Group Sessions Gallery - 1st Focus Group', title: 'Focus Group Sessions Gallery - 1st Focus Group', titleEn: 'Focus Group Sessions Gallery - 1st Focus Group' },
  { id: 'fg1-5', session: 'fg1', label: '1st Focus Group', src: 'assets/images/gf1/gf1-5.jpg', alt: 'Focus Group Sessions Gallery - 1st Focus Group', title: 'Focus Group Sessions Gallery - 1st Focus Group', titleEn: 'Focus Group Sessions Gallery - 1st Focus Group' },
  { id: 'fg1-6', session: 'fg1', label: '1st Focus Group', src: 'assets/images/gf1/gf1-6.jpg', alt: 'Focus Group Sessions Gallery - 1st Focus Group', title: 'Focus Group Sessions Gallery - 1st Focus Group', titleEn: 'Focus Group Sessions Gallery - 1st Focus Group' },
  { id: 'fg1-7', session: 'fg1', label: '1st Focus Group', src: 'assets/images/gf1/gf1-7.jpg', alt: 'Focus Group Sessions Gallery - 1st Focus Group', title: 'Focus Group Sessions Gallery - 1st Focus Group', titleEn: 'Focus Group Sessions Gallery - 1st Focus Group' },
  { id: 'fg1-8', session: 'fg1', label: '1st Focus Group', src: 'assets/images/gf1/gf1-8.jpg', alt: 'Focus Group Sessions Gallery - 1st Focus Group', title: 'Focus Group Sessions Gallery - 1st Focus Group', titleEn: 'Focus Group Sessions Gallery - 1st Focus Group' },
  { id: 'fg1-9', session: 'fg1', label: '1st Focus Group', src: 'assets/images/gf1/gf1-9.jpg', alt: 'Focus Group Sessions Gallery - 1st Focus Group', title: 'Focus Group Sessions Gallery - 1st Focus Group', titleEn: 'Focus Group Sessions Gallery - 1st Focus Group' },
  { id: 'fg1-10', session: 'fg1', label: '1st Focus Group', src: 'assets/images/gf1/gf1-10.jpg', alt: 'Focus Group Sessions Gallery - 1st Focus Group', title: 'Focus Group Sessions Gallery - 1st Focus Group', titleEn: 'Focus Group Sessions Gallery - 1st Focus Group' },
  { id: 'fg1-11', session: 'fg1', label: '1st Focus Group', src: 'assets/images/gf1/gf1-11.jpg', alt: 'Focus Group Sessions Gallery - 1st Focus Group', title: 'Focus Group Sessions Gallery - 1st Focus Group', titleEn: 'Focus Group Sessions Gallery - 1st Focus Group' },
  { id: 'fg1-12', session: 'fg1', label: '1st Focus Group', src: 'assets/images/gf1/gf1-12.jpg', alt: 'Focus Group Sessions Gallery - 1st Focus Group', title: 'Focus Group Sessions Gallery - 1st Focus Group', titleEn: 'Focus Group Sessions Gallery - 1st Focus Group' },
  { id: 'fg1-13', session: 'fg1', label: '1st Focus Group', src: 'assets/images/gf1/gf1-13.jpg', alt: 'Focus Group Sessions Gallery - 1st Focus Group', title: 'Focus Group Sessions Gallery - 1st Focus Group', titleEn: 'Focus Group Sessions Gallery - 1st Focus Group' },
  { id: 'fg1-14', session: 'fg1', label: '1st Focus Group', src: 'assets/images/gf1/gf1-14.jpg', alt: 'Focus Group Sessions Gallery - 1st Focus Group', title: 'Focus Group Sessions Gallery - 1st Focus Group', titleEn: 'Focus Group Sessions Gallery - 1st Focus Group' },
  { id: 'fg1-15', session: 'fg1', label: '1st Focus Group', src: 'assets/images/gf1/gf1-15.jpg', alt: 'Focus Group Sessions Gallery - 1st Focus Group', title: 'Focus Group Sessions Gallery - 1st Focus Group', titleEn: 'Focus Group Sessions Gallery - 1st Focus Group' },
  { id: 'fg1-16', session: 'fg1', label: '1st Focus Group', src: 'assets/images/gf1/gf1-16.jpg', alt: 'Focus Group Sessions Gallery - 1st Focus Group', title: 'Focus Group Sessions Gallery - 1st Focus Group', titleEn: 'Focus Group Sessions Gallery - 1st Focus Group' },
  { id: 'fg1-17', session: 'fg1', label: '1st Focus Group', src: 'assets/images/gf1/gf1-17.jpg', alt: 'Focus Group Sessions Gallery - 1st Focus Group', title: 'Focus Group Sessions Gallery - 1st Focus Group', titleEn: 'Focus Group Sessions Gallery - 1st Focus Group' },
  { id: 'fg1-18', session: 'fg1', label: '1st Focus Group', src: 'assets/images/gf1/gf1-18.jpg', alt: 'Focus Group Sessions Gallery - 1st Focus Group', title: 'Focus Group Sessions Gallery - 1st Focus Group', titleEn: 'Focus Group Sessions Gallery - 1st Focus Group' },
  { id: 'fg1-19', session: 'fg1', label: '1st Focus Group', src: 'assets/images/gf1/gf1-19.jpg', alt: 'Focus Group Sessions Gallery - 1st Focus Group', title: 'Focus Group Sessions Gallery - 1st Focus Group', titleEn: 'Focus Group Sessions Gallery - 1st Focus Group' },
  { id: 'fg1-20', session: 'fg1', label: '1st Focus Group', src: 'assets/images/gf1/gf1-20.jpg', alt: 'Focus Group Sessions Gallery - 1st Focus Group', title: 'Focus Group Sessions Gallery - 1st Focus Group', titleEn: 'Focus Group Sessions Gallery - 1st Focus Group' },

  // 2nd Focus Group (Sessão de Testes Práticos e Validação da Plataforma - Ciclo 2)
  { id: 'fg2-01', session: 'fg2', label: '2nd Focus Group', src: 'assets/images/gf1/gf2-01.webp', alt: 'Focus Group Sessions Gallery - 2nd Focus Group', title: 'Focus Group Sessions Gallery - 2nd Focus Group', titleEn: 'Focus Group Sessions Gallery - 2nd Focus Group' },
  { id: 'fg2-02', session: 'fg2', label: '2nd Focus Group', src: 'assets/images/gf1/gf2-02.webp', alt: 'Focus Group Sessions Gallery - 2nd Focus Group', title: 'Focus Group Sessions Gallery - 2nd Focus Group', titleEn: 'Focus Group Sessions Gallery - 2nd Focus Group' },
  { id: 'fg2-03', session: 'fg2', label: '2nd Focus Group', src: 'assets/images/gf1/gf2-03.webp', alt: 'Focus Group Sessions Gallery - 2nd Focus Group', title: 'Focus Group Sessions Gallery - 2nd Focus Group', titleEn: 'Focus Group Sessions Gallery - 2nd Focus Group' },
  { id: 'fg2-04', session: 'fg2', label: '2nd Focus Group', src: 'assets/images/gf1/gf2-04.webp', alt: 'Focus Group Sessions Gallery - 2nd Focus Group', title: 'Focus Group Sessions Gallery - 2nd Focus Group', titleEn: 'Focus Group Sessions Gallery - 2nd Focus Group' },
  { id: 'fg2-05', session: 'fg2', label: '2nd Focus Group', src: 'assets/images/gf1/gf2-05.webp', alt: 'Focus Group Sessions Gallery - 2nd Focus Group', title: 'Focus Group Sessions Gallery - 2nd Focus Group', titleEn: 'Focus Group Sessions Gallery - 2nd Focus Group' },
  { id: 'fg2-06', session: 'fg2', label: '2nd Focus Group', src: 'assets/images/gf1/gf2-06.webp', alt: 'Focus Group Sessions Gallery - 2nd Focus Group', title: 'Focus Group Sessions Gallery - 2nd Focus Group', titleEn: 'Focus Group Sessions Gallery - 2nd Focus Group' },
  { id: 'fg2-07', session: 'fg2', label: '2nd Focus Group', src: 'assets/images/gf1/gf2-07.webp', alt: 'Focus Group Sessions Gallery - 2nd Focus Group', title: 'Focus Group Sessions Gallery - 2nd Focus Group', titleEn: 'Focus Group Sessions Gallery - 2nd Focus Group' },
  { id: 'fg2-08', session: 'fg2', label: '2nd Focus Group', src: 'assets/images/gf1/gf2-08.webp', alt: 'Focus Group Sessions Gallery - 2nd Focus Group', title: 'Focus Group Sessions Gallery - 2nd Focus Group', titleEn: 'Focus Group Sessions Gallery - 2nd Focus Group' },
  { id: 'fg2-09', session: 'fg2', label: '2nd Focus Group', src: 'assets/images/gf1/gf2-09.webp', alt: 'Focus Group Sessions Gallery - 2nd Focus Group', title: 'Focus Group Sessions Gallery - 2nd Focus Group', titleEn: 'Focus Group Sessions Gallery - 2nd Focus Group' },
  { id: 'fg2-10', session: 'fg2', label: '2nd Focus Group', src: 'assets/images/gf1/gf2-10.webp', alt: 'Focus Group Sessions Gallery - 2nd Focus Group', title: 'Focus Group Sessions Gallery - 2nd Focus Group', titleEn: 'Focus Group Sessions Gallery - 2nd Focus Group' },
  { id: 'fg2-11', session: 'fg2', label: '2nd Focus Group', src: 'assets/images/gf1/gf2-11.webp', alt: 'Focus Group Sessions Gallery - 2nd Focus Group', title: 'Focus Group Sessions Gallery - 2nd Focus Group', titleEn: 'Focus Group Sessions Gallery - 2nd Focus Group' },
  { id: 'fg2-12', session: 'fg2', label: '2nd Focus Group', src: 'assets/images/gf1/gf2-12.webp', alt: 'Focus Group Sessions Gallery - 2nd Focus Group', title: 'Focus Group Sessions Gallery - 2nd Focus Group', titleEn: 'Focus Group Sessions Gallery - 2nd Focus Group' },
  { id: 'fg2-13', session: 'fg2', label: '2nd Focus Group', src: 'assets/images/gf1/gf2-13.webp', alt: 'Focus Group Sessions Gallery - 2nd Focus Group', title: 'Focus Group Sessions Gallery - 2nd Focus Group', titleEn: 'Focus Group Sessions Gallery - 2nd Focus Group' },
  { id: 'fg2-14', session: 'fg2', label: '2nd Focus Group', src: 'assets/images/gf1/gf2-14.webp', alt: 'Focus Group Sessions Gallery - 2nd Focus Group', title: 'Focus Group Sessions Gallery - 2nd Focus Group', titleEn: 'Focus Group Sessions Gallery - 2nd Focus Group' },
  { id: 'fg2-15', session: 'fg2', label: '2nd Focus Group', src: 'assets/images/gf1/gf2-15.webp', alt: 'Focus Group Sessions Gallery - 2nd Focus Group', title: 'Focus Group Sessions Gallery - 2nd Focus Group', titleEn: 'Focus Group Sessions Gallery - 2nd Focus Group' },
  { id: 'fg2-16', session: 'fg2', label: '2nd Focus Group', src: 'assets/images/gf1/gf2-16.webp', alt: 'Focus Group Sessions Gallery - 2nd Focus Group', title: 'Focus Group Sessions Gallery - 2nd Focus Group', titleEn: 'Focus Group Sessions Gallery - 2nd Focus Group' },
  { id: 'fg2-17', session: 'fg2', label: '2nd Focus Group', src: 'assets/images/gf1/gf2-17.webp', alt: 'Focus Group Sessions Gallery - 2nd Focus Group', title: 'Focus Group Sessions Gallery - 2nd Focus Group', titleEn: 'Focus Group Sessions Gallery - 2nd Focus Group' },
  { id: 'fg2-18', session: 'fg2', label: '2nd Focus Group', src: 'assets/images/gf1/gf2-18.webp', alt: 'Focus Group Sessions Gallery - 2nd Focus Group', title: 'Focus Group Sessions Gallery - 2nd Focus Group', titleEn: 'Focus Group Sessions Gallery - 2nd Focus Group' },
  { id: 'fg2-19', session: 'fg2', label: '2nd Focus Group', src: 'assets/images/gf1/gf2-19.webp', alt: 'Focus Group Sessions Gallery - 2nd Focus Group', title: 'Focus Group Sessions Gallery - 2nd Focus Group', titleEn: 'Focus Group Sessions Gallery - 2nd Focus Group' },
  { id: 'fg2-20', session: 'fg2', label: '2nd Focus Group', src: 'assets/images/gf1/gf2-20.webp', alt: 'Focus Group Sessions Gallery - 2nd Focus Group', title: 'Focus Group Sessions Gallery - 2nd Focus Group', titleEn: 'Focus Group Sessions Gallery - 2nd Focus Group' },
  { id: 'fg2-21', session: 'fg2', label: '2nd Focus Group', src: 'assets/images/gf1/gf2-21.webp', alt: 'Focus Group Sessions Gallery - 2nd Focus Group', title: 'Focus Group Sessions Gallery - 2nd Focus Group', titleEn: 'Focus Group Sessions Gallery - 2nd Focus Group' },
  { id: 'fg2-22', session: 'fg2', label: '2nd Focus Group', src: 'assets/images/gf1/gf2-22.webp', alt: 'Focus Group Sessions Gallery - 2nd Focus Group', title: 'Focus Group Sessions Gallery - 2nd Focus Group', titleEn: 'Focus Group Sessions Gallery - 2nd Focus Group' },
  { id: 'fg2-23', session: 'fg2', label: '2nd Focus Group', src: 'assets/images/gf1/gf2-23.webp', alt: 'Focus Group Sessions Gallery - 2nd Focus Group', title: 'Focus Group Sessions Gallery - 2nd Focus Group', titleEn: 'Focus Group Sessions Gallery - 2nd Focus Group' },
  { id: 'fg2-24', session: 'fg2', label: '2nd Focus Group', src: 'assets/images/gf1/gf2-24.webp', alt: 'Focus Group Sessions Gallery - 2nd Focus Group', title: 'Focus Group Sessions Gallery - 2nd Focus Group', titleEn: 'Focus Group Sessions Gallery - 2nd Focus Group' },
  { id: 'fg2-26', session: 'fg2', label: '2nd Focus Group', src: 'assets/images/gf1/gf2-26.webp', alt: 'Focus Group Sessions Gallery - 2nd Focus Group', title: 'Focus Group Sessions Gallery - 2nd Focus Group', titleEn: 'Focus Group Sessions Gallery - 2nd Focus Group' },
  { id: 'fg2-27', session: 'fg2', label: '2nd Focus Group', src: 'assets/images/gf1/gf2-27.webp', alt: 'Focus Group Sessions Gallery - 2nd Focus Group', title: 'Focus Group Sessions Gallery - 2nd Focus Group', titleEn: 'Focus Group Sessions Gallery - 2nd Focus Group' }
  // 3rd Focus Group (Espaço reservado para as fotografias da 3ª sessão após validação)
];

let currentSessionGalleryFilter = 'all';

function renderSessionGallery(activeSession) {
  if (activeSession !== undefined) {
    currentSessionGalleryFilter = activeSession;
  } else {
    activeSession = currentSessionGalleryFilter;
  }
  const grid = document.getElementById('fg-session-gallery-grid');
  if (!grid) return;

  const filtered = fgSessionsGallery.filter(item => activeSession === 'all' || item.session === activeSession);

  if (filtered.length === 0) {
    const tTitle = (window.I18nManager && typeof window.I18nManager.t === 'function') 
      ? window.I18nManager.t('fg1.galleryEmptyTitle', 'Photographic records in processing') 
      : 'Photographic records in processing';
    const tDesc = (window.I18nManager && typeof window.I18nManager.t === 'function') 
      ? window.I18nManager.t('fg1.galleryEmptyDesc', 'The photographs for this session will be published following consortium validation.') 
      : 'The photographs for this session will be published following consortium validation.';
    
    grid.innerHTML = `
      <div class="col-span-full py-12 text-center bg-slate-50/80 rounded-2xl border border-dashed border-slate-300 space-y-2">
        <i data-lucide="image" class="w-8 h-8 text-slate-400 mx-auto"></i>
        <h5 class="text-xs sm:text-sm font-bold text-slate-700">${tTitle}</h5>
        <p class="text-[11px] text-slate-500">${tDesc}</p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  grid.innerHTML = filtered.map((item, idx) => {
    let sessionName = '1st Focus Group';
    if (item.session === 'fg2') {
      sessionName = '2nd Focus Group';
    } else if (item.session === 'fg3') {
      sessionName = '3rd Focus Group';
    } else if (item.label) {
      sessionName = item.label;
    }
    const singleCaption = `Focus Group Sessions Gallery - ${sessionName}`;

    return `
    <div onclick="openSessionGallerySlideshow(${idx})" 
         class="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative group shadow-2xs cursor-pointer hover:border-[#F5B842] hover:shadow-lg transition-all duration-300"
         title="${singleCaption}">
      <img src="${item.src}" alt="${singleCaption}" loading="lazy" class="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500" 
           onerror="this.src='https://placehold.co/400x300/e2e8f0/475569?text=Focus+Group'">
      
      <!-- Overlay com Efeito Hover e Ícone de Ampliação / Slide Show -->
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3.5">
        <span class="text-white text-xs font-bold drop-shadow-sm truncate pr-2">${singleCaption}</span>
        <div class="w-8 h-8 rounded-full bg-[#F5B842] text-slate-950 flex items-center justify-center shrink-0 shadow-md">
          <i data-lucide="maximize-2" class="w-4 h-4"></i>
        </div>
      </div>

      <!-- Etiqueta de Identificação da Sessão -->
      <div class="absolute top-2.5 left-2.5 bg-slate-900/85 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm border border-white/10 flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
        <span>${sessionName}</span>
      </div>
    </div>
  `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

function initSessionGalleryFilters() {
  const buttons = document.querySelectorAll('.filter-session-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetBtn = e.target.closest('.filter-session-btn');
      if (!targetBtn) return;
      buttons.forEach(b => {
        b.classList.remove('bg-slate-900', 'text-white');
        b.classList.add('bg-slate-100', 'text-slate-600');
      });
      targetBtn.classList.remove('bg-slate-100', 'text-slate-600');
      targetBtn.classList.add('bg-slate-900', 'text-white');
      renderSessionGallery(targetBtn.dataset.session);
    });
  });
}

/**
 * Renderização do Catálogo Interativo do Questionário (Q1 a Q30)
 */
function renderQuestionnaireGuide() {
  const panels = document.querySelectorAll(".q-guide-panel");
  if (!panels || panels.length === 0 || !RENOVATE_CONFIG.questionnaireData) return;

  const currentLang = (window.I18nManager && typeof window.I18nManager.getLanguage === "function")
    ? window.I18nManager.getLanguage()
    : "pt-PT";

  const rawData = RENOVATE_CONFIG.questionnaireData;
  const data = Array.isArray(rawData)
    ? rawData
    : (rawData[currentLang] || rawData["pt-PT"] || rawData["en-GB"] || []);

  const labelsMap = {
    "pt-PT": {
      all: "Todos (Q1–Q30)",
      secA: "Sec A: Perfil (Q1–Q6)",
      secB: "Sec B: Jogo (Q7–Q14)",
      secC: "Sec C: Simulador (Q15–Q25)",
      secD: "Sec D: Global (Q26–Q30)",
      search: "Pesquisar questões...",
      notFound: "Nenhuma questão encontrada com o filtro selecionado.",
      susHeader: "10 Afirmações de Usabilidade SUS (Escala de 1 a 5):"
    },
    "es-ES": {
      all: "Todos (Q1–Q30)",
      secA: "Sec A: Perfil (Q1–Q6)",
      secB: "Sec B: Juego (Q7–Q14)",
      secC: "Sec C: Simulador (Q15–Q25)",
      secD: "Sec D: Global (Q26–Q30)",
      search: "Buscar preguntas...",
      notFound: "No se encontraron preguntas que coincidan con su filtro.",
      susHeader: "10 Declaraciones de Usabilidad SUS (Escala de 1 a 5):"
    },
    "fr-FR": {
      all: "Tous (Q1–Q30)",
      secA: "Sec A: Profil (Q1–Q6)",
      secB: "Sec B: Jeu (Q7–Q14)",
      secC: "Sec C: Simulateur (Q15–Q25)",
      secD: "Sec D: Global (Q26–Q30)",
      search: "Rechercher des questions...",
      notFound: "Aucune question trouvée correspondant à votre filtre.",
      susHeader: "10 Énoncés d'Usabilité SUS (Échelle de 1 à 5):"
    },
    "it-IT": {
      all: "Tutti (Q1–Q30)",
      secA: "Sec A: Profilo (Q1–Q6)",
      secB: "Sec B: Gioco (Q7–Q14)",
      secC: "Sec C: Simulatore (Q15–Q25)",
      secD: "Sec D: Globale (Q26–Q30)",
      search: "Cerca domande...",
      notFound: "Nessuna domanda trovata corrispondente al filtro.",
      susHeader: "10 Affermazioni di Usabilità SUS (Scala da 1 a 5):"
    },
    "pl-PL": {
      all: "Wszystkie (Q1–Q30)",
      secA: "Sek A: Profil (Q1–Q6)",
      secB: "Sek B: Gra (Q7–Q14)",
      secC: "Sek C: Symulator (Q15–Q25)",
      secD: "Sek D: Globalne (Q26–Q30)",
      search: "Szukaj pytań...",
      notFound: "Nie znaleziono pytań pasujących do wybranego filtra.",
      susHeader: "10 Stwierdzeń Użyteczności SUS (Skala 1 do 5):"
    },
    "nl-BE": {
      all: "Alle (Q1–Q30)",
      secA: "Sectie A: Profiel (Q1–Q6)",
      secB: "Sectie B: Game (Q7–Q14)",
      secC: "Sectie C: Simulator (Q15–Q25)",
      secD: "Sectie D: Globaal (Q26–Q30)",
      search: "Vragen zoeken...",
      notFound: "Geen vragen gevonden die overeenkomen met uw filter.",
      susHeader: "10 SUS Bruikbaarheidsstellingen (Schaal 1 tot 5):"
    },
    "en-GB": {
      all: "All (Q1–Q30)",
      secA: "Sec A: Profile (Q1–Q6)",
      secB: "Sec B: Game (Q7–Q14)",
      secC: "Sec C: Simulator (Q15–Q25)",
      secD: "Sec D: Global (Q26–Q30)",
      search: "Search questions...",
      notFound: "No questions found matching your filter.",
      susHeader: "10 SUS Usability Statements (Scale 1 to 5):"
    }
  };

  const labels = labelsMap[currentLang] || labelsMap["en-GB"];

  panels.forEach((panel, pIdx) => {
    panel.onclick = (e) => e.stopPropagation();

    panel.innerHTML = `
      <div class="space-y-3">
        <!-- Controlos: Filtro por Secção e Pesquisa Rápida -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pb-2 border-b border-blue-200/70">
          <div class="flex items-center gap-1.5 flex-wrap q-sec-filter-bar-${pIdx}">
            <button type="button" data-sec="all" class="q-sec-btn px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-900 text-white transition">${labels.all}</button>
            <button type="button" data-sec="A" class="q-sec-btn px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white text-blue-800 hover:bg-blue-100/70 border border-blue-200 transition">${labels.secA}</button>
            <button type="button" data-sec="B" class="q-sec-btn px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white text-blue-800 hover:bg-blue-100/70 border border-blue-200 transition">${labels.secB}</button>
            <button type="button" data-sec="C" class="q-sec-btn px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white text-blue-800 hover:bg-blue-100/70 border border-blue-200 transition">${labels.secC}</button>
            <button type="button" data-sec="D" class="q-sec-btn px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white text-blue-800 hover:bg-blue-100/70 border border-blue-200 transition">${labels.secD}</button>
          </div>
          <div class="relative min-w-[200px]">
            <input type="text" id="q-search-${pIdx}" placeholder="${labels.search}" 
                   class="w-full text-[11px] bg-white border border-blue-200 rounded-lg pl-7 pr-3 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600" />
            <div class="pointer-events-none absolute left-2 top-1.5 text-blue-500">
              <i data-lucide="search" class="w-3.5 h-3.5"></i>
            </div>
          </div>
        </div>

        <!-- Lista Rolável das Questões -->
        <div id="q-list-${pIdx}" class="max-h-[520px] overflow-y-auto space-y-2.5 pr-1.5 select-text">
        </div>
      </div>
    `;

    const listEl = panel.querySelector(`#q-list-${pIdx}`);
    const searchEl = panel.querySelector(`#q-search-${pIdx}`);
    const filterButtons = panel.querySelectorAll(`.q-sec-filter-bar-${pIdx} .q-sec-btn`);

    let activeSec = "all";
    let searchTerm = "";

    function updateQuestionList() {
      if (!listEl) return;
      const filtered = data.filter(q => {
        const matchSec = activeSec === "all" || q.section === activeSec;
        const matchSearch = !searchTerm || 
          q.id.toLowerCase().includes(searchTerm) || 
          q.question.toLowerCase().includes(searchTerm) || 
          q.type.toLowerCase().includes(searchTerm) ||
          q.options.some(opt => opt.toLowerCase().includes(searchTerm));
        return matchSec && matchSearch;
      });

      if (filtered.length === 0) {
        listEl.innerHTML = `
          <div class="p-6 text-center bg-white/70 rounded-xl border border-blue-100 text-slate-500 text-xs">
            ${labels.notFound}
          </div>
        `;
        return;
      }

      listEl.innerHTML = filtered.map(q => {
        const isOpen = /open|abert|abiert|apert|ouvert|otwart/i.test(q.type);
        const typeBadgeColor = q.type.includes("Likert") ? "bg-amber-100 text-amber-800 border-amber-200" :
                               q.type.includes("SUS") ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
                               isOpen ? "bg-purple-100 text-purple-800 border-purple-200" :
                               "bg-blue-100 text-blue-800 border-blue-200";

        const optionsHtml = q.type.includes("SUS") ? `
          <div class="mt-2 space-y-1 bg-slate-50/80 rounded-lg p-2.5 border border-slate-200/80">
            <span class="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">${labels.susHeader}</span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-700">
              ${q.options.map(opt => `
                <div class="p-1.5 bg-white rounded border border-slate-100 leading-snug">
                  ${opt}
                </div>
              `).join("")}
            </div>
          </div>
        ` : q.type.includes("Likert") ? `
          <div class="mt-2 flex flex-wrap gap-1.5">
            ${q.options.map(opt => `
              <span class="inline-block text-[11px] px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-medium">
                ${opt}
              </span>
            `).join("")}
          </div>
        ` : isOpen ? `
          <div class="mt-2 text-[11px] text-slate-500 italic bg-white/80 p-2 rounded border border-slate-200/60">
            ${q.options[0]}
          </div>
        ` : `
          <div class="mt-2 flex flex-wrap gap-1.5">
            ${q.options.map(opt => `
              <span class="inline-block text-[11px] px-2 py-0.5 rounded bg-white text-slate-800 border border-slate-200 font-medium">
                • ${opt}
              </span>
            `).join("")}
          </div>
        `;

        return `
          <div class="bg-white/95 p-3 rounded-xl border border-blue-100 shadow-2xs space-y-1.5 hover:border-blue-300 transition-colors">
            <div class="flex items-center justify-between gap-2 flex-wrap">
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded-md bg-blue-900 text-white font-mono font-bold text-xs">${q.id}</span>
                <span class="text-[10px] font-bold text-blue-700 uppercase">${q.sectionTitle}</span>
              </div>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border ${typeBadgeColor}">
                ${q.type}
              </span>
            </div>
            <h4 class="text-xs sm:text-sm font-bold text-slate-900 leading-snug pt-0.5">${q.question}</h4>
            ${optionsHtml}
          </div>
        `;
      }).join("");

      if (window.lucide) window.lucide.createIcons();
    }

    filterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        filterButtons.forEach(b => {
          b.classList.remove("bg-blue-900", "text-white");
          b.classList.add("bg-white", "text-blue-800");
        });
        btn.classList.remove("bg-white", "text-blue-800");
        btn.classList.add("bg-blue-900", "text-white");
        activeSec = btn.getAttribute("data-sec");
        updateQuestionList();
      });
    });

    if (searchEl) {
      searchEl.addEventListener("input", (e) => {
        searchTerm = (e.target.value || "").trim().toLowerCase();
        updateQuestionList();
      });
    }

    updateQuestionList();
  });

  if (window.lucide) window.lucide.createIcons();
}

/**
 * Renderização dos Resultados, Deliverable 1.4 & Media Hub
 */
function renderResultsAndMedia() {
  const delivContainer = document.getElementById("deliverable-highlights-container");
  const galleryContainer = document.getElementById("media-gallery-container");
  if (!RENOVATE_CONFIG.resultsMedia) return;

  const results = RENOVATE_CONFIG.resultsMedia;
  const isEn = window.I18nManager && window.I18nManager.isEnglish();

  // Atualizar link de download dinamicamente caso o elemento exista
  const downloadLink = document.getElementById("deliverable-download-link");
  if (downloadLink && results.deliverable && results.deliverable.url) {
    downloadLink.href = results.deliverable.url;
  }

  if (delivContainer && results.deliverable) {
    const delivList = (isEn && results.deliverable.highlightsEn) ? results.deliverable.highlightsEn : results.deliverable.highlights;
    delivContainer.innerHTML = delivList.map(h => `
      <div class="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs flex items-center gap-3.5 transition-all hover:border-[#F5B842] hover:shadow-xs">
        <div class="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
          <i data-lucide="check" class="w-3.5 h-3.5 stroke-[2.5]"></i>
        </div>
        <span class="text-xs sm:text-sm font-medium text-slate-800 leading-snug">${h}</span>
      </div>
    `).join("");
  }

  if (galleryContainer && results.gallery) {
    galleryContainer.innerHTML = results.gallery.map(album => {
    const title = (isEn && album.titleEn) ? album.titleEn : album.title;
    const caption = (isEn && album.captionEn) ? album.captionEn : album.caption;
    const tag = (isEn && album.tagEn) ? album.tagEn : album.tag;
    const phase = (isEn && album.phaseEn) ? album.phaseEn : album.phase;
    const photoBadge = isEn ? "Official Album" : "Álbum Oficial";
    const statusText = isEn ? "Recording in progress" : "Captação no evento";

    return `
      <div class="group relative bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col">
        <!-- Visual Header com Visor Fotográfico Cinematográfico (Sem bloco amarelo plano) -->
        <div class="h-44 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/60 relative overflow-hidden flex flex-col justify-between p-3.5 border-b border-slate-100">
          <!-- Textura subtil de mira fotográfica -->
          <div class="absolute inset-0 opacity-10 pointer-events-none"
               style="background-image: radial-gradient(rgba(255, 204, 102, 0.6) 1px, transparent 1px); background-size: 16px 16px;"></div>

          <!-- Topo do Visor: Fase & Badge de Álbum -->
          <div class="flex items-center justify-between gap-1.5 relative z-10">
            <span class="bg-black/60 backdrop-blur-xs text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border border-white/10 tracking-wider">
              ${phase}
            </span>
            <span class="inline-flex items-center gap-1 bg-[#F5B842] text-slate-900 text-[10px] font-black px-2 py-0.5 rounded shadow-sm">
              <i data-lucide="camera" class="w-3 h-3"></i>
              ${photoBadge}
            </span>
          </div>

          <!-- Centro do Visor: Ícone da Etapa com Anel translúcido -->
          <div class="flex items-center justify-center my-auto relative z-10">
            <div class="w-13 h-13 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-400 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 backdrop-blur-xs">
              <i data-lucide="${album.icon}" class="w-7 h-7"></i>
            </div>
          </div>

          <!-- Base do Visor: Horário da Agenda -->
          <div class="flex items-center justify-between text-[11px] text-slate-300 relative z-10">
            <span class="font-mono font-bold bg-black/50 px-2 py-0.5 rounded text-[10px] text-amber-300">
              ${album.time}
            </span>
            <span class="text-[10px] text-slate-400 font-medium truncate max-w-[150px]">
              ${tag}
            </span>
          </div>
        </div>

        <!-- Conteúdo do Cartão: Título, Descrição e Estado -->
        <div class="p-4 flex flex-col flex-grow justify-between space-y-3">
          <div class="space-y-1.5">
            <h4 class="font-extrabold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-amber-800 transition-colors">
              ${title}
            </h4>
            <p class="text-xs text-slate-600 leading-relaxed">
              ${caption}
            </p>
          </div>

          <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span class="inline-flex items-center gap-1">
              <i data-lucide="image" class="w-3.5 h-3.5 text-amber-600"></i>
              <span class="text-[11px]">${isEn ? "Event Photographs" : "Fotografias da Sessão"}</span>
            </span>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
              ${statusText}
            </span>
          </div>
        </div>
      </div>
    `;
    }).join("");
  }

  if (window.lucide) window.lucide.createIcons();
  initVideoSlider();
}

/**
 * Inicialização e Controlo do Carrossel de Vídeos (Media Slider)
 * 3 Slides: 1. Vídeo RENOVATE 1, 2. Vídeo RENOVATE 2, 3. Vídeo Oficial Santarém (Placeholder)
 */
function initVideoSlider() {
  const slider = document.getElementById("video-slider-track");
  const prevBtn = document.getElementById("slider-btn-prev");
  const nextBtn = document.getElementById("slider-btn-next");
  const badgeText = document.getElementById("video-slider-badge-text");
  const dots = document.querySelectorAll(".video-slider-dot");
  if (!slider) return;

  function updateControls() {
    const scrollLeft = slider.scrollLeft;
    const maxScroll = Math.max(0, slider.scrollWidth - slider.clientWidth);
    const width = slider.clientWidth || slider.offsetWidth || 1;
    const currentIndex = Math.min(2, Math.max(0, Math.round(scrollLeft / width)));

    // Atualizar botões de navegação
    if (prevBtn) {
      if (scrollLeft <= 10) {
        prevBtn.disabled = true;
        prevBtn.classList.add("opacity-30", "pointer-events-none");
      } else {
        prevBtn.disabled = false;
        prevBtn.classList.remove("opacity-30", "pointer-events-none");
      }
    }

    if (nextBtn) {
      if (scrollLeft >= maxScroll - 10) {
        nextBtn.disabled = true;
        nextBtn.classList.add("opacity-30", "pointer-events-none");
      } else {
        nextBtn.disabled = false;
        nextBtn.classList.remove("opacity-30", "pointer-events-none");
      }
    }

    // Atualizar badge indicador
    if (badgeText) {
      const isEn = window.I18nManager && typeof window.I18nManager.isEnglish === "function" && window.I18nManager.isEnglish();
      const labels = isEn
        ? ["Video 1 of 3: RENOVATE 1", "Video 2 of 3: RENOVATE 2", "Video 3 of 3: Santarém (Coming Soon)"]
        : ["Vídeo 1 de 3: RENOVATE 1", "Vídeo 2 de 3: RENOVATE 2", "Vídeo 3 de 3: Santarém (Brevemente)"];
      badgeText.textContent = labels[currentIndex] || `${isEn ? "Video" : "Vídeo"} ${currentIndex + 1} / 3`;
    }

    // Atualizar dots
    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.remove("bg-slate-300", "w-2.5");
        dot.classList.add("bg-amber-500", "w-6");
      } else {
        dot.classList.remove("bg-amber-500", "w-6");
        dot.classList.add("bg-slate-300", "w-2.5");
      }
    });
  }

  if (!slider.dataset.sliderInitialized) {
    slider.dataset.sliderInitialized = "true";

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        const width = slider.clientWidth || slider.offsetWidth;
        slider.scrollBy({ left: -width, behavior: "smooth" });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        const width = slider.clientWidth || slider.offsetWidth;
        slider.scrollBy({ left: width, behavior: "smooth" });
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener("click", () => {
        const width = slider.clientWidth || slider.offsetWidth;
        slider.scrollTo({ left: idx * width, behavior: "smooth" });
      });
    });

    let ticking = false;
    slider.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateControls();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener("resize", () => {
      updateControls();
    });
  }

  // Inicialização das Facades de Vídeo do Carrossel (Slides 1 e 2)
  document.querySelectorAll('.video-facade').forEach(facade => {
    if (!facade.dataset.facadeInitialized) {
      facade.dataset.facadeInitialized = "true";
      facade.addEventListener('click', function() {
        const videoId = this.getAttribute('data-video-id');
        if (!videoId) return;
        const iframeHtml = `<iframe class="absolute inset-0 w-full h-full rounded-lg" src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        this.innerHTML = iframeHtml;
        this.classList.remove('cursor-pointer', 'group');
      });
    }
  });

  updateControls();
}

/**
 * Adaptação Dinâmica da UI para Modo de Apresentação (código "focusgroup")
 * Oculta referências locais (ESAS, DATERRA, Santarém) e destaca a identidade europeia do RENOVATE.
 */
function applyPresentationModeUI() {
  const isPres = window.AuthModule && typeof window.AuthModule.getUserRole === "function" && window.AuthModule.getUserRole() === "presentation";

  // 1. Cabeçalho
  const logoDaterra = document.getElementById("header-logo-daterra");
  const logoEsas = document.getElementById("header-logo-esas");
  const headerSeps = document.querySelectorAll(".header-local-sep");
  const headerSub = document.getElementById("header-subtitle");
  const headerTitle = document.querySelector('[data-i18n="header.title"]');

  if (logoDaterra) logoDaterra.style.display = isPres ? "none" : "";
  if (logoEsas) logoEsas.style.display = isPres ? "none" : "";
  headerSeps.forEach(sep => sep.style.display = isPres ? "none" : "");
  if (headerSub) headerSub.style.display = isPres ? "none" : "";
  if (headerTitle) {
    headerTitle.textContent = "RENOVATE Focus Group";
  }

  // 2. Parceiro Anfitrião
  const hostContainer = document.getElementById("host-partner-container");
  if (hostContainer) {
    hostContainer.style.display = isPres ? "none" : "";
  }

  // 3. Rodapé
  const footOrg = document.getElementById("footer-group-org");
  const footHost = document.getElementById("footer-group-host");
  if (footOrg) footOrg.style.display = isPres ? "none" : "";
  if (footHost) footHost.style.display = isPres ? "none" : "";

  // 4. Seletor de País Discreto do Dashboard de Resultados
  const countryFilterContainer = document.getElementById("results-country-filter-container");
  if (countryFilterContainer) {
    if (isPres) {
      countryFilterContainer.classList.remove("hidden");
      countryFilterContainer.style.display = "inline-flex";
    } else {
      countryFilterContainer.classList.add("hidden");
      countryFilterContainer.style.display = "none";
    }
  }

  // 5. Botão de menu legado Sheets
  const dropdownSheets = document.getElementById("dropdown-sheets-container");
  if (dropdownSheets) {
    dropdownSheets.style.display = isPres ? "none" : "";
  }

  // 6. Subtítulo e referências locais do Dashboard de Resultados
  const resultsSub = document.querySelector('[data-i18n="results.subtitle"]');
  if (resultsSub) {
    if (isPres) {
      resultsSub.textContent = "Consolidated real-time evaluation across the 6 RENOVATE European partner countries (PT, ES, IT, FR, BE, PL).";
    } else {
      if (window.I18nManager && typeof window.I18nManager.t === "function") {
        resultsSub.textContent = window.I18nManager.t("results.subtitle", "Análise em tempo real das respostas recolhidas nos 3 questionários da 2ª Sessão do Grupo Focal (ESAS Santarém).");
      }
    }
  }

  const kpiVenue = document.querySelector('[data-i18n="results.kpi.venue"]');
  if (kpiVenue) {
    if (isPres) {
      kpiVenue.textContent = "European Consortium Focus Groups";
    } else {
      if (window.I18nManager && typeof window.I18nManager.t === "function") {
        kpiVenue.textContent = window.I18nManager.t("results.kpi.venue", "Sessão Prática na ESAS Santarém");
      }
    }
  }

  // 7. Live Session - Adaptação dinâmica para modo de apresentação (focusgroup)
  const step1CodePreview = document.getElementById("step1-code-preview");
  const step1CodeBox = document.getElementById("step1-code-box");
  if (step1CodePreview) {
    if (isPres) {
      step1CodePreview.removeAttribute("data-i18n");
      step1CodePreview.textContent = "focusgroup";
      step1CodePreview.className = "font-mono font-extrabold text-sm text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-lg shadow-2xs";
      if (step1CodeBox) {
        step1CodeBox.className = "p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between";
      }
    }
  }

  if (window.LiveSession) {
    if (isPres && typeof window.LiveSession.setParticipantCode === "function" && !window.LiveSession.getParticipantCode()) {
      window.LiveSession.setParticipantCode("FOCUSGROUP");
    }
    if (typeof window.LiveSession.render === "function") {
      window.LiveSession.render();
    }
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}
window.applyPresentationModeUI = applyPresentationModeUI;

/**
 * Renderização da Secção de Parceiros Oficiais do Consórcio RENOVATE
 * Alinhada com a infografia oficial (16 parceiros, 8 países) + ESAS Anfitrião
 */
function renderPartners() {
  const container = document.getElementById("partners-list-container");
  const hostContainer = document.getElementById("host-partner-container");
  if (!container || !RENOVATE_CONFIG.partners) return;

  const isEn = window.I18nManager && window.I18nManager.isEnglish();

  // 1. Renderizar Parceiro Anfitrião (ESAS) com caixa ampla e logótipo de grande visibilidade
  if (hostContainer && RENOVATE_CONFIG.hostPartner) {
    const host = RENOVATE_CONFIG.hostPartner;
    const hostRole = (isEn && host.roleEn) ? host.roleEn : host.role;
    hostContainer.innerHTML = `
      <div class="bg-gradient-to-r from-emerald-50 via-amber-50/40 to-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5">
        <div class="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-5 text-center sm:text-left">
          <!-- Logótipo ESAS em tamanho de destaque e proporção original -->
          <div class="w-56 sm:w-64 md:w-72 h-24 sm:h-28 bg-white rounded-2xl border-2 border-emerald-200 p-3 sm:p-4 flex items-center justify-center shrink-0 shadow-md">
            <img src="${host.logo}" alt="${host.name}" class="max-h-20 sm:max-h-24 w-auto max-w-full object-contain">
          </div>
          <div>
            <div class="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase px-2.5 py-1 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
              <i data-lucide="map-pin" class="w-3.5 h-3.5 text-emerald-700"></i> ${hostRole}
            </div>
            <h4 class="text-lg sm:text-xl font-extrabold text-slate-900 mt-1.5 leading-snug">${host.name}</h4>
            <p class="text-xs sm:text-sm text-slate-600 mt-0.5">${isEn ? "Host venue for the 2nd Focus Group Session • Santarém, Portugal" : "Local de realização da 2ª Sessão do Grupo Focal • Santarém, Portugal"}</p>
          </div>
        </div>
        <a href="${host.url}" target="_blank" rel="noopener noreferrer" 
           class="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold transition shadow-sm">
          <span>${isEn ? "ESAS Website" : "Website ESAS"}</span>
          <i data-lucide="external-link" class="w-4 h-4"></i>
        </a>
      </div>
    `;
  }

  const lang = (window.I18nManager && window.I18nManager.getCurrentLanguage) ? window.I18nManager.getCurrentLanguage() : "pt-PT";
  const COUNTRY_NAMES = {
    "Spain": { "pt-PT": "Espanha", "en-GB": "Spain", "es-ES": "España", "it-IT": "Spagna", "fr-FR": "Espagne", "pl-PL": "Hiszpania", "nl-BE": "Spanje" },
    "Italy": { "pt-PT": "Itália", "en-GB": "Italy", "es-ES": "Italia", "it-IT": "Italia", "fr-FR": "Italie", "pl-PL": "Włochy", "nl-BE": "Italië" },
    "France": { "pt-PT": "França", "en-GB": "France", "es-ES": "Francia", "it-IT": "Francia", "fr-FR": "France", "pl-PL": "Francja", "nl-BE": "Frankrijk" },
    "Portugal": { "pt-PT": "Portugal", "en-GB": "Portugal", "es-ES": "Portugal", "it-IT": "Portogallo", "fr-FR": "Portugal", "pl-PL": "Portugalia", "nl-BE": "Portugal" },
    "Belgium": { "pt-PT": "Bélgica", "en-GB": "Belgium", "es-ES": "Bélgica", "it-IT": "Belgio", "fr-FR": "Belgique", "pl-PL": "Belgia", "nl-BE": "België" },
    "Poland": { "pt-PT": "Polónia", "en-GB": "Poland", "es-ES": "Polonia", "it-IT": "Polonia", "fr-FR": "Pologne", "pl-PL": "Polska", "nl-BE": "Polen" },
    "Cyprus": { "pt-PT": "Chipre", "en-GB": "Cyprus", "es-ES": "Chipre", "it-IT": "Cipro", "fr-FR": "Chypre", "pl-PL": "Cypr", "nl-BE": "Cyprus" },
    "Czech Republic": { "pt-PT": "República Checa", "en-GB": "Czech Republic", "es-ES": "República Checa", "it-IT": "Repubblica Ceca", "fr-FR": "République tchèque", "pl-PL": "Czechy", "nl-BE": "Tsjechië" }
  };

  // 2. Renderizar a Grelha dos 16 Parceiros do Consórcio com Logótipos Grandes e Nitidez Total
  container.innerHTML = RENOVATE_CONFIG.partners.map(p => {
    const pRole = (isEn && p.roleEn) ? p.roleEn : p.role;
    const cMap = COUNTRY_NAMES[p.country] || {};
    const pCountry = cMap[lang] || (isEn ? p.country : (p.countryPt || p.country));
    return `
      <div class="group bg-white rounded-2xl border-2 border-slate-200 hover:border-[#F5B842] hover:shadow-xl transition-all duration-200 p-4 sm:p-5 flex flex-col items-center justify-between text-center min-h-[220px]">
        <!-- Logótipo Centrado e Ampliado -->
        <div class="h-28 w-full flex items-center justify-center p-2" title="${p.name} (${pRole})">
          <img src="${p.logo}" alt="${p.name}" class="max-h-24 max-w-[92%] w-auto object-contain transition-transform duration-200 group-hover:scale-105" loading="lazy">
        </div>

        <!-- País e Ligação ao Website -->
        <div class="w-full pt-3.5 border-t border-slate-100 space-y-2">
          <div class="flex items-center justify-center gap-1.5 text-xs text-emerald-800 font-bold">
            <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>${pCountry}</span>
          </div>
          <a href="${p.url}" target="_blank" rel="noopener noreferrer" 
             class="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#0F172A] bg-slate-50 hover:bg-[#FFCC66] px-3 py-1.5 rounded-lg border border-slate-200 transition-colors w-full"
             title="${isEn ? `Open website of ${p.name}` : `Abrir website de ${p.name}`}">
            <span>Website</span>
            <i data-lucide="external-link" class="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-900"></i>
          </a>
        </div>
      </div>
    `;
  }).join("");

  if (window.lucide) window.lucide.createIcons();
  applyPresentationModeUI();
}

/**
 * Gestão do Código de Participante
 */
function initParticipantCodeEvents() {
  const saveBtn = document.getElementById("btn-save-participant-code");
  const input = document.getElementById("participant-code-input");

  if (saveBtn && input) {
    const handleCodeUpdate = () => {
      const code = input.value.trim().toUpperCase();
      if (LiveSession.setParticipantCode(code)) {
        if (window.AuthModule) {
          localStorage.setItem(window.AuthModule.STORAGE_KEYS.PARTICIPANT_CODE, code);
          window.AuthModule.renderHeaderUserBadge();
          window.AuthModule.injectParticipantCodeToForms(code);
        }
        showToast("Código de Participante atualizado com sucesso!");
      }
    };

    saveBtn.addEventListener("click", handleCodeUpdate);

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleCodeUpdate();
      }
    });
  }

  // Checkboxes de progresso da Sessão ao Vivo (Passos 1 a 5)
  for (let i = 1; i <= 5; i++) {
    const chk = document.getElementById(`step-checkbox-${i}`);
    if (chk) {
      chk.addEventListener("change", () => {
        if (window.LiveSession && typeof window.LiveSession.handleCheckboxInteraction === "function") {
          window.LiveSession.handleCheckboxInteraction(i);
        } else if (window.LiveSession && typeof window.LiveSession.toggleStepCompleted === "function") {
          window.LiveSession.toggleStepCompleted(i);
        }
      });
    }
  }
}

/**
 * Modal do Moderador e Gestão de Sala (Painel Central de Controlo)
 */
function initModeratorModal() {
  if (window.ModeratorPanel) {
    window.ModeratorPanel.init();
  }

  // Atalho para Resultados & Dashboard a partir do Painel de Moderação
  const btnModResults = document.getElementById("btn-mod-goto-results");
  if (btnModResults) {
    btnModResults.addEventListener("click", () => {
      if (window.ModeratorPanel) {
        window.ModeratorPanel.closeModal();
      }
      if (typeof window.switchTab === "function") {
        window.switchTab("results");
      }
      const resultsSec = document.getElementById("tab-results") || document.getElementById("content-results");
      if (resultsSec) {
        setTimeout(() => {
          resultsSec.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
      }
    });
  }
}

/**
 * Toast Notification simples
 */
function showToast(message) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "fixed bottom-5 right-5 flex flex-col gap-2 z-50";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 border border-amber-400";
  toast.innerHTML = `<i data-lucide="info" class="w-4 h-4 text-[#FFCC66]"></i> <span>${message}</span>`;
  container.appendChild(toast);

  if (window.lucide) window.lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
window.showToast = showToast;

// ==========================================
// GESTÃO DA GALERIA & LIGHTBOX DO GF1
// ==========================================
let currentLightboxState = {
  mode: 'album', // 'album' | 'session'
  albumId: null,
  items: [],
  index: 0,
  isPlaying: false,
  timer: null
};

function selectFeaturedImage(albumId, index) {
  const gf1 = RENOVATE_CONFIG.gf1;
  if (!gf1 || !gf1.galleryAlbums) return;
  const album = gf1.galleryAlbums.find(a => a.id === albumId);
  if (!album || !album.images || !album.images[index]) return;

  const isEn = window.I18nManager && window.I18nManager.isEnglish();
  const img = album.images[index];
  const featuredImg = document.getElementById(`featured-img-${albumId}`);
  const featuredTitle = document.getElementById(`featured-title-${albumId}`);
  const featuredContainer = document.getElementById(`featured-container-${albumId}`);

  if (featuredImg) {
    featuredImg.src = img.src;
    featuredImg.alt = img.alt;
  }
  if (featuredTitle) {
    featuredTitle.textContent = (isEn && img.titleEn) ? img.titleEn : (img.title || "");
  }
  if (featuredContainer) {
    featuredContainer.onclick = () => openGf1Lightbox(albumId, index);
  }

  // Atualizar visual das miniaturas
  document.querySelectorAll(`.thumb-btn-${albumId}`).forEach((btn, i) => {
    if (i === index) {
      btn.className = `thumb-btn-${albumId} rounded-lg overflow-hidden border-2 transition-all aspect-square relative group/thumb border-[#F5B842] ring-2 ring-amber-300 opacity-100`;
    } else {
      btn.className = `thumb-btn-${albumId} rounded-lg overflow-hidden border-2 transition-all aspect-square relative group/thumb border-slate-200 hover:border-amber-400 opacity-80 hover:opacity-100`;
    }
  });
}

function openGf1Lightbox(albumId, index) {
  const gf1 = RENOVATE_CONFIG.gf1;
  if (!gf1 || !gf1.galleryAlbums) return;
  const album = gf1.galleryAlbums.find(a => a.id === albumId);
  if (!album) return;

  stopSlideshow();
  currentLightboxState.mode = 'album';
  currentLightboxState.albumId = albumId;
  currentLightboxState.items = [];
  currentLightboxState.index = index;

  updateLightboxContent();

  const modal = document.getElementById("gf1-lightbox-modal");
  if (modal) {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    if (window.lucide) window.lucide.createIcons();
  }
}

/**
 * Abre as fotografias da "Focus Group Sessions Gallery" em modo Slide Show / Lightbox
 */
function openSessionGallerySlideshow(index = 0) {
  const filtered = fgSessionsGallery.filter(item => currentSessionGalleryFilter === 'all' || item.session === currentSessionGalleryFilter);
  if (!filtered || filtered.length === 0) return;

  stopSlideshow();
  currentLightboxState.mode = 'session';
  currentLightboxState.albumId = null;
  currentLightboxState.items = filtered;
  currentLightboxState.index = Math.max(0, Math.min(index, filtered.length - 1));

  updateLightboxContent();

  const modal = document.getElementById("gf1-lightbox-modal");
  if (modal) {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    if (window.lucide) window.lucide.createIcons();
  }
}

function closeGf1Lightbox() {
  stopSlideshow();
  const modal = document.getElementById("gf1-lightbox-modal");
  if (modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
}

function toggleSlideshow() {
  if (currentLightboxState.isPlaying) {
    stopSlideshow();
  } else {
    startSlideshow();
  }
}

function startSlideshow() {
  if (currentLightboxState.isPlaying) return;
  currentLightboxState.isPlaying = true;
  updateSlideshowButtonUI();

  if (currentLightboxState.timer) clearInterval(currentLightboxState.timer);
  currentLightboxState.timer = setInterval(() => {
    navigateGf1Lightbox(1);
  }, 3500);
}

function stopSlideshow() {
  currentLightboxState.isPlaying = false;
  if (currentLightboxState.timer) {
    clearInterval(currentLightboxState.timer);
    currentLightboxState.timer = null;
  }
  updateSlideshowButtonUI();
}

function updateSlideshowButtonUI() {
  const btn = document.getElementById("btn-slideshow-toggle");
  const icon = document.getElementById("slideshow-icon");
  const text = document.getElementById("slideshow-text");
  if (!btn || !icon || !text) return;

  const isEn = window.I18nManager && window.I18nManager.isEnglish();
  const t = (k, fallback) => (window.I18nManager && typeof window.I18nManager.t === "function" ? window.I18nManager.t(k, fallback) : fallback);

  if (currentLightboxState.isPlaying) {
    btn.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFCC66] text-slate-950 ring-2 ring-amber-300 text-xs font-bold transition border border-white/20 cursor-pointer shadow-sm";
    icon.setAttribute("data-lucide", "pause");
    text.textContent = t("lightbox.pause", isEn ? "Pause" : "Pausar");
  } else {
    btn.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-[#FFCC66] text-slate-200 hover:text-slate-950 text-xs font-bold transition border border-white/15 cursor-pointer";
    icon.setAttribute("data-lucide", "play");
    text.textContent = t("lightbox.slideshow", isEn ? "Slide Show" : "Slide Show");
  }
  if (window.lucide) window.lucide.createIcons();
}

function navigateGf1Lightbox(direction) {
  let totalCount = 0;
  if (currentLightboxState.mode === 'session') {
    totalCount = (currentLightboxState.items || []).length;
  } else {
    const gf1 = RENOVATE_CONFIG.gf1;
    if (!gf1 || !gf1.galleryAlbums || !currentLightboxState.albumId) return;
    const album = gf1.galleryAlbums.find(a => a.id === currentLightboxState.albumId);
    if (!album || !album.images) return;
    totalCount = album.images.length;
  }

  if (totalCount === 0) return;

  let newIndex = currentLightboxState.index + direction;
  if (newIndex < 0) newIndex = totalCount - 1;
  if (newIndex >= totalCount) newIndex = 0;

  currentLightboxState.index = newIndex;
  updateLightboxContent();
}

function updateLightboxContent() {
  const imgEl = document.getElementById("gf1-lightbox-img");
  const albumEl = document.getElementById("gf1-lightbox-album");
  const titleEl = document.getElementById("gf1-lightbox-title");
  const counterEl = document.getElementById("gf1-lightbox-counter");

  let currentItem = null;
  let totalCount = 0;
  let singleCaption = "";

  if (currentLightboxState.mode === 'session') {
    const items = currentLightboxState.items || [];
    totalCount = items.length;
    if (totalCount === 0) return;
    if (currentLightboxState.index >= totalCount) currentLightboxState.index = 0;
    if (currentLightboxState.index < 0) currentLightboxState.index = totalCount - 1;

    currentItem = items[currentLightboxState.index];
    if (!currentItem) return;

    let sessionName = '1st Focus Group';
    if (currentItem.session === 'fg2') {
      sessionName = '2nd Focus Group';
    } else if (currentItem.session === 'fg3') {
      sessionName = '3rd Focus Group';
    } else if (currentItem.label) {
      sessionName = currentItem.label;
    }
    singleCaption = `Focus Group Sessions Gallery - ${sessionName}`;
  } else {
    const gf1 = RENOVATE_CONFIG.gf1;
    if (!gf1 || !gf1.galleryAlbums || !currentLightboxState.albumId) return;
    const album = gf1.galleryAlbums.find(a => a.id === currentLightboxState.albumId);
    if (!album || !album.images) return;

    totalCount = album.images.length;
    if (currentLightboxState.index >= totalCount) currentLightboxState.index = 0;
    if (currentLightboxState.index < 0) currentLightboxState.index = totalCount - 1;

    currentItem = album.images[currentLightboxState.index];
    if (!currentItem) return;

    singleCaption = "Focus Group Sessions Gallery - 1st Focus Group";
  }

  if (imgEl && currentItem) {
    imgEl.src = currentItem.src;
    imgEl.alt = singleCaption;
  }
  if (albumEl) {
    albumEl.textContent = singleCaption;
    albumEl.className = "font-bold text-white text-xs sm:text-sm block truncate";
  }
  if (titleEl) {
    titleEl.textContent = "";
    titleEl.style.display = "none";
  }
  if (counterEl) {
    counterEl.textContent = `${currentLightboxState.index + 1} / ${totalCount}`;
  }

  updateSlideshowButtonUI();
}

function initGF1LightboxEvents() {
  const closeBtn = document.getElementById("btn-close-gf1-lightbox");
  const prevBtn = document.getElementById("btn-prev-gf1-lightbox");
  const nextBtn = document.getElementById("btn-next-gf1-lightbox");
  const slideshowBtn = document.getElementById("btn-slideshow-toggle");
  const modal = document.getElementById("gf1-lightbox-modal");

  if (closeBtn) closeBtn.onclick = closeGf1Lightbox;
  if (prevBtn) prevBtn.onclick = () => { stopSlideshow(); navigateGf1Lightbox(-1); };
  if (nextBtn) nextBtn.onclick = () => { stopSlideshow(); navigateGf1Lightbox(1); };
  if (slideshowBtn) slideshowBtn.onclick = toggleSlideshow;

  if (modal) {
    modal.onclick = (e) => {
      if (e.target === modal) closeGf1Lightbox();
    };
  }

  document.addEventListener("keydown", (e) => {
    if (modal && !modal.classList.contains("hidden")) {
      if (e.key === "Escape") closeGf1Lightbox();
      if (e.key === "ArrowLeft") { stopSlideshow(); navigateGf1Lightbox(-1); }
      if (e.key === "ArrowRight") { stopSlideshow(); navigateGf1Lightbox(1); }
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        toggleSlideshow();
      }
    }
  });
}

window.selectFeaturedImage = selectFeaturedImage;
window.openGf1Lightbox = openGf1Lightbox;
window.openSessionGallerySlideshow = openSessionGallerySlideshow;
window.closeGf1Lightbox = closeGf1Lightbox;
window.navigateGf1Lightbox = navigateGf1Lightbox;
window.toggleSlideshow = toggleSlideshow;
window.startSlideshow = startSlideshow;
window.stopSlideshow = stopSlideshow;

// Exposição explícita para o I18nManager
window.renderSchedule = renderSchedule;
window.renderGF1 = renderGF1;
window.renderSessionGallery = renderSessionGallery;
window.initSessionGalleryFilters = initSessionGalleryFilters;
window.fgSessionsGallery = fgSessionsGallery;
window.renderQuestionnaireGuide = renderQuestionnaireGuide;
window.renderResultsAndMedia = renderResultsAndMedia;
window.renderPartners = renderPartners;
window.initVideoSlider = initVideoSlider;
window.showToast = showToast;
