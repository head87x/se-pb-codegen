# TODO / Roadmap

Sammlung offener Ideen für die Weiterentwicklung. Reihenfolge nicht
festgelegt — wird gepickt, wenn es passt oder Bedarf da ist.

## Größere Features

### Block-Gruppen
Aktuell wird pro Block ein `GetBlockWithName`-Lookup gemacht.
Mit `GridTerminalSystem.GetBlockGroupWithName` + `GetBlocksOfType<T>`
könnte ein Block-Eintrag auch eine ganze Gruppe ansprechen
(z. B. „alle Frontlichter" einschalten statt jedes Licht einzeln zu
listen). Wahrscheinlich neuer Toggle „Einzel-Block / Gruppe" pro
Eintrag in Conditions/Actions.

### Mehrere unabhängige WENN/DANN-Pakete pro Skript
Aktuell gibt es genau ein WENN/DANN/SONST pro generiertem Skript.
Erweiterung: mehrere unabhängige Regel-Blöcke (z. B. Regel 1: „wenn
Akku < 20 % → Reaktor an", Regel 2: „wenn Sauerstoff < 30 % → Alarm")
in einem einzigen PB-Skript. UI-mäßig wahrscheinlich Tab-/Karten-Layout.

### Phase 5 — Multi-LCD-Anordnung
Mehrere benachbarte LCDs als ein großes virtuelles Display behandeln.
Grid-Konfigurator (2×1, 3×3 …), Widget kann sich über mehrere LCDs
spannen, Generator erzeugt pro physikalischem LCD einen eigenen
Code-Block, der nur „seinen" Ausschnitt rendert.
Block-Namen-Konvention dafür festlegen (z. B. `LCD Wand A1, A2, B1, B2`).

### Touch-Support für Drag & Drop
Aktuell nur Mouse-Events sowohl in der Block-Palette als auch beim
LCD-Widget-Positionieren. Für Tablets/Touchscreens müssten
`touchstart`/`touchmove`/`touchend` ergänzt werden (oder PointerEvents
als Vereinheitlichung).

## Mittlere Features

### Steam-Workshop-Export
`.cs`-Output ergänzen um Header-Kommentar mit Workshop-Metadaten
(Skript-Name, Beschreibung, Tags, Version) — direkt copy-paste-fertig
für `Scripts/Local/<Name>/Script.cs` + dazu `Description.xml` oder
ähnliches Workshop-Format generieren.

### Import-Funktion
Vorhandenes PB-Skript einlesen und in Bausteine zurückwandeln —
sehr ambitioniert, vermutlich nur für selbstgenerierte Skripte
realistisch (Header-Marker wie `// SE.PB-CODEGEN-VERSION: 1.0`
+ eingebettetes State-JSON in einem Kommentar).

### Tool-Themes — weitere Looks
**Erledigt in v1.1.0:** Theme-Picker im Header + Persistenz; 5 Themes
verfügbar (Sci-Fi, Dark, Light, Cyberpunk, Matrix).

Noch offene Looks für ein zweites Theme-Set:
- **Hero** — Sci-Fi-Sauber (Star-Citizen-/Destiny-Stil): Weißblau,
  feine Linien, Glassmorphism.
- **Hologram** — kühles Türkis, leicht transparent, blass-leuchtend
  („HUD-Holo-Display").
- **Industrial** — gedämpftes Orange/Stahlgrau, schwere Kanten,
  Warntreifen — passend zu Space Engineers' Industrie-Ästhetik.

Außerdem: „Auto"-Option, die `prefers-color-scheme` folgt
(Light bei Tag, Dark bei Nacht).

Matrix-Theme könnte einen CRT-Scanline-Overlay-Effekt bekommen
(`background-image` mit feinen horizontalen Linien) — bewusst
weggelassen, weil's auf großen Monitoren stört. Falls gewünscht
optional zuschaltbar.

### Mehrsprachigkeit (Deutsch / Englisch umschaltbar)
Strings sind aktuell komplett deutsch und großteils im HTML hardcodiert.
Ziel: Sprachumschalter in der Header-Leiste (DE / EN), Auswahl
persistiert im LocalStorage.

Implementierung:
- i18n-Layer mit JSON-Stringtable je Sprache
  (`src/i18n/de.json`, `src/i18n/en.json`).
- Statische Texte über `data-i18n="key"`-Attribute am HTML, ein
  kleiner Bootstrap-Renderer ersetzt sie beim Laden.
- Dynamisch erzeugte Texte (Render-Funktionen, Generator-Kommentare)
  über eine `t('key')`-Helper-Funktion.
- Block-Katalog-Labels (`BLOCKS["Tür (Door)"].label`) und
  Tooltip-Texte (`DESCRIPTIONS`) sprachabhängig — zweite
  Translations-Datei für DE/EN parallel.
- Optional: weitere Sprachen (RU, FR, ES) — Strings als Fallback
  auf EN, dann DE.

Generierter C#-Code bleibt in Englisch (Identifier) — nur die
Kommentar-Strings darin werden lokalisiert.

### Vorlagen-Export / -Import als JSON-Datei
Aktuell liegen Vorlagen nur im LocalStorage des Browsers. Datei-
basierter Export (Download als `.json`) + Import (File-Picker) würde
Teilen zwischen Geräten/Browsern ermöglichen.

## Kleinere Verbesserungen

### Operator-Präzedenz mit Klammern
Aktuell verlassen wir uns auf C#-Standard (`&&` vor `||`) und können
keine explizite Klammerung. UI-mäßig „Gruppe öffnen / Gruppe schließen"
zwischen Bedingungen — schwierig sauber zu bauen, aber für komplexe
Logik nötig.

### Validierung von Block-Namen
Aktuell nur Escaping von Anführungszeichen. Checks wie „Block-Name
leer", „doppelter Name", „enthält ungültige Zeichen" wären user-
freundlich.

### Block-Namen aus Save-File auslesen
Sehr spekulativ: SE speichert Welten als XML. Bei lokal liegenden
Welten könnte ein File-Picker den Namen-Index extrahieren und als
Vorschlagsliste anbieten. Aber: Pfade variieren je OS, und das Tool
soll offline-only bleiben.

### Multi-Widget-Auswahl im LCD-Composer
Mehrere Widgets gleichzeitig selektieren (Shift-Click) und gemeinsam
verschieben/ausrichten/löschen. Aktuell ist Bearbeiten Widget-für-
Widget.

### Smart-Snap im LCD-Composer
Beim Drag aktuell nur Grid-Snap (16 px). Erweiterung: Snap an Kanten
anderer Widgets („align with X"-Linien), Snap an LCD-Mitte/-Drittel,
Snap an gleiche Größe wie Nachbar-Widget.
