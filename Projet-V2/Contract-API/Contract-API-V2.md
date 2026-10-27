# Contract-API-V2 — Formulaire de contact
Statut : [x] à approuver  [ ] approuvé par : ______
Base : US-2.0 et SC-2.0, approuvés par Alexandre Morozoff le 15/10/26 ; Conception-Technique-V2 et Parcours-Ecrans-V2, approuvés le 16/10/26 ; Charte-Graphique-V2, approuvée le 16/10/26 et réapprouvée le 18/10/26 ; maquettes des douze écrans, dont EC-09 (Contact), approuvées le 18/10/26 ; Tickets-V2, approuvé le 27/10/26 ; réponse d'Alexandre à Q-10 (tâche A-01) du 27/10/26, qui confirme le formulaire à cinq champs obligatoires.

Ce contrat est le seul point de jonction entre le front et le back de la v2.0.0. Il fixe les trois échanges du formulaire de contact : leur route, leurs en-têtes, le JSON exact de chaque requête et de chaque réponse, et ce que fait le front de chaque réponse. L'API du back (TK-16, TK-18, TK-20, TK-22) et le client du front (TK-42, TK-43) l'implémentent tel quel. Ce qu'il ne dit pas ne s'invente pas d'un côté : on le demande, et le contrat se corrige avant le code.

Conventions de lecture : E-01 à E-03 désignent les échanges (section 2) ; CT-xx et D-xx renvoient à la conception technique, MF-xx aux US, SC-2.0-xx aux scénarios, EC-09 et V-06 au parcours d'écrans, CO-xx à la charte, TK-xx aux tickets. Une valeur suivie de « (proposition, à valider) » attend la signature de ce document (section 8). Les exemples de JSON sont fictifs ; l'adresse d'exemple est écrite sans arobase, pour qu'aucune adresse e-mail n'entre dans le dépôt public.

## 1. Principes

- **Format** : toute requête et toute réponse qui a un corps l'a en JSON, encodé en UTF-8. Type de média `application/json` pour les requêtes, les succès et les erreurs (section 4), le seul cas à part étant E-03 appelé sans demander `application/json` (ses en-têtes) ; le back accepte `application/json` avec ou sans paramètre `charset=UTF-8`. Noms de propriétés en anglais, en camelCase.
- **Adresses** : chaque route s'écrit relativement à la base de l'API du back. Aucun hôte n'est écrit, ni dans ce contrat ni dans le code : la base est une valeur de configuration du front, une par environnement (développement, préproduction, production), et l'hôte vient de l'hébergement (sous-domaine du site, CT-06). L'adresse appelée est la base suivie de la route.
- **Routes et version** : routes en anglais, en minuscules, en kebab-case, au pluriel pour une ressource. Les routes métier, celles du formulaire, sont sous le préfixe `/api/v1/` : un changement incompatible ouvrirait `/api/v2/`, servi à côté de `/api/v1/` tant qu'un front déployé appelle encore `/api/v1/`, alors qu'un ajout compatible (une propriété facultative de plus) reste en `/api/v1/`. Chaque côté ignore les propriétés qu'il ne connaît pas. L'indicateur de santé (E-03) reste hors de ce préfixe : c'est un point d'exploitation, pas un échange du formulaire.
- **Origine autorisée** : le back n'accepte les appels de navigateur que depuis l'origine du front de son environnement (conception technique, section 7) : en production, la seule origine canonique du site (D-08) ; en préproduction, celle de la préversion du front branchée sur staging ; en développement, celle du serveur de développement du front. Ces origines, exactes et sans joker, sont lues dans la variable d'environnement `CONTACT_ALLOWED_ORIGINS` (liste séparée par des virgules). Une requête à une route du formulaire (E-01, E-02) dont l'en-tête `Origin` n'est pas dans cette liste reçoit `403` (section 4) avant tout autre traitement. Le back n'envoie jamais `Access-Control-Allow-Origin: *` ni `Access-Control-Allow-Credentials`. Le CORS protège des pages d'autres sites, pas des robots : une requête sans en-tête `Origin` (un script hors navigateur) est traitée normalement, et ce sont la validation et la chaîne de filtres qui la jugent.
- **Authentification** : aucune. Ni compte, ni cookie, ni en-tête `Authorization` ; le front appelle sans identifiants (`credentials: "omit"` au sens de `fetch`). Le jeton de formulaire (E-01) n'authentifie personne : il atteste seulement qu'un formulaire a été ouvert ni trop tôt ni trop tard avant l'envoi.
- **Transport** : HTTPS seulement, assuré par l'hébergement (hors contrat). La politique de sécurité du contenu du front autorise la base de l'API, et elle seule hors du site, dans `connect-src` (conception technique, section 7).
- **En-têtes de sécurité du back** : toute réponse du back porte `Cache-Control: no-store`, `X-Content-Type-Options: nosniff` et `Content-Security-Policy: frame-ancestors 'none'`, valeurs recommandées pour une API (OWASP, section 9). Aucune réponse n'est gardée en cache, ni par le navigateur ni par un intermédiaire : un jeton n'est jamais servi deux fois.
- **Adresse IP** : le back ne lit l'adresse IP du visiteur que dans l'en-tête posé par le proxy de son hébergeur, constaté à la mise en place de l'hébergement (TK-24) ; il ne croit aucun en-tête que le visiteur peut forger. L'adresse ne sert qu'à la limite par adresse IP (section 5), en mémoire, et n'est jamais journalisée (CT-12).
- **Ce que le back ne fait jamais** : stocker tout ou partie d'un message (CT-12) ; réessayer un envoi en arrière-plan ; écrire à l'adresse saisie (CT-07) ; révéler, dans une réponse, quel filtre a refusé un envoi (CT-08, V-06) ; renvoyer une trace d'exécution ou un détail interne ; journaliser un champ du formulaire, une adresse e-mail ou une adresse IP.
- **Journal du back** : une ligne par requête E-02, qui nomme la vraie issue et rien d'autre : envoyé ; refus de validation (noms des champs et raisons, jamais les valeurs) ; pris par le champ piège ; jeton absent, falsifié, trop récent ou expiré ; limite par adresse IP atteinte ; plafond atteint ; échec du prestataire ; délai du prestataire dépassé (CT-12, TK-22). C'est là, et seulement là, qu'Alexandre lit pourquoi un envoi a été refusé.

