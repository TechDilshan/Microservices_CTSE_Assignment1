const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const swaggerUi = require("swagger-ui-express")
const YAML = require("yamljs")

const connectDB = require("./config/db")
const reviewRoutes = require("./routes/review.routes")

dotenv.config()

const app = express()

connectDB()

app.use(cors())
app.use(express.json())

let swaggerDocument = null
try {
    swaggerDocument = YAML.load("./swagger/review-api.yaml")
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    app.get("/docs.json", (req, res) => res.json(swaggerDocument))
} catch (error) {
    console.warn("Review Service swagger not loaded:", error.message)
}

app.use("/api/reviews", reviewRoutes)

const PORT = process.env.PORT || 3010
app.listen(PORT, () => {
    console.log(`Review Service running on ${PORT}`)
})

