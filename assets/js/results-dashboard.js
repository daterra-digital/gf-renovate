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
    return !code.endsWith("-MD") && VALID_PARTICIPANT_CODE.test(code);
  }

  function round1(x) {
    return Math.round(x * 10) / 10;
  }

  function isCodeHeader(h) {
    return /c[oó]digo|participant code/i.test(String(h || ""));
  }

  function isTimestampHeader(h, idx) {
    return idx === 0 || /carimbo|timestamp|data\/hora/i.test(String(h || ""));
  }

  /**
   * Aplica a Regra Global de Filtragem a um separador (cabeçalho + linhas):
   * - mantém apenas linhas cujo código é FG2-PT01..FG2-PT50 (exclui -MD e códigos inválidos);
   * - se o mesmo código submeter mais do que uma vez, conta apenas a submissão mais recente.
   * @returns {{headers: string[], data: string[][], codes: Set<string>}}
   */
  function filterValidParticipantRows(rows) {
    const headers = (rows && rows[0]) || [];
    const codeCols = [];
    headers.forEach((h, i) => { if (isCodeHeader(h)) codeCols.push(i); });
    if (!codeCols.length && headers.length > 1) codeCols.push(1);

    const latestByCode = new Map();
    (rows || []).slice(1).forEach(row => {
      let code = "";
      for (const ci of codeCols) {
        const c = normalizeParticipantCode(row[ci]);
        if (c) { code = c; break; }
      }
      if (!isValidParticipantCode(code)) return;
      row._participantCode = code;
      latestByCode.delete(code); // reinserir para preservar a ordem cronológica
      latestByCode.set(code, row);
    });

    return {
      headers,
      data: Array.from(latestByCode.values()),
      codes: new Set(latestByCode.keys())
    };
  }

  /**
   * Agrupa as colunas de um separador em "unidades de resposta":
   * - cada questão numerada (Qn) conta como 1 unidade, mesmo quando tem várias sub-colunas (ex.: Q13/Q24 SUS);
   * - cada questão "3 palavras" (Word Cloud) conta como 1 unidade;
   * - carimbo de data/hora e código de participante são ignorados.
   */
  function getAnswerUnits(headers) {
    const units = new Map();
    (headers || []).forEach((h, i) => {
      if (isTimestampHeader(h, i) || isCodeHeader(h)) return;
      const label = String(h || "");
      const q = label.match(/^\s*Q(\d+)\s*[.):\-]/i);
      let key = null;
      if (q) key = `Q${parseInt(q[1], 10)}`;
      else if (/3 palavras|three words|3 words/i.test(label)) key = `WC${i}`;
      if (!key) return;
      if (!units.has(key)) units.set(key, []);
      units.get(key).push(i);
    });
    return Array.from(units.values());
  }

  /**
   * Conta as respostas válidas (unidades de resposta preenchidas) de um separador já filtrado
   */
  function countAnsweredUnits(tab) {
    const units = getAnswerUnits(tab.headers);
    let total = 0;
    tab.data.forEach(row => {
      units.forEach(cols => {
        if (cols.some(ci => row[ci] !== undefined && String(row[ci]).trim() !== "")) total++;
      });
    });
    return total;
  }

  /**
   * Leitura estrita de uma resposta Likert 1–5 (devolve null se vazia/inválida)
   */
  function parseLikertStrict(val) {
    if (val === null || val === undefined) return null;
    const s = String(val).trim().toLowerCase();
    if (!s) return null;
    const m = s.match(/^([1-5])(?![0-9])/);
    if (m) return parseInt(m[1], 10);
    if (s.includes("nem concordo") || s.includes("neutro") || s.includes("indiferente") || s.includes("neither")) return 3;
    if (s.includes("discordo totalmente") || s.includes("discordo fortemente") || s.includes("strongly disagree")) return 1;
    if (s.includes("concordo totalmente") || s.includes("concordo fortemente") || s.includes("strongly agree")) return 5;
    if (s.includes("discordo") || s.includes("disagree")) return 2;
    if (s.includes("concordo") || s.includes("agree")) return 4;
    return null;
  }

  /**
   * Leitura estrita da Q29 (escala 1–5). Aceita o valor numérico ou o rótulo da escala.
   */
  function parseQ29Strict(val) {
    if (val === null || val === undefined) return null;
    const s = String(val).trim().toLowerCase();
    if (!s) return null;
    const m = s.match(/^([1-5])(?![0-9])/);
    if (m) return parseInt(m[1], 10);
    if (s.includes("extremamente") || s.includes("extremely")) return 5;
    if (s.includes("nada") || s.includes("not likely")) return 1;
    if (s.includes("pouco") || s.includes("unlikely")) return 2;
    if (s.includes("moderad") || s.includes("moderavel") || s.includes("moderately")) return 3;
    if (s.includes("muito") || s.includes("very")) return 4;
    return null;
  }

  /**
   * System Usability Scale (Brooke, 1996) sobre as 10 sub-declarações de uma questão (Q13 ou Q24):
   * ímpares (1,3,5,7,9): resposta − 1 | pares (2,4,6,8,10): 5 − resposta
   * Score do participante = soma × 2.5 | Resultado = média aritmética dos participantes válidos.
   * Participantes com alguma das 10 sub-declarações por responder não entram na média.
   */
  function computeSusKpi(tab, questionNumber) {
    const re = new RegExp(`^\\s*Q${questionNumber}\\s*[.):\\-]`, "i");
    const cols = [];
    tab.headers.forEach((h, i) => { if (re.test(String(h || ""))) cols.push(i); });
    if (cols.length < 10) return { average: null, n: 0, itemsAvg: new Array(10).fill(0) };

    const itemCols = cols.slice(0, 10); // ordem das colunas = ordem oficial dos itens SUS
    let sum = 0;
    let n = 0;
    const itemSums = new Array(10).fill(0);
    const itemCounts = new Array(10).fill(0);

    tab.data.forEach(row => {
      // Acumular coluna a coluna para as 10 dimensões individuais do gráfico
      itemCols.forEach((ci, idx) => {
        const v = parseLikertStrict(row[ci]);
        if (v !== null) {
          itemSums[idx] += v;
          itemCounts[idx]++;
        }
      });

      const vals = itemCols.map(ci => parseLikertStrict(row[ci]));
      if (vals.some(v => v === null)) return;
      let raw = 0;
      vals.forEach((v, idx) => {
        raw += (idx % 2 === 0) ? (v - 1) : (5 - v); // idx 0 = sub-questão 1 (ímpar)
      });
      sum += raw * 2.5;
      n++;
    });

    // Transformação para escala positiva 1 a 5:
    // Ímpares (1, 3, 5, 7, 9): Média Bruta
    // Pares (2, 4, 6, 8, 10): 6 - Média Bruta
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
    let idx = findColIndex(tab.headers, /^\s*Q29\s*[.):\-]/i);
    if (idx === -1) idx = findColIndex(tab.headers, /Q29/i);
    if (idx === -1) return { average: null, n: 0 };
    let sum = 0;
    let n = 0;
    tab.data.forEach(row => {
      const v = parseQ29Strict(row[idx]);
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
    const submissionCodes = new Set([...game.codes, ...sim.codes, ...global.codes]);
    return {
      submissionCodes,
      answeredUnits: countAnsweredUnits(game) + countAnsweredUnits(sim) + countAnsweredUnits(global),
      susGame: computeSusKpi(game, 13),
      susSim: computeSusKpi(sim, 24),
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
    const isEn = window.I18nManager && window.I18nManager.isEnglish();
    const setText = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };

    let k = state.kpis;
    let participantCount;

    if (k) {
      // N = participantes válidos com sessão ativa (inclui quem já submeteu respostas)
      const codes = getActiveSessionCodes();
      k.submissionCodes.forEach(c => codes.add(c));
      participantCount = codes.size;
    } else {
      // Sem dados ou a aguardar conexão: estado estritamente a zeros
      const codes = getActiveSessionCodes();
      participantCount = codes.size;
      k = {
        answeredUnits: 0,
        susGame: { average: null },
        susSim: { average: null },
        q29: { average: null }
      };
    }

    // 1. AMOSTRA TOTAL
    setText("kpi-responses-count", participantCount);
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

  // Configuração Oficial e Permanente das Folhas Google Sheets (Focus Group 2)
  const OFFICIAL_SHEET_CONFIG = {
    spreadsheetId: "2PACX-1vQKvZtpO0WW7vqeOMvJpmFbDoh8K2F0h0SSI5t3S1LiI7Ag1nQpGJi3CkDkeGxrULkk4UxSLjrhTd1e",
    tabGids: {
      game: "1971530026",  // Questionário 1: Serious Game (Tallentto) + Demografia
      sim: "1882859537",    // Questionário 2: Simulador 3D (Virmedex)
      global: "914346842"   // Questionário 3: Avaliação Global (NPS + Síntese)
    },
    autoRefreshSeconds: 10
  };

  // Estado interno
  let state = {
    config: Object.assign({}, OFFICIAL_SHEET_CONFIG),
    isLive: false,
    isLoading: false,
    lastUpdated: null,
    activeTabFilter: "all",
    activeWordCloudTool: "game", // "game" ou "sim"
    metrics: getZeroMetrics(),
    kpis: null, // dados reais (filtrados) dos 4 cartões de resumo
    charts: {},
    refreshTimer: null
  };

  /**
   * Inicialização do Módulo de Resultados
   */
  function init() {
    loadConfig();
    bindEvents();
    renderAllDashboardMetrics();
    fetchData();
  }

  /**
   * Carrega a configuração oficial dos Google Sheets
   */
  function loadConfig() {
    state.config = Object.assign({}, OFFICIAL_SHEET_CONFIG);

    // Se houver personalização válida no localStorage com ID não-vazio
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.spreadsheetId && parsed.spreadsheetId.trim()) {
          state.config = Object.assign({}, state.config, parsed);
        }
      } catch (e) {
        console.warn("Aviso ao carregar configuração guardada do Google Sheets:", e);
      }
    }
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
        fetchData(true);
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
    if (btnWcGame && btnWcSim) {
      btnWcGame.addEventListener("click", () => {
        state.activeWordCloudTool = "game";
        btnWcGame.classList.add("bg-[#F5B842]", "text-[#0F172A]", "font-bold");
        btnWcGame.classList.remove("bg-slate-100", "text-slate-600");
        btnWcSim.classList.remove("bg-[#F5B842]", "text-[#0F172A]", "font-bold");
        btnWcSim.classList.add("bg-slate-100", "text-slate-600");
        renderWordCloud();
      });

      btnWcSim.addEventListener("click", () => {
        state.activeWordCloudTool = "sim";
        btnWcSim.classList.add("bg-[#F5B842]", "text-[#0F172A]", "font-bold");
        btnWcSim.classList.remove("bg-slate-100", "text-slate-600");
        btnWcGame.classList.remove("bg-[#F5B842]", "text-[#0F172A]", "font-bold");
        btnWcGame.classList.add("bg-slate-100", "text-slate-600");
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
   * Descarrega dados da Google Sheet ou recorre ao conjunto de demonstração
   */
  async function fetchData(isManualRefresh = false) {
    if (state.isLoading) return;
    state.isLoading = true;
    updateRefreshButtonState(true);

    const sheetId = state.config.spreadsheetId ? state.config.spreadsheetId.trim() : "";

    // Se não tiver ID definido, manter o estado a zeros (sem dados de demonstração)
    if (!sheetId) {
      state.metrics = getZeroMetrics();
      state.kpis = null;
      state.isLive = false;
      state.isWaitingAnswers = true;
      finishFetch(isManualRefresh, false);
      return;
    }

    try {
      const gids = state.config.tabGids;
      const bust = `&_t=${Date.now()}`; // evita respostas em cache do "Publicar na Web"
      const gameUrl = buildTabUrl(sheetId, gids.game, "0") + bust;
      const simUrl = gids.sim ? buildTabUrl(sheetId, gids.sim) + bust : null;
      const globalUrl = gids.global ? buildTabUrl(sheetId, gids.global) + bust : null;
      const noStore = { cache: "no-store" };

      const [gameRes, simRes, globalRes] = await Promise.all([
        fetch(gameUrl, noStore),
        simUrl ? fetch(simUrl, noStore).catch(() => null) : Promise.resolve(null),
        globalUrl ? fetch(globalUrl, noStore).catch(() => null) : Promise.resolve(null)
      ]);

      if (!gameRes || !gameRes.ok) {
        throw new Error(`Erro ao aceder ao Separador 1 (${gameRes ? gameRes.status : "rede"})`);
      }

      const gameCsv = await gameRes.text();
      const simCsv = simRes && simRes.ok ? await simRes.text() : "";
      const globalCsv = globalRes && globalRes.ok ? await globalRes.text() : "";

      // Regra Global de Filtragem: apenas códigos FG2-PT01..FG2-PT50 (exclui sufixo -MD do moderador)
      const game = filterValidParticipantRows(parseCSV(gameCsv));
      const sim = filterValidParticipantRows(simCsv ? parseCSV(simCsv) : []);
      const global = filterValidParticipantRows(globalCsv ? parseCSV(globalCsv) : []);

      // Dados dos 4 cartões de resumo calculados sempre a partir dos dados reais filtrados
      state.kpis = computeKpis(game, sim, global);

      const hasValidAnswers = game.data.length + sim.data.length + global.data.length > 0;
      if (!hasValidAnswers) {
        state.metrics = getZeroMetrics();
        state.isLive = true;
        state.isWaitingAnswers = true;
      } else {
        processRealData(
          [game.headers, ...game.data],
          [sim.headers, ...sim.data],
          [global.headers, ...global.data]
        );
        state.isLive = true;
        state.isWaitingAnswers = false;
      }

      finishFetch(isManualRefresh, true);
    } catch (err) {
      console.warn("⚠️ Não foi possível obter dados em tempo real do Google Sheets. A manter painel a zeros.", err);
      state.metrics = getZeroMetrics();
      state.isLive = false;
      state.isWaitingAnswers = false;
      finishFetch(isManualRefresh, false, err.message);
    }
  }

  /**
   * Finaliza o ciclo de busca atualizando a UI e os temporizadores
   */
  function finishFetch(isManual, success, errorMsg = null) {
    state.isLoading = false;
    updateRefreshButtonState(false);
    updateConnectionBadge();
    renderAllDashboardMetrics();

    if (isManual) {
      const isEn = window.I18nManager && window.I18nManager.isEnglish();
      const msg = state.isLive && state.isWaitingAnswers
        ? (isEn ? "Google Sheets connected! Awaiting participant responses." : "Google Sheets conectado aos 3 separadores! A aguardar primeiras respostas dos participantes.")
        : state.isLive
        ? (isEn ? `Results synced in real-time (${state.kpis ? state.kpis.submissionCodes.size : 0} participants with responses)` : `Resultados sincronizados em tempo real (${state.kpis ? state.kpis.submissionCodes.size : 0} participantes com respostas)`)
        : (isEn ? "Google Sheets connection pending. Dashboard at zeros." : "Sincronização pendente. Painel a zeros.");
      showToast(msg, state.isLive ? "success" : "info");
    }

    // Agendar próximo auto-refresh a cada 10 segundos
    if (state.refreshTimer) clearTimeout(state.refreshTimer);
    if (state.config.spreadsheetId && state.config.autoRefreshSeconds > 0) {
      state.refreshTimer = setTimeout(() => {
        fetchData(false);
      }, state.config.autoRefreshSeconds * 1000);
    }
  }

  /**
   * Atualiza o estado visual do botão de atualização
   */
  function updateRefreshButtonState(loading) {
    const btn = document.getElementById("btn-refresh-results");
    const icon = document.getElementById("icon-refresh-results");
    if (!btn || !icon) return;

    if (loading) {
      btn.disabled = true;
      btn.classList.add("opacity-75");
      icon.classList.add("animate-spin");
    } else {
      btn.disabled = false;
      btn.classList.remove("opacity-75");
      icon.classList.remove("animate-spin");
    }
  }

  /**
   * Atualiza o badge de estado de ligação
   */
  function updateConnectionBadge() {
    const badge = document.getElementById("results-live-status-badge");
    const timeEl = document.getElementById("results-last-sync-time");
    if (!badge) return;

    const isEn = window.I18nManager && window.I18nManager.isEnglish();
    const now = new Date();
    const timeStr = now.toLocaleTimeString(isEn ? "en-GB" : "pt-PT", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    state.lastUpdated = timeStr;

    if (timeEl) {
      timeEl.textContent = isEn ? `Last sync: ${timeStr}` : `Última sincronização: ${timeStr}`;
    }

    if (state.isLive && state.isWaitingAnswers) {
      badge.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs";
      badge.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>${isEn ? "Google Sheets Connected (Awaiting Responses)" : "Google Sheets Conectado (Aguardando Respostas)"}</span>
      `;
    } else if (state.isLive) {
      badge.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs";
      badge.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>${isEn ? "Google Sheets Connected (Real-Time)" : "Google Sheets Conectado (Em Tempo Real)"}</span>
      `;
    } else {
      badge.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300 shadow-2xs";
      badge.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-slate-400"></span>
        <span>${isEn ? "Sync Pending (Awaiting Data)" : "Sincronização Pendente (Aguardando Dados)"}</span>
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
   * Extrai a média Likert (1 a 5) de uma coluna ignorando valores vazios ou inválidos (0 se sem dados)
   */
  function extractLikertAverage(rows, colIdx) {
    if (colIdx === -1 || !rows || !rows.length) return 0;
    const vals = rows
      .map(r => parseLikertStrict(r[colIdx]))
      .filter(v => v !== null);
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
  function extractConvertedQ8Average(rows, colIdx) {
    if (colIdx === -1 || !rows || !rows.length) return 0;
    const vals = rows
      .map(r => parseLikertStrict(r[colIdx]))
      .filter(v => v !== null);
    if (!vals.length) return 0;
    const converted = vals.map(v => 5 - (Math.abs(v - 3) * 2));
    const sum = converted.reduce((a, b) => a + b, 0);
    return parseFloat((sum / converted.length).toFixed(1));
  }

  /**
   * Processa os dados reais lidos via CSV das 3 abas
   */
  function processRealData(gameRows, simRows, globalRows) {
    const gameHeaders = gameRows[0] || [];
    const gameData = gameRows.slice(1);

    const simHeaders = simRows[0] || [];
    const simData = simRows.slice(1);

    const globalHeaders = globalRows[0] || [];
    const globalData = globalRows.slice(1);

    // Mapear índices de colunas do Separador 1 (Game + Demografia)
    const idxProfile = findColIndex(gameHeaders, /^\s*Q1\b|perfil|profissão|profissao/i);
    const idxAge = findColIndex(gameHeaders, /^\s*Q2\b|idade/i);
    const idxGender = findColIndex(gameHeaders, /^\s*Q3\b|género|genero|sexo/i);
    const idxCrops = findColIndex(gameHeaders, /^\s*Q5\b|cultura/i);
    const idxComfort = findColIndex(gameHeaders, /^\s*Q6\b|confortável|confortavel|digital/i);
    const idxQ7 = findColIndex(gameHeaders, /^\s*Q7\b/i);
    const idxQ8 = findColIndex(gameHeaders, /^\s*Q8\b/i);
    const idxQ9 = findColIndex(gameHeaders, /^\s*Q9\b/i);
    const idxQ10 = findColIndex(gameHeaders, /^\s*Q10\b/i);
    const idxQ11 = findColIndex(gameHeaders, /^\s*Q11\b/i);
    const idxQ12 = findColIndex(gameHeaders, /^\s*Q12\b/i);
    const idxWordsGame = findColIndex(gameHeaders, /3 palavras|palavras/i);

    // Encontrar os 10 itens SUS do Game (Q13)
    const reQ13 = /^\s*Q13\s*[.):\-]/i;
    const susGameColIndices = [];
    gameHeaders.forEach((h, i) => {
      if (reQ13.test(String(h || "")) || (h.includes("SUS") && h.includes("Game"))) {
        susGameColIndices.push(i);
      }
    });

    // Mapear índices de colunas do Separador 2 (Simulador)
    const idxQ15 = findColIndex(simHeaders, /^\s*Q15\b/i);
    const idxQ16 = findColIndex(simHeaders, /^\s*Q16\b/i);
    const idxQ17 = findColIndex(simHeaders, /^\s*Q17\b/i);
    const idxQ18 = findColIndex(simHeaders, /^\s*Q18\b/i);
    const idxQ19 = findColIndex(simHeaders, /^\s*Q19\b/i);
    const idxQ20 = findColIndex(simHeaders, /^\s*Q20\b/i);
    const idxQ21 = findColIndex(simHeaders, /^\s*Q21\b/i);
    const idxQ22 = findColIndex(simHeaders, /^\s*Q22\b/i);
    const idxQ23 = findColIndex(simHeaders, /^\s*Q23\b/i);
    const idxQ25_sim = findColIndex(simHeaders, /^\s*Q25\b|confuso|falta/i);
    const idxQ26_sim = findColIndex(simHeaders, /^\s*Q26\b/i);
    const idxQ27_sim = findColIndex(simHeaders, /^\s*Q27\b/i);
    const idxQ28_sim = findColIndex(simHeaders, /^\s*Q28\b/i);
    const idxQ30_sim = findColIndex(simHeaders, /^\s*Q30\b|erros|falhas|melhorias/i);
    const idxWordsSim = findColIndex(simHeaders, /3 palavras|palavras/i);

    const reQ24 = /^\s*Q24\s*[.):\-]/i;
    const susSimColIndices = [];
    simHeaders.forEach((h, i) => {
      if (reQ24.test(String(h || "")) || (h.includes("SUS") && h.includes("Simulador"))) {
        susSimColIndices.push(i);
      }
    });

    // Mapear índices de colunas do Separador 3 (Global)
    const idxQ25_global = findColIndex(globalHeaders, /^\s*Q25\b|confuso|falta/i);
    const idxQ26_global = findColIndex(globalHeaders, /^\s*Q26\b/i);
    const idxQ27_global = findColIndex(globalHeaders, /^\s*Q27\b/i);
    const idxQ28_global = findColIndex(globalHeaders, /^\s*Q28\b/i);
    let idxQ29_global = findColIndex(globalHeaders, /^\s*Q29\s*[.):\-]/i);
    if (idxQ29_global === -1) idxQ29_global = findColIndex(globalHeaders, /Q29/i);
    const idxQ30_global = findColIndex(globalHeaders, /^\s*Q30\b|erros|falhas|melhorias/i);
    const idxGlobalCode = findColIndex(globalHeaders, /código|codigo|participante/i);

    const idxQ25 = idxQ25_sim !== -1 ? idxQ25_sim : idxQ25_global;
    const idxQ26 = idxQ26_global !== -1 ? idxQ26_global : idxQ26_sim;
    const idxQ27 = idxQ27_global !== -1 ? idxQ27_global : idxQ27_sim;
    const idxQ28 = idxQ28_global !== -1 ? idxQ28_global : idxQ28_sim;
    const idxQ29 = idxQ29_global;
    const idxQ30 = idxQ30_global !== -1 ? idxQ30_global : idxQ30_sim;

    // Processamento SUS do Serious Game (apenas participantes válidos com os 10 itens completos)
    const gameSusArrays = [];
    if (susGameColIndices.length >= 10) {
      const itemCols = susGameColIndices.slice(0, 10);
      gameData.forEach(row => {
        const vals = itemCols.map(ci => parseLikertStrict(row[ci]));
        if (vals.every(v => v !== null)) {
          gameSusArrays.push(vals);
        }
      });
    }
    const susGame = calculateSusFromResponses(gameSusArrays);

    // Processamento SUS do Simulador (apenas participantes válidos com os 10 itens completos)
    const simSusArrays = [];
    if (susSimColIndices.length >= 10) {
      const itemCols = susSimColIndices.slice(0, 10);
      simData.forEach(row => {
        const vals = itemCols.map(ci => parseLikertStrict(row[ci]));
        if (vals.every(v => v !== null)) {
          simSusArrays.push(vals);
        }
      });
    }
    const susSim = calculateSusFromResponses(simSusArrays);

    // Processamento Q29 Recomendação do Questionário Global
    const q29Responses = [];
    if (idxQ29 !== -1) {
      globalData.forEach(row => {
        if (row[idxQ29] && String(row[idxQ29]).trim()) {
          q29Responses.push(row[idxQ29]);
        }
      });
    }
    const nps = calculateQ29Recommendation(q29Responses);

    // Nuvens de Palavras
    const rawWordsGame = gameData.map(r => idxWordsGame !== -1 ? r[idxWordsGame] : "").filter(Boolean);
    const rawWordsSim = simData.map(r => idxWordsSim !== -1 ? r[idxWordsSim] : "").filter(Boolean);
    const wordsGame = extractWordFrequencies(rawWordsGame);
    const wordsSim = extractWordFrequencies(rawWordsSim);

    // Demografia: inicializar todos os 8 perfis e 6 culturas a zero
    const profiles = {};
    OFFICIAL_PROFILES.forEach(p => { profiles[p] = 0; });
    const crops = {};
    OFFICIAL_CROPS.forEach(c => { crops[c] = 0; });
    const ages = {};
    let digitalTotal = 0;
    let digitalCount = 0;

    gameData.forEach(row => {
      // Q1 Perfil Profissional
      if (idxProfile !== -1 && row[idxProfile] && String(row[idxProfile]).trim()) {
        const p = normalizeProfile(row[idxProfile]);
        profiles[p] = (profiles[p] || 0) + 1;
      }

      // Idade (Q2)
      if (idxAge !== -1 && row[idxAge] && String(row[idxAge]).trim()) {
        const a = row[idxAge].trim();
        ages[a] = (ages[a] || 0) + 1;
      }

      // Q6 Literacia Digital
      if (idxComfort !== -1 && row[idxComfort] && String(row[idxComfort]).trim()) {
        const c = parseDigitalComfort(row[idxComfort]);
        if (c !== null) {
          digitalTotal += c;
          digitalCount++;
        }
      }

      // Q5 Culturas Acompanhadas (múltipla escolha separada por vírgula)
      if (idxCrops !== -1 && row[idxCrops] && String(row[idxCrops]).trim()) {
        const cropItems = String(row[idxCrops]).split(/[,;]/);
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

    // Médias Pedagógicas Game (0 se sem respostas)
    const gamePedagogy = {
      q7: extractLikertAverage(gameData, idxQ7),
      q8: extractConvertedQ8Average(gameData, idxQ8),
      q9: extractLikertAverage(gameData, idxQ9),
      q10: extractLikertAverage(gameData, idxQ10),
      q11: extractLikertAverage(gameData, idxQ11),
      q12: extractLikertAverage(gameData, idxQ12)
    };

    // Médias Técnicas Simulador (0 se sem respostas)
    const simModules = {
      q15: extractLikertAverage(simData, idxQ15),
      q16: extractLikertAverage(simData, idxQ16),
      q17: extractLikertAverage(simData, idxQ17),
      q18: extractLikertAverage(simData, idxQ18),
      q19: extractLikertAverage(simData, idxQ19),
      q20: extractLikertAverage(simData, idxQ20),
      q21: extractLikertAverage(simData, idxQ21),
      q22: extractLikertAverage(simData, idxQ22),
      q23: extractLikertAverage(simData, idxQ23)
    };

    // Feedback Qualitativo: Voz dos Participantes (Q25, Q26-Q28, Q30)
    const feedItems = [];

    function collectFeedbackFromRows(rows, headers, qList) {
      rows.forEach((row, rowIdx) => {
        let code = row._participantCode || "";
        if (!code) {
          const cIdx = findColIndex(headers, /código|codigo|participante|code/i);
          if (cIdx !== -1 && row[cIdx]) code = normalizeParticipantCode(row[cIdx]);
        }
        if (!code) {
          for (let i = 0; i < row.length; i++) {
            const c = normalizeParticipantCode(row[i]);
            if (c && isValidParticipantCode(c)) { code = c; break; }
          }
        }
        if (!code) code = "Participante";

        const ts = parseSubmissionTimestamp(row[0]);

        qList.forEach(qItem => {
          if (qItem.colIdx === -1 || !row[qItem.colIdx]) return;
          const text = String(row[qItem.colIdx]).trim();
          if (!isValidFeedbackText(text)) return;

          feedItems.push({
            code,
            text,
            tagPT: qItem.tagPT,
            tagEN: qItem.tagEN,
            tagType: qItem.tagType,
            timestamp: ts,
            orderKey: ts > 0 ? ts : (rowIdx + 1)
          });
        });
      });
    }

    // Formulário 2: Simulador (Q25 -> Simulador, Q26-Q28 -> Experiência Global, Q30 -> Erro / Sugestão)
    collectFeedbackFromRows(simData, simHeaders, [
      { colIdx: idxQ25_sim, tagPT: "Simulador", tagEN: "Simulator", tagType: "sim" },
      { colIdx: idxQ26_sim, tagPT: "Experiência Global", tagEN: "Global Experience", tagType: "global" },
      { colIdx: idxQ27_sim, tagPT: "Experiência Global", tagEN: "Global Experience", tagType: "global" },
      { colIdx: idxQ28_sim, tagPT: "Experiência Global", tagEN: "Global Experience", tagType: "global" },
      { colIdx: idxQ30_sim, tagPT: "Erro / Sugestão", tagEN: "Bug / Suggestion", tagType: "issue" }
    ]);

    // Formulário 3: Global (Q25 se existir, Q26-Q28 -> Experiência Global, Q30 -> Erro / Sugestão)
    collectFeedbackFromRows(globalData, globalHeaders, [
      { colIdx: idxQ25_global, tagPT: "Simulador", tagEN: "Simulator", tagType: "sim" },
      { colIdx: idxQ26_global, tagPT: "Experiência Global", tagEN: "Global Experience", tagType: "global" },
      { colIdx: idxQ27_global, tagPT: "Experiência Global", tagEN: "Global Experience", tagType: "global" },
      { colIdx: idxQ28_global, tagPT: "Experiência Global", tagEN: "Global Experience", tagType: "global" },
      { colIdx: idxQ30_global, tagPT: "Erro / Sugestão", tagEN: "Bug / Suggestion", tagType: "issue" }
    ]);

    // Ordenar das mais recentes para as mais antigas (maior orderKey primeiro)
    feedItems.sort((a, b) => b.orderKey - a.orderKey);

    const simSuggestions = feedItems.filter(f => f.tagType === "sim");
    const finalSuggestions = feedItems.filter(f => f.tagType === "issue");

    state.metrics = {
      participantCount: Math.max(gameData.length, simData.length, globalData.length),
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
   * Tokenização e contagem de frequência de palavras (com remoção de stopwords PT)
   */
  function extractWordFrequencies(textsArray) {
    const counts = {};
    if (!textsArray || !textsArray.length) return [];

    textsArray.forEach(text => {
      if (!text || typeof text !== "string") return;
      // Normalizar texto, remover pontuações e símbolos
      const words = text
        .toLowerCase()
        .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'«»]/g, " ")
        .split(/\s+/);

      words.forEach(w => {
        const clean = w.trim();
        if (clean.length >= 3 && !PT_STOPWORDS.has(clean) && !EN_STOPWORDS.has(clean)) {
          // Capitalizar primeira letra para estética elegante
          const capitalized = clean.charAt(0).toUpperCase() + clean.slice(1);
          counts[capitalized] = (counts[capitalized] || 0) + 1;
        }
      });
    });

    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return entries.slice(0, 35); // Top 35 palavras mais citadas
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

    if (window.lucide) window.lucide.createIcons();
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

    // Renderizar Lista Top 6 no Painel Lateral
    if (listContainer) {
      if (!wordsList.length) {
        listContainer.innerHTML = `<li class="text-xs text-slate-500 italic">${isEn ? "No words recorded yet." : "Sem palavras registadas de momento."}</li>`;
      } else {
        const topList = wordsList.slice(0, 6);
        const maxVal = topList[0][1] || 1;
        listContainer.innerHTML = topList.map(([word, count], idx) => `
          <li class="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
            <span class="font-bold text-slate-800 flex items-center gap-1.5">
              <span class="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-mono">${idx + 1}</span>
              ${word}
            </span>
            <span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[11px] font-mono">
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

      if (!wordsList.length) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, width, height);
        ctx.font = "14px sans-serif";
        ctx.fillStyle = "#64748B";
        ctx.textAlign = "center";
        ctx.fillText(isEn ? "Awaiting word submissions..." : "A aguardar recolha de palavras...", width / 2, height / 2);
        return;
      }

      // Multiplicador de escala de acordo com as dimensões do ecrã
      const maxCount = wordsList[0][1] || 1;
      const factor = Math.max((width / 380) * (32 / maxCount), 12);

      const colorPalette = isGame 
        ? ["#0F172A", "#D97706", "#B45309", "#059669", "#2563EB", "#7C3AED"]
        : ["#0F172A", "#059669", "#047857", "#2563EB", "#D97706", "#1D4ED8"];

      try {
        WordCloud(canvas, {
          list: wordsList,
          gridSize: Math.round(14 * width / 1024) + 2,
          weightFactor: function (size) {
            return Math.min(Math.max(size * factor, 14), 48);
          },
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: function () {
            return colorPalette[Math.floor(Math.random() * colorPalette.length)];
          },
          rotateRatio: 0.15,
          rotationSteps: 2,
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
    if (!container || !wordsList.length) return;
    const max = wordsList[0][1] || 1;
    container.innerHTML = `
      <div class="flex flex-wrap gap-2.5 items-center justify-center p-6 min-h-[220px]">
        ${wordsList.map(([word, count]) => {
          const ratio = count / max;
          const fontSize = 12 + Math.round(ratio * 16);
          const isTop = ratio > 0.6;
          return `
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold transition-transform hover:scale-105 ${isTop ? 'bg-amber-100 text-slate-900 border-amber-300' : 'bg-slate-50 text-slate-700 border-slate-200'}" style="font-size: ${fontSize}px">
              ${word}
              <span class="text-[10px] opacity-75 font-mono">(${count})</span>
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

    if (pinGame) {
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

    if (pinSim) {
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
   * Gráfico 1: Comparativo SUS (Serious Game vs Simulador nas 10 dimensões)
   */
  function renderSusComparisonChart() {
    const ctx = document.getElementById("chart-sus-comparison")?.getContext("2d");
    if (!ctx || !window.Chart) return;

    if (state.charts.susComparison) {
      state.charts.susComparison.destroy();
    }

    const isEn = window.I18nManager && window.I18nManager.isEnglish();

    // 3. Mapeamento do Eixo X (10 grupos de barras com rótulos positivos otimizados)
    const susLabels = isEn ? [
      "1. Frequency of Use",
      "2. Low Complexity",
      "3. Ease of Use",
      "4. Tech Independence",
      "5. Well Integrated",
      "6. Overall Consistency",
      "7. Quick Learning",
      "8. Usability Comfort",
      "9. Confidence in Use",
      "10. Easy Onboarding"
    ] : [
      "1. Frequência de Uso",
      "2. Baixa Complexidade",
      "3. Facilidade de Uso",
      "4. Independência Técnica",
      "5. Boa Integração",
      "6. Consistência Geral",
      "7. Aprendizagem Rápida",
      "8. Conforto de Uso",
      "9. Confiança Operacional",
      "10. Fácil Iniciação"
    ];

    // Verificar existência de respostas válidas (zero-state = array de 10 zeros)
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

    state.charts.susComparison = new Chart(ctx, {
      type: "bar",
      data: {
        labels: susLabels,
        datasets: [
          {
            label: "Serious Game (Tallentto)",
            data: gameItems,
            backgroundColor: "#F5B842",
            borderColor: "#D97706",
            borderWidth: 1.5,
            borderRadius: 6,
            maxBarThickness: 28
          },
          {
            label: isEn ? "RENOVATE Simulator (Virmedex)" : "Simulador RENOVATE (Virmedex)",
            data: simItems,
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
                  return isEn
                    ? "(Even item inverted: 6 − raw mean; higher = better usability)"
                    : "(Item par invertido: 6 − média bruta; maior = melhor usabilidade)";
                }
                return isEn
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
  }

  /**
   * Gráfico 2: SERIOUS GAME (Q7 A Q12) - Gráfico de Barras Horizontais (Eixo X de 0 a 5)
   */
  function renderGamePedagogyChart() {
    const ctx = document.getElementById("chart-game-pedagogy")?.getContext("2d");
    if (!ctx || !window.Chart || !state.metrics) return;

    if (state.charts.gamePedagogy) {
      state.charts.gamePedagogy.destroy();
    }

    const isEn = window.I18nManager && window.I18nManager.isEnglish();
    const p = state.metrics.gamePedagogy || { q7: 0, q8: 0, q9: 0, q10: 0, q11: 0, q12: 0 };

    state.charts.gamePedagogy = new Chart(ctx, {
      type: "bar",
      data: {
        labels: isEn ? [
          "Q7. Explanation Clarity",
          "Q8. Difficulty Suitability",
          "Q9. Scenario Realism",
          "Q10. Calibration Usefulness",
          "Q11. Gamified Engagement",
          "Q12. Global Expectations"
        ] : [
          "Q7. Clareza das Explicações",
          "Q8. Adequação da Dificuldade",
          "Q9. Realismo dos Cenários",
          "Q10. Utilidade na Calibração",
          "Q11. Envolvimento Lúdico",
          "Q12. Expectativas Globais"
        ],
        datasets: [{
          label: isEn ? "Mean Rating (1 to 5)" : "Média (1 a 5)",
          data: [p.q7, p.q8, p.q9, p.q10, p.q11, p.q12],
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
                if (val === 0) return isEn ? "Awaiting data" : "A aguardar dados";
                return `${context.dataset.label || "Média"}: ${val.toFixed(1)} / 5.0`;
              },
              afterLabel: function(context) {
                if (context.dataIndex === 1) {
                  return isEn
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
  }

  /**
   * Gráfico 3: SIMULADOR (Q15 A Q23) - Gráfico de Barras Horizontais (Eixo X de 0 a 5)
   */
  function renderSimModulesChart() {
    const ctx = document.getElementById("chart-sim-modules")?.getContext("2d");
    if (!ctx || !window.Chart || !state.metrics) return;

    if (state.charts.simModules) {
      state.charts.simModules.destroy();
    }

    const isEn = window.I18nManager && window.I18nManager.isEnglish();
    const s = state.metrics.simModules || {
      q15: 0, q16: 0, q17: 0, q18: 0, q19: 0, q20: 0, q21: 0, q22: 0, q23: 0
    };

    state.charts.simModules = new Chart(ctx, {
      type: "bar",
      data: {
        labels: isEn ? [
          "Q15. Navigation & Controls",
          "Q16. Tutorials & Menus",
          "Q17. Pedagogical Efficacy",
          "Q18. Decision Sequence",
          "Q19. Calculations & Formulas",
          "Q20. Nozzles & Spray Volume",
          "Q21. Selection & Label",
          "Q22. Field Variables",
          "Q23. Global Expectations"
        ] : [
          "Q15. Navegação e Controlos",
          "Q16. Tutoriais e Menus",
          "Q17. Eficácia Pedagógica",
          "Q18. Sequência de Decisão",
          "Q19. Cálculos e Fórmulas",
          "Q20. Bicos e Vol. de Calda",
          "Q21. Seleção e Rótulo",
          "Q22. Variáveis de Campo",
          "Q23. Expectativas Globais"
        ],
        datasets: [{
          label: isEn ? "Mean Score (1 to 5)" : "Média (1 a 5)",
          data: [s.q15, s.q16, s.q17, s.q18, s.q19, s.q20, s.q21, s.q22, s.q23],
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
                if (val === 0) return isEn ? "Awaiting data" : "A aguardar dados";
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
  }

  /**
   * Gráficos 4 & 5: Demografia (Perfis Profissionais e Culturas Agrícolas)
   */
  function renderDemographicsCharts() {
    if (!state.metrics?.demographics) return;
    const demo = state.metrics.demographics;
    const isEn = window.I18nManager && window.I18nManager.isEnglish();

    // Gráfico de Perfis Profissionais (Q1 - Donut)
    const ctxProfiles = document.getElementById("chart-demo-profiles")?.getContext("2d");
    if (ctxProfiles && window.Chart) {
      if (state.charts.demoProfiles) state.charts.demoProfiles.destroy();

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

      state.charts.demoProfiles = new Chart(ctxProfiles, {
        type: "doughnut",
        data: {
          labels: pLabels,
          datasets: [{
            data: pData,
            backgroundColor: pColors,
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
                  if (isZero) {
                    return isEn ? " Awaiting responses: 0" : " A aguardar respostas: 0";
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
    }

    // Gráfico de Culturas com Maior Representatividade (Q5 - Barras Horizontais Ordenadas Decrescente)
    const ctxCrops = document.getElementById("chart-demo-crops")?.getContext("2d");
    if (ctxCrops && window.Chart) {
      if (state.charts.demoCrops) state.charts.demoCrops.destroy();

      const cEntries = OFFICIAL_CROPS.map(c => ({
        label: isEn ? (CROP_TRANSLATIONS[c] || c) : c,
        count: demo.crops[c] || 0
      })).sort((a, b) => b.count - a.count);

      state.charts.demoCrops = new Chart(ctxCrops, {
        type: "bar",
        data: {
          labels: cEntries.map(e => e.label),
          datasets: [{
            label: isEn ? "Involved Participants" : "Participantes Envolvidos",
            data: cEntries.map(e => e.count),
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
   * Gráfico 6: Recomendação RENOVATE (Q29)
   */
  function renderNpsChart() {
    const ctx = document.getElementById("chart-nps-gauge")?.getContext("2d");
    if (!ctx || !window.Chart || !state.metrics?.nps) return;

    if (state.charts.npsGauge) state.charts.npsGauge.destroy();

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

    state.charts.npsGauge = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: "#FFFFFF"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "68%",
        plugins: {
          legend: {
            display: false // Mapeamento de Legenda Oculta: fatias limpas e informativas via tooltip
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                if (isZero) {
                  return isEn ? " Awaiting responses: 0" : " A aguardar respostas: 0";
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
    fetchData,
    onTabShown,
    resizeAllCharts,
    setSectionFilter,
    renderKpiCards
  };
})();