**Ce que le front attend du back :**

- un jeton à la demande, avec les valeurs en vigueur du délai minimal et de la durée de validité, pour ne coder en dur aucune valeur réglable (E-01) ;
- un code HTTP qui suffit à choisir l'état à afficher : `202`, envoi réussi ; `400` avec `validationErrors` renseigné, erreurs par champ ; toute autre issue, échec réessayable (section 4) ;
- pour un refus de validation, les champs en cause et un code de raison par champ (`validationErrors`), dans un vocabulaire fermé qu'il traduit lui-même ;
- `Access-Control-Allow-Origin` égal à son origine sur chaque réponse de E-01 et de E-02 ;
- une réponse bornée : le back limite son appel au prestataire à 10 secondes, et le front limite toute l'attente à 90 secondes depuis le clic (section 6).

**Ce que le back attend du front :**

- un corps JSON en UTF-8 aux sept propriétés de la section 3, toutes des chaînes ;
- des champs déjà contrôlés dans le navigateur avec les règles de la section 3, sans que le back s'y fie : il revalide tout ;
- un jeton obtenu par E-01, renvoyé tel quel, au moins `minDelaySeconds` et au plus `expiresInSeconds` après sa délivrance ;
- la valeur réelle du champ piège, jamais forcée ;
- une origine autorisée, sans cookie ni en-tête d'authentification.

## 2. Échanges

### E-01 — Demande du jeton de formulaire

- **Méthode et route** : `POST /api/v1/form-tokens`. POST, parce que chaque appel délivre un jeton neuf, qui ne doit être ni servi par un cache ni préchargé ; réponse `200` et non `201`, parce que le jeton n'est stocké nulle part et n'a donc pas d'adresse (RFC 9110). Le front l'appelle à la première interaction avec l'un des cinq champs (premier focus ou première saisie), une fois par affichage de la page, jamais au chargement ni pendant le pré-rendu ; puis de nouveau dans les cas de la section 6 (jeton oublié ou périmé). Cet appel réveille le back s'il dort (CT-06, CT-08).
- **Autorisation** : aucune ; route publique, ouverte aux navigateurs de l'origine autorisée seulement (section 1).
- **En-têtes** : requête : `Accept: application/json` et `Origin`, posé par le navigateur ; ni `Content-Type`, ni cookie, ni en-tête propre, pour que la requête reste « simple » au sens du CORS et parte sans requête préalable `OPTIONS`. Réponse `200` : `Content-Type: application/json`, `Access-Control-Allow-Origin` égal à l'origine de la requête, `Vary: Origin`, et les en-têtes de sécurité de la section 1. Si un client envoie malgré tout une requête préalable `OPTIONS` sur cette route, le back y répond comme pour E-02.
- **Requête** : aucun paramètre, aucun corps.
- **Réponses** :
  - `200 OK` : le jeton (exemple ci-dessous). `formToken` est une chaîne opaque, signée et horodatée par le back (CT-08) : le front ne la lit pas, ne la découpe pas, ne la garde qu'en mémoire (jamais dans le stockage du navigateur) et la renvoie telle quelle dans E-02 ; sa structure n'engage pas le contrat et peut changer sans toucher au front. `minDelaySeconds` et `expiresInSeconds` sont des entiers en secondes, comptés depuis la délivrance : les valeurs en vigueur du délai minimal (arrondi à la seconde supérieure) et de l'âge maximal (arrondi à la seconde inférieure), section 5. Le front note l'heure de réception sur l'horloge monotone du navigateur ; il n'envoie pas avant réception + `minDelaySeconds` et tient le jeton pour périmé à réception + `expiresInSeconds` − 60 secondes. Des durées plutôt qu'une date d'émission : l'horloge du visiteur peut être fausse, et compter depuis la réception, toujours postérieure à la délivrance, ne fait jamais envoyer trop tôt.
  - `403 Forbidden` : origine refusée, corps au format d'erreur (section 4). Le navigateur masque la réponse : le front voit une erreur réseau et n'a pas de jeton.
  - Tout autre code (dont `500`), absence de réponse ou corps illisible : le front n'a pas de jeton. Avant le clic, rien de visible : il en redemande un au clic. Après le clic, échec réessayable (section 6).

Exemple — requête :

