// ============================================================
// HILFE-SYSTEM (v3.1.0)
// ============================================================
// Zentrale Hilfe-Doku im Workshop/Tutorial-Stil, zweisprachig.
// Wird vom „❓ Hilfe"-Button im Header oder vom kleinen ❓ pro
// Sektion via `showHelp(sectionId)` (in modal.js) geöffnet.
//
// Struktur:
//   HELP_SECTIONS = [{ id, icon }, ...]  → Reihenfolge im Inhaltsverzeichnis
//   HELP_DE / HELP_EN = { [id]: { title, body }, ... }  → Inhalt pro Sprache
//
// `body` ist HTML (wird im Modal direkt eingesetzt). Erlaubt: h3, p, ul/li,
// code, strong, em, br. Keine User-Eingaben hier — kein XSS-Risiko.
// ============================================================

const HELP_SECTIONS = [
  { id: "overview",     icon: "🛠" },
  { id: "firststeps",   icon: "▶" },
  { id: "templates",    icon: "💾" },
  { id: "share",        icon: "🔗" },
  { id: "info",         icon: "📋" },
  { id: "exec",         icon: "⚙" },
  { id: "conditions",   icon: "❓" },
  { id: "blocksource",  icon: "🧩" },
  { id: "aggregator",   icon: "Σ" },
  { id: "actions",      icon: "▶" },
  { id: "lcdtext",      icon: "📝" },
  { id: "lcdcomposer",  icon: "🖼" },
  { id: "lcdwidgets",   icon: "📊" },
  { id: "lcdmulti",     icon: "🖥" },
  { id: "code",         icon: "</>" },
  { id: "ingame",       icon: "🎮" }
];

// ============================================================
// DEUTSCH
// ============================================================

