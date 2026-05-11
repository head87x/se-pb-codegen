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

const LCD_SNAP = 4;       // LCD-Pixel pro Snap-Schritt
const LCD_MIN_SIZE = 24;  // Minimale Widget-Größe (LCD-Pixel)

let _lcdDragState = null;

function initLcdDragHandlers() {
  // Delegation am Document, weil die Cells per render() neu gemalt werden
  document.addEventListener("mousedown", _lcdMouseDown);
}

function _lcdMouseDown(e) {
  const cell = e.target.closest(".lcd-cell-manual");
  if (!cell) return;
  const isResize = e.target.classList.contains("lcd-cell-resize");
  const idx = parseInt(cell.dataset.widgetIdx, 10);
  if (isNaN(idx)) return;
  const widget = state.lcdComposer.widgets[idx];
  if (!widget) return;

  e.preventDefault();

  const container = cell.closest(".lcd-full-preview");
  if (!container) return;
  const containerRect = container.getBoundingClientRect();
  const resKey = state.lcdComposer.resolution || "square";
  const res = LCD_RESOLUTIONS[resKey] || LCD_RESOLUTIONS.square;
  // Browser-Pixel pro LCD-Pixel
  const scaleScreen = containerRect.width / res.w;

  _lcdDragState = {
    idx, widget, isResize, scaleScreen,
    startScreenX: e.clientX,
    startScreenY: e.clientY,
    origX: parseFloat(widget.manualX) || 0,
    origY: parseFloat(widget.manualY) || 0,
    origW: parseFloat(widget.manualW) || 100,
    origH: parseFloat(widget.manualH) || 40,
    res, container
  };

  document.addEventListener("mousemove", _lcdMouseMove);
  document.addEventListener("mouseup", _lcdMouseUp);
  document.body.style.userSelect = "none";  // verhindert Text-Selektion beim Drag
}

function _lcdMouseMove(e) {
  if (!_lcdDragState) return;
  const s = _lcdDragState;
  // Bildschirm-Delta → LCD-Pixel-Delta
  const dx = (e.clientX - s.startScreenX) / s.scaleScreen;
  const dy = (e.clientY - s.startScreenY) / s.scaleScreen;

  if (s.isResize) {
    const newW = _snap(Math.max(LCD_MIN_SIZE, s.origW + dx));
    const newH = _snap(Math.max(LCD_MIN_SIZE, s.origH + dy));
    // Boundary: nicht über LCD-Rand hinaus
    s.widget.manualW = Math.min(newW, s.res.w - s.origX);
    s.widget.manualH = Math.min(newH, s.res.h - s.origY);
  } else {
    let newX = _snap(s.origX + dx);
    let newY = _snap(s.origY + dy);
    // Boundary: Widget bleibt innerhalb LCD
    newX = Math.max(0, Math.min(newX, s.res.w - s.origW));
    newY = Math.max(0, Math.min(newY, s.res.h - s.origH));
    s.widget.manualX = newX;
    s.widget.manualY = newY;
  }

  _lcdUpdateCellGeometry(s.idx);
}

function _lcdMouseUp() {
  if (!_lcdDragState) return;
  document.removeEventListener("mousemove", _lcdMouseMove);
  document.removeEventListener("mouseup", _lcdMouseUp);
  document.body.style.userSelect = "";
  _lcdDragState = null;
  // Voll-Render: aktualisiert die Editor-Felder UND generateCode()
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
  const resKey = state.lcdComposer.resolution || "square";
  const res = LCD_RESOLUTIONS[resKey] || LCD_RESOLUTIONS.square;
  const containerWidth = container.getBoundingClientRect().width;
  const scale = containerWidth / res.w;
  cell.style.left   = Math.round((parseFloat(w.manualX) || 0) * scale) + "px";
  cell.style.top    = Math.round((parseFloat(w.manualY) || 0) * scale) + "px";
  cell.style.width  = Math.round((parseFloat(w.manualW) || 100) * scale) + "px";
  cell.style.height = Math.round((parseFloat(w.manualH) || 40) * scale) + "px";
}