```http
POST /api/v1/form-tokens
Accept: application/json
```

Exemple — réponse `200` :

```json
{
  "formToken": "exemple-de-jeton-opaque",
  "minDelaySeconds": 3,
  "expiresInSeconds": 7200
}
```

### E-02 — Envoi du message

- **Méthode et route** : `POST /api/v1/contact-messages`. Le front ne l'appelle qu'avec un formulaire valide selon ses propres contrôles (section 3), un jeton obtenu par E-01 et le délai minimal écoulé (section 6) : jamais sans jeton.
- **Autorisation** : aucune ; route publique, ouverte aux navigateurs de l'origine autorisée seulement (section 1). Le back applique ensuite, dans cet ordre : la validation des cinq champs (section 3), puis la chaîne de filtres de CT-08 et D-06 — champ piège, jeton (signature, délai minimal, âge maximal), limite par adresse IP, plafond global. Seul un message qui passe tout est confié au prestataire d'envoi, avec un délai maximal de 10 secondes (section 5).
- **En-têtes** : requête : `Content-Type: application/json`, `Accept: application/json` et `Origin`, posé par le navigateur. Comme `application/json` n'est pas un type « simple », le navigateur envoie d'abord une requête préalable `OPTIONS /api/v1/contact-messages`, avec `Access-Control-Request-Method: POST` et `Access-Control-Request-Headers: content-type` ; le back y répond `200` sans corps, avec `Access-Control-Allow-Origin` égal à l'origine, `Access-Control-Allow-Methods: POST`, `Access-Control-Allow-Headers: content-type`, `Access-Control-Max-Age: 1800` et `Vary: Origin` ; à une origine refusée, `403`. Toute réponse à une requête réelle d'origine autorisée porte `Access-Control-Allow-Origin`, `Vary: Origin` et les en-têtes de sécurité de la section 1 ; toute réponse qui a un corps, erreurs comprises, porte `Content-Type: application/json`. Aucune réponse ne porte `Retry-After`, qui distinguerait les causes d'échec.
- **Requête** : un objet JSON à sept propriétés, des chaînes, ou `null` quand la section 3 le permet : les cinq champs du formulaire, le champ piège et le jeton, nommés et réglés en section 3. Un `formToken` `null` est un jeton absent : `503`, jamais `400`. Le front envoie les valeurs telles que saisies (le back retire lui-même les espaces de bord), le champ piège avec sa valeur réelle, jamais forcée à vide, et le jeton tel que reçu. Le back ignore toute autre propriété.
- **Réponses** :
  - `202 Accepted`, sans corps : le message a passé validation et filtres, et le prestataire l'a accepté ; ou bien il a été pris par le champ piège, et rien n'est parti (CT-08). Même code, même absence de corps, mêmes en-têtes dans les deux cas : le robot n'apprend rien. `202` plutôt que `200` : le back garantit la remise au prestataire, pas l'arrivée dans la boîte, et ne crée aucune ressource consultable. Le front affiche l'état « envoi réussi » (SC-2.0-23) : confirmation, champs vidés, jeton oublié.
  - `400 Bad Request` avec `validationErrors` renseigné : refus de validation (SC-2.0-24, SC-2.0-25), au format d'erreur de la section 4 ; `validationErrors` porte une clé par champ en cause, avec son code de raison ; rien n'est transmis. Le front affiche sous chaque champ cité le message de sa raison, place le focus sur le premier champ cité dans l'ordre du formulaire, garde la saisie et garde le jeton. Le champ piège et le jeton n'y figurent jamais.
  - `400 Bad Request` avec `validationErrors` à `null` : corps illisible (JSON mal formé, propriété qui n'est ni une chaîne ni `null`). Ne se produit pas depuis le front ; s'il arrive, le front affiche l'échec réessayable.
  - `403 Forbidden` : origine refusée. Le navigateur masque la réponse ; le front voit une erreur réseau, donc l'échec réessayable.
  - `503 Service Unavailable` : échec réessayable, réponse unique pour toutes ces causes : prestataire en échec ou plus lent que son délai maximal ; jeton absent, falsifié, trop récent ou expiré ; limite par adresse IP atteinte ; plafond global atteint (CT-08, V-06). Ni `429` ni `403` pour un filtre : ils désigneraient la limite ou le jeton. Corps au format d'erreur, avec le même `message` générique quelle qu'en soit la cause et `validationErrors` à `null`. Rien n'est stocké ni réessayé en arrière-plan. Le front affiche l'état « envoi échoué » (SC-2.0-26) : saisie conservée, bouton « Réessayer », jeton oublié.
  - Tout autre code (dont `500`), absence de réponse, coupure réseau ou échéance de 90 secondes atteinte (section 6) : le même échec réessayable.

Exemple — requête (l'adresse est volontairement écrite sans arobase ; une vraie requête porte une adresse au format de la section 3) :

```json
{
  "lastName": "Exemple de nom",
  "firstName": "Exemple de prénom",
  "email": "visiteur(at)exemple",
  "subject": "Exemple de sujet",
  "message": "Exemple de message,\nsur deux lignes.",
  "website": "",
  "formToken": "exemple-de-jeton-opaque"
}
```

Exemple — réponse `400`, sujet vide et adresse invalide :

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "One or more fields are invalid.",
  "timestamp": "2026-10-27T09:30:00Z",
  "path": "/api/v1/contact-messages",
  "validationErrors": {
    "email": "invalid-email",
    "subject": "required"
  }
}
```

Exemple — réponse `400`, corps illisible :

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "The request body could not be read.",
  "timestamp": "2026-10-27T09:30:00Z",
  "path": "/api/v1/contact-messages",
  "validationErrors": null
}
```

Exemple — réponse `503`, quelle qu'en soit la cause :

```json
{
  "status": 503,
  "error": "Service Unavailable",
  "message": "The service is temporarily unavailable.",
  "timestamp": "2026-10-27T09:30:00Z",
  "path": "/api/v1/contact-messages",
  "validationErrors": null
}
```

### E-03 — Indicateur de santé

- **Méthode et route** : `GET /actuator/health`, la route par défaut de l'indicateur de santé de Spring Boot, hors du préfixe `/api/v1/`. Appelée par le contrôle de santé de l'hébergeur du back, par le contrôle de TK-49 après chaque déploiement et, selon le choix ouvert en section 8, par sa tâche quotidienne (CT-14, TK-49). Le front ne l'appelle jamais : le réveil passe par E-01, et un appel de plus réveillerait le back sans raison.
- **Autorisation** : aucune. La réponse ne donne que l'état global, sans détail ni composant (conception technique, section 7 : « indicateur de santé sans détail »).
- **En-têtes** : requête : `Accept: application/json`, sans `Origin`. Réponse : `Content-Type: application/json` quand la requête le demande par `Accept: application/json`, et les en-têtes de sécurité de la section 1 ; aucun en-tête CORS, cette route n'étant pas destinée à un navigateur. À une requête sans `Accept` ou avec `Accept: */*`, l'Actuator répond par défaut avec son propre type de média JSON, et non `application/json` : le back ne force pas ce type, et les appelants de E-03 lisent la réponse quel qu'il soit.
- **Requête** : aucun paramètre, aucun corps.
- **Réponses** :
  - `200 OK`, `{"status":"UP"}` : le back tourne. Le contrôle passe. Front : sans objet.
  - `503 Service Unavailable`, `{"status":"DOWN"}` ou `{"status":"OUT_OF_SERVICE"}` : le back tourne mais se déclare hors d'état. Le contrôle échoue et prévient Alexandre. Front : sans objet.
  - Tout autre code ou absence de réponse : back injoignable ; même traitement par le contrôle. L'appelant ne lit que `status` et ignore toute autre propriété.

Le contrôle de l'origine autorisée que demande CT-14 ne passe pas par E-03 : il appelle E-01 avec l'en-tête `Origin` du site et attend `200` avec `Access-Control-Allow-Origin` égal à cette origine. Pour la tâche quotidienne de TK-49, limitée à un appel au back, voir la section 8.

Exemple — réponse `200` :

```json
{
  "status": "UP"
}
```

Exemple — réponse `503` :

```json
{
  "status": "DOWN"
}
```

## 3. Champs du message

| Champ | Nom JSON | Obligatoire | Longueur maximale | Règles |
| --- | --- | --- | --- | --- |
| Nom | `lastName` | oui | 100 caractères | texte brut ; aucun retour à la ligne ; raisons possibles : `required`, `too-long`, `line-break` |
| Prénom | `firstName` | oui | 100 caractères | texte brut ; aucun retour à la ligne ; raisons possibles : `required`, `too-long`, `line-break` |
| Adresse e-mail | `email` | oui | 254 caractères | syntaxe « valid e-mail address » de la norme HTML, plus au moins un point après l'arobase (proposition, à valider) ; caractères ASCII seulement ; casse conservée ; sert seulement d'adresse de réponse, le back n'y écrit jamais (CT-07) ; raisons possibles : `required`, `too-long`, `invalid-email` |
| Sujet | `subject` | oui | 100 caractères | texte brut ; aucun retour à la ligne ; devient l'objet de l'e-mail, après un préfixe fixe (conception technique, section 5) ; raisons possibles : `required`, `too-long`, `line-break` |
| Message | `message` | oui | 5000 caractères | texte brut ; retours à la ligne permis ; raisons possibles : `required`, `too-long` |
| Piège (champ invisible) | `website` | non : doit rester vide | — | chaîne vide, absente ou `null` : rien ; toute autre valeur, espaces de bord retirés : message pris par le piège, réponse `202`, rien n'est envoyé (CT-08) ; jamais cité dans `validationErrors`, jamais transmis à Alexandre ; côté front, invisible, hors de la navigation au clavier, hors de l'arbre d'accessibilité et hors du remplissage automatique, pour qu'aucun humain ne le remplisse |
| Jeton de formulaire | `formToken` | oui, hors validation | — | valeur reçue par E-01, renvoyée telle quelle ; absente, `null`, vide, falsifiée, trop récente ou expirée : `503`, jamais `400` ; le secret de signature est stable, donc un jeton délivré avant une mise en veille reste valable après le réveil ; jamais transmis à Alexandre |

Règles communes aux cinq champs, appliquées à l'identique par le front avant l'envoi et par le back à la réception, sans que le back fasse confiance au navigateur :

- Les espaces de bord sont retirés avant tout contrôle ; la longueur se mesure après ce retrait. Un espace de bord est, en début ou en fin de valeur, un caractère de la propriété Unicode `White_Space`, soit exactement ces 25 points de code : U+0009 à U+000D, U+0020, U+0085, U+00A0, U+1680, U+2000 à U+200A, U+2028, U+2029, U+202F, U+205F et U+3000 ; aucun autre, ni U+FEFF, ni un autre caractère de contrôle (U+001C à U+001F compris). Ni `trim()` en JavaScript, ni `trim()` ou `strip()` en Java : ces fonctions ne retirent pas les mêmes caractères. Chaque côté retire cette liste, par exemple avec la classe `\p{White_Space}` en JavaScript (drapeau `u`) et `\p{IsWhite_Space}` en Java, qui donnent ces mêmes 25 points de code.
- Un caractère est une unité de code UTF-16, comme le comptent `String.length()` en Java, `length` en JavaScript et l'attribut `maxlength` d'un champ HTML : les deux côtés comptent donc pareil, et un émoji compte pour deux.
- `required` : propriété absente, `null` ou vide après retrait des espaces de bord.
- `too-long` : plus de caractères que la longueur maximale du tableau.
- `line-break` : présence d'un retour chariot (U+000D), d'un saut de ligne (U+000A), d'un U+0085, U+2028 ou U+2029 dans le nom, le prénom ou le sujet. Un champ texte HTML ne retire d'un collage que les retours chariot et les sauts de ligne : U+0085, U+2028 et U+2029 peuvent venir d'un collage comme d'un appel direct, et le front les contrôle comme le back.
- `invalid-email` : adresse hors de la syntaxe de la ligne `email` ; un retour à la ligne dans l'adresse en relève aussi. Le front ne se contente pas du contrôle natif du navigateur, qui accepte un domaine sans point.
- Une seule raison par champ, la première dans cet ordre : `required`, `too-long`, `line-break`, `invalid-email`.
- Le front contrôle tout au clic, avant tout appel, et ne désactive jamais le bouton pour un formulaire incomplet (TK-41) ; s'il pose `maxlength` sur un champ, il prévient le visiteur au lieu de tronquer en silence un texte collé.

## 4. Réponses et erreurs

| Code | Cas | Corps | Ce que fait le front |
| --- | --- | --- | --- |
| 200 | E-01 : jeton délivré | `formToken`, `minDelaySeconds`, `expiresInSeconds` (E-01) | garde le jeton en mémoire avec son heure de réception |
| 200 | requête préalable `OPTIONS` d'une origine autorisée | aucun | rien : le navigateur envoie la requête réelle |
| 200 | E-03 : back en état de marche | `{"status":"UP"}` | sans objet : le front n'appelle pas E-03 |
| 202 | E-02 : message remis au prestataire, ou pris par le champ piège | aucun | état « envoi réussi » : confirmation, champs vidés, jeton oublié |
| 400 | E-02 : refus de validation | format d'erreur, `validationErrors` renseigné | message sous chaque champ cité, focus sur le premier dans l'ordre du formulaire, saisie et jeton gardés ; rien n'est confirmé |
| 400 | E-02 : corps illisible | format d'erreur, `validationErrors` à `null` | échec réessayable |
| 403 | toute route du formulaire : en-tête `Origin` hors de la liste autorisée | format d'erreur, `validationErrors` à `null` | le navigateur masque la réponse : erreur réseau ; avant le clic, rien de visible ; après, échec réessayable |
| 503 | E-02 : prestataire en échec ou trop lent, jeton refusé, limite par adresse IP, plafond — une seule réponse | format d'erreur, même `message` générique pour toutes ces causes, `validationErrors` à `null` | échec réessayable : saisie conservée, « Réessayer », jeton oublié |
| 503 | E-03 : back hors d'état | `{"status":"DOWN"}` ou `{"status":"OUT_OF_SERVICE"}` | sans objet |
| autre | `500` du back ; `404`, `405` ou `415` à un appel hors contrat ; tout code de l'hébergeur ; absence de réponse ; coupure réseau ; échéance de 90 secondes | `500`, `404`, `405` et `415` : le back les produit au format d'erreur, `validationErrors` à `null` ; le reste : quelconque ; le front ne lit aucun de ces corps | échec réessayable, jeton oublié ; pour E-01 avant le clic, rien de visible |

Format d'erreur, unique pour toutes les erreurs du back, E-03 excepté (son corps est celui de l'indicateur de santé, même en `503`) : un objet JSON, `Content-Type: application/json`, avec exactement ces six propriétés, toujours présentes, et aucune autre :

