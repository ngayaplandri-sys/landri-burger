// Minimal static server for local preview: npm run serve  (http://localhost:4173)
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const PORT = Number(process.env.PORT) || 4173;
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".jpg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2", ".mp4": "video/mp4", ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8", ".md": "text/plain; charset=utf-8",
};

http.createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  let file = path.normalize(path.join(ROOT, decodeURIComponent(url.pathname)));
  if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404, { "content-type": "text/plain" }).end("404"); return; }
    const ext = path.extname(file).toLowerCase();
    // Cache long pour les médias versionnés ; jamais pour le HTML, le CSS, le JS ni le manifeste.
    const long = /\/assets\/(img|fonts|flight\/frames-[^/]+)\//.test(url.pathname);
    res.writeHead(200, { "content-type": TYPES[ext] || "application/octet-stream", "cache-control": long ? "public, max-age=604800" : "no-cache" });
    res.end(buf);
  });
}).listen(PORT, () => console.log(`Landri Burger: http://localhost:${PORT}`));
