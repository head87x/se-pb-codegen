// ============================================================
// SPACE ENGINEERS BLOCK DATABASE
// ============================================================
// Katalog der unterstützten Block-Typen aus Sandbox.ModAPI.Ingame
// (Programmable-Block-Whitelist).
//
// Datenmodell:
//   <Anzeigename>: {
//     interface: "IMy...",         // C#-Typ
//     category:  "Bewegung" | "Energie" | "Förderung" | "Produktion"
//              | "Antrieb"  | "Werkzeuge" | "Waffen" | "Sensorik"
//              | "Steuerung" | "Anzeige" | "Komfort" | "Custom",
//     conditions: [
//       { id, label, expr, kind: "bool"|"number"|"raw",
//         tier: "standard"|"advanced", arg?: "Hint" }
//     ],
//     actions: [
//       { id, label, code,
//         tier: "standard"|"advanced", arg?: "Hint" }
//     ]
//   }
//
// {v}   wird im Generator durch den Block-Variablennamen ersetzt
// {arg} wird durch den User-Wert ersetzt (falls arg gesetzt ist)
//
// Tier-Konvention:
//   "standard" — häufige, intuitive Operationen (Ein/Aus, einfache Abfragen)
//   "advanced" — Spezialfälle, niedrig-level API, Parameter-Setter
//
// Erläuterungen pro Option stehen in DESCRIPTIONS (descriptions.js)
// und erscheinen als (i)-Tooltip neben dem Dropdown.
// ============================================================

