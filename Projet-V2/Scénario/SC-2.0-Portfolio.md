# SC-2.0-Portfolio     US liée : US-2.0

## SC-2.0-01 — Scénario : arrivée sur la page d'accueil
Micro-fonction : MF-01
- Étant donné un recruteur qui arrive sur le site pour la première fois
- Quand la page d'accueil s'affiche
- Alors il voit le nom Alexandre Morozoff et l'intitulé de son profil, « Développeur fullstack, orienté architecture logicielle »
- Et il voit une courte présentation d'Alexandre
- Et il voit comment accéder aux autres sections du site
- Et aucun âge n'est affiché

## SC-2.0-02 — Scénario : CV et contact atteints depuis l'accueil
Micro-fonction : MF-02
- Étant donné un recruteur sur la page d'accueil
- Quand il cherche le CV puis le contact
- Alors il atteint le CV en un clic et le contact en un clic (proposition, à valider)
- Et aucune étape préalable (exploration, jeu, saisie) ne lui est demandée

## SC-2.0-03 — Scénario : CV et contact atteints depuis une fiche projet
Micro-fonction : MF-02
- Étant donné un recruteur sur la fiche d'un projet
- Quand il cherche le CV puis le contact
- Alors il atteint le CV en un clic et le contact en un clic (proposition, à valider)

## SC-2.0-04 — Scénario : navigation entre les sections
Micro-fonction : MF-03
- Étant donné un responsable technique sur n'importe quelle page du site
- Quand il ouvre la navigation
- Alors il voit une entrée pour chaque section du site
- Et en choisissant une entrée, il arrive sur la section correspondante
- Et la navigation est la même sur toutes les pages

## SC-2.0-05 — Scénario : lien direct vers une section
Micro-fonction : MF-04
- Étant donné un lien direct vers une section du site, transmis à un recruteur
- Quand il l'ouvre dans une fenêtre où le site n'a jamais été ouvert
- Alors la section visée s'affiche directement, sans passer par l'accueil
- Et si le recruteur recharge la page, la même section reste affichée

## SC-2.0-06 — Scénario : lien direct vers la fiche d'un projet
Micro-fonction : MF-04
- Étant donné un lien direct vers la fiche d'un projet existant
- Quand un recruteur l'ouvre dans une fenêtre où le site n'a jamais été ouvert
- Alors la fiche de ce projet s'affiche, avec son titre
- Et si le recruteur recharge la page, la même fiche reste affichée

## SC-2.0-07 — Scénario : lien direct vers un projet qui n'existe pas
Micro-fonction : MF-04
- Étant donné un lien direct vers un projet qui n'existe pas sur le site
- Quand un recruteur l'ouvre
- Alors un message lui indique que la page n'existe pas
- Et il voit comment revenir à l'accueil et au reste du site

## SC-2.0-08 — Scénario : adresse inconnue
Micro-fonction : MF-05
- Étant donné une adresse qui ne correspond à aucune page du site
- Quand un visiteur l'ouvre
- Alors un message clair lui indique que la page n'existe pas
- Et la navigation du site reste visible
- Et il voit comment revenir à l'accueil

## SC-2.0-09 — Scénario : consultation sur téléphone
Micro-fonction : MF-06
- Étant donné un recruteur qui ouvre le site sur un téléphone
- Quand il parcourt l'accueil, les sections, une fiche projet et le formulaire de contact
- Alors tout le contenu est lisible sans défilement horizontal
- Et la navigation reste accessible depuis chaque page
- Et le formulaire de contact peut être rempli et envoyé

## SC-2.0-10 — Scénario : parcours d'Alexandre
Micro-fonction : MF-07
- Étant donné un recruteur sur la section du parcours
- Quand elle s'affiche
- Alors il voit les étapes du parcours dans l'ordre : reconversion depuis la restauration, bac+3, master en architecture durable du logiciel
- Et chaque étape porte sa période, avec un début et une fin
- Et le bac+3 est affiché avec son intitulé et son établissement
- Et aucune date relative ni aucune durée relative n'est affichée

## SC-2.0-11 — Scénario : orientation vers l'architecture logicielle
Micro-fonction : MF-08
- Étant donné un responsable technique sur le site
- Quand il consulte la présentation du parcours
- Alors il voit qu'Alexandre s'oriente vers l'architecture logicielle
- Et le master en architecture durable du logiciel y est cité comme étape de cette orientation

