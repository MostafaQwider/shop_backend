const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');
const auth = require('../middlewares/auth');

// إنشاء طلب (محمي بالـ token)
router.post('/', auth.requireAuth, ordersController.createOrder);

// جلب كل الطلبات (admin)
router.get('/all', auth.requireAuth, ordersController.findAll);

// جلب الطلبات الخاصة بالمستخدم
router.get('/', auth.requireAuth, ordersController.listForUser);

// جلب طلب محدد حسب query parameter
router.get('/get', auth.requireAuth, ordersController.getById);

// تحديث طلب حسب query parameter
router.put('/update', auth.requireAuth, ordersController.updateOrder);

// حذف طلب حسب query parameter
router.delete('/delete', auth.requireAuth, ordersController.deleteOrder);

module.exports = router;
