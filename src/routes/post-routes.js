const { Router } = require('express');
const PostController = require('../controllers/PostController');
const router = Router();

const controller = new PostController();

router.get('/add-post', (req, res) => controller.renderAdd(req, res));

router.post('/eimage/edit-images/', (req, res) => controller.editImages2(req, res));

router.get('/:id', (req, res) => controller.detail(req, res));

router.get('/edit/:id', (req, res) => controller.getEdit(req, res));

router.post('/edit/:id', (req, res) => controller.editPost(req, res));

router.get('/', (req, res) => controller.list5(req, res));

router.get('/delete/:id', (req, res) => controller.delete(req, res));

router.post('/', (req, res) => controller.create(req, res));


//images
router.get('/add-post-image', (req, res) => controller.renderAddImage(req, res));

router.post('/image/:postid', (req, res) => controller.insertImages(req, res));



router.delete('/image/:postid', (req, res) => controller.deletePostImages(req, res));

//router.delete('/image/image/:imageid', (req, res) => controller.deletePostImages(req, res));

module.exports = router;