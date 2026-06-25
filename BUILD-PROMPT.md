# Claude Code Prompt — Build the Big Dill Grill website

Copy everything in the fenced block below and paste it into Claude Code, run from the
`big-dill-grill` directory (the same folder that holds `content-brief.md` and `images/`).

This prompt targets the **same tech stack as the `furniture-factory-outlet-world` site** in the
sibling `BusinessSites` directory — **Astro + Tailwind CSS v4**, TypeScript data files, and the same
project conventions — so the two prototypes feel like one consistent body of work.

---

```
You are building a professional prototype website for a real small restaurant, "The Big Dill Grill"
in Kershaw, South Carolina. Today this business only has a Facebook page; this site is being pitched
to the owners as a modern replacement. Build it to impress them.

WORKING DIRECTORY
Work in the current directory. There is a `content-brief.md` file here with all the source content —
READ IT FIRST and treat it as the source of truth for copy, specials, and contact info. There is also
an `images/` folder; READ `images/README.md` to understand which image files may or may not be present.

MATCH THE SIBLING PROJECT
A sibling site lives at `../furniture-factory-outlet-world`. Mirror its stack, structure and conventions
so the two feel built by the same team. Inspect it first (package.json, astro.config.mjs, tsconfig.json,
src/data/site.ts, src/layouts/Layout.astro, a couple of components) and follow the same patterns. Key points:

TECH STACK (match the sibling)
- Astro (^6) as the frontend framework. `"type": "module"`. Scripts: `dev` = `astro dev`,
  `build` = `astro build`, `preview` = `astro preview`.
- Tailwind CSS v4 via the Vite plugin: devDependencies `tailwindcss@^4` and `@tailwindcss/vite@^4`,
  wired in `astro.config.mjs` as `vite: { plugins: [tailwindcss()] }`. Add `compressHTML: true` and a
  `site:` URL (use a placeholder like `https://thebigdillgrill.example` with a `// CONFIRM` note).
  Include `"overrides": { "vite": "7.3.5" }` to match the sibling's lockstep.
- TypeScript with `tsconfig.json` extending `astro/tsconfigs/strict`, plus the same path aliases:
  `@data/*`, `@layouts/*`, `@components/*`, `@assets/*`, `@styles/*` (add `@scripts/*` if you use a scripts dir).
- `.gitignore` with: node_modules/, dist/, .astro/, .DS_Store
- No client framework. Keep interactivity to small vanilla-TS `<script>` islands / files (the sibling
  uses `src/scripts/*.ts`). Mobile-first, fast, statically built.

PROJECT STRUCTURE (match the sibling)
- src/data/site.ts  → SINGLE SOURCE OF TRUTH for identity, copy, contact, hours, SEO, and the specials/menu
  data. Strongly typed exports (interfaces for HoursEntry, a Special, a MenuItem, etc.), just like the
  furniture site's site.ts/inventory.ts. The weekly specials and menu must live here as typed arrays so the
  owner can update them in ONE file.
- src/layouts/Layout.astro → shared <head>: title/description (from site.ts), Open Graph + Twitter tags,
  favicon, Google Fonts preconnect + load, theme-color, and a schema.org JSON-LD block. Use
  `@type: 'Restaurant'` (FoodEstablishment) with name, telephone, address (PostalAddress), geo,
  priceRange ('$$'), hasMap, and `OpeningHoursSpecification` from the hours data. Mirror how the sibling
  builds its FurnitureStore JSON-LD and OG image from an asset.
