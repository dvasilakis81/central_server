const util = require('util');
const helper = require('../../helpermethods');

function query_geterroritems(req) {
  return 'Select * From `logerror` Order By Created Desc LIMIT 15';
}
function query_selectlastinserteditem(table) {
  return util.format('SELECT * FROM `%s` WHERE `id`= LAST_INSERT_ID()', table);
}
function query_adderroritem(item) {

  var code = item.code;
  var errno = item.errno;
  var message = item.message;
  var sql1 = item.sql;
  var sqlMessage = item.sqlMessage;
  var sqlState = item.sqlState;

  var sqlQuery = 'INSERT INTO `logerror`(Code,Errno,Message,Sql,SqlMessage,SqlState) VALUES ';
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