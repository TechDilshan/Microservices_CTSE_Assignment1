const axios = require("axios")

const services = [
    { name: "User Service", url: `${process.env.USER_SERVICE || "http://localhost:3001"}/docs.json`, path: "/api-docs/user.json" },
    { name: "Hall Service", url: `${process.env.HALL_SERVICE || "http://localhost:3005"}/docs.json`, path: "/api-docs/hall.json" },
    { name: "Movie Service", url: `${process.env.MOVIE_SERVICE || "http://localhost:8000"}/docs.json`, path: "/api-docs/movie.json" },
    { name: "Booking Service", url: `${process.env.BOOKING_SERVICE || "http://localhost:3003"}/docs.json`, path: "/api-docs/booking.json" },
    { name: "Payment Service", url: `${process.env.PAYMENT_SERVICE || "http://localhost:3004"}/docs.json`, path: "/api-docs/payment.json" },
    { name: "Review Service", url: `${process.env.REVIEW_SERVICE || "http://localhost:3010"}/docs.json`, path: "/api-docs/review.json" },
    { name: "Discount Service", url: `${process.env.DISCOUNT_SERVICE || "http://localhost:3020"}/docs.json`, path: "/api-docs/discount.json" },
    { name: "Analytics Service", url: `${process.env.ANALYTICS_SERVICE || "http://localhost:3030"}/docs.json`, path: "/api-docs/analytics.json" }
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