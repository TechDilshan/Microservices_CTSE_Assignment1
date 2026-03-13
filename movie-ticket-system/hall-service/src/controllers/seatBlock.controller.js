const SeatBlock = require("../models/seatBlock.model")
const Hall = require("../models/hall.model")
const { generateSeatStructure, getSeatLayout } = require("../services/seatStructure.service")

exports.createOrUpdateSeatBlock = async (req, res) => {
    try {
        const { hallId } = req.params
        const { numSeats, odc } = req.body

        const hall = await Hall.findById(hallId)
        if (!hall) return res.status(404).json({ message: "Hall not found" })

        let seatBlock = await SeatBlock.findOne({ hallId })
        if (seatBlock) {
            seatBlock.numSeats = numSeats || seatBlock.numSeats
            seatBlock.odc = odc || seatBlock.odc
            await seatBlock.save()
        } else {
            seatBlock = new SeatBlock({ hallId, numSeats, odc })
            await seatBlock.save()
        }

        const layout = getSeatLayout(seatBlock)
        const allSeats = generateSeatStructure(seatBlock)

        res.json({
            message: "Seat block saved",
            seatBlock,
            layout,
            allSeats
        })
    } catch (error) {
        res.status(500).json({ message: "Failed to save seat block" })
    }
}

exports.getSeatBlock = async (req, res) => {
    try {
        const seatBlock = await SeatBlock.findOne({ hallId: req.params.hallId })
        if (!seatBlock) return res.status(404).json({ message: "Seat block not found" })

        const layout = getSeatLayout(seatBlock)
        const allSeats = generateSeatStructure(seatBlock)

        res.json({
            seatBlock,
            layout,
            allSeats
        })
    } catch (error) {
        res.status(500).json({ message: "Error fetching seat block" })
    }
}

exports.getSeatLayout = async (req, res) => {
    try {
        const seatBlock = await SeatBlock.findOne({ hallId: req.params.hallId })
        if (!seatBlock) return res.status(404).json({ message: "Seat block not found" })

        const layout = getSeatLayout(seatBlock)
        res.json({ layout })
    } catch (error) {
        res.status(500).json({ message: "Error fetching seat layout" })
    }
}
