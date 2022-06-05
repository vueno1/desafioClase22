const knex = require("knex")
//knex es una libreria que nos permite hacer queries a la base de datos de MariaDB.

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

    async crearTabla(){
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

    async mostrarTodo () {
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

    async guardar (nuevoObjeto) {
        try{
            return await this.knex("productos").insert(nuevoObjeto)
        }
        catch (error) {
            console.log(error)
        }       
    }     
}