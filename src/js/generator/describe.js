// ============================================================
// PLAIN-LANGUAGE DESCRIPTION (v3.2.0)
// ============================================================
// Erzeugt eine lesbare Beschreibung der aktuellen Konfiguration —
// für Einsteiger, die den C#-Code (noch) nicht lesen können.
// Beispiel-Output:
//
//   Das Skript läuft, wenn du es manuell auslöst.
//
//   Bedingung: Wenn der Sensor "Sensor 1" aktiv ist
//              UND die Summe aller Solarpanels (auf diesem
//              Construct) mehr als 50 kW liefert,
//
//   ... dann werden folgende Aktionen ausgeführt:
//   • Tür "Schleuse" wird geöffnet.
//   • Alle Lampen der Gruppe "Notlicht" werden eingeschaltet.
//
// Alle Bausteine kommen aus i18n (desc.*-Keys), Block-Typ-Labels
// aus blockTypeLabel(), Condition/Action-Labels aus localizedItemLabel().
// ============================================================

function _descT(key, ...args) {
  return (typeof t === "function") ? t(key, ...args) : key;
}

// Bezeichnung für die Blockquelle. Beispiele:
//   "der Sensor \"Sensor 1\""
//   "ein Block der Gruppe \"Frontlampen\""
//   "irgendein Solarpanel"
//   "alle Türen (auf diesem Construct)"
function _describeBlockSource(item) {
  const typeLbl = (typeof blockTypeLabel === "function")
    ? blockTypeLabel(item.blockType)
    : item.blockType;
  const src = item.blockSource || (item.useGroup ? "group" : "single");
  const name = (item.blockName || "").trim();
  if (src === "single") {
    return _descT("desc.block.single", typeLbl, name || _descT("desc.unnamed"));
  }
  if (src === "group") {
    return _descT("desc.block.group", typeLbl, name || _descT("desc.unnamed"));
  }
  // type
  const sameC = item.sameConstruct !== false;
  return sameC
    ? _descT("desc.block.type_sc", typeLbl)
    : _descT("desc.block.type_any", typeLbl);
}

