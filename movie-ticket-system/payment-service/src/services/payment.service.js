const Payment = require("../models/payment.model");

const createPayment = async (payload, userId) => {
  const data = { ...payload };
  // Spring behavior: always set SUCCESS on create
  data.status = "SUCCESS";
  if (userId && !data.userId) {
    data.userId = userId;
  }
  const payment = await Payment.create(data);
  return payment;
};

const getAllPayments = async () => {
  return Payment.find().lean();
};

const getPaymentById = async (id) => {
  return Payment.findById(id).lean();
};

const getPaymentsByBookingId = async (bookingId) => {
  return Payment.find({ bookingId }).lean();
};

const updateStatus = async (id, status) => {
  return Payment.findByIdAndUpdate(id, { status }, { new: true }).lean();
};

const deletePayment = async (id) => {
  await Payment.findByIdAndDelete(id);
};

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
  getPaymentsByBookingId,
  updateStatus,
  deletePayment,
};

