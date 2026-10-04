/* LANDRI - le vol : scène épinglée + canvas piloté par le défilement natif.
 *
 * Timeline par morceaux : chaque beat de content.js associe sa propre distance de défilement (vh)
 * à sa propre plage de temps du film maître (from -> to, en secondes). from = to : plan fixe.
 *
 * Deux sources d'images :
 *  - "frames" : séquence WebP extraite de la vidéo Higgsfield (assets/flight/manifest.js) ;
 *  - "stills" : images fixes avec zoom et fondus (provisoire, et repli si les frames manquent).
 * Le texte des chapitres reste du HTML : net, sélectionnable, accessible.
 */
(function () {
  "use strict";
  var C = window.LANDRI_CONTENT;
  var root = document.documentElement;
  if (!C || !root.classList.contains("is-cinematic")) return;

  var F = C.flight;
  var M = window.LANDRI_FLIGHT_MANIFEST || null;
  var section = document.querySelector("[data-flight]");
  var stage = section.querySelector("[data-stage]");
  var canvas = stage.querySelector("[data-canvas]");
  var poster = stage.querySelector("[data-poster]");
  var bar = stage.querySelector("[data-progress]");
  var ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) { fallbackStatic(); return; }

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function smooth(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }
  function easeInOut(x) { return 0.5 - 0.5 * Math.cos(Math.PI * clamp(x, 0, 1)); }
  function lerp(a, b, k) { return a + (b - a) * k; }

  /* ---------- Timeline ---------- */
  var beats = [], acc = 0;
  F.beats.forEach(function (b) {
    beats.push({ id: b.id, vh: b.vh, from: b.from, to: b.to, chapter: b.chapter, focus: b.focus == null ? 0.5 : b.focus, start: acc, end: acc + b.vh });
    acc += b.vh;
  });
  var totalVh = acc;
  function beatIndexAt(v) { for (var i = 0; i < beats.length; i++) if (v < beats[i].end) return i; return beats.length - 1; }
  function timeAt(v) {
    var b = beats[beatIndexAt(v)];
    return lerp(b.from, b.to, b.vh ? clamp((v - b.start) / b.vh, 0, 1) : 0);
  }
  function focusAt(v) {
    var i = beatIndexAt(v), b = beats[i], n = beats[i + 1];
    if (!n || n.focus === b.focus) return b.focus;
    var edge = Math.min(20, b.vh * 0.3);                // glisse vers le cadrage du beat suivant
    return lerp(b.focus, n.focus, smooth((v - (b.end - edge)) / edge));
  }

  /* ---------- Chapitres ---------- */
  var chapters = Array.prototype.map.call(stage.querySelectorAll(".chapter"), function (el, i, all) {
    var id = el.getAttribute("data-chapter"), s = Infinity, e = -Infinity;
    beats.forEach(function (b) { if (b.chapter === id) { s = Math.min(s, b.start); e = Math.max(e, b.end); } });
    return { el: el, start: s, end: e, first: i === 0, last: i === all.length - 1, o: -1 };
  });
  function updateChapters(v) {
    chapters.forEach(function (c) {
      var o = 0;
      if (isFinite(c.start)) {
        var f = Math.min(26, (c.end - c.start) * 0.22);
        var inO = c.first ? 1 : smooth((v - c.start) / f);
        var outO = c.last ? 1 : smooth((c.end - v) / f);
        o = Math.min(inO, outO);
      }
      o = Math.round(o * 1000) / 1000;
      if (o === c.o) return;
      c.o = o;
      var y = (1 - o) * 22 * (v < (c.start + c.end) / 2 ? 1 : -1);
      c.el.style.opacity = o;
      c.el.style.transform = o >= 1 ? "" : "translate3d(0," + y.toFixed(1) + "px,0)";
      c.el.classList.toggle("is-on", o > 0.01);
      // Un texte masqué ne capte ni clics ni tabulation.
      var live = o > 0.5;
      if (c.el.inert === live) c.el.inert = !live;
      if (!live) c.el.setAttribute("aria-hidden", "true"); else c.el.removeAttribute("aria-hidden");
    });
  }

  /* ---------- Mesures ---------- */
  var vhPx = 1, sectionTop = 0, cw = 0, ch = 0, dpr = 1;
  function measure() {
    var h = stage.clientHeight || window.innerHeight;
    vhPx = h / 100;
    section.style.height = Math.round(totalVh * vhPx + h) + "px";
    sectionTop = section.getBoundingClientRect().top + window.scrollY;
    dpr = Math.min(window.devicePixelRatio || 1, mode === "frames" ? 1.5 : 2);
    cw = Math.round(stage.clientWidth * dpr);
    ch = Math.round(h * dpr);
    if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
    dirty = true;
  }
  function scrollVh() { return clamp((window.scrollY - sectionTop) / vhPx, 0, totalVh); }

  /* ---------- Dessin ---------- */
  // Dessine img en "cover" ; s = zoom, (fx, fy) = point de l'image placé au centre.
  function drawCover(img, s, fx, fy, alpha) {
    var iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
    if (!iw || !ih) return false;
    var k = Math.max(cw / iw, ch / ih) * s, dw = iw * k, dh = ih * k;
    var dx = clamp(cw / 2 - fx * dw, cw - dw, 0), dy = clamp(ch / 2 - fy * dh, ch - dh, 0);
    ctx.globalAlpha = alpha == null ? 1 : alpha;
    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.globalAlpha = 1;
    return true;
  }

  /* ----- Mode images fixes ----- */
  var stillImgs = {};
  function loadStills() {
    var w = cw > 1400 ? 2048 : 1280;
    var order = [];
    F.shots.forEach(function (s) { if (order.indexOf(s.still) < 0) order.push(s.still); });
    order.forEach(function (key, i) {
      var def = F.stills[key]; if (!def) return;
      var img = new Image();
      img.decoding = "async";
      if (i === 0) img.fetchPriority = "high";
      img.onload = function () { stillImgs[key] = img; dirty = true; };
      img.src = def.src + "-" + w + ".webp";
    });
  }
  function keyAt(keys, t) {
    if (t <= keys[0].t) return keys[0];
    for (var i = 0; i < keys.length - 1; i++) {
      var a = keys[i], b = keys[i + 1];
      if (t <= b.t) { var k = easeInOut((t - a.t) / (b.t - a.t)); return { s: lerp(a.s, b.s, k), x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k) }; }
    }
    return keys[keys.length - 1];
  }
  function drawStills(t) {
    var drawn = false, prev = null;
    ctx.fillStyle = "#0E0A09"; ctx.fillRect(0, 0, cw, ch);
    F.shots.forEach(function (s) {
      if (t < s.from || t > s.to) { if (t > s.to) prev = s; return; }
      var img = stillImgs[s.still]; if (!img) return;
      var alpha = 1;
      if (prev && prev.to > s.from && t < prev.to) alpha = smooth((t - s.from) / (prev.to - s.from));
      var k = keyAt(s.keys, t);
      if (drawCover(img, k.s, k.x, k.y, alpha)) drawn = true;
      prev = s;
    });
    (F.flashes || []).forEach(function (f) {
      if (t <= f.from || t >= f.to) return;
      var a = t < f.peak ? smooth((t - f.from) / (f.peak - f.from)) : smooth((f.to - t) / (f.to - f.peak));
      ctx.fillStyle = "rgba(" + f.color + "," + (a * f.max).toFixed(3) + ")";
      ctx.fillRect(0, 0, cw, ch);
    });
    return drawn;
  }

  /* ----- Mode séquence d'images (vidéo Higgsfield) ----- */
  var frames = null;
  function FrameStore(man) {
    var small = (stage.clientWidth * Math.min(window.devicePixelRatio || 1, 1.5)) <= 1100 && man.small;
    var set = small ? man.small : man;
    var pad = man.pad || 4;
    var N = man.count, cache = new Map(), inflight = 0;
    var MAX_INFLIGHT = small ? 4 : 6, MAX_CACHE = small ? 90 : 160, KEY_EVERY = 10, AHEAD = small ? 18 : 30, BEHIND = 8;
    var want = 0, dir = 1, failedFirst = false;
    function url(i) { var n = String(i + (man.start || 0)); while (n.length < pad) n = "0" + n; return set.path + man.prefix + n + "." + man.ext + "?v=" + encodeURIComponent(man.version); }
    function load(i) {
      var e = cache.get(i);
      if (e && (e.state === 1 || e.state === 0 || (e.state === 2 && (e.tries >= 3 || Date.now() < e.retryAt)))) return false;
      var img = new Image(); img.decoding = "async";
      e = { img: img, state: 0, tries: e ? e.tries : 0, retryAt: 0 };
      cache.set(i, e); inflight++;
      img.onload = function () { if (e.state !== 0) return; e.state = 1; inflight--; dirty = true; pump(); };
      img.onerror = function () {
        if (e.state !== 0) return;
        e.state = 2; e.tries++; e.retryAt = Date.now() + 400 * e.tries; inflight--;
        if (i === 0 && e.tries >= 3) failedFirst = true;
        pump();
      };
      img.src = url(i);
      return true;
    }
    function priority() {
      var list = [want], k;
      for (k = 1; k <= AHEAD; k++) { list.push(want + dir * k); if (k % 3 === 0 && k / 3 <= BEHIND) list.push(want - dir * (k / 3)); }
      // images-clés réparties sur tout le vol : un saut rapide trouve toujours une image proche
      for (k = 0; k < N; k += KEY_EVERY) list.push(k);
      return list.filter(function (i) { return i >= 0 && i < N; });
    }
    function pump() {
      if (inflight >= MAX_INFLIGHT) return;
      var list = priority();
      for (var j = 0; j < list.length && inflight < MAX_INFLIGHT; j++) load(list[j]);
    }
    function trim() {
      // abandonne les requêtes devenues inutiles, puis libère les images les plus éloignées
      cache.forEach(function (e, i) {
        if (e.state === 0 && Math.abs(i - want) > AHEAD + 12 && i % KEY_EVERY) { e.state = 3; e.img.src = ""; inflight--; cache.delete(i); }
      });
      if (cache.size <= MAX_CACHE) return;
      var far = [];
      cache.forEach(function (e, i) { if (e.state !== 0 && i % KEY_EVERY) far.push(i); });
      far.sort(function (a, b) { return Math.abs(b - want) - Math.abs(a - want); });
      for (var j = 0; j < far.length && cache.size > MAX_CACHE; j++) { var e = cache.get(far[j]); e.img.src = ""; cache.delete(far[j]); }
    }
    this.request = function (i, d) { i = clamp(i, 0, N - 1); if (d) dir = d; if (i !== want) { want = i; trim(); } pump(); };
    this.nearest = function (i) {
      for (var r = 0; r < 60; r++) {
        var a = cache.get(i - r); if (a && a.state === 1) return a.img;
        var b = cache.get(i + r); if (b && b.state === 1) return b.img;
      }
      return null;
    };
    this.failed = function () { return failedFirst; };
    this.count = N;
    this.fps = man.fps;
    this.dispose = function () { cache.forEach(function (e) { e.img.src = ""; }); cache.clear(); };
  }

  /* ---------- Boucle ---------- */
  var mode = M && M.count > 0 ? "frames" : "stills";
  var shown = 0, target = 0, lastShown = -1, lastT = 0, dirty = true, running = false, visible = true, lastNow = 0, ready = false;

  function render() {
    var t = timeAt(shown);
    updateChapters(shown);
    if (bar) bar.style.transform = "scaleX(" + (shown / totalVh).toFixed(4) + ")";
    var ok = false;
    if (mode === "frames") {
      if (frames.failed()) { frames.dispose(); frames = null; mode = "stills"; loadStills(); return render(); }
      var idx = Math.round(t * frames.fps);
      frames.request(idx, t > lastT ? 1 : t < lastT ? -1 : 0);
      var img = frames.nearest(clamp(idx, 0, frames.count - 1));
      var fx = focusAt(shown);
      if (img) { ctx.fillStyle = "#0E0A09"; ctx.fillRect(0, 0, cw, ch); ok = drawCover(img, 1, fx, 0.5); }
      else if (poster.complete) ok = drawCover(poster, 1, fx, 0.5);
    } else {
      ok = drawStills(t);
    }
    lastT = t;
    if (ok && !ready) { ready = true; stage.classList.add("is-ready"); }
  }

  function tick(now) {
    if (!visible) { running = false; return; }
    var dt = Math.min(0.1, (now - (lastNow || now)) / 1000); lastNow = now;
    target = scrollVh();
    var gap = target - shown;
    if (Math.abs(gap) > 160) shown = target;                     // grand saut (ancre, touche Fin) : pas de rembobinage
    else shown += gap * (1 - Math.exp(-dt * 9));                 // lissage, indépendant de la fréquence d'affichage
    if (Math.abs(target - shown) < 0.02) shown = target;
    if (shown !== lastShown || dirty) { dirty = false; lastShown = shown; render(); }
    requestAnimationFrame(tick);
  }
  function start() { if (!running) { running = true; lastNow = 0; requestAnimationFrame(tick); } }

  /* ---------- Démarrage ---------- */
  measure();
  if (mode === "frames") frames = new FrameStore(M); else loadStills();
  shown = target = scrollVh();
  render();

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) { dirty = true; start(); } }).observe(section);
  }
  start();
  document.addEventListener("visibilitychange", function () { if (!document.hidden) { dirty = true; start(); } });

  var resizeTimer = 0;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      // garde la même position dans le vol quand la hauteur d'écran change
      var inside = window.scrollY > sectionTop && window.scrollY < sectionTop + totalVh * vhPx;
      var keepVh = scrollVh();
      measure();
      if (inside) window.scrollTo(0, sectionTop + keepVh * vhPx);
      dirty = true; start();
    }, 120);
  }
  if ("ResizeObserver" in window) new ResizeObserver(onResize).observe(stage); else window.addEventListener("resize", onResize);

  /* Mouvement réduit activé en cours de visite : bascule en mode fixe. */
  var mq = matchMedia("(prefers-reduced-motion: reduce)");
  (mq.addEventListener ? mq.addEventListener.bind(mq, "change") : mq.addListener.bind(mq))(function (e) { if (e.matches) fallbackStatic(); });

  function fallbackStatic() {
    visible = false;
    root.classList.remove("is-cinematic"); root.classList.add("is-static");
    section.style.height = "";
    stage.querySelectorAll(".chapter").forEach(function (el) { el.style.opacity = ""; el.style.transform = ""; el.inert = false; el.removeAttribute("aria-hidden"); el.classList.remove("is-on"); });
    var h = document.querySelector("[data-header]"); if (h) h.classList.add("is-solid");
    if (frames) frames.dispose();
  }

  // Outil de vérification (console) : LANDRI_FLIGHT.state()
  window.LANDRI_FLIGHT = {
    beats: beats, totalVh: totalVh,
    state: function () { return { mode: mode, vh: +shown.toFixed(2), t: +timeAt(shown).toFixed(3), frame: frames ? Math.round(timeAt(shown) * frames.fps) : null, beat: beats[beatIndexAt(shown)].id, vhPx: vhPx }; },
    scrollToBeat: function (id, k) { var b = beats.filter(function (x) { return x.id === id; })[0]; if (b) window.scrollTo(0, sectionTop + (b.start + b.vh * (k == null ? 0.5 : k)) * vhPx); },
    // Rendu immédiat sans attendre la boucle (utile quand l'onglet est en arrière-plan pendant un test).
    renderNow: function () { shown = target = scrollVh(); lastShown = shown; render(); return this.state(); },
  };
})();
