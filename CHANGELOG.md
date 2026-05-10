# Changelog

Alle nennenswerten Änderungen an diesem Projekt werden hier dokumentiert.

Das Format orientiert sich an [Keep a Changelog](https://keepachangelog.com/de/1.1.0/),
das Projekt folgt [Semantic Versioning](https://semver.org/lang/de/).

## [Unreleased]

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

## [0.1.0] — 2026-05-11
### Hinzugefügt
- Erste Veröffentlichung des SE.PB Code Generators (Stand bei Repo-Init).
- Visueller Baukasten für Bedingungen + Aktionen.
- C#-Code-Generator (state → C#-String) inkl. LCD-Ausgabe und Timer-Modi.
- Dokumentation: `README.md`, `ARCHITECTURE.md`, `CLAUDE.md`.
- Beispiel-Outputs unter `examples/example_outputs.md`.
