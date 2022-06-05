const mongoConnect = require ('connect-mongo')
const config = require ('../config')

const MongoStore = mongoConnect.create({
    mongoUrl: config.MONGO_URL
})

module.exports = MongoStore;