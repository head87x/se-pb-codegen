// ============================================================
// SYNTAX HIGHLIGHT (lightweight, regex-basiert)
// ============================================================

function highlightCs(code) {
  // escape HTML first
  let s = escapeHtml(code);
  // comments
  s = s.replace(/(\/\/[^\n]*)/g, '<span class="com">$1</span>');
  // strings
  s = s.replace(/("(?:[^"\\]|\\.)*")/g, '<span class="str">$1</span>');
  // keywords
  const kws = ["public","private","void","new","return","if","else","bool","string","int","float","var","null","true","false","as"];
  s = s.replace(new RegExp("\\b(" + kws.join("|") + ")\\b", "g"), '<span class="kw">$1</span>');
  // types
  const types = ["IMy[A-Z][A-Za-z]+","UpdateFrequency","UpdateType","DateTime","DoorStatus","MyShipConnectorStatus","ChargeMode","LandingGearMode","ContentType","Color","MathHelper","Math"];
  s = s.replace(new RegExp("\\b(" + types.join("|") + ")\\b", "g"), '<span class="type">$1</span>');
  // numbers
  s = s.replace(/\b(\d+\.?\d*[fF]?)\b/g, '<span class="num">$1</span>');
  // function names (after . or before ()
  s = s.replace(/\.([A-Za-z_][A-Za-z0-9_]*)\(/g, '.<span class="fn">$1</span>(');
  return s;
}
