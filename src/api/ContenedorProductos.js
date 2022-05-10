const knex = require("knex")
const {faker} = require("@faker-js/faker")

module.exports = class ContenedorProductos {
    
    constructor (config) {
        this.config = config; // configuracion de la base de datos
        this.knex = knex(config) // conexion a la base de datos
    } 

    async mostrarTablas () {
        try {
            //validar si productos existe
            const existe = await this.knex.schema.hasTable('productos')
            if(existe){
            return await this.knex('productos').select('*');
            }else{
                return 0;
            }

        }
        catch (error) {
            console.log(error)
        }
    }  

    async createTable(){
        try { 
            //validar si productos existe
            const existe = await this.knex.schema.hasTable('productos')
            if(existe){
                return await this.knex.schema.dropTable('productos')
            }else{
            return await this.knex.schema.createTable('productos', table => {
                table.increments('id').primary();
                table.string('nombre');
                table.string('precio');
                table.string('url')
            })
        }
        }
        catch (error) {
            console.log(error)
        }         
    }    

    async getAll () {
        try {
            //validar si productos existe
            const existe = await this.knex.schema.hasTable('productos')
            if(existe){
                return await this.knex('productos').select('*');
            }else{
            return await this.knex("productos").select()
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    async save (nuevoObjeto) {
        try{
            return await this.knex("productos").insert(nuevoObjeto)
        }
        catch (error) {
            console.log(error)
        }       
    } 
    
    // async getRandom () {
    //     try {
    //         //validar si productos existe
    //         // const existe = await this.knex.schema.hasTable('productos')
    //         // if(existe){
    //             const productosAleatorios  = []
    //             for(let i=0; i<5; i++) {
    //                 const producto = {
    //                     nombre: faker.commerce.productName(),
    //                     precio: faker.commerce.price(),
    //                     foto: faker.image.image()
    //                 }
    //                 productosAleatorios.push(producto)
    //             }
    //         // }else{
    //         //     return await this.knex("productos").select()
    //         // }
    //         return productosAleatorios
    //     }
    //     catch (error) {
    //         console.log(error)
    //     }
    // }

    
}