const { getPaypalConfig } = require("../services/paypalService");
const sendResponse = require('../helpers/responseHelper');

// Controller لإرسال إعدادات PayPal للعميل
const getPaypalConfigController = (req, res) => {
  try {
    const config = getPaypalConfig();

    // نرسل الرد باستخدام sendResponse
    return sendResponse(res, true, "PayPal configuration fetched successfully", config);
  } catch (error) {
    console.error("Error fetching PayPal config:", error);
    return sendResponse(res, false, "Internal server error", null, 500);
  }
};

module.exports = { getPaypalConfigController };
