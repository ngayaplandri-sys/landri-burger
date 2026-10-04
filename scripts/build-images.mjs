// Convertit les rendus Higgsfield de production/ en WebP pour le web (assets/img/).
// Run: npm run images
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "assets", "img");
// Sources en .jpg (ou .png pour une nouvelle génération pas encore convertie)
const P = (f) => {
  const p = path.join(ROOT, "production", f);
  if (fs.existsSync(p)) return p;
  return p.endsWith(".png") ? p.replace(/\.png$/, ".jpg") : p.replace(/\.jpg$/, ".png");
};

// [source, nom de sortie, largeurs, qualité]
const JOBS = [
  // Images des chapitres du vol (mode fixe et vol de secours) + galerie
  ["stills/start-2-1920.png", "flight/arrivee", [2048, 1280], 78],
  ["stills/ch-salle.png", "flight/salle", [2048, 1280], 78],
  ["stills/ch-cuisine.png", "flight/cuisine", [2048, 1280], 78],
  ["sections/ch-ingredients.png", "flight/ingredients", [2048, 1280], 78],
  ["sections/ch-dressage.png", "flight/dressage", [2048, 1280], 78],
  ["sections/ch-plat.png", "flight/plat", [2048, 1280], 78],
  ["sections/ch-service.png", "flight/service", [2048, 1280], 78],
  ["stills/ch-ambiance.png", "flight/ambiance", [2048, 1280], 78],
  // Sections
  ["sections/chef-portrait.png", "sections/chef-portrait", [1200, 720], 80],
  ["sections/chef-geste.png", "sections/chef-geste", [1600, 960], 80],
  ["sections/origine-centrale.png", "sections/origine-centrale", [1200, 720], 80],
  ["sections/origine-ouest.png", "sections/origine-ouest", [1200, 720], 80],
  ["sections/origine-est.png", "sections/origine-est", [1200, 720], 80],
  ["sections/origine-nord.png", "sections/origine-nord", [1200, 720], 80],
  ["sections/origine-australe.png", "sections/origine-australe", [1200, 720], 80],
  ["sections/experience-musique.png", "sections/experience-musique", [1600, 960], 80],
  ["sections/experience-decor.png", "sections/experience-decor", [1600, 960], 80],
  ["sections/evenement-diner.png", "sections/evenement-diner", [1600, 960], 80],
  ["sections/evenement-terrasse.png", "sections/evenement-terrasse", [1600, 960], 80],
];
// Carte : photos recadrées sur l'assiette (production/menu-crop/<id>.jpg)
for (const f of fs.readdirSync(path.join(ROOT, "production", "menu-crop")).filter((f) => /\.(png|jpg)$/.test(f))) {
  JOBS.push([`menu-crop/${f}`, `menu/${f.replace(/\.(png|jpg)$/, "")}`, [1200, 640], 80]);
}

let total = 0;
for (const [src, name, widths, q] of JOBS) {
  const input = P(src);
  if (!fs.existsSync(input)) { console.warn("manquant :", src); continue; }
  for (const w of widths) {
    const out = path.join(OUT, `${name}-${w}.webp`);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    const info = await sharp(input).resize({ width: w, withoutEnlargement: true }).webp({ quality: q, effort: 5 }).toFile(out);
    total += info.size;
  }
}
// Affiche du vol (remplacée par la première image du film par `npm run frames`)
const poster = await sharp(P("stills/start-2-1920.png")).resize({ width: 1280 }).jpeg({ quality: 76, progressive: true, mozjpeg: true }).toFile(path.join(OUT, "flight/poster.jpg"));
total += poster.size;
console.log(`${JOBS.length} images, total ${(total / 1024 / 1024).toFixed(2)} Mo`);