- `status` : le code HTTP, en entier.
- `error` : le libellé HTTP standard du code, en anglais (`"Bad Request"`, `"Forbidden"`, `"Service Unavailable"`, `"Internal Server Error"`).
- `message` : une phrase courte et générique, en anglais, qui ne révèle jamais la cause d'un filtre ni un détail interne : `"One or more fields are invalid."` pour le `400` de validation, `"The request body could not be read."` pour le `400` de corps illisible, `"The request is not allowed."` pour le `403`, `"The service is temporarily unavailable."` pour tout `503` de E-02, identique quelle qu'en soit la cause ; pour tout autre code, une phrase générique du même ordre.
- `timestamp` : l'instant de la réponse, au format ISO 8601 en UTC (suffixe `Z`).
- `path` : la route appelée, sans hôte ni paramètre (par exemple `"/api/v1/contact-messages"`).
- `validationErrors` : sur le `400` de validation, un objet non vide dont chaque clé est le nom JSON d'un champ en cause (`lastName`, `firstName`, `email`, `subject`, `message`) et chaque valeur son code de raison (`required`, `too-long`, `invalid-email`, `line-break`, section 3), au plus une clé par champ ; `null` sur toute autre erreur. Le back écrit les clés dans l'ordre du formulaire, mais un objet JSON n'a pas d'ordre garanti : le front ne s'y fie pas.

