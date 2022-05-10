const express = require('express')
const ContenedorProductos = require('./src/api/ContenedorProductos')
//const ContenedorMensajes = require("./src/api/classMensajes")

const { faker }= require("@faker-js/faker")

const {Server:HttpServer} = require('http')
const {Server:IOServer} = require('socket.io')
//const moment = require('moment')

const app = express()
// const productosEnArray = new ContenedorProductos ()
// const mensajesEnArray = new ContenedorMensajes()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const {mariaDB} = require('./src/options/mariaDB');
//const {sqliteDB} = require('./options/sqliteDB');

const productosEnDB = new ContenedorProductos(mariaDB);
//const mensajesEnDB = new ContenedorMensajes(mariaDB);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'hbs'); //le decimos a express el motor es hbs
app.set('views', __dirname + "/public/views"); //le decimos a express donde estan los archivos de vistas
app.use(express.static(__dirname + "/src/public")) //esto es para que el servidor pueda acceder a los archivos estaticos

//-------------------------------------------------------------------------------
io.on("connection", async (socket) =>{
    
    console.log("Un nuevo usuario conectado!")
    const mostrarTablasProductos = await productosEnDB.mostrarTablas()
    if(mostrarTablasProductos === 0){  
    socket.emit("productos", await productosEnDB.createTable())
    }
    socket.emit("productos", await productosEnDB.getAll())    
    socket.on("nuevoIngreso", async (data) =>{
        await productosEnDB.save(data)
        io.sockets.emit("productos", await productosEnDB.getAll())  
    }) 

    app.get("/api/productos-test", (req,res) =>{
        const productosAleatorios = []   
        
        for(let i = 0; i<5; i++){
            const producto = {
                nombre:faker.commerce.productName(),
                precio: faker.commerce.price(),
                foto: faker.image.image()
            }
            productosAleatorios.push(producto)
        }

        res.json(productosAleatorios)  
    })
  
    //-------------------------------------------------------------------------------

    // const mostrarTablasMensajes = await mensajesEnDB.mostrarTablas()
    // if(mostrarTablasMensajes===0){
    // socket.emit("mensajes", await mensajesEnDB.createTable())
    // }
    // socket.emit("mensajes", await mensajesEnDB.getAll())
    // socket.on("mensajeIngreso", async (data) =>{
    //     data.horario = moment().format("DD/MM/YYYY, HH:MM:SS")
    //     await mensajesEnDB.save (data)
    //     io.sockets.emit("mensajes", await mensajesEnDB.getAll())
    // })    
})

httpServer.listen(8080, () => console.log('LISTO!...comencemos..'))