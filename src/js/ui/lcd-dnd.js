// ============================================================
// LCD MANUAL-POSITION DRAG & RESIZE (Phase 4d Etappe 2)
// ============================================================
// Drag und Resize für Widgets im "Manuell positionieren"-Modus
// direkt in der Live-Vorschau. Nutzt Mouse-Events (Touch
// kommt später).
//
// Snap-to-Grid: 4 LCD-Pixel (in LCD-Koordinaten).
// Während des Drags wird nur die Cell-CSS-Position aktualisiert
// (kein voller Re-Render, sonst würde Drag stocken). Beim Loslassen
// gibt's einen kompletten render(), damit die Editor-Felder
// die neuen Werte zeigen.

const LCD_SNAP = 16;            // LCD-Pixel pro Snap-Schritt (grob = sauber alignen)
const LCD_MIN_SIZE = 32;        // Minimale Widget-Größe
const LCD_SMART_SNAP = 8;       // Threshold für Smart-Snap (LCD-Pixel)

let _lcdDragState = null;

// Virtuelle Canvas-Größe (für Multi-LCD: cols × rows × LCD).
// Single-LCD: identisch zur LCD-Auflösung.
function _lcdVirtualCanvas() {
  const lc = state.lcdComposer;
  const resKey = lc.resolution || "square";
  const res = LCD_RESOLUTIONS[resKey] || LCD_RESOLUTIONS.square;
  const ml = lc.multiLcd;
  const multi = ml && ml.enabled === true && (lc.displayMode || "external") === "external";
  const cols = multi ? Math.max(1, parseInt(ml.cols, 10) || 1) : 1;
  const rows = multi ? Math.max(1, parseInt(ml.rows, 10) || 1) : 1;
  return { w: res.w * cols, h: res.h * rows, lcdW: res.w, lcdH: res.h, cols, rows };
}

// Smart-Snap: sammle alle Snap-Kandidaten in X/Y-Richtung.
// `excludeIdx` ist das gerade gezogene Widget — dessen eigene Kanten
// nicht mitnehmen, sonst snappt es auf sich selbst.
function _lcdSnapCandidates(virt, excludeIdx) {
  const xs = [0, virt.w, virt.w / 2];   // Canvas-Kanten + Mitte
  const ys = [0, virt.h, virt.h / 2];
  // Multi-LCD interior boundaries
  for (let c = 1; c < (virt.cols || 1); c++) xs.push(c * virt.lcdW);
  for (let r = 1; r < (virt.rows || 1); r++) ys.push(r * virt.lcdH);
  // Andere Widgets — Position-Kanten und Mitten
  const widgets = state.lcdComposer.widgets || [];
  // v4.1.0 — zusätzlich Größen (Breite, Höhe) für „Gleiche Größe"-Snap
  // beim Resize. Im Resize-Code werden xs/ys nicht direkt für Größen
  // verwendet; daher liefern wir Größen separat.
  const widths  = [];
  const heights = [];
  widgets.forEach((w, i) => {
    if (i === excludeIdx) return;
    if (w.hidden) return;
    const wx = parseFloat(w.manualX) || 0;
    const wy = parseFloat(w.manualY) || 0;
    const ww = parseFloat(w.manualW) || 100;
    const wh = parseFloat(w.manualH) || 40;
    xs.push(wx, wx + ww, wx + ww / 2);
    ys.push(wy, wy + wh, wy + wh / 2);
    widths.push(ww);
    heights.push(wh);
  });
  return { xs, ys, widths, heights };
}

// Findet den besten Snap für die übergebenen Anker-Positionen.
// Gibt { offset, guide } zurück: offset = wie viel der originale Wert
// verschoben werden muss; guide = die Snap-Linien-Position (oder null).
function _lcdBestSnap(anchorPositions, candidates, threshold) {
  let bestDist = threshold + 1;
  let bestCandidate = null;
  let bestAnchor = null;
  for (const ap of anchorPositions) {
    for (const c of candidates) {
      const d = Math.abs(ap.pos - c);
      if (d < bestDist) {
        bestDist = d;
        bestCandidate = c;
        bestAnchor = ap;
      }
    }
  }
  if (bestAnchor === null) return { delta: 0, guide: null };
  return { delta: bestCandidate - bestAnchor.pos, guide: bestCandidate };
}

