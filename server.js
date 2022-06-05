const express = require('express')
const app = express()
const {Server:HttpServer} = require('http')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const bodyParser = require('body-parser')
const path = require('path')
const exphbs = require('express-handlebars')
const httpServer = new HttpServer(app)
const MongoStore = require("./src/options/mongo_connect")
require("./src/options/mongoDB")
const passport = require('./src/passport/passport')
const usuarioRoutes = require('./src/routes/usuarios')
const productosRoutes = require('./src/routes/productos')
const mensajesRoutes = require("./src/routes/mensajes")
const infoRoutes = require("./src/routes/info")
const config = require("./src/config")

//==========views==========//
app.set('views', path.join(path.dirname(''), './src/views') )
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

//========ingreso cliente=========//
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

//========passport========//
app.use(passport.initialize()) //inicializa passport
app.use(passport.session()) 

//=======routes========//
//app.use rutas de usuarios
app.use("/", usuarioRoutes, productosRoutes, mensajesRoutes, infoRoutes)

/*==========PUERTO==========*/
// const PORT = process.env.PORT
httpServer.listen(config.PORT, () => console.log(`💻 Servidor corriendo en el puerto ${config.PORT}`))
httpServer.on('error', (error) => {
    console.log(error.message)
})