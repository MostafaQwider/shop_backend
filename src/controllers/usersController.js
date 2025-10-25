const usersService = require('../services/usersService');
const sendResponse = require('../helpers/responseHelper');

exports.list = async (req, res) => {
  try {
    const rows = await usersService.list();
    sendResponse(res, true, "Users fetched successfully", rows);
  } catch (err) {
    sendResponse(res, false, err.message, null, 500);
  }
};

// ✅ جلب بيانات المستخدم الحالي من التوكن
exports.getCurrentUser = async (req, res) => {
  try {
    const id = req.user.id; // أخذ الـ id من التوكن
    const user = await usersService.findById(id);

    if (!user) {
      return sendResponse(res, false, "User not found", null, 404);
    }

    sendResponse(res, true, "User fetched successfully", user);
  } catch (err) {
    sendResponse(res, false, err.message, null, 500);
  }
};

// ✅ تحديث بيانات المستخدم الحالي
exports.updateCurrentUser = async (req, res) => {
  try {
    const id = req.user.id;
    const updated = await usersService.update(id, req.body);
    sendResponse(res, true, "User updated successfully", updated);
  } catch (err) {
    sendResponse(res, false, err.message, null, 500);
  }
};

// ✅ حذف المستخدم الحالي
exports.removeCurrentUser = async (req, res) => {
  try {
    const id = req.user.id;
    await usersService.remove(id);
    sendResponse(res, true, "User deleted successfully");
  } catch (err) {
    sendResponse(res, false, err.message, null, 500);
  }
};
