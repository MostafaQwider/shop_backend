const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usersService = require('../services/usersService');
const sendResponse = require('../helpers/responseHelper');
const { sendCode } = require('../helpers/mailHelper');

const secret = process.env.JWT_SECRET || 'secret';
const expiresIn = process.env.JWT_EXPIRES_IN || '365d';

/**
 * تسجيل حساب جديد
 * 
 * 📥 Input (as JSON):
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "password": "123456"
 * }
 * 
 * 📤 Output (as JSON):
 * {
 *   "success": true,
 *   "message": "User registered successfully. Verification code sent to email",
 *   "data": {
 *     "user": {
 *       "id": "1",
 *       "name": "John Doe",
 *       "email": "john@example.com",
 *       "is_verified": false
 *     }
 *   }
 * }
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return sendResponse(res, false, "Name, email and password required", null, 400);
    }

    const existing = await usersService.findByEmail(email);
    if (existing) return sendResponse(res, false, "Email already in use", null, 400);

    const hashed = await bcrypt.hash(password, 10);
    const user = await usersService.create({ name, email, password: hashed });

    // إنشاء كود التفعيل
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // صلاحية 24 ساعة


    await usersService.saveVerificationCode(user.id, code, expires.toISOString());
    await sendCode(email, code, "Account Verification Code");

   sendResponse(res, true, "User registered successfully. Verification code sent to email", {
    user: { id: user.id, name: user.name, email: user.email, is_verified: false }
   }, 201);

  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};

/**
 * تفعيل الحساب
 * 
 * 📥 Input (as JSON):
 * {
 *   "email": "john@example.com",
 *   "code": "123456"
 * }
 * 
 * 📤 Output (as JSON):
 * {
 *   "success": true,
 *   "message": "Account verified successfully",
 *   "data": {
 *     "user": {
 *       "id": "1",
 *       "name": "John Doe",
 *       "email": "john@example.com",
 *       "is_verified": true
 *     },
 *     "token": "eyJhbGciOiJIUzI1NiIsInR..."
 *   }
 * }
 */
exports.verifyAccount = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await usersService.findByEmail(email);
    if (!user) return sendResponse(res, false, "User not found", null, 404);

    const valid = usersService.verifyAccountCode(user, code);
    if (!valid) return sendResponse(res, false, "Invalid or expired code", null, 400);

    await usersService.markVerified(user.id);

    // إنشاء التوكن بعد التفعيل فقط ✅
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn }
    );

    sendResponse(res, true, "Account verified successfully", {
      user: { id: user.id, name: user.name, email: user.email, is_verified: true },
      token
    });
  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};

/**
 * تسجيل الدخول
 * 
 * 📥 Input (as JSON):
 * {
 *   "email": "john@example.com",
 *   "password": "123456"
 * }
 * 
 * 📤 Output (as JSON):
 * {
 *   "success": true,
 *   "message": "Login successful",
 *   "data": {
 *     "user": {
 *       "id": "1",
 *       "name": "John Doe",
 *       "email": "john@example.com"
 *     },
 *     "token": "eyJhbGciOiJIUzI1NiIsInR..."
 *   }
 * }
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await usersService.findByEmail(email);
    if (!user) return sendResponse(res, false, "Invalid credentials", null, 400);

    if (!user.is_verified) return sendResponse(res, false, "Account not verified", null, 400);

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return sendResponse(res, false, "Invalid credentials", null, 400);

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, secret, { expiresIn });
    sendResponse(res, true, "Login successful", { user: { id: user.id, name: user.name, email: user.email }, token });

  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};

/**
 * إرسال كود إعادة تعيين كلمة المرور
 * 
 * 📥 Input (as JSON):
 * {
 *   "email": "john@example.com"
 * }
 * 
 * 📤 Output (as JSON):
 * {
 *   "success": true,
 *   "message": "Verification code sent to your email"
 * }
 */
exports.sendResetCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await usersService.findByEmail(email);
    if (!user) return sendResponse(res, false, "Email not found", null, 404);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 دقائق
    await usersService.saveResetCode(user.id, code, expires);
    await sendCode(email, code, "Password Reset Code");

    sendResponse(res, true, "Verification code sent to your email");
  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};

exports.sendVerifyCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendResponse(res, false, "Email is required", null, 400);
    }

    const user = await usersService.findByEmail(email);
    if (!user) return sendResponse(res, false, "Email not found", null, 404);

    // إذا لا يوجد كود أو انتهت صلاحيته → أنشئ كود جديد
    if (
      !user.verification_code ||
      !user.verification_code_expires ||
      new Date() > new Date(user.verification_code_expires)
    ) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // صلاحية 24 ساعة

      await usersService.saveVerificationCode(user.id, code, expires.toISOString());
      await sendCode(email, code, "Account Verification Code");

      return sendResponse(res, true, "Verification code sent to your email");
    }

    // غير ذلك، أرسل الكود الحالي
    await sendCode(email, user.verification_code, "Account Verification Code");
    sendResponse(res, true, "Verification code sent to your email");

  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};


exports.verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await usersService.findByEmail(email);
    if (!user) return sendResponse(res, false, "User not found", null, 404);

    const valid = usersService.verifyResetCode(user, code);
    if (!valid) return sendResponse(res, false, "Invalid or expired code", null, 400);
    sendResponse(res, true, "Reset code verified successfully");
  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};

/**
 * إعادة تعيين كلمة المرور
 * 
 * 📥 Input (as JSON):
 * {
 *   "email": "john@example.com",
 *   "newPassword": "new123456"
 * }
 * 
 * 📤 Output (as JSON):
 * {
 *   "success": true,
 *   "message": "Password reset successfully"
 * }
 */
exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const user = await usersService.findByEmail(email);
    if (!user) return sendResponse(res, false, "Email not found", null, 404);

    const hashed = await bcrypt.hash(newPassword, 10);
    await usersService.update(user.id, { password: hashed, reset_code: null, reset_code_expires: null });

    sendResponse(res, true, "Password reset successfully");
  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};

/**
 * تغيير كلمة المرور بعد تسجيل الدخول
 * 
 * 📥 Input (as JSON):
 * {
 *   "oldPassword": "123456",
 *   "newPassword": "new123456"
 * }
 * 
 * 📤 Output (as JSON):
 * {
 *   "success": true,
 *   "message": "Password changed successfully"
 * }
 */
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;
    const user = await usersService.findById(userId);

    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) return sendResponse(res, false, "Old password is incorrect", null, 400);

    const hashed = await bcrypt.hash(newPassword, 10);
    await usersService.update(userId, { password: hashed });

    sendResponse(res, true, "Password changed successfully");
  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};

/**
 * تسجيل الخروج
 * 
 * 📥 Input (as JSON):
 * {}
 * 
 * 📤 Output (as JSON):
 * {
 *   "success": true,
 *   "message": "Logged out successfully"
 * }
 */
exports.logout = async (req, res) => {
  try {
    sendResponse(res, true, "Logged out successfully");
  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};
