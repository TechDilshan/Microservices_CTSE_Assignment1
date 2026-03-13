const axios = require("axios")

const PAYMENT_BASE = process.env.PAYMENT_SERVICE_URL || "http://localhost:3004"

exports.createPayment = async (bookingId, userId, amount, method = "card", authHeader) => {
    const headers = authHeader ? { Authorization: authHeader } : {}
    const response = await axios.post(
        `${PAYMENT_BASE}/api/payments`,
        { bookingId, userId, amount, method },
        { headers }
    )
    return response.data
}

exports.getPaymentsByBooking = async (bookingId, authHeader) => {
    const headers = authHeader ? { Authorization: authHeader } : {}
    const response = await axios.get(
        `${PAYMENT_BASE}/api/payments/booking/${bookingId}`,
        { headers }
    )
    return response.data
}

exports.getPayment = async (paymentId, authHeader) => {
    const headers = authHeader ? { Authorization: authHeader } : {}
    const response = await axios.get(`${PAYMENT_BASE}/api/payments/${paymentId}`, { headers })
    return response.data
}

exports.updatePaymentStatus = async (paymentId, status, authHeader) => {
    const headers = authHeader ? { Authorization: authHeader } : {}
    const response = await axios.put(
        `${PAYMENT_BASE}/api/payments/${paymentId}/status`,
        null,
        { params: { status }, headers }
    )
    return response.data
}

exports.deletePayment = async (paymentId, authHeader) => {
    const headers = authHeader ? { Authorization: authHeader } : {}
    await axios.delete(`${PAYMENT_BASE}/api/payments/${paymentId}`, { headers })
}