# Charte graphique — design system
Statut : [x] à approuver  [ ] approuvé par : ______  (version du 18/10/26 approuvée par Alexandre Morozoff ; révision du 27/10/26 sur les points laissés par les maquettes, à approuver)
Base : US-2.0 et SC-2.0, approuvés par Alexandre Morozoff le 15/10/26 ; décisions d'Alexandre du 15/10/2026 sur la charte ; choix d'Alexandre du 17/10/2026 sur le mouvement ; points laissés par les maquettes, 27/10/2026.

## 1. Principes

Ce document définit le design system né de la refonte du portfolio : ses jetons, ses composants et leurs règles. Il sert le portfolio et, au-delà, les futures applications personnelles d'Alexandre. Sa page catalogue, `Maquettes/design-system.html`, montre chaque jeton et chaque composant dans la palette retenue, PA-02 Lagune ; elle s'ouvre dans un navigateur, sans installation, et permet encore d'afficher, pour comparaison, les deux palettes écartées.

Les maquettes des écrans ne sont pas ici : elles sont dans le dossier `Maquettes/`, à côté de la page catalogue, un fichier par écran, sur la palette retenue, PA-02 Lagune, et ont été approuvées par Alexandre le 18/10/2026.

### Le langage visuel retenu

Une « nuit éclairée » : un fond très sombre, teinté par la palette, d'où la lumière vient de quelques sources douces. Concrètement :

- **Fond sombre et profond**, jamais noir pur : chaque palette teinte son fond (graphite chaud, encre vert-de-gris, noir prune).
- **Halos lumineux flous** : une ou deux taches de lumière colorée, très diffuses, en coins opposés d'une section ; elles donnent la profondeur sans rien éclairer de précis.
- **Trame de points** : une grille de points minuscules et presque invisibles, qui donne une texture technique au fond.
- **Très grande typographie serrée** : un titre d'affiche par page, très gras, aux lettres resserrées ; il porte à lui seul l'impact visuel.
- **Étiquettes en chasse fixe, en capitales espacées** : elles annoncent, datent et rangent ; elles donnent le ton « ingénierie ».
- **Cartes en verre à fine bordure** : une surface légèrement plus claire que le fond, en dégradé translucide, cernée d'un filet d'un pixel.
- **Pastilles à point coloré** : un mot court précédé d'un point de couleur, pour qualifier un état ou une catégorie.
- **Frise chronologique à étapes lumineuses** : un fil, des points, et l'étape mise en avant qui brille.
- **Fenêtres d'application factices** : un cadre à trois points et barre de titre, pour mettre en scène du code, une capture ou une interface abstraite.
- **Apparitions en cascade** : les éléments d'un groupe montent et apparaissent l'un après l'autre, une seule fois.

### Six principes

1. **Le contenu d'abord, l'effet ensuite.** Chaque effet peut disparaître sans perte d'information : un recruteur qui juge un profil en quelques minutes lit d'abord, s'émerveille ensuite.
2. **Une lumière dominante.** Un accent principal pour les actions et les repères, un accent secondaire en contrepoint, rien de plus. Les couleurs de succès, d'erreur et d'attention ne servent qu'à ces états.
3. **Contraste calculé, jamais estimé.** Chaque couleur de texte est opaque et son ratio est calculé (section 2), y compris sur les fonds composés (section 8).
4. **Entrer, pas danser.** Le mouvement accompagne une apparition, un changement d'état ou la lecture (section 6) ; seuls la respiration des halos, qu'on peut mettre en pause, et l'indicateur d'activité pendant une attente tournent en boucle. Le curseur d'une fenêtre de code qui s'écrit ne clignote que les quelques secondes de l'écriture.
5. **Rapide par construction.** Les effets sont des dégradés peints une fois ; on n'anime que l'opacité et la transformation (position, échelle) ; hors transitions de couleur des changements d'état, une seule exception : le tracé des traits SVG, sur de petites surfaces ; le flou est réservé à deux éléments (section 6).
6. **Nommé par rôle.** Jetons et composants portent le nom de leur rôle (accent, surface, carte), jamais celui d'un usage du portfolio : c'est ce qui les rend réutilisables (section 9).

### Ce qui n'est pas repris de la page de référence

- **Ses couleurs**, ni à l'identique ni en nuance voisine : ni son bleu vif, ni son vert vif, ni son orange vif, ni son violet, ni son bleu nuit. Aucune palette proposée ne prend le bleu, le vert ou le violet comme accent ; le vert n'y sert qu'à l'état de succès, dans une nuance douce. Les palettes de la section 2 sont propres à Alexandre.
- **Son format en diapositives** : la référence est une présentation en cadres fixes de 1920 × 1080 mis à l'échelle et en sections de la hauteur de l'écran. Le site, lui, est une page fluide qui s'adapte de 320 à 2560 px (section 5) ; aucune section n'impose la hauteur de l'écran.
- **Ses contenus** : textes, chiffres, graphiques, interfaces représentées, noms et thèmes.
- **Ses noms de variables et de classes** : tous les noms de cette charte sont nouveaux et en français.
- **Ses polices** : la charte propose ses propres familles (section 4).
- **Ses textes en blanc translucide** : leur contraste dépend du fond sur lequel ils passent et descend sous 4.5:1 ; ici, chaque couleur de texte est un jeton opaque au contraste calculé.
- **Sa barre de défilement masquée et ses indicateurs fixes de progression** : la barre de défilement reste visible, c'est un repère pour le visiteur.

## 2. Palettes proposées

Trois palettes remplissent les mêmes quatorze rôles de couleur, définis en section 3.1. Les valeurs sont en hexadécimal opaque. Les ratios de contraste suivent la définition de la WCAG 2.x (luminance relative, seuil de linéarisation 0.04045) et ont été calculés par script, arrondis à deux décimales. Chaque tableau donne les huit paires imposées, puis dix paires qui couvrent les autres usages réels : texte discret, accent employé comme texte de lien, accent secondaire, texte sur l'accent secondaire, messages posés sur une surface. Les contrastes sur les fonds translucides (verre, halos, teintes de pastille) sont en section 8.

Palette retenue : PA-02 Lagune — décision d'Alexandre du 16/10/2026 (point P-01). PA-01 Laiton et PA-03 Framboise, écartées le 16/10/2026, restent documentées ci-dessous avec leurs jetons et leurs tableaux, pour mémoire.

### PA-01 — Laiton
Statut : écartée le 16/10/2026. Ses fonds composés n'ont pas été recalculés avec les halos moyens retenus (section 3.6) : son texte discret y descendrait sous 4.5:1 sur le verre posé au pic d'un halo, et une reprise de cette palette commencerait par corriger ce jeton (section 9).

Un graphite chaud éclairé au laiton, avec un turquoise pâle en contrepoint : une palette soignée et singulière, loin des bleus et des violets habituels des sites de développeurs.

Jetons :
| Jeton | Valeur |
| --- | --- |
| couleur-fond | #0C0B0A |
| couleur-surface | #161412 |
| couleur-surface-relevee | #211E1B |
| couleur-bordure | #3A3530 |
| couleur-texte | #F5F1EA |
| couleur-texte-secondaire | #C2B9AD |
| couleur-texte-discret | #A09689 |
| couleur-accent | #E8B04E |
| couleur-accent-secondaire | #63C7B2 |
| couleur-texte-sur-accent | #1B1307 |
| couleur-succes | #7DD58F |
| couleur-erreur | #FF7B6E |
| couleur-attention | #F2D06B |
| couleur-focus | #8FE0D2 |

Contrastes :
| Premier plan | Arrière-plan | Ratio | Minimum |
| --- | --- | --- | --- |
| couleur-texte | couleur-fond | 17.47 | 4.5 |
| couleur-texte-secondaire | couleur-fond | 10.15 | 4.5 |
| couleur-texte | couleur-surface | 16.32 | 4.5 |
| couleur-accent | couleur-fond | 10.07 | 3 |
| couleur-texte-sur-accent | couleur-accent | 9.41 | 4.5 |
| couleur-erreur | couleur-fond | 7.78 | 4.5 |
| couleur-succes | couleur-fond | 11.04 | 4.5 |
| couleur-focus | couleur-fond | 12.89 | 3 |
| couleur-texte-discret | couleur-fond | 6.76 | 4.5 |
| couleur-texte-secondaire | couleur-surface-relevee | 8.56 | 4.5 |
| couleur-texte-discret | couleur-surface-relevee | 5.70 | 4.5 |
| couleur-accent | couleur-surface-relevee | 8.49 | 4.5 |
| couleur-accent-secondaire | couleur-fond | 9.69 | 4.5 |
| couleur-attention | couleur-fond | 13.12 | 4.5 |
| couleur-erreur | couleur-surface | 7.27 | 4.5 |
| couleur-succes | couleur-surface | 10.31 | 4.5 |
| couleur-focus | couleur-surface | 12.04 | 3 |
| couleur-texte-sur-accent | couleur-accent-secondaire | 9.05 | 4.5 |

Vigilance : couleur-accent et couleur-attention sont deux jaunes voisins. Un message d'attention se reconnaît à son icône, à son titre et à son cadre, jamais à sa seule couleur (section 8).

### PA-02 — Lagune
Statut : retenue le 16/10/2026.

Une encre vert-de-gris traversée d'un aqua lumineux, avec une pêche douce en contrepoint : la palette la plus calme et la plus « technique » des trois.

Ajustement du 16/10/2026 : couleur-texte-discret passe de #8A9EA0 à #97A9AB, même teinte un peu plus claire. Avec les halos moyens, l'ancienne valeur tombait à 4.02:1 sur le verre posé au pic du halo d'accent ; la nouvelle y tient 4.61:1 (section 8). Les deux paires qui l'utilisent ci-dessous sont recalculées.

Jetons :
| Jeton | Valeur |
| --- | --- |
| couleur-fond | #070C0C |
| couleur-surface | #0F1616 |
| couleur-surface-relevee | #172121 |
| couleur-bordure | #2A3939 |
| couleur-texte | #EEF5F5 |
| couleur-texte-secondaire | #A9BDBE |
| couleur-texte-discret | #97A9AB |
| couleur-accent | #3FD4C8 |
| couleur-accent-secondaire | #FFB59E |
| couleur-texte-sur-accent | #04201E |
| couleur-succes | #7ADB9A |
| couleur-erreur | #FF7272 |
| couleur-attention | #F2CF6B |
| couleur-focus | #FFE08A |

Contrastes :
| Premier plan | Arrière-plan | Ratio | Minimum |
| --- | --- | --- | --- |
| couleur-texte | couleur-fond | 17.82 | 4.5 |
| couleur-texte-secondaire | couleur-fond | 10.04 | 4.5 |
| couleur-texte | couleur-surface | 16.58 | 4.5 |
| couleur-accent | couleur-fond | 10.74 | 3 |
| couleur-texte-sur-accent | couleur-accent | 9.32 | 4.5 |
| couleur-erreur | couleur-fond | 7.41 | 4.5 |
| couleur-succes | couleur-fond | 11.65 | 4.5 |
| couleur-focus | couleur-fond | 15.26 | 3 |
| couleur-texte-discret | couleur-fond | 8.04 | 4.5 |
| couleur-texte-secondaire | couleur-surface-relevee | 8.39 | 4.5 |
| couleur-texte-discret | couleur-surface-relevee | 6.72 | 4.5 |
| couleur-accent | couleur-surface-relevee | 8.98 | 4.5 |
| couleur-accent-secondaire | couleur-fond | 11.58 | 4.5 |
| couleur-attention | couleur-fond | 13.04 | 4.5 |
| couleur-erreur | couleur-surface | 6.89 | 4.5 |
| couleur-succes | couleur-surface | 10.84 | 4.5 |
| couleur-focus | couleur-surface | 14.20 | 3 |
| couleur-texte-sur-accent | couleur-accent-secondaire | 10.04 | 4.5 |

Vigilance : l'aqua est une teinte fréquente sur les sites techniques, la palette distingue donc moins que les deux autres. couleur-focus et couleur-attention sont deux jaunes voisins, sans risque de confusion : l'un est un contour, l'autre un message avec icône.

### PA-03 — Framboise
Statut : écartée le 16/10/2026. Ses fonds composés n'ont pas été recalculés avec les halos moyens retenus (section 3.6) : son texte discret y descendrait sous 4.5:1 sur le verre posé au pic d'un halo, et une reprise de cette palette commencerait par corriger ce jeton (section 9).

Un noir prune relevé d'un framboise franc, avec un miel en contrepoint : la plus audacieuse des trois, celle qui marque le plus la mémoire.

Jetons :
| Jeton | Valeur |
| --- | --- |
| couleur-fond | #0B090C |
| couleur-surface | #151217 |
| couleur-surface-relevee | #1F1A22 |
| couleur-bordure | #383040 |
| couleur-texte | #F6F0F4 |
| couleur-texte-secondaire | #C2B6BF |
| couleur-texte-discret | #A0929D |
| couleur-accent | #FF5C9A |
| couleur-accent-secondaire | #FFC46B |
| couleur-texte-sur-accent | #1F0612 |
| couleur-succes | #72D99B |
| couleur-erreur | #FF7A5C |
| couleur-attention | #F2D06B |
| couleur-focus | #9EE7FF |

Contrastes :
| Premier plan | Arrière-plan | Ratio | Minimum |
| --- | --- | --- | --- |
| couleur-texte | couleur-fond | 17.65 | 4.5 |
| couleur-texte-secondaire | couleur-fond | 10.14 | 4.5 |
| couleur-texte | couleur-surface | 16.53 | 4.5 |
| couleur-accent | couleur-fond | 6.85 | 3 |
| couleur-texte-sur-accent | couleur-accent | 6.63 | 4.5 |
| couleur-erreur | couleur-fond | 7.74 | 4.5 |
| couleur-succes | couleur-fond | 11.44 | 4.5 |
| couleur-focus | couleur-fond | 14.48 | 3 |
| couleur-texte-discret | couleur-fond | 6.70 | 4.5 |
| couleur-texte-secondaire | couleur-surface-relevee | 8.74 | 4.5 |
| couleur-texte-discret | couleur-surface-relevee | 5.77 | 4.5 |
| couleur-accent | couleur-surface-relevee | 5.90 | 4.5 |
| couleur-accent-secondaire | couleur-fond | 12.62 | 4.5 |
| couleur-attention | couleur-fond | 13.23 | 4.5 |
| couleur-erreur | couleur-surface | 7.24 | 4.5 |
| couleur-succes | couleur-surface | 10.71 | 4.5 |
| couleur-focus | couleur-surface | 13.56 | 3 |
| couleur-texte-sur-accent | couleur-accent-secondaire | 12.22 | 4.5 |

