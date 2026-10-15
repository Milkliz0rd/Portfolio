# US-2.0 : MVP Portfolio
Statut : [ ] à rédiger  [x] à approuver  [ ] approuvé par : ______  [ ] terminé
Base : Projet-V2/Contexte-Pitch.md, signé par Alexandre Morozoff le 14/10/26.

Les citations se retrouvent mot pour mot dans la fiche de base. Un seuil sans source est suivi de « (proposition, à valider) ». Les textes définitifs du site ne sont pas rédigés ici : ces US disent quel contenu est montré.

## Macro-fonction : Présentation et navigation

### MF-01 — Micro-fonction : Page d'accueil qui présente Alexandre
Priorité : critique     Périmètre : MVP v2.0.0
Source : Pitch « Je voudrais un site qui soit vraiment un site portfolio » ; Contexte « un site vitrine professionnel et marquant » ; Contexte « donne envie de recruter Alexandre comme développeur » ; Décision d'Alexandre du 15/10/2026 : intitulé du profil
En tant que recruteur, je veux voir dès mon arrivée qui est Alexandre Morozoff et ce qu'il fait, afin de décider si je poursuis la lecture de son profil.

Règles métier :
- L'accueil affiche le nom Alexandre Morozoff et l'intitulé de son profil.
- L'intitulé du profil est « Développeur fullstack, orienté architecture logicielle » (Q-13).
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
Source : Contexte « recruteurs et responsables techniques » ; Contexte « qui jugent un profil en quelques minutes »
En tant que responsable technique, je veux parcourir les sections du site depuis une navigation disponible sur chaque page, afin de me faire un avis sur le profil en quelques minutes.

Règles métier :
- La navigation donne accès à chaque section du site : parcours, compétences, rôle chez OSOL, méthode de travail, projets, CV, contact.
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
Source : Existant v1 (v1.0.0:my-portfolio/src/Components/Navigation/Navigation.jsx) ; Contexte « qui jugent un profil en quelques minutes »
En tant que recruteur, je veux consulter le site sur un téléphone comme sur un ordinateur, afin de juger le profil où que je sois.

Règles métier :
- Toutes les sections, la navigation, les fiches projet et le formulaire de contact restent utilisables sur téléphone.
- Aucun contenu n'est coupé et aucun défilement horizontal n'est nécessaire.
- Les tailles d'écran à couvrir sont à décider à l'Étape 4.

Scénarios liés : SC-2.0-09

### MF-23 — Micro-fonction : Version anglaise
Priorité : medium     Périmètre : v2.0.1
Source : Décision d'Alexandre du 15/10/2026 : une version anglaise du site, en v2.0.1
En tant que recruteur, je veux lire le site en anglais, afin de le consulter sans lire le français.

Règles métier :
- Le site est disponible en anglais à partir de la v2.0.1 ; le MVP v2.0.0 est en français.
- Le choix de la langue et les textes anglais sont à définir avant la v2.0.1 (proposition, à valider).

Scénarios liés : aucun (hors MVP)

## Macro-fonction : Profil et parcours

### MF-07 — Micro-fonction : Parcours d'Alexandre
Priorité : high     Périmètre : MVP v2.0.0
Source : Contexte « son parcours (reconversion depuis la restauration, bac+3, master en architecture durable du logiciel) » ; Contexte « master en architecture durable du logiciel » ; Pitch « Bac+3 qui poursuit en master Architecure Durable de logiciel » ; Décision d'Alexandre du 15/10/2026 : les étapes du parcours sont des périodes datées
En tant que recruteur, je veux voir le parcours d'Alexandre (reconversion depuis la restauration, bac+3, master en architecture durable du logiciel), afin de comprendre d'où il vient et où il va.

Règles métier :
- Les étapes sont présentées dans cet ordre : reconversion, bac+3, master.
- Chaque étape est présentée comme une période datée, avec un début et une fin au mois ou à l'année, jamais au présent : la période est fournie par Alexandre (C-01, Q-03, Q-04).
- Le bac+3 est affiché avec son intitulé et son établissement, fournis par Alexandre (C-01, Q-04).
- Aucune durée relative ni formulation liée au moment de la lecture n'est utilisée (Q-01, Q-03, MF-18).

