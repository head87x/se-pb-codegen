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

  // Position & Größe (Manual ist jetzt der einzige Modus)
  html += `<div class="lcd-widget-group-title">Position & Größe</div>`;
  html += `<div class="lcd-widget-fields">`;
  html += _renderLcdSingleField({ key: "manualX", label: "X (px)",      type: "number" }, i, w.manualX);
  html += _renderLcdSingleField({ key: "manualY", label: "Y (px)",      type: "number" }, i, w.manualY);
  html += _renderLcdSingleField({ key: "manualW", label: "Breite (px)", type: "number" }, i, w.manualW);
  html += _renderLcdSingleField({ key: "manualH", label: "Höhe (px)",   type: "number" }, i, w.manualH);
  html += `</div>`;

  html += `<div class="lcd-widget-group-title">Hintergrund (optional)</div>`;
  html += `<div class="lcd-widget-fields">`;
  html += _renderLcdSingleField(
    { key: "widgetBg", label: "Hintergrundfarbe (R,G,B)", type: "text", hint: "leer = kein Hintergrund" },
    i,
    w.widgetBg
  );
  html += `</div>`;

  return html;
}

// Live-Vorschau: alle Widgets sind manuell positioniert (absolute
// LCD-Koordinaten im virtuellen Canvas). Bei Multi-LCD ist der Canvas
// cols × rows LCDs groß und Grid-Linien zeigen die LCD-Übergänge.
function _renderFullLcdPreview() {
  const widgets = state.lcdComposer.widgets;
  const resKey = state.lcdComposer.resolution || "square";
  const res = LCD_RESOLUTIONS[resKey] || LCD_RESOLUTIONS.square;

  const ml = state.lcdComposer.multiLcd || { enabled: false, rows: 1, cols: 1 };
  const multi = ml.enabled === true;
  const cols = multi ? Math.max(1, parseInt(ml.cols, 10) || 1) : 1;
  const rows = multi ? Math.max(1, parseInt(ml.rows, 10) || 1) : 1;

  // Virtueller Canvas (alle LCDs zusammen) in LCD-Pixeln.
  const virtW = res.w * cols;
  const virtH = res.h * rows;

  // Innere Anzeige-Breite skaliert mit Spaltenzahl, gecapped damit's
  // ins UI passt. Mehr Spalten → größerer Container, aber pro LCD
  // bleibt's noch lesbar.
  const BORDER = 3;
  const innerWidth = Math.min(720, Math.max(380, cols * 240));
  const innerHeight = Math.round(innerWidth * virtH / virtW);
  const scale = innerWidth / virtW;
  const outerWidth = innerWidth + 2 * BORDER;
  const outerHeight = innerHeight + 2 * BORDER;

  // LCD-Trennlinien-Overlay (nur Multi-LCD): vertikale + horizontale
  // Linien zwischen Cell-LCDs, plus pro-LCD-Name oben links.
  let lcdSepOverlay = "";
  let lcdNamesOverlay = "";
  if (multi) {
    const lines = [];
    for (let c = 1; c < cols; c++) {
      lines.push(`<div class="lcd-sep" style="left:${Math.round(c * res.w * scale)}px;top:0;width:1px;height:${innerHeight}px;"></div>`);
    }
    for (let r = 1; r < rows; r++) {
      lines.push(`<div class="lcd-sep" style="left:0;top:${Math.round(r * res.h * scale)}px;width:${innerWidth}px;height:1px;"></div>`);
    }
    lcdSepOverlay = lines.join("");

    // Namen-Labels in jedem LCD-Quadrat (oben links)
    const info = (typeof computeMultiLcdNames === "function") ? computeMultiLcdNames() : null;
    if (info) {
      lcdNamesOverlay = info.meta.map(m => {
        const left = Math.round(m.col * res.w * scale) + 4;
        const top  = Math.round(m.row * res.h * scale) + 4;
        return `<div class="lcd-name-tag" style="left:${left}px;top:${top}px;">${escapeHtml(m.name)}</div>`;
      }).join("");
    }
  }

  const headerLabel = multi
    ? `LIVE-VORSCHAU — ${cols}×${rows} ${escapeHtml(res.label)} · Snap ${LCD_SNAP}px`
    : `LIVE-VORSCHAU — ${escapeHtml(res.label)}${widgets.length > 0 ? ` · Snap ${LCD_SNAP}px` : ""}`;

  if (widgets.length === 0) {
    return `
      <div class="lcd-full-preview-wrap">
        <div class="lcd-full-preview-label">${headerLabel}</div>
        <div class="lcd-full-preview" style="width:${outerWidth}px;height:${outerHeight}px;position:relative;">
          ${lcdSepOverlay}
          ${lcdNamesOverlay}
          <div class="lcd-full-empty">— Display ist leer —</div>
        </div>
      </div>`;
  }

  const visibleWidgets = widgets
    .map((w, idx) => ({ w, idx }))
    .filter(o => !o.w.hidden);

  const items = visibleWidgets.map(({ w, idx }) => {
    const mx = Math.max(0, parseFloat(w.manualX) || 0);
    const my = Math.max(0, parseFloat(w.manualY) || 0);
    const mw = Math.max(8, parseFloat(w.manualW) || 100);
    const mh = Math.max(8, parseFloat(w.manualH) || 40);
    const left = Math.round(mx * scale);
    const top  = Math.round(my * scale);
    const wPx  = Math.round(mw * scale);
    const hPx  = Math.round(mh * scale);
    return `<div class="lcd-full-cell lcd-cell-manual" data-widget-idx="${idx}" style="left:${left}px;top:${top}px;width:${wPx}px;height:${hPx}px;">${renderLcdWidgetPreview(w)}<div class="lcd-cell-resize" data-widget-idx="${idx}"></div></div>`;
  }).join("");

  const snapPx = (LCD_SNAP * scale).toFixed(3);
  const gridOverlay = `<div class="lcd-grid-overlay" style="background-size:${snapPx}px ${snapPx}px;"></div>`;

  return `
    <div class="lcd-full-preview-wrap">
      <div class="lcd-full-preview-label">${headerLabel}</div>
      <div class="lcd-full-preview" style="width:${outerWidth}px;height:${outerHeight}px;position:relative;">
        ${gridOverlay}
        ${lcdSepOverlay}
        ${lcdNamesOverlay}
        ${items}
      </div>
    </div>`;
}

