var queries = require('./Queries');
const db = require('../../dbConfig');

async function getPhoneCatalogItems(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_getphonecatalogitems(req));
    return rows;
  } catch (error) {
    next(error);
  }
}
async function searchPhoneCatalogItems(req, res, next) {

  try {
    if (req.body.searchtext !== '') {
      const [rows] = await db.query(queries.query_searchphonecatalogitems(req));
      return rows;
    } else
      return [];
  } catch (error) {
    next(error);
  }
}
async function addPhoneCatalogItems(req, res, next) {

  try {
    if (req.body.excelData) {
      var retRows = []
      for (var i = 3; i < req.body.excelData.length; i++) {
        if (await checkIfPhoneAlreadyExists(req.body.excelData[i], next) === false) {
          const [rows] = await db.query(queries.query_addphonecatalogitem(req.body.excelData[i]));
          if (rows && rows.length === 1)
            retRows.push(rows)
        }
      }
    } else
      return [];
  } catch (error) {
    next(error);
  }
  return retRows;
}

async function checkIfPhoneAlreadyExists(phone, next) {

  try {
    const [rows] = await db.query(queries.query_checkifalreadyexists(phone));
    if (rows && rows.length === 1)
      return true;
    else
      return false;
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPhoneCatalogItems,
  addPhoneCatalogItems,
  checkIfPhoneAlreadyExists,
  searchPhoneCatalogItems
}