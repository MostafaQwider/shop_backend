const service = require('../services/addressesService');
const sendResponse = require('../helpers/responseHelper');

// إنشاء عنوان
exports.createAddress = async (req, res) => {
  try {
    const user_id = req.user.id;
    const data = { ...req.body, user_id };

    const address = await service.createAddress(data);
    sendResponse(res, true, "Address created successfully", address, 201);
  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};

// جلب عنوان حسب id (query parameter)
exports.getById = async (req, res) => {
  try {
    const id = parseInt(req.query.id, 10);
    if (!id) return sendResponse(res, false, "Address id is required", null, 400);

    const address = await service.findById(id);
    if (!address) {
      return sendResponse(res, false, "Address not found", null, 404);
    }

    sendResponse(res, true, "Address fetched successfully", address);
  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};

// تحديث عنوان حسب id (query parameter)
exports.updateAddress = async (req, res) => {
  try {
    const id = parseInt(req.query.id, 10);
    if (!id) return sendResponse(res, false, "Address id is required", null, 400);

    const updated = await service.updateAddress(id, req.body);
    sendResponse(res, true, "Address updated successfully", updated);
  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};

// حذف عنوان حسب id (query parameter)
exports.deleteAddress = async (req, res) => {
  try {
    const id = parseInt(req.query.id, 10);
    if (!id) return sendResponse(res, false, "Address id is required", null, 400);

    await service.deleteAddress(id);
    sendResponse(res, true, "Address deleted successfully", null);
  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};

// جلب كل العناوين الخاصة بالمستخدم
exports.listForUser = async (req, res) => {
  try {
    const user_id = req.user.id;
    const addresses = await service.listForUser(user_id);

    sendResponse(res, true, "Addresses fetched successfully", addresses);
  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};
