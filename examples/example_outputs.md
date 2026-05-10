# Beispiel-Outputs

Drei reale Szenarien, vom Tool generiert, zur Orientierung und als Sanity-Check.

---

## Szenario 1: Hangartor per Sensor

**Setup:**
- WENN Sensor `Sensor 1` erkennt etwas
- DANN Tür `Hangar Door` öffnen
- SONST Tür `Hangar Door` schließen
- Modus: alle 10 Ticks
- LCD `LCD Status` aktiviert

**Generierter Code:**

```csharp
// =====================================================
// SPACE ENGINEERS - PROGRAMMABLE BLOCK SCRIPT
// Generiert mit SE.PB Code Generator
// =====================================================

public Program()
{
    Runtime.UpdateFrequency = UpdateFrequency.Update10;
}

public void Save() { }

public void Main(string argument, UpdateType updateSource)
{
    // ---------- Block-Referenzen holen ----------
    IMySensorBlock sensor_1_0 = GridTerminalSystem.GetBlockWithName("Sensor 1") as IMySensorBlock;
    if (sensor_1_0 == null) { Echo("FEHLER: Block 'Sensor 1' nicht gefunden!"); return; }
    IMyDoor hangar_Door_1 = GridTerminalSystem.GetBlockWithName("Hangar Door") as IMyDoor;
    if (hangar_Door_1 == null) { Echo("FEHLER: Block 'Hangar Door' nicht gefunden!"); return; }

    // ---------- LCD Status ----------
    IMyTextSurface lcd_status = GridTerminalSystem.GetBlockWithName("LCD Status") as IMyTextSurface;
    System.Text.StringBuilder sb = new System.Text.StringBuilder();
    sb.AppendLine("=== STATUS ===");
    sb.AppendLine("Tick: " + DateTime.Now.ToString("HH:mm:ss"));

    // ---------- Bedingungen prüfen ----------
    bool conditionMet = (sensor_1_0.IsActive);

    sb.AppendLine("Bedingung: " + (conditionMet ? "ERFÜLLT" : "nicht erfüllt"));

    // ---------- Aktionen ausführen ----------
    if (conditionMet)
    {
        hangar_Door_1.OpenDoor();
        sb.AppendLine("DO: Hangar Door → Öffnen");
    }
    else
    {
        hangar_Door_1.CloseDoor();
        sb.AppendLine("ELSE: Hangar Door → Schließen");
    }

    // ---------- LCD ausgeben ----------
    if (lcd_status != null)
    {
        lcd_status.ContentType = ContentType.TEXT_AND_IMAGE;
        lcd_status.WriteText(sb.ToString());
    }
    Echo(sb.ToString());
}
```

---

## Szenario 2: Energie-/Treibstoff-Alarm

**Setup:**
- WENN Akku `Battery 1` Ladung < 20 %
- ODER Tank `H2 Tank` Füllstand < 10 %
- DANN Licht `Warning Light` einschalten + Sound `Alarm` abspielen
- Modus: alle 100 Ticks

**Generierter Code:**

```csharp
// =====================================================
// SPACE ENGINEERS - PROGRAMMABLE BLOCK SCRIPT
// Generiert mit SE.PB Code Generator
// =====================================================

public Program()
{
    Runtime.UpdateFrequency = UpdateFrequency.Update100;
}

public void Save() { }

public void Main(string argument, UpdateType updateSource)
{
    // ---------- Block-Referenzen holen ----------
    IMyBatteryBlock battery_1_0 = GridTerminalSystem.GetBlockWithName("Battery 1") as IMyBatteryBlock;
    if (battery_1_0 == null) { Echo("FEHLER: Block 'Battery 1' nicht gefunden!"); return; }
    IMyGasTank h2_Tank_1 = GridTerminalSystem.GetBlockWithName("H2 Tank") as IMyGasTank;
    if (h2_Tank_1 == null) { Echo("FEHLER: Block 'H2 Tank' nicht gefunden!"); return; }
    IMyLightingBlock warning_Light_2 = GridTerminalSystem.GetBlockWithName("Warning Light") as IMyLightingBlock;
    if (warning_Light_2 == null) { Echo("FEHLER: Block 'Warning Light' nicht gefunden!"); return; }
    IMySoundBlock alarm_3 = GridTerminalSystem.GetBlockWithName("Alarm") as IMySoundBlock;
    if (alarm_3 == null) { Echo("FEHLER: Block 'Alarm' nicht gefunden!"); return; }

    // ---------- Bedingungen prüfen ----------
    bool conditionMet = ((battery_1_0.CurrentStoredPower / battery_1_0.MaxStoredPower) * 100f < 20f) || (h2_Tank_1.FilledRatio * 100 < 10);

    // ---------- Aktionen ausführen ----------
    if (conditionMet)
    {
        warning_Light_2.Enabled = true;
        alarm_3.Play();
    }
}
```

---

## Szenario 3: Custom Raw Code (Toggle)

**Setup:**
- Keine Bedingung (läuft immer)
- DANN Custom-Block `My Block` mit rohem Code: `{v}.Enabled = !{v}.Enabled;`
- Modus: manuell (per Argument)

**Generierter Code:**

```csharp
// =====================================================
// SPACE ENGINEERS - PROGRAMMABLE BLOCK SCRIPT
// Generiert mit SE.PB Code Generator
// =====================================================

public Program()
{
    // Manuelle Ausführung — kein UpdateFrequency nötig
}

public void Save() { }

public void Main(string argument, UpdateType updateSource)
{
    // ---------- Block-Referenzen holen ----------
    IMyTerminalBlock my_Block_0 = GridTerminalSystem.GetBlockWithName("My Block") as IMyTerminalBlock;
    if (my_Block_0 == null) { Echo("FEHLER: Block 'My Block' nicht gefunden!"); return; }

    // ---------- Bedingungen prüfen ----------
    bool conditionMet = true;

    // ---------- Aktionen ausführen ----------
    if (conditionMet)
    {
        my_Block_0.Enabled = !my_Block_0.Enabled;
    }
}
```
