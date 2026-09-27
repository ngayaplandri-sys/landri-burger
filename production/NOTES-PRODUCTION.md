# Landri Burger : note de production

## Direction retenue
- **Façade A, heure dorée** : pavillon vitré cadré de bronze sous un toit rouge laqué en vague, brique terre cuite, collines de Yaoundé. Options B (heure bleue) et C (tropical, Ndop) conservées dans `stills/`.
- **Logo** : pain de burger avec l'étoile du Cameroun, mot-symbole LANDRI / BURGER (Bricolage Grotesque 800, contours vectorisés). Pistes de départ générées par Higgsfield dans `logos/`.
- **Palette** : encre #0E0A09, crème #F4EADB, rouge laqué #A8201A (marque), safran #F2B01E (accent unique). Thème sombre.
- **Typographies** : Bricolage Grotesque (titres), Hanken Grotesk (texte), auto-hébergées.

## Parcours du vol (film maître de 43,4 s, 868 images à 20 i/s)
| Secondes | Étape |
|---|---|
| 0 à 5 | Parvis, arc autour du serveur, entrée par les portes vitrées |
| 5 à 12,5 | La salle : comptoir en lattes, tables, baies sur les collines |
| 12,5 à 16,3 | La porte de cuisine s'ouvre, traversée |
| 16,3 à 25 | Cuisine : plancha en flammes, steaks écrasés, dressage des burgers |
| 25 à 29,5 | Garde-manger, allée d'étagères, porte arrière ouverte sur la cour |
| 29,5 à 31,9 | Éclat de soleil, sortie dans la cour de service |
| 31,9 à 34,2 | Demi-tour de 180° |
| 34,2 à 43,4 | Recul en montée : toit rouge, parking, boulevard aux taxis jaunes, collines |

Défilement : 975 hauteurs d'écran au total. Plan fixe de 0,55 écran à l'ouverture et de 0,75 écran à la fin ; 1,65 à 1,70 écran pour la salle et la cuisine ; une étape courte dédiée au demi-tour (0,45 écran). Détail dans `assets/js/content.js` (`flight.beats`).

## Jobs Higgsfield

