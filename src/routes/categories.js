const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');
const auth = require('../middlewares/auth');

router.get('/', categoriesController.list);
router.get('/:id', categoriesController.getById);
router.post('/', auth.requireAuth, categoriesController.create);
router.put('/:id', auth.requireAuth, categoriesController.update);
router.delete('/:id', auth.requireAuth, categoriesController.remove);

module.exports = router;