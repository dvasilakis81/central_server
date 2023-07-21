const methods = require('./Methods');

async function getPhoneCatalogItems(req, res, next) {
  var items = await methods.getPhoneCatalogItems(req, res, next);
  res.status(200).json(items);
}
async function addPhoneCatalogItems(req, res, next) {
  var items = await methods.addPhoneCatalogItems(req, res, next);
  res.status(200).json(items);
}
async function searchPhoneCatalogItems(req, res, next) {  
  var items = await methods.searchPhoneCatalogItems(req, res, next);
  res.status(200).json(items);
}

module.exports = {
  getPhoneCatalogItems,
  searchPhoneCatalogItems,
  addPhoneCatalogItems
  
}