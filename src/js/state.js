// ============================================================
// STATE
// ============================================================
// Globale Zustandsobjekte. Mit `var` deklariert, damit `state` in
// loadTemplate() neu zugewiesen werden kann.

// Single source of truth — wird im Header-Tag und im generierten
// Code-Attribution-Header verwendet.
const TOOL_VERSION = "5.0.0";

var state = {
  // v5.0.0 — mehrere unabhängige WENN/DANN/SONST-Pakete pro Skript.
  // Vor v5.0.0 waren conditions/actionsThen/actionsElse direkt am state;
  // jetzt sind sie pro RuleSet gegliedert. Migration siehe templates.js
  // und share.js.
  ruleSets: [{
    name: "Regel 1",
    conditions: [],   // { blockType, blockName, condId, arg, arg2, logicOp, … }
    actionsThen: [],
    actionsElse: []
  }],
  activeRuleIdx: 0,
  execMode: "argument",
  useCoroutines: false,  // v2.2.0 — verteilt LCD-Drawing über mehrere Ticks
  coroutineChunkSize: 50, // v4.3.0 — Blöcke pro Tick im Aggregator-Coroutine-Modus
  autoRecoverBlocks: false, // v2.11.0 — Default: Init in Program(), kein Closed-Recheck pro Tick
  aggRefreshInterval: 1,  // v4.3.0 — Aggregator-Listen alle N Ticks refreshen (Expert)
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

// ============================================================
// v5.0.0 — RuleSet-Helpers
// ============================================================
// Stellt sicher, dass state.ruleSets existiert und mindestens ein
// RuleSet enthält. Migriert defensiv aus den alten Top-Level-Feldern
// (state.conditions etc.), falls vorhanden — damit alte Vorlagen
// und Tokens transparent funktionieren.
function ensureRuleSetState() {
  if (!Array.isArray(state.ruleSets) || state.ruleSets.length === 0) {
    state.ruleSets = [{
      name: "Regel 1",
      conditions:  Array.isArray(state.conditions)  ? state.conditions  : [],
      actionsThen: Array.isArray(state.actionsThen) ? state.actionsThen : [],
      actionsElse: Array.isArray(state.actionsElse) ? state.actionsElse : []
    }];
    delete state.conditions;
    delete state.actionsThen;
    delete state.actionsElse;
  }
  // Jedes RuleSet defensiv strukturieren
  for (const rs of state.ruleSets) {
    if (!rs) continue;
    if (typeof rs.name !== "string") rs.name = "Regel";
    if (!Array.isArray(rs.conditions))  rs.conditions  = [];
    if (!Array.isArray(rs.actionsThen)) rs.actionsThen = [];
    if (!Array.isArray(rs.actionsElse)) rs.actionsElse = [];
  }
  if (typeof state.activeRuleIdx !== "number") state.activeRuleIdx = 0;
  if (state.activeRuleIdx < 0) state.activeRuleIdx = 0;
  if (state.activeRuleIdx >= state.ruleSets.length) {
    state.activeRuleIdx = state.ruleSets.length - 1;
  }
}

// Aktuell sichtbares RuleSet (= das im Tab-UI gewählte).
function currentRuleSet() {
  ensureRuleSetState();
  return state.ruleSets[state.activeRuleIdx];
}
