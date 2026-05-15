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
// v4.0.0 — Tokens werden komprimiert ausgegeben. Prefix unterscheidet:
//   "L:..."   → komprimiert (gzip via CompressionStream → Base64)
//   "..."     → uncompressed Base64 (alter Stil, weiterhin lesbar)
const SHARE_TOKEN_COMPRESSED_PREFIX = "L:";

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

// v4.0.0 — gzip-Kompression via CompressionStream-API (modern Browser).
// Fallback bei fehlender API: unkomprimierter Base64-Token (alte Variante).
async function _shareEncode(str) {
  if (typeof CompressionStream === "undefined") return _shareEncodeB64(str);
  try {
    const inputBytes = new TextEncoder().encode(str);
    const stream = new Blob([inputBytes]).stream().pipeThrough(new CompressionStream("gzip"));
    const ab = await new Response(stream).arrayBuffer();
    const out = new Uint8Array(ab);
    let bin = "";
    for (let i = 0; i < out.length; i++) bin += String.fromCharCode(out[i]);
    return SHARE_TOKEN_COMPRESSED_PREFIX + btoa(bin);
  } catch (e) {
    return _shareEncodeB64(str);
  }
}

async function _shareDecode(raw) {
  raw = (raw || "").trim();
  if (!raw.startsWith(SHARE_TOKEN_COMPRESSED_PREFIX)) {
    return _shareDecodeB64(raw);
  }
  if (typeof DecompressionStream === "undefined") {
    throw new Error("DecompressionStream not supported");
  }
  const b64 = raw.slice(SHARE_TOKEN_COMPRESSED_PREFIX.length).replace(/\s+/g, "");
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
  return await new Response(stream).text();
}

// Token aus dem aktuellen State erzeugen, in die Textarea schreiben
// und in die Zwischenablage kopieren.
async function exportShareToken() {
  const payload = {
    v: SHARE_TOKEN_VERSION,
    ts: new Date().toISOString(),
    state: state
  };
  let token;
  try {
    token = await _shareEncode(JSON.stringify(payload));
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
    const decoded = await _shareDecode(raw);
    payload = JSON.parse(decoded);
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
  if (typeof state.autoRecoverBlocks !== "boolean") state.autoRecoverBlocks = false;
  if (typeof state.coroutineChunkSize !== "number") state.coroutineChunkSize = 50;
  if (typeof state.aggRefreshInterval !== "number") state.aggRefreshInterval = 1;
  // v2.4.0: Gruppen-Semantik defaulten + v3.0.0 Migration
  if (Array.isArray(state.conditions)) {
    for (const c of state.conditions) {
      if (typeof c.groupSemantic !== "string") c.groupSemantic = "any";
      if (typeof c.groupCount !== "number") c.groupCount = 1;
      if (typeof c.blockSource !== "string") c.blockSource = c.useGroup ? "group" : "single";
      if (typeof c.sameConstruct !== "boolean") c.sameConstruct = true;
      if (typeof c.aggregateMode !== "string") c.aggregateMode = c.groupSemantic || "any";
      if (typeof c.aggregateThreshold !== "number") c.aggregateThreshold = c.groupCount || 1;
      if (typeof c.aggregateOp !== "string") c.aggregateOp = ">=";
      if (typeof c.openParens !== "number") c.openParens = 0;
      if (typeof c.closeParens !== "number") c.closeParens = 0;
    }
  }
  const _shareMigActs = (arr) => {
    if (!Array.isArray(arr)) return;
    for (const a of arr) {
      if (typeof a.blockSource !== "string") a.blockSource = a.useGroup ? "group" : "single";
      if (typeof a.sameConstruct !== "boolean") a.sameConstruct = true;
    }
  };
  _shareMigActs(state.actionsThen);
  _shareMigActs(state.actionsElse);
  // v2.8.0: scriptInfo defaulten
  if (!state.scriptInfo) {
    state.scriptInfo = { enabled: false, name: "", author: "", version: "", description: "", tags: "" };
  }
  // v2.10.0: Multi-Select-Indices nicht persistieren — frischer Start
  state.lcdComposer.selectedIndices = [];
}

// Die statischen Form-Felder müssen die State-Werte zeigen
// (analog zu loadTemplate).
function _shareSyncUiFields() {
  const set = (id, val) => { const e = document.getElementById(id); if (e) e.value = val; };
  const setChecked = (id, val) => { const e = document.getElementById(id); if (e) e.checked = !!val; };
  const setDisplay = (id, on) => { const e = document.getElementById(id); if (e) e.style.display = on ? "block" : "none"; };

  set("exec-mode",                    state.execMode);
  setChecked("exec-coroutines",       state.useCoroutines);
  setChecked("exec-auto-recover",     state.autoRecoverBlocks);
  setChecked("lcd-enable",            state.lcdEnable);
  set("lcd-name",                     state.lcdName || "");
  setDisplay("lcd-config",            !!state.lcdEnable);
  setChecked("lcd-composer-enable",   state.lcdComposer.enabled);
  set("lcd-composer-name",            state.lcdComposer.lcdName || "");
  set("lcd-composer-mode",            state.lcdComposer.displayMode);
  set("lcd-composer-surface",         state.lcdComposer.surfaceIndex);
  set("lcd-composer-resolution",      state.lcdComposer.resolution);
  setDisplay("lcd-composer-config",   !!state.lcdComposer.enabled);

  // v2.8.0 — Skript-Info
  const info = state.scriptInfo || { enabled: false };
  setChecked("info-enable",           info.enabled);
  set("info-name",                    info.name || "");
  set("info-author",                  info.author || "");
  set("info-version",                 info.version || "");
  set("info-tags",                    info.tags || "");
  set("info-description",             info.description || "");
  setDisplay("info-fields",           !!info.enabled);

  if (typeof _refreshBlockNameValidation === "function") {
    _refreshBlockNameValidation(document.getElementById("lcd-name"));
    _refreshBlockNameValidation(document.getElementById("lcd-composer-name"));
  }
}

function _shareUpdateInfo() {
  const ta = document.getElementById("share-token-area");
  const info = document.getElementById("share-token-info");
  if (!ta || !info) return;
  const len = (ta.value || "").length;
  info.textContent = len ? t("share.token_len", len) : "";
}

// ============================================================
// v4.0.0 — URL-Hash-Sharing
// ============================================================
// Erzeugt einen Teilen-Link mit dem aktuellen State im URL-Hash
// (`#state=<token>`). Wenn das Tool mit so einer URL geladen wird,
// liest die Init-Logik den Hash aus und stellt den State automatisch
// her — kein manuelles Einfügen mehr nötig.

const SHARE_URL_HASH_PARAM = "state";

// Erzeugt einen kompletten Teilen-Link und kopiert ihn in die Zwischenablage.
async function exportShareLink() {
  const payload = {
    v: SHARE_TOKEN_VERSION,
    ts: new Date().toISOString(),
    state: state
  };
  let token;
  try {
    token = await _shareEncode(JSON.stringify(payload));
  } catch (e) {
    showToast(t("share.toast_link_err"));
    return;
  }
  // Base-URL ohne bisherigen Hash/Suchen
  const base = window.location.origin + window.location.pathname;
  const url = base + "#" + SHARE_URL_HASH_PARAM + "=" + encodeURIComponent(token);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(
      () => showToast(t("share.toast_link_ok", url.length)),
      () => showToast(t("share.toast_link_manual"))
    );
  } else {
    showToast(t("share.toast_link_manual"));
  }
  // Zusätzlich in die Token-Area schreiben (User kann ihn auch dort sehen)
  const ta = document.getElementById("share-token-area");
  if (ta) {
    ta.value = url;
    _shareUpdateInfo();
  }
}

