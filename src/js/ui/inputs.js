// ============================================================
// INPUT HANDLERS (Mutationen + Fokus-Fix)
// ============================================================
// Kernprinzip: zwischen "Werteänderung" und "Strukturänderung"
// unterscheiden.
//
//  - Werteänderung (z. B. Block-Name tippen): NUR State updaten
//    und generateCode() neu laufen lassen — KEIN render().
//    → Eingabefeld behält den Fokus, Live-Preview bleibt flüssig.
//
//  - Strukturänderung (z. B. Block-Typ wechseln, Bedingung
//    hinzufügen): render() ruft innerHTML auf, Fokus ist bei
//    diesen Aktionen ohnehin nicht relevant.

// ---------- Conditions ----------

function addCondition() {
  const firstType = Object.keys(BLOCKS).find(k => (BLOCKS[k].conditions || []).length > 0);
  if (!firstType) return; // sollte nie passieren — Katalog hat immer Conditions
  addConditionOfType(firstType);
}

// Wird vom Drop-Handler genutzt: Bedingung mit konkretem Block-Typ anlegen.
function addConditionOfType(blockType) {
  const def = BLOCKS[blockType];
  if (!def || (def.conditions || []).length === 0) return;
  currentRuleSet().conditions.push({
    blockType,
    blockName: "",
    condId: def.conditions[0].id,
    arg: "",
    arg2: "",
    logicOp: "AND",
    // v3.0.0 — Block-Source-Modus: single | group | type
    blockSource: "single",
    sameConstruct: true,         // nur bei blockSource === "type"
    // Aggregator (nur bei group/type): any | all | count | sum | avg | min | max
    aggregateMode: "any",
    aggregateThreshold: 1,
    aggregateOp: ">=",           // ">" | "<" | ">=" | "<=" | "==" | "!="
    // v4.3.0 — Operator-Klammern für komplexe AND/OR-Logik (Expert-Mode)
    openParens: 0,               // Anzahl "(" vor dieser Bedingung
    closeParens: 0,              // Anzahl ")" nach dieser Bedingung
    // Backwards-Compat-Felder (gelesen wenn vorhanden, aber nicht mehr neu gesetzt):
    useGroup: false,
    groupSemantic: "any",
    groupCount: 1
  });
  render();
}

function removeCond(i) {
  currentRuleSet().conditions.splice(i, 1);
  render();
}

function updateCond(i, field, val) {
  currentRuleSet().conditions[i][field] = val;

  if (field === "blockType") {
    // Wechsel des Block-Typs → andere Conditions verfügbar → Strukturwechsel
    currentRuleSet().conditions[i].condId = BLOCKS[val].conditions[0]?.id || "";
    currentRuleSet().conditions[i].arg = "";
    currentRuleSet().conditions[i].arg2 = "";
    render();
    return;
  }
  if (field === "condId") {
    // Andere Condition → Argument-Felder können erscheinen/verschwinden
    currentRuleSet().conditions[i].arg = "";
    currentRuleSet().conditions[i].arg2 = "";
    render();
    return;
  }
  if (field === "useGroup") {
    // Backwards-Compat: alte Vorlagen können noch direkten useGroup-Schalter haben.
    currentRuleSet().conditions[i].useGroup = !!val;
    currentRuleSet().conditions[i].blockSource = val ? "group" : "single";
    render();
    return;
  }
  if (field === "groupSemantic") {
    // Backwards-Compat — mappt auf aggregateMode
    currentRuleSet().conditions[i].groupSemantic = val || "any";
    currentRuleSet().conditions[i].aggregateMode = val || "any";
    render();
    return;
  }
  if (field === "groupCount") {
    const n = parseInt(val, 10);
    const clamped = isNaN(n) ? 1 : Math.max(1, n);
    currentRuleSet().conditions[i].groupCount = clamped;
    currentRuleSet().conditions[i].aggregateThreshold = clamped;
    generateCode();
    return;
  }
  // v3.0.0 — neue Felder
  if (field === "blockSource") {
    // single | group | type — Strukturwechsel: Label + Felder
    currentRuleSet().conditions[i].blockSource = val || "single";
    // useGroup synchronisieren für Backwards-Compat im Codegen
    currentRuleSet().conditions[i].useGroup = (val === "group");
    render();
    return;
  }
  if (field === "sameConstruct") {
    currentRuleSet().conditions[i].sameConstruct = !!val;
    generateCode();
    return;
  }
  if (field === "aggregateMode") {
    // Strukturwechsel: sum/avg/min/max blendet Threshold+Op ein
    currentRuleSet().conditions[i].aggregateMode = val || "any";
    currentRuleSet().conditions[i].groupSemantic = val || "any";  // sync
    render();
    return;
  }
  if (field === "aggregateThreshold") {
    const n = parseFloat(val);
    currentRuleSet().conditions[i].aggregateThreshold = isNaN(n) ? 0 : n;
    currentRuleSet().conditions[i].groupCount = isNaN(n) ? 1 : Math.max(1, Math.round(n));  // sync
    generateCode();
    return;
  }
  if (field === "aggregateOp") {
    currentRuleSet().conditions[i].aggregateOp = val || ">=";
    generateCode();
    return;
  }
  // blockName, arg, arg2, logicOp: reine Werteänderung, kein Re-Render
  generateCode();
}

