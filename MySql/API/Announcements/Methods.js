var queries = require('./Queries');
const db = require('../../dbConfig');

function fixCategoriesInfoArray(rows) {
  if (rows) {
    for (var i = 0; i < rows.length; i++) {
      var ti = JSON.parse(rows[i].categoriesInfo);
      var t2 = '[' + ti + ']';
      rows[i].categoriesInfo = JSON.parse(t2);
    }
  }
  return rows;
}
async function getAnnouncements(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_getannouncements(req));
    return fixCategoriesInfoArray(rows);
  } catch (error) {
    next(error);
  }
}
async function getAnnouncement(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_getannouncement(req.body.id));
    return fixCategoriesInfoArray(rows);;
  } catch (error) {
    next(error);
  }
}
async function addAnnouncement(req, res, next) {

  try {
    await db.query(queries.query_addannouncement(req));
    const [rows1] = await db.query(queries.query_selectlastinserteditem('announcements'));
    await db.query(queries.query_additemcategories(rows1[0].Id, req.body.categories));
    const [rows2] = await db.query(queries.query_getannouncement(rows1[0].Id));
    if (rows2 && rows2.length > 0)
      return fixCategoriesInfoArray(rows2)[0];
    else
      return null;
      
  } catch (error) {
    next(error);
  }
}
async function addCategories(req, res, next, itemid) {
  try {
    await db.query(queries.query_deletecategories(req));
    if (req.body && req.body.categories && req.body.categories.length > 0)
      await db.query(queries.query_additemcategories(itemid, req.body.categories));
  } catch (error) {
    next(error);
  }
}
async function editAnnouncement(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_editannouncement(req));
    return rows;
  } catch (error) {
    console.log(error);
    next(error);
  }
}
async function deleteItem(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_deleteannouncement(req));
    return rows;
  } catch (error) {
    next(error);
  }
}
module.exports = {
  getAnnouncements,
  getAnnouncement,
  addAnnouncement,
  editAnnouncement,
  getAnnouncements,
  addCategories,
  deleteItem
}