const service = require('../services/ratingsService');
const sendResponse = require('../helpers/responseHelper');

exports.create = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { product_id, rating, comment } = req.body;
    if (!product_id) return sendResponse(res, false, "product_id required", null, 400);

    const id = await service.create({ user_id, product_id, rating, comment });
    sendResponse(res, true, "Rating created successfully", { id }, 201);

  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};

exports.listForProduct = async (req, res) => {
  try {
    const pid = parseInt(req.params.productId, 10);
    const ratings = await service.listForProduct(pid);

    if (!ratings || ratings.length === 0) {
      return sendResponse(res, false, "No ratings found for this product", [], 404);
    }

    sendResponse(res, true, "Ratings fetched successfully", ratings);

  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};
