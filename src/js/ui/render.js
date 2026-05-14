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

// Regex via Konstruktor — vermeidet, dass die Source-Datei selbst
// versehentlich Steuerzeichen enthält. Matches:
//   ASCII-Control (- außer \t/\n) + zero-width-Spaces +
//   Bidi-Marks + BOM.
const _CTRL_CHAR_REGEX = new RegExp(
  "[\\u0001-\\u0008\\u000B-\\u001F\\u200B-\\u200F\\u202A-\\u202E\\uFEFF]"
);

// Validiert einen Block-/Gruppen-Namen. Liefert { level, msgKey } —
// level: "ok" | "warning" | "error". Wird im Render genutzt um ein
// kleines (⚠) Badge + farbigen Border zu zeigen.
function _validateBlockName(name) {
  if (!name || !name.trim()) {
    return { level: "error", msgKey: "validate.empty" };
  }
  if (name !== name.trim()) {
    return { level: "warning", msgKey: "validate.whitespace" };
  }
  if (_CTRL_CHAR_REGEX.test(name)) {
    return { level: "warning", msgKey: "validate.controlchar" };
  }
  return { level: "ok" };
}


// Liefert HTML für ein Block-Name-Input mit optionalem Warnindikator.
// Der oninput-Handler ruft zusätzlich `_refreshBlockNameValidation(this)`
// auf, sodass der Badge-Status live mit jeder Tastenanschlag aktualisiert
// wird — ohne `render()` (sonst würde der Eingabe-Fokus verloren gehen).
function _blockNameInputHtml(value, onInputCall, placeholder) {
  const v = _validateBlockName(value);
  const cls = v.level === "error" ? "input-warn-error"
            : v.level === "warning" ? "input-warn-warning" : "";
  const badge = (v.level === "ok") ? "" :
    `<span class="input-warn-badge ${v.level}" title="${escapeAttr(t(v.msgKey))}">⚠</span>`;
  // Inline-Skript bleibt einfache String-Interpolation — wir hängen
  // den Live-Validation-Call ans Ende des bestehenden Handlers.
  const combinedHandler = `${onInputCall}; _refreshBlockNameValidation(this)`;
  return `<div class="input-with-warn ${cls}">
    <input value="${escapeAttr(value || "")}" oninput="${combinedHandler}" placeholder="${escapeAttr(placeholder || "")}">
    ${badge}
  </div>`;
}

// Aktualisiert Wrap-Border und Badge live (ohne Re-Render). Wird vom
// oninput-Handler nach jeder Tasteneingabe gerufen — so reagiert die
// Warnung sofort, statt erst beim nächsten render().
function _refreshBlockNameValidation(inputEl) {
  if (!inputEl) return;
  const wrap = inputEl.parentElement;
  if (!wrap || !wrap.classList.contains("input-with-warn")) return;
  const v = _validateBlockName(inputEl.value);

  // Border-Klasse am Wrap aktualisieren
  wrap.classList.remove("input-warn-error", "input-warn-warning");
  if (v.level === "error")   wrap.classList.add("input-warn-error");
  if (v.level === "warning") wrap.classList.add("input-warn-warning");

  // Badge erzeugen / aktualisieren / entfernen
  let badge = wrap.querySelector(".input-warn-badge");
  if (v.level === "ok") {
    if (badge) badge.remove();
    return;
  }
  if (!badge) {
    badge = document.createElement("span");
    badge.textContent = "⚠";
    wrap.appendChild(badge);
  }
  badge.className = "input-warn-badge " + v.level;
  badge.title = t(v.msgKey);
}

