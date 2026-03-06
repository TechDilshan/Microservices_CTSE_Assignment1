const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const User = require("../models/user.model")
const userService = require("../services/user.service")


exports.register = async (req, res) => {

    try {

        const { name, email, password } = req.body

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new User({
            name,
            email,
            password: hashedPassword
        })

        await user.save()

        res.status(201).json(user)

    } catch (error) {

        res.status(500).json({ message: "Registration failed" })

    }

}


exports.login = async (req, res) => {

    try {

        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" })
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        res.json({ token })

    } catch (error) {

        res.status(500).json({ message: "Login failed" })

    }

}


exports.getUser = async (req, res) => {

    try {

        const user = await userService.getUserById(req.user.id)

        res.json(user)

    } catch (error) {

        res.status(500).json({ message: "Error fetching user" })

    }

}


exports.updateProfile = async (req, res) => {

    try {

        const updatedUser = await userService.updateUser(
            req.user.id,
            req.body
        )

        res.json(updatedUser)

    } catch (error) {

        res.status(500).json({ message: "Update failed" })

    }

}


exports.deleteUser = async (req, res) => {

    try {

        await userService.deleteUser(req.user.id)

        res.json({ message: "User deleted successfully" })

    } catch (error) {

        res.status(500).json({ message: "Delete failed" })

    }

}