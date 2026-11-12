# Conception technique — Portfolio v2.0.0
Statut : [x] à approuver  [x] approuvé par : Alexandre Morozoff le 16/10/26 ; erratum du 27/10/26 approuvé par Alexandre Morozoff (attente affichée au visiteur : jusqu'à 90 secondes, D-07) ; révision du 10/11/26 (one-pager, retrait du CV, choix et reports), approuvée par la fusion de sa PR
Base : US-2.0 et SC-2.0, approuvés par Alexandre Morozoff le 15/10/26 ; Contexte-Pitch signé le 14/10/26 ; révision du 10/11/2026 de US-2.0, de SC-2.0, du parcours d'écrans, de la charte et des maquettes (site en une page) ; décision d'Alexandre du 12/11/2026 sur les anciennes adresses.

Ce document cadre l'architecture, le modèle de contenu, l'hébergement, la sécurité, les tests et l'impact sur l'existant de la v2.0.0, avant le contrat d'API (Étape 6). Il ne fixe ni les écrans ni les adresses des pages (parcours d'écrans, T2.2), ni la direction artistique (charte et maquettes, T2.3), ni les routes, formats et codes d'erreur des échanges entre front et back (contrat d'API).

Conventions de lecture :

- MF-xx désigne une micro-fonction de US-2.0, SC-2.0-xx un scénario de SC-2.0, C-xx un contenu à fournir par Alexandre, Q-xx une question des US.
- R-01 à R-13 numérotent, dans l'ordre des US, les treize exigences reportées à la conception ; la section 11 dit où chacune est traitée.
- CT-xx désigne un choix structurant (section 2). Chacun est une proposition argumentée ; la signature de ce document les valide. La section 12 recense les décisions soumises à Alexandre (D-01 à D-15) et ses réponses du 15/10/2026.
- Les faits datés (versions, fenêtres de support, conditions et limites des offres gratuites, prix) viennent des sources de la section 13, consultées le 15/10/2026, et le 12/11/2026 pour celles de la révision du 10/11/2026 ; un fait que la consultation n'a pas établi porte la mention « à vérifier ».
- Les seuils sans source sont suivis de « (proposition, à valider) ».
- Questions encore ouvertes dans les US : la conception s'appuie sur leurs hypothèses provisoires. Q-06 : seules les compétences fournies (C-02) sont affichées, sans niveau. Q-10 : le formulaire à cinq champs obligatoires, et les messages arrivent dans une boîte personnelle d'Alexandre. Q-15 : les technologies pratiquées en entreprise sont nommées seulement comme compétences. La section 5 dit ce qui change si une réponse diffère. Q-07 n'en fait plus partie : elle est tranchée depuis le 10/11/2026 (« oui plus de CV du tout »).

## Révision du 10/11/2026

Le 10/11/2026, Alexandre a décidé que le site tient sur une page principale qui défile (accueil, parcours, compétences, expérience, méthode de travail, projets), avec des pages à part pour la fiche de chaque projet, le contact, les mentions légales et la page introuvable, et qu'il n'a plus de CV du tout ; le 12/11/2026, il a fixé les cibles des anciennes adresses (A-14). Cette révision dit comment le front sert ce site, et reprend les points laissés « pour le prochain document signé » qui visent ce document.

| Élément | Avant | Après | Raison |
| --- | --- | --- | --- |
| En-tête | Approuvée le 16/10/26, erratum du 27/10/26 ; la base s'arrête à US-2.0, SC-2.0 et au pitch | Mentionne aussi cette révision, approuvée par la fusion de sa PR ; la base cite la révision du 10/11/2026 des documents signés et la décision du 12/11/2026 sur les anciennes adresses | Garder la trace de la révision |
| Conventions de lecture — date des sources | Les faits datés viennent « des sources de la section 13, consultées le 15/10/2026 » | Aussi : « et le 12/11/2026 pour celles de la révision du 10/11/2026 » | Les sources ajoutées par cette révision sont consultées le 12/11/2026 (section 13) ; relevé de la vérification de R3 |
| Conventions de lecture — questions ouvertes | Q-07 parmi les questions ouvertes, avec son hypothèse : un seul CV, en français, sous un nom sans date ni mention de situation | Q-07 n'y figure plus : elle est tranchée depuis le 10/11/2026, plus de CV du tout | Décision d'Alexandre du 10/11/2026 (US-2.0, Q-07) |
| Section 1 — Schéma et tableau des briques | Le front sert « pages, images, CV » ; le front pré-rendu porte « toutes les pages, le CV, le formulaire côté navigateur » | Pages et images ; toutes les pages et le formulaire côté navigateur | Plus de CV |
| CT-01 — Recommandation | « La conception ne dépend pas de la structure des adresses, qui revient au parcours d'écrans (T2.2) : avec plusieurs pages, le pré-rendu produit un document par adresse ; avec une page unique à sections, un lien vers une section est un lien vers un fragment de ce document […]. Dans les deux cas […] » | Les adresses viennent du parcours d'écrans (option D) : un document pour la page principale, un pour chaque page à part ; un lien vers une section est un lien vers un fragment de la page principale (section 3, « Ancres ») ; une ligne de révision suit | La décision tranche la structure que la recommandation laissait ouverte |
| CT-03 — Contexte | Le contenu comprend le CV et vient de C-01 à C-05 | Sans CV ; il vient de C-01, C-02, C-04 et C-05 | Plus de CV : C-03 est retiré (US-2.0) |
| CT-11 — Recommandation | Chaque page pré-rendue a son titre et sa description ; « L'accueil porte des données structurées » ; le plan du site reprend « les pages pré-rendues, fiches projet comprises » ; « La page introuvable répond 404 et n'est pas indexée » | Un titre, une description et une adresse canonique sans ancre par page, aucun par section ; les données « Person » sur la page principale ; le plan du site liste la page principale, chaque fiche, le contact et les mentions légales, ni ancre ni page introuvable ; robots à la racine ; la page introuvable et sa variante en 404, non indexées ; une ligne de révision suit | Les sections ne sont plus des pages : un moteur de recherche indexe des documents, pas des ancres |
| Section 3 — Organisation logique | Le cadre commun porte « l'accès au CV et au contact » ; la répartition en pages vient du parcours d'écrans, et « rien ci-dessous n'en dépend » | L'accès au contact ; la répartition décidée le 10/11/2026 est dite, et les paragraphes qui suivent disent comment le front la sert | Plus de CV ; la décision ; le plan du front part de ces paragraphes |
| Section 3 — Adresses et pages pré-rendues | N'existait pas | Nouveau paragraphe : les adresses du parcours d'écrans et le document servi pour chacune (la page principale, chaque fiche, le contact, les mentions légales, la page introuvable et sa variante projet inexistant) ; les sections ne sont pas des routes et aucune n'est différée ; ce qui disparaît : /parcours, /competences, /experience, /methode, /projets, /cv et /cv/404, le fichier du CV, sa règle d'en-têtes, son champ de contenu et son contrôle ; /projets seule à vérifier | La décision ; la conception laissait les adresses au parcours d'écrans ; relevés de R1 (fichier, contenu et page du CV) |
| Section 3 — Liens directs et rechargement | « Si T2.2 retient une page unique à sections, l'arrivée sur une section par son fragment doit survivre à l'hydratation, ce que les tests de bout en bout vérifient » | La page principale est retenue : recharger garde la même section, par l'ancre que tient l'adresse ; le détail passe au paragraphe « Ancres » | La décision ; relevé de R1 et R2 : le cas conditionnel devient le cas retenu |
| Section 3 — Ancres | N'existait pas | Nouveau paragraphe : trois cas (section, autre élément, ancre qui ne nomme rien) ; décalage sous l'en-tête par scroll-padding-top ; ouverture par le navigateur, sans défilement du routeur pendant l'hydratation ; règle de défilement après le démarrage, retour en haut de TK-23 compris ; la demande d'ancre du routeur passe par Element.scrollIntoView, l'initialiseur de TK-23 remplaçant aussi ViewportScroller.scrollToAnchor ; replaceUrl sur la page principale ; aucune navigation native vers un fragment une fois l'application démarrée | Choix 8 et règle des ancres de la charte (CO-06), V-11 ; relevés de R2 : rien ne disait comment une ancre tient au démarrage, depuis une autre page, ni ce que fait une ancre inconnue ; le code livré fait défiler vers une ancre par coordonnées, sans décalage ; relevé de la vérification de R3 : le moyen par lequel la demande d'ancre du routeur passe par Element.scrollIntoView n'était pas nommé, et le plan du front pouvait le lire autrement |
| Section 3 — Section lue, entrée signalée et adresse | N'existait pas : l'entrée signalée était celle de la page affichée | Nouveau paragraphe : la section lue (seuil de 40 %, bout de la page) suivie par le DefilementService ; aria-current="location" sur la page principale, données de la route sur les pages à part ; une fois la page chargée, l'adresse est toujours celle de la section lue : remplacée par History.replaceState en gardant history.state dès qu'elle diffère, y compris juste après l'ouverture sur un élément intérieur d'une section, comme les maquettes signées | Choix 8 ; relevés de R2 : une donnée de route ne peut pas suivre la lecture, un lien du routeur avec fragment ajoute une étape par défaut, et une réécriture trop tôt renvoie le navigateur vers une autre section ; la règle du bout de la page fait signaler la dernière section sur un écran haut ; relevé de la vérification de R3 : « quand la section lue change, l'adresse devient celle de la section » laissait dans l'adresse, après l'ouverture sur un élément intérieur, l'ancre de cet élément, à la différence des maquettes signées ; la phrase est la même que dans le plan du front |
| Section 3 — Transitions entre pages et mouvement de la page principale | N'existait pas | Nouveau paragraphe : MV-07 par les transitions de vue du routeur, annulées quand seul le fragment change ; MV-02 et MV-08 dans leurs sections ; animations réduites | Charte révisée (MV-07 entre deux pages, jamais d'une section à l'autre) ; relevés de R2 |
| Section 3 — Sans script | N'existait pas | Nouveau paragraphe : ce qui marche sans script, et ce qui ne peut pas (étape d'historique, adresse qui suit la lecture, entrée signalée, ancre inconnue gardée dans l'adresse) | Relevé de R2 : le repli n'était écrit nulle part |
| Section 3 — CV (MF-15) | Un fichier statique livré avec le site, sous un nom stable (Q-07), contrôlé par la CI, et une page « CV momentanément indisponible » placée à côté du fichier pour SC-2.0-22 | Paragraphe retiré | Plus de CV : MF-15, C-03, SC-2.0-21 et SC-2.0-22 sont retirés |
| Section 3 — Navigateurs | « Le site n'utilise que des fonctions de cette base. » | La même phrase, suivie de l'exception admise : les transitions de vue du navigateur, qui portent le fondu de changement de page (MV-07), amélioration facultative avec repli, sans fondu dans un navigateur qui ne les connaît pas | Le paragraphe « Transitions entre pages et mouvement de la page principale » parle d'une exception admise à la Baseline que ce paragraphe ne nommait pas ; relevé de la vérification de R3 |
| Section 3 — « Qui en jette mais qui soit pro » | « aucun contenu, ni le CV ni le contact, caché derrière une animation » | Aucun contenu, pas même l'accès au contact | Plus de CV |
| Section 5 — Profil | Une ligne CV : fichier obligatoire, nom stable (MF-15, C-03, Q-07) | Ligne retirée | Plus de CV |
| Section 5 — Contrôles du contenu | « CV présent sous un nom conforme » parmi les contrôles | Contrôle retiré | Plus de CV |
| Section 5 — Si une question ouverte reçoit une autre réponse | « Q-07, le CV devient un fichier par langue ou par variante » | Retiré : Q-07 est tranchée | Décision d'Alexandre du 10/11/2026 |
| Section 8 — Niveaux de test | Unitaires sans la section lue ; bout en bout avec la page 404 et le statut 404 | Unitaires : aussi la règle de la section lue et la règle de défilement ; bout en bout : aussi les redirections des anciennes adresses | Les nouveaux paragraphes des sections 3 et 10 |
| Section 8 — SC-2.0-01 à SC-2.0-04 | « accueil, CV et contact, navigation », de bout en bout « sur chaque page du site pré-rendu » | Accueil, contact et navigation, sur la page principale et sur chaque page à part : défilement jusqu'à la section, entrée signalée et adresse qui suivent la lecture sans étape d'historique, fondu entre deux pages seulement | Plus de CV ; la décision ; choix 8 |
| Section 8 — SC-2.0-05 à SC-2.0-08 | Ouverture directe, rechargement, statut 404 et page introuvable | Aussi : chaque section, une fiche, le contact et les mentions légales ouverts puis rechargés, avant et après le démarrage ; ancre d'un élément ; ancre de section depuis une autre page ; ancre qui ne nomme rien (V-11) ; variante projet inexistant et /projets seule | SC-2.0-05 élargi au contact et aux mentions légales (R1) ; relevés de R2 : tests de V-11 et d'une ancre visée depuis une autre page |
| Section 8 — SC-2.0-21, SC-2.0-22 | Une ligne : contrôle du contenu, téléchargement, fichier absent simulé, téléchargement réel | Ligne retirée | Scénarios retirés le 10/11/2026 |
| Section 10 — Ancien site | Son retrait de staging « relève du ticket de mise en place du front et du back » ; son CV « est remplacé par C-03 (Q-07) » | Son retrait est un ticket à part, TK-08 ; son document de candidature n'est pas repris | Report « pour le prochain document signé » (ligne 631) : la décision du 13/10/2026 et TK-08 en font un ticket à part ; plus de CV |
| Section 10 — Anciennes adresses | « Le choix se fait avec le parcours d'écrans (T2.2, D-13) » | Les cibles décidées le 12/11/2026 ; redirections permanentes (301) vers une adresse avec ancre, que le fichier de redirections de l'hébergeur admet ; toute autre ancienne adresse en 404 | Décision d'Alexandre du 12/11/2026 (A-14) ; le parcours d'écrans ne les avait pas fixées |
| D-13 — Anciennes adresses | Réponse du 15/10/2026 : recommandation acceptée, cibles à fixer avec le parcours d'écrans | Réponse gardée, suivie de la révision : les cibles décidées le 12/11/2026 | Décision d'Alexandre du 12/11/2026 |
| Section 13 — Sources | Consultées le 15/10/2026 et le 16/10/2026 | Aussi : un constat dans le code d'Angular 22.2.5, la version du lockfile du front (cité aussi dans « Ancres »), et deux pages consultées le 12/11/2026 (redirections de Cloudflare, événement popstate) | Faits nouveaux des sections 3 et 10 ; relevé de la vérification de R3 : le constat citait 22.2.3, la copie de travail installée, et non 22.2.5, la version du lockfile, où il a été revérifié |
| Renvoyé au code, ticket par ticket après R4 | — | Le code livré suit encore l'ancien plan : une route par section (data.section), les routes et pages /cv et /cv/404 et leur place dans finaliser-build.mjs, le champ du fichier dans profil.json et contenu.ts, la règle de ce fichier dans le modèle d'en-têtes (en-tetes.mjs), le défilement vers une ancre par coordonnées sans décalage (app.config.ts) ; ces points ne changent pas ici | Ce document fixe le « quoi » et le « avec quoi » ; le code change avec les tickets révisés |
| Renvoyé à R4 | — | Annulation de TK-38 et d'A-07 ; cibles des redirections dans TK-56 ; tests des ancres, de la section lue et de l'adresse dans les tickets qui les portent | Les tickets se révisent en R4 |

## 1. Vue d'ensemble

Le site est un ensemble de pages statiques, produites au moment du build à partir de fichiers de contenu versionnés, plus un petit service qui transmet à Alexandre les messages du formulaire de contact. Rien d'autre ne tourne en production : ni base de données, ni compte utilisateur, ni serveur d'application pour les pages.

```
 Visiteur : recruteur ou responsable technique, sur ordinateur ou téléphone
   │
   │ (1) pages et images : fichiers statiques pré-rendus
   ▼
 ┌────────────────────────────────────────────────────┐
 │ FRONT — Angular, pré-rendu au build                 │  CT-01, CT-03, CT-04
 │ hébergeur statique géré et gratuit (réseau CDN)     │  CT-05
 └────────────────────────────────────────────────────┘
   │
   │ (2) formulaire de contact seulement :
   │     jeton à la première saisie (réveille le back), puis envoi — HTTPS
   ▼
 ┌────────────────────────────────────────────────────┐
 │ BACK — Spring Boot, Java 25, image Docker           │  CT-06, CT-08, CT-12
 │ valide, filtre, transmet ; ne stocke rien           │
 └────────────────────────────────────────────────────┘
   │
   │ (3) API HTTPS du prestataire d'envoi
   ▼
 ┌────────────────────────────────────────────────────┐
 │ PRESTATAIRE D'ENVOI D'E-MAILS TRANSACTIONNELS       │  CT-07
 └────────────────────────────────────────────────────┘
   │
   │ (4) message remis ; « Répondre » écrit au visiteur
   ▼
 Boîte personnelle d'Alexandre (hypothèse de Q-10)


 Livraison :
 dépôt public GitHub (front/, back/, Projet-V2/)
   ──► intégration continue : tests et builds sur chaque PR          CT-09, CT-10
   ──► fusion sur staging : préproduction ; fusion sur main : production
   ──► chaque hébergeur déploie sa brique (fichiers du front, image du back)

 Domaine alexandre-morozoff-dev.fr : registraire OVH, zone DNS        CT-13
   ──► nom du site vers le front ; sous-domaine technique vers le back ;
       enregistrements d'authentification de l'envoi d'e-mails

 Surveillance : sonde externe sur le front, contrôle quotidien du back CT-14
```

Le front ne dépend du back que pour le formulaire. Si le back est absent, en veille ou en panne, tout le site reste lisible et seul l'envoi échoue, proprement et de façon visible (SC-2.0-26).

