// ============================================================
// STATE
// ============================================================
// Globale Zustandsobjekte. Mit `var` deklariert, damit `state` in
// loadTemplate() neu zugewiesen werden kann.

var state = {
  conditions: [],   // { blockType, blockName, condId, arg, arg2, logicOp ('AND'|'OR') }
  actionsThen: [],  // { blockType, blockName, actId, arg, arg2 }
  actionsElse: [],
  execMode: "argument",
  useCoroutines: false,  // v2.2.0 — verteilt LCD-Drawing über mehrere Ticks
  lcdEnable: false,  // alte einfache Status-Ausgabe
  lcdName: "",       // LCD-Block-Name für die alte Status-Ausgabe
  lcdComposer: {     // Phase 4a — LCD-Baukasten (Sprite-API)
    enabled: false,
    displayMode: "external", // "external" | "pb" | "cockpit"
    lcdName: "",
    surfaceIndex: 0,
    resolution: "square",    // LCD-Format-Key aus LCD_RESOLUTIONS
    columns: 1,              // 1, 2 oder 3 Spalten
    widgets: [],             // { type, ...params, widgetHeight?, colSpan? }
    multiLcd: {              // Phase 5 — mehrere LCDs als ein virtuelles Display
      enabled: false,
      rows: 1,
      cols: 2,
      namePattern: "LCD {col}{row}"   // {col} = A,B,C,... ; {row} = 1,2,3,...
    }
  }
};

var templates = JSON.parse(localStorage.getItem("se_pb_templates") || "[]");
