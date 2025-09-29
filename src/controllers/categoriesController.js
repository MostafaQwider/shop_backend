const service = require('../services/categoriesService');
const sendResponse = require('../helpers/responseHelper');

exports.list = async (req, res) => {
  try {
    const rows = await service.list();
    sendResponse(res, true, "Categories fetched successfully", rows);
  } catch (err) {
    sendResponse(res, false, err.message, null, 500);
  }
};

exports.getById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const row = await service.findById(id);
    if (!row) {
      return sendResponse(res, false, "Category not found", null, 404);
    }
    sendResponse(res, true, "Category fetched successfully", row);
  } catch (err) {
    sendResponse(res, false, err.message, null, 500);
  }
};

exports.create = async (req, res) => {
  try {
    const id = await service.create(req.body);
    const row = await service.findById(id);
    sendResponse(res, true, "Category created successfully", row, 201);
  } catch (err) {
    sendResponse(res, false, err.message, null, 500);
  }
};

exports.update = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const row = await service.update(id, req.body);
    sendResponse(res, true, "Category updated successfully", row);
  } catch (err) {
    sendResponse(res, false, err.message, null, 500);
  }
};

exports.remove = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await service.remove(id);
    sendResponse(res, true, "Category deleted successfully", null);
  } catch (err) {
    sendResponse(res, false, err.message, null, 500);
  }
};
