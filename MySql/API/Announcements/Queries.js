const util = require('util');
const helper = require('../../helpermethods');

function getCategoriesInfo() {
  return',json_array((select GROUP_CONCAT(json_object(\'Id\',anc.categoryid, \'Name\',cat.Name)) ' +
    'from announcementcategories anc ' +
    'inner join categories as cat ON anc.categoryid=cat.Id ' +
    'where a.Id = anc.announcementid)) as categoriesInfo '
}
function query_getannouncements(req) {
  return 'Select * ' +
    getCategoriesInfo() +
    ' From `central`.`announcements` as a ' +
    ' Order By Created Asc ';

  //  return 'Select * ' + getCategoriesInfo() + ' From `central`.`announcements` Order By OrderNo Asc';
}
function query_getannouncement(id) {

  // return util.format('SELECT * FROM "Ordering"."Contract" as c ' + 
  // 'INNER JOIN "Ordering"."Account" as a ' +
  // ' ON a."ContractId"=c."Id"')
  var sqlQuery = 'Select * ' + getCategoriesInfo() + ' From `central`.`announcements` as a Where Id=' + id
  return sqlQuery;
}
function query_selectlastinserteditem(table) {
  return util.format('SELECT * FROM `central`.`%s` WHERE `id`= LAST_INSERT_ID()', table);
}
function query_addannouncement(req) {

  // INSERT INTO table_name (column1, column2, column3, ...) VALUES (value1, value2, value3, ...);

  // return util.format('SELECT * FROM "Ordering"."Contract" as c ' + 
  // 'INNER JOIN "Ordering"."Account" as a ' +
  // ' ON a."ContractId"=c."Id"')
  var title = req.body.title;
  var description = req.body.description;  
  var image = req.body.image;
  var showonfirstpage = req.body.Showonfirstpage;
  var hidden = req.body.Hidden;

  // var url = req.body.url;
  // var color = req.body.color;
  // var backgroundColor = req.body.backgroundColor;
  // var orderNo = req.body.OrderNo;  
  //var sqlQuery = 'INSERT INTO `central`.`announcements` (Title,Description, Url, Color, BackgroundColor, image, Showonfirstpage, Hidden, OrderNo) VALUES ';
  var sqlQuery = 'INSERT INTO `central`.`announcements` (Title,Description,image,Showonfirstpage,Hidden) VALUES ';
  sqlQuery += util.format('(%s,%s,%s,%s,%s)',
    helper.addQuotes(title),
    helper.addQuotes(description),
    helper.addQuotes(image),
    showonfirstpage || 0,
    hidden || 0);

  return sqlQuery;
}
function query_deletecategories(req) {
  return 'Delete From `central`.`announcementcategories` Where announcementid=' + req.body.id;
}
function query_editannouncement(req) {

  var id = req.body.id;
  var title = req.body.title;
  var description = req.body.description;
  var url = req.body.url;
  //var color = req.body.color;
  //var backgroundColor = req.body.backgroundColor;
  var image = req.body.image;
  var showonfirstpage = req.body.showonfirstpage;
  var hidden = req.body.hidden;
  //var orderNo = req.body.orderNo;

  //var sqlQuery = util.format('UPDATE `central`.`announcements` SET Title=%s,Description=%s, Url=%s, color=%s, backgroundColor=%s, image=%s, showonfirstpage=%s, hidden=%s, orderNo=%s WHERE Id=%s',
  var sqlQuery = util.format('UPDATE `central`.`announcements` SET Title=%s,Description=%s,image=%s,showonfirstpage=%s,hidden=%s WHERE Id=%s',
    helper.addQuotes(title),
    helper.addQuotes(description),    
    helper.addQuotes(image),
    showonfirstpage,
    hidden,    
    id);

  return sqlQuery;
}
// function query_getannouncements(){
//   return 'Select * From `central`.`announcements`';
// }
function query_deleteannouncement(req) {
  var sqlQuery = 'Delete From `central`.`announcements` Where Id=' + req.body.id
  return sqlQuery;
}
function query_additemcategories(itemid, categories) {

  var sqlQuery = 'INSERT INTO `announcementcategories` (announcementid, categoryid) VALUES ';
  for (var i = 0; i < categories.length; i++)
    sqlQuery += util.format('(%s,%s)%s', itemid, categories[i].Id, (i < categories.length - 1 ? ',' : ''));

  return sqlQuery;
}

module.exports = {
  query_getannouncements,
  query_getannouncement,
  query_addannouncement,
  query_selectlastinserteditem,
  query_editannouncement,
  query_getannouncements,
  query_deleteannouncement,
  query_additemcategories,
  query_deletecategories
}