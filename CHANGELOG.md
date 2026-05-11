# Changelog

Alle nennenswerten Änderungen an diesem Projekt werden hier dokumentiert.

Das Format orientiert sich an [Keep a Changelog](https://keepachangelog.com/de/1.1.0/),
das Projekt folgt [Semantic Versioning](https://semver.org/lang/de/).

## [Unreleased]

### Hinzugefügt (Phase 3)
- **Drag & Drop:** Linke Block-Palette mit allen 52 Block-Typen,
  nach Kategorie aufklappbar. Karten lassen sich per Drag direkt
  in den WENN-/DANN-/SONST-Bereich ziehen — fügt automatisch eine
  passende Bedingung/Aktion ein.
- **Such-Feld** in der Palette filtert Block-Karten live nach Name;
  passende Kategorien klappen automatisch auf.
- **Drop-Schutz:** Block-Typen ohne Conditions/Actions (z. B. Soundblock
  beim Bedingungs-Container) werden beim Drop abgelehnt mit Toast-Hinweis.
- 12 minimalistische **SVG-Kategorie-Icons** (`src/js/ui/icons.js`)
  passend zur Sci-Fi-Ästhetik.
- 3-Spalten-Layout (Palette | Builder | Code); responsive Fallback
  bei < 1400 px (Code unter Builder) und < 900 px (alles stapeln).
- Neue Module: `src/js/ui/icons.js`, `src/js/ui/dnd.js`.
- Neue Mutators: `addConditionOfType(blockType)`, `addActionOfType(which, blockType)`.

### Hinzugefügt (Phase 2)
- **Block-Bibliothek auf 52 Block-Typen erweitert** in 12 Kategorien:
  Bewegung, Energie, Förderung, Produktion, Antrieb, Werkzeuge, Waffen,
  Sensorik, Steuerung, Anzeige, Komfort, Custom.
- Neue Block-Typen: Hangartor, Merge-Block, Reaktor, Solarpanel,
  Windturbine, H2-Motor, Frachtcontainer, Assembler, Gas-Generator,
  Air Vent, Fallschirm, Jump Drive, Bohrer, Schweißer, Schleifer,
  Projektor, Geschützturm (Gatling), Raketenturm, Innenraum-Geschütz,
  Gatling-Gun (fest), Raketenwerfer (fest), Decoy, Kamera, Funkantenne,
  Laser-Antenne, Erz-Detektor, Beacon, Remote Control, Button-Panel,
  LCD / Text-Panel, Medi-Raum, Kryo-Kammer.
- **Standard- / Erweitert-Trennung** pro Condition/Action über `tier`-Feld.
  Dropdowns gruppieren die Optionen jetzt sichtbar nach Tier.
- **Tooltip-Texte** (1–3 Sätze) für nahezu jede Condition und Action,
  abrufbar über das (i)-Symbol rechts vom Dropdown-Label.
- **Block-Typ-Dropdown gruppiert nach Kategorie** (`<optgroup>`-Aufbau).

### Geändert
- `DESCRIPTIONS` ist jetzt strukturiert nach `conditions`/`actions`
  (statt flat), weil eine ID — wie `override` beim Thruster — in beiden
  Listen unterschiedliche Bedeutung haben kann.
- `tooltipBadge(blockType, optionId, kind)` und
  `getDescription(blockType, optionId, kind)` nehmen jetzt einen
  `kind`-Parameter (`'conditions'` | `'actions'`).

### Geändert
- **Code-Split:** Logik aus `index.html` in modulare Dateien unter `src/`
  ausgelagert (`src/css/styles.css`, `src/js/blocks/*`, `src/js/ui/*`,
  `src/js/generator/*`). `index.html` enthält jetzt nur noch das HTML-Skelett
  und Script-/Link-Tags. **Weiterhin kein Build-Tool, läuft offline per
  Doppelklick.**
- `CLAUDE.md` und der Node-Smoketest auf die neue Verzeichnisstruktur angepasst.

### Behoben
- **Fokus-Verlust beim Tippen:** Eingabefelder (Block-Name, Argument-Wert)
  behalten beim Tippen den Fokus. Werte-Updates rendern jetzt nur den
  Code-Output neu, nicht die gesamte Builder-UI.
- **Live-Code-Vorschau:** Generierter Code aktualisiert sich jetzt bei jedem
  Tastenanschlag — vorher blockierte der Fokus-Bug flüssiges Tippen.

### Hinzugefügt
- Tooltip-Infrastruktur (`src/js/ui/tooltips.js` + CSS für `.tooltip` /
  `.tooltip-trigger`). Erklärtexte werden ab Phase 2 in
  `src/js/blocks/descriptions.js` gepflegt — solange ein Text fehlt,
  erscheint kein (i)-Symbol.

### Behoben (Folgefix)
- Block-Typen ohne prüfbare Eigenschaften (z. B. **Soundblock**) erscheinen
  jetzt nicht mehr im Bedingungs-Dropdown — vorher wurde das "Prüfung"-
  Dropdown leer und visuell verschluckt gerendert. Analog erscheinen
  Block-Typen ohne Aktionen nicht im Aktions-Dropdown (aktuell keine
  betroffen, aber zukunftssicher). `blockTypeOptions(filterKind)` filtert
  jetzt nach `'conditions'` oder `'actions'`.

### Geändert (Folgefix)
- Block-Typ **"Schalldetektor / Soundblock"** umbenannt in **"Soundblock /
  Lautsprecher"**. Der `IMySoundBlock` im Spiel spielt Sounds ab — er
  detektiert nichts. Der alte Name war doppelt irreführend.

## [0.1.0] — 2026-05-11
### Hinzugefügt
- Erste Veröffentlichung des SE.PB Code Generators (Stand bei Repo-Init).
- Visueller Baukasten für Bedingungen + Aktionen.
- C#-Code-Generator (state → C#-String) inkl. LCD-Ausgabe und Timer-Modi.
- Dokumentation: `README.md`, `ARCHITECTURE.md`, `CLAUDE.md`.
- Beispiel-Outputs unter `examples/example_outputs.md`.
