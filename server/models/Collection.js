import mongoose from "mongoose";

/**
 * Collection Schema
 * Represents a custom shelf/grouping for movies (e.g., "Late Night", "Mind Benders").
 */
const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Collection name is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Collection = mongoose.model("Collection", collectionSchema);

export default Collection;

