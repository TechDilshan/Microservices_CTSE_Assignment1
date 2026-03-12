const express = require("express")

const router = express.Router()

const controller = require("../controllers/booking.controller")
const auth = require("../middleware/auth.middleware")

router.post("/", auth, controller.createBooking)

router.get("/", controller.getBookings)

router.get("/user", auth, controller.getUserBookings)

router.get("/:id", controller.getBooking)

router.put("/:id", auth, controller.updateBooking)

router.delete("/:id", auth, controller.deleteBooking)

module.exports = router