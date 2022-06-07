const ContenedorRandomNumeros = require('../api/ContenedorRandomNumeros')
const misRandomNumeros = new ContenedorRandomNumeros()

console.log("//////PROCESO SECUNDARIO////")
console.log("parametro x req.query", process.pid)

try {
    process.on ('message', async (cantidad) => {    
        await misRandomNumeros.generarNumerosRandom(cantidad)
        const numeros = await misRandomNumeros.mostrarRandom()
        process.send(numeros)    
        process.exit()   
    })
}
catch(error) {
    console.log(error.message)
}


