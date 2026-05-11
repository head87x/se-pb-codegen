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
    logicOp: "AND"
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
    arg2: ""
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
  // blockName, arg, arg2: reine Werteänderung
  generateCode();
}

// ---------- Statische UI-Inputs (Header-Bereich) ----------

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
  generateCode();
}

function addLcdWidget(type) {
  const def = LCD_WIDGETS[type];
  if (!def) return;
  state.lcdComposer.widgets.push({ type, ...JSON.parse(JSON.stringify(def.defaults)) });
  render();
}

function removeLcdWidget(i) {
  state.lcdComposer.widgets.splice(i, 1);
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
function updateLcdWidget(i, field, val) {
  state.lcdComposer.widgets[i][field] = val;
  // SVG-Preview manuell updaten, ohne den ganzen Composer neu zu rendern
  const previewEl = document.getElementById(`lcd-widget-preview-${i}`);
  if (previewEl) previewEl.innerHTML = renderLcdWidgetPreview(state.lcdComposer.widgets[i]);
  generateCode();
}

function updateLcdWidgetAndRender(i, field, val) {
  state.lcdComposer.widgets[i][field] = val;
  render();
}
