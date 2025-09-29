const service = require('../services/productsService');
const sendResponse = require('../helpers/responseHelper');

exports.list = async (req, res) => {
  try {
    const products = await service.list();
    sendResponse(res, true, "Products fetched successfully", products);
  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};

exports.getById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const p = await service.findById(id);
    if (!p) return sendResponse(res, false, "Product not found", null, 404);
    sendResponse(res, true, "Product fetched successfully", p);
  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};

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

exports.update = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updated = await service.update(id, req.body);
    sendResponse(res, true, "Product updated successfully", updated);
  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};

exports.remove = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await service.remove(id);
    sendResponse(res, true, "Product deleted successfully");
  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};

exports.listVariants = async (req, res) => {
  try {
    const productId = parseInt(req.params.id, 10);
    const variants = await service.listVariants(productId);
    sendResponse(res, true, "Variants fetched successfully", variants);
  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};

exports.createVariant = async (req, res) => {
  try {
    const productId = parseInt(req.params.id, 10);
    const id = await service.createVariant(productId, req.body);
    sendResponse(res, true, "Variant created successfully", { id }, 201);
  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};

exports.listImages = async (req, res) => {
  try {
    const productId = parseInt(req.params.id, 10);
    const images = await service.listImages(productId);
    sendResponse(res, true, "Images fetched successfully", images);
  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};

exports.createImage = async (req, res) => {
  try {
    const productId = parseInt(req.params.id, 10);
    const id = await service.createImage(productId, req.body);
    sendResponse(res, true, "Image created successfully", { id }, 201);
  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};
