# LANDRI, African Fine Dining : note de production

## Transformation
L'ancien concept (burgers haut de gamme) a été entièrement remplacé : vidéo, images, logo, nom, palette, typographies, textes, carte et sections. L'architecture technique est conservée telle quelle : moteur de défilement, timeline par étapes, chapitres HTML, version fixe, responsive, formulaire et scripts.

## Direction
- **Nom** : LANDRI, signature « African Fine Dining ».
- **Logo** : losange ajouré et graine géométrique, inspirés des textiles d'Afrique centrale ; LANDRI en Cormorant Garamond 600, signature en Hanken Grotesk.
- **Palette** : noir profond #0D0B09, chocolat #3B2418, terre cuite #B4532A, ivoire #F2EBDD, sable #D8C7A8, bronze #A97C50, vert profond #1E3A2C, or discret #C9A35B (accent unique).
- **Langues** : français par défaut, anglais via le bouton FR / EN ou `?lang=en`.
- **Bible visuelle** : `BIBLE-VISUELLE.md` ; bloc commun utilisé dans les prompts : `bible-block.txt`.

## La visite (film maître de 57,6 s, 1 152 images à 20 i/s)
| Secondes | Scène | Chapitre |
|---|---|---|
| 0 à 5,5 | Arrivée : personnel et invités, portes en bois sculpté | Entrez à la grande table de l'Afrique |
| 5,5 à 12 | La salle : art africain contemporain, raphia, tables dressées | Bois sculpté, terre cuite, lumière d'ambre |
| 12 à 17,2 | Vers la cuisine ouverte | (pas de texte) |
| 17,2 à 24,6 | Assaisonnement, grill : poisson et poulet dans les flammes | En cuisine, chaque geste compte |
| 24,6 à 29,2 | Gros plans : plantain, patate douce, gingembre, épices, poisson, crevettes | Tout commence par le produit |
| 29,2 à 32,3 | Le chef à la passe | (pas de texte) |
| 32,3 à 37,8 | Dressage du ndolé en très gros plan | Le dressage, comme une signature |
| 37,8 à 43 | Le plat terminé, orbite lente | Le ndolé aux crevettes, réinventé |
| 43 à 51,5 | Le serveur porte le plat, service à table | Servi comme on reçoit en famille |
| 51,5 à 57,6 | Dégustation, recul sur la salle | Le goût de l'Afrique, réinventé |

## Vidéos (Seedance 2.5, 15 s, 720p, sans son ; compte Plus via la CLI Higgsfield)
| Segment | Job | Mode | Statut |
|---|---|---|---|
| A : arrivée, salle | 922333f4-bf5c-4f4b-a513-115f79a287de | omni_reference, image de départ `stills/start-2-1920.jpg` | utilisé en entier |
| B v1 : cuisine | 4aaa3821-d549-481c-bb3b-23d63cbbd1a6 | video_extension de A | écarté (3 coupes, papaye sur planche plastique) ; conservé : `video/clip-B-v1-coupes.mp4` |
| B v2 : cuisine, ingrédients | 14eddc78-e239-4314-9846-33157dffad60 | video_extension de A | utilisé, coupes à 2,46 s et 6,46 s réparées |
| C : passe, dressage, plat | e136d405-aad6-41f7-8c98-42d9af280629 | video_extension de B v2 | utilisé, coupes à 0,33 s et 3,92 s réparées |
| D : service, table, salle | 9f2bedcb-dfa8-4100-8d88-7a0de9eccee1 | video_extension de C | utilisé, coupe à 0,08 s réparée |

Prompts exacts : `prompts/clip-A.txt` à `clip-D.txt` (jamais le mot « drone »).

**Réparations** : Seedance insère une coupe à chaque changement de lieu dans une prolongation, même quand le prompt demande « one unbroken shot ». Plutôt que de régénérer en boucle, le montage (`scripts/flight.config.json`) découpe les plans propres et les relie par des fondus de 0,35 à 0,4 s. Le film maître ne présente ensuite plus aucune coupe franche (`select='gt(scene,0.3)'`) ; ces raccords se lisent comme des fondus enchaînés, pas comme un seul plan-séquence.

## Images (Soul Cinema 2k, 0,12 crédit l'unité ; journaux des jobs dans `*/_jobs.json`)
- `stills/` : 3 propositions d'arrivée (la n° 2 est retenue comme première image) et les images de la salle, de la cuisine et de l'ambiance.
- `menu/` : 35 photos de plats ; `menu-crop/` : les mêmes recadrées automatiquement sur l'assiette.
- `sections/` : portrait et geste du chef, 5 régions d'Afrique, musique et décor, 2 événements, gros plans des chapitres (ingrédients, dressage, plat, service), samoussas.
- Lots : `jobs/01-reperes.json`, `02-carte.json`, `03-sections.json`.
- Les sources sont en JPEG qualité 92 (converties depuis les PNG d'origine pour alléger le dépôt).

## Crédits Higgsfield (compte Plus)
689,5 → 157,42 crédits, soit **532 crédits** : 5 vidéos de 15 s × 105 = 525 (dont 105 pour le B écarté) et environ 7 crédits d'images.
Rappel de l'identité précédente (burgers) : 320,5 crédits sur ce compte, plus environ 2 crédits sur l'ancien compte gratuit.

## Vérifications effectuées
- 36 contrôles automatiques sur 36 : pour chacune des 12 étapes (début, milieu, fin), bonne image du film, seul le bon chapitre lisible, textes masqués inactifs.
- 115 fichiers référencés vérifiés : aucun manquant.
- Aucun défilement horizontal en 1 440 px ni en 375 px ; le mobile charge la séquence 800 px.
- Bilingue : bascule FR / EN de tous les textes, choix mémorisé, valeurs du formulaire conservées.
- Carte : onglets au clavier, fiche plat accessible (dialogue natif, focus rendu au bouton), galerie agrandie.
- Formulaire : erreurs sous les champs, message de démonstration explicite.

## Limites connues
- Vidéo en 720p.
- La visite est une suite de plans continus reliés par des fondus courts, et non un plan-séquence parfait (voir Réparations).
- La salle vue au service (segment D : arches, portrait coloré) diffère un peu de celle de l'arrivée (segment A : panneaux de bois), même si les matières et l'ambiance concordent.
- Le comptoir des ingrédients montre aussi des pommes de terre et une papaye.
- Les menus et photos de boissons montrent parfois une assiette à côté du verre.
- Le chef est un personnage généré : remplacez son portrait, son nom et son parcours par les vrais avant publication.
- Adresse, horaires, téléphone, prix et WhatsApp sont des éléments de démonstration. Aucun avis, prix ni distinction n'a été inventé.
- L'aperçu intégré était masqué pendant les tests : les contrôles ont été faits de façon automatisée, et la fluidité au doigt sur un vrai téléphone reste à tester.
