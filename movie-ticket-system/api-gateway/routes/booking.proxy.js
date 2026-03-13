const { createProxyMiddleware, fixRequestBody } = require("http-proxy-middleware")

module.exports = createProxyMiddleware({
    target: process.env.BOOKING_SERVICE,
    changeOrigin: true,
    pathFilter: "/api/bookings",
    on: {
        proxyReq: fixRequestBody
    }
})