Le front ne lit que le code HTTP et, sur un `400`, `validationErrors`, pour afficher l'erreur sous chaque champ cité. Il n'affiche jamais `error` ni `message`, qui ne sont pas traduits, et ignore toute propriété inconnue (section 1). Il traduit lui-même chaque code de raison, ce qui prépare une version anglaise du site ; les deux libellés de la maquette EC-09 s'y reprennent au caractère près, apostrophe typographique (’) comprise :

- `required` : « Ce champ est obligatoire. » (maquette EC-09) ;
- `invalid-email` : « L’adresse e-mail n’est pas valide. » (maquette EC-09) ;
- `too-long` : « Ce champ ne doit pas dépasser N caractères. », N étant la longueur maximale du champ (proposition, à valider) ;
- `line-break` : « Ce champ ne doit pas contenir de retour à la ligne. » (proposition, à valider).

Sur un `400`, un `validationErrors` `null`, vide ou illisible, ou une clé ou un code que le front ne connaît pas : il affiche l'échec réessayable plutôt qu'un message faux.

## 5. Valeurs réglables (D-07)

| Valeur | Départ | Variable d'environnement | Effet sur l'échange |
| --- | --- | --- | --- |
| Délai minimal entre la délivrance du jeton et l'envoi | 3 secondes | `CONTACT_TOKEN_MIN_AGE` | renvoyé au front dans `minDelaySeconds` (E-01) ; un envoi plus précoce reçoit `503` |
| Âge maximal du jeton | 2 heures | `CONTACT_TOKEN_MAX_AGE` | renvoyé au front dans `expiresInSeconds` (E-01) ; au-delà, `503` ; le front tient le jeton pour périmé 60 secondes avant et en redemande un au clic (section 6) |
| Limite par adresse IP | 5 messages par heure | `CONTACT_IP_LIMIT_PER_HOUR` | le 6e message d'une même adresse IP dans sa fenêtre d'une heure, ouverte à son premier message compté, reçoit `503` |
| Plafond global | 50 messages par jour | `CONTACT_DAILY_CAP` | le 51e message de la fenêtre de 24 heures reçoit `503` ; compteur en mémoire, donc plafond par période d'éveil (CT-08) |
| Délai maximal du prestataire d'envoi | 10 secondes | `CONTACT_PROVIDER_TIMEOUT` | au-delà, `503` ; borne la durée de traitement de E-02 |
| Attente maximale du front | 90 secondes | aucune : constante du front, seule valeur de D-07 non réglable par variable d'environnement ; la changer demande un nouveau build du front | depuis le clic, au-delà, échec réessayable (section 6) |

