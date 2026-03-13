const { createProxyMiddleware, fixRequestBody } = require("http-proxy-middleware")

module.exports = createProxyMiddleware({
    target: process.env.HALL_SERVICE,
    changeOrigin: true,
    pathFilter: "/api/halls",
    on: {
        proxyReq: fixRequestBody
    }
})
