/*
 * LANDRI BURGER - CONTENU DU SITE
 * ------------------------------------------------------------------
 * Tout ce que le site affiche se modifie ici : textes, carte, prix,
 * coordonnées, horaires, boutons, timeline du vol et images.
 * Enregistrez le fichier puis rechargez la page.
 *
 * Règles simples :
 *  - Gardez les guillemets "..." autour des textes.
 *  - Laissez une virgule entre deux éléments d'une liste.
 *  - Un champ vide ("") masque l'élément correspondant sur le site.
 */
window.LANDRI_CONTENT = {
  // Mettre à false quand l'adresse, les horaires, les prix et les contacts sont réels.
  demo: true,
  demoNotice: "Site de démonstration : adresse, horaires, prix et contacts sont à confirmer.",

  brand: { name: "Landri Burger", city: "Yaoundé", year: 2026 },

  // Coordonnées. Vide = élément masqué.
  contact: {
    // Numéro WhatsApp du restaurant au format international, sans + ni espaces (ex. "2376XXXXXXXX").
    // Tant qu'il est vide, le formulaire de réservation fonctionne en mode démonstration et n'envoie rien.
    whatsapp: "",
    phoneDisplay: "+237 6XX XX XX XX",
    phoneHref: "",           // ex. "tel:+2376XXXXXXXX"
    address: "Adresse à confirmer",
    district: "Yaoundé, Cameroun",
    mapUrl: "",              // lien Google Maps de l'établissement
    deliveryUrl: "",         // lien de commande en livraison, si disponible
    instagram: "",
    facebook: "",
    hours: [
      ["Lundi au jeudi", "À confirmer"],
      ["Vendredi et samedi", "À confirmer"],
      ["Dimanche", "À confirmer"],
    ],
  },

  // Boutons réutilisés partout (un seul libellé par intention).
  actions: {
    reserve: { label: "Réserver une table", href: "#reserver", style: "primary" },
    menu: { label: "Voir la carte", href: "#carte", style: "ghost" },
    visit: { label: "Nous trouver", href: "#visite", style: "ghost", icon: "map-pin" },
  },

  nav: [
    { label: "La carte", href: "#carte" },
    { label: "La maison", href: "#maison" },
    { label: "Nous trouver", href: "#visite" },
  ],

  /*
   * CHAPITRES DU VOL
   * Chaque chapitre apparaît pendant les "beats" qui portent son id (voir flight.beats).
   * layout : "hero" | "left" | "right" | "end"  (position du texte : "end" = en bas à gauche)
   * still  : image représentative, utilisée en mode fixe (mouvement réduit, petit débit).
   */
  chapters: [
    {
      id: "arrivee", layout: "hero", still: "01-exterieur",
      eyebrow: "Yaoundé",
      title: "Le burger, à la hauteur de Yaoundé.",
      text: "Bœuf saisi à la flamme, plantain mûr, poivre blanc de Penja. Une maison du burger haut de gamme, pensée pour le Mboa.",
      actions: ["reserve", "menu"],
    },
    {
      id: "salle", layout: "end", still: "02-salle",
      title: "Une grande table pour toute la ville.",
      text: "Sous la voûte rouge, familles, collègues et amis se retrouvent. Service à table, lumière chaude, vue sur les collines.",
      actions: ["reserve"],
    },
    {
      id: "cuisine", layout: "left", still: "03-cuisine",
      title: "Saisi à la minute, sous vos yeux.",
      text: "La cuisine ouverte tourne sans relâche : steaks écrasés sur la plancha brûlante, pains briochés dorés, sauces maison.",
      actions: ["menu"],
    },
    {
      id: "gardemanger", layout: "right", still: "04-garde-manger",
      title: "Les saveurs du pays, sans détour.",
      text: "Plantain mûr, poivre blanc de Penja, pèbè, gingembre, foléré. Le Cameroun est au cœur de chaque recette.",
      actions: [],
    },
    {
      id: "revelation", layout: "end", still: "05-aerien",
      title: "On vous attend à Yaoundé.",
      text: "Sur place, à emporter ou en livraison. Réservez votre table ou passez nous voir.",
      actions: ["reserve", "visit"],
    },
  ],

  /*
   * TIMELINE DU VOL (défilement -> images)
   * vh      : distance de défilement du beat, en hauteurs d'écran (100 = un écran).
   * from/to : secondes du film maître affichées au début et à la fin du beat.
   *           from = to  => plan fixe (hold) sur une seule image.
   * chapter : id du chapitre dont le texte est visible pendant ce beat (null = pas de texte).
   * focus   : sur mobile (écran vertical), point horizontal à garder au centre (0 = gauche, 1 = droite).
   */
  flight: {
    // Durée du film maître (production/video/flythrough-master.mp4, 868 images à 20 i/s).
    duration: 43.4,
    beats: [
      { id: "ouverture", vh: 55, from: 0, to: 0, chapter: "arrivee" },               // plan fixe : le titre se lit
      { id: "approche", vh: 110, from: 0, to: 5, chapter: "arrivee" },               // arc autour du serveur, entrée
      { id: "salle", vh: 165, from: 5, to: 12.5, chapter: "salle" },                 // comptoir, tables, baies
      { id: "porte-cuisine", vh: 60, from: 12.5, to: 16.3, chapter: null },          // la porte s'ouvre, on la traverse
      { id: "cuisine", vh: 170, from: 16.3, to: 25, chapter: "cuisine" },            // plancha, steaks, dressage
      { id: "garde-manger", vh: 110, from: 25, to: 29.5, chapter: "gardemanger" },   // allée d'étagères, porte arrière
      { id: "sortie", vh: 50, from: 29.5, to: 31.9, chapter: null },                 // éclat de soleil, la cour
      { id: "demi-tour", vh: 45, from: 31.9, to: 34.2, chapter: null },              // lacet de 180°, beat court dédié
      { id: "revelation", vh: 135, from: 34.2, to: 43.3, chapter: "revelation" },    // recul en montée
      { id: "plan-final", vh: 75, from: 43.3, to: 43.3, chapter: "revelation" },     // plan fixe final
    ],

    // Images fixes du vol (mode provisoire avant la vidéo, et mode mouvement réduit).
    stills: {
      "01-exterieur": { src: "assets/img/flight/01-exterieur", alt: "Façade du restaurant au coucher du soleil, portes ouvertes, collines de Yaoundé" },
      "02-salle": { src: "assets/img/flight/02-salle", alt: "La salle sous la voûte rouge, clients attablés face aux collines" },
      "03-cuisine": { src: "assets/img/flight/03-cuisine", alt: "La cheffe saisit les steaks sur la plancha, burgers dressés sur le passe" },
      "04-garde-manger": { src: "assets/img/flight/04-garde-manger", alt: "Le garde-manger : plantains, oignons, épices, porte ouverte sur la cour" },
      "05-aerien": { src: "assets/img/flight/06-aerien-arriere", alt: "Vue aérienne du restaurant au toit rouge, son parking, le boulevard et les collines de Yaoundé" },
    },

    /*
     * Vol provisoire en images fixes : chaque plan couvre une plage de secondes du film maître.
     * keys : t = seconde, s = zoom (1 = image entière), x/y = point de l'image placé au centre (0 à 1).
     * Deux plans qui se chevauchent sont fondus l'un dans l'autre (passage de porte).
     * Quand la vidéo Higgsfield est prête, assets/flight/manifest.js remplace ce mode automatiquement.
     */
    shots: [
      { still: "01-exterieur", from: 0, to: 5.8, keys: [{ t: 0, s: 1, x: 0.5, y: 0.55 }, { t: 5.8, s: 2.3, x: 0.49, y: 0.68 }] },
      { still: "02-salle", from: 4.8, to: 13.6, keys: [{ t: 4.8, s: 1.35, x: 0.6, y: 0.55 }, { t: 9, s: 1.12, x: 0.5, y: 0.52 }, { t: 13.6, s: 2.4, x: 0.445, y: 0.565 }] },
      { still: "03-cuisine", from: 12.6, to: 25.6, keys: [{ t: 12.6, s: 1.7, x: 0.5, y: 0.5 }, { t: 19, s: 1.18, x: 0.32, y: 0.6 }, { t: 25.6, s: 1.3, x: 0.75, y: 0.62 }] },
      { still: "04-garde-manger", from: 24.6, to: 30.4, keys: [{ t: 24.6, s: 1.1, x: 0.5, y: 0.5 }, { t: 30.4, s: 2.6, x: 0.48, y: 0.36 }] },
      { still: "05-aerien", from: 29.6, to: 43.4, keys: [{ t: 29.6, s: 2.8, x: 0.57, y: 0.55 }, { t: 36, s: 1.6, x: 0.56, y: 0.55 }, { t: 43.4, s: 1, x: 0.5, y: 0.5 }] },
    ],
    // Éclat de lumière quand on sort au soleil par la porte arrière.
    flashes: [{ from: 29.2, peak: 30, to: 30.8, color: "255, 226, 170", max: 0.6 }],
  },

  menu: {
    title: "La carte",
    intro: "Cinq burgers signatures, des accompagnements à partager et des boissons maison.",
    note: "Carte de démonstration. Prix indicatifs en FCFA, à confirmer.",
    currency: "FCFA",
    image: { src: "assets/img/burger-signature", alt: "Le Landri : double steak, cheddar, oignons confits et plantain frit dans un pain brioché" },
    groups: [
      {
        title: "Burgers signatures",
        items: [
          { name: "Le Landri", desc: "Double steak de bœuf écrasé, cheddar affiné, oignons confits, plantain mûr frit, sauce au poivre blanc de Penja.", price: 6500, tag: "Le plus demandé" },
          { name: "Le Mboa", desc: "Steak de bœuf grillé, sauce verte au massep et piment doux, avocat, tomate, oignon rouge.", price: 7000 },
          { name: "Le Soya", desc: "Bœuf mariné aux épices soya, arachides concassées, oignon rouge, piment, sauce fumée.", price: 7500 },
          { name: "Le DG", desc: "Poulet croustillant, plantain mûr, légumes sautés façon poulet DG, mayonnaise au pèbè.", price: 6500 },
          { name: "Le Koki", desc: "Galette de niébé grillée à l'huile de palme, feuilles de ndolè aux arachides, tomate confite.", price: 6000, tag: "Végétarien" },
        ],
      },
      {
        title: "À partager",
        items: [
          { name: "Plantain mûr frit", desc: "Sel pimenté.", price: 2000 },
          { name: "Frites maison", desc: "Au poivre blanc de Penja.", price: 2000 },
          { name: "Bâtons de manioc grillés", desc: "Beurre aux herbes.", price: 1500 },
          { name: "Brochettes de soya", desc: "Bœuf épicé, oignon, piment.", price: 3000 },
        ],
      },
      {
        title: "À boire",
        items: [
          { name: "Foléré maison", desc: "Hibiscus, menthe, glace.", price: 1500 },
          { name: "Jus de gingembre", desc: "Pressé, légèrement citronné.", price: 1500 },
          { name: "Jus de corossol", desc: "Onctueux et frais.", price: 2000 },
          { name: "Café arabica", desc: "Grains du Cameroun.", price: 1500 },
        ],
      },
    ],
  },

  maison: {
    title: "Une maison camerounaise du burger.",
    text: "Landri Burger réunit la rapidité d'un grand fast-food et le soin d'une table haut de gamme. Une équipe camerounaise, des produits d'ici, un accueil chaleureux.",
    ingredients: ["Poivre blanc de Penja", "Plantain mûr", "Pèbè", "Massep", "Foléré", "Gingembre", "Arachide", "Niébé"],
    services: [
      { icon: "users-three", title: "Sur place", text: "En salle ou en terrasse, service à table." },
      { icon: "bag", title: "À emporter", text: "Commandez au comptoir, repartez vite." },
      { icon: "moped", title: "En livraison", text: "Dans Yaoundé, modalités à confirmer." },
    ],
    images: [
      { src: "assets/img/table-partage", alt: "Table partagée : burgers, frites, brochettes de soya, foléré et jus de gingembre" },
      { src: "assets/img/terrasse", alt: "Un serveur sort sur la terrasse avec un plateau, collines de Yaoundé au coucher du soleil" },
    ],
  },

  reservation: {
    title: "Réserver une table",
    text: "Choisissez votre créneau. Nous vous confirmons la réservation par WhatsApp.",
    submit: "Envoyer la demande",
    demoMessage: "Mode démonstration : aucune demande n'a été envoyée. Ajoutez le numéro WhatsApp du restaurant dans assets/js/content.js pour activer l'envoi.",
    sentMessage: "WhatsApp s'ouvre avec votre demande pré-remplie. Envoyez le message pour la transmettre au restaurant.",
    maxGuests: 12,
  },

  visit: {
    title: "Nous trouver",
    image: { src: "assets/img/facade-soir", alt: "La façade du restaurant et son toit rouge en vague au crépuscule" },
    directionsLabel: "Itinéraire",
    deliveryLabel: "Commander en livraison",
  },

  footer: {
    line: "Burgers haut de gamme, saveurs du Cameroun.",
  },
};
