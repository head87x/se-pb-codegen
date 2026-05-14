// ============================================================
// TEMPLATES (localStorage-basiert)
// ============================================================

function renderTemplates() {
  const root = document.getElementById("templates");
  if (templates.length === 0) {
    root.innerHTML = '<span class="empty-hint">Keine Vorlagen gespeichert.</span>';
    return;
  }
  root.innerHTML = templates.map((t, i) => `
    <span class="template-chip">
      <span onclick="loadTemplate(${i})">${escapeHtml(t.name)}</span>
      <span class="x" onclick="deleteTemplate(${i})">✕</span>
    </span>
  `).join("");
}

async function saveTemplate() {
  const name = await showPrompt(t("templates.prompt_name"), "", { placeholder: t("templates.prompt_ph") });
  if (!name) return;
  templates.push({ name, state: JSON.parse(JSON.stringify(state)) });
  localStorage.setItem("se_pb_templates", JSON.stringify(templates));
  render();
  showToast(t("toast.template_saved", name));
}

function loadTemplate(i) {
  state = JSON.parse(JSON.stringify(templates[i].state));
  // Alte Vorlagen haben evtl. keinen lcdComposer — defaulten
  if (!state.lcdComposer) state.lcdComposer = { enabled: false, lcdName: "", widgets: [] };
  // Neue Felder ab "Display-Quelle"-Update
  if (!state.lcdComposer.displayMode)  state.lcdComposer.displayMode = "external";
  if (state.lcdComposer.surfaceIndex == null) state.lcdComposer.surfaceIndex = 0;
  // Phase 4d Felder
  if (!state.lcdComposer.resolution)   state.lcdComposer.resolution = "square";
  // Phase 5: Multi-LCD-Default für ältere Vorlagen
  if (!state.lcdComposer.multiLcd) {
    state.lcdComposer.multiLcd = { enabled: false, rows: 1, cols: 2, namePattern: "LCD {col}{row}" };
  }
  // v2.2.0: Coroutines-Toggle defensiv defaulten
  if (typeof state.useCoroutines !== "boolean") state.useCoroutines = false;
  // v2.4.0: Gruppen-Semantik defaulten (alte Vorlagen kannten nur "any")
  if (Array.isArray(state.conditions)) {
    for (const c of state.conditions) {
      if (typeof c.groupSemantic !== "string") c.groupSemantic = "any";
      if (typeof c.groupCount !== "number") c.groupCount = 1;
    }
  }
  // v2.8.0: scriptInfo defaulten (alte Vorlagen haben das Feld nicht)
  if (!state.scriptInfo) {
    state.scriptInfo = { enabled: false, name: "", author: "", version: "", description: "", tags: "" };
  }
  // v2.10.0: selectedIndices defaulten (Multi-Select). Vorlagen tragen die
  // Selektion nicht persistent — beim Laden wird sie immer geleert.
  state.lcdComposer.selectedIndices = [];

  // Migration: alte Grid-Widgets in Manual-Modus konvertieren.
  // Setzt einen einfachen vertikalen Stack als initiale Position.
  if (state.lcdComposer.widgets) {
    let y = 8;
    for (const w of state.lcdComposer.widgets) {
      if (w.manualX == null || w.manualY == null) {
        const md = (typeof LCD_MANUAL_DEFAULTS !== "undefined" && LCD_MANUAL_DEFAULTS[w.type])
          ? LCD_MANUAL_DEFAULTS[w.type]
          : { w: 200, h: 40 };
        w.manualX = 8;
        w.manualY = y;
        if (w.manualW == null) w.manualW = md.w;
        if (w.manualH == null) w.manualH = md.h;
        y += w.manualH + 8;
      }
    }
  }

  // Re-apply UI fields
  document.getElementById("exec-mode").value = state.execMode;
  const coroEl = document.getElementById("exec-coroutines");
  if (coroEl) coroEl.checked = !!state.useCoroutines;
  document.getElementById("lcd-enable").checked = !!state.lcdEnable;
  document.getElementById("lcd-name").value = state.lcdName || "";
  document.getElementById("lcd-config").style.display = state.lcdEnable ? "block" : "none";
  document.getElementById("lcd-composer-enable").checked = !!state.lcdComposer.enabled;
  document.getElementById("lcd-composer-name").value = state.lcdComposer.lcdName || "";
  document.getElementById("lcd-composer-mode").value = state.lcdComposer.displayMode;
  document.getElementById("lcd-composer-surface").value = state.lcdComposer.surfaceIndex;
  document.getElementById("lcd-composer-resolution").value = state.lcdComposer.resolution;
  document.getElementById("lcd-composer-config").style.display = state.lcdComposer.enabled ? "block" : "none";
  // v2.8.0 — Skript-Info-Felder
  const _info = state.scriptInfo || { enabled: false };
  const _setVal = (id, v) => { const e = document.getElementById(id); if (e) e.value = v || ""; };
  const _setChk = (id, v) => { const e = document.getElementById(id); if (e) e.checked = !!v; };
  _setChk("info-enable", _info.enabled);
  _setVal("info-name",        _info.name);
  _setVal("info-author",      _info.author);
  _setVal("info-version",     _info.version);
  _setVal("info-tags",        _info.tags);
  _setVal("info-description", _info.description);
  const _infoFields = document.getElementById("info-fields");
  if (_infoFields) _infoFields.style.display = _info.enabled ? "block" : "none";
  render();
  if (typeof _refreshBlockNameValidation === "function") {
    _refreshBlockNameValidation(document.getElementById("lcd-name"));
    _refreshBlockNameValidation(document.getElementById("lcd-composer-name"));
  }
  showToast(t("toast.template_loaded", templates[i].name));
}

