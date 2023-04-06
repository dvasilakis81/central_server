var queries = require('./Queries');
const db = require('../../dbConfig');

async function getErrorItems(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_geterroritems(req));
    return rows;
  } catch (error) {
    next(error);
  }
}

async function getErrorItem(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_geterroritem(req));
    return rows;
  } catch (error) {
    next(error);
  }
}

async function addErrorItem(err, next) {

  try {
    await db.query(queries.query_adderroritem(err));
    const [rows] = await db.query(queries.query_selectlastinserteditem('error'));
    return rows[0];
  } catch (error) {    
    next(error);
  }
}

module.exports = {
  getErrorItems,
  getErrorItem,
  addErrorItem
}