// ============================================================
// I18N (v1.6.0) — Deutsch / English Sprach-Umschaltung
// ============================================================
// Inline Stringtable (kein file://-Fetch nötig) für die UI-Strings.
// Block-Katalog-Labels und Tooltip-Texte (DESCRIPTIONS) bleiben in
// einer späteren Phase auf Deutsch — werden mit eigenem Schlüsselsystem
// migriert.
//
// Nutzung:
//   t("templates.save")              → "Speichern" / "Save"
//   t("toast.template_saved", "X")    → "Vorlage „X" gespeichert"
//
// HTML-Bindings:
//   <span data-i18n="templates.title">VORLAGEN</span>
//   <input data-i18n-placeholder="palette.search" placeholder="...">

const I18N_LANGS = ["de", "en"];
const I18N_DEFAULT = "de";
const I18N_STORAGE_KEY = "se_pb_lang";

const I18N = {
  de: {
    // Header
    "header.theme":          "THEME",
    "header.lang":           "SPRACHE",
    "header.subtitle":       "SPACE ENGINEERS PROGRAMMABLE BLOCK",
    // Palette
    "palette.title":         "▶ BLÖCKE",
    "palette.tag":           "[ DRAG ]",
    "palette.search":        "Suche…",
    "palette.help":          "Block ins WENN/DANN/SONST ziehen, oder weiter \"+ Bedingung/Aktion\" verwenden.",
    // Builder
    "builder.title":         "▶ BAUKASTEN",
    "builder.tag":           "[ INPUT ]",
    // Templates
    "templates.title":       "::: VORLAGEN",
    "templates.save":        "+ Speichern",
    "templates.new":         "⟲ Neu",
    "templates.empty":       "Keine Vorlagen gespeichert.",
    "templates.prompt_name": "Name der Vorlage:",
    "templates.prompt_ph":   "z.B. Reaktor-Überwachung",
    "templates.delete_q":    "Vorlage „{0}\" löschen?",
    "templates.delete_btn":  "Löschen",
    "templates.new_q":       "Aktuelles Projekt verwerfen und neu starten?",
    "templates.new_btn":     "Verwerfen",
    // Share-Token
    "share.title":           "::: SHARE-TOKEN",
    "share.export":          "💾 Token erzeugen",
    "share.import":          "📥 Token laden",
    "share.help":            "Speichert / lädt deine komplette Konfiguration (Bedingungen, Aktionen, LCD-Baukasten) als kopierbaren Token. Token-Inhalt liegt direkt in der Zeichenkette — kein Server, kein Account.",
    "share.placeholder":     "Hier Token einfügen und „Token laden\" klicken — oder „Token erzeugen\" für den aktuellen Stand.",
    "share.confirm_replace": "Aktuellen Stand mit Token-Inhalt ersetzen?\n\nToken enthält: {0}\nErzeugt: {1}",
    "share.replace_btn":     "Ersetzen",
    "share.summary":         "{0} Bedingung(en), {1} LCD-Widget(s)",
    "share.token_len":       "Token-Länge: {0} Zeichen",
    "share.toast_created":   "Token erzeugt ({0} Zeichen) — kopiert",
    "share.toast_created_manual": "Token erzeugt ({0} Zeichen) — manuell kopieren",
    "share.toast_no_input":  "Bitte erst Token einfügen",
    "share.toast_bad_format":"Token ungültig (nicht lesbar)",
    "share.toast_bad_data":  "Token ungültig (Inhalt unvollständig)",
    "share.toast_new_version":"Token aus neuerer Tool-Version (v{0}) — bitte Tool aktualisieren",
    "share.toast_loaded":    "Token geladen — Konfiguration wiederhergestellt",
    // Execution
    "exec.title":            "::: AUSFÜHRUNG",
    "exec.mode":             "Modus",
    "exec.argument":         "Manuell (per Argument / Button)",
    "exec.continuous":       "Kontinuierlich (jeden Tick)",
    "exec.timer1":           "Alle 1 Sekunde (Update1)",
    "exec.timer10":          "Alle 10 Ticks (Update10)",
    "exec.timer100":         "Alle 100 Ticks (Update100)",
    // Conditions / Actions / Else
    "cond.title":            "::: WENN (Bedingungen)",
    "cond.add":              "+ Bedingung",
    "cond.empty":            "Keine Bedingungen — Aktion läuft immer.",
    "act.title":             "::: DANN (Aktionen)",
    "act.add":               "+ Aktion",
    "act.empty":             "Noch keine Aktionen.",
    "else.title":            "::: SONST (optional)",
    "else.empty":            "Keine SONST-Aktionen.",
    // LCD Text
    "lcdtext.title":         "::: LCD STATUS-AUSGABE (Text)",
    "lcdtext.enable":        "Aktivieren",
    "lcdtext.name":          "LCD Block-Name",
    "lcdtext.placeholder":   "z.B. LCD Status",
    "lcdtext.help":          "Einfache Text-Ausgabe: schreibt Status, Bedingungen und Aktionen aufs LCD.",
    // LCD Composer
    "lcd.title":             "::: LCD BAUKASTEN (Grafik)",
    "lcd.enable":            "Aktivieren",
    "lcd.source":            "Display-Quelle",
    "lcd.source.external":   "Eigenständiges LCD (Block-Name)",
    "lcd.source.pb":         "Programmable Block (dieser PB)",
    "lcd.source.cockpit":    "Cockpit / Sitz / Remote",
    "lcd.name":              "LCD / Cockpit Block-Name",
    "lcd.name_ph":           "z.B. LCD Cockpit",
    "lcd.surface":           "Surface-Index (0 = Hauptdisplay)",
    "lcd.surface_help":      "PB hat meist nur Index 0. Cockpits: 0–7 je nach Modell.",
    "lcd.format":            "LCD-Format (nur für Vorschau)",
    "lcd.preset":            "Schnellstart",
    "lcd.help":              "Widgets per Maus in der Vorschau positionieren und skalieren. Der generierte C#-Code nutzt zur Laufzeit das echte LCD-Format aus dem Spiel.",
    "lcd.multi.toggle":      "Multi-LCD-Anordnung (mehrere benachbarte LCDs als ein virtuelles Display)",
    "lcd.multi.cols":        "Spalten",
    "lcd.multi.rows":        "Reihen",
    "lcd.multi.pattern":     "Namensmuster",
    "lcd.multi.help":        "Platzhalter: {col} = A, B, C, … · {row} = 1, 2, 3, … · {c}/{r} = numerisch (1, 2, 3, …)",
    "lcd.preset.confirm":    "Preset „{0}\" laden? Die aktuellen {1} Widget(s) werden ersetzt.",
    "lcd.preset.replace":    "Ersetzen",
    // Code output
    "code.title":            "▶ GENERIERTER CODE",
    "code.copy":             "⧉ Kopieren",
    "code.download":         "⤓ Download",
    // Footer
    "footer":                "⌬ Generiert C# Code für den Programmable Block :: Code prüfen, kopieren, in PB einfügen, \"Check Code\" → \"Remember & Exit\"",
    // Modal
    "modal.cancel":          "Abbrechen",
    "modal.ok":              "OK",
    "modal.confirm":         "Bestätigen",
    "modal.title.confirm":   "Bestätigung",
    "modal.title.prompt":    "Eingabe",
    "modal.title.alert":     "Hinweis",
    // Group toggle
    "group.cond":            "Auf Block-Gruppe anwenden (Bedingung erfüllt, sobald irgendein Block der Gruppe sie erfüllt)",
    "group.act":             "Auf Block-Gruppe anwenden (Aktion läuft für alle Blöcke der Gruppe)",
    "group.name":            "Gruppen-Name (im Spiel)",
    "group.name_ph":         "exakter Name der Block-Gruppe",
    "block.name":            "Block-Name (im Spiel)",
    "block.name_ph":         "exakter Name aus Terminal",
    // Render-time labels
    "label.blocktype":       "Block-Typ",
    "label.check":           "Prüfung",
    "label.action":          "Aktion",
    "label.logic.and":       "UND",
    "label.logic.or":        "ODER",
    "btn.remove":            "✕ Entfernen",
    "toast.template_saved":  "Vorlage „{0}\" gespeichert",
    "toast.template_loaded": "„{0}\" geladen",
    "toast.copied":          "Code in Zwischenablage kopiert"
  },

  en: {
    "header.theme":          "THEME",
    "header.lang":           "LANGUAGE",
    "header.subtitle":       "SPACE ENGINEERS PROGRAMMABLE BLOCK",
    "palette.title":         "▶ BLOCKS",
    "palette.tag":           "[ DRAG ]",
    "palette.search":        "Search…",
    "palette.help":          "Drag a block into IF/THEN/ELSE, or use \"+ Condition/Action\".",
    "builder.title":         "▶ BUILDER",
    "builder.tag":           "[ INPUT ]",
    "templates.title":       "::: TEMPLATES",
    "templates.save":        "+ Save",
    "templates.new":         "⟲ New",
    "templates.empty":       "No templates saved.",
    "templates.prompt_name": "Template name:",
    "templates.prompt_ph":   "e.g. Reactor Monitor",
    "templates.delete_q":    "Delete template \"{0}\"?",
    "templates.delete_btn":  "Delete",
    "templates.new_q":       "Discard current project and start over?",
    "templates.new_btn":     "Discard",
    "share.title":           "::: SHARE-TOKEN",
    "share.export":          "💾 Generate token",
    "share.import":          "📥 Load token",
    "share.help":            "Saves / loads your entire configuration (conditions, actions, LCD-builder) as a copy-paste token. The token itself contains the data — no server, no account.",
    "share.placeholder":     "Paste a token here and click \"Load token\" — or click \"Generate token\" for the current state.",
    "share.confirm_replace": "Replace current state with token contents?\n\nToken contains: {0}\nCreated: {1}",
    "share.replace_btn":     "Replace",
    "share.summary":         "{0} condition(s), {1} LCD widget(s)",
    "share.token_len":       "Token length: {0} chars",
    "share.toast_created":   "Token generated ({0} chars) — copied",
    "share.toast_created_manual": "Token generated ({0} chars) — copy manually",
    "share.toast_no_input":  "Please paste a token first",
    "share.toast_bad_format":"Token invalid (unreadable)",
    "share.toast_bad_data":  "Token invalid (incomplete content)",
    "share.toast_new_version":"Token from newer tool version (v{0}) — please update the tool",
    "share.toast_loaded":    "Token loaded — configuration restored",
    "exec.title":            "::: EXECUTION",
    "exec.mode":             "Mode",
    "exec.argument":         "Manual (argument / button)",
    "exec.continuous":       "Continuous (every tick)",
    "exec.timer1":           "Every 1 second (Update1)",
    "exec.timer10":          "Every 10 ticks (Update10)",
    "exec.timer100":         "Every 100 ticks (Update100)",
    "cond.title":            "::: IF (conditions)",
    "cond.add":              "+ Condition",
    "cond.empty":            "No conditions — action always runs.",
    "act.title":             "::: THEN (actions)",
    "act.add":               "+ Action",
    "act.empty":             "No actions yet.",
    "else.title":            "::: ELSE (optional)",
    "else.empty":            "No ELSE actions.",
    "lcdtext.title":         "::: LCD STATUS OUTPUT (text)",
    "lcdtext.enable":        "Enable",
    "lcdtext.name":          "LCD block name",
    "lcdtext.placeholder":   "e.g. LCD Status",
    "lcdtext.help":          "Simple text output: writes status, conditions and actions to the LCD.",
    "lcd.title":             "::: LCD BUILDER (graphics)",
    "lcd.enable":            "Enable",
    "lcd.source":            "Display source",
    "lcd.source.external":   "Standalone LCD (by block name)",
    "lcd.source.pb":         "Programmable Block (this PB)",
    "lcd.source.cockpit":    "Cockpit / seat / remote",
    "lcd.name":              "LCD / cockpit block name",
    "lcd.name_ph":           "e.g. LCD Cockpit",
    "lcd.surface":           "Surface index (0 = main display)",
    "lcd.surface_help":      "PBs usually have only index 0. Cockpits: 0–7 depending on model.",
    "lcd.format":            "LCD format (preview only)",
    "lcd.preset":            "Quick-start",
    "lcd.help":              "Position and scale widgets with the mouse in the preview. The generated C# code uses the actual LCD format from the game at runtime.",
    "lcd.multi.toggle":      "Multi-LCD layout (several adjacent LCDs as one virtual display)",
    "lcd.multi.cols":        "Columns",
    "lcd.multi.rows":        "Rows",
    "lcd.multi.pattern":     "Name pattern",
    "lcd.multi.help":        "Placeholders: {col} = A, B, C, … · {row} = 1, 2, 3, … · {c}/{r} = numeric (1, 2, 3, …)",
    "lcd.preset.confirm":    "Load preset \"{0}\"? The current {1} widget(s) will be replaced.",
    "lcd.preset.replace":    "Replace",
    "code.title":            "▶ GENERATED CODE",
    "code.copy":             "⧉ Copy",
    "code.download":         "⤓ Download",
    "footer":                "⌬ Generates C# code for the Programmable Block :: review code, copy, paste into PB, \"Check Code\" → \"Remember & Exit\"",
    "modal.cancel":          "Cancel",
    "modal.ok":              "OK",
    "modal.confirm":         "Confirm",
    "modal.title.confirm":   "Confirmation",
    "modal.title.prompt":    "Input",
    "modal.title.alert":     "Notice",
    "group.cond":            "Apply to a block group (condition met as soon as any block in the group meets it)",
    "group.act":             "Apply to a block group (action runs for every block in the group)",
    "group.name":            "Group name (in-game)",
    "group.name_ph":         "exact name of the block group",
    "block.name":            "Block name (in-game)",
    "block.name_ph":         "exact name from terminal",
    "label.blocktype":       "Block type",
    "label.check":           "Check",
    "label.action":          "Action",
    "label.logic.and":       "AND",
    "label.logic.or":        "OR",
    "btn.remove":            "✕ Remove",
    "toast.template_saved":  "Template \"{0}\" saved",
    "toast.template_loaded": "\"{0}\" loaded",
    "toast.copied":          "Code copied to clipboard"
  }
};

