// ============================================================
// LCD WIDGETS (Phase 4a + 4b)
// ============================================================
// Definitionen für die Widgets, die im LCD-Baukasten verfügbar
// sind. Jedes Widget hat:
//   label    — Anzeigename im UI
//   defaults — Initialwerte beim Hinzufügen
//   fields   — Parameter, die der User editieren kann
//              { key, label, type, options?, hint?, group? }
//   height   — geschätzte Höhe in LCD-Pixeln (für Layout-Y)
//
// Felder-Typen:
//   text       — normales Text-Feld
//   number     — Number-Spinner
//   select     — Dropdown mit options[]
//   lcd-source — Dropdown mit allen numerischen Datenquellen
//   lcd-bool   — Dropdown mit allen booleschen Datenquellen
//
// Numerische Quellen (für Statusleisten / Werte):
//   battery_charge   — Akku-Ladung (0–100 %)
//   tank_fill        — Gas-Tank-Füllstand (0–100 %)
//   cargo_fill       — Cargo Volumen-Füllstand (0–100 %)
//   reactor_output   — Reaktor-Output (MW)
//   solar_output     — Solar-Output (kW)
//   ship_speed       — Schiffsgeschwindigkeit (m/s)
//
// Boolean-Quellen (für Statusliste / Warnung):
//   block_enabled    — {v}.Enabled
//   block_working    — {v}.IsWorking
//   door_open        — Door.Status == Open
//   connector_linked — Connector verbunden
//   gear_locked      — Landing-Gear gesperrt
//   vent_pressurized — Air-Vent unter Druck

const LCD_SOURCES = [
  { value: "battery_charge", label: "Akku-Ladung (%)",        iface: "IMyBatteryBlock",   expr: "({v}.CurrentStoredPower / {v}.MaxStoredPower) * 100f", unit: "%",   min: 0, max: 100 },
  { value: "tank_fill",      label: "Tank-Füllstand (%)",     iface: "IMyGasTank",        expr: "(float)({v}.FilledRatio * 100)",                       unit: "%",   min: 0, max: 100 },
  { value: "cargo_fill",     label: "Cargo-Füllstand (%)",    iface: "IMyCargoContainer", expr: "((float){v}.GetInventory().CurrentVolume / (float){v}.GetInventory().MaxVolume) * 100f", unit: "%", min: 0, max: 100 },
  { value: "reactor_output", label: "Reaktor-Output (MW)",    iface: "IMyReactor",        expr: "{v}.CurrentOutput",                                     unit: "MW",  min: 0, max: 100 },
  { value: "solar_output",   label: "Solar-Output (kW)",      iface: "IMySolarPanel",     expr: "{v}.CurrentOutput * 1000f",                             unit: "kW",  min: 0, max: 1000 },
  { value: "ship_speed",     label: "Schiffsgeschwindigkeit", iface: "IMyShipController", expr: "(float){v}.GetShipSpeed()",                              unit: "m/s", min: 0, max: 110 }
];

const LCD_BOOL_SOURCES = [
  { value: "block_enabled",    label: "Block eingeschaltet",  iface: "IMyTerminalBlock", expr: "((IMyFunctionalBlock){v}).Enabled" },
  { value: "block_working",    label: "Block arbeitet",       iface: "IMyTerminalBlock", expr: "{v}.IsWorking" },
  { value: "door_open",        label: "Tür offen",            iface: "IMyDoor",          expr: "{v}.Status == DoorStatus.Open" },
  { value: "connector_linked", label: "Connector verbunden",  iface: "IMyShipConnector", expr: "{v}.Status == MyShipConnectorStatus.Connected" },
  { value: "gear_locked",      label: "Landing-Gear gesperrt", iface: "IMyLandingGear",  expr: "{v}.LockMode == LandingGearMode.Locked" },
  { value: "vent_pressurized", label: "Vent unter Druck",     iface: "IMyAirVent",       expr: "{v}.Status == VentStatus.Pressurized" }
];

function findLcdSource(value) {
  return LCD_SOURCES.find(s => s.value === value);
}
function findLcdBoolSource(value) {
  return LCD_BOOL_SOURCES.find(s => s.value === value);
}

