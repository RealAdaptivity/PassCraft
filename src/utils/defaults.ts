import { ApplePassData, TemplatePreset } from '../types/pass';

export const DEFAULT_PASS: ApplePassData = {
  id: 'pass_default_01',
  formatVersion: 1,
  passTypeIdentifier: 'pass.com.passcraft.eventpass',
  serialNumber: 'PASS-98234-X7',
  teamIdentifier: '68QFVQ738K',
  organizationName: 'NEON WAVE PRODUCTIONS',
  description: 'Neon Wave Music Festival VIP Pass',
  logoText: 'NEON WAVE 2026',
  passType: 'eventTicket',
  title: 'Neon Wave VIP Pass',
  
  backgroundColor: '#0f172a', // Deep slate navy
  foregroundColor: '#ffffff', // Crisp white text
  labelColor: '#38bdf8',       // Vibrant sky blue labels
  
  headerFields: [
    { id: 'h1', key: 'gate', label: 'GATE', value: 'MAIN VIP' }
  ],
  primaryFields: [
    { id: 'p1', key: 'event', label: 'EVENT', value: 'NEON FESTIVAL' }
  ],
  secondaryFields: [
    { id: 's1', key: 'holder', label: 'PASS HOLDER', value: 'ALEX R. MORGAN' },
    { id: 's2', key: 'tier', label: 'ACCESS LEVEL', value: 'VIP ALL ACCESS' }
  ],
  auxiliaryFields: [
    { id: 'a1', key: 'date', label: 'DATE', value: 'AUG 15-17' },
    { id: 'a2', key: 'section', label: 'SECTION', value: 'STAGE A / LOUNGE' }
  ],
  backFields: [
    { id: 'b1', key: 'terms', label: 'TERMS & CONDITIONS', value: 'This digital pass grants entry to Neon Wave Festival grounds. Non-transferable without registration. Scan barcode at any VIP entrance.' },
    { id: 'b2', key: 'contact', label: 'SUPPORT EMAIL', value: 'vip-support@neonwavefest.com' },
    { id: 'b3', key: 'website', label: 'OFFICIAL WEBSITE', value: 'https://neonwavefest.com/pass-info' }
  ],
  
  barcode: {
    message: 'https://passcraft.app/verify/NW2026-VIP-98234',
    format: 'PKBarcodeFormatQR',
    altText: 'NW-VIP-98234',
    messageEncoding: 'iso-8859-1'
  },
  
  createdAt: Date.now(),
  updatedAt: Date.now()
};

