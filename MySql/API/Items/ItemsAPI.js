const menuItemsMethods = require('../MenuItems/Methods');
const announcemtMethods = require('../Announcements/Methods');
const pageMethods = require('../PageItems/Methods');
const mediaMethods = require('../MediaItems/Methods');

async function deleteItem(req, res, next) {
  var serverResponse = null;
  var rows = null;
  if (req.body.kind == 1)
    rows = await menuItemsMethods.deleteItem(req, res, next);
  else if (req.body.kind == 2)
    rows = serverResponse = await pageMethods.deleteItem(req, res, next);
  else if (req.body.kind == 3)
    rows = serverResponse = await mediaMethods.deleteItem(req, res, next);
  else if (req.body.kind == 4)
    rows = serverResponse = await announcemtMethods.deleteItem(req, res, next);

  if (rows && rows.affectedRows > 0)  
    res.status(200).json(req.body);
  else
    res.status(709).json(serverResponse);
}

module.exports = {
  deleteItem
}