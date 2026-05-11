// ============================================================
// KATEGORIE-ICONS (SVG inline, monochrom über currentColor)
// ============================================================
// Bewusst minimalistisch — passt zur Sci-Fi-/Terminal-Ästhetik.
// 16×16 viewBox, stroke-basiert, currentColor füllt sich aus dem
// umgebenden CSS (.palette-card .icon).

const CATEGORY_ICONS = {

  // Bewegung — Pfeile (auf/ab)
  "Bewegung": `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 6l3-3 3 3M5 10l3 3 3-3"/>
  </svg>`,

  // Energie — Blitz
  "Energie": `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 1L3 9h4l-2 6 6-8H7l2-6z"/>
  </svg>`,

  // Förderung — Pfeil mit Linien (Pipeline)
  "Förderung": `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M2 8h11M10 5l3 3-3 3"/>
    <circle cx="4" cy="8" r="1"/>
  </svg>`,

  // Produktion — Zahnrad
  "Produktion": `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="8" cy="8" r="2.2"/>
    <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5L13 13M3 13l1.5-1.5M11.5 4.5L13 3"/>
  </svg>`,

  // Antrieb — Düse
  "Antrieb": `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 5h6l3 3-3 3H3z"/>
    <path d="M13 6v4M15 7v2"/>
  </svg>`,

  // Werkzeuge — Schraubenschlüssel
  "Werkzeuge": `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M11 2a3 3 0 003.5 4l-9 9L4 13.5l9-9A3 3 0 0011 2z"/>
  </svg>`,

  // Waffen — Fadenkreuz
  "Waffen": `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="8" cy="8" r="5"/>
    <path d="M8 1v3M8 12v3M1 8h3M12 8h3"/>
    <circle cx="8" cy="8" r="1" fill="currentColor"/>
  </svg>`,

  // Sensorik — Auge / Antenne
  "Sensorik": `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z"/>
    <circle cx="8" cy="8" r="2"/>
  </svg>`,

  // Steuerung — Joystick / Konsole
  "Steuerung": `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="9" width="12" height="5" rx="1"/>
    <path d="M8 9V3M5 3h6M6 6h4"/>
  </svg>`,

  // Anzeige — Bildschirm
  "Anzeige": `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
    <rect x="1.5" y="2.5" width="13" height="9" rx="1"/>
    <path d="M5 14h6M8 11.5v2.5"/>
    <path d="M4 5h4M4 7h6"/>
  </svg>`,

  // Komfort — Bett / Couch
  "Komfort": `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M2 8V5h12v3M1 8h14v4H1z"/>
    <path d="M3 12v2M13 12v2"/>
  </svg>`,

  // Custom — Stern / freeform
  "Custom": `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 1.5l1.8 4 4.4.4-3.3 3 1 4.3L8 11l-3.9 2.2 1-4.3-3.3-3 4.4-.4z"/>
  </svg>`
};

function getCategoryIcon(category) {
  return CATEGORY_ICONS[category] || CATEGORY_ICONS["Custom"];
}
