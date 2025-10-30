const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const auth = require('../middlewares/auth');

// ✅ جميع المسارات محمية بالتوكن
router.use(auth.requireAuth);

// ✅ جلب بيانات المستخدم الحالي من التوكن
router.get('/profile', usersController.getCurrentUser);

// ✅ تحديث بيانات المستخدم الحالي
router.put('/profile', usersController.updateCurrentUser);

// ✅ حذف الحساب الحالي
router.delete('/profile', usersController.removeCurrentUser);

// ✅ فقط المشرف يمكنه استعراض جميع المستخدمين (اختياري)
router.get('/', usersController.list);

module.exports = router;
