var queries = require('./Queries');
const db = require('../../dbConfig');

async function getMenuItems(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_getmenuitems(req));
    return rows;
  } catch (error) {
    next(error);
  }
}

async function getMenuItem(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_getmenuitem(req));
    return rows;
  } catch (error) {
    next(error);
  }
}

async function addMenuItem(req, res, next) {

  try {
    await db.query(queries.query_addmenuitem(req));
    const [rows] = await db.query(queries.query_selectlastinserteditem('menu'));
    return rows[0];
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function editMenuItem(req, res, next) {

  try {
    //const [rows] = await db.query(queries.query_selectlastinserteditem('menu'));
    const [rows] = await db.query(queries.query_editmenuitem(req));
    return rows[0];
  } catch (error) {
    console.log(error);
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

module.exports = {
  getMenuItems,
  getMenuItem,
  addMenuItem,
  editMenuItem,
  deleteItem
}