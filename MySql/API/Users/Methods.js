var queries = require('./Queries');
const db = require('../../dbConfig');
const bcryptNodejs = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

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
async function getUsers(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_getusers(req));
    return rows;
  } catch (error) {
    next(error);
  }
}
async function addUser(req, res, next, hash) {
  await db.query(queries.query_insertloginuser(req, hash));
  const [rows] = await db.query(queries.query_selectlastinserteditem('users'));
  return rows[0];
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
async function editUser(req, res, next, hash) {

  try {
    const [rows] = await db.query(queries.query_edituser(req));
    return rows;
  } catch (error) {
    console.log(error);
    next(error);
  }
}
async function getUser(req, res, next, hash) {

  try {
    const [rows] = await db.query(queries.query_getuser(req));
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

async function checkLoginUserName(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_checkloginusername(req));
    return rows;
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUsers,
  addUser,
  editUser,
  getUser,
  deleteItem,
  checkLoginUserName
}