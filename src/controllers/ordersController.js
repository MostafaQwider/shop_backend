const service = require('../services/ordersService');
const sendResponse = require('../helpers/responseHelper');



// إنشاء طلب
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { total, payment_method, payment_transaction_id, items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return sendResponse(res, false, "Items are required", null, 400);
    }

    const id = await service.createOrder({
      user_id: userId,
      total,
      payment_method,
      payment_transaction_id,
      items
    });

    sendResponse(res, true, "Order created successfully", { id }, 201);

  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};

// جلب طلب حسب id (query parameter)
exports.getById = async (req, res) => {
  try {
    const id = parseInt(req.query.id, 10); // id الآن من query
    if (!id) return sendResponse(res, false, "Order id is required", null, 400);

    const order = await service.findById(id);

    if (!order) {
      return sendResponse(res, false, "Order not found", null, 404);
    }

    sendResponse(res, true, "Order fetched successfully", order);

  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};

// تحديث طلب حسب id (query parameter)
exports.updateOrder = async (req, res) => {
  try {
    const id = parseInt(req.query.id, 10);
    if (!id) return sendResponse(res, false, "Order id is required", null, 400);

    const data = req.body;
    const updatedOrder = await service.update(id, data);

    sendResponse(res, true, "Order updated successfully", updatedOrder);

  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};

// حذف طلب حسب id (query parameter)
exports.deleteOrder = async (req, res) => {
  try {
    const id = parseInt(req.query.id, 10);
    if (!id) return sendResponse(res, false, "Order id is required", null, 400);

    await service.remove(id);
    sendResponse(res, true, "Order deleted successfully", null);

  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};

// جلب كل الطلبات الخاصة بالمستخدم
exports.listForUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await service.listForUser(userId);

    sendResponse(res, true, "Orders fetched successfully", orders);

  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};

// جلب كل الطلبات (admin)
exports.findAll = async (req, res) => {
  try {
    const orders = await service.findAll();

    sendResponse(res, true, "Orders fetched successfully", orders);

  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};
