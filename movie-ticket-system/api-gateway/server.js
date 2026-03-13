const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const morgan = require("morgan")

dotenv.config()

const userProxy = require("./routes/user.proxy")
const movieProxy = require("./routes/movie.proxy")
const bookingProxy = require("./routes/booking.proxy")
const paymentProxy = require("./routes/payment.proxy")

const swaggerUi = require("swagger-ui-express")
const { services, swaggerOptions, fetchSwaggerDoc } = require("./swagger/aggregateSwagger")

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

app.use("/docs", swaggerUi.serve, swaggerUi.setup(null, swaggerOptions))

services.forEach(service => {
    app.get(service.path, async (req, res) => {
        const doc = await fetchSwaggerDoc(service.url)
        res.json(doc)
    })
})

app.use(userProxy)
app.use(movieProxy)
app.use(bookingProxy)
app.use(paymentProxy)

app.get("/", (req, res) => {
    res.json({ message: "Movie Ticket API Gateway running" })
})

const PORT = process.env.PORT || 5001

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`)
})