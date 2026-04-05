import { createServer } from "http";
import { parse } from "url";
import next from "next";

const port = parseInt(process.env.PORT ?? "3000", 10);
const hostname = process.env.HOSTNAME ?? "0.0.0.0";
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url ?? "/", true);
    handle(req, res, parsedUrl);
  }).listen(port, hostname, () => {
    console.log(`▲ Portfolio ready on http://${hostname === "0.0.0.0" ? "localhost" : hostname}:${port}`);
    console.log(`  NODE_ENV: ${process.env.NODE_ENV ?? "development"}`);
  });

  process.on("SIGTERM", () => {
    console.log("SIGTERM received — shutting down gracefully");
    process.exit(0);
  });

  process.on("SIGINT", () => {
    console.log("SIGINT received — shutting down gracefully");
    process.exit(0);
  });
});
