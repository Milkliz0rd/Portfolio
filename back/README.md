# Back

L'API du portfolio, en Spring Boot 4.1 sur Java 25, construite par Maven. Pour l'instant, elle
expose son indicateur de santé et le socle HTTP commun aux routes du formulaire, sous `/api/v1/`,
qui s'y brancheront.

## Prérequis

- **Java 25**, exigé par le build : sous un autre JDK, `./mvnw verify` s'arrête dès la phase
  `validate`, sur la règle de version (`RequireJavaVersion`), en nommant le JDK trouvé.
- Le JDK du système n'est pas forcément celui du terminal : avant toute commande,
  `./mvnw -v` (ou `mvn -v`) doit annoncer `Java version: 25`. Sinon, pointer `JAVA_HOME` sur
  un JDK 25 dans ce terminal.
- Maven n'a pas à être installé : `./mvnw` télécharge la version fixée dans
  `.mvn/wrapper/maven-wrapper.properties`.

## Commandes

Toutes se lancent depuis `back/`.

| Commande                              | Effet                                                                                                           |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `./mvnw verify`                       | vérifie la version de Java, compile, lance les tests, construit `target/portfolio-back.jar`, puis lance SpotBugs |
| `./mvnw spring-boot:run`              | lance le back en local sur `http://localhost:8080/`                                                             |
| `java -jar target/portfolio-back.jar` | lance le jar construit par `./mvnw verify`                                                                      |

Le port se change par la variable d'environnement `PORT`, par exemple
`PORT=9090 ./mvnw spring-boot:run`.

## Configuration

Toute valeur réglable passe par une variable d'environnement ; aucun fichier de variables n'est
versionné.

| Variable                  | Rôle                                                                                                                                                                                     | Par défaut                               |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `CONTACT_ALLOWED_ORIGINS` | origines exactes acceptées pour les appels de navigateur sous `/api/v1/`, séparées par des virgules : schéma `http` ou `https`, hôte en minuscules, port facultatif ; ni chemin, ni barre finale, ni joker | vide : aucune origine de navigateur acceptée |

Une origine mal formée empêche le back de démarrer ; le message nomme la variable, jamais sa
valeur. En développement, avec le serveur de développement du front :
`CONTACT_ALLOWED_ORIGINS=http://localhost:4200 ./mvnw spring-boot:run`.

## Ce que le back expose

Côté Actuator, seul l'indicateur de santé : `GET /actuator/health` répond `200` et exactement
`{"status":"UP"}`. Toute autre adresse d'Actuator répond `404`, la page `/actuator` comprise.

- Toute réponse porte `Cache-Control: no-store`, `X-Content-Type-Options: nosniff` et
  `Content-Security-Policy: frame-ancestors 'none'`.
- Toute erreur suit le format d'erreur du contrat d'API (section 4), en `application/json`.
- Sous `/api/v1/`, avant tout autre traitement : un en-tête `Origin` hors de
  `CONTACT_ALLOWED_ORIGINS` reçoit `403`, requête préalable comprise ; une requête sans `Origin`
  est traitée ; un corps de plus de 64 Kio, annoncé ou non, reçoit `400`.

## Analyse statique

SpotBugs analyse le code principal à chaque `./mvnw verify` et fait échouer le build à la
première anomalie. Une exclusion, si elle est justifiée, s'ajoute dans `spotbugs-exclude.xml`,
avec un commentaire qui dit pourquoi.
