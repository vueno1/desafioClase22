require("dotenv").config()  

function param(p) {
    const index = process.argv.indexOf(p)
    return process.argv[index + 3]
}

const PORT = param("--port")

module.exports = {
    PORT: PORT || 3000,
    MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017/"
}