function renderLcdComposer() {
  const root = document.getElementById("lcd-composer-list");
  if (!root) return;

  // Sichtbarkeit der bedingten Felder je nach displayMode
  const mode = state.lcdComposer.displayMode || "external";
  const nameWrap    = document.getElementById("lcd-composer-name-wrap");
  const surfaceWrap = document.getElementById("lcd-composer-surface-wrap");
  if (nameWrap)    nameWrap.style.display    = (mode === "pb") ? "none" : "";
  if (surfaceWrap) surfaceWrap.style.display = (mode === "external") ? "none" : "";

  // Multi-LCD: nur bei "external"-Modus aktivierbar
  const multiWrap   = document.getElementById("lcd-multi-wrap");
  const multiConfig = document.getElementById("lcd-multi-config");
  const multiEnable = document.getElementById("lcd-multi-enable");
  const ml = state.lcdComposer.multiLcd || { enabled: false, rows: 1, cols: 2, namePattern: "LCD {col}{row}" };
  if (multiWrap)   multiWrap.style.display   = (mode === "external") ? "" : "none";
  if (multiEnable) multiEnable.checked       = (mode === "external") && !!ml.enabled;
  if (multiConfig) multiConfig.style.display = (mode === "external" && ml.enabled) ? "block" : "none";
  // Felder mit State synchronisieren (ohne Re-Render der Inputs, sonst Fokus-Verlust)
  const colsInp    = document.getElementById("lcd-multi-cols");
  const rowsInp    = document.getElementById("lcd-multi-rows");
  const patternInp = document.getElementById("lcd-multi-pattern");
  if (colsInp    && document.activeElement !== colsInp)    colsInp.value    = ml.cols;
  if (rowsInp    && document.activeElement !== rowsInp)    rowsInp.value    = ml.rows;
  if (patternInp && document.activeElement !== patternInp) patternInp.value = ml.namePattern || "LCD {col}{row}";
  // Namen-Vorschau aktualisieren
  const namesPrev = document.getElementById("lcd-multi-names-preview");
  if (namesPrev && mode === "external" && ml.enabled) {
    const info = (typeof computeMultiLcdNames === "function") ? computeMultiLcdNames() : { names: [] };
    const sample = info.names.slice(0, 12).join(" · ");
    const extra = info.names.length > 12 ? ` · …(+${info.names.length - 12})` : "";
    namesPrev.innerHTML = `LCD-Namen: ${escapeHtml(sample)}${escapeHtml(extra)}`;
  } else if (namesPrev) {
    namesPrev.innerHTML = "";
  }

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
  // Live-Vorschau des ganzen Displays
  const fullPreview = _renderFullLcdPreview();

  // Layer-Liste (Phase B.1)
  const layerList = _renderLcdLayerList(widgets);

  if (widgets.length === 0) {
    root.innerHTML = `
      ${themeBar}
      ${fullPreview}
      <div class="btn-row" style="margin-bottom:10px;">${addButtons}</div>
      <span class="empty-hint">Noch keine Widgets. Klick einen Button oben.</span>`;
    return;
  }

  root.innerHTML = `
    ${themeBar}
    ${fullPreview}
    ${layerList}
    <div class="btn-row" style="margin-bottom:10px;">${addButtons}</div>
    ${widgets.map((w, i) => {
      const def = LCD_WIDGETS[w.type] || { label: w.type };
      const isExpanded = !!w.expanded;
      const isHidden = !!w.hidden;
      const label = w.label || w.text || w.title || "";
      return `
        <div class="lcd-widget-block ${isExpanded ? "expanded" : "collapsed"}" data-widget-idx="${i}">
          <div class="lcd-widget-header" onclick="toggleLcdWidgetExpanded(${i})">
            <span><span class="lcd-collapse-arrow">${isExpanded ? "▼" : "▶"}</span> #${i + 1} ${escapeHtml(def.label)}${label ? ` — ${escapeHtml(String(label).slice(0,20))}` : ""}${isHidden ? " (unsichtbar)" : ""}</span>
            <div class="btn-row" onclick="event.stopPropagation()">
              <button class="small" title="${isHidden ? 'Einblenden' : 'Ausblenden'}" onclick="toggleLcdWidgetVisible(${i})">${isHidden ? "⌀" : "👁"}</button>
              <button class="small" onclick="moveLcdWidget(${i}, -1)" ${i === 0 ? "disabled" : ""}>▲</button>
              <button class="small" onclick="moveLcdWidget(${i}, 1)" ${i === widgets.length - 1 ? "disabled" : ""}>▼</button>
              <button class="small danger" onclick="removeLcdWidget(${i})">✕</button>
            </div>
          </div>
          ${isExpanded ? `
          <div class="lcd-widget-body">
            <div class="lcd-widget-preview" id="lcd-widget-preview-${i}">${renderLcdWidgetPreview(w)}</div>
            ${_renderLcdWidgetFields(w, i)}
          </div>` : ""}
        </div>`;
    }).join("")}
  `;
}

// Kompakte Layer-Liste mit Sichtbarkeits-Toggle und Klick-to-Select
function _renderLcdLayerList(widgets) {
  if (widgets.length === 0) return "";
  const rows = widgets.map((w, i) => {
    const def = LCD_WIDGETS[w.type] || { label: w.type };
    const label = w.label || w.text || w.title || "";
    const hiddenIcon = w.hidden ? "⌀" : "👁";
    return `
      <div class="lcd-layer-row ${w.hidden ? "is-hidden" : ""}">
        <button class="lcd-layer-eye" title="${w.hidden ? 'Einblenden' : 'Ausblenden'}" onclick="toggleLcdWidgetVisible(${i})">${hiddenIcon}</button>
        <button class="lcd-layer-name" onclick="selectLcdWidget(${i})">#${i + 1} ${escapeHtml(def.label)}${label ? ` — ${escapeHtml(String(label).slice(0,18))}` : ""}</button>
      </div>`;
  }).join("");
  return `
    <div class="lcd-layer-list">
      <div class="lcd-layer-title">EBENEN (${widgets.length})</div>
      ${rows}
    </div>`;
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
