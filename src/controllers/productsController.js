const service = require('../services/productsService');
const sendResponse = require('../helpers/responseHelper');

// جلب كل المنتجات
exports.list = async (req, res) => {
  try {
    const products = await service.list();
    sendResponse(res, true, "Products fetched successfully", products);
  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};

// جلب منتج محدد حسب query parameter
exports.getById = async (req, res) => {
  try {
    const id = parseInt(req.query.id, 10);
    if (!id) return sendResponse(res, false, "Product id is required", null, 400);

    const p = await service.findById(id);
    if (!p) return sendResponse(res, false, "Product not found", null, 404);

    sendResponse(res, true, "Product fetched successfully", p);
  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};

// إنشاء منتج
exports.create = async (req, res) => {
  try {
    const id = await service.create(req.body);
    const product = await service.findById(id);
    sendResponse(res, true, "Product created successfully", product, 201);
  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};

// تحديث منتج حسب query parameter
exports.update = async (req, res) => {
  try {
    const id = parseInt(req.query.id, 10);
    if (!id) return sendResponse(res, false, "Product id is required", null, 400);

    const updated = await service.update(id, req.body);
    sendResponse(res, true, "Product updated successfully", updated);
  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};

// حذف منتج حسب query parameter
exports.remove = async (req, res) => {
  try {
    const id = parseInt(req.query.id, 10);
    if (!id) return sendResponse(res, false, "Product id is required", null, 400);

    await service.remove(id);
    sendResponse(res, true, "Product deleted successfully");
  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};

// جلب المتغيرات حسب query parameter
exports.listVariants = async (req, res) => {
  try {
    const productId = parseInt(req.query.id, 10);
    if (!productId) return sendResponse(res, false, "Product id is required", null, 400);

    const variants = await service.listVariants(productId);
    sendResponse(res, true, "Variants fetched successfully", variants);
  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};

// إنشاء متغير جديد حسب query parameter
exports.createVariant = async (req, res) => {
  try {
    const productId = parseInt(req.query.id, 10);
    if (!productId) return sendResponse(res, false, "Product id is required", null, 400);

    const id = await service.createVariant(productId, req.body);
    sendResponse(res, true, "Variant created successfully", { id }, 201);
  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};

// جلب الصور حسب query parameter
exports.listImages = async (req, res) => {
  try {
    const productId = parseInt(req.query.id, 10);
    if (!productId) return sendResponse(res, false, "Product id is required", null, 400);

    const images = await service.listImages(productId);
    sendResponse(res, true, "Images fetched successfully", images);
  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};

// إنشاء صورة جديدة حسب query parameter
exports.createImage = async (req, res) => {
  try {
    const productId = parseInt(req.query.id, 10);
    if (!productId) return sendResponse(res, false, "Product id is required", null, 400);

    const id = await service.createImage(productId, req.body);
    sendResponse(res, true, "Image created successfully", { id }, 201);
  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};

// جلب كل المنتجات مع التفاصيل
exports.listWithDetails = async (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    const products = await service.listWithDetails(lang);
    sendResponse(res, true, "Products with details fetched successfully", products);
  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};
