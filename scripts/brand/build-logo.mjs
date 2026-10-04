// LANDRI, African Fine Dining : génère les masters vectoriels du logo (texte vectorisé, aucune police requise).
// Prérequis (outil de production) : npm i -D opentype.js@1.3.4 @fontsource/cormorant-garamond @fontsource/hanken-grotesk sharp
// Usage : node scripts/brand/build-logo.mjs <dossier-de-sortie> [dossier node_modules]
import opentype from "opentype.js";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const OUT = process.argv[2] || "assets/brand";
const NM = process.argv[3] || "node_modules";
fs.mkdirSync(OUT, { recursive: true });
const load = (f) => { const b = fs.readFileSync(path.join(NM, f)); return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)); };
const serif = load("@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff");
const sans = load("@fontsource/hanken-grotesk/files/hanken-grotesk-latin-600-normal.woff");

// Mot vectorisé, glyphe par glyphe ; tracking en em.
function word(font, text, size, tracking = 0) {
  let x = 0; const parts = []; let top = Infinity, bottom = -Infinity;
  const glyphs = [...text].map((ch) => font.charToGlyph(ch));
  glyphs.forEach((g, i) => {
    parts.push(g.getPath(x, 0, size).toPathData(2));
    const bb = g.getPath(0, 0, size).getBoundingBox();
    if (isFinite(bb.y1)) { top = Math.min(top, bb.y1); bottom = Math.max(bottom, bb.y2); }
    const kern = i < glyphs.length - 1 ? (font.getKerningValue(g, glyphs[i + 1]) / font.unitsPerEm) * size : 0;
    x += (g.advanceWidth / font.unitsPerEm) * size + kern + (i < glyphs.length - 1 ? tracking * size : 0);
  });
  return { d: parts.join(""), width: x, top, bottom };
}

// Symbole : losange ajouré et graine géométrique (motif textile d'Afrique centrale, épuré). Boîte 100 x 100.
const dia = (cx, cy, r) => `M${cx},${cy - r}L${cx + r},${cy}L${cx},${cy + r}L${cx - r},${cy}Z`;
const markD = dia(50, 50, 48) + dia(50, 50, 42.5) + dia(50, 50, 12) + dia(50, 23, 5.5) + dia(77, 50, 5.5) + dia(50, 77, 5.5) + dia(23, 50, 5.5);
const mark = (tx, ty, s) => `<path fill-rule="evenodd" transform="translate(${tx} ${ty}) scale(${s})" d="${markD}"/>`;
const svg = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w.toFixed(1)} ${h.toFixed(1)}" role="img" aria-label="LANDRI, African Fine Dining"><title>LANDRI, African Fine Dining</title><g fill="currentColor">${body}</g></svg>\n`;

// 1) Version empilée
{
  const L = word(serif, "LANDRI", 120, 0.14);
  const S = word(sans, "AFRICAN FINE DINING", 26, 0.42);
  const W = Math.max(L.width, S.width) + 40, mS = 1.1, mW = 100 * mS;
  const lBase = 20 + mW + 34 - L.top, sBase = lBase + L.bottom + 30 - S.top, H = sBase + S.bottom + 20;
  const body = mark((W - mW) / 2, 20, mS) +
    `<path transform="translate(${((W - L.width) / 2).toFixed(1)} ${lBase.toFixed(1)})" d="${L.d}"/>` +
    `<path transform="translate(${((W - S.width) / 2).toFixed(1)} ${sBase.toFixed(1)})" d="${S.d}"/>`;
  fs.writeFileSync(path.join(OUT, "landri-logo-stacked.svg"), svg(W, H, body));
}
// 2) Version horizontale (en-tête)
{
  const L = word(serif, "LANDRI", 100, 0.12);
  const S = word(sans, "AFRICAN FINE DINING", 20.5, 0.4);
  const mS = 0.86, mW = 100 * mS, gap = 24, textW = Math.max(L.width, S.width);
  const lBase = -L.top, sBase = lBase + L.bottom + 12 - S.top, textH = sBase + S.bottom, H = Math.max(textH, mW), W = mW + gap + textW;
  const ty = (H - textH) / 2;
  const body = mark(0, (H - mW) / 2, mS) +
    `<path transform="translate(${(mW + gap).toFixed(1)} ${(ty + lBase).toFixed(1)})" d="${L.d}"/>` +
    `<path transform="translate(${(mW + gap + (L.width - S.width) / 2).toFixed(1)} ${(ty + sBase).toFixed(1)})" d="${S.d}"/>`;
  fs.writeFileSync(path.join(OUT, "landri-logo-horizontal.svg"), svg(W, H, body));
}
// 3) Symbole seul
fs.writeFileSync(path.join(OUT, "landri-mark.svg"), svg(100, 100, mark(0, 0, 1)));

// Variantes de couleur pour <img>
const COLORS = { ivory: "#F2EBDD", gold: "#C9A35B", ink: "#0D0B09", terracotta: "#B4532A" };
for (const base of ["landri-logo-stacked", "landri-logo-horizontal", "landri-mark"]) {
  const s = fs.readFileSync(path.join(OUT, base + ".svg"), "utf8");
  for (const [n, hex] of Object.entries(COLORS)) fs.writeFileSync(path.join(OUT, `${base}-${n}.svg`), s.replace('fill="currentColor"', `fill="${hex}"`));
}
// Icônes
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" rx="56" fill="#3B2418"/><g fill="#C9A35B">${mark(48, 48, 1.6)}</g></svg>\n`;
fs.writeFileSync(path.join(OUT, "favicon.svg"), icon);
await sharp(Buffer.from(icon)).resize(512, 512).png().toFile(path.join(OUT, "icon-512.png"));
await sharp(Buffer.from(icon)).resize(180, 180).png().toFile(path.join(OUT, "apple-touch-icon.png"));
// Aperçus
for (const [name, fg, bg] of [["preview-on-ink", "#F2EBDD", "#0D0B09"], ["preview-on-chocolate", "#C9A35B", "#3B2418"]]) {
  const s = fs.readFileSync(path.join(OUT, "landri-logo-stacked.svg"), "utf8").replace('fill="currentColor"', `fill="${fg}"`);
  const [, w, h] = s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).map(Number);
  const inner = s.replace("<svg ", `<svg x="80" y="80" width="${w}" height="${h}" `);
  await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w + 160}" height="${h + 160}"><rect width="100%" height="100%" fill="${bg}"/>${inner}</svg>`)).png().toFile(path.join(OUT, `${name}.png`));
}
console.log("logos écrits dans", OUT);
