// ============================================================
// HELPERS (Escaping, Variablen-Namen)
// ============================================================

function escapeHtml(s) { return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function escapeAttr(s) { return String(s || "").replace(/"/g,"&quot;"); }
function escapeCs(s)   { return String(s || "").replace(/"/g,'\\"'); }

function safeVar(name, suffix) {
  const base = (name || "block").replace(/[^a-zA-Z0-9]/g, "_");
  let v = base.charAt(0).match(/[a-zA-Z_]/) ? base : "_" + base;
  v = v.charAt(0).toLowerCase() + v.slice(1);
  return v + (suffix || "");
}

// ============================================================
// PLATZHALTER-ERSETZUNG ({arg} zuerst, dann {v})
// ============================================================

// "_custom" ist ein UI-Sentinel — kommt nur vor, wenn der User
// "Custom..." im Subtype-Dropdown gewählt, aber noch nichts ins
// Text-Feld getippt hat. Im Generator wie leerer Wert behandeln.
function _safeArg(val, fallback) {
  if (val === "_custom" || val === undefined || val === null) return fallback;
  return val || fallback;
}

function condExpr(c, varName) {
  const cond = findCond(c.blockType, c.condId);
  if (!cond) return "true";
  let expr = cond.expr;
  // arg2 zuerst, damit "{arg2}" nicht durch "{arg}"-Match gestört wird
  if (cond.arg2) expr = expr.replace(/\{arg2\}/g, _safeArg(c.arg2, "0"));
  if (cond.arg)  expr = expr.replace(/\{arg\}/g,  _safeArg(c.arg,  "0"));
  expr = expr.replace(/\{v\}/g, varName);
  return expr;
}

function actCode(a, varName) {
  const act = findAct(a.blockType, a.actId);
  if (!act) return "// (keine Aktion)";
  let code = act.code;
  if (act.arg2) code = code.replace(/\{arg2\}/g, _safeArg(a.arg2, ""));
  if (act.arg)  code = code.replace(/\{arg\}/g,  _safeArg(a.arg,  ""));
  code = code.replace(/\{v\}/g, varName);
  return code;
}

// ============================================================
// CODE GENERATION
// ============================================================

function generateCode() {
  // Collect unique blocks needed (for fetching once at start of Main).
  // Einzelblock und Gruppe für denselben Namen bekommen separate Einträge
  // (sind unterschiedliche C#-Typen — Block vs. List<Block>).
  const blockMap = new Map();
  const ensureBlock = (blockType, blockName, useGroup) => {
    if (!blockName || !blockName.trim()) return null;
    const key = blockName + "::" + blockType + "::" + (useGroup ? "g" : "s");
    if (blockMap.has(key)) return blockMap.get(key);
    const def = BLOCKS[blockType];
    const entry = {
      varName: safeVar(blockName, "_" + blockMap.size),
      blockType, blockName,
      interface: def.interface,
      isGroup: !!useGroup
    };
    blockMap.set(key, entry);
    return entry;
  };

  state.conditions.forEach(c => ensureBlock(c.blockType, c.blockName, c.useGroup));
  state.actionsThen.forEach(a => ensureBlock(a.blockType, a.blockName, a.useGroup));
  state.actionsElse.forEach(a => ensureBlock(a.blockType, a.blockName, a.useGroup));

  // LCD-Composer-Code vorab aufbauen, damit alle Source-Blocks
  // in der blockMap landen, BEVOR die Block-Refs gerendert werden.
  // Der Code-String wird am Ende von Main() angehängt.
  let composerCode = "";
  if (typeof generateLcdComposerCode === "function") {
    const c = generateLcdComposerCode(ensureBlock);
    if (c.used) composerCode = c.code;
  }

  // === Build code ===
  let code = "";
  code += "// =====================================================\n";
  code += "// SPACE ENGINEERS - PROGRAMMABLE BLOCK SCRIPT\n";
  code += "// Generiert mit SE.PB Code Generator\n";
  code += "// =====================================================\n";
  code += "\n";

  // --- Constructor ---
  code += "public Program()\n";
  code += "{\n";
  switch (state.execMode) {
    case "continuous": code += "    Runtime.UpdateFrequency = UpdateFrequency.Update1;\n"; break;
    case "timer1":     code += "    Runtime.UpdateFrequency = UpdateFrequency.Update100; // ~1.6s, am sparsamsten\n"; break;
    case "timer10":    code += "    Runtime.UpdateFrequency = UpdateFrequency.Update10;\n"; break;
    case "timer100":   code += "    Runtime.UpdateFrequency = UpdateFrequency.Update100;\n"; break;
    default:           code += "    // Manuelle Ausführung — kein UpdateFrequency nötig\n"; break;
  }
  code += "}\n\n";

  code += "public void Save() { }\n\n";

  // --- Main ---
  code += "public void Main(string argument, UpdateType updateSource)\n";
  code += "{\n";
  code += "    // ---------- Block-Referenzen holen ----------\n";

  if (blockMap.size === 0) {
    code += "    // (Keine Blöcke definiert)\n";
  } else {
    for (const e of blockMap.values()) {
      if (e.isGroup) {
        code += `    List<${e.interface}> ${e.varName} = new List<${e.interface}>();\n`;
        code += `    var ${e.varName}_grp = GridTerminalSystem.GetBlockGroupWithName("${escapeCs(e.blockName)}");\n`;
        code += `    if (${e.varName}_grp == null) { Echo("FEHLER: Gruppe '${escapeCs(e.blockName)}' nicht gefunden!"); return; }\n`;
        code += `    ${e.varName}_grp.GetBlocksOfType(${e.varName});\n`;
      } else {
        code += `    ${e.interface} ${e.varName} = GridTerminalSystem.GetBlockWithName("${escapeCs(e.blockName)}") as ${e.interface};\n`;
        code += `    if (${e.varName} == null) { Echo("FEHLER: Block '${escapeCs(e.blockName)}' nicht gefunden!"); return; }\n`;
      }
    }
  }
  code += "\n";

  // LCD setup
  if (state.lcdEnable && state.lcdName) {
    const lcdVar = "lcd_status";
    code += `    // ---------- LCD Status ----------\n`;
    code += `    IMyTextSurface ${lcdVar} = GridTerminalSystem.GetBlockWithName("${escapeCs(state.lcdName)}") as IMyTextSurface;\n`;
    code += `    System.Text.StringBuilder sb = new System.Text.StringBuilder();\n`;
    code += `    sb.AppendLine("=== STATUS ===");\n`;
    code += `    sb.AppendLine("Tick: " + DateTime.Now.ToString("HH:mm:ss"));\n`;
    code += "\n";
  }

  // --- Build condition expression ---
  code += "    // ---------- Bedingungen prüfen ----------\n";
  let condExprStr = "true";
  if (state.conditions.length > 0) {
    const parts = [];
    state.conditions.forEach((c, i) => {
      const blockEntry = ensureBlock(c.blockType, c.blockName, c.useGroup);
      if (!blockEntry) return;
      // Gruppen-Bedingung: erfüllt, wenn irgendein Block der Gruppe sie erfüllt (LINQ Any)
      const e = blockEntry.isGroup
        ? `${blockEntry.varName}.Any(_b => ${condExpr(c, "_b")})`
        : condExpr(c, blockEntry.varName);
      const op = i === 0 ? "" : (c.logicOp === "OR" ? " || " : " && ");
      parts.push(op + "(" + e + ")");
    });
    condExprStr = parts.join("") || "true";
  }
  code += `    bool conditionMet = ${condExprStr};\n\n`;

  // LCD log conditions
  if (state.lcdEnable && state.lcdName) {
    code += `    sb.AppendLine("Bedingung: " + (conditionMet ? "ERFÜLLT" : "nicht erfüllt"));\n\n`;
  }

  // --- Branches ---
  code += "    // ---------- Aktionen ausführen ----------\n";
  code += "    if (conditionMet)\n";
  code += "    {\n";
  // Helfer: emittiert eine Aktion — bei Gruppe als foreach über alle Blöcke.
  const emitAction = (a, prefix) => {
    const blockEntry = ensureBlock(a.blockType, a.blockName, a.useGroup);
    if (!blockEntry) {
      code += `        // (Aktion ohne Block-Name übersprungen)\n`;
      return;
    }
    if (blockEntry.isGroup) {
      const inner = actCode(a, "_b");
      code += `        foreach (var _b in ${blockEntry.varName}) { ${inner} }\n`;
    } else {
      code += `        ${actCode(a, blockEntry.varName)}\n`;
    }
    if (state.lcdEnable && state.lcdName) {
      const act = findAct(a.blockType, a.actId);
      const desc = act ? `${a.blockName} → ${act.label}` : a.blockName;
      code += `        sb.AppendLine("${prefix}: ${escapeCs(desc)}");\n`;
    }
  };

  if (state.actionsThen.length === 0) {
    code += "        // (Keine THEN-Aktionen definiert)\n";
  } else {
    state.actionsThen.forEach(a => emitAction(a, "DO"));
  }
  code += "    }\n";
  if (state.actionsElse.length > 0) {
    code += "    else\n";
    code += "    {\n";
    state.actionsElse.forEach(a => emitAction(a, "ELSE"));
    code += "    }\n";
  }
  code += "\n";

  // LCD output (alte einfache Status-Ausgabe)
  if (state.lcdEnable && state.lcdName) {
    code += `    // ---------- LCD ausgeben ----------\n`;
    code += `    if (lcd_status != null)\n`;
    code += `    {\n`;
    code += `        lcd_status.ContentType = ContentType.TEXT_AND_IMAGE;\n`;
    code += `        lcd_status.WriteText(sb.ToString());\n`;
    code += `    }\n`;
    code += `    Echo(sb.ToString());\n`;
  }

  // LCD-Composer (Phase 4a — Sprite-API), vorab aufgebaut
  code += composerCode;

  code += "}\n";

  // ---------- Helper-Methoden bei Bedarf injizieren ----------
  code = _injectInventoryHelpers(code);

  document.getElementById("output").innerHTML = highlightCs(code);
  window._rawCode = code;
}

// Erkennt, ob im generierten Code Inventory-Helper-Funktionen
// aufgerufen werden, und fügt sie nach `Save()` als Methoden der
// Program-Klasse ein.
function _injectInventoryHelpers(code) {
  const needsHasItem    = code.includes("HasItem(");
  const needsAmountAbove = code.includes("ItemAmountAbove(");
  const needsAmountBelow = code.includes("ItemAmountBelow(");

  if (!needsHasItem && !needsAmountAbove && !needsAmountBelow) return code;

  let helpers = "\n// ---------- Inventory-Helper ----------\n";

  if (needsHasItem || needsAmountAbove || needsAmountBelow) {
    helpers +=
      "float _GetItemAmount(IMyTerminalBlock blk, string subtypeId)\n" +
      "{\n" +
      "    if (blk == null) return 0f;\n" +
      "    float total = 0f;\n" +
      "    var items = new List<MyInventoryItem>();\n" +
      "    for (int i = 0; i < blk.InventoryCount; i++)\n" +
      "    {\n" +
      "        items.Clear();\n" +
      "        blk.GetInventory(i).GetItems(items);\n" +
      "        foreach (var item in items)\n" +
      "            if (item.Type.SubtypeId == subtypeId)\n" +
      "                total += (float)item.Amount;\n" +
      "    }\n" +
      "    return total;\n" +
      "}\n\n";
  }

  if (needsHasItem) {
    helpers +=
      "bool HasItem(IMyTerminalBlock blk, string subtypeId)\n" +
      "{\n" +
      "    if (blk == null) return false;\n" +
      "    var items = new List<MyInventoryItem>();\n" +
      "    for (int i = 0; i < blk.InventoryCount; i++)\n" +
      "    {\n" +
      "        items.Clear();\n" +
      "        blk.GetInventory(i).GetItems(items);\n" +
      "        foreach (var item in items)\n" +
      "            if (item.Type.SubtypeId == subtypeId) return true;\n" +
      "    }\n" +
      "    return false;\n" +
      "}\n\n";
  }

  if (needsAmountAbove) {
    helpers +=
      "// spec-Format: \"Iron:100\" → prüft ob >100 Iron im Block\n" +
      "bool ItemAmountAbove(IMyTerminalBlock blk, string spec)\n" +
      "{\n" +
      "    var parts = spec.Split(':');\n" +
      "    if (parts.Length != 2) return false;\n" +
      "    float threshold;\n" +
      "    if (!float.TryParse(parts[1], out threshold)) return false;\n" +
      "    return _GetItemAmount(blk, parts[0]) > threshold;\n" +
      "}\n\n";
  }

  if (needsAmountBelow) {
    helpers +=
      "// spec-Format: \"Iron:100\" → prüft ob <100 Iron im Block\n" +
      "bool ItemAmountBelow(IMyTerminalBlock blk, string spec)\n" +
      "{\n" +
      "    var parts = spec.Split(':');\n" +
      "    if (parts.Length != 2) return false;\n" +
      "    float threshold;\n" +
      "    if (!float.TryParse(parts[1], out threshold)) return false;\n" +
      "    return _GetItemAmount(blk, parts[0]) < threshold;\n" +
      "}\n";
  }

  // Einfügen direkt nach `public void Save() { }\n\n`
  return code.replace(/public void Save\(\) \{ \}\n\n/, "public void Save() { }\n" + helpers + "\n");
}

// ============================================================
// EXPORT (Copy / Download)
// ============================================================

function copyCode() {
  navigator.clipboard.writeText(window._rawCode || "").then(() => showToast("Code in Zwischenablage kopiert"));
}

function downloadCode() {
  const blob = new Blob([window._rawCode || ""], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "se_pb_script.cs";
  a.click();
  URL.revokeObjectURL(url);
  showToast("Datei heruntergeladen");
}

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._tid);
  t._tid = setTimeout(() => t.classList.remove("show"), 1800);
}
