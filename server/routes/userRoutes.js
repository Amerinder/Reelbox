import express from "express";
import User from "../models/User.js";
import WatchEntry from "../models/WatchEntry.js";

const router = express.Router();

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * @route   GET /api/users/search
 * @desc    Search users by username
 */
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      // Do not return any users when query is empty
      return res.json([]);
    }

    const clean = escapeRegex(q.trim());
    const users = await User.find(
      { name: { $regex: clean, $options: "i" } },
      "name bio createdAt"
    ).limit(10);

    res.json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Failed to search users" });
  }
});

/**
 * @route   GET /api/users/:username
 * @desc    Get a user's public profile, watched movies, reviews, and stats
 */
router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ name: username }, "name bio createdAt");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get all watch entries for this user
    const entries = await WatchEntry.find({ username }).sort({ createdAt: -1 });

    // Aggregate unique collections for this user
    const collections = [
      ...new Set(entries.map((e) => e.collectionName).filter(Boolean)),
    ];

    res.json({
      user,
      stats: {
        total: entries.length,
        favorites: entries.filter((e) => e.favorite).length,
        watchlist: entries.filter((e) => e.watchlist).length,
        movies: entries.filter((e) => e.type === "Movie").length,
        series: entries.filter((e) => e.type === "Series").length,
        anime: entries.filter((e) => e.type === "Anime").length,
      },
      collections,
      movies: entries,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
});

export default router;

