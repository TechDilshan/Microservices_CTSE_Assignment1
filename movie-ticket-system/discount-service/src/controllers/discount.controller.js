const Discount = require("../models/discount.model")

const normalizeDateOnly = (d) => {
    if (!d) return null
    const dd = new Date(d)
    dd.setHours(0, 0, 0, 0)
    return dd
}

// Create discount (hall owner or admin)
const createDiscount = async (req, res) => {
    try {
        const { hallId, movieId, type, date, minSeats, percentage, description } = req.body

        if (!hallId || !type || percentage === undefined) {
            return res.status(400).json({ message: "hallId, type and percentage are required" })
        }

        if (!["DATE", "SEAT_COUNT"].includes(type)) {
            return res.status(400).json({ message: "type must be DATE or SEAT_COUNT" })
        }

        if (percentage < 0 || percentage > 100) {
            return res.status(400).json({ message: "percentage must be between 0 and 100" })
        }

        if (type === "DATE" && !date) {
            return res.status(400).json({ message: "date is required for DATE discounts" })
        }

        if (type === "SEAT_COUNT" && (!minSeats || minSeats <= 0)) {
            return res.status(400).json({ message: "minSeats must be > 0 for SEAT_COUNT discounts" })
        }

        const doc = await Discount.create({
            hallId,
            movieId: movieId || null,
            type,
            date: type === "DATE" ? normalizeDateOnly(date) : undefined,
            minSeats: type === "SEAT_COUNT" ? minSeats : undefined,
            percentage,
            description: description || "",
            createdBy: req.user.id,
            active: true
        })

        return res.status(201).json(doc)
    } catch (error) {
        console.error("Create discount failed", error)
        return res.status(500).json({ message: "Failed to create discount" })
    }
}

// List discounts for current hall owner (or all for admin)
const getMyDiscounts = async (req, res) => {
    try {
        const query = {}
        if (req.user.role === "hall_owner") {
            query.createdBy = req.user.id
        }
        const discounts = await Discount.find(query).sort({ createdAt: -1 })
        return res.json(discounts)
    } catch (error) {
        console.error("Get discounts failed", error)
        return res.status(500).json({ message: "Failed to fetch discounts" })
    }
}

const updateDiscount = async (req, res) => {
    try {
        const { id } = req.params
        const discount = await Discount.findById(id)
        if (!discount) {
            return res.status(404).json({ message: "Discount not found" })
        }

        if (discount.createdBy !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "You can only update your own discounts" })
        }

        const { hallId, movieId, type, date, minSeats, percentage, description, active } = req.body

        if (type && !["DATE", "SEAT_COUNT"].includes(type)) {
            return res.status(400).json({ message: "type must be DATE or SEAT_COUNT" })
        }

        if (percentage !== undefined && (percentage < 0 || percentage > 100)) {
            return res.status(400).json({ message: "percentage must be between 0 and 100" })
        }

        if (hallId !== undefined) discount.hallId = hallId
        if (movieId !== undefined) discount.movieId = movieId || null
        if (type !== undefined) discount.type = type
        if (date !== undefined) discount.date = type === "DATE" ? normalizeDateOnly(date) : undefined
        if (minSeats !== undefined) discount.minSeats = type === "SEAT_COUNT" ? minSeats : undefined
        if (percentage !== undefined) discount.percentage = percentage
        if (description !== undefined) discount.description = description
        if (active !== undefined) discount.active = active

        await discount.save()
        return res.json(discount)
    } catch (error) {
        console.error("Update discount failed", error)
        return res.status(500).json({ message: "Failed to update discount" })
    }
}

const deleteDiscount = async (req, res) => {
    try {
        const { id } = req.params
        const discount = await Discount.findById(id)
        if (!discount) {
            return res.status(404).json({ message: "Discount not found" })
        }

        if (discount.createdBy !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "You can only delete your own discounts" })
        }

        await discount.deleteOne()
        return res.json({ message: "Discount deleted" })
    } catch (error) {
        console.error("Delete discount failed", error)
        return res.status(500).json({ message: "Failed to delete discount" })
    }
}

// Public endpoint to get applicable discounts for a movie (for display)
const getApplicableForMovie = async (req, res) => {
    try {
        const { hallId, movieId, date, seats } = req.query
        if (!hallId) {
            return res.status(400).json({ message: "hallId is required" })
        }

        const query = {
            hallId,
            active: true
        }
        if (movieId) {
            query.$or = [{ movieId }, { movieId: null }]
        }

        const all = await Discount.find(query)
        const dateObj = date ? normalizeDateOnly(date) : null
        const seatsCount = seats ? Number(seats) : undefined

        const applicable = all.filter((d) => {
            if (!d.active) return false
            if (d.type === "DATE") {
                if (!dateObj || !d.date) return false
                const dDate = normalizeDateOnly(d.date)
                return dDate.getTime() === dateObj.getTime()
            }
            if (d.type === "SEAT_COUNT") {
                if (!seatsCount || !d.minSeats) return false
                return seatsCount >= d.minSeats
            }
            return false
        })

        return res.json(applicable)
    } catch (error) {
        console.error("Get applicable discounts failed", error)
        return res.status(500).json({ message: "Failed to fetch discounts" })
    }
}

// Core calculation endpoint
const calculateDiscount = async (req, res) => {
    try {
        const { hallId, movieId, date, seats, baseAmount } = req.body
        if (!hallId || !date || !Array.isArray(seats) || seats.length === 0) {
            return res.status(400).json({ message: "hallId, date and seats[] are required" })
        }

        const amount = Number(baseAmount || 0)
        if (!amount || amount <= 0) {
            return res.json({
                baseAmount: amount,
                discountPercentage: 0,
                discountAmount: 0,
                finalAmount: amount,
                applied: []
            })
        }

        const query = {
            hallId,
            active: true
        }
        if (movieId) {
            query.$or = [{ movieId }, { movieId: null }]
        }

        const all = await Discount.find(query)
        const dateObj = normalizeDateOnly(date)
        const seatsCount = seats.length

        const applicable = []

        for (const d of all) {
            if (!d.active) continue
            if (d.type === "DATE") {
                if (!d.date) continue
                const dDate = normalizeDateOnly(d.date)
                if (dateObj && dDate.getTime() === dateObj.getTime()) {
                    applicable.push(d)
                }
            } else if (d.type === "SEAT_COUNT") {
                if (!d.minSeats) continue
                if (seatsCount >= d.minSeats) {
                    applicable.push(d)
                }
            }
        }

        if (!applicable.length) {
            return res.json({
                baseAmount: amount,
                discountPercentage: 0,
                discountAmount: 0,
                finalAmount: amount,
                applied: []
            })
        }

        // choose the single best discount (highest percentage)
        let best = applicable[0]
        for (const d of applicable) {
            if (d.percentage > best.percentage) best = d
        }

        const discountAmount = (amount * best.percentage) / 100
        const finalAmount = amount - discountAmount

        return res.json({
            baseAmount: amount,
            discountPercentage: best.percentage,
            discountAmount,
            finalAmount,
            applied: [
                {
                    id: best._id,
                    type: best.type,
                    percentage: best.percentage,
                    description: best.description,
                    hallId: best.hallId,
                    movieId: best.movieId
                }
            ]
        })
    } catch (error) {
        console.error("Calculate discount failed", error)
        return res.status(500).json({ message: "Failed to calculate discount" })
    }
}

module.exports = {
    createDiscount,
    getMyDiscounts,
    updateDiscount,
    deleteDiscount,
    getApplicableForMovie,
    calculateDiscount
}

