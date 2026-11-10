# Parcours d'écrans — Portfolio v2.0.0
Statut : [x] à approuver  [x] approuvé par : Alexandre Morozoff le 16/10/26 ; révision du 10/11/26 (one-pager et retrait du CV), approuvée par la fusion de sa PR
Base : US-2.0 et SC-2.0, approuvés par Alexandre Morozoff le 15/10/26.

Ce document décrit la structure du site, l'ordre de lecture de chaque écran et ses états visibles, pour servir de point de départ aux maquettes. Il ne décide ni de l'aspect visuel (charte graphique, ticket T2.3) ni des moyens techniques (conception technique, ticket T2.1). Les textes définitifs ne sont pas rédigés ici : un contenu à fournir par Alexandre se désigne par son identifiant (C-01, C-02, C-04 et C-05) ou, à défaut, par son nom (voir V-05). Tout choix structurant est une proposition, à valider en section 7.

## Révision du 10/11/2026

Le 10/11/2026, Alexandre a décidé que le site tient sur une page principale qui défile (accueil, parcours, compétences, expérience, méthode de travail, projets), avec des pages à part pour la fiche de chaque projet, le contact et les mentions légales, et qu'il n'a plus de CV du tout.

| Élément | Avant | Après | Raison |
| --- | --- | --- | --- |
| En-tête | Approuvé le 16/10/26 | Mentionne aussi cette révision, approuvée par la fusion de sa PR | Garder la trace de la révision |
| Introduction | Les contenus à fournir se désignent de C-01 à C-05 | Ils se désignent C-01, C-02, C-04 et C-05 | Le fichier du CV (C-03) n'est plus demandé |
| PN-01 — Une page ou plusieurs pages | Neuf espaces de lecture, dont le CV ; trois options ; recommandation B (une adresse par section), signée le 16/10/2026 | Huit espaces, sans CV ; l'option A ne cite plus le CV ; une option D ajoutée ; la recommandation B reste écrite, suivie d'une ligne de révision et de la décision d'Alexandre : option D, avec ses adresses ; SC-2.0-19 ajouté à « Répond à » | La décision ; SC-2.0-19 parce qu'un projet ajouté garde sa propre adresse sans toucher au reste |
| PN-02 — Accès permanent | Au CV et au contact : deux entrées « CV » et « Contact » dans l'en-tête ; le contexte résumait la fiche de base et disait le « un clic » à valider | Au contact seul : une entrée « Contact », distinguée des autres et visible en permanence, y compris sur téléphone hors du menu replié ; le contexte cite la fiche de base mot pour mot et dit le « un clic » validé (V-02) ; MF-15 et SC-2.0-21 ôtés de « Répond à » ; une ligne de révision | Plus de CV |
| PN-03 — Navigation sur téléphone | Six sections, plus le CV et le contact ; le CV et le contact restent hors du menu replié | Six sections, plus le contact ; le menu replié liste les sections ; le contact seul reste hors du menu ; une ligne de révision | Plus de CV |
| PN-04 — Forme de l'accès au CV | Un écran CV atteint en un clic, avec consultation et téléchargement | Retiré : il garde son titre et une ligne de statut | Plus de CV |
| Section 2 — Plan du site | Un écran par adresse (/parcours, /competences, /cv…) ; l'accueil en tête de l'arborescence | Une colonne « Place » : l'accueil et cinq sections sur la page principale (/, /#parcours, /#competences, /#experience, /#methode, /#projets) ; à part, la fiche d'un projet, le contact, les mentions légales et la page introuvable ; plus de ligne CV ; l'ordre de lecture, le retour de la fiche vers /#projets et l'arborescence sont écrits | La décision |
| Section 3 — Titre et vocabulaire | Titre « Écrans » ; EC-01 à EC-06 se disent « écran » | Titre « Sections et écrans » ; EC-01 à EC-06 se disent « section », dans leur titre comme dans leur texte | EC-01 à EC-06 deviennent des sections de la page principale |
| EC-00 — Éléments communs | Entrées « CV » et « Contact » ; une entrée mène à l'écran de sa section ; l'entrée de la page affichée est signalée ; le nom ramène à l'accueil | Entrée « Contact » seule ; une entrée fait défiler la page principale jusqu'à sa section, ou y mène depuis une page à part ; l'entrée de la section lue est signalée pendant la lecture, « Projets » sur une fiche, « Contact » sur la page de contact, aucune sur les mentions légales et la page introuvable ; refermer le menu déplié ne déplace pas la lecture ; le nom ramène en haut de la page principale ; SC-2.0-21 ôté | La décision |
| EC-01 — Accueil | Écran à l'adresse / ; met en avant le CV et le contact ; une entrée de section mène à son écran | Section en haut de la page principale, à / sans ancre ; met en avant le contact ; une entrée de section fait défiler jusqu'à elle | La décision |
| EC-02 — Parcours | Écran à l'adresse /parcours ; accès au CV et au contact par EC-00 | Section à l'adresse /#parcours ; accès au contact par EC-00 ; contenu et états inchangés | La décision |
| EC-03 — Compétences | Écran à l'adresse /competences ; accès au CV et au contact par EC-00 | Section à l'adresse /#competences ; accès au contact par EC-00 ; contenu et états inchangés | La décision |
| EC-04 — Expérience | Écran à l'adresse /experience ; accès au CV et au contact par EC-00 | Section à l'adresse /#experience ; accès au contact par EC-00 ; contenu et états inchangés | La décision |
| EC-05 — Méthode de travail | Écran à l'adresse /methode | Section à l'adresse /#methode ; le renvoi vers la fiche du portfolio ne change pas | La décision |
| EC-06 — Liste des projets | Écran à l'adresse /projets | Section à l'adresse /#projets ; contenu et états inchangés | La décision |
| EC-07 — Fiche d'un projet | Le retour mène à l'écran des projets ; le CV et le contact à un clic, visibles sur téléphone | Le retour mène à la page principale, à la section des projets (/#projets) ; le contact seul, à un clic et visible sur téléphone | La décision |
| EC-08 — CV | Écran /cv : consulter, télécharger, CV indisponible | Retiré : il garde son titre et une ligne de statut | Plus de CV |
| EC-09 — Contact | Une action « Demander le CV » | Action ôtée ; la page reste à part, à /contact | Plus de CV |
| EC-11 — Page introuvable | Toute adresse sans écran ; retour vers l'écran des projets ; accès au CV et au contact | Toute autre adresse que celles du plan du site ; retour vers la section des projets (/#projets) ; accès au contact ; un nom de section inconnu renvoie au point V-11 | La décision |
| PT-01 — Le recruteur pressé | Accueil, puis CV ou contact en un clic ; CV indisponible en variante | Accueil, défilement ou choix d'une section, puis contact en un clic ; SC-2.0-21 et SC-2.0-22 ôtés, SC-2.0-04 ajouté | La décision |
| PT-03 — L'arrivée par un lien direct | Passage par l'écran CV depuis la fiche | Plus de passage par le CV ; une section s'ouvre sur la page principale, par son lien ou par la navigation ; le rechargement garde la page ou la section | La décision |
| Section 5 — Couverture des micro-fonctions | MF-02 « CV et contact accessibles en permanence » ; une ligne MF-15 ; MF-04 « Liens directs vers les pages », couvert par EC-02 à EC-11 | MF-02 « Contact accessible en permanence » ; plus de ligne MF-15 ; MF-04 « Liens directs vers les sections et les pages », couvert par EC-02 à EC-07 et EC-09 à EC-11 | Plus de CV ; titres de MF-02 et de MF-04 alignés sur le besoin révisé ; pour MF-04 : le contact et les mentions légales restent des pages à part, chacune avec son adresse ; la garantie signée le 15/10 (un lien direct et un rechargement gardent le contenu) les couvre toujours |
| Section 6 — Couverture des scénarios | SC-2.0-02 et SC-2.0-03 « CV et contact atteints… » ; lignes SC-2.0-21 et SC-2.0-22 ; SC-2.0-05 « Lien direct vers une section », couvert aussi par EC-08 | « Contact atteint depuis l'accueil », « Contact atteint depuis une fiche projet » ; plus de lignes SC-2.0-21 ni SC-2.0-22 ; SC-2.0-05 « Lien direct vers une section, le contact ou les mentions légales », sans EC-08 | Plus de CV ; titres alignés sur les scénarios révisés ; pour SC-2.0-05 : le contact et les mentions légales restent des pages à part, chacune avec son adresse ; la garantie signée le 15/10 (un lien direct et un rechargement gardent le contenu) les couvre toujours |
| V-01 — Une adresse par section | Réponse du 15/10/2026 : recommandation B acceptée | Réponse gardée, suivie de la révision : option D | La décision |
| V-02 — « Un clic » | Pour le CV et le contact ; recommandation : un clic jusqu'à l'écran CV, un second pour télécharger, ou l'option B de PN-04 | Pour le contact seul ; recommandation réécrite pour lui ; réponse du 15/10/2026 gardée, suivie de la révision | Plus de CV |
| V-03 — Navigation sur téléphone | Le CV et le contact visibles hors du menu | Le contact seul ; réponse gardée, suivie de la révision | Plus de CV |
| V-05 — Contenus manquants | « C-02 à C-05 ne sont pas fournis » ; réponse du 15/10/2026 : recommandation acceptée | Texte et réponse gardés, suivis de la révision : de C-02 à C-05, il ne reste à fournir que C-02, C-04 et C-05 | Plus de CV ; la plage C-02 à C-05 contient C-03, qui est retiré |
| V-07 — Liens GitHub et LinkedIn | En-tête réservé aux sections, au CV et au contact | Aux sections et au contact ; réponse gardée, suivie de la révision | Plus de CV |
| V-10 — Fin de la page principale | N'existait pas | Nouveau point à valider | La décision ne dit pas ce qui suit la section des projets |
| V-11 — Section inconnue | N'existait pas | Nouveau point à valider | Un lien vers une section mal écrite n'a pas de réponse dans la décision |

## 1. Principes de navigation

### PN-01 — Une page unique ou plusieurs pages
Contexte : le site compte huit espaces de lecture (accueil, parcours, compétences, expérience (rôle chez OSOL), méthode de travail, projets, contact, mentions légales) plus une fiche par projet. Chaque section et chaque fiche doit avoir un lien direct qui survit au rechargement (MF-04), et le site doit pouvoir accueillir une version anglaise en v2.0.1 sans être refait.
Options :

| Option | Pour | Contre |
| --- | --- | --- |
| A. Une page unique qui défile, sections repérées par des ancres | Lecture continue, rapide à parcourir ; une seule arrivée | Les fiches projet n'ont pas de place naturelle (il faudrait quand même des adresses propres) ; le contact devient une ancre parmi d'autres ; une page très longue noie la hiérarchie pour un lecteur pressé ; une adresse de section ne montre pas seule son contenu |
| B. Plusieurs pages, une adresse lisible par section et par fiche projet | Un lien transmis mène exactement au contenu visé (MF-04) ; chaque écran a un rôle clair et un seul sujet ; la fiche projet et les projets ajoutés plus tard suivent la même règle ; une version anglaise s'ajoute sous un préfixe de langue sans toucher aux adresses françaises | Plus d'écrans à maquetter ; le lecteur change de page pour passer d'une section à l'autre ; chaque adresse doit s'ouvrir et se recharger directement, ce que garantit la conception technique (pré-génération des pages, CT-01) et ce qui cassait sur l'ancien site |
| C. Accueil en défilement qui résume les sections, plus des pages dédiées pour le détail | Accueil riche pour le lecteur pressé | Deux façons d'atteindre le même contenu : adresses et navigation plus difficiles à garder cohérentes ; plus de travail de maquette |
| D. Une page principale qui défile pour les sections, des pages à part pour la fiche de chaque projet, le contact et les mentions légales | Lecture continue de l'accueil aux projets, sans changer de page ; le menu fait défiler jusqu'à la section choisie et signale celle qu'on lit ; un lien vers une section ouvre la page principale à cette section, même après un rechargement (MF-04) ; la fiche de chaque projet garde sa propre adresse, et un projet ajouté a la sienne sans toucher au reste (MF-14) ; le contact garde sa page | Une page longue : le visiteur doit toujours voir où il en est ; un lien vers une section ouvre toute la page principale, pas cette section seule ; les maquettes, la conception technique, le plan du front et les tickets, déjà signés, sont à reprendre |

Recommandation : option B. Elle répond le plus directement à MF-04 (un lien = un contenu, y compris pour la fiche d'un projet ajouté) et à MF-14 (un projet ajouté a sa fiche et son adresse sans toucher au reste). Un écran par sujet sert aussi la lecture en quelques minutes : l'accueil reste court et renvoie vers le détail. Adresses proposées : /parcours, /competences, /experience, /methode, /projets, /projets/ suivi de l'identifiant du projet, /cv, /contact, /mentions-legales ; l'accueil est la racine du site. Le français est sans préfixe ; l'anglais, en v2.0.1, s'ajouterait sous un préfixe de langue, sans casser aucun lien français déjà transmis. La section sur l'alternance a pour adresse /experience, jamais le nom de l'employeur (décision d'Alexandre du 15/10/2026).
Révision du 10/11/2026 : cette recommandation, signée le 16/10/2026, est remplacée par la décision d'Alexandre qui suit.
Décision d'Alexandre du 10/11/2026 : option D. Sur sa page de choix, il a retenu « Une page qui défile, fiches projet, CV et mentions légales à part. », avec cette remarque : « En vrai on va enlever le CV et oui le contact à part. » Puis : « oui plus de CV du tout ». Adresses : la page principale à la racine du site (/), avec l'accueil en haut de la page, sans ancre ; ses sections à /#parcours, /#competences, /#experience, /#methode et /#projets ; la fiche d'un projet à /projets/ suivi de son identifiant ; le contact à /contact ; les mentions légales à /mentions-legales ; la page introuvable pour toute autre adresse. Le reste de la recommandation B tient : le français sans préfixe, l'anglais sous un préfixe de langue en v2.0.1, et l'adresse de la section sur l'alternance dit « experience », jamais le nom de l'employeur.
Statut : proposition, à valider
Répond à : MF-03, MF-04, MF-05, MF-14, SC-2.0-04, SC-2.0-05, SC-2.0-06, SC-2.0-07, SC-2.0-08, SC-2.0-19, SC-2.0-20

### PN-02 — Accès permanent au contact
Contexte : la fiche de base le relève : « son concept ludique cache le CV et le contact au lieu de les mettre en avant ». MF-02 impose d'atteindre le contact depuis n'importe quelle page, en un clic (V-02).
Options :

| Option | Pour | Contre |
| --- | --- | --- |
| A. Une entrée « Contact » dans l'en-tête, visible en permanence et distinguée des autres entrées de navigation | Un clic depuis n'importe quel écran, sans ouvrir de menu ; vaut aussi sur téléphone ; l'élément commun est le même partout (SC-2.0-04) | Demande de la place dans l'en-tête, surtout sur petit écran |
| B. Le contact comme une entrée parmi les autres du menu | Navigation homogène, en-tête allégé | Sur téléphone, il faut ouvrir le menu d'abord : deux clics, contraire à MF-02 |
| C. Bouton flottant permanent « Contact » en plus du menu | Toujours à portée du pouce | Cache du contenu ; double emploi avec le menu |

Recommandation : option A. C'est la seule qui tient la promesse « un clic » sur téléphone comme sur grand écran : sur téléphone, l'entrée « Contact » reste visible hors du menu replié (PN-03). Le contact figure dans le bloc d'éléments communs (EC-00) et est répété en tête de l'accueil (EC-01) pour le lecteur pressé.
Révision du 10/11/2026 : l'accès permanent ne porte plus que sur le contact, décision d'Alexandre du 10/11/2026 ; les options et la recommandation sont relues dans ce sens.
Statut : proposition, à valider
Répond à : MF-02, MF-16, SC-2.0-02, SC-2.0-03

### PN-03 — Navigation sur téléphone
Contexte : MF-06 exige que toutes les sections, la navigation, les fiches projet et le formulaire restent utilisables sur téléphone, sans défilement horizontal, et que la navigation reste accessible depuis chaque page (SC-2.0-09). Il y a beaucoup d'entrées (six sections, plus le contact).
Options :

| Option | Pour | Contre |
| --- | --- | --- |
| A. Menu replié (un bouton ouvre la liste des sections) ; le contact reste visible hors du menu | Libère la place ; conserve PN-02 ; le menu ouvert liste toutes les sections | Une section demande deux gestes (ouvrir, choisir) |
| B. Barre de navigation fixe en bas de l'écran, avec toutes les entrées | Toutes les entrées en un geste | Six à huit entrées ne tiennent pas lisiblement sur un petit écran ; la barre masque le bas du contenu et le bouton d'envoi du formulaire |
| C. La navigation complète reste affichée en tête, sur plusieurs lignes | Aucun menu à ouvrir | Occupe une grande partie de l'écran avant tout contenu ; contraire à la hiérarchie de lecture |

Recommandation : option A. Les sections secondaires passent dans le menu replié, le contact reste hors du menu, toujours visible. Le menu replié est présent sur toutes les pages, y compris la page introuvable. Les largeurs d'écran à couvrir sont à fixer avec la charte (voir V-04).
Révision du 10/11/2026 : le menu replié liste les sections ; seul le contact reste hors du menu, décision d'Alexandre du 10/11/2026.
Statut : proposition, à valider
Répond à : MF-02, MF-03, MF-06, SC-2.0-04, SC-2.0-09

### PN-04 — Forme de l'accès au CV (retiré le 10/11/2026)
Statut : retiré le 10/11/2026, décision d'Alexandre : plus de CV sur le site.

## 2. Plan du site

| Identifiant | Nom | Place | Adresse |
| --- | --- | --- | --- |
| EC-00 | Éléments communs | en-tête et pied de page de chaque page | toutes les pages |
| EC-01 | Accueil | page principale, en haut | / (sans ancre) |
| EC-02 | Parcours | page principale, section | /#parcours |
| EC-03 | Compétences | page principale, section | /#competences |
| EC-04 | Expérience | page principale, section | /#experience |
| EC-05 | Méthode de travail | page principale, section | /#methode |
| EC-06 | Liste des projets | page principale, section | /#projets |
| EC-07 | Fiche d'un projet | page à part | /projets/ suivi de l'identifiant du projet (au lancement : /projets/portfolio) |
| EC-09 | Contact | page à part | /contact |
| EC-10 | Mentions légales | page à part | /mentions-legales |
| EC-11 | Page introuvable | page à part | toute autre adresse, y compris celle d'un projet inexistant |

La page principale enchaîne, dans cet ordre, l'accueil, le parcours, les compétences, l'expérience, la méthode de travail et les projets. On la lit en faisant défiler, ou en choisissant une section dans le menu, qui fait défiler jusqu'à elle. Un lien vers une section ouvre la page principale à cette section, même après un rechargement. Ce qui suit la section des projets est le point V-10.

Les pages à part sont la fiche de chaque projet, le contact et les mentions légales, chacune à son adresse, ainsi que la page introuvable. Un projet ajouté a sa fiche à sa propre adresse, sans toucher au reste. Depuis la fiche d'un projet, le retour mène à la page principale, à la section des projets (/#projets).

Arborescence :

- Page principale (/)
  - Accueil
  - Parcours
  - Compétences
  - Expérience (rôle chez OSOL)
  - Méthode de travail
  - Projets
    - Fiche d'un projet, page à part (au lancement, une seule : le portfolio)
- Contact, page à part
- Mentions légales, page à part
- Page introuvable (hors arborescence : atteinte par toute adresse inconnue)

L'adresse d'un projet inexistant (/projets/ suivi d'un identifiant inconnu) mène à EC-11, seul écran qui décrit cet état ; EC-07 y renvoie.

Les éléments communs (EC-00) sont présents sur toutes les pages, page introuvable comprise.

## 3. Sections et écrans

### EC-00 — Écran : Éléments communs
Adresse : toutes les pages
Micro-fonctions : MF-02, MF-03, MF-06, MF-17, MF-19
Scénarios : SC-2.0-02, SC-2.0-03, SC-2.0-04, SC-2.0-09, SC-2.0-27, SC-2.0-29
Contenu, dans l'ordre de lecture :
- En-tête : nom Alexandre Morozoff, qui ramène en haut de la page principale — MF-03
- Navigation : une entrée par section de la page principale (accueil, parcours, compétences, expérience, méthode de travail, projets), identique sur toutes les pages, l'entrée de la section lue étant signalée — MF-03
- Entrée « Contact », distinguée des autres et visible en permanence — MF-02
- Pied de page : liens vers GitHub et LinkedIn (aucun lien vers X) — MF-17
- Pied de page : lien vers les mentions légales — MF-19
Actions :
- Choisir une entrée de navigation : sur la page principale, la page défile jusqu'à la section choisie (EC-01 à EC-06) ; depuis une page à part, mène à la page principale, à cette section
- Choisir « Contact » : mène à EC-09, en un clic depuis n'importe quelle page
- Choisir le lien GitHub ou LinkedIn : ouvre le profil dans un nouvel onglet, le site reste ouvert dans l'onglet d'origine
- Choisir « Mentions légales » : mène à EC-10
États : nominal, entrée courante signalée, menu replié (téléphone), menu déplié (téléphone), page sans section courante
- nominal : toutes les entrées visibles, y compris Contact
- entrée courante signalée : sur la page principale, l'entrée de la section en cours de lecture est reconnaissable, et change avec elle pendant le défilement ; sur la fiche d'un projet, l'entrée « Projets » est la courante ; sur la page de contact, c'est l'entrée « Contact »
- menu replié (téléphone) : un seul bouton de menu, Contact reste visible à côté
- menu déplié (téléphone) : la liste de toutes les sections s'affiche ; la refermer ramène à la page sans déplacer la lecture
- page sans section courante : sur la page introuvable ou les mentions légales, aucune entrée n'est signalée, toutes restent utilisables
Téléphone : navigation selon PN-03 (menu replié, Contact toujours visible hors du menu) ; le pied de page se lit en colonne ; aucune entrée n'est coupée ni ne nécessite de défilement horizontal

### EC-01 — Section : Accueil
Adresse : / (en haut de la page principale, sans ancre)
Micro-fonctions : MF-01, MF-02, MF-18
Scénarios : SC-2.0-01, SC-2.0-02, SC-2.0-28
Contenu, dans l'ordre de lecture :
- Nom Alexandre Morozoff et intitulé « Développeur fullstack, orienté architecture logicielle » — MF-01
- Courte présentation d'Alexandre, sans âge ni formulation qui se périme — MF-01, MF-18 (texte à fournir par Alexandre : voir V-05)
- Accès mis en avant au contact, répétant celui d'EC-00 — MF-02
- Entrées vers les sections parcours, compétences, expérience, méthode de travail et projets, avec une phrase d'orientation chacune — MF-01
Actions :
- Choisir « Contact » : mène à EC-09
- Choisir une entrée de section : fait défiler la page principale jusqu'à la section correspondante (EC-02 à EC-06)
États : nominal
- nominal : la section est composée de contenu fixe ; elle n'a pas de cas d'échec propre
Téléphone : une seule colonne ; l'ordre de lecture est conservé (identité, présentation, contact, sections) ; l'accès au contact reste visible sans défilement long

### EC-02 — Section : Parcours
Adresse : /#parcours
Micro-fonctions : MF-04, MF-07, MF-08, MF-18
Scénarios : SC-2.0-05, SC-2.0-10, SC-2.0-11, SC-2.0-28
Contenu, dans l'ordre de lecture :
- Titre de la section et phrase d'introduction — MF-07 (texte à fournir par Alexandre : voir V-05)
- Texte d'orientation vers l'architecture logicielle, citant le master en architecture durable du logiciel comme étape — MF-08 (texte à fournir par Alexandre : voir V-05)
- Étape 1, reconversion depuis la restauration, avec sa période datée — MF-07, C-01
- Étape 2, bac+3, avec son intitulé, son établissement et sa période — MF-07, C-01
- Étape 3, master en architecture durable du logiciel, avec sa période — MF-07, MF-08, C-01
Actions :
- Aucune action propre ; navigation et accès au contact par EC-00
- Lien direct vers cette section : /#parcours, qui survit au rechargement
États : nominal
- nominal : trois étapes dans l'ordre reconversion, bac+3, master ; chaque période a un début et une fin ; aucune durée relative, aucun âge ; aucune date n'est inventée ni laissée vide à l'écran (la condition de mise en ligne liée à C-01 : voir V-05)
Téléphone : les étapes se lisent l'une sous l'autre, période en tête de chaque étape ; aucun contenu coupé

### EC-03 — Section : Compétences
Adresse : /#competences
Micro-fonctions : MF-04, MF-09, MF-10, MF-18
Scénarios : SC-2.0-05, SC-2.0-12, SC-2.0-13, SC-2.0-28
Contenu, dans l'ordre de lecture :
- Titre de la section — MF-09
- Compétences techniques regroupées par catégorie, seulement celles de la liste fournie — MF-09, C-02
- Compétences humaines — MF-10, C-02
- Récit de la reconversion depuis la restauration, rattaché aux compétences humaines et montrant en quoi elle les illustre — MF-10 (texte à fournir par Alexandre : voir V-05)
Actions :
- Aucune action propre ; navigation et accès au contact par EC-00
- Lien direct vers cette section : /#competences
États : nominal, catégorie sans compétence
- nominal : catégories et compétences telles que fournies, sans niveau chiffré sauf accord d'Alexandre
- catégorie sans compétence : une catégorie sans élément n'est pas affichée ; aucune zone vide
Téléphone : les catégories se lisent l'une sous l'autre ; une compétence ne dépasse jamais la largeur de l'écran

### EC-04 — Section : Expérience
Adresse : /#experience
Micro-fonctions : MF-04, MF-11, MF-18
Scénarios : SC-2.0-05, SC-2.0-14, SC-2.0-28
Contenu, dans l'ordre de lecture :
- Titre de la section (« Expérience ») et période de l'alternance, 2025–2028 ; la section présente le rôle chez OSOL — MF-11, C-01
- Rôle en trois volets : application, backend, appui DevOps sur certaines tâches (présenté comme un appui, pas comme un poste) — MF-11 (texte à fournir par Alexandre : voir V-05)
- Mention que les projets menés en entreprise ne sont pas partageables — MF-11
Actions :
- Aucune action propre ; navigation et accès au contact par EC-00
- Lien direct vers cette section : /#experience, qui survit au rechargement (MF-04)
États : nominal
- nominal : aucun projet, client, outil interne, dépôt ni collègue nommé ; la période est une période datée, jamais formulée au présent
Téléphone : les trois volets se lisent l'un sous l'autre

### EC-05 — Section : Méthode de travail
Adresse : /#methode
Micro-fonctions : MF-04, MF-18, MF-21
Scénarios : SC-2.0-05, SC-2.0-28, SC-2.0-31
Contenu, dans l'ordre de lecture :
- Titre de la section — MF-21
- Texte de la méthodologie de travail et de l'attachement aux architectures solides — MF-21, C-04
- Renvoi vers la fiche du portfolio, qui illustre la méthode — MF-21
Actions :
- Suivre le renvoi vers la fiche du portfolio : mène à EC-07 (/projets/portfolio)
- Lien direct vers cette section : /#methode
États : nominal, renvoi vers un projet absent
- nominal : texte et renvoi affichés ; aucun document interne, client, projet, outil interne ni dépôt d'entreprise nommé
- renvoi vers un projet absent : si la fiche visée n'existait plus, le renvoi mènerait à la page introuvable (EC-11) ; le renvoi est donc retiré de la section plutôt que laissé cassé
Téléphone : le texte se lit en une colonne ; le renvoi reste visible à la fin du texte

### EC-06 — Section : Liste des projets
Adresse : /#projets
Micro-fonctions : MF-04, MF-06, MF-12, MF-14, MF-18, MF-22
Scénarios : SC-2.0-05, SC-2.0-09, SC-2.0-15, SC-2.0-19, SC-2.0-28
Contenu, dans l'ordre de lecture :
- Titre de la section — MF-12
- Liste des projets, chacun avec son titre et un accès à sa fiche ; au lancement, un seul élément, le portfolio — MF-12, MF-22
- Mention que les projets menés en entreprise ne sont pas partageables — MF-12
Actions :
- Choisir un projet : mène à sa fiche (EC-07)
- Lien direct vers cette section : /#projets
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
- Revenir à la liste : mène à la page principale, à la section des projets (EC-06, /#projets)
- Demander le contact : un clic, via EC-00
États : nominal complet, sans capture, sans lien vers le code source, projet inexistant
- nominal complet : titre, description, captures et lien vers le code source
- sans capture : titre et description s'affichent ; aucune zone vide ni image absente à la place des captures
- sans lien vers le code source : titre et description s'affichent ; aucun lien ni bouton de code source
- projet inexistant : l'adresse mène à la page introuvable ; cet état est décrit en EC-11 et nulle part ailleurs
- aucun état de chargement ni d'indisponibilité : le contenu des projets est intégré aux pages au moment de la construction du site (conception technique, CT-03)
Téléphone : le titre, la description, les captures puis le lien se lisent en une colonne ; les captures tiennent dans la largeur de l'écran ; le contact reste visible

### EC-08 — Écran : CV (retiré le 10/11/2026)
Statut : retiré le 10/11/2026, décision d'Alexandre : plus de CV sur le site, ni page ni fichier.

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
- Lien direct vers cet écran : /contact
États : nominal, champ manquant, email invalide, envoi en cours, envoi réussi, envoi échoué
- nominal : formulaire vide, information sur les données visible avant le bouton ; aucune protection contre les messages indésirables n'est affichée au visiteur (V-06)
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
Adresse : toute autre adresse que celles du plan du site (section 2), y compris celle d'un projet inexistant ; le cas d'un nom de section inconnu après /# est le point V-11
Micro-fonctions : MF-04, MF-05
Scénarios : SC-2.0-07, SC-2.0-08
Contenu, dans l'ordre de lecture :
- Message clair indiquant que la page n'existe pas — MF-05
- Retour à l'accueil — MF-05
- Retour vers la liste des projets, quand l'adresse visée était celle d'un projet — MF-04
Actions :
- Revenir à l'accueil : mène à EC-01
- Revenir à la liste des projets : mène à la page principale, à la section des projets (EC-06, /#projets)
- Utiliser la navigation ou l'accès au contact : via EC-00
États : adresse inconnue, projet inexistant
- adresse inconnue : message, retour à l'accueil, navigation visible
- projet inexistant : adresse de la forme /projets/ suivie d'un identifiant inconnu ; même écran, avec en plus le retour vers la liste des projets ; cet écran est l'unique description de cet état (EC-07 y renvoie)
Téléphone : le message et le retour à l'accueil se lisent sans défilement ; le menu replié reste présent

## 4. Parcours types

### PT-01 — Le recruteur pressé
Arrivée sur l'accueil, lecture en faisant défiler ou en choisissant une section, puis contact en un clic.
- Suite d'écrans : EC-01 (Accueil) → une section de la page principale, atteinte en faisant défiler ou par le menu (EC-02 à EC-06) → EC-09 (Contact) ; variante : EC-01 → EC-09, sans quitter l'accueil
- Scénarios joués : SC-2.0-01, SC-2.0-04, SC-2.0-23, SC-2.0-24, SC-2.0-25, SC-2.0-26, SC-2.0-30 ; en variante, SC-2.0-02
- Ce que le parcours vérifie : sans exploration préalable, le contact est à un clic depuis l'accueil comme depuis n'importe quelle section, et le formulaire montre ses états d'erreur et de réussite.

### PT-02 — Le responsable technique
Arrivée, méthode de travail, fiche du portfolio, code source.
- Suite d'écrans : EC-01 (Accueil) → EC-05 (Méthode de travail) → EC-07 (fiche du portfolio) → code source (lien externe, nouvel onglet)
- Scénarios joués : SC-2.0-01, SC-2.0-04, SC-2.0-31, SC-2.0-32, SC-2.0-16
- Variantes : EC-01 → EC-03 (Compétences) puis EC-06 (Liste des projets) → EC-07 ; SC-2.0-12, SC-2.0-15, SC-2.0-17, SC-2.0-18 pour les fiches sans lien ou sans capture
- Ce que le parcours vérifie : le renvoi de la méthode mène à la fiche du portfolio, qui mène au code source public.

### PT-03 — L'arrivée par un lien direct
Fiche ou section ouverte directement, puis adresse inconnue.
- Suite d'écrans : EC-03 (section ouverte par son lien direct /#competences, qui ouvre la page principale à cette section, puis rechargée : SC-2.0-05) → EC-07 (fiche ouverte par lien direct, puis rechargée : SC-2.0-06) → EC-09 (contact, un clic depuis la fiche) : SC-2.0-03 → EC-05 (autre section, via la navigation : la page principale s'ouvre à cette section : SC-2.0-04) → adresse d'un projet inexistant → EC-11 (Page introuvable : SC-2.0-07) → adresse inconnue → EC-11 (SC-2.0-08) → EC-01 (retour à l'accueil)
- Scénarios joués : SC-2.0-05, SC-2.0-06, SC-2.0-03, SC-2.0-04, SC-2.0-07, SC-2.0-08
- Variante : lien vers un projet ajouté plus tard, SC-2.0-20
- Ce que le parcours vérifie : chaque lien mène au bon contenu sans passer par l'accueil, le rechargement garde la page ou la section, et une adresse fausse ne laisse jamais un écran vide.

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
| MF-02 | Contact accessible en permanence | EC-00, EC-01 |
| MF-03 | Navigation entre les sections | EC-00 |
| MF-04 | Liens directs vers les sections et les pages | EC-02 à EC-07, EC-09 à EC-11 |
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
| SC-2.0-02 | Contact atteint depuis l'accueil | EC-00, EC-01 |
| SC-2.0-03 | Contact atteint depuis une fiche projet | EC-00, EC-07 |
| SC-2.0-04 | Navigation entre les sections | EC-00 |
| SC-2.0-05 | Lien direct vers une section, le contact ou les mentions légales | EC-02 à EC-06, EC-09, EC-10 |
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

- V-01 — Choix d'une adresse par section et par fiche (PN-01, option B) plutôt qu'une page unique. Recommandation : valider B ; elle satisfait MF-04 dans tous les cas, au prix de quelques écrans de plus à maquetter. Impact sur la version anglaise (MF-23) : aucun obstacle, l'anglais s'ajoutera sous un préfixe de langue ; seule contrainte, ne pas préfixer le français aujourd'hui, pour ne pas changer des adresses qui seront déjà transmises. Réponse d'Alexandre du 15/10/2026 : recommandation acceptée. Révision du 10/11/2026 : décision d'Alexandre du 10/11/2026, option D de PN-01 à la place de B : une page principale qui défile pour les sections, des pages à part pour la fiche de chaque projet, le contact et les mentions légales ; chaque section garde son lien direct (/#competences, par exemple), et l'impact sur la version anglaise reste le même.
- V-02 — « Un clic » pour le contact (PN-02). Recommandation : le contact s'atteint en un clic depuis n'importe quelle page. Réponse d'Alexandre du 15/10/2026 : recommandation acceptée. Révision du 10/11/2026 : décision d'Alexandre, « oui plus de CV du tout » ; ce point ne porte plus que sur le contact, et sa recommandation est réécrite pour lui (son texte d'avant est dans la section « Révision du 10/11/2026 »).
- V-03 — Navigation sur téléphone (PN-03). Recommandation : menu replié, Contact toujours visible hors du menu. Réponse d'Alexandre du 15/10/2026 : recommandation acceptée. Révision du 10/11/2026 : seul le contact reste hors du menu, décision d'Alexandre du 10/11/2026.
- V-04 — Largeurs d'écran et navigateurs à couvrir (MF-06 les renvoie à l'Étape 4). Recommandation : couvrir de la plus étroite des largeurs de téléphone courantes jusqu'au grand écran, et fixer les valeurs exactes avec la conception technique et la charte, pas ici. Réponse d'Alexandre du 15/10/2026 : largeurs d'écran fixées par la charte (T2.3), navigateurs à couvrir par la conception technique (CT-10).
- V-05 — Contenus manquants qui conditionnent l'affichage : C-01 est incomplet (reconversion, bac+3, début du master) ; C-02 à C-05 ne sont pas fournis ; cinq textes à fournir ne sont couverts par aucun identifiant C-xx : la présentation courte de l'accueil (MF-01), le récit de reconversion (MF-10), la description des trois volets du rôle (MF-11), le texte d'orientation vers l'architecture (MF-08) et les phrases d'introduction des sections (accueil, parcours). Recommandation : les ajouter aux contenus des US par une mise à jour séparée de ces documents, et ne pas mettre en ligne tant que les périodes ne sont pas complètes. Réponse d'Alexandre du 15/10/2026 : recommandation acceptée. Révision du 10/11/2026 : de C-02 à C-05, il ne reste à fournir que C-02, C-04 et C-05, décision d'Alexandre du 10/11/2026.
- V-06 — Protection du formulaire contre les messages indésirables (MF-16). La protection est invisible pour le visiteur (conception technique, CT-08). Recommandation : ne rien ajouter à EC-09 ; un envoi refusé par la protection affiche le même message d'échec réessayable que les autres cas. Réponse d'Alexandre du 15/10/2026 : recommandation acceptée.
- V-07 — Liens GitHub et LinkedIn dans le pied de page seulement (MF-17 : « Les liens sont présents sur toutes les pages (proposition, à valider). »). Recommandation : pied de page, pour garder l'en-tête réservé aux sections et au contact. Réponse d'Alexandre du 15/10/2026 : recommandation acceptée. Révision du 10/11/2026 : l'en-tête ne porte plus que les sections et le contact, décision d'Alexandre du 10/11/2026.
- V-08 — Une fiche projet sans description ou sans titre n'est pas prévue par les scénarios. Recommandation : exiger un titre et une description pour tout projet ajouté, et ne gérer que l'absence de captures et de lien. Réponse d'Alexandre du 15/10/2026 : recommandation acceptée.
- V-09 — Le renvoi de la méthode vers la fiche du portfolio (MF-21) : il existe tant que la fiche existe et disparaît avec elle, pour qu'aucun lien cassé ne subsiste ; ce comportement relève du parcours d'écrans (EC-05) et n'est pas demandé par les scénarios. Recommandation : garder ce comportement. Réponse d'Alexandre du 15/10/2026 : recommandation acceptée.
- V-10 — Ce que montre la fin de la page principale. La décision du 10/11/2026 fait des projets la dernière section, sans dire ce qui la suit. Recommandation : la page se termine sur la section des projets, puis le pied de page commun (EC-00), sans bloc de plus ; le contact reste à un clic dans l'en-tête, et l'accueil le met déjà en avant. Une invitation au contact en bas de page demanderait un texte de plus, à fournir par Alexandre.
- V-11 — Un lien vers une section qui n'existe pas. Une adresse comme /#competence (sans « s ») ouvre la page principale, mais aucune section ne porte ce nom. Recommandation : la page principale s'ouvre en haut, sur l'accueil, sans message d'erreur ; la page introuvable (EC-11) reste pour les adresses qui ne mènent à aucune page.
