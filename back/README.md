# Back

L'API du portfolio, en Spring Boot 4.1 sur Java 25, construite par Maven. Pour l'instant, elle
ne fait que démarrer et exposer son indicateur de santé.

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

## Ce que le back expose

Seul l'indicateur de santé d'Actuator : `GET /actuator/health` répond `200` et exactement
`{"status":"UP"}`. Toute autre adresse d'Actuator répond `404`, la page `/actuator` comprise.

## Analyse statique

SpotBugs analyse le code principal à chaque `./mvnw verify` et fait échouer le build à la
première anomalie. Une exclusion, si elle est justifiée, s'ajoute dans `spotbugs-exclude.xml`,
avec un commentaire qui dit pourquoi.
