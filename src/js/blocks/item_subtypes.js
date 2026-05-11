// ============================================================
// SPACE ENGINEERS ITEM-SUBTYPES
// ============================================================
// Gruppierte Liste der häufigsten Inventar-Item-SubtypeIds aus
// vanilla Space Engineers. Wird in Conditions mit
// argType === "subtype" als <optgroup>-Dropdown angeboten.
//
// Der spezielle Wert "_custom" lässt im Renderer ein freies
// Text-Eingabefeld erscheinen — für Mod-Items oder exotische
// Subtypes, die hier nicht gelistet sind.

const ITEM_SUBTYPES = [
  {
    group: "Erze",
    items: [
      "Stone", "Ice",
      "Iron", "Nickel", "Cobalt", "Silicon", "Magnesium",
      "Silver", "Gold", "Platinum", "Uranium", "Scrap"
    ]
  },
  {
    group: "Ingots (Barren)",
    note: "Subtype gleich wie Ore — Helper findet beides",
    items: [
      "Iron", "Nickel", "Cobalt", "Silicon", "Magnesium",
      "Silver", "Gold", "Platinum", "Uranium", "Stone", "Scrap"
    ]
  },
  {
    group: "Komponenten",
    items: [
      "SteelPlate", "Construction", "InteriorPlate", "Girder",
      "Computer", "Display", "BulletproofGlass", "Canvas",
      "LargeTube", "SmallTube", "MetalGrid", "Motor",
      "RadioCommunication", "Detector", "Medical", "Thrust",
      "GravityGenerator", "Reactor", "PowerCell", "SolarCell",
      "Superconductor", "Explosives", "ZoneChip"
    ]
  },
  {
    group: "Munition",
    items: [
      "NATO_25x184mm",     // Gatling
      "NATO_5p56x45mm",    // Automatic Rifle
      "Missile200mm",      // Missile Launcher / Turret
      "AutocannonClip",
      "MediumCalibreAmmo",
      "LargeCalibreAmmo",
      "AssaultCannonShell"
    ]
  },
  {
    group: "Werkzeuge / Handheld",
    items: [
      "WelderItem", "Welder2Item", "Welder3Item", "Welder4Item",
      "AngleGrinderItem", "AngleGrinder2Item", "AngleGrinder3Item", "AngleGrinder4Item",
      "HandDrillItem", "HandDrill2Item", "HandDrill3Item", "HandDrill4Item",
      "AutomaticRifleItem", "PreciseAutomaticRifleItem",
      "RapidFireAutomaticRifleItem", "UltimateAutomaticRifleItem",
      "BasicHandHeldLauncherItem", "AdvancedHandHeldLauncherItem"
    ]
  },
  {
    group: "Verbrauch",
    items: [
      "OxygenBottle", "HydrogenBottle",
      "Medkit", "Powerkit",
      "Datapad", "SpaceCredit", "Package"
    ]
  }
];

// Liefert HTML-Optionen für ein <select>, gruppiert nach Kategorie.
// "selected" wird im passenden <option> als selected markiert.
// Ganz unten gibt's eine "Custom…"-Option (Wert "_custom"), die
// im Renderer dazu führt, dass zusätzlich ein Text-Feld erscheint
// — für exotische Mod-Subtypes.
function subtypeOptions(selected) {
  let html = `<option value=""${!selected ? " selected" : ""}>— wählen —</option>`;
  const seen = new Set();
  for (const g of ITEM_SUBTYPES) {
    html += `<optgroup label="${g.group}">`;
    for (const item of g.items) {
      // Dupes (z. B. "Iron" als Ore + Ingot) nur einmal pro Gruppe
      const key = item + "|" + g.group;
      if (seen.has(key)) continue;
      seen.add(key);
      const sel = item === selected ? " selected" : "";
      html += `<option value="${item}"${sel}>${item}</option>`;
    }
    html += `</optgroup>`;
  }
  const customSel = selected === "_custom" ? " selected" : "";
  html += `<option value="_custom"${customSel}>Custom (selbst eintragen)…</option>`;
  return html;
}

// Prüft, ob der gegebene Wert in der Standard-Subtype-Liste vorkommt.
function isKnownSubtype(value) {
  if (!value || value === "_custom") return false;
  for (const g of ITEM_SUBTYPES) {
    if (g.items.includes(value)) return true;
  }
  return false;
}