## SC-2.0-12 — Scénario : compétences techniques
Micro-fonction : MF-09
- Étant donné un responsable technique sur la section des compétences
- Quand elle s'affiche
- Alors il voit les compétences techniques d'Alexandre, regroupées selon les catégories fournies par Alexandre (C-02)
- Et chaque compétence affichée figure dans la liste fournie par Alexandre

## SC-2.0-13 — Scénario : compétences humaines et reconversion
Micro-fonction : MF-10
- Étant donné un recruteur sur la section des compétences
- Quand il consulte les compétences humaines
- Alors il voit les compétences humaines d'Alexandre
- Et il voit en quoi la reconversion depuis la restauration les illustre

## SC-2.0-14 — Scénario : rôle chez OSOL
Micro-fonction : MF-11
- Étant donné un recruteur sur la section consacrée à OSOL
- Quand elle s'affiche
- Alors il voit le rôle d'Alexandre chez OSOL décrit en trois volets : application, backend, appui DevOps sur certaines tâches
- Et l'alternance est présentée comme une période datée
- Et aucun nom de client, de projet, d'outil interne, de dépôt ou de collègue n'est mentionné
- Et aucun projet OSOL n'est présenté
- Et il voit que la période affichée de l'alternance est 2025–2028 et il lit que les projets menés en entreprise ne sont pas partageables

## SC-2.0-15 — Scénario : liste des projets
Micro-fonction : MF-12
- Étant donné un recruteur sur la section des projets
- Quand elle s'affiche
- Alors il voit la liste des projets, qui ne contient au lancement que le portfolio, avec son titre
- Et il voit que les projets menés en entreprise ne sont pas partageables
- Et aucun projet d'école ni d'entreprise n'est présenté
- Et en choisissant le portfolio, il arrive sur la fiche de ce projet

## SC-2.0-16 — Scénario : fiche d'un projet complet
Micro-fonction : MF-13
- Étant donné un projet disposant d'une description, de captures et d'un lien vers son code source
- Quand un responsable technique ouvre sa fiche
- Alors il voit le titre et la description du projet
- Et il voit les captures du projet
- Et il voit un lien vers le code source, qui mène au code source du projet

## SC-2.0-17 — Scénario : fiche d'un projet sans lien vers son code source
Micro-fonction : MF-13
- Étant donné un projet qui n'a pas de lien vers son code source
- Quand un responsable technique ouvre sa fiche
- Alors la fiche s'affiche avec son titre et sa description
- Et aucun lien ni bouton vers un code source n'apparaît

## SC-2.0-18 — Scénario : fiche d'un projet sans capture
Micro-fonction : MF-13
- Étant donné un projet qui n'a aucune capture
- Quand un responsable technique ouvre sa fiche
- Alors la fiche s'affiche avec son titre et sa description
- Et aucune zone vide ni image absente n'apparaît à la place des captures

## SC-2.0-19 — Scénario : ajout d'un projet
Micro-fonction : MF-14
- Étant donné qu'Alexandre fournit les informations d'un nouveau projet
- Quand le projet est mis en ligne
- Alors il apparaît dans la liste des projets
- Et sa fiche affiche les informations fournies
- Et les autres sections et les autres projets sont identiques à ce qu'ils étaient avant l'ajout

## SC-2.0-20 — Scénario : lien direct vers un projet ajouté
Micro-fonction : MF-14
- Étant donné qu'un nouveau projet vient d'être ajouté
- Quand un visiteur ouvre le lien direct de sa fiche
- Alors la fiche du nouveau projet s'affiche

## SC-2.0-21 — Scénario : téléchargement du CV
Micro-fonction : MF-15
- Étant donné un recruteur sur n'importe quelle page du site
- Quand il demande le CV
- Alors il obtient le CV d'Alexandre
- Et le fichier reçu porte un nom qui ne contient ni date ni mention de situation (proposition, à valider)

## SC-2.0-22 — Scénario : CV indisponible
Micro-fonction : MF-15
- Étant donné que le CV ne peut pas être obtenu
- Quand un recruteur le demande
- Alors un message lui indique que le CV est momentanément indisponible
- Et il voit comment contacter Alexandre

