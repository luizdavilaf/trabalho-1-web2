const db = require('../database/dbconnection');
const { User } = require('../models/User');

const renderLogin = (req, res) => {
    return res.render("login");
}

const login = async (req, res) =>{
   
    const email = req.body.email;
    const password = req.body.password;
   
    await User.findOne({ where: {email: email }})
    .then((user) => {
        if(password!=user.password){
            res.status(400).send({
                msg: "Senha Inválida!",                
            });
              
        }else{
            req.session.user = user
            //console.log(user)
            //res.status(200).send({ msg: "logado..." });
            res.redirect('/')
        }
        
    })
        .catch((err) => {
            res.status(500).send({
                msg: "Ocorreu um erro ao buscar o usuário... Verifique o email cadastrado",
                err: "" + err
            });
        })



}


module.exports = {
    login,
    renderLogin
}