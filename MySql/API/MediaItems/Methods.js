
var queries = require('./Queries');
var os = require("os");
const db = require('../../dbConfig');
const path = require('path');
const util = require('util');

async function getMediaItems(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_getmediaitems(req));
    return rows;
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
  const newpath = global.appRoot + "\\files\\";
  //const networkPath = util.format('%s', req.protocol, req.get('host'));
  const file = req.files.file;
  const filename = Buffer.from(file.name, 'latin1').toString('utf8');
  const extension = path.extname(filename);
  var ret = await file.mv(`${newpath}${filename}`);  
  
  if (ret === undefined)
    ret = `files/${filename}`;
  else
    ret = 'ERROR: ' + ret;

  // await file.mv(`${newpath}${filename}`, (err) => {
  //   if (err)
  //     return false;//res.status(500).send({ message: "File upload failed", code: 200 });    
  //   return true; //res.status(200).send({ message: "File Uploaded", code: 200 });
  // });
  return ret;
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
  addMediaToDirectory,
  deleteItem
}