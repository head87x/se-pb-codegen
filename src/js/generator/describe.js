// ============================================================
// PLAIN-LANGUAGE DESCRIPTION (v3.2.2 — natürlicher Fließtext)
// ============================================================
// Beschreibung als ganz natürlich lesbarer Text:
//
//   "Etwa 6 mal pro Sekunde prüft das Skript, ob Tür 1 offen ist
//    und Hauptakku mehr als 50 % geladen hat. Wenn ja, wird Tür
//    Schleuse geöffnet. Andernfalls wird Tür Schleuse geschlossen."
//
// Die Catalog-Labels ("Ist offen", "Ladung > X %") werden mit
// Heuristik und Override-Map in natürliche Predicate-Phrasen
// umgeformt ("offen ist", "mehr als 50 % geladen hat").
// ============================================================

function _descT(key, ...args) {
  return (typeof t === "function") ? t(key, ...args) : key;
}

function _descLang() {
  return (typeof getLang === "function") ? getLang() : "de";
}

// Override-Map für Spezialfälle, die Heuristik nicht clean trifft.
// Key = exaktes Catalog-Label, Value = Predicate-Phrase (Verb inkl.)
// Wenn EN-Label → EN-Predicate.
const _PREDICATE_OVERRIDES_DE = {
  // Sensor
  "Etwas erkannt": "etwas erkannt hat",
  // Tür
  "Öffnet gerade": "gerade öffnet",
  "Schließt gerade": "gerade schließt",
  // Air Vent
  "Druckt gerade ab": "gerade abdruckt",
  "Druckt gerade auf": "gerade aufpumpt",
  "Druckaufbau aktiv": "Druckaufbau aktiv hat",
  "Voll abgepumpt": "voll abgepumpt ist",
  "Druck aufgebaut": "Druck aufgebaut hat",
  // Akku
  "Lädt gerade": "gerade lädt",
  "Entlädt gerade": "gerade entlädt",
  // Standard-Inventory
  "Enthält Item": "ein bestimmtes Item enthält",
  "Item-Menge > X": "mehr als die angegebene Menge eines Items enthält",
  "Item-Menge < X": "weniger als die angegebene Menge eines Items enthält",
  // Reaktor
  "Brennstoff < X kg": "weniger als die angegebene Menge Brennstoff hat",
  // Cargo
  "Voll (über X %)":  "zu mehr als dem angegebenen Prozentsatz voll ist",
  "Leer (unter X %)": "zu weniger als dem angegebenen Prozentsatz voll ist",
  // Sound / Antenne / etc.
  "Sendet gerade": "gerade sendet",
  "Erhält gerade Signal": "gerade ein Signal empfängt",
  // Funktion „Arbeitet (Strom da)"
  "Arbeitet (Strom da)": "in Betrieb ist (Strom liegt an)",
  // Fortgeschritten — meist als "Ist X" eh schon abgedeckt
};

const _PREDICATE_OVERRIDES_EN = {
  "Detected something": "has detected something",
  "Opening": "is currently opening",
  "Closing": "is currently closing",
  "Currently depressurizing": "is currently depressurizing",
  "Currently pressurizing": "is currently pressurizing",
  "Pressurization active": "has pressurization active",
  "Fully depressurized": "is fully depressurized",
  "Pressure built up": "has pressure built up",
  "Currently charging": "is currently charging",
  "Currently discharging": "is currently discharging",
  "Contains item": "contains a specific item",
  "Item count > X": "contains more than the specified amount of an item",
  "Item count < X": "contains less than the specified amount of an item",
  "Fuel < X kg": "has less than the specified amount of fuel",
  "Full (above X %)":  "is filled above the specified percentage",
  "Empty (below X %)": "is filled below the specified percentage",
  "Currently broadcasting": "is currently broadcasting",
  "Currently receiving signal": "is currently receiving a signal",
  "Working (powered)": "is operational (power available)",
};

