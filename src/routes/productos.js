const express = require('express')
const router = express.Router()
const ContenedorProductos = require("../api/ContenedorProductos")
const { mariaDB } = require("../options/mariaDB")
const productosEnDB = new ContenedorProductos(mariaDB)

router.post("/productos", async (req,res) =>{
    try{
        const {nombre, precio, url} = await req.body
        const producto = {
            nombre,
            precio,
            url
        }
        await productosEnDB.guardar(producto)
        console.log("se guardo producto en mariaDB")
        res.redirect("/index")
    }
    catch(error){
        console.log(error.message)
    }
})

// router.get("/productos", async (req, res) => {
//     try {
//         const productos = await productosEnDB.mostrarTodo()
//         console.log(productos)
//         res.render("tabla", {
//             productos:productos 
//         })
//     }
//     catch (error) {
//         console.log(error.message)
//     }
// })

module.exports = router;