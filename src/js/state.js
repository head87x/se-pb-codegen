// ============================================================
// STATE
// ============================================================
// Globale Zustandsobjekte. Mit `var` deklariert, damit `state` in
// loadTemplate() neu zugewiesen werden kann.

// Single source of truth — wird im Header-Tag und im generierten
// Code-Attribution-Header verwendet.
const TOOL_VERSION = "3.2.1";

var state = {
  conditions: [],   // { blockType, blockName, condId, arg, arg2, logicOp ('AND'|'OR') }
  actionsThen: [],  // { blockType, blockName, actId, arg, arg2 }
  actionsElse: [],
  execMode: "argument",
  useCoroutines: false,  // v2.2.0 — verteilt LCD-Drawing über mehrere Ticks
  autoRecoverBlocks: false, // v2.11.0 — Default: Init in Program(), kein Closed-Recheck pro Tick
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
    selectedIndices: [],     // v2.10.0 — Multi-Auswahl (Shift-Klick im Composer)
    multiLcd: {              // Phase 5 — mehrere LCDs als ein virtuelles Display
      enabled: false,
      rows: 1,
      cols: 2,
      namePattern: "LCD {col}{row}"   // {col} = A,B,C,... ; {row} = 1,2,3,...
    }
  },
  // v2.8.0 — optionale Workshop-Metadaten. Wenn enabled, werden die
  // Felder zusätzlich in den (immer vorhandenen) Attribution-Header
  // des generierten Codes eingefügt.
  scriptInfo: {
    enabled: false,
    name: "",          // Workshop-Titel
    author: "",        // Spieler-Name (User trägt selbst ein)
    version: "",       // Skript-Version (frei wählbar)
    description: "",   // Kurzbeschreibung
    tags: ""           // komma-getrennte Tags
  }
};

var templates = JSON.parse(localStorage.getItem("se_pb_templates") || "[]");
