const express = require('express')
const app = express()
//const { faker }= require("@faker-js/faker")
const {Server:HttpServer} = require('http')
//const {Server:IOServer} = require('socket.io')
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
const bcrypt = require('bcrypt')
const passport = require('passport')
const { Strategy: LocalStrategy } = require('passport-local')
const mongoose = require('mongoose')
const Usuario = require('./src/model/user')

const MongoStore = connectMongo.create({
    mongoUrl: process.env.MONGO_URL
})
//si pongo ttl no me guarda encriptado el password en mongodb.

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

const httpServer = new HttpServer(app)
//const io = new IOServer(httpServer)
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
app.use(bodyParser.urlencoded({ extended: true })) //recibe los datos desde el cliente. 

/*==========SESSION==========*/
app.use(cookieParser())
app.use(session({
    store: MongoStore,
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

// passport.use("local",
//     new LocalStrategy(
//     {
//         usernameField: 'email',
//         passwordField: 'password',
//         passReqToCallback: true
//     },
//     async (req, email, password,done) =>{
//         try{
//             const user = await Usuario.findOne({email: email});
//             if(!user) done(null, false)
//             const passwordCorrect = await bcrypt.compare(password, user.password);
//             if(!passwordCorrect) done(null, false);
//             done(null, user);
//         } catch(err){
//             done(err, false);
//         }
//     }
// )
// )

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

//una vez hemos registrado, vamos a guardarlo internamente en el navegador.
//no vamos a tener que autenticar cada vez q visita la pagina.
//eso lo hace passport con estos dos metodos:
passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser(async (_id, done) => {
    const usuario = await Usuario.findById(_id)
    done(null, usuario)
})

//middleware para passport//
app.use(passport.initialize()) //inicializa passport
app.use(passport.session()) 

/*============RUTAS===============*/
app.get("/login", async (req, res) => {
    try{
        res.render("login")
    }
    catch(error){
        console.log(error.message)
    }
})

app.post('/login', 
    passport.authenticate("local", {
        successRedirect: "/index",
        failureRedirect: "/login-error"
    })
);

app.get("/login-error", (req, res) => {
    try{
        res.render("login-error")
    }
    catch(error){
        console.log(error.message)
    }
})

app.get("/register",  (req, res) => {
    try{
        res.render("register")
    }
    catch(error){
        console.log(error.message)
    }
})

app.post("/register", async (req,res) =>{
    try{
        const usuariosRegistrados = await Usuario.find()
        const { email, password } = await req.body
        console.log(email)
        console.log(password)

        if(usuariosRegistrados.find(usuario => usuario.email === email)){
            console.log("el usuario ya esta registrado")
            res.render("register-duplicado")
        }        
        const salt = await bcrypt.genSalt(10) //ejecuta el algoritmo 10 veces.
        const hash = await bcrypt.hash(password, salt)
        console.log(`password hasheado = ${hash}`)

        const user = new Usuario({
            email: email, 
            password: hash
        })
        await user.save()
        console.log("se guardo en mongoDB como users")

        req.session.email = user.email
        req.session.password = user.password
        console.log("se guardo en session")

        res.redirect("/login")
    }
    catch(error){
        console.log(error.message)
    }
})

app.get("/index", async (req, res) => {
    try{
        const user = await Usuario.findById({_id: req.user._id})
        const productos = await productosEnDB.mostrarTodo()
        const mensajes = await mensajesEnFs.mostrarMensajes()
        res.render("index", {
            email: user.email,
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

//=====rutas productos y mensajes=====//
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

/*==========PUERTO==========*/
const PORT = process.env.PORT
httpServer.listen(PORT, () => console.log(`💻 Servidor corriendo en el puerto ${PORT}`))
httpServer.on('error', (error) => {
    console.log(error.message)
})