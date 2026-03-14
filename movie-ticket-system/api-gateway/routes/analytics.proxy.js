const { createProxyMiddleware, fixRequestBody } = require("http-proxy-middleware")

module.exports = createProxyMiddleware({
    target: process.env.ANALYTICS_SERVICE,
    changeOrigin: true,
    pathFilter: "/api/analytics",
    on: {
        proxyReq: fixRequestBody
    }
})