const HELP_DE = {

  overview: {
    title: "Was ist dieses Tool?",
    body: `
<p>Der <strong>SE.PB Code Generator</strong> ist ein Web-Tool, mit dem du
C#-Skripte für den <em>Programmable Block</em> in Space Engineers
zusammenklicken kannst — <strong>ganz ohne Programmierkenntnisse</strong>.</p>

<p>Du baust dir per visuellem Baukasten zusammen:</p>
<ul>
  <li><strong>WENN</strong> bestimmte Bedingungen erfüllt sind (z. B. „Sensor 1 ist aktiv")</li>
  <li><strong>DANN</strong> sollen bestimmte Aktionen passieren (z. B. „Tür öffnen, Lampen an")</li>
  <li><strong>SONST</strong> (optional) sollen andere Aktionen passieren</li>
</ul>

<p>Das Tool generiert daraus den fertigen C#-Code, den du nur noch in
den Programmable Block im Spiel kopierst. Du kannst zusätzlich grafische
LCD-Displays gestalten, Vorlagen speichern, in andere Sprachen umschalten
und vieles mehr.</p>

<h3>Das Tool macht NICHT</h3>
<ul>
  <li>Es schickt nichts ins Internet — alles läuft lokal in deinem Browser.</li>
  <li>Es spielt nicht selbst Space Engineers — du musst den generierten
      Code im Spiel selbst einfügen.</li>
  <li>Es verändert keine Spielstände oder Mods.</li>
</ul>

<h3>Wer hat das gebaut?</h3>
<p><strong>head87x</strong> (Steam-Name). Open Source auf GitHub:
<code>github.com/head87x/se-pb-codegen</code>.</p>
`
  },

  firststeps: {
    title: "Erste Schritte (Quickstart)",
    body: `
<p>Ein einfaches Beispiel: „Wenn Sensor 1 jemanden erkennt, öffne Tür 1".</p>

<h3>Schritt 1 — Bedingung anlegen</h3>
<ol>
  <li>Klick auf <strong>„+ Bedingung"</strong> in der Sektion <em>WENN</em>.</li>
  <li>Wähle <strong>Block-Typ: Sensor</strong>.</li>
  <li>Trage den genauen Namen ein, den der Block im Spiel-Terminal hat,
      z. B. <code>Sensor 1</code>. (Groß-/Kleinschreibung beachten!)</li>
  <li>Lass die <strong>Block-Quelle</strong> auf „Einzelblock".</li>
  <li>Bei <strong>Prüfung</strong>: „Ist aktiv".</li>
</ol>

<h3>Schritt 2 — Aktion anlegen</h3>
<ol>
  <li>Klick auf <strong>„+ Aktion"</strong> in der Sektion <em>DANN</em>.</li>
  <li>Wähle <strong>Block-Typ: Tür</strong>.</li>
  <li>Block-Name: <code>Tür 1</code>.</li>
  <li>Bei <strong>Aktion</strong>: „Öffnen".</li>
</ol>

<h3>Schritt 3 — Code holen</h3>
<p>Im rechten Panel siehst du den fertigen C#-Code. Klick auf
<strong>„📋 Kopieren"</strong> oben rechts.</p>

<h3>Schritt 4 — Im Spiel einfügen</h3>
<ol>
  <li>Geh zu deinem Programmable Block in Space Engineers.</li>
  <li>Klick <em>„Edit"</em> oder <em>„Bearbeiten"</em>.</li>
  <li>Lösch den vorhandenen Code und füge unseren ein (Strg+V).</li>
  <li>Klick <em>„Check Code"</em> → <em>„OK"</em> → <em>„Recompile"</em>.</li>
</ol>

<p>Fertig! Jetzt öffnet sich Tür 1, wenn jemand Sensor 1 auslöst.</p>

<h3>Was, wenn ich es ändern will?</h3>
<p>Du bearbeitest hier im Tool, klickst wieder „📋 Kopieren", fügst es
im Spiel ein und drückst „Recompile". Der Programmable Block lädt das
Skript dann neu.</p>

<h3>Tipps für den Anfang</h3>
<ul>
  <li>Beginne mit <em>einer</em> Bedingung und <em>einer</em> Aktion.
      Erweitere später.</li>
  <li>Speichere deine Konfiguration als <strong>Vorlage</strong>
      (siehe Sektion „Vorlagen") — dann musst du sie nicht jedes Mal neu bauen.</li>
  <li>Bei Fehlern im Spiel: oft ein falscher Block-Name. Prüfe ob er
      genau so im Terminal steht.</li>
</ul>
`
  },

  templates: {
    title: "Vorlagen — Speichern, Laden, Export/Import",
    body: `
<p>Vorlagen sind <strong>komplette Konfigurationen</strong>, die du speichern
und später wieder laden kannst — z. B. „Auto-Tür-Sensor",
„Strom-Management", „Bohrgrid-Steuerung".</p>

<h3>Vorlage speichern</h3>
<p>Bau deine Konfiguration zusammen, dann klick
<strong>„+ Speichern"</strong>. Gib einen Namen ein. Die Vorlage
landet in deinem Browser (LocalStorage) — sie ist nur in
<strong>diesem Browser</strong> auf <strong>diesem Gerät</strong>
verfügbar.</p>

<h3>Vorlage laden</h3>
<p>Klick auf den Namen einer gespeicherten Vorlage. Sie überschreibt
deine aktuelle Konfiguration.</p>

<h3>Vorlage löschen</h3>
<p>Klick auf das <strong>✕</strong> rechts neben dem Namen.</p>

<h3>Neu anfangen</h3>
<p><strong>„⟲ Neu"</strong> setzt alles auf leer zurück — Bedingungen,
Aktionen, LCD-Konfiguration. Wird nochmal bestätigt vorher.</p>

<h3>Export — Vorlagen als Datei teilen</h3>
<p>Mit <strong>„⤴ Export"</strong> lädst du alle gespeicherten Vorlagen
als <code>.json</code>-Datei runter (Dateiname:
<code>se-pb-templates-YYYY-MM-DD.json</code>). Diese Datei kannst du:</p>
<ul>
  <li>Auf ein anderes Gerät übertragen</li>
  <li>An Freunde schicken</li>
  <li>Als Backup behalten</li>
</ul>

<h3>Import — Vorlagen aus Datei laden</h3>
<p>Klick <strong>„⤵ Import"</strong> → wähle eine
<code>.json</code>-Datei → bestätige. Die Vorlagen aus der Datei werden
zu deiner Liste hinzugefügt. <strong>Bestehende Vorlagen werden nicht
überschrieben</strong> — bei Namens-Konflikt bekommt der Import
ein <code>(2)</code> angehängt.</p>

<h3>Was, wenn ich den Browser wechsele?</h3>
<p>Export nicht vergessen! LocalStorage ist pro Browser. In einem neuen
Browser sind keine Vorlagen vorhanden, bis du die JSON-Datei importierst.</p>
`
  },

  share: {
    title: "Share-Token — komplette Konfiguration als Text",
    body: `
<p>Ein <strong>Share-Token</strong> ist deine gesamte aktuelle Konfiguration
(Bedingungen + Aktionen + LCD + Einstellungen) als <strong>einzelner Text-String</strong>.
Anders als Vorlagen liegt der Token nicht im Browser, sondern wird ad hoc erzeugt
und kann überall hin kopiert werden.</p>

<h3>Token erzeugen</h3>
<ol>
  <li>Bau deine Konfiguration zusammen.</li>
  <li>Klick <strong>„💾 Token erzeugen"</strong>.</li>
  <li>Im Textfeld erscheint ein langer Base64-String. Markieren + kopieren.</li>
</ol>

<h3>Token laden</h3>
<ol>
  <li>Füge einen Token in das Textfeld ein.</li>
  <li>Klick <strong>„📥 Token laden"</strong>.</li>
  <li>Bestätige den Dialog. Deine aktuelle Konfiguration wird überschrieben.</li>
</ol>

<h3>Wo ist der Unterschied zu Vorlagen?</h3>
<ul>
  <li><strong>Vorlagen</strong> liegen im Browser, persistieren über Sitzungen
      hinweg, sind benannt. Best für deine eigene Sammlung.</li>
  <li><strong>Token</strong> sind ein einmaliger Snapshot als Text-String.
      Best zum <em>Teilen</em> (z. B. im Discord, Forum, per Mail).</li>
</ul>

<h3>Tipps</h3>
<ul>
  <li>Tokens sind Versions-getaggt. Wenn jemand einen Token aus einer
      neueren Tool-Version schickt, kommt eine Warnung — Import wird
      trotzdem versucht (Felder, die das ältere Tool nicht kennt, werden
      ignoriert).</li>
  <li>Token-Länge: ca. 1–10 KB je nach Konfigurations-Größe.</li>
</ul>
`
  },

  info: {
    title: "Skript-Info — Workshop-Metadaten",
    body: `
<p>Diese Sektion (optional) trägt zusätzliche Metadaten in den
<strong>Header des generierten Codes</strong> ein, damit dein Skript bei
einer Steam-Workshop-Veröffentlichung professionell wirkt und der
Autor nachvollziehbar ist.</p>

<h3>Was passiert ohne diese Sektion?</h3>
<p>Auch ohne Skript-Info bekommt der generierte Code <strong>immer</strong>
einen Header mit Tool-Name, Version, GitHub-URL und Generierungs-Datum.
Das ist die <em>Attribution</em> und nicht abschaltbar.</p>

<h3>Was passiert mit dieser Sektion?</h3>
<p>Wenn du den Toggle <strong>„Metadaten in Header einfügen"</strong>
aktivierst, erscheint im Code-Header zusätzlich ein „WORKSHOP METADATEN"-Block
mit allen ausgefüllten Feldern:</p>
<ul>
  <li><strong>Skript-Name</strong> — z. B. „Auto-Defense System"</li>
  <li><strong>Autor</strong> — dein Steam-Name oder Pseudonym</li>
  <li><strong>Version</strong> — z. B. „1.0", „2.3"</li>
  <li><strong>Tags</strong> — komma-getrennt, z. B. „defense, automation, lcd"</li>
  <li><strong>Beschreibung</strong> — mehrzeilig, was das Skript macht</li>
</ul>

<h3>Beispiel-Output</h3>
<p>Im generierten <code>.cs</code> oben:</p>
<pre>/* =====================================================
 * SPACE ENGINEERS - PROGRAMMABLE BLOCK SCRIPT
 * =====================================================
 * Generated with: SE.PB Code Generator v3.0.1
 * Project URL:    https://github.com/head87x/se-pb-codegen
 * Tool by:        head87x
 * Generated on:   2026-05-14
 *
 * ----- WORKSHOP METADATEN -----
 * Skript-Name:   Auto-Defense System
 * Autor:         PlayerName
 * Version:       1.0
 * Tags:          defense, automation
 * Beschreibung:  Schaltet Gatling-Turrets auf Auto,
 *                wenn Sensoren Feindkontakt melden.
 * ===================================================== */</pre>

<h3>Wozu das gut ist</h3>
<ul>
  <li>Wenn jemand dein Skript anschaut, sieht er sofort wer es gemacht hat.</li>
  <li>Für Workshop-Uploads ist es professioneller.</li>
  <li>Bei Updates kannst du die Version hochzählen.</li>
</ul>
`
  },

  exec: {
    title: "Ausführung — Wie oft läuft das Skript?",
    body: `
<p>Programmable Blocks in Space Engineers können auf verschiedene Arten
ihre Aktionen ausführen. In dieser Sektion stellst du das ein.</p>

<h3>Ausführungs-Modi</h3>
<ul>
  <li><strong>Manuell (per Argument / Button)</strong> — das Skript läuft
      nur, wenn du es im Spiel manuell triggerst (z. B. per Aktions-Leiste
      oder Toolbar-Button). Sehr sparsam, aber reagiert nicht von selbst.</li>
  <li><strong>Alle 100 Ticks (Update100)</strong> — etwa alle 1,6 Sekunden
      (60 Ticks/Sek im Spiel). Sparsamste automatische Variante.</li>
  <li><strong>Alle 10 Ticks (Update10)</strong> — etwa 6 mal pro Sekunde.
      Guter Kompromiss für Sensoren, Türen.</li>
  <li><strong>Alle 1 Sekunde (Update100)</strong> — eine eigene
      Frequenz-Variante (intern Update100, kann aber je nach Use-Case
      passen).</li>
  <li><strong>⚠ Kontinuierlich (jeden Tick)</strong> — 60 mal pro Sekunde!
      Nur nutzen wenn wirklich nötig (z. B. für Auto-Pilot-Steuerung),
      sonst kostet das Performance.</li>
</ul>

<h3>🔄 Coroutines verwenden</h3>
<p>Eine fortgeschrittene Option: <strong>verteilt LCD-Updates über mehrere
Ticks</strong>. Wenn du viele LCDs oder Aggregator-Widgets hast, kann das
Skript zu komplex pro Tick werden und Space Engineers wirft den Fehler
„Script too complex".</p>
<p>Coroutines lösen das, indem sie pro Tick nur einen Teil zeichnen.
Trade-off: LCDs aktualisieren nicht alle gleichzeitig, sondern eines
nach dem anderen.</p>
<p><strong>Wann aktivieren?</strong> Bei Multi-LCD 3×3 oder mehr, oder wenn
du den „too complex"-Fehler bekommst.</p>

<h3>🛡 Auto-Recovery zerstörter Blöcke</h3>
<p>Standard-Verhalten seit v2.11.0: Das Skript holt sich die Block-Referenzen
einmalig beim Start (oder bei „Recompile" im Spiel). Wenn ein Block dann
im Gefecht zerstört wird, hat das Skript einen ungültigen Verweis und kann
Fehler werfen — du drückst dann manuell „Recompile" am Programmable Block.</p>
<p>Mit dem Toggle <strong>„Auto-Recovery"</strong> prüft das Skript pro
Durchlauf, ob Blöcke noch existieren, und holt sie ggf. neu. Bringt einen
Performance-Overhead, ist aber sinnvoll für Skripte die dauerhaft laufen
und mit Block-Verlust umgehen müssen (Verteidigungsanlagen, Bohrer-Setups).</p>
`
  },

  conditions: {
    title: "WENN — Bedingungen",
    body: `
<p>Bedingungen sind das <strong>„wenn"</strong> in „wenn dies, dann jenes".
Sie prüfen den Zustand eines Blocks (oder mehrerer) und liefern Ja oder Nein.</p>

<h3>Bedingung anlegen</h3>
<p>Klick <strong>„+ Bedingung"</strong> oder ziehe einen Block aus der
Block-Palette links ins WENN-Feld.</p>

<h3>Felder pro Bedingung</h3>
<ul>
  <li><strong>Block-Typ</strong> — die Art von Block (Tür, Sensor, Akku, …)</li>
  <li><strong>Block-Name</strong> — exakter Name im Spiel-Terminal (nicht
      bei „Alle Blöcke vom Typ")</li>
  <li><strong>Block-Quelle</strong> — Einzelblock / Block-Gruppe / Alle vom Typ
      (siehe eigene Hilfe-Sektion)</li>
  <li><strong>Prüfung</strong> — was genau geprüft wird (z. B. „Ist offen",
      „Output > X kW")</li>
  <li>Optional ein Argument-Feld, wenn die Prüfung einen Wert braucht
      (z. B. „X" für „Ladung > X %")</li>
</ul>

<h3>Mehrere Bedingungen kombinieren</h3>
<p>Wenn du mehr als eine Bedingung hast, erscheint dazwischen ein
<strong>UND / ODER</strong>-Selektor:</p>
<ul>
  <li><strong>UND (AND)</strong> — beide Bedingungen müssen erfüllt sein</li>
  <li><strong>ODER (OR)</strong> — mindestens eine muss erfüllt sein</li>
</ul>

<h3>Reihenfolge / Priorität</h3>
<p>C# wertet <strong>UND vor ODER</strong> aus. Beispiel:
<code>A ODER B UND C</code> bedeutet <code>A ODER (B UND C)</code>.
Wenn du anders klammern willst, brauchst du aktuell den Custom-Modus
(geplant für späteres Update: explizite Klammerung).</p>

<h3>Bedingungs-Validierung</h3>
<p>Bei Block-Namen achten wir auf:</p>
<ul>
  <li>Leer (rot, ⚠) — wird ignoriert beim Generieren</li>
  <li>Leerzeichen am Anfang/Ende (gelb, ⚠) — meist Tippfehler</li>
  <li>Unsichtbare Steuerzeichen (gelb, ⚠) — passiert beim Kopieren aus Discord</li>
</ul>

<h3>Tooltip am ⓘ-Symbol</h3>
<p>Neben dem <strong>Prüfung</strong>-Dropdown gibt's ein ⓘ — Maus drüber
zeigt Details was die Prüfung intern macht.</p>
`
  },

  blocksource: {
    title: "Block-Quellen — Einzelblock / Gruppe / Alle vom Typ",
    body: `
<p>Pro Bedingung oder Aktion kannst du wählen, <strong>woher die Blöcke kommen</strong>.
Drei Modi stehen zur Auswahl:</p>

<h3>Einzelblock</h3>
<p>Du gibst den <strong>exakten Namen</strong> eines einzelnen Blocks ein.
Beispiel: <code>Tür Cockpit</code>. Standardfall, einfachste Variante.</p>

<h3>Block-Gruppe</h3>
<p>Du gibst den Namen einer <strong>Gruppe</strong> ein, die du im Spiel
über das Terminal angelegt hast (Strg+Klick mehrere Blöcke → „Gruppe
erstellen"). Beispiel: <code>Frontlampen</code> mit 6 Lampen drin.</p>
<p>Vorteil: Du kannst im Spiel jederzeit Mitglieder zur Gruppe hinzufügen
oder entfernen — das Tool muss nicht neu generiert werden.</p>

<h3>Alle Blöcke vom Typ</h3>
<p>Das Tool sucht <strong>alle Blöcke eines Interface-Typs</strong> auf dem
Grid — ohne dass du eine Gruppe anlegen musst. Beispiel: alle Solarpanels,
alle Türen, alle Akkus. Kein Name nötig.</p>
<p>Damit funktioniert z. B. „Wenn die Summe aller Solar-Outputs > 50 kW".</p>

<h3>„Nur dieser Construct (kein Subgrid)"</h3>
<p>Bei „Alle Blöcke vom Typ" erscheint diese Checkbox (Default an).</p>
<p>Was sind Subgrids? Wenn dein Schiff <strong>Rotoren, Pisten oder Hangars</strong>
hat, hängen daran weitere Grids dran (Rotor-Kopf, Pisten-Spitze, Hangar-Inneres).
Standardmäßig zählt „Alle Blöcke vom Typ" diese mit.</p>
<p>Beispiele wann <strong>einschalten</strong> (Default):</p>
<ul>
  <li>Du hast einen Bohrer-Arm an einem Rotor — und willst NICHT die
      Bohrer am Subgrid mitzählen, sondern nur den Hauptbohrer am Schiff.</li>
  <li>Du hast Geschütz-Türme (Rotor + Kanone) — und willst nur die
      Kanonen am Hauptschiff, nicht am Subgrid des Turms.</li>
</ul>
<p>Beispiele wann <strong>ausschalten</strong>:</p>
<ul>
  <li>Du willst alle Geschütze inkl. Subgrid-Türme zusammenrechnen.</li>
  <li>Du willst die Solarpanels eines beweglich gelagerten Panel-Arms
      mitzählen.</li>
</ul>

<h3>Aggregator bei Gruppe und Typ</h3>
<p>Bei „Block-Gruppe" oder „Alle Blöcke vom Typ" erscheint ein zusätzlicher
<strong>Aggregator</strong>-Selektor (siehe eigene Hilfe-Sektion). Damit
entscheidest du, wie aus mehreren Blöcken eine Ja/Nein-Antwort wird
(z. B. Summe, Durchschnitt, mindestens einer, alle, …).</p>
`
  },

  aggregator: {
    title: "Aggregator — Wie viele Blöcke zählen?",
    body: `
<p>Wenn du eine Bedingung auf mehrere Blöcke gleichzeitig anwendest
(Block-Gruppe oder „Alle Blöcke vom Typ"), brauchst du eine Regel,
wie aus den Einzel-Werten <strong>eine</strong> Ja/Nein-Antwort wird.
Diese Regel heißt <em>Aggregator</em>.</p>

<h3>Die 7 Modi</h3>
<table>
  <tr>
    <th>Modus</th><th>Was er macht</th><th>Beispiel</th>
  </tr>
  <tr>
    <td><strong>Any (Mindestens einer)</strong></td>
    <td>Mindestens EIN Block erfüllt die Bedingung</td>
    <td>„Wenn IRGENDEINE Tür offen ist"</td>
  </tr>
  <tr>
    <td><strong>All (Alle)</strong></td>
    <td>ALLE Blöcke erfüllen die Bedingung</td>
    <td>„Wenn ALLE Türen geschlossen sind"</td>
  </tr>
  <tr>
    <td><strong>Count (Anzahl)</strong></td>
    <td>Wie viele Blöcke erfüllen die Bedingung — vergleichen mit Schwellwert</td>
    <td>„Wenn MINDESTENS 3 Akkus unter 20 % geladen sind"</td>
  </tr>
  <tr>
    <td><strong>Sum (Summe)</strong></td>
    <td>Alle Werte zusammenrechnen, dann vergleichen</td>
    <td>„Wenn SUMME aller Solar-Outputs &gt; 50 kW"</td>
  </tr>
  <tr>
    <td><strong>Avg (Durchschnitt)</strong></td>
    <td>Mittelwert berechnen, dann vergleichen</td>
    <td>„Wenn DURCHSCHNITT der Akku-Ladung &lt; 30 %"</td>
  </tr>
  <tr>
    <td><strong>Min (Minimum)</strong></td>
    <td>Den kleinsten Wert finden, dann vergleichen</td>
    <td>„Wenn der SCHWÄCHSTE Akku &lt; 10 %" → einer kritisch leer</td>
  </tr>
  <tr>
    <td><strong>Max (Maximum)</strong></td>
    <td>Den größten Wert finden, dann vergleichen</td>
    <td>„Wenn der STÄRKSTE Akku = 100 %" → einer voll geladen</td>
  </tr>
</table>

<h3>Operator und Schwellwert</h3>
<p>Bei Count/Sum/Avg/Min/Max wählst du zusätzlich einen <strong>Operator</strong>
(<code>&gt;</code>, <code>≥</code>, <code>&lt;</code>, <code>≤</code>,
<code>=</code>, <code>≠</code>) und einen <strong>Schwellwert</strong>.</p>

<h3>Wann welcher Aggregator? — Praxis-Tipps</h3>
<ul>
  <li>Einfache Statussteuerung (Türen, Lampen): <strong>Any</strong> oder <strong>All</strong></li>
  <li>Akku-Alarm (es muss <em>einer</em> leer werden): <strong>Min</strong></li>
  <li>Cargo-Alarm (es muss <em>einer</em> voll werden): <strong>Max</strong></li>
  <li>Gesamtleistung Strom: <strong>Sum</strong></li>
  <li>Gesamtzustand „durchschnittlich leer": <strong>Avg</strong></li>
  <li>Mindestabsicherung („mind. 3 Reaktoren am laufen"): <strong>Count</strong></li>
</ul>

<h3>Beispiel: Wenn alle Solarpanels zusammen > 50 kW liefern</h3>
<ol>
  <li>Block-Typ: <code>Solarpanel</code></li>
  <li>Block-Quelle: <code>Alle Blöcke vom Typ</code></li>
  <li>Aggregator: <code>Sum</code></li>
  <li>Operator: <code>&gt;</code></li>
  <li>Schwellwert: <code>50</code></li>
  <li>Prüfung (welche Property): <code>Output > X kW</code> (X-Wert egal, wird ignoriert bei Sum)</li>
</ol>
<p>Das Tool generiert dann:
<code>_allSolarPanel_0.Sum(_b =&gt; _b.CurrentOutput * 1000f) &gt; 50f</code></p>

<h3>Hinweis: Property-Extraktion</h3>
<p>Für Sum/Avg/Min/Max nimmt das Tool aus deiner gewählten <em>Prüfung</em>
(z. B. „Output > X kW") nur den <strong>Property-Teil</strong> (also
<code>CurrentOutput</code>). Der Vergleichswert X aus der Prüfung wird in
diesem Modus ignoriert — stattdessen kommt der <strong>Schwellwert</strong>
zum Tragen. Bei <em>any/all/count</em> wird die volle Prüfung verwendet.</p>
`
  },

  actions: {
    title: "DANN / SONST — Aktionen",
    body: `
<p>Aktionen sind das <strong>„dann"</strong>: das was passieren soll, wenn die
Bedingungen wahr sind. <strong>SONST</strong> ist der Else-Zweig: was passiert,
wenn die Bedingungen NICHT wahr sind.</p>

<h3>Aktion anlegen</h3>
<p>Klick auf <strong>„+ Aktion"</strong> in <em>DANN</em> oder
<em>SONST</em>. Du kannst auch einen Block aus der Palette links ins
Feld ziehen.</p>

<h3>Felder pro Aktion</h3>
<ul>
  <li><strong>Block-Typ</strong></li>
  <li><strong>Block-Name</strong> (außer bei „Alle Blöcke vom Typ")</li>
  <li><strong>Block-Quelle</strong> — Einzelblock / Gruppe / Alle vom Typ</li>
  <li><strong>Aktion</strong> — die konkrete Operation (öffnen, schließen,
      einschalten, Helligkeit setzen, …)</li>
  <li>Optional Argument(e) wenn die Aktion einen Wert braucht
      (z. B. Helligkeit-Wert)</li>
</ul>

<h3>Aktionen auf mehreren Blöcken</h3>
<p>Bei Block-Gruppe oder „Alle vom Typ" wird die Aktion automatisch in
einer <code>foreach</code>-Schleife für jeden Block ausgeführt.
Beispiel: „Alle Türen schließen" → das Skript schließt jede Tür der Liste.</p>

<h3>Es gibt KEINE Bedingung in der Aktion</h3>
<p>Aktionen prüfen nichts — sie führen aus. Die Prüfung kommt in WENN.</p>

<h3>DANN ohne SONST</h3>
<p>SONST ist komplett optional. Du kannst Skripte bauen, die nur „WENN X
dann Y" sind, ohne Else-Zweig. Wenn die Bedingung nicht wahr ist, passiert
nichts.</p>

<h3>Beispiel mit SONST: Auto-Tür mit Bewegungsmelder</h3>
<ul>
  <li><strong>WENN</strong>: Sensor 1 ist aktiv</li>
  <li><strong>DANN</strong>: Tür Eingang → Öffnen</li>
  <li><strong>SONST</strong>: Tür Eingang → Schließen</li>
</ul>
<p>So bleibt die Tür offen während Bewegung erkannt wird und schließt
sobald der Sensor nichts mehr meldet.</p>
`
  },

  lcdtext: {
    title: "LCD Status-Ausgabe (Text)",
    body: `
<p>Die <strong>einfache Text-Ausgabe</strong> schreibt eine Statusmeldung
auf einen LCD-Block. Sie zeigt:</p>
<ul>
  <li>Aktuelle Uhrzeit (Tick)</li>
  <li>Ob die Bedingungen erfüllt sind</li>
  <li>Welche Aktionen gelaufen sind</li>
</ul>

<h3>Aktivieren</h3>
<ol>
  <li>Toggle <strong>„Aktivieren"</strong> anklicken.</li>
  <li>Block-Namen des LCDs eintragen (z. B. <code>LCD Status</code>).</li>
</ol>

<h3>Wann sinnvoll?</h3>
<ul>
  <li>Debug: schnell sehen ob das Skript was tut.</li>
  <li>Status-Schirm im Cockpit: einfache Übersicht ohne Schnickschnack.</li>
  <li>Erste Schritte: bevor du den großen LCD-Baukasten anfasst.</li>
</ul>

<h3>Unterschied zum LCD-Baukasten</h3>
<p>Die Text-Ausgabe ist ein <em>Mode-Text</em>-LCD, sehr simpel.
Der LCD-Baukasten dagegen erzeugt grafische Sprite-Outputs (Balken,
Donuts, Tachos, ...) — viel hübscher, aber komplexer einzurichten.</p>
<p>Du kannst <strong>beide gleichzeitig</strong> aktivieren: ein LCD mit
Text-Status, ein anderes mit Grafik-Composer.</p>

<h3>LCD-Block-Name finden</h3>
<p>Im Spiel: Terminal öffnen → LCD anklicken → der „Custom Name" oben
ist der Name den du hier brauchst. Achte auf Groß-/Kleinschreibung
und Leerzeichen.</p>
`
  },

  lcdcomposer: {
    title: "LCD-Baukasten — Grafische Displays",
    body: `
<p>Der <strong>LCD-Baukasten</strong> ist das große Tool für hübsche
Sprite-basierte Anzeigen: Balken, Donuts, Tachos, Listen, Aggregatoren
und mehr — alles per Drag & Drop positionierbar.</p>

<h3>Aktivieren</h3>
<ol>
  <li>Toggle <strong>„Aktivieren"</strong>.</li>
  <li><strong>Display-Quelle</strong> wählen:
    <ul>
      <li><em>Eigenständiges LCD</em> — ein normales LCD-Panel auf dem Schiff.
          Block-Namen eingeben.</li>
      <li><em>Programmable Block (dieser PB)</em> — das LCD im PB selbst
          (falls vorhanden, je nach Modell).</li>
      <li><em>Cockpit / Sitz / Remote</em> — eines der internen LCDs in einem
          Cockpit oder Sitz. Block-Name + Surface-Index nötig.</li>
    </ul>
  </li>
  <li><strong>LCD-Format</strong>: passend zu deinem Display
      (Standard LCD, Wide LCD, Corner LCD, Cockpit-Surface). Nur für die
      Vorschau wichtig — der generierte Code funktioniert mit jedem Format.</li>
</ol>

<h3>Widgets hinzufügen</h3>
<p>Klick auf einen der <strong>„+ Widget"</strong>-Buttons unter der
Live-Vorschau. Verschiedene Widgets stehen zur Wahl (siehe nächste Sektion
„LCD-Widgets im Detail").</p>

<h3>Widgets verschieben & ändern</h3>
<ul>
  <li><strong>Drag & Drop</strong> in der Live-Vorschau zum Positionieren.</li>
  <li>Klick auf ein Widget oder eine Layer-Liste-Zeile → Detail-Editor
      klappt auf.</li>
  <li><strong>Shift+Klick</strong> → Multi-Auswahl (mehrere Widgets gleichzeitig
      verschieben/löschen).</li>
  <li>Smart-Snap: Widgets rasten an Kanten / Mitten / anderen Widgets ein.</li>
</ul>

<h3>Themes</h3>
<p>Über der Vorschau gibt's <strong>Theme-Buttons</strong> (Standard, Alarm,
Cool, Warm, …). Ein Klick setzt alle Widget-Farben passend zum Theme um.</p>

<h3>Presets</h3>
<p>Vorgefertigte Widget-Kombinationen (z. B. „Ship Overview", „Power Panel").
Über das Preset-Dropdown laden → Widgets erscheinen automatisch.
<strong>Achtung</strong>: Preset-Laden überschreibt deine aktuellen Widgets.</p>

<h3>Sichtbarkeit</h3>
<p>Pro Widget gibt's einen 👁/⌀-Knopf in der Layer-Liste — versteckt das
Widget temporär (es bleibt in der Konfiguration, wird nur nicht gezeichnet).</p>
`
  },

  lcdwidgets: {
    title: "LCD-Widgets im Detail",
    body: `
<p>Im LCD-Baukasten gibt's verschiedene Widget-Typen. Hier eine kurze
Übersicht — Details findest du wenn du das Widget hinzufügst und im
Editor die Felder ansiehst.</p>

<h3>Text-Widgets</h3>
<ul>
  <li><strong>Header / Text</strong> — Überschrift oder freier Text.</li>
  <li><strong>Uhr</strong> — aktuelle Uhrzeit, verschiedene Formate.</li>
  <li><strong>Trennlinie</strong> — horizontaler Strich.</li>
</ul>

<h3>Status-Widgets (Boolean)</h3>
<ul>
  <li><strong>Punkt-Indikator</strong> — Ampel (rot/grün) für „aktiv ja/nein".</li>
  <li><strong>Checkliste</strong> — bis zu 6 Zeilen, jede mit ✓ oder ✗.</li>
</ul>

<h3>Numerische Widgets</h3>
<ul>
  <li><strong>Balken</strong> — horizontaler Füllstand 0–100 %.</li>
  <li><strong>Doppel-Balken</strong> — zwei Werte übereinander (z. B. Input/Output).</li>
  <li><strong>Donut (Kreis)</strong> — Kreis-Indikator, gut für Akku-Ladung.</li>
  <li><strong>Tacho</strong> — analoge Anzeige mit Skala.</li>
  <li><strong>Text-Wert</strong> — Zahl als Text, frei formatierbar.</li>
  <li><strong>Großer Wert</strong> — sehr große Zahl + Label.</li>
  <li><strong>Energie-Segmente</strong> — wie Akku-LEDs am Phone.</li>
  <li><strong>Symbol + Wert</strong> — Icon vorne, Zahl hinten.</li>
</ul>

<h3>Speziell</h3>
<ul>
  <li><strong>Aggregator</strong> — zeigt Summe/Avg/Min/Max von allen
      Blöcken eines Typs. Z. B. „Σ Solar-Output: 42.3 kW".</li>
  <li><strong>Spacer</strong> — leerer Bereich zum Trennen.</li>
  <li><strong>Custom-Text</strong> — beliebiger statischer Text.</li>
</ul>

<h3>Pro Widget einstellbar</h3>
<ul>
  <li><strong>Position & Größe</strong> — X, Y, Breite, Höhe in LCD-Pixeln.</li>
  <li><strong>Hintergrund</strong> — optional eine Hintergrund-Farbe.</li>
  <li><strong>Label / Text</strong> — die Beschriftung.</li>
  <li><strong>Block-Name</strong> — der Quell-Block für die Daten.</li>
  <li><strong>Datenquelle</strong> — welche Property gelesen wird
      (Akku-Ladung, Tank-Füllung, Geschwindigkeit, …).</li>
  <li><strong>Farben</strong> — Akzent + Hintergrund (R,G,B).</li>
</ul>

<h3>Tipp: Block-Namen-Validierung</h3>
<p>Auch in den Widget-Block-Name-Feldern greift die Live-Validierung
(rotes ⚠ bei leer, gelbes ⚠ bei Leerzeichen). Hilfreich um Tippfehler
früh zu erkennen.</p>
`
  },

  lcdmulti: {
    title: "Multi-LCD — Mehrere Displays als virtuelles Display",
    body: `
<p>Mit der <strong>Multi-LCD</strong>-Funktion kannst du <em>mehrere
LCDs zu einem großen virtuellen Display zusammenfassen</em> — z. B. eine
2×3-Wand aus 6 LCDs als ein riesiger Bildschirm.</p>

<h3>Aktivieren</h3>
<ol>
  <li>Im LCD-Baukasten: Toggle <strong>„Multi-LCD-Anordnung"</strong>.</li>
  <li><strong>Spalten</strong> und <strong>Reihen</strong> wählen (1–6 je).</li>
  <li><strong>Namensmuster</strong> definieren. Default:
      <code>LCD {col}{row}</code> → erzeugt Namen <code>LCD A1</code>,
      <code>LCD B1</code>, <code>LCD A2</code>, <code>LCD B2</code>, …</li>
</ol>

<h3>Namensmuster-Platzhalter</h3>
<ul>
  <li><code>{col}</code> → Spalten-Buchstabe: <code>A</code>, <code>B</code>, <code>C</code>, …</li>
  <li><code>{row}</code> → Zeilen-Nummer: <code>1</code>, <code>2</code>, <code>3</code>, …</li>
</ul>

<h3>Vorschau</h3>
<p>Die Live-Vorschau zeigt alle LCDs mit Trennlinien dazwischen und
jeweils dem Block-Namen oben links. Widgets können <strong>quer über
mehrere LCDs</strong> platziert werden — sie werden automatisch zerschnitten
und auf jedem LCD korrekt gezeichnet.</p>

<h3>Voraussetzung im Spiel</h3>
<p>Du musst die LCDs im Spiel <strong>exakt nach dem Namensmuster benennen</strong>
und sie müssen <strong>physisch in der richtigen Anordnung</strong> sitzen
(passend zur Spalten/Reihen-Vorgabe). Sonst stimmt die Position nicht.</p>

<h3>Tipps</h3>
<ul>
  <li>Bei vielen LCDs (3×3 oder mehr): <strong>Coroutines aktivieren</strong>
      (siehe Hilfe „Ausführung"). Sonst kommt der „Script too complex"-Fehler.</li>
  <li>Alle LCDs sollten dieselbe Auflösung und denselben Aspect haben
      (Wide oder Standard, nicht gemischt).</li>
  <li>Background-Bilder funktionieren NICHT über mehrere LCDs hinweg
      (jedes LCD hat seinen eigenen Hintergrund).</li>
</ul>
`
  },

  code: {
    title: "Code-Output — Kopieren, Speichern, Klartext",
    body: `
<p>Im rechten Panel siehst du den fertigen C#-Code. Er aktualisiert sich
<strong>automatisch</strong>, wenn du etwas änderst.</p>

<h3>📋 Kopieren</h3>
<p>Klick → Code landet in der Zwischenablage. Dann im Spiel mit Strg+V
einfügen.</p>

<h3>💾 Download</h3>
<p>Lädt den Code als <code>.cs</code>-Datei herunter. Praktisch wenn du
ihn in einen externen Editor (VS Code, Notepad++) lädst oder im
Workshop-Skript-Ordner ablegst:</p>
<p><code>%AppData%\\SpaceEngineers\\IngameScripts\\local\\&lt;Name&gt;\\Script.cs</code></p>

<h3>📄 Klartext</h3>
<p>Öffnet ein Modal mit dem reinen Code zum manuellen Selektieren und
Kopieren. Das ist sicherer als die Markierung im Output-Panel, weil
dort die Syntax-Highlight-Farben in die Zwischenablage rutschen könnten.</p>

<h3>Was steht im Code?</h3>
<p>Ganz oben: <strong>Attribution-Header</strong> mit Tool-Name, Version,
GitHub-URL, head87x als Tool-Autor und Generierungs-Datum. Das ist immer
da, nicht abschaltbar — verhindert dass jemand deine generierten Skripte
ohne Hinweis weitergibt.</p>
<p>Wenn du die Skript-Info-Sektion ausgefüllt hast, kommt ein WORKSHOP-
METADATEN-Block dazu.</p>
<p>Dann der eigentliche C#-Code: Block-Felder, <code>Program()</code>-Konstruktor,
<code>InitBlocks()</code>, ggf. <code>RefreshBlocks()</code>, <code>Main()</code>.</p>

<h3>Browser-Cache aufpassen</h3>
<p>Wenn du das Tool über GitHub Pages nutzt und nach einem Update
Verhalten siehst wie aus der alten Version, drücke <strong>Strg+F5</strong>
(Hard-Refresh). Browser cachen JS und CSS oft länger als nötig.</p>
`
  },

  ingame: {
    title: "Im Spiel nutzen — Schritt für Schritt",
    body: `
<p>Du hast deinen Code zusammengeklickt und kopiert. Jetzt rein damit
ins Spiel.</p>

<h3>1. Programmable Block bauen oder finden</h3>
<p>Im Build-Mode (G-Menü) → <em>Programmable Block</em> aufs Schiff/Station
setzen. Strom muss anliegen.</p>

<h3>2. Block-Namen vergeben</h3>
<p>Im Terminal: dem PB einen Namen geben (Default: „Programmable Block").
Den brauchst du nicht für unser Skript — wir referenzieren PB-interne
Blöcke nicht über Namen.</p>

<h3>3. Skript-Editor öffnen</h3>
<p>Im PB-Terminal: <em>„Edit"</em> / <em>„Bearbeiten"</em>-Button. Es
öffnet sich der In-Game-Editor mit Standard-Code-Vorlage.</p>

<h3>4. Code einfügen</h3>
<p>Strg+A (alles markieren) → Entfernen → Strg+V (unseren Code einfügen).</p>

<h3>5. Code prüfen + compilieren</h3>
<ol>
  <li>Button <strong>„Check Code"</strong> → wenn alles OK, kommt eine
      grüne Meldung.</li>
  <li>Falls Fehler: oft <em>Block-Name nicht gefunden</em>. Block-Name
      im Tool prüfen, korrigieren, Code neu kopieren.</li>
  <li>Button <strong>„OK"</strong> → speichert + verlässt den Editor.</li>
  <li>Button <strong>„Recompile"</strong> am PB → lädt das Skript neu.</li>
</ol>

<h3>Recompile — der wichtige Knopf</h3>
<p>Seit v2.11.0 (Default): Block-Referenzen werden einmalig im Constructor
geholt. Wenn ein Block <strong>zerstört wird</strong>, hat das Skript einen
ungültigen Verweis. Drück <strong>„Recompile"</strong> am PB → alles wird
neu initialisiert. Vergleichbar mit einem Reset-Knopf.</p>

<h3>Skript ausführen</h3>
<ul>
  <li>Bei <em>Manuell</em>-Modus: Toolbar-Slot am PB belegen (Aktion:
      „Run" oder „Run with Argument") und im Spiel auslösen.</li>
  <li>Bei <em>Timer-Modi</em>: läuft automatisch — die Update-Frequenz
      wird vom Skript selbst gesetzt.</li>
</ul>

<h3>Workshop-Upload</h3>
<ol>
  <li>Im PB-Editor: Button <strong>„Browse Workshop"</strong> → Tab
      <em>„My Scripts"</em>.</li>
  <li>Skript speichern als lokales Script
      (<em>„Save in Local"</em>) mit gewünschtem Namen.</li>
  <li>Aus dem Game heraus auf Steam Workshop hochladen über das
      Upload-Tool.</li>
</ol>
<p>Tipp: <strong>Skript-Info-Sektion</strong> im Tool ausfüllen — die
Workshop-Metadaten landen im Code-Header und sind im Workshop sichtbar
wenn jemand den Code anschaut.</p>

<h3>Bei Problemen</h3>
<ul>
  <li><strong>„Script too complex"</strong>: Coroutines aktivieren.</li>
  <li><strong>„Block 'XYZ' nicht gefunden"</strong> (Echo-Meldung am PB):
      Block-Name prüfen, exakte Schreibweise.</li>
  <li><strong>Skript reagiert nicht</strong>: Update-Frequenz prüfen
      (steht in der Ausführungs-Sektion).</li>
  <li><strong>Skript verhält sich wie alte Version nach Update</strong>:
      Strg+F5 im Browser (Hard-Refresh), neu kopieren, im Spiel Recompile.</li>
</ul>
`
  }

};

