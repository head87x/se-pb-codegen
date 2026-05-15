// ============================================================
// TOOL-THEMES (v1.1.0)
// ============================================================
// Themes ändern nur die CSS-Variablen am <html data-theme="..."> —
// die UI-Struktur bleibt identisch. Auswahl persistiert in
// localStorage.
//
// Theme-Wechsel kommt OHNE Re-Render der UI aus, weil CSS-Variablen
// kaskadieren. Einzige JS-Aufgabe: data-theme-Attribut setzen + Auswahl
// in localStorage merken.

// Themes — Labels werden über i18n ("tool.theme.<value>") gezogen.
// Bei value "" greift der Spezial-Key "tool.theme.default" (Standard-Sci-Fi).
const TOOL_THEMES = [
  { value: "",           i18n: "tool.theme.default",    fallback: "Sci-Fi (Standard)" },
  { value: "dark",       i18n: "tool.theme.dark",       fallback: "Dark (neutral)" },
  { value: "light",      i18n: "tool.theme.light",      fallback: "Light" },
  { value: "cyberpunk",  i18n: "tool.theme.cyberpunk",  fallback: "Cyberpunk" },
  { value: "matrix",     i18n: "tool.theme.matrix",     fallback: "Matrix" },
  { value: "hero",       i18n: "tool.theme.hero",       fallback: "Hero (Sci-Fi-Sauber)" },
  { value: "hologram",   i18n: "tool.theme.hologram",   fallback: "Hologram (Türkis)" },
  { value: "industrial", i18n: "tool.theme.industrial", fallback: "Industrial (Werkstatt)" },
  { value: "auto",       i18n: "tool.theme.auto",       fallback: "Auto (folgt OS)" }
];

const TOOL_THEME_KEY = "se_pb_tool_theme";

function getToolTheme() {
  try {
    return localStorage.getItem(TOOL_THEME_KEY) || "";
  } catch (_) {
    return "";
  }
}

