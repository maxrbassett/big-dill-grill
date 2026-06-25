# The Big Dill Grill — website

A fast, mobile-first prototype site for **The Big Dill Grill** in Kershaw, South Carolina —
pitched to the owners as a modern replacement for their Facebook page.

> _Where every meal is a "Big Dill"! · Good Food. Good People. Good Times._

Built with **Astro 6 + Tailwind CSS v4 + TypeScript**, matching the sibling
`furniture-factory-outlet-world` build. Statically rendered, no client framework —
just a couple of tiny vanilla-TS `<script>` islands for the mobile menu, the demo
form modal, and highlighting today's hours.

## Run it

```bash
npm install
npm run dev      # local dev server (Vite) — http://localhost:4321
npm run build    # production build to dist/
npm run preview  # preview the production build
```

## Where the content lives

**Everything the owner needs to edit is in one file: [`src/data/site.ts`](src/data/site.ts).**
It's the single, typed source of truth for identity, contact info, hours, SEO, and —
most importantly — the **weekly specials** and **menu**:

- `weeklySpecials[]` — the Mon–Sat specials board. Swap these out each week before a demo.
  Set `hero: true` on the premium special (currently Friday Steak Night) to feature it.
- `specialsWeekLabel` — the "Week of …" badge shown above the board.
- `menuSections[]` — the Salads / Sandwiches & Melts / From the Grill cards.
- `hours` — the weekly schedule (**confirmed: Mon–Sat 6 AM–8 PM, closed Sunday**).

Change the data, and the homepage, the schema.org JSON-LD, and the share preview all update.

## Photos

Real photos now live in [`src/assets/`](src/assets/), imported and optimized by Astro
(`astro:assets` `<Image>` → WebP, responsive `srcset`):

- `logo-badge.jpg` — the restaurant's real "Big Dill Restaurant Grill" crest (the sign on
  the building). Used as the primary logo in the nav, the framed hero showpiece, and the footer.
- `mascot.png` — the standalone pickle-cowboy mascot. Featured as a framed sticker in the About section.
- `storefront.jpg` — the storefront photo, enhanced (upscaled + denoised + sharpened) and used as
  the faded background behind the hero.

Still using brand-colored placeholders (drop in a real photo + import it to replace):

- **Weekly specials flyer** — `WeeklySpecials.astro` shows a framed `<ImagePlaceholder variant="flyer">`.
  Add `weekly-specials.jpg` to `src/assets`, import it, and set `hasFlyerImage = true`.

The specials board is rendered as live HTML text, so it never depends on the flyer image.
The layout is designed to look finished **with or without** any given photo.

## Online ordering (pickup) — proof of concept

There's a working pickup-ordering flow on the **[`/order`](src/pages/order.astro)** page: browse the
menu → add to a cart drawer → enter pickup details → review → on-screen confirmation with an order number.

**It is intentionally front-end only.** The cart lives in `localStorage`; "placing" an order just renders
a confirmation — **nothing is sent to the restaurant and no payment is taken.** Honest "Preview" notices
say so throughout. In a live build this would post to a real order system (e.g. Square/Toast) or the kitchen.

- **Menu & prices:** [`src/data/site.ts`](src/data/site.ts) → `orderMenu` (typed categories + items).
  Weekly-special prices are confirmed from the flyer (`priceConfirmed: true`); everything else is a
  clearly-labeled placeholder (`priceConfirmed: false`) shown with a "preview price" badge. Update prices here.
- **Behavior:** `ordering` config in `site.ts` (prep time / pickup ETA, pickup window, the POC notices).
- **Cart logic:** [`src/scripts/order.ts`](src/scripts/order.ts) — vanilla TS, no framework.
- **UI:** `OrderMenu.astro` (menu + Add buttons) and `CartDrawer.astro` (the slide-out cart + checkout steps),
  included on every page so the nav cart button works site-wide. Deep link `/order#cart` opens the cart.

## Data provenance — read before launch

This is a proof-of-concept built from the restaurant's public Facebook page. Anything not
confirmed first-party is tagged `// POC` and/or `// CONFIRM` in `site.ts`. Before going live:

- **Specials** rotate weekly — the ones here are the week of June 22–27. Swap in the current week.
- **Full menu** is derived from the specials; confirm the real menu and prices with the owner.
- **Online-order prices** marked "preview price" are placeholders — confirm before enabling real ordering.
- **Domain** (`astro.config.mjs`) and **map coordinates** are placeholders — confirm.
- Hours **are** confirmed (Mon–Sat 6 AM–8 PM, closed Sunday).

## Structure

```
src/
  data/site.ts          ← single source of truth (edit me)
  layouts/Layout.astro  ← <head>, fonts, OG/Twitter, Restaurant JSON-LD
  components/            ← Nav, Hero, WeeklySpecials, Menu, About, VisitBlock,
                           SiteFooter, CallBar, Mascot, ImagePlaceholder, DemoNotice
  pages/index.astro     ← the single page, composed from the components
  styles/global.css     ← Tailwind v4 entry + brand design tokens
  assets/               ← imported/optimized images + OG placeholder
public/favicon.svg      ← pickle-cowboy mascot icon
```
