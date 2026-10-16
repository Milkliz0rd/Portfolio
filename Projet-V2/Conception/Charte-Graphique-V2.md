# Charte graphique — design system
Statut : [x] à approuver  [ ] approuvé par : ______
Base : US-2.0 et SC-2.0, approuvés par Alexandre Morozoff le 15/10/26 ; décisions d'Alexandre du 15/10/2026 sur la charte.

## 1. Principes

Ce document définit le design system né de la refonte du portfolio : ses jetons, ses composants et leurs règles. Il sert le portfolio et, au-delà, les futures applications personnelles d'Alexandre. Sa page catalogue, `Maquettes/design-system.html`, montre chaque jeton et chaque composant dans les trois palettes proposées ; elle s'ouvre dans un navigateur, sans installation, et permet de passer d'une palette à l'autre.

Les maquettes des écrans ne sont pas ici : elles viendront ensuite, sur la palette qu'Alexandre aura retenue.

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
4. **Entrer, pas danser.** Le mouvement accompagne une apparition ou un changement d'état, une fois ; rien ne bouge en boucle, sauf l'indicateur d'activité pendant une attente.
5. **Rapide par construction.** Les effets sont des dégradés peints une fois ; on n'anime que l'opacité et la position ; le flou est réservé à deux éléments (section 6).
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

### PA-01 — Laiton
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
Une encre vert-de-gris traversée d'un aqua lumineux, avec une pêche douce en contrepoint : la palette la plus calme et la plus « technique » des trois.

Jetons :
| Jeton | Valeur |
| --- | --- |
| couleur-fond | #070C0C |
| couleur-surface | #0F1616 |
| couleur-surface-relevee | #172121 |
| couleur-bordure | #2A3939 |
| couleur-texte | #EEF5F5 |
| couleur-texte-secondaire | #A9BDBE |
| couleur-texte-discret | #8A9EA0 |
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
| couleur-texte-discret | couleur-fond | 7.01 | 4.5 |
| couleur-texte-secondaire | couleur-surface-relevee | 8.39 | 4.5 |
| couleur-texte-discret | couleur-surface-relevee | 5.86 | 4.5 |
| couleur-accent | couleur-surface-relevee | 8.98 | 4.5 |
| couleur-accent-secondaire | couleur-fond | 11.58 | 4.5 |
| couleur-attention | couleur-fond | 13.04 | 4.5 |
| couleur-erreur | couleur-surface | 6.89 | 4.5 |
| couleur-succes | couleur-surface | 10.84 | 4.5 |
| couleur-focus | couleur-surface | 14.20 | 3 |
| couleur-texte-sur-accent | couleur-accent-secondaire | 10.04 | 4.5 |

Vigilance : l'aqua est une teinte fréquente sur les sites techniques, la palette distingue donc moins que les deux autres. couleur-focus et couleur-attention sont deux jaunes voisins, sans risque de confusion : l'un est un contour, l'autre un message avec icône.

### PA-03 — Framboise
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

Recommandation : PA-01 — Laiton. C'est la palette la plus éloignée de la page de référence (aucune teinte bleue, verte ou violette dominante) et la plus singulière face aux portfolios de développeurs, souvent bleus ou violets ; elle reste sobre, le laiton se lit « soigné » plutôt que « démonstratif », ce qui sert un public de recruteurs et de responsables techniques. Elle offre aussi les contrastes les plus confortables pour l'action principale (10.07:1 pour l'accent sur le fond, 9.41:1 pour le texte d'un bouton). Son seul point faible, la proximité de l'accent et de la couleur d'attention, est sans conséquence ici : le site n'affiche presque jamais de message d'attention, et aucun état ne repose sur la couleur seule. PA-02 est le meilleur second choix si Alexandre préfère une ambiance froide.

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
| séparateur (règle) | bordure-epaisseur en couleur-bordure | séparateurs décoratifs |
| bord de champ (règle) | bordure-epaisseur en couleur-texte-discret | contour des champs : au moins 3:1, il identifie le contrôle |
| focus-epaisseur | 2 px | épaisseur de l'anneau de focus |
| focus-decalage | 2 px | écart entre l'élément et l'anneau |
| anneau-focus | focus-epaisseur, trait plein, couleur-focus | tout élément focalisable au clavier |
| cible-tactile | 44 px | hauteur et largeur minimales de toute cible |

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
| opacite-halo-accent | 12 % | intensité maximale du halo principal |
| halo-accent | dégradé radial de couleur-accent à opacite-halo-accent vers transparent (à 70 % du rayon), ellipse de 60 % × 55 % de la section, centrée en haut à droite | lumière principale d'une section |
| opacite-halo-secondaire | 10 % | intensité maximale du halo secondaire |
| halo-secondaire | dégradé radial de couleur-accent-secondaire à opacite-halo-secondaire vers transparent, ellipse de 50 % × 50 %, centrée en bas à gauche | contrepoint, en coin opposé |
| opacite-trame | 7 % | intensité des points |
| pas-trame | 28 px | écart entre deux points |
| trame-points | points de 1 px de couleur-texte à opacite-trame, tous les pas-trame | texture de fond |
| voile-bas | dégradé vertical, transparent jusqu'à 65 % puis couleur-fond à 70 % | fondu du bas d'une section d'ambiance |
| opacite-teinte | 14 % | fond des pastilles colorées (couleur du rôle à 14 %) |
| opacite-teinte-message | 10 % | fond des messages d'état (couleur du rôle à 10 % mêlée à couleur-surface) |
| lueur-point | anneau de 6 px de couleur-accent à opacite-teinte, puis halo de 24 px de couleur-accent à 50 % | point lumineux : étape de frise mise en avant |

