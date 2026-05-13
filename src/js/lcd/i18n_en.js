// ============================================================
// LCD i18n EN (v2.1.0) — Englisch für LCD-Baukasten
// ============================================================
// Stil analog zu src/js/blocks/i18n_en.js: externe Maps, originale
// DE-Schlüssel in widgets.js bleiben unverändert (sprach-unabhängige
// Identifier für Vorlagen/Token).

// Widget-Titel (Header / Statusleiste etc.) — erscheinen als
// "+ HEADER / TEXT"-Buttons, in Layer-Liste und Widget-Karten.
const LCD_WIDGETS_EN = {
  header:        "Header / Text",
  statusbar:     "Status bar (horizontal)",
  statusbar_v:   "Status bar (vertical)",
  statusbar_seg: "Bar (Sci-Fi segmented)",
  bar_double:    "Double-bar",
  value:         "Value display",
  bigvalue:      "Large number",
  iconvalue:     "Icon + Value",
  donut:         "Ring indicator (Donut)",
  dot:           "Dot indicator (Traffic-light)",
  gauge:         "Gauge (half-ring)",
  checklist:     "Status list (✓/✗)",
  warning:       "Warning (blinking)",
  alarm:         "Alarm banner",
  section:       "Section header (colored stripe)",
  divider:       "Divider line",
  spacer:        "Spacer (vertical gap)",
  clock:         "Clock",
  aggregator:    "Multi-block aggregator"
};

// Gemeinsame Feld-Übersetzungen — gelten widgetübergreifend, wenn
// kein widget-spezifischer Override existiert.
const LCD_FIELD_LABELS_COMMON_EN = {
  label:        "Label",
  text:         "Text",
  title:        "Title",
  color:        "Color (R,G,B)",
  bgColor:      "Background color (R,G,B)",
  textColor:    "Text color (R,G,B)",
  size:         "Font size",
  align:        "Alignment",
  sourceBlock:  "Block name",
  source:       "Data source",
  format:       "Decimal places",
  icon:         "Icon",
  threshold:    "Threshold",
  comparison:   "Comparison",
  blink:        "Blink",
  segments:     "Segments",
  spaceHeight:  "Height in pixels",
  min:          "Min value",
  max:          "Max value",
  aggregateType:"What to aggregate?",
  mode:         "Mode",
  widgetBg:     "Widget background"
};

// Widget-spezifische Field-Overrides (wo die Standard-Übersetzung
// nicht passt — z. B. donut.color="Fill color" statt "Color").
const LCD_FIELD_LABELS_EN = {
  donut:    { color: "Fill color (R,G,B)", bgColor: "Empty color (R,G,B)" },
  gauge:    { color: "Needle color", bgColor: "Scale color" },
  dot: {
    lowThreshold:  "Below X = Red",
    highThreshold: "Above X = Green",
    colorLow:      "Color Low",
    colorMid:      "Color Mid",
    colorHigh:     "Color High"
  },
  bar_double: {
    label1: "Top — Label",    block1: "Top — Block name",
    source1: "Top — Data source", color1: "Top — Color (R,G,B)",
    label2: "Bottom — Label", block2: "Bottom — Block name",
    source2: "Bottom — Data source", color2: "Bottom — Color (R,G,B)"
  },
  checklist: {
    colorOk:  "Color ✓",
    colorBad: "Color ✗"
  },
  warning: {
    text: "Warning text"
  },
  alarm: {
    text: "Banner text"
  },
  section: {
    text: "Text"
  },
  divider: {
    text: "Text in the middle (optional)",
    color: "Line color (R,G,B)"
  },
  bigvalue: {
    label: "Label on top",
    size: "Font size (number)"
  },
  iconvalue: {
    label: "Label"
  },
  clock: {
    format: "Format"
  }
};

// Hint-Texte (kleine Erklärungen unter Feldern)
const LCD_FIELD_HINTS_EN = {
  // Globale Defaults
  _common: {
    sourceBlock: "exact name from terminal",
    color:       "e.g. 94,212,123",
    size:        "e.g. 1.0 or 1.5"
  },
  header: {
    text: "Display text",
    color: "e.g. 255,140,26"
  },
  donut:    { bgColor: "Default: 42,52,66" },
  gauge:    { bgColor: "Default: 42,52,66", color: "e.g. 255,140,26",
              min: "e.g. 0", max: "e.g. 110 (Speed) or 100 (%)" },
  statusbar_seg: { segments: "e.g. 12 or 20" },
  dot: {
    lowThreshold:  "e.g. 25",
    highThreshold: "e.g. 60"
  },
  warning: {
    threshold: "e.g. 20 (for 20 %)",
    color:     "e.g. 255,85,96"
  },
  bigvalue: {
    size: "e.g. 2.0 or 2.5"
  },
  iconvalue: {
    size: "e.g. 1.1"
  },
  clock: {
    size: "e.g. 1.2"
  },
  divider: {
    text:  "empty = line only",
    color: "e.g. 42,52,66"
  },
  spacer: {
    spaceHeight: "e.g. 20"
  },
  section: {
    bgColor:   "e.g. 78,197,255",
    textColor: "e.g. 10,14,18 (almost black)"
  }
};

