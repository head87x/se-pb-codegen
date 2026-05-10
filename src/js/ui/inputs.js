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
  const firstCond = BLOCKS[firstType].conditions[0].id;
  state.conditions.push({
    blockType: firstType,
    blockName: "",
    condId: firstCond,
    arg: "",
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
    render();
    return;
  }
  if (field === "condId") {
    // Andere Condition → Argument-Feld kann erscheinen/verschwinden
    state.conditions[i].arg = "";
    render();
    return;
  }
  // blockName, arg, logicOp: reine Werteänderung, kein Re-Render
  generateCode();
}

// ---------- Actions ----------

function addAction(which) {
  const list = which === "then" ? state.actionsThen : state.actionsElse;
  const firstType = Object.keys(BLOCKS).find(k => (BLOCKS[k].actions || []).length > 0);
  if (!firstType) return;
  const firstAct = BLOCKS[firstType].actions[0].id;
  list.push({
    blockType: firstType,
    blockName: "",
    actId: firstAct,
    arg: ""
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
    render();
    return;
  }
  if (field === "actId") {
    list[i].arg = "";
    render();
    return;
  }
  // blockName, arg: reine Werteänderung
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
