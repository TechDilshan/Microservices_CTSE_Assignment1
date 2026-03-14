const axios = require("axios")

const getClient = () => {
    return axios.create({
        timeout: 5000
    })
}

// Rankings: combine Review Service summaries with Movie Service details
const getMovieRankings = async (req, res) => {
    try {
        const client = getClient()
        const reviewUrl = process.env.REVIEW_SERVICE_URL || "http://review-service:3010/api/reviews/summary/all"
        const movieUrl = process.env.MOVIE_SERVICE_URL || "http://movie-service:8000/api/movies"

        const [summariesRes, moviesRes] = await Promise.all([
            client.get(reviewUrl),
            client.get(movieUrl)
        ])

        const summaries = summariesRes.data || []
        const movies = moviesRes.data || []

        const movieMap = new Map()
        for (const m of movies) {
            movieMap.set(m._id, m)
        }

        const enriched = summaries
            .map((s) => {
                const m = movieMap.get(s.movieId) || {}
                return {
                    movieId: s.movieId,
                    name: m.name || "Unknown",
                    genre: m.genre || "",
                    hallId: m.hallId || null,
                    averageRating: s.averageRating,
                    reviewCount: s.count
                }
            })
            .sort((a, b) => {
                if (b.averageRating === a.averageRating) {
                    return (b.reviewCount || 0) - (a.reviewCount || 0)
                }
                return (b.averageRating || 0) - (a.averageRating || 0)
            })

        return res.json(enriched)
    } catch (error) {
        console.error("getMovieRankings failed", error.message)
        return res.status(500).json({ message: "Failed to load rankings" })
    }
}

// Hall owner overview metrics: movies, bookings, payments for their halls
const getHallOwnerOverview = async (req, res) => {
    try {
        const userId = req.user.id
        const token = req.headers.authorization
        const client = getClient()

        const hallUrl = process.env.HALL_SERVICE_URL || "http://hall-service:3005/api/halls"
        const movieUrl = process.env.MOVIE_SERVICE_URL || "http://movie-service:8000/api/movies"
        const bookingsUrl = process.env.BOOKING_SERVICE_URL || "http://booking-service:3003/api/bookings"
        const paymentsUrl = process.env.BOOKING_SERVICE_URL
            ? process.env.BOOKING_SERVICE_URL + "/payments"
            : "http://booking-service:3003/api/bookings/payments"

        const hallsRes = await client.get(hallUrl, { headers: { Authorization: token } })
        const halls = (hallsRes.data || []).filter((h) => String(h.hallOwnerId) === String(userId))
        const hallIds = new Set(halls.map((h) => h._id))

        let movies = []
        try {
            const mr = await client.get(movieUrl)
            movies = (mr.data || []).filter((m) => m.hallId && hallIds.has(m.hallId))
        } catch {
            movies = []
        }

        let bookings = []
        try {
            const br = await client.get(bookingsUrl, { headers: { Authorization: token } })
            bookings = br.data || []
        } catch {
            bookings = []
        }

        let payments = []
        try {
            const pr = await client.get(paymentsUrl, { headers: { Authorization: token } })
            payments = pr.data || []
        } catch {
            payments = []
        }

        const revenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0)

        return res.json({
            halls: halls.length,
            movies: movies.length,
            bookings: bookings.length,
            payments: payments.length,
            revenue
        })
    } catch (error) {
        console.error("getHallOwnerOverview failed", error.message)
        return res.status(500).json({ message: "Failed to load hall owner analytics" })
    }
}

// Admin overview – high-level stats across all halls/movies/bookings/payments
const getAdminOverview = async (req, res) => {
    try {
        const token = req.headers.authorization
        const client = getClient()

        const hallUrl = process.env.HALL_SERVICE_URL || "http://hall-service:3005/api/halls"
        const movieUrl = process.env.MOVIE_SERVICE_URL || "http://movie-service:8000/api/movies"
        const bookingsUrl = process.env.BOOKING_SERVICE_URL || "http://booking-service:3003/api/bookings"
        const paymentsUrl = process.env.BOOKING_SERVICE_URL
            ? process.env.BOOKING_SERVICE_URL + "/payments"
            : "http://booking-service:3003/api/bookings/payments"

        const [hallsRes, moviesRes, bookingsRes, paymentsRes] = await Promise.all([
            client.get(hallUrl, { headers: { Authorization: token } }),
            client.get(movieUrl),
            client.get(bookingsUrl, { headers: { Authorization: token } }),
            client.get(paymentsUrl, { headers: { Authorization: token } })
        ])

        const halls = hallsRes.data || []
        const movies = moviesRes.data || []
        const bookings = bookingsRes.data || []
        const payments = paymentsRes.data || []

        const revenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0)

        return res.json({
            halls: halls.length,
            movies: movies.length,
            bookings: bookings.length,
            payments: payments.length,
            revenue
        })
    } catch (error) {
        console.error("getAdminOverview failed", error.message)
        return res.status(500).json({ message: "Failed to load admin analytics" })
    }
}

module.exports = {
    getMovieRankings,
    getHallOwnerOverview,
    getAdminOverview
}

