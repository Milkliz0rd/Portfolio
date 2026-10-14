# US-2.0 : MVP Portfolio
Statut : [ ] à rédiger  [x] à approuver  [ ] approuvé par : ______  [ ] terminé
Base : Projet-V2/Contexte-Pitch.md, signé par Alexandre Morozoff le 14/10/26.

Les citations se retrouvent mot pour mot dans la fiche de base. Un seuil sans source est suivi de « (proposition, à valider) ». Les textes définitifs du site ne sont pas rédigés ici : ces US disent quel contenu est montré.

## Macro-fonction : Présentation et navigation

### MF-01 — Micro-fonction : Page d'accueil qui présente Alexandre
Priorité : critique     Périmètre : MVP v2.0.0
Source : Pitch « Je voudrais un site qui soit vraiment un site portfolio » ; Contexte « un site vitrine professionnel et marquant » ; Contexte « donne envie de recruter Alexandre comme développeur »
En tant que recruteur, je veux voir dès mon arrivée qui est Alexandre Morozoff et ce qu'il fait, afin de décider si je poursuis la lecture de son profil.

Règles métier :
- L'accueil affiche le nom Alexandre Morozoff et l'intitulé de son profil (intitulé : Q-13).
- L'accueil contient une courte présentation et montre comment atteindre les autres sections.
- Aucun âge ni aucune formulation qui se périme n'y figure (Q-01, MF-18).

Scénarios liés : SC-2.0-01

### MF-02 — Micro-fonction : CV et contact accessibles en permanence
Priorité : critique     Périmètre : MVP v2.0.0
Source : Contexte « son concept ludique cache le CV et le contact au lieu de les mettre en avant » ; Contexte « donne envie de recruter Alexandre comme développeur »
En tant que recruteur, je veux atteindre le CV et le contact depuis n'importe quelle page en un clic (proposition, à valider), afin de ne pas avoir à les chercher.

Règles métier :
- Le CV et le contact ne dépendent d'aucune étape préalable : ni exploration du site, ni jeu, ni saisie.
- Cette règle vaut pour toutes les pages, y compris la fiche d'un projet.

Scénarios liés : SC-2.0-02, SC-2.0-03

### MF-03 — Micro-fonction : Navigation entre les sections
Priorité : high     Périmètre : MVP v2.0.0
Source : Contexte « recruteurs et responsables techniques » ; Contexte « qui jugent un profil en »
En tant que responsable technique, je veux parcourir les sections du site depuis une navigation disponible sur chaque page, afin de me faire un avis sur le profil en quelques minutes.

Règles métier :
- La navigation donne accès à chaque section du site : parcours, compétences, rôle chez OSOL, projets, CV, contact.
- La navigation est la même sur toutes les pages.

Scénarios liés : SC-2.0-04

