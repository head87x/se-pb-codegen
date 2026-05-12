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
    // Kompakte schmale viewBox — Säule füllt die ganze Breite
    const barH = 80;
    const fillH = barH * _DEMO_PCT / 100;
    return `<svg viewBox="0 0 50 120" xmlns="http://www.w3.org/2000/svg">
      <rect width="50" height="120" fill="#07090c"/>
      <text x="25" y="11" font-family="Consolas,monospace" font-size="9" fill="#d8e1ec" text-anchor="middle">${label}</text>
      <rect x="6" y="16" width="38" height="${barH}" fill="none" stroke="#2a3442" stroke-width="1"/>
      <rect x="7" y="${16 + (barH - fillH) + 1}" width="36" height="${fillH - 1}" fill="${color}"/>
      <text x="25" y="111" font-family="Consolas,monospace" font-size="9" fill="${color}" text-anchor="middle">${_DEMO_PCT}%</text>
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
    // Kompakte quadratische viewBox — Donut füllt fast die ganze Fläche
    const r = 44, cx = 50, cy = 50, c = 2 * Math.PI * r;
    const dash = c * _DEMO_PCT / 100;
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#07090c"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${bg}" stroke-width="6"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="6"
              stroke-dasharray="${dash} ${c}" stroke-dashoffset="0"
              transform="rotate(-90 ${cx} ${cy})" stroke-linecap="butt"/>
      <text x="${cx}" y="${cy + 3}" font-family="Consolas,monospace" font-size="16" font-weight="bold" fill="${color}" text-anchor="middle">${_DEMO_PCT}%</text>
      <text x="${cx}" y="${cy + 18}" font-family="Consolas,monospace" font-size="8" fill="#d8e1ec" text-anchor="middle">${label}</text>
    </svg>`;
  },

  dot: (w) => {
    const label = _escapeSvgText(w.label || "Status");
    // Demo: zeige mid-color (zwischen low und high)
    const color = _parseColor(w.colorMid, "rgb(255,140,26)");
    // Enge viewBox: Kreis links + Label rechts, kein leerer Platz rechts
    return `<svg viewBox="0 0 100 24" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="24" fill="#07090c"/>
      <circle cx="11" cy="12" r="6" fill="${color}"/>
      <circle cx="11" cy="12" r="6" fill="none" stroke="${color}" stroke-width="1" opacity="0.4">
        <animate attributeName="r" from="6" to="11" dur="1.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" from="0.7" to="0" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      <text x="22" y="16" font-family="Consolas,monospace" font-size="11" fill="#d8e1ec">${label}</text>
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

// ============ Phase 4c ============

LCD_PREVIEWS.section = (w) => {
  const bg = _parseColor(w.bgColor, "rgb(78,197,255)");
  const tc = _parseColor(w.textColor, "rgb(10,14,18)");
  const text = _escapeSvgText(w.text || "Section");
  return `<svg viewBox="0 0 200 28" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="28" fill="#07090c"/>
    <rect x="0" y="4" width="200" height="20" fill="${bg}"/>
    <text x="100" y="19" font-family="Consolas,monospace" font-size="12" font-weight="bold" fill="${tc}" text-anchor="middle" letter-spacing="2">${text}</text>
  </svg>`;
};

LCD_PREVIEWS.divider = (w) => {
  const color = _parseColor(w.color, "rgb(42,52,66)");
  const text = _escapeSvgText(w.text || "");
  if (!text) {
    return `<svg viewBox="0 0 200 18" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="18" fill="#07090c"/>
      <line x1="8" y1="9" x2="192" y2="9" stroke="${color}" stroke-width="1"/>
    </svg>`;
  }
  // Mit Text: zwei kurze Linien links + rechts vom Text
  return `<svg viewBox="0 0 200 18" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="18" fill="#07090c"/>
    <line x1="8" y1="9" x2="70" y2="9" stroke="${color}" stroke-width="1"/>
    <line x1="130" y1="9" x2="192" y2="9" stroke="${color}" stroke-width="1"/>
    <text x="100" y="13" font-family="Consolas,monospace" font-size="10" fill="${color}" text-anchor="middle">${text}</text>
  </svg>`;
};

LCD_PREVIEWS.spacer = (w) => {
  const h = Math.max(8, Math.min(80, parseFloat(w.spaceHeight) || 20));
  return `<svg viewBox="0 0 200 ${h}" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="${h}" fill="#07090c"/>
    <text x="100" y="${h/2 + 4}" font-family="Consolas,monospace" font-size="9" fill="#3a4252" text-anchor="middle" font-style="italic">— Spacer (${Math.round(h)}px) —</text>
  </svg>`;
};

LCD_PREVIEWS.clock = (w) => {
  const color = _parseColor(w.color, "rgb(78,197,255)");
  // Demo-Text + Font-Größe ans Format anpassen, damit alle Formate
  // in die enge viewBox passen.
  let text, size;
  switch (w.format) {
    case "HH:mm":            text = "14:23";              size = 14; break;
    case "yyyy-MM-dd":       text = "2026-05-11";         size = 11; break;
    case "dd.MM.yyyy HH:mm": text = "11.05.2026 14:23";   size = 7.5; break;
    default:                 text = "14:23:45";           size = 13;
  }
  size = (parseFloat(w.size) || 1.2) * size / 1.2;
  // Enge viewBox 100×26 — Text füllt die Breite optisch
  const x = w.align === "left" ? 4 : (w.align === "right" ? 96 : 50);
  const anchor = w.align === "left" ? "start" : (w.align === "right" ? "end" : "middle");
  return `<svg viewBox="0 0 100 26" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="26" fill="#07090c"/>
    <text x="${x}" y="19" font-family="Consolas,monospace" font-size="${size}" font-weight="bold" fill="${color}" text-anchor="${anchor}">${text}</text>
  </svg>`;
};

LCD_PREVIEWS.bigvalue = (w) => {
  const color = _parseColor(w.color, "rgb(255,140,26)");
  const label = _escapeSvgText(w.label || "WERT");
  const source = findLcdSource(w.source);
  const unit = source ? source.unit : "";
  const demoVal = w.format === "0" ? "42" : (w.format === "0.00" ? "42.50" : "42.5");
  // Enge viewBox 140×64: Label oben, große Zahl mittig — kein leerer Rand
  return `<svg viewBox="0 0 140 64" xmlns="http://www.w3.org/2000/svg">
    <rect width="140" height="64" fill="#07090c"/>
    <text x="70" y="14" font-family="Consolas,monospace" font-size="10" fill="#d8e1ec" text-anchor="middle" letter-spacing="1.5">${label}</text>
    <text x="70" y="50" font-family="Consolas,monospace" font-size="32" font-weight="bold" fill="${color}" text-anchor="middle">${demoVal}</text>
    <text x="134" y="60" font-family="Consolas,monospace" font-size="9" fill="${color}" text-anchor="end">${unit}</text>
  </svg>`;
};

LCD_PREVIEWS.iconvalue = (w) => {
  const color = _parseColor(w.color, "rgb(78,197,255)");
  const label = _escapeSvgText(w.label || "Icon");
  const source = findLcdSource(w.source);
  const unit = source ? source.unit : "";
  const demoVal = w.format === "0" ? "42" : (w.format === "0.00" ? "42.50" : "42.5");
  // Vereinfachtes SVG-Icon (anstatt SE-Sprites, weil die im Browser nicht verfügbar sind)
  let iconSvg = "";
  switch (w.icon) {
    case "IconEnergy":   iconSvg = `<path d="M22 12 L14 24 L20 24 L16 32 L26 20 L20 20 Z" fill="${color}"/>`; break;
    case "IconHydrogen": iconSvg = `<circle cx="20" cy="22" r="9" fill="none" stroke="${color}" stroke-width="2"/><text x="20" y="26" font-family="Consolas" font-size="10" fill="${color}" text-anchor="middle">H</text>`; break;
    case "IconOxygen":   iconSvg = `<circle cx="20" cy="22" r="9" fill="none" stroke="${color}" stroke-width="2"/><text x="20" y="26" font-family="Consolas" font-size="10" fill="${color}" text-anchor="middle">O</text>`; break;
    case "IconUranium":  iconSvg = `<circle cx="20" cy="22" r="3" fill="${color}"/><circle cx="20" cy="22" r="9" fill="none" stroke="${color}" stroke-width="1"/>`; break;
    case "Danger":       iconSvg = `<path d="M20 12 L30 30 L10 30 Z" fill="none" stroke="${color}" stroke-width="2"/><text x="20" y="28" font-family="Consolas" font-size="11" font-weight="bold" fill="${color}" text-anchor="middle">!</text>`; break;
    case "Cross":        iconSvg = `<path d="M14 16 L26 28 M26 16 L14 28" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`; break;
    case "CrossHair":    iconSvg = `<circle cx="20" cy="22" r="8" fill="none" stroke="${color}" stroke-width="1.5"/><line x1="20" y1="12" x2="20" y2="32" stroke="${color}"/><line x1="10" y1="22" x2="30" y2="22" stroke="${color}"/>`; break;
    case "Arrow":        iconSvg = `<path d="M12 22 L26 22 M22 18 L26 22 L22 26" stroke="${color}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`; break;
    default:             iconSvg = `<rect x="14" y="16" width="12" height="12" fill="none" stroke="${color}" stroke-width="2"/>`;
  }
  return `<svg viewBox="0 0 200 38" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="38" fill="#07090c"/>
    ${iconSvg}
    <text x="44" y="20" font-family="Consolas,monospace" font-size="11" fill="#d8e1ec">${label}</text>
    <text x="192" y="26" font-family="Consolas,monospace" font-size="16" font-weight="bold" fill="${color}" text-anchor="end">${demoVal} ${unit}</text>
  </svg>`;
};

