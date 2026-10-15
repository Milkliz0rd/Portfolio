# Parcours d'écrans — Portfolio v2.0.0
Statut : [x] à approuver  [ ] approuvé par : ______
Base : US-2.0 et SC-2.0, approuvés par Alexandre Morozoff le 15/10/26.

Ce document décrit la structure du site, l'ordre de lecture de chaque écran et ses états visibles, pour servir de point de départ aux maquettes. Il ne décide ni de l'aspect visuel (charte graphique, ticket T2.3) ni des moyens techniques (conception technique, ticket T2.1). Les textes définitifs ne sont pas rédigés ici : un contenu à fournir par Alexandre se désigne par son identifiant (C-01 à C-05). Tout choix structurant est une proposition, à valider en section 7.

## 1. Principes de navigation

### PN-01 — Une page unique ou plusieurs pages
Contexte : le site compte neuf espaces de lecture (accueil, parcours, compétences, expérience, avec le rôle chez OSOL, méthode de travail, projets, CV, contact, mentions légales) plus une fiche par projet. Chaque section et chaque fiche doit avoir un lien direct qui survit au rechargement (MF-04), et le site doit pouvoir accueillir une version anglaise en v2.0.1 sans être refait.
Options :

| Option | Pour | Contre |
| --- | --- | --- |
| A. Une page unique qui défile, sections repérées par des ancres | Lecture continue, rapide à parcourir ; une seule arrivée | Les fiches projet n'ont pas de place naturelle (il faudrait quand même des adresses propres) ; le CV et le contact deviennent des ancres parmi d'autres ; une page très longue noie la hiérarchie pour un lecteur pressé ; une adresse de section ne montre pas seule son contenu |
| B. Plusieurs pages, une adresse lisible par section et par fiche projet | Un lien transmis mène exactement au contenu visé (MF-04) ; chaque écran a un rôle clair et un seul sujet ; la fiche projet et les projets ajoutés plus tard suivent la même règle ; une version anglaise s'ajoute sous un préfixe de langue sans toucher aux adresses françaises | Plus d'écrans à maquetter ; le lecteur change de page pour passer d'une section à l'autre ; chaque adresse doit s'ouvrir et se recharger directement, ce que garantit la conception technique (pré-génération des pages, CT-01) et ce qui cassait sur l'ancien site |
| C. Accueil en défilement qui résume les sections, plus des pages dédiées pour le détail | Accueil riche pour le lecteur pressé | Deux façons d'atteindre le même contenu : adresses et navigation plus difficiles à garder cohérentes ; plus de travail de maquette |

