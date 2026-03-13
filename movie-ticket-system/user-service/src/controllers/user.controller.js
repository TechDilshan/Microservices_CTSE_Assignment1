const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const User = require("../models/user.model")
const userService = require("../services/user.service")


//REGISTER USER (Customer self-registration)

exports.register = async (req, res) => {

    try {

        const { name, email, password, phone } = req.body

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            role: "customer"
        })

        await user.save()

        const userResponse = user.toObject()
        delete userResponse.password

        res.status(201).json({
            message: "User registered successfully",
            user: userResponse
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
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        const userResponse = user.toObject()
        delete userResponse.password

        res.json({
            message: "Login successful",
            token,
            user: userResponse
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



//GET ALL USERS (ADMIN - all users) or HALL OWNER - customers only

exports.getAllUsers = async (req, res) => {

    try {

        const filter = req.userRole === "hall_owner" ? { role: "customer" } : {}
        const users = await User.find(filter).select("-password")

        res.json(users)

    } catch (error) {

        res.status(500).json({ message: "Error fetching users" })

    }

}



//GET USER BY ID (Admin: any user; Hall Owner: customers only)

exports.getUserById = async (req, res) => {

    try {

        const user = await User.findById(req.params.id).select("-password")

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        if (req.userRole === "hall_owner" && user.role !== "customer") {
            return res.status(403).json({ message: "Hall owners can only view customer accounts" })
        }

        res.json(user)

    } catch (error) {

        res.status(500).json({ message: "Error fetching user" })

    }

}



//GET HALL OWNERS (ADMIN)
exports.getHallOwners = async (req, res) => {
    try {
        const users = await User.find({ role: "hall_owner" }).select("-password")
        res.json(users)
    } catch (error) {
        res.status(500).json({ message: "Error fetching hall owners" })
    }
}

//CREATE HALL OWNER (ADMIN)
exports.createHallOwner = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            role: "hall_owner"
        })
        await user.save()
        const userResponse = user.toObject()
        delete userResponse.password
        res.status(201).json({
            message: "Hall owner created successfully",
            user: userResponse
        })
    } catch (error) {
        res.status(500).json({ message: "Creation failed" })
    }
}

//UPDATE USER BY ID (Admin: any; Hall Owner: customers only)

exports.updateUserById = async (req, res) => {

    try {

        const targetUser = await User.findById(req.params.id)
        if (!targetUser) {
            return res.status(404).json({ message: "User not found" })
        }
        if (req.userRole === "hall_owner" && targetUser.role !== "customer") {
            return res.status(403).json({ message: "Hall owners can only update customer accounts" })
        }

        const updateData = { ...req.body }
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10)
        }
        delete updateData._id
        if (req.userRole !== "admin") {
            delete updateData.role
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
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



//DELETE USER BY ID (Admin: any; Hall Owner: customers only)

exports.deleteUserById = async (req, res) => {

    try {

        const targetUser = await User.findById(req.params.id)
        if (!targetUser) {
            return res.status(404).json({ message: "User not found" })
        }
        if (req.userRole === "hall_owner" && targetUser.role !== "customer") {
            return res.status(403).json({ message: "Hall owners can only delete customer accounts" })
        }

        await User.findByIdAndDelete(req.params.id)

        res.json({
            message: "User deleted"
        })

    } catch (error) {

        res.status(500).json({ message: "Delete failed" })

    }

}