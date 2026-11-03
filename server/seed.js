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
    genre: "Crime · Action · Drama",
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
    file: "/Posters/saiyaara.jpg",
    title: "Saiyaara",
    type: "Movie",
    year: "2025",
    genre: "Romance · Drama",
    description: "A tender, poetic exploration of two souls colliding across different worlds, intertwined by music, unspoken yearning, and memories that refuse to fade.",
  },
  {
    file: "/Posters/openhimer.jpg",
    title: "Oppenheimer",
    type: "Movie",
    year: "2023",
    genre: "Biography · Drama · History",
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during the Manhattan Project.",
  },
  {
    file: "/Posters/batman.jpg",
    title: "The Batman",
    type: "Movie",
    year: "2022",
    genre: "Action · Crime · Drama",
    description: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
  },
  {
    file: "/Posters/dune.jpg",
    title: "Dune",
    type: "Movie",
    year: "2021",
    genre: "Sci-Fi · Adventure",
    description: "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset while its heir becomes troubled by visions of a dark future.",
  },
  {
    file: "/Posters/avengersinfinity war.jpg",
    title: "Avengers: Infinity War",
    type: "Movie",
    year: "2018",
    genre: "Action · Sci-Fi · Adventure",
    description: "The Avengers and their allies must be willing to sacrifice all in an attempt to defeat the powerful Thanos before his blitz of devastation and ruin puts an end to the universe.",
  },
  {
    file: "/Posters/avtar.jpg",
    title: "Avatar",
    type: "Movie",
    year: "2009",
    genre: "Sci-Fi · Adventure · Action",
    description: "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.",
  },
  {
    file: "/Posters/animal.jpg",
    title: "Animal",
    type: "Movie",
    year: "2023",
    genre: "Action · Crime · Drama",
    description: "The son of a wealthy and powerful industrialist returns home following an attack on his father and embarks on a bloody path of vengeance.",
  },
  {
    file: "/Posters/joker.jpg",
    title: "Joker",
    type: "Movie",
    year: "2019",
    genre: "Crime · Drama · Thriller",
    description: "During the 1980s, a failed stand-up comedian is driven insane and turns to a life of crime and chaos in Gotham City while becoming an infamous psychopathic crime figure.",
  },
  {
    file: "/Posters/spidermandrandnewday.jpg",
    title: "Spider-Man: Brand New Day",
    type: "Movie",
    year: "2026",
    genre: "Action · Adventure · Sci-Fi",
    description: "Peter Parker navigates life in New York with a clean slate, stepping up as the friendly neighborhood hero when new threats emerge across the borough.",
  },
  {
    file: "/Posters/starwars.jpg",
    title: "Star Wars",
    type: "Movie",
    year: "1977",
    genre: "Action · Adventure · Fantasy",
    description: "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire's world-destroying battle station.",
  },
  {
    file: "/Posters/mahavatar.jpg",
    title: "Mahavatar",
    type: "Movie",
    year: "2026",
    genre: "Mythology · Epic · Action",
    description: "An awe-inspiring mythological spectacle chronicling the timeless saga of Chiranjeevi Parashurama, defender of righteousness and eternal warrior.",
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

    // 1. Remove old movies and re-insert the 13 accurate catalog items with updated posters
    await Movie.deleteMany({});
    const createdMovies = await Movie.insertMany(catalogItems);
    console.log(`Seeded ${createdMovies.length} catalog items into MongoDB with updated poster paths.`);

    // 2. Update any existing watch entries to point to the new poster paths
    for (const item of catalogItems) {
      await WatchEntry.updateMany(
        { title: { $regex: new RegExp(`^${item.title}$`, "i") } },
        { $set: { file: item.file, year: item.year, genre: item.genre } }
      );
    }
    console.log("Synchronized existing watch entries with updated poster files.");

    // 3. Ensure collections exist
    for (const sc of sampleCollections) {
      await Collection.findOneAndUpdate(
        { name: sc.name },
        { $set: sc },
        { upsert: true, new: true }
      );
    }
    console.log(`Ensured ${sampleCollections.length} collections exist.`);

    // 4. Ensure default users exist without deleting existing users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);
    const defaultUsers = [
      { name: "amerinder", bio: "Curating stories that linger long after the credits roll." },
      { name: "cinephile", bio: "Obsessed with cinema, anime arcs, and late night thrillers." },
      { name: "anshu", bio: "Cinema lover and collector." },
    ];
    for (const u of defaultUsers) {
      const existing = await User.findOne({ name: u.name });
      if (!existing) {
        await User.create({
          name: u.name,
          password: hashedPassword,
          bio: u.bio,
        });
        console.log(`Created user '${u.name}'.`);
      }
    }

    console.log("Database successfully updated with accurate poster files!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seedDatabase();
