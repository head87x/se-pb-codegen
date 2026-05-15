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
  { id: "expert",       icon: "🛠" },  // v4.3.0 — Expert-Mode + Klammerung + Refresh-Intervall + Effekte
  { id: "rulesets",     icon: "📑" },  // v5.0.0 — Mehrere unabhängige WENN/DANN-Pakete
  { id: "conditions",   icon: "❓" },
  { id: "blocksource",  icon: "🧩" },
  { id: "aggregator",   icon: "Σ" },
  { id: "actions",      icon: "▶" },
  { id: "lcdtext",      icon: "📝" },
  { id: "lcdcomposer",  icon: "🖼" },
  { id: "lcdwidgets",   icon: "📊" },
  { id: "lcdmulti",     icon: "🖥" },
  { id: "code",         icon: "</>" },
  { id: "explanation",  icon: "📖" },  // v3.2.0 — Plain-Language-Box im rechten Panel
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
den Programmable Block im Spiel kopierst.</p>

<h3>Was alles drin ist</h3>
<ul>
  <li><strong>Visueller Baukasten</strong> für Bedingungen und Aktionen mit Drag &amp; Drop.</li>
  <li><strong>Drei Block-Quellen</strong> pro Bedingung/Aktion: einzelner
      Block, Block-Gruppe oder alle Blöcke eines Typs.</li>
  <li><strong>Aggregator-Modi</strong>: Summe, Durchschnitt, Min, Max,
      Count, Any, All über mehrere Blöcke.</li>
  <li><strong>Grafischer LCD-Baukasten</strong> mit Sprite-Widgets,
      Themes, Presets, Multi-LCD-Anordnung.</li>
  <li><strong>Vorlagen + Share-Tokens + Teilen-Links</strong> für
      Wiederverwendung und Austausch.</li>
  <li><strong>Plain-Language-Beschreibung</strong> rechts neben dem Code,
      die deine Konfiguration in natürlicher Sprache zusammenfasst.</li>
  <li><strong>Auto-Complete</strong> für Block-Namen und Warnung bei
      Tippfehlern.</li>
  <li><strong>Experten-Modus</strong> mit Klammerung, Aggregator-Refresh-
      Intervall etc. für Power-User.</li>
  <li><strong>Themes &amp; Effekte</strong> — neun Themes, optionale
      Matrix-Scanlines und Cyberpunk-Glow.</li>
  <li><strong>Zweisprachig</strong> — Deutsch / Englisch live umschaltbar.</li>
</ul>

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

<h3>Per-Vorlage-Export (kleines ⤴-Icon im Chip)</h3>
<p>Jeder Vorlagen-Chip hat ein kleines <strong>⤴</strong>-Icon
zwischen dem Namen und dem ✕. Klick → exportiert nur diese eine
Vorlage als eigene <code>.json</code>-Datei. Praktisch zum Teilen
einzelner Vorlagen.</p>

<h3>Import — Vorlagen aus Datei laden</h3>
<p>Zwei Wege:</p>
<ul>
  <li>Klick <strong>„⤵ Import"</strong> → wähle eine
      <code>.json</code>-Datei → bestätige.</li>
  <li>Oder einfach die <code>.json</code>-Datei mit der Maus
      <strong>aufs Browser-Fenster ziehen</strong> (Drag &amp; Drop).
      Während du ziehst, leuchtet ein gestrichelter Rahmen auf.
      Beim Loslassen öffnet sich der Import-Dialog automatisch.</li>
</ul>
<p>Die Vorlagen aus der Datei werden zur Liste hinzugefügt.
<strong>Bestehende Vorlagen werden nicht überschrieben</strong> —
bei Namens-Konflikt bekommt der Import ein <code>(2)</code>
angehängt.</p>

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

<h3>🔗 Teilen-Link (URL-Hash)</h3>
<p>Statt den Token per Hand zu kopieren, klick den Button
<strong>„🔗 Teilen-Link"</strong>. Das Tool erzeugt eine fertige
URL der Form <code>…/index.html#state=&lt;token&gt;</code> und kopiert
sie in die Zwischenablage. Wer den Link öffnet, sieht die Konfiguration
direkt geladen — kein Token-Einfügen mehr nötig.</p>
<p>Praktisch zum Posten in Discord / Forum / Mail. Wenn du den Link
in einem anderen Tab öffnest, fragt das Tool ggf. nach Bestätigung
(falls dort schon eine Konfiguration läuft).</p>

