import { createServer } from "http";
import { parse } from "url";
import next from "next";

const nodeEnv = process.env.NODE_ENV ?? "development";
const dev = nodeEnv !== "production";
const port = parseInt(process.env.PORT ?? "3000", 10);
const hostname = process.env.HOSTNAME ?? "0.0.0.0";
const appUrl = process.env.APP_URL ?? `http://localhost:${port}`;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url ?? "/", true);
    handle(req, res, parsedUrl);
  }).listen(port, hostname, () => {
    console.log(`▲ Portfolio ready`);
    console.log(`  URL:      ${appUrl}`);
    console.log(`  NODE_ENV: ${nodeEnv}`);
    console.log(`  Listening: ${hostname}:${port}`);
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
