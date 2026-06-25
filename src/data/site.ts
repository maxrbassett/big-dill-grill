/**
 * Single source of truth for site copy, contact details, hours, specials & menu.
 *
 * Frontend proof-of-concept. The Big Dill Grill currently has only a Facebook
 * page; this site is pitched to the owners as a modern replacement.
 *
 * Provenance convention (mirrors the sibling furniture-factory-outlet-world build):
 * anything NOT first-party-confirmed is tagged `// POC` and/or `// CONFIRM` and must
 * be verified with the owner before launch. Confirmed facts (name, phone, address,
 * the weekly specials transcribed from the flyer, and the HOURS — supplied directly
 * by the owner) carry no marker.
 *
 * To update the site, edit THIS file:
 *   • weeklySpecials[]  → swap in the current week's specials board
 *   • menuSections[]    → expand the menu as items are confirmed
 *   • hours             → adjust the schedule
 * See README.md.
 */

export type DayKey =
  | 'monday' | 'tuesday' | 'wednesday' | 'thursday'
  | 'friday' | 'saturday' | 'sunday';

export interface HoursEntry {
  label: string;
  display: string;
  open: number | null; // minutes from midnight, null = closed
  close: number | null;
}

export interface Special {
  day: string;          // e.g. 'Friday'
  dayShort: string;     // e.g. 'Fri'
  name: string;         // e.g. 'Steak Night'
  description: string;  // what comes with it
  price: string;        // display price, e.g. '$10'
  hero?: boolean;       // the premium / destination special
}

export interface MenuItem {
  name: string;
  description?: string;
}

export interface MenuSection {
  title: string;
  blurb?: string;
  items: MenuItem[];
}

// --- Identity ------------------------------------------------------------------
export const name = 'The Big Dill Grill';
export const shortName = 'Big Dill Grill';

export const tagline = 'Where every meal is a “Big Dill”!';
export const slogan = 'Good Food. Good People. Good Times.';

export const heroEyebrow = 'Casual home-style grill · Kershaw, SC';
export const heroSubhead =
  'Dive into our casual atmosphere with something tasty and wholesome. Our prices are unbeatable, and you won’t leave hungry — or disappointed. We hope to see y’all soon!';

// --- Navigation (root-anchored so links work from any page, incl. /order) ------
export const nav = [
  { label: 'Specials', href: '/#specials' },
  { label: 'Menu', href: '/#menu' },
  { label: 'About', href: '/#about' },
  { label: 'Visit', href: '/#visit' },
];

export const orderUrl = '/order';

// --- Contact / location (confirmed from the business listing) ------------------
export const phone = '(803) 272-0357';
export const phoneTel = '+18032720357';

export const address = {
  street: '2894 Lockhart Road',
  city: 'Kershaw',
  state: 'SC',
  zip: '29067',
};
export const addressOneLine = `${address.street}, ${address.city}, ${address.state} ${address.zip}`;

// POC approximate coordinates for Kershaw, SC. // CONFIRM exact rooftop location
export const geo = { lat: 34.5474, lng: -80.5837 };

