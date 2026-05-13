// ============================================================
// LCD COMPOSER — C# CODE GENERATOR (Sprite-API)
// ============================================================
// Produziert den C#-Block am Ende von Main(), der die Widgets
// per IMyTextSurface.DrawFrame()-API auf das LCD zeichnet.

const LCD_WIDTH = 512;
const LCD_PADDING_X = 8;

function _csColor(rgbStr, fallback) {
  const parts = (rgbStr || "").split(",").map(s => parseInt(s.trim(), 10));
  if (parts.length !== 3 || parts.some(isNaN)) return fallback || "Color.White";
  return `new Color(${parts[0]}, ${parts[1]}, ${parts[2]})`;
}

function _csString(s) {
  return `"${String(s || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function _sourceExpr(source, varName) {
  const src = findLcdSource(source);
  if (!src) return "0f";
  return src.expr.replace(/\{v\}/g, varName);
}

function _boolSourceExpr(source, varName) {
  const src = findLcdBoolSource(source);
  if (!src) return "false";
  return src.expr.replace(/\{v\}/g, varName);
}

function _formatSpec(fmt) {
  return fmt || "0.0";
}

function _ifaceToBlockType(iface) {
  switch (iface) {
    case "IMyBatteryBlock":    return "Akku (Battery)";
    case "IMyGasTank":         return "Tank / Gas-Tank";
    case "IMyCargoContainer":  return "Frachtcontainer (Cargo)";
    case "IMyReactor":         return "Reaktor";
    case "IMySolarPanel":      return "Solarpanel";
    case "IMyShipController":  return "Cockpit / Sitz / Remote";
    case "IMyDoor":            return "Tür (Door)";
    case "IMyShipConnector":   return "Verbinder (Connector)";
    case "IMyLandingGear":     return "Magnet-Plate / Landing-Gear";
    case "IMyAirVent":         return "Air Vent";
    case "IMyTerminalBlock":   return "Custom (selbst eintragen)";
    default:                   return "Custom (selbst eintragen)";
  }
}

// Block-Variable für eine numerische Quelle holen (registriert
// den Block via ensureBlock, gibt den varName zurück).
function _ensureSourceBlock(ensureBlock, sourceValue, blockName) {
  if (!blockName) return null;
  const src = findLcdSource(sourceValue) || findLcdBoolSource(sourceValue);
  if (!src) return null;
  return ensureBlock(_ifaceToBlockType(src.iface), blockName);
}

function _csComparison(op, valueExpr, thresholdExpr) {
  switch (op) {
    case "lt": return `${valueExpr} < ${thresholdExpr}`;
    case "le": return `${valueExpr} <= ${thresholdExpr}`;
    case "gt": return `${valueExpr} > ${thresholdExpr}`;
    case "ge": return `${valueExpr} >= ${thresholdExpr}`;
    default:   return `${valueExpr} < ${thresholdExpr}`;
  }
}

// Liefert C#-Ausdruck, der true ist, wenn aktuell sichtbar
// (während eines Blink-Zyklus).
function _blinkExpr(blink) {
  if (blink === "fast") return "(DateTime.Now.Millisecond < 250)";  // 4Hz an/aus
  if (blink === "slow") return "(DateTime.Now.Millisecond < 500)";  // 2Hz an/aus
  return "true";
}

// Liefert die LCD-Namen + Pixel-Offsets pro physikalischem LCD für Multi-LCD.
// Bei aus-geschaltetem Multi-LCD oder anderem Display-Modus null.
function _multiLcdLayout(lc) {
  const ml = lc.multiLcd;
  if (!ml || !ml.enabled) return null;
  if ((lc.displayMode || "external") !== "external") return null;
  const rows = Math.max(1, parseInt(ml.rows, 10) || 1);
  const cols = Math.max(1, parseInt(ml.cols, 10) || 1);
  if (rows === 1 && cols === 1) return null;
  const resKey = lc.resolution || "square";
  const res = (typeof LCD_RESOLUTIONS !== "undefined" && LCD_RESOLUTIONS[resKey]) || { w: 512, h: 512 };
  const pattern = ml.namePattern || "LCD {col}{row}";
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const name = pattern
        .replace(/\{col\}/g, String.fromCharCode("A".charCodeAt(0) + c))
        .replace(/\{row\}/g, String(r + 1))
        .replace(/\{c\}/g, String(c + 1))
        .replace(/\{r\}/g, String(r + 1));
      cells.push({ name, offX: c * res.w, offY: r * res.h });
    }
  }
  return { cells, rows, cols, res };
}

// Emittiert die Widget-Schleife (gleich für Single- und Multi-LCD —
// nur lcdOffX/lcdOffY sind Variable, die im umgebenden Scope gesetzt werden).
// ctx sammelt Class-Felder und EnsureBlocks-Code für widget-übergreifende
// Caches (z. B. Aggregator-Listen).
function _emitWidgetsBlock(widgets, ensureBlock, ctx) {
  let out = "";
  for (let idx = 0; idx < widgets.length; idx++) {
    const w = widgets[idx];
    const def = LCD_WIDGETS[w.type];
    if (!def) continue;
    if (w.hidden) continue;  // Layer-Toggle (Phase B)

    const mx = Math.max(0, parseFloat(w.manualX) || 0);
    const my = Math.max(0, parseFloat(w.manualY) || 0);
    const mw = Math.max(8, parseFloat(w.manualW) || 100);
    const mh = Math.max(8, parseFloat(w.manualH) || 40);
    out += `\n            // Widget #${idx + 1}: ${w.type} (x=${mx} y=${my} w=${mw} h=${mh})\n`;
    out += `            {\n`;
    out += `                yPos = rect.Position.Y + (${my}f - lcdOffY);\n`;
    out += `                colOffsetX = ${mx}f - lcdOffX;\n`;
    out += `                widthInner = ${mw}f;\n`;
    if (w.widgetBg && w.widgetBg.trim()) {
      out += `                sp = MySprite.CreateSprite("SquareSimple", new Vector2(rect.Position.X + colOffsetX + widthInner / 2f, yPos + ${mh / 2}f), new Vector2(widthInner, ${mh}f));\n`;
      out += `                sp.Color = ${_csColor(w.widgetBg)};\n`;
      out += `                frame.Add(sp);\n`;
    }
    out += _emitWidget(w, idx, ensureBlock, ctx);
    out += `            }\n`;
  }
  return out;
}

