const User = require("../models/user.model")

const requireRole = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id).select("role")
            if (!user) {
                return res.status(404).json({ message: "User not found" })
            }
            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({ message: "Access denied - insufficient permissions" })
            }
            req.userRole = user.role
            next()
        } catch (error) {
            return res.status(500).json({ message: "Authorization failed" })
        }
    }
}

module.exports = { requireRole }