Scénarios liés : SC-2.0-10

### MF-08 — Micro-fonction : Orientation vers l'architecture logicielle
Priorité : high     Périmètre : MVP v2.0.0
Source : Contexte « de l'orientation vers l'architecture logicielle » ; Contexte « master en architecture durable du logiciel »
En tant que responsable technique, je veux savoir qu'Alexandre s'oriente vers l'architecture logicielle, afin de situer son ambition professionnelle.

Règles métier :
- L'orientation est présentée avec le master en architecture durable du logiciel comme étape, qui est une période datée fournie par Alexandre (MF-07, C-01).
- Aucune information sur le contenu du master n'est affichée sans que l'auteur l'ait fournie.

Scénarios liés : SC-2.0-11

## Macro-fonction : Compétences

### MF-09 — Micro-fonction : Compétences techniques
Priorité : critique     Périmètre : MVP v2.0.0
Source : Pitch « met skills hard comme soft » ; Contexte « techniques et humaines »
En tant que responsable technique, je veux voir les compétences techniques d'Alexandre regroupées de façon lisible, afin d'évaluer son adéquation avec un besoin.

Règles métier :
- Seules les compétences de la liste fournie par Alexandre sont affichées (C-02).
- Elles sont regroupées selon les catégories fournies par Alexandre (C-02).
- Aucun niveau chiffré n'est affiché sans accord d'Alexandre (Q-06).
- Les technologies pratiquées chez OSOL (langages, frameworks) ne sont nommées que comme compétences : ni outil interne, ni projet, ni client, ni dépôt (Q-15).

Scénarios liés : SC-2.0-12

### MF-10 — Micro-fonction : Compétences humaines et reconversion
Priorité : high     Périmètre : MVP v2.0.0
Source : Pitch « met skills hard comme soft » ; Décision d'Alexandre du 14/10/2026 : la reconversion depuis la restauration fait partie du récit, côté compétences humaines
En tant que recruteur, je veux voir les compétences humaines d'Alexandre et comprendre en quoi sa reconversion depuis la restauration les illustre, afin de juger sa manière de travailler.

Règles métier :
- Seules les compétences humaines fournies par Alexandre sont affichées (liste : C-02 ; niveaux : Q-06).
- Le récit de reconversion est rattaché aux compétences humaines, pas aux compétences techniques.

Scénarios liés : SC-2.0-13

## Macro-fonction : Expérience chez OSOL

### MF-11 — Micro-fonction : Rôle chez OSOL
Priorité : high     Périmètre : MVP v2.0.0
Source : Pitch « Parler comme quoi je suis alternant chez OSOL » ; Pitch « Tout en assistant le dev ops SUR CERTAINES de ses tâches » ; Décision d'Alexandre du 14/10/2026 : OSOL reste superficiel, le rôle est décrit et aucun projet OSOL n'est présenté ; Décision d'Alexandre du 15/10/2026 : les projets menés en entreprise ne sont pas partageables, l'alternance est la période 2025–2028
En tant que recruteur, je veux lire le rôle d'Alexandre chez OSOL, afin de savoir ce qu'il fait en entreprise.

Règles métier :
- Le rôle est décrit en trois volets : application, backend, appui DevOps sur certaines tâches.
- L'appui DevOps est présenté comme un appui sur certaines tâches, pas comme un poste.
- Aucun projet, client, outil interne, dépôt ni collègue n'est nommé (Q-15).
- L'alternance chez OSOL est présentée comme la période 2025–2028, fournie par Alexandre (C-01), jamais au présent (Q-02, MF-18).
- Le site indique que les projets menés en entreprise ne sont pas partageables (Q-05).

Scénarios liés : SC-2.0-14

## Macro-fonction : Méthode de travail

### MF-21 — Micro-fonction : Méthodologie de travail
Priorité : high     Périmètre : MVP v2.0.0
Source : Décision d'Alexandre du 15/10/2026 : le portfolio n'expose pas de projet d'entreprise ; une section explique sa méthodologie de travail et son attachement aux architectures solides
En tant que responsable technique, je veux comprendre la méthodologie de travail d'Alexandre et son attachement aux architectures solides, afin d'évaluer sa manière de travailler sans projet d'entreprise à examiner.

