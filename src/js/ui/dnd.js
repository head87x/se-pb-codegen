// ============================================================
// DRAG & DROP (Phase 3)
// ============================================================
// Quelle: Block-Karten in der linken Palette.
// Ziel: Bedingungs-/Then-/Else-Container.
//
// Beim Drop wird je nach Ziel die passende Mutator-Funktion
// aufgerufen — addConditionOfType bzw. addActionOfType.

const DND_MIME = "application/x-se-pb-block";

// Wird vom Palette-Renderer für jede Karte aufgerufen.
function makePaletteCardDraggable(el, blockType) {
  el.setAttribute("draggable", "true");
  el.addEventListener("dragstart", e => {
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData(DND_MIME, blockType);
    // Fallback für Browser, die das custom MIME nicht durchreichen
    e.dataTransfer.setData("text/plain", blockType);
    el.classList.add("dragging");
  });
  el.addEventListener("dragend", () => {
    el.classList.remove("dragging");
  });
}

// Wird einmalig beim Init auf die drei Drop-Container angewendet.
// kind: 'cond' | 'then' | 'else'
function makeDropTarget(el, kind) {
  if (!el) return;
  el.addEventListener("dragover", e => {
    // Nur erlauben, wenn unser MIME mitkommt
    if (!e.dataTransfer.types.includes(DND_MIME) &&
        !e.dataTransfer.types.includes("text/plain")) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    el.classList.add("dragover");
  });

  el.addEventListener("dragleave", e => {
    // Nur entfernen, wenn wir wirklich verlassen (nicht beim Kind-Hover)
    if (e.target === el) el.classList.remove("dragover");
  });

  el.addEventListener("drop", e => {
    e.preventDefault();
    el.classList.remove("dragover");
    const blockType = e.dataTransfer.getData(DND_MIME)
                   || e.dataTransfer.getData("text/plain");
    if (!blockType || !BLOCKS[blockType]) return;

    if (kind === "cond") {
      // Bedingungen brauchen einen Block-Typ mit conditions
      if ((BLOCKS[blockType].conditions || []).length === 0) {
        showToast(`"${blockType}" hat keine prüfbaren Eigenschaften`);
        return;
      }
      addConditionOfType(blockType);
    } else if (kind === "then" || kind === "else") {
      if ((BLOCKS[blockType].actions || []).length === 0) {
        showToast(`"${blockType}" hat keine Aktionen`);
        return;
      }
      addActionOfType(kind, blockType);
    }
  });
}

// Wird einmalig beim Init aufgerufen.
function initDropTargets() {
  makeDropTarget(document.getElementById("conditions"),  "cond");
  makeDropTarget(document.getElementById("actions-then"), "then");
  makeDropTarget(document.getElementById("actions-else"), "else");
}
