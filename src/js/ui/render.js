// ============================================================
// UI RENDERING (Conditions, Actions, Help-Text, Master-render)
// ============================================================

// Helper: rendert ein einzelnes Argument-Input. argType kann sein:
//   "subtype" → Text-Input mit list="se-subtypes-list" (Autovorschläge)
//   "number"  → number-Input
//   sonst     → Text-Input
function _argField(handler, value, argType, hint) {
  const safeVal = escapeAttr(value || "");
  const placeholder = hint ? ` placeholder="${escapeAttr(hint)}"` : "";
  if (argType === "subtype") {
    return `<input type="text" list="se-subtypes-list" value="${safeVal}" oninput="${handler}"${placeholder}>`;
  }
  if (argType === "number") {
    return `<input type="number" step="any" value="${safeVal}" oninput="${handler}"${placeholder}>`;
  }
  return `<input type="text" value="${safeVal}" oninput="${handler}"${placeholder}>`;
}

function renderConditions() {
  const root = document.getElementById("conditions");
  if (state.conditions.length === 0) {
    root.innerHTML = '<span class="empty-hint">Keine Bedingungen — Aktion läuft immer.</span>';
    return;
  }
  root.innerHTML = state.conditions.map((c, i) => {
    const cond = findCond(c.blockType, c.condId);
    const needsArg  = cond && cond.arg;
    const needsArg2 = cond && cond.arg2;
    const logicSelect = i > 0 ? `
      <div class="logic-op">
        <select onchange="updateCond(${i}, 'logicOp', this.value)">
          <option value="AND" ${c.logicOp === "AND" ? "selected" : ""}>UND</option>
          <option value="OR" ${c.logicOp === "OR" ? "selected" : ""}>ODER</option>
        </select>
      </div>` : "";
    const rowClass = (needsArg && needsArg2) ? "row-3" : (needsArg ? "row-2" : "");
    const argHtml  = needsArg ? `
          <div>
            <label>${escapeHtml(cond.arg)}</label>
            ${_argField(`updateCond(${i}, 'arg', this.value)`, c.arg, cond.argType, cond.arg)}
          </div>` : "";
    const arg2Html = needsArg2 ? `
          <div>
            <label>${escapeHtml(cond.arg2)}</label>
            ${_argField(`updateCond(${i}, 'arg2', this.value)`, c.arg2, cond.arg2Type, cond.arg2)}
          </div>` : "";
    return `
      ${logicSelect}
      <div class="condition-block">
        <div class="cond-header">
          <span>BEDINGUNG #${i + 1}</span>
          <button class="small danger" onclick="removeCond(${i})">✕ Entfernen</button>
        </div>
        <div class="row row-2">
          <div>
            <label>Block-Typ</label>
            <select onchange="updateCond(${i}, 'blockType', this.value)">${blockTypeOptions('conditions')}</select>
          </div>
          <div>
            <label>Block-Name (im Spiel)</label>
            <input value="${escapeAttr(c.blockName)}" oninput="updateCond(${i}, 'blockName', this.value)" placeholder="exakter Name aus Terminal">
          </div>
        </div>
        <div class="row ${rowClass}">
          <div>
            <label>Prüfung ${tooltipBadge(c.blockType, c.condId, 'conditions')}</label>
            <select onchange="updateCond(${i}, 'condId', this.value)">${condOptions(c.blockType)}</select>
          </div>
          ${argHtml}${arg2Html}
        </div>
      </div>
    `;
  }).join("");

  // Restore <select> values that depend on options (set after innerHTML write).
  state.conditions.forEach((c, i) => {
    const blocks = root.querySelectorAll(".condition-block");
    const blk = blocks[i];
    if (!blk) return;
    const selects = blk.querySelectorAll("select");
    if (selects[0]) selects[0].value = c.blockType;
    if (selects[1]) selects[1].value = c.condId;
  });
}

function renderActions(which) {
  const list = which === "then" ? state.actionsThen : state.actionsElse;
  const root = document.getElementById(`actions-${which}`);
  if (list.length === 0) {
    root.innerHTML = `<span class="empty-hint">${which === "then" ? "Noch keine Aktionen." : "Keine SONST-Aktionen."}</span>`;
    return;
  }
  root.innerHTML = list.map((a, i) => {
    const act = findAct(a.blockType, a.actId);
    const needsArg  = act && act.arg;
    const needsArg2 = act && act.arg2;
    const rowClass = (needsArg && needsArg2) ? "row-3" : (needsArg ? "row-2" : "");
    const argHtml  = needsArg ? `
          <div>
            <label>${escapeHtml(act.arg)}</label>
            ${_argField(`updateAct('${which}', ${i}, 'arg', this.value)`, a.arg, act.argType, act.arg)}
          </div>` : "";
    const arg2Html = needsArg2 ? `
          <div>
            <label>${escapeHtml(act.arg2)}</label>
            ${_argField(`updateAct('${which}', ${i}, 'arg2', this.value)`, a.arg2, act.arg2Type, act.arg2)}
          </div>` : "";
    return `
      <div class="action-block ${which === "else" ? "else-block" : ""}">
        <div class="act-header">
          <span>AKTION #${i + 1}</span>
          <button class="small danger" onclick="removeAct('${which}', ${i})">✕ Entfernen</button>
        </div>
        <div class="row row-2">
          <div>
            <label>Block-Typ</label>
            <select onchange="updateAct('${which}', ${i}, 'blockType', this.value)">${blockTypeOptions('actions')}</select>
          </div>
          <div>
            <label>Block-Name</label>
            <input value="${escapeAttr(a.blockName)}" oninput="updateAct('${which}', ${i}, 'blockName', this.value)" placeholder="exakter Name aus Terminal">
          </div>
        </div>
        <div class="row ${rowClass}">
          <div>
            <label>Aktion ${tooltipBadge(a.blockType, a.actId, 'actions')}</label>
            <select onchange="updateAct('${which}', ${i}, 'actId', this.value)">${actOptions(a.blockType)}</select>
          </div>
          ${argHtml}${arg2Html}
        </div>
      </div>
    `;
  }).join("");
  // restore selects
  list.forEach((a, i) => {
    const blocks = root.querySelectorAll(".action-block");
    const blk = blocks[i];
    if (!blk) return;
    const selects = blk.querySelectorAll("select");
    if (selects[0]) selects[0].value = a.blockType;
    if (selects[1]) selects[1].value = a.actId;
  });
}

