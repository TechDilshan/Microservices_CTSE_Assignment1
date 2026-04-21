const axios = require("axios")

const HALL_SERVICE_URL = "http://hall-service-alb-685815397.ap-south-1.elb.amazonaws.com"

exports.getSeatBlock = async (hallId) => {
    const response = await axios.get(`${HALL_SERVICE_URL}/api/halls/${hallId}/seat-block`)
    return response.data
}

exports.getSeatLayout = async (hallId) => {
    const response = await axios.get(`${HALL_SERVICE_URL}/api/halls/${hallId}/seat-layout`)
    return response.data
}

exports.getHallsForOwner = async (authHeader) => {
    const response = await axios.get(`${HALL_SERVICE_URL}/api/halls`, {
        headers: { Authorization: authHeader }
    })
    return response.data
}
