const { Router } = require('express');
const PostController = require('../controllers/PostController');
const router = Router();

//const controller = new PostController();

router.get('/', PostController.listHomePage);

module.exports = router;