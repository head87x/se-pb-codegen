// ============================================================
// LCD WIDGET SVG-PREVIEW
// ============================================================
// Erzeugt SVG-Mini-Vorschauen pro Widget. Pro Widget eine
// monochrome Darstellung mit der eingestellten Farbe.
// Verschiedene viewBox-Höhen je nach Widget.

function _parseColor(rgbStr, fallback) {
  if (!rgbStr) return fallback;
  const parts = rgbStr.split(",").map(s => parseInt(s.trim(), 10));
  if (parts.length !== 3 || parts.some(isNaN)) return fallback;
  return `rgb(${parts[0]},${parts[1]},${parts[2]})`;
}

function _escapeSvgText(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Demo-Werte für die Vorschau (im echten Spiel kommt der Wert vom Block)
const _DEMO_PCT = 70;
const _DEMO_NUM = "42.5";

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
    return `<svg viewBox="0 0 200 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="40" fill="#07090c"/>
      <text x="8" y="15" font-family="Consolas,monospace" font-size="11" fill="#d8e1ec">${label}</text>
      <text x="192" y="15" font-family="Consolas,monospace" font-size="11" fill="${color}" text-anchor="end">${_DEMO_PCT}%</text>
      <rect x="8" y="20" width="184" height="14" fill="none" stroke="#2a3442" stroke-width="1"/>
      <rect x="9" y="21" width="${184 * _DEMO_PCT / 100 - 1}" height="12" fill="${color}"/>
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
  },

  statusbar_v: (w) => {
    const color = _parseColor(w.color, "rgb(78,197,255)");
    const label = _escapeSvgText(w.label || "Bar");
    const barH = 80;
    const fillH = barH * _DEMO_PCT / 100;
    return `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="120" fill="#07090c"/>
      <text x="100" y="14" font-family="Consolas,monospace" font-size="11" fill="#d8e1ec" text-anchor="middle">${label}</text>
      <rect x="86" y="20" width="28" height="${barH}" fill="none" stroke="#2a3442" stroke-width="1"/>
      <rect x="87" y="${20 + (barH - fillH) + 1}" width="26" height="${fillH - 1}" fill="${color}"/>
      <text x="100" y="113" font-family="Consolas,monospace" font-size="11" fill="${color}" text-anchor="middle">${_DEMO_PCT}%</text>
    </svg>`;
  },

  statusbar_seg: (w) => {
    const color = _parseColor(w.color, "rgb(255,140,26)");
    const label = _escapeSvgText(w.label || "Energie");
    const segments = Math.max(2, Math.min(40, parseInt(w.segments, 10) || 12));
    const filled = Math.round(segments * _DEMO_PCT / 100);
    const gap = 2;
    const segW = (184 - (segments - 1) * gap) / segments;
    let segHtml = "";
    for (let i = 0; i < segments; i++) {
      const x = 8 + i * (segW + gap);
      segHtml += `<rect x="${x}" y="20" width="${segW}" height="14" fill="${i < filled ? color : 'rgba(255,255,255,0.08)'}" stroke="${i < filled ? color : '#2a3442'}" stroke-width="0.5"/>`;
    }
    return `<svg viewBox="0 0 200 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="40" fill="#07090c"/>
      <text x="8" y="15" font-family="Consolas,monospace" font-size="11" fill="#d8e1ec">${label}</text>
      <text x="192" y="15" font-family="Consolas,monospace" font-size="11" fill="${color}" text-anchor="end">${_DEMO_PCT}%</text>
      ${segHtml}
    </svg>`;
  },

  bar_double: (w) => {
    const c1 = _parseColor(w.color1, "rgb(94,212,123)");
    const c2 = _parseColor(w.color2, "rgb(255,85,96)");
    const l1 = _escapeSvgText(w.label1 || "Input");
    const l2 = _escapeSvgText(w.label2 || "Output");
    const v1 = 80, v2 = 35;
    return `<svg viewBox="0 0 200 55" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="55" fill="#07090c"/>
      <text x="8" y="11" font-family="Consolas,monospace" font-size="9" fill="#d8e1ec">${l1}</text>
      <text x="192" y="11" font-family="Consolas,monospace" font-size="9" fill="${c1}" text-anchor="end">${v1}%</text>
      <rect x="8" y="14" width="184" height="9" fill="none" stroke="#2a3442" stroke-width="0.5"/>
      <rect x="9" y="15" width="${184 * v1 / 100 - 1}" height="7" fill="${c1}"/>
      <text x="8" y="35" font-family="Consolas,monospace" font-size="9" fill="#d8e1ec">${l2}</text>
      <text x="192" y="35" font-family="Consolas,monospace" font-size="9" fill="${c2}" text-anchor="end">${v2}%</text>
      <rect x="8" y="38" width="184" height="9" fill="none" stroke="#2a3442" stroke-width="0.5"/>
      <rect x="9" y="39" width="${184 * v2 / 100 - 1}" height="7" fill="${c2}"/>
    </svg>`;
  },

  donut: (w) => {
    const color = _parseColor(w.color, "rgb(94,212,123)");
    const bg = _parseColor(w.bgColor, "rgb(42,52,66)");
    const label = _escapeSvgText(w.label || "Wert");
    // Stroke-dasharray-Trick für SVG-Kreis-Fortschritt
    const r = 38, cx = 70, cy = 70, c = 2 * Math.PI * r;
    const dash = c * _DEMO_PCT / 100;
    return `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="140" fill="#07090c"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${bg}" stroke-width="8"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="8"
              stroke-dasharray="${dash} ${c}" stroke-dashoffset="0"
              transform="rotate(-90 ${cx} ${cy})" stroke-linecap="butt"/>
      <text x="${cx}" y="${cy + 3}" font-family="Consolas,monospace" font-size="18" font-weight="bold" fill="${color}" text-anchor="middle">${_DEMO_PCT}%</text>
      <text x="${cx}" y="${cy + 22}" font-family="Consolas,monospace" font-size="11" fill="#d8e1ec" text-anchor="middle">${label}</text>
    </svg>`;
  },

  dot: (w) => {
    const label = _escapeSvgText(w.label || "Status");
    // Demo: zeige mid-color (zwischen low und high)
    const color = _parseColor(w.colorMid, "rgb(255,140,26)");
    return `<svg viewBox="0 0 200 32" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="32" fill="#07090c"/>
      <circle cx="16" cy="16" r="7" fill="${color}"/>
      <circle cx="16" cy="16" r="7" fill="none" stroke="${color}" stroke-width="1" opacity="0.4">
        <animate attributeName="r" from="7" to="13" dur="1.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" from="0.7" to="0" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      <text x="32" y="21" font-family="Consolas,monospace" font-size="13" fill="#d8e1ec">${label}</text>
    </svg>`;
  },

  checklist: (w) => {
    const cOk = _parseColor(w.colorOk, "rgb(94,212,123)");
    const cBad = _parseColor(w.colorBad, "rgb(255,85,96)");
    const title = _escapeSvgText(w.title || "Systeme");
    let rows = "";
    let y = 30;
    for (let n = 1; n <= 5; n++) {
      const label = w[`s${n}_label`];
      if (!label) continue;
      // Demo: jeder zweite OK, sonst FAIL
      const ok = (n % 2 === 1);
      const sym = ok ? "✓" : "✗";
      const col = ok ? cOk : cBad;
      rows += `<text x="14" y="${y}" font-family="Consolas,monospace" font-size="13" fill="${col}">${sym}</text>`;
      rows += `<text x="30" y="${y}" font-family="Consolas,monospace" font-size="11" fill="#d8e1ec">${_escapeSvgText(label)}</text>`;
      y += 18;
    }
    return `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="130" fill="#07090c"/>
      <text x="100" y="14" font-family="Consolas,monospace" font-size="11" font-weight="bold" fill="#4ec5ff" text-anchor="middle">${title}</text>
      <line x1="8" y1="18" x2="192" y2="18" stroke="#2a3442" stroke-width="1"/>
      ${rows}
    </svg>`;
  },

  warning: (w) => {
    const color = _parseColor(w.color, "rgb(255,85,96)");
    const text = _escapeSvgText(w.text || "WARNUNG");
    const blinkAnim = (w.blink && w.blink !== "none")
      ? `<animate attributeName="opacity" values="1;0.2;1" dur="${w.blink === "fast" ? "0.5s" : "1s"}" repeatCount="indefinite"/>`
      : "";
    return `<svg viewBox="0 0 200 36" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="36" fill="#07090c"/>
      <g>${blinkAnim}
        <text x="14" y="22" font-family="Consolas,monospace" font-size="11" fill="${color}">⚠</text>
        <text x="30" y="22" font-family="Consolas,monospace" font-size="11" font-weight="bold" fill="${color}">${text}</text>
      </g>
    </svg>`;
  },

  alarm: (w) => {
    const bg = _parseColor(w.bgColor, "rgb(255,85,96)");
    const tc = _parseColor(w.textColor, "rgb(255,255,255)");
    const text = _escapeSvgText(w.text || "!! KRITISCH !!");
    const blinkAnim = (w.blink && w.blink !== "none")
      ? `<animate attributeName="opacity" values="1;0.3;1" dur="${w.blink === "fast" ? "0.4s" : "0.9s"}" repeatCount="indefinite"/>`
      : "";
    return `<svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="50" fill="#07090c"/>
      <g>${blinkAnim}
        <rect x="4" y="6" width="192" height="38" fill="${bg}"/>
        <text x="100" y="31" font-family="Consolas,monospace" font-size="15" font-weight="bold" fill="${tc}" text-anchor="middle">${text}</text>
      </g>
    </svg>`;
  }
};

function renderLcdWidgetPreview(widget) {
  const fn = LCD_PREVIEWS[widget.type];
  if (!fn) return "";
  return fn(widget);
}
