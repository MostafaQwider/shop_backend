const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');
const auth = require('../middlewares/auth');

// جلب كل التصنيفات
router.get('/', categoriesController.list);

// جلب كل التصنيفات مع الفروع
router.get('/allcategories', categoriesController.listWithSubcategories);

// جلب تصنيف محدد حسب query parameter
router.get('/get', categoriesController.getById);

// إنشاء تصنيف (محمي)
router.post('/', auth.requireAuth, categoriesController.create);

// تحديث تصنيف حسب query parameter
router.put('/update', auth.requireAuth, categoriesController.update);

// حذف تصنيف حسب query parameter
router.delete('/delete', auth.requireAuth, categoriesController.remove);

module.exports = router;
