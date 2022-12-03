const db = require("../database/dbconnection");
const { User } = require('../models/User');
const { Post } = require('../models/Post');
const { Image } = require('../models/Image');
const sequelize = require("../database/sequelize-connection");
const { Sequelize } = require("sequelize");

const renderAdd = (req, res) => {
    return res.render("post-insert");
}

const renderAddImage = (req, res) => {
    return res.render("insert-post-img");
}
/**
 * Verifica se o id do post está no array de posts
 * @param {Array} posts array de posts
 * @param {Integer} postid id do post
 * @returns o indice do array se o post esta presente ou -1 se não está
 */
const getIndexOfPost = (posts, postid) => {
    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id == postid) {
            return i;
        }
    }
    return -1;
};


const create = (req, res) => {
    var title;
    var description;
    var user = req.session.user
    const now = new Date().toISOString();

    if (req.body.title != undefined) {
        title = req.body.title;
    } else {
        return res.status(500).send("Não pode publicar post sem título!");
    }

    if (req.body.description != undefined) {
        description = req.body.description;
    } else {
        return res.status(500).send("Não pode publicar post sem texto!");
    }

    if (!user) {
        return res.status(500).send("Usuário não encontrado");
    }

    Post.create(
        {
            userId: user.id,
            title: title,
            description: description
        }
    ).then((post) => {
        console.log(post)
        const postid = post.id
        res.render("insert-post-img", { postid, post });
    }).catch((error) => {
        console.log(error)
        res.status(500).send(error);
    })


}

const insertImages = (req, res) => {
    var postid = parseInt(req.params.postid)
    var post = req.body.post


    var errors = []
    var imagesInserted = []

    if (req.body.images != undefined) {
        const images = req.body.images
        images.forEach((image) => {
            var link = image.toString()
            if (link) {
                Image.create({ link: link, postId: postid, })
                    .then((imageInsert) => {
                        imagesInserted.push(imageInsert)
                    })
                    .catch((err) => {
                        errors.push(err)
                    })
            }
        })
        Promise.all([imagesInserted])
            .then(() => {
                return res.redirect("/posts/" + postid);
            }).catch((error) => {
                res.status(500).send({ error: error, errors: errors });
            })





    }
}

const deleteById = (req, res) => {
    const { id } = req.params;
    let user = undefined
    if (req.session.user) {
        user = req.session.user.id
    }
    Post.findOne({ where: { id: id } })
        .then((post) => {
            if (user != undefined && post.userId == user) {
                Post.destroy({ where: { id: id } })
                    .then((result) => {
                        res.status(200).send('<script>alert("Post Excluido!"); window.location.href = "/"; </script>');
                    })
            } else {
                res.status(400).send('<script>alert("Post não pode ser excluído por você"); window.location.href = "/"; </script>');
            }
        }).catch((err) => {
            console.log(err)
            res.status(500).send('<script>alert("Ops! Ocorreu um erro ao excluir o post"); window.location.href = "/"; </script>');
        })
}

const deleteImages = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM images WHERE images.id = ?";
    db.run(sql, [id], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send("ERRO AO EXCLUIR");
        }
        return res.redirect("/posts");
    });
}

const deletePostImages = (id) => {


    const sql = "DELETE FROM images WHERE images.post = ?";
    db.run(sql, [id], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send("ERRO AO EXCLUIR");
        }
    });
}
/**
 * Utilizada na versão sem ORM para incluir as imagens de um post no JSON
 * @param {*} rows 
 * @returns 
 */
const appendImages = (rows) => {
    var posts = rows.slice(0);
    var lastPostsPaginated = [];
    for (let i = 0; i < posts.length; i++) {
        var index = getIndexOfPost(lastPostsPaginated, posts[i].id);
        if (index == -1) {
            var images = [];
            posts[i].created_at = new Date(posts[i].created_at)
            if (posts[i].link != null) {
                images.push(posts[i].link);
            }
            posts[i].images = images;
            lastPostsPaginated.push(posts[i]);
        } else {
            if (posts[i].link != undefined) {
                lastPostsPaginated[index].images.push(posts[i].link);
            }
        }
    }
    return lastPostsPaginated
}

