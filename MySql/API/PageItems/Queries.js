const util = require('util');
const helper = require('../../helpermethods');
const requestIp = require('request-ip')

function query_getpagetabs() {
  return ',json_array((select GROUP_CONCAT(json_object(\'pageid\',t.PageId,\'tabid\',t.TabId, \'tabtitle\',t.TabTitle, \'taburl\',t.TabUrl,\'taborder\',t.OrderNo)) from tabs t where t.pageid=p.Id order by orderno asc)) as tabsInfo'
}
function query_getcomments() {
  return ',json_array((select GROUP_CONCAT(json_object(\'pageid\',c.PageId,\'commentid\',c.Id, \'firstname\',c.Firstname, \'lastname\',c.Lastname,\'content\',c.Content, \'created\',c.Created, \'isapproved\',c.IsApproved, \'isrejected\',c.IsRejected)) from comments c where c.PageId=p.Id)) as comments '
}
function query_getpageitems(req) {
  var sqlQuery = 'SELECT *' + query_getpagetabs() + query_getcomments() + ' FROM pages as p';
  return sqlQuery;
}
function query_selectlastinserteditem(table) {
  return util.format('SELECT * FROM `%s` WHERE `id`= LAST_INSERT_ID()', table);
}
function query_getpageitem(req) {
  var sqlQuery = util.format('SELECT *' + query_getpagetabs() + query_getcomments() + ' FROM `central`.`pages` as p WHERE Url= %s', helper.addQuotes(req.body.url));
  return sqlQuery;
}
function query_updatepagehit(page) {
  var sqlQuery = util.format('UPDATE pages SET hits=%s WHERE Id=%s', (page.Hits + 1), page.Id);
  return sqlQuery;
}
function query_addpageitem(req) {

  var pageTitle = req.body.Title;
  var pageBody = req.body.Body;
  var url = req.body.Url;
  var canComment = req.body.CanComment || 0;
  var commentNeedsApproval = req.body.CommentNeedsApproval || 0;

  var sqlQuery = 'INSERT INTO `pages`(Title,  Url, Body, CanComment, CommentNeedsApproval) VALUES ';
  sqlQuery += util.format('(%s,%s,%s,%s,%s)',
    helper.addQuotes(pageTitle),
    helper.addQuotes(url),
    helper.addQuotes(pageBody),
    canComment,
    commentNeedsApproval
  );

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
  var id = req.body.id;
  var title = req.body.title;
  var body = req.body.body;
  var url = req.body.url;
  var canComment = req.body.cancomment || 0;
  var commentNeedsApproval = req.body.commentneedsapproval || 0;

  var sqlQuery = util.format('UPDATE `pages` SET Title=%s,Url=%s,Body=%s,CanComment=%s,CommentNeedsApproval=%s WHERE Id=%s',
    helper.addQuotes(title),
    helper.addQuotes(url),
    helper.addQuotes(body),
    canComment,
    commentNeedsApproval,
    id);

  return sqlQuery;
}
function query_fixpagetitleifistab(req) {
  var id = req.body.id;
  var title = req.body.title;
  var sqlQuery = util.format('UPDATE `tabs` SET TabTitle=%s WHERE TabId=%s', helper.addQuotes(title), id);
  return sqlQuery;
}
function query_deleteitem(req) {
  return 'Delete From `central`.`pages` Where Id=' + req.body.id;
}
function query_addpagecomment(req) {
  var pageid = req.body.pageid;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var direction = req.body.direction;
  var department = req.body.department;
  var content = req.body.content;
  var ipaddress = requestIp.getClientIp(req);
  var isApproved = req.body.isapproved || 0;

  var sqlQuery = 'INSERT INTO `comments` (PageId, Firstname,Lastname,Direction,Department,Content,IPAddress,IsApproved) VALUES ';
  sqlQuery += util.format('(%s,%s,%s,%s,%s,%s,%s,%s)',
    pageid,
    helper.addQuotes(firstname),
    helper.addQuotes(lastname),
    helper.addQuotes(direction),
    helper.addQuotes(department),
    helper.addQuotes(content),
    helper.addQuotes(ipaddress),
    isApproved);

  return sqlQuery;
}
function query_approveorrejectcomment(req) {
  var id = req.body.id;
  var isapproved = req.body.isapproved;
  var isrejected = req.body.isrejected;

  var sqlQuery = util.format('UPDATE `comments` SET IsApproved=%s,IsRejected=%s WHERE Id=%s',
    isapproved,
    isrejected,
    id);

  return sqlQuery;
}
module.exports = {
  query_getpageitems,
  query_getpageitem,
  query_addpageitem,
  query_editpageitem,
  query_selectlastinserteditem,
  query_addpageitemtabs,
  query_deletepageitemtabs,
  query_fixpagetitleifistab,
  query_deleteitem,
  query_addpagecomment,
  query_approveorrejectcomment,
  query_updatepagehit
}