const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const swaggerUi = require("swagger-ui-express")
const YAML = require("yamljs")

const connectDB = require("./config/db")
const hallRoutes = require("./routes/hall.routes")

dotenv.config()

const app = express()
connectDB()

app.use(cors())
app.use(express.json())

app.get("/api/health", (req, res) => {
    res.json({ status: "OK Hall" });
});

const swaggerDocument = YAML.load("./swagger/hall-api.yaml")
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.get("/docs.json", (req, res) => res.json(swaggerDocument))

app.use("/api/halls", hallRoutes)

const PORT = process.env.PORT || 3005
app.listen(PORT, () => {
    console.log(`Hall Service running on ${PORT}`)
})