const BLOCKS = {

  // ============================================================
  // BEWEGUNG
  // ============================================================

  "Tür (Door)": {
    interface: "IMyDoor",
    category: "Bewegung",
    conditions: [
      { id: "open",     label: "Ist offen",        expr: "{v}.Status == DoorStatus.Open",     kind: "bool", tier: "standard" },
      { id: "closed",   label: "Ist geschlossen",  expr: "{v}.Status == DoorStatus.Closed",   kind: "bool", tier: "standard" },
      { id: "opening",  label: "Öffnet gerade",    expr: "{v}.Status == DoorStatus.Opening",  kind: "bool", tier: "advanced" },
      { id: "closing",  label: "Schließt gerade",  expr: "{v}.Status == DoorStatus.Closing",  kind: "bool", tier: "advanced" },
      { id: "enabledTrue", label: "Ist aktiviert", expr: "{v}.Enabled",                       kind: "bool", tier: "advanced" }
    ],
    actions: [
      { id: "open",     label: "Öffnen",                      code: "{v}.OpenDoor();",  tier: "standard" },
      { id: "close",    label: "Schließen",                   code: "{v}.CloseDoor();", tier: "standard" },
      { id: "toggle",   label: "Umschalten",                  code: "{v}.ToggleDoor();", tier: "standard" },
      { id: "on",       label: "Aktivieren",                  code: "{v}.Enabled = true;",  tier: "advanced" },
      { id: "off",      label: "Deaktivieren (verriegeln)",   code: "{v}.Enabled = false;", tier: "advanced" }
    ]
  },

  "Hangartor (Hangar Door)": {
    interface: "IMyAirtightHangarDoor",
    category: "Bewegung",
    conditions: [
      { id: "fullyOpen",   label: "Komplett offen",          expr: "{v}.Status == DoorStatus.Open",   kind: "bool", tier: "standard" },
      { id: "fullyClosed", label: "Komplett geschlossen",    expr: "{v}.Status == DoorStatus.Closed", kind: "bool", tier: "standard" },
      { id: "moving",      label: "Bewegt sich",             expr: "{v}.Status == DoorStatus.Opening || {v}.Status == DoorStatus.Closing", kind: "bool", tier: "advanced" }
    ],
    actions: [
      { id: "open",   label: "Öffnen",         code: "{v}.OpenDoor();",   tier: "standard" },
      { id: "close",  label: "Schließen",      code: "{v}.CloseDoor();",  tier: "standard" },
      { id: "toggle", label: "Umschalten",     code: "{v}.ToggleDoor();", tier: "standard" }
    ]
  },

  "Kolben (Piston)": {
    interface: "IMyPistonBase",
    category: "Bewegung",
    conditions: [
      { id: "extending",    label: "Fährt aus",            expr: "{v}.Velocity > 0",             kind: "bool",   tier: "standard" },
      { id: "retracting",   label: "Fährt ein",            expr: "{v}.Velocity < 0",             kind: "bool",   tier: "standard" },
      { id: "atTop",        label: "Komplett ausgefahren", expr: "{v}.CurrentPosition >= {v}.MaxLimit - 0.01f", kind: "bool", tier: "standard" },
      { id: "atBottom",     label: "Komplett eingefahren", expr: "{v}.CurrentPosition <= {v}.MinLimit + 0.01f", kind: "bool", tier: "standard" },
      { id: "posGreater",   label: "Position > X (m)",     expr: "{v}.CurrentPosition > {arg}f", kind: "number", tier: "advanced", arg: "Wert (Meter)" },
      { id: "posLess",      label: "Position < X (m)",     expr: "{v}.CurrentPosition < {arg}f", kind: "number", tier: "advanced", arg: "Wert (Meter)" }
    ],
    actions: [
      { id: "extend",   label: "Ausfahren",                code: "{v}.Velocity = Math.Abs({v}.Velocity == 0 ? 0.5f : {v}.Velocity);", tier: "standard" },
      { id: "retract",  label: "Einfahren",                code: "{v}.Velocity = -Math.Abs({v}.Velocity == 0 ? 0.5f : {v}.Velocity);", tier: "standard" },
      { id: "reverse",  label: "Richtung umkehren",        code: "{v}.Reverse();", tier: "standard" },
      { id: "setSpeed", label: "Geschwindigkeit setzen",   code: "{v}.Velocity = {arg}f;",  tier: "advanced", arg: "m/s (z.B. 0.5 oder -0.5)" },
      { id: "setMax",   label: "Max-Limit setzen",         code: "{v}.MaxLimit = {arg}f;", tier: "advanced", arg: "Meter" },
      { id: "setMin",   label: "Min-Limit setzen",         code: "{v}.MinLimit = {arg}f;", tier: "advanced", arg: "Meter" },
      { id: "on",       label: "Einschalten",              code: "{v}.Enabled = true;",   tier: "advanced" },
      { id: "off",      label: "Ausschalten",              code: "{v}.Enabled = false;",  tier: "advanced" }
    ]
  },

  "Rotor (Advanced/Stator)": {
    interface: "IMyMotorStator",
    category: "Bewegung",
    conditions: [
      { id: "rotating", label: "Dreht (Geschw. != 0)",  expr: "Math.Abs({v}.TargetVelocityRPM) > 0.01f", kind: "bool",   tier: "standard" },
      { id: "angleGT",  label: "Winkel > X (Grad)",     expr: "MathHelper.ToDegrees({v}.Angle) > {arg}f", kind: "number", tier: "standard", arg: "Grad" },
      { id: "angleLT",  label: "Winkel < X (Grad)",     expr: "MathHelper.ToDegrees({v}.Angle) < {arg}f", kind: "number", tier: "standard", arg: "Grad" },
      { id: "isLocked", label: "Ist gesperrt",          expr: "{v}.RotorLock",                            kind: "bool",   tier: "advanced" },
      { id: "isAttached", label: "Top-Part verbunden",  expr: "{v}.IsAttached",                           kind: "bool",   tier: "advanced" }
    ],
    actions: [
      { id: "setRpm",  label: "RPM setzen",            code: "{v}.TargetVelocityRPM = {arg}f;", tier: "standard", arg: "RPM (z.B. 5 oder -5)" },
      { id: "stop",    label: "Stoppen",               code: "{v}.TargetVelocityRPM = 0f;",     tier: "standard" },
      { id: "lock",    label: "Sperren",               code: "{v}.RotorLock = true;",           tier: "standard" },
      { id: "unlock",  label: "Entsperren",            code: "{v}.RotorLock = false;",          tier: "standard" },
      { id: "reverse", label: "Richtung umkehren",     code: "{v}.TargetVelocityRPM = -{v}.TargetVelocityRPM;", tier: "advanced" },
      { id: "attach",  label: "Top-Part anbringen",    code: "{v}.Attach();",                   tier: "advanced" },
      { id: "detach",  label: "Top-Part lösen",        code: "{v}.Detach();",                   tier: "advanced" },
      { id: "on",      label: "Einschalten",           code: "{v}.Enabled = true;",             tier: "advanced" },
      { id: "off",     label: "Ausschalten",           code: "{v}.Enabled = false;",            tier: "advanced" }
    ]
  },

  "Verbinder (Connector)": {
    interface: "IMyShipConnector",
    category: "Bewegung",
    conditions: [
      { id: "connected", label: "Ist verbunden",        expr: "{v}.Status == MyShipConnectorStatus.Connected",    kind: "bool", tier: "standard" },
      { id: "ready",     label: "Bereit (Connectable)", expr: "{v}.Status == MyShipConnectorStatus.Connectable",  kind: "bool", tier: "standard" },
      { id: "unconnected", label: "Nicht verbunden",    expr: "{v}.Status == MyShipConnectorStatus.Unconnected",  kind: "bool", tier: "advanced" }
    ],
    actions: [
      { id: "connect",    label: "Verbinden",         code: "{v}.Connect();",       tier: "standard" },
      { id: "disconnect", label: "Trennen",           code: "{v}.Disconnect();",    tier: "standard" },
      { id: "toggle",     label: "Umschalten",        code: "{v}.ToggleConnect();", tier: "standard" }
    ]
  },

  "Merge-Block": {
    interface: "IMyShipMergeBlock",
    category: "Bewegung",
    conditions: [
      { id: "connected", label: "Mit anderem Merge verbunden", expr: "{v}.IsConnected", kind: "bool", tier: "standard" }
    ],
    actions: [
      { id: "on",     label: "Einschalten",  code: "{v}.Enabled = true;",  tier: "standard" },
      { id: "off",    label: "Ausschalten",  code: "{v}.Enabled = false;", tier: "standard" },
      { id: "toggle", label: "Umschalten",   code: "{v}.Enabled = !{v}.Enabled;", tier: "standard" }
    ]
  },

  "Magnet-Plate / Landing-Gear": {
    interface: "IMyLandingGear",
    category: "Bewegung",
    conditions: [
      { id: "locked", label: "Ist gesperrt",     expr: "{v}.LockMode == LandingGearMode.Locked",      kind: "bool", tier: "standard" },
      { id: "ready",  label: "Bereit zu sperren", expr: "{v}.LockMode == LandingGearMode.ReadyToLock", kind: "bool", tier: "standard" }
    ],
    actions: [
      { id: "lock",      label: "Sperren",          code: "{v}.Lock();",      tier: "standard" },
      { id: "unlock",    label: "Entsperren",       code: "{v}.Unlock();",    tier: "standard" },
      { id: "autoOn",    label: "Auto-Lock an",     code: "{v}.AutoLock = true;",  tier: "advanced" },
      { id: "autoOff",   label: "Auto-Lock aus",    code: "{v}.AutoLock = false;", tier: "advanced" }
    ]
  },

  // ============================================================
  // ENERGIE
  // ============================================================

  "Akku (Battery)": {
    interface: "IMyBatteryBlock",
    category: "Energie",
    conditions: [
      { id: "chargeGT",  label: "Ladung > X %",  expr: "({v}.CurrentStoredPower / {v}.MaxStoredPower) * 100f > {arg}f", kind: "number", tier: "standard", arg: "%" },
      { id: "chargeLT",  label: "Ladung < X %",  expr: "({v}.CurrentStoredPower / {v}.MaxStoredPower) * 100f < {arg}f", kind: "number", tier: "standard", arg: "%" },
      { id: "charging",  label: "Wird geladen",  expr: "{v}.CurrentInput > {v}.CurrentOutput", kind: "bool", tier: "standard" },
      { id: "isOn",      label: "Ist eingeschaltet", expr: "{v}.Enabled",                      kind: "bool", tier: "advanced" }
    ],
    actions: [
      { id: "auto",      label: "Modus: Auto",       code: "{v}.ChargeMode = ChargeMode.Auto;",      tier: "standard" },
      { id: "recharge",  label: "Modus: Recharge",   code: "{v}.ChargeMode = ChargeMode.Recharge;",  tier: "standard" },
      { id: "discharge", label: "Modus: Discharge",  code: "{v}.ChargeMode = ChargeMode.Discharge;", tier: "standard" },
      { id: "on",        label: "Einschalten",       code: "{v}.Enabled = true;",   tier: "advanced" },
      { id: "off",       label: "Ausschalten",       code: "{v}.Enabled = false;",  tier: "advanced" }
    ]
  },

  "Reaktor": {
    interface: "IMyReactor",
    category: "Energie",
    conditions: [
      { id: "outputGT", label: "Output > X MW", expr: "{v}.CurrentOutput > {arg}f", kind: "number", tier: "standard", arg: "MW" },
      { id: "isOn",     label: "Ist eingeschaltet", expr: "{v}.Enabled",            kind: "bool",   tier: "standard" }
    ],
    actions: [
      { id: "on",  label: "Einschalten",  code: "{v}.Enabled = true;",  tier: "standard" },
      { id: "off", label: "Ausschalten",  code: "{v}.Enabled = false;", tier: "standard" }
    ]
  },

  "Solarpanel": {
    interface: "IMySolarPanel",
    category: "Energie",
    conditions: [
      { id: "outputGT", label: "Output > X kW", expr: "{v}.CurrentOutput * 1000f > {arg}f", kind: "number", tier: "standard", arg: "kW" }
    ],
    actions: [
      { id: "on",  label: "Einschalten",  code: "{v}.Enabled = true;",  tier: "advanced" },
      { id: "off", label: "Ausschalten",  code: "{v}.Enabled = false;", tier: "advanced" }
    ]
  },

  "Windturbine": {
    interface: "IMyPowerProducer",
    category: "Energie",
    conditions: [
      { id: "outputGT", label: "Output > X kW", expr: "{v}.CurrentOutput * 1000f > {arg}f", kind: "number", tier: "standard", arg: "kW" }
    ],
    actions: [
      { id: "on",  label: "Einschalten",  code: "{v}.Enabled = true;",  tier: "advanced" },
      { id: "off", label: "Ausschalten",  code: "{v}.Enabled = false;", tier: "advanced" }
    ]
  },

  "H2-Motor (Hydrogen Engine)": {
    interface: "IMyPowerProducer",
    category: "Energie",
    conditions: [
      { id: "outputGT", label: "Output > X kW", expr: "{v}.CurrentOutput * 1000f > {arg}f", kind: "number", tier: "standard", arg: "kW" },
      { id: "isOn",     label: "Ist eingeschaltet", expr: "{v}.Enabled",                    kind: "bool",   tier: "standard" }
    ],
    actions: [
      { id: "on",  label: "Einschalten",  code: "{v}.Enabled = true;",  tier: "standard" },
      { id: "off", label: "Ausschalten",  code: "{v}.Enabled = false;", tier: "standard" }
    ]
  },

  // ============================================================
  // FÖRDERUNG / INVENTAR
  // ============================================================

  "Sortierer (Sorter)": {
    interface: "IMyConveyorSorter",
    category: "Förderung",
    conditions: [
      { id: "drainAll", label: "Drain-All aktiv", expr: "{v}.DrainAll", kind: "bool", tier: "standard" },
      { id: "isOn",     label: "Ist eingeschaltet", expr: "{v}.Enabled", kind: "bool", tier: "advanced" }
    ],
    actions: [
      { id: "drainOn",  label: "Drain-All einschalten",  code: "{v}.DrainAll = true;",  tier: "standard" },
      { id: "drainOff", label: "Drain-All ausschalten",  code: "{v}.DrainAll = false;", tier: "standard" },
      { id: "on",       label: "Einschalten",   code: "{v}.Enabled = true;",  tier: "standard" },
      { id: "off",      label: "Ausschalten",   code: "{v}.Enabled = false;", tier: "standard" }
    ]
  },

  "Frachtcontainer (Cargo)": {
    interface: "IMyCargoContainer",
    category: "Förderung",
    conditions: [
      { id: "fillGT", label: "Volumen-Füllstand > X %", expr: "((float){v}.GetInventory().CurrentVolume / (float){v}.GetInventory().MaxVolume) * 100f > {arg}f", kind: "number", tier: "standard", arg: "%" },
      { id: "fillLT", label: "Volumen-Füllstand < X %", expr: "((float){v}.GetInventory().CurrentVolume / (float){v}.GetInventory().MaxVolume) * 100f < {arg}f", kind: "number", tier: "standard", arg: "%" },
      { id: "empty",  label: "Ist leer",                expr: "{v}.GetInventory().CurrentVolume == 0", kind: "bool", tier: "standard" }
    ],
    actions: []  // Container haben nichts zum Ausführen
  },

  // ============================================================
  // PRODUKTION
  // ============================================================

  "Refinery / Schmelze": {
    interface: "IMyRefinery",
    category: "Produktion",
    conditions: [
      { id: "producing",   label: "Produziert gerade",  expr: "{v}.IsProducing",   kind: "bool", tier: "standard" },
      { id: "queueEmpty",  label: "Warteschlange leer", expr: "{v}.IsQueueEmpty",  kind: "bool", tier: "standard" },
      { id: "useConveyor", label: "Conveyor genutzt",   expr: "{v}.UseConveyorSystem", kind: "bool", tier: "advanced" }
    ],
    actions: [
      { id: "convOn",  label: "Conveyor an",   code: "{v}.UseConveyorSystem = true;",  tier: "standard" },
      { id: "convOff", label: "Conveyor aus",  code: "{v}.UseConveyorSystem = false;", tier: "advanced" },
      { id: "on",      label: "Einschalten",   code: "{v}.Enabled = true;",  tier: "standard" },
      { id: "off",     label: "Ausschalten",   code: "{v}.Enabled = false;", tier: "standard" },
      { id: "clearQ",  label: "Warteschlange leeren", code: "{v}.ClearQueue();", tier: "advanced" }
    ]
  },

  "Assembler": {
    interface: "IMyAssembler",
    category: "Produktion",
    conditions: [
      { id: "producing",   label: "Produziert gerade",     expr: "{v}.IsProducing",   kind: "bool", tier: "standard" },
      { id: "queueEmpty",  label: "Warteschlange leer",    expr: "{v}.IsQueueEmpty",  kind: "bool", tier: "standard" },
      { id: "isDisassembling", label: "Demontiert gerade", expr: "{v}.Mode == MyAssemblerMode.Disassembly", kind: "bool", tier: "advanced" }
    ],
    actions: [
      { id: "assemble",    label: "Modus: Bauen",        code: "{v}.Mode = MyAssemblerMode.Assembly;",    tier: "standard" },
      { id: "disassemble", label: "Modus: Demontieren",  code: "{v}.Mode = MyAssemblerMode.Disassembly;", tier: "standard" },
      { id: "cooperative", label: "Kooperativ an/aus",   code: "{v}.CooperativeMode = !{v}.CooperativeMode;", tier: "advanced" },
      { id: "on",          label: "Einschalten",         code: "{v}.Enabled = true;",  tier: "standard" },
      { id: "off",         label: "Ausschalten",         code: "{v}.Enabled = false;", tier: "standard" },
      { id: "clearQ",      label: "Warteschlange leeren", code: "{v}.ClearQueue();",   tier: "advanced" }
    ]
  },

  "Gas-Generator (O2/H2)": {
    interface: "IMyGasGenerator",
    category: "Produktion",
    conditions: [
      { id: "producing", label: "Produziert gerade",      expr: "{v}.CanProduce && {v}.AutoRefill", kind: "bool", tier: "standard" },
      { id: "isOn",      label: "Ist eingeschaltet",      expr: "{v}.Enabled",                       kind: "bool", tier: "standard" }
    ],
    actions: [
      { id: "on",          label: "Einschalten",        code: "{v}.Enabled = true;",  tier: "standard" },
      { id: "off",         label: "Ausschalten",        code: "{v}.Enabled = false;", tier: "standard" },
      { id: "refillOn",    label: "Auto-Refill an",     code: "{v}.AutoRefill = true;",  tier: "advanced" },
      { id: "refillOff",   label: "Auto-Refill aus",    code: "{v}.AutoRefill = false;", tier: "advanced" }
    ]
  },

  "Tank / Gas-Tank": {
    interface: "IMyGasTank",
    category: "Produktion",
    conditions: [
      { id: "fillGT",    label: "Füllstand > X %",  expr: "{v}.FilledRatio * 100 > {arg}", kind: "number", tier: "standard", arg: "%" },
      { id: "fillLT",    label: "Füllstand < X %",  expr: "{v}.FilledRatio * 100 < {arg}", kind: "number", tier: "standard", arg: "%" },
      { id: "stockpile", label: "Stockpile aktiv",  expr: "{v}.Stockpile",                  kind: "bool",   tier: "advanced" }
    ],
    actions: [
      { id: "stockOn",  label: "Stockpile an",    code: "{v}.Stockpile = true;",  tier: "standard" },
      { id: "stockOff", label: "Stockpile aus",   code: "{v}.Stockpile = false;", tier: "standard" },
      { id: "on",       label: "Einschalten",     code: "{v}.Enabled = true;",   tier: "advanced" },
      { id: "off",      label: "Ausschalten",     code: "{v}.Enabled = false;",  tier: "advanced" }
    ]
  },

  "Air Vent": {
    interface: "IMyAirVent",
    category: "Produktion",
    conditions: [
      { id: "pressurized",   label: "Raum unter Druck",     expr: "{v}.Status == VentStatus.Pressurized",   kind: "bool", tier: "standard" },
      { id: "depressurized", label: "Raum drucklos",        expr: "{v}.Status == VentStatus.Depressurized", kind: "bool", tier: "standard" },
      { id: "pressureGT",    label: "Druck > X %",          expr: "{v}.GetOxygenLevel() * 100f > {arg}f",   kind: "number", tier: "standard", arg: "%" },
      { id: "canPressurize", label: "Kann unter Druck setzen", expr: "{v}.CanPressurize",                    kind: "bool", tier: "advanced" }
    ],
    actions: [
      { id: "pressOn",  label: "Druck aufbauen",  code: "{v}.Depressurize = false;", tier: "standard" },
      { id: "pressOff", label: "Druck ablassen",  code: "{v}.Depressurize = true;",  tier: "standard" },
      { id: "on",       label: "Einschalten",     code: "{v}.Enabled = true;",  tier: "advanced" },
      { id: "off",      label: "Ausschalten",     code: "{v}.Enabled = false;", tier: "advanced" }
    ]
  },

  // ============================================================
  // ANTRIEB
  // ============================================================

  "Thruster (Triebwerk)": {
    interface: "IMyThrust",
    category: "Antrieb",
    conditions: [
      { id: "thrustGT", label: "Schub > X kN",   expr: "{v}.CurrentThrust > {arg}f * 1000f", kind: "number", tier: "standard", arg: "kN" },
      { id: "override", label: "Override aktiv", expr: "{v}.ThrustOverride > 0",             kind: "bool",   tier: "standard" }
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
      { id: "override", label: "Override aktiv", expr: "{v}.GyroOverride", kind: "bool", tier: "standard" }
    ],
    actions: [
      { id: "overrideOn",  label: "Override aktivieren",   code: "{v}.GyroOverride = true;",   tier: "standard" },
      { id: "overrideOff", label: "Override deaktivieren", code: "{v}.GyroOverride = false;",  tier: "standard" },
      { id: "yaw",   label: "Yaw setzen (rad/s)",   code: "{v}.Yaw = {arg}f;",                 tier: "advanced", arg: "rad/s" },
      { id: "pitch", label: "Pitch setzen (rad/s)", code: "{v}.Pitch = {arg}f;",               tier: "advanced", arg: "rad/s" },
      { id: "roll",  label: "Roll setzen (rad/s)",  code: "{v}.Roll = {arg}f;",                tier: "advanced", arg: "rad/s" },
      { id: "power", label: "Power % setzen",       code: "{v}.GyroPower = {arg}f / 100f;",    tier: "advanced", arg: "0-100" }
    ]
  },

  "Fallschirm": {
    interface: "IMyParachute",
    category: "Antrieb",
    conditions: [
      { id: "deployed", label: "Geöffnet", expr: "{v}.Status == DoorStatus.Open", kind: "bool", tier: "standard" }
    ],
    actions: [
      { id: "open",   label: "Öffnen",      code: "{v}.OpenDoor();",   tier: "standard" },
      { id: "close",  label: "Schließen",   code: "{v}.CloseDoor();",  tier: "standard" }
    ]
  },

  "Jump Drive": {
    interface: "IMyJumpDrive",
    category: "Antrieb",
    conditions: [
      { id: "ready",     label: "Bereit",           expr: "{v}.Status == MyJumpDriveStatus.Ready",   kind: "bool", tier: "standard" },
      { id: "charging",  label: "Lädt",             expr: "{v}.Status == MyJumpDriveStatus.Charging", kind: "bool", tier: "standard" },
      { id: "chargeGT",  label: "Ladung > X %",     expr: "({v}.CurrentStoredPower / {v}.MaxStoredPower) * 100f > {arg}f", kind: "number", tier: "standard", arg: "%" }
    ],
    actions: [
      { id: "jump", label: "Springen (Custom-Ziel nötig)", code: "// Jump-Ziel via {v}.JumpDistance setzen; Auslösen via ApplyAction(\"Jump\")", tier: "advanced" },
      { id: "on",   label: "Einschalten",  code: "{v}.Enabled = true;",  tier: "standard" },
      { id: "off",  label: "Ausschalten",  code: "{v}.Enabled = false;", tier: "standard" }
    ]
  },

  // ============================================================
  // WERKZEUGE
  // ============================================================

  "Bohrer (Drill)": {
    interface: "IMyShipDrill",
    category: "Werkzeuge",
    conditions: [
      { id: "isOn", label: "Ist eingeschaltet", expr: "{v}.Enabled", kind: "bool", tier: "standard" }
    ],
    actions: [
      { id: "on",     label: "Einschalten",   code: "{v}.Enabled = true;",         tier: "standard" },
      { id: "off",    label: "Ausschalten",   code: "{v}.Enabled = false;",        tier: "standard" },
      { id: "toggle", label: "Umschalten",    code: "{v}.Enabled = !{v}.Enabled;", tier: "standard" }
    ]
  },

  "Schweißer (Welder)": {
    interface: "IMyShipWelder",
    category: "Werkzeuge",
    conditions: [
      { id: "isOn", label: "Ist eingeschaltet", expr: "{v}.Enabled", kind: "bool", tier: "standard" }
    ],
    actions: [
      { id: "on",     label: "Einschalten",   code: "{v}.Enabled = true;",         tier: "standard" },
      { id: "off",    label: "Ausschalten",   code: "{v}.Enabled = false;",        tier: "standard" },
      { id: "toggle", label: "Umschalten",    code: "{v}.Enabled = !{v}.Enabled;", tier: "standard" }
    ]
  },

  "Schleifer (Grinder)": {
    interface: "IMyShipGrinder",
    category: "Werkzeuge",
    conditions: [
      { id: "isOn", label: "Ist eingeschaltet", expr: "{v}.Enabled", kind: "bool", tier: "standard" }
    ],
    actions: [
      { id: "on",     label: "Einschalten",   code: "{v}.Enabled = true;",         tier: "standard" },
      { id: "off",    label: "Ausschalten",   code: "{v}.Enabled = false;",        tier: "standard" },
      { id: "toggle", label: "Umschalten",    code: "{v}.Enabled = !{v}.Enabled;", tier: "standard" }
    ]
  },

  "Projektor": {
    interface: "IMyProjector",
    category: "Werkzeuge",
    conditions: [
      { id: "projecting", label: "Projiziert gerade",      expr: "{v}.IsProjecting",      kind: "bool",   tier: "standard" },
      { id: "remainGT",   label: "Verbleibende Blöcke > X", expr: "{v}.RemainingBlocks > {arg}", kind: "number", tier: "standard", arg: "Anzahl Blöcke" },
      { id: "remainLT",   label: "Verbleibende Blöcke < X", expr: "{v}.RemainingBlocks < {arg}", kind: "number", tier: "standard", arg: "Anzahl Blöcke" }
    ],
    actions: [
      { id: "on",  label: "Einschalten",  code: "{v}.Enabled = true;",  tier: "standard" },
      { id: "off", label: "Ausschalten",  code: "{v}.Enabled = false;", tier: "standard" }
    ]
  },

  // ============================================================
  // WAFFEN
  // ============================================================

  "Waffe (Turret/Gun)": {
    interface: "IMyUserControllableGun",
    category: "Waffen",
    conditions: [
      { id: "shooting", label: "Schießt gerade", expr: "{v}.IsShooting", kind: "bool", tier: "standard" }
    ],
    actions: [
      { id: "shootOn",   label: "Feuer frei",    code: "{v}.SetValueBool(\"Shoot\", true);",  tier: "standard" },
      { id: "shootOff",  label: "Feuer ein",     code: "{v}.SetValueBool(\"Shoot\", false);", tier: "standard" },
      { id: "shootOnce", label: "Einzelschuss",  code: "{v}.ApplyAction(\"ShootOnce\");",     tier: "standard" }
    ]
  },

  "Geschützturm (Gatling)": {
    interface: "IMyLargeGatlingTurret",
    category: "Waffen",
    conditions: [
      { id: "shooting",  label: "Schießt gerade",  expr: "{v}.IsShooting",         kind: "bool", tier: "standard" },
      { id: "hasTarget", label: "Hat ein Ziel",    expr: "{v}.HasTarget",          kind: "bool", tier: "standard" },
      { id: "isOn",      label: "Ist eingeschaltet", expr: "{v}.Enabled",          kind: "bool", tier: "advanced" }
    ],
    actions: [
      { id: "on",       label: "Einschalten",   code: "{v}.Enabled = true;",   tier: "standard" },
      { id: "off",      label: "Ausschalten",   code: "{v}.Enabled = false;",  tier: "standard" },
      { id: "shootOn",  label: "Feuer frei",    code: "{v}.SetValueBool(\"Shoot\", true);",  tier: "standard" },
      { id: "shootOff", label: "Feuer ein",     code: "{v}.SetValueBool(\"Shoot\", false);", tier: "standard" },
      { id: "rangeSet", label: "Reichweite setzen (m)", code: "{v}.Range = {arg}f;", tier: "advanced", arg: "Meter" }
    ]
  },

  "Raketenturm": {
    interface: "IMyLargeMissileTurret",
    category: "Waffen",
    conditions: [
      { id: "shooting",  label: "Schießt gerade",   expr: "{v}.IsShooting",  kind: "bool", tier: "standard" },
      { id: "hasTarget", label: "Hat ein Ziel",     expr: "{v}.HasTarget",   kind: "bool", tier: "standard" }
    ],
    actions: [
      { id: "on",       label: "Einschalten",   code: "{v}.Enabled = true;",   tier: "standard" },
      { id: "off",      label: "Ausschalten",   code: "{v}.Enabled = false;",  tier: "standard" },
      { id: "shootOn",  label: "Feuer frei",    code: "{v}.SetValueBool(\"Shoot\", true);",  tier: "standard" },
      { id: "shootOff", label: "Feuer ein",     code: "{v}.SetValueBool(\"Shoot\", false);", tier: "standard" }
    ]
  },

  "Innenraum-Geschütz": {
    interface: "IMyLargeInteriorTurret",
    category: "Waffen",
    conditions: [
      { id: "shooting",  label: "Schießt gerade",   expr: "{v}.IsShooting",  kind: "bool", tier: "standard" },
      { id: "hasTarget", label: "Hat ein Ziel",     expr: "{v}.HasTarget",   kind: "bool", tier: "standard" }
    ],
    actions: [
      { id: "on",  label: "Einschalten",  code: "{v}.Enabled = true;",  tier: "standard" },
      { id: "off", label: "Ausschalten",  code: "{v}.Enabled = false;", tier: "standard" }
    ]
  },

  "Gatling-Gun (fest)": {
    interface: "IMySmallGatlingGun",
    category: "Waffen",
    conditions: [
      { id: "shooting", label: "Schießt gerade", expr: "{v}.IsShooting", kind: "bool", tier: "standard" }
    ],
    actions: [
      { id: "shootOn",  label: "Feuer frei",  code: "{v}.SetValueBool(\"Shoot\", true);",  tier: "standard" },
      { id: "shootOff", label: "Feuer ein",   code: "{v}.SetValueBool(\"Shoot\", false);", tier: "standard" }
    ]
  },

  "Raketenwerfer (fest)": {
    interface: "IMySmallMissileLauncher",
    category: "Waffen",
    conditions: [
      { id: "shooting", label: "Feuert gerade", expr: "{v}.IsShooting", kind: "bool", tier: "standard" }
    ],
    actions: [
      { id: "shootOn",   label: "Feuer frei",    code: "{v}.SetValueBool(\"Shoot\", true);",  tier: "standard" },
      { id: "shootOff",  label: "Feuer ein",     code: "{v}.SetValueBool(\"Shoot\", false);", tier: "standard" },
      { id: "shootOnce", label: "Einzelschuss",  code: "{v}.ApplyAction(\"ShootOnce\");",     tier: "standard" }
    ]
  },

  "Warhead (Sprengkopf)": {
    interface: "IMyWarhead",
    category: "Waffen",
    conditions: [
      { id: "armed",    label: "Scharf",          expr: "{v}.IsArmed",         kind: "bool", tier: "standard" },
      { id: "counting", label: "Countdown läuft", expr: "{v}.IsCountingDown",  kind: "bool", tier: "standard" }
    ],
    actions: [
      { id: "arm",      label: "Scharf machen",   code: "{v}.IsArmed = true;",       tier: "standard" },
      { id: "disarm",   label: "Entschärfen",     code: "{v}.IsArmed = false;",      tier: "standard" },
      { id: "start",    label: "Countdown start", code: "{v}.StartCountdown();",     tier: "standard" },
      { id: "stop",     label: "Countdown stop",  code: "{v}.StopCountdown();",      tier: "standard" },
      { id: "detonate", label: "Detonieren",      code: "{v}.Detonate();",           tier: "advanced" }
    ]
  },

  "Decoy / Köder": {
    interface: "IMyDecoy",
    category: "Waffen",
    conditions: [
      { id: "isOn", label: "Ist eingeschaltet", expr: "{v}.Enabled", kind: "bool", tier: "standard" }
    ],
    actions: [
      { id: "on",  label: "Einschalten",  code: "{v}.Enabled = true;",  tier: "standard" },
      { id: "off", label: "Ausschalten",  code: "{v}.Enabled = false;", tier: "standard" }
    ]
  },

  // ============================================================
  // SENSORIK
  // ============================================================

  "Sensor": {
    interface: "IMySensorBlock",
    category: "Sensorik",
    conditions: [
      { id: "isActive",     label: "Etwas erkannt?",            expr: "{v}.IsActive",                              kind: "bool", tier: "standard" },
      { id: "lastDetected", label: "Erkannt enthält Spieler",   expr: "{v}.LastDetectedEntity.HasPlayerAccess",    kind: "bool", tier: "advanced" },
      { id: "enabled",      label: "Ist eingeschaltet",         expr: "{v}.Enabled",                                kind: "bool", tier: "advanced" }
    ],
    actions: [
      { id: "on",     label: "Einschalten",  code: "{v}.Enabled = true;",         tier: "standard" },
      { id: "off",    label: "Ausschalten",  code: "{v}.Enabled = false;",        tier: "standard" },
      { id: "toggle", label: "Umschalten",   code: "{v}.Enabled = !{v}.Enabled;", tier: "standard" }
    ]
  },

  "Kamera": {
    interface: "IMyCameraBlock",
    category: "Sensorik",
    conditions: [
      { id: "isActive", label: "Aktiv (steuerbar)", expr: "{v}.IsActive", kind: "bool", tier: "standard" },
      { id: "canScan",  label: "Kann scannen",      expr: "{v}.CanScan({arg}f)", kind: "raw", tier: "advanced", arg: "Meter (Reichweite)" }
    ],
    actions: [
      { id: "raycastOn",  label: "Raycast aktivieren",  code: "{v}.EnableRaycast = true;",  tier: "standard" },
      { id: "raycastOff", label: "Raycast deaktivieren", code: "{v}.EnableRaycast = false;", tier: "standard" },
      { id: "on",         label: "Einschalten",  code: "{v}.Enabled = true;",  tier: "advanced" },
      { id: "off",        label: "Ausschalten",  code: "{v}.Enabled = false;", tier: "advanced" }
    ]
  },

  "Funkantenne": {
    interface: "IMyRadioAntenna",
    category: "Sensorik",
    conditions: [
      { id: "broadcasting", label: "Sendet aktiv",    expr: "{v}.EnableBroadcasting", kind: "bool", tier: "standard" },
      { id: "rangeGT",      label: "Reichweite > X m", expr: "{v}.Radius > {arg}f",   kind: "number", tier: "advanced", arg: "Meter" }
    ],
    actions: [
      { id: "bcOn",     label: "Broadcasting an",      code: "{v}.EnableBroadcasting = true;",  tier: "standard" },
      { id: "bcOff",    label: "Broadcasting aus",     code: "{v}.EnableBroadcasting = false;", tier: "standard" },
      { id: "setRange", label: "Reichweite setzen (m)", code: "{v}.Radius = {arg}f;",           tier: "advanced", arg: "Meter" },
      { id: "on",       label: "Einschalten",          code: "{v}.Enabled = true;",  tier: "standard" },
      { id: "off",      label: "Ausschalten",          code: "{v}.Enabled = false;", tier: "standard" }
    ]
  },

  "Laser-Antenne": {
    interface: "IMyLaserAntenna",
    category: "Sensorik",
    conditions: [
      { id: "connected", label: "Verbunden",     expr: "{v}.Status == MyLaserAntennaStatus.Connected", kind: "bool", tier: "standard" }
    ],
    actions: [
      { id: "on",  label: "Einschalten",  code: "{v}.Enabled = true;",  tier: "standard" },
      { id: "off", label: "Ausschalten",  code: "{v}.Enabled = false;", tier: "standard" }
    ]
  },

  "Erz-Detektor": {
    interface: "IMyOreDetector",
    category: "Sensorik",
    conditions: [
      { id: "isOn", label: "Ist eingeschaltet", expr: "{v}.Enabled", kind: "bool", tier: "standard" }
    ],
    actions: [
      { id: "rangeSet", label: "Reichweite setzen (m)", code: "{v}.Range = {arg}f;", tier: "standard", arg: "Meter" },
      { id: "on",       label: "Einschalten",  code: "{v}.Enabled = true;",  tier: "standard" },
      { id: "off",      label: "Ausschalten",  code: "{v}.Enabled = false;", tier: "standard" }
    ]
  },

  "Beacon": {
    interface: "IMyBeacon",
    category: "Sensorik",
    conditions: [
      { id: "isOn",   label: "Ist eingeschaltet", expr: "{v}.Enabled",      kind: "bool",   tier: "standard" },
      { id: "rangeGT", label: "Reichweite > X m", expr: "{v}.Radius > {arg}f", kind: "number", tier: "advanced", arg: "Meter" }
    ],
    actions: [
      { id: "setRange", label: "Reichweite setzen (m)", code: "{v}.Radius = {arg}f;", tier: "standard", arg: "Meter" },
      { id: "on",       label: "Einschalten",  code: "{v}.Enabled = true;",  tier: "standard" },
      { id: "off",      label: "Ausschalten",  code: "{v}.Enabled = false;", tier: "standard" }
    ]
  },

  // ============================================================
  // STEUERUNG
  // ============================================================

  "Cockpit / Sitz / Remote": {
    interface: "IMyShipController",
    category: "Steuerung",
    conditions: [
      { id: "occupied",  label: "Pilot drin",              expr: "{v}.IsUnderControl",                          kind: "bool",   tier: "standard" },
      { id: "dampeners", label: "Inertia-Dampers an",      expr: "{v}.DampenersOverride",                       kind: "bool",   tier: "standard" },
      { id: "speedGT",   label: "Geschw. > X m/s",         expr: "{v}.GetShipSpeed() > {arg}",                  kind: "number", tier: "standard", arg: "m/s" },
      { id: "speedLT",   label: "Geschw. < X m/s",         expr: "{v}.GetShipSpeed() < {arg}",                  kind: "number", tier: "standard", arg: "m/s" },
      { id: "inGravity", label: "In Gravitation",          expr: "{v}.GetNaturalGravity().Length() > 0.01",     kind: "bool",   tier: "standard" },
      { id: "mainCock",  label: "Ist Haupt-Cockpit",       expr: "{v}.IsMainCockpit",                            kind: "bool",   tier: "advanced" }
    ],
    actions: [
      { id: "dampOn",    label: "Dampers an",            code: "{v}.DampenersOverride = true;",  tier: "standard" },
      { id: "dampOff",   label: "Dampers aus",           code: "{v}.DampenersOverride = false;", tier: "standard" },
      { id: "handbrake", label: "Handbremse umschalten", code: "{v}.HandBrake = !{v}.HandBrake;", tier: "standard" }
    ]
  },

  "Remote Control": {
    interface: "IMyRemoteControl",
    category: "Steuerung",
    conditions: [
      { id: "autoPilot", label: "Autopilot aktiv",  expr: "{v}.IsAutoPilotEnabled", kind: "bool", tier: "standard" }
    ],
    actions: [
      { id: "apOn",   label: "Autopilot an",           code: "{v}.SetAutoPilotEnabled(true);",  tier: "standard" },
      { id: "apOff",  label: "Autopilot aus",          code: "{v}.SetAutoPilotEnabled(false);", tier: "standard" },
      { id: "clearW", label: "Wegpunkte löschen",      code: "{v}.ClearWaypoints();",           tier: "advanced" }
    ]
  },

  "Timer Block": {
    interface: "IMyTimerBlock",
    category: "Steuerung",
    conditions: [
      { id: "running", label: "Läuft gerade", expr: "{v}.IsCountingDown", kind: "bool", tier: "standard" }
    ],
    actions: [
      { id: "start",   label: "Starten",          code: "{v}.StartCountdown();", tier: "standard" },
      { id: "stop",    label: "Stoppen",          code: "{v}.StopCountdown();",  tier: "standard" },
      { id: "trigger", label: "Sofort auslösen",  code: "{v}.Trigger();",        tier: "standard" },
      { id: "delay",   label: "Delay setzen (s)", code: "{v}.TriggerDelay = {arg}f;", tier: "advanced", arg: "Sekunden" }
    ]
  },

  "Programmable Block (anderer)": {
    interface: "IMyProgrammableBlock",
    category: "Steuerung",
    conditions: [
      { id: "running", label: "Läuft gerade", expr: "{v}.IsRunning", kind: "bool", tier: "standard" }
    ],
    actions: [
      { id: "run", label: "Mit Argument starten", code: "{v}.TryRun({arg});", tier: "standard", arg: "\"argument\" (mit Anführungszeichen)" }
    ]
  },

  "Button-Panel": {
    interface: "IMyButtonPanel",
    category: "Steuerung",
    conditions: [],
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
      { id: "isOn", label: "Ist eingeschaltet", expr: "{v}.Enabled", kind: "bool", tier: "standard" }
    ],
    actions: [
      { id: "write",      label: "Text schreiben",    code: "{v}.WriteText({arg}, false);", tier: "standard", arg: "\"Hallo Welt\" (mit Anführungszeichen)" },
      { id: "append",     label: "Text anhängen",     code: "{v}.WriteText({arg}, true);",  tier: "standard", arg: "\"...\" (mit Anführungszeichen)" },
      { id: "fontSize",   label: "Schriftgröße",      code: "{v}.FontSize = {arg}f;",        tier: "advanced", arg: "z.B. 1.0" },
      { id: "modeText",   label: "Modus: Text+Bild",  code: "{v}.ContentType = ContentType.TEXT_AND_IMAGE;", tier: "advanced" },
      { id: "modeScript", label: "Modus: Script",     code: "{v}.ContentType = ContentType.SCRIPT;",         tier: "advanced" },
      { id: "on",         label: "Einschalten",       code: "{v}.Enabled = true;",  tier: "standard" },
      { id: "off",        label: "Ausschalten",       code: "{v}.Enabled = false;", tier: "standard" }
    ]
  },

  "Lichter / Spotlight": {
    interface: "IMyLightingBlock",
    category: "Anzeige",
    conditions: [
      { id: "on", label: "Ist an", expr: "{v}.Enabled", kind: "bool", tier: "standard" }
    ],
    actions: [
      { id: "on",        label: "Einschalten",   code: "{v}.Enabled = true;",         tier: "standard" },
      { id: "off",       label: "Ausschalten",   code: "{v}.Enabled = false;",        tier: "standard" },
      { id: "toggle",    label: "Umschalten",    code: "{v}.Enabled = !{v}.Enabled;", tier: "standard" },
      { id: "blinkOn",   label: "Blinken setzen (Intervall s)", code: "{v}.BlinkIntervalSeconds = {arg}f;", tier: "advanced", arg: "Sekunden" },
      { id: "color",     label: "Farbe setzen (R,G,B)",         code: "{v}.Color = new Color({arg});",      tier: "advanced", arg: "z.B. 255,80,20" },
      { id: "intensity", label: "Intensität setzen",            code: "{v}.Intensity = {arg}f;",            tier: "advanced", arg: "z.B. 5.0" }
    ]
  },

  "Soundblock / Lautsprecher": {
    interface: "IMySoundBlock",
    category: "Anzeige",
    conditions: [],
    actions: [
      { id: "play",   label: "Sound abspielen",    code: "{v}.Play();",            tier: "standard" },
      { id: "stop",   label: "Sound stoppen",      code: "{v}.Stop();",            tier: "standard" },
      { id: "vol",    label: "Lautstärke setzen",  code: "{v}.Volume = {arg}f;",   tier: "standard", arg: "0.0 - 1.0" },
      { id: "loopSet", label: "Loop-Dauer setzen", code: "{v}.LoopPeriod = {arg}f;", tier: "advanced", arg: "Sekunden" }
    ]
  },

  // ============================================================
  // KOMFORT (Medi-Raum, Cryo)
  // ============================================================

  "Medi-Raum (Medical Room)": {
    interface: "IMyMedicalRoom",
    category: "Komfort",
    conditions: [
      { id: "isOn", label: "Ist eingeschaltet", expr: "{v}.Enabled", kind: "bool", tier: "standard" }
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
      { id: "occupied", label: "Belegt", expr: "{v}.IsUnderControl", kind: "bool", tier: "standard" }
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
      { id: "applyAction", label: "ApplyAction(...) aufrufen", code: "{v}.ApplyAction({arg});",   tier: "advanced", arg: "\"OnOff_On\" (mit Anführungszeichen)" },
      { id: "setBool",     label: "SetValueBool(...)",         code: "{v}.SetValueBool({arg});",  tier: "advanced", arg: "\"Shoot\", true" },
      { id: "setFloat",    label: "SetValueFloat(...)",        code: "{v}.SetValueFloat({arg});", tier: "advanced", arg: "\"Velocity\", 1.5f" },
      { id: "rawCode",     label: "Roher C# Code (nutze {v})", code: "{arg}",                     tier: "advanced", arg: "z.B. {v}.Enabled = !{v}.Enabled;" },
      { id: "on",          label: "Einschalten (FunctionalBlock)",  code: "((IMyFunctionalBlock){v}).Enabled = true;",  tier: "advanced" },
      { id: "off",         label: "Ausschalten (FunctionalBlock)",  code: "((IMyFunctionalBlock){v}).Enabled = false;", tier: "advanced" }
    ]
  }
};

