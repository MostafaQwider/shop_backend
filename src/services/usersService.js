const usersModel = require('../models/usersModel');

exports.create = async (data) => {
  const id = await usersModel.create(data);
  return usersModel.findById(id);
};

exports.findByEmail = usersModel.findByEmail;
exports.findById = usersModel.findById;
exports.list = usersModel.list;
exports.update = usersModel.update;
exports.remove = usersModel.remove;

// التحقق من كود التفعيل
exports.verifyAccountCode = (user, code) => {
  if (!user.verification_code || !user.verification_code_expires) return false;
  if (user.verification_code !== code) return false;
  if (new Date() > new Date(user.verification_code_expires)) return false;
  return true;
};

// وضع is_verified
exports.markVerified = async (userId) => {
  return usersModel.update(userId, { verification_code: null, verification_code_expires: null, is_verified: true });
};

// Reset code
exports.saveResetCode = async (userId, code, expires) => {
  return usersModel.update(userId, { reset_code: code, reset_code_expires: expires });
};

exports.verifyResetCode = (user, code) => {
  if (!user.reset_code || !user.reset_code_expires) return false;
  if (user.reset_code !== code) return false;
  if (new Date() > new Date(user.reset_code_expires)) return false;
  return true;
};

// Save verification code after تسجيل الحساب
exports.saveVerificationCode = async (userId, code, expires) => {
  return usersModel.update(userId, { verification_code: code, verification_code_expires: expires });
};
