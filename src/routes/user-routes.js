const { Router } = require('express');
const UserController = require('../controllers/UserController');
const router = Router();

//const controller = new UserController();

router.post('/', UserController.create);

router.get('/list', UserController.listAll);

router.get('/:cpf', UserController.detailByCpf);





module.exports = router;