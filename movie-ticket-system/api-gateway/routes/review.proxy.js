const { createProxyMiddleware, fixRequestBody } = require("http-proxy-middleware")

module.exports = createProxyMiddleware({
    target: process.env.REVIEW_SERVICE,
    changeOrigin: true,
    pathFilter: "/api/reviews",
    on: {
        proxyReq: fixRequestBody
    }
})

