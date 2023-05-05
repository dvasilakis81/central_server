const util = require('util');
const helper = require('../../helpermethods');

function query_getpageitems(req) {
  return 'SELECT *,json_array((select GROUP_CONCAT(json_object(\'pageid\',t.PageId,\'tabid\',t.TabId, \'tabtitle\',t.TabTitle, \'taburl\',t.TabUrl,\'taborder\',t.OrderNo)) from tabs t where t.PageId=p.Id)) as tabsInfo, json_array((select GROUP_CONCAT(json_object(\'pageid\',c.PageId,\'commentid\',c.Id, \'firstname\',c.Firstname, \'lastname\',c.Lastname,\'content\',c.Content, \'created\',c.Created)) from comments c where c.PageId=p.Id)) as comments FROM pages p';
}
function query_getpageitem(req) {
  return 'Select * From `central`.`pages` Where Id=' + req.body.Id;
}
function query_selectlastinserteditem(table) {
  return util.format('SELECT * FROM `%s` WHERE `id`= LAST_INSERT_ID()', table);
}
function query_getpageinfo(table, url) {
  return util.format('SELECT *,json_array((select GROUP_CONCAT(json_object(\'pageid\',t.PageId,\'tabid\',t.TabId, \'tabtitle\',t.TabTitle, \'taburl\',t.TabUrl, \'taborder\',t.OrderNo)) from tabs t where t.pageid=p.Id order by orderno asc)) as tabsInfo, json_array((select GROUP_CONCAT(json_object(\'pageid\',c.PageId,\'commentid\',c.Id, \'firstname\',c.Firstname, \'lastname\',c.Lastname,\'content\',c.Content, \'created\',c.Created)) from comments c where c.PageId=p.Id)) as comments FROM `%s` as p WHERE Url= %s', table, helper.addQuotes(url));
}
function query_addpageitem(req) {

  // INSERT INTO table_name (column1, column2, column3, ...) VALUES (value1, value2, value3, ...);

  // return util.format('SELECT * FROM "Ordering"."Contract" as c ' + 
  // 'INNER JOIN "Ordering"."Account" as a ' +
  // ' ON a."ContractId"=c."Id"')
  var pageTitle = req.body.Title;
  var pageBody = req.body.Body;
  var url = req.body.Url;
  var hasComments = req.body.hasComments || false;  

  var sqlQuery = 'INSERT INTO `pages` (Title,  Url, Body, HasComments) VALUES ';
  sqlQuery += util.format('(%s,%s,%s,%s)',
    helper.addQuotes(pageTitle),
    helper.addQuotes(url),
    helper.addQuotes(pageBody),
    hasComments);
  
  return sqlQuery;
}

function query_deletepageitemtabs(pageItem) {
  var sqlQuery = util.format('DELETE FROM `tabs` WHERE PageId=%s', pageItem.Id);
  return sqlQuery;
}
function query_addpageitemtabs(req, pageItem) {

  var pageId = pageItem.Id;
  var pageTitle = pageItem.Title;
  var pageUrl = pageItem.Url;  
  var pageTabs = req.body.Tabs;

  if (pageTabs && pageTabs.length > 0) {
    var sqlQuery = 'INSERT INTO `tabs` (PageId,PageTitle,TabId,TabTitle,TabUrl,OrderNo) VALUES ';
    for (var i = 0; i < pageTabs.length; i++)
      sqlQuery += util.format('(%s,%s,%s,%s,%s,%s)%s', 
      pageId, 
      helper.addQuotes(pageTitle), 
      pageTabs[i].Id, 
      helper.addQuotes(pageTabs[i].Title), 
      helper.addQuotes(pageTabs[i].Url),
      i + 1,
      i < pageTabs.length - 1 ? ',' : '');
  }
  return sqlQuery;
}
function query_editpageitem(req) {
  var id = req.body.Id;
  var title = req.body.Title;
  var body = req.body.Body;
  var url = req.body.Url;
  var hasComments = req.body.HasComments || false;

  var sqlQuery = util.format('UPDATE `pages` SET Title=%s, Url=%s,Body=%s,HasComments=%s WHERE Id=%s',
    helper.addQuotes(title),
    helper.addQuotes(url),
    helper.addQuotes(body),
    hasComments,
    id);

  return sqlQuery;
}
function query_fixpagetitleifistab(req) {
  var id = req.body.Id;
  var title = req.body.Title;

  var sqlQuery = util.format('UPDATE `tabs` SET TabTitle=%s WHERE TabId=%s', helper.addQuotes(title), id);
  return sqlQuery;
}

function query_deleteitem(req) {
  return 'Delete From `central`.`pages` Where Id=' + req.body.id;
}

module.exports = {
  query_getpageitems,
  query_getpageitem,
  query_addpageitem,
  query_editpageitem,
  query_selectlastinserteditem,
  query_getpageinfo,
  query_addpageitemtabs,
  query_deletepageitemtabs,  
  query_fixpagetitleifistab,
  query_deleteitem
}