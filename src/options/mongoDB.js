const mongoose = require ('mongoose')
const dotenv = require ('dotenv')
dotenv.config()

try {
    mongoose.connect(
        process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true            
        })
        console.log("conectado a mongo")

} catch (error) {
    console.log(error.message)
}
module.exports = mongoose;