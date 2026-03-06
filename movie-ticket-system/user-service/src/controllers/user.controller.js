const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const User = require("../models/user.model")
const userService = require("../services/user.service")


//REGISTER USER

exports.register = async (req, res) => {

    try {

        const { name, email, password } = req.body

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new User({
            name,
            email,
            password: hashedPassword
        })

        await user.save()

        res.status(201).json({
            message: "User registered successfully",
            user
        })

    } catch (error) {

        res.status(500).json({ message: "Registration failed" })

    }

}



//LOGIN USER

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

        res.json({
            message: "Login successful",
            token
        })

    } catch (error) {

        res.status(500).json({ message: "Login failed" })

    }

}


//GET LOGGED USER PROFILE

exports.getProfile = async (req, res) => {

    try {

        const user = await userService.getUserById(req.user.id)

        res.json(user)

    } catch (error) {

        res.status(500).json({ message: "Error fetching profile" })

    }

}



//UPDATE PROFILE

exports.updateProfile = async (req, res) => {

    try {

        const updatedUser = await userService.updateUser(
            req.user.id,
            req.body
        )

        res.json({
            message: "Profile updated",
            user: updatedUser
        })

    } catch (error) {

        res.status(500).json({ message: "Update failed" })

    }

}



//DELETE PROFILE

exports.deleteProfile = async (req, res) => {

    try {

        await userService.deleteUser(req.user.id)

        res.json({
            message: "User deleted successfully"
        })

    } catch (error) {

        res.status(500).json({ message: "Delete failed" })

    }

}



//GET ALL USERS (ADMIN)

exports.getAllUsers = async (req, res) => {

    try {

        const users = await User.find().select("-password")

        res.json(users)

    } catch (error) {

        res.status(500).json({ message: "Error fetching users" })

    }

}



//GET USER BY ID

exports.getUserById = async (req, res) => {

    try {

        const user = await User.findById(req.params.id).select("-password")

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        res.json(user)

    } catch (error) {

        res.status(500).json({ message: "Error fetching user" })

    }

}



//UPDATE USER BY ID (ADMIN)

exports.updateUserById = async (req, res) => {

    try {

        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).select("-password")

        res.json({
            message: "User updated",
            user
        })

    } catch (error) {

        res.status(500).json({ message: "Update failed" })

    }

}



//DELETE USER BY ID (ADMIN)

exports.deleteUserById = async (req, res) => {

    try {

        await User.findByIdAndDelete(req.params.id)

        res.json({
            message: "User deleted"
        })

    } catch (error) {

        res.status(500).json({ message: "Delete failed" })

    }

}