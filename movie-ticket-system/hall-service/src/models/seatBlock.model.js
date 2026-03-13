const mongoose = require("mongoose")

const SeatBlockSchema = new mongoose.Schema({
    hallId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hall",
        required: true
    },
    numSeats: {
        ODC: { type: Number, default: 30 },
        Balcony: { type: Number, default: 4 },
        Box: { type: Number, default: 5 }
    },
    odc: {
        rows: { type: Number, required: true },
        columns: { type: Number, required: true }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("SeatBlock", SeatBlockSchema)
