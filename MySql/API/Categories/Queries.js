const util = require('util');
const helper = require('../../helpermethods');

function query_getcategories(req) {
  return 'Select * From `categories` Order By Name Asc';
}
function query_getcategoriesLevelZero(req) {
  return 'Select * From `categories` Order By Name Asc';
}
function query_getallcategorieswithnosubcategories(req) {
  return 'Select * From `categories` Where HasSubCategories = 0 Order By Name Asc';
}
function query_getcategory(req) {
  var id = req.body.id;
  return 'Select * From `central`.`categories` Where Id =' + id;
}
function query_selectlastinserteditem(table) {
  return util.format('SELECT * FROM `central`.`%s` WHERE `id`= LAST_INSERT_ID()', table);
}
function query_addcategory(req) {
  
  var name = req.body.name;  
  var hasSubCategories = req.body.hassubcategories;
  var parentId = req.body.parentid;

  var sqlQuery = 'INSERT INTO `central`.`categories` (Name, HasSubCategories, ParentId) VALUES ';
  sqlQuery += util.format('(%s, %s, %s)', helper.addQuotes(name), hasSubCategories, parentId);

  return sqlQuery;
}
function query_editcategory(req) {

  var id = req.body.id;
  var name = req.body.name;
  var hasSubCategories = req.body.hassubcategories;
  var parentid = req.body.parentid;

  var sqlQuery = util.format('UPDATE `central`.`categories` SET Name=%s, HasSubCategories=%s, ParentId=%s  WHERE Id=%s',
    helper.addQuotes(name),
    hasSubCategories,
    parentid,
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
  query_getallcategorieswithnosubcategories,
  query_getcategory,
  query_addcategory,
  query_selectlastinserteditem,
  query_editcategory,
  query_deleteitem,
  query_categoryhasservices,
  query_categoryhasannouncements
}