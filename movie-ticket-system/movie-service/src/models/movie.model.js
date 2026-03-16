const mongoose = require("mongoose");

const PriceSchema = new mongoose.Schema(
  {
    ODC_Full: { type: Number, default: 0 },
    ODC_Half: { type: Number, default: 0 },
    Balcony: { type: Number, default: 0 },
    Box: { type: Number, default: 0 },
  },
  { _id: false }
);

const MovieSchema = new mongoose.Schema({
  hallId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hall",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  movieImageUrl: {
    type: String,
    default: "",
  },
  showTime: {
    type: [String],
    default: [],
  },
  price: {
    type: PriceSchema,
    default: () => ({}),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Movie", MovieSchema);

