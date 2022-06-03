const express = require('express')
const app = express()
const {Server:HttpServer} = require('http')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const bodyParser = require('body-parser')
const path = require('path')
const exphbs = require('express-handlebars')
const dotenv = require('dotenv')
dotenv.config()

const httpServer = new HttpServer(app)
const MongoStore = require("./src/options/mongo_connect")
require("./src/options/mongoDB")
const passport = require('./src/passport/passport')
const usuarioRoutes = require('./src/routes/usuarios')
app.use(usuarioRoutes)

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


app.use(passport.initialize()) //inicializa passport
app.use(passport.session()) 

/*==========PUERTO==========*/
const PORT = process.env.PORT
httpServer.listen(PORT, () => console.log(`💻 Servidor corriendo en el puerto ${PORT}`))
httpServer.on('error', (error) => {
    console.log(error.message)
})