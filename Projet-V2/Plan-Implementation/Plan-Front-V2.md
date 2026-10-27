# Plan-Front-V2 — Plan d'implémentation du front
Statut : [x] à approuver  [ ] approuvé par : ______
Base : Contexte-Pitch, signé par Alexandre Morozoff le 14/10/26 ; US-2.0 et SC-2.0, approuvés le 15/10/26 ; Conception-Technique-V2, approuvée le 16/10/26, et son erratum (attente affichée jusqu'à 90 secondes), approuvé le 27/10/26 ; Parcours-Ecrans-V2, approuvé le 16/10/26 ; Charte-Graphique-V2, approuvée le 16/10/26, réapprouvée le 18/10/26, et sa révision sur les points laissés par les maquettes, approuvée le 27/10/26 ; maquettes des douze écrans et leur prototype animé, approuvés le 18/10/26 ; Tickets-V2, approuvé le 27/10/26 ; Contract-API-V2, approuvé le 27/10/26.

Ce document est le plan d'implémentation du front de la v2.0.0 (Étape 6, ticket TK-04). Il tranche tout ce que la conception technique, le parcours d'écrans, la charte, les maquettes et le contrat d'API laissent au plan front, mouvement compris, pour que chaque ticket du front se réalise sans nouvelle décision. Il ne rouvre aucun document signé : une incohérence relevée entre eux est posée en point à valider. Le back a son propre plan (Plan-Back-V2.md) ; le seul point de jonction entre les deux est le contrat d'API signé.

Conventions de lecture : PF-01 à PF-10 désignent les décisions de ce plan ; les autres identifiants sont ceux des documents signés (MF, SC, EC, PN, V, CT, D, R, CO, MV, P, C, C1 à C9, TK, A) ; E-01 à E-03 sont les échanges du contrat. « Conventions de front » désigne les conventions de code retenues par Alexandre le 13/10/2026 ; elles s'appliquent, sauf là où la conception technique signée s'en écarte, ce qui est dit en clair à chaque fois. Une valeur sans source suivie de « (proposition, à valider) » attend la signature de ce plan. Les faits datés vérifiés en ligne (versions, prise en charge par les navigateurs, comportement de l'hébergeur) viennent de la section Sources, consultée le 27/10/2026.

## Étape 0 — Filtrage des besoins

**US nécessaires** : MF-01 à MF-22, toutes servies par le front. MF-16 n'y a que sa part navigateur (validation, jeton, envoi, états), le reste est au back. MF-23 (version anglaise, v2.0.1) n'est que préparée (PF-02, PF-03). Exigences reportées qui pèsent sur le front : R-02, R-04, R-05, R-06, R-07, R-08, R-10, R-12.

**Scénarios nécessaires** : SC-2.0-01 à SC-2.0-32. Chacun a son contrôle automatique côté front (unitaire, contrôle du contenu ou bout en bout, selon la section 8 de la conception technique) dans l'étape qui le réalise. SC-2.0-23 à SC-2.0-26 passent par le contrat ; SC-2.0-19 et SC-2.0-20 par le test d'ajout d'un projet (TK-47) ; SC-2.0-28 par le contrôle du contenu (TK-28) et la relecture (TK-58).

**Écrans** : EC-00 à EC-11, leurs états et leurs adresses (/, /parcours, /competences, /experience, /methode, /projets, /projets/ suivi de l'identifiant, /cv, /contact, /mentions-legales ; EC-11 pour toute adresse inconnue) ; les parcours PT-01 à PT-05 ; les choix C1 à C9 du 16/10/2026 dans le texte exact de leurs options.

**Charte** : les jetons (sections 3 et 5), avec les valeurs de la palette PA-02 Lagune et celles de la révision du 27/10/2026 — en-tête translucide à 74 % à partir de 900 px (92 % en dessous et sans flou), lien de la marque élargi à 44 px autour du monogramme, lueur de survol intérieure à 20 %, voile bas qui atteint couleur-fond pleine au bord bas, étapes de la frise horizontale alignées en haut, libellé unique de l'attente « jusqu'à 90 secondes » ; les composants CO-01 à CO-17 ; le mouvement MV-01 à MV-10 (MV-09 écarté), la réduction et la pause des animations, le contenu visible sans script et le budget de performance (section 6) ; l'accessibilité (section 8) ; la réutilisation (section 9).

**Maquettes** : la structure, les états et les libellés des douze écrans (« Voir le CV », « Écrire un message », « ← Retour à la liste des projets », « Cette page n'existe pas », « Téléchargement en cours… », « CV momentanément indisponible », messages du formulaire), et le comportement du prototype de mouvement. Le front les reprend ; il ne reprend ni styles.css ni mouvement.js, réécrits en Angular (PF-01, PF-04). Là où les maquettes approuvées gardent une valeur que la charte a révisée depuis (en-tête à 72 %, ancien voile bas), le site prend la valeur de la charte.

**Contrat d'API** : E-01 (demande du jeton) et E-02 (envoi du message), consommés par TK-42 et TK-43 ; les règles des cinq champs (section 3), les réponses et ce qu'en fait le front (section 4), l'attente de 90 secondes (section 5) et le réveil du back (section 6). E-03 n'est jamais appelé par le front.

**Conception technique** : CT-01 (pré-rendu), CT-02 (versions), CT-03 (contenu versionné), CT-04 (traduction), CT-05 (hébergement du front), CT-09 et CT-10 (intégration continue et tests), CT-11 (référencement), CT-14 (contrôles qui lisent le front) ; sections 3 (front), 5 (modèle de contenu), 6 (environnements), 7 (sécurité et politique de sécurité du contenu), 8 (tests), 9 (durabilité), 10 (anciennes adresses) ; décisions D-01, D-02, D-07, D-08, D-10, D-11, D-12, D-13.

**Contenus** : C-01 à C-10, la vignette du projet portfolio (choix C2, tâche A-12) et les illustrations de la méthode (TK-66). Tant qu'un contenu manque, il est un emplacement étiqueté de son identifiant (PF-02).

**Tickets** : les 43 tickets du domaine front de la v2.0.0 ; les tickets d'infrastructure qui touchent front/ (TK-07, TK-09, TK-13, TK-49, TK-56, TK-58, TK-59) ; la version anglaise (TK-60, après la v2.0.0). Tâches d'Alexandre qui conditionnent le front : A-03, A-06, A-07, A-11, A-12, A-13, A-14.

**Écarts aux conventions de front du 13/10/2026** :
- traduction : la conception technique signée (CT-04) retient l'internationalisation intégrée d'Angular à la place de la bibliothèque de traduction externe des conventions ; c'est elle qui s'applique (PF-03) ;
- gestionnaire de paquets : ce plan retient npm à la place de pnpm (PF-01) ; l'écart est soumis à Alexandre ;
- aucun autre écart : détection de changement sans zone, OnPush, signaux, quatre fichiers par composant, ordre des membres, inject(), service HTTP unique, aide extractValidationErrors et tests Vitest s'appliquent tels quels.

## Décisions du plan

### PF-01 — Arborescence, jetons et composants de la charte

**Choix.**

*Socle.* Angular 22 dans sa dernière version 22.x au jour de TK-05 (22.2.3 au 27/10/2026), créé par la commande de création de projet d'Angular avec le rendu côté serveur, puis réglé en sortie entièrement statique (outputMode « static ») ; composants autonomes, détection de changement sans zone déclarée explicitement par provideZonelessChangeDetection, signaux. Node suit la règle de CT-02, appliquée au jour de TK-05 : Node 26 si la page des versions de nodejs.org la donne en LTS, sinon Node 24. Au 27/10/2026, Node 26 est encore « Current » et son passage en LTS active est inscrit au 28/10/2026 dans le calendrier officiel ; Angular 22 accepte Node 22.22.3 et plus, 24.15.0 et plus, et 26. La version est fixée dans front/.nvmrc (lu par la CI et par l'hébergeur) et dans le champ engines de package.json, avec engine-strict=true dans front/.npmrc : une installation sur une autre version échoue.

*Gestionnaire de paquets : npm*, avec package-lock.json versionné et npm ci partout (poste, CI, hébergeur). C'est un écart à la convention, qui épingle pnpm, pour trois raisons : Tickets-V2, signé, mesure la taille des PR en excluant package-lock.json ; npm est livré avec Node, alors que Corepack, qui fournissait pnpm sans installation, n'est plus distribué avec Node à partir de la v25 (vérifié) : pnpm demanderait une installation de plus dans la CI et chez l'hébergeur, à entretenir pendant deux ans ; la commande de création d'Angular et le robot de mises à jour le prennent en charge sans réglage. Point soumis à Alexandre.

*Arborescence de front/* :

```
front/
├── angular.json            projet « front », sortie statique pré-rendue, i18n.sourceLocale « fr »
├── package.json            scripts (« Commandes » ci-dessous), engines
├── package-lock.json
├── .nvmrc, .npmrc          version de Node, engine-strict=true
├── .gitignore              dist/, *.genere.ts, .env.local, .wrangler/, rapports de test
├── .prettierrc             printWidth 100, singleQuote, analyseur « angular » pour le HTML
├── tsconfig.json, tsconfig.app.json, tsconfig.spec.json   mode strict et modèles stricts
├── eslint.config.js, stylelint.config.mjs                  PF-10
├── wrangler.jsonc          règles de l'hébergeur, lues aussi par le serveur local (PF-08)
├── lighthouserc.json       budgets de performance (TK-57)
├── hebergement/
│   └── en-tetes.modele     modèle du fichier d'en-têtes de l'hébergeur (PF-09)
├── outils/                 scripts Node du build et des contrôles, en .mjs, sans dépendance
│   ├── ecrire-configuration.mjs   PF-07
│   ├── generer-index-contenu.mjs  PF-02
│   ├── finaliser-build.mjs        pages d'erreur (PF-06), en-têtes (PF-09), plan du site, robots.txt
│   ├── verifier-libelles.mjs      PF-03
│   ├── controle-contenu/          PF-02 : règles et ligne de commande
│   ├── serveur-local.mjs          repli de PF-08, créé seulement si le cas se présente
│   ├── vitest.config.mjs
│   └── tests/                     tests Vitest des outils et de leurs jeux d'essai
├── e2e/                    Playwright : configuration, scénarios, back simulé, fichiers de test
├── public/                 copié tel quel au build
│   ├── polices/            WOFF2 en sous-ensembles, avec leurs licences OFL 1.1
│   ├── images/             image d'aperçu au partage ; projets/<identifiant>/ : vignette, captures
│   ├── cv/                 le fichier du CV (C-03), sous le nom fixé par A-07
│   ├── _redirects          anciennes adresses (TK-56)
│   └── favicon.svg
└── src/
    ├── index.html          avec le petit script de tête (PF-04, PF-09)
    ├── main.ts, main.server.ts
    ├── styles.scss         point d'entrée des styles globaux
    ├── styles/             _jetons, _ruptures, _polices, _base, _typographie, _utilitaires, _mouvement
    ├── configuration/      configuration.genere.ts, non versionné (PF-07)
    ├── contenu/
    │   ├── contenu-langue.ts   rattache le build à sa langue (le français en v2.0.0)
    │   └── fr/                 fichiers de contenu (PF-02) ; projets/<identifiant>.json ;
    │                           projets/index.genere.ts, non versionné
    └── app/
        ├── app.ts, app.html, app.scss, app.spec.ts   composant racine : le cadre commun
        ├── app.config.ts, app.config.server.ts, app.routes.ts, app.routes.server.ts
        ├── pages/        un dossier par écran routé : accueil, parcours, competences, experience,
        │                 methode, projets, projet, cv, contact, mentions-legales, erreur
        ├── components/   les composants de la charte (tableau ci-dessous) et l'icône
        ├── fragments/    morceaux de page : profil-code, cartes-sections, formulaire-contact,
        │                 information-donnees, cv-indisponible, recit-methode, illustrations-methode/
        ├── layout/       entete (CO-06), menu-replie (CO-07), pied (CO-08) et pause-animations,
        │                 lien-evitement (CO-14)
        ├── services/     http (le service HTTP unique), contact-api, envoi-contact, contenu/,
        │                 mouvement/, defilement, navigation, referencement
        ├── interfaces/   contenu.ts, contact.ts, mouvement.ts
        ├── directives/   directives du mouvement (PF-04)
        ├── guards/       projet-existe (canMatch, PF-06)
        └── testing/      contenus de test, faux back, horloge, aides de rendu
```

*Commandes* (scripts de package.json) : « start » écrit la configuration et l'index du contenu puis lance le serveur de développement d'Angular ; « build » enchaîne ecrire-configuration, generer-index-contenu, la construction pré-rendue d'Angular et finaliser-build ; « test » lance ng test (Vitest) puis les tests des outils (Vitest, outils/vitest.config.mjs) ; « lint » lance ESLint, Stylelint et Prettier en vérification ; « controle-contenu » lance le contrôle du contenu (PF-02) ; « i18n:verifier » extrait les libellés et les vérifie (PF-03) ; « serveur-local » sert le build avec les règles de l'hébergeur (PF-08) ; « e2e » lance Playwright ; « lighthouse » lance Lighthouse CI.

*Conventions de code* (conventions de front, sans écart) : un composant, quatre fichiers côte à côte (.ts, .html, .scss, .spec.ts), nommés comme les produit la commande de génération d'Angular 22 ; OnPush sans exception ; input() et input.required(), output() ; jamais de décorateur @Input, @Output, ni d'EventEmitter ; membres exposés en readonly ; dépendances par inject() ; ordre des membres : entrées, sorties, signaux d'état, valeurs calculées, dépendances, hooks, méthodes ; état local en signal et computed, jamais de BehaviorSubject ; un service garde son signal écrivable privé et l'expose par asReadonly() ; appels réseau en async/await, tous par le service HTTP unique ; préfixe de sélecteur « app ». Noms : en français pour tout ce qui vient de la charte et du contenu (jetons, classes CSS en bloc__element--variante comme les maquettes, composants, champs du contenu), puisque la charte nomme tout en français (section 1) ; en anglais pour les propriétés du contrat, imposées, et pour l'aide extractValidationErrors, nommée par la convention.

*Jetons.* Des propriétés personnalisées CSS déclarées sur :root dans src/styles/_jetons.scss, une par jeton des sections 3 et 5 de la charte, sous son nom exact précédé de deux tirets (--couleur-accent, --duree-apparition, --lueur-survol…), avec les valeurs PA-02 et celles de la révision du 27/10/2026. Les jetons composés (verre-fond, verre-bordure, halo-accent, halo-secondaire, trame-points, voile-bas, lueur-survol, lueur-point, ombre-fenetre, ombre-flottante, anneau-focus) sont écrits à partir des jetons simples avec color-mix(), jamais avec une couleur en dur. Les points de rupture, qu'une propriété personnalisée ne peut pas porter dans une requête média, sont des variables du module SCSS src/styles/_ruptures.scss (moyenne 600 px, large 900 px, tres-large 1200 px, immense 1600 px) avec deux mixins, depuis() et jusqua(), chargés par tout composant ; marge-page et gouttiere changent de valeur par tranche dans _jetons.scss. Le mouvement lit ses durées, délais, distances et courbes dans les propriétés calculées de l'élément html, une fois, au démarrage dans le navigateur : la feuille de style reste la seule source des valeurs. Un composant n'emploie que var(--…) ; Stylelint refuse toute couleur brute hors de _jetons.scss (PF-10).

*Composants de la charte* :

| Composant | Dossier | Sélecteur | Entrées principales | Ticket |
| --- | --- | --- | --- | --- |
| CO-01 Bouton | components/bouton | button[appBouton], a[appBouton] | variante (primaire, secondaire, discret, icone), compact, enCours | TK-15, TK-19 |
| CO-02 Lien | components/lien | a[appLien] | variante (texte, discret, action, navigation, externe) | TK-15 |
| CO-03 Pastille | components/pastille | app-pastille | variante (neutre, accent, secondaire, succes, attention, erreur, contour), lumineuse | TK-17 |
| CO-04 Étiquette | components/etiquette | app-etiquette | variante (discrete, accent, numerotee, puce), numero | TK-17 |
| CO-05 Carte | components/carte | app-carte | variante (verre, pleine), lien (la rend interactive), niveauTitre | TK-26 |
| CO-06 En-tête | layout/entete | app-entete | aucune : la section courante vient du routeur (PF-06) | TK-27 |
| CO-07 Menu replié | layout/menu-replie | app-menu-replie | aucune | TK-29 |
| CO-08 Pied de page | layout/pied | app-pied | aucune | TK-30 |
| CO-09 Frise | components/frise | app-frise | etapes | TK-32 |
| CO-10 Champ | components/champ | app-champ | champ (un champ de Signal Forms), libelle, type (texte, email, zone), aide | TK-19 |
| CO-11 Message d'état | components/message-etat | app-message-etat | variante (information, envoi, succes, echec, attention), titre ; action projetée | TK-19 |
| CO-12 Fenêtre factice | components/fenetre | app-fenetre | variante (code, navigateur, capture), titre, decorative | TK-25 |
| CO-13 Arrière-plan d'ambiance | components/ambiance | app-ambiance | variante (accueil, section, sobre) | TK-26 |
| CO-14 Lien d'évitement | layout/lien-evitement | app-lien-evitement | cible | TK-27 |
| CO-15 Indicateur d'activité | components/indicateur-activite | app-indicateur-activite | taille (texte, bouton, grand) | TK-19 |
| CO-16 En-tête de section | components/entete-section | app-entete-section | numero, etiquette, niveau ; titre et chapô projetés | TK-17 |
| CO-17 Liste clé-valeur | components/liste-cle-valeur | app-liste-cle-valeur | variante (en-ligne, tableau), paires | TK-17 |
| Icône (hors charte) | components/icone | app-icone | nom | TK-15 |

Les composants d'action (bouton, lien) se posent par sélecteur d'attribut sur l'élément natif : la sémantique, le clavier et le lien du routeur restent ceux du navigateur, sans enrobage. Les états survol, focus et appuyé sont en CSS ; les états métier (enCours, invalide) sont des entrées.

*Réutilisation (charte, section 9).* components/ et directives/ ne dépendent d'aucun contenu ni d'aucun service du portfolio (règle d'import de PF-10) et n'emploient que des jetons ; un besoin nouveau donne un composant nouveau, numéroté à la suite (CO-18…). Leur extraction en bibliothèque Angular est reportée à la première réutilisation, quand le nom du système sera choisi (P-08).

*Icônes.* app-icone dessine chaque icône en SVG dans la page (flèche, flèche vers la gauche, flèche oblique, téléchargement, menu, fermer, valide, erreur, attention, information, réessayer, pause, lecture), chaque tracé portant pathLength="1" : le dessin de MV-05 n'a besoin d'aucune mesure (PF-04). Toutes sont décoratives (aria-hidden), le sens étant porté par le texte.

*Polices.* Fichiers WOFF2 servis par le site depuis public/polices/, avec leur licence ; graisses de la charte (Bricolage Grotesque 700 et 800, Hanken Grotesk 400 à 700, JetBrains Mono 400 et 500) ; sous-ensembles limités aux caractères utiles : U+0020-007E, U+00A0-00FF, U+0152-0153, U+0178, U+2013-2014, U+2018-201E, U+2026, U+202F (proposition, à valider), ce qui couvre aussi l'anglais de la v2.0.1 ; produits une fois par l'outil pyftsubset de fontTools depuis les sources officielles des familles, commande notée dans le README ; version de la police dans le nom du fichier ; font-display: swap ; préchargement des deux seuls fichiers du premier écran (Bricolage Grotesque 800 et Hanken Grotesk 400).

**Raison.** Des propriétés personnalisées se lisent dans la feuille de style comme à l'exécution : une seule source pour les composants et pour le mouvement, et le changement de palette prévu par la section 9 de la charte ne touche qu'un fichier. Des composants posés sur l'élément natif gardent l'accessibilité du navigateur sans la réimplémenter. L'arborescence suit celle des conventions de front (pages, components, fragments, layout, services, interfaces, directives, guards, testing) et isole les outils du build, qui ne sont pas du code d'application.

**Écarté.** Angular Material et le CDK : aspect et noms étrangers à la charte, et le menu replié se fait avec details et summary, qui fonctionnent sans script ; un cadre de classes utilitaires, dont les noms remplaceraient ceux de la charte ; des jetons en variables SCSS seules, invisibles à l'exécution donc au mouvement ; des jetons en JSON transformés par un outil, un outil de plus pour quatorze couleurs ; une bibliothèque Angular dès la v2.0.0, sans second utilisateur ; une planche de symboles SVG, où le tracé de MV-05 demanderait une mesure ; pnpm, pour les trois raisons ci-dessus.

### PF-02 — Contenu : fichiers, accès et contrôle

**Choix.**

*Forme des fichiers.* Du JSON (CT-03), rangé par langue sous src/contenu/fr/, seul le français rempli en v2.0.0. Textes en texte brut : une phrase est une chaîne, un texte long est une liste de paragraphes ; jamais de HTML. Un contenu encore à fournir est un emplacement étiqueté, exactement comme dans les maquettes : une chaîne de la forme « [C-xx — description] » ; un champ de date ou de nombre accepte aussi cette chaîne tant que le contenu manque.

| Fichier (src/contenu/fr/) | Contenu | Champs | Contenus |
| --- | --- | --- | --- |
| profil.json | profil, une occurrence | nom ; intitule ; liens.github et liens.linkedin (adresses HTTPS) ; cv.fichier (nom du fichier, fixé par A-07) | C-03 pour le fichier lui-même, dans public/cv/ |
| accueil.json | accueil | presentation (paragraphes) ; orientations : parcours, competences, experience, methode, projets (une phrase chacune, pour les cartes) | C-06, C-10 |
| parcours.json | parcours | introduction ; orientation (paragraphes) ; etapes : type (reconversion, bac+3, master), intitule, etablissement (obligatoire pour bac+3), debut et fin ({annee, mois facultatif}), etat (accomplie, mise-en-avant, prevue) | C-01, C-09, C-10 |
| competences.json | compétences | techniques : liste de catégories (libelle, rang, competences : libelle, rang) ; humaines : competences (libelle, rang), recit (paragraphes) ; aucun niveau (Q-06, A-06) | C-02, C-07 |
| experience.json | alternance | entreprise ; periode (debut et fin, années) ; volets : exactement trois, cle (application, backend, appui-devops), intitule, description (paragraphes) ; mentionConfidentialite | C-01, C-08 |
| methode.json | méthode, découpée en étapes (MV-08) | etapes : intitule, texte (paragraphes), illustration (clé d'une illustration de fragments/illustrations-methode/) ; renvoi.projet (identifiant) | C-04 |
| projets/<identifiant>.json | un projet | identifiant (égal au nom du fichier) ; titre ; description (paragraphes) ; descriptionCourte ; rang ; captures : fichier, alternatif, largeur, hauteur ; vignette facultative : fichier, largeur, hauteur ; lienCode facultatif (adresse HTTPS) | C-05, vignette (A-12) |
| textes-legaux.json | mentions légales, information sur les données | blocs de paragraphes, chaque paragraphe fait de segments : un texte seul, ou un texte et son lien (adresse interne ou HTTPS) | rédigés par le développement (TK-45), validés par Alexandre (A-13) |

L'état de chaque étape du parcours, dont celle qui est mise en avant, est un champ du contenu : rien n'est déduit de la date du jour (MF-18). La période de l'alternance, le nom de l'entreprise et les trois volets ne vivent qu'une fois, dans experience.json : la liste clé-valeur de l'écran Expérience (C6), la phrase d'ouverture de la carte « Expérience » de l'accueil et la fenêtre « profil.ts » (PF-05) en sont dérivées. Les libellés d'interface ne sont pas du contenu : ils sont marqués pour la traduction (PF-03).

*Vignette d'un projet (choix C2).* Facultative ; un fichier public/images/projets/<identifiant>/vignette.webp et ses dimensions. Dans la carte de la liste, elle est décorative, comme sur la maquette EC-06 où sa fenêtre est masquée aux lecteurs d'écran : le titre, lien de la carte, et la description courte nomment déjà le projet ; elle n'a donc pas de texte alternatif (point à valider, au regard de TK-65). Sans vignette, la carte n'affiche aucun cadre et se resserre.

*Captures et images.* Fichiers WebP (format moderne de la Baseline « largement disponible ») sous public/images/projets/<identifiant>/ (capture-01.webp, capture-02.webp…), déjà optimisés quand ils entrent dans le dépôt ; leurs dimensions déclarées dans le JSON servent aux attributs width et height de la directive d'images d'Angular (NgOptimizedImage), chargement à la demande sous la ligne de flottaison. Le contrôle vérifie que les dimensions déclarées sont celles du fichier.

*Étapes de la méthode (MV-08).* Une étape a un intitulé, un texte et la clé de son illustration. Les illustrations sont des dessins SVG, un composant par illustration dans fragments/illustrations-methode/, dont le modèle est un fichier .svg, et un registre qui associe chaque clé à son composant ; le contenu ne porte que la clé. Tant que C-04 manque, methode.json porte les quatre étapes de démonstration étiquetées des maquettes, avec leurs illustrations de démonstration.

*Couche d'accès.* Les types du modèle sont dans src/app/interfaces/contenu.ts. Chaque fichier a son service de lecture dans src/app/services/contenu/ (profil, accueil, parcours, competences, experience, methode, projets, textes-legaux), qui importe son JSON par src/contenu/contenu-langue.ts, le rend typé, trie par rang, retire une catégorie vide et refuse au pré-rendu, en levant une erreur qui fait échouer le build, une valeur fermée inconnue (type d'étape, état, clé de volet, clé d'illustration). Un service n'est importé que par les pages qui s'en servent : le contenu de chaque page tombe dans le morceau de code de cette page, chargé à la demande. Le contenu est donc lu au build (CT-03) et embarqué dans le site ; aucune page ne le demande au back.

*Index des projets, sans fichier à tenir à la main.* outils/generer-index-contenu.mjs parcourt src/contenu/<langue>/projets/*.json avant chaque build, test ou serveur de développement, et écrit src/contenu/<langue>/projets/index.genere.ts : un import par fichier, chacun vérifié par « satisfies Projet » (le compilateur refuse un champ obligatoire manquant ou mal typé), plus la constante cvPresent, vraie si le fichier de cv.fichier existe dans public/cv/. Ce fichier n'est pas versionné. getPrerenderParams de la route des fiches lit les identifiants dans cet index. Ajouter un projet, c'est donc ajouter un fichier JSON et un dossier d'images, et rien d'autre (MF-14) : la liste, la fiche, son adresse et le plan du site en sont dérivés au build, ce que TK-47 prouve à chaque PR.

*Contrôle du contenu.* outils/controle-contenu/, en JavaScript pour Node, sans dépendance : des règles, une par fonction, et une ligne de commande « npm run controle-contenu -- --mode=staging » ou « --mode=main ». Il lit les fichiers de contenu, public/images/ et public/cv/, et vérifie : champs obligatoires présents et non vides ; identifiants de projet uniques, en minuscules, chiffres et tirets, égaux au nom du fichier, différents de l'identifiant réservé « 404 » (PF-06) ; rangs entiers et uniques ; images présentes, en WebP, aux dimensions déclarées, captures avec un texte alternatif non vide ; liens en HTTPS ; renvoi de la méthode vers un projet existant ; clés d'illustration existantes ; ordre du parcours (reconversion, bac+3, master), établissement du bac+3, dates complètes, fin jamais avant le début, une seule étape mise en avant ; exactement trois volets aux trois clés ; aucun caractère « < » suivi d'une lettre, d'une barre ou d'un point d'exclamation (pas de HTML) ; aucune tournure qui se périme, insensible à la casse (âge, « ans », « actuellement », « depuis », « il y a », « en ce moment », « aujourd'hui », « cette année ») ; CV présent sous un nom conforme : minuscules, chiffres et tirets, extension .pdf, sans suite de quatre chiffres ni mot de situation (alternance, recherche, stage, disponible) ; aucun appel à new Date() sans argument, à Date.now() ni à Temporal.Now dans src/app/ (aucune valeur calculée depuis la date du jour, TK-28). Une erreur sort une ligne par faute (fichier, champ, règle) et fait échouer la commande. En mode staging, un emplacement étiqueté et l'absence du CV sont signalés comme avertissements (annotations de la CI) sans échec ; en mode main, ils sont des erreurs. La CI choisit le mode selon la branche visée par la PR ; TK-65 fait passer toutes les PR en mode main. Aucune liste de termes liés à l'employeur n'est commitée : cette règle reste à la relecture (section 5 de la conception technique).

**Raison.** Le JSON est lu nativement par TypeScript et vérifié par le compilateur ; le contrôle ne garde que les règles qu'un type ne peut pas dire. Un service par fichier garde chaque page légère. L'index généré tient la promesse de MF-14 sans liste à modifier, et le CV absent se voit au build au lieu d'un lien cassé.

**Écarté.** Du Markdown avec en-tête de données ou du YAML : un analyseur de plus, et du HTML qui pourrait entrer par le Markdown ; un gestionnaire de contenu (CT-03) ; un schéma JSON vérifié par une bibliothèque : une dépendance et une seconde description du modèle à côté des types ; un index des projets tenu à la main : contraire à MF-14 ; un contenu servi par des fichiers JSON chargés à l'exécution : une requête de plus par page et un contenu qui ne serait plus « lu au build ».

### PF-03 — Marquage pour la traduction

**Choix.** L'internationalisation intégrée d'Angular (CT-04, écart assumé aux conventions de front, qui prévoient une bibliothèque externe) :

- angular.json déclare i18n.sourceLocale « fr » ; le paquet @angular/localize est installé ; aucune autre langue n'est déclarée en v2.0.0 ; src/index.html porte lang="fr" ; un test unitaire vérifie que LOCALE_ID vaut « fr ».
- Dans les modèles, chaque libellé d'interface porte l'attribut i18n avec un identifiant personnalisé stable, de la forme « @@zone.element » en minuscules et tirets (« @@contact.bouton-envoyer », « @@commun.nouvel-onglet », « @@erreur.titre ») ; un attribut traduisible porte i18n-<attribut> (i18n-aria-label, i18n-title). Dans le code, $localize avec le même identifiant (« :@@contact.erreur-requis: »). Une valeur variable est un espace réservé nommé (le nombre maximal de caractères de « too-long », le nom de l'entreprise et la période de la carte « Expérience »), jamais une concaténation ; un pluriel passe par une expression ICU.
- Sont marqués : navigation, boutons, libellés et aides des champs, messages d'erreur de chaque code de raison (dont les quatre libellés de la section 4 du contrat), états d'envoi, textes masqués (« (nouvel onglet) », « (étape mise en avant) »), libellés du bouton de pause, textes de la page introuvable et du CV indisponible, titres et descriptions des pages pour le référencement, étiquettes et titres fixes des écrans. Ne sont pas marqués : les textes du contenu, traduits par fichier (PF-02).
- Dates et périodes : une seule fonction de mise en forme, formaterPeriode, fondée sur Intl.DateTimeFormat avec LOCALE_ID (mois sur deux chiffres et année, « MM/AAAA – MM/AAAA » ; années seules « 2025–2028 ») ; aucun nom de mois ni format écrit en dur, aucune date calculée.
- Contrôles : la règle i18n des modèles d'angular-eslint, réglée pour exiger l'identifiant personnalisé et signaler un texte non marqué (PF-10) ; « npm run i18n:verifier » lance l'extraction (ng extract-i18n, format XLIFF 2, dans un dossier temporaire non versionné) puis outils/verifier-libelles.mjs, qui fait échouer la CI si un message n'a pas d'identifiant personnalisé, ce qui couvre aussi $localize.
- Chemin de la v2.0.1 (TK-60), sans travail en v2.0.0 : versionner messages.en.xlf, déclarer l'anglais, remplir src/contenu/en/ et remplacer contenu-langue.ts par une variante par langue dans la configuration de build anglaise.

**Raison.** Des identifiants personnalisés ne changent pas quand le texte français change : une traduction déjà faite n'est pas perdue. Le contrôle mécanique tient la règle « libellés marqués » de la DoD commune sans relecture ligne à ligne.

**Écarté.** La bibliothèque de traduction à l'exécution des conventions (CT-04 l'a écartée) ; les identifiants calculés par Angular, qui changent à chaque retouche du texte ; le contenu dans les fichiers de traduction, qui mêlerait textes longs et libellés.

### PF-04 — Techniques du mouvement

**Choix.** Le prototype des maquettes (mouvement.js, styles.css) fixe le comportement validé ; le front le réécrit en Angular, par des directives, deux services et une feuille de style, sans en reprendre le code.

*Socle commun (TK-23).*

- **Petit script de tête**, seul script en ligne qu'exige le mouvement, écrit dans le head de src/index.html avant les feuilles de style, exécuté de façon synchrone : si le visiteur n'a pas demandé à réduire les animations (prefers-reduced-motion: no-preference), il pose la classe mv-actif sur l'élément html ; il relit le choix de pause mémorisé (clé « mv-pause » du stockage local, dans un try/catch) et pose mv-pause s'il vaut « 1 » ; 3 secondes après, si mv-pret manque, il retire mv-actif. Tout son corps est dans un try/catch. Son empreinte est calculée au build (PF-09).
- **MouvementService** (services/mouvement/), fourni à la racine, démarré par le composant racine dans afterNextRender, donc jamais pendant le pré-rendu. Si html n'a pas mv-actif (animations réduites, ou repli des 3 secondes déjà joué), il reste inactif et aucune directive ne fait rien : le contenu est déjà visible. Sinon il lit les jetons du mouvement, fixe le mode d'arrivée, puis pose mv-pret. Il expose en lecture seule les signaux actif, modeArrivee (anime ou immediat) et enPause.
- **Mode d'arrivée « immédiat »** : au premier chargement si le navigateur annonce une navigation de type back_forward (PerformanceNavigationTiming) ; à chaque navigation du routeur déclenchée par popstate (retour ou avance dans l'historique). En mode immédiat, le service pose mv-immediat sur html, qui coupe toutes les transitions, le temps de deux images, pendant que chaque directive pose son état final ; rien ne se rejoue. Une page restaurée depuis le cache du navigateur (pageshow avec persisted) garde son état : rien ne se cache ni ne se rejoue.
- **DefilementService** : un seul écouteur passif de défilement et de redimensionnement, posé au premier abonné et retiré au dernier, qui appelle ses abonnés au plus une fois par image (requestAnimationFrame) ; utilisé par MV-01 (rattrapage), MV-02 et MV-08.
- **Fonctions pures** (services/mouvement/calculs.ts), testées avec les valeurs de la charte : délais d'une cascade, MV-10 compris ; inversion de la courbe cubic-bezier de MV-02 ; minutage de l'écriture de MV-03 ; progression de la frise ; étape active du récit.
- **Feuille de style** : toutes les règles du mouvement sont dans src/styles/_mouvement.scss, global, sur des classes mv-* : un seul endroit à relire pour la réduction et le budget. Les états cachés n'existent que sous .mv-actif, dans @media (prefers-reduced-motion: no-preference) ; un bloc @media (prefers-reduced-motion: reduce) rend en plus toute transition et toute animation instantanées, par sûreté ; le défilement doux vers une ancre n'existe que sous no-preference.
- **Pré-rendu et hydratation** : IntersectionObserver, requestAnimationFrame, matchMedia, le stockage local, getComputedStyle et performance ne sont appelés que dans afterNextRender ou dans un gestionnaire d'événement du navigateur ; un appel pendant le pré-rendu fait échouer le build. Tout ce que le mouvement anime (mots, caractères, calques de halo et de lueur, scène du récit, repère de page courante) est rendu par les modèles, à l'identique au pré-rendu et dans le navigateur : les directives ne créent, ne déplacent ni ne retirent aucun nœud ; elles ne posent que des classes et des propriétés personnalisées, et n'écrivent des transformations que dans le navigateur.
- **Contenu visible sans script** : sans JavaScript, mv-actif n'est jamais posé ; script de l'application bloqué, lent ou en erreur : le repli des 3 secondes retire mv-actif ; dans tous les cas, aucun état caché n'existe.

*Motif par motif.*

- **MV-01 — Apparitions en cascade (TK-48).**
  - Technique : la directive appMvBloc sur chaque bloc de contenu ; appMvApparition sur chacun de ses éléments, qui s'inscrit auprès du bloc le plus proche par injection de dépendances (ce qui traverse les composants et garde l'ordre du document). La révélation pose la classe mv-vu et la propriété --mv-delai, calculée par la fonction pure : premier élément à 120 ms, puis 70 ms d'écart, six au plus, les suivants partant avec le sixième ; 700 ms, courbe-sortie, montée de 16 px. Jamais sur l'en-tête ni sur le pied.
  - Révéler d'emblée les blocs visibles (point laissé par les maquettes) : au démarrage, chaque bloc se mesure une fois ; s'il commence au-dessus du bas de la fenêtre, il joue sa cascade aussitôt, sans attendre l'observateur. Les autres sont confiés à un seul IntersectionObserver partagé (marge basse de −8 %, comme le prototype) ; un élément encore sous la fenêtre quand son bloc se révèle attend sa propre entrée et part alors à 120 ms.
  - Rattrapage du défilement rapide : tant qu'un bloc reste caché, DefilementService vérifie à chaque image s'il est passé entièrement au-dessus de la fenêtre (défilement très rapide, ancre, touche Fin) ; il est alors révélé d'un coup, sans animation. Aucun bloc ne reste caché.
  - Une fois révélé, un élément ne se cache plus : remonter ne rejoue rien.
  - Réduire les animations : rien n'est caché ni animé. Pause : sans effet. Sans script : tout est en place. Retour arrière, y compris depuis le cache du navigateur : mode immédiat, tout est en place d'emblée.
- **MV-02 — Frise tracée au défilement (TK-53).**
  - Technique : la directive appMvFrise sur la frise. Au démarrage et à chaque changement de largeur, elle mesure la position de chaque point le long du trait, de 0 au début à 1 à l'étape mise en avant. Tant que le trait n'a pas été tracé en entier, il suit le défilement : à chaque image, la propriété --mv-progression reçoit la progression de la frise dans la fenêtre (même formule que le prototype), le trait est mis à l'échelle (verticale sous 900 px, horizontale à partir de 900 px) et recule quand on remonte ; chaque point reçoit mv-vu quand le trait l'atteint.
  - Frise entièrement visible : elle pose mv-frise-entiere, qui porte la transition de 1,2 s en courbe-entree-sortie, met la progression à 1 et donne à chaque point un délai égal à l'instant où la courbe passe sa position, par inversion de la courbe (un point au quart s'allume vers 500 ms, aux trois quarts vers 660 ms).
  - Frise plus haute que la fenêtre (point laissé par les maquettes, tranché à la signature de Tickets-V2) : dès que le trait, en suivant le défilement, atteint l'étape mise en avant, la frise est tenue pour tracée en entier. Une fois tracée, elle le reste pendant toute la visite de la page et la directive cesse d'écouter le défilement.
  - Le point de l'étape mise en avant est toujours allumé, avec sa lueur ; le texte des étapes n'est jamais grisé. Écouteur passif, une mise à jour par image, sans animation-timeline.
  - Réduire les animations et sans script : trait entier jusqu'à l'étape mise en avant, points allumés (état par défaut de la feuille de style). Pause : sans effet. Retour arrière : trait posé d'emblée, sans tracé.
- **MV-03 — Fenêtre de code qui s'écrit (TK-54).**
  - Technique : le fragment profil-code rend le code par la variante code de la fenêtre factice, un élément par caractère, déjà en place ; chacun porte sa propriété --mv-d, calculée par la fonction pure de minutage (11 ms par caractère, dix fois plus en fin de ligne, trois fois plus après une virgule, indentation instantanée). La directive appMvEcriture, seulement si la fenêtre est affichée (à partir de 600 px), observe la fenêtre (seuil de 20 %), attend delai-depart, puis pose mv-vu : les caractères apparaissent par des transitions d'opacité retardées, sans boucle de script par caractère. Le curseur, un élément décoratif rendu par le modèle, est déplacé par translation sur le dernier caractère apparu, une fois par image, pendant l'écriture seulement (environ 3 s), puis masqué. Si la fenêtre quitte l'écran pendant l'écriture, la classe mv-fini affiche tout d'un coup. Le cadre a sa taille finale dès le départ ; le texte reste sélectionnable.
  - Un test unitaire calcule la durée totale sur le vrai contenu et vérifie qu'elle reste sous 5 secondes ; au-delà, l'extrait s'afficherait déjà écrit (charte).
  - Réduire les animations et sans script : code écrit, sans curseur. Pause : sans objet, l'écriture s'arrête seule avant 5 s. Retour arrière : code écrit d'emblée.
- **MV-04 — Halos qui respirent (TK-50).**
  - Technique : CSS seule, sur les calques de halo que rend l'arrière-plan d'ambiance (débordant de 10 % de leur section, comme le prototype) : animation de 8 s, opacité de 55 % à 100 % de la valeur de la charte, échelle de 0,9 à 1,08, en boucle, sous .mv-actif.mv-pret seulement ; le second halo d'une section décalé d'une demi-période, en opposition de phase ; sans suivi du pointeur.
  - Pause : .mv-pause met l'animation en pause (animation-play-state). Le bouton est le composant pause-animations du pied : un vrai bouton, au libellé « Mettre les animations en pause » puis « Relancer les animations », sans état pressé annoncé ; il bascule MouvementService.enPause, qui pose ou retire mv-pause sur html et l'écrit dans le stockage local (« 1 » ou « 0 », dans un try/catch). Il n'existe à l'écran que sous .mv-actif, invisible jusqu'à mv-pret (sa place est réservée dès le premier affichage), donc masqué quand les animations sont réduites ou que le script ne tourne pas.
  - Réduire les animations et sans script : halos fixes à leur valeur de charte.
- **MV-05 — Tracés qui se dessinent (TK-51).**
  - Technique : la directive appMvTrace, inscrite dans la cascade de son bloc, sur le filet de l'étiquette numérotée de l'en-tête de section (mise à l'échelle horizontale depuis la gauche, 600 ms, courbe-sortie) et sur les icônes en trait des cartes et des liens d'action (stroke-dasharray de 1 et stroke-dashoffset de 1 à 0, 600 ms, courbe-entree-sortie, grâce à pathLength="1" : aucune mesure) ; délai : celui de l'élément porteur, plus 70 ms par rang de tracé.
  - Réduire les animations, sans script, retour arrière : tracés complets. Pause : sans effet.
- **MV-06 — Survols vivants (TK-51).**
  - Technique : en CSS, dans @media (hover: hover) and (pointer: fine) et sous no-preference : la carte interactive se soulève de 4 px (duree-moyenne, courbe-sortie), son calque d'ombre (ombre-flottante) passe à l'opacité 1, son filet passe à couleur-accent à 45 % ; la flèche du lien d'action glisse de 4 px et son soulignement s'étire depuis la gauche. Au clavier, :focus-visible donne le même soulèvement et le même soulignement, sans lueur. La lueur : la directive appMvLueur sur la carte interactive, dans le navigateur, avec un pointeur fin et mv-actif, écoute pointerenter et pointermove (écouteurs passifs) et écrit la translation du disque (380 px, 20 % de couleur-accent) au plus une fois par image, dans le calque de lueur rendu par le modèle, sous le contenu de la carte. Le calque n'est visible au survol que sous .mv-pret.
  - Réduire les animations : seules les couleurs changent, instantanément. Sans script : soulèvement, ombre, flèche et soulignement restent ; la lueur est absente. Pause : sans effet. Une carte interactive ne se pose jamais sur un halo (règle de CO-05, vérifiée à la relecture et par axe-core pendant un survol).
- **MV-07 — Transitions entre pages (TK-52).**
  - Technique : les transitions de vue du navigateur dans un même document, par la fonction withViewTransitions du routeur d'Angular, qui exécute l'activation de la route dans document.startViewTransition : après le démarrage de l'application, chaque navigation interne est une navigation du routeur. Son rappel onViewTransitionCreated annule la transition (skipTransition) quand html n'a pas mv-actif (animations réduites ou repli), quand la navigation vient de popstate (retour ou avance : aucun fondu ne rejoue) et quand seuls le fragment ou les paramètres changent.
  - Rendu, dans _mouvement.scss : l'en-tête porte view-transition-name « entete », sans animation sur son groupe ni sur ses images : il reste fixe ; le repère de page courante est un élément propre, rendu seulement dans le lien courant (navigation, ou « CV » et « Contact », choix C9), qui porte view-transition-name « repere-courant » : le navigateur le fait glisser de l'ancien lien vers le nouveau (600 ms, courbe-sortie) ; l'ancienne page (::view-transition-old(root)) s'efface en montant de 8 px en 240 ms, courbe-standard ; la nouvelle (::view-transition-new(root)) arrive en fondu en 600 ms, sans translation, ses blocs visibles jouant leur cascade.
  - Le premier chargement d'une page n'a pas de fondu : la page s'affiche avec ses cascades. Les transitions entre documents (règle @view-transition) ne sont pas activées : leur disponibilité est limitée (Firefox ne les a pas) et elles ne serviraient qu'aux navigations faites avant le démarrage de l'application.
  - Un clic avec Cmd, Ctrl, Maj ou Alt, un clic milieu, un lien externe, un téléchargement ou un lien avec target ne passent pas par le routeur (le lien du routeur laisse ces clics au navigateur ; liens externes et téléchargements sont de simples liens) : aucune interception.
  - Prise en charge vérifiée en ligne le 27/10/2026 (Web Platform Status) :

    | Navigateur | Transitions dans un même document (retenues) | Transitions entre documents (non retenues) |
    | --- | --- | --- |
    | Chrome, ordinateur et Android | depuis la version 111 (07/03/2023) | depuis la version 126 (11/06/2024) |
    | Edge | depuis la version 111 (13/03/2023) | depuis la version 126 (13/06/2024) |
    | Firefox, ordinateur et Android | depuis la version 144 (14/10/2025) | non disponible |
    | Safari, macOS et iOS | depuis la version 18 (16/09/2024) | depuis la version 18.2 (11/12/2024) |

    Les transitions dans un même document sont « nouvellement disponibles » de la Baseline depuis le 14/10/2025, pas encore « largement disponibles » : c'est l'exception d'amélioration facultative admise par la DoD commune (Tickets-V2, section 7, tranchée à sa signature). Un navigateur sans prise en charge navigue sans transition ni erreur (documenté par Angular). La fonction withViewTransitions est marquée « developer preview » dans la documentation d'Angular : un changement de sa forme dans une version mineure ne toucherait que cette amélioration facultative, et le test de bout en bout de TK-52 le verrait.
  - Réduire les animations et sans script : navigation immédiate. Pause : sans objet.
- **MV-08 — Récit au défilement (TK-55).**
  - Technique : le fragment recit-methode rend, au pré-rendu comme dans le navigateur, la liste des étapes avec chacune son illustration sous son texte (la présentation réduite), et une scène : une fenêtre factice décorative qui contient une seconde fois toutes les illustrations, superposées, et la barre de progression. La feuille de style choisit : sans .mv-actif, ou avec les animations réduites, la scène est masquée et chaque illustration reste sous son étape ; sous .mv-actif, la scène est collante sous l'en-tête, les illustrations des étapes sont masquées, chaque étape mesure au moins 30 % de la hauteur de la fenêtre sous 900 px et 70 % à partir de 900 px, en deux colonnes à partir de 900 px. La directive appMvRecit s'abonne à DefilementService : l'étape active est la dernière dont le haut a passé 40 % de la hauteur de la fenêtre ; un signal etapeActive pose est-active sur l'étape et sur son illustration de la scène, et la barre avance (--mv-progression-recit). Les pièces d'une illustration (barres, schéma tracé avec pathLength="1", délai par leur indice) changent en opacité et position de 14 px en duree-etape, courbe-sortie, après delai-depart et un écart de delai-mot-titre. Contrairement au prototype, rien n'est déplacé dans le document : l'hydratation reste sûre. Ce n'est pas une parallaxe : la lecture pilote.
  - Réduire les animations et sans script : pas de fenêtre collante, chaque illustration sous son étape. Pause : sans effet.
- **MV-09 — Bandeau en boucle.** Écarté par la charte : aucun composant, aucune règle.
- **MV-10 — Titre révélé mot par mot (TK-54).**
  - Technique : l'accueil rend le nom et l'intitulé mot par mot, chaque mot dans un cache (inline-block et clip-path, même mise en boîte avec ou sans mouvement), avec la directive appMvMot et son groupe (titre ou intitule) ; état caché sous .mv-actif : translation de 100 % vers le bas et opacité 0. Délais par la fonction pure : le nom part à delai-depart (200 ms), un mot toutes les 110 ms, chaque mot en 700 ms ; l'intitulé part quand le dernier mot du nom est parti, un mot toutes les 40 ms, chaque mot en 600 ms ; puis la présentation et les boutons en cascade (MV-01) ; tout est en place avant 2 s. Le titre reste lu d'un seul tenant par les lecteurs d'écran : les mots sont des éléments en ligne du même h1, sans aria-hidden ni libellé de remplacement, les espaces gardés comme texte.
  - Repli accepté d'avance (P-12, et choix d'Alexandre du 17/10/2026 : « nom affiché d'emblée ») : une seule constante, REVELATION_NOM_ACCUEIL dans services/mouvement/reglages.ts, vaut « mot-par-mot » ou « immediat » ; « immediat » rend le nom sans état caché, affiché dès le premier affichage sans attendre le démarrage de l'application, tandis que l'intitulé, la présentation et les boutons gardent leur cascade. Appliqué seulement si la mesure de TK-57 l'exige.
  - Réduire les animations et sans script : tout affiché d'emblée. Retour arrière : affiché d'emblée. Pause : sans objet.

*Budget (TK-57).* Aucune bibliothèque d'animation. Propriétés animées : opacité, transformation, stroke-dashoffset et les couleurs des changements d'état ; Stylelint refuse « transition: all » (PF-10). Aucun décalage de mise en page : tout ce qui bouge occupe sa place finale dès le premier affichage. Halos, trame et voile sont peints une fois. Le flou est réservé à l'en-tête et au menu ouvert, à partir de 900 px. Leviers sans effet visible, appliqués d'emblée : chaque page dans son propre morceau de code chargé à la demande (loadComponent), morceau principal réduit au cadre commun, préchargement des morceaux initiaux par Angular, deux polices préchargées seulement. Risque connu : sous mv-actif, le contenu du premier écran attend le démarrage de l'application (3 secondes au plus, par le repli), ce qui pèse sur le plus grand élément affiché ; TK-57 le mesure (point à valider).

**Raison.** Des classes et des propriétés posées sur des éléments déjà rendus gardent l'hydratation intacte et laissent le navigateur animer en CSS, sur sa file de composition ; un seul écouteur de défilement limite le coût à une mise à jour par image ; le routeur d'Angular fournit les transitions de vue sans code propre et s'efface seul dans un navigateur qui ne les connaît pas.

**Écarté.** La reprise de mouvement.js tel quel : il déplace et crée des nœuds (caractères, illustrations), ce que l'hydratation interdit, et il simule des transitions qui ne servent qu'en fichiers locaux ; une bibliothèque d'animation (budget de la charte) ; animation-timeline pour MV-02 et MV-08 (rendu différent entre Chrome et Safari, charte) ; les transitions de vue entre documents (disponibilité limitée) ; un IntersectionObserver par bloc ; une boucle de script par caractère pour MV-03.

### PF-05 — Fenêtre « profil.ts » et lecteurs d'écran

**Choix.**

*Règle générale (CO-12).* La fenêtre factice a une entrée decorative. Une fenêtre qui ne fait que répéter des informations déjà affichées sur la même page est décorative : aria-hidden="true" sur sa racine, aucun descendant focalisable, texte toujours sélectionnable. Une fenêtre qui porte une information propre n'est pas décorative : elle est une figure dont le titre de barre est la légende, et son texte est exposé en un seul nœud, dans un élément masqué visuellement qui contient l'extrait entier ; seule sa copie animée, découpée en caractères, est masquée aux lecteurs d'écran (un lecteur qui lirait caractère par caractère ne lit ainsi jamais la version découpée). Les trois points de la barre et le curseur sont toujours décoratifs.

*« profil.ts » (décision d'Alexandre du 27/10/2026, déjà prise le 17/10/2026).* Décorative. Son contenu est dérivé du contenu, jamais écrit dans le code : le nom et l'intitulé (profil.json), l'entreprise et la période de l'alternance (experience.json), sans bloc « liens ». Chacune de ces informations est affichée en texte sur l'accueil : le nom dans le h1, l'intitulé juste dessous, l'alternance en tête du texte de la carte « Expérience » (« Alternance chez <entreprise>, <période>. », libellé marqué pour la traduction, à deux espaces réservés). Sous 600 px, la fenêtre est en display: none (choix C3) et rien ne tourne.

*Contrôles.* Un test unitaire de l'accueil vérifie que chaque valeur affichée dans « profil.ts » figure aussi dans le texte visible de l'accueil : si l'on ajoutait une information propre à la fenêtre, le test échouerait et la règle générale imposerait de la rendre lisible. Un test de bout en bout compare l'arbre d'accessibilité de l'accueil à un instantané (toMatchAriaSnapshot de Playwright) : aucun texte de « profil.ts » n'y figure, le h1 se lit d'un seul tenant. axe-core ne relève aucune violation.

**Raison.** Lue par un lecteur d'écran, la fenêtre répéterait le nom, l'intitulé et l'alternance déjà entendus, et un extrait de code lu à voix haute est pénible ; la règle se garde toute seule grâce au test de recouvrement.

**Écarté.** role="img" avec un libellé de résumé (une redite de plus) ; exposer le code tel quel (lecture du code, ponctuation comprise) ; un texte propre à la fenêtre, qui casserait la règle.

### PF-06 — Page introuvable et projet inexistant

**Choix.**

*Un seul composant, trois variantes.* pages/erreur rend : « adresse-inconnue » (le « 404 » d'affiche, décoratif, « Cette page n'existe pas », la phrase de la maquette, « Revenir à l'accueil ») ; « projet-inexistant » (la même chose, plus « Voir la liste des projets ») ; « cv-indisponible » (l'état « CV indisponible » de EC-08 : le message d'attention « CV momentanément indisponible » et le lien vers /contact, par le fragment cv-indisponible que la page CV emploie aussi). La variante vient des données de la route quand elles existent, sinon du début de l'adresse : /projets/ donne « projet-inexistant », /cv/ donne « cv-indisponible », tout le reste « adresse-inconnue ». La page porte la consigne de non-indexation (meta robots « noindex »), un h1, et le cadre commun complet (en-tête, menu replié, pied).

*Routes* (app.routes.ts) : les dix adresses du plan du site ; trois routes techniques pré-rendues, « 404 », « projets/404 » (déclarée avant « projets/:id ») et « cv/404 », qui portent chacune leur variante dans leurs données ; « projets/:id » protégée par le garde canMatch projet-existe, qui ne la laisse correspondre qu'à un identifiant présent dans l'index des projets ; la route « ** » vers pages/erreur, en rendu côté client (RenderMode.Client), jamais pré-rendue. L'identifiant de projet « 404 » est réservé, ce que le contrôle du contenu vérifie (PF-02).

*Fichiers servis.* Après la construction, finaliser-build.mjs déplace 404/index.html en 404.html, projets/404/index.html en projets/404.html et cv/404/index.html en cv/404.html, puis retire les dossiers vidés et, s'il existe, le document de rendu client (index.csr.html) qu'Angular peut produire pour une route en rendu client, que l'hébergeur ne servirait jamais. Avec not_found_handling « 404-page », l'hébergeur sert, pour une adresse sans fichier, le 404.html le plus proche avec le statut 404 (vérifié) : /une-adresse-inconnue reçoit 404.html, /projets/identifiant-inconnu reçoit projets/404.html, et le fichier du CV manquant reçoit cv/404.html (SC-2.0-22, sans code, comme le prévoit la section 3 de la conception technique). Le statut 404 vient de l'hébergeur, jamais du script.

*Hydratation.* Quand l'application démarre sur projets/404.html servi à /projets/identifiant-inconnu, le routeur refuse « projets/:id » (garde), tombe sur « ** », et la variante, lue dans l'adresse, est celle du fichier servi : même composant, même variante, même document, donc aucune différence entre le pré-rendu et le navigateur. Une navigation interne vers un projet inexistant (lien périmé) montre la même page, côté client.

*Section courante.* L'entrée signalée de la navigation vient de data.section de la route active, jamais d'une comparaison d'adresses : les routes d'erreur, « ** » et /mentions-legales n'en ont pas, donc aucune entrée n'est signalée (EC-00, EC-11), même à /projets/identifiant-inconnu. Une fiche projet porte data.section « projets ».

**Raison.** Une variante par fichier 404.html donne le bon message et le bon statut sans script et sans code chez l'hébergeur ; un seul composant dont la variante se lit de la même façon des deux côtés rend l'hydratation sûre.

**Écarté.** Un seul 404.html complété par script quand l'adresse commence par /projets/ : le retour à la liste manquerait sans script et le document changerait après l'hydratation ; un composant par variante : le pré-rendu et le navigateur ne rendraient pas le même composant ; une redirection vers une adresse /404 : l'adresse demandée et le statut 404 seraient perdus.

### PF-07 — Adresse du back par environnement

**Choix.**

*Une valeur de configuration écrite au build, jamais dans le dépôt.* outils/ecrire-configuration.mjs écrit, avant chaque build et chaque serveur de développement, src/configuration/configuration.genere.ts (non versionné), qui exporte trois valeurs : environnement (developpement, test, preproduction, production), baseApi (la base de l'API du back, sans barre finale) et origineSite (l'origine canonique du site, celle de D-08, pour les adresses canoniques, l'aperçu au partage, le plan du site et la signature du pied). Il les lit dans des variables d'environnement :

| Variable | Où elle vit | Rôle |
| --- | --- | --- |
| PORTFOLIO_ENVIRONNEMENT | facultative ; à défaut, déduite | developpement par défaut sur le poste ; test dans la CI et les tests ; chez l'hébergeur, production si la branche construite (WORKERS_CI_BRANCH, posée par Cloudflare) est main, preproduction sinon |
| PORTFOLIO_BASE_API_PRODUCTION | variable de build chez Cloudflare | base de l'API de production, sur le sous-domaine du back (CT-06) |
| PORTFOLIO_BASE_API_PREPRODUCTION | variable de build chez Cloudflare | base de l'API de préproduction (fixée par le plan du back) |
| PORTFOLIO_ORIGINE_SITE | variable de build chez Cloudflare | origine canonique de production, la même pour tous les builds |
| PORTFOLIO_BASE_API | front/.env.local, non versionné | base du back local, en développement |

En test, baseApi et origineSite valent l'origine du serveur local de test (PF-08) : le back simulé est servi sur la même origine. En préproduction et en production, une variable absente, ou une valeur qui n'est pas une origine HTTPS, fait échouer le build. Aucune de ces valeurs n'est un secret ; aucune n'est écrite dans le dépôt, conformément au contrat (section 1 : « aucun hôte n'est écrit, ni dans ce contrat ni dans le code »). Les préversions de branche autres que staging appellent le back de préproduction, qui refuse leur origine (contrat, section 1) : leur formulaire échoue proprement, ce qui est attendu.

*Une seule source pour l'appel et pour la politique.* La même baseApi sert au service contact-api (adresse appelée = base suivie de la route du contrat) et à la directive connect-src de la politique de sécurité du contenu (PF-09).

*Appels.* Tous les appels passent par le service HTTP unique (services/http), qui appelle la fonction fetch du navigateur, fournie par un jeton d'injection pour que les tests la remplacent, et rend des Promise, avec annulation par AbortSignal. Chaque appel porte credentials: "omit", comme le demande le contrat (section 1) : aucun cookie, aucun identifiant. E-01 part sans corps ni Content-Type, avec le seul en-tête Accept: application/json, pour rester une requête « simple » au sens du CORS ; E-02 avec Content-Type et Accept application/json. Ni fetch ni HttpClient ne sont employés ailleurs (règles d'import et de globaux, PF-10). Ce n'est pas un écart aux conventions de front, qui demandent un service HTTP unique, des Promise et aucun HttpClient dans un composant : fetch est retenu plutôt qu'HttpClient parce qu'il pose exactement les en-têtes et l'option credentials du contrat, sans en-tête Accept ajouté par défaut, et rend nativement des Promise annulables.

**Raison.** Le contrat interdit tout hôte dans le code ; une valeur de build donne une adresse juste dans chaque environnement, rend la politique de sécurité exacte, et changer d'hébergeur du back ne demande pas de toucher au dépôt (CT-06, section 6).

**Écarté.** Les fichiers d'environnement d'Angular avec remplacement par configuration : ils écriraient les hôtes dans le dépôt ; un fichier de configuration lu à l'exécution : une requête de plus, et la politique de sécurité devrait de toute façon connaître l'adresse au build ; une base relative réécrite par l'hébergeur vers le back : il faudrait un script chez l'hébergeur, exclu par CT-05 ; HttpClient dans le service HTTP unique : il ajoute un en-tête Accept par défaut, rend des Observable à convertir, et l'option credentials « omit » du contrat n'y est pas garantie.

### PF-08 — Serveur local pour les tests de bout en bout

**Choix.** wrangler dev, l'outil de Cloudflare, épinglé en dépendance de développement de front/, lancé sur le build par « npm run serveur-local », avec le même front/wrangler.jsonc que l'hébergeur : ressources statiques seules, assets.directory vers dist/front/browser, not_found_handling « 404-page », html_handling « drop-trailing-slash », aucun script Worker. Le mode « drop-trailing-slash » sert /parcours depuis parcours/index.html sans redirection et redirige /parcours/ vers /parcours en 307 (vérifié) : les adresses du parcours d'écrans restent sans barre finale. La télémétrie de l'outil est coupée (WRANGLER_SEND_METRICS=false). Le même serveur sert Playwright (webServer de la configuration) et Lighthouse CI (TK-57).

*Vérification de l'outil.* Les règles de routage (404 le plus proche, barre finale) sont celles des ressources statiques, que wrangler dev exécute localement ; l'application locale de _headers et de _redirects n'est attestée que par une entrée du journal des versions de Wrangler, vue dans un résultat de recherche, sans la page officielle (vérification partielle, voir Sources). Le banc de TK-21 commence donc par une spécification de conformité du serveur local, qui échoue si une règle manque : /parcours en 200 sans redirection ; /parcours/ en 307 vers /parcours ; une adresse inconnue en 404 avec la page introuvable ; /projets/identifiant-inconnu en 404 avec sa variante ; le fichier du CV manquant en 404 avec la page du CV indisponible ; l'en-tête Content-Security-Policy égal à celui du _headers produit ; et, dès TK-56, chaque redirection de _redirects.

*Repli, entièrement fixé.* Si cette spécification échoue sur wrangler dev à la version épinglée, TK-21 écrit outils/serveur-local.mjs, serveur HTTP de Node sans dépendance qui reproduit exactement les règles employées par le site : fichiers de dist/front/browser, mode « drop-trailing-slash », 404.html le plus proche avec le statut 404, en-têtes de la règle « /* » et des règles à chemin exact de _headers, redirections à chemin exact et à joker unique de _redirects ; « npm run serveur-local » pointe alors sur lui, et la même spécification de conformité le valide.

*Back simulé.* Le build de test met baseApi sur l'origine du serveur local (PF-07) ; Playwright intercepte les routes /api/v1/form-tokens et /api/v1/contact-messages (page.route) et répond selon le contrat, scénario par scénario (jeton à l'heure, jeton en retard, refus de validation, 503, absence de réponse) : aucune requête ne quitte le navigateur, même origine, donc sans requête préalable.

**Raison.** Le même outil et le même fichier de configuration que l'hébergeur réduisent l'écart entre les tests et la production ; la spécification de conformité transforme le doute sur l'outil en contrôle exécuté.

**Écarté.** Le serveur de développement d'Angular : il ne sert pas le build et n'a ni page 404 la plus proche, ni statut 404, ni en-têtes ; un serveur statique générique de npm : il ne lit ni _headers ni _redirects et applique d'autres règles de barre finale et de 404 ; les préversions de Cloudflare comme cible des tests de la CI : dépendance au réseau et au délai de déploiement, adresse d'hébergeur dans la CI.

### PF-09 — Politique de sécurité du contenu

**Choix.**

*La politique* (production et préproduction), posée par le fichier d'en-têtes de l'hébergeur sur toute adresse (règle « /* ») :

```
default-src 'self'; script-src 'self' <empreintes>; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self'; connect-src 'self' <base de l'API>; manifest-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests
```

- Scripts : seulement des fichiers du site et des scripts en ligne autorisés un par un par leur empreinte SHA-256 ; ni 'unsafe-inline', ni 'unsafe-eval', ni 'strict-dynamic', puisque tous les scripts chargés sont des fichiers du site.
- Styles : 'unsafe-inline' est nécessaire avec le pré-rendu. Angular écrit les styles des composants dans des éléments style en ligne de chaque page et en ajoute à l'exécution, et des valeurs de style posées par les modèles (délais du mouvement, rang d'une étape de frise) deviennent des attributs style ; la documentation d'Angular indique qu'à défaut de nonce par réponse, ce qui est impossible sur un hébergement statique, il faut 'unsafe-inline' dans style-src. Le risque est faible : aucun HTML ne vient du contenu ni du visiteur, et Angular échappe les valeurs (section 7 de la conception technique). Point à valider.
- connect-src : la base de l'API de l'environnement (PF-07), seule adresse hors du site (contrat, section 1).

*Empreintes : calcul et tenue à jour.* Elles ne sont jamais écrites à la main. À chaque build, finaliser-build.mjs parcourt tous les fichiers HTML produits, relève chaque élément script en ligne exécutable (sans src, de type absent, « text/javascript » ou « module » ; les blocs de données « application/json » et « application/ld+json », que le navigateur n'exécute pas, sont ignorés), calcule l'empreinte SHA-256 du texte exact entre ses balises, encodée en base64, et écrit dans _headers l'union des empreintes trouvées, à partir de hebergement/en-tetes.modele. Le petit script de tête y entre donc automatiquement, et la moindre retouche de son texte change son empreinte au build suivant ; il en va de même pour tout script en ligne qu'Angular produirait (par exemple pour le rejeu des événements de l'hydratation, s'il est actif et s'il en écrit un). Le même script fait échouer le build si : un attribut de gestionnaire d'événement (onload, onclick…) ou une adresse « javascript: » apparaît dans un fichier HTML ; une ligne de _headers dépasse 2 000 caractères, la limite de l'hébergeur (vérifiée) ; un fichier HTML n'a pas exactement un petit script de tête. Angular est réglé pour ne pas produire de gestionnaire en ligne : optimisation des styles sans inlineCritical, dont le chargement différé des feuilles de style passe par un attribut onload. Dans les tests de bout en bout, toute erreur de console fait échouer le test, et une violation de la politique en est une : une empreinte manquante se voit dans la CI.

*Autres en-têtes* (section 7 de la conception technique), dans la même règle : X-Content-Type-Options: nosniff ; Referrer-Policy: strict-origin-when-cross-origin ; Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=() ; X-Frame-Options: DENY, pour les navigateurs qui ignoreraient frame-ancestors ; Strict-Transport-Security: max-age=31536000. Sur un build autre que la production, X-Robots-Tag: noindex (TK-44). En environnement test, upgrade-insecure-requests et Strict-Transport-Security sont retirés, le serveur local n'étant pas en HTTPS. Mise en cache : « /*.js » et « /*.css », dont Angular met l'empreinte dans le nom, et « /polices/* » reçoivent Cache-Control: public, max-age=31536000, immutable. Le fichier exact du CV reçoit une règle propre qui retire la politique de sécurité (« ! Content-Security-Policy »), pour ne pas gêner la visionneuse PDF intégrée des navigateurs ; la passe manuelle (TK-58) vérifie l'ouverture du CV sur les appareils réels.

**Raison.** Des empreintes calculées sur la sortie réelle du build restent justes quoi que produisent Angular et le script de tête, sans entretien ; une politique dans un en-tête HTTP porte aussi frame-ancestors, ce qu'une balise meta ne peut pas.

**Écarté.** Un nonce : il doit changer à chaque réponse, impossible sur un hébergement statique ; l'option autoCsp d'Angular : la documentation la déclare inutilisable avec le rendu côté serveur, et une balise meta ne porte pas frame-ancestors ; 'unsafe-inline' pour les scripts ; une empreinte tenue à la main ; une politique par page : une adresse inconnue, servie par un 404.html, n'aurait pas de politique ; les Trusted Types, que la conception technique ne demande pas et qui ajouteraient un risque de blocage du chargement des morceaux de code.

### PF-10 — Analyse statique

**Choix.** Trois outils, lancés par « npm run lint » sur chaque PR (TK-07), configurés dans front/ :

- **ESLint** avec angular-eslint, dans sa version majeure 22 (22.6.0 au 27/10/2026, faite pour Angular 22), et typescript-eslint en configuration recommandée avec vérification de types ; la configuration de base vient de la commande ng add angular-eslint, commitée telle quelle à part. Règles ajoutées : prefer-on-push-component-change-detection, prefer-standalone, prefer-signals, et la configuration d'accessibilité des modèles d'angular-eslint ; template/prefer-control-flow ; la règle i18n des modèles avec identifiant personnalisé obligatoire (PF-03) ; no-restricted-imports et no-restricted-globals : HttpClient nulle part, fetch seulement dans services/http, BehaviorSubject nulle part, Input, Output, EventEmitter, HostListener et HostBinding nulle part (entrées, sorties et liaisons d'hôte par les fonctions et la propriété host) ; dans components/ et directives/, aucun import de services/contenu ni de services métier (réutilisation, PF-01) ; no-restricted-syntax : new Date() sans argument et Date.now() interdits (MF-18).
- **Stylelint** avec la configuration standard SCSS : aucune couleur hexadécimale, nommée ou fonctionnelle hors de _jetons.scss ; « transition: all » et « transition-property: all » interdits ; motif des classes en bloc__element--variante.
- **Prettier** en vérification, avec le .prettierrc de front/ (PF-01), qui l'emporte sur celui de la racine, hérité de l'ancien site.

TypeScript en mode strict, avec les modèles stricts d'Angular (strictTemplates), complète l'analyse.

**Raison.** angular-eslint suit Angular version par version et porte les règles propres au framework (signaux, OnPush, accessibilité des modèles, traduction) ; Stylelint garde la règle « seulement des jetons » de la charte ; Prettier retire le style des relectures.

**Écarté.** Un service d'analyse en ligne : un compte tiers de plus, sans gain pour un dépôt de cette taille ; un outil tout-en-un sans règles propres à Angular ni aux modèles Angular ; TSLint, abandonné.

## Étapes de réalisation

Une étape par ticket, dans l'ordre des vagues de Tickets-V2 (section 3). Chacune applique la DoD de son ticket et la DoD commune ; elle dit ce qu'elle produit, ses tests et ce qu'un relecteur constate. Les tickets d'infrastructure n'y figurent que pour leur part dans front/.

### Étape 1 — Mise en place du front (TK-05)

- **Produit** (vague W3) : front/ créé par la commande de création de projet d'Angular 22 avec le rendu côté serveur, commité tel quel à part ; puis outputMode « static » ; app.routes.ts avec les dix adresses, chacune avec data.section, les routes techniques et la route « ** » de PF-06 ; une page provisoire étiquetée par adresse ; app.routes.server.ts en pré-rendu partout, getPrerenderParams de « projets/:id » rendant le seul identifiant portfolio jusqu'à l'étape 7, rendu client pour « ** » ; provideZonelessChangeDetection, provideClientHydration, provideRouter avec withInMemoryScrolling (restauration de la position et défilement vers les ancres) ; i18n.sourceLocale « fr », @angular/localize, lang="fr" ; optimisation des styles sans inlineCritical ; .nvmrc, .npmrc, engines, .prettierrc (PF-01) ; finaliser-build.mjs dans sa première forme, qui place les trois pages d'erreur (PF-06) ; scripts start, build et test ; README.
- **Tests** : Vitest par ng test : le composant racine se crée ; LOCALE_ID vaut « fr ».
- **Sortie vérifiable** : npm ci puis npm run build produisent dist/front/browser/ avec un index.html par adresse (parcours/index.html, projets/portfolio/index.html…), plus 404.html, projets/404.html et cv/404.html, tous en lang="fr" ; npm test est vert ; la version de Node du poste et de la CI est celle de .nvmrc.

### Étape 2 — Retrait de l'ancien site (TK-08)

- **Produit** (W4) : la suppression du dossier my-portfolio/, rien d'autre ; le .prettierrc de la racine reste, front/ ayant le sien.
- **Tests** : la CI reste verte.
- **Sortie vérifiable** : le diff de la PR ne contient que des suppressions sous my-portfolio/.

### Étape 3 — Intégration continue, part du front (TK-07)

- **Produit** (W5) : un fichier de CI GitHub Actions pour front/, déclenché par les PR vers staging et main qui touchent front/ : installation de Node depuis front/.nvmrc avec cache npm, npm ci, npm run lint (configuration de PF-10, créée ici, ng add angular-eslint dans un commit à part), npm test, npm run i18n:verifier (PF-03, avec verifier-libelles.mjs), npm run build en environnement test (PF-07 dès l'étape 8). Aucun secret, aucune variable d'hébergeur.
- **Tests** : la branche d'essai de la DoD casse un test unitaire et rend la CI rouge.
- **Sortie vérifiable** : les contrôles du front apparaissent dans la PR et sont exigés avant fusion.

### Étape 4 — Robot de mises à jour, part du front (TK-09)

- **Produit** (W6) : dans la configuration du robot, l'écosystème npm du dossier /front, chaque semaine, vers staging ; un groupe pour les paquets qui montent ensemble (paquets d'Angular et de son outillage, angular-eslint, typescript, typescript-eslint), un groupe pour l'outillage de test (Vitest, Playwright, axe-core, Lighthouse CI), les autres paquets à part ; les montées de version majeure d'Angular hors des groupes, réservées à l'entretien annuel (TK-64).
- **Tests** : une PR du robot passe par la CI de l'étape 3.
- **Sortie vérifiable** : le fichier de configuration écrit la fréquence et les groupes avec leur raison.

### Étape 5 — Jetons de la charte (TK-10)

- **Produit** (W6) : src/styles/_jetons.scss et _ruptures.scss selon PF-01, chargés par styles.scss ; fond explicite de html en couleur-fond.
- **Tests** : outils/tests/jetons.test.mjs lit _jetons.scss et vérifie que chaque nom de la liste de la charte (sections 3 et 5, recopiée dans le test) y est déclaré, avec les valeurs de PA-02 et de la révision du 27/10/2026 ; Stylelint passe.
- **Sortie vérifiable** : le test est vert ; les pages provisoires ont le fond de la charte.

### Étape 6 — Typographie, polices et mise en page de base (TK-11)

- **Produit** (W7) : public/polices/ (sous-ensembles WOFF2 et licences, PF-01) ; _polices.scss (@font-face, font-display: swap) ; _typographie.scss (dix tailles en clamp() selon l'échelle de la section 4, interlignes, approches, césure sur l'affiche et le titre 1 ; text-wrap: balance sur les titres, amélioration facultative qu'un navigateur sans prise en charge ignore) ; _base.scss (anneau de focus sur :focus-visible, cibles de 44 px) ; _utilitaires.scss (masque-visuellement, conteneurs, marges par tranche) ; préchargement des deux polices du premier écran dans index.html.
- **Tests** : un test d'outil vérifie que chaque @font-face pointe vers un fichier présent dans public/polices/ ; contrôle manuel de 320 à 2560 px et au zoom à 200 %, automatisé à l'étape 12.
- **Sortie vérifiable** : aucune requête de police vers un tiers ; un seul h1 par page ; aucun défilement horizontal.

### Étape 7 — Modèle de contenu et fichiers de contenu (TK-12)

- **Produit** (W7) : interfaces/contenu.ts ; src/contenu/fr/ selon PF-02, rempli d'emplacements étiquetés (C-01 à C-10) et de ce qui est déjà fourni (nom, intitulé, liens GitHub et LinkedIn, alternance 2025–2028, fin du master en 2028, projet portfolio avec son lien vers le code source public, nom du CV dès que A-07 le donne) ; les quatre étapes de démonstration de la méthode et leurs illustrations de démonstration ; contenu-langue.ts ; generer-index-contenu.mjs ; services/contenu/ ; getPrerenderParams lit l'index.
- **Tests** : unitaires de la couche d'accès avec les contenus de test de testing/ (tri par rang, champs facultatifs absents, catégorie vide retirée, valeur fermée inconnue refusée, langue) ; test d'outil du générateur (un fichier ajouté entre dans l'index, ordre stable, cvPresent).
- **Sortie vérifiable** : npm run build produit projets/portfolio/index.html depuis projets/portfolio.json ; aucune page ne contient de HTML venu du contenu.

### Étape 8 — Hébergement du front et préversions (TK-13)

- **Produit** (W8) : front/wrangler.jsonc (PF-08) ; hebergement/en-tetes.modele et l'écriture de _headers par finaliser-build.mjs, avec ses contrôles (PF-09) ; ecrire-configuration.mjs (PF-07) ; chez Cloudflare (A-03) : répertoire racine front/, commande de build npm run build, les variables de build de PF-07, préversion par branche, préproduction depuis staging.
- **Tests** : tests d'outil : empreintes calculées sur un HTML d'essai, script en ligne non autorisé, attribut de gestionnaire d'événement et ligne trop longue qui font échouer, build de production sans variable qui échoue, consigne de non-indexation absente en production et présente ailleurs.
- **Sortie vérifiable** : sur une préversion, /parcours en 200 sans redirection, /parcours/ en 307 vers /parcours, une adresse inconnue en 404 avec la page provisoire, /projets/identifiant-inconnu en 404 avec sa variante ; les en-têtes de PF-09 présents ; aucune violation de politique dans la console ; chaque adresse rechargée affiche la même page.

### Étape 9 — Composants bouton et lien (TK-15)

- **Produit** (W9) : components/bouton, components/lien et components/icone (PF-01) ; le lien externe pose target="_blank", rel="noopener noreferrer", l'icône flèche oblique et le texte masqué « (nouvel onglet) », marqué pour la traduction ; la page courante est portée par aria-current.
- **Tests** : unitaires de chaque variante, des attributs d'accessibilité et des cibles de 44 px.
- **Sortie vérifiable** : une page provisoire montre chaque variante ; axe-core ne relève rien.

### Étape 10 — Composants de texte (TK-17)

- **Produit** (W10) : pastille, etiquette (le filet de l'étiquette numérotée est l'élément que MV-05 animera), entete-section (vrai titre de la hiérarchie, niveau en entrée, chapô projeté plafonné à conteneur-texte), liste-cle-valeur (liste de définitions, valeurs de période en police-mono, paire retirée quand la valeur manque).
- **Tests** : unitaires des variantes et de la structure accessible.
- **Sortie vérifiable** : la variante à contour est la seule employée sur le verre et sur un halo.

### Étape 11 — Composants de formulaire et d'état (TK-19)

- **Produit** (W11) : components/champ (libellé visible et lié, variantes ligne, e-mail avec clavier adapté, zone de texte ; erreur liée par aria-describedby, aria-invalid ; required ; état désactivé pendant l'envoi), lié à un champ de Signal Forms, l'API de formulaires par signaux d'Angular, stable depuis la 22.0 (vérifié) ; components/message-etat (role="status" pour information, envoi en cours, succès et attention ; role="alert" pour l'échec ; aucune disparition automatique ; action projetée) ; components/indicateur-activite (aria-hidden, fixe sous réduction) ; état enCours du bouton (indicateur et libellé « Envoi en cours… »).
- **Tests** : unitaires des états et des attributs d'accessibilité.
- **Sortie vérifiable** : les états de la composition de formulaire du catalogue sont reproduits sur une page provisoire.

### Étape 12 — Banc de tests de bout en bout et d'accessibilité (TK-21)

- **Produit** (W12) : e2e/ : configuration Playwright à six profils (Chromium, Firefox et WebKit en profil ordinateur ; Chromium et WebKit en émulation de téléphone par les descripteurs d'appareil de Playwright ; Firefox à la taille d'un téléphone, 390 × 844, par la seule taille de fenêtre), serveur web = npm run serveur-local sur le build de test ; spécification de conformité du serveur local (PF-08) ; contrôle commun appliqué à chaque adresse du plan du site : axe-core sur les règles A et AA, largeurs 320, 600, 900, 1200, 1600 et 2560 px sans défilement horizontal, aucune requête hors de l'origine du serveur local, aucune erreur de console (donc aucune violation de politique) ; back simulé par interception (PF-08) ; tâche de CI qui lance le tout sur chaque PR qui touche front/.
- **Tests** : les pages provisoires passent le contrôle commun ; la spécification de conformité passe, sinon le repli de PF-08 est écrit dans cette étape.
- **Sortie vérifiable** : npm run e2e est vert en local et dans la CI, sur les six profils.

### Étape 13 — Socle du mouvement (TK-23)

- **Produit** (W13) : le petit script de tête dans src/index.html ; services/mouvement/ (MouvementService, fonctions pures, reglages.ts) et services/defilement ; démarrage dans afterNextRender du composant racine ; src/styles/_mouvement.scss avec ses règles de base (PF-04) ; l'empreinte du script entre dans _headers par le build (PF-09).
- **Tests** : unitaires des fonctions pures (cascade : premier élément à 120 ms, sixième à 470 ms) et du mode d'arrivée ; bout en bout dans les trois cas de la DoD : JavaScript désactivé, fichier principal de l'application bloqué (route abandonnée), fichier principal remplacé par un script qui lève une erreur : tout le contenu est visible, au plus 3 s après l'arrivée dans les deux derniers cas ; animations réduites (emulateMedia) : mv-actif absent, défilement doux coupé.
- **Sortie vérifiable** : aucune violation de politique ; l'empreinte du script de tête figure dans _headers sans avoir été écrite à la main.

### Étape 14 — Composant fenêtre factice (TK-25)

- **Produit** (W14) : components/fenetre : barre à trois points avec titre en chasse fixe ou barre d'adresse factice ; variante code (lignes de segments colorés : mot-clé en accent, chaîne en accent secondaire, commentaire en texte discret ; retour à la ligne, jamais de défilement horizontal) ; variante navigateur (contenu projeté) ; variante capture (image 16:10 par NgOptimizedImage, dimensions et texte alternatif) ; entrée decorative selon PF-05 ; rien n'est rendu sans contenu.
- **Tests** : unitaires des variantes, du cas sans contenu et de decorative (aria-hidden posé ou texte exposé en un seul nœud).
- **Sortie vérifiable** : jamais de cadre vide.

### Étape 15 — Composants carte et arrière-plan d'ambiance (TK-26)

- **Produit** (W14) : components/carte : variantes verre, pleine, interactive (un seul lien, porté par le titre ; le lien d'action du pied décoratif et sans clic propre ; calque d'ombre et calque de lueur rendus par le modèle, prêts pour MV-06) ; components/ambiance : variantes accueil, section, sobre, avec calques de halo (aria-hidden), trame et voile bas de la révision du 27/10/2026 ; la règle « une carte interactive ne se pose jamais sur un halo » écrite dans la documentation du composant.
- **Tests** : unitaires des variantes, du cas sans contenu facultatif et de la variante de pastille sur le verre.
- **Sortie vérifiable** : axe-core ne relève rien sur une page d'essai des deux composants.

### Étape 16 — En-tête, navigation et lien d'évitement (TK-27)

- **Produit** (W15) : layout/entete et layout/lien-evitement ; services/navigation, qui expose en signal la section courante lue dans data.section (PF-06) ; marque : monogramme « AM » décoratif sous 480 px, nom en masque-visuellement dans le lien, lien élargi à 44 px ; navigation complète à partir de 1200 px ; « CV » et « Contact » toujours hors du menu ; fond à 74 % avec flou à partir de 900 px, 92 % en dessous et quand le flou n'est pas pris en charge (@supports) ; le repère de page courante est un élément propre rendu dans le seul lien courant (PF-04, MV-07).
- **Tests** : unitaires de la section courante et d'aria-current ; bout en bout SC-2.0-02, SC-2.0-03 et SC-2.0-04 depuis chaque adresse.
- **Sortie vérifiable** : le lien d'évitement est le premier élément focalisable ; aucune entrée signalée sur /mentions-legales et sur une adresse inconnue.

### Étape 17 — Contrôle automatique du contenu (TK-28)

- **Produit** (W15) : outils/controle-contenu/ selon PF-02, avec ses deux modes ; la tâche de CI qui le lance, en mode staging ou main selon la branche visée ; la règle no-restricted-syntax de PF-10 sur la date du jour.
- **Tests** : un jeu d'essai fautif par règle et un jeu correct (outils/tests/), tous verts.
- **Sortie vérifiable** : sur une PR vers staging, les emplacements étiquetés sortent en avertissements et la CI reste verte ; le même contenu en mode main fait échouer la commande.

### Étape 18 — Menu replié (TK-29)

- **Produit** (W16) : layout/menu-replie sur details et summary, utilisable avant le démarrage de l'application et sans script ; le résumé est le bouton icône « Menu » (libellé masqué), avec aria-controls vers le panneau ; dans le navigateur, Échap ferme le panneau et rend le focus au bouton, choisir une section ou cliquer hors du panneau le ferme ; panneau pleine largeur sur téléphone, 320 px aligné à droite à partir de 600 px ; section courante signalée (fond d'accent à 16 % et barre de 3 px).
- **Tests** : unitaires de la fermeture ; bout en bout en émulation de téléphone : ouverture, choix d'une section, arrivée, aucun défilement horizontal (SC-2.0-04, SC-2.0-09).
- **Sortie vérifiable** : le menu est présent sur toutes les pages, page introuvable comprise ; le CV et le contact restent à côté.

### Étape 19 — Pied de page (TK-30)

- **Produit** (W16) : layout/pied : liens GitHub et LinkedIn lus dans profil.json (lien externe de l'étape 9), lien des mentions légales, signature sans année (la marque et le nom de domaine tiré d'origineSite, PF-07), place réservée du bouton de pause.
- **Tests** : bout en bout SC-2.0-27 (cibles, nouvel onglet, aucun lien vers X) et SC-2.0-29 sur chaque page.
- **Sortie vérifiable** : liens de 44 px de haut ; une rangée par ligne sur téléphone.

### Étape 20 — Mentions légales et page introuvable (TK-31)

- **Produit** (W17) : pages/mentions-legales, qui lit textes-legaux.json (emplacements jusqu'à l'étape 34) ; pages/erreur et ses trois variantes, guards/projet-existe, routes et fichiers de PF-06 ; consigne de non-indexation.
- **Tests** : unitaires des variantes, par les données de route et par l'adresse ; bout en bout via le serveur local : /mentions-legales ouverte puis rechargée (SC-2.0-05, SC-2.0-29), adresse inconnue (SC-2.0-08) et projet inexistant (SC-2.0-07), chacun en 404, avec le message, la navigation et les retours.
- **Sortie vérifiable** : aucune erreur d'hydratation dans la console sur /projets/identifiant-inconnu ; aucune entrée de navigation signalée.

### Étape 21 — Composant frise chronologique (TK-32)

- **Produit** (W17) : components/frise : liste ordonnée ; une étape par période (point décoratif, période par formaterPeriode, intitulé, détail facultatif) ; états accomplie, mise en avant (texte masqué « (étape mise en avant) ») et prévue ; verticale sous 900 px, horizontale au-delà, étapes alignées en haut ; trait entier jusqu'à l'étape mise en avant (état sans mouvement).
- **Tests** : unitaires de l'ordre, des formats (MM/AAAA et années seules), des états ; aucune date calculée.
- **Sortie vérifiable** : aucun texte grisé.

### Étape 22 — Écran Accueil (TK-33)

- **Produit** (W18) : pages/accueil dans l'ordre de lecture de la DoD, avec l'arrière-plan d'ambiance d'accueil ; fragments/profil-code (PF-05) ; fragments/cartes-sections, cinq cartes interactives sur fond uni, hors des halos, la carte « Expérience » ouvrant sur « Alternance chez <entreprise>, <période>. » ; texte et fenêtre côte à côte à partir de 1200 px, l'un sous l'autre en dessous, fenêtre absente sous 600 px.
- **Tests** : unitaire de recouvrement de PF-05 ; bout en bout SC-2.0-01, SC-2.0-02, chaque carte vers sa section, instantané de l'arbre d'accessibilité.
- **Sortie vérifiable** : un seul h1, le nom ; aucun texte de « profil.ts » dans l'arbre d'accessibilité.

### Étape 23 — Écran Parcours (TK-34)

- **Produit** (W18) : pages/parcours : en-tête de section et phrase d'introduction (C-10), bloc « Orientation » (C-09), frise des trois étapes de parcours.json.
- **Tests** : bout en bout SC-2.0-10, SC-2.0-11, /parcours ouvert puis rechargé (SC-2.0-05) ; un emplacement étiqueté s'affiche tel quel tant que C-01 manque.
- **Sortie vérifiable** : ordre reconversion, bac+3, master ; aucune date inventée ni vide.

### Étape 24 — Écran Compétences (TK-35)

- **Produit** (W19) : pages/competences : titre seul (C5), catégories techniques triées par rang, compétences humaines puis récit de reconversion (C-07) ; aucun niveau ; compétence longue qui passe à la ligne.
- **Tests** : bout en bout SC-2.0-12, SC-2.0-13, SC-2.0-05 et l'état « catégorie vide » avec un contenu de test.
- **Sortie vérifiable** : une catégorie vide n'apparaît pas.

### Étape 25 — Écran Expérience (TK-36)

- **Produit** (W19) : pages/experience : titre seul (C5), liste clé-valeur en ligne « Alternance · <entreprise> » et « Période · 2025–2028 » en chasse fixe (C6), trois volets (C-08), mention de confidentialité ; tout vient d'experience.json.
- **Tests** : bout en bout SC-2.0-14 et SC-2.0-05.
- **Sortie vérifiable** : relecture du diff : aucun projet, client, outil interne, dépôt ni collègue.

### Étape 26 — Écran Fiche d'un projet (TK-37)

- **Produit** (W20) : pages/projet, pré-rendue pour chaque identifiant de l'index ; titre, description, captures (fenêtres variante capture, chargement à la demande) seulement s'il y en a, lien vers le code source (externe) seulement s'il existe, « ← Retour à la liste des projets », flèche avant le texte (C7) ; data.section « projets ».
- **Tests** : unitaires avec trois projets de test, complet, sans lien, sans capture (SC-2.0-16 à SC-2.0-18) ; bout en bout SC-2.0-06, SC-2.0-32, SC-2.0-03.
- **Sortie vérifiable** : sans capture, aucune zone vide ; « Projets » signalé.

### Étape 27 — Écran CV (TK-38)

- **Produit** (W20) : pages/cv : « Consulter le CV » (lien externe vers le fichier, nouvel onglet) et « Télécharger le CV » (attribut download) ; au premier clic sur « Télécharger », l'action passe 3 secondes en « Téléchargement en cours… » avec l'indicateur, aria-disabled et sans adresse, comme sur la maquette, puis revient (proposition, à valider : le navigateur ne signale pas la fin d'un téléchargement) ; si cvPresent est faux au build, la page affiche l'état « CV indisponible » (fragment cv-indisponible) ; cv/404.html (PF-06) couvre le fichier manquant à l'exécution ; actions larges et espacées sur téléphone.
- **Tests** : bout en bout avec un fichier de test placé sous le nom du CV dans le seul espace de travail de la CI, jamais commité : SC-2.0-21 (fichier reçu, nom conforme) ; SC-2.0-22 : une adresse de fichier absent sous /cv/ répond 404 avec la page du CV indisponible ; SC-2.0-05 ; unitaire de l'état indisponible.
- **Sortie vérifiable** : un double clic ne lance qu'un téléchargement.

### Étape 28 — Écran Liste des projets (TK-39)

- **Produit** (W21) : pages/projets : titre seul (C5), une carte interactive par projet sur toute la largeur, texte à gauche et vignette décorative en fenêtre factice à droite, sous le texte sur téléphone (C2) ; sans vignette, aucun cadre ; message de liste vide ; mention de confidentialité toujours affichée ; aucune carte sur un halo.
- **Tests** : bout en bout en profils ordinateur et téléphone : SC-2.0-15, SC-2.0-05, états « plusieurs projets », « sans vignette » et « liste vide » avec des contenus de test.
- **Sortie vérifiable** : le titre d'un projet n'est jamais coupé.

### Étape 29 — Écran Méthode de travail (TK-40)

- **Produit** (W21) : pages/methode : titre seul (C5), fragments/recit-methode dans sa présentation sans mouvement (chaque étape avec son intitulé, son texte et son illustration dessous) ; le renvoi « La méthode appliquée » vers /projets/portfolio, retiré au build si le projet n'existe pas (V-09).
- **Tests** : bout en bout SC-2.0-31 (texte, puis renvoi suivi jusqu'à la fiche), SC-2.0-05, état « renvoi vers un projet absent » avec un contenu de test.
- **Sortie vérifiable** : quatre étapes de démonstration étiquetées tant que C-04 manque.

### Étape 30 — Écran Contact : formulaire et validation (TK-41)

- **Produit** (W22) : pages/contact et fragments/formulaire-contact : un modèle Signal Forms aux cinq champs (et au champ piège, branché à l'étape 32) ; « Tous les champs sont obligatoires. » ; nom et prénom côte à côte quand la place le permet ; validation par des fonctions pures qui appliquent la section 3 du contrat à l'identique : retrait des 25 espaces de bord de la propriété Unicode White_Space (classe \p{White_Space}, drapeau u, jamais trim()), longueur en unités UTF-16, une seule raison par champ dans l'ordre required, too-long, line-break, invalid-email, adresse au format « valid e-mail address » du HTML avec un point après l'arobase, en ASCII ; contrôle au clic seulement, bouton jamais désactivé pour un formulaire incomplet, novalidate pour ne pas dépendre des bulles du navigateur, aucun maxlength (rien n'est tronqué en silence) ; message sous le champ, focus sur le premier champ en faute, saisie conservée ; libellés des quatre raisons (contrat, section 4) marqués pour la traduction ; information sur les données (emplacement étiqueté D-10) placée avant le bouton ; à partir de 1200 px, titre et information collants à gauche sous l'en-tête, formulaire à droite (C1) ; formulaire en POST qui n'envoie rien avant l'étape 32.
- **Tests** : unitaires de la validation sur chaque cas limite du contrat (espaces Unicode, U+2028, émoji compté pour deux, domaine sans point) ; bout en bout SC-2.0-24, SC-2.0-25, SC-2.0-30, SC-2.0-09, SC-2.0-05.
- **Sortie vérifiable** : « Ce champ est obligatoire. » et « L’adresse e-mail n’est pas valide. » au caractère près.

### Étape 31 — Client du contrat d'API (TK-42)

- **Produit** (W22) : interfaces/contact.ts (les propriétés du contrat, en anglais) ; services/http (PF-07) ; services/contact-api, qui implémente E-01 et E-02 et rend un résultat fermé : succès (202), refus avec les erreurs par champ (400 et validationErrors connu), échec réessayable (tout le reste, dont un 400 aux clés ou aux codes inconnus) ; l'aide extractValidationErrors(error), qui lit validationErrors au format du contrat et pose chaque erreur dans le signal d'erreur du champ, et l'aide du message lisible, qui traduit un code de raison et n'affiche jamais error ni message du back ; services/envoi-contact, l'état de l'envoi en signaux (repos, envoi-en-cours, succes, echec) : jeton demandé à la première interaction, sans délai d'abandon avant le clic, gardé en mémoire avec son heure de réception sur l'horloge monotone (performance.now), tenu pour périmé à réception plus expiresInSeconds moins 60 s ; au clic, échéance à 90 s (constante du front, D-07) ; attente du jeton en cours ou nouvelle demande, puis du délai minimal compté depuis la réception, puis E-02 ; tout abandonné à l'échéance par AbortController ; jeton oublié après un succès ou un échec, gardé après un refus de validation.
- **Tests** : unitaires avec un faux fetch fourni par le jeton d'injection de services/http, qui répond selon le contrat, et les minuteries simulées de Vitest (performance comprise) ; vérification des en-têtes et de credentials: "omit" de chaque appel ; cas : jeton à l'heure, jeton en retard puis succès, délai minimal respecté, échéance de 90 s, refus de validation, 503, coupure réseau, jeton périmé renouvelé.
- **Sortie vérifiable** : aucun envoi sans jeton ni avant le délai minimal dans aucun test.

### Étape 32 — Envoi du formulaire et ses états (TK-43)

- **Produit** (W23) : le formulaire branché sur services/envoi-contact : première interaction (focus ou saisie d'un des cinq champs) qui demande le jeton ; envoi en cours (bouton inactif avec l'indicateur, champs désactivés et lisibles, message « L'envoi peut prendre jusqu'à 90 secondes. Votre saisie est conservée. ») ; succès (confirmation, champs vidés) ; échec réessayable (saisie conservée, « Réessayer ») ; message sous le bouton jusqu'à la prochaine action ; champ piège « website » dans un conteneur inert et aria-hidden, placé hors de l'écran, tabindex="-1" et autocomplete="off", envoyé avec sa valeur réelle.
- **Tests** : bout en bout avec le back simulé, en profils ordinateur et téléphone : succès, jeton reçu en retard puis confirmation, échec, attente longue jusqu'à l'échec à 90 s (horloge de Playwright), refus de la protection affiché comme un échec ; le champ piège absent de l'arbre d'accessibilité et de la tabulation.
- **Sortie vérifiable** : depuis la préproduction du front, le formulaire obtient un jeton du back de préproduction, constaté à la main.

### Étape 33 — Plan du site, robots.txt et non-indexation des préversions (TK-44)

- **Produit** (W23) : dans finaliser-build.mjs, sitemap.xml produit depuis la liste des pages construites (toutes les index.html, sauf les pages d'erreur), en adresses absolues sur origineSite (www, D-08), sans barre finale ; robots.txt, nommé exactement ainsi, à la racine, qui l'annonce ; X-Robots-Tag: noindex dans _headers hors production (PF-09).
- **Tests** : test d'outil (un projet ajouté entre dans le plan ; les pages d'erreur n'y sont pas) ; bout en bout : robots.txt servi en texte, sitemap.xml en XML, consigne de non-indexation présente sur le build de test.
- **Sortie vérifiable** : sur la préversion, l'en-tête de non-indexation est présent ; il est absent du build de production (test d'outil).

### Étape 34 — Textes légaux et information sur les données (TK-45)

- **Produit** (W24) : textes-legaux.json rédigé sur la base de CT-12, après vérification des points « à vérifier » sur les pages publiques des prestataires, sources citées dans la PR ; les libellés de la page introuvable et du CV indisponible finalisés ; validation d'Alexandre dans la PR (A-13).
- **Tests** : bout en bout SC-2.0-29 et SC-2.0-30 sur les textes finaux ; le contrôle du contenu ne relève aucune tournure qui se périme.
- **Sortie vérifiable** : aucune adresse ni aucun téléphone personnels ; aucune adresse e-mail.

### Étape 35 — Balises de référencement et aperçu au partage (TK-46)

- **Produit** (W24) : services/referencement, qui pose au pré-rendu et à chaque navigation, sans doublon : le titre (« <titre de la page> · Alexandre Morozoff » ; sur l'accueil, le nom et l'intitulé), la description (libellé marqué, ou description courte d'un projet), l'adresse canonique sur origineSite, les quatre propriétés Open Graph et la carte d'aperçu ; sur l'accueil, les données structurées schema.org « Person » (nom, intitulé, adresse du site, profils GitHub et LinkedIn lus dans le contenu) dans un bloc de données, non exécuté, hors des empreintes ; public/images/apercu-partage.png de 1200 × 630 px, sur le modèle de la maquette apercu-partage.
- **Tests** : bout en bout : présence et unicité de chaque balise sur chaque page, données « Person » bien formées.
- **Sortie vérifiable** : le HTML pré-rendu porte les balises sans exécuter de script.

### Étape 36 — Test d'ajout d'un projet (TK-47)

- **Produit** (W25) : une tâche de CI qui construit le site deux fois, sans puis avec un projet de test (e2e/fixtures/projet-test/ : un JSON et un dossier d'images, copiés dans l'espace de travail de la CI seulement), puis compare les pages : le projet entre dans la liste, sa fiche porte ses informations et s'ouvre par son lien direct, il entre dans le plan du site ; toutes les autres pages sont identiques une fois retirées les références aux fichiers de code et de style, dont le nom change avec leur empreinte puisque le contenu est embarqué (PF-02) ; README : ce qu'Alexandre fournit pour un projet et ce que contient la PR d'ajout.
- **Tests** : la tâche elle-même ; un test d'outil de la normalisation des pages.
- **Sortie vérifiable** : le projet de test n'existe dans aucun commit.

### Étape 37 — Apparitions en cascade (TK-48)

- **Produit** (W25) : directives appMvBloc et appMvApparition (PF-04, MV-01) posées sur les blocs de chaque écran, jamais sur l'en-tête ni sur le pied.
- **Tests** : unitaires de l'inscription et des délais ; bout en bout : défilement jusqu'en bas aussitôt la page ouverte, aucun bloc caché ; retour arrière et restauration depuis le cache du navigateur sans rejeu ; aucun décalage cumulé ; actions de l'accueil en place avant 2 s ; trois cas sans mouvement de l'étape 13.
- **Sortie vérifiable** : sous animations réduites, aucun élément n'a d'opacité nulle.

### Étape 38 — Contrôles de mise en production, part du front (TK-49)

- **Produit** (W26) : rien de neuf dans front/ ; le contrôle s'appuie sur ce que le front sert déjà : pages clés en 200, adresse inconnue en 404 avec le titre « Cette page n'existe pas », robots.txt en texte et sitemap.xml en XML.
- **Tests** : le contrôle passe sur la préproduction du front.
- **Sortie vérifiable** : le titre de la page introuvable est stable, repéré par le contrôle.

### Étape 39 — Halos qui respirent et pause des animations (TK-50)

- **Produit** (W26) : la respiration des halos en CSS et le composant pause-animations du pied (PF-04, MV-04).
- **Tests** : bout en bout : mise en pause, navigation, état conservé ; stockage local indisponible (script d'initialisation qui le fait lever) sans erreur ; bouton absent sous animations réduites et sans script ; opacité calculée d'un halo jamais au-delà de sa valeur de charte.
- **Sortie vérifiable** : le libellé change, aucun aria-pressed.

### Étape 40 — Tracés et survols vivants (TK-51)

- **Produit** (W27) : directives appMvTrace et appMvLueur, règles de survol et de focus dans _mouvement.scss (PF-04, MV-05, MV-06).
- **Tests** : unitaires des délais des tracés ; bout en bout : survol d'une carte à la souris (soulèvement, lueur visible sous le texte), focus clavier sans lueur, axe-core sans violation pendant un survol.
- **Sortie vérifiable** : sans script, la lueur est absente et le soulèvement demeure.

### Étape 41 — Transitions entre pages (TK-52)

- **Produit** (W27) : withViewTransitions et son rappel, view-transition-name de l'en-tête et du repère, animations de ::view-transition-old(root) et ::view-transition-new(root) (PF-04, MV-07).
- **Tests** : bout en bout sur les trois moteurs : navigation sans erreur ; retour arrière sans fondu ni page effacée ; clic avec modificateur, lien externe et téléchargement non interceptés ; animations réduites : navigation immédiate.
- **Sortie vérifiable** : la PR note la prise en charge réelle de Chrome, Edge, Firefox et Safari à sa date (tableau de PF-04 mis à jour).

### Étape 42 — Frise tracée au défilement (TK-53)

- **Produit** (W28) : directive appMvFrise et ses règles (PF-04, MV-02).
- **Tests** : unitaires de l'inversion de courbe (un point au quart vers 500 ms, aux trois quarts vers 660 ms) et de la progression ; bout en bout : frise visible d'un coup ; frise plus haute que la fenêtre en profil téléphone, qui ne recule plus une fois l'étape mise en avant atteinte ; retour arrière, trait posé d'emblée.
- **Sortie vérifiable** : le point de l'étape mise en avant est toujours allumé.

### Étape 43 — Fenêtre « profil.ts » qui s'écrit et titre révélé (TK-54)

- **Produit** (W28) : rendu caractère par caractère de profil-code, directive appMvEcriture et curseur ; mots du nom et de l'intitulé, directive appMvMot, constante REVELATION_NOM_ACCUEIL (PF-04, MV-03, MV-10).
- **Tests** : unitaires du minutage (sous 5 s sur le vrai contenu) et des délais des mots ; bout en bout : texte complet après l'écriture, titre lu d'un seul tenant (instantané de l'arbre d'accessibilité), aucun décalage de mise en page ; la constante à « immediat » rend le nom visible sans script de mouvement.
- **Sortie vérifiable** : sans animation et sans script, code écrit et titre affichés d'emblée.

### Étape 44 — Récit au défilement de la méthode (TK-55)

- **Produit** (W29) : scène de recit-methode et directive appMvRecit (PF-04, MV-08).
- **Tests** : bout en bout : changement d'étape au défilement (étape active à 40 % de la hauteur), barre qui avance, présentation réduite sous animations réduites et sans script.
- **Sortie vérifiable** : aucun nœud déplacé : aucune erreur d'hydratation sur /methode.

### Étape 45 — Intégration des contenus d'Alexandre (TK-65)

- **Produit** (W29) : chaque emplacement C-01 à C-10 remplacé par le contenu fourni (A-11), tel quel ; le CV dans public/cv/ sous le nom de A-07 ; la vignette et les captures du portfolio en WebP, dimensions déclarées, texte alternatif pour chaque capture (A-12) ; les étapes de la méthode C-04 à la place des étapes de démonstration ; la CI passe le contrôle du contenu en mode main sur toutes les PR.
- **Tests** : contrôle du contenu en mode main vert ; bout en bout SC-2.0-21 sur le vrai fichier ; toutes les suites vertes.
- **Sortie vérifiable** : aucune chaîne « [C- » ni dans src/contenu/ ni dans les pages construites.

### Étape 46 — Redirection des anciennes adresses (TK-56)

- **Produit** (W30) : public/_redirects avec les cibles validées par Alexandre (A-14), en 301, chaque ancienne adresse écrite avec et sans barre finale : /about vers /parcours, /arcade vers /projets, /competence/* vers /projets.
- **Tests** : bout en bout via le serveur local : chaque ancienne adresse redirige puis affiche la page cible ; une autre ancienne adresse répond 404 ; la spécification de conformité de PF-08 couvre désormais _redirects.
- **Sortie vérifiable** : le fichier de redirections ne contient aucun hôte.

### Étape 47 — Illustrations de la méthode (TK-66)

- **Produit** (W30) : une illustration définitive par étape de C-04, dessinée en SVG avec les seuls jetons de la charte, abstraite, sur la composition des illustrations de démonstration (pièces recit__piece, barres et schéma tracé avec pathLength="1"), dans fragments/illustrations-methode/ et son registre ; décorative quand elle répète le texte de son étape, sinon avec un texte alternatif.
- **Tests** : bout en bout : une illustration par étape, changement au défilement, présentation réduite.
- **Sortie vérifiable** : relecture du diff : aucun document interne, client, projet, outil interne ni dépôt d'entreprise.

### Étape 48 — Budget de performance et mesure au lot des écrans (TK-57)

- **Produit** (W31) : lighthouserc.json : chaque adresse du plan du site, servie par le serveur local (PF-08), profil mobile, trois mesures par adresse (médiane), assertions : score de performance d'au moins 0,9, plus grand élément affiché en 2 500 ms au plus, décalage cumulé de 0,1 au plus ; rapports gardés comme artefacts de la CI, jamais envoyés à un stockage tiers ; une tâche de CI.
- **Tests** : la mesure elle-même ; si le titre révélé fait dépasser le seuil de l'accueil, REVELATION_NOM_ACCUEIL passe à « immediat » et la mesure est refaite ; tout autre dépassement donne une issue de type bug.
- **Sortie vérifiable** : les résultats par adresse sont notés dans la PR ; le build ne contient aucun script tiers ni bibliothèque d'animation.

### Étape 49 — Passe manuelle avant la recette, part du front (TK-58)

- **Produit** (W32) : les contrôles manuels de la DoD, plus ce que l'automate ne voit pas : sur un iPhone et un téléphone Android réels, transition entre pages, pause des animations, écriture de « profil.ts » à partir de 600 px en paysage, réglage « réduire les animations » du système, ouverture du CV dans la visionneuse du téléphone (PF-09) ; parcours complet au clavier, focus toujours visible.
- **Tests** : la passe elle-même, consignée.
- **Sortie vérifiable** : chaque défaut est une issue de type bug.

### Étape 50 — Production et bascule de la v2.0.0, part du front (TK-59)

- **Produit** (W33) : rien de neuf dans front/ ; chez Cloudflare, la production construite depuis main avec PORTFOLIO_BASE_API_PRODUCTION et PORTFOLIO_ORIGINE_SITE (PF-07) ; www et le domaine nu rattachés, le domaine nu redirigeant vers www (D-08).
- **Tests** : les contrôles de TK-49 sur la production.
- **Sortie vérifiable** : en production, pas d'en-tête de non-indexation, adresse canonique sur www, politique de sécurité avec la base de l'API de production.

## Correspondance avec les tickets

| Ticket | Étape(s) du plan | Décisions utilisées |
| --- | --- | --- |
| TK-05 | Étape 1 | PF-01, PF-03, PF-06, PF-09 |
| TK-07 | Étape 3 | PF-01, PF-03, PF-07, PF-10 |
| TK-08 | Étape 2 | PF-01 |
| TK-09 | Étape 4 | PF-01 |
| TK-10 | Étape 5 | PF-01, PF-10 |
| TK-11 | Étape 6 | PF-01 |
| TK-12 | Étape 7 | PF-02, PF-03 |
| TK-13 | Étape 8 | PF-06, PF-07, PF-08, PF-09 |
| TK-15 | Étape 9 | PF-01, PF-03 |
| TK-17 | Étape 10 | PF-01 |
| TK-19 | Étape 11 | PF-01, PF-03 |
| TK-21 | Étape 12 | PF-07, PF-08, PF-09 |
| TK-23 | Étape 13 | PF-04, PF-09 |
| TK-25 | Étape 14 | PF-01, PF-05 |
| TK-26 | Étape 15 | PF-01, PF-04 |
| TK-27 | Étape 16 | PF-01, PF-04, PF-06 |
| TK-28 | Étape 17 | PF-02, PF-10 |
| TK-29 | Étape 18 | PF-01 |
| TK-30 | Étape 19 | PF-01, PF-07 |
| TK-31 | Étape 20 | PF-02, PF-06 |
| TK-32 | Étape 21 | PF-01, PF-03 |
| TK-33 | Étape 22 | PF-02, PF-05 |
| TK-34 | Étape 23 | PF-02, PF-03 |
| TK-35 | Étape 24 | PF-02 |
| TK-36 | Étape 25 | PF-02 |
| TK-37 | Étape 26 | PF-02, PF-06 |
| TK-38 | Étape 27 | PF-02, PF-06, PF-09 |
| TK-39 | Étape 28 | PF-02 |
| TK-40 | Étape 29 | PF-02 |
| TK-41 | Étape 30 | PF-01, PF-03 |
| TK-42 | Étape 31 | PF-07 |
| TK-43 | Étape 32 | PF-07, PF-08 |
| TK-44 | Étape 33 | PF-07, PF-09 |
| TK-45 | Étape 34 | PF-02, PF-03 |
| TK-46 | Étape 35 | PF-03, PF-07, PF-09 |
| TK-47 | Étape 36 | PF-02 |
| TK-48 | Étape 37 | PF-04 |
| TK-49 | Étape 38 | PF-06, PF-08 |
| TK-50 | Étape 39 | PF-04, PF-09 |
| TK-51 | Étape 40 | PF-04 |
| TK-52 | Étape 41 | PF-04 |
| TK-53 | Étape 42 | PF-04 |
| TK-54 | Étape 43 | PF-04, PF-05 |
| TK-55 | Étape 44 | PF-04 |
| TK-56 | Étape 46 | PF-08 |
| TK-57 | Étape 48 | PF-04, PF-08 |
| TK-58 | Étape 49 | PF-04, PF-09 |
| TK-59 | Étape 50 | PF-07, PF-09 |
| TK-60 | aucune (après la v2.0.0) | PF-02, PF-03 |
| TK-65 | Étape 45 | PF-02 |
| TK-66 | Étape 47 | PF-02, PF-04 |

## Points à valider par Alexandre

- **Gestionnaire de paquets (PF-01)** : npm au lieu du pnpm des conventions de front. Raisons : la règle des 400 lignes de Tickets-V2, signée, exclut package-lock.json ; Corepack n'est plus livré avec Node depuis la v25, donc pnpm demanderait une installation de plus dans la CI et chez l'hébergeur ; la commande de création d'Angular et le robot de mises à jour le prennent sans réglage. Recommandation : accepter npm.
- **Version de Node (PF-01)** : la règle de CT-02 s'applique au jour de TK-05 sans revenir vers Alexandre : Node 26 si nodejs.org la donne en LTS (passage prévu le 28/10/2026 au calendrier officiel, encore « Current » le 27/10/2026), sinon Node 24. Recommandation : confirmer que TK-05 tranche seul par cette règle.
- **Styles en ligne dans la politique de sécurité (PF-09)** : style-src garde 'unsafe-inline', sans lequel les styles qu'Angular écrit dans les pages pré-rendues seraient bloqués ; les scripts restent stricts, autorisés par empreinte. Recommandation : accepter.
- **Politique retirée sur le seul fichier du CV (PF-09)** : pour que la visionneuse PDF intégrée des navigateurs ne soit pas gênée ; vérifié à la passe manuelle. Recommandation : accepter.
- **Vignette décorative (PF-02)** : la maquette EC-06, approuvée, masque la vignette aux lecteurs d'écran ; la DoD (4) de TK-65 et la tâche A-12 demandent un texte alternatif « pour chacune », vignette comprise. Le plan suit la maquette : la vignette n'a pas de texte alternatif, la DoD (4) de TK-65 se lit pour les captures. Recommandation : accepter cette lecture.
- **Repli du titre de l'accueil (PF-04, MV-10)** : la charte dit que le titre « partira sans délai » ; le choix du 17/10/2026 dit « nom affiché d'emblée ». Le plan applique le second : partir sans délai attendrait encore le démarrage de l'application, alors qu'affiché d'emblée le nom ne dépend plus d'aucun script. Recommandation : confirmer.
- **Variables de build chez Cloudflare (PF-07)** : trois valeurs non secrètes à poser avec A-03 — base de l'API de production, base de l'API de préproduction, origine canonique du site — pour qu'aucun hôte n'entre dans le dépôt. Recommandation : les ajouter à A-03.
- **Plus grand élément affiché (PF-04, budget)** : sous mv-actif, le contenu du premier écran attend le démarrage de l'application, 3 secondes au plus grâce au repli, ce qui pèse sur la mesure de Lighthouse. Seul le repli du titre de l'accueil est accepté d'avance ; si TK-57 mesure un dépassement ailleurs, le remède (afficher d'emblée le premier écran d'une page, par exemple) changerait la charte et reviendra à Alexandre par l'issue de type bug que prévoit TK-57. Recommandation : en prendre acte.
- **Transitions entre pages (PF-04, MV-07)** : seulement entre pages du site après le démarrage de l'application, par une fonction d'Angular marquée « developer preview » ; aucun fondu au premier chargement ; pas de transitions entre documents (Firefox ne les a pas). Recommandation : accepter.
- **État « Téléchargement en cours… » du CV (étape 27)** : 3 secondes après le premier clic, faute d'événement de fin de téléchargement ; valeur sans source (proposition, à valider). Recommandation : accepter.

## Sources

Documents du projet, lus dans le dépôt : Conception-Technique-V2 (sections 1, 2, 3, 5, 6, 7, 8, 9, 10 et 12), Parcours-Ecrans-V2 (EC-00 à EC-11, PN-01 à PN-04, V-01 à V-09), Charte-Graphique-V2 (en entier), maquettes (index.html, styles.css, mouvement.js, ecran-01-accueil.html, ecran-02-parcours.html, ecran-05-methode.html, ecran-06-projets.html, ecran-07-projet.html, ecran-08-cv.html, ecran-11-introuvable.html), Contract-API-V2 (en entier), Tickets-V2 (sections 1, 2, 3, 4, 7 et 8), US-2.0-Portfolio et SC-2.0-Portfolio.

- Node.js, Previous releases (v26 « Current », v24 et v22 « LTS ») — https://nodejs.org/en/about/previous-releases — consulté le 27/10/2026
- Node.js Release Working Group, calendrier des versions (v26 : LTS active le 2026-10-28) — https://github.com/nodejs/Release — consulté le 27/10/2026
- endoflife.date, Node.js (v26 « Upcoming LTS ») — https://endoflife.date/nodejs — consulté le 27/10/2026
- Node.js 24, documentation de Corepack (plus distribué à partir de Node.js v25) — https://nodejs.org/docs/latest-v24.x/api/corepack.html — consulté le 27/10/2026
- Angular, Version compatibility (Angular 22 : Node ^22.22.3, ^24.15.0 ou ^26.0.0 ; Baseline du 2026-05-07) — https://angular.dev/reference/versions — consulté le 27/10/2026
- Registre npm, @angular/core, dernière version (22.2.3) — https://registry.npmjs.org/@angular/core/latest — consulté le 27/10/2026
- Registre npm, angular-eslint, dernière version (22.6.0, pour Angular 22) — https://registry.npmjs.org/angular-eslint/latest — consulté le 27/10/2026
- Angular, Server and hybrid rendering (outputMode static, getPrerenderParams, afterNextRender, PrerenderFallback) — https://angular.dev/guide/ssr — consulté le 27/10/2026
- Angular, Hydration (rejeu des événements, manipulation directe du DOM, écarts d'hydratation) — https://angular.dev/guide/hydration — consulté le 27/10/2026
- Angular, Prepare component for translation (i18n, identifiants personnalisés, $localize, ICU) — https://angular.dev/guide/i18n/prepare — consulté le 27/10/2026
- Angular, Refer to locales by ID (sourceLocale) — https://angular.dev/guide/i18n/locale-id — consulté le 27/10/2026
- Angular, Security (politique de sécurité du contenu, autoCsp inutilisable avec le rendu côté serveur, 'unsafe-inline' pour les styles sans nonce) — https://angular.dev/best-practices/security — consulté le 27/10/2026
- Angular, API withViewTransitions (developer preview, depuis la v19 ; aucune transition sans document.startViewTransition) — https://angular.dev/api/router/withViewTransitions — consulté le 27/10/2026
- Angular, Route transition animations (onViewTransitionCreated, skipTransition, réduction des animations) — https://angular.dev/guide/routing/route-transition-animations — consulté le 27/10/2026
- Angular, Signal Forms, vue d'ensemble — https://angular.dev/guide/forms/signals/overview — consulté le 27/10/2026
- Angular, API form de Signal Forms (stable depuis la v22.0) — https://angular.dev/api/forms/signals/form — consulté le 27/10/2026
- MDN, View Transition API (transitions dans un même document et entre documents) — https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API — consulté le 27/10/2026
- Web Platform Status, View transitions (Baseline « newly » depuis le 2025-10-14 ; versions par navigateur) — https://api.webstatus.dev/v1/features/view-transitions — consulté le 27/10/2026
- Web Platform Status, Cross-document view transitions (Baseline « limited » ; Firefox absent) — https://api.webstatus.dev/v1/features/cross-document-view-transitions — consulté le 27/10/2026
- Cloudflare, Workers static assets, Headers (syntaxe, détachement par « ! », 100 règles, 2 000 caractères par ligne) — https://developers.cloudflare.com/workers/static-assets/headers/ — consulté le 27/10/2026
- Cloudflare, Workers static assets, Redirects (syntaxe, codes, limites) — https://developers.cloudflare.com/workers/static-assets/redirects/ — consulté le 27/10/2026
- Cloudflare, Workers static assets, Static site generation (not_found_handling « 404-page ») — https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/ — consulté le 27/10/2026
- Cloudflare, Workers static assets, HTML handling (drop-trailing-slash) — https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/ — consulté le 27/10/2026
- Cloudflare, Workers Builds, configuration (variables de build, WORKERS_CI_BRANCH, répertoire racine) — https://developers.cloudflare.com/workers/ci-cd/builds/configuration/ — consulté le 27/10/2026
- Cloudflare, journal des versions de Wrangler (CHANGELOG du dépôt workers-sdk, lu en partie : l'entrée sur _headers et _redirects en local n'y a pas été retrouvée) — https://raw.githubusercontent.com/cloudflare/workers-sdk/main/packages/wrangler/CHANGELOG.md — consulté le 27/10/2026
- Recherche web sur wrangler dev, _headers et _redirects : résultat citant l'entrée du journal des versions de Wrangler « Parse and apply metafiles (_headers and _redirects) in wrangler dev for Workers Assets », sans numéro de version ni page officielle ouverte (vérification partielle, d'où la spécification de conformité de PF-08) — consulté le 27/10/2026
