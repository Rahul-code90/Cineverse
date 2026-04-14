import express, { type Express } from "express";
import cors from "cors";
import path from "path";
import { createProxyMiddleware } from "http-proxy-middleware";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { initDatabase } from "./lib/init-db";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "CineVerse API Server is running" });
});

// Proxy ML requests to the ML service
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:5000";
app.use("/api/ml", createProxyMiddleware({ 
  target: ML_SERVICE_URL, 
  changeOrigin: true, 
  pathRewrite: { "^/api/ml": "" } 
}));

app.use("/api", router);

// Serve static frontend files in production
if (process.env.NODE_ENV === "production" || process.env.SERVE_FRONTEND === "true") {
  const publicPath = path.resolve(import.meta.dirname, "../../cineverse-bookings/dist/public");
  app.use(express.static(publicPath));
  
  // SPA Routing: Send index.html for any other routes (except API)
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(publicPath, "index.html"));
  });
}

// Initialize database tables on first import
initDatabase().catch((err) => {
  logger.error({ err }, "Fatal: database initialization failed");
  process.exit(1);
});

export default app;
