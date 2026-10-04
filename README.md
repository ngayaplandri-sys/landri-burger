# LANDRI, African Fine Dining : site cinématographique

Site d'un restaurant africain gastronomique contemporain à Yaoundé, bilingue français / anglais.
La page d'accueil est une visite immersive pilotée par le défilement : arrivée, salle, cuisine, ingrédients, dressage, plat signature, service, puis la salle entière. Les textes restent du vrai HTML par-dessus la vidéo.

Toutes les images et vidéos ont été générées avec Higgsfield à partir d'une bible visuelle commune (`production/BIBLE-VISUELLE.md`). Détails de production : `production/NOTES-PRODUCTION.md`.

## Voir le site

Double-cliquez sur `index.html`, ou, pour un aperçu identique à un hébergement réel :

```bash
npm install
npm run serve
```

Puis ouvrez http://localhost:4173. La planche de style est sur http://localhost:4173/styleguide.html.

- Version anglaise directe : http://localhost:4173/?lang=en (le bouton FR / EN de l'en-tête mémorise le choix).
- Version sans animation (celle des visiteurs qui réduisent les animations ou économisent leurs données) : http://localhost:4173/?fixe

## Modifier le contenu

Tout se trouve dans **`assets/js/content.js`**. Chaque texte s'écrit en deux langues : `{ fr: "...", en: "..." }`.

| Pour changer | Cherchez |
|---|---|
| Textes de la visite | `chapters` |
| Carte : plats, descriptions, ingrédients, prix, origine | `menu.categories` |
| Notre histoire, valeurs | `story` |
| Nos origines (5 régions) | `origins` |
| Le chef (nom, parcours, philosophie) | `chef` |
| The African Table | `experience` |
| Galerie | `gallery` |
| Adresse, téléphone, horaires, réseaux | `contact` |
| Numéro WhatsApp des réservations | `contact.whatsapp` |
| Libellés des boutons | `actions` et `ui` |
| Mention « site de démonstration » | `demo` (mettre `false`) |

Pour ajouter un plat : copiez une ligne dans `menu.categories`, donnez-lui un `id` unique, et placez sa photo dans `production/menu-crop/<id>.jpg`, puis lancez `npm run images`.

### Activer les réservations

Tant que `contact.whatsapp` est vide, le formulaire affiche clairement « Mode démonstration : aucune demande n'a été envoyée ». Avec un numéro (format international sans `+`, par exemple `2376XXXXXXXX`), il ouvre WhatsApp avec la demande pré-remplie dans la langue du visiteur.

## Régler le rythme de la visite

Dans `content.js`, `flight.beats` découpe la visite en étapes :
- `vh` : longueur de défilement (100 = un écran) ;
- `from` / `to` : secondes du film affichées au début et à la fin (`from` = `to` : image fixe) ;
- `chapter` : texte visible pendant l'étape ;
- `focus` : sur téléphone, partie de l'image gardée au centre (0 à 1).

## Production Higgsfield

- `npm run generate production/jobs/<lot>.json` : génère une série d'images (outil `higgsfield` connecté requis) avec reprise automatique.
- `npm run images` : convertit les sources de `production/` en WebP dans `assets/img/`.
- `npm run frames` : assemble les segments de `production/video/` selon `scripts/flight.config.json` (coupes, fondus), vérifie les coupes, extrait 1 152 images WebP (1 280 et 800 px) et écrit `assets/flight/manifest.js`.

## Logo

Masters vectoriels dans `assets/brand/` : `landri-logo-stacked.svg`, `landri-logo-horizontal.svg` et `landri-mark.svg` (couleur libre), avec des variantes `-ivory`, `-gold`, `-ink` et `-terracotta`, plus `favicon.svg`, `icon-512.png` et `apple-touch-icon.png`. Le générateur est `scripts/brand/build-logo.mjs`.

## Mettre en ligne

Site statique : envoyez `index.html`, `styleguide.html` (facultatif) et `assets/` chez n'importe quel hébergeur (GitHub Pages, Netlify, etc.). N'envoyez ni `node_modules/` ni `production/`. Mettez un cache long sur `assets/img/`, `assets/fonts/` et `assets/flight/frames-*/`, et aucun cache sur les fichiers `.html`, `.css` et `.js`.

## Structure

```
index.html              page principale (sections remplies depuis content.js)
styleguide.html         planche de style
assets/js/content.js    TOUT le contenu modifiable, en FR et EN
assets/js/site.js       rendu bilingue, carte, fiches plats, galerie, formulaire
assets/js/flight.js     moteur de la visite (canvas, timeline, chargement progressif)
assets/css/site.css     styles
assets/flight/          séquence d'images du film + manifeste
assets/img/             photos optimisées
assets/brand/           logos
production/             bible visuelle, sources Higgsfield, prompts, vidéos, contrôles
scripts/                outils : génération, images, vidéo, serveur local
```
