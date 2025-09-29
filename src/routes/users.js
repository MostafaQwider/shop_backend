const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const auth = require('../middlewares/auth');

router.get('/', auth.requireAuth, usersController.list);
router.get('/:id', auth.requireAuth, usersController.getById);
router.put('/:id', auth.requireAuth, usersController.update);
router.delete('/:id', auth.requireAuth, usersController.remove);

module.exports = router;