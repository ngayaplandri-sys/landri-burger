/* Landri Burger - rendu du contenu (assets/js/content.js) et interactions hors vol. */
(function () {
  "use strict";
  var C = window.LANDRI_CONTENT;
  if (!C) return;
  var doc = document;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function icon(name, cls) {
    return '<svg class="icon' + (cls ? " " + cls : "") + '" aria-hidden="true"><use href="#i-' + name + '"/></svg>';
  }
  function price(n) {
    return Number(n).toLocaleString("fr-FR").replace(/ | /g, " ") + " " + (C.menu.currency || "FCFA");
  }
  function srcset(base, widths) {
    return widths.map(function (w) { return base + "-" + w + ".webp " + w + "w"; }).join(", ");
  }
  // Bouton à partir d'une clé de C.actions ou d'un objet {label, href, style, icon}
  function button(a, extraCls) {
    var act = typeof a === "string" ? C.actions[a] : a;
    if (!act || !act.label) return "";
    var style = act.style === "primary" ? "btn--primary" : "btn--ghost";
    var ic = act.icon ? icon(act.icon) : act.style === "primary" ? icon("arrow-right", "icon--nudge") : "";
    return '<a class="btn ' + style + (extraCls ? " " + extraCls : "") + '" href="' + esc(act.href) + '">' + esc(act.label) + ic + "</a>";
  }

  /* ---------- Navigation ---------- */
  var navHtml = C.nav.map(function (n) { return '<li><a href="' + esc(n.href) + '">' + esc(n.label) + "</a></li>"; }).join("");
  doc.querySelector("[data-nav]").innerHTML = navHtml;
  doc.querySelector("[data-nav-mobile]").innerHTML = C.nav.map(function (n) {
    return '<li><a href="' + esc(n.href) + '">' + esc(n.label) + icon("arrow-right") + "</a></li>";
  }).join("") + '<li><a href="' + esc(C.actions.reserve.href) + '">' + esc(C.actions.reserve.label) + icon("arrow-right") + "</a></li>";
  var headerCta = doc.querySelector('[data-cta="reserve"]');
  headerCta.textContent = C.actions.reserve.label;
  headerCta.href = C.actions.reserve.href;

  var toggle = doc.querySelector("[data-menu-toggle]");
  var panel = doc.querySelector("[data-mobile-menu]");
  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    panel.hidden = !open;
    toggle.querySelector("use").setAttribute("href", open ? "#i-x" : "#i-list");
    toggle.querySelector(".sr-only").textContent = open ? "Fermer le menu" : "Ouvrir le menu";
  }
  toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
  panel.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) { setMenu(false); toggle.focus(); } });
  matchMedia("(min-width: 901px)").addEventListener("change", function (e) { if (e.matches) setMenu(false); });

  /* ---------- Chapitres du vol ---------- */
  var stills = C.flight.stills;
  // En mode cinématique ces images restent masquées : chargement différé pour ne rien télécharger d'inutile.
  var eagerFirst = !doc.documentElement.classList.contains("is-cinematic");
  doc.querySelector("[data-chapters]").innerHTML = C.chapters.map(function (ch, i) {
    var st = stills[ch.still] || {};
    var tag = i === 0 ? "h1" : "h2";
    return (
      '<article class="chapter" data-chapter="' + esc(ch.id) + '" data-layout="' + esc(ch.layout) + '" aria-labelledby="ch-' + esc(ch.id) + '">' +
        (st.src ? '<img class="chapter__still" src="' + st.src + '-1280.webp" srcset="' + srcset(st.src, [1280, 2048]) + '" sizes="100vw" alt="' + esc(st.alt) + '" loading="' + (i === 0 && eagerFirst ? "eager" : "lazy") + '" decoding="async">' : "") +
        '<div class="chapter__inner">' +
          (ch.eyebrow ? '<p class="chapter__eyebrow">' + esc(ch.eyebrow) + "</p>" : "") +
          "<" + tag + ' class="chapter__title" id="ch-' + esc(ch.id) + '">' + esc(ch.title) + "</" + tag + ">" +
          (ch.text ? '<p class="chapter__text">' + esc(ch.text) + "</p>" : "") +
          (ch.actions && ch.actions.length ? '<div class="chapter__actions">' + ch.actions.map(function (a) { return button(a); }).join("") + "</div>" : "") +
        "</div>" +
      "</article>"
    );
  }).join("");

  /* ---------- La carte ---------- */
  var M = C.menu;
  function dish(d) {
    return '<li class="dish"><div class="dish__head"><h4 class="dish__name">' + esc(d.name) + "</h4>" +
      (d.tag ? '<span class="dish__tag">' + esc(d.tag) + "</span>" : "") +
      '<span class="dish__price">' + price(d.price) + "</span></div>" +
      (d.desc ? '<p class="dish__desc">' + esc(d.desc) + "</p>" : "") + "</li>";
  }
  function group(g) {
    return '<div class="menu__group"><h3 class="menu__group-title">' + esc(g.title) + "</h3><ul>" + g.items.map(dish).join("") + "</ul></div>";
  }
  var first = M.groups[0], rest = M.groups.slice(1);
  doc.querySelector("[data-menu]").innerHTML =
    '<div class="wrap menu__grid">' +
      '<figure class="menu__figure reveal">' +
        '<img src="' + M.image.src + '-720.webp" srcset="' + srcset(M.image.src, [720, 1200]) + '" sizes="(max-width: 900px) 100vw, 40vw" alt="' + esc(M.image.alt) + '" width="1200" height="1600" loading="lazy" decoding="async">' +
        "<figcaption>" + esc(first.items[0].name) + ", " + price(first.items[0].price) + "</figcaption>" +
      "</figure>" +
      '<div class="menu__body">' +
        '<h2 class="section-title reveal" id="carte-titre">' + esc(M.title) + "</h2>" +
        '<p class="section-lead reveal">' + esc(M.intro) + "</p>" +
        (M.note ? '<p class="menu__note">' + esc(M.note) + "</p>" : "") +
        group(first) +
        (rest.length ? '<div class="menu__sides">' + rest.map(group).join("") + "</div>" : "") +
      "</div>" +
    "</div>";

  /* ---------- La maison ---------- */
  var H = C.maison;
  doc.querySelector("[data-maison]").innerHTML =
    '<div class="wrap bento">' +
      '<div class="bento__cell bento__photo bento__a reveal"><img src="' + H.images[0].src + '-720.webp" srcset="' + srcset(H.images[0].src, [720, 1200]) + '" sizes="(max-width: 980px) 100vw, 40vw" alt="' + esc(H.images[0].alt) + '" loading="lazy" decoding="async"></div>' +
      '<div class="bento__cell bento__b reveal">' +
        '<h2 class="section-title" id="maison-titre">' + esc(H.title) + "</h2>" +
        "<p>" + esc(H.text) + "</p>" +
        '<ul class="ingredients" aria-label="Ingrédients phares">' + H.ingredients.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" +
      "</div>" +
      '<div class="bento__cell bento__c reveal"><div class="services">' + H.services.map(function (s) {
        return '<div class="service"><div class="service__icon">' + icon(s.icon) + "</div><h3>" + esc(s.title) + "</h3><p>" + esc(s.text) + "</p></div>";
      }).join("") + "</div></div>" +
      '<div class="bento__cell bento__photo bento__d reveal"><img src="' + H.images[1].src + '-960.webp" srcset="' + srcset(H.images[1].src, [960, 1600]) + '" sizes="(max-width: 980px) 100vw, 58vw" alt="' + esc(H.images[1].alt) + '" loading="lazy" decoding="async"></div>' +
    "</div>";

  /* ---------- Réserver ---------- */
  var R = C.reservation, K = C.contact;
  var today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  var minDate = today.toISOString().slice(0, 10);
  var guests = ""; for (var g = 1; g <= (R.maxGuests || 12); g++) guests += '<option value="' + g + '"' + (g === 2 ? " selected" : "") + ">" + g + (g === 1 ? " personne" : " personnes") + "</option>";
  doc.querySelector("[data-reserve]").innerHTML =
    '<div class="wrap reserve__grid">' +
      '<div class="reserve__text reveal">' +
        '<img class="reserve__mark" src="assets/brand/landri-burger-mark-saffron.svg" alt="" width="88" height="55">' +
        '<h2 class="section-title" id="reserver-titre">' + esc(R.title) + "</h2>" +
        "<p>" + esc(R.text) + "</p>" +
      "</div>" +
      '<form class="form reveal" novalidate data-form>' +
        field("nom", "Nom complet", '<input id="f-nom" name="nom" type="text" autocomplete="name" required>') +
        field("tel", "Téléphone (WhatsApp)", '<input id="f-tel" name="tel" type="tel" autocomplete="tel" inputmode="tel" placeholder="6XX XX XX XX" required>') +
        field("date", "Date", '<input id="f-date" name="date" type="date" min="' + minDate + '" required>') +
        field("heure", "Heure", '<input id="f-heure" name="heure" type="time" step="900" required>') +
        field("couverts", "Nombre de couverts", '<select id="f-couverts" name="couverts" required>' + guests + "</select>", true) +
        field("message", "Message (facultatif)", '<textarea id="f-message" name="message" placeholder="Anniversaire, chaise bébé, allergie..."></textarea>', true) +
        '<div class="form__status" role="status" aria-live="polite" hidden data-status></div>' +
        '<div class="form__foot"><button class="btn btn--primary" type="submit">' + esc(R.submit) + icon(K.whatsapp ? "whatsapp-logo" : "arrow-right") + "</button></div>" +
      "</form>" +
    "</div>";
  function field(id, label, control, full) {
    return '<div class="field' + (full ? " field--full" : "") + '"><label for="f-' + id + '">' + label + "</label>" + control + '<p class="error" id="e-' + id + '"></p></div>';
  }

  var form = doc.querySelector("[data-form]");
  var status = form.querySelector("[data-status]");
  function showStatus(kind, text) {
    status.hidden = false;
    status.className = "form__status form__status--" + kind;
    status.innerHTML = icon(kind === "ok" ? "check-circle" : "warning-circle") + "<span>" + esc(text) + "</span>";
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true, firstBad = null;
    ["nom", "tel", "date", "heure", "couverts"].forEach(function (id) {
      var el = form.querySelector("#f-" + id), err = form.querySelector("#e-" + id), msg = "";
      var v = (el.value || "").trim();
      if (!v) msg = "Ce champ est obligatoire.";
      else if (id === "tel" && v.replace(/[^\d]/g, "").length < 8) msg = "Numéro incomplet.";
      else if (id === "date" && v < minDate) msg = "Choisissez une date à venir.";
      err.textContent = msg;
      el.setAttribute("aria-invalid", msg ? "true" : "false");
      if (msg) { el.setAttribute("aria-describedby", "e-" + id); ok = false; firstBad = firstBad || el; }
      else el.removeAttribute("aria-describedby");
    });
    if (!ok) { showStatus("error", "Vérifiez les champs signalés."); firstBad.focus(); return; }

    var d = new FormData(form);
    var dateTxt = new Date(d.get("date") + "T12:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
    var text = "Bonjour " + C.brand.name + ", je souhaite réserver une table.\n" +
      "Nom : " + d.get("nom") + "\nTéléphone : " + d.get("tel") + "\nDate : " + dateTxt + " à " + d.get("heure") +
      "\nCouverts : " + d.get("couverts") + (String(d.get("message") || "").trim() ? "\nMessage : " + String(d.get("message")).trim() : "");
    var num = String(K.whatsapp || "").replace(/[^\d]/g, "");
    if (!num) { showStatus("demo", R.demoMessage); return; }
    window.open("https://wa.me/" + num + "?text=" + encodeURIComponent(text), "_blank", "noopener");
    showStatus("ok", R.sentMessage);
  });

  /* ---------- Nous trouver ---------- */
  var V = C.visit;
  var rows = [];
  rows.push('<div class="visit__row">' + icon("map-pin") + "<div><strong>" + esc(K.address) + "</strong><span>" + esc(K.district) + "</span></div></div>");
  if (K.hours && K.hours.length) rows.push('<div class="visit__row">' + icon("clock") + '<dl class="hours">' + K.hours.map(function (h) { return "<dt>" + esc(h[0]) + "</dt><dd>" + esc(h[1]) + "</dd>"; }).join("") + "</dl></div>");
  if (K.phoneDisplay) rows.push('<div class="visit__row">' + icon("phone") + "<div>" + (K.phoneHref ? '<a href="' + esc(K.phoneHref) + '">' + esc(K.phoneDisplay) + "</a>" : "<span>" + esc(K.phoneDisplay) + "</span>") + "</div></div>");
  var acts = [];
  if (K.mapUrl) acts.push('<a class="btn btn--primary" href="' + esc(K.mapUrl) + '" target="_blank" rel="noopener">' + esc(V.directionsLabel) + icon("arrow-up-right") + "</a>");
  if (K.deliveryUrl) acts.push('<a class="btn btn--ghost" href="' + esc(K.deliveryUrl) + '" target="_blank" rel="noopener">' + esc(V.deliveryLabel) + icon("moped") + "</a>");
  if (!acts.length) acts.push(button("reserve"));
  doc.querySelector("[data-visit]").innerHTML =
    '<div class="visit__bg"><img src="' + V.image.src + '-960.webp" srcset="' + srcset(V.image.src, [960, 1600]) + '" sizes="100vw" alt="' + esc(V.image.alt) + '" loading="lazy" decoding="async"></div>' +
    '<div class="wrap"><div class="visit__panel reveal">' +
      '<h2 class="section-title" id="visite-titre">' + esc(V.title) + "</h2>" +
      '<div class="visit__rows">' + rows.join("") + "</div>" +
      '<div class="visit__actions">' + acts.join("") + "</div>" +
    "</div></div>";

  /* ---------- Pied de page ---------- */
  var social = [];
  if (K.instagram) social.push('<a href="' + esc(K.instagram) + '" target="_blank" rel="noopener" aria-label="Instagram">' + icon("instagram-logo") + "</a>");
  if (K.facebook) social.push('<a href="' + esc(K.facebook) + '" target="_blank" rel="noopener" aria-label="Facebook">' + icon("facebook-logo") + "</a>");
  doc.querySelector("[data-footer]").innerHTML =
    '<div class="wrap">' +
      '<div class="footer__grid">' +
        '<div><img class="footer__logo" src="assets/brand/landri-burger-logo-stacked-cream.svg" alt="' + esc(C.brand.name) + '" width="150" height="110"><p class="footer__line">' + esc(C.footer.line) + "</p></div>" +
        '<nav class="footer__nav" aria-label="Pied de page">' + C.nav.map(function (n) { return '<a href="' + esc(n.href) + '">' + esc(n.label) + "</a>"; }).join("") + '<a href="' + esc(C.actions.reserve.href) + '">' + esc(C.actions.reserve.label) + "</a></nav>" +
        (social.length ? '<div class="footer__social">' + social.join("") + "</div>" : "<div></div>") +
      "</div>" +
      '<div class="footer__legal"><span>© ' + C.brand.year + " " + esc(C.brand.name) + ", " + esc(C.brand.city) + "</span>" +
        (C.demo && C.demoNotice ? '<span class="demo-note">' + esc(C.demoNotice) + "</span>" : "") + "</div>" +
    "</div>";

  /* ---------- Apparitions douces ---------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    doc.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    doc.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- En-tête : fond plein après le vol ---------- */
  var header = doc.querySelector("[data-header]");
  var end = doc.querySelector("[data-flight-end]");
  if ("IntersectionObserver" in window && end) {
    new IntersectionObserver(function (entries) {
      var r = entries[0].boundingClientRect;
      header.classList.toggle("is-solid", r.top < 72);
    }, { threshold: [0, 1], rootMargin: "-72px 0px 0px 0px" }).observe(end);
  }

  /* Lien d'évitement "Passer la visite" : amène le focus sur le contenu. */
  doc.querySelectorAll('a[href="#contenu"]').forEach(function (a) {
    a.addEventListener("click", function () { setTimeout(function () { doc.getElementById("contenu").focus({ preventScroll: true }); }, 0); });
  });
})();
