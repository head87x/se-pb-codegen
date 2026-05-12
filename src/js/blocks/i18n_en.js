// ============================================================
// I18N für BLOCKS-Katalog (v1.7.0) — Englische Übersetzungen
// ============================================================
// Externe Maps statt Inline-Edits am Katalog. Beim Sprachwechsel
// ersetzen blockTypeLabel() / categoryLabel() die Anzeige —
// die Schlüssel (BLOCKS-Keys, CATEGORIES-Strings) bleiben deutsch,
// damit Vorlagen/Token sprachunabhängig laden.
//
// Condition/Action-Labels (~490) folgen in Phase 2.2.

const BLOCKS_EN = {
  "Tür (Door)":                  "Door",
  "Hangartor (Hangar Door)":     "Hangar Door",
  "Kolben (Piston)":             "Piston",
  "Rotor (Advanced/Stator)":     "Rotor (Advanced/Stator)",
  "Verbinder (Connector)":       "Connector",
  "Merge-Block":                 "Merge Block",
  "Magnet-Plate / Landing-Gear": "Magnet Plate / Landing Gear",
  "Akku (Battery)":              "Battery",
  "Reaktor":                     "Reactor",
  "Solarpanel":                  "Solar Panel",
  "Windturbine":                 "Wind Turbine",
  "H2-Motor (Hydrogen Engine)":  "Hydrogen Engine",
  "Sortierer (Sorter)":          "Sorter",
  "Frachtcontainer (Cargo)":     "Cargo Container",
  "Refinery / Schmelze":         "Refinery",
  "Assembler":                   "Assembler",
  "Gas-Generator (O2/H2)":       "Gas Generator (O2/H2)",
  "Tank / Gas-Tank":             "Gas Tank",
  "Air Vent":                    "Air Vent",
  "Thruster (Triebwerk)":        "Thruster",
  "Gyroskop":                    "Gyroscope",
  "Fallschirm":                  "Parachute",
  "Jump Drive":                  "Jump Drive",
  "Bohrer (Drill)":              "Drill",
  "Schweißer (Welder)":          "Welder",
  "Schleifer (Grinder)":         "Grinder",
  "Projektor":                   "Projector",
  "Waffe (Turret/Gun)":          "Weapon (Turret/Gun)",
  "Geschützturm (Gatling)":      "Gatling Turret",
  "Raketenturm":                 "Missile Turret",
  "Innenraum-Geschütz":          "Interior Turret",
  "Gatling-Gun (fest)":          "Gatling Gun (fixed)",
  "Raketenwerfer (fest)":        "Rocket Launcher (fixed)",
  "Warhead (Sprengkopf)":        "Warhead",
  "Decoy / Köder":               "Decoy",
  "Sensor":                      "Sensor",
  "Kamera":                      "Camera",
  "Funkantenne":                 "Radio Antenna",
  "Laser-Antenne":               "Laser Antenna",
  "Erz-Detektor":                "Ore Detector",
  "Beacon":                      "Beacon",
  "Cockpit / Sitz / Remote":     "Cockpit / Seat / Remote",
  "Remote Control":              "Remote Control",
  "Timer Block":                 "Timer Block",
  "Programmable Block (anderer)":"Programmable Block (other)",
  "Button-Panel":                "Button Panel",
  "LCD / Text-Panel":            "LCD / Text Panel",
  "Lichter / Spotlight":         "Lights / Spotlight",
  "Soundblock / Lautsprecher":   "Sound Block / Speaker",
  "Medi-Raum (Medical Room)":    "Medical Room",
  "Kryo-Kammer":                 "Cryo Chamber",
  "Custom (selbst eintragen)":   "Custom (manual entry)"
};

const CATEGORIES_EN = {
  "Bewegung":   "Movement",
  "Energie":    "Energy",
  "Förderung":  "Inventory & Transport",
  "Produktion": "Production",
  "Antrieb":    "Propulsion",
  "Werkzeuge":  "Tools",
  "Waffen":     "Weapons",
  "Sensorik":   "Sensors",
  "Steuerung":  "Control",
  "Anzeige":    "Display",
  "Komfort":    "Comfort",
  "Custom":     "Custom",
  "Sonstiges":  "Other"
};

// Liefert den Anzeige-Namen eines Block-Typs in der aktuellen Sprache.
function blockTypeLabel(key) {
  if (typeof getLang === "function" && getLang() === "en") {
    return BLOCKS_EN[key] || key;
  }
  return key;
}

// Liefert den Anzeige-Namen einer Kategorie in der aktuellen Sprache.
function categoryLabel(cat) {
  if (typeof getLang === "function" && getLang() === "en") {
    return CATEGORIES_EN[cat] || cat;
  }
  return cat;
}

// Liefert das übersetzte Label für eine Condition/Action (falls Phase 2.2
// die labelEn-Felder ergänzt). Fallback: Original-DE-Label.
function localizedItemLabel(item) {
  if (!item) return "";
  if (typeof getLang === "function" && getLang() === "en" && item.labelEn) {
    return item.labelEn;
  }
  return item.label || "";
}
