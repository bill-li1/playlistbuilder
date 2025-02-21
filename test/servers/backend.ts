const createServer = (port: number) => {
  const server = Bun.serve({
    port,
    hostname: "localhost",

    fetch(req: Request) {
      const url = new URL(req.url);

      // Health check endpoint
      if (url.pathname === "/health") {
        return new Response("OK", { status: 200 });
      }

      // Echo endpoint with server information
      return new Response(
        JSON.stringify(
          {
            server: `Backend Server on port ${port}`,
            timestamp: new Date().toISOString(),
            path: url.pathname,
            method: req.method,
          },
          null,
          2
        ),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
  });

  console.log(
    `Backend server running at http://${server.hostname}:${server.port}`
  );
  return server;
};

// Create two backend servers
const server1 = createServer(3001);
const server2 = createServer(3002);
