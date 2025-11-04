const express = require('express');
const router = express.Router();
const addressesController = require('../controllers/addressesController');
const auth = require('../middlewares/auth');

// إنشاء عنوان
router.post('/', auth.requireAuth, addressesController.createAddress);

// جلب عنوان حسب id (الآن id في query parameter)
router.get('/', auth.requireAuth, addressesController.getById);

// تحديث عنوان حسب id (id في query parameter)
router.put('/', auth.requireAuth, addressesController.updateAddress);

// حذف عنوان حسب id (id في query parameter)
router.delete('/', auth.requireAuth, addressesController.deleteAddress);

// جلب كل العناوين الخاصة بالمستخدم
router.get('/all', auth.requireAuth, addressesController.listForUser);

module.exports = router;
