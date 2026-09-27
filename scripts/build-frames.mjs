// Assemble les segments Higgsfield en un film maître, contrôle les coupes, puis extrait la séquence
// d'images WebP utilisée par le vol (assets/flight/) et écrit le manifeste.
// Run: npm run frames
//
// Réglages dans scripts/flight.config.json :
//   segments : [{ file, trimStart, trimEnd, join, duration }]
//              join = "concat" (sortie directe d'une extension)
//                   | "xfade"  (raccord réparé : fondu de 0,125 s)
//                   | "flash"  (éclat de lumière de 0,4 s, pour masquer un saut au passage d'une porte au soleil)
//   fps, width, smallWidth, quality
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";

const ROOT = path.resolve(import.meta.dirname, "..");
const cfg = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, "flight.config.json"), "utf8"));
const VID = path.join(ROOT, "production", "video");
const TMP = path.join(VID, "_norm");
const MASTER = path.join(VID, "flythrough-master.mp4");
const REVIEW = path.join(ROOT, "production", "review");
fs.mkdirSync(TMP, { recursive: true });
fs.mkdirSync(REVIEW, { recursive: true });

const ff = (args) => execFileSync(ffmpegPath, ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
function duration(file) {
  const r = spawnSync(ffmpegPath, ["-hide_banner", "-i", file], { encoding: "utf8" });
  const m = String(r.stderr).match(/Duration: (\d+):(\d+):([\d.]+)/);
  if (!m) throw new Error("durée illisible : " + file);
  return +m[1] * 3600 + +m[2] * 60 + +m[3];
}

// 1) Normalisation : même taille, cadence et format pour chaque segment
const NORM = "scale=1920:1080:flags=lanczos,fps=24,format=yuv420p,setsar=1";
const parts = cfg.segments.map((s, i) => {
  const src = path.join(VID, s.file);
  const out = path.join(TMP, `seg-${i}.mp4`);
  const args = [];
  if (s.trimStart) args.push("-ss", String(s.trimStart));
  args.push("-i", src);
  if (s.trimEnd) args.push("-t", String(s.trimEnd - (s.trimStart || 0)));
  ff([...args, "-an", "-vf", NORM, "-c:v", "libx264", "-crf", "14", "-preset", "slow", out]);
  const d = duration(out);
  console.log(`segment ${i} : ${s.file}  ${d.toFixed(2)} s  (${s.join || "début"})`);
  return { out, d, join: s.join || "concat", dur: s.duration };
});

// 2) Assemblage : concat direct, ou fondu très court sur un raccord réparé
{
  const inputs = parts.flatMap((p) => ["-i", p.out]);
  // Même base de temps pour toutes les entrées (sinon xfade refuse le raccord après un concat).
  let filter = parts.map((p, i) => `[${i}:v]settb=AVTB,setpts=PTS-STARTPTS[s${i}];`).join("");
  let last = "[s0]", offset = parts[0].d;
  for (let i = 1; i < parts.length; i++) {
    const tag = `[v${i}]`;
    if (parts[i].join === "xfade" || parts[i].join === "flash") {
      // xfade : fondu très court sur un raccord réparé ; flash : éclat de lumière (sortie au soleil)
      const dur = parts[i].dur || (parts[i].join === "flash" ? 0.4 : 0.125);
      const tr = parts[i].join === "flash" ? "fadewhite" : "fade";
      filter += `${last}[s${i}]xfade=transition=${tr}:duration=${dur}:offset=${(offset - dur).toFixed(3)},settb=AVTB${tag};`;
      offset += parts[i].d - dur;
    } else {
      filter += `${last}[s${i}]concat=n=2:v=1:a=0,settb=AVTB${tag};`;
      offset += parts[i].d;
    }
    last = tag;
  }
  const args = parts.length > 1
    ? [...inputs, "-filter_complex", filter.replace(/;$/, ""), "-map", last]
    : [...inputs];
  ff([...args, "-an", "-c:v", "libx264", "-crf", "15", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", MASTER]);
  console.log(`film maître : ${path.relative(ROOT, MASTER)}  ${duration(MASTER).toFixed(2)} s`);
}

// 3) Contrôles : coupes cachées + planche contact
{
  const r = spawnSync(ffmpegPath, ["-hide_banner", "-i", MASTER, "-vf", "select='gt(scene,0.3)',showinfo", "-f", "null", "-"], { encoding: "utf8" });
  const cuts = [...String(r.stderr).matchAll(/pts_time:([\d.]+)/g)].map((m) => (+m[1]).toFixed(2));
  console.log(cuts.length ? `ATTENTION coupes détectées (scene > 0.3) à : ${cuts.join(", ")} s` : "coupes détectées : aucune");
  ff(["-i", MASTER, "-vf", "fps=1,scale=384:-2,tile=8x6:padding=4:color=0x222222", "-frames:v", "1", path.join(REVIEW, "master-sheet.jpg")]);
}

// 4) Séquence d'images pour le site
const version = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 12);
const OUTDIR = path.join(ROOT, "assets", "flight");
const sets = [
  { dir: `frames-${cfg.width}`, width: cfg.width },
  { dir: `frames-${cfg.smallWidth}`, width: cfg.smallWidth },
];
for (const s of sets) {
  const dir = path.join(OUTDIR, s.dir);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  ff(["-i", MASTER, "-an", "-vf", `fps=${cfg.fps},scale=${s.width}:-2:flags=lanczos`, "-c:v", "libwebp", "-quality", String(cfg.quality), "-compression_level", "5", "-start_number", "0", path.join(dir, "frame-%04d.webp")]);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".webp"));
  s.count = files.length;
  s.bytes = files.reduce((a, f) => a + fs.statSync(path.join(dir, f)).size, 0);
  s.height = Math.round((s.width * 1080) / 1920 / 2) * 2;
  console.log(`${s.dir} : ${s.count} images, ${(s.bytes / 1024 / 1024).toFixed(1)} Mo (moy. ${(s.bytes / s.count / 1024).toFixed(0)} Ko)`);
}
const count = Math.min(sets[0].count, sets[1].count);

