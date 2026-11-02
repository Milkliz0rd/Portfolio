package io.github.milkliz0rd.portfolio.web;

import java.net.Inet6Address;
import java.net.InetAddress;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HexFormat;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

import jakarta.servlet.http.HttpServletRequest;
import org.jspecify.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * The key of the visitor's address, for the limit per address (PB-03): the only code that reads the
 * proxy's header and the connection's address. The address is the element of rank
 * {@code CONTACT_CLIENT_IP_POSITION}, counted from the right, of the list in the header named by
 * {@code CONTACT_CLIENT_IP_HEADER}, to which the host's proxy appends: the first one a visitor cannot
 * forge. Several lines of the header make a single list, joined in their order (RFC 9110, section
 * 5.3), whose empty elements are ignored (section 5.6.1). An element is read by
 * {@link InetAddress#ofLiteral}, which asks no name service. The key of an IPv4 address is the
 * address; that of an IPv6 address, its /64 prefix, which a subscriber receives whole. Without header
 * setting (development), the key is the connection's address; so it is when the header is missing,
 * the list too short or the element not an address, which a warning without value tells once per
 * startup: a setting to look at again. Not a bean, so that the web slices that load the code using it
 * need nothing more. No text of this class shows an address.
 */
public final class ClientIpResolver {

	private static final Logger LOGGER = LoggerFactory.getLogger(ClientIpResolver.class);

	private static final int IPV6_PREFIX_BYTES = 8;

	private final String header;

	private final int position;

	private final AtomicBoolean warned = new AtomicBoolean();

	/** The header, empty for the connection's address, and the rank, from 1, both checked at startup. */
	public ClientIpResolver(String header, int position) {
		this.header = header;
		this.position = position;
	}

	/** The key of the visitor's address for this request. */
	public String resolve(HttpServletRequest request) {
		if (!this.header.isEmpty()) {
			String key = fromHeader(request);
			if (key != null) {
				return key;
			}
			if (this.warned.compareAndSet(false, true)) {
				LOGGER.warn("CONTACT_CLIENT_IP_HEADER is set, but a request had no address at"
						+ " CONTACT_CLIENT_IP_POSITION in it: the connection's address is used; check both settings");
			}
		}
		String connection = request.getRemoteAddr();
		String key = keyOf(connection);
		return (key != null) ? key : connection;
	}

	/** The key of the element at the rank, counted from the right; none if it is missing or no address. */
	private @Nullable String fromHeader(HttpServletRequest request) {
		Enumeration<String> lines = request.getHeaders(this.header);
		List<String> elements = new ArrayList<>();
		while (lines != null && lines.hasMoreElements()) {
			for (String element : lines.nextElement().split(",", -1)) {
				// The optional whitespace around each element.
				String value = element.strip();
				if (!value.isEmpty()) {
					elements.add(value);
				}
			}
		}
		return (this.position <= elements.size()) ? keyOf(elements.get(elements.size() - this.position)) : null;
	}

	/** The key of an address literal; none if it is not one. */
	private static @Nullable String keyOf(String literal) {
		InetAddress address;
		try {
			address = InetAddress.ofLiteral(literal);
		}
		catch (IllegalArgumentException ex) {
			return null;
		}
		// An IPv4-mapped IPv6 address is read as the IPv4 address.
		return (address instanceof Inet6Address)
				? HexFormat.of().formatHex(address.getAddress(), 0, IPV6_PREFIX_BYTES) + "/64" : address.getHostAddress();
	}

}