// ============================================================
// ENGLISH
// ============================================================

const HELP_EN = {

  overview: {
    title: "What is this tool?",
    body: `
<p>The <strong>SE.PB Code Generator</strong> is a web tool that lets you
build C# scripts for the <em>Programmable Block</em> in Space Engineers
through a visual builder — <strong>no programming knowledge required</strong>.</p>

<p>You click together:</p>
<ul>
  <li><strong>IF</strong> certain conditions are met (e.g. "Sensor 1 is active")</li>
  <li><strong>THEN</strong> certain actions should happen (e.g. "open door, turn on lights")</li>
  <li><strong>ELSE</strong> (optional) other actions should happen</li>
</ul>

<p>The tool generates the finished C# code, which you then paste into
the Programmable Block in-game. You can also design graphical LCD
displays, save templates, switch languages and much more.</p>

<h3>The tool does NOT</h3>
<ul>
  <li>Send anything to the internet — everything runs locally in your browser.</li>
  <li>Play Space Engineers for you — you have to paste the code into
      the game yourself.</li>
  <li>Change save files or mods.</li>
</ul>

<h3>Who built this?</h3>
<p><strong>head87x</strong> (Steam name). Open source on GitHub:
<code>github.com/head87x/se-pb-codegen</code>.</p>
`
  },

  firststeps: {
    title: "First Steps (Quickstart)",
    body: `
<p>A simple example: "When Sensor 1 detects someone, open Door 1".</p>

<h3>Step 1 — Add condition</h3>
<ol>
  <li>Click <strong>"+ Condition"</strong> in the <em>IF</em> section.</li>
  <li>Pick <strong>Block type: Sensor</strong>.</li>
  <li>Enter the exact name the block has in the in-game terminal,
      e.g. <code>Sensor 1</code>. (Watch capitalization!)</li>
  <li>Leave <strong>Block source</strong> as "Single block".</li>
  <li>For <strong>Check</strong>: "Is active".</li>
</ol>

<h3>Step 2 — Add action</h3>
<ol>
  <li>Click <strong>"+ Action"</strong> in the <em>THEN</em> section.</li>
  <li>Pick <strong>Block type: Door</strong>.</li>
  <li>Block name: <code>Door 1</code>.</li>
  <li>For <strong>Action</strong>: "Open".</li>
</ol>

<h3>Step 3 — Grab the code</h3>
<p>In the right panel you see the finished C# code. Click
<strong>"📋 Copy"</strong> at the top right.</p>

<h3>Step 4 — Paste into the game</h3>
<ol>
  <li>Go to your Programmable Block in Space Engineers.</li>
  <li>Click <em>"Edit"</em>.</li>
  <li>Delete the existing code and paste ours (Ctrl+V).</li>
  <li>Click <em>"Check Code"</em> → <em>"OK"</em> → <em>"Recompile"</em>.</li>
</ol>

<p>Done! Door 1 now opens when someone triggers Sensor 1.</p>

<h3>What if I want to change it?</h3>
<p>Edit here in the tool, click "📋 Copy" again, paste in-game and
press "Recompile". The Programmable Block reloads the script.</p>

<h3>Beginner tips</h3>
<ul>
  <li>Start with <em>one</em> condition and <em>one</em> action. Add
      more later.</li>
  <li>Save your configuration as a <strong>template</strong>
      (see "Templates" section) so you don't have to rebuild it every time.</li>
  <li>If there are errors in-game: often a wrong block name. Check the
      exact spelling in the terminal.</li>
</ul>
`
  },

  templates: {
    title: "Templates — Save, Load, Export/Import",
    body: `
<p>Templates are <strong>complete configurations</strong> you can save
and reload later — e.g. "Auto-Door Sensor", "Power Management",
"Drill Rig Control".</p>

<h3>Save template</h3>
<p>Build your configuration, then click <strong>"+ Save"</strong>.
Enter a name. The template lands in your browser (LocalStorage) — it
is only available in <strong>this browser</strong> on <strong>this device</strong>.</p>

<h3>Load template</h3>
<p>Click on the name of a saved template. It overwrites your current
configuration.</p>

<h3>Delete template</h3>
<p>Click the <strong>✕</strong> right of the name.</p>

<h3>Start fresh</h3>
<p><strong>"⟲ New"</strong> resets everything — conditions, actions,
LCD configuration. Confirms first.</p>

<h3>Export — share templates as a file</h3>
<p><strong>"⤴ Export"</strong> downloads all saved templates as a
<code>.json</code> file (filename:
<code>se-pb-templates-YYYY-MM-DD.json</code>). You can:</p>
<ul>
  <li>Transfer it to another device</li>
  <li>Send it to friends</li>
  <li>Keep it as a backup</li>
</ul>

<h3>Import — load templates from a file</h3>
<p>Click <strong>"⤵ Import"</strong> → pick a <code>.json</code> file
→ confirm. Templates from the file are added to your list.
<strong>Existing templates are never overwritten</strong> — on name
conflict the import gets a <code>(2)</code> suffix.</p>

<h3>What if I switch browsers?</h3>
<p>Don't forget to export! LocalStorage is per-browser. A new browser
has no templates until you import the JSON file.</p>
`
  },

  share: {
    title: "Share Token — full config as a string",
    body: `
<p>A <strong>share token</strong> is your entire current configuration
(conditions + actions + LCD + settings) as a <strong>single text string</strong>.
Unlike templates, the token doesn't live in the browser but is generated
on demand and can be copied anywhere.</p>

<h3>Generate a token</h3>
<ol>
  <li>Build your configuration.</li>
  <li>Click <strong>"💾 Generate token"</strong>.</li>
  <li>A long Base64 string appears in the text field. Select + copy.</li>
</ol>

<h3>Load a token</h3>
<ol>
  <li>Paste a token into the text field.</li>
  <li>Click <strong>"📥 Load token"</strong>.</li>
  <li>Confirm the dialog. Your current configuration is overwritten.</li>
</ol>

<h3>Difference to templates?</h3>
<ul>
  <li><strong>Templates</strong> live in the browser, persist across
      sessions, are named. Best for your personal collection.</li>
  <li><strong>Tokens</strong> are one-shot snapshots as a text string.
      Best for <em>sharing</em> (Discord, forum, email).</li>
</ul>

<h3>Tips</h3>
<ul>
  <li>Tokens are version-tagged. If someone sends a token from a newer
      tool version, you get a warning — import is still attempted
      (fields the older tool doesn't know are ignored).</li>
  <li>Token length: about 1–10 KB depending on config size.</li>
</ul>
`
  },

  info: {
    title: "Script Info — Workshop metadata",
    body: `
<p>This (optional) section adds metadata to the
<strong>generated code's header</strong>, so your script looks
professional when published to the Steam Workshop and the author is
traceable.</p>

<h3>What happens without this section?</h3>
<p>Even without script info, the generated code <strong>always</strong>
gets a header with tool name, version, GitHub URL, and generation date.
That's the <em>attribution</em> — non-removable.</p>

<h3>What happens with this section?</h3>
<p>When you enable the toggle <strong>"Include metadata in header"</strong>,
a "WORKSHOP METADATA" block appears in the code header with all filled
fields:</p>
<ul>
  <li><strong>Script name</strong> — e.g. "Auto-Defense System"</li>
  <li><strong>Author</strong> — your Steam name or pseudonym</li>
  <li><strong>Version</strong> — e.g. "1.0", "2.3"</li>
  <li><strong>Tags</strong> — comma-separated, e.g. "defense, automation, lcd"</li>
  <li><strong>Description</strong> — multi-line, what the script does</li>
</ul>

<h3>Example output</h3>
<p>At the top of the generated <code>.cs</code>:</p>
<pre>/* =====================================================
 * SPACE ENGINEERS - PROGRAMMABLE BLOCK SCRIPT
 * =====================================================
 * Generated with: SE.PB Code Generator v3.0.1
 * Project URL:    https://github.com/head87x/se-pb-codegen
 * Tool by:        head87x
 * Generated on:   2026-05-14
 *
 * ----- WORKSHOP METADATA -----
 * Script name:   Auto-Defense System
 * Author:        PlayerName
 * Version:       1.0
 * Tags:          defense, automation
 * Description:   Switches gatling turrets to auto
 *                when sensors report enemies.
 * ===================================================== */</pre>

<h3>Why this is useful</h3>
<ul>
  <li>Anyone looking at your script sees who made it.</li>
  <li>Workshop uploads look more professional.</li>
  <li>For updates you can bump the version.</li>
</ul>
`
  },

  exec: {
    title: "Execution — How often does the script run?",
    body: `
<p>Programmable Blocks in Space Engineers can run their actions in
several ways. This section configures that.</p>

<h3>Execution modes</h3>
<ul>
  <li><strong>Manual (argument / button)</strong> — the script only
      runs when you trigger it in-game (toolbar slot, action menu).
      Very economical but doesn't react on its own.</li>
  <li><strong>Every 100 ticks (Update100)</strong> — about every 1.6 seconds
      (60 ticks/sec in-game). Most economical automatic variant.</li>
  <li><strong>Every 10 ticks (Update10)</strong> — about 6 times per second.
      Good compromise for sensors, doors.</li>
  <li><strong>Every 1 second (Update100)</strong> — own frequency variant
      (Update100 internally, can fit certain use cases).</li>
  <li><strong>⚠ Continuous (every tick)</strong> — 60 times per second!
      Only use when truly needed (e.g. autopilot steering), otherwise
      it costs performance.</li>
</ul>

<h3>🔄 Use coroutines</h3>
<p>Advanced option: <strong>spreads LCD updates across multiple ticks</strong>.
If you have many LCDs or aggregator widgets, the script can become too
complex per tick and Space Engineers throws the "Script too complex"
error.</p>
<p>Coroutines solve that by drawing only a portion each tick. Trade-off:
LCDs no longer refresh simultaneously — one after the other.</p>
<p><strong>When to enable?</strong> At multi-LCD 3×3 or larger, or when
you hit the "too complex" error.</p>

<h3>🛡 Auto-recover destroyed blocks</h3>
<p>Default behavior since v2.11.0: the script fetches block references
once at startup (or on "Recompile" in-game). If a block is destroyed
in combat, the script has an invalid reference and may throw errors —
you press "Recompile" manually on the Programmable Block.</p>
<p>With the <strong>"Auto-recover"</strong> toggle, the script checks
each tick whether blocks still exist and re-fetches them if needed.
Costs performance overhead but useful for scripts that run long-term
and must handle block loss (defense installations, drill setups).</p>
`
  },

  conditions: {
    title: "IF — Conditions",
    body: `
<p>Conditions are the <strong>"if"</strong> in "if this, then that".
They check a block's state (or several blocks') and return yes or no.</p>

<h3>Add a condition</h3>
<p>Click <strong>"+ Condition"</strong> or drag a block from the left
palette into the IF field.</p>

<h3>Fields per condition</h3>
<ul>
  <li><strong>Block type</strong> — kind of block (door, sensor, battery, …)</li>
  <li><strong>Block name</strong> — exact name in the in-game terminal
      (not when "All blocks of type")</li>
  <li><strong>Block source</strong> — single / group / all of type
      (see its own help section)</li>
  <li><strong>Check</strong> — what exactly is checked (e.g. "Is open",
      "Output &gt; X kW")</li>
  <li>Optional argument field if the check needs a value
      (e.g. "X" for "Charge &gt; X %")</li>
</ul>

<h3>Combining multiple conditions</h3>
<p>If you have more than one condition, an <strong>AND / OR</strong>
selector appears between them:</p>
<ul>
  <li><strong>AND</strong> — both conditions must be true</li>
  <li><strong>OR</strong> — at least one must be true</li>
</ul>

<h3>Order / precedence</h3>
<p>C# evaluates <strong>AND before OR</strong>. Example:
<code>A OR B AND C</code> means <code>A OR (B AND C)</code>.
If you need different grouping you currently have to use Custom mode
(planned: explicit parentheses).</p>

<h3>Condition validation</h3>
<p>Block names are checked for:</p>
<ul>
  <li>Empty (red, ⚠) — ignored during generation</li>
  <li>Leading/trailing spaces (yellow, ⚠) — usually a typo</li>
  <li>Invisible control characters (yellow, ⚠) — happens when copying
      from Discord</li>
</ul>

<h3>Tooltip on the ⓘ symbol</h3>
<p>Next to the <strong>Check</strong> dropdown there's a ⓘ — hovering
shows details about what the check does internally.</p>
`
  },

  blocksource: {
    title: "Block Sources — Single / Group / All of type",
    body: `
<p>Per condition or action you choose <strong>where the blocks come from</strong>.
Three modes:</p>

<h3>Single block</h3>
<p>Enter the <strong>exact name</strong> of a single block.
Example: <code>Cockpit Door</code>. Standard, simplest variant.</p>

<h3>Block group</h3>
<p>Enter the name of a <strong>group</strong> you've set up in-game
via the terminal (Ctrl+click several blocks → "Create group"). Example:
<code>Front Lights</code> with 6 lights in it.</p>
<p>Advantage: you can add or remove members of the group in-game at any
time — no need to regenerate the script.</p>

<h3>All blocks of type</h3>
<p>The tool finds <strong>all blocks of an interface type</strong> on
the grid — no group needed. Example: all solar panels, all doors, all
batteries. No name required.</p>
<p>This enables things like "If the sum of all solar outputs &gt; 50 kW".</p>

<h3>"Same construct only (no subgrids)"</h3>
<p>This checkbox appears when "All blocks of type" is selected
(default on).</p>
<p>What are subgrids? If your ship has <strong>rotors, pistons or hangars</strong>,
additional grids hang off them (rotor head, piston top, hangar interior).
By default "All blocks of type" includes those.</p>
<p>When to <strong>enable</strong> (default):</p>
<ul>
  <li>You have a drill arm on a rotor — and want NOT to count subgrid
      drills, only the main drill on the ship.</li>
  <li>You have turret towers (rotor + cannon) — and want only the
      cannons on the main grid, not the subgrid of the turret.</li>
</ul>
<p>When to <strong>disable</strong>:</p>
<ul>
  <li>You want all turrets including subgrid ones summed up.</li>
  <li>You want to include solar panels on a movable panel arm.</li>
</ul>

<h3>Aggregator for group and type</h3>
<p>With "Block group" or "All blocks of type" an additional
<strong>aggregator</strong> selector appears (see its own help section).
It determines how multiple blocks become a single yes/no answer
(sum, average, at least one, all, …).</p>
`
  },

  aggregator: {
    title: "Aggregator — How many blocks count?",
    body: `
<p>When a condition applies to multiple blocks at once
(block group or "All blocks of type"), you need a rule for how the
individual values become <strong>one</strong> yes/no answer. That rule
is the <em>aggregator</em>.</p>

<h3>The 7 modes</h3>
<table>
  <tr>
    <th>Mode</th><th>What it does</th><th>Example</th>
  </tr>
  <tr>
    <td><strong>Any (At least one)</strong></td>
    <td>At least ONE block meets the condition</td>
    <td>"If ANY door is open"</td>
  </tr>
  <tr>
    <td><strong>All</strong></td>
    <td>ALL blocks meet the condition</td>
    <td>"If ALL doors are closed"</td>
  </tr>
  <tr>
    <td><strong>Count</strong></td>
    <td>How many blocks meet the condition — compared against a threshold</td>
    <td>"If AT LEAST 3 batteries are under 20 % charge"</td>
  </tr>
  <tr>
    <td><strong>Sum</strong></td>
    <td>Add all values together, then compare</td>
    <td>"If SUM of all solar outputs &gt; 50 kW"</td>
  </tr>
  <tr>
    <td><strong>Avg (Average)</strong></td>
    <td>Compute mean, then compare</td>
    <td>"If AVERAGE battery charge &lt; 30 %"</td>
  </tr>
  <tr>
    <td><strong>Min (Minimum)</strong></td>
    <td>Find the smallest value, then compare</td>
    <td>"If the WEAKEST battery &lt; 10 %" → one is critically low</td>
  </tr>
  <tr>
    <td><strong>Max (Maximum)</strong></td>
    <td>Find the largest value, then compare</td>
    <td>"If the STRONGEST battery = 100 %" → one is fully charged</td>
  </tr>
</table>

<h3>Operator and threshold</h3>
<p>For Count/Sum/Avg/Min/Max you additionally pick an <strong>operator</strong>
(<code>&gt;</code>, <code>≥</code>, <code>&lt;</code>, <code>≤</code>,
<code>=</code>, <code>≠</code>) and a <strong>threshold value</strong>.</p>

<h3>Which aggregator when? — Practical tips</h3>
<ul>
  <li>Simple status control (doors, lights): <strong>Any</strong> or <strong>All</strong></li>
  <li>Battery alarm (one running empty): <strong>Min</strong></li>
  <li>Cargo alarm (one getting full): <strong>Max</strong></li>
  <li>Total power output: <strong>Sum</strong></li>
  <li>Overall "averaged empty" state: <strong>Avg</strong></li>
  <li>Minimum guarantee ("at least 3 reactors running"): <strong>Count</strong></li>
</ul>

<h3>Example: "If all solar panels combined > 50 kW"</h3>
<ol>
  <li>Block type: <code>Solar Panel</code></li>
  <li>Block source: <code>All blocks of type</code></li>
  <li>Aggregator: <code>Sum</code></li>
  <li>Operator: <code>&gt;</code></li>
  <li>Threshold: <code>50</code></li>
  <li>Check (which property): <code>Output &gt; X kW</code> (X value irrelevant for Sum)</li>
</ol>
<p>The tool generates:
<code>_allSolarPanel_0.Sum(_b =&gt; _b.CurrentOutput * 1000f) &gt; 50f</code></p>

<h3>Note: property extraction</h3>
<p>For Sum/Avg/Min/Max the tool takes only the <strong>property part</strong>
from your selected <em>check</em> (e.g. "Output &gt; X kW") — that's
<code>CurrentOutput</code>. The comparison value X from the check is
ignored in this mode — instead the <strong>threshold</strong> is used.
For <em>any/all/count</em> the full check is used.</p>
`
  },

  actions: {
    title: "THEN / ELSE — Actions",
    body: `
<p>Actions are the <strong>"then"</strong>: what should happen when the
conditions are true. <strong>ELSE</strong> is the else branch: what
happens when the conditions are NOT true.</p>

<h3>Add an action</h3>
<p>Click <strong>"+ Action"</strong> in <em>THEN</em> or <em>ELSE</em>.
You can also drag a block from the left palette into the field.</p>

<h3>Fields per action</h3>
<ul>
  <li><strong>Block type</strong></li>
  <li><strong>Block name</strong> (except for "All blocks of type")</li>
  <li><strong>Block source</strong> — single / group / all of type</li>
  <li><strong>Action</strong> — the actual operation (open, close, turn
      on, set brightness, …)</li>
  <li>Optional argument(s) if the action needs a value (e.g. brightness)</li>
</ul>

<h3>Actions on multiple blocks</h3>
<p>With block group or "All of type" the action is automatically run in
a <code>foreach</code> loop for each block. Example: "Close all doors" →
the script closes each door in the list.</p>

<h3>There is NO condition inside an action</h3>
<p>Actions check nothing — they just execute. The check belongs in IF.</p>

<h3>THEN without ELSE</h3>
<p>ELSE is completely optional. You can build scripts that are only
"IF X then Y" without an else branch. If the condition isn't true,
nothing happens.</p>

<h3>Example with ELSE: motion-sensor door</h3>
<ul>
  <li><strong>IF</strong>: Sensor 1 is active</li>
  <li><strong>THEN</strong>: Entry Door → Open</li>
  <li><strong>ELSE</strong>: Entry Door → Close</li>
</ul>
<p>This way the door stays open while motion is detected and closes
once the sensor reports nothing.</p>
`
  },

  lcdtext: {
    title: "LCD Text Output",
    body: `
<p>The <strong>simple text output</strong> writes a status message to an
LCD block. It shows:</p>
<ul>
  <li>Current time (tick)</li>
  <li>Whether the conditions are met</li>
  <li>Which actions ran</li>
</ul>

<h3>Enable</h3>
<ol>
  <li>Tick the <strong>"Enable"</strong> toggle.</li>
  <li>Enter the LCD block name (e.g. <code>LCD Status</code>).</li>
</ol>

<h3>When is it useful?</h3>
<ul>
  <li>Debug: quickly see whether the script is doing anything.</li>
  <li>Status screen in the cockpit: simple overview, no frills.</li>
  <li>Getting started: before touching the big LCD composer.</li>
</ul>

<h3>Difference to the LCD composer</h3>
<p>The text output is a <em>mode text</em> LCD, very simple.
The LCD composer produces graphical sprite output (bars, donuts,
gauges, ...) — much prettier but more complex to set up.</p>
<p>You can <strong>enable both at the same time</strong>: one LCD with
text status, another with graphics composer.</p>

<h3>Finding the LCD block name</h3>
<p>In-game: open terminal → click the LCD → the "Custom Name" at the
top is what you need here. Watch capitalization and spaces.</p>
`
  },

  lcdcomposer: {
    title: "LCD Composer — Graphical displays",
    body: `
<p>The <strong>LCD composer</strong> is the big tool for pretty
sprite-based displays: bars, donuts, gauges, lists, aggregators and more
— all drag-and-drop positionable.</p>

<h3>Enable</h3>
<ol>
  <li>Tick <strong>"Enable"</strong>.</li>
  <li>Pick the <strong>display source</strong>:
    <ul>
      <li><em>Standalone LCD</em> — a regular LCD panel on the ship.
          Enter block name.</li>
      <li><em>Programmable Block (this PB)</em> — the LCD inside the PB
          itself (if it has one, depending on model).</li>
      <li><em>Cockpit / seat / remote</em> — one of the internal LCDs
          inside a cockpit or seat. Block name + surface index needed.</li>
    </ul>
  </li>
  <li><strong>LCD format</strong>: match your display (Standard LCD,
      Wide LCD, Corner LCD, Cockpit surface). Only matters for the
      preview — the generated code works with any format.</li>
</ol>

<h3>Add widgets</h3>
<p>Click one of the <strong>"+ Widget"</strong> buttons below the live
preview. Various widgets to choose from (see next section "LCD widgets
in detail").</p>

<h3>Move & edit widgets</h3>
<ul>
  <li><strong>Drag & drop</strong> in the live preview to position.</li>
  <li>Click a widget or a layer-list row → detail editor opens.</li>
  <li><strong>Shift+Click</strong> → multi-select (move/delete several
      widgets at once).</li>
  <li>Smart snap: widgets snap to edges / centers / other widgets.</li>
</ul>

<h3>Themes</h3>
<p>Above the preview there are <strong>theme buttons</strong> (Default,
Alarm, Cool, Warm, …). A click recolors all widgets to match.</p>

<h3>Presets</h3>
<p>Pre-built widget combinations (e.g. "Ship Overview", "Power Panel").
Load via the preset dropdown → widgets appear automatically.
<strong>Note</strong>: loading a preset overwrites your current widgets.</p>

<h3>Visibility</h3>
<p>Each widget has a 👁/⌀ button in the layer list — temporarily hides
the widget (it remains in the config, just isn't drawn).</p>
`
  },

  lcdwidgets: {
    title: "LCD widgets in detail",
    body: `
<p>The LCD composer has several widget types. Quick overview here —
details are in the editor when you add the widget.</p>

<h3>Text widgets</h3>
<ul>
  <li><strong>Header / Text</strong> — heading or free text.</li>
  <li><strong>Clock</strong> — current time, various formats.</li>
  <li><strong>Separator</strong> — horizontal line.</li>
</ul>

<h3>Status widgets (boolean)</h3>
<ul>
  <li><strong>Dot indicator</strong> — traffic light (red/green) for
      "active yes/no".</li>
  <li><strong>Checklist</strong> — up to 6 rows, each ✓ or ✗.</li>
</ul>

<h3>Numeric widgets</h3>
<ul>
  <li><strong>Bar</strong> — horizontal fill 0–100 %.</li>
  <li><strong>Dual bar</strong> — two values stacked (e.g. Input/Output).</li>
  <li><strong>Donut (circle)</strong> — ring indicator, good for charge.</li>
  <li><strong>Gauge</strong> — analog dial with scale.</li>
  <li><strong>Text value</strong> — number as text, freely formattable.</li>
  <li><strong>Big value</strong> — very large number + label.</li>
  <li><strong>Energy segments</strong> — like phone battery LEDs.</li>
  <li><strong>Icon + value</strong> — icon in front, number behind.</li>
</ul>

<h3>Special</h3>
<ul>
  <li><strong>Aggregator</strong> — shows sum/avg/min/max of all blocks
      of a type. E.g. "Σ Solar output: 42.3 kW".</li>
  <li><strong>Spacer</strong> — empty separator area.</li>
  <li><strong>Custom text</strong> — any static text.</li>
</ul>

<h3>Per-widget settings</h3>
<ul>
  <li><strong>Position & size</strong> — X, Y, width, height in LCD pixels.</li>
  <li><strong>Background</strong> — optional background color.</li>
  <li><strong>Label / text</strong> — the caption.</li>
  <li><strong>Block name</strong> — source block for the data.</li>
  <li><strong>Data source</strong> — which property is read (battery
      charge, tank fill, speed, …).</li>
  <li><strong>Colors</strong> — accent + background (R,G,B).</li>
</ul>

<h3>Tip: block name validation</h3>
<p>The live validation works in widget block name fields too (red ⚠
when empty, yellow ⚠ on leading/trailing spaces). Helps catch typos
early.</p>
`
  },

  lcdmulti: {
    title: "Multi-LCD — Several displays as one virtual screen",
    body: `
<p>The <strong>multi-LCD</strong> feature lets you <em>combine multiple
LCDs into one big virtual display</em> — e.g. a 2×3 wall of 6 LCDs as a
single huge screen.</p>

<h3>Enable</h3>
<ol>
  <li>In the LCD composer: tick <strong>"Multi-LCD arrangement"</strong>.</li>
  <li>Pick <strong>columns</strong> and <strong>rows</strong> (1–6 each).</li>
  <li>Define the <strong>naming pattern</strong>. Default:
      <code>LCD {col}{row}</code> → produces names <code>LCD A1</code>,
      <code>LCD B1</code>, <code>LCD A2</code>, <code>LCD B2</code>, …</li>
</ol>

<h3>Naming pattern placeholders</h3>
<ul>
  <li><code>{col}</code> → column letter: <code>A</code>, <code>B</code>, <code>C</code>, …</li>
  <li><code>{row}</code> → row number: <code>1</code>, <code>2</code>, <code>3</code>, …</li>
</ul>

<h3>Preview</h3>
<p>The live preview shows all LCDs with separators between them and
the block name at the top-left of each. Widgets can be placed
<strong>across multiple LCDs</strong> — they're automatically clipped
and drawn correctly on each.</p>

<h3>In-game requirement</h3>
<p>You must <strong>name the LCDs exactly per the pattern</strong> and
they must be <strong>physically arranged correctly</strong> (matching
your column/row setup). Otherwise the positioning is off.</p>

<h3>Tips</h3>
<ul>
  <li>For many LCDs (3×3 or larger): <strong>enable coroutines</strong>
      (see "Execution" help). Otherwise you get the "Script too complex"
      error.</li>
  <li>All LCDs should be the same resolution and aspect (wide or
      standard, not mixed).</li>
  <li>Background images do NOT work across multiple LCDs (each LCD has
      its own background).</li>
</ul>
`
  },

  code: {
    title: "Code output — Copy, save, plain text",
    body: `
<p>The right panel shows the finished C# code. It updates
<strong>automatically</strong> as you make changes.</p>

<h3>📋 Copy</h3>
<p>Click → code lands in the clipboard. Paste in-game with Ctrl+V.</p>

<h3>💾 Download</h3>
<p>Downloads the code as a <code>.cs</code> file. Handy if you load it
into an external editor (VS Code, Notepad++) or drop it into the
Workshop script folder:</p>
<p><code>%AppData%\\SpaceEngineers\\IngameScripts\\local\\&lt;Name&gt;\\Script.cs</code></p>

<h3>📄 Plain text</h3>
<p>Opens a modal with the raw code for manual select-and-copy. Safer
than highlighting in the output panel, because the syntax-highlight
colors might leak into the clipboard otherwise.</p>

<h3>What's in the code?</h3>
<p>At the very top: <strong>attribution header</strong> with tool name,
version, GitHub URL, head87x as tool author, and generation date. Always
there, non-removable — prevents others from passing off generated scripts
as their own work.</p>
<p>If you filled in the script info section, a WORKSHOP METADATA block
follows.</p>
<p>Then the actual C# code: block fields, <code>Program()</code>
constructor, <code>InitBlocks()</code>, optionally <code>RefreshBlocks()</code>,
<code>Main()</code>.</p>

<h3>Watch out for browser cache</h3>
<p>If you use the tool via GitHub Pages and see behavior from the old
version after an update, hit <strong>Ctrl+F5</strong> (hard refresh).
Browsers cache JS and CSS longer than needed.</p>
`
  },

  ingame: {
    title: "Using it in-game — Step by step",
    body: `
<p>You've clicked your code together and copied it. Now into the game.</p>

<h3>1. Build or find a Programmable Block</h3>
<p>Build mode (G menu) → <em>Programmable Block</em> on the ship/station.
Power required.</p>

<h3>2. Name the block</h3>
<p>In terminal: give the PB a name (default: "Programmable Block").
You don't need it for our script — we don't reference PB-internal blocks
by name.</p>

<h3>3. Open the script editor</h3>
<p>In the PB terminal: <em>"Edit"</em> button. The in-game editor opens
with a default code template.</p>

<h3>4. Paste the code</h3>
<p>Ctrl+A (select all) → Delete → Ctrl+V (paste our code).</p>

<h3>5. Check + compile</h3>
<ol>
  <li>Button <strong>"Check Code"</strong> → if everything's OK, you get
      a green message.</li>
  <li>If errors: often a <em>block name not found</em>. Check the block
      name in the tool, correct it, copy code again.</li>
  <li>Button <strong>"OK"</strong> → save + exit editor.</li>
  <li>Button <strong>"Recompile"</strong> on the PB → reloads the script.</li>
</ol>

<h3>Recompile — the important button</h3>
<p>Since v2.11.0 (default): block references are fetched once in the
constructor. If a block is <strong>destroyed</strong>, the script has
an invalid reference. Press <strong>"Recompile"</strong> on the PB →
everything re-initializes. Think of it as a reset button.</p>

<h3>Running the script</h3>
<ul>
  <li>In <em>manual</em> mode: assign a toolbar slot on the PB (action:
      "Run" or "Run with argument") and trigger in-game.</li>
  <li>In <em>timer</em> modes: runs automatically — the update frequency
      is set by the script itself.</li>
</ul>

<h3>Workshop upload</h3>
<ol>
  <li>In the PB editor: <strong>"Browse Workshop"</strong> → tab
      <em>"My Scripts"</em>.</li>
  <li>Save as local script (<em>"Save in Local"</em>) with your chosen
      name.</li>
  <li>Upload from the game to Steam Workshop via the upload tool.</li>
</ol>
<p>Tip: fill in the <strong>script info section</strong> in the tool —
the workshop metadata lands in the code header and is visible on the
workshop page when someone views the code.</p>

<h3>Troubleshooting</h3>
<ul>
  <li><strong>"Script too complex"</strong>: enable coroutines.</li>
  <li><strong>"Block 'XYZ' not found"</strong> (Echo message on the PB):
      check block name, exact spelling.</li>
  <li><strong>Script doesn't react</strong>: check update frequency
      (in the execution section).</li>
  <li><strong>Script behaves like old version after update</strong>:
      Ctrl+F5 in browser (hard refresh), re-copy, recompile in-game.</li>
</ul>
`
  }

};

// ============================================================
// API
// ============================================================

function getHelpSections() {
  const lang = (typeof getLang === "function") ? getLang() : "de";
  const map = (lang === "en") ? HELP_EN : HELP_DE;
  return HELP_SECTIONS.map(s => ({
    id: s.id,
    icon: s.icon,
    title: (map[s.id] || {}).title || s.id
  }));
}

function getHelpSection(id) {
  const lang = (typeof getLang === "function") ? getLang() : "de";
  const map = (lang === "en") ? HELP_EN : HELP_DE;
  return map[id] || null;
}
