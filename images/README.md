# Images for the Big Dill Grill site

I was not able to programmatically download the original photos from Facebook.
Facebook serves these images cross-origin, which (1) makes the browser refuse to
let any script read the pixel data ("tainted canvas"), and (2) the signed image
URLs are redacted by the tooling. So the real JPEGs need to be added here manually.
It takes about a minute.

## How to grab the real images from Facebook
1. Open https://www.facebook.com/TheBigDillGrill/
2. Click an image to open it full-size (logo, the weekly specials flyer, food/cover photos).
3. Right-click the image → **Save image as…** → save into THIS folder.
4. Suggested filenames (the build prompt expects these):
   - `logo.png`            — the round pickle-cowboy logo badge
   - `weekly-specials.jpg` — the current week's specials flyer
   - `hero.jpg`            — a good food or storefront/cover photo for the homepage banner
   - `food-1.jpg`, `food-2.jpg`, … — any additional food shots

## If you don't add real images
The website is built to degrade gracefully:
- Missing photos fall back to styled placeholder blocks (brand colors + mascot-green).
- The weekly specials are ALSO rendered as live HTML text (not just the flyer image),
  so the specials board works perfectly even with no flyer image present.