// Helper: erzeugt mehrere Slot-Felder für die Statusliste
// (5 fixe Slots, jeweils label / block / check).
function _checklistSlotFields() {
  const fs = [];
  for (let n = 1; n <= 5; n++) {
    fs.push({ key: `s${n}_label`, label: `${n}. Label`,       type: "text",      group: `Zeile ${n}`, hint: "leer = Slot überspringen" });
    fs.push({ key: `s${n}_block`, label: `${n}. Block-Name`,  type: "text",      group: `Zeile ${n}` });
    fs.push({ key: `s${n}_check`, label: `${n}. Prüfung`,      type: "lcd-bool",  group: `Zeile ${n}` });
  }
  return fs;
}

const LCD_WIDGETS = {

  // ============ aus Phase 4a ============

  header: {
    label: "Header / Text",
    height: 40,
    defaults: { text: "System Status", size: 1.5, color: "255,140,26", align: "center" },
    fields: [
      { key: "text",  label: "Text",          type: "text",   hint: "Anzeigetext" },
      { key: "size",  label: "Schriftgröße",  type: "number", hint: "z.B. 1.0 oder 1.5" },
      { key: "color", label: "Farbe (R,G,B)", type: "text",   hint: "z.B. 255,140,26" },
      { key: "align", label: "Ausrichtung",   type: "select", options: [
        { value: "left",   label: "Links" },
        { value: "center", label: "Zentriert" },
        { value: "right",  label: "Rechts" }
      ]}
    ]
  },

  statusbar: {
    label: "Statusleiste (horizontal)",
    height: 35,
    defaults: { label: "Akku", sourceBlock: "", source: "battery_charge", color: "94,212,123" },
    fields: [
      { key: "label",       label: "Label",          type: "text" },
      { key: "sourceBlock", label: "Block-Name",     type: "text", hint: "exakter Name aus Terminal" },
      { key: "source",      label: "Datenquelle",    type: "lcd-source" },
      { key: "color",       label: "Farbe (R,G,B)",  type: "text", hint: "z.B. 94,212,123" }
    ]
  },

  value: {
    label: "Wert-Anzeige",
    height: 28,
    defaults: { label: "Speed", sourceBlock: "", source: "ship_speed", format: "0.0", color: "216,225,236" },
    fields: [
      { key: "label",       label: "Label",            type: "text" },
      { key: "sourceBlock", label: "Block-Name",       type: "text", hint: "exakter Name aus Terminal" },
      { key: "source",      label: "Datenquelle",      type: "lcd-source" },
      { key: "format",      label: "Nachkommastellen", type: "select", options: [
        { value: "0",    label: "0 (ganzzahlig)" },
        { value: "0.0",  label: "1 Nachkommastelle" },
        { value: "0.00", label: "2 Nachkommastellen" }
      ]},
      { key: "color",       label: "Farbe (R,G,B)", type: "text", hint: "z.B. 216,225,236" }
    ]
  },

  // ============ Phase 4b — neue Widgets ============

  statusbar_v: {
    label: "Statusleiste (vertikal)",
    height: 120,
    defaults: { label: "O₂", sourceBlock: "", source: "tank_fill", color: "78,197,255" },
    fields: [
      { key: "label",       label: "Label",         type: "text" },
      { key: "sourceBlock", label: "Block-Name",    type: "text" },
      { key: "source",      label: "Datenquelle",   type: "lcd-source" },
      { key: "color",       label: "Farbe (R,G,B)", type: "text", hint: "z.B. 78,197,255" }
    ]
  },

  statusbar_seg: {
    label: "Balken (Sci-Fi segmentiert)",
    height: 40,
    defaults: { label: "Energie", sourceBlock: "", source: "battery_charge", color: "255,140,26", segments: 12 },
    fields: [
      { key: "label",       label: "Label",         type: "text" },
      { key: "sourceBlock", label: "Block-Name",    type: "text" },
      { key: "source",      label: "Datenquelle",   type: "lcd-source" },
      { key: "color",       label: "Farbe (R,G,B)", type: "text", hint: "z.B. 255,140,26" },
      { key: "segments",    label: "Anzahl Segmente", type: "number", hint: "z.B. 12 oder 20" }
    ]
  },

  bar_double: {
    label: "Doppel-Balken",
    height: 55,
    defaults: {
      label1: "Input",  block1: "", source1: "battery_charge", color1: "94,212,123",
      label2: "Output", block2: "", source2: "battery_charge", color2: "255,85,96"
    },
    fields: [
      { key: "label1",  label: "Oben — Label",        type: "text",       group: "Oberer Balken" },
      { key: "block1",  label: "Oben — Block-Name",   type: "text",       group: "Oberer Balken" },
      { key: "source1", label: "Oben — Datenquelle",  type: "lcd-source", group: "Oberer Balken" },
      { key: "color1",  label: "Oben — Farbe (R,G,B)", type: "text",      group: "Oberer Balken" },
      { key: "label2",  label: "Unten — Label",       type: "text",       group: "Unterer Balken" },
      { key: "block2",  label: "Unten — Block-Name",  type: "text",       group: "Unterer Balken" },
      { key: "source2", label: "Unten — Datenquelle", type: "lcd-source", group: "Unterer Balken" },
      { key: "color2",  label: "Unten — Farbe (R,G,B)", type: "text",     group: "Unterer Balken" }
    ]
  },

  donut: {
    label: "Kreis-Indikator (Donut)",
    height: 140,
    defaults: { label: "Akku", sourceBlock: "", source: "battery_charge", color: "94,212,123", bgColor: "42,52,66" },
    fields: [
      { key: "label",        label: "Label",                 type: "text" },
      { key: "sourceBlock",  label: "Block-Name",            type: "text" },
      { key: "source",       label: "Datenquelle",           type: "lcd-source" },
      { key: "color",        label: "Füll-Farbe (R,G,B)",    type: "text", hint: "z.B. 94,212,123" },
      { key: "bgColor",      label: "Leer-Farbe (R,G,B)",    type: "text", hint: "Standard: 42,52,66" }
    ]
  },

  dot: {
    label: "Punkt-Indikator (Ampel)",
    height: 32,
    defaults: {
      label: "Status",
      sourceBlock: "",
      source: "battery_charge",
      lowThreshold: 25,
      highThreshold: 60,
      colorLow: "255,85,96",
      colorMid: "255,140,26",
      colorHigh: "94,212,123"
    },
    fields: [
      { key: "label",         label: "Label",                type: "text" },
      { key: "sourceBlock",   label: "Block-Name",           type: "text" },
      { key: "source",        label: "Datenquelle",          type: "lcd-source" },
      { key: "lowThreshold",  label: "Unter X = Rot",        type: "number", hint: "z.B. 25" },
      { key: "highThreshold", label: "Über X = Grün",        type: "number", hint: "z.B. 60" },
      { key: "colorLow",      label: "Farbe Niedrig",        type: "text" },
      { key: "colorMid",      label: "Farbe Mitte",          type: "text" },
      { key: "colorHigh",     label: "Farbe Hoch",           type: "text" }
    ]
  },

  checklist: {
    label: "Statusliste (✓/✗)",
    height: 130,
    defaults: {
      title: "Systeme",
      s1_label: "Reaktor",   s1_block: "", s1_check: "block_working",
      s2_label: "Schleuse",  s2_block: "", s2_check: "door_open",
      s3_label: "Connector", s3_block: "", s3_check: "connector_linked",
      s4_label: "",          s4_block: "", s4_check: "block_working",
      s5_label: "",          s5_block: "", s5_check: "block_working",
      colorOk: "94,212,123",
      colorBad: "255,85,96"
    },
    fields: [
      { key: "title",   label: "Überschrift",    type: "text" },
      { key: "colorOk",  label: "Farbe ✓",       type: "text", hint: "z.B. 94,212,123" },
      { key: "colorBad", label: "Farbe ✗",       type: "text", hint: "z.B. 255,85,96" },
      ..._checklistSlotFields()
    ]
  },

  warning: {
    label: "Warnhinweis (blinkend)",
    height: 36,
    defaults: {
      text: "WARNUNG: Energie niedrig",
      sourceBlock: "",
      source: "battery_charge",
      comparison: "lt",
      threshold: 20,
      color: "255,85,96",
      blink: "slow"
    },
    fields: [
      { key: "text",        label: "Warnung-Text",       type: "text" },
      { key: "sourceBlock", label: "Block-Name",         type: "text" },
      { key: "source",      label: "Datenquelle",        type: "lcd-source" },
      { key: "comparison",  label: "Vergleich",          type: "select", options: [
        { value: "lt", label: "Wert < Schwellwert" },
        { value: "le", label: "Wert ≤ Schwellwert" },
        { value: "gt", label: "Wert > Schwellwert" },
        { value: "ge", label: "Wert ≥ Schwellwert" }
      ]},
      { key: "threshold",   label: "Schwellwert",         type: "number", hint: "z.B. 20 (für 20 %)" },
      { key: "color",       label: "Farbe (R,G,B)",       type: "text", hint: "z.B. 255,85,96" },
      { key: "blink",       label: "Blinken",             type: "select", options: [
        { value: "none", label: "Nicht blinken" },
        { value: "slow", label: "Langsam (1×/Sek)" },
        { value: "fast", label: "Schnell (2×/Sek)" }
      ]}
    ]
  },

  alarm: {
    label: "Alarm-Banner",
    height: 50,
    defaults: {
      text: "!! KRITISCH !!",
      sourceBlock: "",
      source: "battery_charge",
      comparison: "lt",
      threshold: 10,
      bgColor: "255,85,96",
      textColor: "255,255,255",
      blink: "fast"
    },
    fields: [
      { key: "text",        label: "Banner-Text",         type: "text" },
      { key: "sourceBlock", label: "Block-Name",          type: "text" },
      { key: "source",      label: "Datenquelle",         type: "lcd-source" },
      { key: "comparison",  label: "Vergleich",           type: "select", options: [
        { value: "lt", label: "Wert < Schwellwert" },
        { value: "le", label: "Wert ≤ Schwellwert" },
        { value: "gt", label: "Wert > Schwellwert" },
        { value: "ge", label: "Wert ≥ Schwellwert" }
      ]},
      { key: "threshold",   label: "Schwellwert",         type: "number" },
      { key: "bgColor",     label: "Hintergrundfarbe",    type: "text" },
      { key: "textColor",   label: "Textfarbe",           type: "text" },
      { key: "blink",       label: "Blinken",             type: "select", options: [
        { value: "none", label: "Nicht blinken" },
        { value: "slow", label: "Langsam" },
        { value: "fast", label: "Schnell" }
      ]}
    ]
  }
};

