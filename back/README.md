# Back

L'API du portfolio, en Spring Boot 4.1 sur Java 25, construite par Maven. Elle expose son
indicateur de santé, la demande du jeton de formulaire et l'envoi d'un message du formulaire de
contact, ces deux derniers derrière le socle HTTP commun aux routes du formulaire, sous `/api/v1/`.
Les filtres contre les messages indésirables (TK-22), qui vérifieront le jeton, et l'envoi réel
(TK-20) s'y brancheront.

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

Sans `CONTACT_TOKEN_SECRET` ou sans `CONTACT_MAIL_SENDER=none`, le back refuse de démarrer (voir
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
tourne en x86-64 : la mesure chez lui, réveil après la mise en veille compris, vient avec le
service de préproduction (TK-24).

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

Une valeur mal formée empêche le back de démarrer ; le message nomme la variable, jamais la
valeur reçue, sauf pour une durée illisible, comme `abc` : le rapport d'échec de Spring montre alors
cette valeur, qui n'est pas secrète, et nomme la variable par son origine (`Origin`). Le secret,
lui, n'est jamais montré. `CONTACT_MAIL_SENDER=brevo`, valeur par défaut, l'empêche aussi tant que
l'adaptateur Brevo n'existe pas (TK-20), avec un message qui nomme cette valeur prévue et dit de
poser `none` : un oubli de réglage ne fait jamais répondre `202` à des messages qui ne partiraient
pas. En développement, avec le serveur de développement du front, dans le terminal où le secret
est tiré : `CONTACT_ALLOWED_ORIGINS=http://localhost:4200 CONTACT_MAIL_SENDER=none ./mvnw spring-boot:run`.

### Secret du jeton

- **Développement** : tiré dans le terminal, une fois par terminal, jamais écrit dans un fichier
  du dépôt : `export CONTACT_TOKEN_SECRET="$(openssl rand -base64 32)"`, soit 32 octets aléatoires
  en Base64 standard (sans `openssl`, `head -c 32 /dev/urandom | base64` donne la même forme).
- **Tests** : chaque test qui démarre le service du jeton tire le sien ; aucun n'est écrit.
- **Hébergeur** : le service le tire lui-même à sa création (TK-24). Il survit à la mise en veille
  et aux redémarrages : un jeton délivré avant la mise en veille reste valable au réveil.
- **Rotation** : remplacer la valeur de `CONTACT_TOKEN_SECRET` dans les variables d'environnement
  du service chez l'hébergeur par un nouveau secret, tiré comme en développement ; le changement
  redéploie le service. Les jetons en circulation deviennent falsifiés : dès que les filtres
  vérifient le jeton (TK-22), un visiteur qui avait déjà ouvert le formulaire voit une fois l'échec
  réessayable, et « Réessayer » demande un jeton neuf. Rien d'autre à faire : l'hébergeur ne tire
  un secret que pour une variable absente, et ne remplace donc jamais un secret changé à la main.

## Ce que le back expose

Côté Actuator, seul l'indicateur de santé : `GET /actuator/health` répond `200` et exactement
`{"status":"UP"}`. Toute autre adresse d'Actuator répond `404`, la page `/actuator` comprise.

- Toute réponse porte `Cache-Control: no-store`, `X-Content-Type-Options: nosniff` et
  `Content-Security-Policy: frame-ancestors 'none'`.
- Toute erreur suit le format d'erreur du contrat d'API (section 4), en `application/json`.
- Sous `/api/v1/`, avant tout autre traitement : un en-tête `Origin` hors de
  `CONTACT_ALLOWED_ORIGINS` reçoit `403`, requête préalable comprise ; une requête sans `Origin`
  est traitée ; un corps de plus de 64 Kio, annoncé ou non, reçoit `400`.

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
- Message valide : `202` sans corps, et le message passe une seule fois à l'expéditeur (avec
  `CONTACT_MAIL_SENDER=none`, rien ne part).
- Champ en cause : `400` avec `validationErrors`, une clé par champ, dans l'ordre du formulaire, et
  une seule raison, la première de `required`, `too-long`, `line-break`, `invalid-email` ; rien
  n'est transmis.
- Corps illisible (JSON mal formé, corps vide, valeur ni chaîne ni `null`, corps qui n'est pas un
  objet, plus de 64 Kio) : `400` avec `validationErrors` à `null`. Autre type de contenu : `415` ;
  `Accept` sans JSON : `406`.
- Le champ piège et le jeton sont lus, mais ne changent encore rien : un message valide reçoit
  `202` même piège rempli ou sans jeton, jusqu'aux filtres (TK-22), qui vérifieront le jeton.

En local, le back lancé par `CONTACT_MAIL_SENDER=none ./mvnw spring-boot:run`, secret tiré :

```sh
curl -i http://localhost:8080/api/v1/contact-messages -H 'Content-Type: application/json' \
  -d '{"lastName":"Nom","firstName":"Prénom","email":"visiteur(at)exemple.fr","subject":"Sujet","message":"Bonjour","website":"","formToken":"jeton"}'
```

Tel quel, l'exemple reçoit `400` et `{"email":"invalid-email"}` : comme dans le contrat, l'adresse
est écrite sans arobase, pour qu'aucune adresse n'entre dans le dépôt public. Avec une arobase à
la place de `(at)`, il reçoit `202`.

## Journal

Le back écrit sur la sortie standard, au niveau INFO, sans fichier ni journal d'accès. Chaque
requête `POST` sur la route d'envoi écrit une ligne et une seule, sous le nom de journal `contact` :

```text
contact-message outcome=validation-refused durationMs=12 fields=lastName:required,email:invalid-email
```

- `outcome` nomme la vraie issue : `sent`, `validation-refused` (avec `fields`, les champs en cause
  et leurs raisons, jamais leurs valeurs), `unreadable-body`, `unsupported-media-type`,
  `not-acceptable`, `origin-refused` ou `internal-error` ; les issues des filtres et du
  prestataire viendront avec eux (TK-22, TK-20). `durationMs` est la durée de traitement.
- `internal-error` s'écrit au niveau ERROR, avec la trace d'exécution ; les autres au niveau INFO.
- Une requête préalable `OPTIONS`, une autre méthode ou une autre route, la demande de jeton
  comprise, n'écrivent aucune ligne, même refusées.
- Jamais dans un journal : un champ du formulaire, une adresse e-mail, une adresse IP, la valeur
  d'un en-tête (`Origin` compris), le jeton, le secret du jeton, un extrait du corps.

Au démarrage, le back écrit le nombre d'origines autorisées et l'adaptateur d'envoi, jamais leur
valeur, avec un avertissement si l'adaptateur est `none`.

## Analyse statique

SpotBugs analyse le code principal à chaque `./mvnw verify` et fait échouer le build à la
première anomalie. Une exclusion, si elle est justifiée, s'ajoute dans `spotbugs-exclude.xml`,
avec un commentaire qui dit pourquoi.