// Affiche = première image exacte du vol
ff(["-i", MASTER, "-frames:v", "1", "-vf", "scale=1280:-2:flags=lanczos", "-q:v", "3", path.join(ROOT, "assets", "img", "flight", "poster.jpg")]);

// 5) Manifeste
const manifest = {
  version, fps: cfg.fps, count, duration: +(count / cfg.fps).toFixed(3),
  width: sets[0].width, height: sets[0].height,
  path: `assets/flight/${sets[0].dir}/`, prefix: "frame-", ext: "webp", pad: 4, start: 0,
  small: { path: `assets/flight/${sets[1].dir}/`, width: sets[1].width, height: sets[1].height },
  poster: "assets/img/flight/poster.jpg",
  source: path.relative(ROOT, MASTER).replace(/\\/g, "/"),
};
fs.writeFileSync(path.join(OUTDIR, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
fs.writeFileSync(path.join(OUTDIR, "manifest.js"),
  "/* Généré par `npm run frames` : ne pas modifier à la main. */\nwindow.LANDRI_FLIGHT_MANIFEST = " + JSON.stringify(manifest, null, 2) + ";\n");

// 6) Vérification des chemins
for (const i of [0, Math.floor(count / 2), count - 1]) {
  for (const s of sets) {
    const f = path.join(OUTDIR, s.dir, `frame-${String(i).padStart(4, "0")}.webp`);
    if (!fs.existsSync(f)) throw new Error("image manquante : " + f);
  }
}
console.log(`manifeste : ${count} images à ${cfg.fps} i/s (${manifest.duration} s), version ${version}`);
console.log("Pensez à aligner flight.duration et les secondes des beats dans assets/js/content.js sur cette durée.");