// ---------- Actions ----------

function addAction(which) {
  const firstType = Object.keys(BLOCKS).find(k => (BLOCKS[k].actions || []).length > 0);
  if (!firstType) return;
  addActionOfType(which, firstType);
}

// Wird vom Drop-Handler genutzt: Aktion mit konkretem Block-Typ anlegen.
function addActionOfType(which, blockType) {
  const def = BLOCKS[blockType];
  if (!def || (def.actions || []).length === 0) return;
  const list = which === "then" ? currentRuleSet().actionsThen : currentRuleSet().actionsElse;
  list.push({
    blockType,
    blockName: "",
    actId: def.actions[0].id,
    arg: "",
    arg2: "",
    // v3.0.0 — gleicher Block-Source-Modus wie Conditions
    blockSource: "single",   // single | group | type
    sameConstruct: true,
    // Bei Actions kein Aggregator — foreach wird automatisch genutzt bei group/type
    useGroup: false           // Backwards-Compat
  });
  render();
}

function removeAct(which, i) {
  const list = which === "then" ? currentRuleSet().actionsThen : currentRuleSet().actionsElse;
  list.splice(i, 1);
  render();
}

function updateAct(which, i, field, val) {
  const list = which === "then" ? currentRuleSet().actionsThen : currentRuleSet().actionsElse;
  list[i][field] = val;

  if (field === "blockType") {
    list[i].actId = BLOCKS[val].actions[0]?.id || "";
    list[i].arg = "";
    list[i].arg2 = "";
    render();
    return;
  }
  if (field === "actId") {
    list[i].arg = "";
    list[i].arg2 = "";
    render();
    return;
  }
  if (field === "useGroup") {
    list[i].useGroup = !!val;
    list[i].blockSource = val ? "group" : "single";
    render();
    return;
  }
  // v3.0.0 — gleicher Block-Source-Switch wie bei Conditions
  if (field === "blockSource") {
    list[i].blockSource = val || "single";
    list[i].useGroup = (val === "group");
    render();
    return;
  }
  if (field === "sameConstruct") {
    list[i].sameConstruct = !!val;
    generateCode();
    return;
  }
  // blockName, arg, arg2: reine Werteänderung
  generateCode();
}

// ---------- Statische UI-Inputs (Header-Bereich) ----------

function onUseCoroutinesChange(checked) {
  state.useCoroutines = !!checked;
  render();   // Chunk-Slider erscheint/verschwindet
}

function onAutoRecoverChange(checked) {
  state.autoRecoverBlocks = !!checked;
  generateCode();
}

// v4.3.0 — Chunk-Größe und Refresh-Intervall-Slider
function onCoroutineChunkSizeChange(val) {
  const n = parseInt(val, 10);
  state.coroutineChunkSize = isNaN(n) ? 50 : Math.max(1, Math.min(1000, n));
  generateCode();
}
function onAggRefreshIntervalChange(val) {
  const n = parseInt(val, 10);
  state.aggRefreshInterval = isNaN(n) ? 1 : Math.max(1, Math.min(1000, n));
  generateCode();
}