export const TEMPLATE_PRESETS: TemplatePreset[] = [
  {
    id: 'festival_vip',
    name: 'Music Festival VIP',
    description: 'Electric dark theme for concert tickets, festivals, and VIP guest passes.',
    category: 'Event Ticket',
    badgeText: 'Popular',
    passData: {
      passType: 'eventTicket',
      organizationName: 'AURA MUSIC GROUP',
      logoText: 'AURA FESTIVAL',
      title: 'Aura VIP Pass',
      backgroundColor: '#090d16',
      foregroundColor: '#ffffff',
      labelColor: '#a855f7', // Electric purple
      headerFields: [{ id: 'h1', key: 'door', label: 'DOOR', value: 'VIP 02' }],
      primaryFields: [{ id: 'p1', key: 'artist', label: 'HEADLINER', value: 'CYBER NIGHTS' }],
      secondaryFields: [
        { id: 's1', key: 'guest', label: 'GUEST NAME', value: 'JORDAN LEE' },
        { id: 's2', key: 'tier', label: 'TIER', value: 'BACKSTAGE + VIP' }
      ],
      auxiliaryFields: [
        { id: 'a1', key: 'date', label: 'DATE', value: 'SEP 20, 2026' },
        { id: 'a2', key: 'venue', label: 'VENUE', value: 'METRO DOME' }
      ],
      barcode: {
        message: 'https://aurafest.com/verify/TKT-884920',
        format: 'PKBarcodeFormatQR',
        altText: 'TKT-884920',
        messageEncoding: 'iso-8859-1'
      }
    }
  },
  {
    id: 'airline_boarding',
    name: 'Skyline Airways Boarding Pass',
    description: 'Crisp aviation pass layout for flight tickets with gate and seat info.',
    category: 'Boarding Pass',
    badgeText: 'Aviation',
    passData: {
      passType: 'boardingPass',
      organizationName: 'SKYLINE AIRWAYS',
      logoText: 'SKYLINE AIR',
      title: 'Skyline Boarding Pass',
      transitType: 'PKTransitTypeAir',
      backgroundColor: '#0369a1', // Sky blue gradient
      foregroundColor: '#ffffff',
      labelColor: '#e0f2fe',
      headerFields: [{ id: 'h1', key: 'flight', label: 'FLIGHT', value: 'SA-402' }],
      primaryFields: [
        { id: 'p1', key: 'from', label: 'JFK', value: 'NEW YORK' },
        { id: 'p2', key: 'to', label: 'LHR', value: 'LONDON' }
      ],
      secondaryFields: [
        { id: 's1', key: 'passenger', label: 'PASSENGER', value: 'SARAH CONNOR' },
        { id: 's2', key: 'class', label: 'CLASS', value: 'BUSINESS' }
      ],
      auxiliaryFields: [
        { id: 'a1', key: 'gate', label: 'GATE', value: 'B24' },
        { id: 'a2', key: 'seat', label: 'SEAT', value: '04A' },
        { id: 'a3', key: 'boarding', label: 'BOARDING', value: '08:45 AM' }
      ],
      barcode: {
        message: 'M1CONNOR/SARAH       ESA402 JFKLHR 04A 0845',
        format: 'PKBarcodeFormatPDF417',
        altText: 'BOARDING-PASS-SA402',
        messageEncoding: 'iso-8859-1'
      }
    }
  },
  {
    id: 'coffee_rewards',
    name: 'Artisan Coffee Loyalty Card',
    description: 'Sleek store card for cafe rewards, membership points, and free coffee credits.',
    category: 'Store Card',
    badgeText: 'Loyalty',
    passData: {
      passType: 'storeCard',
      organizationName: 'ROAST & BEAN COFFEE',
      logoText: 'ROAST & BEAN',
      title: 'Coffee Gold Club Card',
      backgroundColor: '#271c19', // Warm espresso dark
      foregroundColor: '#fde047', // Warm gold accent
      labelColor: '#d97706',       // Amber label
      headerFields: [{ id: 'h1', key: 'stamps', label: 'BEANS', value: '8/10 ☕' }],
      primaryFields: [{ id: 'p1', key: 'status', label: 'TIER', value: 'GOLD MEMBER' }],
      secondaryFields: [
        { id: 's1', key: 'member', label: 'MEMBER', value: 'MARCUS VANCE' },
        { id: 's2', key: 'balance', label: 'STORE CREDIT', value: '$24.50' }
      ],
      auxiliaryFields: [
        { id: 'a1', key: 'perk', label: 'NEXT FREE ITEM', value: 'ANY OAT LATTE' }
      ],
      barcode: {
        message: 'CARD-RB-889204192',
        format: 'PKBarcodeFormatQR',
        altText: 'CARD-889204192',
        messageEncoding: 'iso-8859-1'
      }
    }
  },
  {
    id: 'retail_coupon',
    name: 'Flash Sale 20% OFF Coupon',
    description: 'Eye-catching promotional coupon for retail discounts and instant redemption.',
    category: 'Coupon',
    badgeText: 'Discount',
    passData: {
      passType: 'coupon',
      organizationName: 'LUMEN BOUTIQUE',
      logoText: 'LUMEN STORE',
      title: '20% OFF Summer Coupon',
      backgroundColor: '#be123c', // Vibrant ruby red
      foregroundColor: '#ffffff',
      labelColor: '#fecdd3',
      headerFields: [{ id: 'h1', key: 'code', label: 'CODE', value: 'SUMMER20' }],
      primaryFields: [{ id: 'p1', key: 'offer', label: 'DISCOUNT', value: '20% OFF EVERYTHING' }],
      secondaryFields: [
        { id: 's1', key: 'min', label: 'MINIMUM SPEND', value: '$50.00' },
        { id: 's2', key: 'valid', label: 'EXPIRES', value: 'AUG 31, 2026' }
      ],
      auxiliaryFields: [
        { id: 'a1', key: 'store', label: 'REDEMPTION', value: 'IN-STORE & ONLINE' }
      ],
      barcode: {
        message: 'PROMO-SUMMER20-LUMEN-99',
        format: 'PKBarcodeFormatCode128',
        altText: 'SUMMER20-OFF',
        messageEncoding: 'iso-8859-1'
      }
    }
  },
  {
    id: 'tech_conf_badge',
    name: 'DevCon 2026 Tech Badge',
    description: 'Modern developer conference badge with speaker/attendee role and Wi-Fi access.',
    category: 'Generic Pass',
    badgeText: 'Conference',
    passData: {
      passType: 'generic',
      organizationName: 'DEVCON GLOBAL 2026',
      logoText: 'DEVCON 2026',
      title: 'DevCon Attendee Pass',
      backgroundColor: '#0f766e', // Teal emerald
      foregroundColor: '#ffffff',
      labelColor: '#99f6e4',
      headerFields: [{ id: 'h1', key: 'role', label: 'ROLE', value: 'SPEAKER' }],
      primaryFields: [{ id: 'p1', key: 'name', label: 'ATTENDEE', value: 'DR. ELENA ROSTOVA' }],
      secondaryFields: [
        { id: 's1', key: 'company', label: 'ORGANIZATION', value: 'NEURAL LABS AI' },
        { id: 's2', key: 'track', label: 'TRACK', value: 'AI & SYSTEM DESIGN' }
      ],
      auxiliaryFields: [
        { id: 'a1', key: 'wifi', label: 'VENUE WI-FI', value: 'DevCon_FastPass' },
        { id: 'a2', key: 'key', label: 'PASSCODE', value: 'dev-99421' }
      ],
      barcode: {
        message: 'https://devcon.io/badge/SPEAKER-ELENA-ROSTOVA-2026',
        format: 'PKBarcodeFormatQR',
        altText: 'DEVCON-SPK-9012',
        messageEncoding: 'iso-8859-1'
      }
    }
  },
  {
    id: 'drb_employee_card',
    name: 'DRB Employee Security Card',
    description: 'DRB Systems / Patheon Car Wash POS & Kiosk security badge with % barcode prefix.',
    category: 'Security Card',
    badgeText: 'DRB Systems',
    passData: {
      passType: 'generic',
      organizationName: 'DRB PATHEON SECURITY',
      logoText: 'DRB SECURITY',
      title: 'DRB Employee Security Card',
      backgroundColor: '#1e293b', // Sleek slate dark badge color
      foregroundColor: '#ffffff',
      labelColor: '#38bdf8',       // Crisp blue label
      headerFields: [{ id: 'h1', key: 'loc', label: 'STATION', value: 'OM3077' }],
      primaryFields: [{ id: 'p1', key: 'card', label: 'CARD TYPE', value: 'Employee Security Card' }],
      secondaryFields: [
        { id: 's1', key: 'access', label: 'PERMISSIONS', value: 'POS & Kiosk Access' },
        { id: 's2', key: 'batch', label: 'CODE BATCH', value: 'Security Codes 082725' }
      ],
      auxiliaryFields: [
        { id: 'a1', key: 'system', label: 'SYSTEM', value: 'DRB Patheon Kiosk' }
      ],
      backFields: [
        { id: 'b1', key: 'usage', label: 'USAGE INSTRUCTIONS', value: 'Present QR Code to DRB kiosk camera or POS scanner to unlock terminal session.' },
        { id: 'b2', key: 'support', label: 'SYSTEM ADMIN', value: 'Contact Patheon Administrator if card fails to scan.' }
      ],
      barcode: {
        message: '%XT2PPC16F',
        format: 'PKBarcodeFormatQR',
        altText: '%XT2PPC16F',
        messageEncoding: 'iso-8859-1'
      }
    }
  }
];
