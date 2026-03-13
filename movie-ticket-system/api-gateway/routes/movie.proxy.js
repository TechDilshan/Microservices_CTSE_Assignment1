const { createProxyMiddleware, fixRequestBody } = require("http-proxy-middleware")

module.exports = createProxyMiddleware({
    target: process.env.MOVIE_SERVICE,
    changeOrigin: true,
    pathFilter: "/api/movies",
    on: {
        proxyReq: fixRequestBody
    }
})