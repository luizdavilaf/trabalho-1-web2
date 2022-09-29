const { Router } = require('express');
const PostController = require('../controllers/PostController');
const router = Router();

const controller = new PostController();

router.get('/', (req, res) => controller.listHomePage(req, res));

module.exports = router;