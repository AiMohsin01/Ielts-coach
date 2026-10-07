import { createServer } from "node:http";
import { resolve } from "node:path";
import next from "next";
import { app } from "./app.js";
import { config } from "./config.js";
import { pool } from "./db/pool.js";

async function start() {
  const web = next({ dev: false, dir: resolve(process.cwd(), "../web") });
  await web.prepare();
  const handle = web.getRequestHandler();
  const server = createServer((req, res) => {
    const path = new URL(req.url ?? "/", "http://localhost").pathname;
    if (path === "/api" || path.startsWith("/api/") || path === "/health" || path.startsWith("/uploads/")) {
      app(req, res);
    } else {
      void handle(req, res).catch(() => {
        console.error("Website request failed");
        if (!res.headersSent) res.writeHead(500);
        res.end("Something went wrong");
      });
    }
  });
  server.listen(config.port, "0.0.0.0", () => console.log(`IELTS Coach listening on port ${config.port}`));
  const stop = () => server.close(() => { void pool.end().then(() => process.exit(0)); });
  process.on("SIGTERM", stop);
  process.on("SIGINT", stop);
}

start().catch(() => { console.error("Could not start IELTS Coach"); process.exit(1); });