function getLang() {
  try {
    const s = localStorage.getItem(I18N_STORAGE_KEY);
    return I18N_LANGS.includes(s) ? s : I18N_DEFAULT;
  } catch (_) { return I18N_DEFAULT; }
}

function setLang(lang) {
  if (!I18N_LANGS.includes(lang)) lang = I18N_DEFAULT;
  try { localStorage.setItem(I18N_STORAGE_KEY, lang); } catch (_) {}
  document.documentElement.setAttribute("lang", lang);
  _applyI18nDom();
  const sel = document.getElementById("lang-select");
  if (sel) sel.value = lang;
  if (typeof render === "function") render();
}

// t(key, ...args) — Substitution: {0}, {1}, … durch args ersetzen.
function t(key, ...args) {
  const lang = getLang();
  const tbl = I18N[lang] || I18N[I18N_DEFAULT];
  let s = (tbl && tbl[key]) || (I18N[I18N_DEFAULT] && I18N[I18N_DEFAULT][key]) || key;
  if (args.length) {
    s = s.replace(/\{(\d+)\}/g, (_, i) => {
      const idx = parseInt(i, 10);
      return args[idx] !== undefined ? args[idx] : "";
    });
  }
  return s;
}

function _applyI18nDom() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
  });
  document.querySelectorAll("[data-i18n-title]").forEach(el => {
    el.title = t(el.getAttribute("data-i18n-title"));
  });
}

function initI18n() {
  const lang = getLang();
  document.documentElement.setAttribute("lang", lang);
  _applyI18nDom();
}

function langOptions() {
  const cur = getLang();
  const labels = { de: "DE — Deutsch", en: "EN — English" };
  return I18N_LANGS.map(l => `<option value="${l}"${l === cur ? " selected" : ""}>${labels[l]}</option>`).join("");
}