<h3>Tipps</h3>
<ul>
  <li><strong>Komprimierung</strong>: seit v4.0 werden Tokens automatisch
      mit gzip komprimiert. Du erkennst sie am Präfix <code>L:</code>.
      Alte unkomprimierte Tokens bleiben weiterhin lesbar.
      Typische Größe sank von 5–10 KB auf 1–2 KB.</li>
  <li>Tokens sind Versions-getaggt. Wenn jemand einen Token aus einer
      neueren Tool-Version schickt, kommt eine Warnung — Import wird
      trotzdem versucht (Felder, die das ältere Tool nicht kennt, werden
      ignoriert).</li>
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

<h3>Blöcke pro Tick (Coroutine-Chunk-Größe)</h3>
<p>Sobald Coroutines aktiv sind, erscheint ein Slider <strong>„Blöcke
pro Tick"</strong> (10–500, Default 50). Damit stellst du ein, wie viele
Blöcke pro Tick in der Aggregator-Berechnung abgearbeitet werden.</p>
<ul>
  <li>Kleiner Wert (10–25): geringere Last pro Tick, aber Aggregator-
      Berechnung braucht mehr Ticks bis sie fertig ist.</li>
  <li>Default 50: gute Balance für die meisten Skripte.</li>
  <li>Größer (100–500): schneller fertig, mehr Last pro Tick.</li>
