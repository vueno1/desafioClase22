module.exports = class ContenedorRandomNumeros {
    constructor () {
        this.Random = {}
    }

    async mostrarRandom () {
        try {
            return this.Random
        }
        catch (error) {
            console.log(error)
        }
    }

    async generarNumerosRandom(cantidad) {
        try {
            const min = 1
            const max = 1000

            for (let i = 0; i < cantidad; i++) {

                //numero random entre 1 y 1000 con el 1 incluido.
                let numeroRandom = Math.floor(Math.random()* (max - min) + min)

                if(this.Random[numeroRandom]) {
                    this.Random[numeroRandom]++                  
                }
                else {
                    this.Random[numeroRandom] = 1         
                }
            }
            return this.Random          
        }
        catch (error) {
            console.log(error)
        }
    }
}