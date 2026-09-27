// Builds the Landri Burger vector logo masters (outlined text, no font dependency).
import opentype from "opentype.js";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const OUT = process.argv[2];
fs.mkdirSync(OUT, { recursive: true });
const fontBuf = fs.readFileSync("node_modules/@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin-800-normal.woff");
const font = opentype.parse(fontBuf.buffer.slice(fontBuf.byteOffset, fontBuf.byteOffset + fontBuf.byteLength));

// Lay out a string glyph by glyph; tracking in em. Returns {d, width, bbox}
function word(text, size, tracking = 0) {
  let x = 0; const parts = [];
  const glyphs = [...text].map(ch => font.charToGlyph(ch));
  glyphs.forEach((g, i) => {
    const p = g.getPath(x, 0, size);
    parts.push(p.toPathData(2));
    const adv = (g.advanceWidth / font.unitsPerEm) * size;
    const kern = i < glyphs.length - 1 ? (font.getKerningValue(g, glyphs[i + 1]) / font.unitsPerEm) * size : 0;
    x += adv + kern + (i < glyphs.length - 1 ? tracking * size : 0);
  });
  let top = Infinity, bottom = -Infinity;
  glyphs.forEach(g => { const bb = g.getPath(0, 0, size).getBoundingBox(); top = Math.min(top, bb.y1); bottom = Math.max(bottom, bb.y2); });
  return { d: parts.join(""), width: x, top, bottom };
}

// Emblem: bun dome with star cut-out + bottom bun bar. Box 200 x 124.
function star(cx, cy, R, r) {
  let d = "";
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 ? r : R;
    d += (i ? "L" : "M") + (cx + rad * Math.cos(a)).toFixed(2) + "," + (cy + rad * Math.sin(a)).toFixed(2);
  }
  return d + "Z";
}
const dome = "M0,70C0,24 46,0 100,0C154,0 200,24 200,70L200,73Q200,80 193,80L7,80Q0,80 0,73Z";
const bottom = "M18,92L182,92Q196,92 196,106L196,110Q196,124 182,124L18,124Q4,124 4,110L4,106Q4,92 18,92Z";
const emblemD = dome + star(100, 44, 21, 8.6) + bottom;
const emblem = (tx, ty, s) => `<path fill-rule="evenodd" transform="translate(${tx} ${ty}) scale(${s})" d="${emblemD}"/>`;

const svg = (w, h, body, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w.toFixed(1)} ${h.toFixed(1)}" role="img" aria-label="${title}"><title>${title}</title><g fill="currentColor">${body}</g></svg>\n`;

// 1) Stacked primary lockup
{
  const L = word("LANDRI", 120, -0.01);
  const B = word("BURGER", 44, 0.34);
  const W = Math.max(L.width, B.width, 200) + 40;
  const eS = 1.05, eW = 200 * eS, eH = 124 * eS;
  const lTop = eH + 40 + 20, lBase = lTop - L.top;
  const bBase = lBase + L.bottom + 26 - B.top;
  const H = bBase + B.bottom + 20;
  const body = emblem((W - eW) / 2, 20, eS) +
    `<path transform="translate(${((W - L.width) / 2).toFixed(1)} ${lBase.toFixed(1)})" d="${L.d}"/>` +
    `<path transform="translate(${((W - B.width) / 2).toFixed(1)} ${bBase.toFixed(1)})" d="${B.d}"/>`;
  fs.writeFileSync(path.join(OUT, "landri-burger-logo-stacked.svg"), svg(W, H, body, "Landri Burger"));
}
// 2) Horizontal lockup (header)
{
  const L = word("LANDRI", 100, -0.01);
  const B = word("BURGER", 33, 0.42);
  const eS = 0.78, eW = 200 * eS, eH = 124 * eS;
  const gap = 26;
  const textW = Math.max(L.width, B.width);
  const W = eW + gap + textW;
  const lBase = -L.top;
  const bBase = lBase + L.bottom + 12 - B.top;
  const textH = bBase + B.bottom;
  const H = Math.max(textH, eH);
  const body = emblem(0, (H - eH) / 2, eS) +
    `<path transform="translate(${(eW + gap).toFixed(1)} ${((H - textH) / 2 + lBase).toFixed(1)})" d="${L.d}"/>` +
    `<path transform="translate(${(eW + gap).toFixed(1)} ${((H - textH) / 2 + bBase).toFixed(1)})" d="${B.d}"/>`;
  fs.writeFileSync(path.join(OUT, "landri-burger-logo-horizontal.svg"), svg(W, H, body, "Landri Burger"));
}
// 3) Mark only
fs.writeFileSync(path.join(OUT, "landri-burger-mark.svg"), svg(200, 124, emblem(0, 0, 1), "Landri Burger"));

// 4) Coloured favicon / app icon (saffron mark on lacquer red)
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" rx="56" fill="#A8201A"/><g fill="#F2B01E">${emblem(38, 62, 0.9)}</g></svg>\n`;
fs.writeFileSync(path.join(OUT, "favicon.svg"), icon);
await sharp(Buffer.from(icon)).resize(512, 512).png().toFile(path.join(OUT, "icon-512.png"));
await sharp(Buffer.from(icon)).resize(180, 180).png().toFile(path.join(OUT, "apple-touch-icon.png"));

// Fixed-colour variants for use in <img> tags
const COLORS = { cream: "#F4EADB", saffron: "#F2B01E", ink: "#0E0A09", lacquer: "#A8201A" };
for (const base of ["landri-burger-logo-stacked", "landri-burger-logo-horizontal", "landri-burger-mark"]) {
  const s = fs.readFileSync(path.join(OUT, base + ".svg"), "utf8");
  for (const [cn, hex] of Object.entries(COLORS)) {
    fs.writeFileSync(path.join(OUT, `${base}-${cn}.svg`), s.replace('fill="currentColor"', `fill="${hex}"`));
  }
}

// Previews on brand backgrounds
for (const [name, fg, bg] of [["stacked-on-red", "#F2B01E", "#A8201A"], ["stacked-on-ink", "#F3EBDD", "#110D0C"]]) {
  const s = fs.readFileSync(path.join(OUT, "landri-burger-logo-stacked.svg"), "utf8").replace('fill="currentColor"', `fill="${fg}"`);
  const vb = s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  const w = +vb[1], h = +vb[2];
  const inner = s.replace("<svg ", `<svg x="80" y="80" width="${w}" height="${h}" `);
  const wrapped = `<svg xmlns="http://www.w3.org/2000/svg" width="${w + 160}" height="${h + 160}"><rect width="100%" height="100%" fill="${bg}"/>${inner}</svg>`;
  await sharp(Buffer.from(wrapped)).png().toFile(path.join(OUT, `preview-${name}.png`));
}
console.log("logos written to", OUT);
