/**
 * RENOVATE FG2 - Aplicação Principal (SPA Router & UI Handler)
 */

document.addEventListener("DOMContentLoaded", () => {
  // 0. Inicializar Gestor de Idioma (i18n)
  if (window.I18nManager) {
    window.I18nManager.init();
  }

  // 1. Inicializar LiveSession
  LiveSession.init();

  // 2. Inicializar Router de Tabs
  initTabNavigation();

  // 3. Renderizar Componentes Dinâmicos (Programa, GF1, Resultados, Parceiros)
  renderSchedule();
  renderGF1();
  renderResultsAndMedia();
  renderPartners();

  // 4. Inicializar Dashboard de Resultados (Google Sheets, Chart.js & WordCloud)
  if (window.ResultsDashboard) {
    ResultsDashboard.init();
  }

  // 5. Inicializar Modais e Event Listeners
  initModeratorModal();
  initParticipantCodeEvents();
  initGF1LightboxEvents();

  // 6. Inicializar Ícones Lucide
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

/**
 * Gestão de Tabs da SPA com suporte a Hash na URL (#live, #program, #fg1, #results)
 */
function initTabNavigation() {
  const tabs = ["live", "program", "fg1", "results"];
  const navButtons = document.querySelectorAll(".nav-tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  function switchTab(rawTab) {
    let targetTab = (rawTab || "").trim().toLowerCase();
    // Normalizar aliases (ex: gf1 -> fg1)
    if (targetTab === "gf1") targetTab = "fg1";
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
    if (targetTab === "results" && window.ResultsDashboard) {
      ResultsDashboard.onTabShown();
    }

    // Garantir renderização imediata do GF1 ao abrir a aba
    if (targetTab === "fg1") {
      renderGF1();
    }

    // Atualizar Hash sem scroll forçado
    if (window.location.hash !== `#${targetTab}`) {
      history.replaceState(null, null, `#${targetTab}`);
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
      e.preventDefault();
      switchTab("live");
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

  window.addEventListener("hashchange", () => {
    const newHash = window.location.hash.replace("#", "");
    if (newHash) {
      switchTab(newHash);
    }
  });
}

/**
 * Renderização da Tabela do Programa Oficial em Acordeões Interativos (11 Etapas)
 */
function renderSchedule() {
  const container = document.getElementById("schedule-container");
  if (!container || !RENOVATE_CONFIG.schedule) return;

  const isEn = window.I18nManager && window.I18nManager.isEnglish();

  // Recuperar o último acordeão aberto (por defeito: slot-1 "Sessão de Abertura")
  const savedOpenSlot = localStorage.getItem("renovate_last_open_slot") || "slot-1";

  container.innerHTML = RENOVATE_CONFIG.schedule.map((item, index) => {
    const itemTitle = (isEn && item.titleEn) ? item.titleEn : item.title;
    const itemSpeaker = (isEn && item.speakerEn) ? item.speakerEn : item.speaker;
    const itemBadge = (isEn && item.badgeEn) ? item.badgeEn : item.badge;
    const itemDesc = (isEn && item.descriptionEn) ? item.descriptionEn : item.description;

    // Conteúdo embutido de acordo com o tipo da fase
    let embeddedContent = "";

    if (item.type === "slides") {
      embeddedContent = `
        <div class="space-y-3 pt-2">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <span class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <i data-lucide="presentation" class="w-4 h-4 text-amber-600"></i>
              ${isEn ? "Official Session Presentation" : "Apresentação Oficial da Sessão"}
            </span>
            <a href="${RENOVATE_CONFIG.externalLinks.googleSlidesFullscreen || 'https://docs.google.com/presentation'}" 
               target="_blank" rel="noopener noreferrer" 
               class="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition">
              <i data-lucide="maximize-2" class="w-3.5 h-3.5"></i>
              <span>${isEn ? "Fullscreen / Open Slides" : "Ecrã Inteiro / Abrir Slides"}</span>
            </a>
          </div>

          <div class="aspect-16-9 bg-slate-900 rounded-xl overflow-hidden shadow-inner">
            <iframe 
              src="${RENOVATE_CONFIG.externalLinks.googleSlidesUrl}" 
              title="Apresentação Google Slides - RENOVATE FG2"
              allowfullscreen="true" 
              mozallowfullscreen="true" 
              webkitallowfullscreen="true">
            </iframe>
          </div>
          <p class="text-[11px] text-slate-500 italic">
            ${isEn ? "Slides accompany the FG1 summary and practical framework of the digital tools." : "Os diapositivos acompanham a recapitulação do GF1 e o enquadramento prático das ferramentas digitais."}
          </p>
        </div>
      `;
    } else if (item.type === "game") {
      embeddedContent = `
        <div class="accordion-actions-3 p-4 bg-purple-50/60 rounded-xl border border-purple-200 space-y-3">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center gap-1.5 text-xs font-bold text-purple-900">
              <i data-lucide="smartphone" class="w-4 h-4"></i>
              <span>${isEn ? "Recommended Device: Smartphone or Tablet" : "Dispositivo Recomendado: Smartphone ou Tablet"}</span>
            </div>
            <div class="accordion-lock-badge-3"></div>
          </div>
          <p class="text-xs text-slate-600">
            ${isEn ? "Access the game platform and complete the interactive sprayer calibration modules at your own pace." : "Aceda à plataforma de jogo e conclua os módulos interativos de calibração fitossanitária no seu próprio ritmo."}
          </p>
          <div class="flex flex-wrap gap-2 pt-1">
            <a id="btn-schedule-tallentto" href="${item.url || (RENOVATE_CONFIG.externalLinks && RENOVATE_CONFIG.externalLinks.seriousGameTallentto) || 'https://www.cordalgpt.ai/renovate/pruebas.php?pilot=calibration-pilot&lang=pt'}" target="_blank" rel="noopener noreferrer" 
               class="game-link-tallentto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FFCC66] hover:bg-[#FBBF24] text-[#0F172A] text-xs font-bold border border-slate-900 transition shadow-sm">
              <i data-lucide="gamepad-2" class="w-4 h-4"></i>
              <span>${isEn ? "Play Tallentto" : "Jogar Tallentto"}</span>
            </a>
          </div>
        </div>
      `;
    } else if (item.type === "form-game") {
      embeddedContent = `
        <div class="accordion-actions-3 p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-3">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center gap-1.5 text-xs font-bold text-blue-900">
              <i data-lucide="clipboard-check" class="w-4 h-4"></i>
              <span>${isEn ? "Pedagogical Evaluation Questionnaire" : "Questionário de Avaliação Pedagógica"}</span>
            </div>
            <div class="accordion-lock-badge-3"></div>
          </div>
          <p class="text-xs text-slate-600">
            ${isEn ? "Submit your feedback on gameplay, clarity, and training utility. Your participant code is automatically attached." : "Registe as suas respostas sobre a jogabilidade, clareza e utilidade formativa. O seu código de participante será associado automaticamente."}
          </p>
          <div class="pt-1">
            <a href="${RENOVATE_CONFIG.externalLinks.googleFormGameTallentto}" target="_blank" rel="noopener noreferrer" 
               class="form-link-game inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm">
              <i data-lucide="clipboard-list" class="w-4 h-4 text-[#FFCC66]"></i>
              <span>${isEn ? "Open Serious Game Evaluation (Form 1)" : "Abrir Avaliação Serious Game (Form 1)"}</span>
            </a>
          </div>
        </div>
      `;
    } else if (item.type === "simulator") {
      embeddedContent = `
        <div class="accordion-actions-4 p-4 bg-sky-50/60 rounded-xl border border-sky-200 space-y-3">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center gap-1.5 text-xs font-bold text-sky-900">
              <i data-lucide="monitor" class="w-4 h-4"></i>
              <span>${isEn ? "Recommended Device: PC or Laptop" : "Dispositivo Recomendado: Computador PC ou Portátil"}</span>
            </div>
            <div class="accordion-lock-badge-4"></div>
          </div>
          <p class="text-xs text-slate-600">
            ${isEn ? "Explore the 3D simulation environment to test spray nozzle variations, speed, and weather conditions." : "Explore o ambiente de simulação 3D para testar variações de bicos de pulverização, velocidade e condições meteorológicas."}
          </p>
          <div class="flex flex-wrap gap-2 pt-1">
            <a id="btn-schedule-simulator" href="${item.url || (RENOVATE_CONFIG.externalLinks && RENOVATE_CONFIG.externalLinks.simulatorVirmedex) || 'https://simulator.renovateproject.eu/auth/login'}" target="_blank" rel="noopener noreferrer" 
               class="simulator-link-virmedex inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FFCC66] hover:bg-[#FBBF24] text-[#0F172A] text-xs font-bold border border-slate-900 transition shadow-sm">
              <i data-lucide="laptop" class="w-4 h-4"></i>
              <span>${isEn ? "Open RENOVATE Simulator" : "Abrir Simulador RENOVATE"}</span>
            </a>
          </div>
        </div>
      `;
    } else if (item.type === "form-simulator") {
      embeddedContent = `
        <div class="accordion-actions-4 p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-3">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center gap-1.5 text-xs font-bold text-blue-900">
              <i data-lucide="clipboard-check" class="w-4 h-4"></i>
              <span>${isEn ? "Technical Evaluation Questionnaire" : "Questionário de Avaliação Técnica"}</span>
            </div>
            <div class="accordion-lock-badge-4"></div>
          </div>
          <p class="text-xs text-slate-600">
            ${isEn ? "Validation of agronomic fidelity, learning curve, and field decision-support applicability." : "Validação da fidelidade agronómica, curva de aprendizagem e aplicabilidade no apoio à decisão no campo."}
          </p>
          <div class="pt-1">
            <a href="${RENOVATE_CONFIG.externalLinks.googleFormSimVirmedex}" target="_blank" rel="noopener noreferrer" 
               class="form-link-sim inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm">
              <i data-lucide="clipboard-list" class="w-4 h-4 text-[#FFCC66]"></i>
              <span>${isEn ? "Open Simulator Evaluation (Form 2)" : "Abrir Avaliação Simulador (Form 2)"}</span>
            </a>
          </div>
        </div>
      `;
    } else if (item.type === "form-global") {
      embeddedContent = `
        <div class="accordion-actions-5 p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-3">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
              <i data-lucide="check-check" class="w-4 h-4"></i>
              <span>${isEn ? "Synthesis & Overall Satisfaction Survey" : "Inquérito de Síntese & Satisfação Geral"}</span>
            </div>
            <div class="accordion-lock-badge-5"></div>
          </div>
          <p class="text-xs text-slate-600">
            ${isEn ? "Overall rating of training impact, agricultural operator certification feasibility, and priorities for the RENOVATE project." : "Classificação global do impacto pedagógico, viabilidade de certificação de operadores agrários e prioridades para o projeto RENOVATE."}
          </p>
          <div class="pt-1">
            <a href="${RENOVATE_CONFIG.externalLinks.googleFormGlobal}" target="_blank" rel="noopener noreferrer" 
               class="form-link-global inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm">
              <i data-lucide="check-check" class="w-4 h-4 text-[#FFCC66]"></i>
              <span>${isEn ? "Submit Overall Evaluation" : "Submeter Avaliação Global"}</span>
            </a>
          </div>
        </div>
      `;
    } else if (item.type === "opening") {
      embeddedContent = `
        <div class="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div class="space-y-1">
            <span class="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <i data-lucide="map-pin" class="w-4 h-4 text-emerald-700"></i>
              ${isEn ? "School of Agriculture of Santarém (Auditorium)" : "Escola Superior Agrária de Santarém (Auditório)"}
            </span>
            <p class="text-xs text-slate-600">${isEn ? "Welcome address by ESAS leadership, credential check, and overview of the agenda." : "Acolhimento da direção da ESAS, verificação das credenciais e introdução da agenda de trabalho."}</p>
          </div>
          <a href="https://www.ipsantarem.pt/escola-superior-agraria-de-santarem/" target="_blank" rel="noopener noreferrer" 
             class="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline">
            <span>${isEn ? "ESAS Portal" : "Portal ESAS"}</span>
            <i data-lucide="arrow-up-right" class="w-3.5 h-3.5"></i>
          </a>
        </div>
      `;
    } else if (item.type === "break") {
      embeddedContent = `
        <div class="p-4 bg-amber-50/50 rounded-xl border border-amber-200 flex items-center gap-3 text-xs text-amber-900">
          <div class="w-9 h-9 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
            <i data-lucide="coffee" class="w-5 h-5"></i>
          </div>
          <p>${isEn ? "Coffee break, rest, and informal networking between trainers, agricultural advisors, and researchers in the ESAS reception area." : "Momento de pausa técnica e convívio informal entre formadores, consultores e investigadores agrícolas na área de receção da ESAS."}</p>
        </div>
      `;
    } else if (item.type === "lunch") {
      embeddedContent = `
        <div class="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 flex items-center gap-3 text-xs text-emerald-900">
          <div class="w-9 h-9 rounded-full bg-emerald-200 text-emerald-900 flex items-center justify-center shrink-0">
            <i data-lucide="utensils" class="w-5 h-5"></i>
          </div>
          <p>${isEn ? "Standing buffet lunch hosted by the organisation for all invited participants of the 2nd Focus Group session." : "Almoço volante de networking oferecido pela organização a todos os participantes convidados da 2ª sessão do Grupo Focal."}</p>
        </div>
      `;
    } else if (item.type === "discussion") {
      embeddedContent = `
        <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <div class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <i data-lucide="line-chart" class="w-4 h-4 text-amber-600"></i>
            ${isEn ? "Auditorium Discussion Topics" : "Tópicos de Debate em Auditório"}
          </div>
          <ul class="text-xs text-slate-600 space-y-1 list-disc list-inside">
            ${isEn ? `
              <li>Projection and reflection on submitted questionnaire responses.</li>
              <li>Barriers identified in using digital tools within real-world farm contexts.</li>
              <li>Practical recommendations for the international RENOVATE consortium.</li>
            ` : `
              <li>Projeção e reflexão sobre as respostas submetidas nos questionários.</li>
              <li>Barreiras identificadas na utilização das ferramentas em contexto real de exploração.</li>
              <li>Sugestões práticas de melhoria para o consórcio internacional RENOVATE.</li>
            `}
          </ul>
        </div>
      `;
    } else if (item.type === "closing") {
      embeddedContent = `
        <div class="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
          <div class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <i data-lucide="award" class="w-4 h-4 text-amber-700"></i>
            ${isEn ? "Closing of Proceedings & Access to Reports" : "Encerramento dos Trabalhos & Acesso a Relatórios"}
          </div>
          <p class="text-xs text-slate-600">
            ${isEn ? "Thank you to all participants for active contribution. Consolidated findings will be integrated into Project Deliverable 1.4." : "Agradecimento a todos os participantes pela contribuição ativa. Os resultados consolidados serão integrados no Deliverable 1.4 do projeto."}
          </p>
        </div>
      `;
    }

    const isOpen = item.id === savedOpenSlot ? "open" : "";

    return `
      <details id="${item.id}-details" class="schedule-accordion accordion-step-${item.step || ''} group bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm hover:border-[#F5B842] transition-all" ${isOpen}>
        <summary class="flex items-center justify-between gap-3 p-4 sm:p-5 select-none bg-white hover:bg-slate-50 transition-colors">
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
            <span class="hidden md:inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${item.badgeColor || 'bg-amber-100 text-amber-900 border-amber-300'} border">
              <i data-lucide="${item.icon || 'circle'}" class="w-3 h-3"></i>
              ${itemBadge}
            </span>
            ${item.step ? `<div class="accordion-lock-badge-${item.step} hidden sm:block"></div>` : ''}
            <i data-lucide="chevron-down" class="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform duration-200 shrink-0"></i>
          </div>
        </summary>

        <div class="px-4 sm:px-6 pb-5 pt-3 border-t border-slate-100 space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
            <span class="font-medium text-amber-800 flex items-center gap-1.5">
              <i data-lucide="user" class="w-3.5 h-3.5"></i>
              <strong>${isEn ? "Speakers:" : "Intervenientes:"}</strong> ${itemSpeaker}
            </span>
            ${item.step ? `<div class="accordion-lock-badge-${item.step} sm:hidden"></div>` : ''}
          </div>
          <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
            ${itemDesc}
          </p>
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
      document.querySelectorAll(".schedule-accordion").forEach(d => d.open = true);
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
    window.LiveSession.render();
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
 * Renderização dos Resultados, Deliverable 1.4 & Media Hub
 */
function renderResultsAndMedia() {
  const delivContainer = document.getElementById("deliverable-highlights-container");
  const galleryContainer = document.getElementById("media-gallery-container");
  if (!delivContainer || !galleryContainer || !RENOVATE_CONFIG.resultsMedia) return;

  const results = RENOVATE_CONFIG.resultsMedia;
  const isEn = window.I18nManager && window.I18nManager.isEnglish();
  const delivList = (isEn && results.deliverable.highlightsEn) ? results.deliverable.highlightsEn : results.deliverable.highlights;

  delivContainer.innerHTML = delivList.map(h => `
    <li class="flex items-start gap-2.5 text-sm text-slate-700">
      <i data-lucide="arrow-right-circle" class="w-4 h-4 text-amber-600 shrink-0 mt-0.5"></i>
      <span>${h}</span>
    </li>
  `).join("");

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

  if (window.lucide) window.lucide.createIcons();
}

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

  // 2. Renderizar a Grelha dos 16 Parceiros do Consórcio com Logótipos Grandes e Nitidez Total
  container.innerHTML = RENOVATE_CONFIG.partners.map(p => {
    const pRole = (isEn && p.roleEn) ? p.roleEn : p.role;
    const pCountry = isEn ? p.country : (p.countryPt || p.country);
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
}

/**
 * Gestão do Código de Participante
 */
function initParticipantCodeEvents() {
  const saveBtn = document.getElementById("btn-save-participant-code");
  const input = document.getElementById("participant-code-input");

  if (saveBtn && input) {
    saveBtn.addEventListener("click", () => {
      const code = input.value.trim();
      if (LiveSession.setParticipantCode(code)) {
        showToast("Código de Participante atualizado com sucesso!");
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const code = input.value.trim();
        if (LiveSession.setParticipantCode(code)) {
          showToast("Código de Participante atualizado com sucesso!");
        }
      }
    });
  }

  // Checkboxes de progresso da Sessão ao Vivo (Passos 1 a 5)
  for (let i = 1; i <= 5; i++) {
    const chk = document.getElementById(`step-checkbox-${i}`);
    if (chk) {
      chk.addEventListener("change", () => {
        LiveSession.toggleStepCompleted(i);
      });
    }
  }
}

/**
 * Modal do Moderador (Opção C: PIN 2026 e Controlo de Desbloqueio)
 */
function initModeratorModal() {
  const modal = document.getElementById("moderator-modal");
  const openBtns = document.querySelectorAll(".btn-open-moderator-modal");
  const closeBtn = document.getElementById("btn-close-moderator-modal");
  const pinInput = document.getElementById("moderator-pin-input");
  const verifyBtn = document.getElementById("btn-verify-moderator-pin");
  const authSection = document.getElementById("moderator-auth-section");
  const panelSection = document.getElementById("moderator-panel-section");
  const pinError = document.getElementById("moderator-pin-error");

  const unlockAllBtn = document.getElementById("btn-mod-unlock-all");
  const resetBtn = document.getElementById("btn-mod-reset");

  if (!modal) return;

  function openModal() {
    modal.classList.remove("hidden");
    if (pinInput && !panelSection.classList.contains("hidden")) {
      // Já autenticado
    } else if (pinInput) {
      pinInput.value = "";
      pinInput.focus();
      if (pinError) pinError.classList.add("hidden");
    }
  }

  function closeModal() {
    modal.classList.add("hidden");
  }

  openBtns.forEach(btn => btn.addEventListener("click", openModal));
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  // Fechar ao clicar fora
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Verificação de PIN
  if (verifyBtn && pinInput) {
    verifyBtn.addEventListener("click", () => {
      checkPin();
    });
    pinInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") checkPin();
    });
  }

  function checkPin() {
    const pin = pinInput.value.trim();
    if (LiveSession.verifyModeratorPin(pin)) {
      authSection.classList.add("hidden");
      panelSection.classList.remove("hidden");
      updateModeratorControlList();
      showToast("Acesso de Moderador Confirmado!");
      if (window.lucide) window.lucide.createIcons();
    } else {
      if (pinError) {
        pinError.classList.remove("hidden");
        pinError.textContent = "PIN incorreto. Tente novamente.";
      }
    }
  }

  function updateModeratorControlList() {
    const container = document.getElementById("moderator-step-toggles");
    if (!container) return;

    const state = LiveSession.getState();

    const stepNames = {
      1: "Passo 1: Abertura & Identificação",
      2: "Passo 2: Apresentação (Slides)",
      3: "Passo 3: Serious Game & Form 2",
      4: "Passo 4: Simulador PC & Form 3",
      5: "Passo 5: Avaliação Global & Encerramento"
    };

    container.innerHTML = [1, 2, 3, 4, 5].map(step => {
      const isUnlocked = state.unlockedSteps.includes(step);
      return `
        <div class="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white">
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-slate-900 text-[#FFCC66] text-xs font-bold flex items-center justify-center">${step}</span>
            <span class="text-xs sm:text-sm font-semibold text-slate-800">${stepNames[step] || `Passo ${step}`}</span>
          </div>
          <button type="button" 
                  data-mod-step="${step}" 
                  class="btn-mod-toggle-step px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5
                         ${isUnlocked ? 'bg-rose-100 text-rose-800 hover:bg-rose-200' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'}">
            <i data-lucide="${isUnlocked ? 'lock' : 'unlock'}" class="w-3.5 h-3.5"></i>
            ${isUnlocked ? 'Bloquear' : 'Desbloquear'}
          </button>
        </div>
      `;
    }).join("");

    // Adicionar listeners nos toggles individuais
    container.querySelectorAll(".btn-mod-toggle-step").forEach(btn => {
      btn.addEventListener("click", () => {
        const stepNum = parseInt(btn.getAttribute("data-mod-step"), 10);
        if (state.unlockedSteps.includes(stepNum)) {
          LiveSession.lockStep(stepNum);
        } else {
          LiveSession.unlockStep(stepNum);
        }
        updateModeratorControlList();
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  // Desbloquear Tudo
  if (unlockAllBtn) {
    unlockAllBtn.addEventListener("click", () => {
      LiveSession.unlockAllSteps();
      updateModeratorControlList();
      showToast("Todos os passos foram desbloqueados!");
    });
  }

  // Repor Passos
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      LiveSession.lockStep(2);
      LiveSession.lockStep(3);
      LiveSession.lockStep(4);
      LiveSession.lockStep(5);
      updateModeratorControlList();
      showToast("Passos repostos ao estado inicial.");
    });
  }

  // Desbloquear até ao Passo X
  document.querySelectorAll(".btn-unlock-upto").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetStep = parseInt(btn.getAttribute("data-target-step"), 10);
      LiveSession.unlockUpToStep(targetStep);
      updateModeratorControlList();
      showToast(`Passos desbloqueados até ao Passo ${targetStep}!`);
    });
  });

  // Atalho para Configuração de Resultados & Google Sheets a partir da Modal
  const btnModResults = document.getElementById("btn-mod-goto-results");
  if (btnModResults) {
    btnModResults.addEventListener("click", () => {
      closeModal();
      const resultsBtn = document.querySelector('[data-tab="results"]');
      if (resultsBtn) resultsBtn.click();
      const drawer = document.getElementById("results-config-drawer");
      if (drawer) {
        drawer.classList.remove("hidden");
        setTimeout(() => {
          drawer.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 200);
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

// ==========================================
// GESTÃO DA GALERIA & LIGHTBOX DO GF1
// ==========================================
let currentLightboxState = {
  albumId: null,
  index: 0
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

  currentLightboxState.albumId = albumId;
  currentLightboxState.index = index;

  updateLightboxContent();

  const modal = document.getElementById("gf1-lightbox-modal");
  if (modal) {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    if (window.lucide) window.lucide.createIcons();
  }
}

function closeGf1Lightbox() {
  const modal = document.getElementById("gf1-lightbox-modal");
  if (modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
}

function navigateGf1Lightbox(direction) {
  const gf1 = RENOVATE_CONFIG.gf1;
  if (!gf1 || !gf1.galleryAlbums || !currentLightboxState.albumId) return;
  const album = gf1.galleryAlbums.find(a => a.id === currentLightboxState.albumId);
  if (!album || !album.images || album.images.length === 0) return;

  let newIndex = currentLightboxState.index + direction;
  if (newIndex < 0) newIndex = album.images.length - 1;
  if (newIndex >= album.images.length) newIndex = 0;

  currentLightboxState.index = newIndex;
  updateLightboxContent();
}

function updateLightboxContent() {
  const gf1 = RENOVATE_CONFIG.gf1;
  if (!gf1 || !gf1.galleryAlbums || !currentLightboxState.albumId) return;
  const album = gf1.galleryAlbums.find(a => a.id === currentLightboxState.albumId);
  if (!album || !album.images) return;

  const isEn = window.I18nManager && window.I18nManager.isEnglish();
  const img = album.images[currentLightboxState.index];
  if (!img) return;

  const imgEl = document.getElementById("gf1-lightbox-img");
  const albumEl = document.getElementById("gf1-lightbox-album");
  const titleEl = document.getElementById("gf1-lightbox-title");
  const counterEl = document.getElementById("gf1-lightbox-counter");

  if (imgEl) {
    imgEl.src = img.src;
    imgEl.alt = img.alt;
  }
  if (albumEl) {
    albumEl.textContent = (isEn && album.titleEn) ? album.titleEn : album.title;
  }
  if (titleEl) {
    titleEl.textContent = (isEn && img.titleEn) ? img.titleEn : (img.title || img.filename);
  }
  if (counterEl) {
    counterEl.textContent = `${currentLightboxState.index + 1} / ${album.images.length}`;
  }
}

function initGF1LightboxEvents() {
  const closeBtn = document.getElementById("btn-close-gf1-lightbox");
  const prevBtn = document.getElementById("btn-prev-gf1-lightbox");
  const nextBtn = document.getElementById("btn-next-gf1-lightbox");
  const modal = document.getElementById("gf1-lightbox-modal");

  if (closeBtn) closeBtn.onclick = closeGf1Lightbox;
  if (prevBtn) prevBtn.onclick = () => navigateGf1Lightbox(-1);
  if (nextBtn) nextBtn.onclick = () => navigateGf1Lightbox(1);

  if (modal) {
    modal.onclick = (e) => {
      if (e.target === modal) closeGf1Lightbox();
    };
  }

  document.addEventListener("keydown", (e) => {
    if (modal && !modal.classList.contains("hidden")) {
      if (e.key === "Escape") closeGf1Lightbox();
      if (e.key === "ArrowLeft") navigateGf1Lightbox(-1);
      if (e.key === "ArrowRight") navigateGf1Lightbox(1);
    }
  });
}

window.selectFeaturedImage = selectFeaturedImage;
window.openGf1Lightbox = openGf1Lightbox;
window.closeGf1Lightbox = closeGf1Lightbox;
window.navigateGf1Lightbox = navigateGf1Lightbox;

// Exposição explícita para o I18nManager
window.renderSchedule = renderSchedule;
window.renderGF1 = renderGF1;
window.renderResultsAndMedia = renderResultsAndMedia;
window.renderPartners = renderPartners;
window.showToast = showToast;
