// Converts the Higgsfield source renders in production/ into web-ready WebP files in assets/img/.
// Run: npm run images
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "assets", "img");

// [source, output name, widths[], quality]
const JOBS = [
  // Flight stills (used by the provisional still-frame flight and the reduced-motion fallback)
  ["production/stills/01-start-A-fixed-1920.png", "flight/01-exterieur", [2048, 1280], 78],
  ["production/stills/02-salle.png", "flight/02-salle", [2048, 1280], 78],
  ["production/stills/03-cuisine.png", "flight/03-cuisine", [2048, 1280], 78],
  ["production/stills/04-garde-manger.png", "flight/04-garde-manger", [2048, 1280], 78],
  ["production/stills/05-reveal-aerien.png", "flight/05-aerien", [2048, 1280], 78],
  ["production/stills/06-reveal-reference.png", "flight/06-aerien-arriere", [2048, 1280], 78],
  // Content photography
  ["production/food/burger-signature.png", "burger-signature", [1200, 720], 80],
  ["production/food/table-partage.png", "table-partage", [1200, 720], 80],
  ["production/stills/alt-terrasse-serveur.png", "terrasse", [1600, 960], 78],
  ["production/stills/alt-facade-vague.png", "facade-soir", [1600, 960], 78],
  // Start-still options (style tile only)
  ["production/stills/01-start-B-bluehour.png", "options/start-B", [960], 72],
  ["production/stills/01-start-C-tropical.png", "options/start-C", [960], 72],
  ["production/stills/01-start-A-fixed.png", "options/start-A", [960], 72],
];

let total = 0;
for (const [src, name, widths, q] of JOBS) {
  const input = path.join(ROOT, src);
  if (!fs.existsSync(input)) { console.warn("missing", src); continue; }
  for (const w of widths) {
    const out = path.join(OUT, `${name}-${w}.webp`);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    const info = await sharp(input).resize({ width: w, withoutEnlargement: true }).webp({ quality: q, effort: 5 }).toFile(out);
    total += info.size;
    console.log(`${path.relative(ROOT, out)}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
  }
}
// Poster for the flight stage (first frame), small enough to be the LCP image.
const poster = await sharp(path.join(ROOT, "production/stills/01-start-A-fixed-1920.png"))
  .resize({ width: 1280 }).jpeg({ quality: 74, progressive: true, mozjpeg: true })
  .toFile(path.join(OUT, "flight/poster.jpg"));
total += poster.size;
console.log(`assets/img/flight/poster.jpg  ${(poster.size / 1024).toFixed(0)} KB`);
console.log(`total ${(total / 1024 / 1024).toFixed(2)} MB`);
