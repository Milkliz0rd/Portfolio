package io.github.milkliz0rd.portfolio.web;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.util.Objects;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ReadListener;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import tools.jackson.databind.json.JsonMapper;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Bounds a request body under {@code /api/v1/} to 64 KiB (PB-06). A larger announced body gets the
 * contract's unreadable-body 400 at once; reading a body without announced length past the limit
 * fails, which Spring MVC turns into the same 400.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 30)
public class RequestSizeLimitFilter extends OncePerRequestFilter {

	/** 64 KiB; a valid E-02 body is about 17 KiB at most. */
	public static final int MAX_BODY_BYTES = 64 * 1024;

	private final ErrorResponseWriter errorResponseWriter;

	public RequestSizeLimitFilter(JsonMapper jsonMapper) {
		this.errorResponseWriter = new ErrorResponseWriter(jsonMapper);
	}

	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) {
		return !ApiRoutes.contains(request);
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws ServletException, IOException {
		if (request.getContentLengthLong() > MAX_BODY_BYTES) {
			this.errorResponseWriter.write(request, response, HttpStatus.BAD_REQUEST);
			return;
		}
		chain.doFilter(new BoundedBodyRequest(request), response);
	}

	/** Counts the bytes read from the body, whatever stream or reader reads them. */
	private static final class BoundedBodyRequest extends HttpServletRequestWrapper {

		private long remaining = MAX_BODY_BYTES;

		BoundedBodyRequest(HttpServletRequest request) {
			super(request);
		}

		@Override
		public ServletInputStream getInputStream() throws IOException {
			return new BoundedInputStream(super.getInputStream());
		}

		@Override
		public BufferedReader getReader() throws IOException {
			Charset charset = Charset.forName(Objects.requireNonNullElse(getCharacterEncoding(), "UTF-8"));
			return new BufferedReader(new InputStreamReader(getInputStream(), charset));
		}

		private final class BoundedInputStream extends ServletInputStream {

			private final ServletInputStream body;

			BoundedInputStream(ServletInputStream body) {
				this.body = body;
			}

			@Override
			public int read() throws IOException {
				int value = this.body.read();
				if (value != -1) {
					count(1);
				}
				return value;
			}

			@Override
			public int read(byte[] buffer, int offset, int length) throws IOException {
				int read = this.body.read(buffer, offset, length);
				if (read > 0) {
					count(read);
				}
				return read;
			}

			private void count(int read) throws IOException {
				remaining -= read;
				if (remaining < 0) {
					throw new IOException("The request body exceeds " + MAX_BODY_BYTES + " bytes.");
				}
			}

			@Override
			public boolean isFinished() {
				return this.body.isFinished();
			}

			@Override
			public boolean isReady() {
				return this.body.isReady();
			}

			@Override
			public void setReadListener(ReadListener listener) {
				this.body.setReadListener(listener);
			}

		}

	}

}
