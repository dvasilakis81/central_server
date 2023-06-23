const menuItemsMethods = require('../MenuItems/Methods');
const announcementMethods = require('../Announcements/Methods');
const pageMethods = require('../PageItems/Methods');
const mediaMethods = require('../MediaItems/Methods');
const categoriesMethods = require('../Categories/Methods');
const userMethods = require('../Users/Methods');

async function deleteItem(req, res, next) {
  var serverResponse = null;
  var rows = null;
  if (req.body.kind == 1)
    rows = await menuItemsMethods.deleteItem(req, res, next);
  else if (req.body.kind == 2)
    rows = serverResponse = await pageMethods.deleteItem(req, res, next);
  else if (req.body.kind == 3) {
    var ret = await mediaMethods.deleteMediaFromDirectory(req, res, next);
    if (ret) {
      var serverResponse = await mediaMethods.deleteItem(req, res, next);
      if (serverResponse.affectedRows === 1)
        res.status(200).json(req.body);
      else
        res.status(205).json(undefined);
    } else
      res.status(450).json('Internal Server Error');
  } else if (req.body.kind == 4)
    rows = serverResponse = await announcementMethods.deleteItem(req, res, next);
  else if (req.body.kind == 5)
    rows = serverResponse = await categoriesMethods.deleteItem(req, res, next);
  else if (req.body.kind == 6)
    rows = serverResponse = await userMethods.deleteItem(req, res, next);

  if (rows && rows.affectedRows > 0) {
    var response = {};
    response.success = true;
    response.id = req.body.id
    res.status(200).json(response);
  }
  else
    res.status(709).json(serverResponse);
}

module.exports = {
  deleteItem
}