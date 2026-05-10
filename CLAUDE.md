# CLAUDE.md

Diese Datei gibt Claude Code Kontext für die Arbeit an diesem Projekt.

## Bei Session-Start

Zu Beginn jeder neuen Session:

1. Lies diese Datei und `CHANGELOG.md`, um den aktuellen Stand zu kennen.
2. Erinnere den User daran, bei Bedarf `/init` auszuführen.
   **Achtung:** `/init` überschreibt diese `CLAUDE.md` — also nur dann
   ausführen, wenn sich am Projekt grundlegend etwas geändert hat. Andernfalls
   reicht es, dass diese Datei beim Start automatisch geladen wird.

## Projekt-Kurzbeschreibung

**SE.PB Code Generator** — ein Web-Tool (`index.html` + Module unter
`src/`), das per visuellem Baukasten C#-Code für den Programmable Block in
Space Engineers generiert. Komplett vanilla HTML/CSS/JS, **kein Build**, keine
Dependencies, läuft offline im Browser (einfacher Doppelklick auf
`index.html`).

## Architektur in einem Satz

`index.html` ist nur noch das HTML-Skelett; die Logik ist in mehrere
JS-Module unter `src/js/` aufgeteilt — drei Schichten bleiben:
**BLOCKS-Katalog** (Datenmodell), **State + UI-Renderer** (Zustand und
DOM-Aufbau), **Code-Generator** (state → C#-String).

## Wichtigste Code-Regionen

| Datei                                  | Inhalt |
|----------------------------------------|--------|
| `src/js/blocks/catalog.js`             | `BLOCKS`-Katalog + Lookup-Helper (`blockTypeOptions`, `findCond`, `findAct`) |
| `src/js/blocks/descriptions.js`        | `DESCRIPTIONS` für Tooltip-Texte (ab Phase 2 gefüllt) |
| `src/js/state.js`                      | `state`-Objekt + `templates` aus `localStorage` |
| `src/js/ui/inputs.js`                  | Mutationen (`addCondition`, `updateCond` etc.) + Fokus-Fix-Strategie |
| `src/js/ui/render.js`                  | `renderConditions`, `renderActions`, `renderExecHelp`, `render` (Master) |
| `src/js/ui/templates.js`               | `saveTemplate`, `loadTemplate`, `deleteTemplate`, `newProject` |
| `src/js/ui/tooltips.js`                | Tooltip-Infrastruktur + `tooltipBadge()` |
| `src/js/generator/codegen.js`          | `escape*`-Helper, `safeVar`, `condExpr`, `actCode`, **`generateCode()`**, Copy/Download/Toast |
| `src/js/generator/highlight.js`        | Leichtgewichtiges Syntax-Highlighting (`highlightCs`) |
| `src/css/styles.css`                   | Alle Styles + Tooltip-CSS |

## Datenmodell

### `BLOCKS`-Katalog

```js
"<Anzeigename>": {
  interface: "IMy...",            // C# Type aus Sandbox.ModAPI.Ingame
  conditions: [
    {
      id: "...",                  // intern, eindeutig pro Block-Typ
      label: "Anzeige im Dropdown",
      expr: "{v}.SomeProperty",   // C#-Ausdruck, {v} = Block-Variable, {arg} = User-Wert
      kind: "bool" | "number" | "raw",
      arg: "Hint für User"        // optional; wenn vorhanden, erscheint Input-Feld
    }
  ],
  actions: [
    {
      id: "...",
      label: "Anzeige",
      code: "{v}.Method();",      // C#-Statement; {v}/{arg} wie oben
      arg: "Hint"                 // optional
    }
  ]
}
```

### `state`

```js
state = {
  conditions:  [{ blockType, blockName, condId, arg, logicOp: 'AND'|'OR' }],
  actionsThen: [{ blockType, blockName, actId, arg }],
  actionsElse: [{ blockType, blockName, actId, arg }],
  execMode:   "argument" | "continuous" | "timer1" | "timer10" | "timer100",
  lcdEnable:  bool,
  lcdName:    string
}
```

## Codegenerator — Phasen

`generateCode()` läuft in dieser Reihenfolge:

1. **Block-Sammlung**: `ensureBlock()` deduplikiert alle Blöcke, die in
   Bedingungen und Aktionen vorkommen, in einer `Map<blockName::blockType, entry>`.
2. **Header + Konstruktor**: setzt `Runtime.UpdateFrequency` je nach `execMode`.
3. **`Main()`-Body**: holt alle Blöcke via `GridTerminalSystem.GetBlockWithName`
   mit Null-Check-Echo.
4. **LCD-Setup** (falls aktiviert).
5. **Bedingungs-Expression**: aus allen `conditions` mit `&&`/`||` zusammenbauen.
6. **Then-Branch** + optional Else-Branch.
7. **LCD-Output** schreiben.

Wichtige Reihenfolge in `condExpr` / `actCode`:
**Erst `{arg}` einsetzen, dann `{v}` ersetzen.** So funktioniert auch `{v}` in
benutzerdefinierten Args (z.B. Custom-`rawCode`).

## Häufige Erweiterungen — Anleitung

### Einen neuen Block-Typ hinzufügen

Füge in der `BLOCKS`-Konstante einen Eintrag hinzu. Beispiel **Refinery**:

```js
"Refinery / Schmelze": {
  interface: "IMyRefinery",
  conditions: [
    { id: "producing", label: "Produziert",   expr: "{v}.IsProducing",   kind: "bool" },
    { id: "queueEmpty", label: "Queue leer",  expr: "{v}.IsQueueEmpty",  kind: "bool" }
  ],
  actions: [
    { id: "useConv",  label: "Conveyor an",   code: "{v}.UseConveyorSystem = true;" },
    { id: "on",       label: "Einschalten",   code: "{v}.Enabled = true;" },
    { id: "off",      label: "Ausschalten",   code: "{v}.Enabled = false;" }
  ]
}
```

Die UI wird automatisch generiert — keine weiteren Änderungen nötig.

**Referenz für verfügbare APIs**: Space Engineers Ingame Scripting API,
typischerweise im Namespace `Sandbox.ModAPI.Ingame` (Whitelist beachten:
nicht alles aus `IMy*` ist im PB erlaubt — bei Unsicherheit testen oder
[malware-dev/SpaceEngineers-Wiki](https://github.com/malware-dev/MDK-SE/wiki/API-Index)
konsultieren).

### Eine neue Bedingung/Aktion zu einem bestehenden Block

In `BLOCKS["<Typ>"].conditions` oder `.actions` ein weiteres Objekt anhängen.
`id` muss innerhalb des Blocks eindeutig sein.

### Test ohne Browser (Node)

Alle `src/js/`-Module nacheinander in eine `vm`-Sandbox laden, dann
`generateCode()` aufrufen:

```bash
node -e "
const fs = require('fs'); const vm = require('vm');
const files = [
  'src/js/blocks/catalog.js',
  'src/js/blocks/descriptions.js',
  'src/js/state.js',
  'src/js/generator/highlight.js',
  'src/js/generator/codegen.js',
  'src/js/ui/tooltips.js',
  'src/js/ui/inputs.js',
  'src/js/ui/templates.js',
  'src/js/ui/render.js'
];
const mockEl = () => ({ value:'', checked:false, style:{}, textContent:'', innerHTML:'', classList:{add(){},remove(){}}, querySelectorAll:()=>[], appendChild(){}, getBoundingClientRect:()=>({top:0,right:0,bottom:0,left:0,width:0,height:0}) });
const sb = {
  document: { getElementById: mockEl, createElement: mockEl, body:{appendChild:()=>{}} },
  localStorage: { getItem: () => null, setItem: () => {} },
  window: {}, navigator: { clipboard: { writeText: () => Promise.resolve() } },
  Blob: function(){}, URL: { createObjectURL:()=>'', revokeObjectURL:()=>{} },
  console, Math, JSON, Date, RegExp, Object, Array, Map, Set, String,
  setTimeout, clearTimeout, requestAnimationFrame:(f)=>f(), prompt:()=>null, confirm:()=>true
};
vm.createContext(sb);
for (const f of files) vm.runInContext(fs.readFileSync(f, 'utf8'), sb, { filename: f });
sb.state.conditions  = [{ blockType:'Sensor', blockName:'S1', condId:'isActive', arg:'', logicOp:'AND' }];
sb.state.actionsThen = [{ blockType:'Tür (Door)', blockName:'D1', actId:'open', arg:'' }];
sb.generateCode();
console.log(sb.window._rawCode);
"
```

## Konventionen

- **Sprache UI**: Deutsch (der User ist deutschsprachig).
- **Sprache Code-Kommentare im generierten Output**: Deutsch.
- **Variablen-Naming im generierten C#**: `safeVar()` macht aus Block-Namen
  C#-konforme Identifier mit Index-Suffix zur Dedup-Sicherheit.
- **Keine Build-Tools, keine Frameworks.** Wenn was nicht ohne ginge,
  vorher rückfragen.
- **CSS-Variablen** für Theming (`--accent`, `--panel`, ...). Bei Theme-Erweiterung
  hier ansetzen.
- **ASCII-/Sci-Fi-Ästhetik** halten (passt zu Space Engineers).

## Anti-Patterns / nicht tun

- ❌ Dependencies via `npm` / Bundler hinzufügen, ohne Rückfrage.
- ❌ `eval()` für User-Eingaben (auch nicht versteckt).
- ❌ Server-Komponenten / Netzwerk-Calls — das Tool muss offline laufen.
- ❌ `localStorage` für sensible Daten (das Tool speichert nur Vorlagen, ok).
- ❌ Strings im generierten C# ohne `escapeCs()` — Block-Namen können
  Anführungszeichen enthalten.

## Bekannte Limitierungen / TODOs

- Operator-Präzedenz bei gemischten `AND/OR`-Ketten ist C#-Standard (`&&` vor `||`),
  keine Klammerung möglich — für komplexe Logik aktuell Custom-Mode nötig.
- Kein Multi-Block-Support (Block-Gruppen via `GetBlockGroupWithName`).
- Kein "mehrere unabhängige WENN/DANN-Pakete" pro Skript.
- Vorlagen nur lokal pro Browser (kein Export/Import als JSON).
- Keine Validierung, ob Block-Namen syntaktisch problematisch sind
  (nur Escaping von `"`).

## Wenn du etwas änderst

1. `index.html` ist die einzige Quelldatei — alles andere ist Doku.
2. Nach Änderungen: kurz im Browser öffnen und einen Smoke-Test machen
   (eine Bedingung, eine Aktion, Code generieren).
3. Bei Erweiterung des `BLOCKS`-Katalogs: README-Liste der unterstützten
   Block-Typen aktualisieren.
4. Bei API-Änderungen am State: `loadTemplate()` muss alte Vorlagen-Formate
   noch laden können (oder Migration einbauen).
