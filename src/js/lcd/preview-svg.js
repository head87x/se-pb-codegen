// ============================================================
// LCD WIDGET SVG-PREVIEW
// ============================================================
// Erzeugt eine kleine SVG-Mini-Vorschau pro Widget — 200×40
// viewBox, monochrome SVG mit Widget-Farbe.
//
// Beim echten LCD im Spiel sieht's etwas anders aus (Schriftart,
// genauere Position), aber das Mockup gibt eine gute Idee.

function _parseColor(rgbStr, fallback) {
  if (!rgbStr) return fallback;
  const parts = rgbStr.split(",").map(s => parseInt(s.trim(), 10));
  if (parts.length !== 3 || parts.some(isNaN)) return fallback;
  return `rgb(${parts[0]},${parts[1]},${parts[2]})`;
}

function _escapeSvgText(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const LCD_PREVIEWS = {

  header: (w) => {
    const color = _parseColor(w.color, "rgb(255,140,26)");
    const text = _escapeSvgText(w.text || "Header");
    const size = Math.max(10, Math.min(24, (parseFloat(w.size) || 1) * 14));
    const anchor = w.align === "left" ? "start" : (w.align === "right" ? "end" : "middle");
    const x = w.align === "left" ? 8 : (w.align === "right" ? 192 : 100);
    return `<svg viewBox="0 0 200 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="40" fill="#07090c"/>
      <text x="${x}" y="26" font-family="Consolas,monospace" font-size="${size}" font-weight="bold" fill="${color}" text-anchor="${anchor}">${text}</text>
    </svg>`;
  },

  statusbar: (w) => {
    const color = _parseColor(w.color, "rgb(94,212,123)");
    const label = _escapeSvgText(w.label || "Status");
    // Demo-Füllstand: zeige ca. 70 %, damit man die Bar-Farbe sieht
    const fillPct = 70;
    return `<svg viewBox="0 0 200 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="40" fill="#07090c"/>
      <text x="8" y="15" font-family="Consolas,monospace" font-size="11" fill="#d8e1ec">${label}</text>
      <text x="192" y="15" font-family="Consolas,monospace" font-size="11" fill="${color}" text-anchor="end">${fillPct}%</text>
      <rect x="8" y="20" width="184" height="14" fill="none" stroke="#2a3442" stroke-width="1"/>
      <rect x="9" y="21" width="${184 * fillPct / 100 - 1}" height="12" fill="${color}"/>
    </svg>`;
  },

  value: (w) => {
    const color = _parseColor(w.color, "rgb(216,225,236)");
    const label = _escapeSvgText(w.label || "Wert");
    const source = findLcdSource(w.source);
    const unit = source ? source.unit : "";
    const demoVal = w.format === "0" ? "42" : (w.format === "0.00" ? "42.50" : "42.5");
    return `<svg viewBox="0 0 200 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="40" fill="#07090c"/>
      <text x="8" y="26" font-family="Consolas,monospace" font-size="14" fill="#d8e1ec">${label}:</text>
      <text x="192" y="26" font-family="Consolas,monospace" font-size="14" fill="${color}" text-anchor="end">${demoVal} ${unit}</text>
    </svg>`;
  }
};

function renderLcdWidgetPreview(widget) {
  const fn = LCD_PREVIEWS[widget.type];
  if (!fn) return "";
  return fn(widget);
}
