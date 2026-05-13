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
  state.conditions.push({
    blockType,
    blockName: "",
    condId: def.conditions[0].id,
    arg: "",
    arg2: "",
    logicOp: "AND",
    useGroup: false,
    groupSemantic: "any",   // "any" | "all" | "count"
    groupCount: 1            // nur relevant bei groupSemantic === "count"
  });
  render();
}

function removeCond(i) {
  state.conditions.splice(i, 1);
  render();
}

function updateCond(i, field, val) {
  state.conditions[i][field] = val;

  if (field === "blockType") {
    // Wechsel des Block-Typs → andere Conditions verfügbar → Strukturwechsel
    state.conditions[i].condId = BLOCKS[val].conditions[0]?.id || "";
    state.conditions[i].arg = "";
    state.conditions[i].arg2 = "";
    render();
    return;
  }
  if (field === "condId") {
    // Andere Condition → Argument-Felder können erscheinen/verschwinden
    state.conditions[i].arg = "";
    state.conditions[i].arg2 = "";
    render();
    return;
  }
  if (field === "useGroup") {
    // Strukturwechsel: Label "Block-Name" ↔ "Gruppen-Name" + Generator
    state.conditions[i].useGroup = !!val;
    render();
    return;
  }
  if (field === "groupSemantic") {
    // Strukturwechsel: count blendet Count-Input ein
    state.conditions[i].groupSemantic = val || "any";
    render();
    return;
  }
  if (field === "groupCount") {
    const n = parseInt(val, 10);
    state.conditions[i].groupCount = isNaN(n) ? 1 : Math.max(1, n);
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
  const list = which === "then" ? state.actionsThen : state.actionsElse;
  list.push({
    blockType,
    blockName: "",
    actId: def.actions[0].id,
    arg: "",
    arg2: "",
    useGroup: false
  });
  render();
}

function removeAct(which, i) {
  const list = which === "then" ? state.actionsThen : state.actionsElse;
  list.splice(i, 1);
  render();
}

function updateAct(which, i, field, val) {
  const list = which === "then" ? state.actionsThen : state.actionsElse;
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
    render();
    return;
  }
  // blockName, arg, arg2: reine Werteänderung
  generateCode();
}

// ---------- Statische UI-Inputs (Header-Bereich) ----------

function onUseCoroutinesChange(checked) {
  state.useCoroutines = !!checked;
  generateCode();
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
  state.conditions[i][field] = val;
  render();
}
function updateActAndRender(which, i, field, val) {
  const list = which === "then" ? state.actionsThen : state.actionsElse;
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
  render();
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
  render();
  // Sanft zum Widget-Editor scrollen
  setTimeout(() => {
    const el = document.querySelector(`.lcd-widget-block[data-widget-idx="${i}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 50);
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