// Option-Labels in Select-Feldern (align: "Links/Zentriert/Rechts" etc.)
const LCD_FIELD_OPTIONS_EN = {
  align: { left: "Left", center: "Center", right: "Right" },
  format: {
    "0":    "0 (integer)",
    "0.0":  "1 decimal",
    "0.00": "2 decimals"
  },
  comparison: {
    lt: "Value < Threshold",
    le: "Value ≤ Threshold",
    gt: "Value > Threshold",
    ge: "Value ≥ Threshold"
  },
  blink: {
    none: "No blink",
    slow: "Slow (1×/sec)",
    fast: "Fast (2×/sec)"
  },
  // bigvalue / clock format
  clock_format: {
    "HH:mm:ss":         "14:23:45",
    "HH:mm":            "14:23",
    "dd.MM.yyyy HH:mm": "11.05.2026 14:23",
    "yyyy-MM-dd":       "2026-05-11"
  },
  // iconvalue icons
  icon: {
    IconEnergy:   "⚡ Energy",
    IconHydrogen: "💧 Hydrogen",
    IconOxygen:   "💨 Oxygen",
    IconUranium:  "☢ Uranium",
    Construction: "🔧 Construction",
    Computer:     "💻 Computer",
    Display:      "📺 Display",
    Medkit:       "🩹 Medkit",
    Powerkit:     "🔋 Powerkit",
    Danger:       "⚠ Danger",
    Cross:        "✕ Cross",
    CrossHair:    "⊕ Crosshair",
    Arrow:        "→ Arrow"
  },
  // aggregator types
  aggregateType: {
    battery_charge: "All batteries (charge avg)",
    battery_input:  "All batteries (input sum)",
    battery_output: "All batteries (output sum)",
    tank_fill:      "All tanks (fill avg)",
    cargo_fill:     "All cargo (volume avg)",
    cargo_mass:     "All cargo (mass sum, kg)",
    reactor_output: "All reactors (MW sum)",
    solar_output:   "All solar (kW sum)"
  },
  // aggregator modes
  mode: {
    avg: "Average (Ø)",
    sum: "Sum (Σ)",
    min: "Minimum",
    max: "Maximum"
  }
};

// Gruppen-Labels in den Widget-Editor-Cards (z. B. "Zeile 1", "Oberer Balken")
const LCD_FIELD_GROUPS_EN = {
  "Zeile 1": "Row 1", "Zeile 2": "Row 2", "Zeile 3": "Row 3", "Zeile 4": "Row 4", "Zeile 5": "Row 5",
  "Oberer Balken": "Top bar", "Unterer Balken": "Bottom bar"
};

// LCD-Themes (Composer-Theme-Bar, nicht das Tool-Theme!)
const LCD_THEMES_EN = {
  default:    "Orange",
  alarm:      "Red (Alarm)",
  industrial: "Green (Industrial)",
  cyan:       "Blue (Sci-Fi)"
};

// LCD-Auflösungen
const LCD_RESOLUTIONS_EN = {
  square:  "Standard LCD / PB (1:1)",
  wide:    "Wide LCD (2:1)",
  tall:    "Tall LCD (1:2)",
  big_3x3: "Big LCD Panel 3×3 (1:1)"
};

// LCD-Presets (Schnellstart)
const LCD_PRESETS_EN = {
  ship_overview: {
    label: "Ship Overview",
    description: "Header + Battery/H2 donuts + Speed + Cargo statusbar (for square LCD)"
  },
  four_donuts: {
    label: "4 Donuts (2×2)",
    description: "Compact 2×2 grid with four ring indicators"
  },
  reactor_panel: {
    label: "Energy Panel",
    description: "Aggregator over all batteries/reactors + warning on low battery"
  },
  cockpit_gauges: {
    label: "Cockpit Gauges",
    description: "Gauge + two status bars — works well on a cockpit surface"
  },
  wide_dashboard: {
    label: "Wide Dashboard (2:1)",
    description: "For wide LCD: 3 columns with donuts + values + checklist"
  }
};

