const mongoose = require("mongoose")

const connectDB = async () => {

    try {

        await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://movie_ticket_user:MovieTicketUser@movieticketuser.c06ei7z.mongodb.net/?appName=MovieTicketUser")

        console.log("MongoDB connected")

    } catch (error) {

        console.error("DB connection error")

        process.exit(1)

    }

}

module.exports = connectDB