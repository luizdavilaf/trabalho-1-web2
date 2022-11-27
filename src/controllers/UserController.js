const db = require('../database/dbconnection');
const { User } = require('../models/User');

const verifyPassordLength = (password) =>{
    if(password.length<6){
        throw new Error("O campo senha deve ter pelo menos 6 caracteres!")        
    }
}

const create = async (req, res) => {
    var userObj = {}
    if (req.body.name != undefined) {
        userObj.name = req.body.name
        if (req.body.email != undefined) {
            userObj.email = req.body.email
            if (req.body.cpf != undefined) {
                userObj.cpf = req.body.cpf
                if (req.body.password != undefined) {
                    userObj.password = req.body.password
                    if (userObj.password.length < 6) {
                        res.status(400).send("O campo senha deve ter pelo menos 6 caracteres!");
                    } else {
                        if (req.body.img_url != undefined) {
                            userObj.img_url = req.body.img_url
                        }
                    }
                } else {
                    res.status(400).send("O campo senha não pode ser vazio!");
                }
            } else {
                res.status(400).send("O campo cpf não pode ser vazio!");
            }
        } else {
            res.status(400).send("O campo email não pode ser vazio!");
        }
    } else {
        res.status(400).send("O campo nome não pode ser vazio!");
    }
    await User.create(userObj)
        .then((user) => {
            res.status(200).send({ status: "Usuário criado...", data: user });
        })
        .catch((err) => {
            if (err.errors[0].message.includes("must be unique")){
                err.mensagem = err.errors[0].message.replace("must be unique", "já existente")                
            }else{
                err.mensagem = ""
            }
            res.status(500).send({ msg: "Ocorreu um erro na criação do usuário... Tente novamente!", 
            err: "" + err.mensagem });
        })
}

const listAll = async (req, res) => {
    await User.findAll({
        attributes: {
            exclude: ['password', 'created_at']
        }
    }).then((users)=>{
        //res.render('users-list', { users: users })
        res.status(200).send({ users: users });
    }) 
    .catch((err)=>{
        res.status(500).send({
            msg: "Ocorreu um erro ao buscar usuários... Tente novamente!",
            err: "" + err
        });        
    })      
}

const detailByCpf = async (req, res) => {
    
    const  cpf  = req.params;
    await User.findOne({where:  cpf }).then((user) => {
        res.status(200).send({ user: user });
        //return res.render('users-detail', { user });
    })
        .catch((err) => {
            res.status(500).send({
                msg: "Ocorreu um erro ao buscar o usuário... Tente novamente!",
                err: "" + err
            });
        })   


}


class UserController {
    constructor() {
        console.log('Iniciando o user controller');
    }

    /* renderAdd(req, res) {
        return res.render('users-insert');
    } */

    

    /* delete(req, res) {
        // users/delete/:id
        const { id } = req.params;
        const sql = 'DELETE FROM users WHERE users.id = ?';
        db.run(sql, [id], (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send("ERRO AO EXCLUIR");
            }
            return res.redirect('/users');
        })
    }

  

    
        
     */
}

module.exports = {
    UserController, 
    create,
    listAll,
    detailByCpf
};