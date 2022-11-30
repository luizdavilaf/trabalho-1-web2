const { Router } = require('express');
const PostController = require('../controllers/PostController');
const router = Router();
const AuthController = require('../controllers/AuthController');
const isAuth = require('../middlewares/isAuth');
const isAdmin = require('../middlewares/isAdmin');
//const controller = new PostController();

router.get('/add-post', isAuth, PostController.renderAdd); //renderizar a pagina de adicionar post

router.get('/edit/:id', isAuth, PostController.getEdit); //consulta os dados para editar

router.post('/edit/:id', PostController.editPost); //editar post

router.post('/eimage/edit-images/', PostController.editImages2); //editar imagens

router.get('/', PostController.list); //lista os dados paginados

router.get('/:id', PostController.detail); //detalha um post por id

router.get('/delete/:id', PostController.deleteById); //deleta post

router.get('/user/:userId', PostController.getPostbyUserId); //deleta post

router.post('/', isAuth, PostController.create); // cria novo post

//images
router.get('/add-post-image', PostController.renderAddImage); //renderiza pagina para adição de imagens

router.post('/image/:postid', PostController.insertImages); //adiciona imagens

router.delete('/image/:postid', PostController.deletePostImages); //deleta imagens

module.exports = router;