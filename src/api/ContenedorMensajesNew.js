const fs = require("fs")
const ruta = "./mensajes.txt"

module.exports = class ContenedorMensajesNew {
    
    constructor () {
        this.mensajes = []
    }    

    async mostrarMensajes () {

        try{
            const mensajesEnFile = fs.readFileSync(ruta, "utf8")
            if(mensajesEnFile.length === 0) return "no hay mensajes"

            const parseoMensajes = JSON.parse(mensajesEnFile)
            return parseoMensajes         
        }
        catch (error) {
            console.log(error)
        }
    }

    async guardarMensajes (mensaje) {
        try{
            const mensajesEnFile = fs.readFileSync(ruta, "utf8")
            if(mensajesEnFile.length === 0) {
                this.mensajes.push(mensaje) 
                fs.writeFileSync(
                ruta,
                JSON.stringify(this.mensajes, null, 2),
                )
                return this.mensajes
                }
            else {
                const parseoMensajes = JSON.parse(mensajesEnFile)
                parseoMensajes.push(mensaje)
                fs.writeFileSync(
                ruta,
                JSON.stringify(parseoMensajes, null, 2),
                )
                return parseoMensajes
            }    
        }
        catch (error) {
            console.log(error)
        }
    }     
}