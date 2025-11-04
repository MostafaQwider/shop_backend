const express = require('express');
const router = express.Router();
const configController = require('../controllers/paypalController');
const auth = require('../middlewares/auth'); // middleware للتحقق من التوكن

// جلب إعدادات PayPal (محمي بالـ token)
router.get('/', auth.requireAuth, configController.getPaypalConfigController);

module.exports = router;