// Hauptfunktion — liefert { used, fields, ensure, code } mit:
//   fields : Class-Feld-Deklarationen (Surface-Cache, Aggregator-Listen)
//   ensure : Body für die EnsureBlocks()-Methode (Validation + Refresh)
//   code   : Inhalt für Main() ODER für IEnumerator-Body (DrawFrame-Loops)
//
// Wenn state.useCoroutines true ist, wird nach jedem LCD-DrawFrame ein
// `yield return true;` eingefügt — der Aufrufer (codegen.js) packt das
// Ergebnis dann in eine `IEnumerator<bool>`-Methode.
function generateLcdComposerCode(ensureBlock) {
  const lc = state.lcdComposer;
  if (!lc || !lc.enabled || !lc.widgets || lc.widgets.length === 0) {
    return { used: false, code: "", fields: "", ensure: "" };
  }

  const mode = lc.displayMode || "external";
  const surfaceIdx = Math.max(0, Math.min(15, parseInt(lc.surfaceIndex, 10) || 0));
  const multi = _multiLcdLayout(lc);
  const useCoroutines = !!state.useCoroutines;
  const yieldStr = useCoroutines ? "        yield return true;\n" : "";

  if ((mode === "external" || mode === "cockpit") && !multi && !lc.lcdName) {
    return { used: false, code: "", fields: "", ensure: "" };
  }

  const _t = (typeof t === "function") ? t : ((k) => k);
  const ctx = { fields: [], ensure: [], precompute: [], useCoroutines: useCoroutines };

  let mainCode = "";
  mainCode += `\n    // ${_t("gen.cmt.lcd_composer")}\n`;

  if (multi) {
    // Multi-LCD — Class-Felder für Namen, Offsets und Surface-Cache.
    // Surfaces werden lazy in EnsureBlocks() validiert.
    ctx.fields.push(`readonly string[] _lcdNames_ = new string[] { ${multi.cells.map(c => _csString(c.name)).join(", ")} };`);
    ctx.fields.push(`readonly float[]  _lcdOffX_ = new float[] { ${multi.cells.map(c => c.offX + "f").join(", ")} };`);
    ctx.fields.push(`readonly float[]  _lcdOffY_ = new float[] { ${multi.cells.map(c => c.offY + "f").join(", ")} };`);
    ctx.fields.push(`IMyTextSurface[] _lcdSurfaces_;`);

    ctx.ensure.push(`    if (_lcdSurfaces_ == null) _lcdSurfaces_ = new IMyTextSurface[_lcdNames_.Length];`);
    ctx.ensure.push(`    for (int _i = 0; _i < _lcdNames_.Length; _i++) {`);
    ctx.ensure.push(`        if (_lcdSurfaces_[_i] == null || _lcdSurfaces_[_i].Closed)`);
    ctx.ensure.push(`            _lcdSurfaces_[_i] = GridTerminalSystem.GetBlockWithName(_lcdNames_[_i]) as IMyTextSurface;`);
    ctx.ensure.push(`    }`);

    // Echo-Zeile mit Runtime-Interpolation: template an {0} splitten und
    // mit C#-String-Concat zusammensetzen.
    const errTpl = _t("gen.cmt.lcd_block_404");
    const errParts = errTpl.split("{0}");
    const errLeft = escapeCs(errParts[0] || "");
    const errRight = escapeCs(errParts[1] || "");

    mainCode += `    // Multi-LCD: ${multi.cols}×${multi.rows} = ${multi.cells.length} LCDs (virtueller Canvas ${multi.res.w * multi.cols}×${multi.res.h * multi.rows})\n`;
    mainCode += `    for (int _li = 0; _li < _lcdSurfaces_.Length; _li++)\n`;
    mainCode += `    {\n`;
    mainCode += `        var lcdComp = _lcdSurfaces_[_li];\n`;
    mainCode += `        if (lcdComp == null) { Echo("${errLeft}" + _lcdNames_[_li] + "${errRight}"); continue; }\n`;
    mainCode += `        lcdComp.ContentType = ContentType.SCRIPT;\n`;
    mainCode += `        lcdComp.Script = "";\n`;
    mainCode += `        using (var frame = lcdComp.DrawFrame())\n`;
    mainCode += `        {\n`;
    mainCode += `            var rect = new RectangleF((lcdComp.TextureSize - lcdComp.SurfaceSize) / 2f, lcdComp.SurfaceSize);\n`;
    mainCode += `            float lcdOffX = _lcdOffX_[_li];\n`;
    mainCode += `            float lcdOffY = _lcdOffY_[_li];\n`;
    mainCode += `            float yPos = 0f;\n`;
    mainCode += `            float colOffsetX = 0f;\n`;
    mainCode += `            float widthInner = 100f;\n`;
    mainCode += `            MySprite sp;\n`;
    mainCode += _emitWidgetsBlock(lc.widgets, ensureBlock, ctx);
    mainCode += `        }\n`;
    // Coroutine-Pause nach jedem LCD — nur wenn aktiv
    mainCode += yieldStr;
    mainCode += `    }\n`;
    return {
      used: true,
      code: mainCode,
      fields: ctx.fields.map(s => s + "\n").join(""),
      ensure: ctx.ensure.map(s => s + "\n").join(""),
      precompute: ctx.precompute.map(s => s + "\n").join(""),
      useCoroutines: useCoroutines
    };
  }

  // Single-LCD: Surface als Class-Feld gecacht.
  ctx.fields.push(`IMyTextSurface _lcdComp_;`);

  if (mode === "pb") {
    // Me.GetSurface() ist nicht teuer und Me bleibt immer gültig — trotzdem cachen.
    ctx.ensure.push(`    if (_lcdComp_ == null) _lcdComp_ = Me.GetSurface(${surfaceIdx});`);
  } else if (mode === "cockpit") {
    ctx.ensure.push(`    if (_lcdComp_ == null || _lcdComp_.Closed) {`);
    ctx.ensure.push(`        var lcdProv = GridTerminalSystem.GetBlockWithName(${_csString(lc.lcdName)}) as IMyTextSurfaceProvider;`);
    ctx.ensure.push(`        _lcdComp_ = lcdProv != null && lcdProv.SurfaceCount > ${surfaceIdx} ? lcdProv.GetSurface(${surfaceIdx}) : null;`);
    ctx.ensure.push(`    }`);
  } else {
    ctx.ensure.push(`    if (_lcdComp_ == null || _lcdComp_.Closed)`);
    ctx.ensure.push(`        _lcdComp_ = GridTerminalSystem.GetBlockWithName(${_csString(lc.lcdName)}) as IMyTextSurface;`);
  }

  mainCode += `    if (_lcdComp_ != null)\n`;
  mainCode += `    {\n`;
  mainCode += `        _lcdComp_.ContentType = ContentType.SCRIPT;\n`;
  mainCode += `        _lcdComp_.Script = "";\n`;
  mainCode += `        using (var frame = _lcdComp_.DrawFrame())\n`;
  mainCode += `        {\n`;
  mainCode += `            var rect = new RectangleF((_lcdComp_.TextureSize - _lcdComp_.SurfaceSize) / 2f, _lcdComp_.SurfaceSize);\n`;
  mainCode += `            float lcdOffX = 0f;\n`;
  mainCode += `            float lcdOffY = 0f;\n`;
  mainCode += `            float yPos = 0f;\n`;
  mainCode += `            float colOffsetX = 0f;\n`;
  mainCode += `            float widthInner = 100f;\n`;
  mainCode += `            MySprite sp;\n`;
  mainCode += _emitWidgetsBlock(lc.widgets, ensureBlock, ctx);
  mainCode += `        }\n`;
  mainCode += `    }\n`;
  // Coroutine-Pause am Ende (Single-LCD — yield-Point falls weiterer Code folgt)
  if (useCoroutines) mainCode += `    yield return true;\n`;
  if (mode === "pb") {
    mainCode += `    else { Echo("${escapeCs(_t("gen.cmt.lcd_pb_404", surfaceIdx))}"); }\n`;
  } else if (mode === "cockpit") {
    mainCode += `    else { Echo("${escapeCs(_t("gen.cmt.lcd_cockpit_404", lc.lcdName || "", surfaceIdx))}"); }\n`;
  } else {
    mainCode += `    else { Echo("${escapeCs(_t("gen.cmt.lcd_block_404_single", lc.lcdName || ""))}"); }\n`;
  }

  return {
    used: true,
    code: mainCode,
    fields: ctx.fields.map(s => s + "\n").join(""),
    ensure: ctx.ensure.map(s => s + "\n").join(""),
    precompute: ctx.precompute.map(s => s + "\n").join(""),
    useCoroutines: useCoroutines
  };
}

