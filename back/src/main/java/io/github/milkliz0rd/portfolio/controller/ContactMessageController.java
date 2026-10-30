package io.github.milkliz0rd.portfolio.controller;

import io.github.milkliz0rd.portfolio.dto.request.ContactMessageRequest;
import io.github.milkliz0rd.portfolio.service.ContactService;
import jakarta.validation.Valid;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * E-02 of the contract, the sending of a message: {@code POST /api/v1/contact-messages}, a JSON
 * body read strictly and validated again (section 3), then handed to the contact service; 202
 * without body. The filters of the HTTP foundation run before; every error is the global handler's.
 * JSON is the only type it produces, its errors' type: another {@code Accept} gets the 406.
 */
@RestController
public class ContactMessageController {

	/** The route of E-02. */
	public static final String ROUTE = "/api/v1/contact-messages";

	private final ContactService contactService;

	public ContactMessageController(ContactService contactService) {
		this.contactService = contactService;
	}

	@PostMapping(path = ROUTE, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Void> send(@Valid @RequestBody ContactMessageRequest request) {
		this.contactService.send(request.toContactMessage());
		return ResponseEntity.accepted().build();
	}

}
