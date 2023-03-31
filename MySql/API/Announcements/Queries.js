const util = require('util');
const helper = require('../../helpermethods');

function query_getannouncements(req) {
  return 'Select * From `central`.`announcements` Order By OrderNo Asc';
}
function query_getannouncement(req) {

  // return util.format('SELECT * FROM "Ordering"."Contract" as c ' + 
  // 'INNER JOIN "Ordering"."Account" as a ' +
  // ' ON a."ContractId"=c."Id"')
  var id = req.body.id;
  return 'Select * From `central`.`announcements` Where Id =' + id;
}
function query_selectlastinserteditem(table) {
  return util.format('SELECT * FROM `central`.`%s` WHERE `id`= LAST_INSERT_ID()', table);
}
function query_addannouncement(req) {

  // INSERT INTO table_name (column1, column2, column3, ...) VALUES (value1, value2, value3, ...);

  // return util.format('SELECT * FROM "Ordering"."Contract" as c ' + 
  // 'INNER JOIN "Ordering"."Account" as a ' +
  // ' ON a."ContractId"=c."Id"')
  var description = req.body.description;
  var url = req.body.url;
  var color = req.body.color;
  var backgroundColor = req.body.backgroundColor;
  var image = req.body.image;
  var showonfirstpage = req.body.Showonfirstpage;
  var hidden = req.body.Hidden;
  var orderNo = req.body.OrderNo;  

  var sqlQuery = 'INSERT INTO `central`.`announcements` (Description, Url, Color, BackgroundColor, image, Showonfirstpage, Hidden, OrderNo) VALUES ';
  sqlQuery += util.format('(%s,%s,%s,%s,%s,%s,%s,%s)',
    helper.addQuotes(description),
    helper.addQuotes(url),
    helper.addQuotes(color),
    helper.addQuotes(backgroundColor),
    helper.addQuotes(image),
    showonfirstpage || 0,
    hidden || 0, 
    orderNo || 1);

  return sqlQuery;
}
function query_editannouncement(req) {

  var id = req.body.id;
  var description = req.body.description;
  var url = req.body.url;
  var color = req.body.color;
  var backgroundColor = req.body.backgroundColor;
  var image = req.body.image;
  var showonfirstpage = req.body.showonfirstpage;
  var hidden = req.body.hidden;
  var orderNo = req.body.orderNo;  

  var sqlQuery = util.format('UPDATE `central`.`announcements` SET Description=%s, Url=%s, color=%s, backgroundColor=%s, image=%s, showonfirstpage=%s, hidden=%s, orderNo=%s WHERE Id=%s',
    helper.addQuotes(description),
    helper.addQuotes(url),
    helper.addQuotes(color),
    helper.addQuotes(backgroundColor),
    helper.addQuotes(image),
    showonfirstpage,
    hidden,
    orderNo,
    id);
  
  return sqlQuery;
}
function query_getannouncements(){
  return 'Select * From `central`.`announcements`';
}
function query_deleteannouncement(req) {
  return 'Delete From `central`.`announcements` Where Id=' + req.body.id;
}
module.exports = {
  query_getannouncements,
  query_getannouncement,
  query_addannouncement,
  query_selectlastinserteditem,
  query_editannouncement,
  query_getannouncements,
  query_deleteannouncement
}