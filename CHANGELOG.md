# Changelog

Alle nennenswerten Änderungen an diesem Projekt werden hier dokumentiert.

Das Format orientiert sich an [Keep a Changelog](https://keepachangelog.com/de/1.1.0/),
das Projekt folgt [Semantic Versioning](https://semver.org/lang/de/).

## [Unreleased]

## [4.2.0] — 2026-05-15

### Hinzugefügt (Cosmetic / Theme-Politur)

**Effekte-Toggle**
- Neuer Button **„✨ Effekte"** im Header. Wenn aktiv:
  - **Matrix-Theme** bekommt zusätzliche CRT-Scanline-Overlay
    (feine horizontale Linien als `repeating-linear-gradient`,
    `mix-blend-mode: screen`).
  - **Cyberpunk-Theme** bekommt Neon-Glow um Akzent-Elemente
    (`text-shadow` + `box-shadow` mit Accent-RGB).
- Zustand persistiert in localStorage (`se_pb_effects`).
- Greift nur bei Matrix/Cyberpunk — andere Themes bleiben
  unverändert.

**Theme-Preview-Thumbnails (Custom-Dropdown)**
- Das Theme-Dropdown im Header wurde von nativem `<select>`
  auf ein eigenes themed Dropdown umgestellt.
- Pro Theme zeigt jetzt ein kleiner Farb-Splitter (3 Striche:
  Accent / Panel / Text) plus das Label.
- Im Trigger-Button ist der Splitter des aktuell gewählten
  Themes sichtbar. Beim Aufklappen sieht man alle Themes mit
  Splittern nebeneinander.
- Outside-Click schließt das Dropdown.

### Geändert
- `TOOL_VERSION` von `4.1.1` auf `4.2.0`.
- `setLang()` aktualisiert beim Sprachwechsel zusätzlich das
  Custom-Theme-Dropdown.

## [4.1.1] — 2026-05-15

### Behoben (Widget springt zur Ecke beim ersten Drag)
- Wenn ein noch nicht selektiertes Widget angeklickt und ohne
  Loslassen direkt gezogen wurde, sprang es zur Canvas-Ecke
  (in Richtung der Mausbewegung). Beim zweiten Anlauf (Klick +
  loslassen + nochmal ziehen) lief alles normal.
- Ursache: `_lcdMouseDown()` rief `render()` auf, sobald das
  Widget vorher nicht selektiert war — das zerstörte das
  DOM-Element der Cell mitten im Drag-Start. Nachfolgende
  `cell.closest()`/`getBoundingClientRect()`-Aufrufe lieferten
  dann falsche Koordinaten.
- Fix: kein voller `render()` mehr im Drag-Start; stattdessen
  direkte CSS-Klassen-Manipulation (`.is-selected` toggeln) am
  bestehenden DOM. Volles Render läuft eh am Drag-Ende.

## [4.1.0] — 2026-05-15

### Hinzugefügt (LCD-Composer Multi-Widget-Erweiterungen)

**Strg+A — alle Widgets selektieren**
- Tastenkürzel im LCD-Composer (außerhalb von Eingabefeldern).
  Funktion `selectAllLcdWidgets()` in inputs.js.

**Ausrichten-Buttons in der Action-Bar**
- Erscheinen sobald ≥2 Widgets selektiert sind, unter dem
  bestehenden „Löschen / Abwählen"-Bereich.
- Sechs Modi: Links / Mitte horizontal / Rechts /
  Oben / Mitte vertikal / Unten.
- Referenz ist die **Bounding-Box** aller selektierten Widgets
  (nicht das erste).

**Verteilen — gleiche Abstände**
- Zusätzlich bei ≥3 Widgets: Buttons für horizontale und
  vertikale Verteilung. Endpunkte (erstes + letztes) bleiben,
  mittlere Widgets bekommen gleichmäßige Gaps.

**Lasso-Select**
- Maus-Drag auf dem LCD-Vorschau-Hintergrund (nicht auf einem
  Widget) zieht ein gestricheltes Auswahl-Rechteck.
- Beim Loslassen werden alle Widgets selektiert, deren
  Bounding-Box den Rahmen schneidet.
- **Shift-Drag** erweitert die bestehende Selektion (statt zu
  ersetzen).
- Reines Klicken auf Hintergrund (ohne Bewegung) bleibt
  Selektion-leeren wie bisher.

**„Gleiche Größe wie Nachbar"-Snap beim Resize**
- Beim Größenändern eines Widgets snappt es an die Breite
  bzw. Höhe anderer Widgets auf dem Canvas (Threshold 8 LCD-px,
  wie das bestehende Smart-Snap).

### Geändert
- `TOOL_VERSION` von `4.0.2` auf `4.1.0`.
- Action-Bar bei selektierten Widgets ist jetzt zweizeilig
  (Zähler+Löschen oben, Ausrichten+Verteilen unten).

## [4.0.2] — 2026-05-15

### Behoben (Autocomplete-Klick übernahm den Wert nicht)
- Beim Klick auf einen Vorschlag im Autocomplete-Popup wurde
  der Wert nicht ins Input übernommen. Ursache: das HTML
  generierte `onmousedown="...; _pickBlockAutocomplete("Sensor 1")"`
  über `JSON.stringify`, dessen doppelte Anführungszeichen die
  HTML-Attribut-Syntax kollidieren ließen (HTML-Parser brach
  beim ersten inneren `"` ab).
- Fix: Block-Name landet jetzt in `data-value="..."` (sicher
  via `escapeAttr`), Handler liest `this.dataset.value`.

## [4.0.1] — 2026-05-15

### Behoben (UX-Politur: Autocomplete + Validation-Tooltip)
- **Autocomplete-Vorschläge** waren als browser-natives
  `<datalist>` realisiert — das Dropdown ist Browser-Standard
  und nicht stylebar (weiße Sprechblase außerhalb des Themes).
  Ersetzt durch ein eigenes themed Popup
  (`<div class="block-autocomplete">`): dunkler Hintergrund,
  Akzent-Border, Hover-Highlight wie im Rest der UI.
  Funktional gleich: zeigt bis zu 8 passende Vorschläge unter
  dem Input, Klick auf Vorschlag setzt den Wert.
- **⚠-Tooltip** beim Block-Namen-Validation-Badge nutzte das
  native `title`-Attribut (auch weiße Sprechblase). Ersetzt
  durch das bestehende themed Tooltip-System
  (`showTooltip` / `hideTooltip`) — sieht aus wie die
  bekannten ⓘ-Tooltips bei Bedingungs-Auswahlfeldern.

### Geändert
- `TOOL_VERSION` von `4.0.0` auf `4.0.1`.

## [4.0.0] — 2026-05-15

### Hinzugefügt (Quality-of-Life-Etappe — sechs kleinere Verbesserungen)

**Auto-Complete für Block-Namen**
- Alle Block-Name-Eingaben (Bedingungen, Aktionen, LCD-Status,
  LCD-Composer, Widget-Source-Blocks) zeigen jetzt eine
  Vorschlags-Liste mit allen bereits anderswo verwendeten
  Namen.
- Implementation: HTML5 `<datalist id="available-blocks">`,
  `_buildAvailableBlocksList()` sammelt Namen aus dem State,
  `_refreshAvailableBlocksDatalist()` läuft pro `render()`
  und nach jedem Tastenanschlag.

**Warnung bei doppelten Block-Namen**
- Wenn derselbe Block-Name in zwei **unterschiedlichen
  Block-Typen** verwendet wird (z. B. „Schleuse" als Tür UND
  als Akku), erscheint ein gelbes ⚠ am betroffenen Input mit
  Hinweis-Tooltip — wahrscheinlich Tippfehler.
- Mehrfach-Verwendung desselben Namens im selben Typ (z. B.
  Tür „Schleuse" prüfen + öffnen) ist kein Konflikt → keine
  Warnung.
- Live-Aktualisierung beim Tippen — wenn du den Namen in
  Input A änderst, verschwindet die Warnung auch in Input B.

**Per-Vorlage-Export**
- Kleines ⤴-Icon pro Vorlagen-Chip exportiert nur diese eine
  Vorlage als JSON-Datei. Praktisch zum Teilen einzelner
  Vorlagen statt der gesamten Liste.
- Dateiname: `se-pb-template-&lt;name&gt;-YYYY-MM-DD.json`.

**Drag-&-Drop von JSON-Vorlagen-Dateien**
- Eine `.json`-Datei aufs Browser-Fenster ziehen öffnet den
  Import-Dialog direkt — ohne File-Picker-Klick.
- Visueller Hinweis (gestrichelter Rahmen) zeigt aktive
  Drop-Zone.
- Reagiert nur auf Dateien (nicht auf interne Drag-Drops
  der Block-Palette / LCD-Composer).

**Token-Kompression**
- Share-Tokens werden jetzt mit `CompressionStream("gzip")`
  komprimiert. Typische Größe: ~5–10 KB → ~1–2 KB.
- Native Browser-API, kein externes Library nötig.
- Prefix `"L:"` kennzeichnet komprimierte Tokens; alte
  unkomprimierte Tokens bleiben vollständig lesbar.

**Teilen-Link (URL-Hash-Variante)**
- Neuer Button **„🔗 Teilen-Link"** in der Share-Token-Sektion.
  Klick erzeugt einen Link wie
  `…/index.html#state=&lt;token&gt;` und kopiert ihn in die
  Zwischenablage.
- Beim Öffnen einer solchen URL lädt das Tool den State
  automatisch (mit Bestätigungs-Dialog falls bereits Inhalte
  vorhanden sind, sonst ohne).
- URL-Hash wird nach dem Laden wieder entfernt, damit Reload
  nicht erneut fragt.

### Geändert
- `TOOL_VERSION` von `3.2.2` auf `4.0.0`.

### Hinweis
Erster Release der v4.x-Roadmap. Nächste Etappen:
- v4.1.0 — LCD-Composer-Erweiterungen (Ausrichten, Verteilen,
  Strg+A, Lasso-Select, „Gleiche Größe"-Resize).
- v4.2.0 — Cosmetic (Effekte-Toggle, Theme-Thumbnails).
- v4.3.0 — Power-Features (Expert-Mode, Klammerung,
  Refresh-Intervall, Coroutine-Chunks).
- v5.0.0 — MAJOR: Mehrere unabhängige WENN/DANN-Pakete.

## [3.2.2] — 2026-05-15

### Geändert (Erklärung jetzt wirklich natursprachlich)
- Die Plain-Language-Beschreibung sagt jetzt z. B. **„ob Tür 1
  offen ist"** statt **„am Tür „Tür 1" die Bedingung „Ist offen"
  zutrifft"**. Catalog-Labels werden nicht mehr in Anführungszeichen
  rezitiert, sondern in lesbare Satzteile umgeformt.
- Heuristiken:
  - Boolean-Conditions „Ist X" → „X ist" (Verb am Ende für
    deutsche Nebensatz-Wortstellung).
  - „Hat X" → „X hat".
  - Number-Conditions „Ladung > X %" mit Wert 50 →
    „mehr als 50 % Ladung hat".
  - Singular/Plural-Verb-Anpassung für Multi-All/Count: „ist" →
    „sind", „hat" → „haben".
  - Action-Labels wie „Öffnen" / „Schließen" → Partizip
    „geöffnet" / „geschlossen".
- Override-Map deckt ~30 Spezialfälle pro Sprache (Sensor, Air Vent,
  Akku, Reaktor, Cargo, Tür, Sound, Antenne, …).
- Block-Subjekt im Single-Modus ist jetzt nur der Block-Name (ohne
  Type-Präfix und Anführungszeichen): „Tür 1" statt „Tür „Tür 1"".

### Beispiel-Output

DE:
> Etwa 6 mal pro Sekunde prüft das Skript, ob Sensor 1 etwas
> erkannt hat und Hauptakku mehr als 50 % Ladung hat. Wenn ja,
> Schleuse wird geöffnet und Notlicht wird eingeschaltet.

DE Gruppe + Count:
> Etwa 6 mal pro Sekunde prüft das Skript, ob mindestens 3 der
> Blöcke der Gruppe „BatteryGroup" weniger als 20 % Ladung haben.
> Wenn ja, NotReaktor wird ausgelöst.

DE Type + Sum:
> Etwa alle 1,6 Sekunden prüft das Skript, ob die Summe der Werte
> über alle Solarpanel-Blöcke auf diesem Construct (Bedingung
> „Output > X (kW)") größer als 50 ist. Wenn ja, alle Tür-Blöcke
> auf diesem Construct werden geschlossen.

EN:
> About 6 times per second the script checks whether Airlock is
> open. If so, Light A is turned on.

## [3.2.1] — 2026-05-14

### Geändert (Erklärung als Fließtext statt Stichpunkte)
- Die Plain-Language-Beschreibung im rechten Panel ist jetzt
  zusammenhängender Fließtext statt einer Stichpunkt-Liste.
- Beispiel-Output (DE):
  > Etwa 6 mal pro Sekunde prüft das Skript, ob am Sensor
  > „Sensor 1" die Bedingung „Etwas erkannt" zutrifft. Wenn
  > ja, wird die Aktion „Öffnen" an Tür „Schleuse" ausgeführt.
  > Andernfalls wird die Aktion „Schließen" an Tür „Schleuse"
  > ausgeführt.
- Mit Type/Group + Aggregator:
  > Etwa alle 1,6 Sekunden prüft das Skript, ob die Summe der
  > Werte aller Solarpanel-Blöcken auf diesem Construct (Bedingung
  > „Output > X (kW)") größer als 50 ist. Wenn ja, wird die
  > Aktion „Schließen" an Tür-Blöcken auf diesem Construct
  > ausgeführt.
- Komplett zweisprachig DE+EN, Verb-Anpassung Singular/Plural
  („wird"/„werden", „is"/„are"), Listen-Verbindung mit
  Komma + „und".
- Catalog-Block-Typ-Labels werden vor der Einbettung gesäubert
  (Klammern wie „(Door)" entfernt) damit der Satz nicht
  zerhackt wirkt.

## [3.2.0] — 2026-05-14

### Hinzugefügt (Plain-Language-Beschreibung der Konfiguration)
- Neue Box **„📖 Was macht dieses Skript?"** im rechten Panel über
  dem generierten Code. Beschreibt die aktuelle Konfiguration in
  natürlicher Sprache — für Einsteiger ohne C#-Kenntnisse.
- Beispiel-Output:
  ```
  ⚙ Das Skript läuft etwa 6 mal pro Sekunde (alle 10 Ticks).

  WENN FOLGENDES ZUTRIFFT:
  ▸ Sensor „Sensor 1" — Etwas erkannt
  ▸ UND Akku „Hauptakku" — Ladung > X % (Wert: 50)

  … DANN WERDEN FOLGENDE AKTIONEN AUSGEFÜHRT:
  → Tür „Schleuse" — Öffnen
  → alle Lampen auf diesem Construct — Einschalten (für jeden Block)
  ```
- Box ist **ein-/ausklappbar** (Klick auf Header). Zustand
  persistiert in localStorage — Wahl bleibt zwischen Sessions.
- Aktualisiert sich automatisch bei jeder Änderung der Konfiguration
  (Bedingung hinzufügen, Aktion ändern, …).
- Auch Coroutines- und Auto-Recovery-Status werden als Hinweis-Zeile
  am Ende eingeblendet, wenn aktiv.
- Komplett zweisprachig (DE + EN) — Sprachwechsel im Header
  greift sofort.

### Geändert (UI-Politur)
- Die kleinen ❓-Buttons in den Sektion-Überschriften sind jetzt
  dezent gestaltet (kein runder Border-Button mehr, sondern leicht
  transparentes Inline-Icon mit Hover-Effekt). Sitzen direkt neben
  dem Sektions-Titel.

## [3.1.1] — 2026-05-14

### Behoben (Hilfe-Modal: Scroll ging zur Seite, nicht zum Modal)
- Beim Versuch im Hilfe-Modal zu scrollen lief der Scroll am Modal
  vorbei direkt zur Seite im Hintergrund. Ursache: `.modal-body`
  war kein Flex-Container, daher konnte `flex:1` auf der Hilfe-
  Message-Box keine Höhe aufbauen → kein interner Scroll-Bereich.
- Fix: `.modal-body` wird beim Hilfe-Modal explizit zum Flex-
  Container, die Höhen-Kette greift jetzt durch.
- Zusätzlich `overscroll-behavior: contain` auf Sidebar und Content,
  damit das Mausrad am Scroll-Ende nicht zur Seite durchrutscht.
- Bonus für ALLE Modal-Typen: Body-Scroll wird während eines
  offenen Modals via `body.style.overflow = "hidden"` gesperrt
  und beim Schließen wieder freigegeben.

## [3.1.0] — 2026-05-14

### Hinzugefügt (Hilfe-System — DE + EN)
- **Großer „❓ Hilfe"-Button** im Header öffnet ein zweispaltiges
  Modal: Inhaltsverzeichnis (Sidebar links) + Erklärungs-Bereich
  (rechts). 16 Themen-Sektionen, alle zweisprachig (DE + EN).
- **Kleine ❓-Knöpfe** in jeder Builder-Sektion-Überschrift
  (Vorlagen, Share-Token, Skript-Info, Ausführung, WENN, DANN,
  SONST, LCD-Text, LCD-Baukasten) öffnen das Hilfe-Modal direkt
  am passenden Abschnitt.
- Inhalts-Sektionen im Workshop-/Tutorial-Stil mit ausführlichen
  Erklärungen, Beispielen, Tipps:
  - Was ist das Tool? / Erste Schritte (Quickstart)
  - Vorlagen / Share-Token / Skript-Info (Workshop-Metadaten)
  - Ausführung (Modi, Coroutines, Auto-Recovery)
  - WENN-Bedingungen / Block-Quellen (Single/Group/Type) / Aggregator
  - DANN- und SONST-Aktionen
  - LCD-Text-Ausgabe / LCD-Baukasten / Widgets im Detail / Multi-LCD
  - Code-Output (Copy, Download, Klartext)
  - Im Spiel nutzen (Recompile, Workshop-Upload, Troubleshooting)
- Hilfe-Modal nutzt das bestehende Theme-System: Akzentfarbe,
  Schriftart und Hintergrund passen sich dem aktiven Theme an.
- Sprachwechsel im Hilfe-Modal greift automatisch — beim
  erneuten Öffnen erscheint der Inhalt in der gewählten Sprache.

### Geändert
- `TOOL_VERSION` von `3.0.1` auf `3.1.0` (Minor-Bump: neue
  Hilfe-Doku, keine API/State-Änderungen).

## [3.0.1] — 2026-05-14

### Behoben (Aggregator-Dropdowns blieben leer)
- In v3.0.0 wurden zwischen dem Block-Typ-Select und dem Bedingungs-
  Select neue Dropdowns eingeschoben (Aggregator, Operator). Ein
  alter Renderer-Code überschrieb deren Werte am Ende des Renderns
  mit den Werten von Block-Typ und Bedingung — die Aggregator-Felder
  zeigten dadurch keine Auswahl (Dropdown wirkte schwarz/leer).
- Selects identifizieren sich jetzt über `data-role`-Attribute,
  der Setter trifft nur noch die richtigen.

## [3.0.0] — 2026-05-14

### Hinzugefügt (Etappe 3/3 aus Expert-Feedback — die größte)

**Block-Quelle: 3-Wege-Auswahl pro Bedingung/Aktion**

Bisher gab's zwei Modi pro Bedingung: Einzelblock (Name) oder
Block-Gruppe (Gruppen-Name). Jetzt drei:

- **Einzelblock** — wie bisher.
- **Block-Gruppe** — wie bisher.
- **Alle Blöcke vom Typ** — neu! Erfasst automatisch ALLE Blöcke
  eines Interface-Typs auf dem Grid (z. B. „alle Solarpanels",
  „alle Türen") **ohne** dass man eine benannte Gruppe anlegen
  muss. Im Code: `GridTerminalSystem.GetBlocksOfType<IMy...>()`.

**`IsSameConstructAs(Me)`-Filter**

Bei „Alle Blöcke vom Typ" steht eine zusätzliche Checkbox
**„Nur dieser Construct (kein Subgrid)"** (Default an). Wenn an,
werden Subgrid-Blöcke (an Rotor-Köpfen, Pisten, Hangars) **nicht**
mitgezählt. Wichtig bei Bohrgrids, Geschützen, beweglichen Teilen.
Wenn aus: alle Subgrids inklusive.

**Aggregator-Suite — 7 Modi für Gruppen UND Typen**

Bisher konnten Gruppen nur Any/All/Count. Jetzt sieben Modi für
Gruppen UND für „Alle Blöcke vom Typ":

- **Any** — mindestens ein Block erfüllt die Bedingung.
- **All** — alle erfüllen.
- **Count** — wieviele erfüllen, vergleichen gegen Schwellwert
  (z. B. „mindestens 3 Akkus unter 20 %").
- **Sum** — Summe einer numerischen Property, vergleichen
  (z. B. „Summe aller Solar-Outputs > 50 kW" — genau der Use-Case
  aus dem Reviewer-Feedback).
- **Avg** — Durchschnitt.
- **Min** — kleinster Wert.
- **Max** — größter Wert.

Für Sum/Avg/Min/Max wird die numerische Property automatisch aus
der gewählten Bedingung extrahiert (Heuristik: alles vor dem
Vergleichsoperator). Plus Operator-Auswahl (>, ≥, <, ≤, =, ≠) und
Schwellwert-Feld.

**Beispiele aus dem Reviewer-Feedback funktionieren jetzt:**

```cs
// "Wenn Summe Solar-Output > 50 kW dann Türen schließen"
List<IMySolarPanel> _allSolarPanel_0;
List<IMyDoor> _allDoor_1;

void InitBlocks()
{
    _allSolarPanel_0 = new List<IMySolarPanel>();
    GridTerminalSystem.GetBlocksOfType(_allSolarPanel_0, _b => _b.IsSameConstructAs(Me));
    _allDoor_1 = new List<IMyDoor>();
    GridTerminalSystem.GetBlocksOfType(_allDoor_1, _b => _b.IsSameConstructAs(Me));
}

public void Main(...)
{
    bool conditionMet = ((_allSolarPanel_0.Sum(_b => _b.CurrentOutput * 1000f) > 50f));
    if (conditionMet)
    {
        foreach (var _b in _allDoor_1) { _b.CloseDoor(); }
    }
}
```

### Geändert (UI)

- Der bisherige Toggle „Auf Block-Gruppe anwenden" ist ersetzt
  durch eine **3-Wege-Pill-Auswahl** „Block-Quelle: Einzelblock /
  Block-Gruppe / Alle Blöcke vom Typ".
- Bei Gruppe oder Typ erscheint die **Aggregator-Auswahl** mit
  allen 7 Modi. Bei Sum/Avg/Min/Max/Count zusätzlich Operator-
  und Schwellwert-Felder.
- Bei „Alle Blöcke vom Typ" entfällt das Block-Name-Feld (gibt's
  ja keinen Namen), dafür kommt die `IsSameConstructAs`-Checkbox.

### Migration (kompatibel mit allen alten Vorlagen)

Alte Vorlagen und Share-Token mit `useGroup`/`groupSemantic`/
`groupCount` werden defensiv migriert:
- `useGroup: true` → `blockSource: "group"`
- `groupSemantic` → `aggregateMode` (1:1)
- `groupCount` → `aggregateThreshold`
- `sameConstruct` defaultet auf `true`

Der generierte Output für migrierte Vorlagen ist **identisch** zur
v2.x-Ausgabe — keine Brüche.

### Hinweise

- **Operator-Default ist `≥`** bei Count/Sum/Avg/Min/Max. Bei
  Migration aus altem `groupSemantic: count` wird die Semantik
  korrekt erhalten (war vorher fest `>= X`).
- **Aktionen** auf „Alle Blöcke vom Typ" laufen als `foreach` über
  die Liste — also „mache X mit allen Solarpanels" funktioniert.
- Property-Extraktion für Sum/Avg/Min/Max funktioniert mit allen
  bestehenden numerischen Conditions. Catalog bleibt unverändert.

## [2.11.0] — 2026-05-14

### Geändert (Block-Initialisierung im Constructor — Etappe 2/3 aus Expert-Feedback)
- **Default-Verhalten umgestellt**: Block-Referenzen werden jetzt
  **einmalig im Program()-Constructor** geholt — nicht mehr pro
  Tick. Standard im SE-Modding-Best-Practice: bei zerstörten
  Blöcken drückt der Spieler im Spiel den **Recompile-Button**,
  was den Constructor erneut ausführt.
- Neue Funktionen im generierten Code:
  - **`InitBlocks()`** läuft genau einmal aus dem Constructor.
    Holt alle Single-Block-Refs, allokiert Gruppen-Listen + Aggregator-
    Listen, initialisiert LCD-Surfaces. Setzt `_initFailed` auf
    `true` wenn ein benannter Block oder eine Gruppe nicht
    gefunden wurde — das Skript stoppt dann sauber per Early-Return
    in `Main()`.
  - **`RefreshBlocks()`** läuft pro Tick aus `Main()`, **aber nur
    wenn nötig**: bei Block-Gruppen (Mitglieder-Refresh,
    Aggregator-Listen) oder bei aktiviertem Auto-Recovery.

### Hinzugefügt (Toggle „Auto-Recovery zerstörter Blöcke")
- Neuer Toggle in der AUSFÜHRUNG-Sektion: **🛡 Auto-Recovery
  zerstörter Blöcke** (Default: aus).
- Wenn aktiviert: `RefreshBlocks()` führt pro Tick zusätzlich
  Closed-Rechecks für Single-Blocks und LCD-Surfaces durch und
  re-fetcht sie bei Zerstörung. Bringt einen Tick-Overhead, ist
  aber sinnvoll für Skripte die durchlaufen und mit zerstörten
  Blöcken umgehen müssen.
- Hilfetext erklärt den Trade-off.

### Hinweise
- **Output-Format ändert sich**: der generierte Code hat jetzt
  `InitBlocks()` und (optional) `RefreshBlocks()` statt der alten
  `EnsureBlocks()`-Funktion. Funktional gleichwertig — Aktionen,
  Gruppen, LCD-Updates verhalten sich identisch.
- **Vorlagen + Share-Token aus älteren Versionen** bekommen
  defensiv `autoRecoverBlocks: false` als Default — das ist das
  neue, performance-bewusste Verhalten. Wer das alte Verhalten
  wieder haben möchte, kann den Toggle aktivieren.
- Performance: pro Skript-Tick werden bei N Single-Blocks N
  Null-or-Closed-Checks und ggf. `GetBlockWithName`-Aufrufe
  gespart. Bei vielen Blöcken merklich.

### Composer-Refactor (intern)
- `generateLcdComposerCode()` liefert jetzt drei zusätzliche
  Code-Buckets neben `ensure` (rückwärtskompatibel): `init`,
  `refresh`, `closedRecheck`. Aufrufer kann passend kombinieren.
- Aggregator-Listen werden immer pro Tick neu gefüllt (Block-
  Mitgliedschaft kann sich ändern), LCD-Surface-Rechecks laufen
  nur bei aktivem Auto-Recovery.

## [2.10.2] — 2026-05-14

### Behoben (i18n-Lücken im EN-Modus)
- **„Keine Vorlagen gespeichert."** in der Vorlagen-Sektion blieb
  deutsch, obwohl der i18n-Key `templates.empty` mit EN-Übersetzung
  existierte. `renderTemplates()` in [src/js/ui/templates.js](src/js/ui/templates.js)
  hat den String hardcoded zurückgesetzt — jetzt korrekt via `t()`.
- **Drag&Drop-Toasts** bei Block-Typen ohne Conditions/Actions
  (z. B. wenn man einen „Cockpit"-Block ins WENN-Feld zieht) zeigten
  in EN noch die deutsche Nachricht. Neue i18n-Keys `dnd.no_conditions`
  und `dnd.no_actions` ergänzt.
- Modal-Buttons (Abbrechen/OK/Bestätigen) waren bereits korrekt
  i18n-verkabelt — keine Änderung dort nötig.

### Hinweis
- Feedback dazu kam von erfahrenen PB-Codern; weitere zwei
  Etappen (EnsureBlocks → Program(), GetBlocksOfType-Aggregator)
  folgen als v2.11.0 + v3.0.0.

## [2.10.1] — 2026-05-14

### Behoben (Theme-Dropdown teilweise deutsch im EN-Modus)
- Die Tool-Theme-Auswahl oben rechts zeigte einige Theme-Namen
  noch mit deutschen Klammern (z. B. „Sci-Fi (Standard)",
  „Hero (Sci-Fi-Sauber)", „Hologram (Türkis)", „Auto (folgt OS)"),
  selbst wenn die Sprache auf Englisch stand.
- Theme-Labels werden jetzt über `tool.theme.<value>`-i18n-Keys
  gezogen (DE + EN-Fassungen ergänzt).
- Beim Sprachwechsel rendert `setLang()` das Theme-Dropdown neu,
  sodass die Übersetzung sofort greift — analog zur LCD-Format-
  und Preset-Auswahl.

## [2.10.0] — 2026-05-14

### Hinzugefügt (Multi-Widget-Auswahl im LCD-Composer)
- **Shift-Klick** auf ein Widget in der Live-Vorschau oder in der
  Layer-Liste → Widget zur Auswahl hinzufügen/entfernen.
- **Plain-Klick** auf ein Widget → setzt die Auswahl auf genau
  dieses eine.
- **Klick auf den Vorschau-Hintergrund** → leert die Auswahl.
- Selektierte Widgets bekommen ein deutliches Highlight-Outline
  in der Vorschau und einen markierten linken Rand in der
  Layer-Liste.
- **Multi-Drag**: alle selektierten Widgets verschieben sich
  gemeinsam um den selben Delta — Snap und Boundary werden pro
  Widget eigenständig respektiert (jedes bleibt im virtuellen
  Canvas).
- **Action-Bar** über der Layer-Liste (sobald ≥1 selektiert):
  zeigt Anzahl + 🗑-Button („Auswahl löschen") + ✕-Button
  („Abwählen") — mit Bestätigungs-Dialog vor dem Löschen.
- **Keyboard-Shortcuts**: ESC räumt die Auswahl, Delete/Backspace
  löscht selektierte Widgets (nur außerhalb von Inputs/Textareas,
  damit nicht versehentlich beim Tippen).
- Verschieben einzelner Widgets per ▲▼-Button in der Liste
  schiebt die Selektion korrekt mit.
- Vorlagen und Share-Token tragen die Auswahl **nicht** persistent
  — beim Laden startet die Auswahl frisch.

### Geändert
- `TOOL_VERSION` von `2.9.0` auf `2.10.0`.

## [2.9.0] — 2026-05-14

### Hinzugefügt (Vorlagen-Datei-Export / -Import)
- **„⤴ Export"-Button** in der Vorlagen-Sektion — lädt alle
  gespeicherten Vorlagen als `se-pb-templates-YYYY-MM-DD.json`
  Datei herunter. Datei enthält Format-Marker, Schema-Version,
  Tool-Version und Export-Datum.
- **„⤵ Import"-Button** — File-Picker für `.json`, parst die
  Datei und hängt enthaltene Vorlagen an die bestehende Liste an
  (Bestätigungs-Dialog vorab).
- **Konflikt-Resolution**: Existiert der Vorlagen-Name bereits,
  bekommt der importierte Eintrag einen Suffix `(2)`, `(3)`, …
  Bestehende Vorlagen werden **nie** überschrieben.
- **Format-Check**: Datei ohne `_format: "se-pb-codegen-templates"`
  wird abgelehnt. Bei höherer Schema-Version als der Tool-Version
  bekannt: Warnung, Import wird trotzdem versucht.
- Vorlagen-Format ist offline-tauglich und plattform-unabhängig —
  ermöglicht Teilen zwischen Browsern/Geräten ohne Server.

### Geändert
- `TOOL_VERSION` von `2.8.0` auf `2.9.0`.

## [2.8.0] — 2026-05-14

### Hinzugefügt (Steam-Workshop-Export — Attribution + Metadaten)
- **Attribution-Header** ganz oben in jedem generierten `.cs` —
  C#-Block-Kommentar mit Tool-Name, Version, GitHub-URL, Tool-
  Ersteller (head87x) und Generierungs-Datum (UTC).
  Wird **immer** emittiert und kann nicht deaktiviert werden.
- Neue UI-Sektion **„SKRIPT-INFO (Workshop)"** mit Toggle
  „Metadaten in Header einfügen" — wenn an, erscheinen unter dem
  Attribution-Block zusätzlich:
  - Skript-Name
  - Autor (Spielername)
  - Version
  - Tags (komma-getrennt)
  - Kurzbeschreibung (mehrzeilig)
- User-Eingaben werden gegen `*/`-Injection sanitiert, damit das
  C#-Block-Kommentar nicht vorzeitig schließt.
- Vorlagen und Share-Token aus älteren Versionen erhalten ein
  defensives `scriptInfo`-Default — keine Migration nötig.

### Geändert
- `TOOL_VERSION`-Konstante in [src/js/state.js](src/js/state.js)
  als Single Source of Truth — gespiegelt im Header-Tag (`v2.8.0`)
  und im generierten Code-Header. Bei künftigen Releases nur noch
  hier ändern.
- Header-Format im generierten Code: Zeilen-Kommentare (`//`)
  ersetzt durch Block-Kommentar (`/* … */`), damit Attribution +
  Workshop-Metadaten als zusammenhängender Header sichtbar sind.

### Hinweis (für Workshop-Upload)
- Skripte werden in SE über den **In-Game-Script-Editor** auf den
  Workshop hochgeladen, nicht über externe `Description.xml`-
  Dateien. Die Metadaten im Header sind also der Workshop-relevante
  „Visitenkarten"-Teil — Steam liest sie nicht direkt, aber jeder
  der das Skript einsieht, sieht Autor + Beschreibung im Code.

## [2.7.0] — 2026-05-14

### Hinzugefügt (Block-Namen-Validierung Phase 2)
- Die in v2.6.0 eingeführte Live-Validierung (⚠-Badge + farbiger
  Border) wirkt jetzt auch in den LCD-Bereichen:
  - **LCD STATUS-AUSGABE (Text)** — Feld „LCD Block-Name".
  - **LCD BAUKASTEN (Grafik)** — Feld „LCD / Cockpit Block-Name".
  - **Source-Block-Felder in LCD-Widgets** — `sourceBlock` in den
    Standard-Widgets sowie `block1`/`block2` im Doppel-Balken.
- Validierung läuft live beim Tippen (kein Re-Render, kein Fokus-
  Verlust), zeigt drei Stufen analog zu v2.6.0:
  - **Fehler (rot)**: Name leer / nur Leerzeichen.
  - **Warnung (gelb)**: führende/nachgestellte Leerzeichen oder
    unsichtbare Steuerzeichen.
  - **OK**: kein Indikator.
- Beim Laden von Vorlagen oder eines Share-Tokens werden die
  statischen Inputs ebenfalls validiert, damit Warnungen sofort
  sichtbar sind.
- Auf Page-Load wird die Validierung der beiden statischen Inputs
  einmalig initialisiert.

### Hinweis
- Output-Format des generierten C#-Codes ist unverändert — reines
  UI-Feature.

## [2.6.1] — 2026-05-14

### Behoben (Live-Validierung beim Tippen)
- Die Block-Namen-Warnindikatoren (eingeführt in v2.6.0) reagierten
  vorher erst beim nächsten vollen `render()` — also wenn der User
  z. B. den Block-Typ oder die Bedingung wechselte. Beim reinen
  Tippen blieb die Warnung stehen.
- Neu: `_refreshBlockNameValidation(this)` läuft direkt im
  `oninput`-Handler. Border-Klasse + Badge werden live (ohne
  Re-Render) am DOM aktualisiert — Fokus im Input bleibt erhalten.
- Damit reagiert das Tool sofort beim ersten Tastendruck:
  Leerzeichen rein → Warnung erscheint;
  Leerzeichen weg → Warnung verschwindet;
  Feld leer → roter Border.

## [2.6.0] — 2026-05-14

### Hinzugefügt (Block-Namen-Validierung)
- **Inline-Warnindikator** an den Block-Name-Inputs in Bedingungen
  und Aktionen. Drei Stufen:
  - **Fehler (rot)**: Name leer oder nur Leerzeichen → Eintrag wird
    vom Generator stillschweigend ignoriert.
  - **Warnung (gelb)**: Führende/nachgestellte Leerzeichen oder
    unsichtbare Steuerzeichen (z. B. zero-width-Spaces aus Discord-
    Copy-Paste). Häufige Quelle für „Block not found"-Fehler im Spiel.
  - **OK**: kein Indikator.
- **Tooltip** am ⚠-Badge erklärt das konkrete Problem.
- Funktioniert für Bedingungen + Aktionen + ELSE-Aktionen, in
  Einzelblock- und Gruppen-Modus.

### Geändert
- Render-Helper `_blockNameInputHtml()` baut Input + Badge + Border
  einheitlich. Validation-Regeln in `_validateBlockName()`.

### i18n
- DE/EN-Keys für `validate.empty`, `validate.whitespace`,
  `validate.controlchar`.

## [2.5.0] — 2026-05-14

### Hinzugefügt (Smart-Snap im LCD-Composer)
- Beim Verschieben und Resizen von Widgets in der LCD-Vorschau snappen
  jetzt zusätzlich zu den Grid-Linien folgende Positionen:
  - **Canvas-Kanten** und **Canvas-Mitte**
  - **LCD-Grenzen** (bei Multi-LCD die Übergänge zwischen LCDs)
  - **Kanten + Mitte aller anderen Widgets** (Links, Rechts, Center-X,
    Top, Bottom, Center-Y)
- **Snap-Schwelle: 8 LCD-Pixel** (halb so groß wie das normale Grid).
  Wenn man im 8-px-Radius einer Snap-Linie ist, springt das Widget
  direkt drauf — sonst übernimmt das normale 16-px-Grid.
- **Visuelle Snap-Guides**: dünne türkise (Theme-Accent-2) Linien
  zeigen die aktive Snap-Position während des Drag-Vorgangs. Eine
  vertikale + eine horizontale Linie, jeweils nur sichtbar wenn
  Snap aktiv ist.
- **Beim Resize** snappt die treibende Achse (X bei waagrechtem,
  Y bei senkrechtem Maus-Delta) an die Kandidaten; die andere
  Dimension folgt dem Aspect-Lock wie bisher.
- **Drag** prüft alle drei Anker (Links-/Mitte-/Rechts-Kante des
  Widgets) gegen die Snap-Kandidaten — wer am nächsten dran ist,
  gewinnt.

### Geändert
- `_lcdVirtualCanvas()` liefert jetzt zusätzlich `lcdW`/`lcdH`/`cols`/`rows`
  — gebraucht für die LCD-Grenzen-Kandidaten.
- Neue Konstante `LCD_SMART_SNAP = 8` (Threshold in LCD-Pixeln).

## [2.4.0] — 2026-05-14

### Hinzugefügt (Block-Gruppen-Semantik)
- Wenn eine Bedingung auf eine **Block-Gruppe** angewendet wird,
  kann jetzt die **Semantik** der Gruppe gewählt werden:
  - **Any** (Default, wie bisher) — Bedingung erfüllt sobald
    irgendein Block der Gruppe sie erfüllt → `list.Any(_b => ...)`
  - **All** — Bedingung nur erfüllt wenn alle Blöcke sie erfüllen
    → `list.All(_b => ...)`
  - **Count ≥ X** — Bedingung erfüllt sobald X Blöcke sie erfüllen
    → `list.Count(_b => ...) >= X`
- **UI**: Bei aktivem Gruppen-Toggle erscheint ein zusätzliches
  Dropdown „Gruppen-Semantik". Bei „Count ≥ X" zusätzlich ein
  Number-Input für die Mindest-Anzahl.
- **Use-Cases**:
  - „Alle Tüten geschlossen": Tür-Gruppe + Bedingung „Ist offen"
    invertieren oder umgekehrt mit „All"-Semantik.
  - „Mindestens 2 von 5 Sensoren aktiv": Sensor-Gruppe + Bedingung
    „Etwas erkannt" + „Count ≥ 2".
  - „Alle Akkus unter 20 %": Akku-Gruppe + „Ladung < 20 %" + „All".

### Geändert
- `addConditionOfType()` legt `groupSemantic: "any"` und
  `groupCount: 1` als Defaults an.
- `updateCond()` behandelt die neuen Felder als Strukturwechsel
  (Re-Render) bzw. Werteänderung.
- Generator (`generateCode()`) emittiert `.Any/All/Count`-LINQ
  je nach Semantik.
- `loadTemplate()` und `_shareApplyDefensiveDefaults()` migrieren
  alte Vorlagen/Token defensiv (fehlende Felder → Defaults).

### i18n
- DE/EN-Keys für `group.semantic.label`, `group.semantic.any`,
  `group.semantic.all`, `group.semantic.count`, `group.count.label`.

## [2.3.0] — 2026-05-14

### Hinzugefügt (Coroutines erweitert — Aggregator-Chunking + Statistik)
- **Aggregator-Computation wird im Coroutine-Modus jetzt gechunkt**:
  50 Blöcke pro Tick statt alle auf einmal. Vermeidet
  „Script too complex"-Risiko bei sehr großen Block-Listen
  (≥500 Akkus, Tanks, Reaktoren …).
- **DrawAllLcds()** läuft jetzt in zwei Phasen:
  - **Phase 1**: gechunkte Aggregator-Berechnung. Ergebnis und
    Count werden als Class-Felder gespeichert
    (`_agg<N>_result`, `_agg<N>_count`).
  - **Phase 2**: LCD-Drawing pro Tick — liest die gecachten
    Aggregator-Werte (kein foreach mehr im Render-Pfad).
- **Bonus-Optimierung:** im Multi-LCD-Modus lief die Aggregator-
  Schleife bisher **pro LCD neu** (also N-mal pro Tick bei N LCDs).
  Jetzt nur **einmal pro Refresh-Runde**.
- **Coroutine-Statistik im UI**: sobald der Toggle aktiv ist und
  ein LCD-Composer konfiguriert ist, erscheint direkt unter dem
  Toggle eine farbige Info-Zeile:

  > 🔢 *Coroutine-Statistik: ~5 Ticks pro Refresh-Runde (4 LCD(s) + 1 Aggregator(en))*

  Schätzung pro Refresh: 1 Tick pro LCD + 1 Tick pro
  Aggregator-Widget (bei ≤50 Blöcken pro Widget). Bei mehr
  Blöcken verteilen sich die Ticks zusätzlich.

### Geändert
- `generateLcdComposerCode()` returnt jetzt zusätzlich `precompute`
  (gechunkter Aggregator-Code für Phase 1 von `DrawAllLcds`).
- `ctx` im Composer hat `precompute` + `useCoroutines`.
- `_aggregatorDrawCode()` als Helper für die Sprite-Render-Zeilen
  (wird in beiden Modi genutzt — mit lokalen Variablen oder
  Class-Feldern).
- Im Coroutine-Off-Modus bleibt das alte Inline-foreach erhalten
  (keine Verhaltensänderung für bestehende Skripte).

## [2.2.0] — 2026-05-14

### Hinzugefügt (Coroutines für LCD-Updates)
- **Neuer Toggle „🔄 Coroutines verwenden"** in der AUSFÜHRUNG-
  Sektion. Wenn aktiv, verteilt der Generator LCD-Drawing über
  mehrere Ticks — vermeidet „Script too complex"-Fehler bei
  Multi-LCD-3×3-Setups oder vielen Aggregator-Widgets.
- **Generierter Code emittiert `IEnumerator<bool> DrawAllLcds()`**
  als separate Methode mit `yield return true;` nach jedem LCD.
  Main() ruft `_drawCoroutine.MoveNext()` und setzt
  `Runtime.UpdateFrequency |= UpdateFrequency.Once;`, um im nächsten
  Tick fortzusetzen.
- **Conditions + Actions bleiben atomar pro Tick** — nur LCD-Drawing
  ist über Ticks verteilt. So bleibt die Reaktivität bei Türen,
  Schaltern etc. erhalten.
- **Trade-off**: LCDs aktualisieren nicht alle gleichzeitig. Bei
  Update10 + 4 LCDs braucht eine volle Refresh-Runde ~4 Ticks
  (~67 ms) statt 1 Tick — meist nicht wahrnehmbar, aber dafür kein
  Risiko mehr „Script too complex".
- **Default: AUS**. Bei einfachen Setups (1 LCD, wenige Widgets)
  bringt der Modus nichts. Toggle nur bei komplexen Setups
  einschalten. Wird auch ignoriert, wenn gar kein LCD-Composer
  aktiv ist.

### Geändert
- `generateLcdComposerCode()` returnt jetzt zusätzlich
  `useCoroutines: bool` und emittiert `yield return true;` nach
  jedem LCD-Block wenn aktiv.
- `loadTemplate()` und `_shareApplyDefensiveDefaults()` migrieren
  alte Vorlagen/Token defensiv (`useCoroutines` fehlt → false).

### Quelle
- https://spaceengineers.wiki.gg/wiki/Scripting/Coroutines_-_Run_operations_over_multiple_ticks

## [2.1.0] — 2026-05-13

### Geändert (Block-Caching nach PB-Wiki-Best-Practices)
- **Generierter Code nutzt jetzt Class-Felder + `EnsureBlocks()`**.
  Bisher wurden `GridTerminalSystem.GetBlockWithName(...)` und
  `GetBlocksOfType<T>(...)` bei JEDEM Tick im `Main()` aufgerufen —
  laut PB-Experten + Space-Engineers-Wiki ein klares Anti-Pattern.
- **Neue Struktur:** Blöcke sind jetzt Class-Felder, werden in
  `EnsureBlocks()` lazy aufgelöst und über `block.Closed`-Check
  validiert. Bei `null`/`Closed` wird neu geholt; sonst Cache.
- **Multi-LCD-Setup**: das gesamte Surface-Array (`IMyTextSurface[]`)
  ist gecacht. Beim Schreiben des Skripts auf 6 LCDs: vorher bis zu
  6 Fetches pro Tick — jetzt nur beim ersten Mal.
- **Aggregator-Widget**: `List<IMyBatteryBlock>` etc. ist
  Class-Feld, wird mit `Clear()` + `GetBlocksOfType()` pro Tick
  aktualisiert (List-Reuse statt `new` jedes Tick).
- **StringBuilder** für LCD-Status-Ausgabe ist Class-Feld
  (`readonly _sb`), `Clear()` statt `new` pro Tick.

### Hinzugefügt (LCD-i18n Phase 3 — komplett)
- **Neue Datei `src/js/lcd/i18n_en.js`** mit Maps für: Widget-
  Labels (19), Field-Labels (~90, common + widget-specific),
  Hints, Select-Optionen (align/format/blink/icon/aggregateType/
  mode/clock_format), Gruppen-Labels, Themes, Presets,
  Resolutions, numerische + boolean Datenquellen.
- **Helper-Funktionen** `getLcdWidgetLabel`, `getLcdFieldLabel`,
  `getLcdHintLabel`, `getLcdOptionLabel`, `getLcdGroupLabel`,
  `getLcdThemeLabel`, `getLcdPresetMeta`, `getLcdResolutionLabel`,
  `getLcdSourceLabel`, `getLcdBoolSourceLabel` — alle mit
  DE-Fallback.
- **LCD-Composer-UI** (Widget-Add-Buttons, Theme-Buttons,
  Preset-Dropdown, Resolution-Dropdown, Field-Labels in
  Widget-Editoren, „LIVE-VORSCHAU", „EBENEN", „Position & Größe",
  „— Display ist leer —" etc.) ist jetzt komplett DE/EN-fähig.

### Geändert (Update-Modi de-emphasis)
- Reihenfolge im Exec-Mode-Dropdown umgestellt:
  Argument → 100 Ticks → 10 Ticks → 1 Sek → ⚠ Continuous (Update1).
  Sparsame Modi nach oben, Update1 als letzte Option mit
  Warnung im Hilfetext (rot, fett).

### Hinzugefügt (Klartext-Modal)
- **Output-Pane ist nicht mehr manuell selektierbar** (`user-select:
  none`). Verhindert, dass HTML-Markup aus dem Syntax-Highlighting
  beim manuellen Selektieren in die Zwischenablage rutscht.
- **Neuer „📄 Klartext"-Button** neben Copy/Download öffnet ein
  themed Modal mit dem reinen Code in einem `user-select: text`-
  Container. Wer einzelne Zeilen kopieren möchte, kann das dort
  bedenkenlos tun.

### Hinzugefügt
- i18n-Keys für Generator-Kommentare (`gen.cmt.fields`,
  `gen.cmt.ensure`, `gen.cmt.lcd_status_optional`,
  `gen.cmt.lcd_block_404`, `gen.cmt.agg_count_word` etc.).

### Quellen
- Discord-Feedback Malware, Digi, itbemeagain (Mai 2026)
- https://spaceengineers.wiki.gg/wiki/Scripting/Do%27s_and_Don%27ts
- https://spaceengineers.wiki.gg/wiki/Scripting/Coroutines_-_Run_operations_over_multiple_ticks
  (Coroutines bewusst zurückgestellt — passt nicht zum aktuellen
  One-Shot-Charakter, kommt in späterem MAJOR-Release.)

## [2.0.0] — 2026-05-12

### Hinzugefügt (Öffentliche Veröffentlichung)
- **LICENSE**: GNU General Public License v3.0 (Volltext im Repo).
- **Steam-Guide** (`docs/steam_guide.txt`) — englisch, mit Steam-
  Forum-BBCode, sofort copy-paste-fertig für einen Steam-Workshop-
  oder Forum-Post.
- **GitHub-Pages-URL** als Live-Version-Link in der README.

### Geändert
- **README.md** komplett auf Veröffentlichung getrimmt: GPL-Lizenz-
  Block mit Copyright, Disclaimer für Keen, alle internen
  Server-/Deployment-Details entfernt.
- **ARCHITECTURE.md** aktualisiert: aktueller Modul-Baum, neue
  Erklärungen zu Block-Gruppen, Multi-LCD und Persistenz.
- **Deploy-Workflow** anonymisiert: keine Hostnamen, generische
  Secret-Namen (`DEPLOY_*` statt provider-spezifischer Namen),
  GH-Pages als Alternative empfohlen.

### Entfernt
- Alle KI-/Kontext-Doku aus dem Repo. Lokale Entwicklungs-Files
  bleiben über `.gitignore` ausserhalb des öffentlichen Repos.

## [1.8.0] — 2026-05-12

### Hinzugefügt (Mehrsprachigkeit Phase 2.2 — komplettes EN-Set)
- **Alle 514 Condition-/Action-Labels** englisch verfügbar
  (Sensor: „Etwas erkannt" → „Detected something"; Cockpit:
  „Handbremse umschalten" → „Toggle handbrake"; etc.).
  Neue Datei `src/js/blocks/i18n_en_items.js` mit der `ITEMS_EN`-Map.
- **Alle ~280 Tooltip-Texte** in `DESCRIPTIONS` englisch verfügbar
  plus 4 gemeinsame Inventar-Tooltips. Neue Datei
  `src/js/blocks/i18n_en_descriptions.js` mit `DESCRIPTIONS_EN` und
  `_COMMON_DESCRIPTIONS_EN`.
- **Sprach-Fallback-Kette**: Aktive Sprache → DE-Original → Common-Map.
  Falls eine EN-Übersetzung einmal fehlt, springt die UI elegant auf
  den deutschen Text.

### Geändert
- `localizedItemLabel(item, blockType, kind)` ist jetzt 3-stellig
  und liest aus `ITEMS_EN`. `condOptions()`/`actOptions()` reichen
  `blockType` und `kind` durch.
- `getDescription()` ist sprach-aware mit 2-stufigem Fallback.

### Vollständigkeit-Audit
- 248 Conditions + 266 Actions = **514 Item-Labels** alle EN.
- **514** Tooltip-Lookups (gleiche Items) liefern alle einen
  EN-Text (entweder block-spezifisch oder via Common-Fallback).

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
