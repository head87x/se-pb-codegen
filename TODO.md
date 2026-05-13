# TODO / Roadmap

Sammlung offener Ideen für die Weiterentwicklung. Reihenfolge nicht
festgelegt — wird gepickt, wenn es passt oder Bedarf da ist.

## Größere Features

### Block-Gruppen
**Erledigt in v1.5.0**: Toggle „Auf Block-Gruppe anwenden" pro
Bedingung/Aktion. Aktionen → `foreach` über Gruppe; Bedingungen →
`.Any()`-Semantik (erfüllt sobald irgendein Block in der Gruppe sie
erfüllt).

Mögliche Erweiterungen:
- **ALL-Semantik** für Bedingungen — Bedingung erfüllt nur wenn
  alle Blöcke sie erfüllen (Toggle „any/all" pro Gruppen-Bedingung).
- **Aggregator-Semantik** — „Durchschnitt aller Akkus < 20 %"
  oder „Summe aller Reaktor-Outputs > 5 MW". Wäre eine dritte
  Option neben any/all.
- **Anzahl-Bedingung** — „Mindestens 3 Sensoren aktiv" als
  `.Count(...) >= N`.

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
**Phase 1 erledigt in v1.6.0**: i18n-Layer mit `t("key")` und
`data-i18n`-Attributen, DE/EN-Umschalter im Header, LocalStorage-
Persistenz. Übersetzt sind alle Sektion-Titel, Buttons, Hilfe-Texte,
Toasts, Modal-Buttons, Bedingungs-/Aktions-/Else-UI, LCD-Composer-
Felder, Multi-LCD-Konfiguration, Share-Token, Footer.

**Erledigt**:
- v1.6.0: i18n-Layer + statische UI-Strings (Sektion-Titel, Buttons, Toasts, …).
- v1.7.0: 52 Block-Namen, 13 Kategorien, C#-Code-Kommentare, Optgroup-Labels.
- v1.8.0: 514 Condition/Action-Labels + ~280 Tooltip-Texte komplett auf EN.
- v2.1.0: LCD-Composer-UI komplett EN (Widget-Namen, Field-Labels, Themes,
  Presets, Resolutions, UI-Strings, Hints, Optionen, Gruppen).

**Optional für später**:
- Weitere Sprachen (RU, FR, ES, …) mit DE als Fallback. Infrastruktur
  ist drin — nur eine weitere Sprache zur `I18N_LANGS`-Liste in
  `src/js/ui/i18n.js` hinzufügen und entsprechende Maps anlegen
  (kopiere `BLOCKS_EN` + `LCD_*_EN` etc. und übersetze).

### Coroutines
**Erledigt in v2.2.0 + v2.3.0**:
- v2.2.0: Toggle „🔄 Coroutines verwenden" — LCD-Drawing über
  mehrere Ticks via `IEnumerator<bool> DrawAllLcds()` mit `MoveNext`
  + `UpdateFrequency.Once`. Conditions/Actions bleiben atomar.
- v2.3.0: Aggregator-Berechnung gechunkt (50 Blöcke/Tick), Ergebnisse
  in Class-Feldern. Coroutine-Statistik im UI mit Tick-Schätzung.

Mögliche Erweiterungen:
- **Conditions/Actions als Coroutine** — würde Reaktivität opfern,
  daher unwahrscheinlich.
- **Konfigurierbare Chunk-Größe** — aktuell hardcoded 50. UI-Slider
  „Blöcke pro Tick: 10–500" als Advanced-Option.
- **Echtzeit-Statistik** im UI mit echten Tick-Counts vom letzten Lauf
  (würde Round-Trip vom Spiel zurück erfordern — eher unrealistisch).

### Block-List-Refresh-Intervall (zurückgestellt aus v2.1.0)
SE-Wiki: „Updates to block lists every 100+ ticks". Aktuell
refreshen wir die Aggregator-Listen jeden Tick (Clear + GetBlocksOfType).
Feintuning für Performance: nur alle N Ticks neu, Tick-Counter
als Class-Feld. Sinnvoll bei Skripten mit hoher Update-Frequenz
und vielen Blöcken.

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
