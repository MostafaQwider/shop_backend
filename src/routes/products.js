const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const auth = require('../middlewares/auth');

router.get('/', productsController.list);
router.get('/:id', productsController.getById);
router.post('/', auth.requireAuth, productsController.create);
router.put('/:id', auth.requireAuth, productsController.update);
router.delete('/:id', auth.requireAuth, productsController.remove);

// nested resources (variants, images, translations)
router.get('/:id/variants', productsController.listVariants);
router.post('/:id/variants', auth.requireAuth, productsController.createVariant);
router.get('/:id/images', productsController.listImages);
router.post('/:id/images', auth.requireAuth, productsController.createImage);

module.exports = router;