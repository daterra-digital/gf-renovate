/**
 * RENOVATE FG2 - Dashboard de Resultados em Tempo Real
 * Integração com Google Sheets (Múltiplos Separadores), Chart.js e WordCloud
 * Escola Superior Agrária de Santarém | 06 Outubro 2026
 */

window.ResultsDashboard = (function () {
  const STORAGE_KEY = "renovate_results_sheet_config";

  // Stopwords em Português para limpeza e filtragem das Nuvens de Palavras
  const PT_STOPWORDS = new Set([
    "de", "a", "o", "que", "e", "do", "da", "em", "um", "para", "é", "com", "não", "uma", "os", "no", "se", "na",
    "por", "mais", "as", "dos", "como", "mas", "foi", "ao", "ele", "das", "tem", "à", "seu", "sua", "ou", "ser",
    "quando", "muito", "nos", "já", "eu", "também", "só", "pelo", "pela", "até", "isso", "ela", "entre", "era",
    "depois", "sem", "mesmo", "aos", "ter", "seus", "quem", "nas", "me", "esse", "eles", "estão", "você", "tinha",
    "foram", "essa", "num", "nem", "suas", "meu", "às", "minha", "têm", "numa", "pelos", "elas", "havia", "seja",
    "qual", "será", "nós", "tenho", "lhe", "deles", "essas", "esses", "pelas", "este", "fosse", "dele", "tu", "te",
    "vocês", "vos", "lhes", "meus", "minhas", "teu", "tua", "teus", "tuas", "nosso", "nossa", "nossos", "nossas",
    "dela", "delas", "pouco", "pouca", "bastante", "bem", "mal", "apenas", "tão", "cada", "onde", "tudo", "nada",
    "sim", "sobre", "ainda", "está", "estou", "estava", "1", "2", "3", "etc"
  ]);

  // Stopwords in English for word clouds
  const EN_STOPWORDS = new Set([
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with",
    "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
    "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if",
    "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just",
    "him", "know", "take", "people", "into", "year", "your", "good", "some", "could", "them", "see",
    "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", "back",
    "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because",
    "any", "these", "give", "day", "most", "us", "very", "much", "1", "2", "3", "etc"
  ]);

  // Paleta de Cores Oficial RENOVATE
  const PALETTE = {
    gold: "#F5B842",
    goldHover: "#E5A630",
    goldLight: "#FEF3C7",
    dark: "#0F172A",
    emerald: "#059669",
    emeraldLight: "#D1FAE5",
    blue: "#2563EB",
    blueLight: "#DBEAFE",
    amber: "#D97706",
    rose: "#E11D48",
    slateLight: "#F1F5F9",
    slateBorder: "#E2E8F0"
  };

  // Opções Oficiais do Questionário de Validação
  // Opções Oficiais do Questionário de Validação (Mapeamento Exato)
  const OFFICIAL_PROFILES = [
    "Agricultor(a) / Produtor(a)",
    "Técnico(a) / Consultor(a)",
    "Formador(a) / Prof. Ensino",
    "Representante da Indústria",
    "Entidade Reguladora / Admin. Pública",
    "Estudante",
    "Investigador(a)",
    "Outro"
  ];

  const PROFILE_TRANSLATIONS = {
    "Agricultor(a) / Produtor(a)": "Farmer / Producer",
    "Técnico(a) / Consultor(a)": "Technical Advisor / Consultant",
    "Formador(a) / Prof. Ensino": "Trainer / Agricultural Educator",
    "Representante da Indústria": "Industry Representative (Machinery / Agrochemicals)",
    "Entidade Reguladora / Admin. Pública": "Regulatory Entity / Public Administration",
    "Estudante": "Student",
    "Investigador(a)": "Researcher",
    "Outro": "Other"
  };

  const OFFICIAL_CROPS = [
    "Vinha",
    "Pomóideas / Prunóideas",
    "Olival",
    "Citrinos",
    "Cereais / Culturas arvenses",
    "Hortícolas"
  ];

  const CROP_TRANSLATIONS = {
    "Vinha": "Vineyards",
    "Pomóideas / Prunóideas": "Orchards (Pome/Stone fruit)",
    "Olival": "Olive groves",
    "Citrinos": "Citrus",
    "Cereais / Culturas arvenses": "Cereals / Arable crops",
    "Hortícolas": "Vegetables / Horticulture"
  };

  const OFFICIAL_Q29_OPTIONS = [
    "Nada Provável",
    "Pouco Provável",
    "Moderadamente Provável",
    "Muito Provável",
    "Extremamente Provável"
  ];

  const Q29_TRANSLATIONS = {
    "Extremamente provável": "Extremely likely",
    "Extremamente Provável": "Extremely likely",
    "Muito provável": "Very likely",
    "Muito Provável": "Very likely",
    "Moderavelmente provável": "Moderately likely",
    "Moderadamente Provável": "Moderately likely",
    "Pouco Provável": "Unlikely",
    "Pouco provável": "Unlikely",
    "Nada provável": "Not likely",
    "Nada Provável": "Not likely"
  };

  /**
   * Mapeamento de Legendas (Inglês/PT no Sheets -> Português na UI):
   * Farmer/Grower -> "Agricultor(a) / Produtor(a)"
   * Agricultural Advisor / Technician -> "Técnico(a) / Consultor(a)"
   * Trainer / Agricultural Education Professional -> "Formador(a) / Prof. Ensino"
   * Industry Representative (Machinery / Agrochemicals) -> "Representante da Indústria"
   * Regulator / Public Administration -> "Entidade Reguladora / Admin. Pública"
   * Student -> "Estudante"
   * Researcher -> "Investigador(a)"
   * Other: ______________ -> "Outro"
   */
  function normalizeProfile(val) {
    if (!val) return "Outro";
    const s = String(val).trim().toLowerCase();
    if (s.includes("farmer") || s.includes("grower") || s.includes("agricultor") || s.includes("produtor")) {
      return "Agricultor(a) / Produtor(a)";
    }
    if (s.includes("advisor") || s.includes("technician") || s.includes("técnico") || s.includes("tecnico") || s.includes("consultor")) {
      return "Técnico(a) / Consultor(a)";
    }
    if (s.includes("trainer") || s.includes("education") || s.includes("formador") || s.includes("ensino") || s.includes("professor") || s.includes("docente")) {
      return "Formador(a) / Prof. Ensino";
    }
    if (s.includes("industry") || s.includes("indústria") || s.includes("industria") || s.includes("machinery") || s.includes("maquinaria") || s.includes("agrochemical") || s.includes("agroquímico") || s.includes("agroquimico")) {
      return "Representante da Indústria";
    }
    if (s.includes("regulator") || s.includes("reguladora") || s.includes("administration") || s.includes("administração") || s.includes("administracao") || s.includes("public") || s.includes("pública") || s.includes("publica") || s.includes("governo")) {
      return "Entidade Reguladora / Admin. Pública";
    }
    if (s.includes("student") || s.includes("estudante") || s.includes("aluno")) {
      return "Estudante";
    }
    if (s.includes("researcher") || s.includes("investigador") || s.includes("pesquisador") || s.includes("cientista")) {
      return "Investigador(a)";
    }
    return "Outro";
  }

  /**
   * Mapeamento de Culturas (Inglês/PT no Sheets -> Português na UI):
   * Vineyards -> "Vinha"
   * Orchards (Pome/Stone fruit) -> "Pomóideas / Prunóideas"
   * Olive groves -> "Olival"
   * Citrus -> "Citrinos"
   * Cereals / Arable crops -> "Cereais / Culturas arvenses"
   * Vegetables / Horticulture -> "Hortícolas"
   */
  function normalizeCrop(val) {
    if (!val) return null;
    const s = String(val).trim().toLowerCase();
    if (s.includes("vineyard") || s.includes("vinha") || s.includes("vinhedo") || s.includes("viticultura") || s.includes("uva")) {
      return "Vinha";
    }
    if (s.includes("orchard") || s.includes("pome") || s.includes("stone") || s.includes("pomóidea") || s.includes("pomoidea") || s.includes("prunóidea") || s.includes("prunoidea") || s.includes("pomar") || s.includes("fruti") || s.includes("maçã") || s.includes("maca") || s.includes("pera") || s.includes("pessego") || s.includes("pêssego")) {
      return "Pomóideas / Prunóideas";
    }
    if (s.includes("olive") || s.includes("olival") || s.includes("oliva") || s.includes("azeite") || s.includes("oliveira")) {
      return "Olival";
    }
    if (s.includes("citrus") || s.includes("citrino") || s.includes("citrinos") || s.includes("laranja") || s.includes("limão") || s.includes("limao")) {
      return "Citrinos";
    }
    if (s.includes("cereal") || s.includes("cereais") || s.includes("arable") || s.includes("arvense") || s.includes("milho") || s.includes("trigo") || s.includes("cevada") || s.includes("arroz") || s.includes("grandes")) {
      return "Cereais / Culturas arvenses";
    }
    if (s.includes("vegetable") || s.includes("horticulture") || s.includes("hortícola") || s.includes("horticola") || s.includes("hortaliça") || s.includes("hortalica") || s.includes("legume") || s.includes("tomate")) {
      return "Hortícolas";
    }
    return null;
  }

  /**
   * Extrai o dígito numérico inicial (escala 1 a 5) da Literacia Digital (Q6)
   */
  function parseDigitalComfort(val) {
    if (val === null || val === undefined) return null;
    const s = String(val).trim();
    if (!s) return null;
    const match = s.match(/^([1-5])/);
    if (match) {
      return parseInt(match[1], 10);
    }
    const lower = s.toLowerCase();
    if (lower.includes("muito desconfortável") || lower.includes("muito desconfortavel") || lower.includes("very uncomfortable")) return 1;
    if (lower.includes("muito confortável") || lower.includes("muito confortavel") || lower.includes("very comfortable")) return 5;
    if (lower.includes("desconfortável") || lower.includes("desconfortavel") || lower.includes("uncomfortable")) return 2;
    if (lower.includes("confortável") || lower.includes("confortavel") || lower.includes("comfortable")) return 4;
    if (lower.includes("neutro") || lower.includes("nem") || lower.includes("neutral")) return 3;
    const anyDigit = s.match(/[1-5]/);
    return anyDigit ? parseInt(anyDigit[0], 10) : null;
  }

  /**
   * Rótulo Qualitativo Dinâmico (arredondar a média para o inteiro mais próximo):
   * Média ≈ 1 -> "Muito Desconfortável (Nível 1/5)"
   * Média ≈ 2 -> "Desconfortável (Nível 2/5)"
   * Média ≈ 3 -> "Neutro (Nível 3/5)"
   * Média ≈ 4 -> "Confortável (Nível 4/5)"
   * Média ≈ 5 -> "Muito Confortável (Nível 5/5)"
   */
  function getComfortLevelLabel(avg, isEn = false) {
    if (avg === null || avg === undefined || isNaN(avg) || avg <= 0) {
      return isEn ? "Awaiting responses" : "A aguardar respostas";
    }
    const rounded = Math.min(5, Math.max(1, Math.round(parseFloat(avg))));
    switch (rounded) {
      case 1:
        return isEn ? "Very Uncomfortable (Level 1/5)" : "Muito Desconfortável (Nível 1/5)";
      case 2:
        return isEn ? "Uncomfortable (Level 2/5)" : "Desconfortável (Nível 2/5)";
      case 3:
        return isEn ? "Neutral (Level 3/5)" : "Neutro (Nível 3/5)";
      case 4:
        return isEn ? "Comfortable (Level 4/5)" : "Confortável (Nível 4/5)";
      case 5:
        return isEn ? "Very Comfortable (Level 5/5)" : "Muito Confortável (Nível 5/5)";
      default:
        return isEn ? "Neutral (Level 3/5)" : "Neutro (Nível 3/5)";
    }
  }

  /**
   * Atualiza visualmente a barra inferior de escala (1 a 5) destacando a posição da média
   */
  function renderDigitalScale(roundedMean) {
    const container = document.getElementById("demo-digital-scale");
    if (!container) return;
    const isEn = window.I18nManager && window.I18nManager.isEnglish();
    const titles = isEn ? [
      "1 - Very uncomfortable",
      "2 - Uncomfortable",
      "3 - Neutral",
      "4 - Comfortable",
      "5 - Very comfortable"
    ] : [
      "1 - Muito desconfortável",
      "2 - Desconfortável",
      "3 - Neutro",
      "4 - Confortável",
      "5 - Muito confortável"
    ];

    let html = "";
    for (let i = 1; i <= 5; i++) {
      const isHighlight = roundedMean === i;
      const badgeClass = isHighlight
        ? "px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-extrabold shadow-2xs border border-amber-300"
        : "px-1.5 py-0.5 rounded bg-slate-100 text-slate-600";
      const text = isHighlight ? `${i} (${isEn ? "Mean" : "Média"})` : `${i}`;
      html += `<span class="${badgeClass}" title="${titles[i - 1]}">${text}</span>`;
      if (i < 5) html += `<span class="text-slate-300">•</span>`;
    }
    container.innerHTML = html;
  }

  const Q29_LABELS_PT = {
    1: "Nada Provável",
    2: "Pouco Provável",
    3: "Moderadamente Provável",
    4: "Muito Provável",
    5: "Extremamente Provável"
  };

  const Q29_LABELS_EN = {
    1: "Not likely",
    2: "Unlikely",
    3: "Moderately likely",
    4: "Very likely",
    5: "Extremely likely"
  };

  const Q29_COLORS = {
    1: "#DC2626", // Vermelho - Nada Provável
    2: "#EA580C", // Laranja - Pouco Provável
    3: "#F5B842", // Amarelo - Moderadamente Provável
    4: "#2563EB", // Azul - Muito Provável
    5: "#059669"  // Esmeralda/Verde - Extremamente Provável
  };

  function getQ29DynamicZoneLabel(avg, isEn) {
    if (avg === null || avg === undefined) {
      return isEn ? "(Awaiting responses)" : "(A aguardar respostas)";
    }
    const a = round1(avg);
    if (a >= 4.0) {
      return isEn ? "(Very or Extremely likely)" : "(Muito ou Extremamente provável)";
    }
    if (a >= 3.0) {
      return isEn ? "(Moderately likely)" : "(Moderadamente provável)";
    }
    return isEn ? "(Unlikely or Not likely)" : "(Pouco ou Nada provável)";
  }

  function parseQ29Recommendation(val) {
    const v = parseQ29Strict(val);
    return v !== null ? (Q29_LABELS_PT[v] || null) : null;
  }

  function getQ29Weight(label) {
    switch (label) {
      case "Extremamente provável":
      case "Extremamente Provável": return 5;
      case "Muito provável":
      case "Muito Provável": return 4;
      case "Moderavelmente provável":
      case "Moderadamente Provável": return 3;
      case "Pouco Provável":
      case "Pouco provável": return 2;
      case "Nada provável":
      case "Nada Provável": return 1;
      default: return 0;
    }
  }

  function calculateQ29Recommendation(rawList) {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    if (!rawList || !rawList.length) {
      return {
        average: null,
        percent: 0,
        positivePercent: 0,
        counts,
        total: 0
      };
    }

    let sum = 0;
    let total = 0;

    rawList.forEach(item => {
      const v = parseQ29Strict(item);
      if (v >= 1 && v <= 5) {
        counts[v]++;
        sum += v;
        total++;
      }
    });

    if (total === 0) {
      return {
        average: null,
        percent: 0,
        positivePercent: 0,
        counts,
        total: 0
      };
    }

    const average = parseFloat((sum / total).toFixed(1));
    const percent = Math.round((average / 5) * 100);
    const positive = counts[4] + counts[5];
    const positivePercent = Math.round((positive / total) * 100);

    return {
      average,
      percent,
      positivePercent,
      counts,
      total
    };
  }

  /**
   * Valida se uma célula contém uma frase de feedback genuína submetida
   * Ignora vazios, símbolos, números isolados e escalas numéricas
   */
  function isValidFeedbackText(val) {
    if (val === null || val === undefined) return false;
    const s = String(val).trim();
    if (s.length < 2) return false;
    if (/^[-._/\\?*#+~,;:()]+$/.test(s)) return false;
    if (/^[1-5]$/.test(s)) return false;
    if (/^[1-5]\s*-\s*[A-Za-zÀ-ÿ\s]+$/.test(s)) return false;
    return true;
  }

  /**
   * Converte texto de carimbo de data/hora para milissegundos
   */
  function parseSubmissionTimestamp(tsStr) {
    if (!tsStr) return 0;
    const s = String(tsStr).trim();
    const d = new Date(s);
    if (!isNaN(d.getTime())) return d.getTime();
    const m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
    if (m) {
      const day = parseInt(m[1], 10);
      const month = parseInt(m[2], 10) - 1;
      let year = parseInt(m[3], 10);
      if (year < 100) year += 2000;
      const hour = m[4] ? parseInt(m[4], 10) : 0;
      const min = m[5] ? parseInt(m[5], 10) : 0;
      const sec = m[6] ? parseInt(m[6], 10) : 0;
      return new Date(year, month, day, hour, min, sec).getTime();
    }
    return 0;
  }

  // =====================================================================
  // MOTOR DE DADOS DOS 4 CARTÕES DE RESUMO (KPI Strip)
  // =====================================================================

  // Regra Global de Filtragem: apenas códigos padrão FG2-PT01 a FG2-PT50.
  // Qualquer código com sufixo -MD (moderador) ou fora deste intervalo é excluído.
  const VALID_PARTICIPANT_CODE = /^FG2-PT(0[1-9]|[1-4]\d|50)$/;

  // Alvo de respostas por participante: 30 questões + 2 respostas da Word Cloud
  const ANSWER_UNITS_PER_PARTICIPANT = 32;

  // Balizas qualitativas
  const SUS_EXCELLENT_MIN = 80.3;
  const SUS_GOOD_MIN = 68.0;
  const Q29_HIGH_MIN = 4.0;
  const Q29_MODERATE_MIN = 3.0;

  function normalizeParticipantCode(raw) {
    return raw === null || raw === undefined ? "" : String(raw).trim().toUpperCase();
  }

  function isValidParticipantCode(raw) {
    const code = normalizeParticipantCode(raw);
    if (!code || code.endsWith("-MD") || code === "ADMIN" || code === "ADMIN-FG2") return false;
    if (/^FG2-PT\d+$/i.test(code)) return true;
    if (/^NS-PT\d+$/i.test(code)) return true;
    return VALID_PARTICIPANT_CODE.test(code);
  }

  function round1(x) {
    return Math.round(x * 10) / 10;
  }

  function isCodeHeader(h) {
    return /c[oó]digo|participant code|usercode|participant/i.test(String(h || ""));
  }

  function isTimestampHeader(h) {
    return /carimbo|timestamp|data\/hora|datahora/i.test(String(h || ""));
  }

  /**
   * Desembrulha recursivamente qualquer árvore ou invólucro exportado pelo Google Apps Script
   * ou pelo Firebase Realtime Database (Array, Objeto com propriedade única/array, Push-IDs, etc.)
   */
  function unwrapFirebasePayload(rawVal) {
    if (rawVal === null || rawVal === undefined) return [];
    let current = rawVal;

    for (let depth = 0; depth < 6; depth++) {
      if (!current || typeof current !== "object") break;

      if (Array.isArray(current)) {
        if (current.length === 1 && Array.isArray(current[0])) {
          current = current[0];
          continue;
        }
        if (current.length > 0 && Array.isArray(current[0]) && current[0].length > 0 && typeof current[0][0] === "object" && !Array.isArray(current[0][0])) {
          current = current[0];
          continue;
        }
        break;
      }

      const keys = Object.keys(current);
      if (keys.length === 0) return [];

      const arrayKey = keys.find(k => Array.isArray(current[k]));
      if (arrayKey) {
        current = current[arrayKey];
        continue;
      }

      if (keys.length === 1 && current[keys[0]] && typeof current[keys[0]] === "object") {
        current = current[keys[0]];
        continue;
      }

      const allNumeric = keys.every(k => /^\d+$/.test(k));
      if (allNumeric) {
        current = Object.values(current);
        continue;
      }

      const allObjects = keys.every(k => current[k] && typeof current[k] === "object");
      if (allObjects) {
        current = keys.map(k => {
          const v = current[k];
          if (v && typeof v === "object" && !Array.isArray(v)) {
            if (/^(FG2-PT|NS-PT)\d+/i.test(k) && !v.code && !v._participantCode) {
              return Object.assign({ _participantCode: k, code: k }, v);
            }
          }
          return v;
        });
        continue;
      }

      break;
    }

    return current;
  }

  /**
   * Converte qualquer entrada do Firebase (Array de Objetos, Objeto de Push-IDs, ou Matriz 2D)
   * para um Array padronizado de Linhas de Objeto: Array<Record<string, any>>
   */
  function extractRowObjects(rawVal) {
    if (!rawVal) return [];
    const unwrapped = unwrapFirebasePayload(rawVal);
    if (!unwrapped) return [];

    let items = [];
    if (Array.isArray(unwrapped)) {
      items = unwrapped.filter(item => item !== null && item !== undefined);
    } else if (typeof unwrapped === "object") {
      items = Object.values(unwrapped).filter(item => item !== null && item !== undefined);
    } else {
      return [];
    }

    if (!items.length) return [];

    if (Array.isArray(items[0]) && items[0].length > 0 && typeof items[0][0] === "object") {
      items = items.flat();
    }

    if (Array.isArray(items[0])) {
      const firstRow = items[0];
      const isHeaderRow = firstRow.every(c => c === null || c === undefined || typeof c !== "object");
      if (isHeaderRow) {
        const headers = firstRow.map(h => String(h !== null && h !== undefined ? h : "").trim());
        const dataRows = items.slice(1);
        const maxRows = Math.min(dataRows.length, 500);
        const result = [];
        for (let rIdx = 0; rIdx < maxRows; rIdx++) {
          const rowArr = dataRows[rIdx];
          if (!Array.isArray(rowArr)) continue;
          const rowObj = {};
          for (let hIdx = 0; hIdx < headers.length; hIdx++) {
            const h = headers[hIdx];
            if (h) {
              rowObj[h] = rowArr[hIdx] !== undefined && rowArr[hIdx] !== null ? String(rowArr[hIdx]).trim() : "";
            }
          }
          result.push(rowObj);
        }
        return result;
      } else {
        items = items.flat();
      }
    }

    const maxItems = Math.min(items.length, 500);
    const result = [];
    for (let i = 0; i < maxItems; i++) {
      const item = items[i];
      if (item && typeof item === "object" && !Array.isArray(item)) {
        result.push(item);
      } else if (typeof item === "string" && isValidParticipantCode(item)) {
        result.push({ code: item.trim().toUpperCase(), _participantCode: item.trim().toUpperCase() });
      }
    }
    return result;
  }

  /**
   * Extrai o código do participante de uma linha objeto de forma resiliente
   */
  function extractParticipantCodeFromRow(row) {
    if (!row) return "";
    if (typeof row === "string") {
      const s = normalizeParticipantCode(row);
      return isValidParticipantCode(s) ? s : "";
    }
    if (typeof row !== "object") return "";

    // 1. Chaves diretas conhecidas
    const directKeys = [
      "_participantCode", "code", "userCode", "user_code", "participantCode",
      "participant_code", "participant", "id", "ID",
      "Código de Participante", "Código do Participante", "Código", "Codigo",
      "Codigo de Participante", "Código de participante", "Código de Participante:",
      "Código:"
    ];
    for (let i = 0; i < directKeys.length; i++) {
      const dk = directKeys[i];
      if (row[dk] !== undefined && row[dk] !== null) {
        const c = normalizeParticipantCode(row[dk]);
        if (isValidParticipantCode(c)) return c;
      }
    }

    // 2. Chaves que correspondam a cabeçalhos de código
    const keys = Object.keys(row);
    const maxK = Math.min(keys.length, 120);
    for (let i = 0; i < maxK; i++) {
      const k = keys[i];
      if (isCodeHeader(k)) {
        const c = normalizeParticipantCode(row[k]);
        if (isValidParticipantCode(c)) return c;
      }
    }

    // 3. Varrer todos os valores do objeto procurando padrão de código FG2-PTxx ou NS-PTxx
    for (let i = 0; i < maxK; i++) {
      const k = keys[i];
      const val = row[k];
      if (val !== undefined && val !== null && typeof val !== "object") {
        const c = normalizeParticipantCode(val);
        if (isValidParticipantCode(c)) return c;
      }
    }

    return "";
  }

  /**
   * Verifica se um código pertence a um perfil moderador/administrador que deve ser excluído das métricas
   */
  function isModeratorCode(raw) {
    const code = normalizeParticipantCode(raw);
    return code.endsWith("-MD") || code === "ADMIN" || code === "ADMIN-FG2" || code === "MODERATOR";
  }

  /**
   * Avalia se uma linha contém respostas reais substanciais do formulário (pelo menos 1 resposta válida a questão)
   */
  function hasSubstantialAnswers(row) {
    if (!row || typeof row !== "object") return false;
    let count = 0;
    const keys = Object.keys(row);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (k === "_participantCode" || k === "_qCache" || isTimestampHeader(k) || isCodeHeader(k)) continue;
      const v = row[k];
      if (v !== undefined && v !== null && String(v).trim() !== "") {
        count++;
        if (count >= 2) return true;
      }
    }
    return count >= 1;
  }

  /**
   * Aplica a Regra Global de Filtragem:
   * - Converte entrada para Array de Objetos;
   * - Exclui moderadores e administradores (-MD, ADMIN);
   * - Deduplica por código oficial (se submeter mais do que uma vez, mantém a mais recente);
   * - Para submissões sem código preenchido mas com respostas substanciais, atribui identificador de contingência (RESP-xx);
   * - Retorna { rows: Object[], data: Object[], codes: Set<string>, headers: string[] }
   */
  function filterValidParticipantRows(rawInput) {
    const rowObjects = extractRowObjects(rawInput);
    if (!rowObjects.length) {
      return { rows: [], data: [], codes: new Set(), headers: [] };
    }

    const latestByCode = new Map();
    const allHeadersSet = new Set();
    const maxRows = Math.min(rowObjects.length, 500);

    for (let i = 0; i < maxRows; i++) {
      const row = rowObjects[i];
      if (!row || typeof row !== "object") continue;
      const rowKeys = Object.keys(row);
      const maxK = Math.min(rowKeys.length, 120);
      for (let kIdx = 0; kIdx < maxK; kIdx++) {
        const k = rowKeys[kIdx];
        if (k && k !== "_participantCode" && k !== "_qCache") allHeadersSet.add(k);
      }
      const rawCode = extractParticipantCodeFromRow(row);
      if (isModeratorCode(rawCode)) continue;

      let effectiveCode = "";
      if (isValidParticipantCode(rawCode)) {
        effectiveCode = normalizeParticipantCode(rawCode);
      } else if (hasSubstantialAnswers(row)) {
        effectiveCode = rawCode ? `P-${rawCode}` : `RESP-${String(i + 1).padStart(2, "0")}`;
      } else {
        continue;
      }

      row._participantCode = effectiveCode;
      latestByCode.delete(effectiveCode);
      latestByCode.set(effectiveCode, row);
    }

    const validRows = Array.from(latestByCode.values());
    const validCodes = new Set(latestByCode.keys());
    const headers = Array.from(allHeadersSet);

    return {
      rows: validRows,
      data: validRows,
      codes: validCodes,
      headers: headers
    };
  }

  /**
   * Extrai o valor de uma questão a partir de um objeto de linha (row).
   * Procura dinamicamente entre as chaves de row aquela que corresponde ao número da questão
   * ou ao regex de palavras-chave. Se não encontrar, retorna string vazia "".
   * Utiliza memoização interna em row._qCache para evitar re-execuções.
   */
  function getRowQuestionValue(row, qNumber, keywordRegex = null) {
    if (!row || typeof row !== "object") return "";

    if (!row._qCache) {
      row._qCache = Object.create(null);
    }
    const cacheKey = (qNumber !== null && qNumber !== undefined) ? `q_${qNumber}` : (keywordRegex ? `re_${keywordRegex.source}` : "");
    if (cacheKey && row._qCache[cacheKey] !== undefined) {
      return row._qCache[cacheKey];
    }

    const keys = Object.keys(row);
    const maxK = Math.min(keys.length, 120);

    // 1. Procura por número de questão Q<n> (ex: Q7, Q 7, Q.7, Questão 7, etc.)
    if (qNumber !== null && qNumber !== undefined) {
      const num = parseInt(qNumber, 10);
      const numStr = String(num);
      const patterns = [
        new RegExp(`(?:^|[^a-zA-Z0-9])Q\\s*0?${numStr}(?:[^a-zA-Z0-9]|$)`, "i"),
        new RegExp(`^\\s*0?${numStr}\\s*[.):\\-\\s\\[]`, "i"),
        new RegExp(`(?:quest[aã]o|pergunta|question)\\s*0?${numStr}\\b`, "i"),
        new RegExp(`^\\s*0?${numStr}\\s*$`, "i")
      ];
      for (let i = 0; i < maxK; i++) {
        const k = keys[i];
        if (k === "_participantCode" || k === "_qCache") continue;
        const cleanK = String(k || "").trim();
        for (let pIdx = 0; pIdx < patterns.length; pIdx++) {
          if (patterns[pIdx].test(cleanK)) {
            const val = row[k];
            if (val !== undefined && val !== null && String(val).trim() !== "") {
              if (cacheKey) row._qCache[cacheKey] = val;
              return val;
            }
          }
        }
      }
    }

    // 2. Procura flexível por RegEx / palavras-chave (suporta sanitização do Apps Script sem pontuação)
    if (keywordRegex instanceof RegExp) {
      for (let i = 0; i < maxK; i++) {
        const k = keys[i];
        if (k === "_participantCode" || k === "_qCache") continue;
        const cleanK = String(k || "").trim();
        const normK = cleanK.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ");
        if (keywordRegex.test(cleanK) || keywordRegex.test(normK)) {
          const val = row[k];
          if (val !== undefined && val !== null && String(val).trim() !== "") {
            if (cacheKey) row._qCache[cacheKey] = val;
            return val;
          }
        }
      }
    }

    if (cacheKey) row._qCache[cacheKey] = "";
    return "";
  }

  /**
   * Encontra todas as chaves correspondentes aos itens da escala SUS
   */
  function findSusKeys(keys, questionNumber, toolKeywordRegex = null) {
    if (!keys || !keys.length) return [];
    const num = parseInt(questionNumber, 10);
    const numStr = String(num);

    const reQ = new RegExp(`(?:^|[^a-zA-Z0-9])Q\\s*0?${numStr}(?:[^a-zA-Z0-9]|$)`, "i");
    const reNum = new RegExp(`^\\s*0?${numStr}\\s*[.):\\-\\s\\[]`, "i");
    const reWord = new RegExp(`(?:quest[aã]o|pergunta)\\s*0?${numStr}\\b`, "i");
    const susKeywords = /gostaria de utilizar|desnecessariamente complexo|fácil de utilizar|facil de utilizar|apoio de um técnico|apoio de um tecnico|bem integradas|demasiada inconsistência|demasiada inconsistencia|aprenderiam rapidamente|muito complicado|muito confiante|precisaria de aprender|use frequently|unnecessarily complex|easy to use|support of a technical|well integrated|inconsistency|quickly|cumbersome|confident|needed to learn/i;

    const matched = [];
    const maxK = Math.min(keys.length, 120);
    for (let i = 0; i < maxK; i++) {
      const k = keys[i];
      if (k === "_participantCode" || k === "_qCache") continue;
      const s = String(k || "").trim();
      if (reQ.test(s) || reNum.test(s) || reWord.test(s)) {
        if (!matched.includes(k)) matched.push(k);
      } else if (susKeywords.test(s)) {
        if (!matched.includes(k)) matched.push(k);
      } else if (/SUS\b/i.test(s) && (!toolKeywordRegex || toolKeywordRegex.test(s))) {
        if (!matched.includes(k)) matched.push(k);
      }
      if (matched.length >= 10) break;
    }

    return matched;
  }

  /**
   * Helper para compatibilidade com buscas de índice de coluna
   */
  function findQuestionColIndex(headers, qNumber, keywordRegex = null) {
    if (!headers || !headers.length) return -1;
    const num = parseInt(qNumber, 10);
    const numStr = String(num);

    const patterns = [
      new RegExp(`(?:^|[^a-zA-Z0-9])Q\\s*0?${numStr}(?:[^a-zA-Z0-9]|$)`, "i"),
      new RegExp(`^\\s*0?${numStr}\\s*[.):\\-\\s]`, "i"),
      new RegExp(`(?:quest[aã]o|pergunta|question)\\s*0?${numStr}\\b`, "i"),
      new RegExp(`^\\s*0?${numStr}\\s*$`, "i")
    ];

    for (let i = 0; i < headers.length; i++) {
      const h = String(headers[i] || "").trim();
      for (const pat of patterns) {
        if (pat.test(h)) return i;
      }
    }

    if (keywordRegex instanceof RegExp) {
      for (let i = 0; i < headers.length; i++) {
        const h = String(headers[i] || "").trim();
        if (keywordRegex.test(h)) return i;
      }
    }

    return -1;
  }

  function findSusColIndices(headers, questionNumber, toolKeywordRegex = null) {
    return findSusKeys(headers, questionNumber, toolKeywordRegex).map(k => headers.indexOf(k));
  }

  /**
   * Conta as respostas válidas (unidades de resposta preenchidas) de um separador já filtrado
   */
  function countAnsweredUnits(tab) {
    const rows = (tab && tab.rows) ? tab.rows : (Array.isArray(tab) ? tab : (tab && tab.data ? tab.data : []));
    if (!rows || !rows.length) return 0;

    let total = 0;
    rows.forEach(row => {
      if (!row || typeof row !== "object") return;
      const answeredQuestions = new Set();
      Object.keys(row).forEach(k => {
        if (k === "_participantCode" || k === "_qCache" || isCodeHeader(k) || isTimestampHeader(k)) return;
        const val = row[k];
        if (val === undefined || val === null || String(val).trim() === "") return;

        const label = String(k || "").trim();
        const matchQ = label.match(/(?:^|[^a-zA-Z0-9])Q\s*(\d+)\b/i) || label.match(/^\s*(\d{1,2})\s*[.):\-\s]/i);
        if (matchQ) {
          answeredQuestions.add(`Q${parseInt(matchQ[1], 10)}`);
        } else if (/3 palavras|three words|3 words|palavras/i.test(label)) {
          answeredQuestions.add("WC");
        } else {
          answeredQuestions.add(label);
        }
      });
      total += answeredQuestions.size;
    });
    return total;
  }

  /**
   * Leitura estrita de uma resposta Likert 1–5 (devolve número 1 a 5 ou null)
   * Suporta dígitos diretos (ex: "4", "(4) Concordo") e todas as escalas qualitativas do questionário
   */
  function parseLikertStrict(val) {
    if (val === null || val === undefined) return null;
    const s = String(val).trim();
    if (!s) return null;

    // 1. Dígito direto no texto: "(4) Concordo", "4 - Concordo", "[4]", "4", etc.
    const m = s.match(/(?:^|[(\[\s])([1-5])(?:[)\]\s]|$)/);
    if (m) return parseInt(m[1], 10);

    const norm = s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

    // 2. Nível 5 (Máximo / Excelente / Muito Positivo)
    if (norm.includes("excede largamente") || norm.includes("extremamente") || norm.includes("far exceeds")) return 5;
    if (norm.includes("concordo totalmente") || norm.includes("concordo fortemente") || norm.includes("strongly agree")) return 5;
    if (norm.includes("muito claro") || norm.includes("muito clara") || norm.includes("muito eficaz") || norm.includes("muito util") || norm.includes("muito envolvente") || norm.includes("muito facil") || norm.includes("muito preciso") || norm.includes("muito realista") || norm.includes("muito confortavel") || norm.includes("muito provavel") || norm.includes("muito satisfeito")) return 5;
    if (norm === "muito facil" || norm === "muito claro" || norm === "muito clara" || norm === "muito eficaz" || norm === "muito util" || norm === "muito envolvente" || norm === "muito preciso" || norm === "muito realista" || norm === "muito confortavel" || norm === "muito provavel") return 5;

    // 3. Nível 4 (Alto / Positivo)
    if (norm.includes("excede as expectativas") || norm.includes("excede expectativas") || norm.includes("exceeds")) return 4;
    if (norm.includes("concordo") || norm.includes("agree")) return 4;
    if (norm.includes("clara") || norm.includes("claro") || norm.includes("eficaz") || norm.includes("util") || norm.includes("envolvente") || norm.includes("facil") || norm.includes("preciso") || norm.includes("realista") || norm.includes("confortavel") || norm.includes("provavel") || norm.includes("satisfeito")) {
      if (!norm.includes("pouco") && !norm.includes("moderad") && !norm.includes("nada") && !norm.includes("nem") && !norm.includes("nao") && !norm.includes("abaixo")) {
        return 4;
      }
    }

    // 4. Nível 3 (Neutro / Médio / Adequado)
    if (norm.includes("correspondeu") || norm.includes("atendeu") || norm.includes("met expectations")) return 3;
    if (norm.includes("nem concordo") || norm.includes("neutro") || norm.includes("indiferente") || norm.includes("neither") || norm.includes("nem confuso") || norm.includes("nem facil")) return 3;
    if (norm.includes("moderada") || norm.includes("moderad") || norm.includes("equilibrad") || norm.includes("adequado") || norm.includes("razoavel")) return 3;

    // 5. Nível 2 (Baixo / Negativo / Pouco)
    if (norm.includes("abaixo das expectativas") || norm.includes("below expectations")) return 2;
    if (norm.includes("discordo") || norm.includes("disagree")) return 2;
    if (norm.includes("pouco") || norm.includes("um pouco") || norm.includes("confuso") || norm.includes("ineficaz") || norm.includes("inutil") || norm.includes("desconfortavel") || norm.includes("improvavel") || norm.includes("insatisfeito")) {
      if (!norm.includes("nada") && !norm.includes("muito")) return 2;
    }
    if (norm.includes("dificil") && !norm.includes("muito") && !norm.includes("nem")) return 2;

    // 6. Nível 1 (Mínimo / Muito Negativo)
    if (norm.includes("muito abaixo") || norm.includes("far below")) return 1;
    if (norm.includes("discordo totalmente") || norm.includes("discordo fortemente") || norm.includes("strongly disagree")) return 1;
    if (norm.includes("nada") || norm.includes("not ") || norm.includes("muito dificil") || norm.includes("muito confuso") || norm.includes("pessimo")) return 1;

    return null;
  }

  /**
   * Leitura estrita da Q29 (escala 1–5 de probabilidade de recomendação).
   */
  function parseQ29Strict(val) {
    return parseLikertStrict(val);
  }

  // Padrões de correspondência para os 10 itens padronizados da escala SUS (Brooke, 1996)
  const SUS_ITEM_PATTERNS = [
    /gostaria de utilizar|frequência|frequencia|frequently/i,
    /desnecessariamente complex|unnecessarily complex/i,
    /fácil de utilizar|facil de utilizar|easy to use/i,
    /apoio de uma pessoa|apoio de um|pessoa técnica|technical/i,
    /bem integrad|well integrated/i,
    /demasiada inconsist|inconsistency/i,
    /rapidamente|quickly/i,
    /incómoda|incomoda|confuso|cumbersome/i,
    /confiante|confident/i,
    /aprender muitas coisas|needed to learn/i
  ];

  /**
   * System Usability Scale (Brooke, 1996) sobre as 10 sub-declarações de uma questão (Q13 ou Q24):
   * ímpares (1,3,5,7,9): resposta − 1 | pares (2,4,6,8,10): 5 − resposta
   * Score do participante = soma × 2.5 | Resultado = média aritmética dos participantes válidos.
   */
  function computeSusKpi(tab, questionNumber, toolKeywordRegex = null) {
    const rows = (tab && tab.rows) ? tab.rows : (Array.isArray(tab) ? tab : (tab && tab.data ? tab.data : []));
    if (!rows || !rows.length) return { average: null, n: 0, itemsAvg: new Array(10).fill(0) };

    const keySet = new Set();
    rows.forEach(r => {
      if (r && typeof r === "object") {
        findSusKeys(Object.keys(r), questionNumber, toolKeywordRegex).forEach(k => keySet.add(k));
      }
    });
    const rawKeys = Array.from(keySet);
    if (rawKeys.length < 10) {
      return { average: null, n: 0, itemsAvg: new Array(10).fill(0) };
    }

    // Ordenar estritamente segundo os 10 itens da escala SUS (Brooke, 1996)
    let itemKeys = [];
    const ordered = [];
    const used = new Set();
    SUS_ITEM_PATTERNS.forEach(pat => {
      const found = rawKeys.find(k => !used.has(k) && pat.test(k));
      if (found) {
        ordered.push(found);
        used.add(found);
      }
    });
    if (ordered.length === 10) {
      itemKeys = ordered;
    } else {
      itemKeys = rawKeys.slice(0, 10);
    }

    let sum = 0;
    let n = 0;
    const itemSums = new Array(10).fill(0);
    const itemCounts = new Array(10).fill(0);

    rows.forEach(row => {
      if (!row || typeof row !== "object") return;

      itemKeys.forEach((key, idx) => {
        const v = parseLikertStrict(row[key]);
        if (v !== null) {
          itemSums[idx] += v;
          itemCounts[idx]++;
        }
      });

      const vals = itemKeys.map(k => parseLikertStrict(row[k]));
      if (vals.some(v => v === null)) return;

      let raw = 0;
      vals.forEach((v, idx) => {
        raw += (idx % 2 === 0) ? (v - 1) : (5 - v);
      });
      sum += raw * 2.5;
      n++;
    });

    const itemsAvg = itemCounts.map((count, idx) => {
      if (count === 0) return 0;
      const rawMean = itemSums[idx] / count;
      const val = (idx % 2 === 0) ? rawMean : (6 - rawMean);
      return parseFloat(val.toFixed(1));
    });

    return { average: n > 0 ? sum / n : null, n, itemsAvg };
  }

  /**
   * Média aritmética simples das respostas válidas da Q29 (1–5)
   */
  function computeQ29Kpi(tab) {
    const rows = (tab && tab.rows) ? tab.rows : (Array.isArray(tab) ? tab : (tab && tab.data ? tab.data : []));
    if (!rows || !rows.length) return { average: null, n: 0 };

    let sum = 0;
    let n = 0;
    rows.forEach(row => {
      if (!row || typeof row !== "object") return;
      const val = getRowQuestionValue(row, 29, /recomenda|recomendaria|provável|provavel|nps/i);
      const v = parseQ29Strict(val);
      if (v === null) return;
      sum += v;
      n++;
    });
    return { average: n > 0 ? sum / n : null, n };
  }

  /**
   * Calcula os dados dos 4 cartões a partir dos 3 separadores já filtrados
   */
  function computeKpis(game, sim, global) {
    const gCodes = (game && game.codes) ? game.codes : new Set();
    const sCodes = (sim && sim.codes) ? sim.codes : new Set();
    const glCodes = (global && global.codes) ? global.codes : new Set();
    const submissionCodes = new Set([...gCodes, ...sCodes, ...glCodes]);

    return {
      submissionCodes,
      answeredUnits: countAnsweredUnits(game) + countAnsweredUnits(sim) + countAnsweredUnits(global),
      susGame: computeSusKpi(game, 13, /game|jogo/i),
      susSim: computeSusKpi(sim, 24, /simulador|sim/i),
      q29: computeQ29Kpi(global)
    };
  }

  /**
   * Códigos válidos com sessão iniciada no website (exclui -MD)
   */
  function getActiveSessionCodes() {
    const codes = new Set();
    const add = c => { if (isValidParticipantCode(c)) codes.add(normalizeParticipantCode(c)); };
    try {
      if (window.SubmissionsTracker && typeof window.SubmissionsTracker.getRegisteredCodes === "function") {
        window.SubmissionsTracker.getRegisteredCodes().forEach(add);
      }
      if (localStorage.getItem("renovate_session_active") === "true") {
        add(localStorage.getItem("renovate_participant_code"));
      }
      const active = JSON.parse(localStorage.getItem("renovate_active_codes") || "[]");
      if (Array.isArray(active)) active.forEach(add);
    } catch (e) {}
    return codes;
  }

  function getSusLabel(score, isEn) {
    if (score === null) return isEn ? "Awaiting responses" : "A aguardar respostas";
    const s = round1(score);
    if (s >= SUS_EXCELLENT_MIN) return isEn ? "Excellent" : "Excelente";
    if (s >= SUS_GOOD_MIN) return isEn ? "Good" : "Bom";
    return isEn ? "Below Average" : "Abaixo da Média";
  }

  function getQ29Label(avg, isEn) {
    if (avg === null) return isEn ? "Awaiting responses" : "A aguardar respostas";
    const a = round1(avg);
    if (a >= Q29_HIGH_MIN) return isEn ? "High Recommendation Intent" : "Elevada Intenção de Recomendação";
    if (a >= Q29_MODERATE_MIN) return isEn ? "Moderate Intent" : "Intenção Moderada";
    return isEn ? "Low Recommendation Intent" : "Baixa Intenção de Recomendação";
  }

  /**
   * Liga os dados aos 4 cartões de resumo existentes no menu "Resultados & Media"
   */
  function renderKpiCards() {
    try {
      const isEn = window.I18nManager && window.I18nManager.isEnglish();
      const setText = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };

      let k = state.kpis;
      let participantCount;

      // Amostra Total (N) extraída estritamente do nó /Logins (filtrando duplicados e excluindo sufixo -MD)
      if (state.totalLogins > 0) {
        participantCount = state.totalLogins;
      } else if (window.SubmissionsTracker && typeof window.SubmissionsTracker.getTotalParticipants === "function" && window.SubmissionsTracker.getTotalParticipants() > 0) {
        participantCount = window.SubmissionsTracker.getTotalParticipants();
      } else if (state.uniqueLoginCodes && state.uniqueLoginCodes.size > 0) {
        participantCount = state.uniqueLoginCodes.size;
      } else {
        const codes = getActiveSessionCodes();
        const nonMod = new Set();
        codes.forEach(c => {
          if (!isModeratorCode(c) && !String(c).trim().toUpperCase().endsWith("-MD")) nonMod.add(c);
        });
        participantCount = nonMod.size > 0 ? nonMod.size : 1;
      }

      if (!k) {
        k = {
          answeredUnits: 0,
          susGame: { average: null },
          susSim: { average: null },
          q29: { average: null }
        };
      }

      // 1. AMOSTRA TOTAL (Apenas participantes sem sufixo -MD)
      setText("kpi-responses-count", participantCount);
      // Denominador Total Obrigatório = 32 * (Número de Participantes Únicos SEM sufixo -MD)
      const target = participantCount * ANSWER_UNITS_PER_PARTICIPANT;
      const badge = document.getElementById("kpi-total-submissions-badge");
      if (badge && window.SubmissionsTracker && typeof window.SubmissionsTracker.generateBadgeHTML === "function") {
        badge.innerHTML = window.SubmissionsTracker.generateBadgeHTML(k.answeredUnits, target, true);
      }

      // 2. SUS SERIOUS GAME (Q13)
      const sg = k.susGame.average;
      setText("kpi-sus-game", sg === null ? "—" : round1(sg).toFixed(1));
      setText("kpi-sus-game-bench", getSusLabel(sg, isEn));

      // 3. SUS SIMULADOR 3D (Q24)
      const ss = k.susSim.average;
      setText("kpi-sus-sim", ss === null ? "—" : round1(ss).toFixed(1));
      setText("kpi-sus-sim-bench", getSusLabel(ss, isEn));

      // 4. RECOMENDAÇÃO RENOVATE (Q29)
      const q = k.q29.average;
      setText("kpi-nps", q === null ? "—" : round1(q).toFixed(1));
      setText("kpi-nps-unit", q === null ? "/ 5.0" : `/ 5.0 (${Math.round((q / 5) * 100)}%)`);
      setText("kpi-nps-label", getQ29Label(q, isEn));

      // Sincronizar secção comparativa SUS com os mesmos dados calculados
      renderSusBenchmarkGauge();
    } catch (err) {
      console.warn("Aviso em renderKpiCards:", err);
    }
  }

  /**
   * Estrutura de métricas limpas em Estado Inicial (Zero-State)
   * Todos os gráficos e contadores a ZEROS até à entrada de dados reais
   */
  function getZeroMetrics() {
    const isEn = window.I18nManager && window.I18nManager.isEnglish();
    const zeroProfiles = {};
    OFFICIAL_PROFILES.forEach(p => { zeroProfiles[p] = 0; });
    const zeroCrops = {};
    OFFICIAL_CROPS.forEach(c => { zeroCrops[c] = 0; });

    return {
      participantCount: 0,
      susGame: {
        average: null,
        benchmark: isEn ? "Awaiting responses" : "A aguardar respostas",
        itemsAvg: new Array(10).fill(0)
      },
      susSim: {
        average: null,
        benchmark: isEn ? "Awaiting responses" : "A aguardar respostas",
        itemsAvg: new Array(10).fill(0)
      },
      nps: {
        average: null,
        percent: 0,
        positivePercent: 0,
        counts: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0
        },
        total: 0
      },
      wordsGame: [],
      wordsSim: [],
      gamePedagogy: {
        q7: 0,
        q8: 0,
        q9: 0,
        q10: 0,
        q11: 0,
        q12: 0
      },
      simModules: {
        q15: 0,
        q16: 0,
        q17: 0,
        q18: 0,
        q19: 0,
        q20: 0,
        q21: 0,
        q22: 0,
        q23: 0
      },
      demographics: {
        profiles: zeroProfiles,
        crops: zeroCrops,
        ages: {},
        digitalComfortAvg: null
      },
      qualitativeFeedback: {
        feed: [],
        simSuggestions: [],
        finalSuggestions: []
      }
    };
  }

  // Configuração Oficial da Firebase Realtime Database (Focus Group 2)
  const DEFAULT_FIREBASE_URL = "https://renovate-fg2-default-rtdb.europe-west1.firebasedatabase.app";

  function getFirebaseUrl() {
    return (window.RENOVATE_CONFIG && window.RENOVATE_CONFIG.resultsDashboard && window.RENOVATE_CONFIG.resultsDashboard.firebaseUrl) ||
           localStorage.getItem("renovate_firebase_url") ||
           window.RENOVATE_FIREBASE_URL ||
           DEFAULT_FIREBASE_URL;
  }

  // Objeto centralizado para instâncias Chart.js v4 (Previne Flickering e destruição)
  window.chartInstances = window.chartInstances || {};

  // Estado interno
  let state = {
    firebaseUrl: getFirebaseUrl(),
    isLive: false,
    isLoading: false,
    isWaitingAnswers: true,
    lastUpdated: null,
    activeTabFilter: "all",
    activeWordCloudTool: "game", // "game" ou "sim"
    totalLogins: 0,
    uniqueLoginCodes: new Set(),
    rawFirebaseData: {
      game: null,
      sim: null,
      global: null
    },
    metrics: getZeroMetrics(),
    kpis: null, // dados reais (filtrados) dos 4 cartões de resumo
    charts: window.chartInstances
  };

  /**
   * Inicialização do Módulo de Resultados
   */
  function init() {
    loadConfig();
    bindEvents();
    initAllCharts();
    renderAllDashboardMetrics();
    connectFirebase();
  }

  /**
   * Carrega a configuração oficial do Firebase / Sheets
   */
  function loadConfig() {
    state.firebaseUrl = getFirebaseUrl();
    state.charts = window.chartInstances;
  }

  /**
   * Grava configuração no localStorage
   */
  function saveConfig(newConfig) {
    state.config = Object.assign({}, state.config, newConfig);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.config));
    } catch (e) {
      console.error("Erro ao gravar configuração:", e);
    }
  }

  /**
   * Ligação de eventos da interface
   */
  function bindEvents() {
    // Botão de Atualização Manual
    const refreshBtn = document.getElementById("btn-refresh-results");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        try {
          fetchData(true)
            .catch(err => {
              console.error("Erro na promise do botão de atualização:", err);
            })
            .finally(() => {
              stopRefreshSpinner();
            });
        } catch (err) {
          console.error("Erro ao clicar no botão de atualização:", err);
          stopRefreshSpinner();
        }
      });
    }

    // Dropdown de Conexão Sheets e Links Diretos Oficiais
    const btnSheetsMenu = document.getElementById("btn-sheets-menu");
    const dropdownSheetsMenu = document.getElementById("dropdown-sheets-menu");
    const dropdownSheetsContainer = document.getElementById("dropdown-sheets-container");

    if (btnSheetsMenu && dropdownSheetsMenu) {
      btnSheetsMenu.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdownSheetsMenu.classList.toggle("hidden");
      });

      // Fechar dropdown ao clicar fora
      document.addEventListener("click", (e) => {
        if (dropdownSheetsContainer && !dropdownSheetsContainer.contains(e.target)) {
          dropdownSheetsMenu.classList.add("hidden");
        }
      });
    }

    // Botão Sincronizar Agora no Dropdown
    const btnSyncNowDropdown = document.getElementById("btn-sync-now-dropdown");
    if (btnSyncNowDropdown) {
      btnSyncNowDropdown.addEventListener("click", (e) => {
        e.stopPropagation();
        if (dropdownSheetsMenu) dropdownSheetsMenu.classList.add("hidden");
        fetchData(true);
      });
    }

    // Botões de Alternância da Nuvem de Palavras (Serious Game vs Simulador)
    const btnWcGame = document.getElementById("btn-wc-game");
    const btnWcSim = document.getElementById("btn-wc-sim");
    function updateWordCloudToggleButtons() {
      const isGame = state.activeWordCloudTool === "game";
      if (btnWcGame) {
        if (isGame) {
          btnWcGame.className = "px-3 py-1 rounded-lg text-xs font-bold transition bg-[#F5B842] text-[#0F172A] shadow-2xs";
        } else {
          btnWcGame.className = "px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition";
        }
      }
      if (btnWcSim) {
        if (!isGame) {
          btnWcSim.className = "px-3 py-1 rounded-lg text-xs font-bold transition bg-[#F5B842] text-[#0F172A] shadow-2xs";
        } else {
          btnWcSim.className = "px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition";
        }
      }
    }

    if (btnWcGame && btnWcSim) {
      btnWcGame.addEventListener("click", () => {
        state.activeWordCloudTool = "game";
        updateWordCloudToggleButtons();
        renderWordCloud();
      });

      btnWcSim.addEventListener("click", () => {
        state.activeWordCloudTool = "sim";
        updateWordCloudToggleButtons();
        renderWordCloud();
      });
    }

    // Filtros de Secção do Dashboard
    const filterBtns = document.querySelectorAll(".results-filter-btn");
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter") || "all";
        setSectionFilter(filter);
      });
    });
  }

  /**
   * Constrói a URL de exportação CSV quer seja uma folha normal ou um link de 'Publicar na Web'
   */
  function buildTabUrl(sheetId, gid, defaultGid = "0") {
    const rawGid = (gid !== undefined && gid !== null && String(gid).trim() !== "") ? String(gid).trim() : defaultGid;
    
    // Se o campo do separador for já um link HTTP completo (ex: colado de 'Publicar na Web')
    if (rawGid.startsWith("http://") || rawGid.startsWith("https://")) {
      let u = rawGid;
      if (!u.includes("output=csv") && !u.includes("format=csv")) {
        u += (u.includes("?") ? "&" : "?") + "output=csv";
      }
      return u;
    }

    const cleanSheet = (sheetId || "").trim();

    // Se for URL ou ID de 'Publicar na Web' (/d/e/2PACX-...)
    if (cleanSheet.includes("/d/e/") || cleanSheet.startsWith("2PACX-")) {
      let pubId = cleanSheet;
      if (cleanSheet.includes("/d/e/")) {
        const m = cleanSheet.match(/\/d\/e\/([a-zA-Z0-9-_]+)/);
        if (m && m[1]) pubId = m[1];
      }
      return `https://docs.google.com/spreadsheets/d/e/${pubId}/pub?gid=${rawGid}&single=true&output=csv`;
    }

    // Se for URL normal de edição (/d/ID/...)
    let normalId = cleanSheet;
    if (cleanSheet.includes("/d/")) {
      const m = cleanSheet.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (m && m[1] && m[1] !== "e") normalId = m[1];
    }

    return `https://docs.google.com/spreadsheets/d/${normalId}/export?format=csv&gid=${rawGid}`;
  }

  /**
   * Filtra as secções visuais do dashboard
   */
  function setSectionFilter(filter) {
    state.activeTabFilter = filter;
    document.querySelectorAll(".results-filter-btn").forEach(btn => {
      const f = btn.getAttribute("data-filter") || "all";
      if (f === filter) {
        btn.classList.add("bg-slate-900", "text-white", "font-bold");
        btn.classList.remove("bg-white", "text-slate-600", "hover:bg-slate-100");
      } else {
        btn.classList.remove("bg-slate-900", "text-white", "font-bold");
        btn.classList.add("bg-white", "text-slate-600", "hover:bg-slate-100");
      }
    });

    const sections = {
      demographics: document.getElementById("results-sec-demographics"),
      sus: document.getElementById("results-sec-sus"),
      pedagogical: document.getElementById("results-sec-pedagogical"),
      feedback: document.getElementById("results-sec-feedback"),
      wordcloud: document.getElementById("results-sec-wordcloud")
    };

    if (filter === "all") {
      Object.values(sections).forEach(s => s && s.classList.remove("hidden"));
    } else {
      Object.entries(sections).forEach(([key, sec]) => {
        if (!sec) return;
        if (key === filter) {
          sec.classList.remove("hidden");
        } else {
          sec.classList.add("hidden");
        }
      });
    }

    // Redimensionar gráficos visíveis
    setTimeout(() => {
      resizeAllCharts();
      renderWordCloud();
    }, 100);
  }

  /**
   * Parser robusto de CSV compatível com aspas, quebras de linha e separadores de vírgula
   */
  function parseCSV(text) {
    if (!text || typeof text !== "string") return [];
    const rows = [];
    let row = [];
    let inQuotes = false;
    let currentField = "";

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentField += '"';
          i++; // ignorar aspas escapadas
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        row.push(currentField.trim());
        currentField = "";
      } else if ((char === "\r" || char === "\n") && !inQuotes) {
        if (char === "\r" && nextChar === "\n") {
          i++;
        }
        row.push(currentField.trim());
        if (row.length > 1 || (row.length === 1 && row[0] !== "")) {
          rows.push(row);
        }
        row = [];
        currentField = "";
      } else {
        currentField += char;
      }
    }
    if (currentField || row.length > 0) {
      row.push(currentField.trim());
      rows.push(row);
    }
    return rows;
  }

  /**
   * Converte nós arbitrários do Firebase Realtime Database (Array, Object ou Push IDs)
   * numa estrutura padrão { headers: string[], data: any[][] }
   */
  function normalizeFirebaseTable(val) {
    if (!val) return { headers: [], data: [] };

    let arr = [];
    if (Array.isArray(val)) {
      arr = val;
    } else if (typeof val === "object") {
      const keys = Object.keys(val);
      const areNumeric = keys.every(k => !isNaN(Number(k)));
      if (areNumeric) {
        arr = keys.sort((a, b) => Number(a) - Number(b)).map(k => val[k]);
      } else {
        arr = Object.entries(val).map(([k, v]) => {
          if (v && typeof v === "object" && !Array.isArray(v)) {
            if (/^(FG2-PT|NS-PT)\d+/i.test(k) && !v.code && !v["Código de Participante"]) {
              return Object.assign({ _participantCode: k, code: k }, v);
            }
          }
          return v;
        });
      }
    }

    if (!arr.length) return { headers: [], data: [] };

    // Caso 1: Array 2D [ [headers...], [row1...], [row2...] ]
    if (Array.isArray(arr[0])) {
      const headers = arr[0].map(h => String(h !== null && h !== undefined ? h : "").trim());
      const data = arr.slice(1).filter(r => Array.isArray(r) && r.some(c => c !== null && c !== undefined && String(c).trim() !== ""));
      return { headers, data };
    }

    // Caso 2: Array de Objetos [ { col1: "val", col2: "val" }, ... ]
    if (typeof arr[0] === "object" && arr[0] !== null) {
      const headerSet = new Set();
      arr.forEach(item => {
        if (item && typeof item === "object") {
          Object.keys(item).forEach(k => {
            const cleanKey = String(k || "").trim();
            if (cleanKey && cleanKey !== "_participantCode") {
              headerSet.add(cleanKey);
            }
          });
        }
      });
      const headers = Array.from(headerSet);
      const data = arr.map(item => {
        const row = headers.map(h => {
          if (!item) return "";
          if (item[h] !== undefined && item[h] !== null) {
            const v = item[h];
            return Array.isArray(v) ? (v.length === 1 ? v[0] : v.join(", ")) : v;
          }
          const lowerH = h.toLowerCase().trim();
          for (const k of Object.keys(item)) {
            if (k.toLowerCase().trim() === lowerH) {
              const v = item[k];
              return Array.isArray(v) ? (v.length === 1 ? v[0] : v.join(", ")) : v;
            }
          }
          return "";
        });
        if (item && item._participantCode) {
          row._participantCode = item._participantCode;
        }
        return row;
      });
      return { headers, data };
    }

    return { headers: [], data: [] };
  }

  /**
   * Extrai a lista de códigos de participante únicos do nó /Logins
   * Filtra duplicados e exclui códigos com o sufixo -MD
   */
  function extractValidLoginCodes(rawLogins) {
    if (!rawLogins) return [];
    const unwrapped = unwrapFirebasePayload(rawLogins);
    const uniqueCodes = new Set();
    const entries = Array.isArray(unwrapped) ? unwrapped : (typeof unwrapped === "object" ? Object.values(unwrapped) : [unwrapped]);

    entries.forEach(entry => {
      if (!entry) return;
      let code = null;

      if (typeof entry === "string") {
        code = entry;
      } else if (typeof entry === "object") {
        code = extractParticipantCodeFromRow(entry);
        if (!code && Array.isArray(entry)) {
          for (let i = 0; i < entry.length; i++) {
            const s = normalizeParticipantCode(entry[i]);
            if (isValidParticipantCode(s)) { code = s; break; }
          }
        }
      }

      if (code) {
        const clean = normalizeParticipantCode(code);
        if (isValidParticipantCode(clean) && !isModeratorCode(clean) && !clean.endsWith("-MD")) {
          uniqueCodes.add(clean);
        }
      }
    });

    const result = Array.from(uniqueCodes);
    console.log("[Firebase Parser] /Logins payload (excluindo -MD):", rawLogins, "-> parsed codes:", result);
    return result;
  }

  /**
   * Conecta à Firebase Realtime Database via WebSockets (onValue)
   * Subscreve: Raiz / (descoberta automática de nós) e nós diretos
   * /Logins, /RespostasdoFormulário1, /RespostasdoFormulário2, /RespostasdoFormulário3
   */
  function connectFirebase() {
    if (typeof firebase === "undefined" || !firebase.database) {
      console.warn("⚠️ Firebase SDK ainda não disponível. A aguardar carregamento...");
      setTimeout(connectFirebase, 400);
      return;
    }

    try {
      const url = getFirebaseUrl();
      if (!firebase.apps.length) {
        firebase.initializeApp({ databaseURL: url });
      }
      const db = firebase.database();

      // Monitor de Ligação WebSockets (.info/connected)
      db.ref(".info/connected").on("value", snap => {
        const isConnected = Boolean(snap.val());
        if (isConnected) {
          state.isLive = true;
          updateConnectionBadge(true);
        }
      });

      // 0. Listener na Raiz "/" para mapear dinamicamente as tabelas exportadas pelo Apps Script
      db.ref("/").on("value", rootSnap => {
        try {
          const rootVal = rootSnap.val();
          if (!rootVal || typeof rootVal !== "object") return;
          console.log("[Firebase Parser] Root keys in RTDB:", Object.keys(rootVal));

          for (const k of Object.keys(rootVal)) {
            const val = rootVal[k];
            if (!val) continue;
            const normKey = k.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "");
            if (normKey.includes("login")) {
              const validLogins = extractValidLoginCodes(val);
              if (validLogins.length > 0) {
                state.totalLogins = validLogins.length;
                state.uniqueLoginCodes = new Set(validLogins);
                if (window.SubmissionsTracker && typeof window.SubmissionsTracker.setTotalParticipants === "function") {
                  window.SubmissionsTracker.setTotalParticipants(validLogins.length, validLogins);
                }
              }
            } else if (normKey.includes("1") || normKey.includes("game") || normKey.includes("tallentto")) {
              state.rawFirebaseData.game = val;
            } else if (normKey.includes("2") || normKey.includes("sim") || normKey.includes("virmedex")) {
              state.rawFirebaseData.sim = val;
            } else if (normKey.includes("3") || normKey.includes("global") || normKey.includes("nps")) {
              state.rawFirebaseData.global = val;
            }
          }
          syncAllFirebaseData();
        } catch (rootErr) {
          console.warn("Aviso ao processar nó raiz / do Firebase:", rootErr);
        }
      });

      const safeListen = (paths, handler) => {
        paths.forEach(p => {
          try {
            db.ref(p).on("value", handler);
          } catch (e) {}
        });
      };

      // 1. /Logins (Amostra Total TT)
      const handleLoginsSnapshot = snapshot => {
        try {
          const validLogins = extractValidLoginCodes(snapshot.val());
          if (validLogins.length > 0) {
            state.totalLogins = validLogins.length;
            state.uniqueLoginCodes = new Set(validLogins);
            if (window.SubmissionsTracker && typeof window.SubmissionsTracker.setTotalParticipants === "function") {
              window.SubmissionsTracker.setTotalParticipants(validLogins.length, validLogins);
            }
          }
          renderKpiCards();
          updateConnectionBadge(true);
        } catch (err) {
          console.warn("Aviso ao processar /Logins no ResultsDashboard:", err);
        }
      };
      safeListen(["/Logins", "/logins", "/Login"], handleLoginsSnapshot);

      // 2. /RespostasdoFormulário1 (Game + Demografia)
      const handleGameSnapshot = snapshot => {
        try {
          if (snapshot.val() !== null) {
            state.rawFirebaseData.game = snapshot.val();
            syncAllFirebaseData();
          }
        } catch (err) {
          console.warn("Aviso /RespostasdoFormulário1:", err);
        }
      };
      safeListen(["/RespostasdoFormulário1", "/RespostasdoFormulario1", "/Respostas do Formulário 1", "/Respostas do Formulario 1", "/Formulário1", "/Formulario1"], handleGameSnapshot);

      // 3. /RespostasdoFormulário2 (Simulador)
      const handleSimSnapshot = snapshot => {
        try {
          if (snapshot.val() !== null) {
            state.rawFirebaseData.sim = snapshot.val();
            syncAllFirebaseData();
          }
        } catch (err) {
          console.warn("Aviso /RespostasdoFormulário2:", err);
        }
      };
      safeListen(["/RespostasdoFormulário2", "/RespostasdoFormulario2", "/Respostas do Formulário 2", "/Respostas do Formulario 2", "/Formulário2", "/Formulario2"], handleSimSnapshot);

      // 4. /RespostasdoFormulário3 (Global NPS + Síntese)
      const handleGlobalSnapshot = snapshot => {
        try {
          if (snapshot.val() !== null) {
            state.rawFirebaseData.global = snapshot.val();
            syncAllFirebaseData();
          }
        } catch (err) {
          console.warn("Aviso /RespostasdoFormulário3:", err);
        }
      };
      safeListen(["/RespostasdoFormulário3", "/RespostasdoFormulario3", "/Respostas do Formulário 3", "/Respostas do Formulario 3", "/Formulário3", "/Formulario3"], handleGlobalSnapshot);

      state.isLive = true;
      updateConnectionBadge(true);
    } catch (err) {
      console.error("Erro ao inicializar Firebase Realtime Database no ResultsDashboard:", err);
    }
  }

  // Keep-Alive & Reconnect ao alternar separadores no browser
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      try {
        if (typeof firebase !== "undefined" && firebase.database) {
          firebase.database().goOnline();
        }
      } catch (e) {
        console.warn("Aviso ao reconectar Firebase via visibilitychange:", e);
      }
    }
  });

  /**
   * Sincroniza e processa os dados reais recebidos dos nós do Firebase
   */
  function syncAllFirebaseData() {
    try {
      const game = filterValidParticipantRows(state.rawFirebaseData.game);
      const sim = filterValidParticipantRows(state.rawFirebaseData.sim);
      const global = filterValidParticipantRows(state.rawFirebaseData.global);

      state.kpis = computeKpis(game, sim, global);

      const hasValidAnswers = game.rows.length + sim.rows.length + global.rows.length > 0;
      if (hasValidAnswers) {
        processRealData(game.rows, sim.rows, global.rows);
        state.isWaitingAnswers = false;
      } else {
        state.isWaitingAnswers = true;
      }

      state.isLive = true;
      renderAllDashboardMetrics();
      updateConnectionBadge(true);
    } catch (err) {
      console.warn("⚠️ Aviso ao processar dados do Firebase:", err);
      // REGRA DE OURO: NÃO apagar state.metrics nem fazer reset a zeros em caso de erro!
    }
  }

  /**
   * Atualiza o número de participantes da amostra total e sincroniza os cartões KPI
   */
  function setLiveParticipantCount(count) {
    if (typeof count === "number" && count >= 0 && state.totalLogins !== count) {
      state.totalLogins = count;
      renderKpiCards();
    }
  }

  let isFetchingData = false;

  /**
   * Pára o spinner do botão de atualização e reativa o botão na interface ativa
   */
  function stopRefreshSpinner() {
    isFetchingData = false;
    const btn = document.getElementById("btn-refresh-results");
    if (btn) {
      btn.disabled = false;
      const spinners = btn.querySelectorAll(".animate-spin, [class*='animate-spin']");
      spinners.forEach(el => el.classList.remove("animate-spin"));
    }
    const icon = document.getElementById("icon-refresh-results");
    if (icon) {
      icon.classList.remove("animate-spin");
    }
  }

  /**
   * Sincronização sob demanda (acionada pelo botão 'Atualizar Dados' ou atalhos)
   * Executa leituras explícitas db.ref().once('value') nos 4 nós, força re-processamento,
   * executa chart.update() e atualiza obrigatoriamente o elemento de hora (Última atualização: HH:MM:SS)
   */
  async function fetchData(isManualRefresh = false) {
    if (isFetchingData) return;
    isFetchingData = true;

    const refreshBtn = document.getElementById("btn-refresh-results");
    const refreshIcon = document.getElementById("icon-refresh-results") || (refreshBtn ? refreshBtn.querySelector("svg") : null);
    if (refreshIcon) refreshIcon.classList.add("animate-spin");
    if (refreshBtn) refreshBtn.disabled = true;

    // Watchdog de segurança para garantir que o spinner e o botão nunca ficam bloqueados
    const watchdogTimer = setTimeout(() => {
      stopRefreshSpinner();
    }, 10000);

    try {
      if (typeof firebase !== "undefined" && firebase.database) {
        const db = firebase.database();
        try { db.goOnline(); } catch (e) {}

        // Helper para leitura resiliente com candidatos a caminhos de nós no Firebase
        const fetchCandidateNode = async (candidates) => {
          for (const path of candidates) {
            try {
              const snap = await db.ref(path).once("value");
              if (snap && snap.exists() && snap.val() !== null) {
                return snap.val();
              }
            } catch (e) {}
          }
          return null;
        };

        // 1. Tentar ler raiz "/" para obter toda a árvore de forma unificada
        try {
          const rootSnap = await db.ref("/").once("value");
          if (rootSnap && rootSnap.val()) {
            const rootVal = rootSnap.val();
            console.log("[Firebase Parser] Manual refresh root keys:", Object.keys(rootVal));
            for (const k of Object.keys(rootVal)) {
              const val = rootVal[k];
              if (!val) continue;
              const normKey = k.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "");
              if (normKey.includes("login")) {
                const validLogins = extractValidLoginCodes(val);
                if (validLogins.length > 0) {
                  state.totalLogins = validLogins.length;
                  state.uniqueLoginCodes = new Set(validLogins);
                  if (window.SubmissionsTracker && typeof window.SubmissionsTracker.setTotalParticipants === "function") {
                    window.SubmissionsTracker.setTotalParticipants(validLogins.length, validLogins);
                  }
                }
              } else if (normKey.includes("1") || normKey.includes("game") || normKey.includes("tallentto")) {
                state.rawFirebaseData.game = val;
              } else if (normKey.includes("2") || normKey.includes("sim") || normKey.includes("virmedex")) {
                state.rawFirebaseData.sim = val;
              } else if (normKey.includes("3") || normKey.includes("global") || normKey.includes("nps")) {
                state.rawFirebaseData.global = val;
              }
            }
          }
        } catch (rootErr) {
          console.warn("Aviso na leitura da raiz no fetchData:", rootErr);
        }

        // 2. Leituras pontuais diretas como redundância (suporta com/sem acentos, com/sem espaços)
        const [snapLogins, snapGame, snapSim, snapGlobal] = await Promise.all([
          fetchCandidateNode(["/Logins", "/logins", "/Login"]),
          fetchCandidateNode(["/RespostasdoFormulário1", "/RespostasdoFormulario1", "/Respostas do Formulário 1", "/Respostas do Formulario 1", "/Formulário1", "/Formulario1"]),
          fetchCandidateNode(["/RespostasdoFormulário2", "/RespostasdoFormulario2", "/Respostas do Formulário 2", "/Respostas do Formulario 2", "/Formulário2", "/Formulario2"]),
          fetchCandidateNode(["/RespostasdoFormulário3", "/RespostasdoFormulario3", "/Respostas do Formulário 3", "/Respostas do Formulario 3", "/Formulário3", "/Formulario3"])
        ]);

        if (snapLogins !== null) {
          const validLogins = extractValidLoginCodes(snapLogins);
          if (validLogins.length > 0) {
            state.totalLogins = validLogins.length;
            state.uniqueLoginCodes = new Set(validLogins);
            if (window.SubmissionsTracker && typeof window.SubmissionsTracker.setTotalParticipants === "function") {
              window.SubmissionsTracker.setTotalParticipants(validLogins.length, validLogins);
            }
          }
        }
        if (snapGame !== null) {
          state.rawFirebaseData.game = snapGame;
        }
        if (snapSim !== null) {
          state.rawFirebaseData.sim = snapSim;
        }
        if (snapGlobal !== null) {
          state.rawFirebaseData.global = snapGlobal;
        }
      }

      // Sincronizar e re-processar dados (chama chart.update() em todos os gráficos)
      syncAllFirebaseData();

      // Sincronizar contadores da UI no SubmissionsTracker (sem re-invocar Firebase)
      if (window.SubmissionsTracker && typeof window.SubmissionsTracker.updateAllCounters === "function") {
        try {
          window.SubmissionsTracker.updateAllCounters();
        } catch (stErr) {
          console.warn("Aviso ao atualizar SubmissionsTracker:", stErr);
        }
      }

      const isEn = window.I18nManager && window.I18nManager.isEnglish();
      const now = new Date();
      const timeStr = now.toLocaleTimeString(isEn ? "en-GB" : "pt-PT", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      state.lastUpdated = timeStr;

      const timeEl = document.getElementById("results-last-sync-time");
      if (timeEl) {
        timeEl.textContent = isEn ? `Last update: ${timeStr}` : `Última atualização: ${timeStr}`;
      }
      updateConnectionBadge(true);

      if (isManualRefresh) {
        const count = state.kpis ? state.kpis.submissionCodes.size : 0;
        const msg = isEn
          ? `Data updated successfully at ${timeStr} (${state.totalLogins} participants, ${count} respondents)`
          : `Dados atualizados com sucesso às ${timeStr} (${state.totalLogins} participantes, ${count} respondentes)`;
        showToast(msg, "success");
      }
    } catch (err) {
      console.warn("Aviso ao atualizar dados sob demanda:", err);
      try {
        syncAllFirebaseData();
      } catch (e) {}
    } finally {
      clearTimeout(watchdogTimer);
      stopRefreshSpinner();
      setTimeout(stopRefreshSpinner, 50);
      setTimeout(stopRefreshSpinner, 250);
    }
  }

  /**
   * Atualiza o badge de estado de ligação em tempo real e o elemento de texto da hora
   */
  function updateConnectionBadge(isConnected = false) {
    const badge = document.getElementById("results-live-status-badge");
    const timeEl = document.getElementById("results-last-sync-time");
    if (!badge) return;

    const isEn = window.I18nManager && window.I18nManager.isEnglish();
    const now = new Date();
    const timeStr = state.lastUpdated || now.toLocaleTimeString(isEn ? "en-GB" : "pt-PT", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    state.lastUpdated = timeStr;

    if (timeEl) {
      timeEl.textContent = isEn ? `Last update: ${timeStr}` : `Última atualização: ${timeStr}`;
    }

    if (isConnected || state.isLive) {
      badge.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs";
      badge.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>${isEn ? "Firebase Connected (Real-Time Push)" : "Firebase Conectado (WebSockets em Tempo Real)"}</span>
      `;
    } else {
      badge.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300 shadow-2xs";
      badge.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-slate-400"></span>
        <span>${isEn ? "Connecting to Firebase..." : "A conectar ao Firebase..."}</span>
      `;
    }
  }

  /**
   * Carrega os dados pedagógicos de demonstração fornecidos em content-data.js
   */
  function loadDemoData() {
    const demo = RENOVATE_CONFIG.resultsDashboard?.demoData;
    if (!demo) return;

    const game = demo.gameResponses || [];
    const sim = demo.simulatorResponses || [];
    const global = demo.globalResponses || [];

    // Calcular métricas
    const susGame = calculateSusFromResponses(game.map(r => r.sus));
    const susSim = calculateSusFromResponses(sim.map(r => r.sus));
    const q29List = global.map(r => r.q29 || r.nps);
    const nps = calculateQ29Recommendation(q29List);

    // Palavras-chave
    const wordsGame = extractWordFrequencies(game.map(r => r.words));
    const wordsSim = extractWordFrequencies(sim.map(r => r.words));

    // Demografia
    const profiles = {};
    const crops = {};
    const ages = {};
    let digitalTotal = 0;

    game.forEach(r => {
      const p = normalizeProfile(r.profile);
      profiles[p] = (profiles[p] || 0) + 1;
      ages[r.age] = (ages[r.age] || 0) + 1;
      const c = parseDigitalComfort(r.digitalComfort);
      digitalTotal += c;
      if (Array.isArray(r.crops)) {
        r.crops.forEach(cItem => {
          const normCrop = normalizeCrop(cItem);
          if (normCrop) crops[normCrop] = (crops[normCrop] || 0) + 1;
        });
      }
    });

    // Médias Pedagógicas do Serious Game
    const gamePedagogy = {
      q7: average(game.map(r => r.q7)),
      q8: average(game.map(r => r.q8)),
      q9: average(game.map(r => r.q9)),
      q10: average(game.map(r => r.q10)),
      q11: average(game.map(r => r.q11)),
      q12: average(game.map(r => r.q12))
    };

    // Médias Técnicas do Simulador
    const simModules = {
      q15: average(sim.map(r => r.q15)),
      q16: average(sim.map(r => r.q16)),
      q17: average(sim.map(r => r.q17)),
      q18: average(sim.map(r => r.q18)),
      q19: average(sim.map(r => r.q19)),
      q20: average(sim.map(r => r.q20)),
      q21: average(sim.map(r => r.q21)),
      q22: average(sim.map(r => r.q22)),
      q23: average(sim.map(r => r.q23))
    };

    state.metrics = {
      participantCount: Math.max(game.length, sim.length, global.length),
      susGame,
      susSim,
      nps,
      wordsGame,
      wordsSim,
      gamePedagogy,
      simModules,
      demographics: {
        profiles,
        crops,
        ages,
        digitalComfortAvg: game.length ? (digitalTotal / game.length).toFixed(1) : 3.8
      },
      qualitativeFeedback: {
        simSuggestions: sim.filter(r => r.q25).map(r => ({ code: r.code, text: r.q25 })),
        finalSuggestions: global.filter(r => r.q30).map(r => ({ code: r.code, text: r.q30 }))
      }
    };
  }

  /**
   * Processa os dados reais lidos via CSV das 3 abas
   */
  /**
   * Extrai a média Likert (1 a 5) de uma questão a partir de um array de linhas (Objetos ou 2D)
   * Suporta identificação por número de questão (qNum) ou regex de palavras-chave.
   */
  function extractLikertAverage(rows, qNum, keywordRegex = null) {
    if (!rows || !rows.length) return 0;
    const vals = rows.map(r => {
      let rawVal;
      if (typeof r === "object" && !Array.isArray(r)) {
        rawVal = getRowQuestionValue(r, qNum, keywordRegex);
      } else if (Array.isArray(r) && typeof qNum === "number") {
        rawVal = r[qNum];
      } else {
        rawVal = r;
      }
      return parseLikertStrict(rawVal);
    }).filter(v => v !== null);

    if (!vals.length) return 0;
    const sum = vals.reduce((a, b) => a + b, 0);
    return parseFloat((sum / vals.length).toFixed(1));
  }

  /**
   * Extrai a média convertida da Q8 (Índice de Adequação da Dificuldade)
   * A escala original da Q8 não é linear (3 é excelente, 1 e 5 são maus).
   * Fórmula por resposta individual: Valor_Convertido = 5 - ( ABS(Resposta_Original - 3) * 2 )
   * Resposta 3 -> 5 | Resposta 2 ou 4 -> 3 | Resposta 1 ou 5 -> 1
   */
  function extractConvertedQ8Average(rows, colIdxOrRegex = null) {
    if (!rows || !rows.length) return 0;
    const vals = rows.map(r => {
      let rawVal;
      if (typeof r === "object" && !Array.isArray(r)) {
        rawVal = getRowQuestionValue(r, 8, /dificuldade|adequaç|adequac|equilibrad|difficulty|suitability/i);
      } else if (Array.isArray(r) && typeof colIdxOrRegex === "number") {
        rawVal = r[colIdxOrRegex];
      } else {
        rawVal = r;
      }
      return parseLikertStrict(rawVal);
    }).filter(v => v !== null);

    if (!vals.length) return 0;
    const converted = vals.map(v => 5 - (Math.abs(v - 3) * 2));
    const sum = converted.reduce((a, b) => a + b, 0);
    return parseFloat((sum / converted.length).toFixed(1));
  }

  /**
   * Processa os dados reais lidos via Firebase ou CSV das 3 abas
   * Suporta diretamente arrays de linhas de objetos (ou matrizes 2D)
   */
  function processRealData(gameInput, simInput, globalInput) {
    const gameRows = extractRowObjects(gameInput);
    const simRows = extractRowObjects(simInput);
    const globalRows = extractRowObjects(globalInput);

    // 1. SUS Serious Game (Q13)
    const susGame = computeSusKpi(gameRows, 13, /game|jogo/i);

    // 2. SUS Simulador (Q24)
    const susSim = computeSusKpi(simRows, 24, /simulador|sim/i);

    // 3. Q29 Recomendação
    const q29Responses = [];
    globalRows.forEach(row => {
      const val = getRowQuestionValue(row, 29, /recomenda|recomendaria|provável|provavel|nps/i);
      if (val && String(val).trim()) {
        q29Responses.push(val);
      }
    });
    const nps = calculateQ29Recommendation(q29Responses);

    // 4. Nuvens de Palavras
    const rawWordsGame = gameRows.map(r => {
      return getRowQuestionValue(r, null, /3 palavras|three words|3 words|palavras/i);
    }).filter(Boolean);

    const rawWordsSim = simRows.map(r => {
      return getRowQuestionValue(r, null, /3 palavras|three words|3 words|palavras/i);
    }).filter(Boolean);

    const wordsGame = extractWordFrequencies(rawWordsGame);
    const wordsSim = extractWordFrequencies(rawWordsSim);

    // 5. Demografia
    const profiles = {};
    OFFICIAL_PROFILES.forEach(p => { profiles[p] = 0; });
    const crops = {};
    OFFICIAL_CROPS.forEach(c => { crops[c] = 0; });
    const ages = {};
    let digitalTotal = 0;
    let digitalCount = 0;

    gameRows.forEach(row => {
      const valProfile = getRowQuestionValue(row, 1, /perfil|profissão|profissao|função|funcao|profile/i);
      if (valProfile && String(valProfile).trim()) {
        const p = normalizeProfile(valProfile);
        profiles[p] = (profiles[p] || 0) + 1;
      }

      const valAge = getRowQuestionValue(row, 2, /idade|faixa etária|faixa etaria|age/i);
      if (valAge && String(valAge).trim()) {
        const a = String(valAge).trim();
        ages[a] = (ages[a] || 0) + 1;
      }

      const valComfort = getRowQuestionValue(row, 6, /confortável|confortavel|digital|tecnolog|literacia/i);
      if (valComfort && String(valComfort).trim()) {
        const c = parseDigitalComfort(valComfort);
        if (c !== null) {
          digitalTotal += c;
          digitalCount++;
        }
      }

      const valCrops = getRowQuestionValue(row, 5, /cultura|culturas|crops/i);
      if (valCrops && String(valCrops).trim()) {
        const cropItems = String(valCrops).split(/[,;]/);
        const seenInRow = new Set();
        cropItems.forEach(c => {
          const normCrop = normalizeCrop(c);
          if (normCrop && !seenInRow.has(normCrop)) {
            seenInRow.add(normCrop);
            crops[normCrop] = (crops[normCrop] || 0) + 1;
          }
        });
      }
    });

    // 6. Médias Pedagógicas Game (Q7 a Q12)
    const gamePedagogy = {
      q7: extractLikertAverage(gameRows, 7, /explicaç|explicac|clareza|claras|compreens|clarity|explanation/i),
      q8: extractConvertedQ8Average(gameRows, /dificuldade|adequaç|adequac|equilibrad|difficulty|suitability/i),
      q9: extractLikertAverage(gameRows, 9, /realismo|cenário|cenario|prática real|pratica real|realism|scenario/i),
      q10: extractLikertAverage(gameRows, 10, /calibraç|calibrac|utilidade|aprender|passos-chave|passos chave|módulo|modulo|calibration|usefulness/i),
      q11: extractLikertAverage(gameRows, 11, /lúdico|ludico|envolvimento|envolvente|motiva|gamifi|questionáriojogo|questionariojogo|engagement/i),
      q12: extractLikertAverage(gameRows, 12, /expectativa|expectativas|aprendizagem rápida|aprendizagem rapida|global|globais|expectations/i)
    };

    // 7. Médias Técnicas Simulador (Q15 a Q23)
    const simModules = {
      q15: extractLikertAverage(simRows, 15, /navegaç|navegac|controlo|controles|controlos|controlos básicos|controlos basicos|interface|navigation|controls/i),
      q16: extractLikertAverage(simRows, 16, /tutorial|tutoriais|menu|menus|instruç|instruc/i),
      q17: extractLikertAverage(simRows, 17, /eficácia|eficacia|pedagóg|pedagog|tarefas práticas|tarefas praticas|aprendiz|efficacy/i),
      q18: extractLikertAverage(simRows, 18, /sequência|sequencia|decisão|decisao|etapas|sequence|decision/i),
      q19: extractLikertAverage(simRows, 19, /cálculo|calculo|fórmula|formula|contas|débito|debito|largura de trabalho|calculations|formulas/i),
      q20: extractLikertAverage(simRows, 20, /bico|bicos|volume|calda|gotas|spray|nozzles/i),
      q21: extractLikertAverage(simRows, 21, /seleção|selecao|rótulo|rotulo|etiqueta|produto|label/i),
      q22: extractLikertAverage(simRows, 22, /variável|variavel|campo|terreno|vento|cenários de campo|cenarios de campo|variables/i),
      q23: extractLikertAverage(simRows, 23, /expectativa|expectativas|proteção de culturas|protecao de culturas|expectations/i)
    };

    // 8. Feedback Qualitativo
    const feedItems = [];

    function collectFeedbackFromRows(rows, qConfigs) {
      rows.forEach((row, rowIdx) => {
        const code = row._participantCode || extractParticipantCodeFromRow(row) || "Participante";
        const ts = parseSubmissionTimestamp(row["Carimbo de data/hora"] || row.timestamp || row.carimbo);

        qConfigs.forEach(cfg => {
          const textVal = getRowQuestionValue(row, cfg.qNum, cfg.regex);
          if (!textVal) return;
          const text = String(textVal).trim();
          if (!isValidFeedbackText(text)) return;

          feedItems.push({
            code,
            text,
            tagPT: cfg.tagPT,
            tagEN: cfg.tagEN,
            tagType: cfg.tagType,
            timestamp: ts,
            orderKey: ts > 0 ? ts : (rowIdx + 1)
          });
        });
      });
    }

    collectFeedbackFromRows(simRows, [
      { qNum: 25, regex: /confuso|falta|dúvida|duvida|sugest/i, tagPT: "Simulador", tagEN: "Simulator", tagType: "sim" },
      { qNum: 26, regex: /compreens|clareza|aplicabilidade/i, tagPT: "Experiência Global", tagEN: "Global Experience", tagType: "global" },
      { qNum: 27, regex: /confiança|confianca|autonomia/i, tagPT: "Experiência Global", tagEN: "Global Experience", tagType: "global" },
      { qNum: 28, regex: /valor|relevância|relevancia|adicionado/i, tagPT: "Experiência Global", tagEN: "Global Experience", tagType: "global" },
      { qNum: 30, regex: /erros|falhas|melhorias|comentário|comentario/i, tagPT: "Erro / Sugestão", tagEN: "Bug / Suggestion", tagType: "issue" }
    ]);

    collectFeedbackFromRows(globalRows, [
      { qNum: 25, regex: /confuso|falta/i, tagPT: "Simulador", tagEN: "Simulator", tagType: "sim" },
      { qNum: 26, regex: /compreens|clareza|geral/i, tagPT: "Experiência Global", tagEN: "Global Experience", tagType: "global" },
      { qNum: 27, regex: /confiança|confianca|autonomia/i, tagPT: "Experiência Global", tagEN: "Global Experience", tagType: "global" },
      { qNum: 28, regex: /valor|relevância|relevancia/i, tagPT: "Experiência Global", tagEN: "Global Experience", tagType: "global" },
      { qNum: 30, regex: /erros|falhas|melhorias|comentários|comentarios/i, tagPT: "Erro / Sugestão", tagEN: "Bug / Suggestion", tagType: "issue" }
    ]);

    feedItems.sort((a, b) => b.orderKey - a.orderKey);

    const simSuggestions = feedItems.filter(f => f.tagType === "sim");
    const finalSuggestions = feedItems.filter(f => f.tagType === "issue");

    state.metrics = {
      participantCount: Math.max(gameRows.length, simRows.length, globalRows.length, state.totalLogins || 0, state.kpis?.submissionCodes?.size || 0),
      susGame,
      susSim,
      nps,
      wordsGame,
      wordsSim,
      gamePedagogy,
      simModules,
      demographics: {
        profiles,
        crops,
        ages,
        digitalComfortAvg: digitalCount > 0 ? parseFloat((digitalTotal / digitalCount).toFixed(1)) : null
      },
      qualitativeFeedback: {
        feed: feedItems,
        simSuggestions,
        finalSuggestions
      }
    };
  }

  /**
   * Encontra o índice da coluna correspondente via RegExp
   */
  function findColIndex(headers, regex) {
    if (!headers || !headers.length) return -1;
    for (let i = 0; i < headers.length; i++) {
      if (regex.test(headers[i])) return i;
    }
    return -1;
  }

  /**
   * Extrai um número de uma resposta Likert (ex: "4 - Concordo" -> 4)
   */
  function parseLikertNumber(val) {
    if (typeof val === "number") return val;
    if (!val) return null;
    const match = String(val).match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
  }

  /**
   * Cálculo oficial do Score SUS (Brooke, 1996)
   * Formula: Odd items: (R - 1); Even items: (5 - R); Score = sum * 2.5
   */
  function calculateSusFromResponses(responsesArray) {
    const isEn = window.I18nManager && window.I18nManager.isEnglish();
    const defaultBenchmark = isEn ? "Awaiting responses" : "A aguardar respostas";

    if (!responsesArray || !responsesArray.length) {
      return { average: null, benchmark: defaultBenchmark, itemsAvg: new Array(10).fill(0) };
    }

    const itemsSum = new Array(10).fill(0);
    let totalScore = 0;
    let count = 0;

    responsesArray.forEach(resp => {
      if (!resp || resp.length < 10) return;
      let participantScore = 0;
      for (let i = 0; i < 10; i++) {
        const val = Math.min(Math.max(parseFloat(resp[i]) || 3, 1), 5);
        itemsSum[i] += val;
        if (i % 2 === 0) {
          participantScore += (val - 1);
        } else {
          participantScore += (5 - val);
        }
      }
      totalScore += (participantScore * 2.5);
      count++;
    });

    if (count === 0) {
      return { average: null, benchmark: defaultBenchmark, itemsAvg: new Array(10).fill(0) };
    }

    const averageScore = totalScore / count;
    const roundedAvg = parseFloat(averageScore.toFixed(1));

    // Mapeamento e Inversão das 10 dimensões SUS para escala positiva 1 a 5:
    // Ímpares (1, 3, 5, 7, 9 -> índices 0, 2, 4, 6, 8): Média bruta (1 a 5)
    // Pares (2, 4, 6, 8, 10 -> índices 1, 3, 5, 7, 9): 6 - Média bruta
    const itemsAvg = itemsSum.map((s, idx) => {
      const rawMean = s / count;
      const val = (idx % 2 === 0) ? rawMean : (6 - rawMean);
      return parseFloat(val.toFixed(1));
    });

    return {
      average: roundedAvg,
      benchmark: getSusLabel(roundedAvg, isEn),
      itemsAvg
    };
  }

  /**
   * Cálculo oficial de Net Promoter Score (NPS)
   */
  function calculateNpsFromScores(scores) {
    if (!scores || !scores.length) {
      return { score: 65, promoters: 12, passives: 4, detractors: 1, total: 17 };
    }

    let prom = 0, pass = 0, det = 0;
    scores.forEach(s => {
      const v = parseFloat(s);
      if (v >= 9) prom++;
      else if (v >= 7) pass++;
      else det++;
    });

    const total = scores.length;
    const score = Math.round(((prom - det) / total) * 100);

    return { score, promoters: prom, passives: pass, detractors: det, total };
  }

  /**
   * Pipeline de Processamento de Texto (Text Mining):
   * 1. Normalização: converter todo o texto para minúsculas (lowercase).
   * 2. Limpeza de Pontuação: substituir vírgulas, pontos, pontos e vírgulas, hífens e símbolos por espaços.
   * 3. Tokenização: separar as strings em palavras individuais (split por espaços).
   * 4. Filtro de Stopwords (PT/EN): remover pronomes, artigos e palavras de ligação comuns.
   * 5. Agregação & Capitalização: contar frequência e capitalizar primeira letra (ex: "inovador" -> "Inovador").
   * 6. Ordenação: por frequência decrescente e desempate alfabético.
   */
  function extractWordFrequencies(textsArray) {
    const counts = {};
    if (!textsArray || !textsArray.length) return [];

    textsArray.forEach(text => {
      if (!text || typeof text !== "string") return;
      // 1. Normalização & 2. Limpeza de Pontuação (vírgulas, pontos, ponto e vírgula, hífen e símbolos)
      const cleaned = text
        .toLowerCase()
        .replace(/[,.;\-_/#!$%^&*:{}=\\+`~()?"'«»[\]|<>@]/g, " ");

      // 3. Tokenização por espaços em branco
      const words = cleaned.split(/\s+/);

      words.forEach(w => {
        const clean = w.trim();
        // 4. Filtro de Stopwords, tamanho mínimo e números isolados
        if (
          clean.length >= 2 &&
          !/^\d+$/.test(clean) &&
          !PT_STOPWORDS.has(clean) &&
          !EN_STOPWORDS.has(clean)
        ) {
          // 5. Capitalizar primeira letra antes de agregar (ex: "inovador" -> "Inovador")
          const capitalized = clean.charAt(0).toUpperCase() + clean.slice(1);
          counts[capitalized] = (counts[capitalized] || 0) + 1;
        }
      });
    });

    // 6. Ordenação por frequência decrescente e desempate alfabético
    const entries = Object.entries(counts).sort((a, b) => {
      if (b[1] !== a[1]) {
        return b[1] - a[1];
      }
      return a[0].localeCompare(b[0], "pt", { sensitivity: "base" });
    });

    return entries.slice(0, 45); // Top 45 palavras mais frequentes
  }

  /**
   * Calcula média de array numérico (0 se sem valores válidos)
   */
  function average(arr) {
    if (!arr || !arr.length) return 0;
    const nums = arr.map(n => parseFloat(n)).filter(n => !isNaN(n) && n > 0);
    if (!nums.length) return 0;
    const sum = nums.reduce((acc, curr) => acc + curr, 0);
    return parseFloat((sum / nums.length).toFixed(1));
  }

  /**
   * Renderiza todos os KPIs, gráficos e tabelas do Dashboard
   */
  function renderAllDashboardMetrics() {
    if (!state.metrics) return;
    const m = state.metrics;

    // 1. Atualizar Indicadores Principais (KPI Strip - 4 cartões de resumo)
    renderKpiCards();

    // 2. Renderizar Nuvem de Palavras
    renderWordCloud();

    // 3. Renderizar Régua e Gráficos de Usabilidade SUS
    renderSusBenchmarkGauge();
    renderSusComparisonChart();
    renderGamePedagogyChart();
    renderSimModulesChart();
    renderDemographicsCharts();
    renderNpsChart();

    // 4. Renderizar Feedback Qualitativo
    renderQualitativeFeedback();

    if (window.lucide) {
      try {
        window.lucide.createIcons();
      } catch (e) {
        console.warn("Aviso ao inicializar ícones Lucide no dashboard:", e);
      }
    }
    // Garante que o ícone do botão de atualização não fica preso em rotação após o Lucide recriar elementos
    if (!isFetchingData) {
      stopRefreshSpinner();
    }
  }

  /**
   * Renderização da Nuvem de Palavras via WordCloud2 ou Fallback elegante de Tags
   */
  function renderWordCloud() {
    const canvas = document.getElementById("wordcloud-canvas");
    const container = document.getElementById("wordcloud-container");
    const listContainer = document.getElementById("wordcloud-top-list");
    if (!canvas || !container || !state.metrics) return;

    const isEn = window.I18nManager && window.I18nManager.isEnglish();
    const isGame = state.activeWordCloudTool === "game";
    const wordsList = isGame ? state.metrics.wordsGame : state.metrics.wordsSim;

    // Renderizar Lista Top 3 no Painel Lateral com Badges Elegantes e Contagem (ex: 5x)
    if (listContainer) {
      if (!wordsList || !wordsList.length) {
        listContainer.innerHTML = `<li data-i18n="results.wc.none" class="text-xs text-slate-400 italic py-4 text-center">${isEn ? "No words recorded yet." : "Sem palavras registadas de momento."}</li>`;
      } else {
        const topList = wordsList.slice(0, 3);
        const rankBadges = [
          '<span class="w-5 h-5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black flex items-center justify-center font-mono shadow-xs">1</span>',
          '<span class="w-5 h-5 rounded-full bg-slate-300 text-slate-800 text-[10px] font-black flex items-center justify-center font-mono shadow-xs">2</span>',
          '<span class="w-5 h-5 rounded-full bg-amber-700/30 text-amber-900 text-[10px] font-black flex items-center justify-center font-mono shadow-xs">3</span>'
        ];
        listContainer.innerHTML = topList.map(([word, count], idx) => `
          <li class="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0">
            <span class="font-bold text-slate-800 flex items-center gap-2">
              ${rankBadges[idx] || `<span class="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-mono">${idx + 1}</span>`}
              <span>${word}</span>
            </span>
            <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-extrabold text-[11px] font-mono border border-slate-200/60">
              ${count}x
            </span>
          </li>
        `).join("");
      }
    }

    // Se a biblioteca WordCloud2 estiver disponível no ecrã
    if (window.WordCloud) {
      // Ajustar resolução interna do canvas para alta definição
      const rect = (typeof container.getBoundingClientRect === "function")
        ? container.getBoundingClientRect()
        : { width: 380, height: 280 };
      const width = Math.max((rect.width || 380) - 24, 300);
      const height = 280;

      canvas.width = width;
      canvas.height = height;

      // Estado Inicial (Zero-State): sem mock data, exibir placeholder elegante centralizado
      if (!wordsList || !wordsList.length) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, width, height);
        ctx.font = "600 14px Inter, system-ui, -apple-system, sans-serif";
        ctx.fillStyle = "#64748B";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(isEn ? "Awaiting word submissions..." : "A aguardar recolha de palavras...", width / 2, height / 2);
        return;
      }

      // Paleta estrita de cores do projeto RENOVATE (proibido o uso de tons cinzentos ou castanhos):
      // - Verde Esmeralda RENOVATE: #059669
      // - Amarelo/Laranja RENOVATE: #D97706
      // - Azul Escuro/Navy RENOVATE: #0F172A
      const colorPalette = [
        "#059669", // Verde Esmeralda RENOVATE
        "#D97706", // Amarelo/Laranja RENOVATE
        "#0F172A"  // Azul Escuro/Navy RENOVATE
      ];

      // Escalonamento da Fonte diretamente proporcional à frequência (palavras mais citadas com grande destaque)
      const maxCount = wordsList[0][1] || 1;
      const minCount = wordsList[wordsList.length - 1][1] || 1;

      try {
        WordCloud(canvas, {
          list: wordsList,
          gridSize: Math.max(Math.round(10 * width / 1024), 6),
          weightFactor: function (size) {
            if (maxCount === minCount) {
              return Math.min(Math.max(Math.round(22 * (width / 400)), 16), 34);
            }
            const ratio = (size - minCount) / (maxCount - minCount);
            // Escala dinâmica de 14px (mínima) até 52px (máxima frequência)
            const minPx = Math.max(14 * (width / 450), 13);
            const maxPx = Math.min(52 * (width / 450), 56);
            return Math.round(minPx + ratio * (maxPx - minPx));
          },
          fontFamily: "Inter, system-ui, -apple-system, sans-serif",
          fontWeight: "bold",
          color: function (word) {
            let hash = 0;
            const str = String(word || "");
            for (let i = 0; i < str.length; i++) {
              hash = (hash << 5) - hash + str.charCodeAt(i);
            }
            return colorPalette[Math.abs(hash) % colorPalette.length];
          },
          // Disposição visual mista: combinação equilibrada de orientação horizontal (0) e vertical (90°)
          minRotation: 0,
          maxRotation: Math.PI / 2,
          rotationSteps: 2,
          rotateRatio: 0.35,
          backgroundColor: "#FFFFFF",
          shrinkToFit: true,
          drawOutOfBound: false
        });
      } catch (e) {
        console.warn("Aviso ao renderizar WordCloud canvas, a aplicar fallback:", e);
        renderWordPillsFallback(container, wordsList);
      }
    } else {
      renderWordPillsFallback(container, wordsList);
    }
  }

  /**
   * Fallback visual HTML puro em nuvem de etiquetas
   */
  function renderWordPillsFallback(container, wordsList) {
    if (!container) return;
    const isEn = window.I18nManager && window.I18nManager.isEnglish();
    if (!wordsList || !wordsList.length) {
      container.innerHTML = `
        <div class="flex items-center justify-center p-6 min-h-[220px] text-xs text-slate-500 italic">
          ${isEn ? "Awaiting word submissions..." : "A aguardar recolha de palavras..."}
        </div>
      `;
      return;
    }
    const max = wordsList[0][1] || 1;
    const colorPalette = ["#059669", "#D97706", "#0F172A"];
    container.innerHTML = `
      <div class="flex flex-wrap gap-2.5 items-center justify-center p-6 min-h-[220px]">
        ${wordsList.map(([word, count], i) => {
          const ratio = count / max;
          const fontSize = 12 + Math.round(ratio * 18);
          const color = colorPalette[i % colorPalette.length];
          return `
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border bg-white shadow-2xs font-bold transition-transform hover:scale-105" style="font-size: ${fontSize}px; color: ${color}; border-color: ${color}40">
              ${word}
              <span class="text-[10px] opacity-75 font-mono">(${count}x)</span>
            </span>
          `;
        }).join("")}
      </div>
    `;
  }

  /**
   * Renderização da Secção SUS Comparativa e Régua Graduada (Brooke, 1996)
   * Consome diretamente as variáveis de estado já calculadas para os cartões de resumo (Q13 e Q24)
   */
  function renderSusBenchmarkGauge() {
    const isEn = window.I18nManager && window.I18nManager.isEnglish();

    // 2. Cartões de Resumo Comparativo (Reaproveitamento de Dados)
    const k = state.kpis;
    const m = state.metrics;

    const resolveScore = (kpiObj, metricObj) => {
      if (kpiObj && kpiObj.average !== null && kpiObj.average !== undefined) {
        return parseFloat(kpiObj.average);
      }
      if (metricObj && metricObj.average !== null && metricObj.average !== undefined) {
        return parseFloat(metricObj.average);
      }
      return null;
    };

    const gameScore = resolveScore(k?.susGame, m?.susGame);
    const simScore = resolveScore(k?.susSim, m?.susSim);

    const hasGame = gameScore !== null;
    const hasSim = simScore !== null;

    // A. Cartão Esquerdo: Serious Game (Tallentto)
    const cardGameScore = document.getElementById("sus-card-game-score");
    const cardGameBench = document.getElementById("sus-card-game-bench");
    const cardGameDiff = document.getElementById("sus-card-game-diff");

    if (cardGameScore) cardGameScore.textContent = hasGame ? round1(gameScore).toFixed(1) : "—";
    if (cardGameBench) cardGameBench.textContent = getSusLabel(gameScore, isEn);

    // B. Cartão Direito: Simulador RENOVATE (Virmedex)
    const cardSimScore = document.getElementById("sus-card-sim-score");
    const cardSimBench = document.getElementById("sus-card-sim-bench");
    const cardSimDiff = document.getElementById("sus-card-sim-diff");

    if (cardSimScore) cardSimScore.textContent = hasSim ? round1(simScore).toFixed(1) : "—";
    if (cardSimBench) cardSimBench.textContent = getSusLabel(simScore, isEn);

    // Badge de Comparação (Verde se positivo, Vermelho se negativo face a 68.0)
    function updateSusBadge(el, score) {
      if (!el) return;
      el.className = "inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full border transition-colors";
      if (score !== null) {
        const delta = round1(score - 68.0);
        const sign = delta >= 0 ? "+" : "";
        el.textContent = `${sign}${delta.toFixed(1)} ${isEn ? "vs Global Avg" : "vs Média Mundial"}`;
        if (delta >= 0) {
          el.classList.add("bg-emerald-100", "text-emerald-800", "border-emerald-300");
        } else {
          el.classList.add("bg-rose-100", "text-rose-800", "border-rose-300");
        }
      } else {
        el.textContent = `— ${isEn ? "vs Global Avg" : "vs Média Mundial"}`;
        el.classList.add("bg-slate-100", "text-slate-500", "border-slate-200");
      }
    }

    updateSusBadge(cardGameDiff, gameScore);
    updateSusBadge(cardSimDiff, simScore);

    // 3. Gráfico da Escala SUS (Barra Horizontal) - Pinos Dinâmicos
    const pinGame = document.getElementById("sus-pin-game");
    const pinSim = document.getElementById("sus-pin-sim");
    const pinGameText = document.getElementById("sus-pin-game-text");
    const pinSimText = document.getElementById("sus-pin-sim-text");

    if (pinGame && pinGame.style) {
      if (hasGame) {
        pinGame.style.display = "flex";
        pinGame.style.opacity = "1";
        const clampedGame = Math.min(Math.max(gameScore, 0), 100);
        pinGame.style.left = `${clampedGame}%`;
      } else {
        pinGame.style.display = "none";
        pinGame.style.opacity = "0";
      }
    }
    if (pinGameText) {
      pinGameText.textContent = hasGame ? `Game: ${round1(gameScore).toFixed(1)}` : "—";
    }

    if (pinSim && pinSim.style) {
      if (hasSim) {
        pinSim.style.display = "flex";
        pinSim.style.opacity = "1";
        const clampedSim = Math.min(Math.max(simScore, 0), 100);
        pinSim.style.left = `${clampedSim}%`;
      } else {
        pinSim.style.display = "none";
        pinSim.style.opacity = "0";
      }
    }
    if (pinSimText) {
      pinSimText.textContent = hasSim ? `Simulador: ${round1(simScore).toFixed(1)}` : "—";
    }
  }

  /**
   * =====================================================================
   * INICIALIZAÇÃO E GESTÃO DE ESTADO CHART.JS v4 (FIM DO FLICKERING)
   * Regra de Ouro: No evento onValue do Firebase, NUNCA chamar chart.destroy()
   * Gráficos inicializados com data: [] no DOMContentLoaded/init
   * Instâncias armazenadas centralmente em window.chartInstances
   * Atualizações via mutação direta de datasets e chart.update()
   * =====================================================================
   */

  /**
   * Inicialização do Gráfico 1: Comparativo SUS
   */
  function initSusComparisonChart() {
    const canvas = document.getElementById("chart-sus-comparison");
    if (!canvas || !window.Chart) return;
    if (window.chartInstances.susComparison) return;

    const ctx = canvas.getContext("2d");
    const isEn = window.I18nManager && window.I18nManager.isEnglish();
    const susLabels = isEn ? [
      "1. Frequency of Use", "2. Low Complexity", "3. Ease of Use", "4. Tech Independence",
      "5. Well Integrated", "6. Overall Consistency", "7. Quick Learning", "8. Usability Comfort",
      "9. Confidence in Use", "10. Easy Onboarding"
    ] : [
      "1. Frequência de Uso", "2. Baixa Complexidade", "3. Facilidade de Uso", "4. Independência Técnica",
      "5. Boa Integração", "6. Consistência Geral", "7. Aprendizagem Rápida", "8. Conforto de Uso",
      "9. Confiança Operacional", "10. Fácil Iniciação"
    ];

    window.chartInstances.susComparison = new Chart(ctx, {
      type: "bar",
      data: {
        labels: susLabels,
        datasets: [
          {
            label: "Serious Game (Tallentto)",
            data: new Array(10).fill(0),
            backgroundColor: "#F5B842",
            borderColor: "#D97706",
            borderWidth: 1.5,
            borderRadius: 6,
            maxBarThickness: 28
          },
          {
            label: isEn ? "RENOVATE Simulator (Virmedex)" : "Simulador RENOVATE (Virmedex)",
            data: new Array(10).fill(0),
            backgroundColor: "#0F172A",
            borderColor: "#0F172A",
            borderWidth: 1.5,
            borderRadius: 6,
            maxBarThickness: 28
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: {
              font: { weight: "bold", size: 12 },
              usePointStyle: true,
              pointStyle: "rectRounded",
              padding: 16
            }
          },
          tooltip: {
            backgroundColor: "#0F172A",
            titleFont: { size: 12, weight: "bold" },
            bodyFont: { size: 11 },
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: function(context) {
                const val = context.parsed.y;
                const label = context.dataset.label || "";
                if (val === 0) return `${label}: —`;
                return `${label}: ${val.toFixed(1)} / 5.0`;
              },
              afterLabel: function(context) {
                const idx = context.dataIndex;
                if (idx % 2 === 1) {
                  return (window.I18nManager && window.I18nManager.isEnglish())
                    ? "(Even item inverted: 6 − raw mean; higher = better usability)"
                    : "(Item par invertido: 6 − média bruta; maior = melhor usabilidade)";
                }
                return (window.I18nManager && window.I18nManager.isEnglish())
                  ? "(Direct mean: higher = better usability)"
                  : "(Média direta: maior = melhor usabilidade)";
              }
            }
          }
        },
        scales: {
          y: {
            min: 0,
            max: 5,
            ticks: {
              stepSize: 1,
              font: { size: 11, weight: "bold" },
              color: "#475569"
            },
            title: {
              display: true,
              text: isEn ? "Likert Scale (1 to 5)" : "Escala Likert (1 a 5)",
              font: { size: 12, weight: "bold" },
              color: "#334155"
            },
            grid: {
              color: "#F1F5F9"
            }
          },
          x: {
            ticks: {
              font: { size: 10, weight: "600" },
              color: "#1E293B",
              maxRotation: 35,
              minRotation: 20
            },
            grid: {
              display: false
            }
          }
        }
      }
    });
    state.charts.susComparison = window.chartInstances.susComparison;
  }

  /**
   * Renderização / Atualização do Gráfico 1: Comparativo SUS (In-Place Mutation)
   */
  function renderSusComparisonChart() {
    if (!window.chartInstances.susComparison) {
      initSusComparisonChart();
    }
    const chart = window.chartInstances.susComparison;
    if (!chart) return;

    const isEn = window.I18nManager && window.I18nManager.isEnglish();
    const susLabels = isEn ? [
      "1. Frequency of Use", "2. Low Complexity", "3. Ease of Use", "4. Tech Independence",
      "5. Well Integrated", "6. Overall Consistency", "7. Quick Learning", "8. Usability Comfort",
      "9. Confidence in Use", "10. Easy Onboarding"
    ] : [
      "1. Frequência de Uso", "2. Baixa Complexidade", "3. Facilidade de Uso", "4. Independência Técnica",
      "5. Boa Integração", "6. Consistência Geral", "7. Aprendizagem Rápida", "8. Conforto de Uso",
      "9. Confiança Operacional", "10. Fácil Iniciação"
    ];

    const gameHasData = (state.kpis?.susGame?.average !== null && state.kpis?.susGame?.average !== undefined) ||
                        (state.metrics?.susGame?.average !== null && state.metrics?.susGame?.average !== undefined);
    const simHasData = (state.kpis?.susSim?.average !== null && state.kpis?.susSim?.average !== undefined) ||
                       (state.metrics?.susSim?.average !== null && state.metrics?.susSim?.average !== undefined);

    const gameItems = gameHasData
      ? (state.kpis?.susGame?.itemsAvg || state.metrics?.susGame?.itemsAvg || new Array(10).fill(0))
      : new Array(10).fill(0);

    const simItems = simHasData
      ? (state.kpis?.susSim?.itemsAvg || state.metrics?.susSim?.itemsAvg || new Array(10).fill(0))
      : new Array(10).fill(0);

    chart.data.labels = susLabels;
    if (chart.data.datasets[0]) {
      chart.data.datasets[0].data = gameItems;
    }
    if (chart.data.datasets[1]) {
      chart.data.datasets[1].data = simItems;
      chart.data.datasets[1].label = isEn ? "RENOVATE Simulator (Virmedex)" : "Simulador RENOVATE (Virmedex)";
    }
    if (chart.options.scales?.y?.title) {
      chart.options.scales.y.title.text = isEn ? "Likert Scale (1 to 5)" : "Escala Likert (1 a 5)";
    }
    chart.update();
  }

  /**
   * Inicialização do Gráfico 2: Serious Game Pedagogia (Q7 a Q12)
   */
  function initGamePedagogyChart() {
    const canvas = document.getElementById("chart-game-pedagogy");
    if (!canvas || !window.Chart) return;
    if (window.chartInstances.gamePedagogy) return;

    const ctx = canvas.getContext("2d");
    const isEn = window.I18nManager && window.I18nManager.isEnglish();
    const labels = isEn ? [
      "Q7. Explanation Clarity", "Q8. Difficulty Suitability", "Q9. Scenario Realism",
      "Q10. Calibration Usefulness", "Q11. Gamified Engagement", "Q12. Global Expectations"
    ] : [
      "Q7. Clareza das Explicações", "Q8. Adequação da Dificuldade", "Q9. Realismo dos Cenários",
      "Q10. Utilidade na Calibração", "Q11. Envolvimento Lúdico", "Q12. Expectativas Globais"
    ];

    window.chartInstances.gamePedagogy = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: isEn ? "Mean Rating (1 to 5)" : "Média (1 a 5)",
          data: [0, 0, 0, 0, 0, 0],
          backgroundColor: "#F5B842",
          borderColor: "#D97706",
          borderWidth: 1.5,
          borderRadius: 6,
          maxBarThickness: 24
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#0F172A",
            titleFont: { size: 12, weight: "bold" },
            bodyFont: { size: 11 },
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: function(context) {
                const val = context.parsed.x;
                const isE = window.I18nManager && window.I18nManager.isEnglish();
                if (val === 0) return isE ? "Awaiting data" : "A aguardar dados";
                return `${context.dataset.label || "Média"}: ${val.toFixed(1)} / 5.0`;
              },
              afterLabel: function(context) {
                if (context.dataIndex === 1) {
                  return (window.I18nManager && window.I18nManager.isEnglish())
                    ? "(Adequacy Index: 3=Ideal (5.0), 2/4=Moderate (3.0), 1/5=Extreme (1.0))"
                    : "(Índice de Adequação: 3=Ideal (5.0), 2/4=Moderado (3.0), 1/5=Extremo (1.0))";
                }
                return "";
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            min: 0,
            max: 5,
            ticks: {
              stepSize: 1,
              font: { size: 10, weight: "bold" },
              color: "#475569"
            },
            title: {
              display: true,
              text: isEn ? "Likert Scale (0 to 5)" : "Escala Likert (0 a 5)",
              font: { size: 11, weight: "bold" },
              color: "#334155"
            },
            grid: {
              color: "#F1F5F9"
            }
          },
          y: {
            ticks: {
              font: { size: 10, weight: "600" },
              color: "#0F172A"
            },
            grid: {
              display: false
            }
          }
        }
      }
    });
    state.charts.gamePedagogy = window.chartInstances.gamePedagogy;
  }

  /**
   * Renderização / Atualização do Gráfico 2: Serious Game Pedagogia (In-Place Mutation)
   */
  function renderGamePedagogyChart() {
    if (!window.chartInstances.gamePedagogy) {
      initGamePedagogyChart();
    }
    const chart = window.chartInstances.gamePedagogy;
    if (!chart || !state.metrics) return;

    const isEn = window.I18nManager && window.I18nManager.isEnglish();
    const p = state.metrics.gamePedagogy || { q7: 0, q8: 0, q9: 0, q10: 0, q11: 0, q12: 0 };

    chart.data.labels = isEn ? [
      "Q7. Explanation Clarity", "Q8. Difficulty Suitability", "Q9. Scenario Realism",
      "Q10. Calibration Usefulness", "Q11. Gamified Engagement", "Q12. Global Expectations"
    ] : [
      "Q7. Clareza das Explicações", "Q8. Adequação da Dificuldade", "Q9. Realismo dos Cenários",
      "Q10. Utilidade na Calibração", "Q11. Envolvimento Lúdico", "Q12. Expectativas Globais"
    ];
    if (chart.data.datasets[0]) {
      chart.data.datasets[0].label = isEn ? "Mean Rating (1 to 5)" : "Média (1 a 5)";
      chart.data.datasets[0].data = [p.q7, p.q8, p.q9, p.q10, p.q11, p.q12];
    }
    if (chart.options.scales?.x?.title) {
      chart.options.scales.x.title.text = isEn ? "Likert Scale (0 to 5)" : "Escala Likert (0 a 5)";
    }
    chart.update();
  }

  /**
   * Inicialização do Gráfico 3: Simulador RENOVATE Módulos (Q15 a Q23)
   */
  function initSimModulesChart() {
    const canvas = document.getElementById("chart-sim-modules");
    if (!canvas || !window.Chart) return;
    if (window.chartInstances.simModules) return;

    const ctx = canvas.getContext("2d");
    const isEn = window.I18nManager && window.I18nManager.isEnglish();
    const labels = isEn ? [
      "Q15. Navigation & Controls", "Q16. Tutorials & Menus", "Q17. Pedagogical Efficacy",
      "Q18. Decision Sequence", "Q19. Calculations & Formulas", "Q20. Nozzles & Spray Volume",
      "Q21. Selection & Label", "Q22. Field Variables", "Q23. Global Expectations"
    ] : [
      "Q15. Navegação e Controlos", "Q16. Tutoriais e Menus", "Q17. Eficácia Pedagógica",
      "Q18. Sequência de Decisão", "Q19. Cálculos e Fórmulas", "Q20. Bicos e Vol. de Calda",
      "Q21. Seleção e Rótulo", "Q22. Variáveis de Campo", "Q23. Expectativas Globais"
    ];

    window.chartInstances.simModules = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: isEn ? "Mean Score (1 to 5)" : "Média (1 a 5)",
          data: new Array(9).fill(0),
          backgroundColor: "#059669",
          borderColor: "#047857",
          borderWidth: 1.5,
          borderRadius: 6,
          maxBarThickness: 20
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#0F172A",
            titleFont: { size: 12, weight: "bold" },
            bodyFont: { size: 11 },
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: function(context) {
                const val = context.parsed.x;
                const isE = window.I18nManager && window.I18nManager.isEnglish();
                if (val === 0) return isE ? "Awaiting data" : "A aguardar dados";
                return `${context.dataset.label || "Média"}: ${val.toFixed(1)} / 5.0`;
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            min: 0,
            max: 5,
            ticks: {
              stepSize: 1,
              font: { size: 10, weight: "bold" },
              color: "#475569"
            },
            title: {
              display: true,
              text: isEn ? "Likert Scale (0 to 5)" : "Escala Likert (0 a 5)",
              font: { size: 11, weight: "bold" },
              color: "#334155"
            },
            grid: {
              color: "#F1F5F9"
            }
          },
          y: {
            ticks: {
              font: { size: 10, weight: "600" },
              color: "#0F172A"
            },
            grid: {
              display: false
            }
          }
        }
      }
    });
    state.charts.simModules = window.chartInstances.simModules;
  }

  /**
   * Renderização / Atualização do Gráfico 3: Simulador RENOVATE Módulos (In-Place Mutation)
   */
  function renderSimModulesChart() {
    if (!window.chartInstances.simModules) {
      initSimModulesChart();
    }
    const chart = window.chartInstances.simModules;
    if (!chart || !state.metrics) return;

    const isEn = window.I18nManager && window.I18nManager.isEnglish();
    const s = state.metrics.simModules || {
      q15: 0, q16: 0, q17: 0, q18: 0, q19: 0, q20: 0, q21: 0, q22: 0, q23: 0
    };

    chart.data.labels = isEn ? [
      "Q15. Navigation & Controls", "Q16. Tutorials & Menus", "Q17. Pedagogical Efficacy",
      "Q18. Decision Sequence", "Q19. Calculations & Formulas", "Q20. Nozzles & Spray Volume",
      "Q21. Selection & Label", "Q22. Field Variables", "Q23. Global Expectations"
    ] : [
      "Q15. Navegação e Controlos", "Q16. Tutoriais e Menus", "Q17. Eficácia Pedagógica",
      "Q18. Sequência de Decisão", "Q19. Cálculos e Fórmulas", "Q20. Bicos e Vol. de Calda",
      "Q21. Seleção e Rótulo", "Q22. Variáveis de Campo", "Q23. Expectativas Globais"
    ];
    if (chart.data.datasets[0]) {
      chart.data.datasets[0].label = isEn ? "Mean Score (1 to 5)" : "Média (1 a 5)";
      chart.data.datasets[0].data = [s.q15, s.q16, s.q17, s.q18, s.q19, s.q20, s.q21, s.q22, s.q23];
    }
    if (chart.options.scales?.x?.title) {
      chart.options.scales.x.title.text = isEn ? "Likert Scale (0 to 5)" : "Escala Likert (0 a 5)";
    }
    chart.update();
  }

  /**
   * Inicialização do Gráfico 4: Demografia - Perfis Profissionais (Q1)
   */
  function initDemoProfilesChart() {
    const canvas = document.getElementById("chart-demo-profiles");
    if (!canvas || !window.Chart) return;
    if (window.chartInstances.demoProfiles) return;

    const ctx = canvas.getContext("2d");
    const isEn = window.I18nManager && window.I18nManager.isEnglish();

    window.chartInstances.demoProfiles = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: [isEn ? "Awaiting responses" : "A aguardar respostas"],
        datasets: [{
          data: [1],
          backgroundColor: ["#E2E8F0"],
          borderWidth: 2,
          borderColor: "#FFFFFF"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: { font: { size: 9, weight: "bold" }, boxWidth: 10, padding: 6 }
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const totalProfiles = OFFICIAL_PROFILES.reduce((acc, p) => acc + (state.metrics?.demographics?.profiles?.[p] || 0), 0);
                const isZero = totalProfiles === 0;
                const isE = window.I18nManager && window.I18nManager.isEnglish();
                if (isZero) {
                  return isE ? " Awaiting responses: 0" : " A aguardar respostas: 0";
                }
                const val = context.raw || 0;
                const pct = Math.round((val / totalProfiles) * 100);
                return ` ${context.label}: ${val} (${pct}%)`;
              }
            }
          }
        }
      }
    });
    state.charts.demoProfiles = window.chartInstances.demoProfiles;
  }

  /**
   * Inicialização do Gráfico 5: Demografia - Culturas Agrícolas (Q5)
   */
  function initDemoCropsChart() {
    const canvas = document.getElementById("chart-demo-crops");
    if (!canvas || !window.Chart) return;
    if (window.chartInstances.demoCrops) return;

    const ctx = canvas.getContext("2d");
    const isEn = window.I18nManager && window.I18nManager.isEnglish();

    window.chartInstances.demoCrops = new Chart(ctx, {
      type: "bar",
      data: {
        labels: OFFICIAL_CROPS.map(c => isEn ? (CROP_TRANSLATIONS[c] || c) : c),
        datasets: [{
          label: isEn ? "Involved Participants" : "Participantes Envolvidos",
          data: new Array(OFFICIAL_CROPS.length).fill(0),
          backgroundColor: "#2563EB",
          borderColor: "#1D4ED8",
          borderWidth: 1.5,
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            beginAtZero: true,
            suggestedMax: 5,
            ticks: { stepSize: 1, precision: 0, font: { size: 10 } }
          },
          y: {
            ticks: { font: { size: 10, weight: "bold" }, color: "#0F172A" }
          }
        }
      }
    });
    state.charts.demoCrops = window.chartInstances.demoCrops;
  }

  /**
   * Renderização / Atualização dos Gráficos de Demografia (Perfis e Culturas - In-Place Mutation)
   */
  function renderDemographicsCharts() {
    if (!state.metrics?.demographics) return;
    const demo = state.metrics.demographics;
    const isEn = window.I18nManager && window.I18nManager.isEnglish();

    // 1. Gráfico de Perfis Profissionais (Q1 - Donut)
    if (!window.chartInstances.demoProfiles) {
      initDemoProfilesChart();
    }
    const chartProfiles = window.chartInstances.demoProfiles;
    if (chartProfiles) {
      const totalProfiles = OFFICIAL_PROFILES.reduce((acc, p) => acc + (demo.profiles[p] || 0), 0);
      const isZero = totalProfiles === 0;

      let pLabels, pData, pColors;
      if (isZero) {
        pLabels = [isEn ? "Awaiting responses" : "A aguardar respostas"];
        pData = [1];
        pColors = ["#E2E8F0"];
      } else {
        const activeEntries = OFFICIAL_PROFILES
          .map(p => {
            const count = demo.profiles[p] || 0;
            const pct = Math.round((count / totalProfiles) * 100);
            return {
              label: isEn ? (PROFILE_TRANSLATIONS[p] || p) : p,
              count,
              pct
            };
          })
          .filter(e => e.count > 0);

        pLabels = activeEntries.map(e => `${e.label} (${e.pct}%)`);
        pData = activeEntries.map(e => e.count);
        const palette = ["#F5B842", "#0F172A", "#059669", "#2563EB", "#D97706", "#8B5CF6", "#06B6D4", "#64748B"];
        pColors = activeEntries.map((_, i) => palette[i % palette.length]);
      }

      chartProfiles.data.labels = pLabels;
      if (chartProfiles.data.datasets[0]) {
        chartProfiles.data.datasets[0].data = pData;
        chartProfiles.data.datasets[0].backgroundColor = pColors;
      }
      chartProfiles.update();
    }

    // 2. Gráfico de Culturas Agrícolas (Q5 - Barras Horizontais)
    if (!window.chartInstances.demoCrops) {
      initDemoCropsChart();
    }
    const chartCrops = window.chartInstances.demoCrops;
    if (chartCrops) {
      const cEntries = OFFICIAL_CROPS.map(c => ({
        label: isEn ? (CROP_TRANSLATIONS[c] || c) : c,
        count: demo.crops[c] || 0
      })).sort((a, b) => b.count - a.count);

      chartCrops.data.labels = cEntries.map(e => e.label);
      if (chartCrops.data.datasets[0]) {
        chartCrops.data.datasets[0].label = isEn ? "Involved Participants" : "Participantes Envolvidos";
        chartCrops.data.datasets[0].data = cEntries.map(e => e.count);
      }
      chartCrops.update();
    }

    // Atualizar Média de Literacia Digital (Q6)
    const digitalEl = document.getElementById("demo-digital-comfort");
    const digitalLabelEl = document.getElementById("demo-digital-comfort-label");
    const hasComfort = demo.digitalComfortAvg !== null && demo.digitalComfortAvg !== undefined;

    if (digitalEl) {
      digitalEl.textContent = hasComfort ? `${parseFloat(demo.digitalComfortAvg).toFixed(1)} / 5.0` : "— / 5.0";
    }
    if (digitalLabelEl) {
      digitalLabelEl.textContent = hasComfort
        ? getComfortLevelLabel(demo.digitalComfortAvg, isEn)
        : (isEn ? "Awaiting responses" : "A aguardar respostas");
    }
    renderDigitalScale(hasComfort ? Math.round(parseFloat(demo.digitalComfortAvg)) : null);
  }

  /**
   * Inicialização do Gráfico 6: Recomendação RENOVATE Gauge / Donut (Q29)
   */
  function initNpsGaugeChart() {
    const canvas = document.getElementById("chart-nps-gauge");
    if (!canvas || !window.Chart) return;
    if (window.chartInstances.npsGauge) return;

    const ctx = canvas.getContext("2d");
    const isEn = window.I18nManager && window.I18nManager.isEnglish();

    window.chartInstances.npsGauge = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: [isEn ? "Awaiting responses" : "A aguardar respostas"],
        datasets: [{
          data: [1],
          backgroundColor: ["#E2E8F0"],
          borderWidth: 2,
          borderColor: "#FFFFFF"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "68%",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (context) {
                const n = state.metrics?.nps;
                const isZero = !n || !n.total || n.total === 0;
                const isE = window.I18nManager && window.I18nManager.isEnglish();
                if (isZero) {
                  return isE ? " Awaiting responses: 0" : " A aguardar respostas: 0";
                }
                const val = context.raw || 0;
                const total = n.total || 1;
                const pct = Math.round((val / total) * 100);
                return ` ${context.label}: ${val} (${pct}%)`;
              }
            }
          }
        }
      }
    });
    state.charts.npsGauge = window.chartInstances.npsGauge;
  }

  /**
   * Renderização / Atualização do Gráfico 6: Recomendação RENOVATE (In-Place Mutation)
   */
  function renderNpsChart() {
    if (!window.chartInstances.npsGauge) {
      initNpsGaugeChart();
    }
    const chart = window.chartInstances.npsGauge;
    if (!chart || !state.metrics?.nps) return;

    const isEn = window.I18nManager && window.I18nManager.isEnglish();
    const n = state.metrics.nps;
    const isZero = !n.total || n.total === 0;

    let labels, data, colors;
    if (isZero) {
      labels = [isEn ? "Awaiting responses" : "A aguardar respostas"];
      data = [1];
      colors = ["#E2E8F0"];
    } else {
      const order = [1, 2, 3, 4, 5];
      const labelMap = isEn ? Q29_LABELS_EN : Q29_LABELS_PT;
      labels = order.map(k => labelMap[k]);
      data = order.map(k => n.counts[k] || 0);
      colors = order.map(k => Q29_COLORS[k]);
    }

    chart.data.labels = labels;
    if (chart.data.datasets[0]) {
      chart.data.datasets[0].data = data;
      chart.data.datasets[0].backgroundColor = colors;
    }
    chart.update();

    const npsScoreEl = document.getElementById("nps-center-score");
    if (npsScoreEl) {
      npsScoreEl.textContent = isZero
        ? "— / 5.0 (0%)"
        : `${n.average.toFixed(1)} / 5.0 (${n.percent}%)`;
    }

    const npsZoneEl = document.getElementById("nps-zone-label");
    if (npsZoneEl) {
      npsZoneEl.textContent = isZero
        ? (isEn ? "(Awaiting responses)" : "(A aguardar respostas)")
        : getQ29DynamicZoneLabel(n.average, isEn);
    }
  }

  /**
   * Inicializa todos os gráficos em window.chartInstances com datasets vazios no DOMContentLoaded
   */
  function initAllCharts() {
    initSusComparisonChart();
    initGamePedagogyChart();
    initSimModulesChart();
    initDemoProfilesChart();
    initDemoCropsChart();
    initNpsGaugeChart();
  }

  /**
   * Renderização do Feedback Qualitativo dos Participantes (Voz dos Participantes: Q25, Q26-Q28, Q30)
   */
  function renderQualitativeFeedback() {
    const feedContainer = document.getElementById("feedback-feed-container");
    const containerSim = document.getElementById("feedback-sim-container");
    const containerFinal = document.getElementById("feedback-final-container");
    if (!state.metrics?.qualitativeFeedback) return;

    const isEn = window.I18nManager && window.I18nManager.isEnglish();
    const feed = state.metrics.qualitativeFeedback.feed || [];

    const noSuggestionsText = isEn ? "No suggestions recorded yet." : "Sem sugestões registadas de momento.";

    if (feedContainer) {
      if (!feed.length) {
        feedContainer.innerHTML = `
          <div class="col-span-full py-12 flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
            <i data-lucide="message-square-dashed" class="w-8 h-8 text-slate-300"></i>
            <p class="text-xs italic">${noSuggestionsText}</p>
          </div>
        `;
      } else {
        feedContainer.innerHTML = feed.map(item => {
          let tagClass = "bg-slate-100 text-slate-800 border-slate-200";
          let tagIcon = "message-square";
          let quoteBorder = "border-slate-300";

          if (item.tagType === "sim") {
            tagClass = "bg-amber-100 text-amber-900 border-amber-200";
            tagIcon = "gamepad-2";
            quoteBorder = "border-amber-400";
          } else if (item.tagType === "global") {
            tagClass = "bg-blue-100 text-blue-900 border-blue-200";
            tagIcon = "globe";
            quoteBorder = "border-blue-400";
          } else if (item.tagType === "issue") {
            tagClass = "bg-rose-100 text-rose-900 border-rose-200";
            tagIcon = "alert-circle";
            quoteBorder = "border-rose-400";
          }

          const tagLabel = isEn ? (item.tagEN || item.tagPT) : item.tagPT;

          return `
            <div class="p-3 bg-slate-50/70 hover:bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-2xs transition-all space-y-2 flex flex-col justify-between">
              <div class="flex items-center justify-between gap-2">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${tagClass}">
                  <i data-lucide="${tagIcon}" class="w-3 h-3"></i>
                  <span>[${tagLabel}]</span>
                </span>
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white text-slate-700 border border-slate-200 shadow-2xs">
                  <i data-lucide="user" class="w-3 h-3 text-slate-400"></i>
                  <span>${item.code}</span>
                </span>
              </div>
              <p class="text-xs text-slate-800 leading-relaxed font-normal italic pl-2.5 border-l-2 ${quoteBorder}">
                “${item.text}”
              </p>
            </div>
          `;
        }).join("");
      }
    }

    // Preservar compatibilidade caso os contentores antigos ainda existam no DOM
    if (containerSim) {
      const simSuggestions = state.metrics.qualitativeFeedback.simSuggestions || [];
      if (!simSuggestions.length) {
        containerSim.innerHTML = `<p class="text-xs text-slate-500 italic p-3">${noSuggestionsText}</p>`;
      } else {
        containerSim.innerHTML = simSuggestions.slice(0, 6).map(item => `
          <div class="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5 hover:border-slate-300 transition-all">
            <div class="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px] font-bold border border-slate-200 shadow-2xs">
                <i data-lucide="user" class="w-3.5 h-3.5 text-slate-500 shrink-0"></i>
                <span>${item.code}</span>
              </span>
              <span class="text-amber-800 font-semibold flex items-center gap-1"><i data-lucide="gamepad-2" class="w-3 h-3"></i> [${isEn ? "Simulator" : "Simulador"}]</span>
            </div>
            <p class="text-xs text-slate-800 leading-relaxed font-medium italic">“${item.text}”</p>
          </div>
        `).join("");
      }
    }

    if (containerFinal) {
      const finalSuggestions = state.metrics.qualitativeFeedback.finalSuggestions || [];
      if (!finalSuggestions.length) {
        containerFinal.innerHTML = `<p class="text-xs text-slate-500 italic p-3">${noSuggestionsText}</p>`;
      } else {
        containerFinal.innerHTML = finalSuggestions.slice(0, 6).map(item => `
          <div class="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5 hover:border-slate-300 transition-all">
            <div class="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 font-mono text-[11px] font-bold border border-rose-200 shadow-2xs">
                <i data-lucide="user" class="w-3.5 h-3.5 text-rose-600 shrink-0"></i>
                <span>${item.code}</span>
              </span>
              <span class="text-rose-800 font-semibold flex items-center gap-1"><i data-lucide="alert-circle" class="w-3 h-3"></i> [${isEn ? "Bug / Suggestion" : "Erro / Sugestão"}]</span>
            </div>
            <p class="text-xs text-slate-800 leading-relaxed font-medium italic">“${item.text}”</p>
          </div>
        `).join("");
      }
    }

    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  /**
   * Redimensiona e atualiza os gráficos quando a aba Resultados se torna visível
   */
  function resizeAllCharts() {
    Object.values(state.charts).forEach(c => {
      if (c && typeof c.resize === "function") {
        try { c.resize(); } catch (e) {}
      }
    });
    renderWordCloud();
  }

  /**
   * Gancho chamado quando o router do SPA ativa a tab Resultados
   */
  function onTabShown() {
    setTimeout(() => {
      resizeAllCharts();
      renderWordCloud();
    }, 150);
  }

  /**
   * Notificação Toast flutuante
   */
  function showToast(message, type = "info") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    const colors = type === "success" 
      ? "bg-emerald-900 text-white border-emerald-700" 
      : "bg-slate-900 text-white border-slate-700";

    toast.className = `toast pointer-events-auto px-4 py-2.5 rounded-xl border shadow-xl text-xs font-semibold flex items-center gap-2 transform transition-all duration-300 translate-y-4 opacity-0 ${colors}`;
    toast.innerHTML = `
      <span>${message}</span>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove("translate-y-4", "opacity-0");
    });

    setTimeout(() => {
      toast.classList.add("translate-y-4", "opacity-0");
      setTimeout(() => toast.remove(), 350);
    }, 4000);
  }

  // API pública do módulo
  return {
    init,
    initAllCharts,
    setLiveParticipantCount,
    fetchData,
    onTabShown,
    resizeAllCharts,
    setSectionFilter,
    renderKpiCards
  };
})();

// Inicialização preventiva dos gráficos com data: [] no DOMContentLoaded
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      if (window.ResultsDashboard && typeof window.ResultsDashboard.initAllCharts === "function") {
        window.ResultsDashboard.initAllCharts();
      }
    });
  } else {
    setTimeout(() => {
      if (window.ResultsDashboard && typeof window.ResultsDashboard.initAllCharts === "function") {
        window.ResultsDashboard.initAllCharts();
      }
    }, 0);
  }
}
