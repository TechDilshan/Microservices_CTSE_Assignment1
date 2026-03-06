const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")

const swaggerUi = require("swagger-ui-express")
const YAML = require("yamljs")

const connectDB = require("./config/db")
const userRoutes = require("./routes/user.routes")

dotenv.config()

const app = express()

connectDB()

app.use(cors())
app.use(express.json())

// Load Swagger file
const swaggerDocument = YAML.load("./swagger/user-api.yaml")

// Swagger endpoint
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// API routes
app.use("/api/users", userRoutes)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`User Service running on ${PORT}`)
})