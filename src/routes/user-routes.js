const { Router } = require('express');
const UserController = require('../controllers/UserController');

const router = Router();
const AuthController = require('../controllers/AuthController');
const isAuth = require('../middlewares/isAuth');
const isAdmin = require('../middlewares/isAdmin');

router.post('/login', AuthController.login);

router.get('/login', AuthController.renderLogin);

router.post('/', UserController.create);

router.get('/', UserController.renderAdd);

router.get('/list', UserController.listAll);

router.get('/:cpf', UserController.detailByCpf);

router.delete('/:cpf', UserController.deleteByCpf);





module.exports = router;