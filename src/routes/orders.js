const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');
const auth = require('../middlewares/auth');

router.post('/', auth.requireAuth, ordersController.createOrder);
router.get('/:id', auth.requireAuth, ordersController.getById);
router.get('/', auth.requireAuth, ordersController.listForUser);

module.exports = router;