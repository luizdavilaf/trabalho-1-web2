const isAdmin = (req, res, next) => {
    if (req.session.user?.type !== 'ADMIN') {
        return res.status(403).send(`NAO PODE ACESSAR - nao eh admin`);
    }
    next();
    // if (req.query.key == "CHAVE")
}

module.exports =  isAdmin;