import mongoose from "mongoose";

/**
 * WatchEntry Schema
 * Represents a user's personal logged entry for a movie, series, or anime.
 * Allows multiple users to watch and review the same title independently.
 */
const watchEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      index: true,
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    // Snapshot of catalog title details for quick rendering:
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Movie", "Series", "Anime"],
      default: "Movie",
    },
    year: {
      type: String,
      default: "2026",
    },
    genre: {
      type: String,
      default: "Unfiled",
    },
    file: {
      type: String,
      required: true,
    },
    // User's personal review and status:
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    note: {
      type: String,
      default: "",
      trim: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    watchlist: {
      type: Boolean,
      default: false,
    },
    collectionName: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index so a user has at most one watch entry per movie
watchEntrySchema.index({ userId: 1, movieId: 1 }, { unique: true });

const WatchEntry = mongoose.model("WatchEntry", watchEntrySchema);

export default WatchEntry;

