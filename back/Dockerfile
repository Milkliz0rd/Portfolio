# Image du back (TK-14, PB-08), construite depuis back/ : docker build -t portfolio-back .
# Les images de base sont épinglées par étiquette et par empreinte. L'empreinte est celle de
# l'index multi-architecture : la même ligne sert arm64 en local, amd64 en CI et chez
# l'hébergeur. Le robot de mises à jour propose chaque semaine la nouvelle empreinte de
# l'étiquette, ou une nouvelle étiquette de Java 25 (dependabot.yml).

# 1. build : le jar seul. Tests et analyse statique tournent dans la CI, pas ici.
FROM eclipse-temurin:25-jdk@sha256:3ab7fc8d0b4ade8fef96903fb36767c1dbb4fd1535dcfad85b59c17afbbb5857 AS build
WORKDIR /build
# Le wrapper et le pom d'abord : la couche des dépendances ne se refait que si le pom change.
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN ./mvnw -B -ntp dependency:go-offline
COPY src src
RUN ./mvnw -B -ntp package -DskipTests

# 2. extract : la forme extraite du jar, que demande le cache AOT de Spring Boot.
FROM eclipse-temurin:25-jdk@sha256:3ab7fc8d0b4ade8fef96903fb36767c1dbb4fd1535dcfad85b59c17afbbb5857 AS extract
WORKDIR /extract
COPY --from=build /build/target/portfolio-back.jar ./
RUN java -Djarmode=tools -jar portfolio-back.jar extract --layers --destination extracted \
    --application-filename application.jar

# 3. runtime : la JRE, l'application extraite et son cache AOT, sans droits d'administration.
FROM eclipse-temurin:25-jre@sha256:78f1f183913482ef390c2722f46c3f0ce76ada341d69590e7c482ec943ee72d5 AS runtime
# source relie le paquet du registre de conteneurs de GitHub au dépôt ; titre et description
# remplacent ceux de l'image d'Ubuntu, dont ils seraient hérités.
LABEL org.opencontainers.image.source="https://github.com/Milkliz0rd/Portfolio" \
      org.opencontainers.image.title="portfolio-back" \
      org.opencontainers.image.description="API du portfolio : Spring Boot sur Java 25, avec le cache AOT de la JVM"
RUN groupadd --system --gid 10001 portfolio \
    && useradd --system --uid 10001 --gid 10001 --no-create-home --shell /usr/sbin/nologin portfolio
WORKDIR /application
# Des couches qui changent le moins à celle qui change le plus : un changement du code ne
# refait que la dernière.
COPY --from=extract /extract/extracted/dependencies/ ./
COPY --from=extract /extract/extracted/spring-boot-loader/ ./
COPY --from=extract /extract/extracted/snapshot-dependencies/ ./
COPY --from=extract /extract/extracted/application/ ./
# Lues par la commande java à l'entraînement comme à l'exécution : le cache AOT n'est valable
# qu'avec la même JVM, les mêmes options et les mêmes chemins de classes.
ENV JDK_JAVA_OPTIONS="-XX:+UseSerialGC -XX:MaxRAMPercentage=60"
# Exécution d'entraînement : le contexte démarre puis s'arrête, et la JVM écrit app.aot, avec
# 512 Mo simulés comme l'instance gratuite. Les deux variables ne valent que pour cette commande :
# un secret de jeton tiré au hasard ici, jamais écrit ni gardé dans l'image, et l'adaptateur
# d'envoi qui n'envoie rien. Le back ne les lit pas encore : elles sont posées dès maintenant
# pour que le jeton (TK-18) et l'envoi (TK-20) n'aient pas à toucher ce fichier.
RUN CONTACT_TOKEN_SECRET="$(head -c 32 /dev/urandom | base64 -w0)" CONTACT_MAIL_SENDER=none \
    java -XX:MaxRAM=512m -XX:AOTCacheOutput=app.aot -Dspring.context.exit=onRefresh -jar application.jar
USER 10001:10001
# Port par défaut ; l'hébergeur le change par la variable PORT, seul fait de lui que le back lit.
EXPOSE 8080
ENTRYPOINT ["java", "-XX:AOTCache=app.aot", "-jar", "application.jar"]
