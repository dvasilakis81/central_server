var queries = require('./Queries');
const db = require('../../dbConfig');

async function getAnnouncements(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_getannouncements(req));
    if (rows) {
      for (var i = 0; i < rows.length; i++) {
        var ti = JSON.parse(rows[i].categoriesInfo);
        var t2 = '[' + ti + ']';
        rows[i].categoriesInfo = JSON.parse(t2);
      }
    }

    return rows;
  } catch (error) {
    next(error);
  }
}

async function getAnnouncement(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_getannouncement(req));
    return rows;
  } catch (error) {
    next(error);
  }
}

async function addAnnouncement(req, res, next) {

  try {
    await db.query(queries.query_addannouncement(req));
    const [rows] = await db.query(queries.query_selectlastinserteditem('announcements'));
    await db.query(queries.query_additemcategories(rows[0].Id, req.body.categories));
    return rows[0];
  } catch (error) {
    console.log(error);
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