| Brique | Rôle | Justifiée par |
| --- | --- | --- |
| Front pré-rendu | toutes les pages et le formulaire côté navigateur | MF-01 à MF-22, R-04, R-05, R-08 |
| Fichiers de contenu versionnés | le contenu, séparé du code | MF-14, MF-18, R-07 |
| Back | jeton de formulaire, validation, filtres, transmission | MF-16, R-09, R-13 |
| Prestataire d'envoi | remise du message à Alexandre | MF-16, R-09 |
| Intégration continue | tests et builds bloquants avant fusion | R-06, R-03 |
| Surveillance | alerte quand le site ou le back tombe | R-03, MF-16 |
| Zone DNS | rattacher le domaine au front, au back et à l'envoi | MF-04, R-05, MF-16 |

La version anglaise (MF-23, v2.0.1) n'ajoute aucune brique : elle est préparée dans le front (CT-04).

## 2. Choix structurants

### CT-01 — Mode de rendu du front

Contexte : les pages sont lues en quelques minutes par des recruteurs et des responsables techniques (R-08), transmises par lien direct et rechargées (MF-04, R-04), et doivent être trouvées par les moteurs de recherche et prévisualisées quand on partage leur lien (R-05). Le contenu ne change qu'à la publication (CT-03) : aucune page ne dépend du visiteur, hormis l'état du formulaire. Angular est décidé (13/10/2026) ; reste à choisir comment les pages sont produites. Selon Google, tous les robots n'exécutent pas JavaScript, et une application à page unique produit facilement des « soft 404 » (adresse inconnue servie avec un statut de succès).

Options :

| Option | Pour | Contre | Coût |
| --- | --- | --- | --- |
| Rendu dans le navigateur seulement (application à page unique) | le plus simple à construire ; hébergement statique | HTML initial vide : les robots qui n'exécutent pas JavaScript, dont ceux des aperçus de partage, ne voient rien ; une adresse inconnue reçoit la page de l'application avec un statut de succès ; premier affichage plus lent | 0 € ; effort faible |
| Rendu sur un serveur à chaque requête | HTML complet ; contenu dynamique possible | un serveur Node de plus à héberger, surveiller et mettre à jour pendant deux ans, pour un contenu qui ne change qu'à la publication ; plus d'hébergement statique gratuit | un hébergement serveur ; effort moyen |
| Pré-rendu au build (génération statique), puis hydratation dans le navigateur | une page HTML complète par adresse, servie telle quelle : lisible par tous les robots, rapide, rechargeable ; hébergement purement statique, portable partout ; une adresse inconnue peut recevoir une vraie réponse 404 | toute modification du contenu passe par un build et un déploiement, ce qui est déjà le cas avec un contenu versionné (CT-03) ; les pages paramétrées, comme les fiches projet, doivent être énumérées au build | 0 € ; effort faible à moyen |

Recommandation : le pré-rendu au build, avec la sortie statique d'Angular. La liste des fiches projet est lue dans les fichiers de contenu au moment du build : ajouter un projet produit sa page sans autre modification (MF-14). La structure des adresses vient du parcours d'écrans (T2.2) : une page principale qui enchaîne l'accueil et cinq sections, et des pages à part (PN-01, option D). Le pré-rendu produit un document pour la page principale et un pour chaque page à part ; un lien vers une section est un lien vers un fragment du document de la page principale, que le navigateur sait ouvrir et recharger (section 3, « Ancres »). La navigation et le formulaire restent interactifs après hydratation, et la vraie réponse 404 est assurée par l'hébergeur (CT-05).
Révision du 10/11/2026 : la structure des adresses, que cette recommandation laissait au parcours d'écrans, est tranchée par la décision d'Alexandre du 10/11/2026 (page principale à sections, pages à part) ; la recommandation est relue dans ce sens.

Statut : proposition, à valider

Répond à : MF-04, MF-05, MF-13, MF-14, R-04, R-05, R-08, décision du 13/10/2026 (Angular)

### CT-02 — Versions des briques et fenêtres de support

Contexte : le site doit tenir au moins deux ans sans refonte (R-03), comptés depuis la sortie de la v2.0.0. Cette sortie suit la signature de ce document, donc n'a pas lieu avant le 15/10/2026 : l'horizon va au moins jusqu'en octobre 2028, et d'autant plus loin que la sortie est tardive. Les versions décidées le 13/10/2026 sont Angular 21, Spring Boot 4 et Java 25 ; le 15/10/2026, Alexandre a retenu Angular 22 à la place d'Angular 21 (D-01). État au 15/10/2026 : Angular sort désormais un majeur par an (depuis la v22, contre deux auparavant) et supporte chaque majeur 24 mois (12 mois actifs, puis 12 mois de LTS limités aux correctifs critiques et de sécurité) ; Angular 21 est en LTS depuis le 03/06/2026 et jusqu'en 06/2027 ; Angular 22, sorti le 03/06/2026, est actif jusqu'en 06/2027 et en LTS jusqu'en 06/2028. Spring Boot garantit au moins 12 mois de support libre par version mineure (4.0 jusqu'au 31/12/2026, 4.1 jusqu'au 31/07/2027 ; version courante 4.1.1) et Spring Boot 4.1 accepte Java 17 à 26. Java 25 est une LTS sortie en 09/2025, avec des builds Temurin annoncés jusqu'en 09/2031 au moins. Node.js ne sert qu'au build du front : Angular 22 accepte Node 22.22.3 et plus, 24.15.0 et plus, ou 26 ; Node 22 finit le 30/04/2027, Node 24 le 30/04/2028, Node 26 (LTS à venir) le 30/04/2029.

Options :

| Option | Pour | Contre | Coût |
| --- | --- | --- | --- |
| Versions du 13/10/2026 à l'identique : Angular 21, Spring Boot 4.0, Java 25 | aucune réouverture | Spring Boot 4.0 sort du support libre le 31/12/2026 et Angular 21 en 06/2027 : deux montées de version tomberaient dès la première année d'exploitation | 0 € ; deux montées de version précoces |
| Dernières versions supportées au moment du scaffold : Angular 22, dernière mineure de Spring Boot 4 (4.1 aujourd'hui), Java 25, Node LTS la plus récente acceptée par Angular | la couverture la plus longue : Angular jusqu'en 06/2028, Java jusqu'en 09/2031 ; Spring Boot reste dans la décision « Spring Boot 4 » | rouvre la version d'Angular (21 devient 22) ; le back demande quand même une montée de mineure par an | 0 € ; un entretien annuel court |
| Versions en avance (préversions, Java non LTS) | fenêtre la plus lointaine sur le papier | instables ; Java 26 a déjà atteint sa fin de service chez Temurin en 09/2026 | risque élevé ; non retenu |

Recommandation : la deuxième option. Aucune version ne couvre seule deux ans : la conception l'assume en prévoyant un entretien annuel court (montée de mineure du back, majeur d'Angular avant la fin de sa LTS), préparé par le robot de mises à jour du dépôt et validé par l'intégration continue (CT-09, section 9). Le risque n'est pas le même des deux côtés. Le back est exposé à Internet : il doit rester sur une mineure supportée. Le front ne fait tourner aucun code serveur (CT-01) et n'affiche que le contenu du dépôt : une version d'Angular en fin de LTS l'expose peu, et sa montée de majeur se planifie sans urgence. Node 26 dès qu'elle est passée en LTS au moment du scaffold (à vérifier), sinon Node 24. Angular 22 est la version retenue (D-01, décision d'Alexandre du 15/10/2026) : sa LTS finit en 06/2028, donc avant la fin de l'horizon quelle que soit la date de sortie de la v2.0.0, et une montée de majeur d'Angular est à planifier pendant la période.

Statut : proposition, à valider

Répond à : R-03, R-11, décision du 13/10/2026 (versions), décision du 15/10/2026 (Angular 22)

### CT-03 — Contenu en fichiers versionnés

Contexte : le contenu (profil, parcours, compétences, rôle en alternance, méthode de travail, projets, textes légaux) change rarement et vient d'Alexandre (C-01, C-02, C-04 et C-05). Ajouter un projet ne doit modifier ni les autres sections ni les autres projets (MF-14, R-07). Aucune base de données (décision du 13/10/2026). Le dépôt est public : tout contenu commité est publié.

Options :

| Option | Pour | Contre | Coût |
| --- | --- | --- | --- |
| Textes écrits dans le code des composants | aucun outillage | ajouter un projet revient à modifier du code ; texte et présentation mêlés ; traduction plus coûteuse (CT-04) | 0 € ; dette rapide |
| Fichiers de données versionnés dans le dépôt (un fichier par projet, un par section), lus au build | ajouter un projet = ajouter un fichier et ses images ; relecture par revue de PR ; historique git ; aucun service externe ; contrôle automatique possible | publication par build et déploiement (quelques minutes) ; pas d'interface d'édition | 0 € ; effort faible |
| Gestionnaire de contenu hébergé, interrogé au build | interface d'édition | un compte et une offre tierce de plus, susceptible de changer ; contenu hors du dépôt, donc hors revue ; build dépendant d'un service externe | offre gratuite à vérifier ; effort moyen |
| Contenu servi par le back | modifiable sans rebuild du front | exige un stockage, donc une base, exclue le 13/10/2026 ; les pages dépendraient d'un back qui peut dormir (CT-06) | effort élevé ; non retenu |

Recommandation : des fichiers de données versionnés au format JSON, lu nativement par TypeScript (aucun analyseur à maintenir), décrits par un modèle typé (section 5) et vérifiés par un contrôle automatique qui fait échouer la CI si un fichier est incomplet (CT-10). Un projet est un fichier plus un dossier d'images ; la liste, les fiches et le plan du site en sont dérivés au build (CT-01, CT-11). Les textes longs (C-04, C-05) sont des suites de paragraphes en texte brut, sans HTML : rien d'exécutable n'entre par le contenu (section 7). Les images vivent dans le dépôt, optimisées, et non sur un service tiers d'hébergement d'images comme dans l'ancien site (section 10). L'ordre des projets vient d'un rang porté par chaque projet : en ajouter un ne touche pas aux autres. Chaque projet porte un identifiant, celui de l'adresse de sa fiche : il est choisi une fois, à la création du projet, et ne change jamais, pour que les liens directs déjà diffusés restent valables pendant les deux ans visés (MF-04, MF-14). Qui fait quoi : Alexandre fournit les informations du projet (section 5) ; l'ajout est une PR vers staging dont le diff ne contient que le nouveau fichier et ses images (SC-2.0-19, SC-2.0-20).

Statut : proposition, à valider

Répond à : MF-04, MF-12, MF-13, MF-14, MF-18, MF-22, R-03, R-07, décision du 13/10/2026 (aucune base)

### CT-04 — Préparation de la version anglaise

Contexte : la v2.0.0 est en français et l'anglais arrive en v2.0.1 (MF-23) ; la conception doit permettre de l'ajouter sans refaire le site (R-12). Deux sortes de textes sont concernées : les libellés de l'interface (navigation, boutons, messages du formulaire) et le contenu (CT-03). Les adresses de la version anglaise relèvent de la conception de la v2.0.1 et du parcours d'écrans. La documentation d'Angular décrit son internationalisation intégrée comme une version complète de l'application produite au build pour chaque langue.

Options :

| Option | Pour | Contre | Coût |
| --- | --- | --- | --- |
| Rien en v2.0.0 | aucun effort immédiat | en v2.0.1, reprendre chaque composant pour en extraire les textes : c'est refaire une bonne partie du front | 0 € ; effort reporté et plus lourd |
| Internationalisation intégrée d'Angular : textes marqués dès la v2.0.0, une version compilée par langue | outil officiel du framework, sans dépendance tierce ; chaque langue devient un jeu de pages statiques complet, pré-rendu et indexable séparément ; aucun coût à l'exécution | changer de langue recharge la page ; un build par langue | 0 € ; effort faible en v2.0.0 (marquage) |
| Bibliothèque de traduction chargée à l'exécution | changement de langue sans rechargement | dépendance tierce à maintenir deux ans ; pré-rendu par langue plus délicat ; textes posés après chargement, moins bien vus des robots | 0 € ; effort moyen |

Recommandation : l'internationalisation intégrée d'Angular. En v2.0.0 : chaque libellé d'interface est marqué pour la traduction (langue source : français) ; le contenu est rangé par langue, seul le français étant rempli ; la langue de chaque page est déclarée ; dates et mois sont formatés selon la langue, jamais écrits en dur. En v2.0.1 : extraire les libellés, les traduire, ajouter l'anglais au build, ajouter le choix de langue et les liens entre versions linguistiques pour les moteurs. Contrainte transmise à la v2.0.1 : les adresses françaises publiées en v2.0.0 ne changent pas à l'arrivée de l'anglais, ou sont redirigées ; la documentation prévoit une option de sous-chemin pour la langue source, dont l'usage pour garder le français à la racine est à vérifier lors de la v2.0.1.

Statut : proposition, à valider

Répond à : MF-23, R-12, décision du 15/10/2026 (Q-09)

### CT-05 — Hébergement du front

Contexte : le front est un ensemble de fichiers statiques (CT-01). Il lui faut : le domaine du site en HTTPS ; une vraie réponse 404 avec la page introuvable (MF-05) ; des en-têtes de sécurité (section 7) ; des redirections pour les anciennes adresses (section 10) ; une préversion de staging pour la recette ; 0 € par mois (décision du 15/10/2026) ; et un repli si l'offre change, car les offres gratuites changent.

Options :

| Option | Pour | Contre | Coût |
| --- | --- | --- | --- |
| Cloudflare, ressources statiques des Workers | requêtes vers les fichiers statiques gratuites et illimitées ; page 404 la plus proche servie avec le statut 404 ; fichier d'en-têtes et fichier de redirections ; préversions par branche ; builds gratuits (3 000 minutes par mois) ; Cloudflare recommande Workers pour les nouveaux projets | le domaine doit être une zone DNS active chez Cloudflare (CT-13) ; un compte de plus ; plafonds de 20 000 fichiers et de 25 Mio par fichier | 0 € |
| Cloudflare Pages | mêmes atouts pour du statique ; un sous-domaine peut être rattaché par simple alias DNS sans déplacer la zone | Cloudflare oriente les nouveaux projets vers Workers ; le domaine nu exige quand même la zone chez Cloudflare ; 500 builds par mois | 0 € |
| GitHub Pages | aucun compte de plus ; domaine nu et www configurables chez OVH sans déplacer la zone ; HTTPS ; page 404 personnalisée | en-têtes HTTP personnalisés et règles de redirection non documentés (à vérifier) ; pas de préversion ; limite douce de 100 Go par mois ; usage d'hébergement commercial exclu | 0 € |
| Netlify, offre gratuite | outillage complet | offre à crédits : 300 crédits, 15 par déploiement de production, 20 par Go transféré ; le comportement à épuisement des crédits n'est pas décrit sur la page de tarifs (à vérifier) | 0 € tant que les crédits suffisent |
| Vercel, offre Hobby | outillage complet | usage personnel et non commercial seulement ; au-delà des quotas (100 Go de transfert), attente de 30 jours avant de retrouver la fonction | 0 € |
| Render, site statique | même fournisseur que le back (CT-06) | l'espace gratuit inclut 5 Go de bande passante, et un dépassement sans moyen de paiement suspend les services ; front et back tomberaient ensemble | 0 € |

Recommandation : Cloudflare, ressources statiques des Workers, sans script Worker : le site n'exécute aucun code chez l'hébergeur, donc rien de propre à Cloudflare n'entre dans le code. Motif du choix : parmi les options étudiées, quatre réunissent vraie réponse 404, en-têtes de sécurité, redirections et préversions (les deux offres de Cloudflare, Netlify et Vercel) ; les deux offres de Cloudflare sont les seules d'entre elles sans quota de trafic ni crédits sur les fichiers statiques et sans restriction d'usage ; entre elles, les ressources statiques des Workers l'emportent sur Pages parce que Cloudflare oriente les nouveaux projets vers Workers : sur deux ans (R-03), mieux vaut l'offre que l'éditeur recommande que celle dont il détourne les nouveaux projets. Risque : fin ou durcissement de l'offre. Parade : le build produit des fichiers standard ; la page 404, le fichier d'en-têtes et le fichier de redirections ont un équivalent chez tout hébergeur statique et sur le serveur web d'un VPS ; repli immédiat sur GitHub Pages (mêmes fichiers, sans en-têtes ni redirections), puis sur un VPS (section 6).

Statut : proposition, à valider

Répond à : MF-04, MF-05, R-03, R-04, décision du 15/10/2026 (hébergement géré, gratuit et portable)

### CT-06 — Hébergement du back

Contexte : le back est une image Docker Spring Boot (décision du 15/10/2026) qui ne sert qu'au formulaire (MF-16), avec un trafic faible. Il lui faut : 0 € par mois ; un hébergement géré, sans administration système ; assez de mémoire pour une JVM ; des variables d'environnement pour les secrets ; un domaine personnalisé ; de préférence une région européenne (données du formulaire, CT-12). Les offres gratuites de ce type mettent le service en veille quand il ne reçoit pas de trafic.

Options :

| Option | Pour | Contre | Coût |
| --- | --- | --- | --- |
| Render, instance gratuite, région Francfort | image construite depuis le Dockerfile du dépôt, ou tirée d'un registre (pour l'instance gratuite : à vérifier) ; HTTPS et domaine personnalisé ; variables d'environnement ; déploiement après CI verte ; 512 Mo de mémoire | veille après 15 minutes sans trafic, réveil d'environ une minute ; 0,1 CPU, donc démarrage de JVM lent (à mesurer) ; 750 heures par mois pour toutes les instances gratuites de l'espace, toutes suspendues si elles sont épuisées ; ports SMTP sortants bloqués ; redémarrage possible à tout moment ; disponibilité de l'instance gratuite à Francfort à vérifier | 0 € ; repli payant sans veille à 7 $ par mois (0,5 CPU, 512 Mo) |
| Google Cloud Run, palier gratuit | mise à l'échelle à zéro ; palier large (2 millions de requêtes par mois) ; réveil plus court si plus de CPU (à vérifier) | compte de facturation obligatoire : un abus peut se facturer ; configuration plus technique ; conditions régionales du palier à vérifier | 0 € dans le palier, risque de facturation |
| Northflank, bac à sable | pas de mise en veille annoncée | moyen de paiement obligatoire ; l'éditeur écrit que le bac à sable ne doit pas servir à des applications de production | 0 € annoncé, usage exclu |
| Koyeb, Fly.io, Railway | — | Koyeb : aucune instance de calcul gratuite sur sa page de tarifs ; Fly.io : aucune offre gratuite pour les nouvelles organisations ; Railway : 1 $ de crédit par mois après l'essai, trop peu pour une JVM permanente (à vérifier) | payant en pratique |
| VM gratuite (Oracle Cloud, offre Always Free) | vraie VM, sans veille | administration système entière (sécurité, mises à jour, sauvegardes) : c'est le lot VPS, séparé et postérieur à la v2.0.0 ; une instance jugée inactive peut être récupérée par l'éditeur | 0 € ; effort élevé ; hors lot |

