const express = require('express')
const router = express.Router()
const ContenedorMensajes = require("../api/ContenedorMensajesNew")
const mensajesEnFile = new ContenedorMensajes()
const moment = require("moment")

const log4js = require("../logs/log4js")
const logger = log4js.getLogger()
const loggerErrorFile = log4js.getLogger("archivo2")

router.post("/mensajes", async (req, res) => {
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
        mensajesEnFile.guardarMensajes(nuevoMensaje)
        logger.info("el mensaje se guardo en el file!")
        res.redirect("/mensajes")
    }
    catch(error){
        loggerErrorFile.error(`ERROR = ${error}`)
    }
})

module.exports = router;