function setToolTheme(name) {
  const valid = TOOL_THEMES.some(t => t.value === name);
  const value = valid ? name : "";
  if (value) {
    document.documentElement.setAttribute("data-theme", value);
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
  try { localStorage.setItem(TOOL_THEME_KEY, value); } catch (_) {}
  const sel = document.getElementById("tool-theme-select");
  if (sel) sel.value = value;
}

// Beim ersten Laden anwenden — wird vor dem ersten render() aufgerufen
// (Script-Reihenfolge in index.html).
function initToolTheme() {
  setToolTheme(getToolTheme());
}

function toolThemeOptions() {
  const current = getToolTheme();
  const _i18n = (typeof t === "function") ? t : null;
  return TOOL_THEMES.map(th => {
    const label = _i18n ? _i18n(th.i18n) : th.fallback;
    // Wenn der i18n-Lookup den Key zurückgibt (= nicht gefunden), Fallback nutzen
    const displayed = (label === th.i18n) ? th.fallback : label;
    return `<option value="${th.value}"${th.value === current ? " selected" : ""}>${displayed}</option>`;
  }).join("");
}

// ============================================================
// v4.2.0 — Effekte-Toggle (Matrix-Scanlines + Cyberpunk-Glow)
// ============================================================
const EFFECTS_KEY = "se_pb_effects";

function getEffectsEnabled() {
  try {
    return localStorage.getItem(EFFECTS_KEY) === "true";
  } catch (_) { return false; }
}

function setEffectsEnabled(on) {
  try { localStorage.setItem(EFFECTS_KEY, on ? "true" : "false"); } catch (_) {}
  document.documentElement.classList.toggle("effects-on", !!on);
  const btn = document.getElementById("effects-toggle-btn");
  if (btn) btn.classList.toggle("active", !!on);
}

function toggleEffects() {
  setEffectsEnabled(!getEffectsEnabled());
}

function initEffects() {
  setEffectsEnabled(getEffectsEnabled());
}

// ============================================================
// v4.2.0 — Theme-Preview-Thumbnails (Custom-Dropdown)
// ============================================================
// Liefert pro Theme die 3 Schlüssel-Farben (accent / panel / text)
// für den kleinen Splitter im Dropdown. Statt CSS-Variablen-Lookup
// (würde nur das AKTUELLE Theme zeigen) hardcoden wir die Farben
// hier — analog zur styles.css.
const TOOL_THEME_COLORS = {
  "":           { accent: "#ff8c1a", panel: "#131922", text: "#d8e1ec" },
  "dark":       { accent: "#8aa0b8", panel: "#1c1f24", text: "#e2e8ee" },
  "light":      { accent: "#1e6fdb", panel: "#ffffff", text: "#1a2230" },
  "cyberpunk":  { accent: "#ff2bd1", panel: "#1a0b3a", text: "#f0e0ff" },
  "matrix":     { accent: "#00ff44", panel: "#061a06", text: "#aaffaa" },
  "hero":       { accent: "#7fb8ff", panel: "#14202e", text: "#e8f0fa" },
  "hologram":   { accent: "#5fffe0", panel: "#0a2a2e", text: "#b8e8e0" },
  "industrial": { accent: "#e07020", panel: "#232325", text: "#d0d0cc" },
  "auto":       { accent: "#888888", panel: "#444444", text: "#cccccc" }
};

function _themeSwatchHtml(value) {
  const c = TOOL_THEME_COLORS[value] || TOOL_THEME_COLORS[""];
  return `<span class="theme-swatch">
    <span class="theme-swatch-stripe" style="background:${c.accent}"></span>
    <span class="theme-swatch-stripe" style="background:${c.panel}"></span>
    <span class="theme-swatch-stripe" style="background:${c.text}"></span>
  </span>`;
}

// Befüllt das Custom-Theme-Dropdown (Trigger + Optionen-Liste).
function renderThemeDropdown() {
  const root = document.getElementById("tool-theme-dropdown");
  if (!root) return;
  const current = getToolTheme();
  const _i18n = (typeof t === "function") ? t : null;
  const labelFor = (th) => {
    const lbl = _i18n ? _i18n(th.i18n) : th.fallback;
    return (lbl === th.i18n) ? th.fallback : lbl;
  };
  const currentTh = TOOL_THEMES.find(th => th.value === current) || TOOL_THEMES[0];
  const opts = TOOL_THEMES.map(th => {
    const active = th.value === current ? " active" : "";
    return `<button type="button" class="theme-dropdown-opt${active}" data-value="${th.value}"
      onclick="_pickTheme(this.dataset.value)">
      ${_themeSwatchHtml(th.value)}<span class="theme-dropdown-label">${labelFor(th)}</span>
    </button>`;
  }).join("");
  root.innerHTML = `
    <button type="button" class="theme-dropdown-trigger" onclick="_toggleThemeDropdown(event)">
      ${_themeSwatchHtml(current)}<span class="theme-dropdown-label">${labelFor(currentTh)}</span>
      <span class="theme-dropdown-arrow">▾</span>
    </button>
    <div class="theme-dropdown-list" id="theme-dropdown-list">${opts}</div>
  `;
}

function _toggleThemeDropdown(e) {
  if (e) e.stopPropagation();
  const list = document.getElementById("theme-dropdown-list");
  if (!list) return;
  const open = list.classList.toggle("open");
  if (open) {
    setTimeout(() => {
      document.addEventListener("click", _closeThemeDropdownOnce, { once: true });
    }, 0);
  }
}

function _closeThemeDropdownOnce() {
  const list = document.getElementById("theme-dropdown-list");
  if (list) list.classList.remove("open");
}

function _pickTheme(value) {
  setToolTheme(value);
  renderThemeDropdown();
  _closeThemeDropdownOnce();
}
