const mongoose = require("mongoose");
const Movie = require("../models/movie.model");

function normalizePrice(price) {
  if (!price) {
    return {
      ODC_Full: 0,
      ODC_Half: 0,
      Balcony: 0,
      Box: 0,
    };
  }
  return {
    ODC_Full: Number(price.ODC_Full || 0),
    ODC_Half: Number(price.ODC_Half || 0),
    Balcony: Number(price.Balcony || 0),
    Box: Number(price.Box || 0),
  };
}

async function createMovie(payload) {
  const data = { ...payload };

  if (!data.hallId) {
    throw new Error("hallId is required");
  }

  data.hallId = new mongoose.Types.ObjectId(data.hallId);
  data.price = normalizePrice(data.price);

  const movie = await Movie.create(data);
  return String(movie._id);
}

async function getAllMovies(hallId) {
  const filter = {};

  if (hallId) {
    filter.hallId = new mongoose.Types.ObjectId(hallId);
  }

  const movies = await Movie.find(filter).sort({ _id: -1 }).lean();
  return movies.map((m) => ({
    ...m,
    _id: String(m._id),
    hallId: String(m.hallId),
  }));
}

async function getMovieById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  const movie = await Movie.findById(id).lean();
  if (!movie) return null;

  return {
    ...movie,
    _id: String(movie._id),
    hallId: String(movie.hallId),
  };
}

async function updateMovieById(id, payload) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  const data = {};
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      data[key] = value;
    }
  });

  if (data.hallId) {
    data.hallId = new mongoose.Types.ObjectId(data.hallId);
  }

  if (data.price) {
    data.price = normalizePrice(data.price);
  }

  const movie = await Movie.findByIdAndUpdate(id, data, {
    new: true,
  }).lean();

  if (!movie) return null;

  return {
    ...movie,
    _id: String(movie._id),
    hallId: String(movie.hallId),
  };
}

async function deleteMovieById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  const result = await Movie.findByIdAndDelete(id).lean();
  if (!result) return null;
  return true;
}

module.exports = {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovieById,
  deleteMovieById,
};