### 3.7 Ombres

Sur un fond aussi sombre, l'élévation vient d'abord du ton des surfaces et du filet clair ; l'ombre ne se voit que sur un halo, là où se posent les fenêtres.

| Jeton | Valeur | Usage |
| --- | --- | --- |
| ombre-fenetre | ombre portée de 30 px vers le bas, flou de 60 px, resserrée de 30 px, en couleur-fond à 90 % ; plus un liseré intérieur d'un pixel en haut, couleur-texte à 6 % | fenêtres factices |
| ombre-flottante | ombre portée de 18 px vers le bas, flou de 40 px, resserrée de 16 px, en couleur-fond à 90 % | menu ouvert |

### 3.8 Durées et courbes

| Jeton | Valeur | Usage |
| --- | --- | --- |
| duree-instant | 100 ms | appui sur un bouton |
| duree-courte | 180 ms | survol, changement de couleur, ouverture du menu |
| duree-moyenne | 320 ms | soulèvement d'une carte ou d'une fenêtre au survol |
| duree-longue | 600 ms | apparition d'un élément |
| duree-trace | 1200 ms | tracé de la frise, une fois |
| duree-rotation | 900 ms | un tour de l'indicateur d'activité (courbe linéaire) |
| delai-cascade | 70 ms | décalage entre deux éléments d'une cascade |
| distance-apparition | 12 px | translation verticale d'une apparition |
| courbe-standard | cubic-bezier(0.2, 0, 0, 1) | changements d'état : survol, appui |
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

| Rôle | Famille | Licence | Graisses retenues | Pourquoi |
| --- | --- | --- | --- | --- |
| Titres (police-titre) | Bricolage Grotesque | SIL Open Font License 1.1 | 700 et 800 | grotesque à axe de taille optique : sobre en petite taille, expressive en très grande ; elle donne au titre d'affiche serré son caractère sans tomber dans la fantaisie |
| Texte (police-texte) | Hanken Grotesk | SIL Open Font License 1.1 | 400, 500, 600 et 700 | grotesque neutre et ouverte, confortable en texte long, accents et ligatures du français complets |
| Chasse fixe (police-mono) | JetBrains Mono | SIL Open Font License 1.1 | 400 et 500 | dessinée pour le code, très lisible en petite taille et en capitales espacées ; ligatures désactivées dans les extraits de code pour montrer les caractères tels qu'ils sont tapés |

La licence SIL Open Font License 1.1 permet l'usage, l'intégration dans un site ou une application, la modification et la redistribution, gratuitement ; les trois familles couvrent le latin étendu. Le mode de chargement des polices (hébergées avec le site ou chez un service tiers) relève de la conception technique : la page catalogue les charge depuis le service de polices de Google pour l'aperçu seulement. Chaque famille a un repli système (section 3.2) : si la police manque, la page reste lisible.

Alternative plus classique, si Alexandre préfère moins de caractère dans les titres (point P-02) : Sora pour les titres, Source Sans 3 pour le texte, IBM Plex Mono pour la chasse fixe, toutes trois sous SIL Open Font License 1.1.

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

Les durées et les courbes sont des jetons (section 3.8). Cette section fixe quand et comment on s'en sert.

### Durées et courbes, par usage

