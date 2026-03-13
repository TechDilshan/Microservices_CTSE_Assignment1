const bookingService = require("../services/booking.service")
const paymentClient = require("../integrations/payment.client")

exports.createBooking = async (req, res) => {
    try {
        const { hallId, movieId, showTime, date, seats } = req.body
        const userId = req.user.id

        if (!hallId || !movieId || !showTime || !date || !seats || !seats.length) {
            return res.status(400).json({ message: "Missing required fields: hallId, movieId, showTime, date, seats" })
        }

        const bookingDate = new Date(date)
        const isValid = await bookingService.validateSeatsAvailable(hallId, movieId, bookingDate, showTime, seats)
        if (!isValid) {
            return res.status(400).json({ message: "One or more seats are not available" })
        }

        const booking = await bookingService.createBooking({
            userId,
            hallId,
            movieId,
            showTime,
            date: bookingDate,
            seats
        })

        res.status(201).json(booking)
    } catch (error) {
        res.status(500).json({ message: "Booking failed" })
    }
}

exports.getBookings = async (req, res) => {
    try {
        const authHeader = req.headers.authorization
        const bookings = await bookingService.getAllBookings(authHeader, req.user)
        res.json(bookings)
    } catch (error) {
        res.status(500).json({ message: "Error fetching bookings" })
    }
}

exports.getBooking = async (req, res) => {
    try {
        const booking = await bookingService.getBooking(req.params.id)
        if (!booking) return res.status(404).json({ message: "Booking not found" })
        const isOwner = req.user && String(booking.userId) === String(req.user.id)
        if (isOwner || (req.user && req.user.role === "admin")) {
            return res.json(booking)
        }
        if (req.user && req.user.role === "hall_owner") {
            const hallIds = await bookingService.getHallIdsForOwner(req.headers.authorization)
            if (hallIds.includes(String(booking.hallId))) return res.json(booking)
        }
        return res.status(403).json({ message: "Access denied" })
    } catch (error) {
        res.status(500).json({ message: "Error fetching booking" })
    }
}

exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await bookingService.getUserBookings(req.user.id)
        res.json(bookings)
    } catch (error) {
        res.status(500).json({ message: "Error fetching bookings" })
    }
}

exports.getAvailableSeats = async (req, res) => {
    try {
        const { hallId, movieId, date, showTime } = req.query
        if (!hallId || !movieId || !date || !showTime) {
            return res.status(400).json({ message: "Missing: hallId, movieId, date, showTime" })
        }
        const result = await bookingService.getAvailableSeats(hallId, movieId, new Date(date), showTime)
        res.json(result)
    } catch (error) {
        res.status(500).json({ message: "Error fetching available seats" })
    }
}

exports.updateBooking = async (req, res) => {
    try {
        const booking = await bookingService.updateBooking(req.params.id, req.body)
        if (!booking) return res.status(404).json({ message: "Booking not found" })
        res.json(booking)
    } catch (error) {
        res.status(500).json({ message: "Update failed" })
    }
}

exports.deleteBooking = async (req, res) => {
    try {
        await bookingService.deleteBooking(req.params.id)
        res.json({ message: "Booking deleted" })
    } catch (error) {
        res.status(500).json({ message: "Delete failed" })
    }
}

exports.payForBooking = async (req, res) => {
    try {
        const { amount, method = "card" } = req.body
        const { id } = req.params
        const userId = req.user.id

        const booking = await bookingService.getBooking(id)
        if (!booking) return res.status(404).json({ message: "Booking not found" })
        if (String(booking.userId) !== String(userId)) {
            return res.status(403).json({ message: "You can only pay for your own booking" })
        }
        if (booking.paymentStatus === "paid" || booking.paymentStatus === "SUCCESS") {
            return res.status(400).json({ message: "Booking already paid" })
        }

        const payment = await paymentClient.createPayment(
            id,
            userId,
            amount || 0,
            method,
            req.headers.authorization
        )
        await bookingService.updateBooking(id, { paymentStatus: "paid", status: "confirmed" })
        res.json({ message: "Payment successful", payment, booking: await bookingService.getBooking(id) })
    } catch (error) {
        res.status(500).json({ message: "Payment failed" })
    }
}

exports.getPaymentsForMyBookings = async (req, res) => {
    try {
        const authHeader = req.headers.authorization
        const bookings = await bookingService.getAllBookings(authHeader, req.user)
        const payments = []
        for (const b of bookings) {
            try {
                const list = await paymentClient.getPaymentsByBooking(b._id.toString(), authHeader)
                payments.push(...(list || []).map((p) => ({ ...p, bookingId: b._id })))
            } catch (e) {
                // skip if payment service fails for one booking
            }
        }
        res.json(payments)
    } catch (error) {
        res.status(500).json({ message: "Error fetching payments" })
    }
}

exports.updatePaymentStatus = async (req, res) => {
    try {
        const { paymentId } = req.params
        const { status } = req.body
        if (!status) return res.status(400).json({ message: "status is required" })
        const authHeader = req.headers.authorization
        const payment = await paymentClient.getPayment(paymentId, authHeader)
        if (!payment) return res.status(404).json({ message: "Payment not found" })
        const hallIds = await bookingService.getHallIdsForOwner(authHeader)
        const inMyHall = hallIds.includes(String(payment.bookingId))
        if (!inMyHall && req.user.role !== "admin") {
            return res.status(403).json({ message: "You can only update payments for your hall bookings" })
        }
        const updated = await paymentClient.updatePaymentStatus(paymentId, status, authHeader)
        res.json(updated)
    } catch (error) {
        res.status(500).json({ message: "Update failed" })
    }
}

exports.deletePayment = async (req, res) => {
    try {
        const { paymentId } = req.params
        const authHeader = req.headers.authorization
        const payment = await paymentClient.getPayment(paymentId, authHeader)
        if (!payment) return res.status(404).json({ message: "Payment not found" })
        const hallIds = await bookingService.getHallIdsForOwner(authHeader)
        const inMyHall = hallIds.includes(String(payment.bookingId))
        if (!inMyHall && req.user.role !== "admin") {
            return res.status(403).json({ message: "You can only delete payments for your hall bookings" })
        }
        await paymentClient.deletePayment(paymentId, authHeader)
        res.json({ message: "Payment deleted" })
    } catch (error) {
        res.status(500).json({ message: "Delete failed" })
    }
}
