# Back

L'API du portfolio, en Spring Boot 4.1 sur Java 25, construite par Maven. Elle expose son
indicateur de santé et l'envoi d'un message du formulaire de contact, derrière le socle HTTP commun
aux routes du formulaire, sous `/api/v1/`. Le jeton (TK-18), les filtres contre les messages
indésirables (TK-22) et l'envoi réel (TK-20) s'y brancheront.

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

| Commande                                                       | Effet                                                                                                            |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `./mvnw verify`                                                | vérifie la version de Java, compile, lance les tests, construit `target/portfolio-back.jar`, puis lance SpotBugs |
| `CONTACT_MAIL_SENDER=none ./mvnw spring-boot:run`              | lance le back en local sur `http://localhost:8080/`, sans rien envoyer                                           |
| `CONTACT_MAIL_SENDER=none java -jar target/portfolio-back.jar` | lance le jar construit par `./mvnw verify`, sans rien envoyer                                                    |

Sans `CONTACT_MAIL_SENDER=none`, le back refuse de démarrer (voir « Configuration »). Le port se
change par la variable d'environnement `PORT`, par exemple
`PORT=9090 CONTACT_MAIL_SENDER=none ./mvnw spring-boot:run`.

## Image Docker

Depuis `back/` :

```sh
docker build -t portfolio-back .
docker run --rm -e CONTACT_MAIL_SENDER=none -p 8080:8080 portfolio-back
```

Puis `curl http://localhost:8080/actuator/health` répond `{"status":"UP"}`. Les variables se
passent par `-e`, par exemple `-e PORT=9090 -p 9090:9090`.

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
  `none` ; rien n'en reste dans l'image.
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
time (docker run -d --name mesure --cpus=0.1 --memory=512m -e CONTACT_MAIL_SENDER=none -p 8080:8080 portfolio-back &&
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

Une valeur mal formée empêche le back de démarrer ; le message nomme la variable, jamais sa
valeur. C'est aussi le cas de `CONTACT_MAIL_SENDER=brevo`, valeur par défaut, tant que
l'adaptateur Brevo n'existe pas (TK-20) : un oubli de réglage ne fait jamais répondre `202` à des
messages qui ne partiraient pas. En développement, avec le serveur de développement du front :
`CONTACT_ALLOWED_ORIGINS=http://localhost:4200 CONTACT_MAIL_SENDER=none ./mvnw spring-boot:run`.

## Ce que le back expose

Côté Actuator, seul l'indicateur de santé : `GET /actuator/health` répond `200` et exactement
`{"status":"UP"}`. Toute autre adresse d'Actuator répond `404`, la page `/actuator` comprise.

- Toute réponse porte `Cache-Control: no-store`, `X-Content-Type-Options: nosniff` et
  `Content-Security-Policy: frame-ancestors 'none'`.
- Toute erreur suit le format d'erreur du contrat d'API (section 4), en `application/json`.
- Sous `/api/v1/`, avant tout autre traitement : un en-tête `Origin` hors de
  `CONTACT_ALLOWED_ORIGINS` reçoit `403`, requête préalable comprise ; une requête sans `Origin`
  est traitée ; un corps de plus de 64 Kio, annoncé ou non, reçoit `400`.

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
  `202` même piège rempli ou sans jeton, jusqu'au jeton (TK-18) et aux filtres (TK-22).

En local, le back lancé par `CONTACT_MAIL_SENDER=none ./mvnw spring-boot:run` :

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
- Une requête préalable `OPTIONS`, une autre méthode ou une autre route n'écrivent aucune ligne,
  même refusées.
- Jamais dans un journal : un champ du formulaire, une adresse e-mail, une adresse IP, la valeur
  d'un en-tête (`Origin` compris), le jeton, un extrait du corps.

Au démarrage, le back écrit le nombre d'origines autorisées et l'adaptateur d'envoi, jamais leur
valeur, avec un avertissement si l'adaptateur est `none`.

## Analyse statique

SpotBugs analyse le code principal à chaque `./mvnw verify` et fait échouer le build à la
première anomalie. Une exclusion, si elle est justifiée, s'ajoute dans `spotbugs-exclude.xml`,
avec un commentaire qui dit pourquoi.
