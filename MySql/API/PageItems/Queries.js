const util = require('util');
const helper = require('../../helpermethods');

function query_getpageitems(req) {

  // return util.format('SELECT * FROM "Ordering"."Contract" as c ' + 
  // 'INNER JOIN "Ordering"."Account" as a ' +
  // ' ON a."ContractId"=c."Id"')
  //return 'Select * From `pages`';

  return 'SELECT *,json_array((select GROUP_CONCAT(json_object(\'pageid\',t.PageId,\'tabid\',t.TabId, \'tabtitle\',t.TabTitle)) from tabs t where t.PageId=p.Id)) as tabsInfo FROM pages p';
}
function query_getpageitem(req) {
  return 'Select * From `pages` Where Id=' + req.body.id;
}
function query_selectlastinserteditem(table) {
  return util.format('SELECT * FROM `%s` WHERE `id`= LAST_INSERT_ID()', table);
}
function query_getpageinfo(table, url) {
  return util.format('SELECT * FROM `%s` WHERE `Url`= %s', table, helper.addQuotes(url));
}
function query_addpageitem(req) {

  // INSERT INTO table_name (column1, column2, column3, ...) VALUES (value1, value2, value3, ...);

  // return util.format('SELECT * FROM "Ordering"."Contract" as c ' + 
  // 'INNER JOIN "Ordering"."Account" as a ' +
  // ' ON a."ContractId"=c."Id"')
  var pageTitle = req.body.Title;
  var pageBody = req.body.Body;
  var url = req.body.Url;

  var sqlQuery = 'INSERT INTO `pages` (Title,  Url, Body) VALUES ';
  sqlQuery += util.format('(%s,%s,%s)',
    helper.addQuotes(pageTitle),
    helper.addQuotes(url),
    helper.addQuotes(pageBody));

  console.log('sqlQuery: ' + sqlQuery);
  return sqlQuery;
}
function query_addpageitemtabs(req, pageItem) {

  var pageId = pageItem.Id;
  var pageTitle = pageItem.Title;
  var pageTabs = req.body.Tabs;

  var sqlQuery = 'INSERT INTO `tabs` (PageId, PageTitle, TabId, TabTitle) VALUES ';
  for (var i = 0; i < pageTabs.length; i++)
    sqlQuery += util.format('(%s,%s,%s,%s)%s', pageId, helper.addQuotes(pageTitle), pageTabs[i].Id, helper.addQuotes(pageTabs[i].Title), i < pageTabs. length - 1 ? ',' : '');

  return sqlQuery;
}
function query_editpageitem(req) {
  var id = req.body.Id;
  var title = req.body.Title;
  var body = req.body.Body;
  var url = req.body.Url;
  var tabs = req.body.Tabs;

  var sqlQuery = util.format('UPDATE `pages` SET Title=%s, Url=%s,Body=%s, Tabs=%s WHERE Id=%s',
    helper.addQuotes(title),
    helper.addQuotes(url),
    helper.addQuotes(body),
    helper.addQuotes(tabs),
    id);

  return sqlQuery;
}

module.exports = {
  query_getpageitems,
  query_getpageitem,
  query_addpageitem,
  query_editpageitem,
  query_selectlastinserteditem,
  query_getpageinfo,
  query_addpageitemtabs
}