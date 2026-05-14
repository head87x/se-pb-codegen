// ============================================================
// PLAIN-LANGUAGE DESCRIPTION (v3.2.1 — Fließtext)
// ============================================================
// Erzeugt eine lesbare Beschreibung der aktuellen Konfiguration
// als zusammenhängenden Fließtext (kein Bullet-Format).
//
// Beispiel-Output (DE):
//   "Etwa 6 mal pro Sekunde prüft das Skript, ob am Sensor
//   „Sensor 1" die Bedingung „Etwas erkannt" zutrifft und am
//   Akku „Hauptakku" die Bedingung „Ladung > X %" (Wert: 50)
//   zutrifft. Wenn ja, wird die Aktion „Öffnen" an der Tür
//   „Schleuse" ausgeführt. Andernfalls wird die Aktion
//   „Schließen" an der Tür „Schleuse" ausgeführt."
// ============================================================

function _descT(key, ...args) {
  return (typeof t === "function") ? t(key, ...args) : key;
}

// Entfernt " (englisch)"-Klammern aus Catalog-Block-Type-Labels,
// damit der Fließtext nicht von „Tür (Door)" zerhackt wird.
function _cleanTypeLabel(s) {
  return String(s || "").replace(/\s*\([^)]+\)\s*$/, "").trim() || s;
}

// Liefert eine Block-Phrase OHNE Artikel/Präposition. Aufrufer wählt
// passende Präposition + ggf. Plural-Klausel je Klausel-Kontext.
function _blockPhrase(item) {
  const typeLblRaw = (typeof blockTypeLabel === "function")
    ? blockTypeLabel(item.blockType)
    : item.blockType;
  const typeLbl = _cleanTypeLabel(typeLblRaw);
  const src = item.blockSource || (item.useGroup ? "group" : "single");
  const name = (item.blockName || "").trim() || _descT("desc.unnamed");
  if (src === "single") {
    return _descT("desc.bp.single", typeLbl, name);
  }
  if (src === "group") {
    return _descT("desc.bp.group_pl", name);
  }
  // type — immer Plural in den Multi-Klauseln verwendet
  return (item.sameConstruct !== false)
    ? _descT("desc.bp.type_sc_pl", typeLbl)
    : _descT("desc.bp.type_any_pl", typeLbl);
}

// Wort für Operator: "größer als", "mindestens", …
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

// Baut eine Bedingungs-Klausel (ohne führendes "und"/"oder").
// Liefert einen Satz-Teil, der nach "ob " eingefügt werden kann.
function _conditionClause(c) {
  const cond = (typeof findCond === "function") ? findCond(c.blockType, c.condId) : null;
  const condLbl = cond
    ? ((typeof localizedItemLabel === "function")
        ? localizedItemLabel(cond, c.blockType, "conditions")
        : cond.label)
    : c.condId;

  const argSuffix = (cond && cond.arg && c.arg)
    ? _descT("desc.arg_suffix", c.arg)
    : "";

  const src = c.blockSource || (c.useGroup ? "group" : "single");
  const mode = (c.aggregateMode || c.groupSemantic || "any").toLowerCase();

  // Single-Block oder Multi mit Boolean-Aggregator (any/all/count)
  if (src === "single") {
    return _descT("desc.cc.single", _blockPhrase(c), condLbl) + argSuffix;
  }
  if (mode === "any") {
    return _descT("desc.cc.any", _blockPhrase(c), condLbl) + argSuffix;
  }
  if (mode === "all") {
    return _descT("desc.cc.all", _blockPhrase(c), condLbl) + argSuffix;
  }
  if (mode === "count") {
    const thr = (typeof c.aggregateThreshold === "number")
      ? c.aggregateThreshold
      : (parseFloat(c.aggregateThreshold) || (c.groupCount || 1));
    return _descT("desc.cc.count", _opWord(c.aggregateOp || ">="), thr, _blockPhrase(c), condLbl) + argSuffix;
  }
  // Numerische Aggregatoren: sum / avg / min / max
  const thr = (typeof c.aggregateThreshold === "number")
    ? c.aggregateThreshold
    : (parseFloat(c.aggregateThreshold) || 0);
  const opW = _opWord(c.aggregateOp || ">=");
  const aggKey = "desc.cc." + mode;   // sum, avg, min, max
  return _descT(aggKey, _blockPhrase(c), condLbl, opW, thr);
}