// v4.3.0 — Klammern in Conditions (Expert-Mode)
function adjustCondParens(i, side, delta) {
  const c = currentRuleSet().conditions[i];
  if (!c) return;
  if (side === "open") {
    c.openParens = Math.max(0, (parseInt(c.openParens, 10) || 0) + delta);
  } else {
    c.closeParens = Math.max(0, (parseInt(c.closeParens, 10) || 0) + delta);
  }
  render();
}

function onExecModeChange(val) {
  state.execMode = val;
  renderExecHelp();
  generateCode();
}

function onLcdEnableChange(checked) {
  state.lcdEnable = checked;
  document.getElementById("lcd-config").style.display = checked ? "block" : "none";
  generateCode();
}

// v2.8.0 — Workshop-Metadaten (Skript-Info)
function onScriptInfoEnable(checked) {
  if (!state.scriptInfo) state.scriptInfo = { enabled: false, name: "", author: "", version: "", description: "", tags: "" };
  state.scriptInfo.enabled = !!checked;
  const wrap = document.getElementById("info-fields");
  if (wrap) wrap.style.display = checked ? "block" : "none";
  generateCode();
}

function onScriptInfoField(field, val) {
  if (!state.scriptInfo) state.scriptInfo = { enabled: false, name: "", author: "", version: "", description: "", tags: "" };
  state.scriptInfo[field] = val;
  generateCode();
}

function onLcdNameInput(val) {
  state.lcdName = val;
  const el = document.getElementById("lcd-name");
  if (typeof _refreshBlockNameValidation === "function") _refreshBlockNameValidation(el);
  generateCode();
}

// Varianten von updateCond/updateAct, die IMMER ein vollständiges
// render() auslösen — für Auswahl-Dropdowns wie das Subtype-Select,
// damit das Custom-Mode-Text-Feld dynamisch erscheinen/verschwinden
// kann. Beim Tippen im Text-Feld nicht verwenden (Fokus-Verlust).
function updateCondAndRender(i, field, val) {
  currentRuleSet().conditions[i][field] = val;
  render();
}
function updateActAndRender(which, i, field, val) {
  const list = which === "then" ? currentRuleSet().actionsThen : currentRuleSet().actionsElse;
  list[i][field] = val;
  render();
}

// ---------- LCD-Composer ----------

function onLcdComposerEnable(checked) {
  state.lcdComposer.enabled = checked;
  document.getElementById("lcd-composer-config").style.display = checked ? "block" : "none";
  generateCode();
}

function onLcdComposerNameInput(val) {
  state.lcdComposer.lcdName = val;
  const el = document.getElementById("lcd-composer-name");
  if (typeof _refreshBlockNameValidation === "function") _refreshBlockNameValidation(el);
  generateCode();
}

function onLcdComposerModeChange(val) {
  state.lcdComposer.displayMode = val;
  render();  // bedingte Felder müssen sich neu zeigen/verstecken
}

function onLcdComposerSurfaceInput(val) {
  const idx = parseInt(val, 10);
  state.lcdComposer.surfaceIndex = isNaN(idx) ? 0 : Math.max(0, Math.min(15, idx));
  generateCode();
}

function onLcdComposerResolutionChange(val) {
  state.lcdComposer.resolution = val;
  render(); // Vorschau muss neu mit anderem Aspect-Ratio
}

// ---------- Multi-LCD (Phase 5) ----------

function _ensureMultiLcd() {
  if (!state.lcdComposer.multiLcd) {
    state.lcdComposer.multiLcd = { enabled: false, rows: 1, cols: 2, namePattern: "LCD {col}{row}" };
  }
  return state.lcdComposer.multiLcd;
}

function onLcdMultiToggle(checked) {
  const ml = _ensureMultiLcd();
  ml.enabled = !!checked;
  render();  // Vorschau-Größe + Grid-Overlay ändern sich
}

