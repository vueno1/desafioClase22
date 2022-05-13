const socket = io.connect()
const productosDiv = document.getElementById('productos')
const formulario = document.getElementById("miFormulario")
const productosAleatoriosDiv = document.getElementById('productosAleatorios')

formulario.addEventListener("submit", e =>{
    e.preventDefault()
    const producto = {
        nombre: formulario.nombre.value,
        precio: formulario.precio.value,
        url: formulario.url.value
    }
    socket.emit("nuevoIngreso", producto)
    formulario.reset()
})

socket.on("productos", async (data) =>{
    const response = await fetch("views/tabla.hbs")
    let template = response.text()
    const string = await template
    const plantilla = Handlebars.compile(string)
    const html = plantilla({data})
    productosDiv.innerHTML = html
})

//con window.onload me traigo los productos aleatorios 
//que vienen de la ruta "http://localhost:8080/api/productos-test" 
//con el fetch y el template imprimo mi info en la pagina.
window.onload = async () =>{

    //con fetch traigo la data de la api.
    const response = await fetch ("http://localhost:8080/api/productos-test")
    const data = await response.json()

    //traer info para enviarlo x sockets
    const fetchProductosAleatorios = await fetch("views/productosAleatorios.hbs")
    let template = fetchProductosAleatorios.text()
    const string = await template
    const plantilla = Handlebars.compile(string)
    const html2 = plantilla({data})
    productosAleatoriosDiv.innerHTML = html2
}




// const formularioMensajes = document.getElementById("formularioMensajes")
// const muestraDeMensajes = document.getElementById("mensajes")

// formularioMensajes.addEventListener("submit", e =>{
//     e.preventDefault()

//     const mensajeIngreso = {
//        mail: formularioMensajes.mail.value,
//        mensaje: formularioMensajes.mensaje.value
//     }

//     //envio el objeto al servidor
//     socket.emit("mensajeIngreso", mensajeIngreso)

//     //se resetea el formulario
//     formularioMensajes.reset()
// })

// socket.on("mensajes", async (data) =>{
//    const response = await fetch("views/mensajes.hbs")
//    let template = response.text()
//    const string = await template
//    const plantilla = Handlebars.compile(string)
//    const html = plantilla({data})

//    muestraDeMensajes.innerHTML = html
// })