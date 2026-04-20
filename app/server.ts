import "@/lib/loadEnv";
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { setupSocketHandlers } from "./lib/socket-handlers";

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT ? process.env.PORT : "3000");
const hostname = process.env.HOSTNAME || "localhost";
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);
  

  setupSocketHandlers(io);

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, hostname, () => {
      console.log(`> Server is ready on http://${hostname}:${port}`);
    });
});