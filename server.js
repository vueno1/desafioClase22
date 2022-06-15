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
const infoRoutes = require("./src/routes/info")
const randomRoutes = require("./src/routes/random")
const config = require("./src/config")

console.log(config.PORT)
console.log(config.ARGUMENTO2)

if (config.ARGUMENTO2 == "cluster") {

    const cluster = require('cluster');
    const numCPUs = require('os').cpus().length;

    if(cluster.isMaster) {
        console.log(`Master ${process.pid} is running`);

        for(let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        //modo escucha de cluster
        cluster.on("listening", (worker, address) => {
            console.log(`Worker ${worker.process.pid} connected on port ${address.port}`);
        }
        );
    }
    else {
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
        app.use("/", usuarioRoutes, infoRoutes, randomRoutes)

        /*==========PUERTO==========*/
        httpServer.listen(config.PORT, () => console.log(`💻 Servidor corriendo en el puerto ${config.PORT} 💡💡💡!!!`))
        httpServer.on('error', (error) => {
            console.log(error.message)
        })
    }
}
else {

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
    app.use("/", usuarioRoutes, infoRoutes, randomRoutes)

    /*==========PUERTO==========*/
    httpServer.listen(config.PORT, () => console.log(`💻 Servidor corriendo en el puerto ${config.PORT} 💡💡💡!!!`))
    httpServer.on('error', (error) => {
        console.log(error.message)
    })
}
