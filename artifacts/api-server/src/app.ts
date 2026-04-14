import express, { type Express } from "express";
import cors from "cors";
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

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "CineVerse API Server is running" });
});

app.use("/api/ml", createProxyMiddleware({ target: "http://localhost:5000", changeOrigin: true, pathRewrite: { "^/api/ml": "" } }));
app.use("/api", router);

// Initialize database tables on first import
initDatabase().catch((err) => {
  logger.error({ err }, "Fatal: database initialization failed");
  process.exit(1);
});

export default app;
