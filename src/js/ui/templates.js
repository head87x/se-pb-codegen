// ============================================================
// TEMPLATES (localStorage-basiert)
// ============================================================

function renderTemplates() {
  const root = document.getElementById("templates");
  if (templates.length === 0) {
    root.innerHTML = '<span class="empty-hint">Keine Vorlagen gespeichert.</span>';
    return;
  }
  root.innerHTML = templates.map((t, i) => `
    <span class="template-chip">
      <span onclick="loadTemplate(${i})">${escapeHtml(t.name)}</span>
      <span class="x" onclick="deleteTemplate(${i})">✕</span>
    </span>
  `).join("");
}

function saveTemplate() {
  const name = prompt("Name der Vorlage:");
  if (!name) return;
  templates.push({ name, state: JSON.parse(JSON.stringify(state)) });
  localStorage.setItem("se_pb_templates", JSON.stringify(templates));
  render();
  showToast(`Vorlage "${name}" gespeichert`);
}

function loadTemplate(i) {
  state = JSON.parse(JSON.stringify(templates[i].state));
  // Re-apply UI fields
  document.getElementById("exec-mode").value = state.execMode;
  document.getElementById("lcd-enable").checked = !!state.lcdEnable;
  document.getElementById("lcd-name").value = state.lcdName || "";
  document.getElementById("lcd-config").style.display = state.lcdEnable ? "block" : "none";
  render();
  showToast(`"${templates[i].name}" geladen`);
}

function deleteTemplate(i) {
  if (!confirm(`Vorlage "${templates[i].name}" löschen?`)) return;
  templates.splice(i, 1);
  localStorage.setItem("se_pb_templates", JSON.stringify(templates));
  render();
}

function newProject() {
  if (!confirm("Aktuelles Projekt verwerfen und neu starten?")) return;
  state = {
    conditions: [], actionsThen: [], actionsElse: [],
    execMode: "argument", lcdEnable: false, lcdName: ""
  };
  document.getElementById("exec-mode").value = "argument";
  document.getElementById("lcd-enable").checked = false;
  document.getElementById("lcd-name").value = "";
  document.getElementById("lcd-config").style.display = "none";
  render();
}
