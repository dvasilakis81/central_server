var queries = require('./Queries');
const db = require('../../dbConfig');

async function getAnnouncements(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_getannouncements(req));
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
    return rows[0];
  } catch (error) {
    console.log(error);
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

async function getAnnouncements(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_getannouncements());
    return rows;
  } catch (error) {
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
  deleteItem
}