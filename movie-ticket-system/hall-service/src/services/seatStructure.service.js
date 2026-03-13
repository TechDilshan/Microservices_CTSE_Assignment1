/**
 * Generates full seat structure from SeatBlock config
 * ODC: ODC-A1, ODC-A2, ... (row letter + column number)
 * Balcony: Balcony-1, Balcony-2, ...
 * Box: Box-1, Box-2, ...
 */
function generateSeatStructure(seatBlock) {
    const { numSeats, odc } = seatBlock
    const seats = []
    const rowLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    // ODC seats: rows x columns
    for (let r = 0; r < odc.rows; r++) {
        for (let c = 1; c <= odc.columns; c++) {
            seats.push(`ODC-${rowLetters[r]}${c}`)
        }
    }

    // Balcony seats
    for (let i = 1; i <= (numSeats?.Balcony || 4); i++) {
        seats.push(`Balcony-${i}`)
    }

    // Box seats
    for (let i = 1; i <= (numSeats?.Box || 5); i++) {
        seats.push(`Box-${i}`)
    }

    return seats
}

/**
 * Get seat layout for display (grouped by block)
 */
function getSeatLayout(seatBlock) {
    const { numSeats, odc } = seatBlock
    const layout = { ODC: [], Balcony: [], Box: [] }
    const rowLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    for (let r = 0; r < odc.rows; r++) {
        const row = []
        for (let c = 1; c <= odc.columns; c++) {
            row.push(`${rowLetters[r]}${c}`)
        }
        layout.ODC.push(row)
    }

    for (let i = 1; i <= (numSeats?.Balcony || 4); i++) {
        layout.Balcony.push(`Balcony-${i}`)
    }

    for (let i = 1; i <= (numSeats?.Box || 5); i++) {
        layout.Box.push(`Box-${i}`)
    }

    return layout
}

module.exports = {
    generateSeatStructure,
    getSeatLayout
}
