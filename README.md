# SE.PB Code Generator

Ein visuelles Web-Tool, das C#-Code für den **Programmable Block** in
Space Engineers erzeugt — ohne C#-Kenntnisse, ohne IDE, ohne Build-Schritt.

Du klickst dir per Drag-and-Drop oder Dropdown zusammen, welcher Block-Typ
(Sensor, Kolben, Tür, Akku, Reaktor, Cargo …) was prüfen oder tun soll —
und das Tool spuckt fertigen, kommentierten C#-Code aus, den du nur noch
in den PB einfügen musst.

**Live-Version:** [head87x.github.io/se-pb-codegen](https://head87x.github.io/se-pb-codegen/)
(GitHub Pages — wird direkt aus dem `main`-Branch ausgeliefert).

---

## Quickstart

1. [Live-Version](https://head87x.github.io/se-pb-codegen/) im Browser öffnen
   — **oder** das Repo klonen / als ZIP herunterladen und `index.html` per
   Doppelklick öffnen (läuft komplett offline).
2. Links Bedingungen + Aktionen zusammenstellen, optional einen
   LCD-Baukasten konfigurieren.
3. Rechts den generierten Code mit **⧉ Kopieren** holen.
4. In Space Engineers: Programmable Block → **Edit** → Code reinpasten →
   **Check Code** → **Remember & Exit**.

Keine Installation, kein Build, keine Dependencies — Vanilla HTML/CSS/JS.

---

## Features

### Logik-Baukasten

- **52 Block-Typen** in 12 Kategorien (Bewegung, Energie, Förderung,
  Produktion, Antrieb, Waffen, Tools, Sensorik, Steuerung, Anzeige,
  Sicherheit, Misc) — alle PB-fähigen `IMy*`-Interfaces aus
  `Sandbox.ModAPI.Ingame` praxis-vollständig abgedeckt.
- **Standard / Erweitert** als Tier-Filter pro Block-Typ — nur die häufigen
  oder alle Optionen anzeigen.
- **Drag-and-Drop-Block-Palette** auf der linken Seite — Block aus
  Suchfeld + Kategorien-Liste in den WENN/DANN/SONST-Bereich ziehen.
- **Custom-Modus** für alles, was nicht im Katalog ist: beliebige
  `ApplyAction`, `SetValueBool/Float` oder roher C#-Code mit `{v}` als
  Block-Platzhalter.
- **Inventar-Prüfungen**: 9 Block-Typen (Cargo, Refinery, Assembler, O₂-/
  H₂-Generator, Connector, Sorter, Drill, Welder, Grinder) können auf
  Items im Inventar prüfen — mit Stück- oder kg-Vergleich.
  Subtypes (Ore/Ingot/Component/Ammo/Tool/Bottle) per gestaltetes
  Dropdown mit Gruppen, plus „Custom …" für Mod-Items.
- **Verschachtelte Bedingungen** mit UND/ODER-Verknüpfung, **SONST-Zweig**
  (else-Block).
- **5 Ausführungsmodi**: manuell (Argument/Button), kontinuierlich,
  alle 1s / 10 Ticks / 100 Ticks.
- **Tooltip-System** mit `(i)`-Icons hinter jeder Option — Erklärtexte
  was die Bedingung/Aktion tut und welche Werte sinnvoll sind.

### LCD-Baukasten (Sprite-API)

- **19 Widget-Typen**: Header, Section-Streifen, Trennlinie, Spacer, Uhr,
  Statusleiste (horizontal/vertikal/segmentiert), Doppelbalken, Wert,
  Großes Zahlenfeld, Icon+Wert, Donut (Kreis), Tachometer (Halbring),
  Punkt-Indikator (Ampel), Multi-Block-Aggregator, Statusliste (✓/✗),
  Warnhinweis (blinkend), Alarm-Banner.
- **Live-SVG-Vorschau** für jedes Widget direkt im Editor — exakt das
  Layout, das später im Spiel rauskommt.
- **Manuelles Positionieren per Drag & Drop** direkt in der
  Live-Vorschau: Widget verschieben, Eck-Griff zum Resize,
  **Aspect-Lock** (Seitenverhältnis bleibt erhalten),
  Snap-to-Grid (16 LCD-Pixel), Live-Maße-Badge.
- **4 LCD-Formate**: Standard 1:1 (512×512), Wide 2:1, Tall 1:2,
  Big LCD 3×3 (768×768). Der generierte Code passt sich zur Laufzeit
  an das tatsächliche LCD im Spiel an (`SurfaceSize`).
- **4 Themes** (Orange / Rot-Alarm / Grün-Industrie / Blau-Sci-Fi) als
  Quick-Apply-Buttons. Semantische Slots (Erfolg-Grün, Warnung-Gelb,
  Fehler-Rot) bleiben über alle Themes konstant.
- **5 fertige Presets**: Schiff-Übersicht, 4 Donuts (2×2), Energie-Panel,
  Cockpit-Anzeigen, Wide-Dashboard — als Schnellstart zum Anpassen.
- **Layer-Liste** neben der Vorschau mit Sichtbarkeits-Toggle pro Widget.
- **Aggregator-Widget** summiert/durchschnittet über alle Blöcke eines
  Typs (z. B. „Alle Akkus Ø 87 %") via `GetBlocksOfType<T>()`.
- **Text-LCD-Modus** (alternativ): einfache Status-Textausgabe mit
  Bedingungs-Zustand + ausgeführten Aktionen auf einem LCD.

### Sonstiges

- **Vorlagen** speichern/laden im Browser (LocalStorage).
- **Syntax-Highlighting** im Output, **Download** als `.cs`-Datei,
  **⧉ Kopieren** in die Zwischenablage.
- **Live-Code-Preview**: Code rechts aktualisiert sich bei jedem
  Tastenanschlag, kein Re-Render → kein Fokus-Verlust beim Tippen.

---

## Bedienung

### Workflow für ein typisches Skript

Beispiel: *„Wenn Sensor X jemanden erkennt, Hangartor öffnen, sonst schließen."*

1. **AUSFÜHRUNG** → `Alle 10 Ticks (Update10)` wählen (reaktiv & sparsam).
2. **WENN** → `+ Bedingung` *(oder Sensor aus der Palette ziehen)*
   - Block-Typ: `Sensor`
   - Block-Name: `Sensor 1` (exakt wie im Spiel-Terminal!)
   - Prüfung: `Etwas erkannt?`
3. **DANN** → `+ Aktion`
   - Block-Typ: `Tür (Door)`, Block-Name: `Hangar Door`, Aktion: `Öffnen`
4. **SONST** → `+ Aktion`
   - Block-Typ: `Tür (Door)`, Block-Name: `Hangar Door`, Aktion: `Schließen`
5. Rechts erscheint live der fertige Code. **⧉ Kopieren** → in PB einfügen.

### Block-Namen

Block-Namen müssen **exakt** mit dem Namen im Space-Engineers-Terminal
übereinstimmen (Groß-/Kleinschreibung, Leerzeichen). Tipp: im Spiel den
Block anklicken und den Namen aus dem Feld oben kopieren.

### Mehrere Bedingungen

Sobald eine zweite Bedingung hinzukommt, erscheint zwischen ihnen ein
**UND/ODER**-Dropdown. Die Bedingungen werden in der angezeigten Reihenfolge
verknüpft:

```
Bedingung1 AND Bedingung2 OR Bedingung3   ⇒   (b1) && (b2) || (b3)
```

Hinweis: C# wertet `&&` vor `||` aus. Für komplexe Klammerung den
Custom-Modus verwenden.

### Custom-Modus

Wähle Block-Typ **`Custom (selbst eintragen)`** für:

- Block-Typen außerhalb des Katalogs.
- Beliebige `ApplyAction("…")`-Aufrufe.
- `SetValueBool` / `SetValueFloat` für Properties, die das Tool nicht
  direkt anbietet.
- Rohen C#-Code (mit `{v}` als Platzhalter für die Block-Referenz).

Beispiele im Custom-`rawCode`-Feld:

```csharp
{v}.Enabled = !{v}.Enabled;                           // Toggle
{v}.ApplyAction("OnOff_On");                          // Action-by-Name
((IMyAssembler){v}).Mode = MyAssemblerMode.Disassembly;
```

### LCD-Baukasten

1. **LCD-Baukasten aktivieren**, LCD-Block-Namen + Surface-Index angeben
   (Cockpits/PBs haben mehrere Surfaces).
2. LCD-Format wählen (Standard / Wide / Tall / Big 3×3).
3. Optional ein **Preset** laden — oder leer starten.
4. **Widgets hinzufügen** über die Widget-Palette. Jedes neue Widget
   landet im manuellen Positionierungs-Modus mit kompakter Default-Größe.
5. **Direkt auf der LCD-Vorschau** verschieben und am Eck-Griff resizen
   (Aspect-Lock, Snap auf 16 px).
6. Pro Widget Datenquelle + Block-Name + Farben einstellen
   (Editor klappt unter dem Vorschaubild auf).
7. **Theme** als Schnellstart wählen — färbt alle Standard-Farben passend
   um, Custom-Farben bleiben erhalten.

### Inventar-Prüfungen

Für 9 Block-Typen (Cargo, Refinery, Assembler, Drill, Welder, Grinder,
Sorter, Connector, O₂-/H₂-Generator) lassen sich Prüfungen wie *„Hat mehr
als 50 Eisenerz?"* per Dropdown bauen. Das Tool injiziert dabei automatisch
einen Helper `_invHas(block, type, subtype, amount)` ins generierte Skript.

Subtype-Auswahl per `<optgroup>`-Dropdown (Erze / Ingots / Komponenten /
Munition / Tools / Flaschen) — am Listenende „Custom …" für Mod-Items.

### Vorlagen

- **+ Speichern**: aktuelle Konfiguration unter einem Namen ablegen.
- Klick auf einen Vorlagen-Chip lädt sie wieder.
- Vorlagen liegen im Browser-LocalStorage (pro Browser/Profil getrennt).

---

## Architektur

Kein Build, keine Frameworks, keine ES-Modules (wegen `file://`-CORS) —
Multi-File-Struktur via `<script src>`-Tags:

```
se-pb-codegen/
├── index.html              ← HTML-Skelett + <link>/<script>-Tags
├── README.md / ARCHITECTURE.md / CLAUDE.md / CHANGELOG.md / TODO.md
└── src/
    ├── css/styles.css
    └── js/
        ├── state.js                  State-Objekt
        ├── blocks/
        │   ├── catalog.js            BLOCKS-Katalog (52 Typen)
        │   ├── descriptions.js       Tooltip-Texte
        │   └── item_subtypes.js      Ore/Ingot/Component-Listen
        ├── ui/
        │   ├── render.js             DOM-Aufbau (Master-render)
        │   ├── inputs.js             Mutations + Fokus-Fix-Strategie
        │   ├── tooltips.js           (i)-Tooltip-Infrastruktur
        │   ├── dnd.js                Block-Palette-Drag-and-Drop
        │   ├── lcd-dnd.js            LCD-Widget-Drag + Resize
        │   └── templates.js          Vorlagen
        ├── generator/
        │   ├── codegen.js            state → C#-String
        │   └── highlight.js          Syntax-Highlight im Output
        └── lcd/
            ├── widgets.js            LCD_WIDGETS-Katalog + Themes + Presets
            ├── preview-svg.js        SVG-Vorschauen
            └── composer.js           Sprite-API-C#-Generator
```

Mehr Details in [`ARCHITECTURE.md`](./ARCHITECTURE.md).

---

## Roadmap

Geplante Features und Ideen für die Weiterentwicklung sind in
[`TODO.md`](./TODO.md) gesammelt.

---

## Lizenz

Dieses Projekt steht unter der **GNU General Public License v3.0**.

Du darfst es frei nutzen, verändern und weitergeben – unter der
Bedingung, dass:

- der Autor genannt wird
- abgeleitete Werke ebenfalls unter der GPL v3 veröffentlicht werden
- der Quellcode bei Weitergabe zugänglich bleibt

Details siehe [`LICENSE`](./LICENSE).

Copyright © 2026 head87x

---

## Disclaimer

Space Engineers © Keen Software House. Dieses Tool ist inoffiziell
und steht in keiner Verbindung zu Keen.
