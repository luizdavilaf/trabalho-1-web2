const { Router } = require('express');
const PostController = require('../controllers/PostController');
const router = Router();

const controller = new PostController();

router.get('/add-post', (req, res) => controller.renderAdd(req, res)); //renderizar a pagina de adicionar post

router.get('/edit/:id', (req, res) => controller.getEdit(req, res)); //consulta os dados para editar

router.post('/edit/:id', (req, res) => controller.editPost(req, res)); //editar post

router.post('/eimage/edit-images/', (req, res) => controller.editImages2(req, res)); //editar imagens

router.get('/', (req, res) => controller.list(req, res)); //lista os dados paginados

router.get('/:id', (req, res) => controller.detail(req, res)); //detalha um post por id

router.get('/delete/:id', (req, res) => controller.delete(req, res)); //deleta post

router.post('/', (req, res) => controller.create(req, res)); // cria novo post

//images
router.get('/add-post-image', (req, res) => controller.renderAddImage(req, res)); //renderiza pagina para adição de imagens

router.post('/image/:postid', (req, res) => controller.insertImages(req, res)); //adiciona imagens

router.delete('/image/:postid', (req, res) => controller.deletePostImages(req, res)); //deleta imagens

module.exports = router;