Les durées s'écrivent avec leur unité, au format de durée de Spring Boot ; les nombres sont des entiers. Ces variables ne contiennent aucun secret. Comptent pour la limite et pour le plafond les messages que le back confie au prestataire, que l'envoi réussisse ou non ; un message refusé par la validation, le champ piège, le jeton ou la limite elle-même ne compte pas. Les deux compteurs vivent en mémoire et repartent de zéro à chaque mise en veille et à chaque redémarrage (CT-08).

## 6. Réveil du back

L'instance gratuite du back s'endort après 15 minutes sans trafic et met environ une minute à se réveiller (CT-06, D-04). Cette minute est une estimation de l'hébergeur ; les 90 secondes de D-07 sont la borne que le front s'impose depuis le clic. Le front s'y prend ainsi :

1. Première interaction avec l'un des cinq champs : le front appelle E-01, une fois. Si le back dort, cet appel le réveille pendant que le visiteur écrit ; la réponse peut tarder d'environ une minute, et le front n'y pose aucun délai d'abandon tant que le visiteur n'a pas cliqué. Rien n'est affiché.
2. Clic sur « Envoyer le message » ou sur « Réessayer » : le front contrôle les champs (section 3). Champ invalide : messages sous les champs, focus sur le premier, rien n'est envoyé, aucune attente ne commence. Formulaire valide : état « envoi en cours » — bouton inactif avec son indicateur, champs désactivés mais lisibles, message d'attente (maquette EC-09 : « L'envoi peut prendre jusqu'à 90 secondes. Votre saisie est conservée. », libellé définitif tranché par TK-02 et CO-11) — et l'échéance est fixée à clic + 90 secondes.
3. Jeton : s'il en détient un non périmé, le front passe à l'étape 4. Si E-01 est encore en cours, il l'attend. Sinon (aucun jeton, jeton oublié ou périmé), il appelle E-01. Si E-01 se termine sans jeton, il affiche l'échec réessayable.
4. Délai minimal : le front attend, si besoin, que réception + `minDelaySeconds` soit passé. Le délai se compte depuis la délivrance parce que c'est le seul instant que le back certifie, en le signant : la page est statique et ne passe pas par le back, et l'heure du clic, déclarée par le navigateur, serait forgeable. Demander le jeton à la première interaction fait de ce délai un temps minimal de remplissage.
5. Envoi : le front appelle E-02 et agit selon la section 4 — `202`, « envoi réussi » ; `400` avec `validationErrors` renseigné, erreurs par champ ; tout le reste, « envoi échoué ». Le back répond dès que le prestataire a répondu ou que ses 10 secondes sont écoulées ; il n'a pas d'autre attente.
6. Échéance : si, à clic + 90 secondes, le front n'a pas reçu la réponse de E-02, qu'il attende encore le jeton, le délai minimal ou cette réponse, il abandonne ce qui est en cours (E-01 ou E-02) et affiche « envoi échoué » (SC-2.0-26).

