const Review = require("../models/review.model")

// Create a new review for a movie by the logged-in user
const createReview = async (req, res) => {
    try {
        const { movieId, rating, comment } = req.body
        if (!movieId || !rating) {
            return res.status(400).json({ message: "movieId and rating are required" })
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" })
        }

        const review = await Review.create({
            movieId,
            rating,
            comment: comment || "",
            userId: req.user.id,
            userName: req.user.name || req.user.email || "Anonymous"
        })

        return res.status(201).json(review)
    } catch (error) {
        console.error("Create review failed", error)
        return res.status(500).json({ message: "Failed to create review" })
    }
}

// Get all reviews for a specific movie
const getReviewsForMovie = async (req, res) => {
    try {
        const { movieId } = req.params
        const reviews = await Review.find({ movieId }).sort({ createdAt: -1 })
        return res.json(reviews)
    } catch (error) {
        console.error("Get reviews failed", error)
        return res.status(500).json({ message: "Failed to fetch reviews" })
    }
}

// Summary for a specific movie
const getSummaryForMovie = async (req, res) => {
    try {
        const { movieId } = req.params
        const agg = await Review.aggregate([
            { $match: { movieId } },
            {
                $group: {
                    _id: "$movieId",
                    averageRating: { $avg: "$rating" },
                    count: { $sum: 1 }
                }
            }
        ])

        if (!agg.length) {
            return res.json({ movieId, averageRating: 0, count: 0 })
        }

        const doc = agg[0]
        return res.json({
            movieId,
            averageRating: Number(doc.averageRating.toFixed(2)),
            count: doc.count
        })
    } catch (error) {
        console.error("Get review summary failed", error)
        return res.status(500).json({ message: "Failed to fetch review summary" })
    }
}

// Summary for all movies (for Analytics Service)
const getSummaryForAllMovies = async (req, res) => {
    try {
        const agg = await Review.aggregate([
            {
                $group: {
                    _id: "$movieId",
                    movieId: { $first: "$movieId" },
                    averageRating: { $avg: "$rating" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { averageRating: -1, count: -1 } }
        ])

        const result = agg.map(doc => ({
            movieId: doc.movieId,
            averageRating: Number(doc.averageRating.toFixed(2)),
            count: doc.count
        }))

        return res.json(result)
    } catch (error) {
        console.error("Get all review summaries failed", error)
        return res.status(500).json({ message: "Failed to fetch summaries" })
    }
}

// Update own review
const updateReview = async (req, res) => {
    try {
        const { id } = req.params
        const { rating, comment } = req.body

        const review = await Review.findById(id)
        if (!review) {
            return res.status(404).json({ message: "Review not found" })
        }

        if (review.userId !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "You can only update your own reviews" })
        }

        if (rating !== undefined) {
            if (rating < 1 || rating > 5) {
                return res.status(400).json({ message: "Rating must be between 1 and 5" })
            }
            review.rating = rating
        }

        if (comment !== undefined) {
            review.comment = comment
        }

        await review.save()
        return res.json(review)
    } catch (error) {
        console.error("Update review failed", error)
        return res.status(500).json({ message: "Failed to update review" })
    }
}

// Delete own review
const deleteReview = async (req, res) => {
    try {
        const { id } = req.params
        const review = await Review.findById(id)
        if (!review) {
            return res.status(404).json({ message: "Review not found" })
        }

        if (review.userId !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "You can only delete your own reviews" })
        }

        await review.deleteOne()
        return res.json({ message: "Review deleted" })
    } catch (error) {
        console.error("Delete review failed", error)
        return res.status(500).json({ message: "Failed to delete review" })
    }
}

module.exports = {
    createReview,
    getReviewsForMovie,
    getSummaryForMovie,
    getSummaryForAllMovies,
    updateReview,
    deleteReview
}

