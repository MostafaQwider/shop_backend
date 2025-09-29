const express = require('express');
const router = express.Router();
const ratingsController = require('../controllers/ratingsController');
const auth = require('../middlewares/auth');

router.post('/', auth.requireAuth, ratingsController.create);
router.get('/product/:productId', ratingsController.listForProduct);

module.exports = router;