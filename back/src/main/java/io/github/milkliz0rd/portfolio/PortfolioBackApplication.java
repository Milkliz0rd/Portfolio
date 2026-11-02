package io.github.milkliz0rd.portfolio;

import io.github.milkliz0rd.portfolio.config.ContactProperties;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableScheduling;

/** Starts the back, with the contact properties and the scheduled purge of the limit per address (PB-03). */
@SpringBootApplication
@EnableConfigurationProperties(ContactProperties.class)
@EnableScheduling
public class PortfolioBackApplication {

	public static void main(String[] args) {
		SpringApplication.run(PortfolioBackApplication.class, args);
	}

}
