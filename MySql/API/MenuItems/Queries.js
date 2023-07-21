const util = require('util');
const helper = require('../../helpermethods');

function getCategoriesInfo() {
  return ', json_array((' +
    'select GROUP_CONCAT(json_object(\'Id\',c.categoryid, \'Name\',cat.Name)) ' +
    'from servicecategories c inner join categories as cat ON c.categoryid=cat.Id ' +
    'where c.serviceid=m.Id)) as categoriesInfo ';
}
function query_getmenuitems() {
  return 'Select *' + getCategoriesInfo() + 'from menu m where MenuItem=1 Order By MenuOrderNo ASC';
}
function query_getcategoryannouncements() {
  return ',json_array((select GROUP_CONCAT(json_object(\'Id\', a.Id, \'Title\', a.Title, \'Description\', a.Description, \'Created\', a.Created )) ' +
    'from announcements a ' +
    'inner join announcementcategories anc on a.Id=anc.announcementid ' +
    'where cat.Id=anc.categoryid and a.Hidden =0 ' +
    'Order By a.Created Desc)) as announcementsInfo '
}
function query_getcategoryservices() {
  return ',json_array((select GROUP_CONCAT(json_object(\'Id\', m.Id, \'Name\', m.Name, ' +
    '\'Url\', m.Url, \'ServiceOrderNo\', m.ServiceOrderNo, ' +
    '\'ImageService\', m.ImageService, \'ImageMenu\', m.ImageMenu, \'Hidden\', m.Hidden)) ' +
    'from menu m ' +
    'inner join servicecategories sc2 on m.Id=sc2.serviceid and m.ServiceItem = 1 ' +
    'where cat.Id=sc2.categoryid and m.Hidden = 0)) as servicesInfo '
}
function query_getcategorymedia() {
  return ',json_array((select GROUP_CONCAT(json_object(\'Id\', md.Id, \'Name\', md.Name, ' +
    '\'Url\', md.Url, \'Title\', md.Title)) ' +
    'from media md ' +
    'inner join mediacategories mc on md.Id=mc.mediaid ' +
    'where cat.Id=mc.categoryid)) as mediaInfo '
}
function query_getserviceitemsbygroup() {
  var mysqlQuery = 'Select *' +
  query_getcategoryservices() +
  query_getcategoryannouncements() +
  query_getcategorymedia() + 
  'from categories cat ' + 
  //'left join servicecategories sc on cat.Id=sc.categoryid ' +  
  'group by Id ' +
  'order by cat.OrderNo desc, cat.Name asc ';

  return mysqlQuery;
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

  var sqlQuery = 'INSERT INTO `menu` (Name, Url, PageUrl, ImageService, ImageMenu, Hidden, IsDeleted, MenuItem, ServiceItem, MenuOrderNo, ServiceOrderNo) VALUES ';
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

  if (categories) {
    var sqlQuery = 'INSERT INTO `servicecategories` (serviceid, categoryid) VALUES ';
    for (var i = 0; i < categories.length; i++)
      sqlQuery += util.format('(%s,%s)%s', menuitemid, categories[i].Id, (i < categories.length - 1 ? ',' : ''));

    return sqlQuery;
  }
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
    if (serviceItem === 1 || serviceItem === true)
      sqlQuery = util.format('UPDATE `menu` SET ServiceOrderNo=ServiceOrderNo + 1 WHERE ServiceOrderNo>=%s AND ServiceItem=1 AND Id!=%s', serviceOrderNo, id);
    if (menuItem === 1 || menuItem === true)
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