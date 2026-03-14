const requireHallOwnerOrAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    if (req.user.role === "admin" || req.user.role === "hall_owner") {
        return next()
    }
    return res.status(403).json({ message: "Hall owner or admin access required" })
}

module.exports = { requireHallOwnerOrAdmin }

