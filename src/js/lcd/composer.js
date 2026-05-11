// ============================================================
// LCD COMPOSER — C# CODE GENERATOR (Sprite-API)
// ============================================================
// Produziert den C#-Block, der am Ende von Main() ausgeführt
// wird und die Widgets per IMyTextSurface.DrawFrame()-API
// auf das LCD zeichnet.
//
// Vereinfachende Annahmen für Phase 4a:
//   - LCD ist Large LCD Panel — ~512×512 Pixel.
//   - Widgets stapeln vertikal (Y kumuliert).
//   - Pro Widget ein eigener Block-Lookup, wenn 'sourceBlock'
//     gesetzt ist. Mehrfach-Referenzen werden vom Generator
//     wiederverwendet (durch die generateCode()-Dedup-Map).

const LCD_WIDTH = 512;
const LCD_PADDING_X = 8;

// Wandelt "255,140,26" in "new Color(255, 140, 26)" um.
// Fallback: weiß.
function _csColor(rgbStr) {
  const parts = (rgbStr || "").split(",").map(s => parseInt(s.trim(), 10));
  if (parts.length !== 3 || parts.some(isNaN)) return "Color.White";
  return `new Color(${parts[0]}, ${parts[1]}, ${parts[2]})`;
}

function _csString(s) {
  return `"${String(s || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

// Liefert den C#-Ausdruck, der den Wert der Datenquelle als float
// zurückgibt — vorausgesetzt, der Block-Variablenname `varName`
// ist im Scope verfügbar.
function _sourceExpr(source, varName) {
  const src = findLcdSource(source);
  if (!src) return "0f";
  return src.expr.replace(/\{v\}/g, varName);
}

function _formatSpec(fmt) {
  // "0" → "0", "0.0" → "0.0", "0.00" → "0.00"
  return fmt || "0.0";
}

// Generiert den LCD-Code für alle Widgets. Wird in generateCode()
// aufgerufen. Bekommt eine ensureBlock-Funktion, mit der für
// jeden Source-Block-Namen eine bereits referenzierte Variable
// geholt wird (dedupliziert über alle Bedingungen/Aktionen hinweg).
//
// Rückgabe: { code: string, used: boolean }
// "used" ist true, wenn der Composer überhaupt etwas produziert hat —
// false, wenn lcdComposer.enabled false ist oder keine Widgets da sind.
function generateLcdComposerCode(ensureBlock) {
  const lc = state.lcdComposer;
  if (!lc || !lc.enabled || !lc.lcdName || !lc.widgets || lc.widgets.length === 0) {
    return { code: "", used: false };
  }

  let out = "";
  out += "\n    // ---------- LCD-Baukasten ----------\n";
  out += `    IMyTextSurface lcdComp = GridTerminalSystem.GetBlockWithName(${_csString(lc.lcdName)}) as IMyTextSurface;\n`;
  out += `    if (lcdComp != null)\n`;
  out += `    {\n`;
  out += `        lcdComp.ContentType = ContentType.SCRIPT;\n`;
  out += `        lcdComp.Script = "";\n`;
  out += `        using (var frame = lcdComp.DrawFrame())\n`;
  out += `        {\n`;
  out += `            var rect = new RectangleF((lcdComp.TextureSize - lcdComp.SurfaceSize) / 2f, lcdComp.SurfaceSize);\n`;
  out += `            float padX = ${LCD_PADDING_X}f;\n`;
  out += `            float widthInner = lcdComp.SurfaceSize.X - 2 * padX;\n`;
  out += `            float yPos = rect.Position.Y + 8f;\n`;
  out += `            MySprite sp;\n`;

  for (let idx = 0; idx < lc.widgets.length; idx++) {
    const w = lc.widgets[idx];
    out += `\n            // Widget #${idx + 1}: ${w.type}\n`;
    const def = LCD_WIDGETS[w.type];
    const height = def ? def.height : 30;

    if (w.type === "header") {
      const alignCs = w.align === "left" ? "TextAlignment.LEFT"
                    : w.align === "right" ? "TextAlignment.RIGHT"
                    : "TextAlignment.CENTER";
      const xExpr = w.align === "left"
        ? "rect.Position.X + padX"
        : w.align === "right"
        ? "rect.Position.X + lcdComp.SurfaceSize.X - padX"
        : "rect.Position.X + lcdComp.SurfaceSize.X / 2f";
      out += `            sp = MySprite.CreateText(${_csString(w.text || "")}, "White", ${_csColor(w.color)}, ${parseFloat(w.size) || 1.0}f, ${alignCs});\n`;
      out += `            sp.Position = new Vector2(${xExpr}, yPos);\n`;
      out += `            frame.Add(sp);\n`;
      out += `            yPos += ${height}f;\n`;

    } else if (w.type === "statusbar") {
      // Block-Referenz besorgen
      const src = findLcdSource(w.source);
      let valueExpr = "0f";
      if (src && w.sourceBlock) {
        const blockTypeKey = _ifaceToBlockType(src.iface);
        const entry = ensureBlock(blockTypeKey, w.sourceBlock);
        if (entry) {
          valueExpr = _sourceExpr(w.source, entry.varName);
        }
      }
      out += `            {\n`;
      out += `                float val = (float)Math.Max(0, Math.Min(100, ${valueExpr}));\n`;
      // Label links, Wert rechts
      out += `                sp = MySprite.CreateText(${_csString(w.label || "")}, "White", new Color(216,225,236), 0.7f, TextAlignment.LEFT);\n`;
      out += `                sp.Position = new Vector2(rect.Position.X + padX, yPos);\n`;
      out += `                frame.Add(sp);\n`;
      out += `                sp = MySprite.CreateText(val.ToString("0") + " %", "White", ${_csColor(w.color)}, 0.7f, TextAlignment.RIGHT);\n`;
      out += `                sp.Position = new Vector2(rect.Position.X + lcdComp.SurfaceSize.X - padX, yPos);\n`;
      out += `                frame.Add(sp);\n`;
      // Bar-Frame
      out += `                sp = MySprite.CreateSprite("SquareSimple", new Vector2(rect.Position.X + padX + widthInner / 2f, yPos + 18f), new Vector2(widthInner, 12f));\n`;
      out += `                sp.Color = new Color(42, 52, 66);\n`;
      out += `                frame.Add(sp);\n`;
      // Bar-Fill
      out += `                float fillW = (widthInner - 2f) * val / 100f;\n`;
      out += `                sp = MySprite.CreateSprite("SquareSimple", new Vector2(rect.Position.X + padX + 1f + fillW / 2f, yPos + 18f), new Vector2(fillW, 10f));\n`;
      out += `                sp.Color = ${_csColor(w.color)};\n`;
      out += `                frame.Add(sp);\n`;
      out += `            }\n`;
      out += `            yPos += ${height}f;\n`;

    } else if (w.type === "value") {
      const src = findLcdSource(w.source);
      let valueExpr = "0f";
      let unitStr = "";
      if (src && w.sourceBlock) {
        const blockTypeKey = _ifaceToBlockType(src.iface);
        const entry = ensureBlock(blockTypeKey, w.sourceBlock);
        if (entry) {
          valueExpr = _sourceExpr(w.source, entry.varName);
        }
        unitStr = src.unit || "";
      }
      const fmt = _formatSpec(w.format);
      out += `            sp = MySprite.CreateText(${_csString(w.label + ":")}, "White", new Color(216,225,236), 0.9f, TextAlignment.LEFT);\n`;
      out += `            sp.Position = new Vector2(rect.Position.X + padX, yPos);\n`;
      out += `            frame.Add(sp);\n`;
      out += `            sp = MySprite.CreateText((${valueExpr}).ToString(${_csString(fmt)}) + ${_csString(" " + unitStr)}, "White", ${_csColor(w.color)}, 0.9f, TextAlignment.RIGHT);\n`;
      out += `            sp.Position = new Vector2(rect.Position.X + lcdComp.SurfaceSize.X - padX, yPos);\n`;
      out += `            frame.Add(sp);\n`;
      out += `            yPos += ${height}f;\n`;
    }
  }

  out += `        }\n`;
  out += `    }\n`;
  out += `    else { Echo(\"LCD-Composer: Block '${(lc.lcdName || "").replace(/'/g, "\\'")}' nicht gefunden!\"); }\n`;

  return { code: out, used: true };
}

// Mapping IMy* → unsere Block-Typ-Anzeigenamen (für ensureBlock).
// Wir picken einen passenden Block-Typ-Key, damit der Generator
// die richtige Interface-Variable anlegt.
function _ifaceToBlockType(iface) {
  switch (iface) {
    case "IMyBatteryBlock":    return "Akku (Battery)";
    case "IMyGasTank":         return "Tank / Gas-Tank";
    case "IMyCargoContainer":  return "Frachtcontainer (Cargo)";
    case "IMyReactor":         return "Reaktor";
    case "IMySolarPanel":      return "Solarpanel";
    case "IMyShipController":  return "Cockpit / Sitz / Remote";
    default:                   return "Custom (selbst eintragen)";
  }
}