Règles métier :
- La section explique la méthodologie de travail d'Alexandre et en quoi il respecte des architectures solides.
- Son texte est fourni par Alexandre (C-04) : les US ne le décrivent pas.
- Aucun document interne, client, projet, outil interne ni dépôt d'entreprise n'est nommé.
- La section renvoie à la fiche du portfolio (MF-22), qui l'illustre.

Scénarios liés : SC-2.0-31

## Macro-fonction : Projets

### MF-12 — Micro-fonction : Liste des projets
Priorité : high     Périmètre : MVP v2.0.0
Source : Existant v1 (v1.0.0:my-portfolio/src/Data/Projets.json) ; Contexte « ajouter un projet reste possible sans retoucher le reste du site » ; Décision d'Alexandre du 15/10/2026 : le portfolio est le seul projet présenté, les projets d'entreprise ne sont pas partageables
En tant que recruteur, je veux voir la liste des projets d'Alexandre, afin de choisir ceux que j'ouvre.

Règles métier :
- Au lancement, la section présente un seul projet : le portfolio lui-même (MF-22).
- Chaque projet mène à sa fiche.
- La section indique que les projets menés en entreprise ne sont pas partageables (Q-05).
- Aucun projet d'école n'est présenté (décision du 15/10/2026) et aucun projet OSOL (décision du 14/10/2026).
- La section accueille les projets ajoutés plus tard (MF-14).

Scénarios liés : SC-2.0-15

### MF-22 — Micro-fonction : Le portfolio présenté comme projet
Priorité : high     Périmètre : MVP v2.0.0
Source : Décision d'Alexandre du 15/10/2026 : le portfolio lui-même est le projet présenté
En tant que responsable technique, je veux ouvrir la fiche du portfolio, présenté comme un projet, afin de juger la démarche et l'architecture du site lui-même.

Règles métier :
- Au lancement, le portfolio est le seul projet présenté.
- Sa fiche (MF-13) présente la démarche et l'architecture du site, et mène à son code source public.
- Son contenu est fourni par Alexandre (C-05) : les US ne le décrivent pas.

Scénarios liés : SC-2.0-32

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
Source : Contexte « ajouter un projet reste possible sans retoucher le reste du site » ; Pitch « Je veux que ce site puisse durer au moins 2 ans sans que j'ai à le retoucher »
En tant qu'Alexandre (propriétaire du site), je veux ajouter un projet en fournissant seulement ses informations, afin que le site le présente sans que j'aie à modifier les autres sections.

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
- Le fichier est le contenu C-03, fourni par Alexandre ; son nom ne contient ni date ni mention de situation (proposition, à valider ; Q-07).
- Si le CV est indisponible, un message l'indique et propose le contact (proposition, à valider).

Scénarios liés : SC-2.0-21, SC-2.0-22

### MF-16 — Micro-fonction : Envoyer un message à Alexandre
Priorité : critique     Périmètre : MVP v2.0.0
Source : Existant v1 (v1.0.0:my-portfolio/src/Components/Infos/Infos.jsx) ; Contexte « donne envie de recruter Alexandre comme développeur » ; Décision d'Alexandre du 15/10/2026 : le formulaire est protégé contre les messages indésirables
En tant que recruteur, je veux écrire à Alexandre depuis le site, afin de le contacter sans quitter la page.

Règles métier :
- Le formulaire comporte cinq champs, tous obligatoires : nom, prénom, email, sujet, message (moyen de contact : Q-10).
- L'email doit avoir un format valide.
- Champ manquant ou email invalide : un message s'affiche près du champ, rien n'est envoyé, la saisie est conservée.
- Envoi réussi : une confirmation s'affiche, les champs sont vidés, et Alexandre reçoit les cinq informations saisies.
- Envoi qui échoue : un message d'erreur visible indique qu'il est possible de réessayer, et la saisie est conservée.
- Le formulaire est protégé contre les messages indésirables ; le moyen et son test se décident à l'Étape 4 (Q-11).

Scénarios liés : SC-2.0-23, SC-2.0-24, SC-2.0-25, SC-2.0-26

