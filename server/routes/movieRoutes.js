import express from "express";
import mongoose from "mongoose";
import Movie from "../models/Movie.js";
import WatchEntry from "../models/WatchEntry.js";

const router = express.Router();

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * @route   GET /api/movies/unwatched
 * @desc    Get catalog movies that the user has not yet marked as watched
 */
router.get("/unwatched", async (req, res) => {
  try {
    const { username } = req.query;
    let watchedIdentifiers = new Set();

    if (username) {
      const userEntries = await WatchEntry.find(
        { username, watchlist: false },
        "movieId title"
      );
      userEntries.forEach((e) => {
        if (e.movieId) watchedIdentifiers.add(e.movieId.toString());
        if (e.title) watchedIdentifiers.add(e.title.toLowerCase().trim());
      });
    }

    const catalog = await Movie.find().sort({ createdAt: -1 });

    const unwatched = catalog.filter((m) => {
      const idMatch = watchedIdentifiers.has(m._id.toString());
      const titleMatch = watchedIdentifiers.has(m.title.toLowerCase().trim());
      return !idMatch && !titleMatch;
    });

    res.json(unwatched);
  } catch (error) {
    console.error("Error fetching unwatched movies:", error);
    res.status(500).json({ message: "Failed to fetch unwatched movies" });
  }
});

/**
 * @route   GET /api/movies/search
 * @desc    Search catalog titles for search-first logging flow (returns all if q is empty)
 */
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      const all = await Movie.find().sort({ createdAt: -1 }).limit(50);
      return res.json(all);
    }

    const clean = escapeRegex(q.trim());
    const results = await Movie.find({
      $or: [
        { title: { $regex: clean, $options: "i" } },
        { genre: { $regex: clean, $options: "i" } },
        { type: { $regex: clean, $options: "i" } },
      ],
    }).limit(20);

    res.json(results);
  } catch (error) {
    console.error("Error searching catalog:", error);
    res.status(500).json({ message: "Failed to search movies" });
  }
});

/**
 * @route   GET /api/movies/suggest
 * @desc    Suggest catalog titles for live autocomplete
 */
router.get("/suggest", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      const initial = await Movie.find({}, "title type year genre file description")
        .sort({ createdAt: -1 })
        .limit(6);
      return res.json(initial);
    }

    const clean = escapeRegex(q.trim());
    const suggestions = await Movie.find(
      { title: { $regex: clean, $options: "i" } },
      "title type year genre file description"
    ).limit(8);

    res.json(suggestions);
  } catch (error) {
    console.error("Error suggesting titles:", error);
    res.status(500).json({ message: "Failed to suggest titles" });
  }
});

/**
 * @route   GET /api/movies/:id
 * @desc    Get dedicated movie page data: catalog details, community reviews, and average rating
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    let movie = null;
    let reviews = [];

    if (mongoose.Types.ObjectId.isValid(id)) {
      movie = await Movie.findById(id);

      if (!movie) {
        const entry = await WatchEntry.findById(id);
        if (entry && entry.movieId) {
          movie = await Movie.findById(entry.movieId);
        }
      }
    }

    if (!movie) {
      movie = await Movie.findOne({
        $or: [{ title: id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }],
      });
    }

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    reviews = await WatchEntry.find({
      $or: [{ movieId: movie._id }, { title: movie.title }],
    }).sort({ createdAt: -1 });

    const watchedReviews = reviews.filter((r) => !r.watchlist);
    const ratedReviews = watchedReviews.filter((r) => r.rating > 0);
    const totalRatings = ratedReviews.length;
    const sumRatings = ratedReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRatings ? (sumRatings / totalRatings).toFixed(1) : 5.0;

    const { username } = req.query;
    const userEntry = username ? reviews.find((r) => r.username === username) || null : null;

    res.json({
      movie,
      userEntry,
      stats: {
        avgRating: Number(avgRating),
        totalReviews: watchedReviews.length,
        totalWatched: watchedReviews.length,
        totalWatchlist: reviews.filter((r) => r.watchlist).length,
      },
      reviews: watchedReviews.map((r) => ({
        _id: r._id,
        username: r.username,
        rating: r.rating,
        note: r.note,
        favorite: r.favorite,
        watchlist: r.watchlist,
        collectionName: r.collectionName || "",
        createdAt: r.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching movie detail:", error);
    res.status(500).json({ message: "Failed to fetch movie detail" });
  }
});

/**
 * @route   POST /api/movies/:id/review
 * @desc    Submit or update user review and rating on a dedicated movie page
 */
