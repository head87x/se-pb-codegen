// ============================================================
// BLOCK / OPTION DESCRIPTIONS (Tooltip-Texte)
// ============================================================
// Struktur: DESCRIPTIONS[blockType][optionId] = "Erklärtext".
// Wird in Phase 2 gefüllt. Solange ein Eintrag fehlt, erscheint
// kein (i)-Symbol — Inputs.js prüft das.

const DESCRIPTIONS = {
  // Beispiel (auskommentiert, dient als Vorlage für Phase 2):
  // "Sensor": {
  //   "isActive":  "Liefert true, sobald der Sensor irgendetwas in seinem Erfassungsbereich entdeckt (Charakter, Schiff, Objekt …).",
  //   "enabled":   "Prüft, ob der Sensor-Block überhaupt eingeschaltet ist."
  // }
};

function getDescription(blockType, optionId) {
  return (DESCRIPTIONS[blockType] && DESCRIPTIONS[blockType][optionId]) || null;
}
