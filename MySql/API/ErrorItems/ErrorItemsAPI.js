const methods = require('../ErrorItems/Methods');
var pool = require('../../dbConfig').pool;

async function getErrorItems(req, res, next) {  
  var errorItems = await methods.getErrorItems(req, res, next);
  res.status(200).json(errorItems);
}

async function addErrorItem(req, res, next) {  
  var errorItems = await methods.addErrorItem(req, res, next);
  res.status(200).json(errorItems);
}

module.exports = {
  getErrorItems,  
  addErrorItem  
}