/*
 * LANDRI, AFRICAN FINE DINING - CONTENU DU SITE (bilingue FR / EN)
 * ------------------------------------------------------------------
 * Tout ce que le site affiche se modifie ici. Enregistrez puis rechargez la page.
 *
 * Règles simples :
 *  - Un texte traduit s'écrit { fr: "...", en: "..." }.
 *  - Gardez les guillemets et une virgule entre deux éléments d'une liste.
 *  - Un champ vide ("") masque l'élément correspondant sur le site.
 *  - Les prix sont en FCFA (nombre sans espace).
 */
window.LANDRI_CONTENT = {
  // Mettre à false quand l'adresse, les horaires, les prix, le chef et les contacts sont réels.
  demo: true,
  demoNotice: {
    fr: "Site de démonstration : adresse, horaires, prix, chef et contacts sont à confirmer.",
    en: "Demo website: address, opening hours, prices, chef and contacts are to be confirmed.",
  },

  languages: ["fr", "en"],
  defaultLanguage: "fr",

  brand: { name: "LANDRI", tagline: { fr: "Cuisine africaine gastronomique", en: "African Fine Dining" }, city: "Yaoundé", year: 2026 },

  contact: {
    // Numéro WhatsApp du restaurant au format international, sans + ni espaces (ex. "2376XXXXXXXX").
    // Tant qu'il est vide, le formulaire fonctionne en mode démonstration et n'envoie rien.
    whatsapp: "",
    phoneDisplay: "+237 6XX XX XX XX",
    phoneHref: "",
    address: { fr: "Adresse à confirmer", en: "Address to be confirmed" },
    district: { fr: "Yaoundé, Cameroun", en: "Yaoundé, Cameroon" },
    mapUrl: "",
    instagram: "",
    facebook: "",
    hours: [
      [{ fr: "Mardi au jeudi, dîner", en: "Tuesday to Thursday, dinner" }, { fr: "À confirmer", en: "To be confirmed" }],
      [{ fr: "Vendredi et samedi, déjeuner et dîner", en: "Friday and Saturday, lunch and dinner" }, { fr: "À confirmer", en: "To be confirmed" }],
      [{ fr: "Dimanche, déjeuner", en: "Sunday, lunch" }, { fr: "À confirmer", en: "To be confirmed" }],
    ],
  },

  // Boutons réutilisés partout : un seul libellé par intention.
  actions: {
    reserve: { label: { fr: "Réserver une table", en: "Book a table" }, href: "#reserver", style: "primary" },
    menu: { label: { fr: "Explorer la carte", en: "Explore the menu" }, href: "#carte", style: "ghost" },
    visit: { label: { fr: "Nous trouver", en: "Find us" }, href: "#visite", style: "ghost", icon: "map-pin" },
  },

  nav: [
    { label: { fr: "La carte", en: "Menu" }, href: "#carte" },
    { label: { fr: "Notre histoire", en: "Our story" }, href: "#histoire" },
    { label: { fr: "Le chef", en: "The chef" }, href: "#chef" },
    { label: { fr: "L'expérience", en: "Experience" }, href: "#experience" },
    { label: { fr: "Nous trouver", en: "Find us" }, href: "#visite" },
  ],

  // Petits textes d'interface.
  ui: {
    skipLink: { fr: "Aller au contenu", en: "Skip to content" },
    skipTour: { fr: "Passer la visite", en: "Skip the tour" },
    openMenu: { fr: "Ouvrir le menu", en: "Open menu" },
    closeMenu: { fr: "Fermer le menu", en: "Close menu" },
    language: { fr: "Langue", en: "Language" },
    discover: { fr: "Découvrir", en: "Discover" },
    ingredients: { fr: "Ingrédients", en: "Ingredients" },
    origin: { fr: "Origine", en: "Origin" },
    close: { fr: "Fermer", en: "Close" },
    flightLabel: { fr: "Visite du restaurant LANDRI", en: "A tour of LANDRI restaurant" },
    menuCategories: { fr: "Catégories de la carte", en: "Menu categories" },
  },

  /*
   * CHAPITRES DU VOL (textes qui apparaissent pendant la visite)
   * layout : "hero" | "left" | "right" | "end"  (position du texte : "end" = en bas à gauche)
   * still  : image représentative utilisée en mode fixe (mouvement réduit, petit débit).
   * actions : clés de "actions", ou { use: "menu", style: "primary" } pour changer le style.
   */
  chapters: [
    {
      id: "arrivee", layout: "hero", still: "arrivee",
      eyebrow: { fr: "African Fine Dining, Yaoundé", en: "African Fine Dining, Yaoundé" },
      title: { fr: "Entrez à la grande table de l'Afrique.", en: "Step into Africa's finest table." },
      text: { fr: "Recettes ancestrales, techniques contemporaines, hospitalité camerounaise. La soirée commence dès le seuil.", en: "Ancestral recipes, contemporary techniques, Cameroonian hospitality. The evening begins at the door." },
      actions: ["reserve", "menu"],
    },
    {
      id: "salle", layout: "end", still: "salle",
      title: { fr: "Bois sculpté, terre cuite, lumière d'ambre.", en: "Carved wood, terracotta, amber light." },
      text: { fr: "Une salle pensée comme une maison africaine contemporaine : l'art d'aujourd'hui, l'artisanat d'hier, des tables dressées avec soin.", en: "A dining room imagined as a contemporary African home: today's art, yesterday's craft, tables set with care." },
      actions: [],
    },
    {
      id: "cuisine", layout: "end", still: "cuisine",
      title: { fr: "En cuisine, chaque geste compte.", en: "In the kitchen, every gesture counts." },
      text: { fr: "Découpe, braise, cuisson lente, sauces mijotées : nos chefs travaillent les recettes du continent avec la précision de la haute gastronomie.", en: "Knife work, open-fire grilling, slow cooking, simmered sauces: our chefs treat the continent's recipes with fine-dining precision." },
      actions: [],
    },
    {
      id: "ingredients", layout: "right", still: "ingredients",
      title: { fr: "Tout commence par le produit.", en: "It all begins with the produce." },
      text: { fr: "Plantain, igname, manioc, piment, gingembre, arachide, poisson frais. Le meilleur des terroirs africains, sélectionné avec exigence.", en: "Plantain, yam, cassava, chilli, ginger, peanut, fresh fish. The finest African produce, chosen with care." },
      actions: [],
    },
    {
      id: "dressage", layout: "left", still: "dressage",
      title: { fr: "Le dressage, comme une signature.", en: "Plating, like a signature." },
      text: { fr: "Une sauce posée d'un geste, une herbe, un éclat de plantain. Rien de trop, tout est juste.", en: "A stroke of sauce, a single herb, a shard of plantain. Nothing more than needed." },
      actions: [],
    },
    {
      id: "plat", layout: "right", still: "plat",
      title: { fr: "Le ndolé aux crevettes, réinventé.", en: "Ndolé with prawns, reimagined." },
      text: { fr: "Feuilles amères et arachide, crevettes grillées, chips de plantain. Le grand classique camerounais, à la hauteur des plus belles tables.", en: "Bitter leaf and peanut, grilled prawns, plantain crisps. Cameroon's great classic, worthy of the world's finest tables." },
      actions: ["menu"],
    },
    {
      id: "service", layout: "right", still: "service",
      title: { fr: "Servi comme on reçoit en famille.", en: "Served the way family is welcomed." },
      text: { fr: "La cuisine africaine n'est pas seulement belle : elle se partage, elle rassemble, elle se vit.", en: "African cuisine is not only beautiful: it is shared, it brings people together, it is lived." },
      actions: [],
    },
    {
      id: "conclusion", layout: "end", still: "ambiance",
      eyebrow: { fr: "LANDRI, African Fine Dining", en: "LANDRI, African Fine Dining" },
      title: { fr: "Le goût de l'Afrique, réinventé.", en: "The taste of Africa, reimagined." },
      text: { fr: "Découvrez la cuisine africaine autrement.", en: "Discover African cuisine differently." },
      actions: [{ use: "menu", style: "primary" }, { use: "reserve", style: "ghost" }],
    },
  ],

  /*
   * TIMELINE DU VOL (défilement -> images du film)
   * vh      : distance de défilement de l'étape, en hauteurs d'écran (100 = un écran).
   * from/to : secondes du film maître au début et à la fin de l'étape (from = to : plan fixe).
   * chapter : chapitre dont le texte est visible (null = pas de texte).
   * focus   : sur téléphone, partie de l'image gardée au centre (0 = gauche, 0,5 = centre, 1 = droite).
   */
  flight: {
    // Film maître : production/video/flythrough-master.mp4 (57,6 s, 1 152 images à 20 i/s).
    duration: 57.6,
    beats: [
      { id: "ouverture", vh: 55, from: 0, to: 0, chapter: "arrivee" },                // plan fixe : le titre se lit
      { id: "arrivee", vh: 120, from: 0, to: 5.5, chapter: "arrivee" },              // accueil, portes sculptées
      { id: "salle", vh: 150, from: 5.5, to: 12, chapter: "salle" },                  // la salle, l'art, les tables
      { id: "vers-cuisine", vh: 60, from: 12, to: 17.2, chapter: null },              // vers la cuisine ouverte
      { id: "cuisine", vh: 150, from: 17.2, to: 24.6, chapter: "cuisine" },          // assaisonnement, grill
      { id: "ingredients", vh: 120, from: 24.6, to: 29.2, chapter: "ingredients" },  // gros plans produits
      { id: "vers-passe", vh: 45, from: 29.2, to: 32.3, chapter: null },              // le chef à la passe
      { id: "dressage", vh: 150, from: 32.3, to: 37.8, chapter: "dressage" },        // très gros plan
      { id: "plat", vh: 130, from: 37.8, to: 43, chapter: "plat", focus: 0.45 },     // le plat signature
      { id: "service", vh: 160, from: 43, to: 51.5, chapter: "service" },            // le serveur, la table
      { id: "recul", vh: 140, from: 51.5, to: 57.5, chapter: "conclusion" },         // dégustation, recul
      { id: "plan-final", vh: 80, from: 57.5, to: 57.5, chapter: "conclusion" },     // plan fixe final
    ],

    // Images fixes des chapitres (mode mouvement réduit, et vol de secours sans vidéo).
    stills: {
      arrivee: { src: "assets/img/flight/arrivee", alt: { fr: "L'entrée de LANDRI au crépuscule, portes en bois sculpté ouvertes, personnel et invités", en: "LANDRI's entrance at dusk, carved wooden doors open, staff and guests" } },
      salle: { src: "assets/img/flight/salle", alt: { fr: "La salle : panneaux de bois sculpté, art africain contemporain, suspensions en raphia", en: "The dining room: carved wood panels, contemporary African art, raffia lamps" } },
      cuisine: { src: "assets/img/flight/cuisine", alt: { fr: "Un chef taille le plantain dans la cuisine ouverte, grill au charbon derrière", en: "A chef slices plantain in the open kitchen, charcoal grill behind" } },
      ingredients: { src: "assets/img/flight/ingredients", alt: { fr: "Plantains, ignames, piments, gingembre, épices, poisson et crevettes sur glace", en: "Plantains, yams, chillies, ginger, spices, fish and prawns on ice" } },
      dressage: { src: "assets/img/flight/dressage", alt: { fr: "Le chef dresse le ndolé aux crevettes à la pince", en: "The chef plates ndolé with prawns using tweezers" } },
      plat: { src: "assets/img/flight/plat", alt: { fr: "Le ndolé aux crevettes grillées et chips de plantain", en: "Ndolé with grilled prawns and plantain crisps" } },
      service: { src: "assets/img/flight/service", alt: { fr: "Un serveur dépose le plat devant des invitées ravies", en: "A waiter serves the dish to delighted guests" } },
      ambiance: { src: "assets/img/flight/ambiance", alt: { fr: "La salle entière en plein service, familles, couples et amis", en: "The whole room in full service, families, couples and friends" } },
    },

    // Vol de secours en images fixes (utilisé seulement si la séquence vidéo manque).
    shots: [
      { still: "arrivee", from: 0, to: 6.8, keys: [{ t: 0, s: 1, x: 0.5, y: 0.55 }, { t: 6.8, s: 2.2, x: 0.53, y: 0.62 }] },
      { still: "salle", from: 5.8, to: 13, keys: [{ t: 5.8, s: 1.3, x: 0.55, y: 0.55 }, { t: 13, s: 1.6, x: 0.35, y: 0.5 }] },
      { still: "cuisine", from: 12, to: 23.8, keys: [{ t: 12, s: 1.5, x: 0.5, y: 0.5 }, { t: 23.8, s: 1.15, x: 0.6, y: 0.55 }] },
      { still: "ingredients", from: 22.8, to: 30.8, keys: [{ t: 22.8, s: 1.4, x: 0.3, y: 0.55 }, { t: 30.8, s: 1.1, x: 0.65, y: 0.55 }] },
      { still: "dressage", from: 29.8, to: 37.8, keys: [{ t: 29.8, s: 1.1, x: 0.5, y: 0.5 }, { t: 37.8, s: 1.5, x: 0.45, y: 0.6 }] },
      { still: "plat", from: 36.8, to: 44.8, keys: [{ t: 36.8, s: 1.4, x: 0.5, y: 0.6 }, { t: 44.8, s: 1.05, x: 0.5, y: 0.55 }] },
      { still: "service", from: 43.8, to: 51.8, keys: [{ t: 43.8, s: 1.3, x: 0.45, y: 0.5 }, { t: 51.8, s: 1.05, x: 0.5, y: 0.5 }] },
      { still: "ambiance", from: 50.8, to: 57.6, keys: [{ t: 50.8, s: 1.6, x: 0.5, y: 0.55 }, { t: 57.6, s: 1, x: 0.5, y: 0.5 }] },
    ],
    flashes: [],
  },

  /*
   * LA CARTE
   * Chaque plat : id, img (photo), name, desc, ingredients (liste), price (FCFA), origin, tag (facultatif).
   */
  menu: {
    title: { fr: "La carte", en: "The menu" },
    intro: { fr: "Les grands classiques du continent, réinterprétés avec la rigueur de la haute gastronomie.", en: "The continent's great classics, reinterpreted with fine-dining rigour." },
    note: { fr: "Carte de démonstration. Prix indicatifs en FCFA, à confirmer.", en: "Demo menu. Indicative prices in FCFA, to be confirmed." },
    currency: "FCFA",
    categories: [
      {
        id: "entrees", title: { fr: "Entrées", en: "Starters" },
        items: [
          { id: "accras-crevettes", name: { fr: "Accras de crevettes", en: "Prawn accras" }, desc: { fr: "Beignets aériens de crevettes, mayonnaise au poivre blanc de Penja.", en: "Airy prawn fritters, Penja white pepper mayonnaise." }, ingredients: { fr: ["Crevettes", "Ciboule", "Piment doux", "Citron vert"], en: ["Prawns", "Spring onion", "Mild chilli", "Lime"] }, price: 7500, origin: { fr: "Afrique de l'Ouest", en: "West Africa" } },
          { id: "pastels", name: { fr: "Pastels", en: "Pastels" }, desc: { fr: "Chaussons croustillants au thon épicé, sauce tomate pimentée.", en: "Crisp turnovers filled with spiced tuna, tomato and chilli sauce." }, ingredients: { fr: ["Thon", "Oignon", "Piment", "Tomate"], en: ["Tuna", "Onion", "Chilli", "Tomato"] }, price: 6500, origin: { fr: "Sénégal", en: "Senegal" } },
          { id: "samoussas", name: { fr: "Samoussas africains", en: "African samosas" }, desc: { fr: "Bœuf épicé et petits pois, chutney de mangue, coriandre fraîche.", en: "Spiced beef and green peas, mango chutney, fresh coriander." }, ingredients: { fr: ["Bœuf", "Petits pois", "Mangue", "Coriandre"], en: ["Beef", "Green peas", "Mango", "Coriander"] }, price: 6500, origin: { fr: "Afrique de l'Est", en: "East Africa" } },
          { id: "salade-avocat-crevettes", name: { fr: "Avocat et crevettes", en: "Avocado and prawns" }, desc: { fr: "Avocat mûr, crevettes pochées, agrumes, quelques gouttes d'huile de palme rouge.", en: "Ripe avocado, poached prawns, citrus, a few drops of red palm oil." }, ingredients: { fr: ["Avocat", "Crevettes", "Agrumes", "Herbes"], en: ["Avocado", "Prawns", "Citrus", "Herbs"] }, price: 8500, origin: { fr: "Afrique centrale", en: "Central Africa" } },
          { id: "brochettes-crevettes", name: { fr: "Brochettes de crevettes", en: "Prawn skewers" }, desc: { fr: "Crevettes géantes grillées au charbon, beurre au pèbè, citron brûlé.", en: "Charcoal-grilled king prawns, pèbè spice butter, charred lime." }, ingredients: { fr: ["Crevettes", "Pèbè", "Beurre", "Citron vert"], en: ["Prawns", "Pèbè spice", "Butter", "Lime"] }, price: 9500, origin: { fr: "Cameroun", en: "Cameroon" } },
          { id: "beignets-plantain", name: { fr: "Beignets de plantain", en: "Plantain fritters" }, desc: { fr: "Plantain bien mûr frit, sauce au piment doux.", en: "Very ripe plantain fritters, mild chilli dip." }, ingredients: { fr: ["Plantain mûr", "Épices", "Piment doux"], en: ["Ripe plantain", "Spices", "Mild chilli"] }, price: 5500, origin: { fr: "Afrique centrale", en: "Central Africa" }, tag: { fr: "Végétarien", en: "Vegetarian" } },
        ],
      },
      {
        id: "plats", title: { fr: "Plats", en: "Mains" },
        items: [
          { id: "ndole-crevettes", name: { fr: "Ndolé aux crevettes", en: "Ndolé with prawns" }, desc: { fr: "Feuilles de ndolé à l'arachide, crevettes grillées, chips de plantain, huile de piment.", en: "Bitter leaf and peanut stew, grilled prawns, plantain crisps, chilli oil." }, ingredients: { fr: ["Feuilles de ndolé", "Arachide", "Crevettes", "Plantain"], en: ["Bitter leaf", "Peanut", "Prawns", "Plantain"] }, price: 16500, origin: { fr: "Cameroun", en: "Cameroon" }, tag: { fr: "Signature", en: "Signature" } },
          { id: "poulet-dg", name: { fr: "Poulet DG", en: "Poulet DG" }, desc: { fr: "Poulet fermier rôti, plantain caramélisé, légumes croquants, sauce tomate au poivron.", en: "Roast farm chicken, caramelised plantain, crisp vegetables, tomato and pepper sauce." }, ingredients: { fr: ["Poulet fermier", "Plantain mûr", "Carotte", "Haricots verts"], en: ["Farm chicken", "Ripe plantain", "Carrot", "Green beans"] }, price: 15500, origin: { fr: "Cameroun", en: "Cameroon" } },
          { id: "poulet-braise", name: { fr: "Poulet braisé", en: "Charcoal-braised chicken" }, desc: { fr: "Mariné au gingembre et à l'ail, braisé au charbon, plantain rôti, sauce au piment.", en: "Ginger and garlic marinade, charcoal-braised, roasted plantain, chilli sauce." }, ingredients: { fr: ["Poulet", "Gingembre", "Ail", "Plantain"], en: ["Chicken", "Ginger", "Garlic", "Plantain"] }, price: 14000, origin: { fr: "Afrique centrale", en: "Central Africa" } },
          { id: "poisson-braise", name: { fr: "Poisson braisé", en: "Charcoal-braised fish" }, desc: { fr: "Poisson entier braisé aux épices njansang, condiment tomate, bâtons de manioc.", en: "Whole fish braised with njansang spice, tomato relish, cassava sticks." }, ingredients: { fr: ["Poisson entier", "Njansang", "Tomate", "Manioc"], en: ["Whole fish", "Njansang", "Tomato", "Cassava"] }, price: 18500, origin: { fr: "Cameroun", en: "Cameroon" } },
          { id: "mafe", name: { fr: "Mafé", en: "Mafé" }, desc: { fr: "Bœuf confit dans une sauce d'arachide soyeuse, patate douce rôtie, riz parfumé.", en: "Beef confit in a silky peanut sauce, roasted sweet potato, fragrant rice." }, ingredients: { fr: ["Bœuf", "Pâte d'arachide", "Patate douce", "Riz"], en: ["Beef", "Peanut paste", "Sweet potato", "Rice"] }, price: 15000, origin: { fr: "Mali et Sénégal", en: "Mali and Senegal" } },
          { id: "poulet-yassa", name: { fr: "Poulet yassa", en: "Chicken yassa" }, desc: { fr: "Cuisse fondante, oignons confits au citron et à la moutarde, olives vertes.", en: "Tender chicken leg, onions slow-cooked with lemon and mustard, green olives." }, ingredients: { fr: ["Poulet", "Oignon", "Citron", "Moutarde"], en: ["Chicken", "Onion", "Lemon", "Mustard"] }, price: 14500, origin: { fr: "Sénégal", en: "Senegal" } },
          { id: "thieboudienne", name: { fr: "Thiéboudienne", en: "Thiéboudienne" }, desc: { fr: "Filet de mérou, riz cassé à la tomate, légumes fondants, rof aux herbes.", en: "Grouper fillet, tomato broken rice, tender vegetables, herb rof." }, ingredients: { fr: ["Mérou", "Riz cassé", "Tomate", "Manioc", "Chou"], en: ["Grouper", "Broken rice", "Tomato", "Cassava", "Cabbage"] }, price: 19500, origin: { fr: "Sénégal", en: "Senegal" } },
          { id: "jollof-rice", name: { fr: "Jollof rice", en: "Jollof rice" }, desc: { fr: "Riz fumé tomate et poivron, poulet grillé, plantain doré.", en: "Smoky tomato and pepper rice, grilled chicken, golden plantain." }, ingredients: { fr: ["Riz", "Tomate", "Poivron", "Poulet", "Plantain"], en: ["Rice", "Tomato", "Pepper", "Chicken", "Plantain"] }, price: 13500, origin: { fr: "Nigeria et Ghana", en: "Nigeria and Ghana" } },
          { id: "sauce-arachide", name: { fr: "Sauce arachide", en: "Peanut sauce" }, desc: { fr: "Poulet fumé dans une sauce d'arachide veloutée, gombo et piment frais.", en: "Smoked chicken in a velvety peanut sauce, okra and fresh chilli." }, ingredients: { fr: ["Poulet fumé", "Arachide", "Gombo", "Piment"], en: ["Smoked chicken", "Peanut", "Okra", "Chilli"] }, price: 13500, origin: { fr: "Afrique centrale", en: "Central Africa" } },
          { id: "cote-de-boeuf", name: { fr: "Côte de bœuf aux épices africaines", en: "Côte de bœuf with African spices" }, desc: { fr: "Croûte d'épices soya et pèbè, jus réduit au poivre blanc de Penja.", en: "Soya and pèbè spice crust, reduced jus with Penja white pepper." }, ingredients: { fr: ["Côte de bœuf", "Épices soya", "Pèbè", "Poivre de Penja"], en: ["Rib of beef", "Soya spice", "Pèbè", "Penja pepper"] }, price: 32000, origin: { fr: "Cameroun", en: "Cameroon" } },
        ],
      },
      {
        id: "accompagnements", title: { fr: "Accompagnements", en: "Sides" },
        items: [
          { id: "plantain-roti", name: { fr: "Plantain rôti", en: "Roasted plantain" }, desc: { fr: "Rôti jusqu'à caramélisation, fleur de sel pimentée.", en: "Roasted until caramelised, chilli sea salt." }, ingredients: { fr: ["Plantain mûr", "Fleur de sel", "Piment"], en: ["Ripe plantain", "Sea salt", "Chilli"] }, price: 3000, origin: { fr: "Afrique centrale", en: "Central Africa" } },
          { id: "igname", name: { fr: "Igname", en: "Yam" }, desc: { fr: "Purée soyeuse au beurre noisette et ciboulette.", en: "Silky purée with brown butter and chives." }, ingredients: { fr: ["Igname", "Beurre noisette", "Ciboulette"], en: ["Yam", "Brown butter", "Chives"] }, price: 3000, origin: { fr: "Afrique de l'Ouest", en: "West Africa" } },
          { id: "manioc", name: { fr: "Manioc", en: "Cassava" }, desc: { fr: "Bâtons de manioc grillés, sel de mer.", en: "Grilled cassava sticks, sea salt." }, ingredients: { fr: ["Manioc", "Sel de mer"], en: ["Cassava", "Sea salt"] }, price: 2500, origin: { fr: "Afrique centrale", en: "Central Africa" } },
          { id: "attieke", name: { fr: "Attiéké", en: "Attiéké" }, desc: { fr: "Semoule de manioc, tomate, oignon rouge et piment.", en: "Cassava couscous, tomato, red onion and chilli." }, ingredients: { fr: ["Attiéké", "Tomate", "Oignon rouge"], en: ["Attiéké", "Tomato", "Red onion"] }, price: 3000, origin: { fr: "Côte d'Ivoire", en: "Côte d'Ivoire" } },
          { id: "riz-parfume", name: { fr: "Riz parfumé", en: "Fragrant rice" }, desc: { fr: "Riz jasmin au gingembre et aux herbes.", en: "Jasmine rice with ginger and herbs." }, ingredients: { fr: ["Riz jasmin", "Gingembre", "Herbes"], en: ["Jasmine rice", "Ginger", "Herbs"] }, price: 2500, origin: { fr: "Afrique de l'Ouest", en: "West Africa" } },
          { id: "patate-douce", name: { fr: "Patate douce", en: "Sweet potato" }, desc: { fr: "Rôtie au miel et au piment.", en: "Roasted with honey and chilli." }, ingredients: { fr: ["Patate douce", "Miel", "Piment"], en: ["Sweet potato", "Honey", "Chilli"] }, price: 3000, origin: { fr: "Afrique de l'Est", en: "East Africa" } },
          { id: "legumes-sautes", name: { fr: "Légumes sautés", en: "Sautéed vegetables" }, desc: { fr: "Légumes du marché, ail et gingembre.", en: "Market vegetables, garlic and ginger." }, ingredients: { fr: ["Légumes du marché", "Ail", "Gingembre"], en: ["Market vegetables", "Garlic", "Ginger"] }, price: 3000, origin: { fr: "Cameroun", en: "Cameroon" } },
        ],
      },
      {
        id: "desserts", title: { fr: "Desserts", en: "Desserts" },
        items: [
          { id: "dessert-bissap", name: { fr: "Bissap", en: "Bissap" }, desc: { fr: "Gelée d'hibiscus, crème légère à la vanille, éclats de meringue.", en: "Hibiscus jelly, light vanilla cream, meringue shards." }, ingredients: { fr: ["Hibiscus", "Vanille", "Crème", "Meringue"], en: ["Hibiscus", "Vanilla", "Cream", "Meringue"] }, price: 6000, origin: { fr: "Afrique de l'Ouest", en: "West Africa" } },
          { id: "mousse-chocolat-epices", name: { fr: "Chocolat et épices", en: "Chocolate and spices" }, desc: { fr: "Mousse au chocolat noir, épices africaines, grué de cacao.", en: "Dark chocolate mousse, African spices, cocoa nibs." }, ingredients: { fr: ["Chocolat noir", "Grué de cacao", "Poivre de Penja"], en: ["Dark chocolate", "Cocoa nibs", "Penja pepper"] }, price: 6500, origin: { fr: "Cameroun", en: "Cameroon" } },
          { id: "mangue-fraiche", name: { fr: "Mangue fraîche", en: "Fresh mango" }, desc: { fr: "Mangue mûre, zeste de citron vert, sorbet coco.", en: "Ripe mango, lime zest, coconut sorbet." }, ingredients: { fr: ["Mangue", "Citron vert", "Coco"], en: ["Mango", "Lime", "Coconut"] }, price: 5500, origin: { fr: "Afrique de l'Ouest", en: "West Africa" } },
          { id: "ananas-roti", name: { fr: "Ananas rôti au gingembre", en: "Ginger-roasted pineapple" }, desc: { fr: "Ananas caramélisé, gingembre frais, glace vanille, caramel épicé.", en: "Caramelised pineapple, fresh ginger, vanilla ice cream, spiced caramel." }, ingredients: { fr: ["Ananas", "Gingembre", "Vanille"], en: ["Pineapple", "Ginger", "Vanilla"] }, price: 6000, origin: { fr: "Cameroun", en: "Cameroon" } },
          { id: "creme-coco", name: { fr: "Crème de coco", en: "Coconut cream" }, desc: { fr: "Panna cotta coco, fruit de la passion, coco torréfiée.", en: "Coconut panna cotta, passion fruit, toasted coconut." }, ingredients: { fr: ["Coco", "Fruit de la passion"], en: ["Coconut", "Passion fruit"] }, price: 5500, origin: { fr: "Afrique de l'Est", en: "East Africa" } },
          { id: "plantain-caramelise", name: { fr: "Plantain caramélisé", en: "Caramelised plantain" }, desc: { fr: "Plantain mûr caramélisé, glace à l'arachide grillée, pralin.", en: "Caramelised ripe plantain, roasted peanut ice cream, praline." }, ingredients: { fr: ["Plantain mûr", "Arachide", "Caramel"], en: ["Ripe plantain", "Peanut", "Caramel"] }, price: 6000, origin: { fr: "Afrique centrale", en: "Central Africa" } },
        ],
      },
      {
        id: "boissons", title: { fr: "Boissons", en: "Drinks" },
        items: [
          { id: "boisson-bissap", name: { fr: "Bissap", en: "Bissap" }, desc: { fr: "Infusion glacée d'hibiscus, menthe fraîche.", en: "Iced hibiscus infusion, fresh mint." }, ingredients: { fr: ["Hibiscus", "Menthe"], en: ["Hibiscus", "Mint"] }, price: 2500, origin: { fr: "Afrique de l'Ouest", en: "West Africa" } },
          { id: "boisson-gingembre", name: { fr: "Gingembre", en: "Ginger" }, desc: { fr: "Jus de gingembre pressé, citron.", en: "Pressed ginger juice, lemon." }, ingredients: { fr: ["Gingembre", "Citron"], en: ["Ginger", "Lemon"] }, price: 2500, origin: { fr: "Afrique de l'Ouest", en: "West Africa" } },
          { id: "boisson-baobab", name: { fr: "Jus de baobab", en: "Baobab drink" }, desc: { fr: "Pulpe de baobab, vanille, onctueux et frais.", en: "Baobab pulp, vanilla, creamy and fresh." }, ingredients: { fr: ["Baobab", "Vanille"], en: ["Baobab", "Vanilla"] }, price: 3000, origin: { fr: "Sénégal", en: "Senegal" } },
          { id: "boisson-tamarin", name: { fr: "Tamarin", en: "Tamarind" }, desc: { fr: "Jus de tamarin, légèrement acidulé.", en: "Tamarind juice, lightly tangy." }, ingredients: { fr: ["Tamarin"], en: ["Tamarind"] }, price: 2500, origin: { fr: "Afrique de l'Ouest", en: "West Africa" } },
          { id: "cocktail-sans-alcool", name: { fr: "Cocktail LANDRI sans alcool", en: "LANDRI alcohol-free cocktail" }, desc: { fr: "Bissap, gingembre, citron vert, eau pétillante.", en: "Bissap, ginger, lime, sparkling water." }, ingredients: { fr: ["Hibiscus", "Gingembre", "Citron vert"], en: ["Hibiscus", "Ginger", "Lime"] }, price: 4500, origin: { fr: "Maison", en: "House creation" } },
          { id: "jus-tropical", name: { fr: "Jus tropical", en: "Tropical juice" }, desc: { fr: "Mangue, ananas et fruit de la passion.", en: "Mango, pineapple and passion fruit." }, ingredients: { fr: ["Mangue", "Ananas", "Passion"], en: ["Mango", "Pineapple", "Passion fruit"] }, price: 3500, origin: { fr: "Cameroun", en: "Cameroon" } },
        ],
      },
    ],
  },

  story: {
    title: { fr: "Notre histoire", en: "Our story" },
    lead: { fr: "Nous ne reproduisons pas simplement les recettes africaines. Nous les réinterprétons.", en: "We do not simply reproduce African recipes. We reinterpret them." },
    paragraphs: [
      { fr: "Tout part des cuisines familiales : le ndolé qui mijote le dimanche, le poisson braisé au bord de la route, les épices pilées à la main. Ces gestes se transmettent depuis des générations.", en: "It all starts in family kitchens: ndolé simmering on Sundays, fish braised by the roadside, spices crushed by hand. These gestures have been passed down for generations." },
      { fr: "Chez LANDRI, nous gardons l'âme de ces recettes et nous les travaillons avec les techniques de la haute gastronomie : cuissons précises, sauces affinées, dressages épurés. Une cuisine fière de ses racines, tournée vers demain.", en: "At LANDRI, we keep the soul of these recipes and refine them with fine-dining techniques: precise cooking, refined sauces, restrained plating. A cuisine proud of its roots and looking ahead." },
    ],
    values: [
      { title: { fr: "Héritage", en: "Heritage" }, text: { fr: "Les recettes des anciens comme point de départ.", en: "Our elders' recipes as a starting point." } },
      { title: { fr: "Traditions", en: "Traditions" }, text: { fr: "Le respect des cuissons longues et des saveurs justes.", en: "Respect for slow cooking and true flavours." } },
      { title: { fr: "Produits locaux", en: "Local produce" }, text: { fr: "Des producteurs camerounais choisis avec exigence.", en: "Cameroonian growers chosen with care." } },
      { title: { fr: "Transmission", en: "Transmission" }, text: { fr: "Une brigade qui forme et qui apprend.", en: "A kitchen team that teaches and learns." } },
      { title: { fr: "Modernité", en: "Modernity" }, text: { fr: "Des techniques d'aujourd'hui au service du goût.", en: "Today's techniques in the service of taste." } },
      { title: { fr: "Créativité", en: "Creativity" }, text: { fr: "Des associations nouvelles, jamais gratuites.", en: "New pairings, never for show." } },
      { title: { fr: "Identité", en: "Identity" }, text: { fr: "Une cuisine qui dit d'où elle vient.", en: "A cuisine that knows where it comes from." } },
    ],
    image: { src: "assets/img/sections/chef-geste", alt: { fr: "Les mains d'un chef déposent la sauce du ndolé sur l'assiette", en: "A chef's hands spooning ndolé sauce onto the plate" } },
  },

  origins: {
    title: { fr: "Nos origines", en: "Our origins" },
    intro: { fr: "L'Afrique n'a pas une cuisine, elle en a mille. Notre carte célèbre la diversité de ses traditions culinaires, région par région.", en: "Africa does not have one cuisine, it has a thousand. Our menu celebrates the diversity of its culinary traditions, region by region." },
    regions: [
      { id: "centrale", name: { fr: "Afrique centrale", en: "Central Africa" }, places: { fr: "Cameroun, Gabon, Congo", en: "Cameroon, Gabon, Congo" }, text: { fr: "Feuilles amères, arachide, poisson fumé, poivre blanc de Penja : la maison de nos recettes signatures.", en: "Bitter leaves, peanut, smoked fish, Penja white pepper: the home of our signature recipes." }, dishes: { fr: "Ndolé, poulet DG, poisson braisé", en: "Ndolé, poulet DG, braised fish" }, img: "assets/img/sections/origine-centrale" },
      { id: "ouest", name: { fr: "Afrique de l'Ouest", en: "West Africa" }, places: { fr: "Sénégal, Mali, Côte d'Ivoire, Nigeria, Ghana", en: "Senegal, Mali, Côte d'Ivoire, Nigeria, Ghana" }, text: { fr: "Riz parfumés, sauces d'arachide, oignons confits, hibiscus : l'art du mijoté et du partage.", en: "Fragrant rice, peanut sauces, slow-cooked onions, hibiscus: the art of simmering and sharing." }, dishes: { fr: "Thiéboudienne, yassa, mafé, jollof", en: "Thiéboudienne, yassa, mafé, jollof" }, img: "assets/img/sections/origine-ouest" },
      { id: "est", name: { fr: "Afrique de l'Est", en: "East Africa" }, places: { fr: "Éthiopie, Kenya, Tanzanie", en: "Ethiopia, Kenya, Tanzania" }, text: { fr: "Injera, ragoûts épicés, pilau aux clous de girofle : des épices venues des routes de l'océan Indien.", en: "Injera, spiced stews, clove-scented pilau: spices carried along Indian Ocean routes." }, dishes: { fr: "Doro wat, pilau, nyama choma", en: "Doro wat, pilau, nyama choma" }, img: "assets/img/sections/origine-est" },
      { id: "nord", name: { fr: "Afrique du Nord", en: "North Africa" }, places: { fr: "Maroc, Algérie, Tunisie, Égypte", en: "Morocco, Algeria, Tunisia, Egypt" }, text: { fr: "Tajines, couscous, citrons confits, ras el hanout : la douceur des épices et des cuissons lentes.", en: "Tagines, couscous, preserved lemons, ras el hanout: gentle spices and slow cooking." }, dishes: { fr: "Tajine, couscous, harissa", en: "Tagine, couscous, harissa" }, img: "assets/img/sections/origine-nord" },
      { id: "australe", name: { fr: "Afrique australe", en: "Southern Africa" }, places: { fr: "Afrique du Sud, Mozambique, Zimbabwe", en: "South Africa, Mozambique, Zimbabwe" }, text: { fr: "Feu de bois, piment peri-peri, chakalaka : une cuisine de braise et de convivialité.", en: "Wood fire, peri-peri chilli, chakalaka: a cuisine of embers and conviviality." }, dishes: { fr: "Bobotie, chakalaka, crevettes peri-peri", en: "Bobotie, chakalaka, peri-peri prawns" }, img: "assets/img/sections/origine-australe" },
    ],
  },

  chef: {
    title: { fr: "Le chef", en: "Meet the chef" },
    quote: { fr: "La tradition est notre fondation. La créativité, notre langage.", en: "Tradition is our foundation. Creativity is our language." },
    name: { fr: "Nom du chef à confirmer", en: "Chef's name to be confirmed" },
    role: { fr: "Chef exécutif", en: "Executive chef" },
    philosophy: { fr: "Respecter le produit, comprendre l'histoire d'une recette avant de la transformer, et ne garder dans l'assiette que ce qui sert le goût.", en: "Respect the produce, understand a recipe's story before transforming it, and keep on the plate only what serves the flavour." },
    path: { fr: "Parcours à compléter : formation, maisons fréquentées et étapes marquantes du chef.", en: "Career to be completed: training, kitchens and milestones of the chef." },
    vision: { fr: "Montrer que la cuisine africaine peut être servie avec la même exigence que les plus grandes tables du monde, sans jamais perdre son âme.", en: "Show that African cuisine can be served with the same exacting standards as the world's greatest tables, without ever losing its soul." },
    specialties: { fr: ["Ndolé aux crevettes", "Poisson braisé au njansang", "Côte de bœuf aux épices africaines"], en: ["Ndolé with prawns", "Njansang-braised fish", "Côte de bœuf with African spices"] },
    labels: { philosophy: { fr: "Philosophie", en: "Philosophy" }, path: { fr: "Parcours", en: "Career" }, vision: { fr: "Vision", en: "Vision" }, specialties: { fr: "Spécialités", en: "Specialities" } },
    portrait: { src: "assets/img/sections/chef-portrait", alt: { fr: "Portrait du chef exécutif à la passe de la cuisine", en: "Portrait of the executive chef at the kitchen pass" } },
  },

  experience: {
    title: { fr: "The African Table", en: "The African Table" },
    intro: { fr: "Plus qu'un repas : une expérience culturelle et gastronomique, du premier accueil au dernier café.", en: "More than a meal: a cultural and culinary experience, from the first welcome to the last coffee." },
    pillars: [
      { icon: "fork-knife", title: { fr: "Cuisine", en: "Cuisine" }, text: { fr: "Les recettes du continent, travaillées avec précision.", en: "The continent's recipes, crafted with precision." } },
      { icon: "music-notes", title: { fr: "Musique", en: "Music" }, text: { fr: "Kora, jazz africain et sélections d'ambiance, toujours en douceur.", en: "Kora, African jazz and soft ambient selections." } },
      { icon: "armchair", title: { fr: "Décoration", en: "Design" }, text: { fr: "Bois sculpté, terre cuite, art contemporain africain.", en: "Carved wood, terracotta, contemporary African art." } },
      { icon: "bell", title: { fr: "Service", en: "Service" }, text: { fr: "Attentif, discret, à l'écoute de chaque table.", en: "Attentive, discreet, tuned to every table." } },
      { icon: "hand-heart", title: { fr: "Hospitalité", en: "Hospitality" }, text: { fr: "L'accueil camerounais, chaleureux et sincère.", en: "Cameroonian welcome, warm and sincere." } },
      { icon: "globe-hemisphere-east", title: { fr: "Culture", en: "Culture" }, text: { fr: "Soirées thématiques, artistes et producteurs invités.", en: "Themed evenings, guest artists and growers." } },
    ],
    images: [
      { src: "assets/img/sections/experience-musique", alt: { fr: "Un musicien joue de la kora pendant le dîner", en: "A musician plays the kora during dinner" } },
      { src: "assets/img/sections/experience-decor", alt: { fr: "Détail du décor : panneau sculpté, suspension en raphia, coussin en tissu Ndop", en: "Decor detail: carved panel, raffia lamp, Ndop textile cushion" } },
    ],
  },

  gallery: {
    title: { fr: "Galerie", en: "Gallery" },
    items: [
      { src: "assets/img/flight/plat", alt: { fr: "Le ndolé aux crevettes", en: "Ndolé with prawns" }, caption: { fr: "Plats", en: "Dishes" } },
      { src: "assets/img/sections/chef-portrait", alt: { fr: "Le chef exécutif", en: "The executive chef" }, caption: { fr: "Le chef", en: "The chef" } },
      { src: "assets/img/flight/cuisine", alt: { fr: "La cuisine ouverte", en: "The open kitchen" }, caption: { fr: "Cuisine", en: "Kitchen" } },
      { src: "assets/img/flight/salle", alt: { fr: "La salle", en: "The dining room" }, caption: { fr: "Restaurant", en: "Restaurant" } },
      { src: "assets/img/flight/ingredients", alt: { fr: "Les ingrédients", en: "The ingredients" }, caption: { fr: "Ingrédients", en: "Ingredients" } },
      { src: "assets/img/flight/service", alt: { fr: "Le service en salle", en: "Service in the dining room" }, caption: { fr: "Nos invités", en: "Our guests" } },
      { src: "assets/img/sections/experience-decor", alt: { fr: "Détail du décor", en: "Decor detail" }, caption: { fr: "Décoration", en: "Design" } },
      { src: "assets/img/sections/evenement-diner", alt: { fr: "Un dîner privé à la table du chef", en: "A private chef's table dinner" }, caption: { fr: "Événements", en: "Events" } },
      { src: "assets/img/sections/evenement-terrasse", alt: { fr: "Une réception sur la terrasse", en: "A reception on the terrace" }, caption: { fr: "Événements", en: "Events" } },
      { src: "assets/img/flight/dressage", alt: { fr: "Le dressage du ndolé", en: "Plating the ndolé" }, caption: { fr: "Dressage", en: "Plating" } },
    ],
  },

  reservation: {
    title: { fr: "Réserver une table", en: "Book a table" },
    text: { fr: "Choisissez votre créneau. Nous vous confirmons la réservation par WhatsApp.", en: "Choose your time. We confirm your booking on WhatsApp." },
    submit: { fr: "Envoyer la demande", en: "Send request" },
    fields: {
      name: { fr: "Nom complet", en: "Full name" },
      phone: { fr: "Téléphone (WhatsApp)", en: "Phone (WhatsApp)" },
      date: { fr: "Date", en: "Date" },
      time: { fr: "Heure", en: "Time" },
      guests: { fr: "Nombre de couverts", en: "Number of guests" },
      message: { fr: "Message (facultatif)", en: "Message (optional)" },
      messagePlaceholder: { fr: "Anniversaire, allergie, table préférée...", en: "Birthday, allergy, preferred table..." },
      person: { fr: "personne", en: "guest" },
      persons: { fr: "personnes", en: "guests" },
    },
    errors: {
      required: { fr: "Ce champ est obligatoire.", en: "This field is required." },
      phone: { fr: "Numéro incomplet.", en: "Incomplete number." },
      date: { fr: "Choisissez une date à venir.", en: "Please choose a future date." },
      summary: { fr: "Vérifiez les champs signalés.", en: "Please check the highlighted fields." },
    },
    demoMessage: { fr: "Mode démonstration : aucune demande n'a été envoyée. Ajoutez le numéro WhatsApp du restaurant dans assets/js/content.js pour activer l'envoi.", en: "Demo mode: no request has been sent. Add the restaurant's WhatsApp number in assets/js/content.js to enable sending." },
    sentMessage: { fr: "WhatsApp s'ouvre avec votre demande pré-remplie. Envoyez le message pour la transmettre au restaurant.", en: "WhatsApp opens with your pre-filled request. Send the message to pass it on to the restaurant." },
    whatsappIntro: { fr: "Bonjour LANDRI, je souhaite réserver une table.", en: "Hello LANDRI, I would like to book a table." },
    maxGuests: 12,
  },

  visit: {
    title: { fr: "Nous trouver", en: "Find us" },
    image: { src: "assets/img/flight/arrivee", alt: { fr: "L'entrée du restaurant au crépuscule", en: "The restaurant entrance at dusk" } },
    directionsLabel: { fr: "Itinéraire", en: "Directions" },
  },

  footer: {
    line: { fr: "Cuisine africaine contemporaine. Recettes ancestrales, regard d'aujourd'hui.", en: "Contemporary African cuisine. Ancestral recipes, a modern eye." },
  },
};
