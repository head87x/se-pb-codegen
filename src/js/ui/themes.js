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

const TOOL_THEMES = [
  { value: "",           label: "Sci-Fi (Standard)" },
  { value: "dark",       label: "Dark (neutral)" },
  { value: "light",      label: "Light" },
  { value: "cyberpunk",  label: "Cyberpunk" },
  { value: "matrix",     label: "Matrix" },
  { value: "hero",       label: "Hero (Sci-Fi-Sauber)" },
  { value: "hologram",   label: "Hologram (Türkis)" },
  { value: "industrial", label: "Industrial (Werkstatt)" },
  { value: "auto",       label: "Auto (folgt OS)" }
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
  return TOOL_THEMES.map(t =>
    `<option value="${t.value}"${t.value === current ? " selected" : ""}>${t.label}</option>`
  ).join("");
}
