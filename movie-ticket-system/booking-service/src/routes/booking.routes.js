const express = require("express")
const router = express.Router()
const controller = require("../controllers/booking.controller")
const auth = require("../middleware/auth.middleware")
const { requireHallOwnerOrAdmin } = require("../middleware/role.middleware")

router.post("/", auth, controller.createBooking)
router.get("/available-seats", controller.getAvailableSeats)
router.get("/user", auth, controller.getUserBookings)
router.get("/payments", auth, requireHallOwnerOrAdmin, controller.getPaymentsForMyBookings)
router.put("/payments/:paymentId/status", auth, requireHallOwnerOrAdmin, controller.updatePaymentStatus)
router.delete("/payments/:paymentId", auth, requireHallOwnerOrAdmin, controller.deletePayment)
router.post("/:id/pay", auth, controller.payForBooking)
router.get("/", auth, requireHallOwnerOrAdmin, controller.getBookings)
router.get("/:id", auth, controller.getBooking)
router.put("/:id", auth, requireHallOwnerOrAdmin, controller.updateBooking)
router.delete("/:id", auth, requireHallOwnerOrAdmin, controller.deleteBooking)

module.exports = router