LCD_PREVIEWS.aggregator = (w) => {
  const color = _parseColor(w.color, "rgb(94,212,123)");
  const label = _escapeSvgText(w.label || "Aggregat");
  // Demo-Wert je nach Modus
  const symbol = w.mode === "sum" ? "Σ" : (w.mode === "min" ? "↓" : (w.mode === "max" ? "↑" : "Ø"));
  const demoVal = "78";
  const unit = (w.aggregateType || "").includes("output") ? " MW"
             : (w.aggregateType || "").includes("mass")   ? " kg"
             : " %";
  return `<svg viewBox="0 0 200 38" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="38" fill="#07090c"/>
    <text x="14" y="14" font-family="Consolas,monospace" font-size="14" font-weight="bold" fill="${color}">${symbol}</text>
    <text x="32" y="14" font-family="Consolas,monospace" font-size="11" fill="#d8e1ec">${label}</text>
    <text x="192" y="28" font-family="Consolas,monospace" font-size="16" font-weight="bold" fill="${color}" text-anchor="end">${demoVal}${unit}</text>
    <text x="14" y="28" font-family="Consolas,monospace" font-size="9" fill="#6b7a8d">${w.mode || "avg"} aller Blöcke</text>
  </svg>`;
};

LCD_PREVIEWS.gauge = (w) => {
  const color = _parseColor(w.color, "rgb(255,140,26)");
  const bg = _parseColor(w.bgColor, "rgb(42,52,66)");
  const label = _escapeSvgText(w.label || "Gauge");
  // Halbring 270°: Bogen geht von -135° über oben/rechts/unten nach +135°
  // — der untere Scheitel sitzt bei cy+r. Mit stroke=7 muss
  // cy + r + 3.5 ≤ 80 und cy - r - 3.5 ≥ 0 sein, sonst Abschneiden.
  const cx = 50, cy = 40, r = 36;
  const startAng = -Math.PI * 0.75;
  const endAng = Math.PI * 0.75;
  const valAng = startAng + (endAng - startAng) * 0.65;
  const polar = (a, rad) => `${cx + Math.cos(a) * rad},${cy + Math.sin(a) * rad}`;
  const bgArc = `M ${polar(startAng, r)} A ${r} ${r} 0 1 1 ${polar(endAng, r)}`;
  const valArc = `M ${polar(startAng, r)} A ${r} ${r} 0 ${(valAng - startAng) > Math.PI ? 1 : 0} 1 ${polar(valAng, r)}`;
  return `<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="80" fill="#07090c"/>
    <path d="${bgArc}" fill="none" stroke="${bg}" stroke-width="7"/>
    <path d="${valArc}" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="butt"/>
    <text x="${cx}" y="${cy + 4}" font-family="Consolas,monospace" font-size="14" font-weight="bold" fill="${color}" text-anchor="middle">42</text>
    <text x="${cx}" y="${cy + 16}" font-family="Consolas,monospace" font-size="7" fill="#d8e1ec" text-anchor="middle">${label}</text>
  </svg>`;
};

// ============ End Phase 4c ============

function renderLcdWidgetPreview(widget) {
  const fn = LCD_PREVIEWS[widget.type];
  if (!fn) return "";
  let svg = fn(widget);
  // Optionaler Widget-Hintergrund: ersetzt den schwarzen Standard-Rect.
  if (widget.widgetBg && widget.widgetBg.trim()) {
    const color = _parseColor(widget.widgetBg, "rgb(7,9,12)");
    // Erstes <rect ... fill="#07090c"/> oder fill="#XXXXXX" am Anfang ersetzen
    svg = svg.replace(/(<rect [^>]*fill=")#07090c("[^>]*\/>)/, `$1${color}$2`);
  }
  return svg;
}
