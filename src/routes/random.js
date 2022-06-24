const express = require('express')
const router = express.Router()
const ContenedorRandomNumeros = require('../api/ContenedorRandomNumeros')
const misRandomNumeros = new ContenedorRandomNumeros()

const log4js = require("../logs/log4js")
const logger = log4js.getLogger()
const loggerwarnFile = log4js.getLogger("archivo");

router.get("/api/randoms", async (req,res) =>{
    try {
        const cantidad = req.query.cantidad || 500000000 
        await misRandomNumeros.generarNumerosRandom(cantidad)
        const numeros = await misRandomNumeros.mostrarRandom()

        res.json({
            ngnix:`ngnix corriendo en el puerto ${process.argv[2]}, PID WORKER ${process.pid}`,
            randoms: numeros
        })
        logger.info(`ngnix: corriendo pto ${process.argv[2]}, PID WORKER ${process.pid}`)
    }   
    catch(error) {
        loggerwarnFile.warn(`warning = ${error}`)
    }
})

module.exports = router;