function renderExecHelp() {
  const help = {
    argument: "Aktion läuft nur, wenn der PB manuell ausgeführt wird (z.B. Knopf, Sensor-Aktion, Timer-Block).",
    continuous: "Aktion läuft jeden Game-Tick (~60×/Sek). Vorsicht: kann Performance kosten.",
    timer1:   "Aktion läuft ca. 1× pro Sekunde (Update1).",
    timer10:  "Aktion läuft alle 10 Ticks (~6×/Sek).",
    timer100: "Aktion läuft alle 100 Ticks (~0.6×/Sek)."
  };
  document.getElementById("exec-help").textContent = help[state.execMode];
}

// Master render — wird bei strukturellen Änderungen aufgerufen
// (Block hinzufügen/entfernen, Block-Typ wechseln, Vorlage laden).
// Bei reinen Werteänderungen (Tippen, Checkbox-Toggle) wird
// stattdessen direkt generateCode() aufgerufen — der Fokus
// auf Eingabefeldern bleibt dadurch erhalten.
function render() {
  renderConditions();
  renderActions("then");
  renderActions("else");
  renderTemplates();
  renderExecHelp();
  generateCode();
}

// ============================================================
// PALETTE (Phase 3 — Drag & Drop Block-Bibliothek)
// ============================================================
// Wird einmalig beim Init aufgerufen (renderPalette + initDropTargets).
// Die Palette ist statisch — sie ändert sich nicht durch User-Aktionen.

function renderPalette() {
  const root = document.getElementById("palette-list");
  if (!root) return;

  // Gruppiere alle Block-Typen nach Kategorie
  const byCat = {};
  for (const blockType of Object.keys(BLOCKS)) {
    const cat = BLOCKS[blockType].category || "Sonstiges";
    (byCat[cat] = byCat[cat] || []).push(blockType);
  }

  // Reihenfolge: erst CATEGORIES, dann alphabetisch unbekannte
  const orderedCats = [
    ...CATEGORIES.filter(c => byCat[c]),
    ...Object.keys(byCat).filter(c => !CATEGORIES.includes(c)).sort()
  ];

  root.innerHTML = orderedCats.map(cat => {
    const cards = byCat[cat].map(blockType => `
      <div class="palette-card" data-block-type="${escapeAttr(blockType)}" data-block-name="${escapeAttr(blockType.toLowerCase())}">
        <span class="icon">${getCategoryIcon(cat)}</span>
        <span class="name">${escapeHtml(blockType)}</span>
      </div>
    `).join("");
    return `
      <div class="palette-category" data-category="${escapeAttr(cat)}">
        <div class="palette-cat-header" onclick="togglePaletteCategory(this)">
          <span>${escapeHtml(cat)} <span style="color:var(--muted)">(${byCat[cat].length})</span></span>
          <span class="toggle-arrow">▼</span>
        </div>
        <div class="palette-cat-body">${cards}</div>
      </div>
    `;
  }).join("");

  // Drag-Handler auf jede Karte setzen
  root.querySelectorAll(".palette-card").forEach(card => {
    makePaletteCardDraggable(card, card.dataset.blockType);
  });
}

function togglePaletteCategory(headerEl) {
  headerEl.parentElement.classList.toggle("collapsed");
}

// Live-Filter: blendet Karten + Kategorien ohne Treffer aus.
function filterPalette(query) {
  const q = (query || "").trim().toLowerCase();
  const cats = document.querySelectorAll(".palette-category");
  cats.forEach(cat => {
    let anyVisible = false;
    cat.querySelectorAll(".palette-card").forEach(card => {
      const match = !q || card.dataset.blockName.includes(q);
      card.style.display = match ? "" : "none";
      if (match) anyVisible = true;
    });
    cat.style.display = anyVisible ? "" : "none";
    // Bei aktiver Suche: alle Treffer-Kategorien aufklappen
    if (q && anyVisible) cat.classList.remove("collapsed");
  });
}

// Einmaliger Init am Ende des Dokuments
function initPalette() {
  renderPalette();
  initDropTargets();
}
