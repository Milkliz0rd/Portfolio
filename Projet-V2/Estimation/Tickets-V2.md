# Tickets-V2 — Estimation et découpage de la v2.0.0
Statut : [x] à approuver  [x] approuvé par : Alexandre Morozoff le 27/10/26 (révision du 28/10/26 : changements et lectures acceptés en signant les plans d'implémentation) ; révision du 10/11/26 (one-pager, retrait du CV, reprise du code et reports), approuvée par la fusion de sa PR
Base : Contexte-Pitch, signé par Alexandre Morozoff le 14/10/26 ; US-2.0 et SC-2.0, approuvés le 15/10/26 ; Conception-Technique-V2 et Parcours-Ecrans-V2, approuvés le 16/10/26 ; Charte-Graphique-V2, approuvée le 16/10/26 et réapprouvée le 18/10/26 après la révision du mouvement ; maquettes des douze écrans (EC-00 à EC-11) et leur prototype animé, approuvés le 18/10/26 ; révision du 10/11/2026 de US-2.0, de SC-2.0, du parcours d'écrans, de la charte et des maquettes (site en une page, huit choix de design), de la conception technique et des plans d'implémentation ; décisions d'Alexandre du 12/11/2026 sur les anciennes adresses, l'apostrophe et la règle « depuis » du contrôle du contenu.
Révision du 28/10/2026 : changements et lectures acceptés en signant les plans d'implémentation (TK-67 créé ; TK-16, TK-24, TK-28, TK-42, TK-59, TK-65, A-03, A-04, A-12, A-20 et A-26 modifiés ; A-27 créée).

Ce document découpe la v2.0.0 en tickets, estime chacun et les ordonne en vagues de réalisation. Il ne crée rien sur GitHub : les issues, les labels et le board seront créés à partir de lui, une fois signé. Les estimations, les priorités et l'ordre des vagues sont des propositions : la signature d'Alexandre les valide (section 7).

Conventions de lecture : MF-xx désigne une micro-fonction de US-2.0, SC-2.0-xx un scénario de SC-2.0, EC-xx une section de la page principale (EC-01 à EC-06) ou un écran du parcours d'écrans, CT-xx un choix structurant et D-xx une décision de la conception technique, C-xx un contenu et Q-xx une question des US, CO-xx un composant et MV-xx un motif de mouvement de la charte, PN-xx et V-xx un principe et un point validé du parcours d'écrans, P-xx un point validé de la charte, PF-xx une décision du plan du front, R-xx une exigence reportée à la conception (conception technique, section 11), C1 à C9 les choix d'Alexandre du 16/10/2026 sur les maquettes, « choix 1 » à « choix 8 » ses choix de design du 10/11/2026 (charte révisée). TK-xx numérote les tickets, A-xx les tâches qui reviennent à Alexandre.

## Révision du 10/11/2026

Le 10/11/2026, Alexandre a décidé que le site tient sur une page principale qui défile (accueil, parcours, compétences, expérience, méthode de travail, projets), avec des pages à part pour la fiche de chaque projet, le contact, les mentions légales et la page introuvable, et qu'il n'a plus de CV du tout (« oui plus de CV du tout ») ; le 12/11/2026, il a fixé les cibles des anciennes adresses (A-14), la règle de l'apostrophe typographique et la portée de la règle « depuis » du contrôle du contenu. Cette révision fait suivre au backlog les documents révisés et signés : US-2.0, SC-2.0 et le parcours d'écrans (R1), la charte et les maquettes (R2), la conception technique et les plans d'implémentation (R3). Elle retire le ticket et la tâche du CV, révise les tickets que visent la ligne « Renvoyé à R4 » et les étapes révisées du plan du front, ajoute les tickets qui reprennent le code déjà fusionné, replanifie les vagues à partir de W15 et reprend les points laissés « pour le prochain document signé » qui visent le backlog. Les vagues W1 à W14, faites, ne changent pas, et les tickets fermés gardent leur DoD.

| Élément | Avant | Après | Raison |
| --- | --- | --- | --- |
| En-tête | Approuvé le 27/10/26, révisé le 28/10/26 ; la base s'arrête aux documents approuvés jusqu'au 18/10/2026 | Mentionne aussi cette révision, approuvée par la fusion de sa PR ; la base cite la révision du 10/11/2026 des documents signés et les décisions d'Alexandre du 12/11/2026 | Garder la trace de la révision |
| TK-38 — Écran CV | Ticket v2.0.0, W20, 1 j, issue #55 : /cv avec « Consulter le CV » et « Télécharger le CV », un fichier livré sous un nom stable, une page « CV momentanément indisponible » | Retiré, sans renumérotation : son titre suivi de « (retiré le 12/11/2026) » et une ligne de statut ; son texte entier se lit dans le backlog signé (PR #91) ; il quitte la matrice, les dépendances de TK-48 et de TK-65, le tableau des vagues et la correspondance des issues ; l'issue #55 sera fermée comme abandonnée | Décision d'Alexandre du 10/11/2026 : plus de CV, ni page, ni fichier ; MF-15, SC-2.0-21, SC-2.0-22 et EC-08 sont retirés de US-2.0, de SC-2.0 et du parcours d'écrans |
| A-07 | Répondre à Q-07 (quel CV proposer ?) ; bloque TK-38 ; échéance avant W20 | Retirée, sans renumérotation, sur une seule ligne : son titre, « (retirée le 12/11/2026) » et son statut ; son texte entier se lit dans le backlog signé (PR #91) ; elle quitte l'échéancier | Q-07 tranchée le 10/11/2026 : plus de CV sur le site |
| A-11 | Contenus C-01 à C-10, dont C-03, le CV en fichier ; C-04 « pour la page Méthode » | C-01, C-02 et C-04 à C-10 ; C-04 pour la section Méthode | C-03 retiré de US-2.0 ; la méthode est une section de la page principale |
| A-13 | Textes à valider : information sur les données, mentions légales, page introuvable et CV indisponible | Sans le texte du CV indisponible | Plus de CV |
| TK-19 — Résumé (ticket fermé) | « Crée les composants du formulaire de contact et des messages d'état, réutilisés aussi par le CV indisponible. » | La fin de la phrase est retirée ; la DoD, faite, ne change pas | Plus de CV : le résumé était devenu faux |
| TK-24 — Résumé (ticket fermé) | « seule exception à la règle « Un ticket = une branche = une PR » » | « exception à la règle …, au même titre qu'un ticket de plus de 400 lignes » ; la DoD, faite, ne change pas | La section 1 compte maintenant deux exceptions |
| TK-45 — DoD (4) | « les textes de la page introuvable et du CV indisponible sont finalisés » | Les textes de la page introuvable | Plus de CV ; étape 34 du plan du front |
| TK-65 — Titre, titre de PR, Couvre, Dépend de, DoD, Taille et Résumé | « textes, CV et images du portfolio » ; couvre MF-15 et SC-2.0-21, contenus C-01 à C-10 ; dépend de TK-38 ; DoD (3) : le CV livré sous le nom fixé par A-07, SC-2.0-21 sur le vrai fichier ; DoD (5) : un emplacement étiqueté ou l'absence du CV bloquent ; taille hors CV | « textes et images du portfolio », titre de PR sans « cv » ; ni MF-15 ni SC-2.0-21 ; contenus C-01, C-02 et C-04 à C-10 ; TK-38 ôté des dépendances ; DoD (3) sans objet, son numéro gardé parce que le plan du front cite la DoD (4) ; DoD (5) : un emplacement étiqueté bloque ; taille hors vignette et captures | Renvoyé à R4 par le plan du front : TK-65, plus de CV ; étape 45 du plan du front |
| TK-48 — Couvre et Dépend de | EC-08 et TK-38 | Ôtés | TK-38 retiré ; EC-08 retiré du parcours d'écrans |
| Section 5 — Matrice de couverture | Lignes MF-15, SC-2.0-21, SC-2.0-22 et EC-08 ; TK-38 cité pour MF-04 et SC-2.0-05 | Lignes retirées ; TK-38 ôté ; chaque MF et chaque scénario qui restent ont au moins un ticket | Éléments retirés le 10/11/2026 |
| Section 7 — Contrôle du contenu en deux modes | « les emplacements étiquetés et l'absence du CV sont signalés sans bloquer » | Les emplacements étiquetés seuls | Décision du 10/11/2026 : le contrôle de TK-28 qui exige un CV est retiré |
| Section 7 — Intégration des contenus en deux tickets | TK-65 : « textes C-01 à C-10, CV, vignette et captures du portfolio » | Textes C-01, C-02 et C-04 à C-10, vignette et captures du portfolio | Plus de CV |
| Section 8 — Correspondance avec les issues | La ligne de TK-38 (#55) | Retirée ; une phrase de la révision le dit, sans nommer le ticket | Le ticket est retiré ; l'issue #55 sera fermée comme abandonnée |
| Renvoyé à R4 — Annulation de TK-38 et d'A-07 | — | Faite : lignes TK-38 et A-07 ci-dessus | Ligne « Renvoyé à R4 » du plan du front et de la conception technique |
| Renvoyé à R4 — TK-65 (plus de CV) | — | Fait : ligne TK-65 ci-dessus | Ligne « Renvoyé à R4 » du plan du front |
| Étape 27 — TK-38 | « Écran CV (TK-38) », étape retirée du plan du front le 12/11/2026, l'annulation du ticket renvoyée à R4 | Ticket retiré : ligne TK-38 ci-dessus | Plan du front, tableau de révision |
| Section 7 — Les estimations, après le retrait | 62 tickets, dont 37 à 1 j ; 79,5 j | 61 tickets, dont 36 à 1 j ; 78,5 j, avant l'ajout des tickets de la reprise du code (ligne « Section 7 — Les estimations » plus bas) | TK-38 retiré : 1 j de moins |
| TK-68 à TK-72 | N'existaient pas | Cinq tickets v2.0.0 qui reprennent le code fusionné jusqu'à 7b93b24, numérotés à la suite, au format des autres : TK-68, page principale provisoire, routes et pages d'erreur (1 j, ≈ 330 lignes) ; TK-69, retrait du fichier de candidature du contenu et des en-têtes (0,5 j, ≈ 160 lignes) ; TK-70, défilement du routeur vers les ancres (2 j, ≈ 380 lignes) ; TK-71, entrée courante du lien et ancre de la carte (1 j, ≈ 220 lignes) ; TK-72, en-tête de section, typographie, largeur du texte et fenêtre factice (1 j, ≈ 220 lignes) ; chacun estimé sous 400 lignes, avec l'écart constaté de W1 à W14 ; leurs issues sont à créer (section 8) | Section « Code déjà fusionné à reprendre » du plan du front, base des tickets de R4 ; aucun ne passe 400 lignes à l'estimation, donc aucun n'est coupé |
| Renvoyé à R4 — Le ou les tickets de la reprise du code déjà fusionné, avant l'étape 16 | — | Fait : TK-68 à TK-72, tous en W15 à W17, avant l'en-tête (TK-27, étape 16), qui dépend de TK-68, TK-70 et TK-71 | Ligne « Renvoyé à R4 » du plan du front ; ordre de sa section « Code déjà fusionné à reprendre » |
| Reprise — ligne 1 (app.routes.ts : une route par section) | Code de TK-05 | Portée par TK-68, DoD (1) : page principale provisoire, sections à leurs ancres, plus de route par section | Plan du front, PF-06 ; avant l'étape 16 |
| Reprise — ligne 2 (routes cv et cv/404) | Code de TK-05 | Portée par TK-68, DoD (2) | Plus de CV ; avant l'étape 16 |
| Reprise — ligne 3 (app.routes.server.ts) | Code de TK-05 et TK-12 | Portée par TK-68, DoD (3) | PF-06 ; avant l'étape 16 |
| Reprise — ligne 4 (finaliser-build.mjs : trois pages d'erreur) | Code de TK-05 et TK-13 | Portée par TK-68, DoD (4) : deux pages d'erreur | PF-06 ; avant l'étape 16 |
| Reprise — ligne 5 (en-têtes du fichier du CV) | Code de TK-13 et TK-23 | Portée par TK-69, DoD (1) | PF-09 ; avant l'étape 16 |
| Reprise — ligne 6 (cvPresent dans l'index des projets) | Code de TK-12 | Portée par TK-69, DoD (2) | PF-02 ; avant l'étape 16 |
| Reprise — ligne 7 (champ cv.fichier du profil) | Code de TK-12 | Portée par TK-69, DoD (3) | PF-02 ; avant l'étape 16 |
| Reprise — ligne 8 (initialiseur du défilement d'app.config.ts) | Code de TK-23 | Portée par TK-70, DoD (1) à (3) et (5) | Conception technique, section 3, « Ancres » ; V-11 ; avant l'étape 16 |
| Reprise — ligne 9 (scroll-padding-top et commentaire du mouvement) | Code de TK-11 et TK-23 | Portée par TK-70, DoD (4) | PF-06 ; avant l'étape 16 |
| Reprise — ligne 10 (lien : courant booléen) | Code de TK-15 | Portée par TK-71, DoD (1) | CO-02 et CO-06 révisés, choix 8 ; avant l'étape 16, premier emploi du lien |
| Reprise — ligne 11 (carte : lien sans ancre) | Code de TK-26 | Portée par TK-71, DoD (2) | PF-06 ; avant l'étape 22 (TK-33) |
| Reprise — ligne 12 (en-tête de section) | Code de TK-17 | Portée par TK-72, DoD (1) | Choix 4 et 5, CO-16 révisé ; avant l'étape 23 (TK-34) |
| Reprise — ligne 13 (césure et taille des h2) | Code de TK-11 | Portée par TK-72, DoD (2) | Choix 5 ; avant l'étape 22 |
| Reprise — ligne 14 (conteneur-texte à 68ch) | Code de TK-10 | Portée par TK-72, DoD (3) | Choix 3 ; avant l'étape 22 |
| Reprise — ligne 15 (titre de la fenêtre factice à 12 px) | Code de TK-25 | Portée par TK-72, DoD (4) | Choix 1 ; avant l'étape 22, dont la fenêtre « profil.ts » |
| Reprise — ligne 16 (exemples de test sur /parcours et /cv) | Code de TK-05, TK-13, TK-15 | Avec le fichier qu'elle accompagne : provisoire.spec.ts dans TK-68, DoD (6) ; en-tetes.test.mjs dans TK-69, DoD (4) ; bouton.spec.ts et lien.spec.ts dans TK-71, DoD (3) | Ordre du plan du front : « les lignes 16 à 18, avec le fichier qu'elles accompagnent » |
| Reprise — ligne 17 (pages d'erreur et conformité du banc) | Code de TK-21 | Portée en entier par TK-68, DoD (5), avec les lignes 2 et 4 qu'elle accompagne | PF-08 |
| Reprise — ligne 18 (README et wrangler.jsonc) | Code de TK-05 à TK-26 | Avec le code que chaque passage décrit, comme le veut la DoD commune (README à jour) : README 401, 409, 474, 490 à 492 et wrangler.jsonc dans TK-68, DoD (6) ; README 86, 229 et 440 dans TK-69, DoD (4) ; README 121 et 207 dans TK-71, DoD (3) | Ordre du plan du front : avec le fichier qu'elle accompagne |
| Reprise — ligne 19 (controle-commun.spec.ts et mouvement.spec.ts) | — | Rien à reprendre, cité pour mémoire : la liste des pages suit le build ; seules les pages d'erreur changent (ligne 17, TK-68) | Plan du front, pour mémoire |
| Reprise — ligne 20 (components/champ sans mention par champ) | — | Rien à reprendre, cité pour mémoire : le formulaire n'a que des champs obligatoires, annoncés par une phrase (choix 7, TK-41) | Plan du front, pour mémoire |
| Reprise — ligne 21 (taille-code, conteneurs, interligne du code) | — | Rien à reprendre, cité pour mémoire : déjà conformes | Plan du front, pour mémoire |
| Reprise — ligne 22 (apostrophe typographique dans front/src/) | — | Rien à reprendre, cité pour mémoire : libellés et contenu emploient déjà ’ | Décision d'Alexandre du 12/11/2026 : le code ne change pas |
| Section 2 — Introduction | Tickets v2.0.0 : TK-01 à TK-59, TK-65, TK-66, TK-67 | Hors le ticket retiré, et TK-68 à TK-72 ajoutés ; un ticket retiré garde son numéro, son titre et une ligne de statut | Retrait de TK-38 ; reprise du code |
| Section 8 — Nouveaux tickets | — | Une ligne « à créer » par ticket de TK-68 à TK-72 ; le pilote crée les issues et écrit leurs numéros avant d'ouvrir la PR | Le backlog garde la correspondance de chaque ticket actif |
| Section 5 — CT-01, CT-03 et MF-04 | Sans les tickets de la reprise | CT-01 et MF-04 avec TK-68, MF-04 avec TK-70, CT-03 avec TK-69 | Champ « Couvre » des nouveaux tickets |
| Conventions de lecture | EC-xx un écran ; ni PF-xx, ni « choix 1 » à « choix 8 » | EC-xx une section de la page principale ou un écran ; PF-xx une décision du plan du front ; « choix 1 » à « choix 8 », les choix de design du 10/11/2026 | Les tickets révisés citent PF-06 et ces choix ; EC-01 à EC-06 sont des sections |
| Section 1 — Taille des PR : ce qui ne compte pas | Lockfiles, fichiers de scaffold commités à part, prose de Projet-V2/, maquettes, PR qui ne fait que supprimer un dossier | Aussi : les textes de licence des polices, comme le lockfile ; un commit qui ne fait que retirer du contenu produit par l'outil de création, la PR se mesurant depuis lui (TK-05 : 701 lignes depuis 273b4b0, 351 depuis 46d0011, mesurées à nouveau le 12/11/2026) ; la commande de mesure le dit | Reports « pour le prochain document signé » |
| Section 1 — Taille des PR : dépassement | « si la réalisation montre qu'il dépassera 400 lignes, il est découpé avant l'ouverture de la PR » | PR successives sur la même issue, coupées à des frontières nettes, chaque PR verte seule, sans redemander à Alexandre (règle déjà appliquée à TK-10, TK-13, TK-19, TK-20, TK-22, TK-24, TK-25, TK-26 et TK-67) ; les tailles des tickets ajoutés ou révisés tiennent compte de l'écart de W1 à W14, de 1,6 à 7,6 fois (environ 3,3 en médiane), les autres restent celles du 27/10/2026 | Report « pour le prochain document signé » ; leçon de W1 à W14 |
| Section 1 — Branches, commits et PR | « Une seule exception : TK-24 » | Deux exceptions : un ticket de plus de 400 lignes, en PR successives, et TK-24 | Règle de coupe ci-dessus |
| Section 1 — DoD commune, front | « seulement des jetons de la charte » ; rien sur l'apostrophe | Une valeur brute que la charte reprend des maquettes devient un jeton de rôle dès que le code l'emploie ; tout texte affiché avec l'apostrophe typographique ’ | Report « pour le prochain document signé » (valeurs prises aux seules maquettes, reportées dans la charte révisée) ; décision d'Alexandre du 12/11/2026 sur l'apostrophe |
| TK-27 — Couvre, Dépend de, Taille, DoD et Résumé | Entrées « CV » et « Contact » hors du menu ; entrée courante d'après la page, dont « CV » sur /cv ; tests « depuis chaque adresse du plan du site » vers /cv et /contact ; ≈ 330 lignes | « Contact » seul hors du menu ; services/navigation : section lue (seuil de 40 %, bout de la page) avec aria-current="location", données de la route avec aria-current="page" sur une page à part ; défilement sans étape d'historique ; adresse qui suit la lecture par History.replaceState après le chargement ; ancre qui ne nomme rien à l'ouverture (V-11) ; lien d'évitement intercepté ; tests unitaires de PF-06 et bout en bout du défilement, de l'historique et des ancres ; couvre aussi MF-04, SC-2.0-05 et V-11 ; dépend aussi de TK-23, TK-68, TK-70 et TK-71 ; ≈ 700 lignes, en PR successives | Renvoyé à R4 : DoD de TK-27 (entrée signalée, défilement, adresse) ; étape 16 du plan du front ; choix 8 ; plus de CV |
| TK-28 — Dépend de, Taille, DoD et Résumé | « CV présent sous un nom conforme » ; « depuis » refusé partout ; tournures cherchées telles qu'écrites ; « il vérifie aussi qu'aucun code du front n'affiche de valeur calculée depuis la date du jour » ; l'absence du CV signalée en mode staging ; ≈ 300 lignes | Contrôle du CV retiré ; « depuis » refusé seulement suivi d'une date, d'un nombre ou d'une durée, « Reconversion depuis la restauration » passant tel quel ; une tournure trouvée avec l'une ou l'autre apostrophe ; une apostrophe droite dans le contenu est une faute ; la règle de la date du jour, déjà posée par TK-07, constatée ; dépend aussi de TK-69 ; ≈ 550 lignes, en PR successives | Renvoyé à R4 : TK-28 (contrôle du CV retiré, apostrophe) ; décisions d'Alexandre du 12/11/2026 (apostrophe, règle « depuis ») ; report : règle de la date posée par TK-07 (lecture du 28/10/2026) ; étape 17 |
| TK-29 — Taille, DoD et Résumé | « le CV et le contact restent hors du menu » ; choisir une section ferme le panneau ; section courante signalée ; ≈ 230 lignes | Le contact seul hors du menu ; menu sur details et summary ; mêmes liens et même règle d'historique que la navigation ; un clic hors du panneau le ferme ; choisir une section fait défiler sans étape d'historique ; le refermer sans choisir ne déplace pas la lecture ; entrée courante, la section lue ; ≈ 450 lignes, en PR successives | Renvoyé à R4 : DoD de TK-29 ; CO-07 révisé ; étape 18 |
| TK-31 — Couvre, Dépend de, Taille, DoD et Résumé | Mentions légales en emplacements ; « retour à la liste des projets » pour un projet inconnu ; tests de l'adresse inconnue et du projet inexistant ; ≈ 280 lignes | Liens internes des textes légaux en liens du routeur ; liste clé-valeur dont une valeur porte un lien, ses colonnes en jetons de rôle ; deux variantes, « Voir la liste des projets » vers /#projets, /projets seule selon le document servi ; tests aussi de /projets seule, de /parcours et de l'ancre qui ne nomme rien visée depuis les mentions légales (V-11) ; couvre aussi CO-17 et V-11 ; dépend aussi de TK-17 ; ≈ 550 lignes, en PR successives | Renvoyé à R4 : TK-31 (deux variantes, ancre qui ne nomme rien depuis une autre page) ; reports : valeur de liste qui porte un lien (EC-10), valeurs brutes en jetons de rôle ; étape 20 |
| TK-33 — Titre, titre de PR, Couvre, Dépend de, Taille, DoD et Résumé | « Écran Accueil » ; « Voir le CV » en action principale (choix C4) et « Écrire un message » ; chaque carte mène à sa section ; ≈ 340 lignes | « Section Accueil », en haut de la page principale, sans ancre ni numéro ; un seul bouton mis en avant, « Écrire un message » ; des cartes qui font défiler la page sans étape d'historique ; / ouvert puis rechargé ; couvre aussi MF-04 et SC-2.0-05 ; dépend aussi de TK-71 et TK-72 ; ≈ 600 lignes, en PR successives | Renvoyé à R4 : TK-33 à TK-40 (sections) ; EC-01 révisé ; plus de CV ; étape 22 |
| TK-34, TK-35 et TK-36 — Titres, titres de PR, Dépend de, Taille, DoD et Résumés | « Écran Parcours », « Écran Compétences », « Écran Expérience » ; /parcours, /competences, /experience ouverts puis rechargés ; compétences humaines, puis le récit ; ≈ 200, 220 et 200 lignes | « Section … », chacune à son ancre, en-têtes numérotés 01, 02 et 03, titre de niveau 2 à taille-titre-1 ; /#parcours, /#competences, /#experience ouverts puis rechargés, sous l'en-tête ; compétences humaines en pastilles sans carte, à gauche de la carte du récit (choix 6) ; un emplacement d'action ou de liste dans l'en-tête de section, et TK-36 couvre aussi CO-16 ; dépendent aussi de TK-72 ; ≈ 300, 350 et 350 lignes | Renvoyé à R4 : TK-33 à TK-40 ; choix 4, 5 et 6 ; report : emplacement d'action ou de liste de l'en-tête de section (spécimen centré, EC-04) ; étapes 23 à 25 |
| TK-37 — Couvre, Dépend de, Taille, DoD et Résumé | Retour « à la liste des projets » ; « CV et contact en un clic depuis la fiche » ; en-tête sans règle ; ≈ 350 lignes | En-tête sans numéro, titre de niveau 1 ; retour vers /#projets, navigation ordinaire, d'un coup ; le contact en un clic ; /projets/portfolio ouvert puis rechargé, aussi pour SC-2.0-05 ; aria-current="page" sur « Projets » ; dépend aussi de TK-72 ; ≈ 550 lignes, en PR successives | Renvoyé à R4 : TK-33 à TK-40 ; EC-07 révisé ; SC-2.0-05 élargi ; plus de CV ; étape 26 |
| TK-39 et TK-40 — Titres, titres de PR, Couvre, Dépend de, Taille, DoD et Résumés | « Écran Liste des projets », « Écran Méthode de travail » ; /projets et /methode ouverts puis rechargés ; ≈ 250 et 300 lignes | « Section … », à l'ancre projets, la dernière, que suit le seul pied de page (V-10), et à l'ancre methode, en-têtes numérotés 05 et 04 ; /#projets et /#methode ouverts puis rechargés ; « Projets » signalé au bout de la page ; TK-39 couvre aussi V-10 ; dépendent aussi de TK-72 ; ≈ 450 lignes chacun, en PR successives | Renvoyé à R4 : TK-33 à TK-40 ; V-10 ; étapes 28 et 29 |
| TK-41 — Dépend de, Taille, DoD et Résumé | « Tous les champs sont obligatoires. » sans dire où ; en-tête sans règle ; messages d'erreur sans texte cité ; ≈ 330 lignes | En-tête sans numéro, titre de niveau 1 ; une seule phrase avant le formulaire, sans mention par champ (choix 7) ; « Contact » signalé ; messages cités au caractère près, avec ’ ; dépend aussi de TK-72 ; ≈ 550 lignes, en PR successives | Étape 30 du plan du front ; choix 4, 5 et 7 ; décision du 12/11/2026 sur l'apostrophe |
| TK-43 — DoD (2) | Message d'attente « au libellé tranché par TK-02 » | Le message cité, avec ’ : « L’envoi peut prendre jusqu’à 90 secondes. Votre saisie est conservée. » | Étape 32 ; décision du 12/11/2026 sur l'apostrophe |
| TK-44 — Taille, DoD et Résumé | Plan du site « à partir des pages pré-rendues » ; la consigne de non-indexation des préversions produite ici ; ≈ 160 lignes | La page principale, chaque fiche, le contact et les mentions légales, sans ancre ni barre finale ; X-Robots-Tag déjà posé par TK-13, constaté sans être refait ; ≈ 250 lignes | Renvoyé à R4 : TK-44 (X-Robots-Tag déjà posé) ; CT-11 révisée ; étape 33 |
| TK-45 — Dépend de, Taille et DoD (6) | Bout en bout sur les textes finaux ; ≈ 120 lignes | Aussi : le contrôle du contenu, en mode main, ne relève aucune tournure dans les textes finaux ; dépend aussi de TK-28 ; ≈ 200 lignes | Étape 34 du plan du front |
| TK-46 — Taille, DoD et Résumé | Balises par page pré-rendue ; « Person » sur l'accueil ; ≈ 250 lignes | Balises une fois par page, aucune par section, inchangées quand l'adresse suit la lecture ; « Person » sur la page principale ; ≈ 450 lignes, en PR successives | CT-11 révisée : référencement par page ; étape 35 |
| TK-47 — Taille, DoD (2) et (3) | « le projet apparaît dans la liste » ; les autres pages identiques « hormis la liste des projets et le plan du site » ; ≈ 150 lignes | Dans la section des projets ; la page principale ne diffère que par la carte du projet, les autres pages identiques une fois retirées les références aux fichiers de code et de style ; ≈ 250 lignes | La liste des projets est une section ; étape 36 |
| TK-48 — Taille, DoD (1) et Résumé | « chaque bloc de contenu de chaque écran » ; ≈ 330 lignes | Chaque bloc de chaque section de la page principale et de chaque page à part ; ≈ 600 lignes, en PR successives | Étape 37 |
| TK-49 — DoD (1) | Une adresse inconnue « avec la page introuvable » | Repérée par son titre « Cette page n’existe pas » | Étape 38 ; décision du 12/11/2026 sur l'apostrophe |
| TK-52 — Taille, DoD et Résumé | Fondu à chaque navigation interne ; « le repère de page courante glisse » ; une ancre de la même page non interceptée ; ≈ 160 lignes | Fondu entre deux pages, quelles qu'elles soient, jamais d'une section à l'autre (annulé quand le chemin ne change pas) ni au suivi de l'adresse ; le repère de l'entrée courante ; aucune transition au retour ni à l'avance ; tests de ces cas ; ≈ 300 lignes | Renvoyé à R4 : TK-52 (fondu entre pages seulement) ; MV-07 révisé ; étape 41 |
| TK-53 | — | Rien à changer : sa DoD ne nomme aucune adresse | Étape 42 du plan du front |
| TK-55 — DoD (1) | MV-08 sans lieu dit | Dans la section méthode de la page principale | Étape 44 ; MV-08 révisé |
| TK-56 — Taille, DoD et Résumé | Cibles proposées : /about vers /parcours, /arcade vers /projets, /competence/… vers /projets ; ≈ 40 lignes | Cibles décidées : /#parcours, /#projets et /#projets, en 301, avec et sans barre finale ; toute autre ancienne adresse en 404 ; l'ancre testée dans l'en-tête Location ; ≈ 100 lignes | Renvoyé à R4 : TK-56 (cibles avec ancre) ; décision d'Alexandre du 12/11/2026 (A-14) ; étape 46 |
| TK-57 — DoD (1) | « chaque adresse du plan du site » | Les pages nommées : la page principale, chaque fiche, le contact, les mentions légales | Étape 48 |
| TK-58 — DoD (1) | Téléphones réels « sur toutes les pages » | Aussi le défilement de la page principale, l'entrée signalée, l'adresse et le retour arrière | Étape 49 |
| TK-66 — Taille et DoD (1) | Illustrations sans forme dite ; ≈ 280 lignes | Un composant de quatre fichiers par illustration ; la feuille de style et le test partagés des démonstrations partent avec elles ; ≈ 600 lignes, en PR successives | Étape 47 ; lecture de W7 (PF-02) |
| A-14 | À valider, sur la proposition écrite dans TK-56 | Texte gardé, suivi de la décision d'Alexandre du 12/11/2026 | Décision d'Alexandre du 12/11/2026 |
| Section 5 — Titres et lignes | MF-02 « CV et contact accessibles en permanence » ; MF-04 « Liens directs vers les pages » ; SC-2.0-02 et SC-2.0-03 « CV et contact atteints… » ; SC-2.0-05 « Lien direct vers une section » ; sous-titre « Écrans » | Les titres des documents révisés ; MF-04 et SC-2.0-05 avec les tickets qui les couvrent maintenant ; sous-titre « Sections et écrans » | US-2.0, SC-2.0 et parcours d'écrans révisés |
| Section 7 — Cibles des redirections | La proposition du 27/10/2026 | Proposition gardée, suivie de la décision du 12/11/2026 | Décision d'Alexandre |
| Section 7 — Transitions entre pages | Exception à valider | Point gardé, suivi de la révision : exception nommée par la conception technique révisée ; fondu entre deux pages seulement | Conception technique et charte révisées |
| Section 7 — Reprise du code | N'existait pas | Nouveau point : cinq tickets, les lignes 16 et 18 avec le ticket qu'elles accompagnent, TK-28 dans la dernière vague de la reprise | La révision |
| Renvoyé à R4 — DoD de TK-27, TK-29 et TK-52 (entrée signalée, défilement, adresse, fondu entre pages seulement) | — | Fait : lignes TK-27, TK-29 et TK-52 | Ligne « Renvoyé à R4 » du plan du front |
| Renvoyé à R4 — TK-28 (contrôle du CV retiré, apostrophe) | — | Fait : ligne TK-28 | Ligne « Renvoyé à R4 » du plan du front |
| Renvoyé à R4 — TK-31 (deux variantes, ancre qui ne nomme rien depuis une autre page) | — | Fait : ligne TK-31 | Ligne « Renvoyé à R4 » du plan du front |
| Renvoyé à R4 — TK-33 à TK-40 (sections) | — | Fait : lignes TK-33, TK-34 à TK-36, TK-37, TK-39 et TK-40 ; TK-38 retiré | Ligne « Renvoyé à R4 » du plan du front |
| Renvoyé à R4 — TK-44 (X-Robots-Tag déjà posé) | — | Fait : ligne TK-44 | Ligne « Renvoyé à R4 » du plan du front |
| Renvoyé à R4 — TK-56 (cibles avec ancre) | — | Fait : ligne TK-56 | Lignes « Renvoyé à R4 » du plan du front et de la conception technique |
| Renvoyé à R4, conception technique — tests des ancres, de la section lue et de l'adresse dans les tickets qui les portent | — | Fait : TK-27 (section lue, adresse, ancres, V-11 à l'ouverture), TK-70 (tableau de défilement), TK-31 (V-11 depuis une autre page), TK-33 à TK-37, TK-39 et TK-40 (sections et pages ouvertes puis rechargées), TK-56 (redirections avec ancre) | Ligne « Renvoyé à R4 » de la conception technique |
| Étape 1 — TK-05 ; étapes 6 à 10, 12, 14 et 15 — TK-11, TK-12, TK-13, TK-15, TK-17, TK-21, TK-25 et TK-26 (tickets fermés) | DoD signées et faites, sur l'ancien plan | DoD inchangées : ce que le plan du front révisé change dans leur code est porté par la reprise (TK-68 à TK-72, lignes « Reprise » ci-dessus) ; étape 12 (contrôle commun sur chaque page du build) : rien à reprendre, ligne 19 | Tickets fermés : leur DoD ne se réécrit pas |
| Reports — la règle de la date du jour (TK-28) | — | Écrite dans la DoD (3) de TK-28 | Report « pour le prochain document signé » : lecture de TK-07 acceptée le 28/10/2026 |
| Reports — emplacement d'action ou de liste de l'en-tête de section ; valeur de liste qui porte un lien | — | DoD (5) de TK-36 ; DoD (2) de TK-31 | Reports de R2 (EC-04, EC-10) |
| Reports — valeurs brutes des maquettes en jetons de rôle | — | DoD commune, côté front ; pour le code déjà livré : TK-71 (lien, icône), TK-72 (en-tête de section), TK-31 (liste clé-valeur) | Report de R2 |
| Reports — section 1 (contenu généré, coupe au-delà de 400 lignes, licences des polices) | — | Lignes « Section 1 » ci-dessus | Reports « pour le prochain document signé » |
| Section 3 et champ « Vague » des tickets, à partir de W15 | W15 à W33 : TK-27 et TK-28 en W15, puis les écrans de W17 à W21, le mouvement de W25 à W29, les contenus en W29 et W30, la bascule en W33 | W15 à W35 : la reprise d'abord (TK-68 et TK-69 en W15, TK-70 et TK-71 en W16, TK-72 en W17, avec TK-28, qui ne dépend que de TK-69 parmi elles), l'en-tête et la frise en W18, puis le reste dans le même ordre, décalé de deux à trois vagues ; au plus deux tickets indépendants par vague, chacun strictement après ses dépendances ; W1 à W14 inchangées | Reprise du code avant l'étape 16 (lignes 1 à 9) et avant le premier écran (lignes 10 à 15) ; TK-38 retiré |
| Section 3 — Chemin critique | 14 tickets, de TK-01 à TK-59 par TK-15 → TK-27 ; 33 vagues | 16 tickets, par TK-15 → TK-26 → TK-71 → TK-27 ; 35 vagues | Recalculé sur les dépendances révisées |
| Section 4 — Échéancier | Avant W19, A-06 ; avant W20, la tâche retirée ; pendant W24, A-13 ; avant W29, A-11 et A-12 ; avant W30, A-14 ; avant W32, A-09 et A-10 ; avant W33, A-18 ; pendant W33, A-16, A-17, A-19, A-20 et A-26 | Avant W21, A-06 ; pendant W26, A-13 ; avant W31, A-11 et A-12 ; avant W32, A-14, tranchée le 12/11/2026 ; avant W34, A-09 et A-10 ; avant W35, A-18 ; pendant W35, A-16, A-17, A-19, A-20 et A-26 | Vagues replanifiées |
| Section 7 — Les estimations | 62 tickets, dont 5 à 0,5 j, 37 à 1 j et 20 à 2 j ; 79,5 j | 66 tickets, dont 6 à 0,5 j, 39 à 1 j et 21 à 2 j ; 84 j (un ticket de 1 j retiré ; TK-68 à TK-72 ajoutés, pour 5,5 j) ; les estimations des tickets révisés ne changent pas | Retrait de TK-38 ; reprise du code |
| Section 7 — L'ordre des vagues | 33 vagues ; mouvement de W25 à W29, contenus en W29 et W30, budget en W31 | 35 vagues ; reprise de W15 à W17, en-tête en W18 ; mouvement de W27 à W31, contenus en W31 et W32, budget en W33, passe manuelle et bascule en W34 et W35 | Vagues replanifiées ; l'ordre de fond ne change pas |

## 1. Conventions

### Labels GitHub

| Famille | Labels | Règle |
| --- | --- | --- |
| Domaine | front, back, infra, docs | un seul par ticket : front/, back/, l'hébergement et la CI, ou la documentation de Projet-V2/ |
| Priorité | prio-low, prio-medium, prio-high, prio-critique | un seul par ticket |
| Type | feature, chore, docs, ci, test, bug | un seul par ticket ; bug pour un défaut, avec le modèle bug.md |
| Report | après-v2 | posé sur un ticket créé pour tracer, développé seulement après la mise en production de la v2.0.0 |

Le domaine docs et le type docs sont un seul et même label, docs : un ticket de documentation est toujours du domaine docs, et seul un ticket de documentation l'est. Le dépôt n'a aujourd'hui que les labels par défaut de GitHub, plus dependencies et javascript, posés par les alertes de dépendances : bug est repris tel quel ; front, back, infra, docs, les quatre priorités, feature, chore, ci, test et après-v2 sont à créer ; dependencies reste au robot de mises à jour, qui le pose sur ses PR ; les autres labels par défaut ne servent pas.

### Issues

Chaque ticket devient une issue créée avec le modèle .github/ISSUE_TEMPLATE/feature.md — US liée (US-2.0 et les MF couverts), priorité, estimation en « Time delivery », résumé — complétée par les autres champs du ticket (couvre, dépend de, vague, taille, DoD). Le modèle pose le label feature : pour un ticket d'un autre type, il est remplacé par le label de son type. Les tickets gardent leur identifiant TK : les PR #1 à #15 existant déjà, les numéros d'issue partiront de #16 au moins, et la correspondance TK → n° d'issue sera ajoutée à ce document après la création du backlog.

### Board

| Colonne | Sens |
| --- | --- |
| Backlog | ticket créé ; sa vague n'est pas encore ouverte |
| To do | sa vague est ouverte et tout ce que cite son champ « Dépend de » est fait, hors les tâches marquées « (pour finir) » : il est prêt à être pris |
| In progress | sa branche existe et sa PR vers staging est ouverte, en relecture jusqu'à sa fusion |
| To review | fusionné dans staging, à vérifier sur la préproduction par quelqu'un qui ne l'a pas écrit |
| Closed | fusionné, tagué et déployé en production : à la bascule (TK-59) pour les tickets v2.0.0 ; un ticket docs de l'Étape 6, qui ne se déploie pas, se ferme à sa fusion signée |

Si l'autorisation d'accès au board de GitHub, qu'Alexandre donnera lui-même, manque, les cinq colonnes deviennent des labels de statut du même nom, posés à la main sur chaque issue.

### Estimations

Paliers : 0,5 j ; 1 j ; 2 j ; 1 semaine et +. Une estimation est l'effort d'un développeur pour réaliser le ticket, le tester et le faire relire ; ce n'est ni une mesure, ni une durée calendaire, ni une date de livraison. Chaque estimation est une proposition, qu'Alexandre valide en signant ce document. Un ticket qui dépasse son estimation n'est pas une faute : on note pourquoi, pour la rétrospective.

### Taille des PR : la règle des 400 lignes

Une PR compte au plus 400 lignes de diff : lignes ajoutées plus lignes retirées, mesurées par rapport à staging. Ne comptent pas : les lockfiles ; les textes de licence des polices (textes OFL recopiés), comme le lockfile ; les fichiers produits par un outil de scaffold, commités tels quels dans un commit à part de la PR, et un commit qui ne fait que retirer du contenu produit par cet outil, comme la page de démonstration d'Angular : la PR se mesure alors depuis ce commit (première application : TK-05, 701 lignes depuis le commit brut 273b4b0, 351 depuis 46d0011) ; la prose de Projet-V2/ ; les maquettes HTML de Projet-V2/Conception/Maquettes/. Ne compte pas non plus, par décision d'Alexandre du 27/10/2026, une PR qui ne fait que supprimer un dossier entier, comme le retrait de l'ancien site my-portfolio/ (TK-08) : elle se relit d'un coup d'œil, sur la liste des fichiers retirés, et ne se découpe pas. Une précision est proposée ici, à valider : un fichier binaire (police, image, PDF) n'a pas de lignes et ne compte pas.

Mesure, depuis la branche du ticket, en ajoutant au besoin les autres chemins exclus (les licences des polices, par ':!*-ofl.txt') et, pour un scaffold, en partant du commit du générateur, ou du commit qui ne fait que retirer son contenu, au lieu de staging :

```
git diff --numstat origin/staging...HEAD -- . ':!Projet-V2' ':!*package-lock.json' | awk '$1 != "-" { n += $1 + $2 } END { print n + 0 }'
```

Le total mesuré est écrit dans la description de la PR. Chaque ticket donne ci-dessous sa taille estimée. Un ticket qui dépasse 400 lignes se livre en PR successives sur la même issue, coupées à des frontières nettes, chaque PR verte seule, sans redemander à Alexandre ; la règle a déjà servi pour TK-10, TK-13, TK-19, TK-20, TK-22, TK-24, TK-25, TK-26 et TK-67. De W1 à W14, les tailles réelles ont valu de 1,6 à 7,6 fois les tailles estimées le 27/10/2026, environ 3,3 fois en médiane (mesure sur les tickets fermés) : celles des tickets ajoutés ou dont le travail change à la révision du 10/11/2026 en tiennent compte ; les autres restent celles du 27/10/2026.

### Branches, commits et PR

- Branche : `<préfixe>/<n° d'issue>-<sujet>`, en anglais, en kebab-case, créée depuis staging ; préfixes feat, fix, chore, docs, ci, test, refactor ; par exemple `feat/31-contact-form`.
- Commits et titre de PR en Conventional Commits, en anglais ; le titre de PR est celui du ticket.
- Un ticket = une branche = une PR, vers staging, avec le modèle .github/PULL_REQUEST_TEMPLATE.md (`Closes #<n° d'issue>`), relue et approuvée par quelqu'un qui ne l'a pas écrite. Deux exceptions : un ticket qui dépasse 400 lignes, livré en PR successives sur la même issue (« Taille des PR » ci-dessus) ; TK-24, en deux PR sur la même issue, de part et d'autre de la création du service par Alexandre (voir ce ticket).
- Les PR du robot de mises à jour gardent leur propre format de branche et n'ont pas d'issue.
- Aucun secret dans le dépôt : clés et adresses vivent dans les variables d'environnement des hébergeurs. Le dépôt est public, historique compris.

### Vagues de réalisation

Une vague réunit au plus deux tickets indépendants l'un de l'autre. La première vague de code, première vague qui contient un ticket d'un autre type que docs, ne contient qu'un ticket : la mise en place du front (TK-05, en W3), sur laquelle la réalisation et la relecture se rodent avant de passer à deux tickets par vague. Une vague s'ouvre quand les tickets de la vague précédente sont fusionnés dans staging et que les tâches A-xx dont elle dépend sont faites. Un ticket ne dépend que de tickets de vagues antérieures. Dans « Dépend de », une tâche A-xx suivie de « (pour finir) » se fait pendant le ticket et conditionne sa clôture ; toute autre dépendance est faite avant que le ticket commence.

### DoD commune

Une DoD de ticket qui commence par « DoD commune » ajoute ses propres critères à ceux-ci :

- Le ticket réalise ce que son champ « Couvre » annonce, et les scénarios qu'il cite sont vérifiés par les tests qu'il cite.
- La PR est relue et approuvée par quelqu'un qui ne l'a pas écrite, la CI est verte, aucune régression ; elle est fusionnée dans staging.
- Un ticket de code ou de configuration est vérifié sur la préproduction par quelqu'un qui ne l'a pas écrit (avant que la préproduction existe, sur la préversion de sa branche ou en local), puis déployé en production, par le tag v2.0.0 pour un ticket v2.0.0. Un ticket docs est signé par Alexandre ; il ne se déploie pas.
- Le README de front/ ou de back/ est à jour si une commande ou un comportement change.
- Front : seulement des jetons de la charte, une valeur brute que la charte reprend des maquettes devenant un jeton de rôle dès que le code l'emploie ; tout texte affiché avec l'apostrophe typographique ’ (charte, section 4) ; libellés d'interface marqués pour la traduction (CT-04) ; aucune valeur affichée calculée depuis la date du jour ; seulement des fonctions de la Baseline « largement disponible », sauf une amélioration facultative avec repli immédiat, qu'un navigateur sans prise en charge ignore sans erreur ni contenu perdu, comme les transitions de vue entre pages (MV-07, TK-52), exception à valider (section 7) ; aucune violation axe-core des niveaux A et AA ; aucun défilement horizontal de 320 à 2560 px ; un texte encore à fournir reste un emplacement étiqueté de son identifiant C-xx.
- Back : réglages et secrets en variables d'environnement ; aucun champ du formulaire ni aucune adresse dans les journaux.
- Aucun nom de projet, de client, d'outil interne, de dépôt ni de collègue de l'employeur, contrôlé à la relecture du diff complet, qui montre aussi ce qui est retiré.

## 2. Tickets

Les tickets sont présentés par numéro. Un numéro ne change plus une fois attribué et ne suit pas toujours l'ordre de réalisation, qui se lit dans le champ « Vague » et dans la section 3. Tickets v2.0.0 : TK-01 à TK-59, hors celui retiré le 12/11/2026, puis TK-65 et TK-66, ajoutés à la relecture pour intégrer les contenus d'Alexandre, TK-67, ajouté par la révision du 28/10/2026, et TK-68 à TK-72, ajoutés par la révision du 10/11/2026 pour reprendre le code déjà fusionné ; tickets après-v2 : TK-60 à TK-64 (section 6). Un ticket retiré garde son numéro et son titre, suivi de sa date de retrait, et une ligne de statut.

### TK-01 — Contrat d'API du formulaire de contact

- **Titre de PR** : `docs(api): write v2 contact api contract`
- **Type** : docs
- **Domaine** : docs
- **Priorité** : prio-critique
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : CT-07, CT-08, D-07
- **Dépend de** : A-01
- **Vague** : W1
- **Taille** : 0 ligne comptée (prose de Projet-V2/, hors compte ; environ 250 lignes de prose)
- **DoD** : DoD commune, et : (1) Projet-V2/Contract-API/Contract-API-V2.md décrit les trois échanges du front avec le back — demande du jeton de formulaire, envoi du message en POST, indicateur de santé — avec pour chacun la méthode, la route, les en-têtes et le format JSON de la requête et de la réponse ; (2) il fixe les longueurs maximales des cinq champs, le nom du champ piège et celui du jeton (section 5 de la conception technique) ; (3) il fixe les réponses : refus de validation avec la liste des champs en cause (SC-2.0-24, SC-2.0-25), échec réessayable qui ne dit pas quel filtre a refusé (SC-2.0-26, V-06), succès renvoyé à un envoi pris par le champ piège (CT-08) ; (4) il reprend les valeurs de D-07 qui touchent l'échange (délai minimal, âge maximal du jeton, attente du front de 90 secondes) et la règle de l'origine autorisée ; (5) il ne contient ni nom d'hôte, ni adresse e-mail, ni secret ; (6) Alexandre le signe avant toute PR qui l'implémente.
- **Résumé** : Écrit le contrat d'interface entre le front et le back (Étape 6) : routes, formats, codes de réponse et limites du flux de contact. Il précède l'API du back (TK-16, TK-18) et le client du formulaire (TK-42), qui l'implémentent sans l'interpréter.

### TK-02 — Points de charte laissés par les maquettes

- **Titre de PR** : `docs(design): settle design system points left by the mockups`
- **Type** : docs
- **Domaine** : docs
- **Priorité** : prio-low
- **Estimation** : 0,5 j
- **Version** : v2.0.0
- **Couvre** : — (charte : sections 1, 3.6, 6 et 7 ; CO-05, CO-06, CO-09, CO-13)
- **Dépend de** : —
- **Vague** : W1
- **Taille** : 0 ligne comptée (prose de Projet-V2/ et maquettes HTML, hors compte)
- **DoD** : DoD commune, et : la charte, et le catalogue design-system.html quand il est concerné, tranchent chacun de ces points dans une version révisée qu'Alexandre signe : (1) le monogramme de l'en-tête sous 480 px, dont la cible est sous 44 px dans la charte et dans le catalogue ; (2) l'alignement des intitulés de la frise horizontale ; (3) la couture du voile bas des sections d'ambiance ; (4) l'en-tête translucide sans flou, à 4.38:1, porté à 4.5:1 au moins ; (5) l'écart sur l'attente du réveil du back, « une minute » dans la conception technique contre « 90 secondes » dans la charte (CO-11), réduit à un seul libellé ; (6) la phrase de la section 1 qui annonce des maquettes « à venir » ; (7) les jetons de lueur, absents du catalogue ; (8) l'ombre de la carte soulevée, peu visible hors halo ; (9) la phrase de la section 6 selon laquelle la conception technique ne prévoit pas de politique de sécurité du contenu, alors que sa section 7 en prévoit une (écart relevé à l'estimation).
- **Résumé** : Révise la charte sur les huit points que la revue des maquettes a laissés ouverts, plus un écart avec la conception technique relevé à l'estimation. Priorité basse, mais placé en première vague parce que les jetons (TK-10) et l'en-tête (TK-27) en reprennent les valeurs.

### TK-03 — Plan d'implémentation du back

- **Titre de PR** : `docs(plan): write back-end implementation plan`
- **Type** : docs
- **Domaine** : docs
- **Priorité** : prio-high
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : CT-06, CT-07, CT-08, CT-12, CT-14, D-06, D-07
- **Dépend de** : TK-01
- **Vague** : W2
- **Taille** : 0 ligne comptée (prose de Projet-V2/, hors compte)
- **DoD** : DoD commune, et : Projet-V2/Plan-Implementation/Plan-Back-V2.md fixe : (1) l'organisation en paquets (entrée HTTP, service de contact, chaîne de filtres, interface d'expéditeur et ses adaptateurs) et les classes principales ; (2) la forme du jeton signé avec la bibliothèque standard du JDK et sa vérification ; (3) l'implémentation des compteurs en mémoire, que la conception technique laisse au plan (section 4, écarts au socle) ; (4) la liste des variables d'environnement et leurs valeurs de départ (D-07) ; (5) la politique de journalisation, sans champ du formulaire ni adresse ; (6) la correspondance entre erreurs et réponses du contrat ; (7) le plan de tests, dont la simulation du prestataire (succès, échec, délai dépassé) ; (8) l'image Docker (étapes, utilisateur, cache AOT) et la description du service chez l'hébergeur ; (9) l'adresse du back de préproduction (adresse technique de l'hébergeur ou sous-domaine) ; (10) l'outil d'analyse statique ; Alexandre le signe.
- **Résumé** : Écrit le plan d'implémentation du back (Étape 6) à partir de la conception technique et du contrat d'API. Il tranche ce que la conception laisse au plan, pour que les tickets du back n'aient plus rien à décider.

### TK-04 — Plan d'implémentation du front

- **Titre de PR** : `docs(plan): write front-end implementation plan`
- **Type** : docs
- **Domaine** : docs
- **Priorité** : prio-high
- **Estimation** : 2 j
- **Version** : v2.0.0
- **Couvre** : CT-01, CT-03, CT-04, CT-10, CT-11
- **Dépend de** : TK-01
- **Vague** : W2
- **Taille** : 0 ligne comptée (prose de Projet-V2/, hors compte)
- **DoD** : DoD commune, et : Projet-V2/Plan-Implementation/Plan-Front-V2.md fixe : (1) l'arborescence de front/ et la forme d'implémentation des jetons et des composants de la charte (charte, section 9) ; (2) la couche d'accès au contenu, la forme des fichiers de contenu — dont la vignette d'un projet (choix C2) et les étapes de la méthode (MV-08), que la section 5 de la conception technique ne prévoit pas — et l'outil du contrôle du contenu ; (3) le marquage des libellés pour la traduction ; (4) la technique de chaque motif de mouvement, sachant que les maquettes sont un prototype dont le code n'est pas repris tel quel, dont les transitions entre pages par les transitions de vue du navigateur et leur disponibilité réelle dans les navigateurs à couvrir (R-10) ; (5) la lisibilité de la fenêtre « profil.ts » par les lecteurs d'écran (charte, MV-03) ; (6) la variante « projet inexistant » de la page introuvable ; (7) la configuration de l'adresse du back par environnement ; (8) le serveur local qui sert le build avec les règles de l'hébergeur pour les tests de bout en bout ; (9) la politique de sécurité du contenu face au pré-rendu, à l'hydratation et au petit script de tête ; (10) l'outil d'analyse statique ; Alexandre le signe.
- **Résumé** : Écrit le plan d'implémentation du front (Étape 6) à partir de la conception technique, du parcours d'écrans, de la charte et des maquettes. Il tranche les techniques que les documents signés renvoient au plan front, mouvement compris.

### TK-05 — Mise en place du front

- **Titre de PR** : `chore(front): scaffold angular 22 app with static prerendering`
- **Type** : chore
- **Domaine** : front
- **Priorité** : prio-critique
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : CT-01, CT-02, CT-04, D-01
- **Dépend de** : TK-04
- **Vague** : W3
- **Taille** : ≈ 150 lignes écrites à la main (hors fichiers produits par l'outil de création de projet d'Angular, commités tels quels dans un commit à part, et hors lockfile)
- **DoD** : DoD commune, et : (1) front/ contient une application Angular 22 en composants autonomes, sans zone, avec signaux, qui produit au build des pages statiques pré-rendues ; (2) la version de Node suit CT-02 — Node 26 si elle est passée en LTS à la date du ticket, sinon Node 24 — et est fixée dans le dépôt ; (3) chaque adresse du parcours d'écrans (/, /parcours, /competences, /experience, /methode, /projets, /projets/portfolio, /cv, /contact, /mentions-legales) existe avec une page provisoire étiquetée, et le build produit un document HTML par adresse ; (4) la langue de la page est déclarée et l'internationalisation intégrée d'Angular est configurée, langue source française, aucune autre langue ; (5) Vitest tourne avec un premier test ; (6) le README de front/ donne les commandes d'installation, de build et de test.
- **Résumé** : Crée l'application front dans front/, aux versions de CT-02, en sortie statique pré-rendue, avec une page provisoire par adresse du plan du site. C'est le socle de tous les tickets du front.

### TK-06 — Mise en place du back

- **Titre de PR** : `chore(back): scaffold spring boot 4 app on java 25`
- **Type** : chore
- **Domaine** : back
- **Priorité** : prio-critique
- **Estimation** : 0,5 j
- **Version** : v2.0.0
- **Couvre** : CT-02, D-01
- **Dépend de** : TK-03
- **Vague** : W4
- **Taille** : ≈ 100 lignes écrites à la main (hors fichiers produits par le générateur de projets Spring Boot, commités tels quels dans un commit à part)
- **DoD** : DoD commune, et : (1) back/ contient une application Spring Boot dans la dernière mineure de Spring Boot 4 à la date du ticket, sur Java 25, construite par Maven ; (2) seules les briques de la section 4 de la conception technique sont présentes (Spring MVC, validation, Actuator) : ni persistance, ni authentification, ni Testcontainers ; (3) un test vérifie que le contexte démarre ; (4) le build vérifie qu'il tourne sur Java 25 ; (5) le README de back/ donne les commandes de build et de test et la version de Java exigée.
- **Résumé** : Crée l'application back dans back/ sur le socle réduit décidé le 13/10/2026. Elle ne fait encore rien d'autre que démarrer.

### TK-07 — Intégration continue du front et du back

- **Titre de PR** : `ci: add pull request checks for front and back`
- **Type** : ci
- **Domaine** : infra
- **Priorité** : prio-critique
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : CT-09, CT-10
- **Dépend de** : TK-05, TK-06, A-02 (pour finir)
- **Vague** : W5
- **Taille** : ≈ 140 lignes
- **DoD** : DoD commune, et : (1) sur chaque PR vers staging et vers main, GitHub Actions exécute pour le front l'installation verrouillée des dépendances, l'analyse statique, les tests unitaires, l'extraction des libellés à traduire (CT-04) et le build pré-rendu, et pour le back l'analyse statique, les tests et le paquetage sur Java 25 ; (2) la CI n'utilise aucun secret ; (3) ces contrôles sont exigés avant fusion par la protection de staging et de main (A-02) ; (4) une branche d'essai qui casse un test donne une CI rouge, constatée dans la PR.
- **Résumé** : Met en place les contrôles bloquants de chaque PR, pour le front comme pour le back. Les tickets suivants y ajoutent leurs tests (bout en bout, contenu, image Docker, performance).

### TK-08 — Retrait de l'ancien site

- **Titre de PR** : `chore: remove legacy react site`
- **Type** : chore
- **Domaine** : front
- **Priorité** : prio-medium
- **Estimation** : 0,5 j
- **Version** : v2.0.0
- **Couvre** : — (conception technique, section 10 : impact sur l'existant ; décision du 13/10/2026)
- **Dépend de** : TK-05
- **Vague** : W4
- **Taille** : 0 ligne comptée (PR qui ne fait que supprimer le dossier my-portfolio/ : environ 1 780 lignes retirées hors lockfile et 13 fichiers binaires, hors de la limite des 400 lignes par décision d'Alexandre du 27/10/2026, écrite en section 1 ; elle ne se découpe pas)
- **DoD** : DoD commune, et : (1) le dossier my-portfolio/ n'existe plus sur staging, et la PR ne touche à rien d'autre ; (2) l'ancien site reste consultable au tag v1.0.0, et main n'est pas modifié : la production reste l'ancien site jusqu'à la v2.0.0 ; (3) les alertes de dépendances qui portent sur my-portfolio/ se ferment quand le dossier disparaît de la branche par défaut du dépôt : à constater après la fusion, ou à la v2.0.0 si la branche par défaut est main.
- **Résumé** : Retire l'ancien site React de staging, dans un ticket à part et après la mise en place du front, comme décidé le 13/10/2026. Sa matière reste lisible au tag v1.0.0.

### TK-09 — Robot de mises à jour des dépendances

- **Titre de PR** : `ci: configure dependency update bot`
- **Type** : ci
- **Domaine** : infra
- **Priorité** : prio-medium
- **Estimation** : 0,5 j
- **Version** : v2.0.0
- **Couvre** : CT-02, CT-09
- **Dépend de** : TK-07, A-02
- **Vague** : W6
- **Taille** : ≈ 50 lignes
- **DoD** : DoD commune, et : (1) le robot de mises à jour du dépôt (Dependabot) propose les mises à jour de versions pour npm (front/), Maven (back/) et GitHub Actions, et les mises à jour de sécurité pour les mêmes écosystèmes (section 9 de la conception technique) ; l'écosystème Docker s'ajoute avec l'image (TK-14) ; (2) ses PR ciblent staging et passent par la CI de TK-07 ; (3) la fréquence et le regroupement retenus sont écrits dans le fichier de configuration, avec leur raison.
- **Résumé** : Configure le robot de mises à jour qui prépare l'entretien des deux ans visés. Ses PR sont validées par la CI comme les autres.

### TK-10 — Jetons de la charte

- **Titre de PR** : `feat(front): add design system tokens`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-high
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : — (charte, section 3 : jetons ; section 5 : jetons de mise en page)
- **Dépend de** : TK-02, TK-05
- **Vague** : W6
- **Taille** : ≈ 250 lignes
- **DoD** : DoD commune, et : (1) chaque jeton des sections 3 et 5 de la charte existe sous son nom (minuscules, tirets), avec les valeurs de la palette PA-02 Lagune et celles que TK-02 a révisées ; (2) un test unitaire vérifie que chaque jeton de la liste de la charte est défini ; (3) les durées, délais, distances et courbes du mouvement sont des jetons ; (4) thème sombre seulement ; (5) les points de rupture (600, 900, 1200 et 1600 px) sont utilisables par tout composant.
- **Résumé** : Traduit les jetons de la charte dans le front, dans la forme fixée par le plan front. Aucun composant n'utilisera ensuite de valeur brute.

### TK-11 — Typographie, polices et mise en page de base

- **Titre de PR** : `feat(front): add typography, self-hosted fonts and base layout`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-high
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : CT-12 (aucune police chez un tiers) ; charte, sections 4, 5 et 8
- **Dépend de** : TK-10
- **Vague** : W7
- **Taille** : ≈ 220 lignes (hors fichiers de polices, binaires)
- **DoD** : DoD commune, et : (1) Bricolage Grotesque, Hanken Grotesk et JetBrains Mono sont servies par le site lui-même, limitées aux caractères utiles, avec leur licence SIL OFL 1.1 ; aucune police n'est demandée à un tiers ; (2) l'échelle typographique de la section 4 et les tailles minimales de la section 8 (16 px pour le texte courant, rien sous 14 px sauf les étiquettes en capitales à 12 px) ; (3) l'anneau de focus de la charte sur tout élément focalisable ; (4) conteneurs, marges et gouttières par tranche (section 5) : aucune page provisoire ne défile horizontalement de 320 à 2560 px, ni au zoom à 200 % ; (5) un seul titre de niveau 1 par page et un fond explicite.
- **Résumé** : Pose la typographie, les polices auto-hébergées et la grille de la charte. Les pages provisoires prennent l'allure du site, sans composant encore.

### TK-12 — Modèle de contenu et fichiers de contenu

- **Titre de PR** : `feat(front): add typed content model and french content files`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-critique
- **Estimation** : 2 j
- **Version** : v2.0.0
- **Couvre** : CT-03, CT-04, D-12
- **Dépend de** : TK-05
- **Vague** : W7
- **Taille** : ≈ 330 lignes
- **DoD** : DoD commune, et : (1) le modèle typé reprend chaque entité de la section 5 de la conception technique — profil, introductions de section, étapes du parcours, expérience en alternance, compétences, méthode, projet, textes fixes — plus ce que les maquettes ont ajouté, dans la forme fixée par le plan front : la vignette facultative d'un projet (choix C2) et les étapes de la méthode, chacune avec son intitulé (MV-08) ; (2) les fichiers de contenu sont rangés par langue, seul le français rempli ; chaque texte à fournir y est un emplacement étiqueté de son identifiant (C-01 à C-10) ; le projet portfolio existe, avec le lien vers son code source public ; (3) la couche d'accès typée lit ces fichiers au build, jamais depuis le back ; (4) un projet est un fichier et un dossier d'images, et la liste est dérivée des fichiers, triée par rang ; (5) textes en texte brut, jamais de HTML ; (6) tests unitaires de la couche d'accès : tri par rang, champs facultatifs absents, langue.
- **Résumé** : Crée le modèle typé du contenu et les fichiers français, remplis d'emplacements étiquetés en attendant les contenus d'Alexandre. Tous les écrans lisent leur contenu par cette couche.

### TK-13 — Hébergement du front et préversions

- **Titre de PR** : `chore(infra): configure static hosting with real 404 and security headers`
- **Type** : chore
- **Domaine** : infra
- **Priorité** : prio-high
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : CT-01, CT-05, D-02, MF-04
- **Dépend de** : TK-05, A-03
- **Vague** : W8
- **Taille** : ≈ 120 lignes
- **DoD** : DoD commune, et : (1) la configuration versionnée publie le build sur les ressources statiques des Workers de Cloudflare, sans script Worker : rien de propre à l'hébergeur n'entre dans le code ; (2) une adresse inconnue reçoit la page 404 la plus proche avec le statut 404 (page provisoire jusqu'à TK-31) ; (3) le fichier d'en-têtes pose la politique de sécurité du contenu (ressources du site et adresse du back seulement), dont la compatibilité avec les scripts et styles produits par le pré-rendu et l'hydratation est vérifiée, l'interdiction d'affichage en cadre, l'interdiction de deviner les types de fichiers, la politique de référent, la politique des permissions et HTTPS obligatoire (section 7) ; (4) chaque branche a sa préversion et staging alimente la préproduction du front ; (5) chaque adresse du plan du site ouverte directement sur une préversion, puis rechargée, affiche la même page (MF-04) ; (6) la configuration ne contient aucun secret.
- **Résumé** : Branche le front sur son hébergeur, avec une vraie réponse 404, les en-têtes de sécurité et une préversion par branche. Les liens directs deviennent vérifiables en conditions réelles.

### TK-14 — Image Docker du back

- **Titre de PR** : `chore(back): add docker image with jvm aot cache`
- **Type** : chore
- **Domaine** : back
- **Priorité** : prio-high
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : CT-06, CT-09, D-04
- **Dépend de** : TK-07
- **Vague** : W8
- **Taille** : ≈ 120 lignes
- **DoD** : DoD commune, et : (1) back/ contient un Dockerfile en plusieurs étapes sur une JRE 25, exécuté par un utilisateur sans droits d'administration, l'application extraite et démarrée avec le cache AOT de la JVM ; (2) la CI construit l'image sur chaque PR qui touche back/ ; (3) à chaque tag, la CI publie l'image dans le registre de conteneurs de GitHub avec son jeton éphémère, sans secret stocké ; (4) le temps de démarrage est mesuré dans un conteneur limité à 0,1 CPU et 512 Mo, comme l'instance gratuite, avec et sans cache AOT, et noté dans le README du back ; (5) le robot de mises à jour suit l'écosystème Docker de back/ ; (6) le back ne connaît de son hébergeur que le port d'écoute.
- **Résumé** : Rend le back portable en image Docker et mesure tôt son démarrage à froid, le risque principal de l'instance gratuite (D-04).

### TK-15 — Composants bouton et lien

- **Titre de PR** : `feat(front): add button and link components`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-high
- **Estimation** : 2 j
- **Version** : v2.0.0
- **Couvre** : CO-01, CO-02, MF-17 (lien externe)
- **Dépend de** : TK-11
- **Vague** : W9
- **Taille** : ≈ 320 lignes
- **DoD** : DoD commune, et : (1) CO-01 bouton : variantes primaire, secondaire, discret, icône seule et compact ; états repos, survol, focus, appuyé et désactivé (l'état « en cours » vient avec TK-19) ; bouton natif pour une action, lien pour une navigation ; (2) CO-02 lien : variantes dans le texte, discret, d'action, de navigation et externe ; un lien externe s'ouvre dans un nouvel onglet, sans accès de la page ouverte à la page d'origine, et l'annonce par son icône et un texte masqué ; la page courante est signalée par un attribut ; (3) cibles de 44 px, anneau de focus, jetons seulement ; (4) tests unitaires des variantes et des attributs d'accessibilité.
- **Résumé** : Crée les deux composants d'action de la charte, réutilisés par tous les écrans. Le mouvement des liens d'action (flèche, soulignement) vient avec TK-51.

### TK-16 — API de contact : validation et point d'envoi

- **Titre de PR** : `feat(back): add contact message endpoint with validation`
- **Type** : feature
- **Domaine** : back
- **Priorité** : prio-critique
- **Estimation** : 2 j
- **Version** : v2.0.0
- **Couvre** : CT-08, MF-16, SC-2.0-24, SC-2.0-25
- **Dépend de** : TK-01, TK-07, TK-67
- **Vague** : W9
- **Taille** : ≈ 380 lignes
- **DoD** : DoD commune, et : (1) la route d'envoi du contrat reçoit le message en POST et le valide à nouveau, sans faire confiance au navigateur : champs obligatoires, format de l'adresse, longueurs maximales du contrat, espaces de bord retirés, aucun retour à la ligne dans le nom, le prénom et le sujet ; (2) un message invalide est refusé avec les champs en cause, au format du contrat, et rien n'est transmis (SC-2.0-24, SC-2.0-25) ; (3) la route d'envoi est servie derrière le socle HTTP de TK-67 : une origine refusée y reçoit le 403 du contrat ; (4) l'envoi passe par l'interface d'expéditeur, avec un adaptateur de développement qui n'envoie rien ; (5) tests par tranche : chaque règle de validation, origine refusée, message valide transmis une seule fois à l'expéditeur ; (6) les journaux ne contiennent ni champ du formulaire ni adresse.
- **Résumé** : Crée le point d'entrée du back, sur le socle HTTP posé par TK-67 : il revalide le message et le confie à l'interface d'expéditeur. La protection et l'envoi réel s'y branchent ensuite (TK-22, TK-20).

### TK-17 — Composants de texte

- **Titre de PR** : `feat(front): add badge, label, section header and key-value list components`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-high
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : CO-03, CO-04, CO-16, CO-17
- **Dépend de** : TK-11
- **Vague** : W10
- **Taille** : ≈ 300 lignes
- **DoD** : DoD commune, et : (1) CO-03 pastille : variantes neutre, teintées, à point lumineux et à contour, la seule permise sur le verre et sur un halo ; (2) CO-04 étiquette : discrète, accent, numérotée, à puce lumineuse, 12 px au moins ; (3) CO-16 en-tête de section : étiquette numérotée, vrai titre de la hiérarchie, chapô facultatif plafonné à 68 caractères ; (4) CO-17 liste clé-valeur : liste de définitions, variantes en ligne et en tableau, valeur de date ou de période en chasse fixe, paire retirée quand la valeur manque ; (5) tests unitaires des variantes et de la structure accessible.
- **Résumé** : Crée les quatre composants de texte de la charte. Le filet animé de l'en-tête de section vient avec TK-51.

### TK-18 — Jeton de formulaire

- **Titre de PR** : `feat(back): add signed and timestamped form token`
- **Type** : feature
- **Domaine** : back
- **Priorité** : prio-critique
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : CT-08, D-07
- **Dépend de** : TK-01, TK-07
- **Vague** : W10
- **Taille** : ≈ 230 lignes
- **DoD** : DoD commune, et : (1) la route du contrat délivre un jeton signé et horodaté, avec la bibliothèque standard du JDK, sans dépendance ; (2) le secret de signature vient d'une variable d'environnement et reste stable : un jeton délivré avant une mise en veille reste valable après le réveil ; (3) la vérification distingue jeton absent, falsifié, trop récent (moins de 3 secondes) et expiré (plus de 2 heures), seuils réglables par variable d'environnement (D-07) ; (4) tests unitaires de chaque cas ; (5) aucun secret dans le dépôt ni dans les journaux.
- **Résumé** : Délivre et vérifie le jeton de formulaire de CT-08, qui sert aussi à réveiller le back pendant que le visiteur écrit.

### TK-19 — Composants de formulaire et d'état

- **Titre de PR** : `feat(front): add form field, status message and activity indicator components`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-high
- **Estimation** : 2 j
- **Version** : v2.0.0
- **Couvre** : CO-01 (état en cours), CO-10, CO-11, CO-15
- **Dépend de** : TK-15
- **Vague** : W11
- **Taille** : ≈ 330 lignes
- **DoD** : DoD commune, et : (1) CO-10 champ : libellé visible et lié ; variantes ligne, e-mail (clavier adapté) et zone de texte ; états repos, survol, focus, rempli, champ manquant, e-mail invalide et désactivé pendant l'envoi ; message d'erreur lié au champ, champ marqué invalide ; attribut required ou aria-required sur un champ obligatoire ; (2) CO-11 message d'état : variantes information, envoi en cours, succès, échec réessayable avec « Réessayer », attention avec un lien vers une autre voie ; succès et attente annoncés poliment, échec annoncé immédiatement ; aucune disparition automatique ; (3) CO-15 indicateur d'activité, décoratif pour les lecteurs d'écran, fixe quand le mouvement est réduit ; (4) état « en cours » du bouton CO-01 ; (5) tests unitaires des états et des attributs d'accessibilité.
- **Résumé** : Crée les composants du formulaire de contact et des messages d'état.

### TK-20 — Adaptateur d'envoi Brevo

- **Titre de PR** : `feat(back): add brevo mail sender adapter`
- **Type** : feature
- **Domaine** : back
- **Priorité** : prio-critique
- **Estimation** : 2 j
- **Version** : v2.0.0
- **Couvre** : CT-07, CT-12, D-05, D-07, MF-16, SC-2.0-23, SC-2.0-26
- **Dépend de** : TK-16
- **Vague** : W11
- **Taille** : ≈ 300 lignes
- **DoD** : DoD commune, et : (1) l'adaptateur appelle l'API HTTPS de Brevo par le client HTTP intégré à Spring, sans kit propre au prestataire, avec un délai maximal de 10 secondes réglable (D-07) ; (2) l'e-mail part d'une adresse d'expédition du domaine du site vers la boîte d'Alexandre (D-05), avec pour adresse de réponse celle du visiteur, pour objet un préfixe fixe suivi du sujet et pour corps les cinq champs en texte brut ; adresses et clé sont lues dans des variables d'environnement ; (3) le back n'écrit jamais à l'adresse saisie ; (4) succès : réponse de succès (SC-2.0-23) ; échec ou délai dépassé : échec réessayable, rien de stocké ni de réessayé en arrière-plan (SC-2.0-26) ; (5) tests avec le prestataire simulé par l'outillage de test de Spring : succès, échec, délai dépassé et contenu exact de l'appel ; (6) les journaux enregistrent l'issue, sans champ ni adresse.
- **Résumé** : Remet le message à Alexandre par le prestataire d'envoi, isolé derrière l'interface d'expéditeur : changer de prestataire ne touchera que cet adaptateur.

### TK-21 — Banc de tests de bout en bout et d'accessibilité

- **Titre de PR** : `test(front): add end-to-end and accessibility test bench`
- **Type** : test
- **Domaine** : front
- **Priorité** : prio-high
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : CT-10
- **Dépend de** : TK-07, TK-13
- **Vague** : W12
- **Taille** : ≈ 200 lignes
- **DoD** : DoD commune, et : (1) Playwright tourne sur Chromium, Firefox et WebKit, en profil ordinateur et en émulation de téléphone, sur le build pré-rendu servi en local avec les règles de l'hébergeur (page 404 la plus proche et statut 404, en-têtes) ; (2) un back simulé répond selon le contrat ; (3) axe-core contrôle chaque page sur les règles WCAG de niveaux A et AA et fait échouer le test à la première violation ; (4) un contrôle commun vérifie, sur chaque adresse du plan du site, l'absence de défilement horizontal aux largeurs 320, 600, 900, 1200, 1600 et 2560 px et l'absence de requête vers un tiers ; (5) la CI les exécute sur chaque PR qui touche front/ ; (6) les pages provisoires passent.
- **Résumé** : Installe les tests de bout en bout et d'accessibilité dans la CI. Chaque écran y ajoutera ensuite ses propres scénarios.

### TK-22 — Chaîne de filtres contre les messages indésirables

- **Titre de PR** : `feat(back): add anti-spam filter chain`
- **Type** : feature
- **Domaine** : back
- **Priorité** : prio-critique
- **Estimation** : 2 j
- **Version** : v2.0.0
- **Couvre** : CT-08, CT-12, D-06, D-07, MF-16
- **Dépend de** : TK-16, TK-18
- **Vague** : W12
- **Taille** : ≈ 360 lignes
- **DoD** : DoD commune, et : (1) le service de contact applique, comme filtres indépendants : champ piège, jeton (signature, délai minimal, âge maximal), limite de 5 envois par heure et par adresse IP, plafond de 50 envois par période d'éveil ; seuils réglables par variable d'environnement (D-07) ; (2) champ piège rempli : réponse de succès, aucun envoi ; jeton absent, falsifié, trop récent ou expiré, limite ou plafond atteints : échec réessayable, aucun envoi ; (3) l'adresse IP est lue dans l'en-tête que pose le proxy de l'hébergeur, configurable, jamais dans un en-tête que le visiteur peut forger ; elle n'est gardée qu'en mémoire, effacée à l'expiration de sa fenêtre d'une heure ; (4) un test par filtre (section 8 de la conception technique) : champ piège, jeton absent, falsifié, trop récent et expiré, sixième envoi dans l'heure, plafond atteint, message valide envoyé une seule fois ; (5) les journaux nomment le filtre qui refuse, sans donnée personnelle.
- **Résumé** : Protège le formulaire par les couches natives retenues (D-06), organisées pour qu'une couche s'ajoute plus tard sans toucher au reste.

### TK-23 — Socle du mouvement

- **Titre de PR** : `feat(front): add motion foundation with reduced motion support`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-medium
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : — (charte, section 6 : réduction des animations, contenu visible sans script ; conception technique, section 3)
- **Dépend de** : TK-10, TK-13, TK-21
- **Vague** : W13
- **Taille** : ≈ 180 lignes
- **DoD** : DoD commune, et : (1) un petit script de tête, synchrone, pose la classe mv-actif sur l'élément html, seulement si le visiteur n'a pas demandé à réduire les animations ; (2) le script de mouvement, chargé en différé, pose mv-pret quand il est prêt ; si mv-pret manque 3 secondes après, mv-actif est retiré et tout s'affiche ; (3) les états cachés n'existent que sous mv-actif : sans JavaScript, ou avec le script de mouvement bloqué ou en erreur, tout le contenu est visible (tests de bout en bout dans ces trois cas) ; (4) la politique de sécurité du contenu autorise le petit script de tête par son empreinte, sans rouvrir les scripts en ligne en général ; (5) le défilement doux vers une ancre est coupé quand les animations sont réduites ; (6) la technique est celle du plan front : aucun code des maquettes n'est repris tel quel.
- **Résumé** : Pose le mécanisme qui garantit qu'aucune animation ne cache jamais le contenu, ni sans script ni avec les animations réduites. Les motifs MV-01 à MV-10 s'y branchent.

### TK-24 — Back en préproduction

- **Titre de PR** : `chore(infra): deploy back-end preproduction service`
- **Type** : chore
- **Domaine** : infra
- **Priorité** : prio-critique
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : CT-06, CT-09, D-04, D-05
- **Dépend de** : TK-13, TK-14, TK-20, TK-22, A-05, A-27, A-04 (pour finir)
- **Vague** : W13
- **Taille** : ≈ 60 lignes
- **DoD** : DoD commune, et : (1) la description du service du back est versionnée dans le dépôt, si l'hébergeur le permet (CT-09) ; (2) une instance gratuite de Render, région Francfort, branchée sur staging, se déploie seulement après une CI verte ; (3) secrets et réglages vivent dans les variables d'environnement de l'hébergeur (A-04), aucun dans le dépôt ; (4) l'indicateur de santé répond sans détail ; un jeton est délivré à l'origine de la préproduction du front et refusé à une autre origine ; (5) l'en-tête qui porte l'adresse IP du visiteur chez l'hébergeur est constaté et configuré pour TK-22 ; (6) le délai entre le réveil, après 15 minutes sans trafic, et la réponse est mesuré et noté dans le README du back ; au-delà de 60 secondes, D-04 revient à Alexandre (A-15) ; (7) rien ne garde le back éveillé ; (8) l'envoi réel depuis la préproduction se vérifie dans la passe manuelle (TK-58), une fois le domaine d'envoi authentifié (A-10).
- **Résumé** : Déploie le back en préproduction dès que sa chaîne de contact est complète, pour mesurer tôt le réveil réel de l'instance gratuite. Il compte deux PR, de part et d'autre de la création du service par Alexandre, exception à la règle « Un ticket = une branche = une PR » (section 1), au même titre qu'un ticket de plus de 400 lignes : la première PR apporte back/render.yaml sans l'en-tête de l'adresse IP et renvoie à l'issue sans la fermer ; A-04 crée le service après sa fusion ; la seconde PR, qui porte le titre du ticket, écrit l'en-tête retenu et le README, et ferme l'issue. Les deux branches prennent le même numéro d'issue.

### TK-25 — Composant fenêtre factice

- **Titre de PR** : `feat(front): add mock window component`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-high
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : CO-12
- **Dépend de** : TK-11
- **Vague** : W14
- **Taille** : ≈ 220 lignes
- **DoD** : DoD commune, et : (1) CO-12 : barre à trois points avec un titre en chasse fixe ou une barre d'adresse factice ; variantes code (texte sélectionnable, retour à la ligne plutôt que défilement horizontal), navigateur et capture (image au format 16:10, texte alternatif, dimensions déclarées) ; (2) sans contenu, la fenêtre n'est pas affichée : jamais de cadre vide ; (3) une fenêtre qui ne fait que répéter une information déjà affichée peut être déclarée décorative, masquée aux lecteurs d'écran ; (4) tests unitaires des variantes et du cas sans contenu.
- **Résumé** : Crée la fenêtre factice qui porte « profil.ts » sur l'accueil, la vignette d'un projet, les captures et les illustrations de la méthode.

### TK-26 — Composants carte et arrière-plan d'ambiance

- **Titre de PR** : `feat(front): add card and ambient background components`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-high
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : CO-05, CO-13
- **Dépend de** : TK-15, TK-17
- **Vague** : W14
- **Taille** : ≈ 260 lignes
- **DoD** : DoD commune, et : (1) CO-05 carte : variantes verre, pleine et interactive (un seul lien, porté par le titre ; le lien d'action du pied est décoratif) ; états repos, survol (filet d'accent), focus (anneau autour de toute la carte) et sans contenu facultatif (la carte se resserre, aucune zone vide) ; le soulèvement et la lueur viennent avec TK-51 ; (2) CO-13 arrière-plan d'ambiance : variantes accueil, section et sobre ; halos en coins opposés, jamais fixés à la fenêtre, purement décoratifs ; (3) une pastille posée sur le verre prend la variante à contour ; (4) la règle « une carte interactive ne se pose jamais sur un halo » est écrite dans la documentation du composant et vérifiée à la relecture des écrans ; (5) tests unitaires.
- **Résumé** : Crée la carte et la lumière de fond de la charte, avant les écrans qui les assemblent.

### TK-27 — En-tête, navigation et lien d'évitement

- **Titre de PR** : `feat(front): add header, navigation and skip link`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-critique
- **Estimation** : 2 j
- **Version** : v2.0.0
- **Couvre** : EC-00, MF-02, MF-03, MF-04, SC-2.0-02, SC-2.0-03, SC-2.0-04, SC-2.0-05, CO-06, CO-14, V-11
- **Dépend de** : TK-02, TK-12, TK-15, TK-21, TK-23, TK-68, TK-70, TK-71
- **Vague** : W18
- **Taille** : ≈ 700 lignes ; au-delà de 400, PR successives sur la même issue (section 1)
- **DoD** : DoD commune, et : (1) sur toutes les pages, page introuvable comprise, l'en-tête collant porte la marque (le nom, lien vers le haut de la page principale ; sous 480 px le monogramme « AM », décoratif, le nom restant annoncé aux lecteurs d'écran, lien élargi à 44 px), la navigation (« Accueil », « Parcours », « Compétences », « Expérience », « Méthode » selon le choix C8, « Projets »), liens du routeur vers / avec l'ancre de leur section, sauf « Accueil », et l'entrée « Contact », bouton primaire compact, distinguée et toujours visible, jamais dans un menu ; (2) services/navigation (PF-06) donne l'entrée signalée : sur la page principale, celle de la section lue — la dernière section dont le haut a passé 40 % de la hauteur de la fenêtre, l'accueil avant la première, la dernière section dont le haut est dans la fenêtre quand la page ne peut plus défiler —, avec aria-current="location", suivie par le DefilementService de TK-23 ; sur une page à part, celle des données de la route, avec aria-current="page" : « Projets » sur une fiche, « Contact » sur la page de contact (choix C9), aucune sur les mentions légales et la page introuvable ; le trait d'accent est un élément rendu dans la seule entrée courante ; (3) sur la page principale, une entrée, le nom ou « Accueil » fait défiler jusqu'à la section ou en haut, sans étape d'historique (replaceUrl) ; depuis une page à part, elle mène à la page principale, à la section, d'un coup ; services/navigation garde le chemin de la dernière navigation finie, et l'initialiseur du défilement posé par TK-70 est complété selon le tableau de PF-06 ; (4) une fois la page chargée, l'adresse affichée est toujours celle de la section lue (/#parcours…, / pour l'accueil), remplacée sans étape d'historique, par History.replaceState en gardant history.state, dès qu'elle diffère, y compris juste après l'ouverture sur un élément intérieur d'une section ; jamais Router.navigate, Location.go, location.hash ni location.replace ; une ancre qui ne nomme rien (V-11), à l'ouverture, laisse la page en haut, sans message d'erreur, et disparaît de l'adresse ; (5) navigation complète à partir de 1200 px, compacte en dessous ; fond à 74 % avec flou à partir de 900 px, à 92 % en dessous et quand le flou n'est pas pris en charge (charte révisée par TK-02) ; l'en-tête n'entre jamais dans une animation d'arrivée ; (6) le lien d'évitement est le premier élément focalisable et mène au contenu principal ; une fois l'application démarrée, son clic est intercepté : le contenu principal défile sous l'en-tête et reçoit le focus, sans changer l'adresse ni l'historique ; régions d'en-tête, de navigation et de contenu nommées ; (7) tests unitaires de PF-06 : section lue, entrée courante et son attribut, remplacement de l'adresse (jamais pushState, rien avant la fin du chargement, rien quand l'adresse est déjà la bonne, rien hors de la page principale), tableau de défilement, replaceUrl sur les liens de la page principale et sur eux seuls ; l'ancre qui ne nomme rien visée depuis une autre page, dont le bout en bout vient avec TK-31 ; (8) bout en bout : sur la page principale, chaque entrée fait défiler jusqu'à sa section, sous l'en-tête, avec aria-current="location", l'adresse /#section et history.length inchangé, et le retour arrière quitte la page principale au lieu de remonter ses sections ; au défilement, l'entrée signalée et l'adresse suivent la lecture, « Accueil » et / en haut, la dernière section signalée au bout de la page sur un écran de 2560 px de haut ; depuis chaque page à part, « Contact » et chaque entrée mènent en un clic à leur cible (SC-2.0-02, SC-2.0-03, SC-2.0-04) ; une section ouverte directement puis rechargée (SC-2.0-05), une ancre d'élément intérieur, une ancre de section visée depuis une autre page et une ancre qui ne nomme rien à l'ouverture, avant et après le démarrage de l'application ; le retour en haut d'un coup prouvé par un vrai lien ; sans script, les liens mènent aux sections et l'accueil reste signalé ; aucune entrée signalée sur /mentions-legales ni sur une adresse inconnue.
- **Résumé** : Crée la partie haute du cadre commun (EC-00) : le contact à un clic depuis toutes les pages, et une navigation qui fait défiler la page principale, signale la section lue et fait suivre la lecture à l'adresse, sans étape d'historique. Le menu replié et le pied de page suivent (TK-29, TK-30).

### TK-28 — Contrôle automatique du contenu

- **Titre de PR** : `test(front): add automated content checks`
- **Type** : test
- **Domaine** : front
- **Priorité** : prio-high
- **Estimation** : 2 j
- **Version** : v2.0.0
- **Couvre** : CT-03, CT-10, MF-18, SC-2.0-28
- **Dépend de** : TK-07, TK-12, TK-69
- **Vague** : W17
- **Taille** : ≈ 550 lignes ; au-delà de 400, PR successives sur la même issue (section 1)
- **DoD** : DoD commune, et : (1) un contrôle exécuté sur chaque PR fait échouer la CI quand une règle de la section 5 de la conception technique, détaillée par PF-02, n'est pas tenue : champs obligatoires, identifiants uniques et bien formés, images présentes, chaque capture avec son texte alternatif, liens en HTTPS, renvoi de la méthode vers un projet existant, ordre du parcours, dates complètes et cohérentes, tournures qui se périment (âge, « actuellement », « depuis » suivi d'une date, d'un nombre ou d'une durée, comme « depuis 2023 », « depuis 3 ans » ou « depuis peu », « il y a », « en ce moment », « aujourd’hui », « cette année »), chacune trouvée avec l'une ou l'autre apostrophe ; « depuis » suivi d'autre chose passe tel quel, sans exception, comme « Reconversion depuis la restauration » (décision d'Alexandre du 12/11/2026) ; (2) une apostrophe droite dans un texte du contenu est une faute, adresses exclues : tout texte affiché emploie ’ (décision d'Alexandre du 12/11/2026) ; (3) la règle d'analyse statique qui interdit une valeur calculée depuis la date du jour est déjà posée par TK-07 (lecture acceptée le 28/10/2026) : ce ticket la constate sans la refaire ; (4) deux modes : sur une PR vers staging, les emplacements étiquetés sont signalés sans bloquer ; sur la PR de staging vers main, ils bloquent ; (5) aucune liste de termes interdits liés à l'employeur n'est commitée : cette règle reste à la relecture des PR (section 5) ; (6) tests du contrôle : un contenu fautif par règle, dont un par tournure de la liste et « depuis » suivi d'une date, d'un nombre et d'une durée, et un contenu correct, dont « Reconversion depuis la restauration » et un textes-legaux.json qui dit la durée de conservation de D-10 (« au plus trois ans après le dernier échange »), accepté en mode main.
- **Résumé** : Automatise les règles du contenu, dont « rien qui se périme » (MF-18) et l'apostrophe typographique. Une relecture humaine reste nécessaire, et elle est prévue dans la passe manuelle (TK-58).

### TK-29 — Menu replié

- **Titre de PR** : `feat(front): add collapsed navigation menu`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-high
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : EC-00, MF-03, MF-06, SC-2.0-04, SC-2.0-09, CO-07
- **Dépend de** : TK-27
- **Vague** : W19
- **Taille** : ≈ 450 lignes ; au-delà de 400, PR successives sur la même issue (section 1)
- **DoD** : DoD commune, et : (1) sous 1200 px, un bouton icône « Menu », au libellé masqué, ouvre un panneau qui liste les mêmes entrées que la navigation complète, avec les mêmes liens et la même règle d'historique (PF-06) ; le contact reste hors du menu, visible à côté ; (2) le menu repose sur details et summary : il marche avant le démarrage de l'application et sans script ; le bouton annonce son état et le panneau qu'il commande ; Échap ferme le panneau et rend le focus au bouton ; un clic hors du panneau le ferme toujours ; ce n'est pas une fenêtre modale ; (3) choisir une section ferme le panneau et fait défiler la page principale jusqu'à elle, sans étape d'historique, ou y mène depuis une page à part ; fermer le panneau sans rien choisir, par le bouton, par Échap ou par un clic hors du panneau, ne déplace pas la lecture ; (4) panneau pleine largeur sur téléphone, de 320 px aligné à droite à partir de 600 px ; l'entrée courante, la section lue ou celle dont la page dépend, signalée par un fond d'accent à 16 % et une barre de 3 px, sans nom de transition de vue ; (5) présent sur toutes les pages, page introuvable comprise ; (6) tests unitaires de la fermeture ; bout en bout en émulation de téléphone : menu ouvert, section choisie, panneau fermé, arrivée sous l'en-tête, aucune étape d'historique sur la page principale ; un clic hors du panneau le ferme ; le fermer sans choisir laisse la position inchangée ; aucune entrée coupée ni défilement horizontal (SC-2.0-04, SC-2.0-09).
- **Résumé** : Rend la navigation utilisable sur téléphone (PN-03) sans jamais cacher le contact : choisir une section fait défiler la page principale, refermer le menu ne déplace pas la lecture.

### TK-30 — Pied de page

- **Titre de PR** : `feat(front): add footer with external profiles and legal link`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-high
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : EC-00, MF-17, MF-18, MF-19, SC-2.0-27, SC-2.0-29, CO-08
- **Dépend de** : TK-27
- **Vague** : W19
- **Taille** : ≈ 200 lignes
- **DoD** : DoD commune, et : (1) sur toutes les pages, le pied porte les liens GitHub et LinkedIn lus dans le profil (libellé texte obligatoire, ouverture annoncée dans un nouvel onglet, le site reste ouvert), aucun lien vers X, et le lien vers les mentions légales ; (2) la signature ne porte aucune année ; (3) une rangée par ligne sur téléphone, liens de 44 px de haut ; (4) la place du bouton de pause est prévue, le bouton arrivant avec TK-50 ; (5) bout en bout : sur chaque page, les liens GitHub et LinkedIn ont la bonne cible et s'ouvrent dans un nouvel onglet, aucun lien vers X n'existe (SC-2.0-27), et le lien des mentions légales mène à /mentions-legales (SC-2.0-29).
- **Résumé** : Complète le cadre commun avec les profils externes et le lien des mentions légales, présents sur chaque page.

### TK-31 — Mentions légales et page introuvable

- **Titre de PR** : `feat(front): add legal notice and not found pages`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-high
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : EC-10, EC-11, MF-04, MF-05, MF-19, SC-2.0-05, SC-2.0-07, SC-2.0-08, SC-2.0-29, CO-17, V-11
- **Dépend de** : TK-13, TK-17, TK-27
- **Vague** : W20
- **Taille** : ≈ 550 lignes ; au-delà de 400, PR successives sur la même issue (section 1)
- **DoD** : DoD commune, et : (1) /mentions-legales nomme Alexandre Morozoff comme éditeur, donne le contact par le formulaire (lien vers /contact) et l'identité des hébergeurs du front et du back, sans adresse ni téléphone personnels ; ses textes, lus dans textes-legaux.json, sont des emplacements étiquetés jusqu'à TK-45 ; un segment dont le lien est une adresse interne y devient un lien du routeur, avec son ancre s'il en a une (PF-06) ; (2) la liste clé-valeur (CO-17) accepte une valeur qui porte un lien, comme le contact des mentions légales de la maquette EC-10 ; ses colonnes, de 10rem au moins et de 6 à 10rem pour la clé, valeurs brutes que la charte révisée reprend des maquettes, deviennent des jetons de rôle, en fin de _jetons.scss (reports du 10/11/2026) ; (3) la page introuvable a deux variantes, dans un seul composant : « adresse inconnue » (le « 404 » d'affiche, décoratif, « Cette page n’existe pas », la phrase de la maquette, « Revenir à l’accueil ») et « projet inexistant », pour /projets/ suivi d'un identifiant inconnu, qui ajoute « Voir la liste des projets », vers /#projets ; la variante vient des données de la route, sinon de l'adresse, et /projets seule affiche la variante du document que lui sert l'hébergeur (PF-06) ; (4) elle répond avec le statut 404, porte une consigne de non-indexation, un titre de niveau 1 et le cadre commun complet, et n'est jamais un écran vide ; (5) bout en bout via le serveur local : /mentions-legales ouverte directement puis rechargée (SC-2.0-05, SC-2.0-29), adresse inconnue (SC-2.0-08), projet inexistant (SC-2.0-07), dont le second bouton mène à /#projets, /projets seule et /parcours, ancienne page de la préversion, chacun en 404 avec le message, la navigation visible et les retours, sans erreur d'hydratation ; avec un contenu de test des mentions légales dont un segment mène à /#competence, une ancre qui ne nomme rien, ce lien suivi une fois l'application démarrée ouvre la page principale en haut, à l'adresse /, sans erreur de console (V-11, depuis une autre page) ; (6) aucune entrée de navigation n'est signalée sur ces deux pages.
- **Résumé** : Crée les deux pages sans section courante : les mentions légales obligatoires, dont les liens internes passent par le routeur, et la page introuvable, servie avec un vrai statut 404, en deux variantes.

### TK-32 — Composant frise chronologique

- **Titre de PR** : `feat(front): add timeline component`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-high
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : CT-04, MF-18, CO-09
- **Dépend de** : TK-17
- **Vague** : W18
- **Taille** : ≈ 220 lignes
- **DoD** : DoD commune, et : (1) CO-09 : liste ordonnée, une étape par période (point, période en chasse fixe « MM/AAAA – MM/AAAA », intitulé, détail facultatif) ; verticale sous 900 px, horizontale au-delà, intitulés alignés selon TK-02 ; (2) états accomplie, mise en avant (annoncée aussi par un texte masqué) et prévue ; aucun texte grisé ; (3) les périodes sont formatées selon la langue, jamais écrites en dur, jamais calculées depuis la date du jour, jamais au présent ; (4) version statique : trait entier jusqu'à l'étape mise en avant et points allumés, le tracé au défilement venant avec TK-53 ; (5) tests unitaires de l'ordre, des formats et des états.
- **Résumé** : Crée la frise de la charte, qui porte le parcours. Elle reste statique jusqu'au ticket du tracé au défilement.

### TK-33 — Section Accueil

- **Titre de PR** : `feat(front): add home section`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-critique
- **Estimation** : 2 j
- **Version** : v2.0.0
- **Couvre** : EC-01, MF-01, MF-02, MF-04, MF-18, SC-2.0-01, SC-2.0-02, SC-2.0-05, SC-2.0-28
- **Dépend de** : TK-12, TK-17, TK-25, TK-26, TK-27, TK-71, TK-72
- **Vague** : W20
- **Taille** : ≈ 600 lignes ; au-delà de 400, PR successives sur la même issue (section 1)
- **DoD** : DoD commune, et : (1) la section accueil de la page principale, en haut, sans ancre ni numéro, dans l'ordre de lecture : le nom Alexandre Morozoff (seul titre de niveau 1 de la page), l'intitulé « Développeur fullstack, orienté architecture logicielle », la courte présentation (C-06), un seul bouton mis en avant, « Écrire un message », vers /contact, puis une carte par section — parcours, compétences, expérience, méthode, projets — avec sa phrase d'orientation (C-10) ; (2) chaque carte est un lien du routeur vers / avec l'ancre de sa section et replaceUrl : elle fait défiler la page jusqu'à la section, sous l'en-tête, sans étape d'historique (PF-06) ; (3) la carte « Expérience » commence par « Alternance chez OSOL, 2025–2028 », tiré de experience.json ; (4) la fenêtre « profil.ts » (nom, intitulé, alternance, sans bloc « liens ») est un décor masqué aux lecteurs d'écran, absent sous 600 px (choix C3) ; texte et fenêtre côte à côte à partir de 1200 px, l'un sous l'autre en dessous ; arrière-plan d'ambiance de l'accueil, cartes sur fond uni, sans carte interactive sur un halo ; (5) aucun âge ni formulation qui se périme ; (6) bout en bout : SC-2.0-01, SC-2.0-02 depuis le bouton de l'accueil, chaque carte qui fait défiler jusqu'à sa section, sous l'en-tête, sans étape d'historique, / ouvert directement puis rechargé (SC-2.0-05), instantané de l'arbre d'accessibilité ; (7) l'accueil est encore sans mouvement : cascade, écriture et titre révélé viennent avec TK-48 et TK-54.
- **Résumé** : Crée la section d'accueil, en haut de la page principale : elle présente Alexandre et mène au contact et, en faisant défiler la page, à chaque section, en une lecture courte.

### TK-34 — Section Parcours

- **Titre de PR** : `feat(front): add career path section`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-high
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : EC-02, MF-04, MF-07, MF-08, MF-18, SC-2.0-05, SC-2.0-10, SC-2.0-11
- **Dépend de** : TK-12, TK-27, TK-32, TK-72
- **Vague** : W21
- **Taille** : ≈ 300 lignes
- **DoD** : DoD commune, et : (1) la section parcours de la page principale, à l'ancre parcours : en-tête de section numéroté 01, titre de niveau 2 à taille-titre-1 (choix 4 et 5) et phrase d'introduction (C-10), puis le texte d'orientation vers l'architecture logicielle, qui cite le master comme étape (C-09) ; (2) la frise des trois étapes dans l'ordre reconversion, bac+3 avec son intitulé et son établissement, master, chacune avec sa période datée (C-01) ; (3) aucune date inventée ni laissée vide : un emplacement étiqueté tant que C-01 manque ; (4) bout en bout : SC-2.0-10, SC-2.0-11, et /#parcours ouvert directement puis rechargé, la section sous l'en-tête (SC-2.0-05).
- **Résumé** : Crée la section du parcours, sur la page principale : reconversion, bac+3 et master, en périodes datées, et l'orientation vers l'architecture logicielle.

### TK-35 — Section Compétences

- **Titre de PR** : `feat(front): add competences section`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-critique
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : EC-03, MF-04, MF-09, MF-10, SC-2.0-05, SC-2.0-12, SC-2.0-13
- **Dépend de** : TK-12, TK-17, TK-27, TK-72, A-06
- **Vague** : W21
- **Taille** : ≈ 350 lignes
- **DoD** : DoD commune, et : (1) la section compétences de la page principale, à l'ancre competences : en-tête de section numéroté 02, titre seul, sans phrase d'introduction (choix C5), puis les compétences techniques regroupées par catégorie, dans l'ordre du rang, seulement celles du contenu (C-02) ; (2) les compétences humaines, en pastilles posées directement sous le titre de leur bloc, sans carte, à gauche de la carte du récit de reconversion (C-07) à partir de 900 px, l'une sous l'autre en dessous (choix 6) ; (3) aucun niveau chiffré, sauf réponse contraire à Q-06 (A-06) ; une catégorie sans compétence n'est pas affichée ; une compétence longue passe à la ligne ; (4) bout en bout : SC-2.0-12, SC-2.0-13, /#competences ouvert directement puis rechargé, la section sous l'en-tête (SC-2.0-05), et l'état « catégorie vide » avec un contenu de test.
- **Résumé** : Crée la section des compétences techniques et humaines, sur la page principale, avec le récit de reconversion côté humain.

### TK-36 — Section Expérience

- **Titre de PR** : `feat(front): add experience section`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-high
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : EC-04, MF-04, MF-11, MF-18, SC-2.0-05, SC-2.0-14, CO-16
- **Dépend de** : TK-12, TK-17, TK-26, TK-27, TK-72
- **Vague** : W22
- **Taille** : ≈ 350 lignes
- **DoD** : DoD commune, et : (1) la section expérience de la page principale, à l'ancre experience : en-tête de section numéroté 03, titre « Expérience », sans phrase d'introduction (choix C5), puis une liste clé-valeur en ligne : « Alternance · OSOL » et « Période · 2025–2028 », la période en chasse fixe (choix C6), tout venant d'experience.json ; (2) le rôle en trois volets — application, backend, appui DevOps sur certaines tâches, présenté comme un appui et non comme un poste — avec leurs textes (C-08) ; (3) la mention que les projets menés en entreprise ne sont pas partageables ; (4) aucun projet, client, outil interne, dépôt ni collègue nommé, contrôlé à la relecture du diff ; (5) l'en-tête de section (CO-16) gagne un emplacement d'action ou de liste, sous le titre, comme le spécimen centré du catalogue : la liste clé-valeur de la section y prend place, comme sur la maquette EC-04 ; tests unitaires de cet emplacement (report du 10/11/2026) ; (6) bout en bout : SC-2.0-14 et /#experience ouvert directement puis rechargé, la section sous l'en-tête (SC-2.0-05).
- **Résumé** : Crée la section du rôle en alternance, sur la page principale, décrit en trois volets et en période datée, sans aucun projet d'entreprise.

### TK-37 — Écran Fiche d'un projet

- **Titre de PR** : `feat(front): add project detail page`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-high
- **Estimation** : 2 j
- **Version** : v2.0.0
- **Couvre** : EC-07, CT-01, MF-04, MF-13, MF-22, SC-2.0-03, SC-2.0-05, SC-2.0-06, SC-2.0-16, SC-2.0-17, SC-2.0-18, SC-2.0-32
- **Dépend de** : TK-12, TK-15, TK-25, TK-27, TK-72
- **Vague** : W22
- **Taille** : ≈ 550 lignes ; au-delà de 400, PR successives sur la même issue (section 1)
- **DoD** : DoD commune, et : (1) une fiche, page à part, est pré-rendue pour chaque projet des fichiers de contenu, à l'adresse /projets/ suivie de son identifiant ; son en-tête n'a pas de numéro, et son titre est de niveau 1, à taille-titre-1 (choix 4 et 5) ; (2) dans l'ordre : titre, description (pour le portfolio, la démarche et l'architecture, C-05), captures seulement s'il y en a (texte alternatif, dimensions déclarées, formats modernes, chargement à la demande), lien vers le code source seulement s'il existe (nouvel onglet), puis « ← Retour à la liste des projets », flèche avant le texte (choix C7), lien du routeur vers / avec l'ancre projets : une navigation ordinaire, qui ajoute une étape et ouvre la page principale sur la section des projets, sous l'en-tête, d'un coup (PF-06), le fondu venant avec TK-52 ; (3) sans capture, aucune zone vide ; sans lien, ni lien ni bouton ; (4) tests unitaires avec trois projets de test : complet, sans lien, sans capture (SC-2.0-16, SC-2.0-17, SC-2.0-18) ; (5) bout en bout : /projets/portfolio ouvert directement puis rechargé (SC-2.0-05, SC-2.0-06), lien vers le code source public du portfolio (SC-2.0-32), contact en un clic depuis la fiche (SC-2.0-03), retour vers /#projets ; (6) « Projets » est signalé comme entrée courante, avec aria-current="page".
- **Résumé** : Crée la fiche d'un projet, page à part pré-rendue pour chaque fichier de projet ; au lancement, celle du portfolio, qui mène à son code source public et ramène à la section des projets.

### TK-38 — Écran CV (retiré le 12/11/2026)

Statut : retiré le 12/11/2026, décision d'Alexandre du 10/11/2026 : plus de CV sur le site. Son texte entier se lit dans le backlog signé le 28/10/2026 (PR #91).

### TK-39 — Section Liste des projets

- **Titre de PR** : `feat(front): add project list section`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-high
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : EC-06, MF-04, MF-06, MF-12, MF-22, SC-2.0-05, SC-2.0-15, V-10
- **Dépend de** : TK-25, TK-26, TK-37, TK-72
- **Vague** : W23
- **Taille** : ≈ 450 lignes ; au-delà de 400, PR successives sur la même issue (section 1)
- **DoD** : DoD commune, et : (1) la section projets de la page principale, à l'ancre projets, la dernière, que suit le pied de page sans bloc de plus (V-10) : en-tête de section numéroté 05, titre seul (choix C5), puis une carte interactive par projet sur toute la largeur : texte à gauche, vignette décorative en fenêtre factice à droite, sous le texte sur téléphone (choix C2) ; au lancement, le seul projet portfolio ; (2) un projet sans vignette n'affiche aucun cadre : la carte se resserre (CO-12, jamais de cadre vide) ; (3) la mention que les projets menés en entreprise ne sont pas partageables, affichée même quand la liste est vide ; liste vide : un message l'indique ; (4) aucune carte sur un halo ; titre jamais coupé ; (5) bout en bout, en profil ordinateur et téléphone : SC-2.0-15 (le portfolio seul, qui mène à sa fiche), /#projets ouvert directement puis rechargé, la section sous l'en-tête (SC-2.0-05), l'entrée « Projets » signalée au bout de la page sur un écran haut, états « plusieurs projets », « sans vignette » et « liste vide » avec des contenus de test.
- **Résumé** : Crée la section des projets, la dernière de la page principale, qui accueillera les projets ajoutés plus tard sans autre modification.

### TK-40 — Section Méthode de travail

- **Titre de PR** : `feat(front): add method section`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-high
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : EC-05, MF-04, MF-21, SC-2.0-05, SC-2.0-31
- **Dépend de** : TK-25, TK-26, TK-37, TK-72
- **Vague** : W23
- **Taille** : ≈ 450 lignes ; au-delà de 400, PR successives sur la même issue (section 1)
- **DoD** : DoD commune, et : (1) la section méthode de la page principale, à l'ancre methode : en-tête de section numéroté 04, titre seul (choix C5), puis le texte de la méthode (C-04) découpé en étapes, chacune avec son intitulé et, sous son texte, son illustration en fenêtre factice : c'est la présentation de MV-08 sans script et sans mouvement, avec quatre étapes de démonstration étiquetées tant que C-04 manque ; (2) le renvoi « La méthode appliquée » mène à /projets/portfolio ; si ce projet n'existe plus, le renvoi est retiré au build, jamais laissé cassé (V-09) ; (3) aucun document interne, client, projet, outil interne ni dépôt d'entreprise nommé, contrôlé à la relecture ; (4) bout en bout : SC-2.0-31 (texte, puis renvoi suivi jusqu'à la fiche), /#methode ouvert directement puis rechargé, la section sous l'en-tête (SC-2.0-05), état « renvoi vers un projet absent » avec un contenu de test.
- **Résumé** : Crée la section de la méthode de travail, sur la page principale, qui renvoie à la fiche du portfolio. Le récit au défilement s'y ajoute avec TK-55.

### TK-41 — Écran Contact : formulaire et validation

- **Titre de PR** : `feat(front): add contact form page`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-critique
- **Estimation** : 2 j
- **Version** : v2.0.0
- **Couvre** : EC-09, MF-04, MF-06, MF-16, MF-20, SC-2.0-05, SC-2.0-09, SC-2.0-24, SC-2.0-25, SC-2.0-30
- **Dépend de** : TK-19, TK-27, TK-72
- **Vague** : W24
- **Taille** : ≈ 550 lignes ; au-delà de 400, PR successives sur la même issue (section 1)
- **DoD** : DoD commune, et : (1) /contact, page à part : en-tête sans numéro, titre de niveau 1 à taille-titre-1 (choix 4 et 5), puis les champs nom, prénom, e-mail, sujet et message, tous obligatoires, chacun avec required ou aria-required, annoncés par une seule phrase avant le formulaire, « Tous les champs sont obligatoires. », sans mention par champ (choix 7) ; nom et prénom côte à côte quand la place le permet ; « Contact » est l'entrée signalée, avec aria-current="page" ; (2) l'information sur l'usage des données est placée avant le bouton d'envoi (emplacement étiqueté D-10 jusqu'à TK-45) ; (3) à partir de 1200 px, le titre et l'information à gauche, collants au défilement sans passer sous l'en-tête, le formulaire à droite ; une seule colonne en dessous (choix C1) ; (4) à l'envoi, validation dans le navigateur, qui applique à l'identique la section 3 du contrat : champ manquant ou e-mail invalide, message près du champ et relié à lui, au caractère près (« Ce champ est obligatoire. », « L’adresse e-mail n’est pas valide. »), focus sur le premier champ à corriger, rien n'est envoyé, la saisie est conservée ; le bouton n'est jamais désactivé pour un formulaire incomplet ; (5) le formulaire est un vrai formulaire en POST, qui n'envoie rien tant que TK-43 ne le branche pas ; (6) tests unitaires de la validation, sur chaque cas limite du contrat ; bout en bout : SC-2.0-24, SC-2.0-25, SC-2.0-30, formulaire rempli sur téléphone (SC-2.0-09), /contact ouvert directement puis rechargé (SC-2.0-05).
- **Résumé** : Crée la page du contact, à part de la page principale, sa validation dans le navigateur et sa colonne collante. L'envoi se branche avec TK-42 et TK-43.

### TK-42 — Client du contrat d'API

- **Titre de PR** : `feat(front): add contact api client`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-critique
- **Estimation** : 2 j
- **Version** : v2.0.0
- **Couvre** : CT-08, D-07, MF-16
- **Dépend de** : TK-01, TK-07, A-04
- **Vague** : W24
- **Taille** : ≈ 300 lignes
- **DoD** : DoD commune, et : (1) un service du front implémente le contrat : demande du jeton, envoi du message en POST, lecture des erreurs par champ et de l'échec réessayable ; (2) l'adresse du back vient de la configuration de l'environnement (préproduction, production), jamais du code ; (3) aucun envoi ne part sans jeton ni avant le délai minimal compté depuis la délivrance du jeton ; si le jeton manque au moment de l'envoi, le service l'attend, puis attend le délai minimal, dans la limite de 90 secondes comptées depuis le clic, au-delà desquelles il rend l'échec réessayable (D-07) ; une coupure réseau mène au même échec ; (4) un jeton expiré est renouvelé sans action du visiteur ; (5) tests unitaires avec un back simulé : jeton à l'heure, jeton en retard puis succès, délai minimal respecté, attente de 90 secondes dépassée, refus de validation, échec réessayable, coupure réseau.
- **Résumé** : Implémente côté front le contrat d'API et la règle d'attente de CT-08, indépendamment de l'écran.

### TK-43 — Envoi du formulaire et ses états

- **Titre de PR** : `feat(front): wire contact form sending states`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-critique
- **Estimation** : 2 j
- **Version** : v2.0.0
- **Couvre** : EC-09, CT-08, MF-16, SC-2.0-09, SC-2.0-23, SC-2.0-26
- **Dépend de** : TK-24, TK-41, TK-42
- **Vague** : W25
- **Taille** : ≈ 280 lignes
- **DoD** : DoD commune, et : (1) le jeton est demandé à la première interaction avec le formulaire, ce qui réveille le back ; (2) envoi en cours : bouton inactif avec l'indicateur, champs désactivés et lisibles, message d'attente au libellé tranché par TK-02, « L’envoi peut prendre jusqu’à 90 secondes. Votre saisie est conservée. » ; succès : confirmation et champs vidés (SC-2.0-23) ; échec : message réessayable, saisie conservée, « Réessayer » (SC-2.0-26) ; un refus de la protection affiche ce même échec (V-06) ; le message reste sous le bouton jusqu'à la prochaine action ; (3) le champ piège est invisible, hors de la navigation au clavier et de l'arbre d'accessibilité ; (4) bout en bout avec le back simulé, en profil ordinateur et téléphone : succès, jeton reçu en retard puis confirmation, échec, attente longue (SC-2.0-09) ; (5) depuis la préproduction du front, le formulaire obtient un jeton du back de préproduction, constaté à la main.
- **Résumé** : Branche le formulaire sur le client du contrat et montre ses trois états, jusqu'au back de préproduction.

### TK-44 — Plan du site, robots.txt et non-indexation des préversions

- **Titre de PR** : `feat(front): generate sitemap and robots file`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-medium
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : CT-11, D-08
- **Dépend de** : TK-13, TK-37
- **Vague** : W25
- **Taille** : ≈ 250 lignes
- **DoD** : DoD commune, et : (1) le plan du site est généré au build à partir des pages construites qui s'indexent — la page principale, chaque fiche projet, le contact et les mentions légales —, en adresses absolues sur le nom d'hôte canonique www (D-08), sans barre finale ni ancre, aucune section n'étant une page (CT-11) : un projet ajouté y entre seul ; les pages d'erreur n'y figurent pas ; (2) un fichier nommé exactement robots.txt, à la racine, l'annonce ; (3) la consigne de non-indexation des préversions (X-Robots-Tag), posée dans le fichier d'en-têtes dès TK-13 (lecture de W8), est constatée ici sans être refaite : présente hors production, absente de la production ; (4) test d'outil : un projet ajouté entre dans le plan, les pages d'erreur n'y sont pas, l'en-tête de non-indexation est absent du build de production ; bout en bout : robots.txt servi en texte, sitemap.xml servi en XML, avec le contenu attendu, consigne de non-indexation présente sur le build de test.
- **Résumé** : Corrige les défauts constatés sur l'ancien site (fichier robots mal nommé, plan du site non servi) : le plan liste les pages, jamais les sections. La production est déjà protégée de la concurrence des préversions par la consigne posée avec TK-13.

### TK-45 — Textes légaux et information sur les données

- **Titre de PR** : `feat(front): add legal notice and data use texts`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-high
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : CT-12, D-10, MF-19, MF-20, SC-2.0-29, SC-2.0-30
- **Dépend de** : TK-28, TK-31, TK-41, A-13 (pour finir)
- **Vague** : W26
- **Taille** : ≈ 200 lignes
- **DoD** : DoD commune, et : (1) l'information affichée avant l'envoi dit, sur la base de CT-12 : qui reçoit les données (Alexandre Morozoff), pourquoi (répondre au message), la base légale proposée (intérêt légitime), les prestataires techniques (hébergeurs du front et du back, prestataire d'envoi, fournisseur de la boîte d'Alexandre) et leurs transferts éventuels hors de l'Union européenne, la durée de conservation (au plus trois ans après le dernier échange, D-10), les droits et leur exercice par le formulaire, le droit de réclamation auprès de la CNIL ; (2) avant rédaction, les points « à vérifier » de CT-12 sont vérifiés sur les pages publiques des prestataires, sources citées dans la PR : raison sociale de Render et traitements hors de sa région, durée des journaux chez Brevo, statut du Data Privacy Framework, fournisseur de la boîte d'Alexandre ; (3) les mentions légales nomment l'éditeur, le contact par le formulaire et les hébergeurs, sans adresse ni téléphone personnels ; (4) les textes de la page introuvable sont finalisés ; (5) Alexandre valide chaque texte dans la PR (A-13) ; (6) bout en bout : SC-2.0-29 et SC-2.0-30 sur les textes finaux ; le contrôle du contenu de TK-28, en mode main, ne relève aucune tournure de la liste signée dans les textes finaux, durée de conservation de D-10 comprise.
- **Résumé** : Remplace les emplacements des textes légaux par des textes vérifiés et validés par Alexandre. Ce sont les seuls textes du site que le développement rédige, sur la base de la conception technique.

### TK-46 — Balises de référencement et aperçu au partage

- **Titre de PR** : `feat(front): add seo meta tags and share preview`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-medium
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : CT-11, D-08, MF-01, MF-17
- **Dépend de** : TK-33, TK-37
- **Vague** : W26
- **Taille** : ≈ 450 lignes (hors image d'aperçu, binaire) ; au-delà de 400, PR successives sur la même issue (section 1)
- **DoD** : DoD commune, et : (1) chaque page pré-rendue — la page principale, chaque fiche projet, le contact et les mentions légales — porte dans son HTML son titre, sa description, une adresse canonique sur www sans ancre (D-08), les quatre propriétés Open Graph (titre, type, image, adresse) et une carte d'aperçu, une seule fois par page et aucune par section : ils restent ceux de la page pendant toute la lecture, quand l'adresse suit la section lue (CT-11, PF-06) ; le titre de la page principale est le nom et l'intitulé ; une fiche projet reprend sa description courte ; (2) la page principale porte les données structurées schema.org « Person » : nom, intitulé, adresse du site, profils GitHub et LinkedIn, dans un bloc de données qui ne s'exécute pas ; (3) l'image d'aperçu de 1200 × 630 px suit la maquette apercu-partage (charte, P-09), sans texte sous 24 px ; (4) bout en bout : présence et unicité des balises sur chaque page, inchangées après un défilement de la page principale qui change l'adresse, données « Person » bien formées ; (5) l'aperçu de partage réel se vérifie à la main dans la passe manuelle (TK-58).
- **Résumé** : Rend le site lisible par les moteurs et par les robots d'aperçu, qui n'exécutent pas tous JavaScript : des balises par page, jamais par section. Aucune position dans les résultats n'est promise.

### TK-47 — Test d'ajout d'un projet

- **Titre de PR** : `test(front): add project addition build test`
- **Type** : test
- **Domaine** : front
- **Priorité** : prio-medium
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : MF-14, SC-2.0-19, SC-2.0-20
- **Dépend de** : TK-39, TK-44
- **Vague** : W27
- **Taille** : ≈ 250 lignes
- **DoD** : DoD commune, et : (1) un test de la CI construit le site avec un projet de test ajouté, sous la forme d'un fichier et d'un dossier d'images, rien d'autre ; (2) il vérifie que le projet apparaît dans la section des projets de la page principale, que sa fiche affiche les informations fournies et s'ouvre par son lien direct, et qu'il entre dans le plan du site (SC-2.0-19, SC-2.0-20) ; (3) il vérifie que la page principale ne diffère que par la carte du projet et que toutes les autres pages pré-rendues sont identiques à celles du build sans ce projet, une fois retirées les références aux fichiers de code et de style, dont le nom change avec leur empreinte, hormis le plan du site ; (4) le projet de test n'entre jamais dans le contenu publié ; (5) le README de front/ décrit ce qu'Alexandre fournit pour un projet (titre, description, description courte, captures et textes alternatifs, lien éventuel, rang, vignette) et ce que contient la PR d'ajout.
- **Résumé** : Prouve, à chaque PR, qu'ajouter un projet ne demande que ses informations et ne modifie aucune autre page (MF-14).

### TK-48 — Apparitions en cascade

- **Titre de PR** : `feat(front): add staggered reveal motion`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-medium
- **Estimation** : 2 j
- **Version** : v2.0.0
- **Couvre** : EC-01, EC-02, EC-03, EC-04, EC-05, EC-06, EC-07, EC-09, EC-10, EC-11 (MV-01)
- **Dépend de** : TK-23, TK-31, TK-33, TK-34, TK-35, TK-36, TK-37, TK-39, TK-40, TK-41
- **Vague** : W27
- **Taille** : ≈ 600 lignes ; au-delà de 400, PR successives sur la même issue (section 1)
- **DoD** : DoD commune, et : (1) MV-01 sur chaque bloc de contenu de chaque section de la page principale et de chaque page à part, jamais sur l'en-tête ni sur le pied : opacité de 0 à 1 et montée de 16 px en 700 ms, courbe-sortie, dans l'ordre de lecture, éléments séparés de 70 ms, six au plus par cascade, une seule fois par bloc ; (2) les blocs visibles au premier affichage sont révélés d'emblée par leur cascade, sans attendre l'observateur : un défilement très rapide dès l'arrivée ne laisse aucun bloc caché (test de bout en bout qui défile jusqu'en bas aussitôt la page ouverte) ; (3) au retour arrière, y compris depuis le cache du navigateur, aucune cascade ne rejoue : tout est déjà en place ; jamais non plus en remontant ; (4) aucun décalage de mise en page : chaque élément occupe sa place finale dès le départ ; (5) sans script, avec les animations réduites ou avec le script en erreur, tout est en place (TK-23) ; (6) les actions de l'accueil sont en place avant 2 secondes.
- **Résumé** : Fait entrer le contenu de chaque section et de chaque page dans l'ordre de lecture, sans jamais le retenir ni le cacher.

### TK-49 — Contrôles de mise en production et surveillance quotidienne

- **Titre de PR** : `ci: add deployment smoke checks and daily monitoring`
- **Type** : ci
- **Domaine** : infra
- **Priorité** : prio-high
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : CT-14
- **Dépend de** : TK-24, TK-31, TK-44
- **Vague** : W28
- **Taille** : ≈ 150 lignes
- **DoD** : DoD commune, et : (1) un contrôle, paramétré par l'adresse du front et celle du back, vérifie : les pages clés en 200, une adresse inconnue en 404 avec la page introuvable, repérée par son titre « Cette page n’existe pas », robots.txt servi en texte et le plan du site en XML, l'indicateur de santé du back, l'origine du site acceptée par le back ; (2) il tourne après chaque déploiement de préproduction et, une fois la production branchée, de production ; (3) une tâche planifiée de la CI l'exécute chaque jour sur la production, en un seul appel au back, sans le tenir éveillé ; (4) un échec est notifié à Alexandre par e-mail ; (5) le README documente le risque de désactivation des tâches planifiées après 60 jours sans activité du dépôt, et la question, à vérifier, de savoir si les PR du robot de mises à jour comptent comme activité ; (6) le contrôle passe sur la préproduction.
- **Résumé** : Met en place la partie de CT-14 qui vit dans le dépôt ; la sonde externe du front est une tâche d'Alexandre (A-16).

### TK-50 — Halos qui respirent et pause des animations

- **Titre de PR** : `feat(front): add breathing halos and animation pause button`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-high
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : EC-00 (MV-04, pause des animations), CO-08, CO-13
- **Dépend de** : TK-23, TK-26, TK-30
- **Vague** : W28
- **Taille** : ≈ 250 lignes
- **DoD** : DoD commune, et : (1) MV-04 : chaque halo respire en 8 secondes, opacité de 55 % à 100 % de sa valeur de charte et échelle de 0,9 à 1,08, les deux halos d'une section en opposition de phase, sans suivi du pointeur, seulement quand le script de mouvement est actif ; (2) le pied de chaque page porte le bouton « Mettre les animations en pause », qui devient « Relancer les animations » : seul le libellé change, aucun état pressé n'est annoncé ; cible de 44 × 44 px ; (3) il fige la respiration des halos ; le choix est mémorisé d'une page à l'autre dans le stockage local, sans erreur s'il est indisponible, et relu par le petit script de tête avant le premier affichage (empreinte de la politique de sécurité mise à jour) ; (4) le bouton est masqué quand le visiteur demande à réduire les animations et quand le script ne tourne pas ; (5) bout en bout : mise en pause, navigation, état conservé ; stockage indisponible sans erreur ; aucun halo au-delà de sa valeur de charte.
- **Résumé** : Fait vivre la lumière du fond, avec le moyen de pause qu'exige le critère WCAG 2.2.2 (niveau A) : les deux vont ensemble.

### TK-51 — Tracés et survols vivants

- **Titre de PR** : `feat(front): add line drawing and hover motion`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-medium
- **Estimation** : 2 j
- **Version** : v2.0.0
- **Couvre** : EC-01, EC-06 (cartes) et tous les écrans (filets, flèches) : MV-05, MV-06
- **Dépend de** : TK-15, TK-17, TK-26, TK-48
- **Vague** : W29
- **Taille** : ≈ 300 lignes
- **DoD** : DoD commune, et : (1) MV-05 : à l'apparition de son bloc, une seule fois, le filet d'un en-tête de section s'étire depuis la gauche, puis les icônes en trait des cartes et la flèche des liens d'action se dessinent (stroke-dashoffset, seule propriété animée hors opacité et transformation, sur de petits traits SVG) ; (2) MV-06, avec une souris seulement : la carte interactive se soulève de 4 px, son ombre apparaît par l'opacité d'un calque, la lueur de 380 px à 20 % de couleur-accent suit le pointeur à l'intérieur de la carte, sous son contenu, au plus une mise à jour par image ; la flèche glisse et le soulignement s'étire ; (3) au clavier, le focus visible donne le même soulèvement et le même soulignement, sans lueur ; (4) sans animation, seules les couleurs changent ; sans script, la lueur est absente et le reste demeure ; (5) aucune carte interactive sur un halo ; axe-core sans violation pendant un survol.
- **Résumé** : Ajoute les tracés qui se dessinent et les survols qui répondent au pointeur, sans jamais faire passer un texte sous son contraste minimum.

### TK-52 — Transitions entre pages

- **Titre de PR** : `feat(front): add page transitions`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-medium
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : EC-00 (MV-07)
- **Dépend de** : TK-27, TK-48
- **Vague** : W29
- **Taille** : ≈ 300 lignes
- **DoD** : DoD commune, et : (1) MV-07 par les transitions de vue du navigateur, selon la technique fixée au plan front (withViewTransitions) : entre deux pages, quelles qu'elles soient — la page principale et une page à part, dans un sens ou dans l'autre, ou deux pages à part —, la page quittée s'efface en montant de 8 px, la nouvelle arrive en fondu, l'en-tête reste fixe, le repère de l'entrée courante glisse de l'ancienne entrée vers la nouvelle ; (2) jamais d'une section à l'autre de la page principale, qui défile sans fondu : la transition est annulée quand le chemin de l'adresse ne change pas, que la navigation vienne de l'en-tête, du menu replié, du nom ou d'une carte de l'accueil, et le suivi de l'adresse pendant la lecture, qui n'est pas une navigation, n'en déclenche aucune ; (3) un navigateur sans prise en charge navigue immédiatement, sans erreur ; la prise en charge réelle par Chrome, Edge, Firefox et Safari à la date du ticket est notée dans la PR (R-10) ; (4) au retour arrière ou à l'avance, y compris depuis le cache du navigateur, aucune transition : la page est visible d'emblée et aucune page ne reste effacée ; (5) aucune interception d'un clic avec Cmd, Ctrl, Maj ou Alt, d'un clic milieu, d'un lien externe ou d'un téléchargement ; (6) animations réduites ou sans script : navigation immédiate ; (7) bout en bout sur les trois moteurs : fondu entre la page principale et une page à part, dans les deux sens, et entre deux pages à part ; aucun fondu d'une section à l'autre, ni pendant le suivi de l'adresse ; retour arrière sans fondu ni page effacée ; clic avec modificateur et lien externe non interceptés.
- **Résumé** : Lie les pages par un fondu, amélioration facultative qui ne joue qu'entre deux pages, jamais d'une section à l'autre de la page principale, et ne gêne jamais la navigation ni le retour arrière.

### TK-53 — Frise tracée au défilement

- **Titre de PR** : `feat(front): trace timeline on scroll`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-medium
- **Estimation** : 2 j
- **Version** : v2.0.0
- **Couvre** : EC-02 (MV-02)
- **Dépend de** : TK-23, TK-34
- **Vague** : W30
- **Taille** : ≈ 260 lignes
- **DoD** : DoD commune, et : (1) quand toute la frise est visible, le trait se trace d'un coup en 1,2 seconde jusqu'à l'étape mise en avant, chaque point s'allumant quand le trait l'atteint réellement (décalage qui suit la courbe, pas une part linéaire) ; une fois tracé en entier, il reste tracé pendant toute la visite ; (2) tant qu'il n'a pas été tracé en entier, il suit le défilement et recule quand on remonte ; une frise plus haute que la fenêtre, qui ne peut jamais être visible en entier, ne recule pas indéfiniment : proposition, dès que le trait a atteint l'étape mise en avant en suivant le défilement, il est tenu pour tracé en entier ; (3) l'étape mise en avant garde toujours son point allumé ; aucun texte grisé ; (4) au retour arrière, y compris depuis le cache du navigateur, le trait est posé d'emblée ; (5) écouteur de défilement passif et une mise à jour au plus par image, sans animation-timeline ; (6) sans animation et sans script : trait entier, points allumés ; (7) bout en bout : frise visible d'un coup, frise plus haute que la fenêtre en profil téléphone, retour arrière.
- **Résumé** : Trace la frise du parcours au rythme de la lecture, en réglant le cas de la frise plus haute que l'écran laissé par les maquettes.

### TK-54 — Fenêtre « profil.ts » qui s'écrit et titre révélé

- **Titre de PR** : `feat(front): add code typing and home title reveal`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-medium
- **Estimation** : 2 j
- **Version** : v2.0.0
- **Couvre** : EC-01 (MV-03, MV-10)
- **Dépend de** : TK-23, TK-33
- **Vague** : W30
- **Taille** : ≈ 290 lignes
- **DoD** : DoD commune, et : (1) MV-03, à partir de 600 px : la fenêtre « profil.ts » s'écrit une fois à son apparition, en moins de 5 secondes (environ 3), ses caractères déjà en place devenant visibles selon le minutage de la charte ; curseur décoratif qui clignote pendant l'écriture puis disparaît ; cadre à sa taille finale dès le départ ; texte sélectionnable ; décor masqué aux lecteurs d'écran ; (2) MV-10 : le nom puis l'intitulé se révèlent mot par mot derrière un cache, départ à delai-depart, tout en place avant 2 secondes, le titre étant lu d'un seul tenant par les lecteurs d'écran ; (3) le repli de MV-10, nom affiché d'emblée sans délai, tient en un seul réglage, appliqué seulement si la mesure de TK-57 l'exige ; (4) sans animation et sans script : code écrit et titre affiché d'emblée ; (5) aucun décalage de mise en page ; bout en bout : texte complet après l'écriture, titre accessible d'un seul tenant.
- **Résumé** : Ajoute les deux gestes d'arrivée de l'accueil, en gardant prêt le repli du titre accepté par Alexandre le 17/10/2026.

### TK-55 — Récit au défilement de la méthode

- **Titre de PR** : `feat(front): add method scroll storytelling`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-medium
- **Estimation** : 2 j
- **Version** : v2.0.0
- **Couvre** : EC-05 (MV-08)
- **Dépend de** : TK-23, TK-40
- **Vague** : W31
- **Taille** : ≈ 280 lignes
- **DoD** : DoD commune, et : (1) MV-08, dans la section méthode de la page principale : le texte de la méthode défile à côté d'une fenêtre factice collante ; l'étape active est celle dont le haut a passé 40 % de la hauteur de la fenêtre du navigateur ; l'illustration change en opacité et en position de 14 px ; une barre de progression avance ; l'étape active se signale par un filet d'accent, jamais en grisant les autres ; (2) sous 900 px, la fenêtre se cale en haut, sous l'en-tête collant, et le texte passe dessous ; chaque étape mesure au moins 30 % de la hauteur de la fenêtre sous 900 px, 70 % au-delà ; (3) avec les animations réduites ou sans script : pas de fenêtre collante, chaque illustration sous son étape (présentation de TK-40) ; (4) écouteur passif, une mise à jour par image : ce n'est pas une parallaxe ; (5) bout en bout : changement d'étape au défilement, présentation réduite.
- **Résumé** : Raconte la méthode pas à pas, l'illustration suivant la lecture.

### TK-56 — Redirection des anciennes adresses

- **Titre de PR** : `chore(infra): redirect legacy site addresses`
- **Type** : chore
- **Domaine** : infra
- **Priorité** : prio-medium
- **Estimation** : 0,5 j
- **Version** : v2.0.0
- **Couvre** : CT-05, D-13, MF-04
- **Dépend de** : TK-13, TK-33, TK-34, TK-39, A-14
- **Vague** : W32
- **Taille** : ≈ 100 lignes
- **DoD** : DoD commune, et : (1) le fichier de redirections de l'hébergeur (public/_redirects) redirige de façon permanente, en 301, les anciennes adresses vers les cibles décidées par Alexandre le 12/11/2026 (A-14, D-13), chacune écrite avec et sans barre finale : /about vers /#parcours, /arcade vers /#projets, /competence/ suivie d'un identifiant vers /#projets ; l'accueil reste l'accueil ; (2) toute autre ancienne adresse n'a pas de règle et mène à la page introuvable, en 404 ; (3) bout en bout via le serveur local : chaque ancienne adresse répond par une redirection 301 vers sa cible, ancre comprise dans l'en-tête Location, puis la page principale s'ouvre sur la section, sous l'en-tête ; une autre ancienne adresse répond 404 ; la spécification de conformité du serveur local couvre aussi le fichier de redirections ; (4) le fichier de redirections ne contient aucun hôte.
- **Résumé** : Évite qu'un lien vers l'ancien site déjà diffusé mène à une impasse après la bascule (D-13) : chaque ancienne adresse gardée mène à la section de la page principale qui la remplace.

### TK-57 — Budget de performance et mesure au lot des écrans

- **Titre de PR** : `test(front): add lighthouse ci performance budgets`
- **Type** : test
- **Domaine** : front
- **Priorité** : prio-high
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : CT-10, D-11 (repli de MV-10)
- **Dépend de** : TK-48, TK-50, TK-51, TK-52, TK-53, TK-54, TK-55
- **Vague** : W33
- **Taille** : ≈ 100 lignes
- **DoD** : DoD commune, et : (1) Lighthouse CI mesure, en profil mobile, chaque adresse du plan du site — la page principale, chaque fiche, le contact, les mentions légales — construite avec tout le mouvement, et fait échouer la CI sous ces budgets : score de performance d'au moins 90, plus grand élément affiché en 2,5 secondes au plus, décalage cumulé de 0,1 au plus (D-11) ; (2) la mesure du lot des écrans porte sur le site en Angular, pas sur les maquettes, et ses résultats sont notés dans la PR ; (3) si le titre révélé de l'accueil (MV-10) fait dépasser le seuil, le repli accepté d'avance est appliqué (le nom part sans délai) et la mesure refaite ; (4) tout autre dépassement donne une issue de type bug, corrigée dans sa propre PR, pas dans ce ticket ; (5) le build ne contient aucun script tiers ni aucune bibliothèque d'animation.
- **Résumé** : Fait respecter le budget de performance par la CI, une fois tout le mouvement en place.

### TK-58 — Passe manuelle avant la recette

- **Titre de PR** : `test: run manual pass before acceptance testing`
- **Type** : test
- **Domaine** : infra
- **Priorité** : prio-critique
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : CT-08, D-04, SC-2.0-09, SC-2.0-23, SC-2.0-27, SC-2.0-28
- **Dépend de** : TK-43, TK-45, TK-46, TK-47, TK-49, TK-56, TK-57, TK-65, TK-66, A-09, A-10
- **Vague** : W34
- **Taille** : 0 ligne comptée (compte rendu en prose dans Projet-V2/, hors compte)
- **DoD** : DoD commune, et : la passe manuelle de la section 8 de la conception technique est faite sur la préproduction et consignée : (1) un iPhone et un téléphone Android réels, sur toutes les pages, avec le défilement de la page principale, l'entrée signalée et l'adresse qui suivent la lecture, et le retour arrière qui quitte la page principale (SC-2.0-09) ; (2) parcours complet au clavier ; (3) envoi réel depuis le formulaire, réception dans la boîte d'Alexandre, « Répondre » qui écrit au visiteur (SC-2.0-23) ; envoi après une mise en veille, délai mesuré et noté (D-04) ; (4) envois scriptés sans passer par le formulaire — sans jeton, champ piège rempli, rafale — dont aucun n'arrive, et un envoi humain qui arrive (CT-08) ; (5) clic réel sur GitHub et sur LinkedIn (SC-2.0-27) ; (6) aperçu de partage vérifié ; (7) relecture complète des textes avec Alexandre, pour MF-18 (SC-2.0-28) et pour la confidentialité ; (8) chaque défaut trouvé devient une issue de type bug, sur le modèle bug.md, corrigée dans sa propre PR ; (9) CI verte sur staging : la préproduction est prête pour la recette.
- **Résumé** : Fait les contrôles manuels que la conception technique exige avant la recette, sur la préproduction complète, contenus d'Alexandre compris.

### TK-59 — Production et bascule de la v2.0.0

- **Titre de PR** : `chore(infra): connect production deployments and switch over to v2.0.0`
- **Type** : chore
- **Domaine** : infra
- **Priorité** : prio-critique
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : CT-09, CT-13, CT-14, D-03, D-08, D-15
- **Dépend de** : TK-58, A-09, A-18, A-16 (pour finir), A-17 (pour finir), A-19 (pour finir), A-20 (pour finir), A-26 (pour finir)
- **Vague** : W35
- **Taille** : ≈ 80 lignes
- **DoD** : DoD commune, et : (1) la configuration de production est versionnée — front déployé depuis main sur www et sur le domaine nu, qui redirige vers www (rattachement des domaines et redirection faits par A-20, décrits dans le README de front/) ; service de production du back déployé depuis main sur son sous-domaine, laissé en « DNS seulement » ; origine autorisée de production — et reste inerte tant que main ne contient pas front/ ni back/ ; (2) après la recette signée (A-19), la bascule suit la section 6 de la conception technique : fusion de staging dans main et tag annoté v2.0.0, production déployée sur les adresses techniques des hébergeurs et sur le sous-domaine du back, puis www et domaine nu rattachés au front comme domaines personnalisés, le domaine nu redirigé vers www, sans toucher aux serveurs de noms ni à DNSSEC (A-20) ; (3) les contrôles de TK-49 passent sur la production ; la sonde externe (A-16) et la tâche planifiée tournent ; (4) l'hébergement OVH reste en place 30 jours pour le retour arrière (D-15), qui consiste à détacher ces domaines et à remettre les anciens enregistrements (A-20) ; (5) le plan du site est soumis à la Search Console (A-17) ; (6) tous les tickets v2.0.0 passent en Closed.
- **Résumé** : Branche la production et met la v2.0.0 en ligne selon la bascule de la conception technique. Le retour arrière reste possible pendant 30 jours.

### TK-60 — Version anglaise

- **Titre de PR** : `feat(front): add english version`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-medium
- **Estimation** : 1 semaine et +
- **Version** : après-v2
- **Couvre** : MF-23, CT-04
- **Dépend de** : TK-59, A-24
- **Vague** : —
- **Taille** : 400 lignes au plus par PR : ce ticket de suivi sera découpé en tickets de 400 lignes au plus avant sa réalisation (libellés, contenu, choix de langue, référencement par langue)
- **DoD** : DoD commune, et : (1) les libellés marqués en v2.0.0 sont extraits et traduits, et le contenu anglais est rempli à côté du français ; (2) le build produit l'anglais sous un préfixe de langue, et les adresses françaises publiées en v2.0.0 ne changent pas ou sont redirigées (contrainte de CT-04 ; l'option qui garde le français à la racine est à vérifier) ; (3) choix de la langue et liens entre versions linguistiques pour les moteurs ; (4) plan du site et balises par langue ; (5) publié en v2.0.1.
- **Résumé** : Trace la version anglaise décidée pour la v2.0.1 (MF-23), que la v2.0.0 prépare par le marquage des libellés et le rangement du contenu par langue (CT-04).

### TK-61 — Lot VPS

- **Titre de PR** : `chore(infra): migrate hosting to a rented vps`
- **Type** : chore
- **Domaine** : infra
- **Priorité** : prio-low
- **Estimation** : 1 semaine et +
- **Version** : après-v2
- **Couvre** : CT-05, CT-06 (section 6 : portabilité vers un VPS)
- **Dépend de** : TK-59, A-25
- **Vague** : —
- **Taille** : 400 lignes au plus par PR : ce lot aura sa propre conception et sera découpé en tickets de 400 lignes au plus
- **DoD** : DoD commune, et : (1) le lot a sa conception signée, qui en conçoit l'administration, laissée hors de la conception de la v2.0.0 ; (2) un serveur web sert les fichiers du front avec les mêmes règles (page 404, en-têtes, redirections) et un certificat obtenu automatiquement ; (3) le back tourne dans la même image Docker, avec les mêmes variables d'environnement ; (4) les enregistrements DNS pointent vers le VPS et la CI gagne une étape de déploiement ; (5) le front n'est pas reconstruit pour changer l'hébergement du back.
- **Résumé** : Trace la migration vers un VPS loué, décidée le 15/10/2026 comme un lot séparé, postérieur à la v2.0.0.

### TK-62 — Archivage de l'ancien back

- **Titre de PR** : `chore(infra): archive legacy back-end repository`
- **Type** : chore
- **Domaine** : infra
- **Priorité** : prio-medium
- **Estimation** : 0,5 j
- **Version** : après-v2
- **Couvre** : — (conception technique, section 10 ; section 6, étape 9 de la bascule)
- **Dépend de** : TK-59, A-21, A-22
- **Vague** : —
- **Taille** : 0 ligne : aucune modification de ce dépôt, l'opération porte sur le dépôt séparé de l'ancien back
- **DoD** : (1) l'hébergement de l'ancien back est identifié et arrêté, ses identifiants d'envoi révoqués (A-22) ; (2) le dépôt séparé, privé, est archivé ; (3) plus rien de la production ne pointe vers l'ancien back, ce que les contrôles de TK-49 confirment.
- **Résumé** : Trace la dernière étape de la bascule : l'ancien back et son dépôt séparé disparaissent après la v2.0.0. Ticket de suivi, sans PR dans ce dépôt.

### TK-63 — Renfort contre les messages indésirables

- **Titre de PR** : `feat(back): add self-hosted proof of work to contact form`
- **Type** : feature
- **Domaine** : back
- **Priorité** : prio-low
- **Estimation** : 2 j
- **Version** : après-v2
- **Couvre** : CT-08, D-06
- **Dépend de** : TK-59, A-23
- **Vague** : —
- **Taille** : ≈ 300 lignes, en une PR pour le back et une pour le front, découpage fait au moment de le planifier
- **DoD** : DoD commune, et : (1) seulement si le seuil de CT-08 est franchi : plus de 5 messages indésirables par semaine deux semaines de suite, ou épuisement constaté du quota d'envoi (A-23) ; (2) ALTCHA, auto-hébergé, sans tiers ni cookie, s'ajoute à la chaîne de filtres du back et au formulaire, sans gêner l'accessibilité ; (3) l'information sur les données est relue ; (4) tests du nouveau filtre et du parcours humain complet.
- **Résumé** : Trace le renfort prévu par D-06, à n'engager que si la protection native ne suffit pas en production.

### TK-64 — Entretien annuel

- **Titre de PR** : `chore(infra): perform yearly maintenance`
- **Type** : chore
- **Domaine** : infra
- **Priorité** : prio-medium
- **Estimation** : 1 j
- **Version** : après-v2
- **Couvre** : CT-02 (section 9 : entretien annuel)
- **Dépend de** : TK-59
- **Vague** : —
- **Taille** : ≈ 100 lignes (montées de version, hors lockfiles)
- **DoD** : DoD commune, et : (1) une PR par an : montée de mineure du back et, selon le calendrier, de majeur d'Angular, au plus tard avant la fin de la LTS d'Angular 22 en 06/2028 ; (2) relecture du contenu au regard de MF-18 ; (3) contrôle des liens externes, dont ceux que les réseaux refusent aux robots, vérifiés à la main ; (4) relecture des conditions des offres gratuites utilisées ; (5) CI verte.
- **Résumé** : Trace l'entretien court que la conception technique prévoit chaque année pour tenir les deux ans visés.

### TK-65 — Intégration des contenus d'Alexandre : textes et images du portfolio

- **Titre de PR** : `feat(front): integrate final content and portfolio images`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-critique
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : CT-03, D-12, MF-01, MF-07, MF-08, MF-09, MF-10, MF-11, MF-18, MF-21, MF-22, SC-2.0-28 (contenus C-01, C-02 et C-04 à C-10, vignette et captures du portfolio)
- **Dépend de** : TK-12, TK-28, TK-33, TK-34, TK-35, TK-36, TK-37, TK-39, TK-40, A-11, A-12
- **Vague** : W31
- **Taille** : ≈ 300 lignes (hors vignette et captures, fichiers binaires) ; si les textes fournis la portent au-delà de 400 lignes, la vignette et les captures passent dans un ticket à part avant l'ouverture de la PR
- **DoD** : DoD commune, et : (1) chaque emplacement étiqueté C-01, C-02 et C-04 à C-10 des fichiers de contenu est remplacé par le contenu fourni par Alexandre (A-11), repris tel qu'il l'a fourni : périodes du parcours (C-01), compétences et leurs catégories (C-02), étapes de la méthode avec leurs intitulés, à la place des étapes de démonstration de TK-40 (C-04), présentation du portfolio (C-05), présentation de l'accueil (C-06), récit de reconversion (C-07), trois volets du rôle en alternance (C-08), texte d'orientation (C-09), phrases d'introduction des sections et d'orientation des cartes de l'accueil (C-10) ; (2) il ne reste aucun emplacement étiqueté C-xx, ni dans les fichiers de contenu ni dans les pages construites ; (3) sans objet depuis la révision du 10/11/2026 (section « Révision du 10/11/2026 ») ; (4) la vignette et les captures du portfolio (A-12) sont optimisées dans des formats modernes, avec leurs dimensions déclarées ; chaque capture a son texte alternatif ; la vignette, décorative comme le veut la maquette EC-06, n'en a pas ; (5) sur sa branche, le contrôle du contenu de TK-28 passe en mode « staging → main » : un emplacement étiqueté bloque désormais aussi les PR vers staging, et la CI de la PR est verte dans ce mode (MF-18, SC-2.0-28).
- **Résumé** : Remplace les emplacements étiquetés par les contenus d'Alexandre, livre les images du portfolio, puis rend le contrôle du contenu bloquant sur toutes les PR. Les illustrations définitives de la méthode suivent avec TK-66.

### TK-66 — Intégration des contenus : illustrations de la méthode

- **Titre de PR** : `feat(front): add final method step illustrations`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-medium
- **Estimation** : 2 j
- **Version** : v2.0.0
- **Couvre** : EC-05, MF-21 (illustrations des étapes de la méthode, MV-08)
- **Dépend de** : TK-40, TK-55, TK-65, A-11 (C-04)
- **Vague** : W32
- **Taille** : ≈ 600 lignes (dessins en SVG : du texte, compté dans la limite) ; au-delà de 400, PR successives sur la même issue (section 1)
- **DoD** : DoD commune, et : (1) chaque étape de la méthode (C-04) a son illustration définitive, une par étape, à la place des illustrations de démonstration : dessinée par le développement, abstraite, sur le modèle des maquettes et avec les seuls jetons de la charte, sauf si Alexandre fournit les siennes (section 7) ; chacune est un composant de quatre fichiers dans fragments/illustrations-methode/, inscrit dans son registre, et la feuille de style et le test que partagent les illustrations de démonstration partent avec elles (PF-02) ; (2) chaque illustration reprend la composition des illustrations de démonstration (schéma tracé, barres), pour que le récit au défilement de TK-55 l'anime sans changement (MV-08) ; (3) elle s'affiche dans la fenêtre collante du récit au défilement et, avec les animations réduites ou sans script, sous le texte de son étape (TK-40) ; (4) une illustration qui ne fait que répéter le texte de son étape est déclarée décorative (CO-12), sinon elle porte un texte alternatif ; (5) aucun document interne, client, projet, outil interne ni dépôt d'entreprise n'y figure, contrôlé à la relecture ; (6) bout en bout : une illustration par étape, changement d'illustration au défilement, présentation réduite.
- **Résumé** : Donne à chaque étape de la méthode son illustration définitive, que la section 7 confie au développement. Ticket séparé de TK-65 parce que ses dessins, du texte, sont comptés dans la limite des 400 lignes.

### TK-67 — Socle HTTP du back : format d'erreur, en-têtes de sécurité, origine autorisée

- **Titre de PR** : `feat(back): add http foundation with error format, security headers and allowed origin`
- **Type** : feature
- **Domaine** : back
- **Priorité** : prio-critique
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : CT-08, MF-16
- **Dépend de** : TK-01, TK-06
- **Vague** : W5
- **Taille** : ≈ 390 lignes
- **DoD** : DoD commune, et : (1) toute réponse d'erreur du back, y compris 404, 405, 406, 415 et 500, suit le format d'erreur du contrat ; (2) chaque réponse porte les en-têtes de sécurité prévus par le plan du back (PB-06) ; (3) une requête venue d'une autre origine que l'origine autorisée, lue dans `CONTACT_ALLOWED_ORIGINS`, reçoit `403` au format du contrat, requête préalable comprise ; une requête préalable de l'origine autorisée reçoit les en-têtes CORS du contrat ; une requête sans `Origin` est traitée ; (4) un corps de plus de 64 Kio, annoncé ou non, est refusé par le `400` de corps illisible du contrat ; (5) le back refuse de démarrer si une origine configurée contient un joker, un chemin ou une barre finale ; (6) des tests par tranche web, avec un contrôleur de test sous `/api/v1/`, couvrent chacun de ces cas.
- **Résumé** : Pose le socle HTTP du back avant le point d'envoi : un format d'erreur unique pour toutes les réponses d'erreur, des en-têtes de sécurité sur chaque réponse, le refus de toute origine autre que l'origine autorisée et une taille de corps bornée. Le point d'envoi s'y branche ensuite (TK-16).

### TK-68 — Reprise du code : page principale provisoire, routes et pages d'erreur

- **Titre de PR** : `feat(front): serve the sections on a provisional main page`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-critique
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : CT-01, MF-04 (plan du front : PF-06 ; « Code déjà fusionné à reprendre », lignes 1 à 4 et 17, avec la part des lignes 16 et 18 qui les accompagne)
- **Dépend de** : TK-05, TK-13, TK-21
- **Vague** : W15
- **Taille** : ≈ 330 lignes
- **DoD** : DoD commune, et : (1) la route vide mène à la page principale provisoire (pages/principale), sans data.section : l'accueil, en haut et sans ancre, puis les cinq sections étiquetées — parcours, compétences, expérience, méthode de travail, projets —, chacune dans un élément section dont l'id est le nom de son ancre (parcours, competences, experience, methode, projets) et assez haute pour que la page défile ; aucune n'est différée ; plus aucune route par section (ligne 1) ; (2) les routes « cv » et « cv/404 », et la variante de la page introuvable qui leur répondait, sont retirées (ligne 2) ; (3) app.routes.server.ts pré-rend la route vide, projets/404, contact, mentions-legales et 404, plus projets/:id par getPrerenderParams ; « ** » reste rendue dans le navigateur (ligne 3) ; (4) finaliser-build.mjs place 404.html et projets/404.html, et eux seuls (ligne 4) ; (5) le banc de bout en bout ne connaît plus que les pages d'erreur de PF-06 : /projets seule y est ajoutée, avec le document que lui sert l'hébergeur, relevé par la spécification de conformité ; la conformité porte sur /contact (200 sans redirection, 307 depuis /contact/) ; /parcours et /cv répondent 404 (ligne 17) ; (6) le test unitaire des pages provisoires prend une adresse du site en exemple (ligne 16 : provisoire.spec.ts) ; le README de front/ et le commentaire de wrangler.jsonc décrivent ces routes, ces pages d'erreur et cette conformité (ligne 18 : README, lignes 401, 409, 474 et 490 à 492 ; wrangler.jsonc, ligne 12) ; (7) npm run build produit un index.html par page (index.html, contact/index.html, mentions-legales/index.html, projets/portfolio/index.html), plus 404.html et projets/404.html ; le contrôle commun du banc passe sur la page principale provisoire.
- **Résumé** : Reprend le code fusionné de W3 à W14, écrit pour une page par section : les sections deviennent des éléments d'une page principale provisoire, à leurs ancres, et le site ne sert plus que les pages et les deux pages d'erreur de PF-06. Il ouvre la reprise, avant l'en-tête (TK-27), qui a besoin de sections à suivre.

### TK-69 — Reprise du code : retrait du fichier de candidature du contenu et des en-têtes

- **Titre de PR** : `refactor(front): remove the resume file from content and headers`
- **Type** : chore
- **Domaine** : front
- **Priorité** : prio-high
- **Estimation** : 0,5 j
- **Version** : v2.0.0
- **Couvre** : CT-03 (plan du front : PF-02 et PF-09 ; « Code déjà fusionné à reprendre », lignes 5 à 7, avec la part des lignes 16 et 18 qui les accompagne)
- **Dépend de** : TK-12, TK-13
- **Vague** : W15
- **Taille** : ≈ 160 lignes
- **DoD** : DoD commune, et : (1) la règle d'en-têtes qui servait sans politique de sécurité un fichier présent sous /cv/ disparaît : sa règle dans le modèle d'en-têtes, la fonction fichiersCv, son paramètre et son test ; plus aucun fichier n'est servi sans la politique (ligne 5, PF-09) ; (2) l'index des projets ne porte plus que les projets : cvPresent disparaît du générateur, de contenu-langue.ts et du test du générateur (ligne 6, PF-02) ; (3) profil.json ne porte plus que le nom, l'intitulé et les liens : le champ du fichier et ses mentions dans le type Profil disparaissent (ligne 7, PF-02) ; (4) les pages d'essai du test des en-têtes prennent une adresse du site (ligne 16 : en-tetes.test.mjs) ; le README de front/ ne décrit plus ni cvPresent, ni la règle de ce fichier, ni son usage par les composants de formulaire et d'état (ligne 18 : README, lignes 86, 229 et 440) ; (5) plus aucune mention de public/cv/, de cvPresent ni de cv.fichier dans front/ ; les tests d'outil et unitaires sont verts.
- **Résumé** : Retire du code fusionné ce que la décision du 10/11/2026 rend sans objet, aucun document n'étant plus proposé au téléchargement : la règle d'en-têtes de ce fichier, la constante de l'index des projets et le champ du profil. Il précède le contrôle du contenu (TK-28), qui n'a plus à le chercher.

### TK-70 — Reprise du code : défilement du routeur vers les ancres

- **Titre de PR** : `feat(front): scroll to anchors below the header`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-critique
- **Estimation** : 2 j
- **Version** : v2.0.0
- **Couvre** : MF-04, V-11 (plan du front : PF-06, « Ancres » ; « Code déjà fusionné à reprendre », lignes 8 et 9)
- **Dépend de** : TK-23, TK-68
- **Vague** : W16
- **Taille** : ≈ 380 lignes ; au-delà de 400 à la réalisation, PR successives sur la même issue (section 1)
- **DoD** : DoD commune, et : (1) l'initialiseur du défilement d'app.config.ts, posé par TK-23, applique le tableau de défilement de PF-06 : il remplace aussi ViewportScroller.scrollToAnchor ; vers un élément, le défilement passe par Element.scrollIntoView({ block: "start" }), puis le focus sur l'élément sans défilement, jamais par les coordonnées de window.scrollTo (ligne 8) ; (2) défilement doux sur la page principale seulement, vers l'une de ses sections ou vers son haut, « sur la page principale » se lisant au chemin de l'adresse avant et après la navigation ; d'un coup vers une autre page, avec ou sans ancre, et quand le visiteur a demandé à réduire les animations ; au retour ou à l'avance dans l'historique, la position mémorisée, d'un coup, comme le fait déjà le routeur ; (3) après une navigation vers une ancre qui ne nomme rien, d'où que l'on vienne : en haut, d'un coup, et l'adresse perd son ancre, réécrite par History.replaceState en gardant history.state, jamais avant la fin du chargement de la page (V-11) ; l'ouverture directe sur une telle ancre vient avec TK-27 ; (4) html porte scroll-padding-top: 5.5rem dans _base.scss : toute ancre s'ouvre sous l'en-tête, à l'ouverture par le navigateur comme après le démarrage ; le commentaire de _mouvement.scss est à jour, scroll-behavior gardé sous no-preference (ligne 9) ; (5) tests unitaires avec le vrai routeur, ses vraies routes et sa configuration, comme app.config.spec.ts : un test par ligne du tableau, sur la page principale et sur les pages à part, animations réduites comprises, dont l'ancre qui ne nomme rien visée depuis une autre page ; plus aucune navigation de test vers /parcours ni /competences ; (6) le README de front/ décrit le défilement de PF-06.
- **Résumé** : Reprend le défilement du routeur posé par TK-23, qui menait à une ancre par coordonnées, sans décalage sous l'en-tête : une ancre s'ouvre sous l'en-tête, en défilement doux sur la page principale et d'un coup ailleurs, et une ancre qui ne nomme rien ramène en haut. L'en-tête (TK-27) et chaque section s'appuient dessus.

### TK-71 — Reprise du code : entrée courante du lien et ancre de la carte

- **Titre de PR** : `feat(front): add location state to links and anchors to cards`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-high
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : CO-02, CO-05 (plan du front : PF-06 ; « Code déjà fusionné à reprendre », lignes 10 et 11, avec la part des lignes 16 et 18 qui les accompagne)
- **Dépend de** : TK-15, TK-26
- **Vague** : W16
- **Taille** : ≈ 220 lignes
- **DoD** : DoD commune, et : (1) le lien (CO-02) : courant prend « page » ou « location » et pose aria-current à cette valeur ; la couleur et le trait d'accent de l'entrée courante valent pour les deux (ligne 10) ; (2) la carte interactive (CO-05) reçoit, en plus de son adresse, l'ancre et le remplacement d'adresse de son lien du routeur (fragment, replaceUrl), pour qu'une carte de l'accueil fasse défiler la page jusqu'à sa section sans étape d'historique (PF-06) ; ses exemples prennent des adresses du site (ligne 11) ; (3) les tests unitaires du lien et du bouton prennent en exemple des adresses du site (/contact, /mentions-legales), sans page retirée ni son libellé (ligne 16 : lien.spec.ts et bouton.spec.ts) ; le README de front/ décrit les deux valeurs de courant et l'exemple de carte (ligne 18 : README, lignes 121 et 207) ; (4) les valeurs brutes que la charte révisée reprend des maquettes et que ces composants emploient — décalage du soulignement et proportions de la flèche externe du lien, taille de l'icône, 1,25 fois le texte — deviennent des jetons de rôle, en fin de _jetons.scss (report du 10/11/2026) ; (5) tests unitaires : aria-current à « page » et à « location », avec le même trait ; carte avec ancre et remplacement d'adresse.
- **Résumé** : Donne au lien et à la carte ce que la page principale leur demande : le lien signale la section lue comme la page affichée, la carte mène à une ancre sans étape d'historique. L'en-tête (TK-27) et l'accueil (TK-33) s'en servent.

### TK-72 — Reprise du code : en-tête de section, typographie, largeur du texte et fenêtre factice

- **Titre de PR** : `feat(front): apply the one-page design choices to section headers, type and window`
- **Type** : feature
- **Domaine** : front
- **Priorité** : prio-high
- **Estimation** : 1 j
- **Version** : v2.0.0
- **Couvre** : CO-12, CO-16 ; charte, sections 4 et 5, choix 1, 3, 4 et 5 du 10/11/2026 (plan du front : « Code déjà fusionné à reprendre », lignes 12 à 15)
- **Dépend de** : TK-10, TK-11, TK-17, TK-25
- **Vague** : W17
- **Taille** : ≈ 220 lignes
- **DoD** : DoD commune, et : (1) l'en-tête de section (CO-16) : numero facultatif, et sans lui une étiquette sans numéro ni filet ; niveau 1, 2 ou 3 ; titre à taille-titre-1 pour une section de la page principale ou une page à part, à taille-titre-2 pour un bloc ; commentaire « environ 68 caractères » (ligne 12, choix 4 et 5) ; (2) la césure vaut aussi pour un h2 à taille-titre-1, et la règle globale de h2 laisse passer taille-titre-1 pour un titre de section (ligne 13, choix 5) ; (3) --conteneur-texte vaut 54ch, environ 68 caractères par ligne (ligne 14, choix 3) ; (4) le titre et l'adresse de la fenêtre factice passent à taille-code (14 px), coupés d'une ellipse (ligne 15, choix 1) ; (5) la largeur de 56rem de l'en-tête de section, valeur brute que la charte révisée reprend des maquettes, devient un jeton de rôle, en fin de _jetons.scss (report du 10/11/2026) ; (6) tests unitaires de l'en-tête de section : avec et sans numéro, niveaux 1 à 3, titre de section et titre de bloc ; le README de front/ suit.
- **Résumé** : Applique au code déjà livré quatre choix de design du 10/11/2026 : un en-tête de section numéroté ou non, au titre de la bonne taille, un texte courant d'environ 68 caractères par ligne et une fenêtre factice dont le titre ne descend plus sous 14 px. Les sections (TK-33 à TK-40), la fiche d'un projet et le contact s'en servent.

## 3. Vagues de réalisation

| Vague | Tickets | Ce que la vague démontre |
| --- | --- | --- |
| W1 | TK-01 — Contrat d'API du formulaire de contact ; TK-02 — Points de charte laissés par les maquettes | Le flux de contact a un contrat signé ; la charte n'a plus de point ouvert. |
| W2 | TK-03 — Plan d'implémentation du back ; TK-04 — Plan d'implémentation du front | Plus rien n'est à trancher pour coder : les deux plans d'implémentation sont signés. |
| W3 | TK-05 — Mise en place du front | Première vague de code, à un seul ticket : le front produit un document HTML par adresse, aux versions de CT-02. |
| W4 | TK-06 — Mise en place du back ; TK-08 — Retrait de l'ancien site | Le back démarre, aux versions de CT-02 ; staging ne contient plus que la refonte. |
| W5 | TK-07 — Intégration continue du front et du back ; TK-67 — Socle HTTP du back : format d'erreur, en-têtes de sécurité, origine autorisée | Chaque PR est vérifiée par la CI, pour le front comme pour le back ; le back répond au format d'erreur du contrat, avec ses en-têtes de sécurité, et refuse toute origine autre que l'origine autorisée. |
| W6 | TK-09 — Robot de mises à jour des dépendances ; TK-10 — Jetons de la charte | Les dépendances sont suivies par le robot ; la charte existe en jetons dans le front. |
| W7 | TK-11 — Typographie, polices et mise en page de base ; TK-12 — Modèle de contenu et fichiers de contenu | Les pages ont la typographie de la charte ; le contenu se lit au build depuis des fichiers typés. |
| W8 | TK-13 — Hébergement du front et préversions ; TK-14 — Image Docker du back | Chaque branche a sa préversion, avec une vraie 404 ; le back tient dans une image dont le démarrage à froid est mesuré. |
| W9 | TK-15 — Composants bouton et lien ; TK-16 — API de contact : validation et point d'envoi | Les composants d'action existent ; le back revalide un message. |
| W10 | TK-17 — Composants de texte ; TK-18 — Jeton de formulaire | Les composants de texte existent ; le back délivre un jeton signé. |
| W11 | TK-19 — Composants de formulaire et d'état ; TK-20 — Adaptateur d'envoi Brevo | Les composants du formulaire existent ; le back remet un message au prestataire (simulé en test). |
| W12 | TK-21 — Banc de tests de bout en bout et d'accessibilité ; TK-22 — Chaîne de filtres contre les messages indésirables | Le front se teste de bout en bout sur trois moteurs ; le back filtre les messages indésirables. |
| W13 | TK-23 — Socle du mouvement ; TK-24 — Back en préproduction | Aucune animation ne peut plus cacher le contenu ; le back tourne en préproduction et son réveil réel est mesuré. |
| W14 | TK-25 — Composant fenêtre factice ; TK-26 — Composants carte et arrière-plan d'ambiance | Tous les composants qu'assemblent les écrans sont prêts. |
| W15 | TK-68 — Reprise du code : page principale provisoire, routes et pages d'erreur ; TK-69 — Reprise du code : retrait du fichier de candidature du contenu et des en-têtes | Les sections sont des éléments d'une page principale provisoire, à leurs ancres ; le site ne sert plus que les pages et les deux pages d'erreur du site en une page. |
| W16 | TK-70 — Reprise du code : défilement du routeur vers les ancres ; TK-71 — Reprise du code : entrée courante du lien et ancre de la carte | Une ancre s'ouvre sous l'en-tête ; le lien sait signaler la section lue, et la carte mener à une ancre sans étape d'historique. |
| W17 | TK-72 — Reprise du code : en-tête de section, typographie, largeur du texte et fenêtre factice ; TK-28 — Contrôle automatique du contenu | Le code déjà livré suit les choix de design du 10/11/2026 ; un contenu incomplet ou qui se périme fait échouer la CI. |
| W18 | TK-27 — En-tête, navigation et lien d'évitement ; TK-32 — Composant frise chronologique | Chaque page a son en-tête : le contact à un clic partout, une navigation qui fait défiler la page principale et signale la section lue ; la frise est prête. |
| W19 | TK-29 — Menu replié ; TK-30 — Pied de page | Le cadre commun (EC-00) est complet, sur téléphone comme sur ordinateur. |
| W20 | TK-31 — Mentions légales et page introuvable ; TK-33 — Section Accueil | Une adresse inconnue mène à une vraie page introuvable ; les mentions légales existent ; l'accueil ouvre la page principale. |
| W21 | TK-34 — Section Parcours ; TK-35 — Section Compétences | Le parcours et les compétences se lisent sur la page principale. |
| W22 | TK-36 — Section Expérience ; TK-37 — Écran Fiche d'un projet | L'expérience se lit ; la fiche du portfolio est en ligne en préproduction. |
| W23 | TK-39 — Section Liste des projets ; TK-40 — Section Méthode de travail | La page principale est complète : la méthode, qui mène à la fiche du portfolio, et les projets. |
| W24 | TK-41 — Écran Contact : formulaire et validation ; TK-42 — Client du contrat d'API | Le formulaire se valide dans le navigateur ; le client du contrat est prêt. |
| W25 | TK-43 — Envoi du formulaire et ses états ; TK-44 — Plan du site, robots.txt et non-indexation des préversions | Un message part du formulaire jusqu'au back de préproduction ; le site est indexable, ses préversions ne le sont pas. |
| W26 | TK-45 — Textes légaux et information sur les données ; TK-46 — Balises de référencement et aperçu au partage | Les textes légaux sont validés ; les pages ont leurs balises et leur aperçu de partage. |
| W27 | TK-47 — Test d'ajout d'un projet ; TK-48 — Apparitions en cascade | Un projet s'ajoute sans toucher au reste ; les sections et les pages apparaissent en cascade. |
| W28 | TK-49 — Contrôles de mise en production et surveillance quotidienne ; TK-50 — Halos qui respirent et pause des animations | Une panne se voit en un jour ; la lumière du fond respire et se met en pause. |
| W29 | TK-51 — Tracés et survols vivants ; TK-52 — Transitions entre pages | Tracés, survols et fondu entre deux pages. |
| W30 | TK-53 — Frise tracée au défilement ; TK-54 — Fenêtre « profil.ts » qui s'écrit et titre révélé | La frise se trace à la lecture ; l'accueil s'écrit et révèle son titre. |
| W31 | TK-55 — Récit au défilement de la méthode ; TK-65 — Intégration des contenus d'Alexandre : textes et images du portfolio | La méthode se raconte au défilement ; les contenus d'Alexandre et les images du portfolio remplacent les emplacements étiquetés. |
| W32 | TK-56 — Redirection des anciennes adresses ; TK-66 — Intégration des contenus : illustrations de la méthode | Les anciennes adresses mènent aux sections de la v2 ; chaque étape de la méthode a son illustration définitive. |
| W33 | TK-57 — Budget de performance et mesure au lot des écrans | Le site complet, contenus et mouvement compris, tient le budget de performance. |
| W34 | TK-58 — Passe manuelle avant la recette | La préproduction est prête pour la recette. |
| W35 | TK-59 — Production et bascule de la v2.0.0 | La v2.0.0 est en production. |

Chemin critique, la plus longue chaîne de dépendances entre tickets : TK-01 → TK-04 → TK-05 → TK-10 → TK-11 → TK-15 → TK-26 → TK-71 → TK-27 → TK-37 → TK-39 → TK-48 → TK-51 → TK-57 → TK-58 → TK-59 (16 tickets) : depuis la révision du 10/11/2026, la reprise du code passe entre les composants et l'en-tête. Les autres tickets ont du jeu ; c'est la limite de deux tickets par vague, et d'un seul pour la première vague de code, qui porte la liste à 35 vagues. Les tâches d'Alexandre s'y ajoutent : leur échéancier est à la fin de la section 4.

## 4. Ce qui incombe à Alexandre

Ces tâches ne sont pas des tickets : elles demandent ses comptes, ses accès, ses contenus ou ses décisions. Un ticket qui en dépend les cite dans « Dépend de », avec la mention « (pour finir) » quand la tâche se fait pendant le ticket ; « recette » veut dire que la tâche doit être faite avant la recette de l'Étape 7 (A-19).

- **A-01** — Répondre à Q-10 : le contact passe-t-il par le formulaire à cinq champs obligatoires, hypothèse sur laquelle repose la conception technique, et dans quelle boîte arrivent les messages ? Une autre réponse rouvrirait CT-06 à CT-08 ; bloque : TK-01
- **A-02** — Dans les réglages du dépôt GitHub : protéger staging et main en exigeant une CI verte avant fusion (CT-09), activer la protection à l'envoi des secrets et vérifier que l'analyse des secrets et les alertes de dépendances sont actives (section 7 de la conception technique) ; bloque : TK-07, TK-09
- **A-03** — Ouvrir le compte Cloudflare et y raccorder le dépôt pour les builds et les préversions par branche des ressources statiques des Workers (CT-05, CT-09, D-02), sans jeton de déploiement dans les secrets de la CI ; y régler main comme branche de production, réglage inerte jusqu'à la bascule : main ne contient pas front/ avant la fusion de staging dans main, et aucun domaine du site n'est rattaché au front avant A-20 ; bloque : TK-13
- **A-04** — Créer le service de préproduction du back en W13, entre les deux PR de TK-24, par un Blueprint de Render relié à staging, qui lit le fichier back/render.yaml de la première PR une fois celle-ci fusionnée : instance gratuite, région Francfort, raccordé au dépôt, branché sur staging, déployé seulement après une CI verte ; y saisir à la création les variables d'environnement — clé d'API de Brevo, adresse de destination, qui est la boîte qu'Alexandre désigne (D-05) et ne figure jamais dans le dépôt, adresse d'expédition du domaine, origine autorisée, qui est l'origine de la préversion staging, relevée dans la console de Cloudflare après le premier build de staging — sans y poser le secret de signature des jetons, que Render tire lui-même, ni les seuils de D-07, qui ne se saisissent que pour changer une valeur de départ ; une fois le service créé, poser son adresse technique chez Cloudflare comme variable de build de préproduction ; activer les notifications d'échec de déploiement et de suspension (CT-14) ; bloque : TK-24, TK-42
- **A-05** — Ouvrir le compte Brevo, obtenir son approbation pour l'envoi (300 e-mails par jour une fois le compte approuvé) et créer la clé d'API, posée seulement dans les variables d'environnement de Render (CT-07) ; bloque : TK-24
- **A-06** — Répondre à Q-06 : quelles compétences techniques et humaines afficher, et faut-il un niveau pour chacune ? Hypothèse retenue : celles de C-02, sans niveau ; un niveau ajouterait un champ facultatif ; bloque : TK-35
- **A-07** — Répondre à Q-07 : quel CV proposer ? (retirée le 12/11/2026) Statut : retirée le 12/11/2026, décision d'Alexandre du 10/11/2026 : plus de CV sur le site. Son texte entier se lit dans le backlog signé le 28/10/2026 (PR #91).
- **A-08** — Répondre à Q-15 : les technologies pratiquées en entreprise peuvent-elles être nommées comme compétences ? Hypothèse retenue : oui, jamais les outils internes, projets, clients ni dépôts ; la réponse ne touche que le contenu ; bloque : recette
- **A-09** — Déplacer la zone DNS du domaine chez Cloudflare, registraire OVH inchangé (D-03), selon la procédure DNSSEC de CT-13, exécutée par Alexandre dans cet ordre : (1) créer la zone chez Cloudflare, y recopier les enregistrements existants et abaisser leur durée de mise en cache, aucune messagerie n'étant à préserver (D-09) ; (2) désactiver DNSSEC chez OVH, ce qui retire l'enregistrement DS, effectif sous 24 heures selon OVH ; (3) vérifier par une requête publique que le domaine ne publie plus de DS, puis attendre encore au moins un TTL du DS, et jusqu'à une fois et demie selon Cloudflare ; (4) changer les serveurs de noms chez OVH pour ceux de Cloudflare, sans en garder d'autres ; (5) attendre que le TTL des anciens enregistrements de serveurs de noms soit écoulé et que Cloudflare voie la zone active, puis vérifier que l'ancien site répond comme avant ; (6) activer DNSSEC chez Cloudflare, qui fournit un nouveau DS, et publier ce DS chez OVH, dans l'onglet des enregistrements DS, qui n'apparaît qu'avec des serveurs DNS externes ; (7) vérifier par une requête publique que le nouveau DS est publié et que le domaine se résout. Entre (2) et (6), le domaine n'est pas protégé par DNSSEC. Retour arrière par le chemin inverse : retirer chez OVH le DS de Cloudflare, attendre au moins un TTL du DS, remettre les serveurs de noms d'OVH, dont la zone doit alors contenir les enregistrements voulus (sous-domaine du back, authentification de l'envoi), attendre que le TTL des serveurs de noms de Cloudflare soit écoulé, puis réactiver DNSSEC chez OVH. Sans cette procédure, le domaine devient injoignable pour les résolveurs qui valident DNSSEC ; bloque : TK-58, TK-59
- **A-10** — Authentifier le domaine d'envoi chez Brevo selon sa procédure (SPF, DKIM, DMARC), une fois la zone Cloudflare active, après l'étape (5) de A-09 : la politique SPF recopiée d'OVH est remplacée et non doublée, un domaine n'ayant qu'une politique SPF, et l'autorisation d'OVH n'a pas à être gardée (D-09) ; bloque : TK-58
- **A-11** — Fournir les contenus C-01, C-02 et C-04 à C-10 : C-01, les périodes encore manquantes (reconversion ; bac+3 avec son intitulé, son établissement et sa période ; début du master) ; C-02, les compétences et leurs catégories ; C-04, la méthode, découpée en étapes avec leurs intitulés pour la section Méthode ; C-05, la présentation du portfolio comme projet ; C-06, la présentation de l'accueil ; C-07, le récit de reconversion ; C-08, les trois volets du rôle en alternance ; C-09, le texte d'orientation ; C-10, les phrases d'introduction des sections et d'orientation des cartes de l'accueil. Un contenu manquant ne bloque pas le développement des écrans, qui avance avec des emplacements étiquetés ; il bloque son intégration (TK-65, TK-66), donc la passe manuelle et la recette ; bloque : TK-65, TK-66
- **A-12** — Fournir la vignette du projet portfolio — une image de plus à fournir par projet (choix C2), sans identifiant C-xx aujourd'hui ; décorative comme le veut la maquette EC-06, elle ne demande pas de texte alternatif — et ses captures éventuelles, chacune avec son texte alternatif (C-05) ; bloque : TK-65
- **A-13** — Valider dans la PR de TK-45 le texte de l'information sur les données (D-10 : base légale, durée de conservation, transferts hors de l'Union européenne, droits), celui des mentions légales (MF-19) et celui de la page introuvable ; bloque : TK-45
- **A-14** — Valider les cibles des redirections des anciennes adresses (D-13), que le parcours d'écrans n'a pas fixées, sur la proposition écrite dans TK-56. Tranchée par Alexandre le 12/11/2026 : /about vers /#parcours, /arcade vers /#projets, /competence/… vers /#projets, l'accueil reste l'accueil, toute autre ancienne adresse donne la page introuvable ; bloque : TK-56
- **A-15** — Si le délai mesuré entre le réveil du back et sa réponse dépasse 60 secondes (TK-24, puis TK-58), trancher D-04 : garder l'instance gratuite ou passer à l'instance payante sans veille, à 7 $ par mois, hors du budget du 15/10/2026 ; bloque : recette
- **A-16** — Ouvrir le compte gratuit UptimeRobot (D-14) et créer la sonde externe du front de production, toutes les 5 minutes, avec alerte par e-mail ; aucune sonde sur le back, qui ne doit pas être tenu éveillé (CT-14) ; bloque : TK-59
- **A-17** — Vérifier le domaine dans la Search Console de Google par un enregistrement DNS dans la zone Cloudflare, puis, après la bascule, y soumettre le plan du site (CT-11) ; bloque : TK-59
- **A-18** — Activer le renouvellement automatique du domaine chez OVH, recommandé par la conception technique (section 9) ; bloque : TK-59
- **A-19** — Recetter la v2.0.0 sur la préproduction (Étape 7), une fois la passe manuelle faite (TK-58), et signer la recette ; bloque : TK-59
- **A-20** — Faire les gestes de la bascule qui lui reviennent (section 6 de la conception technique) : fusionner la PR de staging vers main et poser le tag annoté v2.0.0 ; juste après le tag qui publie la première image du back, rendre public, une fois et sans retour, le paquet de cette image dans le registre de conteneurs de GitHub ; une fois la production déployée, rattacher www et le domaine nu au front comme domaines personnalisés et poser la règle de la zone Cloudflare qui redirige le domaine nu vers www, comme le décrit le README de front/, sans toucher aux serveurs de noms ni à DNSSEC ; en cas de problème, détacher ces domaines et remettre les anciens enregistrements vers OVH ; bloque : TK-59
- **A-21** — Résilier l'hébergement mutualisé OVH 30 jours après la bascule (D-15), une fois la période de retour arrière passée ; aucune messagerie n'est à préserver (D-09) et le domaine reste chez OVH ; bloque : TK-62
- **A-22** — Identifier l'hébergement de l'ancien back et révoquer les identifiants d'envoi qu'il utilise, avant l'archivage de son dépôt séparé (section 10 de la conception technique) ; bloque : TK-62
- **A-23** — Relever les messages indésirables reçus pendant les premières semaines de production et les comparer au seuil de renfort de CT-08 : plus de 5 par semaine, deux semaines de suite (D-06) ; bloque : TK-63
- **A-24** — Définir le choix de la langue et fournir ou valider les textes anglais avant la v2.0.1 (MF-23) ; bloque : TK-60
- **A-25** — Décider du lancement du lot VPS et choisir le VPS loué (décision du 15/10/2026 : lot séparé, après la v2.0.0) ; bloque : TK-61
- **A-26** — Créer chez Render le service de production du back, au moment de la bascule, une fois staging fusionné dans main (section 6 de la conception technique, étape 4 : les déploiements de production ne sont reliés à main qu'à ce moment), par un second Blueprint de Render relié à main, qui lit le fichier back/render-production.yaml : instance gratuite, région Francfort, raccordé au dépôt, branché sur main, déployé seulement après une CI verte ; l'origine autorisée de production et le sous-domaine du back, rattaché au service comme domaine personnalisé, viennent du fichier, et le secret de signature des jetons, distinct de celui de la préproduction, est tiré par Render ; y saisir les variables d'environnement de production que Render demande à la création : clé d'API de Brevo, adresse de destination (D-05), qui ne figure jamais dans le dépôt, et adresse d'expédition du domaine ; les seuils de D-07 ne se saisissent que pour changer une valeur de départ ; activer les notifications d'échec de déploiement et de suspension (CT-14) ; créer l'enregistrement du sous-domaine du back dans la zone Cloudflare, en « DNS seulement » (CT-13), après A-09 ; bloque : TK-59
- **A-27** — Ouvrir le compte Render, pour une instance gratuite en région Francfort (disponibilité de l'instance gratuite dans cette région à vérifier), avant W13 : le service de préproduction n'est créé qu'en W13, par A-04 ; bloque : TK-24

Échéancier, d'après les dépendances des tickets : avant W1, A-01 ; pendant W5, A-02 ; avant W8, A-03 ; avant W13, A-05 et A-27 ; pendant W13, A-04 (entre les deux PR de TK-24) ; avant W21, A-06 ; pendant W26, A-13 ; avant W31, A-11 et A-12 ; avant W32, A-14, tranchée le 12/11/2026 ; avant W34, A-09 et A-10 ; avant W35, A-18 ; pendant W35, A-16, A-17, A-19, A-20 et A-26 ; avant la recette, A-08 et A-15 ; après la v2.0.0, A-21, A-22, A-23, A-24 et A-25. A-09 demande plusieurs jours d'attente (24 heures chez OVH, puis au moins un TTL du DS) et précède A-10 : mieux vaut la commencer dès la signature de ce document.

## 5. Matrice de couverture

Tickets v2.0.0 qui réalisent chaque élément, d'après leur champ « Couvre » ; un ticket après-v2 est signalé comme tel.

### Micro-fonctions

| MF | Intitulé | Tickets |
| --- | --- | --- |
| MF-01 | Page d'accueil qui présente Alexandre | TK-33, TK-46, TK-65 |
| MF-02 | Contact accessible en permanence | TK-27, TK-33 |
| MF-03 | Navigation entre les sections | TK-27, TK-29 |
| MF-04 | Liens directs vers les sections et les pages | TK-13, TK-27, TK-31, TK-33, TK-34, TK-35, TK-36, TK-37, TK-39, TK-40, TK-41, TK-56, TK-68, TK-70 |
| MF-05 | Page introuvable | TK-31 |
| MF-06 | Consultation sur téléphone | TK-29, TK-39, TK-41 |
| MF-07 | Parcours d'Alexandre | TK-34, TK-65 |
| MF-08 | Orientation vers l'architecture logicielle | TK-34, TK-65 |
| MF-09 | Compétences techniques | TK-35, TK-65 |
| MF-10 | Compétences humaines et reconversion | TK-35, TK-65 |
| MF-11 | Rôle chez OSOL | TK-36, TK-65 |
| MF-12 | Liste des projets | TK-39 |
| MF-13 | Fiche d'un projet | TK-37 |
| MF-14 | Ajouter un projet sans toucher au reste du site | TK-47 |
| MF-16 | Envoyer un message à Alexandre | TK-16, TK-20, TK-22, TK-41, TK-42, TK-43, TK-67 |
| MF-17 | Liens vers les profils externes | TK-15, TK-30, TK-46 |
| MF-18 | Aucune information qui se périme | TK-28, TK-30, TK-32, TK-33, TK-34, TK-36, TK-65 |
| MF-19 | Mentions légales | TK-30, TK-31, TK-45 |
| MF-20 | Information sur l'usage des données du formulaire | TK-41, TK-45 |
| MF-21 | Méthodologie de travail | TK-40, TK-65, TK-66 |
| MF-22 | Le portfolio présenté comme projet | TK-37, TK-39, TK-65 |
| MF-23 | Version anglaise (v2.0.1) | TK-60 (après-v2) |

### Scénarios

| Scénario | Intitulé | Tickets |
| --- | --- | --- |
| SC-2.0-01 | Arrivée sur la page d'accueil | TK-33 |
| SC-2.0-02 | Contact atteint depuis l'accueil | TK-27, TK-33 |
| SC-2.0-03 | Contact atteint depuis une fiche projet | TK-27, TK-37 |
| SC-2.0-04 | Navigation entre les sections | TK-27, TK-29 |
| SC-2.0-05 | Lien direct vers une section, le contact ou les mentions légales | TK-27, TK-31, TK-33, TK-34, TK-35, TK-36, TK-37, TK-39, TK-40, TK-41 |
| SC-2.0-06 | Lien direct vers la fiche d'un projet | TK-37 |
| SC-2.0-07 | Lien direct vers un projet qui n'existe pas | TK-31 |
| SC-2.0-08 | Adresse inconnue | TK-31 |
| SC-2.0-09 | Consultation sur téléphone | TK-29, TK-41, TK-43, TK-58 |
| SC-2.0-10 | Parcours d'Alexandre | TK-34 |
| SC-2.0-11 | Orientation vers l'architecture logicielle | TK-34 |
| SC-2.0-12 | Compétences techniques | TK-35 |
| SC-2.0-13 | Compétences humaines et reconversion | TK-35 |
| SC-2.0-14 | Rôle chez OSOL | TK-36 |
| SC-2.0-15 | Liste des projets | TK-39 |
| SC-2.0-16 | Fiche d'un projet complet | TK-37 |
| SC-2.0-17 | Fiche d'un projet sans lien vers son code source | TK-37 |
| SC-2.0-18 | Fiche d'un projet sans capture | TK-37 |
| SC-2.0-19 | Ajout d'un projet | TK-47 |
| SC-2.0-20 | Lien direct vers un projet ajouté | TK-47 |
| SC-2.0-23 | Envoi d'un message de contact | TK-20, TK-43, TK-58 |
| SC-2.0-24 | Champ obligatoire vide | TK-16, TK-41 |
| SC-2.0-25 | Email invalide | TK-16, TK-41 |
| SC-2.0-26 | Envoi qui échoue | TK-20, TK-43 |
| SC-2.0-27 | Liens vers les profils externes | TK-30, TK-58 |
| SC-2.0-28 | Aucune information qui se périme | TK-28, TK-33, TK-58, TK-65 |
| SC-2.0-29 | Accès aux mentions légales | TK-30, TK-31, TK-45 |
| SC-2.0-30 | Information sur l'usage des données du formulaire | TK-41, TK-45 |
| SC-2.0-31 | Méthodologie de travail | TK-40 |
| SC-2.0-32 | Le portfolio présenté comme projet | TK-37 |

### Sections et écrans

| Section ou écran | Nom | Tickets |
| --- | --- | --- |
| EC-00 | Éléments communs | TK-27, TK-29, TK-30, TK-50, TK-52 |
| EC-01 | Accueil | TK-33, TK-48, TK-51, TK-54 |
| EC-02 | Parcours | TK-34, TK-48, TK-53 |
| EC-03 | Compétences | TK-35, TK-48 |
| EC-04 | Expérience | TK-36, TK-48 |
| EC-05 | Méthode de travail | TK-40, TK-48, TK-55, TK-66 |
| EC-06 | Liste des projets | TK-39, TK-48, TK-51 |
| EC-07 | Fiche d'un projet | TK-37, TK-48 |
| EC-09 | Contact | TK-41, TK-43, TK-48 |
| EC-10 | Mentions légales | TK-31, TK-48 |
| EC-11 | Page introuvable | TK-31, TK-48 |

### Choix structurants et décisions de la conception technique

- CT-01 — Mode de rendu du front : TK-04, TK-05, TK-13, TK-37, TK-68
- CT-02 — Versions et fenêtres de support : TK-05, TK-06, TK-09, TK-64 (après-v2)
- CT-03 — Contenu en fichiers versionnés : TK-04, TK-12, TK-28, TK-65, TK-69
- CT-04 — Préparation de la version anglaise : TK-04, TK-05, TK-12, TK-32, TK-60 (après-v2)
- CT-05 — Hébergement du front : TK-13, TK-56, TK-61 (après-v2), A-03
- CT-06 — Hébergement du back : TK-03, TK-14, TK-24, TK-61 (après-v2), A-04, A-26, A-27
- CT-07 — Envoi des e-mails : TK-01, TK-03, TK-20, A-05, A-10
- CT-08 — Protection contre les messages indésirables : TK-01, TK-03, TK-16, TK-18, TK-22, TK-42, TK-43, TK-58, TK-63 (après-v2), TK-67
- CT-09 — Intégration et déploiement continus : TK-07, TK-09, TK-14, TK-24, TK-59, A-02, A-03
- CT-10 — Stratégie de tests : TK-04, TK-07, TK-21, TK-28, TK-57
- CT-11 — Référencement et aperçu au partage : TK-04, TK-44, TK-46, A-17
- CT-12 — Données personnelles du formulaire : TK-03, TK-11, TK-20, TK-22, TK-45
- CT-13 — Zone DNS du domaine : TK-59, A-09, A-10, A-20, A-26
- CT-14 — Surveillance du site en production : TK-03, TK-49, TK-59, A-04, A-16, A-26
- D-01 — Versions : TK-05, TK-06
- D-02 — Hébergeur du front : TK-13, A-03
- D-03 — Zone DNS chez Cloudflare : TK-59, A-09
- D-04 — Instance gratuite du back : TK-14, TK-24, TK-58, A-15
- D-05 — Prestataire d'envoi et boîte de réception : TK-20, TK-24, A-04
- D-06 — Protection native, ALTCHA en renfort : TK-03, TK-22, TK-63 (après-v2), A-23
- D-07 — Valeurs de départ : TK-01, TK-03, TK-18, TK-20, TK-22, TK-42
- D-08 — Nom d'hôte canonique www : TK-44, TK-46, TK-59
- D-09 — Messagerie du domaine : A-09, A-10, A-21
- D-10 — Conservation et information sur les données : TK-45, A-13
- D-11 — Seuils de rapidité : TK-57
- D-12 — Contenus sans identifiant : TK-12, TK-65, A-11
- D-13 — Anciennes adresses : TK-56, A-14
- D-14 — Surveillance (UptimeRobot) : A-16
- D-15 — Retour arrière de 30 jours : TK-59, A-21

## 6. Hors v2.0.0

Ces tickets portent le label après-v2. Ils sont créés pour tracer ce qui est décidé mais n'appartient pas à la v2.0.0 ; ils n'ont pas de vague et ne sont développés qu'après la mise en production de la v2.0.0. Chacun sera réestimé, et découpé en tickets de 400 lignes au plus, au moment de le planifier.

- TK-60 — Version anglaise (prio-medium ; 1 semaine et + ; couvre : MF-23, CT-04). Trace la version anglaise décidée pour la v2.0.1 (MF-23), que la v2.0.0 prépare par le marquage des libellés et le rangement du contenu par langue (CT-04).
- TK-61 — Lot VPS (prio-low ; 1 semaine et + ; couvre : CT-05, CT-06). Trace la migration vers un VPS loué, décidée le 15/10/2026 comme un lot séparé, postérieur à la v2.0.0.
- TK-62 — Archivage de l'ancien back (prio-medium ; 0,5 j ; couvre : —). Trace la dernière étape de la bascule : l'ancien back et son dépôt séparé disparaissent après la v2.0.0. Ticket de suivi, sans PR dans ce dépôt.
- TK-63 — Renfort contre les messages indésirables (prio-low ; 2 j ; couvre : CT-08, D-06). Trace le renfort prévu par D-06, à n'engager que si la protection native ne suffit pas en production.
- TK-64 — Entretien annuel (prio-medium ; 1 j ; couvre : CT-02). Trace l'entretien court que la conception technique prévoit chaque année pour tenir les deux ans visés.

## 7. Points à valider par Alexandre

La signature de ce document tranche les points suivants, tous pris faute de référentiel ou proposés :

- Les estimations : 66 tickets v2.0.0, à raison de 6 tickets à 0,5 j, 39 tickets à 1 j, 21 tickets à 2 j, en jours d'effort d'un développeur. Total des estimations v2.0.0 : 84 j. Ce sont des propositions, pas des mesures, et aucune date de livraison n'en découle.
- Les priorités, dont trois choix : TK-02 (points de charte) est en prio-low, mais passe en première vague parce que les jetons et l'en-tête en reprennent les valeurs ; les halos et la pause des animations (TK-50) sont en prio-high, parce que la respiration des halos sans moyen de pause enfreindrait le critère WCAG 2.2.2, de niveau A ; les tracés et survols (TK-51) et les transitions entre pages (TK-52) sont en prio-medium, parce que le budget de performance (TK-57), qui précède la mise en production, les attend : TK-51 est sur le chemin critique.
- L'ordre des vagues : 35 vagues de deux tickets au plus. La première vague de code (W3) ne contient que la mise en place du front (TK-05) ; le back passe tôt (W4 et W5, puis W8 à W13), pour mesurer dès W13 le réveil réel de l'instance gratuite et trancher D-04 avant les écrans ; la reprise du code déjà fusionné (W15 à W17) précède l'en-tête (W18) ; les motifs de mouvement passent après les sections et les pages qu'ils animent (W27 à W31), leur socle étant posé dès W13 ; les contenus d'Alexandre sont intégrés en W31 et W32, puis le budget de performance est mesuré sur le site complet (W33) ; la passe manuelle et la bascule ferment la liste (W34, W35).
- Le contrat d'API (TK-01) attend la réponse à Q-10 (A-01), parce que ses cinq champs en dépendent ; une réponse à la signature de ce document ne retarde rien.
- Une précision de la règle des 400 lignes, proposée faute de règle écrite : les fichiers binaires ne comptent pas. Le retrait de my-portfolio/ (TK-08, environ 1 780 lignes retirées hors lockfile), PR qui ne fait que supprimer un dossier entier, est hors de la limite par décision d'Alexandre du 27/10/2026 (section 1) : ce point n'est plus à valider.
- Le contrôle du contenu (TK-28) a deux modes : sur une PR vers staging, les emplacements étiquetés sont signalés sans bloquer ; sur la PR de staging vers main, ils bloquent. Sans ce choix, la CI resterait rouge jusqu'à la livraison des contenus. Une fois les contenus intégrés, TK-65 passe le contrôle en mode « staging → main » sur toutes les PR.
- L'intégration des contenus d'Alexandre est découpée en deux tickets : TK-65 (textes C-01, C-02 et C-04 à C-10, vignette et captures du portfolio, passage du contrôle du contenu en mode « staging → main ») et TK-66 (illustrations de la méthode), parce que les illustrations, dessinées en SVG, sont du texte compté dans la limite des 400 lignes et la feraient dépasser. Si les textes fournis font dépasser 400 lignes à TK-65, la vignette et les captures passent dans un ticket à part avant l'ouverture de sa PR.
- Un ticket docs de l'Étape 6 se ferme à sa fusion signée, puisqu'il ne se déploie pas ; les autres tickets v2.0.0 se ferment à la bascule.
- Le modèle de contenu (TK-12) ajoute à la section 5 de la conception technique ce que les maquettes ont introduit : la vignette facultative d'un projet (C2) et les étapes de la méthode, avec leurs intitulés (MV-08). Leur forme exacte est fixée par le plan front (TK-04).
- La mesure du démarrage à froid du back, que la conception technique place « au scaffold », est faite avec l'image Docker (TK-14), puisque le cache AOT vit dans l'image, puis sur l'hébergeur (TK-24).
- Les cibles des redirections des anciennes adresses (TK-56, A-14) : /about vers /parcours, /arcade vers /projets, /competence/<identifiant> vers /projets. D-13 renvoyait leur choix au parcours d'écrans, qui ne les a pas fixées. Révision du 10/11/2026 : tranchées par Alexandre le 12/11/2026, pour le site en une page : /about vers /#parcours, /arcade vers /#projets, /competence/<identifiant> vers /#projets, l'accueil reste l'accueil, toute autre ancienne adresse donne la page introuvable (A-14, D-13 de la conception technique révisée).
- Le comportement d'une frise plus haute que la fenêtre (TK-53) : dès que le trait a atteint l'étape mise en avant en suivant le défilement, il est tenu pour tracé en entier et ne recule plus.
- Le domaine des tickets : la CI, l'hébergement et la passe manuelle sont du domaine infra ; l'image Docker est du domaine back, puisqu'elle vit dans back/.
- L'accès au board de GitHub : l'autoriser, ou garder les colonnes en labels de statut (section 1).
- La lecture de « Dépend de » : une tâche A-xx marquée « (pour finir) » se fait pendant le ticket (protection des branches pendant TK-07, création du service de préproduction du back pendant TK-24, entre ses deux PR, validation des textes pendant TK-45, recette, gestes de la bascule et service de production du back pendant TK-59) ; toute autre dépendance précède le ticket.
- Les textes légaux (TK-45) sont rédigés par le développement sur la base de CT-12, puis validés par Alexandre dans la PR (A-13) : aucun contenu C-xx ne les couvre.
- Les illustrations des étapes de la méthode (TK-66) : les maquettes n'en montrent que de démonstration, et aucun contenu C-xx ne les couvre. Le développement les dessinera dans TK-66, abstraites, sur le modèle des maquettes, une par étape de C-04, sauf si Alexandre préfère les fournir.
- Les transitions entre pages (MV-07, TK-52) reposent sur les transitions de vue du navigateur, que la charte présente comme une amélioration facultative, pas encore disponible dans tous les navigateurs courants, alors que la conception technique écrit que le site n'utilise que des fonctions de la Baseline « largement disponible » (section 3, R-10). La DoD commune admet donc une exception, à valider : une amélioration facultative avec repli immédiat, qu'un navigateur sans prise en charge ignore en naviguant sans transition et sans erreur. Révision du 10/11/2026 : la conception technique révisée nomme désormais cette exception (section 3, « Navigateurs ») ; le fondu ne joue qu'entre deux pages, jamais d'une section à l'autre de la page principale (charte révisée, MV-07).
- La reprise du code déjà fusionné (révision du 10/11/2026) : cinq tickets, TK-68 à TK-72, un par bloc de la section « Code déjà fusionné à reprendre » du plan du front, tous avant l'en-tête (TK-27), estimés chacun sous 400 lignes ; les lignes 16 et 18 de cette section, qui citent les fichiers de plusieurs tickets, vont avec le ticket qui change le code qu'elles accompagnent. Le contrôle du contenu (TK-28) passe dans la dernière vague de la reprise, à côté de TK-72, dont il ne dépend pas.

## 8. Correspondance avec les issues GitHub

Backlog créé le 27/10/2026 : un ticket = une issue, dont le titre commence par son identifiant entre crochets. Les branches prennent le numéro d'issue (`<préfixe>/<n° d'issue>-<sujet>`). Amendement du 28/10/2026 : TK-67 créé (#90). Révision du 10/11/2026 : le ticket retiré le 12/11/2026 quitte cette correspondance, son issue étant fermée comme abandonnée (section « Révision du 10/11/2026 ») ; TK-68 à TK-72, ajoutés pour reprendre le code déjà fusionné, ont leur issue à créer, dont le numéro s'écrit ici avant l'ouverture de la PR de cette révision.

| Ticket | Issue |
| --- | --- |
| TK-01 | #18 |
| TK-02 | #19 |
| TK-03 | #20 |
| TK-04 | #21 |
| TK-05 | #22 |
| TK-06 | #23 |
| TK-07 | #24 |
| TK-08 | #25 |
| TK-09 | #26 |
| TK-10 | #27 |
| TK-11 | #28 |
| TK-12 | #29 |
| TK-13 | #30 |
| TK-14 | #31 |
| TK-15 | #32 |
| TK-16 | #33 |
| TK-17 | #34 |
| TK-18 | #35 |
| TK-19 | #36 |
| TK-20 | #37 |
| TK-21 | #38 |
| TK-22 | #39 |
| TK-23 | #40 |
| TK-24 | #41 |
| TK-25 | #42 |
| TK-26 | #43 |
| TK-27 | #44 |
| TK-28 | #45 |
| TK-29 | #46 |
| TK-30 | #47 |
| TK-31 | #48 |
| TK-32 | #49 |
| TK-33 | #50 |
| TK-34 | #51 |
| TK-35 | #52 |
| TK-36 | #53 |
| TK-37 | #54 |
| TK-39 | #56 |
| TK-40 | #57 |
| TK-41 | #58 |
| TK-42 | #59 |
| TK-43 | #60 |
| TK-44 | #61 |
| TK-45 | #62 |
| TK-46 | #63 |
| TK-47 | #64 |
| TK-48 | #65 |
| TK-49 | #66 |
| TK-50 | #67 |
| TK-51 | #68 |
| TK-52 | #69 |
| TK-53 | #70 |
| TK-54 | #71 |
| TK-55 | #72 |
| TK-56 | #73 |
| TK-57 | #74 |
| TK-58 | #75 |
| TK-59 | #76 |
| TK-60 | #77 |
| TK-61 | #78 |
| TK-62 | #79 |
| TK-63 | #80 |
| TK-64 | #81 |
| TK-65 | #82 |
| TK-66 | #83 |
| TK-67 | #90 |
| TK-68 | #182 |
| TK-69 | #183 |
| TK-70 | #184 |
| TK-71 | #185 |
| TK-72 | #186 |
