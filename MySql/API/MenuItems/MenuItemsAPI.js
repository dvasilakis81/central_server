const methods = require('./Methods');

async function getMenuItems(req, res, next) {
  var menuItems = await methods.getMenuItems(req, res, next);  
  res.status(200).json(menuItems);
}
async function getServiceItems(req, res, next) {
  var items = await methods.getServiceItems(req, res, next);
  res.status(200).json(items);
}
async function getServiceItemsByGroup(req, res, next) {
  var items = await methods.getServiceItemsByGroup(req, res, next);
  res.status(200).json(items);
}
async function addMenuItem(req, res, next) {
  var menuItems = await methods.addMenuItem(req, res, next);  
  res.status(200).json(menuItems);
}
async function editMenuItem(req, res, next) {
  var editResponse = await methods.editMenuItem(req, res, next);
  if (editResponse.affectedRows > 0) {
    await methods.addMenuCategories(req, res, next, req.body.id);
    // await methods.fixMenuItemsOrderNo(req, res, next);
    menuItem = await methods.getMenuItem(req, res, next);
  }
  res.status(200).json(menuItem);
}

async function getAnnouncements(req, res, next) {
  var announcements = await methods.getAnnouncements(req, res, next);
  res.status(200).json(announcements);
}
module.exports = {
  getMenuItems,
  getServiceItems,
  getServiceItemsByGroup,
  addMenuItem,
  editMenuItem,
  getAnnouncements
}