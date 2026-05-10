// ============================================================
// TOOLTIPS (Grundgerüst)
// ============================================================
// Wird ab Phase 2 aktiv genutzt. Schon jetzt einsatzbereit:
// `tooltipBadge(blockType, optionId)` liefert das HTML für ein
// (i)-Symbol — oder leeren String, wenn kein Beschreibungstext
// in DESCRIPTIONS hinterlegt ist.

let _tooltipEl = null;

function ensureTooltipEl() {
  if (_tooltipEl) return _tooltipEl;
  _tooltipEl = document.createElement("div");
  _tooltipEl.className = "tooltip";
  document.body.appendChild(_tooltipEl);
  return _tooltipEl;
}

function showTooltip(text, anchorEl) {
  if (!text) return;
  const el = ensureTooltipEl();
  el.textContent = text;
  const rect = anchorEl.getBoundingClientRect();
  // place tooltip right of the anchor; if no space, place left
  let left = rect.right + 8;
  let top = rect.top - 4;
  el.style.left = left + "px";
  el.style.top = top + "px";
  el.classList.add("show");
  // adjust if off-screen
  requestAnimationFrame(() => {
    const tipRect = el.getBoundingClientRect();
    if (tipRect.right > window.innerWidth - 8) {
      el.style.left = (rect.left - tipRect.width - 8) + "px";
    }
    if (tipRect.bottom > window.innerHeight - 8) {
      el.style.top = (window.innerHeight - tipRect.height - 8) + "px";
    }
  });
}

function hideTooltip() {
  if (_tooltipEl) _tooltipEl.classList.remove("show");
}

// HTML-Schnipsel für das (i)-Symbol neben einer Option.
// kind: 'conditions' | 'actions' — gleiche Option-ID kann in beiden
// Kategorien unterschiedliche Bedeutung haben (z. B. Thruster.override).
// Liefert leeren String, wenn keine Beschreibung hinterlegt ist.
function tooltipBadge(blockType, optionId, kind) {
  const text = getDescription(blockType, optionId, kind);
  if (!text) return "";
  const safe = escapeAttr(text);
  return `<span class="tooltip-trigger" data-tip="${safe}"
    onmouseenter="showTooltip(this.getAttribute('data-tip'), this)"
    onmouseleave="hideTooltip()"
    onfocus="showTooltip(this.getAttribute('data-tip'), this)"
    onblur="hideTooltip()"
    tabindex="0">i</span>`;
}
