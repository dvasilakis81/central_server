const util = require('util');
const helper = require('../../helpermethods');

function getAnnouncementsInfo() {
  return ', json_array((' +
    'select GROUP_CONCAT(json_object(\'Id\',c.categoryid, \'Name\',cat.Name)) ' +
    'from announcementcategories c inner join categories as cat ON c.categoryid=cat.Id ' +
    'where c.announcementid=m.Id)) as announcementInfo ';
}
function getCategoriesInfo() {
  return ', json_array((' +
    'select GROUP_CONCAT(json_object(\'Id\',c.categoryid, \'Name\',cat.Name)) ' +
    'from servicecategories c inner join categories as cat ON c.categoryid=cat.Id ' +
    'where c.serviceid=m.Id)) as categoriesInfo ';
}
function query_getmenuitems() {
  return 'Select *' + getCategoriesInfo() + 'from menu m where MenuItem=1 Order By MenuOrderNo ASC';
}
function query_getserviceitemsbygroup() {
  return 'Select *, json_array((select GROUP_CONCAT(json_object(\'Id\', m.Id, \'Name\', m.Name, ' + 
    '\'Url\', m.Url, \'ServiceOrderNo\', m.ServiceOrderNo, ' +
    '\'ImageService\', m.ImageService, \'ImageMenu\', m.ImageMenu, \'Hidden\', m.Hidden)) ' +
    'from menu m ' +
    'inner join servicecategories sc2 on m.Id=sc2.serviceid and m.ServiceItem = 1 ' +
    'where cat.Id=sc2.categoryid and m.Hidden = 0)) as servicesInfo ' +
    'from categories cat inner join servicecategories sc on cat.Id=sc.categoryid ' +
    'group by Id ' +
    'order by cat.OrderNo desc, cat.Name asc ';    
}
function query_getserviceitems() {
  return 'Select *' + getCategoriesInfo() + ' from menu m where ServiceItem=1 Order By ServiceOrderNo ASC';
}
function query_getmenuitem(req) {
  return 'Select * ' + getCategoriesInfo() + ' From `menu` as m Where Id =' + req.body.id;
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

  var sqlQuery = 'INSERT INTO `servicecategories` (serviceid, categoryid) VALUES ';
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
  var menuOrderNo = req.body.menuOrderNo;
  var serviceOrderNo = req.body.serviceOrderNo;

  var sqlQuery = util.format('UPDATE `menu` SET Name=%s, Url=%s,PageUrl=%s, ImageService=%s,ImageMenu=%s,Hidden=%s,IsDeleted=%s,MenuItem=%s,ServiceItem=%s,Announce=%s,MenuOrderNo=%s,ServiceOrderNo=%s WHERE Id=%s',
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
    menuOrderNo,
    serviceOrderNo,
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
  return 'Delete From `central`.`servicecategories` Where serviceid=' + req.body.id;
}

module.exports = {
  query_getmenuitems,
  query_getserviceitems,
  query_getserviceitemsbygroup,
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