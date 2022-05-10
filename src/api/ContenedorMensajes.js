const knex = require("knex");

module.exports = class ContenedorMensajes {
    
    constructor (config) {
        this.config = config;
        this.knex = knex(config)
    } 

    async mostrarTablas () {
        try {
            return await this.knex('mensajes').select('*');
        }
        catch (error) {
            console.log(error)
        }
    }  

    async createTable(){
        try {
            //verificar si la tabla existe.
            const tablaExiste = await this.knex.schema.hasTable('mensajes')
            if(!tablaExiste){

            return await this.knex.schema.createTable('mensajes', table => {
                table.string("horario");
                table.string('mail');
                table.string('mensaje');
                
            })
        }
        }
        catch (error) {
            console.log(error)
        }         
    }    

    async getAll () {
        try{
            return await this.knex("mensajes").select()
        }
        catch (error) {
            console.log(error)
        }
    }

    async save (nuevoObjeto) {
        try{
            return await this.knex("mensajes").insert(nuevoObjeto) 
        }
        catch (error) {
            console.log(error)
        }
    }     
}