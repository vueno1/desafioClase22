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

const MongoStore = connectMongo.create({
    mongoUrl: process.env.MONGO_URL,
    ttl: 24 * 60 * 60 // 1 day
})

//si pongo ttl no me guarda encriptado el password en mongodb.

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

//middlewares para la info que viene x cliente.
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true })) //recibe los datos desde el cliente. 
//solo va a recibir datos desde un formulario. 

/*==========SESSION==========*/
app.use(cookieParser())
app.use(session({
    store: MongoStore,
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

passport.use("local-signup", new LocalStrategy(
    //estrategia manda como argumento el mail + password
    //y hace la consulta, si existe o no.  
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },

    async (req, email, password, done) => {
        const mongoEmail = await req.session.email 
        const mongoPassword = await req.session.password

        const mongoUsuario = {
            email: mongoEmail,
            password: mongoPassword
        }

        if(mongoEmail !== email) {
            console.log("no coincide email")
            return done(null, false, {message: "El usuario no existe"})
        }
        else {
            //console.log(password)
            //desencriptar con bycrpt
            const desencriptado = await bcrypt.compare(password, mongoPassword)
            //const compararContraseña = bcrypt.compareSync(password, mongoPassport)
            if(!desencriptado) {
                console.log("no coincide password")
                return done(null, false, {message: "Contraseña incorrecta"})
            }
            else {
                console.log("usuario logueado")
                return done(null, mongoUsuario)
            }
        }
     
    }
))

//una vez hemos registrado, vamos a guardarlo internamente en el navegador.
//no vamos a tener que autenticar cada vez q visita la pagina.
//eso lo hace passport con estos dos metodos:

//recibe un usuario y un callback (done)
passport.serializeUser((mongoUsuario, done) => {
    //vamos a guardarlo para que no se pierda.
    done(null, mongoUsuario.email);
    //desde el usuario, vamos a guardar el email.
})

//proceso inverso, en vez del usuario, recibe el email.
passport.deserializeUser(async (email, done) => {
    //console.log("deserializeUser")
    const mongoUsuario = (await MongoStore.collectionP).findOne({email})
    //console.log(mongoUsuario)
    done(null, mongoUsuario)
    
})

//middleware para passport//
app.use(passport.initialize()) //inicializa passport
app.use(passport.session()) 

/*============RUTAS===============*/
app.get("/", (req, res) => {
    try{
        res.render("login")
    }
    catch(error){
        console.log(error.message)
    }
})

app.post('/login', 
    passport.authenticate("local-signup", {
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
        const {email, password} = await req.body
        console.log(email)
        console.log(password)
        
        // if(req.session.email === email && req.session.password === password){
        //     res.render("/register-duplicado")
        // }
        const salt = await bcrypt.genSalt(10) //ejecuta el algoritmo 10 veces.
        const hash = await bcrypt.hash(password, salt)

        req.session.email = email,
        req.session.password = hash
        res.redirect("/")
    }
    catch(error){
        console.log(error.message)
    }
})

app.get("/index", async (req, res) => {
    try{
        //console.log(await req.session.email)
        const productos = await productosEnDB.mostrarTodo()
        const mensajes = await mensajesEnFs.mostrarMensajes()
        res.render("index", {
            email: await req.session.email,
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
httpServer.listen(PORT, () => console.log(`💻 Servidor corriendo en el puerto 8080`))
httpServer.on('error', (error) => {
    console.log(error.message)
})