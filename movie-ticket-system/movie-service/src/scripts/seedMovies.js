require("dotenv").config();

const mongoose = require("mongoose");
const Movie = require("../models/movie.model");

const HALL_ID = "66f000000000000000000010";

const SAMPLE_MOVIES = [
  {
    hallId: HALL_ID,
    name: "Avengers: Endgame",
    startDate: new Date(2024, 1, 1),
    endDate: new Date(2024, 1, 28),
    duration: 180,
    language: "English",
    genre: "Action",
    movieImageUrl: "https://via.placeholder.com/600x800?text=Avengers",
    showTime: ["10:00", "14:00", "18:00"],
    price: { ODC_Full: 500, ODC_Half: 300, Balcony: 800, Box: 1000 },
  },
  {
    hallId: HALL_ID,
    name: "Inception",
    startDate: new Date(2024, 1, 5),
    endDate: new Date(2024, 1, 20),
    duration: 148,
    language: "English",
    genre: "Sci-Fi",
    movieImageUrl: "https://via.placeholder.com/600x800?text=Inception",
    showTime: ["11:00", "15:00", "19:00"],
    price: { ODC_Full: 450, ODC_Half: 280, Balcony: 750, Box: 950 },
  },
  {
    hallId: HALL_ID,
    name: "Spider-Man: No Way Home",
    startDate: new Date(2024, 2, 1),
    endDate: new Date(2024, 2, 31),
    duration: 150,
    language: "English",
    genre: "Action",
    movieImageUrl: "https://via.placeholder.com/600x800?text=Spider-Man",
    showTime: ["09:30", "13:30", "17:30", "21:30"],
    price: { ODC_Full: 480, ODC_Half: 290, Balcony: 780, Box: 980 },
  },
  {
    hallId: HALL_ID,
    name: "Frozen II",
    startDate: new Date(2024, 3, 1),
    endDate: new Date(2024, 3, 30),
    duration: 103,
    language: "English",
    genre: "Animation",
    movieImageUrl: "https://via.placeholder.com/600x800?text=Frozen+II",
    showTime: ["10:00", "12:30", "15:00"],
    price: { ODC_Full: 400, ODC_Half: 250, Balcony: 700, Box: 900 },
  },
  {
    hallId: HALL_ID,
    name: "KGF: Chapter 2",
    startDate: new Date(2024, 4, 1),
    endDate: new Date(2024, 4, 31),
    duration: 168,
    language: "Kannada",
    genre: "Action",
    movieImageUrl: "https://via.placeholder.com/600x800?text=KGF+2",
    showTime: ["11:00", "16:00", "21:00"],
    price: { ODC_Full: 550, ODC_Half: 320, Balcony: 820, Box: 1050 },
  },
];

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    for (const m of SAMPLE_MOVIES) {
      const existing = await Movie.findOne({
        name: m.name,
        hallId: m.hallId,
      });
      if (existing) {
        console.log(`Movie already exists: ${m.name}`);
        continue;
      }
      const movie = await Movie.create(m);
      console.log(`Inserted movie ${m.name} with id=${movie._id}`);
    }
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    await mongoose.disconnect();
  }
};

run().then(() => {
  process.exit(0);
});

