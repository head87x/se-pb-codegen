// ============================================================
// THEMED MODAL DIALOGS (v1.4.1)
// ============================================================
// Ersetzt die Browser-nativen alert()/confirm()/prompt() durch
// theme-konforme Dialoge. Alle drei geben ein Promise zurück, das
// auf Klick (oder Enter/Escape) auflöst.
//
// Benutzung:
//   const ok    = await showConfirm("Wirklich löschen?");
//   const name  = await showPrompt("Name?", "Default");
//   await showAlert("Fertig.");

let _modalOverlay = null;
let _modalResolve = null;
let _modalKeyHandler = null;

function _modalEnsure() {
  if (_modalOverlay) return _modalOverlay;
  const ov = document.createElement("div");
  ov.className = "modal-overlay";
  ov.innerHTML = `
    <div class="modal-box" role="dialog" aria-modal="true">
      <div class="modal-title" id="modal-title"></div>
      <div class="modal-body">
        <div class="modal-message" id="modal-message"></div>
        <input class="modal-input" id="modal-input" type="text" style="display:none;" />
      </div>
      <div class="modal-actions">
        <button class="modal-cancel" id="modal-cancel">Abbrechen</button>
        <button class="modal-confirm primary" id="modal-confirm">OK</button>
      </div>
    </div>`;
  document.body.appendChild(ov);

  ov.querySelector("#modal-cancel").addEventListener("click", () => _modalClose(false));
  ov.querySelector("#modal-confirm").addEventListener("click", () => _modalClose(true));
  // Klick außerhalb des Box-Bereichs = Abbrechen
  ov.addEventListener("click", e => { if (e.target === ov) _modalClose(false); });

  _modalOverlay = ov;
  return ov;
}

function _modalClose(confirmed) {
  if (!_modalOverlay || !_modalResolve) return;
  const inp = _modalOverlay.querySelector("#modal-input");
  const isPrompt = inp && inp.style.display !== "none";
  const result = confirmed ? (isPrompt ? inp.value : true) : (isPrompt ? null : false);
  _modalOverlay.classList.remove("show");
  if (_modalKeyHandler) {
    document.removeEventListener("keydown", _modalKeyHandler);
    _modalKeyHandler = null;
  }
  const resolve = _modalResolve;
  _modalResolve = null;
  resolve(result);
}

function _modalShow(opts) {
  const ov = _modalEnsure();
  ov.querySelector("#modal-title").textContent = opts.title || "";
  // \n im message erhalten: white-space pre-wrap in CSS
  ov.querySelector("#modal-message").textContent = opts.message || "";
  const inp = ov.querySelector("#modal-input");
  if (opts.hasInput) {
    inp.style.display = "";
    inp.value = opts.defaultValue || "";
    inp.placeholder = opts.placeholder || "";
  } else {
    inp.style.display = "none";
  }
  const cancel = ov.querySelector("#modal-cancel");
  if (opts.hideCancel) {
    cancel.style.display = "none";
  } else {
    cancel.style.display = "";
    cancel.textContent = opts.cancelLabel || "Abbrechen";
  }
  ov.querySelector("#modal-confirm").textContent = opts.confirmLabel || "OK";

  return new Promise(resolve => {
    _modalResolve = resolve;
    ov.classList.add("show");
    setTimeout(() => {
      if (opts.hasInput) inp.focus(); else ov.querySelector("#modal-confirm").focus();
      if (opts.hasInput) inp.select();
    }, 0);

    _modalKeyHandler = (e) => {
      if (e.key === "Escape") { e.preventDefault(); _modalClose(false); }
      else if (e.key === "Enter") {
        // Bei prompt: Enter im Input bestätigt; bei confirm/alert: Enter bestätigt überall
        const target = e.target;
        if (target && target.tagName === "INPUT" && target !== inp) return;
        e.preventDefault();
        _modalClose(true);
      }
    };
    document.addEventListener("keydown", _modalKeyHandler);
  });
}

function _i18n(key, fallback) {
  return (typeof t === "function") ? t(key) : fallback;
}

function showConfirm(message, options) {
  options = options || {};
  return _modalShow({
    title:        options.title        || _i18n("modal.title.confirm", "Bestätigung"),
    message:      message,
    cancelLabel:  options.cancelLabel  || _i18n("modal.cancel",        "Abbrechen"),
    confirmLabel: options.confirmLabel || _i18n("modal.confirm",       "Bestätigen"),
    hasInput:     false
  });
}

function showPrompt(message, defaultValue, options) {
  options = options || {};
  return _modalShow({
    title:        options.title        || _i18n("modal.title.prompt", "Eingabe"),
    message:      message,
    cancelLabel:  options.cancelLabel  || _i18n("modal.cancel",       "Abbrechen"),
    confirmLabel: options.confirmLabel || _i18n("modal.ok",           "OK"),
    hasInput:     true,
    defaultValue: defaultValue || "",
    placeholder:  options.placeholder  || ""
  });
}

