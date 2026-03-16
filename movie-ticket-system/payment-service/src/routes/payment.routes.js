const express = require("express");
const { requireAuth } = require("../middleware/jwt.middleware");
const controller = require("../controllers/payment.controller");

const router = express.Router();

// Match Spring Boot endpoints exactly under /api/payments
router.post("/", requireAuth, controller.create);
router.get("/", requireAuth, controller.list);
router.get("/booking/:bookingId", requireAuth, controller.listByBooking);
router.get("/:id", requireAuth, controller.getById);
router.put("/:id/status", requireAuth, controller.updatePaymentStatus);
router.delete("/:id", requireAuth, controller.remove);

module.exports = router;

