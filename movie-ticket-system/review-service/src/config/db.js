const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI
        if (!uri) {
            throw new Error("MONGO_URI not set for Review Service")
        }
        await mongoose.connect(uri)
        console.log("Review Service connected to MongoDB")
    } catch (error) {
        console.error("Review Service DB connection failed:", error.message)
        process.exit(1)
    }
}

module.exports = connectDB