Après un échec, le front oublie le jeton et garde la saisie ; « Réessayer » reprend à l'étape 2 avec une nouvelle échéance et un nouveau jeton, ce qui coûte le délai minimal mais ne laisse jamais le visiteur réessayer avec un jeton refusé. Après un succès, il oublie le jeton et vide les champs ; une nouvelle interaction reprend à l'étape 1.

Pire cas tenu : réveil d'environ une minute, puis délai minimal de 3 secondes, puis 10 secondes au plus chez le prestataire, soit environ 73 secondes, sous les 90 secondes. Aucune réponse ne laisse le front attendre sans fin : avant le clic rien n'est affiché, et après le clic l'échéance clôt tout. Le front ne garde pas le back éveillé (CT-06) : pas d'appel périodique, pas d'appel à E-03.

## 7. Correspondance avec les scénarios

| Scénario | Échange et réponse du contrat |
| --- | --- |
| SC-2.0-23 — envoi d'un message de contact | E-01 → `200` à la première interaction ; clic ; délai minimal ; E-02 → `202` ; état « envoi réussi », champs vidés ; Alexandre reçoit les cinq champs (CT-07). Variante « jeton reçu en retard » (conception technique, section 8) : E-01 encore en cours au clic, le front l'attend dans la limite des 90 secondes, puis E-02 → `202`. |
| SC-2.0-24 — champ obligatoire vide | Aucun échange : le front refuse avant E-02 et affiche « Ce champ est obligatoire. » sous le sujet, saisie conservée. Si son contrôle est contourné : E-02 → `400`, `validationErrors` = `{"subject":"required"}`, même affichage ; rien n'est transmis. |
| SC-2.0-25 — email invalide | Aucun échange : le front refuse avant E-02 et affiche « L’adresse e-mail n’est pas valide. » sous l'adresse. Si son contrôle est contourné : E-02 → `400`, `validationErrors` = `{"email":"invalid-email"}`, même affichage ; rien n'est transmis. |
| SC-2.0-26 — envoi qui échoue | E-02 → `503` (prestataire, jeton, limite par adresse IP ou plafond, sans distinction), ou `403`, autre code, coupure réseau, E-01 sans jeton après le clic, échéance de 90 secondes : état « envoi échoué », saisie conservée, « Réessayer » ; un refus de la protection affiche ce même échec (V-06). |
| SC-2.0-30 — information sur l'usage des données | Aucun échange : l'information est du contenu du front, placée avant le bouton. Le contrat tient ce qu'elle annonce : E-02 ne porte que les cinq champs et deux valeurs techniques jamais transmises à Alexandre ; le back ne stocke rien et ne journalise ni champ, ni adresse e-mail, ni adresse IP (CT-12). |
| CT-08 — test de la protection (conception technique, section 8) | Champ piège rempli → `202`, rien ne part ; jeton absent, falsifié, trop récent ou expiré → `503` ; 6e message dans l'heure depuis la même adresse IP → `503` ; plafond atteint → `503` ; message valide → `202`, un seul envoi. |

## 8. Points à valider par Alexandre