// Wandelt eine Number-Condition mit Arg in eine natürliche Phrase um.
// DE: Verb am Ende (Nebensatz-Wortstellung): "mehr als 50 % Ladung hat".
// EN: Verb in der Mitte: "has more than 50 % charge".
function _numberPredicate(cond, c) {
  const label = (typeof localizedItemLabel === "function")
    ? localizedItemLabel(cond, c.blockType, "conditions")
    : (cond.label || "");
  const arg = c.arg || "";
  if (!arg) return null;
  const m = label.match(/^(.+?)\s*([<>])=?\s*X\s*(.*)$/);
  if (!m) return null;
  const prop = m[1].trim();
  const op = m[2];
  const unit = m[3].trim();

  const lang = _descLang();
  if (lang === "en") {
    const opWord = (op === ">") ? "more than" : "less than";
    if (unit) {
      return `has more than ${arg} ${unit} ${prop.toLowerCase()}`.replace("more than", opWord);
    }
    return `has ${prop.toLowerCase()} ${opWord} ${arg}`;
  }
  // DE — Verb am Ende für Nebensatz-Wortstellung
  const opWord = (op === ">") ? "mehr als" : "weniger als";
  if (unit) {
    return `${opWord} ${arg} ${unit} ${prop} hat`;
  }
  return `${prop} ${opWord} ${arg} hat`;
}

// Hauptfunktion: Predicate-Phrase aus Catalog-Label generieren.
// Returnt z.B. "ist offen" / "hat mehr als 50 % geladen" / "etwas erkannt hat".
function _conditionPredicate(cond, c) {
  if (!cond) return _descT("desc.predicate.fallback");

  // Sprach-bezogenes Label holen
  const label = (typeof localizedItemLabel === "function")
    ? localizedItemLabel(cond, c.blockType, "conditions")
    : (cond.label || "");
  const lang = _descLang();

  // 1) Override?
  const overrides = (lang === "en") ? _PREDICATE_OVERRIDES_EN : _PREDICATE_OVERRIDES_DE;
  if (overrides[label]) return overrides[label];

  // 2) Number-Heuristik
  if (cond.kind === "number") {
    const np = _numberPredicate(cond, c);
    if (np) return np;
  }

  // 3) Boolean-Heuristik nach Sprache
  if (lang === "en") {
    // EN: Verb in der Mitte (passt in Nebensatz)
    if (label.startsWith("Is ")) {
      return "is " + label.slice(3).toLowerCase();
    }
    if (label.startsWith("Has ")) {
      return "has " + label.slice(4).toLowerCase();
    }
    return _descT("desc.predicate.fallback_label", label);
  }
  // DE — Nebensatz-Wortstellung: Verb am Ende.
  // "Ist offen" → "offen ist", "Hat Strom" → "Strom hat".
  if (label.startsWith("Ist ")) {
    return label.slice(4) + " ist";
  }
  if (label.startsWith("Hat ")) {
    return label.slice(4) + " hat";
  }
  return _descT("desc.predicate.fallback_label", label);
}

// Wandelt Singular-Predicate in Plural-Form.
// DE: Verb am Ende → "offen ist" → "offen sind", "Ladung hat" → "Ladung haben"
// EN: Verb in Mitte → "is open" → "are open", "has X" → "have X"
function _pluralizePredicate(predicate) {
  if (!predicate) return predicate;
  if (_descLang() === "en") {
    return predicate
      .replace(/^is\s+/, "are ")
      .replace(/^has\s+/, "have ");
  }
  // DE: Verb am Ende ersetzen
  return predicate
    .replace(/\sist$/, " sind")
    .replace(/\shat$/, " haben");
}

// Säubert Catalog-Block-Type-Labels von Klammer-Annotationen wie "(Door)".
function _cleanTypeLabel(s) {
  return String(s || "").replace(/\s*\([^)]+\)\s*$/, "").trim() || s;
}

