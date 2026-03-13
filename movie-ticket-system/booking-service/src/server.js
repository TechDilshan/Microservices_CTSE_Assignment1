const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")

const swaggerUi = require("swagger-ui-express")
const YAML = require("yamljs")

const connectDB = require("./config/db")
const bookingRoutes = require("./routes/booking.routes")

dotenv.config()

const app = express()

connectDB()

app.use(cors())
app.use(express.json())

const swaggerDocument = YAML.load("./swagger/booking-api.yaml")

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.get("/docs.json", (req, res) => res.json(swaggerDocument))

app.use("/api/bookings", bookingRoutes)

const PORT = process.env.PORT || 3003

app.listen(PORT, () => {
    console.log(`Booking Service running on ${PORT}`)
})