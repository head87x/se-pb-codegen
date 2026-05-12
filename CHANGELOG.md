# Changelog

Alle nennenswerten Änderungen an diesem Projekt werden hier dokumentiert.

Das Format orientiert sich an [Keep a Changelog](https://keepachangelog.com/de/1.1.0/),
das Projekt folgt [Semantic Versioning](https://semver.org/lang/de/).

## [Unreleased]

## [1.7.0] — 2026-05-12

### Hinzugefügt (Mehrsprachigkeit Phase 2.1 — Block-Namen + Code-Kommentare)
- **Alle 52 Block-Typ-Namen** sind jetzt englisch verfügbar
  (Tür → Door, Akku → Battery, Triebwerk → Thruster, …). Neue
  Datei `src/js/blocks/i18n_en.js` mit `BLOCKS_EN`-Map; Schlüssel
  in `BLOCKS{}` bleiben deutsch (sprachunabhängig für Vorlagen/Token).
- **Kategorien-Übersetzungen** (Bewegung → Movement, Energie → Energy,
  Förderung → Inventory & Transport, …) für Palette + Block-Dropdowns.
- **„Standard" / „Erweitert"** Optgroup-Labels in den
  Conditions/Actions-Dropdowns folgen jetzt der Sprache.
- **Generierte C#-Code-Kommentare** komplett übersetzt:
  Header, Block-Referenzen-Block, Conditions/Actions-Banner,
  Fehlermeldungen (`Echo("ERROR: Block 'X' not found!")`),
  LCD-Status-Header, LCD-Composer-Marker.
- **Palette** wird beim Sprachwechsel automatisch neu gerendert
  (vorher nur 1× beim Init).

### Geändert
- `blockTypeOptions()`, `_tierGrouped()` und `renderPalette()`
  nutzen jetzt die Helper `blockTypeLabel()` / `categoryLabel()` /
  `localizedItemLabel()` mit DE-Fallback.

### Noch nicht übersetzt (Phase 2.2 — kommt später)
- **Condition/Action-Labels** pro Block (~490 Stück, z. B.
  „Ist offen", „Öffnen", „Eingeschaltet"). Infrastruktur via
  `labelEn`-Feld bereits angelegt — Felder müssen nur noch
  pro Eintrag ergänzt werden.
- **Tooltip-Texte** (DESCRIPTIONS, ~300 Stück).

## [1.6.0] — 2026-05-12

### Hinzugefügt (Mehrsprachigkeit Phase 1 — DE/EN-Umschaltung)
- **Sprach-Picker im Header** rechts neben dem Theme-Picker.
  Zwei Sprachen verfügbar: **DE — Deutsch** (Standard) und
  **EN — English**. Auswahl persistiert im LocalStorage
  (`se_pb_lang`), gilt sofort ohne Reload.
- **Neuer i18n-Layer** (`src/js/ui/i18n.js`):
  - `t("key", ...args)` für dynamische Strings mit Argument-
    Platzhaltern (`{0}`, `{1}`, …).
  - `data-i18n="key"`-Attribut für statische HTML-Texte.
  - `data-i18n-placeholder="key"` für Input-Placeholder.
  - Beim Sprachwechsel werden alle DOM-Elemente mit
    `data-i18n*` automatisch aktualisiert + `render()` läuft
    für die dynamisch erzeugten Inhalte.
- **Übersetzt sind**: alle Sektion-Titel, Buttons, Hilfe-Texte,
  Empty-Hints, Toasts, Modal-Standard-Buttons, Bedingungs-/
  Aktions-/Else-UI, LCD-Composer-Felder, Multi-LCD-Konfiguration,
  Share-Token-Bedienflächen, Footer.

### Noch nicht übersetzt (Phase 2 — kommt später)
- **Block-Katalog-Labels** (52 Blöcke wie „Tür (Door)" /
  „Akku (Battery)") bleiben aktuell auf Deutsch — das wäre eine
  separate große Umstellung, weil die deutschen Namen aktuell
  als Schlüssel im `BLOCKS`-Objekt dienen.
- **Tooltip-Texte** in `DESCRIPTIONS` (hunderte Erklärungen pro
  Condition/Action) bleiben auf Deutsch.
- **Generierter C#-Code-Kommentare** im Output (z. B.
  `// Block-Referenzen holen`) bleiben auf Deutsch.

## [1.5.0] — 2026-05-12

### Hinzugefügt (Block-Gruppen)
- **Toggle „Auf Block-Gruppe anwenden"** pro Bedingung und pro Aktion.
  Klick → der Name-Eintrag wird zum **Gruppen-Namen** (statt einzelnem
  Block-Namen), Label und Placeholder passen sich an.
- **Generator** unterscheidet jetzt Einzelblock- und Gruppen-Pfad:
  - **Einzelblock** (Default): `GridTerminalSystem.GetBlockWithName(...)`
  - **Gruppe**: `GridTerminalSystem.GetBlockGroupWithName(...)` +
    `GetBlocksOfType<T>(list)` → typisierte `List<IMy...>`
- **Aktionen auf Gruppe**: emittieren `foreach (var _b in <list>) { ... }`
  und wenden die Aktion auf jeden Block der Gruppe an
  (z. B. „alle Frontlichter einschalten").
- **Bedingungen auf Gruppe**: emittieren `<list>.Any(_b => ...)` —
  Bedingung ist erfüllt, sobald **irgendein Block** der Gruppe sie
  erfüllt (z. B. „irgendein Sensor erkennt was").
- **Defensive Migration**: existierende Vorlagen + Token ohne
  `useGroup`-Feld werden weiter als Einzelblock behandelt — keine
  Bruch alter Daten.

### Geändert
- `ensureBlock(blockType, blockName, useGroup)` ist jetzt
  Gruppen-fähig. Einzelblock und Gruppe für denselben Namen bekommen
  separate Einträge im `blockMap` (sind unterschiedliche C#-Typen:
  `IMyXxx` vs. `List<IMyXxx>`).

## [1.4.1] — 2026-05-12

### Geändert (Themed Modal-Dialoge)
- Browser-native `alert()` / `confirm()` / `prompt()` durch eigene
  themed Modal-Dialoge ersetzt. Folgen jetzt automatisch dem
  gewählten Tool-Theme (Sci-Fi/Dark/Light/Cyberpunk/Matrix/…), passen
  zur restlichen Sci-Fi-Ästhetik.
- Neue Sektion in `src/js/ui/modal.js`: `showConfirm()`, `showPrompt()`,
  `showAlert()` — alle Promise-basiert, mit Enter/Escape-Support und
  Overlay-Klick-zum-Abbrechen.
- Betroffene Stellen:
  - Vorlage speichern (prompt für Name)
  - Vorlage löschen (Bestätigung)
  - Neues Projekt (Bestätigung)
  - LCD-Preset laden (Bestätigung bei vorhandenen Widgets)
  - Share-Token laden (Bestätigung mit Token-Inhalts-Zusammenfassung)
- Aufrufer-Funktionen jetzt `async` — Verhalten bleibt identisch,
  nur der Look ändert sich.

## [1.4.0] — 2026-05-12

### Hinzugefügt (Share-Token)
- **Neue Sektion „SHARE-TOKEN"** unter den Vorlagen — speichert/lädt
  die komplette Konfiguration (Bedingungen, Aktionen, LCD-Baukasten,
  Multi-LCD-Setup, alle Widget-Positionen + Farben) als kopierbarer
  Base64-Token.
- **„💾 Token erzeugen"**: serialisiert den State, codiert ihn als
  UTF-8-Base64 und kopiert ihn automatisch in die Zwischenablage.
  Token erscheint zusätzlich in der Textarea (mit Zeichen-Zähler) —
  als Fallback falls die Zwischenablage gesperrt ist.
- **„📥 Token laden"**: liest Token aus der Textarea, decodiert,
  validiert (Schema-Version + Inhalt), zeigt Zusammenfassung
  („3 Bedingungen, 12 LCD-Widgets, erzeugt 2026-05-12") und ersetzt
  den aktuellen Stand nach Bestätigung.
- **Offline-fähig**: Token ist selbstenthaltend (Base64-codiertes JSON,
  kein Server, kein Account). Token kann per E-Mail / Chat / Datei
  geteilt werden.
- **Schema-Versioniert** (`v: 1`) — zukünftige State-Modell-Änderungen
  bleiben rückwärtskompatibel; alte Token werden defensiv migriert.

## [1.3.4] — 2026-05-12

### Behoben (Korrektur zu v1.3.3 — Scope eingegrenzt)
- v1.3.3 hat alle Widget-Labels theme-abhängig gemacht. Gemeint war
  aber nur die **Statusliste-Überschrift** (Default „Systeme").
  Die Zeilen-Labels darunter (z. B. „Reaktor", „Tür") und die Labels
  der anderen Widgets (Statusleiste, Donut, Wert-Anzeige usw.) sind
  jetzt wieder fest in Off-White (`#d8e1ec` / `Color(216,225,236)`) —
  wie vor v1.3.3.
- Theme-Folge bleibt **nur für die Checklist-Titel-Zeile** aktiv:
  oben über der Trennlinie zeigt sich beim Theme-Wechsel die neue
  Akzent-Farbe.

## [1.3.3] — 2026-05-12

### Behoben (Label-Farbe folgt LCD-Theme)
- Die Überschriften aller LCD-Widgets (Statusleiste, Wert-Anzeige,
  Donut, Tachometer, Doppelbalken, Großes Zahlenfeld, Icon+Wert,
  Aggregator, Punkt-Indikator, Statusliste, …) waren fest auf
  `#d8e1ec` (Off-White) gesetzt und folgten dem LCD-Theme nicht.
- Neuer Helper `lcdLabelColor()` in `widgets.js` liefert die Accent-Farbe
  des aktuell gewählten LCD-Themes. Sowohl die SVG-Vorschau als auch
  der C#-Generator nutzen jetzt diesen Helper an allen Label-Stellen.
- **Resultat:** Beim Theme-Wechsel (Orange / Rot / Grün / Blau) sehen
  die Labels sofort die neue Akzent-Farbe — sowohl im Live-Preview
  als auch im generierten Code, der ins Spiel kommt.

## [1.3.2] — 2026-05-12

### Behoben (Manual-Rahmen eng am Widget — Teil 2)
- Bei **Uhr**, **Punkt-Indikator** und **Großes Zahlenfeld** war der
  sichtbare Inhalt deutlich kleiner als die SVG-viewBox — die viewBox
  hatte 60 % Leerraum, weshalb die gestrichelte Linie ums Widget viel
  zu groß wirkte und der Skalierung Platz vortäuschte, der gar nicht
  genutzt wurde.
- viewBox + Default-Größen jetzt eng am tatsächlichen Inhalt:
  - **Uhr** (clock): viewBox 200×32 → **100×26** (3.846:1, war 6.25:1).
    Font-Größe passt sich am Format an (kurze Formate größer, lange
    kleiner), damit alle vier Format-Varianten in die schmale viewBox
    passen.
  - **Punkt-Indikator** (dot): viewBox 200×32 → **100×24** (4.167:1).
    Kreis kompakter, Label direkt daneben.
  - **Großes Zahlenfeld** (bigvalue): viewBox 200×70 → **140×64**
    (2.188:1, war 2.857:1). Label oben, große Zahl mittig, Einheit
    unten rechts — kein leerer Rand mehr.
- Andere Widgets wurden geprüft: Statusleisten, Donut, Tachometer,
  Wert-Anzeige, Icon-Wert, Aggregator, Alarm, Warning, Section,
  Divider, Checklist und Bar-Double sind schon eng — entweder durch
  vollflächige Balken oder Inhalt an beiden Rändern verankert.

## [1.3.1] — 2026-05-12

### Behoben (Multi-LCD Drag & Resize)
- Widgets ließen sich im Multi-LCD-Modus nicht über LCD-Grenzen
  hinaus platzieren oder verschieben — Boundary-Clamping nutzte
  noch die Single-LCD-Auflösung (`res.w`/`res.h`) statt des
  virtuellen Canvas (`cols × rows × LCD`).
- Maus-zu-LCD-Pixel-Umrechnung war ebenfalls falsch: `scaleScreen`
  rechnete `container.clientWidth / res.w` statt `… / virtualWidth`,
  weshalb Widgets beim Resize riesig wurden und beim Loslassen auf
  die Single-LCD-Größe „zurücksprangen".
- Beide Stellen (Drag-Handler in `lcd-dnd.js` und das Live-Update
  der Cell-Geometry) nutzen jetzt einen gemeinsamen Helper
  `_lcdVirtualCanvas()`, der bei aktivem Multi-LCD die korrekten
  Gesamt-Dimensionen liefert.

## [1.3.0] — 2026-05-12

### Hinzugefügt (Phase 5 — Multi-LCD-Anordnung)
- **Mehrere benachbarte LCDs als ein virtuelles Display**:
  per Toggle „Multi-LCD-Anordnung" in der Composer-Sektion. Konfigurierbar
  mit Spalten- und Reihen-Anzahl (1–6) und einem **Namensmuster** mit
  Platzhaltern (`{col}` = A,B,C,…  `{row}` = 1,2,3,…  `{c}`/`{r}` =
  numerisch). Default: `LCD {col}{row}` → ergibt `LCD A1`, `LCD B1`,
  `LCD A2`, `LCD B2` für ein 2×2-Grid.
- **Live-Vorschau im virtuellen Canvas-Format**: bei aktivem Multi-LCD
  wächst die Vorschau auf `cols × rows` Mal die LCD-Größe und zeigt
  **kräftige Trennlinien zwischen den physischen LCDs** plus einen
  **Namens-Tag pro LCD-Quadrat** (oben links).
- **Generator** erzeugt jetzt eine `for`-Schleife über alle LCDs.
  Jedes physische LCD bekommt seinen eigenen `DrawFrame`-Block und
  rendert nur seinen Ausschnitt — Widgets, die LCD-Grenzen überspannen,
  werden auf beiden Seiten korrekt gezeichnet (SE clippt automatisch).
- Multi-LCD ist nur im **Display-Modus „Eigenständiges LCD"** verfügbar
  (PB-Surface + Cockpit-Surface sind Einzeldisplays — Toggle wird dort
  ausgeblendet).

### Geändert
- Composer-Generator refaktoriert: gemeinsame `_emitWidgetsBlock()`-Funktion
  für Single- und Multi-LCD. Alle Widget-Emissionen rechnen jetzt mit
  `yPos = rect.Position.Y + (myF - lcdOffY)` und
  `colOffsetX = mxF - lcdOffX`. Im Single-LCD-Fall sind lcdOffX/Y = 0,
  also funktional identisch zur bisherigen Ausgabe.
- `loadTemplate()` migriert alte Vorlagen ohne `multiLcd`-Feld
  defensiv auf den Default.

## [1.2.0] — 2026-05-12

### Hinzugefügt (3 weitere Themes + Auto-OS)
- **Hero** — Sci-Fi-Sauber im Star-Citizen-/Destiny-Stil:
  Eisblau auf Dunkelmarineblau, feine Linien, leichter Glassmorph-Touch.
- **Hologram** — kühles Türkis, leicht leuchtend, „HUD-Holo-Display"-Vibe.
- **Industrial** — Space-Engineers-Werkstatt: gedämpftes Rost-Orange auf
  Stahlgrau, schwere Kanten.
- **Auto (folgt OS)** — wechselt automatisch zwischen Light und Dark
  je nach `prefers-color-scheme` des Betriebssystems. Reagiert live
  auf System-Theme-Wechsel.

Damit sind jetzt 9 Tool-Themes verfügbar (Standard, Dark, Light,
Cyberpunk, Matrix, Hero, Hologram, Industrial, Auto).

## [1.1.0] — 2026-05-12

### Hinzugefügt (Tool-Themes)
- **Theme-Picker im Header** mit 5 Looks zum Sofort-Umschalten:
  - **Sci-Fi (Standard)** — bisheriger Orange/Cyan-Look
  - **Dark (neutral)** — gedämpfte Slate-Grau-Töne, weniger Sci-Fi
  - **Light** — heller Hintergrund mit blauem Akzent, dunkler Text
  - **Cyberpunk** — Neon-Pink/Cyan auf Dunkelviolett
  - **Matrix** — monochrom Grün auf Schwarz, Terminal-Optik
- **Persistenz im LocalStorage** — Auswahl bleibt zwischen Sessions
  erhalten (Schlüssel `se_pb_tool_theme`).
- **Theme-Wechsel ohne Re-Render**: CSS-Variablen kaskadieren
  automatisch, kein UI-Rebuild nötig.
- **Code-Syntax-Highlighting** ist jetzt theme-fähig — Light nutzt
  VS-Code-Light-Plus-Farben, Cyberpunk Neon-Pink/Cyan,
  Matrix Mono-Grün, etc.

### Geändert
- CSS-Variablen-Set erweitert um `--accent-rgb`, `--text-on-accent`,
  `--shadow-rgb`, `--lcd-frame-*`, `--body-glow-*`, `--syn-*`
  (Syntax-Farben). Alle hardcodierten Theme-Farben im CSS durch
  Variablen ersetzt — Themes können jetzt vollständig durchgreifen.
- `index.html` Header-Layout: `.header-meta`-Container bündelt
  Theme-Picker + Version-Tag rechts.

## [1.0.1] — 2026-05-12

### Hinzugefügt
- **Versions-Schema etabliert**: `index.html` zeigt jetzt
  `v1.0.1` an, CHANGELOG nutzt SemVer-Tags. Künftig wird bei jedem
  Commit die Version gebumpt (Patch/Minor/Major je nach Größe).
- **TODO.md** erweitert:
  - **Tool-Themes** mit konkreten Vorschlägen
    (Dark, Light, Cyberpunk, Matrix, Hero, Hologram, Industrial)
    plus Auto-OS-Theme-Erkennung.
  - **Mehrsprachigkeit DE/EN** als ausgearbeiteter Eintrag
    (i18n-Layer mit JSON-Stringtable, `data-i18n`-Attribute,
    LocalStorage-Persistenz, sprachabhängige Block-Labels und
    Tooltips, optional RU/FR/ES).

## [1.0.0] — 2026-05-12

Erste voll-featured Release nach 0.1.0 — bündelt Phase 2 (Block-Katalog),
Phase 3 (Drag-and-Drop), Phase 3b (Katalog-Tiefe), Inventar-Prüfungen,
Item-Subtype-Selector, Phase 4a–4d (LCD-Baukasten, Themes, Presets,
Layout-Engine, manuelles Positionieren mit Aspect-Lock) und sämtliche
Folge-Fixes (Tachometer-viewBox, enge Manual-Rahmen, README/TODO).

### Geändert (README + TODO)
- **README.md** komplett überarbeitet: aktueller Feature-Stand (52
  Block-Typen, 19 LCD-Widgets, Drag-and-Drop, Themes, Presets,
  Inventar-Prüfungen, manuelles Positionieren), Live-URL ergänzt,
  Architektur-Baum aktualisiert.
- **TODO.md** neu — Roadmap mit Block-Gruppen, mehreren WENN/DANN-
  Paketen, Multi-LCD-Anordnung (Phase 5), Touch-Support,
  Steam-Workshop-Export, Import-Funktion, Tool-Theme, i18n,
  Vorlagen-Export, Smart-Snap usw.

### Behoben (Tachometer-Vorschau)
- Unterer Bogen-Scheitel des 270°-Halbrings wurde durch die viewBox-
  Untergrenze abgeschnitten. Zentrum von cy=48 auf cy=40 verschoben,
  Texte proportional nachjustiert. Seitenverhältnis 1.25:1 bleibt.

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