// Operator-Wort: ">", ">=", "<", "<=", "==", "!=" → "größer als", "mindestens", …
function _describeOp(op) {
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

// Aggregator-Vorsilbe für eine Bedingung. Beispiele:
//   "mindestens einer erfüllt"      (any)
//   "alle erfüllen"                 (all)
//   "mindestens 3 erfüllen"         (count >= 3)
//   "die Summe ist größer als 50"   (sum > 50) — hier brauchen wir die Property-Beschreibung mit
function _describeAggregator(c) {
  const mode = (c.aggregateMode || c.groupSemantic || "any").toLowerCase();
  const op   = c.aggregateOp || ">=";
  const thr  = (typeof c.aggregateThreshold === "number")
    ? c.aggregateThreshold
    : (parseFloat(c.aggregateThreshold) || (c.groupCount || 1));
  switch (mode) {
    case "all":   return _descT("desc.agg.all");
    case "count": return _descT("desc.agg.count", _describeOp(op), thr);
    case "sum":   return _descT("desc.agg.sum",   _describeOp(op), thr);
    case "avg":   return _descT("desc.agg.avg",   _describeOp(op), thr);
    case "min":   return _descT("desc.agg.min",   _describeOp(op), thr);
    case "max":   return _descT("desc.agg.max",   _describeOp(op), thr);
    case "any":
    default:      return _descT("desc.agg.any");
  }
}

// Bedingungs-Satz für einen einzelnen Eintrag.
function _describeCondition(c) {
  const cond = (typeof findCond === "function") ? findCond(c.blockType, c.condId) : null;
  const condLbl = cond
    ? ((typeof localizedItemLabel === "function")
        ? localizedItemLabel(cond, c.blockType, "conditions")
        : cond.label)
    : c.condId;
  const blockPhrase = _describeBlockSource(c);
  const argSuffix = (cond && cond.arg && c.arg)
    ? _descT("desc.arg_suffix", c.arg, cond.arg)
    : "";

  const src = c.blockSource || (c.useGroup ? "group" : "single");
  if (src === "single") {
    return _descT("desc.cond.single", blockPhrase, condLbl) + argSuffix;
  }
  // group oder type → Aggregator dazwischen
  const aggPhrase = _describeAggregator(c);
  return _descT("desc.cond.multi", blockPhrase, aggPhrase, condLbl) + argSuffix;
}

// Aktions-Satz für einen einzelnen Eintrag.
function _describeAction(a) {
  const act = (typeof findAct === "function") ? findAct(a.blockType, a.actId) : null;
  const actLbl = act
    ? ((typeof localizedItemLabel === "function")
        ? localizedItemLabel(act, a.blockType, "actions")
        : act.label)
    : a.actId;
  const blockPhrase = _describeBlockSource(a);
  const argSuffix = (act && act.arg && a.arg)
    ? _descT("desc.arg_suffix", a.arg, act.arg)
    : "";

  const src = a.blockSource || (a.useGroup ? "group" : "single");
  if (src === "single") {
    return _descT("desc.act.single", blockPhrase, actLbl) + argSuffix;
  }
  return _descT("desc.act.multi", blockPhrase, actLbl) + argSuffix;
}

// Beschreibung des Execution-Mode in einem Satz.
function _describeExecMode(mode) {
  switch (mode) {
    case "argument":   return _descT("desc.exec.argument");
    case "timer100":   return _descT("desc.exec.timer100");
    case "timer10":    return _descT("desc.exec.timer10");
    case "timer1":     return _descT("desc.exec.timer1");
    case "continuous": return _descT("desc.exec.continuous");
    default:           return _descT("desc.exec.argument");
  }
}

// Hauptfunktion: liest den globalen state und liefert ein strukturiertes
// Beschreibungs-Objekt zurück. UI-Code rendert das zu HTML.
function describeConfig() {
  const validConds = (state.conditions || []).filter(c => {
    const src = c.blockSource || (c.useGroup ? "group" : "single");
    return src === "type" || (c.blockName && c.blockName.trim().length > 0);
  });
  const validThen = (state.actionsThen || []).filter(a => {
    const src = a.blockSource || (a.useGroup ? "group" : "single");
    return src === "type" || (a.blockName && a.blockName.trim().length > 0);
  });
  const validElse = (state.actionsElse || []).filter(a => {
    const src = a.blockSource || (a.useGroup ? "group" : "single");
    return src === "type" || (a.blockName && a.blockName.trim().length > 0);
  });

  const isEmpty = validConds.length === 0 && validThen.length === 0 && validElse.length === 0;

  // Condition-Satz: Verkettung mit UND/ODER. C#-Präzedenz „&& vor ||"
  // ist hier sprachlich kaum verständlich abbildbar, also einfach in
  // gelesener Reihenfolge mit Connector-Wörtern.
  let conditionLines = [];
  if (validConds.length > 0) {
    validConds.forEach((c, i) => {
      const sentence = _describeCondition(c);
      if (i === 0) {
        conditionLines.push(sentence);
      } else {
        const connector = (c.logicOp === "OR")
          ? _descT("desc.or").toUpperCase()
          : _descT("desc.and").toUpperCase();
        conditionLines.push(connector + " " + sentence);
      }
    });
  }

  const thenLines = validThen.map(_describeAction);
  const elseLines = validElse.map(_describeAction);

  return {
    isEmpty,
    execLine:        _describeExecMode(state.execMode),
    conditionLines:  conditionLines,
    hasConditions:   validConds.length > 0,
    thenLines:       thenLines,
    elseLines:       elseLines,
    autoRecover:     !!state.autoRecoverBlocks,
    coroutines:      !!state.useCoroutines
  };
}

// HTML-Renderer für die Erklärungs-Box.
// Ergebnis wird in #explanation-content gesetzt (innerHTML).
function renderExplanationHtml() {
  const d = describeConfig();
  if (d.isEmpty) {
    return `<p class="explanation-empty">${escapeHtml(_descT("desc.empty"))}</p>`;
  }
  let html = "";

  // Execution-Modus
  html += `<p class="explanation-exec">⚙ ${escapeHtml(d.execLine)}</p>`;

  // Bedingungen
  if (d.hasConditions) {
    html += `<p class="explanation-label">${escapeHtml(_descT("desc.label.if"))}</p>`;
    html += "<ul class=\"explanation-list explanation-list-if\">";
    for (const line of d.conditionLines) {
      html += `<li>${escapeHtml(line)}</li>`;
    }
    html += "</ul>";
  } else if (d.thenLines.length > 0) {
    html += `<p class="explanation-info">${escapeHtml(_descT("desc.no_conditions"))}</p>`;
  }

  // THEN-Aktionen
  if (d.thenLines.length > 0) {
    html += `<p class="explanation-label">${escapeHtml(_descT("desc.label.then"))}</p>`;
    html += "<ul class=\"explanation-list explanation-list-then\">";
    for (const line of d.thenLines) {
      html += `<li>${escapeHtml(line)}</li>`;
    }
    html += "</ul>";
  }

  // ELSE-Aktionen
  if (d.elseLines.length > 0) {
    html += `<p class="explanation-label">${escapeHtml(_descT("desc.label.else"))}</p>`;
    html += "<ul class=\"explanation-list explanation-list-else\">";
    for (const line of d.elseLines) {
      html += `<li>${escapeHtml(line)}</li>`;
    }
    html += "</ul>";
  }

  // Zusätzliche Hinweise (Coroutines, Auto-Recovery)
  const flags = [];
  if (d.coroutines)  flags.push(_descT("desc.flag.coroutines"));
  if (d.autoRecover) flags.push(_descT("desc.flag.auto_recover"));
  if (flags.length > 0) {
    html += `<p class="explanation-flags">${flags.map(escapeHtml).join(" • ")}</p>`;
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
    // Default: offen (true)
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