### MF-17 — Micro-fonction : Liens vers les profils externes
Priorité : medium     Périmètre : MVP v2.0.0
Source : Existant v1 (v1.0.0:my-portfolio/src/Components/Navigation/Navigation.jsx) ; Existant v1 (v1.0.0:my-portfolio/src/Components/Welcome/Welcome.jsx) ; Décision d'Alexandre du 15/10/2026 : liens externes retenus
En tant que visiteur, je veux accéder aux profils externes d'Alexandre, afin de voir son activité en dehors du site.

Règles métier :
- Les liens repris de l'ancien site sont ceux vers GitHub et LinkedIn ; le lien vers X n'est pas repris (Q-08).
- Les liens sont présents sur toutes les pages (proposition, à valider).
- Ouvrir un lien externe laisse le site ouvert dans la fenêtre d'origine.

Scénarios liés : SC-2.0-27

## Macro-fonction : Contenu durable et obligations

### MF-18 — Micro-fonction : Aucune information qui se périme
Priorité : high     Périmètre : MVP v2.0.0
Source : Contexte « aucune information qui se périme » ; Pitch « Je veux que ce site puisse durer au moins 2 ans sans que j'ai à le retoucher »
En tant qu'Alexandre (propriétaire du site), je veux que le site n'affiche aucune information qui change avec le temps, afin qu'il reste juste sans que j'aie à le retoucher.

Règles métier :
- Aucun âge n'est affiché (Q-01).
- Aucune durée relative ni formulation liée au moment de la lecture n'est utilisée.
- Une date n'est affichée que si elle est précise et fournie par Alexandre (C-01).
- Les situations qui ont une fin sont présentées comme des périodes datées, jamais au présent (Q-02, Q-03, Q-04).

Scénarios liés : SC-2.0-28

### MF-19 — Micro-fonction : Mentions légales
Priorité : high     Périmètre : MVP v2.0.0
Source : Obligation (loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, article à confirmer)
En tant que visiteur, je veux consulter les mentions légales du site, afin de savoir qui l'édite et à qui m'adresser.

Règles métier :
- Un lien vers les mentions légales est présent sur toutes les pages.
- Les mentions donnent le nom d'Alexandre, le contact par le formulaire et l'identité de l'hébergeur ; ni adresse ni téléphone personnels (Q-12).
- Le texte exact reste à valider par Alexandre (proposition, à valider).

Scénarios liés : SC-2.0-29

### MF-20 — Micro-fonction : Information sur l'usage des données du formulaire
Priorité : high     Périmètre : MVP v2.0.0
Source : Obligation (règlement (UE) 2016/679 dit RGPD, article 13)
En tant que visiteur, je veux savoir, avant d'envoyer le formulaire de contact, ce qu'il advient de mes données, afin de décider en connaissance de cause.

Règles métier :
- L'information est visible avant le bouton d'envoi.
- Elle indique qui reçoit les données et pourquoi ; son contenu exact est à valider par Alexandre.

Scénarios liés : SC-2.0-30

## Hors périmètre (v2.0.1)

Micro-fonction de périmètre v2.0.1 : MF-23 (version anglaise). Les besoins utiles mais sans source sont posés en questions ouvertes ; ils rejoindront le MVP ou la v2.0.1 selon la réponse d'Alexandre.

Exclusions décidées :
- Aucun projet OSOL sur le portfolio : décision d'Alexandre du 14/10/2026.
- Aucun projet d'école ni d'entreprise présenté au lancement : décision d'Alexandre du 15/10/2026 (Q-05).
- Le lien vers X de l'ancien site n'est pas repris : décision d'Alexandre du 15/10/2026 (Q-08).
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
- Contexte « ajouter un projet reste possible sans retoucher le reste du site » → comment un projet s'ajoute sans modifier les autres sections, et qui fournit quelles informations.
- Contexte « qui jugent un profil en quelques minutes » → ce que la lecture rapide impose à la hiérarchie des informations et à la rapidité d'affichage, et quels seuils la conception retient.
- Existant v1 (v1.0.0:my-portfolio/src/Components/Infos/Infos.jsx) → comment les messages parviennent à Alexandre, comment le site se protège des messages indésirables, et combien de temps les données saisies sont conservées.
- Existant v1 (v1.0.0:my-portfolio/src/Components/Navigation/Navigation.jsx) → les tailles d'écran et les navigateurs à couvrir.
- Décision d'Alexandre du 13/10/2026 : la pile technique est choisie → la justification de ce choix et de ses écarts éventuels dans la conception technique.
- Décision d'Alexandre du 15/10/2026 (Q-09) → la conception permet d'ajouter la version anglaise sans refaire le site.
- Décision d'Alexandre du 15/10/2026 (Q-11) → le moyen de protection contre les messages indésirables et son test.