// Reihenfolge der Add-Buttons im UI (gruppiert nach Typ)
const LCD_WIDGET_ORDER = [
  "header", "section", "divider", "spacer", "clock",
  "statusbar", "statusbar_v", "statusbar_seg", "bar_double",
  "value", "bigvalue", "iconvalue",
  "donut", "gauge", "dot",
  "aggregator",
  "checklist",
  "warning", "alarm"
];

// ============ Phase 4c — Mega-Anzeigen + Kosmetik ============

LCD_WIDGETS.section = {
  label: "Section-Header (farbiger Streifen)",
  height: 28,
  defaults: { text: "SYSTEME", bgColor: "78,197,255", textColor: "10,14,18" },
  fields: [
    { key: "text",      label: "Text",                  type: "text" },
    { key: "bgColor",   label: "Hintergrundfarbe",      type: "text", hint: "z.B. 78,197,255" },
    { key: "textColor", label: "Textfarbe",             type: "text", hint: "z.B. 10,14,18 (fast Schwarz)" }
  ]
};

LCD_WIDGETS.divider = {
  label: "Trennlinie",
  height: 18,
  defaults: { text: "", color: "42,52,66" },
  fields: [
    { key: "text",  label: "Text in der Mitte (optional)", type: "text", hint: "leer = nur Linie" },
    { key: "color", label: "Linienfarbe (R,G,B)",          type: "text", hint: "z.B. 42,52,66" }
  ]
};

