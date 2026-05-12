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
**Erledigt in v1.3.0.** Toggle „Multi-LCD-Anordnung" mit Spalten/Reihen
(1–6 je), Namensmuster (`LCD {col}{row}` → A1/B1/A2/B2), Live-Vorschau
mit Trennlinien + Namens-Tags pro LCD, Generator mit `for`-Schleife
über alle LCDs.

Mögliche Verbesserungen, falls Bedarf entsteht:
- Individuelle LCD-Block-Namen pro Zelle überschreiben (statt nur
  Pattern) — z. B. wenn ein LCD aus der Reihe „MainScreen A2" heißt
  statt „LCD A2".
- Snap-Hilfe an LCD-Grenzen: Widgets, die haarscharf an einer Grenze
  liegen, sollen einrasten.
- „Pro LCD anders" — pro LCD eigenes Theme oder eigenes Background-Bild
  (für gemischte Displays).

### Speicherfunktion mit Token (Share-Code)
**Erledigt in v1.4.0** — Variante 2 (selbstenthaltender Base64-Token,
offline-tauglich, Schema-versioniert).

Mögliche Erweiterungen:
- **Kompression** (`pako`/`lz-string` inline) für kompaktere Token —
  aktuell ~5–10 KB für mittelgroße Konfigurationen.
- **URL-Hash-Variante** (`#state=<token>`) — Link öffnet das Tool
  direkt mit dem geladenen State, ohne dass der User Token einfügen
  muss.
- **Server-Backend** für sehr kurze Token (6 Zeichen) und längerfristige
  Aufbewahrung — würde aber „komplett offline" brechen.

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

### Tool-Themes — optionale Extras
**Erledigt:** v1.1.0 brachte Theme-Picker + 5 Themes (Sci-Fi, Dark,
Light, Cyberpunk, Matrix). v1.2.0 ergänzte Hero, Hologram, Industrial
und Auto-OS-Folgen — alle 8 explizit angedachten Themes sind drin.

Optionale Extras, falls jemand will:
- **Matrix-CRT-Scanline-Overlay** — feine horizontale Linien als
  `background-image`, könnte als Toggle „Effekte" zugeschaltet werden.
- **Cyberpunk-Glow** — sanfter Neon-Glow um Akzent-Elemente
  (text-shadow + box-shadow).
- **Theme-Editor** — User könnte eigene Themes definieren und im
  LocalStorage als Custom-Theme speichern (mit Color-Picker pro
  Variable).
- **Theme-Preview-Thumbnails** im Dropdown — kleine Farbsplitter
  pro Theme statt nur Text-Label.

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
