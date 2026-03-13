const Hall = require("../models/hall.model")

const requireAdmin = async (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" })
    }
    next()
}

const requireHallOwnerOrAdmin = async (req, res, next) => {
    if (req.user.role === "admin") return next()
    if (req.user.role !== "hall_owner") {
        return res.status(403).json({ message: "Hall owner or admin access required" })
    }
    const hall = await Hall.findById(req.params.hallId || req.params.id)
    if (!hall) return res.status(404).json({ message: "Hall not found" })
    if (hall.hallOwnerId.toString() !== req.user.id) {
        return res.status(403).json({ message: "You can only manage your own halls" })
    }
    next()
}

module.exports = { requireAdmin, requireHallOwnerOrAdmin }
