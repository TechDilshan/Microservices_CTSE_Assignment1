require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

const USERS = [
  {
    _id: new mongoose.Types.ObjectId("66f000000000000000000001"),
    name: "Movie Hub Admin",
    email: "admin@gmail.com",
    password: "Admin123@@",
    role: "admin",
  },
  {
    _id: new mongoose.Types.ObjectId("66f000000000000000000002"),
    name: "Main Hall Owner",
    email: "hall@gmail.com",
    password: "Hall123@@",
    role: "hall_owner",
  },
  {
    _id: new mongoose.Types.ObjectId("66f000000000000000000003"),
    name: "Customer",
    email: "customer@gmail.com",
    password: "Customer123@@",
    role: "customer",
  },
];

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to User DB");

    for (const u of USERS) {
      let existing = await User.findOne({ email: u.email });
      if (existing) {
        console.log(`User already exists: ${u.email} (id=${existing._id})`);
        continue;
      }
      const hashed = await bcrypt.hash(u.password, 10);
      const created = await User.create({
        _id: u._id,
        name: u.name,
        email: u.email,
        password: hashed,
        role: u.role,
      });
      console.log(`Created ${u.role}: ${u.email} (id=${created._id})`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
};

run();
