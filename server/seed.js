import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Movie from "./models/Movie.js";
import WatchEntry from "./models/WatchEntry.js";
import Collection from "./models/Collection.js";
import User from "./models/User.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/reelbox";

const catalogItems = [
  {
    file: "/Posters/l_the-dark-knight-movie-poster_96214dbd.jpg",
    title: "The Dark Knight",
    type: "Movie",
    year: "2008",
    genre: "Crime · Drama",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
  },
  {
    file: "/Posters/xl_the-odyssey-movie-poster_81db230a.jpg",
    title: "The Odyssey",
    type: "Movie",
    year: "2026",
    genre: "Adventure · Epic",
    description: "An epic modern retelling of Homer's legendary journey across mythological seas, facing monsters, gods, and impossible trials to return home.",
  },
  {
    file: "/Posters/images.jpg",
    title: "Saiyaara",
    type: "Movie",
    year: "2025",
    genre: "Romance · Drama",
    description: "A tender, poetic exploration of two souls colliding across different worlds, intertwined by music, unspoken yearning, and memories that refuse to fade.",
  },
  {
    file: "/Posters/images (1).jpg",
    title: "Interstellar",
    type: "Movie",
    year: "2014",
    genre: "Sci-Fi · Drama",
    description: "A team of explorers travels through a wormhole in space in an attempt to ensure humanity's survival as Earth faces catastrophic environmental collapse.",
  },
  {
    file: "/Posters/images (2).jpg",
    title: "Inception",
    type: "Movie",
    year: "2010",
    genre: "Sci-Fi · Thriller",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
  },
  {
    file: "/Posters/images (3).jpg",
    title: "The Godfather",
    type: "Movie",
    year: "1972",
    genre: "Crime · Drama",
    description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
  },
  {
    file: "/Posters/images (4).jpg",
    title: "La La Land",
    type: "Movie",
    year: "2016",
    genre: "Romance · Musical",
    description: "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.",
  },
  {
    file: "/Posters/images (5).jpg",
    title: "Whiplash",
    type: "Movie",
    year: "2014",
    genre: "Drama · Music",
    description: "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.",
  },
  {
    file: "/Posters/images (6).jpg",
    title: "Dune",
    type: "Movie",
    year: "2021",
    genre: "Sci-Fi · Adventure",
    description: "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset while its heir becomes troubled by visions of a dark future.",
  },
  {
    file: "/Posters/images (7).jpg",
    title: "Parasite",
    type: "Movie",
    year: "2019",
    genre: "Thriller · Drama",
    description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
  },
  {
    file: "/Posters/images (8).jpg",
    title: "The Grand Budapest Hotel",
    type: "Movie",
    year: "2014",
    genre: "Comedy · Drama",
    description: "A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy in the hotel's glorious years under an exceptional concierge.",
  },
  {
    file: "/Posters/images (9).jpg",
    title: "Everything Everywhere All at Once",
    type: "Movie",
    year: "2022",
    genre: "Fantasy · Drama",
    description: "A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes and connecting with the lives she could have led.",
  },
];

const sampleCollections = [
  { name: "Late Night", description: "Films for quiet hours after midnight" },
  { name: "Mind Benders", description: "Puzzles, dreams, and intricate timelines" },
  { name: "Comfort Movies", description: "Stories that feel like coming home" },
  { name: "Weekend Picks", description: "Cinema worth sharing with friends" },
];

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB for seeding...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB!");

    // Clear existing data
    await Movie.deleteMany({});
    await WatchEntry.deleteMany({});
    await Collection.deleteMany({});
    await User.deleteMany({});
    console.log("Cleared existing data.");

    // Create sample accounts
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    await User.create({
      name: "amerinder",
      password: hashedPassword,
      bio: "Curating stories that linger long after the credits roll.",
    });

    await User.create({
      name: "cinephile",
      password: hashedPassword,
      bio: "Obsessed with cinema, anime arcs, and late night thrillers.",
    });
    console.log("Created users: 'amerinder' & 'cinephile' (no watch entries - unwatched by default).");

    // Insert Movie catalog items (unwatched by default for all users!)
    const createdMovies = await Movie.insertMany(catalogItems);
    console.log(`Seeded ${createdMovies.length} catalog items into MongoDB (all unwatched).`);

    // Insert collections
    await Collection.insertMany(sampleCollections);
    console.log(`Seeded ${sampleCollections.length} collections into MongoDB.`);

    console.log("Database successfully seeded: all movies are unwatched by default!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seedDatabase();
