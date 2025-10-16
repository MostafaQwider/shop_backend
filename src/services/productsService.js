const model = require('../models/productsModel');
exports.create = model.create;
exports.findById = model.findById;
exports.list = model.list;
exports.update = model.update;
exports.remove = model.remove;

exports.listVariants = model.listVariants;
exports.createVariant = model.createVariant;

exports.listImages = model.listImages;
exports.createImage = model.createImage;
exports.listWithDetails = (lang) => {
  return model.listWithDetails(lang);
};
