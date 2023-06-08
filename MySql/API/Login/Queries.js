
const util = require('util');
const helper = require('../../helpermethods');
const sizeOf = require('image-size')

function query_checkloginusername(req) {
  const username = req.body.username;
  var sqlQuery = 'SELECT * FROM Users as u WHERE u.Username=' + helper.addQuotes(username);
  return sqlQuery;
}
function query_insertloginuser(req, hash) {
  var sqlQuery = util.format('INSERT INTO `central`.`users`(Username,Password,Role,Firstname,Lastname,Email) VALUES(%s,%s,%s,%s,%s,%s) ',
    helper.addQuotes(req.body.username),
    helper.addQuotes(hash),
    req.body.role || 0,
    helper.addQuotes(req.body.firstname || ''),
    helper.addQuotes(req.body.lastname || ''),
    helper.addQuotes(req.body.email || ''))

  return sqlQuery;
}
function query_deleteuser(req) {
  var sqlQuery = util.format('DELETE FROM Users WHERE "Id"=%s', req.body.id);
  return sqlQuery;
}
function query_getuser(req) {
  var sqlQuery = util.format('Select * FROM Users WHERE Id=%s', req.body.id);
  return sqlQuery;
}
function query_updateuser(req, hash) {
  var ret = '';

  var id = req.body.id;
  var username = req.body.username;
  var roleid = req.body.role || 0;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var email = req.body.email;

  if (hash) {
    ret = util.format('UPDATE `central`.`users` ' +
      'SET Username=%s,Password=%s,Role=%s,Firstname=%s,Lastname=%s,Email=%s ' +
      'WHERE Id=%s ',
      helper.addQuotes(username),
      helper.addQuotes(hash),
      roleid,
      helper.addQuotes(firstname),
      helper.addQuotes(lastname),
      helper.addQuotes(email),
      id)
  } else {
    ret = util.format('UPDATE `central`.`users` ' +
      'SET Username=%s,Role=%s,Firstname=%s,Lastname=%s,Email=%s ' +
      'WHERE Id=%s ',
      helper.addQuotes(username),
      roleid,
      helper.addQuotes(firstname),
      helper.addQuotes(lastname),
      helper.addQuotes(email),
      id)
  }

  return ret;
}
function query_selectlastinserteditem(table) {
  return util.format('SELECT * FROM `central`.`%s` WHERE `id`= LAST_INSERT_ID()', table);
}

module.exports = {
  query_checkloginusername,
  query_insertloginuser,
  query_deleteuser,
  query_updateuser,
  query_getuser,
  query_selectlastinserteditem
}