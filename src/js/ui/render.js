// ============================================================
// UI RENDERING (Conditions, Actions, Help-Text, Master-render)
// ============================================================

// Helper: rendert ein einzelnes Argument-Eingabefeld.
// mutator: Beschreibung des State-Mutators, z. B.
//   { kind: "cond", i: 0, field: "arg" }
//   { kind: "act",  which: "then", i: 0, field: "arg" }
// argType: "subtype" → styled <select> + ggf. Custom-Textfeld
//          "number"  → Number-Input
//          sonst     → Text-Input
function _mutatorCall(m, withRender) {
  const suffix = withRender ? "AndRender" : "";
  if (m.kind === "cond") return `updateCond${suffix}(${m.i}, '${m.field}', this.value)`;
  return `updateAct${suffix}('${m.which}', ${m.i}, '${m.field}', this.value)`;
}

function _argField(mutator, value, argType, hint) {
  const safeVal = escapeAttr(value || "");
  const placeholder = hint ? ` placeholder="${escapeAttr(hint)}"` : "";

  if (argType === "subtype") {
    // Dropdown-Wert bestimmen: bei Standard-Subtype → der Wert selbst.
    // Bei unbekanntem Wert oder explizitem "_custom" → "_custom"-Option.
    const isStandard = isKnownSubtype(value);
    const showCustomField = value === "_custom" || (value && !isStandard);
    const dropdownVal = isStandard ? value : (value ? "_custom" : "");
    const selectHandler = _mutatorCall(mutator, true);   // immer render
    const textHandler   = _mutatorCall(mutator, false);  // kein render (Fokus halten)
    const textVal = (value === "_custom" ? "" : safeVal);
    const customInput = showCustomField
      ? `<input type="text" value="${textVal}" oninput="${textHandler}" placeholder="Custom Subtype-ID" style="margin-top:4px;">`
      : "";
    return `<select onchange="${selectHandler}">${subtypeOptions(dropdownVal)}</select>${customInput}`;
  }

  const oninput = _mutatorCall(mutator, false);
  if (argType === "number") {
    return `<input type="number" step="any" value="${safeVal}" oninput="${oninput}"${placeholder}>`;
  }
  return `<input type="text" value="${safeVal}" oninput="${oninput}"${placeholder}>`;
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
            ${_argField({kind:"cond", i, field:"arg"},  c.arg,  cond.argType,  cond.arg)}
          </div>` : "";
    const arg2Html = needsArg2 ? `
          <div>
            <label>${escapeHtml(cond.arg2)}</label>
            ${_argField({kind:"cond", i, field:"arg2"}, c.arg2, cond.arg2Type, cond.arg2)}
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
            ${_argField({kind:"act", which, i, field:"arg"},  a.arg,  act.argType,  act.arg)}
          </div>` : "";
    const arg2Html = needsArg2 ? `
          <div>
            <label>${escapeHtml(act.arg2)}</label>
            ${_argField({kind:"act", which, i, field:"arg2"}, a.arg2, act.arg2Type, act.arg2)}
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
  renderLcdComposer();
  generateCode();
}

// ============================================================
// LCD-COMPOSER (Phase 4a)
// ============================================================

function _renderLcdSingleField(f, i, val) {
  if (f.type === "lcd-source") {
    const opts = LCD_SOURCES.map(s =>
      `<option value="${s.value}"${s.value === val ? " selected" : ""}>${escapeHtml(s.label)}</option>`
    ).join("");
    return `
      <div>
        <label>${escapeHtml(f.label)}</label>
        <select onchange="updateLcdWidgetAndRender(${i}, '${f.key}', this.value)">${opts}</select>
      </div>`;
  }
  if (f.type === "lcd-bool") {
    const opts = LCD_BOOL_SOURCES.map(s =>
      `<option value="${s.value}"${s.value === val ? " selected" : ""}>${escapeHtml(s.label)}</option>`
    ).join("");
    return `
      <div>
        <label>${escapeHtml(f.label)}</label>
        <select onchange="updateLcdWidgetAndRender(${i}, '${f.key}', this.value)">${opts}</select>
      </div>`;
  }
  if (f.type === "select") {
    const opts = f.options.map(o =>
      `<option value="${o.value}"${o.value === val ? " selected" : ""}>${escapeHtml(o.label)}</option>`
    ).join("");
    return `
      <div>
        <label>${escapeHtml(f.label)}</label>
        <select onchange="updateLcdWidgetAndRender(${i}, '${f.key}', this.value)">${opts}</select>
      </div>`;
  }
  const inputType = f.type === "number" ? "number" : "text";
  const placeholder = f.hint ? ` placeholder="${escapeAttr(f.hint)}"` : "";
  const step = f.type === "number" ? ' step="any"' : "";
  return `
    <div>
      <label>${escapeHtml(f.label)}</label>
      <input type="${inputType}"${step} value="${escapeAttr(val)}" oninput="updateLcdWidget(${i}, '${f.key}', this.value)"${placeholder}>
    </div>`;
}

