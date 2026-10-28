package io.github.milkliz0rd.portfolio.web;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import java.util.Map;

import org.springframework.boot.test.context.TestComponent;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * A test controller under /api/v1/, the prefix of the form routes, imported by the web slice tests
 * of the HTTP foundation; a test component, so that component scanning leaves it out.
 */
@TestComponent
@RestController
@RequestMapping("/api/v1/test")
class ApiTestController {

	static final String OK = "/api/v1/test/ok";

	static final String BODY = "/api/v1/test/body";

	@GetMapping(path = "/ok", produces = APPLICATION_JSON_VALUE)
	Map<String, String> ok() {
		return Map.of("result", "ok");
	}

	@PostMapping(path = "/body", consumes = APPLICATION_JSON_VALUE)
	ResponseEntity<Void> body(@RequestBody Map<String, String> body) {
		return ResponseEntity.accepted().build();
	}

	@GetMapping("/failure")
	String failure() {
		throw new IllegalStateException("Test failure");
	}

}