Recommandation : Render, instance gratuite, région Francfort, joint par un sous-domaine du domaine du site : le front appelle une adresse qui appartient à Alexandre, et changer d'hébergeur du back ne demande qu'une modification DNS, sans rebuild du front. La mise en veille est acceptée et traitée par la conception : réveil anticipé, attente explicite, démarrage accéléré (section 4, « Mise en veille : ce que vit le visiteur »). Pas de maintien artificiel en éveil par des appels périodiques : un service gardé éveillé consomme environ 744 des 750 heures mensuelles de l'espace, l'instance de préproduction épuiserait le reste, et l'épuisement suspend toutes les instances gratuites, production comprise. Risques et parades : fin de l'offre ou limites durcies, l'image Docker tourne telle quelle chez un autre hébergeur de conteneurs ou sur un VPS, seuls les variables d'environnement et l'enregistrement DNS changent ; réveil trop lent même optimisé, instance payante sans veille, décision d'Alexandre (D-04).

Statut : proposition, à valider

Répond à : MF-16, R-03, R-09, R-11, décision du 15/10/2026 (hébergement géré et gratuit, back en image Docker)

### CT-07 — Envoi des e-mails

Contexte : chaque message valide doit parvenir à Alexandre avec les cinq informations saisies (MF-16, SC-2.0-23), dans la boîte retenue par l'hypothèse de Q-10. Contraintes : ports SMTP sortants bloqués sur l'instance gratuite recommandée (CT-06) ; secrets dans les seules variables d'environnement de l'hébergeur (décision du 13/10/2026) ; 0 € ; remise fiable, car un message classé indésirable est un message perdu. Les offres gratuites d'envoi changent : celle de SendGrid a été retirée à partir du 27/05/2025.

Options :

| Option | Pour | Contre | Coût |
| --- | --- | --- | --- |
| SMTP de la boîte personnelle d'Alexandre | aucun service de plus | impossible sur l'instance gratuite (ports bloqués) ; identifiants de la boîte personnelle confiés au back ; expédition mal authentifiée | 0 € ; non retenu |
| Brevo, API HTTPS, offre gratuite | éditeur français ; données hébergées dans l'Union européenne selon l'éditeur (à vérifier dans son accord de traitement) ; 300 e-mails par jour une fois le compte approuvé pour l'envoi ; API HTTPS, non bloquée | approbation du compte à obtenir ; offre susceptible de changer ; logo de l'éditeur toujours présent en pied d'e-mail sur l'offre gratuite selon sa page d'aide, qui parle des campagnes et n'a été lue que par un résumé de recherche (accès direct refusé) : son ajout aux e-mails transactionnels envoyés par l'API est à vérifier ; il ne serait vu que d'Alexandre, seul destinataire | 0 € |
| Resend, API HTTPS, offre gratuite | API simple ; 3 000 e-mails par mois, 100 par jour ; 30 jours de journaux | localisation des données à vérifier (transferts éventuels à mentionner, CT-12) | 0 € |
| Mailjet, API HTTPS, offre gratuite | 6 000 e-mails par mois, 200 par jour | logo de l'éditeur probablement ajouté sur l'offre gratuite (à vérifier) | 0 € |
| SendGrid | — | offre gratuite retirée à partir du 27/05/2025 | payant ; non retenu |

Recommandation : un prestataire d'envoi transactionnel appelé par son API HTTPS, Brevo de préférence (traitement en Europe, quota très au-dessus du besoin). Le message part d'une adresse d'expédition sur le domaine du site, authentifiée par SPF, DKIM et DMARC selon la procédure du prestataire (CT-13), vers la boîte d'Alexandre, dont l'adresse vit dans une variable d'environnement et jamais dans le dépôt public. La réponse est dirigée vers l'adresse saisie par le visiteur : « Répondre » lui écrit directement. Le corps est en texte brut et reprend les cinq champs. Le back n'écrit jamais à l'adresse saisie (pas d'accusé de réception) : le formulaire ne peut pas servir de relais vers des tiers. Risque : fin de l'offre ou changement d'API. Parade : l'envoi est isolé derrière une interface du back (section 4) ; changer de prestataire, c'est un adaptateur et des variables d'environnement, sans toucher au front ni au reste du back ; Resend ou Mailjet en repli ; sur un VPS, SMTP redevient possible.

Statut : proposition, à valider

Répond à : MF-16, MF-20, R-09, décision du 13/10/2026 (secrets), décision du 15/10/2026 (budget nul)

### CT-08 — Protection contre les messages indésirables

Contexte : le formulaire doit être protégé contre les messages indésirables, et cette protection testée (MF-16, Q-11, R-13). Un formulaire public sur un domaine indexé attire surtout des robots génériques ; leurs envois consomment le quota d'envoi (CT-07) et encombrent la boîte d'Alexandre. La protection ne doit gêner ni les humains, ni l'accessibilité, ni la vie privée (MF-20), et ne doit pas dépendre d'une offre gratuite de plus si on peut l'éviter.

Options :

| Option | Pour | Contre | Coût |
| --- | --- | --- | --- |
| Couches natives : validation côté serveur ; champ piège invisible ; jeton de formulaire signé et horodaté, délivré par le back (délai minimal, âge maximal) ; limite d'envois par adresse IP ; plafond quotidien global | invisibles pour l'humain ; aucun tiers, aucun compte, aucun cookie ; entièrement testables ; portables ; le jeton réveille aussi le back (section 4) | arrêtent les robots génériques, pas un robot écrit pour ce site | 0 € ; effort faible |
| Couches natives et Cloudflare Turnstile | défi le plus souvent invisible ; gratuit, vérifications illimitées ; clés de test officielles | script tiers chargé chez le visiteur et données transmises à un tiers, à déclarer (MF-20) ; une offre gratuite et un compte de plus | 0 € ; effort faible |
| Couches natives et ALTCHA (preuve de travail auto-hébergée) | licence MIT ; ni tiers ni cookie par défaut ; bibliothèque Java disponible ; continue de fonctionner même si le projet s'arrête | une dépendance de plus de chaque côté ; le calcul ralentit un robot sans le bloquer ; un composant à intégrer à la maquette | 0 € ; effort moyen |
| Défi visuel classique (images à reconnaître) | connu | friction pour l'humain, obstacle d'accessibilité, service tiers | variable ; non retenu |

Recommandation : les couches natives en v2.0.0, organisées dans le back en une chaîne de filtres indépendants (section 4) : ajouter une couche plus tard ne touche que cette chaîne et le formulaire. Seuils de départ (proposition, à valider), réglables par variable d'environnement : 3 secondes au moins entre la délivrance du jeton et l'envoi ; jeton valable 2 heures, renouvelé par le front sans action du visiteur ; 5 envois par heure et par adresse IP ; 50 envois par jour au total, en pratique par période d'éveil (voir « Compteurs » ci-dessous), bien en dessous du quota du prestataire. Réponses : un envoi pris par le champ piège reçoit une réponse de succès et rien ne part, le robot n'apprend rien ; un envoi trop rapide, sans jeton valide ou au-delà des limites reçoit l'erreur réessayable de SC-2.0-26, parce qu'un humain pressé ne doit jamais perdre son message en silence. Côté front, aucun envoi ne part sans jeton ni avant le délai minimal : si le visiteur envoie avant l'arrivée du jeton, par exemple pendant le réveil du back, le front garde « envoi en cours », attend le jeton puis le délai minimal, dans la limite des 90 secondes d'attente (section 3), et seulement ensuite envoie ; au-delà, il affiche l'erreur réessayable (SC-2.0-26). Renfort prévu : si des messages indésirables passent (seuil proposé : plus de 5 par semaine deux semaines de suite), ajouter ALTCHA, auto-hébergé et sans tiers, de préférence à Turnstile (D-06). Le test de la protection est décrit en section 8.

Compteurs : la limite par adresse IP et le plafond quotidien vivent en mémoire, dans l'unique instance du back ; ils sont remis à zéro à chaque mise en veille et à chaque redémarrage (CT-06). Le plafond « quotidien » est donc un plafond par période d'éveil, et le vrai filet est le quota du prestataire d'envoi (CT-07), dont l'épuisement ferait échouer visiblement des envois légitimes (SC-2.0-26) jusqu'à son renouvellement. Ce risque est assumé en v2.0.0 : chaque remise à zéro par la veille suppose 15 minutes sans aucun trafic ; un compteur qui survive à la veille demanderait un stockage, exclu le 13/10/2026, ou un service de plus ; les journaux du back enregistrent chaque échec du prestataire (CT-14) ; un épuisement constaté déclenche aussi le renfort prévu ci-dessus (proposition, à valider), dont la preuve de travail renchérit chaque envoi d'un robot quel que soit l'état des compteurs.

Statut : proposition, à valider

Répond à : MF-16, MF-20, R-09, R-13, décision du 15/10/2026 (Q-11)

### CT-09 — Intégration et déploiement continus

Contexte : l'ancien site n'a aucun test (R-06). Le dépôt est public sur GitHub ; staging reçoit les PR, main reste l'ancien site jusqu'à la v2.0.0 (décision du 13/10/2026) ; aucun secret ne vit ailleurs que chez l'hébergeur ; 0 €. GitHub Actions est gratuit pour les dépôts publics sur les machines standard.

Options :

| Option | Pour | Contre | Coût |
| --- | --- | --- | --- |
| GitHub Actions pour tout : tests, builds et déploiement par jetons | une seule chaîne, entièrement décrite dans le dépôt | les jetons de déploiement des hébergeurs vivraient dans les secrets de la CI, hors des hébergeurs | 0 € |
| GitHub Actions pour vérifier ; déploiement par l'intégration Git de chaque hébergeur, déclenché par la fusion | aucun secret de déploiement à stocker ; préversions par branche fournies par l'hébergeur du front ; le back ne se déploie qu'après une CI verte (option de l'hébergeur) | le front est construit deux fois (CI et hébergeur) ; une partie de la configuration vit dans les consoles des hébergeurs | 0 € |
| Builds et déploiements chez les hébergeurs, sans CI | rien à écrire | aucun test bloquant : contraire à R-06 | 0 € ; non retenu |

Recommandation : la deuxième option. Sur chaque PR vers staging, la CI exécute : installation verrouillée des dépendances, analyse statique, tests unitaires du front et du back, contrôle du contenu, build pré-rendu, tests de bout en bout sur ce build, contrôles d'accessibilité et de performance, construction de l'image Docker (CT-10). La protection des branches staging et main exige une CI verte avant fusion. Déploiements : staging alimente la préproduction (préversion du front, instance de préproduction du back) ; main alimente la production, branchée seulement à la v2.0.0, première fusion de staging dans main, taguée. La configuration de déploiement qui peut vivre dans le dépôt y vit (configuration de l'hébergeur du front, Dockerfile, description du service du back si l'hébergeur le permet), pour qu'un changement d'hébergeur reste lisible. Pour la portabilité, l'image du back peut être publiée à chaque tag dans le registre de conteneurs de GitHub, gratuit pour les paquets publics, avec le jeton éphémère de la CI : aucun secret stocké.

Statut : proposition, à valider

Répond à : R-03, R-06, décision du 13/10/2026 (branches, secrets), décision du 15/10/2026 (portabilité)

### CT-10 — Stratégie de tests

Contexte : « aucun test » est un défaut constaté de l'ancien site (R-06). Le formulaire et sa protection (MF-16, R-13), les liens directs (R-04), la lecture sur téléphone (MF-06), les navigateurs (R-10) et la rapidité (R-08) doivent être contrôlés avant la recette (Étape 7), sans base ni conteneur à orchestrer. Les seuils « bons » des Core Web Vitals sont : affichage du plus grand élément en 2,5 s au plus, réactivité aux interactions en 200 ms au plus, décalage visuel cumulé de 0,1 au plus, mesurés sur le 75e centile des visites réelles.

Options :

| Option | Pour | Contre | Coût |
| --- | --- | --- | --- |
| Tests manuels seulement | aucun outillage | non reproductibles ; régressions invisibles pendant deux ans | 0 € ; non retenu |
| Pyramide outillée : tests unitaires du front et du back, contrôle du contenu, tests de bout en bout sur le site pré-rendu, accessibilité et performance automatisées, plus une courte passe manuelle | chaque scénario a son contrôle ; tout tourne dans la CI gratuite ; outils standards et maintenus | quelques minutes de CI ; tests de bout en bout à entretenir | 0 € ; effort moyen |
| Pyramide et tests visuels par captures, ou fermes d'appareils réels | détecte les régressions visuelles | services payants ou comptes tiers ; captures fragiles | payant ; non retenu en v2.0.0 |

Recommandation : la pyramide outillée. Front : Vitest, lanceur par défaut des projets Angular. Back : JUnit et les tests par tranche de Spring Boot, le prestataire d'envoi étant simulé par l'outillage de test de Spring (succès, échec, délai dépassé) ; pas de Testcontainers, il n'y a rien à conteneuriser. Navigateurs à couvrir (R-10), fixés ici : ceux que prend en charge la version d'Angular retenue, soit Chrome, Edge, Firefox et Safari, sur ordinateur et sur téléphone (section 3) ; les largeurs d'écran relèvent de la charte (T2.3). Bout en bout : Playwright sur Chromium, Firefox et WebKit, avec émulation de téléphone, sur le build pré-rendu servi comme en production. Accessibilité : axe-core dans Playwright, en sachant qu'un outil automatique ne détecte pas tout. Performance : Lighthouse CI, qui fait respecter des budgets. Seuils (proposition, à valider, R-08) : sur profil mobile, score de performance Lighthouse d'au moins 90 ; en laboratoire, plus grand élément affiché en 2,5 s au plus et décalage cumulé de 0,1 au plus ; aucune violation détectée par axe-core sur les règles WCAG de niveaux A et AA. Les mesures de terrain demandent un trafic qu'un portfolio n'aura probablement pas : la mesure de laboratoire est le seul contrôle praticable. Détail par scénario en section 8.

Statut : proposition, à valider

Répond à : MF-04, MF-06, MF-16, R-06, R-08, R-10, R-13

### CT-11 — Référencement et aperçu au partage

Contexte : l'ancien site n'a « aucun référencement » (R-05). Quand on cherche « Alexandre Morozoff », le résultat doit montrer son nom, son intitulé (« Développeur fullstack, orienté architecture logicielle », Q-13) et une description juste ; un lien partagé doit produire un aperçu propre. Les robots d'aperçu n'exécutent pas tous JavaScript ; Google lit un plan du site comme une simple indication ; le fichier robots doit s'appeler exactement robots.txt et se trouver à la racine. Le protocole Open Graph impose quatre propriétés : titre, type, image et adresse canonique.

Options :

| Option | Pour | Contre | Coût |
| --- | --- | --- | --- |
| Balises posées par le navigateur après chargement | simple | invisibles pour les robots qui n'exécutent pas JavaScript : aperçus vides | 0 € ; non retenu |
| Balises écrites dans chaque page pré-rendue ; plan du site et fichier robots générés au build ; données structurées « Person » ; domaine vérifié dans la Search Console de Google | visibles par tous les robots ; aucune dépendance ; vérifiables dans la CI | une image d'aperçu à produire (charte, T2.3) | 0 € ; effort faible |
| Même chose, plus des outils de référencement payants | suivi fin | coût et complexité sans rapport avec un portfolio | payant ; non retenu |

Recommandation : la deuxième option. Chaque page pré-rendue porte son titre et sa description, une adresse canonique sur le nom d'hôte retenu (D-08), sans ancre, les quatre propriétés Open Graph et une carte d'aperçu. Une section de la page principale n'a ni titre, ni description, ni adresse canonique à elle : un moteur indexe des documents, pas des ancres, et le titre et la description restent ceux de la page pendant toute la lecture, quand l'adresse suit la section lue (section 3). La page principale, qui s'ouvre sur l'accueil, porte des données structurées schema.org « Person » : nom, intitulé, adresse du site et profils GitHub et LinkedIn (MF-17). Le plan du site est généré au build à partir des pages pré-rendues qui s'indexent : la page principale, chaque fiche projet, le contact et les mentions légales, sans ancre ni page introuvable ; un projet ajouté y entre seul. Le fichier robots, correctement nommé et placé à la racine, l'annonce. La page introuvable et sa variante « projet inexistant » répondent 404 et portent une consigne de non-indexation ; les préversions de staging portent une consigne de non-indexation, pour ne pas concurrencer la production. Le domaine est vérifié dans la Search Console par un enregistrement DNS, sans code. Contrôles : présence et unicité des balises dans les tests de bout en bout ; aperçu de partage vérifié à la main avant la recette. Aucune position dans les résultats n'est promise.
Révision du 10/11/2026 : les sections ne sont plus des pages, décision d'Alexandre du 10/11/2026 ; la recommandation est relue dans ce sens (un titre et une description par page, aucun par section, plan du site de la page principale et des pages à part).

Statut : proposition, à valider

