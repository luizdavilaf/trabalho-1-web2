const db = require("../database/dbconnection");
class PostController {
    constructor() {
        console.log("Iniciando o post controller");
    }

    renderAdd(req, res) {
        return res.render("post-insert");
    }

    renderAddImage(req, res) {
        return res.render("insert-post-img");
    }
    
    getIndexOfPost = (posts, postid) => {
        for (let i = 0; i < posts.length; i++) {
            if (posts[i].id == postid) {
                return i;
            }
        }
        return -1;
    };

    groupBy = function (list, key) {
        return list.reduceRight(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);

            return rv;
        }, {});
    };

    create(req, res) {
        var title;
        var description;
        var author;
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

        if (req.body.author != undefined) {
            author = req.body.author;
        } else {
            return res.status(500).send("Não pode publicar post sem autor!");
        }

        const params = [title, description, author, now];
        const sql =
            "INSERT INTO post (title, description, author, created_at) VALUES (?, ?, ?, ?)";
        try {
            db.run(sql, params, function (err) {
                if (err) {
                    console.log(err);
                    throw new Error(err);
                }
                var postid = this.lastID
                console.log(postid)
                return res.render("insert-post-img",  {postid}  );                
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    }

    insertImages(req, res) {       
        var postid = req.params.postid        
        const sql =
            "INSERT INTO images (post, link) VALUES (?, ?)";
        if(req.body.images!=undefined){
            const images = req.body.images            
            try {
                for(let i=0; i<images.length;i++){
                    var link = images[i].toString()
                    
                    const params = [postid, link];
                    if(link){
                        db.run(sql, params, function (err) {
                            if (err) {
                                console.log(err);
                                throw new Error(err);
                            }
                        });
                    }
                }
            } catch (error) {
                console.log(error);
                return res.status(500).send(error);
            }
            return res.redirect("/posts/" + postid);
        }
    }

    delete(req, res) {
        // users/delete/:id
        const { id } = req.params;
        const sql = "DELETE FROM post WHERE post.id = ?";
        db.run(sql, [id], (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send("ERRO AO EXCLUIR");
            }
           
            return res.redirect("/posts");
        });
    }

    deleteImages(req, res) {
        // users/delete/:id
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

    deletePostImages(req, res) {
        // users/delete/:id
        const { id } = req.params;
        const sql = "DELETE FROM images WHERE images.post = ?";
        db.run(sql, [id], (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send("ERRO AO EXCLUIR");
            }
            return res.redirect("/posts");
        });
    }

    list(req, res) {
        db.all(
            "WITH cinco_ultimos as (SELECT * FROM post ORDER BY post.id DESC LIMIT 5), imagem_dos_5 as (SELECT link,post, images.id as img_id FROM images LEFT JOIN cinco_ultimos on images.post= cinco_ultimos.id) SELECT * FROM cinco_ultimos LEFT JOIN imagem_dos_5 on imagem_dos_5.post= cinco_ultimos.id ORDER BY cinco_ultimos.id DESC",
            (err, rows) => {
                if (err) {
                    console.error(err);
                } else {                    
                    var posts = rows.slice(0);
                    posts.sort(function (a, b) {
                        return a.id - b.id;
                    });
                    posts.reverse();
                    var lastFivePosts = [];
                    for (let i = 0; i < posts.length; i++) {
                        var index = this.getIndexOfPost(lastFivePosts, posts[i].id);
                        if (index == -1) {                            
                            var images = [];
                            if (posts[i].link!=null){
                                images.push(posts[i].link);
                            }
                            posts[i].images = images;
                            lastFivePosts.push(posts[i]);
                        } else {
                            if (posts[i].link != undefined) {
                                lastFivePosts[index].images.push(posts[i].link);
                            }
                        }
                    }
                    console.log(lastFivePosts);
                    res.render("home", {lastFivePosts});
                }
            }
        );
    }

    list5(req, res) {
        db.all(
            "SELECT * FROM post ORDER BY post.id DESC LIMIT 5",
            (err, rows) => {
                if (err) {
                    console.error(err);
                } else {
                    var posts = rows.slice(0);
                    
                    posts.sort(function (a, b) {
                        return a.created_at - b.created_at;
                    });
                    //posts.reverse();                    
                    for (let i = 0; i < posts.length; i++) {
                        posts[i].created_at = new Date(posts[i].created_at).toDateString()                        
                    }
                    var lastFivePosts = posts                    
                    res.render("home", { lastFivePosts });
                }
            }
        );
    }

    detail(req, res) {        

        const { id } = req.params;
        
        db.all("SELECT post.id as id, images.link as link, post.title as title, post.description as description, post.created_at as created_at, post.author as author FROM post LEFT JOIN images ON post.id = images.post WHERE post.id = ? ", [id], (err, rows) => {
            
            var posts = rows.slice(0);  
            var postWithImage = [];            
            for (let i = 0; i < posts.length; i++) {                
                var index = this.getIndexOfPost(postWithImage, posts[i].id);                
                if (index == -1) {
                    var images = [];
                    posts[i].created_at = new Date(posts[i].created_at).toDateString()
                    if (posts[i].link != null) {
                        images.push(posts[i].link);
                    }
                    posts[i].images = images;
                    postWithImage.push(posts[i]);
                } else {
                    if (posts[i].link != undefined) {
                        postWithImage[index].images.push(posts[i].link);
                    }
                }
            }            
            var post = postWithImage[0]
            console.log(post)
            return res.render("post-detail", { post });
        });
    }

    getEdit(req, res) {
        const { id } = req.params;       
        db.get("SELECT * from post WHERE post.id = ? ", [id], (err, rows) => {
            var post = rows;
            console.log(post)
            return res.render("post-edit", { post });
        });
    }
    

    editPost(req, res) {
        const { id } = req.params;
        const { title, description, author } = req.body;
        const params = [title, description, author, id];
        db.run("UPDATE post SET title=? , description=?, author=? WHERE post.id = ? ", [params], (err, rows) => {
            db.all("SELECT * from images where images.post = ?", [id], (err, rows) => {
                var images = rows.slice(0);  
                for(let i = 0;i<5;i++){
                    if(!images[i]){
                        var image = {}
                        image.link = ""
                        image.id = 0
                        images.push(image)
                    }
                }
                console.log(images)
                return res.render("edit-img", { images });
            })
        });
    } 

    editImages2(req, res) {    
        var postid
        const sql ="UPDATE images SET link=? WHERE images.id = ? ";
            
        if (req.body.images != undefined) {
            var images = req.body.images
            if (images[0].post){
                postid = images[0].post
            }            
            console.log(images[0])
            try {
                for (let i = 0; i < images.length; i++) {                    
                    var imgLink = images[i].link
                    var id = images[i].id
                    const params = [imgLink, id];
                    if (imgLink && id!=0) {
                        db.run(sql, params, function (err) {
                            if (err) {
                                console.log(err);
                                throw new Error(err);
                            }
                        });
                    }                    
                    if (imgLink !="" && id == 0) {    
                                                         
                        db.run("INSERT INTO images (post, link) VALUES (?, ?)", [postid, imgLink], function (err) {
                            if (err) {
                                console.log(err);
                                throw new Error(err);
                            }
                        });
                    }
                }
            } catch (error) {                
                console.log(error);
                return res.status(500).send(error);
            }
            
            if(postid){
                
                return res.redirect("/posts/" + postid);
            }
            return res.redirect("/")
        }
    }
}

module.exports = PostController;
