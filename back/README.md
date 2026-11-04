# Back

L'API du portfolio, en Spring Boot 4.1 sur Java 25, construite par Maven. Elle expose son
indicateur de santé, la demande du jeton de formulaire et l'envoi d'un message du formulaire de
contact, ces deux derniers derrière le socle HTTP commun aux routes du formulaire, sous `/api/v1/`.
Le message passe les filtres contre les messages indésirables (champ piège, jeton, limite par
adresse IP, plafond), puis part chez le prestataire d'envoi, Brevo, par son API HTTPS.

## Prérequis

- **Java 25**, exigé par le build : sous un autre JDK, `./mvnw verify` s'arrête dès la phase
  `validate`, sur la règle de version (`RequireJavaVersion`), en nommant le JDK trouvé.
- Le JDK du système n'est pas forcément celui du terminal : avant toute commande,
  `./mvnw -v` (ou `mvn -v`) doit annoncer `Java version: 25`. Sinon, pointer `JAVA_HOME` sur
  un JDK 25 dans ce terminal.
- Maven n'a pas à être installé : `./mvnw` télécharge la version fixée dans
  `.mvn/wrapper/maven-wrapper.properties`.
- Pour l'image, Docker seul suffit : elle se construit sans Java ni Maven sur le poste.

## Commandes

Toutes se lancent depuis `back/`.

| Commande                                                       | Effet                                                                                                                     |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `./mvnw verify`                                                | vérifie la version de Java, compile, lance les tests, construit `target/portfolio-back.jar`, puis lance SpotBugs          |
| `export CONTACT_TOKEN_SECRET="$(openssl rand -base64 32)"`     | tire le secret du jeton pour ce terminal (voir « Secret du jeton ») : les commandes de lancement suivantes le lisent      |
| `CONTACT_MAIL_SENDER=none ./mvnw spring-boot:run`              | lance le back en local sur `http://localhost:8080/`, avec le `CONTACT_TOKEN_SECRET` du terminal, sans rien envoyer        |
| `CONTACT_MAIL_SENDER=none java -jar target/portfolio-back.jar` | lance le jar construit par `./mvnw verify`, avec le `CONTACT_TOKEN_SECRET` du terminal, sans rien envoyer                 |

En local, toujours `CONTACT_MAIL_SENDER=none` : rien ne part chez Brevo. Sans
`CONTACT_TOKEN_SECRET`, ou sans `none` ni les réglages de Brevo, le back refuse de démarrer (voir
« Configuration »). Le port se change par la variable d'environnement `PORT`, par exemple
`PORT=9090 CONTACT_MAIL_SENDER=none ./mvnw spring-boot:run`, dans le terminal où le secret est tiré.

## Image Docker

Depuis `back/` :

```sh
docker build -t portfolio-back .
docker run --rm -e CONTACT_MAIL_SENDER=none -e CONTACT_TOKEN_SECRET -p 8080:8080 portfolio-back
```

Puis `curl http://localhost:8080/actuator/health` répond `{"status":"UP"}`. Les variables se
passent par `-e`, par exemple `-e PORT=9090 -p 9090:9090` ; `-e CONTACT_TOKEN_SECRET`, sans
valeur, passe au conteneur celui du terminal (voir « Commandes »).