function renderConditions() {
  const root = document.getElementById("conditions");
  if (state.conditions.length === 0) {
    root.innerHTML = `<span class="empty-hint">${escapeHtml(t("cond.empty"))}</span>`;
    return;
  }
  root.innerHTML = state.conditions.map((c, i) => {
    const cond = findCond(c.blockType, c.condId);
    const needsArg  = cond && cond.arg;
    const needsArg2 = cond && cond.arg2;
    const logicSelect = i > 0 ? `
      <div class="logic-op">
        <select onchange="updateCond(${i}, 'logicOp', this.value)">
          <option value="AND" ${c.logicOp === "AND" ? "selected" : ""}>${escapeHtml(t("label.logic.and"))}</option>
          <option value="OR" ${c.logicOp === "OR" ? "selected" : ""}>${escapeHtml(t("label.logic.or"))}</option>
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
    // v3.0.0 — Block-Source-Modus mit 3-Wege-Auswahl
    const src = c.blockSource || (c.useGroup ? "group" : "single");
    const isType  = src === "type";
    const isGroup = src === "group";
    const isMulti = isType || isGroup;
    const aggMode = c.aggregateMode || c.groupSemantic || "any";
    const showThreshold = (aggMode === "count" || aggMode === "sum" || aggMode === "avg" || aggMode === "min" || aggMode === "max");
    const nameLabel = isType ? null : (isGroup ? "group.name" : "block.name");
    return `
      ${logicSelect}
      <div class="condition-block">
        <div class="cond-header">
          <span>${escapeHtml(t("cond.add").replace(/^\+\s*/, "").toUpperCase())} #${i + 1}</span>
          <button class="small danger" onclick="removeCond(${i})">${escapeHtml(t("btn.remove"))}</button>
        </div>
        <div class="row ${isType ? "" : "row-2"}">
          <div>
            <label>${escapeHtml(t("label.blocktype"))}</label>
            <select onchange="updateCond(${i}, 'blockType', this.value)">${blockTypeOptions('conditions')}</select>
          </div>
          ${isType ? "" : `
          <div>
            <label>${escapeHtml(t(nameLabel))}</label>
            ${_blockNameInputHtml(
              c.blockName,
              `updateCond(${i}, 'blockName', this.value)`,
              t(isGroup ? "group.name_ph" : "block.name_ph")
            )}
          </div>`}
        </div>
        <div class="block-source-row">
          <label class="bsource-label">${escapeHtml(t("source.label"))}</label>
          <div class="bsource-pills">
            <button class="small${src === "single" ? " active" : ""}" onclick="updateCond(${i}, 'blockSource', 'single')">${escapeHtml(t("source.single"))}</button>
            <button class="small${src === "group"  ? " active" : ""}" onclick="updateCond(${i}, 'blockSource', 'group')">${escapeHtml(t("source.group"))}</button>
            <button class="small${src === "type"   ? " active" : ""}" onclick="updateCond(${i}, 'blockSource', 'type')">${escapeHtml(t("source.type"))}</button>
          </div>
          ${isType ? `
          <label class="same-construct-toggle">
            <input type="checkbox" ${c.sameConstruct !== false ? "checked" : ""} onchange="updateCond(${i}, 'sameConstruct', this.checked)">
            ${escapeHtml(t("source.same_construct"))}
          </label>` : ""}
        </div>
        ${isMulti ? `
        <div class="row ${showThreshold ? "row-3" : ""}" style="margin-bottom:6px;">
          <div>
            <label>${escapeHtml(t("agg.mode.label"))}</label>
            <select onchange="updateCond(${i}, 'aggregateMode', this.value)">
              <option value="any"   ${aggMode === "any"   ? "selected" : ""}>${escapeHtml(t("agg.mode.any"))}</option>
              <option value="all"   ${aggMode === "all"   ? "selected" : ""}>${escapeHtml(t("agg.mode.all"))}</option>
              <option value="count" ${aggMode === "count" ? "selected" : ""}>${escapeHtml(t("agg.mode.count"))}</option>
              <option value="sum"   ${aggMode === "sum"   ? "selected" : ""}>${escapeHtml(t("agg.mode.sum"))}</option>
              <option value="avg"   ${aggMode === "avg"   ? "selected" : ""}>${escapeHtml(t("agg.mode.avg"))}</option>
              <option value="min"   ${aggMode === "min"   ? "selected" : ""}>${escapeHtml(t("agg.mode.min"))}</option>
              <option value="max"   ${aggMode === "max"   ? "selected" : ""}>${escapeHtml(t("agg.mode.max"))}</option>
            </select>
          </div>
          ${showThreshold ? `
          <div>
            <label>${escapeHtml(t("agg.op.label"))}</label>
            <select onchange="updateCond(${i}, 'aggregateOp', this.value)">
              <option value=">"  ${(c.aggregateOp || ">=") === ">"  ? "selected" : ""}>${escapeHtml(t("agg.op.gt"))}</option>
              <option value=">=" ${(c.aggregateOp || ">=") === ">=" ? "selected" : ""}>${escapeHtml(t("agg.op.gte"))}</option>
              <option value="<"  ${(c.aggregateOp || ">=") === "<"  ? "selected" : ""}>${escapeHtml(t("agg.op.lt"))}</option>
              <option value="<=" ${(c.aggregateOp || ">=") === "<=" ? "selected" : ""}>${escapeHtml(t("agg.op.lte"))}</option>
              <option value="==" ${(c.aggregateOp || ">=") === "==" ? "selected" : ""}>${escapeHtml(t("agg.op.eq"))}</option>
              <option value="!=" ${(c.aggregateOp || ">=") === "!=" ? "selected" : ""}>${escapeHtml(t("agg.op.neq"))}</option>
            </select>
          </div>
          <div>
            <label>${escapeHtml(t("agg.threshold.label"))}</label>
            <input type="number" step="any" value="${escapeAttr((c.aggregateThreshold != null ? c.aggregateThreshold : (c.groupCount || 1)))}" oninput="updateCond(${i}, 'aggregateThreshold', this.value)">
          </div>` : ""}
        </div>` : ""}
        <div class="row ${rowClass}">
          <div>
            <label>${escapeHtml(t("label.check"))} ${tooltipBadge(c.blockType, c.condId, 'conditions')}</label>
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
    root.innerHTML = `<span class="empty-hint">${escapeHtml(t(which === "then" ? "act.empty" : "else.empty"))}</span>`;
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
    const asrc = a.blockSource || (a.useGroup ? "group" : "single");
    const aIsType  = asrc === "type";
    const aIsGroup = asrc === "group";
    const aNameLabel = aIsType ? null : (aIsGroup ? "group.name" : "block.name");
    return `
      <div class="action-block ${which === "else" ? "else-block" : ""}">
        <div class="act-header">
          <span>${escapeHtml(t("label.action").toUpperCase())} #${i + 1}</span>
          <button class="small danger" onclick="removeAct('${which}', ${i})">${escapeHtml(t("btn.remove"))}</button>
        </div>
        <div class="row ${aIsType ? "" : "row-2"}">
          <div>
            <label>${escapeHtml(t("label.blocktype"))}</label>
            <select onchange="updateAct('${which}', ${i}, 'blockType', this.value)">${blockTypeOptions('actions')}</select>
          </div>
          ${aIsType ? "" : `
          <div>
            <label>${escapeHtml(t(aNameLabel))}</label>
            ${_blockNameInputHtml(
              a.blockName,
              `updateAct('${which}', ${i}, 'blockName', this.value)`,
              t(aIsGroup ? "group.name_ph" : "block.name_ph")
            )}
          </div>`}
        </div>
        <div class="block-source-row">
          <label class="bsource-label">${escapeHtml(t("source.label"))}</label>
          <div class="bsource-pills">
            <button class="small${asrc === "single" ? " active" : ""}" onclick="updateAct('${which}', ${i}, 'blockSource', 'single')">${escapeHtml(t("source.single"))}</button>
            <button class="small${asrc === "group"  ? " active" : ""}" onclick="updateAct('${which}', ${i}, 'blockSource', 'group')">${escapeHtml(t("source.group"))}</button>
            <button class="small${asrc === "type"   ? " active" : ""}" onclick="updateAct('${which}', ${i}, 'blockSource', 'type')">${escapeHtml(t("source.type"))}</button>
          </div>
          ${aIsType ? `
          <label class="same-construct-toggle">
            <input type="checkbox" ${a.sameConstruct !== false ? "checked" : ""} onchange="updateAct('${which}', ${i}, 'sameConstruct', this.checked)">
            ${escapeHtml(t("source.same_construct"))}
          </label>` : ""}
        </div>
        <div class="row ${rowClass}">
          <div>
            <label>${escapeHtml(t("label.action"))} ${tooltipBadge(a.blockType, a.actId, 'actions')}</label>
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
  const txt = t("exec.help." + state.execMode);
  const helpEl = document.getElementById("exec-help");
  if (!helpEl) return;
  helpEl.textContent = txt;
  // Warnung bei continuous (Update1) — visuell hervorheben
  if (state.execMode === "continuous") {
    helpEl.style.color = "var(--warn)";
    helpEl.style.fontWeight = "600";
  } else {
    helpEl.style.color = "";
    helpEl.style.fontWeight = "";
  }
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
  renderCoroutineStats();
  generateCode();
}

// Coroutine-Statistik anzeigen, wenn der Toggle aktiv ist und der
// Composer tatsächlich Drawing-Code emittiert (sonst irrelevant).
// Schätzt grob: 1 Tick pro LCD + 1 Tick pro Aggregator-Widget
// (bei ≤50 Blöcken pro Aggregator). Bei vielen Blöcken kommt mehr dazu.
function renderCoroutineStats() {
  const el = document.getElementById("exec-coroutines-stats");
  if (!el) return;
  const active = !!state.useCoroutines;
  const lc = state.lcdComposer;
  const composerActive = lc && lc.enabled && lc.widgets && lc.widgets.length > 0;
  if (!active || !composerActive) {
    el.style.display = "none";
    el.textContent = "";
    return;
  }
  // LCD count
  const ml = lc.multiLcd || { enabled: false, rows: 1, cols: 1 };
  const multi = ml.enabled === true && (lc.displayMode || "external") === "external";
  const cols = multi ? Math.max(1, parseInt(ml.cols, 10) || 1) : 1;
  const rows = multi ? Math.max(1, parseInt(ml.rows, 10) || 1) : 1;
  const lcdCount = multi ? cols * rows : 1;
  // Aggregator widgets (visible only)
  const aggCount = lc.widgets.filter(w => w.type === "aggregator" && !w.hidden).length;
  // Estimate: 1 tick per LCD yield + 1 tick per aggregator-chunk-cycle (≤50 blocks)
  const ticks = lcdCount + aggCount;
  el.style.display = "";
  el.textContent = t("exec.coroutines.stats", ticks, lcdCount, aggCount);
}

// ============================================================
// LCD-COMPOSER (Phase 4a)
// ============================================================

function _renderLcdSingleField(f, i, val, widgetType) {
  // Labels & Hints durch i18n-Helper jagen (Fallback = Original aus widgets.js)
  const _flabel = (typeof getLcdFieldLabel === "function") ? getLcdFieldLabel(widgetType, f.key, f.label) : f.label;
  const _fhint  = (typeof getLcdHintLabel === "function") ? getLcdHintLabel(widgetType, f.key, f.hint) : f.hint;

  if (f.type === "lcd-source") {
    const opts = LCD_SOURCES.map(s => {
      const lbl = (typeof getLcdSourceLabel === "function") ? getLcdSourceLabel(s.value) : s.label;
      return `<option value="${s.value}"${s.value === val ? " selected" : ""}>${escapeHtml(lbl)}</option>`;
    }).join("");
    return `
      <div>
        <label>${escapeHtml(_flabel)}</label>
        <select onchange="updateLcdWidgetAndRender(${i}, '${f.key}', this.value)">${opts}</select>
      </div>`;
  }
  if (f.type === "lcd-bool") {
    const opts = LCD_BOOL_SOURCES.map(s => {
      const lbl = (typeof getLcdBoolSourceLabel === "function") ? getLcdBoolSourceLabel(s.value) : s.label;
      return `<option value="${s.value}"${s.value === val ? " selected" : ""}>${escapeHtml(lbl)}</option>`;
    }).join("");
    return `
      <div>
        <label>${escapeHtml(_flabel)}</label>
        <select onchange="updateLcdWidgetAndRender(${i}, '${f.key}', this.value)">${opts}</select>
      </div>`;
  }
  if (f.type === "select") {
    // Option-Context auswählen: f.key ("align" / "format" / "blink" / "icon" / "aggregateType" / "mode")
    // Für clock.format -> "clock_format" (sonst kollidiert mit value.format)
    const optionCtx = (widgetType === "clock" && f.key === "format") ? "clock_format" : f.key;
    const opts = f.options.map(o => {
      const lbl = (typeof getLcdOptionLabel === "function") ? getLcdOptionLabel(optionCtx, o.value, o.label) : o.label;
      return `<option value="${o.value}"${o.value === val ? " selected" : ""}>${escapeHtml(lbl)}</option>`;
    }).join("");
    return `
      <div>
        <label>${escapeHtml(_flabel)}</label>
        <select onchange="updateLcdWidgetAndRender(${i}, '${f.key}', this.value)">${opts}</select>
      </div>`;
  }
  const inputType = f.type === "number" ? "number" : "text";
  const placeholder = _fhint ? ` placeholder="${escapeAttr(_fhint)}"` : "";
  const step = f.type === "number" ? ' step="any"' : "";

  // Block-Name-Felder in Widgets bekommen Validierung wie in Bedingungen/Aktionen.
  // Keys: sourceBlock (Standard-Widgets), block1/block2 (Doppel-Balken).
  if (f.type === "text" && (f.key === "sourceBlock" || f.key === "block1" || f.key === "block2")) {
    return `
    <div>
      <label>${escapeHtml(_flabel)}</label>
      ${_blockNameInputHtml(val, `updateLcdWidget(${i}, '${f.key}', this.value)`, _fhint || "")}
    </div>`;
  }

  return `
    <div>
      <label>${escapeHtml(_flabel)}</label>
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
    html += `<div class="lcd-widget-fields">${noGroup.map(f => _renderLcdSingleField(f, i, w[f.key], w.type)).join("")}</div>`;
  }
  for (const [groupName, fields] of groups) {
    const _gname = (typeof getLcdGroupLabel === "function") ? getLcdGroupLabel(groupName) : groupName;
    html += `<div class="lcd-widget-group-title">${escapeHtml(_gname)}</div>`;
    html += `<div class="lcd-widget-fields">${fields.map(f => _renderLcdSingleField(f, i, w[f.key], w.type)).join("")}</div>`;
  }

  // Position & Größe (Manual ist jetzt der einzige Modus)
  html += `<div class="lcd-widget-group-title">${escapeHtml(t("lcd.builder.pos_size"))}</div>`;
  html += `<div class="lcd-widget-fields">`;
  html += _renderLcdSingleField({ key: "manualX", label: t("lcd.field.x"), type: "number" }, i, w.manualX, w.type);
  html += _renderLcdSingleField({ key: "manualY", label: t("lcd.field.y"), type: "number" }, i, w.manualY, w.type);
  html += _renderLcdSingleField({ key: "manualW", label: t("lcd.field.w"), type: "number" }, i, w.manualW, w.type);
  html += _renderLcdSingleField({ key: "manualH", label: t("lcd.field.h"), type: "number" }, i, w.manualH, w.type);
  html += `</div>`;

  html += `<div class="lcd-widget-group-title">${escapeHtml(t("lcd.builder.bg_optional"))}</div>`;
  html += `<div class="lcd-widget-fields">`;
  html += _renderLcdSingleField(
    { key: "widgetBg", label: getLcdFieldLabel(w.type, "widgetBg", "Hintergrundfarbe (R,G,B)"), type: "text", hint: t("lcd.builder.bg_empty") },
    i,
    w.widgetBg,
    w.type
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

  const _liveLabel = t("lcd.builder.live_preview");
  const _snapLabel = t("lcd.builder.snap");
  const _resLabel  = (typeof getLcdResolutionLabel === "function") ? getLcdResolutionLabel(resKey) : res.label;
  const headerLabel = multi
    ? `${_liveLabel} — ${cols}×${rows} ${escapeHtml(_resLabel)} · ${_snapLabel} ${LCD_SNAP}px`
    : `${_liveLabel} — ${escapeHtml(_resLabel)}${widgets.length > 0 ? ` · ${_snapLabel} ${LCD_SNAP}px` : ""}`;

  if (widgets.length === 0) {
    return `
      <div class="lcd-full-preview-wrap">
        <div class="lcd-full-preview-label">${headerLabel}</div>
        <div class="lcd-full-preview" style="width:${outerWidth}px;height:${outerHeight}px;position:relative;">
          ${lcdSepOverlay}
          ${lcdNamesOverlay}
          <div class="lcd-full-empty">${escapeHtml(t("lcd.builder.display_empty"))}</div>
        </div>
      </div>`;
  }

  const visibleWidgets = widgets
    .map((w, idx) => ({ w, idx }))
    .filter(o => !o.w.hidden);

  const selectedSet = new Set(
    Array.isArray(state.lcdComposer.selectedIndices) ? state.lcdComposer.selectedIndices : []
  );
  const items = visibleWidgets.map(({ w, idx }) => {
    const mx = Math.max(0, parseFloat(w.manualX) || 0);
    const my = Math.max(0, parseFloat(w.manualY) || 0);
    const mw = Math.max(8, parseFloat(w.manualW) || 100);
    const mh = Math.max(8, parseFloat(w.manualH) || 40);
    const left = Math.round(mx * scale);
    const top  = Math.round(my * scale);
    const wPx  = Math.round(mw * scale);
    const hPx  = Math.round(mh * scale);
    const selCls = selectedSet.has(idx) ? " is-selected" : "";
    return `<div class="lcd-full-cell lcd-cell-manual${selCls}" data-widget-idx="${idx}" style="left:${left}px;top:${top}px;width:${wPx}px;height:${hPx}px;">${renderLcdWidgetPreview(w)}<div class="lcd-cell-resize" data-widget-idx="${idx}"></div></div>`;
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
    namesPrev.innerHTML = `${escapeHtml(t("lcd.builder.lcd_names"))} ${escapeHtml(sample)}${escapeHtml(extra)}`;
  } else if (namesPrev) {
    namesPrev.innerHTML = "";
  }

  // Header-Bereich: Add-Buttons — Widget-Namen i18n-aware
  const _wlabel = (type) => (typeof getLcdWidgetLabel === "function") ? getLcdWidgetLabel(type) : (LCD_WIDGETS[type] || {}).label || type;
  const addButtons = LCD_WIDGET_ORDER.map(type => {
    return `<button class="small" onclick="addLcdWidget('${type}')">+ ${escapeHtml(_wlabel(type))}</button>`;
  }).join("");

  // Theme-Buttons (Phase 4c) — Theme-Namen i18n-aware
  const themeButtons = LCD_THEME_ORDER.map(key => {
    const themeDef = LCD_THEMES[key];
    const accent = themeDef.accent.split(",").map(s => s.trim()).join(",");
    const isActive = state.lcdComposer.theme === key ? " primary" : "";
    const _tlabel = (typeof getLcdThemeLabel === "function") ? getLcdThemeLabel(key) : themeDef.label;
    return `<button class="small${isActive}" style="border-left:3px solid rgb(${accent})" onclick="applyLcdTheme('${key}')">${escapeHtml(_tlabel)}</button>`;
  }).join("");

  const themeBar = `
    <div class="lcd-theme-bar">
      <span class="lcd-theme-label">${escapeHtml(t("lcd.builder.theme_label"))}</span>
      <div class="btn-row">${themeButtons}</div>
    </div>`;

  const widgets = state.lcdComposer.widgets;
  const fullPreview = _renderFullLcdPreview();
  const layerList = _renderLcdLayerList(widgets);

  if (widgets.length === 0) {
    root.innerHTML = `
      ${themeBar}
      ${fullPreview}
      <div class="btn-row" style="margin-bottom:10px;">${addButtons}</div>
      <span class="empty-hint">${escapeHtml(t("lcd.builder.empty"))}</span>`;
    return;
  }

  const _showLabel    = t("lcd.builder.show");
  const _hideLabel    = t("lcd.builder.hide");
  const _invisLabel   = t("lcd.builder.invisible");
  root.innerHTML = `
    ${themeBar}
    ${fullPreview}
    ${layerList}
    <div class="btn-row" style="margin-bottom:10px;">${addButtons}</div>
    ${widgets.map((w, i) => {
      const isExpanded = !!w.expanded;
      const isHidden = !!w.hidden;
      const label = w.label || w.text || w.title || "";
      const wlbl = _wlabel(w.type);
      return `
        <div class="lcd-widget-block ${isExpanded ? "expanded" : "collapsed"}" data-widget-idx="${i}">
          <div class="lcd-widget-header" onclick="toggleLcdWidgetExpanded(${i})">
            <span><span class="lcd-collapse-arrow">${isExpanded ? "▼" : "▶"}</span> #${i + 1} ${escapeHtml(wlbl)}${label ? ` — ${escapeHtml(String(label).slice(0,20))}` : ""}${isHidden ? ` ${_invisLabel}` : ""}</span>
            <div class="btn-row" onclick="event.stopPropagation()">
              <button class="small" title="${isHidden ? _showLabel : _hideLabel}" onclick="toggleLcdWidgetVisible(${i})">${isHidden ? "⌀" : "👁"}</button>
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
  const _wlabel = (type) => (typeof getLcdWidgetLabel === "function") ? getLcdWidgetLabel(type) : (LCD_WIDGETS[type] || {}).label || type;
  const _showLabel = t("lcd.builder.show");
  const _hideLabel = t("lcd.builder.hide");
  const selectedSet = new Set(
    Array.isArray(state.lcdComposer.selectedIndices) ? state.lcdComposer.selectedIndices : []
  );
  const rows = widgets.map((w, i) => {
    const label = w.label || w.text || w.title || "";
    const hiddenIcon = w.hidden ? "⌀" : "👁";
    const selCls = selectedSet.has(i) ? " is-selected" : "";
    return `
      <div class="lcd-layer-row ${w.hidden ? "is-hidden" : ""}${selCls}">
        <button class="lcd-layer-eye" title="${w.hidden ? _showLabel : _hideLabel}" onclick="toggleLcdWidgetVisible(${i})">${hiddenIcon}</button>
        <button class="lcd-layer-name" onclick="selectLcdLayerRow(event, ${i})">#${i + 1} ${escapeHtml(_wlabel(w.type))}${label ? ` — ${escapeHtml(String(label).slice(0,18))}` : ""}</button>
      </div>`;
  }).join("");

  // Floating Action-Bar erscheint nur, wenn etwas selektiert ist.
  const selCount = selectedSet.size;
  const actionBar = selCount > 0 ? `
      <div class="lcd-select-bar">
        <span class="lcd-select-count">${escapeHtml(t("lcd.select.count", selCount))}</span>
        <div class="btn-row">
          <button class="small danger" onclick="deleteSelectedLcdWidgets()">${escapeHtml(t("lcd.select.delete"))}</button>
          <button class="small" onclick="clearLcdSelection()">${escapeHtml(t("lcd.select.clear"))}</button>
        </div>
      </div>` : "";

  return `
    <div class="lcd-layer-list">
      <div class="lcd-layer-title">${escapeHtml(t("lcd.builder.layers"))} (${widgets.length})</div>
      ${actionBar}
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
    const cards = byCat[cat].map(blockType => {
      const displayName = (typeof blockTypeLabel === "function") ? blockTypeLabel(blockType) : blockType;
      const searchName  = (displayName + " " + blockType).toLowerCase();
      return `
      <div class="palette-card" data-block-type="${escapeAttr(blockType)}" data-block-name="${escapeAttr(searchName)}">
        <span class="icon">${getCategoryIcon(cat)}</span>
        <span class="name">${escapeHtml(displayName)}</span>
      </div>`;
    }).join("");
    const catDisplay = (typeof categoryLabel === "function") ? categoryLabel(cat) : cat;
    return `
      <div class="palette-category" data-category="${escapeAttr(cat)}">
        <div class="palette-cat-header" onclick="togglePaletteCategory(this)">
          <span>${escapeHtml(catDisplay)} <span style="color:var(--muted)">(${byCat[cat].length})</span></span>
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