const mapQuery = `${name}, ${addressOneLine}`;
export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery)}`;
// Keyless Google Maps embed (no API key required).
export const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;

// The only confirmed web presence today.
export const facebookUrl = 'https://www.facebook.com/TheBigDillGrill/';
export const socialUrl = facebookUrl;

// Service / draw area (from the brief).
export const serviceArea = [
  'Kershaw', 'Lancaster County', 'McBee', 'Cassatt',
  'Bethune', 'Pageland', 'Lugoff', 'Westville',
];

// --- Hours ---------------------------------------------------------------------
// CONFIRMED by the owner: open Mon–Sat 6:00 AM – 8:00 PM, closed Sunday.
export const hours: Record<DayKey, HoursEntry> = {
  monday: { label: 'Monday', display: '6:00 AM – 8:00 PM', open: 360, close: 1200 },
  tuesday: { label: 'Tuesday', display: '6:00 AM – 8:00 PM', open: 360, close: 1200 },
  wednesday: { label: 'Wednesday', display: '6:00 AM – 8:00 PM', open: 360, close: 1200 },
  thursday: { label: 'Thursday', display: '6:00 AM – 8:00 PM', open: 360, close: 1200 },
  friday: { label: 'Friday', display: '6:00 AM – 8:00 PM', open: 360, close: 1200 },
  saturday: { label: 'Saturday', display: '6:00 AM – 8:00 PM', open: 360, close: 1200 },
  sunday: { label: 'Sunday', display: 'Closed', open: null, close: null },
};

export const hoursOrder: DayKey[] = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
];

export const hoursSummary = 'Open Mon–Sat, 6 AM – 8 PM · Closed Sunday';

export const openingHoursSpec = [
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '06:00',
    closes: '20:00',
  },
];

// --- Weekly Specials (the centerpiece) -----------------------------------------
// Transcribed verbatim from the flyer, week of June 22–27. Specials rotate weekly —
// swap these out before any live demo. // CONFIRM each week
export const specialsWeekLabel = 'Week of June 22–27'; // POC // CONFIRM current week
export const weeklySpecials: Special[] = [
  { day: 'Monday', dayShort: 'Mon', name: 'Chef Salad', description: 'Crisp greens piled high with all the fixings.', price: '$10' },
  { day: 'Tuesday', dayShort: 'Tue', name: 'Taco Salad', description: 'Seasoned beef over greens with the works.', price: '$10' },
  { day: 'Wednesday', dayShort: 'Wed', name: '2 Hot Dogs with French Fries', description: 'A pair of dogs and a basket of fries.', price: '$10' },
  { day: 'Thursday', dayShort: 'Thu', name: 'Roast Beef Melt with French Fries', description: 'Hot, hearty roast beef melt with fries.', price: '$10' },
  { day: 'Friday', dayShort: 'Fri', name: 'Steak Night', description: '16 oz ribeye, baked potato & salad.', price: '$22', hero: true },
  { day: 'Saturday', dayShort: 'Sat', name: 'Chicken Philly with French Fries', description: 'Griddled chicken philly with fries.', price: '$10' },
];

export const specialsNote =
  'Specials run Monday–Saturday and rotate every week — call to hear what’s cooking today.';

// --- Menu (derived from the specials; confirm full menu with owner) ------------
// POC: framing derived from the weekly specials. The full regular menu was not
// published on Facebook. // CONFIRM with owner
export const menuSections: MenuSection[] = [
  {
    title: 'Salads',
    blurb: 'Fresh, generous and a meal in themselves.',
    items: [
      { name: 'Chef Salad', description: 'Crisp greens with all the fixings.' },
      { name: 'Taco Salad', description: 'Seasoned beef, greens and crunch.' },
      { name: 'Side Salad', description: 'A garden side to go with any plate.' },
    ],
  },
  {
    title: 'Sandwiches & Melts',
    blurb: 'Hot off the grill, served with fries.',
    items: [
      { name: 'Roast Beef Melt', description: 'Hot roast beef, melted and pressed.' },
      { name: 'Chicken Philly', description: 'Griddled chicken, peppers & onions.' },
      { name: 'Hot Dogs', description: 'Classic dogs — get two with fries.' },
    ],
  },
  {
    title: 'From the Grill',
    blurb: 'Heartier plates and dinner favorites.',
    items: [
      { name: '16 oz Ribeye Steak', description: 'Our Friday Steak Night centerpiece, with baked potato & salad.' },
      { name: 'Sides', description: 'French fries, baked potato, side salad.' },
    ],
  },
];

export const menuPlaceholder =
  'This is a taste of the kitchen — the full menu is coming soon. For today’s complete offerings, give us a call.';

// --- Online ordering (pickup) — PROOF OF CONCEPT -------------------------------
// This powers the /order page + cart. It is a front-end-only DEMO: nothing is
// sent to the restaurant and no payment is taken (see `ordering` notices below).
//
// Pricing provenance:
//   • Weekly-specials prices are CONFIRMED from the flyer (priceConfirmed: true).
//   • Every other price is a clearly-labeled PLACEHOLDER (priceConfirmed: false) // POC // CONFIRM
export interface OrderItem {
  id: string;                 // stable slug, used as the cart key
  name: string;
  description?: string;
  price: number;              // US dollars
  priceConfirmed: boolean;    // false => placeholder price // POC
  tag?: string;               // small badge, e.g. 'Friday'
}

export interface OrderCategory {
  id: string;
  title: string;
  blurb?: string;
  items: OrderItem[];
}

export const orderMenu: OrderCategory[] = [
  {
    id: 'specials',
    title: 'Weekly Specials',
    blurb: 'Offered on their day, Mon–Sat. Prices confirmed from this week’s flyer.',
    items: [
      { id: 'chef-salad', name: 'Chef Salad', description: 'Crisp greens piled high with all the fixings.', price: 10, priceConfirmed: true, tag: 'Monday' },
      { id: 'taco-salad', name: 'Taco Salad', description: 'Seasoned beef over greens with the works.', price: 10, priceConfirmed: true, tag: 'Tuesday' },
      { id: 'two-hot-dogs', name: '2 Hot Dogs with Fries', description: 'A pair of dogs and a basket of fries.', price: 10, priceConfirmed: true, tag: 'Wednesday' },
      { id: 'roast-beef-melt-special', name: 'Roast Beef Melt with Fries', description: 'Hot, hearty roast beef melt with fries.', price: 10, priceConfirmed: true, tag: 'Thursday' },
      { id: 'steak-night', name: 'Steak Night', description: '16 oz ribeye, baked potato & salad.', price: 22, priceConfirmed: true, tag: 'Friday' },
      { id: 'chicken-philly-special', name: 'Chicken Philly with Fries', description: 'Griddled chicken philly with fries.', price: 10, priceConfirmed: true, tag: 'Saturday' },
    ],
  },
  {
    id: 'sandwiches',
    title: 'Sandwiches & Melts',
    blurb: 'Hot off the grill. Served à la carte — add fries below.',
    items: [
      { id: 'cheeseburger', name: 'Cheeseburger', description: 'Griddled all-beef patty with melted cheese.', price: 8, priceConfirmed: false },
      { id: 'hamburger', name: 'Hamburger', description: 'Classic all-beef patty, dressed your way.', price: 7.5, priceConfirmed: false },
      { id: 'roast-beef-melt', name: 'Roast Beef Melt', description: 'Hot, pressed roast beef melt.', price: 8.5, priceConfirmed: false },
      { id: 'chicken-philly', name: 'Chicken Philly', description: 'Griddled chicken, peppers & onions.', price: 8.5, priceConfirmed: false },
      { id: 'hot-dog', name: 'Hot Dog', description: 'A classic dog with your toppings.', price: 3.5, priceConfirmed: false },
    ],
  },
  {
    id: 'salads',
    title: 'Salads',
    blurb: 'Fresh and generous.',
    items: [
      { id: 'garden-salad', name: 'Garden Salad', description: 'Fresh greens, tomato & cucumber.', price: 6, priceConfirmed: false },
    ],
  },
  {
    id: 'sides',
    title: 'Sides',
    items: [
      { id: 'fries', name: 'French Fries', description: 'Hot, crispy basket of fries.', price: 3, priceConfirmed: false },
      { id: 'baked-potato', name: 'Baked Potato', description: 'Loaded the way you like it.', price: 3.5, priceConfirmed: false },
      { id: 'mac-cheese', name: 'Mac & Cheese', description: 'Creamy, classic comfort.', price: 4, priceConfirmed: false },
      { id: 'side-salad', name: 'Side Salad', description: 'A garden side for any plate.', price: 4, priceConfirmed: false },
    ],
  },
  {
    id: 'drinks',
    title: 'Drinks',
    items: [
      { id: 'fountain-drink', name: 'Fountain Drink', description: 'Coke products.', price: 2.25, priceConfirmed: false },
      { id: 'sweet-tea', name: 'Sweet Tea', description: 'A Southern staple.', price: 2.25, priceConfirmed: false },
      { id: 'bottled-water', name: 'Bottled Water', price: 1.5, priceConfirmed: false },
    ],
  },
];

export const ordering = {
  prepMinutes: 25,            // POC pickup ETA for "as soon as possible"
  payAtPickup: true,
  openMinutes: hours.monday.open ?? 360,   // 6:00 AM — pickup window start
  closeMinutes: hours.monday.close ?? 1200, // 8:00 PM — pickup window end
  // Shown prominently on the /order page so no one mistakes this for a live system.
  notice:
    'This online ordering is a website preview. Orders placed here are NOT sent to the restaurant and no payment is taken — it’s here to show how pickup ordering would work. To place a real order today, please call us.', // POC
  // Shown on the confirmation screen.
  confirmationNote:
    'This is a preview confirmation — your order was not actually sent and no payment was taken. In the live version the kitchen would receive this order and you’d pay when you pick up.', // POC
};

// --- About ---------------------------------------------------------------------
export const about = {
  heading: 'Welcome to the table',
  body: [
    'The Big Dill Grill is a casual, down-home grill in Kershaw, South Carolina, where every meal is a “Big Dill.” Pull up a chair, settle into the easy atmosphere, and try something tasty and wholesome.',
    'Our prices are unbeatable and the portions are honest — you won’t leave hungry or disappointed. Most weekday specials are a flat $10, and Friday means Steak Night.',
    'More than the food, it’s about the people: Good Food, Good People, Good Times. We’re proud to serve Kershaw and the surrounding Kershaw County community, and we hope to see y’all soon.',
  ],
  ethosPoints: [
    { label: 'Good Food', blurb: 'Tasty, wholesome and made to fill you up.' },
    { label: 'Good People', blurb: 'A warm, friendly welcome every visit.' },
    { label: 'Good Times', blurb: 'A laid-back spot the whole community loves.' },
  ],
};

// --- Demo notice (non-functional prototype actions) ----------------------------
export const demoNotice = {
  title: 'Demo — feature coming soon',
  body:
    'This is a preview site, so this form isn’t connected yet. In the live version your message would reach the restaurant directly. For now, the fastest way to reach us is to give us a call.', // POC
};

// --- SEO -----------------------------------------------------------------------
export const seo = {
  title: 'The Big Dill Grill | Casual Grill & Daily Specials in Kershaw, SC',
  description:
    'The Big Dill Grill in Kershaw, SC — a casual home-style grill with $10 daily specials Mon–Sat, Friday Steak Night, salads, melts and more. Good Food. Good People. Good Times. Call (803) 272-0357.',
  priceRange: '$$',
  ogAlt: 'The Big Dill Grill — pickle-cowboy mascot with the slogan “Good Food. Good People. Good Times.”',
};
