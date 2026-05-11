// ============================================================
// SPACE ENGINEERS BLOCK DATABASE
// ============================================================
// Katalog der unterstützten Block-Typen aus Sandbox.ModAPI.Ingame
// (Programmable-Block-Whitelist). Voll-Coverage der praxisrelevanten
// Properties und Methoden, getrennt nach Standard / Erweitert.
//
// Datenmodell:
//   <Anzeigename>: {
//     interface: "IMy...",
//     category:  "Bewegung" | "Energie" | "Förderung" | "Produktion"
//              | "Antrieb"  | "Werkzeuge" | "Waffen" | "Sensorik"
//              | "Steuerung" | "Anzeige" | "Komfort" | "Custom",
//     conditions: [{ id, label, expr, kind, tier, arg? }],
//     actions:    [{ id, label, code, tier, arg? }]
//   }
//
// {v}   → Block-Variablenname, {arg} → User-Wert
// Tier: "standard" (häufig, intuitiv) / "advanced" (Spezialfälle, Parameter-Setter)
// Existierende IDs werden NICHT umbenannt (sonst brechen Vorlagen).
// ============================================================

const BLOCKS = {

  // ============================================================
  // BEWEGUNG
  // ============================================================

  "Tür (Door)": {
    interface: "IMyDoor",
    category: "Bewegung",
    conditions: [
      { id: "open",        label: "Ist offen",              expr: "{v}.Status == DoorStatus.Open",     kind: "bool",   tier: "standard" },
      { id: "closed",      label: "Ist geschlossen",        expr: "{v}.Status == DoorStatus.Closed",   kind: "bool",   tier: "standard" },
      { id: "opening",     label: "Öffnet gerade",          expr: "{v}.Status == DoorStatus.Opening",  kind: "bool",   tier: "standard" },
      { id: "closing",     label: "Schließt gerade",        expr: "{v}.Status == DoorStatus.Closing",  kind: "bool",   tier: "standard" },
      { id: "enabledTrue", label: "Ist aktiviert (Enabled)",expr: "{v}.Enabled",                       kind: "bool",   tier: "standard" },
      { id: "isWorking",   label: "Arbeitet (Strom da)",    expr: "{v}.IsWorking",                     kind: "bool",   tier: "advanced" },
      { id: "openRatioGT", label: "Öffnungs-Anteil > X %",  expr: "{v}.OpenRatio * 100f > {arg}f",     kind: "number", tier: "advanced", arg: "%" }
    ],
    actions: [
      { id: "open",      label: "Öffnen",                    code: "{v}.OpenDoor();",  tier: "standard" },
      { id: "close",     label: "Schließen",                 code: "{v}.CloseDoor();", tier: "standard" },
      { id: "toggle",    label: "Umschalten",                code: "{v}.ToggleDoor();", tier: "standard" },
      { id: "on",        label: "Aktivieren (Enabled = true)", code: "{v}.Enabled = true;",  tier: "advanced" },
      { id: "off",       label: "Deaktivieren (verriegeln)", code: "{v}.Enabled = false;", tier: "advanced" },
      { id: "setCustom", label: "CustomData setzen",         code: "{v}.CustomData = {arg};", tier: "advanced", arg: "\"text\" (mit Anführungszeichen)" }
    ]
  },

  "Hangartor (Hangar Door)": {
    interface: "IMyAirtightHangarDoor",
    category: "Bewegung",
    conditions: [
      { id: "fullyOpen",    label: "Komplett offen",          expr: "{v}.Status == DoorStatus.Open",   kind: "bool",   tier: "standard" },
      { id: "fullyClosed",  label: "Komplett geschlossen",    expr: "{v}.Status == DoorStatus.Closed", kind: "bool",   tier: "standard" },
      { id: "moving",       label: "Bewegt sich",             expr: "{v}.Status == DoorStatus.Opening || {v}.Status == DoorStatus.Closing", kind: "bool", tier: "standard" },
      { id: "enabledTrue",  label: "Ist aktiviert",           expr: "{v}.Enabled",                     kind: "bool",   tier: "standard" },
      { id: "openRatioGT",  label: "Öffnungs-Anteil > X %",   expr: "{v}.OpenRatio * 100f > {arg}f",   kind: "number", tier: "advanced", arg: "%" },
      { id: "isWorking",    label: "Arbeitet (Strom da)",     expr: "{v}.IsWorking",                   kind: "bool",   tier: "advanced" }
    ],
    actions: [
      { id: "open",   label: "Öffnen",     code: "{v}.OpenDoor();",   tier: "standard" },
      { id: "close",  label: "Schließen",  code: "{v}.CloseDoor();",  tier: "standard" },
      { id: "toggle", label: "Umschalten", code: "{v}.ToggleDoor();", tier: "standard" },
      { id: "on",     label: "Aktivieren", code: "{v}.Enabled = true;",  tier: "advanced" },
      { id: "off",    label: "Deaktivieren", code: "{v}.Enabled = false;", tier: "advanced" }
    ]
  },

  "Kolben (Piston)": {
    interface: "IMyPistonBase",
    category: "Bewegung",
    conditions: [
      { id: "extending",   label: "Fährt aus (Velocity > 0)", expr: "{v}.Velocity > 0",  kind: "bool",   tier: "standard" },
      { id: "retracting",  label: "Fährt ein (Velocity < 0)", expr: "{v}.Velocity < 0",  kind: "bool",   tier: "standard" },
      { id: "atTop",       label: "Komplett ausgefahren",     expr: "{v}.CurrentPosition >= {v}.MaxLimit - 0.01f", kind: "bool", tier: "standard" },
      { id: "atBottom",    label: "Komplett eingefahren",     expr: "{v}.CurrentPosition <= {v}.MinLimit + 0.01f", kind: "bool", tier: "standard" },
      { id: "posGreater",  label: "Position > X (m)",         expr: "{v}.CurrentPosition > {arg}f",  kind: "number", tier: "standard", arg: "Meter" },
      { id: "posLess",     label: "Position < X (m)",         expr: "{v}.CurrentPosition < {arg}f",  kind: "number", tier: "standard", arg: "Meter" },
      { id: "enabledTrue", label: "Ist eingeschaltet",        expr: "{v}.Enabled",                    kind: "bool",   tier: "standard" },
      { id: "isWorking",   label: "Arbeitet (Strom da)",      expr: "{v}.IsWorking",                  kind: "bool",   tier: "advanced" },
      { id: "minLimitGT",  label: "Min-Limit > X (m)",        expr: "{v}.MinLimit > {arg}f",          kind: "number", tier: "advanced", arg: "Meter" },
      { id: "maxLimitLT",  label: "Max-Limit < X (m)",        expr: "{v}.MaxLimit < {arg}f",          kind: "number", tier: "advanced", arg: "Meter" },
      { id: "velocityGT",  label: "Geschwindigkeit > X (m/s)", expr: "{v}.Velocity > {arg}f",         kind: "number", tier: "advanced", arg: "m/s" },
      { id: "isAttached",  label: "Top-Part angebracht",      expr: "{v}.IsAttached",                 kind: "bool",   tier: "advanced" }
    ],
    actions: [
      { id: "extend",     label: "Ausfahren",                code: "{v}.Velocity = Math.Abs({v}.Velocity == 0 ? 0.5f : {v}.Velocity);", tier: "standard" },
      { id: "retract",    label: "Einfahren",                code: "{v}.Velocity = -Math.Abs({v}.Velocity == 0 ? 0.5f : {v}.Velocity);", tier: "standard" },
      { id: "reverse",    label: "Richtung umkehren",        code: "{v}.Reverse();", tier: "standard" },
      { id: "setSpeed",   label: "Geschwindigkeit setzen",   code: "{v}.Velocity = {arg}f;",  tier: "standard", arg: "m/s (z.B. 0.5 oder -0.5)" },
      { id: "setMax",     label: "Max-Limit setzen (m)",     code: "{v}.MaxLimit = {arg}f;", tier: "standard", arg: "Meter" },
      { id: "setMin",     label: "Min-Limit setzen (m)",     code: "{v}.MinLimit = {arg}f;", tier: "standard", arg: "Meter" },
      { id: "on",         label: "Einschalten",              code: "{v}.Enabled = true;",   tier: "standard" },
      { id: "off",        label: "Ausschalten",              code: "{v}.Enabled = false;",  tier: "standard" },
      { id: "extendOnce", label: "Auf Max ausfahren",        code: "{v}.MaxLimit = 10f; {v}.Velocity = 0.5f;", tier: "advanced" },
      { id: "retractOnce",label: "Auf Min einfahren",        code: "{v}.MinLimit = 0f; {v}.Velocity = -0.5f;", tier: "advanced" },
      { id: "attach",     label: "Top-Part anbringen",       code: "{v}.Attach();",  tier: "advanced" },
      { id: "detach",     label: "Top-Part lösen",           code: "{v}.Detach();",  tier: "advanced" },
      { id: "setCustom",  label: "CustomData setzen",        code: "{v}.CustomData = {arg};", tier: "advanced", arg: "\"text\"" }
    ]
  },

  "Rotor (Advanced/Stator)": {
    interface: "IMyMotorStator",
    category: "Bewegung",
    conditions: [
      { id: "rotating",     label: "Dreht (RPM != 0)",          expr: "Math.Abs({v}.TargetVelocityRPM) > 0.01f", kind: "bool",   tier: "standard" },
      { id: "angleGT",      label: "Winkel > X (Grad)",         expr: "MathHelper.ToDegrees({v}.Angle) > {arg}f",  kind: "number", tier: "standard", arg: "Grad" },
      { id: "angleLT",      label: "Winkel < X (Grad)",         expr: "MathHelper.ToDegrees({v}.Angle) < {arg}f",  kind: "number", tier: "standard", arg: "Grad" },
      { id: "enabledTrue",  label: "Ist eingeschaltet",         expr: "{v}.Enabled",                                kind: "bool",   tier: "standard" },
      { id: "isWorking",    label: "Arbeitet (Strom da)",       expr: "{v}.IsWorking",                              kind: "bool",   tier: "standard" },
      { id: "isLocked",     label: "Ist gesperrt (RotorLock)",  expr: "{v}.RotorLock",                              kind: "bool",   tier: "standard" },
      { id: "isAttached",   label: "Top-Part verbunden",        expr: "{v}.IsAttached",                             kind: "bool",   tier: "standard" },
      { id: "rpmGT",        label: "Soll-RPM > X",              expr: "{v}.TargetVelocityRPM > {arg}f",             kind: "number", tier: "advanced", arg: "RPM" },
      { id: "rpmLT",        label: "Soll-RPM < X",              expr: "{v}.TargetVelocityRPM < {arg}f",             kind: "number", tier: "advanced", arg: "RPM" },
      { id: "torqueGT",     label: "Drehmoment > X (N·m)",      expr: "{v}.Torque > {arg}f",                        kind: "number", tier: "advanced", arg: "N·m" },
      { id: "lowerLimitGT", label: "Lower Limit > X (Grad)",    expr: "{v}.LowerLimitDeg > {arg}f",                 kind: "number", tier: "advanced", arg: "Grad" },
      { id: "upperLimitLT", label: "Upper Limit < X (Grad)",    expr: "{v}.UpperLimitDeg < {arg}f",                 kind: "number", tier: "advanced", arg: "Grad" },
      { id: "displaceGT",   label: "Displacement > X (m)",      expr: "{v}.Displacement > {arg}f",                  kind: "number", tier: "advanced", arg: "Meter" }
    ],
    actions: [
      { id: "setRpm",       label: "Soll-RPM setzen",            code: "{v}.TargetVelocityRPM = {arg}f;",            tier: "standard", arg: "RPM (z.B. 5 oder -5)" },
      { id: "stop",         label: "Stoppen (RPM = 0)",          code: "{v}.TargetVelocityRPM = 0f;",                tier: "standard" },
      { id: "lock",         label: "Sperren",                    code: "{v}.RotorLock = true;",                      tier: "standard" },
      { id: "unlock",       label: "Entsperren",                 code: "{v}.RotorLock = false;",                     tier: "standard" },
      { id: "reverse",      label: "Richtung umkehren",          code: "{v}.TargetVelocityRPM = -{v}.TargetVelocityRPM;", tier: "standard" },
      { id: "on",           label: "Einschalten",                code: "{v}.Enabled = true;",                        tier: "standard" },
      { id: "off",          label: "Ausschalten",                code: "{v}.Enabled = false;",                       tier: "standard" },
      { id: "setLower",     label: "Lower Limit setzen (Grad)",  code: "{v}.LowerLimitDeg = {arg}f;",                tier: "advanced", arg: "Grad" },
      { id: "setUpper",     label: "Upper Limit setzen (Grad)",  code: "{v}.UpperLimitDeg = {arg}f;",                tier: "advanced", arg: "Grad" },
      { id: "setTorque",    label: "Drehmoment setzen (N·m)",    code: "{v}.Torque = {arg}f;",                       tier: "advanced", arg: "N·m" },
      { id: "setBrakeTorq", label: "Bremsmoment setzen (N·m)",   code: "{v}.BrakingTorque = {arg}f;",                tier: "advanced", arg: "N·m" },
      { id: "setDisplace",  label: "Displacement setzen (m)",    code: "{v}.Displacement = {arg}f;",                 tier: "advanced", arg: "Meter (-0.11 bis 0.11)" },
      { id: "attach",       label: "Top-Part anbringen",         code: "{v}.Attach();",                              tier: "advanced" },
      { id: "detach",       label: "Top-Part lösen",             code: "{v}.Detach();",                              tier: "advanced" },
      { id: "setCustom",    label: "CustomData setzen",          code: "{v}.CustomData = {arg};",                    tier: "advanced", arg: "\"text\"" }
    ]
  },

  "Verbinder (Connector)": {
    interface: "IMyShipConnector",
    category: "Bewegung",
    conditions: [
      { id: "connected",   label: "Ist verbunden",        expr: "{v}.Status == MyShipConnectorStatus.Connected",   kind: "bool",   tier: "standard" },
      { id: "ready",       label: "Bereit (Connectable)", expr: "{v}.Status == MyShipConnectorStatus.Connectable", kind: "bool",   tier: "standard" },
      { id: "unconnected", label: "Nicht verbunden",      expr: "{v}.Status == MyShipConnectorStatus.Unconnected", kind: "bool",   tier: "standard" },
      { id: "hasItem",     label: "Enthält Item (Subtype)", expr: "HasItem({v}, \"{arg}\")",                       kind: "raw",    tier: "standard", arg: "z.B. Iron, Stone, SteelPlate" },
      { id: "itemAmountGT", label: "Item-Menge > X",      expr: "ItemAmountAbove({v}, \"{arg}\")",                 kind: "raw",    tier: "standard", arg: "Iron:100 (Subtype:Menge)" },
      { id: "itemAmountLT", label: "Item-Menge < X",      expr: "ItemAmountBelow({v}, \"{arg}\")",                 kind: "raw",    tier: "advanced", arg: "Iron:100 (Subtype:Menge)" },
      { id: "fillGT",      label: "Inventar-Füllstand > X %", expr: "((float){v}.GetInventory().CurrentVolume / (float){v}.GetInventory().MaxVolume) * 100f > {arg}f", kind: "number", tier: "advanced", arg: "%" },
      { id: "enabledTrue", label: "Ist eingeschaltet",    expr: "{v}.Enabled",                                     kind: "bool",   tier: "advanced" },
      { id: "throwOnTrue", label: "Throw-Out aktiv",      expr: "{v}.ThrowOut",                                    kind: "bool",   tier: "advanced" }
    ],
    actions: [
      { id: "connect",     label: "Verbinden",       code: "{v}.Connect();",       tier: "standard" },
      { id: "disconnect",  label: "Trennen",         code: "{v}.Disconnect();",    tier: "standard" },
      { id: "toggle",      label: "Umschalten",      code: "{v}.ToggleConnect();", tier: "standard" },
      { id: "on",          label: "Einschalten",     code: "{v}.Enabled = true;",  tier: "advanced" },
      { id: "off",         label: "Ausschalten",     code: "{v}.Enabled = false;", tier: "advanced" },
      { id: "throwOn",     label: "Throw-Out an (Ejector-Modus)", code: "{v}.ThrowOut = true;",  tier: "advanced" },
      { id: "throwOff",    label: "Throw-Out aus",   code: "{v}.ThrowOut = false;", tier: "advanced" }
    ]
  },

  "Merge-Block": {
    interface: "IMyShipMergeBlock",
    category: "Bewegung",
    conditions: [
      { id: "connected",   label: "Mit anderem Merge verbunden", expr: "{v}.IsConnected", kind: "bool", tier: "standard" },
      { id: "enabledTrue", label: "Ist eingeschaltet",           expr: "{v}.Enabled",     kind: "bool", tier: "standard" },
      { id: "isWorking",   label: "Arbeitet",                     expr: "{v}.IsWorking",  kind: "bool", tier: "advanced" }
    ],
    actions: [
      { id: "on",     label: "Einschalten", code: "{v}.Enabled = true;",  tier: "standard" },
      { id: "off",    label: "Ausschalten", code: "{v}.Enabled = false;", tier: "standard" },
      { id: "toggle", label: "Umschalten",  code: "{v}.Enabled = !{v}.Enabled;", tier: "standard" }
    ]
  },

  "Magnet-Plate / Landing-Gear": {
    interface: "IMyLandingGear",
    category: "Bewegung",
    conditions: [
      { id: "locked",      label: "Ist gesperrt",          expr: "{v}.LockMode == LandingGearMode.Locked",      kind: "bool", tier: "standard" },
      { id: "ready",       label: "Bereit zu sperren",     expr: "{v}.LockMode == LandingGearMode.ReadyToLock", kind: "bool", tier: "standard" },
      { id: "unlockedSt",  label: "Aktuell entsperrt",     expr: "{v}.LockMode == LandingGearMode.Unlocked",    kind: "bool", tier: "advanced" },
      { id: "autoLockOn",  label: "Auto-Lock aktiv",       expr: "{v}.AutoLock",                                 kind: "bool", tier: "advanced" }
    ],
    actions: [
      { id: "lock",     label: "Sperren",       code: "{v}.Lock();",      tier: "standard" },
      { id: "unlock",   label: "Entsperren",    code: "{v}.Unlock();",    tier: "standard" },
      { id: "toggle",   label: "Umschalten",    code: "{v}.ToggleLock();", tier: "standard" },
      { id: "autoOn",   label: "Auto-Lock an",  code: "{v}.AutoLock = true;",  tier: "advanced" },
      { id: "autoOff",  label: "Auto-Lock aus", code: "{v}.AutoLock = false;", tier: "advanced" }
    ]
  },

  // ============================================================
  // ENERGIE
  // ============================================================

  "Akku (Battery)": {
    interface: "IMyBatteryBlock",
    category: "Energie",
    conditions: [
      { id: "chargeGT",   label: "Ladung > X %",          expr: "({v}.CurrentStoredPower / {v}.MaxStoredPower) * 100f > {arg}f", kind: "number", tier: "standard", arg: "%" },
      { id: "chargeLT",   label: "Ladung < X %",          expr: "({v}.CurrentStoredPower / {v}.MaxStoredPower) * 100f < {arg}f", kind: "number", tier: "standard", arg: "%" },
      { id: "charging",   label: "Wird geladen",          expr: "{v}.CurrentInput > {v}.CurrentOutput",                          kind: "bool",   tier: "standard" },
      { id: "isOn",       label: "Ist eingeschaltet",     expr: "{v}.Enabled",                                                   kind: "bool",   tier: "standard" },
      { id: "isWorking",  label: "Arbeitet",              expr: "{v}.IsWorking",                                                 kind: "bool",   tier: "advanced" },
      { id: "outputGT",   label: "Strom-Output > X (MW)", expr: "{v}.CurrentOutput > {arg}f",                                    kind: "number", tier: "advanced", arg: "MW" },
      { id: "inputGT",    label: "Strom-Input  > X (MW)", expr: "{v}.CurrentInput > {arg}f",                                     kind: "number", tier: "advanced", arg: "MW" },
      { id: "modeAuto",   label: "Modus = Auto",          expr: "{v}.ChargeMode == ChargeMode.Auto",                             kind: "bool",   tier: "advanced" },
      { id: "modeRech",   label: "Modus = Recharge",      expr: "{v}.ChargeMode == ChargeMode.Recharge",                         kind: "bool",   tier: "advanced" },
      { id: "modeDisch",  label: "Modus = Discharge",     expr: "{v}.ChargeMode == ChargeMode.Discharge",                        kind: "bool",   tier: "advanced" }
    ],
    actions: [
      { id: "auto",       label: "Modus: Auto",       code: "{v}.ChargeMode = ChargeMode.Auto;",      tier: "standard" },
      { id: "recharge",   label: "Modus: Recharge",   code: "{v}.ChargeMode = ChargeMode.Recharge;",  tier: "standard" },
      { id: "discharge",  label: "Modus: Discharge",  code: "{v}.ChargeMode = ChargeMode.Discharge;", tier: "standard" },
      { id: "on",         label: "Einschalten",       code: "{v}.Enabled = true;",   tier: "standard" },
      { id: "off",        label: "Ausschalten",       code: "{v}.Enabled = false;",  tier: "standard" }
    ]
  },

  "Reaktor": {
    interface: "IMyReactor",
    category: "Energie",
    conditions: [
      { id: "outputGT",     label: "Output > X (MW)",        expr: "{v}.CurrentOutput > {arg}f", kind: "number", tier: "standard", arg: "MW" },
      { id: "isOn",         label: "Ist eingeschaltet",      expr: "{v}.Enabled",                kind: "bool",   tier: "standard" },
      { id: "isWorking",    label: "Arbeitet",               expr: "{v}.IsWorking",              kind: "bool",   tier: "advanced" },
      { id: "maxOutGT",     label: "Max-Output > X (MW)",    expr: "{v}.MaxOutput > {arg}f",     kind: "number", tier: "advanced", arg: "MW" },
      { id: "hasItem",      label: "Enthält Item (Subtype)", expr: "HasItem({v}, \"{arg}\")",       kind: "raw", tier: "standard", arg: "Uranium" },
      { id: "itemAmountGT", label: "Item-Menge > X",         expr: "ItemAmountAbove({v}, \"{arg}\")", kind: "raw", tier: "standard", arg: "Uranium:5" },
      { id: "itemAmountLT", label: "Item-Menge < X",         expr: "ItemAmountBelow({v}, \"{arg}\")", kind: "raw", tier: "standard", arg: "Uranium:1 (Treibstoff niedrig)" }
    ],
    actions: [
      { id: "on",  label: "Einschalten", code: "{v}.Enabled = true;",  tier: "standard" },
      { id: "off", label: "Ausschalten", code: "{v}.Enabled = false;", tier: "standard" }
    ]
  },

  "Solarpanel": {
    interface: "IMySolarPanel",
    category: "Energie",
    conditions: [
      { id: "outputGT",  label: "Output > X (kW)",     expr: "{v}.CurrentOutput * 1000f > {arg}f", kind: "number", tier: "standard", arg: "kW" },
      { id: "outputLT",  label: "Output < X (kW)",     expr: "{v}.CurrentOutput * 1000f < {arg}f", kind: "number", tier: "standard", arg: "kW" },
      { id: "maxOutGT",  label: "Max-Output > X (kW)", expr: "{v}.MaxOutput * 1000f > {arg}f",     kind: "number", tier: "advanced", arg: "kW" },
      { id: "isOn",      label: "Ist eingeschaltet",   expr: "{v}.Enabled",                        kind: "bool",   tier: "advanced" }
    ],
    actions: [
      { id: "on",  label: "Einschalten", code: "{v}.Enabled = true;",  tier: "advanced" },
      { id: "off", label: "Ausschalten", code: "{v}.Enabled = false;", tier: "advanced" }
    ]
  },

  "Windturbine": {
    interface: "IMyPowerProducer",
    category: "Energie",
    conditions: [
      { id: "outputGT",  label: "Output > X (kW)", expr: "{v}.CurrentOutput * 1000f > {arg}f", kind: "number", tier: "standard", arg: "kW" },
      { id: "outputLT",  label: "Output < X (kW)", expr: "{v}.CurrentOutput * 1000f < {arg}f", kind: "number", tier: "standard", arg: "kW" },
      { id: "isOn",      label: "Ist eingeschaltet", expr: "{v}.Enabled",                       kind: "bool",   tier: "advanced" }
    ],
    actions: [
      { id: "on",  label: "Einschalten", code: "{v}.Enabled = true;",  tier: "advanced" },
      { id: "off", label: "Ausschalten", code: "{v}.Enabled = false;", tier: "advanced" }
    ]
  },

  "H2-Motor (Hydrogen Engine)": {
    interface: "IMyPowerProducer",
    category: "Energie",
    conditions: [
      { id: "outputGT",  label: "Output > X (kW)",   expr: "{v}.CurrentOutput * 1000f > {arg}f", kind: "number", tier: "standard", arg: "kW" },
      { id: "isOn",      label: "Ist eingeschaltet", expr: "{v}.Enabled",                        kind: "bool",   tier: "standard" },
      { id: "isWorking", label: "Arbeitet",          expr: "{v}.IsWorking",                      kind: "bool",   tier: "advanced" }
    ],
    actions: [
      { id: "on",  label: "Einschalten", code: "{v}.Enabled = true;",  tier: "standard" },
      { id: "off", label: "Ausschalten", code: "{v}.Enabled = false;", tier: "standard" }
    ]
  },

  // ============================================================
  // FÖRDERUNG
  // ============================================================

  "Sortierer (Sorter)": {
    interface: "IMyConveyorSorter",
    category: "Förderung",
    conditions: [
      { id: "drainAll",     label: "Drain-All aktiv",       expr: "{v}.DrainAll",                    kind: "bool", tier: "standard" },
      { id: "isOn",         label: "Ist eingeschaltet",     expr: "{v}.Enabled",                     kind: "bool", tier: "standard" },
      { id: "isWorking",    label: "Arbeitet",              expr: "{v}.IsWorking",                   kind: "bool", tier: "advanced" },
      { id: "hasItem",      label: "Enthält Item (Subtype)", expr: "HasItem({v}, \"{arg}\")",       kind: "raw", tier: "advanced", arg: "z.B. Iron" },
      { id: "itemAmountGT", label: "Item-Menge > X",         expr: "ItemAmountAbove({v}, \"{arg}\")", kind: "raw", tier: "advanced", arg: "Iron:100" },
      { id: "itemAmountLT", label: "Item-Menge < X",         expr: "ItemAmountBelow({v}, \"{arg}\")", kind: "raw", tier: "advanced", arg: "Iron:100" }
    ],
    actions: [
      { id: "drainOn",   label: "Drain-All einschalten", code: "{v}.DrainAll = true;",  tier: "standard" },
      { id: "drainOff",  label: "Drain-All ausschalten", code: "{v}.DrainAll = false;", tier: "standard" },
      { id: "on",        label: "Einschalten",           code: "{v}.Enabled = true;",  tier: "standard" },
      { id: "off",       label: "Ausschalten",           code: "{v}.Enabled = false;", tier: "standard" }
    ]
  },

  "Frachtcontainer (Cargo)": {
    interface: "IMyCargoContainer",
    category: "Förderung",
    conditions: [
      { id: "fillGT",    label: "Volumen-Füllstand > X %", expr: "((float){v}.GetInventory().CurrentVolume / (float){v}.GetInventory().MaxVolume) * 100f > {arg}f", kind: "number", tier: "standard", arg: "%" },
      { id: "fillLT",    label: "Volumen-Füllstand < X %", expr: "((float){v}.GetInventory().CurrentVolume / (float){v}.GetInventory().MaxVolume) * 100f < {arg}f", kind: "number", tier: "standard", arg: "%" },
      { id: "empty",     label: "Ist leer",                expr: "{v}.GetInventory().CurrentVolume == 0",                                                          kind: "bool",   tier: "standard" },
      { id: "massGT",       label: "Masse > X (kg)",          expr: "(float){v}.GetInventory().CurrentMass > {arg}f",  kind: "number", tier: "advanced", arg: "kg" },
      { id: "itemCntGT",    label: "Item-Anzahl > X",         expr: "{v}.GetInventory().ItemCount > {arg}",            kind: "number", tier: "advanced", arg: "Anzahl" },
      { id: "hasItem",      label: "Enthält Item (Subtype)",  expr: "HasItem({v}, \"{arg}\")",                          kind: "raw",    tier: "standard", arg: "z.B. Iron, Stone, SteelPlate" },
      { id: "itemAmountGT", label: "Item-Menge > X",          expr: "ItemAmountAbove({v}, \"{arg}\")",                  kind: "raw",    tier: "standard", arg: "Iron:100 (Subtype:Menge)" },
      { id: "itemAmountLT", label: "Item-Menge < X",          expr: "ItemAmountBelow({v}, \"{arg}\")",                  kind: "raw",    tier: "advanced", arg: "Iron:100 (Subtype:Menge)" }
    ],
    actions: [
      { id: "setCustom", label: "CustomData setzen", code: "{v}.CustomData = {arg};", tier: "advanced", arg: "\"text\"" }
    ]
  },

  // ============================================================
  // PRODUKTION
  // ============================================================

  "Refinery / Schmelze": {
    interface: "IMyRefinery",
    category: "Produktion",
    conditions: [
      { id: "producing",   label: "Produziert gerade",   expr: "{v}.IsProducing",      kind: "bool", tier: "standard" },
      { id: "queueEmpty",  label: "Warteschlange leer",  expr: "{v}.IsQueueEmpty",     kind: "bool", tier: "standard" },
      { id: "useConveyor",  label: "Conveyor genutzt",    expr: "{v}.UseConveyorSystem", kind: "bool", tier: "standard" },
      { id: "isOn",         label: "Ist eingeschaltet",   expr: "{v}.Enabled",          kind: "bool", tier: "standard" },
      { id: "isWorking",    label: "Arbeitet",            expr: "{v}.IsWorking",        kind: "bool", tier: "advanced" },
      { id: "hasItem",      label: "Enthält Item (Subtype)", expr: "HasItem({v}, \"{arg}\")",       kind: "raw", tier: "standard", arg: "z.B. Iron, Stone (durchsucht In+Out)" },
      { id: "itemAmountGT", label: "Item-Menge > X",      expr: "ItemAmountAbove({v}, \"{arg}\")", kind: "raw", tier: "standard", arg: "Iron:100 (Subtype:Menge)" },
      { id: "itemAmountLT", label: "Item-Menge < X",      expr: "ItemAmountBelow({v}, \"{arg}\")", kind: "raw", tier: "advanced", arg: "Iron:100" }
    ],
    actions: [
      { id: "convOn",  label: "Conveyor an",         code: "{v}.UseConveyorSystem = true;",  tier: "standard" },
      { id: "convOff", label: "Conveyor aus",        code: "{v}.UseConveyorSystem = false;", tier: "advanced" },
      { id: "on",      label: "Einschalten",         code: "{v}.Enabled = true;",   tier: "standard" },
      { id: "off",     label: "Ausschalten",         code: "{v}.Enabled = false;",  tier: "standard" },
      { id: "clearQ",  label: "Warteschlange leeren", code: "{v}.ClearQueue();",    tier: "advanced" }
    ]
  },

  "Assembler": {
    interface: "IMyAssembler",
    category: "Produktion",
    conditions: [
      { id: "producing",       label: "Produziert gerade",     expr: "{v}.IsProducing",                              kind: "bool", tier: "standard" },
      { id: "queueEmpty",      label: "Warteschlange leer",    expr: "{v}.IsQueueEmpty",                             kind: "bool", tier: "standard" },
      { id: "isDisassembling", label: "Demontiert gerade",     expr: "{v}.Mode == MyAssemblerMode.Disassembly",      kind: "bool", tier: "standard" },
      { id: "isAssembling",    label: "Baut gerade",           expr: "{v}.Mode == MyAssemblerMode.Assembly",         kind: "bool", tier: "advanced" },
      { id: "coopOn",          label: "Kooperativ aktiv",      expr: "{v}.CooperativeMode",                          kind: "bool", tier: "advanced" },
      { id: "repeatOn",        label: "Wiederholung aktiv",    expr: "{v}.Repeating",                                kind: "bool", tier: "advanced" },
      { id: "isOn",            label: "Ist eingeschaltet",     expr: "{v}.Enabled",                                  kind: "bool", tier: "advanced" },
      { id: "hasItem",         label: "Enthält Item (Subtype)", expr: "HasItem({v}, \"{arg}\")",       kind: "raw", tier: "standard", arg: "z.B. SteelPlate (durchsucht In+Out)" },
      { id: "itemAmountGT",    label: "Item-Menge > X",         expr: "ItemAmountAbove({v}, \"{arg}\")", kind: "raw", tier: "advanced", arg: "Construction:50" },
      { id: "itemAmountLT",    label: "Item-Menge < X",         expr: "ItemAmountBelow({v}, \"{arg}\")", kind: "raw", tier: "advanced", arg: "Construction:50" }
    ],
    actions: [
      { id: "assemble",    label: "Modus: Bauen",         code: "{v}.Mode = MyAssemblerMode.Assembly;",    tier: "standard" },
      { id: "disassemble", label: "Modus: Demontieren",   code: "{v}.Mode = MyAssemblerMode.Disassembly;", tier: "standard" },
      { id: "cooperative", label: "Kooperativ umschalten", code: "{v}.CooperativeMode = !{v}.CooperativeMode;", tier: "advanced" },
      { id: "repeatOn",    label: "Wiederholung an",      code: "{v}.Repeating = true;",                   tier: "advanced" },
      { id: "repeatOff",   label: "Wiederholung aus",     code: "{v}.Repeating = false;",                  tier: "advanced" },
      { id: "on",          label: "Einschalten",          code: "{v}.Enabled = true;",   tier: "standard" },
      { id: "off",         label: "Ausschalten",          code: "{v}.Enabled = false;",  tier: "standard" },
      { id: "clearQ",      label: "Warteschlange leeren", code: "{v}.ClearQueue();",     tier: "advanced" }
    ]
  },

  "Gas-Generator (O2/H2)": {
    interface: "IMyGasGenerator",
    category: "Produktion",
    conditions: [
      { id: "producing",    label: "Produziert gerade",      expr: "{v}.CanProduce && {v}.AutoRefill", kind: "bool", tier: "standard" },
      { id: "isOn",         label: "Ist eingeschaltet",      expr: "{v}.Enabled",                       kind: "bool", tier: "standard" },
      { id: "refillOn",     label: "Auto-Refill aktiv",      expr: "{v}.AutoRefill",                    kind: "bool", tier: "standard" },
      { id: "canProd",      label: "Produktion möglich",     expr: "{v}.CanProduce",                    kind: "bool", tier: "advanced" },
      { id: "hasItem",      label: "Enthält Item (Subtype)", expr: "HasItem({v}, \"{arg}\")",       kind: "raw", tier: "standard", arg: "Ice" },
      { id: "itemAmountGT", label: "Item-Menge > X",         expr: "ItemAmountAbove({v}, \"{arg}\")", kind: "raw", tier: "standard", arg: "Ice:100" },
      { id: "itemAmountLT", label: "Item-Menge < X",         expr: "ItemAmountBelow({v}, \"{arg}\")", kind: "raw", tier: "standard", arg: "Ice:10 (Eis niedrig)" }
    ],
    actions: [
      { id: "on",        label: "Einschalten",      code: "{v}.Enabled = true;",   tier: "standard" },
      { id: "off",       label: "Ausschalten",      code: "{v}.Enabled = false;",  tier: "standard" },
      { id: "refillOn",  label: "Auto-Refill an",   code: "{v}.AutoRefill = true;",  tier: "advanced" },
      { id: "refillOff", label: "Auto-Refill aus",  code: "{v}.AutoRefill = false;", tier: "advanced" }
    ]
  },

  "Tank / Gas-Tank": {
    interface: "IMyGasTank",
    category: "Produktion",
    conditions: [
      { id: "fillGT",    label: "Füllstand > X %",   expr: "{v}.FilledRatio * 100 > {arg}", kind: "number", tier: "standard", arg: "%" },
      { id: "fillLT",    label: "Füllstand < X %",   expr: "{v}.FilledRatio * 100 < {arg}", kind: "number", tier: "standard", arg: "%" },
      { id: "stockpile", label: "Stockpile aktiv",   expr: "{v}.Stockpile",                  kind: "bool",   tier: "standard" },
      { id: "isOn",      label: "Ist eingeschaltet", expr: "{v}.Enabled",                    kind: "bool",   tier: "advanced" },
      { id: "capGT",     label: "Kapazität > X (L)", expr: "{v}.Capacity > {arg}f",          kind: "number", tier: "advanced", arg: "Liter" }
    ],
    actions: [
      { id: "stockOn",  label: "Stockpile an",  code: "{v}.Stockpile = true;",  tier: "standard" },
      { id: "stockOff", label: "Stockpile aus", code: "{v}.Stockpile = false;", tier: "standard" },
      { id: "on",       label: "Einschalten",   code: "{v}.Enabled = true;",    tier: "advanced" },
      { id: "off",      label: "Ausschalten",   code: "{v}.Enabled = false;",   tier: "advanced" }
    ]
  },

  "Air Vent": {
    interface: "IMyAirVent",
    category: "Produktion",
    conditions: [
      { id: "pressurized",   label: "Raum unter Druck",          expr: "{v}.Status == VentStatus.Pressurized",   kind: "bool",   tier: "standard" },
      { id: "depressurized", label: "Raum drucklos",             expr: "{v}.Status == VentStatus.Depressurized", kind: "bool",   tier: "standard" },
      { id: "pressuring",    label: "Druck wird aufgebaut",      expr: "{v}.Status == VentStatus.Pressurizing",  kind: "bool",   tier: "advanced" },
      { id: "depressuring",  label: "Druck wird abgebaut",       expr: "{v}.Status == VentStatus.Depressurizing", kind: "bool",  tier: "advanced" },
      { id: "pressureGT",    label: "O₂-Anteil > X %",           expr: "{v}.GetOxygenLevel() * 100f > {arg}f",   kind: "number", tier: "standard", arg: "%" },
      { id: "pressureLT",    label: "O₂-Anteil < X %",           expr: "{v}.GetOxygenLevel() * 100f < {arg}f",   kind: "number", tier: "standard", arg: "%" },
      { id: "canPressurize", label: "Kann unter Druck setzen",   expr: "{v}.CanPressurize",                      kind: "bool",   tier: "advanced" },
      { id: "depressureMode",label: "Im Depressurize-Modus",     expr: "{v}.Depressurize",                       kind: "bool",   tier: "advanced" }
    ],
    actions: [
      { id: "pressOn",  label: "Druck aufbauen",  code: "{v}.Depressurize = false;", tier: "standard" },
      { id: "pressOff", label: "Druck ablassen",  code: "{v}.Depressurize = true;",  tier: "standard" },
      { id: "on",       label: "Einschalten",     code: "{v}.Enabled = true;",   tier: "advanced" },
      { id: "off",      label: "Ausschalten",     code: "{v}.Enabled = false;",  tier: "advanced" }
    ]
  },

  // ============================================================
  // ANTRIEB
  // ============================================================

  "Thruster (Triebwerk)": {
    interface: "IMyThrust",
    category: "Antrieb",
    conditions: [
      { id: "thrustGT",   label: "Aktueller Schub > X (kN)",    expr: "{v}.CurrentThrust > {arg}f * 1000f",     kind: "number", tier: "standard", arg: "kN" },
      { id: "override",   label: "Override aktiv",              expr: "{v}.ThrustOverride > 0",                  kind: "bool",   tier: "standard" },
      { id: "isOn",       label: "Ist eingeschaltet",           expr: "{v}.Enabled",                             kind: "bool",   tier: "standard" },
      { id: "maxThrustGT",label: "Max-Schub > X (kN)",          expr: "{v}.MaxThrust > {arg}f * 1000f",          kind: "number", tier: "advanced", arg: "kN" },
      { id: "maxEffGT",   label: "Effektiver Max-Schub > X (kN)", expr: "{v}.MaxEffectiveThrust > {arg}f * 1000f", kind: "number", tier: "advanced", arg: "kN" },
      { id: "overrideGT", label: "Override-Wert > X %",         expr: "{v}.ThrustOverridePercentage * 100f > {arg}f", kind: "number", tier: "advanced", arg: "%" }
    ],
    actions: [
      { id: "override",    label: "Override % setzen",  code: "{v}.ThrustOverridePercentage = {arg}f / 100f;", tier: "standard", arg: "0-100" },
      { id: "overrideOff", label: "Override aus",       code: "{v}.ThrustOverridePercentage = 0f;",            tier: "standard" },
      { id: "on",          label: "Einschalten",        code: "{v}.Enabled = true;",   tier: "standard" },
      { id: "off",         label: "Ausschalten",        code: "{v}.Enabled = false;",  tier: "standard" }
    ]
  },

  "Gyroskop": {
    interface: "IMyGyro",
    category: "Antrieb",
    conditions: [
      { id: "override",   label: "Override aktiv",       expr: "{v}.GyroOverride",                   kind: "bool",   tier: "standard" },
      { id: "isOn",       label: "Ist eingeschaltet",    expr: "{v}.Enabled",                        kind: "bool",   tier: "standard" },
      { id: "powerGT",    label: "Power > X %",          expr: "{v}.GyroPower * 100f > {arg}f",      kind: "number", tier: "advanced", arg: "%" }
    ],
    actions: [
      { id: "overrideOn",  label: "Override aktivieren",   code: "{v}.GyroOverride = true;",   tier: "standard" },
      { id: "overrideOff", label: "Override deaktivieren", code: "{v}.GyroOverride = false;",  tier: "standard" },
      { id: "yaw",         label: "Yaw setzen (rad/s)",    code: "{v}.Yaw = {arg}f;",          tier: "advanced", arg: "rad/s" },
      { id: "pitch",       label: "Pitch setzen (rad/s)",  code: "{v}.Pitch = {arg}f;",        tier: "advanced", arg: "rad/s" },
      { id: "roll",        label: "Roll setzen (rad/s)",   code: "{v}.Roll = {arg}f;",         tier: "advanced", arg: "rad/s" },
      { id: "power",       label: "Power % setzen",        code: "{v}.GyroPower = {arg}f / 100f;", tier: "advanced", arg: "0-100" },
      { id: "on",          label: "Einschalten",           code: "{v}.Enabled = true;",   tier: "standard" },
      { id: "off",         label: "Ausschalten",           code: "{v}.Enabled = false;",  tier: "standard" }
    ]
  },

  "Fallschirm": {
    interface: "IMyParachute",
    category: "Antrieb",
    conditions: [
      { id: "deployed",   label: "Geöffnet",             expr: "{v}.Status == DoorStatus.Open", kind: "bool",   tier: "standard" },
      { id: "autoDeploy", label: "Auto-Deploy aktiv",    expr: "{v}.AutoDeploy",                kind: "bool",   tier: "standard" },
      { id: "deployHGT",  label: "Deploy-Höhe > X (m)",  expr: "{v}.AutoDeployHeight > {arg}f", kind: "number", tier: "advanced", arg: "Meter" }
    ],
    actions: [
      { id: "open",       label: "Öffnen",                  code: "{v}.OpenDoor();",   tier: "standard" },
      { id: "close",      label: "Schließen",               code: "{v}.CloseDoor();",  tier: "standard" },
      { id: "autoOn",     label: "Auto-Deploy an",          code: "{v}.AutoDeploy = true;",  tier: "advanced" },
      { id: "autoOff",    label: "Auto-Deploy aus",         code: "{v}.AutoDeploy = false;", tier: "advanced" },
      { id: "deployH",    label: "Deploy-Höhe setzen (m)",  code: "{v}.AutoDeployHeight = {arg}f;", tier: "advanced", arg: "Meter" }
    ]
  },

  "Jump Drive": {
    interface: "IMyJumpDrive",
    category: "Antrieb",
    conditions: [
      { id: "ready",      label: "Bereit",            expr: "{v}.Status == MyJumpDriveStatus.Ready",    kind: "bool",   tier: "standard" },
      { id: "charging",   label: "Lädt",              expr: "{v}.Status == MyJumpDriveStatus.Charging", kind: "bool",   tier: "standard" },
      { id: "chargeGT",   label: "Ladung > X %",      expr: "({v}.CurrentStoredPower / {v}.MaxStoredPower) * 100f > {arg}f", kind: "number", tier: "standard", arg: "%" },
      { id: "jumpDistGT", label: "Sprung-Distanz > X (km)", expr: "{v}.JumpDistanceMeters / 1000f > {arg}f", kind: "number", tier: "advanced", arg: "km" },
      { id: "isOn",       label: "Ist eingeschaltet", expr: "{v}.Enabled",                              kind: "bool",   tier: "advanced" }
    ],
    actions: [
      { id: "jump",      label: "Sprung auslösen",         code: "{v}.ApplyAction(\"Jump\");",                  tier: "advanced" },
      { id: "jumpAbort", label: "Sprung abbrechen",        code: "{v}.ApplyAction(\"Recharge_OnOff\");",        tier: "advanced" },
      { id: "on",        label: "Einschalten",             code: "{v}.Enabled = true;",   tier: "standard" },
      { id: "off",       label: "Ausschalten",             code: "{v}.Enabled = false;",  tier: "standard" }
    ]
  },

  // ============================================================
  // WERKZEUGE
  // ============================================================

  "Bohrer (Drill)": {
    interface: "IMyShipDrill",
    category: "Werkzeuge",
    conditions: [
      { id: "isOn",         label: "Ist eingeschaltet",      expr: "{v}.Enabled",                     kind: "bool", tier: "standard" },
      { id: "isWorking",    label: "Arbeitet",               expr: "{v}.IsWorking",                   kind: "bool", tier: "advanced" },
      { id: "fillGT",       label: "Inventar-Füllstand > X %", expr: "((float){v}.GetInventory().CurrentVolume / (float){v}.GetInventory().MaxVolume) * 100f > {arg}f", kind: "number", tier: "standard", arg: "%" },
      { id: "hasItem",      label: "Enthält Item (Subtype)", expr: "HasItem({v}, \"{arg}\")",       kind: "raw", tier: "advanced", arg: "Iron, Stone, ..." },
      { id: "itemAmountGT", label: "Item-Menge > X",         expr: "ItemAmountAbove({v}, \"{arg}\")", kind: "raw", tier: "advanced", arg: "Iron:1000" }
    ],
    actions: [
      { id: "on",     label: "Einschalten", code: "{v}.Enabled = true;",         tier: "standard" },
      { id: "off",    label: "Ausschalten", code: "{v}.Enabled = false;",        tier: "standard" },
      { id: "toggle", label: "Umschalten",  code: "{v}.Enabled = !{v}.Enabled;", tier: "standard" }
    ]
  },

  "Schweißer (Welder)": {
    interface: "IMyShipWelder",
    category: "Werkzeuge",
    conditions: [
      { id: "isOn",        label: "Ist eingeschaltet", expr: "{v}.Enabled",     kind: "bool", tier: "standard" },
      { id: "isWorking",   label: "Arbeitet",          expr: "{v}.IsWorking",   kind: "bool", tier: "advanced" },
      { id: "helpOthers",  label: "Help-Others aktiv", expr: "{v}.HelpOthers",  kind: "bool", tier: "advanced" }
    ],
    actions: [
      { id: "on",         label: "Einschalten",        code: "{v}.Enabled = true;",         tier: "standard" },
      { id: "off",        label: "Ausschalten",        code: "{v}.Enabled = false;",        tier: "standard" },
      { id: "toggle",     label: "Umschalten",         code: "{v}.Enabled = !{v}.Enabled;", tier: "standard" },
      { id: "helpOn",     label: "Help-Others an",     code: "{v}.HelpOthers = true;",      tier: "advanced" },
      { id: "helpOff",    label: "Help-Others aus",    code: "{v}.HelpOthers = false;",     tier: "advanced" }
    ]
  },

  "Schleifer (Grinder)": {
    interface: "IMyShipGrinder",
    category: "Werkzeuge",
    conditions: [
      { id: "isOn",         label: "Ist eingeschaltet",      expr: "{v}.Enabled",                     kind: "bool", tier: "standard" },
      { id: "isWorking",    label: "Arbeitet",               expr: "{v}.IsWorking",                   kind: "bool", tier: "advanced" },
      { id: "helpOthers",   label: "Help-Others aktiv",      expr: "{v}.HelpOthers",                  kind: "bool", tier: "advanced" },
      { id: "fillGT",       label: "Inventar-Füllstand > X %", expr: "((float){v}.GetInventory().CurrentVolume / (float){v}.GetInventory().MaxVolume) * 100f > {arg}f", kind: "number", tier: "standard", arg: "%" },
      { id: "hasItem",      label: "Enthält Item (Subtype)", expr: "HasItem({v}, \"{arg}\")",       kind: "raw", tier: "advanced", arg: "z.B. SteelPlate" },
      { id: "itemAmountGT", label: "Item-Menge > X",         expr: "ItemAmountAbove({v}, \"{arg}\")", kind: "raw", tier: "advanced", arg: "SteelPlate:50" }
    ],
    actions: [
      { id: "on",         label: "Einschalten",        code: "{v}.Enabled = true;",         tier: "standard" },
      { id: "off",        label: "Ausschalten",        code: "{v}.Enabled = false;",        tier: "standard" },
      { id: "toggle",     label: "Umschalten",         code: "{v}.Enabled = !{v}.Enabled;", tier: "standard" },
      { id: "helpOn",     label: "Help-Others an",     code: "{v}.HelpOthers = true;",      tier: "advanced" },
      { id: "helpOff",    label: "Help-Others aus",    code: "{v}.HelpOthers = false;",     tier: "advanced" }
    ]
  },

  "Projektor": {
    interface: "IMyProjector",
    category: "Werkzeuge",
    conditions: [
      { id: "projecting", label: "Projiziert gerade",       expr: "{v}.IsProjecting",            kind: "bool",   tier: "standard" },
      { id: "remainGT",   label: "Verbleibende Blöcke > X", expr: "{v}.RemainingBlocks > {arg}", kind: "number", tier: "standard", arg: "Anzahl" },
      { id: "remainLT",   label: "Verbleibende Blöcke < X", expr: "{v}.RemainingBlocks < {arg}", kind: "number", tier: "standard", arg: "Anzahl" },
      { id: "buildable",  label: "Baubare Blöcke > X",      expr: "{v}.BuildableBlocksCount > {arg}", kind: "number", tier: "advanced", arg: "Anzahl" },
      { id: "totalGT",    label: "Total-Blöcke > X",        expr: "{v}.TotalBlocks > {arg}",     kind: "number", tier: "advanced", arg: "Anzahl" },
      { id: "isOn",       label: "Ist eingeschaltet",       expr: "{v}.Enabled",                  kind: "bool",   tier: "advanced" }
    ],
    actions: [
      { id: "on",         label: "Einschalten",       code: "{v}.Enabled = true;",  tier: "standard" },
      { id: "off",        label: "Ausschalten",       code: "{v}.Enabled = false;", tier: "standard" }
    ]
  },

  // ============================================================
  // WAFFEN
  // ============================================================

  "Waffe (Turret/Gun)": {
    interface: "IMyUserControllableGun",
    category: "Waffen",
    conditions: [
      { id: "shooting", label: "Schießt gerade",      expr: "{v}.IsShooting", kind: "bool", tier: "standard" },
      { id: "isOn",     label: "Ist eingeschaltet",   expr: "{v}.Enabled",    kind: "bool", tier: "standard" }
    ],
    actions: [
      { id: "shootOn",   label: "Dauerfeuer an",   code: "{v}.SetValueBool(\"Shoot\", true);",  tier: "standard" },
      { id: "shootOff",  label: "Feuer ein",       code: "{v}.SetValueBool(\"Shoot\", false);", tier: "standard" },
      { id: "shootOnce", label: "Einzelschuss",    code: "{v}.ApplyAction(\"ShootOnce\");",     tier: "standard" },
      { id: "on",        label: "Einschalten",     code: "{v}.Enabled = true;",  tier: "standard" },
      { id: "off",       label: "Ausschalten",     code: "{v}.Enabled = false;", tier: "standard" }
    ]
  },

  "Geschützturm (Gatling)": {
    interface: "IMyLargeGatlingTurret",
    category: "Waffen",
    conditions: [
      { id: "shooting",   label: "Schießt gerade",   expr: "{v}.IsShooting",            kind: "bool",   tier: "standard" },
      { id: "hasTarget",  label: "Hat ein Ziel",     expr: "{v}.HasTarget",             kind: "bool",   tier: "standard" },
      { id: "isOn",       label: "Ist eingeschaltet", expr: "{v}.Enabled",               kind: "bool",   tier: "standard" },
      { id: "isWorking",  label: "Arbeitet",          expr: "{v}.IsWorking",             kind: "bool",   tier: "advanced" },
      { id: "rangeGT",    label: "Reichweite > X (m)", expr: "{v}.Range > {arg}f",        kind: "number", tier: "advanced", arg: "Meter" },
      { id: "underControl", label: "Von Spieler bedient", expr: "{v}.IsUnderControl",   kind: "bool",   tier: "advanced" }
    ],
    actions: [
      { id: "on",        label: "Einschalten",            code: "{v}.Enabled = true;",   tier: "standard" },
      { id: "off",       label: "Ausschalten",            code: "{v}.Enabled = false;",  tier: "standard" },
      { id: "shootOn",   label: "Dauerfeuer an",          code: "{v}.SetValueBool(\"Shoot\", true);",  tier: "standard" },
      { id: "shootOff",  label: "Feuer ein",              code: "{v}.SetValueBool(\"Shoot\", false);", tier: "standard" },
      { id: "rangeSet",  label: "Reichweite setzen (m)",  code: "{v}.Range = {arg}f;",                 tier: "advanced", arg: "Meter" },
      { id: "resetTarget", label: "Ziel-Lock zurücksetzen", code: "{v}.ResetTargetingToDefault();",   tier: "advanced" }
    ]
  },

  "Raketenturm": {
    interface: "IMyLargeMissileTurret",
    category: "Waffen",
    conditions: [
      { id: "shooting",   label: "Schießt gerade",       expr: "{v}.IsShooting",    kind: "bool",   tier: "standard" },
      { id: "hasTarget",  label: "Hat ein Ziel",         expr: "{v}.HasTarget",     kind: "bool",   tier: "standard" },
      { id: "isOn",       label: "Ist eingeschaltet",    expr: "{v}.Enabled",       kind: "bool",   tier: "standard" },
      { id: "rangeGT",    label: "Reichweite > X (m)",   expr: "{v}.Range > {arg}f", kind: "number", tier: "advanced", arg: "Meter" }
    ],
    actions: [
      { id: "on",       label: "Einschalten",           code: "{v}.Enabled = true;",   tier: "standard" },
      { id: "off",      label: "Ausschalten",           code: "{v}.Enabled = false;",  tier: "standard" },
      { id: "shootOn",  label: "Dauerfeuer an",         code: "{v}.SetValueBool(\"Shoot\", true);",  tier: "standard" },
      { id: "shootOff", label: "Feuer ein",             code: "{v}.SetValueBool(\"Shoot\", false);", tier: "standard" },
      { id: "rangeSet", label: "Reichweite setzen (m)", code: "{v}.Range = {arg}f;", tier: "advanced", arg: "Meter" }
    ]
  },

  "Innenraum-Geschütz": {
    interface: "IMyLargeInteriorTurret",
    category: "Waffen",
    conditions: [
      { id: "shooting",  label: "Schießt gerade",    expr: "{v}.IsShooting", kind: "bool", tier: "standard" },
      { id: "hasTarget", label: "Hat ein Ziel",      expr: "{v}.HasTarget",  kind: "bool", tier: "standard" },
      { id: "isOn",      label: "Ist eingeschaltet", expr: "{v}.Enabled",    kind: "bool", tier: "standard" }
    ],
    actions: [
      { id: "on",      label: "Einschalten", code: "{v}.Enabled = true;",  tier: "standard" },
      { id: "off",     label: "Ausschalten", code: "{v}.Enabled = false;", tier: "standard" }
    ]
  },

  "Gatling-Gun (fest)": {
    interface: "IMySmallGatlingGun",
    category: "Waffen",
    conditions: [
      { id: "shooting", label: "Schießt gerade",    expr: "{v}.IsShooting", kind: "bool", tier: "standard" },
      { id: "isOn",     label: "Ist eingeschaltet", expr: "{v}.Enabled",    kind: "bool", tier: "standard" }
    ],
    actions: [
      { id: "shootOn",  label: "Dauerfeuer an",  code: "{v}.SetValueBool(\"Shoot\", true);",  tier: "standard" },
      { id: "shootOff", label: "Feuer ein",      code: "{v}.SetValueBool(\"Shoot\", false);", tier: "standard" },
      { id: "on",       label: "Einschalten",    code: "{v}.Enabled = true;",   tier: "advanced" },
      { id: "off",      label: "Ausschalten",    code: "{v}.Enabled = false;",  tier: "advanced" }
    ]
  },

  "Raketenwerfer (fest)": {
    interface: "IMySmallMissileLauncher",
    category: "Waffen",
    conditions: [
      { id: "shooting", label: "Feuert gerade",     expr: "{v}.IsShooting", kind: "bool", tier: "standard" },
      { id: "isOn",     label: "Ist eingeschaltet", expr: "{v}.Enabled",    kind: "bool", tier: "standard" }
    ],
    actions: [
      { id: "shootOn",   label: "Dauerfeuer an",    code: "{v}.SetValueBool(\"Shoot\", true);",  tier: "standard" },
      { id: "shootOff",  label: "Feuer ein",        code: "{v}.SetValueBool(\"Shoot\", false);", tier: "standard" },
      { id: "shootOnce", label: "Einzelrakete",     code: "{v}.ApplyAction(\"ShootOnce\");",     tier: "standard" },
      { id: "on",        label: "Einschalten",      code: "{v}.Enabled = true;",  tier: "advanced" },
      { id: "off",       label: "Ausschalten",      code: "{v}.Enabled = false;", tier: "advanced" }
    ]
  },

  "Warhead (Sprengkopf)": {
    interface: "IMyWarhead",
    category: "Waffen",
    conditions: [
      { id: "armed",     label: "Scharf",            expr: "{v}.IsArmed",          kind: "bool",   tier: "standard" },
      { id: "counting",  label: "Countdown läuft",   expr: "{v}.IsCountingDown",   kind: "bool",   tier: "standard" },
      { id: "detTimeGT", label: "Verbleibend > X (s)", expr: "{v}.DetonationTime > {arg}f", kind: "number", tier: "advanced", arg: "Sekunden" }
    ],
    actions: [
      { id: "arm",       label: "Scharf machen",       code: "{v}.IsArmed = true;",       tier: "standard" },
      { id: "disarm",    label: "Entschärfen",         code: "{v}.IsArmed = false;",      tier: "standard" },
      { id: "start",     label: "Countdown starten",   code: "{v}.StartCountdown();",     tier: "standard" },
      { id: "stop",      label: "Countdown stoppen",   code: "{v}.StopCountdown();",      tier: "standard" },
      { id: "setDelay",  label: "Detonations-Delay (s)", code: "{v}.DetonationTime = {arg}f;", tier: "advanced", arg: "Sekunden" },
      { id: "detonate",  label: "Detonieren",           code: "{v}.Detonate();",          tier: "advanced" }
    ]
  },

  "Decoy / Köder": {
    interface: "IMyDecoy",
    category: "Waffen",
    conditions: [
      { id: "isOn", label: "Ist eingeschaltet", expr: "{v}.Enabled", kind: "bool", tier: "standard" }
    ],
    actions: [
      { id: "on",     label: "Einschalten", code: "{v}.Enabled = true;",         tier: "standard" },
      { id: "off",    label: "Ausschalten", code: "{v}.Enabled = false;",        tier: "standard" },
      { id: "toggle", label: "Umschalten",  code: "{v}.Enabled = !{v}.Enabled;", tier: "standard" }
    ]
  },

  // ============================================================
  // SENSORIK
  // ============================================================

  "Sensor": {
    interface: "IMySensorBlock",
    category: "Sensorik",
    conditions: [
      { id: "isActive",     label: "Etwas erkannt",              expr: "{v}.IsActive",                              kind: "bool",   tier: "standard" },
      { id: "lastDetected", label: "Spieler erkannt (HasAccess)", expr: "{v}.LastDetectedEntity.HasPlayerAccess",   kind: "bool",   tier: "standard" },
      { id: "enabled",      label: "Ist eingeschaltet",          expr: "{v}.Enabled",                               kind: "bool",   tier: "standard" },
      { id: "playPresent",  label: "Spieler im Bereich",         expr: "{v}.DetectPlayers",                          kind: "bool",   tier: "advanced" },
      { id: "frontGT",      label: "Front-Reichweite > X (m)",   expr: "{v}.FrontExtend > {arg}f",                   kind: "number", tier: "advanced", arg: "Meter" },
      { id: "backGT",       label: "Back-Reichweite > X (m)",    expr: "{v}.BackExtend > {arg}f",                    kind: "number", tier: "advanced", arg: "Meter" }
    ],
    actions: [
      { id: "on",        label: "Einschalten",          code: "{v}.Enabled = true;",         tier: "standard" },
      { id: "off",       label: "Ausschalten",          code: "{v}.Enabled = false;",        tier: "standard" },
      { id: "toggle",    label: "Umschalten",           code: "{v}.Enabled = !{v}.Enabled;", tier: "standard" },
      { id: "frontSet",  label: "Front-Reichweite (m)", code: "{v}.FrontExtend = {arg}f;",   tier: "advanced", arg: "Meter" },
      { id: "backSet",   label: "Back-Reichweite (m)",  code: "{v}.BackExtend = {arg}f;",    tier: "advanced", arg: "Meter" },
      { id: "leftSet",   label: "Left-Reichweite (m)",  code: "{v}.LeftExtend = {arg}f;",    tier: "advanced", arg: "Meter" },
      { id: "rightSet",  label: "Right-Reichweite (m)", code: "{v}.RightExtend = {arg}f;",   tier: "advanced", arg: "Meter" },
      { id: "topSet",    label: "Top-Reichweite (m)",   code: "{v}.TopExtend = {arg}f;",     tier: "advanced", arg: "Meter" },
      { id: "bottomSet", label: "Bottom-Reichweite (m)", code: "{v}.BottomExtend = {arg}f;", tier: "advanced", arg: "Meter" },
      { id: "playOn",    label: "Spieler erkennen an", code: "{v}.DetectPlayers = true;",   tier: "advanced" },
      { id: "playOff",   label: "Spieler erkennen aus", code: "{v}.DetectPlayers = false;", tier: "advanced" },
      { id: "enemyOn",   label: "Gegner erkennen an",  code: "{v}.DetectEnemy = true;",     tier: "advanced" },
      { id: "enemyOff",  label: "Gegner erkennen aus", code: "{v}.DetectEnemy = false;",    tier: "advanced" },
      { id: "friendOn",  label: "Freunde erkennen an", code: "{v}.DetectFriendly = true;",  tier: "advanced" },
      { id: "friendOff", label: "Freunde erkennen aus", code: "{v}.DetectFriendly = false;", tier: "advanced" }
    ]
  },

  "Kamera": {
    interface: "IMyCameraBlock",
    category: "Sensorik",
    conditions: [
      { id: "isActive",  label: "Aktiv (steuerbar)",          expr: "{v}.IsActive",                              kind: "bool",   tier: "standard" },
      { id: "canScan",   label: "Kann scannen (Reichweite)",  expr: "{v}.CanScan({arg}f)",                       kind: "raw",    tier: "advanced", arg: "Meter (Reichweite)" },
      { id: "raycastOn", label: "Raycast aktiv",              expr: "{v}.EnableRaycast",                          kind: "bool",   tier: "advanced" },
      { id: "rangeGT",   label: "Raycast-Reichweite > X (m)", expr: "{v}.AvailableScanRange > {arg}f",            kind: "number", tier: "advanced", arg: "Meter" }
    ],
    actions: [
      { id: "raycastOn",  label: "Raycast aktivieren",   code: "{v}.EnableRaycast = true;",  tier: "standard" },
      { id: "raycastOff", label: "Raycast deaktivieren", code: "{v}.EnableRaycast = false;", tier: "standard" },
      { id: "on",         label: "Einschalten",          code: "{v}.Enabled = true;",   tier: "advanced" },
      { id: "off",        label: "Ausschalten",          code: "{v}.Enabled = false;",  tier: "advanced" }
    ]
  },

  "Funkantenne": {
    interface: "IMyRadioAntenna",
    category: "Sensorik",
    conditions: [
      { id: "broadcasting", label: "Sendet aktiv",        expr: "{v}.EnableBroadcasting", kind: "bool",   tier: "standard" },
      { id: "rangeGT",      label: "Reichweite > X (m)",  expr: "{v}.Radius > {arg}f",    kind: "number", tier: "advanced", arg: "Meter" },
      { id: "isOn",         label: "Ist eingeschaltet",   expr: "{v}.Enabled",            kind: "bool",   tier: "standard" }
    ],
    actions: [
      { id: "bcOn",     label: "Broadcasting an",      code: "{v}.EnableBroadcasting = true;",  tier: "standard" },
      { id: "bcOff",    label: "Broadcasting aus",     code: "{v}.EnableBroadcasting = false;", tier: "standard" },
      { id: "setRange", label: "Reichweite setzen (m)", code: "{v}.Radius = {arg}f;",            tier: "standard", arg: "Meter (max 50000)" },
      { id: "hudOn",    label: "Show on HUD an",       code: "{v}.ShowShipName = true;",        tier: "advanced" },
      { id: "hudOff",   label: "Show on HUD aus",      code: "{v}.ShowShipName = false;",       tier: "advanced" },
      { id: "on",       label: "Einschalten",          code: "{v}.Enabled = true;",   tier: "standard" },
      { id: "off",      label: "Ausschalten",          code: "{v}.Enabled = false;",  tier: "standard" }
    ]
  },

  "Laser-Antenne": {
    interface: "IMyLaserAntenna",
    category: "Sensorik",
    conditions: [
      { id: "connected",    label: "Verbunden",            expr: "{v}.Status == MyLaserAntennaStatus.Connected",  kind: "bool",   tier: "standard" },
      { id: "isOn",         label: "Ist eingeschaltet",    expr: "{v}.Enabled",                                   kind: "bool",   tier: "standard" }
    ],
    actions: [
      { id: "on",       label: "Einschalten", code: "{v}.Enabled = true;",  tier: "standard" },
      { id: "off",      label: "Ausschalten", code: "{v}.Enabled = false;", tier: "standard" }
    ]
  },

  "Erz-Detektor": {
    interface: "IMyOreDetector",
    category: "Sensorik",
    conditions: [
      { id: "isOn",    label: "Ist eingeschaltet",      expr: "{v}.Enabled",       kind: "bool",   tier: "standard" },
      { id: "rangeGT", label: "Reichweite > X (m)",     expr: "{v}.Range > {arg}f", kind: "number", tier: "advanced", arg: "Meter" }
    ],
    actions: [
      { id: "rangeSet", label: "Reichweite setzen (m)", code: "{v}.Range = {arg}f;", tier: "standard", arg: "Meter" },
      { id: "on",       label: "Einschalten",           code: "{v}.Enabled = true;",  tier: "standard" },
      { id: "off",      label: "Ausschalten",           code: "{v}.Enabled = false;", tier: "standard" }
    ]
  },

  "Beacon": {
    interface: "IMyBeacon",
    category: "Sensorik",
    conditions: [
      { id: "isOn",    label: "Ist eingeschaltet",    expr: "{v}.Enabled",        kind: "bool",   tier: "standard" },
      { id: "rangeGT", label: "Reichweite > X (m)",   expr: "{v}.Radius > {arg}f", kind: "number", tier: "advanced", arg: "Meter" }
    ],
    actions: [
      { id: "setRange", label: "Reichweite setzen (m)", code: "{v}.Radius = {arg}f;",      tier: "standard", arg: "Meter" },
      { id: "on",       label: "Einschalten",           code: "{v}.Enabled = true;",       tier: "standard" },
      { id: "off",      label: "Ausschalten",           code: "{v}.Enabled = false;",      tier: "standard" },
      { id: "setName",  label: "Custom-Name setzen",    code: "{v}.CustomName = {arg};",   tier: "advanced", arg: "\"BEACON-A1\"" },
      { id: "setData",  label: "CustomData setzen",     code: "{v}.CustomData = {arg};",   tier: "advanced", arg: "\"text\"" }
    ]
  },

  // ============================================================
  // STEUERUNG
  // ============================================================

  "Cockpit / Sitz / Remote": {
    interface: "IMyShipController",
    category: "Steuerung",
    conditions: [
      { id: "occupied",    label: "Pilot drin",              expr: "{v}.IsUnderControl",                          kind: "bool",   tier: "standard" },
      { id: "dampeners",   label: "Inertia-Dampers an",      expr: "{v}.DampenersOverride",                       kind: "bool",   tier: "standard" },
      { id: "speedGT",     label: "Geschw. > X (m/s)",       expr: "{v}.GetShipSpeed() > {arg}",                  kind: "number", tier: "standard", arg: "m/s" },
      { id: "speedLT",     label: "Geschw. < X (m/s)",       expr: "{v}.GetShipSpeed() < {arg}",                  kind: "number", tier: "standard", arg: "m/s" },
      { id: "inGravity",   label: "In Gravitation",          expr: "{v}.GetNaturalGravity().Length() > 0.01",     kind: "bool",   tier: "standard" },
      { id: "mainCock",    label: "Ist Haupt-Cockpit",       expr: "{v}.IsMainCockpit",                           kind: "bool",   tier: "advanced" },
      { id: "massGT",      label: "Schiffsmasse > X (kg)",   expr: "(float){v}.CalculateShipMass().PhysicalMass > {arg}f", kind: "number", tier: "advanced", arg: "kg" },
      { id: "handbrakeOn", label: "Handbremse an",           expr: "{v}.HandBrake",                                kind: "bool",   tier: "advanced" },
      { id: "controlWheels", label: "Steuert Räder",         expr: "{v}.ControlWheels",                            kind: "bool",   tier: "advanced" },
      { id: "controlThrusters", label: "Steuert Triebwerke", expr: "{v}.ControlThrusters",                         kind: "bool",   tier: "advanced" }
    ],
    actions: [
      { id: "dampOn",        label: "Dampers an",              code: "{v}.DampenersOverride = true;",              tier: "standard" },
      { id: "dampOff",       label: "Dampers aus",             code: "{v}.DampenersOverride = false;",             tier: "standard" },
      { id: "handbrake",     label: "Handbremse umschalten",   code: "{v}.HandBrake = !{v}.HandBrake;",            tier: "standard" },
      { id: "handbrakeOn",   label: "Handbremse an",           code: "{v}.HandBrake = true;",                      tier: "advanced" },
      { id: "handbrakeOff",  label: "Handbremse aus",          code: "{v}.HandBrake = false;",                     tier: "advanced" },
      { id: "ctlThrustOn",   label: "Steuert Triebwerke an",   code: "{v}.ControlThrusters = true;",               tier: "advanced" },
      { id: "ctlThrustOff",  label: "Steuert Triebwerke aus",  code: "{v}.ControlThrusters = false;",              tier: "advanced" }
    ]
  },

  "Remote Control": {
    interface: "IMyRemoteControl",
    category: "Steuerung",
    conditions: [
      { id: "autoPilot",  label: "Autopilot aktiv",       expr: "{v}.IsAutoPilotEnabled", kind: "bool",   tier: "standard" },
      { id: "speedGT",    label: "Geschw. > X (m/s)",     expr: "{v}.GetShipSpeed() > {arg}", kind: "number", tier: "standard", arg: "m/s" },
      { id: "inGravity",  label: "In Gravitation",        expr: "{v}.GetNaturalGravity().Length() > 0.01", kind: "bool", tier: "standard" },
      { id: "speedLimitGT", label: "Speed-Limit > X (m/s)", expr: "{v}.SpeedLimit > {arg}f", kind: "number", tier: "advanced", arg: "m/s" }
    ],
    actions: [
      { id: "apOn",      label: "Autopilot an",           code: "{v}.SetAutoPilotEnabled(true);",  tier: "standard" },
      { id: "apOff",     label: "Autopilot aus",          code: "{v}.SetAutoPilotEnabled(false);", tier: "standard" },
      { id: "clearW",    label: "Wegpunkte löschen",      code: "{v}.ClearWaypoints();",           tier: "standard" },
      { id: "setSpeed",  label: "Speed-Limit setzen (m/s)", code: "{v}.SpeedLimit = {arg}f;",      tier: "advanced", arg: "m/s" },
      { id: "dockMode",  label: "Docking-Modus an",        code: "{v}.SetDockingMode(true);",      tier: "advanced" },
      { id: "dockOff",   label: "Docking-Modus aus",       code: "{v}.SetDockingMode(false);",     tier: "advanced" }
    ]
  },

  "Timer Block": {
    interface: "IMyTimerBlock",
    category: "Steuerung",
    conditions: [
      { id: "running",  label: "Läuft gerade",     expr: "{v}.IsCountingDown",   kind: "bool",   tier: "standard" },
      { id: "delayGT",  label: "Delay > X (s)",    expr: "{v}.TriggerDelay > {arg}f", kind: "number", tier: "advanced", arg: "Sekunden" }
    ],
    actions: [
      { id: "start",   label: "Starten",            code: "{v}.StartCountdown();",      tier: "standard" },
      { id: "stop",    label: "Stoppen",            code: "{v}.StopCountdown();",       tier: "standard" },
      { id: "trigger", label: "Sofort auslösen",    code: "{v}.Trigger();",             tier: "standard" },
      { id: "delay",   label: "Delay setzen (s)",   code: "{v}.TriggerDelay = {arg}f;", tier: "advanced", arg: "Sekunden" }
    ]
  },

  "Programmable Block (anderer)": {
    interface: "IMyProgrammableBlock",
    category: "Steuerung",
    conditions: [
      { id: "running", label: "Läuft gerade",       expr: "{v}.IsRunning",  kind: "bool", tier: "standard" },
      { id: "isOn",    label: "Ist eingeschaltet",  expr: "{v}.Enabled",     kind: "bool", tier: "standard" }
    ],
    actions: [
      { id: "run",  label: "Mit Argument starten",   code: "{v}.TryRun({arg});",  tier: "standard", arg: "\"argument\" (mit Anführungszeichen)" },
      { id: "on",   label: "Einschalten",            code: "{v}.Enabled = true;",  tier: "advanced" },
      { id: "off",  label: "Ausschalten",            code: "{v}.Enabled = false;", tier: "advanced" }
    ]
  },

  "Button-Panel": {
    interface: "IMyButtonPanel",
    category: "Steuerung",
    conditions: [
      { id: "isOn",   label: "Ist eingeschaltet", expr: "{v}.Enabled",                 kind: "bool", tier: "standard" },
      { id: "anyOne", label: "Mind. 1 Knopf hat Aktion", expr: "{v}.AnyoneCanUse",      kind: "bool", tier: "advanced" }
    ],
    actions: [
      { id: "press", label: "Knopf X drücken (1-N)", code: "{v}.ApplyAction(\"Pressed_{arg}\");", tier: "standard", arg: "Knopf-Nummer (z.B. 1)" }
    ]
  },

  // ============================================================
  // ANZEIGE
  // ============================================================

  "LCD / Text-Panel": {
    interface: "IMyTextPanel",
    category: "Anzeige",
    conditions: [
      { id: "isOn",      label: "Ist eingeschaltet", expr: "{v}.Enabled",     kind: "bool",   tier: "standard" },
      { id: "fontSizeGT", label: "Schriftgröße > X", expr: "{v}.FontSize > {arg}f", kind: "number", tier: "advanced", arg: "z.B. 1.0" }
    ],
    actions: [
      { id: "write",       label: "Text schreiben",          code: "{v}.WriteText({arg}, false);", tier: "standard", arg: "\"Hallo Welt\"" },
      { id: "append",      label: "Text anhängen",           code: "{v}.WriteText({arg}, true);",  tier: "standard", arg: "\"...\"" },
      { id: "clear",       label: "Inhalt leeren",            code: "{v}.WriteText(\"\", false);", tier: "standard" },
      { id: "fontSize",    label: "Schriftgröße setzen",     code: "{v}.FontSize = {arg}f;",        tier: "standard", arg: "z.B. 1.0" },
      { id: "fontColor",   label: "Schriftfarbe (R,G,B)",    code: "{v}.FontColor = new Color({arg});", tier: "advanced", arg: "255,255,255" },
      { id: "bgColor",     label: "Hintergrundfarbe (R,G,B)", code: "{v}.BackgroundColor = new Color({arg});", tier: "advanced", arg: "0,0,0" },
      { id: "alignLeft",   label: "Ausrichtung: Links",      code: "{v}.Alignment = TextAlignment.LEFT;",   tier: "advanced" },
      { id: "alignCenter", label: "Ausrichtung: Zentriert",  code: "{v}.Alignment = TextAlignment.CENTER;", tier: "advanced" },
      { id: "alignRight",  label: "Ausrichtung: Rechts",     code: "{v}.Alignment = TextAlignment.RIGHT;",  tier: "advanced" },
      { id: "modeText",    label: "Modus: Text+Bild",         code: "{v}.ContentType = ContentType.TEXT_AND_IMAGE;", tier: "advanced" },
      { id: "modeScript",  label: "Modus: Script",            code: "{v}.ContentType = ContentType.SCRIPT;",         tier: "advanced" },
      { id: "modeNone",    label: "Modus: Aus",               code: "{v}.ContentType = ContentType.NONE;",           tier: "advanced" },
      { id: "on",          label: "Einschalten",              code: "{v}.Enabled = true;",  tier: "standard" },
      { id: "off",         label: "Ausschalten",              code: "{v}.Enabled = false;", tier: "standard" }
    ]
  },

  "Lichter / Spotlight": {
    interface: "IMyLightingBlock",
    category: "Anzeige",
    conditions: [
      { id: "on",          label: "Ist an",              expr: "{v}.Enabled",                       kind: "bool",   tier: "standard" },
      { id: "intensityGT", label: "Intensität > X",      expr: "{v}.Intensity > {arg}f",            kind: "number", tier: "advanced", arg: "z.B. 5" },
      { id: "radiusGT",    label: "Radius > X (m)",      expr: "{v}.Radius > {arg}f",               kind: "number", tier: "advanced", arg: "Meter" },
      { id: "blinkGT",     label: "Blink-Intervall > X (s)", expr: "{v}.BlinkIntervalSeconds > {arg}f", kind: "number", tier: "advanced", arg: "Sekunden" }
    ],
    actions: [
      { id: "on",         label: "Einschalten",                code: "{v}.Enabled = true;",         tier: "standard" },
      { id: "off",        label: "Ausschalten",                code: "{v}.Enabled = false;",        tier: "standard" },
      { id: "toggle",     label: "Umschalten",                 code: "{v}.Enabled = !{v}.Enabled;", tier: "standard" },
      { id: "color",      label: "Farbe setzen (R,G,B)",       code: "{v}.Color = new Color({arg});", tier: "standard", arg: "255,80,20" },
      { id: "intensity",  label: "Intensität setzen",          code: "{v}.Intensity = {arg}f;",      tier: "standard", arg: "z.B. 5.0" },
      { id: "radiusSet",  label: "Radius setzen (m)",          code: "{v}.Radius = {arg}f;",         tier: "advanced", arg: "Meter" },
      { id: "blinkOn",    label: "Blink-Intervall setzen (s)", code: "{v}.BlinkIntervalSeconds = {arg}f;",  tier: "advanced", arg: "Sekunden" },
      { id: "blinkLen",   label: "Blink-Länge setzen (%)",     code: "{v}.BlinkLength = {arg}f;",    tier: "advanced", arg: "0-100" },
      { id: "blinkOffset",label: "Blink-Offset setzen (%)",    code: "{v}.BlinkOffset = {arg}f;",    tier: "advanced", arg: "0-100" },
      { id: "falloff",    label: "Falloff setzen",             code: "{v}.Falloff = {arg}f;",        tier: "advanced", arg: "z.B. 1.0" }
    ]
  },

  "Soundblock / Lautsprecher": {
    interface: "IMySoundBlock",
    category: "Anzeige",
    conditions: [
      { id: "isOn",  label: "Ist eingeschaltet", expr: "{v}.Enabled",          kind: "bool",   tier: "standard" },
      { id: "volGT", label: "Lautstärke > X",   expr: "{v}.Volume > {arg}f",  kind: "number", tier: "advanced", arg: "0.0-1.0" },
      { id: "loopGT",label: "Loop > X (s)",     expr: "{v}.LoopPeriod > {arg}f", kind: "number", tier: "advanced", arg: "Sekunden" }
    ],
    actions: [
      { id: "play",     label: "Sound abspielen",     code: "{v}.Play();",                tier: "standard" },
      { id: "stop",     label: "Sound stoppen",       code: "{v}.Stop();",                tier: "standard" },
      { id: "vol",      label: "Lautstärke setzen",   code: "{v}.Volume = {arg}f;",       tier: "standard", arg: "0.0 - 1.0" },
      { id: "loopSet",  label: "Loop-Dauer (s)",      code: "{v}.LoopPeriod = {arg}f;",   tier: "advanced", arg: "Sekunden" },
      { id: "rangeSet", label: "Hörweite (m)",        code: "{v}.Range = {arg}f;",        tier: "advanced", arg: "Meter" },
      { id: "soundSel", label: "Sound wählen",        code: "{v}.SelectedSound = {arg};", tier: "advanced", arg: "\"SoundBlockAlert1\"" }
    ]
  },

  // ============================================================
  // KOMFORT
  // ============================================================

  "Medi-Raum (Medical Room)": {
    interface: "IMyMedicalRoom",
    category: "Komfort",
    conditions: [
      { id: "isOn",     label: "Ist eingeschaltet", expr: "{v}.Enabled",  kind: "bool", tier: "standard" },
      { id: "isWorking", label: "Arbeitet",         expr: "{v}.IsWorking", kind: "bool", tier: "advanced" }
    ],
    actions: [
      { id: "on",  label: "Einschalten",  code: "{v}.Enabled = true;",  tier: "standard" },
      { id: "off", label: "Ausschalten",  code: "{v}.Enabled = false;", tier: "standard" }
    ]
  },

  "Kryo-Kammer": {
    interface: "IMyCryoChamber",
    category: "Komfort",
    conditions: [
      { id: "occupied", label: "Belegt",            expr: "{v}.IsUnderControl", kind: "bool", tier: "standard" },
      { id: "isOn",     label: "Ist eingeschaltet", expr: "{v}.Enabled",         kind: "bool", tier: "standard" }
    ],
    actions: [
      { id: "on",  label: "Einschalten",  code: "{v}.Enabled = true;",  tier: "standard" },
      { id: "off", label: "Ausschalten",  code: "{v}.Enabled = false;", tier: "standard" }
    ]
  },

  // ============================================================
  // CUSTOM
  // ============================================================

  "Custom (selbst eintragen)": {
    interface: "IMyTerminalBlock",
    category: "Custom",
    custom: true,
    conditions: [
      { id: "customCond", label: "Eigene Bedingung (C# Ausdruck)", expr: "{arg}", kind: "raw", tier: "advanced", arg: "z.B. v.Enabled && v.IsWorking" }
    ],
    actions: [
      { id: "applyAction", label: "ApplyAction(...) aufrufen", code: "{v}.ApplyAction({arg});",   tier: "advanced", arg: "\"OnOff_On\"" },
      { id: "setBool",     label: "SetValueBool(...)",         code: "{v}.SetValueBool({arg});",  tier: "advanced", arg: "\"Shoot\", true" },
      { id: "setFloat",    label: "SetValueFloat(...)",        code: "{v}.SetValueFloat({arg});", tier: "advanced", arg: "\"Velocity\", 1.5f" },
      { id: "rawCode",     label: "Roher C# Code (nutze {v})", code: "{arg}",                     tier: "advanced", arg: "z.B. {v}.Enabled = !{v}.Enabled;" },
      { id: "on",          label: "Einschalten (FunctionalBlock)",  code: "((IMyFunctionalBlock){v}).Enabled = true;",  tier: "advanced" },
      { id: "off",         label: "Ausschalten (FunctionalBlock)",  code: "((IMyFunctionalBlock){v}).Enabled = false;", tier: "advanced" }
    ]
  }
};