## SC-2.0-23 — Scénario : envoi d'un message de contact
Micro-fonction : MF-16
- Étant donné un recruteur sur le formulaire de contact, avec les cinq champs remplis (nom, prénom, email, sujet, message) dont un email valide
- Quand il envoie le formulaire
- Alors une confirmation d'envoi lui est affichée
- Et les champs du formulaire sont vidés
- Et Alexandre reçoit un message contenant le nom, le prénom, l'email, le sujet et le texte saisis

## SC-2.0-24 — Scénario : champ obligatoire vide
Micro-fonction : MF-16
- Étant donné un recruteur sur le formulaire de contact, dont le champ sujet est vide
- Quand il envoie le formulaire
- Alors un message près du champ sujet lui indique que ce champ est obligatoire
- Et aucune confirmation d'envoi n'est affichée
- Et Alexandre ne reçoit aucun message
- Et les autres champs gardent leur saisie

## SC-2.0-25 — Scénario : email invalide
Micro-fonction : MF-16
- Étant donné un recruteur sur le formulaire de contact, avec une adresse email invalide dans le champ email
- Quand il envoie le formulaire
- Alors un message près du champ email lui indique que l'adresse n'est pas valide
- Et aucune confirmation d'envoi n'est affichée
- Et Alexandre ne reçoit aucun message

## SC-2.0-26 — Scénario : envoi qui échoue
Micro-fonction : MF-16
- Étant donné un recruteur sur le formulaire de contact, avec tous les champs correctement remplis, au moment où l'envoi ne peut pas aboutir
- Quand il envoie le formulaire
- Alors un message d'erreur visible lui indique que l'envoi a échoué et qu'il peut réessayer
- Et aucune confirmation d'envoi n'est affichée
- Et les champs du formulaire gardent sa saisie

## SC-2.0-27 — Scénario : liens vers les profils externes
Micro-fonction : MF-17
- Étant donné un visiteur sur n'importe quelle page du site
- Quand il choisit le lien vers GitHub ou vers LinkedIn
- Alors il arrive sur le profil d'Alexandre du réseau choisi
- Et le site reste ouvert dans la fenêtre d'origine
- Et aucun lien vers X n'est affiché

## SC-2.0-28 — Scénario : aucune information qui se périme
Micro-fonction : MF-18
- Étant donné un visiteur qui parcourt toutes les pages du site
- Quand il lit l'ensemble des textes affichés
- Alors il ne trouve aucun âge
- Et il ne trouve aucune durée relative ni formulation liée au moment de la lecture
- Et chaque date affichée est une date précise fournie par Alexandre
- Et aucune situation qui a une fin n'est formulée au présent

## SC-2.0-29 — Scénario : accès aux mentions légales
Micro-fonction : MF-19
- Étant donné un visiteur sur n'importe quelle page du site
- Quand il cherche les mentions légales
- Alors il y accède depuis un lien présent sur la page
- Et la page affiche le nom d'Alexandre, le contact par le formulaire et l'identité de l'hébergeur
- Et aucune adresse ni aucun téléphone personnels n'y figure

## SC-2.0-30 — Scénario : information sur l'usage des données du formulaire
Micro-fonction : MF-20
- Étant donné un visiteur sur le formulaire de contact
- Quand il lit le formulaire avant de l'envoyer
- Alors il voit, avant le bouton d'envoi, une information sur l'usage de ses données
- Et cette information indique qui reçoit ses données et pourquoi

## SC-2.0-31 — Scénario : méthodologie de travail
Micro-fonction : MF-21
- Étant donné un responsable technique sur la section de la méthode de travail
- Quand elle s'affiche
- Alors il lit le texte fourni par Alexandre, qui explique sa méthodologie de travail et en quoi il respecte des architectures solides
- Et aucun document interne, client, projet, outil interne ni dépôt d'entreprise n'y est nommé
- Et il voit un renvoi vers la fiche du portfolio, qui illustre cette méthode
- Et en suivant ce renvoi, il arrive sur la fiche du portfolio

## SC-2.0-32 — Scénario : le portfolio présenté comme projet
Micro-fonction : MF-22
- Étant donné un responsable technique sur la section des projets au lancement
- Quand il ouvre le projet portfolio
- Alors il voit sa fiche, qui présente la démarche et l'architecture du site selon le contenu fourni par Alexandre
- Et il voit un lien vers le code source public du portfolio, qui mène à ce code source