// Block-Subjekt für single-Modus: nur der Block-Name (ohne Type, ohne
// Anführungszeichen — der Name spricht für sich).
// Für group/type: Plural-Phrase mit Type-Info.
function _blockSubject(item) {
  const src = item.blockSource || (item.useGroup ? "group" : "single");
  if (src === "single") {
    const name = (item.blockName || "").trim() || _descT("desc.unnamed");
    return name;
  }
  if (src === "group") {
    const name = (item.blockName || "").trim() || _descT("desc.unnamed");
    return _descT("desc.bp.group_pl", name);
  }
  // type
  const typeLblRaw = (typeof blockTypeLabel === "function")
    ? blockTypeLabel(item.blockType)
    : item.blockType;
  const typeLbl = _cleanTypeLabel(typeLblRaw);
  return (item.sameConstruct !== false)
    ? _descT("desc.bp.type_sc_pl", typeLbl)
    : _descT("desc.bp.type_any_pl", typeLbl);
}

// Operator-Wort für Aggregator-Schwellwerte ("größer als", "mindestens").
function _opWord(op) {
  switch (op) {
    case ">":  return _descT("desc.op.gt");
    case ">=": return _descT("desc.op.gte");
    case "<":  return _descT("desc.op.lt");
    case "<=": return _descT("desc.op.lte");
    case "==": return _descT("desc.op.eq");
    case "!=": return _descT("desc.op.neq");
    default:   return _descT("desc.op.gte");
  }
}

// Baut eine ganze Bedingungs-Klausel.
// Single: "{subject} {predicate-sg}"  → "Tür 1 ist offen"
// Multi:  je nach Aggregator-Modus.
function _conditionClause(c) {
  const cond = (typeof findCond === "function") ? findCond(c.blockType, c.condId) : null;
  const subj = _blockSubject(c);
  const predSg = _conditionPredicate(cond, c);
  const predPl = _pluralizePredicate(predSg);

  const src = c.blockSource || (c.useGroup ? "group" : "single");
  if (src === "single") {
    return _descT("desc.cc.single", subj, predSg);
  }

  const mode = (c.aggregateMode || c.groupSemantic || "any").toLowerCase();
  if (mode === "any") {
    return _descT("desc.cc.any", subj, predSg);   // "mindestens einer der ..." → Singular-Verb
  }
  if (mode === "all") {
    return _descT("desc.cc.all", subj, predPl);   // "alle ..." → Plural-Verb
  }
  if (mode === "count") {
    const thr = (typeof c.aggregateThreshold === "number")
      ? c.aggregateThreshold
      : (parseFloat(c.aggregateThreshold) || (c.groupCount || 1));
    return _descT("desc.cc.count", thr, subj, predPl);
  }
  // Numerische Aggregatoren: sum/avg/min/max — andere Struktur
  const thr = (typeof c.aggregateThreshold === "number")
    ? c.aggregateThreshold
    : (parseFloat(c.aggregateThreshold) || 0);
  const opW = _opWord(c.aggregateOp || ">=");
  // Hier nutzen wir den Cond-Label als Property-Hinweis statt Predicate
  const condLbl = cond
    ? ((typeof localizedItemLabel === "function")
        ? localizedItemLabel(cond, c.blockType, "conditions")
        : (cond.label || ""))
    : c.condId;
  const aggKey = "desc.cc." + mode;
  return _descT(aggKey, subj, condLbl, opW, thr);
}

// ============================================================
// Aktions-Klauseln — Form: "wird X geöffnet" / "is opened"
// Catalog-Action-Labels sind oft im Imperativ ("Öffnen", "Schließen").
// Wir transformieren zu Passiv-Partizip via Override-Map oder
// Heuristik, plus Verb-Form Singular/Plural.
// ============================================================

