const service = require('../services/categoriesService');
const sendResponse = require('../helpers/responseHelper');

// جلب كل التصنيفات
exports.list = async (req, res) => {
  try {
    const rows = await service.list();
    sendResponse(res, true, "Categories fetched successfully", rows);
  } catch (err) {
    sendResponse(res, false, err.message, null, 500);
  }
};

// جلب تصنيف محدد حسب query parameter
exports.getById = async (req, res) => {
  try {
    const id = parseInt(req.query.id, 10);
    if (!id) return sendResponse(res, false, "Category id is required", null, 400);

    const row = await service.findById(id);
    if (!row) {
      return sendResponse(res, false, "Category not found", null, 404);
    }

    sendResponse(res, true, "Category fetched successfully", row);
  } catch (err) {
    sendResponse(res, false, err.message, null, 500);
  }
};

// إنشاء تصنيف
exports.create = async (req, res) => {
  try {
    const id = await service.create(req.body);
    const row = await service.findById(id);
    sendResponse(res, true, "Category created successfully", row, 201);
  } catch (err) {
    sendResponse(res, false, err.message, null, 500);
  }
};

// تحديث تصنيف حسب query parameter
exports.update = async (req, res) => {
  try {
    const id = parseInt(req.query.id, 10);
    if (!id) return sendResponse(res, false, "Category id is required", null, 400);

    const row = await service.update(id, req.body);
    sendResponse(res, true, "Category updated successfully", row);
  } catch (err) {
    sendResponse(res, false, err.message, null, 500);
  }
};

// حذف تصنيف حسب query parameter
exports.remove = async (req, res) => {
  try {
    const id = parseInt(req.query.id, 10);
    if (!id) return sendResponse(res, false, "Category id is required", null, 400);

    await service.remove(id);
    sendResponse(res, true, "Category deleted successfully", null);
  } catch (err) {
    sendResponse(res, false, err.message, null, 500);
  }
};

// جلب كل التصنيفات مع الفروع
exports.listWithSubcategories = async (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    const categories = await service.listWithSubcategories(lang);
    sendResponse(res, true, "Categories with Subcategories fetched successfully", categories);
  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};
