const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const swaggerUi = require("swagger-ui-express")
const YAML = require("yamljs")

const connectDB = require("./config/db")
const discountRoutes = require("./routes/discount.routes")

dotenv.config()

const app = express()

connectDB()

app.use(cors())
app.use(express.json())

let swaggerDocument = null
try {
    swaggerDocument = YAML.load("./swagger/discount-api.yaml")
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    app.get("/docs.json", (req, res) => res.json(swaggerDocument))
} catch (error) {
    console.warn("Discount Service swagger not loaded:", error.message)
}

app.use("/api/discounts", discountRoutes)

const PORT = process.env.PORT || 3020
app.listen(PORT, () => {
    console.log(`Discount Service running on ${PORT}`)
})

