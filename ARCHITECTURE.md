# Architektur

## Datei-Layout

```
se-pb-codegen/
├── index.html          ← einzige Quelldatei: HTML + CSS + JS in einem
├── README.md           ← User-Doku
├── CLAUDE.md           ← Kontext für Claude Code
├── ARCHITECTURE.md     ← dieses Dokument
└── examples/
    └── example_outputs.md  ← Beispiel-Outputs für drei Szenarien
```

## Drei-Schichten-Aufbau in `index.html`

```
┌─────────────────────────────────────────────────────────────┐
│  1. DATENMODELL                                             │
│     const BLOCKS = { ... }     ← Katalog                    │
│     var state = { ... }        ← User-Eingaben              │
│     var templates = [ ... ]    ← gespeicherte Vorlagen      │
├─────────────────────────────────────────────────────────────┤
│  2. UI-RENDERING                                            │
│     render()                                                │
│     ├─ renderConditions()                                   │
│     ├─ renderActions('then'/'else')                         │
│     ├─ renderTemplates()                                    │
│     └─ generateCode()  ← triggered nach jedem Render        │
├─────────────────────────────────────────────────────────────┤
│  3. CODE-GENERATOR                                          │
│     generateCode()                                          │
│     ├─ ensureBlock() — Block-Dedup                          │
│     ├─ condExpr()   — eine Bedingung → C#-Ausdruck          │
│     ├─ actCode()    — eine Aktion   → C#-Statement          │
│     └─ String-Assembly mit Highlight                        │
└─────────────────────────────────────────────────────────────┘
```

## Datenfluss

```
User-Klick
   ↓
addCondition() / updateCond() / addAction() / ...
   ↓
state mutiert
   ↓
render()
   ↓
├─→ DOM aktualisiert (Bedingungs- und Aktions-UI)
└─→ generateCode() → output-DIV mit hervorgehobenem C#-Code
```

## Platzhalter-System

Jede Bedingung und Aktion im Katalog kann zwei Platzhalter enthalten:

- `{v}` — wird beim Generieren durch den C#-Variablennamen des Blocks ersetzt
  (z.B. `sensor_1_0`).
- `{arg}` — wird durch den vom User in das Argument-Feld eingetragenen Wert
  ersetzt.

**Wichtige Reihenfolge** in `condExpr()` und `actCode()`:

```js
let code = act.code;
if (act.arg) code = code.replace(/\{arg\}/g, a.arg || "");
code = code.replace(/\{v\}/g, varName);
```

Erst `{arg}`, dann `{v}` — damit `{v}` auch im User-Argument funktioniert
(wichtig für Custom-`rawCode`, wo der User z.B. `{v}.Enabled = !{v}.Enabled;`
eingibt).

## Variablen-Naming

`safeVar(blockName, suffix)`:
- Entfernt alle nicht-alphanumerischen Zeichen (Leerzeichen → `_`).
- Stellt sicher, dass das erste Zeichen ein Buchstabe oder `_` ist.
- Hängt einen Index-Suffix an, der pro Block im `blockMap` hochgezählt wird —
  so kollidieren auch identische Block-Namen (innerhalb verschiedener Block-Typen)
  nicht im generierten C#.

Beispiel:
- `"Sensor 1"` (Sensor) → `sensor_1_0`
- `"Sensor 1"` (Door)   → `sensor_1_1`

## State-Mutation-Pattern

Alle UI-Handler folgen demselben Muster:

```js
function updateCond(i, field, val) {
  state.conditions[i][field] = val;
  if (field === "blockType") {  // Cascading reset
    state.conditions[i].condId = BLOCKS[val].conditions[0]?.id || "";
    state.conditions[i].arg = "";
  }
  render();
}
```

Wechselt der User den **Block-Typ**, wird die `condId` auf die erste verfügbare
Bedingung dieses neuen Typs zurückgesetzt — sonst hätte man einen "verwaisten"
Identifier aus dem alten Typ.

## Persistenz

`localStorage`-Key: `se_pb_templates`
Format: `Array<{ name: string, state: <state-snapshot> }>`

Bei `loadTemplate()` wird der Snapshot deep-kopiert (`JSON.parse(JSON.stringify(...))`).
Bei strukturellen State-Änderungen ist eine Migration sinnvoll — aktuell nicht
implementiert, da v1.

## Warum keine Frameworks?

- **Offline-Anforderung**: Single-File, kein CDN.
- **Komplexität**: ~600 Zeilen Logik, gut handhabbar in Vanilla.
- **Reload-Geschwindigkeit**: keine Build-Step, sofort sichtbare Änderungen.
- **Portabilität**: User kann `index.html` weitergeben, jeder Browser öffnet es.

## Sicherheitsmodell

- Keine `eval()` / `Function()`-Konstruktoren auf User-Eingaben.
- Block-Namen werden in HTML mit `escapeHtml`/`escapeAttr` escaped, in
  C#-Strings mit `escapeCs` (Anführungszeichen-Escaping).
- `localStorage` ist lokal — kein Netzwerk-Verkehr.

## Ausführungs-Modi und UpdateFrequency

| Modus      | UpdateFrequency      | Wann                                          |
|------------|----------------------|-----------------------------------------------|
| argument   | (keine)              | Skript läuft nur, wenn manuell aufgerufen     |
| continuous | `Update1`            | jeden Tick (~60 Hz)                           |
| timer1     | `Update100`*         | ~1.6s — Hinweis: kein echtes 1-Sek-Update     |
| timer10    | `Update10`           | jede 10 Ticks (~6 Hz)                         |
| timer100   | `Update100`          | jede 100 Ticks (~0.6 Hz)                      |

*Anmerkung*: SE bietet nur drei Update-Frequenzen (1/10/100). "1 Sekunde" gibt es
nicht direkt — `Update100` ist mit ~1.6s die nächste sinnvolle Approximation.
Für exakte Timing-Anforderungen müsste mit `Runtime.TimeSinceLastRun` in `Update1`
manuell gezählt werden (TODO für v2).
