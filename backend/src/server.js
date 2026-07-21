import "dotenv/config";
import cors from "cors";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initializeDatabase, pool } from "./db.js";

const app = express();
const port = Number(process.env.PORT || 3001);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = process.env.STATIC_DIR
  ? path.resolve(process.cwd(), process.env.STATIC_DIR)
  : path.resolve(__dirname, "../../frontend/dist");

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/staffs", async (_req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT email, name FROM staffs ORDER BY name ASC");
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.use(express.static(frontendDistPath));

app.get("*", (_req, res) => {
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({
    error: "Internal server error",
    message: error.message
  });
});

initializeDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Backend listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database:", error.message);
    process.exit(1);
  });