const _ACTION_PARTICIPLE_DE = {
  "Öffnen": "geöffnet",
  "Schließen": "geschlossen",
  "Umschalten": "umgeschaltet",
  "Einschalten": "eingeschaltet",
  "Ausschalten": "ausgeschaltet",
  "Aktivieren": "aktiviert",
  "Deaktivieren": "deaktiviert",
  "Starten": "gestartet",
  "Stoppen": "gestoppt",
  "Anhalten": "angehalten",
  "Abspielen": "abgespielt",
  "Pausieren": "pausiert",
  "Auslösen": "ausgelöst",
  "Bremsen": "gebremst",
  "Drosseln": "gedrosselt",
  "Beschleunigen": "beschleunigt",
  "Helligkeit setzen": "auf eingestellte Helligkeit gesetzt",
  "Farbe setzen": "auf gewünschte Farbe gesetzt",
  "Aufpumpen": "aufgepumpt",
  "Abpumpen": "abgepumpt",
  "Sperren": "gesperrt",
  "Entsperren": "entsperrt",
  "Reset": "zurückgesetzt",
};

const _ACTION_PARTICIPLE_EN = {
  "Open": "opened",
  "Close": "closed",
  "Toggle": "toggled",
  "Turn on": "turned on",
  "Turn off": "turned off",
  "Enable": "enabled",
  "Disable": "disabled",
  "Start": "started",
  "Stop": "stopped",
  "Halt": "halted",
  "Play": "played",
  "Pause": "paused",
  "Trigger": "triggered",
  "Brake": "braked",
  "Throttle": "throttled",
  "Accelerate": "accelerated",
  "Set brightness": "set to the configured brightness",
  "Set color": "set to the desired color",
  "Pressurize": "pressurized",
  "Depressurize": "depressurized",
  "Lock": "locked",
  "Unlock": "unlocked",
  "Reset": "reset",
};

// Bildet die Partizip-Form (Passiv) eines Action-Labels.
// blockType wird gebraucht, damit localizedItemLabel die richtige Übersetzung
// (DE → EN, falls Sprache EN ist) findet.
function _actionParticiple(act, blockType, lang) {
  if (!act) return _descT("desc.action.fallback");
  const label = (typeof localizedItemLabel === "function")
    ? localizedItemLabel(act, blockType, "actions")
    : (act.label || "");
  const overrides = (lang === "en") ? _ACTION_PARTICIPLE_EN : _ACTION_PARTICIPLE_DE;
  if (overrides[label]) return overrides[label];
  return _descT("desc.action.fallback_label", label);
}

// Baut eine Aktions-Klausel: "{subject} {verb} {participle}"
// Singular: "Tür 1 wird geöffnet"
// Multi (group/type): wird vom fmt-Template für "alle ..." gewrappt.
function _actionClause(a) {
  const act = (typeof findAct === "function") ? findAct(a.blockType, a.actId) : null;
  const lang = _descLang();
  const subj = _blockSubject(a);
  const participle = _actionParticiple(act, a.blockType, lang);
  const src = a.blockSource || (a.useGroup ? "group" : "single");
  const argSuffix = (act && act.arg && a.arg) ? _descT("desc.arg_suffix", a.arg) : "";

  if (src === "single") {
    return _descT("desc.ac.single", subj, participle) + argSuffix;
  }
  // Multi: subj ist schon Plural-Phrase
  return _descT("desc.ac.multi", subj, participle) + argSuffix;
}

// Verkettet Action-Klauseln zu Listen.
function _joinActionClauses(clauses) {
  if (clauses.length === 0) return "";
  if (clauses.length === 1) return clauses[0];
  if (clauses.length === 2) return _descT("desc.join.two", clauses[0], clauses[1]);
  const head = clauses.slice(0, -1).join(", ");
  const tail = clauses[clauses.length - 1];
  return _descT("desc.join.many", head, tail);
}

// Verkettet Condition-Klauseln mit "und"/"oder".
function _joinConditionClauses(items) {
  if (items.length === 0) return "";
  let out = _conditionClause(items[0]);
  for (let i = 1; i < items.length; i++) {
    const connector = (items[i].logicOp === "OR")
      ? _descT("desc.or")
      : _descT("desc.and");
    out += " " + connector + " " + _conditionClause(items[i]);
  }
  return out;
}