function onLcdMultiField(field, val) {
  const ml = _ensureMultiLcd();
  if (field === "rows" || field === "cols") {
    const n = parseInt(val, 10);
    ml[field] = isNaN(n) ? 1 : Math.max(1, Math.min(6, n));
  } else if (field === "namePattern") {
    ml.namePattern = String(val || "");
  }
  render();
}

// Erzeugt die Liste aller LCD-Block-Namen für die aktuelle Multi-LCD-Konfiguration.
// Reihenfolge: Zeilen-weise von oben links (Row 1: A1, B1, C1, ...; Row 2: A2, B2, ...).
function computeMultiLcdNames() {
  const ml = _ensureMultiLcd();
  const rows = Math.max(1, parseInt(ml.rows, 10) || 1);
  const cols = Math.max(1, parseInt(ml.cols, 10) || 1);
  const pattern = ml.namePattern || "LCD {col}{row}";
  const names = [];
  const meta = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const colLetter = String.fromCharCode("A".charCodeAt(0) + c);
      const rowNumber = r + 1;
      const name = pattern
        .replace(/\{col\}/g, colLetter)
        .replace(/\{row\}/g, String(rowNumber))
        .replace(/\{c\}/g, String(c + 1))
        .replace(/\{r\}/g, String(rowNumber));
      names.push(name);
      meta.push({ name, col: c, row: r });
    }
  }
  return { names, meta, rows, cols };
}

async function onLcdPresetSelect(key) {
  if (!key) return;
  const preset = (typeof LCD_PRESETS !== "undefined") ? LCD_PRESETS[key] : null;
  if (!preset) return;
  const hasExisting = state.lcdComposer.widgets.length > 0;
  if (hasExisting) {
    const ok = await showConfirm(
      t("lcd.preset.confirm", preset.label, state.lcdComposer.widgets.length),
      { confirmLabel: t("lcd.preset.replace") }
    );
    if (!ok) {
      const sel = document.getElementById("lcd-composer-preset");
      if (sel) sel.value = "";
      return;
    }
  }

  // Resolution übernehmen falls definiert
  if (preset.resolution) {
    state.lcdComposer.resolution = preset.resolution;
    const r = document.getElementById("lcd-composer-resolution");
    if (r) r.value = preset.resolution;
  }

  // Widgets: kompletter Set, jedes mit Defaults aus Widget-Definition gemergt
  state.lcdComposer.widgets = preset.widgets.map(presetW => {
    const def = LCD_WIDGETS[presetW.type];
    const base = def ? JSON.parse(JSON.stringify(def.defaults)) : {};
    return Object.assign(base, presetW);
  });

  // Theme auf alle frisch geladenen Widgets anwenden
  const themeName = state.lcdComposer.theme || "default";
  const theme = LCD_THEMES[themeName];
  if (theme) {
    for (const w of state.lcdComposer.widgets) {
      const slots = LCD_WIDGET_COLOR_SLOTS[w.type];
      if (!slots) continue;
      for (const field of Object.keys(slots)) {
        const newColor = theme[slots[field]];
        if (newColor && w[field] == null) w[field] = newColor;
      }
    }
  }

  render();
  // Preset-Dropdown zurücksetzen (so wirkt es wie ein "einmaliger Befehl")
  const sel = document.getElementById("lcd-composer-preset");
  if (sel) sel.value = "";
  const _plabel = (typeof getLcdPresetMeta === "function") ? getLcdPresetMeta(key).label : preset.label;
  showToast(t("lcd.toast.preset_loaded", _plabel, preset.widgets.length));
}