// Erzeugt die zwei Snap-Guide-Linien (vertical + horizontal) im Preview-
// Container. Bleiben den Drag über bestehen, werden bei mouseup entfernt.
function _lcdCreateGuides(container) {
  const vg = document.createElement("div");
  vg.className = "lcd-snap-guide lcd-snap-guide-v";
  vg.style.display = "none";
  const hg = document.createElement("div");
  hg.className = "lcd-snap-guide lcd-snap-guide-h";
  hg.style.display = "none";
  container.appendChild(vg);
  container.appendChild(hg);
  return { v: vg, h: hg };
}

function _lcdUpdateGuide(guides, scale, xPos, yPos) {
  if (!guides) return;
  if (xPos === null) {
    guides.v.style.display = "none";
  } else {
    guides.v.style.display = "";
    guides.v.style.left = (xPos * scale) + "px";
  }
  if (yPos === null) {
    guides.h.style.display = "none";
  } else {
    guides.h.style.display = "";
    guides.h.style.top = (yPos * scale) + "px";
  }
}

function _lcdRemoveGuides(guides) {
  if (!guides) return;
  if (guides.v && guides.v.parentNode) guides.v.parentNode.removeChild(guides.v);
  if (guides.h && guides.h.parentNode) guides.h.parentNode.removeChild(guides.h);
}

function initLcdDragHandlers() {
  // Delegation am Document, weil die Cells per render() neu gemalt werden
  document.addEventListener("mousedown", _lcdMouseDown);
  document.addEventListener("keydown", _lcdKeyDown);
}