- **Changement d'état** (survol, appui, focus) : duree-courte et courbe-standard pour les couleurs ; duree-instant pour l'enfoncement d'un bouton (1 px, échelle 0.98).
- **Soulèvement** d'une carte ou d'une fenêtre interactive au survol : 3 px vers le haut, duree-moyenne, courbe-sortie.
- **Apparition** : duree-longue, courbe-sortie, opacité de 0 à 1 et montée de distance-apparition.
- **Tracé de la frise** : duree-trace, courbe-entree-sortie, après 300 ms, du premier point jusqu'à l'étape mise en avant.
- **Indicateur d'activité** : un tour en duree-rotation, courbe linéaire, en boucle tant que l'attente dure.

### Apparitions en cascade

- Les éléments d'un groupe apparaissent dans l'ordre de lecture, séparés de delai-cascade : le premier part à 120 ms, le sixième à 470 ms, le dernier est en place vers 1.1 s.
- Six éléments au plus par cascade ; au-delà, les suivants apparaissent avec le sixième.
- Une seule fois : au chargement pour ce qui est visible d'emblée, à la première entrée dans la fenêtre pour le reste. Jamais au retour en arrière, jamais en boucle.
- Le contenu est visible par défaut : l'animation n'existe que si elle peut jouer. Si elle ne joue pas (préférence du visiteur, script absent, navigateur ancien), le contenu est simplement là.

### Réduction des animations

Quand le visiteur a demandé à son système de réduire les animations :

- aucune translation, aucune cascade, aucun tracé, aucun soulèvement : chaque élément s'affiche directement dans son état final ;
- les changements de couleur deviennent instantanés ; le défilement doux vers une ancre est coupé ;
- l'indicateur d'activité devient un anneau fixe ; le texte « Envoi en cours… » porte l'information.

Rien d'essentiel ne dépend d'une animation : aucune information n'apparaît seulement par le mouvement, aucune action n'attend la fin d'une animation.

### Budget de mouvement, pour un site rapide

La conception technique vise un score de performance mobile d'au moins 90. Le mouvement et les effets s'y plient :

- On n'anime que l'opacité et la transformation (position, échelle), que le navigateur traite sans recalculer la page.
- Aucun flou animé, aucune ombre animée sur une grande surface, aucun halo animé : halos, trame et voile sont des dégradés peints une fois.
- Le flou d'arrière-plan (flou-verre) est réservé à deux éléments, l'en-tête collant et le menu ouvert, et seulement à partir de 900 px. En dessous, l'en-tête est opaque à 92 % et le menu entièrement opaque. Les cartes en verre n'ont pas de flou : posées sur des dégradés lisses, elles n'y gagneraient presque rien et le flou coûterait à chaque défilement.
- Les halos défilent avec leur section : jamais d'arrière-plan fixé à la fenêtre.
- Pas d'effet piloté par le défilement (parallaxe), pas de vidéo, rien en boucle hors attente.
- Au plus une cascade par écran et un tracé de frise par page.

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
- **États** : repos ; survol (soulignement plein de 2 px, ou texte couleur-texte pour le discret et la navigation, flèche décalée de 3 px pour le lien d'action) ; focus (anneau-focus) ; page courante (navigation : texte couleur-texte et trait d'accent) ; visité (identique au repos : le site est court, l'information n'aide pas).
- **Accessibilité** : dans un texte, le lien est toujours souligné, la couleur ne suffit pas ; la page courante est signalée par un attribut, pas seulement par le trait ; un lien externe s'ouvre dans un nouvel onglet (le site reste ouvert, MF-17) et l'annonce par l'icône et le texte masqué.
- **Jetons** : couleur-accent, couleur-texte, couleur-texte-secondaire, anneau-focus, graisse-moyenne, graisse-appuyee, arrondi-petit, espace-2, espace-3, cible-tactile, duree-courte, courbe-standard, courbe-sortie.

