const Booking = require("../models/booking.model")

exports.createBooking = async (data) => {

    const booking = new Booking(data)

    return await booking.save()

}

exports.getAllBookings = async () => {

    return await Booking.find()

}

exports.getBooking = async (id) => {

    return await Booking.findById(id)

}

exports.getUserBookings = async (userId) => {

    return await Booking.find({ user_id: userId })

}

exports.updateBooking = async (id, data) => {

    return await Booking.findByIdAndUpdate(id, data, { new: true })

}

exports.deleteBooking = async (id) => {

    return await Booking.findByIdAndDelete(id)

}