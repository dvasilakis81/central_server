const methods = require('./Methods');

async function getCategories(req, res, next) {  
  var categories = await methods.getCategories(req, res, next);
  res.set('Access-Control-Allow-Origin', '*');
  res.status(200).json(categories);
}
async function addCategory(req, res, next) {  
  var categorys = await methods.addCategory(req, res, next);
  res.status(200).json(categorys);
}
async function editCategory(req, res, next) {  
  await methods.editCategory(req, res, next);
  var category = await methods.getCategory(req, res, next);
  res.status(200).json(category);
}

module.exports = {
  getCategories,
  addCategory,
  editCategory
}