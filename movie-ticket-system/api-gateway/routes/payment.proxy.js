const { createProxyMiddleware, fixRequestBody } = require("http-proxy-middleware")

module.exports = createProxyMiddleware({
    target: process.env.PAYMENT_SERVICE,
    changeOrigin: true,
    pathFilter: "/api/payments",
    on: {
        proxyReq: fixRequestBody
    }
})