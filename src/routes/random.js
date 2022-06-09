const express = require('express')
const router = express.Router()
const { fork } = require('child_process')

router.get("/api/randoms", async (req,res) =>{
    try {
        const cantidad = req.query.cantidad || 500000000 
                  
        const child = fork('src/childProcess/procesoSecuandario.js')
        child.send(cantidad)
        child.on('message', (numeros) => {
            console.log(numeros)
            res.json(numeros)
        })                                 
    }   
    catch(error) {
        console.log(error.message)
    }
})

module.exports = router;