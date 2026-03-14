const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth.middleware")
const { requireHallOwnerOrAdmin } = require("../middleware/role.middleware")
const controller = require("../controllers/discount.controller")

// Hall owner / admin management
router.post("/", auth, requireHallOwnerOrAdmin, controller.createDiscount)
router.get("/mine", auth, requireHallOwnerOrAdmin, controller.getMyDiscounts)
router.put("/:id", auth, requireHallOwnerOrAdmin, controller.updateDiscount)
router.delete("/:id", auth, requireHallOwnerOrAdmin, controller.deleteDiscount)

// Public endpoints
router.get("/applicable", controller.getApplicableForMovie)
router.post("/calculate", controller.calculateDiscount)

module.exports = router