// Baut eine Aktions-Klausel: "die Aktion „Öffnen" an der Tür „Schleuse""
// (ohne führendes "wird"/"werden" — das setzt der Listen-Builder).
function _actionClause(a) {
  const act = (typeof findAct === "function") ? findAct(a.blockType, a.actId) : null;
  const actLbl = act
    ? ((typeof localizedItemLabel === "function")
        ? localizedItemLabel(act, a.blockType, "actions")
        : act.label)
    : a.actId;
  const argSuffix = (act && act.arg && a.arg)
    ? _descT("desc.arg_suffix", a.arg)
    : "";
  const src = a.blockSource || (a.useGroup ? "group" : "single");
  if (src === "single") {
    return _descT("desc.ac.single", actLbl, _blockPhrase(a)) + argSuffix;
  }
  return _descT("desc.ac.multi", actLbl, _blockPhrase(a)) + argSuffix;
}

// Verkettet Action-Klauseln zu einer Liste mit Komma + abschließendem "und".
function _joinActionClauses(clauses) {
  if (clauses.length === 0) return "";
  if (clauses.length === 1) return clauses[0];
  if (clauses.length === 2) {
    return _descT("desc.join.two", clauses[0], clauses[1]);
  }
  // 3+: alle bis vorletztes mit Komma, letztes mit "und"
  const head = clauses.slice(0, -1).join(", ");
  const tail = clauses[clauses.length - 1];
  return _descT("desc.join.many", head, tail);
}

// Verkettet Condition-Klauseln mit AND/OR-Connectors.
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

// Trigger-Phrase (Adverbiale am Satzanfang).
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

// Hilfs-Filter: nur Einträge mit Block-Quelle behalten, die einen
// Sinn ergeben (single/group brauchen Name; type ist immer gültig).
function _isValid(item) {
  const src = item.blockSource || (item.useGroup ? "group" : "single");
  return src === "type" || (item.blockName && item.blockName.trim().length > 0);
}

// Hauptfunktion: liefert Beschreibung als Objekt mit text + flags.
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

  // Verb-Form: "wird" bei einer Aktion, "werden" bei mehreren.
  const thenVerb = thenClauses.length === 1 ? _descT("desc.verb.is") : _descT("desc.verb.are");
  const elseVerb = elseClauses.length === 1 ? _descT("desc.verb.is") : _descT("desc.verb.are");

  let text = "";

  if (validConds.length > 0) {
    // Mit Bedingungen: „<Trigger> prüft das Skript, ob <Cond>. Wenn ja, <Then>. Andernfalls <Else>."
    const condJoined = _joinConditionClauses(validConds);
    text = _descT("desc.fmt.cond_open", trigger, condJoined);
    if (thenClauses.length > 0) {
      text += " " + _descT("desc.fmt.then_clause", thenVerb, thenJoined);
    } else {
      text += " " + _descT("desc.fmt.then_empty");
    }
    if (elseClauses.length > 0) {
      text += " " + _descT("desc.fmt.else_clause", elseVerb, elseJoined);
    }
  } else if (thenClauses.length > 0) {
    // Ohne Bedingungen, mit Then-Aktionen: „<Trigger> wird/werden <Then> ausgeführt."
    text = _descT("desc.fmt.no_cond", trigger, thenVerb, thenJoined);
  } else if (elseClauses.length > 0) {
    // Edge-Case: nur Else, keine Conds und kein Then. Liest sich seltsam,
    // aber der User hat das so eingegeben.
    text = _descT("desc.fmt.only_else", trigger, elseVerb, elseJoined);
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

// Aktualisiert die Erklärungs-Box im rechten Panel.
function updateExplanation() {
  const el = document.getElementById("explanation-content");
  if (!el) return;
  el.innerHTML = renderExplanationHtml();
}

// Toggle für die Erklärungs-Box (auf-/zuklappen).
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
