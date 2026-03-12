const mongoose = require("mongoose")

const BookingSchema = new mongoose.Schema({

    user_id: String,

    movie_id: String,

    show_id: String,

    seats: [String],

    status: {
        type: String,
        default: "pending"
    },

    payment_status: {
        type: String,
        default: "pending"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model("Booking", BookingSchema)