const util = require('util');
const helper = require('../../helpermethods');
const sizeOf = require('image-size')

function query_getmediaitems(req) {

  // return util.format('SELECT * FROM "Ordering"."Contract" as c ' + 
  // 'INNER JOIN "Ordering"."Account" as a ' +
  // ' ON a."ContractId"=c."Id"')

  return 'Select * From `media`';
}
function query_getmediaitem(req) {
  return 'Select * From `media` Where Id=' + req.body.id;
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
  catch(error){
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

function query_deleteitem(req) {
  return 'Delete From `central`.`media` Where Id=' + req.body.id;
}

module.exports = {
  query_getmediaitems,
  query_addmediaitem,
  query_selectlastinserteditem,
  query_deleteitem, 
  query_getmediaitem
}