- **Longueurs maximales** (section 3) : nom, prénom et sujet 100 caractères ; adresse e-mail 254, la limite pratique d'une adresse (un chemin SMTP fait au plus 256 octets, chevrons compris, selon la RFC 5321) ; message 5000, environ 800 mots, largement assez pour un premier contact. Recommandation : accepter.
- **Noms** : `lastName`, `firstName`, `email`, `subject`, `message` pour les cinq champs ; `website` pour le champ piège, nom qui attire un robot, le front l'excluant du remplissage automatique (section 3) ; `formToken` pour le jeton ; `minDelaySeconds` et `expiresInSeconds` dans E-01 ; les variables d'environnement de la section 5 et `CONTACT_ALLOWED_ORIGINS`. Recommandation : accepter ; le dépôt étant public, un robot écrit pour ce site connaîtra le piège quel que soit son nom, risque déjà admis par CT-08.
- **Routes et codes** : `POST /api/v1/form-tokens` (`200`), `POST /api/v1/contact-messages` (`202`), `GET /actuator/health`. Un seul `503` pour tous les refus des filtres et les échecs du prestataire, au lieu du `429` que l'OWASP conseille pour une limite de débit : V-06 et CT-08 demandent qu'aucun refus ne se distingue d'une panne. Recommandation : accepter.
- **Syntaxe de l'adresse** (section 3) : la syntaxe de la norme HTML accepte un domaine sans point ; exiger un point écarte une faute de frappe courante (une adresse sans extension) qu'aucune adresse réelle n'emploie. Recommandation : accepter.
- **Libellés de deux raisons** (section 4) : `too-long` et `line-break` n'ont pas de message dans les maquettes signées ; deux libellés sont proposés. Recommandation : les accepter, ou les confier à la révision de la charte.
- **Temps de réponse non égalisé** : un message pris par le champ piège reçoit `202` aussitôt, un vrai envoi après l'appel au prestataire. De même, le `503` d'un filtre (jeton, limite par adresse IP, plafond) part aussitôt, alors que le `503` du prestataire, en échec ou trop lent, n'arrive qu'après son appel, jusqu'à 10 secondes plus tard. Un robot qui mesure les temps pourrait donc distinguer le piège d'un envoi, et aussi un refus des filtres d'un échec du prestataire ; les robots génériques visés par CT-08 ne le font pas. Recommandation : ne pas égaliser en v2.0.0.
- **Doublon possible** : si le front abandonne à l'échéance de 90 secondes alors que le back a quand même remis le message, un « Réessayer » en produit un second. Sans stockage (CT-12), le back ne peut pas dédoublonner. Recommandation : accepter ce risque, rare (il suppose un réveil et un prestataire lents à la fois) ; l'alternative, ne plus lancer E-02 quand il reste moins de 15 secondes avant l'échéance, raccourcit d'autant l'attente utile.
- **Corps du `403`** : par défaut, Spring répond à une origine refusée par un texte brut (« Invalid CORS request ») ; le contrat demande le format d'erreur de la section 4, ce qui oblige le back à remplacer ce rejet par défaut. Le front ne lit jamais ce corps. Recommandation : garder le format unique.
- **Contrôle quotidien du back (TK-49)** : la DoD (3) de TK-49, signée, veut que la tâche planifiée vérifie chaque jour la production « en un seul appel au back » ; or ce contrat fait appeler par ce contrôle E-03 (l'indicateur de santé), puis E-01 avec l'en-tête `Origin` (l'origine acceptée), soit deux appels. Deux façons de l'accorder : (a) la tâche quotidienne n'appelle que E-01 avec l'en-tête `Origin` du site ; un `200` portant `Access-Control-Allow-Origin` égal à cette origine prouve à la fois que le back répond et qu'il accepte l'origine, et tient lieu ce jour-là de l'indicateur de santé que cite CT-14 ; E-03 reste appelé par le contrôle de santé de l'hébergeur et par le contrôle lancé après chaque déploiement ; (b) la tâche quotidienne appelle E-03 puis E-01 dans le même réveil, et TK-49 se lit « un seul réveil du back » au lieu d'« un seul appel ». Ni l'une ni l'autre ne tient le back éveillé, qui s'endort après 15 minutes sans trafic (CT-06) ; le jeton ainsi délivré n'est ni stocké ni compté dans la limite ou le plafond (section 5). Recommandation : (a), qui tient la DoD signée à la lettre sans relire TK-49, et éprouve davantage le back qu'E-03 : la route du formulaire, la signature du jeton et la règle d'origine répondent ensemble ; un `403` y signale une origine refusée, une absence de réponse ou un autre code un back hors service.

## 9. Sources

Documents du projet, lus dans le dépôt : Conception-Technique-V2 (sections 3, 4, 5, 7, 8 et 12 ; CT-06, CT-07, CT-08, CT-12, CT-14), US-2.0 (MF-16, MF-20), SC-2.0 (SC-2.0-23 à SC-2.0-27, SC-2.0-30), Parcours-Ecrans-V2 (EC-09, V-06), maquette ecran-09-contact.html (libellés des états), Tickets-V2 (TK-01, TK-16, TK-18, TK-20, TK-22, TK-41 à TK-43, TK-49).

- IETF, RFC 9110, HTTP Semantics (définitions de 202, 400, 403 et 503) — https://www.rfc-editor.org/rfc/rfc9110.html — consulté le 27/10/2026
- IETF, RFC 5321, Simple Mail Transfer Protocol (longueur maximale d'un chemin, d'une partie locale et d'un domaine) — https://www.rfc-editor.org/rfc/rfc5321.html — consulté le 27/10/2026
- WHATWG, HTML Living Standard, « valid e-mail address » et nettoyage des valeurs des champs text et email — https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address — consulté le 27/10/2026
- MDN, Cross-Origin Resource Sharing (requêtes simples, requête préalable, Access-Control-Max-Age, Vary: Origin) — https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS — consulté le 27/10/2026
- Spring Framework, CORS dans Spring MVC (configuration, durée de 30 minutes par défaut, identifiants désactivés par défaut) — https://docs.spring.io/spring-framework/reference/web/webmvc-cors.html — consulté le 27/10/2026
- Spring Framework 7.0, Javadoc de DefaultCorsProcessor (rejet en 403 avec le texte « Invalid CORS request ») — https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/cors/DefaultCorsProcessor.html — consulté le 27/10/2026
- Spring Boot 4.1, Actuator Endpoints (route /actuator/health, détails jamais montrés par défaut, DOWN et OUT_OF_SERVICE en 503) — https://docs.spring.io/spring-boot/reference/actuator/endpoints.html — consulté le 27/10/2026
- OWASP, REST Security Cheat Sheet (en-têtes de sécurité d'une API, messages d'erreur génériques, 429 pour une limite de débit) — https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html — consulté le 27/10/2026
