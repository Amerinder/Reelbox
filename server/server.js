import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import movieRoutes from "./routes/movieRoutes.js";
import collectionRoutes from "./routes/collectionRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/reelbox";

// Middleware - Allow up to 25mb payload for Base64 posters stored in MongoDB
app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Serve static uploads if needed
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/movies", movieRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Connect to MongoDB & Start Server
async function startServer() {
  try {
    console.log("Connecting to MongoDB at:", MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(`Reelbox Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
}

startServer();
