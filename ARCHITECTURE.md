# Architektur

## Datei-Layout

```
se-pb-codegen/
├── index.html                  ← HTML-Skelett + <link>/<script>-Tags
├── README.md / CHANGELOG.md / TODO.md / LICENSE
├── examples/
│   └── example_outputs.md      ← Beispiel-Outputs
└── src/
    ├── css/styles.css
    └── js/
        ├── state.js
        ├── blocks/
        │   ├── catalog.js                BLOCKS-Katalog (52 Typen)
        │   ├── descriptions.js           Tooltip-Texte (DE)
        │   ├── i18n_en.js                BLOCKS_EN, CATEGORIES_EN
        │   ├── i18n_en_items.js          Condition-/Action-Labels EN
        │   ├── i18n_en_descriptions.js   Tooltip-Texte EN
        │   └── item_subtypes.js          Ore/Ingot/Komponenten/Munition
        ├── ui/
        │   ├── render.js                 Master-render
        │   ├── inputs.js                 Mutators + Fokus-Fix
        │   ├── tooltips.js               (i)-Tooltip-Engine
        │   ├── modal.js                  Themed Confirm/Prompt/Alert
        │   ├── themes.js                 9 Tool-Themes + Picker
        │   ├── i18n.js                   t()-Helper + DE/EN-Stringtable
        │   ├── dnd.js                    Block-Palette-Drag-and-Drop
        │   ├── lcd-dnd.js                LCD-Widget-Drag + Resize
        │   ├── icons.js                  Kategorie-Icons (SVG)
        │   ├── share.js                  Share-Token Export/Import
        │   └── templates.js              LocalStorage-Vorlagen
        ├── generator/
        │   ├── codegen.js                state → C#-Skript
        │   └── highlight.js              Syntax-Highlight im Output
        └── lcd/
            ├── widgets.js                LCD_WIDGETS + Themes + Presets
            ├── preview-svg.js            SVG-Live-Vorschauen
            └── composer.js               Sprite-API-C#-Generator
```

## Drei-Schichten-Aufbau

```
┌─────────────────────────────────────────────────────────────┐
│  1. DATENMODELL                                             │
│     BLOCKS              ← Katalog der 52 Block-Typen        │
│     LCD_WIDGETS         ← 19 LCD-Widget-Definitionen        │
│     DESCRIPTIONS / *_EN ← Tooltip-Texte (DE/EN)             │
│     state               ← User-Eingaben (conditions, …)     │
│     templates           ← LocalStorage-Vorlagen             │
├─────────────────────────────────────────────────────────────┤
│  2. UI-RENDERING                                            │
│     render()                                                │
│     ├─ renderConditions() / renderActions()                 │
│     ├─ renderLcdComposer() / renderTemplates()              │
│     └─ generateCode()  ← läuft nach jedem Render            │
├─────────────────────────────────────────────────────────────┤
│  3. CODE-GENERATOR                                          │
│     generateCode()                                          │
│     ├─ ensureBlock(type, name, useGroup)                    │
│     ├─ condExpr() — eine Bedingung → C#-Ausdruck            │
│     ├─ actCode()  — eine Aktion   → C#-Statement            │
│     ├─ generateLcdComposerCode() — Sprite-API + Multi-LCD   │
│     └─ Output via highlightCs()                             │
└─────────────────────────────────────────────────────────────┘
```

## Datenfluss

```
User-Interaktion (Klick/Tippen/Drag)
   ↓
addCondition() / updateCond() / setLcdWidget*() / …
   ↓
state mutiert
   ↓
render()  (oder nur generateCode() bei reinen Werteänderungen,
          damit Inputs ihren Fokus behalten)
   ↓
├─→ DOM aktualisiert
└─→ generateCode() → Output-Pane mit hervorgehobenem C#
```

## Platzhalter-System

Jede Bedingung/Aktion im Katalog kann zwei Platzhalter enthalten:

