const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const swaggerUi = require("swagger-ui-express")
const YAML = require("yamljs")

const analyticsRoutes = require("./routes/analytics.routes")

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

let swaggerDocument = null
try {
    swaggerDocument = YAML.load("./swagger/analytics-api.yaml")
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    app.get("/docs.json", (req, res) => res.json(swaggerDocument))
} catch (error) {
    console.warn("Analytics Service swagger not loaded:", error.message)
}

app.use("/api/analytics", analyticsRoutes)

const PORT = process.env.PORT || 3030
app.listen(PORT, () => {
    console.log(`Analytics Service running on ${PORT}`)
})

