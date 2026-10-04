/* LANDRI - rendu bilingue du contenu (assets/js/content.js) et interactions hors vol. */
(function () {
  "use strict";
  var C = window.LANDRI_CONTENT;
  if (!C) return;
  var doc = document, root = doc.documentElement;
  var lang = root.lang === "en" ? "en" : "fr";
  var firstRender = true;

  /* ---------- Outils ---------- */
  function t(v) {
    if (v == null) return "";
    if (typeof v === "object" && !Array.isArray(v) && ("fr" in v || "en" in v)) return v[lang] != null ? v[lang] : v.fr;
    return v;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  }
  function icon(name, cls) { return '<svg class="icon' + (cls ? " " + cls : "") + '" aria-hidden="true"><use href="#i-' + name + '"/></svg>'; }
  function price(n) { return Number(n).toLocaleString(lang === "en" ? "en-GB" : "fr-FR").replace(/[  ,]/g, " ") + " " + (C.menu.currency || "FCFA"); }
  // Largeurs disponibles pour chaque famille d'images (voir scripts/build-images.mjs)
  function widthsFor(src) {
    if (/\/flight\//.test(src)) return [1280, 2048];
    if (/\/menu\//.test(src)) return [640, 1200];
    if (/chef-portrait|origine-/.test(src)) return [720, 1200];
    return [960, 1600];
  }
  function img(src, alt, sizes, extra) {
    var w = widthsFor(src);
    return '<img src="' + src + "-" + w[0] + '.webp" srcset="' + w.map(function (x) { return src + "-" + x + ".webp " + x + "w"; }).join(", ") +
      '" sizes="' + (sizes || "100vw") + '" alt="' + esc(t(alt)) + '" loading="lazy" decoding="async"' + (extra || "") + ">";
  }
  function button(a, extraCls) {
    var key = typeof a === "string" ? a : a.use;
    var act = C.actions[key];
    if (!act) return "";
    var style = (typeof a === "object" && a.style) || act.style;
    var ic = act.icon ? icon(act.icon) : style === "primary" ? icon("arrow-right", "icon--nudge") : "";
    return '<a class="btn btn--' + (style === "primary" ? "primary" : "ghost") + (extraCls ? " " + extraCls : "") + '" href="' + esc(act.href) + '">' + esc(t(act.label)) + ic + "</a>";
  }
  function $(sel) { return doc.querySelector(sel); }

  /* ---------- En-tête, langue, navigation ---------- */
  function renderHeader() {
    $("[data-nav]").innerHTML = C.nav.map(function (n) { return '<li><a href="' + esc(n.href) + '">' + esc(t(n.label)) + "</a></li>"; }).join("");
    $("[data-nav-mobile]").innerHTML = C.nav.map(function (n) {
      return '<li><a href="' + esc(n.href) + '">' + esc(t(n.label)) + icon("arrow-right") + "</a></li>";
    }).join("") + '<li><a href="' + esc(C.actions.reserve.href) + '">' + esc(t(C.actions.reserve.label)) + icon("arrow-right") + "</a></li>";
    var cta = $('[data-cta="reserve"]');
    cta.textContent = t(C.actions.reserve.label);
    cta.href = C.actions.reserve.href;
    doc.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = t(C.ui[el.getAttribute("data-i18n")]); });
    $("[data-flight]").setAttribute("aria-label", t(C.ui.flightLabel));
    var sw = $("[data-lang-switch]");
    sw.setAttribute("aria-label", t(C.ui.language));
    sw.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang)); });
    updateMenuToggle();
    doc.title = lang === "en" ? "LANDRI · African fine dining in Yaoundé" : "LANDRI · Cuisine africaine gastronomique à Yaoundé";
  }
  var toggle = $("[data-menu-toggle]"), panel = $("[data-mobile-menu]");
  function updateMenuToggle() {
    var open = toggle.getAttribute("aria-expanded") === "true";
    $("[data-menu-toggle-label]").textContent = t(open ? C.ui.closeMenu : C.ui.openMenu);
  }
  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    panel.hidden = !open;
    toggle.querySelector("use").setAttribute("href", open ? "#i-x" : "#i-list");
    updateMenuToggle();
  }
  toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
  panel.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) { setMenu(false); toggle.focus(); } });
  matchMedia("(min-width: 1081px)").addEventListener("change", function (e) { if (e.matches) setMenu(false); });

  $("[data-lang-switch]").addEventListener("click", function (e) {
    var b = e.target.closest("[data-lang]");
    if (!b || b.getAttribute("data-lang") === lang) return;
    lang = b.getAttribute("data-lang");
    root.lang = lang;
    try { localStorage.setItem("landri-lang", lang); } catch (err) {}
    renderAll();
    b.focus();
  });

  /* ---------- Chapitres du vol (les <article> restent les mêmes : flight.js garde ses références) ---------- */
  var eagerFirst = !root.classList.contains("is-cinematic");
  function chapterInner(ch, i) {
    var tag = i === 0 ? "h1" : "h2";
    return (ch.eyebrow ? '<p class="chapter__eyebrow label">' + esc(t(ch.eyebrow)) + "</p>" : "") +
      "<" + tag + ' class="chapter__title" id="ch-' + esc(ch.id) + '">' + esc(t(ch.title)) + "</" + tag + ">" +
      (ch.text ? '<p class="chapter__text">' + esc(t(ch.text)) + "</p>" : "") +
      (ch.actions && ch.actions.length ? '<div class="chapter__actions">' + ch.actions.map(function (a) { return button(a); }).join("") + "</div>" : "");
  }
  function renderChapters() {
    var wrap = $("[data-chapters]");
    if (!wrap.children.length) {
      wrap.innerHTML = C.chapters.map(function (ch, i) {
        var st = C.flight.stills[ch.still] || {};
        var w = widthsFor(st.src || "");
        return '<article class="chapter" data-chapter="' + esc(ch.id) + '" data-layout="' + esc(ch.layout) + '" aria-labelledby="ch-' + esc(ch.id) + '">' +
          (st.src ? '<img class="chapter__still" src="' + st.src + "-" + w[0] + '.webp" srcset="' + st.src + "-" + w[0] + ".webp " + w[0] + "w, " + st.src + "-" + w[1] + ".webp " + w[1] + 'w" sizes="100vw" alt="" loading="' + (i === 0 && eagerFirst ? "eager" : "lazy") + '" decoding="async">' : "") +
          '<div class="chapter__inner">' + chapterInner(ch, i) + "</div></article>";
      }).join("");
    } else {
      C.chapters.forEach(function (ch, i) {
        var el = wrap.querySelector('[data-chapter="' + ch.id + '"]');
        if (el) el.querySelector(".chapter__inner").innerHTML = chapterInner(ch, i);
      });
    }
    C.chapters.forEach(function (ch) {
      var el = wrap.querySelector('[data-chapter="' + ch.id + '"] .chapter__still');
      if (el) el.alt = t((C.flight.stills[ch.still] || {}).alt);
    });
  }

  /* ---------- La carte ---------- */
  var activeCat = C.menu.categories[0].id;
  var dishIndex = {};
  C.menu.categories.forEach(function (c) { c.items.forEach(function (d) { dishIndex[d.id] = d; }); });
  function dishCard(d) {
    return '<article class="dish reveal">' +
      '<div class="dish__media">' + img("assets/img/menu/" + d.id, d.name, "(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw") + "</div>" +
      '<div class="dish__body">' +
        '<div class="dish__top"><h3 class="dish__name">' + esc(t(d.name)) + '</h3><span class="dish__price">' + price(d.price) + "</span></div>" +
        '<p class="dish__meta"><span>' + esc(t(d.origin)) + "</span>" + (d.tag ? '<span class="dish__tag">' + esc(t(d.tag)) + "</span>" : "") + "</p>" +
        '<p class="dish__desc">' + esc(t(d.desc)) + "</p>" +
        '<p class="dish__ing"><span class="sr-only">' + esc(t(C.ui.ingredients)) + " : </span>" + esc(t(d.ingredients).join(", ")) + "</p>" +
        '<div class="dish__foot"><button class="link-btn" type="button" data-dish="' + esc(d.id) + '">' + esc(t(C.ui.discover)) + icon("plus") + '<span class="sr-only"> : ' + esc(t(d.name)) + "</span></button></div>" +
      "</div></article>";
  }
  function renderMenu() {
    var M = C.menu, cat = M.categories.filter(function (c) { return c.id === activeCat; })[0] || M.categories[0];
    $("[data-menu]").innerHTML =
      '<div class="wrap section">' +
        '<div class="section-head"><h2 class="section-title reveal" id="carte-titre">' + esc(t(M.title)) + '</h2><p class="section-lead reveal">' + esc(t(M.intro)) + "</p>" +
        (M.note ? '<p class="menu__note">' + esc(t(M.note)) + "</p>" : "") + "</div>" +
        '<div class="tabs" role="tablist" aria-label="' + esc(t(C.ui.menuCategories)) + '">' +
          M.categories.map(function (c) {
            var on = c.id === cat.id;
            return '<button class="tab" type="button" role="tab" id="tab-' + c.id + '" aria-controls="panel-carte" aria-selected="' + on + '" tabindex="' + (on ? 0 : -1) + '" data-cat="' + c.id + '">' + esc(t(c.title)) + "</button>";
          }).join("") +
        "</div>" +
        '<div class="dishes' + (cat.id === "plats" ? " dishes--featured" : "") + '" role="tabpanel" id="panel-carte" aria-labelledby="tab-' + cat.id + '">' + cat.items.map(dishCard).join("") + "</div>" +
      "</div>";
  }
  $("[data-menu]").addEventListener("click", function (e) {
    var tab = e.target.closest("[data-cat]");
    if (tab) { activeCat = tab.getAttribute("data-cat"); renderMenu(); revealAll($("[data-menu]")); $("#tab-" + activeCat).focus(); return; }
    var btn = e.target.closest("[data-dish]");
    if (btn) openDish(dishIndex[btn.getAttribute("data-dish")], btn);
  });
  $("[data-menu]").addEventListener("keydown", function (e) {
    if (!e.target.matches(".tab") || ["ArrowRight", "ArrowLeft", "Home", "End"].indexOf(e.key) < 0) return;
    var ids = C.menu.categories.map(function (c) { return c.id; }), i = ids.indexOf(activeCat);
    i = e.key === "Home" ? 0 : e.key === "End" ? ids.length - 1 : (i + (e.key === "ArrowRight" ? 1 : -1) + ids.length) % ids.length;
    e.preventDefault();
    activeCat = ids[i]; renderMenu(); revealAll($("[data-menu]")); $("#tab-" + activeCat).focus();
  });

  /* ---------- Fiche (dialog) : plat ou image de galerie ---------- */
  var sheet = $("[data-sheet]"), sheetBody = $("[data-sheet-body]"), opener = null;
  function openSheet(html, isImage, from) {
    opener = from || null;
    sheet.classList.toggle("sheet--image", !!isImage);
    sheetBody.innerHTML = html;
    if (typeof sheet.showModal === "function") sheet.showModal(); else sheet.setAttribute("open", "");
    var c = sheet.querySelector(".sheet__close"); if (c) c.focus();
  }
  function closeBtn() { return '<button class="sheet__close" type="button" data-close aria-label="' + esc(t(C.ui.close)) + '">' + icon("x") + "</button>"; }
  function openDish(d, from) {
    if (!d) return;
    openSheet(
      '<div class="sheet__media">' + img("assets/img/menu/" + d.id, d.name, "(max-width: 760px) 100vw, 55vw").replace('loading="lazy"', 'loading="eager"') + "</div>" +
      '<div class="sheet__body">' + closeBtn() +
        '<p class="label">' + esc(t(C.ui.origin)) + " : " + esc(t(d.origin)) + "</p>" +
        '<h2 class="sheet__title" id="sheet-title">' + esc(t(d.name)) + "</h2>" +
        '<p class="sheet__price">' + price(d.price) + (d.tag ? " · " + esc(t(d.tag)) : "") + "</p>" +
        '<p class="sheet__desc">' + esc(t(d.desc)) + "</p>" +
        '<div><p class="label" style="color:var(--ivory-3);margin-bottom:10px">' + esc(t(C.ui.ingredients)) + '</p><ul class="sheet__ing">' + t(d.ingredients).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>" +
        '<div class="sheet__actions">' + button("reserve") + "</div>" +
      "</div>", false, from);
  }
  function openImage(item, from) {
    openSheet(
      '<div class="sheet__media">' + img(item.src, item.alt, "100vw").replace('loading="lazy"', 'loading="eager"') + "</div>" +
      '<div class="sheet__body">' + closeBtn() + '<p class="label" id="sheet-title">' + esc(t(item.caption)) + '</p><p class="sheet__desc">' + esc(t(item.alt)) + "</p></div>", true, from);
  }
  function closeSheet() { if (sheet.open) { if (sheet.close) sheet.close(); else sheet.removeAttribute("open"); } }
  sheet.addEventListener("click", function (e) { if (e.target === sheet || e.target.closest("[data-close]")) closeSheet(); else if (e.target.closest('a[href^="#"]')) closeSheet(); });
  sheet.addEventListener("close", function () { if (opener) opener.focus(); opener = null; });

  /* ---------- Notre histoire ---------- */
  function renderStory() {
    var S = C.story;
    $("[data-story]").innerHTML =
      '<div class="wrap section"><div class="story__grid">' +
        '<div class="reveal"><h2 class="section-title" id="histoire-titre">' + esc(t(S.title)) + '</h2><p class="story__lead">' + esc(t(S.lead)) + "</p>" +
          '<div class="story__text">' + S.paragraphs.map(function (p) { return "<p>" + esc(t(p)) + "</p>"; }).join("") + "</div></div>" +
        '<figure class="story__media reveal">' + img(S.image.src, S.image.alt, "(max-width: 900px) 100vw, 40vw") + "</figure>" +
      "</div>" +
      '<ul class="values">' + S.values.map(function (v) { return '<li class="reveal"><h3>' + esc(t(v.title)) + "</h3><p>" + esc(t(v.text)) + "</p></li>"; }).join("") + "</ul>" +
      "</div>";
  }

  /* ---------- Nos origines ---------- */
  function renderOrigins() {
    var O = C.origins;
    $("[data-origins]").innerHTML =
      '<div class="wrap section"><div class="section-head"><h2 class="section-title reveal" id="origines-titre">' + esc(t(O.title)) + '</h2><p class="section-lead reveal">' + esc(t(O.intro)) + "</p></div>" +
      '<ul class="regions">' + O.regions.map(function (r) {
        return '<li class="region reveal">' + img(r.img, r.name, "(max-width: 560px) 78vw, (max-width: 1080px) 42vw, 20vw") +
          "<h3>" + esc(t(r.name)) + '</h3><p class="region__places">' + esc(t(r.places)) + '</p><p class="region__text">' + esc(t(r.text)) + '</p><p class="region__dishes">' + esc(t(r.dishes)) + "</p></li>";
      }).join("") + "</ul></div>";
  }

  /* ---------- Le chef ---------- */
  function renderChef() {
    var K = C.chef, L = K.labels;
    $("[data-chef]").innerHTML =
      '<div class="wrap section"><div class="chef__grid">' +
        '<figure class="chef__portrait reveal">' + img(K.portrait.src, K.portrait.alt, "(max-width: 900px) 100vw, 40vw") + "</figure>" +
        '<div class="reveal"><h2 class="section-title" id="chef-titre">' + esc(t(K.title)) + '</h2><p class="chef__quote">' + esc(t(K.quote)) + "</p>" +
          '<p class="chef__who"><span class="chef__name">' + esc(t(K.name)) + '</span><span class="chef__role">' + esc(t(K.role)) + "</span></p>" +
          '<dl class="chef__facts">' +
            "<div><dt>" + esc(t(L.philosophy)) + "</dt><dd>" + esc(t(K.philosophy)) + "</dd></div>" +
            "<div><dt>" + esc(t(L.vision)) + "</dt><dd>" + esc(t(K.vision)) + "</dd></div>" +
            "<div><dt>" + esc(t(L.specialties)) + "</dt><dd><ul>" + t(K.specialties).map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul></dd></div>" +
            "<div><dt>" + esc(t(L.path)) + "</dt><dd>" + esc(t(K.path)) + "</dd></div>" +
          "</dl></div>" +
      "</div></div>";
  }

  /* ---------- The African Table ---------- */
  function renderExperience() {
    var E = C.experience;
    $("[data-experience]").innerHTML =
      '<div class="wrap section"><div class="experience__grid">' +
        '<div><h2 class="section-title reveal" id="experience-titre">' + esc(t(E.title)) + '</h2><p class="section-lead reveal">' + esc(t(E.intro)) + "</p>" +
          '<ul class="pillars">' + E.pillars.map(function (p) {
            return '<li class="pillar reveal"><div class="pillar__icon">' + icon(p.icon) + "</div><h3>" + esc(t(p.title)) + "</h3><p>" + esc(t(p.text)) + "</p></li>";
          }).join("") + "</ul></div>" +
        '<div class="experience__media reveal">' + E.images.map(function (m) { return img(m.src, m.alt, "(max-width: 900px) 50vw, 25vw"); }).join("") + "</div>" +
      "</div></div>";
  }

  /* ---------- Galerie ---------- */
  function renderGallery() {
    var G = C.gallery;
    $("[data-gallery]").innerHTML =
      '<div class="wrap section"><div class="section-head"><h2 class="section-title reveal" id="galerie-titre">' + esc(t(G.title)) + "</h2></div>" +
      '<div class="gallery__grid">' + G.items.map(function (g, i) {
        return '<figure class="gallery__item reveal"><button class="gallery__btn" type="button" data-gal="' + i + '">' + img(g.src, g.alt, "(max-width: 700px) 100vw, 33vw") + "</button><figcaption>" + esc(t(g.caption)) + "</figcaption></figure>";
      }).join("") + "</div></div>";
  }
  $("[data-gallery]").addEventListener("click", function (e) {
    var b = e.target.closest("[data-gal]");
    if (b) openImage(C.gallery.items[+b.getAttribute("data-gal")], b);
  });

  /* ---------- Réserver ---------- */
  var today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  var minDate = today.toISOString().slice(0, 10);
  function field(id, label, control, full) {
    return '<div class="field' + (full ? " field--full" : "") + '"><label for="f-' + id + '">' + esc(label) + "</label>" + control + '<p class="error" id="e-' + id + '"></p></div>';
  }
  function renderReserve() {
    var R = C.reservation, F = R.fields, K = C.contact;
    var form = $("[data-form]"), saved = null;
    if (form) { saved = {}; new FormData(form).forEach(function (v, k) { saved[k] = v; }); }
    var guests = "";
    for (var g = 1; g <= (R.maxGuests || 12); g++) guests += '<option value="' + g + '"' + (g === 2 ? " selected" : "") + ">" + g + " " + esc(t(g === 1 ? F.person : F.persons)) + "</option>";
    $("[data-reserve]").innerHTML =
      '<div class="wrap section reserve__grid">' +
        '<div class="reserve__text reveal"><img class="reserve__mark" src="assets/brand/landri-mark-gold.svg" alt="" width="64" height="64">' +
          '<h2 class="section-title" id="reserver-titre">' + esc(t(R.title)) + "</h2><p>" + esc(t(R.text)) + "</p></div>" +
        '<form class="form reveal" novalidate data-form>' +
          field("nom", t(F.name), '<input id="f-nom" name="nom" type="text" autocomplete="name" required>') +
          field("tel", t(F.phone), '<input id="f-tel" name="tel" type="tel" autocomplete="tel" inputmode="tel" placeholder="6XX XX XX XX" required>') +
          field("date", t(F.date), '<input id="f-date" name="date" type="date" min="' + minDate + '" required>') +
          field("heure", t(F.time), '<input id="f-heure" name="heure" type="time" step="900" required>') +
          field("couverts", t(F.guests), '<select id="f-couverts" name="couverts" required>' + guests + "</select>", true) +
          field("message", t(F.message), '<textarea id="f-message" name="message" placeholder="' + esc(t(F.messagePlaceholder)) + '"></textarea>', true) +
          '<div class="form__status" role="status" aria-live="polite" hidden data-status></div>' +
          '<div class="form__foot"><button class="btn btn--primary" type="submit">' + esc(t(R.submit)) + icon(K.whatsapp ? "whatsapp-logo" : "arrow-right") + "</button></div>" +
        "</form></div>";
    if (saved) { var f = $("[data-form]"); Object.keys(saved).forEach(function (k) { if (f.elements[k]) f.elements[k].value = saved[k]; }); }
  }
  function showStatus(kind, text) {
    var status = $("[data-status]");
    status.hidden = false;
    status.className = "form__status form__status--" + kind;
    status.innerHTML = icon(kind === "ok" ? "check-circle" : "warning-circle") + "<span>" + esc(text) + "</span>";
  }
  $("[data-reserve]").addEventListener("submit", function (e) {
    e.preventDefault();
    var form = e.target, R = C.reservation, E = R.errors, ok = true, firstBad = null;
    ["nom", "tel", "date", "heure", "couverts"].forEach(function (id) {
      var el = form.querySelector("#f-" + id), err = form.querySelector("#e-" + id), msg = "";
      var v = (el.value || "").trim();
      if (!v) msg = t(E.required);
      else if (id === "tel" && v.replace(/[^\d]/g, "").length < 8) msg = t(E.phone);
      else if (id === "date" && v < minDate) msg = t(E.date);
      err.textContent = msg;
      el.setAttribute("aria-invalid", msg ? "true" : "false");
      if (msg) { el.setAttribute("aria-describedby", "e-" + id); ok = false; firstBad = firstBad || el; } else el.removeAttribute("aria-describedby");
    });
    if (!ok) { showStatus("error", t(E.summary)); firstBad.focus(); return; }
    var d = new FormData(form), F = R.fields;
    var dateTxt = new Date(d.get("date") + "T12:00").toLocaleDateString(lang === "en" ? "en-GB" : "fr-FR", { weekday: "long", day: "numeric", month: "long" });
    var text = t(R.whatsappIntro) + "\n" + t(F.name) + " : " + d.get("nom") + "\n" + t(F.phone) + " : " + d.get("tel") + "\n" + t(F.date) + " : " + dateTxt + ", " + d.get("heure") +
      "\n" + t(F.guests) + " : " + d.get("couverts") + (String(d.get("message") || "").trim() ? "\n" + t(F.message) + " : " + String(d.get("message")).trim() : "");
    var num = String(C.contact.whatsapp || "").replace(/[^\d]/g, "");
    if (!num) { showStatus("demo", t(R.demoMessage)); return; }
    window.open("https://wa.me/" + num + "?text=" + encodeURIComponent(text), "_blank", "noopener");
    showStatus("ok", t(R.sentMessage));
  });

  /* ---------- Nous trouver ---------- */
  function renderVisit() {
    var V = C.visit, K = C.contact, rows = [];
    rows.push('<div class="visit__row">' + icon("map-pin") + "<div><strong>" + esc(t(K.address)) + "</strong><span>" + esc(t(K.district)) + "</span></div></div>");
    if (K.hours && K.hours.length) rows.push('<div class="visit__row">' + icon("clock") + '<dl class="hours">' + K.hours.map(function (h) { return "<dt>" + esc(t(h[0])) + "</dt><dd>" + esc(t(h[1])) + "</dd>"; }).join("") + "</dl></div>");
    if (K.phoneDisplay) rows.push('<div class="visit__row">' + icon("phone") + "<div>" + (K.phoneHref ? '<a href="' + esc(K.phoneHref) + '">' + esc(K.phoneDisplay) + "</a>" : "<span>" + esc(K.phoneDisplay) + "</span>") + "</div></div>");
    var acts = [];
    if (K.mapUrl) acts.push('<a class="btn btn--ghost" href="' + esc(K.mapUrl) + '" target="_blank" rel="noopener">' + esc(t(V.directionsLabel)) + icon("arrow-up-right") + "</a>");
    acts.unshift(button("reserve"));
    $("[data-visit]").innerHTML =
      '<div class="visit__bg">' + img(V.image.src, V.image.alt, "100vw") + "</div>" +
      '<div class="wrap"><div class="visit__panel reveal"><h2 class="section-title" id="visite-titre">' + esc(t(V.title)) + "</h2>" +
      '<div class="visit__rows">' + rows.join("") + '</div><div class="visit__actions">' + acts.join("") + "</div></div></div>";
  }

  /* ---------- Pied de page ---------- */
  function renderFooter() {
    var K = C.contact, social = [];
    if (K.instagram) social.push('<a href="' + esc(K.instagram) + '" target="_blank" rel="noopener" aria-label="Instagram">' + icon("instagram-logo") + "</a>");
    if (K.facebook) social.push('<a href="' + esc(K.facebook) + '" target="_blank" rel="noopener" aria-label="Facebook">' + icon("facebook-logo") + "</a>");
    $("[data-footer]").innerHTML =
      '<div class="wrap"><div class="footer__grid">' +
        '<div><img class="footer__logo" src="assets/brand/landri-logo-horizontal-ivory.svg" alt="LANDRI, African Fine Dining" width="190" height="52"><p class="footer__line">' + esc(t(C.footer.line)) + "</p></div>" +
        '<nav class="footer__nav" aria-label="Footer">' + C.nav.map(function (n) { return '<a href="' + esc(n.href) + '">' + esc(t(n.label)) + "</a>"; }).join("") + '<a href="' + esc(C.actions.reserve.href) + '">' + esc(t(C.actions.reserve.label)) + "</a></nav>" +
        (social.length ? '<div class="footer__social">' + social.join("") + "</div>" : "<div></div>") +
      "</div>" +
      '<div class="footer__legal"><span>© ' + C.brand.year + " " + esc(C.brand.name) + ", " + esc(C.brand.city) + "</span>" + (C.demo && C.demoNotice ? '<span class="demo-note">' + esc(t(C.demoNotice)) + "</span>" : "") + "</div></div>";
  }

  /* ---------- Apparitions douces ---------- */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -8% 0px" }) : null;
  function revealAll(scope) { (scope || doc).querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-in"); }); }
  function observeReveals() {
    if (!io || !firstRender) { revealAll(); return; }   // après un changement de langue, tout reste visible
    doc.querySelectorAll(".reveal:not(.is-in)").forEach(function (el) { io.observe(el); });
  }

  function renderAll() {
    renderHeader(); renderChapters(); renderMenu(); renderStory(); renderOrigins(); renderChef();
    renderExperience(); renderGallery(); renderReserve(); renderVisit(); renderFooter();
    observeReveals();
    firstRender = false;
  }
  renderAll();

  /* ---------- En-tête : fond plein après le vol ---------- */
  var header = $("[data-header]"), end = $("[data-flight-end]");
  if ("IntersectionObserver" in window && end) {
    new IntersectionObserver(function (entries) { header.classList.toggle("is-solid", entries[0].boundingClientRect.top < 76); }, { threshold: [0, 1], rootMargin: "-76px 0px 0px 0px" }).observe(end);
  }
  doc.querySelectorAll('a[href="#contenu"]').forEach(function (a) {
    a.addEventListener("click", function () { setTimeout(function () { doc.getElementById("contenu").focus({ preventScroll: true }); }, 0); });
  });
})();