// Füllt das Resolution-Dropdown beim Init mit den Optionen
function initLcdComposerSelects() {
  const sel = document.getElementById("lcd-composer-resolution");
  if (sel && typeof LCD_RESOLUTION_ORDER !== "undefined") {
    const _rlabel = (k) => (typeof getLcdResolutionLabel === "function") ? getLcdResolutionLabel(k) : LCD_RESOLUTIONS[k].label;
    sel.innerHTML = LCD_RESOLUTION_ORDER.map(k =>
      `<option value="${k}">${_rlabel(k)}</option>`
    ).join("");
    sel.value = state.lcdComposer.resolution || "square";
  }
  // Preset-Dropdown füllen
  const presetSel = document.getElementById("lcd-composer-preset");
  if (presetSel && typeof LCD_PRESET_ORDER !== "undefined") {
    const _plabel = (k) => (typeof getLcdPresetMeta === "function") ? getLcdPresetMeta(k).label : LCD_PRESETS[k].label;
    presetSel.innerHTML = `<option value="">${t("lcd.preset.placeholder")}</option>` +
      LCD_PRESET_ORDER.map(k => `<option value="${k}">${_plabel(k)}</option>`).join("");
  }
}

function addLcdWidget(type) {
  const def = LCD_WIDGETS[type];
  if (!def) return;
  const widget = { type, ...JSON.parse(JSON.stringify(def.defaults)) };

  // Manual-Positionierung ist jetzt das einzige Layout-System.
  // Kompakte Default-Größe pro Widget aus LCD_MANUAL_DEFAULTS.
  const md = (typeof LCD_MANUAL_DEFAULTS !== "undefined" && LCD_MANUAL_DEFAULTS[type])
    ? LCD_MANUAL_DEFAULTS[type]
    : { w: 200, h: 40 };
  widget.manualW = md.w;
  widget.manualH = md.h;

  // Auto-Platzierung: setze unter das letzte sichtbare Widget,
  // damit nicht alle übereinander landen.
  const placement = _findNextLcdPosition(md.w, md.h);
  widget.manualX = placement.x;
  widget.manualY = placement.y;

  // Aktuelles Theme direkt auf das neue Widget anwenden
  const themeName = state.lcdComposer.theme || "default";
  const theme = (typeof LCD_THEMES !== "undefined") ? LCD_THEMES[themeName] : null;
  const slots = (typeof LCD_WIDGET_COLOR_SLOTS !== "undefined") ? LCD_WIDGET_COLOR_SLOTS[type] : null;
  if (theme && slots) {
    for (const field of Object.keys(slots)) {
      const newColor = theme[slots[field]];
      if (newColor) widget[field] = newColor;
    }
  }

  // Neues Widget ausgeklappt, alle anderen kollabieren
  for (const ew of state.lcdComposer.widgets) ew.expanded = false;
  widget.expanded = true;

  state.lcdComposer.widgets.push(widget);
  render();
}

// Findet die nächste freie Position auf dem LCD (vertikales Stacking).
function _findNextLcdPosition(w, h) {
  const SNAP = (typeof LCD_SNAP === "number") ? LCD_SNAP : 16;
  const resKey = state.lcdComposer.resolution || "square";
  const res = (typeof LCD_RESOLUTIONS !== "undefined") ? LCD_RESOLUTIONS[resKey] : { w: 512, h: 512 };
  // Tiefster bisheriger Y-Punkt finden
  let maxBottom = 0;
  for (const ew of state.lcdComposer.widgets) {
    const ey = parseFloat(ew.manualY) || 0;
    const eh = parseFloat(ew.manualH) || 40;
    if (ey + eh > maxBottom) maxBottom = ey + eh;
  }
  let nextY = Math.ceil((maxBottom + 8) / SNAP) * SNAP;
  // Wenn unten kein Platz mehr: zurück zum Anfang
  if (nextY + h > res.h) nextY = 8;
  return { x: 8, y: nextY };
}

function removeLcdWidget(i) {
  state.lcdComposer.widgets.splice(i, 1);
  // Selektion bereinigen: gelöschten Index raus, höhere um 1 verschieben
  _lcdRemapSelectionAfterDelete(i);
  render();
}

// ---------- Multi-Select (v2.10.0) ----------

function _lcdEnsureSelection() {
  if (!Array.isArray(state.lcdComposer.selectedIndices)) {
    state.lcdComposer.selectedIndices = [];
  }
  return state.lcdComposer.selectedIndices;
}

function isLcdWidgetSelected(i) {
  const sel = _lcdEnsureSelection();
  return sel.indexOf(i) !== -1;
}

