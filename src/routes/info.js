const express = require('express')
const router = express.Router()
const numCPUs = require('os').cpus().length


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

        res.render("info", {
            argumentosDeEntrada,
            pathDeEjecucion,
            nombreDePlataforma,
            versionDeNode,
            processId,
            rss,
            carpetaDelProyecto, 
            procesadores,
            processArgv  
        })
    }
    catch(error){
        console.log(error.message)
    }
})

module.exports = router;