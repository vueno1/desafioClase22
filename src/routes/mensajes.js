const express = require('express')
const router = express.Router()
const ContenedorMensajes = require("../api/ContenedorMensajesNew")
const mensajesEnFile = new ContenedorMensajes()
const moment = require("moment")

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
        console.log("el mensaje se guardo en el file")
        res.redirect("/mensajes")
    }
    catch(error){
        console.log(error.message)
    }
})

module.exports = router;