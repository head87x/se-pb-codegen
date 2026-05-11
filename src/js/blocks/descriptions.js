// ============================================================
// BLOCK / OPTION DESCRIPTIONS (Tooltip-Texte)
// ============================================================
// Struktur:
//   DESCRIPTIONS[blockType] = {
//     conditions: { <optionId>: "Erklärtext", ... },
//     actions:    { <optionId>: "Erklärtext", ... }
//   }

const DESCRIPTIONS = {

  // ---------- BEWEGUNG ----------

  "Tür (Door)": {
    conditions: {
      open:        "True, wenn die Tür vollständig offen ist.",
      closed:      "True, wenn die Tür vollständig geschlossen ist.",
      opening:     "True während des Öffnungs-Vorgangs.",
      closing:     "True während des Schließ-Vorgangs.",
      enabledTrue: "Prüft, ob die Tür funktional aktiviert ist. Eine deaktivierte Tür lässt sich weder öffnen noch schließen.",
      isWorking:   "True, wenn die Tür Strom hat und nicht beschädigt ist.",
      openRatioGT: "Vergleicht den Öffnungs-Anteil in Prozent (0 % = zu, 100 % = ganz auf)."
    },
    actions: {
      open:      "Öffnet die Tür.",
      close:     "Schließt die Tür.",
      toggle:    "Wenn offen → schließen, wenn geschlossen → öffnen.",
      on:        "Funktion aktivieren — erst dann nimmt die Tür Befehle an.",
      off:       "Funktion deaktivieren (Tür verriegelt sich quasi).",
      setCustom: "Setzt den CustomData-Inhalt der Tür."
    }
  },

  "Hangartor (Hangar Door)": {
    conditions: {
      fullyOpen:   "Hangartor ist komplett offen.",
      fullyClosed: "Hangartor ist komplett geschlossen.",
      moving:      "Hangartor ist gerade in Bewegung.",
      enabledTrue: "Prüft, ob das Tor funktional aktiviert ist.",
      openRatioGT: "Öffnungs-Anteil in Prozent.",
      isWorking:   "True, wenn das Tor Strom hat und nicht beschädigt ist."
    },
    actions: {
      open:   "Öffnet das Hangartor.",
      close:  "Schließt das Hangartor.",
      toggle: "Wenn offen → schließen, sonst → öffnen.",
      on:     "Funktion aktivieren.",
      off:    "Funktion deaktivieren."
    }
  },

  "Kolben (Piston)": {
    conditions: {
      extending:   "True, wenn die aktuelle Geschwindigkeit positiv ist (fährt aus).",
      retracting:  "True, wenn die aktuelle Geschwindigkeit negativ ist (fährt ein).",
      atTop:       "True, wenn die aktuelle Länge bei der Max-Länge angekommen ist.",
      atBottom:    "True, wenn die aktuelle Länge auf Min-Limit reduziert ist.",
      posGreater:  "Vergleicht die aktuelle Länge in Metern mit deinem Wert.",
      posLess:     "Vergleicht die aktuelle Länge in Metern mit deinem Wert.",
      enabledTrue: "Prüft, ob der Kolben eingeschaltet ist.",
      isWorking:   "True, wenn der Kolben Strom hat und nicht beschädigt ist.",
      minLimitGT:  "Vergleicht das aktuell eingestellte Min-Limit.",
      maxLimitLT:  "Vergleicht das aktuell eingestellte Max-Limit.",
      velocityGT:  "Vergleicht die aktuelle Geschwindigkeit in m/s.",
      isAttached:  "True, wenn der Top-Part angebracht ist."
    },
    actions: {
      extend:      "Bewegt den Kolben nach oben/außen mit Standard-Geschwindigkeit.",
      retract:     "Bewegt den Kolben nach unten/innen mit Standard-Geschwindigkeit.",
      reverse:     "Kehrt die aktuelle Bewegungsrichtung um.",
      setSpeed:    "Setzt die Geschwindigkeit direkt. Positiv = aus, negativ = ein.",
      setMax:      "Maximale Auslenkung in Metern.",
      setMin:      "Minimale Auslenkung in Metern.",
      on:          "Einschalten.",
      off:         "Ausschalten.",
      extendOnce:  "Komfort: setzt MaxLimit auf 10 m und fährt aus.",
      retractOnce: "Komfort: setzt MinLimit auf 0 und fährt ein.",
      attach:      "Versucht, einen neuen Top-Part anzubringen.",
      detach:      "Löst den aktuell verbundenen Top-Part.",
      setCustom:   "Setzt den CustomData-Inhalt."
    }
  },

  "Rotor (Advanced/Stator)": {
    conditions: {
      rotating:     "True, wenn die Soll-Drehzahl ungleich null ist.",
      angleGT:      "Vergleicht den aktuellen Winkel in Grad.",
      angleLT:      "Vergleicht den aktuellen Winkel in Grad.",
      enabledTrue:  "Prüft, ob der Rotor eingeschaltet ist.",
      isWorking:    "True, wenn der Rotor Strom hat und nicht beschädigt ist.",
      isLocked:     "True, wenn der Rotor in seiner aktuellen Position gesperrt ist.",
      isAttached:   "True, wenn der Top-Part angebracht und verbunden ist.",
      rpmGT:        "Vergleicht die Soll-Drehzahl in RPM.",
      rpmLT:        "Vergleicht die Soll-Drehzahl in RPM.",
      torqueGT:     "Vergleicht das eingestellte Drehmoment.",
      lowerLimitGT: "Vergleicht das untere Winkellimit in Grad.",
      upperLimitLT: "Vergleicht das obere Winkellimit in Grad.",
      displaceGT:   "Vergleicht den eingestellten Versatz (Displacement) in Metern."
    },
    actions: {
      setRpm:       "Soll-Drehzahl. Positiv und negativ steuern die Drehrichtung.",
      stop:         "Setzt die Soll-Drehzahl auf 0.",
      lock:         "Sperrt den Rotor in der aktuellen Position.",
      unlock:       "Hebt die Sperre auf.",
      reverse:      "Kehrt die aktuelle Drehrichtung um.",
      on:           "Rotor einschalten.",
      off:          "Rotor ausschalten.",
      setLower:     "Unteres Winkellimit in Grad (-361 = unbegrenzt).",
      setUpper:     "Oberes Winkellimit in Grad (361 = unbegrenzt).",
      setTorque:    "Maximales Drehmoment, das der Rotor aufbringt.",
      setBrakeTorq: "Bremsmoment beim Anhalten.",
      setDisplace:  "Vertikaler Versatz des Top-Parts (-0.11 bis 0.11 m).",
      attach:       "Versucht, einen neuen Top-Part anzubringen.",
      detach:       "Löst den aktuell verbundenen Top-Part.",
      setCustom:    "Setzt den CustomData-Inhalt."
    }
  },

  "Verbinder (Connector)": {
    conditions: {
      connected:   "True, wenn dieser Connector aktuell mit einem anderen gekoppelt ist.",
      ready:       "True, wenn ein anderer Connector nahe und ausgerichtet ist.",
      unconnected: "True, wenn weder verbunden noch andockbereit.",
      enabledTrue: "Prüft, ob der Connector eingeschaltet ist.",
      throwOnTrue: "True, wenn der Connector im Throw-Out-Modus (Ejector) ist."
    },
    actions: {
      connect:    "Versucht zu verbinden (wirkt nur, wenn 'ready').",
      disconnect: "Trennt die aktuelle Verbindung.",
      toggle:     "Wechselt zwischen Verbinden und Trennen.",
      on:         "Connector einschalten.",
      off:        "Connector ausschalten.",
      throwOn:    "Throw-Out-Modus an — Items werden geworfen statt verbunden.",
      throwOff:   "Throw-Out-Modus aus."
    }
  },

  "Merge-Block": {
    conditions: {
      connected:   "True, wenn dieser Merge-Block mit einem anderen verschmolzen ist.",
      enabledTrue: "Prüft, ob der Merge-Block aktiv ist.",
      isWorking:   "True, wenn der Block Strom hat und nicht beschädigt ist."
    },
    actions: {
      on:     "Einschalten.",
      off:    "Ausschalten — Trennung erfolgt sofort.",
      toggle: "Umschalten."
    }
  },

  "Magnet-Plate / Landing-Gear": {
    conditions: {
      locked:     "True, wenn das Landing-Gear an einer Oberfläche gesperrt ist.",
      ready:      "True, wenn eine sperrbare Oberfläche in Reichweite ist.",
      unlockedSt: "True, wenn aktuell entsperrt (nichts gegriffen).",
      autoLockOn: "True, wenn Auto-Lock aktiviert ist."
    },
    actions: {
      lock:     "Versucht zu sperren (wirkt nur, wenn 'ready').",
      unlock:   "Hebt die Sperre auf.",
      toggle:   "Wechselt zwischen Lock und Unlock.",
      autoOn:   "Auto-Lock: sperrt automatisch, sobald eine Fläche erreichbar ist.",
      autoOff:  "Deaktiviert das automatische Sperren."
    }
  },

  // ---------- ENERGIE ----------

  "Akku (Battery)": {
    conditions: {
      chargeGT:  "Vergleicht die aktuelle Ladung in Prozent.",
      chargeLT:  "Vergleicht die aktuelle Ladung in Prozent.",
      charging:  "True, wenn der Akku gerade mehr Strom aufnimmt als abgibt.",
      isOn:      "Prüft, ob der Akku eingeschaltet ist.",
      isWorking: "True, wenn der Akku Strom liefert und nicht beschädigt ist.",
      outputGT:  "Vergleicht die aktuelle Strom-Abgabe in Megawatt.",
      inputGT:   "Vergleicht die aktuelle Strom-Aufnahme in Megawatt.",
      modeAuto:  "True, wenn der Akku im Auto-Modus ist.",
      modeRech:  "True, wenn der Akku im Recharge-Modus ist.",
      modeDisch: "True, wenn der Akku im Discharge-Modus ist."
    },
    actions: {
      auto:      "Modus Auto: lädt oder entlädt je nach Bedarf am Stromnetz.",
      recharge:  "Modus Recharge: lädt nur, gibt keinen Strom ab.",
      discharge: "Modus Discharge: gibt Strom ab, lädt nicht.",
      on:        "Akku einschalten.",
      off:       "Akku ausschalten."
    }
  },

  "Reaktor": {
    conditions: {
      outputGT:  "Vergleicht die aktuelle Stromabgabe in Megawatt.",
      isOn:      "Prüft, ob der Reaktor eingeschaltet ist.",
      isWorking: "True, wenn der Reaktor läuft und Brennstoff hat.",
      maxOutGT:  "Vergleicht die maximal mögliche Abgabe."
    },
    actions: {
      on:  "Reaktor einschalten.",
      off: "Reaktor ausschalten."
    }
  },

  "Solarpanel": {
    conditions: {
      outputGT: "Vergleicht die aktuelle Stromabgabe in kW.",
      outputLT: "Vergleicht die aktuelle Stromabgabe in kW.",
      maxOutGT: "Vergleicht den maximal möglichen Output bei voller Sonne.",
      isOn:     "Prüft, ob das Panel eingeschaltet ist."
    },
    actions: {
      on:  "Einschalten.",
      off: "Ausschalten."
    }
  },

  "Windturbine": {
    conditions: {
      outputGT: "Vergleicht die aktuelle Stromabgabe in kW.",
      outputLT: "Vergleicht die aktuelle Stromabgabe in kW.",
      isOn:     "Prüft, ob die Turbine eingeschaltet ist."
    },
    actions: {
      on:  "Einschalten.",
      off: "Ausschalten."
    }
  },

  "H2-Motor (Hydrogen Engine)": {
    conditions: {
      outputGT:  "Vergleicht die aktuelle Stromabgabe in kW.",
      isOn:      "Prüft, ob der Motor läuft.",
      isWorking: "True, wenn Motor läuft und Wasserstoff hat."
    },
    actions: {
      on:  "Motor einschalten.",
      off: "Motor ausschalten."
    }
  },

  // ---------- FÖRDERUNG ----------

  "Sortierer (Sorter)": {
    conditions: {
      drainAll:  "Drain-All saugt Items aus angrenzenden Inventaren in den Sortierer.",
      isOn:      "Prüft, ob der Sortierer eingeschaltet ist.",
      isWorking: "True, wenn der Sortierer Strom hat."
    },
    actions: {
      drainOn:  "Aktiviert Drain-All.",
      drainOff: "Deaktiviert Drain-All.",
      on:       "Sortierer einschalten.",
      off:      "Sortierer ausschalten."
    }
  },

  "Frachtcontainer (Cargo)": {
    conditions: {
      fillGT:    "Vergleicht den Füllstand (Volumen) in Prozent.",
      fillLT:    "Vergleicht den Füllstand (Volumen) in Prozent.",
      empty:     "True, wenn das Inventar leer ist.",
      massGT:    "Vergleicht die aktuelle Masse des Inventars in Kilogramm.",
      itemCntGT: "Vergleicht die Anzahl an Item-Stacks im Inventar."
    },
    actions: {
      setCustom: "Setzt den CustomData-Inhalt des Containers."
    }
  },

  // ---------- PRODUKTION ----------

  "Refinery / Schmelze": {
    conditions: {
      producing:   "True, wenn gerade Erz verarbeitet wird.",
      queueEmpty:  "True, wenn nichts mehr in der Warteschlange ist.",
      useConveyor: "True, wenn die Refinery über das Conveyor-System Erz holt/abgibt.",
      isOn:        "Prüft, ob die Refinery eingeschaltet ist.",
      isWorking:   "True, wenn die Refinery Strom hat und nicht beschädigt ist."
    },
    actions: {
      convOn:  "Conveyor-Anbindung aktivieren.",
      convOff: "Conveyor-Anbindung deaktivieren.",
      on:      "Einschalten.",
      off:     "Ausschalten.",
      clearQ:  "Leert die komplette Warteschlange."
    }
  },

  "Assembler": {
    conditions: {
      producing:       "True, wenn der Assembler gerade arbeitet.",
      queueEmpty:      "True, wenn die Warteschlange leer ist.",
      isDisassembling: "True, wenn im Demontage-Modus.",
      isAssembling:    "True, wenn im Bau-Modus.",
      coopOn:          "True, wenn Kooperativ-Modus aktiv ist.",
      repeatOn:        "True, wenn Wiederholung aktiv ist.",
      isOn:            "Prüft, ob der Assembler eingeschaltet ist."
    },
    actions: {
      assemble:    "Bau-Modus (stellt Komponenten her).",
      disassemble: "Demontage-Modus (zerlegt Komponenten in Rohstoffe).",
      cooperative: "Kooperativ-Modus umschalten — mehrere Assembler teilen Queue.",
      repeatOn:    "Wiederholung an — Warteschlange wird kontinuierlich wieder aufgenommen.",
      repeatOff:   "Wiederholung aus.",
      on:          "Einschalten.",
      off:         "Ausschalten.",
      clearQ:      "Leert die komplette Warteschlange."
    }
  },

  "Gas-Generator (O2/H2)": {
    conditions: {
      producing: "True, wenn der Generator gerade produzieren kann und Auto-Refill an ist.",
      isOn:      "Prüft, ob der Generator eingeschaltet ist.",
      refillOn:  "True, wenn Auto-Refill aktiv ist.",
      canProd:   "True, wenn überhaupt produziert werden kann (Eis vorhanden, Strom da)."
    },
    actions: {
      on:        "Generator einschalten.",
      off:       "Generator ausschalten.",
      refillOn:  "Auto-Refill an — Tanks/Flaschen werden automatisch gefüllt.",
      refillOff: "Auto-Refill aus."
    }
  },

  "Tank / Gas-Tank": {
    conditions: {
      fillGT:    "Vergleicht den Füllstand in Prozent.",
      fillLT:    "Vergleicht den Füllstand in Prozent.",
      stockpile: "Stockpile-Modus: Tank füllt sich, gibt aber kein Gas ab.",
      isOn:      "Prüft, ob der Tank eingeschaltet ist.",
      capGT:     "Vergleicht die Kapazität des Tanks in Litern."
    },
    actions: {
      stockOn:  "Stockpile aktivieren.",
      stockOff: "Stockpile deaktivieren — Tank gibt jetzt Gas ans Netz ab.",
      on:       "Tank einschalten.",
      off:      "Tank ausschalten."
    }
  },

  "Air Vent": {
    conditions: {
      pressurized:    "Raum hat ~100 % O₂.",
      depressurized:  "Raum ist drucklos.",
      pressuring:     "Druck wird gerade aufgebaut.",
      depressuring:   "Druck wird gerade abgebaut.",
      pressureGT:     "Vergleicht den O₂-Anteil in Prozent.",
      pressureLT:     "Vergleicht den O₂-Anteil in Prozent.",
      canPressurize:  "True, wenn der Raum versiegelbar ist (sonst zieht das Vent ins Vakuum).",
      depressureMode: "True, wenn der Vent im Depressurize-Modus ist (zieht Sauerstoff raus)."
    },
    actions: {
      pressOn:  "Druck aufbauen / Sauerstoff in den Raum pumpen.",
      pressOff: "Druck ablassen — Vent zieht Sauerstoff aus dem Raum.",
      on:       "Vent einschalten.",
      off:      "Vent ausschalten."
    }
  },

  // ---------- ANTRIEB ----------

  "Thruster (Triebwerk)": {
    conditions: {
      thrustGT:    "Vergleicht den aktuellen Schub in Kilonewton.",
      override:    "True, wenn ein manuelles Schub-Override aktiv ist.",
      isOn:        "Prüft, ob das Triebwerk eingeschaltet ist.",
      maxThrustGT: "Vergleicht den maximal möglichen Schub.",
      maxEffGT:    "Vergleicht den effektiven Max-Schub (atmosphärisch begrenzt).",
      overrideGT:  "Vergleicht den Override-Wert in Prozent."
    },
    actions: {
      override:    "Override Prozent setzen (0–100). 0 deaktiviert den Override.",
      overrideOff: "Override aus — Triebwerk wird wieder normal vom Schiff gesteuert.",
      on:          "Einschalten.",
      off:         "Ausschalten."
    }
  },

  "Gyroskop": {
    conditions: {
      override: "True, wenn das Gyroskop manuell übersteuert wird.",
      isOn:     "Prüft, ob das Gyroskop eingeschaltet ist.",
      powerGT:  "Vergleicht die Power-Stärke in Prozent."
    },
    actions: {
      overrideOn:  "Manuelle Steuerung aktivieren — Yaw/Pitch/Roll wirken.",
      overrideOff: "Manuelle Steuerung aus.",
      yaw:         "Yaw (Drehung um Hochachse) in Radiant pro Sekunde.",
      pitch:       "Pitch (Nicken) in Radiant pro Sekunde.",
      roll:        "Roll (Rollen) in Radiant pro Sekunde.",
      power:       "Stärke des Gyros in Prozent (0–100).",
      on:          "Einschalten.",
      off:         "Ausschalten."
    }
  },

  "Fallschirm": {
    conditions: {
      deployed:   "True, wenn der Fallschirm geöffnet ist.",
      autoDeploy: "True, wenn Auto-Deploy aktiv ist.",
      deployHGT:  "Vergleicht die eingestellte Auto-Deploy-Höhe."
    },
    actions: {
      open:    "Wirft den Fallschirm aus.",
      close:   "Packt den Fallschirm zurück (nur am Boden möglich).",
      autoOn:  "Auto-Deploy aktivieren.",
      autoOff: "Auto-Deploy deaktivieren.",
      deployH: "Höhe in Metern, bei der Auto-Deploy auslöst."
    }
  },

  "Jump Drive": {
    conditions: {
      ready:      "Bereit für einen Sprung.",
      charging:   "Lädt gerade.",
      chargeGT:   "Vergleicht die Ladung in Prozent.",
      jumpDistGT: "Vergleicht die aktuell eingestellte Sprung-Distanz in km.",
      isOn:       "Prüft, ob die Jump Drive eingeschaltet ist."
    },
    actions: {
      jump:      "Löst den Sprung aus (Ziel muss gesetzt sein).",
      jumpAbort: "Bricht einen laufenden Sprung ab.",
      on:        "Einschalten.",
      off:       "Ausschalten."
    }
  },

  // ---------- WERKZEUGE ----------

  "Bohrer (Drill)": {
    conditions: {
      isOn:      "Prüft, ob der Bohrer eingeschaltet ist.",
      isWorking: "True, wenn der Bohrer Strom hat und nicht beschädigt ist."
    },
    actions: {
      on:     "Bohrer einschalten.",
      off:    "Bohrer ausschalten.",
      toggle: "Bohrer umschalten."
    }
  },

  "Schweißer (Welder)": {
    conditions: {
      isOn:       "Prüft, ob der Schweißer eingeschaltet ist.",
      isWorking:  "True, wenn der Schweißer Strom hat.",
      helpOthers: "True, wenn der Schweißer auch fremden Spielern hilft."
    },
    actions: {
      on:      "Schweißer einschalten.",
      off:     "Schweißer ausschalten.",
      toggle:  "Schweißer umschalten.",
      helpOn:  "Help-Others an — schweißt auch fremde Schiffe/Spieler.",
      helpOff: "Help-Others aus — schweißt nur eigene/Freunde."
    }
  },

  "Schleifer (Grinder)": {
    conditions: {
      isOn:       "Prüft, ob der Schleifer eingeschaltet ist.",
      isWorking:  "True, wenn der Schleifer Strom hat.",
      helpOthers: "True, wenn der Schleifer auch fremden Spielern hilft."
    },
    actions: {
      on:      "Schleifer einschalten.",
      off:     "Schleifer ausschalten.",
      toggle:  "Schleifer umschalten.",
      helpOn:  "Help-Others an.",
      helpOff: "Help-Others aus."
    }
  },

  "Projektor": {
    conditions: {
      projecting: "True, wenn der Projektor ein Blueprint anzeigt.",
      remainGT:   "Vergleicht die Anzahl noch zu bauender Blöcke.",
      remainLT:   "Vergleicht die Anzahl noch zu bauender Blöcke.",
      buildable:  "Vergleicht die Anzahl direkt baubarer Blöcke (frei zugänglich).",
      totalGT:    "Vergleicht die Gesamtblock-Anzahl des Blueprints.",
      isOn:       "Prüft, ob der Projektor eingeschaltet ist."
    },
    actions: {
      on:  "Einschalten.",
      off: "Ausschalten."
    }
  },

  // ---------- WAFFEN ----------

  "Waffe (Turret/Gun)": {
    conditions: {
      shooting: "True, wenn die Waffe gerade schießt.",
      isOn:     "Prüft, ob die Waffe eingeschaltet ist."
    },
    actions: {
      shootOn:   "Dauerfeuer aktivieren.",
      shootOff:  "Feuer einstellen.",
      shootOnce: "Einzelschuss.",
      on:        "Einschalten.",
      off:       "Ausschalten."
    }
  },

  "Geschützturm (Gatling)": {
    conditions: {
      shooting:     "True, wenn der Turm feuert.",
      hasTarget:    "True, wenn der Turm ein Ziel anvisiert hat.",
      isOn:         "Prüft, ob der Turm aktiv ist.",
      isWorking:    "True, wenn der Turm Strom hat.",
      rangeGT:      "Vergleicht die eingestellte Reichweite.",
      underControl: "True, wenn der Turm aktuell von einem Spieler bedient wird."
    },
    actions: {
      on:          "Einschalten.",
      off:         "Ausschalten.",
      shootOn:     "Dauerfeuer.",
      shootOff:    "Feuer einstellen.",
      rangeSet:    "Maximale Tracking-Reichweite in Metern.",
      resetTarget: "Setzt das Ziel-Lock zurück."
    }
  },

  "Raketenturm": {
    conditions: {
      shooting:  "True, wenn der Turm feuert.",
      hasTarget: "True, wenn der Turm ein Ziel hat.",
      isOn:      "Prüft, ob der Turm aktiv ist.",
      rangeGT:   "Vergleicht die eingestellte Reichweite."
    },
    actions: {
      on:       "Einschalten.",
      off:      "Ausschalten.",
      shootOn:  "Dauerfeuer.",
      shootOff: "Feuer einstellen.",
      rangeSet: "Reichweite in Metern."
    }
  },

  "Innenraum-Geschütz": {
    conditions: {
      shooting:  "True, wenn das Geschütz feuert.",
      hasTarget: "True, wenn ein Ziel anvisiert ist.",
      isOn:      "Prüft, ob aktiv."
    },
    actions: {
      on:  "Einschalten.",
      off: "Ausschalten."
    }
  },

  "Gatling-Gun (fest)": {
    conditions: {
      shooting: "True, wenn die Gatling feuert.",
      isOn:     "Prüft, ob eingeschaltet."
    },
    actions: {
      shootOn:  "Dauerfeuer.",
      shootOff: "Feuer ein.",
      on:       "Einschalten.",
      off:      "Ausschalten."
    }
  },

  "Raketenwerfer (fest)": {
    conditions: {
      shooting: "True, wenn der Werfer feuert.",
      isOn:     "Prüft, ob eingeschaltet."
    },
    actions: {
      shootOn:   "Dauerfeuer.",
      shootOff:  "Feuer ein.",
      shootOnce: "Einzelrakete.",
      on:        "Einschalten.",
      off:       "Ausschalten."
    }
  },

  "Warhead (Sprengkopf)": {
    conditions: {
      armed:     "True, wenn der Sprengkopf scharf gestellt ist.",
      counting:  "True, wenn der Countdown bis zur Detonation läuft.",
      detTimeGT: "Vergleicht die verbleibende Countdown-Zeit."
    },
    actions: {
      arm:      "Scharf machen — Voraussetzung für Detonate.",
      disarm:   "Entschärfen.",
      start:    "Countdown starten.",
      stop:     "Countdown stoppen.",
      setDelay: "Detonations-Delay in Sekunden.",
      detonate: "Sofortige Detonation. ACHTUNG: Nur wenn 'armed'."
    }
  },

  "Decoy / Köder": {
    conditions: {
      isOn: "Prüft, ob der Decoy aktiv ist (zieht feindliche Geschütze an)."
    },
    actions: {
      on:     "Einschalten.",
      off:    "Ausschalten.",
      toggle: "Umschalten."
    }
  },

  // ---------- SENSORIK ----------

  "Sensor": {
    conditions: {
      isActive:     "True, wenn der Sensor etwas in seinem Erfassungsbereich entdeckt.",
      lastDetected: "True, wenn das zuletzt erkannte Objekt einem Spieler-Charakter gehört.",
      enabled:      "Prüft, ob der Sensor-Block eingeschaltet ist.",
      playPresent:  "True, wenn Spieler-Erkennung aktiv ist.",
      frontGT:      "Vergleicht die Reichweite nach vorne.",
      backGT:       "Vergleicht die Reichweite nach hinten."
    },
    actions: {
      on:        "Einschalten.",
      off:       "Ausschalten.",
      toggle:    "Umschalten.",
      frontSet:  "Front-Reichweite (max 50 m).",
      backSet:   "Back-Reichweite (max 50 m).",
      leftSet:   "Left-Reichweite (max 50 m).",
      rightSet:  "Right-Reichweite (max 50 m).",
      topSet:    "Top-Reichweite (max 50 m).",
      bottomSet: "Bottom-Reichweite (max 50 m).",
      playOn:    "Spieler-Erkennung an.",
      playOff:   "Spieler-Erkennung aus.",
      enemyOn:   "Gegner-Erkennung an.",
      enemyOff:  "Gegner-Erkennung aus.",
      friendOn:  "Freund-Erkennung an.",
      friendOff: "Freund-Erkennung aus."
    }
  },

  "Kamera": {
    conditions: {
      isActive:  "True, wenn die Kamera vom Spieler bedient wird.",
      canScan:   "Prüft, ob die Kamera in der gegebenen Reichweite scannen kann.",
      raycastOn: "True, wenn Raycast aktiv ist.",
      rangeGT:   "Vergleicht die verfügbare Raycast-Reichweite."
    },
    actions: {
      raycastOn:  "Raycast aktivieren — nötig für Distanz-Erkennung.",
      raycastOff: "Raycast deaktivieren.",
      on:         "Kamera einschalten.",
      off:        "Kamera ausschalten."
    }
  },

  "Funkantenne": {
    conditions: {
      broadcasting: "True, wenn die Antenne aktiv sendet.",
      rangeGT:      "Vergleicht die Reichweite in Metern.",
      isOn:         "Prüft, ob die Antenne eingeschaltet ist."
    },
    actions: {
      bcOn:     "Senden aktivieren.",
      bcOff:    "Senden deaktivieren — Schiff bleibt anonym.",
      setRange: "Reichweite in Metern (max 50 km).",
      hudOn:    "Schiffsname im HUD anzeigen.",
      hudOff:   "Schiffsname im HUD verbergen.",
      on:       "Antenne einschalten.",
      off:      "Antenne ausschalten."
    }
  },

  "Laser-Antenne": {
    conditions: {
      connected: "True, wenn die Laser-Antenne aktiv mit einem Ziel verbunden ist.",
      isOn:      "Prüft, ob die Antenne eingeschaltet ist."
    },
    actions: {
      on:  "Einschalten.",
      off: "Ausschalten."
    }
  },

  "Erz-Detektor": {
    conditions: {
      isOn:    "Prüft, ob der Erz-Detektor aktiv scannt.",
      rangeGT: "Vergleicht die Scan-Reichweite."
    },
    actions: {
      rangeSet: "Scan-Reichweite in Metern.",
      on:       "Einschalten.",
      off:      "Ausschalten."
    }
  },

  "Beacon": {
    conditions: {
      isOn:    "Prüft, ob das Beacon sichtbar sendet.",
      rangeGT: "Vergleicht die Sende-Reichweite in Metern."
    },
    actions: {
      setRange: "Reichweite des Beacons in Metern.",
      on:       "Einschalten.",
      off:      "Ausschalten.",
      setName:  "Custom-Name (wird im HUD angezeigt).",
      setData:  "CustomData-Inhalt setzen."
    }
  },

  // ---------- STEUERUNG ----------

  "Cockpit / Sitz / Remote": {
    conditions: {
      occupied:         "True, wenn jemand im Cockpit sitzt.",
      dampeners:        "True, wenn die Inertia-Dampers aktiv sind.",
      speedGT:          "Vergleicht die aktuelle Schiffsgeschwindigkeit in m/s.",
      speedLT:          "Vergleicht die aktuelle Schiffsgeschwindigkeit in m/s.",
      inGravity:        "True, wenn das Schiff in natürlicher Schwerkraft ist.",
      mainCock:         "True, wenn dieses Cockpit als 'Main Cockpit' markiert ist.",
      massGT:           "Vergleicht die physikalische Schiffsmasse in kg.",
      handbrakeOn:      "True, wenn die Handbremse aktiv ist.",
      controlWheels:    "True, wenn das Cockpit Räder steuert.",
      controlThrusters: "True, wenn das Cockpit Triebwerke steuert."
    },
    actions: {
      dampOn:        "Inertia-Dampers an.",
      dampOff:       "Inertia-Dampers aus — Schiff schwebt nach Antrieb-Aus weiter.",
      handbrake:     "Handbremse umschalten.",
      handbrakeOn:   "Handbremse an.",
      handbrakeOff:  "Handbremse aus.",
      ctlThrustOn:   "Steuert Triebwerke an.",
      ctlThrustOff:  "Steuert Triebwerke aus (autopilot kann übernehmen)."
    }
  },

  "Remote Control": {
    conditions: {
      autoPilot:    "True, wenn der Autopilot eingeschaltet ist.",
      speedGT:      "Vergleicht die aktuelle Schiffsgeschwindigkeit.",
      inGravity:    "True, wenn in Schwerkraft.",
      speedLimitGT: "Vergleicht das eingestellte Speed-Limit."
    },
    actions: {
      apOn:     "Autopilot an — Schiff fliegt die Wegpunkt-Liste ab.",
      apOff:    "Autopilot aus.",
      clearW:   "Wegpunkt-Liste leeren.",
      setSpeed: "Speed-Limit für den Autopilot setzen.",
      dockMode: "Docking-Modus an (langsamer für genauere Manöver).",
      dockOff:  "Docking-Modus aus."
    }
  },

  "Timer Block": {
    conditions: {
      running: "True, wenn der Timer aktuell herunterzählt.",
      delayGT: "Vergleicht den eingestellten Delay."
    },
    actions: {
      start:   "Startet den Countdown.",
      stop:    "Stoppt den Countdown.",
      trigger: "Löst die Timer-Aktionen sofort aus (ohne zu warten).",
      delay:   "Countdown-Dauer in Sekunden."
    }
  },

  "Programmable Block (anderer)": {
    conditions: {
      running: "True, wenn das Programm des PB gerade läuft.",
      isOn:    "Prüft, ob der PB eingeschaltet ist."
    },
    actions: {
      run: "Ruft den anderen PB mit einem String-Argument auf.",
      on:  "Einschalten.",
      off: "Ausschalten."
    }
  },

  "Button-Panel": {
    conditions: {
      isOn:   "Prüft, ob das Panel aktiv ist.",
      anyOne: "True, wenn das Panel von jedem bedient werden darf."
    },
    actions: {
      press: "Simuliert das Drücken eines Knopfs (1 bis N)."
    }
  },

  // ---------- ANZEIGE ----------

  "LCD / Text-Panel": {
    conditions: {
      isOn:       "Prüft, ob das LCD eingeschaltet ist.",
      fontSizeGT: "Vergleicht die Schriftgröße."
    },
    actions: {
      write:       "Überschreibt den LCD-Inhalt.",
      append:      "Hängt Text an den bestehenden LCD-Inhalt an.",
      clear:       "Leert den LCD-Inhalt.",
      fontSize:    "Schriftgröße (z. B. 1.0 = Standard, 2.0 = doppelt).",
      fontColor:   "Schriftfarbe als R,G,B (0–255 pro Kanal).",
      bgColor:     "Hintergrundfarbe als R,G,B.",
      alignLeft:   "Text linksbündig ausrichten.",
      alignCenter: "Text zentriert ausrichten.",
      alignRight:  "Text rechtsbündig ausrichten.",
      modeText:    "Modus Text+Bild (für reinen Text und einfache Bilder).",
      modeScript:  "Modus Script (für Sprite-API/Programmable-Block-Skripte).",
      modeNone:    "LCD-Inhalt aus.",
      on:          "Einschalten.",
      off:         "Ausschalten."
    }
  },

  "Lichter / Spotlight": {
    conditions: {
      on:          "Prüft, ob die Lampe an ist.",
      intensityGT: "Vergleicht die Intensität.",
      radiusGT:    "Vergleicht den Lichtradius.",
      blinkGT:     "Vergleicht das Blink-Intervall."
    },
    actions: {
      on:          "Einschalten.",
      off:         "Ausschalten.",
      toggle:      "Umschalten.",
      color:       "Farbe als R,G,B (0–255). Beispiel: 255,80,20 = warmes Orange.",
      intensity:   "Helligkeit. Werte typischerweise 0–10.",
      radiusSet:   "Lichtradius in Metern.",
      blinkOn:     "Blink-Intervall in Sekunden. 0 = nicht blinken.",
      blinkLen:    "Wie lange das Licht pro Intervall an ist (% des Intervalls).",
      blinkOffset: "Phasenverschiebung des Blinkens (% des Intervalls).",
      falloff:     "Wie stark das Licht abnimmt. 1 = linear, höher = schärfer."
    }
  },

  "Soundblock / Lautsprecher": {
    conditions: {
      isOn:   "Prüft, ob der Soundblock eingeschaltet ist.",
      volGT:  "Vergleicht die Lautstärke.",
      loopGT: "Vergleicht die Loop-Dauer."
    },
    actions: {
      play:     "Spielt den eingestellten Sound ab.",
      stop:     "Stoppt einen laufenden Sound.",
      vol:      "Lautstärke 0.0 (stumm) bis 1.0 (voll).",
      loopSet:  "Wie lange in Sekunden der Sound geloopt werden soll.",
      rangeSet: "Hörweite in Metern.",
      soundSel: "Auswahl des Sounds (interner Name, z. B. \"SoundBlockAlert1\")."
    }
  },

  // ---------- KOMFORT ----------

  "Medi-Raum (Medical Room)": {
    conditions: {
      isOn:     "Prüft, ob der Medi-Raum aktiv heilt.",
      isWorking: "True, wenn der Medi-Raum Strom hat und nicht beschädigt ist."
    },
    actions: {
      on:  "Einschalten.",
      off: "Ausschalten."
    }
  },

  "Kryo-Kammer": {
    conditions: {
      occupied: "True, wenn jemand in der Kryo-Kammer sitzt.",
      isOn:     "Prüft, ob die Kammer aktiv ist."
    },
    actions: {
      on:  "Einschalten.",
      off: "Ausschalten."
    }
  },

  // ---------- CUSTOM ----------

  "Custom (selbst eintragen)": {
    conditions: {
      customCond: "Schreib hier einen rohen C#-Boolean-Ausdruck. Verwende 'v' als Platzhalter für den Block."
    },
    actions: {
      applyAction: "Ruft eine im Spiel registrierte Terminal-Aktion auf.",
      setBool:     "Setzt eine Boolean-Eigenschaft.",
      setFloat:    "Setzt einen numerischen Wert.",
      rawCode:     "Roher C#-Code. {v} wird durch den Block-Variablennamen ersetzt.",
      on:          "Schaltet den Block ein (Cast auf IMyFunctionalBlock).",
      off:         "Schaltet den Block aus."
    }
  }
};

function getDescription(blockType, optionId, kind) {
  const blk = DESCRIPTIONS[blockType];
  if (!blk) return null;
  if (kind && blk[kind]) return blk[kind][optionId] || null;
  return (blk.conditions && blk.conditions[optionId])
      || (blk.actions    && blk.actions[optionId])
      || null;
}