function _renderLcdWidgetFields(w, i) {
  const def = LCD_WIDGETS[w.type];
  if (!def) return "";

  // Felder nach 'group' sortieren — Felder ohne group kommen oben (Default-Gruppe).
  const groups = new Map();
  const noGroup = [];
  for (const f of def.fields) {
    if (f.group) {
      if (!groups.has(f.group)) groups.set(f.group, []);
      groups.get(f.group).push(f);
    } else {
      noGroup.push(f);
    }
  }

  let html = "";
  if (noGroup.length > 0) {
    html += `<div class="lcd-widget-fields">${noGroup.map(f => _renderLcdSingleField(f, i, w[f.key])).join("")}</div>`;
  }
  for (const [groupName, fields] of groups) {
    html += `<div class="lcd-widget-group-title">${escapeHtml(groupName)}</div>`;
    html += `<div class="lcd-widget-fields">${fields.map(f => _renderLcdSingleField(f, i, w[f.key])).join("")}</div>`;
  }
  return html;
}

function renderLcdComposer() {
  const root = document.getElementById("lcd-composer-list");
  if (!root) return;

  // Header-Bereich: Add-Buttons
  const addButtons = LCD_WIDGET_ORDER.map(type => {
    const def = LCD_WIDGETS[type];
    return `<button class="small" onclick="addLcdWidget('${type}')">+ ${escapeHtml(def.label)}</button>`;
  }).join("");

  // Theme-Buttons (Phase 4c)
  const themeButtons = LCD_THEME_ORDER.map(key => {
    const t = LCD_THEMES[key];
    const accent = t.accent.split(",").map(s => s.trim()).join(",");
    const isActive = state.lcdComposer.theme === key ? " primary" : "";
    return `<button class="small${isActive}" style="border-left:3px solid rgb(${accent})" onclick="applyLcdTheme('${key}')">${escapeHtml(t.label)}</button>`;
  }).join("");

  const themeBar = `
    <div class="lcd-theme-bar">
      <span class="lcd-theme-label">Theme:</span>
      <div class="btn-row">${themeButtons}</div>
    </div>`;

  const widgets = state.lcdComposer.widgets;
  if (widgets.length === 0) {
    root.innerHTML = `
      ${themeBar}
      <div class="btn-row" style="margin-bottom:10px;">${addButtons}</div>
      <span class="empty-hint">Noch keine Widgets. Klick einen Button oben.</span>`;
    return;
  }

  root.innerHTML = `
    ${themeBar}
    <div class="btn-row" style="margin-bottom:10px;">${addButtons}</div>
    ${widgets.map((w, i) => {
      const def = LCD_WIDGETS[w.type] || { label: w.type };
      return `
        <div class="lcd-widget-block">
          <div class="lcd-widget-header">
            <span>WIDGET #${i + 1} — ${escapeHtml(def.label)}</span>
            <div class="btn-row">
              <button class="small" onclick="moveLcdWidget(${i}, -1)" ${i === 0 ? "disabled" : ""}>▲</button>
              <button class="small" onclick="moveLcdWidget(${i}, 1)" ${i === widgets.length - 1 ? "disabled" : ""}>▼</button>
              <button class="small danger" onclick="removeLcdWidget(${i})">✕</button>
            </div>
          </div>
          <div class="lcd-widget-preview" id="lcd-widget-preview-${i}">${renderLcdWidgetPreview(w)}</div>
          ${_renderLcdWidgetFields(w, i)}
        </div>`;
    }).join("")}
  `;
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
