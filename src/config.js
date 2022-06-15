require("dotenv").config()  

function param(p) {
    const index = process.argv.indexOf(p)
    return process.argv[index + 3]
}

function param2(p) {
    const index = process.argv.indexOf(p)
    return process.argv[index + 5]
}

const PORT = param("--port")
const ARGUMENT2 = param2("--argumento2")

module.exports = {
    PORT: PORT || 3000,
    MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017/",  
    ARGUMENTO2: ARGUMENT2 || "no hay argumentos"
}
