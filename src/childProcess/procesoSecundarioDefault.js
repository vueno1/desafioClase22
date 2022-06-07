const ContenedorRandomNumeros = require('../api/ContenedorRandomNumeros')
const misRandomNumeros = new ContenedorRandomNumeros()

console.log("//////PROCESO SECUNDARIO////")
console.log("parametro x default", process.pid)
try {
    process.on("message", async (cantidadXDefault) =>{
        await misRandomNumeros.generarNumerosRandom(cantidadXDefault)
        const numerosPorDefault = await misRandomNumeros.mostrarRandom()
        process.send(numerosPorDefault)
        process.exit()
    })
}
catch(error) {
    console.log(error.message)
}

