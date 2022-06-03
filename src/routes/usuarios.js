const express = require('express')
// const app = express()
const router = express.Router()
const bcrypt = require('bcrypt')
const Usuario = require('../model/user')
const passport = require('../passport/passport')
require("../options/mongoDB")

// const bodyParser = require('body-parser')
// const exphbs = require('express-handlebars')
// const path = require('path')

// app.set('views', path.join(__dirname, '../views'))
// app.set('view engine', 'hbs')
// app.engine('hbs', exphbs.engine({
//     extname: 'hbs',
//     defaultLayout: 'main',
//     layoutsDir: path.join(__dirname, '../views/layouts'),
//     partialsDir: path.join(__dirname, '../views/partials')
// }))



// app.use(express.json())
// app.use(bodyParser.urlencoded({ extended: true }))

router.get("/login", async (req, res) => {
    try{
        console.log("esto es login")
        res.render("login")
    }
    catch(error){
        console.log(error.message)
    }
})

router.post('/login', 
    passport.authenticate("local", {
        successRedirect: "/index",
        failureRedirect: "/login-error"
    })
);

router.get("/login-error", (req, res) => {
    try{
        res.render("login-error")
    }
    catch(error){
        console.log(error.message)
    }
})

router.get("/register",  (req, res) => {
    try{
        console.log("esto es register")
        res.render("register")
    }
    catch(error){
        console.log(error.message)
    }
})

router.post("/register", async (req,res) =>{
    try{
        console.log(`req.body = ${await req.body}`)
        // const usuariosRegistrados = await Usuario.find()
        // const { email, password } = await req.body
        // console.log(email)
        // console.log(password)

        // if(usuariosRegistrados.find(usuario => usuario.email === email)){
        //     console.log("el usuario ya esta registrado")
        //     res.render("register-duplicado")
        // }        
        // const salt = await bcrypt.genSalt(10) //ejecuta el algoritmo 10 veces.
        // const hash = await bcrypt.hash(password, salt)
        // console.log(`password hasheado = ${hash}`)

        // const user = new Usuario({
        //     email: email, 
        //     password: hash
        // })
        // await user.save()
        // console.log("se guardo en mongoDB como users")

        // req.session.email = user.email
        // req.session.password = user.password
        // console.log("se guardo en session")

        res.redirect("/login")
    }
    catch(error){
        console.log(error.message)
    }
})

router.get("/index", async (req, res) => {
    try{
        const user = await Usuario.findById({_id: req.user._id})
        res.render("index", {
            email: user.email
        })
    }
    catch(error){
        console.log(error.message)
    }
})

router.get("/logout", (req, res) => {
    try {
        req.session.destroy()
        res.render("adios")
    }
    catch(error){
        console.log(error.message)
    }
}) 

module.exports = router;