Vigilance : couleur-accent (framboise) et couleur-erreur (corail) sont proches. Un bouton principal et un message d'erreur se distinguent par leur forme et leur icône, mais c'est la palette la plus exposée à cette confusion. Le framboise peut aussi paraître moins sobre à un public de recrutement.

Recommandation : PA-01 — Laiton, formulée avant la décision du 16/10/2026. C'est la palette la plus éloignée de la page de référence (aucune teinte bleue, verte ou violette dominante) et la plus singulière face aux portfolios de développeurs, souvent bleus ou violets ; elle reste sobre, le laiton se lit « soigné » plutôt que « démonstratif », ce qui sert un public de recruteurs et de responsables techniques. Sur l'action principale, elle ne se distingue pas de PA-02 : l'accent sur le fond est plus contrasté dans PA-02 (10.74:1 contre 10.07:1), et PA-01 n'est devant que pour le texte posé sur l'accent (9.41:1 contre 9.32:1). Son seul point faible, la proximité de l'accent et de la couleur d'attention, est sans conséquence ici : le site n'affiche presque jamais de message d'attention, et aucun état ne repose sur la couleur seule. PA-02 était le meilleur second choix pour une ambiance froide ; c'est elle qu'Alexandre a retenue.

## 3. Jetons

Un jeton est une décision nommée : un composant n'utilise jamais une valeur brute, seulement des jetons. Les noms sont en minuscules, sans accent, avec des tirets. Les jetons de mise en page (conteneurs, marges, gouttières, points de rupture) sont en section 5, les règles d'usage du mouvement en section 6.

### 3.1 Couleurs sémantiques

Les valeurs dépendent de la palette (section 2) ; les rôles, eux, sont fixes.

| Jeton | Rôle | Règle d'usage |
| --- | --- | --- |
| couleur-fond | fond de la page | le plus sombre ; porte les halos et la trame |
| couleur-surface | fond des blocs pleins, des champs, des messages, des fenêtres | un cran au-dessus du fond |
| couleur-surface-relevee | ce qui flotte au-dessus d'une surface : menu ouvert, bouton désactivé, monogramme | un cran au-dessus de la surface |
| couleur-bordure | séparateurs et contours décoratifs | décorative seulement (≈ 1.6:1) : jamais seule pour identifier un contrôle |
| couleur-texte | titres, libellés, texte important | le plus clair |
| couleur-texte-secondaire | texte courant long, descriptions, chapôs | adoucit la lecture sans perdre le contraste |
| couleur-texte-discret | étiquettes, dates, métadonnées, texte indicatif, bord des champs | au moins 4.5:1 sur le fond, les surfaces et le verre posé sur un halo |
| couleur-accent | action principale, liens, repère courant, halo principal | une seule action primaire par zone d'écran |
| couleur-accent-secondaire | contrepoint : fin du dégradé de la frise, halo secondaire, pastille secondaire, chaînes dans le code | jamais pour une action |
| couleur-texte-sur-accent | texte et icônes posés sur couleur-accent ou couleur-accent-secondaire | réservé à ces deux fonds |
| couleur-succes | confirmation d'une action réussie | toujours avec une icône et un texte |
| couleur-erreur | erreur de champ, échec d'une action | toujours avec une icône et un texte |
| couleur-attention | avertissement non bloquant, ressource indisponible | toujours avec une icône et un texte |
| couleur-focus | anneau de focus clavier | réservé au focus |

### 3.2 Typographie

| Jeton | Valeur | Usage |
| --- | --- | --- |
| police-titre | Bricolage Grotesque, puis la police sans empattement du système | titres, nombres d'impact, marque |
| police-texte | Hanken Grotesk, puis la police sans empattement du système | texte, libellés, boutons |
| police-mono | JetBrains Mono, puis la police à chasse fixe du système | étiquettes, pastilles, dates, code |
| graisse-normale | 400 | texte courant |
| graisse-moyenne | 500 | étiquettes, liens de navigation |
| graisse-appuyee | 600 | boutons, libellés de champ |
| graisse-forte | 700 | petits titres, titres de message |
| graisse-titre | 800 | affiche, titres 1 et 2, marque |
| taille-affiche à taille-etiquette | voir section 4 | dix tailles, de l'affiche à l'étiquette |
| interligne-affiche | 0.96 | affiche |
| interligne-titre | 1.06 | titres 1 et 2 |
| interligne-sous-titre | 1.2 | titres 3 et 4, étiquettes |
| interligne-chapo | 1.55 | chapô |
| interligne-texte | 1.6 | texte courant |
| interligne-compact | 1.45 | petit texte, code |
| approche-affiche | -0.045em | affiche : lettres très resserrées |
| approche-titre | -0.03em | titres 1 et 2 |
| approche-sous-titre | -0.015em | titres 3 et 4 |
| approche-etiquette | 0.16em | étiquettes en capitales |
| approche-pastille | 0.1em | pastilles en capitales |

### 3.3 Espacements

Une grille de 4 px. Les valeurs sont exprimées en unités relatives à la taille de texte du navigateur (1 rem = 16 px par défaut), pour suivre le zoom du visiteur.

| Jeton | Valeur | Usage type |
| --- | --- | --- |
| espace-1 | 4 px (0.25 rem) | entre une étiquette et sa valeur |
| espace-2 | 8 px (0.5 rem) | entre une icône et son libellé, entre deux cibles tactiles |
| espace-3 | 12 px (0.75 rem) | intérieur d'un champ, éléments d'une carte |
| espace-4 | 16 px (1 rem) | marge de page sur téléphone |
| espace-5 | 20 px (1.25 rem) | intérieur d'un bouton, entre deux champs |
| espace-6 | 24 px (1.5 rem) | intérieur d'une carte |
| espace-8 | 32 px (2 rem) | entre deux étapes de frise |
| espace-10 | 40 px (2.5 rem) | sous un en-tête de section |
| espace-12 | 48 px (3 rem) | entre deux blocs |
| espace-16 | 64 px (4 rem) | marge verticale d'une section sur téléphone |
| espace-20 | 80 px (5 rem) | respiration d'une section d'accueil |
| espace-24 | 96 px (6 rem) | marge verticale d'une section sur grand écran |
| espace-32 | 128 px (8 rem) | ouverture d'une page d'accueil sur très grand écran |

### 3.4 Arrondis

| Jeton | Valeur | Usage |
| --- | --- | --- |
| arrondi-petit | 6 px | boutons, champs, liens de navigation |
| arrondi-moyen | 10 px | messages d'état, monogramme |
| arrondi-grand | 14 px | cartes, fenêtres factices, menu ouvert |
| arrondi-pilule | 999 px | pastilles, barre d'adresse factice |
| arrondi-cercle | 50 % | points de frise, puces, indicateur d'activité |

### 3.5 Bordures et focus

| Jeton | Valeur | Usage |
| --- | --- | --- |
| bordure-epaisseur | 1 px | toutes les bordures |
| focus-epaisseur | 2 px | épaisseur de l'anneau de focus |
| focus-decalage | 2 px | écart entre l'élément et l'anneau |
| anneau-focus | focus-epaisseur, trait plein, couleur-focus | tout élément focalisable au clavier |
| cible-tactile | 44 px | hauteur et largeur minimales de toute cible |

Deux règles d'usage complètent ces jetons :

- **Séparateur** : un trait de bordure-epaisseur en couleur-bordure. Il est décoratif et n'identifie jamais un contrôle.
- **Bord de champ** : un trait de bordure-epaisseur en couleur-texte-discret. Il identifie le contrôle et atteint au moins 3:1 sur le fond du champ (section 8).

### 3.6 Effets : verre, halo, trame

Tous les effets sont dérivés des couleurs de la palette par opacité : aucune couleur hors palette.

