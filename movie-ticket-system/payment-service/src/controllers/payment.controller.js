const {
  createPayment,
  getAllPayments,
  getPaymentById,
  getPaymentsByBookingId,
  updateStatus,
  deletePayment,
} = require("../services/payment.service");

const create = async (req, res) => {
  const payment = await createPayment(req.body || {}, req.userId);
  res.json(payment);
};

const list = async (req, res) => {
  const payments = await getAllPayments();
  res.json(payments);
};

const getById = async (req, res) => {
  const payment = await getPaymentById(req.params.id);
  res.json(payment || null);
};

const listByBooking = async (req, res) => {
  const payments = await getPaymentsByBookingId(req.params.bookingId);
  res.json(payments);
};

const updatePaymentStatus = async (req, res) => {
  const { status } = req.query;
  const payment = await updateStatus(req.params.id, status);
  res.json(payment || null);
};

const remove = async (req, res) => {
  await deletePayment(req.params.id);
  res.sendStatus(200);
};

module.exports = {
  create,
  list,
  getById,
  listByBooking,
  updatePaymentStatus,
  remove,
};

