const mongoose = require("mongoose")

const BookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    hallId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hall",
        required: true
    },
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        required: true
    },
    showTime: { type: String, required: true },
    date: { type: Date, required: true },
    seats: [{ type: String }],
    status: {
        type: String,
        default: "pending"
    },
    paymentStatus: {
        type: String,
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Booking", BookingSchema)