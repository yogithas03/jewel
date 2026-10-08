import express from "express";
import { createServer as createHttpServer } from "node:http";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getMetalRatesResponse } from "./server/metalsRoute.js";

const projectDirectory = path.dirname(fileURLToPath(import.meta.url));
const distDirectory = path.join(projectDirectory, "dist");
const port = Number(process.env.PORT) || 3001;
const app = express();

if (!process.env.METALS_API_KEY) {
  try {
    const envFile = readFileSync(path.join(projectDirectory, ".env"), "utf8");
    const keyLine = envFile.match(/^\s*METALS_API_KEY\s*=\s*(.*?)\s*$/m);
    if (keyLine) process.env.METALS_API_KEY = keyLine[1].replace(/^["']|["']$/g, "");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

app.disable("x-powered-by");

async function sendRates(request, response) {
  response.set("Cache-Control", "no-store");
  const result = await getMetalRatesResponse({
    method: request.method,
    force: request.query.refresh === "true",
  });
  return response.status(result.status).json(result.body);
}

app.get("/api/metals/rates", sendRates);
app.get("/api/metal-rates", sendRates);
app.all("/api/metals/rates", (_request, response) => {
  response.set("Allow", "GET");
  response.status(405).json({
    success: false,
    message: "Method not allowed. Use GET /api/metals/rates.",
  });
});
app.all("/api/{*path}", (_request, response) => {
  response.status(404).json({ success: false, message: "API endpoint not found." });
});

const httpServer = createHttpServer(app);

if (process.argv.includes("--dev")) {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: { server: httpServer } },
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(distDirectory, { index: false }));
  app.get(/.*/, (_request, response) => {
    response.sendFile(path.join(distDirectory, "index.html"), (error) => {
      if (error) {
        console.error("Failed to serve the built app:", error);
        if (!response.headersSent) {
          response.status(503).send("Build the app with npm run build before starting the production server.");
        }
      }
    });
  });
}

app.use((error, request, response, _next) => {
  console.error("Unhandled server request error:", error);
  if (request.path.startsWith("/api/")) {
    return response.status(500).json({
      success: false,
      message: "Unable to fetch today's metal rates. Please try again.",
    });
  }
  return response.status(500).send("Internal server error.");
});

httpServer.listen(port, () => {
  console.log(`Dikshi Jewellery listening on http://localhost:${port}`);
});
