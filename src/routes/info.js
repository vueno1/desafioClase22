const express = require('express')
const router = express.Router()
const numCPUs = require('os').cpus().length

// const compression = require('compression')
// router.use(compression()) 

const log4js = require("../logs/log4js")
const logger = log4js.getLogger()
const loggerwarnFile = log4js.getLogger("archivo");

router.get("/info", async (req, res )=>{
    try{
        const processArgv = process.argv
        const argumentosDeEntrada = process.argv.slice(3)
        const pathDeEjecucion = process.cwd()
        const nombreDePlataforma = process.platform
        const versionDeNode = process.version
        const processId = process.pid
        const rss = process.memoryUsage().rss
        const carpetaDelProyecto = process.cwd()
        const procesadores = numCPUs
        
        logger.info({
            argumentos: argumentosDeEntrada,
            pathEjeucion: pathDeEjecucion,
            plataforma: nombreDePlataforma,
            version: versionDeNode,
            id: processId,
            rss: rss,
            carpetaProyecto: carpetaDelProyecto, 
            numeroProcesadores: procesadores,
            processArv: processArgv 
        })
    
        res.sendStatus(200)          
       
    }
    catch(error){
        loggerwarnFile.warn(`ERROR = ${error}`)
    }
})


module.exports = router;