//middleware para cerrar sesion si la sesion esta abierta

const logout = {
    logout: (req, res, next) => {
        if(!req.session.nombre){
            res.redirect("/")
        }
        next()
    }
}

module.exports = logout