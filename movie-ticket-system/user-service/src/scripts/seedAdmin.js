require("dotenv").config()
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const User = require("../models/user.model")

const seedAdmin = async () => {
    await mongoose.connect(process.env.MONGO_URI)
    const exists = await User.findOne({ email: "admin@movieticket.com" })
    if (exists) {
        console.log("Admin already exists")
        process.exit(0)
    }
    const hashed = await bcrypt.hash("admin123", 10)
    await User.create({
        name: "Admin",
        email: "admin@movieticket.com",
        password: hashed,
        role: "admin"
    })
    console.log("Admin created: admin@movieticket.com / admin123")
    process.exit(0)
}

seedAdmin().catch((e) => {
    console.error(e)
    process.exit(1)
})
