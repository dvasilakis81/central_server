const util = require('util');

function getCategoriesInfo() {
  return ', json_array((' +
    'select GROUP_CONCAT(json_object(\'menuid\',c.menuid,\'categoryid\',c.categoryid, \'Name\',cat.Name))' +
    'from servicecategories c inner join categories as cat ON c.categoryid=cat.Id ' +
    'where c.menuid=m.Id)) as categoriesInfo ';
}
function query_getmenuitems() {
  return 'Select *' + getCategoriesInfo() + 'from menu m where MenuItem=1 Order By MenuOrderNo ASC';
}
function query_getserviceitems() {
  return 'Select *' + getCategoriesInfo() + 'from menu m where ServiceItem=1 Order By ServiceOrderNo ASC';
}
function query_getmenuitem(req) {
  return 'Select * ' + getCategoriesInfo() + 'From `menu` as m Where Id =' + req.body.id;
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
  var menuItem = req.body.menuItem;
  var serviceItem = req.body.serviceItem;
  var menuOrderNo = req.body.menuOrderNo;
  var serviceOrderNo = req.body.serviceOrderNo;

  var sqlQuery = 'INSERT INTO `menu` (Name, Url, PageUrl, ImageService, ImageMenu, Hidden, IsDeleted MenuItem, ServiceItem, MenuOrderNo, ServiceOrderNo) VALUES ';
  sqlQuery += util.format('(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)',
    helper.addQuotes(name),
    helper.addQuotes(url),
    helper.addQuotes(pageUrl),
    helper.addQuotes(imageService),
    helper.addQuotes(imageMenu),
    hidden,
    isDeleted,
    menuItem,
    serviceItem,
    menuOrderNo,
    serviceOrderNo);

  return sqlQuery;
}

function query_addmenuitemcategories(menuitemid, categories) {

  var sqlQuery = 'INSERT INTO `servicecategories` (menuid, categoryid) VALUES ';
  for (var i = 0; i < categories.length; i++)
    sqlQuery += util.format('(%s,%s)%s', menuitemid, categories[i].Id, (i < categories.length - 1 ? ',' : ''));

  return sqlQuery;
}

function query_editmenuserviceitemsorderno(req) {

  var id = req.body.id;
  var menuOrderNo = req.body.menuOrderNo;
  var oldMenuOrderNo = req.body.oldMenuOrderNo;
  var serviceOrderNo = req.body.serviceOrderNo;
  var oldServiceOrderNo = req.body.oldServiceOrderNo;
  var menuItem = req.body.menuItem;
  var serviceItem = req.body.serviceItem;
  var sqlQuery = '';

  if (oldServiceOrderNo) {
    if (oldServiceOrderNo < serviceOrderNo) {
      if (serviceItem === 1)
        sqlQuery = util.format('UPDATE `menu` SET ServiceOrderNo=ServiceOrderNo + 1 WHERE ServiceOrderNo>=%s AND ServiceOrderNo<=%s AND ServiceItem=1 AND Id!=%s', oldServiceOrderNo, serviceOrderNo, id);
      if (menuItem === 1)
        sqlQuery = util.format('UPDATE `menu` SET MenuOrderNo=MenuOrderNo + 1 WHERE MenuOrderNo>=%s AND MenuOrderNo<=%s AND MenuItem=1 AND Id!=%s', oldMenuOrderNo, menuOrderNo, id);
    }
    else if (oldServiceOrderNo > serviceOrderNo)
      if (serviceItem === 1)
        sqlQuery = util.format('UPDATE `menu` SET OrderNo=OrderNo + 1 WHERE OrderNo>=%s AND OrderNo<=%s AND ServiceItem=1 AND Id!=%s', serviceOrderNo, oldServiceOrderNo, id);
      if (menuItem === 1)
        sqlQuery = util.format('UPDATE `menu` SET MenuOrderNo=MenuOrderNo + 1 WHERE MenuOrderNo>=%s AND MenuOrderNo<=%s AND MenuItem=1 AND Id!=%s', menuOrderNo, oldMenuOrderNo, id);
  } else {
    if (serviceItem === 1)
      sqlQuery = util.format('UPDATE `menu` SET ServiceOrderNo=ServiceOrderNo + 1 WHERE ServiceOrderNo>=%s AND ServiceItem=1 AND Id!=%s', serviceOrderNo, id);
    if (menuItem === 1)
      sqlQuery = util.format('UPDATE `menu` SET MenuOrderNo=MenuOrderNo + 1 WHERE MenuOrderNo>=%s AND MenuItem=1 AND Id!=%s', menuOrderNo, id);
  }

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
  var menuItem = req.body.menuItem;
  var serviceItem = req.body.serviceItem;
  var orderNo = req.body.orderNo;

  var sqlQuery = util.format('UPDATE `menu` SET Name=%s, Url=%s,PageUrl=%s, ImageService=%s,ImageMenu=%s,Hidden=%s,IsDeleted=%s,MenuItem=%s,ServiceItem=%s,Announce=%s,OrderNo=%s WHERE Id=%s',
    helper.addQuotes(name),
    helper.addQuotes(url),
    helper.addQuotes(pageUrl),
    helper.addQuotes(imageService),
    helper.addQuotes(imageMenu),
    hidden,
    deleted,
    menuItem,
    serviceItem,
    announce,
    orderNo,
    id);

  return sqlQuery;
}
function query_getannouncements() {
  return 'Select * From `central`.`menu` Where Announce=1';
}
function query_deleteitem(req) {
  return 'Delete From `central`.`menu` Where Id=' + req.body.id;
}
function query_deletemenuitemcategories(req) {
  return 'Delete From `central`.`servicecategories` Where menuid=' + req.body.id;
}

module.exports = {
  query_getmenuitems,
  query_getserviceitems,
  query_getmenuitem,
  query_addmenuitem,
  query_addmenuitemcategories,
  query_selectlastinserteditem,
  query_editmenuitem,
  query_editmenuserviceitemsorderno,
  query_getannouncements,
  query_deleteitem,
  query_deletemenuitemcategories
}