function selectLcdOnly(i) {
  const sel = _lcdEnsureSelection();
  sel.length = 0;
  sel.push(i);
}

function toggleLcdSelection(i) {
  const sel = _lcdEnsureSelection();
  const pos = sel.indexOf(i);
  if (pos === -1) sel.push(i);
  else sel.splice(pos, 1);
}

function clearLcdSelection() {
  if (!state.lcdComposer) return;
  if (!Array.isArray(state.lcdComposer.selectedIndices)) {
    state.lcdComposer.selectedIndices = [];
    return;
  }
  if (state.lcdComposer.selectedIndices.length === 0) return;
  state.lcdComposer.selectedIndices.length = 0;
  render();
}

// v4.1.0 — Strg+A: alle Widgets selektieren (auch versteckte zählen mit).
function selectAllLcdWidgets() {
  if (!state.lcdComposer || !state.lcdComposer.widgets) return;
  const n = state.lcdComposer.widgets.length;
  if (n === 0) return;
  const sel = _lcdEnsureSelection();
  sel.length = 0;
  for (let i = 0; i < n; i++) sel.push(i);
  render();
}

// v4.1.0 — Hilfsfunktion: liefert die aktuell selektierten Widgets als
// Array von {idx, w, x, y, w, h}-Records mit numerischen Positions-Werten.
function _getSelectedLcdWidgetInfos() {
  if (!state.lcdComposer || !state.lcdComposer.widgets) return [];
  const sel = state.lcdComposer.selectedIndices || [];
  return sel
    .map(idx => {
      const w = state.lcdComposer.widgets[idx];
      if (!w) return null;
      return {
        idx,
        w,
        x: parseFloat(w.manualX) || 0,
        y: parseFloat(w.manualY) || 0,
        ww: parseFloat(w.manualW) || 100,
        hh: parseFloat(w.manualH) || 40
      };
    })
    .filter(x => x !== null);
}

// v4.1.0 — Ausrichten: mode = "left" | "right" | "hcenter" | "top" | "bottom" | "vcenter"
// Bezug = Bounding-Box aller selektierten Widgets (nicht das erste).
function alignSelectedLcdWidgets(mode) {
  const items = _getSelectedLcdWidgetInfos();
  if (items.length < 2) return;
  const minX = Math.min(...items.map(i => i.x));
  const maxX = Math.max(...items.map(i => i.x + i.ww));
  const minY = Math.min(...items.map(i => i.y));
  const maxY = Math.max(...items.map(i => i.y + i.hh));
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  for (const it of items) {
    switch (mode) {
      case "left":    it.w.manualX = minX; break;
      case "right":   it.w.manualX = maxX - it.ww; break;
      case "hcenter": it.w.manualX = Math.round(cx - it.ww / 2); break;
      case "top":     it.w.manualY = minY; break;
      case "bottom":  it.w.manualY = maxY - it.hh; break;
      case "vcenter": it.w.manualY = Math.round(cy - it.hh / 2); break;
    }
  }
  render();
}

// v4.1.0 — Verteilen: gleiche Abstände zwischen ≥3 selektierten Widgets.
// dir = "h" | "v". Endpunkte (erstes und letztes) bleiben stehen, mittlere
// werden umverteilt.
function distributeSelectedLcdWidgets(dir) {
  const items = _getSelectedLcdWidgetInfos();
  if (items.length < 3) return;
  if (dir === "h") {
    items.sort((a, b) => a.x - b.x);
    const first = items[0];
    const last  = items[items.length - 1];
    // Verfügbarer "Gap-Raum" = Distanz von rechter Kante des ersten zur
    // linken Kante des letzten, minus Breite aller mittleren.
    const totalSpan = last.x - (first.x + first.ww);
    const innerWidth = items.slice(1, -1).reduce((sum, it) => sum + it.ww, 0);
    const gapCount = items.length - 1;
    const gap = (totalSpan - innerWidth) / gapCount;
    let cursor = first.x + first.ww + gap;
    for (let i = 1; i < items.length - 1; i++) {
      items[i].w.manualX = Math.round(cursor);
      cursor += items[i].ww + gap;
    }
  } else {
    items.sort((a, b) => a.y - b.y);
    const first = items[0];
    const last  = items[items.length - 1];
    const totalSpan = last.y - (first.y + first.hh);
    const innerHeight = items.slice(1, -1).reduce((sum, it) => sum + it.hh, 0);
    const gapCount = items.length - 1;
    const gap = (totalSpan - innerHeight) / gapCount;
    let cursor = first.y + first.hh + gap;
    for (let i = 1; i < items.length - 1; i++) {
      items[i].w.manualY = Math.round(cursor);
      cursor += items[i].hh + gap;
    }
  }
  render();
}

