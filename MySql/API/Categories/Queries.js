const util = require('util');
const helper = require('../../helpermethods');

function query_getcategories(req) {
  return 'Select * From `categories` Order By Name Asc';
}
function query_getcategoriesLevelZero(req) {
  return 'Select * From `categories` Where ParentId = 0 Order By Name Asc';
}
function query_getcategory(req) {
  var id = req.body.id;
  return 'Select * From `central`.`categories` Where Id =' + id;
}
function query_selectlastinserteditem(table) {
  return util.format('SELECT * FROM `central`.`%s` WHERE `id`= LAST_INSERT_ID()', table);
}
function query_addcategory(req) {
  
  var name = req.body.categoryname;  
  
  var sqlQuery = 'INSERT INTO `central`.`categories` (Name) VALUES ';
  sqlQuery += util.format('(%s)', helper.addQuotes(name));

  return sqlQuery;
}
function query_editcategory(req) {

  var id = req.body.id;
  var name = req.body.name;
  var shortname = req.body.shortname;

  var sqlQuery = util.format('UPDATE `central`.`categories` SET Name=%s, ShortName=%s WHERE Id=%s',
    helper.addQuotes(name),
    helper.addQuotes(shortname),
    id);
  
  return sqlQuery;
}

function query_deleteitem(req){
  return 'Delete From `central`.`categories` Where Id=' + req.body.id;
}

function query_categoryhasservices(categoryid){
  return 'Select * From `central`.`servicecategories` Where categoryid=' + categoryid;
}
function query_categoryhasannouncements(categoryid){
  return 'Select * From `central`.`announcementcategories` Where categoryid=' + categoryid;
}
module.exports = {
  query_getcategories,  
  query_getcategoriesLevelZero,
  query_getcategory,
  query_addcategory,
  query_selectlastinserteditem,
  query_editcategory,
  query_deleteitem,
  query_categoryhasservices,
  query_categoryhasannouncements
}