
var queries = require('./Queries');
var os = require("os");
const db = require('../../dbConfig');
const path = require('path');
const util = require('util');
var fs = require('fs');

function fixCategoriesInfoArray(rows) {
  if (rows) {
    for (var i = 0; i < rows.length; i++) {
      var ti = JSON.parse(rows[i].categoriesInfo);
      var t2 = '[' + ti + ']';
      rows[i].categoriesInfo = JSON.parse(t2);
    }
  }
  return rows;
}
async function getMediaItems(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_getmediaitems(req));
    return fixCategoriesInfoArray(rows);
  } catch (error) {
    next(error);
  }
}
async function getMediaItem(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_getmediaitem(req.body.id));
    return fixCategoriesInfoArray(rows);
  } catch (error) {
    next(error);
  }
}
async function addMediaCategories(req, next, mediaid) {
  try {
    if (req.body["categories[]"] && req.body["categories[]"].length > 0)
      await db.query(queries.query_additemcategories(mediaid, req.body["categories[]"]));
  } catch (error) {
    next(error);
  }
}
async function addMediaItem(req, res, next, url) {

  try {
    await db.query(queries.query_addmediaitem(req, url));
    const [rows] = await db.query(queries.query_selectlastinserteditem('media'));
    return rows[0];
  } catch (error) {
    next(error);
  }
}
async function addMediaToDirectory(req, res, next) {
  //const newpath = __dirname + "/files/";
  //const networkPath = util.format('%s', req.protocol, req.get('host'));
  //const extension = path.extname(filename);

  const newpath = global.appRoot + "\\files\\";
  const file = req.files.file;
  const filename = Buffer.from(file.name, 'latin1').toString('utf8');

  if (await checkIfMediaExists(filename, next) === false) {
    var ret = await file.mv(`${newpath}${filename}`);
    if (ret === undefined)
      ret = `files/${filename}`;
    else
      ret = 'ERROR: ' + ret;
  }
  else
    res.status(200).json({ info: true, message: 'To επιλεγμένο αρχείο υπάρχει ήδη' });

  // await file.mv(`${newpath}${filename}`, (err) => {
  //   if (err)
  //     return false;//res.status(500).send({ message: "File upload failed", code: 200 });    
  //   return true; //res.status(200).send({ message: "File Uploaded", code: 200 });
  // });
  return ret;
}
async function editMediaItem(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_editmediaitem(req));
    if (rows && rows.affectedRows == 1) {
      await db.query(queries.query_deletecategories(req));
      if (req.body.categories && req.body.categories.length > 0)
        await db.query(queries.query_addcategories(req));
    }
    return rows;
  } catch (error) {
    next(error);
  }
}
async function deleteMediaFromDirectory(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_getmediaitem(req));
    if (rows && rows.length > 0) {
      var localPath = global.appRoot + '/' + rows[0].Url;
      fs.unlinkSync(localPath);
    }

    return rows[0];
  } catch (error) {
    next(error);
  }
}
async function checkIfMediaExists(filename, next) {

  try {
    const [rows] = await db.query(queries.query_checkmediaexists(filename));
    if (rows && rows.length > 0)
      return true;

    return false;
  } catch (error) {
    next(error);
  }

  return false;
}

async function deleteItem(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_deleteitem(req));
    return rows;
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getMediaItems,
  addMediaItem,
  getMediaItem,
  editMediaItem,
  addMediaToDirectory,
  deleteMediaFromDirectory,
  addMediaCategories,
  deleteItem
}