// Helper für die Render-Sprites eines Aggregator-Widgets — nutzt die
// übergebenen Variablen-Namen (lokal im Non-Coroutine-Mode, Class-Felder
// im Coroutine-Mode).
function _aggregatorDrawCode(w, resVar, cntVar, symbol, unit, _t) {
  let out = "";
  out += `                sp = MySprite.CreateText(${_csString(symbol)}, "White", ${_csColor(w.color)}, 1.1f, TextAlignment.LEFT);\n`;
  out += `                sp.Position = new Vector2(rect.Position.X + colOffsetX, yPos + 4f);\n`;
  out += `                frame.Add(sp);\n`;
  out += `                sp = MySprite.CreateText(${_csString(w.label || "")}, "White", ${_csColor(lcdLabelColor())}, 0.7f, TextAlignment.LEFT);\n`;
  out += `                sp.Position = new Vector2(rect.Position.X + colOffsetX + 18f, yPos + 4f);\n`;
  out += `                frame.Add(sp);\n`;
  out += `                sp = MySprite.CreateText(${resVar}.ToString("0") + ${_csString(unit)}, "White", ${_csColor(w.color)}, 1.1f, TextAlignment.RIGHT);\n`;
  out += `                sp.Position = new Vector2(rect.Position.X + colOffsetX + widthInner, yPos + 12f);\n`;
  out += `                frame.Add(sp);\n`;
  out += `                sp = MySprite.CreateText("(" + ${cntVar} + ${_csString(" " + _t("gen.cmt.agg_count_word"))} + ")", "White", new Color(107,122,141), 0.55f, TextAlignment.LEFT);\n`;
  out += `                sp.Position = new Vector2(rect.Position.X + colOffsetX + 18f, yPos + 20f);\n`;
  out += `                frame.Add(sp);\n`;
  return out;
}

