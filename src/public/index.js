const socket = io.connect()
const productosDiv = document.getElementById('productos')
const formulario = document.getElementById("miFormulario")

//recibo el Bienvenido y lo muestro x consola (nav)
// socket.on("mensaje", data =>{
//     console.log(data)
// })

formulario.addEventListener("submit", e =>{
    e.preventDefault()

    //al hacer submit, ingreso los valores y creo el objeto
    const producto = {
        nombre: formulario.nombre.value,
        precio: formulario.precio.value,
        url: formulario.url.value
    }

    //envio el objeto al servidor
    socket.emit("nuevoIngreso", producto)

    //se resetea el formulario
    formulario.reset()
})

//el cliente recibe el array completo y lo muestra x consola
socket.on("productos", async (data) =>{

    //con fetch traemos la info de views.
    const response = await fetch("views/tabla.hbs")

    //con text() extrae un string de views/tabla.hbs
    //pero, es aun es una promesa.
    let template = response.text()

    //hago otro await para que me traiga el string
    const string = await template
    console.log(typeof(string))

    //handlebars compila mi string a formato HTML
    const plantilla = Handlebars.compile(string)

    //uso la info que me viene de data para completar los datos en mi HTML
    const html = plantilla({data})

    //imprimo en mi div de mi index.html
    productosDiv.innerHTML = html

})

//------------------------------------------------------------

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