router.post("/:id/review", async (req, res) => {
  try {
    const { id } = req.params;
    const { username = "demo", userId, rating, note, favorite, watchlist, collectionName } = req.body;

    let movie = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      movie = await Movie.findById(id);
    }
    if (!movie) {
      movie = await Movie.findOne({ title: id });
    }
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const effectiveUserId = userId || new mongoose.Types.ObjectId();

    const watchEntry = await WatchEntry.findOneAndUpdate(
      { username, movieId: movie._id },
      {
        userId: effectiveUserId,
        username,
        movieId: movie._id,
        title: movie.title,
        type: movie.type,
        year: movie.year,
        genre: movie.genre,
        file: movie.file,
        rating: Boolean(watchlist) ? 0 : Number(rating) || 5,
        note: Boolean(watchlist) ? "" : (note || ""),
        favorite: Boolean(watchlist) ? false : Boolean(favorite),
        watchlist: Boolean(watchlist),
        collectionName: collectionName !== undefined ? collectionName : "",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ message: "Review posted successfully", watchEntry });
  } catch (error) {
    console.error("Error posting review:", error);
    res.status(500).json({ message: "Failed to post review" });
  }
});

/**
 * @route   GET /api/movies
 * @desc    Get user's personal collection. If user has no entries, returns empty array [] (unwatched by default).
 */
router.get("/", async (req, res) => {
  try {
    const { username, query, tab, type, collection } = req.query;
    const filter = {};

    if (username) {
      filter.username = username;
    }

    if (query) {
      filter.title = { $regex: escapeRegex(query), $options: "i" };
    }

    if (tab === "Favorites") {
      filter.favorite = true;
    } else if (tab === "Watchlist") {
      filter.watchlist = true;
    }

    if (collection) {
      filter.collectionName = collection;
    }

    if (type && ["Movie", "Series", "Anime"].includes(type)) {
      filter.type = type;
    }

    const entries = await WatchEntry.find(filter).sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ message: "Failed to fetch movies", error: error.message });
  }
});

/**
 * @route   POST /api/movies
 * @desc    Add or log a title. Reuses catalog item if existing, otherwise adds it to catalog with poster in MongoDB.
 */
router.post("/", async (req, res) => {
  try {
    const {
      title,
      type = "Movie",
      year,
      genre,
      description,
      file,
      rating = 5,
      note = "",
      username = "demo",
      userId,
      watchlist = false,
      favorite = false,
      collectionName = "",
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const cleanTitle = title.trim();

    // 1. Check if movie already exists in the global Movie catalog
    let catalogMovie = await Movie.findOne({
      title: { $regex: `^${escapeRegex(cleanTitle)}$`, $options: "i" },
    });

    if (!catalogMovie) {
      catalogMovie = new Movie({
        title: cleanTitle,
        type: ["Movie", "Series", "Anime"].includes(type) ? type : "Movie",
        year: year || new Date().getFullYear().toString(),
        genre: genre || "Unfiled",
        description: description || "A captivating story curated in Reelbox.",
        file: file || "/Posters/saiyaara.jpg",
        addedBy: username,
      });
      await catalogMovie.save();
    }

    // 2. Resolve user ID
    const effectiveUserId = userId || catalogMovie._id;

    // 3. Upsert user's personal WatchEntry
    const watchEntry = await WatchEntry.findOneAndUpdate(
      { username, movieId: catalogMovie._id },
      {
        userId: effectiveUserId,
        username,
        movieId: catalogMovie._id,
        title: catalogMovie.title,
        type: catalogMovie.type,
        year: catalogMovie.year,
        genre: catalogMovie.genre,
        file: catalogMovie.file,
        rating: Boolean(watchlist) ? 0 : Number(rating) || 5,
        note: Boolean(watchlist) ? "" : (note || ""),
        favorite: Boolean(watchlist) ? false : Boolean(favorite),
        watchlist: Boolean(watchlist),
        collectionName: collectionName || "",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(watchEntry);
  } catch (error) {
    console.error("Error adding title:", error);
    res.status(500).json({ message: "Failed to add title", error: error.message });
  }
});

/**
 * @route   PATCH /api/movies/:id
 * @desc    Update watch entry (favorite, watchlist, rating, note)
 */
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    let updated = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      updated = await WatchEntry.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });
    }

    if (!updated) {
      updated = await WatchEntry.findOneAndUpdate({ movieId: id }, updates, { new: true });
    }

    if (!updated && mongoose.Types.ObjectId.isValid(id)) {
      updated = await Movie.findByIdAndUpdate(id, updates, { new: true });
    }

    if (!updated) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Error updating entry:", error);
    res.status(500).json({ message: "Failed to update entry", error: error.message });
  }
});

/**
 * @route   DELETE /api/movies/:id
 * @desc    Delete a movie/watch entry by ID
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    let deleted = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      deleted = await WatchEntry.findByIdAndDelete(id);
    }

    if (!deleted) {
      deleted = await WatchEntry.findOneAndDelete({ movieId: id });
    }

    if (!deleted && mongoose.Types.ObjectId.isValid(id)) {
      deleted = await Movie.findByIdAndDelete(id);
    }

    if (!deleted) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.json({ message: "Entry deleted successfully", id });
  } catch (error) {
    console.error("Error deleting entry:", error);
    res.status(500).json({ message: "Failed to delete entry", error: error.message });
  }
});

export default router;
