const util = require('util');
const helper = require('../../helpermethods');

function query_getmenuitems(req) {
  return 'Select *,json_array((select GROUP_CONCAT(json_object(\'pageid\',t.PageId,\'tabid\',t.TabId, \'tabtitle\',t.TabTitle, \'taburl\',t.TabUrl,\'taborder\',t.OrderNo)) from tabs t where t.PageId=p.Id)) as tabsInfo, json_array((select GROUP_CONCAT(json_object(\'pageid\',c.PageId,\'commentid\',c.Id, \'firstname\',c.Firstname, \'lastname\',c.Lastname,\'content\',c.Content, \'created\',c.Created)) from comments c where c.PageId=p.Id)) as comments FROM pages p';
  return 'Select * From `menu` Order By OrderNo Asc';
}
function query_getmenuitem(req) {
  var id = req.body.id;
  return 'Select * From `menu` Where Id =' + id;
}

function query_selectlastinserteditem(table) {
  return util.format('SELECT * FROM `%s` WHERE `id`= LAST_INSERT_ID()', table);
}
function query_addmenuitem(req) {  
  var name = req.body.name;
  var url = req.body.url;
  var pageUrl = req.body.pageUrl;
  var imageService = req.body.imageService;
  var imageMenu = req.body.imageMenu;
  var hidden = req.body.hidden;
  var isDeleted = req.body.deleted;
  var category = '';
  var menuItem = req.body.menuItem;
  var serviceItem = req.body.serviceItem;
  var orderNo = req.body.orderNo;

  var sqlQuery = 'INSERT INTO `menu` (Name, Url, PageUrl, ImageService, ImageMenu, Hidden, IsDeleted, Category, MenuItem, ServiceItem, OrderNo) VALUES ';
  sqlQuery += util.format('(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)',
    helper.addQuotes(name),
    helper.addQuotes(url),
    helper.addQuotes(pageUrl),
    helper.addQuotes(imageService),
    helper.addQuotes(imageMenu),
    hidden,
    isDeleted,
    helper.addQuotes(category),
    menuItem,
    serviceItem,
    orderNo);

  return sqlQuery;
}
function query_editmenuitem(req) {

  var id = req.body.id;
  var name = req.body.name;
  var url = req.body.url;
  var pageUrl = req.body.pageUrl;
  var imageService = req.body.imageService;
  var imageMenu = req.body.imageMenu;
  var announce = req.body.announce;
  var hidden = req.body.hidden;
  var deleted = req.body.deleted;
  var category = req.body.category;
  var menuItem = req.body.menuItem;
  var serviceItem = req.body.serviceItem;
  var orderNo = req.body.orderNo;

  var sqlQuery = util.format('UPDATE `menu` SET Name=%s, Url=%s,PageUrl=%s, ImageService=%s,ImageMenu=%s,Hidden=%s,IsDeleted=%s,Category=%s,MenuItem=%s,ServiceItem=%s,Announce=%s,OrderNo=%s WHERE Id=%s',
    helper.addQuotes(name),
    helper.addQuotes(url),
    helper.addQuotes(pageUrl),
    helper.addQuotes(imageService),
    helper.addQuotes(imageMenu),    
    hidden,
    deleted,
    helper.addQuotes(category),
    menuItem,
    serviceItem,
    announce,
    orderNo,
    id);
  
  return sqlQuery;
}

function query_getannouncements(){
  return 'Select * From `central`.`menu` Where Announce=1'; 
}

function query_deleteitem(req){
  return 'Delete From `central`.`menu` Where Id=' + req.body.id;
}

module.exports = {
  query_getmenuitems,
  query_getmenuitem,
  query_addmenuitem,
  query_selectlastinserteditem,
  query_editmenuitem,
  query_getannouncements,
  query_deleteitem
}