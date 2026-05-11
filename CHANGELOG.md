# Changelog

Alle nennenswerten Änderungen an diesem Projekt werden hier dokumentiert.

Das Format orientiert sich an [Keep a Changelog](https://keepachangelog.com/de/1.1.0/),
das Projekt folgt [Semantic Versioning](https://semver.org/lang/de/).

## [Unreleased]

### Geändert (Manueller Modus — enger Rahmen + Aspect-Lock)
- **Gestrichelter Manual-Rahmen liegt jetzt eng am Widget-Inhalt**
  an — egal welcher Widget-Typ. Die Default-Größen aller 18 Widgets
  haben jetzt exakt das gleiche Seitenverhältnis wie die jeweilige
  SVG-viewBox (z. B. Header 5:1, Donut 1:1, Statusbar-vertikal
  0.42:1). Vorher war bei vielen Widgets viel Leerraum zwischen
  Inhalt und Rahmen.
- **Aspect-Lock beim Resize**: Wenn du ein Widget am Eck-Griff
  ziehst, bleibt das Seitenverhältnis erhalten — nicht mehr beliebig
  verzerrbar. Die Maus-Achse mit dem größeren Delta treibt die
  Größenänderung, die andere folgt automatisch.

### Hinzugefügt (Phase 4d — Layout-Engine)
- **LCD-Format wählbar**: Standard 1:1, Wide 2:1, Tall 1:2, Big 3×3.
  Beeinflusst nur die Vorschau-Größe und das Layout-Aspect; der
  generierte C#-Code passt sich zur Laufzeit an das tatsächliche
  LCD-Format im Spiel an.
- **Multi-Spalten-Layout** (1, 2 oder 3 Spalten pro LCD). Jedes
  Widget hat ein **colSpan**-Feld (1 / 2 / volle Breite).
  Damit kannst du z. B. zwei Donut-Indikatoren oder vier
  Wert-Anzeigen nebeneinander platzieren.
- **Widget-Höhe pro Widget einstellbar** (8–400 px). Default
  = bisheriger Standardwert je Widget-Typ. Damit kannst du
  z. B. Donut von 140 auf 80 px verkleinern.
- **Feste Vorschau-Größe**: Live-Vorschau zeigt jetzt 1:1 das
  echte LCD-Aspect. Wenn deine Widgets nicht reinpassen, erscheint
  ein roter **„⚠ Widgets passen nicht aufs LCD"-Hinweis** unten
  in der Vorschau.
- **Composer-Layout-Engine** komplett umgebaut auf Spalten +
  custom Höhe + colSpan. Generiert sauberen C#-Code mit
  `colWidth`-Berechnung pro Zeile.

### Hinzugefügt (Phase 4c — Mega-Anzeigen, Kosmetik, Themes)
- **8 weitere LCD-Widgets**:
  - **Großes Zahlenfeld** — eine wichtige Zahl groß und fett mit Label oben.
  - **Icon + Wert** — SE-Built-in-Sprite (Energy/Hydrogen/Oxygen/Uranium/
    Construction/Computer/Display/Medkit/Powerkit/Danger/Cross/CrossHair/Arrow)
    links, Wert rechts.
  - **Multi-Block-Aggregator** — summiert/durchschnittet/min/max über
    alle Blöcke eines Typs (z. B. "Alle Akkus zusammen Ø 87 %"). Nutzt
    `GridTerminalSystem.GetBlocksOfType<T>()`.
  - **Tachometer-Gauge** — 270°-Halbring mit 24 Segmenten, Min/Max
    konfigurierbar, großer Wert in der Mitte.
  - **Trennlinie** — horizontaler Strich, mit oder ohne Text mittendrin.
  - **Uhr** — Echtzeit in HH:mm:ss / HH:mm / dd.MM.yyyy HH:mm / yyyy-MM-dd.
  - **Spacer** — reine vertikale Lücke, Höhe in Pixeln einstellbar.
  - **Section-Header** — farbig hinterlegter Sektions-Streifen.
- **Theme-System**: 4 Quick-Apply-Themes (Orange/Cyan Standard,
  Rotes Alarm-Display, Grünes Industrie-Display, Blaues Sci-Fi).
  Quick-Apply färbt alle bestehenden Widgets mit Standard-Farben
  passend um — Custom-Farben bleiben unangetastet.
- 13 numerische Aggregat-Quellen ergänzt für den Aggregator
  (Akku-Ladung Ø, Akku-Strom-Input/Output Σ, Tank Ø, Cargo % Ø,
  Cargo Masse Σ, Reaktor Σ, Solar Σ).

### Hinzugefügt (Phase 4b — LCD-Baukasten visueller Sprung)
- **8 neue Widget-Typen** zusätzlich zu den Phase-4a-Widgets:
  - **Statusleiste vertikal** — Säulen-Style, gut nebeneinander.
  - **Sci-Fi segmentierter Balken** — 12 (konfigurierbare) leuchtende
    Segmente mit Lücken zwischen.
  - **Doppel-Balken** — zwei Balken übereinander mit eigenen
    Labels/Farben/Quellen (z. B. Input vs. Output).
  - **Kreis-Indikator (Donut)** — runder Fortschrittsring aus 32
    Segmenten, großer Prozent-Wert in der Mitte.
  - **Punkt-Indikator (Ampel)** — Kreis-Sprite, Farbe wechselt je
    nach zwei Schwellwerten (rot/orange/grün).
  - **Statusliste (✓/✗)** — bis zu 5 Slots, jeder mit Block-Name
    und Boolean-Quelle (Block-arbeitet, Tür-offen, Connector-verbunden,
    Vent-unter-Druck, Gear-gesperrt …).
  - **Warnhinweis (blinkend)** — Text mit Icon, erscheint nur wenn
    Schwellwert-Bedingung erfüllt; Blink-Geschwindigkeit wählbar.
  - **Alarm-Banner** — großer farbiger Streifen mit fettem Text,
    auch blinkend, für kritische Zustände.
- **Boolean-Datenquellen** für Statusliste/Warnung:
  block_enabled, block_working, door_open, connector_linked,
  gear_locked, vent_pressurized.
- **Gruppierte Parameter-Felder** im Widget-Editor (z. B. „Oberer
  Balken" / „Unterer Balken" beim Doppel-Balken; „Zeile 1–5" bei
  der Statusliste).
- **Live-SVG-Vorschau** wurde an alle neuen Widget-Typen angepasst,
  inkl. CSS-Animation für blinkende Widgets im Mockup.

### Hinzugefügt (Phase 4a — LCD-Baukasten Foundation)
- **Neue Sektion „LCD BAUKASTEN (Grafik)"** im Builder, parallel zur
  bisherigen einfachen „LCD STATUS-AUSGABE (Text)". Beide
  funktionieren unabhängig voneinander.
- **3 Basis-Widgets** zur Wahl:
  - **Header / Text** — gestylte Überschrift mit Größe, Farbe, Ausrichtung.
  - **Statusleiste** — horizontaler Prozent-Balken, gespeist aus Akku /
    Tank / Cargo / Reaktor / Solar.
  - **Wert-Anzeige** — numerischer Wert mit Label, formatierbar,
    inkl. Einheit (kW, MW, m/s usw.).
- **6 Datenquellen** für Statusleisten/Wert-Anzeigen:
  Akku-Ladung, Tank-Füllstand, Cargo-Füllstand, Reaktor-Output,
  Solar-Output, Schiffsgeschwindigkeit (über Cockpit).
- **Live-SVG-Vorschau** pro Widget — du siehst direkt, wie es
  ungefähr auf dem LCD aussehen wird (Farbe, Layout, Text).
- **Sprite-API-Code-Generator** (`src/js/lcd/composer.js`) erzeugt
  echten C#-Code mit `ContentType.SCRIPT` und `DrawFrame()`-Block.
  Widgets stapeln vertikal.
- **Reorder per ▲/▼-Buttons**, Widget entfernen, weitere Widgets
  pro Klick auf „+ Header" / „+ Statusleiste" / „+ Wert-Anzeige".
- Neue Module: `src/js/lcd/widgets.js`, `src/js/lcd/preview-svg.js`,
  `src/js/lcd/composer.js`.

### Geändert (Design-Konsistenz)
- Subtype-Auswahl ist jetzt ein **styled `<select>`** im Sci-Fi-Look
  (mit `<optgroup>`-Gruppen), nicht mehr ein Browser-natives
  `<datalist>`-Popup. Sieht aus wie alle anderen Dropdowns im Tool.
- Für Mod-Subtypes gibt's eine **„Custom (selbst eintragen)…"**-Option
  am Ende der Liste — sobald gewählt, erscheint ein dezentes
  Text-Feld direkt darunter, ebenfalls im selben Stil.
- Internes UI-Helper-Refactoring: `_argField()` nimmt jetzt ein
  Mutator-Object statt einen Handler-String, wodurch
  Select-Auswahl (mit Re-Render) und Text-Input (ohne Re-Render
  → Fokus-Erhalt) sauber getrennt sind.

### Hinzugefügt (Item-Auswahl per Liste + Mengen-Feld)
- **Vorgefertigte Subtype-Liste** in `src/js/blocks/item_subtypes.js`
  mit über 70 Item-Subtypes aus vanilla SE (Erze, Ingots, Komponenten,
  Munition, Werkzeuge, Verbrauch). Frei eingebbare Subtypes (Mods)
  weiterhin möglich.
- **Datenmodell erweitert** um `argType` und optional zweites Argument
  (`arg2`, `arg2Type`). Renderer schaltet Input-Type automatisch um:
  - `argType: "subtype"` → Text-Input mit `<datalist>`-Autovorschlägen
  - `argType: "number"` → Number-Input (Spinner)
  - sonst → normales Text-Feld
- **Item-Conditions** in 9 Blöcken haben jetzt zwei getrennte Eingabefelder:
  - Feld 1: Item-Subtype (mit Auto-Vorschlägen)
  - Feld 2: Mindest-/Höchst-Menge (nur Zahl)
- `_invConds` als single source of truth — die drei Inventar-Conditions
  werden per JS-Spread (`..._invConds`) in alle Inventar-Blöcke gestreut.

### Hinzugefügt (Inventar-Prüfungen)
- **Drei neue Conditions** in 9 Blöcken mit Inventar (Connector,
  Cargo, Refinery, Assembler, Sortierer, Reaktor, Gas-Generator,
  Bohrer, Schleifer):
  - **„Enthält Item (Subtype)"** — z. B. `Iron`, `Uranium`, `SteelPlate`.
  - **„Item-Menge > X"** — Syntax `Iron:100`.
  - **„Item-Menge < X"** — Syntax `Uranium:1` (z. B. für Treibstoff-Warnung).
- Generator injiziert dafür **automatisch** Helper-Methoden
  (`HasItem`, `ItemAmountAbove`, `ItemAmountBelow`, `_GetItemAmount`)
  am Anfang der `Program`-Klasse — nur die tatsächlich genutzten,
  sonst null Overhead.
- Common-Tooltip-Pool in `descriptions.js`: Optionen, die in
  vielen Blöcken identisch sind, müssen nur einmal beschrieben werden.

### Hinzugefügt (Phase 3b — Katalog-Tiefe)
- Systematische Vertiefung **aller 52 Block-Typen** auf praktisch
  vollständige API-Coverage. Pro Block jetzt **10–20 Optionen** dort,
  wo die SE-API es hergibt, statt vorher 3–8.
- Konkrete Erweiterungen u. a.:
  - **Rotor**: Lower/Upper-Limit (Grad), Torque, BrakingTorque,
    Displacement, RPM-Vergleiche, Enabled/IsWorking, CustomData.
  - **Kolben**: Min/Max-Limit-Vergleiche, Velocity-Vergleich,
    IsAttached, IsWorking, CustomData, Komfort-Actions (extendOnce/retractOnce).
  - **Akku**: CurrentOutput/Input-Vergleiche, ChargeMode-Prüfungen.
  - **Thruster**: MaxThrust, MaxEffectiveThrust, Override-Wert-Vergleich.
  - **Sensor**: Detection-Flags (Player/Enemy/Friend) als Setter,
    alle 6 Reichweiten-Achsen (Front/Back/Left/Right/Top/Bottom) als Setter.
  - **Cockpit**: Schiffsmasse, Handbremse-Cond, ControlWheels/Thrusters.
  - **LCD**: Clear-Action, FontColor/BackgroundColor, Alignment (links/zentriert/rechts), Modus-None.
  - **Lichter**: Radius, BlinkLength, BlinkOffset, Falloff.
  - **Refinery / Assembler**: Repeating, IsAssembling, IsWorking, vollständigere Modi.
  - **Connector**: ThrowOut/Ejector-Modus.
  - **Funkantenne**: Show-on-HUD-Setter, IsOn-Cond.
- Tooltip-Texte für alle neuen Optionen in `descriptions.js`.
- **Keine** ID-Änderungen — bestehende Vorlagen funktionieren weiter.

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
