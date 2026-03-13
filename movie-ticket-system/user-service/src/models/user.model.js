const mongoose = require("mongoose")

const ROLES = ["admin", "hall_owner", "customer"]

const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        unique: true,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    phone: {
        type: String
    },

    role: {
        type: String,
        enum: ROLES,
        default: "customer"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model("User", UserSchema)
module.exports.ROLES = ROLES