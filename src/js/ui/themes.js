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