### MF-04 — Micro-fonction : Liens directs vers les pages
Priorité : high     Périmètre : MVP v2.0.0
Source : Contexte « liens directs cassés »
En tant que recruteur, je veux ouvrir directement la page qu'on m'a transmise (une section ou la fiche d'un projet) à partir de son lien, afin d'arriver sur le bon contenu sans repasser par l'accueil.

Règles métier :
- Un lien direct vers une section affiche cette section.
- Un lien direct vers la fiche d'un projet existant affiche cette fiche.
- Recharger une page garde la même page affichée.
- Un lien direct vers un projet qui n'existe pas mène à la page décrite en MF-05.

Scénarios liés : SC-2.0-05, SC-2.0-06, SC-2.0-07

### MF-05 — Micro-fonction : Page introuvable
Priorité : medium     Périmètre : MVP v2.0.0
Source : Existant v1 (v1.0.0:my-portfolio/src/Pages/Error404.jsx) ; Contexte « liens directs cassés »
En tant que visiteur, je veux comprendre qu'une adresse ne mène à aucune page, afin de retrouver le reste du site sans repartir de zéro.

Règles métier :
- Un message clair indique que la page n'existe pas : jamais d'écran vide.
- La navigation reste visible et un retour à l'accueil est proposé.

Scénarios liés : SC-2.0-08

### MF-06 — Micro-fonction : Consultation sur téléphone
Priorité : high     Périmètre : MVP v2.0.0
Source : Existant v1 (v1.0.0:my-portfolio/src/Components/Navigation/Navigation.jsx) ; Contexte « qui jugent un profil en »
En tant que recruteur, je veux consulter le site sur un téléphone comme sur un ordinateur, afin de juger le profil où que je sois.

Règles métier :
- Toutes les sections, la navigation, les fiches projet et le formulaire de contact restent utilisables sur téléphone.
- Aucun contenu n'est coupé et aucun défilement horizontal n'est nécessaire.
- Les tailles d'écran à couvrir sont à décider à l'Étape 4.

Scénarios liés : SC-2.0-09

## Macro-fonction : Profil et parcours

### MF-07 — Micro-fonction : Parcours d'Alexandre
Priorité : high     Périmètre : MVP v2.0.0
Source : Contexte « son parcours (reconversion depuis la restauration, bac+3 » ; Contexte « master en architecture durable du logiciel » ; Pitch « Bac+3 qui poursuit en master Architecure Durable de logiciel »
En tant que recruteur, je veux voir le parcours d'Alexandre (reconversion depuis la restauration, bac+3, master en architecture durable du logiciel), afin de comprendre d'où il vient et où il va.

Règles métier :
- Les étapes sont présentées dans cet ordre : reconversion, bac+3, master.
- Aucune date, aucun établissement ni aucun intitulé de diplôme n'est affiché tant qu'Alexandre ne les a pas fournis (Q-04).
- Aucune durée relative ni formulation liée au moment de la lecture n'est utilisée (Q-01, Q-03, MF-18).

Scénarios liés : SC-2.0-10

### MF-08 — Micro-fonction : Orientation vers l'architecture logicielle
Priorité : high     Périmètre : MVP v2.0.0
Source : Contexte « de l'orientation vers l'architecture logicielle » ; Contexte « master en architecture durable du logiciel »
En tant que responsable technique, je veux savoir qu'Alexandre s'oriente vers l'architecture logicielle, afin de situer son ambition professionnelle.

Règles métier :
- L'orientation est présentée avec le master en architecture durable du logiciel comme étape.
- Aucune information sur le contenu du master n'est affichée sans que l'auteur l'ait fournie.

Scénarios liés : SC-2.0-11

## Macro-fonction : Compétences

### MF-09 — Micro-fonction : Compétences techniques
Priorité : critique     Périmètre : MVP v2.0.0
Source : Pitch « met skills hard comme soft » ; Contexte « techniques et humaines »
En tant que responsable technique, je veux voir les compétences techniques d'Alexandre regroupées de façon lisible, afin d'évaluer son adéquation avec un besoin.

Règles métier :
- Seules les compétences fournies par Alexandre sont affichées (liste : Q-06).
- Aucun niveau chiffré n'est affiché sans accord d'Alexandre (Q-06).

Scénarios liés : SC-2.0-12

### MF-10 — Micro-fonction : Compétences humaines et reconversion
Priorité : high     Périmètre : MVP v2.0.0
Source : Pitch « met skills hard comme soft » ; Décision d'Alexandre du 14/10/2026 : la reconversion depuis la restauration fait partie du récit, côté compétences humaines
En tant que recruteur, je veux voir les compétences humaines d'Alexandre et comprendre en quoi sa reconversion depuis la restauration les illustre, afin de juger sa manière de travailler.

Règles métier :
- Seules les compétences humaines fournies par Alexandre sont affichées (liste : Q-06).
- Le récit de reconversion est rattaché aux compétences humaines, pas aux compétences techniques.

Scénarios liés : SC-2.0-13

## Macro-fonction : Expérience chez OSOL

### MF-11 — Micro-fonction : Rôle chez OSOL
Priorité : high     Périmètre : MVP v2.0.0
Source : Pitch « Parler comme quoi je suis alternant chez OSOL » ; Pitch « Tout en assistant le dev ops SUR CERTAINES de ses tâches » ; Décision d'Alexandre du 14/10/2026 : OSOL reste superficiel, le rôle est décrit et aucun projet OSOL n'est présenté
En tant que recruteur, je veux lire le rôle d'Alexandre chez OSOL, afin de savoir ce qu'il fait en entreprise.

Règles métier :
- Le rôle est décrit en trois volets : application, backend, appui DevOps sur certaines tâches.
- L'appui DevOps est présenté comme un appui sur certaines tâches, pas comme un poste.
- Aucun projet, client, outil, dépôt ni collègue n'est nommé.
- La formulation du statut d'Alexandre ne dépend pas du moment de la lecture (Q-02, MF-18).

Scénarios liés : SC-2.0-14

## Macro-fonction : Projets

### MF-12 — Micro-fonction : Liste des projets
Priorité : high     Périmètre : MVP v2.0.0
Source : Existant v1 (v1.0.0:my-portfolio/src/Data/Projets.json) ; Contexte « ajouter un projet reste possible sans retoucher le »
En tant que recruteur, je veux voir la liste des projets d'Alexandre, afin de choisir ceux que j'ouvre.

Règles métier :
- La liste montre les projets fournis par Alexandre, chacun avec son titre (projets au lancement : Q-05).
- Chaque projet mène à sa fiche.
- Aucun projet OSOL n'est présenté (décision du 14/10/2026).

Scénarios liés : SC-2.0-15

### MF-13 — Micro-fonction : Fiche d'un projet
Priorité : high     Périmètre : MVP v2.0.0
Source : Existant v1 (v1.0.0:my-portfolio/src/Pages/Skills.jsx) ; Existant v1 (v1.0.0:my-portfolio/src/Data/Projets.json)
En tant que responsable technique, je veux ouvrir la fiche d'un projet avec sa description, ses captures et le lien vers son code source, afin d'évaluer le travail d'Alexandre.

Règles métier :
- La fiche affiche le titre et la description du projet.
- Les captures sont affichées quand elles existent ; sans capture, aucune zone vide n'apparaît.
- Le lien vers le code source est affiché quand il existe ; sans lien, rien n'est affiché à sa place.

Scénarios liés : SC-2.0-16, SC-2.0-17, SC-2.0-18

### MF-14 — Micro-fonction : Ajouter un projet sans toucher au reste du site
Priorité : high     Périmètre : MVP v2.0.0
Source : Contexte « ajouter un projet reste possible sans retoucher le » ; Pitch « Je veux que ce site puisse durer au moins 2 ans sans que j'ai à le retoucher »
En tant que Alexandre (propriétaire du site), je veux ajouter un projet en fournissant seulement ses informations, afin que le site le présente sans que j'aie à modifier les autres sections.

Règles métier :
- Un projet ajouté apparaît dans la liste (MF-12), a sa fiche (MF-13) et son lien direct (MF-04).
- Les autres sections et les autres projets restent identiques après l'ajout.
- Le moyen technique de l'ajout se décide à l'Étape 4.

Scénarios liés : SC-2.0-19, SC-2.0-20

## Macro-fonction : CV, contact et liens

### MF-15 — Micro-fonction : Consulter et télécharger le CV
Priorité : critique     Périmètre : MVP v2.0.0
Source : Existant v1 (v1.0.0:my-portfolio/src/Components/CV/CV.jsx) ; Contexte « son concept ludique cache le CV et le contact au lieu de les mettre en avant »
En tant que recruteur, je veux obtenir le CV d'Alexandre, afin de le lire ou de le transmettre.

Règles métier :
- Le CV est disponible sans condition préalable (MF-02).
- Le fichier est fourni par Alexandre ; son nom ne contient ni date ni mention de situation (proposition, à valider ; fichier : Q-07).
- Si le CV est indisponible, un message l'indique et propose le contact (proposition, à valider).

Scénarios liés : SC-2.0-21, SC-2.0-22

### MF-16 — Micro-fonction : Envoyer un message à Alexandre
Priorité : critique     Périmètre : MVP v2.0.0
Source : Existant v1 (v1.0.0:my-portfolio/src/Components/Infos/Infos.jsx) ; Contexte « donne envie de recruter Alexandre comme développeur »
En tant que recruteur, je veux écrire à Alexandre depuis le site, afin de le contacter sans quitter la page.

Règles métier :
- Le formulaire comporte cinq champs, tous obligatoires : nom, prénom, email, sujet, message (moyen de contact : Q-10).
- L'email doit avoir un format valide.
- Champ manquant ou email invalide : un message s'affiche près du champ, rien n'est envoyé, la saisie est conservée.
- Envoi réussi : une confirmation s'affiche, les champs sont vidés, et Alexandre reçoit les cinq informations saisies.
- Envoi qui échoue : un message d'erreur visible indique qu'il est possible de réessayer, et la saisie est conservée.
- La protection contre les messages indésirables est une question ouverte (Q-11).

Scénarios liés : SC-2.0-23, SC-2.0-24, SC-2.0-25, SC-2.0-26

### MF-17 — Micro-fonction : Liens vers les profils externes
Priorité : medium     Périmètre : MVP v2.0.0
Source : Existant v1 (v1.0.0:my-portfolio/src/Components/Navigation/Navigation.jsx) ; Existant v1 (v1.0.0:my-portfolio/src/Components/Welcome/Welcome.jsx)
En tant que visiteur, je veux accéder aux profils externes d'Alexandre, afin de voir son activité en dehors du site.

Règles métier :
- Les liens repris de l'ancien site sont ceux vers GitHub, X et LinkedIn (liens à garder : Q-08).
- Les liens sont présents sur toutes les pages (proposition, à valider).
- Ouvrir un lien externe laisse le site ouvert dans la fenêtre d'origine.

Scénarios liés : SC-2.0-27

## Macro-fonction : Contenu durable et obligations

### MF-18 — Micro-fonction : Aucune information qui se périme
Priorité : high     Périmètre : MVP v2.0.0
Source : Contexte « information qui se périme » ; Pitch « Je veux que ce site puisse durer au moins 2 ans sans que j'ai à le retoucher »
En tant que Alexandre (propriétaire du site), je veux que le site n'affiche aucune information qui change avec le temps, afin qu'il reste juste sans que j'aie à le retoucher.

Règles métier :
- Aucun âge n'est affiché (Q-01).
- Aucune durée relative ni formulation liée au moment de la lecture n'est utilisée.
- Une date n'est affichée que si elle est précise et fournie par Alexandre (Q-04).
- Le statut d'Alexandre chez OSOL et sa formation sont formulés sans temporalité (Q-02, Q-03).

Scénarios liés : SC-2.0-28

### MF-19 — Micro-fonction : Mentions légales
Priorité : high     Périmètre : MVP v2.0.0
Source : Obligation (loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, article 6)
En tant que visiteur, je veux consulter les mentions légales du site, afin de savoir qui l'édite et à qui m'adresser.

Règles métier :
- Un lien vers les mentions légales est présent sur toutes les pages.
- Le contenu exact est à valider par Alexandre (Q-12).

Scénarios liés : SC-2.0-29

### MF-20 — Micro-fonction : Information sur l'usage des données du formulaire
Priorité : high     Périmètre : MVP v2.0.0
Source : Obligation (règlement (UE) 2016/679 dit RGPD, article 13)
En tant que visiteur, je veux savoir, avant d'envoyer le formulaire de contact, ce qu'il advient de mes données, afin de décider en connaissance de cause.

Règles métier :
- L'information est visible avant le bouton d'envoi.
- Elle indique qui reçoit les données et pourquoi ; son contenu exact est à valider (Q-12).

Scénarios liés : SC-2.0-30

## Hors périmètre (v2.0.1)

Aucune micro-fonction n'est de périmètre v2.0.1 à ce stade : tout besoin sourcé est au MVP v2.0.0. Les besoins utiles mais sans source sont posés en questions ouvertes ; ils rejoindront le MVP ou la v2.0.1 selon la réponse d'Alexandre.

Exclusions décidées :
- Aucun projet OSOL sur le portfolio : décision d'Alexandre du 14/10/2026.
- Aucune reprise du code de l'ancien site, seulement sa matière (textes, captures, liens) : décision d'Alexandre du 13/10/2026.
- Aucune direction artistique dans ces US : la charte graphique se définit à l'Étape 4 (décision d'Alexandre du 13/10/2026).
- Aucun parcours ludique qui conditionne l'accès au CV ou au contact : Contexte « son concept ludique cache le CV et le contact au lieu de les mettre en avant ».

## Exigences reportées à la conception (Étape 4)

- Pitch « Pour la DA, j'aime beaucoup une page de référence que je fournirai pour les maquettes. » → la charte graphique et les maquettes, à définir à partir de la page de référence qu'Alexandre fournira.
- Pitch « que ça soit un site vitrine qui en jette mais qui soit pro » → ce que « qui en jette mais qui soit pro » signifie visuellement, et comment la conception le fait valider.
- Pitch « Je veux que ce site puisse durer au moins 2 ans sans que j'ai à le retoucher » → ce qui, en dehors du contenu, peut obliger à retoucher le site pendant ces deux ans, et comment la conception le limite.
- Contexte « liens directs cassés » → ce qui garantit qu'un lien transmis mène au bon contenu, y compris après rechargement de la page.
- Contexte « aucun référencement » → ce que le site doit montrer quand on cherche Alexandre Morozoff dans un moteur de recherche, et ce qu'il faut prévoir pour cela.
- Contexte « aucun test » → quels contrôles automatiques et manuels sont prévus avant la recette (Étape 7).
- Contexte « ajouter un projet reste possible sans retoucher le » → comment un projet s'ajoute sans modifier les autres sections, et qui fournit quelles informations.
- Contexte « quelques minutes » → ce que la lecture rapide impose à la hiérarchie des informations et à la rapidité d'affichage, et quels seuils la conception retient.
- Existant v1 (v1.0.0:my-portfolio/src/Components/Infos/Infos.jsx) → comment les messages parviennent à Alexandre, comment le site se protège des messages indésirables, et combien de temps les données saisies sont conservées.
- Existant v1 (v1.0.0:my-portfolio/src/Components/Navigation/Navigation.jsx) → les tailles d'écran et les navigateurs à couvrir.
- Décision d'Alexandre du 13/10/2026 : la pile technique est choisie → la justification de ce choix et de ses écarts éventuels dans la conception technique.

## Questions ouvertes pour Alexandre

- Q-01 — Le pitch dit « 33 ans » : un âge affiché cesse d'être juste en moins de deux ans, ce qui contredit l'exigence de durée. Faut-il afficher un âge, et sous quelle forme ? Hypothèse provisoire : aucun âge n'est affiché. Impacte : MF-01, MF-07, MF-18.
- Q-02 — Le pitch dit « je suis alternant chez OSOL » : ce statut cessera d'être juste avant la fin de la durée visée. Comment formuler le rôle chez OSOL, et quand l'alternance se termine-t-elle ? Hypothèse provisoire : le rôle est décrit par ses trois volets (application, backend, appui DevOps sur certaines tâches), sans mention de statut ni de durée. Impacte : MF-11, MF-18.
- Q-03 — Le pitch dit « qui poursuit en master » : cette formulation suppose un moment précis. Comment présenter le master ? Hypothèse provisoire : le master est présenté comme une étape du parcours, nommé « master en architecture durable du logiciel », sans « en cours » ni date. Impacte : MF-07, MF-08, MF-18.
- Q-04 — Quelles sont les dates, intitulés et établissements du parcours (reconversion, formation, bac+3, master), et lesquels afficher ? Hypothèse provisoire : aucune date, aucun établissement et aucun intitulé de diplôme ; seules les étapes ordonnées sont affichées. Impacte : MF-07, MF-10, MF-18.
- Q-05 — Quels projets présenter au lancement : les six projets d'école de l'ancien site (HTML & CSS, Javascript, React & Sass, Node.js, Opti & debugg, Gestion de projet), d'autres, ou les deux ? Leurs textes et captures sont-ils repris tels quels ? Hypothèse provisoire : les six projets de l'ancien site, avec leurs textes et captures comme matière de départ. Impacte : MF-12, MF-13, MF-14.
- Q-06 — Quelles compétences techniques et humaines afficher, et faut-il un niveau pour chacune ? Hypothèse provisoire : seules les compétences fournies par Alexandre sont affichées, sans niveau chiffré. Impacte : MF-09, MF-10.
- Q-07 — Quel CV proposer ? Le fichier de l'ancien site a un nom daté et porte une mention de recherche d'alternance. Hypothèse provisoire : un seul CV, en français, fourni par Alexandre, sous un nom sans date ni mention de situation. Impacte : MF-15.
- Q-08 — Quels liens externes garder parmi GitHub, X et LinkedIn de l'ancien site, et en ajouter d'autres ? Hypothèse provisoire : les trois liens de l'ancien site sont repris. Impacte : MF-17.
- Q-09 — Faut-il une version anglaise du site ? Hypothèse provisoire : le site est en français seulement. Impacte : MF-01, MF-03, MF-07, MF-08, MF-09, MF-10, MF-11, MF-12, MF-13, MF-16.
- Q-10 — Le contact passe-t-il par le formulaire de l'ancien site (nom, prénom, email, sujet, message), ou par un autre moyen ? Dans quelle boîte arrivent les messages ? Hypothèse provisoire : le formulaire de l'ancien site, avec ses cinq champs obligatoires, et les messages arrivent dans une boîte personnelle d'Alexandre. Impacte : MF-16, MF-20.
- Q-11 — Faut-il se protéger des messages indésirables, et jusqu'où ? Hypothèse provisoire : les US n'imposent rien ; la conception propose. Impacte : MF-16.
- Q-12 — Alexandre édite-t-il le site à titre non professionnel, et que publier dans les mentions légales (identité, coordonnées, société qui met le site en ligne) et dans l'information sur les données ? Hypothèse provisoire : les mentions donnent son nom et les coordonnées de la société qui met le site en ligne, sans adresse personnelle ; le texte exact est à confirmer. Impacte : MF-19, MF-20.
- Q-13 — Quel intitulé de profil afficher à l'accueil ? L'ancien site disait « Développeur Front-end junior », ce qui ne convient plus. Hypothèse provisoire : « Développeur », sans spécialité ni niveau. Impacte : MF-01.
- Q-14 — Faut-il relier chaque compétence aux projets qui la démontrent ? Hypothèse provisoire : non, compétences et projets sont présentés séparément. Impacte : MF-09, MF-13.

## Matrice de couverture

| E-xx | Citation exacte | Source | Traité par |
| --- | --- | --- | --- |
| E-01 | Je voudrais un site qui soit vraiment un site portfolio pour un dev de 33 ans Bac+3 qui poursuit en master Architecure Durable de logiciel. | Pitch | MF-01, MF-07, MF-08, Q-01, Q-03 |
| E-02 | Je veux que ça montre met skills hard comme soft | Pitch | MF-09, MF-10, Q-06 |
| E-03 | que ça soit un site vitrine qui en jette mais qui soit pro. | Pitch | MF-01, Reporté Étape 4 |
| E-04 | Pour la DA, j'aime beaucoup une page de référence que je fournirai pour les maquettes. | Pitch | Reporté Étape 4 |
| E-05 | Je veux que ce site puisse durer au moins 2 ans sans que j'ai à le retoucher. | Pitch | MF-14, MF-18, Reporté Étape 4 |
| E-06 | Parler comme quoi je suis alternant chez OSOL et que je m'occupe de tout ce qu'il touche à l'application et au backend. | Pitch | MF-11, Q-02 |
| E-07 | Tout en assistant le dev ops SUR CERTAINES de ses tâches. | Pitch | MF-11 |
| E-08 | le portfolio actuel ne représente plus son auteur | Contexte, Problème réel | MF-01, MF-07 |
| E-09 | daté (recherche d'alternance, rentrée 2025) | Contexte, Problème réel | MF-18, Q-02 |
| E-10 | ne montre que des projets d'école | Contexte, Problème réel | MF-12, Q-05 |
| E-11 | son concept ludique cache le CV et le contact au lieu de les mettre en avant | Contexte, Problème réel | MF-02, MF-15, MF-16 |
| E-12 | liens directs cassés | Contexte, Problème réel | MF-04, MF-05, Reporté Étape 4 |
| E-13 | aucun référencement | Contexte, Problème réel | Reporté Étape 4 |
| E-14 | aucun test | Contexte, Problème réel | Reporté Étape 4 |
| E-15 | dit rien du poste actuel | Contexte, Problème réel | MF-11, Q-02 |
| E-16 | de l'orientation vers l'architecture logicielle | Contexte, Problème réel | MF-08 |
| E-17 | parcours de reconversion depuis la restauration | Contexte, Problème réel | MF-07, MF-10 |
| E-18 | recruteurs et responsables techniques | Contexte, Utilisateurs visés | MF-01, MF-03 |
| E-19 | qui jugent un profil en | Contexte, Utilisateurs visés | MF-03, MF-06, Reporté Étape 4 |
| E-20 | un site vitrine professionnel et marquant | Contexte, Objectif métier | MF-01, Reporté Étape 4 |
| E-21 | donne envie de recruter Alexandre comme développeur | Contexte, Objectif métier | MF-01, MF-02, MF-16 |
| E-22 | techniques et humaines | Contexte, Objectif métier | MF-09, MF-10 |
| E-23 | son parcours (reconversion depuis la restauration, bac+3 | Contexte, Objectif métier | MF-07, Q-04 |
| E-24 | master en architecture durable du logiciel | Contexte, Objectif métier | MF-07, MF-08, Q-03 |
| E-25 | son rôle d'alternant chez OSOL | Contexte, Objectif métier | MF-11, Q-02 |
| E-26 | (application, backend, appui DevOps sur certaines tâches) | Contexte, Objectif métier | MF-11 |
| E-27 | décrit sans aucun projet | Contexte, Objectif métier | MF-11, Hors périmètre |
| E-28 | Il reste juste et fonctionnel au moins deux ans sans refonte | Contexte, Objectif métier | MF-18, Reporté Étape 4 |
| E-29 | information qui se périme | Contexte, Objectif métier | MF-18, Q-01, Q-02, Q-03 |
| E-30 | ajouter un projet reste possible sans retoucher le | Contexte, Objectif métier | MF-14, Reporté Étape 4 |
