const ContenedorRandomNumeros = require('../api/ContenedorRandomNumeros')
const misRandomNumeros = new ContenedorRandomNumeros()


const log4js = require("../logs/log4js")
const logger = log4js.getLogger()
const loggerwarnFile = log4js.getLogger("archivo");

logger.info("//////PROCESO SECUNDARIO////")
logger.info("parametro x req.query", process.pid)

try {
    process.on ('message', async (cantidad) => {    
        await misRandomNumeros.generarNumerosRandom(cantidad)
        const numeros = await misRandomNumeros.mostrarRandom()
        process.send(numeros)    
        process.exit()   
    })
}
catch(error) {
    loggerwarnFile.warn(`WARNING = ${error}`)
}


