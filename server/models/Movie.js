import mongoose from "mongoose";

/**
 * Movie / Media Catalog Schema
 * Represents a unique movie, series, or anime in the global catalog.
 */
const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      unique: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["Movie", "Series", "Anime"],
      default: "Movie",
    },
    year: {
      type: String,
      default: () => new Date().getFullYear().toString(),
      trim: true,
    },
    genre: {
      type: String,
      default: "Unfiled",
      trim: true,
    },
    description: {
      type: String,
      default: "A captivating visual story curated in Reelbox.",
      trim: true,
    },
    // The poster is stored directly in MongoDB as a Base64 string or image URI
    file: {
      type: String,
      required: [true, "Poster is required"],
    },
    addedBy: {
      type: String,
      default: "System",
    },
  },
  {
    timestamps: true,
  }
);

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
