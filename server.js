const express = require('express')
const app = express()
const { faker }= require("@faker-js/faker")
const {Server:HttpServer} = require('http')
const {Server:IOServer} = require('socket.io')
const ContenedorProductos = require('./src/api/ContenedorProductos')
const ContenedorMensajesNew = require("./src/api/ContenedorMensajesNew")
const {mariaDB} = require('./src/options/mariaDB');
const moment = require('moment')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const bodyParser = require('body-parser')
const path = require('path')
const exphbs = require('express-handlebars')
const connectMongo = require('connect-mongo')
const dotenv = require('dotenv')
dotenv.config()

const MongoStore = connectMongo.create({
    mongoUrl: process.env.MONGO_URL
})

const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const productosEnDB = new ContenedorProductos(mariaDB);
const mensajesEnFs = new ContenedorMensajesNew();

app.set('views', path.join(path.dirname(''), './src/views') )
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

/*==========SESSION==========*/
app.use(cookieParser())
app.use(session({
    store: MongoStore,
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

/*============RUTAS===============*/
app.get("/", (req, res) => {
    try{
        res.render("login")
    }
    catch(error){
        console.log(error.message)
    }
})

app.post("/login", (req, res) => {
    try{
        const {nombre, password} = req.body    
        if(req.session.nombre !== nombre && req.session.password !== password){
            res.redirect("/register")
        } else {
            res.redirect("/index")
        }
    } 
    catch(error){
        console.log(error.message)
    }    
})

app.get("/register", (req, res) => {
    try{
        res.render("register")
    }
    catch(error){
        console.log(error.message)
    }
})

app.post("/register", async (req,res) =>{
    try{
        const {nombre, password} = await req.body
        req.session.nombre = nombre,
        req.session.password = password
        res.redirect("/")
    }
    catch(error){
        console.log(error.message)
    }
})

app.get("/index", async (req, res) => {
    try{
        const productos = await productosEnDB.mostrarTodo()
        const mensajes = await mensajesEnFs.mostrarMensajes()
        res.render("index", {
            nombre: req.session.nombre,
            productos: productos,
            mensajes: mensajes
        })
    }
    catch(error){
        console.log(error.message)
    }
})

app.get("/logout", (req, res) => {
    try {
        req.session.destroy()
        res.render("adios")
    }
    catch(error){
        console.log(error.message)
    }
}) 

setTimeout(() => {
    app.get("/logout", (req, res) => {
        res.redirect("/")
    })
}, 2000) 

app.post("/productos", async (req,res) =>{
    try{
        const {nombre, precio, url} = await req.body
        const producto = {
            nombre,
            precio,
            url
        }
        await productosEnDB.guardar(producto)
        res.redirect("/index")
    }
    catch(error){
        console.log(error.message)
    }
})

app.post("/mensajes", async (req, res) => {
    try{
        const {mail, nombre, apellido, edad, alias, avatar, mensaje} = await req.body
        const nuevoMensaje = {
            autor: {
                id: mail,
                nombre: nombre,
                apellido: apellido,
                edad: edad,
                alias: alias,
                avatar: avatar    
            },
            text: mensaje,
            time: moment().format('DD/MM/YYYY HH:mm:ss')
        }
        mensajesEnFs.guardarMensajes(nuevoMensaje)
        res.redirect("/index")
    }
    catch(error){
        console.log(error.message)
    }
})

/*=========SOCKET==========*/
io.on("connection",  (socket) =>{
    console.log(`🙂 Un nuevo usuario conectado!`)
    
})

/*==========PUERTO==========*/
httpServer.listen(8080, () => console.log(`💻 Servidor corriendo en el puerto 8080`))