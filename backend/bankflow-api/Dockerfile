FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
COPY src src

RUN chmod +x mvnw && ./mvnw -B -DskipTests package

FROM eclipse-temurin:17-jre

WORKDIR /app

RUN useradd --system --uid 10001 appuser

COPY --from=build /app/target/bankflow-api-0.0.1-SNAPSHOT.jar app.jar

USER 10001

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
