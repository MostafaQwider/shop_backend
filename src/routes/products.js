const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const auth = require('../middlewares/auth');

// جلب كل المنتجات
router.get('/', productsController.list);

// جلب كل المنتجات مع التفاصيل
router.get('/details', productsController.listWithDetails);

// جلب منتج محدد حسب query parameter
router.get('/get', productsController.getById);

// إنشاء منتج (محمي)
router.post('/', auth.requireAuth, productsController.create);

// تحديث منتج حسب query parameter
router.put('/update', auth.requireAuth, productsController.update);

// حذف منتج حسب query parameter
router.delete('/delete', auth.requireAuth, productsController.remove);

// nested resources (variants, images, translations)

// جلب المتغيرات حسب query parameter
router.get('/variants', productsController.listVariants);

// إنشاء متغير جديد حسب query parameter (محمي)
router.post('/variants', auth.requireAuth, productsController.createVariant);

// جلب الصور حسب query parameter
router.get('/images', productsController.listImages);

// إنشاء صورة جديدة حسب query parameter (محمي)
router.post('/images', auth.requireAuth, productsController.createImage);

module.exports = router;