Répond à : MF-01, MF-04, MF-05, MF-12, MF-17, R-04, R-05

### CT-12 — Données personnelles du formulaire

Contexte : le formulaire collecte nom, prénom, adresse e-mail, sujet et message (MF-16). Le visiteur doit savoir, avant l'envoi, qui reçoit ses données et pourquoi (MF-20) ; l'article 13 du RGPD demande aussi d'indiquer la durée de conservation ou ses critères. La conception doit dire combien de temps les données sont conservées (R-09). Aucune base (décision du 13/10/2026). Pour un prospect non client, la CNIL admet une conservation de trois ans à compter de la collecte ou du dernier contact émanant de la personne.

Options :

| Option | Pour | Contre | Coût |
| --- | --- | --- | --- |
| Stocker les messages côté site, en base ou en fichiers | historique consultable hors messagerie | contraire à la décision du 13/10/2026 ; une base à protéger, sauvegarder et purger | non retenu |
| Aucun stockage côté site : traitement en mémoire, transmission au prestataire, remise dans la boîte d'Alexandre ; journaux techniques sans donnée personnelle | surface minimale ; rien à purger côté site ; information simple à rédiger | la conservation se joue dans la boîte d'Alexandre et dans les journaux du prestataire, à encadrer | 0 € |
| Même chose, plus un accusé de réception envoyé au visiteur | rassure le visiteur | le formulaire deviendrait un relais vers des adresses arbitraires ; une donnée de plus chez le prestataire | non retenu |

Recommandation : aucun stockage côté site. Le back garde le message en mémoire le temps de la requête. Ses journaux ne contiennent ni champ du formulaire ni adresse e-mail : seulement l'issue (envoyé, refusé et par quel filtre, échec du prestataire). L'adresse IP ne sert qu'à la limite d'envois, en mémoire, effacée à l'expiration de sa fenêtre d'une heure, à la mise en veille ou au redémarrage. Chez le prestataire, les journaux d'envoi suivent sa politique (30 jours chez Resend selon sa page de tarifs ; durée chez Brevo à vérifier), à citer dans l'information. Dans la boîte d'Alexandre : au plus trois ans après le dernier échange, par analogie avec la durée admise par la CNIL pour un prospect, et suppression des messages restés sans suite (proposition, à valider). Information affichée avant le bouton d'envoi, texte final à valider par Alexandre (MF-20) : qui reçoit (Alexandre Morozoff), pourquoi (répondre au message), sur quelle base légale, quels prestataires techniques interviennent (hébergeur du front, hébergeur du back, prestataire d'envoi, fournisseur de la boîte d'Alexandre) et s'ils transfèrent les données hors de l'Union européenne, combien de temps, quels droits (accès, rectification, effacement, à exercer par le même formulaire) et le droit de réclamation auprès de la CNIL. Base légale proposée (proposition, à valider) : l'intérêt légitime d'Alexandre à répondre aux personnes qui lui écrivent (article 6, paragraphe 1, point f, du RGPD), que l'information doit alors nommer (article 13, paragraphe 1, point d) ; le consentement serait l'autre voie, avec son retrait à organiser. Transferts éventuels hors de l'Union européenne (article 13, paragraphe 1, point f), à citer dans l'information : hébergeur du front, Cloudflare, Inc., société établie à San Francisco aux États-Unis, dont le réseau est mondial : il traite l'adresse IP de chaque visiteur pour servir les pages ; il traite aussi les champs du formulaire, non comme hébergeur du front mais comme infrastructure de l'hébergeur du back : Render sert ses services à travers le réseau de Cloudflare (constat du 16/10/2026 par requêtes publiques, et page de Render sur la protection contre les dénis de service), et le réglage « DNS seulement » de la zone (CT-13) n'y change rien ; Cloudflare couvre ses transferts vers les États-Unis par sa certification au Data Privacy Framework UE–États-Unis, avec repli sur les clauses contractuelles types ; hébergeur du back, Render, certifié au Data Privacy Framework UE–États-Unis depuis le 06/01/2025 selon son journal des changements, instance prévue en région Francfort (CT-06) : sa raison sociale exacte et d'éventuels traitements hors de cette région (journaux, support, sous-traitants) sont à vérifier dans son accord de traitement ; prestataire d'envoi, Brevo, éditeur français : données hébergées dans l'Union européenne selon sa page d'aide, sous-traitants éventuels hors de l'Union à vérifier dans son accord de traitement ; la boîte d'Alexandre, désignée avec D-05, peut elle aussi traiter les messages hors de l'Union selon son fournisseur (à vérifier). Le Data Privacy Framework repose sur une décision d'adéquation de la Commission européenne du 10/07/2023 ; son statut au moment de publier le texte est à vérifier. Le site n'a ni mesure d'audience, ni cookie, ni police chargée chez un tiers : aucun traceur, donc pas de bandeau de consentement ; à réexaminer si un service tiers s'ajoute, comme Turnstile.

Statut : proposition, à valider

Répond à : MF-16, MF-19, MF-20, R-09, décision du 13/10/2026 (aucune base)

### CT-13 — Zone DNS du domaine

Contexte : le domaine alexandre-morozoff-dev.fr reste chez OVH comme registraire (décision du 15/10/2026). Le 15/10/2026, sa zone DNS est servie par OVH et publie aussi des enregistrements de messagerie vers OVH, avec une politique SPF qui n'autorise que les serveurs d'OVH (section 10). Aucune messagerie n'est à préserver : aucune adresse e-mail n'est utilisée sur le domaine (D-09). DNSSEC est actif : le 15/10/2026, une requête publique sur l'enregistrement DS du domaine en renvoie un. Cloudflare demande de retirer ce DS chez le registraire avant de changer de serveurs de noms : si les serveurs de noms changent avant que le DS ait expiré des caches, les résolveurs qui valident DNSSEC répondent en échec (SERVFAIL), car le DS en cache ne correspond pas aux clés de Cloudflare, et le domaine devient injoignable pour leurs utilisateurs. Le front recommandé exige que le domaine soit une zone active chez Cloudflare pour s'y rattacher (CT-05) ; l'envoi depuis le domaine exige des enregistrements d'authentification (CT-07) ; le back est joint par un sous-domaine (CT-06). La configuration DNS complète de Cloudflare est disponible dans son offre gratuite.

Options :

| Option | Pour | Contre | Coût |
| --- | --- | --- | --- |
| Garder la zone chez OVH | aucun changement de serveurs de noms | incompatible avec le domaine personnalisé du front recommandé : il faudrait GitHub Pages (CT-05) | 0 € |
| Déplacer la zone chez Cloudflare (configuration complète, offre gratuite), registraire OVH inchangé | domaine nu et www pour le front ; tous les enregistrements (front, back, envoi, messagerie, vérification Google) au même endroit ; protection contre les attaques par saturation incluse | une bascule de serveurs de noms à préparer : recopier d'abord les enregistrements existants ; DNSSEC à désactiver chez OVH puis à réactiver chez Cloudflare, dans l'ordre, sous peine de rendre le domaine injoignable pour les résolveurs qui valident ; quelques jours de délais cumulés, dont une courte période sans DNSSEC | 0 € |
| Transférer aussi le domaine chez Cloudflare comme registraire | tout au même endroit | contraire à la décision du 15/10/2026 (domaine conservé chez OVH) | non retenu |

Recommandation : déplacer la zone chez Cloudflare, registraire OVH inchangé, avant la bascule du site. L'opération ne change rien au site si elle suit cette procédure, qu'Alexandre exécute lui-même (liste détaillée en section 6, étape 1) ; sans elle, DNSSEC rend le domaine injoignable pour une partie des visiteurs. Dans l'ordre : créer la zone chez Cloudflare, y recopier les enregistrements existants et abaisser leur durée de mise en cache ; désactiver DNSSEC chez OVH, ce qui retire le DS (24 heures pour être effectif selon OVH) ; vérifier par requête publique que le domaine ne publie plus de DS, puis attendre encore au moins un TTL du DS (Cloudflare conseille jusqu'à une fois et demie) ; changer les serveurs de noms chez OVH pour ceux de Cloudflare, sans en garder d'autres ; attendre que le TTL des anciens enregistrements de serveurs de noms soit écoulé et que Cloudflare voie la zone active, puis vérifier que l'ancien site répond comme avant ; activer DNSSEC chez Cloudflare, qui fournit un nouveau DS, et publier ce DS chez OVH ; vérifier par requête publique que le nouveau DS est publié et que le domaine se résout. Entre la désactivation chez OVH et la publication du nouveau DS, le domaine n'est pas protégé par DNSSEC. Retour arrière de la zone : le chemin inverse — retirer chez OVH le DS de Cloudflare, attendre au moins un TTL du DS, remettre les serveurs de noms d'OVH, dont la zone doit alors contenir les enregistrements voulus, attendre que le TTL des enregistrements de serveurs de noms de Cloudflare soit écoulé, puis réactiver DNSSEC chez OVH. Aucune messagerie n'est à préserver pendant ces opérations (D-09). La bascule du site (section 6) n'est ensuite qu'une modification d'enregistrements dans la zone Cloudflare, réversible, sans toucher aux serveurs de noms ni à DNSSEC. L'enregistrement du sous-domaine du back reste en « DNS seulement » : Render le demande pour vérifier le domaine et émettre le certificat. Ce réglage n'empêche pas les champs du formulaire de transiter par le réseau de Cloudflare, sur lequel Render s'appuie lui-même ; l'information sur les données le dit (CT-12). Le nom d'hôte canonique, www comme aujourd'hui ou domaine nu, est la décision D-08 ; l'autre redirige vers lui. Si le front revient un jour sur GitHub Pages, repli de CT-05, la zone peut revenir chez OVH par le chemin inverse décrit ci-dessus.

Statut : proposition, à valider

Répond à : MF-04, MF-16, R-04, R-05, décision du 15/10/2026 (domaine conservé chez OVH)

### CT-14 — Surveillance du site en production

Contexte : un site qui doit fonctionner deux ans sans qu'on y touche (R-03) peut tomber sans que personne ne le voie : offre gratuite suspendue, quota épuisé, prestataire d'envoi en panne. Le visiteur voit alors l'erreur de SC-2.0-26, mais Alexandre l'ignore. Contraintes : 0 € ; ne pas garder le back éveillé (CT-06). Dans un dépôt public, GitHub désactive les tâches planifiées après 60 jours sans activité du dépôt. L'offre gratuite d'UptimeRobot propose 50 sondes à 5 minutes d'intervalle, avec alerte par e-mail.

Options :

| Option | Pour | Contre | Coût |
| --- | --- | --- | --- |
| Aucune surveillance | rien à faire | panne découverte par hasard, peut-être par un recruteur | 0 € ; non retenu |
| Sonde externe sur le front toutes les 5 minutes ; contrôle quotidien du back par une tâche planifiée de la CI ; alertes par e-mail | pannes du front vues en minutes, celles du back en un jour, sans tenir le back éveillé | tâche planifiée désactivée après 60 jours sans activité du dépôt ; un compte tiers de plus | 0 € |
| Sonde externe toutes les 5 minutes sur le front et sur le back | détection rapide partout | tient le back éveillé en permanence : quota d'heures consommé, suspension possible de toutes les instances gratuites (CT-06) | 0 € ; non retenu |

Recommandation : la deuxième option. Le contrôle quotidien vérifie : les pages clés répondent 200 ; une adresse inconnue répond 404 avec la page introuvable ; le fichier robots et le plan du site sont servis en texte et en XML ; l'indicateur de santé du back répond ; le back accepte l'origine du site. Le back journalise tout échec du prestataire ; les notifications de l'hébergeur du back (échec de déploiement, suspension) sont activées. Contre la désactivation après 60 jours : l'activité régulière du robot de mises à jour et l'entretien annuel (section 9) ; savoir si l'ouverture de PR par ce robot compte comme activité est à vérifier. La sonde externe du front ne dépend pas du dépôt.

Statut : proposition, à valider

Répond à : MF-16, R-03, décision du 15/10/2026 (hébergement gratuit)

## 3. Front

Pile. Angular 22, retenu le 15/10/2026 à la place d'Angular 21 (CT-02, D-01), en composants autonomes, sans zone, avec signaux (décision du 13/10/2026). Pages pré-rendues au build (CT-01), hébergées en fichiers statiques (CT-05).

Organisation logique. Un cadre commun à toutes les pages, page introuvable comprise, porte la navigation identique partout (MF-03), l'accès au contact (MF-02), les liens vers GitHub et LinkedIn (MF-17) et le lien vers les mentions légales (MF-19). Les contenus à présenter sont : l'accueil (MF-01), le parcours et l'orientation (MF-07, MF-08), les compétences (MF-09, MF-10), le rôle en alternance (MF-11), la méthode de travail (MF-21), la liste des projets et la fiche d'un projet (MF-12, MF-13, MF-22), le contact et son information sur les données (MF-16, MF-20), les mentions légales (MF-19) et la page introuvable (MF-05). Leur répartition et leurs adresses viennent du parcours d'écrans (T2.2) : depuis la décision d'Alexandre du 10/11/2026 (PN-01, option D), une page principale enchaîne l'accueil et cinq sections, et la fiche de chaque projet, le contact, les mentions légales et la page introuvable sont des pages à part. Les paragraphes « Adresses et pages pré-rendues » à « Sans script » disent comment le front sert ce site ; ils nomment les moyens que le plan du front reprend et détaille.

Contenu. Le front lit les fichiers de contenu au build par une couche d'accès typée (CT-03, section 5). Aucune page ne charge son contenu depuis le back : les pages ne dépendent jamais d'un service qui peut dormir.

Adresses et pages pré-rendues (R-04, MF-04, MF-05, MF-14). Les adresses sont celles du plan du site du parcours d'écrans (section 2). Chacune est servie par un document pré-rendu, ou par une page introuvable que l'hébergeur sert avec le statut 404 :

| Adresse | Ce qui s'affiche | Document servi |
| --- | --- | --- |
| / | la page principale : l'accueil en haut, sans ancre, puis les sections parcours, compétences, expérience, méthode de travail et projets, chacune à son ancre (/#parcours, /#competences, /#experience, /#methode, /#projets), puis le pied de page, sans bloc de plus (V-10) | un document pré-rendu |
| /projets/ suivi de l'identifiant d'un projet | la fiche du projet | un document pré-rendu par projet, énuméré au build depuis le contenu |
| /contact | le contact et son formulaire | un document pré-rendu |
| /mentions-legales | les mentions légales | un document pré-rendu |
| /projets/ suivi d'un identifiant inconnu | la page introuvable, variante « projet inexistant », avec le retour vers la liste des projets | la page introuvable placée dans projets/, servie en 404 |
| toute autre adresse | la page introuvable | la page introuvable placée à la racine, servie en 404 |

