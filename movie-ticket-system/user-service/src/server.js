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

app.get("/api/health", (req, res) => {
    res.json({ status: "OK User" });
});
// Load Swagger file
const swaggerDocument = YAML.load("./swagger/user-api.yaml")

// Swagger endpoint
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.get("/docs.json", (req, res) => res.json(swaggerDocument))

// API routes
app.use("/api/users", userRoutes)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`User Service running on ${PORT}`)
})