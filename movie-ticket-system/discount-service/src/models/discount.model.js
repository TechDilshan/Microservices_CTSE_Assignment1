const mongoose = require("mongoose")

const discountSchema = new mongoose.Schema(
    {
        hallId: {
            type: String,
            required: true
        },
        movieId: {
            type: String,
            default: null
        },
        type: {
            type: String,
            enum: ["DATE", "SEAT_COUNT"],
            required: true
        },
        // For DATE type
        date: {
            type: Date
        },
        // For SEAT_COUNT type
        minSeats: {
            type: Number
        },
        percentage: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        description: {
            type: String,
            default: ""
        },
        createdBy: {
            type: String,
            required: true
        },
        active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
)

discountSchema.index({ hallId: 1, movieId: 1, type: 1 })

module.exports = mongoose.model("Discount", discountSchema)