// Trigger-Phrase (Satzanfang).
function _triggerPhrase(mode) {
  switch (mode) {
    case "argument":   return _descT("desc.trigger.argument");
    case "timer100":   return _descT("desc.trigger.timer100");
    case "timer10":    return _descT("desc.trigger.timer10");
    case "timer1":     return _descT("desc.trigger.timer1");
    case "continuous": return _descT("desc.trigger.continuous");
    default:           return _descT("desc.trigger.argument");
  }
}

// Filtert ungültige Items raus (kein Block-Name bei single/group).
function _isValid(item) {
  const src = item.blockSource || (item.useGroup ? "group" : "single");
  return src === "type" || (item.blockName && item.blockName.trim().length > 0);
}

// Hauptfunktion: liefert Beschreibung als Objekt.
function describeConfig() {
  const validConds = (state.conditions || []).filter(_isValid);
  const validThen  = (state.actionsThen  || []).filter(_isValid);
  const validElse  = (state.actionsElse  || []).filter(_isValid);

  const isEmpty = validConds.length === 0 && validThen.length === 0 && validElse.length === 0;
  if (isEmpty) {
    return { isEmpty: true, fluentText: _descT("desc.empty"), flags: [] };
  }

  const trigger = _triggerPhrase(state.execMode);
  const thenClauses = validThen.map(_actionClause);
  const elseClauses = validElse.map(_actionClause);
  const thenJoined  = _joinActionClauses(thenClauses);
  const elseJoined  = _joinActionClauses(elseClauses);

  let text = "";

  if (validConds.length > 0) {
    const condJoined = _joinConditionClauses(validConds);
    text = _descT("desc.fmt.cond_open", trigger, condJoined);
    if (thenClauses.length > 0) {
      text += " " + _descT("desc.fmt.then_clause", thenJoined);
    } else {
      text += " " + _descT("desc.fmt.then_empty");
    }
    if (elseClauses.length > 0) {
      text += " " + _descT("desc.fmt.else_clause", elseJoined);
    }
  } else if (thenClauses.length > 0) {
    text = _descT("desc.fmt.no_cond", trigger, thenJoined);
  } else if (elseClauses.length > 0) {
    text = _descT("desc.fmt.only_else", trigger, elseJoined);
  }

  const flags = [];
  if (state.useCoroutines)     flags.push(_descT("desc.flag.coroutines"));
  if (state.autoRecoverBlocks) flags.push(_descT("desc.flag.auto_recover"));

  return { isEmpty: false, fluentText: text, flags: flags };
}

// HTML-Renderer für die Erklärungs-Box.
function renderExplanationHtml() {
  const d = describeConfig();
  if (d.isEmpty) {
    return `<p class="explanation-empty">${escapeHtml(d.fluentText)}</p>`;
  }
  let html = `<p class="explanation-text">${escapeHtml(d.fluentText)}</p>`;
  if (d.flags && d.flags.length > 0) {
    html += `<p class="explanation-flags">${d.flags.map(escapeHtml).join(" • ")}</p>`;
  }
  return html;
}

function updateExplanation() {
  const el = document.getElementById("explanation-content");
  if (!el) return;
  el.innerHTML = renderExplanationHtml();
}

const EXPLANATION_OPEN_KEY = "se_pb_explanation_open";
function isExplanationOpen() {
  try {
    const v = localStorage.getItem(EXPLANATION_OPEN_KEY);
    return v === null ? true : v === "true";
  } catch (_) { return true; }
}
function toggleExplanation() {
  const box = document.getElementById("explanation-box");
  if (!box) return;
  const nowOpen = !box.classList.contains("open");
  box.classList.toggle("open", nowOpen);
  try { localStorage.setItem(EXPLANATION_OPEN_KEY, nowOpen ? "true" : "false"); } catch (_) {}
}
function initExplanationState() {
  const box = document.getElementById("explanation-box");
  if (!box) return;
  if (isExplanationOpen()) box.classList.add("open");
}
