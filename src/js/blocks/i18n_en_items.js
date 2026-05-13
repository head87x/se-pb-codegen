// ============================================================
// I18N für Condition/Action-Labels (v1.8.0)
// ============================================================
// Strukturiert wie BLOCKS, aber pro Eintrag nur die englischen Labels
// indiziert mit der ID. `localizedItemLabel(item, blockType, kind)`
// in i18n_en.js liest hier nach.

const ITEMS_EN = {

  // ---------- Inventar-Standardconditions (auf jedem Block mit Inventar) ----------
  _inv: {
    hasItem:      "Contains item",
    itemAmountGT: "Item amount > X",
    itemAmountLT: "Item amount < X"
  },

  "Tür (Door)": {
    conditions: {
      open:        "Is open",
      closed:      "Is closed",
      opening:     "Is opening",
      closing:     "Is closing",
      enabledTrue: "Is enabled",
      isWorking:   "Working (has power)",
      openRatioGT: "Open ratio > X %"
    },
    actions: {
      open:      "Open",
      close:     "Close",
      toggle:    "Toggle",
      on:        "Enable (Enabled = true)",
      off:       "Disable (lock)",
      setCustom: "Set CustomData"
    }
  },

  "Hangartor (Hangar Door)": {
    conditions: {
      fullyOpen:   "Fully open",
      fullyClosed: "Fully closed",
      moving:      "Is moving",
      enabledTrue: "Is enabled",
      openRatioGT: "Open ratio > X %",
      isWorking:   "Working (has power)"
    },
    actions: {
      open:   "Open",
      close:  "Close",
      toggle: "Toggle",
      on:     "Enable",
      off:    "Disable"
    }
  },

  "Kolben (Piston)": {
    conditions: {
      extending:   "Extending (velocity > 0)",
      retracting:  "Retracting (velocity < 0)",
      atTop:       "Fully extended",
      atBottom:    "Fully retracted",
      posGreater:  "Position > X (m)",
      posLess:     "Position < X (m)",
      enabledTrue: "Is enabled",
      isWorking:   "Working (has power)",
      minLimitGT:  "Min-Limit > X (m)",
      maxLimitLT:  "Max-Limit < X (m)",
      velocityGT:  "Velocity > X (m/s)",
      isAttached:  "Top part attached"
    },
    actions: {
      extend:      "Extend",
      retract:     "Retract",
      reverse:     "Reverse direction",
      setSpeed:    "Set velocity",
      setMax:      "Set Max-Limit (m)",
      setMin:      "Set Min-Limit (m)",
      on:          "Turn on",
      off:         "Turn off",
      extendOnce:  "Extend to max",
      retractOnce: "Retract to min",
      attach:      "Attach top part",
      detach:      "Detach top part",
      setCustom:   "Set CustomData"
    }
  },

  "Rotor (Advanced/Stator)": {
    conditions: {
      rotating:     "Rotating (RPM != 0)",
      angleGT:      "Angle > X (deg)",
      angleLT:      "Angle < X (deg)",
      enabledTrue:  "Is enabled",
      isWorking:    "Working (has power)",
      isLocked:     "Is locked (RotorLock)",
      isAttached:   "Top part attached",
      rpmGT:        "Target RPM > X",
      rpmLT:        "Target RPM < X",
      torqueGT:     "Torque > X (N·m)",
      lowerLimitGT: "Lower limit > X (deg)",
      upperLimitLT: "Upper limit < X (deg)",
      displaceGT:   "Displacement > X (m)"
    },
    actions: {
      setRpm:       "Set target RPM",
      stop:         "Stop (RPM = 0)",
      lock:         "Lock",
      unlock:       "Unlock",
      reverse:      "Reverse direction",
      on:           "Turn on",
      off:          "Turn off",
      setLower:     "Set lower limit (deg)",
      setUpper:     "Set upper limit (deg)",
      setTorque:    "Set torque (N·m)",
      setBrakeTorq: "Set braking torque (N·m)",
      setDisplace:  "Set displacement (m)",
      attach:       "Attach top part",
      detach:       "Detach top part",
      setCustom:    "Set CustomData"
    }
  },

  "Verbinder (Connector)": {
    conditions: {
      connected:   "Is connected",
      ready:       "Ready (connectable)",
      unconnected: "Not connected",
      hasItem:      "Contains item",
      itemAmountGT: "Item amount > X",
      itemAmountLT: "Item amount < X",
      fillGT:      "Inventory fill > X %",
      enabledTrue: "Is enabled",
      throwOnTrue: "Throw-Out active"
    },
    actions: {
      connect:    "Connect",
      disconnect: "Disconnect",
      toggle:     "Toggle",
      on:         "Turn on",
      off:        "Turn off",
      throwOn:    "Throw-Out on (ejector mode)",
      throwOff:   "Throw-Out off"
    }
  },

  "Merge-Block": {
    conditions: {
      connected:   "Connected to another merge",
      enabledTrue: "Is enabled",
      isWorking:   "Working"
    },
    actions: {
      on:     "Turn on",
      off:    "Turn off",
      toggle: "Toggle"
    }
  },

  "Magnet-Plate / Landing-Gear": {
    conditions: {
      locked:     "Is locked",
      ready:      "Ready to lock",
      unlockedSt: "Currently unlocked",
      autoLockOn: "Auto-Lock active"
    },
    actions: {
      lock:    "Lock",
      unlock:  "Unlock",
      toggle:  "Toggle",
      autoOn:  "Auto-Lock on",
      autoOff: "Auto-Lock off"
    }
  },

  "Akku (Battery)": {
    conditions: {
      chargeGT:  "Charge > X %",
      chargeLT:  "Charge < X %",
      charging:  "Is charging",
      isOn:      "Is enabled",
      isWorking: "Working",
      outputGT:  "Power output > X (MW)",
      inputGT:   "Power input > X (MW)",
      modeAuto:  "Mode = Auto",
      modeRech:  "Mode = Recharge",
      modeDisch: "Mode = Discharge"
    },
    actions: {
      auto:      "Mode: Auto",
      recharge:  "Mode: Recharge",
      discharge: "Mode: Discharge",
      on:        "Turn on",
      off:       "Turn off"
    }
  },

  "Reaktor": {
    conditions: {
      outputGT:     "Output > X (MW)",
      isOn:         "Is enabled",
      isWorking:    "Working",
      maxOutGT:     "Max output > X (MW)",
      hasItem:      "Contains item",
      itemAmountGT: "Item amount > X",
      itemAmountLT: "Item amount < X"
    },
    actions: {
      on:  "Turn on",
      off: "Turn off"
    }
  },

  "Solarpanel": {
    conditions: {
      outputGT: "Output > X (kW)",
      outputLT: "Output < X (kW)",
      maxOutGT: "Max output > X (kW)",
      isOn:     "Is enabled"
    },
    actions: {
      on:  "Turn on",
      off: "Turn off"
    }
  },

  "Windturbine": {
    conditions: {
      outputGT: "Output > X (kW)",
      outputLT: "Output < X (kW)",
      isOn:     "Is enabled"
    },
    actions: {
      on:  "Turn on",
      off: "Turn off"
    }
  },

  "H2-Motor (Hydrogen Engine)": {
    conditions: {
      outputGT:  "Output > X (kW)",
      isOn:      "Is enabled",
      isWorking: "Working"
    },
    actions: {
      on:  "Turn on",
      off: "Turn off"
    }
  },

  "Sortierer (Sorter)": {
    conditions: {
      drainAll:     "Drain-All active",
      isOn:         "Is enabled",
      isWorking:    "Working",
      hasItem:      "Contains item",
      itemAmountGT: "Item amount > X",
      itemAmountLT: "Item amount < X"
    },
    actions: {
      drainOn:  "Drain-All on",
      drainOff: "Drain-All off",
      on:       "Turn on",
      off:      "Turn off"
    }
  },

  "Frachtcontainer (Cargo)": {
    conditions: {
      fillGT:       "Volume fill > X %",
      fillLT:       "Volume fill < X %",
      empty:        "Is empty",
      massGT:       "Mass > X (kg)",
      itemCntGT:    "Item count > X",
      hasItem:      "Contains item",
      itemAmountGT: "Item amount > X",
      itemAmountLT: "Item amount < X"
    },
    actions: {
      setCustom: "Set CustomData"
    }
  },

  "Refinery / Schmelze": {
    conditions: {
      producing:    "Currently producing",
      queueEmpty:   "Queue empty",
      useConveyor:  "Conveyor in use",
      isOn:         "Is enabled",
      isWorking:    "Working",
      hasItem:      "Contains item",
      itemAmountGT: "Item amount > X",
      itemAmountLT: "Item amount < X"
    },
    actions: {
      convOn:  "Conveyor on",
      convOff: "Conveyor off",
      on:      "Turn on",
      off:     "Turn off",
      clearQ:  "Clear queue"
    }
  },

  "Assembler": {
    conditions: {
      producing:       "Currently producing",
      queueEmpty:      "Queue empty",
      isDisassembling: "Currently disassembling",
      isAssembling:    "Currently assembling",
      coopOn:          "Cooperative active",
      repeatOn:        "Repeating active",
      isOn:            "Is enabled",
      hasItem:         "Contains item",
      itemAmountGT:    "Item amount > X",
      itemAmountLT:    "Item amount < X"
    },
    actions: {
      assemble:    "Mode: Assemble",
      disassemble: "Mode: Disassemble",
      cooperative: "Toggle cooperative",
      repeatOn:    "Repeating on",
      repeatOff:   "Repeating off",
      on:          "Turn on",
      off:         "Turn off",
      clearQ:      "Clear queue"
    }
  },

  "Gas-Generator (O2/H2)": {
    conditions: {
      producing:    "Currently producing",
      isOn:         "Is enabled",
      refillOn:     "Auto-Refill active",
      canProd:      "Can produce",
      hasItem:      "Contains item",
      itemAmountGT: "Item amount > X",
      itemAmountLT: "Item amount < X"
    },
    actions: {
      on:        "Turn on",
      off:       "Turn off",
      refillOn:  "Auto-Refill on",
      refillOff: "Auto-Refill off"
    }
  },

  "Tank / Gas-Tank": {
    conditions: {
      fillGT:    "Fill > X %",
      fillLT:    "Fill < X %",
      stockpile: "Stockpile active",
      isOn:      "Is enabled",
      capGT:     "Capacity > X (L)"
    },
    actions: {
      stockOn:  "Stockpile on",
      stockOff: "Stockpile off",
      on:       "Turn on",
      off:      "Turn off"
    }
  },

  "Air Vent": {
    conditions: {
      pressurized:    "Room pressurized",
      depressurized:  "Room depressurized",
      pressuring:     "Pressurizing",
      depressuring:   "Depressurizing",
      pressureGT:     "O₂ level > X %",
      pressureLT:     "O₂ level < X %",
      canPressurize:  "Can pressurize",
      depressureMode: "In depressurize mode"
    },
    actions: {
      pressOn:  "Pressurize",
      pressOff: "Depressurize",
      on:       "Turn on",
      off:      "Turn off"
    }
  },

  "Thruster (Triebwerk)": {
    conditions: {
      thrustGT:    "Current thrust > X (kN)",
      override:    "Override active",
      isOn:        "Is enabled",
      maxThrustGT: "Max thrust > X (kN)",
      maxEffGT:    "Effective max thrust > X (kN)",
      overrideGT:  "Override value > X %"
    },
    actions: {
      override:    "Set override %",
      overrideOff: "Override off",
      on:          "Turn on",
      off:         "Turn off"
    }
  },

  "Gyroskop": {
    conditions: {
      override: "Override active",
      isOn:     "Is enabled",
      powerGT:  "Power > X %"
    },
    actions: {
      overrideOn:  "Enable override",
      overrideOff: "Disable override",
      yaw:         "Set Yaw (rad/s)",
      pitch:       "Set Pitch (rad/s)",
      roll:        "Set Roll (rad/s)",
      power:       "Set Power %",
      on:          "Turn on",
      off:         "Turn off"
    }
  },

  "Fallschirm": {
    conditions: {
      deployed:   "Deployed",
      autoDeploy: "Auto-Deploy active",
      deployHGT:  "Deploy height > X (m)"
    },
    actions: {
      open:    "Open",
      close:   "Close",
      autoOn:  "Auto-Deploy on",
      autoOff: "Auto-Deploy off",
      deployH: "Set deploy height (m)"
    }
  },

  "Jump Drive": {
    conditions: {
      ready:      "Ready",
      charging:   "Charging",
      chargeGT:   "Charge > X %",
      jumpDistGT: "Jump distance > X (km)",
      isOn:       "Is enabled"
    },
    actions: {
      jump:      "Trigger jump",
      jumpAbort: "Abort jump",
      on:        "Turn on",
      off:       "Turn off"
    }
  },

  "Bohrer (Drill)": {
    conditions: {
      isOn:         "Is enabled",
      isWorking:    "Working",
      fillGT:       "Inventory fill > X %",
      hasItem:      "Contains item",
      itemAmountGT: "Item amount > X",
      itemAmountLT: "Item amount < X"
    },
    actions: {
      on:     "Turn on",
      off:    "Turn off",
      toggle: "Toggle"
    }
  },

  "Schweißer (Welder)": {
    conditions: {
      isOn:       "Is enabled",
      isWorking:  "Working",
      helpOthers: "Help-Others active"
    },
    actions: {
      on:      "Turn on",
      off:     "Turn off",
      toggle:  "Toggle",
      helpOn:  "Help-Others on",
      helpOff: "Help-Others off"
    }
  },

  "Schleifer (Grinder)": {
    conditions: {
      isOn:         "Is enabled",
      isWorking:    "Working",
      helpOthers:   "Help-Others active",
      fillGT:       "Inventory fill > X %",
      hasItem:      "Contains item",
      itemAmountGT: "Item amount > X",
      itemAmountLT: "Item amount < X"
    },
    actions: {
      on:      "Turn on",
      off:     "Turn off",
      toggle:  "Toggle",
      helpOn:  "Help-Others on",
      helpOff: "Help-Others off"
    }
  },

  "Projektor": {
    conditions: {
      projecting: "Currently projecting",
      remainGT:   "Remaining blocks > X",
      remainLT:   "Remaining blocks < X",
      buildable:  "Buildable blocks > X",
      totalGT:    "Total blocks > X",
      isOn:       "Is enabled"
    },
    actions: {
      on:  "Turn on",
      off: "Turn off"
    }
  },

  "Waffe (Turret/Gun)": {
    conditions: {
      shooting: "Currently shooting",
      isOn:     "Is enabled"
    },
    actions: {
      shootOn:   "Continuous fire on",
      shootOff:  "Cease fire",
      shootOnce: "Single shot",
      on:        "Turn on",
      off:       "Turn off"
    }
  },

  "Geschützturm (Gatling)": {
    conditions: {
      shooting:     "Currently shooting",
      hasTarget:    "Has a target",
      isOn:         "Is enabled",
      isWorking:    "Working",
      rangeGT:      "Range > X (m)",
      underControl: "Controlled by player"
    },
    actions: {
      on:          "Turn on",
      off:         "Turn off",
      shootOn:     "Continuous fire on",
      shootOff:    "Cease fire",
      rangeSet:    "Set range (m)",
      resetTarget: "Reset target lock"
    }
  },

  "Raketenturm": {
    conditions: {
      shooting:  "Currently shooting",
      hasTarget: "Has a target",
      isOn:      "Is enabled",
      rangeGT:   "Range > X (m)"
    },
    actions: {
      on:       "Turn on",
      off:      "Turn off",
      shootOn:  "Continuous fire on",
      shootOff: "Cease fire",
      rangeSet: "Set range (m)"
    }
  },

  "Innenraum-Geschütz": {
    conditions: {
      shooting:  "Currently shooting",
      hasTarget: "Has a target",
      isOn:      "Is enabled"
    },
    actions: {
      on:  "Turn on",
      off: "Turn off"
    }
  },

  "Gatling-Gun (fest)": {
    conditions: {
      shooting: "Currently shooting",
      isOn:     "Is enabled"
    },
    actions: {
      shootOn:  "Continuous fire on",
      shootOff: "Cease fire",
      on:       "Turn on",
      off:      "Turn off"
    }
  },

  "Raketenwerfer (fest)": {
    conditions: {
      shooting: "Currently firing",
      isOn:     "Is enabled"
    },
    actions: {
      shootOn:   "Continuous fire on",
      shootOff:  "Cease fire",
      shootOnce: "Single missile",
      on:        "Turn on",
      off:       "Turn off"
    }
  },

  "Warhead (Sprengkopf)": {
    conditions: {
      armed:     "Armed",
      counting:  "Countdown running",
      detTimeGT: "Remaining > X (s)"
    },
    actions: {
      arm:      "Arm",
      disarm:   "Disarm",
      start:    "Start countdown",
      stop:     "Stop countdown",
      setDelay: "Set detonation delay (s)",
      detonate: "Detonate"
    }
  },

  "Decoy / Köder": {
    conditions: {
      isOn: "Is enabled"
    },
    actions: {
      on:     "Turn on",
      off:    "Turn off",
      toggle: "Toggle"
    }
  },

  "Sensor": {
    conditions: {
      isActive:     "Detected something",
      lastDetected: "Player detected (HasAccess)",
      enabled:      "Is enabled",
      playPresent:  "Player in range",
      frontGT:      "Front range > X (m)",
      backGT:       "Back range > X (m)"
    },
    actions: {
      on:        "Turn on",
      off:       "Turn off",
      toggle:    "Toggle",
      frontSet:  "Front range (m)",
      backSet:   "Back range (m)",
      leftSet:   "Left range (m)",
      rightSet:  "Right range (m)",
      topSet:    "Top range (m)",
      bottomSet: "Bottom range (m)",
      playOn:    "Detect players on",
      playOff:   "Detect players off",
      enemyOn:   "Detect enemies on",
      enemyOff:  "Detect enemies off",
      friendOn:  "Detect friends on",
      friendOff: "Detect friends off"
    }
  },

  "Kamera": {
    conditions: {
      isActive:  "Active (controllable)",
      canScan:   "Can scan (range)",
      raycastOn: "Raycast active",
      rangeGT:   "Raycast range > X (m)"
    },
    actions: {
      raycastOn:  "Enable raycast",
      raycastOff: "Disable raycast",
      on:         "Turn on",
      off:        "Turn off"
    }
  },

  "Funkantenne": {
    conditions: {
      broadcasting: "Broadcasting actively",
      rangeGT:      "Range > X (m)",
      isOn:         "Is enabled"
    },
    actions: {
      bcOn:     "Broadcasting on",
      bcOff:    "Broadcasting off",
      setRange: "Set range (m)",
      hudOn:    "Show on HUD on",
      hudOff:   "Show on HUD off",
      on:       "Turn on",
      off:      "Turn off"
    }
  },

  "Laser-Antenne": {
    conditions: {
      connected: "Connected",
      isOn:      "Is enabled"
    },
    actions: {
      on:  "Turn on",
      off: "Turn off"
    }
  },

  "Erz-Detektor": {
    conditions: {
      isOn:    "Is enabled",
      rangeGT: "Range > X (m)"
    },
    actions: {
      rangeSet: "Set range (m)",
      on:       "Turn on",
      off:      "Turn off"
    }
  },

  "Beacon": {
    conditions: {
      isOn:    "Is enabled",
      rangeGT: "Range > X (m)"
    },
    actions: {
      setRange: "Set range (m)",
      on:       "Turn on",
      off:      "Turn off",
      setName:  "Set custom name",
      setData:  "Set CustomData"
    }
  },

  "Cockpit / Sitz / Remote": {
    conditions: {
      occupied:         "Pilot inside",
      dampeners:        "Inertia dampers on",
      speedGT:          "Speed > X (m/s)",
      speedLT:          "Speed < X (m/s)",
      inGravity:        "In gravity",
      mainCock:         "Is main cockpit",
      massGT:           "Ship mass > X (kg)",
      handbrakeOn:      "Handbrake on",
      controlWheels:    "Controls wheels",
      controlThrusters: "Controls thrusters"
    },
    actions: {
      dampOn:       "Dampers on",
      dampOff:      "Dampers off",
      handbrake:    "Toggle handbrake",
      handbrakeOn:  "Handbrake on",
      handbrakeOff: "Handbrake off",
      ctlThrustOn:  "Controls thrusters on",
      ctlThrustOff: "Controls thrusters off"
    }
  },

  "Remote Control": {
    conditions: {
      autoPilot:    "Autopilot active",
      speedGT:      "Speed > X (m/s)",
      inGravity:    "In gravity",
      speedLimitGT: "Speed limit > X (m/s)"
    },
    actions: {
      apOn:     "Autopilot on",
      apOff:    "Autopilot off",
      clearW:   "Clear waypoints",
      setSpeed: "Set speed limit (m/s)",
      dockMode: "Docking mode on",
      dockOff:  "Docking mode off"
    }
  },

  "Timer Block": {
    conditions: {
      running: "Currently running",
      delayGT: "Delay > X (s)"
    },
    actions: {
      start:   "Start",
      stop:    "Stop",
      trigger: "Trigger now",
      delay:   "Set delay (s)"
    }
  },

  "Programmable Block (anderer)": {
    conditions: {
      running: "Currently running",
      isOn:    "Is enabled"
    },
    actions: {
      run: "Run with argument",
      on:  "Turn on",
      off: "Turn off"
    }
  },

  "Button-Panel": {
    conditions: {
      isOn:   "Is enabled",
      anyOne: "At least 1 button has an action"
    },
    actions: {
      press: "Press button X (1-N)"
    }
  },

  "LCD / Text-Panel": {
    conditions: {
      isOn:       "Is enabled",
      fontSizeGT: "Font size > X"
    },
    actions: {
      write:       "Write text",
      append:      "Append text",
      clear:       "Clear content",
      fontSize:    "Set font size",
      fontColor:   "Font color (R,G,B)",
      bgColor:     "Background color (R,G,B)",
      alignLeft:   "Align: left",
      alignCenter: "Align: center",
      alignRight:  "Align: right",
      modeText:    "Mode: text + image",
      modeScript:  "Mode: script",
      modeNone:    "Mode: off",
      on:          "Turn on",
      off:         "Turn off"
    }
  },

  "Lichter / Spotlight": {
    conditions: {
      on:          "Is on",
      intensityGT: "Intensity > X",
      radiusGT:    "Radius > X (m)",
      blinkGT:     "Blink interval > X (s)"
    },
    actions: {
      on:          "Turn on",
      off:         "Turn off",
      toggle:      "Toggle",
      color:       "Set color (R,G,B)",
      intensity:   "Set intensity",
      radiusSet:   "Set radius (m)",
      blinkOn:     "Set blink interval (s)",
      blinkLen:    "Set blink length (%)",
      blinkOffset: "Set blink offset (%)",
      falloff:     "Set falloff"
    }
  },

  "Soundblock / Lautsprecher": {
    conditions: {
      isOn:   "Is enabled",
      volGT:  "Volume > X",
      loopGT: "Loop > X (s)"
    },
    actions: {
      play:     "Play sound",
      stop:     "Stop sound",
      vol:      "Set volume",
      loopSet:  "Loop duration (s)",
      rangeSet: "Audible range (m)",
      soundSel: "Select sound"
    }
  },

  "Medi-Raum (Medical Room)": {
    conditions: {
      isOn:      "Is enabled",
      isWorking: "Working"
    },
    actions: {
      on:  "Turn on",
      off: "Turn off"
    }
  },

  "Kryo-Kammer": {
    conditions: {
      occupied: "Occupied",
      isOn:     "Is enabled"
    },
    actions: {
      on:  "Turn on",
      off: "Turn off"
    }
  },

  "Custom (selbst eintragen)": {
    conditions: {
      customCond: "Custom condition (C# expression)"
    },
    actions: {
      applyAction: "Call ApplyAction(...)",
      setBool:     "SetValueBool(...)",
      setFloat:    "SetValueFloat(...)",
      rawCode:     "Raw C# code (use {v})",
      on:          "Turn on (FunctionalBlock)",
      off:         "Turn off (FunctionalBlock)"
    }
  }
};

// _inv-Spread anwenden: Inventar-Items kommen in jeden Block, der sie verwendet.
// Aus catalog.js wissen wir, dass _invConds in folgende Blöcke gespreaded wird:
// Connector, Reaktor, Sortierer, Cargo, Refinery, Assembler, Gas-Generator, Drill, Grinder.
// Die _inv-Labels sind bereits in den Block-spezifischen Einträgen oben drin —
// das hier dient nur als Dokumentation / Fallback.
