const axios = require("axios")

exports.createPayment = async (bookingId, amount) => {

    const response = await axios.post(
        `${process.env.PAYMENT_SERVICE_URL}/payments`,
        {
            booking_id: bookingId,
            amount
        }
    )

    return response.data
}