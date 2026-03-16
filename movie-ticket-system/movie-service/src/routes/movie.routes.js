const express = require("express");
const {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovieById,
  deleteMovieById,
} = require("../services/movie.service");
const { requireHallOwnerOrAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", requireHallOwnerOrAdmin, async (req, res) => {
  try {
    const movieId = await createMovie(req.body || {});
    return res.json({ movie_id: movieId });
  } catch (err) {
    console.error("Error creating movie:", err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { hallId } = req.query;
    const movies = await getAllMovies(hallId);
    return res.json(movies);
  } catch (err) {
    console.error("Error fetching movies:", err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const movie = await getMovieById(req.params.id);
    if (!movie) {
      return res.status(404).json({ detail: "Movie not found" });
    }
    return res.json(movie);
  } catch (err) {
    console.error("Error fetching movie:", err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

router.put("/:id", requireHallOwnerOrAdmin, async (req, res) => {
  try {
    const updated = await updateMovieById(req.params.id, req.body || {});
    if (!updated) {
      return res.status(404).json({ detail: "Movie not found" });
    }
    return res.json({ message: "Movie updated" });
  } catch (err) {
    console.error("Error updating movie:", err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

router.delete("/:id", requireHallOwnerOrAdmin, async (req, res) => {
  try {
    const deleted = await deleteMovieById(req.params.id);
    if (!deleted) {
      return res.status(404).json({ detail: "Movie not found" });
    }
    return res.json({ message: "Movie deleted" });
  } catch (err) {
    console.error("Error deleting movie:", err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

module.exports = router;

