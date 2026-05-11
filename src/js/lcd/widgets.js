// ============================================================
// LCD WIDGETS (Phase 4a)
// ============================================================
// Definitionen für die Widgets, die im LCD-Baukasten verfügbar
// sind. Jedes Widget hat:
//   label   — Anzeigename im UI
//   defaults — Initialwerte beim Hinzufügen
//   fields  — Parameter, die der User editieren kann
//             { key, label, type, options?, hint?, group? }
//   height  — geschätzte Höhe in LCD-Pixeln (für Layout-Y)
//
// Verfügbare Quellen für Wert-/Statusleisten-Widgets:
//   battery_charge   — Akku-Ladung (0–100 %)
//   tank_fill        — Gas-Tank-Füllstand (0–100 %)
//   cargo_fill       — Cargo Volumen-Füllstand (0–100 %)
//   reactor_output   — Reaktor-Output (MW)
//   solar_output     — Solar-Output (kW)
//   ship_speed       — Schiffsgeschwindigkeit (m/s, braucht Cockpit)
//   static_text      — Reiner statischer Text (nur Header)

const LCD_SOURCES = [
  { value: "battery_charge", label: "Akku-Ladung (%)",        iface: "IMyBatteryBlock",   expr: "({v}.CurrentStoredPower / {v}.MaxStoredPower) * 100f", unit: "%",  min: 0, max: 100 },
  { value: "tank_fill",      label: "Tank-Füllstand (%)",     iface: "IMyGasTank",        expr: "(float)({v}.FilledRatio * 100)",                       unit: "%",  min: 0, max: 100 },
  { value: "cargo_fill",     label: "Cargo-Füllstand (%)",    iface: "IMyCargoContainer", expr: "((float){v}.GetInventory().CurrentVolume / (float){v}.GetInventory().MaxVolume) * 100f", unit: "%", min: 0, max: 100 },
  { value: "reactor_output", label: "Reaktor-Output (MW)",    iface: "IMyReactor",        expr: "{v}.CurrentOutput",                                     unit: "MW", min: 0, max: 100 },
  { value: "solar_output",   label: "Solar-Output (kW)",      iface: "IMySolarPanel",     expr: "{v}.CurrentOutput * 1000f",                             unit: "kW", min: 0, max: 1000 },
  { value: "ship_speed",     label: "Schiffsgeschwindigkeit", iface: "IMyShipController", expr: "(float){v}.GetShipSpeed()",                              unit: "m/s", min: 0, max: 110 }
];

function findLcdSource(value) {
  return LCD_SOURCES.find(s => s.value === value);
}

const LCD_WIDGETS = {

  header: {
    label: "Header / Text",
    height: 40,
    defaults: { text: "System Status", size: 1.5, color: "255,140,26", align: "center" },
    fields: [
      { key: "text",  label: "Text",       type: "text",   hint: "Anzeigetext" },
      { key: "size",  label: "Schriftgröße", type: "number", hint: "z.B. 1.0 oder 1.5" },
      { key: "color", label: "Farbe (R,G,B)", type: "text",  hint: "z.B. 255,140,26" },
      { key: "align", label: "Ausrichtung", type: "select", options: [
        { value: "left",   label: "Links" },
        { value: "center", label: "Zentriert" },
        { value: "right",  label: "Rechts" }
      ]}
    ]
  },

  statusbar: {
    label: "Statusleiste",
    height: 35,
    defaults: { label: "Akku", sourceBlock: "", source: "battery_charge", color: "94,212,123" },
    fields: [
      { key: "label",       label: "Label",       type: "text" },
      { key: "sourceBlock", label: "Block-Name",  type: "text", hint: "exakter Name aus Terminal" },
      { key: "source",      label: "Datenquelle", type: "lcd-source" },
      { key: "color",       label: "Farbe (R,G,B)", type: "text", hint: "Akku=94,212,123 / Tank=78,197,255" }
    ]
  },

  value: {
    label: "Wert-Anzeige",
    height: 28,
    defaults: { label: "Speed", sourceBlock: "", source: "ship_speed", format: "0.0", color: "216,225,236" },
    fields: [
      { key: "label",       label: "Label",       type: "text" },
      { key: "sourceBlock", label: "Block-Name",  type: "text", hint: "exakter Name aus Terminal" },
      { key: "source",      label: "Datenquelle", type: "lcd-source" },
      { key: "format",      label: "Nachkommastellen", type: "select", options: [
        { value: "0",   label: "0 (ganzzahlig)" },
        { value: "0.0", label: "1 Nachkommastelle" },
        { value: "0.00", label: "2 Nachkommastellen" }
      ]},
      { key: "color",       label: "Farbe (R,G,B)", type: "text", hint: "z.B. 216,225,236" }
    ]
  }
};

const LCD_WIDGET_ORDER = ["header", "statusbar", "value"];

function findLcdWidget(type) {
  return LCD_WIDGETS[type];
}