function _lcdRemapSelectionAfterDelete(deletedIdx) {
  const sel = _lcdEnsureSelection();
  for (let i = sel.length - 1; i >= 0; i--) {
    if (sel[i] === deletedIdx)      sel.splice(i, 1);
    else if (sel[i] > deletedIdx)   sel[i] -= 1;
  }
}

async function deleteSelectedLcdWidgets() {
  const sel = _lcdEnsureSelection();
  if (sel.length === 0) return;
  const n = sel.length;
  const ok = await showConfirm(t("lcd.select.delete_q", n), { confirmLabel: t("lcd.select.delete_btn") });
  if (!ok) return;
  // Höchste Indizes zuerst löschen, damit darunter liegende Indizes
  // gültig bleiben.
  const sorted = [...sel].sort((a, b) => b - a);
  for (const idx of sorted) {
    if (idx >= 0 && idx < state.lcdComposer.widgets.length) {
      state.lcdComposer.widgets.splice(idx, 1);
    }
  }
  state.lcdComposer.selectedIndices = [];
  render();
  showToast(t("lcd.select.deleted", n));
}

// Layer-Liste: Sichtbarkeit toggeln (👁 / ⌀)
function toggleLcdWidgetVisible(i) {
  const w = state.lcdComposer.widgets[i];
  if (!w) return;
  w.hidden = !w.hidden;
  render();
}

