// ============================================================
// UI RENDERING (Conditions, Actions, Help-Text, Master-render)
// ============================================================

function renderConditions() {
  const root = document.getElementById("conditions");
  if (state.conditions.length === 0) {
    root.innerHTML = '<span class="empty-hint">Keine Bedingungen — Aktion läuft immer.</span>';
    return;
  }
  root.innerHTML = state.conditions.map((c, i) => {
    const cond = findCond(c.blockType, c.condId);
    const needsArg = cond && cond.arg;
    const logicSelect = i > 0 ? `
      <div class="logic-op">
        <select onchange="updateCond(${i}, 'logicOp', this.value)">
          <option value="AND" ${c.logicOp === "AND" ? "selected" : ""}>UND</option>
          <option value="OR" ${c.logicOp === "OR" ? "selected" : ""}>ODER</option>
        </select>
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
            <select onchange="updateCond(${i}, 'blockType', this.value)">${blockTypeOptions()}</select>
          </div>
          <div>
            <label>Block-Name (im Spiel)</label>
            <input value="${escapeAttr(c.blockName)}" oninput="updateCond(${i}, 'blockName', this.value)" placeholder="exakter Name aus Terminal">
          </div>
        </div>
        <div class="row ${needsArg ? "row-2" : ""}">
          <div>
            <label>Prüfung ${tooltipBadge(c.blockType, c.condId)}</label>
            <select onchange="updateCond(${i}, 'condId', this.value)">${condOptions(c.blockType)}</select>
          </div>
          ${needsArg ? `
          <div>
            <label>${cond.arg}</label>
            <input value="${escapeAttr(c.arg)}" oninput="updateCond(${i}, 'arg', this.value)">
          </div>` : ""}
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
    const needsArg = act && act.arg;
    return `
      <div class="action-block ${which === "else" ? "else-block" : ""}">
        <div class="act-header">
          <span>AKTION #${i + 1}</span>
          <button class="small danger" onclick="removeAct('${which}', ${i})">✕ Entfernen</button>
        </div>
        <div class="row row-2">
          <div>
            <label>Block-Typ</label>
            <select onchange="updateAct('${which}', ${i}, 'blockType', this.value)">${blockTypeOptions()}</select>
          </div>
          <div>
            <label>Block-Name</label>
            <input value="${escapeAttr(a.blockName)}" oninput="updateAct('${which}', ${i}, 'blockName', this.value)" placeholder="exakter Name aus Terminal">
          </div>
        </div>
        <div class="row ${needsArg ? "row-2" : ""}">
          <div>
            <label>Aktion ${tooltipBadge(a.blockType, a.actId)}</label>
            <select onchange="updateAct('${which}', ${i}, 'actId', this.value)">${actOptions(a.blockType)}</select>
          </div>
          ${needsArg ? `
          <div>
            <label>${act.arg}</label>
            <input value="${escapeAttr(a.arg)}" oninput="updateAct('${which}', ${i}, 'arg', this.value)">
          </div>` : ""}
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
