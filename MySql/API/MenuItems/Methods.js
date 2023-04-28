var queries = require('./Queries');
const db = require('../../dbConfig');

async function getMenuItems(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_getmenuitems(req));
    for (var i = 0; i < rows.length; i++) {
      var ti = JSON.parse(rows[i].categoriesInfo);
      var t2 = '[' + ti + ']';
      rows[i].categoriesInfo = JSON.parse(t2);
    }

    return rows;
  } catch (error) {
    next(error);
  }
}

async function getServiceItems(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_getserviceitems());
    for (var i = 0; i < rows.length; i++) {
      var ti = JSON.parse(rows[i].categoriesInfo);
      var t2 = '[' + ti + ']';
      rows[i].categoriesInfo = JSON.parse(t2);
    }

    return rows;
  } catch (error) {
    next(error);
  }
}

async function getServiceItemsByGroup(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_getserviceitemsbygroup());
    for (var i = 0; i < rows.length; i++) {
      var ti = JSON.parse(rows[i].servicesInfo);
      var t2 = '[' + ti + ']';
      rows[i].servicesInfo = JSON.parse(t2);
    }

    return rows;
  } catch (error) {
    next(error);
  }
}
async function getMenuItem(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_getmenuitem(req));
    for (var i = 0; i < rows.length; i++) {
      var ti = JSON.parse(rows[i].categoriesInfo);
      var t2 = '[' + ti + ']';
      rows[i].categoriesInfo = JSON.parse(t2);
    }
    return rows[0];
  } catch (error) {
    next(error);
  }
}

async function addMenuItem(req, res, next) {

  try {
    await db.query(queries.query_addmenuitem(req));
    const [rows] = await db.query(queries.query_selectlastinserteditem('menu'));
    await db.query(queries.query_addmenuitemcategories(rows[0], req.body.categories));
    await db.query(queries.query_editmenuserviceitemsorderno(req));

    return rows[0];
  } catch (error) {
    next(error);
  }
}

async function editMenuItem(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_editmenuitem(req));
    return rows;
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function fixMenuItemsOrderNo(req, res, next) {

  try {
    var sqlQuery = queries.query_editmenuserviceitemsorderno(req);
    if (sqlQuery) {
      const [rows] = await db.query(sqlQuery);
      return rows;
    }
    return '';
  } catch (error) {
    next(error);
  }
}
async function deleteItem(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_deleteitem(req));
    return rows;
  } catch (error) {
    next(error);
  }
}

async function addMenuCategories(req, res, next, menuitemid) {
  try {
    await db.query(queries.query_deletemenuitemcategories(req));
    if (req.body && req.body.categories && req.body.categories.length > 0)
      await db.query(queries.query_addmenuitemcategories(menuitemid, req.body.categories));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getMenuItems,
  getServiceItems,
  getServiceItemsByGroup,
  getMenuItem,
  addMenuItem,
  addMenuCategories,
  editMenuItem,
  deleteItem,
  fixMenuItemsOrderNo
}