### Compte gratuit, images de recherche : 10 → 7,96 crédits
Soul Cinema (≈ 0,12 crédit l'unité) et Z Image (0,15). Liste complète ci-dessous.
| Fichier | Job |
|---|---|
| stills/01-start-A-goldenhour.png | ed26df66-f4b9-4783-89da-49aa1a32a478 |
| stills/01-start-B-bluehour.png | b897e284-9d3f-4bc7-8ba3-242130e71981 |
| stills/01-start-C-tropical.png | 3788e721-f2ca-489b-8f61-fa38ca140939 |
| stills/02-salle.png | e5f47958-b187-459d-8ba0-8ebd67ca010d |
| stills/03-cuisine.png | 542c20dd-28c7-4ad0-8e33-9fe2c2a7efba |
| stills/04-garde-manger.png | ef90f129-ed8a-433c-9776-b398afdb45b8 |
| stills/05-reveal-aerien.png | cd3cb94d-4580-4573-9ab2-024ad368d182 |
| stills/alt-terrasse-serveur.png | 9d2db4a7-4d24-4274-9120-8117b6514293 |
| stills/alt-facade-verriere.png | 5372b5db-6d61-4346-8521-4916928d7d2a |
| stills/alt-facade-vague.png | 96197eab-b66a-4b08-ac70-2d52673ef344 |
| food/burger-signature.png | fdcf3157-91a6-429a-a347-e7ae8d378afc |
| food/table-partage.png | f6dff0f8-625b-4096-9309-801e0d1f8d9a |
| logos/logo-1-bun-star.png | de4ca536-15a6-452f-b1f2-94c136899ce8 |
| logos/logo-2-roundel.png | dcbe579d-6ab8-4191-9631-86c90da3bd5f |
| logos/logo-3-soleil.png | 3c77980d-6022-4fcc-8f9f-625f301ddd3a |

### Compte Plus (via l'outil en ligne de commande Higgsfield) : 1 010 → 689,5 crédits
| Élément | Modèle | Job | Coût réel |
|---|---|---|---|
| Façade A corrigée (baskets et emblème retirés) : `stills/01-start-A-fixed.png` | GPT Image 2.5, high, 2k | 6769309d-cc5c-4c54-af62-0f58a2606433 | 2,75 |
| Image de référence aérienne : `stills/06-reveal-reference.png` | GPT Image 2.5, high, 2k | c92a81b2-a9db-4bac-98dc-f3154b0a1b07 | 2,75 |
| Segment A (image de départ, entrée, salle) : `video/clip-A.mp4` | Seedance 2.5, omni_reference, 15 s, 720p | 72517de9-719f-4bff-9478-f886cbf6b719 | 105 |
| Segment B (prolongation : cuisine, garde-manger) : `video/clip-B.mp4` | Seedance 2.5, video_extension forward, 15 s, 720p | 11bf7e9e-1520-4c2f-a309-afcad46abf6b | 105 |
| Segment C (prolongation + référence aérienne : sortie, demi-tour, montée) : `video/clip-C.mp4` | Seedance 2.5, video_extension forward, 15 s, 720p | 2eb1f284-f015-439f-a1c6-1d5041ec985b | 105 |
| **Total** | | | **320,5** |

Les prolongations ont coûté exactement le montant annoncé (105), sans surcoût.
Prompts exacts : `prompts/` (jamais le mot « drone » ; caméra décrite comme « flying », aucun objet volant visible).

## Contrôles et réparations
- Planches contact à 1 image par seconde et détection de coupes (`select='gt(scene,0.3)'`) sur chaque segment et sur le film maître : `review/`.
- Raccord A → B : dernière et première images quasi identiques, concaténation directe.
- Raccord B → C : parfait, mais **coupe générée par le modèle à 0,5 s dans C** (saut de la cour vers un autre seuil de porte, probablement dû à l'image de référence).
  **Réparation sans régénération** : début de C à 1,25 s et éclat de lumière blanc chaud de 0,4 s au passage de la porte arrière (`scripts/flight.config.json`, `join: "flash"`). La seule « coupe » restante détectée sur le film maître (29,71 s) est cet éclat voulu. Coût : 0 crédit.
- Film maître : normalisation 1920×1080, 24 i/s, yuv420p ; images extraites à 20 i/s en WebP (qualité 74) : 1 280 px (33 Mo, 35 Ko en moyenne) et 800 px (20 Mo, 21 Ko en moyenne).

## Vérifications effectuées dans le navigateur
- Les 10 étapes du vol, au début, au milieu et à la fin : image affichée = image attendue (±1) ; au milieu de chaque étape, seul le bon chapitre est lisible ; les textes masqués sont neutralisés (inert) ; plan final tenu sur l'image 866. **30 contrôles sur 30 réussis.**
- Aucun défilement horizontal en 1 440 px et en 375 px ; sur mobile, la séquence 800 px est chargée.
- Mode sans animation (`?fixe`) : cinq chapitres pleine hauteur sur leurs images.
- Formulaire : erreurs affichées sous les champs, focus sur le premier champ en erreur, message « Mode démonstration : aucune demande n'a été envoyée » tant que WhatsApp n'est pas configuré.

## Limites connues
- **Vidéo en 720p** (choix budgétaire validé) : images un peu douces sur très grand écran.
- **Écussons illisibles** sur les tabliers de la cuisine, et un bref plan d'âtre en flammes vers 16 s, avant la plancha.
- **Raccord réparé** par l'éclat de lumière : un œil attentif voit que la cour change légèrement après l'éclat.
- **Toit** : sa forme vue du ciel est plus arrondie que la vague de la façade de départ, même si la couleur et les matériaux sont cohérents.
- **Fluidité** : le défilement n'a pas été testé à la main sur de vrais téléphones. L'aperçu intégré était masqué pendant une partie des tests, ce qui ralentit l'animation ; les contrôles ont donc été faits de façon automatisée.
- **Contenus fictifs** : adresse, horaires, téléphone, prix et WhatsApp sont des éléments de démonstration à remplacer. Aucun avis client, prix ni chiffre de fréquentation n'a été inventé.