Recommandation : option B. Elle répond le plus directement à MF-04 (un lien = un contenu, y compris pour la fiche d'un projet ajouté) et à MF-14 (un projet ajouté a sa fiche et son adresse sans toucher au reste). Un écran par sujet sert aussi la lecture en quelques minutes : l'accueil reste court et renvoie vers le détail. Adresses proposées : /parcours, /competences, /experience, /methode, /projets, /projets/ suivi de l'identifiant du projet, /cv, /contact, /mentions-legales ; l'accueil est la racine du site. Le français est sans préfixe ; l'anglais, en v2.0.1, s'ajouterait sous un préfixe de langue, sans casser aucun lien français déjà transmis. La section sur l'alternance a pour adresse /experience, jamais le nom de l'employeur (décision d'Alexandre du 15/10/2026).
Statut : proposition, à valider
Répond à : MF-03, MF-04, MF-05, MF-14, SC-2.0-04, SC-2.0-05, SC-2.0-06, SC-2.0-07, SC-2.0-08, SC-2.0-20

### PN-02 — Accès permanent au CV et au contact
Contexte : l'ancien site cachait le CV et le contact derrière son concept ludique ; MF-02 impose de les atteindre depuis n'importe quelle page, avec la proposition « un clic » à valider.
Options :

| Option | Pour | Contre |
| --- | --- | --- |
| A. Deux entrées « CV » et « Contact » dans l'en-tête, visibles en permanence et distinguées des autres entrées de navigation | Un clic depuis n'importe quel écran, sans ouvrir de menu ; vaut aussi sur téléphone ; l'élément commun est le même partout (SC-2.0-04) | Demande de la place dans l'en-tête, surtout sur petit écran |
| B. CV et contact comme deux entrées parmi les autres du menu | Navigation homogène, en-tête allégé | Sur téléphone, il faut ouvrir le menu d'abord : deux clics, contraire à MF-02 |
| C. Bouton flottant permanent « Contact » en plus du menu | Toujours à portée du pouce | Cache du contenu ; double emploi avec le menu ; le CV reste enfoui |

Recommandation : option A. C'est la seule qui tient la promesse « un clic » sur téléphone comme sur grand écran. Le CV et le contact figurent dans le bloc d'éléments communs (EC-00) et sont répétés en tête de l'accueil (EC-01) pour le lecteur pressé.
Statut : proposition, à valider
Répond à : MF-02, MF-15, MF-16, SC-2.0-02, SC-2.0-03, SC-2.0-21

### PN-03 — Navigation sur téléphone
Contexte : MF-06 exige que toutes les sections, la navigation, les fiches projet et le formulaire restent utilisables sur téléphone, sans défilement horizontal, et que la navigation reste accessible depuis chaque page (SC-2.0-09). Il y a beaucoup d'entrées (six sections, plus le CV et le contact).
Options :

| Option | Pour | Contre |
| --- | --- | --- |
| A. Menu replié (un bouton ouvre la liste des sections) ; CV et Contact restent visibles hors du menu | Libère la place ; conserve PN-02 ; le menu ouvert liste toutes les sections | Une section demande deux gestes (ouvrir, choisir) |
| B. Barre de navigation fixe en bas de l'écran, avec toutes les entrées | Toutes les entrées en un geste | Six à huit entrées ne tiennent pas lisiblement sur un petit écran ; la barre masque le bas du contenu et le bouton d'envoi du formulaire |
| C. La navigation complète reste affichée en tête, sur plusieurs lignes | Aucun menu à ouvrir | Occupe une grande partie de l'écran avant tout contenu ; contraire à la hiérarchie de lecture |

Recommandation : option A. Les sections secondaires passent dans le menu replié, le CV et le contact restent hors du menu, toujours visibles. Le menu replié est présent sur toutes les pages, y compris la page introuvable. Les largeurs d'écran à couvrir sont à fixer avec la charte (voir V-04).
Statut : proposition, à valider
Répond à : MF-02, MF-03, MF-06, SC-2.0-04, SC-2.0-09

### PN-04 — Forme de l'accès au CV
Contexte : MF-15 demande de consulter et télécharger le CV, et d'indiquer son indisponibilité en proposant le contact. SC-2.0-21 dit « il obtient le CV ».
Options :

| Option | Pour | Contre |
| --- | --- | --- |
| A. Entrée « CV » qui mène à un écran dédié, avec consultation et téléchargement | Une place pour le message d'indisponibilité et pour le renvoi vers le contact ; le CV a une adresse partageable | Le téléchargement demande un second clic après l'arrivée sur l'écran |
| B. Entrée « CV » qui déclenche directement le téléchargement | Un seul clic jusqu'au fichier | Aucun endroit où afficher l'indisponibilité sans quitter la page ; pas d'adresse partageable ; le lecteur sur téléphone reçoit un fichier sans l'avoir choisi |

Recommandation : option A. L'écran CV est atteint en un clic, le téléchargement est à un clic de plus. Si Alexandre préfère que « un clic » veuille dire « le fichier », c'est l'option B, au prix des états décrits dans EC-08.
Statut : proposition, à valider
Répond à : MF-02, MF-15, SC-2.0-21, SC-2.0-22

## 2. Plan du site

| Identifiant | Nom | Adresse |
| --- | --- | --- |
| EC-00 | Éléments communs | toutes les pages |
| EC-01 | Accueil | / |
| EC-02 | Parcours | /parcours |
| EC-03 | Compétences | /competences |
| EC-04 | Expérience | /experience |
| EC-05 | Méthode de travail | /methode |
| EC-06 | Liste des projets | /projets |
| EC-07 | Fiche d'un projet | /projets/ suivi de l'identifiant du projet (au lancement : /projets/portfolio) |
| EC-08 | CV | /cv |
| EC-09 | Contact | /contact |
| EC-10 | Mentions légales | /mentions-legales |
| EC-11 | Page introuvable | toute adresse qui ne correspond à aucun écran ci-dessus, y compris celle d'un projet inexistant |

Arborescence :

- Accueil
  - Parcours
  - Compétences
  - Expérience (rôle chez OSOL)
  - Méthode de travail
  - Projets
    - Fiche d'un projet (au lancement, une seule : le portfolio)
  - CV
  - Contact
  - Mentions légales
- Page introuvable (hors arborescence : atteinte par toute adresse inconnue, y compris l'adresse d'un projet inexistant)

L'adresse d'un projet inexistant (/projets/ suivi d'un identifiant inconnu) mène à EC-11, seul écran qui décrit cet état ; EC-07 y renvoie.

Les éléments communs (EC-00) sont présents sur toutes les pages, page introuvable comprise.

## 3. Écrans

### EC-00 — Écran : Éléments communs
Adresse : toutes les pages
Micro-fonctions : MF-02, MF-03, MF-06, MF-17, MF-19
Scénarios : SC-2.0-02, SC-2.0-03, SC-2.0-04, SC-2.0-09, SC-2.0-21, SC-2.0-27, SC-2.0-29
Contenu, dans l'ordre de lecture :
- En-tête : nom Alexandre Morozoff, qui ramène à l'accueil — MF-03
- Navigation : une entrée par section (accueil, parcours, compétences, expérience, méthode de travail, projets), identique sur toutes les pages, l'entrée de la page courante étant signalée — MF-03
- Entrées « CV » et « Contact », distinguées des autres et visibles en permanence — MF-02
- Pied de page : liens vers GitHub et LinkedIn (aucun lien vers X) — MF-17
- Pied de page : lien vers les mentions légales — MF-19
Actions :
- Choisir une entrée de navigation : mène à l'écran de la section (EC-01 à EC-06)
- Choisir « CV » : mène à EC-08, en un clic depuis n'importe quelle page (PN-02, PN-04)
- Choisir « Contact » : mène à EC-09, en un clic depuis n'importe quelle page
- Choisir le lien GitHub ou LinkedIn : ouvre le profil dans un nouvel onglet, le site reste ouvert dans l'onglet d'origine
- Choisir « Mentions légales » : mène à EC-10
États : nominal, entrée courante signalée, menu replié (téléphone), menu déplié (téléphone), page sans section courante
- nominal : toutes les entrées visibles, y compris CV et Contact
- entrée courante signalée : l'entrée de l'écran affiché est reconnaissable ; sur la fiche d'un projet, l'entrée « Projets » est la courante
- menu replié (téléphone) : un seul bouton de menu, CV et Contact restent visibles à côté
- menu déplié (téléphone) : la liste de toutes les sections s'affiche ; la refermer ramène à la page sans changer d'écran
- page sans section courante : sur la page introuvable ou les mentions légales, aucune entrée n'est signalée, toutes restent utilisables
Téléphone : navigation selon PN-03 (menu replié, CV et Contact toujours visibles hors du menu) ; le pied de page se lit en colonne ; aucune entrée n'est coupée ni ne nécessite de défilement horizontal

### EC-01 — Écran : Accueil
Adresse : /
Micro-fonctions : MF-01, MF-02, MF-18
Scénarios : SC-2.0-01, SC-2.0-02, SC-2.0-28
Contenu, dans l'ordre de lecture :
- Nom Alexandre Morozoff et intitulé « Développeur fullstack, orienté architecture logicielle » — MF-01
- Courte présentation d'Alexandre, sans âge ni formulation qui se périme — MF-01, MF-18 (texte à fournir par Alexandre : voir V-05)
- Accès mis en avant au CV et au contact, répétant ceux d'EC-00 — MF-02
- Entrées vers les sections parcours, compétences, expérience, méthode de travail et projets, avec une phrase d'orientation chacune — MF-01
Actions :
- Choisir « CV » : mène à EC-08
- Choisir « Contact » : mène à EC-09
- Choisir une entrée de section : mène à l'écran correspondant (EC-02 à EC-06)
États : nominal
- nominal : l'écran est composé de contenu fixe ; il n'a pas de cas d'échec propre. Si le contenu tarde, le nom et l'intitulé s'affichent en premier et les accès au CV et au contact restent utilisables
Téléphone : une seule colonne ; l'ordre de lecture est conservé (identité, présentation, CV et contact, sections) ; les accès au CV et au contact restent visibles sans défilement long

### EC-02 — Écran : Parcours
Adresse : /parcours
Micro-fonctions : MF-04, MF-07, MF-08, MF-18
Scénarios : SC-2.0-05, SC-2.0-10, SC-2.0-11, SC-2.0-28
Contenu, dans l'ordre de lecture :
- Titre de la section et phrase d'introduction — MF-07
- Texte d'orientation vers l'architecture logicielle, citant le master en architecture durable du logiciel comme étape — MF-08 (texte à fournir par Alexandre : voir V-05)
- Étape 1, reconversion depuis la restauration, avec sa période datée — MF-07, C-01
- Étape 2, bac+3, avec son intitulé, son établissement et sa période — MF-07, C-01
- Étape 3, master en architecture durable du logiciel, avec sa période — MF-07, MF-08, C-01
Actions :
- Aucune action propre ; navigation et accès au CV et au contact par EC-00
- Lien direct vers cet écran : /parcours, qui survit au rechargement
États : nominal
- nominal : trois étapes dans l'ordre reconversion, bac+3, master ; chaque période a un début et une fin ; aucune durée relative, aucun âge ; aucune date n'est inventée ni laissée vide à l'écran (la condition de mise en ligne liée à C-01 est une proposition, voir V-05)
Téléphone : les étapes se lisent l'une sous l'autre, période en tête de chaque étape ; aucun contenu coupé

### EC-03 — Écran : Compétences
Adresse : /competences
Micro-fonctions : MF-04, MF-09, MF-10, MF-18
Scénarios : SC-2.0-05, SC-2.0-12, SC-2.0-13, SC-2.0-28
Contenu, dans l'ordre de lecture :
- Titre de la section — MF-09
- Compétences techniques regroupées par catégorie, seulement celles de la liste fournie — MF-09, C-02
- Compétences humaines — MF-10, C-02
- Récit de la reconversion depuis la restauration, rattaché aux compétences humaines et montrant en quoi elle les illustre — MF-10
Actions :
- Aucune action propre ; navigation et accès au CV et au contact par EC-00
- Lien direct vers cet écran : /competences
États : nominal, catégorie sans compétence
- nominal : catégories et compétences telles que fournies, sans niveau chiffré sauf accord d'Alexandre
- catégorie sans compétence : une catégorie sans élément n'est pas affichée ; aucune zone vide
Téléphone : les catégories se lisent l'une sous l'autre ; une compétence ne dépasse jamais la largeur de l'écran

### EC-04 — Écran : Expérience
Adresse : /experience
Micro-fonctions : MF-04, MF-11, MF-18
Scénarios : SC-2.0-05, SC-2.0-14, SC-2.0-28
Contenu, dans l'ordre de lecture :
- Titre de la section (« Expérience ») et période de l'alternance, 2025–2028 ; l'écran présente le rôle chez OSOL — MF-11, C-01
- Rôle en trois volets : application, backend, appui DevOps sur certaines tâches (présenté comme un appui, pas comme un poste) — MF-11
- Mention que les projets menés en entreprise ne sont pas partageables — MF-11
Actions :
- Aucune action propre ; navigation et accès au CV et au contact par EC-00
- Lien direct vers cet écran : /experience, qui survit au rechargement (MF-04)
États : nominal
- nominal : aucun projet, client, outil interne, dépôt ni collègue nommé ; la période est une période datée, jamais formulée au présent
Téléphone : les trois volets se lisent l'un sous l'autre

### EC-05 — Écran : Méthode de travail
Adresse : /methode
Micro-fonctions : MF-04, MF-18, MF-21
Scénarios : SC-2.0-05, SC-2.0-28, SC-2.0-31
Contenu, dans l'ordre de lecture :
- Titre de la section — MF-21
- Texte de la méthodologie de travail et de l'attachement aux architectures solides — MF-21, C-04
- Renvoi vers la fiche du portfolio, qui illustre la méthode — MF-21
Actions :
- Suivre le renvoi vers la fiche du portfolio : mène à EC-07 (/projets/portfolio)
- Lien direct vers cet écran : /methode
États : nominal, renvoi vers un projet absent
- nominal : texte et renvoi affichés ; aucun document interne, client, projet, outil interne ni dépôt d'entreprise nommé
- renvoi vers un projet absent : si la fiche visée n'existait plus, le renvoi mènerait à la page introuvable (EC-11) ; le renvoi est donc retiré de l'écran plutôt que laissé cassé
Téléphone : le texte se lit en une colonne ; le renvoi reste visible à la fin du texte

### EC-06 — Écran : Liste des projets
Adresse : /projets
Micro-fonctions : MF-04, MF-06, MF-12, MF-14, MF-18, MF-22
Scénarios : SC-2.0-05, SC-2.0-09, SC-2.0-15, SC-2.0-19, SC-2.0-28
Contenu, dans l'ordre de lecture :
- Titre de la section — MF-12
- Liste des projets, chacun avec son titre et un accès à sa fiche ; au lancement, un seul élément, le portfolio — MF-12, MF-22
- Mention que les projets menés en entreprise ne sont pas partageables — MF-12
Actions :
- Choisir un projet : mène à sa fiche (EC-07)
- Lien direct vers cet écran : /projets
États : nominal, plusieurs projets, liste vide
- nominal : la liste existe même avec un seul projet ; aucun projet d'école ni d'entreprise
- plusieurs projets : un projet ajouté apparaît dans la liste sans que les autres changent (MF-14)
- liste vide : un message l'indique ; la mention sur les projets d'entreprise reste affichée ; ne doit pas se produire au lancement
- aucun état de chargement ni d'indisponibilité : le contenu des projets est intégré aux pages au moment de la construction du site (conception technique, CT-03)
Téléphone : un projet par ligne ; le titre n'est jamais coupé

### EC-07 — Écran : Fiche d'un projet
Adresse : /projets/ suivi de l'identifiant du projet (au lancement : /projets/portfolio)
Micro-fonctions : MF-04, MF-05, MF-06, MF-13, MF-14, MF-18, MF-22
Scénarios : SC-2.0-03, SC-2.0-06, SC-2.0-07, SC-2.0-09, SC-2.0-16, SC-2.0-17, SC-2.0-18, SC-2.0-19, SC-2.0-20, SC-2.0-28, SC-2.0-32
Contenu, dans l'ordre de lecture :
- Titre du projet — MF-13
- Description du projet ; pour le portfolio, la démarche et l'architecture du site — MF-13, MF-22, C-05
- Captures du projet, seulement s'il y en a — MF-13
- Lien vers le code source, seulement s'il existe ; pour le portfolio, le code source public — MF-13, MF-22, C-05
- Retour vers la liste des projets — MF-12
Actions :
- Choisir le lien vers le code source : ouvre le code source dans un nouvel onglet, le site reste ouvert
- Revenir à la liste : mène à EC-06
- Demander le CV ou le contact : un clic, via EC-00
États : nominal complet, sans capture, sans lien vers le code source, projet inexistant
- nominal complet : titre, description, captures et lien vers le code source
- sans capture : titre et description s'affichent ; aucune zone vide ni image absente à la place des captures
- sans lien vers le code source : titre et description s'affichent ; aucun lien ni bouton de code source
- projet inexistant : l'adresse mène à la page introuvable ; cet état est décrit en EC-11 et nulle part ailleurs
- aucun état de chargement ni d'indisponibilité : le contenu des projets est intégré aux pages au moment de la construction du site (conception technique, CT-03)
Téléphone : le titre, la description, les captures puis le lien se lisent en une colonne ; les captures tiennent dans la largeur de l'écran ; le CV et le contact restent visibles

### EC-08 — Écran : CV
Adresse : /cv
Micro-fonctions : MF-04, MF-15
Scénarios : SC-2.0-05, SC-2.0-21, SC-2.0-22
Contenu, dans l'ordre de lecture :
- Titre de la section — MF-15
- Action de consultation du CV — MF-15, C-03
- Action de téléchargement du CV, le fichier portant un nom sans date ni mention de situation — MF-15, C-03
Actions :
- Consulter le CV : l'ouvre pour lecture dans un nouvel onglet, comme les liens externes ; le site reste ouvert sur EC-08 dans l'onglet d'origine
- Télécharger le CV : le fichier est reçu sur l'appareil ; le visiteur reste sur EC-08
- Choisir le contact, depuis le message d'indisponibilité : mène à EC-09
- Lien direct vers cet écran : /cv
États : nominal, téléchargement en cours, CV indisponible
- nominal : les deux actions sont disponibles
- téléchargement en cours : l'action indique que la demande est prise en compte et ne se déclenche pas deux fois
- CV indisponible : un message indique que le CV est momentanément indisponible et propose le contact (lien vers EC-09) ; les actions de consultation et de téléchargement ne sont plus proposées
Téléphone : les deux actions sont des commandes larges et espacées ; le message d'indisponibilité se lit sans défilement horizontal

### EC-09 — Écran : Contact
Adresse : /contact
Micro-fonctions : MF-04, MF-06, MF-16, MF-18, MF-20
Scénarios : SC-2.0-05, SC-2.0-09, SC-2.0-23, SC-2.0-24, SC-2.0-25, SC-2.0-26, SC-2.0-28, SC-2.0-30
Contenu, dans l'ordre de lecture :
- Titre de la section — MF-16
- Champs nom, prénom, email, sujet, message, tous obligatoires — MF-16
- Information sur l'usage des données : qui les reçoit et pourquoi, placée avant le bouton d'envoi — MF-20
- Bouton d'envoi — MF-16
- Emplacement du message de confirmation ou d'erreur, visible sans défilement depuis le bouton — MF-16
Actions :
- Remplir les champs et envoyer : le message part, la confirmation s'affiche sur l'écran
- Demander le CV : un clic, via EC-00 (mène à EC-08)
- Lien direct vers cet écran : /contact
États : nominal, champ manquant, email invalide, envoi en cours, envoi réussi, envoi échoué
- nominal : formulaire vide, information sur les données visible avant le bouton ; aucune vérification anti-spam n'est affichée au visiteur (V-06)
- champ manquant : un message près du champ concerné indique qu'il est obligatoire ; rien n'est envoyé ; les autres champs gardent leur saisie
- email invalide : un message près du champ email indique que l'adresse n'est pas valide ; rien n'est envoyé ; la saisie est conservée
- envoi en cours : le bouton est inactif et indique l'attente, pour éviter un double envoi ; la saisie reste affichée ; l'attente peut durer jusqu'à 90 secondes quand le service d'envoi se réveille
- envoi réussi : une confirmation s'affiche et les champs sont vidés
- envoi échoué : un message d'erreur visible indique que l'envoi a échoué et qu'il est possible de réessayer ; la saisie est conservée ; la protection contre les messages indésirables est invisible pour le visiteur ; un envoi refusé par elle affiche ce même message réessayable (voir V-06)
Téléphone : une colonne ; chaque champ occupe toute la largeur ; le bouton d'envoi et le message de résultat restent atteignables sans défilement horizontal ; le formulaire peut être rempli et envoyé

### EC-10 — Écran : Mentions légales
Adresse : /mentions-legales
Micro-fonctions : MF-04, MF-18, MF-19
Scénarios : SC-2.0-05, SC-2.0-28, SC-2.0-29
Contenu, dans l'ordre de lecture :
- Titre de la page — MF-19
- Nom d'Alexandre Morozoff, éditeur du site — MF-19
- Contact par le formulaire, avec un lien vers EC-09 — MF-19
- Identité de l'hébergeur — MF-19
Actions :
- Aller au formulaire de contact : mène à EC-09
- Lien direct vers cet écran : /mentions-legales
États : nominal
- nominal : aucune adresse ni aucun téléphone personnels ; le texte exact est à valider par Alexandre
Téléphone : le texte se lit en une colonne, sans coupure

### EC-11 — Écran : Page introuvable
Adresse : toute adresse qui ne correspond à aucun écran ci-dessus
Micro-fonctions : MF-04, MF-05
Scénarios : SC-2.0-07, SC-2.0-08
Contenu, dans l'ordre de lecture :
- Message clair indiquant que la page n'existe pas — MF-05
- Retour à l'accueil — MF-05
- Retour vers la liste des projets, quand l'adresse visée était celle d'un projet — MF-04
Actions :
- Revenir à l'accueil : mène à EC-01
- Revenir à la liste des projets : mène à EC-06
- Utiliser la navigation ou les accès au CV et au contact : via EC-00
États : adresse inconnue, projet inexistant
- adresse inconnue : message, retour à l'accueil, navigation visible
- projet inexistant : adresse de la forme /projets/ suivie d'un identifiant inconnu ; même écran, avec en plus le retour vers la liste des projets ; cet écran est l'unique description de cet état (EC-07 y renvoie)
Téléphone : le message et le retour à l'accueil se lisent sans défilement ; le menu replié reste présent

## 4. Parcours types

### PT-01 — Le recruteur pressé
Arrivée sur l'accueil, puis CV ou contact en un clic.
- Suite d'écrans : EC-01 (Accueil) → EC-08 (CV) ; variante : EC-01 → EC-09 (Contact)
- Scénarios joués : SC-2.0-01, SC-2.0-02, SC-2.0-21 ; en variante, SC-2.0-22 (CV indisponible, renvoi vers EC-09), SC-2.0-23, SC-2.0-24, SC-2.0-25, SC-2.0-26, SC-2.0-30
- Ce que le parcours vérifie : sans exploration préalable, le CV et le contact sont à un clic depuis l'accueil, et le formulaire montre ses états d'erreur et de réussite.

### PT-02 — Le responsable technique
Arrivée, méthode de travail, fiche du portfolio, code source.
- Suite d'écrans : EC-01 (Accueil) → EC-05 (Méthode de travail) → EC-07 (fiche du portfolio) → code source (lien externe, nouvel onglet)
- Scénarios joués : SC-2.0-01, SC-2.0-04, SC-2.0-31, SC-2.0-32, SC-2.0-16
- Variantes : EC-01 → EC-03 (Compétences) puis EC-06 (Liste des projets) → EC-07 ; SC-2.0-12, SC-2.0-15, SC-2.0-17, SC-2.0-18 pour les fiches sans lien ou sans capture
- Ce que le parcours vérifie : le renvoi de la méthode mène à la fiche du portfolio, qui mène au code source public.

### PT-03 — L'arrivée par un lien direct
Fiche ou section ouverte directement, puis adresse inconnue.
- Suite d'écrans : EC-03 (section ouverte par lien direct, puis rechargée : SC-2.0-05) → EC-07 (fiche ouverte par lien direct : SC-2.0-06) → EC-08 (CV, ou EC-09 pour le contact, atteint depuis la fiche : SC-2.0-03) → EC-05 (autre section, via la navigation : SC-2.0-04) → adresse d'un projet inexistant → EC-11 (Page introuvable : SC-2.0-07) → adresse inconnue → EC-11 (SC-2.0-08) → EC-01 (retour à l'accueil)
- Scénarios joués : SC-2.0-05, SC-2.0-06, SC-2.0-03, SC-2.0-04, SC-2.0-07, SC-2.0-08
- Variante : lien vers un projet ajouté plus tard, SC-2.0-20
- Ce que le parcours vérifie : chaque lien mène au bon contenu sans passer par l'accueil, le rechargement garde la page, et une adresse fausse ne laisse jamais un écran vide.

### PT-04 — Le visiteur sur téléphone
Lecture de l'accueil, d'une section, d'une fiche, puis envoi d'un message.
- Suite d'écrans : EC-01 → EC-00 (menu déplié) → EC-06 → EC-07 → EC-09 → EC-10
- Scénarios joués : SC-2.0-09, SC-2.0-04, SC-2.0-23, SC-2.0-30, SC-2.0-29
- Ce que le parcours vérifie : aucun défilement horizontal, navigation accessible depuis chaque page, formulaire utilisable.

### PT-05 — Alexandre ajoute un projet
Un projet ajouté apparaît dans la liste et a sa fiche, sans modifier le reste du site.
- Suite d'écrans : EC-06 (le projet apparaît dans la liste) → EC-07 (sa fiche) ; les autres écrans sont inchangés
- Scénarios joués : SC-2.0-19, SC-2.0-20
- Ce que le parcours vérifie : l'ajout d'un projet ne modifie aucune autre section.

## 5. Couverture des micro-fonctions

| MF | Titre | Écrans |
| --- | --- | --- |
| MF-01 | Page d'accueil qui présente Alexandre | EC-01 |
| MF-02 | CV et contact accessibles en permanence | EC-00, EC-01 |
| MF-03 | Navigation entre les sections | EC-00 |
| MF-04 | Liens directs vers les pages | EC-02 à EC-11 |
| MF-05 | Page introuvable | EC-07, EC-11 |
| MF-06 | Consultation sur téléphone | EC-00, EC-06, EC-07, EC-09 |
| MF-07 | Parcours d'Alexandre | EC-02 |
| MF-08 | Orientation vers l'architecture logicielle | EC-02 |
| MF-09 | Compétences techniques | EC-03 |
| MF-10 | Compétences humaines et reconversion | EC-03 |
| MF-11 | Rôle chez OSOL | EC-04 |
| MF-12 | Liste des projets | EC-06 |
| MF-13 | Fiche d'un projet | EC-07 |
| MF-14 | Ajouter un projet sans toucher au reste du site | EC-06, EC-07 |
| MF-15 | Consulter et télécharger le CV | EC-08 |
| MF-16 | Envoyer un message à Alexandre | EC-09 |
| MF-17 | Liens vers les profils externes | EC-00 |
| MF-18 | Aucune information qui se périme | EC-01 à EC-07, EC-09, EC-10 |
| MF-19 | Mentions légales | EC-00, EC-10 |
| MF-20 | Information sur l'usage des données du formulaire | EC-09 |
| MF-21 | Méthodologie de travail | EC-05 |
| MF-22 | Le portfolio présenté comme projet | EC-06, EC-07 |
| MF-23 | Version anglaise | hors MVP (v2.0.1) |

## 6. Couverture des scénarios

| SC | Titre | Écran(s) |
| --- | --- | --- |
| SC-2.0-01 | Arrivée sur la page d'accueil | EC-01 |
| SC-2.0-02 | CV et contact atteints depuis l'accueil | EC-00, EC-01 |
| SC-2.0-03 | CV et contact atteints depuis une fiche projet | EC-00, EC-07 |
| SC-2.0-04 | Navigation entre les sections | EC-00 |
| SC-2.0-05 | Lien direct vers une section | EC-02 à EC-06, EC-08 à EC-10 |
| SC-2.0-06 | Lien direct vers la fiche d'un projet | EC-07 |
| SC-2.0-07 | Lien direct vers un projet qui n'existe pas | EC-07, EC-11 |
| SC-2.0-08 | Adresse inconnue | EC-11 |
| SC-2.0-09 | Consultation sur téléphone | EC-00, EC-06, EC-07, EC-09 |
| SC-2.0-10 | Parcours d'Alexandre | EC-02 |
| SC-2.0-11 | Orientation vers l'architecture logicielle | EC-02 |
| SC-2.0-12 | Compétences techniques | EC-03 |
| SC-2.0-13 | Compétences humaines et reconversion | EC-03 |
| SC-2.0-14 | Rôle chez OSOL | EC-04 |
| SC-2.0-15 | Liste des projets | EC-06 |
| SC-2.0-16 | Fiche d'un projet complet | EC-07 |
| SC-2.0-17 | Fiche d'un projet sans lien vers son code source | EC-07 |
| SC-2.0-18 | Fiche d'un projet sans capture | EC-07 |
| SC-2.0-19 | Ajout d'un projet | EC-06, EC-07 |
| SC-2.0-20 | Lien direct vers un projet ajouté | EC-07 |
| SC-2.0-21 | Téléchargement du CV | EC-00, EC-08 |
| SC-2.0-22 | CV indisponible | EC-08 |
| SC-2.0-23 | Envoi d'un message de contact | EC-09 |
| SC-2.0-24 | Champ obligatoire vide | EC-09 |
| SC-2.0-25 | Email invalide | EC-09 |
| SC-2.0-26 | Envoi qui échoue | EC-09 |
| SC-2.0-27 | Liens vers les profils externes | EC-00 |
| SC-2.0-28 | Aucune information qui se périme | EC-01 à EC-07, EC-09, EC-10 |
| SC-2.0-29 | Accès aux mentions légales | EC-00, EC-10 |
| SC-2.0-30 | Information sur l'usage des données du formulaire | EC-09 |
| SC-2.0-31 | Méthodologie de travail | EC-05 |
| SC-2.0-32 | Le portfolio présenté comme projet | EC-07 |

## 7. Points à valider par Alexandre

- V-01 — Choix d'une adresse par section et par fiche (PN-01, option B) plutôt qu'une page unique. Recommandation : valider B ; elle satisfait MF-04 dans tous les cas, au prix de quelques écrans de plus à maquetter. Impact sur la version anglaise (MF-23) : aucun obstacle, l'anglais s'ajoutera sous un préfixe de langue ; seule contrainte, ne pas préfixer le français aujourd'hui, pour ne pas changer des adresses qui seront déjà transmises. Réponse d'Alexandre du 15/10/2026 : recommandation acceptée.
- V-02 — « Un clic » pour le CV et le contact (PN-02, PN-04). Recommandation : un clic jusqu'à l'écran CV, un second pour télécharger. Si un clic doit mener jusqu'au fichier, il faut passer à l'option B de PN-04 et accepter qu'un CV indisponible se signale autrement. Le CV s'ouvre dans un nouvel onglet, comme les liens externes : EC-00 et EC-08 restent ouverts dans l'onglet d'origine. Réponse d'Alexandre du 15/10/2026 : recommandation acceptée.
- V-03 — Navigation sur téléphone (PN-03). Recommandation : menu replié, CV et Contact toujours visibles hors du menu. Réponse d'Alexandre du 15/10/2026 : recommandation acceptée.
- V-04 — Largeurs d'écran et navigateurs à couvrir (MF-06 les renvoie à l'Étape 4). Recommandation : couvrir de la plus étroite des largeurs de téléphone courantes jusqu'au grand écran, et fixer les valeurs exactes avec la conception technique et la charte, pas ici. Réponse d'Alexandre du 15/10/2026 : largeurs d'écran fixées par la charte (T2.3), navigateurs à couvrir par la conception technique (CT-10).
- V-05 — Contenus manquants qui conditionnent l'affichage : C-01 est incomplet (reconversion, bac+3, début du master) ; C-02 à C-05 ne sont pas fournis ; cinq textes à fournir ne sont couverts par aucun identifiant C-xx : la présentation courte de l'accueil (MF-01), le récit de reconversion (MF-10), la description des trois volets du rôle (MF-11), le texte d'orientation vers l'architecture (MF-08) et les phrases d'introduction des sections (accueil, parcours). Recommandation : les ajouter aux contenus des US par une mise à jour séparée de ces documents, et ne pas mettre en ligne tant que les périodes ne sont pas complètes. Réponse d'Alexandre du 15/10/2026 : recommandation acceptée.
- V-06 — Protection du formulaire contre les messages indésirables (MF-16). La protection est invisible pour le visiteur (conception technique, CT-08) : rien n'est ajouté à EC-09, et un envoi refusé par la protection affiche le même message d'échec réessayable que les autres cas. Réponse d'Alexandre du 15/10/2026 : recommandation acceptée.
- V-07 — Liens GitHub et LinkedIn dans le pied de page seulement (MF-17 : « Les liens sont présents sur toutes les pages (proposition, à valider). »). Recommandation : pied de page, pour garder l'en-tête réservé aux sections, au CV et au contact. Réponse d'Alexandre du 15/10/2026 : recommandation acceptée.
- V-08 — Une fiche projet sans description ou sans titre n'est pas prévue par les scénarios. Recommandation : exiger un titre et une description pour tout projet ajouté, et ne gérer que l'absence de captures et de lien. Réponse d'Alexandre du 15/10/2026 : recommandation acceptée.
- V-09 — Le renvoi de la méthode vers la fiche du portfolio (MF-21) : il existe tant que la fiche existe et disparaît avec elle, pour qu'aucun lien cassé ne subsiste ; ce comportement relève du parcours d'écrans (EC-05) et n'est pas demandé par les scénarios. Recommandation : le garder. Réponse d'Alexandre du 15/10/2026 : recommandation acceptée.
