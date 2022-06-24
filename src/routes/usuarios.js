const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const Usuario = require('../model/user')
const passport = require('../passport/passport')
require("../options/mongoDB")

const ContenedorProductos = require("../api/ContenedorProductos")
const { mariaDB } = require('../options/mariaDB')
const productosEnDB = new ContenedorProductos(mariaDB)

const ContenedorMensajes = require("../api/ContenedorMensajesNew")
const mensajesEnFile = new ContenedorMensajes()

const log4js = require("../logs/log4js")
const logger = log4js.getLogger()
const loggerwarnFile = log4js.getLogger("archivo");

router.get("/login", async (req, res) => {
    try{
        logger.info("esto es login!")
        res.render("login")
    }
    catch(error){
        loggerwarnFile.warn(`warning = ${error}`)
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
        loggerwarnFile.warn("error al loggearse!")
        res.render("login-error")
    }
    catch(error){
        loggerwarnFile.warn(`warning = ${error}`)
    }
})

router.get("/register",  (req, res) => {
    try{
        logger.info("esto es register")
        res.render("register")
    }
    catch(error){
        loggerwarnFile.warn(`warning = ${error}`)
    }
})

router.post("/register", async (req,res) =>{
    try{
        const usuariosRegistrados = await Usuario.find()
        const { email, password } = await req.body

        if(usuariosRegistrados.find(usuario => usuario.email === email)){
            loggerwarnFile.warn("el usuario ya esta registrado!!")
            logger.warn("el usuario ya esta registrado!")
            res.render("register-duplicado")
        }        
        const salt = await bcrypt.genSalt(10) //ejecuta el algoritmo 10 veces.
        const hash = await bcrypt.hash(password, salt)

        const user = new Usuario({
            email: email, 
            password: hash
        })
        await user.save()
        logger.info("usuario guardado!")
        req.session.email = user.email
        req.session.password = user.password
        res.redirect("/login")
    }
    catch(error){
        loggerwarnFile.warn(`warning = ${error}`)
    }
})

router.get("/index", async (req, res) => {
    try{
        logger.info("bienvenido!")
        const productos = await productosEnDB.mostrarTodo()
        const mensajes = await mensajesEnFile.mostrarMensajes()
        const user = await Usuario.findById({_id: req.user._id})
        res.render("index", {
            email: user.email, 
            productos: productos,
            mensajes: mensajes
        })
    }
    catch(error){
        loggerwarnFile.warn(`warning = ${error}`)
    }
})

router.get("/logout", (req, res) => {
    try {
        logger.info("gracias por su visita!")
        req.session.destroy()
        res.render("adios")
    }
    catch(error){
        loggerwarnFile.warn(`warning = ${error}`)
    }
}) 

module.exports = router;
