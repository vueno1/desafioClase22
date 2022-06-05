const express = require('express')
const router = express.Router()
const ContenedorMensajes = require("../api/ContenedorMensajesNew")
const mensajesEnFile = new ContenedorMensajes()

router.get("/index", async (req,res) =>{
    try{
        const mensaje = await mensajesEnFile.mostrarMensajes()
        console.log(`estos son mis mensajes ${mensaje}`)
        res.render("index", {
            mensajes: mensaje
            })
    }
    catch(error){
        console.log(error.message)
    }
})

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
        mensajesEnFs.guardarMensajes(nuevoMensaje)
        res.redirect("/index")
    }
    catch(error){
        console.log(error.message)
    }
})

module.exports = router;