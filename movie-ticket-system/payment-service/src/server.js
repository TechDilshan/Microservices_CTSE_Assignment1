const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

const connectDB = require("./config/db");
const paymentRoutes = require("./routes/payment.routes");

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "OK Payment" });
});

const swaggerDocument = YAML.load(path.join(__dirname, "swagger/payment-api.yaml"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/docs.json", (req, res) => res.json(swaggerDocument));

app.use("/api/payments", paymentRoutes);

app.get("/health", (req, res) => res.json({ status: "ok", service: "payment-service" }));

const PORT = process.env.SERVER_PORT || process.env.PORT || 3004;

app.listen(PORT, () => {
  console.log(`Payment Service running on ${PORT}`);
});

