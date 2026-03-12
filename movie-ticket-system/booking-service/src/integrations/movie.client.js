const axios = require("axios")

exports.getShow = async (showId) => {

    const response = await axios.get(
        `${process.env.MOVIE_SERVICE_URL}/shows/${showId}`
    )

    return response.data
}