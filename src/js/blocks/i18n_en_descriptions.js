// ============================================================
// I18N für Tooltip-Texte (v1.8.0) — Englisch
// ============================================================
// Spiegelt DESCRIPTIONS in englischer Sprache. getDescription() in
// descriptions.js liest hier nach wenn aktive Sprache = "en".

const DESCRIPTIONS_EN = {

  // ---------- MOVEMENT ----------

  "Tür (Door)": {
    conditions: {
      open:        "True when the door is fully open.",
      closed:      "True when the door is fully closed.",
      opening:     "True while the door is opening.",
      closing:     "True while the door is closing.",
      enabledTrue: "Checks whether the door is functionally enabled. A disabled door can neither open nor close.",
      isWorking:   "True when the door has power and is undamaged.",
      openRatioGT: "Compares the open ratio in percent (0 % = closed, 100 % = fully open)."
    },
    actions: {
      open:      "Opens the door.",
      close:     "Closes the door.",
      toggle:    "If open → close, if closed → open.",
      on:        "Enable functional state — only then does the door accept commands.",
      off:       "Disable functional state (door effectively locks).",
      setCustom: "Sets the door's CustomData content."
    }
  },

  "Hangartor (Hangar Door)": {
    conditions: {
      fullyOpen:   "Hangar door is fully open.",
      fullyClosed: "Hangar door is fully closed.",
      moving:      "Hangar door is currently moving.",
      enabledTrue: "Checks whether the door is functionally enabled.",
      openRatioGT: "Open ratio in percent.",
      isWorking:   "True when the door has power and is undamaged."
    },
    actions: {
      open:   "Opens the hangar door.",
      close:  "Closes the hangar door.",
      toggle: "If open → close, else → open.",
      on:     "Enable.",
      off:    "Disable."
    }
  },

  "Kolben (Piston)": {
    conditions: {
      extending:   "True when current velocity is positive (extending).",
      retracting:  "True when current velocity is negative (retracting).",
      atTop:       "True when the current length has reached the max limit.",
      atBottom:    "True when the current length is reduced to the min limit.",
      posGreater:  "Compares current length in meters with your value.",
      posLess:     "Compares current length in meters with your value.",
      enabledTrue: "Checks whether the piston is enabled.",
      isWorking:   "True when the piston has power and is undamaged.",
      minLimitGT:  "Compares the currently configured min limit.",
      maxLimitLT:  "Compares the currently configured max limit.",
      velocityGT:  "Compares current velocity in m/s.",
      isAttached:  "True when the top part is attached."
    },
    actions: {
      extend:      "Moves the piston outward at standard velocity.",
      retract:     "Moves the piston inward at standard velocity.",
      reverse:     "Reverses the current direction of motion.",
      setSpeed:    "Sets the velocity directly. Positive = extend, negative = retract.",
      setMax:      "Maximum extension in meters.",
      setMin:      "Minimum extension in meters.",
      on:          "Turn on.",
      off:         "Turn off.",
      extendOnce:  "Convenience: sets MaxLimit to 10 m and extends.",
      retractOnce: "Convenience: sets MinLimit to 0 and retracts.",
      attach:      "Attempts to attach a new top part.",
      detach:      "Detaches the currently connected top part.",
      setCustom:   "Sets the CustomData content."
    }
  },

  "Rotor (Advanced/Stator)": {
    conditions: {
      rotating:     "True when target RPM is non-zero.",
      angleGT:      "Compares the current angle in degrees.",
      angleLT:      "Compares the current angle in degrees.",
      enabledTrue:  "Checks whether the rotor is enabled.",
      isWorking:    "True when the rotor has power and is undamaged.",
      isLocked:     "True when the rotor is locked at its current position.",
      isAttached:   "True when the top part is attached and connected.",
      rpmGT:        "Compares target RPM.",
      rpmLT:        "Compares target RPM.",
      torqueGT:     "Compares configured torque.",
      lowerLimitGT: "Compares the lower angle limit in degrees.",
      upperLimitLT: "Compares the upper angle limit in degrees.",
      displaceGT:   "Compares configured displacement in meters."
    },
    actions: {
      setRpm:       "Target RPM. Positive and negative control rotation direction.",
      stop:         "Sets target RPM to 0.",
      lock:         "Locks the rotor at its current position.",
      unlock:       "Releases the lock.",
      reverse:      "Reverses current rotation direction.",
      on:           "Turn rotor on.",
      off:          "Turn rotor off.",
      setLower:     "Lower angle limit in degrees (-361 = unlimited).",
      setUpper:     "Upper angle limit in degrees (361 = unlimited).",
      setTorque:    "Maximum torque the rotor applies.",
      setBrakeTorq: "Braking torque when stopping.",
      setDisplace:  "Vertical displacement of the top part (-0.11 to 0.11 m).",
      attach:       "Attempts to attach a new top part.",
      detach:       "Detaches the currently connected top part.",
      setCustom:    "Sets the CustomData content."
    }
  },

  "Verbinder (Connector)": {
    conditions: {
      connected:   "True when this connector is currently coupled with another.",
      ready:       "True when another connector is nearby and aligned.",
      unconnected: "True when neither connected nor ready to dock.",
      enabledTrue: "Checks whether the connector is enabled.",
      throwOnTrue: "True when the connector is in Throw-Out (ejector) mode."
    },
    actions: {
      connect:    "Attempts to connect (only works when 'ready').",
      disconnect: "Disconnects the current connection.",
      toggle:     "Toggles between connect and disconnect.",
      on:         "Turn connector on.",
      off:        "Turn connector off.",
      throwOn:    "Throw-Out mode on — items are ejected instead of connected.",
      throwOff:   "Throw-Out mode off."
    }
  },

  "Merge-Block": {
    conditions: {
      connected:   "True when this merge block has merged with another.",
      enabledTrue: "Checks whether the merge block is active.",
      isWorking:   "True when the block has power and is undamaged."
    },
    actions: {
      on:     "Turn on.",
      off:    "Turn off — separation happens immediately.",
      toggle: "Toggle."
    }
  },

  "Magnet-Plate / Landing-Gear": {
    conditions: {
      locked:     "True when the landing gear is locked onto a surface.",
      ready:      "True when a lockable surface is within range.",
      unlockedSt: "True when currently unlocked (gripping nothing).",
      autoLockOn: "True when Auto-Lock is enabled."
    },
    actions: {
      lock:     "Attempts to lock (only works when 'ready').",
      unlock:   "Releases the lock.",
      toggle:   "Toggles between lock and unlock.",
      autoOn:   "Auto-Lock: locks automatically as soon as a surface is reachable.",
      autoOff:  "Disables auto-locking."
    }
  },

  // ---------- ENERGY ----------

  "Akku (Battery)": {
    conditions: {
      chargeGT:  "Compares current charge in percent.",
      chargeLT:  "Compares current charge in percent.",
      charging:  "True when the battery is currently taking in more power than it outputs.",
      isOn:      "Checks whether the battery is enabled.",
      isWorking: "True when the battery is delivering power and is undamaged.",
      outputGT:  "Compares current power output in megawatts.",
      inputGT:   "Compares current power input in megawatts.",
      modeAuto:  "True when the battery is in Auto mode.",
      modeRech:  "True when the battery is in Recharge mode.",
      modeDisch: "True when the battery is in Discharge mode."
    },
    actions: {
      auto:      "Mode Auto: charges or discharges depending on grid demand.",
      recharge:  "Mode Recharge: only charges, gives no power.",
      discharge: "Mode Discharge: gives power, does not charge.",
      on:        "Turn battery on.",
      off:       "Turn battery off."
    }
  },

  "Reaktor": {
    conditions: {
      outputGT:  "Compares current power output in megawatts.",
      isOn:      "Checks whether the reactor is enabled.",
      isWorking: "True when the reactor is running and has fuel.",
      maxOutGT:  "Compares the maximum possible output."
    },
    actions: {
      on:  "Turn reactor on.",
      off: "Turn reactor off."
    }
  },

  "Solarpanel": {
    conditions: {
      outputGT: "Compares current power output in kW.",
      outputLT: "Compares current power output in kW.",
      maxOutGT: "Compares the maximum possible output in full sunlight.",
      isOn:     "Checks whether the panel is enabled."
    },
    actions: {
      on:  "Turn on.",
      off: "Turn off."
    }
  },

  "Windturbine": {
    conditions: {
      outputGT: "Compares current power output in kW.",
      outputLT: "Compares current power output in kW.",
      isOn:     "Checks whether the turbine is enabled."
    },
    actions: {
      on:  "Turn on.",
      off: "Turn off."
    }
  },

  "H2-Motor (Hydrogen Engine)": {
    conditions: {
      outputGT:  "Compares current power output in kW.",
      isOn:      "Checks whether the engine is running.",
      isWorking: "True when the engine runs and has hydrogen."
    },
    actions: {
      on:  "Turn engine on.",
      off: "Turn engine off."
    }
  },

  // ---------- INVENTORY & TRANSPORT ----------

  "Sortierer (Sorter)": {
    conditions: {
      drainAll:  "Drain-All pulls items from adjacent inventories into the sorter.",
      isOn:      "Checks whether the sorter is enabled.",
      isWorking: "True when the sorter has power."
    },
    actions: {
      drainOn:  "Activates Drain-All.",
      drainOff: "Deactivates Drain-All.",
      on:       "Turn sorter on.",
      off:      "Turn sorter off."
    }
  },

  "Frachtcontainer (Cargo)": {
    conditions: {
      fillGT:    "Compares the volume fill level in percent.",
      fillLT:    "Compares the volume fill level in percent.",
      empty:     "True when the inventory is empty.",
      massGT:    "Compares current inventory mass in kilograms.",
      itemCntGT: "Compares the number of item stacks in the inventory."
    },
    actions: {
      setCustom: "Sets the container's CustomData content."
    }
  },

  // ---------- PRODUCTION ----------

  "Refinery / Schmelze": {
    conditions: {
      producing:   "True when ore is currently being processed.",
      queueEmpty:  "True when there is nothing in the queue.",
      useConveyor: "True when the refinery pulls/pushes ore via the conveyor system.",
      isOn:        "Checks whether the refinery is enabled.",
      isWorking:   "True when the refinery has power and is undamaged."
    },
    actions: {
      convOn:  "Activate conveyor connection.",
      convOff: "Deactivate conveyor connection.",
      on:      "Turn on.",
      off:     "Turn off.",
      clearQ:  "Clears the entire queue."
    }
  },

  "Assembler": {
    conditions: {
      producing:       "True when the assembler is currently working.",
      queueEmpty:      "True when the queue is empty.",
      isDisassembling: "True when in disassembly mode.",
      isAssembling:    "True when in assembly mode.",
      coopOn:          "True when cooperative mode is active.",
      repeatOn:        "True when repeating is active.",
      isOn:            "Checks whether the assembler is enabled."
    },
    actions: {
      assemble:    "Assembly mode (produces components).",
      disassemble: "Disassembly mode (breaks components back into resources).",
      cooperative: "Toggle cooperative mode — multiple assemblers share a queue.",
      repeatOn:    "Repeating on — queue is continuously re-added.",
      repeatOff:   "Repeating off.",
      on:          "Turn on.",
      off:         "Turn off.",
      clearQ:      "Clears the entire queue."
    }
  },

  "Gas-Generator (O2/H2)": {
    conditions: {
      producing: "True when the generator can currently produce and Auto-Refill is on.",
      isOn:      "Checks whether the generator is enabled.",
      refillOn:  "True when Auto-Refill is active.",
      canProd:   "True when production is possible at all (ice present, power available)."
    },
    actions: {
      on:        "Turn generator on.",
      off:       "Turn generator off.",
      refillOn:  "Auto-Refill on — tanks/bottles are filled automatically.",
      refillOff: "Auto-Refill off."
    }
  },

  "Tank / Gas-Tank": {
    conditions: {
      fillGT:    "Compares fill level in percent.",
      fillLT:    "Compares fill level in percent.",
      stockpile: "Stockpile mode: tank fills but gives no gas to the grid.",
      isOn:      "Checks whether the tank is enabled.",
      capGT:     "Compares tank capacity in liters."
    },
    actions: {
      stockOn:  "Activate stockpile.",
      stockOff: "Deactivate stockpile — tank now feeds gas to the grid.",
      on:       "Turn tank on.",
      off:      "Turn tank off."
    }
  },

  "Air Vent": {
    conditions: {
      pressurized:    "Room is at ~100 % O₂.",
      depressurized:  "Room is depressurized.",
      pressuring:     "Pressure is being built up.",
      depressuring:   "Pressure is being released.",
      pressureGT:     "Compares O₂ level in percent.",
      pressureLT:     "Compares O₂ level in percent.",
      canPressurize:  "True when the room can be sealed (otherwise the vent draws into vacuum).",
      depressureMode: "True when the vent is in depressurize mode (draws oxygen out)."
    },
    actions: {
      pressOn:  "Build pressure / pump oxygen into the room.",
      pressOff: "Release pressure — vent draws oxygen out of the room.",
      on:       "Turn vent on.",
      off:      "Turn vent off."
    }
  },

  // ---------- PROPULSION ----------

  "Thruster (Triebwerk)": {
    conditions: {
      thrustGT:    "Compares current thrust in kilonewtons.",
      override:    "True when a manual thrust override is active.",
      isOn:        "Checks whether the thruster is enabled.",
      maxThrustGT: "Compares maximum possible thrust.",
      maxEffGT:    "Compares effective max thrust (atmospheric-limited).",
      overrideGT:  "Compares override value in percent."
    },
    actions: {
      override:    "Set override percent (0–100). 0 disables the override.",
      overrideOff: "Override off — thruster goes back to normal ship control.",
      on:          "Turn on.",
      off:         "Turn off."
    }
  },

  "Gyroskop": {
    conditions: {
      override: "True when the gyro is being manually overridden.",
      isOn:     "Checks whether the gyro is enabled.",
      powerGT:  "Compares the power level in percent."
    },
    actions: {
      overrideOn:  "Enable manual control — Yaw/Pitch/Roll take effect.",
      overrideOff: "Disable manual control.",
      yaw:         "Yaw (rotation around vertical axis) in radians per second.",
      pitch:       "Pitch (nose up/down) in radians per second.",
      roll:        "Roll (rolling) in radians per second.",
      power:       "Gyro strength in percent (0–100).",
      on:          "Turn on.",
      off:         "Turn off."
    }
  },

  "Fallschirm": {
    conditions: {
      deployed:   "True when the parachute is deployed.",
      autoDeploy: "True when Auto-Deploy is active.",
      deployHGT:  "Compares the configured Auto-Deploy altitude."
    },
    actions: {
      open:    "Deploys the parachute.",
      close:   "Packs the parachute back (only possible on the ground).",
      autoOn:  "Enable Auto-Deploy.",
      autoOff: "Disable Auto-Deploy.",
      deployH: "Altitude in meters at which Auto-Deploy triggers."
    }
  },

  "Jump Drive": {
    conditions: {
      ready:      "Ready for a jump.",
      charging:   "Currently charging.",
      chargeGT:   "Compares charge in percent.",
      jumpDistGT: "Compares the currently configured jump distance in km.",
      isOn:       "Checks whether the jump drive is enabled."
    },
    actions: {
      jump:      "Triggers the jump (target must be set).",
      jumpAbort: "Aborts a running jump.",
      on:        "Turn on.",
      off:       "Turn off."
    }
  },

  // ---------- TOOLS ----------

  "Bohrer (Drill)": {
    conditions: {
      isOn:      "Checks whether the drill is enabled.",
      isWorking: "True when the drill has power and is undamaged."
    },
    actions: {
      on:     "Turn drill on.",
      off:    "Turn drill off.",
      toggle: "Toggle drill."
    }
  },

  "Schweißer (Welder)": {
    conditions: {
      isOn:       "Checks whether the welder is enabled.",
      isWorking:  "True when the welder has power.",
      helpOthers: "True when the welder also helps foreign players."
    },
    actions: {
      on:      "Turn welder on.",
      off:     "Turn welder off.",
      toggle:  "Toggle welder.",
      helpOn:  "Help-Others on — also welds foreign ships/players.",
      helpOff: "Help-Others off — only welds own/friendly."
    }
  },

  "Schleifer (Grinder)": {
    conditions: {
      isOn:       "Checks whether the grinder is enabled.",
      isWorking:  "True when the grinder has power.",
      helpOthers: "True when the grinder also helps foreign players."
    },
    actions: {
      on:      "Turn grinder on.",
      off:     "Turn grinder off.",
      toggle:  "Toggle grinder.",
      helpOn:  "Help-Others on.",
      helpOff: "Help-Others off."
    }
  },

  "Projektor": {
    conditions: {
      projecting: "True when the projector is showing a blueprint.",
      remainGT:   "Compares the number of remaining blocks to build.",
      remainLT:   "Compares the number of remaining blocks to build.",
      buildable:  "Compares the count of directly buildable blocks (freely accessible).",
      totalGT:    "Compares the total block count of the blueprint.",
      isOn:       "Checks whether the projector is enabled."
    },
    actions: {
      on:  "Turn on.",
      off: "Turn off."
    }
  },

  // ---------- WEAPONS ----------

  "Waffe (Turret/Gun)": {
    conditions: {
      shooting: "True when the weapon is currently shooting.",
      isOn:     "Checks whether the weapon is enabled."
    },
    actions: {
      shootOn:   "Enable continuous fire.",
      shootOff:  "Cease fire.",
      shootOnce: "Single shot.",
      on:        "Turn on.",
      off:       "Turn off."
    }
  },

  "Geschützturm (Gatling)": {
    conditions: {
      shooting:     "True when the turret is firing.",
      hasTarget:    "True when the turret has acquired a target.",
      isOn:         "Checks whether the turret is active.",
      isWorking:    "True when the turret has power.",
      rangeGT:      "Compares the configured range.",
      underControl: "True when the turret is currently being operated by a player."
    },
    actions: {
      on:          "Turn on.",
      off:         "Turn off.",
      shootOn:     "Continuous fire.",
      shootOff:    "Cease fire.",
      rangeSet:    "Maximum tracking range in meters.",
      resetTarget: "Resets the target lock."
    }
  },

  "Raketenturm": {
    conditions: {
      shooting:  "True when the turret is firing.",
      hasTarget: "True when the turret has a target.",
      isOn:      "Checks whether the turret is active.",
      rangeGT:   "Compares the configured range."
    },
    actions: {
      on:       "Turn on.",
      off:      "Turn off.",
      shootOn:  "Continuous fire.",
      shootOff: "Cease fire.",
      rangeSet: "Range in meters."
    }
  },

  "Innenraum-Geschütz": {
    conditions: {
      shooting:  "True when the interior turret is firing.",
      hasTarget: "True when a target is acquired.",
      isOn:      "Checks whether active."
    },
    actions: {
      on:  "Turn on.",
      off: "Turn off."
    }
  },

  "Gatling-Gun (fest)": {
    conditions: {
      shooting: "True when the gatling is firing.",
      isOn:     "Checks whether enabled."
    },
    actions: {
      shootOn:  "Continuous fire.",
      shootOff: "Cease fire.",
      on:       "Turn on.",
      off:      "Turn off."
    }
  },

  "Raketenwerfer (fest)": {
    conditions: {
      shooting: "True when the launcher is firing.",
      isOn:     "Checks whether enabled."
    },
    actions: {
      shootOn:   "Continuous fire.",
      shootOff:  "Cease fire.",
      shootOnce: "Single missile.",
      on:        "Turn on.",
      off:       "Turn off."
    }
  },

  "Warhead (Sprengkopf)": {
    conditions: {
      armed:     "True when the warhead is armed.",
      counting:  "True when the countdown to detonation is running.",
      detTimeGT: "Compares the remaining countdown time."
    },
    actions: {
      arm:      "Arm — prerequisite for Detonate.",
      disarm:   "Disarm.",
      start:    "Start countdown.",
      stop:     "Stop countdown.",
      setDelay: "Detonation delay in seconds.",
      detonate: "Immediate detonation. WARNING: only when 'armed'."
    }
  },

  "Decoy / Köder": {
    conditions: {
      isOn: "Checks whether the decoy is active (attracts hostile turrets)."
    },
    actions: {
      on:     "Turn on.",
      off:    "Turn off.",
      toggle: "Toggle."
    }
  },

  // ---------- SENSORS ----------

  "Sensor": {
    conditions: {
      isActive:     "True when the sensor detects something in its area.",
      lastDetected: "True when the last detected entity is a player character.",
      enabled:      "Checks whether the sensor block is enabled.",
      playPresent:  "True when player detection is active.",
      frontGT:      "Compares the forward range.",
      backGT:       "Compares the backward range."
    },
    actions: {
      on:        "Turn on.",
      off:       "Turn off.",
      toggle:    "Toggle.",
      frontSet:  "Front range (max 50 m).",
      backSet:   "Back range (max 50 m).",
      leftSet:   "Left range (max 50 m).",
      rightSet:  "Right range (max 50 m).",
      topSet:    "Top range (max 50 m).",
      bottomSet: "Bottom range (max 50 m).",
      playOn:    "Player detection on.",
      playOff:   "Player detection off.",
      enemyOn:   "Enemy detection on.",
      enemyOff:  "Enemy detection off.",
      friendOn:  "Friend detection on.",
      friendOff: "Friend detection off."
    }
  },

  "Kamera": {
    conditions: {
      isActive:  "True when the camera is being operated by the player.",
      canScan:   "Checks whether the camera can scan at the given range.",
      raycastOn: "True when raycast is active.",
      rangeGT:   "Compares the available raycast range."
    },
    actions: {
      raycastOn:  "Enable raycast — required for distance detection.",
      raycastOff: "Disable raycast.",
      on:         "Turn camera on.",
      off:        "Turn camera off."
    }
  },

  "Funkantenne": {
    conditions: {
      broadcasting: "True when the antenna is actively broadcasting.",
      rangeGT:      "Compares the range in meters.",
      isOn:         "Checks whether the antenna is enabled."
    },
    actions: {
      bcOn:     "Enable broadcasting.",
      bcOff:    "Disable broadcasting — ship remains anonymous.",
      setRange: "Range in meters (max 50 km).",
      hudOn:    "Show ship name on HUD.",
      hudOff:   "Hide ship name on HUD.",
      on:       "Turn antenna on.",
      off:      "Turn antenna off."
    }
  },

  "Laser-Antenne": {
    conditions: {
      connected: "True when the laser antenna is actively linked to a target.",
      isOn:      "Checks whether the antenna is enabled."
    },
    actions: {
      on:  "Turn on.",
      off: "Turn off."
    }
  },

  "Erz-Detektor": {
    conditions: {
      isOn:    "Checks whether the ore detector is actively scanning.",
      rangeGT: "Compares the scan range."
    },
    actions: {
      rangeSet: "Scan range in meters.",
      on:       "Turn on.",
      off:      "Turn off."
    }
  },

  "Beacon": {
    conditions: {
      isOn:    "Checks whether the beacon is visibly broadcasting.",
      rangeGT: "Compares the broadcast range in meters."
    },
    actions: {
      setRange: "Beacon range in meters.",
      on:       "Turn on.",
      off:      "Turn off.",
      setName:  "Custom name (shown on HUD).",
      setData:  "Set CustomData content."
    }
  },

  // ---------- CONTROL ----------

  "Cockpit / Sitz / Remote": {
    conditions: {
      occupied:         "True when someone is sitting in the cockpit.",
      dampeners:        "True when inertia dampers are active.",
      speedGT:          "Compares current ship speed in m/s.",
      speedLT:          "Compares current ship speed in m/s.",
      inGravity:        "True when the ship is in natural gravity.",
      mainCock:         "True when this cockpit is marked as 'Main Cockpit'.",
      massGT:           "Compares physical ship mass in kg.",
      handbrakeOn:      "True when the handbrake is engaged.",
      controlWheels:    "True when the cockpit controls wheels.",
      controlThrusters: "True when the cockpit controls thrusters."
    },
    actions: {
      dampOn:        "Inertia dampers on.",
      dampOff:       "Inertia dampers off — ship coasts after thruster cut.",
      handbrake:     "Toggle handbrake.",
      handbrakeOn:   "Handbrake on.",
      handbrakeOff:  "Handbrake off.",
      ctlThrustOn:   "Controls thrusters on.",
      ctlThrustOff:  "Controls thrusters off (autopilot can take over)."
    }
  },

  "Remote Control": {
    conditions: {
      autoPilot:    "True when the autopilot is on.",
      speedGT:      "Compares current ship speed.",
      inGravity:    "True when in gravity.",
      speedLimitGT: "Compares the configured speed limit."
    },
    actions: {
      apOn:     "Autopilot on — ship flies through the waypoint list.",
      apOff:    "Autopilot off.",
      clearW:   "Clear waypoint list.",
      setSpeed: "Set the speed limit for autopilot.",
      dockMode: "Docking mode on (slower for precise maneuvers).",
      dockOff:  "Docking mode off."
    }
  },

  "Timer Block": {
    conditions: {
      running: "True when the timer is currently counting down.",
      delayGT: "Compares the configured delay."
    },
    actions: {
      start:   "Starts the countdown.",
      stop:    "Stops the countdown.",
      trigger: "Triggers the timer's actions immediately (no waiting).",
      delay:   "Countdown duration in seconds."
    }
  },

  "Programmable Block (anderer)": {
    conditions: {
      running: "True when the other PB's program is currently running.",
      isOn:    "Checks whether the PB is enabled."
    },
    actions: {
      run: "Calls the other PB with a string argument.",
      on:  "Turn on.",
      off: "Turn off."
    }
  },

  "Button-Panel": {
    conditions: {
      isOn:   "Checks whether the panel is active.",
      anyOne: "True when anyone is allowed to use the panel."
    },
    actions: {
      press: "Simulates pressing a button (1 to N)."
    }
  },

  // ---------- DISPLAY ----------

  "LCD / Text-Panel": {
    conditions: {
      isOn:       "Checks whether the LCD is enabled.",
      fontSizeGT: "Compares the font size."
    },
    actions: {
      write:       "Overwrites the LCD content.",
      append:      "Appends text to the existing LCD content.",
      clear:       "Clears the LCD content.",
      fontSize:    "Font size (e.g. 1.0 = default, 2.0 = double).",
      fontColor:   "Font color as R,G,B (0–255 per channel).",
      bgColor:     "Background color as R,G,B.",
      alignLeft:   "Align text left.",
      alignCenter: "Center text.",
      alignRight:  "Align text right.",
      modeText:    "Text+image mode (for plain text and simple images).",
      modeScript:  "Script mode (for sprite-API/programmable-block scripts).",
      modeNone:    "LCD content off.",
      on:          "Turn on.",
      off:         "Turn off."
    }
  },

  "Lichter / Spotlight": {
    conditions: {
      on:          "Checks whether the light is on.",
      intensityGT: "Compares the intensity.",
      radiusGT:    "Compares the light radius.",
      blinkGT:     "Compares the blink interval."
    },
    actions: {
      on:          "Turn on.",
      off:         "Turn off.",
      toggle:      "Toggle.",
      color:       "Color as R,G,B (0–255). Example: 255,80,20 = warm orange.",
      intensity:   "Brightness. Values typically 0–10.",
      radiusSet:   "Light radius in meters.",
      blinkOn:     "Blink interval in seconds. 0 = no blinking.",
      blinkLen:    "How long the light is on per interval (% of interval).",
      blinkOffset: "Phase offset of the blink (% of interval).",
      falloff:     "How sharply the light falls off. 1 = linear, higher = sharper."
    }
  },

  "Soundblock / Lautsprecher": {
    conditions: {
      isOn:   "Checks whether the sound block is enabled.",
      volGT:  "Compares the volume.",
      loopGT: "Compares the loop duration."
    },
    actions: {
      play:     "Plays the configured sound.",
      stop:     "Stops a running sound.",
      vol:      "Volume 0.0 (mute) to 1.0 (full).",
      loopSet:  "How many seconds to loop the sound.",
      rangeSet: "Audible range in meters.",
      soundSel: "Sound selection (internal name, e.g. \"SoundBlockAlert1\")."
    }
  },

  // ---------- COMFORT ----------

  "Medi-Raum (Medical Room)": {
    conditions: {
      isOn:     "Checks whether the medical room is actively healing.",
      isWorking: "True when the medical room has power and is undamaged."
    },
    actions: {
      on:  "Turn on.",
      off: "Turn off."
    }
  },

  "Kryo-Kammer": {
    conditions: {
      occupied: "True when someone is sitting in the cryo chamber.",
      isOn:     "Checks whether the chamber is active."
    },
    actions: {
      on:  "Turn on.",
      off: "Turn off."
    }
  },

  // ---------- CUSTOM ----------

  "Custom (selbst eintragen)": {
    conditions: {
      customCond: "Write a raw C# boolean expression here. Use 'v' as placeholder for the block."
    },
    actions: {
      applyAction: "Calls a terminal action registered in-game.",
      setBool:     "Sets a boolean property.",
      setFloat:    "Sets a numeric value.",
      rawCode:     "Raw C# code. {v} is replaced by the block variable name.",
      on:          "Turn the block on (cast to IMyFunctionalBlock).",
      off:         "Turn the block off."
    }
  }
};

const _COMMON_DESCRIPTIONS_EN = {
  conditions: {
    hasItem:      "Checks whether the block's inventory contains an item with the given subtype ID. Subtype IDs are e.g. \"Iron\", \"Stone\", \"Ice\", \"Uranium\", \"SteelPlate\", \"Construction\". Searches ALL inventory slots of the block.",
    itemAmountGT: "Checks whether more than X items of a subtype are in the inventory. Syntax: \"Subtype:Amount\", e.g. \"Iron:100\" for >100 iron.",
    itemAmountLT: "Checks whether fewer than X items of a subtype are in the inventory. Syntax: \"Subtype:Amount\", e.g. \"Uranium:1\" for low fuel.",
    fillGT:       "Compares the block inventory's volume fill in percent."
  }
};
