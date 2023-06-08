const methods = require('./Methods');

async function getCategories(req, res, next) {  
  var categories = await methods.getCategories(req, res, next);
  res.status(200).json(categories);
}
async function getAdminCategoriesToSelect(req, res, next) {  
  var categories = await methods.getAdminCategoriesToSelect(req, res, next);
  res.status(200).json(categories);
}
async function addCategory(req, res, next) {  
  var categoryItem = await methods.addCategory(req, res, next);
  res.status(200).json(categoryItem);
}
async function editCategory(req, res, next) {
  await methods.editCategory(req, res, next);
  var category = await methods.getCategory(req, res, next);
  res.status(200).json(category[0]);
}

module.exports = {
  getCategories,
  getAdminCategoriesToSelect,
  addCategory,
  editCategory
}