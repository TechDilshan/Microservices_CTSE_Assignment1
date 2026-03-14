const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth.middleware")
const { requireRole } = require("../middleware/role.middleware")
const controller = require("../controllers/analytics.controller")

// Public movie rankings
router.get("/movies/rankings", controller.getMovieRankings)

// Hall owner analytics
router.get(
    "/hall-owner/overview",
    auth,
    requireRole("hall_owner"),
    controller.getHallOwnerOverview
)

// Admin analytics
router.get(
    "/admin/overview",
    auth,
    requireRole("admin"),
    controller.getAdminOverview
)

module.exports = router