const list = (req, res) => {
    var limit
    var lastPostsPaginated = []
    var page
    if (req.query.limit != undefined && req.query.page != undefined) {
        var limit = parseInt(req.query.limit)
        var page = parseInt(req.query.page)
    } else {
        limit = 5
        page = 1
    }
    var total
    var totalPages
    var previous = page - 1
    var next = page + 1
    if (req.query.title != undefined) {
        var postTitle = "%" + req.query.title + "%"
    }
    var skip = -1
    if (page > 1) {
        skip = limit * (page - 1)
    }

    if (postTitle != undefined) {
        Post.findAndCountAll({
            where: { title: { [Sequelize.Op.like]: postTitle } },
            limit: limit,
            offset: skip,
            include: [{
                model: Image,
                required: false,
                separate: true
            }, {
                model: User,
                attributes: ['name'],
            }],
            order: sequelize.literal('post.createdAt DESC'),
            /* subQuery: false, */
        })
            .then((result) => {
                lastPostsPaginated = result.rows
                totalPages = parseInt(Math.ceil(result.count / limit))
                res.render("post-list", { lastPostsPaginated, page, limit, total, totalPages, previous, next });
            }).catch((err) => {
                res.status(500).send({
                    success: false,
                    err: "" + err
                })
            })
    } else {
        Post.findAndCountAll({
            limit: limit,
            offset: skip,
            include: [{
                model: Image,
                required: false,
                separate: true
            }, {
                model: User,
                attributes: ['name'],
            }],
            order: sequelize.literal('post.createdAt DESC'),
            subQuery: false,
        })
            .then((result) => {
                lastPostsPaginated = result.rows
                totalPages = parseInt(Math.ceil(result.count / limit))
                res.render("post-list", { lastPostsPaginated, page, limit, total, totalPages, previous, next });
            }).catch((err) => {
                res.status(500).send({
                    success: false,
                    err: "" + err
                })
            })
    }
}

const listHomePage = (req, res) => {
       
    Post.findAll({
        include: [{
            model: Image,
            required: false,
            separate: true
        }, {
            model: User,
            attributes: ['name'],
        }],
        limit: 5,
        order: sequelize.literal('post.createdAt DESC')
    }).then((posts) => {
       
        var lastFivePosts = posts
        res.render('home', { lastFivePosts, user: req.session.user });
    }).catch((err) => {
        res.send((err))
    })
    

}

const detail = async (req, res) => {

    const id = req.params.id;

    Post.findOne({
        where: { id },
        include: [{
            model: Image,
            required: false,
        }, {
            model: User,
            attributes: ['name']
        }]
    }).then((post) => {
        res.status(200).render("post-detail", { post, user: req.session.user });
    }).catch((err) => {
        res.status(500).send({
            success: false,
            err: "" + err
        })
    })

}

const getEdit = (req, res) => {
    const { id } = req.params;
    let user = undefined
    if (req.session.user) {
        user = req.session.user.id
    }
    Post.findOne({ where: { id: id } })
        .then((post) => {
            if (user != undefined && post.userId == user) {
                return res.render("post-edit", { post });
            } else {
                res.status(400).send({ msg: "Este post não pode ser editado por você" });
            }

        }).catch((err) => {
            res.status(500).send({ error: "" + err });
        })
}

/**
 * Edita os atributos do post e busca as imagens do post para o usuário editar na proxima pagina
 * @param {*} req 
 * @param {*} res 
 */
const editPost = (req, res) => {
    const id = Number(req.params.id)

    let values = {
        title: req.body.title || "Sem título",
        description: req.body.description || "Sem conteúdo"
    }

    Post.update(
        values,
        { where: { id: id } }
    )
        .then((update) => {
            console.log(update)
            Image.findAll({ where: { postId: id } })
                .then((images) => {
                    for (let i = 0; i < 5; i++) {
                        if (!images[i]) {
                            var image = {}
                            image.link = ""
                            image.id = 0
                            images.push(image)
                        }
                    }
                    return res.render("edit-img", { images });
                }).catch((err) => {
                    res.status(500).send({ error: err });
                })
        }).catch((err) => {
            res.status(500).send({ error: err });
        })
}

/**
 * edita as imagens de um post
 * @param {Array} req.body.images 
 * @param {*} res 
 * @returns 
 */
const editImages2 = (req, res) => {
    var postid
    if (req.body.images != undefined) {
        var images = req.body.images
        if (images[0].post) {
            postid = images[0].post
        }
        
        try {
            for (let i = 0; i < images.length; i++) {
                var imgLink = images[i].link
                const id = images[i].id
                const params = { link: imgLink }
                if (imgLink && id != 0) {
                    Image.update(params,
                        {
                            where: { id: id }
                        }).then().catch((err) => {
                            throw new Error(err)
                        })
                }
                if (imgLink != "" && id == 0) {
                    Image.create({
                        postId: postid,
                        link: imgLink
                    }).then().catch((err) => {
                        throw new Error(err)
                    })
                }
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }

        if (postid) {

            return res.redirect("/posts/" + postid);
        }
        return res.redirect("/")
    }
}


module.exports = {    
    renderAdd,
    getIndexOfPost,
    renderAddImage,
    create,
    insertImages,
    deleteImages,
    deletePostImages,
    appendImages,
    list,
    listHomePage,
    detail,
    deleteById,
    getEdit,
    editPost,
    editImages2,

}