const CATEGORIES = ["Bewegung", "Energie", "Förderung", "Produktion",
  "Antrieb", "Werkzeuge", "Waffen", "Sensorik", "Steuerung", "Anzeige",
  "Komfort", "Custom"];

// ============================================================
// LOOKUP HELPERS
// ============================================================

// Block-Typ-Dropdown gruppiert nach Kategorie.
// filterKind: undefined | 'conditions' | 'actions'
function blockTypeOptions(filterKind) {
  const visible = Object.keys(BLOCKS).filter(
    k => !filterKind || (BLOCKS[k][filterKind] || []).length > 0
  );
  const byCat = {};
  for (const k of visible) {
    const cat = BLOCKS[k].category || "Sonstiges";
    (byCat[cat] = byCat[cat] || []).push(k);
  }
  const orderedCats = [
    ...CATEGORIES.filter(c => byCat[c]),
    ...Object.keys(byCat).filter(c => !CATEGORIES.includes(c)).sort()
  ];
  return orderedCats.map(cat => {
    const opts = byCat[cat].map(k => `<option value="${k}">${k}</option>`).join("");
    return `<optgroup label="${cat}">${opts}</optgroup>`;
  }).join("");
}

function _tierGrouped(items) {
  const std = items.filter(x => (x.tier || "standard") === "standard");
  const adv = items.filter(x => x.tier === "advanced");
  const renderItem = x => `<option value="${x.id}">${x.label}</option>`;
  if (adv.length === 0) return std.map(renderItem).join("");
  if (std.length === 0) return adv.map(renderItem).join("");
  return `<optgroup label="Standard">${std.map(renderItem).join("")}</optgroup>` +
         `<optgroup label="Erweitert">${adv.map(renderItem).join("")}</optgroup>`;
}

function condOptions(blockType) {
  return _tierGrouped((BLOCKS[blockType] || {}).conditions || []);
}

function actOptions(blockType) {
  return _tierGrouped((BLOCKS[blockType] || {}).actions || []);
}

function findCond(blockType, condId) {
  return ((BLOCKS[blockType] || {}).conditions || []).find(c => c.id === condId);
}

function findAct(blockType, actId) {
  return ((BLOCKS[blockType] || {}).actions || []).find(a => a.id === actId);
}
