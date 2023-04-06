var queries = require('./Queries');
const db = require('../../dbConfig');

async function getCategories(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_getcategories(req));
    return rows;
  } catch (error) {
    next(error);
  }
}

async function getCategory(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_getcategory(req));
    return rows;
  } catch (error) {
    next(error);
  }
}

async function addCategory(req, res, next) {

  try {
    await db.query(queries.query_addcategory(req));
    const [rows] = await db.query(queries.query_selectlastinserteditem('categories'));
    return rows[0];
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function editCategory(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_editcategory(req));
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
  getCategories,
  getCategory,
  addCategory,
  editCategory,
  deleteItem
}