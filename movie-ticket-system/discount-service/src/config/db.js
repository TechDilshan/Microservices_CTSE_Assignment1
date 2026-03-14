const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI
        if (!uri) {
            throw new Error("MONGO_URI not set for Discount Service")
        }
        await mongoose.connect(uri)
        console.log("Discount Service connected to MongoDB")
    } catch (error) {
        console.error("Discount Service DB connection failed:", error.message)
        process.exit(1)
    }
}

module.exports = connectDB