- Pré-rendu : la sortie statique d'Angular (routes serveur en RenderMode.Prerender) pré-rend la page principale ; chaque fiche, dont les identifiants sont énumérés au build depuis l'index du contenu (getPrerenderParams), si bien qu'un projet ajouté a sa page sans autre changement (MF-14) ; le contact ; les mentions légales ; les deux pages introuvables, qu'une étape après le build place là où l'hébergeur les cherche (404.html à la racine, projets/404.html). La route de repli (« ** ») est rendue dans le navigateur (RenderMode.Client), jamais pré-rendue. Le statut 404 vient de l'hébergeur, qui sert la page 404 la plus proche de l'adresse demandée (CT-05), jamais d'un script.
- Les sections ne sont pas des routes du routeur : ce sont des éléments de la page principale, dont l'id est le nom de l'ancre (parcours, competences, experience, methode, projets). Aucune n'est différée (@defer) ni rendue seulement dans le navigateur : chaque ancre existe dans le document pré-rendu, donc dès l'ouverture, et dès le rendu quand le routeur mène à la page principale.
- Ne sont plus des adresses du site : /parcours, /competences, /experience, /methode et /projets, devenues des sections de la page principale ; /cv et /cv/404, avec le fichier qu'elles servaient, sa règle propre dans le fichier d'en-têtes, le champ de contenu qui le nommait et son contrôle (décision d'Alexandre du 10/11/2026, « oui plus de CV du tout », Q-07). La production sert l'ancien site jusqu'à la v2.0.0 : ces adresses n'ont existé que sur la préversion de staging, aucune redirection ne les garde, et elles mènent à la page introuvable comme toute autre adresse. /projets seule, sans identifiant, en fait partie : quelle page introuvable l'hébergeur lui sert, celle de la racine ou celle de projets/, se vérifie sur le build servi, et la variante affichée après le démarrage de l'application doit être celle du document servi (section 8). Les anciennes adresses de la v1 suivent la section 10.

Liens directs et rechargement (R-04). Chaque adresse a son document pré-rendu ; recharger renvoie le même document, ouvert sur la même section, puisque l'adresse tient l'ancre de la section lue (« Section lue, entrée signalée et adresse ») et que le navigateur rouvre la page sur elle (« Ancres »). Pour une adresse inconnue, y compris la fiche d'un projet qui n'existe pas (SC-2.0-07), aucun document n'existe : l'hébergeur sert la page introuvable avec le statut 404 (CT-05).

Ancres, à l'ouverture, au rechargement et après le démarrage de l'application (MF-04, V-11 ; charte, CO-06). Sur toute page, trois cas :

- une ancre de section (/#competences) ouvre la page principale sur cette section, sous l'en-tête ;
- une autre ancre qui nomme un élément de la page ouvre la page sur cet élément, sous l'en-tête ;
- une ancre qui ne nomme rien (/#competence) ouvre la page en haut, sans message d'erreur, et l'adresse redevient celle de la page, sans ancre (V-11 ; sur la page principale, c'est l'accueil).

Moyens :

- Décalage sous l'en-tête : une seule valeur, scroll-padding-top sur l'élément html (5.5rem dans les maquettes : hauteur-entete et une marge), plutôt qu'un scroll-margin-top sur chaque cible : elle vaut pour toutes les ancres, sections et éléments intérieurs. Le navigateur l'applique quand il ouvre une ancre et à Element.scrollIntoView ; le ViewportScroller d'Angular, qui fait défiler vers une ancre par coordonnées (window.scrollTo), l'ignore : aucun défilement vers une ancre ne passe par ses coordonnées.
- À l'ouverture et au rechargement, c'est le navigateur qui ouvre le document pré-rendu sur l'ancre, avant même le démarrage de l'application. L'hydratation réutilise ce document sans le reconstruire, et le routeur ne fait défiler ni vers l'ancre ni en haut tant que l'hydratation n'est pas finie (constat du code d'Angular 22.2.5, section 13) ; le mouvement ne déplace rien, puisque ses états cachés gardent leur place (charte, section 6) : la position reste juste. Le défilement en mémoire du routeur règle history.scrollRestoration sur « manual » : au rechargement, le navigateur ne restaure pas l'ancienne position et rouvre la page sur l'ancre de l'adresse, en haut de la section.
- Après le démarrage, toute navigation interne passe par le routeur : liens du routeur (routerLink, avec fragment pour une ancre). Son défilement en mémoire reste réglé comme en TK-23 (withInMemoryScrolling, scrollPositionRestoration et anchorScrolling à « enabled ») ; le défilement qu'il demande suit ce tableau, que le site pose en complétant l'initialiseur de TK-23, qui règle déjà le retour en haut d'un coup :

| Navigation | Défilement |
| --- | --- |
| vers une autre page, sans ancre | en haut, d'un coup (le retour en haut de TK-23, gardé) |
| vers une autre page, avec une ancre qui nomme un élément | sur l'élément, sous l'en-tête, d'un coup : la page s'ouvre sur lui |
| sur la page principale, vers l'une de ses sections ou vers son haut (entrée de la navigation ou du menu replié, nom, carte de l'accueil) | jusqu'à la section, ou en haut, en défilement doux ; d'un coup si le visiteur a demandé à réduire les animations |
| retour ou avance dans l'historique | à la position mémorisée, d'un coup (comportement du routeur, gardé) |
| vers une ancre qui ne nomme rien, d'où que l'on vienne | en haut, d'un coup, et l'adresse perd son ancre |

- Vers un élément, le défilement passe par Element.scrollIntoView({ block: "start" }), qui applique scroll-padding-top, avec le comportement « instant » ou « smooth » de la ligne du tableau ; « sur la page principale » se lit en comparant le chemin de l'adresse avant et après la navigation. Moyen : l'initialiseur de TK-23, qui remplace déjà ViewportScroller.scrollToPosition pour le retour en haut d'un coup, remplace aussi ViewportScroller.scrollToAnchor, la méthode que le routeur appelle, avec la seule ancre, pour toute navigation qui en porte une ; le remplaçant cherche l'élément, puis appelle Element.scrollIntoView, ou applique le cas de l'ancre qui ne nomme rien (dernier point ci-dessous). La méthode d'origine, qui fait défiler par coordonnées, n'est jamais appelée. L'élément visé devient ensuite le point de départ de la navigation au clavier, comme après un lien d'ancre ordinaire (focus sans défilement).
- Pas d'étape d'historique sur la page principale : un lien de la page principale vers l'une de ses sections ou vers son haut porte replaceUrl, le routeur remplaçant alors l'entrée courante de l'historique au lieu d'en ajouter une ; le même lien, depuis une page à part, reste une navigation ordinaire, qui ajoute une étape.
- Aucune navigation native vers un fragment une fois l'application démarrée (location.hash, location.replace, lien d'ancre hors du routeur), lien d'évitement (CO-14) compris : elle ajoute ou met à la place de l'entrée courante une entrée sans l'état que le routeur pose dans l'historique, ce qui déclenche l'événement popstate, que le routeur traite comme un retour arrière (section 13) ; le mouvement jouerait alors son arrivée immédiate et le routeur restaurerait une position.
- Ancre qui ne nomme rien : le site cherche l'élément par son id (l'ancre décodée). S'il n'existe pas, la page va en haut d'un coup et l'adresse est réécrite sans ancre, par History.replaceState et selon la même règle de moment que le suivi de l'adresse (paragraphe suivant). À l'ouverture, le navigateur a déjà laissé la page en haut : il ne reste qu'à réécrire l'adresse.

Section lue, entrée signalée et adresse (EC-00 ; charte, CO-06 et CO-07, choix 8 du 10/11/2026).

- Section lue : sur la page principale, la dernière section dont le haut a passé 40 % de la hauteur de la fenêtre, comme l'étape active du récit (MV-08) et le script des maquettes ; avant la première, l'accueil. Quand la page ne peut plus défiler vers le bas, c'est la dernière section dont le haut est dans la fenêtre : sans cette règle, sur un écran haut, la dernière section, que suit le seul pied de page, ne passerait jamais le seuil, et son entrée ne serait jamais signalée, même après un clic sur elle.
- Moyen du suivi : le DefilementService de TK-23 (un seul écouteur passif de défilement et de redimensionnement pour tout le site, une mise à jour au plus par image), qui lit la position du haut des cinq sections (getBoundingClientRect). Pas d'IntersectionObserver : il dit qu'un élément croise une zone, pas où se trouve son haut, ni que la page est au bout de son défilement. Le suivi démarre dans le navigateur, après le premier rendu (afterNextRender), jamais au pré-rendu ; il ne dépend pas de mv-actif et marche aussi quand le visiteur a demandé à réduire les animations ; il s'arrête quand on quitte la page principale.
- Entrée signalée : sur la page principale, l'entrée de la section lue porte aria-current="location", et donc le trait de l'entrée courante (CO-02), dans la navigation comme dans le menu replié ; elle change avec la lecture. Le document pré-rendu signale l'accueil, l'état de la page ouverte sans ancre, et le suivi corrige dès le démarrage. Sur une page à part, l'entrée vient des données de la route : « Projets » sur une fiche, « Contact » sur la page de contact (aria-current="page", comme dans les maquettes), aucune sur les mentions légales et la page introuvable. Une donnée de route ne peut pas suivre la lecture : sur la page principale, seule la section lue compte.
- Adresse, sur la page principale. Une fois la page chargée, l'adresse affichée est toujours celle de la section lue : elle est remplacée, sans étape d'historique, dès qu'elle diffère, y compris juste après l'ouverture sur un élément intérieur d'une section (comme les maquettes signées). L'adresse d'une section est son ancre (/#parcours…), celle de l'accueil est /. Moyen : History.replaceState, en gardant history.state, l'état que le routeur y a posé et dont il a besoin au retour arrière. Ce n'est pas une navigation du routeur : ni défilement par le routeur, ni transition (MV-07), ni événement de navigation. Jamais Router.navigate, Location.go, location.hash ni location.replace. Le titre et la description de la page ne changent pas (CT-11).
- Moment : l'adresse n'est pas réécrite avant que le document soit entièrement chargé (document.readyState « complete », sinon à l'événement load). Jusque-là, le navigateur peut encore défiler vers l'ancre que porte l'adresse : réécrite plus tôt, elle l'enverrait vers une autre section (relevé de R2 sur les maquettes, dans Chrome). L'entrée signalée, elle, suit la lecture dès le démarrage.

Transitions entre pages et mouvement de la page principale (MV-02, MV-07, MV-08 ; charte, section 6).

- Le fondu de changement de page (MV-07) joue entre deux pages, quelles qu'elles soient : la page principale et une page à part, dans un sens ou dans l'autre, ou deux pages à part ; jamais d'une section à l'autre de la page principale. Moyen : les transitions de vue du navigateur dans un même document, par la fonction withViewTransitions du routeur d'Angular ; son rappel onViewTransitionCreated annule la transition (skipTransition) quand le chemin de l'adresse ne change pas (seule l'ancre change, ou un lien de la page principale mène à son haut), au retour ou à l'avance dans l'historique, et sans mv-actif. Le suivi de l'adresse n'étant jamais une navigation du routeur, il ne déclenche aucun fondu. C'est une amélioration facultative, une exception admise à la Baseline « largement disponible » du paragraphe « Navigateurs » : un navigateur qui ne connaît pas les transitions de vue navigue sans fondu (charte, MV-07).
- La frise tracée au défilement (MV-02) vit dans la section parcours, le récit au défilement (MV-08) dans la section méthode ; tous deux s'abonnent, comme le suivi de la section lue, au même DefilementService.
- Animations réduites : aucun fondu ; aucun défilement doux (le comportement « instant » du tableau des ancres, et la règle scroll-behavior de la feuille, posée seulement sous prefers-reduced-motion: no-preference) ; le suivi de la section lue, l'entrée signalée et l'adresse restent.

Sans script (amélioration progressive). Le document pré-rendu se lit seul : les entrées de navigation sont de vrais liens (/#parcours, /contact…), le navigateur ouvre une ancre sous l'en-tête (scroll-padding-top) et laisse en haut une page dont l'ancre ne nomme rien. Ce qui demande le script ne se fait pas : un lien vers une section ajoute une étape à l'historique, comme tout lien d'ancre ordinaire ; l'adresse ne suit pas la lecture ; l'entrée signalée de la page principale reste celle du document pré-rendu, l'accueil ; une ancre qui ne nomme rien reste dans l'adresse ; aucune page ne s'enchaîne par un fondu. C'est une limite, pas un choix : ces règles ne peuvent pas tenir sans script, et le contenu comme la navigation restent entiers.

Formulaire (MF-16). Validation dans le navigateur avant tout envoi (champs obligatoires, format de l'adresse) : message près du champ, relié au champ pour les technologies d'assistance, saisie conservée (SC-2.0-24, SC-2.0-25). À la première interaction avec le formulaire, le front demande le jeton de formulaire au back (CT-08), ce qui le réveille s'il dort. À l'envoi, trois états visibles : envoi en cours (bouton désactivé, message qui prévient qu'un premier envoi peut prendre jusqu'à 90 secondes (D-07)), succès (confirmation, champs vidés, SC-2.0-23), échec (message réessayable, saisie conservée, SC-2.0-26). Le front attend au plus 90 secondes (proposition, à valider), au-delà du réveil d'environ une minute annoncé par l'hébergeur (CT-06), puis passe en échec ; une coupure réseau mène au même état. Si le jeton n'est pas encore arrivé quand le visiteur envoie, le front reste en « envoi en cours », attend le jeton puis le délai minimal de CT-08, et seulement ensuite envoie le message ; tout cela tient dans les mêmes 90 secondes, comptées depuis le clic, au-delà desquelles il affiche l'erreur réessayable (SC-2.0-26). Aucun envoi ne part donc sans jeton, où le filtre le refuserait. L'information sur les données est placée avant le bouton (MF-20, CT-12). Le champ piège est invisible, hors de la navigation au clavier et hors de l'arbre d'accessibilité. Libellés, textes des messages et mise en page relèvent de T2.2 et T2.3.

Liens externes (MF-17). Ouverts dans un nouvel onglet, sans accès de la page ouverte à la page d'origine : le site reste ouvert dans la fenêtre d'origine (SC-2.0-27).

Rapidité (R-08). Pages pré-rendues ; images optimisées dans des formats modernes, avec leurs dimensions déclarées pour éviter tout décalage, chargées à la demande sous la ligne de flottaison et en priorité pour l'image principale (directive d'images d'Angular) ; polices servies par le site lui-même, limitées aux caractères utiles ; aucun script tiers. Les seuils sont ceux de CT-10.

Navigateurs (R-10). Angular définit ses navigateurs pris en charge par la Baseline « largement disponible » à une date proche de sa sortie (07/05/2026 pour la v22) : Chrome, Edge, Firefox et Safari, soit environ 95 % des utilisateurs. Le site n'utilise que des fonctions de cette base, à une exception admise : les transitions de vue du navigateur, qui portent le fondu de changement de page (MV-07). C'est une amélioration facultative, avec son repli : un navigateur qui ne les connaît pas navigue sans fondu (paragraphe « Transitions entre pages et mouvement de la page principale »). Contrôles : tests de bout en bout sur les moteurs Chromium, Firefox et WebKit, en version ordinateur et en émulation de téléphone ; passe manuelle sur un iPhone et un téléphone Android réels. Les tailles d'écran à couvrir sont fixées par la charte et les maquettes (T2.3), et les tests de bout en bout les reprennent.

« Qui en jette mais qui soit pro » (R-02). L'effet visuel relève de T2.3. Contraintes techniques que la conception lui impose : respect du réglage « réduire les animations » du système ; aucun décalage de mise en page dû à une animation ; aucun contenu, pas même l'accès au contact, caché derrière une animation ou une interaction (MF-02) ; toute bibliothèque d'animation passe dans le budget de performance (CT-10).

Rien qui se périme (MF-18). Aucune valeur affichée n'est calculée à partir de la date du jour : ni âge, ni durée, ni année courante en pied de page. Les seules dates affichées viennent du contenu (C-01).

Langue (CT-04). Libellés marqués pour la traduction, langue déclarée sur chaque page, formats de date selon la langue.

## 4. Back

Rôle. Le back a une seule responsabilité métier : recevoir un message de contact, le valider, le filtrer et le transmettre à Alexandre. Il délivre aussi le jeton de formulaire (CT-08) et un indicateur de santé (CT-14). Il ne sert aucun contenu, ne gère aucun compte et ne stocke rien.

Pile. Spring Boot 4 dans sa dernière mineure (CT-02), Java 25, Spring MVC, validation des données d'entrée, client HTTP intégré à Spring pour appeler le prestataire d'envoi, Actuator réduit à l'indicateur de santé. Image Docker construite en plusieurs étapes, sur une JRE 25, exécutée par un utilisateur sans droits d'administration. L'application est extraite dans l'image et démarre avec le cache AOT de la JVM, que Spring Boot prend en charge à partir de Java 25 pour réduire le temps de démarrage et la mémoire ; le gain réel se mesure au scaffold.

Pourquoi cette pile (R-11). Le besoin et la décision du 13/10/2026 se partagent la justification. Côté front, Angular répond au besoin : sa sortie statique produit les pages pré-rendues de CT-01, et son internationalisation intégrée prépare l'anglais sans dépendance tierce (CT-04). Côté back, Spring Boot et Java ne servent qu'au flux de contact, un besoin qu'une pile plus légère couvrirait aussi : c'est un choix assumé d'Alexandre, décidé le 13/10/2026 pour pratiquer cette pile, même si elle dépasse le strict nécessaire pour un seul flux, et la conception le présente comme tel plutôt que comme une nécessité. Ce choix a un coût : une JVM, plus gourmande en mémoire qu'un petit service, et un démarrage à froid lent sur l'instance gratuite, qui s'endort et ne dispose que de 0,1 CPU (CT-06). Les parades sont celles de CT-06 : réveil anticipé par la demande de jeton, attente explicite côté front (« Mise en veille » ci-dessous), cache AOT de la JVM, aucune dépendance superflue et, en dernier recours, l'instance payante sans veille (D-04). Le socle est réduit à ce que ce flux exige ; les écarts sont listés en fin de section.

Organisation interne, à la mesure du besoin. Une entrée HTTP ; un service de contact qui porte la validation métier et la chaîne de filtres anti-spam ; une interface « expéditeur de messages » ; un adaptateur par prestataire d'envoi, plus un adaptateur de développement qui n'envoie rien. Configuration par variables d'environnement : clé du prestataire, adresse de destination, adresse d'expédition, origine autorisée du front, secret de signature des jetons, seuils anti-spam. Le secret de signature est stable : un jeton délivré avant une mise en veille reste valable après le réveil.

Flux de contact, en termes fonctionnels :

1. Le visiteur commence à remplir le formulaire. Le front demande un jeton de formulaire au back ; si le back dort, cette demande le réveille pendant que le visiteur écrit.
2. Le visiteur envoie. Le front valide les champs ; en cas d'erreur, rien ne part (SC-2.0-24, SC-2.0-25). Si le jeton n'est pas encore arrivé, le front garde « envoi en cours », attend le jeton puis le délai minimal, dans la limite de 90 secondes depuis le clic, et seulement ensuite envoie ; au-delà, il affiche l'erreur réessayable (SC-2.0-26).
3. Le back valide à nouveau, sans jamais faire confiance au navigateur : champs obligatoires, format de l'adresse, longueurs maximales, absence de retour à la ligne dans le nom, le prénom et le sujet. Un message invalide est refusé avec l'indication des champs en cause.
4. Le back applique la chaîne de filtres (CT-08) : champ piège, jeton (signature, délai minimal, âge maximal), limite par adresse IP, plafond quotidien. L'adresse IP est celle que transmet le proxy de l'hébergeur ; l'en-tête exact se vérifie au scaffold, et aucun en-tête que le visiteur peut forger n'est cru.
5. Le back appelle le prestataire avec un délai maximal borné, 10 secondes (proposition, à valider). Succès : le back répond par un succès. Échec ou délai dépassé : le back répond par un échec réessayable ; rien n'est stocké ni réessayé en arrière-plan.
6. Le front affiche la confirmation et vide les champs (SC-2.0-23), ou affiche l'erreur et garde la saisie (SC-2.0-26).

Les routes, les formats des échanges et les codes d'erreur de ces étapes relèvent du contrat d'API (Étape 6).

Mise en veille : ce que vit le visiteur. L'instance gratuite s'endort après 15 minutes sans trafic et met environ une minute à se réveiller (CT-06).

- Cas courant : remplir cinq champs dont un message prend au visiteur plus de temps que le réveil du back, réveillé dès la première saisie (hypothèse à mesurer en recette). Le back est prêt quand le visiteur envoie : il vit SC-2.0-23 sans attente notable.
- Cas défavorable : le visiteur envoie avant l'arrivée du jeton (champs remplis automatiquement par le navigateur, message court) ou le réveil est plus lent. Le bouton passe en « envoi en cours » avec un message qui annonce l'attente possible. Le front n'envoie pas encore : il attend le jeton, puis le délai minimal compté depuis sa délivrance (CT-08), et seulement ensuite envoie le message ; l'ensemble, envoi compris, tient dans 90 secondes comptées depuis le clic. Si le jeton arrive et que le back accepte le message dans ce délai, le visiteur voit la confirmation (SC-2.0-23) ; sinon, il voit l'erreur réessayable, sa saisie conservée (SC-2.0-26). Aucun message n'est perdu en silence, et aucun n'est envoyé sans jeton pour être refusé par le filtre.
- Leviers : cache AOT de la JVM, aucune dépendance superflue, délai de réveil réel mesuré au scaffold puis en recette. Si le délai entre le réveil et la réponse dépasse 60 secondes (proposition, à valider), l'instance payante sans veille revient à la décision d'Alexandre (D-04).

Écarts au socle réduit décidé le 13/10/2026 :

| Élément | Position | Justification |
| --- | --- | --- |
| Persistance (JPA, PostgreSQL, Flyway) | absente, conforme au socle | aucun message n'est stocké (CT-12) |
| Authentification (Keycloak) | absente, conforme au socle | aucun compte ; les entrées publiques sont protégées par la validation, les filtres et l'origine autorisée (CT-08, section 7) |
| Testcontainers | absent, conforme au socle | rien à conteneuriser en test ; le prestataire est simulé (CT-10) |
| Validation des données d'entrée | ajout | double validation de MF-16 : le back ne fait pas confiance au navigateur |
| Client HTTP vers le prestataire, à la place du module d'envoi SMTP | ajout, inclus dans Spring | ports SMTP bloqués sur l'instance gratuite (CT-07) ; aucun kit propre au prestataire, pour en changer facilement |
| Actuator, réduit à l'indicateur de santé | ajout | surveillance (CT-14) et contrôle de santé de l'hébergeur ; aucun autre point exposé |
| Limitation des envois en mémoire | ajout | CT-08 ; une seule instance, donc aucun stockage partagé ; les compteurs par adresse IP et par jour sont remis à zéro à chaque mise en veille et à chaque redémarrage : le plafond quotidien est un plafond par période d'éveil, et le vrai filet est le quota du prestataire d'envoi, dont l'épuisement ferait échouer visiblement des envois légitimes, risque assumé (CT-08) ; implémentation à trancher au plan d'implémentation |
| Signature des jetons de formulaire | ajout, avec la bibliothèque standard du JDK | CT-08 ; aucune dépendance |
| Image Docker et cache AOT | ajout | portabilité décidée le 15/10/2026 ; démarrage plus rapide face à la mise en veille (CT-06) |
| Bibliothèque ALTCHA | ajout conditionnel | seulement si D-06 l'active (CT-08) |

## 5. Modèle de données et de contenu

Principes. Le contenu vit dans des fichiers versionnés (CT-03), rangés par langue (CT-04), décrits par un modèle typé et vérifiés à chaque PR (CT-10). Aucune donnée n'est persistée par le site (CT-12). Les textes sont du texte brut : jamais de HTML dans le contenu.

Profil (une seule occurrence) :

| Champ | Règle | Source |
| --- | --- | --- |
| Nom | obligatoire | MF-01 |
| Intitulé du profil | obligatoire ; valeur décidée : « Développeur fullstack, orienté architecture logicielle » | MF-01, Q-13 |
| Courte présentation | obligatoire ; paragraphes ; aucune formulation qui se périme | MF-01, MF-18 ; texte à fournir par Alexandre, sans identifiant C dans les US (D-12) |
| Liens externes | GitHub et LinkedIn, adresses HTTPS obligatoires ; aucun lien vers X | MF-17, Q-08 |

Introduction de section (une par section qui en porte une) :

| Champ | Règle | Source |
| --- | --- | --- |
| Section | la section introduite : l'accueil et le parcours au moins (D-12) ; la liste des sections vient du parcours d'écrans (T2.2) | MF-01, MF-07 |
| Texte | obligatoire pour l'accueil et le parcours ; phrases en texte brut ; aucune formulation qui se périme ; texte à fournir par Alexandre, sans identifiant C dans les US (D-12) | MF-01, MF-07, MF-18 |

Étape de parcours :

| Champ | Règle | Source |
| --- | --- | --- |
| Type | reconversion, bac+3 ou master ; affichage toujours dans cet ordre | MF-07 |
| Intitulé | obligatoire | MF-07, C-01 |
| Établissement | obligatoire pour le bac+3 | MF-07, C-01, Q-04 |
| Début et fin | obligatoires, au mois ou à l'année ; la fin ne précède pas le début ; jamais de formulation au présent ni de durée calculée | MF-07, MF-18, C-01, Q-03, Q-04 |
| Orientation | l'étape master porte la mention de l'orientation vers l'architecture logicielle ; rien sur le contenu du master qui n'ait été fourni ; texte à fournir par Alexandre, sans identifiant C dans les US (D-12) | MF-08 |

Expérience en alternance :

| Champ | Règle | Source |
| --- | --- | --- |
| Période | 2025–2028, période datée, jamais au présent | MF-11, C-01, Q-02 |
| Volets | exactement trois : application, backend, appui DevOps sur certaines tâches (un appui, pas un poste) | MF-11 |
| Description de chaque volet | texte à fournir par Alexandre, sans identifiant C dans les US (D-12) | MF-11 |
| Mention de confidentialité | les projets menés en entreprise ne sont pas partageables | MF-11, Q-05 |
| Règle de confidentialité | aucun nom de projet, client, outil interne, dépôt ni collègue ; contrôlée à la relecture de PR, car une liste de termes interdits commitée dans un dépôt public publierait ces termes | MF-11, Q-15 |

Compétence :

| Champ | Règle | Source |
| --- | --- | --- |
| Libellé | obligatoire ; uniquement les compétences de la liste fournie | MF-09, MF-10, C-02 |
| Nature | technique ou humaine | MF-09, MF-10 |
| Catégorie | obligatoire ; uniquement les catégories fournies | MF-09, C-02 |
| Rang | ordre d'affichage dans la catégorie | — |
| Niveau | absent (hypothèse de Q-06) | Q-06 |
| Récit de reconversion | porté par le groupe des compétences humaines, jamais par les techniques ; texte à fournir par Alexandre, sans identifiant C dans les US (D-12) | MF-10 |

Méthode de travail :

| Champ | Règle | Source |
| --- | --- | --- |
| Texte | obligatoire ; paragraphes | MF-21, C-04 |
| Renvoi | identifiant du projet portfolio ; le contrôle vérifie que ce projet existe | MF-21, MF-22 |

Projet :

| Champ | Règle | Source |
| --- | --- | --- |
| Identifiant | obligatoire, unique, en minuscules, chiffres et tirets ; sert à l'adresse de la fiche, dont la forme vient de T2.2 ; ne change jamais une fois publié | MF-04, MF-14 |
| Titre | obligatoire | MF-13 |
| Description | obligatoire ; paragraphes | MF-13 |
| Description courte | obligatoire ; pour la liste et l'aperçu de partage ; peut reprendre le début de la description | MF-12, CT-11 |
| Captures | de zéro à plusieurs ; chaque capture : fichier présent dans le dépôt, texte alternatif obligatoire, dimensions connues ; zéro capture, aucune zone affichée | MF-13, SC-2.0-18 |
| Lien vers le code source | zéro ou un ; adresse HTTPS ; absent, rien n'est affiché | MF-13, SC-2.0-17 |
| Rang | ordre dans la liste ; ajouter un projet ne modifie pas les autres | MF-14 |

Au lancement, un seul projet existe : le portfolio lui-même, dont le contenu est C-05 et le lien mène au code source public (MF-22). Aucun projet d'école ni d'entreprise (MF-12).

Message de contact, transitoire et jamais stocké :

| Élément | Règle | Source |
| --- | --- | --- |
| Nom, prénom, sujet | obligatoires ; texte brut ; espaces de bord retirés ; aucun retour à la ligne ; longueur maximale fixée au contrat d'API | MF-16 |
| Adresse e-mail | obligatoire ; format valide ; sert seulement d'adresse de réponse | MF-16, CT-07 |
| Message | obligatoire ; texte brut ; longueur maximale fixée au contrat d'API | MF-16 |
| Champ piège | doit rester vide ; jamais transmis à Alexandre | CT-08 |
| Jeton de formulaire | délivré par le back, signé et horodaté ; jamais transmis à Alexandre | CT-08 |

Cycle de vie d'un message : saisi, validé par le front puis par le back, filtré, transmis au prestataire, remis à Alexandre, oublié par le back. L'e-mail remis a pour expéditeur une adresse du domaine du site, pour destinataire la boîte d'Alexandre, pour adresse de réponse celle du visiteur, pour objet un préfixe fixe suivi du sujet saisi, et pour corps les cinq champs en texte brut.

Textes fixes du site : mentions légales (nom d'Alexandre, contact par le formulaire, identité des hébergeurs du front et du back, ni adresse ni téléphone personnels ; MF-19, Q-12), information sur les données (MF-20, CT-12), page introuvable (MF-05). Leur texte final est validé par Alexandre.

Contrôles automatiques du contenu (CT-10) : champs obligatoires présents ; identifiants uniques et bien formés ; images présentes avec leur texte alternatif ; liens en HTTPS ; renvoi de la méthode vers un projet existant ; ordre du parcours ; dates complètes et cohérentes ; aucune formulation d'une liste de tournures qui se périment (âge, « actuellement », « depuis », « il y a », « en ce moment », « aujourd'hui », « cette année »). Une relecture humaine reste nécessaire pour MF-18.

Ajouter un projet (R-07). Alexandre fournit : titre, description, description courte, captures éventuelles avec leur texte alternatif, lien éventuel vers le code source, rang. Le projet entre par une PR qui ajoute un fichier et un dossier d'images, et rien d'autre ; la CI vérifie le contenu, le build produit la fiche, son lien direct et son entrée dans la liste et dans le plan du site (SC-2.0-19, SC-2.0-20).

Si une question ouverte reçoit une autre réponse : Q-06, un champ « niveau » optionnel s'ajoute à la compétence, sans autre changement ; Q-10, si la boîte change, seule une variable d'environnement change, et si le moyen de contact change, CT-06 à CT-08 sont à rouvrir ; Q-15, contenu seulement.

## 6. Hébergement et déploiement

| Brique | v2.0.0 | Coût mensuel | Repli géré | Sur un VPS loué |
| --- | --- | --- | --- | --- |
| Front | Cloudflare, ressources statiques des Workers (CT-05) | 0 € | GitHub Pages | un serveur web sert les mêmes fichiers ; page 404, en-têtes et redirections recopiés dans sa configuration |
| Back | Render, instance gratuite, Francfort (CT-06) | 0 € | instance payante sans veille, ou autre hébergeur de conteneurs | la même image Docker, lancée avec les mêmes variables d'environnement |
| Envoi d'e-mails | Brevo, API HTTPS (CT-07) | 0 € | Resend, Mailjet | inchangé, ou SMTP direct |
| Zone DNS | Cloudflare, registraire OVH (CT-13) | 0 € | retour de la zone chez OVH, par le chemin DNSSEC inverse (CT-13) | inchangée ; enregistrements pointés vers le VPS |
| CI | GitHub Actions (CT-09) | 0 € | — | inchangée, plus une étape de déploiement vers le VPS |
| Surveillance | sonde externe et tâche planifiée (CT-14) | 0 € | — | inchangée |
| Domaine | registraire OVH | renouvellement annuel, hors budget mensuel | — | inchangé |

Environnements. Développement local : front servi par le serveur de développement d'Angular, back lancé avec l'adaptateur d'envoi qui n'envoie rien. Préproduction : la préversion du front construite depuis staging, et une instance gratuite du back branchée sur staging, qui ne consomme d'heures que lorsqu'elle est réveillée. Production : branchée sur main à la v2.0.0. Le déploiement de production n'est relié qu'à ce moment : avant, main ne contient pas les dossiers front/ et back/.

Secrets et données sensibles. Clé du prestataire, secret de signature des jetons et adresse de destination vivent dans les variables d'environnement de l'hébergeur du back, et nulle part ailleurs. Le front n'a aucun secret : tout ce qu'il contient est public par nature.

Bascule de la v2.0.0 :

1. En amont, avant la bascule du site : zone DNS déplacée chez Cloudflare (CT-13). Le 15/10/2026, DNSSEC est actif chez OVH (un enregistrement DS est publié) : changer de serveurs de noms sans la procédure suivante rendrait le domaine injoignable pour les résolveurs qui valident DNSSEC. Alexandre l'exécute dans cet ordre :
   1. créer la zone chez Cloudflare, y recopier les enregistrements existants et abaisser leur durée de mise en cache ; aucune messagerie n'est à préserver, aucune adresse e-mail n'étant utilisée sur le domaine (D-09) ;
   2. désactiver DNSSEC chez OVH, ce qui retire le DS ; OVH annonce 24 heures pour que ce soit effectif ;
   3. vérifier par requête publique que le domaine ne publie plus de DS, puis attendre encore au moins un TTL du DS (Cloudflare conseille jusqu'à une fois et demie) ;
   4. changer les serveurs de noms chez OVH pour ceux de Cloudflare, sans en garder d'autres ;
   5. attendre que le TTL des anciens enregistrements de serveurs de noms soit écoulé et que Cloudflare voie la zone active ; vérifier que l'ancien site répond comme avant ;
   6. activer DNSSEC chez Cloudflare, qui fournit un nouveau DS, et publier ce DS chez OVH, dans l'onglet des enregistrements DS, qui n'apparaît que lorsque le domaine utilise des serveurs DNS externes ;
   7. vérifier par requête publique que le nouveau DS est publié et que le domaine se résout.

   Avant la recette : compte du prestataire d'envoi approuvé et domaine d'expédition authentifié (CT-07) ; les enregistrements d'authentification de l'envoi se posent dans la zone Cloudflare, une fois celle-ci active (après la sous-étape 5 de l'étape 1). La zone recopiée contient une politique SPF qui n'autorise qu'OVH : l'authentification de l'envoi la remplace, au lieu d'en ajouter une seconde (un domaine n'a qu'une politique SPF) ; aucune adresse n'étant utilisée sur le domaine (D-09), l'autorisation d'OVH n'a pas à être gardée.

   Retour arrière de la zone, par le chemin inverse : retirer chez OVH le DS de Cloudflare, attendre au moins un TTL du DS, remettre les serveurs de noms d'OVH, dont la zone doit alors contenir les enregistrements voulus (sous-domaine du back, authentification de l'envoi d'e-mails), attendre que le TTL des serveurs de noms de Cloudflare soit écoulé, puis réactiver DNSSEC chez OVH.
2. Recette (Étape 7) sur la préproduction.
3. Fusion de staging dans main, tag v2.0.0.
4. Production déployée depuis main, sur les adresses techniques des hébergeurs et sur le sous-domaine du back : les déploiements de production ne sont reliés à main qu'à ce moment (CT-09, Environnements).
5. Enregistrements du site (www et domaine nu) pointés vers le front ; cette modification se fait dans la zone Cloudflare et ne touche ni aux serveurs de noms ni à DNSSEC.
6. Contrôles de mise en production (section 8).
7. Retour arrière possible en remettant les anciens enregistrements vers l'hébergement OVH, conservé pendant 30 jours (proposition, à valider).
8. Ensuite seulement, résiliation de l'hébergement mutualisé OVH : aucune messagerie n'est à préserver, puisqu'aucune adresse e-mail n'est utilisée sur le domaine (D-09) ; le domaine reste.
9. Archivage de l'ancien back, après révocation des identifiants qu'il utilise (section 10).

Portabilité vers un VPS. Une migration vers un VPS loué est prévue dans un lot séparé, après la v2.0.0 (décision du 15/10/2026) ; ce document n'en conçoit pas l'administration. La conception garantit que ce passage ne sera qu'un changement de déploiement :

- le code n'utilise aucun service propre à un hébergeur : pas de script Worker, pas de fonction sans serveur, pas de kit propre à Render ; le back ne connaît de son hébergeur que le port d'écoute ;
- ce qui est propre à un hébergeur est de la configuration, versionnée quand c'est possible : configuration du front, page 404, fichier d'en-têtes, fichier de redirections, description du service du back ;
- sur le VPS, un serveur web (Nginx ou Caddy, par exemple) sert les fichiers du front avec les mêmes règles et un certificat obtenu automatiquement ; le back tourne dans la même image Docker avec les mêmes variables d'environnement ; les enregistrements DNS pointent vers le VPS ; la CI garde ses tests et gagne une étape de déploiement ;
- le front n'est pas reconstruit pour changer l'hébergement du back, puisqu'il appelle un sous-domaine du domaine d'Alexandre.

## 7. Sécurité

Le site est petit, sa surface aussi : des fichiers statiques et un unique point d'entrée public, le formulaire. Les mesures suivent les menaces réelles.

| Menace | Mesure |
| --- | --- |
| Messages indésirables, épuisement du quota d'envoi, boîte inondée | chaîne de filtres et plafonds (CT-08) |
| Formulaire détourné pour écrire à des tiers | le back n'écrit qu'à la boîte d'Alexandre, jamais à l'adresse saisie (CT-07) |
| Injection dans l'e-mail | champs structurés de l'API du prestataire ; retours à la ligne refusés dans le nom, le prénom et le sujet ; corps en texte brut |
| Injection de script dans les pages | Angular échappe les valeurs affichées ; aucun HTML venant du contenu ou du visiteur n'est inséré ; politique de sécurité du contenu qui n'autorise que les ressources du site et l'adresse du back ; sa compatibilité, en version stricte, avec les scripts et styles en ligne produits par le pré-rendu et l'hydratation d'Angular est à vérifier au scaffold |
| Affichage du site dans un cadre piégé | interdiction d'affichage en cadre par en-tête |
| En-têtes de sécurité | politique de sécurité du contenu, interdiction de deviner les types de fichiers, politique de référent, politique des permissions, HTTPS obligatoire : posés par le fichier d'en-têtes de l'hébergeur du front (CT-05) ; le back pose les siens |
| Appels depuis d'autres sites | le back n'accepte que l'origine du site, et celle de la préproduction en préproduction |
| Fuite de secret | secrets dans les seules variables d'environnement de l'hébergeur du back ; analyse des secrets activée par défaut par GitHub sur les dépôts publics ; protection à l'envoi, disponible pour les dépôts publics, à activer |
| Dépendance vulnérable | alertes du robot de mises à jour, incluses dans toutes les offres GitHub ; installation verrouillée ; entretien annuel (section 9) |
| Interception | HTTPS partout, certificats gérés et renouvelés par les hébergeurs |
| Surface du back | indicateur de santé sans détail, aucun autre point d'administration ; conteneur sans droits d'administration ; image minimale |
| Saturation | le front est servi par un réseau CDN ; une saturation du back gratuit n'atteint que le formulaire, et l'échec reste visible (SC-2.0-26) |
| Données personnelles | aucun stockage, journaux sans donnée personnelle (CT-12) |
| Publication d'informations internes d'entreprise | aucun nom de projet, client, outil interne, dépôt ni collègue ; relecture de chaque PR avec le diff complet, qui montre aussi ce qui est retiré |

## 8. Qualité et tests

Niveaux de test (CT-10) :

- Unitaires du front : composants, validation et états du formulaire, rendu d'une fiche complète, sans lien, sans capture ; règle de la section lue (seuil de 40 %, bout de la page) et règle de défilement de la section 3.
- Contrôle du contenu : les règles de la section 5, exécutées à chaque PR.
- Back : validation, chaque filtre anti-spam, jeton, envoi simulé (succès, échec, délai dépassé), journaux sans donnée personnelle, origine autorisée.
- Bout en bout : sur le build pré-rendu servi avec les mêmes règles que l'hébergeur (page 404 et statut 404, redirections des anciennes adresses), back simulé, trois moteurs de navigateur, profil ordinateur et profil téléphone.
- Accessibilité et performance automatisées : seuils de CT-10.
- Contrôles de mise en production : ceux de CT-14, exécutés après chaque déploiement de préproduction et de production.
- Passe manuelle avant la recette : appareils réels, navigation au clavier, envoi réel, aperçu de partage, relecture des textes.

| Scénarios | Contrôle automatique | Contrôle manuel avant recette |
| --- | --- | --- |
| SC-2.0-01 à SC-2.0-04 : accueil, contact, navigation | bout en bout sur la page principale et sur chaque page à part : contact à un clic ; une entrée de section fait défiler la page principale jusqu'à sa section, sous l'en-tête, ou y mène depuis une page à part ; l'entrée signalée et l'adresse suivent la lecture, sans étape d'historique (le retour arrière quitte la page principale au lieu de remonter ses sections) ; un fondu entre deux pages, aucun d'une section à l'autre | lecture |
| SC-2.0-05 à SC-2.0-08 : liens directs, rechargement, adresse inconnue | bout en bout : ouverture directe puis rechargement d'une section (/#competences), d'une fiche, du contact et des mentions légales, la section s'ouvrant sous l'en-tête, avant comme après le démarrage de l'application ; ancre d'un élément intérieur ; ancre de section visée depuis une autre page ; ancre qui ne nomme rien, à l'ouverture et depuis une autre page (page en haut, adresse sans ancre, V-11) ; statut 404 et page introuvable, variante projet inexistant comprise, et /projets seule (variante affichée égale à celle du document servi) | vérification sur la préproduction |
| SC-2.0-09 : téléphone | bout en bout en émulation de téléphone, sans défilement horizontal aux tailles fixées par T2.3 | un iPhone et un téléphone Android réels |
| SC-2.0-10 à SC-2.0-15, SC-2.0-31, SC-2.0-32 : parcours, compétences, alternance, projets, méthode, portfolio | contrôle du contenu et bout en bout | relecture des textes par Alexandre |
| SC-2.0-16 à SC-2.0-18 : fiches projet | unitaires avec trois projets de test | — |
| SC-2.0-19, SC-2.0-20 : ajout d'un projet | build avec un projet de test ajouté : présent dans la liste, fiche et lien direct, autres pages inchangées | diff de la PR limité au projet ajouté |
| SC-2.0-23 à SC-2.0-26 : formulaire | unitaires du front et du back ; bout en bout avec back simulé : succès, jeton reçu en retard puis confirmation (SC-2.0-23), champ manquant, adresse invalide, échec, attente longue | envoi réel en préproduction, réception, réponse au visiteur ; envoi après mise en veille, délai mesuré |
| SC-2.0-27 : liens externes | bout en bout : cibles, ouverture dans un nouvel onglet, aucun lien vers X | clic réel |
| SC-2.0-28 : rien qui se périme | contrôle du contenu ; aucune valeur calculée depuis la date du jour | relecture complète |
| SC-2.0-29, SC-2.0-30 : mentions légales, information sur les données | bout en bout : lien sur chaque page, information placée avant le bouton | relecture des textes |

Test de la protection contre les messages indésirables (R-13) :

- Back : un test par filtre. Champ piège rempli : réponse de succès, aucun envoi. Jeton absent, falsifié, trop récent ou expiré : refus réessayable, aucun envoi. Sixième envoi dans l'heure depuis la même adresse IP : refus. Plafond quotidien atteint : refus. Message valide : un seul envoi.
- Front : champ piège invisible, hors de la navigation au clavier et de l'arbre d'accessibilité ; jeton demandé à la première interaction et renouvelé s'il a expiré.
- Bout en bout : parcours humain complet avec back simulé.
- Manuel, en préproduction : envois scriptés sans passer par le formulaire (sans jeton, champ piège rempli, rafale) ; aucun e-mail ne doit arriver, et un envoi humain doit arriver.
- En production : relevé des messages indésirables reçus pendant les premières semaines, comparé au seuil de renfort de CT-08.

Prêt pour la recette : CI verte sur staging, passe manuelle faite, délai de réveil du back mesuré et noté.

## 9. Durabilité sur deux ans

Ce qui, en dehors du contenu, peut obliger à retoucher le site pendant deux ans, et comment la conception le limite (R-03) :

| Cause | Ce qui arrive | Parade |
| --- | --- | --- |
| Fin de support des briques | une mineure de Spring Boot vit environ 13 mois ; un majeur d'Angular 24 mois, et Angular 22, retenu le 15/10/2026 (D-01), quitte sa LTS en 06/2028 ; Java 25 jusqu'en 2031 au moins ; Node ne sert qu'au build | versions de CT-02 ; robot de mises à jour du dépôt (Dependabot : mises à jour de versions pour npm, Maven, Docker et GitHub Actions ; mises à jour de sécurité pour npm, Maven et GitHub Actions) ; CI qui valide chaque mise à jour ; entretien annuel |
| Offres gratuites qui changent | exemples : offre gratuite de SendGrid retirée à partir du 27/05/2025 ; plus d'offre gratuite pour les nouvelles organisations chez Fly.io, après l'arrêt de ses anciennes offres en 10/2024 | portabilité (section 6) ; replis nommés (CT-05 à CT-07) ; surveillance (CT-14) |
| Quotas | 750 heures par mois pour les instances gratuites du back ; 300 envois par jour chez le prestataire | aucun maintien artificiel en éveil (CT-06) ; plafond de 50 envois (CT-08), dont les compteurs en mémoire sont remis à zéro à chaque mise en veille et à chaque redémarrage : c'est un plafond par période d'éveil, et le vrai filet est le quota du prestataire, dont l'épuisement ferait échouer visiblement des envois légitimes jusqu'à son renouvellement, risque assumé (CT-08) ; fichiers statiques sans quota de requêtes (CT-05) |
| Liens externes qui meurent | profils, liens vers le code source | contrôle des liens externes à l'entretien annuel ; certains réseaux refusent les robots, d'où une vérification manuelle |
| Contenu qui se périme | âge, durées, présent pour des situations qui ont une fin | règles et contrôles de la section 5 ; aucune valeur calculée depuis la date du jour (section 3) |
| Évolution des navigateurs | fonctions retirées ou modifiées | fonctions de la Baseline seulement ; tests sur trois moteurs |
| Certificats | expiration | renouvellement automatique par les hébergeurs |
| Domaine | expiration | renouvellement automatique chez OVH, recommandé (hors code) |
| Clé du prestataire | compromission ou rotation imposée | une variable d'environnement à changer ; procédure décrite dans le README du back |
| Tâches planifiées de la CI | désactivées après 60 jours sans activité du dépôt | activité du robot de mises à jour et entretien annuel ; sonde externe indépendante (CT-14) |
| Outillage de CI | actions dépréciées | actions versionnées et mises à jour par le robot |

Entretien annuel, une PR par an : montée de mineure du back et, selon le calendrier, de majeur d'Angular, au plus tard avant la fin de la LTS d'Angular 22 en 06/2028 ; relecture du contenu au regard de MF-18 ; contrôle des liens externes ; relecture des conditions des offres gratuites utilisées.

Ce qui ne demande pas de retoucher le site : ajouter un projet (contenu seulement, CT-03) ; changer d'hébergeur (déploiement seulement, section 6) ; changer de prestataire d'envoi (un adaptateur, CT-07) ; ajouter l'anglais (préparé par CT-04).

## 10. Impact sur l'existant

Branches et versions. main reste l'ancien site jusqu'à la v2.0.0, staging intègre la refonte (décision du 13/10/2026). La v2.0.0 est un changement majeur : nouvelle architecture, nouveau back, nouvelles adresses. Aucune donnée à migrer : il n'y a de base ni avant ni après.

Ancien site (dossier my-portfolio/, React, tag v1.0.0). Il ne sert que de matière première (textes, liens) ; aucun code n'est repris (décision du 13/10/2026). Il reste consultable au tag v1.0.0 ; son retrait de staging est un ticket à part, TK-08 (décision du 13/10/2026). Ses captures de projets étaient chargées depuis un service tiers d'hébergement d'images ; aucune n'est reprise, puisque aucun projet d'école n'est présenté (MF-12), et les images de la v2.0.0 vivent dans le dépôt (CT-03). Son document de candidature, daté et qui mentionnait la recherche d'alternance, n'est pas repris : la v2.0.0 n'en propose plus (Q-07, tranchée le 10/11/2026).

Ancien formulaire et ancien back. L'ancien formulaire écrit à un petit serveur Node, dans un dépôt séparé, sur un hébergement gratuit non identifié à ce jour. Le nouveau formulaire n'en dépend pas et l'ancien contrat d'échange n'est pas conservé (nouveau contrat à l'Étape 6). Après la v2.0.0 : identifier son hébergement, révoquer les identifiants d'envoi qu'il utilise, puis archiver le dépôt.

Constats sur la production, le 15/10/2026, par requêtes HTTP publiques :

- toute adresse, y compris une adresse inexistante, renvoie la page de l'application avec un statut de succès : une adresse inconnue n'est jamais signalée comme telle aux moteurs ;
- l'adresse du fichier robots et celle du plan du site renvoient elles aussi cette page HTML ;
- le fichier robots du dépôt est mal nommé (robot.txt) et annonce un plan du site qui n'est pas servi comme tel.

Ces constats ne disent pas si les liens directs étaient cassés à une autre date ; la v2.0.0 rend leur comportement vérifiable par test (CT-01, CT-05, CT-10, CT-11).

Hébergement et domaine. Le domaine est servi par un hébergement mutualisé OVH (serveur Apache), qui ne fait pas tourner Java. Il sert l'ancien site jusqu'à la bascule, puis peut être résilié (décision du 15/10/2026). Le 15/10/2026, par requêtes DNS publiques : serveurs de noms d'OVH ; enregistrements de messagerie vers les serveurs de messagerie d'OVH ; politique SPF qui n'autorise que les serveurs d'OVH ; un enregistrement DS publié pour le domaine, donc DNSSEC actif chez OVH. Conséquences : recopier les enregistrements existants avant tout déplacement de la zone, et déplacer la zone selon la procédure DNSSEC de CT-13 (retirer le DS chez OVH, attendre au moins un TTL du DS, changer les serveurs de noms, réactiver DNSSEC chez Cloudflare et publier le nouveau DS chez OVH ; retour arrière par le chemin inverse), faute de quoi le domaine deviendrait injoignable pour les résolveurs qui valident DNSSEC ; ajouter l'authentification du prestataire d'envoi selon sa procédure (CT-07) ; aucune messagerie n'est à préserver, puisqu'aucune adresse e-mail n'est utilisée sur le domaine (D-09) : l'hébergement peut être résilié après la période de retour arrière (section 6, D-15).

Anciennes adresses. L'ancien site expose l'accueil, une page « à propos », une salle d'arcade et des pages de compétence par projet. Après la bascule, cibles décidées par Alexandre le 12/11/2026 (D-13, A-14) : /about redirige vers /#parcours, /arcade vers /#projets, /competence/ suivie d'un identifiant vers /#projets ; l'accueil reste l'accueil (/) ; toute autre ancienne adresse mène à la page introuvable, en 404, comme toute adresse inconnue (section 3). Les redirections sont permanentes (301) et visent une adresse avec ancre : le navigateur ouvre alors la page principale sur la section, sous l'en-tête, comme pour un lien direct (section 3, « Ancres »). Le fichier de redirections de l'hébergeur les porte (CT-05) : une ligne par adresse, une étoile pour /competence/ suivie d'un identifiant ; la documentation de Cloudflare admet une ancre dans la cible, les codes 301 à 308 et une étoile par source (section 13). Sur un VPS, le serveur web reprend les trois mêmes règles (section 6).

Dépôt. Nouveaux dossiers front/ et back/, nouveaux fichiers de CI ; les modèles de PR et de tickets existants ne changent pas. Aucun secret n'entre dans le dépôt.

## 11. Couverture des exigences reportées

| R-xx | Exigence reportée (début de la ligne des US) | Traitée dans |
| --- | --- | --- |
| R-01 | Pitch « Pour la DA, j'aime beaucoup une page de référence que je fournirai pour les maquettes. » | Charte et maquettes (T2.3) |
| R-02 | Pitch « que ça soit un site vitrine qui en jette mais qui soit pro » | Charte et maquettes (T2.3) ; contraintes techniques en section 3 et CT-10 |
| R-03 | Pitch « Je veux que ce site puisse durer au moins 2 ans sans que j'ai à le retoucher » | Section 9 ; CT-02, CT-05, CT-06, CT-07, CT-14 |
| R-04 | Contexte « liens directs cassés » | CT-01, CT-05 ; section 3 |
| R-05 | Contexte « aucun référencement » | CT-11 |
| R-06 | Contexte « aucun test » | CT-10, CT-09 ; section 8 |
| R-07 | Contexte « ajouter un projet reste possible sans retoucher le reste du site » | CT-03 ; section 5 |
| R-08 | Contexte « qui jugent un profil en quelques minutes » | Hiérarchie de lecture : Parcours d'écrans (T2.2) et Charte et maquettes (T2.3) ; rapidité d'affichage et seuils : CT-01, CT-10 |
| R-09 | Existant v1 (v1.0.0:my-portfolio/src/Components/Infos/Infos.jsx) | CT-07, CT-08, CT-12 |
| R-10 | Existant v1 (v1.0.0:my-portfolio/src/Components/Navigation/Navigation.jsx) | Navigateurs à couvrir : fixés ici, CT-10 et section 3 ; largeurs d'écran : Charte et maquettes (T2.3) |
| R-11 | Décision d'Alexandre du 13/10/2026 : la pile technique est choisie | Section 4 (pile justifiée par le besoin, sortie statique d'Angular pour CT-01 et CT-04, et par la décision du 13/10/2026, Spring Boot et Java pour le seul flux de contact ; coût et parades ; écarts au socle) ; CT-02, CT-06 |
| R-12 | Décision d'Alexandre du 15/10/2026 (Q-09) | CT-04 |
| R-13 | Décision d'Alexandre du 15/10/2026 (Q-11) | CT-08 ; section 8 |

## 12. Décisions à prendre par Alexandre

- D-01 — Versions : Angular 22 au lieu d'Angular 21, Spring Boot dans sa dernière mineure 4.x au scaffold, Java 25, Node LTS la plus récente acceptée par Angular. Recommandation : accepter ; Angular 21 quitte la LTS en 06/2027, Angular 22 la garde jusqu'en 06/2028 (CT-02). Réponse d'Alexandre du 15/10/2026 : recommandation acceptée, Angular 22 retenu.
- D-02 — Hébergeur du front : Cloudflare (ressources statiques des Workers) ou GitHub Pages. Recommandation : Cloudflare, ressources statiques des Workers. Motif : parmi les options étudiées, les deux offres de Cloudflare sont les seules à réunir vraie 404, en-têtes de sécurité, redirections et préversions sans quota de trafic, crédits ni restriction d'usage sur les fichiers statiques, et Cloudflare oriente les nouveaux projets vers Workers plutôt que vers Pages ; GitHub Pages reste le repli (CT-05). Réponse d'Alexandre du 15/10/2026 : recommandation acceptée.
- D-03 — Zone DNS déplacée chez Cloudflare, registraire OVH inchangé. DNSSEC est actif chez OVH (constat du 15/10/2026, par requête publique sur l'enregistrement DS) : le déplacement suit la procédure de CT-13 — désactiver DNSSEC chez OVH pour retirer le DS, attendre au moins un TTL du DS, changer les serveurs de noms, puis activer DNSSEC chez Cloudflare et publier le nouveau DS chez OVH ; le retour arrière suit le chemin inverse ; aucune messagerie n'est à préserver (D-09). Recommandation : oui, avant la bascule du site, en suivant cette procédure, sans laquelle le domaine deviendrait injoignable pour les résolveurs qui valident DNSSEC (CT-13, section 6). Réponse d'Alexandre du 15/10/2026 : recommandation acceptée.
- D-04 — Back sur l'instance gratuite de Render avec mise en veille acceptée, ou instance payante sans veille à 7 $ par mois, hors du budget du 15/10/2026. Recommandation : instance gratuite ; réexamen si le délai mesuré entre le réveil et la réponse dépasse 60 secondes (CT-06). Réponse d'Alexandre du 15/10/2026 : recommandation acceptée.
- D-05 — Prestataire d'envoi et boîte de réception. Recommandation : Brevo ; Alexandre désigne la boîte qui reçoit les messages, dont l'adresse reste hors du dépôt (CT-07, Q-10). Réponse d'Alexandre du 15/10/2026 : recommandation acceptée.
- D-06 — Protection : couches natives seules en v2.0.0 avec ALTCHA en renfort sur seuil, ou ALTCHA dès la v2.0.0. Recommandation : couches natives d'abord (CT-08). Réponse d'Alexandre du 15/10/2026 : recommandation acceptée.
- D-07 — Valeurs de départ : 3 secondes de délai minimal, jeton valable 2 heures, 5 envois par heure et par adresse IP, 50 envois par jour, attente du front de 90 secondes, délai du prestataire de 10 secondes. Recommandation : accepter, toutes réglables par variable d'environnement sauf l'attente du front (CT-08, section 4). Réponse d'Alexandre du 15/10/2026 : recommandation acceptée.
- D-08 — Nom d'hôte canonique : www, comme aujourd'hui, ou domaine nu. Recommandation : www, pour garder les liens déjà diffusés ; le domaine nu redirige (CT-11, CT-13). Réponse d'Alexandre du 15/10/2026 : recommandation acceptée.
- D-09 — Messagerie du domaine : des boîtes OVH sont-elles utilisées, et dépendent-elles de l'hébergement mutualisé ? Recommandation : le vérifier avant toute résiliation ; si elles sont utilisées, conserver une offre de messagerie (section 10). Réponse d'Alexandre du 15/10/2026 : aucune adresse e-mail n'est utilisée sur le domaine ; aucune messagerie n'est à préserver, et l'hébergement mutualisé OVH pourra être résilié après la période de retour arrière (D-15).
- D-10 — Durée de conservation des messages dans la boîte et texte de l'information affichée avant l'envoi. Recommandation : au plus trois ans après le dernier échange, et suppression des messages restés sans suite ; texte à valider sur la base de CT-12, qui propose aussi la base légale (l'intérêt légitime de répondre aux personnes qui écrivent, proposition, à valider) et la liste des transferts éventuels hors de l'Union européenne (hébergeurs du front et du back, prestataire d'envoi). Réponse d'Alexandre du 15/10/2026 : recommandation acceptée.
- D-11 — Seuils de rapidité. Recommandation : score de performance Lighthouse mobile d'au moins 90 et seuils « bons » des Core Web Vitals mesurés en laboratoire (CT-10). Réponse d'Alexandre du 15/10/2026 : recommandation acceptée.
- D-12 — Contenus attendus sans identifiant dans les US : la courte présentation de l'accueil (MF-01), le récit de reconversion (MF-10), la description des trois volets du rôle en alternance (MF-11), le texte d'orientation vers l'architecture logicielle (MF-08) et les phrases d'introduction des sections (accueil, parcours). Recommandation : les ajouter à la liste des contenus à fournir des US, par une mise à jour séparée, avant le contrat d'API ; ce document les nomme sans leur donner d'identifiant. Réponse d'Alexandre du 15/10/2026 : recommandation acceptée.
- D-13 — Anciennes adresses : redirection vers les pages de la v2.0.0 ou page introuvable. Recommandation : rediriger les quatre adresses principales de l'ancien site, cibles à fixer avec le parcours d'écrans (section 10). Réponse d'Alexandre du 15/10/2026 : recommandation acceptée. Révision du 10/11/2026 : le parcours d'écrans ne les a pas fixées ; décision d'Alexandre du 12/11/2026 (A-14) : /about vers /#parcours, /arcade vers /#projets, /competence/ suivie d'un identifiant vers /#projets, l'accueil reste l'accueil, toute autre ancienne adresse donne la page introuvable ; redirections permanentes vers une adresse avec ancre (section 10).
- D-14 — Surveillance : ouverture d'un compte de sonde gratuit (UptimeRobot) au nom d'Alexandre. Recommandation : oui (CT-14). Réponse d'Alexandre du 15/10/2026 : recommandation acceptée.
- D-15 — Retour arrière : durée de conservation de l'hébergement OVH après la bascule. Recommandation : 30 jours (section 6). Réponse d'Alexandre du 15/10/2026 : recommandation acceptée.

## 13. Sources

Constats sans adresse web, faits le 15/10/2026 par requêtes publiques : serveurs de noms, enregistrements de messagerie, politique SPF et présence d'un enregistrement DS, donc DNSSEC actif (requêtes DNS) ; statut et contenu des réponses de la production pour l'accueil, une page interne, une adresse inexistante, le fichier robots et le plan du site (requêtes HTTP). Le code de l'ancien site a été lu au tag v1.0.0 (formulaire, routage, données des projets, fichier robots). Constat fait le 16/10/2026 par requêtes publiques : les adresses des services Render se résolvent vers le réseau de Cloudflare et répondent avec l'en-tête « server: cloudflare » (requêtes DNS et HTTP). Constat fait le 12/11/2026 par lecture du code d'Angular 22.2.5, la version du lockfile du front (révision du 10/11/2026) : le défilement du routeur (RouterScroller) ne fait rien tant que l'hydratation n'est pas finie ; vers une ancre, le ViewportScroller fait défiler par coordonnées (window.scrollTo), sans tenir compte de scroll-padding-top ; le routeur ne suit l'historique que par l'événement popstate.

- Angular, Releases (calendrier, versions supportées, politique de support) — https://angular.dev/reference/releases — consulté le 15/10/2026
- Angular, Version compatibility (Node.js, navigateurs, Baseline) — https://angular.dev/reference/versions — consulté le 15/10/2026
- Angular, Server and hybrid rendering (sortie statique, paramètres de pré-rendu) — https://angular.dev/guide/ssr — consulté le 15/10/2026
- Angular, Merge translations into the app — https://angular.dev/guide/i18n/merge — consulté le 15/10/2026
- Angular, Deploy multiple locales — https://angular.dev/guide/i18n/deploy — consulté le 15/10/2026
- Angular, Testing (Vitest par défaut) — https://angular.dev/guide/testing — consulté le 15/10/2026
- endoflife.date, Spring Boot — https://endoflife.date/spring-boot — consulté le 15/10/2026
- Spring Boot wiki, Supported Versions — https://github.com/spring-projects/spring-boot/wiki/Supported-Versions — consulté le 15/10/2026
- Spring Boot, System Requirements — https://docs.spring.io/spring-boot/system-requirements.html — consulté le 15/10/2026
- Spring Boot, AOT Cache — https://docs.spring.io/spring-boot/reference/packaging/aot-cache.html — consulté le 15/10/2026
- Eclipse Adoptium, Temurin support — https://adoptium.net/support/ — consulté le 15/10/2026
- endoflife.date, Node.js — https://endoflife.date/nodejs — consulté le 15/10/2026
- Cloudflare, Pages (recommandation de Workers) — https://developers.cloudflare.com/pages/ — consulté le 15/10/2026
- Cloudflare, Pages limits — https://developers.cloudflare.com/pages/platform/limits/ — consulté le 15/10/2026
- Cloudflare, Pages Functions pricing (fichiers statiques gratuits et illimités) — https://developers.cloudflare.com/pages/functions/pricing/ — consulté le 15/10/2026
- Cloudflare, Pages custom domains — https://developers.cloudflare.com/pages/configuration/custom-domains/ — consulté le 15/10/2026
- Cloudflare, Serving Pages — https://developers.cloudflare.com/pages/configuration/serving-pages/ — consulté le 15/10/2026
- Cloudflare, Workers static assets billing and limitations — https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/ — consulté le 15/10/2026
- Cloudflare, Workers static assets, static site generation — https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/ — consulté le 15/10/2026
- Cloudflare, Workers static assets headers — https://developers.cloudflare.com/workers/static-assets/headers/ — consulté le 15/10/2026
- Cloudflare, Workers static assets redirects (cible avec ancre, codes 301 à 308, une étoile par source, 2 000 redirections statiques et 100 dynamiques) — https://developers.cloudflare.com/workers/static-assets/redirects/ — consulté le 12/11/2026
- Cloudflare, Migrate from Pages to Workers — https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/ — consulté le 15/10/2026
- Cloudflare, Workers limits — https://developers.cloudflare.com/workers/platform/limits/ — consulté le 15/10/2026
- Cloudflare, Workers custom domains — https://developers.cloudflare.com/workers/configuration/routing/custom-domains/ — consulté le 15/10/2026
- Cloudflare, Workers Builds — https://developers.cloudflare.com/workers/ci-cd/builds/ — consulté le 15/10/2026
- Cloudflare, Workers Builds limits and pricing — https://developers.cloudflare.com/workers/ci-cd/builds/limits-and-pricing/ — consulté le 15/10/2026
- Cloudflare, DNS full setup — https://developers.cloudflare.com/dns/zone-setups/full-setup/ — consulté le 15/10/2026
- Cloudflare, Troubleshooting du full setup (retirer le DS chez le registraire avant de changer de serveurs de noms, puis réactiver DNSSEC ; ne garder que les serveurs de noms de Cloudflare) — https://developers.cloudflare.com/dns/zone-setups/full-setup/troubleshooting/ — consulté le 15/10/2026
- Cloudflare, DNSSEC (activation, nouveau DS à publier chez le registraire, migration avec DNSSEC actif, SERVFAIL si le DS n'a pas expiré) — https://developers.cloudflare.com/dns/dnssec/ — consulté le 15/10/2026
- Cloudflare, Disable DNSSEC (parcours d'ajout d'un domaine) — https://developers.cloudflare.com/learning-paths/get-started/add-domain-to-cf/disable-dnssec — consulté le 15/10/2026
- Cloudflare, DNS best practices, Phase 1 (attendre au moins un TTL du DS, de préférence jusqu'à une fois et demie) — https://developers.cloudflare.com/learning-paths/dns-best-practices/concepts/phase-1 — consulté le 15/10/2026
- OVHcloud, Sécuriser votre nom de domaine avec DNSSEC (24 heures pour activer ou désactiver, onglet des enregistrements DS avec des serveurs DNS externes) — https://docs.ovhcloud.com/fr/guides/web-cloud/domains/dns-dnssec — consulté le 15/10/2026
- Cloudflare, Proxy status (enregistrements « DNS seulement » non proxifiés par la zone du client) — https://developers.cloudflare.com/dns/proxy-status/ — consulté le 15/10/2026
- Render, DDoS protection (infrastructure de Cloudflare utilisée par Render) — https://render.com/docs/ddos-protection — consulté le 16/10/2026
- Render, Configure Cloudflare DNS (« DNS seulement » pour vérifier le domaine et émettre le certificat) — https://render.com/docs/configure-cloudflare-dns — consulté le 16/10/2026
- Cloudflare, Privacy Policy (Cloudflare, Inc., San Francisco ; Data Privacy Framework) — https://www.cloudflare.com/privacypolicy/ — consulté le 15/10/2026
- Cloudflare, Trust Hub GDPR (Data Privacy Framework, repli sur les clauses contractuelles types) — https://www.cloudflare.com/trust-hub/gdpr/ — consulté le 15/10/2026
- Cloudflare, Free plan (protection contre les attaques par saturation incluse) — https://www.cloudflare.com/plans/free/ — consulté le 15/10/2026
- Cloudflare, Turnstile plans — https://developers.cloudflare.com/turnstile/plans/ — consulté le 15/10/2026
- Cloudflare, Turnstile testing — https://developers.cloudflare.com/turnstile/troubleshooting/testing/ — consulté le 15/10/2026
- GitHub Docs, GitHub Pages limits — https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits — consulté le 15/10/2026
- GitHub Docs, Managing a custom domain for your GitHub Pages site — https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site — consulté le 15/10/2026
- GitHub Docs, Creating a custom 404 page for your GitHub Pages site — https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site — consulté le 15/10/2026
- Vercel, Hobby plan — https://vercel.com/docs/plans/hobby — consulté le 15/10/2026
- Netlify, Pricing — https://www.netlify.com/pricing/ — consulté le 15/10/2026
- Render, Deploy for Free — https://render.com/docs/free — consulté le 15/10/2026
- Render, Compute plans — https://render.com/docs/compute-plans — consulté le 15/10/2026
- Render, Pricing — https://render.com/pricing — consulté le 15/10/2026
- Render, Deploying an image — https://render.com/docs/deploying-an-image — consulté le 15/10/2026
- Render, Regions — https://render.com/docs/regions — consulté le 15/10/2026
- Render, Deploys (déploiement après CI verte) — https://render.com/docs/deploys — consulté le 15/10/2026
- Render, Custom domains — https://render.com/docs/custom-domains — consulté le 15/10/2026
- Render, Static sites — https://render.com/docs/static-sites — consulté le 15/10/2026
- Render, certification au Data Privacy Framework UE–États-Unis (journal des changements) — https://render.com/changelog/render-achieves-certification-under-the-eu-us-data-privacy-framework — consulté le 15/10/2026
- Google Cloud, Free cloud features (Cloud Run) — https://docs.cloud.google.com/free/docs/free-cloud-features — consulté le 15/10/2026
- Northflank, Project types (Developer Sandbox) — https://northflank.com/docs/v1/application/billing/project-types — consulté le 15/10/2026
- Koyeb, Pricing — https://www.koyeb.com/pricing — consulté le 15/10/2026
- Fly.io, Pricing — https://docs.fly.io/about/pricing — consulté le 15/10/2026
- Railway, Free trial — https://docs.railway.com/reference/pricing/free-trial — consulté le 15/10/2026
- Oracle Cloud, Always Free resources — https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm — consulté le 15/10/2026
- Brevo, Tarifs (300 e-mails par jour après approbation) — https://www.brevo.com/pricing/ — consulté le 15/10/2026
- Brevo, Mentions légales (éditeur immatriculé à Paris) — https://www.brevo.com/fr/legal/mentions-legales/ — consulté le 15/10/2026
- Brevo, Lieux de stockage des données (page d'aide lue par un résumé de recherche, accès direct refusé) — https://help.brevo.com/hc/en-us/articles/360001005510-Data-storage-location — consulté le 15/10/2026
- Brevo, Will my contacts know that I'm using Brevo? (logo en pied d'e-mail sur l'offre gratuite ; page d'aide lue par un résumé de recherche, accès direct refusé) — https://help.brevo.com/hc/en-us/articles/209429285-Will-my-contacts-know-that-I-m-using-Brevo — consulté le 15/10/2026
- Resend, Pricing — https://resend.com/pricing — consulté le 15/10/2026
- Mailjet, Pricing — https://www.mailjet.com/pricing/ — consulté le 15/10/2026
- Twilio, SendGrid free plan changelog — https://www.twilio.com/en-us/changelog/sendgrid-free-plan — consulté le 15/10/2026
- ALTCHA, dépôt du projet — https://github.com/altcha-org/altcha — consulté le 15/10/2026
- ALTCHA, bibliothèque Java — https://github.com/altcha-org/altcha-lib-java — consulté le 15/10/2026
- GitHub Docs, GitHub Actions billing — https://docs.github.com/en/billing/concepts/product-billing/github-actions — consulté le 15/10/2026
- GitHub Docs, GitHub Packages billing — https://docs.github.com/en/billing/concepts/product-billing/github-packages — consulté le 15/10/2026
- GitHub Docs, Disabling and enabling workflows (60 jours) — https://docs.github.com/en/actions/how-tos/manage-workflow-runs/disable-and-enable-workflows — consulté le 15/10/2026
- GitHub Docs, Dependabot supported ecosystems — https://docs.github.com/en/code-security/dependabot/ecosystems-supported-by-dependabot/supported-ecosystems-and-repositories — consulté le 15/10/2026
- GitHub Docs, About GitHub Advanced Security (fonctions des dépôts publics) — https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security — consulté le 15/10/2026
- UptimeRobot, Pricing — https://uptimerobot.com/pricing/ — consulté le 15/10/2026
- Playwright, Browsers — https://playwright.dev/docs/browsers — consulté le 15/10/2026
- Playwright, Accessibility testing — https://playwright.dev/docs/accessibility-testing — consulté le 15/10/2026
- Lighthouse CI — https://github.com/GoogleChrome/lighthouse-ci — consulté le 15/10/2026
- web.dev, Web Vitals — https://web.dev/articles/vitals — consulté le 15/10/2026
- MDN, Window: popstate event (popstate quand l'état de l'entrée courante change, jamais par pushState ni replaceState) — https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event — consulté le 12/11/2026
- Google Search Central, JavaScript SEO basics — https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics — consulté le 15/10/2026
- Google Search Central, Create a robots.txt file — https://developers.google.com/search/docs/crawling-indexing/robots/create-robots-txt — consulté le 15/10/2026
- Google Search Central, Build a sitemap — https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap — consulté le 15/10/2026
- The Open Graph protocol — https://ogp.me/ — consulté le 15/10/2026
- schema.org, Person — https://schema.org/Person — consulté le 15/10/2026
- RGPD, article 13 (texte consolidé non officiel) — https://gdpr-info.eu/art-13-gdpr/ — consulté le 15/10/2026
- RGPD, article 6 (bases légales ; texte consolidé non officiel) — https://gdpr-info.eu/art-6-gdpr/ — consulté le 15/10/2026
- Commission européenne, EU-US data transfers (décision d'adéquation du 10/07/2023 pour le Data Privacy Framework) — https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/eu-us-data-transfers_en — consulté le 15/10/2026
- CNIL, référentiel relatif aux traitements de données mis en œuvre aux fins de gestion des activités commerciales (durée de conservation des données de prospects) — https://www.cnil.fr/sites/cnil/files/atoms/files/referentiel_traitements-donnees-caractere-personnel_gestion-activites-commerciales.pdf — consulté le 15/10/2026
