const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const auth = require('../middlewares/auth');

// ✅ جميع المسارات محمية بالتوكن
router.use(auth.requireAuth);

// ✅ جلب بيانات المستخدم الحالي من التوكن
router.get('/me', usersController.getCurrentUser);

// ✅ تحديث بيانات المستخدم الحالي
router.put('/me', usersController.updateCurrentUser);

// ✅ حذف الحساب الحالي
router.delete('/me', usersController.removeCurrentUser);

// ✅ فقط المشرف يمكنه استعراض جميع المستخدمين (اختياري)
router.get('/', usersController.list);

module.exports = router;
