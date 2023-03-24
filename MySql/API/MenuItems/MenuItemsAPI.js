const methods = require('../MenuItems/Methods');
var pool = require('../../dbConfig').pool;

async function getMenuItems(req, res, next) {
  console.log("CALL getMenuItems");
  var menuItems = await methods.getMenuItems(req, res, next);
  res.set('Access-Control-Allow-Origin', '*');
  res.status(200).json(menuItems);
}

async function addMenuItem(req, res, next) {
  console.log("CALL addNewMenuItem");
  var menuItems = await methods.addMenuItem(req, res, next);
  res.status(200).json(menuItems);
}

async function editMenuItem(req, res, next) {
  console.log("CALL editMenuItem");
  var menuItems = await methods.editMenuItem(req, res, next);
  var menuItem =await methods.getMenuItem(req, res, next);
  res.status(200).json(menuItem);
}

module.exports = {
  getMenuItems,  
  addMenuItem,
  editMenuItem
}