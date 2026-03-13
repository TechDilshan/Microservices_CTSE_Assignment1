const express = require("express")
const router = express.Router()
const hallController = require("../controllers/hall.controller")
const seatBlockController = require("../controllers/seatBlock.controller")
const auth = require("../middleware/auth.middleware")
const optionalAuth = require("../middleware/optionalAuth.middleware")
const { requireAdmin, requireHallOwnerOrAdmin } = require("../middleware/role.middleware")

// Admin: CRUD Halls
router.post("/", auth, requireAdmin, hallController.createHall)
router.get("/", optionalAuth, hallController.getHalls)  // Public; filtered by role if logged in
router.get("/owner/:ownerId", auth, requireAdmin, hallController.getHallsByOwner)
router.get("/:hallId/seat-block", seatBlockController.getSeatBlock)  // Public for seat display
router.get("/:hallId/seat-layout", seatBlockController.getSeatLayout)  // Public
router.put("/:hallId/seat-block", auth, requireHallOwnerOrAdmin, seatBlockController.createOrUpdateSeatBlock)
router.get("/:id", hallController.getHallById)
router.put("/:id", auth, requireHallOwnerOrAdmin, hallController.updateHall)
router.delete("/:id", auth, requireHallOwnerOrAdmin, hallController.deleteHall)

module.exports = router
