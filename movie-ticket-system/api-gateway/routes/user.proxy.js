const { createProxyMiddleware, fixRequestBody } = require("http-proxy-middleware")

module.exports = createProxyMiddleware({
    target: process.env.USER_SERVICE,
    changeOrigin: true,
    pathFilter: "/api/users",
    on: {
        proxyReq: fixRequestBody
    }
})