async function deleteTemplate(i) {
  if (!await showConfirm(t("templates.delete_q", templates[i].name), { confirmLabel: t("templates.delete_btn") })) return;
  templates.splice(i, 1);
  localStorage.setItem("se_pb_templates", JSON.stringify(templates));
  render();
}

async function newProject() {
  if (!await showConfirm(t("templates.new_q"), { confirmLabel: t("templates.new_btn") })) return;
  state = {
    conditions: [], actionsThen: [], actionsElse: [],
    execMode: "argument", useCoroutines: false, lcdEnable: false, lcdName: "",
    lcdComposer: { enabled: false, displayMode: "external", lcdName: "", surfaceIndex: 0, resolution: "square", widgets: [], selectedIndices: [] },
    scriptInfo: { enabled: false, name: "", author: "", version: "", description: "", tags: "" }
  };
  document.getElementById("exec-mode").value = "argument";
  const coroEl2 = document.getElementById("exec-coroutines");
  if (coroEl2) coroEl2.checked = false;
  document.getElementById("lcd-enable").checked = false;
  document.getElementById("lcd-name").value = "";
  document.getElementById("lcd-config").style.display = "none";
  document.getElementById("lcd-composer-enable").checked = false;
  document.getElementById("lcd-composer-name").value = "";
  document.getElementById("lcd-composer-mode").value = "external";
  document.getElementById("lcd-composer-surface").value = 0;
  document.getElementById("lcd-composer-resolution").value = "square";
  document.getElementById("lcd-composer-config").style.display = "none";
  // v2.8.0 — Skript-Info zurücksetzen
  const _resetInfo = (id, isChk) => {
    const e = document.getElementById(id);
    if (!e) return;
    if (isChk) e.checked = false; else e.value = "";
  };
  _resetInfo("info-enable", true);
  _resetInfo("info-name", false);
  _resetInfo("info-author", false);
  _resetInfo("info-version", false);
  _resetInfo("info-tags", false);
  _resetInfo("info-description", false);
  const _infoFieldsReset = document.getElementById("info-fields");
  if (_infoFieldsReset) _infoFieldsReset.style.display = "none";
  render();
  if (typeof _refreshBlockNameValidation === "function") {
    _refreshBlockNameValidation(document.getElementById("lcd-name"));
    _refreshBlockNameValidation(document.getElementById("lcd-composer-name"));
  }
}

// ============================================================
// v2.9.0 — Vorlagen-Datei-Export / -Import als .json
// ============================================================

const TEMPLATES_FILE_FORMAT  = "se-pb-codegen-templates";
const TEMPLATES_FILE_VERSION = 1;

function exportTemplates() {
  if (!templates || templates.length === 0) {
    showToast(t("templates.export_empty"));
    return;
  }
  const payload = {
    _format:     TEMPLATES_FILE_FORMAT,
    _version:    TEMPLATES_FILE_VERSION,
    exportedAt:  (new Date()).toISOString().slice(0, 10),
    toolVersion: (typeof TOOL_VERSION === "string") ? TOOL_VERSION : "?",
    templates:   templates
  };
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = "se-pb-templates-" + payload.exportedAt + ".json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(t("templates.export_ok", templates.length));
}

function importTemplates() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json,application/json";
  input.onchange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        _processImportedTemplates(data);
      } catch (err) {
        showToast(t("templates.import_err_parse"));
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

// Eindeutigen Namen erzeugen, indem " (2)", " (3)", … angehängt wird,
// bis der Name in der aktuellen `templates`-Liste nicht mehr vorkommt.
function _uniqueTemplateName(base) {
  const existing = new Set(templates.map(x => x.name));
  if (!existing.has(base)) return base;
  let n = 2;
  while (existing.has(base + " (" + n + ")")) n++;
  return base + " (" + n + ")";
}

async function _processImportedTemplates(data) {
  if (!data || data._format !== TEMPLATES_FILE_FORMAT) {
    showToast(t("templates.import_err_format"));
    return;
  }
  if (!Array.isArray(data.templates) || data.templates.length === 0) {
    showToast(t("templates.import_err_empty"));
    return;
  }
  // Token-Schema-Versions-Check (analog share.js): nur warnen, nicht
  // blockieren — Migration läuft beim Laden der Vorlage selbst.
  if (typeof data._version === "number" && data._version > TEMPLATES_FILE_VERSION) {
    showToast(t("templates.import_warn_version", data._version));
  }

  // Bestätigung beim User holen — Import erweitert die Liste, keine
  // bestehenden Einträge werden überschrieben (Konflikt = umbenennen).
  const ok = await showConfirm(
    t("templates.import_confirm", data.templates.length),
    { confirmLabel: t("templates.import_btn") }
  );
  if (!ok) return;

  let added = 0;
  for (const incoming of data.templates) {
    if (!incoming || typeof incoming.name !== "string" || !incoming.state) continue;
    const uniqueName = _uniqueTemplateName(incoming.name);
    templates.push({ name: uniqueName, state: incoming.state });
    added++;
  }
  localStorage.setItem("se_pb_templates", JSON.stringify(templates));
  render();
  showToast(t("templates.import_ok", added));
}