- `{v}`    — wird durch den C#-Variablennamen des Blocks ersetzt
              (z. B. `sensor_1_0`).
- `{arg}`  — wird durch den vom User eingetragenen Wert ersetzt.
- `{arg2}` — zweiter optionaler Argumentwert.

**Reihenfolge wichtig** in `condExpr()` / `actCode()`:

```js
let code = act.code;
if (act.arg2) code = code.replace(/\{arg2\}/g, _safeArg(a.arg2, ""));
if (act.arg)  code = code.replace(/\{arg\}/g,  _safeArg(a.arg,  ""));
code = code.replace(/\{v\}/g, varName);
```

Erst `{arg2}`/`{arg}`, dann `{v}` — damit `{v}` auch in User-Argumenten
funktioniert (wichtig für Custom-`rawCode`).

## Variablen-Naming

`safeVar(blockName, suffix)`:
- Ersetzt nicht-alphanumerische Zeichen durch `_`.
- Erstes Zeichen muss Buchstabe oder `_` sein.
- Hängt einen Index-Suffix an, damit gleichnamige Blöcke kollidieren.

## Block-Gruppen

`ensureBlock(type, name, useGroup)` unterscheidet Single-Block und
Gruppe per separater Map-Keys. Generator emittiert:

- **Single**: `IMyXxx var = GridTerminalSystem.GetBlockWithName(…)`
- **Gruppe**: `List<IMyXxx> var = …; GetBlockGroupWithName(…).GetBlocksOfType(var);`
- **Aktion auf Gruppe**: `foreach (var _b in list) { … }`
- **Bedingung auf Gruppe**: `list.Any(_b => …)`

## Multi-LCD (Phase 5)

Bei aktivem Multi-LCD bildet der Generator eine `for`-Schleife über
alle physischen LCDs. Jede Widget-Emission rechnet `yPos = rect.Y +
(myF - lcdOffY)` und `colOffsetX = mxF - lcdOffX`, sodass widget-
positionen relativ zum virtuellen Canvas (cols × rows × LCD) bleiben
und SE off-screen-Sprites automatisch clipt.

## Persistenz

- **LocalStorage-Keys**:
  - `se_pb_templates` — Vorlagen-Array
  - `se_pb_lang` — aktive Sprache (de/en)
  - `se_pb_tool_theme` — gewähltes Tool-Theme
- **Share-Token**: Base64-codierte UTF-8-JSON mit Schema-Version.
  Selbstenthaltend, kein Backend.

## Warum keine Frameworks?

- **Offline-Anforderung**: läuft per Doppelklick auf `index.html`,
  kein Build-Step.
- **Komplexität**: Vanilla-JS gut handhabbar; alle Globals teilen
  denselben Realm (Inline-Handler funktionieren cross-file).
- **Portabilität**: User kann Repo klonen oder ZIP runterladen,
  jeder Browser öffnet es lokal.

## Sicherheitsmodell

- Keine `eval()`/`Function()` auf User-Eingaben.
- Block-Namen werden in HTML mit `escapeHtml`/`escapeAttr` escaped,
  in C#-Strings mit `escapeCs`.
- LocalStorage ist lokal — kein Netzwerk-Verkehr.

## Ausführungs-Modi und UpdateFrequency

| Modus      | UpdateFrequency  | Wann                                          |
|------------|------------------|-----------------------------------------------|
| argument   | (keine)          | Skript läuft nur manuell aufgerufen           |
| continuous | `Update1`        | jeden Tick (~60 Hz)                           |
| timer1     | `Update100`*     | ~1.6s (SE bietet kein exaktes 1-Sek-Update)   |
| timer10    | `Update10`       | jede 10 Ticks (~6 Hz)                         |
| timer100   | `Update100`      | jede 100 Ticks (~0.6 Hz)                      |

*Anmerkung*: SE hat nur drei Update-Frequenzen (1/10/100). Für exakte
Timings müsste mit `Runtime.TimeSinceLastRun` in `Update1` gezählt werden.
