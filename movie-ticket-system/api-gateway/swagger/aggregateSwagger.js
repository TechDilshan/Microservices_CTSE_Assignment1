const axios = require("axios")

const services = [
    { name: "User Service", url: "http://localhost:3001/docs.json", path: "/api-docs/user.json" },
    { name: "Hall Service", url: "http://localhost:3005/docs.json", path: "/api-docs/hall.json" },
    { name: "Movie Service", url: "http://localhost:8000/openapi.json", path: "/api-docs/movie.json" },
    { name: "Booking Service", url: "http://localhost:3003/docs.json", path: "/api-docs/booking.json" },
    { name: "Payment Service", url: "http://localhost:3004/v3/api-docs", path: "/api-docs/payment.json" }
]

const swaggerOptions = {
    explorer: true,
    swaggerOptions: {
        urls: services.map(s => ({ name: s.name, url: s.path }))
    }
}

async function fetchSwaggerDoc(url) {
    try {
        const res = await axios.get(url)
        return res.data
    } catch (error) {
        console.log("Failed to load swagger from:", url, error.message)
        return { error: "Failed to load documentation" }
    }
}

module.exports = {
    services,
    swaggerOptions,
    fetchSwaggerDoc
}