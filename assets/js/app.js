/**
 * RENOVATE FG2 - Aplicação Principal (SPA Router & UI Handler)
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Inicializar LiveSession
  LiveSession.init();

  // 2. Inicializar Router de Tabs
  initTabNavigation();

  // 3. Renderizar Componentes Dinâmicos (Programa, GF1, Resultados, Parceiros)
  renderSchedule();
  renderGF1();
  renderResultsAndMedia();
  renderPartners();

  // 4. Inicializar Modais e Event Listeners
  initModeratorModal();
  initParticipantCodeEvents();
  initSideNoteBanner();

  // 5. Inicializar Ícones Lucide
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

/**
 * Gestão de Tabs da SPA com suporte a Hash na URL (#live, #program, #gf1, #results)
 */
function initTabNavigation() {
  const tabs = ["live", "program", "gf1", "results"];
  const navButtons = document.querySelectorAll(".nav-tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  function switchTab(targetTab) {
    // Normalizar aliases (ex: fg1 e gf1)
    if (targetTab === "gf1") targetTab = "fg1";
    if (!tabs.includes(targetTab)) targetTab = "live";

    // Atualizar Botões de Navegação
    navButtons.forEach(btn => {
      let btnTab = btn.getAttribute("data-tab");
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

  // Ler hash inicial ou usar ?tab=X
  const urlParams = new URLSearchParams(window.location.search);
  const tabParam = urlParams.get("tab");
  const initialHash = window.location.hash.replace("#", "");

  if (tabs.includes(tabParam)) {
    switchTab(tabParam);
  } else if (tabs.includes(initialHash)) {
    switchTab(initialHash);
  } else {
    switchTab("live");
  }

  window.addEventListener("hashchange", () => {
    const newHash = window.location.hash.replace("#", "");
    if (tabs.includes(newHash)) {
      switchTab(newHash);
    }
  });
}

/**
 * Renderização da Tabela do Programa Oficial
 */
function renderSchedule() {
  const container = document.getElementById("schedule-container");
  if (!container || !RENOVATE_CONFIG.schedule) return;

  container.innerHTML = RENOVATE_CONFIG.schedule.map((item, index) => `
    <div class="relative pl-8 pb-8 border-l-2 border-amber-300 last:border-l-0 last:pb-0">
      <div class="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-[#FFCC66] border-2 border-slate-900 flex items-center justify-center text-slate-900 shadow-sm">
        <i data-lucide="${item.icon || 'clock'}" class="w-4 h-4"></i>
      </div>
      <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span class="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
            <i data-lucide="clock" class="w-3.5 h-3.5 mr-1 text-slate-500"></i> ${item.time}
          </span>
          <span class="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
            ${item.badge}
          </span>
        </div>
        <h3 class="text-lg font-bold text-slate-900 mb-1">${item.title}</h3>
        <p class="text-xs font-medium text-amber-800 mb-2 flex items-center gap-1">
          <i data-lucide="user" class="w-3.5 h-3.5"></i> ${item.speaker}
        </p>
        <p class="text-sm text-slate-600 leading-relaxed">${item.description}</p>
      </div>
    </div>
  `).join("");
}

/**
 * Renderização dos Dados Históricos do Grupo Focal 1 (Lisboa)
 */
function renderGF1() {
  const metricsContainer = document.getElementById("gf1-metrics-container");
  const highlightsContainer = document.getElementById("gf1-highlights-container");
  if (!metricsContainer || !highlightsContainer || !RENOVATE_CONFIG.gf1) return;

  const gf1 = RENOVATE_CONFIG.gf1;

  metricsContainer.innerHTML = gf1.metrics.map(m => `
    <div class="bg-white p-5 rounded-xl border border-slate-200 text-center shadow-sm">
      <div class="text-3xl font-extrabold text-slate-900 mb-1">${m.value}</div>
      <div class="text-xs font-semibold text-slate-600 uppercase tracking-wider">${m.label}</div>
    </div>
  `).join("");

  highlightsContainer.innerHTML = gf1.highlights.map(h => `
    <li class="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <div class="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 font-bold">
        <i data-lucide="check" class="w-3.5 h-3.5"></i>
      </div>
      <span class="text-sm text-slate-700 font-medium">${h}</span>
    </li>
  `).join("");
}

/**
 * Renderização dos Resultados, Deliverable 1.4 & Media Hub
 */
function renderResultsAndMedia() {
  const delivContainer = document.getElementById("deliverable-highlights-container");
  const galleryContainer = document.getElementById("media-gallery-container");
  if (!delivContainer || !galleryContainer || !RENOVATE_CONFIG.resultsMedia) return;

  const results = RENOVATE_CONFIG.resultsMedia;

  delivContainer.innerHTML = results.deliverable.highlights.map(h => `
    <li class="flex items-start gap-2.5 text-sm text-slate-700">
      <i data-lucide="arrow-right-circle" class="w-4 h-4 text-amber-600 shrink-0 mt-0.5"></i>
      <span>${h}</span>
    </li>
  `).join("");

  galleryContainer.innerHTML = results.gallery.map(img => `
    <div class="group relative bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition">
      <div class="h-44 bg-gradient-to-tr ${img.placeholderColor} flex items-center justify-center text-slate-800 p-4 text-center">
        <div class="space-y-1">
          <i data-lucide="image" class="w-8 h-8 mx-auto opacity-70"></i>
          <span class="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/80 text-slate-900">${img.tag}</span>
        </div>
      </div>
      <div class="p-4">
        <h4 class="font-bold text-slate-900 text-sm mb-1">${img.title}</h4>
        <p class="text-xs text-slate-600">${img.caption}</p>
      </div>
    </div>
  `).join("");
}

/**
 * Renderização da Lista de Parceiros Oficiais do Consórcio RENOVATE
 */
/**
 * Renderização da Secção de Parceiros Oficiais do Consórcio RENOVATE
 * Alinhada com a infografia oficial (16 parceiros, 8 países) + ESAS Anfitrião
 */
function renderPartners() {
  const container = document.getElementById("partners-list-container");
  const hostContainer = document.getElementById("host-partner-container");
  if (!container || !RENOVATE_CONFIG.partners) return;

  // 1. Renderizar Parceiro Anfitrião (ESAS) com caixa ampla e logótipo de grande visibilidade
  if (hostContainer && RENOVATE_CONFIG.hostPartner) {
    const host = RENOVATE_CONFIG.hostPartner;
    hostContainer.innerHTML = `
      <div class="bg-gradient-to-r from-emerald-50 via-amber-50/40 to-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5">
        <div class="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-5 text-center sm:text-left">
          <!-- Logótipo ESAS em tamanho de destaque e proporção original -->
          <div class="w-56 sm:w-64 md:w-72 h-24 sm:h-28 bg-white rounded-2xl border-2 border-emerald-200 p-3 sm:p-4 flex items-center justify-center shrink-0 shadow-md">
            <img src="${host.logo}" alt="${host.name}" class="max-h-20 sm:max-h-24 w-auto max-w-full object-contain">
          </div>
          <div>
            <div class="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase px-2.5 py-1 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
              <i data-lucide="map-pin" class="w-3.5 h-3.5 text-emerald-700"></i> ${host.role}
            </div>
            <h4 class="text-lg sm:text-xl font-extrabold text-slate-900 mt-1.5 leading-snug">${host.name}</h4>
            <p class="text-xs sm:text-sm text-slate-600 mt-0.5">Local de realização da 2ª Sessão do Grupo Focal • Santarém, Portugal</p>
          </div>
        </div>
        <a href="${host.url}" target="_blank" rel="noopener noreferrer" 
           class="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold transition shadow-sm">
          <span>Website ESAS</span>
          <i data-lucide="external-link" class="w-4 h-4"></i>
        </a>
      </div>
    `;
  }

  // 2. Renderizar a Grelha dos 16 Parceiros do Consórcio com Logótipos Grandes e Nitidez Total
  container.innerHTML = RENOVATE_CONFIG.partners.map(p => `
    <div class="group bg-white rounded-2xl border-2 border-slate-200 hover:border-[#F5B842] hover:shadow-xl transition-all duration-200 p-4 sm:p-5 flex flex-col items-center justify-between text-center min-h-[220px]">
      <!-- Logótipo Centrado e Ampliado -->
      <div class="h-28 w-full flex items-center justify-center p-2" title="${p.name} (${p.role})">
        <img src="${p.logo}" alt="${p.name}" class="max-h-24 max-w-[92%] w-auto object-contain transition-transform duration-200 group-hover:scale-105" loading="lazy">
      </div>

      <!-- País em Português e Ligação ao Website -->
      <div class="w-full pt-3.5 border-t border-slate-100 space-y-2">
        <div class="flex items-center justify-center gap-1.5 text-xs text-emerald-800 font-bold">
          <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
          <span>${p.countryPt || p.country}</span>
        </div>
        <a href="${p.url}" target="_blank" rel="noopener noreferrer" 
           class="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#0F172A] bg-slate-50 hover:bg-[#FFCC66] px-3 py-1.5 rounded-lg border border-slate-200 transition-colors w-full"
           title="Abrir website de ${p.name}">
          <span>Website</span>
          <i data-lucide="external-link" class="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-900"></i>
        </a>
      </div>
    </div>
  `).join("");

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

  // Checkboxes de progresso da Sessão ao Vivo
  for (let i = 1; i <= 4; i++) {
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

    container.innerHTML = [1, 2, 3, 4, 5].map(step => {
      const isUnlocked = state.unlockedSteps.includes(step);
      return `
        <div class="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white">
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-slate-900 text-[#FFCC66] text-xs font-bold flex items-center justify-center">${step}</span>
            <span class="text-sm font-semibold text-slate-800">Passo ${step}</span>
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
}

/**
 * Side Note Banner (EuroTech Day)
 */
function initSideNoteBanner() {
  const dismissBtn = document.getElementById("btn-dismiss-sidenote");
  const banner = document.getElementById("eurotech-sidenote-banner");
  if (dismissBtn && banner) {
    dismissBtn.addEventListener("click", () => {
      banner.style.display = "none";
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
