const db = require('../database/dbconnection');
const { User } = require('../models/User');
const sequelize = require("../database/sequelize-connection");
const { Image } = require('../models/Image');
const { Like } = require('../models/Like');
const { Comment } = require('../models/Comment');
const { Sequelize } = require("sequelize");
const { Post } = require('../models/Post');


const renderAdd = (req, res) => {
    return res.render("user-sign");
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
                    throw new Error("O campo senha não pode ser vazio!")
                }
            } else {
                throw new Error("O campo cpf não pode ser vazio!");
            }
        } else {
            throw new Error("O campo email não pode ser vazio!");
        }
    } else {
        throw new Error("O campo nome não pode ser vazio!");
    }
    await User.create(userObj)
        .then((user) => {
            res.status(200).send('<script>alert("Usuário criado!"); window.location.href = "/"; </script>');
        })
        .catch((err) => {
            if (err.errors[0].message.includes("must be unique")) {
                err.mensagem = err.errors[0].message.replace("must be unique", "já existente")
            } else {
                err.mensagem = err.message
            }
            res.status(400).send('<script>alert("Ocorreu um erro na criação do usuário"); window.location.href = "/users"; </script>')

        })
}

const listAll = async (req, res) => {
    await User.findAll({
        attributes: {
            exclude: ['password', 'created_at']
        }
    }).then((users) => {
        //res.render('users-list', { users: users })
        res.status(200).send({ users: users });
    })
        .catch((err) => {
            res.status(500).send({
                msg: "Ocorreu um erro ao buscar usuários... Tente novamente!",
                err: "" + err
            });
        })
}

const detailByUsername = async (req, res) => {
    var order = 'post.createdAt DESC'
    if (req.query.order != undefined) {
        order = 'likeCount DESC'
    }
    const name = req.params.username;

    await User.findOne({
        where: {
            name: { [Sequelize.Op.like]: name }
        },
        raw: true,
        attributes: ['id', 'name']
    })
        .then((user) => {
            Post.findAll({
                subQuery: false,
                raw: true,
                nest: true,
                where: { userId: user.id },
                attributes: {
                    include: [[sequelize.fn('COUNT', sequelize.col('likes.postId')), 'likeCount']]
                },
                include: [
                    {
                        model: User,
                        attributes: ['name', 'id'],                        
                    },
                    {
                        model: Like,
                        attributes: [],
                        duplicate: false,
                    },
                    {
                        model: Image,
                        
                    }
                    ],
                group: 'post.id',
                order: sequelize.literal(order),
            })
                .then((posts) => {
                    //console.log(posts)
                    res.render('user-detail', {
                        posts: posts,
                        user: { id: user.id, name: user.name }
                    });
                })
        })
        .catch((err) => {
            res.status(500).send({
                msg: "Ocorreu um erro ao buscar o usuário...",
                err: "" + err
            });
        })


}


const deleteByCpf = async (req, res) => {

    const cpf = req.params;
    await User.destroy({ where: cpf }).then((user) => {
        res.status(200).send({ msg: "Usuário excluído!", user: user });
        //return res.render('users-detail', { user });
    })
        .catch((err) => {
            res.status(500).send({
                msg: "Ocorreu um erro ao excluir o usuário... Tente novamente!",
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




}

module.exports = {
    UserController,
    renderAdd,
    deleteByCpf,
    create,
    listAll,
    detailByUsername
};