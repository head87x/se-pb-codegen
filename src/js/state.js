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
  lcdEnable: false,  // alte einfache Status-Ausgabe
  lcdName: "",       // LCD-Block-Name für die alte Status-Ausgabe
  lcdComposer: {     // Phase 4a — LCD-Baukasten (Sprite-API)
    enabled: false,
    lcdName: "",
    widgets: []      // { type, ...params }
  }
};

var templates = JSON.parse(localStorage.getItem("se_pb_templates") || "[]");