// Beim Page-Load aufrufen: prüft #state=... im URL-Hash und lädt
// automatisch (mit Confirm-Dialog, weil's den aktuellen Zustand
// überschreibt — bei leerem Default-State ohne Confirm).
async function tryLoadStateFromUrlHash() {
  const hash = (window.location.hash || "").replace(/^#/, "");
  if (!hash) return false;
  const m = hash.match(new RegExp("(?:^|&)" + SHARE_URL_HASH_PARAM + "=([^&]+)"));
  if (!m) return false;
  let token;
  try { token = decodeURIComponent(m[1]); }
  catch (_) { return false; }
  if (!token) return false;

  let payload;
  try {
    const decoded = await _shareDecode(token);
    payload = JSON.parse(decoded);
  } catch (e) {
    showToast(t("share.toast_bad_format"));
    return false;
  }
  if (!payload || typeof payload !== "object" || !payload.state) return false;
  if (payload.v > SHARE_TOKEN_VERSION) {
    showToast(t("share.toast_new_version", payload.v));
    return false;
  }

  // Hash sofort wegräumen damit Reload nicht wieder fragt
  history.replaceState(null, "", window.location.pathname);

  // Wenn der aktuelle State leer ist (frischer Tab), ohne Confirm laden.
  const hasContent = (state.conditions && state.conditions.length > 0)
                  || (state.actionsThen && state.actionsThen.length > 0)
                  || (state.actionsElse && state.actionsElse.length > 0)
                  || (state.lcdComposer && state.lcdComposer.widgets && state.lcdComposer.widgets.length > 0);
  if (hasContent) {
    const ok = await showConfirm(
      t("share.confirm_link_replace", payload.ts || "—"),
      { confirmLabel: t("share.replace_btn") }
    );
    if (!ok) return false;
  }

  state = JSON.parse(JSON.stringify(payload.state));
  _shareApplyDefensiveDefaults();
  _shareSyncUiFields();
  render();
  showToast(t("share.toast_link_loaded"));
  return true;
}