// Widget in der Layer-Liste angeklickt: dieses ausklappen,
// alle anderen kollabieren, hochscrollen.
function selectLcdWidget(i) {
  for (let j = 0; j < state.lcdComposer.widgets.length; j++) {
    state.lcdComposer.widgets[j].expanded = (j === i);
  }
  selectLcdOnly(i);
  render();
  // Sanft zum Widget-Editor scrollen
  setTimeout(() => {
    const el = document.querySelector(`.lcd-widget-block[data-widget-idx="${i}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 50);
}

// v2.10.0 — Klick in der Layer-Liste:
//   Shift gehalten → Multi-Select toggle (kein Expand)
//   sonst         → Expand + Single-Select (alter Workflow)
function selectLcdLayerRow(event, i) {
  if (event && event.shiftKey) {
    toggleLcdSelection(i);
    render();
    return;
  }
  selectLcdWidget(i);
}

function toggleLcdWidgetExpanded(i) {
  const w = state.lcdComposer.widgets[i];
  if (!w) return;
  w.expanded = !w.expanded;
  render();
}

function moveLcdWidget(i, dir) {
  const ws = state.lcdComposer.widgets;
  const j = i + dir;
  if (j < 0 || j >= ws.length) return;
  [ws[i], ws[j]] = [ws[j], ws[i]];
  // Selektion: i ↔ j tauschen, damit die Auswahl dem Widget folgt.
  const sel = _lcdEnsureSelection();
  const hasI = sel.indexOf(i) !== -1;
  const hasJ = sel.indexOf(j) !== -1;
  if (hasI !== hasJ) {
    const target = hasI ? i : j;
    const replacement = hasI ? j : i;
    sel[sel.indexOf(target)] = replacement;
  }
  render();
}

// Werteänderung an einem Widget — kein Re-Render bei Text-Inputs
// (Fokus-Erhalt). Für Selects gibt's updateLcdWidgetAndRender.
// AUSNAHMEN: Layout-Felder (widgetHeight, colSpan) verschieben
// alle Y-Positionen → voller Re-Render nötig.
function updateLcdWidget(i, field, val) {
  state.lcdComposer.widgets[i][field] = val;

  // Layout-Felder triggern Full-Render, weil sie das gesamte
  // Stack-Layout verschieben.
  if (field === "widgetHeight" || field === "colSpan" || field === "spaceHeight" ||
      field === "manualPos" || field === "manualX" || field === "manualY" ||
      field === "manualW"    || field === "manualH") {
    render();
    return;
  }

  // Mini-Vorschau im Widget-Editor
  const previewEl = document.getElementById(`lcd-widget-preview-${i}`);
  if (previewEl) previewEl.innerHTML = renderLcdWidgetPreview(state.lcdComposer.widgets[i]);
  // Live-Vorschau-Cell (Selector korrigiert: .lcd-full-cell statt -row)
  const fullCell = document.querySelectorAll(".lcd-full-preview .lcd-full-cell")[i];
  if (fullCell) fullCell.innerHTML = renderLcdWidgetPreview(state.lcdComposer.widgets[i]);
  generateCode();
}

function updateLcdWidgetAndRender(i, field, val) {
  state.lcdComposer.widgets[i][field] = val;
  render();
}

// Theme auf alle bestehenden Widgets anwenden.
// SLOT-BASIERT: für jeden Widget-Typ ist in LCD_WIDGET_COLOR_SLOTS
// hinterlegt, welches Feld zu welchem Theme-Slot gehört. Die Farbe
// wird direkt aus dem neuen Theme gesetzt — unabhängig vom aktuellen
// Wert. Dadurch sind beliebig viele Theme-Wechsel deterministisch.
//
// Custom-Felder (z.B. alarm.textColor) bleiben unangetastet, weil
// sie keinen Slot im Mapping haben.
function applyLcdTheme(themeName) {
  const newT = LCD_THEMES[themeName];
  if (!newT) return;

  let changed = 0;
  for (const w of state.lcdComposer.widgets) {
    const slots = LCD_WIDGET_COLOR_SLOTS[w.type];
    if (!slots) continue;
    for (const field of Object.keys(slots)) {
      const slotName = slots[field];
      const newColor = newT[slotName];
      if (newColor && w[field] !== newColor) {
        w[field] = newColor;
        changed++;
      }
    }
  }
  state.lcdComposer.theme = themeName;
  render();
  const _tlabel = (typeof getLcdThemeLabel === "function") ? getLcdThemeLabel(themeName) : newT.label;
  showToast(t("lcd.toast.theme_applied", _tlabel, changed));
}

// ============================================================
// v5.0.0 — RuleSet-Handler
// ============================================================

function selectRuleSet(idx) {
  ensureRuleSetState();
  const n = state.ruleSets.length;
  if (idx < 0 || idx >= n) return;
  if (state.activeRuleIdx === idx) return;
  state.activeRuleIdx = idx;
  render();
}

function addRuleSet() {
  ensureRuleSetState();
  const next = state.ruleSets.length + 1;
  state.ruleSets.push({
    name: t("ruleset.name_default", next),
    conditions: [],
    actionsThen: [],
    actionsElse: []
  });
  state.activeRuleIdx = state.ruleSets.length - 1;
  render();
}

async function removeRuleSet(idx) {
  ensureRuleSetState();
  if (state.ruleSets.length <= 1) {
    showToast(t("ruleset.cant_remove_last"));
    return;
  }
  const rs = state.ruleSets[idx];
  if (!rs) return;
  const ok = await showConfirm(
    t("ruleset.remove_q", rs.name),
    { confirmLabel: t("ruleset.remove_btn") }
  );
  if (!ok) return;
  state.ruleSets.splice(idx, 1);
  if (state.activeRuleIdx >= state.ruleSets.length) {
    state.activeRuleIdx = state.ruleSets.length - 1;
  }
  render();
}

async function renameRuleSet(idx) {
  ensureRuleSetState();
  const rs = state.ruleSets[idx];
  if (!rs) return;
  const newName = await showPrompt(t("ruleset.rename_q"), rs.name);
  if (newName === null) return;
  rs.name = (newName || "").trim() || rs.name;
  render();
}
