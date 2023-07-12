const util = require('util');
const helper = require('../../helpermethods');
const sizeOf = require('image-size')

function getCategoriesInfo() {
  return ',json_array((select GROUP_CONCAT(json_object(\'Id\',mc.categoryid, \'Name\',cat.Name)) ' +
    'from mediacategories mc ' +
    'inner join categories as cat ON mc.categoryid=cat.Id ' +
    'where m.Id = mc.mediaid)) as categoriesInfo '
}
function query_getmediaitems() {
  return 'Select *' + getCategoriesInfo() + ' From `media` as m';
}
function query_getmediaitem(mediaid) {
  return 'Select *' + getCategoriesInfo() + ' From `media` as m Where Id=' + mediaid;
}
function query_selectlastinserteditem(table) {
  return util.format('SELECT * FROM `%s` WHERE `id`= LAST_INSERT_ID()', table);
}
function query_addmediaitem(req, url) {

  var name = Buffer.from(req.files.file.name, 'latin1').toString('utf8');
  var url = url;
  var width = 0;
  var height = 0;
  try {
    width = sizeOf(url).width || 0;
    height = sizeOf(url).width || 0;
  }
  catch (error) {
  }

  var mimeType = req.files.file.mimetype || '';
  var encoding = req.files.file.encoding || '';
  var size = req.files.file.size || '';

  var sqlQuery = 'INSERT INTO `media` (Name, Url, Width, Height, MimeType, Encoding, Size) VALUES ';
  sqlQuery += util.format('(%s,%s,%s,%s,%s,%s,%s)',
    helper.addQuotes(name),
    helper.addQuotes(url),
    width,
    height,
    helper.addQuotes(mimeType),
    helper.addQuotes(encoding),
    size);

  return sqlQuery;
}
function query_editmediaitem(req, url) {

  var sqlQuery = util.format('UPDATE `central`.`media` SET Title=%s WHERE Id=%s',
    helper.addQuotes(req.body.title),
    req.body.id);

  return sqlQuery;
}
function query_deleteitem(req) {
  return 'Delete From `central`.`media` Where Id=' + req.body.id;
}
function query_deletecategories(req) {
  return 'Delete From `central`.`mediacategories` Where MediaId=' + req.body.id;
}
function query_checkmediaexists(medianame) {
  return 'Select * From `central`.`media` Where Name=' + helper.addQuotes(medianame);
}
function query_addcategories(req) {
  var mediaid = req.body.id;
  var categories = req.body.categories;

  
  var sqlQuery = 'INSERT INTO `mediacategories` (MediaId, CategoryId) VALUES ';
  for (var i = 0; i < categories.length; i++)
    sqlQuery += util.format('(%s,%s)%s', mediaid, categories[i].Id, (i < categories.length - 1 ? ',' : ''));

  return sqlQuery;
}

module.exports = {
  query_getmediaitems,
  query_addmediaitem,
  query_editmediaitem,
  query_selectlastinserteditem,
  query_deleteitem,
  query_getmediaitem,
  query_addcategories,
  query_deletecategories,
  query_checkmediaexists
}