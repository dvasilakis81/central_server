const util = require('util');
const helper = require('../../helpermethods');
const requestIp = require('request-ip');
const methods = require('./Methods');

function query_getphonecatalogitems(req) {
  var sqlQuery = 'SELECT Fullname, Phone, Internal FROM `central`.`phonecatalog` as p';
  return sqlQuery;
}
function query_searchphonecatalogitems(req) {
  var sqlQuery = '';

  if (req.body.searchfield === 1)
    sqlQuery = util.format('SELECT Fullname, Phone, Internal FROM `central`.`phonecatalog` WHERE Fullname LIKE \'%%%s%\'', req.body.searchtext);
  else if (req.body.searchfield === 2)
    sqlQuery = util.format('SELECT Fullname, Phone, Internal FROM `central`.`phonecatalog` WHERE Phone LIKE \'%%%s%\'', req.body.searchtext);
  else if (req.body.searchfield === 3)
    sqlQuery = util.format('SELECT Fullname, Phone, Internal FROM `central`.`phonecatalog` WHERE Internal LIKE \'%%%s%\'', req.body.searchtext);

  return sqlQuery;
}
function query_getphonecatalogitems(req) {
  var sqlQuery = 'SELECT Fullname, Phone, Internal FROM `central`.`phonecatalog` as p';
  return sqlQuery;
}
// async function query_addphonecatalogitems(req) {
//   var excelData = req.body.excelData;
//   if (excelData) {
//     var fullname = '';
//     var phone = '';
//     var internal = '';
//     var direction = '';
//     var email = '';
//     var sqlQuery = 'INSERT INTO `phonecatalog` (fullname, phone, internal, direction, email) VALUES ';
//     for (var i = 3; i < excelData.length; i++) {
//       fullname = excelData[i][13];
//       phone = excelData[i][2];
//       internal = excelData[i][6];
//       direction = excelData[i][12];
//       email = excelData[i][14];

//       if (await methods.checkIfPhoneAlreadyExists(phone) === false)
//         sqlQuery += util.format('(%s,%s,%s,%s,%s)%s', fullname, phone, internal, direction, email, (i < excelData.length - 1 ? ',' : ''));
//     }

//     return sqlQuery;
//   }
// }

function query_addphonecatalogitem(excelData) {
  var sqlQuery = 'INSERT INTO `central`.`phonecatalog` (Fullname, Phone, Internal, Direction, Email) VALUES ';
  if (excelData) {
    var fullname = excelData[13];
    var phone = excelData[2];
    var internal = excelData[6];
    var direction = excelData[12];
    var email = excelData[14];
    sqlQuery += util.format('(%s,%s,%s,%s,%s)',
      helper.addQuotes(fullname),
      helper.addQuotes(phone),
      helper.addQuotes(internal),
      helper.addQuotes(direction),
      helper.addQuotes(email));
  }

  return sqlQuery;
}

function query_checkifalreadyexists(excelData) {
  var phoneNumber = excelData[6];
  var sqlQuery = 'Select * From `central`.`phonecatalog` Where internal=' + helper.addQuotes(phoneNumber);
  return sqlQuery;
}

module.exports = {
  query_getphonecatalogitems,
  query_addphonecatalogitem,
  query_checkifalreadyexists,
  query_searchphonecatalogitems
}