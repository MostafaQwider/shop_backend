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

exports.getById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const user = await usersService.findById(id);
    if (!user) {
      return sendResponse(res, false, "User not found", null, 404);
    }
    sendResponse(res, true, "User fetched successfully", user);
  } catch (err) {
    sendResponse(res, false, err.message, null, 500);
  }
};

exports.update = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updated = await usersService.update(id, req.body);
    sendResponse(res, true, "User updated successfully", updated);
  } catch (err) {
    sendResponse(res, false, err.message, null, 500);
  }
};

exports.remove = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await usersService.remove(id);
    sendResponse(res, true, "User deleted successfully");
  } catch (err) {
    sendResponse(res, false, err.message, null, 500);
  }
};
