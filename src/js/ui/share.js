// ============================================================
// SHARE-TOKEN (v1.4.0)
// ============================================================
// Speichert/lädt den kompletten State als kopierbarer Base64-Token.
// Funktioniert komplett offline — kein Backend nötig, der Token
// trägt die State-JSON selbst.
//
// Token-Format: Base64-codierte UTF-8-JSON:
//   {
//     "v":  1,                  // Schema-Version
//     "ts": "ISO-Datum",        // Wann erzeugt
//     "state": { ...full state... }
//   }
//
// Bei späteren State-Modell-Änderungen wird `v` hochgezählt und die
// Lade-Funktion migriert defensiv.

const SHARE_TOKEN_VERSION = 1;

function _shareEncodeB64(str) {
  // UTF-8-sicher: erst in Bytes, dann in Latin1-Binary für btoa.
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function _shareDecodeB64(b64) {
  const bin = atob((b64 || "").replace(/\s+/g, ""));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

// Token aus dem aktuellen State erzeugen, in die Textarea schreiben
// und in die Zwischenablage kopieren.
function exportShareToken() {
  const payload = {
    v: SHARE_TOKEN_VERSION,
    ts: new Date().toISOString(),
    state: state
  };
  let token;
  try {
    token = _shareEncodeB64(JSON.stringify(payload));
  } catch (e) {
    showToast("Token-Erzeugung fehlgeschlagen: " + e.message);
    return;
  }
  const ta = document.getElementById("share-token-area");
  if (ta) ta.value = token;
  _shareUpdateInfo();

  // Auto-Copy in die Zwischenablage (falls verfügbar)
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(token).then(
      () => showToast(t("share.toast_created", token.length)),
      () => showToast(t("share.toast_created_manual", token.length))
    );
  } else {
    showToast(t("share.toast_created_manual", token.length));
  }
}

// Token aus der Textarea lesen, validieren, State wiederherstellen.
async function importShareToken() {
  const ta = document.getElementById("share-token-area");
  if (!ta) return;
  const raw = (ta.value || "").trim();
  if (!raw) {
    showToast(t("share.toast_no_input"));
    return;
  }

  let payload;
  try {
    payload = JSON.parse(_shareDecodeB64(raw));
  } catch (e) {
    showToast(t("share.toast_bad_format"));
    return;
  }
  if (!payload || typeof payload !== "object" || !payload.state) {
    showToast(t("share.toast_bad_data"));
    return;
  }
  if (payload.v > SHARE_TOKEN_VERSION) {
    showToast(t("share.toast_new_version", payload.v));
    return;
  }

  const widgetCount = (payload.state.lcdComposer && payload.state.lcdComposer.widgets || []).length;
  const condCount = (payload.state.conditions || []).length;
  const summary = t("share.summary", condCount, widgetCount);
  const ok = await showConfirm(
    t("share.confirm_replace", summary, payload.ts || "—"),
    { confirmLabel: t("share.replace_btn") }
  );
  if (!ok) return;

  state = JSON.parse(JSON.stringify(payload.state));
  _shareApplyDefensiveDefaults();
  _shareSyncUiFields();
  ta.value = "";
  _shareUpdateInfo();
  render();
  showToast(t("share.toast_loaded"));
}

// Wenn der Token aus einer älteren Tool-Version stammt, könnten Felder
// fehlen. Wir setzen sie defensiv — analog zu loadTemplate().
function _shareApplyDefensiveDefaults() {
  if (!state.conditions)  state.conditions = [];
  if (!state.actionsThen) state.actionsThen = [];
  if (!state.actionsElse) state.actionsElse = [];
  if (!state.execMode)    state.execMode = "argument";
  if (!state.lcdComposer) state.lcdComposer = { enabled: false, lcdName: "", widgets: [] };
  if (!state.lcdComposer.displayMode)  state.lcdComposer.displayMode = "external";
  if (state.lcdComposer.surfaceIndex == null) state.lcdComposer.surfaceIndex = 0;
  if (!state.lcdComposer.resolution)   state.lcdComposer.resolution = "square";
  if (!state.lcdComposer.widgets)      state.lcdComposer.widgets = [];
  if (!state.lcdComposer.multiLcd) {
    state.lcdComposer.multiLcd = { enabled: false, rows: 1, cols: 2, namePattern: "LCD {col}{row}" };
  }
  if (typeof state.useCoroutines !== "boolean") state.useCoroutines = false;
  // v2.4.0: Gruppen-Semantik defaulten
  if (Array.isArray(state.conditions)) {
    for (const c of state.conditions) {
      if (typeof c.groupSemantic !== "string") c.groupSemantic = "any";
      if (typeof c.groupCount !== "number") c.groupCount = 1;
    }
  }
}

// Die statischen Form-Felder müssen die State-Werte zeigen
// (analog zu loadTemplate).
function _shareSyncUiFields() {
  const set = (id, val) => { const e = document.getElementById(id); if (e) e.value = val; };
  const setChecked = (id, val) => { const e = document.getElementById(id); if (e) e.checked = !!val; };
  const setDisplay = (id, on) => { const e = document.getElementById(id); if (e) e.style.display = on ? "block" : "none"; };

  set("exec-mode",                    state.execMode);
  setChecked("exec-coroutines",       state.useCoroutines);
  setChecked("lcd-enable",            state.lcdEnable);
  set("lcd-name",                     state.lcdName || "");
  setDisplay("lcd-config",            !!state.lcdEnable);
  setChecked("lcd-composer-enable",   state.lcdComposer.enabled);
  set("lcd-composer-name",            state.lcdComposer.lcdName || "");
  set("lcd-composer-mode",            state.lcdComposer.displayMode);
  set("lcd-composer-surface",         state.lcdComposer.surfaceIndex);
  set("lcd-composer-resolution",      state.lcdComposer.resolution);
  setDisplay("lcd-composer-config",   !!state.lcdComposer.enabled);
}

function _shareUpdateInfo() {
  const ta = document.getElementById("share-token-area");
  const info = document.getElementById("share-token-info");
  if (!ta || !info) return;
  const len = (ta.value || "").length;
  info.textContent = len ? t("share.token_len", len) : "";
}