### CO-03 — Pastille
- **Rôle** : qualifier un élément par un état ou une catégorie, en un ou deux mots.
- **Anatomie** : forme en pilule ; point de 6 px de la couleur du texte ; mot en police-mono, graisse-moyenne, taille-etiquette, capitales, approche-pastille.
- **Variantes** : neutre (couleur-texte-secondaire sur couleur-texte à 8 %) ; accent, secondaire, succès, attention, erreur (couleur du rôle sur la même couleur à opacite-teinte) ; à point lumineux (le point rayonne) ; à contour (sans fond, filet verre-bordure, pour une catégorie posée sur du verre).
- **États** : statique, sans survol ni focus. Une pastille cliquable deviendrait un bouton ou un lien.
- **Accessibilité** : le mot porte le sens, le point le souligne ; jamais de pastille muette. Contraste du texte sur sa teinte : 5.35:1 au moins (section 8).
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
- **Anatomie** : conteneur arrondi-grand ; étiquette facultative ; titre (taille-titre-3) ; texte (couleur-texte-secondaire) ; pied facultatif (pastilles, lien d'action).
- **Variantes** : verre (verre-fond, filet verre-bordure, sur un fond d'ambiance) ; pleine (couleur-surface, filet couleur-bordure, sur un fond uni) ; interactive (toute la carte est cliquable, par un seul lien porté par le titre).
- **États** : repos ; survol (interactive : soulevée de 3 px, filet couleur-accent à 45 %) ; focus (interactive : anneau-focus autour de toute la carte) ; sans contenu facultatif (pied ou étiquette absents : la carte se resserre, aucune zone vide).
- **Accessibilité** : un seul lien par carte interactive, dont le texte est le titre ; le lien d'action visible du pied est décoratif, pour ne pas annoncer deux fois la même destination ; l'ordre de lecture suit l'ordre visuel.
- **Jetons** : verre-fond, verre-bordure, couleur-surface, couleur-bordure, couleur-texte-secondaire, couleur-accent, anneau-focus, arrondi-grand, espace-2, espace-3, espace-6, duree-moyenne, duree-courte, courbe-sortie, courbe-standard.

### CO-06 — En-tête et navigation
- **Rôle** : identifier le site et donner accès, sur chaque page, aux sections et aux actions permanentes (dans le portfolio : le CV et le contact, MF-02).
- **Anatomie** : marque (monogramme et nom, lien vers l'accueil) ; navigation (liste de liens de navigation, CO-02) ; actions permanentes (un bouton secondaire compact, un bouton primaire compact) ; bouton du menu replié (CO-07) en version compacte.
- **Variantes** : complète (à partir de 1200 px : marque, navigation, actions) ; compacte (sous 1200 px : marque, actions, bouton de menu ; sous 480 px, la marque se réduit au monogramme).
- **États** : collé en haut de page pendant le défilement ; lien de section au repos, au survol, au focus, et section courante (trait d'accent) ; à partir de 900 px, fond couleur-fond à 72 % avec flou-verre ; en dessous, fond couleur-fond à 92 % sans flou.
- **Accessibilité** : région de navigation nommée ; section courante signalée par un attribut ; les actions permanentes ne sont jamais dans le menu replié ; le lien d'évitement (CO-14) le précède ; hauteur constante (hauteur-entete) pour que les ancres ne passent pas dessous.
- **Jetons** : couleur-fond, couleur-texte, couleur-surface-relevee, verre-bordure, flou-verre, police-titre, graisse-titre, approche-sous-titre, hauteur-entete, marge-page, plan-entete, arrondi-petit, arrondi-moyen, espace-1, espace-2, espace-3.

### CO-07 — Menu replié
- **Rôle** : donner accès aux sections quand la largeur ne permet pas la navigation complète.
- **Anatomie** : bouton icône seule (trois traits, croix une fois ouvert), libellé masqué « Menu » ; panneau flottant (couleur-surface-relevee, filet verre-bordure, ombre-flottante, arrondi-grand) ; liste verticale de liens de navigation de 44 px de haut.
- **Variantes** : panneau pleine largeur moins les marges sur téléphone ; panneau de 320 px aligné à droite à partir de 600 px.
- **États** : fermé ; ouvert (icône croix) ; bouton au survol et au focus ; lien au survol (fond couleur-texte à 6 %), au focus, et section courante (fond couleur-accent à 16 % sur couleur-surface, barre d'accent de 3 px à gauche).
- **Accessibilité** : le bouton annonce s'il est ouvert ou fermé et quel panneau il commande ; Échap ferme le panneau et rend le focus au bouton ; choisir une section ferme le panneau ; ce n'est pas une fenêtre modale, la page reste accessible ; le CV et le contact restent hors du menu. La démonstration de la page catalogue s'ouvre et se ferme sans script, mais ne gère pas la touche Échap : l'implémentation devra l'ajouter.
- **Jetons** : couleur-surface-relevee, couleur-surface, couleur-accent, couleur-texte, verre-bordure, ombre-flottante, flou-verre, arrondi-grand, plan-menu, marge-page, cible-tactile, espace-2, espace-4, duree-courte.

### CO-08 — Pied de page
- **Rôle** : clore chaque page avec les liens permanents : profils externes (dans le portfolio : GitHub et LinkedIn, MF-17), mentions légales (MF-19), signature.
- **Anatomie** : rangée haute (marque en police-titre, liens externes) ; rangée basse (étiquette de signature, lien des mentions légales) ; filet couleur-bordure au-dessus.
- **Variantes** : une rangée par ligne sur téléphone, éléments répartis aux deux extrémités sur grand écran.
- **États** : liens au repos, au survol, au focus (CO-02, variante discrète).
- **Accessibilité** : liens externes annoncés (« nouvel onglet ») ; chaque lien atteint 44 px de haut ; le libellé texte du réseau est obligatoire, un logo n'est qu'un complément.
- **Jetons** : couleur-bordure, couleur-texte, couleur-texte-secondaire, couleur-texte-discret, police-titre, graisse-titre, taille-titre-4, marge-page, cible-tactile, espace-1, espace-3, espace-5, espace-6, espace-10.

### CO-09 — Frise chronologique
- **Rôle** : présenter des périodes datées dans l'ordre (dans le portfolio : le parcours, MF-07).
- **Anatomie** : fil (1 px, couleur-bordure) ; tracé lumineux (2 px, dégradé de couleur-accent vers couleur-accent-secondaire) du début jusqu'à l'étape mise en avant ; une étape par période : point de 13 px, période en chasse fixe (« MM/AAAA – MM/AAAA »), intitulé (taille-titre-4), détail facultatif.
- **Variantes** : adaptative (verticale sous 900 px, horizontale au-delà, une colonne par étape) ; verticale (toujours, pour une colonne étroite).
- **États d'étape** : accomplie (point plein couleur-texte-secondaire) ; mise en avant (point couleur-accent avec lueur-point, période en accent) ; prévue (point creux, intitulé couleur-texte-secondaire). Tracé : dessiné une fois à l'apparition, ou affiché directement si le mouvement est réduit.
- **Accessibilité** : liste ordonnée ; chaque période est écrite en toutes lettres, avec un début et une fin, jamais au présent (MF-18) ; l'étape mise en avant l'annonce aussi par un texte masqué, pas seulement par la lumière.
- **Jetons** : couleur-bordure, couleur-accent, couleur-accent-secondaire, couleur-texte-secondaire, couleur-texte-discret, couleur-fond, lueur-point, police-mono, police-titre, taille-code, taille-titre-4, taille-texte-petit, plan-contenu, espace-1, espace-6, espace-8, duree-trace, courbe-entree-sortie.

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
- **Variantes** : information (icône accent, fond couleur-surface) ; envoi en cours (indicateur d'activité, « Envoi en cours… », « L'envoi peut prendre jusqu'à 90 secondes. Votre saisie est conservée. ») ; succès (« Message envoyé », champs vidés) ; échec réessayable (« L'envoi a échoué », saisie conservée, bouton « Réessayer ») ; attention (ressource indisponible, avec un lien vers une autre voie, par exemple le formulaire de contact).
- **États** : apparition à l'endroit de l'action (sous le bouton d'envoi) ; le message d'envoi en cours est remplacé par le succès ou l'échec ; pas de disparition automatique : le message reste jusqu'à la prochaine action.
- **Accessibilité** : icône, titre et texte à chaque fois, la couleur ne porte jamais seule l'information ; succès et envoi en cours annoncés poliment aux lecteurs d'écran, échec annoncé immédiatement ; pendant une attente longue, le texte suffit, avec ou sans animation.
- **Jetons** : couleur-surface, couleur-bordure, couleur-texte, couleur-texte-secondaire, couleur-accent, couleur-succes, couleur-erreur, couleur-attention, opacite-teinte-message, graisse-forte, taille-texte-petit, arrondi-moyen, espace-1, espace-3, espace-4, espace-5.

Le formulaire de contact assemble CO-10 et CO-11. Ses états sont tous montrés dans la page catalogue : repos, focus, champ manquant et e-mail invalide parmi les états de CO-10 ; puis, dans une composition dédiée, le formulaire complet au repos, l'envoi refusé (champ manquant et e-mail invalide), l'envoi en cours jusqu'à 90 s (champs désactivés, bouton et message d'attente), l'envoi réussi et l'envoi échoué réessayable.

### CO-12 — Fenêtre factice
- **Rôle** : mettre en scène une capture, un extrait de code ou une interface abstraite dans un cadre d'application.
- **Anatomie** : barre (trois points neutres de 9 px, puis un titre en chasse fixe ou une barre d'adresse factice) ; contenu (code, capture ou maquette abstraite) ; fond couleur-surface à 92 %, filet verre-bordure, ombre-fenetre, arrondi-grand.
- **Variantes** : code (extrait en chasse fixe, mots-clés en accent, chaînes en accent secondaire, commentaires en texte discret, retour à la ligne plutôt que défilement horizontal) ; navigateur (barre d'adresse factice, interface abstraite) ; capture (image au format 16:10).
- **États** : repos ; survol et focus si la fenêtre est un lien (soulevée de 3 px, filet couleur-accent à 40 %, anneau-focus) ; sans contenu, la fenêtre n'est pas affichée : jamais de cadre vide (SC-2.0-18).
- **Accessibilité** : une capture a un texte alternatif qui dit ce qu'elle montre ; un extrait de code reste du texte sélectionnable ; les trois points sont décoratifs.
- **Jetons** : couleur-surface, couleur-texte, couleur-texte-secondaire, couleur-texte-discret, couleur-accent, couleur-accent-secondaire, verre-bordure, ombre-fenetre, anneau-focus, police-mono, taille-code, taille-etiquette, arrondi-grand, arrondi-pilule, espace-3, espace-4, espace-5, duree-moyenne, courbe-sortie.

### CO-13 — Arrière-plan d'ambiance
- **Rôle** : donner sa lumière à une section : halos, trame et voile.
- **Anatomie** : couche de fond derrière le contenu, sans interaction : trame-points, un ou deux halos, voile-bas.
- **Variantes** : accueil (halo-accent en haut à droite, halo-secondaire en bas à gauche, trame) ; section (halo-accent et trame) ; sobre (trame seule).
- **États** : statique ; jamais animé, jamais fixé à la fenêtre.
- **Accessibilité** : purement décoratif ; deux halos ne se superposent jamais à leur pic (coins opposés), car le texte discret sur du verre posé sur deux halos cumulés descendrait sous 4.5:1 (section 8).
- **Jetons** : halo-accent, halo-secondaire, trame-points, pas-trame, voile-bas, opacite-halo-accent, opacite-halo-secondaire, opacite-trame.

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
- **États** : statique ; peut entrer en cascade (étiquette, titre, chapô).
- **Accessibilité** : le titre est un vrai titre de la hiérarchie de la page ; l'étiquette numérotée n'en fait pas partie.
- **Jetons** : police-titre, taille-titre-1, taille-titre-2, taille-chapo, couleur-texte, couleur-texte-secondaire, couleur-accent, espace-4.

### CO-17 — Liste clé-valeur
- **Rôle** : présenter des faits courts, chacun annoncé par une étiquette (dans le portfolio, par exemple, les informations d'une fiche projet).
- **Anatomie** : paires clé (étiquette discrète) et valeur.
- **Variantes** : en ligne (valeurs en police-titre, taille-titre-4, côte à côte puis empilées sur téléphone) ; en tableau (clé à gauche, valeur à droite en texte courant, séparées par un filet).
- **États** : statique.
- **Accessibilité** : liste de définitions ; une valeur absente fait disparaître toute la paire, jamais de clé sans valeur.
- **Jetons** : police-mono, police-titre, police-texte, taille-etiquette, taille-titre-4, taille-texte, couleur-texte, couleur-texte-secondaire, couleur-texte-discret, couleur-bordure, espace-1, espace-3, espace-4, espace-6.

## 8. Accessibilité

La cible est le niveau AA de la WCAG 2.2, avec quelques exigences au-delà quand elles ne coûtent rien.

### Contrastes

- **Texte et couleurs pleines** : les tableaux de la section 2 donnent, pour chaque palette, dix-huit paires calculées ; toutes atteignent leur minimum (4.5:1 pour le texte, 3:1 pour l'accent employé comme forme et pour le focus). L'accent sert aussi de couleur de lien : il atteint 4.5:1 même sur couleur-surface-relevee.
- **Fonds composés** : les effets translucides modifient le fond réel. Les ratios ci-dessous sont calculés en composant les couleurs en sRGB (opacité appliquée, arrondi à 8 bits), sur le cas le plus défavorable.

| Premier plan | Fond composé | PA-01 | PA-02 | PA-03 | Minimum |
| --- | --- | --- | --- | --- | --- |
| couleur-accent | pastille accent : couleur-accent à 14 % sur couleur-surface | 7.23 | 7.57 | 5.35 | 4.5 |
| couleur-accent-secondaire | pastille secondaire : couleur-accent-secondaire à 14 % sur couleur-surface | 7.03 | 8.11 | 8.75 | 4.5 |
| couleur-succes | pastille succès : couleur-succes à 14 % sur couleur-surface | 7.82 | 8.06 | 8.13 | 4.5 |
| couleur-erreur | pastille erreur : couleur-erreur à 14 % sur couleur-surface | 5.89 | 5.66 | 5.87 | 4.5 |
| couleur-attention | pastille attention : couleur-attention à 14 % sur couleur-surface | 8.98 | 8.88 | 9.06 | 4.5 |
| couleur-texte-secondaire | pastille neutre : couleur-texte à 8 % sur couleur-surface | 7.79 | 7.66 | 7.83 | 4.5 |
| couleur-texte-discret | verre sur le pic du halo d'accent | 4.76 | 4.89 | 5.12 | 4.5 |
| couleur-texte-discret | verre sur le pic du halo secondaire | 5.00 | 5.09 | 4.83 | 4.5 |
| couleur-texte | lien courant du menu : couleur-accent à 16 % sur couleur-surface | 11.95 | 12.08 | 13.33 | 4.5 |
| couleur-texte-sur-accent | bouton primaire au survol : couleur-texte à 12 % dans couleur-accent | 10.09 | 9.82 | 7.31 | 4.5 |
| couleur-texte-discret | bord de champ sur couleur-surface | 6.32 | 6.52 | 6.27 | 3 |
| couleur-bordure | séparateur sur couleur-fond (décoratif) | 1.62 | 1.63 | 1.57 | aucun |

- **Configuration interdite** : du texte discret sur du verre posé sur les deux halos à leur pic tomberait à 3.89 (PA-01), 3.96 (PA-02) et 4.01 (PA-03). D'où la règle de CO-13 : les deux halos se placent en coins opposés et ne se croisent qu'en lisière, là où leur intensité est faible.
- **La couleur n'est jamais seule** : un lien dans un texte est souligné ; une erreur a une icône et un message ; une pastille a un mot ; l'étape mise en avant de la frise l'annonce par un texte masqué ; la page courante est signalée par un attribut.

### Focus toujours visible

- Tout élément focalisable au clavier affiche anneau-focus : 2 px de couleur-focus, décalé de 2 px. Le style de focus n'est jamais retiré sans être remplacé.
- L'anneau se pose sur le fond, à 2 px de l'élément : il garde au moins 10.87:1 sur le fond et sur les deux surfaces (calcul complémentaire sur couleur-surface-relevee : 10.87, 12.76 et 12.47), même autour d'un bouton primaire dont l'accent est proche de couleur-focus (1.28:1 à 2.11:1 entre les deux).
- L'anneau entoure tout le périmètre de l'élément, sur 2 px, avec un contraste d'au moins 3:1 entre l'état focalisé et l'état non focalisé : c'est l'exigence du critère 2.4.13 (niveau AAA), tenue sans effort.
- Une carte interactive affiche l'anneau autour de la carte entière, pas seulement autour de son titre.

### Cibles tactiles

- Toute cible interactive mesure au moins 44 × 44 px (cible-tactile), au-delà du minimum AA de 24 × 24 px.
- Exception : les liens à l'intérieur d'une phrase, prévue par le critère 2.5.8.
- Deux cibles voisines sont séparées d'au moins 8 px (espace-2).

### Mouvement réduit

La préférence du visiteur est respectée telle que décrite en section 6 : aucune translation, aucune cascade, aucun tracé, indicateur d'activité fixe. Aucune information ne passe seulement par le mouvement.

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
- **Tous les autres jetons** : typographie, espacements, arrondis, bordures, effets, ombres, durées et courbes, plans, mise en page.
- **Les dix-sept composants** CO-01 à CO-17 : rôle, anatomie, variantes, états, accessibilité. Aucun ne porte de contenu ni de nom propre au portfolio.
- **Les règles** : mouvement et réduction des animations, budget de performance, focus, cibles tactiles, couleur jamais seule.

### Ce qui est propre au portfolio

- Le choix d'une des trois palettes (point P-01).
- Les textes, les dates et les images, fournis par Alexandre.
- Les usages : quelles actions sont permanentes dans l'en-tête (le CV et le contact), quelles sections figurent dans la navigation, ce que raconte la frise (le parcours), les cinq champs du formulaire de contact, la composition de la page d'accueil.
- La marque : le nom, le monogramme.

### Comment réutiliser la charte

1. **Choisir une palette** existante, ou en créer une : quatorze valeurs, puis le recalcul des dix-huit paires et des fonds composés avec la même méthode (WCAG 2.x, script, deux décimales). Une palette qui échoue à une paire est corrigée avant usage.
2. **Reprendre les autres jetons tels quels.** Une application peut en ajouter ; elle n'en renomme ni n'en détourne aucun.
3. **Composer les écrans avec les composants existants**, sans modifier leur anatomie. Un besoin nouveau donne un composant nouveau, numéroté à la suite (CO-18 et suivants), nommé par son rôle et documenté avec les mêmes six rubriques.
4. **N'utiliser dans un composant que des jetons**, jamais une valeur brute : c'est ce qui permet de changer de palette sans retoucher les composants.
5. **Versionner la charte** : tout changement de jeton ou de composant donne une nouvelle version de ce document, avec la liste de ce qui a changé ; les applications choisissent quand elles suivent.
6. **Le format d'implémentation se décide au scaffold** de chaque application (variables de feuille de style, fichier de données, bibliothèque de composants…). La page catalogue n'est qu'une démonstration ; elle n'impose aucun format.

Le système est en thème sombre uniquement (décision du 15/10/2026). Rien dans les noms ne l'interdit pour l'avenir : un thème clair serait une nouvelle série de quatorze valeurs, recalculée selon la même méthode.

## 10. Points à valider par Alexandre

- P-01 — Choix de la palette parmi PA-01 Laiton, PA-02 Lagune et PA-03 Framboise. Recommandation : PA-01 Laiton, la plus éloignée de la référence et la plus singulière, sobre pour un public de recrutement, avec les meilleurs contrastes sur l'action principale ; PA-02 en second choix pour une ambiance froide (section 2). La page catalogue permet de comparer les trois sur tous les composants.
- P-02 — Choix des trois familles de polices. Recommandation : Bricolage Grotesque pour les titres, Hanken Grotesk pour le texte, JetBrains Mono pour la chasse fixe, toutes sous SIL Open Font License 1.1 ; si les titres paraissent trop expressifs, l'alternative Sora, Source Sans 3 et IBM Plex Mono est plus classique (section 4).
- P-03 — Largeurs d'écran couvertes : de 320 à 2560 px, points de rupture à 600, 900, 1200 et 1600 px. Recommandation : valider tel quel ; cela couvre les téléphones courants en portrait et les grands écrans de bureau, ainsi que le zoom à 200 %.
- P-04 — Flou de verre réservé à l'en-tête collant et au menu ouvert, à partir de 900 px, cartes en verre sans flou. Recommandation : valider ; c'est le compromis qui garde l'effet visible là où il sert, sans peser sur le score de performance mobile visé (au moins 90).
- P-05 — Cibles tactiles de 44 × 44 px, au-delà du minimum AA de 24 × 24 px. Recommandation : valider ; la cible est le téléphone d'un recruteur, le coût en place est faible.
- P-06 — Liens externes ouverts dans un nouvel onglet, annoncés par une flèche oblique et un texte masqué. Recommandation : valider ; c'est la manière accessible de tenir la règle « le site reste ouvert dans la fenêtre d'origine » (MF-17).
- P-07 — Monogramme à la place du nom dans l'en-tête sous 480 px de large. Recommandation : valider ; sans lui, le CV, le contact et le menu ne tiennent pas ensemble sur un téléphone de 320 px.
- P-08 — Nom du design system pour ses réutilisations futures. Recommandation : ne pas le nommer maintenant ; le nommer à la première réutilisation dans une autre application, quand son périmètre réel sera connu.

## 11. Sources

- WCAG 2.2, recommandation du W3C (luminance relative, ratio de contraste, critères 1.4.3, 1.4.11, 2.3.3, 2.4.7) — https://www.w3.org/TR/WCAG22/ — consulté le 16/10/2026
- Understanding SC 1.4.3, Contrast (Minimum) — https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html — consulté le 16/10/2026
- Understanding SC 1.4.11, Non-text Contrast — https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html — consulté le 16/10/2026
- Understanding SC 2.4.13, Focus Appearance — https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html — consulté le 16/10/2026
- Understanding SC 2.5.8, Target Size (Minimum) — https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html — consulté le 16/10/2026
- MDN, prefers-reduced-motion — https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion — consulté le 16/10/2026
- web.dev, How to create high-performance CSS animations — https://web.dev/articles/animations-guide — consulté le 16/10/2026
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
