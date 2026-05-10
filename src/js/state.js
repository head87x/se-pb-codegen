// ============================================================
// STATE
// ============================================================
// Globale Zustandsobjekte. Mit `var` deklariert, damit `state` in
// loadTemplate() neu zugewiesen werden kann.

var state = {
  conditions: [],   // { blockType, blockName, condId, arg, logicOp ('AND'|'OR') }
  actionsThen: [],  // { blockType, blockName, actId, arg }
  actionsElse: [],
  execMode: "argument",
  lcdEnable: false,
  lcdName: ""
};

var templates = JSON.parse(localStorage.getItem("se_pb_templates") || "[]");
