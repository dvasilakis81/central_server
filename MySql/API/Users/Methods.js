var queries = require('./Queries');
const db = require('../../dbConfig');
const bcryptNodejs = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

function fixRightsInfoRow(row) {
  if (row.rightsInfo) {
    var ti = JSON.parse(row.rightsInfo);
    var t2 = '[' + ti + ']';
    row.rightsInfo = JSON.parse(t2);
    if (row.rightsInfo && row.rightsInfo.length === 1) {
      if (row.rightsInfo[0].Rights)
        row.rightsInfo[0].Rights = fixRightsArray(row.rightsInfo[0].Rights);
    }
  }

  return row;
}
function fixRightsInfoArray(rows) {
  if (rows) {
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].rightsInfo) {
        var ti = JSON.parse(rows[i].rightsInfo);
        var t2 = '[' + ti + ']';
        rows[i].rightsInfo = JSON.parse(t2);
        if (rows[i].rightsInfo && rows[i].rightsInfo.length === 1) {
          if (rows[i].rightsInfo[0].Rights)
            rows[i].rightsInfo[0].Rights = fixRightsArray(rows[i].rightsInfo[0].Rights);
        }
      }
    }
  }
  return rows;
}
function fixRightsArray(userrights) {
  return JSON.parse(userrights);
}
async function getUsers(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_getusers(req));
    return fixRightsInfoArray(rows);
  } catch (error) {
    next(error);
  }
}
async function addUser(req, res, next, hash) {
  await db.query(queries.query_insertloginuser(req, hash));
  const [lastinsertedrow] = await db.query(queries.query_selectlastinserteditem('users'));
  if (lastinsertedrow && lastinsertedrow.length > 0) {
    await db.query(queries.query_adduserrights(req, lastinsertedrow[0]));
    const [rows1] = await db.query(queries.query_getuser(lastinsertedrow[0].Id));
    return fixRightsInfoRow(rows1[0]);
  }

  return undefined;
}
async function editUser(req, res, next, hash) {

  try {
    const [rows1] = await db.query(queries.query_edituser(req, hash));
    if (rows1 && rows1.affectedRows === 1) {
      const [rows2] = await db.query(queries.query_edituserrights(req));
      return rows1;
      //if (rows2 && rows2.affectedRows === 1)      
      //  return fixRightsInfoArray(rows1);
    }
  } catch (error) {
    next(error);
  }
}
async function getUser(userid, next) {

  try {
    const [rows] = await db.query(queries.query_getuser(userid));
    return fixRightsInfoArray(rows);
  } catch (error) {
    console.log(error);
    next(error);
  }
}
async function deleteItem(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_deleteuser(req));
    if (rows && rows.affectedRows === 1)
      await db.query(queries.query_deleteuserrights(req));
    return rows;
  } catch (error) {
    next(error);
  }
}
async function checkLoginUserName(req, res, next) {

  try {
    const [rows1] = await db.query(queries.query_checkloginusername(req));
    if (rows1.length === 1) {
      const [rows2] = await db.query(queries.query_getuserrights(rows1[0].Id));
      if (rows2 && rows2.length === 1)
        rows1[0].rights = JSON.parse(rows2[0].Rights);
      return rows1;
    }
  } catch (error) {
    next(error);
  }
}
async function changePassword(req, res, next) {
  var password = req.body.password;
  if (password && password.length > 0) {
    var saltRounds = bcryptNodejs.genSaltSync(1);
    bcryptNodejs.hash(password, saltRounds, null, async function (err, hash) {
      if (err)
        res.status(201).json('Failed to create hash');
      else {
        const [rows] = await db.query(queries.query_changepassword(req, hash));
        if (rows && rows.affectedRows === 1)
          res.status(200).json({ success: true });
        else
          res.status(200).json({ success: false });
      }
    })
  }
}


async function checkPassword(user, password, req, res, next) {

  if (password && password.length > 0) {
    bcryptNodejs.compare(password, user[0].Password, async function (err, res1) {
      if (err) {
        ret.success = false;
        ret.message = 'Έγινε κάποιο σφάλμα κατά την επιβεβαίωση των στοιχείων';
        res.status(200).json(ret);
      }
      else if (res1 === false) {
        ret.success = false;
        ret.message = 'O παλιός κωδικός δεν είναι σωστός!';
        res.status(200).json(ret);
      } else
        changePassword(req, res, next);
    })
  }
}

module.exports = {
  getUsers,
  addUser,
  editUser,
  getUser,
  deleteItem,
  checkLoginUserName,
  changePassword,
  checkPassword
}