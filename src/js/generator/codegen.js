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

function _safeArg(val, fallback) {
  if (val === "_custom" || val === undefined || val === null) return fallback;
  return val || fallback;
}

function condExpr(c, varName) {
  const cond = findCond(c.blockType, c.condId);
  if (!cond) return "true";
  let expr = cond.expr;
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
// CODE GENERATION (v2.1.0 — Block-Caching-Pattern)
// ============================================================
//
// Generierte C#-Struktur:
//
//   // Header-Kommentare
//
//   // Class-Felder (Block-Cache)
//   IMyDoor d_door_0;
//   IMyBlockGroup g_grp_1;
//   List<IMyLightingBlock> l_grp_1;
//   IMyTextSurface lcd_status;
//   ...  (composer-Felder: Multi-LCD-Array, Aggregator-Listen)
//   System.Text.StringBuilder _sb = new System.Text.StringBuilder();
//
//   public Program() { Runtime.UpdateFrequency = ...; }
//   public void Save() { }
//
//   // Inventory-Helper (optional, falls genutzt)
//
//   bool EnsureBlocks() {
//     // Lazy fetch + Closed-Validierung pro Block / Gruppe
//     // Composer: Multi-LCD-Cache, Aggregator-Liste klären
//     return true;
//   }
//
//   public void Main(string argument, UpdateType updateSource) {
//     if (!EnsureBlocks()) return;
//     // Bedingungen, Aktionen, LCD-Output, Composer
//   }

function generateCode() {
  // Block-Sammlung — eindeutige Einträge in blockMap.
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

  // LCD-Composer-Code vorab bauen, damit Source-Blöcke + composer-Felder
  // in den Cache fließen.
  let composerFields = "";
  let composerEnsure = "";
  let composerInit = "";
  let composerRefresh = "";
  let composerClosedRecheck = "";
  let composerMain   = "";
  let composerPrecompute = "";
  let composerUsesCoroutines = false;
  if (typeof generateLcdComposerCode === "function") {
    const c = generateLcdComposerCode(ensureBlock);
    if (c.used) {
      composerFields = c.fields || "";
      composerEnsure = c.ensure || "";
      composerInit = c.init || "";
      composerRefresh = c.refresh || "";
      composerClosedRecheck = c.closedRecheck || "";
      composerMain   = c.code   || "";
      composerPrecompute = c.precompute || "";
      composerUsesCoroutines = !!c.useCoroutines;
    }
  }
  // v2.11.0 — Default: Init in Program(), kein Closed-Recheck pro Tick.
  const autoRecover = !!state.autoRecoverBlocks;

  const _t = (typeof t === "function") ? t : ((k) => k);
  const lcdStatusEnabled = state.lcdEnable && state.lcdName && state.lcdName.trim().length > 0;
  // Coroutine-Modus greift nur wenn der Composer auch wirklich Drawing-Code
  // emittiert. Sonst lohnt sich die State-Machine nicht.
  const useCoroutines = composerUsesCoroutines && composerMain.length > 0;

  // === Build code ===
  let code = "";

  // ---------- Attribution-Header (immer, nicht deaktivierbar) ----------
  // Schützt die Tool-Herkunft und nennt Repo + Ersteller. Wenn der User
  // Workshop-Metadaten ausgefüllt hat, hängen wir die unter den
  // Attribution-Block.
  const _toolVersion = (typeof TOOL_VERSION === "string") ? TOOL_VERSION : "?";
  const _today = (new Date()).toISOString().slice(0, 10);  // YYYY-MM-DD
  // Verhindert, dass User-Eingaben den C#-Block-Kommentar vorzeitig
  // schließen ("*/"). Wir ersetzen die Sequenz durch "* /".
  const _safeCmt = (s) => String(s == null ? "" : s).replace(/\*\//g, "* /");
  code += "/* =====================================================\n";
  code += " * " + _t("gen.header") + "\n";
  code += " * =====================================================\n";
  code += " * " + _t("gen.hdr.attrib_tool")   + " SE.PB Code Generator v" + _toolVersion + "\n";
  code += " * " + _t("gen.hdr.attrib_url")    + " https://github.com/head87x/se-pb-codegen\n";
  code += " * " + _t("gen.hdr.attrib_author") + " head87x\n";
  code += " * " + _t("gen.hdr.attrib_date")   + " " + _today + "\n";

  const info = state.scriptInfo;
  if (info && info.enabled) {
    const anyField = !!(info.name || info.author || info.version || info.tags || info.description);
    if (anyField) {
      code += " *\n";
      code += " * " + _t("gen.hdr.ws_section") + "\n";
      if (info.name)        code += " * " + _t("gen.hdr.ws_name")    + _safeCmt(info.name) + "\n";
      if (info.author)      code += " * " + _t("gen.hdr.ws_author")  + _safeCmt(info.author) + "\n";
      if (info.version)     code += " * " + _t("gen.hdr.ws_version") + _safeCmt(info.version) + "\n";
      if (info.tags)        code += " * " + _t("gen.hdr.ws_tags")    + _safeCmt(info.tags) + "\n";
      if (info.description) {
        const lines = _safeCmt(info.description).split(/\r?\n/);
        const prefix = _t("gen.hdr.ws_description");
        // erste Zeile mit Label, Folgezeilen eingerückt damit's lesbar bleibt
        code += " * " + prefix + lines[0] + "\n";
        const pad = " ".repeat(prefix.length);
        for (let i = 1; i < lines.length; i++) {
          code += " * " + pad + lines[i] + "\n";
        }
      }
    }
  }
  code += " * ===================================================== */\n";
  code += "\n";

  // ---------- Class-Felder (Block-Cache) ----------
  code += `// ${_t("gen.cmt.fields")}\n`;
  if (blockMap.size === 0 && !lcdStatusEnabled && !composerFields) {
    code += `// ${_t("gen.cmt.no_blocks")}\n`;
  }
  for (const e of blockMap.values()) {
    if (e.isGroup) {
      code += `IMyBlockGroup ${e.varName}_grp;\n`;
      code += `List<${e.interface}> ${e.varName};\n`;
    } else {
      code += `${e.interface} ${e.varName};\n`;
    }
  }
  if (lcdStatusEnabled) {
    code += `IMyTextSurface lcd_status;\n`;
    // StringBuilder als Class-Feld — reuse statt new pro Tick
    code += `readonly System.Text.StringBuilder _sb = new System.Text.StringBuilder();\n`;
  }
  if (composerFields) code += composerFields;
  if (useCoroutines) {
    code += `IEnumerator<bool> _drawCoroutine;\n`;
  }
  // v2.11.0 — Init-Fehler-Flag (Block oder Gruppe nicht gefunden im Constructor)
  const hasAnyBlocks = blockMap.size > 0 || lcdStatusEnabled || !!composerInit;
  if (hasAnyBlocks) code += `bool _initFailed;\n`;
  code += "\n";

  // ---------- Constructor ----------
  code += "public Program()\n";
  code += "{\n";
  switch (state.execMode) {
    case "continuous": code += "    Runtime.UpdateFrequency = UpdateFrequency.Update1;\n"; break;
    case "timer1":     code += `    Runtime.UpdateFrequency = UpdateFrequency.Update100; // ${_t("gen.cmt.tick_slow")}\n`; break;
    case "timer10":    code += "    Runtime.UpdateFrequency = UpdateFrequency.Update10;\n"; break;
    case "timer100":   code += "    Runtime.UpdateFrequency = UpdateFrequency.Update100;\n"; break;
    default:           code += `    // ${_t("gen.cmt.manual")}\n`; break;
  }
  if (hasAnyBlocks) code += `    InitBlocks();\n`;
  code += "}\n\n";

  code += "public void Save() { }\n\n";

  // ---------- Inventory-Helper (optional) ----------
  // (wird unten via _injectInventoryHelpers vor InitBlocks gesetzt)
  const INVENTORY_HELPERS_MARKER = "// __INVENTORY_HELPERS_MARKER__\n";
  code += INVENTORY_HELPERS_MARKER;

  // ---------- v2.11.0: InitBlocks (einmalig im Constructor) ----------
  // Vorher lief das per Tick in EnsureBlocks() — jetzt nur noch initial.
  // Single-Block-Closed-Rechecks per Tick gibt's nur mit autoRecoverBlocks.
  if (hasAnyBlocks) {
    code += `// ${_t("gen.cmt.program_init")}\n`;
    code += "void InitBlocks()\n";
    code += "{\n";
    code += "    _initFailed = false;\n";
    for (const e of blockMap.values()) {
      if (e.isGroup) {
        code += `    ${e.varName}_grp = GridTerminalSystem.GetBlockGroupWithName("${escapeCs(e.blockName)}");\n`;
        code += `    if (${e.varName}_grp == null) { Echo("${escapeCs(_t("gen.err.group", e.blockName))}"); _initFailed = true; }\n`;
        code += `    else {\n`;
        code += `        ${e.varName} = new List<${e.interface}>();\n`;
        code += `        ${e.varName}_grp.GetBlocksOfType(${e.varName});\n`;
        code += `    }\n`;
      } else {
        code += `    ${e.varName} = GridTerminalSystem.GetBlockWithName("${escapeCs(e.blockName)}") as ${e.interface};\n`;
        code += `    if (${e.varName} == null) { Echo("${escapeCs(_t("gen.err.block", e.blockName))}"); _initFailed = true; }\n`;
      }
    }
    if (lcdStatusEnabled) {
      code += `    lcd_status = GridTerminalSystem.GetBlockWithName("${escapeCs(state.lcdName)}") as IMyTextSurface;\n`;
      code += `    // ${_t("gen.cmt.lcd_status_optional")}\n`;
    }
    if (composerInit) code += composerInit;
    code += "}\n\n";
  }

  // ---------- v2.11.0: RefreshBlocks (pro Tick — Gruppen-Refresh + opt. Closed-Rechecks) ----------
  // Wird nur emittiert wenn nötig: Gruppen (immer refresh), autoRecover (closed-rechecks),
  // oder Composer-Refresh/ClosedRecheck.
  const groupCount = Array.from(blockMap.values()).filter(e => e.isGroup).length;
  const singleCount = blockMap.size - groupCount;
  const needsRefresh = groupCount > 0
                    || !!composerRefresh
                    || (autoRecover && (singleCount > 0 || lcdStatusEnabled || !!composerClosedRecheck));
  if (needsRefresh) {
    code += `// ${_t("gen.cmt.refresh_lists")}\n`;
    code += "void RefreshBlocks()\n";
    code += "{\n";
    // Single-Block-Closed-Rechecks (nur bei autoRecover)
    if (autoRecover) {
      for (const e of blockMap.values()) {
        if (e.isGroup) continue;
        code += `    if (${e.varName} == null || ${e.varName}.Closed)\n`;
        code += `        ${e.varName} = GridTerminalSystem.GetBlockWithName("${escapeCs(e.blockName)}") as ${e.interface};\n`;
      }
      if (lcdStatusEnabled) {
        code += `    if (lcd_status == null || lcd_status.Closed)\n`;
        code += `        lcd_status = GridTerminalSystem.GetBlockWithName("${escapeCs(state.lcdName)}") as IMyTextSurface;\n`;
      }
    }
    // Gruppen-Listen IMMER refreshen (Mitglieder können sich ändern)
    for (const e of blockMap.values()) {
      if (!e.isGroup) continue;
      code += `    if (${e.varName}_grp != null && ${e.varName} != null) {\n`;
      code += `        ${e.varName}.Clear();\n`;
      code += `        ${e.varName}_grp.GetBlocksOfType(${e.varName});\n`;
      code += `    }\n`;
    }
    // Composer-Refresh (Aggregator-Listen — immer)
    if (composerRefresh) code += composerRefresh;
    // Composer-Closed-Rechecks (nur bei autoRecover)
    if (autoRecover && composerClosedRecheck) code += composerClosedRecheck;
    code += "}\n\n";
  }

  // ---------- Main ----------
  code += "public void Main(string argument, UpdateType updateSource)\n";
  code += "{\n";
  // v2.11.0: Init-Failure-Guard + RefreshBlocks-Aufruf
  if (hasAnyBlocks) code += "    if (_initFailed) return;\n";
  if (needsRefresh) code += "    RefreshBlocks();\n";
  if (hasAnyBlocks || needsRefresh) code += "\n";

  // LCD-Status (alt — text-mode): StringBuilder wird wiederverwendet
  if (lcdStatusEnabled) {
    code += `    // ${_t("gen.cmt.lcd_status")}\n`;
    code += `    _sb.Clear();\n`;
    code += `    _sb.AppendLine("${_t("gen.lcd.status_head")}");\n`;
    code += `    _sb.AppendLine("${_t("gen.lcd.tick")}" + DateTime.Now.ToString("HH:mm:ss"));\n`;
    code += "\n";
  }

  // Bedingungen
  code += `    // ${_t("gen.cmt.check")}\n`;
  let condExprStr = "true";
  if (state.conditions.length > 0) {
    const parts = [];
    state.conditions.forEach((c, i) => {
      const blockEntry = ensureBlock(c.blockType, c.blockName, c.useGroup);
      if (!blockEntry) return;
      // Gruppen-Bedingung: any / all / count(>= X), sonst direkter Ausdruck
      let e;
      if (blockEntry.isGroup) {
        const inner = condExpr(c, "_b");
        const sem = c.groupSemantic || "any";
        if (sem === "all") {
          e = `${blockEntry.varName}.All(_b => ${inner})`;
        } else if (sem === "count") {
          const n = Math.max(1, parseInt(c.groupCount, 10) || 1);
          e = `${blockEntry.varName}.Count(_b => ${inner}) >= ${n}`;
        } else {
          e = `${blockEntry.varName}.Any(_b => ${inner})`;
        }
      } else {
        e = condExpr(c, blockEntry.varName);
      }
      const op = i === 0 ? "" : (c.logicOp === "OR" ? " || " : " && ");
      parts.push(op + "(" + e + ")");
    });
    condExprStr = parts.join("") || "true";
  }
  code += `    bool conditionMet = ${condExprStr};\n\n`;

  if (lcdStatusEnabled) {
    code += `    _sb.AppendLine("${_t("gen.lcd.cond_line")}" + (conditionMet ? "${_t("gen.lcd.cond_yes")}" : "${_t("gen.lcd.cond_no")}"));\n\n`;
  }

  // Aktionen
  code += `    // ${_t("gen.cmt.run")}\n`;
  code += "    if (conditionMet)\n";
  code += "    {\n";

  const emitAction = (a, prefix) => {
    const blockEntry = ensureBlock(a.blockType, a.blockName, a.useGroup);
    if (!blockEntry) {
      code += `        // ${_t("gen.cmt.no_act")}\n`;
      return;
    }
    if (blockEntry.isGroup) {
      const inner = actCode(a, "_b");
      code += `        foreach (var _b in ${blockEntry.varName}) { ${inner} }\n`;
    } else {
      code += `        ${actCode(a, blockEntry.varName)}\n`;
    }
    if (lcdStatusEnabled) {
      const act = findAct(a.blockType, a.actId);
      const desc = act ? `${a.blockName} → ${act.label}` : a.blockName;
      code += `        _sb.AppendLine("${prefix}: ${escapeCs(desc)}");\n`;
    }
  };

  if (state.actionsThen.length === 0) {
    code += `        // ${_t("gen.cmt.no_then")}\n`;
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

  // LCD-Output (alt)
  if (lcdStatusEnabled) {
    code += `    // ${_t("gen.cmt.lcd_out")}\n`;
    code += `    if (lcd_status != null)\n`;
    code += `    {\n`;
    code += `        lcd_status.ContentType = ContentType.TEXT_AND_IMAGE;\n`;
    code += `        lcd_status.WriteText(_sb.ToString());\n`;
    code += `    }\n`;
    code += `    Echo(_sb.ToString());\n`;
  }

  // LCD-Composer-Main (Sprite-API DrawFrame-Loops)
  if (useCoroutines) {
    // Coroutine-Variante: ruft die State-Machine einen Schritt weiter und
    // setzt UpdateFrequency.Once, um nächsten Tick weiterzumachen.
    code += "\n";
    code += `    // ${_t("gen.cmt.coroutine_main")}\n`;
    code += `    if (_drawCoroutine == null) _drawCoroutine = DrawAllLcds();\n`;
    code += `    if (_drawCoroutine.MoveNext()) {\n`;
    code += `        Runtime.UpdateFrequency |= UpdateFrequency.Once;\n`;
    code += `    } else {\n`;
    code += `        _drawCoroutine.Dispose();\n`;
    code += `        _drawCoroutine = null;\n`;
    code += `    }\n`;
  } else {
    code += composerMain;
  }

  code += "}\n";

  // ---------- Coroutine-Methode anhängen (nach Main, in der Klasse) ----------
  if (useCoroutines) {
    code += "\n";
    code += `// ${_t("gen.cmt.coroutine")}\n`;
    code += `IEnumerator<bool> DrawAllLcds()\n`;
    code += `{\n`;
    // Phase 1: Aggregator-Werte über mehrere Ticks berechnen (gechunkt)
    if (composerPrecompute) {
      code += `    // ${_t("gen.cmt.coroutine_phase1")}\n`;
      code += composerPrecompute;
    }
    // Phase 2: LCDs zeichnen (yield nach jedem LCD)
    if (composerPrecompute) {
      code += `    // ${_t("gen.cmt.coroutine_phase2")}\n`;
    }
    code += composerMain;
    code += `}\n`;
  }

  // ---------- Inventory-Helper injizieren ----------
  code = _injectInventoryHelpers(code, INVENTORY_HELPERS_MARKER);

  document.getElementById("output").innerHTML = highlightCs(code);
  window._rawCode = code;
}

// Erkennt, ob Inventory-Helper benötigt werden, und ersetzt den Marker
// im Code mit den Helper-Definitionen (bzw. löscht den Marker leer).
function _injectInventoryHelpers(code, marker) {
  const needsHasItem    = code.includes("HasItem(");
  const needsAmountAbove = code.includes("ItemAmountAbove(");
  const needsAmountBelow = code.includes("ItemAmountBelow(");

  if (!needsHasItem && !needsAmountAbove && !needsAmountBelow) {
    return code.replace(marker, "");
  }

  let helpers = "// ---------- Inventory-Helper ----------\n";
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
      "bool ItemAmountBelow(IMyTerminalBlock blk, string spec)\n" +
      "{\n" +
      "    var parts = spec.Split(':');\n" +
      "    if (parts.Length != 2) return false;\n" +
      "    float threshold;\n" +
      "    if (!float.TryParse(parts[1], out threshold)) return false;\n" +
      "    return _GetItemAmount(blk, parts[0]) < threshold;\n" +
      "}\n\n";
  }

  return code.replace(marker, helpers);
}

// ============================================================
// EXPORT (Copy / Download / Plain-Text-View)
// ============================================================

function copyCode() {
  navigator.clipboard.writeText(window._rawCode || "").then(() => {
    showToast(typeof t === "function" ? t("toast.copied") : "Code in Zwischenablage kopiert");
  });
}

function downloadCode() {
  const blob = new Blob([window._rawCode || ""], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "se_pb_script.cs";
  a.click();
  URL.revokeObjectURL(url);
  showToast(typeof t === "function" ? t("toast.downloaded") : "Datei heruntergeladen");
}

// Öffnet ein themed Modal mit dem reinen Code (selektierbar), als
// Alternative zur gesperrten Selektion im hervorgehobenen Output.
function showPlainCode() {
  if (typeof showCodeView === "function") {
    showCodeView(window._rawCode || "");
  }
}

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._tid);
  t._tid = setTimeout(() => t.classList.remove("show"), 1800);
}
