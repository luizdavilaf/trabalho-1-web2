const isAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.render("must-login");
    }
    next();
    
}

module.exports =  isAuth;