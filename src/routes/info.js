const express = require('express')
const router = express.Router()


router.get("/info", async (req, res )=>{
    try{
        const argumentosDeEntrada = process.argv.slice(3)
        const pathDeEjecucion = process.cwd()
        const nombreDePlataforma = process.platform
        const versionDeNode = process.version
        const processId = process.pid
        const rss = process.memoryUsage().rss
        const carpetaDelProyecto = process.cwd()

        res.render("info", {
            argumentosDeEntrada,
            pathDeEjecucion,
            nombreDePlataforma,
            versionDeNode,
            processId,
            rss,
            carpetaDelProyecto  
        })
    }
    catch(error){
        console.log(error.message)
    }
})

module.exports = router;