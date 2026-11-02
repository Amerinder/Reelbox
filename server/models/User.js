import mongoose from "mongoose";

/**
 * User Schema
 * Represents user credentials and public profile for Reelbox.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    bio: {
      type: String,
      default: "Cinema enthusiast & story collector.",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
