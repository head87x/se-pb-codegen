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

// Hauptfunktion
function generateLcdComposerCode(ensureBlock) {
  const lc = state.lcdComposer;
  if (!lc || !lc.enabled || !lc.widgets || lc.widgets.length === 0) {
    return { code: "", used: false };
  }

  const mode = lc.displayMode || "external";
  const surfaceIdx = Math.max(0, Math.min(15, parseInt(lc.surfaceIndex, 10) || 0));

  if ((mode === "external" || mode === "cockpit") && !lc.lcdName) {
    return { code: "", used: false };
  }

  const totalCols = Math.max(1, Math.min(3, parseInt(lc.columns, 10) || 1));

  let out = "";
  out += "\n    // ---------- LCD-Baukasten ----------\n";

  if (mode === "pb") {
    out += `    IMyTextSurface lcdComp = Me.GetSurface(${surfaceIdx});\n`;
  } else if (mode === "cockpit") {
    out += `    var lcdProv = GridTerminalSystem.GetBlockWithName(${_csString(lc.lcdName)}) as IMyTextSurfaceProvider;\n`;
    out += `    IMyTextSurface lcdComp = lcdProv != null && lcdProv.SurfaceCount > ${surfaceIdx} ? lcdProv.GetSurface(${surfaceIdx}) : null;\n`;
  } else {
    out += `    IMyTextSurface lcdComp = GridTerminalSystem.GetBlockWithName(${_csString(lc.lcdName)}) as IMyTextSurface;\n`;
  }

  out += `    if (lcdComp != null)\n`;
  out += `    {\n`;
  out += `        lcdComp.ContentType = ContentType.SCRIPT;\n`;
  out += `        lcdComp.Script = "";\n`;
  out += `        using (var frame = lcdComp.DrawFrame())\n`;
  out += `        {\n`;
  out += `            var rect = new RectangleF((lcdComp.TextureSize - lcdComp.SurfaceSize) / 2f, lcdComp.SurfaceSize);\n`;
  out += `            float padX = ${LCD_PADDING_X}f;\n`;
  out += `            int totalCols = ${totalCols};\n`;
  out += `            float colGap = 4f;\n`;
  out += `            float fullWidthInner = lcdComp.SurfaceSize.X - 2 * padX;\n`;
  out += `            float colWidth = (fullWidthInner - (totalCols - 1) * colGap) / totalCols;\n`;
  out += `            float yPos = rect.Position.Y + 8f;\n`;
  out += `            int colCursor = 0;   // wieviele Spalten in der aktuellen Zeile schon belegt sind\n`;
  out += `            float rowMaxH = 0f;  // höchstes Widget in der aktuellen Zeile (für Y-Vorschub)\n`;
  out += `            MySprite sp;\n`;
  out += `            float origPadX = padX;\n`;
  out += `            float widthInner = colWidth;  // Variable, die jedes Widget benutzt — wird pro Widget gesetzt\n`;
  out += `            float colOffsetX = 0f;        // X-Offset für die aktuelle Spalten-Position\n`;

  for (let idx = 0; idx < lc.widgets.length; idx++) {
    const w = lc.widgets[idx];
    const def = LCD_WIDGETS[w.type];
    if (!def) continue;

    // ============ MANUAL-Modus: absolute Position ============
    if (w.manualPos) {
      const mx = Math.max(0, parseFloat(w.manualX) || 0);
      const my = Math.max(0, parseFloat(w.manualY) || 0);
      const mw = Math.max(8, parseFloat(w.manualW) || 100);
      const mh = Math.max(8, parseFloat(w.manualH) || 40);
      out += `\n            // Widget #${idx + 1}: ${w.type} (manuell, x=${mx} y=${my} w=${mw} h=${mh})\n`;
      out += `            {\n`;
      out += `                float savedY = yPos, savedColX = colOffsetX, savedW = widthInner;\n`;
      out += `                yPos = rect.Position.Y + ${my}f;\n`;
      out += `                colOffsetX = ${mx}f;\n`;
      out += `                widthInner = ${mw}f;\n`;
      if (w.widgetBg && w.widgetBg.trim()) {
        out += `                sp = MySprite.CreateSprite("SquareSimple", new Vector2(rect.Position.X + colOffsetX + widthInner / 2f, yPos + ${mh / 2}f), new Vector2(widthInner, ${mh}f));\n`;
        out += `                sp.Color = ${_csColor(w.widgetBg)};\n`;
        out += `                frame.Add(sp);\n`;
      }
      out += _emitWidget(w, ensureBlock);
      out += `                yPos = savedY; colOffsetX = savedColX; widthInner = savedW;\n`;
      out += `            }\n`;
      continue;  // Manual-Widget beeinflusst Grid-yPos nicht
    }

    // ============ AUTO/GRID-Modus: Spalten-Layout ============
    let baseHeight = def.height;
    if (w.type === "spacer") baseHeight = parseFloat(w.spaceHeight) || 20;
    const customH = parseFloat(w.widgetHeight);
    const height = (!isNaN(customH) && customH > 0)
      ? Math.max(8, Math.min(400, customH))
      : baseHeight;
    const colSpan = Math.max(1, Math.min(totalCols, parseInt(w.colSpan, 10) || totalCols));

    out += `\n            // Widget #${idx + 1}: ${w.type} (colSpan=${colSpan}, h=${height})\n`;
    out += `            if (colCursor + ${colSpan} > totalCols) { yPos += rowMaxH; colCursor = 0; rowMaxH = 0f; }\n`;
    out += `            colOffsetX = padX + colCursor * (colWidth + colGap);\n`;
    out += `            widthInner = colSpan * colWidth + (colSpan - 1) * colGap;\n`;

    out += `            {\n`;
    if (w.widgetBg && w.widgetBg.trim()) {
      out += `                sp = MySprite.CreateSprite("SquareSimple", new Vector2(rect.Position.X + colOffsetX + widthInner / 2f, yPos + ${height / 2}f), new Vector2(widthInner, ${height}f));\n`;
      out += `                sp.Color = ${_csColor(w.widgetBg)};\n`;
      out += `                frame.Add(sp);\n`;
    }
    out += _emitWidget(w, ensureBlock);
    out += `            }\n`;
    out += `            colCursor += ${colSpan};\n`;
    out += `            if (${height}f > rowMaxH) rowMaxH = ${height}f;\n`;
    out += `            if (colCursor >= totalCols) { yPos += rowMaxH; colCursor = 0; rowMaxH = 0f; }\n`;
  }

  out += `\n            if (colCursor > 0) yPos += rowMaxH;\n`;

  out += `        }\n`;
  out += `    }\n`;
  // Fehlermeldung je nach Modus
  if (mode === "pb") {
    out += `    else { Echo(\"LCD-Composer: PB hat keinen Surface-Index ${surfaceIdx}\"); }\n`;
  } else if (mode === "cockpit") {
    const safeName = (lc.lcdName || "").replace(/'/g, "\\'");
    out += `    else { Echo(\"LCD-Composer: Cockpit '${safeName}' nicht gefunden oder Surface-Index ${surfaceIdx} ungültig\"); }\n`;
  } else {
    const safeName = (lc.lcdName || "").replace(/'/g, "\\'");
    out += `    else { Echo(\"LCD-Composer: Block '${safeName}' nicht gefunden!\"); }\n`;
  }

  return { code: out, used: true };
}

// Pro Widget-Typ den C#-Code-Block erzeugen.
function _emitWidget(w, ensureBlock) {
  let out = "";

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
    out += `                sp = MySprite.CreateText(${_csString(w.label || "")}, "White", new Color(216,225,236), 0.7f, TextAlignment.LEFT);\n`;
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
    out += `                sp = MySprite.CreateText(${_csString((w.label || "") + ":")}, "White", new Color(216,225,236), ${sz}f, TextAlignment.LEFT);\n`;
    out += `                sp.Position = new Vector2(rect.Position.X + colOffsetX, yPos);\n`;
    out += `                frame.Add(sp);\n`;
    out += `                sp = MySprite.CreateText((${valueExpr}).ToString(${_csString(fmt)}) + ${_csString(" " + unit)}, "White", ${_csColor(w.color)}, ${sz}f, TextAlignment.RIGHT);\n`;
    out += `                sp.Position = new Vector2(rect.Position.X + colOffsetX + widthInner, yPos);\n`;
    out += `                frame.Add(sp);\n`;

  } else if (w.type === "statusbar_v") {
    const entry = _ensureSourceBlock(ensureBlock, w.source, w.sourceBlock);
    const valueExpr = entry ? _sourceExpr(w.source, entry.varName) : "0f";
    out += `                float val = (float)Math.Max(0, Math.Min(100, ${valueExpr}));\n`;
    out += `                float cx = rect.Position.X + colOffsetX + widthInner / 2f;\n`;
    out += `                float barW = 36f, barH = 80f, barTop = yPos + 16f;\n`;
    // Label oben
    out += `                sp = MySprite.CreateText(${_csString(w.label || "")}, "White", new Color(216,225,236), 0.7f, TextAlignment.CENTER);\n`;
    out += `                sp.Position = new Vector2(cx, yPos);\n`;
    out += `                frame.Add(sp);\n`;
    // Frame
    out += `                sp = MySprite.CreateSprite("SquareSimple", new Vector2(cx, barTop + barH / 2f), new Vector2(barW, barH));\n`;
    out += `                sp.Color = new Color(42, 52, 66);\n`;
    out += `                frame.Add(sp);\n`;
    // Fill von unten
    out += `                float fillH = (barH - 2f) * val / 100f;\n`;
    out += `                sp = MySprite.CreateSprite("SquareSimple", new Vector2(cx, barTop + barH - 1f - fillH / 2f), new Vector2(barW - 2f, fillH));\n`;
    out += `                sp.Color = ${_csColor(w.color)};\n`;
    out += `                frame.Add(sp);\n`;
    // Prozent unten
    out += `                sp = MySprite.CreateText(val.ToString("0") + " %", "White", ${_csColor(w.color)}, 0.7f, TextAlignment.CENTER);\n`;
    out += `                sp.Position = new Vector2(cx, barTop + barH + 4f);\n`;
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
    out += `                sp = MySprite.CreateText(${_csString(w.label || "")}, "White", new Color(216,225,236), 0.7f, TextAlignment.LEFT);\n`;
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
    out += `                sp = MySprite.CreateText(${_csString(w.label1 || "")}, "White", new Color(216,225,236), 0.6f, TextAlignment.LEFT);\n`;
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
    out += `                sp = MySprite.CreateText(${_csString(w.label2 || "")}, "White", new Color(216,225,236), 0.6f, TextAlignment.LEFT);\n`;
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
    out += `                float val = (float)Math.Max(0, Math.Min(100, ${valueExpr}));\n`;
    out += `                float cx = rect.Position.X + colOffsetX + widthInner / 2f;\n`;
    out += `                float cy = yPos + 60f;\n`;
    out += `                int segCount = 32;\n`;
    out += `                int filled = (int)Math.Round(segCount * val / 100f);\n`;
    out += `                float radius = 50f;\n`;
    out += `                for (int i = 0; i < segCount; i++)\n`;
    out += `                {\n`;
    out += `                    float ang = (float)(i / (double)segCount * Math.PI * 2.0 - Math.PI / 2.0);\n`;
    out += `                    float px = cx + (float)Math.Cos(ang) * radius;\n`;
    out += `                    float py = cy + (float)Math.Sin(ang) * radius;\n`;
    out += `                    sp = MySprite.CreateSprite("Circle", new Vector2(px, py), new Vector2(10f, 10f));\n`;
    out += `                    sp.Color = (i < filled) ? ${_csColor(w.color)} : ${_csColor(w.bgColor, "new Color(42, 52, 66)")};\n`;
    out += `                    frame.Add(sp);\n`;
    out += `                }\n`;
    // Großer Prozent-Wert in der Mitte
    out += `                sp = MySprite.CreateText(val.ToString("0") + "%", "White", ${_csColor(w.color)}, 1.5f, TextAlignment.CENTER);\n`;
    out += `                sp.Position = new Vector2(cx, cy - 12f);\n`;
    out += `                frame.Add(sp);\n`;
    out += `                sp = MySprite.CreateText(${_csString(w.label || "")}, "White", new Color(216,225,236), 0.7f, TextAlignment.CENTER);\n`;
    out += `                sp.Position = new Vector2(cx, cy + 18f);\n`;
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
    out += `                sp = MySprite.CreateText(${_csString(w.label || "")}, "White", new Color(216,225,236), 0.9f, TextAlignment.LEFT);\n`;
    out += `                sp.Position = new Vector2(rect.Position.X + colOffsetX + 30f, yPos + 8f);\n`;
    out += `                frame.Add(sp);\n`;

  } else if (w.type === "checklist") {
    out += `                sp = MySprite.CreateText(${_csString(w.title || "")}, "White", new Color(78,197,255), 0.7f, TextAlignment.CENTER);\n`;
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
      out += `                    sp = MySprite.CreateText(${_csString(label)}, "White", new Color(216,225,236), 0.7f, TextAlignment.LEFT);\n`;
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
    out += `                sp = MySprite.CreateText(${_csString(w.label || "")}, "White", new Color(216,225,236), 0.6f, TextAlignment.CENTER);\n`;
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
    out += `                sp = MySprite.CreateText(${_csString(w.label || "")}, "White", new Color(216,225,236), 0.7f, TextAlignment.LEFT);\n`;
    out += `                sp.Position = new Vector2(rect.Position.X + colOffsetX + 38f, yPos + 4f);\n`;
    out += `                frame.Add(sp);\n`;
    // Wert + Einheit rechts
    out += `                sp = MySprite.CreateText((${valueExpr}).ToString(${_csString(fmt)}) + ${_csString(" " + unit)}, "White", ${_csColor(w.color)}, ${ivSize}f, TextAlignment.RIGHT);\n`;
    out += `                sp.Position = new Vector2(rect.Position.X + colOffsetX + widthInner, yPos + 10f);\n`;
    out += `                frame.Add(sp);\n`;

  } else if (w.type === "aggregator") {
    // Multi-Block-Aggregation via GetBlocksOfType<...>
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
    out += `                var bs = new List<${iface}>();\n`;
    out += `                GridTerminalSystem.GetBlocksOfType(bs);\n`;
    out += `                float aggVal = 0f; int aggCnt = 0;\n`;
    if (mode === "min") out += `                float aggMin = float.MaxValue;\n`;
    if (mode === "max") out += `                float aggMax = float.MinValue;\n`;
    out += `                foreach (var b in bs)\n`;
    out += `                {\n`;
    out += `                    float v = ${expr};\n`;
    if (mode === "sum" || mode === "avg") out += `                    aggVal += v;\n`;
    if (mode === "min") out += `                    if (v < aggMin) aggMin = v;\n`;
    if (mode === "max") out += `                    if (v > aggMax) aggMax = v;\n`;
    out += `                    aggCnt++;\n`;
    out += `                }\n`;
    if (mode === "avg") out += `                float result = aggCnt > 0 ? aggVal / aggCnt : 0f;\n`;
    else if (mode === "min") out += `                float result = aggCnt > 0 ? aggMin : 0f;\n`;
    else if (mode === "max") out += `                float result = aggCnt > 0 ? aggMax : 0f;\n`;
    else out += `                float result = aggVal;\n`;
    const symbol = mode === "sum" ? "Σ" : (mode === "min" ? "↓" : (mode === "max" ? "↑" : "Ø"));
    out += `                sp = MySprite.CreateText(${_csString(symbol)}, "White", ${_csColor(w.color)}, 1.1f, TextAlignment.LEFT);\n`;
    out += `                sp.Position = new Vector2(rect.Position.X + colOffsetX, yPos + 4f);\n`;
    out += `                frame.Add(sp);\n`;
    out += `                sp = MySprite.CreateText(${_csString(w.label || "")}, "White", new Color(216,225,236), 0.7f, TextAlignment.LEFT);\n`;
    out += `                sp.Position = new Vector2(rect.Position.X + colOffsetX + 18f, yPos + 4f);\n`;
    out += `                frame.Add(sp);\n`;
    out += `                sp = MySprite.CreateText(result.ToString("0") + ${_csString(unit)}, "White", ${_csColor(w.color)}, 1.1f, TextAlignment.RIGHT);\n`;
    out += `                sp.Position = new Vector2(rect.Position.X + colOffsetX + widthInner, yPos + 12f);\n`;
    out += `                frame.Add(sp);\n`;
    out += `                sp = MySprite.CreateText("(" + aggCnt + " Blöcke)", "White", new Color(107,122,141), 0.55f, TextAlignment.LEFT);\n`;
    out += `                sp.Position = new Vector2(rect.Position.X + colOffsetX + 18f, yPos + 20f);\n`;
    out += `                frame.Add(sp);\n`;

  } else if (w.type === "gauge") {
    const entry = _ensureSourceBlock(ensureBlock, w.source, w.sourceBlock);
    const valueExpr = entry ? _sourceExpr(w.source, entry.varName) : "0f";
    const minVal = parseFloat(w.min) || 0;
    const maxVal = parseFloat(w.max) || 100;
    // Halbring: 270° von -135° bis +135° (klassisch Tacho)
    out += `                float gVal = (float)Math.Max(${minVal}f, Math.Min(${maxVal}f, ${valueExpr}));\n`;
    out += `                float gT = (gVal - ${minVal}f) / (${maxVal}f - ${minVal}f);\n`;
    out += `                float cx = rect.Position.X + colOffsetX + widthInner / 2f;\n`;
    out += `                float cy = yPos + 70f;\n`;
    out += `                int segs = 24;\n`;
    out += `                int gFilled = (int)Math.Round(segs * gT);\n`;
    out += `                float radius = 55f;\n`;
    out += `                float startA = -(float)Math.PI * 0.75f;\n`;
    out += `                float endA   =  (float)Math.PI * 0.75f;\n`;
    out += `                for (int i = 0; i < segs; i++)\n`;
    out += `                {\n`;
    out += `                    float t = i / (float)(segs - 1);\n`;
    out += `                    float ang = startA + (endA - startA) * t;\n`;
    out += `                    float px = cx + (float)Math.Cos(ang) * radius;\n`;
    out += `                    float py = cy + (float)Math.Sin(ang) * radius;\n`;
    out += `                    sp = MySprite.CreateSprite("Circle", new Vector2(px, py), new Vector2(8f, 8f));\n`;
    out += `                    sp.Color = (i < gFilled) ? ${_csColor(w.color)} : ${_csColor(w.bgColor, "new Color(42, 52, 66)")};\n`;
    out += `                    frame.Add(sp);\n`;
    out += `                }\n`;
    // Großer Wert in der Mitte
    const fmt = "0.0";
    out += `                sp = MySprite.CreateText(gVal.ToString(${_csString(fmt)}), "White", ${_csColor(w.color)}, 1.4f, TextAlignment.CENTER);\n`;
    out += `                sp.Position = new Vector2(cx, cy - 4f);\n`;
    out += `                frame.Add(sp);\n`;
    out += `                sp = MySprite.CreateText(${_csString(w.label || "")}, "White", new Color(216,225,236), 0.6f, TextAlignment.CENTER);\n`;
    out += `                sp.Position = new Vector2(cx, cy + 20f);\n`;
    out += `                frame.Add(sp);\n`;
  }

  return out;
}
