const methods = require('./Methods');

async function getPageItems(req, res, next) {
  var pageItems = await methods.getPageItems(req, res, next);
  res.status(200).json(pageItems);
}
async function addPageItem(req, res, next) {
  var pageItem = await methods.addPageItem(req, res, next);
  if (req.body.Tabs && req.body.Tabs.length > 0)
    await methods.addPageTabs(req, res, next, pageItem);

  res.status(200).json(pageItem);
}
async function getPageItem(req, res, next) {
  var pageItem = await methods.getPageItem(req, res, next);
  res.status(200).json(pageItem);
}
async function editPageItem(req, res, next) {
  var pageItem = await methods.editPageItem(req, res, next);
  await methods.fixPageTitleIfIsTab(req);
  await methods.addPageTabs(req, res, next, pageItem);
  var pageItem = await methods.getPageItem(req, res, next);
  if (pageItem && pageItem.length > 0)
    res.status(200).json(pageItem[0]);
  else
    res.status(200).json(pageItem);
}
async function getPageInfo(req, res, next) {
  var pageInfo = await methods.getPageInfo(req, res, next);
  res.status(200).json(pageInfo);
}
async function addPageComment(req, res, next) {
  var pageItem = await methods.addPageComment(req, res, next);

  var serverResponse = {}
  serverResponse.success = true;
  serverResponse.itemadded = pageItem;
  res.status(200).json(serverResponse);
}

module.exports = {
  getPageItems,
  addPageItem,
  editPageItem,
  getPageInfo,
  addPageComment
}

// SELECT *,JSON_OBJECT("tabs", json_array(
//                      (select GROUP_CONCAT(json_object('pageid',t.PageId,'tabid',t.TabId))
//                       from tabs t where t.PageId=p.Id)))
// FROM pages

// select CAST(CONCAT('[',
//                 GROUP_CONCAT(
//                   JSON_OBJECT(
//                     'id',id,'parent_id',parent_id,'desc',`desc`)),
//                 ']')
//          AS JSON