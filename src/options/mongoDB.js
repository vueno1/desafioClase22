const mongoose = require ('mongoose')
const config = require('../config')

try {
    mongoose.connect(
        config.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true            
        })
        console.log(`conectado a MONGODB`)

} catch (error) {
    console.log(error.message)
}
module.exports = mongoose;