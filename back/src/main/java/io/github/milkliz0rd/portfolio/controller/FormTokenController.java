package io.github.milkliz0rd.portfolio.controller;

import io.github.milkliz0rd.portfolio.dto.response.FormTokenResponse;
import io.github.milkliz0rd.portfolio.service.FormTokenService;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * E-01 of the contract, the request of a form token: {@code POST /api/v1/form-tokens}, without
 * parameter nor body, answered 200 with a new token and the delays in force (PB-02). No body is
 * read, so neither a content type nor a body is ever refused. The filters of the HTTP foundation run
 * before; every error is the global handler's; no log line is written (PB-05).
 */
@RestController
public class FormTokenController {

	/** The route of E-01. */
	public static final String ROUTE = "/api/v1/form-tokens";

	private final FormTokenService formTokenService;

	public FormTokenController(FormTokenService formTokenService) {
		this.formTokenService = formTokenService;
	}

	@PostMapping(path = ROUTE, produces = MediaType.APPLICATION_JSON_VALUE)
	public FormTokenResponse issue() {
		return new FormTokenResponse(this.formTokenService.issue(), this.formTokenService.minDelaySeconds(),
				this.formTokenService.expiresInSeconds());
	}

}
