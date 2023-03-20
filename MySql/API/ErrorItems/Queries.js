const util = require('util');
const helper = require('../../helpermethods');

function query_geterroritems(req) {
  return 'Select * From `logerror` Order By Inserted Asc';
}
function query_selectlastinserteditem(table) {
  return util.format('SELECT * FROM `%s` WHERE `id`= LAST_INSERT_ID()', table);
}

function query_adderroritem(item) {

  // INSERT INTO table_name (column1, column2, column3, ...) VALUES (value1, value2, value3, ...);

  // return util.format('SELECT * FROM "Ordering"."Contract" as c ' + 
  // 'INNER JOIN "Ordering"."Account" as a ' +
  // ' ON a."ContractId"=c."Id"')
  var code = item.code;
  var errno = item.errno;
  var message = item.message;
  var sql1 = item.sql;
  var sqlMessage = item.sqlMessage;
  var sqlState = item.sqlState;

  var sqlQuery = 'INSERT INTO `logerror` (code,errno,message,sql1,sqlMessage,sqlState1) VALUES ';
  sqlQuery += util.format('(%s,%s,%s,%s,%s,%s)',
    helper.addQuotes(code),
    errno || 0,
    helper.addQuotes(message),
    helper.addQuotes(sql1),
    helper.addQuotes(sqlMessage),
    helper.addQuotes(sqlState));

  return sqlQuery;
}

module.exports = {
  query_adderroritem,
  query_geterroritems
}