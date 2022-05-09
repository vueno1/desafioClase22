const knex = require("knex")

module.exports = class ContenedorProductos {
    
    constructor (config) {
        this.config = config; // configuracion de la base de datos
        this.knex = knex(config) // conexion a la base de datos
    } 

    async mostrarTablas () {
        try {
            if(this.knex)
            return await this.knex('productos').select('*');
        }
        catch (error) {
            console.log(error)
        }
    }  

    async createTable(){
        try {            
            return await this.knex.schema.createTable('productos', table => {
                table.increments('id').primary();
                table.string('nombre');
                table.string('precio');
                table.string('url')
            })

        }
        catch (error) {
            console.log(error)
        }         
    }    

    async getAll () {
        try {
            return await this.knex("productos").select()
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
}