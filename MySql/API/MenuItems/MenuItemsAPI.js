const methods = require('../MenuItems/Methods');
var pool = require('../../dbConfig').pool;

async function getMenuItems(req, res, next) {  
  var menuItems = await methods.getMenuItems(req, res, next);
  res.set('Access-Control-Allow-Origin', '*');
  res.status(200).json(menuItems);
}

async function addMenuItem(req, res, next) {  
  var menuItems = await methods.addMenuItem(req, res, next);
  res.status(200).json(menuItems);
}

async function editMenuItem(req, res, next) {  
  var menuItems = await methods.editMenuItem(req, res, next);
  var menuItem = await methods.getMenuItem(req, res, next);
  res.status(200).json(menuItem);
}

async function getAnnouncements(req, res, next) {
  var announcements = await methods.getAnnouncements(req, res, next);
  res.status(200).json(announcements);
}
module.exports = {
  getMenuItems,
  addMenuItem,
  editMenuItem,
  getAnnouncements
}