## Questions ouvertes pour Alexandre

- Q-06 — Quelles compétences techniques et humaines afficher, et faut-il un niveau pour chacune ? Hypothèse provisoire : seules les compétences fournies par Alexandre (C-02) sont affichées, sans niveau chiffré. Impacte : MF-09, MF-10.
- Q-07 — Quel CV proposer ? Le fichier de l'ancien site a un nom daté et porte une mention de recherche d'alternance. Hypothèse provisoire : un seul CV, en français, fourni par Alexandre (C-03), sous un nom sans date ni mention de situation. Impacte : MF-15.
- Q-10 — Le contact passe-t-il par le formulaire de l'ancien site (nom, prénom, email, sujet, message), ou par un autre moyen ? Dans quelle boîte arrivent les messages ? Hypothèse provisoire : le formulaire de l'ancien site, avec ses cinq champs obligatoires, et les messages arrivent dans une boîte personnelle d'Alexandre. Impacte : MF-16, MF-20.
- Q-15 — Les technologies pratiquées chez OSOL (langages, frameworks) peuvent-elles être nommées ? Hypothèse provisoire : oui comme compétences ; les outils internes, projets, clients et dépôts ne le sont jamais. Impacte : MF-09, MF-11.

## Questions tranchées

- Q-01 — Faut-il afficher un âge ? Décision d'Alexandre du 15/10/2026 : aucun âge n'est affiché. Appliquée dans : MF-01, MF-18.
- Q-02 — Comment formuler le rôle chez OSOL, sachant que l'alternance a une fin ? Décision d'Alexandre du 15/10/2026 : l'alternance est présentée comme une période datée, jamais au présent ; les dates sont fournies par Alexandre (C-01). Période : 2025–2028, l'alternance se terminant avec le master en 2028 (réponse d'Alexandre du 15/10/2026). Appliquée dans : MF-11, MF-18.
- Q-03 — Comment présenter le master, sachant que cette situation a une fin ? Décision d'Alexandre du 15/10/2026 : le master est une étape du parcours présentée comme une période datée, jamais au présent ; les dates sont fournies par Alexandre (C-01). Appliquée dans : MF-07, MF-08, MF-18.
- Q-04 — Quelles dates, intitulés et établissements afficher pour le parcours ? Décision d'Alexandre du 15/10/2026 : les étapes (reconversion, bac+3 avec son intitulé et son établissement, master) sont des périodes datées, avec début et fin au mois ou à l'année ; elles sont fournies par Alexandre (C-01). Appliquée dans : MF-07, MF-18.
- Q-05 — Quels projets présenter au lancement ? Décision d'Alexandre du 15/10/2026 : aucun projet d'école ni d'entreprise ; le portfolio lui-même est le projet présenté ; le site dit que les projets menés en entreprise ne sont pas partageables ; une section explique sa méthodologie de travail et son attachement aux architectures solides ; l'ajout d'un projet plus tard reste possible. Appliquée dans : MF-11, MF-12, MF-14, MF-21, MF-22.
- Q-08 — Quels liens externes garder ? Décision d'Alexandre du 15/10/2026 : GitHub et LinkedIn ; le lien vers X n'est pas repris. Appliquée dans : MF-17.
- Q-09 — Faut-il une version anglaise du site ? Décision d'Alexandre du 15/10/2026 : oui, en v2.0.1 ; le MVP est en français et la conception prévoit l'ajout. Appliquée dans : MF-23.
- Q-11 — Faut-il se protéger des messages indésirables ? Décision d'Alexandre du 15/10/2026 : oui, le formulaire est protégé ; le moyen et son test se décident à l'Étape 4. Appliquée dans : MF-16.
- Q-12 — Que publier dans les mentions légales ? Décision d'Alexandre du 15/10/2026 : le nom d'Alexandre, le contact par le formulaire et l'identité de l'hébergeur ; ni adresse ni téléphone personnels. Appliquée dans : MF-19.
- Q-13 — Quel intitulé de profil afficher à l'accueil ? Décision d'Alexandre du 15/10/2026 : « Développeur fullstack, orienté architecture logicielle ». Appliquée dans : MF-01.
- Q-14 — Faut-il relier chaque compétence aux projets qui la démontrent ? Sans objet depuis la décision sur Q-05 (constat du 15/10/2026, à rouvrir si Alexandre le demande).

## Contenus à fournir par Alexandre

- C-01 — Les périodes datées du parcours : reconversion, bac+3 (avec son intitulé et son établissement), master, alternance chez OSOL. Fourni : alternance chez OSOL 2025–2028 ; fin du master en 2028. Restent à fournir : reconversion, bac+3 (intitulé, établissement, période), début du master. Alimente : MF-07, MF-08, MF-11, MF-18.
- C-02 — La liste des compétences techniques et humaines, avec leurs catégories. Alimente : MF-09, MF-10.
- C-03 — Le CV, en fichier. Alimente : MF-15.
- C-04 — Le texte de la méthodologie de travail et des principes d'architecture. Alimente : MF-21.
- C-05 — La présentation du portfolio comme projet (démarche, architecture, lien vers le code source). Alimente : MF-22.

## Matrice de couverture

| Exigence | Citation exacte | Source | Traité par |
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
| E-10 | ne montre que des projets d'école | Contexte, Problème réel | MF-12, MF-22, Q-05 |
| E-11 | son concept ludique cache le CV et le contact au lieu de les mettre en avant | Contexte, Problème réel | MF-02, MF-15, MF-16 |
| E-12 | liens directs cassés | Contexte, Problème réel | MF-04, MF-05, Reporté Étape 4 |
| E-13 | aucun référencement | Contexte, Problème réel | Reporté Étape 4 |
| E-14 | aucun test | Contexte, Problème réel | Reporté Étape 4 |
| E-15 | Il ne dit rien du poste actuel | Contexte, Problème réel | MF-11, Q-02 |
| E-16 | de l'orientation vers l'architecture logicielle | Contexte, Problème réel | MF-08 |
| E-17 | parcours de reconversion depuis la restauration | Contexte, Problème réel | MF-07, MF-10 |
| E-18 | recruteurs et responsables techniques | Contexte, Utilisateurs visés | MF-01, MF-03 |
| E-19 | qui jugent un profil en quelques minutes | Contexte, Utilisateurs visés | MF-03, MF-06, Reporté Étape 4 |
| E-20 | un site vitrine professionnel et marquant | Contexte, Objectif métier | MF-01, Reporté Étape 4 |
| E-21 | donne envie de recruter Alexandre comme développeur | Contexte, Objectif métier | MF-01, MF-02, MF-16 |
| E-22 | ses compétences techniques et humaines | Contexte, Objectif métier | MF-09, MF-10 |
| E-23 | son parcours (reconversion depuis la restauration, bac+3, master en architecture durable du logiciel) | Contexte, Objectif métier | MF-07, Q-04 |
| E-24 | master en architecture durable du logiciel | Contexte, Objectif métier | MF-07, MF-08, Q-03 |
| E-25 | son rôle d'alternant chez OSOL | Contexte, Objectif métier | MF-11, Q-02 |
| E-26 | (application, backend, appui DevOps sur certaines tâches) | Contexte, Objectif métier | MF-11 |
| E-27 | décrit sans aucun projet interne | Contexte, Objectif métier | MF-11, Hors périmètre |
| E-28 | Il reste juste et fonctionnel au moins deux ans sans refonte | Contexte, Objectif métier | MF-18, Reporté Étape 4 |
| E-29 | aucune information qui se périme | Contexte, Objectif métier | MF-18, Q-01, Q-02, Q-03 |
| E-30 | ajouter un projet reste possible sans retoucher le reste du site | Contexte, Objectif métier | MF-14, Reporté Étape 4 |
