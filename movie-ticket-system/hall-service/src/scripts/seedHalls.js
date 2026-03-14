require("dotenv").config();
const mongoose = require("mongoose");
const Hall = require("../models/hall.model");
const SeatBlock = require("../models/seatBlock.model");

const HALL_OWNER_ID = new mongoose.Types.ObjectId("66f000000000000000000002");
const HALL_ID = new mongoose.Types.ObjectId("66f000000000000000000010");

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Hall DB");

    let hall = await Hall.findOne({ _id: HALL_ID });
    if (!hall) {
      hall = await Hall.create({
        _id: HALL_ID,
        hallOwnerId: HALL_OWNER_ID,
        name: "Grand Cinema Hall",
        location: "Colombo City Center",
        hallImageUrl: "https://via.placeholder.com/600x800?text=Grand+Cinema+Hall",
      });
      console.log("Created hall:", hall._id.toString());
    } else {
      console.log("Hall already exists:", hall._id.toString());
    }

    let seatBlock = await SeatBlock.findOne({ hallId: HALL_ID });
    if (!seatBlock) {
      seatBlock = await SeatBlock.create({
        hallId: HALL_ID,
        numSeats: { ODC: 40, Balcony: 12, Box: 8 },
        odc: { rows: 10, columns: 4 },
      });
      console.log("Created seat block:", seatBlock._id.toString());
    } else {
      console.log("Seat block already exists:", seatBlock._id.toString());
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
};

run();