- src/components/*.astro → Nav, Hero, WeeklySpecials, Menu (or MenuSection), About, VisitBlock
  (contact + map + hours), SiteFooter, plus an ImagePlaceholder.astro and a DemoNotice.astro — directly
  analogous to the sibling's ProductPlaceholder.astro / DemoNotice.astro.
- src/pages/index.astro → the single-page site composed from the components, with smooth-scroll anchor nav.
- src/assets/ → imported images (logo, flyer, food) so Astro can optimize them; public/favicon.svg for the icon.
- src/styles/global.css → Tailwind v4 entry + any base layer / CSS custom properties for the brand palette.
- README.md → how to install & preview (npm install, npm run dev), where the specials/menu data lives,
  and how to drop real photos in.

DATA-PROVENANCE CONVENTION (match the sibling)
Adopt the sibling's honesty markers in comments and copy: tag anything not first-party-confirmed with
`// POC` and/or `// CONFIRM`. In particular: HOURS are NOT published on Facebook — encode a clearly-labeled
placeholder schedule (specials run Mon–Sat, so likely closed Sunday) marked `// POC // CONFIRM`. Don't
invent prices/menu items beyond content-brief.md; where the full menu is unknown, use a clearly-labeled
"full menu coming soon — call us" placeholder.

DESIGN DIRECTION — "best of both" (modern + on-brand)
- Clean, contemporary restaurant layout: generous whitespace, large imagery, confident typography, clear
  hierarchy. Polished and professional, NOT a busy flyer.
- Warm rustic accent palette from the brand: pickle/forest green (primary), barn red (accent),
  cream/parchment section backgrounds, golden yellow highlights, warm wood-brown accents. Define these as
  CSS custom properties / Tailwind v4 theme tokens.
- Pair a clean modern sans-serif for body/UI with one characterful display face for headings (friendly,
  slightly western personality) via Google Fonts, loaded in Layout.astro like the sibling does.
- Subtle, tasteful motion only. Phone-first, scaling up to desktop.

IMAGES — handle gracefully
- Expected files in images/ (may or may not exist): logo.png, weekly-specials.jpg, hero.jpg,
  food-1.jpg, food-2.jpg. Move/import provided images via src/assets for optimization.
- For ANY missing image, render the ImagePlaceholder component (brand-colored block + label or an inline
  pickle/wordmark SVG) so the layout never breaks.
- Use the logo in nav/footer if present; otherwise a styled text wordmark "THE BIG DILL GRILL".

SECTIONS TO BUILD
1. HERO: full-width banner (hero.jpg or branded gradient placeholder). Restaurant name, tagline
   "Where every meal is a 'Big Dill'!", slogan "Good Food. Good People. Good Times.", and two buttons:
   "Call to Order" (tel: link to (803) 272-0357) and "See This Week's Specials" (scrolls to specials).
2. WEEKLY SPECIALS — the centerpiece. Render Mon–Sat specials from site.ts as a clean modern card/board
   in HTML TEXT (don't rely on the flyer image). Most days are $10 — make that value story pop; make
   Friday Steak Night ($22) the visual hero. If weekly-specials.jpg exists, also show it as a tasteful
   framed "this week's flyer." Add a note that specials rotate weekly.
3. MENU: organize the derived menu from the brief (Salads / Sandwiches & Melts / From the Grill) into
   clean cards/columns, with a "Full menu coming soon — call us" placeholder.
4. ABOUT: warm paraphrase of the welcome bio, the "Good Food, Good People, Good Times" ethos, and the
   local Kershaw / Kershaw County community feel.
5. VISIT / CONTACT: address (2894 Lockhart Road, Kershaw, SC 29067), click-to-call phone, an embedded
   Google Map for that address, a clearly-labeled HOURS block ("Hours — please confirm" placeholder), and
   a simple non-functional contact form wired to the DemoNotice pattern (clearly a prototype).
6. FOOTER: logo/wordmark, slogan, phone, address, a link to the existing Facebook page
   (https://www.facebook.com/TheBigDillGrill/), and copyright.

CALL-TO-ORDER / CTA
- A persistent "Call to Order" tel: button in the sticky nav, repeated in hero, specials, and contact.
- On mobile, consider a sticky bottom call bar.

DELIVERABLES & SELF-CHECK
- A working Astro project: package.json, astro.config.mjs, tsconfig.json, .gitignore, public/favicon.svg,
  and the src/ tree above. README.md with preview instructions.
- Run `npm install` then `npm run build` and fix any errors so the project builds clean. Confirm it renders
  sensibly WITH and WITHOUT the images present, and that it's responsive. Report the dev-server command
  (`npm run dev`) for previewing.

Make it look like a site a real restaurant would be proud to launch — and like a sibling of the
furniture-factory-outlet-world build.
```

---

## Notes for whoever runs this
- This now matches the `furniture-factory-outlet-world` stack: **Astro + Tailwind CSS v4 + TypeScript**,
  with a typed `src/data/site.ts` single source of truth and the same `// POC` / `// CONFIRM` provenance
  convention. Preview with `npm install` then `npm run dev`.
- Add the real Facebook images to `images/` first (see `images/README.md`) for the best result — but the
  site is designed to look good even before you do.
- The specials in `content-brief.md` are from the week of June 22–27; swap in the current week before any
  live demo to the owners.
- Double-check the hours and the full menu with the owners — those weren't published on Facebook.
