const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth');

// تسجيل وحساب
router.post('/register', authController.register);
router.post('/login', authController.login);

// تفعيل الحساب
router.post('/verify-account', authController.verifyAccount);
router.post('/send-verification-code', authController.sendVerifyCode);

// نسيت كلمة المرور
router.post('/send-reset-code', authController.sendResetCode);
router.post('/verify-reset-code', authController.verifyResetCode);
router.post('/reset-password', authController.resetPassword);

// تغيير كلمة المرور بعد تسجيل الدخول
router.post('/change-password', auth.requireAuth, authController.changePassword);

// تسجيل الخروج
router.post('/logout', auth.requireAuth, authController.logout);

module.exports = router;
