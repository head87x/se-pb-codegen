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

function showConfirm(message, options) {
  options = options || {};
  return _modalShow({
    title:        options.title        || "Bestätigung",
    message:      message,
    cancelLabel:  options.cancelLabel  || "Abbrechen",
    confirmLabel: options.confirmLabel || "Bestätigen",
    hasInput:     false
  });
}

function showPrompt(message, defaultValue, options) {
  options = options || {};
  return _modalShow({
    title:        options.title        || "Eingabe",
    message:      message,
    cancelLabel:  options.cancelLabel  || "Abbrechen",
    confirmLabel: options.confirmLabel || "OK",
    hasInput:     true,
    defaultValue: defaultValue || "",
    placeholder:  options.placeholder  || ""
  });
}

function showAlert(message, options) {
  options = options || {};
  return _modalShow({
    title:        options.title        || "Hinweis",
    message:      message,
    confirmLabel: options.confirmLabel || "OK",
    hasInput:     false,
    hideCancel:   true
  });
}
