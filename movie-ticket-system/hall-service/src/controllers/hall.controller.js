const Hall = require("../models/hall.model")
const SeatBlock = require("../models/seatBlock.model")
const { generateSeatStructure, getSeatLayout } = require("../services/seatStructure.service")

// Admin: Create Hall (inside hall owner)
exports.createHall = async (req, res) => {
    try {
        const { hallOwnerId, name, location, hallImageUrl } = req.body
        const hall = new Hall({ hallOwnerId, name, location, hallImageUrl: hallImageUrl || "" })
        await hall.save()
        res.status(201).json({ message: "Hall created", hall })
    } catch (error) {
        res.status(500).json({ message: "Failed to create hall" })
    }
}

// Admin/Visitor: all halls | Hall Owner: own halls
exports.getHalls = async (req, res) => {
    try {
        const filter = (req.user && req.user.role === "hall_owner") ? { hallOwnerId: req.user.id } : {}
        const halls = await Hall.find(filter)
        res.json(halls)
    } catch (error) {
        res.status(500).json({ message: "Error fetching halls" })
    }
}

// Get halls by owner (Admin)
exports.getHallsByOwner = async (req, res) => {
    try {
        const halls = await Hall.find({ hallOwnerId: req.params.ownerId })
        res.json(halls)
    } catch (error) {
        res.status(500).json({ message: "Error fetching halls" })
    }
}

exports.getHallById = async (req, res) => {
    try {
        const hall = await Hall.findById(req.params.id)
        if (!hall) return res.status(404).json({ message: "Hall not found" })
        res.json(hall)
    } catch (error) {
        res.status(500).json({ message: "Error fetching hall" })
    }
}

exports.updateHall = async (req, res) => {
    try {
        const hall = await Hall.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        if (!hall) return res.status(404).json({ message: "Hall not found" })
        res.json({ message: "Hall updated", hall })
    } catch (error) {
        res.status(500).json({ message: "Update failed" })
    }
}

exports.deleteHall = async (req, res) => {
    try {
        await SeatBlock.deleteMany({ hallId: req.params.id })
        await Hall.findByIdAndDelete(req.params.id)
        res.json({ message: "Hall deleted" })
    } catch (error) {
        res.status(500).json({ message: "Delete failed" })
    }
}
