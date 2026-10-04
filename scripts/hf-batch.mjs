// Lance une série de générations d'images Higgsfield (CLI `higgsfield`) et télécharge les résultats.
// Usage : node scripts/hf-batch.mjs production/v2/jobs/<lot>.json
// Le fichier décrit { outDir, model, args, bible, items: [{ name, aspect, prompt, args? }] }.
// Reprise automatique : un élément déjà téléchargé est ignoré. Journal : <outDir>/_jobs.json
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const spec = JSON.parse(fs.readFileSync(path.resolve(process.argv[2]), "utf8"));
const outDir = path.join(ROOT, spec.outDir);
fs.mkdirSync(outDir, { recursive: true });
const logFile = path.join(outDir, "_jobs.json");
const log = fs.existsSync(logFile) ? JSON.parse(fs.readFileSync(logFile, "utf8")) : {};
const bible = spec.bible ? fs.readFileSync(path.join(ROOT, spec.bible), "utf8").trim() : "";
const CONCURRENCY = spec.concurrency || 4;
// La CLI npm est un script Node : on l'appelle directement (évite les problèmes de guillemets du shell Windows).
const CLI = process.env.HIGGSFIELD_CLI || path.join(process.env.APPDATA || "", "npm", "node_modules", "@higgsfield", "cli", "bin", "higgsfield.js");

function run(args) {
  return new Promise((resolve) => {
    const p = spawn(process.execPath, [CLI, ...args], { shell: false, windowsHide: true });
    let out = "", err = "";
    p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (err += d));
    p.on("close", (code) => resolve({ code, out, err }));
    p.on("error", (e) => resolve({ code: 1, out, err: String(e) }));
  });
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function one(item) {
  const file = path.join(outDir, item.name + ".png");
  // déjà produit (PNG d'origine ou JPEG converti) : on ne régénère pas
  if (fs.existsSync(file) || fs.existsSync(file.replace(/\.png$/, ".jpg"))) return console.log("déjà là :", item.name);
  let jobId = log[item.name]?.job;
  if (!jobId) {
    const prompt = (item.bible === false || !bible ? "" : bible + "\n\n") + item.prompt;
    const args = ["generate", "create", item.model || spec.model, "--prompt", prompt, "--aspect_ratio", item.aspect || "16:9", "--json"];
    for (const [k, v] of Object.entries({ ...(spec.args || {}), ...(item.args || {}) })) args.push(k, String(v));
    for (let attempt = 0; attempt < 6 && !jobId; attempt++) {
      const r = await run(args);
      const m = r.out.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
      if (m) jobId = m[0];
      else { console.warn(`soumission refusée (${item.name}) : ${(r.err || r.out).trim().slice(0, 160)}`); await sleep(8000 * (attempt + 1)); }
    }
    if (!jobId) return console.error("ÉCHEC soumission :", item.name);
    log[item.name] = { job: jobId };
    fs.writeFileSync(logFile, JSON.stringify(log, null, 2));
  }
  const w = await run(["generate", "wait", jobId, "--timeout", "30m", "--interval", "5s", "--quiet", "--json"]);
  const url = (w.out.match(/"result_url":\s*"([^"]+)"/) || [])[1];
  if (!url) {
    // job en échec : on l'oublie pour qu'une relance du lot le soumette à nouveau
    delete log[item.name];
    fs.writeFileSync(logFile, JSON.stringify(log, null, 2));
    return console.error("ÉCHEC rendu :", item.name, (w.err || w.out).trim().slice(0, 200));
  }
  const res = await fetch(url);
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  log[item.name] = { job: jobId, done: true }; // pas d'URL : elle contient l'identifiant du compte Higgsfield
  fs.writeFileSync(logFile, JSON.stringify(log, null, 2));
  console.log("ok :", item.name, jobId);
}

const queue = [...spec.items];
await Promise.all(Array.from({ length: CONCURRENCY }, async () => { while (queue.length) await one(queue.shift()); }));
console.log("terminé :", spec.items.length, "éléments ->", spec.outDir);