// ============================================================
// KATEGORIEN-REIHENFOLGE (für gruppierte Dropdowns)
// ============================================================

const CATEGORIES = ["Bewegung", "Energie", "Förderung", "Produktion",
  "Antrieb", "Werkzeuge", "Waffen", "Sensorik", "Steuerung", "Anzeige",
  "Komfort", "Custom"];

// ============================================================
// LOOKUP HELPERS
// ============================================================

// Block-Typ-Dropdown gruppiert nach Kategorie.
// filterKind: undefined | 'conditions' | 'actions' — filtert
// Block-Typen, die in der jeweiligen Kategorie nichts anbieten.
function blockTypeOptions(filterKind) {
  const visible = Object.keys(BLOCKS).filter(
    k => !filterKind || (BLOCKS[k][filterKind] || []).length > 0
  );

  // Gruppiere nach category
  const byCat = {};
  for (const k of visible) {
    const cat = BLOCKS[k].category || "Sonstiges";
    (byCat[cat] = byCat[cat] || []).push(k);
  }

  // Reihenfolge: CATEGORIES, dann alle weiteren alphabetisch
  const orderedCats = [
    ...CATEGORIES.filter(c => byCat[c]),
    ...Object.keys(byCat).filter(c => !CATEGORIES.includes(c)).sort()
  ];

  return orderedCats.map(cat => {
    const opts = byCat[cat].map(k => `<option value="${k}">${k}</option>`).join("");
    return `<optgroup label="${cat}">${opts}</optgroup>`;
  }).join("");
}

// Helfer: nach Tier in <optgroup> sortieren (Standard / Erweitert).
// Wenn nur eine Tier-Gruppe vorhanden ist, wird kein optgroup
// gerendert (sieht sauberer aus).
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
