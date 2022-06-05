require("dotenv").config()  

// console.log(process.argv)
// const parseArgs = require("minimist")
// //cosas a tener en cuenta: 
// //tenemos que pasar desde donde hay que empezar a tomar argumentos. 
// //process.argv → 0: node (npm)
//     //1: nombre del archivo (index.js)
//     //ejemplo: cuando hacemos npm index.js o nodemon index.js 

//     //desde la posicion 2 es donde nos interesa la veradera informacion.
//     //metodo slice nos permite hacer una copia de un arreglo, desde una posicion 
//     //en este caso 2
//     //y nos devuelve un nuevo arreglo. 
// const args = parseArgs(process.argv.slice(2))
// console.log(args)

// //funcion para leer puerto desde linea de comandos 
function param(p) {
    //posicion de ese parametro 
    //process.argv es un array de strings
    //useo el indexOf para saber la posicion del parametro.
    const index = process.argv.indexOf(p)

    //mostrar el index + 1 
    return process.argv[index + 3]
}

const PORT = param("--port")

//npm = C:\Program Files\nodejs\node.exe
//start = C:\Users\Usuario\Documents\programacion\Backend\desafios\desafioClase26\server.js
//index +2 = --port
//index +3 = 8080

module.exports = {
    PORT: PORT || 3000,
    MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017/"
}
