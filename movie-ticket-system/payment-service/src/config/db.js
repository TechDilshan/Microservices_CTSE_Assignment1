const mongoose = require("mongoose");

const connectDB = async () => {
  const uri =
    process.env.MONGO_URI ||
    process.env.SPRING_DATA_MONGODB_URI ||
    process.env.SPRING_DATA_MONGODB_URL;

  if (!uri) {
    throw new Error(
      "Missing Mongo URI. Set MONGO_URI (preferred) or SPRING_DATA_MONGODB_URI."
    );
  }

  try {
    await mongoose.connect(uri);
    console.log("Payment Service MongoDB connected");
  } catch (error) {
    console.error("DB connection error");
    process.exit(1);
  }
};

module.exports = connectDB;

