const Booking = require("../models/booking.model")
const hallClient = require("../integrations/hall.client")

exports.createBooking = async (data) => {
    const booking = new Booking(data)
    return await booking.save()
}

exports.getAllBookings = async (authHeader, user) => {
    let filter = {}
    if (user.role === "hall_owner" && authHeader) {
        const halls = await hallClient.getHallsForOwner(authHeader)
        const hallIds = (halls || []).map((h) => h._id || h.id)
        if (hallIds.length > 0) {
            filter = { hallId: { $in: hallIds } }
        } else {
            return []
        }
    }
    return await Booking.find(filter).sort({ createdAt: -1 })
}

exports.getBooking = async (id) => {
    return await Booking.findById(id)
}

exports.getUserBookings = async (userId) => {
    return await Booking.find({ userId }).sort({ createdAt: -1 })
}

exports.updateBooking = async (id, data) => {
    return await Booking.findByIdAndUpdate(id, data, { new: true })
}

exports.deleteBooking = async (id) => {
    return await Booking.findByIdAndDelete(id)
}

exports.getAvailableSeats = async (hallId, movieId, date, showTime) => {
    const { allSeats, layout } = await hallClient.getSeatBlock(hallId)

    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const bookedBookings = await Booking.find({
        hallId,
        movieId,
        showTime,
        date: { $gte: startOfDay, $lte: endOfDay },
        status: { $in: ["pending", "confirmed"] }
    })

    const bookedSeats = new Set()
    bookedBookings.forEach((b) => b.seats.forEach((s) => bookedSeats.add(s)))

    const availableSeats = allSeats.filter((s) => !bookedSeats.has(s))

    return {
        layout,
        allSeats,
        availableSeats: [...availableSeats],
        bookedSeats: [...bookedSeats]
    }
}

exports.validateSeatsAvailable = async (hallId, movieId, date, showTime, seats) => {
    const { availableSeats } = await exports.getAvailableSeats(hallId, movieId, date, showTime)
    const availableSet = new Set(availableSeats)
    const invalid = seats.filter((s) => !availableSet.has(s))
    return invalid.length === 0
}

exports.getHallIdsForOwner = async (authHeader) => {
    const halls = await hallClient.getHallsForOwner(authHeader)
    return (halls || []).map((h) => String(h._id || h.id || h))
}