LCD_WIDGETS.spacer = {
  label: "Spacer (vertikale Lücke)",
  height: 20,   // wird per height-Param überschrieben in composer
  defaults: { spaceHeight: 20 },
  fields: [
    { key: "spaceHeight", label: "Höhe in Pixeln", type: "number", hint: "z.B. 20" }
  ]
};

LCD_WIDGETS.clock = {
  label: "Uhr",
  height: 32,
  defaults: { format: "HH:mm:ss", align: "center", color: "78,197,255", size: 1.2 },
  fields: [
    { key: "format", label: "Format", type: "select", options: [
      { value: "HH:mm:ss",        label: "14:23:45" },
      { value: "HH:mm",           label: "14:23" },
      { value: "dd.MM.yyyy HH:mm", label: "11.05.2026 14:23" },
      { value: "yyyy-MM-dd",      label: "2026-05-11" }
    ]},
    { key: "align", label: "Ausrichtung", type: "select", options: [
      { value: "left",   label: "Links" },
      { value: "center", label: "Zentriert" },
      { value: "right",  label: "Rechts" }
    ]},
    { key: "color", label: "Farbe (R,G,B)",   type: "text" },
    { key: "size",  label: "Schriftgröße",    type: "number", hint: "z.B. 1.2" }
  ]
};