// Pro Widget-Typ den C#-Code-Block erzeugen.
// idx = widget-Index im Composer-Array (für unique Field-Namen wie _agg0_list).
// ctx = { fields:[], ensure:[], precompute:[], useCoroutines } für Class-Felder,
//       EnsureBlocks-Code und chunked precompute-Code für Coroutine-Modus.
function _emitWidget(w, idx, ensureBlock, ctx) {
  let out = "";
  // Fallback falls ctx fehlt (alte Aufrufpfade)
  if (!ctx) ctx = { fields: [], ensure: [], precompute: [], useCoroutines: false };

  if (w.type === "header") {
    const alignCs = w.align === "left" ? "TextAlignment.LEFT"
                  : w.align === "right" ? "TextAlignment.RIGHT"
                  : "TextAlignment.CENTER";
    const xExpr = w.align === "left"
      ? "rect.Position.X + colOffsetX"
      : w.align === "right"
      ? "rect.Position.X + colOffsetX + widthInner"
      : "rect.Position.X + colOffsetX + widthInner / 2f";
    out += `                sp = MySprite.CreateText(${_csString(w.text || "")}, "White", ${_csColor(w.color)}, ${parseFloat(w.size) || 1.0}f, ${alignCs});\n`;
    out += `                sp.Position = new Vector2(${xExpr}, yPos);\n`;
    out += `                frame.Add(sp);\n`;

  } else if (w.type === "statusbar") {
    const entry = _ensureSourceBlock(ensureBlock, w.source, w.sourceBlock);
    const valueExpr = entry ? _sourceExpr(w.source, entry.varName) : "0f";
    out += `                float val = (float)Math.Max(0, Math.Min(100, ${valueExpr}));\n`;
    out += `                sp = MySprite.CreateText(${_csString(w.label || "")}, "White", new Color(216, 225, 236), 0.7f, TextAlignment.LEFT);\n`;
    out += `                sp.Position = new Vector2(rect.Position.X + colOffsetX, yPos);\n`;
    out += `                frame.Add(sp);\n`;
    out += `                sp = MySprite.CreateText(val.ToString("0") + " %", "White", ${_csColor(w.color)}, 0.7f, TextAlignment.RIGHT);\n`;
    out += `                sp.Position = new Vector2(rect.Position.X + colOffsetX + widthInner, yPos);\n`;
    out += `                frame.Add(sp);\n`;
    out += `                sp = MySprite.CreateSprite("SquareSimple", new Vector2(rect.Position.X + colOffsetX + widthInner / 2f, yPos + 18f), new Vector2(widthInner, 12f));\n`;
    out += `                sp.Color = new Color(42, 52, 66);\n`;
    out += `                frame.Add(sp);\n`;
    out += `                float fillW = (widthInner - 2f) * val / 100f;\n`;
    out += `                sp = MySprite.CreateSprite("SquareSimple", new Vector2(rect.Position.X + colOffsetX + 1f + fillW / 2f, yPos + 18f), new Vector2(fillW, 10f));\n`;
    out += `                sp.Color = ${_csColor(w.color)};\n`;
    out += `                frame.Add(sp);\n`;

  } else if (w.type === "value") {
    const entry = _ensureSourceBlock(ensureBlock, w.source, w.sourceBlock);
    const valueExpr = entry ? _sourceExpr(w.source, entry.varName) : "0f";
    const src = findLcdSource(w.source);
    const unit = src ? src.unit : "";
    const fmt = _formatSpec(w.format);
    const sz = parseFloat(w.size) || 0.9;
    out += `                sp = MySprite.CreateText(${_csString((w.label || "") + ":")}, "White", new Color(216, 225, 236), ${sz}f, TextAlignment.LEFT);\n`;
    out += `                sp.Position = new Vector2(rect.Position.X + colOffsetX, yPos);\n`;
    out += `                frame.Add(sp);\n`;
    out += `                sp = MySprite.CreateText((${valueExpr}).ToString(${_csString(fmt)}) + ${_csString(" " + unit)}, "White", ${_csColor(w.color)}, ${sz}f, TextAlignment.RIGHT);\n`;
    out += `                sp.Position = new Vector2(rect.Position.X + colOffsetX + widthInner, yPos);\n`;
    out += `                frame.Add(sp);\n`;

  } else if (w.type === "statusbar_v") {
    const entry = _ensureSourceBlock(ensureBlock, w.source, w.sourceBlock);
    const valueExpr = entry ? _sourceExpr(w.source, entry.varName) : "0f";
    const mh = Math.max(8, parseFloat(w.manualH) || 120);
    // Säule belegt fast die ganze Cell, Label oben + Prozent unten
    out += `                float val = (float)Math.Max(0, Math.Min(100, ${valueExpr}));\n`;
    out += `                float cx = rect.Position.X + colOffsetX + widthInner / 2f;\n`;
    out += `                float barW = Math.Max(8f, widthInner - 6f);\n`;
    out += `                float barH = ${mh}f - 24f;\n`;
    out += `                if (barH < 8f) barH = 8f;\n`;
    out += `                float barTop = yPos + 12f;\n`;
    out += `                sp = MySprite.CreateText(${_csString(w.label || "")}, "White", new Color(216, 225, 236), 0.5f, TextAlignment.CENTER);\n`;
    out += `                sp.Position = new Vector2(cx, yPos + 1f);\n`;
    out += `                frame.Add(sp);\n`;
    out += `                sp = MySprite.CreateSprite("SquareSimple", new Vector2(cx, barTop + barH / 2f), new Vector2(barW, barH));\n`;
    out += `                sp.Color = new Color(42, 52, 66);\n`;
    out += `                frame.Add(sp);\n`;
    out += `                float fillH = (barH - 2f) * val / 100f;\n`;
    out += `                sp = MySprite.CreateSprite("SquareSimple", new Vector2(cx, barTop + barH - 1f - fillH / 2f), new Vector2(barW - 2f, fillH));\n`;
    out += `                sp.Color = ${_csColor(w.color)};\n`;
    out += `                frame.Add(sp);\n`;
    out += `                sp = MySprite.CreateText(val.ToString("0") + " %", "White", ${_csColor(w.color)}, 0.5f, TextAlignment.CENTER);\n`;
    out += `                sp.Position = new Vector2(cx, barTop + barH + 2f);\n`;
    out += `                frame.Add(sp);\n`;

  } else if (w.type === "statusbar_seg") {
    const entry = _ensureSourceBlock(ensureBlock, w.source, w.sourceBlock);
    const valueExpr = entry ? _sourceExpr(w.source, entry.varName) : "0f";
    const segs = Math.max(2, Math.min(40, parseInt(w.segments, 10) || 12));
    out += `                float val = (float)Math.Max(0, Math.Min(100, ${valueExpr}));\n`;
    out += `                int segCount = ${segs};\n`;
    out += `                int filled = (int)Math.Round(segCount * val / 100f);\n`;
    out += `                float gap = 2f;\n`;
    out += `                float segW = (widthInner - (segCount - 1) * gap) / segCount;\n`;
    // Label + Prozent
    out += `                sp = MySprite.CreateText(${_csString(w.label || "")}, "White", new Color(216, 225, 236), 0.7f, TextAlignment.LEFT);\n`;
    out += `                sp.Position = new Vector2(rect.Position.X + colOffsetX, yPos);\n`;
    out += `                frame.Add(sp);\n`;
    out += `                sp = MySprite.CreateText(val.ToString("0") + " %", "White", ${_csColor(w.color)}, 0.7f, TextAlignment.RIGHT);\n`;
    out += `                sp.Position = new Vector2(rect.Position.X + colOffsetX + widthInner, yPos);\n`;
    out += `                frame.Add(sp);\n`;
    // Segmente
    out += `                for (int i = 0; i < segCount; i++)\n`;
    out += `                {\n`;
    out += `                    float sx = rect.Position.X + colOffsetX + i * (segW + gap) + segW / 2f;\n`;
    out += `                    sp = MySprite.CreateSprite("SquareSimple", new Vector2(sx, yPos + 22f), new Vector2(segW, 14f));\n`;
    out += `                    sp.Color = (i < filled) ? ${_csColor(w.color)} : new Color(35, 45, 58);\n`;
    out += `                    frame.Add(sp);\n`;
    out += `                }\n`;

  } else if (w.type === "bar_double") {
    const e1 = _ensureSourceBlock(ensureBlock, w.source1, w.block1);
    const e2 = _ensureSourceBlock(ensureBlock, w.source2, w.block2);
    const v1Expr = e1 ? _sourceExpr(w.source1, e1.varName) : "0f";
    const v2Expr = e2 ? _sourceExpr(w.source2, e2.varName) : "0f";
    out += `                float v1 = (float)Math.Max(0, Math.Min(100, ${v1Expr}));\n`;
    out += `                float v2 = (float)Math.Max(0, Math.Min(100, ${v2Expr}));\n`;
    // Balken 1
    out += `                sp = MySprite.CreateText(${_csString(w.label1 || "")}, "White", new Color(216, 225, 236), 0.6f, TextAlignment.LEFT);\n`;
    out += `                sp.Position = new Vector2(rect.Position.X + colOffsetX, yPos);\n`;
    out += `                frame.Add(sp);\n`;
    out += `                sp = MySprite.CreateText(v1.ToString("0") + "%", "White", ${_csColor(w.color1)}, 0.6f, TextAlignment.RIGHT);\n`;
    out += `                sp.Position = new Vector2(rect.Position.X + colOffsetX + widthInner, yPos);\n`;
    out += `                frame.Add(sp);\n`;
    out += `                sp = MySprite.CreateSprite("SquareSimple", new Vector2(rect.Position.X + colOffsetX + widthInner / 2f, yPos + 14f), new Vector2(widthInner, 8f));\n`;
    out += `                sp.Color = new Color(42, 52, 66);\n`;
    out += `                frame.Add(sp);\n`;
    out += `                float fw1 = (widthInner - 2f) * v1 / 100f;\n`;
    out += `                sp = MySprite.CreateSprite("SquareSimple", new Vector2(rect.Position.X + colOffsetX + 1f + fw1 / 2f, yPos + 14f), new Vector2(fw1, 6f));\n`;
    out += `                sp.Color = ${_csColor(w.color1)};\n`;
    out += `                frame.Add(sp);\n`;
    // Balken 2
    out += `                sp = MySprite.CreateText(${_csString(w.label2 || "")}, "White", new Color(216, 225, 236), 0.6f, TextAlignment.LEFT);\n`;
    out += `                sp.Position = new Vector2(rect.Position.X + colOffsetX, yPos + 26f);\n`;
    out += `                frame.Add(sp);\n`;
    out += `                sp = MySprite.CreateText(v2.ToString("0") + "%", "White", ${_csColor(w.color2)}, 0.6f, TextAlignment.RIGHT);\n`;
    out += `                sp.Position = new Vector2(rect.Position.X + colOffsetX + widthInner, yPos + 26f);\n`;
    out += `                frame.Add(sp);\n`;
    out += `                sp = MySprite.CreateSprite("SquareSimple", new Vector2(rect.Position.X + colOffsetX + widthInner / 2f, yPos + 40f), new Vector2(widthInner, 8f));\n`;
    out += `                sp.Color = new Color(42, 52, 66);\n`;
    out += `                frame.Add(sp);\n`;
    out += `                float fw2 = (widthInner - 2f) * v2 / 100f;\n`;
    out += `                sp = MySprite.CreateSprite("SquareSimple", new Vector2(rect.Position.X + colOffsetX + 1f + fw2 / 2f, yPos + 40f), new Vector2(fw2, 6f));\n`;
    out += `                sp.Color = ${_csColor(w.color2)};\n`;
    out += `                frame.Add(sp);\n`;

  } else if (w.type === "donut") {
    const entry = _ensureSourceBlock(ensureBlock, w.source, w.sourceBlock);
    const valueExpr = entry ? _sourceExpr(w.source, entry.varName) : "0f";
    const mh = Math.max(8, parseFloat(w.manualH) || 100);
    // Radius dynamisch: passt sich an die kleinere Cell-Dimension an,
    // bleibt dadurch rund — auch in rechteckigen Cells.
    out += `                float val = (float)Math.Max(0, Math.Min(100, ${valueExpr}));\n`;
    out += `                float cx = rect.Position.X + colOffsetX + widthInner / 2f;\n`;
    out += `                float cy = yPos + ${mh}f / 2f;\n`;
    out += `                float radius = Math.Min(widthInner, ${mh}f) / 2f - 8f;\n`;
    out += `                if (radius < 8f) radius = 8f;\n`;
    out += `                float segSize = Math.Max(3f, radius * 0.18f);\n`;
    out += `                int segCount = 32;\n`;
    out += `                int filled = (int)Math.Round(segCount * val / 100f);\n`;
    out += `                for (int i = 0; i < segCount; i++)\n`;
    out += `                {\n`;
    out += `                    float ang = (float)(i / (double)segCount * Math.PI * 2.0 - Math.PI / 2.0);\n`;
    out += `                    float px = cx + (float)Math.Cos(ang) * radius;\n`;
    out += `                    float py = cy + (float)Math.Sin(ang) * radius;\n`;
    out += `                    sp = MySprite.CreateSprite("Circle", new Vector2(px, py), new Vector2(segSize, segSize));\n`;
    out += `                    sp.Color = (i < filled) ? ${_csColor(w.color)} : ${_csColor(w.bgColor, "new Color(42, 52, 66)")};\n`;
    out += `                    frame.Add(sp);\n`;
    out += `                }\n`;
    // Großer Prozent-Wert in der Mitte
    out += `                sp = MySprite.CreateText(val.ToString("0") + "%", "White", ${_csColor(w.color)}, radius * 0.04f, TextAlignment.CENTER);\n`;
    out += `                sp.Position = new Vector2(cx, cy - radius * 0.3f);\n`;
    out += `                frame.Add(sp);\n`;
    out += `                sp = MySprite.CreateText(${_csString(w.label || "")}, "White", new Color(216, 225, 236), radius * 0.02f, TextAlignment.CENTER);\n`;
    out += `                sp.Position = new Vector2(cx, cy + radius * 0.35f);\n`;
    out += `                frame.Add(sp);\n`;

  } else if (w.type === "dot") {
    const entry = _ensureSourceBlock(ensureBlock, w.source, w.sourceBlock);
    const valueExpr = entry ? _sourceExpr(w.source, entry.varName) : "0f";
    const low = parseFloat(w.lowThreshold) || 0;
    const high = parseFloat(w.highThreshold) || 100;
    out += `                float val = (float)(${valueExpr});\n`;
    out += `                Color dotColor;\n`;
    out += `                if (val < ${low}f) dotColor = ${_csColor(w.colorLow,  "new Color(255, 85, 96)")};\n`;
    out += `                else if (val >= ${high}f) dotColor = ${_csColor(w.colorHigh, "new Color(94, 212, 123)")};\n`;
    out += `                else dotColor = ${_csColor(w.colorMid,  "new Color(255, 140, 26)")};\n`;
    out += `                sp = MySprite.CreateSprite("Circle", new Vector2(rect.Position.X + colOffsetX + 14f, yPos + 16f), new Vector2(14f, 14f));\n`;
    out += `                sp.Color = dotColor;\n`;
    out += `                frame.Add(sp);\n`;
    out += `                sp = MySprite.CreateText(${_csString(w.label || "")}, "White", new Color(216, 225, 236), 0.9f, TextAlignment.LEFT);\n`;
    out += `                sp.Position = new Vector2(rect.Position.X + colOffsetX + 30f, yPos + 8f);\n`;
    out += `                frame.Add(sp);\n`;

  } else if (w.type === "checklist") {
    out += `                sp = MySprite.CreateText(${_csString(w.title || "")}, "White", ${_csColor(lcdLabelColor())}, 0.7f, TextAlignment.CENTER);\n`;
    out += `                sp.Position = new Vector2(rect.Position.X + colOffsetX + widthInner / 2f, yPos);\n`;
    out += `                frame.Add(sp);\n`;
    out += `                sp = MySprite.CreateSprite("SquareSimple", new Vector2(rect.Position.X + colOffsetX + widthInner / 2f, yPos + 15f), new Vector2(widthInner, 1f));\n`;
    out += `                sp.Color = new Color(42, 52, 66);\n`;
    out += `                frame.Add(sp);\n`;
    out += `                float rowY = yPos + 22f;\n`;
    for (let n = 1; n <= 5; n++) {
      const label = w[`s${n}_label`];
      if (!label) continue;
      const block = w[`s${n}_block`];
      const check = w[`s${n}_check`];
      let boolExpr = "false";
      if (block) {
        const bs = findLcdBoolSource(check);
        if (bs) {
          const entry = ensureBlock(_ifaceToBlockType(bs.iface), block);
          if (entry) boolExpr = _boolSourceExpr(check, entry.varName);
        }
      }
      out += `                {\n`;
      out += `                    bool ok = (${boolExpr});\n`;
      out += `                    sp = MySprite.CreateText(ok ? "✓" : "✗", "White", ok ? ${_csColor(w.colorOk, "new Color(94, 212, 123)")} : ${_csColor(w.colorBad, "new Color(255, 85, 96)")}, 0.9f, TextAlignment.LEFT);\n`;
      out += `                    sp.Position = new Vector2(rect.Position.X + colOffsetX, rowY);\n`;
      out += `                    frame.Add(sp);\n`;
      out += `                    sp = MySprite.CreateText(${_csString(label)}, "White", new Color(216, 225, 236), 0.7f, TextAlignment.LEFT);\n`;
      out += `                    sp.Position = new Vector2(rect.Position.X + colOffsetX + 28f, rowY + 4f);\n`;
      out += `                    frame.Add(sp);\n`;
      out += `                    rowY += 20f;\n`;
      out += `                }\n`;
    }

  } else if (w.type === "warning") {
    const entry = _ensureSourceBlock(ensureBlock, w.source, w.sourceBlock);
    const valueExpr = entry ? _sourceExpr(w.source, entry.varName) : "0f";
    const cmpExpr = _csComparison(w.comparison, valueExpr, `${parseFloat(w.threshold) || 0}f`);
    out += `                bool warnActive = (${cmpExpr}) && ${_blinkExpr(w.blink)};\n`;
    out += `                if (warnActive)\n`;
    out += `                {\n`;
    out += `                    sp = MySprite.CreateText("⚠ " + ${_csString(w.text || "")}, "White", ${_csColor(w.color, "new Color(255, 85, 96)")}, 0.9f, TextAlignment.LEFT);\n`;
    out += `                    sp.Position = new Vector2(rect.Position.X + colOffsetX, yPos + 8f);\n`;
    out += `                    frame.Add(sp);\n`;
    out += `                }\n`;

  } else if (w.type === "alarm") {
    const entry = _ensureSourceBlock(ensureBlock, w.source, w.sourceBlock);
    const valueExpr = entry ? _sourceExpr(w.source, entry.varName) : "0f";
    const cmpExpr = _csComparison(w.comparison, valueExpr, `${parseFloat(w.threshold) || 0}f`);
    out += `                bool alarmActive = (${cmpExpr}) && ${_blinkExpr(w.blink)};\n`;
    out += `                if (alarmActive)\n`;
    out += `                {\n`;
    out += `                    sp = MySprite.CreateSprite("SquareSimple", new Vector2(rect.Position.X + colOffsetX + widthInner / 2f, yPos + 22f), new Vector2(widthInner, 40f));\n`;
    out += `                    sp.Color = ${_csColor(w.bgColor, "new Color(255, 85, 96)")};\n`;
    out += `                    frame.Add(sp);\n`;
    out += `                    sp = MySprite.CreateText(${_csString(w.text || "")}, "White", ${_csColor(w.textColor, "Color.White")}, 1.2f, TextAlignment.CENTER);\n`;
    out += `                    sp.Position = new Vector2(rect.Position.X + colOffsetX + widthInner / 2f, yPos + 12f);\n`;
    out += `                    frame.Add(sp);\n`;
    out += `                }\n`;

  // ============ Phase 4c ============

  } else if (w.type === "section") {
    // Voll breiter Streifen mit großem Text
    out += `                sp = MySprite.CreateSprite("SquareSimple", new Vector2(rect.Position.X + colOffsetX + widthInner / 2f, yPos + 14f), new Vector2(widthInner, 22f));\n`;
    out += `                sp.Color = ${_csColor(w.bgColor, "new Color(78, 197, 255)")};\n`;
    out += `                frame.Add(sp);\n`;
    out += `                sp = MySprite.CreateText(${_csString(w.text || "")}, "White", ${_csColor(w.textColor, "new Color(10, 14, 18)")}, 0.9f, TextAlignment.CENTER);\n`;
    out += `                sp.Position = new Vector2(rect.Position.X + colOffsetX + widthInner / 2f, yPos + 4f);\n`;
    out += `                frame.Add(sp);\n`;

  } else if (w.type === "divider") {
    if (!w.text) {
      // Reine Linie
      out += `                sp = MySprite.CreateSprite("SquareSimple", new Vector2(rect.Position.X + colOffsetX + widthInner / 2f, yPos + 9f), new Vector2(widthInner, 1f));\n`;
      out += `                sp.Color = ${_csColor(w.color, "new Color(42, 52, 66)")};\n`;
      out += `                frame.Add(sp);\n`;
    } else {
      // Zwei kurze Linien + Text in der Mitte
      out += `                float textW = ${_csString(w.text)}.Length * 7f + 16f;\n`;
      out += `                sp = MySprite.CreateSprite("SquareSimple", new Vector2(rect.Position.X + colOffsetX + (widthInner - textW) / 4f, yPos + 9f), new Vector2((widthInner - textW) / 2f, 1f));\n`;
      out += `                sp.Color = ${_csColor(w.color, "new Color(42, 52, 66)")};\n`;
      out += `                frame.Add(sp);\n`;
      out += `                sp = MySprite.CreateSprite("SquareSimple", new Vector2(rect.Position.X + colOffsetX + widthInner - (widthInner - textW) / 4f, yPos + 9f), new Vector2((widthInner - textW) / 2f, 1f));\n`;
      out += `                sp.Color = ${_csColor(w.color, "new Color(42, 52, 66)")};\n`;
      out += `                frame.Add(sp);\n`;
      out += `                sp = MySprite.CreateText(${_csString(w.text || "")}, "White", ${_csColor(w.color, "new Color(42, 52, 66)")}, 0.65f, TextAlignment.CENTER);\n`;
      out += `                sp.Position = new Vector2(rect.Position.X + colOffsetX + widthInner / 2f, yPos + 1f);\n`;
      out += `                frame.Add(sp);\n`;
    }

  } else if (w.type === "spacer") {
    // Spacer zeichnet nichts — Y-Position wird unten erhöht
    out += `                /* Spacer: keine Sprites */\n`;

  } else if (w.type === "clock") {
    const fmt = w.format || "HH:mm:ss";
    const alignCs = w.align === "left" ? "TextAlignment.LEFT"
                  : w.align === "right" ? "TextAlignment.RIGHT"
                  : "TextAlignment.CENTER";
    const xExpr = w.align === "left"
      ? "rect.Position.X + colOffsetX"
      : w.align === "right"
      ? "rect.Position.X + colOffsetX + widthInner"
      : "rect.Position.X + colOffsetX + widthInner / 2f";
    out += `                sp = MySprite.CreateText(DateTime.Now.ToString(${_csString(fmt)}), "White", ${_csColor(w.color, "new Color(78, 197, 255)")}, ${parseFloat(w.size) || 1.2}f, ${alignCs});\n`;
    out += `                sp.Position = new Vector2(${xExpr}, yPos + 4f);\n`;
    out += `                frame.Add(sp);\n`;

  } else if (w.type === "bigvalue") {
    const entry = _ensureSourceBlock(ensureBlock, w.source, w.sourceBlock);
    const valueExpr = entry ? _sourceExpr(w.source, entry.varName) : "0f";
    const src = findLcdSource(w.source);
    const unit = src ? src.unit : "";
    const fmt = _formatSpec(w.format);
    const sz = parseFloat(w.size) || 2.5;
    // Kleines Label oben
    out += `                sp = MySprite.CreateText(${_csString(w.label || "")}, "White", new Color(216, 225, 236), 0.6f, TextAlignment.CENTER);\n`;
    out += `                sp.Position = new Vector2(rect.Position.X + colOffsetX + widthInner / 2f, yPos + 2f);\n`;
    out += `                frame.Add(sp);\n`;
    // Große Zahl
    out += `                sp = MySprite.CreateText((${valueExpr}).ToString(${_csString(fmt)}), "White", ${_csColor(w.color)}, ${sz}f, TextAlignment.CENTER);\n`;
    out += `                sp.Position = new Vector2(rect.Position.X + colOffsetX + widthInner / 2f, yPos + 16f);\n`;
    out += `                frame.Add(sp);\n`;
    // Einheit rechts unten
    if (unit) {
      out += `                sp = MySprite.CreateText(${_csString(unit)}, "White", ${_csColor(w.color)}, 0.7f, TextAlignment.RIGHT);\n`;
      out += `                sp.Position = new Vector2(rect.Position.X + colOffsetX + widthInner, yPos + 56f);\n`;
      out += `                frame.Add(sp);\n`;
    }

  } else if (w.type === "iconvalue") {
    const entry = _ensureSourceBlock(ensureBlock, w.source, w.sourceBlock);
    const valueExpr = entry ? _sourceExpr(w.source, entry.varName) : "0f";
    const src = findLcdSource(w.source);
    const unit = src ? src.unit : "";
    const fmt = _formatSpec(w.format);
    const icon = w.icon || "Cross";
    const ivSize = parseFloat(w.size) || 1.1;
    // Icon links
    out += `                sp = MySprite.CreateSprite(${_csString(icon)}, new Vector2(rect.Position.X + colOffsetX + 16f, yPos + 18f), new Vector2(28f, 28f));\n`;
    out += `                sp.Color = ${_csColor(w.color)};\n`;
    out += `                frame.Add(sp);\n`;
    // Label
    out += `                sp = MySprite.CreateText(${_csString(w.label || "")}, "White", new Color(216, 225, 236), 0.7f, TextAlignment.LEFT);\n`;
    out += `                sp.Position = new Vector2(rect.Position.X + colOffsetX + 38f, yPos + 4f);\n`;
    out += `                frame.Add(sp);\n`;
    // Wert + Einheit rechts
    out += `                sp = MySprite.CreateText((${valueExpr}).ToString(${_csString(fmt)}) + ${_csString(" " + unit)}, "White", ${_csColor(w.color)}, ${ivSize}f, TextAlignment.RIGHT);\n`;
    out += `                sp.Position = new Vector2(rect.Position.X + colOffsetX + widthInner, yPos + 10f);\n`;
    out += `                frame.Add(sp);\n`;

  } else if (w.type === "aggregator") {
    // Multi-Block-Aggregation via GetBlocksOfType<...>.
    // Liste wird als Class-Feld gecacht und in EnsureBlocks() refreshed.
    //
    // Im Coroutines-Modus: Berechnung wird in Phase 1 von DrawAllLcds()
    // gechunked verteilt (50 Blöcke pro Tick), Ergebnis in Class-Feldern.
    // Render-Code liest die Felder. Sonst: Inline-foreach im Render-Pfad.
    const agg = w.aggregateType || "battery_charge";
    let iface, expr, unit;
    switch (agg) {
      case "battery_charge": iface = "IMyBatteryBlock";    expr = "(b.CurrentStoredPower / b.MaxStoredPower) * 100f"; unit = "%"; break;
      case "battery_input":  iface = "IMyBatteryBlock";    expr = "b.CurrentInput";                                    unit = " MW"; break;
      case "battery_output": iface = "IMyBatteryBlock";    expr = "b.CurrentOutput";                                   unit = " MW"; break;
      case "tank_fill":      iface = "IMyGasTank";         expr = "(float)b.FilledRatio * 100f";                       unit = "%"; break;
      case "cargo_fill":     iface = "IMyCargoContainer";  expr = "((float)b.GetInventory().CurrentVolume / (float)b.GetInventory().MaxVolume) * 100f"; unit = "%"; break;
      case "cargo_mass":     iface = "IMyCargoContainer";  expr = "(float)b.GetInventory().CurrentMass";               unit = " kg"; break;
      case "reactor_output": iface = "IMyReactor";         expr = "b.CurrentOutput";                                   unit = " MW"; break;
      case "solar_output":   iface = "IMySolarPanel";      expr = "b.CurrentOutput * 1000f";                           unit = " kW"; break;
      default:               iface = "IMyBatteryBlock";    expr = "0f";                                                unit = ""; break;
    }
    const mode = w.mode || "avg";
    const listVar = `_agg${idx}_list`;
    const resVar  = `_agg${idx}_result`;
    const cntVar  = `_agg${idx}_count`;
    const useCoro = !!ctx.useCoroutines;

    // Class-Feld + EnsureBlocks-Update (einmalig pro Aggregator-Widget registrieren)
    if (!ctx._aggSeen) ctx._aggSeen = new Set();
    if (!ctx._aggSeen.has(listVar)) {
      ctx._aggSeen.add(listVar);
      ctx.fields.push(`List<${iface}> ${listVar};`);
      ctx.ensure.push(`    if (${listVar} == null) ${listVar} = new List<${iface}>();`);
      ctx.ensure.push(`    ${listVar}.Clear();`);
      ctx.ensure.push(`    GridTerminalSystem.GetBlocksOfType(${listVar});`);

      if (useCoro) {
        // Class-Felder für gechunkte Berechnung + Ergebnis-Cache
        ctx.fields.push(`float ${resVar}; int ${cntVar};`);
        ctx.fields.push(`float _agg${idx}_partial; int _agg${idx}_partialCnt; int _agg${idx}_i;`);
        if (mode === "min") ctx.fields.push(`float _agg${idx}_min = float.MaxValue;`);
        if (mode === "max") ctx.fields.push(`float _agg${idx}_max = float.MinValue;`);

        // Precompute: chunked Schleife (50 pro Tick) — wird in DrawAllLcds Phase 1 emittiert
        ctx.precompute.push(`    // Aggregator #${idx + 1}: ${agg} (${mode}) — 50 Blöcke pro Tick`);
        ctx.precompute.push(`    while (_agg${idx}_i < ${listVar}.Count) {`);
        ctx.precompute.push(`        int _end = Math.Min(_agg${idx}_i + 50, ${listVar}.Count);`);
        ctx.precompute.push(`        for (; _agg${idx}_i < _end; _agg${idx}_i++) {`);
        ctx.precompute.push(`            var b = ${listVar}[_agg${idx}_i];`);
        ctx.precompute.push(`            float v = ${expr};`);
        if (mode === "sum" || mode === "avg") ctx.precompute.push(`            _agg${idx}_partial += v;`);
        if (mode === "min") ctx.precompute.push(`            if (v < _agg${idx}_min) _agg${idx}_min = v;`);
        if (mode === "max") ctx.precompute.push(`            if (v > _agg${idx}_max) _agg${idx}_max = v;`);
        ctx.precompute.push(`            _agg${idx}_partialCnt++;`);
        ctx.precompute.push(`        }`);
        ctx.precompute.push(`        yield return true;`);
        ctx.precompute.push(`    }`);
        // Ergebnis ableiten + State für nächste Runde resetten
        if (mode === "avg")      ctx.precompute.push(`    ${resVar} = _agg${idx}_partialCnt > 0 ? _agg${idx}_partial / _agg${idx}_partialCnt : 0f;`);
        else if (mode === "sum") ctx.precompute.push(`    ${resVar} = _agg${idx}_partial;`);
        else if (mode === "min") ctx.precompute.push(`    ${resVar} = _agg${idx}_partialCnt > 0 ? _agg${idx}_min : 0f;`);
        else if (mode === "max") ctx.precompute.push(`    ${resVar} = _agg${idx}_partialCnt > 0 ? _agg${idx}_max : 0f;`);
        ctx.precompute.push(`    ${cntVar} = _agg${idx}_partialCnt;`);
        ctx.precompute.push(`    _agg${idx}_i = 0; _agg${idx}_partial = 0f; _agg${idx}_partialCnt = 0;`);
        if (mode === "min") ctx.precompute.push(`    _agg${idx}_min = float.MaxValue;`);
        if (mode === "max") ctx.precompute.push(`    _agg${idx}_max = float.MinValue;`);
        ctx.precompute.push(``);
      }
    }

    const _t = (typeof t === "function") ? t : ((k) => k);
    const symbol = mode === "sum" ? "Σ" : (mode === "min" ? "↓" : (mode === "max" ? "↑" : "Ø"));

    // Render-Code: bei Coroutines aus Class-Feldern, sonst inline-foreach
    if (!useCoro) {
      // Inline-Berechnung (klassisch — wie vor v2.3.0 ohne Coroutines)
      const valVar  = `_agg${idx}_val`;
      const cntLocal = `_agg${idx}_cnt`;
      const resLocal = `_agg${idx}_res`;
      out += `                float ${valVar} = 0f; int ${cntLocal} = 0;\n`;
      if (mode === "min") out += `                float ${valVar}_min = float.MaxValue;\n`;
      if (mode === "max") out += `                float ${valVar}_max = float.MinValue;\n`;
      out += `                foreach (var b in ${listVar})\n`;
      out += `                {\n`;
      out += `                    float v = ${expr};\n`;
      if (mode === "sum" || mode === "avg") out += `                    ${valVar} += v;\n`;
      if (mode === "min") out += `                    if (v < ${valVar}_min) ${valVar}_min = v;\n`;
      if (mode === "max") out += `                    if (v > ${valVar}_max) ${valVar}_max = v;\n`;
      out += `                    ${cntLocal}++;\n`;
      out += `                }\n`;
      if (mode === "avg") out += `                float ${resLocal} = ${cntLocal} > 0 ? ${valVar} / ${cntLocal} : 0f;\n`;
      else if (mode === "min") out += `                float ${resLocal} = ${cntLocal} > 0 ? ${valVar}_min : 0f;\n`;
      else if (mode === "max") out += `                float ${resLocal} = ${cntLocal} > 0 ? ${valVar}_max : 0f;\n`;
      else out += `                float ${resLocal} = ${valVar};\n`;
      // Drawing nutzt die lokalen Variablen
      out += _aggregatorDrawCode(w, resLocal, cntLocal, symbol, unit, _t);
    } else {
      // Coroutine-Modus: Werte stehen bereits in den Class-Feldern
      out += _aggregatorDrawCode(w, resVar, cntVar, symbol, unit, _t);
    }

  } else if (w.type === "gauge") {
    const entry = _ensureSourceBlock(ensureBlock, w.source, w.sourceBlock);
    const valueExpr = entry ? _sourceExpr(w.source, entry.varName) : "0f";
    const minVal = parseFloat(w.min) || 0;
    const maxVal = parseFloat(w.max) || 100;
    const mh = Math.max(8, parseFloat(w.manualH) || 100);
    // Halbring: 270°. Radius passt sich an Cell-Größe an —
    // begrenzt durch BEIDE Dimensionen (Halbring ist 1.41× breiter als hoch).
    out += `                float gVal = (float)Math.Max(${minVal}f, Math.Min(${maxVal}f, ${valueExpr}));\n`;
    out += `                float gT = (gVal - ${minVal}f) / (${maxVal}f - ${minVal}f);\n`;
    out += `                float cx = rect.Position.X + colOffsetX + widthInner / 2f;\n`;
    out += `                float cy = yPos + ${mh}f * 0.55f;\n`;
    // Halbring belegt ca. 1.41× r breit, 1.71× r hoch (vom oberen Bogen-Punkt bis untere)
    out += `                float radius = Math.Min(widthInner / 1.5f, ${mh}f / 1.75f) - 4f;\n`;
    out += `                if (radius < 8f) radius = 8f;\n`;
    out += `                float segSize = Math.Max(3f, radius * 0.15f);\n`;
    out += `                int segs = 24;\n`;
    out += `                int gFilled = (int)Math.Round(segs * gT);\n`;
    out += `                float startA = -(float)Math.PI * 0.75f;\n`;
    out += `                float endA   =  (float)Math.PI * 0.75f;\n`;
    out += `                for (int i = 0; i < segs; i++)\n`;
    out += `                {\n`;
    out += `                    float t = i / (float)(segs - 1);\n`;
    out += `                    float ang = startA + (endA - startA) * t;\n`;
    out += `                    float px = cx + (float)Math.Cos(ang) * radius;\n`;
    out += `                    float py = cy + (float)Math.Sin(ang) * radius;\n`;
    out += `                    sp = MySprite.CreateSprite("Circle", new Vector2(px, py), new Vector2(segSize, segSize));\n`;
    out += `                    sp.Color = (i < gFilled) ? ${_csColor(w.color)} : ${_csColor(w.bgColor, "new Color(42, 52, 66)")};\n`;
    out += `                    frame.Add(sp);\n`;
    out += `                }\n`;
    const fmt = "0.0";
    out += `                sp = MySprite.CreateText(gVal.ToString(${_csString(fmt)}), "White", ${_csColor(w.color)}, radius * 0.035f, TextAlignment.CENTER);\n`;
    out += `                sp.Position = new Vector2(cx, cy - radius * 0.25f);\n`;
    out += `                frame.Add(sp);\n`;
    out += `                sp = MySprite.CreateText(${_csString(w.label || "")}, "White", new Color(216, 225, 236), radius * 0.018f, TextAlignment.CENTER);\n`;
    out += `                sp.Position = new Vector2(cx, cy + radius * 0.3f);\n`;
    out += `                frame.Add(sp);\n`;
  }

  return out;
}