</ul>
<p>Wenn du auch mit aktiven Coroutines „Script too complex" siehst,
runter mit dem Wert. Wenn die Aggregator-Werte zu „träge" wirken,
hoch.</p>

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

  expert: {
    title: "🛠 Experten-Modus",
    body: `
<p>Der Experten-Modus blendet zusätzliche Felder ein, die für die
meisten Skripte nicht nötig sind, Power-Usern aber Feintuning
ermöglichen. Aktivierung über den Button <strong>„🛠 Experten"</strong>
oben rechts im Header (leuchtet Akzent-farbig wenn aktiv).</p>
<p>Zustand wird in LocalStorage gespeichert. Bei deaktiviertem Modus
sind die Expert-Felder einfach unsichtbar — ihre Werte bleiben aber
im State erhalten, falls du den Modus später wieder aktivierst.</p>

<h3>Operator-Klammern in Bedingungen</h3>
<p>In C# (und Mathematik) gilt: <strong>UND vor ODER</strong>. Bei
gemischter Logik werden deine Bedingungen also automatisch geklammert:
<code>A oder B und C oder D</code> wird zu <code>A oder (B und C) oder D</code>.</p>
<p>Wenn du das anders willst (z. B. <code>(A oder B) und (C oder D)</code>),
brauchst du explizite Klammern. Im Experten-Modus erscheint dafür pro
Bedingung eine kleine Klammer-Reihe:</p>
<ul>
  <li><strong>„+ ("</strong> = „hier (also vor mir) öffnet eine Gruppe"</li>
  <li><strong>„+ )"</strong> = „hier (also nach mir) schließt eine Gruppe"</li>
  <li><strong>„−"</strong> daneben = letzte Klammer auf dieser Seite entfernen</li>
</ul>
<p>Die Klammern stehen also <em>zwischen</em> Bedingungen, nicht
<em>in</em> ihnen — pro Bedingung gibt's den „Anker" links (Gruppenanfang)
und rechts (Gruppenende). Beispiel für „(A oder B) und (C oder D)":</p>
<ul>
  <li>Bedingung A: vorne „+ (" → Counter zeigt <code>(</code></li>
  <li>Bedingung B (mit ODER): hinten „+ )" → Counter zeigt <code>)</code></li>
  <li>Bedingung C (mit UND): vorne „+ ("</li>
  <li>Bedingung D (mit ODER): hinten „+ )"</li>
</ul>
<p>Generierter Code: <code>((A) || (B)) && ((C) || (D))</code>.</p>
<p>Die inneren <code>(A)</code> / <code>(B)</code> setzt das Tool immer
automatisch um jede Bedingung — die siehst du in jedem Output. Die
äußeren Klammern (die Gruppen) sind das was du mit den Buttons
steuerst.</p>

<h3>Aggregator-Refresh-Intervall</h3>
<p>In der AUSFÜHRUNG-Sektion erscheint im Experten-Modus ein Slider
<strong>„Aggregator-Refresh alle N Ticks"</strong> (1–200, Default 1).</p>
<p>Bedeutung: Aggregator-Listen (für „Alle Blöcke vom Typ" und LCD-
Aggregator-Widgets) werden normalerweise <strong>jeden Tick</strong> neu
gesucht. Bei großen Grids mit vielen Aggregator-Bedingungen kann das
Performance kosten.</p>
<ul>
  <li><strong>1 (Default)</strong>: jeden Tick frisch — gleiches Verhalten
      wie vor v4.3.0.</li>
  <li><strong>10–100</strong>: Performance-Gewinn, neue Blöcke werden
      aber bis zu N Ticks später erkannt.</li>
  <li>SE-Wiki empfiehlt <strong>100+</strong> als guten Tuning-Punkt.</li>
</ul>
<p>Im Output emittiert das Tool dann ein <code>int _tickCounter</code>-
Feld und wrappt die Refresh-Logik in
<code>if ((_tickCounter++ % N) == 0) { … }</code>.</p>

<h3>Effekte-Toggle (Matrix-Scanlines + Cyberpunk-Glow)</h3>
<p>Neben den anderen Header-Buttons gibt's <strong>„✨ Effekte"</strong>
(kein Experten-Modus nötig). Schaltet themespezifische optische
Effekte ein:</p>
<ul>
  <li><strong>Matrix-Theme</strong>: feines CRT-Scanline-Overlay über
      die ganze Seite — gibt's nostalgisches Röhrenmonitor-Feeling.</li>
  <li><strong>Cyberpunk-Theme</strong>: Neon-Glow um Akzent-Elemente
      (Section-Titel, Buttons, Tag).</li>
  <li>Andere Themes: keine sichtbaren Effekte (gewollt).</li>
</ul>
<p>Zustand persistiert in LocalStorage.</p>

<h3>Theme-Preview-Thumbnails</h3>
<p>Das Theme-Dropdown oben rechts zeigt seit v4.2.0 pro Theme einen
<strong>kleinen Farb-Splitter</strong> (3 Streifen: Akzentfarbe,
Hintergrund, Text). Damit siehst du auf einen Blick wie ein Theme
wirkt, ohne es erst zu aktivieren. Klick öffnet die Liste, Klick auf
ein Theme wendet es an.</p>
`
  },

  rulesets: {
    title: "Regelsätze — mehrere WENN/DANN-Pakete",
    body: `
<p>Ein <strong>Regelsatz</strong> ist ein eigenständiges
WENN/DANN/SONST-Paket. Bis v4.3 hatte das Tool genau einen Regelsatz —
seit v5.0 kannst du <strong>mehrere unabhängige Regeln</strong> in
einem einzigen Skript anlegen.</p>

<h3>Wozu mehrere Regelsätze?</h3>
<p>Beispiel: Du möchtest in einem Skript zwei verschiedene Dinge
steuern, die nichts miteinander zu tun haben:</p>
<ul>
  <li><strong>Regel 1 — „Tür-Steuerung":</strong> Wenn Sensor 1 aktiv → Tür A öffnen, sonst schließen.</li>
  <li><strong>Regel 2 — „Notstrom":</strong> Wenn Hauptakku &lt; 20 % → Reaktoren einschalten.</li>
</ul>
<p>Statt das in zwei Bedingungen mit komplizierten UND/ODER-Verkettungen
zu pressen, baust du einfach zwei Regelsätze. Jeder hat eigene WENN-,
DANN- und SONST-Listen.</p>

<h3>Tab-Leiste</h3>
<p>Oben im Bereich <strong>::: REGELSÄTZE</strong> siehst du eine
Tab-Leiste. Jeder Tab ist ein Regelsatz. Aktionen pro Tab:</p>
<ul>
  <li><strong>Klick auf Tab</strong> — wechselt zu diesem Regelsatz. WENN/DANN/SONST darunter zeigen seinen Inhalt.</li>
  <li><strong>✎ (Stift)</strong> — Regelsatz umbenennen.</li>
  <li><strong>✕</strong> — Regelsatz löschen (mindestens einer muss übrigbleiben).</li>
  <li><strong>+ Neue Regel</strong> — leeren Regelsatz anhängen.</li>
</ul>

<h3>Wie wird daraus C# generiert?</h3>
<p>Im erzeugten <code>Main()</code> wird pro Regelsatz ein eigener
<code>if</code>-Block erzeugt, der nacheinander geprüft wird:</p>
<ul>
  <li><code>bool rule1_met = (…Bedingungen Regel 1…);</code></li>
  <li><code>if (rule1_met) { …DANN-Aktionen… } else { …SONST-Aktionen… }</code></li>
  <li><code>bool rule2_met = (…Bedingungen Regel 2…);</code></li>
  <li><code>if (rule2_met) { … } else { … }</code></li>
</ul>
<p>Block-Referenzen werden geteilt — wenn Regel 1 und Regel 2 dieselbe
Tür ansprechen, wird sie nur einmal gesucht.</p>

<h3>Wann lieber NICHT mehrere Regelsätze?</h3>
<p>Wenn deine Logik eigentlich <strong>eine</strong> Bedingung ist, nur
mit UND/ODER verkettet, bleib bei einem Regelsatz. Mehrere Regelsätze
sind für <em>thematisch unabhängige</em> Logik gedacht.</p>

<h3>Migration alter Vorlagen</h3>
<p>Vorlagen und Share-Tokens aus v4.x werden beim Laden automatisch in
„Regel 1" überführt. Du musst nichts manuell migrieren.</p>
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
  <li><strong>Duplikat-Warnung</strong> (gelb, ⚠): wenn derselbe Block-Name
      in unterschiedlichen Block-Typen verwendet wird (z. B. einmal als Tür,
      einmal als Akku). Das ist ein eindeutiger Konflikt — ein Block kann
      nicht zwei Typen sein. Wenn du denselben Namen mehrfach für denselben
      Typ verwendest (Tür „X" prüfen + öffnen), ist das KEIN Konflikt
      und löst keine Warnung aus.</li>
</ul>

<h3>Auto-Complete für Block-Namen</h3>
<p>Sobald du in einem Block-Name-Feld tippst, schlägt das Tool dir
<strong>alle Block-Namen vor</strong>, die du irgendwo anders schon
eingegeben hast (in Bedingungen, Aktionen, LCD-Composer). Klick auf
einen Vorschlag → wird übernommen. Verhindert Tippfehler bei
wiederverwendeten Namen.</p>

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
  <li>Smart-Snap: Widgets rasten an Kanten / Mitten / anderen Widgets ein.
      Beim Resize snappt das Widget zusätzlich an die <strong>Breite/Höhe
      anderer Widgets</strong> — praktisch für „gleich groß wie der Nachbar".</li>
</ul>

<h3>Mehrere Widgets gleichzeitig bearbeiten</h3>
<ul>
  <li><strong>Strg+A</strong>: alle Widgets auf einmal selektieren.</li>
  <li><strong>Lasso-Select</strong>: Maus-Drag auf dem Canvas-Hintergrund
      (nicht auf einem Widget) zieht ein gestricheltes Rechteck. Alle
      Widgets im Rahmen werden selektiert. Shift+Drag erweitert die
      Selektion statt zu ersetzen.</li>
  <li><strong>ESC</strong>: leert die Auswahl. <strong>Entf/Backspace</strong>:
      löscht alle selektierten Widgets (außerhalb von Inputs).</li>
  <li>Bei ≥2 selektierten Widgets erscheint in der Action-Bar eine
      <strong>Ausrichten-Reihe</strong>: links/Mitte/rechts (horizontal)
      und oben/Mitte/unten (vertikal). Referenz ist die Bounding-Box
      aller selektierten.</li>
  <li>Bei ≥3 selektierten Widgets zusätzlich
      <strong>Verteilen-Buttons</strong> (↔ horizontal, ↕ vertikal):
      gleiche Abstände zwischen den Widgets. Erstes und letztes
      bleiben stehen, mittlere werden umverteilt.</li>
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

  explanation: {
    title: "📖 Plain-Language-Beschreibung",
    body: `
<p>Im rechten Panel über dem generierten Code gibt es eine ausklappbare
Box <strong>„📖 Was macht dieses Skript?"</strong>. Sie beschreibt
deine aktuelle Konfiguration in <strong>natürlicher Sprache</strong> —
zum schnellen Überprüfen, ohne den C#-Code lesen zu müssen.</p>

<h3>Beispiel-Output</h3>
<blockquote>
„Etwa 6 mal pro Sekunde prüft das Skript, ob Sensor 1 etwas erkannt hat
und Hauptakku mehr als 50 % Ladung hat. Wenn ja, wird Schleuse geöffnet
und Notlicht eingeschaltet."
</blockquote>

<h3>Wie das funktioniert</h3>
<ul>
  <li>Die Beschreibung wird <strong>automatisch</strong> aus deinen
      WENN/DANN/SONST-Eingaben gebaut, sobald du etwas änderst.</li>
  <li>Catalog-Begriffe wie „Ist offen" werden in natürliche Sätze
      umgeformt: „… ist offen", „… mehr als 50 % geladen hat",
      „… etwas erkannt hat".</li>
  <li>Aktions-Verben werden zu Partizipien: „Öffnen" → „wird geöffnet",
      „Einschalten" → „wird eingeschaltet".</li>
  <li>Bei mehreren Aktionen wird automatisch Plural genutzt:
      „werden … geöffnet" statt „wird … geöffnet".</li>
  <li>Block-Gruppen und „Alle Blöcke vom Typ" werden mit Aggregator-
      Phrasen formuliert („mindestens einer der Akkus …", „die Summe
      über alle Solarpanels …").</li>
</ul>

<h3>Ein-/Ausklappen</h3>
<p>Klick auf den Box-Header schaltet zwischen offen und zu um. Der
Zustand wird gespeichert (LocalStorage) — beim nächsten Besuch
ist die Box wieder so wie du sie zugeklappt/aufgeklappt hattest.</p>

<h3>Sprache</h3>
<p>Bei einem Sprachwechsel (DE ↔ EN) wird die Beschreibung sofort
neu generiert. Override-Map deckt ~30 häufige Sonderfälle pro Sprache
ab (Sensor, Air Vent, Akku, Reaktor etc.). Wenn ein seltenes
Catalog-Label nicht abgedeckt ist, kommt eine generische Form
(„die Bedingung „X" erfüllt"). Sag Bescheid wenn dir ein Satz
holprig aufstößt — neue Übersetzungen sind schnell ergänzt.</p>

<h3>Limitierungen</h3>
<ul>
  <li>Bei numerischen Aggregator-Bedingungen (Sum/Avg/Min/Max) wird
      das Catalog-Label noch in Klammern als Hinweis gezeigt, weil
      der Aggregator das X-Argument ignoriert.</li>
  <li>Operator-Klammern (Expert-Mode) erscheinen in der Beschreibung
      noch nicht — der Satz baut die Reihenfolge wie eingetragen auf.</li>
</ul>
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
the Programmable Block in-game.</p>

<h3>What's in it</h3>
<ul>
  <li><strong>Visual builder</strong> for conditions and actions with drag &amp; drop.</li>
  <li><strong>Three block sources</strong> per condition/action: single
      block, block group, or all blocks of a type.</li>
  <li><strong>Aggregator modes</strong>: sum, average, min, max, count,
      any, all across multiple blocks.</li>
  <li><strong>Graphical LCD composer</strong> with sprite widgets, themes,
      presets, multi-LCD arrangement.</li>
  <li><strong>Templates + share tokens + share links</strong> for reuse
      and exchange.</li>
  <li><strong>Plain-language description</strong> next to the code that
      summarizes your configuration in natural language.</li>
  <li><strong>Auto-complete</strong> for block names and warnings on typos.</li>
  <li><strong>Expert mode</strong> with parentheses, aggregator refresh
      interval and more for power users.</li>
  <li><strong>Themes &amp; effects</strong> — nine themes, optional
      Matrix scanlines and cyberpunk glow.</li>
  <li><strong>Bilingual</strong> — German / English switchable live.</li>
</ul>

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

<h3>Per-template export (small ⤴ icon on chip)</h3>
<p>Each template chip has a small <strong>⤴</strong> icon between the
name and the ✕. Click → exports just this one template as its own
<code>.json</code> file. Handy for sharing single templates.</p>

<h3>Import — load templates from a file</h3>
<p>Two ways:</p>
<ul>
  <li>Click <strong>"⤵ Import"</strong> → pick a <code>.json</code>
      file → confirm.</li>
  <li>Or simply <strong>drag the <code>.json</code> file onto the
      browser window</strong>. While dragging, a dashed border lights
      up. On drop the import dialog opens automatically.</li>
</ul>
<p>Templates from the file are added to your list.
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

<h3>🔗 Share link (URL hash)</h3>
<p>Instead of copying the token manually, click the
<strong>"🔗 Share link"</strong> button. The tool builds a ready-made
URL of the form <code>…/index.html#state=&lt;token&gt;</code> and copies
it to the clipboard. Whoever opens the link sees the configuration
loaded directly — no token-pasting needed.</p>
<p>Great for Discord / forum / mail posts. Opening the link in another
tab asks for confirmation if there's already a configuration loaded.</p>

<h3>Tips</h3>
<ul>
  <li><strong>Compression</strong>: since v4.0, tokens are automatically
      gzipped. You can spot them by the <code>L:</code> prefix. Old
      uncompressed tokens remain readable. Typical size dropped from
      5–10 KB to 1–2 KB.</li>
  <li>Tokens are version-tagged. If someone sends a token from a newer
      tool version, you get a warning — import is still attempted
      (fields the older tool doesn't know are ignored).</li>
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

<h3>Blocks per tick (coroutine chunk size)</h3>
<p>Once coroutines are active, a slider <strong>"Blocks per tick"</strong>
appears (10–500, default 50). Controls how many blocks are processed
per tick in the aggregator computation.</p>
<ul>
  <li>Small (10–25): lower load per tick, but aggregator takes more
      ticks to finish.</li>
  <li>Default 50: good balance for most scripts.</li>
  <li>Large (100–500): finishes faster, more load per tick.</li>
</ul>
<p>If you still see "Script too complex" with coroutines on, lower the
value. If aggregator values feel sluggish, raise it.</p>

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

  rulesets: {
    title: "Rule sets — multiple IF/THEN packages",
    body: `
<p>A <strong>rule set</strong> is a self-contained IF/THEN/ELSE
package. Up to v4.3 the tool had exactly one rule set — since v5.0
you can build <strong>multiple independent rules</strong> inside a
single script.</p>

<h3>Why multiple rule sets?</h3>
<p>Example: you want to control two unrelated things in one script:</p>
<ul>
  <li><strong>Rule 1 — "Door control":</strong> If sensor 1 is active → open door A, else close.</li>
  <li><strong>Rule 2 — "Emergency power":</strong> If main battery &lt; 20 % → turn reactors on.</li>
</ul>
<p>Instead of squeezing both into one condition with complicated
AND/OR chains, just create two rule sets. Each has its own IF, THEN
and ELSE lists.</p>

<h3>Tab bar</h3>
<p>At the top of the <strong>::: RULE SETS</strong> section you see a
tab bar. Each tab is a rule set. Per-tab actions:</p>
<ul>
  <li><strong>Click a tab</strong> — switch to that rule set. IF/THEN/ELSE below show its content.</li>
  <li><strong>✎ (pencil)</strong> — rename the rule set.</li>
  <li><strong>✕</strong> — delete the rule set (at least one must remain).</li>
  <li><strong>+ New rule</strong> — append an empty rule set.</li>
</ul>

<h3>How is this turned into C#?</h3>
<p>In the generated <code>Main()</code> one <code>if</code>-block is
emitted per rule set, checked sequentially:</p>
<ul>
  <li><code>bool rule1_met = (…conditions of rule 1…);</code></li>
  <li><code>if (rule1_met) { …THEN actions… } else { …ELSE actions… }</code></li>
  <li><code>bool rule2_met = (…conditions of rule 2…);</code></li>
  <li><code>if (rule2_met) { … } else { … }</code></li>
</ul>
<p>Block references are shared — if rule 1 and rule 2 both reference
the same door, it's only looked up once.</p>

<h3>When NOT to use multiple rule sets</h3>
<p>If your logic is really <strong>one</strong> condition just
combined with AND/OR, stay with a single rule set. Multiple rule sets
are meant for <em>thematically independent</em> logic.</p>

<h3>Migration of older templates</h3>
<p>Templates and share tokens from v4.x are automatically loaded into
"Rule 1" — nothing to migrate manually.</p>
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
  <li><strong>Duplicate warning</strong> (yellow, ⚠): when the same
      block name is used across different block types (e.g. once as a
      Door, once as a Battery). That's a real conflict — one block
      can't be two types. Reusing the same name within the same type
      (Door "X" checked + opened) is NOT a conflict and doesn't trigger
      a warning.</li>
</ul>

<h3>Auto-complete for block names</h3>
<p>While typing in a block name field, the tool suggests all block
names you've already entered elsewhere (conditions, actions, LCD
composer). Click a suggestion → it's filled in. Prevents typos when
reusing names.</p>

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
  <li>Smart snap: widgets snap to edges / centers / other widgets.
      On resize, widgets also snap to the <strong>width/height of
      other widgets</strong> — handy for "same size as the neighbor".</li>
</ul>

<h3>Editing multiple widgets at once</h3>
<ul>
  <li><strong>Ctrl+A</strong>: select all widgets at once.</li>
  <li><strong>Lasso select</strong>: mouse-drag on the canvas background
      (not on a widget) draws a dashed rectangle. All widgets inside
      get selected. Shift-drag extends the selection instead of
      replacing.</li>
  <li><strong>ESC</strong>: clear the selection. <strong>Del/Backspace</strong>:
      delete all selected widgets (outside of input fields).</li>
  <li>With ≥2 widgets selected, the action bar shows an
      <strong>align row</strong>: left/center/right (horizontal) and
      top/middle/bottom (vertical). Reference is the bounding box of
      the selection.</li>
  <li>With ≥3 widgets, additional <strong>distribute buttons</strong>
      (↔ horizontal, ↕ vertical) space widgets evenly. First and last
      stay put, middle ones redistribute.</li>
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

  explanation: {
    title: "📖 Plain-language description",
    body: `
<p>The right panel above the generated code has a collapsible box
<strong>"📖 What does this script do?"</strong>. It describes your
current configuration in <strong>natural language</strong> — for quick
verification without reading the C# code.</p>

<h3>Example output</h3>
<blockquote>
"About 6 times per second the script checks whether Sensor 1 has
detected something and Main Battery has more than 50 % charge. If so,
Airlock is opened and Emergency Light is turned on."
</blockquote>

<h3>How it works</h3>
<ul>
  <li>The description is built <strong>automatically</strong> from your
      IF/THEN/ELSE entries whenever you change something.</li>
  <li>Catalog terms like "Is open" are rewritten into natural
      sentences: "… is open", "… has more than 50 % charge",
      "… has detected something".</li>
  <li>Action verbs become past participles: "Open" → "is opened",
      "Turn on" → "is turned on".</li>
  <li>With multiple actions the plural form is used automatically:
      "are … opened" instead of "is … opened".</li>
  <li>Block groups and "all blocks of type" use aggregator phrasing
      ("at least one of the batteries …", "the sum across all
      solar panels …").</li>
</ul>

<h3>Expand/collapse</h3>
<p>Click the box header to toggle. The state is saved (LocalStorage) —
next visit the box opens in the same state as you left it.</p>

<h3>Language</h3>
<p>On a language switch (DE ↔ EN) the description regenerates instantly.
An override map covers ~30 common cases per language (sensor, air vent,
battery, reactor etc.). Rare catalog labels fall back to a generic
form ("meets the condition 'X'"). Let me know if a sentence feels
clunky — translations are easy to add.</p>

<h3>Limitations</h3>
<ul>
  <li>For numeric aggregator conditions (sum/avg/min/max) the catalog
      label is still shown in parentheses as a hint, since the
      aggregator ignores the X argument.</li>
  <li>Operator parentheses (expert mode) are not reflected in the
      description yet — the sentence is built in the order you entered.</li>
</ul>
`
  },

  expert: {
    title: "🛠 Expert mode",
    body: `
<p>Expert mode reveals extra fields that aren't needed for most
scripts but allow power-user tuning. Activate it via the
<strong>"🛠 Expert"</strong> button top-right (lights up in accent
color when active).</p>
<p>The state is saved in LocalStorage. When disabled, expert fields
are simply hidden — their values remain in state if you re-enable
the mode later.</p>

<h3>Operator parentheses in conditions</h3>
<p>In C# (and math): <strong>AND before OR</strong>. With mixed logic
your conditions are auto-grouped: <code>A or B and C or D</code>
becomes <code>A or (B and C) or D</code>.</p>
<p>If you want it differently (e.g. <code>(A or B) and (C or D)</code>)
you need explicit parentheses. In expert mode a small parenthesis row
appears per condition:</p>
<ul>
  <li><strong>"+ ("</strong> = "here (before me) a group opens"</li>
  <li><strong>"+ )"</strong> = "here (after me) a group closes"</li>
  <li><strong>"−"</strong> = remove the last parenthesis on that side</li>
</ul>
<p>So the parentheses sit <em>between</em> conditions, not <em>in</em>
them — each condition just has "anchors" on the left (group start) and
right (group end). Example for "(A or B) and (C or D)":</p>
<ul>
  <li>Condition A: left "+ (" → counter shows <code>(</code></li>
  <li>Condition B (OR): right "+ )" → counter shows <code>)</code></li>
  <li>Condition C (AND): left "+ ("</li>
  <li>Condition D (OR): right "+ )"</li>
</ul>
<p>Generated code: <code>((A) || (B)) && ((C) || (D))</code>.</p>
<p>The inner <code>(A)</code> / <code>(B)</code> are always added by
the tool around each single condition. The outer ones (the groups) are
what you control with the buttons.</p>

<h3>Aggregator refresh interval</h3>
<p>In the EXECUTION section, expert mode shows a slider
<strong>"Aggregator refresh every N ticks"</strong> (1–200, default 1).</p>
<p>Meaning: aggregator lists (for "all blocks of type" and LCD
aggregator widgets) normally refresh <strong>every tick</strong>. On
big grids with many aggregator conditions, that can cost performance.</p>
<ul>
  <li><strong>1 (default)</strong>: refresh each tick — pre-v4.3.0 behavior.</li>
  <li><strong>10–100</strong>: performance gain, but new blocks are
      detected up to N ticks later.</li>
  <li>SE wiki suggests <strong>100+</strong> as a good tuning target.</li>
</ul>
<p>The tool emits an <code>int _tickCounter</code> field and wraps the
refresh logic in <code>if ((_tickCounter++ % N) == 0) { … }</code>.</p>

<h3>Effects toggle (Matrix scanlines + cyberpunk glow)</h3>
<p>Next to the other header buttons there's <strong>"✨ Effects"</strong>
(no expert mode needed). Toggles theme-specific visual effects:</p>
<ul>
  <li><strong>Matrix theme</strong>: a fine CRT scanline overlay
      across the whole page — nostalgic tube-monitor feel.</li>
  <li><strong>Cyberpunk theme</strong>: neon glow around accent
      elements (section titles, buttons, tag).</li>
  <li>Other themes: no visible effect (intentional).</li>
</ul>
<p>State persists in LocalStorage.</p>

<h3>Theme preview thumbnails</h3>
<p>The theme dropdown top-right shows a <strong>small color swatch</strong>
per theme since v4.2.0 (3 stripes: accent, panel, text). Lets you
see at a glance how a theme looks without activating it. Click opens
the list, click on a theme applies it.</p>
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
