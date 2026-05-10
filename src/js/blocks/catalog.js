// ============================================================
// SPACE ENGINEERS BLOCK DATABASE
// ============================================================
// Katalog der unterstützten Block-Typen mit ihren Bedingungen (read)
// und Aktionen (write). Über "Custom" kann der User alles andere
// per C# selbst eintragen.
//
// Jeder Eintrag definiert:
//   interface:  C#-Typ aus Sandbox.ModAPI.Ingame
//   conditions: Prüfungen (liefern bool / Zahl / Status)
//   actions:    Methoden/Property-Setter
// ============================================================

const BLOCKS = {
  "Sensor": {
    interface: "IMySensorBlock",
    conditions: [
      { id: "isActive",   label: "Etwas erkannt?",     expr: "{v}.IsActive",                 kind: "bool" },
      { id: "lastDetected", label: "Erkannt enthält Spieler", expr: "{v}.LastDetectedEntity.HasPlayerAccess", kind: "bool" },
      { id: "enabled",    label: "Ist eingeschaltet",  expr: "{v}.Enabled",                  kind: "bool" }
    ],
    actions: [
      { id: "on",       label: "Einschalten",  code: "{v}.Enabled = true;" },
      { id: "off",      label: "Ausschalten",  code: "{v}.Enabled = false;" },
      { id: "toggle",   label: "Umschalten",   code: "{v}.Enabled = !{v}.Enabled;" }
    ]
  },
  "Kolben (Piston)": {
    interface: "IMyPistonBase",
    conditions: [
      { id: "extending",    label: "Fährt aus",        expr: "{v}.Velocity > 0",             kind: "bool" },
      { id: "retracting",   label: "Fährt ein",        expr: "{v}.Velocity < 0",             kind: "bool" },
      { id: "atTop",        label: "Komplett ausgefahren", expr: "{v}.CurrentPosition >= {v}.MaxLimit - 0.01f", kind: "bool" },
      { id: "atBottom",     label: "Komplett eingefahren", expr: "{v}.CurrentPosition <= {v}.MinLimit + 0.01f", kind: "bool" },
      { id: "posGreater",   label: "Position > X (m)", expr: "{v}.CurrentPosition > {arg}f",  kind: "number", arg: "Wert (Meter)" },
      { id: "posLess",      label: "Position < X (m)", expr: "{v}.CurrentPosition < {arg}f",  kind: "number", arg: "Wert (Meter)" }
    ],
    actions: [
      { id: "extend",   label: "Ausfahren",     code: "{v}.Velocity = Math.Abs({v}.Velocity == 0 ? 0.5f : {v}.Velocity);" },
      { id: "retract",  label: "Einfahren",     code: "{v}.Velocity = -Math.Abs({v}.Velocity == 0 ? 0.5f : {v}.Velocity);" },
      { id: "reverse",  label: "Richtung umkehren", code: "{v}.Reverse();" },
      { id: "setSpeed", label: "Geschwindigkeit setzen", code: "{v}.Velocity = {arg}f;", arg: "m/s (z.B. 0.5 oder -0.5)" },
      { id: "setMax",   label: "Max-Limit setzen",      code: "{v}.MaxLimit = {arg}f;", arg: "Meter" },
      { id: "setMin",   label: "Min-Limit setzen",      code: "{v}.MinLimit = {arg}f;", arg: "Meter" },
      { id: "on",       label: "Einschalten",  code: "{v}.Enabled = true;" },
      { id: "off",      label: "Ausschalten",  code: "{v}.Enabled = false;" }
    ]
  },
  "Tür (Door)": {
    interface: "IMyDoor",
    conditions: [
      { id: "open",     label: "Ist offen",     expr: "{v}.Status == DoorStatus.Open",     kind: "bool" },
      { id: "closed",   label: "Ist geschlossen", expr: "{v}.Status == DoorStatus.Closed", kind: "bool" },
      { id: "opening",  label: "Öffnet gerade", expr: "{v}.Status == DoorStatus.Opening",  kind: "bool" }
    ],
    actions: [
      { id: "open",     label: "Öffnen",        code: "{v}.OpenDoor();" },
      { id: "close",    label: "Schließen",     code: "{v}.CloseDoor();" },
      { id: "toggle",   label: "Umschalten",    code: "{v}.ToggleDoor();" },
      { id: "on",       label: "Aktivieren",    code: "{v}.Enabled = true;" },
      { id: "off",      label: "Deaktivieren (verriegeln)", code: "{v}.Enabled = false;" }
    ]
  },
  "Rotor (Advanced/Stator)": {
    interface: "IMyMotorStator",
    conditions: [
      { id: "rotating",   label: "Dreht (Geschw. != 0)", expr: "Math.Abs({v}.TargetVelocityRPM) > 0.01f", kind: "bool" },
      { id: "angleGT",    label: "Winkel > X (Grad)",    expr: "MathHelper.ToDegrees({v}.Angle) > {arg}f", kind: "number", arg: "Grad" },
      { id: "angleLT",    label: "Winkel < X (Grad)",    expr: "MathHelper.ToDegrees({v}.Angle) < {arg}f", kind: "number", arg: "Grad" }
    ],
    actions: [
      { id: "setRpm",   label: "RPM setzen",    code: "{v}.TargetVelocityRPM = {arg}f;", arg: "RPM (z.B. 5 oder -5)" },
      { id: "stop",     label: "Stoppen",       code: "{v}.TargetVelocityRPM = 0f;" },
      { id: "lock",     label: "Sperren",       code: "{v}.RotorLock = true;" },
      { id: "unlock",   label: "Entsperren",    code: "{v}.RotorLock = false;" },
      { id: "reverse",  label: "Richtung umkehren", code: "{v}.TargetVelocityRPM = -{v}.TargetVelocityRPM;" },
      { id: "on",       label: "Einschalten",   code: "{v}.Enabled = true;" },
      { id: "off",      label: "Ausschalten",   code: "{v}.Enabled = false;" }
    ]
  },
  "Verbinder (Connector)": {
    interface: "IMyShipConnector",
    conditions: [
      { id: "connected",  label: "Ist verbunden",   expr: "{v}.Status == MyShipConnectorStatus.Connected", kind: "bool" },
      { id: "ready",      label: "Bereit (Connectable)", expr: "{v}.Status == MyShipConnectorStatus.Connectable", kind: "bool" }
    ],
    actions: [
      { id: "connect",    label: "Verbinden",     code: "{v}.Connect();" },
      { id: "disconnect", label: "Trennen",       code: "{v}.Disconnect();" },
      { id: "toggle",     label: "Umschalten",    code: "{v}.ToggleConnect();" }
    ]
  },
  "Sortierer (Sorter)": {
    interface: "IMyConveyorSorter",
    conditions: [
      { id: "drainAll", label: "Drain-All aktiv", expr: "{v}.DrainAll", kind: "bool" }
    ],
    actions: [
      { id: "drainOn",  label: "Drain-All einschalten",  code: "{v}.DrainAll = true;" },
      { id: "drainOff", label: "Drain-All ausschalten",  code: "{v}.DrainAll = false;" },
      { id: "on",       label: "Einschalten",   code: "{v}.Enabled = true;" },
      { id: "off",      label: "Ausschalten",   code: "{v}.Enabled = false;" }
    ]
  },
  "Thruster (Triebwerk)": {
    interface: "IMyThrust",
    conditions: [
      { id: "thrustGT",  label: "Schub > X kN", expr: "{v}.CurrentThrust > {arg}f * 1000f", kind: "number", arg: "kN" },
      { id: "override",  label: "Override aktiv", expr: "{v}.ThrustOverride > 0", kind: "bool" }
    ],
    actions: [
      { id: "override",   label: "Override % setzen",  code: "{v}.ThrustOverridePercentage = {arg}f / 100f;", arg: "0-100" },
      { id: "overrideOff", label: "Override aus",      code: "{v}.ThrustOverridePercentage = 0f;" },
      { id: "on",         label: "Einschalten",        code: "{v}.Enabled = true;" },
      { id: "off",        label: "Ausschalten",        code: "{v}.Enabled = false;" }
    ]
  },
  "Gyroskop": {
    interface: "IMyGyro",
    conditions: [
      { id: "override", label: "Override aktiv", expr: "{v}.GyroOverride", kind: "bool" }
    ],
    actions: [
      { id: "overrideOn",  label: "Override aktivieren",  code: "{v}.GyroOverride = true;" },
      { id: "overrideOff", label: "Override deaktivieren", code: "{v}.GyroOverride = false;" },
      { id: "yaw",  label: "Yaw setzen (rad/s)",   code: "{v}.Yaw = {arg}f;",   arg: "rad/s" },
      { id: "pitch", label: "Pitch setzen (rad/s)", code: "{v}.Pitch = {arg}f;", arg: "rad/s" },
      { id: "roll", label: "Roll setzen (rad/s)",  code: "{v}.Roll = {arg}f;",  arg: "rad/s" },
      { id: "power", label: "Power % setzen",      code: "{v}.GyroPower = {arg}f / 100f;", arg: "0-100" }
    ]
  },
  "Cockpit / Sitz / Remote": {
    interface: "IMyShipController",
    conditions: [
      { id: "occupied",  label: "Pilot drin",     expr: "{v}.IsUnderControl",       kind: "bool" },
      { id: "dampeners", label: "Inertia-Dampers an", expr: "{v}.DampenersOverride", kind: "bool" },
      { id: "speedGT",   label: "Geschw. > X m/s", expr: "{v}.GetShipSpeed() > {arg}", kind: "number", arg: "m/s" },
      { id: "speedLT",   label: "Geschw. < X m/s", expr: "{v}.GetShipSpeed() < {arg}", kind: "number", arg: "m/s" },
      { id: "inGravity", label: "In Gravitation",  expr: "{v}.GetNaturalGravity().Length() > 0.01", kind: "bool" }
    ],
    actions: [
      { id: "dampOn",  label: "Dampers an",   code: "{v}.DampenersOverride = true;" },
      { id: "dampOff", label: "Dampers aus",  code: "{v}.DampenersOverride = false;" },
      { id: "handbrake", label: "Handbremse umschalten", code: "{v}.HandBrake = !{v}.HandBrake;" }
    ]
  },
  "Akku (Battery)": {
    interface: "IMyBatteryBlock",
    conditions: [
      { id: "chargeGT", label: "Ladung > X %", expr: "({v}.CurrentStoredPower / {v}.MaxStoredPower) * 100f > {arg}f", kind: "number", arg: "%" },
      { id: "chargeLT", label: "Ladung < X %", expr: "({v}.CurrentStoredPower / {v}.MaxStoredPower) * 100f < {arg}f", kind: "number", arg: "%" },
      { id: "charging", label: "Wird geladen", expr: "{v}.CurrentInput > {v}.CurrentOutput", kind: "bool" }
    ],
    actions: [
      { id: "auto",     label: "Modus: Auto",       code: "{v}.ChargeMode = ChargeMode.Auto;" },
      { id: "recharge", label: "Modus: Recharge",   code: "{v}.ChargeMode = ChargeMode.Recharge;" },
      { id: "discharge", label: "Modus: Discharge", code: "{v}.ChargeMode = ChargeMode.Discharge;" },
      { id: "on",       label: "Einschalten",       code: "{v}.Enabled = true;" },
      { id: "off",      label: "Ausschalten",       code: "{v}.Enabled = false;" }
    ]
  },
  "Tank / Gas-Tank": {
    interface: "IMyGasTank",
    conditions: [
      { id: "fillGT", label: "Füllstand > X %", expr: "{v}.FilledRatio * 100 > {arg}", kind: "number", arg: "%" },
      { id: "fillLT", label: "Füllstand < X %", expr: "{v}.FilledRatio * 100 < {arg}", kind: "number", arg: "%" },
      { id: "stockpile", label: "Stockpile aktiv", expr: "{v}.Stockpile", kind: "bool" }
    ],
    actions: [
      { id: "stockOn",  label: "Stockpile an",   code: "{v}.Stockpile = true;" },
      { id: "stockOff", label: "Stockpile aus",  code: "{v}.Stockpile = false;" },
      { id: "on",       label: "Einschalten",    code: "{v}.Enabled = true;" },
      { id: "off",      label: "Ausschalten",    code: "{v}.Enabled = false;" }
    ]
  },
  "Lichter / Spotlight": {
    interface: "IMyLightingBlock",
    conditions: [
      { id: "on",  label: "Ist an",   expr: "{v}.Enabled", kind: "bool" }
    ],
    actions: [
      { id: "on",      label: "Einschalten",   code: "{v}.Enabled = true;" },
      { id: "off",     label: "Ausschalten",   code: "{v}.Enabled = false;" },
      { id: "toggle",  label: "Umschalten",    code: "{v}.Enabled = !{v}.Enabled;" },
      { id: "blinkOn", label: "Blinken setzen (Intervall s)", code: "{v}.BlinkIntervalSeconds = {arg}f;", arg: "Sekunden" },
      { id: "color",   label: "Farbe setzen (R,G,B)", code: "{v}.Color = new Color({arg});", arg: "z.B. 255,80,20" },
      { id: "intensity", label: "Intensität setzen", code: "{v}.Intensity = {arg}f;", arg: "z.B. 5.0" }
    ]
  },
  "Schalldetektor / Soundblock": {
    interface: "IMySoundBlock",
    conditions: [],
    actions: [
      { id: "play",   label: "Sound abspielen",  code: "{v}.Play();" },
      { id: "stop",   label: "Sound stoppen",    code: "{v}.Stop();" },
      { id: "vol",    label: "Lautstärke setzen", code: "{v}.Volume = {arg}f;", arg: "0.0 - 1.0" }
    ]
  },
  "Timer Block": {
    interface: "IMyTimerBlock",
    conditions: [
      { id: "running", label: "Läuft gerade",   expr: "{v}.IsCountingDown", kind: "bool" }
    ],
    actions: [
      { id: "start",   label: "Starten",        code: "{v}.StartCountdown();" },
      { id: "stop",    label: "Stoppen",        code: "{v}.StopCountdown();" },
      { id: "trigger", label: "Sofort auslösen", code: "{v}.Trigger();" },
      { id: "delay",   label: "Delay setzen (s)", code: "{v}.TriggerDelay = {arg}f;", arg: "Sekunden" }
    ]
  },
  "Programmable Block (anderer)": {
    interface: "IMyProgrammableBlock",
    conditions: [
      { id: "running", label: "Läuft gerade", expr: "{v}.IsRunning", kind: "bool" }
    ],
    actions: [
      { id: "run", label: "Mit Argument starten", code: "{v}.TryRun({arg});", arg: "\"argument\" (mit Anführungszeichen)" }
    ]
  },
  "Warhead (Sprengkopf)": {
    interface: "IMyWarhead",
    conditions: [
      { id: "armed",   label: "Scharf",        expr: "{v}.IsArmed", kind: "bool" },
      { id: "counting", label: "Countdown läuft", expr: "{v}.IsCountingDown", kind: "bool" }
    ],
    actions: [
      { id: "arm",     label: "Scharf machen",  code: "{v}.IsArmed = true;" },
      { id: "disarm",  label: "Entschärfen",    code: "{v}.IsArmed = false;" },
      { id: "start",   label: "Countdown start", code: "{v}.StartCountdown();" },
      { id: "stop",    label: "Countdown stop", code: "{v}.StopCountdown();" },
      { id: "detonate", label: "Detonieren",    code: "{v}.Detonate();" }
    ]
  },
  "Waffe (Turret/Gun)": {
    interface: "IMyUserControllableGun",
    conditions: [
      { id: "shooting", label: "Schießt gerade", expr: "{v}.IsShooting", kind: "bool" }
    ],
    actions: [
      { id: "shootOn",  label: "Feuer frei",   code: "{v}.SetValueBool(\"Shoot\", true);" },
      { id: "shootOff", label: "Feuer ein",    code: "{v}.SetValueBool(\"Shoot\", false);" },
      { id: "shootOnce", label: "Einzelschuss", code: "{v}.ApplyAction(\"ShootOnce\");" }
    ]
  },
  "Magnet-Plate / Landing-Gear": {
    interface: "IMyLandingGear",
    conditions: [
      { id: "locked",   label: "Ist gesperrt",   expr: "{v}.LockMode == LandingGearMode.Locked", kind: "bool" },
      { id: "ready",    label: "Bereit zu sperren", expr: "{v}.LockMode == LandingGearMode.ReadyToLock", kind: "bool" }
    ],
    actions: [
      { id: "lock",   label: "Sperren",     code: "{v}.Lock();" },
      { id: "unlock", label: "Entsperren",  code: "{v}.Unlock();" }
    ]
  },
  "Custom (selbst eintragen)": {
    interface: "IMyTerminalBlock",
    custom: true,
    conditions: [
      { id: "customCond", label: "Eigene Bedingung (C# Ausdruck)", expr: "{arg}", kind: "raw", arg: "z.B. v.Enabled && v.IsWorking" }
    ],
    actions: [
      { id: "applyAction", label: "ApplyAction(...) aufrufen",  code: "{v}.ApplyAction({arg});", arg: "\"OnOff_On\" (mit Anführungszeichen)" },
      { id: "setBool",     label: "SetValueBool(...)",          code: "{v}.SetValueBool({arg});", arg: "\"Shoot\", true" },
      { id: "setFloat",    label: "SetValueFloat(...)",         code: "{v}.SetValueFloat({arg});", arg: "\"Velocity\", 1.5f" },
      { id: "rawCode",     label: "Roher C# Code (nutze {v} für den Block)", code: "{arg}", arg: "z.B. {v}.Enabled = !{v}.Enabled;" },
      { id: "on",          label: "Einschalten (falls FunctionalBlock)", code: "((IMyFunctionalBlock){v}).Enabled = true;" },
      { id: "off",         label: "Ausschalten (falls FunctionalBlock)", code: "((IMyFunctionalBlock){v}).Enabled = false;" }
    ]
  }
};

// ============================================================
// LOOKUP HELPERS
// ============================================================

function blockTypeOptions() {
  return Object.keys(BLOCKS).map(k => `<option value="${k}">${k}</option>`).join("");
}

function condOptions(blockType) {
  const conds = (BLOCKS[blockType] || {}).conditions || [];
  return conds.map(c => `<option value="${c.id}">${c.label}</option>`).join("");
}

function actOptions(blockType) {
  const acts = (BLOCKS[blockType] || {}).actions || [];
  return acts.map(a => `<option value="${a.id}">${a.label}</option>`).join("");
}

function findCond(blockType, condId) {
  return ((BLOCKS[blockType] || {}).conditions || []).find(c => c.id === condId);
}

function findAct(blockType, actId) {
  return ((BLOCKS[blockType] || {}).actions || []).find(a => a.id === actId);
}
