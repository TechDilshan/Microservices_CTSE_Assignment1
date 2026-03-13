const requireCustomer = (req, res, next) => {
    if (req.user.role && req.user.role !== "customer" && req.user.role !== "admin" && req.user.role !== "hall_owner") {
        return res.status(403).json({ message: "Customer access required" })
    }
    next()
}

const requireHallOwnerOrAdmin = (req, res, next) => {
    if (req.user.role === "admin" || req.user.role === "hall_owner") return next()
    return res.status(403).json({ message: "Hall owner or admin access required" })
}

module.exports = { requireCustomer, requireHallOwnerOrAdmin }