LCD_WIDGETS.bigvalue = {
  label: "Großes Zahlenfeld",
  height: 70,
  defaults: { label: "GESCHWINDIGKEIT", sourceBlock: "", source: "ship_speed", format: "0.0", color: "255,140,26" },
  fields: [
    { key: "label",       label: "Label oben",        type: "text" },
    { key: "sourceBlock", label: "Block-Name",        type: "text" },
    { key: "source",      label: "Datenquelle",       type: "lcd-source" },
    { key: "format",      label: "Nachkommastellen",  type: "select", options: [
      { value: "0",    label: "0 (ganzzahlig)" },
      { value: "0.0",  label: "1 Nachkommastelle" },
      { value: "0.00", label: "2 Nachkommastellen" }
    ]},
    { key: "color", label: "Farbe (R,G,B)", type: "text" }
  ]
};

LCD_WIDGETS.iconvalue = {
  label: "Icon + Wert",
  height: 38,
  defaults: { label: "O₂", icon: "IconOxygen", sourceBlock: "", source: "tank_fill", format: "0", color: "78,197,255" },
  fields: [
    { key: "label",       label: "Label",         type: "text" },
    { key: "icon",        label: "Icon",          type: "select", options: [
      { value: "IconEnergy",   label: "⚡ Energy" },
      { value: "IconHydrogen", label: "💧 Hydrogen" },
      { value: "IconOxygen",   label: "💨 Oxygen" },
      { value: "IconUranium",  label: "☢ Uranium" },
      { value: "Construction", label: "🔧 Construction" },
      { value: "Computer",     label: "💻 Computer" },
      { value: "Display",      label: "📺 Display" },
      { value: "Medkit",       label: "🩹 Medkit" },
      { value: "Powerkit",     label: "🔋 Powerkit" },
      { value: "Danger",       label: "⚠ Danger" },
      { value: "Cross",        label: "✕ Cross" },
      { value: "CrossHair",    label: "⊕ Crosshair" },
      { value: "Arrow",        label: "→ Arrow" }
    ]},
    { key: "sourceBlock", label: "Block-Name",    type: "text" },
    { key: "source",      label: "Datenquelle",   type: "lcd-source" },
    { key: "format",      label: "Nachkommastellen", type: "select", options: [
      { value: "0",    label: "0 (ganzzahlig)" },
      { value: "0.0",  label: "1 Nachkommastelle" },
      { value: "0.00", label: "2 Nachkommastellen" }
    ]},
    { key: "color", label: "Farbe (R,G,B)", type: "text" }
  ]
};

LCD_WIDGETS.aggregator = {
  label: "Multi-Block-Aggregator",
  height: 38,
  defaults: { label: "Akkus gesamt", aggregateType: "battery_charge", mode: "avg", color: "94,212,123" },
  fields: [
    { key: "label",         label: "Label",          type: "text" },
    { key: "aggregateType", label: "Was zählen?",    type: "select", options: [
      { value: "battery_charge", label: "Alle Akkus (Ladung Ø)" },
      { value: "battery_input",  label: "Alle Akkus (Strom-Input Σ)" },
      { value: "battery_output", label: "Alle Akkus (Strom-Output Σ)" },
      { value: "tank_fill",      label: "Alle Tanks (Füllstand Ø)" },
      { value: "cargo_fill",     label: "Alle Cargo (Volumen-% Ø)" },
      { value: "cargo_mass",     label: "Alle Cargo (Masse Σ kg)" },
      { value: "reactor_output", label: "Alle Reaktoren (MW Σ)" },
      { value: "solar_output",   label: "Alle Solar (kW Σ)" }
    ]},
    { key: "mode", label: "Modus", type: "select", options: [
      { value: "avg", label: "Durchschnitt (Ø)" },
      { value: "sum", label: "Summe (Σ)" },
      { value: "min", label: "Minimum" },
      { value: "max", label: "Maximum" }
    ]},
    { key: "color", label: "Farbe (R,G,B)", type: "text" }
  ]
};

