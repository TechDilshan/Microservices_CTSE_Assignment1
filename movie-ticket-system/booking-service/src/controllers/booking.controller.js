const bookingService = require("../services/booking.service")

exports.createBooking = async (req, res) => {

    try {

        const booking = await bookingService.createBooking({
            ...req.body,
            user_id: req.user.id
        })

        res.status(201).json(booking)

    } catch (error) {

        res.status(500).json({ message: "Booking failed" })

    }

}

exports.getBookings = async (req, res) => {

    const bookings = await bookingService.getAllBookings()

    res.json(bookings)

}

exports.getBooking = async (req, res) => {

    const booking = await bookingService.getBooking(req.params.id)

    res.json(booking)

}

exports.getUserBookings = async (req, res) => {

    const bookings = await bookingService.getUserBookings(req.user.id)

    res.json(bookings)

}

exports.updateBooking = async (req, res) => {

    const booking = await bookingService.updateBooking(
        req.params.id,
        req.body
    )

    res.json(booking)

}

exports.deleteBooking = async (req, res) => {

    await bookingService.deleteBooking(req.params.id)

    res.json({ message: "Booking deleted" })

}