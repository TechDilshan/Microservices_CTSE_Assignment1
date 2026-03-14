const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth.middleware")
const controller = require("../controllers/review.controller")

// Public: list reviews for a movie
router.get("/movie/:movieId", controller.getReviewsForMovie)

// Public: summary for a single movie
router.get("/movie/:movieId/summary", controller.getSummaryForMovie)

// Public: summary for all movies (for Analytics Service)
router.get("/summary/all", controller.getSummaryForAllMovies)

// Authenticated: create/update/delete own reviews
router.post("/", auth, controller.createReview)
router.put("/:id", auth, controller.updateReview)
router.delete("/:id", auth, controller.deleteReview)

module.exports = router