// Numerische Datenquellen
const LCD_SOURCES_EN = {
  battery_charge: "Battery charge (%)",
  tank_fill:      "Tank fill (%)",
  cargo_fill:     "Cargo fill (%)",
  reactor_output: "Reactor output (MW)",
  solar_output:   "Solar output (kW)",
  ship_speed:     "Ship speed"
};

// Boolean-Datenquellen
const LCD_BOOL_SOURCES_EN = {
  block_enabled:    "Block enabled",
  block_working:    "Block working",
  door_open:        "Door open",
  connector_linked: "Connector linked",
  gear_locked:      "Landing-Gear locked",
  vent_pressurized: "Vent pressurized"
};

// ============================================================
// Helper-Funktionen — alle mit DE-Fallback
// ============================================================

function _lcdIsEn() {
  return typeof getLang === "function" && getLang() === "en";
}

function getLcdWidgetLabel(type) {
  if (_lcdIsEn() && LCD_WIDGETS_EN[type]) return LCD_WIDGETS_EN[type];
  const def = (typeof LCD_WIDGETS !== "undefined") ? LCD_WIDGETS[type] : null;
  return def ? def.label : type;
}

function getLcdFieldLabel(widgetType, fieldKey, fallback) {
  if (_lcdIsEn()) {
    const wOverride = LCD_FIELD_LABELS_EN[widgetType];
    if (wOverride && wOverride[fieldKey]) return wOverride[fieldKey];
    if (LCD_FIELD_LABELS_COMMON_EN[fieldKey]) return LCD_FIELD_LABELS_COMMON_EN[fieldKey];
  }
  return fallback || fieldKey;
}

function getLcdHintLabel(widgetType, fieldKey, fallback) {
  if (_lcdIsEn()) {
    const w = LCD_FIELD_HINTS_EN[widgetType];
    if (w && w[fieldKey]) return w[fieldKey];
    const common = LCD_FIELD_HINTS_EN._common;
    if (common && common[fieldKey]) return common[fieldKey];
  }
  return fallback || "";
}

// optionsContext z. B. "align" / "format" / "blink" / "icon" / "aggregateType" / "mode"
function getLcdOptionLabel(optionsContext, value, fallback) {
  if (_lcdIsEn()) {
    const map = LCD_FIELD_OPTIONS_EN[optionsContext];
    if (map && map[value]) return map[value];
  }
  return fallback || value;
}

function getLcdGroupLabel(deGroup) {
  if (_lcdIsEn() && LCD_FIELD_GROUPS_EN[deGroup]) return LCD_FIELD_GROUPS_EN[deGroup];
  return deGroup;
}

function getLcdThemeLabel(key) {
  if (_lcdIsEn() && LCD_THEMES_EN[key]) return LCD_THEMES_EN[key];
  const t = (typeof LCD_THEMES !== "undefined") ? LCD_THEMES[key] : null;
  return t ? t.label : key;
}

function getLcdPresetMeta(key) {
  if (_lcdIsEn() && LCD_PRESETS_EN[key]) return LCD_PRESETS_EN[key];
  const p = (typeof LCD_PRESETS !== "undefined") ? LCD_PRESETS[key] : null;
  return p ? { label: p.label, description: p.description } : { label: key, description: "" };
}

function getLcdResolutionLabel(key) {
  if (_lcdIsEn() && LCD_RESOLUTIONS_EN[key]) return LCD_RESOLUTIONS_EN[key];
  const r = (typeof LCD_RESOLUTIONS !== "undefined") ? LCD_RESOLUTIONS[key] : null;
  return r ? r.label : key;
}

function getLcdSourceLabel(value) {
  if (_lcdIsEn() && LCD_SOURCES_EN[value]) return LCD_SOURCES_EN[value];
  const s = (typeof LCD_SOURCES !== "undefined") ? LCD_SOURCES.find(x => x.value === value) : null;
  return s ? s.label : value;
}

function getLcdBoolSourceLabel(value) {
  if (_lcdIsEn() && LCD_BOOL_SOURCES_EN[value]) return LCD_BOOL_SOURCES_EN[value];
  const s = (typeof LCD_BOOL_SOURCES !== "undefined") ? LCD_BOOL_SOURCES.find(x => x.value === value) : null;
  return s ? s.label : value;
}
