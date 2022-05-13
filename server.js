const express = require('express')
const app = express()
const { faker }= require("@faker-js/faker")
const {Server:HttpServer} = require('http')
const {Server:IOServer} = require('socket.io')
const ContenedorProductos = require('./src/api/ContenedorProductos')
const ContenedorMensajesNew = require("./src/api/ContenedorMensajesNew")
const {mariaDB} = require('./src/options/mariaDB');
const moment = require('moment')

const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const productosEnDB = new ContenedorProductos(mariaDB);
const mensajesEnFs = new ContenedorMensajesNew();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'hbs'); //le decimos a express el motor es hbs
app.set('views', __dirname + "/public/views"); //le decimos a express donde estan los archivos de vistas
app.use(express.static(__dirname + "/src/public")) //esto es para que el servidor pueda acceder a los archivos estaticos

io.on("connection", async (socket) =>{   

    console.log(`🙂 Un nuevo usuario conectado!`)

    const mostrarTablasProductos = await productosEnDB.mostrarTablas()

    if(mostrarTablasProductos === 0){  
    socket.emit("productos", await productosEnDB.createTable())
    }
    socket.emit("productos", await productosEnDB.getAll())    

    socket.on("nuevoIngreso", async (data) =>{
        await productosEnDB.save(data)
        io.sockets.emit("productos", await productosEnDB.getAll())  
    })    
    
    socket.emit("mensajes", await mensajesEnFs.mostrarMensajes())
    
    socket.on("mensajeIngreso", async(data) =>{
        data.time = moment().format('MMMM Do YYYY, h:mm:ss a')
        await mensajesEnFs.guardarMensajes(data)   
        io.sockets.emit("mensajes", await mensajesEnFs.mostrarMensajes())
        
    })
    
})

//la ruta queda x fuera del socket. 
//y creo los productos aleatorios. 
app.get("/api/productos-test", (req,res) =>{
    const productosFaker = [] 
    for(let i = 0; i<5; i++){
        const producto = {
            nombre:faker.commerce.productName(),
            precio: faker.commerce.price(),
            foto: faker.image.image()
        }
        productosFaker.push(producto)
    }
    //seria exponer el json en esa ruta de test, y tener una plantilla que haga el fetch a esa ruta y renderice el array)
    res.json(productosFaker)
})

httpServer.listen(8080, () => console.log(`💻 Servidor corriendo en el puerto 8080`))