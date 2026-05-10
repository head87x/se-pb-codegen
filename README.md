# SE.PB Code Generator

Ein lokal laufendes Web-Tool, das aus visuellen Bausteinen (WENN/DANN/SONST) fertigen
C#-Code für den **Programmable Block** in Space Engineers generiert.

Du klickst dir per Dropdown zusammen, welcher Block-Typ (Sensor, Kolben, Tür, Rotor,
Akku, ...) was prüfen oder tun soll — und das Tool spuckt dir den fertigen Code aus,
den du nur noch in den PB einfügen musst.

---

## Quickstart

1. `index.html` im Browser öffnen (Doppelklick reicht, läuft komplett offline).
2. Links Bausteine konfigurieren.
3. Rechts den generierten Code mit **⧉ Kopieren** in die Zwischenablage holen.
4. In Space Engineers: Programmable Block → **Edit** → Code reinpasten →
   **Check Code** → **Remember & Exit**.

Keine Installation, kein Build, keine Dependencies. Eine einzige HTML-Datei.

---

## Features

- **Über 17 Block-Typen** mit jeweils mehreren Bedingungen und Aktionen
  (Sensor, Kolben, Tür, Rotor, Connector, Sortierer, Thruster, Gyro, Cockpit,
  Akku, Tank, Lichter, Soundblock, Timer, PB, Warhead, Waffen, Landing Gear).
- **Custom-Modus**: für alles, was nicht im Katalog ist — beliebige `ApplyAction`,
  `SetValueBool/Float` oder roher C#-Code mit `{v}` als Block-Platzhalter.
- **Verschachtelte Bedingungen** mit UND/ODER-Verknüpfung.
- **SONST-Zweig** (else-Block).
- **5 Ausführungsmodi**: manuell (Argument/Button), kontinuierlich,
  alle 1s / 10 Ticks / 100 Ticks.
- **LCD-Status-Ausgabe**: live-Anzeige der ausgewerteten Bedingungen und
  ausgeführten Aktionen auf einem LCD-Block.
- **Vorlagen** speichern/laden im Browser (LocalStorage).
- **Syntax-Highlighting** im Output.
- **Download** als `.cs`-Datei oder direkt **Kopieren**.

---

## Bedienung

### Workflow für ein typisches Skript

Beispiel: "Wenn Sensor X jemanden erkennt, Hangartor öffnen, sonst schließen."

1. **AUSFÜHRUNG** → `Alle 10 Ticks (Update10)` wählen (für reaktives Verhalten).
2. **WENN** → `+ Bedingung`
   - Block-Typ: `Sensor`
   - Block-Name: `Sensor 1` (exakt wie im Spiel-Terminal!)
   - Prüfung: `Etwas erkannt?`
3. **DANN** → `+ Aktion`
   - Block-Typ: `Tür (Door)`
   - Block-Name: `Hangar Door`
   - Aktion: `Öffnen`
4. **SONST** → `+ Aktion`
   - Block-Typ: `Tür (Door)`, Block-Name: `Hangar Door`, Aktion: `Schließen`
5. Rechts erscheint live der fertige Code. **⧉ Kopieren** → in PB einfügen.

### Block-Namen

Block-Namen müssen **exakt** mit dem Namen im Space-Engineers-Terminal übereinstimmen
(Groß-/Kleinschreibung, Leerzeichen). Tipp: im Spiel den Block im Terminal anklicken
und den Namen aus dem Feld oben kopieren.

### Mehrere Bedingungen

Sobald eine zweite Bedingung hinzukommt, erscheint zwischen ihnen ein **UND/ODER**-
Dropdown. Die Bedingungen werden in der angezeigten Reihenfolge ausgewertet:

```
Bedingung1 AND Bedingung2 OR Bedingung3   ⇒   (b1) && (b2) || (b3)
```

Hinweis: C# wertet `&&` vor `||` aus. Für komplexe Klammerung den Custom-Modus
nutzen (siehe unten).

### Custom-Modus

Wähle Block-Typ **`Custom (selbst eintragen)`** für:

- Block-Typen, die nicht im Katalog sind (z.B. Refinery, Assembler, Antenna).
- Beliebige `ApplyAction("...")`-Aufrufe.
- `SetValueBool` / `SetValueFloat` für Properties, die das Tool nicht direkt anbietet.
- Rohen C#-Code (mit `{v}` als Platzhalter für die Block-Referenz).

Beispiele für rohen Code im Custom-`rawCode`-Feld:
```csharp
{v}.Enabled = !{v}.Enabled;                          // Toggle
{v}.ApplyAction("OnOff_On");                         // Action-by-Name
((IMyAssembler){v}).Mode = MyAssemblerMode.Disassembly;
```

### LCD-Status

Aktivierst du **LCD STATUS-AUSGABE** und gibst einen Block-Namen ein, generiert
das Tool zusätzlichen Code, der bei jedem Durchlauf den Status aufs LCD schreibt
(und parallel via `Echo()` ins PB-Terminal):

```
=== STATUS ===
Tick: 14:23:05
Bedingung: ERFÜLLT
DO: Hangar Door → Öffnen
```

### Vorlagen

- **+ Speichern**: aktuelle Konfiguration unter einem Namen ablegen.
- Klick auf eine Vorlagen-Chip lädt sie wieder.
- Vorlagen liegen im Browser-LocalStorage (also pro Browser/Profil getrennt;
  bei Browser-Wechsel oder Inkognito sind sie weg).

---

## Architektur

Siehe [`ARCHITECTURE.md`](./ARCHITECTURE.md) für Code-Struktur, Datenmodell und
Erweiterungs-Anleitung.

Siehe [`CLAUDE.md`](./CLAUDE.md) für die Anleitung an Claude Code, wenn du mit
KI-Unterstützung weiterentwickelst.

---

## Weiterentwicklung — Ideen

- Mehr Block-Typen im Katalog (Refinery, Assembler, Cargo, Antenne, Camera,
  Projector, Welder, Grinder ...).
- **Block-Gruppen** unterstützen (`GetBlockGroupWithName` statt einzelner Blöcke).
- **Mehrere unabhängige WENN/DANN-Blöcke** in einem Skript (statt nur eines).
- Export als Steam-Workshop-Skript (mit Header und Metadaten).
- Import-Funktion: vorhandenes PB-Skript einlesen und in Bausteine zurückwandeln
  (sehr ambitioniert, vermutlich nur für selbstgeneriete Skripte realistisch).
- Dark/Light-Theme-Toggle.
- Mehrsprachigkeit (aktuell DE; Strings sind im HTML hardcodiert).

---

## Lizenz / Nutzung

Privat nutzbar, gerne erweitern. Space Engineers © Keen Software House.
Dieses Tool ist inoffiziell und steht in keiner Verbindung zu Keen.
