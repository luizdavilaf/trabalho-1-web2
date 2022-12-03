const db = require('../database/dbconnection');
const { User } = require('../models/User');

const renderLogin = (req, res) => {
    return res.render("login");
}

const login = async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    await User.findOne({ where: { email: email } })
        .then((user1) => {
            if (!user1) {
                return res.status(400).send('<script>alert("Usuário nao encontrado"); window.location.href = "/users/login"; </script>');
            }
            if (password != user1.password) {
                return res.status(400).send('<script>alert("Senha Invalida!"); window.location.href = "/users/login"; </script>');

            } else {
                req.session.user = { id: user1.dataValues.id, name: user1.dataValues.name, email: user1.dataValues.email }
               
                //res.status(200).send({ msg: "logado..." });
                //res.send('<script>alert("Logado..."); window.location.href = "/"; </script>')
                res.redirect('/')
            }

        })
        .catch((err) => {
            console.log(err)
            res.status(500).send(
                '<script>alert("Ocorreu um erro efetuar o login Verifique seus dados!"); window.location.href = "/users/login"; </script>'
            );
        })



}


module.exports = {
    login,
    renderLogin
}