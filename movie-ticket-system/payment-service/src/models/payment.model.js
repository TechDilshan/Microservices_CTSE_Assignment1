const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  bookingId: { type: String, required: true },
  userId: { type: String, required: false },
  amount: { type: Number, required: true },
  method: { type: String, required: false },
  status: { type: String, required: false },
});

module.exports = mongoose.model("Payment", PaymentSchema);

