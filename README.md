# Landri Burger : site cinématographique

Site vitrine d'un restaurant de burgers haut de gamme à Yaoundé. La page d'accueil est un vol continu en première personne (arrivée, salle, cuisine, garde-manger, sortie, vue aérienne), piloté par le défilement. Le texte reste du vrai HTML par-dessus l'image.

Toutes les images et la vidéo ont été générées avec Higgsfield. Détails dans `production/NOTES-PRODUCTION.md`.

## Voir le site

Le plus simple : double-cliquez sur `index.html`.

Pour un aperçu identique à un hébergement réel :

```bash
npm install
npm run serve
```

Puis ouvrez http://localhost:4173. La planche de style est sur http://localhost:4173/styleguide.html.

Pour voir la version sans animation (celle affichée aux personnes qui ont réduit les animations ou activé l'économie de données), ajoutez `?fixe` à l'adresse : http://localhost:4173/?fixe

## Modifier le contenu

Tout se trouve dans **`assets/js/content.js`**. Enregistrez puis rechargez la page.

| Pour changer | Cherchez dans content.js |
|---|---|
| Titres et textes du vol | `chapters` |
| Carte, descriptions, prix | `menu.groups` |
| Adresse, téléphone, horaires, réseaux | `contact` |
| Numéro WhatsApp des réservations | `contact.whatsapp` |
| Libellés des boutons | `actions` |
| Texte « La maison », ingrédients, services | `maison` |
| Mention « site de démonstration » | `demo` (mettre `false`) |

Un champ laissé vide (`""`) masque l'élément correspondant sur le site.

### Activer les réservations

Le formulaire n'envoie rien tant que `contact.whatsapp` est vide. Il affiche alors clairement « Mode démonstration : aucune demande n'a été envoyée ». Une fois le numéro renseigné (format international sans `+` ni espaces, par exemple `2376XXXXXXXX`), le bouton ouvre WhatsApp avec la demande pré-remplie. Le client n'a plus qu'à appuyer sur Envoyer.

## Régler le rythme du vol

Dans `content.js`, `flight.beats` découpe le vol en étapes :

- `vh` : longueur de défilement de l'étape, en hauteurs d'écran (100 = un écran) ;
- `from` / `to` : secondes du film affichées au début et à la fin de l'étape (`from` = `to` : image fixe, pratique pour laisser lire un titre) ;
- `chapter` : texte visible pendant l'étape (`null` = aucun texte) ;
- `focus` (facultatif) : sur téléphone, partie de l'image à garder au centre (0 = gauche, 0,5 = centre, 1 = droite).

Plus de `vh` = passage plus lent. Le texte d'un chapitre apparaît, reste, puis disparaît sur la durée des étapes qui portent son nom.

## Remplacer la vidéo ou les images

- **Images** : placez les nouvelles sources dans `production/`, ajustez la liste dans `scripts/build-images.mjs`, puis lancez `npm run images`.
- **Vidéo du vol** : placez les segments dans `production/video/`, listez-les dans `scripts/flight.config.json`, puis lancez `npm run frames`. Le script assemble le film maître, vérifie qu'il n'y a pas de coupe, extrait les images WebP (1 280 px et 800 px, 20 par seconde) et écrit `assets/flight/manifest.js`. Il faut ensuite aligner `flight.duration` et les secondes des étapes dans `content.js`.
- Si `assets/flight/manifest.js` vaut `null`, le vol utilise automatiquement les images fixes (`flight.shots`).

## Logo

Masters vectoriels dans `assets/brand/` :
- `landri-burger-logo-stacked.svg` et `landri-burger-logo-horizontal.svg` : couleur libre (`currentColor`) ;
- des variantes toutes prêtes en `-cream`, `-saffron`, `-ink` et `-lacquer` ;
- `landri-burger-mark.svg` (symbole seul), `favicon.svg`, `icon-512.png` et `apple-touch-icon.png`.

Le générateur est `scripts/brand/build-logo.mjs`. Il demande `opentype.js@1.3.4` et `@fontsource/bricolage-grotesque`.

## Mettre en ligne

Le site est statique : aucun serveur applicatif n'est nécessaire. Envoyez chez n'importe quel hébergeur (Netlify, Vercel, GitHub Pages, un hébergement mutualisé, etc.) :

```
index.html
styleguide.html   (facultatif)
assets/
```

N'envoyez pas `node_modules/`, `production/` ni `scripts/`.

Réglage de cache conseillé : cache long pour `assets/img/`, `assets/fonts/` et `assets/flight/frames-*/` ; pas de cache pour les fichiers `.html`, `.css` et `.js`, dont `assets/flight/manifest.js`.

## Structure

```
index.html              page principale
styleguide.html         planche de style (logo, couleurs, typos, composants)
assets/js/content.js    TOUT le contenu modifiable
assets/js/site.js       rendu des sections, menu mobile, formulaire
assets/js/flight.js     moteur du vol (canvas, timeline, chargement des images)
assets/css/site.css     styles
assets/flight/          séquence d'images du film + manifeste
assets/img/             photos optimisées
assets/brand/           logos
production/             sources Higgsfield (images, vidéos, prompts, contrôles)
scripts/                outils : images, vol, serveur local
```
