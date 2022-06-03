const mongoConnect = require ('connect-mongo')

const MongoStore = mongoConnect.create({
    mongoUrl: process.env.MONGO_URL
})

module.exports = MongoStore;