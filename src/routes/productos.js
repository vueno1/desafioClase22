const express = require('express')
const router = express.Router()
const ContenedorProductos = require("../api/ContenedorProductos")
const { mariaDB } = require("../options/mariaDB")
const productosEnDB = new ContenedorProductos(mariaDB)

const log4js = require("../logs/log4js")
const logger = log4js.getLogger()
const loggerwarnFile = log4js.getLogger("archivo");
const loggerErrorFile = log4js.getLogger("archivo2")

router.post("/productos", async (req,res) =>{
    try{
        const {nombre, precio, url} = await req.body
        const producto = {
            nombre,
            precio,
            url
        }
        await productosEnDB.guardar(producto)
        console.log("se guardo producto en mariaDB")
        res.redirect("/index")
    }
    catch(error){
        loggerErrorFile.error(`ERROR = ${error}`)
    }
})

module.exports = router;