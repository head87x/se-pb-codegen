// ============================================================
// BLOCK / OPTION DESCRIPTIONS (Tooltip-Texte)
// ============================================================
// Struktur:
//   DESCRIPTIONS[blockType] = {
//     conditions: { <optionId>: "Erklärtext", ... },
//     actions:    { <optionId>: "Erklärtext", ... }
//   }
//
// Die Trennung nach conditions/actions ist nötig, weil eine ID
// (z. B. "override" beim Thruster) sowohl als Condition als auch
// als Action existieren kann und unterschiedliche Bedeutung hat.

const DESCRIPTIONS = {

  // ---------- BEWEGUNG ----------

  "Tür (Door)": {
    conditions: {
      open:        "True, wenn die Tür vollständig offen ist.",
      closed:      "True, wenn die Tür vollständig geschlossen ist.",
      opening:     "True während des Öffnungs-Vorgangs (Tür bewegt sich).",
      closing:     "True während des Schließ-Vorgangs.",
      enabledTrue: "Prüft, ob die Tür funktional aktiviert ist. Eine deaktivierte Tür lässt sich weder öffnen noch schließen."
    },
    actions: {
      open:   "Öffnet die Tür.",
      close:  "Schließt die Tür.",
      toggle: "Wenn offen → schließen, wenn geschlossen → öffnen.",
      on:     "Funktion aktivieren — erst dann nimmt die Tür Öffnen/Schließen-Befehle an.",
      off:    "Funktion deaktivieren (Tür verriegelt sich quasi)."
    }
  },

  "Hangartor (Hangar Door)": {
    conditions: {
      fullyOpen:   "Hangartor ist komplett offen.",
      fullyClosed: "Hangartor ist komplett geschlossen.",
      moving:      "Hangartor ist gerade in Bewegung (öffnet oder schließt)."
    },
    actions: {
      open:   "Öffnet das Hangartor.",
      close:  "Schließt das Hangartor.",
      toggle: "Wenn offen → schließen, sonst → öffnen."
    }
  },

  "Kolben (Piston)": {
    conditions: {
      extending:  "True, wenn die aktuelle Geschwindigkeit positiv ist (Kolben fährt aus).",
      retracting: "True, wenn die aktuelle Geschwindigkeit negativ ist (Kolben fährt ein).",
      atTop:      "True, wenn die aktuelle Länge bei der eingestellten Max-Länge angekommen ist.",
      atBottom:   "True, wenn die aktuelle Länge auf Min-Limit reduziert ist.",
      posGreater: "Vergleicht die aktuelle Länge in Metern mit deinem Wert. Beispiel: > 5 → True, wenn der Kolben länger als 5 m ist.",
      posLess:    "Vergleicht die aktuelle Länge in Metern mit deinem Wert."
    },
    actions: {
      extend:   "Bewegt den Kolben nach oben/außen mit Standard-Geschwindigkeit (0.5 m/s falls keine andere gesetzt war).",
      retract:  "Bewegt den Kolben nach unten/innen mit Standard-Geschwindigkeit.",
      reverse:  "Kehrt die aktuelle Bewegungsrichtung um.",
      setSpeed: "Setzt die Geschwindigkeit direkt in Meter pro Sekunde. Positiv = aus, negativ = ein.",
      setMax:   "Maximale Auslenkung in Metern. Der Kolben fährt nicht über diesen Wert hinaus.",
      setMin:   "Minimale Auslenkung in Metern. Der Kolben fährt nicht unter diesen Wert."
    }
  },

  "Rotor (Advanced/Stator)": {
    conditions: {
      rotating:   "True, wenn die Soll-Drehzahl ungleich null ist (RPM != 0).",
      angleGT:    "Vergleicht den aktuellen Winkel in Grad mit deinem Wert.",
      angleLT:    "Vergleicht den aktuellen Winkel in Grad mit deinem Wert.",
      isLocked:   "True, wenn der Rotor in seiner aktuellen Position gesperrt ist (RotorLock = true).",
      isAttached: "True, wenn der Top-Part angebracht und verbunden ist."
    },
    actions: {
      setRpm:  "Soll-Drehzahl. Positiv und negativ steuern die Drehrichtung.",
      stop:    "Setzt die Soll-Drehzahl auf 0 — Rotor hält an.",
      lock:    "Sperrt den Rotor in der aktuellen Position. Er bleibt steif gegen Kräfte.",
      unlock:  "Hebt die Sperre auf — Rotor kann sich wieder drehen.",
      reverse: "Kehrt die aktuelle Drehrichtung um.",
      attach:  "Versucht, einen neuen Top-Part anzubringen (Detach + Reset).",
      detach:  "Löst den aktuell verbundenen Top-Part."
    }
  },

  "Verbinder (Connector)": {
    conditions: {
      connected:   "True, wenn dieser Connector aktuell mit einem anderen gekoppelt ist.",
      ready:       "True, wenn der Connector bereit zum Andocken ist (anderer Connector nahe und ausgerichtet).",
      unconnected: "True, wenn weder verbunden noch andockbereit."
    },
    actions: {
      connect:    "Versucht zu verbinden (wirkt nur, wenn 'ready').",
      disconnect: "Trennt die aktuelle Verbindung.",
      toggle:     "Wechselt zwischen Verbinden und Trennen."
    }
  },

  "Merge-Block": {
    conditions: {
      connected: "True, wenn dieser Merge-Block aktuell physisch mit einem anderen Merge-Block verschmolzen ist."
    },
    actions: {}
  },

  "Magnet-Plate / Landing-Gear": {
    conditions: {
      locked: "True, wenn das Landing-Gear an einer Oberfläche gesperrt ist.",
      ready:  "True, wenn eine sperrbare Oberfläche in Reichweite ist."
    },
    actions: {
      lock:    "Versucht zu sperren (wirkt nur, wenn 'ready').",
      unlock:  "Hebt die Sperre auf.",
      autoOn:  "Auto-Lock: Landing-Gear sperrt automatisch, sobald eine Fläche erreichbar ist.",
      autoOff: "Deaktiviert das automatische Sperren."
    }
  },

  // ---------- ENERGIE ----------

  "Akku (Battery)": {
    conditions: {
      chargeGT: "Vergleicht die aktuelle Ladung in Prozent. Beispiel: > 80 → True, wenn der Akku zu mehr als 80 % geladen ist.",
      chargeLT: "Vergleicht die aktuelle Ladung in Prozent.",
      charging: "True, wenn der Akku gerade mehr Strom aufnimmt als er abgibt.",
      isOn:     "Prüft, ob der Akku eingeschaltet ist."
    },
    actions: {
      auto:      "Modus Auto: lädt oder entlädt je nach Bedarf am Stromnetz.",
      recharge:  "Modus Recharge: lädt nur, gibt keinen Strom ab.",
      discharge: "Modus Discharge: gibt Strom ab, lädt nicht."
    }
  },

  "Reaktor": {
    conditions: {
      outputGT: "Vergleicht die aktuelle Stromabgabe in Megawatt.",
      isOn:     "Prüft, ob der Reaktor eingeschaltet ist."
    },
    actions: {}
  },

  "Solarpanel": {
    conditions: {
      outputGT: "Vergleicht die aktuelle Stromabgabe in Kilowatt — nützlich, um zu erkennen, ob das Panel gerade im Sonnenlicht steht."
    },
    actions: {}
  },

  "Windturbine": {
    conditions: {
      outputGT: "Vergleicht die aktuelle Stromabgabe in Kilowatt — nützlich, um zu erkennen, ob genug Wind weht."
    },
    actions: {}
  },

  "H2-Motor (Hydrogen Engine)": {
    conditions: {
      outputGT: "Vergleicht die aktuelle Stromabgabe in Kilowatt.",
      isOn:     "Prüft, ob der Motor läuft."
    },
    actions: {}
  },

  // ---------- FÖRDERUNG ----------

  "Sortierer (Sorter)": {
    conditions: {
      drainAll: "Drain-All saugt Items aus angrenzenden Inventaren in den Sortierer — nützlich zum Sammeln.",
      isOn:     "Prüft, ob der Sortierer eingeschaltet ist."
    },
    actions: {
      drainOn:  "Aktiviert Drain-All.",
      drainOff: "Deaktiviert Drain-All."
    }
  },

  "Frachtcontainer (Cargo)": {
    conditions: {
      fillGT: "Vergleicht den Füllstand (Volumen) in Prozent. Beispiel: > 90 → fast voll.",
      fillLT: "Vergleicht den Füllstand (Volumen) in Prozent.",
      empty:  "True, wenn das Inventar des Containers leer ist."
    },
    actions: {}
  },

  // ---------- PRODUKTION ----------

  "Refinery / Schmelze": {
    conditions: {
      producing:   "True, wenn die Refinery gerade Erz verarbeitet.",
      queueEmpty:  "True, wenn nichts mehr in der Warteschlange ist.",
      useConveyor: "True, wenn die Refinery automatisch über das Conveyor-System Erz und Output zieht/abgibt."
    },
    actions: {
      convOn:  "Aktiviert das automatische Förderband-Anschluss.",
      convOff: "Deaktiviert die Conveyor-Anbindung.",
      clearQ:  "Leert die komplette Warteschlange."
    }
  },

  "Assembler": {
    conditions: {
      producing:       "True, wenn der Assembler gerade Komponenten herstellt oder zerlegt.",
      queueEmpty:      "True, wenn die Warteschlange leer ist.",
      isDisassembling: "True, wenn der Assembler im Demontage-Modus läuft."
    },
    actions: {
      assemble:    "Wechselt in den Bau-Modus (stellt Komponenten her).",
      disassemble: "Wechselt in den Demontage-Modus (zerlegt Komponenten in Rohstoffe).",
      cooperative: "Schaltet Kooperativ-Modus um — mehrere Assembler teilen sich eine Warteschlange.",
      clearQ:      "Leert die komplette Warteschlange."
    }
  },

  "Gas-Generator (O2/H2)": {
    conditions: {
      producing: "True, wenn der Generator gerade Sauerstoff oder Wasserstoff produzieren kann und Auto-Refill an ist.",
      isOn:      "Prüft, ob der Generator eingeschaltet ist."
    },
    actions: {
      refillOn:  "Auto-Refill: Generator füllt angeschlossene Tanks/Flaschen automatisch.",
      refillOff: "Deaktiviert Auto-Refill."
    }
  },

  "Tank / Gas-Tank": {
    conditions: {
      fillGT:    "Vergleicht den Füllstand in Prozent. Beispiel: > 50 → mehr als halbvoll.",
      fillLT:    "Vergleicht den Füllstand in Prozent.",
      stockpile: "Stockpile-Modus: Tank füllt sich aus angeschlossenen Generatoren, gibt aber kein Gas ab."
    },
    actions: {
      stockOn:  "Aktiviert Stockpile.",
      stockOff: "Deaktiviert Stockpile — Tank gibt jetzt Gas ans Netz ab."
    }
  },

  "Air Vent": {
    conditions: {
      pressurized:   "Raum, der vom Vent versorgt wird, ist auf voller Druckstufe (≈100 % O₂).",
      depressurized: "Raum ist drucklos (Vakuum oder offen).",
      pressureGT:    "Vergleicht den Sauerstoff-Anteil des Raumes in Prozent.",
      canPressurize: "True, wenn der Raum überhaupt versiegelbar ist (sonst zieht das Vent ins Vakuum)."
    },
    actions: {
      pressOn:  "Druck aufbauen / Sauerstoff in den Raum pumpen.",
      pressOff: "Druck ablassen — Vent zieht Sauerstoff aus dem Raum zurück in Tanks."
    }
  },

  // ---------- ANTRIEB ----------

  "Thruster (Triebwerk)": {
    conditions: {
      thrustGT: "Vergleicht den aktuellen Schub in Kilonewton.",
      override: "True, wenn ein manuelles Schub-Override gesetzt ist (Wert > 0)."
    },
    actions: {
      override:    "Override Prozent setzen (0–100). 0 deaktiviert den Override.",
      overrideOff: "Override aus — Triebwerk wird wieder normal vom Schiff gesteuert."
    }
  },

  "Gyroskop": {
    conditions: {
      override: "True, wenn das Gyroskop manuell übersteuert wird."
    },
    actions: {
      overrideOn:  "Manuelle Steuerung aktivieren — Yaw/Pitch/Roll wirken jetzt.",
      overrideOff: "Manuelle Steuerung aus — Gyroskop wieder vom Cockpit gesteuert.",
      yaw:         "Yaw (Drehung um Hochachse) in Radiant pro Sekunde.",
      pitch:       "Pitch (Nick) in Radiant pro Sekunde.",
      roll:        "Roll (Rollen) in Radiant pro Sekunde.",
      power:       "Stärke des Gyros in Prozent (0–100)."
    }
  },

  "Fallschirm": {
    conditions: {
      deployed: "True, wenn der Fallschirm geöffnet/ausgeworfen ist."
    },
    actions: {
      open:  "Wirft den Fallschirm aus.",
      close: "Packt den Fallschirm zurück (nur am Boden möglich)."
    }
  },

  "Jump Drive": {
    conditions: {
      ready:    "Bereit für einen Sprung (geladen und Ziel gesetzt).",
      charging: "Lädt gerade die Sprung-Energie.",
      chargeGT: "Vergleicht die Ladung in Prozent."
    },
    actions: {
      jump: "Hinweis: Sprung-Ziel und Distanz werden außerhalb dieser Aktion gesetzt. Auslösen z.B. via ApplyAction(\"Jump\")."
    }
  },

  // ---------- WERKZEUGE ----------

  "Bohrer (Drill)": {
    conditions: { isOn: "Prüft, ob der Bohrer aktiv ist." },
    actions: {
      on:     "Bohrer einschalten (bohrt aktiv).",
      off:    "Bohrer ausschalten.",
      toggle: "Bohrer umschalten."
    }
  },

  "Schweißer (Welder)": {
    conditions: { isOn: "Prüft, ob der Schweißer aktiv ist." },
    actions: {
      on:     "Schweißer einschalten (baut Blöcke).",
      off:    "Schweißer ausschalten.",
      toggle: "Schweißer umschalten."
    }
  },

  "Schleifer (Grinder)": {
    conditions: { isOn: "Prüft, ob der Schleifer aktiv ist." },
    actions: {
      on:     "Schleifer einschalten (zerlegt Blöcke).",
      off:    "Schleifer ausschalten.",
      toggle: "Schleifer umschalten."
    }
  },

  "Projektor": {
    conditions: {
      projecting: "True, wenn der Projektor aktuell ein Blueprint anzeigt.",
      remainGT:   "Vergleicht die Anzahl der noch zu bauenden Blöcke im Blueprint.",
      remainLT:   "Vergleicht die Anzahl der noch zu bauenden Blöcke im Blueprint."
    },
    actions: {}
  },

  // ---------- WAFFEN ----------

  "Waffe (Turret/Gun)": {
    conditions: {
      shooting: "True, wenn die Waffe gerade schießt."
    },
    actions: {
      shootOn:   "Dauerfeuer aktivieren.",
      shootOff:  "Feuer einstellen.",
      shootOnce: "Einzelschuss/-rakete."
    }
  },

  "Geschützturm (Gatling)": {
    conditions: {
      shooting:  "True, wenn der Turm gerade feuert.",
      hasTarget: "True, wenn der Turm ein Ziel anvisiert hat.",
      isOn:      "Prüft, ob der Turm aktiv ist (sucht und schießt auf Ziele)."
    },
    actions: {
      rangeSet: "Reichweite des Turm-Trackings in Metern."
    }
  },

  "Raketenturm": {
    conditions: {
      shooting:  "True, wenn der Turm gerade feuert.",
      hasTarget: "True, wenn der Turm ein Ziel anvisiert hat."
    },
    actions: {}
  },

  "Innenraum-Geschütz": {
    conditions: {
      shooting:  "True, wenn das Innenraum-Geschütz gerade feuert.",
      hasTarget: "True, wenn ein Ziel anvisiert ist."
    },
    actions: {}
  },

  "Gatling-Gun (fest)": {
    conditions: {
      shooting: "True, wenn die Gatling gerade feuert."
    },
    actions: {}
  },

  "Raketenwerfer (fest)": {
    conditions: {
      shooting: "True, wenn der Werfer feuert."
    },
    actions: {
      shootOnce: "Einzelrakete abfeuern."
    }
  },

  "Warhead (Sprengkopf)": {
    conditions: {
      armed:    "True, wenn der Sprengkopf scharf gestellt ist.",
      counting: "True, wenn der Countdown bis zur Detonation läuft."
    },
    actions: {
      arm:      "Sprengkopf scharf machen — Voraussetzung für Detonate.",
      disarm:   "Sprengkopf entschärfen.",
      detonate: "Sofortige Detonation. ACHTUNG: Nur ausgeführt, wenn 'armed' true ist."
    }
  },

  "Decoy / Köder": {
    conditions: {
      isOn: "Prüft, ob der Decoy aktiv ist (zieht feindliche Geschütze an)."
    },
    actions: {}
  },

  // ---------- SENSORIK ----------

  "Sensor": {
    conditions: {
      isActive:     "True, wenn der Sensor aktuell etwas in seinem Erfassungsbereich entdeckt (Charakter, Schiff, Asteroid, ...).",
      lastDetected: "True, wenn das zuletzt erkannte Objekt einem Spieler-Charakter gehört (mit Zugriffsrechten).",
      enabled:      "Prüft, ob der Sensor-Block überhaupt eingeschaltet ist."
    },
    actions: {}
  },

  "Kamera": {
    conditions: {
      isActive: "True, wenn die Kamera gerade aktiv vom Spieler bedient wird.",
      canScan:  "Roher Aufruf — prüft, ob die Kamera in der gegebenen Reichweite scannen kann."
    },
    actions: {
      raycastOn:  "Erlaubt der Kamera, Raycasts auszuführen — notwendig für Distanz-/Objekt-Erkennung.",
      raycastOff: "Deaktiviert Raycast-Funktion."
    }
  },

  "Funkantenne": {
    conditions: {
      broadcasting: "True, wenn die Antenne aktiv sendet (sichtbar auf Karten anderer Schiffe).",
      rangeGT:      "Vergleicht die Reichweite der Antenne in Metern."
    },
    actions: {
      bcOn:     "Aktiviert das Senden.",
      bcOff:    "Deaktiviert das Senden — Schiff bleibt anonym.",
      setRange: "Reichweite der Antenne in Metern (max. 50 km)."
    }
  },

  "Laser-Antenne": {
    conditions: {
      connected: "True, wenn die Laser-Antenne aktiv mit einem Ziel verbunden ist."
    },
    actions: {}
  },

  "Erz-Detektor": {
    conditions: {
      isOn: "Prüft, ob der Erz-Detektor aktiv scannt."
    },
    actions: {
      rangeSet: "Scan-Reichweite in Metern."
    }
  },

  "Beacon": {
    conditions: {
      isOn:    "Prüft, ob das Beacon sichtbar sendet.",
      rangeGT: "Vergleicht die Sende-Reichweite in Metern."
    },
    actions: {
      setRange: "Reichweite des Beacons in Metern."
    }
  },

  // ---------- STEUERUNG ----------

  "Cockpit / Sitz / Remote": {
    conditions: {
      occupied:  "True, wenn jemand im Cockpit/Sitz sitzt.",
      dampeners: "True, wenn die Inertia-Dampers aktiv sind (automatisches Bremsen).",
      speedGT:   "Vergleicht die aktuelle Schiffsgeschwindigkeit in m/s.",
      speedLT:   "Vergleicht die aktuelle Schiffsgeschwindigkeit in m/s.",
      inGravity: "True, wenn das Schiff in natürlicher Schwerkraft ist (z.B. nahe einem Planeten).",
      mainCock:  "True, wenn dieses Cockpit als 'Main Cockpit' markiert ist."
    },
    actions: {
      dampOn:    "Aktiviert die Inertia-Dampers.",
      dampOff:   "Deaktiviert die Inertia-Dampers — Schiff schwebt nach Antrieb-Aus weiter.",
      handbrake: "Schaltet die Handbremse um (nur sinnvoll bei Wagen mit Rädern)."
    }
  },

  "Remote Control": {
    conditions: {
      autoPilot: "True, wenn der Autopilot aktiv eingeschaltet ist."
    },
    actions: {
      apOn:   "Autopiloten einschalten — Schiff fliegt zur Wegpunkt-Liste.",
      apOff:  "Autopiloten ausschalten.",
      clearW: "Leert die Wegpunkt-Liste."
    }
  },

  "Timer Block": {
    conditions: {
      running: "True, wenn der Timer aktuell herunterzählt."
    },
    actions: {
      start:   "Startet den Countdown.",
      stop:    "Stoppt den Countdown.",
      trigger: "Löst die Timer-Aktionen sofort aus (ohne zu warten).",
      delay:   "Setzt die Countdown-Dauer in Sekunden."
    }
  },

  "Programmable Block (anderer)": {
    conditions: {
      running: "True, wenn das Programm des anderen PB gerade läuft."
    },
    actions: {
      run: "Ruft den anderen PB mit einem String-Argument auf."
    }
  },

  "Button-Panel": {
    conditions: {},
    actions: {
      press: "Simuliert das Drücken eines Buttons. Knopf 1, 2, … entsprechend der Panel-Beschriftung."
    }
  },

  // ---------- ANZEIGE ----------

  "LCD / Text-Panel": {
    conditions: {
      isOn: "Prüft, ob das LCD eingeschaltet ist."
    },
    actions: {
      write:      "Überschreibt den LCD-Inhalt mit dem gegebenen Text. Anführungszeichen nicht vergessen.",
      append:     "Hängt Text an den bestehenden LCD-Inhalt an.",
      fontSize:   "Schriftgröße — z.B. 1.0 = Standard, 2.0 = doppelt so groß.",
      modeText:   "Schaltet das LCD in den Text+Bild-Modus.",
      modeScript: "Schaltet das LCD in den Script-Modus (für Sprite-API)."
    }
  },

  "Lichter / Spotlight": {
    conditions: {
      on: "Prüft, ob die Lampe an ist."
    },
    actions: {
      blinkOn:   "Blink-Intervall in Sekunden setzen. 0 = nicht blinken.",
      color:     "RGB-Farbe — drei Zahlen 0–255, kommagetrennt. Beispiel: 255,80,20 ergibt warmes Orange.",
      intensity: "Helligkeit. Werte typischerweise 0–10."
    }
  },

  "Soundblock / Lautsprecher": {
    conditions: {},
    actions: {
      play:    "Spielt den am Soundblock eingestellten Sound einmal ab.",
      stop:    "Stoppt einen laufenden Sound.",
      vol:     "Lautstärke 0.0 (stumm) bis 1.0 (voll).",
      loopSet: "Wie lange in Sekunden der Sound geloopt werden soll."
    }
  },

  // ---------- KOMFORT ----------

  "Medi-Raum (Medical Room)": {
    conditions: {
      isOn: "Prüft, ob der Medi-Raum aktiv heilt."
    },
    actions: {}
  },

  "Kryo-Kammer": {
    conditions: {
      occupied: "True, wenn jemand in der Kryo-Kammer sitzt (oft kombiniert mit Logout-Schutz)."
    },
    actions: {}
  },

  // ---------- CUSTOM ----------

  "Custom (selbst eintragen)": {
    conditions: {
      customCond: "Schreib hier einen rohen C#-Boolean-Ausdruck. Verwende 'v' als Platzhalter für den Block. Beispiel: v.Enabled && v.IsWorking."
    },
    actions: {
      applyAction: "Ruft eine im Spiel registrierte Terminal-Aktion auf. Aktions-Namen findest du, indem du im Spiel mit der Maus über den Button-Bar des Blocks hoverst.",
      setBool:     "Setzt eine Boolean-Eigenschaft des Blocks. Erstes Argument ist der Property-Name als String, zweites ist true/false.",
      setFloat:    "Setzt einen numerischen Wert. Erstes Argument Property-Name, zweites die Zahl (mit f-Suffix bei Float).",
      rawCode:     "Roher C#-Code — alles erlaubt, was der Programmable Block per Whitelist zulässt. {v} wird durch den Block-Variablennamen ersetzt.",
      on:          "Schaltet den Block ein (cast auf IMyFunctionalBlock — funktioniert für alle ein-/ausschaltbaren Blöcke).",
      off:         "Schaltet den Block aus (cast auf IMyFunctionalBlock)."
    }
  }
};

// kind: 'conditions' | 'actions'
function getDescription(blockType, optionId, kind) {
  const blk = DESCRIPTIONS[blockType];
  if (!blk) return null;
  if (kind && blk[kind]) return blk[kind][optionId] || null;
  // Fallback (sollte nicht mehr nötig sein, aber defensiv):
  return (blk.conditions && blk.conditions[optionId])
      || (blk.actions    && blk.actions[optionId])
      || null;
}
