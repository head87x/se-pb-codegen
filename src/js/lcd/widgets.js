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
  "header",
  "statusbar", "statusbar_v", "statusbar_seg", "bar_double",
  "value",
  "donut", "dot",
  "checklist",
  "warning", "alarm"
];

function findLcdWidget(type) {
  return LCD_WIDGETS[type];
}