| Jeton | Valeur | Usage |
| --- | --- | --- |
| opacite-verre-haut | 6 % | haut du dégradé de verre |
| opacite-verre-bas | 2 % | bas du dégradé de verre |
| opacite-verre-bordure | 10 % | filet du verre |
| verre-fond | dégradé vertical de couleur-texte à opacite-verre-haut vers couleur-texte à opacite-verre-bas | fond des cartes et boutons secondaires en verre |
| verre-bordure | couleur-texte à opacite-verre-bordure | filet d'un pixel autour du verre |
| flou-verre | 14 px | flou d'arrière-plan, réservé à l'en-tête collant et au menu ouvert, à partir de 900 px |
| opacite-halo-accent | 20 % | intensité maximale du halo principal (intensité moyenne, choix d'Alexandre du 16/10/2026) |
| halo-accent | dégradé radial de couleur-accent à opacite-halo-accent vers transparent (à 70 % du rayon), ellipse de 60 % × 55 % de la section, centrée en haut à droite | lumière principale d'une section |
| opacite-halo-secondaire | 15 % | intensité maximale du halo secondaire (intensité moyenne, choix d'Alexandre du 16/10/2026) |
| halo-secondaire | dégradé radial de couleur-accent-secondaire à opacite-halo-secondaire vers transparent, ellipse de 50 % × 50 %, centrée en bas à gauche | contrepoint, en coin opposé |
| opacite-trame | 7 % | intensité des points |
| pas-trame | 28 px | écart entre deux points |
| trame-points | points de 1 px de couleur-texte à opacite-trame, tous les pas-trame | texture de fond |
| voile-bas | dégradé vertical, transparent jusqu'à 65 %, couleur-fond à 50 % à 90 % de la hauteur, puis couleur-fond pleine au bas de la section | fondu du bas d'une section d'ambiance ; révision du 27/10/2026 : jusqu'à 90 %, la pente est celle d'avant (couleur-fond à 70 % au bas) ; au-delà, le voile atteint couleur-fond pleine au bord bas, si bien que le halo secondaire, coupé par ce bord, et la trame s'y fondent dans le fond : plus de couture avec la section suivante ; l'intensité des halos ne change pas et le voile ne fait qu'assombrir, aucun contraste ne baisse (section 8) |
| opacite-teinte | 14 % | fond des pastilles colorées (couleur du rôle à 14 %) |
| opacite-teinte-message | 10 % | fond des messages d'état (couleur du rôle à 10 % mêlée à couleur-surface) |
| lueur-point | anneau de 6 px de couleur-accent à opacite-teinte, puis halo de 24 px de couleur-accent à 50 % | point lumineux : étape de frise mise en avant |
| opacite-lueur-survol | 20 % | intensité maximale de la lueur de survol, au centre du disque (MV-06) ; 20 % et non les 22 % de la démonstration : sur une carte en verre hors halo, le texte discret tient 4.69:1 sous la lueur à 20 % et tomberait à 4.44:1 à 22 % (section 8) |
| taille-lueur-survol | 380 px | diamètre de la lueur de survol |
| lueur-survol | disque radial de couleur-accent à opacite-lueur-survol vers transparent, de taille-lueur-survol de diamètre, à l'intérieur de la carte, sous son contenu (le texte reste au-dessus) | lumière qui suit le pointeur à l'intérieur d'une carte interactive (MV-06) ; une carte interactive ne se pose jamais sur un halo (section 8) |

### 3.7 Ombres

Sur un fond aussi sombre, l'élévation vient d'abord du ton des surfaces et du filet clair ; l'ombre ne se voit que sur un halo, là où se posent les fenêtres.

| Jeton | Valeur | Usage |
| --- | --- | --- |
| ombre-fenetre | ombre portée de 30 px vers le bas, flou de 60 px, resserrée de 30 px, en couleur-fond à 90 % ; plus un liseré intérieur d'un pixel en haut, couleur-texte à 6 % | fenêtres factices |
| ombre-flottante | ombre portée de 18 px vers le bas, flou de 40 px, resserrée de 16 px, en couleur-fond à 90 % | menu ouvert ; carte interactive soulevée au survol, portée par un calque animé en opacité (MV-06) |

### 3.8 Durées et courbes

| Jeton | Valeur | Usage |
| --- | --- | --- |
| duree-instant | 100 ms | appui sur un bouton |
| duree-courte | 180 ms | survol, changement de couleur, ouverture du menu |
| duree-moyenne | 320 ms | soulèvement au survol, soulignement qui s'étire (MV-06) ; point de frise qui s'allume (MV-02) |
| duree-longue | 600 ms | filet et traits qui se dessinent (MV-05), arrivée d'une page (MV-07), mot d'un intitulé (MV-10) ; deux fois pour un cycle du curseur (MV-03) |
| duree-apparition | 700 ms | apparition d'un élément dans une cascade (MV-01), mot d'un titre révélé (MV-10) |
| duree-trace | 1200 ms | tracé d'un coup d'une frise entièrement visible (MV-02) |
| duree-rotation | 900 ms | un tour de l'indicateur d'activité (courbe linéaire) |
| duree-etape | 450 ms | changement d'illustration d'un récit au défilement (MV-08) |
| duree-sortie-page | 240 ms | sortie de la page quittée (MV-07) |
| duree-respiration | 8 s | un cycle de respiration d'un halo (MV-04) |
| delai-depart | 200 ms | départ d'un titre révélé (MV-10) et des éléments d'une illustration (MV-08) |
| delai-cascade | 70 ms | décalage entre deux éléments d'une cascade (MV-01) ou deux tracés (MV-05) |
| delai-mot-titre | 110 ms | décalage entre deux mots d'un titre révélé (MV-10) ou deux éléments d'une illustration (MV-08) |
| delai-mot | 40 ms | décalage entre deux mots d'un intitulé révélé (MV-10) |
| delai-caractere | 11 ms | décalage entre deux caractères d'une fenêtre de code qui s'écrit (MV-03) |
| distance-apparition | 16 px | montée d'une apparition (MV-01) ; la moitié pour la sortie d'une page (MV-07) |
| distance-soulevement | 4 px | soulèvement d'une carte ou d'une fenêtre au survol, glissement d'une flèche (MV-06) |
| courbe-standard | cubic-bezier(0.2, 0, 0, 1) | changements d'état : survol, appui ; sortie d'une page (MV-07) |
| courbe-sortie | cubic-bezier(0.23, 1, 0.32, 1) | entrées : démarre vite, se pose doucement |
| courbe-entree-sortie | cubic-bezier(0.77, 0, 0.175, 1) | tracés : accélère puis ralentit |

### 3.9 Plans de superposition

| Jeton | Valeur | Usage |
| --- | --- | --- |
| plan-contenu | 1 | points de frise au-dessus du fil |
| plan-entete | 10 | en-tête collant |
| plan-menu | 20 | menu ouvert |
| plan-evitement | 30 | lien d'évitement au focus |

## 4. Typographie

### Trois familles

Trio retenu le 16/10/2026 (point P-02) : Bricolage Grotesque, Hanken Grotesk et JetBrains Mono.

| Rôle | Famille | Licence | Graisses retenues | Pourquoi |
| --- | --- | --- | --- | --- |
| Titres (police-titre) | Bricolage Grotesque | SIL Open Font License 1.1 | 700 et 800 | grotesque à axe de taille optique : sobre en petite taille, expressive en très grande ; elle donne au titre d'affiche serré son caractère sans tomber dans la fantaisie |
| Texte (police-texte) | Hanken Grotesk | SIL Open Font License 1.1 | 400, 500, 600 et 700 | grotesque neutre et ouverte, confortable en texte long, accents et ligatures du français complets |
| Chasse fixe (police-mono) | JetBrains Mono | SIL Open Font License 1.1 | 400 et 500 | dessinée pour le code, très lisible en petite taille et en capitales espacées ; ligatures désactivées dans les extraits de code pour montrer les caractères tels qu'ils sont tapés |

La licence SIL Open Font License 1.1 permet l'usage, l'intégration dans un site ou une application, la modification et la redistribution, gratuitement ; les trois familles couvrent le latin étendu. Comme le fixe la conception technique, les polices sont servies par le site lui-même : aucune police n'est chargée chez un tiers ; le format de chargement (fichiers, sous-ensembles de caractères, préchargement) se décide au scaffold. La page catalogue, simple démonstration hors du site, continue de les charger depuis le service de polices de Google pour l'aperçu. Chaque famille a un repli système (section 3.2) : si la police manque, la page reste lisible.

Alternative plus classique, écartée le 16/10/2026 (point P-02) : Sora pour les titres, Source Sans 3 pour le texte, IBM Plex Mono pour la chasse fixe, toutes trois sous SIL Open Font License 1.1.

### Échelle typographique

Entre 360 px et 1200 px de large, chaque taille croît de façon continue de sa valeur téléphone à sa valeur grand écran ; au-delà de 1200 px elle reste à sa valeur grand écran. Sous 360 px, seule l'affiche peut descendre encore, jusqu'à 42 px.

| Jeton | Usage | Famille et graisse | Grand écran (≥ 1200 px) | Téléphone (360 px) | Interligne | Approche |
| --- | --- | --- | --- | --- | --- | --- |
| taille-affiche | nom ou phrase d'impact, une fois par page | titre, 800 | 120 px | 46 px | 0.96 | -0.045em |
| taille-titre-1 | titre de section | titre, 800 | 72 px | 38 px | 1.06 | -0.03em |
| taille-titre-2 | titre de bloc | titre, 800 | 48 px | 30 px | 1.06 | -0.03em |
| taille-titre-3 | titre de carte, de composant | titre, 700 | 28 px | 22 px | 1.2 | -0.015em |
| taille-titre-4 | intitulé d'étape, petit titre | titre, 700 | 20 px | 18 px | 1.2 | -0.015em |
| taille-chapo | introduction d'une section | texte, 400 | 22 px | 18 px | 1.55 | 0 |
| taille-texte | texte courant, boutons, champs | texte, 400 (boutons et libellés 600) | 17 px | 16 px | 1.6 | 0 |
| taille-texte-petit | aides, légendes, textes de message | texte, 400 ou 500 | 15 px | 14 px | 1.45 | 0 |
| taille-code | code, périodes de la frise | chasse fixe, 400 | 14 px | 13 px | 1.45 à 1.65 | 0 |
| taille-etiquette | étiquettes et pastilles, en capitales | chasse fixe, 500 | 12 px | 12 px | 1.2 | 0.16em (pastille 0.1em) |

Règles :

- Une seule affiche par page. Les titres sont en casse normale, jamais en capitales ; les capitales sont réservées aux étiquettes et aux pastilles, en chasse fixe et espacées.
- Le texte courant tient sur 68 caractères au plus par ligne (conteneur-texte).
- Les titres s'équilibrent sur leurs lignes ; la césure est permise sur l'affiche et le titre 1, pour qu'aucun mot ne déborde à 320 px.
- Les dates et périodes sont en chasse fixe : les chiffres s'alignent d'une étape à l'autre.

## 5. Mise en page et largeurs d'écran

### Largeurs couvertes

Le site couvre toutes les largeurs de **320 px** (plus petit téléphone courant en portrait) à **2560 px** (grand écran de bureau). Au-delà de 2560 px, rien ne change : le contenu reste plafonné et centré, seul le fond (halos, trame) s'étend. À aucune largeur la page ne défile horizontalement. Un zoom du navigateur à 200 % sur un écran de 1280 px revient à une largeur de 640 px : il est donc couvert par la tranche moyenne.

| Tranche | Largeurs | Écrans typiques | Colonnes | Gouttière | Marge de page | Conteneur |
| --- | --- | --- | --- | --- | --- | --- |
| étroite | 320 à 599 px | téléphones en portrait | 4 | 16 px | 16 px | pleine largeur |
| moyenne | 600 à 899 px | grands téléphones en paysage, petites tablettes | 8 | 20 px | 24 px | pleine largeur |
| large | 900 à 1199 px | tablettes en paysage, petits portables | 12 | 24 px | 32 px | pleine largeur |
| très large | 1200 à 1599 px | portables et écrans de bureau | 12 | 24 px | 48 px | 1200 px pour le contenu, 1440 px pour l'accueil et la frise |
| immense | 1600 px et plus | grands écrans | 12 | 32 px | 64 px | 1440 px au plus, centré |

### Jetons de mise en page

| Jeton | Valeur | Usage |
| --- | --- | --- |
| rupture-moyenne | 600 px | passage de la tranche étroite à la moyenne |
| rupture-large | 900 px | frise horizontale, flou de verre de l'en-tête |
| rupture-tres-large | 1200 px | navigation complète dans l'en-tête, accueil sur deux colonnes |
| rupture-immense | 1600 px | marges et gouttières élargies |
| conteneur-texte | 68 caractères | longueur maximale d'une ligne de texte |
| conteneur-standard | 1200 px | largeur maximale du contenu courant |
| conteneur-large | 1440 px | largeur maximale de l'accueil, de la frise, des grilles de cartes |
| marge-page | 16, 24, 32, 48 puis 64 px selon la tranche | marge latérale de la page |
| gouttiere | 16, 20, 24, 24 puis 32 px selon la tranche | écart entre colonnes |
| hauteur-entete | 64 px | hauteur de l'en-tête |

### Comportements par tranche

- **En-tête (CO-06)** : compact sous 1200 px (marque, CV, contact, bouton de menu) ; navigation complète à partir de 1200 px. Sous 480 px, la marque se réduit à son monogramme ; le nom reste lisible par les lecteurs d'écran.
- **Cartes (CO-05)** : une colonne en tranche étroite, deux en moyenne et large, trois à partir de la tranche très large.
- **Frise (CO-09)** : verticale sous 900 px, horizontale à partir de 900 px.
- **Accueil** : texte et fenêtre factice l'un sous l'autre sous 1200 px, côte à côte au-delà.
- **Formulaire (CO-10)** : un champ par ligne en tranche étroite ; nom et prénom côte à côte quand la place le permet.
- **Rythme vertical** : une section respire de espace-16 (64 px) sur téléphone à espace-24 (96 px) à partir de 900 px. Aucune section n'impose la hauteur de l'écran.

## 6. Mouvement

Intensité mesurée, choix d'Alexandre du 17/10/2026 : le mouvement donne au site l'allure d'un site vitrine, pas celle d'une application métier, sans jamais retenir la lecture. Les montées font distance-apparition (16 px), les entrées durent de duree-longue à duree-apparition (600 à 700 ms), et rien ne change d'échelle en apparaissant. Les durées, délais, distances et courbes sont des jetons (section 3.8), la lueur de survol aussi (section 3.6) ; cette section fixe quand et comment on s'en sert.

Le mouvement se compose de dix motifs, MV-01 à MV-10, numérotés lors du choix d'Alexandre du 17/10/2026 ; MV-09 est écarté. Chaque motif dit son rôle, où il vit (par composant), son comportement, ses jetons, ce qu'il devient sans animation et sans script, et son coût pour la rapidité. Les écrans du portfolio n'y sont cités qu'en exemple : les motifs servent toute application qui reprend la charte (section 9).

### Durées et courbes, par usage

- **Changement d'état** (survol, appui, focus) : duree-courte et courbe-standard pour les couleurs ; duree-instant pour l'enfoncement d'un bouton (1 px, échelle 0.98).
- **Soulèvement** d'une carte ou d'une fenêtre interactive au survol : distance-soulevement vers le haut, duree-moyenne, courbe-sortie (MV-06).
- **Apparition** : duree-apparition, courbe-sortie, opacité de 0 à 1 et montée de distance-apparition, en cascade séparée de delai-cascade (MV-01).
- **Tracé d'un filet ou d'un trait** : duree-longue ; courbe-sortie pour un filet qui s'étire, courbe-entree-sortie pour un trait qui se dessine (MV-05).
- **Tracé d'une frise** : d'un coup en duree-trace, courbe-entree-sortie, quand toute la frise est visible, puis il reste tracé ; sinon il suit la progression de la lecture, sans durée propre ; ses points s'allument en duree-moyenne (MV-02).
- **Changement d'illustration** d'un récit au défilement : duree-etape, courbe-sortie (MV-08).
- **Changement de page** : sortie en duree-sortie-page, courbe-standard ; arrivée en duree-longue (MV-07).
- **Révélation d'un titre** : départ à delai-depart, mots séparés de delai-mot-titre (titre) ou de delai-mot (intitulé) (MV-10) ; caractères d'une fenêtre de code séparés de delai-caractere (MV-03).
- **Respiration d'un halo** : un cycle en duree-respiration, en boucle, qu'on peut mettre en pause (MV-04).
- **Indicateur d'activité** : un tour en duree-rotation, courbe linéaire, en boucle tant que l'attente dure.

### MV-01 — Apparitions en cascade
- **Rôle** : faire entrer le contenu dans l'ordre de lecture, pour guider l'œil sans le retenir.
- **Où** : chaque bloc de contenu de chaque écran (par exemple un en-tête de section CO-16, une grille de cartes CO-05, une liste) ; jamais l'en-tête (CO-06) ni le pied de page (CO-08).
- **Comportement** : quand un bloc entre dans la fenêtre — une seule fois ; au chargement pour ce qui est déjà visible ; jamais au retour en arrière ni en remontant —, ses éléments passent de l'opacité 0 à 1 et montent de distance-apparition (16 px), en duree-apparition (700 ms), courbe-sortie, dans l'ordre de lecture, séparés de delai-cascade (70 ms) : le premier part à 120 ms, le sixième à 470 ms et il est en place vers 1.2 s. Six éléments au plus par cascade ; les suivants partent avec le sixième. Chaque bloc a sa propre cascade. Jamais de changement d'échelle.
- **Jetons** : duree-apparition, distance-apparition, delai-cascade, courbe-sortie.
- **Sans animation** : tout est en place dès l'affichage.
- **Sans script** : tout est en place : les états cachés n'existent que sous la classe mv-actif (voir « Contenu visible sans script »).
- **Coût** : opacité et transformation (translation verticale) ; IntersectionObserver et transitions CSS ; coût faible : chaque élément occupe sa place finale dès le départ, aucun décalage de mise en page.

### MV-02 — Frise tracée au défilement
- **Rôle** : montrer l'avancée d'un parcours au rythme de la lecture.
- **Où** : chaque frise chronologique (CO-09) ; dans le portfolio, par exemple, celle de l'écran Parcours (EC-02).
- **Comportement** : quand toute la frise est visible dans la fenêtre (son haut et son bas à l'intérieur), le trait se trace d'un coup jusqu'à l'étape mise en avant, en duree-trace (1200 ms), courbe-entree-sortie, et chaque point s'allume (opacité, duree-moyenne) au moment où le trait l'atteint réellement : le décalage suit courbe-entree-sortie, pas une part linéaire de duree-trace. Pour un point placé à la position p du trait (de 0 au début à 1 à l'étape mise en avant), on inverse la courbe pour trouver l'instant t (de 0 à 1) où le trait passe p, et le décalage vaut t × duree-trace ; par exemple, un point au quart du trait s'allume vers 500 ms et non à 300 ms, un point aux trois quarts vers 660 ms et non à 900 ms. Une fois tracé en entier (frise entièrement visible), le trait reste tracé pendant toute la visite de la page : il ne recule plus quand on remonte. Au retour arrière sur la page, il est posé d'emblée, sans tracé, comme les cascades (MV-01), qui ne rejouent jamais au retour. Tant que le trait n'a pas été tracé en entier, il suit le défilement : il avance avec la progression de la frise dans la fenêtre (mise à l'échelle verticale ; horizontale quand la frise est horizontale) et recule quand on remonte, et chaque point s'allume quand le trait l'atteint. Dans tous les cas, le trait s'arrête toujours à l'étape mise en avant, dont le point est toujours allumé, avec sa lueur-point, même avant que le trait l'atteigne ; les étapes prévues gardent leur point creux. Seul le point s'allume : le texte des étapes (période, intitulé, détail) garde toujours son plein contraste, il n'est jamais grisé (section 8). Quand le trait suit le défilement, c'est la lecture qui le pilote : aucun plan ne défile à une autre vitesse que la page, ce n'est pas une parallaxe.
- **Jetons** : duree-trace, courbe-entree-sortie, duree-moyenne, lueur-point.
- **Sans animation** : trait entier jusqu'à l'étape mise en avant, tous les points allumés (les étapes prévues gardent leur point creux).
- **Sans script** : trait entier jusqu'à l'étape mise en avant, tous les points allumés (les étapes prévues gardent leur point creux).
- **Coût** : transformation (mise à l'échelle du trait) et opacité (points) ; écouteur de défilement passif et une mise à jour au plus par image (requestAnimationFrame), pas d'animation-timeline, pour un même rendu dans Chrome et Safari ; coût faible tant que chaque image n'écrit qu'une transformation et quelques opacités.

### MV-03 — Fenêtre de code qui s'écrit
- **Rôle** : donner vie à un extrait de code, comme s'il était tapé sous les yeux du visiteur.
- **Où** : une fenêtre factice en variante code (CO-12) ; dans le portfolio, la fenêtre « profil.ts » de l'accueil (EC-01), qui reprend le nom, l'intitulé et l'alternance (sans bloc « liens », choix d'Alexandre du 17/10/2026), trois informations déjà affichées sur l'accueil : le nom et l'intitulé en tête de l'accueil (MV-10), l'alternance en tête du texte de la carte « Expérience » (choix d'Alexandre du 17/10/2026) ; elle s'affiche à partir de 600 px seulement : elle est masquée en dessous (choix C3 du 16/10/2026) et rien ne tourne alors.
- **Comportement** : une fois, à l'apparition ; chaque caractère est déjà en place, invisible, et passe à l'opacité 1 selon ce minutage : delai-caractere par caractère, 10 × delai-caractere en fin de ligne, 3 × delai-caractere après une virgule, indentation instantanée ; un curseur (déplacé par translation) clignote pendant l'écriture (cycle de 2 × duree-longue) puis disparaît ; le cadre a sa taille finale dès le départ. L'écriture dure moins de 5 s : le curseur clignote pendant l'écriture, et le critère 2.2.2 ne demande pas de moyen de pause pour ce qui s'arrête seul avant 5 s ; un extrait plus long s'affiche déjà écrit ; dans le portfolio, environ 3 s. Le code reste du texte sélectionnable. Une fenêtre de code qui répète des informations déjà affichées est un décor, masqué aux lecteurs d'écran : dans le portfolio, « profil.ts » est un décor de ce type (choix d'Alexandre du 17/10/2026) : elle ne fait que répéter des informations affichées sur l'accueil (voir « Où »), la règle est donc tenue ; si elle portait une information propre, elle devrait être lisible par les lecteurs d'écran (technique tranchée au plan front). Le curseur est décoratif.
- **Jetons** : delai-caractere, duree-longue.
- **Sans animation** : le code est écrit, pas de curseur.
- **Sans script** : le code est écrit, pas de curseur.
- **Coût** : opacité des caractères, translation du curseur ; un script qui enveloppe chaque caractère une fois et règle son délai ; coût modéré, proportionnel à la longueur de l'extrait (un élément par caractère), sans aucun recalcul de mise en page pendant l'écriture puisque le cadre a sa taille finale.

### MV-04 — Halos qui respirent
- **Rôle** : faire vivre la lumière du fond, lentement, sans attirer l'œil.
- **Où** : les halos de l'arrière-plan d'ambiance (CO-13, variantes accueil et section ; la variante sobre n'a pas de halo).
- **Comportement** : animation CSS en boucle sur le calque de chaque halo, cycle de duree-respiration (8 s), opacité de 55 % à 100 % de la valeur de la charte (jamais au-delà : les contrastes calculés au pic restent vrais, section 8), échelle de 0,9 à 1,08 autour du centre du halo ; deux halos d'une même section en opposition de phase : quand l'un est à son pic, l'autre est à son creux. Pas de suivi du pointeur. Ne tourne que si le script de mouvement est actif (sans script, halos fixes : le bouton de pause n'existerait pas). Se fige avec le bouton de pause (voir « Pause des animations »).
- **Jetons** : duree-respiration, halo-accent, halo-secondaire, opacite-halo-accent, opacite-halo-secondaire.
- **Sans animation** : halos fixes à leur valeur de charte, échelle 1.
- **Sans script** : halos fixes à leur valeur de charte, échelle 1.
- **Coût** : opacité et transformation (échelle) du calque de chaque halo ; le dégradé lui-même n'est jamais repeint ; animation CSS, sans script à chaque image ; coût faible mais permanent : c'est la seule animation qui tourne tant que la page reste ouverte, d'où le bouton de pause.

### MV-05 — Tracés qui se dessinent
- **Rôle** : souligner l'arrivée d'un bloc par un trait qui se dessine.
- **Où** : le filet sous l'étiquette d'un en-tête de section (CO-16 ; dans l'anatomie actuelle, le trait de son étiquette numérotée, CO-04), les icônes en trait des cartes (CO-05), la flèche des liens d'action (CO-02).
- **Comportement** : à l'apparition du bloc, une fois ; le filet s'étire (mise à l'échelle horizontale depuis la gauche, duree-longue, courbe-sortie) ; les icônes puis la flèche se dessinent trait par trait (longueur mesurée une fois, transition de stroke-dashoffset en duree-longue, courbe-entree-sortie, décalées de delai-cascade).
- **Jetons** : duree-longue, courbe-sortie, courbe-entree-sortie, delai-cascade.
- **Sans animation** : tracés complets.
- **Sans script** : tracés complets.
- **Coût** : transformation pour le filet ; stroke-dashoffset pour les icônes et la flèche : c'est la seule propriété animée hors opacité et transformation, et seulement sur des traits SVG de petite surface, repeints pendant duree-longue puis plus jamais ; coût faible tant que ces traits restent petits.

### MV-06 — Survols vivants
- **Rôle** : répondre au pointeur, pour dire « ceci se clique ».
- **Où** : les cartes interactives (CO-05) et les liens d'action (CO-02), seulement avec une souris (media « (hover: hover) and (pointer: fine) »).
- **Comportement** : la carte se soulève de distance-soulevement (duree-moyenne, courbe-sortie) ; son ombre, le jeton ombre-flottante, apparaît par l'opacité d'un calque (l'ombre elle-même n'est jamais animée) ; la lueur-survol suit le pointeur à l'intérieur de la carte : un disque radial de taille-lueur-survol (380 px), de couleur-accent à opacite-lueur-survol (20 %) vers transparent, posé sous le contenu de la carte (le texte reste au-dessus), dans un calque déplacé par translation, position mise à jour au plus une fois par image ; 20 % et non les 22 % de la démonstration, pour que le texte discret d'une carte en verre garde 4.5:1, et une carte interactive ne se pose jamais sur un halo (section 8) ; la flèche du lien glisse de distance-soulevement vers la droite et son soulignement s'étire depuis la gauche (mise à l'échelle horizontale, duree-moyenne). Au clavier, :focus-visible donne le même soulèvement et le même soulignement, sans lueur.
- **Jetons** : distance-soulevement, duree-moyenne, courbe-sortie, ombre-flottante, lueur-survol, opacite-lueur-survol, taille-lueur-survol.
- **Sans animation** : seules les couleurs changent, instantanément.
- **Sans script** : le soulèvement, l'ombre, la flèche et le soulignement, portés par la feuille de style, restent ; seule la lueur, qui suit le pointeur par script, est absente.
- **Coût** : transformation (soulèvement, flèche, calque de lueur, soulignement) et opacité (calque d'ombre) ; transitions CSS et un écouteur de pointeur limité à une mise à jour par image ; coût faible : le disque de lueur est peint une fois, puis seulement déplacé par translation sous le contenu de la carte ; l'ombre n'est jamais animée.

### MV-07 — Transitions entre pages
- **Rôle** : lier les pages entre elles, pour que la navigation se lise comme un seul site.
- **Où** : toute navigation interne.
- **Comportement** : la page quittée s'efface (opacité vers 0) en montant de la moitié de distance-apparition, en duree-sortie-page, courbe-standard ; la nouvelle arrive en fondu en duree-longue, sans translation (ses blocs visibles font déjà leur cascade, MV-01) ; l'en-tête (CO-06) ne participe pas à la transition et reste fixe ; le repère de page courante glisse de l'ancien lien vers le nouveau. Sur le site, c'est le navigateur qui anime (transitions de vue) ; la technique se tranche au plan front ; sans prise en charge, navigation immédiate. Dans les maquettes, ouvertes comme fichiers locaux où les transitions natives entre documents ne jouent pas, un script simule la transition : sortie, puis navigation, puis entrée au chargement ; il n'intercepte jamais un clic avec Cmd, Ctrl, Maj ou Alt, un clic milieu, un lien externe, une ancre de la même page, un téléchargement ou un lien avec target ; au retour arrière (page restaurée depuis le cache du navigateur), la page revient visible.
- **Jetons** : duree-sortie-page, duree-longue, distance-apparition, courbe-standard.
- **Sans animation** : navigation immédiate.
- **Sans script** : navigation immédiate.
- **Coût** : opacité et transformation des images de page que compose le navigateur ; transitions de vue du navigateur, technique tranchée au plan front ; coût faible, et c'est une amélioration facultative : les transitions de vue entre documents ne sont pas encore disponibles dans tous les navigateurs courants, un navigateur qui ne les prend pas en charge navigue sans elles.

### MV-08 — Récit au défilement
- **Rôle** : raconter une démarche pas à pas, l'illustration suivant le texte.
- **Où** : un récit en étapes à côté d'une fenêtre factice collante (CO-12) ; dans le portfolio, la page Méthode de travail (EC-05).
- **Comportement** : le texte (dans le portfolio : C-04 découpé en étapes ; quatre étapes de démonstration étiquetées tant que C-04 manque) défile à côté d'une fenêtre collante (CO-12) ; l'étape active est celle dont le haut a passé 40 % de la hauteur de la fenêtre du navigateur ; la fenêtre factice montre son illustration (changement en opacité et position de 14 px, duree-etape, courbe-sortie ; éléments intérieurs décalés de delai-mot-titre après delai-depart ; schéma tracé par stroke-dashoffset ; barres par mise à l'échelle horizontale) et une barre de progression avance (mise à l'échelle horizontale). L'étape active se signale par un filet d'accent et la progression, jamais en grisant le texte des autres (section 8). Sous 900 px : la fenêtre se cale en haut, sous l'en-tête collant, et le texte passe dessous. Hauteur des étapes, mesurée sur la fenêtre du navigateur : sous 900 px, chaque étape mesure au moins 30 % de la hauteur de la fenêtre (70 % à partir de 900 px). Comme pour MV-02, c'est la lecture qui pilote : ce n'est pas une parallaxe.
- **Jetons** : duree-etape, delai-depart, delai-mot-titre, courbe-sortie.
- **Sans animation** : comme sans script : pas de fenêtre collante, chaque illustration s'affiche sous le texte de son étape.
- **Sans script** : pas de fenêtre collante, chaque illustration s'affiche sous le texte de son étape.
- **Coût** : opacité et transformation (position de l'illustration, mise à l'échelle des barres et de la progression), stroke-dashoffset pour le schéma, sur des traits de petite surface ; position: sticky, écouteur de défilement passif, une mise à jour par image ; coût faible : le navigateur tient seul la fenêtre collante, le script ne fait que choisir l'étape active.

### MV-09 — Bandeau en boucle (écarté)
- **Pourquoi écarté** : choix d'Alexandre du 17/10/2026 : un bandeau des compétences qui défile en boucle est un gadget qui distrait un public de recrutement ; rien ne défile en boucle. L'identifiant reste réservé, pour garder la numérotation du choix.

### MV-10 — Titre révélé mot par mot
- **Rôle** : ouvrir le site par un geste d'arrivée, une seule fois.
- **Où** : le titre d'affiche et l'intitulé d'un écran d'accueil ; dans le portfolio, le nom et l'intitulé de l'accueil (EC-01).
- **Comportement** : une fois, à l'arrivée ; chaque mot glisse de bas en haut derrière un cache (overflow hidden) en position et opacité ; le titre (le nom) : départ à delai-depart, un mot toutes les delai-mot-titre, chaque mot en duree-apparition ; l'intitulé : départ quand le dernier mot du titre est parti, un mot toutes les delai-mot, chaque mot en duree-longue ; puis la présentation et les boutons, en cascade (MV-01) ; tout est en place avant 2 s. Aucun délai au-delà de delai-depart sur le titre : c'est probablement le plus grand élément du premier écran, celui dont Lighthouse mesure l'affichage ; si la mesure du lot des écrans dépasse le seuil, le titre partira sans délai (voir « Budget de mouvement »). Le titre est lu d'un seul tenant par les lecteurs d'écran.
- **Jetons** : delai-depart, delai-mot-titre, delai-mot, duree-apparition, duree-longue.
- **Sans animation** : affiché d'emblée.
- **Sans script** : affiché d'emblée.
- **Coût** : opacité et transformation (translation verticale de chaque mot) ; un script découpe le titre en mots, une fois ; c'est le motif le plus exposé pour la rapidité, puisqu'il retarde l'élément que Lighthouse mesure : d'où le délai limité à delai-depart et le repli prévu.

### Réduction des animations

Quand le visiteur a demandé à son système de réduire les animations :

- aucune translation, aucune cascade, aucun tracé, aucun soulèvement, aucune respiration, aucune transition entre pages : chaque élément s'affiche directement dans son état final ; chaque motif dit ce qu'il devient à sa puce « Sans animation » ;
- le récit au défilement (MV-08) se présente comme sans script : pas de fenêtre collante, chaque illustration s'affiche sous le texte de son étape ;
- la classe mv-actif n'est jamais posée : aucun état caché n'existe ;
- les changements de couleur deviennent instantanés ; le défilement doux vers une ancre est coupé ;
- le bouton de pause est masqué : il n'y a plus rien à figer ;
- l'indicateur d'activité devient un anneau fixe ; le texte « Envoi en cours… » porte l'information.

Rien d'essentiel ne dépend d'une animation : aucune information n'apparaît seulement par le mouvement, aucune action n'attend la fin d'une animation. La préférence fait aussi taire le mouvement déclenché par le défilement (MV-02, MV-08), comme le demande le critère 2.3.3, de niveau AAA, au-delà de la cible AA.

### Pause des animations

La respiration des halos (MV-04) démarre seule, dure plus de 5 s et s'affiche à côté du contenu : le critère 2.2.2 « Pause, Stop, Hide » (niveau A) demande alors un moyen de la mettre en pause. Choix d'Alexandre du 17/10/2026 : un bouton dans le pied de page.

- **Le bouton** : dans le pied de page (CO-08) de chaque page, « Mettre les animations en pause » ; une fois pressé, « Relancer les animations ». Le libellé change, et rien d'autre : aucun état pressé n'est annoncé, car le guide WAI-ARIA APG (page Button) déconseille de cumuler un libellé qui change et un état pressé ; le libellé d'un bouton à bascule ne doit pas changer, et un libellé qui change rend l'état pressé inutile. Il a l'apparence d'un lien discret du pied de page, avec une icône pause / lecture en trait ; sa cible mesure au moins 44 × 44 px (cible-tactile) ; il porte l'anneau-focus de la charte.
- **Ce qu'il fige** : ce qui tourne en boucle (MV-04). Il ne touche pas aux mouvements joués une fois (cascades, tracés, transitions), qui s'arrêtent seuls.
- **Mémoire** : le choix est mémorisé d'une page à l'autre, dans le stockage local du navigateur, sans erreur s'il est indisponible ; le petit script de tête le relit et l'applique avant le premier affichage.
- **Masqué** quand le visiteur a demandé à réduire les animations et quand le script ne tourne pas : les halos sont alors fixes.
- **Sa place** : le pied de page, gardée telle quelle par Alexandre le 17/10/2026 après la revue des maquettes (section 10, P-10).

### Contenu visible sans script

- **Visible par défaut** : les états cachés (opacité 0, translation de départ, trait non tracé, caractère invisible) n'existent que sous la classe mv-actif de l'élément html.
- **Le petit script de tête** : quelques lignes dans le head, exécutées de façon synchrone avant le premier affichage ; il pose mv-actif, et seulement si le visiteur n'a pas demandé à réduire les animations ; il relit aussi le choix de pause mémorisé pour l'appliquer d'emblée.
- **mv-pret** : le script de mouvement, chargé en différé, pose mv-pret quand il est prêt.
- **Repli à 3 s** : si mv-pret n'est pas posé 3 s après, le petit script retire mv-actif et tout s'affiche. Un script de mouvement absent, bloqué ou en erreur ne cache donc jamais le contenu.
- **L'en-tête** (marque, navigation, actions permanentes) n'entre jamais dans une cascade et n'est jamais masqué à l'arrivée : dans le portfolio, le CV et le contact restent à un clic dès le premier affichage (MF-02, conception technique) ; les boutons d'action de l'accueil sont en place avant 2 s.
- **Politique de sécurité de contenu** : la conception technique en prévoit une (section 7) : elle n'autorise que les ressources du site et l'adresse du back, et elle est posée par le fichier d'en-têtes de l'hébergeur du front. Le petit script de tête, seul script en ligne qu'exige le mouvement, s'y autorise par son empreinte, sans rouvrir les scripts en ligne en général ; le script de mouvement, chargé depuis un fichier du site, entre dans les ressources du site. La conception technique laisse au scaffold la vérification de cette politique, en version stricte, avec les scripts et styles en ligne que produisent le pré-rendu et l'hydratation d'Angular (révision du 27/10/2026).

### Budget de mouvement, pour un site rapide

La conception technique fixe le budget (D-11, CT-10) : score de performance Lighthouse mobile d'au moins 90 et seuils « bons » des Core Web Vitals, dont le plus grand élément affiché en 2,5 s au plus et un décalage cumulé de 0,1 au plus. Le mouvement s'y plie :

- **Propriétés animées** : l'opacité, la transformation, stroke-dashoffset (traits SVG de MV-05 et MV-08) et, pour les changements d'état déjà prévus par la charte, les couleurs (color, background-color, border-color, outline-color, fill, stroke, text-decoration-color). Jamais « transition: all », jamais de flou animé, jamais d'ombre animée (on anime l'opacité d'un calque d'ombre), jamais de propriété de mise en page (largeur, hauteur, position, marges).
- **Aucun décalage de mise en page** dû au mouvement : les cadres ont leur taille finale dès le départ.
- **Aucune bibliothèque d'animation** : du CSS et un seul script de mouvement (dans les maquettes : mouvement.js).
- **Ce qui tourne en boucle** se limite à la respiration des halos (qu'on peut mettre en pause), à l'indicateur d'activité pendant une attente et au curseur de MV-03 pendant l'écriture, qui dure moins de 5 s (environ 3 s dans le portfolio).
- **Halos, trame et voile** restent des dégradés peints une fois : la respiration fait varier l'opacité et l'échelle du calque, jamais le dégradé. Les halos défilent avec leur section : jamais d'arrière-plan fixé à la fenêtre.
- **Pas de parallaxe, pas de vidéo.** La parallaxe fait défiler des plans à des vitesses différentes ; MV-02 et MV-08 suivent la progression de la lecture, sur un seul plan : ce n'en sont pas.
- Le flou d'arrière-plan (flou-verre) est réservé à deux éléments, l'en-tête collant et le menu ouvert, et seulement à partir de 900 px. En dessous, l'en-tête est opaque à 92 % et le menu entièrement opaque ; il en va de même sur un navigateur qui ne sait pas flouter l'arrière-plan. Les cartes en verre n'ont pas de flou : posées sur des dégradés lisses, elles n'y gagneraient presque rien et le flou coûterait à chaque défilement.
- **Mesure** : au lot des écrans, sur le site en Angular, pas sur les maquettes. Si le titre révélé (MV-10) fait dépasser le seuil, il part sans délai.

## 7. Composants

Chaque composant n'utilise que des jetons. Les états survol, focus et appuyé sont montrés figés dans la page catalogue pour être comparés.

### CO-01 — Bouton
- **Rôle** : déclencher une action (envoyer, télécharger, réessayer). Une destination de premier plan peut prendre l'aspect d'un bouton, mais reste un lien.
- **Anatomie** : conteneur d'au moins cible-tactile de haut et de large ; libellé en police-texte, graisse-appuyee ; icône facultative à gauche ou à droite ; indicateur d'activité (CO-15) en état d'envoi.
- **Variantes** : primaire (fond couleur-accent, texte couleur-texte-sur-accent ; une seule par zone d'écran) ; secondaire (verre-fond, filet verre-bordure, texte couleur-texte) ; discret (sans fond, pour une action mineure) ; icône seule (44 × 44 px, libellé masqué obligatoire) ; compact (marges latérales réduites, même hauteur), pour l'en-tête.
- **États** : repos ; survol (primaire : couleur-texte à 12 % mêlée à l'accent ; secondaire : fond couleur-texte à 8 % et filet couleur-texte-discret ; discret : fond couleur-texte à 8 %) ; focus (anneau-focus) ; appuyé (1 px plus bas, échelle 0.98) ; désactivé (fond couleur-surface-relevee, texte couleur-texte-discret, sans survol) ; en cours (indicateur d'activité et libellé « Envoi en cours… », aspect primaire conservé, nouvel envoi bloqué).
- **Accessibilité** : bouton natif pour une action, lien pour une navigation ; libellé qui dit l'action ; l'état en cours est annoncé par le texte du bouton et par le message d'état (CO-11). On ne désactive pas le bouton d'envoi pour signaler un formulaire incomplet : les erreurs s'affichent à l'envoi.
- **Jetons** : couleur-accent, couleur-texte-sur-accent, couleur-texte, couleur-texte-discret, couleur-surface-relevee, verre-fond, verre-bordure, anneau-focus, police-texte, graisse-appuyee, taille-texte, arrondi-petit, espace-2, espace-3, espace-5, cible-tactile, duree-courte, duree-instant, courbe-standard.

### CO-02 — Lien
- **Rôle** : mener vers une autre page, une section, un fichier ou un site externe.
- **Anatomie** : texte souligné ; icône facultative (flèche pour un lien d'action, flèche oblique pour un lien externe).
- **Variantes** : dans le texte (couleur-accent, soulignement à 55 % de l'accent) ; discret (couleur-texte-secondaire, pour les liens de pied de page) ; d'action (« Voir la fiche » suivi d'une flèche, sans soulignement au repos, 44 px de haut) ; de navigation (couleur-texte-secondaire, 44 px de haut, trait d'accent de 2 px sous la page courante) ; externe (flèche oblique et texte masqué « (nouvel onglet) »).
- **États** : repos ; survol (soulignement plein de 2 px, ou texte couleur-texte pour le discret et la navigation ; pour le lien d'action, flèche qui glisse de distance-soulevement et soulignement qui s'étire depuis la gauche, MV-06) ; focus (anneau-focus ; le lien d'action reçoit au clavier le même soulignement, MV-06) ; page courante (navigation : texte couleur-texte et trait d'accent) ; visité (identique au repos : le site est court, l'information n'aide pas). À l'apparition de son bloc, la flèche d'un lien d'action se dessine (MV-05).
- **Accessibilité** : dans un texte, le lien est toujours souligné, la couleur ne suffit pas ; la page courante est signalée par un attribut, pas seulement par le trait ; un lien externe s'ouvre dans un nouvel onglet (le site reste ouvert, MF-17) et l'annonce par l'icône et le texte masqué.
- **Jetons** : couleur-accent, couleur-texte, couleur-texte-secondaire, anneau-focus, graisse-moyenne, graisse-appuyee, arrondi-petit, espace-2, espace-3, cible-tactile, duree-courte, duree-moyenne, duree-longue, distance-soulevement, delai-cascade, courbe-standard, courbe-sortie, courbe-entree-sortie.

### CO-03 — Pastille
- **Rôle** : qualifier un élément par un état ou une catégorie, en un ou deux mots.
- **Anatomie** : forme en pilule ; point de 6 px de la couleur du texte ; mot en police-mono, graisse-moyenne, taille-etiquette, capitales, approche-pastille.
- **Variantes** : neutre (couleur-texte-secondaire sur couleur-texte à 8 %) ; accent, secondaire, succès, attention, erreur (couleur du rôle sur la même couleur à opacite-teinte) ; à point lumineux (le point rayonne) ; à contour (sans fond, filet verre-bordure, texte couleur-texte). Une pastille posée sur du verre prend toujours la variante à contour, et de même sur le halo d'un arrière-plan d'ambiance (CO-13) ; les variantes teintées se posent sur un fond uni, couleur-fond ou couleur-surface.
- **États** : statique, sans survol ni focus. Une pastille cliquable deviendrait un bouton ou un lien.
- **Accessibilité** : le mot porte le sens, le point le souligne ; jamais de pastille muette. Contraste du texte, calculé pour la palette retenue avec les halos moyens : 5.66:1 au moins dans les configurations permises (le minimum est la pastille erreur teintée sur couleur-surface ; la variante à contour tient 10.22:1 sur le verre au pic d'un halo). Une variante teintée posée sur du verre descendrait à 3.60:1, d'où la règle ci-dessus (section 8).
- **Jetons** : couleur-texte, couleur-texte-secondaire, couleur-accent, couleur-accent-secondaire, couleur-succes, couleur-attention, couleur-erreur, opacite-teinte, verre-bordure, police-mono, graisse-moyenne, taille-etiquette, approche-pastille, arrondi-pilule, arrondi-cercle, espace-2.

### CO-04 — Étiquette
- **Rôle** : annoncer, dater ou ranger un contenu ; c'est la voix « ingénierie » du système.
- **Anatomie** : texte court en police-mono, graisse-moyenne, taille-etiquette, capitales, approche-etiquette ; numéro et trait facultatifs ; puce lumineuse facultative.
- **Variantes** : discrète (couleur-texte-discret, pour les métadonnées et les clés) ; accent (couleur-accent, en sur-titre) ; numérotée (« 02 — Section » : numéro en accent suivi d'un trait de 24 px) ; à puce lumineuse (point d'accent de 7 px qui rayonne, pour un signal d'accueil).
- **États** : statique.
- **Accessibilité** : 12 px au minimum, en capitales espacées pour rester lisible ; contraste d'au moins 4.5:1 même sur le verre posé sur un halo ; l'étiquette n'est jamais la seule source d'une information indispensable écrite en petit.
- **Jetons** : couleur-texte-discret, couleur-accent, police-mono, graisse-moyenne, taille-etiquette, interligne-sous-titre, approche-etiquette, arrondi-cercle, espace-2.

### CO-05 — Carte
- **Rôle** : regrouper un contenu autonome (un projet, une compétence, un fait).
- **Anatomie** : conteneur arrondi-grand ; étiquette facultative ; titre (taille-titre-3) ; texte (couleur-texte-secondaire) ; pied facultatif (pastilles, lien d'action). Sur une carte en verre, les pastilles du pied prennent toujours la variante à contour (CO-03).
- **Variantes** : verre (verre-fond, filet verre-bordure, sur un fond d'ambiance) ; pleine (couleur-surface, filet couleur-bordure, sur un fond uni) ; interactive (toute la carte est cliquable, par un seul lien porté par le titre).
- **États** : repos ; apparition (les cartes d'une grille entrent en cascade, MV-01) ; survol (interactive, avec une souris : soulevée de distance-soulevement, ombre-flottante qui apparaît par l'opacité de son calque, filet couleur-accent à 45 % et lueur-survol qui suit le pointeur à l'intérieur de la carte, sous son contenu, MV-06) ; focus (interactive : anneau-focus autour de toute la carte, même soulèvement, sans lueur) ; sans contenu facultatif (pied ou étiquette absents : la carte se resserre, aucune zone vide). Hors halo, là où se pose toujours une carte interactive, le soulèvement se lit d'abord par la translation, le filet couleur-accent à 45 % et la lueur intérieure ; ombre-flottante est gardée, mais elle n'y est qu'un appoint, peu visible sur un fond aussi sombre (section 3.7).
- **Accessibilité** : un seul lien par carte interactive, dont le texte est le titre ; le lien d'action visible du pied est décoratif, pour ne pas annoncer deux fois la même destination ; l'ordre de lecture suit l'ordre visuel ; la lueur, à l'intérieur de la carte et sous son contenu, ne dépasse pas opacite-lueur-survol (20 %), pour que le texte discret d'une carte en verre garde 4.5:1 ; une carte interactive ne se pose donc jamais sur un halo, où la lueur ferait tomber ce texte vers 3:1 (section 8).
- **Jetons** : verre-fond, verre-bordure, couleur-surface, couleur-bordure, couleur-texte-secondaire, couleur-accent, anneau-focus, ombre-flottante, lueur-survol, opacite-lueur-survol, taille-lueur-survol, arrondi-grand, espace-2, espace-3, espace-6, duree-apparition, distance-apparition, delai-cascade, duree-moyenne, distance-soulevement, duree-courte, courbe-sortie, courbe-standard.

### CO-06 — En-tête et navigation
- **Rôle** : identifier le site et donner accès, sur chaque page, aux sections et aux actions permanentes (dans le portfolio : le CV et le contact, MF-02).
- **Anatomie** : marque (monogramme et nom, lien vers l'accueil) ; navigation (liste de liens de navigation, CO-02) ; actions permanentes (un bouton secondaire compact, un bouton primaire compact) ; bouton du menu replié (CO-07) en version compacte.
- **Variantes** : complète (à partir de 1200 px : marque, navigation, actions) ; compacte (sous 1200 px : marque, actions, bouton de menu ; sous 480 px, la marque se réduit au monogramme, retenu le 16/10/2026 au point P-07 : dans le portfolio, « AM »).
- **États** : collé en haut de page pendant le défilement ; lien de section au repos, au survol, au focus, et section courante (trait d'accent) ; à partir de 900 px, fond couleur-fond à 73 % avec flou-verre ; en dessous, et sur un navigateur qui ne sait pas flouter l'arrière-plan, fond couleur-fond à 92 % sans flou. Révision du 27/10/2026 : 73 % et non plus 72 %, pour que le texte secondaire de la navigation garde 4.5:1 même sans compter le flou, qui ne change pas la teinte moyenne d'une zone unie (4.54:1 à 73 %, 4.38:1 à 72 %, quand un texte en couleur-texte passe sous l'en-tête ; section 8). L'en-tête n'entre jamais dans une cascade et n'est jamais masqué à l'arrivée ; il reste fixe pendant une transition entre pages, où seul le repère de page courante glisse de l'ancien lien vers le nouveau (MV-07).
- **Accessibilité** : région de navigation nommée ; section courante signalée par un attribut ; sous 480 px, le monogramme est décoratif et le nom complet reste annoncé aux lecteurs d'écran, comme nom du lien de la marque ; sa zone de clic mesure au moins cible-tactile (44 × 44 px), comme toute cible : le lien de la marque s'élargit à cible-tactile autour du monogramme, centré, qui garde sa taille (révision du 27/10/2026, déjà appliquée aux maquettes) ; les actions permanentes ne sont jamais dans le menu replié ; le lien d'évitement (CO-14) le précède ; hauteur constante (hauteur-entete) pour que les ancres ne passent pas dessous.
- **Jetons** : couleur-fond, couleur-texte, couleur-surface-relevee, verre-bordure, flou-verre, police-titre, graisse-titre, approche-sous-titre, hauteur-entete, marge-page, plan-entete, cible-tactile, arrondi-petit, arrondi-moyen, espace-1, espace-2, espace-3.

### CO-07 — Menu replié
- **Rôle** : donner accès aux sections quand la largeur ne permet pas la navigation complète.
- **Anatomie** : bouton icône seule (trois traits, croix une fois ouvert), libellé masqué « Menu » ; panneau flottant (couleur-surface-relevee, filet verre-bordure, ombre-flottante, arrondi-grand) ; liste verticale de liens de navigation de 44 px de haut.
- **Variantes** : panneau pleine largeur moins les marges sur téléphone ; panneau de 320 px aligné à droite à partir de 600 px.
- **États** : fermé ; ouvert (icône croix) ; bouton au survol et au focus ; lien au survol (fond couleur-texte à 6 %), au focus, et section courante (fond couleur-accent à 16 % sur couleur-surface, barre d'accent de 3 px à gauche).
- **Accessibilité** : le bouton annonce s'il est ouvert ou fermé et quel panneau il commande ; Échap ferme le panneau et rend le focus au bouton ; choisir une section ferme le panneau ; ce n'est pas une fenêtre modale, la page reste accessible ; le CV et le contact restent hors du menu. La démonstration de la page catalogue s'ouvre et se ferme sans script, mais ne gère pas la touche Échap : l'implémentation devra l'ajouter.
- **Jetons** : couleur-surface-relevee, couleur-surface, couleur-accent, couleur-texte, verre-bordure, ombre-flottante, flou-verre, arrondi-grand, plan-menu, marge-page, cible-tactile, espace-2, espace-4, duree-courte.

### CO-08 — Pied de page
- **Rôle** : clore chaque page avec les liens permanents : profils externes (dans le portfolio : GitHub et LinkedIn, MF-17), mentions légales (MF-19), signature.
- **Anatomie** : rangée haute (marque en police-titre, liens externes) ; rangée basse (étiquette de signature, lien des mentions légales) ; bouton de pause des animations, gardé tel quel dans le pied après la revue des maquettes (section 10, P-10) ; filet couleur-bordure au-dessus. La signature ne porte aucune année qui se périme (pas de « © » suivi de l'année en cours), conformément à l'exigence « aucune information qui se périme » (MF-18). Le bouton de pause a l'apparence d'un lien discret, avec une icône pause / lecture en trait (section 6, « Pause des animations » ; il fige la respiration des halos, MV-04).
- **Variantes** : une rangée par ligne sur téléphone, éléments répartis aux deux extrémités sur grand écran.
- **États** : liens au repos, au survol, au focus (CO-02, variante discrète) ; bouton de pause en deux libellés : « Mettre les animations en pause », puis, une fois pressé, « Relancer les animations » ; seul le libellé change, aucun état pressé n'est annoncé (section 6) ; bouton masqué quand le visiteur a demandé à réduire les animations ou quand le script de mouvement ne tourne pas.
- **Accessibilité** : liens externes annoncés (« nouvel onglet ») ; chaque lien atteint 44 px de haut ; le libellé texte du réseau est obligatoire, un logo n'est qu'un complément. Le bouton de pause est un vrai bouton, d'au moins 44 × 44 px, avec l'anneau-focus de la charte ; il répond au critère 2.2.2 (section 6) et son choix est mémorisé d'une page à l'autre. Son libellé dit l'action qu'il fera et c'est la seule chose qui change : aucun état pressé n'est annoncé, puisque le guide WAI-ARIA APG (page Button) déconseille de cumuler un libellé qui change et un état pressé.
- **Jetons** : couleur-bordure, couleur-texte, couleur-texte-secondaire, couleur-texte-discret, anneau-focus, police-titre, graisse-titre, taille-titre-4, marge-page, cible-tactile, espace-1, espace-3, espace-5, espace-6, espace-10.

### CO-09 — Frise chronologique
- **Rôle** : présenter des périodes datées dans l'ordre (dans le portfolio : le parcours, MF-07).
- **Anatomie** : fil (1 px, couleur-bordure) ; tracé lumineux (2 px, dégradé de couleur-accent vers couleur-accent-secondaire) du début jusqu'à l'étape mise en avant ; une étape par période : point de 13 px, période en chasse fixe (« MM/AAAA – MM/AAAA »), intitulé (taille-titre-4), détail facultatif.
- **Variantes** : adaptative (verticale sous 900 px, horizontale au-delà, une colonne par étape ; en horizontale, chaque étape s'aligne en haut de sa colonne, sans s'étirer sur la hauteur de la plus longue : périodes et intitulés restent alignés d'une étape à l'autre, quelle que soit la longueur du détail ; révision du 27/10/2026, déjà appliquée aux maquettes) ; verticale (toujours, pour une colonne étroite).
- **États d'étape** : accomplie (point plein couleur-texte-secondaire) ; mise en avant (point couleur-accent avec lueur-point, toujours allumé, même avant que le trait l'atteigne ; période en accent) ; prévue (point creux, intitulé couleur-texte-secondaire). Tracé (MV-02) : quand toute la frise est visible dans la fenêtre, il se trace d'un coup en duree-trace, courbe-entree-sortie, et chaque point s'allume au moment où le trait l'atteint réellement (décalage qui suit courbe-entree-sortie, pas une part linéaire de duree-trace) ; une fois tracé en entier, il reste tracé pendant toute la visite de la page, et au retour arrière il est posé d'emblée, sans tracé ; tant qu'il n'a pas été tracé en entier, il suit le défilement : il avance avec la progression de la frise dans la fenêtre et recule quand on remonte, et chaque point s'allume quand le trait l'atteint ; dans tous les cas, il s'arrête toujours à l'étape mise en avant. Seul le point s'allume : le texte des étapes garde toujours son plein contraste. Trait entier et points allumés si le mouvement est réduit ou sans script.
- **Accessibilité** : liste ordonnée ; chaque période est écrite en toutes lettres, avec un début et une fin, jamais au présent (MF-18) ; l'étape mise en avant l'annonce aussi par un texte masqué, pas seulement par la lumière ; aucune étape n'est grisée.
- **Jetons** : couleur-bordure, couleur-accent, couleur-accent-secondaire, couleur-texte-secondaire, couleur-texte-discret, couleur-fond, lueur-point, police-mono, police-titre, taille-code, taille-titre-4, taille-texte-petit, plan-contenu, espace-1, espace-6, espace-8, duree-moyenne, duree-trace, courbe-entree-sortie.

### CO-10 — Champ de formulaire
- **Rôle** : recueillir une saisie (dans le portfolio : les cinq champs du formulaire de contact, MF-16).
- **Anatomie** : libellé visible au-dessus (graisse-appuyee) et mention « (obligatoire) » quand tous les champs ne le sont pas ; zone de saisie (48 px de haut au moins, fond couleur-surface, bord couleur-texte-discret) ; aide facultative (couleur-texte-discret) ; message d'erreur sous le champ (icône et texte couleur-erreur).
- **Variantes** : texte sur une ligne ; e-mail (texte indicatif « Votre adresse e-mail », clavier adapté sur téléphone) ; zone de texte (144 px de haut au moins, extensible en hauteur).
- **États** : repos ; survol (bord couleur-texte-secondaire) ; focus (anneau-focus et bord couleur-focus) ; rempli ; champ manquant (bord et filet intérieur gauche couleur-erreur, message « Ce champ est obligatoire. ») ; e-mail invalide (même rendu, message « L'adresse e-mail n'est pas valide. ») ; désactivé pendant l'envoi (fond couleur-fond, bord pointillé, saisie conservée et lisible en couleur-texte-secondaire).
- **Accessibilité** : libellé lié au champ, jamais remplacé par le texte indicatif ; message d'erreur lié au champ et champ marqué invalide ; à l'envoi refusé, le focus va au premier champ à corriger et les autres champs gardent leur saisie (SC-2.0-24) ; le bord du champ atteint 3:1 au moins (section 8) ; l'information sur l'usage des données précède le bouton d'envoi (MF-20).
- **Jetons** : couleur-surface, couleur-fond, couleur-texte, couleur-texte-secondaire, couleur-texte-discret, couleur-bordure, couleur-erreur, couleur-focus, anneau-focus, police-texte, graisse-appuyee, graisse-moyenne, taille-texte, taille-texte-petit, arrondi-petit, espace-2, espace-3, espace-4, espace-5, duree-courte.

### CO-11 — Message d'état
- **Rôle** : dire ce qui se passe et ce qu'on peut faire (dans le portfolio : l'envoi du formulaire, le CV indisponible).
- **Anatomie** : icône (ou indicateur d'activité) ; titre (graisse-forte, couleur du rôle) ; texte (taille-texte-petit, couleur-texte-secondaire) ; action facultative (bouton secondaire « Réessayer ») ; fond couleur du rôle à opacite-teinte-message mêlée à couleur-surface, filet couleur du rôle à 40 %.
- **Variantes** : information (icône accent, fond couleur-surface) ; envoi en cours (indicateur d'activité, « Envoi en cours… », « L'envoi peut prendre jusqu'à 90 secondes. Votre saisie est conservée. » ; 90 secondes est l'attente maximale du front, comptée depuis le clic, valeur D-07 de la conception technique ; elle couvre le réveil du back endormi, qui prend lui-même environ une minute (CT-06) : ce sont deux grandeurs différentes, et le visiteur ne lit que la première, jusqu'à 90 secondes, seul libellé de l'attente ; révision du 27/10/2026) ; succès (« Message envoyé », champs vidés) ; échec réessayable (« L'envoi a échoué », saisie conservée, bouton « Réessayer ») ; attention (ressource indisponible, avec un lien vers une autre voie, par exemple le formulaire de contact).
- **États** : apparition à l'endroit de l'action (sous le bouton d'envoi) ; le message d'envoi en cours est remplacé par le succès ou l'échec ; pas de disparition automatique : le message reste jusqu'à la prochaine action.
- **Accessibilité** : icône, titre et texte à chaque fois, la couleur ne porte jamais seule l'information ; succès et envoi en cours annoncés poliment aux lecteurs d'écran, échec annoncé immédiatement ; pendant une attente longue, le texte suffit, avec ou sans animation.
- **Jetons** : couleur-surface, couleur-bordure, couleur-texte, couleur-texte-secondaire, couleur-accent, couleur-succes, couleur-erreur, couleur-attention, opacite-teinte-message, graisse-forte, taille-texte-petit, arrondi-moyen, espace-1, espace-3, espace-4, espace-5.

Le formulaire de contact assemble CO-10 et CO-11. Ses états sont tous montrés dans la page catalogue : repos, focus, champ manquant et e-mail invalide parmi les états de CO-10 ; puis, dans une composition dédiée, le formulaire complet au repos, l'envoi refusé (champ manquant et e-mail invalide), l'envoi en cours jusqu'à 90 secondes, l'attente maximale du front (champs désactivés, bouton et message d'attente), l'envoi réussi et l'envoi échoué réessayable.

### CO-12 — Fenêtre factice
- **Rôle** : mettre en scène une capture, un extrait de code ou une interface abstraite dans un cadre d'application.
- **Anatomie** : barre (trois points neutres de 9 px, puis un titre en chasse fixe ou une barre d'adresse factice) ; contenu (code, capture ou maquette abstraite) ; fond couleur-surface à 92 %, filet verre-bordure, ombre-fenetre, arrondi-grand.
- **Variantes** : code (extrait en chasse fixe, mots-clés en accent, chaînes en accent secondaire, commentaires en texte discret, retour à la ligne plutôt que défilement horizontal) ; navigateur (barre d'adresse factice, interface abstraite) ; capture (image au format 16:10).
- **États** : repos ; survol et focus si la fenêtre est un lien (soulevée de distance-soulevement, filet couleur-accent à 40 %, anneau-focus) ; en écriture (variante code : l'extrait s'écrit une fois à l'apparition, en moins de 5 s, environ 3 s dans le portfolio ; un extrait plus long s'affiche déjà écrit, MV-03) ; collante (à côté d'un récit en étapes, elle change d'illustration avec l'étape active, MV-08 ; sans script ou si le mouvement est réduit, elle n'est pas collante et chaque illustration s'affiche sous son étape) ; sans contenu, la fenêtre n'est pas affichée : jamais de cadre vide (SC-2.0-18).
- **Accessibilité** : une capture a un texte alternatif qui dit ce qu'elle montre ; un extrait de code reste du texte sélectionnable ; une fenêtre de code qui répète des informations déjà affichées est un décor, masqué aux lecteurs d'écran (dans le portfolio, « profil.ts » : le nom, l'intitulé et l'alternance qu'elle reprend sont tous affichés sur l'accueil, l'alternance en tête de la carte « Expérience », MV-03) ; si elle portait une information propre, elle devrait être lisible par les lecteurs d'écran (technique tranchée au plan front) ; les trois points et le curseur d'écriture sont décoratifs.
- **Jetons** : couleur-surface, couleur-texte, couleur-texte-secondaire, couleur-texte-discret, couleur-accent, couleur-accent-secondaire, verre-bordure, ombre-fenetre, anneau-focus, police-mono, taille-code, taille-etiquette, arrondi-grand, arrondi-pilule, espace-3, espace-4, espace-5, duree-moyenne, distance-soulevement, courbe-sortie, delai-caractere, duree-longue, duree-etape, delai-depart, delai-mot-titre.

### CO-13 — Arrière-plan d'ambiance
- **Rôle** : donner sa lumière à une section : halos, trame et voile.
- **Anatomie** : couche de fond derrière le contenu, sans interaction : trame-points, un ou deux halos, voile-bas ; le voile atteint couleur-fond pleine au bord bas de la section, où le halo secondaire est coupé : la section rejoint la suivante sans couture (révision du 27/10/2026, section 3.6).
- **Variantes** : accueil (halo-accent en haut à droite, halo-secondaire en bas à gauche, trame) ; section (halo-accent et trame) ; sobre (trame seule).
- **États** : respire (MV-04) : chaque halo varie lentement en opacité, de 55 % à 100 % de sa valeur, et en échelle, en duree-respiration ; figé par le bouton de pause (CO-08), fixe si le mouvement est réduit ou sans script ; jamais fixé à la fenêtre : les halos défilent avec leur section.
- **Accessibilité** : purement décoratif ; deux halos ne se superposent jamais à leur pic (coins opposés), car le texte discret sur du verre posé sur deux halos cumulés descendrait sous 4.5:1 (section 8) ; en respirant, un halo ne dépasse jamais sa valeur de charte, et deux halos d'une même section respirent en opposition de phase.
- **Jetons** : halo-accent, halo-secondaire, trame-points, pas-trame, voile-bas, opacite-halo-accent, opacite-halo-secondaire, opacite-trame, duree-respiration.

### CO-14 — Lien d'évitement
- **Rôle** : permettre au clavier d'aller directement au contenu principal, sans traverser l'en-tête.
- **Anatomie** : lien « Aller au contenu », aspect de bouton primaire.
- **Variantes** : une seule.
- **États** : masqué au repos (hors de l'écran) ; visible au focus, en haut à gauche, au-dessus de tout.
- **Accessibilité** : premier élément focalisable de chaque page ; cible de 44 px ; mène au contenu principal.
- **Jetons** : couleur-accent, couleur-texte-sur-accent, anneau-focus, graisse-appuyee, arrondi-petit, plan-evitement, cible-tactile, espace-4, espace-5.

### CO-15 — Indicateur d'activité
- **Rôle** : signaler une attente en cours.
- **Anatomie** : anneau de la couleur du texte environnant, dont un quart est plein et le reste à 28 %.
- **Variantes** : dans un texte (taille du texte) ; dans un bouton (couleur-texte-sur-accent) ; grand (32 px).
- **États** : en rotation (duree-rotation, en boucle, tant que l'attente dure) ; fixe si le mouvement est réduit.
- **Accessibilité** : toujours accompagné d'un texte qui dit ce qu'on attend ; l'indicateur lui-même est décoratif pour les lecteurs d'écran.
- **Jetons** : couleur-accent, couleur-texte-sur-accent, arrondi-cercle, duree-rotation.

### CO-16 — En-tête de section
- **Rôle** : ouvrir une section et en donner la promesse en une ligne.
- **Anatomie** : étiquette numérotée (CO-04) ; titre (taille-titre-1 ou taille-titre-2) ; chapô facultatif (taille-chapo).
- **Variantes** : aligné à gauche (cas courant) ; centré (fin de page, avec une action).
- **États** : statique ; entre en cascade (étiquette, titre, chapô, MV-01) ; à l'apparition, son filet — le trait de l'étiquette numérotée (CO-04) — s'étire depuis la gauche (MV-05).
- **Accessibilité** : le titre est un vrai titre de la hiérarchie de la page ; l'étiquette numérotée n'en fait pas partie.
- **Jetons** : police-titre, taille-titre-1, taille-titre-2, taille-chapo, couleur-texte, couleur-texte-secondaire, couleur-accent, espace-4, duree-apparition, distance-apparition, delai-cascade, duree-longue, courbe-sortie.

### CO-17 — Liste clé-valeur
- **Rôle** : présenter des faits courts, chacun annoncé par une étiquette (dans le portfolio, par exemple, les informations d'une fiche projet).
- **Anatomie** : paires clé (étiquette discrète) et valeur. Une valeur de date ou de période s'écrit en police-mono (chasse fixe), comme les dates de la frise (CO-09) ; les autres valeurs gardent la police de leur variante.
- **Variantes** : en ligne (valeurs en police-titre, taille-titre-4, côte à côte puis empilées sur téléphone) ; en tableau (clé à gauche, valeur à droite en texte courant, séparées par un filet).
- **États** : statique.
- **Accessibilité** : liste de définitions ; une valeur absente fait disparaître toute la paire, jamais de clé sans valeur.
- **Jetons** : police-mono, police-titre, police-texte, taille-etiquette, taille-titre-4, taille-texte, couleur-texte, couleur-texte-secondaire, couleur-texte-discret, couleur-bordure, espace-1, espace-3, espace-4, espace-6.

## 8. Accessibilité

La cible est le niveau AA de la WCAG 2.2, avec quelques exigences au-delà quand elles ne coûtent rien.

### Contrastes

- **Texte et couleurs pleines** : les tableaux de la section 2 donnent, pour chaque palette, dix-huit paires calculées ; toutes atteignent leur minimum (4.5:1 pour le texte, 3:1 pour l'accent employé comme forme et pour le focus). L'accent sert aussi de couleur de lien : il atteint 4.5:1 même sur couleur-surface-relevee.
- **Fonds composés** : les effets translucides modifient le fond réel. Les ratios ci-dessous portent sur la palette retenue, PA-02, avec les halos moyens (opacite-halo-accent 20 %, opacite-halo-secondaire 15 %) ; une autre palette refait ce calcul avant usage (section 9).
- **Méthode** : chaque fond est recomposé par script, couche par couche en sRGB (le fond de base indiqué dans la colonne « Fond composé » — couleur-fond, couleur-surface pour les pastilles, couleur-accent pour le survol du bouton primaire —, puis le halo à son pic, puis le verre en haut de son dégradé ou la teinte, chaque couche mêlée à son opacité et arrondie à 8 bits), et le ratio WCAG 2.x du premier plan sur ce fond est retenu au cas le plus défavorable.

| Premier plan | Fond composé | PA-02 | Minimum |
| --- | --- | --- | --- |
| couleur-accent | pastille accent : couleur-accent à 14 % sur couleur-surface | 7.57 | 4.5 |
| couleur-accent-secondaire | pastille secondaire : couleur-accent-secondaire à 14 % sur couleur-surface | 8.11 | 4.5 |
| couleur-succes | pastille succès : couleur-succes à 14 % sur couleur-surface | 8.06 | 4.5 |
| couleur-erreur | pastille erreur : couleur-erreur à 14 % sur couleur-surface | 5.66 | 4.5 |
| couleur-attention | pastille attention : couleur-attention à 14 % sur couleur-surface | 8.88 | 4.5 |
| couleur-texte-secondaire | pastille neutre : couleur-texte à 8 % sur couleur-surface | 7.66 | 4.5 |
| couleur-texte | pastille à contour : verre sur le pic du halo d'accent | 10.22 | 4.5 |
| couleur-texte-discret | verre sur le pic du halo d'accent | 4.61 | 4.5 |
| couleur-texte-discret | verre sur le pic du halo secondaire | 5.20 | 4.5 |
| couleur-texte-secondaire | texte de carte : verre sur le pic du halo d'accent | 5.75 | 4.5 |
| couleur-accent | lien dans une carte : verre sur le pic du halo d'accent | 6.16 | 4.5 |
| couleur-texte | lien courant du menu : couleur-accent à 16 % sur couleur-surface | 12.08 | 4.5 |
| couleur-texte-sur-accent | bouton primaire au survol : couleur-texte à 12 % dans couleur-accent | 9.82 | 4.5 |
| couleur-texte | bouton secondaire au survol : couleur-texte à 8 % sur le pic du halo d'accent | 9.72 | 4.5 |
| couleur-focus | anneau de focus sur le pic du halo d'accent | 10.42 | 3 |
| couleur-texte-discret | bord de champ sur couleur-surface | 7.48 | 3 |
| couleur-bordure | séparateur sur couleur-fond (décoratif) | 1.63 | aucun |

- **Configurations interdites** : du texte discret sur du verre posé sur les deux halos à leur pic tomberait à 3.42 ; d'où la règle de CO-13 : les deux halos se placent en coins opposés et ne se croisent qu'en lisière, là où leur intensité est faible. Une pastille teintée posée sur du verre tomberait à 3.60 (pastille erreur, verre au pic du halo d'accent) et 3.87 (verre au pic du halo secondaire), et à 4.22 posée directement au pic du halo d'accent ; d'où la variante à contour sur le verre et sur les halos (CO-03).
- **Le mouvement ne fait passer aucun texte sous son minimum** (révision du 17/10/2026, lueur de survol revue le 18/10/2026). Le tableau ci-dessus n'est pas recalculé : aucune couleur ne change, et son pire cas (4.61) reste celui de la charte. Trois règles le gardent vrai, recalculées à la même méthode :
  - Halos qui respirent (MV-04) : l'opacité d'un halo varie de 55 % à 100 % de sa valeur de charte, jamais au-delà ; le tableau, calculé au pic, reste donc le pire cas. Deux halos d'une même section ne cumulent pas leur pic : ils sont en coins opposés et, même agrandis à 1,08, ne se rencontrent qu'en lisière, là où leur intensité est presque nulle ; leur opposition de phase ajoute une marge, puisque l'un est à son creux quand l'autre est à son pic. Vérifié par script sur toute la surface d'une section d'accueil, les deux halos à l'échelle 1,08 : le pire cas reste 4.61 (texte discret sur le verre au pic du halo d'accent).
  - Lueur de survol (MV-06) : elle éclaire l'intérieur de la carte, sous son contenu, comme sur la démonstration retenue par Alexandre (section 10, P-11), mais à 20 % de couleur-accent au centre du disque (opacite-lueur-survol) et non à 22 %. Sur une carte en verre hors halo, le texte discret tient 7.18:1 sans lueur et 4.69:1 sous le centre de la lueur à 20 % ; à 22 %, il tomberait à 4.44:1 (le plafond qui garde 4.5:1 est 21 % ; 20 % laisse une marge). À 20 %, sur le même verre, le texte secondaire tient 5.85:1, l'accent 6.26:1 et couleur-texte 10.39:1 ; sur une carte pleine (couleur-surface), le texte discret tient 4.91:1. Règle : une carte interactive ne se pose jamais sur un halo. Au pic du halo d'accent, la lueur à 20 % ferait tomber le texte discret à 3.03:1 et le texte secondaire à 3.79:1 (au pic du halo secondaire, 3.44:1 et 4.30:1) ; dès 2 % d'un halo sous la carte, le texte discret n'atteint déjà plus 4.5:1 (4.48:1 sur un halo secondaire à 2 %) : la règle vaut pour toute l'étendue d'un halo, pas seulement pour son pic. Au clavier, la carte n'a pas de lueur.
  - Aucun texte n'est jamais grisé (MV-02, MV-08) : la frise allume ses points, le récit signale l'étape active par un filet d'accent et la progression. Un texte rendu translucide pour paraître « non atteint » ne tient pas 4.5:1 : à l'opacité 0,42, même couleur-texte tombe à 3.79:1 sur couleur-fond, et le texte discret à 2.29:1.
- **En-tête translucide (CO-06)**, révision du 27/10/2026, à la même méthode : le fond composé est couleur-fond à l'opacité de l'en-tête, posé sur ce qui défile dessous ; le flou n'est pas compté, car il ne change pas la teinte moyenne d'une zone unie. Le pire cas de la palette est un texte en couleur-texte qui passe sous l'en-tête. À partir de 900 px, à 72 %, le texte secondaire de la navigation tombait à 4.38:1 ; à 73 %, il tient 4.54:1 (couleur-texte, 8.05:1), et 73 % est la plus petite valeur entière qui garde 4.5:1. Sous 900 px, et sur un navigateur sans flou, l'en-tête à 92 % garde au moins 8.52:1. Ce calcul ne porte que sur les couleurs de la palette : une image très claire qui passerait sous l'en-tête, un blanc pur par exemple, ferait encore tomber le texte secondaire à 4.30:1 à 73 % ; il faudrait 74 % pour qu'elle tienne 4.51:1 (section 10, P-13).
- **Voile bas (CO-13)**, révision du 27/10/2026 : le voile atteint couleur-fond pleine au bord bas d'une section d'ambiance au lieu de 70 % ; il est posé sous le contenu et ne fait qu'assombrir les halos et la trame. Aucun texte clair n'y perd de contraste : au bas d'une section, le texte discret sur du verre posé au pic du halo secondaire passe de 6.55:1 à 7.18:1, et le voile est inchangé sur les neuf premiers dixièmes de la hauteur. Le tableau ci-dessus, calculé sans voile, reste le pire cas.
- **La couleur n'est jamais seule** : un lien dans un texte est souligné ; une erreur a une icône et un message ; une pastille a un mot ; l'étape mise en avant de la frise l'annonce par un texte masqué ; la page courante est signalée par un attribut.

### Focus toujours visible

- Tout élément focalisable au clavier affiche anneau-focus : 2 px de couleur-focus, décalé de 2 px. Le style de focus n'est jamais retiré sans être remplacé.
- L'anneau se pose sur le fond, à 2 px de l'élément : il garde au moins 12.76:1 sur le fond et sur les deux surfaces de PA-02 (15.26, 14.20 et 12.76), et 10.42:1 au pic d'un halo (tableau ci-dessus), même autour d'un bouton primaire dont l'accent est proche de couleur-focus (1.42:1 entre les deux).
- L'anneau entoure tout le périmètre de l'élément, sur 2 px, avec un contraste d'au moins 3:1 entre l'état focalisé et l'état non focalisé : c'est l'exigence du critère 2.4.13 (niveau AAA), tenue sans effort.
- Une carte interactive affiche l'anneau autour de la carte entière, pas seulement autour de son titre.

### Cibles tactiles

- Toute cible interactive mesure au moins 44 × 44 px (cible-tactile), au-delà du minimum AA de 24 × 24 px.
- Exception : les liens à l'intérieur d'une phrase, prévue par le critère 2.5.8.
- Deux cibles voisines sont séparées d'au moins 8 px (espace-2).

### Mouvement réduit

La préférence du visiteur est respectée telle que décrite en section 6 (« Réduction des animations ») : aucune translation, aucune cascade, aucun tracé, aucune respiration, aucune transition entre pages, indicateur d'activité fixe ; le récit au défilement perd sa fenêtre collante, chaque illustration sous son étape (MV-08) ; chaque motif MV-01 à MV-10 dit ce qu'il devient à sa puce « Sans animation ». Sans cette préférence, la respiration des halos, qui démarre seule et dure plus de 5 s, se met en pause par le bouton du pied de page (CO-08), comme le demande le critère 2.2.2 (section 6, « Pause des animations »). Aucune information ne passe seulement par le mouvement.

### Taille de texte minimale

- Texte courant : 16 px au moins (taille-texte), interligne 1.6.
- Aucun texte utile sous 14 px, sauf les étiquettes et pastilles en capitales, en chasse fixe et espacées, à 12 px.
- Toutes les tailles suivent le réglage de taille de texte du navigateur ; un zoom à 200 % ne fait rien disparaître et n'entraîne pas de défilement horizontal (section 5).

### Structure et formulaires

- Langue de la page déclarée ; régions d'en-tête, de navigation, de contenu principal et de pied ; un seul titre de niveau 1 par page ; l'ordre de lecture suit l'ordre visuel.
- Lien d'évitement en premier élément focalisable (CO-14).
- Formulaires : libellés visibles et liés, erreurs liées au champ, focus sur le premier champ à corriger, messages d'état annoncés, saisie conservée en cas d'erreur ou d'échec (CO-10, CO-11).
- Liens externes annoncés comme tels (CO-02).

## 9. Réutilisation dans d'autres applications

### Ce qui est générique

- **Les quatorze rôles de couleur** et leur contrat : toute application qui reprend le système remplit les mêmes rôles, et chaque palette se valide par les mêmes dix-huit paires de contraste (section 2) et les mêmes fonds composés (section 8).
- **Tous les autres jetons** : typographie, espacements, arrondis, bordures, effets (lueur de survol comprise), ombres, durées, délais, distances et courbes, plans, mise en page.
- **Les dix-sept composants** CO-01 à CO-17 : rôle, anatomie, variantes, états, accessibilité. Aucun ne porte de contenu ni de nom propre au portfolio.
- **Les dix motifs de mouvement** MV-01 à MV-10 (MV-09 écarté) : chacun est décrit par composant, avec ses jetons et ses replis sans animation et sans script.
- **Les règles** : mouvement, réduction et pause des animations, contenu visible sans script, budget de performance, focus, cibles tactiles, couleur jamais seule.

### Ce qui est propre au portfolio

- La palette PA-02 Lagune (point P-01).
- Les textes, les dates et les images, fournis par Alexandre.
- Les usages : quelles actions sont permanentes dans l'en-tête (le CV et le contact), quelles sections figurent dans la navigation, ce que raconte la frise (le parcours), les cinq champs du formulaire de contact, la composition de la page d'accueil.
- La marque : le nom, le monogramme.
- Ce que le mouvement met en scène : le contenu de la fenêtre de code « profil.ts » de l'accueil (MV-03), un décor qui ne fait que répéter le nom, l'intitulé et l'alternance, affichés sur l'accueil (l'alternance en tête de la carte « Expérience ») ; les illustrations de la page Méthode (MV-08), le nom et l'intitulé révélés sur l'accueil (MV-10).

### Comment réutiliser la charte

1. **Choisir une palette** existante, ou en créer une : quatorze valeurs, puis le recalcul des dix-huit paires et des fonds composés avec la même méthode (WCAG 2.x, script, deux décimales). Une palette qui échoue à une paire est corrigée avant usage.
2. **Reprendre les autres jetons tels quels.** Une application peut en ajouter ; elle n'en renomme ni n'en détourne aucun.
3. **Composer les écrans avec les composants existants**, sans modifier leur anatomie. Un besoin nouveau donne un composant nouveau, numéroté à la suite (CO-18 et suivants), nommé par son rôle et documenté avec les mêmes six rubriques.
4. **N'utiliser dans un composant que des jetons**, jamais une valeur brute : c'est ce qui permet de changer de palette sans retoucher les composants.
5. **Versionner la charte** : tout changement de jeton ou de composant donne une nouvelle version de ce document, avec la liste de ce qui a changé ; les applications choisissent quand elles suivent.
6. **Le format d'implémentation se décide au scaffold** de chaque application (variables de feuille de style, fichier de données, bibliothèque de composants…). La page catalogue n'est qu'une démonstration ; elle n'impose aucun format.

Le système est en thème sombre uniquement (décision du 15/10/2026). Rien dans les noms ne l'interdit pour l'avenir : un thème clair serait une nouvelle série de quatorze valeurs, recalculée selon la même méthode.

## 10. Points à valider par Alexandre

- P-01 — Choix de la palette parmi PA-01 Laiton, PA-02 Lagune et PA-03 Framboise. Recommandation : PA-01 Laiton, la plus éloignée de la référence et la plus singulière, sobre pour un public de recrutement ; PA-02 en second choix pour une ambiance froide (section 2). Sur l'action principale, les deux se valent : l'accent sur le fond est plus contrasté dans PA-02 (10.74:1 contre 10.07:1), le texte posé sur l'accent l'est à peine plus dans PA-01 (9.41:1 contre 9.32:1). La page catalogue permet de comparer les trois sur tous les composants. Réponse d'Alexandre du 16/10/2026 : PA-02 Lagune est retenue ; PA-01 et PA-03 sont écartées et restent documentées en section 2.
- P-02 — Choix des trois familles de polices. Recommandation : Bricolage Grotesque pour les titres, Hanken Grotesk pour le texte, JetBrains Mono pour la chasse fixe, toutes sous SIL Open Font License 1.1 ; si les titres paraissent trop expressifs, l'alternative Sora, Source Sans 3 et IBM Plex Mono est plus classique (section 4). Réponse d'Alexandre du 16/10/2026 : Bricolage Grotesque, Hanken Grotesk et JetBrains Mono sont retenues ; l'alternative est écartée.
- P-03 — Largeurs d'écran couvertes : de 320 à 2560 px, points de rupture à 600, 900, 1200 et 1600 px. Recommandation : valider tel quel ; cela couvre les téléphones courants en portrait et les grands écrans de bureau, ainsi que le zoom à 200 %. Réponse d'Alexandre du 16/10/2026 : validé.
- P-04 — Flou de verre réservé à l'en-tête collant et au menu ouvert, à partir de 900 px, cartes en verre sans flou. Recommandation : valider ; c'est le compromis qui garde l'effet visible là où il sert, sans peser sur le score de performance mobile visé (au moins 90). Réponse d'Alexandre du 16/10/2026 : validé.
- P-05 — Cibles tactiles de 44 × 44 px, au-delà du minimum AA de 24 × 24 px. Recommandation : valider ; la cible est le téléphone d'un recruteur, le coût en place est faible. Réponse d'Alexandre du 16/10/2026 : validé.
- P-06 — Liens externes ouverts dans un nouvel onglet, annoncés par une flèche oblique et un texte masqué. Recommandation : valider ; c'est la manière accessible de tenir la règle « le site reste ouvert dans la fenêtre d'origine » (MF-17). Réponse d'Alexandre du 16/10/2026 : validé.
- P-07 — Monogramme à la place du nom dans l'en-tête sous 480 px de large. Le parcours d'écrans place le nom dans l'en-tête (EC-00) : sous 480 px, le monogramme le remplace à l'écran, le nom reste annoncé aux lecteurs d'écran et s'affiche en grand sur l'accueil. Recommandation : valider ; sans monogramme, le nom, le CV, le contact et le bouton de menu ne tiennent pas ensemble sur un téléphone de 320 px. Réponse d'Alexandre du 16/10/2026 : validé, avec le monogramme « AM » sous 480 px (CO-06).
- P-08 — Nom du design system pour ses réutilisations futures. Recommandation : ne pas le nommer maintenant ; le nommer à la première réutilisation dans une autre application, quand son périmètre réel sera connu. Réponse d'Alexandre du 16/10/2026 : validé, le nom se décidera plus tard.
- P-09 — Image d'aperçu affichée quand un lien du site est partagé, que la conception technique attend de la charte. Recommandation : la produire avec les maquettes des écrans, sur la palette retenue au point P-01 ; elle reprend l'en-tête d'accueil (affiche, étiquette, halos), sans texte au-dessous de 24 px. Réponse d'Alexandre du 16/10/2026 : validé, l'image se fera avec les maquettes des écrans, sur PA-02.

Points de la révision du 17/10/2026 sur le mouvement, jugés sur la page de revue des maquettes :

- P-10 — Place du bouton de pause des animations : dans le pied de page de chaque page (CO-08), choix d'Alexandre du 17/10/2026. Recommandation : le garder dans le pied de page, avec l'apparence d'un lien discret ; il y reste trouvable sans concurrencer le CV et le contact, et le critère 2.2.2 demande un moyen de pause, pas un bouton en tête de page. Réponse d'Alexandre du 17/10/2026 : le bouton est gardé tel quel, dans le pied de page.
- P-11 — Place et intensité de la lueur de survol (MV-06, section 8). Recommandation, revue le 18/10/2026 : la lueur à l'intérieur de la carte, sous son contenu, à 20 % de couleur-accent et non à 22 %, et jamais de carte interactive sur un halo ; sur une carte en verre hors halo, le texte discret tient 4.69:1 à 20 % (4.44:1 à 22 %) ; au pic du halo d'accent, il tomberait à 3.03:1. Réponse d'Alexandre du 17/10/2026 : remplacée par celle du 18/10/2026. Réponse d'Alexandre du 18/10/2026 : la lueur suit le pointeur à l'intérieur de la carte, comme sur la démonstration, à 20 %.
- P-12 — Repli du titre révélé (MV-10) : si la mesure Lighthouse du lot des écrans dépasse le seuil, le titre part sans délai. Recommandation : accepter ce repli dès maintenant, pour que le lot des écrans n'ait pas à revenir vers Alexandre ; l'intitulé, la présentation et les boutons gardent leur cascade. Réponse d'Alexandre du 17/10/2026 : le repli est accepté d'avance ; il ne s'appliquera que si la mesure l'exige.

Points de la révision du 27/10/2026 sur les points laissés par les maquettes. Les autres changements de cette révision ne changent pas ce que voit le visiteur, ou reprennent ce que les maquettes approuvées montrent déjà : cible de 44 px du monogramme (CO-06), alignement des intitulés de la frise (CO-09), libellé unique de l'attente (CO-11), rôle d'appoint de l'ombre de la carte soulevée (CO-05), phrase sur les maquettes (section 1), politique de sécurité du contenu (section 6), jetons de lueur ajoutés au catalogue.

- P-13 — Opacité de l'en-tête translucide, à partir de 900 px (CO-06, section 8) : 73 % au lieu de 72 %. Le flou non compté, le texte secondaire de la navigation tombait à 4.38:1 quand un texte en couleur-texte passe sous l'en-tête ; à 73 %, il tient 4.54:1, et 73 % est la plus petite valeur entière qui garde 4.5:1. L'écart d'un point d'opacité ne se voit pas ; sous 900 px et sans flou, l'en-tête reste à 92 %. Les maquettes approuvées gardent 72 % : le site reprendra la valeur de la charte. Recommandation : valider 73 %. Variante : 74 %, tout aussi invisible, si l'on veut qu'une image blanche passant sous l'en-tête (une capture de projet, par exemple) garde elle aussi 4.5:1 (4.51:1 à 74 %, 4.30:1 à 73 %).
- P-14 — Voile bas des sections d'ambiance (section 3.6, CO-13) : il atteint couleur-fond pleine au bord bas au lieu de 70 %, pour effacer la couture où le halo secondaire est coupé par ce bord. Le voile est inchangé sur les neuf premiers dixièmes de la section ; sur le dernier dixième, il passe de 50 % à 100 % au lieu de 50 % à 70 % : le bas du halo secondaire s'éteint un peu plus tôt, en coin bas gauche, et la section se fond dans la suivante sans ligne visible. L'intensité des halos ne change pas et aucun contraste ne baisse (section 8). Les maquettes approuvées gardent l'ancien voile : le site reprendra celui de la charte. Recommandation : valider.

## 11. Sources

- WCAG 2.2, recommandation du W3C (luminance relative, ratio de contraste, critères 1.4.3, 1.4.11, 2.2.2, 2.3.3, 2.4.7) — https://www.w3.org/TR/WCAG22/ — consulté le 16/10/2026, et le 17/10/2026 pour les niveaux des critères 2.2.2 et 2.3.3
- Understanding SC 1.4.3, Contrast (Minimum) — https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html — consulté le 16/10/2026
- Understanding SC 1.4.11, Non-text Contrast — https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html — consulté le 16/10/2026
- Understanding SC 2.4.13, Focus Appearance — https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html — consulté le 16/10/2026
- Understanding SC 2.5.8, Target Size (Minimum) — https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html — consulté le 16/10/2026
- Understanding SC 2.2.2, Pause, Stop, Hide — https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html — consulté le 17/10/2026
- Understanding SC 2.3.3, Animation from Interactions — https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html — consulté le 17/10/2026
- WAI-ARIA Authoring Practices Guide (APG), Button Pattern (bouton à bascule : un libellé qui change rend l'état pressé inutile) — https://www.w3.org/WAI/ARIA/apg/patterns/button/ — consulté le 17/10/2026
- MDN, prefers-reduced-motion — https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion — consulté le 16/10/2026 ; consulté le 17/10/2026
- MDN, View Transition API — https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API — consulté le 17/10/2026
- MDN, @view-transition (transitions entre documents de même origine, disponibilité limitée) — https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@view-transition — consulté le 17/10/2026
- web.dev, How to create high-performance CSS animations — https://web.dev/articles/animations-guide — consulté le 16/10/2026 ; consulté le 17/10/2026
- web.dev, Cumulative Layout Shift (CLS) — https://web.dev/articles/cls — consulté le 17/10/2026
- SIL Open Font License — https://openfontlicense.org/ — consulté le 16/10/2026
- Bricolage Grotesque, texte de licence (OFL 1.1) — https://raw.githubusercontent.com/google/fonts/main/ofl/bricolagegrotesque/OFL.txt — consulté le 16/10/2026
- Bricolage Grotesque, métadonnées (licence, axes de taille optique, de largeur et de graisse) — https://raw.githubusercontent.com/google/fonts/main/ofl/bricolagegrotesque/METADATA.pb — consulté le 16/10/2026
- Hanken Grotesk, texte de licence (OFL 1.1) — https://raw.githubusercontent.com/google/fonts/main/ofl/hankengrotesk/OFL.txt — consulté le 16/10/2026
- Hanken Grotesk, métadonnées (licence, graisses 100 à 900) — https://raw.githubusercontent.com/google/fonts/main/ofl/hankengrotesk/METADATA.pb — consulté le 16/10/2026
- JetBrains Mono, texte de licence (OFL 1.1) — https://raw.githubusercontent.com/google/fonts/main/ofl/jetbrainsmono/OFL.txt — consulté le 16/10/2026
- JetBrains Mono, métadonnées (licence, graisses 100 à 800) — https://raw.githubusercontent.com/google/fonts/main/ofl/jetbrainsmono/METADATA.pb — consulté le 16/10/2026
- Sora, texte de licence (OFL 1.1) — https://raw.githubusercontent.com/google/fonts/main/ofl/sora/OFL.txt — consulté le 16/10/2026
- Sora, métadonnées (licence OFL, graisses 100 à 800) — https://raw.githubusercontent.com/google/fonts/main/ofl/sora/METADATA.pb — consulté le 16/10/2026
- Source Sans 3, texte de licence (OFL 1.1) — https://raw.githubusercontent.com/google/fonts/main/ofl/sourcesans3/OFL.txt — consulté le 16/10/2026
- Source Sans 3, métadonnées (licence OFL, graisses 200 à 900) — https://raw.githubusercontent.com/google/fonts/main/ofl/sourcesans3/METADATA.pb — consulté le 16/10/2026
- IBM Plex Mono, texte de licence (OFL 1.1) — https://raw.githubusercontent.com/google/fonts/main/ofl/ibmplexmono/OFL.txt — consulté le 16/10/2026
- IBM Plex Mono, métadonnées (licence OFL, graisses 100 à 700) — https://raw.githubusercontent.com/google/fonts/main/ofl/ibmplexmono/METADATA.pb — consulté le 16/10/2026