- **Trois étapes** (`Dockerfile`) : `build`, sur la JDK Temurin 25, construit le jar (le
  wrapper et le pom d'abord, pour garder en cache la couche des dépendances ; tests et SpotBugs
  tournent dans la CI, pas dans l'image) ; `extract` le découpe en couches ; `runtime`, sur la
  JRE Temurin 25, l'exécute. Les images de base sont épinglées par étiquette et par empreinte.
- **Utilisateur** : le conteneur tourne sous l'utilisateur système `portfolio`, uid et gid
  10001, sans droits d'administration (`docker run --rm --entrypoint id portfolio-back`).
- **Cache AOT de la JVM** : la construction lance une exécution d'entraînement, qui démarre le
  contexte, l'arrête et écrit `app.aot` ; le point d'entrée,
  `java -XX:AOTCache=app.aot -jar application.jar`, le lit. Le cache ne vaut qu'avec la même JVM,
  les mêmes options et les mêmes chemins de classes : il se refait en reconstruisant l'image,
  jamais en copiant `app.aot`. Les options vivent dans `JDK_JAVA_OPTIONS`, posée dans l'image :
  `-XX:+UseSerialGC -XX:MaxRAMPercentage=60`, soit un tas d'environ 300 Mo sur 512 Mo. Pour
  l'entraînement seulement, un secret de jeton est tiré au hasard et l'adaptateur d'envoi vaut
  `none`, sans quoi le contexte ne démarre pas ; rien n'en reste dans l'image : chaque conteneur
  reçoit son secret au lancement.
- **Hébergeur** : le back n'en connaît que `PORT`, 8080 par défaut. Rien dans l'image n'est
  propre à un hébergeur.
- **CI et publication** : le travail `back` de la CI construit l'image sur chaque PR, sans la
  publier. À chaque tag `v*`, le workflow `publish-back-image.yml` la publie au registre de
  conteneurs de GitHub, `ghcr.io/milkliz0rd/portfolio-back:<tag>`, avec le seul jeton éphémère
  de la CI. Le paquet naît privé : il est rendu public une fois, juste après le premier tag.
- **Mises à jour** : Dependabot vérifie chaque semaine si `25-jdk` et `25-jre` pointent vers une
  nouvelle image et en propose alors l'empreinte, sans majeure de Java.

### Démarrage mesuré

Conteneur limité à 0,1 CPU et 512 Mo, comme l'instance gratuite de l'hébergeur ; trois
démarrages par série ; médianes de la durée « Started … in » de Spring Boot et du temps écoulé
entre `docker run` et le premier `200` de `GET /actuator/health`.

| Série                                         | Started … in | Premier `200` |
| --------------------------------------------- | ------------ | ------------- |
| avec le cache AOT (point d'entrée de l'image) | 58.504 s     | 78.884 s      |
| sans le cache (`java -jar application.jar`)   | 127.798 s    | 148.131 s     |

Mesuré le 29/10/2026 sur un Mac Apple M1 Pro (arm64), Docker 29.8.2 (OrbStack). L'hébergeur
tourne en x86-64 : sa mesure, réveil après la mise en veille compris, suit (« Chez l'hébergeur »).

Pour refaire une mesure, depuis l'image construite ci-dessus :

```sh
time (docker run -d --name mesure --cpus=0.1 --memory=512m -e CONTACT_MAIL_SENDER=none -e CONTACT_TOKEN_SECRET \
  -p 8080:8080 portfolio-back &&
  until [ "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/actuator/health)" = 200 ]
  do sleep 0.25; done)
docker logs mesure 2>&1 | grep -o 'Started .* seconds'
docker rm -f mesure
```

Sans le cache, `portfolio-back` devient, dans la commande `docker run`,
`--entrypoint java portfolio-back -jar application.jar` : mêmes options de la JVM, sans
`-XX:AOTCache`.

**Chez l'hébergeur**, sur le service de préproduction (instance gratuite, région Francfort), le
03/11/2026 :

- **Démarrage** : `Started PortfolioBackApplication in 26.304 seconds (process running for
  29.615)`, lu dans le journal du déploiement de 14:43 UTC ; un seul relevé.
- **Réveil après la mise en veille** : `GET /actuator/health` envoyé par `curl` depuis le Mac
  d'Alexandre, après 16 minutes sans aucune visite ; chaque réponse est un `200`, et son premier
  octet arrive avec la fin de la réponse.

| Visite (heure UTC)                    | Premier octet |
| ------------------------------------- | ------------- |
| service éveillé, au départ (16:34:58) | 0,2 s         |
| réveil 1 (16:50:59)                   | 56,5 s        |
| réveil 2 (17:07:55)                   | 54,5 s        |
| réveil 3 (17:24:50)                   | 45,5 s        |

Le premier visiteur qui arrive après la mise en veille attend donc de 45,5 à 56,5 secondes la
première réponse du back, contre 0,2 seconde une fois le back éveillé. Les trois réveils restent
sous les 60 secondes au-delà desquelles l'instance payante sans veille revient à la décision
d'Alexandre (D-04, A-15), mais près de ce seuil ; la mesure se refait en TK-58. La conception
technique y répond côté front (sections 3 et 4) : le jeton est demandé à la première interaction
avec le formulaire, ce qui réveille le back pendant que le visiteur écrit, et le front attend au
plus 90 secondes après le clic d'envoi (D-07).

## Configuration

Toute valeur réglable passe par une variable d'environnement ; aucun fichier de variables n'est
versionné.

| Variable                  | Rôle                                                                                                                                                                                     | Par défaut                               |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `CONTACT_ALLOWED_ORIGINS` | origines exactes acceptées pour les appels de navigateur sous `/api/v1/`, séparées par des virgules : schéma `http` ou `https`, hôte en minuscules, port facultatif ; ni chemin, ni barre finale, ni joker | vide : aucune origine de navigateur acceptée |
| `CONTACT_MAIL_SENDER`     | adaptateur d'envoi : `brevo`, le prestataire, ou `none`, qui accepte chaque message et n'envoie rien (développement, entraînement du cache AOT), annoncé par un avertissement au démarrage | `brevo`                                  |
| `CONTACT_TOKEN_MIN_AGE`   | délai minimal entre la délivrance d'un jeton et l'envoi du message : une durée avec son unité (`3s`, `1500ms`), lue en secondes sans unité ; zéro ou plus                                | `3s`                                     |
| `CONTACT_TOKEN_MAX_AGE`   | âge maximal d'un jeton : une durée qui dépasse le délai minimal de plus de 60 secondes, la marge que retranche le front                                                                  | `2h`                                     |
| `CONTACT_TOKEN_SECRET`    | secret de signature des jetons : au moins 32 octets aléatoires, en Base64 standard (voir « Secret du jeton ») ; jamais dans le dépôt ni dans un journal                                  | aucune : le back refuse de démarrer      |
| `CONTACT_PROVIDER_TIMEOUT` | délai maximal de l'appel au prestataire, pour la connexion comme pour la réponse : une durée de 1 à 20 secondes | `10s` |
| `CONTACT_BREVO_API_KEY` | clé de l'API de Brevo (voir « Envoi par Brevo ») ; jamais dans le dépôt ni dans un journal | aucune : exigée avec `brevo` |
| `CONTACT_MAIL_FROM` | adresse d'expédition, sur le domaine du site ; jamais dans le dépôt | aucune : exigée avec `brevo` |
| `CONTACT_MAIL_TO` | adresse de destination, la boîte d'Alexandre ; jamais dans le dépôt ni dans un document | aucune : exigée avec `brevo` |
| `CONTACT_BREVO_BASE_URL` | adresse de base de l'API de Brevo : une adresse `https` absolue, sans utilisateur, paramètre ni fragment | `https://api.brevo.com/v3`, l'adresse publique de l'API v3 de Brevo |
| `CONTACT_IP_LIMIT_PER_HOUR` | messages comptés par adresse IP du visiteur dans sa fenêtre d'une heure (voir « Filtres ») : un entier, 1 au moins | `5` |
| `CONTACT_DAILY_CAP` | messages comptés, tous visiteurs confondus, dans la fenêtre de 24 heures : un entier, 1 au moins | `50` |
| `CONTACT_CLIENT_IP_HEADER` | nom de l'en-tête où un proxy placé devant le back écrit l'adresse IP du visiteur (voir « Adresse IP du visiteur »), ou vide | vide : l'adresse de la connexion |
| `CONTACT_CLIENT_IP_POSITION` | rang de l'adresse du visiteur dans la liste de cet en-tête, compté depuis la droite : un entier, 1 au moins | `1`, le dernier élément |

Une valeur mal formée empêche le back de démarrer ; le message nomme la variable, jamais la
valeur reçue, sauf pour une durée ou un nombre illisibles, comme `abc` ou `cinq` : le rapport
d'échec de Spring montre alors cette valeur, qui n'est pas secrète, et nomme la variable par son
origine (`Origin`). Le secret,
la clé et les adresses, eux, ne sont jamais montrés. Avec `brevo`, valeur par défaut, une clé ou
une adresse absente, ou une adresse mal formée, empêche aussi le démarrage : un oubli de réglage ne
fait jamais répondre `202` à des messages qui ne partiraient pas. En développement, avec le serveur
de développement du front, dans le terminal où le secret est tiré :
`CONTACT_ALLOWED_ORIGINS=http://localhost:4200 CONTACT_MAIL_SENDER=none ./mvnw spring-boot:run`.

En préproduction, le service `portfolio-back-preprod` (`render.yaml`) répond à l'adresse technique
que l'hébergeur lui attribue, sans domaine personnalisé ; cette adresse n'est jamais écrite dans le
dépôt et se lit sur la page du service, dans la console de l'hébergeur. Le front de préproduction
la reçoit par sa variable de build `PORTFOLIO_BASE_API_PREPRODUCTION` (voir `front/README.md`,
« Environnements ») ; le back reçoit l'origine du front par `CONTACT_ALLOWED_ORIGINS`, saisie dans
la console.

### Secret du jeton

- **Développement** : tiré dans le terminal, une fois par terminal, jamais écrit dans un fichier
  du dépôt : `export CONTACT_TOKEN_SECRET="$(openssl rand -base64 32)"`, soit 32 octets aléatoires
  en Base64 standard (sans `openssl`, `head -c 32 /dev/urandom | base64` donne la même forme).
- **Tests** : chaque test qui démarre le service du jeton tire le sien ; aucun n'est écrit.
- **Hébergeur** : le service le tire lui-même à sa création (TK-24). Il survit à la mise en veille
  et aux redémarrages : un jeton délivré avant la mise en veille reste valable au réveil.
- **Rotation** : remplacer la valeur de `CONTACT_TOKEN_SECRET` dans les variables d'environnement
  du service chez l'hébergeur par un nouveau secret, tiré comme en développement ; le changement
  redéploie le service. Les jetons en circulation deviennent falsifiés : un visiteur qui avait déjà
  ouvert le formulaire voit une fois l'échec réessayable (`token-forged` au journal), et
  « Réessayer » demande un jeton neuf. Rien d'autre à faire : l'hébergeur ne tire
  un secret que pour une variable absente, et ne remplace donc jamais un secret changé à la main.

## Ce que le back expose

Côté Actuator, seul l'indicateur de santé : `GET /actuator/health` répond `200` et exactement
`{"status":"UP"}`. Toute autre adresse d'Actuator répond `404`, la page `/actuator` comprise.

- Toute réponse porte `Cache-Control: no-store`, `X-Content-Type-Options: nosniff` et
  `Content-Security-Policy: frame-ancestors 'none'`.
- Toute erreur suit le format d'erreur du contrat d'API (section 4), en `application/json`.
- Sous `/api/v1/`, avant tout autre traitement : un en-tête `Origin` hors de
  `CONTACT_ALLOWED_ORIGINS` reçoit `403`, requête préalable comprise ; une requête sans `Origin`
  est traitée ; un corps annoncé de plus de 64 Kio reçoit `400`. Un corps sans longueur annoncée
  n'est borné qu'à sa lecture : sur l'envoi d'un message, au-delà de 64 Kio, il reçoit aussi `400` ;
  la demande de jeton, qui ne lit aucun corps, l'ignore.

## Jeton de formulaire

`POST /api/v1/form-tokens`, sans paramètre ni corps : l'échange E-01 du contrat d'API, qui fait foi.

- Réponse `200` en `application/json` : `formToken`, le jeton que le front renvoie tel quel avec
  son message ; `minDelaySeconds`, le délai minimal arrondi à la seconde supérieure ;
  `expiresInSeconds`, l'âge maximal arrondi à la seconde inférieure. Chaque appel délivre un jeton
  neuf ; le back n'en garde aucun.
- Le jeton s'écrit `v1.<charge>.<signature>`, en 79 caractères : la charge porte l'instant de
  délivrance, en millisecondes, et 16 octets aléatoires ; la signature est un HMAC-SHA256 calculé
  avec `CONTACT_TOKEN_SECRET`. Il vaut de `CONTACT_TOKEN_MIN_AGE` à `CONTACT_TOKEN_MAX_AGE` après
  sa délivrance, bornes comprises, et peut servir plusieurs fois.
- Un corps ou un type de contenu envoyé malgré tout est ignoré, sauf un corps annoncé de plus de
  64 Kio : le filtre de taille commun à `/api/v1/` le refuse en `400` ; `GET` reçoit `405`, une
  origine refusée `403`, et la requête préalable la même réponse que sur l'envoi d'un message.

En local : `curl -i -X POST http://localhost:8080/api/v1/form-tokens -H 'Accept: application/json'`
répond `{"formToken":"v1.…","minDelaySeconds":3,"expiresInSeconds":7200}`.

## Envoi d'un message

`POST /api/v1/contact-messages`, en `application/json` : l'échange E-02 du contrat d'API, qui
fait foi (sections 2 à 4).

- Le corps porte sept propriétés, chacune une chaîne ou `null` : les cinq champs `lastName`,
  `firstName`, `email`, `subject` et `message`, le champ piège `website` et le jeton `formToken`.
  Une propriété absente vaut `null` ; une propriété inconnue est ignorée.
- Le back revalide les cinq champs (section 3) : espaces de bord retirés, soit exactement les 25
  points de code `White_Space` du contrat (ni `trim()` ni `strip()`) ; longueur mesurée ensuite en
  unités UTF-16, un émoji comptant pour deux (100, 100, 254, 100 et 5000) ; aucun retour à la
  ligne dans le nom, le prénom et le sujet ; adresse de la syntaxe de la norme HTML, avec un point
  après l'arobase, en ASCII seulement.
- Message valide, que les filtres laissent passer : `202` sans corps, une fois le message accepté
  par Brevo, à qui il passe une seule fois (avec `CONTACT_MAIL_SENDER=none`, rien ne part). Brevo en échec ou plus lent que
  `CONTACT_PROVIDER_TIMEOUT` : `503` au format d'erreur du contrat ; rien n'est gardé ni réessayé.
- Champ en cause : `400` avec `validationErrors`, une clé par champ, dans l'ordre du formulaire, et
  une seule raison, la première de `required`, `too-long`, `line-break`, `invalid-email` ; rien
  n'est transmis.
- Corps illisible (JSON mal formé, corps vide, valeur ni chaîne ni `null`, corps qui n'est pas un
  objet, plus de 64 Kio) : `400` avec `validationErrors` à `null`. Autre type de contenu : `415` ;
  `Accept` sans JSON : `406`.
- Un message valide passe ensuite les filtres (voir « Filtres ») : le champ piège rempli reçoit
  le `202` d'un envoi, sans que rien parte ; un jeton refusé, la limite ou le plafond, `503`.

En local, le back lancé par `CONTACT_MAIL_SENDER=none ./mvnw spring-boot:run`, secret tiré :

```sh
curl -i http://localhost:8080/api/v1/contact-messages -H 'Content-Type: application/json' \
  -d '{"lastName":"Nom","firstName":"Prénom","email":"visiteur(at)exemple.fr","subject":"Sujet","message":"Bonjour","website":"","formToken":"jeton"}'
```

Tel quel, l'exemple reçoit `400` et `{"email":"invalid-email"}` : comme dans le contrat, l'adresse
est écrite sans arobase, pour qu'aucune adresse n'entre dans le dépôt public. Avec une arobase à
la place de `(at)`, il reçoit `503` (`token-forged` au journal) : `jeton` n'est pas un jeton du
back. Pour un `202`, l'adresse écrite avec son arobase, demander d'abord un jeton, attendre le
délai minimal, puis l'envoyer :

```sh
JETON=$(curl -s -X POST http://localhost:8080/api/v1/form-tokens | sed -E 's/.*"formToken":"([^"]*)".*/\1/')
sleep 3
curl -i http://localhost:8080/api/v1/contact-messages -H 'Content-Type: application/json' \
  -d '{"lastName":"Nom","firstName":"Prénom","email":"visiteur(at)exemple.fr","subject":"Sujet","message":"Bonjour","website":"","formToken":"'"$JETON"'"}'
```

Avec `"website":"x"`, le même envoi reçoit `202` et le journal écrit `outcome=honeypot`, sans
appeler l'adaptateur ; lancé avec `CONTACT_IP_LIMIT_PER_HOUR=1`, le back répond `503` au deuxième
message, et le journal écrit `outcome=ip-limit`.

### Filtres

Après la validation, quatre filtres, dans cet ordre ; le premier qui arrête le message met fin à la
chaîne, et rien ne part chez Brevo :

| Filtre | Arrête le message quand | Le visiteur reçoit | Journal |
| --- | --- | --- | --- |
| champ piège | `website` n'est pas vide, espaces de bord retirés | `202` sans corps, comme un envoi réussi | `honeypot` |
| jeton | `formToken` absent ou vide, falsifié, plus récent que `CONTACT_TOKEN_MIN_AGE` ou plus vieux que `CONTACT_TOKEN_MAX_AGE` | `503` | `token-missing`, `token-forged`, `token-too-recent`, `token-expired` |
| limite par adresse IP | l'adresse a déjà `CONTACT_IP_LIMIT_PER_HOUR` messages comptés dans sa fenêtre d'une heure | `503` | `ip-limit` |
| plafond | `CONTACT_DAILY_CAP` messages sont déjà comptés dans la fenêtre de 24 heures | `503` | `daily-cap` |

- Le `202` du champ piège a les mêmes en-têtes que celui d'un envoi ; les `503` ont le même corps,
  horodatage mis à part, quelle qu'en soit la cause, prestataire en échec compris : la réponse ne
  dit jamais quel filtre a refusé. Seul le journal le dit.
- Comptent, pour la limite et pour le plafond, les messages confiés à Brevo, que l'envoi réussisse
  ou non. Un message refusé par la validation, le champ piège, le jeton, la limite ou le plafond
  ne compte pour rien : quand le plafond refuse, la place prise dans la limite est rendue.
- Chaque fenêtre est fixe, ouverte au premier message compté : au départ, le 6e message d'une
  adresse dans l'heure qui suit son premier reçoit `503`, comme le 51e des 24 heures.
- Les compteurs vivent dans la mémoire de l'unique instance : la mise en veille, après 15 minutes
  sans trafic, et chaque redémarrage les remettent à zéro. Le plafond vaut donc par période
  d'éveil, et le vrai filet reste le quota de Brevo : risque assumé par la conception technique
  (CT-08).
- Une tâche interne efface toutes les 60 secondes les fenêtres expirées : une adresse IP reste en
  mémoire une heure et une minute au plus, et n'entre jamais dans un journal. Cette tâche ne
  reçoit aucun trafic et ne garde pas le back éveillé.
- Une couche de plus, comme ALTCHA, s'ajoute en un composant de plus dans `antispam/`, placé entre
  le jeton et la limite par adresse IP, sans toucher au reste.

### Adresse IP du visiteur

- Elle est lue dans l'en-tête que nomme `CONTACT_CLIENT_IP_HEADER`, où un proxy placé devant le
  back écrit l'adresse du visiteur, ajoutée à une liste (`X-Forwarded-For`) ou seule
  (`CF-Connecting-IP`, que pose Cloudflare) : l'adresse retenue est l'élément de rang
  `CONTACT_CLIENT_IP_POSITION` compté depuis la droite (1, le dernier), le premier que le visiteur
  ne peut pas forger ; ce qu'il écrit lui-même, à gauche, est ignoré. Plusieurs lignes du même
  en-tête forment une seule liste, dans leur ordre.
- Une adresse IPv4 compte telle quelle ; une adresse IPv6, par son préfixe /64, qu'un même abonné
  reçoit en entier.
- `CONTACT_CLIENT_IP_HEADER` vide, en développement : l'adresse de la connexion. En-tête absent,
  liste trop courte ou élément qui n'est pas une adresse : l'adresse de la connexion aussi, avec un
  avertissement sans valeur, une fois par démarrage, signe d'un réglage à reprendre ; derrière le
  proxy de l'hébergeur, tous les visiteurs partageraient alors la même limite.
- Aucun autre en-tête de proxy n'est cru (`server.forward-headers-strategy: none`), et aucun nom
  n'est résolu.
- Un en-tête `Forwarded` (RFC 7239) n'est pas lu : ses éléments s'écrivent `for=…`, qui ne sont
  pas des adresses ; nommé dans `CONTACT_CLIENT_IP_HEADER`, il retombe donc sur l'adresse de la
  connexion, avec l'avertissement ci-dessus.

**Réglage chez l'hébergeur** : `CONTACT_CLIENT_IP_HEADER=CF-Connecting-IP` et
`CONTACT_CLIENT_IP_POSITION=1`, retenus par un constat sur le service de préproduction, le
03/11/2026. Pour l'essai, la limite était réglée à un message par heure et l'envoi coupé : un
message accepté (`202`) montre que le back lit une adresse qu'il n'avait pas encore comptée, un
message refusé (`503`), qu'il lit la même qu'avant. Les messages partaient du Mac d'Alexandre, avec
un jeton demandé depuis l'origine autorisée.

- `X-Forwarded-For`, rang 1 : sur six messages, sans rien forger, trois acceptés puis trois
  refusés ; la valeur lue, celle d'un relais de l'hébergeur, change entre quelques valeurs pour un
  même visiteur. Écarté.
- `X-Forwarded-For`, rang 2 : sans rien forger, un message accepté puis trois refusés, donc stable ;
  mais un message qui écrit lui-même une adresse dans cet en-tête est accepté juste après : une
  valeur écrite par le visiteur prend la place lue. Forgeable, écarté.
- `CF-Connecting-IP`, rang 1 : sans rien forger, un message accepté puis trois refusés ; un message
  qui forge `X-Forwarded-For`, seul ou avec `True-Client-IP`, reste refusé : la clé ne change pas.
  Un message qui envoie lui-même `CF-Connecting-IP` est refusé par Cloudflare (`403`, « Error
  1000 ») avant d'atteindre le back. Ces essais partaient tous du même réseau, le partage de
  connexion du téléphone d'Alexandre ; depuis un autre réseau, un message est accepté, puis le
  suivant refusé : deux réseaux ne partagent pas la même limite. Retenu.

Ce réglage tient tant que le service reste derrière le relais de l'hébergeur et Cloudflare : un
changement d'hébergeur ou d'offre se refait par le même constat. Les deux valeurs vivent dans
`render.yaml` : elles ne se changent pas dans la console de l'hébergeur, où la synchronisation
suivante du Blueprint écraserait le changement.

## Envoi par Brevo

`POST` sur `/smtp/email` sous `CONTACT_BREVO_BASE_URL`, avec la clé dans l'en-tête `api-key`, par
le client HTTP de Spring sur celui du JDK, sans kit du prestataire :

- l'e-mail part de `CONTACT_MAIL_FROM`, au nom fixe « Formulaire du portfolio », vers la seule
  adresse `CONTACT_MAIL_TO` ; l'adresse du visiteur n'est que l'adresse de réponse, avec son prénom
  suivi de son nom : le back n'écrit jamais à l'adresse saisie ;
- objet : `[Portfolio] ` suivi du sujet ; corps en texte brut, sans HTML ni copie : nom, prénom,
  adresse et sujet, un par ligne avec leur libellé, puis le message ;
- toute réponse 2xx est un succès ; une autre réponse, dont seul le code est lu, ou une erreur
  réseau est un échec ; aucune réponse dans le délai, un délai dépassé. Les deux donnent le `503`.

**Rotation de la clé** (compromission, ou rotation demandée par Brevo) : créer une nouvelle clé
dans le compte Brevo, la poser dans `CONTACT_BREVO_API_KEY` chez l'hébergeur (le changement
redéploie le service), vérifier qu'un message envoyé depuis le formulaire arrive, puis supprimer
l'ancienne clé dans Brevo. Dans cet ordre, aucun envoi n'échoue ; une clé compromise se supprime
tout de suite, au prix de quelques `503` (`provider-failure` au journal) jusqu'au redéploiement.

## Journal

Le back écrit sur la sortie standard, au niveau INFO, sans fichier ni journal d'accès. Chaque
requête `POST` sur la route d'envoi écrit une ligne et une seule, sous le nom de journal `contact` :

```text
contact-message outcome=validation-refused durationMs=12 fields=lastName:required,email:invalid-email
```

- `outcome` nomme la vraie issue : `sent`, `validation-refused` (avec `fields`, les champs en cause
  et leurs raisons, jamais leurs valeurs), `unreadable-body`, `unsupported-media-type`,
  `not-acceptable`, `origin-refused`, celles des filtres (`honeypot`, `token-missing`,
  `token-forged`, `token-too-recent`, `token-expired`, `ip-limit`, `daily-cap`), `provider-failure`
  (avec `providerStatus`, le code de la réponse de Brevo, s'il a répondu), `provider-timeout` ou
  `internal-error`. `durationMs` est la durée de traitement.
- `daily-cap`, `provider-failure` et `provider-timeout` s'écrivent au niveau WARN ;
  `internal-error` au niveau ERROR, avec la trace d'exécution ; les autres au niveau INFO.
- Une requête préalable `OPTIONS`, une autre méthode ou une autre route, la demande de jeton
  comprise, n'écrivent aucune ligne, même refusées.
- Jamais dans un journal : un champ du formulaire, une adresse e-mail, une adresse IP, la valeur
  d'un en-tête (`Origin` compris), le jeton, le secret du jeton, la clé de Brevo, un extrait du
  corps, le corps d'une réponse de Brevo. Au niveau DEBUG, le client de Spring écrit le corps qu'il
  envoie : son texte cache toutes les valeurs.
- Ne jamais mettre `org.springframework.web` au niveau DEBUG en production : ce niveau écrit la
  valeur refusée d'un champ, une saisie du visiteur, contre la règle ci-dessus.

Au démarrage, le back écrit le nombre d'origines autorisées et l'adaptateur d'envoi, jamais leur
valeur, avec un avertissement si l'adaptateur est `none`.

## Analyse statique

SpotBugs analyse le code principal à chaque `./mvnw verify` et fait échouer le build à la
première anomalie. Une exclusion, si elle est justifiée, s'ajoute dans `spotbugs-exclude.xml`,
avec un commentaire qui dit pourquoi.
