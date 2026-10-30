package io.github.milkliz0rd.portfolio.sender.brevo;

import java.io.IOException;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.URI;
import java.time.Duration;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import com.sun.net.httpserver.HttpServer;

/**
 * The HTTP server built into the JDK, on the loopback address, for the tests of the real client
 * (PB-07): it answers every request with a status and no body, after a delay that its closing cuts
 * short. It records the path of each request.
 */
final class LocalHttpServer implements AutoCloseable {

	private final HttpServer server;

	private final ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();

	private final CountDownLatch closing = new CountDownLatch(1);

	private final List<String> paths = new CopyOnWriteArrayList<>();

	LocalHttpServer(int status, Duration delay) throws IOException {
		this.server = HttpServer.create(new InetSocketAddress(InetAddress.getLoopbackAddress(), 0), 0);
		this.server.setExecutor(this.executor);
		this.server.createContext("/", (exchange) -> {
			this.paths.add(exchange.getRequestURI().getPath());
			exchange.getRequestBody().readAllBytes();
			try {
				this.closing.await(delay.toMillis(), TimeUnit.MILLISECONDS);
				exchange.sendResponseHeaders(status, -1);
			}
			catch (InterruptedException ex) {
				Thread.currentThread().interrupt();
			}
			finally {
				exchange.close();
			}
		});
		this.server.start();
	}

	/** The base address of a client of this server, as Brevo's ends with its version. */
	URI baseUrl() {
		InetSocketAddress address = this.server.getAddress();
		return URI.create("http://" + address.getAddress().getHostAddress() + ":" + address.getPort() + "/v3");
	}

	List<String> paths() {
		return List.copyOf(this.paths);
	}

	@Override
	public void close() {
		this.closing.countDown();
		this.server.stop(0);
		this.executor.shutdownNow();
	}

}
