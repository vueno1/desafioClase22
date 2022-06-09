const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const Usuario = require('../model/user')

passport.use("local", new LocalStrategy(  
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    async (req, email, password, done) => {
        try {
            const user = await Usuario.findOne({ email: email });
            if(!user) return done(null, false,  {message: "Usuario no encontrado"})
            const desencriptado = await bcrypt.compare(password, user.password)
            if(!desencriptado) return done(null, false, {message: "El password no coincide"})
            return done(null, user)
        }

     catch (error) {
        console.log(error.message)
    }
}
))

passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser(async (_id, done) => {
    const usuario = await Usuario.findById(_id)
    done(null, usuario)
})

module.exports = passport;
