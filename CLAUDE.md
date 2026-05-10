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

**SE.PB Code Generator** — ein Single-File-Web-Tool (`index.html`), das per
visuellem Baukasten C#-Code für den Programmable Block in Space Engineers
generiert. Komplett vanilla HTML/CSS/JS, kein Build, keine Dependencies,
läuft offline im Browser.

## Architektur in einem Satz

Eine Datei (`index.html`) mit drei Schichten: **BLOCKS-Katalog** (Datenmodell),
**State + UI-Renderer** (Zustand und DOM-Aufbau), **Code-Generator**
(state → C#-String).

## Wichtigste Code-Regionen in `index.html`

Suche im Script-Tag nach diesen Markern:

| Marker / Region              | Zeilenbereich (ca.) | Zweck                                                                 |
|------------------------------|---------------------|-----------------------------------------------------------------------|
| `const BLOCKS = {`           | ~320                | Katalog aller unterstützten Block-Typen mit Conditions & Actions      |
| `var state = {`              | ~600                | Globaler Zustand (Bedingungen, Aktionen, Modus, LCD)                  |
| `function renderConditions`  | ~660                | Baut die Bedingungs-UI                                                |
| `function renderActions`     | ~710                | Baut die Aktions-UI (then/else)                                       |
| `function generateCode`      | ~830                | **Der Codegenerator** — state → C#-String                             |
| `function condExpr` / `actCode` | ~810             | Platzhalter-Ersetzung (`{v}` = Variable, `{arg}` = Benutzer-Argument) |
| `function highlightCs`       | ~960                | Leichtgewichtiges Syntax-Highlighting                                 |

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

```bash
node -e "
const fs = require('fs'); const vm = require('vm');
const html = fs.readFileSync('index.html', 'utf8');
const js = html.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/render\(\);\s*\$/, '');
const sb = {
  localStorage: { getItem: () => null, setItem: () => {} },
  document: { getElementById: () => ({ value: 'argument', checked: false, style: {}, textContent: '', innerHTML: '' }), querySelectorAll: () => [] },
  window: {}, console, Math, JSON, Date, RegExp, Object, Array, Map, Set, String,
  navigator: { clipboard: { writeText: () => Promise.resolve() } },
  URL: { createObjectURL: () => '', revokeObjectURL: () => {} },
  Blob: function(){}, setTimeout, clearTimeout
};
vm.createContext(sb); vm.runInContext(js, sb);
// state setzen ...
sb.state.conditions = [{ blockType: 'Sensor', blockName: 'S1', condId: 'isActive', arg: '', logicOp: 'AND' }];
sb.state.actionsThen = [{ blockType: 'Tür (Door)', blockName: 'D1', actId: 'open', arg: '' }];
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