// ESC = Auswahl löschen. Delete/Backspace = selektierte Widgets löschen,
// aber nur wenn der Fokus NICHT in einem Eingabefeld ist (sonst
// versehentliches Löschen beim Tippen). Tastenkürzel sind nur aktiv,
// wenn der LCD-Composer überhaupt aktiviert ist und mindestens ein
// Widget selektiert ist.
function _lcdKeyDown(e) {
  if (!state || !state.lcdComposer || !state.lcdComposer.enabled) return;
  const sel = state.lcdComposer.selectedIndices || [];
  // v4.1.0 — Strg+A: alle Widgets selektieren.
  // Nur wenn der Fokus NICHT in einem Eingabefeld ist (sonst kollidiert
  // mit „alles markieren" in Text-Inputs).
  if ((e.ctrlKey || e.metaKey) && (e.key === "a" || e.key === "A")) {
    const tag = (document.activeElement && document.activeElement.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    if (typeof selectAllLcdWidgets === "function") {
      selectAllLcdWidgets();
      e.preventDefault();
    }
    return;
  }
  if (e.key === "Escape") {
    if (sel.length > 0 && typeof clearLcdSelection === "function") {
      clearLcdSelection();
      e.preventDefault();
    }
    return;
  }
  if (e.key === "Delete" || e.key === "Backspace") {
    if (sel.length === 0) return;
    // Kein Löschen während Eingabe in Inputs/Textareas
    const tag = (document.activeElement && document.activeElement.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    if (typeof deleteSelectedLcdWidgets === "function") {
      deleteSelectedLcdWidgets();
      e.preventDefault();
    }
  }
}

function _lcdMouseDown(e) {
  // Klick auf den Preview-Hintergrund (nicht auf eine Cell) → Lasso-Select starten
  // (vorher: nur Selektion leeren — jetzt: Drag zieht Lasso-Rechteck auf).
  if (!e.target.closest(".lcd-cell-manual")) {
    const container = e.target.closest(".lcd-full-preview");
    if (container && e.button === 0) {
      _lcdStartLasso(e, container);
    }
    return;
  }
  const cell = e.target.closest(".lcd-cell-manual");
  const isResize = e.target.classList.contains("lcd-cell-resize");
  const idx = parseInt(cell.dataset.widgetIdx, 10);
  if (isNaN(idx)) return;
  const widget = state.lcdComposer.widgets[idx];
  if (!widget) return;

  e.preventDefault();

  // Selection-Logik VOR dem Drag:
  // - Shift+Click: Selektion toggle, KEIN Drag starten
  // - Plain Click auf bereits selektiertes Widget: alle selektierten draggen
  // - Plain Click auf unselektiertes Widget: nur dieses selektieren + draggen
  // Beim Resize-Handle immer single-Drag (kein Multi-Resize).
  const shiftHeld = !!e.shiftKey;
  if (shiftHeld && !isResize) {
    if (typeof toggleLcdSelection === "function") toggleLcdSelection(idx);
    render();
    return;
  }
  let dragGroup = [idx];
  if (!isResize) {
    if (typeof isLcdWidgetSelected === "function" && isLcdWidgetSelected(idx)) {
      // Multi-Drag: alle aktuell selektierten Widgets ziehen
      const sel = state.lcdComposer.selectedIndices || [];
      dragGroup = sel.slice();
    } else {
      // Nur dieses Widget — Selektion zurücksetzen.
      // v4.1.x — KEIN render() hier, sonst zerstören wir die Cell auf
      // der wir gerade dragenen (führt zu Sprung-Effekt). Stattdessen
      // direkte CSS-Klassen-Manipulation, render() läuft am Drag-Ende.
      if (typeof selectLcdOnly === "function") selectLcdOnly(idx);
      document.querySelectorAll(".lcd-cell-manual.is-selected")
        .forEach(el => el.classList.remove("is-selected"));
      cell.classList.add("is-selected");
      // Layer-Liste-Highlight wird auch nicht aktualisiert während des
      // Drags — das ist OK, weil mouseup ein vollständiges render() macht.
    }
  }

  const container = cell.closest(".lcd-full-preview");
  if (!container) return;
  // Virtuelles Canvas (für Multi-LCD ist das cols × rows × LCD-Größe).
  // INNER-Width / virtual.w ergibt den exakten Pixel-zu-LCD-Faktor.
  const virt = _lcdVirtualCanvas();
  const scaleScreen = container.clientWidth / virt.w;

  // Snap-Kandidaten einmal beim Drag-Start einsammeln (statisch — sich
  // bewegende Widgets sind eh nur dieses eine, das wir excluden).
  const candidates = _lcdSnapCandidates(virt, idx);
  const guides = _lcdCreateGuides(container);

  // Bei Multi-Drag merken wir uns die Original-Positionen aller
  // selektierten Widgets, damit jedes seinen Delta-Verlauf kennt.
  const groupOrig = dragGroup.map((gi) => {
    const w = state.lcdComposer.widgets[gi];
    return {
      idx: gi,
      origX: parseFloat(w.manualX) || 0,
      origY: parseFloat(w.manualY) || 0
    };
  });

  _lcdDragState = {
    idx, widget, isResize, scaleScreen,
    startScreenX: e.clientX,
    startScreenY: e.clientY,
    origX: parseFloat(widget.manualX) || 0,
    origY: parseFloat(widget.manualY) || 0,
    origW: parseFloat(widget.manualW) || 100,
    origH: parseFloat(widget.manualH) || 40,
    virt, container, candidates, guides,
    dragGroup, groupOrig
  };

  // Live-Maße-Badge erzeugen
  const badge = document.createElement("div");
  badge.className = "lcd-drag-badge";
  document.body.appendChild(badge);
  _lcdDragState.badge = badge;
  _lcdUpdateBadge();

  document.addEventListener("mousemove", _lcdMouseMove);
  document.addEventListener("mouseup", _lcdMouseUp);
  document.body.style.userSelect = "none";
}

function _lcdUpdateBadge() {
  const s = _lcdDragState;
  if (!s || !s.badge) return;
  const w = s.widget;
  s.badge.textContent = s.isResize
    ? `${Math.round(w.manualW)} × ${Math.round(w.manualH)} px`
    : `X: ${Math.round(w.manualX)}  Y: ${Math.round(w.manualY)} px`;
  const cell = s.container.querySelector(`.lcd-cell-manual[data-widget-idx="${s.idx}"]`);
  if (cell) {
    const r = cell.getBoundingClientRect();
    s.badge.style.left = (r.right + 6) + "px";
    s.badge.style.top  = r.top + "px";
  }
}

function _lcdMouseMove(e) {
  if (!_lcdDragState) return;
  const s = _lcdDragState;
  // Bildschirm-Delta → LCD-Pixel-Delta
  const dx = (e.clientX - s.startScreenX) / s.scaleScreen;
  const dy = (e.clientY - s.startScreenY) / s.scaleScreen;

  // Scale für Guide-Positionierung (LCD-Pixel → Screen-Pixel)
  const guideScale = s.container.clientWidth / s.virt.w;
  let guideX = null, guideY = null;

  if (s.isResize) {
    // Aspect-Lock: das Verhältnis aus LCD_MANUAL_DEFAULTS halten.
    const aspect = (typeof getLcdWidgetAspect === "function")
      ? getLcdWidgetAspect(s.widget.type) : (s.origW / s.origH);
    let newW, newH;
    const driveX = Math.abs(dx) >= Math.abs(dy);
    if (driveX) {
      newW = _snap(Math.max(LCD_MIN_SIZE, s.origW + dx));
      // Smart-Snap: rechte Kante = origX + newW an X-Kandidat?
      const snap = _lcdBestSnap(
        [{ pos: s.origX + newW }],
        s.candidates.xs,
        LCD_SMART_SNAP
      );
      if (snap.guide !== null) {
        newW = Math.max(LCD_MIN_SIZE, newW + snap.delta);
        guideX = snap.guide;
      }
      // v4.1.0 — „Gleiche Breite wie Nachbar"-Snap. Wenn newW nahe an
      // einer Breite eines anderen Widgets liegt, dort einrasten.
      const widthSnap = _lcdBestSnap(
        [{ pos: newW }],
        s.candidates.widths || [],
        LCD_SMART_SNAP
      );
      if (widthSnap.guide !== null) {
        newW = Math.max(LCD_MIN_SIZE, newW + widthSnap.delta);
      }
      newH = _snap(Math.max(LCD_MIN_SIZE, newW / aspect));
    } else {
      newH = _snap(Math.max(LCD_MIN_SIZE, s.origH + dy));
      const snap = _lcdBestSnap(
        [{ pos: s.origY + newH }],
        s.candidates.ys,
        LCD_SMART_SNAP
      );
      if (snap.guide !== null) {
        newH = Math.max(LCD_MIN_SIZE, newH + snap.delta);
        guideY = snap.guide;
      }
      // v4.1.0 — „Gleiche Höhe wie Nachbar"-Snap
      const heightSnap = _lcdBestSnap(
        [{ pos: newH }],
        s.candidates.heights || [],
        LCD_SMART_SNAP
      );
      if (heightSnap.guide !== null) {
        newH = Math.max(LCD_MIN_SIZE, newH + heightSnap.delta);
      }
      newW = _snap(Math.max(LCD_MIN_SIZE, newH * aspect));
    }
    // Boundary: nicht über virtuellen Canvas hinaus
    if (s.origX + newW > s.virt.w) {
      newW = s.virt.w - s.origX;
      newH = _snap(newW / aspect);
    }
    if (s.origY + newH > s.virt.h) {
      newH = s.virt.h - s.origY;
      newW = _snap(newH * aspect);
    }
    s.widget.manualW = newW;
    s.widget.manualH = newH;
  } else {
    let newX = _snap(s.origX + dx);
    let newY = _snap(s.origY + dy);

    // Smart-Snap X: prüfe links / Mitte / rechts gegen X-Kandidaten
    const w = s.origW;
    const snapX = _lcdBestSnap(
      [
        { pos: newX },          // linke Kante
        { pos: newX + w / 2 },  // Mitte
        { pos: newX + w }       // rechte Kante
      ],
      s.candidates.xs,
      LCD_SMART_SNAP
    );
    if (snapX.guide !== null) {
      newX += snapX.delta;
      guideX = snapX.guide;
    }

    // Smart-Snap Y: prüfe oben / Mitte / unten gegen Y-Kandidaten
    const h = s.origH;
    const snapY = _lcdBestSnap(
      [
        { pos: newY },
        { pos: newY + h / 2 },
        { pos: newY + h }
      ],
      s.candidates.ys,
      LCD_SMART_SNAP
    );
    if (snapY.guide !== null) {
      newY += snapY.delta;
      guideY = snapY.guide;
    }

    // Boundary: Widget bleibt innerhalb des virtuellen Canvas
    newX = Math.max(0, Math.min(newX, s.virt.w - s.origW));
    newY = Math.max(0, Math.min(newY, s.virt.h - s.origH));
    s.widget.manualX = newX;
    s.widget.manualY = newY;

    // Multi-Drag: verbleibende Gruppen-Widgets um denselben Delta
    // verschieben, basierend auf ihren ursprünglichen Positionen.
    if (s.dragGroup && s.dragGroup.length > 1) {
      const finalDX = newX - s.origX;
      const finalDY = newY - s.origY;
      for (const go of s.groupOrig) {
        if (go.idx === s.idx) continue;
        const other = state.lcdComposer.widgets[go.idx];
        if (!other) continue;
        const ow = parseFloat(other.manualW) || 100;
        const oh = parseFloat(other.manualH) || 40;
        let nx = go.origX + finalDX;
        let ny = go.origY + finalDY;
        nx = Math.max(0, Math.min(nx, s.virt.w - ow));
        ny = Math.max(0, Math.min(ny, s.virt.h - oh));
        other.manualX = nx;
        other.manualY = ny;
        _lcdUpdateCellGeometry(go.idx);
      }
    }
  }

  _lcdUpdateCellGeometry(s.idx);
  _lcdUpdateBadge();
  _lcdUpdateGuide(s.guides, guideScale, guideX, guideY);
}

function _lcdMouseUp() {
  if (!_lcdDragState) return;
  document.removeEventListener("mousemove", _lcdMouseMove);
  document.removeEventListener("mouseup", _lcdMouseUp);
  document.body.style.userSelect = "";
  if (_lcdDragState.badge) _lcdDragState.badge.remove();
  _lcdRemoveGuides(_lcdDragState.guides);
  _lcdDragState = null;
  render();
}

function _snap(v) {
  return Math.round(v / LCD_SNAP) * LCD_SNAP;
}

// Während des Drags: nur die CSS-Position der gerade gezogenen
// Cell updaten. Kein voller Re-Render (würde Mouse-Events brechen).
function _lcdUpdateCellGeometry(idx) {
  const w = state.lcdComposer.widgets[idx];
  if (!w) return;
  const container = document.querySelector(".lcd-full-preview");
  if (!container) return;
  const cell = container.querySelector(`.lcd-cell-manual[data-widget-idx="${idx}"]`);
  if (!cell) return;
  // Virtuelles Canvas (für Multi-LCD: cols × rows × LCD-Größe)
  const virt = _lcdVirtualCanvas();
  const scale = container.clientWidth / virt.w;
  cell.style.left   = Math.round((parseFloat(w.manualX) || 0) * scale) + "px";
  cell.style.top    = Math.round((parseFloat(w.manualY) || 0) * scale) + "px";
  cell.style.width  = Math.round((parseFloat(w.manualW) || 100) * scale) + "px";
  cell.style.height = Math.round((parseFloat(w.manualH) || 40) * scale) + "px";
}

// ============================================================
// v4.1.0 — Lasso-Select
// ============================================================
// Drag auf den Preview-Hintergrund (nicht auf einem Widget) zieht ein
// Auswahl-Rechteck. Beim Loslassen werden alle Widgets selektiert,
// deren Bounding-Box den Rahmen schneidet.
// Mit gehaltener Shift-Taste wird die bestehende Selektion erweitert,
// sonst ersetzt.

let _lcdLassoState = null;

function _lcdStartLasso(e, container) {
  const rect = container.getBoundingClientRect();
  const virt = _lcdVirtualCanvas();
  const scale = container.clientWidth / virt.w;
  // Start-Position relativ zum Container in LCD-Pixeln
  const startX = (e.clientX - rect.left) / scale;
  const startY = (e.clientY - rect.top) / scale;
  // Falls nicht Shift → bestehende Selektion erst beim Mouseup ersetzen
  _lcdLassoState = {
    container, rect, scale,
    startX, startY,
    currX: startX, currY: startY,
    additive: !!e.shiftKey,
    moved: false,
    box: null
  };
  // Lasso-Box-Element erzeugen
  const box = document.createElement("div");
  box.className = "lcd-lasso-box";
  container.appendChild(box);
  _lcdLassoState.box = box;
  _lcdUpdateLassoBox();
  document.addEventListener("mousemove", _lcdLassoMove);
  document.addEventListener("mouseup", _lcdLassoUp);
  document.body.style.userSelect = "none";
  e.preventDefault();
}

function _lcdLassoMove(e) {
  if (!_lcdLassoState) return;
  const s = _lcdLassoState;
  s.currX = (e.clientX - s.rect.left) / s.scale;
  s.currY = (e.clientY - s.rect.top)  / s.scale;
  if (Math.abs(s.currX - s.startX) > 1 || Math.abs(s.currY - s.startY) > 1) {
    s.moved = true;
  }
  _lcdUpdateLassoBox();
}

function _lcdUpdateLassoBox() {
  const s = _lcdLassoState;
  if (!s || !s.box) return;
  const x = Math.min(s.startX, s.currX);
  const y = Math.min(s.startY, s.currY);
  const w = Math.abs(s.currX - s.startX);
  const h = Math.abs(s.currY - s.startY);
  s.box.style.left   = Math.round(x * s.scale) + "px";
  s.box.style.top    = Math.round(y * s.scale) + "px";
  s.box.style.width  = Math.round(w * s.scale) + "px";
  s.box.style.height = Math.round(h * s.scale) + "px";
}

function _lcdLassoUp() {
  if (!_lcdLassoState) return;
  document.removeEventListener("mousemove", _lcdLassoMove);
  document.removeEventListener("mouseup", _lcdLassoUp);
  document.body.style.userSelect = "";
  const s = _lcdLassoState;
  const box = s.box;
  _lcdLassoState = null;
  if (box && box.parentNode) box.parentNode.removeChild(box);

  // Wenn die Maus kaum bewegt wurde: wie ein normaler Background-Klick
  // behandeln (Selektion leeren, außer Shift war gehalten).
  if (!s.moved) {
    if (!s.additive && typeof clearLcdSelection === "function") {
      clearLcdSelection();
    }
    return;
  }

  // Rechteck in LCD-Koordinaten
  const x1 = Math.min(s.startX, s.currX);
  const y1 = Math.min(s.startY, s.currY);
  const x2 = Math.max(s.startX, s.currX);
  const y2 = Math.max(s.startY, s.currY);

  // Alle Widgets, deren Bounding-Box den Rahmen schneidet
  const widgets = state.lcdComposer.widgets || [];
  const hits = [];
  widgets.forEach((w, idx) => {
    if (w.hidden) return;
    const wx = parseFloat(w.manualX) || 0;
    const wy = parseFloat(w.manualY) || 0;
    const ww = parseFloat(w.manualW) || 100;
    const wh = parseFloat(w.manualH) || 40;
    const intersect = !(wx + ww < x1 || wx > x2 || wy + wh < y1 || wy > y2);
    if (intersect) hits.push(idx);
  });

  const sel = (state.lcdComposer.selectedIndices = state.lcdComposer.selectedIndices || []);
  if (s.additive) {
    // Bestehende Selektion + Hits (Union)
    for (const i of hits) if (sel.indexOf(i) === -1) sel.push(i);
  } else {
    sel.length = 0;
    for (const i of hits) sel.push(i);
  }
  render();
}
