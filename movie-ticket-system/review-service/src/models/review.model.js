const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema(
    {
        movieId: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        },
        userName: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
)

reviewSchema.index({ movieId: 1, userId: 1 })

module.exports = mongoose.model("Review", reviewSchema)