function showAlert(message, options) {
  options = options || {};
  return _modalShow({
    title:        options.title        || _i18n("modal.title.alert", "Hinweis"),
    message:      message,
    confirmLabel: options.confirmLabel || _i18n("modal.ok",          "OK"),
    hasInput:     false,
    hideCancel:   true
  });
}

// ============================================================
// v3.1.0 — Hilfe-Modal mit Sidebar (Inhaltsverzeichnis) + Content
// ============================================================
function showHelp(sectionId) {
  const initial = sectionId || "overview";
  const ov = _modalEnsure();
  // Layout des Help-Modals selbst zusammenbauen: Sidebar + Content
  ov.querySelector("#modal-title").textContent = _i18n("help.title", "Hilfe");
  const msgEl = ov.querySelector("#modal-message");
  msgEl.innerHTML = "";

  const wrap = document.createElement("div");
  wrap.className = "help-modal-wrap";

  const sidebar = document.createElement("div");
  sidebar.className = "help-modal-sidebar";
  const content = document.createElement("div");
  content.className = "help-modal-content";

  const sections = (typeof getHelpSections === "function") ? getHelpSections() : [];
  const renderContent = (id) => {
    const sec = (typeof getHelpSection === "function") ? getHelpSection(id) : null;
    if (!sec) {
      content.innerHTML = `<p><em>${_i18n("help.notfound", "Abschnitt nicht gefunden.")}</em></p>`;
      return;
    }
    content.innerHTML = `<h2>${sec.title}</h2>${sec.body}`;
    content.scrollTop = 0;
    sidebar.querySelectorAll(".help-sidebar-item").forEach(el => {
      el.classList.toggle("active", el.dataset.section === id);
    });
  };

  sidebar.innerHTML = sections.map(s => `
    <div class="help-sidebar-item" data-section="${s.id}">
      <span class="help-sidebar-icon">${s.icon}</span>
      <span class="help-sidebar-title">${s.title}</span>
    </div>
  `).join("");
  sidebar.querySelectorAll(".help-sidebar-item").forEach(el => {
    el.addEventListener("click", () => renderContent(el.dataset.section));
  });

  wrap.appendChild(sidebar);
  wrap.appendChild(content);
  msgEl.appendChild(wrap);
  msgEl.classList.add("help-modal-message");

  // Eingabe-Feld verstecken, Cancel-Button raus, Confirm = Schliessen
  const inp = ov.querySelector("#modal-input");
  inp.style.display = "none";
  const cancel = ov.querySelector("#modal-cancel");
  cancel.style.display = "none";
  ov.querySelector("#modal-confirm").textContent = _i18n("help.close", "Schließen");

  renderContent(initial);

  return new Promise(resolve => {
    _modalResolve = () => {
      // Aufräumen: help-spezifische Markup-Reste entfernen
      msgEl.classList.remove("help-modal-message");
      resolve();
    };
    ov.classList.add("show");

    _modalKeyHandler = (e) => {
      if (e.key === "Escape") { e.preventDefault(); _modalClose(false); }
    };
    document.addEventListener("keydown", _modalKeyHandler);
  });
}

// Zeigt den reinen Code in einem themed Modal mit selektierbarem
// Container. Wird vom „Klartext"-Button im Output-Bereich aufgerufen.
function showCodeView(code) {
  const ov = _modalEnsure();
  ov.querySelector("#modal-title").textContent = _i18n("code.plain.title", "Code als Klartext");
  // Message ersetzen wir durch ein scrollbares <pre> mit dem Code
  const msgEl = ov.querySelector("#modal-message");
  msgEl.innerHTML = "";
  const hint = document.createElement("div");
  hint.style.fontSize = "11px";
  hint.style.color = "var(--muted)";
  hint.style.marginBottom = "8px";
  hint.textContent = _i18n("code.plain.hint", "Strg+A markiert alles, Strg+C kopiert.");
  const pre = document.createElement("pre");
  pre.className = "modal-code";
  pre.textContent = code || "";
  msgEl.appendChild(hint);
  msgEl.appendChild(pre);
  // Input verstecken (kein Prompt)
  const inp = ov.querySelector("#modal-input");
  inp.style.display = "none";
  // Cancel-Button raus, nur „Schließen"-Confirm
  const cancel = ov.querySelector("#modal-cancel");
  cancel.style.display = "none";
  ov.querySelector("#modal-confirm").textContent = _i18n("modal.ok", "Schließen");

  return new Promise(resolve => {
    _modalResolve = () => resolve();
    ov.classList.add("show");
    setTimeout(() => pre.focus(), 0);

    _modalKeyHandler = (e) => {
      if (e.key === "Escape") { e.preventDefault(); _modalClose(false); }
    };
    document.addEventListener("keydown", _modalKeyHandler);
  });
}
