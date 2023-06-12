const util = require('util');
const helper = require('../../helpermethods');

function query_getusers(req) {
  return 'Select * From `central`.`users` Order By Created Asc ';  
}
function query_getuser(id) {
  var sqlQuery = 'Select * From `central`.`users` Where Id=' + id
  return sqlQuery;
}
function query_selectlastinserteditem(table) {
  return util.format('SELECT * FROM `central`.`%s` WHERE `id`= LAST_INSERT_ID()', table);
}
function query_adduser(req) {

  var username = req.body.username;
  var password = req.body.password;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var image = req.body.image;
  var showonfirstpage = req.body.Showonfirstpage;  

  var sqlQuery = 'INSERT INTO `central`.`users` (Username,Password,Firsname,Lastname,Role,Email) VALUES ';
  sqlQuery += util.format('(%s,%s,%s,%s,%s)',
    helper.addQuotes(title),
    helper.addQuotes(description),
    helper.addQuotes(image),
    showonfirstpage || 0,
    hidden || 0);

  return sqlQuery;
}
function query_edituser(req) {

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
function query_additemcategories(itemid, categories) {

  var sqlQuery = 'INSERT INTO `announcementcategories` (announcementid, categoryid) VALUES ';
  for (var i = 0; i < categories.length; i++)
    sqlQuery += util.format('(%s,%s)%s', itemid, categories[i].Id, (i < categories.length - 1 ? ',' : ''));

  return sqlQuery;
}
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

module.exports = {
  query_getusers,
  query_getuser,
  query_adduser,
  query_edituser,
  query_selectlastinserteditem,
  query_additemcategories,
  query_checkloginusername,
  query_insertloginuser
}