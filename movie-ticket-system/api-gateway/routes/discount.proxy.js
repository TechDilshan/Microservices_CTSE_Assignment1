const { createProxyMiddleware, fixRequestBody } = require("http-proxy-middleware")

module.exports = createProxyMiddleware({
    target: process.env.DISCOUNT_SERVICE,
    changeOrigin: true,
    pathFilter: "/api/discounts",
    on: {
        proxyReq: fixRequestBody
    }
})

