const express = require('express')
const router = express.Router()
const { fork } = require('child_process')

router.get("/api/randoms", async (req,res) =>{
    try {
        const cantidad = req.query.cantidad
        const cantidadXDefault = 500000000
        
        if(cantidad){            
            const child = fork('src/childProcess/procesoSecuandario.js')
            child.send(cantidad)
            child.on('message', (numeros) => {
                console.log(numeros)
                res.json(numeros)
            })                                 
        } else {
            const child = fork('src/childProcess/procesoSecundarioDefault.js')
            child.send(cantidadXDefault)
            child.on('message', (numerosPorDefault) => {
                console.log(numerosPorDefault)
                res.json(numerosPorDefault)
            })            
        }


        // child.send(cantidad)

        // child.on("numeros", (numeros) =>{
        //     console.log(numeros)            
        //     res.json(numeros)
        // })   
    }   
    catch(error) {
        console.log(error.message)
    }
})

module.exports = router;