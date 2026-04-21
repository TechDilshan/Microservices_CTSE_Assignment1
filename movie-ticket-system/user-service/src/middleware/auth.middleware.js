const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {

    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({ message: "Token missing" })
    }

    try {

        const token = authHeader.split(" ")[1]

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey_movie_ticket_system')

        req.user = decoded

        next()

    } catch (error) {

        return res.status(401).json({ message: "Invalid token" })

    }

}