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
    lcdComposer: { enabled: false, displayMode: "external", lcdName: "", surfaceIndex: 0, resolution: "square", widgets: [] }
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
  render();
  if (typeof _refreshBlockNameValidation === "function") {
    _refreshBlockNameValidation(document.getElementById("lcd-name"));
    _refreshBlockNameValidation(document.getElementById("lcd-composer-name"));
  }
}
