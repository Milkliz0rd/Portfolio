package io.github.milkliz0rd.portfolio;

import io.github.milkliz0rd.portfolio.config.ContactProperties;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(ContactProperties.class)
public class PortfolioBackApplication {

	public static void main(String[] args) {
		SpringApplication.run(PortfolioBackApplication.class, args);
	}

}
