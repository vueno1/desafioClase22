const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    email: String,
    password: String
})

const Usuario =  mongoose.model('User', userSchema);
module.exports = Usuario;