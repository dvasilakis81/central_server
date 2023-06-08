var queries = require('./Queries');
const db = require('../../dbConfig');

async function checkLoginUserName(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_checkloginusername(req));
    return rows;
  } catch (error) {
    next(error);
  }
}

async function checkLoginUserPassword(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_loginuser(req));
    return rows;
  } catch (error) {
    next(error);
  }
}

async function insertLoginUser(req, res, next, hash) {

  try {
    await db.query(queries.query_insertloginuser(req, hash));
    const [rows] = await db.query(queries.query_selectlastinserteditem('users'));
    return rows[0];
  } catch (error) {
    next(error);
  }
}

async function deleteItem(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_deleteuser(req));
    return rows;
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next, hash) {

  try {
    
    const [rows] = await db.query(queries.query_updateuser(req, hash));
    return rows;
  } catch (error) {
    next(error);
  }
}

async function getUser(req, res, next) {

  try {
    
    const [rows] = await db.query(queries.query_getuser(req));
    return rows;
  } catch (error) {
    next(error);
  }
}

module.exports = {
  checkLoginUserName,
  checkLoginUserPassword,
  insertLoginUser,
  updateUser,
  getUser,
  deleteItem
}