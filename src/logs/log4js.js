const log4js = require('log4js');

//ruta y metodos todas las peticiones recibidas x el servidor (info)
//ruta y metodos de las peticiones a rutas inexistentes en el servidor(warning)
//errores lanzados por las apis de mensajes y productos, unicamente (error)

// Loggear todos los niveles a consola (info, warning y error)
// Registrar sólo los logs de warning a un archivo llamada warn.log
// Enviar sólo los logs de error a un archivo llamada error.log

log4js.configure({
    appenders: {
        loggerConsole: {type: "console"},
        miLoggerFile: {type:"file",  filename: "warn.log"},
        miLoggerFile2: {type: "file", filename: "error.log"}    
    },

    //niveles 
    // trace 
    // debug 
    // warn 
    // info  
    // error  


    categories: {   
        default: { 
            appenders: ["loggerConsole"], 
            level: "trace" 
        },

        consola: { 
            appenders: ["loggerConsole"], 
            level: "debug" 
        },

        archivo: { 
            appenders: ["miLoggerFile"], 
            level: "warn" 
        },

        archivo2: { 
            appenders: ["miLoggerFile2"], 
            level: "error" 
        },

        todos: { 
            appenders: ["loggerConsole", "miLoggerFile"], 
            level: "error" 
        }
    }
})

module.exports = log4js