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

// Erzeugt eine globale <datalist>, die als list-Quelle für
// alle Item-Subtype-Inputs dient. So bekommt der User beim
// Eintippen Browser-native Auto-Vorschläge — kann aber auch
// einen exotischen Subtype (Mods etc.) frei eingeben.
function initSubtypeDatalist() {
  const dl = document.createElement("datalist");
  dl.id = "se-subtypes-list";
  const seen = new Set();
  const opts = [];
  for (const g of ITEM_SUBTYPES) {
    for (const item of g.items) {
      const key = item + "|" + g.group;
      if (seen.has(key)) continue;
      seen.add(key);
      // Browser zeigen 'label' rechts neben dem Wert
      opts.push(`<option value="${item}" label="${g.group}"></option>`);
    }
  }
  dl.innerHTML = opts.join("");
  document.body.appendChild(dl);
}