LCD_WIDGETS.gauge = {
  label: "Tachometer (Halbring)",
  height: 130,
  defaults: { label: "Speed", sourceBlock: "", source: "ship_speed", min: 0, max: 110, color: "255,140,26", bgColor: "42,52,66" },
  fields: [
    { key: "label",       label: "Label",         type: "text" },
    { key: "sourceBlock", label: "Block-Name",    type: "text" },
    { key: "source",      label: "Datenquelle",   type: "lcd-source" },
    { key: "min",         label: "Min-Wert",      type: "number", hint: "z.B. 0" },
    { key: "max",         label: "Max-Wert",      type: "number", hint: "z.B. 110 (Speed) oder 100 (%)" },
    { key: "color",       label: "Zeiger-Farbe",  type: "text",   hint: "z.B. 255,140,26" },
    { key: "bgColor",     label: "Skala-Farbe",   type: "text",   hint: "Standard: 42,52,66" }
  ]
};

// Definitionen sind jetzt vorhanden — Aggregator-Quellen werden vom Composer
// direkt umgesetzt (GetBlocksOfType<...>), brauchen keinen Eintrag in LCD_SOURCES.

// ============ THEMES (Phase 4c) ============

// Themes ändern nur accent / accent2 / bg.
// success / warning / danger / text sind UNIVERSELL — grün = OK,
// gelb = Warnung, rot = Fehler. Bleibt über alle Themes konstant.
const LCD_THEMES = {
  default: {
    label: "Orange / Cyan",
    accent:  "255,140,26",   // Orange
    accent2: "78,197,255",   // Cyan
    success: "94,212,123",
    warning: "255,200,80",
    danger:  "255,85,96",
    text:    "216,225,236",
    bg:      "42,52,66"
  },
  alarm: {
    label: "Rotes Alarm-Display",
    accent:  "255,85,96",    // Rot
    accent2: "255,140,140",  // Pink (statt orange, bleibt in rot-familie)
    success: "94,212,123",
    warning: "255,200,80",
    danger:  "255,85,96",
    text:    "216,225,236",
    bg:      "62,32,32"
  },
  industrial: {
    label: "Grünes Industrie",
    accent:  "94,212,123",   // Grün
    accent2: "180,220,170",  // Hellgrün
    success: "94,212,123",
    warning: "255,200,80",
    danger:  "255,85,96",
    text:    "216,225,236",
    bg:      "32,42,38"
  },
  cyan: {
    label: "Blaues Sci-Fi",
    accent:  "78,197,255",   // Cyan
    accent2: "140,210,255",  // Hellblau (statt orange)
    success: "94,212,123",
    warning: "255,200,80",
    danger:  "255,85,96",
    text:    "216,225,236",
    bg:      "32,42,62"
  }
};

// Welcher Theme-Slot bestimmt welche Widget-Farbe?
// Beim Theme-Apply werden diese Felder eindeutig anhand des Slots
// auf die neue Theme-Farbe gesetzt — unabhängig vom aktuellen Wert.
// Felder, die hier nicht aufgeführt sind (z.B. alarm.textColor=white),
// werden beim Theme-Wechsel NICHT angetastet.
const LCD_WIDGET_COLOR_SLOTS = {
  header:        { color:    "accent" },
  statusbar:     { color:    "success" },
  statusbar_v:   { color:    "accent2" },
  statusbar_seg: { color:    "accent" },
  bar_double:    { color1:   "success", color2: "danger" },
  donut:         { color:    "success", bgColor: "bg" },
  dot:           { colorLow: "danger",  colorMid: "accent", colorHigh: "success" },
  checklist:     { colorOk:  "success", colorBad: "danger" },
  warning:       { color:    "danger" },
  alarm:         { bgColor:  "danger" },
  section:       { bgColor:  "accent2" },
  divider:       { color:    "bg" },
  clock:         { color:    "accent2" },
  value:         { color:    "text" },
  bigvalue:      { color:    "accent" },
  iconvalue:     { color:    "accent2" },
  aggregator:    { color:    "success" },
  gauge:         { color:    "accent",  bgColor: "bg" }
};

const LCD_THEME_ORDER = ["default", "alarm", "industrial", "cyan"];

function findLcdWidget(type) {
  return LCD_WIDGETS[type];
}
