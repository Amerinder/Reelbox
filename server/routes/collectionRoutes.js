import express from "express";
import Collection from "../models/Collection.js";

const router = express.Router();

/**
 * @route   GET /api/collections
 * @desc    Get all custom shelves/collections
 */
router.get("/", async (req, res) => {
  try {
    const collections = await Collection.find().sort({ createdAt: 1 });
    res.json(collections);
  } catch (error) {
    console.error("Error fetching collections:", error);
    res.status(500).json({ message: "Failed to fetch collections", error: error.message });
  }
});

/**
 * @route   POST /api/collections
 * @desc    Create a new collection
 */
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Collection name is required" });
    }

    const existing = await Collection.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: "Collection already exists" });
    }

    const collection = new Collection({
      name: name.trim(),
      description: description || "",
    });

    const saved = await collection.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error creating collection:", error);
    res.status(500).json({ message: "Failed to create collection", error: error.message });
  }
});

export default router;

